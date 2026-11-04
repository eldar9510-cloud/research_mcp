---
{
  "format": 1,
  "metadata": {
    "id": "iec-60204-1-detailed-research-2026-11-02",
    "title": "IEC 60204-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60204-1?",
    "scope": "Detailed IEC 60204-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:30.431Z"
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
  "sourceDigest": "8e1f91c900db4e9daf741ef90be7fea27ece07d5c2310bd59b00700c7ca16298",
  "proposalRevision": "7afec7b23416bc971e0f59f978fde61bb3634f0c23e3361c2347f4134a550951"
}
---
# IEC 60204-1 — electrical equipment of machines

**Research check:** 2026-11-02 UTC. **Identity:** IEC 60204-1, *Safety of machinery — Electrical equipment of machines — Part 1: General requirements*, an international application standard. IEC lists the sixth edition, IEC 60204-1:2016, published 2016-10-13, and Amendment 1 published 2021-09-15. Its consolidated IEC 60204-1:2016+AMD1:2021 CSV is edition 6.1 and marked published; edition 7 is shown as under development, not a published replacement. These are IEC publication facts, not a finding of any EN adoption, OJEU listing or governing law. [IEC 2016](https://webstore.iec.ch/en/publication/26037); [IEC consolidated](https://webstore.iec.ch/en/publication/71256); [IEC amendment](https://webstore.iec.ch/en/publication/66124).

The held local copy is the **unamended 2016 edition**, not proof of possession of the 2021 amendment. The discussion below identifies the edition of detailed requirements as **2016**, while the current consolidated scope is cross-checked against IEC's public abstract. Amendment changes have not been compared clause by clause. No machine compliance conclusion follows.

## Purpose, audience and scope

The standard addresses the electrical equipment of machines as an integrated installation: protection of people and property, consistent control response, and operability and maintainability. It is useful to machine builders, electrical designers, panel builders, integrators, commissioning personnel and maintainers. It is not merely a construction specification for a single bought device, nor a substitute for a whole-machine risk assessment. [Local 2016 Introduction and §1, held text L].

IEC's scope covers electrical, electronic and programmable electronic equipment and systems of machines that are **not portable by hand while working**, including coordinated groups of machines. It starts at the connection of the supply to the machine electrical equipment; the supply installation has a distinct IEC 60364 route. It addresses equipment or parts operating at nominal supply voltages up to 1,000 V AC or 1,500 V DC and nominal supply frequencies up to 200 Hz. Higher-voltage equipment is a separate IEC 60204-11 lead. [IEC consolidated; L §1].

The 2016 scope does **not** provide all additional special requirements for outdoor use, potentially explosive materials or atmospheres, special material hazards, mining, sewing machines, hoisting machines or semiconductor fabrication equipment. It points to IEC 60204-31, -32 and -33 for the last three respective applications. This is a statement about *additional and special requirements*, not a categorical exclusion of every such machine from Part 1. Power circuits where electrical energy is directly used as a working tool are excluded. Other standards or regulations can require guarding, interlocking and control measures against non-electrical hazards beyond Part 1. Consult the exact machine-specific standard and the current edition's scope before selecting the route. [L §1; IEC consolidated].

**Interpretation:** a machine cabinet can be a significant part of a covered machine's electrical equipment, but “a panel” alone does not establish this standard's applicability to the whole product. Similarly, a lift, lifting platform or hoist must be classified against its particular product and installation standards; neither this scope nor the archived research proves a universal rule for all lifts. [L §1].

## Technical subjects and integration

The following is a topic map of the held 2016 text, not a replacement for reading its conditions and exceptions or applying the 2021 amendment:

* **Supply and isolation:** connection point, supply characteristics, supply disconnecting and isolation arrangements, including the treatment of excepted circuits. Designers need the incoming supply, earthing system, available fault level, load and external supply interfaces. [L §§4–5].
* **Shock, equipment and bonding protection:** basic and fault protection, protective extra-low voltage, overcurrent and overload, abnormal conditions and supply interruption, and protective/equipotential bonding. Protection depends on actual installation topology and settings, not simply the rating printed on a circuit breaker. [L §§6–8].
* **Control and operator interface:** control circuits, operating modes, start/stop, emergency operations, fault considerations, controls, indicators and emergency devices. Stop category is a description of a stopping strategy, not ISO 13849 architecture Category or a PL. An emergency-stop function, an isolator and emergency switching off serve different purposes. [L §§9–10].
* **Physical integration:** enclosures and access, conductors and cables, wiring methods, motor and associated equipment, accessories and lighting, marking, warnings and documentation. Environment, electrical compatibility, protection, cable movement, terminal ratings and service access are application questions. [L §§11–17].
* **Verification:** inspection against documentation, continuity, fault-protection conditions, possible electrical tests and functional tests; the required extent and sequence depend on the applicable machine product standard and circumstances. [L §18].

For component intake, retain exact variant, rated supply, operating limits, connection diagrams, protective-device coordination, earthing and EMC instructions, enclosure/environment limits, load characteristics, and prescribed external components. Motor drives, for example, can impose manufacturer-specific protection and bonding conditions. Device product conformity supports selection but does not prove their combined wiring, fault response, machine documentation or installation. Purchased components remain black boxes: supplier-published external contracts and prescribed connections matter; internal circuits or firmware need not be reconstructed. [L §§4–8, 12–13, 17–18; project M/CLAUDE.md purchased-component boundary].

## Verification: what is actually established

Under held **2016 §18.1**, a dedicated machine product standard specifies verification extent. In its absence, §18.1 always includes checking the electrical equipment against technical documentation, protective-bonding continuity and functional tests; verification of automatic-disconnection protection is included **when that protection method is used**. Insulation resistance, voltage testing, residual-voltage protection and the specified high protective-conductor-current requirements may additionally be applicable. Results are documented. Thus it would be wrong to turn every listed test into an unconditional test for every machine. Amendment and machine-specific provisions require separate checking. [L §18.1].

For the 2016 edition, continuity is assessed at relevant protective-bonding points; automatic disconnection assessment depends on the earthing system and includes suitability of protection. For a TN system the fault-loop check can involve calculation or measurement together with protective-device characteristics, and power-drive protection is checked against relevant manufacturers' instructions. Site verification depends on assembly and prior evidence; other earthing arrangements have different routes. Insulation/voltage tests, **when performed**, include device-specific precautions; sensitive components and surge protection can affect test procedure. Retesting after modification is addressed separately. Verification evidence must reflect the actual installed machine, its supply and its documentation rather than a generic component certificate. [L §§18.2–18.7].

## Functional safety and adjacent standards

IEC 60204-1's control and electrical provisions contribute to a machine safety solution, but its use alone establishes neither the required nor achieved PL, SIL, diagnostic coverage, or safety-control architecture. The machine risk assessment identifies hazards and functions; ISO 13849-1/-2 or IEC 62061 can support the appropriate design and validation route for safety-related control functions, subject to their scopes and chosen edition. The precise sensor–logic–actuator chain, fault behavior, operating environment, manufacturer safety data and installation must be assessed. A certified component or drive function is not automatically a certified complete machine function. The held-source safety review independently cautions against automatic PL/SIL conversion, diagnostic claims from contact design, and assuming STO removes the need to assess braking or isolation. [L §§1, 9 and 18; local SAFETY_SOURCE_REVIEW.md].

Related documents have different jobs:

* **ISO 12100:** general machinery risk assessment and risk reduction; identify machine-specific hazards and relevant standards. The held 2016 Part 1 introduction and scope themselves distinguish other hazards from the electrical scope. [L Introduction, §1].
* **IEC 60364 series:** supply/building installation boundary; Part 1 machine equipment begins at its supply connection. [L §1].
* **IEC 60947 product parts** for relevant switches, disconnectors, breakers and control devices, and **IEC 60034-1** for rotating-machine rating/performance: device-specific characteristics and tests, not a complete machine integration verdict. These are among the held 2016 normative references; actual subtype and cited edition matter. [L §2].
* **IEC 60529:** enclosure IP classification; an IP declaration does not by itself settle the installation environment or pollution degree. [L §2; local PRIMARY_SOURCE_CHECKS.md and README.md].
* **IEC 61439 series:** possible low-voltage switchgear/controlgear assembly route, depending on the actual assembly's scope and intended application. Do not assume every machine control cabinet is an IEC 61439 assembly, or that one standard automatically replaces the other; this report did not inspect the 61439 full scope and makes no definitive assembly classification.
* **IEC 60204-31/-32/-33 and relevant machine-specific standards:** address special applications as identified above; establish exact overlap, exceptions and edition for the specific machine rather than treating a broad hierarchy slogan as a legal rule. [L §1].

## Library evidence and holdings

Potentially relevant categories include `main_switch`, `circuit_protection`, `contactor`, `terminal_pe`, `cable`, `enclosure`, `motor`, `vfd`, `standard_plc`, `safety_plc`, `e_stop`, `door_interlock` and protective sensors. Ask: what does this exact device declare, which terminals and protective parts are prescribed, what supply/environment is assumed, what safety data and conditions apply, and who verifies the installed interfaces? A candidate standard is not a supplier declaration; this report changes no card, category, schema or lifecycle state. [Local research README §§1–3; M/CLAUDE.md].

**Holding confirmed:** `NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 60204-1_2016.pdf` is an IEC-authored, 282-page 2016 PDF; its matched extracted text L explicitly identifies IEC 60204-1:2016 and contains the scope and clauses inspected. It is a full-edition local holding, with extraction errors possible, not evidence of the 2021 amendment. PDF metadata and extracted identity were checked, but every page and every clause was not reviewed. The corresponding memory file claims universal applicability and lists every verification test as required; these are overbroad compared with L §§1 and 18.1 and should not be adopted without correction. The archived batch's “2016 current” and unconditional lift claim are likewise not established by the present check. [L §§1,18.1; batch09; IEC publication history].

**Recommendation:** retain the 2016 holding as edition-qualified; **conditional update** to the consolidated 2016+A1:2021 text when a real design or compliance question requires current clause-level analysis, and reconcile its differences before using 2016 values. No blanket purchasing recommendation. Separately verify any applicable EN adoption, national implementation, OJEU/legal status, machine product standard and supplier declarations for the project and date. This research did not perform those checks or analyze the amendment text.

## Source key and limits

**L:** `/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_60204-1_2016/IEC 60204-1_2016/auto/IEC 60204-1_2016.md` — held full extracted 2016 text; sections cited above. PDF source at the path above. No licensed text is reproduced in evidence. Other local leads are under `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/` (`README.md`, `PRIMARY_SOURCE_CHECKS.md`, `SAFETY_SOURCE_REVIEW.md`, `batch09-umbrella-gemini.md`), and the standard memory file is `NORMATIVE/.claude/memory/iec-60204-1.md`. Exact public evidence and access records are in `SOURCES.json` and `evidence/`. Public pages establish identity, lifecycle and abstract, not full current requirements. This is scoped research, not certification, legal advice or a clause-complete amendment comparison.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `2587e5c9c41fe5e1c88e0b5d060048680ca4283258a979ace99d5487ca06d0ab`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60204-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60204-1",
  "report": "REPORT.md",
  "status": "complete",
  "major_gaps": [
    "2021 amendment full text and clause-level changes not inspected",
    "No EN adoption, current OJEU/legal assessment or exact machine-specific applicability verified",
    "IEC 61439 full scope not inspected"
  ],
  "local_holdings_summary": "Full IEC 60204-1:2016 PDF and matching extracted text; 2021 amendment not established as held."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/26037",
    "title_edition": "IEC 60204-1:2016, edition 6.0",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "evidence/iec-2016.html",
    "evidence_kind": "public scope and lifecycle",
    "coverage_limitation": "Publisher abstract, not full text"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/71256",
    "title_edition": "IEC 60204-1:2016+AMD1:2021 CSV, edition 6.1",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "evidence/iec-consolidated.html",
    "evidence_kind": "public scope and lifecycle",
    "coverage_limitation": "No full amended clauses inspected"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/66124",
    "title_edition": "IEC 60204-1:2016/AMD1:2021",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "evidence/iec-amendment.html",
    "evidence_kind": "publication metadata",
    "coverage_limitation": "Amendment full text not inspected"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Electrical_Functional_Safety/IEC 60204-1_2016.pdf",
    "title_edition": "IEC 60204-1:2016 PDF",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "not copied",
    "evidence_kind": "held full text",
    "coverage_limitation": "PDF metadata inspected; clauses checked in extraction"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/IEC_60204-1_2016/IEC 60204-1_2016/auto/IEC 60204-1_2016.md",
    "title_edition": "IEC 60204-1:2016 extracted full edition",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "not copied",
    "evidence_kind": "held full text",
    "coverage_limitation": "Selected sections inspected, extraction may contain errors; no amendment"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/NORMATIVE/.claude/memory/iec-60204-1.md",
    "title_edition": "IEC 60204-1 memory",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "not copied",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Claims not authoritative; scope and test overstatements"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title_edition": "Research guide",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "not copied",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Library use and limits"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title_edition": "Primary source corrections",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "not copied",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Bounded safety and scope corrections"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title_edition": "Safety source review",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "not copied",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Edition-qualified bounded review"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md",
    "title_edition": "Batch 9 umbrella",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "not copied",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Historical claims, independently qualified"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/search?query=IEC%2060204-1",
    "title_edition": "IEC search attempt",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "evidence/iec-search.html",
    "evidence_kind": "failed request",
    "coverage_limitation": "HTTP 404; replaced with exact publisher record"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/30057",
    "title_edition": "Possible IEC related record",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "evidence/iec-related-61439.html",
    "evidence_kind": "failed request",
    "coverage_limitation": "HTTP 404; no 61439 scope claim based on it"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/71168",
    "title_edition": "Possible record",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "evidence/possible.html",
    "evidence_kind": "failed request",
    "coverage_limitation": "HTTP 404"
  },
  {
    "url_or_path": "https://www.google.com/search?q=site%3Awebstore.iec.ch%2Fen%2Fpublication+%22IEC+61439-2%3A2020%22",
    "title_edition": "Search for IEC 61439-2",
    "access_time_utc": "2026-11-02T23:05:11Z",
    "evidence_path": "evidence/search-61439.html",
    "evidence_kind": "search lead",
    "coverage_limitation": "No verified record obtained"
  }
]
`````
