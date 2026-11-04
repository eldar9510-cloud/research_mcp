---
{
  "format": 1,
  "metadata": {
    "id": "iec-60898-1-detailed-research-2026-11-02",
    "title": "IEC 60898-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60898-1?",
    "scope": "Detailed IEC 60898-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.327Z"
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
  "sourceDigest": "a7c6a3bf3e377641a42202e1cab345f43dca46fe8ba208cafafdfc360947b930",
  "proposalRevision": "28c56956ff43d165b41a8763d0ac61ad79019f6b2dff7fc7389ba1664154267c"
}
---
# IEC 60898-1 — AC circuit-breakers for household and similar installations

## Identity and publication status

**IEC 60898-1**, *Electrical accessories – Circuit-breakers for overcurrent protection for household and similar installations – Part 1: Circuit-breakers for a.c. operation*, is an IEC International Standard for a class of air-break circuit-breakers. On 2026-11-02 the IEC catalogue identified the second edition, **IEC 60898-1:2015**, published 23 March 2015, and **Amendment 1:2019**, published 13 December 2019. Its consolidated edition **2.1, IEC 60898-1:2015+AMD1:2019 CSV**, carries both and incorporates the November 2015 base corrigendum and March 2020 amendment corrigendum. The IEC catalogue marks these records published; its returned lifecycle shows the earlier 2002 edition and amendments as revised. The catalogue search did not identify a later published edition or amendment. This is a dated catalogue observation, not a guarantee about later publications. [1–3]

An EN or national adoption, its dates and legal standing are distinct from the IEC record and were not checked. No actual supplier-declared edition was investigated. The 2015+A1:2019 reference in the old local batch is a useful lead, not a supplier claim or independent full-text check. [1, 4]

## What it addresses and who uses it

A miniature circuit-breaker (MCB) provides automatic overcurrent interruption for a circuit, including overloads and short circuits, within the device's declared capabilities. This document is a product standard for the AC breaker class described below. It provides a common basis for product characteristics and verification, useful to manufacturers, test bodies, electrical specifiers and library reviewers. It is not, by itself, a design for an installation. The precise product identity and characteristics, the network and applicable installation rules still matter. [1]

## Scope and boundary

The IEC's published abstract states that the consolidated document covers **AC air-break circuit-breakers**, for 50 Hz, 60 Hz or 50/60 Hz operation, with rated voltage not exceeding **440 V between phases**, rated current not exceeding **125 A**, and rated short-circuit capacity not exceeding **25 000 A**. These are the standard's stated scope limits, not the rating of every breaker or selection values for a particular circuit. The exact device may be rated much lower. [1]

The title describes household **and similar** installations, not exclusively devices in a residence. The abstract alone does not settle every meaning of “similar,” all intended-user qualifications, exclusions or accessories. The public preview endpoint returned an error page, so the complete scope clause and detailed exclusions have not been inspected. In particular, do not infer suitability for DC, residual-current protection, motor-specific protection, or a particular switching/isolation function from this part number alone. Check the device's declaration and instructions and, where needed, the applicable full scope text. [1, 5]

The distinction from **IEC 60947-2:2024** is meaningful but not an installation ban: IEC says that standard covers circuit-breakers intended to be installed and operated by instructed or skilled persons, with specified AC/DC voltage scope and other included types. This is a different product standard and test/rating context, not an automatic substitute for Part 1. Conversely, a domestic/similar-use product standard is not proof that a breaker cannot be used anywhere in an industrial machine. Product design, exact declared standard(s), operating conditions and applicable installation/machine provisions determine the actual question. Some devices may have multiple declarations; establish them from that exact variant's evidence rather than presume dual compliance. [6]

IEC catalogue lists **IEC 60898-2** and **IEC 60898-3** as separate related parts, not amendments of Part 1. Check the exact part and scope for AC/DC or other variants; do not treat an AC-only Part 1 declaration as a DC rating. The present investigation has not verified all exclusions or the complete cross-part applicability rules. [1, 7–8]

## Technical subjects and engineering use

The public IEC abstract explicitly identifies changes from the previous edition concerning **terminals, glow-wire testing and short-circuit-test figures**. These are examples of the product-construction and verification material, not a complete clause inventory or a substitute for the text. The catalogue supplies only an abstract; the requirements, test sequences, classifications and pass criteria have not been read in full. [1–2]

For a proposed circuit, an engineer can use the standard as context for understanding the manufacturer's declared circuit-breaker characteristics and test basis, but should obtain the exact product sheet and installation instructions. Questions include:

- Does the declared part and edition apply to the exact pole configuration, AC supply frequency, rated voltage and intended operating environment? What terminal/conductor and mounting conditions does the manufacturer prescribe?
- Are rated current and time/current characteristic compatible with the load and conductor protection analysis, taking into account operating conditions and any manufacturer derating? A curve letter alone is not a complete coordination study.
- Is the declared breaking capability adequate for the prospective short-circuit current **at the installation point** and relevant voltage? Are any upstream backup or selectivity arrangements specifically supported by manufacturer coordination data?
- Is the switching, isolation, auxiliary-contact, motor-load or DC use actually declared for the exact variant and application? Does the application require separately specified residual-current protection?

These are engineering evidence questions, not numerical rules transcribed from the standard. The product test basis does not on its own establish protection coordination, cable sizing, disconnection, suitability of an assembled panel, or conformity of an installed machine. Preserve the bought device as a black box: its published ratings, external connections, instructions and limitations are the evidence; internal trip mechanisms or proprietary circuits need not be reconstructed. [1, 6]

## Functional safety boundary

An overcurrent-protective breaker may support electrical protection or supply a circuit containing safety-related equipment. IEC 60898-1 is not a functional-safety certification for a machine safety function. Its citation alone supplies no diagnostic coverage, Category, performance level, SIL or failure-rate data and does not prove that the breaker is an appropriate safety-related final switching element. If a breaker is included in a claimed ISO 13849 safety function, define its actual role and failure behaviour and obtain suitable manufacturer evidence and application conditions; assess and validate the complete function under the relevant methodology. No automatic equivalence or conversion follows from an MCB product claim. The local safety review independently cautions against inferring safety metrics from a component feature alone. [9]

## Library and NORMATIVE implications

For `circuit_protection`, separate AC MCBs from DC breakers, residual-current devices, electronic protection and industrial circuit-breakers before using this reference. For a candidate article capture the exact variant, supplier-declared IEC/EN standard and edition, pole count, operating voltage/frequency, current, breaking capability, operating characteristic, terminals and external use conditions. Record certificate/declaration and datasheet provenance separately; an IEC scope match is not proof that the item conforms. For `main_switch`, a breaker can only be considered for a particular switching or isolation role if the exact product evidence and application establish it; category membership does not prove the function. These are review prompts, not schema changes or part approvals. [1, 4, 6]

The supplied `NORMATIVE_CANDIDATES.json` lists **no matching PDF, extracted text or memory candidate**. No edition of IEC 60898-1 full text was available for inspection in this assignment. This is a candidate-index finding, not proof that no copy exists anywhere else. The old batch is a research reference only and expressly says its detailed 60898-1 content was truncated. [4, 10]

**Recommendation: conditional acquisition/update**, not automatic purchase. If recurring intake or a concrete unresolved clause-level question requires testing, exclusions or edition-delta analysis, have the parent verify its holdings and obtain the relevant licensed edition/adoption as appropriate. If routine intake can be settled by exact supplier documentation and ordinary system-level checks, public scope research plus product evidence may suffice; defer full-text acquisition until needed.

## Sources and limitations

1. [IEC 60898-1:2015+AMD1:2019 CSV](https://webstore.iec.ch/en/publication/66269), consolidated catalogue abstract and lifecycle; retained `evidence/iec-66269.html` and catalogue API `evidence/iec-api.json`.
2. [IEC 60898-1:2015](https://webstore.iec.ch/en/publication/21972), base edition catalogue, `evidence/iec-21972.html`.
3. [IEC 60898-1:2015/AMD1:2019](https://webstore.iec.ch/en/publication/62129), amendment catalogue, `evidence/iec-62129.html`.
4. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md`, lines 4–7, 28 and 34: truncated historical lead, not independent current scope authority.
5. IEC public preview endpoint linked on [1], retained error response `evidence/preview-error.html` (HTML, not a PDF); no bypass attempted.
6. [IEC 60947-2:2024](https://webstore.iec.ch/en/publication/66277), IEC catalogue abstract, `evidence/iec-66277.html` and `evidence/iec-60947-search.json`.
7. [IEC 60898-2:2016](https://webstore.iec.ch/en/publication/25675), related-part catalogue, `evidence/iec-25675.html`.
8. [IEC 60898-3:2019+AMD1:2022 CSV](https://webstore.iec.ch/en/publication/74188), related-part catalogue, `evidence/iec-74188.html`.
9. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, targeted component/functional-safety boundary; not an IEC 60898-1 clause review.
10. `NORMATIVE_CANDIDATES.json`, empty matched-file lists supplied to this worker.

**Open questions:** full scope exclusions and accessory requirements; detailed test requirements and edition changes; exact IEC 60898-2/-3 cross-part boundaries; actual product declarations and claimed dual ratings; EN adoption and jurisdictional/OJEU status. None is resolved merely by the public catalogue abstract. Full-clause inspection and installed-system assessment were outside this report.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `90f9014ec43a0f4910900b5085e846e12473f315ea2c7e297ab051bf12dca123`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60898-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60898-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Complete normative scope and exclusions, detailed clauses and tests not inspected; public preview endpoint returned an error",
    "EN adoption and legal status not checked",
    "No exact supplier product or declaration checked"
  ],
  "local_holdings_summary": "Candidate list contains no matching PDF, extracted text or memory file; parent to reconcile holdings."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/66269",
    "title_edition": "IEC 60898-1:2015+AMD1:2019 CSV",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/iec-66269.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Catalogue abstract only; not full text"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/21972",
    "title_edition": "IEC 60898-1:2015",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/iec-21972.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Base edition abstract"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/62129",
    "title_edition": "IEC 60898-1 AMD1:2019",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/iec-62129.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Amendment metadata only"
  },
  {
    "url_or_path": "https://webstore-search-api.iec.ch/api/search",
    "title_edition": "IEC catalogue search 60898-1",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/iec-api.json",
    "evidence_kind": "public scope",
    "coverage_limitation": "POST search query and lifecycle; not complete clauses"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/",
    "title_edition": "IEC 60898-1 consolidated preview",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/preview-error.html",
    "evidence_kind": "failed preview",
    "coverage_limitation": "Error response; actual preview not obtained"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/66277",
    "title_edition": "IEC 60947-2:2024",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/iec-66277.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Comparison limited to abstract; API evidence in evidence/iec-60947-search.json"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/25675",
    "title_edition": "IEC 60898-2:2016",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/iec-25675.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Related-part identity only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/74188",
    "title_edition": "IEC 60898-3:2019+AMD1:2022",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "evidence/iec-74188.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Related-part identity only"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md",
    "title_edition": "Historical switching batch",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "same local path",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Explicitly truncated"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title_edition": "Safety source review",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "same local path",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Safety boundary; not specific clause inspection"
  },
  {
    "url_or_path": "NORMATIVE_CANDIDATES.json",
    "title_edition": "Holdings candidates",
    "access_time_utc": "2026-11-02T23:03:48.702491+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "holdings index",
    "coverage_limitation": "Empty matching candidate lists, not exhaustive proof"
  }
]
`````
