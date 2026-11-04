---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-5-1-detailed-research-2026-11-02",
    "title": "IEC 60947-5-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-5-1?",
    "scope": "Detailed IEC 60947-5-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.491Z"
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
  "sourceDigest": "36e93a8058f4b7b428ba0d7ec0a09ab536540b4048deb6f0cd4f736a40d411f1",
  "proposalRevision": "1aa1e3e7480d4d7186c79c8e3a0465899e4da6c59b5e463072ac418fa21fe2a6"
}
---
# IEC 60947-5-1 — electromechanical control-circuit devices

**Publication check: 2026-11-02 UTC. Research status: partial; official scope and publisher change summary inspected, complete normative text not inspected.** This is a product-standard investigation, not evidence that any specific product or machine complies.

## Identity and purpose

[IEC 60947-5-1:2024](https://webstore.iec.ch/en/publication/65935), *Low-voltage switchgear and controlgear – Part 5-1: Control circuit devices and switching elements – Electromechanical control circuit devices*, is an International Standard published 26 March 2024, edition 5.0. IEC identifies it as a technical revision that cancels and replaces edition 4.0 (2016). The inspected IEC lifecycle data identifies the 2024 publication as published; no later amendment is shown in that lifecycle record. This is a dated publisher check, not a guarantee that a later change cannot occur. An EN adoption, its possible amendments and OJEU status were not checked; they must not be equated with the IEC record. A supplier's older declared edition must be preserved as actually cited, not rewritten to 2024. [S1]

The standard concerns the devices through which an operator or mechanical event controls, signals or interlocks other electrical equipment. Its common reference framework is useful to device manufacturers, test laboratories, switchgear designers and machine integrators comparing product characteristics. It is not itself the overall machine design or risk-assessment standard. [S1; interpretation]

## Scope and boundaries

IEC's abstract says it applies to control-circuit devices and switching elements intended for control, signalling, interlocking and similar functions of switchgear and controlgear. Its stated rated-voltage ceiling is 1,000 V AC at frequency not exceeding 1,000 Hz, or 600 V DC. These are **scope limits, not a rating of an individual switch or a permission to switch every load below those voltages**. [S1]

Potential applications include electromechanical position/limit switches, pushbutton contact elements and mechanical interlock switches, but actual inclusion depends on the exact product and full scope. Being physically operated or installed in a lift does not alone establish that a particular assembly conforms. The IEC summary mentions updated scope structure and exclusions but does not enumerate them. Therefore no exhaustive exclusion list is claimed here; obtain the edition's actual scope before deciding a borderline device. [S1; examples are routing interpretations]

The distinction is important where a device is electronic or uses magnetic/non-contact sensing. [IEC 60947-5-2:2019](https://webstore.iec.ch/en/publication/32517) covers several non-mechanical proximity switch technologies; the IEC description of [IEC 60947-5-3:2026](https://webstore.iec.ch/en/publication/75167) adds fault-performance requirements to -5-2 and to the 2024 -5-1 reed-contact magnetic-switch provisions. This does not prove that every non-contact sensor is a -5-3 device or that every -5-1 device is safety-rated. [S2, S3]

## Technical subjects and electrical relevance

The publisher describes revisions to control-circuit requirements, service conditions including shock and vibration, marking and environmental information, construction and associated tests, and EMC. It also identifies new reed-contact magnetic-switch requirements, insulation-related provisions, revised pull-out tests and audible signalling information. These are a **publisher change summary**, not a complete account of the actual requirements, pass criteria, application scope of each provision, or tests required for a given product. IEC's public abstract is insufficient to resolve detailed direct-opening, mechanically linked-contact, endurance or utilization-category requirements. [S1]

In practical design, a control contact is an interface between an initiating action and a load or input. Selection needs the exact manufacturer's data for the switched circuit: AC or DC, actual voltage, load type and current, including inrush or inductive behavior, and the applicable utilization/rating and switching frequency. A small signal input, a relay coil and a lamp are not automatically interchangeable loads. Check the supplier's permissible protective device/coordination, wiring and terminal arrangements, installation environment, ingress protection where stated, and service/actuator limits. These are engineering evidence questions, not values supplied by the IEC abstract. The standard's scope limit alone does not resolve any of them.

For an actuated switch ask how the external actuator travels, mounting and alignment are specified; which contacts are normally open/closed and which terminal numbers belong to them; and whether the exact contact block and actuator combination carries the required declaration. Where mechanically linked contacts or direct-opening behavior matter, request the manufacturer's precise declaration, applicable edition, contact identifiers, mounting and operating conditions. Do not infer these properties from a drawing, category label or another variant. Keep the purchased unit a black box: supplier-prescribed external connections and conditions matter; proprietary circuit or mechanism disclosure is not a default prerequisite.

## Safety-function role and limitations

A mechanical switch can be an input element of a guard, limit or emergency-stop safety function, but its product-standard reference alone does not establish the safety function's Category, PL, SIL, diagnostic coverage or fault response. A complete safety function also depends on mechanical arrangement, architecture, monitoring where applicable, wiring, control logic, final elements and validation. Even a manufacturer-certified subsystem is only as applicable as its documented identity and conditions. Product conformity and whole-machine validation are separate questions.

For ISO 13849 assessment, request applicable supplier reliability and failure-mode evidence for the specific contact/actuation configuration and usage conditions; where a B10d value is actually supplied, preserve its source and assumptions. Do not infer that every -5-1 device must have a published B10d or manufacture one from the standard reference. Likewise, mechanically linked contacts may support a diagnostic measure but do not themselves implement monitoring or automatically yield any diagnostic coverage. The previous local review checked this distinction against the held ISO 13849-1:2023 text and cautioned against deriving Category or coverage solely from contact construction. [L2, section 4; L3]

The prior batch asserts detailed annex identifiers, a symbol-based verdict and universal lift requirements. These claims have **not** been independently verified against the assigned 2024 text and are not adopted here; a particular machine application and actual standard edition must be checked. The supplier's marking and relevant declaration can be evidence, not an automatic judgment from a missing symbol alone. [L1, L2]

## Related standards — distinct roles

* **IEC 60947-1:** general low-voltage switchgear/controlgear family context. Confirm the actual normative references and edition in the applicable -5-1 text; the abstract alone does not establish which edition is incorporated.
* **IEC 60947-5-2:** proximity switches of the types described in its scope; not simply another name for a mechanical position switch. [S2]
* **IEC 60947-5-3:** additional fault-behavior requirements for proximity devices with defined behavior under fault conditions; the 2026 IEC abstract expressly relates it to -5-2 and -5-1 reed-contact magnetic switches. Additional application-specific characteristics can still be needed. [S3]
* **IEC 60947-5-5:** its 2026 abstract identifies electrical and mechanical construction and testing for emergency-stop devices with mechanical latching. A specific emergency-stop assembly's declared product standard must be checked rather than inferred solely from the generic switch contact. [S4]
* **ISO 13849-1 / IEC 62061:** machine safety-related control-system assessment routes, distinct from the component's product characteristics. **IEC 60204-1** addresses electrical equipment of machinery; application-specific machinery and interlock standards may add obligations. Verify the applicable editions and exact clauses for the machine; this research does not settle them. [L2, L3; engineering routing]

## Library use and holdings

For `limit_switch`, `door_interlock` and `e_stop`, use -5-1 as a candidate when the actual device and contact technology justify it, not as an automatic category assignment. For magnetic and electronic devices consider the neighboring parts above. Evidence requests should identify manufacturer and article, complete actuator/contact combination, product declaration and edition; electrical ratings by load type, mechanical interface, installation conditions, protection, and any explicitly declared safety-use data. Preserve product manufacturer claims separately from a system integrator's validation. Neither this note nor an IEC catalog match approves a package or creates new schema fields. [L4]

The supplied `NORMATIVE_CANDIDATES.json` lists no matching PDF, extracted markdown or memory file. A filename search of the local `NORMATIVE/STANDARDS_PDF` and `NORMATIVE/extracted_html` trees likewise returned no matching 60947-5-1 file; this is not proof that no copy exists anywhere. No full held edition was inspected. The historical batch [L1] is a research lead, **not a full held standard**. Recommended action: conditional acquisition or authorized access to the applicable edition if a real contact-property, test, applicability or safety-use question cannot be answered by the supplier and publisher scope; no blanket purchase recommendation.

## Sources and unresolved questions

- [S1] IEC official [IEC 60947-5-1:2024](https://webstore.iec.ch/en/publication/65935), public abstract, product details and embedded lifecycle record.
- [S2] IEC official [IEC 60947-5-2:2019](https://webstore.iec.ch/en/publication/32517), public abstract.
- [S3] IEC official [IEC 60947-5-3:2026](https://webstore.iec.ch/en/publication/75167), public abstract.
- [S4] IEC official [IEC 60947-5-5:2026](https://webstore.iec.ch/en/publication/69111), public abstract.
- [L1] Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md`, historical lead; claims require verification.
- [L2] Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md`, sections 3–4, dated bounded corrections.
- [L3] Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, safety-framework review; refers to held ISO 13849-1:2023, not the full -5-1 text.
- [L4] Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, category and intake guidance.

IEC's public preview request returned HTTP 403; the refusal is retained in `evidence/iec-preview-403.html` and was not bypassed. Thus detailed exclusions, normative reference editions, construction/test clauses and specific annex claims remain unresolved. The publisher summaries do not establish EN adoption, present harmonization, a manufacturer's conformity or full-clause compliance. Source snapshots and access metadata are in `SOURCES.json` and `evidence/`.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `0e47029068bbae4d215d08c52fc382b9078e34f599152e2e4940f51285523285`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-5-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-5-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full 2024 normative text and detailed exclusions not inspected; IEC preview returned HTTP 403",
    "Specific annex claims, detailed tests and normative reference editions unverified",
    "EN adoption and legal/OJEU status not investigated"
  ],
  "local_holdings_summary": "Candidate list empty; filename searches in local standards PDF and extracted HTML trees found no matching full text."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/65935",
    "title": "IEC 60947-5-1:2024 edition 5.0",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "evidence/iec-65935.html",
    "text_path": "evidence/iec-65935.txt",
    "evidence_kind": "public publisher scope and metadata",
    "limitations": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/32517",
    "title": "IEC 60947-5-2:2019",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "evidence/iec-32517.html",
    "text_path": "evidence/iec-32517.txt",
    "evidence_kind": "public publisher scope and metadata",
    "limitations": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/75167",
    "title": "IEC 60947-5-3:2026",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "evidence/iec-75167.html",
    "text_path": "evidence/iec-75167.txt",
    "evidence_kind": "public publisher scope and metadata",
    "limitations": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/69111",
    "title": "IEC 60947-5-5:2026",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "evidence/iec-69111.html",
    "text_path": "evidence/iec-69111.txt",
    "evidence_kind": "public publisher scope and metadata",
    "limitations": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTUtMXtlZDUuMH1iLnBkZg==",
    "title": "IEC 60947-5-1:2024 preview request",
    "access_time_utc": "2026-11-02T23:02:20Z",
    "evidence_path": "evidence/iec-preview-403.html",
    "evidence_kind": "failed public preview",
    "limitations": "HTTP 403; not bypassed."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "README.md",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "evidence_kind": "local research lead and corrections",
    "limitations": "Not full text of IEC 60947-5-1."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "PRIMARY_SOURCE_CHECKS.md",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "evidence_kind": "local research lead and corrections",
    "limitations": "Not full text of IEC 60947-5-1."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "SAFETY_SOURCE_REVIEW.md",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "evidence_kind": "local research lead and corrections",
    "limitations": "Not full text of IEC 60947-5-1."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md",
    "title": "batch03-control-circuit-gemini.md",
    "access_time_utc": "2026-11-02T23:02:05Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md",
    "evidence_kind": "local research lead and corrections",
    "limitations": "Not full text of IEC 60947-5-1."
  }
]
`````
