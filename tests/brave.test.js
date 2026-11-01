import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkServerIdentity } from 'node:tls';
import { createBraveAdapter, sourceUrl } from '../src/brave.js';
import { LIMITS } from '../src/research.js';
import { URL, TEXT, httpFixture } from './research-support.js';
const TOKEN = 'synthetic-search-token';
const OPTIONS = { limits: LIMITS };
const hit = (url = URL) => ({ url, title: 'Transient title', description: 'Transient snippet' });
const json = (results = [hit()]) => new Response(JSON.stringify({ web: { results } }), { headers: { 'content-type': 'application/json' } });
const factory = (http, extra = {}) => createBraveAdapter({ token: TOKEN, fetchImpl: async () => json(), lookup: http.lookup, request: http.request, ...extra });
async function fetched(http, extra = {}, options = OPTIONS) {
  const a = factory(http, extra); await a.search('W3C accessibility', options); return a.fetch(URL, options);
}
const safe = code => error => { assert.equal(error.message, code); assert.doesNotMatch(error.stack, /synthetic-search-token|private-marker/); return true; };

test('generalized Brave query and pinned HTTPS source use separate headers and no proxy/pool/redirect/retry', async () => {
  const http = httpFixture(), calls = [];
  const a = factory(http, { fetchImpl: async (url, init) => { calls.push({ url, init }); return json(); } });
  assert.deepEqual(await a.search('W3C accessibility', OPTIONS), [{ url: URL, title: 'Transient title', snippet: 'Transient snippet' }]);
  const page = await a.fetch(URL, OPTIONS);
  const requested = new globalThis.URL(calls[0].url);
  assert.equal(requested.origin + requested.pathname, 'https://api.search.brave.com/res/v1/web/search');
  assert.deepEqual([...requested.searchParams], [['q', 'W3C accessibility'], ['count', '3']]);
  assert.deepEqual(calls[0].init.headers, { Accept: 'application/json', 'X-Subscription-Token': TOKEN });
  assert.equal(calls[0].init.redirect, 'manual'); assert.equal(calls[0].init.credentials, 'omit'); assert.equal(calls[0].init.method, 'GET');
  const direct = http.calls[0];
  assert.equal(direct.url, URL); assert.deepEqual(direct.options.headers, { Accept: 'text/html, text/plain' });
  assert.equal(direct.options.agent, false); assert.equal(direct.options.autoSelectFamily, false);
  assert.equal(direct.options.rejectUnauthorized, true); assert.equal(direct.options.checkServerIdentity, checkServerIdentity);
  assert.equal(direct.options.servername, 'www.w3.org');
  let pinned;
  direct.options.lookup('www.w3.org', {}, (_error, address, family) => { pinned = { address, family }; });
  assert.deepEqual(pinned, { address: '93.184.215.14', family: 4 });
  assert.equal(http.dns.length, 1); assert.equal(http.calls.length, 1);
  assert.equal(page.text, TEXT); assert.match(page.rawPrefixSha256, /^[a-f0-9]{64}$/); assert(!Number.isNaN(Date.parse(page.accessedAt)));
  assert.doesNotMatch(JSON.stringify(page), /synthetic-search-token|Transient/);
});

test('Brave accepts 75 whitespace-delimited words but rejects 76 before transport, retaining the 180-character cap', async () => {
  for (const separator of [' ', '\t', '\n', '\u2003']) {
    const http = httpFixture(), calls = [];
    const a = factory(http, { fetchImpl: async url => { calls.push(url); return json([]); } });
    const query = words => ` ${Array(words).fill('a').join(separator)} `;
    assert(query(76).length <= 180);
    assert.deepEqual(await a.search(query(75), OPTIONS), []);
    assert.equal(new globalThis.URL(calls[0]).searchParams.get('q'), query(75));
    await assert.rejects(() => a.search(query(76), OPTIONS), safe('invalid_query'));
    await assert.rejects(() => a.search('a'.repeat(181), OPTIONS), safe('invalid_query'));
    assert.equal(calls.length, 1);
    assert.deepEqual(await a.search('a'.repeat(180), OPTIONS), []);
    assert.equal(calls.length, 2); assert.equal(http.calls.length, 0); assert.equal(http.dns.length, 0);
  }
});

