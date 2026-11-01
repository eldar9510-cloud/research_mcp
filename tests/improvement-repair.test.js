import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createArchive } from '../src/archive.js';
import { createResearch, normalizeResearchRequest, resolveResearchReferences } from '../src/research.js';
import { createResearchHost } from '../src/research-host.js';
import { createArchiveResponder } from '../src/server.js';
import { roots, metadata } from './support.js';
import { INPUT, URL, runtime, steps, report, adapter, terminal } from './research-support.js';

const accept = async (a, p) => {
  const r = (await a.reviewProposal({ proposalId: p.proposalId })).review;
  return a.acceptProposal({ proposalId: r.proposalId, expectedRevision: r.expectedRevision, expectedBaseRevision: r.expectedBaseRevision,
    expectedCatalogueRevision: r.expectedCatalogueRevision, acceptedAt: r.acceptedAt, expectedReviewDigest: r.reviewDigest });
};
async function fixture(t, { meta = {}, body = 'Earlier exclusion finding.\n', readBytes = 2048 } = {}) {
  const r = await roots(t), archive = createArchive({ ...r, maxReadBytes: readBytes });
  const base = await accept(archive, (await archive.importReport({ text: body, metadata: { ...metadata(), question: INPUT.question, scope: INPUT.scope, ...meta } })).proposal);
  const request = { ...INPUT, mode: 'improve', references: [{ reportId: base.reportId, expectedRevision: base.revision,
    selection: { startByte: 0, endByte: Buffer.byteLength(body) } }], improvement: { base: { reportId: base.reportId, expectedRevision: base.revision },
    disposition: 'same_report', gaps: ['Correct only the selected earlier finding.'], oldSourceChecks: [] } };
  return { ...r, archive, base, request, body };
}
function investigator(t, s, script = steps(), overrides = {}) {
  const f = runtime(script), source = adapter(overrides);
  const research = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => ({ modelRuntime: f.runtime, adapter: source }) });
  t.after(() => research.shutdown());
  return { research, f };
}
async function host(t, s) {
  const env = { RESEARCH_ARCHIVE_ROOT: s.archiveRoot, RESEARCH_WORK_ROOT: s.workRoot, RESEARCH_IMPORT_ROOT: s.importRoot };
  const old = Object.fromEntries(Object.keys(env).map(k => [k, process.env[k]])); Object.assign(process.env, env);
  t.after(() => { for (const [k, v] of Object.entries(old)) if (v === undefined) delete process.env[k]; else process.env[k] = v; });
  const cwd = join(s.root, 'host'); await fs.mkdir(cwd);
  await fs.writeFile(join(cwd, '.mcp.json'), JSON.stringify({ mcpServers: { repair: { command: process.execPath, args: [resolve('src/stdio.js')], env } } }));
  const gate = createResearchHost(), ctx = { mode: 'tui', cwd, ui: { confirm: async () => { throw Error('Unexpected confirmation'); } } };
  gate.delivered({ role: 'user', content: 'Commission this exact same-report improvement and the stated particular source checks, selected evidence and finite limits. No publication.' });
  const prepare = () => gate.prepare({ server: 'repair', request: s.request, source: 'CURRENT_REQUEST',
    rationale: 'The whole delivered request commissions this exact same-report improvement, selected evidence, particular source checks and finite limits.' }, ctx);
  return { gate, ctx, prepare };
}

