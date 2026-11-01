// Private, finite research artifact codec. Not a filesystem tool or scheduler.
import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve, parse, sep } from 'node:path';
import { z } from 'zod';
import { sourceUrl } from './brave.js';

export const JOB_ID = /^job-[a-f0-9]{32}$/;
export const MATERIALS = Object.freeze(['request', 'plan', 'references', 'evidence', 'source-1', 'source-2', 'source-3', 'source-4', 'output']);
const suffix = kind => kind === 'evidence' ? 'sources' : kind;
const fail = () => { throw Error('artifact_unavailable'); };
const digest = z.string().regex(/^[a-f0-9]{64}$/), index = z.number().int().nonnegative();
const text = z.string().max(65536), date = z.string().refine(v => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString() === v);
const selection = z.object({ startByte: index, endByte: index }).strict().refine(v => v.endByte > v.startByte);
const notice = z.object({ text, startByte: index, endByte: index, startChar: index.optional(), endChar: index.optional(),
  noticeNumber: index.optional(), chunkNumber: index.optional(), chunkCount: index.optional() }).strict();
const citation = z.object({ label: text, status: z.enum(['defined', 'read_at_line']), target: text.optional(), line: index,
  definition: text.optional(), byteOffset: index.optional(), read: z.object({ reportId: text, expectedRevision: digest, selection }).strict().optional() }).strict();
const reference = z.object({ ref: z.string().regex(/^R[1-3]$/), reportId: text, revision: digest, selection,
  freshlyVerified: z.literal(false), content: text, notices: z.array(notice), citations: z.array(citation),
  warnings: z.array(z.object({ code: text, message: text }).strict()), scope: text,
  researched_at: text.nullable(), last_improved_at: text.nullable(),
  origin: z.object({ kind: z.enum(['imported', 'engine_generated']), platform: text, author: text, model: text }).strict(),
  superseded_by: text.nullable() }).strict();
const qualifications = z.lazy(() => z.object({ references: z.array(reference).max(3), partials: z.array(partial).max(3) }).strict());
const partial = z.object({ ref: z.string().regex(/^P[1-3]$/), jobId: z.string().regex(JOB_ID), artifact: z.enum(MATERIALS), revision: digest,
  selection, selectedSha256: digest, startedAt: date, priorIncomplete: z.literal(true), freshlyVerified: z.literal(false), content: text,
  qualifications }).strict();
