import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import fsDefault from 'node:fs/promises';
import { constants } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { join } from 'node:path';
import { createArchive } from '../src/archive.js';
import { createResearch } from '../src/research.js';
import { roots } from './support.js';
import { INPUT, runtime, steps, adapter, terminal, createSession } from './research-support.js';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function setup(t, options = {}) {
  const r = await roots(t), archive = createArchive(r), f = runtime(steps());
  const research = createResearch({ archive, workRoot: r.workRoot,
    createDependencies: options.dependencies ?? (async () => ({ modelRuntime: f.runtime, adapter: adapter() })),
    ...(options.createSession ? { createSession: options.createSession } : {}) });
  t.after(() => research.shutdown());
  return { ...r, archive, f, research };
}
function fresh(t, s) {
  let calls = 0;
  const research = createResearch({ archive: s.archive, workRoot: s.workRoot,
    createDependencies() { calls++; throw Error('RECOVERY MUST NOT INITIALIZE'); } });
  t.after(() => research.shutdown());
  return { research, calls: () => calls };
}
function restore(mock) { mock.mock.restore(); syncBuiltinESMExports(); }

test('known owned status and early cancellation do not wait for unrelated startup discovery', { timeout: 5000 }, async t => {
  const r = await roots(t), directory = join(r.workRoot, 'jobs'); await fs.mkdir(directory);
  const entered = Promise.withResolvers(), release = Promise.withResolvers(), opendir = fsDefault.opendir;
  const m = t.mock.method(fsDefault, 'opendir', async (path, ...args) => {
    if (path === directory) { entered.resolve(); await release.promise; }
    return opendir(path, ...args);
  }); syncBuiltinESMExports();
  let calls = 0;
  const research = createResearch({ archive: createArchive(r), workRoot: r.workRoot,
    createDependencies() { calls++; throw Error('NO INITIALIZATION'); } });
  let cancelling;
  try {
    await entered.promise;
    const start = research.start({ ...INPUT, limits: { wallMs: 60 } });
    const known = research.get({ jobId: start.jobId });
    cancelling = research.cancel({ jobId: start.jobId });
    assert.notEqual(await Promise.race([known, delay(30).then(() => 'blocked')]), 'blocked');
    await delay(110); release.resolve();
    const done = await cancelling;
    assert.equal(done.status, 'cancelled'); assert.equal(done.reason, 'user_stop');
    assert.equal(done.modelCalls, 0); assert.equal(calls, 0);
  } finally { release.resolve(); await cancelling?.catch(() => {}); await research.shutdown(); restore(m); }
});

for (const mode of ['known', 'unknown', 'conflicting']) test(`orphan recovery exposes ${mode} dates truthfully`, async t => {
  const s = await setup(t), done = await terminal(s.research, s.research.start(INPUT)); await s.research.shutdown();
  const directory = join(s.workRoot, 'jobs');
  for (const name of await fs.readdir(directory)) {
    const path = join(directory, name);
    if (name === done.jobId + '.json' || name === done.jobId + '.running.json' || name.startsWith(done.jobId + '.state-') || mode === 'unknown')
      await fs.rename(path, path + '.preserved');
    else if (name === done.jobId + '.request.json') await fs.rename(path, path + '.preserved');
  }
  if (mode === 'unknown') await fs.writeFile(join(directory, done.jobId + '.json'), '{');
  if (mode === 'conflicting') {
    const path = join(s.workRoot, done.outputs.source1), value = JSON.parse(await fs.readFile(path, 'utf8'));
    value.startedAt = '2020-01-02T00:00:00.000Z'; await fs.writeFile(path, JSON.stringify(value));
  }
  const r = fresh(t, s), got = await r.research.get({ jobId: done.jobId });
  assert.equal(got.status, 'interrupted');
  assert.equal(got.startedAt, mode === 'known' ? done.startedAt : null);
  if (mode === 'conflicting') assert.equal(got.reason, 'survivor_invalid');
  assert.equal(r.calls(), 0);
  if (mode === 'known') {
    await r.research.shutdown();
    assert.equal((await fresh(t, s).research.get({ jobId: done.jobId })).startedAt, done.startedAt);
  }
});

test('wrong filename identity cannot conceal a known-live owner from startup', async t => {
  const entered = Promise.withResolvers(); let calls = 0;
  const s = await setup(t, { dependencies() {
    if (++calls === 1) throw Error('synthetic setup refusal');
    entered.resolve(); return new Promise(() => {});
  } });
  const prior = await terminal(s.research, s.research.start(INPUT));
  const active = s.research.start(INPUT); await entered.promise;
  const path = join(s.workRoot, 'jobs', active.jobId + '.json');
  await fs.copyFile(join(s.workRoot, prior.outputs.record), path, constants.COPYFILE_EXCL);
  const before = await fs.readFile(path), r = fresh(t, s);
  await r.research.get({ jobId: prior.jobId });
  await assert.rejects(r.research.get({ jobId: active.jobId }), /^Error: research_busy$/);
  try { await terminal(r.research, r.research.start(INPUT)); }
  catch (e) { assert.equal(e.message, 'research_busy'); }
  assert.equal(r.calls(), 0); assert.deepEqual(await fs.readFile(path), before);
});

