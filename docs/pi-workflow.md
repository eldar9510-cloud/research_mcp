# Automatic archive coverage in Pi (issue #6)

The trusted project-local `.pi/extensions/research-coverage.ts` registers
`research_coverage` and its **automatic workflow guideline** with Pi's supported
extension loader. Main Pi reasoning decides whether the request is a substantial
investigation, comparison, or research-driven recommendation and follows that
guideline **before investigating**. This is not a keyword classifier, universal
message interceptor, sandbox, or separate model/research run. The authoritative
agent instructions are `COVERAGE_GUIDELINES` in `src/coverage.js`.

Examples that trigger: comparing irrigation approaches for a scoped orchard;
investigating extraction alternatives; recommending an approach from research.
Greetings, simple facts/arithmetic, renaming a variable, routine bug fixes and
unrelated shell commands do not trigger. A coding request that actually requires
a substantial research comparison does trigger. Tests script these judgments;
they do not prove a live model's semantic trigger accuracy.

## Setup

Use the existing [local acceptance setup](acceptance.md) and its three exported,
existing, absolute, disjoint roots. Inspect/trust the local extensions and open a
fresh Pi session. Do not reuse adapter session approvals cached before the gates loaded. No global instruction/config changes, new
credential, service, indexer or package is needed. The installed MCP adapter
continues to handle import and approved acceptance. Coverage uses the **same
archive module and bounded read/search presentation** directly, not a private
extension-to-MCP call. Roots must describe the archive you intend to consult.
Existing acceptance/publication gates are unchanged.

The existing archive needs a valid catalogue. A missing index is a lookup error,
even for an empty directory. Inspect first, then explicitly request
`rebuild_catalogue` if appropriate; this workflow never rebuilds silently.

## Read-only decision contract

`research_coverage` is sequential and request/session/branch-local. A delivered
user message resets the assessment, shortlist, read cursors, ranking and payload
permission, including steering/follow-up requests (which bypass
`before_agent_start`). Queueing alone does not interrupt the active tool sequence;
assistant/tool messages do not reset it. This lifecycle boundary does not classify
or intercept request semantics. Its actions:

1. `lookup {purpose,question,query}`: semantic purpose is `investigation`,
   `comparison` or `research_recommendation`; the question includes scope and
   constraints. Other documented purposes return `skipped` without lookup.
   Returns the existing local catalogue result, **not a coverage verdict**.
2. Optional `reformulate {query,reason}`: one distinct query, after a reasoned
   miss. At most two queries, five candidates each (ten unique candidates total).
   No catalogue pagination or whole-archive model input.
3. Optional `rerank {ids,reason}` for ambiguous relevance; see below.
4. `read {read:<arguments>}`: selected candidate `reportId`, exact
   `expectedRevision`, optional byte `selection`/`pageBytes`. It returns the
   existing exact-revision page, full metadata, warnings, citations and
   continuation unchanged. Call again with **the whole continuation** inside
   `read`, not reconstructed offsets. Pass an issued `warningContext.read` or
   citation `read` object unchanged too; warning cursors are accepted only when
   issued in the current assessment, not fabricated or inherited across requests.
   These reads still consume the three-report/six-selection/twelve-page budgets.
5. `decide {outcome,reason,usefulIds,gaps}`: main Pi supplies its applicability
   reasoning, useful report IDs and explicit gaps. A shared topic or ranking is
   not evidence of coverage. The helper checks that claimed useful evidence was
   actually returned through this workflow; it cannot certify the reasoning.

```js
research_coverage({action: "lookup", purpose: "comparison",
  question: "Which sandy-orchard watering cadence fits the original small-orchard scope?",
  query: "sandy orchard watering cycles"})
research_coverage({action: "read", read: {
  reportId: "<candidate.id>", expectedRevision: "<candidate.revision>"}})
// Next: read: <entire page.continuation>, unchanged, until null.
research_coverage({action: "decide", outcome: "partial",
  usefulIds: ["<candidate.id>"], reason: "Explain applicability and scope mismatch.",
  gaps: ["The report did not investigate clay soils or verify sources today."]})
```

| Outcome | Response / authority |
| --- | --- |
| `covered` | Reuse selected dated findings, report ID/revision, citations and caveats. No automatic investigation, improvement or source refresh. |
| `partial` | Explain reusable material, gaps and uncertainty; offer targeted improvement. #9 is unimplemented: reject it, never broaden into a new job. |
| `no_useful_match` | Say this bounded lookup found no useful match, not that relevant work cannot exist. Offer new research or import; only scoped user permission -> `research_request` -> returned normal MCP call. |
| `lookup_error` | Missing/invalid/stale catalogue, failed I/O, changed revision or irreducible oversized result: **STOP the automatic research decision**. Not an empty archive or research trigger. |

