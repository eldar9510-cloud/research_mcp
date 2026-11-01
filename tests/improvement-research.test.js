import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive } from '../src/archive.js';
import { createResearch, normalizeResearchRequest } from '../src/research.js';
import { roots, metadata } from './support.js';
import { runtime, steps, adapter, terminal, URL, searchStep, fetchStep, report } from './research-support.js';

const accept = async (a, p) => { const r = (await a.reviewProposal({ proposalId: p.proposalId })).review;
  return a.acceptProposal({ proposalId: r.proposalId, expectedRevision: r.expectedRevision, expectedBaseRevision: r.expectedBaseRevision,
    expectedCatalogueRevision: r.expectedCatalogueRevision, acceptedAt: r.acceptedAt, expectedReviewDigest: r.reviewDigest }); };
async function setup(t, { oldUrl = 'https://example.org/old', dependencies, script, body } = {}) {
  const r = await roots(t), archive = createArchive(r);
  const old = body ?? `\ufeff# Findings\r\nOld comparison [S1].\r\n\r\n## Alternatives\r\nKeep the useful alternative π.\r\n[S1]: ${oldUrl}\r\n`;
  const base = await accept(archive, (await archive.importReport({ text: old, metadata: metadata() })).proposal);
  const prior = await archive.readAccepted({ reportId: base.reportId });
  const request = { mode: 'improve', question: prior.metadata.question, scope: prior.metadata.scope,
    references: [{ reportId: base.reportId, expectedRevision: base.revision, selection: { startByte: 0, endByte: Buffer.byteLength(old.split('\r\n\r\n')[0]) } }],
    improvement: { base: { reportId: base.reportId, expectedRevision: base.revision }, disposition: 'same_report',
      gaps: ['Add missing accessible design comparison.'], oldSourceChecks: [] } };
  const f = runtime(script ?? steps());
  const research = createResearch({ archive, workRoot: r.workRoot, createDependencies: dependencies ?? (async () => ({ modelRuntime: f.runtime, adapter: adapter() })) });
  t.after(() => research.shutdown());
  return { ...r, archive, research, request, f, base, prior, old };
}

test('same-question job supplies selected qualified evidence only, preserves old bytes/citations, and survives restart with imported lineage', async t => {
  const s = await setup(t, { body: '\ufeff# Findings\r\nOld comparison [S1].\r\n\r\n## Alternatives\r\n' + 'UNSELECTED BASE MATERIAL π.\r\n'.repeat(2500) + '[S1]: https://example.org/old\r\n' });
  const done = await terminal(s.research, s.research.start(s.request));
  assert.equal(done.status, 'completed', JSON.stringify(done));
  const context = JSON.stringify(s.f.trace[0].context.messages);
  assert.match(context, /Add missing accessible design/); assert.match(context, /https:\/\/example.org\/old/);
  assert.doesNotMatch(context, /UNSELECTED BASE MATERIAL/);
  const proposal = await s.archive.readProposal(done.outputs.proposal);
  assert.equal(proposal.reportId, s.base.reportId); assert.equal(proposal.metadata.researched_at, null);
  assert.deepEqual(proposal.metadata.origin, s.prior.metadata.origin);
  const body = await fs.readFile(join(s.workRoot, 'proposals', proposal.proposalId + '.body'), 'utf8');
  assert.ok(body.startsWith(s.old)); assert.match(body, /\[I[a-f0-9]+-S1\]: https:\/\/www.w3.org/);
  assert.equal((body.match(/^\[S1\]:/gm) ?? []).length, 1);
  assert.match(body, /Requested old-source checks/); assert.match(body, /unchecked/); assert.match(body, /openai-codex\/gpt-6.1-sol\/max/);
  assert.ok((await fs.stat(join(s.workRoot, done.outputs.output))).size < 65536, 'job stores delta, not long base');
  await accept(s.archive, proposal);
  await s.research.shutdown();
  const fresh = createResearch({ archive: createArchive(s), workRoot: s.workRoot, createDependencies() { throw Error('NO RESTARTED SETUP'); } });
  t.after(() => fresh.shutdown());
  assert.equal((await fresh.get({ jobId: done.jobId })).status, 'completed', 'historical completion is not invalidated by accepted/stale base');
  await assert.rejects(s.archive.reviewProposal({ proposalId: proposal.proposalId }), e => e.code === 'revision_conflict');
});

test('strict improvement requires exact base selection, explicit gaps/check scope and settled same versus linked intent', async t => {
  const s = await setup(t);
  assert.equal(normalizeResearchRequest(s.request).mode, 'improve');
  for (const bad of [{ ...s.request, improvement: undefined }, { ...s.request, references: [] },
    { ...s.request, improvement: { ...s.request.improvement, oldSourceChecks: undefined } },
    { ...s.request, improvement: { ...s.request.improvement, gaps: [] } },
    { ...s.request, improvement: { ...s.request.improvement, disposition: 'auto' } },
    { ...s.request, improvement: { ...s.request.improvement, oldSourceChecks: [{ url: URL, claim: 'all claims' }] } }])
    assert.throws(() => s.research.start(bad), /invalid_input/);
});

