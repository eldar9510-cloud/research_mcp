// Local retained-evidence identity only. This never fetches, rewrites evidence,
// authorizes a selector, or replaces the strict transport/search/DNS policy.
import { sourceUrl } from './brave.js';

export function retainedSourceUrls(...material) {
  const urls = new Set(), pending = [...material], seen = new Set();
  while (pending.length) {
    const value = pending.pop();
    if (typeof value !== 'string') {
      if (value && typeof value === 'object') for (const child of Object.values(value)) pending.push(child);
      continue;
    }
    if (seen.has(value)) continue;
    seen.add(value);
    // Selected partial envelopes / inherited qualification JSON may escape URL
    // characters. Decode only complete local JSON values, never source commands.
    if (/^\s*[\[{]/.test(value)) {
      try { pending.push(JSON.parse(value)); } catch { /* A byte selection need not be whole JSON. */ }
    }
    for (const match of value.matchAll(/https:\/\/[^\s<>"`\\]+/gi)) {
      // Retain the literal candidate AND the conservative prose-delimited one.
      // Never trim query bytes (even a sole punctuation character) into eligibility.
      const raw = match[0], candidates = new Set([raw]);
      if (!raw.split('#', 1)[0].includes('?')) {
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
        // A quote inside a path is literal, including a terminal quote. Only an
        // actual opening prose quote permits an additional unwrapped candidate.
        // Keep the raw candidate too: the closing quote can itself be path data.
        if (value[match.index - 1] === "'") for (const token of [...candidates]) {
          if (token.endsWith("'")) candidates.add(token.slice(0, -1));
        }
      }
      for (const token of candidates) {
        const input = token.split('#', 1)[0];
        // Check raw syntax BEFORE parsing: URL would erase an empty @ userinfo
        // marker. Query bytes, including a bare ?, must also remain exact.
        if (!input.isWellFormed() || /[\x00-\x20\x7f\\]/.test(input)) continue;
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
          urls.add(sourceUrl(canonical.href));
        } catch { continue; }
        if (urls.size > 256) throw Error('retained_source_limit');
      }
    }
  }
  return [...urls].sort();
}
