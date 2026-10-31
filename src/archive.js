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
const MAX_PROPOSALS = 10000;
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
  let fh;
  try {
    fh = await fs.open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
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
function referenceTokens(text) {
  return [
    ...text.matchAll(/\[[^\]\n]{1,80}\]\[([^\]\n]{1,80})\]/g),
    ...text.matchAll(/\[\^([^\]\n]{1,80})\](?!:)/g),
    ...text.matchAll(/\[(\d{1,6})\](?![:(])/g),
  ];
}
function warningsFor(meta, text) {
  const warnings = [];
  const add = (code, message) => warnings.push({ code, message });
  if (meta.researched_at === null) add('unknown_research_date', 'Original research date unknown; import is not verification.');
  if (meta.origin.platform === 'unknown' || meta.origin.author === 'unknown') add('unknown_origin', 'Original platform or author unknown; review attribution.');
  if (/\b(?:file:\/\/|[A-Za-z]:\\)|(?<![\w./:])(?:\.\.?\/|\/(?:home|tmp|Users)\/)/i.test(text)) add('local_dependency', 'Local file reference may not be portable; review before publication.');
  if (/\b(?:transcript|chat log|conversation-only|private conversation)\b/i.test(text)) add('transcript_dependency', 'Possible transcript-only evidence; review before publication.');
  const definitions = new Set([...text.matchAll(/^\[([^\]\n]{1,80})\]:[ \t]*\S+/gm)].map(m => m[1].toLowerCase()));
  const references = referenceTokens(text);
  if (references.some(m => !definitions.has(m[1].toLowerCase()) && !definitions.has(`^${m[1].toLowerCase()}`))) add('unresolved_citation', 'Unresolved Markdown reference or footnote; no target was invented.');
  if (/\b(?:ignore (?:previous|all) instructions|reveal (?:secrets|credentials)|publish (?:this|unrelated)|send (?:secrets|credentials))\b/i.test(text)) add('untrusted_instructions', 'Report may contain instructions; treat as untrusted source text, never authorization.');
  for (const r of meta.related_reports) add('unverified_relationship', `Relationship to ${r.id} is unverified until reviewed.`);
  if (meta.superseded_by) add('unverified_supersession', 'Supersession link is unverified until reviewed.');
  add('unverified_import', 'Imported claims and publication rights have not been checked.');
  return warnings.slice(0, 36);
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