test('documented null web yields no results and registers no source', async () => {
  const http = httpFixture(); let calls = 0;
  const a = factory(http, { fetchImpl: async () => { calls++; return new Response('{"web":null}', { headers: { 'content-type': 'application/json' } }); } });
  assert.deepEqual(await a.search('synthetic null web', OPTIONS), []);
  await assert.rejects(() => a.fetch(URL, OPTIONS), safe('source_not_searched'));
  assert.equal(calls, 1); assert.equal(http.calls.length, 0); assert.equal(http.dns.length, 0);
});

test('documented null description becomes an empty transient snippet, with ordinary string and unsafe URL controls', async () => {
  for (const description of [null, '', 'Synthetic snippet']) {
    const http = httpFixture();
    const a = factory(http, { fetchImpl: async () => json([{ ...hit(), description }, { ...hit('https://127.0.0.1/'), description }]) });
    assert.deepEqual(await a.search('synthetic nullable description', OPTIONS), [{ url: URL, title: 'Transient title', snippet: description ?? '' }]);
    await assert.rejects(() => a.fetch('https://127.0.0.1/', OPTIONS), safe('source_out_of_scope'));
    assert.equal(http.calls.length, 0); assert.equal(http.dns.length, 0);
    assert.equal((await a.fetch(URL, OPTIONS)).text, TEXT);
  }
});

test('nullable fields do not admit missing or malformed required fields or register earlier valid hits', async () => {
  const invalidItems = [null, [], {}];
  for (const field of ['url', 'title', 'description']) {
    const omitted = { ...hit() }; delete omitted[field]; invalidItems.push(omitted);
    for (const value of [false, 0, {}, [], ...(field === 'description' ? [] : [null])]) invalidItems.push({ ...hit(), [field]: value });
  }
  const invalid = [null, false, 0, '', [], {}, ...[false, 0, '', []].map(web => ({ web })),
    { web: {} }, ...[null, false, 0, '', {}].map(results => ({ web: { results } })),
    ...invalidItems.map(item => ({ web: { results: [hit(), item] } }))];
  for (const data of invalid) {
    const http = httpFixture(); let calls = 0;
    const a = factory(http, { fetchImpl: async () => { calls++; return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } }); } });
    await assert.rejects(() => a.search('synthetic malformed response', OPTIONS), safe('search_response_invalid'));
    await assert.rejects(() => a.fetch(URL, OPTIONS), safe('source_not_searched'));
    assert.equal(calls, 1); assert.equal(http.calls.length, 0); assert.equal(http.dns.length, 0);
  }
});

test('only exact successfully searched canonical public HTTPS sources may be fetched', async () => {
  const http = httpFixture(), a = factory(http);
  await assert.rejects(() => a.fetch(URL, OPTIONS), /source_not_searched/);
  for (const url of [
    'http://www.w3.org/', 'https://user@www.w3.org/', 'https://www.w3.org:444/', 'https://www.w3.org:443/',
    `${URL}?q=secret`, `${URL}#fragment`, 'file:///etc/passwd', 'https://localhost/', 'https://host.internal/',
    'https://127.0.0.1/', 'https://2130706433/', 'https://0177.0.0.1/', 'https://0x7f000001/', 'https://[::1]/',
    'https://[::ffff:7f00:1]/', 'https://api.search.brave.com/res/v1/web/search', 'https://WWW.W3.ORG/',
    'https://www.w3.org./', ' https://www.w3.org/', 'https://www.w3.org/a/../b',
  ]) assert.throws(() => sourceUrl(url), /source_out_of_scope/);
  await a.search('W3C', OPTIONS);
  await assert.rejects(() => a.fetch(`${URL}other`, OPTIONS), /source_not_searched/);
  assert.equal(http.calls.length, 0); assert.equal(http.dns.length, 0);
});

