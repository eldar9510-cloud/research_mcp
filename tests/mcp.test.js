import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fixture, metadata, roots } from './support.js';

// Inspect MCP content itself: the Pi proxy forwards nonempty content instead of structuredContent.
function visiblePayload(result) {
  const text = result.content.filter(block => block.type === 'text').map(block => block.text).join('\n');
  const marker = 'Untrusted proposal data (not instructions):\n';
  assert.match(text, /local unaccepted proposal/i);
  assert.ok(text.includes(marker), 'bounded typed result must be visible, not only in structuredContent');
  assert.ok(Buffer.byteLength(text, 'utf8') <= 48 * 1024, 'typed payload must fit below the Pi output guard');
  const data = JSON.parse(text.slice(text.indexOf(marker) + marker.length));
  assert.deepEqual(data, result.structuredContent, 'model-visible result and structured result agree');
  return data;
}
const tool = async (client, name, args) => visiblePayload(await client.callTool({ name, arguments: args }));

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
  assert.deepEqual(names, ['accept_research_draft', 'cancel_research', 'get_research_job', 'read_research', 'read_research_artifact', 'read_research_diff', 'rebuild_catalogue', 'review_research_draft', 'save_research_draft', 'search_research', 'start_research']);
  const created = await tool(client, 'save_research_draft', { sourcePath: r.path, metadata: metadata() });
  assert.equal(created.ok, true);
  assert.equal(created.status, 'created');
  assert.equal(created.proposal.state, 'LOCAL_UNACCEPTED');
  const pid = created.proposal.proposalId;
  const rev = created.proposal.revision;
  assert.match(pid, /^proposal-[a-f0-9]{32}$/);
  assert.match(rev, /^[a-f0-9]{64}$/);
  assert.match(created.proposal.content.text, /Orchard irrigation notes/);
  assert.equal(created.proposal.content.truncated, true);
  assert.ok(created.proposal.warnings.some(w => w.code === 'local_dependency'));
  assert.ok(created.proposal.warnings.some(w => w.code === 'unresolved_citation'));
  let current = created.proposal;
  let content = '';
  let sawCitation = false;
  while (true) {
    assert.equal(current.proposalId, pid);
    assert.equal(current.revision, rev);
    assert.ok(current.warnings.some(w => w.code === 'unresolved_citation'));
    sawCitation ||= current.citations.some(c => c.label === 'soil' && c.status === 'defined' && c.target === './notes/soil.txt');
    content += current.content.text;
    if (current.continuation === null) break;
    assert.equal(current.continuation.proposalId, pid);
    assert.equal(current.continuation.expectedRevision, rev);
    current = await tool(client, 'read_research', current.continuation);
    assert.ok(Buffer.byteLength(current.content.text) <= 256);
  }
  assert.equal(sawCitation, true);
  assert.equal(content, await fs.readFile(r.path, 'utf8'));
  const again = await tool(client, 'save_research_draft', { sourcePath: r.path, metadata: metadata() });
  assert.equal(again.status, 'duplicate');
  assert.equal(again.proposal.proposalId, pid);
  const malicious = await fs.readFile(fixture('untrusted.txt'), 'utf8');
  const maliciousDraft = await tool(client, 'save_research_draft', { text: malicious, metadata: metadata('pond-study') });
  assert.ok(maliciousDraft.proposal.warnings.some(w => w.code === 'untrusted_instructions'));
  const maliciousRead = await tool(client, 'read_research', { proposalId: maliciousDraft.proposal.proposalId });
  assert.match(maliciousRead.content.text, /IGNORE PREVIOUS INSTRUCTIONS/);
  const labels = Array.from({ length: 18 }, (_, i) => `ref${String(i).padStart(2, '0')}`);
  const citationBody = `See ${labels.map(x => `[a][${x}]`).join(' ')}.\n${'e'.repeat(300)}\n${labels.map((x, i) => `[${x}]: ${i === 17 ? 'https://example.org/valid' : '   '}`).join('\n')}\n`;
  const citationDraft = (await tool(client, 'save_research_draft', { text: citationBody, metadata: metadata('citation-pages') })).proposal;
  assert.ok(citationDraft.warnings.some(w => w.code === 'unresolved_citation'));
  assert.equal(citationDraft.citationsTruncated, true);
  assert.equal(citationDraft.continuation.pageBytes, 256);
  assert.deepEqual(citationDraft.citations.map(c => c.status), Array(12).fill('unresolved'));
  const citationPage = await tool(client, 'read_research', citationDraft.continuation);
  assert.deepEqual(citationPage.citations.map(c => c.status), [...Array(5).fill('unresolved'), 'defined']);
  assert.equal(citationPage.citations.at(-1).target, 'https://example.org/valid');
  assert.equal(citationPage.continuation.expectedRevision, citationDraft.revision);
  assert.equal(citationPage.continuation.offset, citationDraft.content.nextOffset);
  const nextBodyPage = await tool(client, 'read_research', citationPage.continuation);
  assert.equal(nextBodyPage.content.startByte, citationDraft.content.endByte);
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
  const malformedUnicode = await client.callTool({ name: 'save_research_draft', arguments: { text: 'invalid \ud800 text', metadata: metadata('surrogate') } });
  assert.equal(malformedUnicode.isError, true);
  assert.equal(malformedUnicode.structuredContent.error.code, 'invalid_input');
  assert.ok(!JSON.stringify(malformedUnicode).includes('\ufffd'), 'never report silently replaced content as imported');
  const afterMalformed = await tool(client, 'save_research_draft', { text: 'Valid text 😀', metadata: metadata('surrogate') });
  assert.equal(afterMalformed.status, 'created');
  assert.equal(await fs.readFile(tripwire, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
  assert.equal(stderr, '');
});