for (const [label, retained, url] of [
  ['literal apostrophe', "https://www.w3.org/people/O'Brien", "https://www.w3.org/people/O'Brien"],
  ['literal terminal apostrophe', "https://www.w3.org/people/James'", "https://www.w3.org/people/James'"],
  ['single-quoted apostrophe path', "'https://www.w3.org/people/O'Brien'", "https://www.w3.org/people/O'Brien"],
  ['single-quoted prose wrapper', `'${URL}'`, URL],
  ['literal quoted-path candidate', "'https://www.w3.org/people/James'", "https://www.w3.org/people/James'"],
  ['literal empty query marker', URL + '?', URL + '?'],
  ['empty authority path', 'https://www.w3.org', 'https://www.w3.org/'],
  ['dot segments', 'https://www.w3.org/WAI/../WAI/fundamentals/accessibility-intro/', URL],
]) for (const requested of [false, true]) {
  test(`retained ${label}: exact host/backend check requested=${requested}`, async t => {
    const s = await fixture(t, { body: `Earlier evidence [old].\n[old]: ${retained}\n` });
    if (requested) s.request.improvement.oldSourceChecks = [{ url, offset: 0, claim: 'Inspect only this exact prior definition.' }];
    const h = await host(t, s); assert.equal((await h.prepare()).status, 'prepared');
    assert.equal(await h.gate.authorize({ serverName: 'repair', args: s.request }, h.ctx), 'allow_once');
    let fetches = 0;
    const { research } = investigator(t, s, [steps()[0], { tool: 'research_fetch', args: { url } }, steps()[2]], {
      search: async () => [{ url, title: 'Synthetic canonical source', snippet: 'No network' }],
      fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
    });
    const done = await terminal(research, research.start(s.request));
    assert.equal(fetches, requested ? 1 : 0);
    assert.equal(done.status, requested ? 'completed' : 'failed');
    if (!requested) assert.equal(done.firstToolFailure?.code, 'old_source_check_not_requested');
  });
}

// Permission identities may ignore an empty fragment, never transport/search
// spelling or the exact requested passage. Observe the rendered public ledger too.
async function artifactValue(research, jobId, artifact) {
  let args = { jobId, artifact }, text = '';
  while (args) {
    const page = await research.readArtifact(args);
    text += page.content.text; args = page.continuation;
  }
  return JSON.parse(text).data;
}
for (const [retained, requested, fetched] of [
  [URL + '#', URL + '#', URL + '#'],
  [URL, URL + '#', URL],
  [URL + '#', URL, URL + '#'],
  [URL + '?#', URL + '?', URL + '?#'],
]) for (const allowed of [false, true]) test(`empty-fragment identity: retained=${retained}, requested=${allowed ? requested : 'NONE'}, fetched=${fetched}`, async t => {
  const s = await fixture(t, { body: `Earlier source [old].\n[old]: ${retained}\n` });
  if (allowed) s.request.improvement.oldSourceChecks = [
    { url: requested, offset: 0, claim: 'Inspect only the prior definition.' },
    { url: fetched, contains: 'A distinct unperformed passage', claim: 'A separate requested comparison.' },
  ];
  const h = await host(t, s); assert.equal((await h.prepare()).status, 'prepared');
  assert.equal(await h.gate.authorize({ serverName: 'repair', args: s.request }, h.ctx), 'allow_once');
  let fetches = 0;
  const { research } = investigator(t, s, [steps()[0], { tool: 'research_fetch', args: { url: fetched } }, steps()[2]], {
    search: async () => [{ url: fetched, title: 'Synthetic source', snippet: 'No network' }],
    fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
  });
  const done = await terminal(research, research.start(s.request));
  assert.equal(fetches, allowed ? 1 : 0); assert.equal(done.status, allowed ? 'completed' : 'failed');
  if (!allowed) { assert.equal(done.firstToolFailure?.code, 'old_source_check_not_requested'); return; }
  const output = await artifactValue(research, done.jobId, 'output');
  const ledger = JSON.parse(/```json\n([\s\S]*?)\n```/.exec(output)[1]).oldSourceChecks;
  assert.equal(ledger[0].url, requested); assert.equal(ledger[0].claim, s.request.improvement.oldSourceChecks[0].claim);
  assert.match(ledger[0].status, /^requested passage actually inspected/);
  assert.equal(ledger[0].inspectedPassages.length, 1);
  assert.equal(ledger[1].status, 'unchecked; requested check was not performed');
  assert.deepEqual(ledger[1].inspectedPassages, []);
  const source = await artifactValue(research, done.jobId, 'source-1');
  assert.equal(source.url, fetched); assert.equal(source.offset, 0);
  assert.equal(ledger[0].inspectedPassages[0].accessedAt, source.accessedAt);
  assert.equal(ledger[0].inspectedPassages[0].passageSha256, source.visibleTextSha256);
});

