import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { ArchiveError, createArchive } from '../src/archive.js';
import { metadata, roots } from './support.js';

const code = wanted => e => e instanceof ArchiveError && e.code === wanted;
const bytes = text => Buffer.byteLength(text);
const digest = text => createHash('sha256').update(text).digest('hex');
const acceptArgs = review => ({ proposalId: review.proposalId, expectedRevision: review.expectedRevision,
  expectedBaseRevision: review.expectedBaseRevision, expectedCatalogueRevision: review.expectedCatalogueRevision,
  acceptedAt: review.acceptedAt, expectedReviewDigest: review.reviewDigest });

async function collect(read, first, check = () => {}) {
  let page = first;
  let assembled = '';
  let lastStart = -1;
  const citations = new Map();
  for (let count = 0; ; count++) {
    assert.ok(count < 200, 'finite, progressing continuation');
    check(page);
    if (page.content.startByte !== lastStart) assembled += page.content.text;
    lastStart = page.content.startByte;
    for (const citation of page.citations) citations.set(citation.label, citation);
    if (!page.continuation) break;
    const next = await read(page.continuation);
    assert.equal(next.revision, first.revision);
    assert.deepEqual(next.selection, first.selection);
    if (page.continuation.referenceOffset !== undefined) {
      assert.deepEqual(next.content, page.content, 'citation-only pages cannot move the body window');
    } else assert.equal(next.content.startByte, page.content.endByte);
    page = next;
  }
  return { assembled, citations, last: page };
}

test('selected UTF-8 ranges retain later corrections, successor, dates and cross-page imported citations', async t => {
  const r = await roots(t);
  const prefix = '\ufeff# Investigation\r\n' + 'Old analysis 😀\r\n'.repeat(60) + '## Reusable finding\r\n';
  const selected = '  [Claim][  Remote   Source ] [collapsed][] [Shortcut] [^long] [missing] citeturn7search2\r\n' + 'évidence 😀\r\n'.repeat(35);
  const notice = '## Corrections and limitations\r\nKnown error: the old estimate is wrong. This report is superseded by successor-report. See [replacement][next].\r\n\r\n';
  const longDefinition = '[^long]: Explanation from the imported report.\r\n    ' + 'Original detail 😀 '.repeat(40) + '\r\n';
  const text = prefix + selected + '## Other findings\r\nExcluded material.\r\n' + notice + '## References\r\n' +
    '[remote source]: https://example.org/source\r\n[collapsed]: https://example.org/collapsed\r\n[shortcut]: https://example.org/shortcut\r\n' +
    longDefinition + '[next]: https://example.org/corrected\r\n';
  const meta = { ...metadata('selected-report'), superseded_by: 'successor-report',
    researched_at: '2020-01-02', last_improved_at: '2025-03-04', warnings: ['An older estimate is wrong.'] };
  const a = createArchive({ ...r, maxReadBytes: 133 });
  const p = (await a.importReport({ text, metadata: meta })).proposal;
  const selection = { startByte: bytes(prefix), endByte: bytes(prefix + selected) };
  const first = await a.readProposal({ proposalId: p.proposalId, expectedRevision: p.revision, selection });
  const { assembled, citations, last } = await collect(a.readProposal, first, page => {
    assert.equal(page.proposalId, p.proposalId);
    assert.equal(page.reportId, meta.id);
    assert.equal(page.metadata.scope, meta.scope);
    assert.equal(page.metadata.researched_at, '2020-01-02');
    assert.equal(page.metadata.last_improved_at, '2025-03-04');
    assert.equal(page.metadata.superseded_by, 'successor-report');
    assert.deepEqual(page.metadata.warnings, meta.warnings);
    assert.ok(page.warnings.some(w => w.code === 'unverified_supersession'));
    assert.ok(page.notices.some(n => n.text === notice));
    assert.ok(bytes(page.content.text) <= 133);
  });
  assert.equal(assembled, selected);
  assert.equal(last.content.endByte, selection.endByte);
  assert.equal(last.content.nextOffset, null);
  assert.equal(last.content.truncated, false, 'end of selection, not necessarily end of document');
  assert.equal(citations.get('remote source').target, 'https://example.org/source');
  assert.equal(citations.get('collapsed').target, 'https://example.org/collapsed');
  assert.equal(citations.get('shortcut').target, 'https://example.org/shortcut');
  assert.equal(citations.get('missing').status, 'unresolved');
  assert.equal(citations.get('turn7search2').status, 'unresolved');
  assert.equal(citations.get('next').target, 'https://example.org/corrected', 'notice citations resolve too');
  const reference = citations.get('^long');
  assert.equal(reference.status, 'read_at_line');
  assert.equal(reference.read.expectedRevision, p.revision);
  const resolved = await collect(a.readProposal, await a.readProposal(reference.read));
  assert.equal(resolved.assembled, longDefinition.slice(0, -1));
  const complete = await collect(a.readProposal, await a.readProposal({ proposalId: p.proposalId }));
  assert.equal(complete.assembled, text, 'selection never prevents complete access to the exact original');
});