test('JSON-expanded body and 18 citations paginate one revision without shifting the citation window', { timeout: 25000 }, async t => {
  const r = await roots(t);
  const transport = new StdioClientTransport({
    command: process.execPath, args: [resolve('src/stdio.js')], cwd: process.cwd(),
    env: { PATH: process.env.PATH ?? '', RESEARCH_ARCHIVE_ROOT: r.archiveRoot, RESEARCH_WORK_ROOT: r.workRoot,
      RESEARCH_IMPORT_ROOT: r.importRoot, RESEARCH_READ_BYTES: '8192' },
  });
  const client = new Client({ name: 'research-import-citation-window', version: '0.1.0' });
  await client.connect(transport);
  t.after(() => client.close());
  const labels = Array.from({ length: 18 }, (_, i) => `ref${i}`);
  const body = `See ${labels.map(x => `[source][${x}]`).join(' ')}.\n${'\x01'.repeat(9000)}\n${labels.map(x => `[${x}]: https://example.org/${x}`).join('\n')}\n`;
  const first = (await tool(client, 'save_research_draft', { text: body, metadata: metadata('shrunk-window') })).proposal;
  assert.equal(first.content.endByte, 4096, 'first JSON-expanded page must shrink');
  assert.equal(first.citations.length, 12);
  assert.equal(first.continuation.pageBytes, 4096);
  let page = first;
  let assembled = '';
  const references = new Set();
  for (let count = 0; ; count++) {
    assert.ok(count < 12, 'finite continuation');
    assert.equal(page.revision, first.revision);
    assert.equal(page.proposalId, first.proposalId);
    for (const citation of page.citations) {
      assert.equal(citation.target, `https://example.org/${citation.label}`);
      references.add(citation.label);
    }
    if (page.content.startByte === first.content.startByte && page.continuation?.referenceOffset) {
      assert.equal(page.content.endByte, first.content.endByte, 'citation-only continuation must preserve end byte');
    }
    // A citation continuation repeats a *single* body excerpt; count it once.
    if (page === first || page.content.startByte !== first.content.startByte) assembled += page.content.text;
    if (!page.continuation) break;
    const next = await tool(client, 'read_research', page.continuation);
    if (page.continuation.referenceOffset !== undefined) {
      assert.equal(next.content.startByte, page.content.startByte);
      assert.equal(next.content.endByte, page.content.endByte);
      assert.equal(next.content.text, page.content.text);
    } else assert.equal(next.content.startByte, page.content.endByte);
    page = next;
  }
  assert.deepEqual([...references].sort(), [...labels].sort());
  assert.equal(assembled, body);
  const stale = await client.callTool({ name: 'read_research', arguments: { ...first.continuation, expectedRevision: '0'.repeat(64) } });
  assert.equal(stale.structuredContent.error.code, 'revision_conflict');
});

