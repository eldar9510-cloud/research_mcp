// Private deterministic complete textual diff; no Git/model/process invocation.
// A single changed middle hunk is deliberately simple, not a semantic merge.
export function reportDiff({ path, before = Buffer.alloc(0), content }) {
  const old = before.toString('utf8').match(/[^\n]*(?:\n|$)/g).filter(Boolean);
  const next = content.toString('utf8').match(/[^\n]*(?:\n|$)/g).filter(Boolean);
  let start = 0, tail = 0;
  while (start < old.length && start < next.length && old[start] === next[start]) start++;
  while (tail < old.length - start && tail < next.length - start && old[old.length - tail - 1] === next[next.length - tail - 1]) tail++;
  const line = (prefix, text) => prefix + text + (text.endsWith('\n') ? '' : '\n\\ No newline at end of file\n');
  return `--- ${path} BEFORE (${before.length} bytes)\n+++ ${path} AFTER (${content.length} bytes)\n` +
    `@@ -${start + 1},${old.length - start - tail} +${start + 1},${next.length - start - tail} @@\n` +
    old.slice(start, old.length - tail).map(s => line('-', s)).join('') +
    next.slice(start, next.length - tail).map(s => line('+', s)).join('');
}
