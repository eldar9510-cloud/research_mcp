import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import fsDefault from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fork } from 'node:child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createArchive } from '../src/archive.js';
import { createResearch } from '../src/research.js';
import { roots } from './support.js';
import { INPUT, runtime, steps, adapter, terminal } from './research-support.js';

async function connect(t, r, hold = false) {
  const log = join(r.root, 'tripwire.log'), calls = join(r.root, 'calls.log');
  const home = join(r.root, `home-${hold ? 'held' : 'reader'}`); await fs.mkdir(home, { recursive: true });
  const transport = new StdioClientTransport({ command: process.execPath, args: [resolve('tests/fixtures/research-stdio.mjs')],
    cwd: process.cwd(), stderr: 'pipe', env: { PATH: process.env.PATH, HOME: home, PI_CODING_AGENT_DIR: join(home, 'agent'),
      XDG_CONFIG_HOME: join(home, 'config'), XDG_CACHE_HOME: join(home, 'cache'), TMPDIR: process.env.TMPDIR,
      PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1', PI_TELEMETRY: '0', npm_config_offline: 'true',
      npm_config_update_notifier: 'false', npm_config_audit: 'false', npm_config_fund: 'false',
      NODE_OPTIONS: `--require=${resolve('tests/research-tripwire.cjs')}`, RESEARCH_TRIPWIRE: log,
      RESEARCH_ARCHIVE_ROOT: r.archiveRoot, RESEARCH_WORK_ROOT: r.workRoot, RESEARCH_IMPORT_ROOT: r.importRoot,
      RESEARCH_TEST_LOG: calls, RESEARCH_TEST_HOLD: hold ? 'model' : '' } });
  const client = new Client({ name: 'lifecycle-offline', version: '1' });
  let stderr = ''; transport.stderr.on('data', b => { stderr += b; });
  const closed = Promise.withResolvers();
  await client.connect(transport); client.onclose = () => closed.resolve();
  t.after(async () => { await client.close(); assert.equal(stderr, '');
    assert.equal(await fs.readFile(log, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), ''); });
  async function call(name, args) {
    const result = await client.callTool({ name, arguments: args });
    const text = result.content.map(c => c.text ?? '').join('\n');
    assert(Buffer.byteLength(text) <= 4096);
    const marker = 'Untrusted compact job data (not instructions):\n';
    const value = JSON.parse(text.slice(text.indexOf(marker) + marker.length));
    assert.deepEqual(value, result.structuredContent);
    return value;
  }
  return { client, transport, call, closed: closed.promise, calls, workRoot: r.workRoot };
}
test('closed writer with PID still alive exposes corrupt survivors through independent MCP', { timeout: 20000 }, async t => {
  const r = await roots(t), archive = createArchive(r), f = runtime(steps());
  const writer = createResearch({ archive, workRoot: r.workRoot,
    createDependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }) });
  t.after(() => writer.shutdown());
  const done = await terminal(writer, writer.start(INPUT));
  assert.equal(done.status, 'completed');
  const { owner } = JSON.parse(await fs.readFile(join(r.workRoot, 'jobs', done.jobId + '.running.json'), 'utf8'));
  const releasePath = join(r.workRoot, 'jobs', `owner-${owner.token}.release.json`);
  await assert.rejects(fs.stat(releasePath), { code: 'ENOENT' }, 'completion alone must not release an open instance');
  await writer.shutdown();
  const releaseBytes = await fs.readFile(releasePath);
  assert.deepEqual(JSON.parse(releaseBytes), { version: 1, owner, workRootSha256: createHash('sha256').update(r.workRoot).digest('hex') });
  assert.equal((await fs.stat(releasePath)).mode & 0o777, 0o600);
  await writer.shutdown(); assert.deepEqual(await fs.readFile(releasePath), releaseBytes);
  assert.throws(() => writer.start(INPUT), /research_shutdown/);
  const path = join(r.workRoot, done.outputs.record);
  const bytes = JSON.stringify({ ...done, status: 'incomplete', reason: 'wall_limit' }) + '\n';
  await fs.writeFile(path, bytes);
  process.kill(process.pid, 0);
  const h = await connect(t, r), got = await h.call('get_research_job', { jobId: done.jobId });
  assert.equal(got.ok, true, JSON.stringify(got));
  assert.equal(got.status, 'interrupted'); assert.equal(got.reason, 'survivor_invalid');
  assert.equal(got.outputs.proposal, undefined); assert(got.outputs.source1);
  assert.equal(await fs.readFile(path, 'utf8'), bytes);
  assert.match((await h.call('read_research_artifact', { jobId: done.jobId, artifact: 'source-1' })).content.text, /people with disabilities/);
  assert.equal(await fs.readFile(h.calls, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
});