for (const mismatch of ['searched spelling', 'selector']) test('empty-fragment comparison does not widen exact ' + mismatch, async t => {
  const s = await fixture(t, { body: `Earlier source ${URL}#\n` });
  s.request.improvement.oldSourceChecks = [{ url: URL, offset: mismatch === 'selector' ? 1 : 0, claim: 'Inspect this particular passage only.' }];
  const fetched = URL + '#'; let fetches = 0;
  const { research } = investigator(t, s, [steps()[0], { tool: 'research_fetch', args: { url: fetched } }, steps()[2]], {
    search: async () => [{ url: mismatch === 'selector' ? fetched : URL, title: 'Synthetic source', snippet: 'No network' }],
    fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
  });
  const done = await terminal(research, research.start(s.request)); assert.equal(fetches, 0);
  assert.equal(done.firstToolFailure?.code, mismatch === 'selector' ? 'old_source_check_not_requested' : 'source_not_searched');
});

for (const [retained, requested] of [
  ['https://@www.w3.org', 'https://www.w3.org/'],
  ['https://@www.w3.org/WAI/../WAI/fundamentals/accessibility-intro/', URL],
  ['https://reader@www.w3.org/WAI/../WAI/fundamentals/accessibility-intro/', URL],
  ['https://www.w3.org?', 'https://www.w3.org/'],
  ['https://www.w3.org/WAI/../WAI/fundamentals/accessibility-intro/?;', URL],
  ["https://www.w3.org/people/O'Brien", 'https://www.w3.org/people/O'],
  ["https://www.w3.org/people/James'", 'https://www.w3.org/people/James'],
  ['https://www.w3.org:0443/WAI/../WAI/fundamentals/accessibility-intro/', URL],
]) test('raw identity bytes cannot authorize a different requested target: ' + retained, async t => {
  const s = await fixture(t, { body: `Earlier evidence [old].\n[old]: ${retained}\n` });
  s.request.improvement.oldSourceChecks = [{ url: requested, offset: 0, claim: 'Inspect only the selected prior definition.' }];
  const h = await host(t, s); await assert.rejects(h.prepare(), /research_not_prepared/);
  let setup = 0;
  const research = createResearch({ archive: s.archive, workRoot: s.workRoot,
    createDependencies: async () => { setup++; throw Error('Unexpected setup'); } });
  t.after(() => research.shutdown());
  const done = await terminal(research, research.start(s.request));
  assert.equal(done.reason, 'reference_context_unavailable'); assert.equal(setup, 0);
});

for (const [opening, closing, suffix] of [['"', '"', '.'], ['`', '`', '.'], ['<', '>', '.'],
  ['"', '"', '?'], ['<', '>', ')'], ['"', '"', '>']]) test('quoted prose keeps its complete bare-query target: ' + opening + suffix, async t => {
  const url = URL + '?', s = await fixture(t, { body: JSON.stringify({ note: `Earlier source ${opening}${url}${closing}${suffix} Original evidence remains dated.` }) });
  s.request.improvement.oldSourceChecks = [{ url, offset: 0, claim: 'Inspect only this particular prior definition.' }];
  const h = await host(t, s); assert.equal((await h.prepare()).status, 'prepared');
  assert.equal(await h.gate.authorize({ serverName: 'repair', args: s.request }, h.ctx), 'allow_once');
  const { research } = investigator(t, s, [steps()[0], { tool: 'research_fetch', args: { url } }, steps()[2]], {
    search: async () => [{ url, title: 'Synthetic quoted source', snippet: 'No network' }],
  });
  assert.equal((await terminal(research, research.start(s.request))).status, 'completed');
});

