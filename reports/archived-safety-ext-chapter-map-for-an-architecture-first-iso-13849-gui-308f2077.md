---
{
  "format": 1,
  "metadata": {
    "id": "archived-safety-ext-chapter-map-for-an-architecture-first-iso-13849-gui-308f2077",
    "title": "SAFETY_EXT chapter map for an architecture-first ISO 13849 GUI",
    "question": "What findings, alternatives and limitations does the historical investigation document about SAFETY_EXT chapter map for an architecture-first ISO 13849 GUI?",
    "scope": "Historical risk-assessment/ISO GUI source and design study: SAFETY_EXT chapter map for an architecture-first ISO 13849 GUI. Original normative/private-source boundaries, planning status, exact revision references and unresolved questions are retained.",
    "summary": "Source/reasoning and interaction research for SAFETY_EXT chapter map for an architecture-first ISO 13849 GUI. Distinguishes planned GUI behavior, source meaning and actual implementation; not an adopted method or validated machine result.",
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
      "Private or licensed book/standard/study sources are referenced, not supplied as assets. Publication covers the report analysis only; it does not grant readers access to those sources or relicense them."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:46.539Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "308f20773e181b50b71ab3eaa7df7d33334eac36e65a1a17b6738535118c6aaa",
  "proposalRevision": "b890d78b5b15ca28800f54781fa4fb6c9b0f3cd789c9e65a07ce2141e50d80d0"
}
---
# SAFETY_EXT chapter map for an architecture-first ISO 13849 GUI

**Research only; no implementation or engine changes are authorized.** SAFETY_EXT is a private, copyrighted study repository without a selected reuse license. Its [README][readme] describes a complete book-derived analytical M0 specification, not an executable M1 engine, an M5 normative audit, machine-specific validation, human approval or release. The chapters and blueprint are concept maps, not authorities overriding ISO 13849-1:2023 or the current app's contracts. Do not copy or redistribute their images, tables, code or other assets.

The chapter links below point to **source lines at pinned commit `20b0b57f9920d0b74bf63a47525d8f9868aa7910`**; labels such as `#categories` name actual HTML section IDs, while the URL line anchors make them navigable in GitHub's source view. Access may require permission. The local readable extractions exclude scripts and styles and may omit image labels; original HTML was inspected as text only, never executed. Relationships below are **authored study relationships**, not proof that an application implements them.

## Chapter roles and handoffs

1. [Chapter 1 `#map`][c1] separates electronic, cycle-based electromechanical, architecture and low-demand calculation trees. It supplies quantities, units, assumptions and lifetime boundaries to the parameter study, not a universal formula.
2. [Chapter 2 `#map`][c2] puts reliability into a safety-function, integrity, demand and physical-boundary context. It supplies the distinction between random hardware and systematic integrity; a number alone cannot establish the latter.
3. [Chapter 3 `#map`][c3] is a cross-cutting dependency atlas, not a mandatory third screen. Manufacturer and application data, failure classifications, diagnostic behavior, architecture and lifetime feed later design and evaluation. Its IEC and low-demand examples are study branches, not automatically ISO GUI features.
4. [Chapter 4 `#roadmap`][c4] links hazards and risk reduction to function, required PLr and SRS; [`#requirements`][c4req] separates required behavior from the subsystem design. Iteration can send a design finding back to requirements. Its function specification is the stated handoff to Chapter 5.
5. [Chapter 5 `#handoff`][c5] takes a ready Chapter 4 specification; [`#workspace` and `#components`][c5structure] decompose the function and relate reusable manufacturer records to application-specific instances. Software, systematic evidence, use and demand context feed the Chapter 6 subsystem handoff. Its structural templates do **not** themselves implement ISO categories.
6. [Chapter 6 `#handoff`, `#categories` and `#evidence`][c6entry] imports a subsystem and studies its category, qualitative conditions and fault behavior; [`#metrics`, `#lookup` and `#combine`][c6results] lead to subsystem and complete-function results and a review dossier. A category belongs to a subsystem; a logical block picture does not prove wiring or implemented fault behavior.
7. [Chapter 7 `#entry`][c7] is an **alternative IEC 62061 architecture/SIL branch**, optionally using Chapter 5 evidence. It is not a subsequent mandatory step for the requested ISO-only GUI; its HFT/SFF, beta and equations must not be silently mixed into the ISO result.
8. [Chapter 8 `#dependencies` through `#testing`][c8] takes a specification, design and assessment into validation planning, analysis, fault and functional testing, software and parameterization checks. Its workbench records coverage/readiness, not objective test evidence or independent approval. Findings may require design revision and revalidation.

## Dependency map: engineering questions versus mechanics

**Authored study relationship:** Chapter 4 → Chapter 5 → Chapter 6 → Chapter 8 is a useful evidence chain, with Chapters 1–3 supplying concepts across it. It is not a strict one-way wizard. The [blueprint's topology][blueprint] likewise includes affected downstream invalidation and re-entry; its [scope][blueprintscope] calls the chapter HTML files references, not modules to concatenate.

**Proposed bounded ISO interaction:**

```text
Function + PLr + behavior/boundaries/use
  → each subsystem: intended architecture/category and physical realization
  → technologies, components, manufacturer claims + actual application/duty/life
  → applicable principles, suitability, fault behavior and conditional measures
  → supported native assessment → subsystem/function results and report
  → verification + as-built validation, findings and any affected rework
```

- **Architecture drives applicability, not proof.** Ask which functional/test channels, fault responses and interfaces actually exist. Selecting a template can organize questions, but cannot establish independence, correct wiring or a category claim. The study's Chapter 6 makes qualitative evidence a separate gate from numerical results ([`#categories`, `#evidence`][c6entry]).
- **Technology and placement drive data and principles.** Chapter 5 distinguishes a reusable supplier record from suitability for each installed use ([`#components`][c5structure]). Chapter 3 relates B10D, operations, MTTFD and lifetime to the actual application ([`#available`][c3data], [`#lifetime`][c3life]). A switch may need suitable mechanical actuation and electrical protection ([Chapter 4 `#principles`][c4principles]); pneumatic parts have distinct [pressure and installation considerations][blueprintapplication]. Ask for actual load, environment, duty, source and replacement conditions; do not silently select a favorable fallback.
- **Diagnostics, CCF and testing answer different questions.** Chapter 3 ties diagnostics to the *tested target*, covered faults, frequency and effective response ([`#dc`][c3dc]); shared supplies, wiring and environment affect common causes ([`#ccf`][c3ccf]). For example, contactor feedback can target output-contact faults; it does not establish input-wiring coverage. Chapter 4 also flags fault masking ([`#masking`][c4mask]). ISO Annex E permits justified combinations of DC measures, but not naive percentage stacking; its DCavg weighting includes known untested parts. CCF's Annex F scoring is different mathematics ([ISO Annexes E–F][isodc]). A selected diagnostic is planned intent, not evidence of implementation.
- **Results have boundaries.** Chapter 6 distinguishes a simplified lookup from a documented external extended result and complete-function combination ([`#lookup` and `#combine`][c6results]); the book's Table 6.3 is not ISO Table K.1. The GUI should display only actual native results, sources, limitations and blockers. An external study route is not proof that the fixed engine accepts it.
- **Verification is not validation.** The blueprint separates checking design/calculations from evaluating the as-built implementation ([B12–B13][verification]). Plan validation early; identify outstanding analysis, functional and fault tests, software where applicable, and independent review. A report or numerical result is not machine validation.

IDs, JSON handoffs, source-hash bindings, empty native containers, gate names and package snapshots are **internal pipeline mechanics**, not extra engineering questions merely because the study uses them. A future adapter may hide only deterministic, semantics-preserving transport. It must not invent evidence, remove required inputs or disguise an unsupported native route.

## What this adds to the earlier research note

The [architecture-first note](2026-10-26-architecture-first-gui.md) already captures category applicability, conditional DC/CCF and honest native results. SAFETY_EXT adds a concrete *cross-chapter* basis for connecting the same information: requirements → reusable product claim → installed use → subsystem architecture and evidence → result → validation. Its [reference-map HTML][reference-map] already joins chapter contributions to the B00–B15 dependency spine: use that existing map as a reference rather than inventing another disconnected topology. Changes to an application, topology, diagnostic, source or requirement can stale only the affected conclusions; preserve authored and historical work rather than silently restoring prior credit ([blueprint change map][changes]). This is a GUI proposal, not permission to implement the blueprint's full service or package machinery.

**The desired simpler interaction is already explicit in [blueprint §15][interaction]:** L0 shows current position and next action; L1 the current engineering question; L2 technical details; L3 sources and explanations. All layers use the same controlled model. Checklists arise from applicable rules, and a gap must explain what is missing, why it matters, which object it affects and the next action. This argues for an adaptive question view over the existing dependencies—not eight chapter screens, sixteen block forms, or a second frontend calculation/rule authority.

**Normative correction to the study, not to the earlier note:** Chapter 6 says the Category 2 test-channel MTTFD is *at least* half that of the functional channel ([`#cat2`][c6cat2]); the blueprint uses the same inclusive boundary. [ISO 13849-1:2023 §6.1.3.2.4][iso2] says **greater than** half. That clause also specifies the 100:1 test/demand condition or the stated immediate-demand alternative; do not promote the study's separate 25× lookup adjustment into a bypass. Apply the current standard and native capability, not the study's comparator.

The blueprint's one-authoritative-route policy is a project design constraint, not a general ISO ban on qualified IEC-designed subsystems. ISO has conditional provisions for those subsystems ([§6.2.1][isoroutes]). The earlier note already identifies a qualified manufacturer PL-or-SIL **and PFH** input as a possible ISO path but a current GUI/engine capability gap; do not fabricate internals or imply the gap is an ISO prohibition.

## Small journey and branches

**Category 1 input subsystem, proposed:** Record a guard-stop function, supplied PLr, scope and operating conditions. Choose a single-channel Category 1 *intent* for the input subsystem, not the whole function. Identify the actual electromechanical switch and supported manufacturer data route, its cycles, loading and lifetime. Review applicable basic and well-tried principles and separately justify the component as well-tried for that application. On the usual simplified route ask for neither DC credit nor a CCF checklist; the channel must achieve high MTTFD and Category 1 is capped at PL c ([ISO §6.1.3.2.3][iso1]). Systematic, software-if-applicable, integration and validation duties remain. Evaluate only when the native route supports the inputs; show missing/unsupported conditions and assess other subsystems separately.

**If Category 2:** reveal the functional/test-channel arrangement, test coverage, timing, reaction, test-equipment reliability and CCF between functional and testing channels. **If Category 3:** reveal redundant means, single-fault behavior, practicable detection and CCF between functional channels. **If Category 4:** additionally check high channel MTTFD and DCavg and the stricter detection-or-fault-accumulation behavior ([ISO §§6.1.3.2.4–6][iso234]). These are context-triggered questions in one adaptive procedure, not eight compulsory chapter screens. A change of category or evidence makes affected results require review; it does not convert earlier selections into proof.

[readme]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/README.md
[c1]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-1-pfhd-mathematical-backbone.html#L363
[c2]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-2-functional-safety-decision-framework.html#L349
[c3]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-3-main-parameters-dependency-atlas.html#L362
[c3data]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-3-main-parameters-dependency-atlas.html#L490
[c3dc]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-3-main-parameters-dependency-atlas.html#L775
[c3ccf]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-3-main-parameters-dependency-atlas.html#L1321
[c3life]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-3-main-parameters-dependency-atlas.html#L1436
[c4]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-4-risk-to-safety-function-framework.html#L67
[c4req]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-4-risk-to-safety-function-framework.html#L130
[c4mask]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-4-risk-to-safety-function-framework.html#L226
[c4principles]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-4-risk-to-safety-function-framework.html#L219
[c5]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-5-design-and-evaluation-of-safety-functions.html#L251
[c5structure]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-5-design-and-evaluation-of-safety-functions.html#L282-L426
[c6entry]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-6-iso-13849-categories-and-pl-evaluation.html#L132-L215
[c6cat2]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-6-iso-13849-categories-and-pl-evaluation.html#L216-L240
[c6results]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-6-iso-13849-categories-and-pl-evaluation.html#L241-L392
[c7]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-7-iec-62061-architectures-and-sil-evaluation.html#L32
[c8]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-8-validation-evidence-workbench.html#L994-L1113
[blueprint]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L113-L142
[blueprintscope]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L18-L32
[reference-map]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/pipeline-reference-map.html#L340-L379
[interaction]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L2428-L2481
[blueprintapplication]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L512-L558
[verification]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L1178-L1240
[changes]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L1420-L1444
[isodc]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3358-L3425
[iso1]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1570-L1582
[iso2]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1596-L1638
[iso234]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1596-L1711
[isoroutes]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1947-L1955
