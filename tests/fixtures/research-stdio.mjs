// Synthetic-only MCP entrypoint. Production has no fixture environment switches.
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { createServer } from '../../src/server.js';
import { runtime, adapter, steps } from '../research-support.js';
import { appendFileSync } from 'node:fs';
let jobs = 0;
const log = text => { if (process.env.RESEARCH_TEST_LOG) appendFileSync(process.env.RESEARCH_TEST_LOG, text + '\n'); };
ModelRuntime.create = () => { throw new Error('REAL AUTH INITIALIZATION FORBIDDEN'); };
const server = createServer({ archiveRoot: process.env.RESEARCH_ARCHIVE_ROOT, workRoot: process.env.RESEARCH_WORK_ROOT,
  importRoot: process.env.RESEARCH_IMPORT_ROOT,
  createDependencies: async () => {
    await new Promise(resolve => setTimeout(resolve, 25));
    const hold = ++jobs === 1 && process.env.RESEARCH_TEST_HOLD === 'model';
    const f = runtime(steps()), stream = f.runtime.streamSimple;
    let calls = 0;
    log('dependencies');
    f.runtime.streamSimple = function (model, context, options) {
      calls++; log('model');
      const original = stream.call(this, model, context, options), pending = hold && calls === 3;
      return { async *[Symbol.asyncIterator]() {
        if (pending && !options.signal.aborted) await new Promise(resolve => options.signal.addEventListener('abort', resolve, { once: true }));
        yield* original;
      }, result: () => original.result() };
    };
    return { modelRuntime: f.runtime, adapter: adapter() };
  } });
await server.connect(new StdioServerTransport());
const shutdown = () => { void server.close().catch(() => { process.exitCode = 1; }); };
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