test('all private/special/mapped IPv4/IPv6 and mixed DNS answers fail before connecting', async () => {
  const bad = ['0.1.2.3', '10.0.0.1', '100.64.0.1', '127.0.0.1', '169.254.169.254', '172.16.0.1', '192.0.0.9',
    '192.0.2.1', '192.31.196.1', '192.52.193.1', '192.88.99.1', '192.168.1.1', '192.175.48.1', '198.18.0.1',
    '198.51.100.1', '203.0.113.1', '224.0.0.1', '240.0.0.1', '255.255.255.255',
    '::', '::1', 'fc00::1', 'fe80::1', 'ff02::1', '::ffff:8.8.8.8', '::ffff:127.0.0.1', '64:ff9b::808:808',
    '2001::1', '2001:20::1', '2001:db8::1', '2002:0808:0808::1', '3fff::1', '2620:4f:8000::1'];
  for (const address of bad) {
    const family = address.includes(':') ? 6 : 4;
    for (const mixed of [false, true]) {
      const http = httpFixture({ answers: [...(mixed ? [{ address: '8.8.8.8', family: 4 }] : []), { address, family }] });
      await assert.rejects(() => fetched(http), safe('source_address_or_fetch_failed')); assert.equal(http.calls.length, 0);
    }
  }
  for (const answers of [[], [{ address: 'garbage', family: 4 }], [{ address: '8.8.8.8', family: 6 }], Array(33).fill({ address: '8.8.8.8', family: 4 })]) {
    const http = httpFixture({ answers }); await assert.rejects(() => fetched(http), /source_address_or_fetch_failed/); assert.equal(http.calls.length, 0);
  }
});

test('public IPv4/IPv6 pin bypasses any second DNS lookup while TLS retains original hostname', async () => {
  for (const address of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111', '2001:4860:4860::8888']) {
    const family = address.includes(':') ? 6 : 4;
    const http = httpFixture({ answers: [{ address, family }] });
    await fetched(http);
    let pinned;
    http.calls[0].options.lookup('would-rebind-to-private', { all: true }, (_error, values) => { pinned = values; });
    assert.deepEqual(pinned, [{ address, family }]); assert.equal(http.dns.length, 1);
    assert.equal(http.calls[0].options.servername, 'www.w3.org');
  }
});

test('abort bounds DNS/connect/body, ignores late DNS answers, and destroys hanging source requests', async () => {
  let release;
  const dns = httpFixture();
  const a = factory(dns, { lookup: (_h, _o, cb) => { release = cb; } });
  await a.search('W3C', OPTIONS);
  const cancelled = new AbortController();
  const pending = a.fetch(URL, { ...OPTIONS, signal: cancelled.signal });
  cancelled.abort(); await assert.rejects(() => pending, /remote_fetch_failed/);
  release(null, [{ address: '8.8.8.8', family: 4 }]);
  await new Promise(resolve => setImmediate(resolve)); assert.equal(dns.calls.length, 0);
  const stalled = httpFixture({ stalled: true });
  const b = factory(stalled); await b.search('W3C', OPTIONS);
  const abort = new AbortController(); const connecting = b.fetch(URL, { ...OPTIONS, signal: abort.signal });
  await new Promise(resolve => setImmediate(resolve)); abort.abort();
  await assert.rejects(() => connecting, /remote_fetch_failed/); assert(stalled.destroyed > 0);
});

test('strict source status/media/redirect refusal never consumes a refused body or retries', async () => {
  for (const [status, type] of [[201, 'text/plain'], [206, 'text/plain'], [302, 'text/html'], [429, 'text/plain'], [200, 'application/json'], [200, 'text/htmlish']]) {
    const http = httpFixture({ status, type, body: 'private-marker' });
    await assert.rejects(() => fetched(http), safe('source_address_or_fetch_failed'));
    assert.equal(http.calls.length, 1); assert(http.destroyed > 0);
  }
});

