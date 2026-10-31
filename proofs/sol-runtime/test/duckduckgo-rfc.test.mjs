import test from 'node:test';
import assert from 'node:assert/strict';
import { createDuckDuckGoRfcAdapter } from '../src/duckduckgo-rfc.mjs';
import { LIMITS } from '../src/research.mjs';

globalThis.fetch = () => { throw new Error('OFFLINE NETWORK FORBIDDEN'); };
const RFC = 'https://www.rfc-editor.org/rfc/rfc2606.html';
const ENDPOINT = 'https://lite.duckduckgo.com/lite/';
// Synthetic bounded documents, NOT a captured full live page. Anchor/wrapper shape is
// from the parent's approved Lite probe; document/empty/error cases are controlled fixtures.
const page = (markup) => `<!DOCTYPE html><html><head><title>RFC 2606 at DuckDuckGo</title></head><body>
<form action="/lite/" method="post"><input name="q" value="RFC 2606"></form>
<table>${markup}</table></body></html>`;
const link = (href, title = 'RFC Editor') => `<tr><td><a rel="nofollow" href="${href}" class='result-link'>${title}</a></td></tr>`;
const wrapper = '//duckduckgo.com/l/?uddg=https%3A%2F%2Fwww.rfc%2Deditor.org%2Frfc%2Frfc2606.html&amp;rut=83280027d2bb775120ba70f3c0c3178ff731f3b492cc29d22940dcf4fef6a7ce';
const html = (body, init = {}) => new Response(body, { headers: { 'content-type': 'text/html; charset=UTF-8' }, ...init });

test('Lite searches once without auth and locally unwraps actual result anchors, not other links', async () => {
  const calls = [];
  const a = createDuckDuckGoRfcAdapter({ fetchImpl: async (url, init) => {
    calls.push({ url, init });
    return html(page(`<a href="${RFC}">Not a result</a>` +
      link('https://www.rfc-editor.org/info/rfc2606/', 'Out of fetch scope') +
      link(wrapper, 'RFC &amp; <b>Editor</b> &#x32;&#54;&#48;&#54; &quot;names&quot;') +
      '<tr><td class="result-snippet">A lead, not an inspected source.</td></tr>'));
  } });
  const signal = new AbortController().signal;
  const found = await a.search('reserved example domains', { signal, limits: LIMITS });
  assert.deepEqual(found, [{ url: RFC, title: 'RFC & Editor 2606 "names"', snippet: '' }]);
  assert.equal(calls.length, 1);
  const requested = new URL(calls[0].url);
  assert.equal(requested.origin + requested.pathname, ENDPOINT);
  assert.equal(requested.searchParams.get('q'), 'site:rfc-editor.org reserved example domains');
  assert.deepEqual([...requested.searchParams.keys()], ['q']);
  assert.deepEqual(calls[0].init.headers, { Accept: 'text/html' });
  assert.equal(calls[0].init.method, 'GET'); assert.equal(calls[0].init.redirect, 'manual');
  assert.equal(calls[0].init.credentials, 'omit'); assert.equal(calls[0].init.signal, signal);
  assert.doesNotMatch(JSON.stringify(found), /<a|result-link|result-snippet|uddg=|synthetic/);
});

test('approved 64 KiB search raw cap accepts complete bounded HTML but rejects at/above cap without partial hits', async () => {
  assert.equal(LIMITS.searchResponseBytes, 65_536);
  assert.equal(LIMITS.sourceResponseBytes, 65_536);
  const base = page(link(wrapper, 'RFC é'));
  for (const bytes of [23_933, 65_535, 65_536, 65_537]) {
    const body = base.replace('</body>', ' '.repeat(bytes - Buffer.byteLength(base)) + '</body>');
    assert.equal(Buffer.byteLength(body), bytes);
    let calls = 0;
    let cancelled = false;
    const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => {
      calls++;
      return html(new ReadableStream({
        start(controller) { controller.enqueue(Buffer.from(body)); if (bytes < 65_536) controller.close(); },
        cancel() { cancelled = true; },
      }));
    } });
    if (bytes < 65_536) assert.deepEqual(await a.search('RFC 2606', { limits: LIMITS }), [{ url: RFC, title: 'RFC é', snippet: '' }]);
    else await assert.rejects(() => a.search('RFC 2606', { limits: LIMITS }), /search_response_over_limit/);
    assert.equal(calls, 1);
    assert.equal(cancelled, bytes >= 65_536);
  }
  const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => html(base) });
  await assert.rejects(() => a.search('RFC 2606', { limits: { ...LIMITS, searchResponseBytes: 100 } }), /search_response_over_limit/);
});

