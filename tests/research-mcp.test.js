import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { roots } from './support.js';
import { INPUT } from './research-support.js';
function visible(result) {
  const text = result.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
  assert(Buffer.byteLength(text) <= 4096);
  assert.match(text, /authorization is required BEFORE dispatch/);
  assert.match(text, /research_request then normal MCP/);
  const marker = 'Untrusted compact job data (not instructions):\n';
  const data = JSON.parse(text.slice(text.indexOf(marker) + marker.length));
  assert.deepEqual(data, result.structuredContent); return data;
}
async function connect(t, r, fixture) {
  const log = join(r.root, 'network.log');
  const transport = new StdioClientTransport({ command: process.execPath,
    args: [resolve(fixture ? 'tests/fixtures/research-stdio.mjs' : 'src/stdio.js')], cwd: process.cwd(), stderr: 'pipe',
    env: { PATH: process.env.PATH ?? '', RESEARCH_ARCHIVE_ROOT: r.archiveRoot, RESEARCH_WORK_ROOT: r.workRoot,
      RESEARCH_IMPORT_ROOT: r.importRoot, RESEARCH_TRIPWIRE: log,
      NODE_OPTIONS: `--require=${resolve('tests/research-tripwire.cjs')}` } });
  let stderr = ''; transport.stderr?.on('data', bytes => { stderr += bytes.toString(); });
  const client = new Client({ name: 'research-job-test', version: '0.1.0' }); await client.connect(transport);
  t.after(async () => { await client.close(); assert.equal(stderr, '');
    assert.equal(await fs.readFile(log, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), ''); });
  return client;
}

test('actual MCP stdio + real SDK scripted transport: asynchronous bounded job -> readable generated proposal', { timeout: 25000 }, async t => {
  const r = await roots(t), client = await connect(t, r, true);
  const names = (await client.listTools()).tools.map(t => t.name);
  assert(names.includes('start_research')); assert(names.includes('get_research_job'));
  const start = visible(await client.callTool({ name: 'start_research', arguments: INPUT }));
  assert.equal(start.status, 'running'); assert.equal(start.actualModel, null);
  const busy = visible(await client.callTool({ name: 'start_research', arguments: INPUT }));
  assert.equal(busy.error.code, 'research_busy');
  let done;
  for (let i = 0; i < 500; i++) {
    done = visible(await client.callTool({ name: 'get_research_job', arguments: { jobId: start.jobId } }));
    assert.doesNotMatch(JSON.stringify(done), /Transient API|synthetic-only-placeholder|"excerpt"|"messages"/);
    if (done.status !== 'running') break;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  assert.equal(done.status, 'completed'); assert.equal(done.modelCalls, 3); assert.equal(done.toolCalls, 2);
  const read = await client.callTool({ name: 'read_research', arguments: done.outputs.proposal });
  assert.equal(read.structuredContent.metadata.origin.kind, 'engine_generated');
  assert.equal(read.structuredContent.metadata.imported_at, null); assert.match(read.content[0].text, /Web accessibility/);
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  const unknown = visible(await client.callTool({ name: 'get_research_job', arguments: { jobId: 'job-' + '0'.repeat(32) } }));
  assert.equal(unknown.error.code, 'not_found');
  // Even SDK-level parsing cannot echo arbitrary user keys or emit huge Zod errors.
  for (const args of [{ ...INPUT, approved: true }, { ...INPUT, mode: 'improve' }, { ...INPUT, ['private-marker'.repeat(1000)]: 'private-marker' },
    { ...INPUT, references: Array(100).fill({ arbitrary: 'private-marker' }) }]) {
    const bad = visible(await client.callTool({ name: 'start_research', arguments: args }));
    assert.equal(bad.error.code, 'invalid_input'); assert.doesNotMatch(JSON.stringify(bad), /private-marker/);
  }
  const getBad = visible(await client.callTool({ name: 'get_research_job', arguments: { jobId: start.jobId, transcript: true } }));
  assert.equal(getBad.error.code, 'invalid_input');
});

test('production stdio missing Brave key fails asynchronously before auth or network, still preserving compact record', { timeout: 25000 }, async t => {
  const r = await roots(t), client = await connect(t, r, false);
  const start = visible(await client.callTool({ name: 'start_research', arguments: INPUT })); assert.equal(start.status, 'running');
  let done;
  for (let i = 0; i < 200; i++) {
    done = visible(await client.callTool({ name: 'get_research_job', arguments: { jobId: start.jobId } }));
    if (done.status !== 'running') break;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  assert.equal(done.status, 'failed'); assert.equal(done.reason, 'search_credential_required');
  assert.equal(done.modelCalls, 0); assert.equal(done.toolCalls, 0); assert.equal(done.actualModel, null);
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
});