test('visible HTML extraction, later passage selection and bounded raw/text truncation are explicit', async () => {
  const html = '<html><head><title>W3C &amp; fixture</title><script>hidden secrets</script></head><body><div>' + 'preamble '.repeat(900) +
    '</div><p>' + TEXT + '</p><div hidden>hidden fake</div><template>hidden template</template><style>hidden CSS</style></body></html>';
  const http = httpFixture({ body: html, type: 'text/html' });
  const a = factory(http); await a.search('W3C', OPTIONS);
  const page = await a.fetch(URL, { ...OPTIONS, contains: 'people with disabilities' });
  assert(page.offset > 2400); assert(page.text.includes('people with disabilities')); assert(page.text.length <= 2400);
  assert.equal(page.title, 'W3C & fixture'); assert.doesNotMatch(page.text, /hidden|<p>/);
  const capped = await fetched(httpFixture({ body: 'x'.repeat(1000) }), {}, { limits: { ...LIMITS, sourceResponseBytes: 100, sourceTextChars: 20 } });
  assert.equal(capped.rawTruncated, true); assert.equal(capped.truncated, true); assert.equal(capped.text.length, 20); assert.equal(capped.nextOffset, 20);
  const missing = factory(httpFixture()); await missing.search('W3C', OPTIONS);
  for (const selection of [{ contains: 'not-found' }, { offset: 50000 }, { offset: -1 }, { contains: 'use', offset: 1 }])
    await assert.rejects(() => missing.fetch(URL, { ...OPTIONS, ...selection }), /source_passage_not_found|invalid_passage_selection/);
});

test('source selection matches case-sensitive normalized text, refusing mismatches and beyond-text offsets without fallback', async () => {
  // Original synthetic HTML, not a retained live response or search snippet.
  const body = '<html><body><p>Atlas\t  Lantern\nMarker</p><p>Original synthetic ending.</p></body></html>';
  const normalized = 'Atlas Lantern Marker Original synthetic ending.';
  const http = httpFixture({ body, type: 'text/html' });
  const a = factory(http); await a.search('synthetic source selection', OPTIONS);
  assert.equal((await a.fetch(URL, { ...OPTIONS, offset: 0 })).text, normalized);
  assert.equal(http.calls.length, 1);
  assert((await a.fetch(URL, { ...OPTIONS, contains: 'Lantern Marker' })).text.includes('Lantern Marker'));
  assert.equal(http.calls.length, 2);
  for (const selection of [{ contains: 'lantern Marker' }, { contains: 'Lantern\nMarker' }, { offset: normalized.length }, { offset: normalized.length + 1 }]) {
    const before = http.calls.length;
    await assert.rejects(() => a.fetch(URL, { ...OPTIONS, ...selection }), safe('source_passage_not_found'));
    assert.equal(http.calls.length, before + 1); assert.equal(http.dns.length, before + 1);
  }
});

test('a bounded source prefix excludes a later target even when that target exists in the original synthetic body', async () => {
  const target = 'Later Synthetic Target', body = 'Prelude '.repeat(20) + target;
  const http = httpFixture({ body }), a = factory(http);
  await a.search('synthetic prefix selection', OPTIONS);
  const capped = { limits: { ...LIMITS, sourceResponseBytes: 100, sourceTextChars: 40 } };
  const first = await a.fetch(URL, { ...capped, offset: 0 });
  assert.equal(first.rawTruncated, true); assert.equal(first.truncated, true); assert.equal(first.nextOffset, 40);
  assert(!first.text.includes(target)); assert.equal(http.calls.length, 1);
  await assert.rejects(() => a.fetch(URL, { ...capped, contains: target }), safe('source_passage_not_found'));
  assert.equal(http.calls.length, 2); assert.equal(http.dns.length, 2);
  assert((await a.fetch(URL, { ...OPTIONS, contains: target })).text.includes(target));
  assert.equal(http.calls.length, 3); // Explicit uncapped control, never an automatic retry.
});

