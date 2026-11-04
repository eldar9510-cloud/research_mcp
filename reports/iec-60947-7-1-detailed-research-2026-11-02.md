---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-7-1-detailed-research-2026-11-02",
    "title": "IEC 60947-7-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-7-1?",
    "scope": "Detailed IEC 60947-7-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:28.115Z"
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
  "sourceDigest": "0d54434df185e9a06760496773e44c5dd2e1aca6c49fb59bf93577923d79e885",
  "proposalRevision": "57cb5551b8c2bfc2e7697751f5b5fc7367516386ea5b24a4dada0dd047d1d69c"
}
---
# IEC 60947-7-1 — terminal blocks for copper conductors

**Research date:** 2026-11-02 UTC. **Depth:** IEC public catalog scopes and publication records; no full standard or technical test clauses inspected. This is routing and component-evidence research, not product certification, design approval, or a statement of regulatory status.

## Identity and publication history

IEC 60947-7-1:2025, *Low-voltage switchgear and controlgear – Part 7-1: Ancillary equipment – Terminal blocks for copper conductors*, is an IEC International Standard, fourth edition, published 15 April 2025. IEC identifies it as a technical revision that cancels and replaces edition 3, IEC 60947-7-1:2009. The catalog lifecycle lists the 2025 edition as published and the 2009 edition as revised; no later amendment or corrigendum is shown in that lifecycle as checked. This is an IEC publication-status observation, not a claim that a corresponding EN edition is harmonized or legally applicable. The historical batch’s 2009 “current” claim is stale; its 2025 correction is independently confirmed. [1, 2]

IEC highlights changes including extension to smaller conductor sizes, a contact-pressure-via-insulation-material test, a new informative annex for larger cross-sections, reorganization of electrical/mechanical tables, AWG conductor types and examples, and reorganization of the test-disconnect annex. This list is publisher-supplied edition context, not a complete change analysis. [1]

## Purpose and scope

The standard addresses the product requirements for supported terminal blocks that join copper conductors electrically and mechanically. It is useful to terminal-block manufacturers and test organizations, and to panel builders and equipment designers who need to select an appropriately declared product and understand its external conditions of use. The scope is not synonymous with “every terminal on a DIN rail”: per IEC it covers screw-type and screwless-type clamping units, primarily for industrial or similar use, fixed to a support, and includes **test disconnect terminal blocks** addressed in Annex D. [1]

The publisher specifies round copper conductors, with or without special preparation, of 0.05–300 mm² (30 AWG–600 kcmil), for circuits rated no more than 1,000 V AC up to 1,000 Hz or 1,500 V DC. IEC says tests use AC or DC as specified in the relevant clauses. These are **scope limits**, not ratings assigned to a particular part; a manufacturer's product may have a narrower range. They also do not mean every conductor shape, material, connection method or installation is covered. The 2009 edition’s listed lower conductor limit is 0.2 mm², illustrating why an edition matters. [1, 2]

The catalog abstract does not give a comprehensive exclusions list. Accordingly, do not assert that non-round conductors, aluminium, all insulation-displacement contacts, PCB-mounted devices or other special cases are forbidden; applicability is unresolved unless the complete 2025 text and the exact product are checked. Similarly, it does not establish that every ordinary block insulates the circuit from every possible rail under every configuration. [1]

### Distinguish the adjacent products

- **Feed-through/interconnection:** Part 7-1 is the candidate for a supported copper-conductor terminal block within the publisher scope. A test-disconnect subtype is expressly mentioned, but the abstract alone does not establish its suitability as a load-break switch or protective isolator. [1]
- **Protective conductor:** IEC 60947-7-2:2009 specifically addresses PE and PEN terminal blocks, including connection to the fixing support. It describes its own conductor and application limits and is commonly used alongside 7-1 blocks. Do not infer that an ordinary feed-through terminal makes a protective bond, or that every PE block makes any rail a compliant fault-current path: verify exact device, support and prescribed mounting. [3]
- **Fuse terminal:** IEC 60947-7-3:2009 has its own scope, for fuse terminal blocks accepting IEC 60127-2 cartridge fuse-links under specified conditions; its abstract says certain designs may protect only against short circuit. Verify the actual compatible fuse-link, interrupting capability, protection and access conditions rather than importing a generic fuse claim into 7-1. Part 7-3’s scope explicitly describes tool-accessible enclosures; blanket claims that all fuse terminals are touch-safe during replacement are not established here. [4]

