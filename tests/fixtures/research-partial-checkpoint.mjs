// Synthetic crash stage: hold a real exclusive checkpoint open BEFORE writing,
// after the inspected source has been flushed and the third model is pending.
import fs from 'node:fs/promises';
import { syncBuiltinESMExports } from 'node:module';
import { join } from 'node:path';
import { ModelRuntime } from '@earendil-works/pi-coding-agent';
import { createArchive } from '../../src/archive.js';
import { createResearch } from '../../src/research.js';
import { INPUT, runtime, adapter, steps } from '../research-support.js';
ModelRuntime.create = () => { throw Error('DEFAULT AUTH INITIALIZATION FORBIDDEN'); };
const root = process.argv[2];
const config = { archiveRoot: join(root, 'archive'), workRoot: join(root, 'work'), importRoot: join(root, 'imports') };
const f = runtime(steps()), originalStream = f.runtime.streamSimple;
let calls = 0, id, held = false;
f.runtime.streamSimple = function (...args) {
  const stream = originalStream.apply(this, args), block = ++calls === 3;
  return { async *[Symbol.asyncIterator]() { if (block) await new Promise(() => {}); yield* stream; }, result: () => stream.result() };
};
const open = fs.open;
fs.open = async (path, ...args) => {
  const handle = await open(path, ...args);
  if (!held && calls === 3 && typeof path === 'string' && /\.state-[1-9][0-9]?\.json$/.test(path)) {
    held = true;
    process.send({ jobId: id, heldCheckpoint: path });
    await new Promise(() => {});
  }
  return handle;
};
syncBuiltinESMExports();
const research = createResearch({ archive: createArchive(config), workRoot: config.workRoot,
  createDependencies: async () => ({ modelRuntime: f.runtime, adapter: adapter() }) });
id = research.start(INPUT).jobId;
// IPC keeps this finite, parent-owned fixture alive until the explicit SIGKILL.
