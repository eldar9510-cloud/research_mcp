import { createHash, randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import { isAbsolute, join, relative, resolve, sep, dirname, parse } from 'node:path';
import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
const label = z.string().min(1).max(512).refine(s => s.trim().length > 0 && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s));
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
}, 'invalid calendar date');
const relationship = z.object({ id, relationship: z.enum(['reuses', 'extends', 'corrects', 'replaces']) }).strict();
export const importMetadata = z.object({
  id, title: label, question: label, scope: label, summary: label,
  researched_at: date.nullable(), last_improved_at: date.nullable(),
  language: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/),
  origin: z.object({ kind: z.literal('imported'), platform: label, author: label, model: label }).strict(),
  related_reports: z.array(relationship).max(32), warnings: z.array(label).max(16),
  superseded_by: id.nullable(),
}).strict().superRefine((m, ctx) => {
  const seen = new Set();
  for (const r of m.related_reports) {
    if (r.id === m.id || seen.has(r.id)) ctx.addIssue({ code: 'custom', message: 'relationship cannot be self-referential or repeated', path: ['related_reports'] });
    seen.add(r.id);
  }
  if (m.superseded_by === m.id) ctx.addIssue({ code: 'custom', message: 'report cannot supersede itself', path: ['superseded_by'] });
});
const proposalId = /^proposal-[a-f0-9]{32}$/;
const digestPattern = /^[a-f0-9]{64}$/;
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
const MAX_RECORD_BYTES = 24 * 1024; // One bound for serialized publication and subsequent reads.
const MAX_WARNINGS = 40; // 32 relationships plus eight bounded import diagnostics.
const MAX_PROPOSALS = 10000;
const MAX_INDEX_BYTES = 8 * 1024 * 1024;
const MAX_REPORT_BYTES = MAX_SOURCE_BYTES + MAX_RECORD_BYTES + 64;
const EMPTY_INDEX = { version: 1, entries: [] };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const looksLikeCredential = text => /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:AKIA|ASIA)[A-Z0-9]{16}\b|\b(?:sk-|ghp_)[A-Za-z0-9_-]{20,}\b|\b(?:api[_ -]?key|access[_ -]?token|password|secret)\s*[:=]\s*['\"]?[A-Za-z0-9/+_.=-]{16,}/i.test(text);
const fail = (code, message) => { throw new ArchiveError(code, message); };

export class ArchiveError extends Error {
  constructor(code, message) { super(message); this.name = 'ArchiveError'; this.code = code; }
}

function inside(root, path) {
  const rel = relative(root, path);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}
async function noSymlinks(path, allowMissingLeaf = false) {
  const full = resolve(path);
  const { root } = parse(full);
  let current = root;
  const segments = full.slice(root.length).split(sep).filter(Boolean);
  for (let i = 0; i < segments.length; i++) {
    current = join(current, segments[i]);
    let st;
    try { st = await fs.lstat(current); }
    catch (e) {
      if (e.code === 'ENOENT' && allowMissingLeaf && i === segments.length - 1) return;
      if (e.code === 'ENOENT') fail('not_found', 'Configured path or file does not exist');
      throw e;
    }
    if (st.isSymbolicLink()) fail('invalid_input', 'Symlink paths are not permitted');
    if (i < segments.length - 1 && !st.isDirectory()) fail('invalid_input', 'Path parent is not a directory');
  }
}
async function readRegular(path, max) {
  await noSymlinks(path);
  // Reject FIFOs/devices before open; O_NONBLOCK also protects against a leaf swap
  // between lstat and open. O_NOFOLLOW and fstat check the opened descriptor.
  if (!(await fs.lstat(path)).isFile()) fail('invalid_input', 'Only regular files can be imported or read');
  let fh;
  try {
    fh = await fs.open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const before = await fh.stat();
    if (!before.isFile()) fail('invalid_input', 'Only regular files can be imported or read');
    if (before.size > max) fail('limit_reached', 'File exceeds configured import or proposal limit');
    const data = await fh.readFile();
    const after = await fh.stat();
    if (data.length !== before.size || before.size !== after.size || before.mtimeMs !== after.mtimeMs) fail('revision_conflict', 'File changed while reading');
    return data;
  } finally { await fh?.close(); }
}
function utf8(bytes) {
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { fail('invalid_input', 'Report must be valid UTF-8 text'); }
  if (text.includes('\0')) fail('invalid_input', 'Report contains a NUL byte');
  return text;
}
function safeMetadata(input) {
  const parsed = importMetadata.safeParse(input);
  if (!parsed.success || Buffer.byteLength(JSON.stringify(parsed.data), 'utf8') > 8192) fail('invalid_input', 'Invalid or oversized report metadata (see documented field contract)');
  return parsed.data;
}
const referenceLabel = value => value.trim().replace(/\s+/g, ' ').toLowerCase();
// Recognize the Markdown structures relevant to notices/references, without
// treating code examples as headings or evidence definitions. Original offsets
// always address the untouched source, not a normalized Markdown rendering.
function markdownLines(text) {
  let fence;
  let byte = 0;
  const lines = [...text.matchAll(/[^\n]*(?:\n|$)/g)].filter(m => m[0].length).map(m => {
    const value = m[0];
    const syntax = m.index === 0 ? value.replace(/^\ufeff/, '') : value;
    const marker = /^ {0,3}(`{3,}|~{3,})(.*)/.exec(syntax);
    let code = !!fence || /^(?: {4}|\t)/.test(syntax);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = undefined;
    } else if (marker && (marker[1][0] !== '`' || !marker[2].includes('`'))) {
      code = true;
      fence = marker[1];
    }
    const line = { value, syntax, index: m.index, end: m.index + value.length, byte, code };
    byte += Buffer.byteLength(value);
    return line;
  });
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.code) continue;
    line.level = /^ {0,3}(#{1,6})(?:[ \t]+|\r?\n?$)/.exec(line.syntax)?.[1].length;
    if (i && !lines[i - 1].code && !lines[i - 1].level && !lines[i - 1].underline && lines[i - 1].value.trim() &&
        !/^ {0,3}(?:>|[-+*][ \t]|\d+[.)][ \t])/.test(lines[i - 1].value) && /^ {0,3}(?:=+|-+)[ \t]*\r?\n?$/.test(line.value)) {
      let start = i - 1;
      while (start > 0 && !lines[start - 1].code && !lines[start - 1].level && !lines[start - 1].underline &&
          lines[start - 1].value.trim() && !/^ {0,3}(?:>|[-+*][ \t]|\d+[.)][ \t])/.test(lines[start - 1].value)) start--;
      lines[start].level = line.value.trim()[0] === '=' ? 1 : 2;
      lines[start].headingText = lines.slice(start, i).map(line => line.value).join('');
      for (let j = start + 1; j <= i; j++) lines[j].underline = true;
    }
  }
  return lines;
}
function proseMask(text, inlineCode = true) {
  return markdownLines(text).map(line => {
    const value = line.index === 0 ? line.value.replace(/^\ufeff/, ' ') : line.value;
    return line.code ? value.replace(/[^\r\n]/g, ' ') :
      inlineCode ? value.replace(/(`+)([^\n]*?)\1(?!`)/g, m => ' '.repeat(m.length)) : value;
  }).join('');
}
function referenceTokens(text) {
  const tokens = [];
  const prose = proseMask(text);
  for (const m of prose.matchAll(/\[([^\]\n]{1,80})\](?:\[([^\]\n]{0,80})\])?/g)) {
    const after = prose[m.index + m[0].length];
    // Only a single label can begin a definition or inline link. Punctuation
    // after a full [claim][label] reference must not erase that citation.
    if (m[2] === undefined && (after === '(' || (after === ':' && /^ {0,3}$/.test(prose.slice(prose.lastIndexOf('\n', m.index) + 1, m.index))))) continue;
    tokens.push({ index: m.index, text: text.slice(m.index, m.index + m[0].length), label: referenceLabel(m[2] === undefined ? m[1] : m[2] || m[1]) });
  }
  // Exported platform markers have no portable target; never invent one.
  for (const m of prose.matchAll(/(?:cite|filecite)([^\n]{1,512})/g))
    tokens.push({ index: m.index, text: m[0], label: m[1] });
  return tokens.sort((a, b) => a.index - b.index);
}
function referenceDefinitions(text) {
  const definitions = new Map();
  const prose = proseMask(text, false);
  for (const m of prose.matchAll(/^ {0,3}\[([^\]\n]{1,80})\]:[ \t]*(\S[^\n]*)/gm)) {
    let end = m.index + m[0].length;
    // Retain indented footnote/reference continuation lines verbatim.
    const continuation = /^(?:\r?\n(?:[ \t]*\r?\n)*?(?: {4}|\t)[^\n]*)+/.exec(text.slice(end));
    if (continuation) end += continuation[0].length;
    const label = referenceLabel(m[1]);
    const matches = definitions.get(label) ?? [];
    matches.push({ label, target: text.slice(m.index + m[0].length - m[2].length, m.index + m[0].length).trim(), index: m.index, end, definition: text.slice(m.index, end) });
    definitions.set(label, matches);
  }
  return definitions;
}
function importantNotices(text) {
  const important = /\b(?:warnings?|caveats?|limitations?|corrections?|corrected|supersed(?:ed|es|ing)|errata|known errors?|replaced by)\b/i;
  const paragraph = /^(?: {0,3})(?:(?:\*\*|__)?(?:warnings?|caveats?|limitations?|corrections?|errata|known errors?)(?:\*\*|__)?\s*[:.—-]|(?:this|the) report\b[^\n]*\b(?:corrected|superseded|replaced by)\b)/i;
  const lines = markdownLines(text);
  const notices = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.code || line.underline) continue;
    if (line.level && important.test((line.headingText ?? line.value).replace(/`[^`]*`/g, ''))) {
      while (i + 1 < lines.length && (!lines[i + 1].level || lines[i + 1].level > line.level)) i++;
    } else {
      if (line.level || !paragraph.test(line.syntax)) continue;
      while (i + 1 < lines.length && lines[i + 1].value.trim() && !lines[i + 1].level && !lines[i + 1].code) i++;
    }
    const startChar = line.index;
    const endChar = lines[i].end;
    notices.push({ text: text.slice(startChar, endChar), startByte: line.byte,
      endByte: lines[i].byte + Buffer.byteLength(lines[i].value), startChar, endChar });
  }
  return notices;
}
const NOTICE_CHUNK_BYTES = 1024;
function noticeChunks(notices) {
  const chunks = [];
  for (const [noticeIndex, notice] of notices.entries()) {
    const bytes = Buffer.from(notice.text);
    const parts = [];
    let char = notice.startChar;
    for (let start = 0; start < bytes.length;) {
      let end = Math.min(bytes.length, start + NOTICE_CHUNK_BYTES);
      while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
      const text = utf8(bytes.subarray(start, end));
      parts.push({ text, startByte: notice.startByte + start,
        endByte: notice.startByte + end, startChar: char, endChar: char + text.length });
      char += text.length;
      start = end;
    }
    chunks.push(...parts.map((part, i) => ({ ...part, noticeNumber: noticeIndex + 1, chunkNumber: i + 1, chunkCount: parts.length })));
  }
  return chunks;
}
function noticeSignal(text, notices, key, revision) {
  // Exact, explicitly bounded successor-bearing lines, not invented summaries
  // or verified relationships. All remaining bytes have a revision-bound read.
  const lines = markdownLines(text).filter(line => !line.code && /\b(?:supersed(?:ed|es|ing)|successor|replaced by|use\b.*\binstead)\b/i.test(line.value) &&
    notices.some(n => line.index >= n.startChar && line.index < n.endChar));
  return { signal: 'CORRECTION / SUPERSESSION / WARNING CONTEXT: required before relying on this report; not freshly verified.',
    noticeCount: notices.length, successorContextCount: lines.length, successorContextTruncated: lines.length > 4,
    successorContext: lines.slice(0, 4).map(line => {
      const bytes = Buffer.from(line.value);
      let end = Math.min(512, bytes.length);
      while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
      return { text: utf8(bytes.subarray(0, end)), truncated: end < bytes.length,
        read: { ...key, expectedRevision: revision, selection: { startByte: line.byte, endByte: line.byte + bytes.length } } };
    }),
    requirement: 'Read the complete exact warning context and its citations at this revision (ALL numbered chunks when paged) before treating evidence as qualified. This stateless response does not prove anyone read them.' };
}
function warningsFor(meta, text) {
  const warnings = [];
  const add = (code, message) => warnings.push({ code, message });
  if (meta.researched_at === null) add('unknown_research_date', 'Original research date unknown; import is not verification.');
  if (meta.origin.platform === 'unknown' || meta.origin.author === 'unknown') add('unknown_origin', 'Original platform or author unknown; review attribution.');
  if (/(?:\bfile:\/\/|\b[A-Za-z]:\\|(?<![\w./:@%+=&?~#-])(?:\.{1,2}\/|\/(?!\/)[A-Za-z0-9_~.]))/i.test(text)) add('local_dependency', 'Local file reference may not be portable; review before publication.');
  if (/\b(?:transcript|chat log|conversation-only|private conversation)\b/i.test(text)) add('transcript_dependency', 'Possible transcript-only evidence; review before publication.');
  const definitions = referenceDefinitions(text);
  const references = referenceTokens(text);
  if (references.some(m => definitions.get(m.label)?.length !== 1)) add('unresolved_citation', 'Unresolved or ambiguous imported reference or footnote; no target was invented.');
  if (/\b(?:ignore (?:previous|all) instructions|reveal (?:secrets|credentials)|publish (?:this|unrelated)|send (?:secrets|credentials))\b/i.test(text)) add('untrusted_instructions', 'Report may contain instructions; treat as untrusted source text, never authorization.');
  for (const r of meta.related_reports) add('unverified_relationship', `Relationship to ${r.id} is unverified until reviewed.`);
  if (meta.superseded_by) add('unverified_supersession', 'Supersession link is unverified until reviewed.');
  add('unverified_import', 'Imported claims and publication rights have not been checked.');
  return warnings;
}
async function publishFile(path, data) {
  // A temporary file plus an exclusive hard link makes the final name atomic and non-overwriting.
  const temp = join(dirname(path), `.import-${randomUUID()}.tmp`);
  try {
    const fh = await fs.open(temp, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
    try { await fh.writeFile(data); await fh.sync(); } finally { await fh.close(); }
    await fs.link(temp, path);
  } finally { await fs.rm(temp, { force: true }); }
}
function cleanId(value) { if (typeof value !== 'string' || !proposalId.test(value)) fail('invalid_input', 'Invalid proposal ID'); return value; }
function cleanReportId(value) { if (!id.safeParse(value).success) fail('invalid_input', 'Invalid report ID'); return value; }
const indexBytes = index => Buffer.from(JSON.stringify(index, null, 2) + '\n');
const reportBytes = (saved, body) => Buffer.concat([
  Buffer.from(`---\n${JSON.stringify(saved, null, 2)}\n---\n`), body,
]);
const entryFor = (saved, revision, size, mtimeMs) => {
  const m = saved.metadata;
  return { id: m.id, path: `reports/${m.id}.md`, revision, sourceDigest: saved.sourceDigest, size, mtimeMs,
    title: m.title, question: m.question, scope: m.scope, summary: m.summary,
    researched_at: m.researched_at, last_improved_at: m.last_improved_at,
    created_at: m.created_at, updated_at: m.updated_at, imported_at: m.imported_at,
    language: m.language, origin: m.origin, related_reports: m.related_reports,
    superseded_by: m.superseded_by, warnings: [...m.warnings.map(message => ({ code: 'report_warning', message })), ...saved.warnings] };
};
function parseReport(bytes, expectedId) {
  if (!bytes.subarray(0, 4).equals(Buffer.from('---\n'))) fail('catalogue_invalid', 'Accepted report header is invalid; rebuild after inspection');
  const end = bytes.indexOf(Buffer.from('\n---\n'), 4);
  if (end < 0 || end > MAX_RECORD_BYTES) fail('catalogue_invalid', 'Accepted report header is invalid; rebuild after inspection');
  let saved;
  try { saved = JSON.parse(utf8(bytes.subarray(4, end))); } catch { fail('catalogue_invalid', 'Accepted report metadata is invalid'); }
  if (!saved || saved.format !== 1 || Object.keys(saved).sort().join(',') !== 'format,metadata,proposalRevision,sourceDigest,warnings' ||
      !digestPattern.test(saved.sourceDigest ?? '') ||
      !digestPattern.test(saved.proposalRevision ?? '') || !safeRecord(saved.metadata) || saved.metadata.id !== expectedId ||
      !Array.isArray(saved.warnings) || saved.warnings.length > MAX_WARNINGS ||
      !saved.warnings.every(w => w && typeof w.code === 'string' && /^[a-z_]{1,48}$/.test(w.code) &&
        typeof w.message === 'string' && Buffer.byteLength(w.message, 'utf8') <= 512)) fail('catalogue_invalid', 'Accepted report metadata is invalid');
  const body = bytes.subarray(end + 5);
  if (!body.length || body.length > MAX_SOURCE_BYTES || sha(body) !== saved.sourceDigest) fail('catalogue_invalid', 'Accepted report body digest differs; inspect before rebuilding');
  let text;
  try { text = utf8(body); } catch { fail('catalogue_invalid', 'Accepted report is not valid UTF-8; inspect before rebuilding'); }
  return { saved, body, text };
}
function safeRecord(m) {
  if (!m || typeof m !== 'object') return false;
  const { created_at, updated_at, imported_at, ...input } = m;
  return importMetadata.safeParse(input).success && [created_at, updated_at, imported_at].every(x =>
    typeof x === 'string' && !Number.isNaN(Date.parse(x)) && new Date(x).toISOString() === x);
}
function searchTerms(text) { return text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []; }
function relevance(entry, terms) {
  const fields = [[entry.title, 8], [entry.question, 7], [entry.summary, 4], [entry.scope, 3],
    [entry.id, 3], [entry.language, 1], [entry.related_reports.map(x => x.id).join(' '), 1]];
  return terms.reduce((total, term) => total + fields.reduce((score, [text, weight]) =>
    score + (searchTerms(text).some(word => word === term) ? weight : 0), 0), 0);
}

/** Import is serialized within this instance; separate processes must not share a work root. */
export function createArchive({ archiveRoot, workRoot, importRoot, maxReadBytes = 2048, maxSearchResults = 5,
  now = () => new Date().toISOString(), writeCheckpoint = () => {} }) {
  if (![archiveRoot, workRoot, importRoot].every(p => typeof p === 'string' && isAbsolute(p)) ||
      !Number.isInteger(maxReadBytes) || maxReadBytes < 128 || maxReadBytes > 8192 ||
      !Number.isInteger(maxSearchResults) || maxSearchResults < 1 || maxSearchResults > 10 || typeof writeCheckpoint !== 'function') fail('invalid_input', 'Absolute disjoint roots, read limit 128..8192 and search limit 1..10 are required');
  const roots = [archiveRoot, workRoot, importRoot].map(p => resolve(p));
  if (roots.some((p, i) => roots.some((q, j) => i !== j && (p === q || inside(p, q) || inside(q, p))))) {
    fail('invalid_input', 'Archive, work and import roots must be disjoint');
  }
  const [archive, work, source] = roots;
  const proposals = join(work, 'proposals');
  const reports = join(archive, 'reports');
  const indexPath = join(archive, 'INDEX.json');
  let serial = Promise.resolve();
  async function init() {
    for (const p of roots) { await noSymlinks(p); if (!(await fs.stat(p)).isDirectory()) fail('invalid_input', 'Configured root must be a directory'); }
    await noSymlinks(proposals, true);
    await fs.mkdir(proposals, { mode: 0o700 }); // if another process initialized it, revalidate below
  }
  let initialized;
  async function ready() {
    if (!initialized) initialized = init().catch(e => { initialized = undefined; throw e; });
    try { await initialized; } catch (e) { if (e.code !== 'EEXIST') throw e; }
    await noSymlinks(proposals);
    if (!(await fs.stat(proposals)).isDirectory()) fail('invalid_input', 'Proposal location must be a directory');
  }
  function paths(pid) { cleanId(pid); return { meta: join(proposals, `${pid}.json`), body: join(proposals, `${pid}.body`) }; }
  async function load(pid) {
    const p = paths(pid);
    let raw;
    try { raw = await readRegular(p.meta, MAX_RECORD_BYTES); }
    catch (e) { if (e.code === 'not_found') fail('not_found', 'Proposal not found'); throw e; }
    let saved;
    try { saved = JSON.parse(utf8(raw)); } catch { fail('archive_unavailable', 'Proposal metadata is invalid'); }
    if (!saved || saved.state !== 'LOCAL_UNACCEPTED' || saved.proposalId !== pid || !digestPattern.test(saved.sourceDigest ?? '') ||
        !digestPattern.test(saved.revision ?? '') || !safeStoredMetadata(saved.metadata) ||
        !Array.isArray(saved.warnings) || saved.warnings.length > MAX_WARNINGS ||
        !saved.warnings.every(w => w && typeof w.code === 'string' && /^[a-z_]{1,48}$/.test(w.code) &&
          typeof w.message === 'string' && Buffer.byteLength(w.message, 'utf8') <= 512)) fail('archive_unavailable', 'Proposal metadata is invalid');
    let body;
    try { body = await readRegular(p.body, MAX_SOURCE_BYTES); } catch (e) { if (e.code === 'not_found') fail('archive_unavailable', 'Proposal body is missing'); throw e; }
    if (sha(body) !== saved.sourceDigest || revision(saved.metadata, saved.sourceDigest) !== saved.revision) fail('revision_conflict', 'Stored proposal revision changed');
    const text = utf8(body);
    return { saved, body, text };
  }
  function safeStoredMetadata(m) { return safeRecord(m); }
  function revision(metadata, sourceDigest) { return sha(JSON.stringify({ metadata, sourceDigest })); }
  async function existing() {
    const entries = await fs.readdir(proposals);
    if (entries.length > MAX_PROPOSALS * 2) fail('limit_reached', 'Proposal scan limit reached');
    const found = [];
    for (const entry of entries.sort()) {
      if (!entry.endsWith('.json')) continue;
      const pid = entry.slice(0, -5);
      if (!proposalId.test(pid)) fail('archive_unavailable', 'Unexpected proposal metadata entry');
      found.push((await load(pid)).saved);
    }
    return found;
  }
  async function checkAccepted(reportId) {
    await noSymlinks(reports, true);
    try { if (!(await fs.stat(reports)).isDirectory()) fail('invalid_input', 'Reports location must be a directory'); }
    catch (e) { if (e.code === 'ENOENT') return; throw e; }
    for (const ext of ['.md', '.markdown', '.txt', '.json']) {
      const path = join(reports, reportId + ext);
      await noSymlinks(path, true);
      try { await fs.lstat(path); fail('revision_conflict', 'Report ID already exists in the accepted archive'); }
      catch (e) { if (e.code !== 'ENOENT') throw e; }
    }
  }
  async function importReport({ sourcePath, text, metadata }) {
    await ready();
    const m = safeMetadata(metadata);
    if ((typeof sourcePath === 'string') === (typeof text === 'string') ||
        (sourcePath !== undefined && typeof sourcePath !== 'string') ||
        (text !== undefined && typeof text !== 'string')) fail('invalid_input', 'Provide exactly one sourcePath or text');
    let bytes;
    if (sourcePath !== undefined) {
      if (sourcePath.length > 4096 || /[\x00-\x1f]/.test(sourcePath) || !isAbsolute(sourcePath) || !inside(source, resolve(sourcePath)) || !/\.(md|markdown|txt)$/i.test(sourcePath)) fail('invalid_input', 'Selected report must be a Markdown or text file inside the import root');
      bytes = await readRegular(resolve(sourcePath), MAX_SOURCE_BYTES);
    } else {
      if (!text.isWellFormed()) fail('invalid_input', 'Report must be well-formed Unicode text');
      bytes = Buffer.from(text, 'utf8');
      if (bytes.length > MAX_SOURCE_BYTES) fail('limit_reached', 'Report exceeds import limit');
    }
    if (!bytes.length) fail('invalid_input', 'Empty report is not a finished report');
    const bodyText = utf8(bytes);
    if (looksLikeCredential(bodyText) || looksLikeCredential(JSON.stringify(m))) fail('invalid_input', 'Report or metadata appears to contain credentials; remove them before import');
    const sourceDigest = sha(bytes);
    const proposalId = `proposal-${sha(`${m.id}\0${sourceDigest}`).slice(0, 32)}`;
    const current = await existing();
    if (current.some(item => item.metadata.id === m.id && item.sourceDigest !== sourceDigest)) fail('revision_conflict', 'Report ID already has a different proposal; explicit revision required');
    await checkAccepted(m.id);
    const same = current.find(item => item.sourceDigest === sourceDigest);
    if (same) {
      const { created_at, updated_at, imported_at, ...prior } = same.metadata;
      return { ok: true, status: 'duplicate', duplicateOf: same.proposalId,
        metadataDiffers: JSON.stringify(prior) !== JSON.stringify(m),
        proposal: await readProposal({ proposalId: same.proposalId }) };
    }
    const timestamp = now();
    if (typeof timestamp !== 'string' || Number.isNaN(Date.parse(timestamp)) || new Date(timestamp).toISOString() !== timestamp) fail('archive_unavailable', 'Archive clock is invalid');
    const record = { ...m, created_at: timestamp, updated_at: timestamp, imported_at: timestamp };
    const saved = { proposalId, state: 'LOCAL_UNACCEPTED', sourceDigest, revision: revision(record, sourceDigest), metadata: record, warnings: warningsFor(m, bodyText) };
    const serialized = JSON.stringify(saved, null, 2) + '\n';
    if (Buffer.byteLength(serialized, 'utf8') > MAX_RECORD_BYTES) fail('limit_reached', 'Proposed metadata and warnings exceed storage limit');
    const p = paths(proposalId);
    try {
      await publishFile(p.body, bytes);
      await publishFile(p.meta, serialized);
    } catch (e) {
      if (e.code === 'EEXIST') fail('revision_conflict', 'Proposal location already exists; do not overwrite');
      throw e;
    }
    return { ok: true, status: 'created', proposal: await readProposal({ proposalId }) };
  }
  function page({ saved, body, text }, { selection, offset = selection?.startByte ?? 0, expectedRevision, referenceOffset = 0, warningOffset },
    pageBytes, key) {
    if (!Number.isInteger(pageBytes) || pageBytes < 128 || pageBytes > maxReadBytes ||
        !Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(referenceOffset) || referenceOffset < 0 ||
        (warningOffset !== undefined && (!Number.isSafeInteger(warningOffset) || warningOffset < 0)) ||
        (expectedRevision !== undefined && (typeof expectedRevision !== 'string' || !digestPattern.test(expectedRevision)))) fail('invalid_input', 'Invalid read offset or revision');
    if ((selection !== undefined || offset !== 0 || referenceOffset !== 0 || warningOffset !== undefined) && !expectedRevision) fail('invalid_input', 'Selection or continuation requires expectedRevision');
    if (expectedRevision && expectedRevision !== saved.revision)
      fail('revision_conflict', `Requested revision ${expectedRevision} is unavailable; current revision is ${saved.revision}. Search/read evidence changed; start a new read.`);
    const range = selection === undefined ? { startByte: 0, endByte: body.length } : selection;
    if (!range || Object.keys(range).sort().join(',') !== 'endByte,startByte' ||
        !Number.isSafeInteger(range.startByte) || !Number.isSafeInteger(range.endByte) ||
        range.startByte < 0 || range.endByte < range.startByte || range.endByte > body.length ||
        offset < range.startByte || offset > range.endByte ||
        [range.startByte, range.endByte, offset].some(n => n < body.length && (body[n] & 0xc0) === 0x80))
      fail('invalid_input', 'Selection and offset must be ordered UTF-8 byte boundaries within the report');
    const allNotices = importantNotices(text);
    const pagedWarnings = warningOffset !== undefined || Buffer.byteLength(JSON.stringify(allNotices)) > 32 * 1024;
    const chunks = pagedWarnings ? noticeChunks(allNotices) : [];
    const warningIndex = warningOffset ?? 0;
    if (pagedWarnings && warningIndex > chunks.length) fail('invalid_input', 'Warning offset exceeds context chunks');
    const warningPage = pagedWarnings && warningIndex < chunks.length;
    const notices = pagedWarnings ? (warningPage ? [chunks[warningIndex]] : []) : allNotices;
    const warningContext = allNotices.length ? { ...noticeSignal(text, allNotices, key, saved.revision),
      mode: pagedWarnings ? 'paged' : 'inline', totalChunks: chunks.length,
      totalBytes: allNotices.reduce((sum, notice) => sum + notice.endByte - notice.startByte, 0),
      chunkNumber: warningPage ? warningIndex + 1 : null,
      remainingChunks: warningPage ? chunks.length - warningIndex - 1 : (pagedWarnings ? chunks.length : 0),
      contextOutstanding: pagedWarnings,
      ...(pagedWarnings ? { read: { ...key, expectedRevision: saved.revision, warningOffset: 0 } } : {}) } : null;
    let end = warningPage ? offset : Math.min(range.endByte, offset + pageBytes);
    // Never split a UTF-8 code point. Continuation is measured in original byte offsets.
    if (end < body.length) while (end > offset && (body[end] & 0xc0) === 0x80) end--;
    if (!warningPage && end === offset && offset < range.endByte) fail('invalid_input', 'Read offset must start on a UTF-8 boundary');
    let excerpt;
    try { excerpt = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(body.subarray(offset, end)); }
    catch { fail('invalid_input', 'Read offset must start on a UTF-8 boundary'); }
    // Find full reference tokens intersecting this page, including tokens split across pages.
    const startChar = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(body.subarray(0, offset)).length;
    const endChar = startChar + excerpt.length;
    const refs = [...new Set(referenceTokens(text)
      .filter(m => (m.index < endChar && m.index + m.text.length > startChar) ||
        notices.some(n => m.index < n.endChar && m.index + m.text.length > n.startChar)).map(m => m.label))];
    const definitions = referenceDefinitions(text);
    if (referenceOffset > refs.length) fail('invalid_input', 'Citation offset exceeds excerpt references');
    const slice = refs.slice(referenceOffset, referenceOffset + 12).map(label => {
      const matches = definitions.get(label) ?? [];
      if (matches.length !== 1) return { label, status: 'unresolved', ...(matches.length > 1 ? { reason: 'ambiguous_definitions' } : {}) };
      const match = matches[0];
      const line = text.slice(0, match.index).split('\n').length;
      if (Buffer.byteLength(JSON.stringify(match.definition)) <= 320) return { label, status: 'defined', target: match.target, line,
        ...(match.definition.includes('\n') ? { definition: match.definition } : {}) };
      const startByte = Buffer.byteLength(text.slice(0, match.index));
      const endByte = Buffer.byteLength(text.slice(0, match.end));
      return { label, status: 'read_at_line', line, byteOffset: startByte,
        read: { ...key, expectedRevision: saved.revision, selection: { startByte, endByte } } };
    });
    const nextReferenceOffset = referenceOffset + slice.length < refs.length ? referenceOffset + slice.length : null;
    const nextOffset = end < range.endByte ? end : null;
    if (warningContext && (nextReferenceOffset !== null || referenceOffset !== 0)) warningContext.contextOutstanding = true;
    const continuation = { ...key, expectedRevision: saved.revision, pageBytes, selection: range,
      ...(pagedWarnings ? { warningOffset: warningIndex } : {}) };
    const next = nextReferenceOffset !== null ? { ...continuation, referenceOffset: nextReferenceOffset, offset } :
      warningPage ? { ...continuation, warningOffset: warningIndex + 1, offset } :
      nextOffset !== null ? { ...continuation, offset: nextOffset } : null;
    return {
      ok: true, state: saved.state, ...(key.proposalId ? { proposalId: key.proposalId } : {}), reportId: saved.metadata.id,
      revision: saved.revision, sourceDigest: saved.sourceDigest, metadata: saved.metadata,
      warnings: saved.warnings, warningContext, notices: notices.map(({ startChar, endChar, ...notice }) => notice), selection: range,
      content: { text: excerpt, startByte: offset, endByte: end, totalBytes: body.length, truncated: nextOffset !== null, nextOffset },
      citations: slice, citationsTruncated: nextReferenceOffset !== null,
      pageType: warningPage ? 'warning_context' : 'body', continuation: next,
    };
  }
  async function readProposal(args, pageBytes = args.pageBytes ?? maxReadBytes) {
    await ready();
    cleanId(args.proposalId);
    let loaded;
    try { loaded = await load(args.proposalId); }
    catch (e) {
      if (args.expectedRevision && (e.code === 'not_found' || (e.code === 'archive_unavailable' && e.message === 'Proposal body is missing')))
        fail('revision_conflict', 'Requested proposal revision is unavailable; start a new read.');
      throw e;
    }
    return page(loaded, args, pageBytes, { proposalId: args.proposalId });
  }
  async function reportNames() {
    try { await noSymlinks(reports, true); }
    catch (e) { if (e.code === 'invalid_input') fail('catalogue_invalid', 'Reports path is unsafe; inspect before rebuilding'); throw e; }
    try {
      if (!(await fs.stat(reports)).isDirectory()) fail('catalogue_invalid', 'Reports location is not a directory');
      const names = await fs.readdir(reports);
      if (names.length > MAX_PROPOSALS || names.some(name => !/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(name) || name.length > 103))
        fail('catalogue_stale', 'Unexpected file or excess reports; inspect reports/ before rebuilding');
      // Index entries and search ties compare bare IDs; sorting full filenames
      // instead would put orchard-notes.md before orchard.md ("-" < ".").
      return names.sort((a, b) => a.slice(0, -3) < b.slice(0, -3) ? -1 : a.slice(0, -3) > b.slice(0, -3) ? 1 : 0);
    } catch (e) { if (e.code === 'ENOENT') return []; throw e; }
  }
  function validEntry(e) {
    if (!e || !id.safeParse(e.id).success || e.path !== `reports/${e.id}.md` || !digestPattern.test(e.revision ?? '') ||
        !digestPattern.test(e.sourceDigest ?? '') ||
        !Number.isSafeInteger(e.size) || e.size < 1 || e.size > MAX_REPORT_BYTES ||
        typeof e.mtimeMs !== 'number' || !Number.isFinite(e.mtimeMs) || e.mtimeMs < 0) return false;
    const { id: rid, path, revision: rev, sourceDigest, size, mtimeMs, warnings, ...m } = e;
    return safeRecord({ id: rid, ...m, warnings: [] }) &&
      Array.isArray(warnings) && warnings.length <= MAX_WARNINGS + 16 && warnings.every(w =>
        w && /^[a-z_]{1,48}$/.test(w.code ?? '') && typeof w.message === 'string' &&
        (w.code === 'report_warning' ? label.safeParse(w.message).success : Buffer.byteLength(w.message) <= 512));
  }
  async function catalogue({ first = false } = {}) {
    await ready();
    let raw;
    try { raw = await readRegular(indexPath, MAX_INDEX_BYTES); }
    catch (e) {
      if (e.code === 'invalid_input' || e.code === 'limit_reached')
        fail('catalogue_invalid', 'Catalogue file is unsafe or too large; inspect before rebuilding');
      if (e.code !== 'not_found') throw e;
      const names = await reportNames();
      if (first && names.length === 0) return { index: EMPTY_INDEX, revision: null };
      fail('catalogue_unavailable', 'Catalogue missing; run rebuild_catalogue after inspecting reports/');
    }
    let index;
    try { index = JSON.parse(utf8(raw)); }
    catch { fail('catalogue_invalid', 'Catalogue is invalid; inspect reports/ and run rebuild_catalogue'); }
    if (!index || index.version !== 1 || !Array.isArray(index.entries) || index.entries.length > MAX_PROPOSALS ||
        Object.keys(index).sort().join(',') !== 'entries,version' ||
        index.entries.some((e, i) => !validEntry(e) || (i > 0 && index.entries[i - 1].id >= e.id)) ||
        !raw.equals(indexBytes(index))) fail('catalogue_invalid', 'Catalogue is invalid; inspect reports/ and run rebuild_catalogue');
    const names = await reportNames();
    if (names.length !== index.entries.length || names.some((name, i) => name !== `${index.entries[i].id}.md`))
      fail('catalogue_stale', 'Accepted files and catalogue disagree; inspect reports/ and run rebuild_catalogue');
    for (const entry of index.entries) {
      const path = join(reports, `${entry.id}.md`);
      try {
        await noSymlinks(path);
        const st = await fs.lstat(path);
        if (!st.isFile() || st.size !== entry.size || st.mtimeMs !== entry.mtimeMs)
          fail('catalogue_stale', 'Accepted report changed since indexing; inspect reports/ and run rebuild_catalogue');
      } catch (e) {
        if (e.code === 'invalid_input' || e.code === 'not_found')
          fail('catalogue_stale', 'Indexed report path changed; inspect reports/ and run rebuild_catalogue');
        throw e;
      }
    }
    return { index, revision: sha(raw) };
  }
  async function acceptedFile(reportId) {
    cleanReportId(reportId);
    const path = join(reports, `${reportId}.md`);
    let bytes;
    try { bytes = await readRegular(path, MAX_REPORT_BYTES); }
    catch (e) { if (e.code === 'not_found') fail('catalogue_stale', 'Indexed report missing; run rebuild_catalogue'); throw e; }
    return { ...parseReport(bytes, reportId), bytes };
  }
  async function searchReports({ query, limit = maxSearchResults, offset = 0 }) {
    if (typeof query !== 'string' || Buffer.byteLength(query) > 512 || !query.trim() ||
        !Number.isInteger(limit) || limit < 1 || limit > maxSearchResults || !Number.isSafeInteger(offset) || offset < 0)
      fail('invalid_input', 'Search requires a short nonempty query, bounded limit and nonnegative offset');
    const { index, revision: catalogueRevision } = await catalogue();
    const terms = [...new Set(searchTerms(query))];
    if (terms.length === 0 || terms.length > 32) fail('invalid_input', 'Search query has no usable terms or too many terms');
    const ranked = index.entries.map(e => ({ entry: e, relevance: relevance(e, terms) }))
      .filter(e => e.relevance > 0).sort((a, b) => b.relevance - a.relevance || (a.entry.id < b.entry.id ? -1 : a.entry.id > b.entry.id ? 1 : 0));
    if (offset > ranked.length) fail('invalid_input', 'Search offset exceeds match count');
    return { ok: true, status: ranked.length ? 'matches' : 'empty', catalogueRevision,
      candidates: await Promise.all(ranked.slice(offset, offset + limit).map(async ({ entry, relevance: score }) => {
        // Inspect only the bounded returned shortlist, never expand the archive
        // into catalogue/model context or rewrite accepted metadata/history.
        const { text, bytes } = await acceptedFile(entry.id);
        if (sha(bytes) !== entry.revision) fail('catalogue_stale', 'Selected search report changed since indexing; rebuild after inspection');
        const notices = importantNotices(text);
        return { ...entry, relevance: score, ...(notices.length ? {
          warnings: [...entry.warnings, { code: 'body_notice', message: 'Report has correction/warning context; read the exact revision-bound context before reuse.' }],
          warningContext: { ...noticeSignal(text, notices, { reportId: entry.id }, entry.revision),
            contextOutstanding: true, read: { reportId: entry.id, expectedRevision: entry.revision, warningOffset: 0 } },
        } : {}) };
      })),
      nextOffset: offset + limit < ranked.length ? offset + limit : null,
      relevanceNote: 'Lexical relevance only; not verified, current or factual trust.' };
  }
  async function readAccepted(args, pageBytes = args.pageBytes ?? maxReadBytes) {
    await ready();
    cleanReportId(args.reportId);
    let requestedBytes;
    // Check the actual file before catalogue staleness: an unavailable requested
    // revision must be a conflict, never a continuation into changed evidence.
    if (args.expectedRevision !== undefined) {
      if (typeof args.expectedRevision !== 'string' || !digestPattern.test(args.expectedRevision)) fail('invalid_input', 'Invalid read revision');
      try { requestedBytes = await readRegular(join(reports, `${args.reportId}.md`), MAX_REPORT_BYTES); }
      catch (e) { if (e.code === 'not_found') fail('revision_conflict', `Requested revision ${args.expectedRevision} is unavailable; report is missing.`); throw e; }
      const current = sha(requestedBytes);
      if (current !== args.expectedRevision)
        fail('revision_conflict', `Requested revision ${args.expectedRevision} is unavailable; current revision is ${current}. Search/read evidence changed; start a new read.`);
    }
    const { index } = await catalogue();
    const entry = index.entries.find(e => e.id === args.reportId);
    if (!entry) fail('not_found', 'Accepted report not found in catalogue');
    const { saved, body, text, bytes } = requestedBytes
      ? { ...parseReport(requestedBytes, args.reportId), bytes: requestedBytes } : await acceptedFile(args.reportId);
    if (sha(bytes) !== entry.revision || JSON.stringify(entryFor(saved, entry.revision, bytes.length, entry.mtimeMs)) !== JSON.stringify(entry))
      fail('catalogue_stale', 'Accepted report and catalogue differ; inspect reports/ and run rebuild_catalogue');
    return page({ saved: { ...saved, revision: entry.revision, sourceDigest: saved.sourceDigest,
      state: 'LOCAL_ACCEPTED_UNPUBLISHED', warnings: entry.warnings }, body, text }, args, pageBytes, { reportId: args.reportId });
  }
  async function reviewProposal({ proposalId, acceptedAt = now(), expectedBaseRevision = null }) {
    await ready();
    cleanId(proposalId);
    if (expectedBaseRevision !== null) fail('revision_conflict', 'Revisions of accepted reports are not supported in this slice');
    if (typeof acceptedAt !== 'string' || Number.isNaN(Date.parse(acceptedAt)) ||
        new Date(acceptedAt).toISOString() !== acceptedAt) fail('invalid_input', 'Invalid acceptance timestamp');
    const { saved, body } = await load(proposalId);
    const { index, revision: expectedCatalogueRevision } = await catalogue({ first: true });
    await checkAccepted(saved.metadata.id);
    if (index.entries.some(entry => entry.sourceDigest === saved.sourceDigest))
      fail('duplicate_content', 'Identical content already accepted; inspect the existing report instead');
    const metadata = { ...saved.metadata, created_at: acceptedAt, updated_at: acceptedAt };
    const stored = { format: 1, metadata, warnings: saved.warnings, sourceDigest: saved.sourceDigest, proposalRevision: saved.revision };
    const header = Buffer.byteLength(JSON.stringify(stored, null, 2));
    if (header > MAX_RECORD_BYTES) fail('limit_reached', 'Accepted report header exceeds 24 KiB limit');
    const bytes = reportBytes(stored, body);
    if (bytes.length > MAX_REPORT_BYTES) fail('limit_reached', 'Accepted report exceeds storage limit');
    const changedFiles = [`reports/${metadata.id}.md`, 'INDEX.json'];
    const review = { proposalId, expectedRevision: saved.revision, expectedBaseRevision, acceptedAt,
      expectedCatalogueRevision, reportId: metadata.id, reportRevision: sha(bytes), sourceDigest: saved.sourceDigest,
      changedFiles, archiveRoot: archive };
    return { ok: true, status: 'review', review: { ...review, reviewDigest: sha(JSON.stringify(review)) },
      metadata, warnings: [...metadata.warnings.map(message => ({ code: 'report_warning', message })), ...saved.warnings],
      changeNote: 'New unpublished report and derived catalogue entry; original source and proposal unchanged. Review full body via read_research before approval.',
      catalogueEntriesBefore: index.entries.length };
  }
  async function replaceIndex(index) {
    const bytes = indexBytes(index);
    if (bytes.length > MAX_INDEX_BYTES) fail('limit_reached', 'Catalogue exceeds 8 MiB; inspect report metadata');
    await noSymlinks(indexPath, true);
    const temp = join(archive, `.catalogue-${randomUUID()}.tmp`);
    try {
      const fh = await fs.open(temp, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
      try { await fh.writeFile(bytes); await fh.sync(); } finally { await fh.close(); }
      await fs.rename(temp, indexPath);
      const dir = await fs.open(archive, constants.O_RDONLY);
      try { await dir.sync(); } finally { await dir.close(); }
    } finally { await fs.rm(temp, { force: true }); }
    return sha(bytes);
  }
  async function acceptProposal(args) {
    const { proposalId, expectedRevision, expectedBaseRevision, expectedCatalogueRevision, acceptedAt, expectedReviewDigest } = args;
    if (typeof expectedRevision !== 'string' || !digestPattern.test(expectedRevision) ||
        typeof expectedReviewDigest !== 'string' || !digestPattern.test(expectedReviewDigest) ||
        (expectedCatalogueRevision !== null && (typeof expectedCatalogueRevision !== 'string' || !digestPattern.test(expectedCatalogueRevision))))
      fail('invalid_input', 'Acceptance requires the reviewed revision, catalogue revision and digest');
    const result = await reviewProposal({ proposalId, acceptedAt, expectedBaseRevision });
    const { review } = result;
    if (review.expectedRevision !== expectedRevision || review.expectedCatalogueRevision !== expectedCatalogueRevision ||
        review.reviewDigest !== expectedReviewDigest) fail('revision_conflict', 'Review changed; inspect and approve a new review');
    const { saved, body } = await load(proposalId);
    const { index } = await catalogue({ first: true });
    const metadata = { ...saved.metadata, created_at: acceptedAt, updated_at: acceptedAt };
    const bytes = reportBytes({ format: 1, metadata, warnings: saved.warnings, sourceDigest: saved.sourceDigest, proposalRevision: saved.revision }, body);
    let linked = false;
    try {
      await writeCheckpoint('before_report');
      await noSymlinks(reports, true);
      await fs.mkdir(reports).catch(e => { if (e.code !== 'EEXIST') throw e; });
      await noSymlinks(reports);
      await publishFile(join(reports, `${review.reportId}.md`), bytes);
      linked = true;
      const reportDir = await fs.open(reports, constants.O_RDONLY);
      try { await reportDir.sync(); } finally { await reportDir.close(); }
      await writeCheckpoint('report_linked');
      const st = await fs.stat(join(reports, `${review.reportId}.md`));
      const entry = entryFor({ metadata, warnings: saved.warnings, sourceDigest: saved.sourceDigest }, review.reportRevision, bytes.length, st.mtimeMs);
      const next = { version: 1, entries: [...index.entries, entry].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0) };
      await writeCheckpoint('before_index');
      const catalogueRevision = await replaceIndex(next);
      return { ok: true, status: 'accepted_local_unpublished', reportId: review.reportId, revision: review.reportRevision,
        catalogueRevision, changedFiles: review.changedFiles, reviewDigest: review.reviewDigest,
        published: false, committed: false };
    } catch (e) {
      if (linked) fail('catalogue_stale', 'Report may be accepted but catalogue update failed; inspect files then run rebuild_catalogue. No commit or push occurred.');
      if (e.code === 'EEXIST') fail('revision_conflict', 'Accepted report already exists; no overwrite');
      throw e;
    }
  }
  async function rebuildCatalogue() {
    await ready();
    const entries = [];
    for (const name of await reportNames()) {
      const reportId = name.slice(0, -3);
      const { saved, bytes } = await acceptedFile(reportId);
      const st = await fs.stat(join(reports, name));
      entries.push(entryFor(saved, sha(bytes), bytes.length, st.mtimeMs));
    }
    const index = { version: 1, entries };
    const catalogueRevision = await replaceIndex(index);
    return { ok: true, status: 'rebuilt', catalogueRevision, reportCount: entries.length,
      changedFiles: ['INDEX.json'], published: false, committed: false };
  }
  function queued(action) { const next = serial.then(action); serial = next.catch(() => {}); return next; }
  return {
    importReport: input => queued(() => importReport(input)),
    readProposal, readAccepted, searchReports,
    reviewProposal: input => queued(() => reviewProposal(input)),
    acceptProposal: input => queued(() => acceptProposal(input)),
    rebuildCatalogue: () => queued(rebuildCatalogue),
  };
}
