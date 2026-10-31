// Loaded only in the child MCP server process by the integration test.
const fs = require('node:fs');
// Count incoming accept tools/call packets *at the server transport*, not just
// visible file writes. Log tool names only; never log proposal/source bytes.
if (process.env.RESEARCH_CALL_LOG) {
  const emit = process.stdin.emit;
  let pending = '';
  process.stdin.emit = function (event, ...args) {
    if (event === 'data') {
      pending += args[0].toString('utf8');
      const lines = pending.split('\n');
      pending = lines.pop();
      for (const line of lines) {
        try {
          const packet = JSON.parse(line);
          if (packet.method === 'tools/call' && packet.params?.name === 'accept_research_draft')
            fs.appendFileSync(process.env.RESEARCH_CALL_LOG, 'accept_research_draft\n');
        } catch { /* Partial/non-JSON transport data is not a receipt. */ }
      }
    }
    return emit.call(this, event, ...args);
  };
}
const cp = require('node:child_process');
const http = require('node:http');
const https = require('node:https');
const { syncBuiltinESMExports } = require('node:module');
function reject(name) {
  fs.appendFileSync(process.env.RESEARCH_TRIPWIRE, `${name}\n`);
  throw Error('Import/read must not start subprocesses or network requests');
}
for (const name of ['spawn', 'exec', 'execFile', 'fork', 'spawnSync', 'execSync', 'execFileSync']) cp[name] = () => reject(name);
for (const [module, prefix] of [[http, 'http'], [https, 'https']]) {
  for (const name of ['request', 'get']) module[name] = () => reject(`${prefix}.${name}`);
}
syncBuiltinESMExports();
globalThis.fetch = () => reject('fetch');
