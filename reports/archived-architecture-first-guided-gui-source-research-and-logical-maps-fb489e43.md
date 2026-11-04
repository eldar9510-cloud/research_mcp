---
{
  "format": 1,
  "metadata": {
    "id": "archived-architecture-first-guided-gui-source-research-and-logical-maps-fb489e43",
    "title": "Architecture-first guided GUI: source research and logical maps",
    "question": "What findings, alternatives and limitations does the historical investigation document about Architecture-first guided GUI: source research and logical maps?",
    "scope": "Historical risk-assessment/ISO GUI source and design study: Architecture-first guided GUI: source research and logical maps. Original normative/private-source boundaries, planning status, exact revision references and unresolved questions are retained.",
    "summary": "Source/reasoning and interaction research for Architecture-first guided GUI: source research and logical maps. Distinguishes planned GUI behavior, source meaning and actual implementation; not an adopted method or validated machine result.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Original report status/context: Status: research and UI proposal, not an approved implementation specification, machinery-compliance determination, or safety approval. No code or engine changes are authorized by this note. ISO 13849-1:2023 governs this comparison; Tacchini explains the subject and may use earlier-edition framing. The sources do not prescribe this interface. Apply the complete standards to the actual machine and its safety requirements.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication.",
      "Private or licensed book/standard/study sources are referenced, not supplied as assets. Publication covers the report analysis only; it does not grant readers access to those sources or relicense them."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:46.349Z"
  },
  "warnings": [
    {
      "code": "unknown_research_date",
      "message": "Original research date unknown; import is not verification."
    },
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
  "sourceDigest": "fb489e436b4dc3226d02d9c2f4e20142cc786b89056caae991d30034f7aa7c93",
  "proposalRevision": "73cfbd00d434df46706ec5e79b807f8d502e714d5f3d2cd69863bca2e4ee0be1"
}
---
# Architecture-first guided GUI: source research and logical maps

**Status: research and UI proposal, not an approved implementation specification, machinery-compliance determination, or safety approval. No code or engine changes are authorized by this note.** ISO 13849-1:2023 governs this comparison; Tacchini explains the subject and may use earlier-edition framing. The sources do not prescribe this interface. Apply the complete standards to the actual machine and its safety requirements.

## Sources and extraction cautions

The private primary repository is pinned to commit `32a86590183983924784a596358f1a6b2d8de45e`. Pinned line links below may require repository access. All discussion here is paraphrased; do not republish the private standards/book or add their assets to the GUI.

- **ISO23:** [`reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md`][iso-categories], SHA-256 `f7b83c526fc07c28b0faf40b9ae5b5b640de40486faa4791d9c72d65897e43e5`.
- **Book:** [`reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md`][book-categories], SHA-256 `c86babd3cb424d36045a9bb96e815f7d0c56f1de9e6b117ef679143603f09a14`. Its adjacent PDF, `reference-sources/Tacchini_2023/Tacchini_2023_Functional_Safety_of_Machinery.pdf`, has SHA-256 `2e45267fb5befc5f6028a983f0961feecf7a3a5484e16f23b95f9d49ba0f5782`. All three match `reference-sources/manifest.sha256`; the repository README identifies these materials as private and copyrighted.
- **Part2:** `/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/ISO_13849-2_2012/ISO 13849-2_2012/auto/ISO 13849-2_2012.md`, SHA-256 `55c043e5e2aa9646e3f697e07ba32e9def9b1e882f4ba70c969f18aa9df42854`. Its source PDF is `/media/eldar/disk_2/Machine_concept/NORMATIVE/STANDARDS_PDF/Machinery_Safety/ISO 13849-2_2012.pdf`, SHA-256 `78bbf0ee924aba3e0f0298acb51e3ae8a3a8ce5132dd056d0e34fbecaea3e529`. These locally supplied Part2 files are **not** in the primary repository manifest. Part2 line references below use this exact extract; relevant §4.1, §9.2.1–9.2.2 and D.1 were also checked against its PDF.

Extraction is not a clean typeset standard. In particular, ISO23 [§6.1.4 Table 6][iso-reliability] misaligns the low/medium/high labels and ranges. Tacchini [§6.3.2, Table 6.2][book-mttfd] and its PDF physical page 292 corroborate the conventional ranges; Part2 §9.2.2, lines 500–518 and PDF physical page 17 independently corroborate the Category 1 minimum. ISO23 Annex I has visibly corrupted mathematical symbols and [Annex K][iso-k] has misaligned cells and OCR fragments; do not reconstruct a numerical result from these extracts. A 2023 scanned local provenance PDF had no usable extracted text; its printed table was not visually verified. The book also inconsistently cross-references its own tables: its **Table 6.3** is a book/internal table, not an ISO clause. For the ISO numerical method cite ISO23 Annex K, specifically Table K.1, not “ISO Table 6.3” ([ISO23 §6.1.3.2.4][iso-2]; [Book §6.3.3.2][book-k]).

## 1. Normative map: architecture and applicability

ISO23 assigns a designated architecture to **each subsystem** in the simplified procedure; one safety function can combine different categories. A logical category diagram is not proof of a physical circuit, and non-designated structures require separate justification rather than automatic simplified-route admission ([§6.1.3.2.1][iso-architecture], [§6.1.8][iso-simplified]). The matrix summarizes that route, not every possible ISO assessment method. Basic principles apply throughout; Category 1–4 also require well-tried safety principles. Application/environment, systematic integrity, software where applicable, verification and validation do not disappear when DC/CCF are irrelevant ([§6.1.7][iso-systematic], [§10.1.1][iso-validation]; Part2 §4.1, lines 161–198).

| Category | Structure, obligations and fault behavior | Simplified DCavg / CCF | Channel MTTF_D and maximum PL |
|---|---|---|---|
| **B** | Basic principles and appropriate components for the application; a fault can lose the sub-function. | DCavg **none**; CCF consideration **not relevant**. | Low–medium in overview, at least low; maximum **PL b**. [§6.1.3.2.2][iso-b] |
| **1** | B **plus** well-tried principles **and separately** well-tried components; a fault can still lose the function. | DCavg **none**; CCF **not relevant**. | **High**, maximum **PL c**. [§6.1.3.2.3][iso-1] |
| **2** | B plus well-tried principles; test the functional channel at suitable intervals, with appropriate reaction. Loss can occur between tests. | Low–medium simplified bands; all functional-channel parts have at least low DC; DCavg excludes the testing-channel blocks. CCF concerns **functional versus testing channel**. | Low–high as required; maximum **PL d**. [§6.1.3.2.4][iso-2] |
| **3** | B plus well-tried principles; no single fault loses the sub-function; detect it at/before next demand when reasonably practicable. Accumulated undetected faults can cause loss. | Low–medium simplified bands, at least low subsystem DC; CCF concerns the redundant functional channels. | Low–high as required; maximum **PL e**. [§6.1.3.2.5][iso-3] |
| **4** | B plus well-tried principles; single-fault tolerance and timely detection, or tolerance of accumulation when detection is impossible. | **High** DCavg including accumulation considerations; CCF between redundant functional channels. | **High** each channel; maximum **PL e**. [§6.1.3.2.6][iso-4] |

The overview is [ISO23 Table 5][iso-categories]; its detailed clauses, not the table alone, govern. “None” is the named DC band, not an assertion that diagnostic devices are forbidden or that every unmeasured physical DC is zero. For B/1, do not ask the user for DC **credit** or a CCF checklist on this simplified route; diagnostics may exist for other purposes. Other applicable safety requirements remain. Tacchini [§6.2.2–6.2.3][book-b1] and ISO23 [Annex I.3][iso-example-a] illustrate this distinction; Annex I.1 explicitly excludes systematic integrity, software and principles from the example's numerical demonstration.

For Category 1, a well-tried *principle* is not a well-tried *component*. Under [ISO23 §6.1.11][iso-welltried], component suitability is application-dependent: documented successful similar use, listing in Part2 A–D, or manufacture, verification and validation demonstrating suitability under relevant standards are alternative bases. Complex components such as PLCs, microprocessors and ASICs are not equivalent to well-tried components. A large B10_D/MTTF_D, generic catalogue flag, or completed principle checklist is not enough. Part2 provides technology-specific principles (mechanical A.1–A.2, pneumatic B.1–B.2, hydraulic C.1–C.2, electrical D.1–D.2); its B/C annexes do not contain a well-tried-component list in that edition (Part2 lines 752–770, 782–798, 853–868, 906–929). Tacchini [§5.2][book-welltried] helps explain, but does not override ISO23.

For reliability, [ISO23 §6.1.4][iso-reliability] prioritizes manufacturer data, then specified methods/field data, then a 10-year choice; do **not** silently select a fallback as a favorable GUI default. Low is 3 to under 10 years, medium 10 to under 30, high at least 30; the simplified channel cap is 100 years, or 2,500 for Category 4. Check actual load, operations, lifetime and application conditions. These are channel values, not permission to cap individual components prematurely.

## 2. DC measures are not CCF points

**CCF:** [ISO23 §6.1.6][iso-ccf] requires sufficient measures for Categories 2–4. Informative [Annex F.1–F.3][iso-annex-f] provides one documented, application-specific checklist method: its 65-point threshold supports the simplified method's assumed 2% beta factor. An item is awarded its full reference score only if fully implemented; partial fulfillment scores zero in that method. Its categories include segregation, diversity, protection, analysis, competence and environment. Technology determines the relevant hazards; mixed technologies may require consideration of more than one environmental aspect. This is **not** a general obligation to use this one UI or to treat selecting a row as proof. Tacchini [§3.6.3][book-ccf] explains the distinction between ISO's method and other standards' beta-factor approaches.

**DC:** [ISO23 §6.1.5 and Table 7][iso-dc] define coverage as detected dangerous failure rate divided by total dangerous failure rate; FMEA or the Annex E simplified estimate are alternative bases. Bands are none below 60%, low 60–<90%, medium 90–<99%, and high at least 99%. [Annex E.1/Table E.1][iso-annex-e] gives *examples*, grouped by tested input, logic and output, with fixed estimates, ranges or application-dependent values—not points. The choice, target, actual dangerous failures detected, evidence, test timing and reaction matter. Indirect monitoring has a 90–99% application-dependent range. For cross-monitoring without a dynamic test in Categories 3/4, Annex E caps effective DC according to test frequency: below once/year it is 0%; at least once/year it is capped at 90%; at least once/month it is capped at 99%. Fault detection by the process has conditions and cannot by itself establish PLr e. For medium/high logic DC, Table E.1 footnote b requires measures covering variable memory, invariable memory and processing unit, each with at least 60% DC. Tacchini [§3.3–3.3.4][book-dc] describes why detection and response must be assessed, not just named.

Annex E permits appropriate combinations in principle; that does **not** justify a GUI adding percentages, taking their maximum, or crediting each selected row independently on the same target. It must respect the frozen native route and its same-element table/FMEA and overlap restrictions. [Annex E.2][iso-e2] weights each tested part's DC by its dangerous failure rate (`1/MTTF_D`); a known untested part contributes zero detected coverage while still contributing to the denominator. **Unknown/missing is not “untested = 0”.** Category 2 excludes testing-channel blocks from DCavg. Show only native-evaluated DC/DCavg, not a browser estimate. The native owner calculates weighted DCavg (`vendor/engine/runtime/src/calculations/diagnostics.js:103–168`, `vendor/engine/runtime/src/engine/diagnostics.js:705–754`); its applicability/evidence gates still determine whether any result is available.

Annex E examples can be valid in the standard yet not fully supported here: the logic dynamic-principle relay-interlocking row is catalogued but explicitly runtime-unsupported (`vendor/engine/runtime/data/generated/diagnostic-table-rows.json:677–702`); the logic indirect-monitoring range also carries an unsupported-endpoint blocker (`vendor/engine/runtime/data/generated/diagnostic-table-rows.json:503–532`). Display those distinctions; do not present blocked cases as available credited calculations. The existing `docs/pipeline-route-matrix.md:15–18` describes conditional table/FMEA routes and same-target restrictions, not a guarantee that every row and topology works. Selection alone is **planned**, not implementation, evidence acceptance, physical validation or credit.

## 3. Proposed bounded interaction map (not an ISO-mandated UI)

```text
Safety function + supplied PLr + boundaries/use/demand context
   -> each Input / Logic / Output subsystem: choose its assessment route
      |-- build from components
      |     -> intended category + technology + real component/application data
      |     -> applicable principles and separate component suitability
      |     -> if 2/3/4: scoped DC + CCF (+ Cat 2 test/reaction)
      |-- use an already assessed subsystem
            -> supplied performance, documented scope, interfaces/use restrictions
            -> verify an admissible native route; otherwise show unsupported
   -> expand only the selected route's conditions and evidence
   -> existing native check/evaluation -> identified result and report
   -> outstanding verification, physical validation and independent review
```

The second branch matters: [ISO23 §6.1.1][iso-manufacturer] does not require reconstructing internal DC/MTTF_D/CCF when the manufacturer supplies PL or SIL and PFH; [§6.2.1–6.2.2][iso-combination] still requires appropriate combination and validation. This is not permission to accept an unqualified brochure claim or use a frontend sum. The fixed app's missing qualified opaque-unit route remains an explicit capability gap, not an ISO prohibition.

Technical identifiers, source-hash handling, scope-link records and empty schema containers should normally be adapter mechanics where their mapping is deterministic and semantics-preserving. Choosing a category can create intended logical positions without claiming that physical wiring, channel independence, implementation or evidence has been verified. Collect each engineering declaration once through an explicit, scoped action; do not make the user repeatedly express it as GUI metadata and native transport fields. These are proposed interaction rules, not authority to fill favorable facts or alter native contracts.

Architecture and technology guide the questions; neither a category choice nor a visual template proves fault behavior. Required data may include component identity, source claim, units/bounds, operations, load/environment and replacement conditions. Select actual supported MTTF_D or direct B10_D routes where justified; show a missing or unsupported data route honestly. Never invent an internal channel for an opaque manufacturer unit. For Category 2, ask separately about functional/testing structure and TE reliability (greater than half the functional-channel MTTF_D), and about demand rate at most 1% of test rate **or** immediate-demand testing with detection and safe response before the hazard. For PLr d, a detected fault must initiate a safe state maintained until cleared; up to PLr c, warning is allowed where the safe-state reaction is not practicable ([§6.1.3.2.4][iso-2]).

A CCF-like named DC selector is a **presentation analogy only**: allow several scoped intentions, then reveal only the chosen measure's applicable actor, tested target/faults, implementation, interval, reaction, data and evidence. CCF reference points and DC percentages must remain visually and semantically distinct. Native result, source/conditions, limitations and actual blockers appear separately from declarations. Specific ISO clauses and meaningful restrictions should be accessible beside the choices, not hidden solely in hover text. This follows the existing proposal's D08–D13 (`docs/superpowers/specs/2026-10-22-pipeline-gui-redesign-design.md:37–42, 91–112`), but is not implementation approval.

Keep these states distinct in draft, review and report:

- **Unknown:** category/technology or applicability not yet established; no requirement is waived.
- **Inapplicable:** a reasoned route/scope conclusion, e.g. B/1 CCF credit; preserve formerly authored material inactive without current credit.
- **Missing / planned:** a required input or support is absent, or a named measure has no implementation; no favorable default.
- **Unmet:** a determined requirement or native check actually fails; show the finding.
- **Unsupported:** the standard may allow it, but the frozen app cannot admit this route; do not relabel it as forbidden by ISO or successful.
- **Needs review / historical:** a changed category, component, application, evidence or source revision affects prior bindings/results. Preserve authored work and immutable runs, mark stale, and require explicit reconciliation; do not resurrect old credit. Currentness is not physical approval.

Saving and navigation can remain possible with open items; a report must distinguish them from native outcomes and outstanding validation. A numerical PL/PFH or PDF does not validate the machine ([ISO23 §8 and §10.1.1][iso-validation]).

## 4. Small journeys

**Category 1, one input subsystem:** (1) Record a guard-opening stop function, supplied PLr and actual boundaries. (2) Choose Category 1 for the electromechanical input subsystem and select its real position switch; decide the other subsystem categories separately. (3) Give its applicable manufacturer B10_D or MTTF_D, operating frequency, load/environment and lifetime information through an existing supported route. (4) Review basic and well-tried principles for the technologies present, and separately document the switch's application-specific well-tried basis. (5) No DC-credit or CCF questions for this subsystem. Save an incomplete draft if information is missing; the native check must report blockers until all relevant subsystem and function inputs exist. Then show the actual calculation and separately outstanding systematic/software-if-applicable and physical validation. This resembles [ISO23 Annex I.3][iso-example-a], not a claim that any chosen switch, whole machine or PLr c is automatically acceptable.

**If Category 3 or 4 instead:** identify real redundant means and scope; assess single-fault behavior, select applicable target-specific diagnostics and CCF measures, and configure their real testing, reaction and evidence. Category 3 requires at least low subsystem DC and practicable detection; Category 4 additionally requires high DCavg/high channel reliability and the stricter detection-or-accumulation behavior. The same named diagnostic selector can guide both, but the native result must show whether the category-specific conditions are actually met ([ISO23 §§6.1.3.2.5–6][iso-34]; Book [§6.2.8][book-3] and [§6.2.9][book-4]).

## 5. Current boundary and open questions

The current pipeline GUI already hides B/1 DC/CCF credit: `public/pipeline/applicability.mjs:2–5`, `public/pipeline/measures.mjs:49–54`, `public/sections/diagnostics/index.mjs:36–40`, and `public/sections/ccf/index.mjs:18–23`. It still exposes explicit empty per-role native diagnostic transport (`public/pipeline/measures.mjs:13–27`; `public/sections/diagnostics/index.mjs:36–37`) and separate native configuration/IDs, while `public/pipeline/stages.mjs:31–39` mounts multiple measure sections. Thus the complaint is not simply “DC controls are visible for Category 1”: the unresolved usability issue is schema/transport and configuration bureaucracy. A future proposal could hide transport mechanics behind a truthful adapter **only if** existing schema semantics, inactive values, explicit evidence and native checks are preserved; investigate before deciding. This is not an exhaustive UI audit.

ISO23 [§6.1.1][iso-manufacturer] allows subsystems with manufacturer PL or SIL **and PFH** values without re-estimating their internal DC, MTTF_D, CCF or embedded software; application and integration still matter. The inspected fixed app does not establish a qualified manufacturer-PFH_D/PL-only producer route (`docs/pipeline-route-matrix.md:12–23`; `public/pipeline/picker.mjs:35–37`). Represent the opaque unit and documented interfaces honestly, but flag the current assessment gap. **No PFH_D inversion, fabricated internals, favorable defaults, frontend workaround or engine change.** Open questions for a later, separately authorized design: which current native data/evidence can be derived without changing its meaning; which measure/details are actually supported per technology; and how to reduce exposed mechanics without weakening review, preservation or validation. Independent technical and usability review remains necessary.

[iso-categories]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1487-L1515
[iso-architecture]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1518-L1534
[iso-simplified]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1802-L1832
[iso-b]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1536-L1556
[iso-1]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1570-L1582
[iso-2]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1596-L1638
[iso-3]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1653-L1673
[iso-4]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1685-L1711
[iso-34]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1653-L1711
[iso-reliability]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1723-L1750
[iso-dc]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1752-L1777
[iso-ccf]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1779-L1782
[iso-systematic]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1783-L1803
[iso-welltried]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1929-L1945
[iso-validation]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L2357-L2419
[iso-annex-e]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3358-L3400
[iso-e2]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3402-L3412
[iso-annex-f]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3414-L3526
[iso-example-a]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3735-L3850
[iso-k]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L4045-L4063
[iso-manufacturer]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1449-L1478
[iso-combination]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1947-L1972
[book-categories]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L7693-L7856
[book-b1]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L7832-L7899
[book-3]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L8314-L8370
[book-4]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L8527-L8547
[book-dc]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L3931-L4045
[book-ccf]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L4645-L4675
[book-welltried]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L6886-L6912
[book-mttfd]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L8691-L8710
[book-k]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L8748-L8754
