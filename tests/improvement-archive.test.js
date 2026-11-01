import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive } from '../src/archive.js';
import { roots, metadata } from './support.js';

const acceptance = r => ({ proposalId: r.proposalId, expectedRevision: r.expectedRevision,
  expectedBaseRevision: r.expectedBaseRevision, expectedCatalogueRevision: r.expectedCatalogueRevision,
  acceptedAt: r.acceptedAt, expectedReviewDigest: r.reviewDigest });
export async function seed(archive, text = '\ufeff# Findings\r\nOld conclusion [S1].\r\n\r\n## Alternatives\r\nKeep π and caveats.\r\n[S1]: https://example.org/old\r\n', id = 'orchard-water') {
  const p = (await archive.importReport({ text, metadata: metadata(id) })).proposal;
  return archive.acceptProposal(acceptance((await archive.reviewProposal({ proposalId: p.proposalId })).review));
}
const change = base => ({ base: { reportId: base.reportId, expectedRevision: base.revision }, disposition: 'same_report',
  jobId: 'job-' + 'a'.repeat(32), requestDigest: 'b'.repeat(64), text: '\n## Improvement limitations\nNew evidence [I-S1]. Old material was not rechecked.\n[I-S1]: https://example.org/new\n',
  summary: 'Adds the requested comparison without refreshing old evidence.', improvedAt: '2026-11-03',
  question: metadata().question, scope: metadata().scope, language: 'en' });

test('base-bound immutable revision preserves original bytes/provenance and replaces only its catalogue entry after acceptance', async t => {
  const r = await roots(t), a = createArchive(r), base = await seed(a);
  await seed(a, 'An unrelated report.', 'unrelated');
  const before = await a.readAccepted({ reportId: base.reportId });
  const oldBytes = await fs.readFile(join(r.archiveRoot, 'reports', base.reportId + '.md'));
  const priorIndex = JSON.parse(await fs.readFile(join(r.archiveRoot, 'INDEX.json')));
  const p = (await a.createImprovementProposal(change(base))).proposal;
  assert.equal(p.reportId, base.reportId);
  assert.deepEqual(await fs.readFile(join(r.archiveRoot, 'reports', base.reportId + '.md')), oldBytes);
  assert.equal(p.metadata.researched_at, null);
  for (const field of ['origin', 'created_at', 'imported_at']) assert.deepEqual(p.metadata[field], before.metadata[field]);
  assert.equal(p.metadata.last_improved_at, '2026-11-03');
  const review = await a.reviewProposal({ proposalId: p.proposalId, includeFiles: true });
  assert.equal(review.review.expectedBaseRevision, base.revision);
  assert.deepEqual(review.files[0].before, oldBytes);
  assert.ok(review.files[0].content.includes(Buffer.from(before.content.text)));
  const accepted = await a.acceptProposal(acceptance(review.review));
  assert.notEqual(accepted.revision, base.revision);
  const found = await a.searchReports({ query: 'comparison' });
  assert.equal(found.candidates[0].last_improved_at, '2026-11-03');
  const nextIndex = JSON.parse(await fs.readFile(join(r.archiveRoot, 'INDEX.json')));
  assert.deepEqual(nextIndex.entries.find(e => e.id === 'unrelated'), priorIndex.entries.find(e => e.id === 'unrelated'));
  assert.equal((await a.rebuildCatalogue()).catalogueRevision, accepted.catalogueRevision);
  await assert.rejects(a.acceptProposal(acceptance(review.review)), e => e.code === 'revision_conflict');
  assert.equal((await a.readProposal({ proposalId: p.proposalId })).revision, p.revision, 'historical proposal stays readable');
});

test('wrong bases and mutation at the actual before_report checkpoint cannot overwrite accepted bytes', async t => {
  const r = await roots(t), stable = createArchive(r), base = await seed(stable);
  await assert.rejects(stable.createImprovementProposal({ ...change(base), base: { reportId: base.reportId, expectedRevision: '0'.repeat(64) } }), e => e.code === 'revision_conflict');
  const p = (await stable.createImprovementProposal(change(base))).proposal;
  const path = join(r.archiveRoot, 'reports', base.reportId + '.md');
  const failing = createArchive({ ...r, writeCheckpoint: async where => { if (where === 'before_report') await fs.appendFile(path, '\nNEWER EXTERNAL BYTES'); } });
  const review = await failing.reviewProposal({ proposalId: p.proposalId });
  await assert.rejects(failing.acceptProposal(acceptance(review.review)), e => e.code === 'revision_conflict');
  assert.match(await fs.readFile(path, 'utf8'), /NEWER EXTERNAL BYTES$/);
});

test('explicit linked replacement reviews and applies its exact base notice/successor in the same finite file set', async t => {
  const r = await roots(t), a = createArchive(r), base = await seed(a);
  const before = await fs.readFile(join(r.archiveRoot, 'reports', base.reportId + '.md'));
  const p = (await a.createImprovementProposal({ ...change(base), disposition: 'linked_report', question: 'A materially different replacement question?',
    linkedRelation: 'replaces', baseNotice: 'The selected old recommendation is replaced under the new constraints.' })).proposal;
  const plan = await a.reviewProposal({ proposalId: p.proposalId, includeFiles: true });
  assert.deepEqual(plan.review.changedFiles, [`reports/${p.reportId}.md`, `reports/${base.reportId}.md`, 'INDEX.json']);
  assert.deepEqual(plan.files[1].before, before);
  assert.match(plan.files[1].content.toString('utf8'), /replacement notice/i);
  assert.deepEqual(await fs.readFile(join(r.archiveRoot, 'reports', base.reportId + '.md')), before, 'review is read-only');
  await a.acceptProposal(acceptance(plan.review));
  const old = await a.readAccepted({ reportId: base.reportId });
  assert.equal(old.metadata.superseded_by, p.reportId); assert.equal(old.metadata.researched_at, null);
  assert.equal(old.metadata.origin.kind, 'imported');
  assert.equal((await a.rebuildCatalogue()).reportCount, 2);
});

test('different question creates an explicitly linked new report without rewriting or superseding its base', async t => {
  const r = await roots(t), a = createArchive(r), base = await seed(a);
  const path = join(r.archiveRoot, 'reports', base.reportId + '.md'), old = await fs.readFile(path);
  const p = (await a.createImprovementProposal({ ...change(base), disposition: 'linked_report', question: 'Different scoped question?' })).proposal;
  assert.notEqual(p.reportId, base.reportId);
  assert.equal(p.metadata.origin.kind, 'engine_generated');
  assert.deepEqual(p.metadata.related_reports, [{ id: base.reportId, relationship: 'extends' }]);
  const review = await a.reviewProposal({ proposalId: p.proposalId });
  await a.acceptProposal(acceptance(review.review));
  assert.deepEqual(await fs.readFile(path), old);
  assert.equal((await a.readAccepted({ reportId: base.reportId })).metadata.superseded_by, null);
});
