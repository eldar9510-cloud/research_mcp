# Selected, revision-bound reading

This implements the owner's approved interpretation of [PRD READ-02/03](PRD.md#9-reading-reports-and-preserving-evidence): oversized correction text may use explicit required same-revision chunks, never silent omission or invented summaries. This contract does not certify evidence, source freshness, or that a person read anything. Use the [pinned setup](setup.md); current candidate checks, actual public-corpus observations and prior evidence are separated in [v0-signoff.md](v0-signoff.md).

## Selection and complete access

`read_research` accepts exactly one of `proposalId` or `reportId`, plus:

- `expectedRevision`: SHA-256 returned by import/search/read. Required for a selection or any explicit warning cursor/nonzero body/citation offset.
- `selection: {startByte, endByte}`: optional half-open **original-body UTF-8 byte range** `[start,end)`. Both endpoints must be code-point boundaries. Accepted-report front matter is not part of these offsets. Ranges are stable only at their specified revision; changed content is never silently relocated.
- `offset`: original-body byte offset within the selection; defaults to its start (otherwise zero).
- `pageBytes`: 128 through the configured `RESEARCH_READ_BYTES` maximum (default 2048, maximum 8192).
- `referenceOffset`: citation continuation, supplied by the server.
- `warningOffset`: numbered warning-context cursor, supplied by the server. It is not an approval/read receipt.

Example, using identity/revision obtained from model-visible tool text:

```json
{
  "reportId": "example-report",
  "expectedRevision": "<64-character revision digest>",
  "selection": {"startByte": 1024, "endByte": 4096}
}
```

Pass the **entire returned `continuation` unchanged** until it is `null`. It retains identity, revision, selection, body window size and warning/citation cursor. Do not manufacture byte offsets from JSON length or JavaScript character counts.

Omit `selection` to obtain the complete original body. Concatenate distinct `content` byte windows: warning pages have empty body content; citation-only pages repeat their current body window and must not be appended twice. `content.truncated` / `nextOffset` describe remaining body bytes **in this selection**, independently of warning/citation pagination. `citationsTruncated` describes citation pagination. `continuation:null` means this selection's body and the current continuation sequence's warning/citation pages are finished, **not** that anyone read them or that the evidence is verified. An empty selection or end-of-document offset returns empty body, but may still require warning/citation continuations.

Invalid, reversed, out-of-body or interior-code-point ranges are `invalid_input`. A stale revision is `revision_conflict`, not a successful page at the new revision. Accepted conflicts disclose requested/current digests before catalogue staleness can obscure the change. Removed requested reports/proposals also conflict. Restart discovery/read against the new revision; never combine old continuations with new evidence. There is no historical revision database or automatic Git checkout.

## Warnings and exact context

Every page retains identity, exact revision/source digest, complete metadata (scope, original/improvement/import/archive dates, relationships and successor), all stored diagnostic warnings, all metadata warning strings, and selected location. The 24 KiB record/header cap and 40 stored diagnostic cap are unchanged. Metadata warning validation uses the same supported string schema in the catalogue as at import; valid Unicode is not cut to 512 UTF-8 bytes. Stored metadata/body bytes and digests are never normalized or rewritten by reading/search.

For ordinary cases, `pageType:"body"` and `warningContext.mode:"inline"`: `notices` repeats the complete exact detected body notices, with original `startByte`/`endByte`, even outside the selection. No notices means `warningContext:null`; supplied metadata warnings and `superseded_by` still remain visible.

When notice context is large, or the complete escaped inline result cannot fit:

1. `pageType:"warning_context"`, `warningContext.mode:"paged"`: explicit warning pages precede body pages. Each contains an exact original-text chunk, at most 1024 source UTF-8 bytes, never split inside a code point. `warningContext.chunkNumber` / `totalChunks` number the complete sequence. Each `notices` entry additionally identifies its original `noticeNumber`, per-notice `chunkNumber` / `chunkCount`, and original byte location. Concatenating distinct chunks in location order reconstructs **all exact notice bytes**, including Unicode, line endings and citations.
2. Citation windows for a chunk complete before the next warning chunk. The selected body stays empty and its cursor does not advance during warning pages.
3. The subsequent body pages retain a prominent `CORRECTION / SUPERSESSION / WARNING CONTEXT` signal, metadata successor, exact bounded successor-bearing source lines and resolvable references, and `warningContext.read` pointing back to the complete required context at this revision. Body text is **not fully qualified on its own**. Read **all** warning chunks and their citation context before relying on it.