## Technical subjects and practical electrical use

IEC’s abstract confirms the product scope, connection principle and the 2025 changes above. The related general-rules publication IEC 60947-1 identifies characteristics, information, service/mounting conditions, construction and performance requirements, and verification as topics of the general framework where the product standard requires it. IEC’s product page links Part 1 as related; the precise normative incorporation and edition for each provision must be confirmed in the actual 7-1:2025 text. [1, 5]

For an engineer, the useful questions are connection reliability, mechanical fastening and insulation under declared electrical and environmental service conditions, including the test-disconnect arrangement where applicable. IEC’s announcement of the contact-pressure-via-insulation-material test is evidence that this design concern is addressed, not evidence of a particular pass result for a purchased block. The public abstract does **not** supply the full list of tests, acceptance criteria, torque values, insulation coordination provisions, vibration tests, or detailed marking requirements. Do not turn the old batch's assertions about universal CTI, vibration-proof clamps, or guaranteed strand integrity into verified individual clauses. [1, 5, 6]

For a concrete electrical selection, check the manufacturer's published external contract for the exact part and accessories:

1. Copper conductor type and permitted cross-section on each side; permissible preparation, ferrules and number of wires per clamping point; screw torque or tool and insertion method as applicable.
2. Product-declared voltage and current in the actual configuration, relevant frequency, insulation and environmental conditions; use the manufacturer's documented derating and adjacent-component conditions rather than the broad standard scope as product ratings.
3. Support/rail and end-stop compatibility; required end plates, covers, bridges or jumpers; separation and physical layout; manufacturer instructions for mounting, identification and servicing.
4. Prospective fault conditions and external protective-device coordination: the terminal is not itself necessarily a fuse or protective device. For a test-disconnect design, check permitted operations and whether energized operation is allowed rather than assuming load-breaking capability.
5. Exact manufacturer declaration or certificate and edition, test scope and accessory configuration. A generic interface description or an IEC catalog scope only establishes a plausible product family, **not conformity of the particular article**. A certificate, declaration and independent laboratory report are different kinds of evidence.

These are practical selection questions, not claimed verbatim clauses. Keep the bought device a black box: prescribed connections and published limits matter; proprietary clamping geometry or internal materials need not be reverse-engineered for normal intake. Actual wiring, protection, isolation and panel/system verification remain application responsibilities. [1, 5, 6]

## Functional safety — conditional role

A terminal block is normally a passive connection, not by itself a safety controller or a complete certified subsystem. If it carries wiring of an ISO 13849 safety-related control function, its continuity, shorting or cross-connection and foreseeable installation/maintenance conditions can matter in the system’s fault analysis and validation. Preserve the product's actual documented data and installation conditions; evaluate the safety function, architecture and relevant fault assumptions at machine level. An IEC 60947-7-1 declaration alone does not establish a PL, SIL, Category, diagnostic coverage, fault exclusion or achieved machine safety function. A generic test-disconnect feature does not establish a safe isolation function. The previously inspected held ISO 13849-1:2023 safety review likewise distinguishes implemented diagnostics and combination validation from component labels; it does not assert a terminal-specific fault exclusion. [7]

## Related standards — distinct roles

