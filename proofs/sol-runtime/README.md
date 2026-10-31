# Issue #1 — offline Sol/max runtime preparation (NOT a live proof)

This disposable, isolated Node 22.23.2 / npm 10.9.8 ESM harness exercises the real Pi SDK session and tool loop with deterministic model and HTTP adapters. No model or web research call was made. Ticket #1 stays **open** until the user approves and a live sourced investigation succeeds. Its source/test interface is intended for later integration into the #7 researcher; this directory is not a second application or an MCP server.

## Installation (may access the npm registry) and offline checks

From `proofs/sol-runtime`, install in **this worktree's own** `node_modules/`; a lockfile and npm cache do not imply installation is offline:

```sh
npm ci --ignore-scripts --no-audit --no-fund
```

After installation, run verification **without** model/search/source network calls:

```sh
npm test
npm ls --depth=0
```

Dependencies are fixed in `package-lock.json`: `@earendil-works/pi-coding-agent@0.84.2` and directly used `typebox@1.3.7`. The published Pi package's `npm-shrinkwrap.json` and the inherited local lock both omit SRI on six nested `@earendil-works/pi-*` packages; their names, versions and registry URLs match locally, but the lock is **not fully integrity-pinned**. No package provenance or absence of tampering is guaranteed by this check. No dependency changes were needed for this repair. The root application/package is owned by #2; reconcile before production use. Tests use the actual Pi SDK session/tool-validation loop, injected model/HTTP fixtures, and a real installed Codex SSE serializer with a synthetic in-process transport. `globalThis.fetch` is forbidden by the session fixtures; the Codex probe injects its own offline `fetch`. The live entrypoint refuses to run without an explicit operator argument. `node_modules/`, test receipts and research outputs are ignored.

## Narrow module/interface

- `runInvestigation({question,scope,signal?}, {modelRuntime,adapter,limits?})` in `src/research.mjs` accepts either injected dependencies or `createDependencies({signal})` (the live entrypoint uses this so runtime initialization shares its deadline). It returns `completed | incomplete | failed | cancelled`, a safe reason code, configured model/effort and bounds, attempted model/tool counts, tool-output bytes, available per-response usage, inspected source URLs/full bounded passages/visible-text digests, and (only if completed) a cited short answer. Invalid input/limits throw. Optional bound overrides **only decrease** starting limits.
- `adapter`: precisely two methods, `search(query,{signal,limits})` and `fetch(url,{signal,limits,offset?,contains?})`; the production proposal is `createBraveRfcAdapter({token,fetchImpl?})` in `src/brave-rfc.mjs`. No general provider framework. It performs programmatic Brave Web Search API requests and direct Node HTTPS fetches of official RFC Editor RFC pages; not Pi's built-in tools, a parent's web tool, a browser, or a model catalogue. The token stays in an HTTP header, never the model prompt/result. Search hits are leads, not cited evidence. Search is restricted by `site:rfc-editor.org` **and** validated URL filtering; fetched URLs must be HTTPS `rfc-editor.org` or `www.rfc-editor.org` with `/rfc/rfc2606.html|txt` only, no redirects, fragments, credentials, or query strings.
- `makeLiveDependencies({searchToken,signal})` in `src/live-dependencies.mjs` creates Pi's supported `ModelRuntime` (without network catalogue refresh) and the adapter. Call it **only after** separate live + credential approval. The harness does not directly read, print or serialize Pi credential contents; the SDK resolves authentication internally. The isolated loader supplies only a small instruction, no globally discovered extensions, skills, context files, shell, read/write/edit, Git, acceptance, MCP dispatch or nested researcher. Session and settings are in memory; there is no persistent transcript or hidden reasoning artifact. These tool restrictions are **not** an OS sandbox.

Pi SDK checks `model.provider/id`, `api`, `reasoning`, and `thinkingLevelMap.max`, then the created session's effective `thinkingLevel === 'max'` and exact two-tool allowlist. Unsupported effort, absent model/auth, unexpected configured routing, quota and provider errors fail without substituting models/effort. The official Codex base URL must match `https://chatgpt.com/backend-api`; configured auth metadata must not override it. Coding worker `PI_*` preflight is separate from this product session. Any later provider-internal routing is not independently audited.

Session-local `SettingsManager.inMemory` explicitly sets `retry.enabled:false`, `retry.maxRetries:0`, `retry.provider.maxRetries:0`, `compaction.enabled:false`, `transport:'sse'`. This blocks agent retry and overflow compact-and-retry (Pi `agent-session.js` checks `compaction.enabled` before overflow recovery); SSE avoids Codex's automatic WebSocket reconnect/fallback path. Pi SDK forwards `maxRetries:0` to the Codex provider, whose SSE loop does not retry on `maxRetries:0`. Offline tests inject provider errors/overflow and assert exactly one model request; they cannot prove every upstream service's internal retry behavior. The actual `ModelRuntime.prepareRequest()` resolves auth on **each** request: a guarded runtime checks the effective model/route after every resolution and rejects an unapproved base URL before provider dispatch, without copying auth into model-visible context.

## Starting per-run bounds (not a price cap)

