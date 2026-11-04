---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-5-2-detailed-research-2026-11-02",
    "title": "IEC 60947-5-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-5-2?",
    "scope": "Detailed IEC 60947-5-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.582Z"
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
  "sourceDigest": "204963c7ca0c6e4dfb8e4a298797c0ea265d7013f23d4d3f447334fc34145489",
  "proposalRevision": "41d438219d4bd5d9d0ade6d26a7c95b2d488c686216f142d116b036311d76e36"
}
---
# IEC 60947-5-2 — proximity switches

**Research check:** 2026-11-02 UTC. **Evidence depth:** public IEC catalog abstracts and publication metadata, not full normative clauses; no matching held full text found. This is a product-routing investigation, not a declaration of conformity, component approval or machine safety verification.

## Identity and status

IEC 60947-5-2:2019 is the International Standard **“Low-voltage switchgear and controlgear – Part 5-2: Control circuit devices and switching elements – Proximity switches”**. IEC lists edition 4.0, publication date 2019-10-18 and stability date 2027. Its abstract says the fourth edition replaced edition 3 (2007) and Amendment 1:2012; the publication is a technical revision. The IEC page also displays “Under development / Approved for CD”; this is not itself a published replacement. The public page does not substantiate an exhaustive amendment or corrigendum search, an EN adoption or its legal status. Treat the 2019 edition as the identified IEC base publication, not a guarantee about any specific supplier’s declared edition or regulatory applicability. [1]

## Purpose and scope

The standard addresses proximity switches in low-voltage control circuits: devices providing a switching indication when a target is sensed without ordinary mechanical target contact. It gives product suppliers and electrical engineers a common basis for describing and testing relevant switch characteristics. The IEC abstract explicitly identifies these sensing technologies [1]:

- **Inductive and capacitive**, sensing metallic and/or non-metallic objects; the abstract states this collectively and does not imply every individual inductive switch detects non-metallic material.
- **Ultrasonic**, sensing sound-reflecting objects.
- **Photoelectric**, sensing objects optically; the revision specifically added type D background-suppression definitions, requirements and tests.
- **Non-mechanical magnetic**, sensing objects with a magnetic field. A magnetic reed-contact switch is not automatically this subtype: IEC 60947-5-3:2026 separately points to IEC 60947-5-1:2024 Annex D for reed-contact magnetic switches [2].

A category name or a proximity sensing method alone does not establish the scope or conformity of an exact device. This summary follows the catalog abstract rather than the complete scope: the abstract does not establish every voltage limit, exception, application exclusion or detailed boundary; obtain the standard for a disputed applicability decision. The term proximity does not by itself equate a normal position sensor to protective equipment directly detecting people; IEC 60947-5-3 specifically excludes the latter and points to IEC 61496 or IEC TS 62998 series [2]. That exclusion is quoted for Part 5-3, not asserted as a verbatim Part 5-2 exclusion.

## Technical subject areas and engineering use

IEC's description of the 2019 revision identifies changes to sensing range and operating distance specifications; construction and instructions including optical radiation, hot surfaces, unattended operation and foreseeable misuse; EMC; impulse withstand testing; environmental information and conditions; dimensions, connectors and photoelectric symbols [1]. These descriptions show areas in which the product standard is relevant, not specific passing values or a complete test summary. Full clauses and test conditions were not inspected, so no numeric ranges, test sequence or conformity criteria are claimed here.

In practical selection, first define target material, shape, reflectivity or magnetic properties, its approach and environment. Compare the exact product's sensing distance and switching characteristics under the specified mounting and target conditions, including possible effects of nearby metal, background, contamination and mechanical tolerances. Ask for switching frequency and response, repeatability/hysteresis where relevant, operating temperature, enclosure protection and electromagnetic environment. These are application questions, not a claim that all are mandatory declarations under a particular clause. A nominal range is not a guarantee that every target will be detected at that distance.