/** Import is serialized within this instance; separate processes must not share a work root. */
export function createArchive({ archiveRoot, workRoot, importRoot, maxReadBytes = 2048, now = () => new Date().toISOString() }) {
  if (![archiveRoot, workRoot, importRoot].every(p => typeof p === 'string' && isAbsolute(p)) ||
      !Number.isInteger(maxReadBytes) || maxReadBytes < 128 || maxReadBytes > 8192) fail('invalid_input', 'Absolute archive, work and import roots and read limit 128..8192 are required');
  const roots = [archiveRoot, workRoot, importRoot].map(p => resolve(p));
  if (roots.some((p, i) => roots.some((q, j) => i !== j && (p === q || inside(p, q) || inside(q, p))))) {
    fail('invalid_input', 'Archive, work and import roots must be disjoint');
  }
  const [archive, work, source] = roots;
  const proposals = join(work, 'proposals');
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
    try { raw = await readRegular(p.meta, 16000); }
    catch (e) { if (e.code === 'not_found') fail('not_found', 'Proposal not found'); throw e; }
    let saved;
    try { saved = JSON.parse(utf8(raw)); } catch { fail('archive_unavailable', 'Proposal metadata is invalid'); }
    if (!saved || saved.state !== 'LOCAL_UNACCEPTED' || saved.proposalId !== pid || !digestPattern.test(saved.sourceDigest ?? '') ||
        !digestPattern.test(saved.revision ?? '') || !safeStoredMetadata(saved.metadata) ||
        !Array.isArray(saved.warnings) || saved.warnings.length > 36 ||
        !saved.warnings.every(w => w && typeof w.code === 'string' && /^[a-z_]{1,48}$/.test(w.code) &&
          typeof w.message === 'string' && Buffer.byteLength(w.message, 'utf8') <= 512)) fail('archive_unavailable', 'Proposal metadata is invalid');
    let body;
    try { body = await readRegular(p.body, MAX_SOURCE_BYTES); } catch (e) { if (e.code === 'not_found') fail('archive_unavailable', 'Proposal body is missing'); throw e; }
    if (sha(body) !== saved.sourceDigest || revision(saved.metadata, saved.sourceDigest) !== saved.revision) fail('revision_conflict', 'Stored proposal revision changed');
    const text = utf8(body);
    return { saved, body, text };
  }
  function safeStoredMetadata(m) {
    if (!m || !safeMetadataShape(m) || typeof m.created_at !== 'string' || typeof m.updated_at !== 'string' || typeof m.imported_at !== 'string') return false;
    return [m.created_at, m.updated_at, m.imported_at].every(x => {
      const time = new Date(x);
      return !Number.isNaN(time.getTime()) && time.toISOString() === x;
    });
  }
  function safeMetadataShape(m) {
    const { created_at, updated_at, imported_at, ...input } = m;
    return importMetadata.safeParse(input).success;
  }
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
    const reports = join(archive, 'reports');
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
    const p = paths(proposalId);
    try {
      await publishFile(p.body, bytes);
      await publishFile(p.meta, JSON.stringify(saved, null, 2) + '\n');
    } catch (e) {
      if (e.code === 'EEXIST') fail('revision_conflict', 'Proposal location already exists; do not overwrite');
      throw e;
    }
    return { ok: true, status: 'created', proposal: await readProposal({ proposalId }) };
  }
  async function readProposal({ proposalId, offset = 0, expectedRevision, referenceOffset = 0 }) {
    await ready();
    cleanId(proposalId);
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(referenceOffset) || referenceOffset < 0 ||
        (expectedRevision !== undefined && (typeof expectedRevision !== 'string' || !digestPattern.test(expectedRevision)))) fail('invalid_input', 'Invalid read offset or revision');
    if ((offset !== 0 || referenceOffset !== 0) && !expectedRevision) fail('invalid_input', 'Continuation requires expectedRevision');
    const { saved, body, text } = await load(proposalId);
    if (expectedRevision && expectedRevision !== saved.revision) fail('revision_conflict', 'Proposal revision differs from requested revision');
    if (offset > body.length) fail('invalid_input', 'Read offset exceeds proposal length');
    let end = Math.min(body.length, offset + maxReadBytes);
    // Never split a UTF-8 code point. Continuation is measured in original byte offsets.
    if (end < body.length) while (end > offset && (body[end] & 0xc0) === 0x80) end--;
    if (end === offset && offset < body.length) fail('invalid_input', 'Read offset must start on a UTF-8 boundary');
    let excerpt;
    try { excerpt = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(body.subarray(offset, end)); }
    catch { fail('invalid_input', 'Read offset must start on a UTF-8 boundary'); }
    // Find full reference tokens intersecting this page, including tokens split across pages.
    const startChar = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(body.subarray(0, offset)).length;
    const endChar = startChar + excerpt.length;
    const refs = [...new Set(referenceTokens(text)
      .filter(m => m.index < endChar && m.index + m[0].length > startChar).map(m => m[1].toLowerCase()))];
    const definitions = [...text.matchAll(/^\[([^\]\n]{1,80})\]:[ \t]*(\S.*)$/gm)];
    const citations = refs.map(label => {
      const match = definitions.find(d => d[1].toLowerCase() === label || d[1].toLowerCase() === `^${label}`);
      if (!match) return { label, status: 'unresolved' };
      const line = text.slice(0, match.index).split('\n').length;
      const target = match[2].trim();
      return target.length <= 256 ? { label, status: 'defined', target, line } :
        { label, status: 'read_at_line', line, byteOffset: Buffer.byteLength(text.slice(0, match.index), 'utf8') };
    });
    if (referenceOffset > citations.length) fail('invalid_input', 'Citation offset exceeds excerpt references');
    const slice = citations.slice(referenceOffset, referenceOffset + 12);
    const nextReferenceOffset = referenceOffset + slice.length < citations.length ? referenceOffset + slice.length : null;
    const nextOffset = end < body.length ? end : null;
    return {
      ok: true, state: saved.state, proposalId, reportId: saved.metadata.id,
      revision: saved.revision, sourceDigest: saved.sourceDigest, metadata: saved.metadata,
      warnings: saved.warnings,
      content: { text: excerpt, startByte: offset, endByte: end, totalBytes: body.length, truncated: nextOffset !== null, nextOffset },
      citations: slice, citationsTruncated: nextReferenceOffset !== null,
      continuation: nextOffset === null && nextReferenceOffset === null ? null :
        { proposalId, expectedRevision: saved.revision,
          ...(nextReferenceOffset !== null ? { referenceOffset: nextReferenceOffset, offset } : { offset: nextOffset }) },
    };
  }
  return {
    importReport(input) {
      const next = serial.then(() => importReport(input));
      serial = next.catch(() => {});
      return next;
    },
    readProposal,
  };
}