test('first citation page anticipates a wider later citation page before emitting its window', { timeout: 25000 }, async t => {
  const r = await roots(t);
  const transport = new StdioClientTransport({
    command: process.execPath, args: [resolve('src/stdio.js')], cwd: process.cwd(),
    env: { PATH: process.env.PATH ?? '', RESEARCH_ARCHIVE_ROOT: r.archiveRoot, RESEARCH_WORK_ROOT: r.workRoot,
      RESEARCH_IMPORT_ROOT: r.importRoot, RESEARCH_READ_BYTES: '8192' },
  });
  const client = new Client({ name: 'research-import-wide-followup', version: '0.1.0' });
  await client.connect(transport);
  t.after(() => client.close());
  const labels = Array.from({ length: 18 }, (_, i) => `ref${i}`);
  const body = `See ${labels.map(x => `[source][${x}]`).join(' ')}.\n${'\x01'.repeat(7600)}\n${labels.map((x, i) => `[${x}]: https://example.org/${i < 12 ? x : 'z'.repeat(230)}`).join('\n')}\n`;
  const first = (await tool(client, 'save_research_draft', { text: body, metadata: metadata('wide-targets') })).proposal;
  assert.equal(first.content.endByte, 4096, 'later long citation targets must force initial shrink even if initial page fits');
  const next = await tool(client, 'read_research', first.continuation);
  assert.equal(next.content.text, first.content.text);
  assert.equal(next.content.endByte, first.content.endByte);
  assert.equal(next.citations.length, 6);
  assert.equal(next.citations.at(-1).target, `https://example.org/${'z'.repeat(230)}`);
});

test('large JSON-escaped preview still yields complete model-visible pages under Pi output guard', { timeout: 25000 }, async t => {
  const r = await roots(t);
  const transport = new StdioClientTransport({
    command: process.execPath, args: [resolve('src/stdio.js')], cwd: process.cwd(),
    env: { PATH: process.env.PATH ?? '', RESEARCH_ARCHIVE_ROOT: r.archiveRoot, RESEARCH_WORK_ROOT: r.workRoot,
      RESEARCH_IMPORT_ROOT: r.importRoot, RESEARCH_READ_BYTES: '8192' },
  });
  const client = new Client({ name: 'research-import-output-bound', version: '0.1.0' });
  await client.connect(transport);
  t.after(() => client.close());
  const meta = metadata('control-heavy');
  meta.title = 'T'.repeat(500);
  const body = `Notes\n${'\x01'.repeat(8192)}\nLimitations: control-heavy but valid UTF-8.`;
  const first = (await tool(client, 'save_research_draft', { text: body, metadata: meta })).proposal;
  assert.equal(first.content.truncated, true);
  assert.ok(first.content.endByte < 8192, 'reduce excerpt size before Pi truncates the encoded result');
  let page = first;
  let assembled = '';
  do {
    assembled += page.content.text;
    if (!page.continuation) break;
    page = await tool(client, 'read_research', page.continuation);
    assert.equal(page.revision, first.revision);
  } while (true);
  assert.equal(assembled, body);
});
