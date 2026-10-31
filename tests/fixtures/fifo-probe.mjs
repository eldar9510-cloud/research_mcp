import { createArchive, ArchiveError } from '../../src/archive.js';
import { metadata } from '../support.js';
import { join } from 'node:path';

const roots = JSON.parse(process.argv[2]);
const archive = createArchive(roots);
let fifoRejected = false;
try {
  await archive.importReport({ sourcePath: join(roots.importRoot, 'pipe.md'), metadata: metadata('fifo') });
} catch (e) {
  if (!(e instanceof ArchiveError) || e.code !== 'invalid_input') throw e;
  fifoRejected = true;
}
const next = await archive.importReport({ text: 'unrelated', metadata: metadata('unrelated') });
console.log(`fifo_rejected=${fifoRejected} subsequent=${next.status}`);
