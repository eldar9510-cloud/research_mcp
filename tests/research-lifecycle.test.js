import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive } from '../src/archive.js';
import { createResearch } from '../src/research.js';
import { roots, metadata } from './support.js';
import { INPUT, URL, TEXT, runtime, adapter, steps, searchStep, fetchStep, report, terminal } from './research-support.js';

async function setup(t, dependencies) {
  const r = await roots(t), archive = createArchive(r), f = runtime(steps());
  const research = createResearch({ archive, workRoot: r.workRoot,
    createDependencies: dependencies ?? (async () => ({ modelRuntime: f.runtime, adapter: adapter() })) });
  t.after(() => research.shutdown());
  return { ...r, archive, f, research };
}

test('explicit cancellation during pending setup is terminal, durable and late setup cannot dispatch', async t => {
  const entered = Promise.withResolvers(), pending = Promise.withResolvers();
  const s = await setup(t, async () => { entered.resolve(); return pending.promise; });
  const start = s.research.start(INPUT);
  await entered.promise;
  const done = await s.research.cancel({ jobId: start.jobId });
  assert.equal(done.status, 'cancelled'); assert.equal(done.reason, 'user_stop');
  assert.equal(done.modelCalls, 0);
  const bytes = JSON.stringify(done);
  pending.resolve({ modelRuntime: s.f.runtime, adapter: adapter() });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(JSON.stringify(await s.research.get({ jobId: start.jobId })), bytes);
  assert.equal(s.f.trace.length, 0);
  const read = await s.research.readArtifact({ jobId: start.jobId, artifact: 'request' });
  assert.equal(read.priorIncomplete, true); assert.match(read.content.text, /accessibility/);
  assert.equal(read.revision.length, 64);
  assert.deepEqual(await fs.readdir(s.archiveRoot), []);
  const restarted = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies() { throw Error('NO RESTART'); } });
  t.after(() => restarted.shutdown());
  assert.equal((await restarted.get({ jobId: start.jobId })).status, 'cancelled');
});

test('selected prior partial bytes start a NEW bounded job with dated provenance and no SDK history restoration', async t => {
  const entered = Promise.withResolvers(); let calls = 0, s;
  s = await setup(t, async () => {
    if (++calls === 1) { entered.resolve(); return new Promise(() => {}); }
    return { modelRuntime: s.f.runtime, adapter: adapter() };
  });
  const old = s.research.start(INPUT); await entered.promise;
  await s.research.cancel({ jobId: old.jobId });
  const page = await s.research.readArtifact({ jobId: old.jobId, artifact: 'request' });
  const selection = { startByte: 0, endByte: page.content.totalBytes };
  const selector = { jobId: old.jobId, artifact: 'request', expectedRevision: page.revision, selection };
  const done = await terminal(s.research, s.research.start({ ...INPUT, partials: [selector] }));
  assert.equal(done.status, 'completed'); assert.notEqual(done.jobId, old.jobId);
  assert(done.referenceBytes > 0); assert(done.toolOutputBytes <= done.limits.toolOutputBytes);
  const prompt = JSON.stringify(s.f.trace[0].context.messages);
  assert.match(prompt, new RegExp(old.jobId)); assert.match(prompt, /priorIncomplete/); assert.match(prompt, /freshlyVerified/);
  const output = JSON.parse(await fs.readFile(join(s.workRoot, done.outputs.output), 'utf8'));
  assert.match(output.data, /Prior incomplete material warnings and provenance/);
  assert.match(output.data, new RegExp(page.revision));
  const priorOnly = report();
  priorOnly.findings = [{ text: 'Prior work alone is not fresh independent evidence.', kind: 'evidence', sources: ['P1'] }];
  priorOnly.comparison.sources = ['P1'];
  const g = runtime([searchStep, { text: JSON.stringify(priorOnly) }]);
  const limited = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => ({ modelRuntime: g.runtime, adapter: adapter() }) });
  t.after(() => limited.shutdown());
  const unsupported = await terminal(limited, limited.start({ ...INPUT, partials: [selector] }));
  assert.equal(unsupported.reason, 'invalid_report');
  assert.deepEqual(unsupported.reportFailure, { stage: 'evidence', code: 'missing_inspected_evidence', field: 'findings' });
  assert.equal(unsupported.outputs.proposal, undefined);
  const before = calls;
  const path = join(s.workRoot, 'jobs', old.jobId + '.request.json');
  await fs.appendFile(path, ' ');
  const refused = await terminal(s.research, s.research.start({ ...INPUT, partials: [selector] }));
  assert.equal(refused.reason, 'reference_context_unavailable'); assert.equal(calls, before);
  assert.deepEqual(await fs.readdir(s.archiveRoot), []);
});