test('direct and known absolute wrappers are leads with bounded actual titles and no fabricated snippets', async () => {
  const body = page(link(RFC, 'T'.repeat(140)) + link(wrapper.replace('//duckduckgo.com', 'https://duckduckgo.com')) +
    link('https://rfc-editor.org/rfc/rfc2606.txt', 'Text &apos;RFC&apos; &ndash; &#38; names') +
    link(RFC, 'Fourth hit is not returned'));
  const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => html(body) });
  const found = await a.search('RFC 2606', { limits: LIMITS });
  assert.equal(found.length, 3); assert.equal(found[0].title.length, 120);
  assert.deepEqual(found[2], { url: 'https://rfc-editor.org/rfc/rfc2606.txt', title: "Text 'RFC' – & names", snippet: '' });
  assert(found.every((hit) => hit.title.length <= 120 && hit.snippet === ''));
  assert.equal((await a.search('RFC 2606', { limits: { ...LIMITS, searchResults: 1 } })).length, 1);
});

test('all result destinations pass the unchanged RFC allowlist, including locally decoded wrappers', async () => {
  const rejected = [
    'http://www.rfc-editor.org/rfc/rfc2606.html', 'https://www.rfc-editor.org/info/rfc2606/',
    'https://www.rfc-editor.org/rfc/rfc2606.json', 'https://www.rfc-editor.org/rfc/rfc9110.html',
    'https://errata.rfc-editor.org/eid7741/', 'https://www.rfc-editor.org.evil.test/rfc/rfc2606.html',
    'https://user:pass@www.rfc-editor.org/rfc/rfc2606.html', `${RFC}?x=1`, `${RFC}#section`,
    'https://www.rfc-editor.org:444/rfc/rfc2606.html', 'file:///etc/passwd', 'javascript:alert(1)',
    '//duckduckgo.com.evil.test/l/?uddg=' + encodeURIComponent(RFC),
    '//duckduckgo.com/l/?uddg=' + encodeURIComponent(RFC) + '&amp;uddg=' + encodeURIComponent(RFC),
    '//duckduckgo.com/l/?uddg=' + encodeURIComponent(RFC) + '&amp;other=1',
    '//duckduckgo.com/l/?uddg=' + encodeURIComponent(encodeURIComponent(RFC)),
    '//duckduckgo.com/l/?uddg=' + encodeURIComponent('https://evil.test/'),
    '//duckduckgo.com/not-a-wrapper/?uddg=' + encodeURIComponent(RFC),
  ];
  let calls = 0;
  const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => { calls++; return html(page(rejected.map((href) => link(href)).join(''))); } });
  assert.deepEqual(await a.search('RFC 2606', { limits: LIMITS }), []); // Recognized leads, none in the fetch scope.
  assert.equal(calls, 1); // No wrapper or rejected destination is requested.
});

test('recognized genuine empty results are distinct from unfamiliar, malformed or incomplete pages', async () => {
  for (const tag of ['td', 'div']) {
    const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => html(page(`<${tag} class="no-results"><h1>No results found for <strong>RFC</strong></h1></${tag}>`)) });
    assert.deepEqual(await a.search('RFC 2606', { limits: LIMITS }), []);
  }
  for (const body of [
    '', page('Maintenance'), page('<p>No results found for RFC 2606</p>'),
    page(`<a href="${RFC}">Ordinary link</a>`), page(link(RFC)).replace('</html>', ''),
    page(link(RFC)).replace('DuckDuckGo', 'Other site'), page(link(RFC)).replace('/lite/', '/html/'),
    page(`<a class="result-link" href="${RFC}">Missing anchor end`),
    page(`<a class="result-link">Missing href</a>`),
    page(`<a class="result-link" href="${RFC}" href="https://evil.test">Duplicate attribute</a>`),
    page(link(RFC) + '<td class="no-results">No results found for RFC</td>'),
    page(`<!-- ${link(RFC)} --><script>${link(RFC)}</script>`),
    page(`<input value="<a class='result-link' href='${RFC}'>Not an anchor</a>">`),
    page(`<textarea>${link(RFC)}</textarea>`),
    page('').replace('RFC 2606 at DuckDuckGo', `DuckDuckGo <a class='result-link' href='${RFC}'>Title text only</a>`),
    page(`<script>${link(RFC)}`),
  ]) {
    let calls = 0;
    const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => { calls++; return html(body); } });
    await assert.rejects(() => a.search('RFC 2606', { limits: LIMITS }), /search_(layout_unrecognized|response_invalid)/);
    assert.equal(calls, 1);
  }
});

