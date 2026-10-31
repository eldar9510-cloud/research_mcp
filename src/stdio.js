import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

const archiveRoot = process.env.RESEARCH_ARCHIVE_ROOT;
const workRoot = process.env.RESEARCH_WORK_ROOT;
const importRoot = process.env.RESEARCH_IMPORT_ROOT;
const limit = process.env.RESEARCH_READ_BYTES;
const searchLimit = process.env.RESEARCH_SEARCH_LIMIT;
try {
  const server = createServer({ archiveRoot, workRoot, importRoot,
    maxReadBytes: limit === undefined ? 2048 : Number(limit),
    maxSearchResults: searchLimit === undefined ? 5 : Number(searchLimit) });
  await server.connect(new StdioServerTransport());
} catch {
  // Never print config paths, source text, environment values, or credentials on stdio.
  console.error('research-mcp: failed to start; check configured absolute roots and read limit');
  process.exitCode = 1;
}
