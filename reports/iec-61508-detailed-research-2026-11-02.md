---
{
  "format": 1,
  "metadata": {
    "id": "iec-61508-detailed-research-2026-11-02",
    "title": "IEC 61508 (series) — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61508?",
    "scope": "Detailed IEC 61508 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:31.370Z"
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
  "sourceDigest": "4209a32192963ca8c2ac112a242e7c9305bd5062d4b4e966bc958e48d2d2c157",
  "proposalRevision": "fed1db7ee0235ae7f3f34683c46169a9c784494c48a2b8306368917ab23e18c9"
}
---
# IEC 61508 series — functional safety framework

**Checked 2026-11-02 UTC.** The index entry denotes the **seven-part 2010 series**, not only Part 6. Its common title is *Functional safety of electrical/electronic/programmable electronic safety-related systems*. The IEC catalogue lists Parts 1–7 as International Standards, second edition, published 2010-04-30 [1–7]. Parts 1–4 are basic safety publications, subject to the qualification below; Parts 5–7 provide explanatory methods and guidance. These are distinct documents, not seven chapters held in a single local file.

**Important edition development:** IEC's catalogue also lists 2026 third-edition **PRV final-draft pre-releases** for Parts 1–7 and a new Part 2-1. The Part 1 prerelease page explicitly describes an FDIS voting period 2026-10-02 to 2026-11-13 [8,9]. It is not evidence that the final third edition has already been published. The 2010 part records remain listed; this check does not resolve all corrigenda, amendments, future publication dates, national adoption, withdrawal or OJEU status. Recheck the exact part/edition when making a decision. Related TS/TR publications appear in the IEC catalogue; they are not silently substituted for the original seven-part map [9].

## Purpose and scope

IEC 61508 supplies a technology-neutral-in-application, but **electrical/electronic/programmable electronic (E/E/PE) safety-system focused**, functional-safety framework. It addresses how a safety function can be specified and its necessary integrity achieved over the lifecycle when failures of such systems could contribute to hazardous events. The Part 1 publisher scope describes two objectives: support product/sector standards and enable development of E/E/PE safety-related systems where suitable sector standards do not exist [1]. Intended users include standards committees, system and equipment developers, integrators, assessors and those responsible for operation and maintenance; this is not merely a component test standard.

The 2010 Part 6 introduction describes an overall safety strategy containing sensors, logic and actuators and potentially mechanical, hydraulic and pneumatic safety systems. These other technologies matter to the **whole risk-reduction strategy**, but that does not make every non-electrical component an IEC 61508-certified device or claim every aspect of non-electrical safety is covered [L1 introduction]. It is not a general machinery risk assessment, a guarantee of electrical shock protection, or an installation wiring code. Nor does IEC 61508 itself pick the required SIL for an unspecified safety function; the 2010 introduction describes a risk-based framework and example methods rather than a universal SIL assignment [L1 introduction].

**Boundaries:** 2010 Part 6 §1.2–1.3 says Parts 1–4 have basic safety publication status, except in the context of low-complexity E/E/PE safety-related systems; their horizontal safety function does not apply to medical equipment complying with the IEC 60601 series. In committee-produced standards, the basic publication's requirements, test methods or conditions do not apply merely by association: the relevant standard must refer to or include them. Stand-alone use is also contemplated [L1 §1.2–1.3]. This qualification should not be generalized into a claim that all medical equipment or all low-complexity systems are outside every possible use of the series.

## Explicit seven-part map — 2010 edition

| Part | Title / role | Status and limits |
|---|---|---|
| **1** | **General requirements.** Overall framework, management and safety lifecycle; relates hazard/risk analysis, safety requirements and allocation to implementation and use. | Requirements-bearing, basic safety publication; sector standards may adapt within their domain. Publisher scope and local framework introduction [1,L1]. |
| **2** | **Requirements for electrical/electronic/programmable electronic safety-related systems.** Refines safety requirements to system design and addresses hardware/system design and manufacture, installation, validation, use and modification information. | Requirements-bearing, basic safety publication. Software is addressed separately in Part 3 [2]. |
| **3** | **Software requirements.** Safety-related software lifecycle, software functions and systematic capability; development/configuration support tools, integration information, maintenance and modification. | Requirements-bearing, basic safety publication; software and tool provisions are linked to Parts 1–2 [3]. |
| **4** | **Definitions and abbreviations.** Common vocabulary used across Parts 1–7. | Basic safety publication containing definitions, rather than a stand-alone design recipe [4,L1 §1.2]. |
| **5** | **Examples of methods for the determination of safety integrity levels.** Risk concepts and illustrative quantitative and qualitative approaches. | Informative guidance/examples, not a universal mandatory risk graph; IEC says the examples are simplified and readers should consult source material [5]. |
| **6** | **Guidelines on the application of IEC 61508-2 and IEC 61508-3.** Annex A overview; B example hardware-failure calculation; C diagnostic-coverage example; D common-cause methodology; E worked software-table examples. | Guidance, not the Part 2/3 requirements themselves; the held edition labels its annexes informative [6,L1 §1.1 and contents]. |
| **7** | **Overview of techniques and measures.** Describes methods and tools relevant to Parts 2 and 3. | Informative overview/examples; IEC cautions that references may not represent the state of the art. Selection and required application come from the relevant requirements, not a blanket checklist [7]. |

‘Requirements-bearing’ describes the document's role, not a claim that every annex, note or example in it is normative. Conversely, the requirements-bearing parts may refer to other documents. Precise clause obligations require the applicable full texts.

## Lifecycle and technical themes

The framework links concept, hazard and risk analysis, safety-function specification and allocation, design and implementation, verification and safety validation, installation and commissioning, operation and maintenance, modifications, and eventual decommissioning [L1 introduction; 2,3]. Typical technical questions are what must happen on demand, what operating mode and environment apply, which interfaces and assumptions support the function, and how the result is checked through its life.

For E/E/PE systems Part 2's publisher scope distinguishes measures for fault/failure avoidance and control, scaled to the relevant safety integrity, from the information needed for users to install, maintain and modify the system [2]. Part 3 addresses systematic software capability and tools, not just hardware failure probability [3]. Part 6 illustrates random-hardware reliability, diagnostics and common-cause reasoning; its examples are not automatically valid for every architecture [6,L1 §1]. A safety integrity level is a target for a defined safety function, not a generic property conferred on an entire machine by a component label. Treat numerical results, architecture constraints, systematic capability and specified conditions as separate pieces of evidence.

## Machinery, product standards and ISO 13849

**IEC 62061** is a machinery-sector standard within the IEC 61508 framework. The IEC catalogue for IEC 62061:2021+AMD1:2024+AMD2:2026 describes design, integration and validation of machinery safety-related control systems; the main body concerns high/continuous demand and excludes the design of complex programmable electronic subsystems or their elements. Its scope excludes electrical shock hazards of control equipment and other machine-level safeguarding requirements [10]. The catalogue description itself inconsistently writes the second amendment as “AMD1:2026” while the record title says AMD2:2026; retain this discrepancy and check the actual publication before edition-sensitive use. The IEC abstract explicitly says the 2021 edition extended coverage to non-electrical technologies: the older shorthand ‘62061 is only electrical’ is not reliable [10].

**ISO 13849-1:2023** addresses safety-related parts of machinery control systems across technologies, for high-demand and continuous operation, and explicitly excludes low-demand mode; its introduction also identifies IEC 62061 as another machinery methodology [L2 §1 and introduction]. The two machinery routes have their own scopes and methods; application-specific selection, combination and validation cannot be reduced to a PL/SIL label swap. The held 2023 text permits conditional correlation for eligible SIL subsystems and requires combination validation; it does not authorize inventing a manufacturer PL, Category, SIL or PFH [L2 §6.1.2, §6.2.1; L3].

Specific product standards address particular equipment and interfaces, e.g. IEC 61800-5-2 for safety-related power drive systems or IEC 61496 for electro-sensitive protective equipment. They do not replace assessment of the full machine function; a product standard and IEC 61508/sector-system standard can serve different roles. Check the exact product edition, declared function and conditions, rather than treating a citation as universal certification. The historical claim that SIL 4 must be hardwired/non-programmable is unsupported by the checked evidence and must not become a selection rule [L3]. No claim is made here that SIL 4 is prohibited across machinery generally.

## Electrical library and practical use

For a safety PLC or relay, protective sensor, safety drive, encoder, brake controller or safety-relevant load cell, first ask whether the exact variant participates in a specified safety function. Request its manufacturer declaration/certificate and safety manual, exact hardware and firmware, applicable standard and edition, function, subsystem boundaries, diagnostic behaviour, environmental limits, installation and periodic-test conditions, and any published integrity or failure data. An ordinary component may participate in a validated safety function without itself being a certified subsystem; a certified subsystem still requires correct integration, compatible inputs/outputs, stated power/protection conditions and machine-level validation. A product certificate or SIL claim is not an achieved machine PL/SIL, nor proof of required architecture, fault coverage or safe braking.

Use purchased devices as supplied black boxes: capture manufacturer-prescribed external interfaces and conditions, not proprietary circuitry or firmware internals. Where a device has only a basic electrical role, IEC 61508 is a possible system-design context, not a default mandatory component standard. Record supplier-cited editions separately from catalogue currency and applicable legal/sector requirements. The report proposes evidence questions only; it changes no library policy, category, product record or compliance decision.

## Local holdings and acquisition

**Partial series only.** The actual 116-page local PDF `NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/EN 61508-6_2010.pdf` and matching extracted Markdown [L1] identify BS EN 61508-6:2010, identical to IEC 61508-6:2010, second edition. The PDF and extraction constitute the held full Part 6, but only the introduction, scope, contents and targeted passages were inspected in this investigation—not all clauses. The candidate list identifies no locally held full texts of Parts 1–5 or 7; no exhaustive search of all possible holdings is claimed. In particular, guidance in Part 6 is not full access to the normative Part 1–3 requirements. It is an older edition relative to the in-progress 2026 FDIS, not proof that a final 2026 replacement is available.

**Recommendation: conditional acquisition/update.** If a real project needs direct IEC 61508 design or substantiation, obtain the relevant final applicable Parts 1–4 and any needed guidance, with edition confirmed at that time; consult the appropriate machinery/product text and manufacturer evidence first when the task is ordinary component intake. Do not acquire all seven automatically. Clarify edition, national adoption and regulatory route independently; no legal or product approval conclusion is made here.

## Sources and limits

[1–7] IEC publisher 2010 records respectively: https://webstore.iec.ch/en/publication/5515 , /5516 , /5517 , /5518 , /5519 , /5520 , /5521 (each shorthand uses the same `https://webstore.iec.ch/en/publication` prefix). Public abstracts, not complete normative text.

[8] IEC Part 1 prerelease https://webstore.iec.ch/en/publication/117296 ; [9] IEC catalogue search https://webstore.iec.ch/en/catalogsearch/result/?q=61508 and search API response retained in `evidence/search-api.json`. Publisher search includes 2026 FDIS, not established final editions.

[10] https://webstore.iec.ch/en/publication/112847 and `evidence/62061-search.json` (catalogue abstract; amendment-label inconsistency noted above).

[L1] Local `NORMATIVE/extracted_html/EN_61508-6_2010/EN 61508-6_2010/auto/EN 61508-6_2010.md`, cover, European foreword, introduction, §1, Annex A–E headings; identity cross-checked against PDF metadata. [L2] Local `NORMATIVE/extracted_html/ISO_13849-1_2023/ISO_13849-1_2023/auto/ISO_13849-1_2023.md`, introduction, §1, §6.1.2, §6.2.1. [L3] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, bounded historical review, not a current-edition audit.

IEC public abstracts and limited local passages support a scope investigation, not a full compliance or clause-by-clause review. No numerical tables were extracted. ISO public page attempt returned a challenge (`evidence/iso13849.html`); the held ISO 2023 text was used instead. See `SOURCES.json` for acquisition paths and times.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `3506d82b3bef5649d0da2e68daa9f4e7d43e1bf5d1c1a240e8da0df56341b8de`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61508`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61508 series",
  "report_path": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Only Part 6 full text held and selectively inspected; other IEC parts public abstracts only",
    "2026 third-edition FDIS pre-releases not final; final publication and complete corrigenda not established",
    "No legal/OJEU or exhaustive local holdings audit"
  ],
  "local_holdings_summary": "BS EN 61508-6:2010 full PDF and matching extraction; partial series, not Parts 1\u20137"
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/5515",
    "title": "IEC 61508-1:2010, edition 2",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-5515.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract and publication record, not full normative text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/5516",
    "title": "IEC 61508-2:2010, edition 2",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-5516.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract and publication record, not full normative text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/5517",
    "title": "IEC 61508-3:2010, edition 2",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-5517.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract and publication record, not full normative text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/5518",
    "title": "IEC 61508-4:2010, edition 2",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-5518.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract and publication record, not full normative text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/5519",
    "title": "IEC 61508-5:2010, edition 2",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-5519.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract and publication record, not full normative text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/5520",
    "title": "IEC 61508-6:2010, edition 2",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-5520.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract and publication record, not full normative text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/5521",
    "title": "IEC 61508-7:2010, edition 2",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-5521.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract and publication record, not full normative text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/117296",
    "title": "IEC 61508-1:2026 PRV FDIS prerelease",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-117296.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Pre-release, not final publication"
  },
  {
    "url": "https://webstore.iec.ch/en/catalogsearch/result/?q=61508",
    "title": "IEC catalogue search and official search API results",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/search-api.json",
    "evidence_kind": "public catalogue search",
    "coverage_limitation": "Search results; Part 1 prerelease independently inspected"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/112847",
    "title": "IEC 62061:2021+AMD1:2024+AMD2:2026 CSV",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iec-112847.html",
    "evidence_kind": "public publisher scope",
    "coverage_limitation": "Abstract internally mislabels second amendment"
  },
  {
    "url": "https://www.iso.org/standard/69883.html",
    "title": "ISO public page attempted",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "evidence/iso13849.html",
    "evidence_kind": "access failure",
    "coverage_limitation": "Challenge page, identity not verified"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/EN_61508-6_2010/EN 61508-6_2010/auto/EN 61508-6_2010.md",
    "title": "BS EN 61508-6:2010",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "source path only; licensed text not copied",
    "evidence_kind": "local full text targeted inspection",
    "coverage_limitation": "Only introduction, scope, contents and targeted passages inspected"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/ISO_13849-1_2023/ISO_13849-1_2023/auto/ISO_13849-1_2023.md",
    "title": "ISO 13849-1:2023",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "source path only; licensed text not copied",
    "evidence_kind": "local full text targeted inspection",
    "coverage_limitation": "Targeted scope and cited passages only"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Safety source review",
    "access_time_utc": "2026-11-02T23:06:51.891570+00:00",
    "evidence_path": "source path only",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Bounded historical review"
  }
]
`````
