---
{
  "format": 1,
  "metadata": {
    "id": "iec-61800-5-1-detailed-research-2026-11-02",
    "title": "IEC 61800-5-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61800-5-1?",
    "scope": "Detailed IEC 61800-5-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.216Z"
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
  "sourceDigest": "8da94e497f517fa8b9ec6ec408792b26bc33ddb456c69563adad37b808f42636",
  "proposalRevision": "be3e0eae498eae2b4624a5dcecf9450029ab02723244fce07ce386b637689be0"
}
---
# IEC 61800-5-1 — electrical, thermal and energy safety of adjustable-speed drives

**Checked 2026-11-02 UTC; scope-level research, not a clause-by-clause compliance assessment.**

## Identity and status

IEC 61800-5-1:2022, *Adjustable speed electrical power drive systems – Part 5-1: Safety requirements – Electrical, thermal and energy*, is an International Standard of IEC SC 22G. IEC identifies publication on 31 August 2022 as edition 3.0. Its current online copy says **corrected version 2025-12**, incorporating corrigenda 1 (September 2023) and 2 (December 2025). The product lifecycle on that page lists the 2007 edition and 2007+A1:2016 consolidated edition as revised. A stated stability date of 2026 is not an expiry date or proof that a replacement exists. This check does not establish a European adoption's present status, an OJEU listing, or the edition applicable to a particular product. [1]

## What it is for and who uses it

The standard concerns physical safety of adjustable-speed electrical power drive systems (PDS) and their elements: a drive can expose people or surroundings to hazardous electrical energy, heat, fire, mechanical and other hazards. Its users include drive manufacturers assessing the construction and testing of a PDS or drive module, test/certification bodies, and machine builders choosing and integrating a bought drive under its specified conditions. A PDS combines the power conversion, basic or complete drive module (BDM/CDM) control and motor(s). The catalog description supports these purposes but is not itself the complete requirements. [1]

## Exact scope, exclusions and boundary

IEC states that the standard specifies requirements for adjustable-speed electrical PDS **or their elements** concerning electrical, thermal, fire, mechanical, energy and other relevant hazards. The **driven equipment is outside scope except for interface requirements**. A machine load, mechanism, guarding or process is not made compliant merely because its drive is assessed. Traction and electric-vehicle BDM/CDM are explicitly excluded; do not expand that statement into an unsupported exclusion for every vehicle-related element. [1]

The covered PDS are intended to feed motor(s) from a BDM/CDM connected at:

- low voltage: phase-to-phase supply up to and including **1.0 kV AC, 50 or 60 Hz**, and **1.5 kV DC**;
- high voltage: phase-to-phase supply up to and including **35 kV AC, 50 or 60 Hz**, and **52 kV DC**. [1]

These are scope limits as stated by the publisher, not permissible touch voltages, terminal ratings for every product, or design values. The catalog says the standard also applies to PDS intentionally emitting or receiving radio waves for radio communication. It does not follow that this electrical safety standard alone establishes radio regulatory or EMC conformity. The exact treatment of particular radio functions and other limits needs the complete text. [1]

## Technical themes: what can and cannot be concluded from available evidence

The publisher describes hazards and the 2022 edition's changes, including harmonization with IEC 62477-1:2022 and North American counterparts, more detailed component evaluation against the document and relevant component safety standards, and updated mechanical-hazard requirements including multiple IP ratings. The IEC scope does not furnish all design rules or test procedures; a public preview request returned HTTP 403, so construction-test and clause details were **not inspected**. [1, 4]

For a drive designer or assessor, the electrical/thermal/energy themes point to equipment construction and evaluation of hazards associated with energized circuits, stored energy, heat and fire, as well as mechanical hazards and relevant components. For a machine engineer these are reasons to request rated interfaces, instructions and evidence, **not a substitute for reading specified tests and limits**. No insulation distance, discharge time, temperature rise, test voltage or IP combination can be inferred from this abstract. The title's “energy” is a safety-hazard context; do not interpret it as proof of an energy-efficiency class or savings claim. [1]

Separate three evidence levels:

1. **Construction and tests:** the drive manufacturer/test body evaluates the defined product configuration against the applicable edition and test requirements. The present research has not verified specific type/routine tests, their acceptance criteria, or whether any particular product passed them.
2. **Product claims:** obtain an identifiable manufacturer's declaration or certificate, referenced model/variant, standard edition and conditions, and distinguish a supplier claim from independent certification and actual test reports. A catalog scope alone proves none of these.
3. **Installed machine:** the integrator verifies the actual supply, protection, wiring, enclosure, motor and load interfaces, ambient/cooling, accessible parts and residual risks against applicable machine requirements and the maker's instructions. Such validation is not automatically delivered by a tested component. The exact checks are application-dependent engineering implications, not purported verbatim IEC clauses.

## Selection and installation: questions worth asking

For a VFD/servo drive package, record model and options, rated supply and frequency, input/output and motor compatibility, motor cable conditions, permissible ambient/environment and cooling, protective earth and supply protection, and any specified mounting/enclosure or external protective components. Ask what manufacturer instructions say about stored-energy discharge and safe access before maintenance, including measurement/verification where applicable; do not invent a universal waiting time. Confirm ratings and connections for any DC link, braking resistor or shared bus if the selected product uses them. These are evidence prompts rather than claims that every optional interface is covered identically in the standard. [1]

The purchased device is a black box: retain published ratings, required external parts and prescribed interface/use conditions; internal circuit diagrams, resistor values and proprietary firmware are not prerequisites for accepting an unmodified bought product. A drive model, compatible motor, optional filter or resistor and enclosure can each have its own restrictions; a generic category or CE mark cannot fill missing evidence. See local library guidance [5].

## Functional safety and the machine

Part 5-1's electrical/thermal safety scope **does not by itself establish** a safety-rated motion function, a subsystem PL/SIL, or the achieved integrity of a machine safety function. IEC 61800-5-2 addresses design/development, integration and validation of safety-related PDS in functional-safety terms, and treats them as subsystems of a safety-related system. Its publisher page identifies a 2016 base and a 2016+A1:2026 consolidated edition; check the actual supplier's cited document and applicable revision. [2]

For a drive offering STO or another safety function, request the exact function, model/options, safety manual, declared safety data and permitted implementation conditions. Validate the entire safety function and application separately. STO is not an electrical isolator or an automatic substitute for a holding brake, and neither a 5-1 reference nor a safety certificate by itself permits removal of contactors. The local source review specifically notes that the held 2007 edition of 5-2 identifies possible additional braking and isolation measures; it does not settle every application or current-edition detail. [5, 6] No automatic category, diagnostic coverage, PL, SIL, or PL/SIL conversion is justified here.

## Companion standards and uses

- **IEC 61800-5-2:** functional safety of safety-related drive subsystems, distinct from the Part 5-1 physical hazards. [2]
- **IEC 61800-5-3:** safety-related encoders; applies where encoder functional safety is claimed, including use as a sensor within a safety-related drive. Not a universal rule for all ordinary encoders. [3]
- **IEC 62477-1:** power electronic converter system safety; IEC explicitly identifies harmonization with its 2022 edition as a change in 5-1:2022. Exact overlap and precedence require full texts, not inference from harmonization. [1]
- **IEC 60204-1 and ISO 13849-1 / IEC 62061:** machine electrical equipment and safety-related control-system routes respectively; selection and validation depend on the actual machine and its applicable requirements, not solely on the drive product standard. [5, 6]

## Library and local holdings

The direct relevance is to `vfd` and servo-drive variants, with interfaces to `motor`, braking accessories and, conditionally, safety-related drive/feedback options. Keep product-safety, functional-safety, EMC and machine-integration evidence separate. Ask whether the exact model actually declares 5-1, which edition/corrigenda, what configuration and external parts are covered, and whether safety functions have separate manufacturer evidence. Do not assign 5-1 automatically to every motor or encoder merely from association with a drive. [1, 3, 5]

The supplied filesystem candidate inventory for this exact part lists **no matching PDF, extracted Markdown or memory candidate**. This is a scoped candidate search result, not proof that no copy exists anywhere in the project; no full 5-1 text or local 5-1 edition was inspected. The held IEC 61800-5-2:2007 referenced in [6] is a different part, not a 5-1 holding. **Recommendation: conditional acquisition/update**, if a concrete drive design, assessment or recurring clause question needs the actual text; retain source/edition provenance and assess whether the corrected edition or a supplier-cited older edition is necessary. Do not purchase automatically for each purchased drive. Parent to reconcile holdings independently.

## Sources and limitations

1. IEC, [IEC 61800-5-1:2022 official catalog](https://webstore.iec.ch/en/publication/62103), scope, changes, publication metadata and lifecycle; saved `evidence/iec-62103.html`.
2. IEC, [IEC 61800-5-2:2016 official catalog](https://webstore.iec.ch/en/publication/24556), functional safety scope and visible consolidated-edition link; saved `evidence/iec-24556.html`.
3. IEC, [IEC 61800-5-3:2021 official catalog](https://webstore.iec.ch/en/publication/28614), safety-related encoder scope; saved `evidence/iec-28614.html`.
4. IEC preview link encoded in [1], saved `evidence/iec-preview`: 403 request blocked. No attempt to bypass.
5. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, especially category routes and evidence distinctions; local guidance, not full standard.
6. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, STO row, citing held IEC 61800-5-2:2007 §§1, 4.2.2.2 and 6.2.1.1.1; historical, edition-qualified secondary source.

Publisher scope and changes are primary evidence, but the standard's full clauses and tests, regional adoption, exact manufacturer's documentation, present legal applicability and machine-specific conditions remain unverified. No certification or compliance conclusion is made.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `289dfb42376b907498d010cf4a21e4d45bb70f43a1353bae78a0756921eaec82`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61800-5-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61800-5-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and construction/test clauses not inspected; official preview returned 403",
    "No supplier-specific evidence, EN adoption or current legal status verified"
  ],
  "local_holdings_summary": "Supplied candidate list has no matching PDF, extraction or memory file; no 5-1 full text inspected. Held 5-2:2007 is a different part."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/62103",
    "title_edition": "IEC 61800-5-1:2022 edition 3.0 corrected 2025-12",
    "accessed_utc": "2026-11-02T23:04:35.307358+00:00",
    "evidence_path": "evidence/iec-62103.html",
    "evidence_kind": "public scope and lifecycle",
    "coverage_limitation": "No full clauses or test procedures"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/24556",
    "title_edition": "IEC 61800-5-2:2016",
    "accessed_utc": "2026-11-02T23:04:35.307358+00:00",
    "evidence_path": "evidence/iec-24556.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Related standard only; consolidated 2026 edition linked but not independently inspected"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/28614",
    "title_edition": "IEC 61800-5-3:2021",
    "accessed_utc": "2026-11-02T23:04:35.307358+00:00",
    "evidence_path": "evidence/iec-28614.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Related standard only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxODAwLTUtMXtlZDMuMH1iLnBkZg==",
    "title_edition": "IEC 61800-5-1 edition 3 preview",
    "accessed_utc": "2026-11-02T23:04:35.307358+00:00",
    "evidence_path": "evidence/iec-preview",
    "evidence_kind": "failed preview",
    "coverage_limitation": "403 request blocked"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title_edition": "Local scope research guide",
    "accessed_utc": "2026-11-02T23:04:35.307358+00:00",
    "evidence_path": null,
    "evidence_kind": "local research guide",
    "coverage_limitation": "Not normative text"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title_edition": "Local safety-source review",
    "accessed_utc": "2026-11-02T23:04:35.307358+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Secondary analysis of held IEC 61800-5-2:2007, not 5-1"
  },
  {
    "url_or_path": "NORMATIVE_CANDIDATES.json",
    "title_edition": "Candidate inventory IEC 61800-5-1",
    "accessed_utc": "2026-11-02T23:04:35.307358+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "local inventory",
    "coverage_limitation": "Candidate list, not proof of universal absence"
  }
]
`````