for (const [name, body, target] of [
  ['escaped query', String.raw`{"source":"https://www.w3.org/a\u003Ftopic=prior"}`, 'https://www.w3.org/a'],
  ['escaped userinfo', String.raw`{"source":"https://www.w3.org\u0040other.org/path"}`, 'https://www.w3.org/'],
  ['escaped malformed Unicode', String.raw`{"source":"https://www.w3.org/a\ud800"}`, 'https://www.w3.org/a'],
  ['escaped DEL', String.raw`{"source":"https://www.w3.org/a\u007fb"}`, 'https://www.w3.org/a'],
  ['escaped apostrophe prefix', String.raw`{"source":"https://www.w3.org/people/O\u0027Brien"}`, 'https://www.w3.org/people/O'],
  ...['\\', '`', '"', '<', '\n', '\t'].map(byte => [
    'decoded raw query ' + JSON.stringify(byte), JSON.stringify({ source: URL + '?' + byte + 'old' }), URL + '?',
  ]),
  ['decoded path control', JSON.stringify({ source: URL + '\nold' }), URL],
  ['prose raw query', `Earlier source ${URL}?\\old\n`, URL + '?'],
  ['partial JSON raw query', `{"source":"${URL}?\\old`, URL + '?'],
]) test('complete identities cannot manufacture prefix membership: ' + name, async t => {
  const s = await fixture(t, { body });
  s.request.improvement.oldSourceChecks = [{ url: target, offset: 0, claim: 'Inspect only the exact prior definition.' }];
  const known = await s.archive.inspectImprovementBase(s.request.improvement.base);
  const h = await host(t, s); let prepared = false;
  try { await h.prepare(); prepared = true; } catch (error) { assert.match(error.message, /research_not_prepared/); }
  let setups = 0, fetches = 0;
  const f = runtime([steps()[0], { tool: 'research_fetch', args: { url: target } }, steps()[2]]);
  const research = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => {
    setups++; return { modelRuntime: f.runtime, adapter: adapter({
      search: async () => [{ url: target, title: 'Synthetic prefix', snippet: 'No network' }],
      fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
    }) };
  } });
  t.after(() => research.shutdown());
  const done = await terminal(research, research.start(s.request));
  assert.deepEqual({ member: known.knownSourceUrls.includes(target), prepared, setups, fetches, status: done.status, reason: done.reason },
    { member: false, prepared: false, setups: 0, fetches: 0, status: 'incomplete', reason: 'reference_context_unavailable' });
});

for (const [body, url] of [
  [String.raw`{"source":"https://www.w3.org/people/O\u0027Brien"}`, "https://www.w3.org/people/O'Brien"],
  [String.raw`{"source":"https:\/\/www.w3.org\/prior"}`, 'https://www.w3.org/prior'],
  [String.raw`"https://www.w3.or\u0067/prior"`, 'https://www.w3.org/prior'],
]) for (const requested of [false, true]) test(`complete JSON decoded value stays usable, requested=${requested}: ${body}`, async t => {
  const s = await fixture(t, { body });
  if (requested) s.request.improvement.oldSourceChecks = [{ url, offset: 0, claim: 'Inspect only the exact prior definition.' }];
  const h = await host(t, s); assert.equal((await h.prepare()).status, 'prepared');
  assert.equal(await h.gate.authorize({ serverName: 'repair', args: s.request }, h.ctx), 'allow_once');
  let fetches = 0;
  const { research } = investigator(t, s, [steps()[0], { tool: 'research_fetch', args: { url } }, steps()[2]], {
    search: async () => [{ url, title: 'Synthetic decoded source', snippet: 'No network' }],
    fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
  });
  const done = await terminal(research, research.start(s.request));
  assert.equal(fetches, requested ? 1 : 0); assert.equal(done.status, requested ? 'completed' : 'failed');
  if (!requested) assert.equal(done.firstToolFailure?.code, 'old_source_check_not_requested');
});

test('decoded malformed Unicode cannot be replaced into an eligible source identity', async t => {
  const s = await fixture(t, { body: JSON.stringify({ source: 'https://www.w3.org/people/\ud800' }) });
  s.request.improvement.oldSourceChecks = [{ url: 'https://www.w3.org/people/%EF%BF%BD', offset: 0, claim: 'Inspect only this prior definition.' }];
  const h = await host(t, s); await assert.rejects(h.prepare(), /research_not_prepared/);
  let setup = 0;
  const research = createResearch({ archive: s.archive, workRoot: s.workRoot,
    createDependencies: async () => { setup++; throw Error('Unexpected setup'); } });
  t.after(() => research.shutdown());
  const done = await terminal(research, research.start(s.request));
  assert.equal(done.reason, 'reference_context_unavailable'); assert.equal(setup, 0);
});

