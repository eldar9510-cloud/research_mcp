---
{
  "format": 1,
  "metadata": {
    "id": "iec-61204-7-detailed-research-2026-11-02",
    "title": "IEC 61204-7 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61204-7?",
    "scope": "Detailed IEC 61204-7 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:25.601Z"
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
  "sourceDigest": "050a7ab7950435b5aa840e06a92bb3b0da693d5f6f960acf677714bd4d4d41db",
  "proposalRevision": "172bc3e0e8dec4c2a5acdc5dd87ddbaa8f64634e6ca45b2bfe1ca6241185a7ef"
}
---
# IEC 61204-7 — switch-mode power-supply safety

**Research check:** 2026-11-02 UTC. **Coverage:** public publisher abstracts and local inventory, not a full-clause review or legal applicability assessment.

## Identity and status

IEC **61204-7:2016**, *Low-voltage switch mode power supplies — Part 7: Safety requirements*, is an International Standard in IEC TC 22/SC 22E’s stabilized power supplies work. IEC lists edition 2.0, published 7 November 2016, and a stability date of 2026. The same record describes the second edition’s replacement of IEC 60950-1 by IEC 62477-1 as the reference document and the title change from “DC output” to “switch mode”. [1] A stability date is not a withdrawal date or a guarantee that a revision has been published. The public record inspected does not clearly establish the complete amendment/corrigendum history or whether any later edition exists; verify the live lifecycle before acquisition. EN adoption, supplier citation, and OJEU status are separate questions and are **not verified here**.

## Purpose and scope

This is a **product safety** standard for switch-mode power supply (SMPS) units. It is relevant to PSU manufacturers and test laboratories assessing product safety, and to equipment integrators interpreting a manufacturer's declared standard and conditions. Its job is not to specify a whole machine safety function or to select every downstream protective device. [1]

IEC’s 2016 abstract states that it addresses units supplied up to **1,000 V AC or 1,500 V DC**, providing AC and/or DC outputs, but **excludes inverter outputs establishing AC mains**. It includes both stand-alone and component SMPS as defined in the document. It also mentions DC power and distribution equipment providing, distributing, monitoring and controlling isolated secondary-circuit power to other equipment typically in ICT installations. [1] This is the wording of the public abstract, not proof that every device called a DC distribution module is covered; read the exact standard and identify the equipment and output before a scope determination.

The separate limits on supply voltage do not imply any particular output rating, insulation classification, use environment or machine application. An AC-output UPS is not automatically in this scope merely because it contains switching electronics: the explicit inverter-output exclusion and complete-product classification must be considered. IEC 62040-1’s public description concerns UPS delivering fixed-frequency AC output; DC UPS and individual functional modules must also be distinguished. [1, 5] Neither all power supplies nor all DIN-rail devices are automatically covered based on category or mounting.

## Technical content and practical use

The source establishes safety requirements and the reference-document relationship, but the actual requirements, testing sequence, construction conditions and cross-references were **not read**. Do not treat this report as a clause-by-clause account, claim precise insulation or temperature requirements, or derive SELV/PELV limits from the old batch. [1, 5] Where an exact product's declaration invokes this part, the following are practical engineering questions, not claims that a particular clause prescribes a particular answer:

- Is this the exact model and revision, stand-alone or a component intended for installation in another enclosure? What are its rated input range, output characteristics and environmental/derating limits?
- What input protective device, conductor size, earthing, mounting orientation, clearances and cooling does its manual prescribe? Are these conditions met in the actual panel?
- What isolation, accessible-output classification and protective separation does the manufacturer declare for the actual ports? How are they affected by connection to other circuits?
- What output overload/short-circuit behavior, restart characteristics and external protection are specified, and are they compatible with the loads and wiring?
- What certificate or declaration names the exact product and edition, and what tests or installation conditions limit its scope? An abstract establishes no product’s conformance. [1, 5]

For a bought PSU use the manufacturer's published external interface, declarations and prescribed protections as the evidence boundary. Reconstructing proprietary transformer, topology, firmware or internal protective circuitry is not an ordinary component-intake prerequisite. Actual installation and machine integration remain separate from a product declaration. [6]

## Functional safety and ISO 13849

Relevance is **conditional**, not automatic: a supply can support a safety-related control circuit, and its loss or abnormal output may affect the behavior of the complete function. The ISO 13849 assessment must consider the actual architecture, interface, specified operating conditions and behavior of the complete safety function; ask the supplier for documented behavior or safety data where necessary. This is an integration question, not a claim that IEC 61204-7 itself specifies an ISO 13849 safety function. [1, 7]

A PSU’s electrical product-safety conformity alone does not establish a certified safety subsystem, diagnostic coverage, Category, PL, SIL or PFHd, nor prove machine safety. If a manufacturer explicitly offers a certified subsystem, retain the exact certificate, variant, declared safety function and limitations separately; validate its use in the intended function. No conversion or inferred safety rating is justified from this standard number. [5, 7]

## Relationship with other standards

- **IEC 62477-1:** IEC says it is the 2016 edition’s reference document, replacing IEC 60950-1 in that role. This fact does not establish which precise clauses or editions apply without inspecting the standard itself. [1]
- **IEC 61558-2-16:2021:** safety requirements and tests for switch-mode power supply units and transformers for such units for general applications; the IEC record says use with IEC 61558-1:2017. Its scope and the actual manufacturer's declaration must be examined for a given unit; it is not automatically merely an internal-transformer standard or a universal companion. [2]
- **IEC 61010-2-201:2024:** particular safety requirements for control equipment, used with IEC 61010-1:2010 and amendment 1:2016 as stated by IEC. It is a different equipment-scope route, not a blanket prerequisite for every SMPS. [3]
- **IEC 62368-1:2023:** safety for audio/video and ICT equipment, using an energy-source and safeguard approach. Relevance depends on the product and declaration; it is not a universal baseline for all industrial PSUs. [4]
- **IEC 62040-1:** a separate AC-output UPS safety route; the local primary-source check cautions that complete DC UPS, DC-input/output functional units and batteries cannot be collapsed into that route. [5]

The archived fill report labels IEC 61204-7 redundant whenever two other standards are met and prescribes a universal three-standard PSU combination. Those categorical conclusions are **not established** by the publisher scopes. The local correction gives Phoenix TRIO3 article 1159045 as a counterexample to treating the proposed 62368 declaration as a mandatory intake default: its cited manufacturer datasheet lists IEC 61010-1/-2-201 and DIN EN 61558-2-16 among its standards, with associated isolation claims. That example proves neither that 61204-7 is required nor that it is inapplicable to the product. Preserve the actual exact-variant evidence instead. [5]

## Library use and acquisition

For `power_supply`, first distinguish a switch-mode PSU from other power sources; record variant, stand-alone versus component, electrical input/output, supplied documentation, and actual declared standards/editions. For `ups`, distinguish complete AC UPS, complete DC UPS and functional DC module before looking for the correct standard. [1, 5] A candidate standard is an evidence question, not a new category-wide gate or component approval. Differences between a manufacturer declaration, independent certificate and an engineer's applicability determination should stay explicit. [6]

`NORMATIVE_CANDIDATES.json` lists no matching PDF, extracted markdown or memory candidate. A filename search of the local `NORMATIVE` tree for `*61204*` also returned no match. Therefore **no matching full text was found**, rather than a verified claim that the project holds no copy anywhere. The archived historical fill and correction are research references, not held normative text. [5, 8] No exact held edition can be verified.

**Recommendation: conditional acquisition**, not blanket purchase: obtain the applicable full edition (and any relevant amendments/adoption) when a real in-scope PSU scope, construction/test or disputed clause question cannot be resolved by the exact manufacturer’s documentation. Prioritize the product’s supplier manual and certificate first for routine black-box intake. Check current publication, adopted edition and jurisdiction separately before ordering. [1, 5, 6]

## Sources and limitations

1. IEC, [IEC 61204-7:2016 product and scope](https://webstore.iec.ch/en/publication/26155), public abstract and metadata; `evidence/iec-26155.html`.
2. IEC, [IEC 61558-2-16:2021](https://webstore.iec.ch/en/publication/65385), public abstract; `evidence/iec-61558.html`.
3. IEC, [IEC 61010-2-201:2024](https://webstore.iec.ch/en/publication/64909), public abstract; `evidence/iec-61010.html`.
4. IEC, [IEC 62368-1:2023](https://webstore.iec.ch/en/publication/69308), public abstract; `evidence/iec-62368.html`.
5. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md`, §§1–3, checked historical PSU/UPS correction and exact supplier example; its cited primary supplier PDF and CPU text were not independently re-read in this investigation.
6. Local `CLAUDE.md`, Purchased-component boundary; and research guide `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, §§1–4.
7. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, result and PL/SIL assessment; prior bounded held-text review, not a fresh complete ISO review.
8. Local `NORMATIVE_CANDIDATES.json` and filename search of `/media/eldar/disk_2/Machine_concept/NORMATIVE` on 2026-11-02; local historical `batch01-power-gemini-fill.md`, IEC 61204-7 and verdict sections.

All four external pages were accessed 2026-11-02 UTC. Full IEC 61204-7 text, complete lifecycle, precise normative references, EN adoption and current OJEU status remain unverified; no certification or regulatory conclusion follows.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `de261b1be128705efa0e98b3063dc6c69c5b9d10976ee4154cb2007bca10bf93`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61204-7`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61204-7",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and precise normative references not inspected",
    "Complete amendment/corrigendum and later-edition status not confirmed",
    "EN adoption and current OJEU status not checked"
  ],
  "local_holdings_summary": "No matching full text found in supplied candidate inventory or NORMATIVE filename search; historical research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/26155",
    "title": "IEC 61204-7:2016",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "evidence/iec-26155.html",
    "kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/65385",
    "title": "IEC 61558-2-16:2021",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "evidence/iec-61558.html",
    "kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/64909",
    "title": "IEC 61010-2-201:2024",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "evidence/iec-61010.html",
    "kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/69308",
    "title": "IEC 62368-1:2023",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "evidence/iec-62368.html",
    "kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "PRIMARY_SOURCE_CHECKS.md",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "kind": "old research lead",
    "limitation": "Local research or project context; not IEC 61204-7 full text"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "SAFETY_SOURCE_REVIEW.md",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "kind": "old research lead",
    "limitation": "Local research or project context; not IEC 61204-7 full text"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "README.md",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "kind": "old research lead",
    "limitation": "Local research or project context; not IEC 61204-7 full text"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini-fill.md",
    "title": "batch01-power-gemini-fill.md",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini-fill.md",
    "kind": "old research lead",
    "limitation": "Local research or project context; not IEC 61204-7 full text"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/CLAUDE.md",
    "title": "CLAUDE.md",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/CLAUDE.md",
    "kind": "project instruction",
    "limitation": "Local research or project context; not IEC 61204-7 full text"
  },
  {
    "path": "NORMATIVE_CANDIDATES.json",
    "title": "Local candidate inventory",
    "access_time_utc": "2026-11-02T23:01:04.009098+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "kind": "local inventory",
    "limitation": "Filename candidate search, not proof of absence everywhere"
  }
]
`````
