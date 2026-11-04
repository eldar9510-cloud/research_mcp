---
{
  "format": 1,
  "metadata": {
    "id": "iec-61984-detailed-research-2026-11-02",
    "title": "IEC 61984 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61984?",
    "scope": "Detailed IEC 61984 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
    "summary": "Research produced by a separate Terra 6.1 worker at configured medium effort. Original report, result and source ledger preserved. Content analysis and NORMATIVE comparison are deferred.",
    "researched_at": "2026-11-02",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi via Mastra",
      "author": "unknown",
      "model": "openai-codex/gpt-6.1-terra"
    },
    "related_reports": [],
    "warnings": [
      "Unreviewed research stored for later analysis. Not an authoritative standard text, technical approval, certification or legal determination.",
      "Author source limits, partial findings and edition qualifications remain in the report and appended result/source ledger. No batch content analysis or NORMATIVE comparison was performed for this import.",
      "Configured worker effort was medium. Earlier bounded checks on initial reports are historical collection notes, not comprehensive publication or normative verification.",
      "Third-party sources retain their rights. Raw evidence is private; storage is not permission to publish licensed standards or supplier material.",
      "The raw REPORT.md is preserved unchanged as the prefix. A mechanical storage appendix adds the original author result/source ledger and explicit supplied citation definitions; it is not new research."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T18:17:00.000Z",
    "updated_at": "2026-11-04T18:17:00.000Z",
    "imported_at": "2026-11-02T23:50:29.005Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "local_dependency",
      "message": "Local file reference may not be portable; review before publication."
    },
    {
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "26940f574b53681c0f178749d1a5dc65624e0085940760305a694678bfb1480b",
  "proposalRevision": "a98f7dce4ceb5417964909ca1aaa4b0c747a2cf631d1f53478ba951bbb93c2ba"
}
---
# IEC 61984 — connector safety requirements and tests

**Finding, checked 2026-11-02 UTC:** IEC 61984:2008, edition 2.0, is the published IEC International Standard *Connectors – Safety requirements and tests*. The IEC catalogue identifies 8 October 2008 as publication date, TC 48/SC 48B as responsible committee, and 2029 as its stability date. The IEC lifecycle search records the 2001 first edition as revised, the 2008 second edition as published and a corrigendum published 18 October 2011. IEC says the catalogue copy incorporates the October 2011 corrigendum. A stability date is not a promised replacement or a legal sunset. This check found no later IEC edition in the official search results, but does not resolve national adoption, OJEU status, or a particular supplier's declared edition. [1, 2]

## What it covers and why

The official 2008 abstract describes connectors with **rated voltage above 50 V up to and including 1,000 V AC and DC**, and rated current **up to and including 125 A per contact**, where **either no detail specification exists, or a detail specification invokes IEC 61984 for safety aspects**. Those two conditions are material: the voltage/current envelope is not a universal safety assignment for every connector within it. Conversely, its absence does not mean that an out-of-envelope connector is unsafe or lacks an applicable standard. The limits describe the standard's scope, not permission to operate any particular connector at all those values. [1]

This is a connector **product safety and test** standard, useful to connector designers, test/certification organizations and engineers assessing declared products. It addresses the safety of a separable electrical interface, not the entire machine or its installation. Its scope is framed by rating and applicable detail specification, not restricted by the IEC abstract to one geometry, industrial heavy-duty family or number of poles. For example, circular and rectangular industrial connectors may be candidates if their actual characteristics and the detail-specification route fit; those examples are interpretation, not an IEC claim that all such products fall within it. [1]

The official abstract does **not enumerate all exclusions, connector classifications, tests, or requirements**. The 2001 edition's separate catalogue abstract says it could be used as a guide for connectors at or below 50 V; that is explicitly a **2001 statement** and has not been independently checked in the 2008 full scope. Do not silently transfer that qualification to the later edition. [2] The public preview was blocked by the publisher's delivery service (HTTP 403); no circumvention was attempted. Exact exclusions and the detailed 2008 scope remain open until authorized access to the edition. [3]

## Mating, live circuits and breaking capacity

Treat these as separate engineering questions:

1. Is the circuit energized even though no significant load current is flowing? Live exposed contacts can create shock or fault hazards independently of current interruption.
2. Will engagement or separation make or interrupt load current? That adds making/breaking and possible arcing duties; an energized but unloaded condition is not the same test condition as breaking load.
3. Does the **specific product and mating pair** have a manufacturer-declared rating, instructions and any required interlock/sequence for the intended voltage, current and load type?

These are application distinctions, not a claim that IEC 61984 grants any generic live-mating permission. The accessible official abstract does not define the standard's classes, their names, test regimes, or permitted energized/no-load/load conditions. The previous batch [8] asserts two particular class labels and attributes additional label meanings, but it is not primary evidence and neither the exhaustive class list nor its label explanations were verified here. **Do not import those names or claims as normative fact.** Obtain the applicable edition and exact supplier instructions before classifying; absent evidence, do not assume that an IEC 61984 claim makes a connector a load switch, an isolator, or suitable for mating energized. The exact need for warning labels or interlocks cannot be generalized from this source.

## Technical subject areas and practical use

The IEC title and scope establish that the document concerns connector safety requirements and tests, and that detail specifications can invoke it for safety [1]. Because the clauses were unavailable, this investigation cannot responsibly specify its exact test sequence, test parameters, construction rules, inspection criteria, or list of class-specific duties. IEC 60512-1, separately, describes a basis and guidance for electrical connector tests and measurements in its series; that does not prove which particular 60512 methods the 2008 IEC 61984 edition invokes. [4]

For an actual selection, retain manufacturer-provided evidence for the complete combination: exact insert, housing, contacts, cable and mating part; voltage type and rated voltage/current; derating and ambient conditions; conductor size and termination method; mating/coding and locking; protection against accidental touch; protective-earth contact and continuity where applicable; environmental sealing in the specified assembled condition; and any explicit mating, isolation, handling and maintenance restrictions. These are **questions for evidence**, not claims that each has a particular IEC 61984 numerical requirement. Check the ratings and conditions of the actual product, not just the catalogue family's maximum. Compatibility between lookalike parts from different vendors is not established by this standard number alone.

Connector product tests and supplier instructions support selection; they do not replace the machine designer's applicable wiring, overcurrent/short-circuit protection, protective bonding, isolation, enclosure and installation assessment. Nor does IP marking by itself establish every installation or unmated condition. Machine application may lead to IEC 60204-1, but its exact requirements must be checked in the applicable edition and circumstances; the IEC search identifies that standard as referencing IEC 61984, not as proof of a universal requirement for every connector. [2]

## Functional-safety boundary

A connector may carry safety-related signals or power, and a poor connection, open circuit, short, incorrect mating or environmental exposure may matter to an assessed safety function. Its IEC 61984 safety-test claim alone is **not** a PL, SIL, diagnostic coverage, subsystem category, failure-rate value, fault exclusion or validation of a safety function. For an ISO 13849 application, examine the actual safety architecture, foreseeable faults, external wiring and manufacturer-supplied safety information under the applicable safety methodology; do not infer numerical safety performance from a product-standard claim. This distinction follows the local bounded safety-source review, not a claim that this research inspected the IEC 61984 safety clauses. [7]

Bought connectors are assessed as supplied components: use the exact vendor's external characteristics and installation instructions; there is no need to reconstruct proprietary internals. A certified subsystem that includes a connector may have its own documented boundaries and conditions; do not transfer them to a generic connector or to the whole machine. [6, 7]

## Related standards — distinct roles

- **IEC 61076-2-101:2024:** a detail specification for specified M12 screw-lock circular connectors, including defined configurations for signal, data and power within its stated ratings. Its coding and interface details are not guaranteed by IEC 61984 alone. The IEC abstract describes those M12 products up to 250 V and 4 A per contact; it does not establish that every M12 variant is in IEC 61984's scope or is interchangeable. [5]
- **IEC 60309-1:2021:** a separate industrial plugs/socket-outlets/appliance-inlets product route with its own scope, including accessories up to 800 A. A product resembling an industrial plug does not automatically fall under IEC 61984; resolve the exact product and applicable standard. [9]
- **IEC 60512-1:2018:** basis and guidance for connector tests and measurements in the IEC 60512 series. A generic test-method family is not the same as a product's complete safety specification. [4]
- **IEC 60204-1:** electrical equipment of machines and system installation context, distinct from connector product safety; verify the applicable edition and requirements. [2]

## Library implications and holdings

For `connector_industrial`, route by exact connector family, declared voltage/current, detail specification and supplier evidence, not the folder label. Products in sensor, motor and safety-device packages may use connectors too, but the connector standard is not automatically a standard for the complete purchased sensor, drive or safety assembly. Store actual declared references with edition, certificate or declaration identification, product variant and usage conditions; distinguish a catalogue scope candidate from vendor declaration and from independent test evidence. Do not infer a safety category, IP value, load-breaking rating or interoperability from this reference alone. [1, 5, 6]

The supplied `NORMATIVE_CANDIDATES.json` lists no IEC 61984 PDFs, extracted Markdown or memory candidates. An independent read-only filename search under `/media/eldar/disk_2/Machine_concept/NORMATIVE` for `*61984*` also returned no results. Thus **no matching local full text found**, not a proof that no copy exists under an unidentifiable filename. The old batch is a research reference only, not a held standard. No held edition was inspected or compared. [8, 10]

**Acquisition priority: conditional**, not automatic: obtain authorized current/full text when a concrete connector qualification, classification, exclusion or dispute requires clause-level verification and existing supplier documentation is insufficient. For ordinary procurement first seek the exact manufacturer data sheet, declaration/certificate, compatible-mate and assembly instructions. Parent decides acquisition and import.

## Sources and limitations

1. IEC catalogue, [IEC 61984:2008](https://webstore.iec.ch/en/publication/6223), abstract and product detail, checked 2026-11-02; saved `evidence/iec-6223.html`.
2. IEC Webstore search API, [search endpoint](https://webstore-search-api.iec.ch/api/search), POST search `61984` (payload in `SOURCES.json`); saved `evidence/iec-api.json`. Provides lifecycle and separate first-edition abstract. Search results are not full text.
3. IEC [public-preview endpoint](https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxOTg0e2VkMi4wfWIucGRm), publisher-delivery 403; saved `evidence/iec-preview.pdf` (actually HTML error). No preview clauses inspected.
4. IEC search API, `60512`, saved `evidence/iec-60512.json`; IEC [IEC 60512-1:2018 RLV record](https://webstore.iec.ch/en/publication/64046) is the identified record; abstract only.
5. IEC search API, `61076-2-101`, saved `evidence/iec-61076-2-101.json`; IEC [IEC 61076-2-101:2024 record](https://webstore.iec.ch/en/publication/77773), abstract only.
6. Local `/media/eldar/disk_2/Machine_concept/CLAUDE.md`, purchased-component boundary, and `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, category and evidence guidance.
7. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, bounded held-edition review; not a 61984 review.
8. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md`, historical unverified lead, especially section IEC 61984; not authority for classifications.
9. IEC search API, `60309-1`, saved `evidence/iec-60309-1.json`; IEC [IEC 60309-1:2021 record](https://webstore.iec.ch/en/publication/59916), abstract only.
10. `NORMATIVE_CANDIDATES.json` plus filename search described above.

**Remaining gaps:** exact 2008 full-scope exclusions and classes; their definitions and test conditions; requirements for live/no-load/load connection; actual vendor-specific data. No legal applicability, certification, machine conformity or full-clause review is claimed. Search-engine CAPTCHA and publisher-preview 403 are retained as failed access evidence; none was bypassed.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `5059beeda0d03516396c40ad693b1c07d06a3fbe6c3fb96dc5722ab75ae14713`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61984`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61984",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "2008 full text and public preview unavailable; exact exclusions and normative classes not verified",
    "No source-backed class-specific live/no-load/load mating requirements",
    "No exact product manufacturer evidence or national adoption/OJEU review"
  ],
  "local_holdings_summary": "Candidate inventory empty; read-only NORMATIVE filename search found no IEC 61984 match; no full text inspected."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "sources": [
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/6223",
      "title_edition": "IEC 61984:2008 ed 2",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/iec-6223.html",
      "evidence_kind": "official public scope",
      "coverage_limitation": "Abstract and metadata only"
    },
    {
      "url_or_path": "https://webstore-search-api.iec.ch/api/search",
      "title_edition": "IEC Webstore search: 61984",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/iec-api.json",
      "evidence_kind": "official public scope/search API",
      "coverage_limitation": "POST body: mode FULL; query 61984; from 0; size 20 for 61984, 10 otherwise; validOnly false for 61984, true otherwise; sortBy reference asc; language en; dateRanges {}; terms {}; publicationIds null; showTrf false; collapsed true. Abstract and metadata only."
    },
    {
      "url_or_path": "https://webstore-search-api.iec.ch/api/search",
      "title_edition": "IEC Webstore search: 61076-2-101",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/iec-61076-2-101.json",
      "evidence_kind": "official public scope/search API",
      "coverage_limitation": "POST body: mode FULL; query 61076-2-101; from 0; size 20 for 61984, 10 otherwise; validOnly false for 61984, true otherwise; sortBy reference asc; language en; dateRanges {}; terms {}; publicationIds null; showTrf false; collapsed true. Abstract and metadata only."
    },
    {
      "url_or_path": "https://webstore-search-api.iec.ch/api/search",
      "title_edition": "IEC Webstore search: 60309-1",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/iec-60309-1.json",
      "evidence_kind": "official public scope/search API",
      "coverage_limitation": "POST body: mode FULL; query 60309-1; from 0; size 20 for 61984, 10 otherwise; validOnly false for 61984, true otherwise; sortBy reference asc; language en; dateRanges {}; terms {}; publicationIds null; showTrf false; collapsed true. Abstract and metadata only."
    },
    {
      "url_or_path": "https://webstore-search-api.iec.ch/api/search",
      "title_edition": "IEC Webstore search: 60512",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/iec-60512.json",
      "evidence_kind": "official public scope/search API",
      "coverage_limitation": "POST body: mode FULL; query 60512; from 0; size 20 for 61984, 10 otherwise; validOnly false for 61984, true otherwise; sortBy reference asc; language en; dateRanges {}; terms {}; publicationIds null; showTrf false; collapsed true. Abstract and metadata only."
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxOTg0e2VkMi4wfWIucGRm",
      "title_edition": "IEC 61984:2008 preview",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/iec-preview.pdf",
      "evidence_kind": "access failure",
      "coverage_limitation": "403 HTML response despite file extension; no preview accessed"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/CLAUDE.md",
      "title_edition": "CLAUDE.md",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": null,
      "evidence_kind": "local guidance or old research lead",
      "coverage_limitation": "Read-only; historical research is not primary evidence"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
      "title_edition": "LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": null,
      "evidence_kind": "local guidance or old research lead",
      "coverage_limitation": "Read-only; historical research is not primary evidence"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
      "title_edition": "LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": null,
      "evidence_kind": "local guidance or old research lead",
      "coverage_limitation": "Read-only; historical research is not primary evidence"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
      "title_edition": "LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": null,
      "evidence_kind": "local guidance or old research lead",
      "coverage_limitation": "Read-only; historical research is not primary evidence"
    },
    {
      "url_or_path": "NORMATIVE_CANDIDATES.json",
      "title_edition": "Candidate holdings",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "NORMATIVE_CANDIDATES.json",
      "evidence_kind": "local inventory",
      "coverage_limitation": "No matching candidate; filename search not exhaustive"
    },
    {
      "url_or_path": "https://duckduckgo.com/html/?q=IEC+61984+webstore+scope+connectors",
      "title_edition": "Search access failed",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/ddg.html",
      "evidence_kind": "access failure",
      "coverage_limitation": "Challenge; not bypassed"
    },
    {
      "url_or_path": "https://search.brave.com/search?q=%22IEC+61984%22+%22breaking%22+connectors&source=web",
      "title_edition": "Search access failed",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/brave.html",
      "evidence_kind": "access failure",
      "coverage_limitation": "Challenge; not bypassed"
    },
    {
      "url_or_path": "https://www.ecosia.org/search?q=%22IEC+61984%22+%22without+breaking+capacity%22",
      "title_edition": "Search access failed",
      "accessed_utc": "2026-11-02T23:06:14.365168+00:00",
      "evidence_path": "evidence/ecosia.html",
      "evidence_kind": "access failure",
      "coverage_limitation": "Challenge; not bypassed"
    }
  ]
}
`````
