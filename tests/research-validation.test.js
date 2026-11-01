import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createArchive } from '../src/archive.js';
import { createResearch, LIMITS } from '../src/research.js';
import { createServer } from '../src/server.js';
import { roots } from './support.js';
import { INPUT, TEXT, runtime, adapter, steps, report, searchStep, terminal } from './research-support.js';

// All candidates, including hostile keys/values, are original synthetic data.
const CANDIDATE = 'FINAL_CANDIDATE_ONLY_MARKER';
const PROSE = 'MODEL_ONLY_PROSE_MARKER';
const KEY = 'PRIVATE_FINAL_KEY_MARKER';
const VALUE = 'PRIVATE_FINAL_VALUE_MARKER';
const candidate = () => ({ ...report(), title: CANDIDATE, summary: PROSE });
const failure = (stage, code, field) => ({ stage, code, field });
async function durableText(root) {
  let text = '';
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    text += entry.name + (entry.isDirectory() ? await durableText(path) : await fs.readFile(path, 'utf8'));
  }
  return text;
}
async function setup(t, answer, script = steps(answer)) {
  const r = await roots(t), archive = createArchive(r), f = runtime(script);
  let proposals = 0, authInitializations = 0;
  t.mock.method(ModelRuntime, 'create', () => { authInitializations++; throw new Error('real_auth_forbidden'); });
  const research = createResearch({ workRoot: r.workRoot, archive: { ...archive,
    createResearchProposal: async args => { proposals++; return archive.createResearchProposal(args); } },
    createDependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }) });
  t.after(() => research.shutdown());
  const initial = research.start(INPUT), initialText = JSON.stringify(initial);
  assert.equal(Object.hasOwn(initial, 'reportFailure'), false);
  const done = await terminal(research, initial);
  assert.equal(JSON.stringify(initial), initialText);
  assert.equal(authInitializations, 0);
  return { ...r, research, done, f, get proposals() { return proposals; } };
}
async function rejected(s, expected, inspected = true) {
  const { done } = s;
  assert.equal(done.status, 'incomplete');
  assert.equal(done.reason, 'invalid_report');
  assert.deepEqual(done.reportFailure, expected);
  assert.deepEqual(Object.keys(done.reportFailure).sort(), ['code', 'field', 'stage']);
  assert.equal(done.outputs.proposal, undefined);
  assert.equal(s.proposals, 0);
  assert.equal(done.modelCalls, inspected ? 3 : 2);
  assert.equal(done.toolCalls, inspected ? 2 : 1);
  assert.equal(s.f.trace.length, done.modelCalls, 'no retry or polishing dispatch');
  assert(Buffer.byteLength(JSON.stringify(done)) <= 3800);
  assert(Object.isFrozen(done.reportFailure));
  const next = s.research.get({ jobId: done.jobId });
  assert.notEqual(next.reportFailure, done.reportFailure, 'diagnostic snapshots are copies');
  assert.throws(() => { done.reportFailure.code = VALUE; }, TypeError);
  assert.deepEqual(next, done);
  assert.deepEqual(JSON.parse(await fs.readFile(join(s.workRoot, done.outputs.record), 'utf8')), done);
  assert.equal(done.retention, 'saved');
  const names = [`${done.jobId}.json`, `${done.jobId}.plan.json`];
  if (inspected) {
    names.push(`${done.jobId}.sources.json`);
    const evidence = JSON.parse(await fs.readFile(join(s.workRoot, done.outputs.evidence), 'utf8'));
    assert.equal(evidence.sources.length, 1);
    assert.equal(evidence.sources[0].excerpt, TEXT);
    assert.deepEqual(evidence.references, []);
    assert.deepEqual(Object.keys(evidence).sort(), ['evidencePlan', 'references', 'sources']);
  } else assert.equal(done.outputs.evidence, undefined);
  assert.deepEqual((await fs.readdir(join(s.workRoot, 'jobs'))).sort(), names.sort());
  assert.deepEqual(await fs.readdir(s.archiveRoot), []);
  assert.deepEqual(await fs.readdir(join(s.workRoot, 'proposals')).catch(e => e.code === 'ENOENT' ? [] : Promise.reject(e)), []);
  const retained = JSON.stringify(done) + await durableText(s.root);
  for (const marker of [CANDIDATE, PROSE, KEY, VALUE, 'Transient API', 'synthetic-only-placeholder', '"messages"', '"context"'])
    assert.equal(retained.includes(marker), false, `must not retain ${marker}`);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(s.research.get({ jobId: done.jobId }), done, 'terminal snapshot is fixed');
}

