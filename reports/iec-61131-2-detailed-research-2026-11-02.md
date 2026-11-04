---
{
  "format": 1,
  "metadata": {
    "id": "iec-61131-2-detailed-research-2026-11-02",
    "title": "IEC 61131-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61131-2?",
    "scope": "Detailed IEC 61131-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.607Z"
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
  "sourceDigest": "2370e37cb544946e916c62d2b848281315b739e77f26754218539940be9cc366",
  "proposalRevision": "5ba3b6499654bbff1c2061547bf0cd9f2ae14f18d64ade40a404c9f7fc505a58"
}
---
# IEC 61131-2 — programmable-controller equipment requirements and tests

**Checked 2026-11-02 UTC; scope-level research, not a conformity assessment.**

## Identity and edition

[IEC's publication record](https://webstore.iec.ch/en/publication/31007) identifies **IEC 61131-2:2017, edition 4.0**, *Industrial-process measurement and control – Programmable controllers – Part 2: Equipment requirements and tests*, an International Standard published 23 August 2017. IEC marks it published and its 2007 edition revised; it describes the fourth as cancelling and replacing the third. The record's lifecycle shows no amendment for this edition at the check date. This is publication status, not a determination of legal applicability or a guarantee that other national adoptions have identical status.

The archived batch's assertion of **EN IEC 61131-2:2025** and its harmonization/technical equivalence is an unverified lead, not established by the IEC record. No CENELEC adoption record or OJEU listing was independently established here. Supplier declarations may cite an older IEC or different EN edition; preserve their exact citations instead of substituting 2017.

## What it does, and who uses it

IEC's public abstract says that the 2017 edition specifies **functional and electromagnetic compatibility requirements and associated verification tests** for products whose primary purpose is industrial control equipment, including programmable logic controllers (PLC), programmable automation controllers (PAC), and associated peripherals intended to command/control machinery, automated manufacturing, and discrete, batch or continuous industrial processes [IEC 61131-2 record]. This provides an equipment-level framework for designing and verifying controller functionality and electromagnetic behavior, useful to equipment manufacturers, test laboratories, buyers and integrators assessing the published limits of an exact controller system.

In ordinary language, it concerns the equipment interface and ability to operate in its specified environment, not whether an entire machine's electrical installation or a particular safety function has been validated. The term **functional** in this abstract is not a functional-safety certification claim.

## Scope and subtype boundaries

The verified publisher abstract explicitly includes controllers and their associated peripherals when intended for the described industrial control/command purpose. It does **not** provide a complete enumerated product list or reproduce detailed exclusions. An expansion from that general wording to every named commercial product is an interpretation, not a verified clause-by-clause scope determination.

- **Controller CPUs and systems:** PLC/PAC control equipment fits the identified class where its intended purpose matches. Whether a particular variant has been tested, and under which configuration and edition, remains a supplier-evidence question.
- **I/O and remote I/O:** associated controller peripherals can be candidates; ascertain whether the actual module is within the manufacturer's evaluated controller family, configuration, interface and operating envelope. A networked sensor, actuator or independent field device is not automatically included simply because it connects to a PLC.
- **HMI, display and panel PC:** a control-associated peripheral may be a candidate, but the public abstract does not explicitly say that all industrial displays, HMIs or panel PCs are in scope. A standalone display, a general-purpose computer, and an integrated controller/HMI need individual purpose and scope checks. The historical batch's categorical claim of an explicit blanket expansion is not verified from this source. Neither enclosure nor supply voltage establishes applicability.
- **Safety controller or safety I/O:** equipment may have both ordinary equipment/EMC and functional-safety evidence, but one role cannot be inferred from the other. The abstract does not state that Part 2 is restricted to non-safety products.

Only the publisher abstract was accessible: exact detailed coverage, full exclusions, test arrangements and normative reference dates need the actual applicable edition. IEC's public preview request returned HTTP 403; it was not bypassed. [Evidence: `evidence/iec-61131-2-preview-failure.html`.]

## Technical subjects and boundaries

IEC's 2017 change summary identifies negative-logic digital inputs and outputs, a Type 3-d digital input, changes in radio-frequency immunity, temperature and type-testing clarification, and general functional/EMC updates [IEC 61131-2 record]. These are useful leads for examining the applicable equipment provisions, not sufficient evidence of terminal thresholds, required severity levels, pass criteria or a device's actual rating. In particular, the summary mentions a frequency range in relation to a revision; it must not be treated as a complete EMC test plan. No numerical interface/test table is extracted here.

The separation from **product safety** is edition-sensitive. IEC explicitly says the fourth edition removed safety requirements and instead points to IEC 61010-2-201. It would be wrong to transfer that removal to the 2007 edition without examining it, or to characterize the 2017 standard as *only* EMC: the publisher also identifies functional requirements [IEC 61131-2 record]. [IEC 61010-2-201:2024](https://webstore.iec.ch/en/publication/64909) is the separately published particular product-safety standard for control equipment; its own record says it modifies/supplements **IEC 61010-1:2010 plus AMD1:2016**. IEC marks the 2024 third edition published, and lists the 2017 second edition as revised. Check the appropriate product, edition and national adoption, rather than assuming that a controller supplier cites this latest IEC edition. This is not a claim that the 2017 Part 2 abstract establishes an undated normative reference to the 2024 edition.

The equipment standard and its tests address the product and tested configurations. They do not alone specify the complete installed machine's wiring, protective devices, system EMC, risk reduction or operational validation. IEC 60204-1 is a separate machinery electrical-equipment installation/application route, subject to actual machine applicability and edition; its role is not replaced by a PLC test claim. Generic EMC standards may be relevant depending on product, environment and the applicable rules, but do not automatically add them to, or treat them as substitutes for, this product-specific reference without checking scope and the required regime. Exact normative-reference hierarchy and precedence have not been checked in full text.

## Selection and integration questions

For a real purchased controller or peripheral, request the exact article, revision, firmware where relevant, manufacturer declaration and test/configuration coverage; record edition and issuing document, rather than treating a catalogue family heading as proof. For I/O, compare manufacturer-published supply range, input/output types and polarities, current/load compatibility, isolation, terminal assignment, fault behavior, and any required external protection against the connected devices. Confirm permissible topology and external connection instructions, grounding/shielding and EMC installation conditions, environment and derating. These are engineering evidence questions, not claims that the public abstract establishes specific numerical limits.

A manufacturer-prescribed external connection and operating envelope are appropriate black-box evidence; component intake does not require reverse-engineering internal circuits or firmware. Product test evidence does not guarantee compatibility with every sensor, load, wiring arrangement or other device. Final installation and machine verification remain separate activities.

## Functional safety and companion standards

[IEC 61131-6:2012](https://webstore.iec.ch/en/publication/4555), edition 1.0, explicitly addresses PLCs and associated peripherals intended as the logic subsystem of an electrical/electronic/programmable electronic safety-related system. Its public abstract describes an FS-PLC as generally a hardware/software subsystem, potentially including predefined function blocks. This is a **different purpose** from Part 2's functional/EMC equipment provisions; the abstract does not establish that any Part 2 PLC is an FS-PLC, or that every connected module belongs to a certified safety configuration.

When safety is intended, obtain the exact subsystem certificate/declaration, safety manual, certified variants/configuration and published safety data and limitations, then evaluate the complete function under the chosen applicable machine-safety framework, such as ISO 13849-1 or IEC 62061. A subsystem claim does not prove the achieved machine PL/SIL, diagnostic coverage, architecture category, or suitability of arbitrary I/O. No numerical safety rating or conversion is inferred. The archived batch's blanket SIL4 hardwiring rationale is specifically unsupported by the earlier bounded [safety-source review](file:///media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md); this investigation does not establish a Part 6 ceiling from its abstract.

[IEC 61131-3:2025](https://webstore.iec.ch/en/publication/68533) addresses syntax and semantics of PLC programming languages, distinct from Part 2 equipment verification. The publication dates of these companions describe their separate records, not the normative-reference editions necessarily invoked by the 2017 Part 2 text.

## Library implications and holdings

Potential review routes include `standard_plc`, `safety_plc`, remote I/O where represented, and `hmi_panel` when the exact intended control/peripheral function supports it. These names are discovery routes, not category-wide applicability decisions. Ask whether the manufacturer declares Part 2 for the exact variant and edition; whether the tested configuration includes the module/display; which product-safety standard is declared; and, only if safety use is intended, whether the specific hardware/software configuration and function are supported by the safety manual and evidence. Supplier compliance claims, certificate scope, library approval and installed-machine validation remain distinct.

`NORMATIVE_CANDIDATES.json` contains no matching PDF, extraction or memory file. Therefore **no matching full IEC 61131-2 text was found in the supplied local candidate inventory**; this is not proof that no copy exists elsewhere. The archived batch is a research lead, not a full-text holding; its blanket HMI and harmonization statements are not confirmed here. **Conditional acquisition/update:** obtain the exact needed edition through approved channels if an actual controller scope, interface requirement or test dispute cannot be resolved from supplier documents and public scope; otherwise use the abstract as a routing aid and avoid automatic purchases. Parent owns acquisition and any catalog changes.

## Source limitations

The IEC publication pages above were inspected and saved under `evidence/`; their abstracts and lifecycle data do not substitute for normative clauses. The preview was refused, and no full Part 2 or Part 6 text was inspected. Exact detailed exclusions, references, tests and European adoption/legal status remain open. No supplier-specific device was evaluated and no compliance, safety or approval conclusion follows from this report.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `8d5f0a9b55f984b11d39f9ddcbf504cd2f706a5bfd1f061de1f73a5c83f3328c`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61131-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61131-2",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full 2017 standard and detailed exclusions/tests unavailable; IEC public preview returned 403",
    "EN adoption and OJEU status not independently verified",
    "No exact supplier product or certificate evaluated"
  ],
  "local_holdings_summary": "Candidate inventory lists no matching PDF, extracted text or memory file; no full holding established."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/31007",
    "title_edition": "IEC 61131-2:2017 edition 4.0",
    "access_time_utc": "2026-11-02T23:04:32.562302+00:00",
    "evidence_path": "evidence/iec-31007.html",
    "kind": "public scope and publication record",
    "limitation": "Public scope, changes and lifecycle; not full text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/64909",
    "title_edition": "IEC 61010-2-201:2024 edition 3.0",
    "access_time_utc": "2026-11-02T23:04:32.562302+00:00",
    "evidence_path": "evidence/iec-64909.html",
    "kind": "public scope and publication record",
    "limitation": "Public abstract, changes and lifecycle; not full text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/4555",
    "title_edition": "IEC 61131-6:2012 edition 1.0",
    "access_time_utc": "2026-11-02T23:04:32.562302+00:00",
    "evidence_path": "evidence/iec-4555.html",
    "kind": "public scope and publication record",
    "limitation": "Public scope and lifecycle; not full text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/68533",
    "title_edition": "IEC 61131-3:2025",
    "access_time_utc": "2026-11-02T23:04:32.562302+00:00",
    "evidence_path": "evidence/iec-68533.html",
    "kind": "public scope and publication record",
    "limitation": "Public scope; not full text"
  },
  {
    "url": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxMTMxLTJ7ZWQ0LjB9Yi5wZGY=",
    "title_edition": "IEC 61131-2:2017 preview request",
    "access_time_utc": "2026-11-02T23:04:32.562302+00:00",
    "evidence_path": "evidence/iec-61131-2-preview-failure.html",
    "kind": "access failure",
    "limitation": "HTTP 403; preview not inspected"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md",
    "title_edition": "Historical batch 06",
    "access_time_utc": "2026-11-02T23:04:32.562302+00:00",
    "evidence_path": null,
    "kind": "old research lead",
    "limitation": "Unverified claims; not full text"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title_edition": "Bounded safety source review",
    "access_time_utc": "2026-11-02T23:04:32.562302+00:00",
    "evidence_path": null,
    "kind": "old research lead",
    "limitation": "Reviews selected historic claims, not Part 6 full text"
  }
]
`````
