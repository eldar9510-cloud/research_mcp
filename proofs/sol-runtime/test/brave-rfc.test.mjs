import test from 'node:test';
import assert from 'node:assert/strict';
import { createBraveRfcAdapter } from '../src/brave-rfc.mjs';
import { createDuckDuckGoRfcAdapter } from '../src/duckduckgo-rfc.mjs';
import { makeLiveDependencies } from '../src/live-dependencies.mjs';
import { LIMITS, runInvestigation } from '../src/research.mjs';
import { ModelRuntime } from '@earendil-works/pi-coding-agent';

globalThis.fetch = () => { throw new Error('OFFLINE NETWORK FORBIDDEN'); };
const TOKEN = 'offline-fixture-token';
const RFC = 'https://www.rfc-editor.org/rfc/rfc2606.html';
const ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';
// Synthetic API-shaped data only: never a retained live Brave response.
const hit = (url = RFC, title = 'Synthetic RFC', description = 'Synthetic lead') => ({ url, title, description });
const body = (results = [hit()]) => JSON.stringify({ web: { results } });
const json = (value = body()) => new Response(value, { headers: { 'content-type': 'application/json; charset=utf-8' } });
const options = { limits: LIMITS };
const safeError = (code) => (error) => {
  assert.equal(error.message, code);
  assert.doesNotMatch(error.stack, /offline-fixture-token|private-query-marker|raw-private-marker/);
  return true;
};

test('Brave pins one GET, scoped bounded query and count; token goes only to search, never RFC', async () => {
  const calls = [];
  const signal = new AbortController().signal;
  const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async (url, init) => {
    calls.push({ url, init });
    return url.startsWith(ENDPOINT) ? json() : new Response('Synthetic RFC source', { headers: { 'content-type': 'text/plain' } });
  } });
  assert.deepEqual(await adapter.search('RFC 2606 examples', { ...options, signal }),
    [{ url: RFC, title: 'Synthetic RFC', snippet: 'Synthetic lead' }]);
  await adapter.fetch(RFC, { ...options, signal });
  const requested = new URL(calls[0].url);
  assert.equal(requested.origin + requested.pathname, ENDPOINT);
  assert.deepEqual([...requested.searchParams], [['q', 'site:rfc-editor.org RFC 2606 examples'], ['count', '3']]);
  assert.deepEqual(calls[0].init.headers, { Accept: 'application/json', 'X-Subscription-Token': TOKEN });
  assert.deepEqual(calls[1].init.headers, { Accept: 'text/html, text/plain' });
  for (const { init } of calls) {
    assert.equal(init.method, 'GET'); assert.equal(init.redirect, 'manual');
    assert.equal(init.credentials, 'omit'); assert.equal(init.signal, signal);
  }
  assert.equal(calls[1].url, RFC); assert.equal(calls.length, 2);
  assert.doesNotMatch(JSON.stringify(await adapter.fetch(RFC, options)), /offline-fixture-token/);
});

test('Brave bounded JSON accepts below 64 KiB and rejects at/above cap, cancelling without partial hits', async () => {
  for (const bytes of [65_535, 65_536, 65_537]) {
    const base = body([hit(RFC, 'é')]);
    const value = base + ' '.repeat(bytes - Buffer.byteLength(base));
    let cancelled = false;
    let calls = 0;
    const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async () => { calls++;
      return json(new ReadableStream({ start(controller) {
        controller.enqueue(Buffer.from(value)); if (bytes < LIMITS.searchResponseBytes) controller.close();
      }, cancel() { cancelled = true; } }));
    } });
    if (bytes < LIMITS.searchResponseBytes) assert.equal((await adapter.search('RFC', options)).length, 1);
    else await assert.rejects(() => adapter.search('RFC', options), safeError('search_response_over_limit'));
    assert.equal(cancelled, bytes >= LIMITS.searchResponseBytes); assert.equal(calls, 1);
  }
  const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async () => json() });
  await assert.rejects(() => adapter.search('RFC', { limits: { ...LIMITS, searchResponseBytes: 20 } }), safeError('search_response_over_limit'));
});