test('offset zero followed by the returned nextOffset reaches a target within the source cap', async () => {
  const target = 'Synthetic window target', body = 'a'.repeat(40) + target + ' ending';
  const http = httpFixture({ body }), a = factory(http);
  await a.search('synthetic continuation', OPTIONS);
  const options = { limits: { ...LIMITS, sourceResponseBytes: 100, sourceTextChars: 40 } };
  const first = await a.fetch(URL, { ...options, offset: 0 });
  assert.equal(first.text, 'a'.repeat(40)); assert.equal(first.offset, 0); assert.equal(first.nextOffset, 40);
  assert.equal(first.rawTruncated, false); assert.equal(first.truncated, true); assert.equal(http.calls.length, 1);
  const next = await a.fetch(URL, { ...options, offset: first.nextOffset });
  assert.equal(next.offset, first.nextOffset); assert(next.text.includes(target));
  assert.equal(next.nextOffset, undefined); assert.equal(next.truncated, false);
  assert.equal(http.calls.length, 2); assert.equal(http.dns.length, 2);
});

test('adversarial HTML lexer remains linear and timers stay serviceable', async t => {
  for (const body of ['<a' + '-a'.repeat(22000), '<div title="' + '<'.repeat(50000), '<script>' + 'x'.repeat(50000),
    '<template><div></span>must not expose</div></template>']) {
    const before = performance.now();
    await assert.rejects(() => fetched(httpFixture({ body, type: 'text/html' })), /unsupported_source_type/);
    assert(performance.now() - before < 1500);
  }
  let fired = false;
  await new Promise(resolve => setTimeout(() => { fired = true; resolve(); }, 5)); assert(fired);
  t.diagnostic('bounded synthetic malformed HTML refused; no real network');
});

test('reflected host search credentials never become tool output or source evidence', async () => {
  const a = createBraveAdapter({ token: TOKEN, fetchImpl: async () => json([{ ...hit(), description: TOKEN }]) });
  await assert.rejects(() => a.search('W3C', OPTIONS), safe('search_response_invalid'));
  const http = httpFixture({ body: `Public page ${TOKEN}` });
  await assert.rejects(() => fetched(http), safe('tool_invalid_output'));
});

test('raw and JSON-decoded reflected tokens in every returned hit field are refused before clipping, filtering or source registration', async () => {
  const escaped = [...TOKEN].map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`).join('');
  for (const field of ['url', 'title', 'description']) {
    const tainted = { ...hit(), description: null, [field]: field === 'url' ? `${URL}${TOKEN}` : 'x'.repeat(field === 'title' ? 120 : 180) + TOKEN };
    for (const results of [[hit(), tainted], [hit(), hit(`${URL}two`), hit(`${URL}three`), tainted],
      [hit(), { ...tainted, url: field === 'url' ? `https://127.0.0.1/${TOKEN}` : 'https://127.0.0.1/' }]]) {
      for (const decoded of [false, true]) {
        const http = httpFixture(); let calls = 0;
        const raw = JSON.stringify({ web: { results } });
        const body = decoded ? raw.replaceAll(TOKEN, escaped) : raw;
        assert.equal(body.includes(TOKEN), !decoded);
        const a = factory(http, { fetchImpl: async () => { calls++; return new Response(body, { headers: { 'content-type': 'application/json' } }); } });
        await assert.rejects(() => a.search('synthetic reflection control', OPTIONS), safe('search_response_invalid'));
        await assert.rejects(() => a.fetch(URL, OPTIONS), safe('source_not_searched'));
        assert.equal(calls, 1); assert.equal(http.calls.length, 0); assert.equal(http.dns.length, 0);
      }
    }
  }
  // A null web section must not bypass the existing whole-body reflection check.
  const a = createBraveAdapter({ token: TOKEN, fetchImpl: async () => new Response(JSON.stringify({ web: null, marker: TOKEN }), { headers: { 'content-type': 'application/json' } }) });
  await assert.rejects(() => a.search('synthetic null reflection', OPTIONS), safe('search_response_invalid'));
});

