---
{
  "format": 1,
  "metadata": {
    "id": "iec-60715-detailed-research-2026-11-02",
    "title": "IEC 60715 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60715?",
    "scope": "Detailed IEC 60715 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:29.271Z"
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
  "sourceDigest": "a00a2305b0f9e85f058a0c1b776150ffcb13e0e0e33185862e07c51dadb15d7f",
  "proposalRevision": "b60b3974b17ddb2613ccfe5bcb6c68df8b4b35daa5dde3a82515119d50e13dc2"
}
---
# IEC 60715 — mounting rails for low-voltage equipment

**Research check:** 2026-11-02 UTC. **Status:** detailed public-scope investigation, not full-clause inspection, product certification or installed-panel validation.

## Identity and publication

[IEC 60715:2017](https://webstore.iec.ch/en/publication/29026), *Dimensions of low-voltage switchgear and controlgear – Standardized mounting on rails for mechanical support of switchgear, controlgear and accessories*, is an International Standard, edition 2.0, published 2017-07-28 by IEC TC 121/SC 121A. IEC calls it a horizontal standard under IEC Guide 108. Its record gives a 2027 stability date, which is **not** a scheduled expiry date or proof that no later publication exists. The publisher identifies edition 2 as a technical revision replacing the first edition of 1981 and Amendment 1:1995. The checked IEC record identifies no later edition in its visible page; an exhaustive amendment/corrigendum and future-publication search was not established. EN adoption, national edition, legal listing and supplier-cited edition are separate questions and were not verified. [S1]

## Scope, purpose and intended use

The publisher says IEC 60715 specifies dimensional **and functional** requirements for compatible mounting of switchgear, controlgear and accessories on **some types of rails**. Its title emphasizes mechanical support. The engineering problem is to establish a common mounting interface so suitably designed equipment and rail profiles can be brought together, instead of needing a unique support for each device. Rail manufacturers, equipment designers and panel builders can use that interface information. Scope does not mean every rail, device clip or accessory is automatically compatible, or that any given manufacturer's product conforms. [S1]

The earlier local batch labels this “dimensional interchangeability + vibration-proof mechanical fit ONLY.” The first phrase is a useful broad summary, but **vibration-proof is not established** by the IEC abstract: an installed rail-and-device arrangement depends on actual devices, mounting, hardware, load and environment. The abstract's “functional” should not be silently narrowed to dimensional drawings alone; equally, without full text, its exact functional requirements or test coverage cannot responsibly be enumerated. [S1, L1]

The historical batch cites the familiar hat-rail examples TH 35-7.5 and TH 35-15 and also C and G profiles. Treat these names as *leads*, not a verified exhaustive profile list or normative dimensional transcription: the accessible IEC record does not show drawings, tolerance ranges, or which named profiles are included. For a particular product, establish its manufacturer's explicit rail profile and edition, cross-section and compatible device clip rather than infer fit merely from “DIN rail.” Obtain the exact edition's diagrams when precise interface geometry or interchangeability is at issue. [S1, L1]

## Earthing is a separate engineering question

The 2017 revision notice explicitly states that **the rail's electrical function for protective earthing is covered by the relevant product standard**. This is narrower and more useful than asserting that rails can never form part of a protective circuit: the subject is assigned elsewhere, not prohibited. Mechanical fit or an IEC 60715 claim alone does not establish electrical continuity, rail suitability as a protective conductor, adequate fault-current performance, or a verified bond to the enclosure or PE system. A dedicated PE terminal, for example, may have its own product-standard and manufacturer-specified rail and contact conditions; rail surface, material, contact, fastening and bonding details must be checked for the actual combination. No automatic bonding is implied. [S1]

IEC 60947-7-2 is a **candidate** for protective-conductor terminal blocks; verify its exact current scope, product variant and supplier instructions before applying it. It is not a substitute for all machine protective-bonding and assembly obligations, and this investigation did not inspect that standard's text. IEC 60204-1 may be relevant for machine electrical equipment and protective bonding; IEC 61439-1/-2 may be relevant to an applicable low-voltage assembly. Their applicability and exact edition must be established independently; neither is automatically invoked by every rail. These companion descriptions are engineering routing, not a claim of IEC 60715 normative references. [S1, L2]

## Technical subjects and panel practice

The verified scope supports attention to the interface's dimensional and functional compatibility, and to updated technical drawings and tolerancing in the revision. The abstract does **not** disclose the complete profile catalogue, methods, load capacities, surface requirements or acceptance limits. Accordingly, no test list, clause numbers, tolerances or numerical capacities are asserted here. [S1]

For a real panel, use the rail and device manufacturers' externally published specifications to ask:

1. Which exact rail and device variants mate, including profile, depth and thickness, end supports or accessories, and installation/removal clearance?
2. What rail material, finish and fixing system are specified? What spacing of fixings, loading, orientation and environmental conditions are permitted for the **installed combination**?
3. Are vibration, shock, corrosion, temperature and strain from cable bundles addressed by the product and panel documentation for this application? Do not treat a profile match as qualification for any of them.
4. If a PE terminal uses the rail as part of the protective circuit, what contact surface, compatible rail and fastening/bonding arrangements are specified, and how is the complete protective path verified under applicable assembly and machine rules?
5. What inspection, maintenance or replacement conditions accompany the exact items? Keep the evidence for a bought device at its published external interface; no proprietary internal design disclosure is required.

A dimensionally appropriate interface is a useful starting point, not evidence of safe mounting under the actual loads, protection against electric shock, or assembly compliance. Product declarations, installation instructions and installation verification are distinct records. The list above is practical reasoning from the mechanical/earthing boundary, not a claim that each item is a specific IEC 60715 test. [S1, L2]

## Functional safety and ISO 13849

A mounting rail is ordinarily a passive mechanical interface, not by itself a safety-related control subsystem. Its designation gives no PL, Category, diagnostic coverage, SIL or failure-rate data. If a safety relay, PLC or terminal mounted on it participates in a safety function, use that device's declared external installation conditions and safety evidence, then assess and validate the **complete function** in its intended application, including relevant mounting and environmental common-cause or mechanical failure considerations. ISO 13849 is conditional on the machine safety-related control application, not a rail product requirement merely because a rail carries a safety device. The rail label cannot certify the subsystem or the installed function. [L2, L3]

## Library use and holdings

`din_rail` is the direct category; terminal blocks including `terminal_pe`, plus rail-mounted controlgear, power supplies, PLCs and relays, are conditional interface consumers. Record the precise rail/clip interface and supplier-declared standard/edition in evidence where actually declared. For PE use, keep the product's prescribed external protective connection and installation conditions alongside the part. Do not infer a standard claim for a device, fill safety values, or modify library approval state from a category label. [L2]

The supplied `NORMATIVE_CANDIDATES.json` has no PDF, extracted Markdown or memory candidates. A filename search under `NORMATIVE/STANDARDS_PDF`, `NORMATIVE/extracted_html` and `NORMATIVE/.claude/memory` found no `60715`-named item (`evidence/holdings_search.txt`). **No matching full text found** in that bounded search; it does not prove that an unlabelled copy is absent everywhere. The prior batch is research reference only, not a held licensed standard or proof of a particular edition. No full clauses were inspected. [L1, L4]

**Recommendation: conditional acquisition/access**, not a blanket purchase. Obtain the applicable edition and/or the exact supplier documentation when a concrete rail-profile/tolerance, product design, interoperability or disputed requirement needs authoritative figures; use manufacturer instructions and the separately applicable PE/assembly documents for real installations. Investigate EN adoption and legal applicability only for a defined jurisdiction and use case.

## Sources and limitations

- **S1** IEC, [IEC 60715:2017 official catalogue](https://webstore.iec.ch/en/publication/29026), accessed 2026-11-02 UTC; saved `evidence/iec60715.html`. Publisher identity, abstract and edition history only; not full text.
- **L1** `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md`, IEC 60715 section: historical lead, not proof of profiles or vibration performance.
- **L2** same research directory, `README.md`, especially sections 1–4: library evidence and edition distinctions.
- **L3** same directory, `SAFETY_SOURCE_REVIEW.md`, targeted historical safety-source review; not a rail-specific normative assessment.
- **L4** `NORMATIVE_CANDIDATES.json` and recorded filename search; bounded holdings evidence only.

A Phoenix Contact product-page request was denied (`evidence/phoenix.html`); no access-control bypass was attempted and no manufacturer's rail dimensions are asserted from it. The ISO webpage attempted returned a challenge (`evidence/iso.html`). The exact rail profiles, full functional/test clauses, PE-terminal product scope, installed qualification and complete edition/corrigendum status remain open. No legal or product-approval verdict is made.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `eb76d60a7c7fcb729b590cb1968f325f07d3c6d4bce8fd72bf3ee17cff0e3978`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60715`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60715",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard clauses and exact profile dimensions not inspected",
    "Companion standard scopes and full edition/corrigendum status not independently checked",
    "EN adoption and legal status not checked"
  ],
  "local_holdings_summary": "No candidate full text and no matching named file in bounded NORMATIVE search; historical research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/29026",
    "title": "IEC 60715:2017 edition 2",
    "access_time": "2026-11-02T23:04:41Z",
    "evidence_path": "evidence/iec60715.html",
    "evidence_kind": "public scope",
    "limitation": "Publisher page only, no full text"
  },
  {
    "url_or_path": "https://www.phoenixcontact.com/en-us/products/din-rail-ns-35-75-unperforated-0801686",
    "title": "Phoenix product page",
    "access_time": "2026-11-02T23:04:41Z",
    "evidence_path": "evidence/phoenix.html",
    "evidence_kind": "access failure",
    "limitation": "Access denied"
  },
  {
    "url_or_path": "https://www.iso.org/standard/69883.html",
    "title": "ISO page attempted",
    "access_time": "2026-11-02T23:04:41Z",
    "evidence_path": "evidence/iso.html",
    "evidence_kind": "access failure",
    "limitation": "Challenge; identity not verified"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "title": "Historical IEC 60715 batch",
    "access_time": "2026-11-02T23:04:41Z",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "limitation": "Not primary source"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "Research guide",
    "access_time": "2026-11-02T23:04:41Z",
    "evidence_path": null,
    "evidence_kind": "local research guidance",
    "limitation": "Not standard text"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Safety source review",
    "access_time": "2026-11-02T23:04:41Z",
    "evidence_path": null,
    "evidence_kind": "local research guidance",
    "limitation": "Not rail specific"
  },
  {
    "url_or_path": "NORMATIVE_CANDIDATES.json",
    "title": "Local candidate list",
    "access_time": "2026-11-02T23:04:41Z",
    "evidence_path": "evidence/holdings_search.txt",
    "evidence_kind": "holdings search",
    "limitation": "Filename-based bounded search"
  }
]
`````
