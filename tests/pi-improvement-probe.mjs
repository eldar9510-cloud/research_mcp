// Actual installed SDK/adapter -> ordinary production MCP -> controlled SDK investigator.
// Synthetic intent and TUI keys; ONLY disposable LOCAL bare Git, never live semantics/publication.
import './research-tripwire.cjs';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { publicationFixture } from './publication-support.js';

const sdkRoot = process.env.PI_SDK_ROOT, adapterIndex = process.env.PI_ADAPTER_INDEX;
if (!sdkRoot || !adapterIndex) throw Error('Set PI_SDK_ROOT and PI_ADAPTER_INDEX');
const cleanup = [], sessions = new Set();
const f = await publicationFixture({ after: fn => cleanup.push(fn) }, {
  body: '\ufeff# Findings\r\nPrior finding [S1].\r\n\r\n## Alternatives\r\nRetain the original alternative π.\r\n[S1]: https://example.org/old\r\n',
});
const accepted = r => ({ proposalId: r.proposalId, expectedRevision: r.expectedRevision, expectedBaseRevision: r.expectedBaseRevision,
  expectedCatalogueRevision: r.expectedCatalogueRevision, acceptedAt: r.acceptedAt, expectedReviewDigest: r.reviewDigest });
const base = await f.archive.acceptProposal(accepted((await f.archive.reviewProposal({ proposalId: f.draft.proposalId })).review));
await f.git(['add', '--', 'reports', 'INDEX.json']); await f.git(['-c', 'commit.gpgSign=false', 'commit', '-m', 'Synthetic accepted base']);
await f.git(['push', '--', 'origin', 'HEAD:refs/heads/main']);
const oldHead = await f.git(['rev-parse', 'HEAD']);
const path = join(f.archiveRoot, 'reports', base.reportId + '.md');
const before = await fs.readFile(path), beforeIndex = await fs.readFile(join(f.archiveRoot, 'INDEX.json'));
const prior = await f.archive.readAccepted({ reportId: base.reportId });
const cwd = join(f.root, 'project'), agentDir = join(f.root, 'agent'), log = join(f.root, 'transport.log'), network = join(f.root, 'network.log');
const previousEnv = process.env;
let maxVisible = 0, dialogs = 0, publicationReviews = 0, approve = false;
try {
  await fs.mkdir(cwd); await fs.mkdir(agentDir);
  process.env = { PATH: previousEnv.PATH, HOME: f.root, PI_CODING_AGENT_DIR: agentDir, PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1', PI_TELEMETRY: '0',
    npm_config_offline: 'true', npm_config_update_notifier: 'false', npm_config_audit: 'false', npm_config_fund: 'false',
    RESEARCH_ARCHIVE_ROOT: f.archiveRoot, RESEARCH_WORK_ROOT: f.workRoot, RESEARCH_IMPORT_ROOT: f.importRoot,
    BRAVE_SEARCH_API_KEY: 'synthetic-host-only-token', RESEARCH_HOST_TRANSPORT_LOG: log, RESEARCH_TRIPWIRE: network };
  const config = { settings: { autoAuth: false, sampling: false }, mcpServers: { improvement_fixture: {
    command: process.execPath, args: [resolve('src/stdio.js')], lifecycle: 'lazy', approveTools: false, directTools: ['start_research'],
    env: { RESEARCH_ARCHIVE_ROOT: f.archiveRoot, RESEARCH_WORK_ROOT: f.workRoot, RESEARCH_IMPORT_ROOT: f.importRoot },
  } } };
  await fs.writeFile(join(cwd, '.mcp.json'), JSON.stringify(config));
  const adapterPath = join(cwd, 'adapter.ts');
  await fs.writeFile(adapterPath, `import {createMcpAdapter} from ${JSON.stringify(adapterIndex)};\nexport default createMcpAdapter(${JSON.stringify({ config })});\n`);
  const sdk = await import(pathToFileURL(join(sdkRoot, 'dist/index.js')).href);
  const settingsManager = sdk.SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false, provider: { maxRetries: 0 } } });
  const modelRuntime = await sdk.ModelRuntime.create({ authPath: join(agentDir, 'auth.json'), modelsPath: join(agentDir, 'models.json'),
    modelsStorePath: join(agentDir, 'models-store.json'), allowModelNetwork: false });
  process.env.NODE_OPTIONS = `--require=${resolve('tests/research-tripwire.cjs')} --import=${resolve('tests/fixtures/research-host-preload.mjs')}`;
  const value = result => {
    const text = result.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
    maxVisible = Math.max(maxVisible, Buffer.byteLength(text)); assert.ok(Buffer.byteLength(text) <= 48 * 1024);
    return JSON.parse(text.slice(text.lastIndexOf('\n') + 1));
  };
  async function host() {
    const resourceLoader = new sdk.DefaultResourceLoader({ cwd, agentDir, settingsManager,
      additionalExtensionPaths: [adapterPath, resolve('.pi/extensions/research-acceptance.ts')] });
    await resourceLoader.reload();
    const { session, extensionsResult } = await sdk.createAgentSession({ cwd, agentDir, resourceLoader, modelRuntime, settingsManager,
      sessionManager: sdk.SessionManager.inMemory(cwd), noTools: 'builtin' });
    sessions.add(session); assert.deepEqual(extensionsResult.errors, []);
    await session.bindExtensions({ mode: 'tui', uiContext: {
      notify() {}, setStatus() {}, select() { throw Error('No generic adapter fallback'); },
      confirm: async () => { dialogs++; return false; },
      custom: async factory => {
        publicationReviews++;
        let decision, all = '', last;
        const view = await factory({ terminal: { rows: 24 }, requestRender() {} }, {}, {}, result => { decision = result; });
        for (let i = 0; i < 3000; i++) {
          const lines = view.render(110); assert.ok(lines.length <= 22);
          if (lines[0] === last) break;
          last = lines[0]; all += lines.join('\n') + '\n'; view.handleInput('\x1b[6~'); assert.ok(i < 2999);
        }
        for (const field of ['ONE APPROVAL', 'COMPLETE CHANGE DIFF', 'BEFORE', 'AFTER', 'expectedBaseRevision', 'oldSourceChecks',
          'researched_at', 'last_improved_at', 'origin', 'related_reports', 'unchecked', 'outgoingCommits']) assert.ok(all.includes(field), field);
        view.handleInput(approve ? '\x19' : '\x1b'); return decision;
      },
    } });
    const tool = name => session.agent.state.tools.find(t => t.name === name);
    return { session, tool };
  }
  const call = (h, tool, args) => h.tool('mcp').execute('ordinary-MCP', { server: 'improvement_fixture', tool: `improvement_fixture_${tool}`, args });
  const request = { mode: 'improve', question: prior.metadata.question, scope: prior.metadata.scope,
    references: [{ reportId: base.reportId, expectedRevision: base.revision, selection: { startByte: 0, endByte: 39 } }],
    improvement: { base: { reportId: base.reportId, expectedRevision: base.revision }, disposition: 'same_report',
      gaps: ['Add missing comparison using new evidence only.'], oldSourceChecks: [] } };
  const prepare = (h, req = request, source = 'CURRENT_REQUEST') => h.tool('research_request').execute('entrusted-main-Pi-choice', {
    server: 'improvement_fixture', request: req, source,
    rationale: 'The whole delivered user request explicitly commissions exactly this scoped improvement, selected qualified base evidence, no old-source checks and fixed finite limits.',
  });
  const deliver = async (h, text, action = async () => []) => {
    let error;
    h.session.agent.getApiKey = async () => undefined;
    h.session.agent.streamFunction = async () => {
      let content;
      try { content = await action(); } catch (e) { error = e; throw e; }
      const message = { role: 'assistant', api: 'offline-fixture', provider: 'fixture', model: 'synthetic-host', content: content.length ? content : [{ type: 'text', text: 'Synthetic intent decision; no provider.' }],
        stopReason: content.some(c => c.type === 'toolCall') ? 'toolUse' : 'stop', timestamp: Date.now(),
        usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } } };
      return { async *[Symbol.asyncIterator]() { yield { type: 'done', reason: message.stopReason, message }; }, result: async () => message };
    };
    await h.session.agent.prompt({ role: 'user', content: [{ type: 'text', text }], timestamp: Date.now() }); assert.ifError(error);
  };
  const packets = async () => (await fs.readFile(log, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e))).split('\n');
  const starts = async () => (await packets()).filter(x => x === 'start_research').length;
  const deny = r => assert.match(r.content.map(c => c.text ?? '').join('\n'), /declined approval|approval_denied/);
  const h = await host();
  deny(await call(h, 'start_research', request)); assert.equal(await starts(), 0);
  await deliver(h, 'Only read the old report. Do not improve it.');
  await assert.rejects(prepare(h, request, 'ASK_CONFIRMATION'), /research_not_prepared/);
  deny(await call(h, 'start_research', request)); assert.equal(await starts(), 0);
  for (const mutate of [r => r.improvement.gaps.push('Unapproved extra work.'), r => r.improvement.oldSourceChecks.push({ url: 'https://example.org/old', offset: 0, claim: 'Check original evidence.' }),
    r => r.improvement.disposition = 'linked_report', r => r.references[0].selection.endByte++]) {
    await deliver(h, 'Improve only the exact selected base gap; no checking old sources.'); await prepare(h);
    const changed = structuredClone(request); mutate(changed); deny(await call(h, 'start_research', changed));
  }
  await deliver(h, 'Improve this exact base only.'); await prepare(h);
  await fs.appendFile(path, '\nConcurrent newer bytes'); deny(await call(h, 'start_research', request));
  assert.equal(await starts(), 0); await fs.writeFile(path, before);
  const baseMtime = JSON.parse(beforeIndex).entries.find(e => e.id === base.reportId).mtimeMs / 1000;
  await fs.utimes(path, baseMtime, baseMtime); await f.archive.rebuildCatalogue();
  // Exact original fixture bytes and reviewed indexing mtime are restored; no dirty Git baseline.
  let stage = 0, started;
  await deliver(h, 'Explicitly improve the selected same-report gap at the exact base revision. Reuse old evidence, do not recheck it. No publication. PRIVATE HOST TEXT NOT FOR RESEARCHER.', async () => {
    if (stage++ === 0) return [{ type: 'toolCall', id: 'prepare-improvement', name: 'research_request', arguments: {
      server: 'improvement_fixture', request, source: 'CURRENT_REQUEST', rationale: 'The entire delivered current request commissions this exact same-report scoped gap with selected prior material, no old-source refresh and fixed finite bounds.' } }];
    if (stage === 2) return [{ type: 'toolCall', id: 'start-improvement', name: 'mcp', arguments: value(h.session.messages.find(m => m.role === 'toolResult' && m.toolCallId === 'prepare-improvement')).mcp }];
    started = value(h.session.messages.find(m => m.role === 'toolResult' && m.toolCallId === 'start-improvement')); return [];
  });
  assert.equal(started.status, 'running'); assert.equal(await starts(), 1); assert.equal(dialogs, 1, 'explicit improvement has no redundant research confirmation');
  let done;
  for (let i = 0; i < 1000; i++) { done = value(await call(h, 'get_research_job', { jobId: started.jobId })); if (done.status !== 'running') break; await new Promise(r => setTimeout(r, 5)); }
  assert.equal(done.status, 'completed', JSON.stringify(done));
  let diff = value(await call(h, 'read_research_diff', { proposalId: done.outputs.proposal.proposalId })), diffText = '';
  for (let i = 0; ; i++) { assert.ok(i < 100); diffText += diff.content.text; if (!diff.continuation) break; diff = value(await call(h, 'read_research_diff', diff.continuation)); }
  assert.match(diffText, /unchecked/); assert.match(diffText, /oldSourceChecks/); assert.doesNotMatch(diffText, /PRIVATE HOST TEXT/);
  await assert.rejects(prepare(h), /research_not_prepared/); deny(await call(h, 'start_research', request));
  const beforeDeniedIndex = await fs.readFile(join(f.archiveRoot, 'INDEX.json'));
  await h.session.prompt(`/research-publish ${done.outputs.proposal.proposalId} origin main`);
  const receipts = () => h.session.sessionManager.getEntries().filter(e => e.type === 'custom' && e.customType === 'research-publication');
  assert.equal(receipts().at(-1).data.status, 'denied'); assert.deepEqual(await fs.readFile(path), before);
  assert.deepEqual(await fs.readFile(join(f.archiveRoot, 'INDEX.json')), beforeDeniedIndex); assert.equal(await f.git(['rev-parse', 'HEAD']), oldHead);
  assert.equal(await f.git(['rev-parse', 'main'], f.remoteRoot), oldHead);
  approve = true; await h.session.prompt(`/research-publish ${done.outputs.proposal.proposalId} origin main`);
  const published = receipts().at(-1).data; assert.equal(published.status, 'pushed', JSON.stringify(published)); assert.equal(publicationReviews, 2);
  assert.equal(await f.git(['rev-parse', 'HEAD^']), oldHead); assert.equal(await f.git(['rev-parse', 'main'], f.remoteRoot), published.commit);
  assert.match(await f.git(['show', `${oldHead}:reports/${base.reportId}.md`]), /\[S1\]: https:\/\/example.org\/old/);
  assert.match(await f.git(['show', `${published.commit}:reports/${base.reportId}.md`], f.remoteRoot), /\[I[a-f0-9]+-S1\]: https:\/\/www.w3.org/);
  await h.session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' }); h.session.dispose(); sessions.delete(h.session);
  const fresh = await host();
  const recovered = value(await call(fresh, 'get_research_job', { jobId: done.jobId }));
  assert.equal(recovered.status, 'completed', 'actual new stdio process recovers exact imported-origin same-ID proposal lineage despite now-obsolete base');
  const obsolete = await call(fresh, 'review_research_draft', { proposalId: done.outputs.proposal.proposalId, expectedBaseRevision: base.revision });
  assert.match(obsolete.content.map(c => c.text ?? '').join('\n'), /revision_conflict:/, 'adapter renders the backend stale-review error, never obsolete application permission');
  const found = value(await call(fresh, 'search_research', { query: 'inclusive design disabled' })); assert.equal(found.candidates[0].id, base.reportId);
  const read = value(await call(fresh, 'read_research', { reportId: base.reportId, expectedRevision: found.candidates[0].revision }));
  assert.equal(read.metadata.researched_at, null); assert.deepEqual(read.metadata.origin, prior.metadata.origin); assert.match(JSON.stringify(read.notices), /unchecked/);
  assert.equal((await packets()).filter(x => x === 'accept_research_draft').length, 0, 'host single approval, not another MCP acceptance prompt');
  assert.equal(await fs.readFile(network, 'utf8').catch(e => e.code === 'ENOENT' ? '' : Promise.reject(e)), '');
  console.log(JSON.stringify({ actualSdk: true, installedAdapter: true, productionMcpImprovement: true, beforePermissionStarts: 0,
    explicitImprovementNoCoveragePrerequisite: true, requestedCheckMutationDenied: true, staleBaseDeniedBeforeTransport: true,
    completeBoundedDiff: true, publicationDenialUnchanged: true, oneApprovedLocalBarePush: true, gitParentAndCitations: true,
    freshHostRediscovery: true, actualProcessRestartImportedCompletion: true, obsoleteReviewRefused: true, importedOriginPreserved: true, scriptedIntentAndKeysOnly: true, noLiveOperations: true, maxVisibleBytes: maxVisible }));
} finally {
  for (const session of sessions) { await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' }); session.dispose(); }
  process.env = previousEnv;
  for (const fn of cleanup) await fn();
}