For the electrical interface, check the exact supply range, AC/DC type, polarity and wiring, output type and load, residual/leakage or voltage-drop implications where applicable, input compatibility, protective devices, cables/connectors and manufacturer-prescribed mounting/spacing. A two-wire sensor and a three-wire transistor-output sensor can impose different interface constraints; neither wiring count nor a standard reference establishes compatibility with a given PLC input. Distinguish sensor switching output from direct power-load switching. The selected manufacturer's datasheet and instructions, not a standard number, establish that particular device's externally published ratings and permitted installation. Do not require disclosure of proprietary internals as a condition of ordinary bought-device intake.

The product standard concerns device characteristics and verification; it is not a substitute for selection, wiring, protective coordination or verification of the assembled machine. IEC 60947-1 is the general low-voltage switchgear and controlgear companion cited in the Part 5-2 abstract for specified environmental annexes, with exact editions and amendments as referenced there [1]. Do not assume all provisions of the newest Part 1 automatically replace the dated references in a selected edition.

## Conditional functional-safety relevance

An ordinary operational proximity switch can provide useful position or counting information, but a Part 5-2 declaration alone does **not** establish fault response, safety integrity, a PL, SIL, Category, diagnostic coverage or suitability for a specified safety function. In particular, the historical batch's blanket description of all Part 5-2 devices as inherently non-safety, and its unconditional prohibition on using them in a safety chain, go beyond the cited abstract. Nor should an ordinary output be assumed safe on fault. Whether a device may contribute to a safety-related function depends on the actual function, applicable application rules, product evidence, architecture and validation.

For a product specifically intended as a proximity device with defined behaviour under fault (PDDB), IEC 60947-5-3:2026 supplies additional requirements to Part 5-2 and to Part 5-1:2024 Annex D for reed-contact magnetic switches. Its IEC abstract describes a PDDB as intended to serve as a sensing subsystem of a safety-related control system under IEC 62061 or ISO 13849-1. It also includes requirements for PDDBs designed as part of an ISO 14119 interlocking device [2]. It does not follow that every proximity safety application must use this exact product standard, nor that every device citing it has a particular architecture, pulsed output or PL/SIL. The 2026 abstract itself says a safe state is **generally** OFF; do not turn that into a universal claim for all devices [2].

Identify the exact article, sensor and actuator combination, manufacturer's stated safety function and safety manual, relevant certificate/declaration, safety data and use conditions. Then assess the sensing subsystem with its logic, outputs, installation, foreseeable faults and machine function under the chosen framework; the integrator validates the whole function. A component’s claim, if any, is not automatically the achieved machine safety rating. Guard interlocking may require ISO 14119; person-detection protective equipment has a different scope route [2]. No claimed PL/SIL conversion or fixed diagnostic value is implied here.

## Related documents and category implications

- **IEC 60947-5-1:** electromechanical control-circuit devices; its 2024 Annex D is expressly referenced by the Part 5-3 abstract for reed-contact magnetic switches [2]. Do not conflate reed devices with non-mechanical magnetic proximity switches merely because both use magnets.
- **IEC 60947-5-3:** additional defined-fault-behaviour PDDB requirements, not a replacement for all basic device characteristics [2].
- **ISO 13849-1 / IEC 62061:** safety-related control-system design and assessment routes as identified by the PDDB abstract; function-wide assessment is distinct from a product standard [2].
- **ISO 14119:** applicable interlocking application route, as identified by the PDDB abstract; IEC 61496 / IEC TS 62998 are the cited direct-person-detection routes rather than PDDB [2].

The local library's `inductive_sensor` and, subject to actual subtype, `limit_switch` and `door_interlock` categories are reasonable review routes [3]. For each, record manufacturer, exact model and variant, actual sensing technology, supplier-declared standard and edition, external interface, target/actuator, environmental and operating constraints, and safety documentation only where a safety role is asserted. A category route is neither a mandatory standard mapping nor an approval. Light curtains and laser scanners should be investigated on their own protective-equipment route rather than reclassified merely because they sense without contact.

## Holdings, acquisition and limitations

