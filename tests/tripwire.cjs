// Loaded only in the child MCP server process by the integration test.
const fs = require('node:fs');
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
