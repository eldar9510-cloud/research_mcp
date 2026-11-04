---
{
  "format": 1,
  "metadata": {
    "id": "iec-61131-6-detailed-research-2026-11-02",
    "title": "IEC 61131-6 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61131-6?",
    "scope": "Detailed IEC 61131-6 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.729Z"
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
  "sourceDigest": "c849483fdc1ad82a7b8b635c37ff3b1bfdcc6ca4c16398a342260900a9f08682",
  "proposalRevision": "2396e812cb246cbdd5f50aa760b2eaef764a15bc4194c4a492c8fba4fed431c6"
}
---
# IEC 61131-6 — functional safety programmable controllers

**Research check:** 2026-11-02 UTC. **Depth:** publisher scope and supporting primary sources, not a full-clause review. This report is an evidence-routing aid, not a certification, equipment approval or safety-function design.

## Identity and publication

The IEC publisher identifies **IEC 61131-6:2012, Programmable controllers – Part 6: Functional safety**, as an International Standard, first edition, published 2012-10-02, 203 pages. Its record gives a **2028 stability date**. The examined record does not itself establish that all potential amendments, subsequent editions or regional adoptions have been exhaustively checked; a stability date is not an expiration date or legal status. [S1] The historical batch's 2012 identification agrees with that record, but its other safety claims must be treated independently. No EN adoption, supplier-cited edition or OJEU listing was checked.

## Purpose and exact scope boundary

IEC's public abstract says this part specifies requirements for programmable controllers and associated peripherals, as defined in Part 1, intended as the **logic subsystem** of an electrical/electronic/programmable electronic (E/E/PE) safety-related system. It identifies a PLC and peripherals complying with the part as a **functional safety programmable logic controller (FS-PLC)**. An FS-PLC is generally a hardware/software subsystem and can include software elements such as predefined function blocks. [S1]

In plain language, the standard addresses the safety-relevant controller platform rather than just the ordinary ability to execute a control program. A supplier developing and evaluating such a platform needs a framework for its contribution to safety; an integrator needs to understand which declared configuration, interfaces and conditions are applicable when assigning logic to that platform. IEC's brief abstract does not establish that every module connected to a safety CPU or every application program is covered by the same claimed assessment. Check the specific product evidence.

**Boundaries of this investigation:** the public abstract does not enumerate full exclusions, use modes, all safety integrity levels, required tests, or the complete interface between product and application responsibilities. The official preview request returned HTTP 403 and no local full text was identified. Consequently the precise maximum SIL and its conditions, and precise scope of individual safety-relay modules, are **not independently confirmed here**. The historical batch claimed a SIL 3 ceiling and a universal exclusion of safety relay modules; these remain leads, not rules. In particular, its explanation that SIL 4 must be hardwired/non-programmable is not established and must not be imported. [S1, S5, S6]

## Technical coverage and use

The confirmed technical subject is requirements for a safety-related **PLC plus associated peripherals**, with combined hardware/software and possible predefined safety function blocks. [S1] The publicly visible abstract is too short to substantiate a clause-by-clause inventory of lifecycle processes, diagnostic architectures, software techniques, hardware fault tolerance, systematic capability, tests, EMC or mandatory safety data. Those are useful **questions to investigate** in the actual text and product safety manual, not asserted specific requirements of unread clauses.

For practical evaluation distinguish:

- **Product/platform:** exact CPU, safety input/output, communications, firmware and software-tool versions included in the supplier's claim; certificate and scope where available. A certification label does not establish coverage of other modules or combinations.
- **Interface and conditions:** published input and output limits, supply and protection, external wiring, isolation, permissible operating/environmental conditions, reaction and response times, diagnostic behavior, configuration and maintenance instructions. Record only values actually declared for the relevant configuration.
- **Application:** a machine-specific safety function includes sensing, logic, final element and their interactions. The user's specification, program, parameters, functional validation, response-time and fault-reaction analysis remain application tasks. A certified logic subsystem alone cannot establish the achieved integrity of the complete safety function.
- **Evidence:** distinguish manufacturer-declared SIL, PL, PFH/PFD or other measures and their conditions from inferred values. Whether each metric is available or required depends on the actual product and framework; do not assume every supplier must supply the historical batch's entire list.

These bullets are engineering interpretation and evidence prompts, not a reproduction of specific IEC 61131-6 clauses. Preserve bought-device external contracts; do not require reconstruction of proprietary circuits or firmware.

## Related standards and safety assessment

**IEC 61508:** IEC describes Part 1 as a basic safety publication for E/E/PE safety-related systems and as facilitating development of product/application standards. [S2] IEC 61131-6 provides the PLC-specific standard named above; the public abstract alone does not settle every normative-reference or equivalence question between editions. Consult the actual Part 6 text and supplier assessment for exact dependencies.

**IEC 62061:** its 2021 publisher scope addresses the design, integration and validation of safety-related control systems for machinery and calls itself a machinery-sector standard within the IEC 61508 framework. [S3] A controller may be one subsystem of that larger system. An application standard does not automatically validate its safety logic, sensors, actuators or installation. Check the exact applicable edition and machine-specific standard.

**ISO 13849-1:** a different machinery safety-control assessment route, addressing safety-related parts of control systems, including their combination. The locally held 2023 text §6.1.2 and §6.2.1, as checked in the preserved primary-source review, provides conditional SIL-subsystem correlation and requires combination validation; Category cannot always be deduced. [S5] This is not an automatic PL/SIL conversion, nor authority to populate missing vendor PL, Category, PFH or DC. The full applicability and current regulatory position require separate assessment. The attempted ISO catalogue page was blocked by a JavaScript challenge [S8]; no claim of having inspected it is made.

**IEC 61131-2:** its 2017 publisher abstract addresses functional and EMC requirements and verification tests for industrial control equipment; it reports removal of product-safety requirements in favor of IEC 61010-2-201. [S4] This is a distinct equipment/EMC and electrical-safety route, not a substitute for demonstrating safety-related logic capability. IEC 61131-1 is named by [S1] for definitions; IEC 61010-2-201 and machine-specific application standards may be relevant depending on device and use, but this investigation does not resolve their edition-specific normative relationships or legal applicability.

## Library and local holdings

For `safety_plc`, ask for the exact configuration and certificate scope, declared standard and edition, safety manual, compatible I/O and firmware, interfaces, published safety data and constraints. For `standard_plc`, ordinary PLC conformance does not itself establish safety eligibility; a hybrid modular controller must be checked at module and configuration level. For `safety_relay`, resolve whether the exact product actually falls in this part rather than transferring the historical report's categorical exclusion. A safety network, predefined block or CPU claim is not a complete machine safety function or library approval. Product-library evidence and machine-level validation remain separate. [S1, S5, S6]

The supplied actual-filesystem candidate list contains **no matching PDF, extracted Markdown or memory candidate** [S7]; no full held IEC 61131-6 edition was available for inspection. This is a candidate-based search result, not proof no copy exists anywhere. Historical batch 6 is a research reference only, not licensed normative text. **Recommendation: conditional acquisition or access** to the applicable full edition if product-development, certification, disputed exact scope, SIL ceiling, required data or detailed integration duties arise; otherwise use exact supplier safety manuals/certificates and the applicable machine assessment rather than purchasing solely on category membership.

## Sources and open questions

- [S1] IEC, [IEC 61131-6:2012 product and public abstract](https://webstore.iec.ch/en/publication/4555), checked 2026-11-02; scope abstract, not full standard.
- [S2] IEC, [IEC 61508-1:2010](https://webstore.iec.ch/en/publication/5515), public abstract, checked 2026-11-02.
- [S3] IEC, [IEC 62061:2021](https://webstore.iec.ch/en/publication/59927), public abstract, checked 2026-11-02. The page also points to a consolidated later amendment; no full edition audit was performed.
- [S4] IEC, [IEC 61131-2:2017](https://webstore.iec.ch/en/publication/31007), public abstract, checked 2026-11-02.
- [S5] Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, references ISO 13849-1:2023 §§6.1.2, 6.2.1 and held EN 62061:2005+A2:2015 §3.2.23. Targeted secondary record of local primary-text checking; not current-edition or legal-status verification.
- [S6] Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md`, IEC 61131-6 section; historical lead with quarantined claims.
- [S7] `NORMATIVE_CANDIDATES.json`, task-supplied filesystem candidate inventory, empty for this standard.
- [S8] [ISO catalogue page attempted](https://www.iso.org/standard/73481.html), blocked; identity and contents not independently verified.

**Remaining gaps:** exact full-text exclusions, SIL-range and validity conditions, lifecycle/verification and software details, normative companion references, amendments and EN/legal status. Do not infer any of them from the public abstract. Evidence snapshots and failed-access artifacts are listed in `SOURCES.json`.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `a4b4d78b067514062e6840d5875903ef66f09b3bf0fc108c171cdff51f5857a8`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61131-6`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61131-6",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full text and official preview unavailable; exact exclusions, SIL range, detailed requirements and normative references unresolved",
    "Amendment and regional adoption/legal status not exhaustively verified"
  ],
  "local_holdings_summary": "Candidate inventory contains no matching PDF, extracted text or memory; historical research is not full text."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/4555",
    "title_edition": "IEC 61131-6:2012 ed. 1",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "evidence/iec-4555.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract only; no clauses or exhaustive history"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxMTMxLTZ7ZWQxLjB9Yi5wZGY=",
    "title_edition": "IEC 61131-6 official preview request",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "evidence/iec-preview-403.html",
    "evidence_kind": "failed access",
    "coverage_limitation": "403; no preview read"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/5515",
    "title_edition": "IEC 61508-1:2010",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "evidence/iec-61508-lead.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Part 1 abstract only"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/59927",
    "title_edition": "IEC 62061:2021",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "evidence/iec-62061-lead.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract only"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/31007",
    "title_edition": "IEC 61131-2:2017",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "evidence/iec-61131-2.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract only"
  },
  {
    "source_url_or_path": "https://www.iso.org/standard/73481.html",
    "title_edition": "ISO catalogue page unverified",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "evidence/iso-13849.html",
    "evidence_kind": "failed access",
    "coverage_limitation": "Challenge page; content and identity not verified"
  },
  {
    "source_url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title_edition": "Safety source review",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Local prior review citing held standard text; no independent check of clauses here"
  },
  {
    "source_url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md",
    "title_edition": "Historical batch 6",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Contains unsupported or unresolved claims"
  },
  {
    "source_url_or_path": "NORMATIVE_CANDIDATES.json",
    "title_edition": "Candidate holdings for IEC 61131-6",
    "access_time_utc": "2026-11-02T23:04:33.670422+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "local inventory",
    "coverage_limitation": "Empty candidates; not a universal search"
  }
]
`````