const source = z.object({ ref: z.string().regex(/^S[1-4]$/), url: z.string().refine(v => { try { return sourceUrl(v) === v; } catch { return false; } }),
  title: z.string().max(120), offset: index.max(65536), nextOffset: index.max(65536 + 2400).optional(), truncated: z.boolean(), rawTruncated: z.boolean(),
  accessedAt: date, rawPrefixSha256: digest, visibleTextSha256: digest, excerpt: z.string().min(1).max(2400) }).strict()
  .refine(v => sha256(Buffer.from(v.excerpt)) === v.visibleTextSha256);
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export async function checkedDirectory(path) {
  const full = resolve(path), root = parse(full).root;
  let current = root;
  for (const part of full.slice(root.length).split(sep).filter(Boolean)) {
    current = join(current, part);
    const stat = await fs.lstat(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) fail();
  }
}
async function readBytes(path) {
  await checkedDirectory(parse(path).dir);
  const handle = await fs.open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > 65536) fail();
    const buffer = Buffer.alloc(65537);
    let length = 0;
    while (length < buffer.length) {
      const read = await handle.read(buffer, length, buffer.length - length, null);
      if (!read.bytesRead) break;
      length += read.bytesRead;
    }
    const after = await handle.stat();
    if (length > 65536 || after.size !== stat.size || after.mtimeMs !== stat.mtimeMs) fail();
    const bytes = buffer.subarray(0, length);
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return bytes;
  } finally { await handle.close(); }
}
export function researchArtifacts(workRoot, { screen, validateRequest, validateStatus }) {
  const directory = join(resolve(workRoot), 'jobs');
  const path = (id, kind) => {
    if (!JOB_ID.test(id) || !/^(?:record|running|state-[1-9][0-9]?|request|plan|references|evidence|source-[1-4]|output)$/.test(kind)) fail();
    return join(directory, `${id}${kind === 'record' ? '' : '.' + suffix(kind)}.json`);
  };
  const ref = (id, kind) => `jobs/${id}${kind === 'record' ? '' : '.' + suffix(kind)}.json`;
  async function write(id, kind, value, signal) {
    signal?.throwIfAborted();
    const bytes = Buffer.from(JSON.stringify(value) + '\n');
    if (bytes.length > 65536 || !screen(bytes.toString('utf8'))) fail();
    await checkedDirectory(directory); signal?.throwIfAborted();
    const handle = await fs.open(path(id, kind), constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
    try {
      signal?.throwIfAborted(); await handle.writeFile(bytes);
      signal?.throwIfAborted(); await handle.sync(); signal?.throwIfAborted();
    } finally { await handle.close(); }
    return ref(id, kind);
  }
  async function read(id, kind) {
    const bytes = await readBytes(path(id, kind));
    if (!screen(bytes.toString('utf8'))) fail();
    const value = JSON.parse(bytes.toString('utf8'));
    if (!screen(JSON.stringify(value))) fail(); // Screen decoded escaped credentials too.
    return { bytes, value, revision: sha256(bytes) };
  }
  function envelope(job, data, qualifications = { references: [], partials: [] }) {
    return { version: 1, jobId: job.jobId, startedAt: job.startedAt, qualifications, data };
  }
  async function material(id, kind) {
    if (!MATERIALS.includes(kind)) fail();
    const result = await read(id, kind), v = result.value;
    // Old #7 files remain locally readable, but are explicitly unsupported by
    // this revision-bound continuation codec (they lack immutable provenance).
    if (v && typeof v === 'object' && (v.version !== undefined && v.version !== 1 ||
        v.version === undefined && (kind === 'plan' && typeof v.plan === 'string' || kind === 'evidence' && Array.isArray(v.sources)))) throw Error('artifact_unsupported');
    if (!v || Object.keys(v).sort().join(',') !== 'data,jobId,qualifications,startedAt,version' || v.version !== 1 || v.jobId !== id ||
        typeof v.startedAt !== 'string' || new Date(v.startedAt).toISOString() !== v.startedAt ||
        !v.qualifications || Object.keys(v.qualifications).sort().join(',') !== 'partials,references' ||
        !Array.isArray(v.qualifications.references) || !Array.isArray(v.qualifications.partials) ||
        !qualifications.safeParse(v.qualifications).success) fail();
    if (kind === 'request') validateRequest(v.data);
    else if (kind === 'plan') {
      if (!v.data || Object.keys(v.data).join(',') !== 'plan' || typeof v.data.plan !== 'string' || v.data.plan.length > 200) fail();
    } else if (kind === 'output') {
      if (typeof v.data !== 'string' || Buffer.byteLength(v.data) > 65536) fail();
    } else if (kind === 'references') {
      if (!qualifications.safeParse(v.data).success) fail();
    } else if (kind === 'evidence') {
      if (!z.object({ sources: z.array(source).max(4), references: z.array(reference).max(3), partials: z.array(partial).max(3), evidencePlan: z.string().max(200).optional() }).strict().safeParse(v.data).success) fail();
    } else if (!source.safeParse(v.data).success) fail();
    return result;
  }
  return { directory, ref, write, read, envelope, material,
    async prepare(signal) {
      await checkedDirectory(workRoot); signal?.throwIfAborted();
      await fs.mkdir(directory, { mode: 0o700 }).catch(e => { if (e.code !== 'EEXIST') throw e; });
      signal?.throwIfAborted(); await checkedDirectory(directory);
    },
    async ids() {
      await checkedDirectory(workRoot);
      try { await checkedDirectory(directory); }
      catch (e) { if (e.code === 'ENOENT') return []; throw e; }
      const ids = new Set();
      for await (const entry of await fs.opendir(directory)) {
        const match = /^(job-[a-f0-9]{32})(?:\.(?:running|request|plan|sources|references|source-[1-4]|output|state-[1-9][0-9]?))?\.json$/.exec(entry.name);
        if (match) ids.add(match[1]);
      }
      return ids;
    },
    async states(id) {
      const states = [];
      for await (const entry of await fs.opendir(directory)) {
        const match = new RegExp(`^${id}\\.state-([1-9][0-9]?)\\.json$`).exec(entry.name);
        if (match) states.push(Number(match[1]));
      }
      return states.sort((a, b) => a - b);
    },
    async status(id) { return validateStatus((await read(id, 'record')).value); },
  };
}
