// Synthetic-only MCP entrypoint. Production has no fixture environment switches.
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { createServer } from '../../src/server.js';
import { runtime, adapter, steps } from '../research-support.js';
ModelRuntime.create = () => { throw new Error('REAL AUTH INITIALIZATION FORBIDDEN'); };
const server = createServer({ archiveRoot: process.env.RESEARCH_ARCHIVE_ROOT, workRoot: process.env.RESEARCH_WORK_ROOT,
  importRoot: process.env.RESEARCH_IMPORT_ROOT,
  createDependencies: async () => {
    await new Promise(resolve => setTimeout(resolve, 25));
    return { modelRuntime: runtime(steps()).runtime, adapter: adapter() };
  } });
await server.connect(new StdioServerTransport());
const shutdown = () => { void server.close().catch(() => { process.exitCode = 1; }); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
