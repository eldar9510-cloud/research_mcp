// Local retained-evidence identity only. This never fetches, rewrites evidence,
// authorizes a selector, or replaces the strict transport/search/DNS policy.
import { sourceUrl } from './brave.js';

// Callers pass a validated transport/check URL, not a prose candidate set.
// Empty fragments do not change the HTTPS request target; a bare ? still does.
export function sourceRequestIdentity(url) {
  return sourceUrl(url).split('#', 1)[0];
}

export function retainedSourceUrls(...material) {
  const urls = new Set(), pending = material.map(value => ({ value, decoded: false })), seen = new Set();
  while (pending.length) {
    const { value, decoded } = pending.pop();
    if (typeof value !== 'string') {
      if (value && typeof value === 'object') for (const child of Object.values(value)) pending.push({ value: child, decoded });
      continue;
    }
    const key = `${decoded}:${value}`;
    if (seen.has(key)) continue;
    seen.add(key);
    // A complete JSON envelope has ONE interpretation: decoded values. Never
    // also scan serialized escapes as prose and grant an unrelated prefix.
    if (/^\s*[\[{"]/.test(value)) {
      try { pending.push({ value: JSON.parse(value), decoded: true }); continue; }
      catch { /* A byte selection need not be whole JSON; retain prose discovery. */ }
    }
    // A decoded value beginning with a URL is atomic, including invalid bytes.
    // Prose tokens likewise keep lexical delimiter bytes until validation, so a
    // backslash/quote/etc. in a query cannot turn it into an eligible bare '?'.
    const atomic = decoded && /^https:\/\//i.test(value);
    const matches = atomic ? [{ 0: value, index: 0 }] : value.matchAll(/https:\/\/\S+/gi);
    for (const match of matches) {
      // Retain the literal candidate AND the conservative prose-delimited one.
      // Never trim query bytes (even a sole punctuation character) into eligibility.
      const raw = match[0], candidates = new Set([raw]);
      if (!atomic && !raw.split('#', 1)[0].includes('?')) {
        candidates.add(raw.replace(/[.,;:!]+$/, ''));
        for (let token of [...candidates]) {
          // Keep literal paths too, even when a final parenthesis is unmatched.
          // An additional candidate excludes surrounding Markdown delimiters.
          const balance = { ')': 0, ']': 0 };
          for (const c of token) {
            if (c === '(') balance[')']++; else if (c === ')') balance[')']--;
            if (c === '[') balance[']']++; else if (c === ']') balance[']']--;
          }
          while (balance[token.at(-1)] < 0) { balance[token.at(-1)]++; token = token.slice(0, -1); }
          candidates.add(token);
        }
      }
      // Only an actual opening prose wrapper permits an unwrapped alternative.
      // Atomic decoded URLs never fall back to a shorter lexical prefix.
      const closing = { "'": "'", '"': '"', '`': '`', '<': '>' }[value[match.index - 1]];
      if (!atomic && closing) for (const token of [...candidates]) {
        const end = token.lastIndexOf(closing);
        // Only punctuation OUTSIDE the paired wrapper is prose, even with '?'.
        if (end >= 0 && /^[.,;:!?)\]}>]*$/.test(token.slice(end + 1))) candidates.add(token.slice(0, end));
      }
      for (const token of candidates) {
        // Validate full raw values BEFORE dropping fragments or parsing. URL
        // would erase controls/backslashes, replace malformed Unicode and drop
        // an empty @ userinfo marker. None may manufacture another identity.
        if (!token.isWellFormed() || /[\x00-\x20\x7f\\<>"`]/.test(token)) continue;
        const input = token.split('#', 1)[0];
        const parts = /^https:\/\/([^/?]+)(.*)$/i.exec(input);
        if (!parts || parts[1].includes('@')) continue;
        const authority = parts[1].toLowerCase().replace(/:443$/, '');
        const query = input.includes('?') ? input.slice(input.indexOf('?')) : '';
        try {
          // The same URL client serializes an empty path and removes dot segments.
          // Do not infer host aliases/IDNA/other port spellings or contact a server.
          const canonical = new URL('https://' + authority + parts[2]);
          if (canonical.host !== authority ||
              (canonical.href.includes('?') ? canonical.href.slice(canonical.href.indexOf('?')) : '') !== query) continue;
          urls.add(sourceRequestIdentity(canonical.href));
        } catch { continue; }
        if (urls.size > 256) throw Error('retained_source_limit');
      }
    }
  }
  return [...urls].sort();
}