test('known old URL cannot be refreshed without exact requested passage/claim permission; requested checks still require search membership', async t => {
  for (const allowed of [false, true]) {
    let inspected = 0;
    const f = runtime(steps());
    const s = await setup(t, { oldUrl: URL, dependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter({ fetch: async (...args) => { inspected++; return adapter().fetch(...args); } }) }) });
    const request = structuredClone(s.request);
    if (allowed) request.improvement.oldSourceChecks = [{ url: URL, offset: 0, claim: 'The selected definition supports accessible use.' }];
    const done = await terminal(s.research, s.research.start(request));
    assert.equal(inspected, allowed ? 1 : 0);
    assert.equal(done.status, allowed ? 'completed' : 'failed');
    if (allowed) {
      const body = await fs.readFile(join(s.workRoot, 'proposals', done.outputs.proposal.proposalId + '.body'), 'utf8');
      assert.match(body, /actually inspected/); assert.match(body, /Access is not verification/);
    } else assert.equal(done.firstToolFailure.code, 'old_source_check_not_requested');
  }
});

test('qualified correction context survives model omission and multiple requested checks record only their actually inspected selector', async t => {
  const answer = report(); answer.comparison.sources = ['R1'];
  const s = await setup(t, { oldUrl: URL, script: steps(answer), body: `# Findings\r\nOld finding [S1].\r\n\r\n## Corrections\r\nCorrection: the old finding is conditional [S1].\r\n[S1]: ${URL}\r\n` });
  const request = structuredClone(s.request);
  request.improvement.oldSourceChecks = [{ url: URL, offset: 0, claim: 'Check selected definition.' }, { url: URL, contains: 'A different passage', claim: 'A separate unperformed check.' }];
  const done = await terminal(s.research, s.research.start(request)); assert.equal(done.status, 'completed');
  const body = await fs.readFile(join(s.workRoot, 'proposals', done.outputs.proposal.proposalId + '.body'), 'utf8');
  assert.match(body, /Correction: the old finding is conditional/);
  assert.match(body, /requested check was not performed/);
  assert.match(body, /\[I[a-f0-9]+-R1\]: #improvement-job-/);
  assert.doesNotMatch(body, /\[I[a-f0-9]+-R1\]: \.\/orchard-water.md/, 'same-ID reuse never retargets a base citation to current report');
  await accept(s.archive, await s.archive.readProposal(done.outputs.proposal));
  const narrow = await s.archive.readAccepted({ reportId: s.base.reportId, expectedRevision: (await s.archive.searchReports({ query: 'inclusive' })).candidates[0].revision,
    selection: { startByte: 0, endByte: 25 } });
  assert.match(JSON.stringify(narrow.notices), /requested check was not performed/);
  assert.match(JSON.stringify(narrow.notices), /Correction: the old finding is conditional/);
});

test('staleness during a held model turn rejects proposal persistence; completed imported jobs require matching immutable request lineage', async t => {
  const entered = Promise.withResolvers(), release = Promise.withResolvers();
  const f = runtime(steps()), original = f.runtime.streamSimple;
  let calls = 0;
  f.runtime.streamSimple = function (...args) {
    const stream = original.apply(this, args), hold = ++calls === 3;
    return { async *[Symbol.asyncIterator]() { if (hold) { entered.resolve(); await release.promise; } yield* stream; }, result: () => stream.result() };
  };
  const s = await setup(t, { dependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }) });
  const start = s.research.start(s.request); await entered.promise;
  await fs.appendFile(join(s.archiveRoot, 'reports', s.base.reportId + '.md'), '\nNEWER DURING MODEL'); release.resolve();
  const conflict = await terminal(s.research, start); assert.equal(conflict.status, 'incomplete'); assert.equal(conflict.reason, 'revision_conflict');
  assert.equal(conflict.modelCalls, 3); assert.equal(conflict.outputs.proposal, undefined);
  const valid = await setup(t), done = await terminal(valid.research, valid.research.start(valid.request)); assert.equal(done.status, 'completed');
  await valid.research.shutdown();
  const path = join(valid.workRoot, done.outputs.request), value = JSON.parse(await fs.readFile(path));
  value.data.improvement.gaps = ['Different unauthorized work.']; await fs.writeFile(path, JSON.stringify(value));
  const fresh = createResearch({ archive: valid.archive, workRoot: valid.workRoot, createDependencies() { throw Error('NO RECOVERY SETUP'); } });
  t.after(() => fresh.shutdown());
  const recovered = await fresh.get({ jobId: done.jobId }); assert.equal(recovered.status, 'interrupted'); assert.equal(recovered.reason, 'survivor_invalid');
});

test('wrong base fails before dependencies and a base changed during held research cannot produce a revision proposal', async t => {
  let setupCalls = 0;
  const s = await setup(t, { dependencies: async () => { setupCalls++; throw Error('must not initialize'); } });
  const wrong = structuredClone(s.request); wrong.improvement.base.expectedRevision = '0'.repeat(64); wrong.references[0].expectedRevision = '0'.repeat(64);
  const done = await terminal(s.research, s.research.start(wrong));
  assert.equal(done.status, 'incomplete'); assert.equal(done.reason, 'revision_conflict'); assert.equal(setupCalls, 0);
  const hold = Promise.withResolvers(), entered = Promise.withResolvers();
  const f = runtime(steps()), source = adapter();
  const x = await setup(t, { dependencies: async () => { entered.resolve(); await hold.promise; return { modelRuntime: f.runtime, adapter: source }; } });
  const start = x.research.start(x.request); await entered.promise;
  await fs.appendFile(join(x.archiveRoot, 'reports', x.base.reportId + '.md'), '\nNEWER ACCEPTED CONTENT'); hold.resolve();
  const conflict = await terminal(x.research, start);
  assert.equal(conflict.status, 'incomplete'); assert.equal(conflict.reason, 'revision_conflict');
  assert.equal(conflict.outputs.proposal, undefined);
});
