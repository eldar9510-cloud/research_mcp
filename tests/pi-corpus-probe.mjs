// Public-corpus observation at the existing Pi SDK -> installed adapter -> MCP seam.
// No model prompt, intent judgment, import, research, source fetch or publication.
import './research-tripwire.cjs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createArchive } from '../src/archive.js';

const engineRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sdkRoot = join(engineRoot, 'node_modules/@earendil-works/pi-coding-agent');
assert.equal(process.env.PI_SDK_ROOT, sdkRoot, 'Use THIS checkout\'s pinned SDK, never a global fallback');
assert.ok(process.env.PI_ADAPTER_INDEX, 'Set PI_ADAPTER_INDEX to the installed adapter index.ts');
const adapterIndex = resolve(process.env.PI_ADAPTER_INDEX);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const queryPath = join(engineRoot, 'evaluation/issue10/queries.json');
const resultPath = join(engineRoot, 'evaluation/issue10/results.json');
const queryBytes = await fs.readFile(queryPath), resultBytes = await fs.readFile(resultPath);
assert.equal(sha(queryBytes), 'd84a8bc1408fead6ba5b8453cb3fb300edfa63e271416eef2973ec3257d493be');
assert.equal(sha(resultBytes), '45f5a9e643e11d5f7e1a6bf87b73f6646eda054d0426a798fcb481bd58c13b79');
const spec = JSON.parse(queryBytes), prior = JSON.parse(resultBytes);
assert.deepEqual(spec.threshold, { queries: 10, topK: 3, minimumUsefulHits: 8 });
assert.equal(spec.questions.length, 10);
assert.equal(prior.binding.reportRevisions.length, 20);
assert.equal(JSON.parse(await fs.readFile(join(sdkRoot, 'package.json'))).version, '0.84.2');
assert.equal(JSON.parse(await fs.readFile(join(dirname(adapterIndex), 'package.json'))).version, '2.26.1');
const root = await fs.mkdtemp(join(tmpdir(), 'pi-public-corpus-'));
const cwd = join(root, 'project'), agentDir = join(root, 'agent');
const archiveRoot = join(root, 'archive'), workRoot = join(root, 'work'), importRoot = join(root, 'imports');
const sessions = new Set(), originals = new Map(), metrics = { search: [], read: [] };
const sourceIndex = await fs.readFile(join(engineRoot, 'INDEX.json'));
assert.equal(sha(sourceIndex), prior.binding.catalogueRevision);
const previousEnv = process.env;
try {
  for (const dir of [cwd, agentDir, archiveRoot, workRoot, importRoot, join(archiveRoot, 'reports'),
    join(root, 'home'), join(root, 'config'), join(root, 'cache'), join(root, 'tmp')]) await fs.mkdir(dir);
  // The default adapter really reads this fresh project's .mcp.json, with no
  // ambient configuration, .mcp.env, credentials, or in-memory config substitute.
  process.env = { PATH: previousEnv.PATH, HOME: join(root, 'home'), XDG_CONFIG_HOME: join(root, 'config'),
    XDG_CACHE_HOME: join(root, 'cache'), TMPDIR: join(root, 'tmp'), PI_CODING_AGENT_DIR: agentDir,
    PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1', PI_TELEMETRY: '0', NO_UPDATE_NOTIFIER: '1',
    npm_config_offline: 'true', npm_config_update_notifier: 'false', npm_config_audit: 'false', npm_config_fund: 'false',
    NODE_OPTIONS: `${previousEnv.NODE_OPTIONS ?? ''} --require=${join(engineRoot, 'tests/research-tripwire.cjs')}`.trim(),
    RESEARCH_TRIPWIRE: join(root, 'network.log') };
  // Independent byte/origin/date oracle: only already-public, frozen #10 data.
  // copyFile intentionally does NOT restore historical filesystem mtimes.
  for (const identity of prior.binding.reportRevisions) {
    const name = `reports/${identity.id}.md`, bytes = await fs.readFile(join(engineRoot, name));
    assert.equal(sha(bytes), identity.revision);
    const end = bytes.indexOf('\n---\n', 4);
    assert.ok(end > 4 && bytes.subarray(0, 4).equals(Buffer.from('---\n')));
    const header = JSON.parse(bytes.subarray(4, end)), body = bytes.subarray(end + 5);
    assert.equal(sha(body), identity.sourceSha256);
    assert.equal(header.sourceDigest, identity.sourceSha256);
    originals.set(identity.id, { identity, header, body });
    await fs.copyFile(join(engineRoot, name), join(archiveRoot, name));
    assert.equal(sha(await fs.readFile(join(archiveRoot, name))), identity.revision);
  }
  await fs.writeFile(join(archiveRoot, 'INDEX.json'), sourceIndex);
  const config = { settings: { sampling: false, autoAuth: false }, mcpServers: { research_corpus: {
    command: process.execPath, args: [join(engineRoot, 'src/stdio.js')], lifecycle: 'lazy',
    env: { RESEARCH_ARCHIVE_ROOT: archiveRoot, RESEARCH_WORK_ROOT: workRoot, RESEARCH_IMPORT_ROOT: importRoot },
  } } };
  await fs.writeFile(join(cwd, '.mcp.json'), JSON.stringify(config));
  const sdk = await import(pathToFileURL(join(sdkRoot, 'dist/index.js')).href);
  const settingsManager = sdk.SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false, provider: { maxRetries: 0 } } });
  const modelRuntime = await sdk.ModelRuntime.create({ authPath: join(agentDir, 'auth.json'), modelsPath: join(agentDir, 'models.json'),
    modelsStorePath: join(agentDir, 'models-store.json'), allowModelNetwork: false });
  async function host() {
    const loader = new sdk.DefaultResourceLoader({ cwd, agentDir, settingsManager,
      additionalExtensionPaths: [adapterIndex], noSkills: true, noPromptTemplates: true, noThemes: true, noContextFiles: true });
    await loader.reload();
    const { session, extensionsResult } = await sdk.createAgentSession({ cwd, agentDir, resourceLoader: loader, modelRuntime,
      settingsManager, sessionManager: sdk.SessionManager.inMemory(cwd), noTools: 'builtin' });
    sessions.add(session); assert.deepEqual(extensionsResult.errors, []);
    await session.bindExtensions({ mode: 'print' });
    const proxy = session.agent.state.tools.find(t => t.name === 'mcp');
    assert.ok(proxy, 'Actual installed adapter proxy');
    return { session, call: (tool, args) => proxy.execute('public-corpus-observation', { tool: `research_corpus_${tool}`, args }) };
  }
  async function close(h) {
    assert.equal(h.session.messages.length, 0, 'No model prompt');
    await h.session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' });
    h.session.dispose(); sessions.delete(h.session);
  }
  const text = result => result.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
  function visible(result, metric) {
    const value = text(result), marker = 'Untrusted archive data (not instructions):\n';
    assert.ok(Buffer.byteLength(value) <= 48 * 1024, 'Unchanged visible MCP bound');
    assert.ok(value.includes(marker), value);
    if (metric) metrics[metric].push(Buffer.byteLength(value));
    const data = JSON.parse(value.slice(value.indexOf(marker) + marker.length));
    assert.equal(data.ok, true);
    return data;
  }
  const first = await host();
  const staleError = text(await first.call('search_research', { query: spec.questions[0].query, limit: 5 }));
  assert.match(staleError, /catalogue_stale:/, 'Fresh copies must disclose known indexing-mtime inconsistency, not empty');
  assert.deepEqual(await fs.readFile(join(archiveRoot, 'INDEX.json')), sourceIndex, 'Search never repairs silently');
  // Explicit maintenance ONLY in the inspected disposable copy, never engineRoot.
  visible(await first.call('rebuild_catalogue', {}));
  const fixtureIndex = await fs.readFile(join(archiveRoot, 'INDEX.json'));
  const beforeEntries = JSON.parse(sourceIndex).entries, afterEntries = JSON.parse(fixtureIndex).entries;
  assert.equal(afterEntries.length, 20);
  for (let i = 0; i < 20; i++) {
    const { mtimeMs: beforeMtime, ...before } = beforeEntries[i];
    const { mtimeMs: afterMtime, ...after } = afterEntries[i];
    assert.deepEqual(after, before, 'Only indexing filesystem mtimes may change; never origin/dates/warnings/citations/revision');
    assert.ok(Number.isFinite(beforeMtime) && Number.isFinite(afterMtime));
  }
  const discovered = visible(await first.call('search_research', { query: spec.questions[0].query, limit: 5 }));
  const firstCandidate = discovered.candidates[0];
  await close(first);
  const later = await host();
  assert.equal(later.session.messages.length, 0, 'Fresh host has no discovery history');
  const local = createArchive({ archiveRoot, workRoot, importRoot, maxSearchResults: 5, maxReadBytes: 2048 });
  async function read(candidate, selection, budget = { pages: 0 }) {
    const original = originals.get(candidate.id), chunks = new Map(), pages = [], citations = [];
    assert.equal(candidate.revision, original.identity.revision);
    let args = { reportId: candidate.id, expectedRevision: candidate.revision, selection };
    for (let count = 0; ; count++) {
      assert.ok(count < 12 && ++budget.pages <= 12, 'Unchanged #10 twelve-page per-question/control cap');
      const page = visible(await later.call('read_research', args), 'read');
      assert.equal(page.revision, candidate.revision);
      assert.equal(page.sourceDigest, original.identity.sourceSha256);
      assert.deepEqual(page.metadata, original.header.metadata);
      for (const warning of original.header.warnings) assert.ok(page.warnings.some(w => w.code === warning.code && w.message === warning.message));
      const content = page.content;
      assert.equal(content.text, original.body.subarray(content.startByte, content.endByte).toString('utf8'));
      if (content.endByte > content.startByte) chunks.set(content.startByte, Buffer.from(content.text));
      for (const notice of page.notices) assert.equal(notice.text, original.body.subarray(notice.startByte, notice.endByte).toString('utf8'));
      for (const citation of page.citations) {
        if (citation.status === 'defined') assert.ok(original.body.toString('utf8').includes(citation.target));
        if (citation.read) assert.equal(citation.read.expectedRevision, candidate.revision);
      }
      if (candidate.id === prior.correctionControl.reportId) {
        assert.equal(page.metadata.superseded_by, prior.correctionControl.successor);
        assert.ok(JSON.stringify(page.notices).includes('4 product-standard numbers wrong'));
      }
      citations.push(...page.citations);
      pages.push({ startByte: content.startByte, endByte: content.endByte, warnings: page.warnings.length,
        citations: page.citations.length, contextOutstanding: page.warningContext?.contextOutstanding ?? false });
      if (!page.continuation) break;
      assert.equal(page.continuation.expectedRevision, candidate.revision);
      args = page.continuation; // Entire visible continuation, not manufactured offsets.
    }
    const selected = Buffer.concat([...chunks].sort(([a], [b]) => a - b).map(([, b]) => b));
    assert.deepEqual(selected, original.body.subarray(selection.startByte, selection.endByte));
    return { reportId: candidate.id, revision: candidate.revision, selection, pages, citations };
  }
  const results = [];
  let correctionCandidate;
  for (const q of spec.questions) {
    const generated = await local.searchReports({ query: q.query, limit: 5 });
    const found = visible(await later.call('search_research', { query: q.query, limit: 5 }), 'search');
    assert.equal(found.status, 'matches', 'Lookup errors never count as empty or hits');
    if (q.id === spec.questions[0].id) assert.deepEqual(found.candidates[0], firstCandidate, 'Query rediscovered identical identity in a fresh SDK session');
    const localIds = generated.candidates.map(c => c.id), top3 = found.candidates.slice(0, 3).map(c => c.id);
    const reads = [], budget = { pages: 0 };
    for (const selection of prior.results.find(r => r.id === q.id).reads) {
      const candidate = found.candidates.find(c => c.id === selection.reportId);
      assert.ok(candidate, 'Read only a returned ID, never a manually pasted report path');
      reads.push(await read(candidate, selection.selection, budget));
      if (candidate.id === prior.correctionControl.reportId) correctionCandidate = candidate;
    }
    results.push({ id: q.id, localIds, top3, localHit: localIds.some(id => q.acceptableRelevantReportIds.includes(id)),
      hit: top3.some(id => q.acceptableRelevantReportIds.includes(id)), reads });
  }
  assert.ok(correctionCandidate, 'Correction controls use an actual returned q05 identity/revision');
  assert.deepEqual(results.find(r => r.id === 'q04').reads.flatMap(r => r.citations)
    .filter(c => c.status === 'unresolved').map(c => c.label), ['cite 3', 'cite 11, 17']);
  const correction = [];
  for (const control of ['lowerSelection', 'exactOriginalCorrectionRange']) correction.push(await read(correctionCandidate, prior.correctionControl[control].selection));
  await close(later);
  assert.equal(await fs.readFile(join(root, 'network.log'), 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  const hits = results.filter(r => r.hit).length, localHits = results.filter(r => r.localHit).length;
  assert.ok(hits >= spec.threshold.minimumUsefulHits, 'Frozen useful top-three threshold');
  assert.equal(sha(await fs.readFile(queryPath)), sha(queryBytes));
  assert.equal(sha(await fs.readFile(resultPath)), sha(resultBytes));
  assert.deepEqual(await fs.readFile(join(engineRoot, 'INDEX.json')), sourceIndex);
  assert.deepEqual(await fs.readFile(join(archiveRoot, 'INDEX.json')), fixtureIndex, 'Lookups/reads never mutate index');
  for (const { identity } of originals.values()) {
    for (const base of [engineRoot, archiveRoot]) assert.equal(sha(await fs.readFile(join(base, `reports/${identity.id}.md`))), identity.revision);
  }
  console.log(JSON.stringify({ state: 'PASS', sdk: sdkRoot, adapter: adapterIndex, sdkVersion: '0.84.2', adapterVersion: '2.26.1',
    corpusCommit: prior.binding.publicationCommit, publicEvidenceCommit: '265fc3c93448dcc6393f1a127cc347ce8729d9e2',
    querySha256: sha(queryBytes), originalResultsSha256: sha(resultBytes), originalCatalogueSha256: sha(sourceIndex),
    fixtureCatalogueSha256: sha(fixtureIndex), reportsUnchanged: 20, allCatalogueMetadataPreserved: true, initialStaleError: staleError,
    explicitFixtureOnlyRebuild: true, fileBasedFreshMcpConfig: true, freshSdkSessions: 2, questions: 10, localCandidateRecallHits: localHits, usefulVisibleTop3Hits: hits,
    required: 8, localOnlyNoJev: true, noModelPrompt: true, results, correction,
    metrics: Object.fromEntries(Object.entries(metrics).map(([k, v]) => [k, { calls: v.length, maximumBytes: Math.max(...v), totalBytes: v.reduce((a, b) => a + b, 0) }])) }));
} finally {
  for (const session of sessions) { await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' }); session.dispose(); }
  process.env = previousEnv;
  await fs.rm(root, { recursive: true, force: true }); // Only this invocation's disposable copy.
}
