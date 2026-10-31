import { sourceUrl } from './research.mjs';

// Reuses the accepted concrete Brave integration, not a provider/router framework.
// Construction makes no requests. The host supplies the token only after scoped approval.
export function createBraveRfcAdapter({ token, fetchImpl = globalThis.fetch } = {}) {
  if (typeof token !== 'string' || !token.trim()) throw new Error('search_credential_required');
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

  // Search has stricter media validation and error redaction. Keep the direct-source
  // request/extraction path above/below identical to the reviewed DDG source half.
  async function searchRequest(url, { signal, limit }) {
    let response;
    let reader;
    let code = 'remote_fetch_failed';
    try {
      signal?.throwIfAborted();
      response = await fetchImpl(url, { method: 'GET', redirect: 'manual', credentials: 'omit', signal,
        headers: { Accept: 'application/json', 'X-Subscription-Token': token } });
      if (response.status !== 200 || response.redirected || !response.body) throw new Error();
      if (!/^application\/json(?:;|$)/i.test(response.headers.get('content-type') ?? '')) {
        code = 'unsupported_search_type'; throw new Error();
      }
      reader = response.body.getReader();
      const parts = [];
      let bytes = 0;
      for (;;) {
        signal?.throwIfAborted();
        const { done, value } = await reader.read();
        if (done) break;
        if (value.byteLength >= limit - bytes) {
          code = 'search_response_over_limit'; throw new Error(); // No partial results at the cap.
        }
        parts.push(value); bytes += value.byteLength;
      }
      signal?.throwIfAborted();
      return Buffer.concat(parts, bytes).toString('utf8');
    } catch {
      try { if (reader) await reader.cancel(); else await response?.body?.cancel(); } catch { /* No raw errors. */ }
      throw new Error(code); // Never retain API error bodies, URLs, queries, headers or token-bearing exceptions.
    } finally {
      reader?.releaseLock();
    }
  }

  return {
    async search(query, { signal, limits }) {
      if (typeof query !== 'string' || !query.trim() || query.length > 180) throw new Error('invalid_query');
      const url = new URL('https://api.search.brave.com/res/v1/web/search');
      url.searchParams.set('q', `site:rfc-editor.org ${query}`);
      url.searchParams.set('count', String(limits.searchResults));
      const body = await searchRequest(url.href, { signal, limit: limits.searchResponseBytes });
      let data;
      try { data = JSON.parse(body); } catch { throw new Error('search_response_invalid'); }
      if (!Array.isArray(data?.web?.results)) throw new Error('search_response_invalid');
      const found = [];
      for (const item of data.web.results) {
        try {
          const safe = sourceUrl(item.url);
          found.push({ url: safe, title: String(item.title ?? '').slice(0, 120),
            snippet: String(item.description ?? '').slice(0, 180) });
        } catch { /* Reject out-of-scope search hits, including API-injected URLs. */ }
        if (found.length >= limits.searchResults) break;
      }
      return found;
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
