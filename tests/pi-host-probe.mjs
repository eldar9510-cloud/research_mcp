// Optional no-model Pi SDK + installed Pi MCP adapter probe. Never uses global config/auth.
// PI_SDK_ROOT=/absolute/installed/pi-package PI_ADAPTER_INDEX=/absolute/installed/pi-mcp-adapter/index.ts node tests/pi-host-probe.mjs
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

if (!process.env.PI_SDK_ROOT || !process.env.PI_ADAPTER_INDEX) throw Error('Set PI_SDK_ROOT and PI_ADAPTER_INDEX to installed package paths');
const root = await mkdtemp(join(tmpdir(), 'research-mcp-pi-probe-'));
const cwd = join(root, 'project');
const agentDir = join(root, 'pi-agent');
const archiveRoot = join(root, 'archive');
const workRoot = join(root, 'work');
const importRoot = join(root, 'imports');
try {
  for (const dir of [cwd, agentDir, archiveRoot, workRoot, importRoot]) await fs.mkdir(dir);
  const sourcePath = join(importRoot, 'notes.md');
  await fs.copyFile(resolve('tests/fixtures/field-notes.md'), sourcePath);
  const config = {
    mcpServers: { research_import: {
      command: process.execPath, args: [resolve('src/stdio.js')], lifecycle: 'lazy',
      env: { RESEARCH_ARCHIVE_ROOT: archiveRoot, RESEARCH_WORK_ROOT: workRoot, RESEARCH_IMPORT_ROOT: importRoot },
    } },
  };
  // In-memory adapter configuration is a complete isolated snapshot: no ambient MCP files are merged.
  const extensionPath = join(cwd, 'isolated-adapter.ts');
  await fs.writeFile(extensionPath, `import { createMcpAdapter } from ${JSON.stringify(process.env.PI_ADAPTER_INDEX)};\nexport default createMcpAdapter(${JSON.stringify({ config })});\n`);
  process.env.PI_OFFLINE = '1';
  process.env.PI_TELEMETRY = '0';
  process.env.PI_CODING_AGENT_DIR = agentDir;
  const sdkUrl = pathToFileURL(join(process.env.PI_SDK_ROOT, 'dist/index.js'));
  const { DefaultResourceLoader, createAgentSession, SessionManager, SettingsManager, ModelRuntime } = await import(sdkUrl.href);
  const settingsManager = SettingsManager.inMemory({ compaction: { enabled: false }, retry: { enabled: false } });
  const resourceLoader = new DefaultResourceLoader({ cwd, agentDir, settingsManager, additionalExtensionPaths: [extensionPath] });
  await resourceLoader.reload();
  const modelRuntime = await ModelRuntime.create({ authPath: join(agentDir, 'auth.json'), modelsPath: join(agentDir, 'models.json'), modelsStorePath: join(agentDir, 'models-store.json') });
  const { session, extensionsResult } = await createAgentSession({ cwd, agentDir, resourceLoader, modelRuntime,
    sessionManager: SessionManager.inMemory(cwd), settingsManager, noTools: 'builtin' });
  try {
    assert.deepEqual(extensionsResult.errors, []);
    await session.bindExtensions({ mode: 'print' }); // SDK host lifecycle; no prompt/model call.
    const proxy = session.agent.state.tools.find(x => x.name === 'mcp');
    assert.ok(proxy, 'installed Pi MCP adapter registered its proxy tool');
    const params = { tool: 'research_import_save_research_draft', args: {
      sourcePath, metadata: {
        id: 'orchard-water', title: 'Orchard irrigation methods', question: 'Which watering method suits sandy orchard soil?',
        scope: 'Small orchard; sandy soil; constraints beyond these unknown.', summary: 'Two drip cycle alternatives, limitations and original citations.',
        researched_at: null, last_improved_at: null, language: 'en',
        origin: { kind: 'imported', platform: 'unknown', author: 'unknown', model: 'unknown' },
        related_reports: [], warnings: [], superseded_by: null,
      },
    } };
    const result = await proxy.execute('pi-probe-import', params);
    const proposal = result.details?.mcpResult?.structuredContent?.proposal;
    assert.ok(proposal?.proposalId, JSON.stringify({ content: result.content, details: result.details }).slice(0, 1200));
    const read = await proxy.execute('pi-probe-read', { tool: 'research_import_read_research', args: { proposalId: proposal.proposalId, expectedRevision: proposal.revision } });
    const page = read.details?.mcpResult?.structuredContent;
    assert.equal(page?.state, 'LOCAL_UNACCEPTED');
    assert.equal(page?.revision, proposal.revision);
    assert.match(page?.content?.text, /Orchard irrigation/);
    console.log(JSON.stringify({ piHost: true, noModelPrompt: true, registeredTool: proxy.name, proposalId: proposal.proposalId, revision: page.revision, state: page.state }));
  } finally {
    await session.extensionRunner.emit({ type: 'session_shutdown', reason: 'quit' });
    session.dispose();
  }
} finally { await fs.rm(root, { recursive: true, force: true }); }
