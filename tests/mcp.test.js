import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fixture, metadata, roots } from './support.js';

const tool = async (client, name, args) => (await client.callTool({ name, arguments: args })).structuredContent;

test('real MCP stdio client initializes, imports and reads, including typed errors and absence of forbidden effects', { timeout: 25000 }, async t => {
  const r = await roots(t);
  const tripwire = join(r.root, 'tripwire.log');
  const transport = new StdioClientTransport({
    command: process.execPath, args: [resolve('src/stdio.js')], cwd: process.cwd(), stderr: 'pipe',
    env: {
      PATH: process.env.PATH ?? '', RESEARCH_ARCHIVE_ROOT: r.archiveRoot,
      RESEARCH_WORK_ROOT: r.workRoot, RESEARCH_IMPORT_ROOT: r.importRoot,
      RESEARCH_READ_BYTES: '256', RESEARCH_TRIPWIRE: tripwire,
      NODE_OPTIONS: `--require=${resolve('tests/tripwire.cjs')}`,
    },
  });
  let stderr = '';
  transport.stderr?.on('data', chunk => { stderr += chunk.toString(); });
  const client = new Client({ name: 'research-import-test-client', version: '0.1.0' });
  await client.connect(transport);
  t.after(async () => { await client.close(); });
  const names = (await client.listTools()).tools.map(x => x.name).sort();
  assert.deepEqual(names, ['read_research', 'save_research_draft']);
  const created = await tool(client, 'save_research_draft', { sourcePath: r.path, metadata: metadata() });
  assert.equal(created.ok, true);
  assert.equal(created.status, 'created');
  assert.equal(created.proposal.state, 'LOCAL_UNACCEPTED');
  const pid = created.proposal.proposalId;
  const rev = created.proposal.revision;
  let current = created.proposal;
  let content = '';
  while (true) {
    content += current.content.text;
    if (current.continuation === null) break;
    current = await tool(client, 'read_research', current.continuation);
    assert.equal(current.revision, rev);
    assert.ok(Buffer.byteLength(current.content.text) <= 256);
  }
  assert.equal(content, await fs.readFile(r.path, 'utf8'));
  const again = await tool(client, 'save_research_draft', { sourcePath: r.path, metadata: metadata() });
  assert.equal(again.status, 'duplicate');
  assert.equal(again.proposal.proposalId, pid);
  const malicious = await fs.readFile(fixture('untrusted.txt'), 'utf8');
  const maliciousDraft = await tool(client, 'save_research_draft', { text: malicious, metadata: metadata('pond-study') });
  assert.ok(maliciousDraft.proposal.warnings.some(w => w.code === 'untrusted_instructions'));
  const maliciousRead = await tool(client, 'read_research', { proposalId: maliciousDraft.proposal.proposalId });
  assert.match(maliciousRead.content.text, /IGNORE PREVIOUS INSTRUCTIONS/);
  const bad = await client.callTool({ name: 'read_research', arguments: { proposalId: '../outside' } });
  assert.equal(bad.isError, true);
  assert.deepEqual(bad.structuredContent, { ok: false, error: { code: 'invalid_input', message: 'Invalid proposal ID' } });
  const malformed = await client.callTool({ name: 'save_research_draft', arguments: { text: 'report', metadata: { ...metadata(), id: '../../escape' } } });
  assert.equal(malformed.structuredContent.error.code, 'invalid_input');
  const conflict = await client.callTool({ name: 'save_research_draft', arguments: { text: 'different report', metadata: metadata() } });
  assert.equal(conflict.structuredContent.error.code, 'revision_conflict');
  const syntheticCredential = `AKIA${'B'.repeat(16)}`;
  const secret = await client.callTool({ name: 'save_research_draft', arguments: { text: syntheticCredential, metadata: metadata('credential-test') } });
  assert.equal(secret.structuredContent.error.code, 'invalid_input');
  assert.ok(!JSON.stringify(secret).includes(syntheticCredential));
  assert.equal(await fs.readFile(tripwire, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  assert.equal(stderr, '');
});