`warningContext.remainingChunks` is the number after the current warning chunk in this sequence; an isolated body page instead reports the full count required separately. `contextOutstanding` remains true on paged results, even after the final continuation: this stateless interface cannot attest that a caller/person read previous pages. Inline citation pagination also marks context outstanding. The warning cursor equals the total chunk count on body pages; changing it is not proof of review or permission. `warningContext.read` starts a fresh complete context sequence (and then full-body access); callers interested only in warnings may stop when the first body page arrives.

`successorContext` preserves at most four exact source-line prefixes (512 UTF-8 bytes each) plus a same-revision `read` selection for **each complete line**. Counts and explicit truncation flags disclose remaining successor context; the complete warning sequence contains all lines. These are original prose, not inferred/verified archive relationships. An ID supplied as `metadata.superseded_by` remains intact on every page. No successor, historical date or factual summary is invented.

### Detection limits

Relevant top-level Markdown ATX and Setext notice sections are recognized through the next equal/higher heading. Fenced backtick/tilde code and genuine indented code are not headings or citation definitions. Indentation alone cannot interrupt an open prose paragraph: immediate four-space/tab continuations still participate in citation lookup; blank lines and standalone heading, thematic-break or reference-definition blocks end that paragraph context. English warning/correction/replacement terms conservatively retain whole prose paragraphs, including dated, emphasized and noninitial notices, rather than requiring a narrow notice prefix. This can include ordinary keyword mentions; it is not a semantic warning audit. Inline code alone does not trigger notices or citations. This is a deliberately limited structural recognizer, not a complete CommonMark renderer, multilingual classifier or guarantee to understand arbitrary imported prose. Put known essential caveats and successor IDs in reviewed metadata rather than relying on heuristic detection.

## Citation context

References intersecting either edge of a body window or current exact warning chunk resolve against the **same full report revision**. Original body/citation spelling stays untouched.

- Full, collapsed and shortcut Markdown references, numbered references, footnotes and exported platform markers are recognized. Labels normalize case/whitespace for lookup only. Punctuation after `[claim][label]:` or `[claim][label](archived)` does not erase a reference.
- Definitions indented at most three spaces resolve; code-fence/indented-code examples cannot supply evidence definitions. Indented continuation lines in multiline definitions/footnotes are retained verbatim.
- Short definitions return `status:"defined"`, target and one-based body line; multiline definitions also include their original definition text.
- Long definitions return `status:"read_at_line"`, location and a complete same-revision `read` selection. Follow its continuations to obtain the complete original definition and required warning context.
- Missing/blank/ambiguous definitions remain `status:"unresolved"`; duplicates include `reason:"ambiguous_definitions"`. Nonportable platform markers stay visibly unresolved. Nothing is repaired by invention.

Up to twelve citation entries appear per page. Citation continuations keep the same warning chunk or body start **and end**, selection and revision. The MCP server sizes every citation page in a window before exposing it, so later size shrink cannot move evidence halfway through its references.

## Catalogue discovery and visible bound

Catalogue summaries are discovery aids, never evidence/freshness certification. Search inspects only its bounded returned shortlist for body notices, adds a bounded `body_notice` warning, exact bounded successor context and `warningContext.read`. It never puts whole bodies into the catalogue or rewrites accepted files/indexes during search. This works even with empty metadata warnings and no metadata successor.

Success JSON appears in MCP `content` and `structuredContent`; Pi's installed proxy prefers visible `content`. Complete visible UTF-8 text, including explanation, JSON escaping, metadata, warnings and citations, stays within **48 KiB**, below the adapter's default 50 KiB guard. The server first shrinks the optional body window, then switches oversized inline notice context to required chunks. Automatic chunking also applies above 32 KiB serialized notice context. It never slices metadata warnings or fabricates a correction summary. Irreducible metadata/output-size failures remain explicit `limit_reached`, with identity/revision; proposals may already have persisted before a failed preview.

## Checks

```sh
npm run check
npm test
npm run test:mcp
PI_SDK_ROOT="$PWD/node_modules/@earendil-works/pi-coding-agent" \
PI_ADAPTER_INDEX=/absolute/installed/pi-mcp-adapter/index.ts \
PI_OFFLINE=1 PI_SKIP_VERSION_CHECK=1 PI_TELEMETRY=0 node tests/pi-host-probe.mjs
git diff --check
```

Regressions retain the original 83,059-byte correction fixture and reconstruct its full body **and** exact warning context. Additional cases cover one oversized notice, Unicode/escaping, code/Setext structure, punctuated/missing citations, catalogue discovery/Unicode warnings and mutations across warning/body/citation/definition reads. The actual installed adapter probe uses model-visible text only, with no model prompt, source verification or publication. Existing approval checks simulate TUI choices, not a real human click. See [import.md](import.md) and [acceptance.md](acceptance.md) for setup and archive limitations.