test('Brave complete JSON byte cap, strict schema and safe empty results', async () => {
  for (const bytes of [65535, 65536, 65537]) {
    const base = JSON.stringify({ web: { results: [hit()] } });
    const body = base + ' '.repeat(bytes - Buffer.byteLength(base));
    let cancelled = 0;
    const a = createBraveAdapter({ token: TOKEN, fetchImpl: async () => new Response(new ReadableStream({ start(c) {
      c.enqueue(Buffer.from(body)); if (bytes < LIMITS.searchResponseBytes) c.close();
    }, cancel() { cancelled++; } }), { headers: { 'content-type': 'application/json' } }) });
    if (bytes < LIMITS.searchResponseBytes) assert.equal((await a.search('W3C', OPTIONS)).length, 1);
    else { await assert.rejects(() => a.search('W3C', OPTIONS), /search_response_over_limit/); assert.equal(cancelled, 1); }
  }
  for (const body of ['null', '{}', '[]', '{"web":{"results":{}}}', '{"private-marker":',
    JSON.stringify({ web: { results: [null] } }), JSON.stringify({ web: { results: [{ url: URL }] } })]) {
    const a = createBraveAdapter({ token: TOKEN, fetchImpl: async () => new Response(body, { headers: { 'content-type': 'application/json' } }) });
    await assert.rejects(() => a.search('private-marker', OPTIONS), safe('search_response_invalid'));
  }
  for (const results of [[], [hit('https://127.0.0.1/')]]) {
    const a = createBraveAdapter({ token: TOKEN, fetchImpl: async () => json(results) }); assert.deepEqual(await a.search('W3C', OPTIONS), []);
  }
});

test('Brave refuses non200/redirect/media before body access; cleanup failures never echo or hang', async () => {
  for (const [status, redirected, type, code] of [[302, false, 'application/json', 'remote_fetch_failed'], [429, false, 'application/json', 'remote_fetch_failed'],
    [200, true, 'application/json', 'remote_fetch_failed'], [200, false, 'text/html', 'unsupported_search_type']]) {
    let reads = 0, cancelled = 0, calls = 0;
    const a = createBraveAdapter({ token: TOKEN, fetchImpl: async () => { calls++; return { status, redirected, headers: new Headers({ 'content-type': type }),
      body: { getReader() { reads++; throw new Error('private-marker'); }, cancel() { cancelled++; throw new Error(TOKEN); } } }; } });
    await assert.rejects(() => a.search('private-marker', OPTIONS), safe(code)); assert.equal(calls, 1); assert.equal(reads, 0); assert.equal(cancelled, 1);
  }
});

test('Brave abort/timeout cancels pending reads including uncooperative fetch/cancel, and redacts exceptions', async () => {
  let cancelled = 0;
  const a = createBraveAdapter({ token: TOKEN, fetchImpl: async () => new Response(new ReadableStream({ start() {}, cancel() { cancelled++; return new Promise(() => {}); } }),
    { headers: { 'content-type': 'application/json' } }) });
  const abort = new AbortController();
  const pending = a.search('private-marker', { ...OPTIONS, signal: abort.signal });
  await new Promise(resolve => setImmediate(resolve)); abort.abort(new Error(TOKEN));
  await assert.rejects(() => pending, safe('remote_fetch_failed')); assert.equal(cancelled, 1);
  const b = createBraveAdapter({ token: TOKEN, fetchImpl: async () => { throw new Error(`${TOKEN} private-marker`); } });
  await assert.rejects(() => b.search('private-marker', OPTIONS), safe('remote_fetch_failed'));
});