- **IEC 60947-1:2020:** general low-voltage switchgear/controlgear rules, definitions, characteristics, construction/performance and verification where the relevant product standard invokes them. Use the edition and modifications specified by the applicable product standard, rather than assuming every rule applies unchanged. [5]
- **IEC 60947-7-2:2009:** protective-conductor PE/PEN terminals, especially connection to the fixing support. Its own publisher page references the 2009 7-1 and 2007 Part 1; do not silently replace those dated references with 2025/2020 when interpreting that older publication. [3]
- **IEC 60947-7-3:2009:** fuse-terminal product safety and test methods and compatibility with its specified standardized fuse-links; its cited companions must be assessed as published. It is not simply a synonym for a plain feed-through terminal. [4]
- **ISO 13849-1:** conditional framework for design and validation of safety-related control parts, if this connection participates in such a function. It does not transform a generic product-standard claim into a subsystem certification. [7]

## Library and holdings implications

For `terminal_feedthrough`, record this standard as a **candidate** when the exact product and scope align; retain the manufacturer's actual declared edition and check mechanical/electrical limits and accessory conditions. For `terminal_pe` and `terminal_fuse`, route first to the distinct relevant product subtype and its 7-2 or 7-3 evidence; a mixed or multifunction terminal requires exact documentation rather than an exclusive label. No library field, lifecycle state or product approval follows from this report. [1, 3, 4, 6]

`NORMATIVE_CANDIDATES.json` lists no PDF, extracted Markdown or memory candidate. An independent filename search of `NORMATIVE/STANDARDS_PDF`, `extracted_html`, `extracted_txt` and `.claude/memory` for 60947/7/1 found no match. This is **no matching full text found**, not proof no copy exists under an unrelated name. The old local batch is research only, not a held edition. Recommend **conditional acquisition/update** of IEC 60947-7-1:2025 if a real terminal qualification, change assessment or disputed detailed clause requires direct access; routine off-the-shelf intake can begin with exact supplier evidence. No blanket purchase recommendation. [6]

## Sources, limitations and open questions

