import { lookup as dnsLookup } from 'node:dns';
import { request as httpsRequest } from 'node:https';
import { isIP } from 'node:net';
import { checkServerIdentity } from 'node:tls';
import { createHash } from 'node:crypto';

const reject = code => { throw new Error(code); };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function publicAddress(address) {
  const family = isIP(address);
  if (family === 4) {
    const n = address.split('.').reduce((n, part) => (n << 8n) | BigInt(part), 0n);
    return ![
      ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
      ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
      ['192.31.196.0', 24], ['192.52.193.0', 24], ['192.88.99.0', 24], ['192.168.0.0', 16],
      ['192.175.48.0', 24], ['198.18.0.0', 15], ['198.51.100.0', 24], ['203.0.113.0', 24],
      ['224.0.0.0', 4], ['240.0.0.0', 4],
    ].some(([base, bits]) => {
      const b = base.split('.').reduce((n, p) => (n << 8n) | BigInt(p), 0n);
      return n >> BigInt(32 - bits) === b >> BigInt(32 - bits);
    });
  }
  if (family !== 6 || address.includes('%') || address.includes('.')) return false;
  // Only ordinary global unicast. Mapped IPv4, translation, local, multicast,
  // transition, documentation and special-use allocations are deliberately refused.
  const halves = address.toLowerCase().split('::').map(s => s ? s.split(':') : []);
  const words = halves.length === 1 ? halves[0] : [...halves[0], ...Array(8 - halves[0].length - halves[1].length).fill('0'), ...halves[1]];
  const n = words.reduce((n, word) => (n << 16n) | BigInt(`0x${word}`), 0n);
  return n >> 125n === 1n && ![
    [0x20010000000000000000000000000000n, 23], [0x20010db8000000000000000000000000n, 32],
    [0x20020000000000000000000000000000n, 16], [0x3fff0000000000000000000000000000n, 20],
    [0x2620004f800000000000000000000000n, 48],
  ].some(([base, bits]) => n >> BigInt(128 - bits) === base >> BigInt(128 - bits));
}

// Canonical, narrow public HTTPS only. DNS/address enforcement still happens at
// connection time: a public-looking hostname is NOT an SSRF defense by itself.
export function sourceUrl(input) {
  if (typeof input !== 'string' || input.length > 512 || !input.isWellFormed() || /[\s\x00-\x1f\\]/.test(input)) reject('source_out_of_scope');
  let url;
  try { url = new URL(input); } catch { reject('source_out_of_scope'); }
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (url.href !== input || url.protocol !== 'https:' || url.port || url.username || url.password || url.search || url.hash ||
      host === 'api.search.brave.com' || host.endsWith('.') ||
      (isIP(host) ? !publicAddress(host) : (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host) ||
        /\.(?:localhost|local|internal|home|onion|test|invalid|example)$/.test(host)))) reject('source_out_of_scope');
  return url.href;
}
function checkAbort(signal) { if (signal?.aborted) reject('remote_fetch_failed'); }
function boundedWait(promise, signal, cleanup = () => {}) {
  if (!signal) return promise;
  return new Promise((resolve, rejectPromise) => {
    const abort = () => { try { cleanup(); } catch { /* No external diagnostics. */ } rejectPromise(new Error('remote_fetch_failed')); };
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
    Promise.resolve(promise).then(resolve, rejectPromise).finally(() => signal.removeEventListener('abort', abort));
  });
}
function cancel(body) { try { void Promise.resolve(body?.cancel()).catch(() => {}); } catch { /* Best effort, never await a hostile cancel. */ } }