for (const selector of [{ offset: 0 }, { offset: 1 }, { contains: 'different passage' }]) {
  test('metadata warning source identity requires the exact requested selector: ' + JSON.stringify(selector), async t => {
    const retained = URL.replace('https://www.w3.org/', 'HTTPS://WWW.W3.ORG:443/') + '#prior';
    const s = await fixture(t, { meta: { warnings: ['Earlier source qualification: ' + retained] } });
    s.request.improvement.oldSourceChecks = [{ url: URL, claim: 'Inspect only the selected prior definition.', offset: 0 }];
    const h = await host(t, s); assert.equal((await h.prepare()).status, 'prepared');
    assert.equal(await h.gate.authorize({ serverName: 'repair', args: s.request }, h.ctx), 'allow_once');
    let fetches = 0;
    const { research } = investigator(t, s, [steps()[0], { tool: 'research_fetch', args: { url: URL, ...selector } }, steps()[2]], {
      fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
    });
    const done = await terminal(research, research.start(s.request));
    const allowed = selector.offset === 0;
    assert.equal(fetches, allowed ? 1 : 0);
    assert.equal(done.status, allowed ? 'completed' : 'failed');
    if (!allowed) assert.equal(done.firstToolFailure.code, 'old_source_check_not_requested');
  });
}

for (const punctuation of [';', '.', ',']) test('unrequested metadata-warning URL with prose punctuation is retained: ' + punctuation, async t => {
  const s = await fixture(t, { meta: { warnings: [`Earlier supporting source ${URL}${punctuation} original evidence is unverified.`] } });
  let fetches = 0;
  const { research } = investigator(t, s, steps(), { fetch: async (...args) => { fetches++; return adapter().fetch(...args); } });
  const done = await terminal(research, research.start(s.request));
  assert.equal(fetches, 0); assert.equal(done.firstToolFailure?.code, 'old_source_check_not_requested');
});

test('a literal eligible path ending in an unmatched parenthesis remains old evidence too', async t => {
  const url = URL + 'literal)', s = await fixture(t, { body: `Earlier evidence [old].\n[old]: ${url}\n` });
  let fetches = 0;
  const { research } = investigator(t, s, [steps()[0], { tool: 'research_fetch', args: { url } }, steps()[2]], {
    search: async () => [{ url, title: 'Synthetic literal source', snippet: 'Synthetic only' }],
    fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
  });
  const done = await terminal(research, research.start(s.request));
  assert.equal(fetches, 0); assert.equal(done.firstToolFailure?.code, 'old_source_check_not_requested');
});

test('query/auth retained URLs do not manufacture eligibility for a different canonical check; host and backend refuse before setup', async t => {
  for (const [retained, requested] of [[URL + '?topic=old', URL], [URL.replace('https://', 'https://reader@'), URL], [URL + '?;', URL + '?'], [URL + '?))', URL + '?']]) {
    const s = await fixture(t, { body: `Earlier evidence [old].\n[old]: ${retained}\n` });
    s.request.improvement.oldSourceChecks = [{ url: requested, claim: 'Inspect selected definition only.', offset: 0 }];
    const h = await host(t, s); await assert.rejects(h.prepare(), /research_not_prepared/);
    let setup = 0;
    const research = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => { setup++; throw Error('Unexpected setup'); } });
    t.after(() => research.shutdown());
    const done = await terminal(research, research.start(s.request));
    assert.equal(done.reason, 'reference_context_unavailable'); assert.equal(setup, 0);
  }
});

