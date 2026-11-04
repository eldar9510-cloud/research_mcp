---
{
  "format": 1,
  "metadata": {
    "id": "iec-61496-2-detailed-research-2026-11-02",
    "title": "IEC 61496-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61496-2?",
    "scope": "Detailed IEC 61496-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.922Z"
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
  "sourceDigest": "3c2aa3c07ce57160336fd5c1bf6bdf613b39b4a9d141bcb6a9af2abef9ffe0db",
  "proposalRevision": "7449df4cb5498fd2a0c7e9c5b61e4e877503395bc309a82ea7aca6438c58e816"
}
---
# IEC 61496-2 — AOPD protective equipment

**Checked 2026-11-02 UTC.** IEC 61496-2:2020, *Safety of machinery — Electro-sensitive protective equipment — Part 2: Particular requirements for equipment using active opto-electronic protective devices (AOPDs)*, is an International Standard, edition 4.0, published 2020-07-15. The IEC catalog calls it the base publication, reports a 2027 stability date, and says it technically revises and replaces edition 3 (2013). A stability date is not an expiry date. The inspected page does not expose a usable complete lifecycle/history or amendment list, so absence of later amendments or editions is **not independently established**. [I] The held document is the 2020 IEC edition, not proof of a current EN adoption, OJEU status, or a supplier's declared edition. No legal-status check was performed.

## What it does and who uses it

An AOPD uses its own emitted optical radiation and a receiver to sense interruption by an opaque object. A safety light curtain and a light-beam protective device are examples identified in the 2020 definitions; the category is not restricted to multi-beam curtains or a specific colour of infrared light. [L §§3.201, 3.204–3.205] It gives equipment makers, test bodies and machinery integrators a common basis for the equipment's sensing performance, fault behavior, interfaces, test evidence and instructions. The purpose is a protective signal before exposure to a hazard, rather than a process sensor simply reporting that an object is present. An AOPD does not itself stop the machine: the machine's safety-related control and final elements must respond appropriately. [L introduction, §§1, 4.1.2]

## Scope and boundaries

**Publisher/held-text scope:** The document covers design, construction and testing of ESPE designed specifically to detect persons in a safety-related system, using an AOPD sensing function. It can also be relevant to protecting machinery or products, but differing target properties may require additional provisions. It excludes AOPDs using radiation outside 400–1,500 nm and does not deal with EMC **emissions**. This is a scope limit, not a claim that the complete equipment is exempt from all EMC or immunity obligations. [I; L §1]

Part 2 does not fix a particular machine's hazardous state, detection-zone dimensions, configuration or position relative to dangerous parts. It addresses equipment operation and its interface with the machine. [I; L §1] **Interpretation:** a catalog reference cannot decide reach, access routes, stopping distance, restart logic or suitability for a machine. An optical plane can be crossed and then clear while someone remains beyond it; where that scenario matters, the system requires an appropriately assessed arrangement, not an assumption that a clear curtain means nobody is inside.

Part 2 is not a blanket standard for all optoelectronic sensors or all laser scanners. IEC 61496-3 addresses ESPE with active optoelectronic protective devices responsive to diffuse reflection (AOPDDR); determine the actual sensing principle and manufacturer's claimed scope rather than assigning a part by category name. [B; L §3.201] A non-safety door-obstruction photocell is not converted into an AOPD by its optical principle alone. Machine-specific door and lift requirements must be assessed against the applicable machine text, not imported as universal curtain height, detection, time or distance values. The older batch's categorical lift/scanner selection claims and Type-to-PL ladder are not adopted here. [B; R]

## Relationship to Part 1 and technical content

The 2020 foreword explicitly requires use with **IEC 61496-1:2020**. Part 2 supplements or modifies corresponding Part 1 clauses: unchanged Part 1 clauses apply as appropriate; marked additions, modifications and replacements alter them. The fourth edition moved common requirements and tests to Part 1 while leaving sensing-technology-dependent tests here. It is therefore wrong to treat Part 2 alone as the entire ESPE specification or to assume it duplicates all common electrical and environmental tests. [L foreword; I]

The following is a targeted reading of the held 2020 text, not an exhaustive compliance checklist:

* **Sensing and faults:** §4.1.2 addresses the specified detection zone, test-piece detection and output OFF response. §4.1.3 considers types 2, 3 and 4 and distinguishes their fault and environmental performance. Type 2 periodic-test configurations can be externally or internally initiated/evaluated; Annex AA gives examples, not a universal wiring prescription. Types 3 and 4 normally have two OSSD outputs, but the section also permits an appropriately compliant single safety-related data interface as an alternative. Do not infer exact terminals or architecture from a device type. [L §§4.1.2–4.1.3, 4.2.2.3, AA]
* **Optics and environment:** §4.2.12 and §5.2 examine integrity of detection capability, alignment, extraneous reflection/optical bypass and the electro-optical subsystem. Additional reflective-object provisions apply to particular retro-reflective and mixed emitter/receiver configurations; ordinary redirecting mirrors are distinguished from retro-reflective technique. Test routes differ with optical design. Light interference is addressed in §5.4.6. [L §§4.1.2.2, 4.2.12, 5.2, 5.4.6] These are equipment qualification tests, not a substitute for assessing installed reflective surfaces, contamination and operating conditions.
* **Documentation and options:** the accompanying-document provisions address installation effects of reflective surfaces, approach/penetration information, detection capability and interference. Annex A addresses optional blanking and reduced resolution, including configuration and verification. Blanking is not the same as reduced resolution: the latter changes detection capability; configured modes can affect positioning and response. The document also distinguishes automatic selection of these configurations from muting. [L §7, Annex A.10–A.12] Do not assume that an optional function is present, enabled or suitable on a bought unit.

## Electrical and safety application

For a real unit ask for its exact model, emitter/receiver and accessories, manufacturer declaration or certificate and edition, safety manual, relevant configuration/firmware, stated detection capability and protected height/range, response time for every selected mode, permitted alignment, environmental conditions and optical interference/reflective-surface restrictions. Obtain the prescribed supply range, protective and wiring requirements, output/interface characteristics, compatible input and diagnostic behavior, cable/connector constraints, reset and external-device-monitoring arrangements if provided. These are **data questions**, not claims that every unit has every option. Retain manufacturer-specified external components and instructions; no reverse engineering of proprietary optics, electronics or firmware is required for ordinary component intake. [L §§4.1.3, 7, Annex A; R]

For a machine safety function, assess the hazard and required integrity independently; evaluate sensor, logic and final switching/stopping elements together, including their response times, faults, wiring, any mode selection and diagnostics. Check physical positioning, ability to reach around/over/under or remain behind the detection field, other hazards such as ejected material, and reset/restart behavior. Validate actual operation and stopping performance under the applicable application standard and manufacturer conditions. An ESPE is not a physical containment guard. These are integration considerations, not claims that Part 2 specifies a universal arrangement. [L introduction, §1, §7; R]

A certificate or declared device type can support evidence for the specific device/subsystem and stated conditions; it does not establish the achieved PL or SIL of the complete installed function. Record any manufacturer-declared PL, SIL, PFH and other safety data with source and scope; do not manufacture numbers, diagnostics, category or conversions from the type alone. Selection against PLr and validation remain application-level tasks. [R; L §4.1.3]

## Related documents and library use

* **IEC 61496-1:2020:** general ESPE requirements and tests, explicitly paired with the held part. [L foreword]
* **ISO 13855:** safeguard positioning relative to approach speeds; referenced in Part 2 and its instructions for blanking/reduced resolution. Select the edition applicable to the machine, not a distance inferred from the device type. [L §2, §7]
* **IEC 62046:** application guidance for protective equipment; Part 2's instructions point to additional means needed around blanked areas. [L §7]
* **ISO 13849-1 / IEC 62061:** relevant control-system safety frameworks; Part 2 cites them for external selection devices for configurations. Neither replaces the equipment-specific assessment or establishes a rating without evidence. [L Annex A.12]
* **IEC 61496-3:** distinct AOPDDR sensing route; verify exact device and applicable edition separately. [B]

The `light_curtain` category is a strong review route when the exact device declares an AOPD safety function. `laser_scanner` requires subtype review, often the Part 3 route rather than automatic Part 2 assignment. Distinguish protective curtains from ordinary automation beams and door-obstruction sensors. Keep standard references and supplier evidence separate from part approval, category data and machine validation. [R; B]

## Local holdings and limitations

The actual local PDF `NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61496-2_2020.pdf` has 52 PDF pages and IEC author metadata; the corresponding existing MinerU text identifies edition 4.0, 2020-07, the precise Part 2 title, scope, foreword, clauses and annexes. This is a **full-document holding** with targeted clause inspection, not a complete clause-by-clause or original-PDF visual audit. The extraction can contain formatting errors; consult the original PDF for design-critical details. [L] Neither a Part 1 holding nor a particular EN adoption was verified in this assignment. Do not repurchase the already held Part 2 by default; **conditional update/acquisition** only if an actual supplier/application or a verified newer publication requires an edition not held, or if the paired Part 1 text is needed and its holding is independently found absent. Parent decides holdings and acquisition.

No supplier-specific documentation, EN adoption, legal listing, amendment exhaustiveness or machine configuration was inspected. This report makes no compliance determination. The 2020 text provides detailed equipment evidence; it is not evidence for uninspected newer text. Earlier batch claims are research leads, not authority.

## Source key

* [I] IEC official catalog, [IEC 61496-2:2020](https://webstore.iec.ch/en/publication/63117), inspected 2026-11-02 UTC; saved `evidence/iec-63117.html`.
* [L] Held IEC 61496-2:2020 MinerU text at `/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_61496-2_2020/IEC 61496-2_2020/auto/IEC 61496-2_2020.md`, with original PDF at the holdings path above. Targeted sections identified inline.
* [B] Historical `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch04-espe-gemini.md`; truncated secondary lead, not independent verification of Part 3 or lift claims.
* [R] Same research directory, `README.md`, `PRIMARY_SOURCE_CHECKS.md` and `SAFETY_SOURCE_REVIEW.md`; bounded project research corrections, not a current legal audit.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `3c6239949aa107ffb4c5b6ec9dbea48ae7fbb90374ab57a9ff7c270d12a04df3`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61496-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61496-2",
  "report_path": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Complete amendment and newer edition lifecycle not verified from dynamic IEC history",
    "EN adoption and current legal/OJEU status not verified",
    "No supplier-specific documents or machine application verified",
    "Held text targeted reading, not exhaustive original-PDF audit"
  ],
  "local_holdings_summary": "Full IEC 61496-2:2020 fourth-edition PDF and matching extracted text found; paired Part 1 holding not checked."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source": "https://webstore.iec.ch/en/publication/63117",
    "title": "IEC 61496-2:2020 edition 4.0",
    "access_time_utc": "2026-11-02T23:03:01.167865+00:00",
    "evidence_path": "evidence/iec-63117.html",
    "evidence_kind": "public scope",
    "limitation": "Base publication and scope; full lifecycle/history and amendment absence not established."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_61496-2_2020/IEC 61496-2_2020/auto/IEC 61496-2_2020.md",
    "title": "IEC 61496-2:2020 edition 4.0",
    "access_time_utc": "2026-11-02T23:03:01.167865+00:00",
    "evidence_path": "existing read-only local path; not copied",
    "evidence_kind": "full text",
    "limitation": "Targeted sections only; extraction may contain errors; licensed text not redistributed."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61496-2_2020.pdf",
    "title": "IEC 61496-2:2020 local PDF",
    "access_time_utc": "2026-11-02T23:03:01.167865+00:00",
    "evidence_path": "existing read-only local path; not copied",
    "evidence_kind": "full text",
    "limitation": "PDF metadata and page count inspected; content identity determined from matching extraction, not visual PDF audit."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "README.md",
    "access_time_utc": "2026-11-02T23:03:01.167865+00:00",
    "evidence_path": "existing read-only local path; not copied",
    "evidence_kind": "old research lead",
    "limitation": "Secondary historical research and bounded corrections, not legal authority."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "PRIMARY_SOURCE_CHECKS.md",
    "access_time_utc": "2026-11-02T23:03:01.167865+00:00",
    "evidence_path": "existing read-only local path; not copied",
    "evidence_kind": "old research lead",
    "limitation": "Secondary historical research and bounded corrections, not legal authority."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "SAFETY_SOURCE_REVIEW.md",
    "access_time_utc": "2026-11-02T23:03:01.167865+00:00",
    "evidence_path": "existing read-only local path; not copied",
    "evidence_kind": "old research lead",
    "limitation": "Secondary historical research and bounded corrections, not legal authority."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch04-espe-gemini.md",
    "title": "batch04-espe-gemini.md",
    "access_time_utc": "2026-11-02T23:03:01.167865+00:00",
    "evidence_path": "existing read-only local path; not copied",
    "evidence_kind": "old research lead",
    "limitation": "Secondary historical research and bounded corrections, not legal authority."
  }
]
`````
