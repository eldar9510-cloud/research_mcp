# Standalone research — issue #7 candidate (live acceptance pending)

`start_research` and `get_research_job` manage a separate bounded Pi SDK investigator and produce local unaccepted proposals. **The trusted Pi TUI research gate and read-only coverage handoff are implemented and tested offline; issue #7 is NOT complete.** Fresh independent reviews, parent integration checks and a NEW approved successful live engine-to-readable-proposal demonstration remain required. Installing code or approving this policy is NOT permission for a live job. Coverage never dispatches research.

Raw local MCP clients are trusted local software, not authenticated conversational consent. Before dispatch, the host/operator must have explicit authorization for the exact scoped task, selected references and limits. There is no `approved` flag. Research permission never grants acceptance, commit or push permission. This candidate has only synthetic offline verification, not a new successful live engine-to-proposal demonstration or issue acceptance.

## Setup and dependencies

Node **>=22.19** is required by the pinned Pi SDK. Root dependencies add exactly `@earendil-works/pi-coding-agent@0.84.2` and `typebox@1.3.7`; MCP SDK `1.32.2` and zod `3.25.76` are unchanged. The historical `proofs/sol-runtime/` source and lock remain unchanged and separately runnable. Its six nested Pi lock entries lack SRI; neither lock is a claim of complete transitive integrity pinning.

```sh
npm ci --offline --ignore-scripts --no-audit --no-fund
npm run check
npm test
npm run test:mcp
# Separate unchanged historical proof regression:
(cd proofs/sol-runtime && npm ci --offline --ignore-scripts --no-audit --no-fund && npm test)
```

The existing [stdio roots and Pi connection](import.md) still apply. One writer process per configured work root; absolute existing disjoint archive/work/import roots; no symlinks. No global settings or new provider/router configuration are needed. When separately authorized for real operation, the host supplies `BRAVE_SEARCH_API_KEY` through its environment (or a dependency factory); never paste credentials into tool arguments, reports, examples or project config. Missing/blank keys are refused **before** Pi runtime/auth initialization. Pi resolves configured Codex authentication through its supported `ModelRuntime`; this code does not discover/read key files itself. No live calls are authorized by these setup instructions.

## Trusted Pi host workflow

Load the existing `.pi/extensions/research-acceptance.ts` and installed MCP adapter in a **fresh trusted interactive TUI session** using the [acceptance setup](acceptance.md). Print/JSON/RPC fail closed, including original-request mode. No global config, approval service or new dependencies are needed. Keep provider credentials OUT of `.mcp.json`: the adapter inherits the launching host environment before the allowlisted root/read/search overrides. Supply any separately authorized Brave key only to that launching process, never tool arguments or project files.

Main Pi is explicitly entrusted to interpret the **whole actually delivered current role:user request**, including user messages delivered by trusted extensions. This is not physical-human authentication or a natural-language classifier. `message_start` anchors the full text and delivery generation privately; a tool/source quote, keyword, retrieved instruction, catalogue miss, score or `approved:true` supplies neither authority nor provenance. Main Pi must choose ask/deny for ambiguous, quoted, negated, archive-only or read-only requests. Tests script these semantic judgments; they do not establish live-LLM intent accuracy.

```js
research_request({
  server: "research_import",
  request: {mode: "new", question: "What does web accessibility enable?",
    scope: "W3C guidance; compare inclusive access with exclusion and state limits."},
  source: "CURRENT_REQUEST",
  rationale: "The whole delivered user request explicitly commissions this exact one scoped new investigation with default finite limits and no selected archive references."
})
// Or source: "ASK_CONFIRMATION" when authorization/scope is unclear.
// Then call normal mcp with the returned model-visible .mcp object UNCHANGED.
```

The source enum/rationale is an entrusted main-Pi **policy decision, not an independent consent credential**. The helper strictly normalizes the same request as the backend, resolves every default/ceiling, and keeps a cloned/frozen receipt privately. `ASK_CONFIRMATION` displays the exact question/scope/mode/language/reference revisions and byte selectors, model/provider/effort, limits and local target/roots, and genuinely waits for TUI confirmation. Deny/cancel/no UI produces no receipt or dispatch. `CURRENT_REQUEST` avoids a redundant dialog only when the whole current request explicitly commissions that precise job. Neither whole captured user text nor rationale is returned by the helper, stored in session receipts, or added to job context (ordinary Pi tool-call history still contains its submitted arguments).

