# Pinned candidate setup

Use an identified **engine-containing checkout** for these commands. The historical 2026-11-02 public snapshot `265fc3c93448dcc6393f1a127cc347ce8729d9e2` contains twenty approved reports and evaluation evidence, not the engine. [Issue #11](https://github.com/eldar9510-cloud/research_mcp/issues/11) records current acceptance and source-publication state; do not infer either from a local checkout. See [v0-signoff.md](v0-signoff.md) for the labelled verification evidence. This guide does not authorize installation/network access or change global configuration.

## Supported combination

| Component | Tested selection |
| --- | --- |
| Runtime | Linux, Node 22.23.2 / npm 10.9.8; required Node **>=22.19**, not merely >=22 |
| Project Pi CLI **and** SDK | `@earendil-works/pi-coding-agent` **0.84.2** from this checkout's lock |
| MCP adapter | Already installed `pi-mcp-adapter` **2.26.1**, explicit absolute `index.ts` path |
| Other direct dependencies | MCP SDK 1.32.2, typebox 1.3.7, zod 3.25.76 |
| Historical proof | Separate `proofs/sol-runtime` install, also Pi SDK 0.84.2 |

Use this checkout's `node_modules/.bin/pi` and `node_modules/@earendil-works/pi-coding-agent/docs/`, **not global APIs**. Global Pi was observed at 1.5.0; its built-in MCP and other changed APIs were not compatibility-tested. Do not load both MCP implementations, replace pins or install/upgrade a global Pi/adapter as an implicit setup step. If the required adapter is absent, stop for installation approval.

Both locks retain six legacy nested Pi entries without SRI. Exact versions/URLs are not complete transitive-integrity or provenance guarantees. The fresh offline installs actually succeeded from empty `node_modules`, using only approved public lock-selected cache archives, with scripts disabled. Eight uncached optional other-platform packages were skipped by npm on this platform. This is not evidence of installation on those platforms.

## Fresh roots and clean environment

Arrange an **already supplied/approved candidate checkout** at `ROOTS/code`. Use canonical absolute non-symlink paths. The archive may be that code checkout; work/import roots must be **siblings, never inside it**:

```text
ROOTS/
  code/       # existing candidate Git worktree; src/, reports/, INDEX.json
  work/       # local proposals/jobs, never the public archive
  imports/    # only selected finished input files
  pi-agent/   # fresh Pi settings/cache/session area, no cached approvals
```

For a credential-free setup/check shell, substitute three existing installation paths below. `PUBLIC_NPM_CACHE` must already contain the approved lock-selected public tarballs; do not copy an entire personal cache, headers or configuration. Without that cache, stop for registry-access approval. An approved online `npm ci` is a separate installation path, not exercised by this offline receipt.

```sh
ROOTS=/absolute/path/to/research-workspace
NODE_BIN=/absolute/path/to/node-22.23.2/bin
ADAPTER_INDEX=/absolute/path/to/already-installed/pi-mcp-adapter/index.ts
PUBLIC_NPM_CACHE=/absolute/path/to/approved-public-npm-cache
mkdir -p "$ROOTS"/home "$ROOTS"/work "$ROOTS"/imports "$ROOTS"/pi-agent \
  "$ROOTS"/config "$ROOTS"/cache "$ROOTS"/data "$ROOTS"/state "$ROOTS"/tmp
# Start a clean shell: no inherited model/search keys, auth/config overrides or NODE_OPTIONS.
env -i PATH="$NODE_BIN:/usr/bin:/bin" ROOTS="$ROOTS" \
  PI_ADAPTER_INDEX="$ADAPTER_INDEX" HOME="$ROOTS/home" \
  XDG_CONFIG_HOME="$ROOTS/config" XDG_CACHE_HOME="$ROOTS/cache" \
  XDG_DATA_HOME="$ROOTS/data" XDG_STATE_HOME="$ROOTS/state" TMPDIR="$ROOTS/tmp" \
  PI_CODING_AGENT_DIR="$ROOTS/pi-agent" PI_OFFLINE=1 PI_SKIP_VERSION_CHECK=1 PI_TELEMETRY=0 \
  npm_config_cache="$PUBLIC_NPM_CACHE" npm_config_offline=true \
  npm_config_update_notifier=false npm_config_audit=false npm_config_fund=false \
  NO_UPDATE_NOTIFIER=1 DO_NOT_TRACK=1 bash --noprofile --norc
```

In that shell:

```sh
export ENGINE_ROOT="$ROOTS/code"
export RESEARCH_ARCHIVE_ROOT="$ENGINE_ROOT"
export RESEARCH_WORK_ROOT="$ROOTS/work"
export RESEARCH_IMPORT_ROOT="$ROOTS/imports"
export PI_SDK_ROOT="$ENGINE_ROOT/node_modules/@earendil-works/pi-coding-agent"
cd "$ENGINE_ROOT"
test "$(git rev-parse --show-toplevel)" = "$ENGINE_ROOT"  # canonical archive Git root
node --version
npm --version
npm ci --offline --ignore-scripts --no-audit --no-fund
"$ENGINE_ROOT/node_modules/.bin/pi" --version  # must be 0.84.2
# Only if running the separate historical regression:
(cd proofs/sol-runtime && npm ci --offline --ignore-scripts --no-audit --no-fund)
```

`PI_OFFLINE` disables Pi startup network operations, **not arbitrary extension/provider networking**. Before running verification, generate and use the [guarded runner below](#repeatable-checks): it loads this checkout's absolute `tests/research-tripwire.cjs` HTTP/DNS/TLS preload and guards both exact SDK instances, including children that replace `NODE_OPTIONS` or their environment. The clean shell alone does not install those guards. No normal auth store was used for the candidate checks.

## Project MCP file and fresh CLI

Inspect `.pi/extensions/research-{acceptance,coverage}.ts`, their imported engine modules and the installed adapter before loading them. With local setup approval, create the ignored `.mcp.json` in the **Pi cwd**. No `.mcp.env`, secret file, global config edit or `npx` is needed:

```sh
node --input-type=module <<'JS'
import { writeFile } from 'node:fs/promises';
const env = Object.fromEntries(['RESEARCH_ARCHIVE_ROOT', 'RESEARCH_WORK_ROOT', 'RESEARCH_IMPORT_ROOT']
  .map(key => [key, process.env[key]]));
await writeFile('.mcp.json', JSON.stringify({
  settings: { autoAuth: false, sampling: false },
  mcpServers: { research_import: {
    command: 'node', args: [`${process.env.ENGINE_ROOT}/src/stdio.js`], lifecycle: 'lazy',
    approveTools: ['accept_research_draft'], env,
  } },
}, null, 2) + '\n', { flag: 'wx', mode: 0o600 }); // refuse to overwrite an existing config
JS
```

All three root values must match the exported host roots. Optional `RESEARCH_READ_BYTES` (128–8192, default 2048) and `RESEARCH_SEARCH_LIMIT` (1–10, default 5) may be added explicitly to both host and server env; omit unset keys. The gates refuse other server env overrides, wrong stdio paths, unknown aliases and `.pi/mcp.json` overrides. Do not use `/mcp enable` here: it creates that override layer. See [acceptance.md](acceptance.md) for target-attestation and same-user limits.

Start a **fresh interactive TUI**, without `--continue`/`--resume` or old adapter approvals. After manual source inspection, these explicit `-e` paths load only the chosen extensions (no `--approve` automation):

```sh
"$ENGINE_ROOT/node_modules/.bin/pi" --offline --no-session --no-extensions \
  -e "$PI_ADAPTER_INDEX" \
  -e "$ENGINE_ROOT/.pi/extensions/research-acceptance.ts" \
  -e "$ENGINE_ROOT/.pi/extensions/research-coverage.ts" \
  --no-skills --no-prompt-templates --no-themes --no-context-files --no-builtin-tools
```

Alternatively, trusted project discovery can load the two local extensions, with the adapter explicitly loaded once. Inspect the project and answer any trust prompt yourself; do not reuse session-wide MCP grants from before the gates loaded. The supported approval UI is **TUI only**, not RPC/print/JSON. Our new CLI smoke checked startup/command registration in RPC without a prompt; existing probes use scripted TUI decisions. Neither is a new real-human consent demonstration.

This clean environment has **no main-Pi authentication**: startup and no-model SDK/MCP checks work, but natural-language model interaction requires separately authorized normal Pi authentication. Live research additionally requires the existing Codex Sol 6.1/max entitlement/catalogue and host-supplied Brave credential through supported interfaces. Fresh availability was not proved here; fail clearly, never manufacture a model entry, copy credentials, fall back or lower effort. Do not put keys in `.mcp.json`, tool arguments, examples or reports. Installing/starting Pi grants no research, Jev payload or publication permission.

## First lookup, operation and recovery

- Discover the normal proxy with `mcp({connect:"research_import"})`, then `mcp({search:"search_research",server:"research_import"})`. Query through `research_import_search_research`; read a **returned ID/revision**, following complete continuations. For automatic coverage use [pi-workflow.md](pi-workflow.md).
- A checkout/copy normally changes report mtimes. Expect `catalogue_stale`, **not an empty archive**. Inspect report blobs/metadata against the frozen [#10 identities](../evaluation/issue10/results.json) first. The candidate probe explicitly rebuilds **only its disposable copy** via `mcp({tool:"research_import_rebuild_catalogue",args:{}})` (its fixture alias differs). Do not rebuild the real data root as an incidental test or fake original mtimes.
- For an intentionally empty fixture, a missing index is `catalogue_unavailable`; after inspection an explicit rebuild establishes a valid empty catalogue. Invalid report bytes require manual recovery, not an invented repair.
- For a real checkout, obtain maintenance approval before rebuilding, inspect `git diff -- INDEX.json`, and arrange a separately reviewed **clean baseline before publication**. A changed derived index is not permission to commit/push it, and `/research-publish` refuses unrelated dirt/outgoing engine commits.
- External import is a proposal only; [acceptance](acceptance.md), [research/recovery](research.md) and [publication/recovery](publication.md) have separate permissions. Keep one writer per archive/work roots. Never blindly retry an uncertain acceptance/commit/push or delete surviving job artifacts.

## Repeatable checks

### Generate the local verification helpers

Use the clean shell and exported roots above, **after** both root and historical-proof dependencies have been supplied/installed with approval. This recipe does not install anything. It fails unless **both actual SDK instances are 0.84.2**, the supplied adapter is **2.26.1**, and the source tripwires exist. Use canonical paths without whitespace, quotes or backslashes (the preload tokens below are deliberately unquoted).

The following complete generator uses only Node built-ins and package metadata; it does not initialize an SDK or read authentication. It creates a unique `ROOTS/verification-*` directory **outside the archive**, with private HOME/XDG/agent/cache/TMPDIR/npm configuration. Directories are 0700; helpers, configuration and receipts are exclusively created at 0600. It refuses existing targets rather than replacing files. Keep this directory private; do not add it to the archive or publish its receipts.

```sh
VERIFY=$(node --input-type=module <<'GUARD_JS'
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import { dirname, isAbsolute, join, relative, sep } from 'node:path';

const canonical = value => {
  assert.ok(typeof value === 'string' && isAbsolute(value), 'Supply absolute paths');
  assert.ok(!/[\s"'\\]/.test(value), 'Preload paths must not need quoting');
  assert.equal(fs.realpathSync(value), value, 'Use canonical non-symlink paths');
  return value;
};
const workspace = canonical(process.env.ROOTS);
const ROOT = canonical(process.env.ENGINE_ROOT);
const NODE = canonical(process.execPath);
const ADAPTER = canonical(process.env.PI_ADAPTER_INDEX);
const inside = (base, path) => {
  const r = relative(base, path);
  return r === '' || (!r.startsWith(`..${sep}`) && r !== '..' && !isAbsolute(r));
};
assert.ok(!inside(ROOT, workspace), 'Verification workspace must be outside the archive');
assert.equal(canonical(process.env.RESEARCH_ARCHIVE_ROOT), ROOT);
for (const name of ['node_modules/@earendil-works/pi-coding-agent',
  'proofs/sol-runtime/node_modules/@earendil-works/pi-coding-agent']) {
  assert.equal(JSON.parse(fs.readFileSync(join(ROOT, name, 'package.json'))).version, '0.84.2');
  canonical(join(ROOT, name, 'dist/index.js'));
}
const adapterPackage = JSON.parse(fs.readFileSync(join(dirname(ADAPTER), 'package.json')));
assert.equal(adapterPackage.name, 'pi-mcp-adapter');
assert.equal(adapterPackage.version, '2.26.1');
for (const file of ['tests/research-tripwire.cjs', 'tests/tripwire.cjs']) canonical(join(ROOT, file));
const ART = fs.mkdtempSync(join(workspace, 'verification-'));
fs.chmodSync(ART, 0o700);
for (const dir of ['home', 'config', 'cache', 'data', 'state', 'agent', 'tmp', 'npm-cache', 'receipts', 'work', 'imports'])
  fs.mkdirSync(join(ART, dir), { mode: 0o700 });
const put = (name, body) => fs.writeFileSync(join(ART, name), body, { flag: 'wx', mode: 0o600 });
for (const name of ['npmrc', 'GUARD.jsonl', 'NETWORK.log', 'NEGATIVE-CHILD-NETWORK.log']) put(name, '');
// Bake resolved paths into every helper: a replacement child environment cannot reroot the guard.
const prefix = Object.entries({ ROOT, ART, NODE, ADAPTER })
  .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`).join('\n') + '\n';
put('guard.mjs', prefix + `await (${guard.toString()})();\n`);
put('run.mjs', prefix + `await (${run.toString()})();\n`);
put('selfcheck.mjs', prefix + `await (${selfcheck.toString()})();\n`);
console.log(ART);

async function guard() {
  const fs = await import('node:fs');
  const { default: cp } = await import('node:child_process');
  const { createRequire, syncBuiltinESMExports } = await import('node:module');
  const { isAbsolute, join, relative, sep } = await import('node:path');
  const { fileURLToPath, pathToFileURL } = await import('node:url');
  createRequire(import.meta.url)(join(ROOT, 'tests/research-tripwire.cjs'));
  const record = data => fs.appendFileSync(join(ART, 'GUARD.jsonl'),
    JSON.stringify({ pid: process.pid, ...data }) + '\n');
  const within = path => {
    if (typeof path !== 'string' || !isAbsolute(path)) return false;
    const r = relative(ART, path);
    return r !== '' && r !== '..' && !r.startsWith(`..${sep}`) && !isAbsolute(r);
  };
  let violations = 0;
  process.on('exit', () => { if (violations) process.exitCode = 1; });
  for (const name of ['node_modules/@earendil-works/pi-coding-agent',
    'proofs/sol-runtime/node_modules/@earendil-works/pi-coding-agent']) {
    const sdkPath = join(ROOT, name, 'dist/index.js');
    const version = JSON.parse(fs.readFileSync(join(ROOT, name, 'package.json'))).version;
    if (version !== '0.84.2') throw Error('Wrong verification SDK version');
    const { ModelRuntime } = await import(pathToFileURL(sdkPath).href);
    const original = ModelRuntime.create;
    ModelRuntime.create = function (options = {}) {
      if (!within(options.authPath) || !within(options.modelsPath) ||
        options.credentials || options.allowModelNetwork) {
        violations++;
        record({ event: 'default_auth_refused', sdkPath });
        throw Error('VERIFICATION DEFAULT AUTH INITIALIZATION FORBIDDEN');
      }
      record({ event: 'explicit_synthetic_auth_paths', sdkPath,
        authPath: options.authPath, modelsPath: options.modelsPath });
      return original.call(this, options);
    };
    record({ event: 'sdk_guard_loaded', sdkPath, version });
  }
  const fixed = {
    HOME: join(ART, 'home'), XDG_CONFIG_HOME: join(ART, 'config'), XDG_CACHE_HOME: join(ART, 'cache'),
    XDG_DATA_HOME: join(ART, 'data'), XDG_STATE_HOME: join(ART, 'state'), TMPDIR: join(ART, 'tmp'),
    PI_CODING_AGENT_DIR: join(ART, 'agent'), PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1', PI_TELEMETRY: '0',
    npm_config_cache: join(ART, 'npm-cache'), npm_config_userconfig: join(ART, 'npmrc'),
    npm_config_globalconfig: '/dev/null', npm_config_offline: 'true', npm_config_ignore_scripts: 'true',
    npm_config_update_notifier: 'false', npm_config_audit: 'false', npm_config_fund: 'false',
    NO_UPDATE_NOTIFIER: '1', DO_NOT_TRACK: '1', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
    RESEARCH_TRIPWIRE: join(ART, 'NETWORK.log'),
  };
  const preload = `--require=${join(ROOT, 'tests/research-tripwire.cjs')} --import=${fileURLToPath(import.meta.url)}`;
  const childOptions = options => {
    // Keep deliberate fixture paths/injections; fill isolated defaults when fixtures replace env.
    const env = { ...fixed, ...(options?.env ?? process.env) };
    const extras = (env.NODE_OPTIONS ?? '').split(/\s+/).filter(Boolean)
      .filter(token => !preload.split(' ').includes(token)).join(' ');
    env.NODE_OPTIONS = `${preload} ${extras}`.trim();
    record({ event: 'child_preloads', nodeOptions: env.NODE_OPTIONS });
    return { ...options, env };
  };
  for (const name of ['spawn', 'spawnSync']) {
    const original = cp[name];
    cp[name] = function (command, args, options) {
      if (!Array.isArray(args)) return original.call(this, command, childOptions(args));
      return original.call(this, command, args, childOptions(options));
    };
  }
  for (const name of ['execFile', 'execFileSync']) {
    const original = cp[name];
    cp[name] = function (command, args, options, callback) {
      if (typeof options === 'function') { callback = options; options = undefined; }
      if (!Array.isArray(args)) {
        callback = typeof args === 'function' ? args : callback;
        options = typeof args === 'object' ? args : options; args = [];
      }
      return name === 'execFile' ? original.call(this, command, args, childOptions(options), callback)
        : original.call(this, command, args, childOptions(options));
    };
  }
  for (const name of ['exec', 'execSync']) {
    const original = cp[name];
    cp[name] = function (command, options, callback) {
      if (typeof options === 'function') { callback = options; options = undefined; }
      return name === 'exec' ? original.call(this, command, childOptions(options), callback)
        : original.call(this, command, childOptions(options));
    };
  }
  const fork = cp.fork;
  cp.fork = function (modulePath, args, options) {
    if (!Array.isArray(args)) { options = args; args = []; }
    return fork.call(this, modulePath, args, childOptions(options));
  };
  syncBuiltinESMExports();
  record({ event: 'preload_ready', cwd: process.cwd() });
}

async function run() {
  const assert = (await import('node:assert/strict')).default;
  const fs = await import('node:fs');
  const { spawnSync } = await import('node:child_process');
  const { dirname, join } = await import('node:path');
  const [label, cwd, command, ...args] = process.argv.slice(2);
  assert.ok(label && /^[a-z0-9-]+$/.test(label) && command, 'run.mjs LABEL CWD COMMAND [ARGS...]');
  assert.ok([ROOT, join(ROOT, 'proofs/sol-runtime')].includes(cwd), 'Use the exact root/proof cwd');
  for (const file of ['guard.mjs', 'selfcheck.mjs', 'npmrc']) assert.ok(fs.statSync(join(ART, file)).isFile());
  assert.ok(fs.statSync(join(ROOT, 'tests/research-tripwire.cjs')).isFile());
  for (const name of ['node_modules/@earendil-works/pi-coding-agent',
    'proofs/sol-runtime/node_modules/@earendil-works/pi-coding-agent']) {
    assert.equal(JSON.parse(fs.readFileSync(join(ROOT, name, 'package.json'))).version, '0.84.2');
    assert.ok(fs.statSync(join(ROOT, name, 'dist/index.js')).isFile());
  }
  assert.ok(fs.statSync(ADAPTER).isFile());
  assert.equal(JSON.parse(fs.readFileSync(join(dirname(ADAPTER), 'package.json'))).version, '2.26.1');
  if (label !== 'guard-controls')
    assert.equal(fs.readFileSync(join(ART, 'receipts/guard-controls/exit'), 'utf8'), '0\n', 'Run guard controls first');
  const receipt = join(ART, 'receipts', label);
  fs.mkdirSync(receipt, { mode: 0o700 }); // EEXIST is fatal: never overwrite/retry a receipt.
  fs.writeFileSync(join(receipt, 'command'), JSON.stringify({ cwd, argv: [command, ...args] }) + '\n',
    { flag: 'wx', mode: 0o600 });
  const fd = fs.openSync(join(receipt, 'log'), 'wx', 0o600);
  const result = spawnSync(command, args, { cwd, stdio: ['ignore', fd, fd], env: {
    PATH: `${dirname(NODE)}:/usr/bin:/bin`, HOME: join(ART, 'home'),
    XDG_CONFIG_HOME: join(ART, 'config'), XDG_CACHE_HOME: join(ART, 'cache'),
    XDG_DATA_HOME: join(ART, 'data'), XDG_STATE_HOME: join(ART, 'state'), TMPDIR: join(ART, 'tmp'),
    PI_CODING_AGENT_DIR: join(ART, 'agent'), PI_OFFLINE: '1', PI_SKIP_VERSION_CHECK: '1', PI_TELEMETRY: '0',
    NO_UPDATE_NOTIFIER: '1', DO_NOT_TRACK: '1', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
    npm_config_cache: join(ART, 'npm-cache'), npm_config_userconfig: join(ART, 'npmrc'),
    npm_config_globalconfig: '/dev/null', npm_config_offline: 'true', npm_config_ignore_scripts: 'true',
    npm_config_update_notifier: 'false', npm_config_audit: 'false', npm_config_fund: 'false',
    ENGINE_ROOT: ROOT, PI_SDK_ROOT: join(ROOT, 'node_modules/@earendil-works/pi-coding-agent'),
    PI_ADAPTER_INDEX: ADAPTER, RESEARCH_ARCHIVE_ROOT: ROOT,
    RESEARCH_WORK_ROOT: join(ART, 'work'), RESEARCH_IMPORT_ROOT: join(ART, 'imports'),
    RESEARCH_TRIPWIRE: join(ART, 'NETWORK.log'),
    NODE_OPTIONS: `--require=${join(ROOT, 'tests/research-tripwire.cjs')} --import=${join(ART, 'guard.mjs')}`,
  } });
  if (result.error) fs.writeSync(fd, `Runner error: ${result.error.message}\n`);
  fs.closeSync(fd);
  const status = result.status ?? 1;
  fs.writeFileSync(join(receipt, 'exit'), `${status}\n`, { flag: 'wx', mode: 0o600 });
  console.log(`${label}: exit=${status}; receipts=${receipt}`);
  process.exitCode = status;
}

async function selfcheck() {
  const assert = (await import('node:assert/strict')).default;
  const { spawnSync } = await import('node:child_process');
  const { writeFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { pathToFileURL } = await import('node:url');
  const auth = path => `import(${JSON.stringify(pathToFileURL(join(ROOT, path, 'dist/index.js')).href)}).then(m => m.ModelRuntime.create())`;
  const rootAuth = auth('node_modules/@earendil-works/pi-coding-agent');
  const forbidden = 'VERIFICATION DEFAULT AUTH INITIALIZATION FORBIDDEN';
  const dns = 'require("node:dns").lookup("example.invalid",()=>{})';
  const cases = [
    ['root-default-auth', rootAuth, forbidden, false],
    ['proof-default-auth', auth('proofs/sol-runtime/node_modules/@earendil-works/pi-coding-agent'), forbidden, false],
    ['https', 'require("node:https").get("https://example.invalid/")', 'OFFLINE NETWORK FORBIDDEN: node:https.get', false],
    ['dns', dns, 'OFFLINE NETWORK FORBIDDEN: node:dns.lookup', false],
    ['tls', 'require("node:tls").connect(443,"example.invalid")', 'OFFLINE NETWORK FORBIDDEN: tls.connect', false],
    ['child-override-auth', rootAuth, forbidden, true],
    ['child-override-dns', dns, 'OFFLINE NETWORK FORBIDDEN: node:dns.lookup', true],
  ];
  for (const [label, code, expected, override] of cases) {
    const options = { encoding: 'utf8' };
    if (override) options.env = { PATH: process.env.PATH,
      NODE_OPTIONS: `--require=${join(ROOT, 'tests/tripwire.cjs')}`,
      RESEARCH_TRIPWIRE: join(ART, 'NEGATIVE-CHILD-NETWORK.log') };
    const result = spawnSync(NODE, ['-e', code], options);
    writeFileSync(join(ART, `${label}.negative.log`), (result.stdout ?? '') + (result.stderr ?? ''),
      { flag: 'wx', mode: 0o600 });
    assert.equal(result.status, 1, label);
    assert.ok(result.stderr.includes(expected), `${label}: missing intended guard refusal`);
  }
  console.log('GUARD_CONTROLS_PASS: 7 deliberate refusals (3 auth, 4 network); blocked before real auth/network');
}
GUARD_JS
) || exit "$?"
export VERIFY
printf 'Private verification directory: %s\n' "$VERIFY"
```

Inspect the generated `guard.mjs`, `run.mjs` and `selfcheck.mjs` before executing them. The guard's baked `ROOT` binds **both** source and proof SDK imports; it refuses missing/out-of-workspace auth/models paths, injected credentials and `allowModelNetwork`. Its child-process wrappers cover `spawn`, `spawnSync`, `execFile`, `execFileSync`, `exec`, `execSync` and `fork`, then synchronize named ESM exports. They prepend the exact network/auth preloads even when fixtures replace the environment or `NODE_OPTIONS`, preserving the fixtures' additional preloads. This is local test instrumentation, **not a product API, provider-auth setup or security sandbox**; trusted fixtures may deliberately replace SDK/transport seams.

### Run controls, then checks through the runner

First run the intentional negative controls. Each child **must exit 1 with the expected guard error**; the aggregate command must exit 0. They test root/proof default auth, HTTPS/DNS/TLS, and auth/DNS after a child environment/preload override. These seven known refusals are not unexplained test egress. Stop if any control fails; do not continue with an unguarded suite.

```sh
node "$VERIFY/run.mjs" guard-controls "$ENGINE_ROOT" node "$VERIFY/selfcheck.mjs" || exit "$?"
node "$VERIFY/run.mjs" check "$ENGINE_ROOT" npm run check || exit "$?"
node "$VERIFY/run.mjs" checkpoint-syntax "$ENGINE_ROOT" node --check tests/fixtures/research-partial-checkpoint.mjs || exit "$?"
node "$VERIFY/run.mjs" root-tests "$ENGINE_ROOT" npm test || exit "$?"
node "$VERIFY/run.mjs" mcp-tests "$ENGINE_ROOT" npm run test:mcp || exit "$?"
node "$VERIFY/run.mjs" proof-tests "$ENGINE_ROOT/proofs/sol-runtime" npm test || exit "$?"
node "$VERIFY/run.mjs" pi-host "$ENGINE_ROOT" node tests/pi-host-probe.mjs || exit "$?"
node "$VERIFY/run.mjs" pi-publication "$ENGINE_ROOT" node tests/pi-publication-probe.mjs || exit "$?"
node "$VERIFY/run.mjs" pi-coverage "$ENGINE_ROOT" node tests/pi-coverage-probe.mjs || exit "$?"
node "$VERIFY/run.mjs" pi-research-host "$ENGINE_ROOT" node tests/pi-research-host-probe.mjs || exit "$?"
node "$VERIFY/run.mjs" pi-improvement "$ENGINE_ROOT" node tests/pi-improvement-probe.mjs || exit "$?"
node "$VERIFY/run.mjs" pi-corpus "$ENGINE_ROOT" node tests/pi-corpus-probe.mjs || exit "$?"
node "$VERIFY/run.mjs" pi-workflow-handoff "$ENGINE_ROOT" node tests/pi-workflow-handoff-probe.mjs || exit "$?"
node "$VERIFY/run.mjs" whitespace "$ENGINE_ROOT" git diff --check || exit "$?"
```

Every invocation has a distinct `receipts/LABEL/{command,log,exit}`; existing labels fail closed. Retain the directory and original failures before diagnosing. A separately authorized rerun needs a **new verification directory**, not deleting/reusing receipts. Inspect `GUARD.jsonl` for both exact SDK paths/version records and child preloads; expect exactly three `default_auth_refused` records from controls. Controls add exactly the three direct HTTPS/DNS/TLS lines to `NETWORK.log` and one DNS line to `NEGATIVE-CHILD-NETWORK.log`. Positive checks must add no auth refusals or network attempts, including in fixture-specific tripwire logs. An exit 0 alone is not that evidence. Do not loosen caps/assertions or silently rerun.

The optional `pi-corpus` probe copies only the twenty public reports/index, checks unchanged frozen gold, observes staleness, explicitly rebuilds that inspected copy, then uses two actual SDK sessions and file-based adapter configuration. It never changes the source archive/evaluation. The separate `pi-workflow-handoff` observation chains a valid empty lookup to an explicitly requested new job, then partial coverage to an explicitly requested same-report improvement. Its main-Pi decisions and investigator/source transports are synthetic; it performs no real research or publication. Counts, bounds and unrun live facts are in [v0-signoff.md](v0-signoff.md).
