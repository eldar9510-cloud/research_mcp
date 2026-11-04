---
{
  "format": 1,
  "metadata": {
    "id": "iec-61800-5-2-detailed-research-2026-11-02",
    "title": "IEC 61800-5-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61800-5-2?",
    "scope": "Detailed IEC 61800-5-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.359Z"
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
  "sourceDigest": "b8d644cbd61df0fb35bfd99c26d424bfebf338cbaee44ada749581e9409720e3",
  "proposalRevision": "c7b5c1e2a815b1ec1ac8e273b2dcb108e1c0f163c72f4a3d24dc64c6db7c5d89"
}
---
# IEC 61800-5-2 — functional safety of adjustable-speed drives

**Source check: 2026-11-02 UTC.** This is scope and engineering-routing research, not a product approval, installed safety calculation, or legal determination. The 2007 full-text holding was inspected selectively; the 2016 edition and 2026 amendment were checked through IEC catalog pages only, not full text.

## Identity and publication status

IEC 61800-5-2, *Adjustable speed electrical power drive systems – Part 5-2: Safety requirements – Functional*, is an International Standard. IEC lists the second edition, IEC 61800-5-2:2016, published 18 April 2016, and Amendment 1:2026 published 30 October 2026. Its consolidated version **IEC 61800-5-2:2016+AMD1:2026 CSV**, edition 2.1, has the same 2026 publication date. IEC marks the previous first edition, published 16 July 2007, revised. These are IEC publication facts, not an EN-adoption or current OJEU finding. [IEC 2016](https://webstore.iec.ch/en/publication/24556); [IEC amendment](https://webstore.iec.ch/en/publication/79135); [IEC consolidated lifecycle](https://webstore.iec.ch/en/publication/117563).

The consolidation page repeats an extended list of changes relative to the previous edition; it does not isolate what Amendment 1 changed. Do not attribute that whole list to the 2026 amendment. The 2016 summary includes the terminology change from safety functions to safety *sub-functions*, ISO 13849 principles and additional immunity testing topics. Actual amendment content and implications remain unverified. IEC's mention of an informative low-demand estimation annex is not evidence that low-demand operation falls within the standard's scope. [IEC consolidated](https://webstore.iec.ch/en/publication/117563).

## What it is for and where it stops

A safety-related power drive system, PDS(SR), can contribute to risk reduction by performing drive-related safety sub-functions. IEC describes this as a product standard for design, development, integration and validation of such drives under the IEC 61508 functional-safety framework. It applies to adjustable-speed electrical power drive systems covered by the IEC 61800 series, as referred to in IEC 61800-2; it treats the PDS(SR) as a subsystem of a larger safety-related system. This is useful to drive developers, suppliers, system integrators and machine designers, who must connect a declared drive capability to a specific machine function. [IEC consolidated](https://webstore.iec.ch/en/publication/117563).

**Edition-specific full-text boundary:** the held 2007 §1 says its use is conditional on a functional-safety claim and high-demand or continuous operation; it directs low-demand applications to IEC 61508 and limits its scope to functions no higher than SIL 3. Its integration means integration of the PDS(SR) itself, not installation into a safety application. The 2007 exclusions include application hazard/risk analysis, identification of application safety functions, initial SIL allocation, driven equipment except interfaces, secondary process hazards, electrical/thermal/energy safety (Part 5-1), manufacturing process, and validity of commands to the drive. Security is not considered there. The installation designer must address the overall risk assessment and appropriate function and integrity requirements when the supplier is not responsible for driven equipment. These statements are verified for **2007**, not a clause-by-clause claim about 2016+2026. [L1 §1].

Thus a supplier's PDS(SR) declaration is a bounded input, not proof that the complete machine function is adequate. Conversely, this part is not a substitute for the ordinary product-safety and installation assessments of the power system. IEC's current public abstract supports the subsystem framing, but does not expose every present exclusion or normative requirement.

## Technical content and safety sub-functions

The held 2007 text maps a lifecycle from safety requirements specification and planning through design, integration, user information, verification/validation, test and modification. Its subject areas include random hardware failure, architecture, systematic integrity, fault detection and reaction, communications, electromagnetic immunity and documentation [L1 contents, §§5–10]. IEC's 2016/2026 catalog summary identifies additional thermal and mechanical immunity topics and testing, plus treatment of basic and well-tried principles; exact current requirements require the applicable full text. The standard concerns product/subsystem development and testing, not just an installer's wiring checklist.

2007 §4 gives non-exhaustive examples. Function names are useful interfaces, but are not interchangeable and do not establish which functions a particular drive actually provides:

- **STO** prevents the drive supplying motor energy that generates torque or linear force. It does not itself actively control deceleration; 2007 relates it to an uncontrolled stop. A load may continue to move or be moved by external forces. [L1 §4.2.2.2]
- **SS1** initiates deceleration followed by STO; 2007 describes alternative controlled, monitored or time-delayed implementations. A name alone does not reveal which implementation, timing or stopping distance is supplied. **SS2** instead ends in safe operating stop (SOS), whose 2007 description allows the drive to provide energy to resist external forces. [L1 §§4.2.2.3–4, 4.2.3.1]
- **SLS**, safe direction and position/acceleration/torque-related functions concern limits or directional control; **SSM** and safe cam provide safe output indications in the 2007 descriptions. Whether a particular function monitors, controls or signals, and the reaction to limit violation or detected fault, matters to integration. [L1 §§4.1, 4.2.3]
- **SBC** provides safe output signal(s) to control external brake(s), according to 2007 §4.2.3.12. It is not by itself evidence of brake torque, holding performance, brake mechanical integrity or validation of a complete suspended-load safety function.

The supplier's implementation, actual safety manual and declared configurations control the specific meaning and conditions of a bought drive; the above 2007 examples are not a replacement for the applicable edition or supplier documentation.

## Practical electrical and safety implications

For a candidate VFD, ask for exact model, safety option, hardware and firmware, function-specific certificate/declaration and manual revision, the standards and editions actually cited, permitted configurations, interface wiring, activation/reset behavior, timing, diagnostic and fault reactions, parameter limits, and any required external feedback, brakes, protection or power arrangements. Check the intended load, motor, encoder and feedback arrangement against stated compatibility and environmental limits. Preserve supplier-published external contracts; reverse engineering proprietary internal circuits is not necessary for component intake.

**STO is not an isolation device or a holding brake.** The 2007 text explicitly notes that external influences, including suspended loads, can require additional measures such as mechanical brakes, and that electronic means and contactors are not adequate for electric-shock protection and additional isolation may be necessary [L1 §4.2.2.2]. STO alone also does not decide whether a contactor is necessary: its removal or retention depends on the actual safety function, fault response, isolation needs, manufacturer instructions, and relevant machine-specific provisions. The old batch's blanket assertion that a certified STO legally permits contactor omission and guarantees a particular lift integrity level is not supported [L2, L3]. No present legal or lift-specific verdict is made here.

ISO 13849 or IEC 62061 system assessment is separate from the drive's declared capability. Inputs, logic, communications, output, external brake and feedback where relevant, common causes, operating conditions and fault response all affect the application. The held 2007 text says the PFH value for SIL refers to the complete safety function [L1 §6.2.1.1.1]. A safety label, dual-channel terminals or standard reference does not establish an installed PL, SIL, category, diagnostic coverage or electrical isolation. Preserve supplier values and conditions exactly; do not convert or invent missing PL/SIL data. Function and machine validation remain necessary.

## Related documents: distinct purposes

- **IEC 61508 series:** generic functional-safety framework underlying this drive product standard; consult the applicable referenced editions and sector context, not a direct assumption that a drive certificate establishes the whole system. [IEC consolidated; L1 §1]
- **IEC 61800-5-1:** drive electrical, thermal and energy safety companion identified in the 2007 scope; functional safety is not a substitute for electric-shock protection [L1 §1].
- **IEC 60204-1:** machinery electrical equipment and stopping context; the 2007 drive descriptions relate STO and SS1 to respective stop categories, not to a universal machine architecture [L1 §§4.2.2.2–3].
- **ISO 13849-1/-2 and IEC 62061:** machinery safety-related control-system design/validation routes. The 2007 introduction explains that integration under ISO 13849 may need further supplier information; the 2016 catalog summary identifies ISO 13849 principles [L1 introduction; IEC consolidated]. No automatic PL/SIL conversion follows.
- **IEC 61800-5-3:** a potentially relevant feedback-device companion; IEC identifies its actual subject as safety requirements for encoders, not a declaration that every encoder in a drive system is safety-rated. Selection depends on exact interface and function. [IEC 61800-5-3](https://webstore.iec.ch/en/publication/28614).

## Library and local holdings

Potential intake routes are `vfd`, and conditionally `motor`, `encoder`, `brake_controller` and `safety_brake`, according to the actual function and component role. Request the drive-specific safety manual/certificate and installation restrictions; for external safety feedback and brakes separately request their exact compatibility and declared data. These are evidence questions, not a new library schema, compliance verdict, or lifecycle approval. A general motor or encoder should not inherit a drive's safety declaration merely by association. [L2; L1 §1 and §4].

**Holding verified:** `NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61800-5-2_2007.pdf` is a 68-page IEC-authored PDF; the corresponding `NORMATIVE/extracted_html/IEC_61800-5-2_2007/IEC 61800-5-2_2007/auto/IEC 61800-5-2_2007.md` identifies first edition 2007-07, contains scope, contents and substantive clauses. The PDF metadata and extracted title were inspected; the full original PDF was not visually audited page by page, and extraction fidelity is not guaranteed. This is an older full-document holding, not the 2016 edition or 2026 amendment. [L1; IEC consolidated lifecycle].

**Recommendation:** conditionally update the holding when an actual current-edition clause or amendment question arises, especially for safety-drive selection or a supplier invoking 2016+AMD1:2026. Obtain the full applicable publication through authorized channels; retain 2007 for historical/supplier-edition questions. The parent owns any acquisition and import. Supplier-cited edition, IEC publication currency and regional/legal applicability are independent facts.

## Sources and limits

- [L1] Held IEC 61800-5-2:2007, first edition, PDF and MinerU extraction at paths above: especially introduction, §§1, 4, 5–10 and 6.2.1.1.1. Selectively examined; licensed full text is not reproduced here.
- [L2] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md` and `SAFETY_SOURCE_REVIEW.md`: earlier bounded corrections, not independent current-edition authority.
- [L3] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch05-drive-motor-gemini.md`, lines 28–32: historical lead containing the overbroad contactor claim; not a normative source.
- Public IEC pages linked above and their saved captures in `evidence/`; metadata in `SOURCES.json`. Pages establish catalog and abstract facts, not full current clause content. The public consolidated abstract's change list does not identify the amendment-specific delta. No product certificate, manufacturer-specific installation, EN adoption or OJEU record was investigated; no application-specific safety or legal decision follows.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `c24359e3e83b71e2be3428355b46795553b4eb5843e476c82ad694c8d004da29`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61800-5-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61800-5-2",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full text of 2016 edition and 2026 amendment not inspected; amendment-specific changes unresolved",
    "No EN adoption/OJEU or specific device certificate and application assessment"
  ],
  "local_holdings_summary": "Full-document 2007 first-edition PDF and extracted text held and selectively inspected; no current-edition text established."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source": "https://webstore.iec.ch/en/publication/24556",
    "title": "IEC 61800-5-2:2016 edition 2",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "evidence/686e18cdbc.html",
    "evidence_kind": "public scope and lifecycle",
    "limitation": "abstract only"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/117563",
    "title": "IEC 61800-5-2:2016+AMD1:2026 CSV",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "evidence/iec-consolidated.html",
    "evidence_kind": "public scope and lifecycle",
    "limitation": "amendment delta not identified"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/79135",
    "title": "IEC 61800-5-2:2016/AMD1:2026",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "evidence/iec-79135.html",
    "evidence_kind": "publisher catalog",
    "limitation": "no amendment full text"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/5937",
    "title": "IEC 61800-5-2:2007",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "evidence/iec-5937.html",
    "evidence_kind": "publisher catalog",
    "limitation": "historical publication"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61800-5-2_2007.pdf",
    "title": "IEC 61800-5-2:2007 first edition",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "original read-only PDF",
    "evidence_kind": "held full text",
    "limitation": "PDF metadata inspected; not page-by-page"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_61800-5-2_2007/IEC 61800-5-2_2007/auto/IEC 61800-5-2_2007.md",
    "title": "IEC 61800-5-2:2007 first edition",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "original read-only extracted text",
    "evidence_kind": "held full text extraction",
    "limitation": "selective inspection; extraction may contain errors"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "PRIMARY_SOURCE_CHECKS.md",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "original read-only file",
    "evidence_kind": "old research lead",
    "limitation": "not current normative authority"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "SAFETY_SOURCE_REVIEW.md",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "original read-only file",
    "evidence_kind": "old research lead",
    "limitation": "not current normative authority"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch05-drive-motor-gemini.md",
    "title": "batch05-drive-motor-gemini.md",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "original read-only file",
    "evidence_kind": "old research lead",
    "limitation": "not current normative authority"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/28614",
    "title": "IEC 61800-5-3:2021",
    "accessed_utc": "2026-11-02T23:03:40Z",
    "evidence_path": "evidence/9473bfe664.html",
    "evidence_kind": "publisher catalog",
    "limitation": "Title and scope only; not full text"
  }
]
`````
