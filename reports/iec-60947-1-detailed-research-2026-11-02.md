---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-1-detailed-research-2026-11-02",
    "title": "IEC 60947-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-1?",
    "scope": "Detailed IEC 60947-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.088Z"
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
  "sourceDigest": "2b092a105fe5330fe2be5137eb6bd64d1f27579184d9320dd6c0b7a3fabcadf1",
  "proposalRevision": "a234d5b2686beaba189a8c2ae7d88982dfa8c5668ad6bfe9c9c54d43dee4b4d8"
}
---
# IEC 60947-1 — low-voltage switchgear and controlgear: general rules

**Checked 2026-11-02 UTC.** Scope research from the IEC publisher's abstract and catalogue, not full-clause inspection or a conformity assessment. [IEC-1] is the primary source throughout; interpretation and engineering questions are identified below.

## Identity and publication status

IEC **60947-1:2020**, *Low-voltage switchgear and controlgear — Part 1: General rules*, is an International Standard, edition 6.0, published 22 April 2020. IEC lists it as published and reports that this sixth edition replaces the 2007 fifth edition and its 2010 and 2014 amendments. IEC says the current copy incorporates corrigenda of December 2022 and April 2024. Its lifecycle also lists a seventh edition as **in preparation**, not a published replacement; any forecast is not a publication. These are IEC catalogue facts at the check date, not an EN adoption, legal transition or OJEU determination. [IEC-1; IEC-API]

## Purpose and intended use

The part establishes common terminology, safety requirements and verification principles that product-specific low-voltage switchgear and controlgear standards can reuse. The problem is inconsistency and repetition across device families: common requirements are described once, while the applicable product part addresses the particular device. Its primary users include product manufacturers, standards writers and test laboratories; panel designers and component librarians use it to understand product ratings and ask for evidence, not as a substitute for the product part or machine design. This user characterization is an interpretation of the IEC scope. [IEC-1]

## Scope, boundaries and companion parts

**Publisher's scope:** the 2020 document applies **when required by the relevant product standard** to low-voltage switchgear and controlgear intended for connection to circuits whose rated voltage does not exceed 1,000 V AC or 1,500 V DC. It sets general rules and common safety requirements, including definitions, characteristics, information, service/mounting/transport and end-of-life conditions, construction and performance, verification, energy efficiency and environmental aspects. [IEC-1]

**Interpretation:** neither a low-voltage rating nor the presence of a switch makes Part 1 automatically a complete stand-alone product specification. Identify the particular device and read the product standard's actual references, modifications and applicable edition. The public abstract does not enumerate all product-specific exceptions; this investigation does not assert that every device or every clause is covered. The voltage limits describe rated circuit voltage, not a universal device insulation rating or an installation authorization.

For example, IEC identifies the 2023 edition of **IEC 60947-4-1** as addressing electromechanical contactors and motor-starters; its record explicitly references IEC 60947-1:2020 for certain coordination matters. The actual product part and its use with Part 1 must be checked rather than assuming that identical rules apply to a contactor, a breaker and a disconnecting switch. [IEC-4-1] IEC's Part 1 catalogue lists the current product records IEC 60947-2:2024, IEC 60947-3:2020 and IEC 60947-5-1:2024 among documents referring to Part 1; these are evidence of relationships, not proof of applicability to an unidentified item. [IEC-API]

## Main technical subject areas

The publisher lists the following broad subjects, not a fully inspected clause-by-clause summary [IEC-1]:

* **Common language and declared characteristics:** definitions and device characteristics underpin a consistent interpretation of the manufacturer's catalogue data. A rating must still be read with its voltage, load, operating conditions and relevant product-part context.
* **Information and service conditions:** supplied equipment information, normal service, mounting and transport conditions affect whether a device's declared performance is relevant in the proposed enclosure and environment. Dismantling/decommissioning and environmental matters are also within the abstract's listed subjects.
* **Construction and performance:** common constructional and performance requirements support consistent product assessment. The catalogue identifies revised DC testing and EMC tests among the changes from the fifth edition. It also lists energy-efficiency aspects and environmental aspects. It does not expose the detailed acceptance conditions in the abstract.
* **Verification:** verification of characteristics and performance belongs to the product/testing framework. IEC identifies a new Annex X concerning coordination of short-circuit protective devices in the same circuit. Whether a particular combination and test arrangement is suitable requires the relevant text, product part and manufacturer evidence; Annex X alone does not establish a combination rating.

The older batch's shorthand about thermal, dielectric and physical rules [OLD] is a useful topic lead, but not proof of particular 2020 requirements or test limits. No full normative clauses, tables or test sequences were inspected for this report. In particular, no clearance, creepage, temperature-rise or withstand value should be inferred from this overview.

## Practical electrical and library relevance

For `main_switch`, `circuit_protection`, `contactor`, and potentially control-circuit switches such as `limit_switch`, `door_interlock` or `e_stop`, first resolve the actual subtype and applicable product standard. The categories are routing hints, not a claim that every item falls under this document. For the exact purchased variant ask:

1. Which product standard and edition does the manufacturer actually declare, and is Part 1 cited directly or through that product standard? A standard mentioned in a datasheet or certificate has its own scope and conditions; distinguish declaration, certification and independently inspected test evidence.
2. What are the rated operational voltage/current, frequency or DC conditions, load/utilization and duty, as actually declared for the relevant combination? Are operating environment, enclosure, mounting and terminal/connection details compatible with the application?
3. For a breaker or switching device, what short-circuit rating, upstream protection, coordination and combination are specified by the manufacturer for this exact supply and arrangement? Do not infer a safe protective combination solely from general rules.
4. For a disconnecting switch, is isolation suitability actually declared under the relevant product part? For contactors, are coil supply, power contacts, auxiliary contacts and permissible loads identified? For control devices, is the claimed contact function specific to the exact operator/actuator and assembly?

These are engineering evidence questions, not extracted mandatory Part 1 clauses. Selection, wiring, protection and installation remain application decisions governed by applicable installation and machinery rules and the supplier's external instructions. For purchased black boxes, seek the published external interface, ratings, required protection and conditions; internal circuits or proprietary mechanics are not a prerequisite for intake. [IEC-1; LOCAL-GUIDE]

## Functional safety boundary

A switching device may be a component of a safety-related control system or an externally certified subsystem, but the Part 1 general rules and a product-standard reference do not by themselves establish diagnostic coverage, Category, PL, SIL, PFH or a validated machine safety function. Contact properties and a manufacturer safety manual may support an application-specific architecture and monitoring; they do not automatically establish achieved diagnostic coverage. ISO 13849-1 addresses safety-related control-system design/assessment in its applicable scope; ISO 13849-2 concerns validation. IEC 62061 provides a different machinery functional-safety route where applicable. Preserve supplied safety claims and their conditions instead of inventing values or converting PL and SIL automatically. The locally held ISO 13849-1:2023 safety-source review specifically supports the distinction between a contact construction and implemented diagnostics. [SAFETY]

## Local holdings and acquisition recommendation

`NORMATIVE_CANDIDATES.json` reports no matched PDF, extracted markdown or standard-specific memory file. No matching full text was provided or independently verified in this assignment; a document merely referring to IEC 60947-1 is not a held copy of it. The old batch is a research reference, not full text; it explicitly says its detailed Part 1 section is missing. [OLD] Parent will compare the actual NORMATIVE holdings, including alternative names and editions.

**Conditional acquisition/update:** obtain the exact relevant edition of Part 1 **and the applicable companion product part** when a real clause-level interpretation, product assessment or coordination question justifies it, subject to the parent's holdings reconciliation. For ordinary purchased-device selection, first obtain the exact variant's supplier datasheet, declaration/certificate, safety manual if relevant, and tested combinations; a blanket purchase for every component is not supported. Do not replace supplier-cited editions with the IEC current publication year.

