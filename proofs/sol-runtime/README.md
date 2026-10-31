# Issue #1 — offline Sol/max runtime preparation (NOT a live proof)

This disposable, isolated Node 22.23.2 / npm 10.9.8 ESM harness exercises the real Pi SDK session and tool loop with deterministic model and HTTP adapters. No model or web research call was made. Ticket #1 stays **open** until the user approves and a live sourced investigation succeeds. Its source/test interface is intended for later integration into the #7 researcher; this directory is not a second application or an MCP server.

## Repeatable offline checks

From `proofs/sol-runtime`:

```sh
npm install --ignore-scripts --no-audit --no-fund
npm test
npm ls --depth=0
```

Dependencies are locked locally in `package-lock.json`: `@earendil-works/pi-coding-agent@0.84.2` and `typebox@1.3.7` direct. The root application/package is owned by #2; do not copy this harness's root paths or dependencies into production without reconciling them. Node tests use fake Pi `ModelRuntime.streamSimple` and injected HTTP `fetchImpl`; `globalThis.fetch` throws if offline tests try real network. The live entrypoint refuses to run without an explicit operator argument. `node_modules/`, test receipts and research outputs are ignored.

## Narrow module/interface

- `runInvestigation({question,scope,signal?}, {modelRuntime,adapter,limits?})` in `src/research.mjs`: returns `completed | incomplete | failed | cancelled`, a safe reason code, configured model/effort and bounds, attempted model/tool counts, tool-output bytes, available per-response usage, inspected source URLs/excerpts/visible-text digests, and (only if completed) a cited short answer. Invalid input/limits throw. Optional bound overrides **only decrease** starting limits.
- `adapter`: precisely two methods, `search(query,{signal,limits})` and `fetch(url,{signal,limits})`; the production proposal is `createBraveRfcAdapter({token,fetchImpl?})` in `src/brave-rfc.mjs`. No general provider framework. It performs programmatic Brave Web Search API requests and direct Node HTTPS fetches of official RFC Editor RFC pages; not Pi's built-in tools, a parent's web tool, a browser, or a model catalogue. The token stays in an HTTP header, never the model prompt/result. Search hits are leads, not cited evidence. Search is restricted by `site:rfc-editor.org` **and** validated URL filtering; fetched URLs must be HTTPS `rfc-editor.org` or `www.rfc-editor.org` with `/rfc/rfc2606.html|txt` only, no redirects, fragments, credentials, or query strings.
- `makeLiveDependencies({searchToken})` in `src/live-dependencies.mjs` creates Pi's supported `ModelRuntime` (without network catalogue refresh) and the adapter. Call it **only after** separate live + credential approval. It never reads/prints Pi credential file contents; Pi resolves its own Codex authentication. The isolated loader supplies only a small instruction, no globally discovered extensions, skills, context files, shell, read/write/edit, Git, acceptance, MCP dispatch or nested researcher. Session and settings are in memory; there is no persistent transcript or hidden reasoning artifact. These tool restrictions are **not** an OS sandbox.

Pi SDK checks `model.provider/id`, `api`, `reasoning`, and `thinkingLevelMap.max`, then the created session's effective `thinkingLevel === 'max'` and exact two-tool allowlist. Unsupported effort, absent model/auth, unexpected configured routing, quota and provider errors fail without substituting models/effort. The official Codex base URL must match `https://chatgpt.com/backend-api`; configured auth metadata must not override it. Coding worker `PI_*` preflight is separate from this product session. Any later provider-internal routing is not independently audited.

Session-local `SettingsManager.inMemory` explicitly sets `retry.enabled:false`, `retry.maxRetries:0`, `retry.provider.maxRetries:0`, `compaction.enabled:false`, `transport:'sse'`. This blocks agent retry and overflow compact-and-retry (Pi `agent-session.js` checks `compaction.enabled` before overflow recovery); SSE avoids Codex's automatic WebSocket reconnect/fallback path. Pi SDK forwards `maxRetries:0` to the Codex provider, whose SSE loop does not retry on `maxRetries:0`. Offline tests inject provider errors/overflow and assert exactly one model request; they cannot prove every upstream service's internal retry behavior.

## Starting per-run bounds (not a price cap)

| Bound | Starting value |
|---|---:|
| Wall clock | 180,000 ms (3 minutes) |
| Model calls | 5 (each request's `maxTokens` capped at 4,096) |
| Research tool attempts | 4 (invalid/rejected calls count) |
| Each tool deadline | 12,000 ms |
| Total model-visible research-tool output | 10,000 UTF-8 bytes |
| Final visible answer | 1,500 characters; streamed overflow aborts the run |
| Search results | at most 3 official RFC 2606 URLs |
| Brave raw search response | 16,384 bytes, oversized JSON fails |
| Each fetched RFC raw response | 32,768 bytes (truncation disclosed) |
| Each fetched RFC model-visible extracted text | 2,400 characters (truncation disclosed) |
| Question/scope/search query/URL | 300/400/180/512 characters |

A hard wall timer aborts the SDK agent; every tool receives both the SDK abort signal and an independent timeout, and an uncooperative test adapter is raced so the job stops waiting. An in-flight provider request/tool may not stop instantly, and already incurred usage cannot be refunded. An underlying service ignoring abort can continue remote work after local return; no promise of instant cancellation, process sandbox, external cost ceiling or durable partial-job recovery is made. Limit hits return `incomplete`; tool/provider faults return `failed`; user abort returns `cancelled`. No unbudgeted model call polishes a stopped result. Visible usage is recorded only where the provider reports it, never invented costs. Full #7/#8 job artifacts/lifecycle remain out of scope.

Completion requires a successful result citing `[S#]` assigned to at least one **fetched** page; missing, snippet-only or fabricated references remain `incomplete`. This small proof cannot establish factual correctness or that each claim is supported by its citation; review the live fetched excerpts, question scope and answer before accepting. Excerpts and SHA-256 digests describe the **bounded visible** source content, not the whole page if truncated. HTML extraction is intentionally simple; pages with interactive/JS-only content cannot count as inspected. No third-party page is published by this harness.

## Separate live approval required — do not run now

Proposed one question: **“Which second-level example domain names does RFC 2606 reserve, and for what use?”** Scope: official RFC Editor RFC 2606 only (search restricted to `rfc-editor.org`, fetch restricted to official RFC `.html`/`.txt` pages). Providers/credentials: the existing configured Pi **OpenAI Codex** authentication for `openai-codex/gpt-6-sol` at `max`, plus a **new Brave Search API** subscription key supplied as `BRAVE_SEARCH_API_KEY`. Brave pricing, free-tier eligibility and actual quota are **unverified**; ask before account/service creation, payment or setting a new credential. No Gemini, Jev, external research tool, model fallback or publication. Exact limits are the table above; this is one run, no automatic retry if it fails.

**Only after explicit authorization and permitted credential setup**, from this directory run:

```sh
node live-once.mjs --approved-rfc2606 > ../../.research-local/issue-01-tests/live-once.json
```

The argument is an operator acknowledgement, **not** an approval gate/authentication system; the human Pi host must first obtain consent for the exact question/providers/limits. The JSON contains the bounded cited result, selected session model/effort, counts, inspected-source excerpts/digests, usage where reported, and honest failure codes. Protect the ignored local evidence; do not publish it or assume a fixture pass proves operational Brave access. Record exact provider auth/quota failures or successful fetched/cited evidence for parent review; do not mark #1 complete without it. Do not run `npm test` with the live flag.