test('missing/stale/over-budget continuation fails before dependency or auth initialization', async t => {
  let calls = 0;
  const s = await setup(t, async () => { calls++; throw Error('synthetic setup failure'); });
  const old = await terminal(s.research, s.research.start(INPUT));
  const page = await s.research.readArtifact({ jobId: old.jobId, artifact: 'request' });
  const selector = { jobId: old.jobId, artifact: 'request', expectedRevision: page.revision, selection: { startByte: 0, endByte: page.content.totalBytes } };
  for (const request of [
    { ...INPUT, partials: [{ ...selector, jobId: 'job-' + '0'.repeat(32) }] },
    { ...INPUT, partials: [{ ...selector, expectedRevision: '0'.repeat(64) }] },
    { ...INPUT, partials: [{ ...selector, selection: { startByte: 0, endByte: 10001 } }] },
    { ...INPUT, partials: [selector], limits: { toolOutputBytes: 32 } },
  ]) {
    const done = await terminal(s.research, s.research.start(request));
    assert.equal(done.reason, 'reference_context_unavailable'); assert.equal(done.modelCalls, 0); assert.equal(calls, 1);
  }
  const path = join(s.workRoot, old.outputs.request), v = JSON.parse(await fs.readFile(path, 'utf8'));
  v.data.question = 'password=0123456789abcdefghijklmnop';
  await fs.writeFile(path, JSON.stringify(v).replace('password=', 'password\\u003d'));
  await assert.rejects(s.research.readArtifact({ jobId: old.jobId, artifact: 'request' }), /^Error: artifact_unavailable$/);
});

test('cancellation during an active tool retains already-inspected source, and late source settlement is harmless', async t => {
  const entered = Promise.withResolvers(), pending = Promise.withResolvers();
  const f = runtime([searchStep, fetchStep, fetchStep]); let fetched = 0;
  const s = await setup(t, async () => ({ modelRuntime: f.runtime, adapter: adapter({ fetch: async url => {
    if (++fetched === 2) { entered.resolve(); return pending.promise; }
    return adapter().fetch(url);
  } }) }));
  const start = s.research.start(INPUT); await entered.promise;
  const running = await s.research.get({ jobId: start.jobId });
  const source = await s.research.readArtifact({ jobId: start.jobId, artifact: 'source-1' });
  assert.match(source.content.text, /people with disabilities/);
  assert(running.outputs.source1);
  const done = await s.research.cancel({ jobId: start.jobId });
  assert.equal(done.status, 'cancelled'); assert.equal(done.reason, 'user_stop');
  assert.equal(done.outputs.proposal, undefined);
  const before = JSON.stringify(done), files = await fs.readdir(join(s.workRoot, 'jobs'));
  pending.resolve(await adapter().fetch(URL));
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(JSON.stringify(await s.research.get({ jobId: start.jobId })), before);
  assert.deepEqual(await fs.readdir(join(s.workRoot, 'jobs')), files);
  assert.equal(f.trace.length, 3);
  assert.deepEqual(await fs.readdir(s.archiveRoot), []);
});