test('selection rejects missing revision, malformed ranges and code-point interiors; empty and EOD are explicit', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, maxReadBytes: 128 });
  const text = 'A😀éZ';
  const p = (await a.importReport({ text, metadata: metadata() })).proposal;
  const args = { proposalId: p.proposalId, expectedRevision: p.revision };
  await assert.rejects(a.readProposal({ proposalId: p.proposalId, selection: { startByte: 0, endByte: 1 } }), code('invalid_input'));
  for (const selection of [null, {}, { startByte: -1, endByte: 1 }, { startByte: 2, endByte: 5 },
    { startByte: 0, endByte: 2 }, { startByte: 6, endByte: 7 }, { startByte: 0, endByte: 100 },
    { startByte: 2, endByte: 1 }, { startByte: 0.5, endByte: 1 }, { startByte: 0, endByte: 1, ignored: 1 }]) {
    await assert.rejects(a.readProposal({ ...args, selection }), code('invalid_input'));
  }
  await assert.rejects(a.readProposal({ ...args, selection: { startByte: 1, endByte: 5 }, offset: 0 }), code('invalid_input'));
  await assert.rejects(a.readProposal({ ...args, offset: 2 }), code('invalid_input'));
  for (const request of [{ ...args, offset: bytes(text) }, { ...args, selection: { startByte: 1, endByte: 1 } }]) {
    const end = await a.readProposal(request);
    assert.equal(end.content.text, '');
    assert.equal(end.content.truncated, false);
    assert.equal(end.content.nextOffset, null);
    assert.equal(end.continuation, null);
  }
  assert.equal((await a.readProposal({ ...args, selection: { startByte: 1, endByte: 5 } })).content.text, '😀');
});

test('tokens intersecting either byte boundary resolve; ambiguous and empty definitions stay visibly unresolved', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, maxReadBytes: 128 });
  const text = '😀prefix [Source][outside] [blank] [duplicate]\n' + 'later\n'.repeat(60) +
    '[outside]: https://example.org/outside\n[blank]:   \n[duplicate]: https://example.org/a\n[duplicate]: https://example.org/b\n';
  const p = (await a.importReport({ text, metadata: metadata() })).proposal;
  for (const part of ['Sour', 'outside']) {
    const startByte = bytes(text.slice(0, text.indexOf(part)));
    const page = await a.readProposal({ proposalId: p.proposalId, expectedRevision: p.revision,
      selection: { startByte, endByte: startByte + bytes(part) } });
    assert.equal(page.citations[0].target, 'https://example.org/outside');
  }
  assert.equal(p.citations.find(c => c.label === 'blank').status, 'unresolved');
  assert.deepEqual(p.citations.find(c => c.label === 'duplicate'), { label: 'duplicate', status: 'unresolved', reason: 'ambiguous_definitions' });
  assert.ok(p.warnings.some(w => w.code === 'unresolved_citation'));
});

test('catalogue-to-read and continuation mutation disclose expected/current revisions before stale catalogue errors', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, maxReadBytes: 128 });
  const p = (await a.importReport({ text: 'Evidence 😀\n'.repeat(100), metadata: metadata() })).proposal;
  const review = (await a.reviewProposal({ proposalId: p.proposalId })).review;
  const accepted = await a.acceptProposal(acceptArgs(review));
  const found = (await a.searchReports({ query: 'orchard' })).candidates[0];
  const first = await a.readAccepted({ reportId: found.id, expectedRevision: found.revision });
  const file = join(r.archiveRoot, 'reports', `${found.id}.md`);
  await fs.appendFile(file, 'changed');
  const current = digest(await fs.readFile(file));
  for (const request of [{ reportId: found.id, expectedRevision: found.revision }, first.continuation]) {
    await assert.rejects(a.readAccepted(request), e => code('revision_conflict')(e) &&
      e.message.includes(accepted.revision) && e.message.includes(current));
  }
  await assert.rejects(a.readAccepted({ reportId: found.id }), code('catalogue_stale'));
  await fs.rm(file);
  await assert.rejects(a.readAccepted(first.continuation), code('revision_conflict'));
  await fs.appendFile(join(r.workRoot, 'proposals', `${p.proposalId}.body`), 'changed');
  await assert.rejects(a.readProposal(p.continuation), code('revision_conflict'));
  await fs.rm(join(r.workRoot, 'proposals', `${p.proposalId}.json`));
  await assert.rejects(a.readProposal(p.continuation), code('revision_conflict'));
});

test('body notices exceeding the metadata cap do not prevent complete archive access', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, maxReadBytes: 8192 });
  const text = '# Findings\nDated evidence.\n\n## Correction\nThis report contains an error and is replaced by successor.\n' +
    'The original assumption is invalid; retain this limitation and its evidence.\n'.repeat(400);
  const p = (await a.importReport({ text, metadata: { ...metadata(), superseded_by: 'successor' } })).proposal;
  const complete = await collect(a.readProposal, p);
  assert.equal(complete.assembled, text);
});
