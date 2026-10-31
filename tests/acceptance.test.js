import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { ArchiveError, createArchive } from '../src/archive.js';
import { fixture, metadata, roots } from './support.js';

const code = name => e => e instanceof ArchiveError && e.code === name;
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const acceptance = review => ({ proposalId: review.proposalId, expectedRevision: review.expectedRevision,
  expectedBaseRevision: review.expectedBaseRevision, expectedCatalogueRevision: review.expectedCatalogueRevision,
  acceptedAt: review.acceptedAt, expectedReviewDigest: review.reviewDigest });

async function draftAndReview(archive, text, id = 'orchard-water') {
  const proposal = (await archive.importReport({ text, metadata: metadata(id) })).proposal;
  return { proposal, review: (await archive.reviewProposal({ proposalId: proposal.proposalId })).review };
}

test('explicit review envelope accepts intact source once, yields deterministic rebuild and fresh-session bounded read/search', async t => {
  const r = await roots(t);
  const before = await fs.readFile(r.path);
  const a = createArchive({ ...r, maxReadBytes: 159, maxSearchResults: 2, now: () => '2026-11-02T00:00:00.000Z' });
  const bytes = Buffer.from('\ufeffQuestion\r\n' + 'soil 😀 drip [s][soil]\n'.repeat(45) + '[soil]: https://example.org/soil\n');
  await fs.writeFile(r.path, bytes);
  const p = (await a.importReport({ sourcePath: r.path, metadata: metadata() })).proposal;
  const review = (await a.reviewProposal({ proposalId: p.proposalId })).review;
  assert.equal(review.expectedBaseRevision, null);
  assert.equal(review.expectedCatalogueRevision, null);
  assert.deepEqual(review.changedFiles, ['reports/orchard-water.md', 'INDEX.json']);
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  await assert.rejects(a.acceptProposal({ ...acceptance(review), expectedReviewDigest: '0'.repeat(64) }), code('revision_conflict'));
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  const accepted = await a.acceptProposal(acceptance(review));
  assert.equal(accepted.status, 'accepted_local_unpublished');
  assert.equal(accepted.published, false);
  assert.equal(accepted.committed, false);
  assert.deepEqual(await fs.readFile(r.path), bytes);
  assert.deepEqual(await fs.readFile(join(r.workRoot, 'proposals', `${p.proposalId}.body`)), bytes);
  const report = await fs.readFile(join(r.archiveRoot, 'reports', 'orchard-water.md'));
  assert.equal(digest(report), accepted.revision);
  assert.deepEqual(report.subarray(-bytes.length), bytes);
  assert.match(report.toString('utf8'), /^---\n\{/);
  assert.equal(before.includes(Buffer.from('Orchard irrigation')), true);
  const fresh = createArchive({ ...r, maxReadBytes: 159, maxSearchResults: 2 });
  const search = await fresh.searchReports({ query: 'watering sandy orchard' });
  assert.equal(search.status, 'matches');
  assert.equal(search.candidates[0].revision, accepted.revision);
  assert.equal(search.candidates[0].researched_at, null);
  assert.equal(search.candidates[0].scope, metadata().scope);
  assert.equal(search.candidates[0].warnings.some(w => w.code === 'unknown_research_date'), true);
  assert.match(search.relevanceNote, /not verified/i);
  assert.deepEqual(await fresh.searchReports({ query: 'unrelated quantum rocket' }), {
    ok: true, status: 'empty', catalogueRevision: accepted.catalogueRevision, candidates: [], nextOffset: null,
    relevanceNote: 'Lexical relevance only; not verified, current or factual trust.',
  });
  let page = await fresh.readAccepted({ reportId: 'orchard-water', expectedRevision: accepted.revision });
  let assembled = '';
  const warnings = page.warnings;
  let citationSeen = false;
  for (let i = 0; ; i++) {
    assert.ok(i < 100, 'bounded continuation');
    assert.deepEqual(page.warnings, warnings);
    citationSeen ||= page.citations.some(c => c.target === 'https://example.org/soil');
    assembled += page.content.text;
    if (!page.continuation) break;
    assert.equal(page.continuation.reportId, 'orchard-water');
    page = await fresh.readAccepted(page.continuation);
    assert.equal(page.revision, accepted.revision);
  }
  assert.equal(assembled, bytes.toString('utf8'));
  assert.equal(citationSeen, true);
  await assert.rejects(fresh.readAccepted({ reportId: '../bad' }), code('invalid_input'));
  await assert.rejects(fresh.readAccepted({ reportId: 'orchard-water', expectedRevision: '0'.repeat(64) }), code('revision_conflict'));
  await assert.rejects(fresh.readAccepted({ reportId: 'missing' }), code('not_found'));
  await assert.rejects(fresh.importReport({ text: 'other body', metadata: metadata() }), code('revision_conflict'));
  const identical = await fresh.importReport({ text: bytes.toString('utf8'), metadata: metadata('same-content-new-id') });
  assert.equal(identical.status, 'duplicate'); // Proposal import remains independent of catalogue health.
  assert.equal(identical.proposal.proposalId, p.proposalId);
  await assert.rejects(fresh.acceptProposal(acceptance(review)), code('revision_conflict'));
  const rebuilt = await fresh.rebuildCatalogue();
  assert.equal(rebuilt.catalogueRevision, accepted.catalogueRevision);
  assert.equal(rebuilt.reportCount, 1);
});

test('empty is distinct from missing, malformed and known-stale; explicit rebuild restores valid reports only', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  await assert.rejects(a.searchReports({ query: 'orchard' }), code('catalogue_unavailable'));
  await a.rebuildCatalogue();
  assert.equal((await a.searchReports({ query: 'orchard' })).status, 'empty');
  const { review } = await draftAndReview(a, 'Hello');
  await a.acceptProposal(acceptance(review));
  const index = join(r.archiveRoot, 'INDEX.json');
  const initial = await fs.readFile(index);
  await fs.writeFile(index, '{broken');
  await assert.rejects(a.searchReports({ query: 'orchard' }), code('catalogue_invalid'));
  await assert.rejects(a.readAccepted({ reportId: 'orchard-water' }), code('catalogue_invalid'));
  // A separate proposal can still be prepared while maintenance repairs the catalogue.
  assert.equal((await a.importReport({ text: 'unrelated draft', metadata: metadata('unrelated') })).status, 'created');
  const repaired = await a.rebuildCatalogue();
  assert.equal(repaired.reportCount, 1);
  assert.deepEqual(await fs.readFile(index), initial);
  const forged = JSON.parse(initial.toString('utf8'));
  forged.entries[0].id = '../outside';
  await fs.writeFile(index, JSON.stringify(forged, null, 2) + '\n');
  await assert.rejects(a.searchReports({ query: 'orchard' }), code('catalogue_invalid'));
  await a.rebuildCatalogue();
  await fs.rm(index);
  await fs.symlink(r.path, index);
  await assert.rejects(a.searchReports({ query: 'orchard' }), code('catalogue_invalid'));
  await fs.rm(index);
  await a.rebuildCatalogue();
  await fs.appendFile(join(r.archiveRoot, 'reports', 'orchard-water.md'), '\nmanual change');
  await assert.rejects(a.searchReports({ query: 'orchard' }), code('catalogue_stale'));
  await assert.rejects(a.readAccepted({ reportId: 'orchard-water' }), code('catalogue_stale'));
  await assert.rejects(a.rebuildCatalogue(), code('catalogue_invalid'));
  await fs.writeFile(join(r.archiveRoot, 'reports', 'orchard-water.md'), 'not a report');
  await assert.rejects(a.rebuildCatalogue(), code('catalogue_invalid'));
  assert.deepEqual(await fs.readFile(r.path), await fs.readFile(fixture('field-notes.md')));
});