1. IEC, [IEC 60947-7-1:2025 publication 72949](https://webstore.iec.ch/en/publication/72949), official scope, edition, lifecycle and change summary; `evidence/iec-2025.html` and `evidence/iec-2025.txt`.
2. IEC, [IEC 60947-7-1:2009 publication 4005](https://webstore.iec.ch/en/publication/4005), superseded edition scope; `evidence/iec-old.html`. Search results/lifecycle retained as `evidence/api-search.json` from the IEC public search API.
3. IEC, [IEC 60947-7-2:2009 publication 4006](https://webstore.iec.ch/en/publication/4006), protective conductor scope; `evidence/iec-pe.html` and `evidence/api-60947-7-2.json`.
4. IEC, [IEC 60947-7-3:2009 publication 4007](https://webstore.iec.ch/en/publication/4007), fuse-terminal scope; `evidence/iec-fuse.html` and `evidence/api-60947-7-3.json`.
5. IEC, [IEC 60947-1:2020 publication 26973](https://webstore.iec.ch/en/publication/26973), general rules scope; `evidence/iec-general.html` and `evidence/api-60947-1.json`.
6. Local historical lead: `Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md`, IEC 60947-7-1/-7-2/-7-3 sections; its claims are not primary evidence. Guide: same directory `README.md`, category and evidence distinctions.
7. Local bounded review `Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, claim assessment, citing held ISO 13849-1:2023 §§6.1.5 and 6.2.1. It is a secondary research check and not terminal-specific normative text.

The IEC preview request returned **403**, retained as `evidence/preview.pdf` (actually an HTML error, not a PDF); no bypass was attempted. No full-clause inspection, national adoption, supplier-specific declaration or OJEU legal-status check was made. Before deciding a disputed applicability case, inspect the full 2025 scope, normative references and test clauses, the exact manufacturer's instructions, and jurisdiction-specific adoption separately. See `SOURCES.json` for access times and provenance.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `542590ec55b9be2b60c0a5fae910c91edc48c3ae1400b4e3a05634296b7e243c`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-7-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-7-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full 2025 text and complete exclusions/test clauses not inspected; official preview returned 403",
    "EN adoption and legal/OJEU status not checked",
    "No exact product declaration or installation checked"
  ],
  "local_holdings_summary": "No candidate and no filename match in searched NORMATIVE PDF, extracted text and memory trees; historical batch is research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "sources": [
    {
      "url": "https://webstore.iec.ch/en/publication/72949",
      "title": "IEC 60947-7-1:2025 edition 4",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/iec-2025.html",
      "evidence_kind": "official public scope",
      "coverage_limitation": "Public abstract and lifecycle only; full clauses not inspected"
    },
    {
      "url": "https://webstore.iec.ch/en/publication/4005",
      "title": "IEC 60947-7-1:2009 edition 3",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/iec-old.html",
      "evidence_kind": "official public scope",
      "coverage_limitation": "Public abstract only; superseded"
    },
    {
      "url": "https://webstore.iec.ch/en/publication/4006",
      "title": "IEC 60947-7-2:2009",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/iec-pe.html",
      "evidence_kind": "official public scope",
      "coverage_limitation": "Public abstract only; companion scope"
    },
    {
      "url": "https://webstore.iec.ch/en/publication/4007",
      "title": "IEC 60947-7-3:2009",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/iec-fuse.html",
      "evidence_kind": "official public scope",
      "coverage_limitation": "Public abstract only; companion scope"
    },
    {
      "url": "https://webstore.iec.ch/en/publication/26973",
      "title": "IEC 60947-1:2020",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/iec-general.html",
      "evidence_kind": "official public scope",
      "coverage_limitation": "Public abstract only; general rules scope"
    },
    {
      "url": "https://webstore-search-api.iec.ch/api/search",
      "title": "IEC catalog search API POST: 60947-7-1, validOnly false",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/api-search.json",
      "evidence_kind": "official publication search",
      "coverage_limitation": "Metadata and abstracts only; request parameters in title and report; no full clauses"
    },
    {
      "url": "https://webstore-search-api.iec.ch/api/search",
      "title": "IEC catalog search API POST: 60947-7-2",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/api-60947-7-2.json",
      "evidence_kind": "official publication search",
      "coverage_limitation": "Public metadata and abstract only"
    },
    {
      "url": "https://webstore-search-api.iec.ch/api/search",
      "title": "IEC catalog search API POST: 60947-7-3",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/api-60947-7-3.json",
      "evidence_kind": "official publication search",
      "coverage_limitation": "Public metadata and abstract only"
    },
    {
      "url": "https://webstore-search-api.iec.ch/api/search",
      "title": "IEC catalog search API POST: 60947-1",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/api-60947-1.json",
      "evidence_kind": "official publication search",
      "coverage_limitation": "Public metadata and abstract only"
    },
    {
      "url": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTctMXtlZDQuMH1iLnBkZg==",
      "title": "IEC 60947-7-1:2025 preview request",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "evidence/preview.pdf",
      "evidence_kind": "access failure",
      "coverage_limitation": "403 HTML response; file extension is not its content type"
    },
    {
      "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
      "title": "README.md",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
      "evidence_kind": "old research lead",
      "coverage_limitation": "Secondary project research, not full target standard"
    },
    {
      "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
      "title": "PRIMARY_SOURCE_CHECKS.md",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
      "evidence_kind": "old research lead",
      "coverage_limitation": "Secondary project research, not full target standard"
    },
    {
      "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
      "title": "SAFETY_SOURCE_REVIEW.md",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
      "evidence_kind": "old research lead",
      "coverage_limitation": "Secondary project research, not full target standard"
    },
    {
      "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
      "title": "batch07-terminals-connectors-gemini.md",
      "access_time_utc": "2026-11-02T23:04:59.881967+00:00",
      "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
      "evidence_kind": "old research lead",
      "coverage_limitation": "Secondary project research, not full target standard"
    }
  ]
}
`````
