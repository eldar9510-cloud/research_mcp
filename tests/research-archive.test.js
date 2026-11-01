import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive } from '../src/archive.js';
import { createResearch } from '../src/research.js';
import { createBraveAdapter } from '../src/brave.js';
import { metadata, roots } from './support.js';
import { INPUT, URL, TEXT, runtime, adapter, steps, terminal, httpFixture } from './research-support.js';
const generated = id => ({ ...metadata(id), researched_at: '2026-10-31', warnings: [],
  origin: { kind: 'engine_generated', platform: 'Pi SDK', author: 'unknown', model: 'openai-codex/gpt-6.1-sol/max' } });

test('generalized real SDK + Brave scripted HTTP/DNS/connect -> generated proposal, exact ledger quotes, readable common format', async t => {
  const r = await roots(t), archive = createArchive({ ...r, maxReadBytes: 256 });
  const http = httpFixture({ body: 'preamble '.repeat(900) + TEXT });
  const concrete = createBraveAdapter({ token: 'synthetic-only-token', lookup: http.lookup, request: http.request,
    fetchImpl: async () => new Response(JSON.stringify({ web: { results: [{ url: URL, title: 'API title marker', description: 'API snippet marker' }] } }),
      { headers: { 'content-type': 'application/json' } }) });
  const script = steps(); script[1] = { tool: 'research_fetch', args: { url: URL, contains: 'people with disabilities' } };
  const f = runtime(script);
  const research = createResearch({ archive, workRoot: r.workRoot, createDependencies: async () => ({ modelRuntime: f.runtime, adapter: concrete }) });
  t.after(() => research.shutdown());
  const done = await terminal(research, research.start(INPUT)); assert.equal(done.status, 'completed');
  let page = await archive.readProposal(done.outputs.proposal), body = '';
  const first = page;
  for (let count = 0; ; count++) {
    assert(count < 50); assert.equal(page.revision, first.revision); body += page.content.text;
    if (!page.continuation) break;
    page = await archive.readProposal(page.continuation);
  }
  assert.equal(first.metadata.origin.kind, 'engine_generated'); assert.equal(first.metadata.origin.author, 'unknown');
  assert.equal(first.metadata.origin.model, 'openai-codex/gpt-6.1-sol/max');
  assert.equal(first.metadata.imported_at, null); assert.equal(first.metadata.last_improved_at, null);
  assert.equal(first.metadata.researched_at, done.startedAt.slice(0, 10));
  assert(first.warnings.some(w => w.code === 'unknown_origin')); assert(first.warnings.some(w => w.code === 'unverified_research'));
  assert(!first.warnings.some(w => w.code === 'unverified_import'));
  assert.match(body, /Evidence and analysis/); assert.match(body, /Alternatives and applicability/); assert.match(body, /Limitations/); assert.match(body, /Unresolved questions/);
  assert.match(body, /people with disabilities/); assert.match(body, /\[S1\]: https:\/\/www\.w3\.org\//);
  assert.match(body, /not a semantic truth certificate/); assert.doesNotMatch(body, /API title marker|API snippet marker|synthetic-only-token/);
  const ledger = JSON.parse(await fs.readFile(join(r.workRoot, done.outputs.evidence), 'utf8'));
  assert(ledger.sources[0].offset > 2400); assert.match(ledger.sources[0].visibleTextSha256, /^[a-f0-9]{64}$/);
  assert.equal(ledger.sources[0].rawTruncated, false); assert(!Number.isNaN(Date.parse(ledger.sources[0].accessedAt)));
  const recreated = createArchive(r);
  assert.equal((await recreated.readProposal(done.outputs.proposal)).sourceDigest, first.sourceDigest);
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  // Explicit independent archive acceptance still uses exactly the old format.
  const review = await recreated.reviewProposal({ proposalId: first.proposalId });
  const accepted = await recreated.acceptProposal({ proposalId: first.proposalId, expectedRevision: first.revision,
    expectedBaseRevision: null, acceptedAt: review.review.acceptedAt, expectedCatalogueRevision: review.review.expectedCatalogueRevision,
    expectedReviewDigest: review.review.reviewDigest });
  assert.equal(accepted.published, false); assert.equal(accepted.committed, false);
  const read = await recreated.readAccepted({ reportId: first.reportId, expectedRevision: accepted.revision });
  assert.equal(read.metadata.origin.kind, 'engine_generated'); assert.equal(read.metadata.imported_at, null);
  assert.equal((await recreated.searchReports({ query: 'accessibility' })).candidates[0].origin.kind, 'engine_generated');
  assert.equal((await recreated.rebuildCatalogue()).reportCount, 1);
});

test('public import cannot counterfeit engine origin; generated persistence shares credential/schema/exclusive checks', async t => {
  const r = await roots(t), archive = createArchive(r);
  await assert.rejects(() => archive.importReport({ text: 'report', metadata: generated('generated') }), e => e.code === 'invalid_input');
  for (const m of [{ ...generated('generated'), researched_at: null }, { ...generated('generated'), last_improved_at: '2026-10-31' },
    { ...generated('generated'), origin: { ...generated('generated').origin, author: 'Fabricated Person' } },
    { ...generated('generated'), origin: { ...generated('generated').origin, model: 'invented-model' } }])
    await assert.rejects(() => archive.createResearchProposal({ text: 'finished', metadata: m }), e => e.code === 'invalid_input');
  await assert.rejects(() => archive.createResearchProposal({ text: `AKIA${'B'.repeat(16)}`, metadata: generated('generated') }), e => e.code === 'invalid_input');
  const imported = (await archive.importReport({ text: 'Original imported bytes', metadata: metadata('imported') })).proposal;
  assert.equal(typeof imported.metadata.imported_at, 'string');
  await assert.rejects(() => archive.createResearchProposal({ text: 'Original imported bytes', metadata: generated('generated') }), e => e.code === 'duplicate_content');
  const fresh = (await archive.createResearchProposal({ text: 'New generated bytes', metadata: generated('generated') })).proposal;
  await assert.rejects(() => archive.importReport({ text: 'New generated bytes', metadata: metadata('other') }), e => e.code === 'duplicate_content');
  await assert.rejects(() => archive.createResearchProposal({ text: 'New generated bytes', metadata: generated('second') }), e => e.code === 'duplicate_content');
  await assert.rejects(() => archive.createResearchProposal({ text: 'Different bytes', metadata: generated('generated') }), e => e.code === 'revision_conflict');
  const aborted = new AbortController(); aborted.abort();
  await assert.rejects(() => archive.createResearchProposal({ text: 'Never written', metadata: generated('aborted'), signal: aborted.signal }));
  assert.equal((await archive.readProposal({ proposalId: fresh.proposalId })).metadata.origin.kind, 'engine_generated');
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
});

test('generated duplicate of accepted content is rejected rather than reassigned new provenance', async t => {
  const r = await roots(t), archive = createArchive(r);
  const p = (await archive.importReport({ text: 'Accepted original', metadata: metadata('accepted') })).proposal;
  const review = await archive.reviewProposal({ proposalId: p.proposalId });
  await archive.acceptProposal({ proposalId: p.proposalId, expectedRevision: p.revision, expectedBaseRevision: null,
    acceptedAt: review.review.acceptedAt, expectedCatalogueRevision: review.review.expectedCatalogueRevision, expectedReviewDigest: review.review.reviewDigest });
  await assert.rejects(() => archive.createResearchProposal({ text: 'Accepted original', metadata: generated('new-origin') }), e => e.code === 'duplicate_content');
  assert.equal((await archive.searchReports({ query: 'orchard' })).candidates[0].origin.kind, 'imported');
});
