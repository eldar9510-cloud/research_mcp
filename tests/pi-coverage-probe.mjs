// Actual installed Pi loader + MCP adapter, fresh sessions, fixture-only. NO live model/provider.
// Scripted main-Pi decisions and simulated TUI consent are NOT live LLM/human proof.
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { metadata } from './support.js';
import cp from 'node:child_process';
import http from 'node:http';
import https from 'node:https';
import { syncBuiltinESMExports } from 'node:module';

if (!process.env.PI_SDK_ROOT || !process.env.PI_ADAPTER_INDEX) throw Error('Set PI_SDK_ROOT and PI_ADAPTER_INDEX');
const root = await fs.mkdtemp(join(tmpdir(), 'research-pi-coverage-'));
const cwd = join(root, 'project'), agentDir = join(root, 'agent');
const archiveRoot = join(root, 'archive'), workRoot = join(root, 'work'), importRoot = join(root, 'imports');
const sessions = new Set();
let maxVisibleBytes = 0;
let restoreTripwires = () => {};
const forbiddenCalls = [];
function payload(result) {
  const text = result.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
  maxVisibleBytes = Math.max(maxVisibleBytes, Buffer.byteLength(text));
  assert.ok(Buffer.byteLength(text) <= 48 * 1024, 'visible, not hidden structured data');
  return JSON.parse(text.slice(text.lastIndexOf('\n') + 1));
}
try {
  for (const dir of [cwd, agentDir, archiveRoot, workRoot, importRoot]) await fs.mkdir(dir);
  Object.assign(process.env, { RESEARCH_ARCHIVE_ROOT: archiveRoot, RESEARCH_WORK_ROOT: workRoot,
    RESEARCH_IMPORT_ROOT: importRoot, RESEARCH_READ_BYTES: '128', PI_CODING_AGENT_DIR: agentDir, PI_OFFLINE: '1', PI_TELEMETRY: '0' });
  const config = { settings: { sampling: false, autoAuth: false }, mcpServers: { research_import: {
    command: process.execPath, args: [resolve('src/stdio.js')], lifecycle: 'lazy', approveTools: ['accept_research_draft'],
    env: { RESEARCH_ARCHIVE_ROOT: archiveRoot, RESEARCH_WORK_ROOT: workRoot, RESEARCH_IMPORT_ROOT: importRoot, RESEARCH_READ_BYTES: '128' },
  } } };
  await fs.writeFile(join(cwd, '.mcp.json'), JSON.stringify(config));
  const adapterPath = join(cwd, 'isolated-adapter.ts');
  await fs.writeFile(adapterPath, `import {createMcpAdapter} from ${JSON.stringify(process.env.PI_ADAPTER_INDEX)};\nexport default createMcpAdapter(${JSON.stringify({ config })});\n`);
  const sdk = await import(pathToFileURL(join(process.env.PI_SDK_ROOT, 'dist/index.js')).href);
  const { DefaultResourceLoader, createAgentSession, SessionManager, SettingsManager, ModelRuntime } = sdk;
  const settingsManager = SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false } });
  const modelRuntime = await ModelRuntime.create({ authPath: join(agentDir, 'auth.json'), modelsPath: join(agentDir, 'models.json'), modelsStorePath: join(agentDir, 'models-store.json') });
  const childTripwire = join(root, 'child-tripwire.log'), callLog = join(root, 'accept-calls.log');
  process.env.NODE_OPTIONS = `--require=${resolve('tests/tripwire.cjs')}`;
  process.env.RESEARCH_TRIPWIRE = childTripwire;
  process.env.RESEARCH_CALL_LOG = callLog;
  const reviews = [];
  async function host(mode = 'print', permission = false) {
    const loader = new DefaultResourceLoader({ cwd, agentDir, settingsManager,
      additionalExtensionPaths: [adapterPath, resolve('.pi/extensions/research-acceptance.ts'), resolve('.pi/extensions/research-coverage.ts')] });
    await loader.reload();
    const { session, extensionsResult } = await createAgentSession({ cwd, agentDir, resourceLoader: loader, modelRuntime,
      sessionManager: SessionManager.inMemory(cwd), settingsManager, noTools: 'builtin' });
    sessions.add(session);
    assert.deepEqual(extensionsResult.errors, []);
    await session.bindExtensions({ mode, ...(mode === 'tui' ? { uiContext: {
      confirm: async (title, text) => { reviews.push({ title, text }); return permission; },
      select: async () => 'Deny', notify: () => {}, setStatus: () => {},
    } } : {}) });
    assert.match(session.agent.state.systemPrompt, /Before a substantial investigation, comparison/);
    assert.match(session.agent.state.systemPrompt, /greetings, trivial facts, routine code edits/);
    const proxy = session.agent.state.tools.find(t => t.name === 'mcp');
    const coverage = session.agent.state.tools.find(t => t.name === 'research_coverage');
    assert.ok(proxy && coverage, 'actual installed loader registered both tools');
    return { session, proxy, coverage };
  }
  async function close(session, scriptedLifecycle = false) {
    if (!scriptedLifecycle) assert.equal(session.messages.length, 0, 'no model prompt was issued');
    await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' });
    session.dispose(); sessions.delete(session);
  }
  const acceptArgs = r => ({ proposalId: r.proposalId, expectedRevision: r.expectedRevision,
    expectedBaseRevision: r.expectedBaseRevision, expectedCatalogueRevision: r.expectedCatalogueRevision,
    acceptedAt: r.acceptedAt, expectedReviewDigest: r.reviewDigest });
  const saved = [];
  // Session A saves approved synthetic local reports through the real adapter/unchanged host gate.
  const first = await host('tui', true);
  for (const id of ['orchard-water', 'orchard-alternative']) {
    const body = `# ${id}\nCompare two short drip cycles for sandy orchard soil [soil].\n` +
      'Prior scope: small orchard only.\n'.repeat(4) + '\n[soil]: https://example.org/soil\n' +
      (id === 'orchard-alternative' ? '\n## Correction\nThe old estimate is wrong [soil]; use orchard-water instead.\n' : '');
    const proposal = payload(await first.proxy.execute('fixture-import', { tool: 'research_import_save_research_draft', args: {
      text: body, metadata: { ...metadata(id), researched_at: '2020-02-03', last_improved_at: '2021-04-05', title: 'Orchard comparison \u202e metadata', warnings: ['Historical imported evidence; not freshly verified.'] },
    } })).proposal;
    const review = payload(await first.proxy.execute('fixture-review', { tool: 'research_import_review_research_draft', args: { proposalId: proposal.proposalId } })).review;
    const accepted = payload(await first.proxy.execute('fixture-accept', { tool: 'research_import_accept_research_draft', args: acceptArgs(review) }));
    assert.equal(accepted.status, 'accepted_local_unpublished'); saved.push(accepted);
  }
  await close(first.session);
  const acceptedCallsBefore = await fs.readFile(callLog, 'utf8');
  assert.equal(acceptedCallsBefore.split('\n').filter(Boolean).length, 2);
  const catalogueBefore = await fs.readFile(join(archiveRoot, 'INDEX.json'));
  const reportBefore = await Promise.all(saved.map(a => fs.readFile(join(archiveRoot, 'reports', `${a.reportId}.md`))));
  // Instrument the actual host process too, not only a constant in the workflow's receipt.
  // The archive workflow needs no subprocess or network capability. Fixture import is finished.
  const originals = [], fetchBefore = globalThis.fetch;
  const reject = name => { forbiddenCalls.push(name); throw Error('Read-only coverage attempted a sensitive subprocess/network operation'); };
  for (const [mod, names, prefix] of [[cp, ['spawn', 'exec', 'execFile', 'fork', 'spawnSync', 'execSync', 'execFileSync'], 'process'],
    [http, ['request', 'get'], 'http'], [https, ['request', 'get'], 'https']]) {
    for (const name of names) { originals.push([mod, name, mod[name]]); mod[name] = () => reject(`${prefix}.${name}`); }
  }
  globalThis.fetch = () => reject('fetch'); syncBuiltinESMExports();
  restoreTripwires = () => { for (const [mod, name, value] of originals) mod[name] = value; globalThis.fetch = fetchBefore; syncBuiltinESMExports(); };
  // New read-only session must rediscover by a differently worded question, not a saved path/ID.
  const later = await host();
  const invoke = input => later.coverage.execute('controlled-main-Pi-decision', input);
  const lookupInput = { action: 'lookup', purpose: 'research_recommendation', question: 'Recommend a watering cadence for sandy orchard soil under the old scope.', query: 'sandy orchard watering cycles' };
  const search = payload(await invoke(lookupInput));
  assert.equal(search.status, 'matches'); assert.equal(search.candidates.length, 2);
  const c = search.candidates[0];
  assert.equal(c.revision, saved.find(a => a.reportId === c.id).revision);
  const fallback = payload(await invoke({ action: 'rerank', ids: search.candidates.map(c => c.id), reason: 'Two local descriptions appear ambiguous.' }));
  assert.equal(fallback.mcp, undefined, 'headless permission missing: honest local fallback, not a provider switch');
  assert.equal(fallback.rerank.method, 'local');
  let page = payload(await invoke({ action: 'read', read: { reportId: c.id, expectedRevision: c.revision } }));
  let readPages = 0, body = '';
  const citations = [];
  while (true) {
    readPages++; body += page.content.text; citations.push(...page.citations);
    assert.equal(page.revision, c.revision);
    assert.equal(page.metadata.researched_at, '2020-02-03');
    assert.equal(page.metadata.last_improved_at, '2021-04-05');
    assert.deepEqual(page.metadata.warnings, ['Historical imported evidence; not freshly verified.']);
    if (!page.continuation) break;
    assert.equal(page.continuation.pageBytes, 128);
    assert.equal(page.continuation.expectedRevision, c.revision);
    page = payload(await invoke({ action: 'read', read: page.continuation }));
  }
  assert.ok(readPages > 1); assert.match(body, /two short drip cycles/);
  assert.ok(citations.some(c => c.target === 'https://example.org/soil'));
  const covered = payload(await invoke({ action: 'decide', outcome: 'covered', usefulIds: [c.id], gaps: [],
    reason: 'Controlled applicability decision: sufficient for the original dated sandy-soil comparison, not a current verification.' }));
  assert.equal(covered.outcome, 'covered'); assert.equal(covered.rerank.method, 'local');
  assert.deepEqual(Object.values(covered.dispatched), [false, false, false, false]);
  await close(later.session);
  // The actual TUI confirmation path prepares a normal MCP request; Jev is deliberately unconfigured.
  // Its normal adapter error is passively observed, never retried or replaced by another service.
  const unavailable = await host('tui', true);
  const ambiguous = payload(await unavailable.coverage.execute('lookup', lookupInput));
  const plan = payload(await unavailable.coverage.execute('rerank', { action: 'rerank', ids: ambiguous.candidates.map(c => c.id), reason: 'Ambiguous permitted synthetic catalogue metadata.' }));
  assert.equal(plan.mcp.tool, 'jev_jev_rerank');
  const review = reviews.find(r => /TypeSafe/.test(r.title));
  assert.ok(review); assert.ok(review.text.includes('\\u202e'));
  assert.ok(!review.text.includes('\u202e'));
  // Render the exact captured prompt with the installed selector, not a mocked extension.
  const { initTheme } = await import(pathToFileURL(join(process.env.PI_SDK_ROOT, 'dist/modes/interactive/theme/theme.js')).href);
  const { ExtensionSelectorComponent } = await import(pathToFileURL(join(process.env.PI_SDK_ROOT, 'dist/modes/interactive/components/extension-selector.js')).href);
  initTheme('dark');
  const rendered = new ExtensionSelectorComponent(`${review.title}\n${review.text}`, ['Yes', 'No'], () => {}, () => {}).render(100).join('\n');
  assert.ok(!rendered.includes('\u202e'));
  const unavailableResult = await unavailable.proxy.execute('normal-optional-jev', plan.mcp);
  await unavailable.session.extensionRunner.emitToolResult({ type: 'tool_result', toolName: 'mcp', toolCallId: 'normal-optional-jev', input: plan.mcp,
    content: unavailableResult.content, details: unavailableResult.details, isError: false });
  const noMatch = payload(await unavailable.coverage.execute('decide', { action: 'decide', outcome: 'no_useful_match', usefulIds: [], gaps: [], reason: 'Controlled negative applicability judgment; no new research was authorized or dispatched.' }));
  assert.equal(noMatch.rerank.method, 'local'); assert.match(noMatch.rerank.reason, /failed, unavailable or unsupported/);
  await close(unavailable.session);
  // Drive the installed agent/session queue and event bridge with a scripted stream boundary.
  // No provider, authentication or model is used. Unlike hand-emitting extension events,
  // actual assistant/tool events and queued user delivery run through the SDK's agent loop.
  const lifecycleModes = ['normal', 'steer', 'followUp'];
  for (const mode of lifecycleModes) {
    const h = await host('tui', true), { agent } = h.session;
    agent.getApiKey = async () => undefined;
    const invoke = input => h.coverage.execute('scripted-lifecycle', input);
    const assess = { action: 'decide', outcome: 'no_useful_match', usefulIds: [], gaps: [], reason: 'Scripted applicability only.' };
    const questionA = `${mode}: original orchard request`, questionB = `${mode}: unrelated quantum request`;
    let stage = 0, oldCursor, oldWarning, oldCandidate, oldEvent, scriptError;
    const permissionCount = () => reviews.filter(r => /TypeSafe/.test(r.title)).length;
    const beforePermissions = permissionCount();
    const scriptedStream = async () => {
      let content = [{ type: 'text', text: 'Scripted assistant, not model output.' }];
      if (stage === 0) {
        const found = payload(await invoke({ ...lookupInput, question: questionA }));
        oldCandidate = found.candidates[0];
        const page = payload(await invoke({ action: 'read', read: { reportId: oldCandidate.id, expectedRevision: oldCandidate.revision } }));
        oldCursor = page.continuation;
        assert.ok(oldCursor?.offset > 0);
        oldWarning = found.candidates.find(c => c.warningContext)?.warningContext.read;
        assert.ok(oldWarning);
        const warning = payload(await invoke({ action: 'read', read: oldWarning }));
        assert.equal(warning.pageType, 'warning_context');
        assert.match(warning.notices[0].text, /old estimate is wrong/);
        assert.equal(warning.citations[0].target, 'https://example.org/soil');
        assert.equal(warning.warningContext.contextOutstanding, true);
        const plan = payload(await invoke({ action: 'rerank', ids: found.candidates.map(c => c.id), reason: 'Scripted ambiguous relevance.' }));
        assert.equal(permissionCount(), beforePermissions + 1);
        const ranked = [...plan.mcp.args.candidates].reverse().map((c, i) => ({ ...c, rank: i + 1, relevance: 0.9 - i * 0.1 }));
        oldEvent = { type: 'tool_result', toolName: 'mcp', toolCallId: 'scripted-jev', input: plan.mcp, isError: false,
          content: [], details: { mode: 'call', server: 'jev', tool: 'jev_rerank', mcpResult: { content: [{ type: 'text', text: JSON.stringify({
            tool: 'jev_rerank', provider: 'fixture', model: 'fixture-only', query: plan.mcp.args.query,
            summary: { candidates: ranked.length, returned: ranked.length }, ranked, usage: { input_tokens: 1, output_tokens: 1 },
          }) }] } } };
        await h.session.extensionRunner.emitToolResult(oldEvent);
        // A real toolResult lifecycle must not reset the assessment between assistant turns.
        content = [{ type: 'toolCall', id: 'scripted-assessment', name: 'research_coverage', arguments: assess }];
      } else if (stage === 1) {
        const toolResult = h.session.messages.find(m => m.role === 'toolResult' && m.toolCallId === 'scripted-assessment');
        assert.ok(toolResult && !toolResult.isError);
        const result = payload(toolResult);
        assert.equal(result.question, questionA);
        assert.equal(result.rerank.method, 'existing_jev');
        if (mode !== 'normal') await h.session[mode](questionB);
        assert.equal(payload(await invoke(assess)).question, questionA, 'queueing alone must not reset current tools');
      } else if (stage === 2) {
        // This runs only AFTER the actual new user message has been delivered.
        await assert.rejects(invoke(assess), /invalid_input/, `${mode}: old assessment must be gone`);
        await assert.rejects(invoke({ action: 'read', read: oldCursor }), /invalid_input/);
        await assert.rejects(invoke({ action: 'read', read: oldWarning }), /invalid_input/);
        const found = payload(await invoke({ ...lookupInput, question: questionB, query: 'quantum entanglement' }));
        assert.equal(found.status, 'empty');
        await assert.rejects(invoke({ action: 'read', read: oldWarning }), /invalid_input/, 'empty new shortlist cannot inherit issued warning pointers');
        await assert.rejects(invoke({ action: 'read', read: { reportId: oldCandidate.id, expectedRevision: oldCandidate.revision } }), /invalid_input/);
        await h.session.extensionRunner.emitToolResult(oldEvent);
        const result = payload(await invoke(assess));
        assert.equal(result.question, questionB);
        assert.equal(result.rerank.method, 'local', 'old pending/approved result must not enter the new request');
        assert.deepEqual(result.evidence, []);
      } else if (stage === 3) {
        await assert.rejects(invoke(assess), /invalid_input/, 'ordinary subsequent request also resets');
        await assert.rejects(invoke({ action: 'read', read: oldWarning }), /invalid_input/);
        const found = payload(await invoke({ ...lookupInput, question: 'Third request with the same shortlist' }));
        await assert.rejects(invoke({ action: 'read', read: oldCursor }), /invalid_input/, 'rediscovery does not reissue old continuations');
        await h.session.extensionRunner.emitToolResult(oldEvent);
        assert.equal(payload(await invoke(assess)).rerank.method, 'local');
        const plan = payload(await invoke({ action: 'rerank', ids: found.candidates.map(c => c.id), reason: 'Fresh consent for this request.' }));
        assert.ok(plan.mcp);
        assert.equal(permissionCount(), beforePermissions + 2, 'identical payload requires fresh request permission');
      } else assert.fail('unexpected scripted model turn');
      stage++;
      const message = { role: 'assistant', content, api: 'offline-fixture', provider: 'fixture', model: 'no-model',
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
        stopReason: content[0].type === 'toolCall' ? 'toolUse' : 'stop', timestamp: Date.now() };
      return { async *[Symbol.asyncIterator]() { yield { type: 'done', reason: message.stopReason, message }; }, result: async () => message };
    };
    // The agent converts stream exceptions into error messages; retain assertion failures for the probe.
    agent.streamFunction = async () => {
      try { return await scriptedStream(); } catch (error) { scriptError = error; throw error; }
    };
    const ordinaryRequest = async text => {
      // Mirror normal prompt preflight without model/auth preflight or a provider call.
      await h.session.extensionRunner.emitBeforeAgentStart(text, undefined, agent.state.systemPrompt);
      await agent.prompt({ role: 'user', content: [{ type: 'text', text }], timestamp: Date.now() });
    };
    await ordinaryRequest(questionA);
    if (mode === 'normal') await ordinaryRequest(questionB);
    assert.ifError(scriptError);
    assert.equal(stage, 3, `${mode}: queued request was actually delivered`);
    await ordinaryRequest('Third ordinary user request');
    assert.ifError(scriptError);
    assert.equal(stage, 4);
    assert.deepEqual(h.session.messages.filter(m => m.role === 'user').map(m => m.content[0].text),
      [questionA, questionB, 'Third ordinary user request']);
    await close(h.session, true);
  }
  assert.deepEqual(forbiddenCalls, [], 'no hidden model/source-fetch/Git subprocess dispatch');
  assert.equal(await fs.readFile(callLog, 'utf8'), acceptedCallsBefore, 'no extra acceptance dispatched');
  assert.deepEqual(await fs.readFile(join(archiveRoot, 'INDEX.json')), catalogueBefore);
  for (const [i, a] of saved.entries()) assert.deepEqual(await fs.readFile(join(archiveRoot, 'reports', `${a.reportId}.md`)), reportBefore[i]);
  assert.equal(await fs.readFile(childTripwire, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  // A fresh host resets all bounds and permissions. Non-research triggers skip even with a broken catalogue.
  await fs.writeFile(join(archiveRoot, 'INDEX.json'), '{broken');
  const failed = await host();
  const skipped = payload(await failed.coverage.execute('negative-trigger', { action: 'lookup', purpose: 'routine_coding' }));
  assert.equal(skipped.outcome, 'skipped');
  const error = payload(await failed.coverage.execute('bad-catalogue', lookupInput));
  assert.equal(error.outcome, 'lookup_error'); assert.equal(error.error.code, 'catalogue_invalid');
  const stopped = payload(await failed.coverage.execute('blocked-decision', { action: 'decide', outcome: 'no_useful_match', usefulIds: [], gaps: [], reason: 'Cannot decide on failed catalogue.' }));
  assert.equal(stopped.outcome, 'lookup_error');
  await close(failed.session);
  console.log(JSON.stringify({ actualPiLoader: true, installedAdapter: true, crossSessionReuse: true, visibleRevision: c.revision,
    controlledCoveredDecision: true, readPages, maxVisibleBytes, localFallbackWithoutJev: true, actualNormalMcpUnavailableFallback: true,
    actualSelectorRendered: true, scriptedDecisionsNotLiveLlmProof: true, lifecycleModes, noLiveModelCall: true, forbiddenHostDispatches: forbiddenCalls.length,
    extraAcceptanceDispatches: 0, archiveUnchangedByCoverage: true, noSourceRefreshOrResearchOrPublication: true }));
} finally {
  restoreTripwires();
  for (const session of sessions) {
    await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' }); session.dispose();
  }
  await fs.rm(root, { recursive: true, force: true });
}