test('actual SDK invalid-report path diagnoses JSON parse failure without retaining final text', async t => {
  await rejected(await setup(t, `${VALUE}: not JSON`), failure('json', 'invalid_json', 'report'));
});

test('schema failures expose only fixed field buckets and safe constraint classes', async t => {
  const cases = [
    ['report type', () => null, 'type', 'report'],
    ['title type', a => ({ ...a, title: null }), 'type', 'title'],
    ['summary prose', a => ({ ...a, summary: `Unsupported “${VALUE}”` }), 'prose_constraint', 'summary'],
    ['findings type', a => ({ ...a, findings: null }), 'type', 'findings'],
    ['finding type', a => ({ ...a, findings: [null] }), 'type', 'finding'],
    ['finding prose', a => { a.findings[0].text = `See https://${VALUE}.invalid/`; return a; }, 'prose_constraint', 'finding_text'],
    ['finding kind', a => { a.findings[0].kind = VALUE; return a; }, 'enum', 'finding_kind'],
    ['finding sources type', a => { a.findings[0].sources = null; return a; }, 'type', 'finding_sources'],
    ['finding source format', a => { a.findings[0].sources = [VALUE]; return a; }, 'format', 'finding_source'],
    ['duplicate sources', a => { a.findings[0].sources = ['S1', 'S1']; return a; }, 'reference_constraint', 'finding_sources'],
    ['quote type', a => { a.findings[0].quote = VALUE; return a; }, 'type', 'finding_quote'],
    ['quote source format', a => { a.findings[0].quote.source = VALUE; return a; }, 'format', 'finding_quote_source'],
    ['quote text constraint', a => { a.findings[0].quote.text = ' '; return a; }, 'text_constraint', 'finding_quote_text'],
    ['comparison type', a => ({ ...a, comparison: null }), 'type', 'comparison'],
    ['comparison prose', a => { a.comparison.text = `Unsupported [${VALUE}]`; return a; }, 'prose_constraint', 'comparison_text'],
    ['comparison sources type', a => { a.comparison.sources = null; return a; }, 'type', 'comparison_sources'],
    ['comparison source type', a => { a.comparison.sources = [null]; return a; }, 'type', 'comparison_source'],
    ['limitations type', a => ({ ...a, limitations: null }), 'type', 'limitations'],
    ['limitation prose', a => ({ ...a, limitations: [`Unsupported '${VALUE}'`] }), 'prose_constraint', 'limitation'],
    ['gaps type', a => ({ ...a, gaps: null }), 'type', 'gaps'],
    ['gap prose', a => ({ ...a, gaps: [`Unsupported <${VALUE}>`] }), 'prose_constraint', 'gap'],
    ['minimum shape', a => ({ ...a, findings: [] }), 'too_small', 'findings'],
    ['maximum shape', a => ({ ...a, gaps: Array(7).fill('Unresolved applicability.') }), 'too_big', 'gaps'],
    ['unknown root key', a => ({ ...a, [KEY]: VALUE }), 'unknown_fields', 'report'],
    ['unknown nested key', a => { a.findings[0].quote[KEY] = VALUE; return a; }, 'unknown_fields', 'finding_quote'],
  ];
  for (const [name, change, code, field] of cases) await t.test(name, async t => {
    const answer = change(candidate());
    assert(JSON.stringify(answer).length <= LIMITS.modelOutputChars, 'fixture must reach final validation');
    await rejected(await setup(t, answer), failure('schema', code, field));
  });
});