for (const legacy of [false, true]) test('bounded task preserves canonical metadata and host receipt for ' + (legacy ? 'legacy whitespace/length' : 'short base'), async t => {
  const meta = legacy ? { question: INPUT.question + '\nHistorical canonical wording\t' + 'q'.repeat(300),
    scope: INPUT.scope + '\nHistorical constraints\t' + 's'.repeat(350) } : {};
  const s = await fixture(t, { meta }), original = await s.archive.readAccepted({ reportId: s.base.reportId });
  if (!legacy) {
    s.request.question = 'Add the selected accessibility definition comparison.';
    s.request.scope = 'Investigate only this requested gap in the same archived question.';
  }
  const h = await host(t, s); assert.equal((await h.prepare()).status, 'prepared');
  assert.equal(await h.gate.authorize({ serverName: 'repair', args: s.request }, h.ctx), 'allow_once');
  assert.throws(() => normalizeResearchRequest({ ...s.request, question: 'q'.repeat(301) }), /invalid_input/);
  assert.throws(() => normalizeResearchRequest({ ...s.request, scope: 's'.repeat(401) }), /invalid_input/);
  const { research, f } = investigator(t, s), done = await terminal(research, research.start(s.request));
  assert.equal(done.status, 'completed', JSON.stringify(done));
  const p = await s.archive.readProposal(done.outputs.proposal);
  for (const field of ['id', 'question', 'scope', 'language', 'origin', 'researched_at', 'created_at', 'imported_at']) assert.deepEqual(p.metadata[field], original.metadata[field]);
  if (legacy) assert.ok(JSON.stringify(f.trace[0].context.messages).includes('Historical canonical wording'));
  const body = await fs.readFile(join(s.workRoot, 'proposals', p.proposalId + '.body'), 'utf8');
  assert.ok(body.includes('Commissioned task and gap-work scope'));
  assert.ok(body.includes(s.request.question));
  assert.ok(done.referenceBytes <= 10000); assert.ok(done.toolOutputBytes <= 10000);
});

for (const fence of ['', '\n```text\nLegacy unclosed sample π.\r\n', '\n~~~~~text\nLegacy unclosed sample π.\r\n'])
  test('complete mandatory correction/citation context survives legacy fence ' + JSON.stringify(fence), async t => {
    const body = '\ufeffEarlier exclusion conclusion [old].\r\n[old]: https://example.org/old\r\n' + fence;
    const s = await fixture(t, { body, readBytes: 128 }), { research } = investigator(t, s);
    const done = await terminal(research, research.start(s.request)); assert.equal(done.status, 'completed');
    const p = await s.archive.readProposal(done.outputs.proposal);
    assert.ok((await fs.readFile(join(s.workRoot, 'proposals', p.proposalId + '.body'))).subarray(0, Buffer.byteLength(body)).equals(Buffer.from(body)));
    const accepted = await accept(s.archive, p), respond = createArchiveResponder(s.archive, { maxReadBytes: 128 });
    let next = { reportId: s.base.reportId, expectedRevision: accepted.revision, selection: { startByte: 0, endByte: 30 }, warningOffset: 0 }, visible = '', pages = 0;
    while (next) {
      assert.ok(++pages < 200);
      const response = await respond(() => s.archive.readAccepted(next), next, 'accepted');
      assert.equal(response.isError, undefined); assert.ok(Buffer.byteLength(response.content[0].text) <= 48 * 1024);
      if (response.structuredContent.pageType === 'warning_context') assert.equal(response.structuredContent.warningContext.contextOutstanding, true);
      visible += response.content[0].text; next = response.structuredContent.continuation;
    }
    assert.ok(visible.includes(report().findings[0].text)); assert.ok(visible.includes(URL));
  });