test('artifact byte selection preserves a leading U+FEFF and rejects split UTF-8 boundaries', async t => {
  const s = await setup(t, async () => { throw Error('synthetic setup refusal'); });
  const done = await terminal(s.research, s.research.start({ ...INPUT, question: 'Question with \ufeffé😀 exact bytes?' }));
  const first = await s.research.readArtifact({ jobId: done.jobId, artifact: 'request' });
  const bytes = await fs.readFile(join(s.workRoot, done.outputs.request));
  const startByte = bytes.indexOf('\ufeffé😀');
  assert(startByte >= 0);
  const args = { jobId: done.jobId, artifact: 'request', expectedRevision: first.revision,
    selection: { startByte, endByte: startByte + Buffer.byteLength('\ufeffé😀') } };
  const selected = await s.research.readArtifact(args);
  assert.equal(selected.content.text, '\ufeffé😀');
  assert.equal(selected.continuation, null);
  await assert.rejects(s.research.readArtifact({ ...args, selection: { startByte: startByte + 1, endByte: args.selection.endByte } }));
});

for (const stage of ['auth', 'model']) test(`cancel pending ${stage} without further model dispatch or late state mutation`, async t => {
  const entered = Promise.withResolvers(), pending = Promise.withResolvers(), f = runtime(steps());
  const originalAuth = f.runtime.getAuth, originalStream = f.runtime.streamSimple;
  if (stage === 'auth') f.runtime.getAuth = async () => { entered.resolve(); await pending.promise; return originalAuth(); };
  else f.runtime.streamSimple = function (...args) {
    const stream = originalStream.apply(this, args);
    return { async *[Symbol.asyncIterator]() { entered.resolve(); await pending.promise; yield* stream; }, result: () => stream.result() };
  };
  const s = await setup(t, async () => ({ modelRuntime: f.runtime, adapter: adapter() }));
  const start = s.research.start(INPUT); await entered.promise;
  const done = await s.research.cancel({ jobId: start.jobId });
  assert.equal(done.status, 'cancelled'); assert.equal(done.reason, 'user_stop'); assert.equal(done.outputs.proposal, undefined);
  const before = JSON.stringify(done), files = await fs.readdir(join(s.workRoot, 'jobs'));
  pending.resolve(); await new Promise(resolve => setTimeout(resolve, 15));
  assert.equal(f.trace.length, 0);
  assert.equal(JSON.stringify(await s.research.get({ jobId: start.jobId })), before);
  assert.deepEqual(await fs.readdir(join(s.workRoot, 'jobs')), files);
});

for (const mode of ['limit', 'provider']) test(`${mode} stop retains an incrementally inspected passage and public plan`, async t => {
  const f = runtime(mode === 'limit' ? steps() : [searchStep, fetchStep, { stopReason: 'error', errorMessage: 'synthetic-private-runtime-error' }]);
  const s = await setup(t, async () => ({ modelRuntime: f.runtime, adapter: adapter() }));
  const start = s.research.start({ ...INPUT, ...(mode === 'limit' ? { limits: { modelCalls: 2 } } : {}) });
  const done = await terminal(s.research, start);
  assert.equal(done.status, mode === 'limit' ? 'incomplete' : 'failed');
  assert.equal(done.reason, mode === 'limit' ? 'model_call_limit' : 'provider_failure');
  assert.equal(done.outputs.proposal, undefined);
  const source = await s.research.readArtifact({ jobId: done.jobId, artifact: 'source-1' });
  assert.match(source.content.text, /people with disabilities/);
  assert(done.outputs.plan && done.outputs.request);
  assert.doesNotMatch(JSON.stringify(done), /synthetic-private-runtime-error/);
  assert.deepEqual(await fs.readdir(s.archiveRoot), []);
});

