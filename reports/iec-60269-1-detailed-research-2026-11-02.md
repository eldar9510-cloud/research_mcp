---
{
  "format": 1,
  "metadata": {
    "id": "iec-60269-1-detailed-research-2026-11-02",
    "title": "IEC 60269-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60269-1?",
    "scope": "Detailed IEC 60269-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:25.844Z"
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
  "sourceDigest": "cfe2fdb351f11a358d66ca5a19a438d4f47b15e5724fb0109f56f10fc52edc77",
  "proposalRevision": "ce901d9a004d927b5a594d3974399c2308ca4b842af1a08c962641843fe3f715"
}
---
# IEC 60269-1 — low-voltage fuses: general requirements

**Research checked 2026-11-02 UTC.** This is a scope and application-routing report, not inspection of the complete standard, a design calculation, certification, or a product-approval decision. IEC's public catalog is the principal evidence. Square-bracket source identifiers resolve to exact links and saved evidence in `SOURCES.json`.

## Identity and publication status

[1] identifies **IEC 60269-1:2024, Low-voltage fuses – Part 1: General requirements**, an International Standard produced by IEC TC 32/SC 32B, edition 5.0, published 2024-08-09. Its lifecycle data identifies the 2024 edition as published and the preceding 2006 edition and its consolidated amended versions as revised. The same page lists an amendment as under development/approved for CDV; this is **not a published amendment**, and a forecast is not a publication date. A stability date is not a withdrawal date or guarantee of an unchanged standard. No more recent published Part 1 edition is shown on this record as checked; this is not a comprehensive legal or national-adoption audit.

The historical power batch [8] correctly leads to the 2024 catalog record, but its extra claims about detailed changes, fuse selection and performance were not validated by the short public Part 1 abstract. They should not be imported as requirements or design rules. Supplier-cited editions are distinct from the IEC publication record; no particular supplier product was investigated. No EN adoption, OJEU listing, regulation or transition status was checked.

## What it covers and why it matters

A fuse is an overcurrent protective device whose fuse-link interrupts current by operating under fault or overload conditions as characterized for the actual design. The standard establishes a common product-standard framework for applicable low-voltage fuses. It is useful to fuse manufacturers and test bodies as a general baseline and to electrical engineers as a route for understanding the specified protective device and requesting evidence—not as a replacement for engineering the circuit.

**Publisher scope, not a generalization:** IEC describes Part 1 as applicable to fuses incorporating **enclosed current-limiting fuse-links** with a rated breaking capacity of at least **6 kA**, for power-frequency AC circuits of nominal voltage not exceeding **1,000 V** or DC circuits of nominal voltage not exceeding **1,500 V** [1]. These values are the publisher's scope boundaries, not fuse selection ratings or proof of suitability. Other protective devices, open links, fuses below that breaking-capacity threshold, other frequencies, and systems beyond those stated limits cannot be assumed to fall within this abstract; a different or further standard may apply. The abstract is not a complete exclusion list, and it does not establish applicability to every item casually called a fuse.

A fuse-link and its holder/base are distinct parts of an assembly: compatibility, access to replacement and manufacturer-prescribed installation must be established for the actual combination. A component in a fuse terminal or drive is not automatically an independently compliant fuse assembly. Applicability to a particular subtype must be checked against its supplementary part and its own scope; general Part 1 is not a universal substitute for those parts.

## Technical subjects and limits of this investigation

The catalog abstract establishes current limitation, enclosed fuse-links, rated breaking capacity, voltage and circuit type [1]; these are the confirmed general technical anchors. In practice an engineer needs the actual edition and relevant companion part to determine which construction details, characteristics, markings, test methods and acceptance criteria apply. We did **not** obtain a readable full Part 1 text or its table of contents: the public preview request returned HTTP 403 [7]. Consequently no complete inventory of its tests, clause-by-clause obligations, utilization-category definitions, specific dimensions or edition changes is claimed here.

Different evidence serves different purposes. Product construction and test requirements concern the fuse's characterized performance; deciding whether a given fuse protects a real conductor, load or electronic converter additionally requires circuit data and manufacturer application information. IEC's application guide [6] is a **technical report**, explicitly described as guidance on applying current-limiting low-voltage fuses, not itself the Part 1 product standard. An application guide cannot establish conformity of a particular part either.

## Companion parts: select by the actual device and use

* **IEC 60269-2**, supplementary requirements for fuses for use by authorized persons, mainly industrial applications. Its consolidated publication describes standardized fuse systems and says relevant Part 1 provisions apply unless otherwise defined in Part 2 [2]. The industrial distribution or machine cabinet route may be relevant, but the specific system, fuse-link and holder still matter.
* **IEC 60269-3**, supplementary requirements for fuses for operation by unskilled persons, mainly household and similar applications. The 2024 abstract says this part applies to gG fuses and discusses safe replacement and non-interchangeability [3]. Do not infer that every gG fuse is a Part 3 fuse or that an industrial device automatically meets the unskilled-operation conditions.
* **IEC 60269-4**, supplementary requirements for fuse-links protecting semiconductor devices. Its 2024 abstract explicitly says Part 1 applies except where otherwise indicated and adds semiconductor-protection requirements [4]. The fact that a drive contains semiconductors does not by itself establish a particular fuse type or prove the drive is protected; the drive maker's specified protection and coordination must be checked.
* **IEC 60269-7**, supplementary requirements for fuse-links protecting batteries and battery systems [5]. A DC marking or the presence of a battery does not by itself establish conformity to this part or an appropriate battery fault interruption rating.
* **IEC TR 60269-5** is a fuse application guide, as distinguished above [6]. Companion-part references here establish possible routes, not a complete series map or automatic application of every subtype requirement to Part 1.

## Practical use in an electrical library

For a prospective `fuse` entry, or a `terminal_fuse` incorporating or accepting a link, first identify whether the purchased article is the fuse-link, holder, fuse terminal, or a supplied combination. Ask for exact manufacturer and orderable variant, product documentation revision, declared applicable standard **and edition**, the correct supplementary part, and any certificate and its exact scope. A catalog family statement or membership in a standard's scope is not a declaration, a test result, or proof about a specific variant. An older supplier-declared edition should be retained as such, not silently rewritten to the 2024 IEC edition.

Selection questions to resolve from the manufacturer's documented characteristics and the circuit include:

1. Is the device intended for AC or DC, and do the actual circuit voltage, prospective fault current, operating conditions and fuse breaking capability match? DC and AC suitability must not be interchanged from a single number.
2. What are the manufacturer's stated current rating, time/current characteristic, current-limiting and energy-let-through information, and operating/ambient derating conditions? These are product data to obtain, not values deducible from Part 1 membership.
3. Is the holder/terminal physically and electrically compatible, including mounting, connection, touch protection, replacement procedures and any specified upstream/downstream protection? Verify the complete external interface; do not demand proprietary construction internals of an off-the-shelf component.
4. What does the protected equipment manufacturer prescribe for conductor, motor branch, semiconductor converter, battery or other use? What evidence supports coordination/selectivity with upstream protective devices and the protective-device combination at the actual fault level? A fuse's current-limiting nature alone does not demonstrate selectivity or semiconductor protection.
5. Is replacement restricted to authorized personnel or intended for unskilled use? Choose the correct supplementary system on its own scope rather than on a library folder name. Maintain the conditions with the component reference and leave actual circuit verification to the machine designer.

Other protection categories and upstream/downstream equipment can be affected as interfaces, without assigning IEC 60269-1 to circuit breakers, drives or all terminal blocks. Record the exact supplier's declarations separately from engineering applicability, independent certificate scope and library lifecycle approval.

## Functional safety relevance

Overcurrent protection can affect electrical hazards, power availability and the environment in which a control system operates. That is not equivalent to a validated safety-related control function. Part 1 scope or a fuse claim alone does not establish a component's diagnostic coverage, reliability data, subsystem category, PL or SIL, nor prove the complete safety function. If a fuse is part of an ISO 13849 assessment, the actual architecture, supported component data, foreseeable faults, operating conditions and system validation must be assessed under the applicable functional-safety route and supplier evidence. Do not invent values or treat a passive protective part as a certified safety subsystem merely because it complies with a product standard. This is a distinction about evidential roles, not a determination that every fuse has a safety role.

## Local holdings and recommendation

The supplied `NORMATIVE_CANDIDATES.json` contains no matching PDF, extracted Markdown or memory candidate; a filename search under `M/NORMATIVE` found no path containing `60269` [9]. No matching full text was identified, but filename search is not proof that the document cannot appear inside a differently named bundle. The archived batch [8] is a research lead, not a locally held standard; its claims are not a substitute for the text. No held edition, EN adoption or complete companion part has been verified.

**Conditional acquisition/update:** for a real design, specification or dispute requiring interpretation of fuse requirements, obtain authorized access to the edition relevant to the manufacturer claim and the correct supplementary part; check the 2024 Part 1 edition and any published changes at that time. For routine intake where exact product declarations and manufacturer application data already answer the question, treat full-text acquisition as lower priority rather than an automatic purchase. The parent owns any holdings decision and catalog changes.

## Remaining questions and evidence quality

The full Part 1 scope and exclusions, complete test subjects and differences from earlier editions remain unverified. The IEC preview returned 403; no bypass was attempted. Companion abstracts give only bounded context; exact interplay of the dated Part 2 consolidated edition with a particular supplier's cited Part 1 edition requires reading the relevant texts and declaration. No particular fuse, certificate, application calculation, national adoption or current legal status was assessed. Public pages are snapshots inspected on 2026-11-02 and can change.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `8bdb8ce8411b527af3a9d5347e438a5fcfae6d0bbb65e46473abc7294e15a8d5`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60269-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60269-1",
  "report_path": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and complete scope, test clauses and edition changes not inspected; preview returned 403",
    "No supplier-specific certification, selection or legal/EN/OJEU assessment",
    "Part 2 and Part 1 edition relationship for an actual claim requires exact texts"
  ],
  "local_holdings_summary": "No filename-matched IEC 60269 full text, extracted text or memory candidate found in NORMATIVE; search cannot exclude differently named bundles."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "id": "1",
    "url_or_path": "https://webstore.iec.ch/en/publication/66096",
    "title_edition": "IEC 60269-1:2024 ed 5.0",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": "evidence/iec-66096.html",
    "evidence_kind": "public scope and lifecycle",
    "coverage_limitation": "Only abstract and embedded lifecycle, not full clauses"
  },
  {
    "id": "2",
    "url_or_path": "https://webstore.iec.ch/en/publication/96037",
    "title_edition": "IEC 60269-2:2013+AMD1:2016+AMD2:2024 CSV",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": "evidence/iec-96037.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Consolidated companion abstract; edition references require exact text"
  },
  {
    "id": "3",
    "url_or_path": "https://webstore.iec.ch/en/publication/71454",
    "title_edition": "IEC 60269-3:2024",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": "evidence/iec-71454.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Companion abstract only"
  },
  {
    "id": "4",
    "url_or_path": "https://webstore.iec.ch/en/publication/66094",
    "title_edition": "IEC 60269-4:2024",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": "evidence/iec-66094.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Companion abstract only"
  },
  {
    "id": "5",
    "url_or_path": "https://webstore.iec.ch/en/publication/60005",
    "title_edition": "IEC 60269-7:2021",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": "evidence/iec-60005.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Companion abstract only"
  },
  {
    "id": "6",
    "url_or_path": "https://webstore.iec.ch/en/publication/68251",
    "title_edition": "IEC TR 60269-5:2014+AMD1:2020 CSV",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": "evidence/iec-68251.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Application guide abstract only"
  },
  {
    "id": "7",
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMjY5LTF7ZWQ1LjB9Yi5wZGY=",
    "title_edition": "IEC 60269-1:2024 preview request",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": "evidence/iec-preview.pdf",
    "evidence_kind": "access failure",
    "coverage_limitation": "HTTP 403 HTML, not PDF; no bypass"
  },
  {
    "id": "8",
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md",
    "title_edition": "Historical batch 01 power IEC 60269-1 section",
    "accessed_utc": "2026-11-02T23:00:00Z",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Unverified secondary research; original read-only source"
  },
  {
    "id": "9",
    "url_or_path": "/media/eldar/disk_2/Machine_concept/NORMATIVE",
    "title_edition": "Filename search 60269 and NORMATIVE_CANDIDATES.json",
    "accessed_utc": "2026-11-02T23:01:02Z",
    "evidence_path": "evidence/local-holdings-search.txt",
    "evidence_kind": "local inventory search",
    "coverage_limitation": "Filename search cannot exclude text in differently named files"
  }
]
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[1]: <https://webstore.iec.ch/en/publication/66096>
[2]: <https://webstore.iec.ch/en/publication/96037>
[3]: <https://webstore.iec.ch/en/publication/71454>
[4]: <https://webstore.iec.ch/en/publication/66094>
[5]: <https://webstore.iec.ch/en/publication/60005>
[6]: <https://webstore.iec.ch/en/publication/68251>
[7]: <https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMjY5LTF7ZWQ1LjB9Yi5wZGY=>