test('selected partial source check is allowed only under the same explicit host/backend scope', async t => {
  const s = await fixture(t), invalid = report(); invalid.comparison.sources = ['S99'];
  let fetches = 0;
  const { research } = investigator(t, s, [...steps(invalid), ...steps()], {
    fetch: async (...args) => { fetches++; return adapter().fetch(...args); },
  });
  const prior = await terminal(research, research.start(INPUT)); assert.equal(prior.reason, 'invalid_report');
  const material = await research.readArtifact({ jobId: prior.jobId, artifact: 'source-1' });
  s.request.partials = [{ jobId: prior.jobId, artifact: 'source-1', expectedRevision: material.revision,
    selection: { startByte: 0, endByte: material.content.totalBytes } }];
  s.request.improvement.oldSourceChecks = [{ url: URL, offset: 0, claim: 'Inspect only this prior incomplete source definition.' }];
  const h = await host(t, s); assert.equal((await h.prepare()).status, 'prepared');
  assert.equal(await h.gate.authorize({ serverName: 'repair', args: s.request }, h.ctx), 'allow_once');
  const done = await terminal(research, research.start(s.request)); assert.equal(done.status, 'completed');
  assert.equal(fetches, 2, 'one initial inspection and exactly one newly requested passage');
});

test('the existing 256 retained-source cap covers base plus selected qualifications in aggregate', async t => {
  const body = 'Earlier criterion.\n' + Array.from({ length: 256 }, (_, i) => `https://example.org/source-${i}\n`).join('');
  const s = await fixture(t, { body }); s.request.references[0].selection.endByte = 18;
  const otherBody = `Selected earlier source ${URL}\n`;
  const other = await accept(s.archive, (await s.archive.importReport({ text: otherBody, metadata: metadata('other-source') })).proposal);
  s.request.references.push({ reportId: other.reportId, expectedRevision: other.revision, selection: { startByte: 0, endByte: Buffer.byteLength(otherBody) } });
  const h = await host(t, s); await assert.rejects(h.prepare(), /research_not_prepared/);
  let setup = 0;
  const research = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => { setup++; throw Error('Unexpected setup'); } });
  t.after(() => research.shutdown());
  const done = await terminal(research, research.start(s.request));
  assert.equal(done.reason, 'reference_context_unavailable'); assert.equal(setup, 0);
});

test('canonical historical context consumes the existing shared budget before host/backend setup', async t => {
  const s = await fixture(t, { meta: { question: 'q'.repeat(512) } });
  const selected = await resolveResearchReferences(s.archive, s.request.references, new AbortController().signal);
  s.request.limits = { toolOutputBytes: selected.bytes }; // Selected references fit; added canonical context must not get a free allowance.
  const h = await host(t, s); await assert.rejects(h.prepare(), /research_not_prepared/);
  let setup = 0;
  const research = createResearch({ archive: s.archive, workRoot: s.workRoot, createDependencies: async () => { setup++; throw Error('Unexpected setup'); } });
  t.after(() => research.shutdown());
  const done = await terminal(research, research.start(s.request));
  assert.equal(done.status, 'incomplete'); assert.equal(done.reason, 'reference_context_unavailable'); assert.equal(setup, 0);
  assert.ok(done.referenceBytes <= s.request.limits.toolOutputBytes);
});

test('complete escaped diff at the largest read setting preserves bytes, UTF-8 boundaries and stable reviewed identity', async t => {
  const s = await fixture(t, { body: '\ufeffEarlier evidence π.\r\n' + '\u0001'.repeat(30000) + '\n', readBytes: 8192 });
  const p = (await s.archive.createImprovementProposal({ ...s.request.improvement, jobId: 'job-' + 'e'.repeat(32), requestDigest: 'f'.repeat(64),
    text: '## Improvement limitations\nNew evidence and old limits.\n', summary: 'A bounded addition.', improvedAt: '2026-11-01',
    question: INPUT.question, scope: INPUT.scope, language: 'en' })).proposal;
  const respond = createArchiveResponder(s.archive, { maxReadBytes: 8192 });
  let next = { proposalId: p.proposalId }, output = '', count = 0, first;
  while (next) {
    assert.ok(++count < 200);
    const response = await respond(() => s.archive.readProposalDiff(next), undefined, 'review');
    assert.equal(response.isError, undefined); assert.ok(Buffer.byteLength(response.content[0].text) <= 48 * 1024);
    const page = response.structuredContent; first ??= page.review;
    assert.deepEqual(page.review, first); output += page.content.text; next = page.continuation;
  }
  assert.ok(output.includes('\u0001'.repeat(30000))); assert.ok(output.includes('INDEX.json'));
});