A covered claim without selected body evidence, or with gaps, unresolved required
citations or incomplete reads is conservatively returned as `partial`. Exhausted
reading is uncertainty, not proof of coverage or absence. If `contextOutstanding`
is true, the helper **never claims that context is fully read**, even when a
stateless warning sequence has ended; covered/no-match claims become uncertain
`partial`. This conservative v0 limitation can require a narrower follow-up.
`continuation:null` finishes only that selection; it is not verification or a
human-read receipt. See [reading.md](reading.md) for every continuation field and
the deliberately limited Markdown warning/citation recognizer. Arbitrary prose,
languages and citation styles are not semantically audited.

Every visible result stays within 48 KiB via the existing responder. No warnings
are cut to fit. Final decisions reference previously returned exact-revision
pages, not another copy of whole report bodies. Main Pi must preserve the pages'
scope, original/improvement/import dates (including unknowns), correction text,
successors, citations and imported warnings in its answer. An archive-update or
import date is not a verification date.

## Optional existing Jev, never a dependency

Only an ambiguous bounded local shortlist is eligible. `rerank` constructs text
from an explicit allowlist: report ID, title, question, scope and summary. Each
candidate is at most **800 UTF-8 bytes**; oversized candidates are omitted whole
with an explanation, never silently clipped. No bodies, drafts, paths, raw
conversations or credentials are included. Acceptance alone is **not** permission
to send this metadata or the query to TypeSafe.

An interactive Pi host shows the exact query/metadata and asks permission for
that recipient. Missing UI/adapter or denied permission returns a disclosed
local-only fallback. The permission prepares, but does not dispatch, this ordinary
existing host tool call:

```js
mcp({server: "jev", tool: "jev_jev_rerank",
  args: {query: "<same query>", candidates: [{id: "<bounded revision token>", text: "<permitted metadata>"}]}})
```

Main Pi calls the returned object unchanged, only if useful and permitted. The
extension makes no MCP calls, installs no integration, activates no disabled
server and performs no automatic retry. One optional attempt per query is allowed.
Unconfigured, disabled, failed, guarded/spilled or unsupported Jev results keep
local retrieval usable and disclosed. No `jev_lookup` replacement for archive
search is required.

The passive observer supports the installed normal adapter result contract:
`details {mode:"call",server:"jev",tool:"jev_rerank",mcpResult:{content:[{type:"text",text:<JSON>}]}}`.
That JSON has `tool/provider/model/query/summary/ranked/usage`, optional `status:"ok"`,
full unique candidate membership, exact text, sequential ranks and descending
finite relevance probabilities in [0,1]. Raw results over 16 KiB, incomplete/top-k,
rendered previews, foreign events and spill paths are not ranking evidence. This
contract was checked against installed `pi-jev-retrieval/README.md` and its
`core.mjs` parser; there is no runtime dependency on those files. Ranking neither
certifies claims nor discards candidates or grants permission.

## Research and trust

Coverage remains **read-only**: it never dispatches research, fetches sources,
improves reports, accepts or publishes. The separate [research host gate](research.md)
prepares one explicitly scoped investigation through `research_request`, then
main Pi uses its unchanged ordinary MCP call. Original explicit authorization is
interpreted from the WHOLE delivered user request; when unclear the helper asks
and waits for exact TUI confirmation. This trusted semantic workflow includes
trusted extension-delivered user messages, not source/tool text or model booleans.
An explicit standalone new-job request needs **no coverage prerequisite**. A lookup
error stops the automatic decision, not a separately explicit standalone request.
Research permission is not publication approval. The host path is tested offline;
#7 still requires fresh reviews, parent checks and a newly approved successful live proof.
Imported/retrieved instructions remain untrusted data, including instructions to
reveal secrets or publish unrelated files. The workflow is not authentication
against arbitrary local programs or ordinary Pi shell/file tools.

## Reproduction and evidence limits

```sh
npm run check
npm test
npm run test:mcp
PI_SDK_ROOT=/absolute/installed/@earendil-works/pi-coding-agent \
PI_ADAPTER_INDEX=/absolute/installed/pi-mcp-adapter/index.ts \
PI_OFFLINE=1 PI_TELEMETRY=0 node tests/pi-coverage-probe.mjs
```

The new probe loads the **actual installed SDK, adapter and project extensions**,
imports and approves synthetic local reports in one session, closes it, then
rediscovers and reads them in fresh sessions through visible text only. It checks
multi-page revision-bound reuse, installed selector rendering, normal MCP
unconfigured-Jev fallback and stop-on-catalogue-error. Main-Pi decisions and TUI
consent are controlled test inputs, not a live LLM or real-human demonstration.
The installed agent loop also delivers scripted normal, steering and follow-up
user requests, verifying request resets, fresh payload consent, rejection of old
read pointers and preservation of ordinary assistant/tool sequences. Its stream
boundary is synthetic: no live model or authentication is used. Raw lookup-issued
warning pointers are exercised unchanged, retaining exact notices and citations.
No live Jev/model/provider/web call is made. Run the existing
`tests/pi-host-probe.mjs` and `tests/pi-publication-probe.mjs` too; they retain
approval/publication regression coverage. Parent review, any authorized live Jev
judgment and interactive semantic-trigger evaluation remain separate.