test('proposal/body/catalogue drift, invalid identities, stale review and explicit base rejection do not overwrite', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, now: () => '2026-11-03T00:00:00.000Z' });
  const { proposal, review } = await draftAndReview(a, 'Original bytes');
  await assert.rejects(a.reviewProposal({ proposalId: 'wrong/id' }), code('invalid_input'));
  await assert.rejects(a.reviewProposal({ proposalId: proposal.proposalId, expectedBaseRevision: '0'.repeat(64) }), code('revision_conflict'));
  await assert.rejects(a.acceptProposal({ ...acceptance(review), expectedRevision: '0'.repeat(64) }), code('revision_conflict'));
  await fs.appendFile(join(r.workRoot, 'proposals', `${proposal.proposalId}.body`), ' changed');
  await assert.rejects(a.acceptProposal(acceptance(review)), code('revision_conflict'));
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  const restored = await roots(t);
  const second = createArchive(restored);
  const first = await draftAndReview(second, 'first', 'first');
  await second.acceptProposal(acceptance(first.review));
  const newer = await draftAndReview(second, 'second', 'second');
  const oldReview = newer.review;
  await second.rebuildCatalogue(); // same entries, same digest; no stale approval.
  assert.equal((await second.reviewProposal({ proposalId: newer.proposal.proposalId, acceptedAt: oldReview.acceptedAt })).review.reviewDigest, oldReview.reviewDigest);
  await second.acceptProposal(acceptance(oldReview));
  await assert.rejects(second.importReport({ text: 'changed', metadata: metadata('second') }), code('revision_conflict'));
  const r3 = await roots(t);
  const third = createArchive(r3);
  const pending = await draftAndReview(third, 'new', 'new');
  await fs.mkdir(join(r3.archiveRoot, 'reports'));
  await fs.writeFile(join(r3.archiveRoot, 'reports', 'new.md'), 'Existing unrelated report');
  await assert.rejects(third.acceptProposal(acceptance(pending.review)), code('catalogue_unavailable'));
  assert.equal(await fs.readFile(join(r3.archiveRoot, 'reports', 'new.md'), 'utf8'), 'Existing unrelated report');
});

