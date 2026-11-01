// Research/proof fixtures may never reach any actual HTTP/DNS/TLS connection.
const fs = require('node:fs');
const { syncBuiltinESMExports } = require('node:module');
let attempts = 0;
process.on('exit', () => { if (attempts) process.exitCode = 1; });
function reject(name) {
  attempts++;
  if (process.env.RESEARCH_TRIPWIRE) fs.appendFileSync(process.env.RESEARCH_TRIPWIRE, `${name}\n`);
  throw new Error(`OFFLINE NETWORK FORBIDDEN: ${name}`);
}
for (const name of ['node:http', 'node:https']) {
  const module = require(name);
  for (const method of ['request', 'get']) module[method] = () => reject(`${name}.${method}`);
}
for (const name of ['node:dns', 'node:dns/promises']) {
  const module = require(name);
  for (const method of ['lookup', 'resolve', 'resolve4', 'resolve6', 'resolveAny', 'reverse']) module[method] = () => reject(`${name}.${method}`);
}
const net = require('node:net');
net.connect = net.createConnection = net.Socket.prototype.connect = () => reject('net.connect');
require('node:tls').connect = () => reject('tls.connect');
syncBuiltinESMExports();
globalThis.fetch = () => reject('fetch');