for (const action of ['cancel', 'shutdown']) for (const mode of ['provider_failure', 'completed']) test(`settled ${mode} survives ${action} during checkpoint flushing`, async t => {
  const disposed = Promise.withResolvers(), held = Promise.withResolvers(), release = Promise.withResolvers();
  const f = runtime(mode === 'completed' ? steps() : [...steps().slice(0, 2), { stopReason: 'error' }]);
  const s = await setup(t, { dependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }),
    createSession: async args => {
      const created = await createSession(args), dispose = created.session.dispose.bind(created.session);
      created.session.dispose = () => { dispose(); disposed.resolve(); }; return created;
    } });
  const original = fsDefault.open;
  const m = t.mock.method(fsDefault, 'open', async (path, ...args) => {
    if (typeof path === 'string' && path.startsWith(s.workRoot) && path.endsWith('.state-1.json')) { held.resolve(); await release.promise; }
    return original(path, ...args);
  }); syncBuiltinESMExports();
  try {
    const start = s.research.start({ ...INPUT, limits: { wallMs: 800 } });
    await Promise.all([held.promise, disposed.promise]);
    if (mode === 'completed') assert.equal((await fs.readdir(join(s.workRoot, 'proposals'))).length, 2);
    const stopping = action === 'cancel' ? s.research.cancel({ jobId: start.jobId }) :
      s.research.shutdown().then(() => s.research.get({ jobId: start.jobId }));
    await delay(15); release.resolve();
    const got = await stopping;
    assert.equal(got.status, mode === 'completed' ? 'completed' : 'failed');
    assert.equal(got.reason, mode === 'completed' ? null : 'provider_failure');
    assert.equal(!!got.outputs.proposal, mode === 'completed'); assert.equal(f.trace.length, 3);
  } finally { release.resolve(); restore(m); }
});

test('cancel response is not held by a stalled checkpoint until the original wall deadline', async t => {
  const setupEntered = Promise.withResolvers(), held = Promise.withResolvers(), release = Promise.withResolvers();
  const s = await setup(t, { dependencies() { setupEntered.resolve(); return new Promise(() => {}); } });
  const original = fsDefault.open;
  const m = t.mock.method(fsDefault, 'open', async (path, ...args) => {
    if (typeof path === 'string' && path.startsWith(s.workRoot) && path.endsWith('.state-1.json')) { held.resolve(); await release.promise; }
    return original(path, ...args);
  }); syncBuiltinESMExports();
  try {
    const start = s.research.start({ ...INPUT, limits: { wallMs: 800 } });
    await Promise.all([setupEntered.promise, held.promise]);
    const cancelling = s.research.cancel({ jobId: start.jobId });
    const got = await Promise.race([cancelling, delay(130).then(() => 'blocked')]);
    release.resolve(); await cancelling;
    assert.notEqual(got, 'blocked'); assert.equal(got.status, 'cancelled');
    assert.equal(got.retention, 'unavailable');
    const before = JSON.stringify(got); await delay(15);
    assert.equal(JSON.stringify(await s.research.get({ jobId: start.jobId })), before);
    assert.equal((await fs.readFile(join(s.workRoot, 'jobs', start.jobId + '.state-1.json'))).length, 0);
  } finally { release.resolve(); restore(m); }
});

test('existing tool timeout includes source checkpoint I/O and prevents late steps', async t => {
  const s = await setup(t), entered = Promise.withResolvers(), release = Promise.withResolvers(), original = fsDefault.open;
  const m = t.mock.method(fsDefault, 'open', async (path, ...args) => {
    if (typeof path === 'string' && path.startsWith(s.workRoot) && path.endsWith('.source-1.json')) { entered.resolve(); await release.promise; }
    return original(path, ...args);
  }); syncBuiltinESMExports();
  try {
    const start = s.research.start({ ...INPUT, limits: { wallMs: 800, toolTimeoutMs: 50 } });
    await entered.promise; await delay(130);
    const got = await s.research.get({ jobId: start.jobId });
    assert.equal(got.status, 'incomplete'); assert.equal(got.reason, 'tool_timeout');
    const before = JSON.stringify(got); release.resolve(); await delay(15);
    assert.equal(JSON.stringify(await s.research.get({ jobId: start.jobId })), before);
    assert.equal(s.f.trace.length, 2); assert.equal(got.outputs.source1, undefined);
    assert.equal((await fs.readFile(join(s.workRoot, 'jobs', start.jobId + '.source-1.json'))).length, 0);
  } finally { release.resolve(); restore(m); }
});

