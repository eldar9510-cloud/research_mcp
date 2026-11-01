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
    for (const match of value.matchAll(/https:\/\/[^\s<>"'`\\]+/gi)) {
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
      }
      for (const token of candidates) {
        // Only scheme/host case, explicit default HTTPS port and fragment identity
        // are normalized. Preserve query/auth/path bytes: sourceUrl must still
        // accept the resulting exact canonical identity. No URL-parser aliasing.
        const canonical = token.split('#', 1)[0].replace(/^https:\/\/([^/?#]+)/i,
          (_all, authority) => 'https://' + authority.toLowerCase().replace(/:443$/, ''));
        try { urls.add(sourceUrl(canonical)); } catch { continue; }
        if (urls.size > 256) throw Error('retained_source_limit');
      }
    }
  }
  return [...urls].sort();
}