test('Brave rejects every non-200/redirect/refused type before reading, cancels body and never retries', async () => {
  for (const [status, redirected, contentType, code] of [
    [201, false, 'application/json', 'remote_fetch_failed'], [206, false, 'application/json', 'remote_fetch_failed'],
    [302, false, 'application/json', 'remote_fetch_failed'], [401, false, 'application/json', 'remote_fetch_failed'],
    [429, false, 'application/json', 'remote_fetch_failed'], [500, false, 'application/json', 'remote_fetch_failed'],
    [200, true, 'application/json', 'remote_fetch_failed'], [200, false, 'text/html', 'unsupported_search_type'],
    [200, false, 'text/application/json', 'unsupported_search_type'], [200, false, 'application/jsonp', 'unsupported_search_type'],
    [200, false, '', 'unsupported_search_type'],
  ]) {
    let cancelled = 0;
    let reads = 0;
    let calls = 0;
    const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async () => { calls++;
      return { status, redirected, headers: new Headers({ 'content-type': contentType, location: RFC }),
        body: { async cancel() { cancelled++; }, getReader() { reads++; throw new Error('raw-private-marker'); } } };
    } });
    await assert.rejects(() => adapter.search('private-query-marker', options), safeError(code));
    assert.equal(calls, 1); assert.equal(cancelled, 1); assert.equal(reads, 0);
  }
});

test('Brave malformed JSON/schema is a safe error; explicit empty or entirely filtered results are valid empty', async () => {
  for (const value of ['{"raw-private-marker":', 'null', '{}', '{"web":{}}', '{"web":{"results":{}}}', '[]']) {
    const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async () => json(value) });
    await assert.rejects(() => adapter.search('private-query-marker', options), safeError('search_response_invalid'));
  }
  for (const value of [body([]), body([hit('https://invalid.example/')])]) {
    const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async () => json(value) });
    assert.deepEqual(await adapter.search('RFC', options), []);
  }
});

test('Brave results retain only bounded leads through unchanged allowlist, capped at three or a lower limit', async () => {
  const rejected = ['http://www.rfc-editor.org/rfc/rfc2606.html', 'https://www.rfc-editor.org.evil.test/rfc/rfc2606.html',
    'https://user@www.rfc-editor.org/rfc/rfc2606.html', 'https://www.rfc-editor.org:444/rfc/rfc2606.html',
    'https://www.rfc-editor.org/rfc/rfc9110.html', RFC + '?q=x', RFC + '#x', 'file:///etc/passwd',
    'https://api.search.brave.com/res/v1/web/search', 'https://127.0.0.1/'];
  let calls = 0;
  const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async (_url, init) => { calls++;
    if (calls === 2) assert.equal(new URL(_url).searchParams.get('count'), '1');
    assert.equal(init.headers['X-Subscription-Token'], TOKEN);
    return json(body([...rejected.map((url) => hit(url)), null, {}, hit(RFC, 'T'.repeat(140), 'D'.repeat(200)),
      hit('https://rfc-editor.org/rfc/rfc2606.txt'), hit(RFC), hit(RFC)]));
  } });
  const results = await adapter.search('RFC', options);
  assert.equal(results.length, 3); assert.equal(results[0].title.length, 120); assert.equal(results[0].snippet.length, 180);
  assert.equal((await adapter.search('RFC', { limits: { ...LIMITS, searchResults: 1 } })).length, 1);
  await assert.rejects(() => adapter.fetch(rejected[0], options), /source_out_of_scope/);
  assert.equal(calls, 2);
});

