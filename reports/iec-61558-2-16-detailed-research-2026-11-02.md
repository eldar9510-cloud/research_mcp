---
{
  "format": 1,
  "metadata": {
    "id": "iec-61558-2-16-detailed-research-2026-11-02",
    "title": "IEC 61558-2-16 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61558-2-16?",
    "scope": "Detailed IEC 61558-2-16 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:25.687Z"
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
  "sourceDigest": "c39d841e974b3792e8eecf83729ad4463035dc46679cbafd4a94293602a2f184",
  "proposalRevision": "6acdc6ab12d45e676116da686cd0a2845ce2ed207110b5370f3582791f965a3f"
}
---
# IEC 61558-2-16 — switched-mode supplies and their transformers

**Research check:** 2 November 2026, UTC. **Evidence level:** IEC public catalogue descriptions and lifecycle, plus prior local research; no full normative text or working preview. This is a scope/routing report, not a conformity determination.

## Identity and edition

IEC 61558-2-16:2021, edition 2.0, is an International Standard titled *Safety of transformers, reactors, power supply units and combinations thereof – Part 2-16: Particular requirements and tests for switch mode power supply units and transformers for switch mode power supply units for general applications*. IEC published it on 8 June 2021. IEC lists it as a group safety publication, to be used with IEC 61558-1:2017. The second edition replaced the 2009 first edition and its 2013 amendment; its lifecycle identifies the prior consolidated edition 1.1 as revised. [1]

IEC identifies corrigendum 1, published 6 September 2023, and says the corrigendum is incorporated into the copy offered on the base page. This is a **corrigendum**, not a 2023 amendment or new edition. [1,2] IEC's page marks the 2021 edition and corrigendum published; this is a dated publisher check, not a prediction of future status or an EN/OJEU legal-status determination. The previous batch's asserted 2025 EN adoption is a lead, not independently established here; neither a supplier-cited EN designation nor an IEC designation should be silently rewritten as the other.

## Purpose, scope and limits

The verified IEC abstract says Part 2-16 deals with the safety of switch-mode power supply units (SMPS) **and transformers for SMPS**, in general applications. [1] It is therefore not merely a transformer-only document, and a reference to it may concern a whole supply or a component, depending on the evaluated product and evidence. It helps supply/transformer manufacturers, test laboratories and equipment designers address product safety; a machine builder can use the designation to route evidence requests, not assume that every power supply falls within it.

IEC describes companion Part 1 as covering electrical, thermal and mechanical safety of independent or associated stationary or portable dry-type transformers, supplies including SMPS, reactors and combinations, with encapsulated or non-encapsulated windings, not forming part of the distribution network. That is **Part 1's catalogue scope**, not proof that every item listed there falls inside this particular Part 2-16. [3] The exact Part 2-16 scope text, voltage/frequency limits, special conditions, exclusions, and application of the other Part 2 documents could not be independently checked in the public abstract. The historical batch gives numerical boundaries and claims exclusions for other SMPS standards; treat these as unverified leads, not rules. [6] In particular, an independently checked IEC scope for IEC 61204-7:2016 expressly covers both stand-alone and component SMPS under its specified conditions, so it is unsafe to describe it as categorically redundant or to infer how the two scopes interact from their titles. [4]

## Technical subjects and engineering use

Part 2-16 provides particular product requirements and tests, in conjunction with Part 1. IEC's summary of changes from the previous edition explicitly identifies voltage-characteristic definitions, moving partial-discharge and construction descriptions to Part 1, an alternative clearance-dimensioning method and removal of requirements for homogeneous field conditions. [1] These are evidence of subject areas and revision changes, **not** a complete list of tests, operating limits or mandatory techniques for an individual unit. Part 1's public description establishes the electrical, thermal and mechanical safety domains. [3]

For a manufacturer designing a transformer or custom supply, the actual edition of both parts and the corrigendum must be consulted for applicable construction, insulation and test details; the public summary does not support specifying clearances, dielectric tests, temperatures or acceptance criteria. IEC's metadata lists IEC 60664-4:2005, concerned with high-frequency voltage stress, and IEC 61558-2-1, -2-4, -2-6 and -2-13 as normative references; the metadata alone does not explain when or how each applies. [1] It would be misleading to reconstruct an entire product-test program from those names.

For a **purchased** supply, the useful contract is external and variant-specific: manufacturer model, data sheet, declared standard and edition, evidence scope, rated input and output, output isolation classification if actually declared, terminal arrangement, protective earth where prescribed, upstream protection, permissible environment, mounting/cooling and load/derating conditions. Ask for the manufacturer's instructions and relevant declaration or certificate, including conditions and whether they cover the whole supply or a transformer alone. A supplier's reference is not independent proof of all installation or machine duties. Conversely, disclosing windings, internal electronics or proprietary construction is not a prerequisite for accepting an unmodified bought device. Applying a construction/type-test standard is distinct from designing protection and verifying the installed system.

The machine designer still assesses input supply compatibility, source protection and disconnection, output distribution, wiring, earth and accessible voltage hazards against the relevant system/installation standards and the exact supplier instructions. A protective classification or insulation claim cannot be substituted for evidence that the complete arrangement, its wiring and external faults satisfy the intended application. These are engineering implications, not alleged numbered requirements of this standard.

## Functional-safety boundary

A supply may feed safety-related controls or be part of a safety-related architecture, so loss, excessive voltage, common supply dependencies and restart behaviour can matter in a function-specific analysis. Part 2-16 is an electrical product-safety standard, not a certification of the complete machine safety function. Its designation alone does not establish PL, SIL, diagnostic coverage, Category, PFH or permission to dispense with other safety measures. A separately certified safety subsystem and its defined interfaces and conditions require their own manufacturer evidence and integration validation; do not create those ratings from an ordinary PSU certificate. This is a scope distinction, not a claim that power supplies can never participate in safety functions.

## Related standards and library implications

- **IEC 61558-1:2017:** mandatory companion identified by IEC for the 2021 Part 2-16; IEC lists its own 2025 corrigendum and corrected version. [1,3] Reconcile the applicable text and correction for the particular assessment.
- **IEC 60664-4:2005:** listed by IEC as a normative reference for high-frequency voltage stress; its listing does not replace the detailed Part 2-16 instructions. [1]
- **IEC 61204-7:2016:** separate low-voltage SMPS product-safety scope, including both stand-alone and component SMPS, with its own limits. [4] Do not impose a universal standard triad or decide mutual exclusion from this abstract.
- **IEC 60204-1 / ISO 13849:** machine electrical equipment and safety-related control-function routes respectively, where applicable to the particular machine. Neither is established by Part 2-16 compliance; machine-specific assessment remains separate.

For the `power_supply` library category, determine whether an actual variant is a complete SMPS or transformer component and capture its precise declared evidence and external conditions. For `ups`, first determine whether the item is a UPS, DC functional module, battery or supply: do not assign this part merely because switching conversion exists. The prior source check gives a real Phoenix TRIO3 1159045 example declaring DIN EN 61558-2-16 alongside other standards, but this is a specific supplier-reported example, not proof for every variant; consult its original document before component approval. [5] No library policy or category mapping is changed by this report.

## Holdings, gaps and acquisition

`NORMATIVE_CANDIDATES.json` reports no matched PDF, extracted Markdown or memory candidate for this exact part. No held edition or full text was available to inspect; this is **no matching candidate found**, not proof of absence throughout all holdings. Parent will independently compare holdings. The historical batch is research reference only, not full standard text. [6]

**Recommendation: conditional acquisition/update.** If custom SMPS/transformer construction, certification, a disputed subtype/scope, or a specific test requirement creates a real need, obtain the applicable Part 2-16 edition including its corrigendum and the applicable Part 1, then reconcile existing holdings. For ordinary bought supplies, prioritize the variant's manufacturer declaration, certificate and instructions rather than automatically purchasing the product standard for each device.

Open gaps: exact scope limits and exclusions, interpretation of overlapping product standards and normative test procedures; content of the corrigendum; verified EN adoption and any legal listing; and actual supplier documentation for a proposed part. The IEC public preview request returned HTTP 403 and was not bypassed; the catalogue itself was accessible. No numerical requirements or clause numbers have been derived from an inaccessible preview.

## Sources

1. IEC, [IEC 61558-2-16:2021](https://webstore.iec.ch/en/publication/65385), catalogue abstract, revision list, normative-reference metadata and lifecycle; saved `evidence/iec-65385.html` and `.txt`.
2. IEC, [IEC 61558-2-16:2021/COR1:2023](https://webstore.iec.ch/en/publication/87736), catalogue identity and date; `evidence/corrigendum.html` and `.txt`.
3. IEC, [IEC 61558-1:2017](https://webstore.iec.ch/en/publication/26261), abstract and lifecycle; `evidence/iec-part1.html` and `.txt`.
4. IEC, [IEC 61204-7:2016](https://webstore.iec.ch/en/publication/26155), abstract and lifecycle; `evidence/iec-61204.html` and `.txt`.
5. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md`, section 1, supplier-document reference and earlier scope checks; secondary local research, not a fresh inspection of the supplier PDF.
6. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md`, Part 2-16 section; historical unverified research lead.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `5edcf1433684fc4315211f674bad7e55795fcd2774bf79111a3499e15da68320`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61558-2-16`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61558-2-16",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full text, scope limits, exclusions, tests and corrigendum content unavailable; publisher preview HTTP 403",
    "EN adoption and legal listing not verified",
    "Supplier-specific evidence not freshly inspected"
  ],
  "local_holdings_summary": "Candidate list contains no exact-part PDF, extraction or memory; parent to reconcile broader holdings."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/65385",
    "title_edition": "IEC 61558-2-16:2021 ed 2",
    "access_time_utc": "2026-11-02T23:00:19Z",
    "evidence_path": "evidence/iec-65385.html",
    "evidence_kind": "public scope and publisher lifecycle",
    "coverage_limitation": "Abstract and metadata only; not full clauses"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/87736",
    "title_edition": "IEC 61558-2-16:2021/COR1:2023",
    "access_time_utc": "2026-11-02T23:00:19Z",
    "evidence_path": "evidence/corrigendum.html",
    "evidence_kind": "publisher metadata",
    "coverage_limitation": "Corrigendum text not inspected"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/26261",
    "title_edition": "IEC 61558-1:2017",
    "access_time_utc": "2026-11-02T23:00:19Z",
    "evidence_path": "evidence/iec-part1.html",
    "evidence_kind": "public scope and publisher lifecycle",
    "coverage_limitation": "Abstract only; companion standard"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/26155",
    "title_edition": "IEC 61204-7:2016",
    "access_time_utc": "2026-11-02T23:00:19Z",
    "evidence_path": "evidence/iec-61204.html",
    "evidence_kind": "public scope and publisher lifecycle",
    "coverage_limitation": "Abstract only; comparison not full relationship"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxNTU4LTItMTZ7ZWQyLjB9Yi5wZGY=",
    "title_edition": "IEC 61558-2-16 ed 2 preview attempt",
    "access_time_utc": "2026-11-02T23:00:19Z",
    "evidence_path": "evidence/preview-endpoint",
    "evidence_kind": "access failure",
    "coverage_limitation": "HTTP 403; no preview inspected"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title_edition": "Bounded primary-source checks",
    "access_time_utc": "2026-11-02T23:00:19Z",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Previous supplier source check; original supplier PDF not freshly inspected"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md",
    "title_edition": "Power standards historical batch",
    "access_time_utc": "2026-11-02T23:00:19Z",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Claims not independently verified unless supported by IEC catalogue"
  }
]
`````