| Bound | Starting value |
|---|---:|
| Wall clock | 180,000 ms (3 minutes) |
| Model requests | at most 5 dispatched by this process (an extra attempted request is rejected before dispatch) |
| Research tool attempts | 4 (invalid/rejected calls count) |
| Each tool deadline | 12,000 ms |
| Total model-visible research-tool output | 10,000 UTF-8 bytes |
| Per-model-response streamed visible output | 1,500 JavaScript characters including text, visible thinking and tool-call argument JSON; overflow aborts the run (final answer shares this bound) |
| Search results | at most 3 official RFC 2606 URLs |
| Brave raw search response | 16,384 bytes, oversized JSON fails |
| Each fetched RFC raw response | 65,536 bytes (truncation disclosed; material beyond this cap cannot be inspected by this proof) |
| Each selected fetched passage/model-visible text | 2,400 characters, by offset or case-insensitive `contains` within extracted text (location/continuation and truncation disclosed; full selected passage retained for review) |
| Question/scope/search query/URL/`contains` selector | 300/400/180/512/80 characters (`offset` at most 65,536) |

The overall wall timer starts **before live dependency initialization, auth and SDK session creation**. Those awaits are raced against the wall deadline and user abort, with a session that finishes creating late disposed. A non-cooperative setup/auth/provider/tool may continue underlying work after local return. Every tool receives the SDK abort signal and an independent timeout; tool attempts are counted at SDK `tool_execution_start`, including schema-rejected and unknown calls, and extra attempts do not execute adapters. In-flight provider requests/tools may not stop instantly, and incurred usage cannot be refunded. No instant cancellation, process sandbox, **remote token/cost ceiling**, or durable partial-job recovery is claimed. The installed Codex SSE serializer **does not send** `model.maxTokens` as `max_output_tokens`: changing the catalogue property or a local option would not enforce a remote 4,096-token cap. The real controls here are wall time, model-request count, streamed **visible** output (including tool args), and bounded tool work; hidden reasoning/output and remote computation are not independently capped by a provider request field. Limit hits return `incomplete`; tool/provider faults return `failed`; user abort takes priority over an overlapping wall/internal stop. No unbudgeted model call polishes a stopped result. Visible usage is recorded only where the provider reports it, never invented costs. Full #7/#8 job artifacts/lifecycle remain out of scope.

Completion in this **RFC 2606 example-domain proof** requires a successful nonempty search, then a fetch of a returned in-scope URL, an inspected cited passage containing all three example-domain names **and** a use term, and an answer naming the same names/use. Missing or insufficient evidence is `incomplete`; a premature fetch is rejected. This is a mechanical scope check, **not** factual verification or proof that every claim is supported. Parent review must examine the full bounded `sources[].excerpt` passage (up to 2,400 characters per call), its offset/truncation and digest, plus the answer before accepting live evidence. A missing term outside the accessible raw 65,536 bytes cannot be assumed absent from the entire RFC. Excerpts and SHA-256 digests describe only the **selected visible** source passage, not the complete page. HTML extraction is intentionally simple; pages with interactive/JS-only content cannot count as inspected. No third-party page is published by this harness.

## Separate live approval required — do not run now

**Revised approval proposal, NOT authorized yet:** one question: **“Which second-level example domain names does RFC 2606 reserve, and for what use?”** Scope: official RFC Editor RFC 2606 only (search restricted to `rfc-editor.org`, fetch restricted to official RFC `.html`/`.txt` pages). Providers/credentials: the existing configured Pi **OpenAI Codex** authentication for `openai-codex/gpt-6-sol` at `max`, plus a **new Brave Search API** subscription key supplied as `BRAVE_SEARCH_API_KEY`. Brave pricing, free-tier eligibility and actual quota are **unverified**; ask before account/service creation, payment or setting a new credential. No Gemini, Jev, external research tool, model fallback or publication. Exact revised limits are the table above: **3-minute wall including setup, 5 model requests, 4 tool attempts, 12-second tool timeout, 10,000 tool-output bytes total, 1,500 visible streamed characters per response, 3 search hits, 16,384 raw search bytes, 65,536 raw source bytes and 2,400 visible passage characters per fetch**. The old proposed 4,096 remote-output-token limit is **withdrawn** because the installed transport does not enforce it. There is no provider-side token/cost guarantee; before live use, the user must approve this revised risk/limit proposal and any Brave service/key setup. This is one run, no automatic retry if it fails.

**Only after explicit authorization and permitted credential setup**, from this directory run:

```sh
node live-once.mjs --approved-rfc2606 > ../../.research-local/issue-01-tests/live-once.json
```

The argument is an operator acknowledgement, **not** an approval gate/authentication system; the human Pi host must first obtain consent for the exact question/providers/limits. The JSON contains the bounded cited result, selected session model/effort, counts, inspected-source excerpts/digests, usage where reported, and honest failure codes. Protect the ignored local evidence; do not publish it or assume a fixture pass proves operational Brave access. Record exact provider auth/quota failures or successful fetched/cited evidence for parent review; do not mark #1 complete without it. Do not run `npm test` with the live flag.
