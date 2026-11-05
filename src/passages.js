// Local discovery only. Ranges address untouched source; the archive reader owns
// revision validation, complete warning context and citation resolution.
const words = text => text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
const size = text => Buffer.byteLength(text, 'utf8');

function preview(text, startByte, matchChar = 0, maxBytes = 384) {
  const bytes = Buffer.from(text);
  let start = Math.max(0, size(text.slice(0, matchChar)) - 128);
  while (start > 0 && (bytes[start] & 0xc0) === 0x80) start--;
  let end = Math.min(bytes.length, start + maxBytes);
  while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
  return { text: bytes.subarray(start, end).toString('utf8'), startByte: startByte + start,
    endByte: startByte + end, truncated: start > 0 || end < bytes.length };
}

export function findPassages(text, lines, terms, limit) {
  const totalBytes = size(text);
  const root = { startByte: 0, endByte: totalBytes, headings: [], headingWords: new Set(), blocks: [] };
  const sections = [root], stack = [];
  let section = root, first, last;
  function flush() {
    if (first) section.blocks.push({ startByte: first.byte, endByte: last.byte + size(last.value),
      startChar: first.index, endChar: last.end, section });
    first = last = undefined;
  }
  for (const line of lines) {
    if (line.level && !line.code && !line.underline) {
      flush();
      while (stack.length && stack.at(-1).level >= line.level) stack.pop().endByte = line.byte;
      const heading = preview(line.headingText ?? line.value, line.byte, 0, 160);
      section = { level: line.level, startByte: line.byte, endByte: totalBytes,
        startChar: line.index, headingEndChar: line.end, headingEndByte: line.byte + size(line.value),
        headingWords: new Set([...(stack.at(-1)?.headingWords ?? []), ...words(line.headingText ?? line.value)]),
        headings: [...(stack.at(-1)?.headings ?? []), heading], blocks: [] };
      stack.push(section); sections.push(section);
      continue;
    }
    if (line.underline) {
      section.headingEndByte = line.byte + size(line.value); section.headingEndChar = line.end;
      continue;
    }
    // Empty lines inside a fenced code block are content, not split points.
    if (!line.value.trim() && !line.code) { flush(); continue; }
    first ??= line; last = line;
  }
  flush();
  const wanted = new Set(terms), ranked = [];
  let blockCount = 0;
  for (const current of sections) {
    const headingWords = current.headingWords;
    const headingScore = terms.filter(term => headingWords.has(term)).length * 2;
    // No synthetic text: an empty matching section still points to its heading.
    const blocks = current.blocks.length ? current.blocks : current === root ? [] : [{
      startByte: current.startByte, endByte: current.headingEndByte,
      startChar: current.startChar, endChar: current.headingEndChar, section: current,
    }];
    for (const [index, block] of blocks.entries()) {
      blockCount++;
      const body = text.slice(block.startChar, block.endChar);
      const matched = new Set();
      let matchChar;
      for (const match of body.matchAll(/[\p{L}\p{N}]+/gu)) {
        const term = match[0].toLowerCase();
        if (wanted.has(term)) { matched.add(term); matchChar ??= match.index; }
      }
      const relevance = matched.size * 4 + headingScore;
      if (!relevance) continue;
      const startByte = index ? blocks[index - 1].startByte : current.startByte;
      const endByte = blocks[Math.min(blocks.length - 1, index + 1)].endByte;
      ranked.push({ relevance, matchedTerms: terms.filter(term => matched.has(term) || headingWords.has(term)),
        headings: current.headings, match: { startByte: block.startByte, endByte: block.endByte },
        selection: { startByte, endByte }, section: { startByte: current.startByte, endByte: current.endByte },
        preview: preview(body, block.startByte, matchChar ?? 0) });
    }
  }
  ranked.sort((a, b) => b.relevance - a.relevance || a.match.startByte - b.match.startByte);
  const passages = [];
  for (const match of ranked) {
    // Adjacent paragraphs already included as context need not be sent twice.
    if (passages.some(other => match.match.startByte < other.selection.endByte && match.match.endByte > other.selection.startByte)) continue;
    passages.push(match);
    if (passages.length === limit) break;
  }
  return { passages, blockCount, matchedBlocks: ranked.length, omittedMatches: ranked.length - passages.length };
}