## Sources and limitations

* [IEC-1] IEC publisher record, IEC 60947-1:2020: https://webstore.iec.ch/en/publication/26973 — exact title, abstract, edition, revision and corrigenda; saved `evidence/iec-26973.html`.
* [IEC-API] IEC official catalogue search API `https://webstore-search-api.iec.ch/api/search`, POST query `60947-1` (request parameters recorded in `SOURCES.json`); response `evidence/api.json` identifies publication lifecycle, product references and preparation status. The search is catalogue metadata, not the standard text.
* [IEC-4-1] IEC product record https://webstore.iec.ch/en/publication/74487 — product-specific contactor/motor-starter example; saved `evidence/iec-74487.html`.
* [LOCAL-GUIDE] `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, sections 1–4; category and evidence boundaries, not a normative source.
* [SAFETY] Same research directory `SAFETY_SOURCE_REVIEW.md`, claim assessment, citing locally held ISO 13849-1:2023 §6.1.5 and §6.2.1. This is an edition-qualified prior source review, not an independent full safety-standard review here.
* [OLD] Same research directory `batch02-switching-gemini.md`, introduction and summary; incomplete historical lead, not current primary authority.

The current EN adoption, national deviations, legal/OJEU status, full detailed exclusions, exact device-product part clauses and actual supplier claims were not investigated. No product conformity or machine safety verdict is made. Catalogue currency is time-sensitive.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `126e94eb69633cd811112eb54f07dd001a5fbb2d2982ecffd15eaccae0f635b3`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-1",
  "report": "REPORT.md",
  "status": "complete",
  "major_gaps": [
    "No full clauses inspected; scope and catalogue research only",
    "Local matching holdings unverified beyond provided empty candidate list",
    "EN adoption, OJEU/legal status, and product-specific conformity not assessed"
  ],
  "local_holdings_summary": "Provided candidate manifest lists no matching PDF, extraction or memory; parent to reconcile actual holdings."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/26973",
    "title_edition": "IEC 60947-1:2020 edition 6",
    "access_time_utc": "2026-11-02T23:01:21.813241+00:00",
    "evidence_path": "evidence/iec-26973.html",
    "kind": "public scope",
    "limitations": "No full clauses"
  },
  {
    "url_or_path": "https://webstore-search-api.iec.ch/api/search",
    "title_edition": "IEC 60947-1:2020 official search metadata",
    "access_time_utc": "2026-11-02T23:01:21.813241+00:00",
    "evidence_path": "evidence/api.json",
    "kind": "publisher catalogue API",
    "limitations": "POST JSON: {\"mode\":\"FULL\",\"query\":\"60947-1\",\"from\":0,\"size\":50,\"validOnly\":true,\"sortBy\":[{\"reference\":\"asc\"}],\"language\":\"en\",\"dateRanges\":{},\"terms\":{},\"publicationIds\":null,\"showTrf\":false,\"collapsed\":true}; no full text"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/74487",
    "title_edition": "IEC 60947-4-1:2023",
    "access_time_utc": "2026-11-02T23:01:21.813241+00:00",
    "evidence_path": "evidence/iec-74487.html",
    "kind": "public scope",
    "limitations": "Companion example only"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md",
    "title_edition": "Historical switching batch",
    "access_time_utc": "2026-11-02T23:01:21.813241+00:00",
    "evidence_path": null,
    "kind": "old research lead",
    "limitations": "Incomplete"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title_edition": "Safety source review",
    "access_time_utc": "2026-11-02T23:01:21.813241+00:00",
    "evidence_path": null,
    "kind": "prior source review",
    "limitations": "Not independently revisited"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title_edition": "Library research guide",
    "access_time_utc": "2026-11-02T23:01:21.813241+00:00",
    "evidence_path": null,
    "kind": "local guide",
    "limitations": "Non-normative"
  }
]
`````