Preparation does not start work. The helper returns a compact ordinary `{server,tool,args}` MCP call. The installed adapter resolves **emitted prefixed tool names**, even when `server` is given; the helper follows its configured `server|none|short|mcp` naming. Default example: `research_import_start_research`. There is no private adapter dispatch. One existing synchronous approval listener claims every `originalToolName=start_research` across aliases/proxy/direct/script, regardless of `approveTools`. It atomically consumes the one receipt before async target checks, then rechecks actual arguments, target fingerprint, roots, delivery and cancellation before `allow_once`. No session-wide grant, retry/refund after busy/failure or second current-request grant after consumption. A new **actual scoped TUI confirmation** can separately permit another attempt, including in the same delivery generation; a denial cannot be relabelled as original-request consent.

New **delivered** user input invalidates pending receipts; queued input alone and ordinary assistant/tool messages do not. Session replacement/shutdown/tree/compaction clear captured authority and fail closed until a new user delivery, rather than reconstructing permission from history or compaction summaries. Research preparation/dispatch and active publication cannot overlap; a pending research receipt also blocks `/research-publish`. Research consent never authorizes acceptance/Git, and publication Ctrl+Y is never research consent.

Targets retain the existing conservative `.mcp.json` allowlist: this checkout's exact absolute `src/stdio.js`, `node`/this executable, absolute existing disjoint non-symlink roots, and only root/read/search env keys. Fingerprints bind safe configuration, resolved limits and filesystem identities, **never inherited credential values**. Revalidation is not an OS sandbox against same-user path races. The adapter broker supplies no runtime transport attestation: deliberately different programmatically injected config or malicious trusted extensions remain outside this gate's authentication claim. Its session-approval cache precedes broker events: start a fresh setup without approvals cached before the gate loaded; never use an earlier session-wide approval as this workflow. Raw local MCP remains trusted software.

