import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createArchive } from '../src/archive.js';
import { createResearch } from '../src/research.js';
import { roots } from './support.js';
import { INPUT } from './research-support.js';

async function connect(t, r, hold = false) {
  const log = join(r.root, 'tripwire.log'), calls = join(r.root, 'calls.log');
  const home = join(r.root, `home-${hold ? 'held' : 'reader'}`); await fs.mkdir(home, { recursive: true });
  const transport = new StdioClientTransport({ command: process.execPath, args: [resolve('tests/fixtures/research-stdio.mjs')],
    cwd: process.cwd(), stderr: 'pipe', env: { PATH: process.env.PATH, HOME: home, PI_CODING_AGENT_DIR: join(home, 'agent'),
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
  return { client, transport, call, closed: closed.promise, calls };
}
async function held(h) {
  const start = await h.call('start_research', INPUT);
  for (let n = 0; n < 1000; n++) {
    const status = await h.call('get_research_job', { jobId: start.jobId });
    assert.equal(status.status, 'running');
    if (status.modelCalls === 3 && status.outputs.source1) return start;
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
