---
{
  "format": 1,
  "metadata": {
    "id": "iec-61000-6-2-detailed-research-2026-11-02",
    "title": "IEC 61000-6-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61000-6-2?",
    "scope": "Detailed IEC 61000-6-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:31.074Z"
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
  "sourceDigest": "8521aec82cb3019485a8583095b5bf33b2e7e934bad1720c4efa3194d16072fe",
  "proposalRevision": "d9d3c94a3a0840012dee65f8a31e104291e6b0cc174147f6fee844a05a7b59c5"
}
---
# IEC 61000-6-2 — generic industrial EMC immunity

**Research check: 2026-11-02 UTC.** This is scope and application research, not a clause-by-clause conformity assessment. No complete standard, test report or actual component was inspected.

## Identity and publication

[IEC's publisher record](https://webstore.iec.ch/en/publication/25630) identifies **IEC 61000-6-2:2016**, *Electromagnetic compatibility (EMC) – Part 6-2: Generic standards – Immunity standard for industrial environments*, an International Standard, edition 3.0, published 10 August 2016. Its lifecycle record marks it published and the 2005 and 1999 editions revised; the 2016 edition technically revises and replaces the 2005 edition. The page does not list a separate amendment to this edition in its lifecycle data as inspected; this is not an exhaustive amendment or future-work search. [EVS's IEC product page](https://www.evs.ee/en/iec-61000-6-2-2016) independently reproduces the publisher's abstract. An IEC publication is distinct from its EN/national adoption and from an individual manufacturer's cited edition.

## What it addresses and who uses it

Electrical and electronic equipment can malfunction when exposed to electromagnetic disturbances from its surroundings, including discharge, radio fields, switching and supply disturbances. The document provides a **generic immunity route** for equipment intended for industrial locations when no relevant dedicated product or product-family EMC immunity standard exists. It is useful to equipment manufacturers, EMC laboratories, integrators and component-selection engineers asking what evidence and environmental conditions are relevant—not as a shortcut to declaring a machine compliant. [IEC scope](https://webstore.iec.ch/en/publication/25630).

The abstract says it covers immunity requirements over 0 Hz–400 GHz, but **does not require testing at frequencies for which no requirements are specified**. This is a statement of scope, not a claim that a unit has continuous immunity throughout that range or that every listed phenomenon and port is tested. The full applicability provisions and test tables were not available here. The location label alone is insufficient to determine the environment classification or test plan for a particular product.

## Scope boundary and priority

The publisher's explicit condition is absence of a **relevant dedicated product or product-family EMC immunity standard**. First identify the exact equipment, its use, environment and any relevant product/family immunity provisions; if such a dedicated standard covers it, route the covered immunity assessment to that standard rather than mechanically imposing the generic one. Whether a particular product standard covers all relevant phenomena and whether another provision remains applicable require reading the documents and the applicable assessment framework; the abstract is not a universal rule for every partial overlap. The scope also does not establish that every passive component, cabinet, assembly or completed machine is independently within this standard. [IEC scope](https://webstore.iec.ch/en/publication/25630).

For example, a PLC, drive, power supply, protective sensor or complete lift installation may have a more specific EMC product/family route. Those are **questions to investigate**, not verified universal mappings. The historical [batch 9](file:///media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md) names lift standards EN 12015 and EN 12016; their current editions and precise applicability were not independently checked here. It is not enough to assert that both generic standards always remain mandatory for every component or panel in such a system.

## Technical themes and test-method relationship

IEC's 2016 publisher record lists dated normative references to basic EMC methods. Examples are electrostatic discharge (IEC 61000-4-2:2008), radiated RF fields (4-3:2006 with its listed amendments), electrical fast transient/burst (4-4:2012), surge (4-5:2014), conducted RF disturbances (4-6:2013), power-frequency magnetic fields (4-8:2009), and voltage dips and interruptions (4-11:2004 and 4-34:2005 plus its listed amendment). The same reference list names alternative radiated test environments in 4-20, 4-21 and 4-22. [IEC 6-2 publisher reference list](https://webstore.iec.ch/en/publication/25630). This list demonstrates technical themes and referenced method editions, **not** which test, port, level, alternative chamber or acceptance criterion applies to a particular EUT. The references are not automatically the latest editions of those methods.

The distinction matters: a basic method describes how to produce and measure a phenomenon reproducibly, while the applicable generic or product standard determines the relevant application of that method. For example [IEC 61000-4-2:2008](https://webstore.iec.ch/en/publication/4189) describes ESD test equipment, waveforms, levels, setup and procedures; [IEC 61000-4-3:2006](https://webstore.iec.ch/en/publication/4209) describes radiated RF immunity testing. Neither method's mere appearance on a datasheet proves the specific equipment passed the 6-2 test plan. Conversely, no specific 6-2 levels, equipment configurations or A/B/C criteria have been extracted or inferred from the abstract.

Practical assessment requires identifying the equipment under test and its operating modes, representative ports and cables, relevant phenomena, test setup and operating conditions, observed function and acceptance criteria, and documenting deviations. The actual full standard and applicable test-method editions determine the details. For a purchased black box, request the supplier's declared equipment configuration, EMC report/declaration and prescribed external installation—not proprietary circuitry or firmware.

## Emission, installation and legal boundaries

Immunity is resistance to external disturbance; emission concerns disturbance produced by equipment. The EVS page for [EN IEC 61000-6-4:2019](https://www.evs.ee/en/evs-en-iec-61000-6-4-2019), identifying IEC 61000-6-4:2018, describes a generic industrial **emission** standard. It is a separate assessment, subject to its own scope and product-standard priority. Do not infer its emission class or limit from a 6-2 immunity claim, nor assume that an immunity pass means emission compliance.

A device's published EMC evidence applies to the tested configuration and manufacturer's specified conditions. For an installed system, check externally prescribed supply and earthing/bonding, cable type, shield termination, cable routing, interfaces, filters and separation where relevant; these are practical integration questions, not a claim that a particular measure is mandated for every device by a specific clause of 6-2. Combining individually tested equipment, changing wiring or adding a drive does not itself establish installed-system immunity or emissions. Nor does it prove performance against every disturbance in the environment.

IEC publication is not by itself EU harmonization or legal conformity. The [European Commission](https://single-market-economy.ec.europa.eu/single-market/european-standards/harmonised-standards_en) explains that references of harmonised standards must be published in the OJEU. No relevant OJEU entry, restrictions, dates, jurisdiction or current EN adoption status was verified. The old batch's blanket presumption-of-conformity statement therefore cannot be adopted for a product or machine without a separate current legal assessment.

## Functional safety

Immunity can affect the availability and correct operation of safety-related electronics, but generic immunity alone does not establish that a safety function reaches a particular PL, SIL, Category, diagnostic coverage or probability of dangerous failure. A supplier's safety subsystem certificate, its exact variant, safety manual, fault reactions and application conditions are separate evidence; machine-level design and validation remain necessary. Generic immunity tests are not a substitute for the applicable safety product standard or safety-function assessment. The held-edition local [safety-source review](file:///media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md) independently cautions against translating component properties into safety ratings. It did not inspect 6-2 itself; the preceding statements are the bounded integration conclusion, not a claim of a particular 6-2 safety clause.

## Library and local holdings

Potentially useful intake routes include standard/safety PLCs, HMIs, power supplies, drives, sensors and electronic safety devices. This is an evidence checklist, **not** a category-wide applicability assignment: establish exact type, environment, supplier model/firmware where material, declared standard and edition, dedicated product/family route, tested configuration, functions/acceptance and externally prescribed installation. A relay, cable, connector or passive item is not automatically assigned a complete-equipment immunity standard by its category. Supplier assertions, reports and independent certifications should be recorded distinctly; a category name proves neither EMC conformity nor immunity performance.

`NORMATIVE_CANDIDATES.json` lists no matching PDFs, extracted Markdown or memory files; an additional filename search under `/media/eldar/disk_2/Machine_concept/NORMATIVE` found no `*61000*` matches. Thus **no matching local full text was found**, not proof none exists under an unexpected name. The historical batch is a research reference, not a held standard. No exact-edition licensed text, test table or evidence of any individual product was inspected.

**Recommendation: conditional acquisition/consultation.** Obtain legitimate access to the applicable full 6-2 edition and its referenced method editions if a real product lacks a dedicated immunity standard and an actual test plan, applicability decision or clause interpretation is needed. Prioritise an applicable product/family standard and supplier test documentation when that is the actual route. Do not purchase automatically or turn this research into normative constants. Confirm current publication/adoption, amendments and supplier-cited editions at the time of use.

## Evidence limits

The online IEC abstract and reference metadata support identity, generic scope and method relationships; they do not expose all requirements, application exemptions, performance definitions, tables or current legal status. The IEC preview endpoint returned an HTML error rather than a PDF and was not bypassed. `SOURCES.json` records inspected public pages and local leads; evidence copies are in `evidence/`. Open questions include the exact device and environment, its dedicated product route, its actual test evidence, and the relevant jurisdiction and edition.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `7109a09e8cc96dcb0be4c2493b9c6effe25f04e55b84777b75e69f7d1a679b2a`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61000-6-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61000-6-2",
  "report_path": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and detailed test tables unavailable; publisher preview returned HTML error",
    "No product-specific test evidence or current legal/OJEU status verified"
  ],
  "local_holdings_summary": "No candidate PDF, extracted text or memory file; filename search found no 61000 match in NORMATIVE."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/25630",
    "title": "IEC 61000-6-2:2016 edition 3",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "evidence/iec-25630.html",
    "evidence_kind": "public scope and publisher lifecycle/reference metadata",
    "coverage_limitation": "No full clauses"
  },
  {
    "url_or_path": "https://www.evs.ee/en/iec-61000-6-2-2016",
    "title": "IEC 61000-6-2:2016",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "evidence/evs.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Republished scope only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/4189",
    "title": "IEC 61000-4-2:2008",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "evidence/iec-4-2.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Not a product test report"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/4209",
    "title": "IEC 61000-4-3:2006",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "evidence/iec-4-3.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Historical referenced edition, not currency audit"
  },
  {
    "url_or_path": "https://www.evs.ee/en/evs-en-iec-61000-6-4-2019",
    "title": "EN IEC 61000-6-4:2019 / IEC 61000-6-4:2018",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "evidence/evs-6-4.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Emission scope only"
  },
  {
    "url_or_path": "https://single-market-economy.ec.europa.eu/single-market/european-standards/harmonised-standards_en",
    "title": "European Commission harmonised standards",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "evidence/ec-harmonised.html",
    "evidence_kind": "official guidance",
    "coverage_limitation": "Not OJEU listing"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxMDAwLTYtMntlZDMuMH1iLnBkZg==",
    "title": "IEC 61000-6-2 preview endpoint",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "evidence/preview.pdf",
    "evidence_kind": "failed preview",
    "coverage_limitation": "HTML error, not PDF; no bypass"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md",
    "title": "Historical umbrella batch",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "source path",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Historical and unverified"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Bounded safety source review",
    "access_time_utc": "2026-11-02T23:06:02.712925+00:00",
    "evidence_path": "source path",
    "evidence_kind": "local research reference",
    "coverage_limitation": "Not an IEC 61000-6-2 clause review"
  }
]
`````
