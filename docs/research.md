# Standalone research — bounded jobs, cancellation and local recovery

`start_research` and `get_research_job` manage a separate bounded Pi SDK investigator and produce local unaccepted proposals. `cancel_research` stops active work; `read_research_artifact` inspects bounded, revision-bound local partial material without launching research. **The trusted Pi TUI research gate and read-only coverage handoff are implemented and offline-tested; a separately authorized scoped live production-MCP investigation produced a sourced, readable local proposal on 2026-11-01.** The live proof does not establish live TUI intent accuracy or arbitrary-web reliability; see [Verification](#verification). Installing code or approving this policy is NOT permission for a live job. Coverage never dispatches research.

Raw local MCP clients are trusted local software, not authenticated conversational consent. Before dispatch, the host/operator must have explicit authorization for the exact scoped task, selected references and limits. There is no `approved` flag. Research permission never grants acceptance, commit or push permission. Formal issue acceptance follows parent integration checks and the GitHub tracker, not this document.

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
// await get({jobId}) -> compact snapshot; safely discovers older disk records
// await cancel({jobId}) -> terminal snapshot (user_stop); no retry permission
// await readArtifact({jobId,artifact,expectedRevision?,selection?,offset?}) -> bounded page
// await shutdown() -> abort owned runtime as interrupted/shutdown; no restart/resume
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
  "partials": [],
  "limits": {}
}
```

Question <=300 characters; scope <=400; meaningful well-formed text. Language defaults to `en`; references and limits default empty. Unknown fields, consent booleans, conversation/context payloads, improvement/gap/recheck modes, duplicate reference IDs and invalid limits are rejected, not reinterpreted as new research. Improvement composition is issue #9.

Up to three references have exactly `{reportId, expectedRevision, selection:{startByte,endByte}}`. They select accepted reports only, by exact revision and UTF-8 byte range. The engine resolves the selection, exact required warning chunks and citation definitions **inside the deadline, before dependency/auth/model initialization**. Unknown/unavailable/stale context or a selection/context that cannot fit yields `incomplete/reference_context_unavailable` before paid work. Serialized reference context shares the same aggregate 10,000-byte content budget as tool results. Referenced reports are dated, not refreshed or freshly verified; there is no old-source refresh operation. Generated proposals deterministically retain each selected R#'s exact gathered warnings, correction notices, successor identity, dates/scope and citation context in a labelled inert JSON appendix. Per-reference metadata warnings and the reader's required warning-context continuations keep those qualifications visible even on narrow findings reads; the source's successor does not become the new report's own successor.

Up to three `partials` select available prior local material by exactly `{jobId, artifact, expectedRevision, selection:{startByte,endByte}}`. Use the digest/total byte length from `read_research_artifact`; ranges address UTF-8 bytes of the stored JSON envelope, not JavaScript character indexes. A request must explicitly commission the selected material AND the new question/scope/limits. The normal `research_request` helper reviews these selectors and revalidates the actual material before/after confirmation and before ordinary MCP dispatch. Changed/missing material invalidates permission; consumed consent is never refunded. The backend validates again before dependencies/auth/model work.

Continuation always allocates a **new job ID** under the same ordinary one-use authorization flow. No SDK history, credentials, agent state or automatic retry is restored. The researcher receives only the selected bytes plus exact inherited qualifications, parent identity, material digest/range/selected digest and original job date. P# labels denote prior incomplete material, **not freshly inspected evidence**; they cannot alone satisfy the independent core-source requirement. Inherited accepted-report warnings/corrections/successors/citations and dates are preserved even when the selected range omits them. Selected partial context shares the existing aggregate 10,000-byte reference/tool budget, not an extra allowance. A material/context that cannot fit fails before paid setup. Read/cancel/get and source instructions grant no continuation authorization or source-refresh permission.

For MCP, submit that object to `start_research`, poll `get_research_job` with only `{jobId}`, and use a completed status's `outputs.proposal` unchanged with `read_research`. MCP parsing deliberately defers the strict research validation to the module so malformed fields cannot produce growing/credential-bearing SDK diagnostics. Errors use fixed codes (`invalid_input`, `research_busy`, `research_shutdown`, `not_found`, `artifact_unavailable`, `artifact_unsupported`, `revision_conflict`, or `research_unavailable`). No call stays open for the whole investigation and busy never queues.

## Status and local retention

Status is allowlisted and **<=4 KiB including model-visible MCP text**, not only structured data. It contains:

- A distinct `job-*` identity; status `running|completed|incomplete|failed|cancelled|interrupted` and fixed phase/reason enums.
- Start/end timestamps, resolved finite limits, attempt/content counters and available numeric usage totals (not invented costs). Recovered orphan `startedAt` is taken from consistent validated surviving provenance; it is `null` when unknown or conflicting, never an invented epoch/current date. Conflicts use `survivor_invalid`; newly launched jobs still require their real start timestamp.
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

One active job and at most **64 cached statuses**; older records are inspected from disk on demand. There is no automatic deletion, retry or durable scheduler. Disk retention grows with explicitly launched jobs and requires operator review.

### Cancellation and recovery procedure

1. Call `cancel_research({jobId})` for an explicit user stop. The outcome is `cancelled/user_stop`, not a finished proposal. Terminal jobs remain unchanged. Abort guards prevent new setup/auth/model/tool/proposal steps promptly; an already in-flight upstream request may continue and incurred usage is **not refunded**.
2. Controlled SIGINT/SIGTERM/transport shutdown requests abort and preserves available work as `interrupted/shutdown`, distinct from a human stop. Abrupt process loss can lose unflushed output. On startup, abandoned running records become `interrupted/abandoned_runtime`; no model, auth initializer, source refresh, acceptance or Git operation is started by recovery.
3. Poll `get_research_job` for compact surviving references. Read one explicitly named material using `read_research_artifact({jobId,artifact})`; pass the complete continuation unchanged. Every page identifies its revision, date and untrusted incomplete status. An explicit selection or nonzero continuation offset requires `expectedRevision`. `qualificationRead` points to the complete same-revision envelope: all inherited qualification context must be read before relying on a narrow selection. Pages stay within the existing 3,800-byte JSON / 4 KiB visible MCP bounds.
4. Missing/truncated/oversized/symlink/nonregular/unexpected records never prove completion. Recovery returns fixed `survivor_invalid`/retention indicators, preserves original bytes and independent valid material, and never overwrites malformed survivors. A completed record also requires its matching reviewable generated proposal. Known-live sibling ownership is conservatively refused (`research_busy`), including PID reuse/permission uncertainty; **one writer per work root remains the supported setup**. Stop/inspect the known writer before recovery; do not delete records to manufacture success.
5. If continuation is desired, explicitly select available material/revisions/ranges and commission a **new** scoped request through `research_request` then normal MCP. There is no resume, restore, refresh or publication action hidden in inspection.

### Local artifact format

All files remain under `RESEARCH_WORK_ROOT/jobs/`, outside the accepted catalogue/publication file set. New files are exclusive mode 0600 under checked no-symlink directories (new jobs directories: 0700); bounded regular-file reads refuse symlinks, FIFOs and oversized/changing files. Immutable files are never silently replaced:

- `<jobId>.request.json`: scoped normalized request, durably flushed before paid setup.
- `<jobId>.running.json`: version 1 initial status and local process/instance ownership, before paid work.
- `<jobId>.state-N.json`: incremental compact public progress/counters, not SDK messages. Terminal `<jobId>.json` takes precedence over every earlier checkpoint.
- `<jobId>.references.json`: exact explicitly selected reference/partial qualification context, before auth/model setup.
- `<jobId>.plan.json`: first public subquestion/evidence plan, before external search. This is public planning, not hidden reasoning or an extra model call.
- `<jobId>.source-1.json` through `source-4.json`: each independent bounded inspected passage is flushed **before** the next model turn. `<jobId>.sources.json` collects the available independent ledger at completion/termination.
- `<jobId>.output.json`: only structurally validated, deterministically rendered report output when actually available, even if later proposal persistence fails. Missing output remains unavailable; no rejected candidate, streaming text/thinking or transcript is retained.

The finite material names are `request`, `references`, `plan`, `source-1`..`source-4`, `evidence` (sources file) and `output`. Their version-1 JSON envelope is `{version:1,jobId,startedAt,qualifications:{references,partials},data}`. SHA-256 identifies **all exact stored UTF-8 bytes**, including the final newline and qualifications; selections do not suppress required qualifications. Old #7 compact terminal records are supported where valid; old unenveloped plan/source files are preserved but the revision-bound reader returns `artifact_unsupported` rather than inventing missing immutable provenance. They remain human-readable locally.

No Brave query/result body/title/snippet, private conversation/rationale, rejected model response, raw provider error, SDK session/transcript or hidden reasoning is added to artifacts. Generic secret screening is not an absence-of-secrets guarantee. Independently inspected source material retains its own rights; local retention is not permission to publish it. The terminal outcome is settled before asynchronous checkpoint/evidence flushing; cancellation/shutdown cannot relabel an ended failure or persisted proposal. A stop can cut a stalled checkpoint wait, with unavailable retention reported honestly. Terminal receipt/evidence flushing uses only the remaining wall budget (one best-effort timer tick after expiry). Already issued OS/provider operations may settle after abort, but cannot replace immutable terminal snapshots or schedule another research step. Recovery is best effort, not crash-proof storage or a same-user OS sandbox.

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

## Verification

Parent-verified evidence on **2026-11-01** applies to implementation candidate `b4825e288cb79ecbd4ab2c8b421ca8bddb90d0fc`: both independent implementation reviews cleared it, and **238 root tests, 16 MCP tests, 109 historical proof tests and four isolated actual Pi SDK/adapter host probes passed, with zero skips**. All implementation/review workers were terminal before the live run. These are candidate results, not a claim that the subsequent documentation closeout or integration checks have already passed.

Offline suites use original synthetic evidence, real Pi SDK sessions/scripted transport, actual installed adapter and production MCP stdio with HTTP/DNS/TLS tripwires. Run `node --check src/research-host.js`, the root/MCP/historical suites above, the three existing `tests/pi-{host,coverage,publication}-probe.mjs` probes and `tests/pi-research-host-probe.mjs` with `PI_SDK_ROOT`, `PI_ADAPTER_INDEX`, `PI_OFFLINE=1 PI_SKIP_VERSION_CHECK=1 PI_TELEMETRY=0`. The research probe injects synthetic runtime/HTTP/DNS ONLY through a test Node preload before production stdio, never a production fixture flag or real/default auth initializer. It counts incoming start packets before dispatch, tests the helper/normal-MCP visible path and single-use broker paths, and reads a generated local proposal. Semantic decisions and TUI answers are scripted, not live-provider/source/auth, real-human or live-LLM accuracy verification.

The **third separately owner-approved live attempt succeeded**, using an explicitly operator-authorized ordinary MCP client with production stdio, not a live-model TUI gate accuracy test:

- One start packet; job ID returned in 13 ms. Checked runtime configuration was `openai-codex/gpt-6.1-sol/max` through the CodexSSE route.
- Four model requests, three tool calls (one Brave search, two direct-source fetches), 6,066 aggregate UTF-8 tool bytes and about 27.9 seconds including MCP/setup/reads. Usage was 4,134 input + 686 output + 1,536 cache-read = **6,356 total tokens**; this is not a remote token/dollar cap.
- No widened limits, automatic retry, fallback or polishing call. The per-job wall limit was tightened to fit the outer 180-second budget; the ceilings above remained in force. Each attempt required separate authorization.
- Independent source: [RFC 2606](https://www.rfc-editor.org/rfc/rfc2606.html). Two contiguous 2,400-character visible-text passages, `[0,2400)` and `[2400,4800)`, shared raw-prefix SHA-256 `83854f29948eb298aa80bf4c7c162fc0cb49583952055bff128b2e1b5b56946d`, with `rawTruncated:false` and `passageTruncated:true`. This is passage continuation, **not full-page inspection**. The second passage supports the reserved example.com/example.net/example.org names and comparison with .test/.example/.invalid/.localhost uses.
- The 2,446-byte UTF-8 proposal was read through model-visible MCP in two pages, byte-identical to its stored body (SHA-256 `69661e6b69fe13e01c54888270bece3e0706d7c991dd2c0bf70bce0fc6a43c21`). Parent read the full proposal and both stored passages, checked digests/contiguity/citations and supported comparison/limitations, without new HTTP verification or invented freshness.

Proposal provenance was `engine_generated`, Pi SDK and the checked model/effort, with unknown human author. `researched_at: 2026-11-01` records the actual investigation date, not source verification; `imported_at` and `last_improved_at` were null. No raw Brave result, SDK transcript or hidden reasoning was retained. Only local work artifacts were produced; archive/import roots remained unchanged and empty, with no proposal acceptance, report Git action or publication. Source rights and human review requirements remain unchanged.

Earlier attempts ended with `source_passage_not_found` (exact selector/body not retained) and `invalid_report` (exact final response not retained). Their precise causes remain unknown; the third success does not diagnose them. Validator rules were not weakened. This narrow RFC proof does not establish arbitrary-web reliability, full-source inspection, copyright clearance, semantic truth, physical-human authentication, live-model intent/TUI-key accuracy or cancellation/restart recovery (#8). Existing broker-cache and target-attestation trust limits remain unchanged.

Formal #7 acceptance follows independent closeout review, parent integration checks and the GitHub tracker; this document does not close the issue. All prior live permissions are consumed, and no further live permission is granted by this evidence, tests or setup. The owner separately resumed bounded #8 implementation; no new live permission follows. Its cancellation/recovery/continuation evidence is offline and synthetic: `tests/research-lifecycle.test.js`, `tests/research-lifecycle-mcp.test.js`, and the extended actual Pi/adapter research-host probe cover local mechanics and authorization, not upstream cancellation latency, refunds, live semantic intent accuracy or arbitrary-web reliability. Parent review/integration/full checks still govern #8 acceptance; later issues are not automatically authorized.