test('forced-stop survivors cannot expose a finished proposal', async t => {
  const s = await setup(t), done = await terminal(s.research, s.research.start(INPUT)); await s.research.shutdown();
  const path = join(s.workRoot, done.outputs.record), bytes = JSON.stringify({ ...done, status: 'incomplete', reason: 'wall_limit' }) + '\n';
  await fs.writeFile(path, bytes);
  const r = fresh(t, s), got = await r.research.get({ jobId: done.jobId });
  assert.equal(got.reason, 'survivor_invalid'); assert.equal(got.outputs.proposal, undefined);
  assert.equal(r.calls(), 0); assert.equal(await fs.readFile(path, 'utf8'), bytes);
  assert((await r.research.readArtifact({ jobId: done.jobId, artifact: 'source-1' })).revision);
});

test('survivor state, reason, diagnostic and configured integer counters agree', async t => {
  const s = await setup(t), done = await terminal(s.research, s.research.start(INPUT)); await s.research.shutdown();
  const { proposal, ...outputs } = done.outputs;
  const base = { ...done, status: 'incomplete', reason: 'wall_limit', outputs };
  const path = join(s.workRoot, done.outputs.record);
  for (const change of [
    { status: 'cancelled' }, { status: 'failed' }, { phase: 'investigating' }, { retention: 'pending' },
    { status: 'cancelled', reason: 'shutdown' }, { reason: 'invalid_report' },
    { modelCalls: 999999 }, { modelCalls: 1.5 }, { toolCalls: done.limits.toolCalls + 2 },
    { toolOutputBytes: done.limits.toolOutputBytes + 1 }, { referenceBytes: done.toolOutputBytes + 1 },
    { reason: 'model_call_limit' }, { reason: 'tool_call_limit' },
    { firstToolFailure: { tool: 'research_fetch', stage: 'adapter', code: 'sdk_rejected' } },
    { reason: 'invalid_report', reportFailure: { stage: 'schema', code: 'too_small', field: 'report' } },
    { reason: 'invalid_report', reportFailure: { stage: 'quote', code: 'invalid_json', field: 'report' } },
    { reportFailure: { stage: 'json', code: 'invalid_json', field: 'report' } },
    { status: 'completed', reason: null, outputs: done.outputs, modelCalls: done.limits.modelCalls + 1 },
    { status: 'completed', reason: null, outputs: done.outputs, toolCalls: done.limits.toolCalls + 1 },
  ]) {
    const bytes = JSON.stringify({ ...base, ...change }) + '\n'; await fs.writeFile(path, bytes);
    const r = fresh(t, s), got = await r.research.get({ jobId: done.jobId });
    assert.equal(got.reason, 'survivor_invalid', JSON.stringify(change)); assert.equal(r.calls(), 0);
    assert.equal(await fs.readFile(path, 'utf8'), bytes); await r.research.shutdown();
  }
});

for (const limit of ['modelCalls', 'toolCalls']) test(`counted ${limit} rejection at cap plus one survives recovery`, async t => {
  const s = await setup(t);
  const done = await terminal(s.research, s.research.start({ ...INPUT, limits: { [limit]: limit === 'modelCalls' ? 2 : 1 } }));
  assert.equal(done.status, 'incomplete');
  assert.equal(done.reason, limit === 'modelCalls' ? 'model_call_limit' : 'tool_call_limit');
  assert.equal(done[limit], done.limits[limit] + 1);
  await s.research.shutdown();
  const r = fresh(t, s), got = await r.research.get({ jobId: done.jobId });
  assert.equal(got.reason, done.reason); assert.equal(got[limit], done[limit]); assert.equal(r.calls(), 0);
});

test('only a qualified legacy shutdown receipt is normalized, without rewriting its bytes', async t => {
  const s = await setup(t, { dependencies() { throw Error('synthetic setup refusal'); } });
  const done = await terminal(s.research, s.research.start(INPUT)); await s.research.shutdown();
  const path = join(s.workRoot, done.outputs.record);
  const bytes = JSON.stringify({ ...done, status: 'cancelled', reason: 'shutdown', outputs: { record: done.outputs.record } }) + '\n';
  await fs.writeFile(path, bytes);
  const r = fresh(t, s), got = await r.research.get({ jobId: done.jobId });
  assert.equal(got.status, 'interrupted'); assert.equal(got.reason, 'shutdown');
  assert.equal(r.calls(), 0); assert.equal(await fs.readFile(path, 'utf8'), bytes);
});

test('artifact nonzero offsets require a revision; complete generated continuations still work', async t => {
  const s = await setup(t, { dependencies() { throw Error('synthetic setup refusal'); } });
  const done = await terminal(s.research, s.research.start(INPUT));
  await assert.rejects(s.research.readArtifact({ jobId: done.jobId, artifact: 'request', offset: 1 }), /^Error: invalid_input$/);
  const bytes = await fs.readFile(join(s.workRoot, done.outputs.request)), parts = [];
  let args = { jobId: done.jobId, artifact: 'request' };
  while (args) { const page = await s.research.readArtifact(args); parts.push(Buffer.from(page.content.text)); args = page.continuation; }
  assert.deepEqual(Buffer.concat(parts), bytes);
});
