---
{
  "format": 1,
  "metadata": {
    "id": "iec-61496-3-detailed-research-2026-11-02",
    "title": "IEC 61496-3 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61496-3?",
    "scope": "Detailed IEC 61496-3 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.002Z"
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
  "sourceDigest": "b49db09034cc82a0cdafc7929f40f111211e34e13ac07ede22eb5813cd584cd3",
  "proposalRevision": "729df1e6a95812480d9f0dbab84bb94b2b0b94bf56283feb7cdbfe2651e9ecd3"
}
---
# IEC 61496-3 — diffuse-reflection electro-sensitive protective equipment

**Checked 2026-11-02.** IEC 61496-3 is an International Standard titled *Safety of machinery – Electro-sensitive protective equipment – Part 3: Particular requirements for active opto-electronic protective devices responsive to diffuse reflection (AOPDDR).* IEC lists edition 4.0, published 2025-08-14, as published; it cancels and replaces the 2018 third edition, which IEC marks revised. The local actual PDF is IEC 61496-3:2018-12, edition 3.0, not the 2025 edition. IEC identifies the 2008 second edition as revised too. The public 2025 page does not establish legal applicability, EN adoption or OJEU status, and no complete amendment/corrigendum audit was performed. [S1, S2, L1]

## What it does and who uses it

This is a particular product standard for ESPE that uses active diffuse-reflection optics to detect people or parts of people as an input to a machinery safety-related system. The equipment emits near-infrared radiation and detects a portion scattered back by an object to determine its position in a two-dimensional or three-dimensional detection zone. It addresses whether the protective sensing equipment and its machine interface perform as intended, rather than prescribing a protective arrangement for every machine. Relevant users include ESPE manufacturers and test bodies, and machine integrators evaluating the exact device and its installation. A safety laser scanner can be such a device, but neither every scanner nor every laser sensor is automatically an AOPDDR within scope. [S1; L2, introduction and §1]

## Scope and boundaries

IEC's 2025 scope explicitly concerns **non-contact** ESPE that detects objects entering or present in the zone without human intervention for detection. Its AOPDDR-2D and -3D zones may be specified in two or three dimensions; it excludes a sensor that only performs a single one-dimensional spot-like distance measurement, such as an optical proximity switch. Complex object classification or differentiation is not addressed. Outdoor application requirements and tests and EMC emission requirements are not addressed. It excludes devices using externally generated radiation, or radiation with peak wavelength outside 820–1,100 nm; for outside-wavelength devices it can serve as guidance. The 2025 scope identifies a minimum detectable object-size range of 30–200 mm. These are scope descriptors, **not** installation clearances, machine limits or universal device specifications. [S1]

The held 2018 text has the same basic 2D/3D principle and spot-measurement, outdoor, object-classification, external-radiation and EMC-emission boundaries, but its peak-wavelength range is **820–950 nm**, not the 2025 range. Do not project the newer wavelength scope back onto the held edition. The 2018 foreword says it extended the 2008 scope to 3D and Type 2; thus neither all 2018 AOPDDRs nor later devices should be presumed to have a single device type. 2018 also states that application to non-person protection may be relevant but different requirements can be appropriate. [L2, foreword and §1; S1]

Both editions' scopes expressly leave the dimensions, configuration and position of the detection zone for a particular application, and identification of the machine's hazardous state, outside this standard. A catalog scope does not establish that a model qualifies: check its intended use and exact declaration. The 2025 scope adds the explicit non-contact and no-human-intervention limitations; the full effect of the revision requires the actual edition. [S1; L2, §1]

## Technical subject areas — edition-qualified

The **held 2018 full-text extraction** provides more than an abstract, but this is targeted inspection, not a clause-by-clause conformity assessment. It modifies or supplements IEC 61496-1:2012; unchanged clauses apply as stated in its foreword. The relevant technical subjects include:

- **Detection integrity and zones:** detection and tolerance zones, position accuracy, test pieces with different optical characteristics, detection limitations, wavelength and radiation intensity. These are device verification topics, not a ready-made guarding layout. [L2, §§4.2.12–4.2.15, 5.2.1, 5.2.9–5.2.13]
- **Fault behaviour and environmental robustness:** Type-dependent fault detection and fault testing, mechanical construction, vibration, shock, temperature/humidity, enclosure, interfering light, pollution and surrounding objects; the testing section also addresses light interference and detection endurance. Not all tests or results may be assumed for a particular product without its evidence. [L2, §§4.2.2, 4.2.16, 4.3, 5.3–5.4]
- **Information for safe use:** marking and accompanying documentation, optional safety functions and fault catalogue; informative annexes give application examples and detection-probability explanations, not universal machine designs. [L2, §§6–7, Annexes A, B, AA and BB]

The IEC 2025 publisher abstract identifies changes: consolidation of some requirements and test procedures into Part 1:2020, changed Type 2 minimum detection probability and fault-detection requirements, and AOPDDR trip-device use described as an optional function. It does not supply the full requirements or their quantitative consequences. The 2025 Part 3 references Part 1:2020 for optional functions; the local 2018 Part 3 explicitly calls for Part 1:2012. Do not mix these edition pairs as if their provisions were interchangeable. [S1; L2, foreword]

## Practical electrical and safety use

For a prospective device ask for the manufacturer’s exact model and configuration, declaration/certificate and edition, manual and safety data; intended detection mode, 2D/3D zones, detectable-object capability, actual response times and configurable protective fields; environmental and optical restrictions, contamination handling and any limits on surrounding reflective objects or other sensors. For the electrical interface establish the supplied voltage and protection conditions, output and compatible receiver inputs, wiring, fault response, start/restart behaviour and any prescribed external monitoring from the actual manual. These are evidence questions, **not** assertions that every unit has identical interfaces or functions. Keep prescribed external wiring and protection in the component reference without demanding proprietary internal circuits. [L2, §§4–7; S1]

When this ESPE participates in a protective stop or presence-detection safety function, it is a safety-related sensing element or a manufacturer-defined subsystem, not the complete function. Obtain the vendor's applicable integrity data and conditions for the exact configuration, then validate sensing coverage, response and stopping behaviour, logic and final elements in the installed machine. A Part 3 declaration or a Type designation alone does not establish machine PL, SIL, Category, diagnostic coverage, or suitability for a given task. No automatic conversion or universal protective distance follows. The held standard expressly leaves machine-specific application to the parties and points to IEC 62046 and ISO 12100 for guidance. [L2, introduction and §1]

## Related documents and library routing

- **IEC 61496-1:** common ESPE requirements/tests, supplemented by Part 3; use the edition pairing appropriate to the Part 3 edition and product. [L2, foreword; S1]
- **IEC 61496-2:** a separate optoelectronic protective-device part, not a generic synonym for diffuse-reflection Part 3. Determine the actual sensing technology and declared standards instead of assigning both to all light curtains or scanners. This distinction is a routing inference, not a certification decision. [L2, §1]
- **IEC 62046 and ISO 12100:** held 2018 introduction points to application and risk guidance. **ISO 13855:2010** is cited in its normative references for positioning safeguards relative to approach speeds; applicability and edition require separate checking for the machine. [L2, introduction and §2]
- **ISO 13849-1 / IEC 62061:** possible routes for assessment of the larger safety-related control function, conditional on the chosen framework and application; the product standard does not replace that assessment.

For library routing, `laser_scanner` is a strong **candidate** category only when the exact product is a qualifying diffuse-reflection protective device; `light_curtain` requires subtype checking rather than automatic Part 3 assignment. Record what the supplier actually declares and distinguish product performance, safety data, application constraints and component lifecycle approval. No category mapping or policy change is proposed.

## Local holdings, limitations and recommendation

[L1] is a 188-page English/French PDF whose inspected cover explicitly identifies IEC 61496-3 edition 3.0, 2018-12. [L2] is a substantial extraction with the complete document structure; targeted passages and contents were inspected, not every clause or image. It is a **held older full publication**, not merely a research reference, but does not stand in for IEC 61496-3:2025 or establish possession of companion parts. The 2025 source inspected is the public publisher page, not full clauses; its edition-level change list is not an exhaustive comparison. No exact supplier product or certificate, EN adoption, jurisdictional legal status, or current comprehensive corrigenda list was verified.

**Recommendation:** retain the 2018 holding for edition-specific legacy questions. Conditionally obtain/read 2025 Part 3 and its applicable Part 1 when an actual current-edition design, testing or supplier discrepancy requires detailed requirements; no blanket purchase or device approval follows. Preserve older supplier citations rather than silently rewriting them.

## Sources

- [S1] IEC, [IEC 61496-3:2025 publication 84133](https://webstore.iec.ch/en/publication/84133), scope, revision summary and lifecycle; public catalog, saved `evidence/iec-84133.html`.
- [S2] IEC, [IEC 61496-3:2018 publication 27378](https://webstore.iec.ch/en/publication/27378), historical publication record, saved `evidence/iec-27378.html`.
- [L1] `/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61496-3_2018.pdf`, cover and PDF metadata.
- [L2] `/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_61496-3_2018/IEC 61496-3_2018/auto/IEC 61496-3_2018.md`, foreword, introduction, §1, contents and selected clause headings. Extraction may contain errors; original PDF controls.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `4238c6021f36abf7736eed8fdf9f5ccc3b86bef03b4b441c332a64f3f2e87dbe`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61496-3`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61496-3",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "2025 full text and exhaustive clause comparison not inspected",
    "EN adoption, OJEU status, comprehensive corrigenda and specific supplier evidence not checked"
  ],
  "local_holdings_summary": "IEC 61496-3:2018 edition 3 full PDF and extraction held; cover verified; newer 2025 edition not established as held."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/84133",
    "title": "IEC 61496-3:2025 edition 4",
    "access_time": "2026-11-02T23:03:18Z",
    "evidence_path": "evidence/iec-84133.html",
    "kind": "public scope and publisher lifecycle",
    "limitation": "Not full standard; no legal applicability."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/27378",
    "title": "IEC 61496-3:2018 edition 3",
    "access_time": "2026-11-02T23:04:00Z",
    "evidence_path": "evidence/iec-27378.html",
    "kind": "public publisher record",
    "limitation": "Historical edition."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61496-3_2018.pdf",
    "title": "IEC 61496-3:2018 edition 3",
    "access_time": "2026-11-02T23:05:00Z",
    "evidence_path": null,
    "kind": "local full text PDF",
    "limitation": "Cover and metadata inspected; not copied."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_61496-3_2018/IEC 61496-3_2018/auto/IEC 61496-3_2018.md",
    "title": "IEC 61496-3:2018 extraction",
    "access_time": "2026-11-02T23:05:00Z",
    "evidence_path": null,
    "kind": "local full text extraction",
    "limitation": "Targeted sections and contents inspected, not complete clause review."
  }
]
`````