for (const kind of ['truncated', 'oversized', 'symlink', 'directory', 'unexpected']) test(`recovery preserves ${kind} survivor bytes and independently valid material without auth`, async t => {
  const s = await setup(t, async () => { throw Error('synthetic setup failure'); });
  const old = await terminal(s.research, s.research.start(INPUT)); await s.research.shutdown();
  const path = join(s.workRoot, 'jobs', old.jobId + '.json');
  await fs.rename(path, path + '.original');
  if (kind === 'symlink') await fs.symlink(s.path, path);
  else if (kind === 'directory') await fs.mkdir(path);
  else await fs.writeFile(path, kind === 'oversized' ? 'x'.repeat(65537) : kind === 'unexpected' ? JSON.stringify({ ...old, privateMarker: 'do not echo me' }) : '{');
  let calls = 0;
  const recovered = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => { calls++; throw Error('NO AUTH'); } });
  t.after(() => recovered.shutdown());
  const status = await recovered.get({ jobId: old.jobId });
  assert.equal(status.status, 'interrupted'); assert.equal(status.reason, 'survivor_invalid'); assert.equal(status.retention, 'unavailable');
  assert.equal(calls, 0); assert.equal(status.outputs.proposal, undefined);
  assert.doesNotMatch(JSON.stringify(status), /do not echo me/);
  const material = await recovered.readArtifact({ jobId: old.jobId, artifact: 'request' }); assert(material.revision);
  const stat = await fs.lstat(path);
  if (kind === 'symlink') assert(stat.isSymbolicLink());
  else if (kind === 'directory') assert(stat.isDirectory());
  else assert.equal(stat.size, kind === 'oversized' ? 65537 : kind === 'truncated' ? 1 : Buffer.byteLength(JSON.stringify({ ...old, privateMarker: 'do not echo me' })));
});

test('continuation of a selected source retains exact inherited warnings, corrections, citations and original dates', async t => {
  const s = await setup(t);
  const body = '# Old finding\n\nDated value [old].\n\n## Correction\nCORRECTION_MARKER: value withdrawn.\n\n[old]: https://www.w3.org/WAI/\n';
  const imported = (await s.archive.importReport({ text: body, metadata: { ...metadata('legacy'), researched_at: '2020-01-02', warnings: ['METADATA_WARNING_MARKER'], superseded_by: 'replacement' } })).proposal;
  const { review } = await s.archive.reviewProposal({ proposalId: imported.proposalId });
  const accepted = await s.archive.acceptProposal({ proposalId: imported.proposalId, expectedRevision: imported.revision,
    expectedBaseRevision: null, acceptedAt: review.acceptedAt, expectedCatalogueRevision: review.expectedCatalogueRevision, expectedReviewDigest: review.reviewDigest });
  const old = await terminal(s.research, s.research.start({ ...INPUT, references: [{ reportId: 'legacy', expectedRevision: accepted.revision,
    selection: { startByte: 0, endByte: Buffer.byteLength(body) } }] }));
  assert.equal(old.status, 'completed');
  const source = await s.research.readArtifact({ jobId: old.jobId, artifact: 'source-1' });
  // Only a narrow passage is selected; required qualifications must still travel.
  const raw = await fs.readFile(join(s.workRoot, old.outputs.source1));
  const startByte = raw.indexOf(TEXT);
  assert(startByte >= 0);
  const f = runtime(steps());
  const next = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }) });
  t.after(() => next.shutdown());
  const done = await terminal(next, next.start({ ...INPUT, partials: [{ jobId: old.jobId, artifact: 'source-1', expectedRevision: source.revision,
    selection: { startByte, endByte: startByte + Buffer.byteLength(TEXT) } }] }));
  assert.equal(done.status, 'completed');
  const prompt = JSON.stringify(f.trace[0].context.messages);
  for (const marker of ['CORRECTION_MARKER', 'METADATA_WARNING_MARKER', 'replacement', '2020-01-02', accepted.revision]) assert(prompt.includes(marker));
  const output = JSON.parse(await fs.readFile(join(s.workRoot, done.outputs.output), 'utf8')).data;
  for (const marker of ['CORRECTION_MARKER', 'METADATA_WARNING_MARKER', 'replacement', '2020-01-02', accepted.revision]) assert(output.includes(marker));
});
