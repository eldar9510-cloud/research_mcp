import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive, ArchiveError } from '../src/archive.js';
import { fixture, metadata, roots } from './support.js';

const errorCode = code => e => e instanceof ArchiveError && e.code === code;

test('imports exact Markdown bytes; metadata is complete but original history stays unknown', async t => {
  const r = await roots(t);
  const before = await fs.readFile(r.path);
  const a = createArchive({ ...r, now: () => '2026-11-01T00:00:00.000Z' });
  const result = await a.importReport({ sourcePath: r.path, metadata: metadata() });
  assert.equal(result.status, 'created');
  const p = result.proposal;
  assert.equal(p.state, 'LOCAL_UNACCEPTED');
  assert.equal(p.metadata.researched_at, null);
  assert.equal(p.metadata.last_improved_at, null);
  assert.equal(p.metadata.imported_at, '2026-11-01T00:00:00.000Z');
  assert.match(p.content.text, /Method B: two shorter cycles/);
  assert.ok(p.warnings.some(w => w.code === 'unresolved_citation'));
  assert.ok(p.warnings.some(w => w.code === 'local_dependency'));
  assert.ok(p.warnings.some(w => w.code === 'transcript_dependency'));
  assert.deepEqual(await fs.readFile(r.path), before);
  assert.deepEqual(await fs.readFile(join(r.workRoot, 'proposals', `${p.proposalId}.body`)), before);
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  assert.match(p.sourceDigest, /^[a-f0-9]{64}$/);
  assert.match(p.revision, /^[a-f0-9]{64}$/);
  const restored = createArchive(r);
  assert.deepEqual((await restored.readProposal({ proposalId: p.proposalId })).revision, p.revision);
});

test('plain text and malicious instructions remain text, never an action or approval', async t => {
  const r = await roots(t);
  const source = await fs.readFile(fixture('untrusted.txt'), 'utf8');
  const a = createArchive(r);
  const oldFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw Error('network/model operation forbidden'); };
  try {
    const draft = await a.importReport({ text: source, metadata: metadata('pond-pumps') });
    assert.equal(draft.proposal.content.text, source);
    assert.ok(draft.proposal.warnings.some(w => w.code === 'untrusted_instructions'));
    assert.equal((await a.readProposal({ proposalId: draft.proposal.proposalId })).content.text, source);
    assert.deepEqual(await fs.readdir(r.archiveRoot), []);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = oldFetch; }
});

test('exact-content duplicate ignores newly assigned timestamps, different ID and title; stable ID conflict wins', async t => {
  const r = await roots(t);
  let tick = 0;
  const a = createArchive({ ...r, now: () => new Date(1730000000000 + tick++ * 1000).toISOString() });
  const one = await a.importReport({ sourcePath: r.path, metadata: metadata() });
  const other = metadata('different-slug'); other.title = 'Totally different title';
  const same = await a.importReport({ sourcePath: r.path, metadata: other });
  assert.equal(same.status, 'duplicate');
  assert.equal(same.duplicateOf, one.proposal.proposalId);
  assert.equal(same.proposal.metadata.id, 'orchard-water');
  assert.equal(tick, 1);
  await assert.rejects(a.importReport({ text: 'Different report text', metadata: metadata() }), errorCode('revision_conflict'));
  assert.equal((await fs.readdir(join(r.workRoot, 'proposals'))).length, 2);
  other.title = metadata().title; // matching title is never automatic merging
  const distinct = await a.importReport({ text: 'Different report text', metadata: other });
  assert.equal(distinct.status, 'created');
  assert.notEqual(distinct.proposal.proposalId, one.proposal.proposalId);
});

