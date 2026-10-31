# Selected, revision-bound reading (issue #4 candidate)

**Candidate status: incomplete.** Ordinary selected reads, citation continuations and later corrections are implemented and tested. A report with more essential notice text than the 48 KiB visible-response guard still cannot be read through MCP. The required full-access regression remains failing; do not treat this candidate as accepted issue #4 work. See the limitation below.

## Selection and complete access

`read_research` accepts exactly one of `proposalId` or `reportId`, plus:

- `expectedRevision`: SHA-256 returned by import/search/read. Required for a selection or any nonzero body/citation offset.
- `selection: {startByte, endByte}`: optional half-open **original-body UTF-8 byte range** `[start,end)`. Both endpoints must be code-point boundaries. Accepted-report front matter is not part of these offsets. Ranges are stable only at their specified revision; the server never relocates them into changed content.
- `offset`: optional original-body byte offset within the selection; defaults to its start (otherwise zero).
- `pageBytes`: optional 128 through the configured `RESEARCH_READ_BYTES` maximum (default 2048, maximum 8192).
- `referenceOffset`: citation-context continuation, supplied by the server.

Example, using identity/revision obtained from model-visible tool text:

```json
{
  "reportId": "example-report",
  "expectedRevision": "<64-character revision digest>",
  "selection": {"startByte": 1024, "endByte": 4096}
}
```

Pass the **entire returned `continuation` unchanged** to the next read until it is `null`. It retains identity, revision, selection, body window size and any citation offset. Do not manufacture an offset from the length of the returned JSON or number of JavaScript characters.

Omit `selection` to access the complete original body. Concatenate distinct `content` byte windows; citation-only pages repeat a window and must not be appended twice. `content.truncated` / `nextOffset` describe **remaining body bytes in this selection**, not omitted warning/citation context or the remainder of an unselected report. `citationsTruncated` independently describes citation pagination. `continuation:null` means both this selection's body and its citation context are finished. A zero-length selection or offset at end-of-document returns empty body content, with normal revision/metadata/notices; citation context may still need continuation.

Invalid, reversed, out-of-body or interior-code-point ranges are `invalid_input`. A stale expected revision is `revision_conflict`, not a successful page at the new revision. Accepted-report conflicts disclose requested/current digests, including changes since catalogue search, before a stale catalogue can obscure that change. Restart discovery/read against the new revision; previously returned continuations cannot be reused. Removed requested reports/proposals also conflict. No historical revision store or automatic Git checkout is added.

## Evidence on every page

Each page repeats identity, exact content revision, source digest, complete metadata (scope, original/improvement/import/archive dates, relationships and successor), all stored diagnostic warnings and selected location. Accepted reads retain all supplied metadata warnings as well. The existing 24 KiB record/header limit, 40 diagnostic-warning limit and exact Unicode/body storage are unchanged. Search summaries are discovery aids, not report evidence or freshness certification.

`notices` contains exact body text plus original `startByte`/`endByte` for detected important notices outside or inside the selected range. Detection conservatively recognizes English warning/caveat/limitation/correction/supersession/errata/known-error language in paragraphs and ATX headings; a matching heading retains its section through the next equal/higher heading. This is a heuristic, not a multilingual prose audit. Supply important known warnings and `superseded_by` in reviewed metadata rather than assuming arbitrary imported prose will be understood. A successor named in original prose is preserved verbatim, not promoted to a fabricated verified archive relationship.

Notice text is report content, **not metadata**: a notice above 24 KiB can still be returned when the actual model-visible response fits. The server never discards a correction, scope, date, warning or citation to make its body excerpt fit.

## Citation context

Cross-page references are found against the **same full report revision**, including tokens that intersect either edge of the selected byte range and references in repeated notices. The original citation spelling/style remains untouched in body text.

- Markdown full, collapsed and shortcut references, numbered references and footnotes are recognized; labels are case/whitespace normalized for lookup only.
- Definitions indented at most three spaces resolve. Indented continuation lines in multiline definitions/footnotes are retained.
- A short definition returns `status:"defined"`, its target and one-based original-body line; multiline definitions also include their original definition text.
- A longer definition returns `status:"read_at_line"`, location and a complete `read` argument object with identity, **the same revision**, and a byte selection. Use `read_research` with that object, then its continuations, to obtain the complete original definition.
- Missing/blank/ambiguous definitions remain `status:"unresolved"`; duplicates include `reason:"ambiguous_definitions"`. Exported platform citation/file-citation markers without portable definitions remain visibly unresolved. No URL or source content is invented. Unsupported imported syntax remains preserved in the original bytes; this is not a complete Markdown/platform parser.

Up to twelve citation entries appear per page. Citation continuations keep the same body start **and end**, selection and revision before advancing body content. The MCP server tests later citation pages before exposing the first window, so output-size shrink cannot change that window halfway through its references.

## Model-visible bound and unresolved acceptance conflict

Success JSON appears in MCP `content` and `structuredContent`; Pi's installed proxy prefers visible `content`. The server counts the complete UTF-8 visible text, including explanation, JSON escaping, metadata, warnings, notices and citations, against **48 KiB**, below the adapter's default 50 KiB guard. It shrinks only the body window, down to 128 bytes. Model-visible metadata/evidence context is not silently sliced. The isolated no-model Pi-host probe checks this through the actual installed adapter, not hidden structured output.

**Unresolved:** a valid report can contain a correction section larger than 48 KiB. Repeating that entire section on every page cannot fit the fixed visible guard, even with an empty/small body. Current behavior is an explicit `limit_reached` with identity/revision, not silent omission; the proposal may already have been stored before its preview failed. Its source/proposal files remain intact locally, but this does **not** satisfy READ-01 complete MCP access. No notices were summarized, omitted or treated as optional to manufacture success. The required regression `complete model-visible access survives a correction larger than the response guard` in `tests/acceptance-mcp.test.js` remains red.

A parent/user decision is needed to reconcile READ-01 complete access, READ-03 full important-warning text on every page and the finite visible guard for oversized warning context—for example, explicitly approved mandatory warning-context pagination before evidence reuse. Such a contract change has **not** been silently introduced here.

## Checks

```sh
npm run check
npm test          # candidate has the explicit full-access failure above
npm run test:mcp  # includes the same failing MCP regression
PI_SDK_ROOT=/absolute/installed/@earendil-works/pi-coding-agent \
PI_ADAPTER_INDEX=/absolute/installed/pi-mcp-adapter/index.ts \
PI_OFFLINE=1 PI_TELEMETRY=0 node tests/pi-host-probe.mjs
git diff --check
```

Tests use temporary roots, synthetic reports and local transports. The host probe reuses the existing SDK/proxy interface, sends no model prompt and performs no live research/network/Git publication. Its existing approval checks simulate TUI choices; they do not claim a real human click. See [import.md](import.md) and [acceptance.md](acceptance.md) for setup and existing archive limitations.
