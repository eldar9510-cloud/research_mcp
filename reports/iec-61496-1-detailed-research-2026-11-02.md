---
{
  "format": 1,
  "metadata": {
    "id": "iec-61496-1-detailed-research-2026-11-02",
    "title": "IEC 61496-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61496-1?",
    "scope": "Detailed IEC 61496-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.852Z"
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
  "sourceDigest": "8d0418f44388161a7a7d6481fdb1924e8b106e4436052a38b7e8d7ec043b31cb",
  "proposalRevision": "227450f415669d95af3e357f5c2de3e43088581044fe580c750bfdc0688c9b66"
}
---
# IEC 61496-1 — electro-sensitive protective equipment: general requirements and tests

**Evidence check:** 2026-11-02 UTC. **Research status:** detailed scope and selected clauses inspected; not a clause-by-clause conformity review. **Identity:** IEC 61496-1:2020, *Safety of machinery – Electro-sensitive protective equipment – Part 1: General requirements and tests*, International Standard, edition 4.0, published 2020-07-14, TC 44. IEC's lifecycle identifies it as published and its 2012 third edition as revised. The fourth-edition lifecycle lists no amendment or corrigendum versions; IEC also lists edition 5.0 in preparation (TCDV, forecast 2027-03-26), not a published replacement. Forecast and stability date are not legal transition dates. [IEC catalog](https://webstore.iec.ch/en/publication/63115), product detail/lifecycle; held 2020 full-text foreword.

## Purpose and scope

ESPE detects people without requiring physical contact, and provides a protective signal so a machine can enter a safe condition before a hazardous situation occurs. The standard addresses the device's general design and performance, including maintaining protective capability through checks. It is useful to ESPE manufacturers, test bodies, machine builders, electrical integrators and safety engineers, but does not itself tell them how to safeguard any particular machine. [Held IEC 61496-1:2020 introduction and §1].

The exact scope is general design, construction and testing requirements for non-contact ESPE specifically intended to detect persons or parts of persons as part of a safety-related system, with optional safety functions addressed in Annex A. Part 1 is intended to be used with the appropriate sensing-technology part: Part 2 for active opto-electronic protective devices (AOPD), Part 3 for devices responsive to diffuse reflection (AOPDDR). Where a technology part is absent, or the series lacks all necessary provisions, the 2020 scope directs users to IEC TS 62998-1; it also describes combining aspects of the series with that TS. Determine the applicable editions for the real product rather than assuming one part covers every sensor. [Held §1; IEC catalog].

Important boundaries in the actual scope:

- It does **not** fix detection-zone size, configuration or position relative to a particular machine hazard, or define that machine's hazardous state. It is limited to ESPE functioning and machine interface.
- Safety-related data interfaces can control optional functions, but this part supplies no specific requirements for those interface-controlled functions; its scope points to other safety standards for determining them.
- Non-person-protection sensing functions, such as navigation using sensor data, are not dealt with. Non-person applications may need different requirements.
- EMC **emissions** requirements are outside scope; environmental immunity is nevertheless addressed. A general proximity sensor or ordinary photocell is not automatically a personnel-protective ESPE merely because it senses without contact. [Held §1, §4.3].

## Main technical subject areas

The following comes from selected inspection of the held 2020 standard, not an exhaustive requirements extraction:

1. **Function and failure response (§4.1–4.2):** detection capability across the specified zone, output response, response time, access to adjustment and fault response. Types 2, 3 and 4 differ in fault and environmental performance; Type 1 requirements were not considered in this edition. Type 2 has periodic testing; Type 3/4 have different output and fault provisions. Technology-specific fault requirements are supplied by companion parts. Safety-related communication may be an alternative interface under the conditions of §4.2.4.4; do not assume a fixed physical terminal arrangement from the type alone.
2. **Electrical and design (§4.2):** supply behavior, electric shock and equipment protection, wiring, insulation/clearance aspects, fire, solid-state and relay OSSDs, indicators, adjustments, common-cause failures, programmable electronics and software. These are largely product-design and assessment subjects, not an instruction to reverse-engineer bought devices.
3. **Environment (§4.3):** temperature/humidity, supply variations and interruptions, electrical transient, surge, RF and electrostatic immunity, vibration, shock, enclosure and light interference. Individual test conditions and applicability must be checked in the text and technology part, not generalized from an IP or EMC label.
4. **Tests (§5):** type-test setup, function, response, output switching, fault and environmental tests. The tests are against defined equipment and test conditions; they are not a field acceptance of every installed machine.
5. **Identification and use (§§6–7):** product markings, terminals, safe-use documentation and accompanying information; Annex A addresses optional functions such as external device monitoring, start/restart interlocks, muting, stopping-performance monitoring and safety-related parameter setting. Optional does not mean present in every product. [Held IEC 61496-1:2020 §§4–7 and Annex A].

Fourth edition's foreword identifies technology-specific omissions, consolidation of common environmental requirements, expanded procedures and alignment with newer generic machinery safety standards as significant changes. It is not a complete difference analysis against 2012.

## Functional safety and ISO 13849: conditional application

The ESPE is commonly the sensing/input subsystem of a machine safety function, not the whole function. The 2020 text (§4.1.4–4.1.5 and Tables 1–2) specifies type-related safety performance and limits on the maximum PL/SIL that can be achieved by the ESPE in a safety function. Thus type affects suitability for a required risk reduction; it is **not** a direct award of achieved machine PL, category, diagnostic coverage, PFHd or SIL. The standard explicitly notes that claimed electronics PFHd is not itself restricted to a type's nominal band: a low numerical PFHd does not eliminate systematic and detection-principle limits.

For an ISO 13849 route, first establish the machine's safety function and PLr from the relevant risk assessment; select a documented ESPE and technology with suitable type, detection and declared safety capability; assess the complete sensing, logic and output architecture and interfaces using applicable manufacturer data and validate the complete function. Certification, if actually supplied, may support a defined subsystem with exact variants and conditions; a sensor head dependent on a controller must not be assigned an independent rating on assumption. IEC 62061 is another machinery functional-safety route; do not manufacture equivalence or convert ratings automatically. Refer to ISO 13849-1/-2 and the actual supplier evidence for the chosen route. [Held §1, §4.1.3–4.1.5, §4.2; §2 normative references].

The prior batch's unqualified “Type 4 → PL e” wording is potentially misleading: the 2020 text contains a type/PL relationship, but this is not proof of the machine's achieved PL. Its blanket mounting and lift-specific numbers likewise do not follow from Part 1. No universal scanner field, curtain resolution, mounting distance or stop-time parameter is endorsed here.

## Electrical selection and installation questions

For the **exact** curtain, scanner, sensor/controller combination or configured safety communications interface, obtain manufacturer identification and revision, relevant IEC 61496 parts and editions actually declared, certificate/declaration scope and safety manual. Check:

- Sensing principle, detection capability and field/zone, protected heights and range, and limitations from reflectivity, alignment, contamination or interference as documented for the actual model.
- Rated supply, input protection, required external protection and compatible grounding, connectors, cable length, output load, response time, OSSD/test-pulse compatibility, and the receiving controller's safety-input conditions. Do not infer terminal functions or voltage from the product category.
- Actual environmental ratings and permitted mounting conditions, field-switching/configuration controls, restart behavior and whether EDM or muting exists and is enabled; optional features need their prescribed external conditions.
- Total system stopping behavior, approach/access routes, ability to reach around or remain beyond a detection plane, restart and periodic checks. Placement and validation are machine-specific; evaluate relevant ISO 13855 and IEC 62046 application provisions and applicable machine-specific standards, not Part 1 alone. [Held §§1, 4.1–4.3, 7 and Annex A].

This is an evidence checklist, not an installation specification. A purchased unit's documented external electrical and functional contract is the appropriate library boundary; hidden circuitry is not an intake prerequisite.

## Related documents and library relevance

- **IEC 61496-2** adds technology-specific AOPD requirements; **IEC 61496-3** adds AOPDDR requirements. IEC's Part 1 catalog lists the 2020 and 2025 publications respectively, but inspect each part and supplier declaration when used. [IEC catalog, referenced-by].
- **IEC TS 62998-1** fills the stated technology/provision gaps in the 2020 scope. It is a technical specification, not automatically an interchangeable Part 1 certificate. [Held §1].
- **ISO 12100** supports machinery hazard/risk assessment; **ISO 13849-1/-2** support safety-related control-system design and validation; **IEC 62061** supports a machinery functional-safety route; **IEC 61508** supplies a general functional-safety framework. All are referenced in the 2020 text; selection depends on application. **ISO 13855** and **IEC 62046** are application/positioning routes, not product certificates. [Held §1–2; prior research guide as routing lead, not as normative proof].
- `light_curtain` and `laser_scanner` are useful library routing categories, not automatic proof of ESPE, type, PL or an applicable exact edition. Identify active optical versus diffuse-reflection and other sensing technologies; radar and vision need their applicable particular parts and cannot be silently classified as Part 2/3. Capture supplier-declared certificates and safety parameters separately from candidate standards. This report does not modify any card, lifecycle or schema.

## Local holdings, recommendations and limitations

The candidate PDF `/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61496-1_2020.pdf` is an actual 124-page PDF whose cover identifies IEC 61496-1 edition 4.0, 2020-07, English/French; its corresponding existing MinerU markdown is `/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_61496-1_2020/IEC 61496-1_2020/auto/IEC 61496-1_2020.md`. This is a held full publication, not just a catalog abstract; identity was checked against the PDF cover and selected clauses against the extraction, not every PDF page or extracted table. No local Part 2/3 holdings were established by this exact-Part-1 inventory. No licensed full text has been copied into this report.

**Recommendation:** use the already-held 2020 Part 1, with an edition/status recheck when used; do not acquire a duplicate. Conditionally obtain the exact technology-specific part or supplier manual/certificate when a real model and unresolved application require it. IEC catalog shows a fifth edition under development, so revisit on publication rather than treating a forecast as a final standard. Neither EN adoption, current OJEU citation, local law nor any manufacturer's actual certificate was checked; they remain separate questions. No product or machine compliance decision is made here.

**Source trail:** `SOURCES.json` identifies the inspected IEC catalog capture, held primary sources and historical research lead; `evidence/iec-63115.html` preserves the actual public page. References to held text are edition- and section-qualified above.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `d574b8c17503394084f67cb06b48c6b6f2712d4fd8dd22627fd01dc5473f8bef`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61496-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61496-1",
  "report": "REPORT.md",
  "status": "complete",
  "major_gaps": ["No full clause-by-clause conformity assessment; only selected held text was inspected.", "No EN adoption, OJEU/legal status or exact supplier certificate checked.", "Specific companion-part holdings and actual device application not assessed."],
  "local_holdings_summary": "Full IEC 61496-1:2020 edition 4.0 English/French PDF and MinerU extraction held; cover identity verified. IEC catalog identifies edition 5 as under development, not published."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "checked_at_utc": "2026-11-02T23:02:06Z",
  "sources": [
    {"url": "https://webstore.iec.ch/en/publication/63115", "title": "IEC 61496-1:2020, edition 4.0", "accessed_at_utc": "2026-11-02T23:02:06Z", "evidence_path": "evidence/iec-63115.html", "kind": "public publisher scope, product details and lifecycle", "limitation": "Catalog and lifecycle, not full standard or regulatory status; future edition forecast is provisional."},
    {"path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 61496-1_2020.pdf", "title": "IEC 61496-1:2020 edition 4.0", "accessed_at_utc": "2026-11-02T23:02:06Z", "evidence_path": "original local path; PDF cover inspected, no copy", "kind": "held full text", "limitation": "Identity verified from cover; full 124-page PDF not read page by page."},
    {"path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_61496-1_2020/IEC 61496-1_2020/auto/IEC 61496-1_2020.md", "title": "IEC 61496-1:2020 full-text MinerU extraction", "accessed_at_utc": "2026-11-02T23:02:06Z", "evidence_path": "original local path; no copy", "kind": "held full-text extraction", "limitation": "Selected scope, foreword and clauses/headings inspected; extraction can contain errors and is not a full conformity review."},
    {"path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch04-espe-gemini.md", "title": "Batch 4 ESPE historical research", "accessed_at_utc": "2026-11-02T23:02:06Z", "evidence_path": "original local path; no copy", "kind": "old research lead", "limitation": "Truncated secondary research, not authoritative; unqualified type-to-PL interpretation and mounting claims not adopted."}
  ]
}
`````