test('rejects malformed metadata, unsupported source, bad relationships and dates', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  for (const bad of [
    { ...metadata(), id: '../escape' }, { ...metadata(), researched_at: '2026-02-30' },
    { ...metadata(), origin: { kind: 'imported', platform: 'unknown', author: 'unknown', model: 'unknown', key: 'SHOULD_NOT_LEAK' } },
    { ...metadata(), created_at: '2026-01-01T00:00:00Z' },
    { ...metadata(), related_reports: [{ id: 'orchard-water', relationship: 'reuses' }] },
    { ...metadata(), related_reports: [{ id: 'other', relationship: 'reuses' }, { id: 'other', relationship: 'corrects' }] },
    { ...metadata(), superseded_by: 'orchard-water' },
    { ...metadata(), question: '' }, { ...metadata(), language: 'en; rm -rf' },
    { ...metadata(), warnings: Array(16).fill('á'.repeat(500)) },
  ]) await assert.rejects(a.importReport({ text: 'valid body', metadata: bad }), errorCode('invalid_input'));
  for (const input of [ { text: '' }, { text: '\0abc' }, { text: 'x', sourcePath: r.path }, { sourcePath: null, text: 'x' } ]) {
    await assert.rejects(a.importReport({ ...input, metadata: metadata() }), errorCode('invalid_input'));
  }
  assert.deepEqual(await fs.readdir(join(r.workRoot, 'proposals')), []);
  const invalidBytes = join(r.importRoot, 'invalid.md');
  await fs.writeFile(invalidBytes, Buffer.from([0xff]));
  await assert.rejects(a.importReport({ sourcePath: invalidBytes, metadata: metadata() }), errorCode('invalid_input'));
  await assert.rejects(a.importReport({ text: 'a'.repeat(2 * 1024 * 1024 + 1), metadata: metadata() }), errorCode('limit_reached'));
  const fakeKey = 'AKIA' + 'A'.repeat(16); // synthetic test string, not a usable credential
  await assert.rejects(a.importReport({ text: `private key: ${fakeKey}`, metadata: metadata() }), e => errorCode('invalid_input')(e) && !e.message.includes(fakeKey));
  await assert.rejects(a.importReport({ text: 'report', metadata: { ...metadata(), summary: `api_key=${fakeKey}` } }), errorCode('invalid_input'));
  assert.deepEqual(await fs.readdir(join(r.workRoot, 'proposals')), []);
});

test('rejects traversal, symlink escapes, work symlink and accepted-ID conflict', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const outside = join(r.root, 'outside.md');
  await fs.writeFile(outside, 'private source must not be read');
  const link = join(r.importRoot, 'escape.md');
  await fs.symlink(outside, link);
  const dirlink = join(r.importRoot, 'alias');
  await fs.symlink(r.root, dirlink);
  for (const sourcePath of [outside, join(r.importRoot, '..', 'outside.md'), link, join(dirlink, 'outside.md'), '/etc/passwd']) {
    await assert.rejects(a.importReport({ sourcePath, metadata: metadata() }), errorCode('invalid_input'));
  }
  for (const proposalId of ['../escape', 'proposal-../escape', 'orchard-water']) {
    await assert.rejects(a.readProposal({ proposalId }), errorCode('invalid_input'));
  }
  await fs.mkdir(join(r.archiveRoot, 'reports'));
  await fs.writeFile(join(r.archiveRoot, 'reports', 'orchard-water.md'), 'accepted distinct report');
  await assert.rejects(a.importReport({ sourcePath: r.path, metadata: metadata() }), errorCode('revision_conflict'));
  const r2 = await roots(t);
  await fs.symlink(r.root, join(r2.workRoot, 'proposals'));
  await assert.rejects(createArchive(r2).importReport({ sourcePath: r2.path, metadata: metadata() }), errorCode('invalid_input'));
  assert.equal(await fs.readFile(outside, 'utf8'), 'private source must not be read');
});