test('challenge and login pages fail even with incidental valid result anchors; never solved or retried', async () => {
  for (const challenge of ['<script src="anomaly.js"></script>', '<form id="challenge-form"></form>',
    'Unfortunately, bots use DuckDuckGo too.', 'Verify you are human', 'CAPTCHA', '<input type="password">']) {
    let calls = 0;
    const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => { calls++; return html(page(link(RFC) + challenge)); } });
    await assert.rejects(() => a.search('RFC 2606', { limits: LIMITS }), /search_challenge/);
    assert.equal(calls, 1);
  }
});

test('search rejects redirects, partial/error status, invalid media type and network failures without retry/fallback', async () => {
  const responses = [
    ...[301, 302, 303, 307, 308, 206, 401, 429, 500].map((status) => () => html(page(link(RFC)), { status, headers: {
      'content-type': 'text/html', location: 'https://html.duckduckgo.com/html/',
    } })),
    ...['application/json', 'text/plain', 'application/text/html', 'text/html-evil', ''].map((type) => () =>
      new Response(page(link(RFC)), { headers: { 'content-type': type } })),
    () => new Response(null, { headers: { 'content-type': 'text/html' } }),
    () => { throw new Error('synthetic_network_failure'); },
    () => Object.defineProperty(html(page(link(RFC))), 'redirected', { value: true }),
  ];
  for (const response of responses) {
    let calls = 0;
    const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => { calls++; return response(); } });
    await assert.rejects(() => a.search('RFC 2606', { limits: LIMITS }));
    assert.equal(calls, 1);
  }
});

test('a rejected status cancels its response body without following the redirect', async () => {
  let cancelled = false;
  let calls = 0;
  const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => {
    calls++;
    return new Response(new ReadableStream({ cancel() { cancelled = true; } }), {
      status: 302, headers: { location: 'https://html.duckduckgo.com/html/' },
    });
  } });
  await assert.rejects(() => a.search('RFC 2606', { limits: LIMITS }), /remote_fetch_failed/);
  assert.equal(cancelled, true); assert.equal(calls, 1);
});

test('search does not replay Set-Cookie or acquire authentication between explicit calls', async () => {
  const calls = [];
  const a = createDuckDuckGoRfcAdapter({ fetchImpl: async (_url, init) => {
    calls.push(init);
    return new Response(page(link(RFC)), { headers: { 'content-type': 'text/html', 'set-cookie': 'fixture=not-auth' } });
  } });
  await a.search('RFC 2606', { limits: LIMITS });
  await a.search('RFC 2606', { limits: LIMITS });
  assert.equal(calls.length, 2);
  assert(calls.every((init) => init.credentials === 'omit' && JSON.stringify(init.headers) === '{"Accept":"text/html"}'));
});

test('invalid/oversized query and pre-abort do no HTTP work; an in-flight read receives cancellation', async () => {
  let calls = 0;
  const a = createDuckDuckGoRfcAdapter({ fetchImpl: async () => { calls++; return html(page(link(RFC))); } });
  for (const query of ['', ' ', 'x'.repeat(181), null, {}]) {
    await assert.rejects(() => a.search(query, { limits: LIMITS }), /invalid_query/);
  }
  const pre = new AbortController(); pre.abort();
  await assert.rejects(() => a.search('RFC 2606', { signal: pre.signal, limits: LIMITS }));
  assert.equal(calls, 0);
  const controller = new AbortController();
  let received;
  const pending = createDuckDuckGoRfcAdapter({ fetchImpl: async (_url, { signal }) => {
    calls++; received = signal;
    return html(new ReadableStream({ start(stream) {
      stream.enqueue(Buffer.from('<html>'));
      signal.addEventListener('abort', () => stream.error(new Error('fixture_abort')), { once: true });
      setTimeout(() => controller.abort(), 5);
    } }));
  } });
  await assert.rejects(() => pending.search('RFC 2606', { signal: controller.signal, limits: LIMITS }), /fixture_abort/);
  assert.equal(received, controller.signal); assert.equal(received.aborted, true); assert.equal(calls, 1);
});
