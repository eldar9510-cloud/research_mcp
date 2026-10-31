import { sourceUrl } from './research.mjs';

const SEARCH_ENDPOINT = 'https://lite.duckduckgo.com/lite/';
const TAG_ATTRIBUTES = `(?:"[^"]*"|'[^']*'|[^'">])*`;

// A deliberately conservative recognizer for Lite's observed result-link layout,
// not a general HTML parser or a promise that the public site is a stable API.
function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”' };
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (_all, entity) => {
    if (entity[0] !== '#') {
      if (!Object.hasOwn(named, entity.toLowerCase())) throw new Error('search_response_invalid');
      return named[entity.toLowerCase()];
    }
    const hex = entity[1].toLowerCase() === 'x';
    const code = parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    if (code <= 0 || code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) throw new Error('search_response_invalid');
    return String.fromCodePoint(code);
  });
}
function attributes(text) {
  const found = new Map();
  let rest = text.trim();
  while (rest) {
    const match = /^([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?(?:\s+|$)/.exec(rest);
    if (!match || found.has(match[1].toLowerCase())) throw new Error('search_response_invalid');
    found.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? '');
    rest = rest.slice(match[0].length);
  }
  return found;
}
const hasClass = (attrs, name) => (attrs.get('class') ?? '').split(/\s+/).includes(name);
const textContent = (html) => decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
function destination(href) {
  const url = new URL(href.startsWith('//') ? `https:${href}` : href);
  if (url.origin === 'https://duckduckgo.com' && url.pathname === '/l/' &&
      !url.username && !url.password && !url.hash && url.searchParams.getAll('uddg').length === 1 &&
      url.searchParams.getAll('rut').length <= 1 && [...url.searchParams.keys()].every((key) => ['uddg', 'rut'].includes(key))) {
    return sourceUrl(url.searchParams.get('uddg')); // Decode once locally; NEVER fetch a wrapper.
  }
  return sourceUrl(href);
}
function searchResults(body, maximum) {
  if (/anomaly\.js|anomaly-modal|bots use duckduckgo|challenge-form|verify (?:that )?you are human|captcha|type\s*=\s*["']?password|<form\b[^>]*\/login/i.test(body)) {
    throw new Error('search_challenge');
  }
  const html = body.replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript|template|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const content = new RegExp(`<body\\b${TAG_ATTRIBUTES}>([\\s\\S]*)<\\/body>\\s*<\\/html>\\s*$`, 'i').exec(html)?.[1];
  if (!/<html\b/i.test(html) || !content || /<(script|style|noscript|template|textarea|title)\b/i.test(content) ||
      !/DuckDuckGo/i.test(/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? '')) throw new Error('search_layout_unrecognized');
  // Consume every body tag, including its quoted attributes, so markup echoed
  // inside an input value or the document title cannot masquerade as a result.
  const tags = [...content.matchAll(new RegExp(`<([a-z][\\w:-]*)\\b(${TAG_ATTRIBUTES})>`, 'gi'))];
  if (!tags.filter((match) => match[1].toLowerCase() === 'form').some((match) => {
    const action = attributes(match[2]).get('action');
    return action && new URL(decodeEntities(action), SEARCH_ENDPOINT).href === SEARCH_ENDPOINT;
  })) throw new Error('search_layout_unrecognized');
  let recognized = 0;
  const found = [];
  for (const match of tags) {
    if (match[1].toLowerCase() !== 'a') continue;
    const attrs = attributes(match[2]);
    if (!hasClass(attrs, 'result-link')) continue;
    recognized++;
    const close = /^((?:(?!<a\b)[\s\S])*?)<\/a\s*>/i.exec(content.slice(match.index + match[0].length));
    if (!close || !attrs.get('href')) throw new Error('search_response_invalid');
    let url;
    try { url = destination(decodeEntities(attrs.get('href'))); }
    catch { continue; } // Results outside the unchanged RFC 2606 allowlist are not leads.
    const title = textContent(close[1]);
    if (!title) throw new Error('search_response_invalid');
    if (found.length < maximum) found.push({ url, title: title.slice(0, 120), snippet: '' });
  }
  const empty = tags.filter((match) => /^(td|div)$/i.test(match[1])).some((match) => {
    if (!hasClass(attributes(match[2]), 'no-results')) return false;
    const close = new RegExp(`^([\\s\\S]*?)<\\/${match[1]}\\s*>`, 'i').exec(content.slice(match.index + match[0].length));
    if (!close) throw new Error('search_response_invalid');
    return /^No results found\b/i.test(textContent(close[1]));
  });
  if ((!recognized && !empty) || (recognized && empty)) throw new Error('search_layout_unrecognized');
  return found;
}

// One concrete keyless search endpoint + the unchanged direct RFC Editor fetch contract.
// Construction makes no requests; no cookie jar, auth bootstrap, fallback or retries.
export function createDuckDuckGoRfcAdapter({ fetchImpl = globalThis.fetch } = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('fetch_unavailable');

  async function request(url, { signal, limit, headers = {} }) {
    signal?.throwIfAborted();
    const response = await fetchImpl(url, { method: 'GET', headers, redirect: 'manual', credentials: 'omit', signal });
    if (response.status !== 200 || response.redirected || !response.body) {
      try { await response.body?.cancel(); } catch { /* Preserve the safe failure code. */ }
      throw new Error('remote_fetch_failed'); // No status body/secret echo.
    }
    const reader = response.body.getReader();
    const parts = [];
    let bytes = 0;
    let truncated = false;
    try {
      for (;;) {
        signal?.throwIfAborted();
        const { done, value } = await reader.read();
        if (done) break;
        const left = limit - bytes;
        parts.push(value.subarray(0, Math.max(0, left)));
        bytes += Math.min(value.byteLength, left);
        if (value.byteLength > left || bytes === limit) {
          truncated = true;
          await reader.cancel();
          break;
        }
      }
    } finally { reader.releaseLock(); }
    signal?.throwIfAborted();
    return { body: Buffer.concat(parts, bytes).toString('utf8'), truncated, contentType: response.headers.get('content-type') ?? '' };
  }

  return {
    async search(query, { signal, limits }) {
      if (typeof query !== 'string' || !query.trim() || query.length > 180) throw new Error('invalid_query');
      const url = new URL(SEARCH_ENDPOINT);
      url.searchParams.set('q', `site:rfc-editor.org ${query}`);
      const response = await request(url.href, { signal, limit: limits.searchResponseBytes,
        headers: { Accept: 'text/html' } });
      if (response.truncated) throw new Error('search_response_over_limit');
      if (!/^text\/html(?:;|$)/i.test(response.contentType)) throw new Error('unsupported_search_type');
      return searchResults(response.body, limits.searchResults);
    },
    async fetch(input, { signal, limits, offset = 0, contains } = {}) {
      const url = sourceUrl(input);
      if (!Number.isSafeInteger(offset) || offset < 0 || offset > limits.sourceResponseBytes ||
          (contains !== undefined && (typeof contains !== 'string' || !contains.trim() || contains.length > 80))) {
        throw new Error('invalid_passage_selection');
      }
      const response = await request(url, { signal, limit: limits.sourceResponseBytes,
        headers: { 'Accept': 'text/html, text/plain' } });
      if (!/^(text\/html|text\/plain)(;|$)/i.test(response.contentType)) throw new Error('unsupported_source_type');
      const html = response.contentType.toLowerCase().startsWith('text/html');
      let text = response.body;
      let title = url;
      if (html) {
        title = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(text)?.[1]?.replace(/<[^>]*>/g, '').trim() || url;
        text = text.replace(/<\s*(script|style|noscript)\b[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&(#(x[\da-f]+|\d+)|amp|lt|gt|quot|nbsp);/gi, (_all, entity) => {
            const codes = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ' };
            if (entity[0] !== '#') return codes[entity.toLowerCase()] ?? ' ';
            const num = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
            return num > 0 && num <= 0x10ffff ? String.fromCodePoint(num) : ' ';
          });
      }
      text = text.replace(/\s+/g, ' ').trim();
      if (!text) throw new Error('empty_source');
      if (contains !== undefined) {
        const index = text.toLowerCase().indexOf(contains.toLowerCase());
        if (index === -1) throw new Error('source_passage_not_found');
        offset = Math.max(0, index - Math.min(240, Math.floor(limits.sourceTextChars / 4)));
      }
      if (offset >= text.length) throw new Error('source_passage_not_found');
      const end = Math.min(text.length, offset + limits.sourceTextChars);
      return { url, title: title.slice(0, 120), text: text.slice(offset, end), offset,
        nextOffset: end < text.length ? end : undefined,
        rawTruncated: response.truncated, truncated: response.truncated || end < text.length };
    },
  };
}
