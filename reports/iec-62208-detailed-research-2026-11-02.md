---
{
  "format": 1,
  "metadata": {
    "id": "iec-62208-detailed-research-2026-11-02",
    "title": "IEC 62208 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 62208?",
    "scope": "Detailed IEC 62208 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:29.378Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "7a27cc02be15491622ee8d0d2180ef7e8554463dd9dce86288ee6493846d81c2",
  "proposalRevision": "aeaa16de854e0b0de7cbb3da9fbcf99b762297d097cba73024e0b43f70cf418a"
}
---
# IEC 62208 — empty enclosures for low-voltage assemblies

**Research check: 2026-11-02 UTC.** This is a source-backed scoping report, not a conformity assessment or substitute for the standard. The IEC public abstract was inspected; the complete standard and its individual requirements were not. Source references below are to actual inspected pages; saved copies and limitations are listed in `SOURCES.json`.

## Identity and publication status

[IEC 62208:2023](https://webstore.iec.ch/en/publication/67906), **Empty enclosures for low-voltage switchgear and controlgear assemblies – General requirements**, is an International Standard, third edition, published 1 June 2023. IEC says it cancels and replaces the second edition of 2011 and is a technical revision, including changes reflecting IEC 61439-1:2020 and alignment of test procedures with newer relevant standards. The page identifies a stability date of 2026, which is not itself an expiry date. No later edition or amendment is established by this single publication page; independent exhaustive current-edition and amendment checks remain open. EN adoption, legal applicability, and a particular supplier's edition are separate questions and were not verified.

## What it does and who uses it

An empty enclosure is the physical shell that an assembly manufacturer later equips. The standard provides a common basis for describing and checking the shell before that incorporation, so that suppliers and panel builders can communicate its construction and performance. It is relevant to enclosure manufacturers and test bodies, assembly designers, panel builders and component-intake engineers. A shell's description is input to engineering the finished equipment, not a certificate for everything subsequently put inside.

The IEC abstract states that the document concerns empty enclosures **as supplied by the enclosure manufacturer before switchgear and controlgear components are incorporated by the assembly manufacturer**. It gives general definitions, classifications, characteristics and test requirements for enclosures intended as parts of switchgear and controlgear assemblies, for example assemblies under the IEC 61439 series. It covers general indoor or outdoor applications for assemblies whose rated voltage does not exceed 1,000 V AC or 1,500 V DC. These figures are the scope limits for the intended assembly, not a declaration of a specific shell's capability. [IEC 62208 abstract](https://webstore.iec.ch/en/publication/67906)

**Boundary:** The public abstract establishes the pre-population boundary and intended assembly class; it does not give a complete list of specific exclusions or special-purpose product standards. Do not assume every cabinet, junction box or enclosure used with electrical equipment falls under this document. Confirm exact intended application and any special-environment requirements from the full edition. Nor does populating any shell automatically make all equipment an IEC 61439 assembly: applicability depends on the completed product and its relevant scope.

## Technical areas and selection questions

The abstract confirms classifications, characteristics and tests but not their complete content or pass criteria. The following are **engineering questions to resolve using the supplier's data and, where necessary, the full standard**, not a claimed exhaustive clause summary:

* **Environment and ingress:** What conditions are expected indoors or outdoors, including dust, water, cleaning and condensation? What protection is declared for the exact configuration, and are seals, closures and entries specified? IEC 60529 separately classifies enclosure protection using the IP Code; an IEC 62208 claim by itself does not establish a particular IP code. [IEC 60529 consolidated edition](https://webstore.iec.ch/en/publication/2452)
* **Mechanical suitability:** Are mounting, doors, hinges, locks, lifting arrangements and accessible surfaces suitable for the location and intended load? Ask for declared impact or mechanical performance when relevant, and the applicable configuration and test evidence. Do not infer a particular IK rating from the standard number.
* **Materials and surroundings:** Establish material and coating suitability for corrosion, UV exposure, cleaning agents, temperature and other actual environmental stresses. Do not assume that every possible exposure is covered by a general-use shell or that a supplier's claim applies outside its specified conditions.
* **Electrical interfaces:** Establish the manufacturer's permitted arrangements for protective bonding, mounting plates, doors and connections, including external parts and installation instructions. A metal enclosure does not prove protective continuity after modification, nor does an insulating enclosure prove the finished assembly's shock protection.
* **Thermal integration:** Determine usable space, component dissipation, ventilation and operating temperature conditions. An empty shell rating does not establish the temperature rise of a populated panel; openings or added cooling may change the declared protection and require assessment.
* **Modification and configuration:** Ask what holes, glands, blanking devices, door-mounted controls, replacement seals and permitted accessories are covered by the original evidence; assess the actual final configuration. Follow the shell supplier's instructions and obtain additional evidence if the design departs from the tested configuration.

These are application prompts, not assertions that each topic is addressed in a particular IEC 62208 clause. The earlier batch's detailed references to specific tests were not confirmed against the full text, so no test sequence, severity, threshold or acceptance limit is reproduced here.

## Relationship to assembly and installation requirements

[IEC 61439-1:2020](https://webstore.iec.ch/en/publication/32338) addresses general definitions, service conditions, construction, technical characteristics and verification for low-voltage switchgear and controlgear assemblies. Its abstract says the applicable later part of the series is used together with its cited requirements, with Part 2 applying to assemblies not covered by Part 3 onward. Whether the particular finished equipment falls under that series and which part applies must be determined from the actual equipment and full applicable text. The shell may contribute evidence, but its own declaration is not design or routine verification of the populated assembly: installed components, wiring, protective circuits, heating, interfaces and other applicable assembly characteristics require their own assessment.

IEC 60204-1 is a separate route concerning electrical equipment of machinery; its applicability must be determined for the machine. A machine cabinet is not automatically exempt from IEC 61439, nor automatically subject to it merely because it contains switchgear. Installation requirements and machine-specific or special-product standards may also apply according to the equipment and jurisdiction. No current legal harmonization or precedence decision was checked here. The old batch's categorical rule that machinery cabinets are governed by one standard *instead of* the other is not established by the sources inspected.

## Safety relevance

The shell can be important to physical protection against contact, ingress, damage or adverse conditions in which safety-related equipment is installed. Where a safety function depends on environmental protection, the actual enclosure configuration, its mounting and maintenance conditions are part of the integration assumptions that must be examined. This is conditional application relevance, not evidence of a certified safety subsystem. IEC 62208 alone does **not** establish an ISO 13849 Category, PL, diagnostic coverage, PFH or SIL; it does not establish the achieved integrity of a machine safety function. Component documentation, the safety architecture, applicable validation and actual use conditions remain separate. The enclosure is not automatically an SRP/CS simply because safety devices are inside it.

## Library and holdings implications

The direct candidate category is `enclosure`: distinguish empty shell, accessories and an already populated assembly. Capture exact manufacturer and variant, supplier-declared standard and edition, dimensional and mounting interfaces, declared IP/impact or other ratings with their conditions, material, environment, bonding provisions and instructions for entries and modifications. Preserve certificates and test evidence as distinct from supplier declarations. A part's absence of proprietary construction details is not in itself an intake defect. The assembly builder remains responsible for the completed product; this report changes no lifecycle or approval decision.

`NORMATIVE_CANDIDATES.json` contains no matched PDF, extracted markdown or memory candidate for IEC 62208. **No matching full text was provided for this assignment**; this is not proof that no copy exists anywhere in the wider project. The parent will perform actual holdings reconciliation. Conditional acquisition or access to the applicable edition is worthwhile if the organisation designs, modifies or evaluates empty enclosures and needs to resolve specific test/marking questions; lower priority for merely buying standard shells with adequate supplier evidence. Preserve any older supplier-cited edition rather than rewriting it to 2023.

## Limitations and follow-up

The IEC Webstore page is authoritative for the displayed abstract and identity but not a full-clause review. The public preview link returned HTML rather than an inspectable PDF; failure is retained in `evidence/preview-failure.html`. Obtain legitimate full-text access if exact exclusions, construction requirements, verification methods, changes between editions or acceptance criteria are needed. Check actual product documentation and the appropriate assembly, machine, installation and jurisdiction-specific rules before reaching a design or compliance decision. No IEC/EN equivalence, OJEU status, product conformance or actual machine conformity is claimed.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `c4b4643f13b85113b77b956fb703328954e08f96d56eb781282564bb41f6afe4`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-62208`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 62208",
  "report_path": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full normative clauses and complete exclusions unavailable; IEC preview request returned HTML instead of PDF",
    "No independent exhaustive holdings reconciliation or legal/EN adoption check"
  ],
  "local_holdings_summary": "Supplied candidate list contains no matching PDF, extracted text or memory file; parent to compare actual holdings."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/67906",
    "title_edition": "IEC 62208:2023 edition 3",
    "access_time_utc": "2026-11-02T23:04:36.579653+00:00",
    "evidence_path": "evidence/iec62208.html",
    "evidence_kind": "public scope",
    "limitation": "Abstract and metadata only; full clauses not inspected"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/32338",
    "title_edition": "IEC 61439-1:2020",
    "access_time_utc": "2026-11-02T23:04:36.579653+00:00",
    "evidence_path": "evidence/iec61439.html",
    "evidence_kind": "public scope",
    "limitation": "Scope only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/2452",
    "title_edition": "IEC 60529 consolidated 1989+A1+A2",
    "access_time_utc": "2026-11-02T23:04:36.579653+00:00",
    "evidence_path": "evidence/iec60529.html",
    "evidence_kind": "public scope",
    "limitation": "Scope only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYyMjA4e2VkMy4wfWIucGRm",
    "title_edition": "IEC 62208 preview request",
    "access_time_utc": "2026-11-02T23:04:36.579653+00:00",
    "evidence_path": "evidence/preview-failure.html",
    "evidence_kind": "failed public preview",
    "limitation": "Returned HTML rather than PDF; no preview content"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "title_edition": "Historical batch 8",
    "access_time_utc": "2026-11-02T23:04:36.579653+00:00",
    "evidence_path": "none",
    "evidence_kind": "old research lead",
    "limitation": "Unverified claims; not primary evidence"
  },
  {
    "url_or_path": "NORMATIVE_CANDIDATES.json",
    "title_edition": "Parent supplied candidate list",
    "access_time_utc": "2026-11-02T23:04:36.579653+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "local inventory candidate",
    "limitation": "Empty lists; parent will reconcile actual holdings"
  }
]
`````
