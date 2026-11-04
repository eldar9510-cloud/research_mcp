---
{
  "format": 1,
  "metadata": {
    "id": "iec-60664-1-detailed-research-2026-11-02",
    "title": "IEC 60664-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60664-1?",
    "scope": "Detailed IEC 60664-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:30.765Z"
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
  "sourceDigest": "1320542ad7abdf7f637abd45b9e33f7b195b3f18330a2ade3df2b284cccacbd1",
  "proposalRevision": "c6e9cfa2ac47d461c65c4833eb391f3aa57cad05a8c96f8a6fd879bfb28b99cd"
}
---
# IEC 60664-1 — insulation coordination for low-voltage equipment

**Evidence check:** 2026-11-02 UTC. **Result:** detailed publisher-scope research, not a full-clause review or compliance assessment.

## Identity and publication status

IEC 60664-1, *Insulation coordination for equipment within low-voltage supply systems – Part 1: Principles, requirements and tests*, is an International Standard and horizontal basic safety publication. The IEC identifies the base third edition as IEC 60664-1:2020, published 2020-05-26, with the October 2020 corrigendum included in its displayed copy [1]. Its currently displayed consolidated version is **IEC 60664-1:2020+AMD1:2025 CSV**, edition 3.1, published 2025-05-06 [2]. The lifecycle shown on the base publication page also identifies the consolidated version as published. The historical batch's unqualified “current ed 3.0:2020” [3] omits the 2025 amendment; it is not a reliable current-edition statement. The scope abstract does not identify the detailed amendment changes; inspect the amendment/full consolidated text before describing those changes.

This is an IEC publication record, not proof of a particular EN adoption or present OJEU listing. A supplier may legitimately cite a different edition; retain that edition as stated and check it separately. Stability date is not a legal withdrawal date.

## Purpose, audience and scope

Insulation coordination matches insulation measures to electrical stresses and the environment so that insulating barriers do not fail under the conditions for which equipment is designed. The main intended users are product-standard committees and equipment designers/testers; installers and purchasers use the resulting product ratings and instructions. IEC says Part 1 supplies requirements for committees determining **clearances, creepage distances and criteria for solid insulation**, including electrical test methods [1, 2]. It is not by itself the complete product standard, an installation acceptance procedure, or a certificate for a particular item.

The IEC scope covers equipment connected to low-voltage supply systems rated up to **1,000 V AC or 1,500 V DC**, frequencies up to **30 kHz**, and equipment for use up to **2,000 m** above sea level, with guidance for higher altitudes [2]. These are scope limits, not universal equipment ratings, table selections or unqualified design defaults. A higher-frequency circuit or special installation needs the applicable product standard and potentially companion provisions, not extrapolation from the ordinary scope.

Explicit publisher exclusions/qualifications [2]: the specified minimum clearances do not apply where ionized gases are present; a relevant committee may specify special requirements. The document does not cover distances through liquid insulation, gases other than air, or compressed air. The abstract does not establish a complete list of exclusions or how all special cases interact with product standards; the full text is needed for a design determination.

## What the subject areas mean in practice

* **Clearance** is the shortest air path between conductive parts. Air breakdown depends on electrical stress and environment; the practical inquiry includes expected transient or impulse stress, the nature of the circuit and altitude. Adequacy cannot be inferred from nominal supply voltage alone.
* **Creepage distance** is the shortest path along the surface of insulating material between conductive parts. Surface contamination and moisture, electrical stress and insulating material behaviour are important. It is different from an air gap; meeting one does not automatically establish the other.
* **Solid insulation** concerns the insulating material between conductive parts and its appropriate criteria and electrical verification. A spacing figure alone does not establish an entire insulation system.
* **Voltage and installation context:** distinguish nominal supply from actual working voltage, expected temporary/transient stresses and relevant insulation duty; identify the intended overvoltage category and where the device is installed. Obtain the product standard's method and device rating rather than assigning a category from location alone.
* **Environment and material:** establish the pollution conditions at the actual insulation location, exposure to condensation, contamination and altitude, plus material tracking characteristics where needed. A closed cabinet or an IP code does **not**, by itself, establish a pollution degree. The component manual and appropriate product and system standards must support any claimed protected microenvironment.
* **Verification:** the abstract confirms electrical test methods and identifies clearance and creepage flowcharts in the base edition [1]. It does not disclose enough to state the required test sequence, pass criteria, measurement rules, voltage values, correction factors, coating credit, or specific tables. Apply these only using the applicable full text and product-specific provisions.

These bullets are engineering interpretation of the publisher's subject areas, not a clause-by-clause summary or a substitute for the standard. The selected voltage, impulse rating, insulation type, pollution degree, material group, frequency, altitude, geometry and installation environment are inputs to be established with applicable source evidence; do not treat any missing number as a default [1, 2].

## Practical electrical use and product boundaries

For a terminal block, connector, relay, switching device, drive, supply, PLC or exposed PCB assembly, ask which conductors and circuits must remain separated: e.g. mains to accessible metal, adjacent poles, or mains to a low-voltage control interface. Determine the exact device's published rated insulation voltage, impulse withstand or isolation data, applicable voltage/frequency and environment, permitted connection and mounting arrangements, and any required external protection or separation. Product-specific terminology and ratings must be checked in that product's own evidence; a rating is not automatically available just because the part could be covered by this basic standard.

For a bought component, treat internal insulation construction as the manufacturer's responsibility. Review the precise variant, declaration, technical data and installation conditions, including terminal wiring, spacing from neighbouring devices and enclosure conditions. Do not demand internal PCB geometry or proprietary designs merely to accept a supplied black box. Conversely, product data do not prove that exposed installed wiring, field wiring, adjacent component clearances or the whole assembled machine are suitable. Assembly designers must assess those interfaces against applicable product, assembly and machinery requirements, including any separately specified protective measures.

Useful failure modes to investigate include transient breakdown across air gaps, conductive/contaminated surface paths, and breakdown through insulation. Electrical testing is not equivalent to long-term suitability under every actual environment; the test program and environmental assumptions require the appropriate full text and manufacturer evidence. This report makes no test or approval verdict.

## Companion standards and boundaries

* **IEC 60664-1:** common insulation-coordination principles and test methods for its stated scope; product committees adapt and specify equipment-specific requirements [2].
* **Other IEC 60664 parts:** related guidance and special provisions may be relevant, particularly for frequency or protective treatment questions. Their exact titles, current editions, applicability and mandatory/optional relationship to a given product were not established from inspected primary pages. Do not substitute a companion part automatically or assume Part 1 alone covers a higher-frequency or coated construction.
* **IEC 60529:** enclosure ingress-protection classification is a different question from local pollution degree. Do not convert an IP rating into a fixed pollution degree [4].
* **IEC 60204-1 and applicable product/assembly standards:** machine electrical equipment/installation and device-specific requirements are different layers. Their exact application to a device or cabinet must be established from their scopes and applicable full editions; this report does not assign those standards universally.
* **ISO 13849-1/-2:** functional safety of safety-related control systems and their validation are separate from insulation coordination. The local safety-source review identifies conditional subsystem combination and validation issues [5]; Part 1 insulation coordination is not a replacement for them.

## Conditional functional-safety relevance

A safety-related device can rely on insulation to separate circuits or avoid unintended conductive paths; insulation failure could affect the safety function. Whether this matters, and what assumptions or evidence are appropriate, depends on the actual architecture, interfaces, environmental conditions and manufacturer safety instructions. A standard-compliant insulation design alone does not demonstrate diagnostic coverage, a Category, PL, SIL, independence, fault exclusion, PFH or an achieved machine safety function. For a certified subsystem, retain its exact declared safety data and installation conditions; do not convert a generic insulation statement into a subsystem certificate. For a non-safety component or an insulation barrier unrelated to the safety function, ISO 13849 relevance is conditional rather than automatic. System-level combination and validation remain separate work [5].

## Library implications and holdings

The subject cuts across `terminal_feedthrough`, `terminal_pe`, `terminal_fuse`, `connector_industrial`, `contactor`, `relay_general`, `safety_relay`, `power_supply`, `vfd`, `standard_plc`, `safety_plc`, `enclosure` and other energized components, but is not a blanket direct standard assignment to every category. Record source-backed external ratings, terminal restrictions, exact product identity and manufacturer conditions; flag unknowns rather than manufacturing insulation ratings or pollution degrees. An empty enclosure's IP declaration does not validate a populated assembly. No schema, approved-card or lifecycle changes are proposed.

The supplied `NORMATIVE_CANDIDATES.json` lists **no PDF, extracted markdown or memory match**. A filename search of the NORMATIVE PDF, extracted HTML/text and memory trees also found no `60664` match. Thus no matching full local Part 1 text was identified; this is a bounded filename/candidate check, not proof that no indirect reference or differently named copy exists. The older historical research note [3] is a routing reference, not a held standard. **Recommendation: conditional acquisition/update** of the applicable amended text where there is a concrete internal-design, product-standard or disputed clause question. For routine purchase/intake, first request the exact manufacturer's ratings, declaration and instructions; automatic purchase for each component is unnecessary.

## Sources and limitations

1. [IEC 60664-1:2020, publisher record](https://webstore.iec.ch/en/publication/59671), edition, scope, changes versus previous edition, lifecycle; saved `evidence/iec-60664-1.html` and `.txt`.
2. [IEC 60664-1:2020+AMD1:2025 CSV, publisher record](https://webstore.iec.ch/en/publication/107319), consolidated edition, date and scope; saved `evidence/iec-consolidated.html` and `.txt`.
3. Local historical lead: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md`, IEC 60664-1 section. It is not primary text and its publication-status claim is superseded by [2].
4. Local correction: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, §5, warning against inferring pollution degree from IP.
5. Local source review: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, ISO 13849-1:2023 §6.1.2 and §6.2.1 discussion. This is a bounded review of held text, not an independent current-edition audit.

The base and consolidated IEC abstracts were inspected, not the complete copyrighted standard, the 2025 amendment text or product test reports. Exact companion-part applicability, numerical values and correction factors, national adoption and current legal status remain open. The saved IEC abstract confirms scope, not detailed implementation of every input listed above. No numerical requirements have been extracted or migrated.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `9368ad3cbc0342d0bee0a6f9c6b962b212e7d983007a419d9a2e8cc5c58105f3`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60664-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60664-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and 2025 amendment clauses not inspected",
    "Exact companion-part scope and editions not established from primary sources",
    "EN adoption and current legal/OJEU status not checked"
  ],
  "local_holdings_summary": "No matching full Part 1 text found in candidate list or bounded NORMATIVE filename search; historical batch is research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/59671",
    "title_edition": "IEC 60664-1:2020 edition 3.0",
    "access_time_utc": "2026-11-02T23:05:57.828090+00:00",
    "evidence_path": "evidence/iec-60664-1.html",
    "kind": "public scope and publication record",
    "limitation": "Abstract and metadata only; not full clauses."
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/107319",
    "title_edition": "IEC 60664-1:2020+AMD1:2025 CSV edition 3.1",
    "access_time_utc": "2026-11-02T23:05:57.828090+00:00",
    "evidence_path": "evidence/iec-consolidated.html",
    "kind": "public scope and publication record",
    "limitation": "Abstract does not identify amendment changes; full clauses not inspected."
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md",
    "title_edition": "Historical batch 09",
    "access_time_utc": "2026-11-02T23:05:57.828090+00:00",
    "evidence_path": null,
    "kind": "old research lead",
    "limitation": "Not primary evidence; current edition statement omits amendment."
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title_edition": "Research guide and IP correction",
    "access_time_utc": "2026-11-02T23:05:57.828090+00:00",
    "evidence_path": null,
    "kind": "local research correction",
    "limitation": "Secondary guidance."
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title_edition": "Safety source review, ISO 13849-1:2023 references",
    "access_time_utc": "2026-11-02T23:05:57.828090+00:00",
    "evidence_path": null,
    "kind": "local research correction",
    "limitation": "Bounded review, not current-edition audit."
  }
]
`````
