---
{
  "format": 1,
  "metadata": {
    "id": "iec-62061-detailed-research-2026-11-02",
    "title": "IEC 62061 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 62061?",
    "scope": "Detailed IEC 62061 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:31.204Z"
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
  "sourceDigest": "35eefa8f5683303be397b2da1600a2981d6cbbed40d488deb360c4f513edc455",
  "proposalRevision": "d7137f82d8cfd65a3f5396b96afa622fdc9048f36f9c301310f412df747d5beb"
}
---
# IEC 62061 — functional safety of machinery control systems

**Research date:** 2026-11-02 UTC. **Purpose:** engineering reference, not safety design approval, conformity assessment or legal advice. Sources [1–4] are identified below. The newer edition has been examined through IEC's public catalog, not its complete clauses; the locally held earlier edition was examined selectively through its PDF and extracted text.

## Identity and edition

IEC 62061 is an International Standard. Its second edition is titled *Safety of machinery — Functional safety of safety-related control systems*. IEC lists the base edition IEC 62061:2021, published 22 March 2021, and consolidated IEC 62061:2021+AMD1:2024 (edition 2.1), published 28 March 2024. IEC says the second edition cancels and replaces the 2005 edition and its 2012 and 2015 amendments and is a technical revision [1, 2]. IEC's lifecycle data on the pages lists a further amendment as **preparing**, not published; its displayed stage/forecast differs across product pages and the forecast is in the past, so neither the stage nor publication date should be inferred from it [1–3].

The local PDF is **BS EN 62061:2005+A2:2015**, a UK implementation of the European standard. Its national foreword identifies it as identical to IEC 62061:2005 with IEC amendments 1:2012 and 2:2015 and IEC corrigenda of 2005 and 2008, also incorporating the European February 2010 corrigendum [4]. The cover carries overlapping A1/A2 text, but the national foreword unambiguously identifies the A2 consolidation; PDF has 102 pages. It is not the 2021/2024 standard. The relevant EN adoption, jurisdiction-specific legal listing and transition status for a particular machine were not checked. IEC publication status cannot establish any of these.

## Purpose and scope

A safety function may need a control system to detect an unsafe condition, process the signal and bring a machine to a specified response reliably. IEC 62061 provides a sector-specific framework for specifying, designing, integrating and validating such machinery safety-related control systems; it is intended for machine designers, control-system manufacturers, integrators and others responsible for the function [1, 4 introduction]. Its purpose is not to certify a standalone switch merely because it appears in such a function.

The 2021+AMD1 publisher scope covers systems used singly or in combination to implement safety functions on machines not portable by hand while working, including coordinated groups of machines. It places the standard within IEC 61508, excludes the design of complex programmable electronic subsystems or elements, and describes the main body's requirements as addressing high/continuous demand operation [1]. The publisher identifies the extension to non-electrical technologies as a significant change from the first edition [2]; this is a scope change, not evidence that all hydraulic or pneumatic device construction requirements are supplied by IEC 62061.

The held 2005+A2 edition specifically addresses safety-related **electrical, electronic and programmable electronic** control systems, with injury and health risks arising from machinery hazards. It excludes performance requirements for non-electrical control elements and electrical hazards of the control equipment itself, identifies IEC 60204-1 for electrical hazards, and does not replace guarding or other necessary machinery safeguards. Process safety can entail additional sector requirements, such as IEC 61511 [4 §1]. These exclusions are edition-qualified; consult the 2021+AMD1 text rather than automatically transferring each old-edition restriction.

## Lifecycle and technical subjects

The held edition's introduction places its main lifecycle coverage from allocation of safety requirements through validation, with information for later use. Its contents and objectives show the following practical workflow [4 introduction, §§4–10]:

1. **Manage functional safety:** plan and coordinate technical activities, responsibilities and safety information.
2. **Specify each safety-related control function:** describe what it must do and its integrity requirements, tied to the relevant hazard and intended application. The old edition includes an informative SIL-assignment method; it is not a substitute for the machine risk assessment.
3. **Design and integrate:** allocate functions to subsystems; address fault behaviour, systematic integrity, architecture, selection of hardware and software, diagnostic functions, common cause failures, implementation and testing. A function is the complete chain, not just a controller label.
4. **Verify and validate:** review design evidence and test the integrated system against the specification. The held text separately treats validation of systematic safety integrity; a calculated failure measure alone is not the entire case.
5. **Use, modification and documentation:** supply installation, operation and maintenance information; manage modifications, configuration and re-verification, retaining the documented basis.

These descriptions are a reading guide to the **held edition**, not a clause-by-clause synopsis of 2021+AMD1. IEC identifies changes in 2021 including a changed structure, functional safety plan, configuration management, expanded parameterization, security reference, periodic testing, software use cases and replacing the subsystem term SILCL with maximum SIL [2]. The effect of the 2024 amendment and exact current requirements cannot be established from the catalog abstract alone. Terminology and requirements must be checked against the edition actually used.

## Relationship to other standards

- **ISO 12100:** provides the broader machinery risk assessment and risk reduction context referenced in the held edition. IEC 62061 addresses the control-function contribution, not the whole hazard inventory or all protective measures [4 introduction].
- **ISO 13849-1 and -2:** offer machinery safety-related control-part design and validation routes. The held IEC 62061 introduction describes the two approaches within their respective scopes and allows integration of subsystems designed under ISO 13849 [4 introduction and references]. Choice and combination require edition-specific applicability and validation. A PL, SIL, Category or PFH declaration is not an automatic conversion into another manufacturer declaration; documented, conditional correlation and combination rules are not a general conversion table [5].
- **IEC 61508:** the generic functional-safety framework; IEC 62061 is its machinery-sector application. The 2021 publisher scope specifically excludes designing complex programmable electronic subsystems, so source their development and integrity evidence separately [1]. The old EN edition excludes SIL 4 from its scope [4 §3.2.23]; that is not a claim that SIL 4 systems must be hardwired or non-programmable.
- **IEC 60204-1:** addresses machinery electrical equipment; it and the appropriate machine-specific standard must be considered separately from functional-safety control design [4 §1]. Machine-specific requirements and product standards can govern aspects such as a sensor, protective device, actuator or drive, but their applicability depends on the exact equipment and use; neither a product standard nor IEC 62061 alone proves complete machine safety.

## Electrical and library application

This is principally a **system and integration** standard, not a universal device-construction or type-test standard. For a guard interlock, protective sensor, safety PLC or relay, contactor, drive or brake-control chain, a useful intake question is: what exact function and interface does the component contribute to, and what conditions must the integrator meet? A manufacturer's device certification, declared safety data, response/fault behaviour and manual are evidence inputs, not the outcome of verification of the assembled function. For a basic component, request relevant declared properties and usage limits rather than assuming it is a certified subsystem.

For existing `door_interlock`, `e_stop`, `light_curtain`, `laser_scanner`, `safety_plc`, `safety_relay`, `contactor`, `vfd`, `encoder`, `brake_controller` and `safety_brake` categories, preserve exact variant, hardware/firmware, manufacturer safety manual, function scope, interface and environmental conditions, test/diagnostic and maintenance assumptions, and any explicit integrity data or certificates. Where appropriate, confirm response timing and fault reaction for the integrated function. An ordinary PLC or relay in a category is not automatically safety-rated. Vendor prescribed external wiring and components matter; reverse engineering a purchased device's proprietary internals is not a prerequisite for library intake. Category membership and conformity claims must remain distinct [4 §§5–8; 5].

A drive's safety function does not automatically dispense with isolation, stopping or holding measures; those are application decisions. Similarly, linked contacts alone do not establish implemented diagnostic coverage or subsystem Category. Do not derive missing PL/SIL values, infer complete-machine integrity from a certificate, or apply an unsupported SIL 4 architectural prohibition [5].

## Local holdings and recommendation

The candidate PDF is a full locally held 102-page earlier consolidated standard, not merely an abstract; its identity was checked in its own cover and foreword. The local MinerU text contains a complete table of contents and clause extraction, though extraction can introduce errors and should be checked against the PDF for decisive interpretation [4]. This investigation inspected the identity, scope, introduction and contents selectively, not all technical clauses or tables. It found no evidence in the provided matching-candidate list of a full 2021+AMD1 holding. The existing safety-source review is secondary research, not a newer standard [5].

**Recommendation:** retain and label the old EN holding as edition-specific historical/full-text evidence. If active design or edition reconciliation requires the 2021+AMD1 route, conditionally obtain authorized access to the applicable full current text and relevant regional adoption, and compare the clauses actually needed. This is a targeted update recommendation, not a purchase instruction or a conclusion that older supplier evidence is invalid.

## Sources and limits

1. IEC, [IEC 62061:2021+AMD1:2024 consolidated catalog and lifecycle](https://webstore.iec.ch/en/publication/93654), public abstract and publication metadata, accessed 2026-11-02. Saved `evidence/iec-93654.html`.
2. IEC, [IEC 62061:2021 catalog](https://webstore.iec.ch/en/publication/59927), scope, revision summary and lifecycle, accessed 2026-11-02. Saved `evidence/iec-59927.html`.
3. IEC, [IEC 62061:2021/AMD1:2024 catalog](https://webstore.iec.ch/en/publication/71331), amendment record and lifecycle, accessed 2026-11-02. Saved `evidence/iec-71331.html`.
4. Local `NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/EN 62061_2005+A2_2015.pdf`, cover and national foreword, and `NORMATIVE/extracted_html/EN_62061_2005+A2_2015/EN 62061_2005+A2_2015/auto/EN 62061_2005+A2_2015.md`, contents, introduction, §§1, 3.2.23 and 4–10 headings; local path rooted at `/media/eldar/disk_2/Machine_concept`. Licensed text not redistributed.
5. Local prior bounded `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, specifically PL/SIL, contact diagnostics, STO and SIL4 evidence; source-qualified review, not present legal or current-edition audit.

Open questions: precise 2024 amendment changes, current national/EN adoption and jurisdictional listing, and requirements of any specific machine/product remain outside this research. Catalog abstracts are not a substitute for full normative text; no design, safety calculation, certification or legal status was assessed.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `94277ac04a9377163de62db6fca2d9d86c42e32dab6930a51eeb73a25c575192`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-62061`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 62061",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "2021+AMD1:2024 full text and exact amendment changes not inspected",
    "National/EN adoption and present legal listing not verified"
  ],
  "local_holdings_summary": "Full 102-page BS EN 62061:2005+A2:2015 PDF and extracted text held; selectively inspected; no newer full text in provided candidates."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/93654",
    "title": "IEC 62061:2021+AMD1:2024 CSV",
    "access_time_utc": "2026-11-02T23:05:01Z",
    "evidence_path": "evidence/iec-93654.html",
    "evidence_kind": "public scope and publication metadata",
    "coverage_limitation": "Publisher abstract and lifecycle only, not full text."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/59927",
    "title": "IEC 62061:2021",
    "access_time_utc": "2026-11-02T23:05:01Z",
    "evidence_path": "evidence/iec-59927.html",
    "evidence_kind": "public scope and publication metadata",
    "coverage_limitation": "Publisher abstract and revision summary only."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/71331",
    "title": "IEC 62061:2021/AMD1:2024",
    "access_time_utc": "2026-11-02T23:05:01Z",
    "evidence_path": "evidence/iec-71331.html",
    "evidence_kind": "public scope and publication metadata",
    "coverage_limitation": "Publication metadata only; full amendment not inspected."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/EN 62061_2005+A2_2015.pdf",
    "title": "BS EN 62061:2005+A2:2015",
    "access_time_utc": "2026-11-02T23:05:01Z",
    "evidence_path": null,
    "evidence_kind": "locally held full text",
    "coverage_limitation": "Cover and national foreword checked; licensed text not copied."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/EN_62061_2005+A2_2015/EN 62061_2005+A2_2015/auto/EN 62061_2005+A2_2015.md",
    "title": "EN 62061:2005+A2:2015 extracted full text",
    "access_time_utc": "2026-11-02T23:05:01Z",
    "evidence_path": null,
    "evidence_kind": "local full text extraction",
    "coverage_limitation": "Selective scope, introduction and subject review; extraction may contain errors."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Safety source review",
    "access_time_utc": "2026-11-02T23:05:01Z",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Bounded prior source review; not a current edition or regulatory audit."
  }
]
`````