The provided `NORMATIVE_CANDIDATES.json` lists no matching PDFs, extracted Markdown or memory files. A filename search of NORMATIVE's `STANDARDS_PDF` and `extracted_html` trees for 60947-5-2 likewise found no match; this is bounded discovery, not proof the text exists nowhere else. No exact full held edition was available for clause verification. The historical batch [4] is a research lead, not held normative text; its broad fail-state, compulsory safety-chain and edition assertions were not accepted without separate evidence. The live IEC Part 5-3 page now identifies its 2026 third edition as published on 2026-08-19, whereas the old batch characterised it as FprEN; those refer to different publication contexts and must not be merged [2,4].

**Recommendation:** conditional acquisition/update, not an automatic purchase. Obtain the exact applicable Part 5-2 edition and relevant companion text if there is an active product qualification, disputed subtype or clause/test question requiring them; otherwise use the public scope plus exact supplier documentation for preliminary routing. Supplier-cited editions, regional EN adoptions and OJEU/legal status remain unverified. No manufacturer-specific device was assessed. Public abstracts cannot resolve full scope, all exclusions, test details or whether any particular safety use is acceptable.

## Sources

1. IEC, [IEC 60947-5-2:2019 catalog](https://webstore.iec.ch/en/publication/32517), edition/status, abstract and change list; inspected 2026-11-02 UTC, saved `evidence/p52.html` and `evidence/p52.txt`.
2. IEC, [IEC 60947-5-3:2026 catalog](https://webstore.iec.ch/en/publication/75167), scope and change list; inspected 2026-11-02 UTC, saved `evidence/p53.html` and `evidence/p53.txt`.
3. Machine_concept `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, category routing and evidence boundaries; local historical guidance, not normative source.
4. Machine_concept `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md`, Part 5-2 and 5-3 entries; historical lead only, with unverified and overbroad assertions.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `95b5591094462b5562c1009a8ceb0c9eb8d771d991ed388e435908deacc3159c`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-5-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-5-2",
  "report": "REPORT.md",
  "status": "complete",
  "major_gaps": [
    "Full standard and detailed clauses not available; public abstract only.",
    "No exhaustive amendment, EN adoption, current OJEU or supplier-specific verification."
  ],
  "local_holdings_summary": "No matching candidates; filename search of NORMATIVE PDF and extracted_html trees returned none."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/32517",
    "title": "IEC 60947-5-2:2019, edition 4.0",
    "accessed_utc": "2026-11-02T23:03:00.741029+00:00",
    "evidence_path": [
      "evidence/p52.html",
      "evidence/p52.txt"
    ],
    "kind": "public scope and publication metadata",
    "limitation": "Abstract, not full standard; amendment history not exhaustive."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/75167",
    "title": "IEC 60947-5-3:2026, edition 3.0",
    "accessed_utc": "2026-11-02T23:03:00.741029+00:00",
    "evidence_path": [
      "evidence/p53.html",
      "evidence/p53.txt"
    ],
    "kind": "public scope and publication metadata",
    "limitation": "Related part abstract only; no full clauses inspected."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "README.md",
    "accessed_utc": "2026-11-02T23:03:00.741029+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "kind": "local research lead and guidance",
    "limitation": "Historical secondary material; not normative standard text."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "PRIMARY_SOURCE_CHECKS.md",
    "accessed_utc": "2026-11-02T23:03:00.741029+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "kind": "local research lead and guidance",
    "limitation": "Historical secondary material; not normative standard text."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "SAFETY_SOURCE_REVIEW.md",
    "accessed_utc": "2026-11-02T23:03:00.741029+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "kind": "local research lead and guidance",
    "limitation": "Historical secondary material; not normative standard text."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md",
    "title": "batch03-control-circuit-gemini.md",
    "accessed_utc": "2026-11-02T23:03:00.741029+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md",
    "kind": "local research lead and guidance",
    "limitation": "Historical secondary material; not normative standard text."
  },
  {
    "path": "NORMATIVE_CANDIDATES.json",
    "title": "Local holdings candidates",
    "accessed_utc": "2026-11-02T23:03:00.741029+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "kind": "local holdings lead",
    "limitation": "Empty candidates; bounded filename search additionally conducted."
  }
]
`````