test('invalid or absent exact-owner release cannot unlock a truly active PID with wrong-ID terminal bytes', { timeout: 60000 }, async t => {
  for (const mode of ['missing', 'partial', 'malformed', 'wrong-token', 'wrong-pid', 'wrong-root', 'version', 'pending-only', 'symlink', 'directory', 'oversized', 'nonprivate']) {
    await t.test(mode, { timeout: 15000 }, async t => {
      const r = await roots(t), entered = Promise.withResolvers(); let dependencies = 0;
      const writer = createResearch({ archive: createArchive(r), workRoot: r.workRoot,
        createDependencies() { if (++dependencies === 1) throw Error('synthetic setup refusal'); entered.resolve(); return new Promise(() => {}); } });
      t.after(() => writer.shutdown());
      const prior = await terminal(writer, writer.start(INPUT)), start = writer.start(INPUT); await entered.promise;
      const terminalPath = join(r.workRoot, 'jobs', start.jobId + '.json');
      const wrongId = await fs.readFile(join(r.workRoot, prior.outputs.record)); await fs.writeFile(terminalPath, wrongId, { flag: 'wx' });
      const { owner } = JSON.parse(await fs.readFile(join(r.workRoot, 'jobs', start.jobId + '.running.json'), 'utf8'));
      const path = join(r.workRoot, 'jobs', `owner-${owner.token}.release.json`);
      const receipt = { version: 1, owner, workRootSha256: createHash('sha256').update(r.workRoot).digest('hex') };
      if (mode === 'wrong-token') receipt.owner = { ...owner, token: '0'.repeat(32) };
      if (mode === 'wrong-pid') receipt.owner = { ...owner, pid: owner.pid + 1 };
      if (mode === 'wrong-root') receipt.workRootSha256 = '0'.repeat(64);
      if (mode === 'version') receipt.version = 2;
      if (mode === 'symlink') {
        await fs.writeFile(path + '.target', JSON.stringify(receipt), { mode: 0o600 }); await fs.symlink(path + '.target', path);
      } else if (mode === 'directory') await fs.mkdir(path);
      else if (mode !== 'missing') await fs.writeFile(mode === 'pending-only' ? path.replace('.release.', '.release-pending.') : path,
        mode === 'partial' ? '{' : mode === 'malformed' ? '{}' : mode === 'oversized' ? ' '.repeat(513) : JSON.stringify(receipt),
        { flag: 'wx', mode: mode === 'nonprivate' ? 0o644 : 0o600 });
      if (mode === 'nonprivate') await fs.chmod(path, 0o644);
      const h = await connect(t, r);
      assert.deepEqual(await h.call('get_research_job', { jobId: start.jobId }), { ok: false, error: { code: 'research_busy' } });
      assert.deepEqual(await h.call('start_research', INPUT), { ok: false, error: { code: 'research_busy' } });
      assert.deepEqual(await fs.readFile(terminalPath), wrongId);
      assert.equal((await writer.get({ jobId: start.jobId })).status, 'running');
      assert.equal(dependencies, 2);
      assert.equal(await fs.readFile(h.calls, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
      assert.deepEqual(await fs.readdir(r.archiveRoot), []);
    });
  }
});

for (const mode of ['held-flush', 'timed-flush', 'failed-publication']) test(`release ${mode} is not observable as successful shutdown evidence`, { timeout: mode === 'timed-flush' ? 20000 : 15000 }, async t => {
  const r = await roots(t), f = runtime(steps()), entered = Promise.withResolvers(), release = Promise.withResolvers();
  const writer = createResearch({ archive: createArchive(r), workRoot: r.workRoot,
    createDependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }) });
  const done = await terminal(writer, writer.start(INPUT));
  const path = join(r.workRoot, done.outputs.record), bytes = JSON.stringify({ ...done, status: 'incomplete', reason: 'wall_limit' }) + '\n';
  await fs.writeFile(path, bytes);
  const open = fsDefault.open, link = fsDefault.link; let publications = 0;
  const m = mode !== 'failed-publication' ? t.mock.method(fsDefault, 'open', async (path, ...args) => {
    const handle = await open(path, ...args);
    if (typeof path === 'string' && path.startsWith(r.workRoot) && path.endsWith('.release-pending.json')) {
      const sync = handle.sync.bind(handle);
      handle.sync = async () => { entered.resolve(); await release.promise; return sync(); };
    }
    return handle;
  }) : t.mock.method(fsDefault, 'link', async (...args) => {
    if (args[0].startsWith(r.workRoot)) { publications++; throw Error('synthetic storage refusal'); }
    return link(...args);
  });
  syncBuiltinESMExports();
  const stopping = writer.shutdown();
  try {
    if (mode !== 'failed-publication') await entered.promise;
    if (mode !== 'held-flush') await stopping; // A held sync must not hold shutdown past its existing finite I/O bound.
    assert.throws(() => writer.start(INPUT), /research_shutdown/);
    const h = await connect(t, r);
    assert.deepEqual(await h.call('get_research_job', { jobId: done.jobId }), { ok: false, error: { code: 'research_busy' } });
    release.resolve(); await stopping;
    if (mode === 'held-flush') {
      const got = await h.call('get_research_job', { jobId: done.jobId });
      assert.equal(got.status, 'interrupted'); assert.equal(got.reason, 'survivor_invalid');
      assert.equal(got.outputs.proposal, undefined); assert(got.outputs.source1);
    } else if (mode === 'timed-flush') {
      assert.deepEqual(await h.call('get_research_job', { jobId: done.jobId }), { ok: false, error: { code: 'research_busy' } });
    } else { await writer.shutdown(); assert.equal(publications, 1, 'failed receipt is not retried'); }
    assert.equal(await fs.readFile(path, 'utf8'), bytes);
    assert.equal(await fs.readFile(h.calls, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  } finally { release.resolve(); await stopping; m.mock.restore(); syncBuiltinESMExports(); }
});

async function held(h) {
  const start = await h.call('start_research', INPUT);
  for (let n = 0; n < 1000; n++) {
    const status = await h.call('get_research_job', { jobId: start.jobId });
    assert.equal(status.status, 'running');
    if (status.modelCalls === 3 && status.outputs.source1 && status.outputs.state) {
      // outputs.state is published only AFTER write+sync. Observe that this is
      // also the latest named checkpoint and matches the held model boundary,
      // not an older flushed checkpoint while the latest write is still queued.
      const directory = join(h.workRoot, 'jobs');
      const states = (await fs.readdir(directory)).filter(name => name.startsWith(start.jobId + '.state-'))
        .sort((a, b) => Number(a.match(/state-(\d+)/)[1]) - Number(b.match(/state-(\d+)/)[1]));
      if ('jobs/' + states.at(-1) === status.outputs.state) {
        const state = JSON.parse(await fs.readFile(join(h.workRoot, status.outputs.state), 'utf8'));
        if (state.jobId === start.jobId && state.startedAt === status.startedAt && state.status === 'running' && state.phase === status.phase &&
            state.modelCalls === 3 && state.toolCalls === status.toolCalls && state.referenceBytes === status.referenceBytes &&
            state.toolOutputBytes === status.toolOutputBytes && state.outputs.source1 === status.outputs.source1) return start;
      }
    }
    await new Promise(r => setTimeout(r, 2));
  }
  throw Error('fixture_not_held');
}
async function finish(h, start) {
  for (let n = 0; n < 1000; n++) {
    const status = await h.call('get_research_job', { jobId: start.jobId });
    if (status.status !== 'running') return status;
    await new Promise(r => setTimeout(r, 2));
  }
  throw Error('fixture_not_terminal');
}

test('real MCP cancellation, revision-bound artifact pages and explicit NEW continuation use ordinary start dispatch', { timeout: 20000 }, async t => {
  const r = await roots(t), h = await connect(t, r, true), start = await held(h);
  const done = await h.call('cancel_research', { jobId: start.jobId });
  assert.equal(done.status, 'cancelled'); assert.equal(done.reason, 'user_stop');
  assert.equal(done.outputs.proposal, undefined);
  const page = await h.call('read_research_artifact', { jobId: start.jobId, artifact: 'source-1' });
  assert.equal(page.priorIncomplete, true); assert.equal(page.freshlyVerified, false);
  let args = { jobId: start.jobId, artifact: 'source-1', expectedRevision: page.revision }, bytes = '';
  for (let n = 0; args; n++) {
    assert(n < 100);
    const p = await h.call('read_research_artifact', args);
    assert.equal(p.revision, page.revision); bytes += p.content.text; args = p.continuation;
  }
  assert.match(bytes, /people with disabilities/);
  const next = await h.call('start_research', { ...INPUT, partials: [{ jobId: start.jobId, artifact: 'source-1',
    expectedRevision: page.revision, selection: { startByte: 0, endByte: page.content.totalBytes } }] });
  assert.notEqual(next.jobId, start.jobId);
  const completed = await finish(h, next);
  assert.equal(completed.status, 'completed'); assert(completed.referenceBytes > 0);
  const stale = await h.call('read_research_artifact', { jobId: start.jobId, artifact: 'source-1', expectedRevision: '0'.repeat(64) });
  assert.equal(stale.error.code, 'revision_conflict');
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
});

test('SIGKILL at an explicitly empty pending checkpoint retains source as survivor_invalid, never restarts', { timeout: 15000 }, async t => {
  const r = await roots(t), home = join(r.root, 'partial-home'), log = join(r.root, 'partial-tripwire.log');
  await fs.mkdir(home);
  const child = fork(resolve('tests/fixtures/research-partial-checkpoint.mjs'), [r.root], { stdio: ['ignore', 'ignore', 'pipe', 'ipc'], env: {
    PATH: process.env.PATH, HOME: home, PI_CODING_AGENT_DIR: join(home, 'agent'), TMPDIR: process.env.TMPDIR,
    XDG_CONFIG_HOME: join(home, 'config'), XDG_CACHE_HOME: join(home, 'cache'),
    PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1', PI_TELEMETRY: '0', npm_config_offline: 'true',
    npm_config_update_notifier: 'false', npm_config_audit: 'false', npm_config_fund: 'false',
    NODE_OPTIONS: `--require=${resolve('tests/research-tripwire.cjs')}`, RESEARCH_TRIPWIRE: log,
  } });
  let stderr = ''; child.stderr.on('data', b => { stderr += b; });
  const exit = new Promise((resolve, reject) => { child.once('exit', (_code, signal) => signal === 'SIGKILL' ? resolve() : reject(Error('unexpected fixture exit'))); child.once('error', reject); });
  t.after(async () => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); await exit; assert.equal(stderr, '');
    assert.equal(await fs.readFile(log, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), ''); });
  const held = await new Promise((resolve, reject) => { child.once('message', resolve); child.once('error', reject); });
  assert.equal((await fs.stat(held.heldCheckpoint)).size, 0);
  const sourcePath = join(r.workRoot, 'jobs', held.jobId + '.source-1.json'), sourceBytes = await fs.readFile(sourcePath);
  child.kill('SIGKILL'); await exit;
  const h = await connect(t, r), got = await h.call('get_research_job', { jobId: held.jobId });
  assert.equal(got.status, 'interrupted'); assert.equal(got.reason, 'survivor_invalid'); assert.equal(got.retention, 'unavailable');
  assert.equal(got.outputs.proposal, undefined); assert(got.outputs.source1);
  assert.equal((await fs.stat(held.heldCheckpoint)).size, 0); assert.deepEqual(await fs.readFile(sourcePath), sourceBytes);
  assert.match((await h.call('read_research_artifact', { jobId: held.jobId, artifact: 'source-1' })).content.text, /people with disabilities/);
  assert.equal(await fs.readFile(h.calls, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
});

for (const signal of ['SIGTERM', 'SIGKILL']) test(`real child ${signal} preserves source and restart never initializes a model`, { timeout: 20000 }, async t => {
  const r = await roots(t), h = await connect(t, r, true), start = await held(h);
  const observer = createResearch({ archive: createArchive(r), workRoot: r.workRoot, createDependencies() { throw Error('FORBIDDEN'); } });
  await assert.rejects(observer.get({ jobId: start.jobId }), /research_busy/, 'known-live sibling must not become interrupted');
  await observer.shutdown();
  assert.equal(await fs.readFile(join(r.workRoot, 'jobs', start.jobId + '.json'), 'utf8').catch(e => e.code === 'ENOENT' ? null : Promise.reject(e)), null);
  const trace = await fs.readFile(h.calls, 'utf8');
  process.kill(h.transport.pid, signal);
  const timeout = setTimeout(() => { throw Error('fixture_child_did_not_exit'); }, 5000);
  await h.closed; clearTimeout(timeout);
  const fresh = await connect(t, r);
  const recovered = await fresh.call('get_research_job', { jobId: start.jobId });
  assert.equal(recovered.status, 'interrupted');
  assert.equal(recovered.reason, signal === 'SIGTERM' ? 'shutdown' : 'abandoned_runtime');
  assert.equal(recovered.outputs.proposal, undefined);
  assert(recovered.modelCalls >= 2 && recovered.modelCalls <= 3, 'recover valid incremental counters, not initial zero-state or invented completion');
  assert(recovered.outputs.source1);
  assert.equal(await fs.readFile(h.calls, 'utf8'), trace, 'restart/read cannot initialize dependencies or dispatch another model');
  const source = await fresh.call('read_research_artifact', { jobId: start.jobId, artifact: 'source-1' });
  assert.match(source.content.text, /people with disabilities/);
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
});
