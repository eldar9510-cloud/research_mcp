---
{
  "format": 1,
  "metadata": {
    "id": "archived-task7-ccf-source-and-reasoning-map-62e65490",
    "title": "Task7 — CCF source and reasoning map",
    "question": "What findings, alternatives and limitations does the historical investigation document about Task7 — CCF source and reasoning map?",
    "scope": "Historical risk-assessment/ISO GUI source and design study: Task7 — CCF source and reasoning map. Original normative/private-source boundaries, planning status, exact revision references and unresolved questions are retained.",
    "summary": "Source/reasoning and interaction research for Task7 — CCF source and reasoning map. Distinguishes planned GUI behavior, source meaning and actual implementation; not an adopted method or validated machine result.",
    "researched_at": "2026-10-29",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi",
      "author": "unknown",
      "model": "DeepSeek Flash scouts; original parent model unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Prior inventory classification (not a completion verification): planning only",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication.",
      "Private or licensed book/standard/study sources are referenced, not supplied as assets. Publication covers the report analysis only; it does not grant readers access to those sources or relicense them."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:46.873Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "62e6549010f2c56f9f4a148e23811aa84ed69a57d52162ab90191f6874bbdf12",
  "proposalRevision": "57872d9eb06b8618b5a0c5606319e9991efab8324d5e4b62eb4abda35711cbcc"
}
---
# Task7 — CCF source and reasoning map

Planning only, 2026-10-29. Baseline `3dfed649510c4b626506c26d5aa09b70f7df13ca`, branch `design/pipeline-gui-redesign`. This is source research and a static walkthrough, **not** a browser observation, implemented feature, test pass or independent review. No licensed source payload is reproduced or made a runtime dependency.

## 1. Authority and custody

ISO13849-1:2023 governs; referenced ISO13849-2:2012 supplies subordinate validation/technology context; Tacchini explains; pinned SAFETY_EXT illustrates relationships. The agreed GUI design determines presentation, not native arithmetic. Current accepted code determines the available software contract, not what ISO permits generally.

The Task6 publication record supersedes older HEAD/uncommitted statements. The historical shared contract's old engine pin and pre-1.1 format status are obsolete: retain the accepted local successor and current closed formats. Task6's repair permission does not extend to Task7.

| Reference | Identity | Local read-only location / object |
|---|---|---|
| ISO13849-1:2023 extract | SHA256 `f7b83c526fc07c28b0faf40b9ae5b5b640de40486faa4791d9c72d65897e43e5` | `/home/eldar/Projects/ubuntu-iso13849-clean/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md` |
| ISO13849-2:2012 extract | SHA256 `55c043e5e2aa9646e3f697e07ba32e9def9b1e882f4ba70c969f18aa9df42854` | `/home/eldar/Projects/Project_1/normative/extracted_txt/_backup/leveled_mineru/ISO 13849-2_2012.md` |
| Tacchini2023 extract | SHA256 `c86babd3cb424d36045a9bb96e815f7d0c56f1de9e6b117ef679143603f09a14` | `/home/eldar/Projects/Safety/mineru_ext/Tacchini_2023_Functional_Safety_of_Machinery/auto/Tacchini_2023_Functional_Safety_of_Machinery.md` |
| SAFETY_EXT Ch3 | SHA256 `9f409c8b2fbd4f26e30ad5d310fb030f91317d0937ec1859df711de88a3aae0a` | Git object `20b0b57f9920d0b74bf63a47525d8f9868aa7910:chapter-3-main-parameters-dependency-atlas.html` in `/home/eldar/Projects/Safety` |
| SAFETY_EXT Ch6 | SHA256 `2f1df6286028b7a918b248e3cdbd875f3912e9cbf89804bfdd5b1cfe3557f263` | Same commit, `chapter-6-iso-13849-categories-and-pl-evaluation.html` |
| SAFETY_EXT blueprint | Exact SHA256 in accompanying identities JSON | Same commit, `MASTER-PIPELINE-BLUEPRINT.md`, §15 progressive disclosure and change dependencies |
| Agreed GUI design | Exact baseline file/hash in identities JSON | `docs/design/architecture-driven-gui.md` §§3.5,3.7,4.2–4.3,4.7,5 |

The three extracts' hashes were checked against prior pins; study files are read via **Git objects**, never a floating working tree. Additional inspected code/contract hashes and source byte sizes are in `../handoffs/architecture-gui-task7/planning-source-identities.json`. Paths identify local provenance; they are not shipped assets or clean-clone requirements. Existing extraction cautions remain: this planning session does not claim a new visual PDF/table audit. If a proposed condition depends on ambiguous OCR/layout, inspect the licensed original before implementing that copy; do not invent a condition.

## 2. Clause-to-behavior reasoning

| Authority / exact extract location | Relevant meaning, paraphrased | Task7 consequence |
|---|---|---|
| ISO §6.1.6, lines1779–1781 | Common-cause multiple faults must be considered for Category2/3/4 subsystems. Cat2 compares functional/testing paths; Cat3/4 redundant functional paths. | Present the actual subsystem and correct path relationship. No one project-wide checklist qualifying all roles. |
| ISO AnnexF heading3414–3416; F.1 lines3418–3424 | Annex is informative, used through normative requirements; per-subsystem documentation supports the simplified method's assumed CCF model and 65-point reference. | Explain reference method/threshold without claiming that checklist selection or 65 by itself establishes safety. |
| ISO F.2 lines3426–3447, especially3432–3434 | Full implementation is required for full reference points; partial gets zero; relevance depends on actual application/technology. | Distinguish partial from unknown; never award proportional points or infer whole-row N/A merely because one technology-specific subcondition is irrelevant. |
| ISO TableF.1 lines3438–3439; F.3 lines3449–3526 | Groups: segregation; diversity; protection/well-tried components; analysis; competence; environmental controls. F.3 carries the material conditions. | Eight source-backed native rows, grouped meaningfully, each with its specific implementation question and evidence prompt. |
| ISO F.2 note2/3 lines3443–3447 | Redundant paths mean different arrangements for Cat2 versus3/4; relevant causes follow application and foreseeable faults/misuse. | Show functional/test owners and shared dependencies, not fabricated independence. |
| ISO F.3.1 lines3451–3465 | Separation has physical/electrical/fluidic aspects; tin-whisker discussion refers to Part2 D.2.2. | Ask which paths and common exposures are separated; link source detail, no blanket clearance claim. |
| ISO F.3.2 lines3467–3485 | Diversity concerns actual different technologies/principles/designs. | Different labels or two devices are not proof of diversity. |
| ISO F.3.3 lines3487–3499 | Protection must address actual excessive stresses; well-tried components are a distinct measure. | Ask relevant electrical/fluidic stresses; never auto-fill this row from Task5 principle completion, reliability or a catalogue flag. |
| ISO F.3.4–F.3.5 lines3501–3507 | Analysis and competence require substantive work/support. | Ask what analysis/training addresses the selected scope, not whether a checkbox was selected. |
| ISO F.3.6.1 lines3511–3522 | Electrical EMI and fluidic purity controls differ; mixed systems need both relevant aspects. | Electrical/fluidic/mixed prompts; unknown technology stays unknown. Do not duplicate 6.1 into separately scored electrical and fluidic rows. |
| ISO F.3.6.2 lines3524–3526; F.4 lines3528–3534 | Other environment and technology/systematic-capability limits matter. | Conditions/evidence do not guarantee the detection principle or complete PL. |
| ISO §6.1.1 line1478; §6.1.2 lines1480–1485; §6.2 lines1953–1955 | Qualified supplied PL/SIL with PFH can avoid internal re-estimation under its applicable conditions. | No invented category/internal checklist for supplied-unit views; retain software limitation and integration obligations. Not automatic qualification. |
| ISO scope line279 and §10 | 2023 validation requirements supersede Part2 requirements excluding informative annexes. | Part2 references remain edition-qualified, never a hidden return to 2006 scoring authority. |
| Part2 §4.3–4.4 lines218–248; Table2 lines298–299; §5.1 lines307–315 | CCF belongs in relevant fault/analysis/documentation work. | Named evidence/analysis and actual common dependencies; no generic fault exclusion. |
| Part2 §9.2.3(j)520–552, §9.2.4(g)556–572, §9.2.5(g)576–592, §9.3 lines594–610 | Validation includes CCF reduction, analysis/inspection and relevant environmental tests; references are to the 2006 Part1 edition. | State the edition boundary. GUI authors declarations, not actual validation or issued activities. |
| Part2 D.2.1–D.2.4 lines932–954 | Conditional electronics/fault-exclusion context. | No blanket separation/IC/well-tried inference from selecting an AnnexF row. |
| Tacchini §3.6.1 lines4600–4643 | Common cause and shared exposures explain why redundancy is not independence. | Useful short engineering explanation; not a second rule system. |
| Tacchini §3.6.2 lines4645–4658 versus §3.6.3 lines4666–4684 | IEC62061 scoring/β mapping is different from the ISO checklist explanation. | Do not port an IEC score or β calculator into this ISO workflow. Native alternative scoring is not implemented; that is not an ISO prohibition. |
| Pinned study Ch3 #ccf lines1321–1385; Ch6 requirements423–470 | Educational CCF score/β relationships. | Explanatory only; do not port its browser arithmetic. Its inclusive Cat2 half-reliability wording is already superseded by ISO's strict boundary. |
| Pinned blueprint §15 lines2428–2484; GUI design226–237,259–263 | Overview → focused question → technical detail → source; navigation is nonmutating; preserve inactive work. | One focused writer, keyboard source help, exact issue navigation, no hidden save/freeze/evaluate. |

## 3. Native contract, not a new evaluator

### Canonical identity map

There are eight rows. `src/engine/choices.mjs:32–42` obtains their **reference** `fullPoints` from the integrity-checked native projection, and adds source catalogue labels/conditions/origins. Task7 may add descriptive question metadata; it must not create a mutable scoring table. Native identities are preserved, not relabelled as new ISO-direct sources.

| Native measure suffix after `TB-CH03-ISO-CCF-` | Native source | ISO context | Proposed question focus |
|---|---|---|---|
| 01 | SC-CH03-246 | F.3.1 | Separation of these paths and common exposures; wiring/piping/physical arrangement support. |
| 02 | SC-CH03-247 | F.3.2 | Actual differing principles/technologies/designs, and remaining common causes. |
| 031 | SC-CH03-248 | F.3.3 protection | Which relevant excessive stresses are prevented/controlled in this application? |
| 032 | SC-CH03-249 | F.3.3 well-tried components | Application-specific basis for the actual components; not a duplicate Task5 qualification award. |
| 04 | SC-CH03-250 | F.3.4 | Analysis of the identified common causes, scope and resulting measures. |
| 05 | SC-CH03-251 | F.3.5 | Competence/training relevant to the design and common-cause risks. |
| 061 | SC-CH03-252 | F.3.6.1 | EMI controls for electrical parts; medium purity for fluidic parts; both when mixed. |
| 062 | SC-CH03-253 | F.3.6.2 | Actual temperature/humidity/shock/vibration/other relevant exposures and supporting tests/controls. |

The measure rows are `book_direct` with Tacchini Table3.19 locators. **SC-CH03-254** supplies full/partial semantics; **SC-CH03-255** supplies threshold interpretation; **SC-CH03-256 is `source_interpretation`**, not `book_direct` or a literal ISO rule, for technologically nonrelevant N/A and no point redistribution. SC-CH06-013 is category context. Show both governing ISO context and literal native provenance; do not forge `SC-ISO-F*` identities.

`vendor/engine/runtime/src/engine/ccf.js:18–37,204–245` owns method identity, threshold, fulfillment/evidence buckets and arithmetic. Only full with native-current resolved evidence is credited. Partial/not_implemented are known-zero; absent/not_assessed and unresolved evidence remain open. Explicit not_applicable is zero and is not automatically in either unmet or undetermined lists; do not render that omission as a proof of applicability or satisfaction. Evidence attachment is not native evidence resolution or physical validation.

Native technology eligibility is **not evaluated by this module**. Source-specific technology prompts are educational/application questions; they cannot assert a native eligibility gate exists. Whole-measure N/A requires an explicit application-specific rationale against the applicable source. F.2's irrelevant fluidic aspect in an electrical-only system does not mean the combined 6.1 measure is inapplicable. Preserve imported N/A values for inspection even when support is questionable; never silently normalize them.

### Persisted carrier and scope

- `editor.nativeInput.iso[role].ccf = {measures, sharedDependencyIds?}`; each row has `{measureId, fulfillment?, rationale?, evidenceIds?}` while editing an incomplete draft. The final **native** schema requires measureId/fulfillment/rationale and evidence for full. Saving partial content must remain possible; check/freeze/evaluate retain their owners.
- `workflowDesign.ccfLinks[] = {id, scope:{role,subsystemId,channelIds,elementIds}, active, measureIds}`. No label, supportState, binding fingerprint, history or draft-question property may be added.
- Native CCF is one payload per role's actual subsystem; its result scope is derived from the graph. The GUI can retain channel/element scopes in links, but **they do not create separate native per-path/per-measure scores**. The current UI creates whole-subsystem links with empty channel/element arrays. Preserve historical nonempty scopes exactly; never narrow or widen them from view focus.
- `ccf.js:247–310` derives functional paths, Cat2 testing/reaction owners and graph shared dependencies. `sharedDependencyIds` acknowledges existing graph dependency identities; it does not create a physical common cause or alter the graph. Do not deduplicate distinct IDs merely because labels match.
- `src/workflow/compile.mjs:79–82` checks active link/native identity uniqueness and ownership; `support-basis.mjs:84–113` and `transitions.mjs:57–85` own withdrawal/archive. Their behavior stays authoritative.
- For Category2, `editor.nativeInput.category2[role].ccf` is a **different** path/activity acceptance carrier. `vv.js:1591–1714` validates actual disjoint paths/evidence, baseline, issued design activity, reviewer and canonical consumed IDs before dedicated scoring. `public/sections/category2/index.mjs` remains its only editor. Task7 adds explanation and exact navigation, not another producer or activity issuer.
- Supplied/component assessment basis is currently workspace-only (`public/pipeline/build.mjs:30–31,48–50`, `workspaceTopicDrafts.assessmentBases`). It is not persisted qualification. Task7 cannot add a format field or infer supplied status from a null category.

### Native outcome / boundary proof

Actual data is at `run.document.result.report.subsystemAssessments[].ccf`, joined by **saved subsystemId and role**, not current array index or role alone. Parent schema inspection corrected a potential scout inference: `ISOSubsystemAssessment` itself has **no role field**. Resolve the role from the saved projection's native subsystem graph, select the report row by subsystemId, and cross-check non-null CCF scope; ambiguous/missing saved ownership is unresolved, never guessed from the live graph. Relevant fields include applicable, method, thresholdPoints, maxPoints, awardedPoints, thresholdMet, assessmentState, passed, scope, per-measure fulfillment/evidenceState/awardedPoints, unmet/undetermined IDs, gates, rules and findings. They are displayed, never reconstructed.

`public/pipeline/measures.mjs:62–64` already lists/loads saved runs and exposes their identity/currentness; `public/core/state.mjs:33` is the server-checked currentness owner. Task7 may use that pattern without refactoring Task6.

A real existing integration test in `test/integration/pipeline-measures.test.mjs:19–21` stops at **Native F-CCF prerequisite remains applicable_open: F-CCF** before dedicated scoring. Therefore a saved blocked run is not evidence that missing evidence/shared-dependency scorer branches ran. Early package7.1 must establish which real API fixture reaches a populated CCF record. Direct scorer and Category2 acceptance witnesses remain separately labelled, never promoted to saved-machine success. If a populated saved CCF result cannot be reached within the frozen supported contract, escalate before promising that acceptance criterion; do not spoof the result or repair native code.

## 4. Actual ordinary-flow walkthrough and gaps

Static route inspected: `public/app.mjs` creates context → `public/pipeline/stages.mjs:26,39–58` mounts Build/CCF → `public/sections/ccf/index.mjs:18–44` renders selected role. Today it renders every generic declaration field, full reference text, then asks for a second set of manual link checkboxes and a “Name explicit CCF scope link” action. This is the target of the proposed change, not the legacy section-only editor.

| Observed code seam | Consequence / planned response |
|---|---|
| Scoped CCF draw key is only role/category (`index.mjs:20`) | Withdrawal/reorder/currentness updates need fresh identity resolution without rebuilding the focused rationale input on every keystroke. Do not fix this by serializing the whole draft into a redraw key. |
| Category-null falls through to redundant-path wording (`:22`) | Add unresolved state; do not call unknown category3/4 or N/A. |
| Local link-selection Set (`:19,28`) is not pending-tracked | Replace compulsory manual link selection with one explicit scoped action. Any remaining staged rebind/input must have stable original-owner custody and explicit per-entry clear. |
| Native `{measureId}` insertion and link creation are separate (`:24,29`) | Proposed adapter creates both structures in one explicit action, no fulfillment/rationale/evidence defaults. |
| Generic full ccf form (`:26`) would overlap a new question editor | Mount one writer per native field. Technical editor mode must dispose ordinary writers first; closed details alone are not disposal. |
| Rebind checks (`:31–38`) already require reconciliation and unique redeclared rows | Preserve all negatives; reuse existing link only after explicit current row/scope review. Never restore archived evidence. |
| Existing generic ISO claims/additional conditions share the topic | Keep accessible in technical disclosure; do not delete or author aggregate claims from CCF answers. |
| App/navigation already supports exact paths/reveal hook | Use `context.revealPipelinePath`, restore prior hook on dispose, resolve identity from current row index at navigation time. No new global routing framework. |
| Read-only result is currently a general diagnostics/CCF JSON detail | Add a CCF-specific scoped view; keep exact technical record accessible, no Task8 report redesign. |

Parent disposition of scout suggestions: use no severity labels as verified runtime bugs; no browser was run. Reject “clear pending on role change” even with a notice: retain original-owner work until explicit discard. Reject generic redraw-on-whole-record changes because it would destroy typing/caret. Reject requiring native/schema changes merely to retain an existing nonempty GUI link scope. Keep Category2's editor in its current topic. Do not treat output coverage metadata as proof a new UI was exercised or rewrite the coverage inventory speculatively.

## 5. Verification ownership and existing limits

Existing helpers: `newProject({workflowVersion:'1.1.0',...})`; `readOnlyChoices()`; `withApp`, `upload`, `completed`; `withBrowserApp`, `clickButton`, `fillField`; `pipelineLibrary`; `executionFixture`; `t13-synthetic` canonical catalogue/table/evidence; `category2Case(context)`. The `scenario()` in pipeline-route-admission is local, not an exported helper.

Legacy `makeDraft()` / default project fixtures may create workflow1.0: never silently migrate them. Adoption legitimately withdraws earlier assertions; author Task7 synthetic declarations **after** adoption and after needed GUI binding review. Freeze explicitly before real evaluations. `mountWithNativeChoices` removes `fullPoints`; do not use it to prove production reference rendering. Legacy `diagnostics-ccf` tests do not prove the ordinary production scope flow. Preserve their assertions while writing full-pipeline tests.

Task6's unchanged legacy frozen-basis-lineage pre-freeze failure, earlier custody gaps, Task5 historical failures and EOF whitespace warning remain recorded; neither planning nor Task7 can label them fixed without new evidence. No full-suite/whole-machine Category2/physical-validation claim is inherited. Native120s/PDF60s and mutable16,777,216-byte quota stay fixed; larger outer command budgets are not runtime limit changes.

## 6. Planning research provenance

Three fresh read-only `scout` children ran in workflow `7f52f530-dcd8-46a4-b695-dda1dc4c9706`; host status reported **deepseek-flash, high** for each. Child IDs: UI `8afb4dfa-a7cb-4e3c-8215-39b9cd8e0704`, native/tests `3fbdc8f2-b842-4b10-b936-f696d8fcf664`, authorities `eb51b617-3004-4551-b922-29e5fc5b4fb7`. They are scouts, not implementation agents or independent reviewers. Parent checked critical citations and wrote the planning documents. Full managed reports remain session-local; identities JSON records their hashes/references, not licensed source extracts.