An explicit standalone new-job request needs **no coverage-assessment prerequisite**, even if a separate lookup failed. Coverage itself stays read-only: covered -> reuse; partial -> offer targeted improvement (#9 unimplemented, rejected, never widened to new research); no useful match -> offer new research/import, then only scoped permission -> helper -> normal MCP. `lookup_error` stops the automatic decision, not a separately explicit standalone commission. Existing optional Jev payload permission/local fallback is unchanged.

## Interface

```js
createResearch({ archive, workRoot, createDependencies?, createSession? })
// start(request) -> compact initial status, synchronously reserves one active slot
// get({jobId}) -> compact snapshot
// shutdown() -> abort owned runtime; no restart/resume
```

`archive` is the same archive instance used by the MCP server; `workRoot` is its configured local work root. `createDependencies({signal})` is the actual external seam, returning `{modelRuntime, adapter}`; the default uses the concrete Brave adapter and supported Pi runtime. `createSession` is only the small scripted/late-SDK-creation test seam, not a provider extension mechanism. Production has no fixture environment switches.

The strict request is:

```json
{
  "mode": "new",
  "question": "What does web accessibility enable?",
  "scope": "W3C guidance; compare inclusive access with exclusion and state limits.",
  "language": "en",
  "references": [],
  "limits": {}
}
```

Question <=300 characters; scope <=400; meaningful well-formed text. Language defaults to `en`; references and limits default empty. Unknown fields, consent booleans, conversation/context payloads, improvement/gap/recheck modes, duplicate reference IDs and invalid limits are rejected, not reinterpreted as new research. Improvement composition is issue #9.

Up to three references have exactly `{reportId, expectedRevision, selection:{startByte,endByte}}`. They select accepted reports only, by exact revision and UTF-8 byte range. The engine resolves the selection, exact required warning chunks and citation definitions **inside the deadline, before dependency/auth/model initialization**. Unknown/unavailable/stale context or a selection/context that cannot fit yields `incomplete/reference_context_unavailable` before paid work. Serialized reference context shares the same aggregate 10,000-byte content budget as tool results. Referenced reports are dated, not refreshed or freshly verified; there is no old-source refresh operation. Generated proposals deterministically retain each selected R#'s exact gathered warnings, correction notices, successor identity, dates/scope and citation context in a labelled inert JSON appendix. Per-reference metadata warnings and the reader's required warning-context continuations keep those qualifications visible even on narrow findings reads; the source's successor does not become the new report's own successor.

For MCP, submit that object to `start_research`, poll `get_research_job` with only `{jobId}`, and use a completed status's `outputs.proposal` unchanged with `read_research`. MCP parsing deliberately defers the strict research validation to the module so malformed fields cannot produce growing/credential-bearing SDK diagnostics. Errors use fixed codes (`invalid_input`, `research_busy`, `research_shutdown`, `not_found`, or `research_unavailable`). No call stays open for the whole investigation and busy never queues.

## Status and local retention

Status is allowlisted and **<=4 KiB including model-visible MCP text**, not only structured data. It contains:

- A distinct `job-*` identity; status `running|completed|incomplete|failed|cancelled` and fixed phase/reason enums.
- Start/end timestamps, resolved finite limits, attempt/content counters and available numeric usage totals (not invented costs).
- Requested `openai-codex/gpt-6.1-sol/max`; `actualModel: null` until the effective runtime configuration has been checked. This records observable configuration, not proof of a provider's internal execution.
- Fixed first-tool-failure diagnostics and safe local record/evidence/proposal references, never question text, sources, transcript, thinking, search hits, raw errors, stack traces or credentials.

Only `incomplete/invalid_report` adds optional `reportFailure: {stage, code, field}` to status and the terminal record. It describes the first rejection in unchanged validation order, not a model-generated diagnosis:

| Stage | Fixed code(s) |
|---|---|
| `json` | `invalid_json` |
| `schema` (first issue only) | `type`, `enum`, `format`, `too_small`, `too_big`, `unknown_fields`, `prose_constraint`, `text_constraint`, `reference_constraint`, `other` |
| `citations` | `unknown_citation` |
| `evidence` | `missing_inspected_evidence` |
| `quote` | `quote_mismatch` |

Schema field buckets are fixed: `report`, `title`, `summary`, `findings`, `finding`, `finding_text`, `finding_kind`, `finding_sources`, `finding_source`, `finding_quote`, `finding_quote_source`, `finding_quote_text`, `comparison`, `comparison_text`, `comparison_sources`, `comparison_source`, `limitations`, `limitation`, `gaps`, `gap`; unknown paths become `other`. Non-schema stages use `report`, `claim_sources`, `findings` or `finding_quote` respectively. Prose/text constraints group existing text validity/refinement checks; they do not identify rejected wording. Reference constraints cover the existing uniqueness check. Unexpected schema exceptions use `schema/other/other`.

Diagnostics contain only these developer-owned enums: no supplied names/indices/values, Zod messages/issues/paths, candidate JSON, final model text or errors are retained. Snapshots are copied/frozen; the existing 3,800-byte JSON and 4 KiB model-visible MCP guards remain strict. Valid jobs and other failure reasons omit the field. Rejection still produces no proposal, acceptance, Git action or source refresh; independent source evidence is retained as before. These synthetic diagnostic regressions do **not** establish the historical live rejection cause, which remains unknown without retained final text. No retry or new live permission is implied.

One active job and at most **64** retained status records in memory. Old terminal records remain on disk but are not automatically loaded/resumed; an evicted/previous-process ID returns `not_found`. There is no automatic deletion or retry. Disk retention grows with explicitly launched jobs and requires operator review; there is no durable scheduler. Shutdown cancels active runtime work. Complete cancellation controls, restart/interrupted-record discovery and partial-artifact recovery are issue #8, not claimed here.

`RESEARCH_WORK_ROOT/jobs/<jobId>.json` holds the compact terminal record; `<jobId>.sources.json` holds only bounded independently fetched passages, hashes, visible-text character offsets/continuation flags, actual access times and explicitly selected dated archive evidence/required context. `<jobId>.plan.json` records the first public evidence plan before search; no Brave query/result body/title/snippet, SDK session/transcript or hidden reasoning is persisted. Independent source evidence retains its own rights; local retention is not permission to publish it. Evidence and terminal records use exclusive, mode-0600 regular-file writes under checked non-symlink directories. Failures are reported as retention unavailable; incomplete final files are never retried/overwritten automatically. Terminal flushing uses only the remaining wall budget (one best-effort timer tick after expiry); an uncooperative filesystem cannot hold the active slot/shutdown indefinitely. Basic flushes are best effort on controlled shutdown, not crash-proof recovery. Already issued filesystem/provider operations may settle after abort; no subsequent proposal publication step is started after its signal is aborted. Same-user path-replacement races are not a portable OS sandbox guarantee.

## Investigation and hard limits

No fallback: exact provider/model/API (`openai-codex-responses`), approved Codex base route, supported `max` mapping, auth route **on every request**, effective effort and effective two-tool allowlist are checked. Settings and session are in memory; the explicit empty resource loader discovers no extensions, skills, prompts, AGENTS context or ambient tools. Session cwd/agentDir are explicitly `/`, not the caller's private project. No shell, files, Git, acceptance, publication or recursive research tools are exposed.

| Limit | Default / maximum |
|---|---:|
| Wall clock, including setup, references, model/tool work and proposal persistence | 180,000 ms |
| Model request attempts | 5 |
| Tool attempts, including SDK prevalidation failures | 4 |
| Per-tool timeout | 12,000 ms |
| Aggregate UTF-8 reference/tool-result content | 10,000 bytes |
| Per-model-response streamed text/thinking/tool arguments | 1,500 characters |
| Search hits | 3 |
| Complete search response | strictly below 65,536 bytes |
| Direct-source response prefix | 65,536 bytes |
| Inspected source passage | 2,400 characters |

Per-job overrides may only tighten these ceilings. Bounds are enforced independently of model cooperation; hitting a bound produces `incomplete`, without an extra polishing call. SDK/application/provider retries and compaction/context-overflow recovery are disabled. Every length-truncated assistant response, including a tool-bearing turn, immediately halts as `incomplete/model_output_truncated` before further model/source dispatch; a later completion cannot replace that outcome. A failed direct-source operation ends investigation instead of retrying another source automatically. Already incurred usage cannot be undone; cooperative abort cannot guarantee instantaneous upstream cancellation. The Codex serializer does **not** implement a numerical remote token ceiling from `model.maxTokens`; no remote token/dollar cap is claimed.

Only `research_search` and `research_fetch` exist. The first search requires a short public subquestion/evidence `plan`; no extra planning call/tool. The investigator is prompted to prefer primary sources where appropriate, inspect core evidence, compare alternatives/applicability, distinguish evidence from inference, and expose limitations/gaps. Tool and request attempts are counted before validation; streamed arguments and output, UTF-8 content, setup/auth waits, late sessions and terminal snapshots retain the proven guard behavior. Failure classification uses native error/data-descriptor checks and fixed enum whitelists, not arbitrary error getters, proxy traps, messages or causes.

## Concrete search/source policy

Brave uses only fixed GET `https://api.search.brave.com/res/v1/web/search`; only that request receives `X-Subscription-Token`. Complete bounded 200/JSON/schema validation, manual redirect refusal, no cookies, fallback or application retries. Queries must fit both 180 characters and 75 whitespace-delimited words before any search request. Documented `web: null` means no web results; `description: null` becomes an empty transient snippet. Missing required fields and other non-string URL/title/description values remain invalid; a non-null web object requires a results array. Brave leads are transient. Known host-token reflection is refused in decoded JSON result URLs/titles/snippets and in the actual extracted/decoded source title and text before clipping or model/evidence output, not merely screened in raw bodies. This covers transformations the adapter itself applies, not arbitrary covert encodings. A source URL must be an **exact canonical member of successful search results**, both at the investigator and adapter; a prompt/model URL cannot bypass this.

Sources use narrow canonical public HTTPS: no userinfo, query, fragment, nondefault port, normalization aliases or internal/special-use literals/hostnames. Before connecting, Node DNS resolves all answers and refuses private, special-use, mapped/local IPv4/IPv6 or mixed public/private answers. HTTPS lookup is pinned to one validated public address; TLS verifies the original hostname. No ambient agent, connection pool, proxy, source authorization, cookies, referrer or redirect following. DNS/connect/body waits are abort-bound; no alternate-address retries. Only uncompressed UTF-8 text/plain or conservatively recognized text/html is accepted. Status/media refusal cancels/destroys the unread body. Linear HTML token scanning strips script/inert markup and obvious hidden elements, not a browser's computed CSS; ambiguous/malformed pages may be refused. No WAF/browser workaround. `contains` must be an exact, case-sensitive substring of whitespace-normalized visible text; the selector itself is not normalized. `offset` uses JavaScript string/UTF-16 positions in that cleaned text, not raw response bytes or Brave search-result pages. For passage browsing, start at offset 0 then use the returned `nextOffset`, rather than guessing selectors from search snippets. Selection only sees the bounded source prefix: an absent substring or beyond-text offset fails without silently falling back, retrying or returning unrelated text. This guidance clarifies the contract and helps prevent selection mistakes; it does not establish the cause of the prior live failure. Raw truncation and passage continuation are explicit; response-prefix hashes are not mislabelled full-document hashes.

## Completion, provenance and review

The final model response is small strict JSON: title, summary, evidence/inference findings with known source IDs, a cited comparison/applicability field, limitations and gaps. Quotes must be explicit fields and literal substrings of inspected/selected passages. Unknown/uncited sources, unsupported quotes, source URL/access-date/citation metadata supplied through extra output fields, missing required structure or an over-limit response cannot create a finished proposal. At least one core evidence finding must use an independently inspected direct source, not a search snippet or archive bibliography. There is no arbitrary source-count minimum or forced final-polish call.

The engine renders Markdown/citation definitions deterministically from checked fields and its independent ledger. Model-generated text is still untrusted: **structural validation is not semantic coherence/fidelity/truth certification**. Human review must check scope coverage, substantive claim support, comparisons, caveats and rights; a model saying done or a bibliography alone is insufficient.

`archive.createResearchProposal` is host-internal, never a researcher/MCP import tool. It shares the archive's metadata validation, credential screening, digest/duplicate/conflict checks, serialization, exclusive publication, read/pagination and acceptance/catalogue formats. Origin is `engine_generated`, with the checked `openai-codex/gpt-6.1-sol/max` / Pi SDK attribution and unknown human author (warning), `imported_at: null`, actual job execution research date and `last_improved_at: null`. HTTP success is not claim verification. Cross-origin or already-stored duplicate bodies are explicit conflicts; imported provenance is never reassigned to a job. Public import stays strictly `imported` with its previous timestamp behavior.

Only successful report validation **and** local proposal persistence yield `completed`. A proposal is not accepted/published and the engine performs no Git action. Existing [reading](reading.md), [acceptance](acceptance.md) and [publication](publication.md) review boundaries remain unchanged.

## Verification still pending

Offline suites use original synthetic evidence, real Pi SDK sessions/scripted transport, actual installed adapter and production MCP stdio with HTTP/DNS/TLS tripwires. Run `node --check src/research-host.js`, the root/MCP/historical suites above, the three existing `tests/pi-{host,coverage,publication}-probe.mjs` probes and `tests/pi-research-host-probe.mjs` with `PI_SDK_ROOT`, `PI_ADAPTER_INDEX`, `PI_OFFLINE=1 PI_SKIP_VERSION_CHECK=1 PI_TELEMETRY=0`. The new probe injects synthetic runtime/HTTP/DNS ONLY through a test Node preload before production stdio, never a production fixture flag or real/default auth initializer. It counts incoming start packets before dispatch, tests the helper/normal-MCP visible path and single-use broker paths, and reads a generated local proposal. Semantic decisions and TUI answers are scripted, not live-provider/source/auth, real-human or live-LLM accuracy verification. Fresh independent simplification/correctness/privacy reviews, parent checks and a **newly approved successful live engine-to-readable-proposal demonstration** remain required before issue #7 closes. All prior live permissions are consumed. No live permission is implied by tests or setup; after full #7 acceptance the parent must PAUSE, not start #8–#11.
