---
{
  "format": 1,
  "metadata": {
    "id": "iec-60227-1-detailed-research-2026-11-02",
    "title": "IEC 60227-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60227-1?",
    "scope": "Detailed IEC 60227-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:29.781Z"
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
  "sourceDigest": "f6494c485313eda303aa2bc400c3c3dfc373814d1674e356bd6b1c2079a68151",
  "proposalRevision": "7801307210ae9e3f42b97271697c2e8181368f0acd055136a2d79d819cbf8802"
}
---
# IEC 60227-1 — PVC-insulated cables: general requirements

**Research date:** 2026-11-02 UTC. **Evidence level:** IEC publisher scopes, not the full normative clauses. This is component research, not a conformity assessment, design approval or legal opinion.

## Identity and publication status

[IEC 60227-1:2024](https://webstore.iec.ch/en/publication/71989), *Polyvinyl chloride insulated cables of rated voltages up to and including 450/750 V — Part 1: General requirements*, is an International Standard published by IEC TC 20 on 22 February 2024, edition 4.0. The IEC page lists a stability date of 2032; that is not a promised withdrawal date or a legal-applicability date. The publisher identifies the 2024 base publication and a redline, but the public page did not establish a complete amendment/corrigendum history; check that separately when an exact normative baseline is needed. This is not an EN adoption or OJEU status check. [S1]

The archived batch's identification of edition 4 and page 71989 is confirmed; its identification of page 14026 as the **2001** Part 6 is wrong: that exact URL is the **1981** first edition and says a 2001 version exists. Its unsupported universal conductor-class claim for lift cables must not be used as a design rule. [S1, S2, L1]

## What the document covers and why it matters

The official scope applies to rigid and flexible cables having PVC-based insulation and, **if present**, PVC-based sheath. Their rated voltage U₀/U is up to and including 450/750 V, for power installations with nominal AC voltage not exceeding 450/750 V. Some flexible types are called cords. Part 1 gives general requirements and type code designations; the particular cable types are in Parts 3, 4, 5, 6 and 7. [S1]

This is a family-level product specification: it gives a common technical language for cable manufacturers, test laboratories, purchasers and engineers comparing cable construction and declarations. It is neither a blanket specification for all PVC-looking cables nor a cable-sizing method for all installations. A cable above the specified voltage envelope, or without the described PVC-based insulation, is outside the published scope; absence of a sheath alone is **not** an exclusion. The scope states an AC installation limit and does not establish an independent DC-use rating. Nor does the abstract establish a complete list of explicitly excluded special applications. [S1; interpretation]

The applicable particular part and exact type must be read together with the general part. Part 6 addresses lift cables and cables for flexible connections: IEC's 1981 page explicitly says so and points to a later 2001 version. That historical source does not prove the current Part 6 edition, its detailed scope, or a given conductor-class rule. In particular, Part 1 does not by itself establish that any PVC flexible cord is acceptable as a travelling cable under a lift car. [S1, S2]

## Technical subject areas and companion documents

The IEC abstract confirms general family requirements, cable type designations and test-method references, but does not provide enough text to list or interpret all individual clauses, construction dimensions, limits or test pass criteria. The applicable cable type's part supplies its particular specification. The abstract directs readers to IEC 63294, IEC 60332-1-2 and relevant IEC 60811 series parts for the referenced methods. These are method documents, not evidence that a specific finished cable passed every test or meets every fire-performance objective. Exact test applicability depends on the cable and relevant clauses. [S1]

[IEC 60228:2023](https://webstore.iec.ch/en/publication/71891) addresses insulated-cable conductors, including their nominal areas, wire construction and electrical resistance, and fixed-installation and flexible conductor types. Its scope states that applicability to a particular cable is as specified in that cable's own standard. It is distinct from the complete cable's insulation, sheath, construction and use qualification. It excludes telecommunications conductors from its own scope. [S3]

**Critical distinction:** a flexible conductor class or compliance with IEC 60228 is not proof of a completed cable's continuous-flex cycle life, drag-chain suitability, torsion tolerance or lift-trailing duty. Even a Part 6 declaration must be checked against the actual cable type, edition and manufacturer's specific operating envelope; neither the Part 6 title nor Part 1 abstract establishes all of those details. The prior batch's claimed universal minimum class for lift trailing cable remains unverified, not a finding. [S2, S3, L1; engineering inference]

## Selection, installation and practical electrical use

For an actual cable, obtain a manufacturer datasheet and declaration for the **exact article and variant**, recording the cited editions and applicable particular part/type. Questions for electrical design include:

- Does the declared rated voltage, including U₀/U and any separately stated DC conditions, cover the intended circuit and installation? Are core count, cross-section, conductor material and class appropriate to the connected terminals and circuit?
- Is the intended installation fixed, occasionally flexed or continuously moving? What bend radius, movement profile, speed/acceleration, torsion, travel, cycle life and support/anchorage conditions are declared for that actual duty? Require specific dynamic evidence rather than inferring it from flexibility class.
- What are the declared conductor and ambient temperature ranges, installation derating, grouping, thermal conditions and ampacity basis? Assess overload and short-circuit protection, voltage drop, disconnection and protective-conductor arrangements under applicable installation/machinery rules. A rated voltage is not an ampacity, short-circuit rating or protective-device choice.
- What environmental limitations are declared for abrasion, oils, chemicals, water, UV or outdoor exposure? What evidence of fire behaviour is actually declared, and under which test? A flame test reference does not imply fire resistance, low smoke or halogen-free performance.
- Are terminations, glands, strain relief and any shielding compatible with actual cable dimensions, conductor type and manufacturer's conditions? For shielded signal/control cables, investigate EMC, segregation and bonding at the system level where relevant.

These are engineering evidence questions, not claims that Part 1 prescribes each item. Manufacturer external specifications and installation instructions are the relevant purchased-product contract; internal construction details beyond published evidence are not an intake prerequisite. A machine designer must select and install the cable under the applicable electrical installation and machinery standards, such as IEC 60204-1 where applicable, and the particular machine/lift standard. This investigation did not inspect their current clauses or establish their applicability to a particular machine. [S1–S3; engineering interpretation]

## Functional-safety boundary

A cable can form part of the wiring path of a safety-related control function, and open circuits, shorts, damage and environmental exposure can affect that function. Part 1 is a cable product standard, not a certification of a safety subsystem: its designation alone supplies no diagnostic coverage, Category, PL, SIL, PFH or automatic fault exclusion. ISO 13849 assessment and validation, where selected for the application, remain system-level tasks using actual wiring architecture, fault assumptions and evidence; the cable standard is not a substitute. No product is approved and no achieved safety integrity is claimed here. [S1; engineering interpretation]

## Library use and local holdings

The principal library route is `cable`, with subtype distinctions for fixed wiring, flexible cords and lift/dynamic cable as supported by the exact manufacturer documentation. The useful intake evidence is a source-backed article identity, cable family and particular part, vendor-cited edition, voltage and temperature/use limits, conductor and termination details, and any independently documented motion and fire test claims. Do not infer conformity from a category, connector or a conductor class; do not rewrite an older supplier citation to the current IEC publication year. This research does not change a library schema, category mapping, lifecycle status or product approval. [L2]

The supplied `NORMATIVE_CANDIDATES.json` listed no matching PDF, extracted Markdown or memory files. A filename search of the local `NORMATIVE` tree for `*60227*` likewise returned none. Thus **no matching full text found**, not proof that no differently named copy exists; no held edition could be inspected or compared. The archival batch is a research reference, not held normative text. Recommend **conditional acquisition** of Part 1 and the relevant particular cable part if recurring cable design, exact construction/test interpretation or conformity checking justifies it; otherwise use manufacturer documentation for initial screening and escalate unresolved requirements. Do not purchase a standard for every library cable automatically.

## Sources and limitations

- **S1:** IEC, [IEC 60227-1:2024 product page](https://webstore.iec.ch/en/publication/71989), identity and public abstract, inspected 2026-11-02 UTC; saved `evidence/part1.html`.
- **S2:** IEC, [IEC 60227-6:1981 product page](https://webstore.iec.ch/en/publication/14026), historical title, scope and later-edition notice, inspected same date; `evidence/part6.html`. The later edition itself was not independently inspected.
- **S3:** IEC, [IEC 60228:2023 product page](https://webstore.iec.ch/en/publication/71891), conductor scope, inspected same date; `evidence/other.html`. Its abstract contains an apparent internal reference typo; no conclusion depends on that phrase.
- **L1:** `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md`, lines 29–40 and 67: historical lead, not primary authority.
- **L2:** same research directory `README.md`, sections 1–4, library scope and supplier-edition handling.

The IEC preview endpoint returned HTTP 403; the response is retained as `evidence/preview-response.html` without bypass. The available primary text is publisher scope only, not a clause-by-clause review; exact amendment status, Part 6:2001 or later details, subtype exclusions, specific tests and applicable EN/legal status remain open. Source record and access times are in `SOURCES.json`.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `7d7188d568e10a95bea92513fb9d41e296c26cba078a87111103cba454999df0`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60227-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60227-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full normative text and preview unavailable; public scope only", "Complete amendment/corrigendum status not verified", "Later IEC 60227-6 edition and detailed lift cable requirements not independently inspected", "EN adoption and legal applicability not checked"],
  "local_holdings_summary": "No matching PDF, extracted Markdown or memory candidate; filename search of NORMATIVE returned no match. No held edition verified."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "checked_at_utc": "2026-11-02T23:04:41Z",
  "sources": [
    {"id":"S1","url":"https://webstore.iec.ch/en/publication/71989","title":"IEC 60227-1:2024, edition 4.0","accessed_at_utc":"2026-11-02T23:04:41Z","evidence_path":"evidence/part1.html","kind":"public scope","limitation":"Publisher abstract and metadata, not full normative text; complete amendment status unresolved."},
    {"id":"S2","url":"https://webstore.iec.ch/en/publication/14026","title":"IEC 60227-6:1981, edition 1.0","accessed_at_utc":"2026-11-02T23:04:41Z","evidence_path":"evidence/part6.html","kind":"public scope","limitation":"Historical revised edition; later 2001 edition is noted but its own record was not inspected."},
    {"id":"S3","url":"https://webstore.iec.ch/en/publication/71891","title":"IEC 60228:2023, Conductors of insulated cables","accessed_at_utc":"2026-11-02T23:04:41Z","evidence_path":"evidence/other.html","kind":"public scope","limitation":"Publisher abstract, not full text."},
    {"id":"P1","url":"https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMjI3LTF7ZWQ0LjB9ZW4ucGRm","title":"IEC 60227-1:2024 publisher preview endpoint","accessed_at_utc":"2026-11-02T23:04:41Z","evidence_path":"evidence/preview-response.html","kind":"access failure","limitation":"HTTP 403; no preview text obtained."},
    {"id":"L1","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md","title":"Batch 8 historical research","accessed_at_utc":"2026-11-02T23:04:12Z","evidence_path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md","kind":"old research lead","limitation":"Not authoritative; includes incorrect Part 6 URL edition and unsupported class claim."},
    {"id":"L2","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md","title":"IEC scope research guide","accessed_at_utc":"2026-11-02T23:04:12Z","evidence_path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md","kind":"local project guidance","limitation":"Library handling, not normative authority."}
  ]
}
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[S1]: <https://webstore.iec.ch/en/publication/71989>
[S2]: <https://webstore.iec.ch/en/publication/14026>
[S3]: <https://webstore.iec.ch/en/publication/71891>
[P1]: <https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMjI3LTF7ZWQ0LjB9ZW4ucGRm>
