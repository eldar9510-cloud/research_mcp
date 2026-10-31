# Local acceptance and rediscovery (issue #3)

This is **local and UNPUBLISHED**: acceptance creates `reports/<id>.md` and `INDEX.json` under the configured archive root. It never invokes a model, research job, Git commit or push. No research-job or automatic-reuse workflow exists in this slice. Do not accept real or private material during fixture testing.

## Setup and supported Pi workflow

Node >=22, npm and the installed Pi MCP adapter are required. From this repository:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run check
npm test
npm run test:mcp
PI_SDK_ROOT=/absolute/path/to/installed/@earendil-works/pi-coding-agent \
PI_ADAPTER_INDEX=/absolute/path/to/installed/pi-mcp-adapter/index.ts \
PI_OFFLINE=1 PI_TELEMETRY=0 node tests/pi-host-probe.mjs
```

For a disposable interactive fixture demo, use **three existing, absolute, disjoint** directories; do not put the work or import directory *inside* the archive directory. For example use a fresh `mktemp -d` root with separate `archive/`, `work/`, `imports/`; copy `tests/fixtures/field-notes.md` into `imports/`. Set `RESEARCH_ARCHIVE_ROOT`, `RESEARCH_WORK_ROOT`, `RESEARCH_IMPORT_ROOT` to these absolute paths **in the shell launching Pi**. Optional `RESEARCH_READ_BYTES` is 128–8192 (default 2048); `RESEARCH_SEARCH_LIMIT` is 1–10 (default 5). Keep roots/config fixture-only for tests. No credentials, global Pi config or new services are needed.

In the trusted **project cwd containing `.pi/extensions/research-acceptance.ts`**, create the ignored `.mcp.json` (replace the path with this checkout's absolute path):

```json
{
  "mcpServers": {
    "research_import": {
      "command": "node",
      "args": ["/absolute/path/to/research_mcp/src/stdio.js"],
      "lifecycle": "lazy",
      "approveTools": ["accept_research_draft"],
      "env": {
        "RESEARCH_ARCHIVE_ROOT": "${RESEARCH_ARCHIVE_ROOT}",
        "RESEARCH_WORK_ROOT": "${RESEARCH_WORK_ROOT}",
        "RESEARCH_IMPORT_ROOT": "${RESEARCH_IMPORT_ROOT}",
        "RESEARCH_READ_BYTES": "${RESEARCH_READ_BYTES}"
      }
    }
  }
}
```

Omit the `RESEARCH_READ_BYTES` env key if unset. The project extension and adapter must both be loaded; trust this project only after inspecting its local extension. Use the server name **`research_import`** (the host broker deliberately matches this name). Start a fresh **interactive** Pi session with the variables exported and the adapter installed. This setup is a behavioral gate in the supported host workflow, **not** an authentication system or OS sandbox: another local client/process with filesystem access can call MCP or write files, Pi's built-in shell/file tools still have user permissions, and Pi without the project gate is not the supported approval workflow. The adapter's `approveTools` is defense in depth, not a substitute for the project gate's digest-bound review; headless Pi is denied by the project gate. RPC/print/JSON approval is deliberately unavailable here. No interactive human click is simulated by the automated proof; it uses a deterministic fake TUI decision and records what the user would see. An actual interactive consent demonstration remains a separate coordinator check, not a claim made by the probe.

1. Import a finished selected fixture using `mcp({tool:"research_import_save_research_draft", args:{sourcePath:"/absolute/path/to/imports/field-notes.md", metadata:{...}}})`; see [import.md](import.md) for exact metadata and source rules. Import does **not** approve or accept anything.
2. Read **all** proposal pages with `mcp({tool:"research_import_read_research", args:{proposalId:"..."}})` and each *entire* returned `continuation` until null. Read sources, warnings and the body as untrusted data. Request `mcp({tool:"research_import_review_research_draft", args:{proposalId:"..."}})` to obtain the review envelope. It states the source/proposal digest, accepted timestamp, expected base (`null` for new reports), prior catalogue digest, new report digest, archive target, exact two files, metadata/warnings and publication status; it is not consent and does not mutate accepted files. Review new-report content/metadata, dates, local/citation dependencies and rights before proceeding. `read_research` may require multiple pages; the host confirmation shows only the **first** page, not a complete diff for large bodies.
3. In the same interactive Pi host, call `mcp({tool:"research_import_accept_research_draft", args:{proposalId:review.proposalId, expectedRevision:review.expectedRevision, expectedBaseRevision:review.expectedBaseRevision, expectedCatalogueRevision:review.expectedCatalogueRevision, expectedReviewDigest:review.reviewDigest, acceptedAt:review.acceptedAt}})`. These are **review fields**, not an `approved:true` flag. The project Pi extension independently re-reads the local proposal, re-computes the review digest and asks the user to approve the exact local change. No approval, denial, changed bytes, stale catalogue, noninteractive mode or cancellation means **no adapter dispatch**. The MCP archive checks the same digest/base/catalogue again immediately before writing, and refuses conflicting identities. A successful response lists only `reports/<id>.md`, `INDEX.json`, the stored report revision and catalogue revision; `published:false`, `committed:false`.
4. Restart Pi/server using the same roots. `mcp({tool:"research_import_search_research",args:{query:"sandy orchard watering",limit:3}})` returns report IDs/revisions without a manual path. Read a selected report with `mcp({tool:"research_import_read_research",args:{reportId:"orchard-water",expectedRevision:"<candidate.revision>"}})`; follow returned continuations. Never use the search score as a freshness or evidence guarantee. The report Markdown is readable with the engine stopped. Proposal/source files remain unchanged and outside the accepted collection.

The Pi extension records session-local `not_approved`, `denied`, `stale_review`, `review_failed`, or `approved_for_dispatch` entries with the digest (no report body). **`approved_for_dispatch` is not a completion receipt**; check the MCP result and disk after a failure. Future publication work should extend this *same* review envelope to include the repository, branch, outgoing commits and exact publishable file set **before** one human approval, then use that approval for accept/commit/push; it must not infer publication permission from this local-only consent or demand an additional ceremony for an unchanged combined operation.

## Archive and catalogue contract

`createArchive({archiveRoot,workRoot,importRoot,maxReadBytes?,maxSearchResults?,now?,writeCheckpoint?})` keeps `importReport`, `readProposal` (including `pageBytes`), and adds `reviewProposal`, `acceptProposal`, `searchReports`, `readAccepted`, `rebuildCatalogue`. `writeCheckpoint` is an injected deterministic failure hook for tests only, not a user workflow. The current proposal format is unchanged. Explicit base revision is `null` for **new reports only**; updates/improvements and Git publication are not implemented. Imported records retain original origin/research dates; `created_at` and `updated_at` on the accepted report are the **reviewed acceptance timestamp**, while `imported_at` remains the earlier import timestamp. The accepted report is UTF-8 Markdown with a bounded JSON-in-YAML-front-matter mapping (`---`, canonical JSON metadata and warnings, `---`) followed by the **exact original bytes**, including BOM/CRLF/Unicode. The revision is SHA-256 of the whole stored report file; `sourceDigest` is SHA-256 of original report bytes. The header and each proposal metadata record are capped at 24 KiB; original body at 2 MiB. This JSON front matter is a safe YAML flow mapping readable without a YAML dependency and parsed as strict JSON (not arbitrary executable YAML tags).

`INDEX.json` is a canonical, indented UTF-8 **human-readable structured catalogue**, used instead of a Markdown block format so corruption and revision identity can be validated without an ad-hoc Markdown parser. Entries sorted by bytewise ID contain identity/path, title/question/scope/summary, dates and origin, language, relationships/supersession, *every* report/diagnostic warning, report revision, file size and indexed mtime. There are no bodies, transcripts, vector embeddings, database or model-generated summaries. `searchReports` tokenizes local Unicode words, scores bounded metadata with title/question weighting, orders ties by ID, defaults to five hits and caps at ten. It returns `{status:'matches'|'empty',candidates,nextOffset,catalogueRevision,relevanceNote}`; an empty match is a successful lookup, **not** an instruction to research. An invalid query/offset returns `invalid_input`. The stdio tool returns identical JSON in model-visible `content` and structured output; it shrinks the shortlist or page to stay under **48 KiB** including JSON escaping and fails `limit_reached` if even one full candidate/page with all warnings cannot fit (no silent warning loss). Proposal and accepted report reads use exact byte/revision-bound pages and citation continuations, not a whole report as model context.

The catalogue is derived: accepts update one entry without rereading/re-summarizing existing bodies; ordinary searches validate the directory's IDs and each indexed file's size/mtime but **do not rebuild** or send the full catalogue to the model. Reads additionally check the selected report's full digest and metadata against its entry. Manual edits require explicit `rebuild_catalogue` after inspection. `rebuildCatalogue` scans **valid** accepted reports, revalidates metadata/body digests, and atomically replaces the index; unchanged reports produce byte-identical catalogue data and revision. A missing `INDEX.json` yields `catalogue_unavailable` even for an otherwise empty archive until explicit rebuild. Malformed index is `catalogue_invalid`; indexed files added/removed/changed are `catalogue_stale`; a genuinely valid empty catalogue returns `status:'empty'`. Ordinary stat checks are not tamper-proof: deliberate same-size/same-mtime edits can evade lookup until a selected report is read; this is a trusted-local writer design, not a multi-user integrity system.

Writes use exclusive creation of a synced temp report and atomic non-overwriting link, sync the report directory, then sync/atomically rename the catalogue and sync its directory. There is no cross-process transaction or writer lock: **one server writer per archive/work roots**. A failed/interrupted second step can leave a complete report plus stale/missing index; searches/reads refuse to present a confident empty result. Inspect the local files first; rebuild explicitly from valid reports, never blindly retry acceptance or delete/report success speculatively. If report bytes/metadata fail validation, rebuild refuses to invent a repair; recover from reviewed source/backup manually. Symlinks/FIFOs are rejected on traversed paths, but portable Node path checks cannot defeat a same-user concurrent path-swap race. Source documents and proposals are never modified. No model, Jev, external request, Git action, persistent daemon or sandbox is part of this slice.
