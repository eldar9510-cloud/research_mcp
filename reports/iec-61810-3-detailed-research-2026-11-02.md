---
{
  "format": 1,
  "metadata": {
    "id": "iec-61810-3-detailed-research-2026-11-02",
    "title": "IEC 61810-3 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61810-3?",
    "scope": "Detailed IEC 61810-3 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.949Z"
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
  "sourceDigest": "0bcb6ae38dcde631900f6eebcd855ea54e458dffbf4becb6826f8ec0e043854d",
  "proposalRevision": "6437da80a7b2fc04b5fcc2ee894945dd8487bd9b13cdc4a6bfea1326d41d367e"
}
---
# IEC 61810-3 — guided-contact elementary relays

## Identity and evidence status

**IEC 61810-3:2015**, *Electromechanical elementary relays – Part 3: Relays with forcibly guided (mechanically linked) contacts*, is an IEC International Standard, first edition, published 25 February 2015. On 2 November 2026 the IEC product page identified that edition as published, with a stability date of 2027 and an under-development draft at CD stage. The CD is not a published replacement; the stability date is not a promised withdrawal or replacement date. The page exposed no later published version in its lifecycle data, but this bounded check is not a comprehensive amendment, national-adoption or legal-status audit. [1]

This report is based on public publisher abstracts and the specified local safety-text references, **not a reading of the full IEC 61810-3 clauses**. The public preview endpoint returned an HTML response rather than a readable PDF; no circumvention was attempted. The accessible abstract does not provide detailed contact classifications, dimensional criteria, test values or pass/fail procedures. [1]

## Purpose, scope and boundary

A relay uses a controlled coil to change electrical contacts. In a guided-contact elementary relay, the relevant contact elements are mechanically linked. The point is to give a designer a defined contact relationship that can support monitoring of contact-state faults, rather than assuming an ordinary auxiliary contact is a trustworthy indication of the switching contacts. A diagnostic system still has to implement and evaluate the monitoring function. The publisher states the exact scope more narrowly: Part 3 specifies **special requirements and tests for elementary relays with forcibly guided contacts**, also called mechanically linked contacts, **in addition to** IEC 61810-1. [1]

IEC 61810-1:2015 plus Amendment 1:2019 is the separately published consolidated general and safety standard for electromechanical elementary relays; its scope includes incorporation in low-voltage equipment and identifies type testing. It covers general functional and safety aspects, and says an application may call for additional requirements assessed against relevant standards. [2] Part 3 is therefore not an independent replacement for the general relay baseline. The edition of Part 1 actually referenced by a particular Part 3 edition and its full normative references were not independently inspected; confirm that relationship in the applicable text and supplier declaration rather than inferring it from publication dates.

The intended readers include relay manufacturers and test laboratories applying the product standards, and engineers selecting such components and building monitoring circuits. A **complete safety relay module** is a different object from the internal elementary relay: the former may include monitoring, logic, outputs and prescribed external feedback. The IEC abstract establishes Part 3's elementary-relay scope; it does not, by itself, establish a universal exclusion or the complete product-standard route for every module. Nor does a guided-contact relay inside a module establish certification of the whole module. Check the exact module manufacturer's declaration and safety manual. The historical batch's assertion that all safety relay modules have no dedicated IEC product standard is not established by this research. [1, 3]

## Technical subjects and practical electrical use

The public Part 3 abstract establishes special contact-related requirements and tests, but not their detailed content. It is reasonable to investigate **the specified linked-contact behaviour and its testing** in the actual Part 3 text; do not infer exact fault cases, contact separation distances, relay types, or proof-test procedures from the abstract. General relay requirements and type testing belong to the companion Part 1, while system diagnostic performance belongs to the actual application. [1, 2]

For engineering selection, obtain the exact manufacturer part number and current product documentation, then check:

- Which contact pairs are declared mechanically linked and what contact arrangement and monitoring terminals are provided? Does the supplier explicitly declare the relevant Part 3 edition, and under what conditions? Do not infer a relation for every contact merely from the relay's label.
- What are coil rated supply and tolerance, pickup/dropout conditions, permitted suppression and resulting release behaviour? What are contact ratings for the actual AC or DC voltage, load type, current, starting/transient demand and switching duty? These are selection questions, not values furnished by the abstract.
- What manufacturer data apply to insulation, terminal wiring, mechanical/electrical life, ambient conditions and protection/coordination? Review the actual load and protective-device instructions instead of treating the relay's voltage rating as a breaking-capacity or life claim.
- Is the feedback contact monitored at the right time and with a defined fault response? Can the monitoring path, wiring, controller or supply itself fail, and what happens on a detected fault? These are system integration questions, not a test certificate for a bare relay.

A familiar example is a monitored output contact and a linked feedback contact: the feedback can aid recognition of certain contact faults when appropriately wired and evaluated. The exact behaviour under a welded contact, the conditions under which the relationship is guaranteed, and whether a particular wiring arrangement detects a particular fault must be verified in the product data and applicable standard. A diagram or terminal count alone proves neither. This distinction is particularly important for DC inductive loads, where the actual load and suppression selection can affect contact duty and release timing; retain the manufacturer's prescribed external conditions rather than reverse-engineering a bought product. [1–3]

## Functional-safety relevance

The component may be used in a safety-related control subsystem, but its mechanically linked construction is **not itself a diagnostic system**. A previously checked held ISO 13849-1:2023 text, section 6.1.5, addresses estimation of diagnostic coverage; the local safety review identifies direct monitoring with linked contacts as an eligible *implemented measure*, not as automatic coverage merely because a component contains guided contacts. ISO 13849-1:2023 section 6.1.3.2.6 addresses separate architectural and fault-related conditions for Category 4. The 2012 ISO 13849-2 held text lists linked contacts in the context of monitoring across multiple categories. [4] Thus **no automatic DC, DCavg, Category, PL or SIL** can be assigned from contact construction or a Part 3 declaration. The historical batch's implied near-100% DC and module-gap conclusions are overgeneralized. [3, 4]

For a complete safety module, preserve any supplier-declared PL, SIL, PFH and certificate scope as specific to that model, version, safety function and operating conditions. A supplier's certified subsystem is not the complete machine safety function: field wiring, sensors, actuators, fault response and integration still require assessment and validation. IEC 62061 and ISO 13849 provide application-level approaches; use the selected framework and applicable edition, not an improvised PL/SIL conversion. [4] No safety calculation or product approval is made here.

## Library and local holdings

The most direct potential library routes are **`relay_general`** for a specifically identified guided-contact elementary relay and **`safety_relay`** for a complete safety module or a relay used in a safety role; category membership alone is not evidence that Part 3 applies. Record the exact device type and supplier's own standard/edition declaration, guided contact pair(s), relevant external terminals, coil/contact ratings, permitted use and feedback conditions. For a certified module, also retain its exact safety-function evidence and limitations; do not transfer an internal component's claim to the entire module. [1–4]

`NORMATIVE_CANDIDATES.json` identifies **no matching PDF, extracted Markdown or memory candidate** for IEC 61810-3. This is a candidate-based search result, not proof no differently named copy exists elsewhere; no held full text was verified. The archived batch is a research lead, not a substitute for the standard. [3] Recommendation: **conditional acquisition/update** only if actual guided-contact relay selection, a disputed declaration, supplier assessment or clause-level test interpretation makes the text necessary. Obtain the exact applicable edition together with its Part 1 companion as needed; first use supplier data for normal bought-device intake. Do not purchase solely because a category contains relays.

## References and limitations

1. IEC, [IEC 61810-3:2015 product record](https://webstore.iec.ch/en/publication/21885), public scope, metadata and embedded lifecycle, inspected 2026-11-02 UTC. Saved `evidence/iec-21885.html` and text. Preview endpoint response saved as `evidence/iec-preview.pdf` but is HTML, not a readable preview.
2. IEC, [IEC 61810-1:2015+AMD1:2019 CSV](https://webstore.iec.ch/en/publication/66148), public scope, inspected 2026-11-02 UTC; saved `evidence/iec-66148.html` and text. This is a distinct companion publication, not evidence that its consolidated edition is the one normatively referenced in Part 3.
3. Historical project research: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md`, boundary table; source lead only, with its DC and module assertions qualified above.
4. Local corrections: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, claim-assessment table; cites held ISO 13849-1:2023 sections 6.1.5 and 6.1.3.2.6, and ISO 13849-2:2012 Table D.2. This report relies on that bounded review rather than independently auditing those held texts. The companion `PRIMARY_SOURCE_CHECKS.md` records its limitations.

Outstanding: obtain and inspect the relevant full Part 3 and Part 1 clauses before any detailed compliance interpretation; verify exact device and module evidence; separately check applicable national adoption and legal status. No present OJEU status is asserted.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `bbbb8ba179a558e918a543243f66023c3c91a6f7a3b555619edd3b744a98f761`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61810-3`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61810-3",
  "report_path": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full IEC 61810-3 clauses and detailed test requirements not inspected; public preview returned HTML rather than a readable PDF.", "No exhaustive amendment, national adoption or OJEU audit; Part 3's exact normative Part 1 edition unverified.", "No actual manufacturer's device declaration or complete module certification assessed."],
  "local_holdings_summary": "Candidate list has no matching full PDF, extracted text or memory file; no full held IEC 61810-3 text verified. Historical batch and safety review are research references, not the assigned standard."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "standard": "IEC 61810-3",
  "checked_at_utc": "2026-11-02T23:03:17Z",
  "sources": [
    {"url": "https://webstore.iec.ch/en/publication/21885", "title": "IEC 61810-3:2015, edition 1.0", "accessed_utc": "2026-11-02T23:03:17Z", "evidence_path": "evidence/iec-21885.html", "evidence_kind": "public scope and publication metadata", "limitation": "Abstract and lifecycle only; not full standard."},
    {"url": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxODEwLTN7ZWQxLjB9Yi5wZGY=", "title": "IEC 61810-3:2015 public preview endpoint", "accessed_utc": "2026-11-02T23:03:17Z", "evidence_path": "evidence/iec-preview.pdf", "evidence_kind": "failed preview", "limitation": "Response is HTML, not a readable PDF; filename reflects requested format."},
    {"url": "https://webstore.iec.ch/en/publication/66148", "title": "IEC 61810-1:2015+AMD1:2019 CSV", "accessed_utc": "2026-11-02T23:03:17Z", "evidence_path": "evidence/iec-66148.html", "evidence_kind": "public scope", "limitation": "Companion edition scope only; not Part 3's verified normative reference list."},
    {"path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md", "title": "Batch 6 PLC and relays", "accessed_utc": "2026-11-02T23:03:17Z", "evidence_path": null, "evidence_kind": "old research lead", "limitation": "Historical analysis; contact DC and module-gap claims not adopted."},
    {"path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md", "title": "Safety source review", "accessed_utc": "2026-11-02T23:03:17Z", "evidence_path": null, "evidence_kind": "local secondary review referencing held ISO texts", "limitation": "Bounded prior source review; ISO texts not independently rechecked for this report."},
    {"path": "NORMATIVE_CANDIDATES.json", "title": "IEC 61810-3 local candidate list", "accessed_utc": "2026-11-02T23:03:17Z", "evidence_path": "NORMATIVE_CANDIDATES.json", "evidence_kind": "local holdings candidate list", "limitation": "Empty list is not exhaustive proof of absence."}
  ]
}
`````