for (const stage of ['before_report', 'report_linked', 'before_index']) {
  test(`write interruption at ${stage} is recoverable without overwriting or confident empty search`, async t => {
    const r = await roots(t);
    const a = createArchive({ ...r, writeCheckpoint: where => { if (where === stage) throw Error(`simulated ${stage}`); } });
    const { proposal, review } = await draftAndReview(a, 'Report bytes');
    await assert.rejects(a.acceptProposal(acceptance(review)), stage === 'before_report' ? /simulated/ : code('catalogue_stale'));
    const fresh = createArchive(r);
    await assert.rejects(fresh.searchReports({ query: 'orchard' }), code('catalogue_unavailable'));
    if (stage === 'before_report') {
      assert.deepEqual(await fs.readdir(r.archiveRoot), []);
      assert.equal((await fresh.rebuildCatalogue()).reportCount, 0);
      assert.equal((await fresh.searchReports({ query: 'orchard' })).status, 'empty');
      await assert.rejects(fresh.acceptProposal(acceptance(review)), code('revision_conflict'));
    } else {
      assert.deepEqual(await fs.readdir(join(r.archiveRoot, 'reports')), ['orchard-water.md']);
      assert.equal((await fresh.rebuildCatalogue()).reportCount, 1);
      assert.equal((await fresh.searchReports({ query: 'orchard' })).status, 'matches');
      assert.equal((await fresh.readAccepted({ reportId: proposal.reportId })).content.text, 'Report bytes');
      await assert.rejects(fresh.acceptProposal(acceptance(review)), code('revision_conflict'));
    }
    assert.equal(await fs.readFile(join(r.workRoot, 'proposals', `${proposal.proposalId}.body`), 'utf8'), 'Report bytes');
  });
}

test('existing catalogue remains visibly stale after report link fails to update it', async t => {
  const r = await roots(t);
  const stable = createArchive(r);
  const first = await draftAndReview(stable, 'one', 'one');
  await stable.acceptProposal(acceptance(first.review));
  const failing = createArchive({ ...r, writeCheckpoint: stage => { if (stage === 'before_index') throw Error('injected'); } });
  const second = await draftAndReview(failing, 'two', 'two');
  await assert.rejects(failing.acceptProposal(acceptance(second.review)), code('catalogue_stale'));
  await assert.rejects(stable.searchReports({ query: 'orchard' }), code('catalogue_stale'));
  await assert.rejects(stable.readAccepted({ reportId: 'one' }), code('catalogue_stale'));
  assert.equal((await stable.rebuildCatalogue()).reportCount, 2);
  assert.equal((await stable.searchReports({ query: 'orchard' })).candidates.length, 2);
});

test('already-staged identical content cannot be accepted twice under another report ID', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const first = await draftAndReview(a, 'same original body', 'first');
  const otherWork = join(r.root, 'separate-work');
  await fs.mkdir(otherWork);
  const b = createArchive({ ...r, workRoot: otherWork });
  const staged = await draftAndReview(b, 'same original body', 'second');
  await a.acceptProposal(acceptance(first.review));
  await assert.rejects(b.acceptProposal(acceptance(staged.review)), code('duplicate_content'));
  assert.deepEqual(await fs.readdir(join(r.archiveRoot, 'reports')), ['first.md']);
});

test('concurrent reviews of one catalogue cannot silently discard another accepted report', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const one = await draftAndReview(a, 'one', 'one');
  const two = await draftAndReview(a, 'two', 'two');
  const settled = await Promise.allSettled([a.acceptProposal(acceptance(one.review)), a.acceptProposal(acceptance(two.review))]);
  assert.equal(settled.filter(x => x.status === 'fulfilled').length, 1);
  assert.equal(settled.filter(x => x.status === 'rejected' && code('revision_conflict')(x.reason)).length, 1);
  assert.equal((await a.searchReports({ query: 'orchard' })).candidates.length, 1);
  assert.equal((await a.rebuildCatalogue()).reportCount, 1);
});

test('catalogue changes after review invalidate acceptance; unrelated identity remains intact', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const pending = await draftAndReview(a, 'alpha', 'alpha');
  const other = await draftAndReview(a, 'beta', 'beta');
  await a.acceptProposal(acceptance(other.review));
  await assert.rejects(a.acceptProposal(acceptance(pending.review)), code('revision_conflict'));
  assert.deepEqual(await fs.readdir(join(r.archiveRoot, 'reports')), ['beta.md']);
  const currentReview = (await a.reviewProposal({ proposalId: pending.proposal.proposalId })).review;
  await a.acceptProposal(acceptance(currentReview));
  assert.deepEqual((await a.searchReports({ query: 'soil', limit: 1 })).candidates.length, 1);
  assert.equal((await a.searchReports({ query: 'soil', limit: 1 })).nextOffset, 1);
  assert.equal((await a.searchReports({ query: 'soil', limit: 1, offset: 1 })).candidates.length, 1);
});