test('long report pages use exact UTF-8 byte offsets, revision checks, and citation definitions outside selection', async t => {
  const r = await roots(t);
  const fragment = await fs.readFile(fixture('long-fragment.md'), 'utf8');
  const body = `Intro [calibration][cal]\n\n${'😀evidence\n'.repeat(500)}${fragment}`;
  const a = createArchive({ ...r, maxReadBytes: 211 });
  const created = await a.importReport({ text: body, metadata: metadata() });
  let p = created.proposal;
  assert.equal(p.content.truncated, true);
  assert.equal(p.citations[0].target, 'https://example.org/fictitious-calibration');
  let assembled = '';
  let count = 0;
  while (true) {
    assembled += p.content.text;
    if (!p.continuation) break;
    await assert.rejects(a.readProposal({ proposalId: p.proposalId, offset: p.content.endByte }), errorCode('invalid_input'));
    p = await a.readProposal(p.continuation);
    assert.ok(Buffer.byteLength(p.content.text, 'utf8') <= 211);
    assert.ok(++count < 100);
  }
  assert.equal(assembled, body);
  assert.equal(p.content.nextOffset, null);
  await assert.rejects(a.readProposal({ proposalId: p.proposalId, offset: 4, expectedRevision: '0'.repeat(64) }), errorCode('revision_conflict'));
  await assert.rejects(a.readProposal({ proposalId: p.proposalId, offset: Buffer.byteLength('Intro [calibration][cal]\n\n') + 1, expectedRevision: p.revision }), errorCode('invalid_input'));
  const bodyFile = join(r.workRoot, 'proposals', `${p.proposalId}.body`);
  await fs.appendFile(bodyFile, 'tampered');
  await assert.rejects(a.readProposal({ proposalId: p.proposalId }), errorCode('revision_conflict'));
});

test('UTF-8 BOM and CRLF survive in raw body and preview', async t => {
  const r = await roots(t);
  const bytes = Buffer.from('\ufeffNotes\r\nAlternatives\r\n', 'utf8');
  await fs.writeFile(r.path, bytes);
  const a = createArchive(r);
  const p = (await a.importReport({ sourcePath: r.path, metadata: metadata() })).proposal;
  assert.equal(p.content.text, '\ufeffNotes\r\nAlternatives\r\n');
  assert.deepEqual(await fs.readFile(join(r.workRoot, 'proposals', `${p.proposalId}.body`)), bytes);
});

test('citation pagination keeps the excerpt and definition targets bound to one revision', async t => {
  const r = await roots(t);
  const labels = Array.from({ length: 18 }, (_, i) => `ref${String(i).padStart(2, '0')}`);
  const body = `See ${labels.map(x => `[a][${x}]`).join(' ')}.\n\n${labels.map(x => `[${x}]: https://example.org/${x}`).join('\n')}\n`;
  const a = createArchive({ ...r, maxReadBytes: 256 });
  const first = (await a.importReport({ text: body, metadata: metadata() })).proposal;
  assert.equal(first.citations.length, 12);
  assert.equal(first.citationsTruncated, true);
  assert.equal(first.continuation.offset, 0);
  assert.equal(first.continuation.referenceOffset, 12);
  const second = await a.readProposal(first.continuation);
  assert.equal(second.content.text, first.content.text);
  assert.equal(second.citations.length, 6);
  assert.equal(second.citationsTruncated, false);
  assert.equal(second.continuation.offset, first.content.nextOffset);
  assert.equal(second.citations[0].target, 'https://example.org/ref12');
});

test('rejects symlinked proposal metadata and tampered timestamps', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const pid = (await a.importReport({ sourcePath: r.path, metadata: metadata() })).proposal.proposalId;
  const path = join(r.workRoot, 'proposals', `${pid}.json`);
  const initial = JSON.parse(await fs.readFile(path, 'utf8'));
  await fs.writeFile(path, JSON.stringify({ ...initial, metadata: { ...initial.metadata, imported_at: '2020-01-01T00:00:00.000Z' } }));
  await assert.rejects(a.readProposal({ proposalId: pid }), errorCode('revision_conflict'));
  await fs.writeFile(path, JSON.stringify({ ...initial, warnings: [{ code: 'fake', message: 'x'.repeat(10000) }] }));
  await assert.rejects(a.readProposal({ proposalId: pid }), errorCode('archive_unavailable'));
  await fs.rm(path);
  await fs.symlink(fixture('field-notes.md'), path);
  await assert.rejects(a.readProposal({ proposalId: pid }), errorCode('invalid_input'));
});

test('import is serialized; no two proposals for same bytes', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const [first, second] = await Promise.all([a.importReport({ sourcePath: r.path, metadata: metadata() }), a.importReport({ sourcePath: r.path, metadata: metadata() })]);
  assert.deepEqual([first.status, second.status], ['created', 'duplicate']);
});