test('citation, inspected-core-evidence and quote failures remain distinct in the original validation order', async t => {
  const cases = [
    ['unknown citation before missing evidence or quote', a => { a.findings[0].sources = ['S9']; a.findings[0].kind = 'inference'; return a; }, 'citations', 'unknown_citation', 'claim_sources'],
    ['unknown comparison citation', a => { a.comparison.sources = ['S9']; return a; }, 'citations', 'unknown_citation', 'claim_sources'],
    ['no inspected core evidence before quote', a => { a.findings[0].kind = 'inference'; a.findings[0].quote.text = VALUE; return a; }, 'evidence', 'missing_inspected_evidence', 'findings'],
    ['quote substring mismatch', a => { a.findings[0].quote.text = VALUE; return a; }, 'quote', 'quote_mismatch', 'finding_quote'],
    ['quote source not claimed', a => { a.findings[0].quote.source = 'S9'; return a; }, 'quote', 'quote_mismatch', 'finding_quote'],
  ];
  for (const [name, change, stage, code, field] of cases) await t.test(name, async t => {
    await rejected(await setup(t, change(candidate())), failure(stage, code, field));
  });
  await t.test('search alone never supplies inspected evidence', async t => {
    await rejected(await setup(t, null, [searchStep, { text: JSON.stringify(candidate()) }]),
      failure('citations', 'unknown_citation', 'claim_sources'), false);
  });
});

test('hostile unknown property names never become diagnostic paths, keys, values or persisted candidates', async t => {
  for (const key of [KEY.repeat(10), `__proto__${KEY}`, 'constructor', '__proto__']) await t.test(key === '__proto__' ? 'prototype key' : `hostile key ${key.slice(0, 12)}`, async t => {
    const answer = JSON.stringify(candidate()).replace(/}$/, `,${JSON.stringify(key)}:${JSON.stringify(VALUE)}}`);
    await rejected(await setup(t, answer), failure('schema', 'unknown_fields', 'report'));
  });
});

test('valid completion and non-report failures have no reportFailure field', async t => {
  const good = await setup(t, candidate());
  assert.equal(good.done.status, 'completed');
  assert.equal(good.done.reason, null);
  assert.equal(good.proposals, 1);
  assert.equal(Object.hasOwn(good.done, 'reportFailure'), false);
  assert.equal(Object.hasOwn(JSON.parse(await fs.readFile(join(good.workRoot, good.done.outputs.record), 'utf8')), 'reportFailure'), false);
  const bad = await setup(t, null, [{ text: VALUE, stopReason: 'length' }]);
  assert.equal(bad.done.reason, 'model_output_truncated');
  assert.equal(Object.hasOwn(bad.done, 'reportFailure'), false);
  assert.equal(bad.proposals, 0);
});

test('real MCP server exposes the same fixed diagnostic within both strict visible/JSON bounds', async t => {
  const r = await roots(t), f = runtime(steps({ ...candidate(), [KEY]: VALUE }));
  let authInitializations = 0;
  t.mock.method(ModelRuntime, 'create', () => { authInitializations++; throw new Error('real_auth_forbidden'); });
  const server = createServer({ ...r, createDependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }) });
  const client = new Client({ name: 'synthetic-validation', version: '0.1.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport); await client.connect(clientTransport);
  t.after(async () => { await client.close(); await server.close(); });
  async function call(name, args) {
    const result = await client.callTool({ name, arguments: args });
    const text = result.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
    assert(Buffer.byteLength(text) <= 4096);
    const marker = 'Untrusted compact job data (not instructions):\n';
    const data = JSON.parse(text.slice(text.indexOf(marker) + marker.length));
    assert.deepEqual(data, result.structuredContent);
    assert(Buffer.byteLength(JSON.stringify(data)) <= 3800);
    for (const marker of [CANDIDATE, PROSE, KEY, VALUE]) assert.equal(text.includes(marker), false);
    return data;
  }
  const start = await call('start_research', INPUT);
  assert.equal(Object.hasOwn(start, 'reportFailure'), false);
  let done;
  for (let i = 0; i < 2000; i++) {
    done = await call('get_research_job', { jobId: start.jobId });
    if (done.status !== 'running') break;
    await new Promise(resolve => setTimeout(resolve, 2));
  }
  assert.equal(done.status, 'incomplete'); assert.equal(done.reason, 'invalid_report');
  assert.deepEqual(done.reportFailure, failure('schema', 'unknown_fields', 'report'));
  assert.equal(done.outputs.proposal, undefined);
  assert.equal(authInitializations, 0);
  assert.deepEqual(await call('get_research_job', { jobId: start.jobId }), done);
  assert.deepEqual(JSON.parse(await fs.readFile(join(r.workRoot, done.outputs.record), 'utf8')), done);
  for (const marker of [CANDIDATE, PROSE, KEY, VALUE]) assert.equal((await durableText(r.root)).includes(marker), false);
  assert.deepEqual(await fs.readdir(r.archiveRoot), []);
});
