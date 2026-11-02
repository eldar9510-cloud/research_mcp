# Report format and provenance

Reports are ordinary UTF-8 Markdown under `reports/<id>.md`. The implemented format is **JSON inside YAML front-matter delimiters**, not arbitrary YAML: `---\n`, one strict JSON object, `\n---\n`, then the preserved body. Use the import/research interfaces, not hand-authored acceptance headers. The derived, human-readable `INDEX.json` contains discovery metadata, warnings, byte size, indexing mtime and report digest—not report bodies or a synthesis.

## Metadata

[Import](import.md) accepts exactly these user-supplied fields; this fictional example is metadata, not approval or evidence:

```json
{
  "id": "example-watering-comparison",
  "title": "Illustrative watering comparison",
  "question": "Which cadence fits the stated fictional orchard?",
  "scope": "Fictional sandy-soil example; no real recommendation.",
  "summary": "Two illustrative alternatives and unresolved limitations.",
  "researched_at": null,
  "last_improved_at": null,
  "language": "en",
  "origin": { "kind": "imported", "platform": "unknown", "author": "unknown", "model": "unknown" },
  "related_reports": [],
  "warnings": ["Fictional example, not researched or verified."],
  "superseded_by": null
}
```

IDs are stable lowercase hyphenated slugs (1–100 characters). Known origins/attribution must not be replaced with `unknown`; missing historical facts must not be invented. Relations are `{id,relationship}`, with `reuses|extends|corrects|replaces`. Known essential caveats/successor IDs belong in reviewed metadata as well as original prose; warning detection is deliberately limited, not a semantic audit.

The archive adds `created_at`, `updated_at`, `imported_at`, stored diagnostic warnings, source digest and proposal lineage. The stored header has `format:1`, `metadata`, `warnings`, `sourceDigest`, and `proposalRevision`; generated/improvement records carry their checked operation lineage as appropriate. Do not supply archive-managed timestamps in import metadata or manufacture an engine origin through import.

| Date | Meaning |
| --- | --- |
| `researched_at` | Original investigation date (`YYYY-MM-DD` or null); never import time or filesystem mtime |
| `last_improved_at` | Latest substantive requested research; not whole-report verification |
| `imported_at` | Initial external import timestamp; null for new engine work |
| `created_at` / `updated_at` | Accepted archive creation/change timestamps; provisional before acceptance |
| Source access/check date | Only the actual named passage/claim operation; HTTP access is not support verification |
| Catalogue mtime | Filesystem consistency hint; can change after checkout without any new research |

Same-report improvements preserve stable ID, original origin/date (including null), canonical scope/language, creation/import history and original body bytes. The append-only dated addendum identifies requested gaps, checked/new evidence, reused unchecked material and remaining dependencies. Materially different questions use linked reports. See [improvement.md](improvement.md); no automatic whole-report rewrite or source refresh is implied.

## Body, citations and revisions

New research should state question/scope, findings/evidence, alternatives and rejection reasons, applicability, limitations/gaps, source labels and improvement notes. Imports retain their useful original structure and **exact body bytes**, including citations, BOM/CRLF/Unicode; uniform headings do not justify rewriting them. Markdown/plain text input is bounded to 2 MiB; the metadata/header cap is 24 KiB. PDFs/OCR, bulk history import and semantic merging are outside v0.

Keep portable links and original citation labels. Flag unavailable transcript/local references instead of fetching private material or inventing definitions. A bibliography is not support for every claim. Do not upload cited source documents merely for convenience.

The proposal digest binds its proposed metadata/body/operation; acceptance returns the SHA-256 of the **entire stored report** as its revision. A proposal is not a Git revision. Body selections are half-open **UTF-8 byte** ranges at an exact returned revision, excluding the accepted header. Follow all [read/diff continuations](reading.md), including required warning and citation context. Every page retains qualifications; stale revisions conflict rather than mix. Digests prove byte identity, not truth, freshness, legal rights or that anyone read the pages.

## Licensing and review

Our code/docs are [MIT](../LICENSE). Authored report content may be [CC BY 4.0](../LICENSE-REPORTS.md) **only where the contributor has the necessary rights**; preserve known authorship/origin, reused-report attribution and change notices. Third-party source text, quotations, images and linked documents retain their own terms. Public accessibility, relevance, import validation and publication consent do not establish redistribution rights or factual/currentness certification. Review credentials/personal information and unavailable dependencies before proposing publication; never include raw sessions, auth stores or private examples.