test('Brave invalid query/pre-abort do no HTTP; request/read/cancel/abort exceptions never leak secrets', async () => {
  let calls = 0;
  const adapter = createBraveRfcAdapter({ token: TOKEN, fetchImpl: async () => { calls++; return json(); } });
  for (const query of ['', ' ', 'q'.repeat(181), null]) await assert.rejects(() => adapter.search(query, options), /invalid_query/);
  const controller = new AbortController(); controller.abort(new Error(TOKEN));
  await assert.rejects(() => adapter.search('RFC', { ...options, signal: controller.signal }), safeError('remote_fetch_failed'));
  assert.equal(calls, 0);
  for (const fetchImpl of [
    async () => { throw new Error(TOKEN + ' raw-private-marker'); },
    async () => json(new ReadableStream({ start(stream) { stream.error(new Error(TOKEN)); } })),
    async () => ({ status: 429, body: { cancel() { throw new Error(TOKEN); } } }),
    async (_url, { signal }) => json(new ReadableStream({ start(stream) {
      signal.addEventListener('abort', () => stream.error(new Error(TOKEN)), { once: true });
    } })),
  ]) {
    const abort = new AbortController(); let attempts = 0;
    const current = createBraveRfcAdapter({ token: TOKEN, fetchImpl: (...args) => { attempts++; return fetchImpl(...args); } });
    const promise = current.search('private-query-marker', { ...options, signal: abort.signal });
    const assertion = assert.rejects(() => promise, safeError('remote_fetch_failed'));
    abort.abort(new Error(TOKEN)); await assertion; assert.equal(attempts, 1);
  }
});

test('missing Brave key fails factory before any runtime/auth/model initialization', async (t) => {
  let runtimeInitializations = 0;
  t.mock.method(ModelRuntime, 'create', () => {
    runtimeInitializations++; throw new Error('OFFLINE RUNTIME INITIALIZATION FORBIDDEN');
  });
  for (const token of [undefined, null, '', ' ']) {
    assert.throws(() => createBraveRfcAdapter({ token }), /search_credential_required/);
    await assert.rejects(() => makeLiveDependencies({ braveSearchApiKey: token }), /search_credential_required/);
  }
  const result = await runInvestigation({ question: 'RFC 2606?', scope: 'RFC Editor only' }, {
    createDependencies: ({ signal }) => makeLiveDependencies({ signal, braveSearchApiKey: undefined }),
  });
  assert.equal(result.status, 'failed'); assert.equal(result.reason, 'setup_failed');
  assert.equal(result.modelCalls, 0); assert.equal(result.toolCalls, 0);
  assert.equal(runtimeInitializations, 0);
});

test('Brave source half remains behavior-identical to historical DDG for extraction, passage selection, caps and refusals', async () => {
  const html = '<title>Fixture &amp; RFC</title><script>hidden</script><p>' + 'preamble '.repeat(900) +
    'example.com, example.org and example.net for examples &amp; documentation.</p>';
  for (const [content, type, selection, limits, status] of [
    [html, 'text/html', { contains: 'example.com' }, LIMITS, 200],
    ['A '.repeat(2000), 'text/plain', { offset: 200 }, { ...LIMITS, sourceResponseBytes: 2000 }, 200],
    ['', 'text/plain', {}, LIMITS, 200], [html, 'application/json', {}, LIMITS, 200],
    [html, 'text/html', { contains: 'absent' }, LIMITS, 200], [html, 'text/html', { offset: -1 }, LIMITS, 200],
    [html, 'text/html', {}, LIMITS, 302],
  ]) {
    const traces = [];
    const makeFetch = () => async (url, init) => { traces.push({ url, init });
      return new Response(content, { status, headers: { 'content-type': type } }); };
    const brave = createBraveRfcAdapter({ token: TOKEN, fetchImpl: makeFetch() });
    const ddg = createDuckDuckGoRfcAdapter({ fetchImpl: makeFetch() });
    const outcomes = await Promise.allSettled([brave.fetch(RFC, { limits, ...selection }), ddg.fetch(RFC, { limits, ...selection })]);
    if (outcomes[0].status === 'fulfilled') assert.deepEqual(outcomes[0], outcomes[1]);
    else { assert.equal(outcomes[1].status, 'rejected'); assert.equal(outcomes[0].reason.message, outcomes[1].reason.message); }
    assert.equal(traces.length % 2, 0);
    if (traces.length) assert.deepEqual(traces[0], traces[1]);
  }
});
