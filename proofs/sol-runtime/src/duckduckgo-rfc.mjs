import { sourceUrl } from './research.mjs';

const SEARCH_ENDPOINT = 'https://lite.duckduckgo.com/lite/';
const RAW_TEXT = new Set(['script', 'style', 'noscript', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes']);
const INERT = new Set(['template', 'svg', 'math', 'select']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const space = (c) => /^[\t\n\f\r ]$/.test(c ?? '');
const letter = (c) => /^[a-z]$/i.test(c ?? '');
const nameChar = (c) => /^[a-z\d:_-]$/i.test(c ?? '');
const invalid = () => { throw new Error('search_response_invalid'); };

// A deliberately conservative recognizer for Lite's observed result-link layout,
// not a general HTML parser or a promise that the public site is a stable API.
function decodeEntities(text) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0',
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
// Every scan advances a cursor; names/values/text are sliced only once. In
// particular, a failed tag or quote cannot restart scanning at later '<' tokens.
function tagAt(body, start) {
  let i = start + 1;
  const end = body[i] === '/';
  if (end) i++;
  if (!letter(body[i])) invalid();
  const nameStart = i;
  while (nameChar(body[i])) i++;
  const name = body.slice(nameStart, i).toLowerCase();
  const attrs = new Map();
  let carriedSpace = false;
  for (;;) {
    const before = i;
    while (space(body[i])) i++;
    const separated = i > before || carriedSpace;
    carriedSpace = false;
    if (body[i] === '>') return { name, attrs, end, next: i + 1 };
    if (!end && body[i] === '/' && body[i + 1] === '>') {
      if (!VOID.has(name)) invalid(); // '/>' does not close HTML raw-text elements.
      return { name, attrs, end, next: i + 2 };
    }
    if (end || !separated || i >= body.length) invalid();
    const attrStart = i;
    while (i < body.length && !/[\t\n\f\r "'<>/=`]/.test(body[i])) i++;
    if (i === attrStart) invalid();
    const key = body.slice(attrStart, i).toLowerCase();
    if (attrs.has(key)) invalid();
    const attrEnd = i;
    while (space(body[i])) i++;
    carriedSpace = i > attrEnd;
    let value = '';
    if (body[i] === '=') {
      i++;
      while (space(body[i])) i++;
      const quote = body[i] === '"' || body[i] === "'" ? body[i++] : undefined;
      const valueStart = i;
      if (quote) {
        while (i < body.length && body[i] !== quote) i++;
        if (i === body.length) invalid();
        value = body.slice(valueStart, i++);
      } else {
        while (i < body.length && !space(body[i]) && body[i] !== '>') {
          if (/["'=<>`]/.test(body[i])) invalid();
          i++;
        }
        if (i === valueStart) invalid();
        value = body.slice(valueStart, i);
      }
      carriedSpace = false;
    }
    attrs.set(key, value);
  }
}
function rawEnd(body, start, name) {
  const wordAt = (i, word) => body.slice(i, i + word.length).toLowerCase() === word &&
    (space(body[i + word.length]) || ['/', '>'].includes(body[i + word.length]));
  let scriptState = 'data';
  for (let i = start; i < body.length; i++) {
    // HTML script escaped/double-escaped states, NOT JavaScript interpretation.
    // A double-escaped </script> changes state but does not close the element.
    if (name === 'script') {
      if (scriptState === 'data' && body.startsWith('<!--', i)) { scriptState = 'escaped'; continue; }
      if (scriptState !== 'data' && body.startsWith('-->', i)) { scriptState = 'data'; i += 2; continue; }
      if (scriptState === 'escaped' && body[i] === '<' && wordAt(i, '<script')) {
        scriptState = 'double'; continue;
      }
    }
    if (body[i] === '<' && wordAt(i, `</${name}`)) {
      if (scriptState === 'double') scriptState = 'escaped';
      else return i;
    }
  }
  invalid();
}
function* liteTokens(body) {
  if (body.includes('\0')) invalid();
  let i = 0;
  let raw;
  while (i < body.length) {
    if (raw) {
      const end = rawEnd(body, i, raw);
      yield { text: body.slice(i, end), raw: true };
      i = end; raw = undefined;
    } else if (body.startsWith('<!--', i)) {
      const end = body.indexOf('-->', i + 4);
      if (end === -1 || body.slice(i + 4, end).includes('--')) invalid();
      i = end + 3;
    } else if (body.slice(i, i + 9).toLowerCase() === '<!doctype' && space(body[i + 9])) {
      const start = i;
      let quote;
      for (i += 9; i < body.length; i++) {
        const c = body[i];
        if (quote) { if (c === quote) quote = undefined; }
        else if (c === '"' || c === "'") quote = c;
        else if (c === '>') break;
        else if (c === '<' || c === '[' || c === ']') invalid();
      }
      if (i === body.length || !/^<!doctype\s+html(?:\s|>)/i.test(body.slice(start, i + 1))) invalid();
      i++;
      yield { doctype: true };
    } else if (body[i] === '<') {
      const tag = tagAt(body, i);
      i = tag.next;
      yield tag;
      if (!tag.end && tag.name === 'plaintext') invalid(); // No HTML end tag exists.
      if (!tag.end && RAW_TEXT.has(tag.name)) raw = tag.name;
    } else {
      const next = body.indexOf('<', i);
      const end = next === -1 ? body.length : next;
      yield { text: body.slice(i, end) };
      i = end;
    }
  }
  if (raw) invalid();
}
const hasClass = (attrs, name) => decodeEntities(attrs.get('class') ?? '').split(/[\t\n\f\r ]+/).includes(name);
const plain = (parts) => decodeEntities(parts.join('')).replace(/\s+/g, ' ').trim();
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
  if (/anomaly\.js|anomaly-modal|bots use duckduckgo|challenge-form|verify (?:that )?you are human|captcha|type\s*=\s*["']?password/i.test(body)) {
    throw new Error('search_challenge');
  }
  const stack = [];
  const found = [];
  let htmlSeen = false, headSeen = false, bodySeen = false, headClosed = false, bodyClosed = false;
  let titleSeen = false, titleValid = false, form = false, empty = false, doctype = false;
  let inBody = false, inert = 0, anchor = false, recognized = 0, capture;
  const layout = () => { throw new Error('search_layout_unrecognized'); };
  for (const token of liteTokens(body)) {
    if (token.doctype) {
      if (htmlSeen || doctype) invalid();
      doctype = true;
      continue;
    }
    if (token.text !== undefined) {
      if (!stack.length && token.text.trim()) invalid();
      if (capture && !inert && (!token.raw || capture.kind === 'title')) capture.parts.push(token.text);
      continue;
    }
    const { name, attrs, end } = token;
    if (end) {
      const frame = stack.pop();
      if (!frame || frame.name !== name) invalid();
      if (frame.capture) {
        if (capture.kind === 'title') titleValid = /DuckDuckGo/i.test(plain(capture.parts));
        else if (capture.kind === 'empty') empty ||= /^No results found\b/i.test(plain(capture.parts));
        else {
          let url;
          try { url = destination(decodeEntities(capture.href)); }
          catch { /* Recognized out-of-scope results are not leads. */ }
          if (url) {
            const title = plain(capture.parts);
            if (!title) invalid();
            if (found.length < maximum) found.push({ url, title: title.slice(0, 120), snippet: '' });
          }
        }
        capture = undefined;
      }
      if (frame.inert) inert--;
      if (name === 'a') anchor = false;
      if (frame.document === 'head') headClosed = true;
      if (frame.document === 'body') { bodyClosed = true; inBody = false; }
      if (capture && !inert) capture.parts.push(' ');
      continue;
    }
    if (!htmlSeen && name !== 'html') layout();
    if (htmlSeen && !stack.length) invalid();
    const frame = { name, inert: INERT.has(name) };
    if (!inert) {
      if (name === 'html') {
        if (htmlSeen || stack.length) invalid();
        htmlSeen = true;
      } else if (name === 'head') {
        if (stack.length !== 1 || headSeen || bodySeen) invalid();
        headSeen = true; frame.document = 'head';
      } else if (name === 'body') {
        if (stack.length !== 1 || !headClosed || bodySeen) invalid();
        bodySeen = true; inBody = true; frame.document = 'body';
      } else if (stack.length < 2) invalid();
    }
    const action = name === 'form' && attrs.has('action') ? decodeEntities(attrs.get('action')) : '';
    if (decodeEntities(attrs.get('type') ?? '').toLowerCase() === 'password' ||
        (name === 'form' && [...attrs.values()].some((value) => /\/login/i.test(decodeEntities(value))))) {
      throw new Error('search_challenge');
    }
    if (capture && !inert) capture.parts.push(' ');
    if (frame.inert) inert++;
    if (name === 'a') { if (anchor) invalid(); anchor = true; }
    let kind;
    if (!inert) {
      if (name === 'title') {
        if (inBody || titleSeen || stack.at(-1)?.name !== 'head') invalid();
        titleSeen = true; kind = 'title';
      }
      if (inBody && name === 'form' && action && new URL(action, SEARCH_ENDPOINT).href === SEARCH_ENDPOINT) form = true;
      if (inBody && name === 'a' && hasClass(attrs, 'result-link')) {
        if (!attrs.get('href')) invalid();
        recognized++; kind = 'result';
      }
      if (inBody && (name === 'td' || name === 'div') && hasClass(attrs, 'no-results')) kind = 'empty';
    }
    if (kind) {
      if (capture) invalid();
      capture = { kind, parts: [], href: attrs.get('href') };
      frame.capture = true;
    }
    if (!VOID.has(name)) stack.push(frame);
  }
  if (stack.length || !htmlSeen || !headClosed || !bodyClosed || !titleValid || !form ||
      (!recognized && !empty) || (recognized && empty)) layout();
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