// Linear token scanning follows the proven proof lexer: no repeated suffix regex
// scans on malformed '<' / quotes / raw elements. This is not browser readability.
const RAW = new Set(['script', 'style', 'noscript', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes']);
const INERT = new Set(['template', 'svg', 'math', 'select', 'head']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const space = c => /^[\t\n\f\r ]$/.test(c ?? '');
const letter = c => /^[a-z]$/i.test(c ?? '');
const nameChar = c => /^[a-z\d:_-]$/i.test(c ?? '');
const invalidHtml = () => reject('unsupported_source_type');
function tagAt(body, start) {
  let i = start + 1;
  const end = body[i] === '/';
  if (end) i++;
  if (!letter(body[i])) invalidHtml();
  const begin = i;
  while (nameChar(body[i])) i++;
  const name = body.slice(begin, i).toLowerCase();
  const attrs = new Map();
  let carried = false;
  for (;;) {
    const before = i;
    while (space(body[i])) i++;
    const separated = i > before || carried;
    carried = false;
    if (body[i] === '>') return { name, attrs, end, next: i + 1 };
    if (!end && body[i] === '/' && body[i + 1] === '>') {
      if (!VOID.has(name)) invalidHtml();
      return { name, attrs, end, next: i + 2 };
    }
    if (end || !separated || i >= body.length) invalidHtml();
    const keyStart = i;
    while (i < body.length && !/[\t\n\f\r "'<>/=`]/.test(body[i])) i++;
    if (i === keyStart) invalidHtml();
    const key = body.slice(keyStart, i).toLowerCase();
    if (attrs.has(key)) invalidHtml();
    const keyEnd = i;
    while (space(body[i])) i++;
    carried = i > keyEnd;
    let value = '';
    if (body[i] === '=') {
      i++;
      while (space(body[i])) i++;
      const quote = body[i] === '"' || body[i] === "'" ? body[i++] : undefined;
      const valueStart = i;
      if (quote) {
        while (i < body.length && body[i] !== quote) i++;
        if (i === body.length) invalidHtml();
        value = body.slice(valueStart, i++);
      } else {
        while (i < body.length && !space(body[i]) && body[i] !== '>') {
          if (/["'=<>`]/.test(body[i])) invalidHtml();
          i++;
        }
        if (i === valueStart) invalidHtml();
        value = body.slice(valueStart, i);
      }
      carried = false;
    }
    attrs.set(key, value);
  }
}
function rawEnd(body, start, name) {
  const wordAt = (i, word) => body.slice(i, i + word.length).toLowerCase() === word &&
    (space(body[i + word.length]) || ['/', '>'].includes(body[i + word.length]));
  let state = 'data';
  for (let i = start; i < body.length; i++) {
    if (name === 'script') {
      if (state === 'data' && body.startsWith('<!--', i)) { state = 'escaped'; continue; }
      if (state !== 'data' && body.startsWith('-->', i)) { state = 'data'; i += 2; continue; }
      if (state === 'escaped' && body[i] === '<' && wordAt(i, '<script')) { state = 'double'; continue; }
    }
    if (body[i] === '<' && wordAt(i, `</${name}`)) {
      if (state === 'double') state = 'escaped';
      else return i;
    }
  }
  invalidHtml();
}
function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…' };
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (all, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? all;
    const hex = entity[1].toLowerCase() === 'x';
    const code = parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : ' ';
  });
}
function visibleHtml(body) {
  if (body.includes('\0')) invalidHtml();
  const parts = [], titles = [], stack = [];
  let i = 0, hidden = 0;
  while (i < body.length) {
    if (body.startsWith('<!--', i)) {
      const end = body.indexOf('-->', i + 4);
      if (end === -1) invalidHtml();
      i = end + 3;
    } else if (body.slice(i, i + 9).toLowerCase() === '<!doctype' && space(body[i + 9])) {
      let quote;
      for (i += 9; i < body.length; i++) {
        const c = body[i];
        if (quote) { if (c === quote) quote = undefined; }
        else if (c === '"' || c === "'") quote = c;
        else if (c === '>') break;
        else if (c === '<' || c === '[') invalidHtml();
      }
      if (i === body.length) invalidHtml();
      i++;
    } else if (body[i] === '<') {
      const tag = tagAt(body, i);
      i = tag.next;
      if (tag.end) {
        // Refuse ambiguous nesting rather than expose text from an inert tree.
        const frame = stack.pop();
        if (!frame || frame.name !== tag.name) invalidHtml();
        if (frame.hidden) hidden--;
      } else if (RAW.has(tag.name)) {
        const end = rawEnd(body, i, tag.name);
        if (tag.name === 'title') titles.push(body.slice(i, end));
        i = tagAt(body, end).next;
      } else {
        if (tag.name === 'plaintext') invalidHtml();
        const hide = INERT.has(tag.name) || tag.attrs.has('hidden') || tag.attrs.get('aria-hidden') === 'true' ||
          /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(tag.attrs.get('style') ?? '');
        if (!VOID.has(tag.name)) { stack.push({ name: tag.name, hidden: hide }); if (hide) hidden++; }
      }
      parts.push(' ');
    } else {
      const next = body.indexOf('<', i);
      const end = next === -1 ? body.length : next;
      if (!hidden) parts.push(body.slice(i, end));
      i = end;
    }
  }
  if (stack.some(frame => frame.hidden)) invalidHtml();
  return { text: decodeEntities(parts.join('')).replace(/\s+/g, ' ').trim(),
    title: decodeEntities(titles.join(' ')).replace(/\s+/g, ' ').trim() };
}

/** Concrete Brave search plus address-pinned direct HTTPS. Injection is the HTTP/
 * DNS/connect seam for synthetic tests, not a provider or proxy configuration. */
export function createBraveAdapter({ token, fetchImpl = globalThis.fetch, lookup = dnsLookup, request = httpsRequest } = {}) {
  if (typeof token !== 'string' || !token.trim()) reject('search_credential_required');
  if (![fetchImpl, lookup, request].every(fn => typeof fn === 'function')) reject('tool_unavailable');
  const searched = new Set(); // Transient, scoped to this investigation's adapter.
  async function searchRequest(url, signal, limit) {
    let response, reader;
    let code = 'remote_fetch_failed';
    try {
      checkAbort(signal);
      const receiving = Promise.resolve().then(() => fetchImpl(url, { method: 'GET', redirect: 'manual', credentials: 'omit', signal,
        headers: { Accept: 'application/json', 'X-Subscription-Token': token } }));
      void receiving.then(r => { if (signal.aborted) cancel(r.body); }, () => {});
      response = await boundedWait(receiving, signal);
      if (response.status !== 200 || response.redirected || !response.body) reject(code);
      if (!/^application\/json(?:;|$)/i.test(response.headers.get('content-type') ?? '')) { code = 'unsupported_search_type'; reject(code); }
      reader = response.body.getReader();
      const parts = [];
      let bytes = 0;
      for (;;) {
        const { done, value } = await boundedWait(reader.read(), signal, () => cancel(reader));
        checkAbort(signal);
        if (done) break;
        if (value.byteLength >= limit - bytes) { code = 'search_response_over_limit'; reject(code); }
        parts.push(value); bytes += value.byteLength;
      }
      try { return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(parts, bytes)); }
      catch { code = 'search_response_invalid'; reject(code); }
    } catch { cancel(reader ?? response?.body); reject(code); }
    finally { try { reader?.releaseLock(); } catch { /* Pending read cancellation is best effort. */ } }
  }
  async function pinnedSource(url, signal, limit) {
    checkAbort(signal);
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^\[|\]$/g, '');
    const answers = isIP(hostname) ? [{ address: hostname, family: isIP(hostname) }] : await boundedWait(new Promise((resolve, rejectPromise) => {
      lookup(hostname, { all: true, verbatim: true }, (error, addresses) => error ? rejectPromise(new Error('source_address_refused')) : resolve(addresses));
    }), signal);
    checkAbort(signal);
    if (!Array.isArray(answers) || !answers.length || answers.length > 32 ||
        answers.some(a => !a || !publicAddress(a.address) || a.family !== isIP(a.address))) reject('source_address_refused');
    const pinned = answers[0];
    return new Promise((resolve, rejectPromise) => {
      let req, response, settled = false;
      const cleanup = () => signal.removeEventListener('abort', abort);
      const fail = code => {
        if (settled) return;
        settled = true; cleanup();
        response?.destroy(); req?.destroy();
        rejectPromise(new Error(code));
      };
      const abort = () => fail('remote_fetch_failed');
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) { abort(); return; }
      try {
        req = request(url, { method: 'GET', agent: false, autoSelectFamily: false, family: pinned.family,
          rejectUnauthorized: true, checkServerIdentity,
          ...(isIP(hostname) ? {} : { servername: hostname }),
          lookup: (_host, options, callback) => callback(null, options.all ? [pinned] : pinned.address, pinned.family),
          headers: { Accept: 'text/html, text/plain' } }, incoming => {
          response = incoming;
          if (settled) { incoming.destroy(); return; }
          if (incoming.statusCode !== 200) { fail('remote_fetch_failed'); return; }
          const type = incoming.headers['content-type'] ?? '';
          if (!/^(text\/html|text\/plain)(?:;|$)/i.test(type)) { fail('unsupported_source_type'); return; }
          if (incoming.headers['content-encoding'] && incoming.headers['content-encoding'] !== 'identity') { fail('unsupported_source_type'); return; }
          const parts = [];
          let bytes = 0;
          const finish = truncated => {
            if (settled) return;
            settled = true; cleanup();
            resolve({ bytes: Buffer.concat(parts, bytes), truncated, type });
            if (truncated) { incoming.destroy(); req?.destroy(); }
          };
          incoming.on('data', chunk => {
            if (settled) return;
            const part = Buffer.from(chunk);
            const left = limit - bytes;
            parts.push(part.subarray(0, left)); bytes += Math.min(part.length, left);
            if (part.length >= left) finish(true);
          });
          incoming.on('end', () => finish(false));
          incoming.on('error', () => fail('remote_fetch_failed'));
          incoming.on('aborted', () => fail('remote_fetch_failed'));
          incoming.on('close', () => { if (!settled) fail('remote_fetch_failed'); });
        });
        req.on('error', () => fail('remote_fetch_failed'));
        req.end();
      } catch { fail('remote_fetch_failed'); }
    });
  }
  return {
    async search(query, { signal, limits }) {
      if (typeof query !== 'string' || !query.trim() || !query.isWellFormed() || query.length > 180) reject('invalid_query');
      const operation = AbortSignal.any([signal ?? new AbortController().signal, AbortSignal.timeout(limits.toolTimeoutMs)]);
      const url = new URL('https://api.search.brave.com/res/v1/web/search');
      url.searchParams.set('q', query);
      url.searchParams.set('count', String(limits.searchResults));
      const body = await searchRequest(url.href, operation, limits.searchResponseBytes);
      if (body.includes(token)) reject('search_response_invalid'); // A reflected credential is never model context.
      let data;
      try { data = JSON.parse(body); } catch { reject('search_response_invalid'); }
      if (!Array.isArray(data?.web?.results)) reject('search_response_invalid');
      const found = [];
      for (const item of data.web.results) {
        if (!item || typeof item.url !== 'string' || typeof item.title !== 'string' || typeof item.description !== 'string') reject('search_response_invalid');
        let safe;
        try { safe = sourceUrl(item.url); } catch { continue; }
        if (found.length < limits.searchResults && !found.some(hit => hit.url === safe))
          found.push({ url: safe, title: item.title.slice(0, 120), snippet: item.description.slice(0, 180) });
      }
      checkAbort(operation);
      for (const hit of found) searched.add(hit.url);
      return found;
    },
    async fetch(input, { signal, limits, offset = 0, contains } = {}) {
      const url = sourceUrl(input);
      if (!searched.has(url)) reject('source_not_searched');
      if (!Number.isSafeInteger(offset) || offset < 0 || offset > limits.sourceResponseBytes ||
          (contains !== undefined && (typeof contains !== 'string' || !contains.trim() || !contains.isWellFormed() || contains.length > 80)) ||
          (contains !== undefined && offset !== 0)) reject('invalid_passage_selection');
      const operation = AbortSignal.any([signal ?? new AbortController().signal, AbortSignal.timeout(limits.toolTimeoutMs)]);
      let response;
      try { response = await pinnedSource(url, operation, limits.sourceResponseBytes); }
      catch { checkAbort(operation); reject('source_address_or_fetch_failed'); }
      checkAbort(operation);
      // Never invent replacement characters. At the raw cap only an unfinished
      // final UTF-8 sequence may be withheld; invalid interior bytes are refused.
      let body;
      try { body = new TextDecoder('utf-8', { fatal: true }).decode(response.bytes, { stream: response.truncated }); }
      catch { reject('unsupported_source_type'); }
      if (body.includes(token)) reject('tool_invalid_output');
      const extracted = /^text\/html/i.test(response.type) ? visibleHtml(body) : { text: body.replace(/\s+/g, ' ').trim(), title: url };
      const text = extracted.text;
      if (!text) reject('empty_source');
      if (contains !== undefined) {
        const index = text.indexOf(contains);
        if (index === -1) reject('source_passage_not_found');
        offset = Math.max(0, index - Math.min(240, Math.floor(limits.sourceTextChars / 4)));
      }
      if (offset >= text.length) reject('source_passage_not_found');
      if (offset && /[\udc00-\udfff]/u.test(text[offset])) reject('invalid_passage_selection');
      let end = Math.min(text.length, offset + limits.sourceTextChars);
      if (end < text.length && /[\ud800-\udbff]/u.test(text[end - 1])) end--;
      if (end === offset) reject('source_passage_not_found');
      checkAbort(operation);
      return { url, title: extracted.title.slice(0, 120) || url, text: text.slice(offset, end), offset,
        nextOffset: end < text.length ? end : undefined, rawTruncated: response.truncated,
        truncated: response.truncated || end < text.length, accessedAt: new Date().toISOString(),
        rawPrefixSha256: sha(response.bytes) };
    },
  };
}
