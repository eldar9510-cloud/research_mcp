# Standalone research backend — issue #7 stage A (partial)

**Backend candidate, not completed issue #7.** `start_research` and `get_research_job` manage a separate bounded Pi SDK investigator and produce local unaccepted proposals. **The Pi research authorization gate and coverage handoff are still pending stage B and the owner's authorization/trusted-input policy decision. Installing this code is NOT permission to start research.** The existing coverage extension still only offers future research; it does not dispatch this backend. Do not enable conversational research dispatch until that host stage is implemented and independently verified.

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

Up to three references have exactly `{reportId, expectedRevision, selection:{startByte,endByte}}`. They select accepted reports only, by exact revision and UTF-8 byte range. The engine resolves the selection, exact required warning chunks and citation definitions **inside the deadline, before dependency/auth/model initialization**. Unknown/unavailable/stale context or a selection/context that cannot fit yields `incomplete/reference_context_unavailable` before paid work. Serialized reference context shares the same aggregate 10,000-byte content budget as tool results. Referenced reports are dated, not refreshed or freshly verified; there is no old-source refresh operation.

For MCP, submit that object to `start_research`, poll `get_research_job` with only `{jobId}`, and use a completed status's `outputs.proposal` unchanged with `read_research`. MCP parsing deliberately defers the strict research validation to the module so malformed fields cannot produce growing/credential-bearing SDK diagnostics. Errors use fixed codes (`invalid_input`, `research_busy`, `research_shutdown`, `not_found`, or `research_unavailable`). No call stays open for the whole investigation and busy never queues.

## Status and local retention

Status is allowlisted and **<=4 KiB including model-visible MCP text**, not only structured data. It contains:

- A distinct `job-*` identity; status `running|completed|incomplete|failed|cancelled` and fixed phase/reason enums.
- Start/end timestamps, resolved finite limits, attempt/content counters and available numeric usage totals (not invented costs).
- Requested `openai-codex/gpt-6.1-sol/max`; `actualModel: null` until the effective runtime configuration has been checked. This records observable configuration, not proof of a provider's internal execution.
- Fixed first-tool-failure diagnostics and safe local record/evidence/proposal references, never question text, sources, transcript, thinking, search hits, raw errors, stack traces or credentials.

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

Per-job overrides may only tighten these ceilings. Bounds are enforced independently of model cooperation; hitting a bound produces `incomplete`, without an extra polishing call. SDK/application/provider retries and compaction/context-overflow recovery are disabled. A failed direct-source operation ends investigation instead of retrying another source automatically. Already incurred usage cannot be undone; cooperative abort cannot guarantee instantaneous upstream cancellation. The Codex serializer does **not** implement a numerical remote token ceiling from `model.maxTokens`; no remote token/dollar cap is claimed.

Only `research_search` and `research_fetch` exist. The first search requires a short public subquestion/evidence `plan`; no extra planning call/tool. The investigator is prompted to prefer primary sources where appropriate, inspect core evidence, compare alternatives/applicability, distinguish evidence from inference, and expose limitations/gaps. Tool and request attempts are counted before validation; streamed arguments and output, UTF-8 content, setup/auth waits, late sessions and terminal snapshots retain the proven guard behavior. Failure classification uses native error/data-descriptor checks and fixed enum whitelists, not arbitrary error getters, proxy traps, messages or causes.

## Concrete search/source policy

Brave uses only fixed GET `https://api.search.brave.com/res/v1/web/search`; only that request receives `X-Subscription-Token`. Complete bounded 200/JSON/schema validation, manual redirect refusal, no cookies, fallback or application retries. Brave leads are transient. A source URL must be an **exact canonical member of successful search results**, both at the investigator and adapter; a prompt/model URL cannot bypass this.

Sources use narrow canonical public HTTPS: no userinfo, query, fragment, nondefault port, normalization aliases or internal/special-use literals/hostnames. Before connecting, Node DNS resolves all answers and refuses private, special-use, mapped/local IPv4/IPv6 or mixed public/private answers. HTTPS lookup is pinned to one validated public address; TLS verifies the original hostname. No ambient agent, connection pool, proxy, source authorization, cookies, referrer or redirect following. DNS/connect/body waits are abort-bound; no alternate-address retries. Only uncompressed UTF-8 text/plain or conservatively recognized text/html is accepted. Status/media refusal cancels/destroys the unread body. Linear HTML token scanning strips script/inert markup and obvious hidden elements, not a browser's computed CSS; ambiguous/malformed pages may be refused. No WAF/browser workaround. `contains` selects an exact case-sensitive visible-text substring; `offset` uses characters in cleaned visible text, not raw response bytes. Raw truncation and passage continuation are explicit; response-prefix hashes are not mislabelled full-document hashes.

## Completion, provenance and review

The final model response is small strict JSON: title, summary, evidence/inference findings with known source IDs, a cited comparison/applicability field, limitations and gaps. Quotes must be explicit fields and literal substrings of inspected/selected passages. Unknown/uncited sources, unsupported quotes, source URL/access-date/citation metadata supplied through extra output fields, missing required structure or an over-limit response cannot create a finished proposal. At least one core evidence finding must use an independently inspected direct source, not a search snippet or archive bibliography. There is no arbitrary source-count minimum or forced final-polish call.

The engine renders Markdown/citation definitions deterministically from checked fields and its independent ledger. Model-generated text is still untrusted: **structural validation is not semantic coherence/fidelity/truth certification**. Human review must check scope coverage, substantive claim support, comparisons, caveats and rights; a model saying done or a bibliography alone is insufficient.

`archive.createResearchProposal` is host-internal, never a researcher/MCP import tool. It shares the archive's metadata validation, credential screening, digest/duplicate/conflict checks, serialization, exclusive publication, read/pagination and acceptance/catalogue formats. Origin is `engine_generated`, with the checked `openai-codex/gpt-6.1-sol/max` / Pi SDK attribution and unknown human author (warning), `imported_at: null`, actual job execution research date and `last_improved_at: null`. HTTP success is not claim verification. Cross-origin or already-stored duplicate bodies are explicit conflicts; imported provenance is never reassigned to a job. Public import stays strictly `imported` with its previous timestamp behavior.

Only successful report validation **and** local proposal persistence yield `completed`. A proposal is not accepted/published and the engine performs no Git action. Existing [reading](reading.md), [acceptance](acceptance.md) and [publication](publication.md) review boundaries remain unchanged.

## Verification still pending

Offline suites use original synthetic non-RFC evidence, real Pi SDK sessions/scripted transport, real MCP stdio child fixtures and HTTP/DNS/TLS network tripwires. They are not live provider/auth/source verification or a Pi-host research authorization demonstration. The coordinator must arrange independent simplification/correctness/privacy reviews, owner-approved stage B, actual Pi-host/no-model regressions, and a **newly approved successful live engine-to-readable-proposal demonstration** before issue #7 can close. No product live permission is implied or consumed by the synthetic fixtures.
