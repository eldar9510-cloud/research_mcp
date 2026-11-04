---
{
  "format": 1,
  "metadata": {
    "id": "archived-task6-diagnostics-source-map-and-engineering-rationale-c1d2bfa0",
    "title": "Task6 diagnostics — source map and engineering rationale",
    "question": "What findings, alternatives and limitations does the historical investigation document about Task6 diagnostics — source map and engineering rationale?",
    "scope": "Historical risk-assessment/ISO GUI source and design study: Task6 diagnostics — source map and engineering rationale. Original normative/private-source boundaries, planning status, exact revision references and unresolved questions are retained.",
    "summary": "Source/reasoning and interaction research for Task6 diagnostics — source map and engineering rationale. Distinguishes planned GUI behavior, source meaning and actual implementation; not an adopted method or validated machine result.",
    "researched_at": "2026-10-29",
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
      "Prior inventory classification (not a completion verification): planning only",
      "Private or licensed book/standard/study sources are referenced, not supplied as assets. Publication covers the report analysis only; it does not grant readers access to those sources or relicense them."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:46.700Z"
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
  "sourceDigest": "c1d2bfa0ecafbcb9a87599d7d7f9d6c856ba6156ad877d77729084bc737611a9",
  "proposalRevision": "9cb4c8787940a0614171ab887ae00d116cfb0347deefc1771d50142fe236c60d"
}
---
# Task6 diagnostics — source map and engineering rationale

**Prepared 2026-10-29; planning only.** Read with the [archived implementation plan](../../Archive/docs/superpowers/plans/2026-10-29-task6-annex-e-diagnostics.md). This document distinguishes requirements, explanatory examples, agreed interaction and actual software capability. It does not reproduce the standards' tables or replace the licensed originals.

## 1. Authority and exact sources

1. **ISO13849-1:2023 governs** the ISO assessment: definitions, applicability, Category2/3/4 behaviour, DC/DCavg, evidence and validation. AnnexE is **informative**, explicitly used as a simplified estimation basis by normative §6.1.5. Its examples are not component certifications or automatic credits.
2. **ISO13849-2:2012** supplies referenced fault/validation context. Its AnnexE worked example and E.5.3 FMEA/DCavg discussion are supporting references, not an instruction to copy example faults into a real machine.
3. **Tacchini2023 explains** the mechanism and practical arrangements. Its references include earlier ISO terminology, IEC material and examples. Resolve conflicts against the governing edition; do not promote an explanatory sentence to a universal ISO rule.
4. **Pinned SAFETY_EXT HTML and blueprint** supply the educational dependency/interaction model. They are subordinate, not an evaluator to transplant into this GUI. Use commit `20b0b57f9920d0b74bf63a47525d8f9868aa7910`, not the working tree or floating main.
5. **Agreed GUI design** specifies the actual product interaction: `docs/design/architecture-driven-gui.md` §3.6, §4.3, §4.7 and Category2 journey. ISO does not mandate this screen layout.
6. **Frozen native implementation** defines what this version can execute. An engine restriction is not necessarily an ISO prohibition. Task6 may expose/reuse existing capabilities, not silently extend them.

Exact hashes/local provenance and inspected code identities are also in `docs/handoffs/architecture-gui-task6/planning-source-identities.json`.

| Source | Exact SHA256 |
|---|---|
| ISO13849-1:2023 Markdown extract | `f7b83c526fc07c28b0faf40b9ae5b5b640de40486faa4791d9c72d65897e43e5` |
| Tacchini2023 Markdown extract | `c86babd3cb424d36045a9bb96e815f7d0c56f1de9e6b117ef679143603f09a14` |
| ISO13849-2:2012 Markdown extract | `55c043e5e2aa9646e3f697e07ba32e9def9b1e882f4ba70c969f18aa9df42854` |
| Pinned Chapter3 HTML | `9f409c8b2fbd4f26e30ad5d310fb030f91317d0937ec1859df711de88a3aae0a` |
| Pinned Chapter4 HTML | `43803f5db82793a23224542212046e67709118d2d1c57d1230a46eb4b307543a` |
| Pinned Chapter6 HTML | `2f1df6286028b7a918b248e3cdbd875f3912e9cbf89804bfdd5b1cfe3557f263` |
| Pinned MASTER-PIPELINE-BLUEPRINT.md | `3ec5ceb11e558f9d7a8dc6fb9812e7e0cfcd54342cad5f9bbddd5c00765722bb` |

Line numbers below identify these exact extracted/Git bytes, **not printed page numbers**. The extracts have OCR/layout defects; check the relevant licensed PDF/image when meaning is ambiguous. No standards/book/PDF/image payload is added to the GUI repository by this plan. Source access on another PC must be separately authorized. The earlier Task5 `SOURCES.md` records source provisioning and PDF hashes.

## 2. Referenced requirement-to-behaviour map

| ID | Verified source location | Engineering consequence for Task6 |
|---|---|---|
| I01 | [ISO23 §6.1.5, lines1752–1777][iso-dc] | DC is detected dangerous failure rate divided by total dangerous failure rate. FMEA or AnnexE estimation are supported conceptual bases; DC is considered for Categories2–4. Four bands are not checklist points. |
| I02 | [ISO23 AnnexE.1/TableE.1, lines3358–3367][iso-e-table] | Measures grouped by the **tested** input, logic or output part. Fixed, ranged and application-dependent references must stay distinguishable. Names/conditions precede numerical entry. |
| I03 | [TableE.1 notes2–5 and footnotes(a)/(b), lines3368–3391][iso-e-notes] | Justify ranges by dangerous failures detected; use FMEA where doubt remains. Preserve test-rate limits, process restrictions, combination caveats and logic coverage-area conditions. |
| I04 | [AnnexE examples, lines3393–3401][iso-e-examples] | Part2 AnnexE worked example; ISO/TR24119 masking reference; process detection depends on actual production involvement/resources, not a generic operator checkbox. |
| I05 | [AnnexE.2, lines3402–3412][iso-e-average] | Weight DC by dangerous failure rates/reciprocal MTTFd. Known untested parts remain in the denominator. The DC belongs to the tested part, not the testing device. |
| I06 | [§6.1.3.2.4 Category2, lines1596–1638][iso-cat2] | Test occasions and non-hazardous testing; effective reaction; functional-only DCavg; at least low DC for every functional part; strict testing-channel reliability boundary; separate timing alternatives. |
| I07 | [§§6.1.3.2.5–6, lines1651–1697][iso-cat34] | Category3 fault tolerance/practicable detection and at least low subsystem DC; Category4 high DCavg/high channel reliability and detection-or-fault-accumulation behaviour. A high selected row is not category compliance. |
| I08 | [TableK.1 Note1, line4066][iso-k] | Separate 25:1 conservative numerical case with 1.1 PFH multiplier. Never treat it as the uncorrected ordinary100:1 case. |
| I09 | [§6.1.10, lines1881–1927][iso-faults] | Fault consideration/exclusions are explicit and application-dependent. No auto-exclusion of uncovered dangerous faults to improve a denominator. |
| I10 | [Clause10 validation material, lines2357–2545][iso-validation] | A saved configuration/native result is not executed physical validation or release approval. Reuse real assurance/evidence paths, never mint an activity by ticking a box. |
| P01 | Part2:2012 AnnexE, E.5.3 heading at extractline1497, SF1.0/SF1.3 subsections1499/1530 | Worked FMEA/DCavg validation context. ISO23 itself points here. The planning pass verified the extract identity/locations; it does not claim a new complete validation audit of the example. |
| T01 | [Tacchini §3.3, lines3931–3972][book-dc] | External monitoring may be performed by the logic while coverage belongs to an input/output target; monitor ownership and target ownership are different facts. |
| T02 | [§§3.3.1–3, lines3974–4015][book-estimate] | Bands, reasoned application estimates, safe response and effective test frequency. Teach why detection alone is insufficient without copying every IEC/generalization into an ISO gate. |
| T03 | [§3.3.4/3.3.4.1, lines4017–4044][book-direct] | Direct versus indirect monitoring depends on what is actually observed. A nearby position sensor is not automatically direct; localizing the failed component for maintenance differs from detecting the dangerous channel behaviour. |
| T04 | [§3.3.5, lines4046–4064][book-process] | Process detection example: production involvement, visibly detectable effects and redundancy. Explain the claim rather than assuming every stopped process establishes DC. |
| T05 | [§3.3.6, lines4065–4100][book-tables] | Tables3.6/3.7, conditional rate ceilings and combination note. Preserve the book's provenance when the frozen native row is book-derived. |
| T06 | [§3.3.7, lines4101–4126][book-average] | Weighted average and known untested denominator. Do not use arithmetic averaging or count the testing controller as a tested functional part. |
| T07 | [§6.2.6, lines8167–8205][book-cat2] | OTE reaction, warning limitations and explanation of monitoring-channel reliability; its inclusive half wording is **not** the governing ISO23 comparator. |
| H01 | [Chapter3 `#dc`, lines775–857][html-dc] | Educational sequence: target/faults, credible detection/reaction, reference coverage/conditional rates, then weighted outcomes. The HTML calculator is not to be ported as browser safety arithmetic. |
| H02 | [Chapter4 `#masking`, lines226–244][html-masking] | Series-connected voltage-free interlocks can mask faults; OSSD is a different case. Present applicable limitation/evidence questions, not a newly implemented masking calculator. |
| H03 | [Chapter6, lines216–237][html-cat2] | Distinct periodic, corrected25:1 and on-demand arrangements; proof-test records stay separate. Inclusive half text is overridden by I06. |
| H04 | [Blueprint §9.4, lines780–800][blueprint-dc] | Diagnostic measure links faults/boundary, evidence, timing, initiator, reaction/shared resources and validation. Installed arrangement, not an abstract catalogue label, determines applicability. |
| H05 | [Blueprint §15, lines2428–2480][blueprint-ux] | L0 state/blockers → L1 engineering action → L2 technical detail → L3 sources. One controlled model; checklists do not confer evidence acceptance; every missing item explains object, reason, next action and affected conclusions. |

## 3. Conceptual foundation

### 3.1 What the engineer is claiming

The claim is **not** “this switch has99% DC” or “I selected three diagnostics.” It is: for identified dangerous failures of identified physical/functional parts, this actual arrangement detects the failures under stated operating/test conditions and supports the required response. The analysis, implementation and evidence justify the coverage attributed to those tested parts.

Keep these objects separate:

- **Tested target**: allocated functional element(s), their actual subsystem/channel boundaries and dangerous failure modes.
- **Monitor/actor**: actual device/logic/test equipment performing detection. It may be different from the target and can have shared dependencies.
- **Diagnostic measure**: one named reference method plus its application-specific configuration, not the monitor device's whole identity.
- **Reaction path**: what responds to the detected fault and whether the safe state can be reached/maintained in time.
- **Evidence**: records supporting installation, fault coverage, timings, execution/review, validity and source applicability.
- **Native assessment**: a result of the frozen evaluator on a specific input/source snapshot, separately current or historical.

A logic device monitoring a contactor does not therefore earn input coverage, prove independence from that contactor's common supply, or demonstrate that the contactor actually opened. A mirror/linked contact, wiring/evaluation arrangement, relevant failure modes and reaction have to match the claim. I01–I06, T01–T03 and H04 explain these distinctions.

### 3.2 DC and DCavg: explanation, never browser computation

Conceptually:

`DC = sum(detected dangerous failure rates) / sum(all dangerous failure rates)`

`DCavg = sum(DC_i / MTTFd_i) / sum(1 / MTTFd_i)`

The four ISO bands are none below0.60, low0.60–<0.90, medium0.90–<0.99 and high≥0.99. These are educational reference facts, not client-side evaluation rules. No browser code computes credited DC, caps, DCavg, channel reliability, category or PL.

A purely illustrative weighting example: A has MTTFd100years and DC0.99; B has MTTFd10years and is explicitly known untested. The weighted result is `(0.99/100 + 0/10)/(1/100 + 1/10) = 0.09`, not49.5% and not99%. The less reliable untested part dominates the denominator. If B's coverage/inventory is **unknown**, the GUI may not manufacture this0.09 result by pretending B was explicitly assessed as untested. Real outputs must come from native evaluation.

Category2 adds a separate obligation: an adequate average cannot conceal a functional part below low DC. TE/OTE are not functional denominator contributions merely because they are shown in the diagram. Their reliability and testing/reaction behaviour have separate owners.

### 3.3 Reference estimate, proposal and result are three different things

- **Fixed reference**: show its exact reference and conditions. Do not populate `proposedDCRaw` merely to display it. The native evaluator checks applicability/ownership/evidence/timing before assigning a result.
- **Application-dependent range**: show both bounds; after the actual arrangement/support questions, request a justified exact proposal if the native route requires it. No maximum/default, slider-to-best-value or invented rate ratio.
- **Rate-capped reference**: ask only the matching actual rates/support. Proposed coverage and native-selected cap/credited coverage remain distinct. A cap is an upper limit, not a justified proposal.
- **Catalogued unsupported/legacy selection**: retain source meaning and existing authored data, show the exact runtime limitation, permit intent/history inspection but not a false executable/credited status.

When a native row is sourced to Tacchini Table3.6 or3.7, add the corroborating ISO23 TableE.1 locator separately. Do **not** relabel native `basis`, `rowId`, `origin` or source contribution as though it had always been an ISO-direct row.

### 3.4 Combinations and fault overlap

AnnexE footnote(a) permits justified combinations in principle. It does not prescribe addition or maximum of selected percentages, nor waive covered-fault/independence evidence. The frozen implementation is more specific: it checks unique fault ownership, table/FMEA exclusivity, overlap, reciprocal named independence and a bounded pair structure; it uses its conservative per-element fault projection and weighted native aggregation. The GUI must neither reconstruct this arithmetic nor present these implementation restrictions as universal ISO bans.

A full dangerous-fault inventory is needed to distinguish detected, uncovered and explicitly excluded modes. A list of only the convenient detected faults is not evidence that all other dangerous modes disappeared. Fault exclusion is a separate supported argument, not a DC-boost button. Series-connected interlock fault masking can invalidate a naive direct-monitoring inference; explain the limitation and require the real assessment rather than calculating an unsupported reduction.

### 3.5 Logic-specific coverage is not one generic watchdog checkbox

TableE.1 footnote(b) requires, when medium/high logic DC is claimed, at least one qualifying measure for each of variable memory, invariable memory and processing unit, each with at least60% DC. Other valid measures can exist in the standard. The frozen engine implements a particular supported programmable-electronic scope and emits `F-ISO-DIAGNOSTIC-LOGIC-FOOTNOTE-B` when its native gate is not satisfied.

Show the relevant required areas and existing native outcome; do not award three checkmarks by selecting three rows, infer tested memory from a PLC model name, or reconstruct supplied-unit internals. A native unsupported relay-interlocking row is still a real reference example, not an ISO-invalid technique.

### 3.6 Category2: keep three different rate/timing rules distinct

1. Ordinary Category2 periodic branch: `rd <= 0.01*rt` (equivalent100:1), alongside the other Category2 requirements.
2. Immediate-on-demand alternative: actual demand/test coincidence and total detection+reaction **strictly less** than time to hazard.
3. Separate TableK.1 Note1 conservative case: at least25:1 and the applicable1.1 PFH correction, not an uncorrected100:1 pass.

These are not the same as AnnexE process-detection ratio ceilings or cross-monitoring absolute-rate ceilings. AnnexE process boundaries are **strict** `rt/rd >1`, `>10`, `>100`; the cross-monitoring examples for Categories3/4 use `<1/year`, `>=1/year` and `>=1/month`. No GUI rounding/equality repair, shared rate field that silently overwrites another meaning, or automatic conversion from operating cycles/demand classification.

For Category2, testing must not itself introduce a hazard. Test occasions, OTE reaction and maintained safe state are separate questions. PLr d needs the maintained safe state; up toPLr c warning-only is conditional on impracticability and supporting rationale/evidence, not the default easy route. Testing-channel MTTFd (TE+OTE) must be **greater than half** functional-channel MTTFd; equality fails.

## 4. Explicit source/capability discrepancies

| Observation | Required disposition |
|---|---|
| Tacchini extractline8195 says “not lower than half”; pinned Chapter6 line236 says “at least one-half” | Governing ISO23 line1628 says **greater than**. Use strict `>`; retain lower-source wording as disclosed provenance, not a corrected quote. |
| HTML/Book concise detection-time OR100:1 narrative | Do not copy it as a universal software admission gate. Native table allocation requires a strict time inequality; native Category2 currently also validates all timing fields and strict inequality before selecting its rate branch. Describe this software restriction separately from ISO's alternatives. |
| TableK.1 OCR is malformed around columns | Only the clearly located Note1 wording is used here. No new numerical table reconstruction or interpolation is proposed. |
| General book/process language also discusses IEC/SIL/low demand | The task is the existing ISO route. Do not unlock SIL/PFDavg or convert formal demand classification from a diagnostic test rate. |
| Task3 supplied-unit assessment basis can describe broader ISO-valid engineering than the current engine executes | Explain limitations; don't invent internal components or add whole-unit performance twice. |
| Common I/O diagnostics can be performed by a logic device across a physical boundary | Frozen table/FMEA actors must resolve to permitted native elements or the canonical TE relation. If an actual cross-boundary arrangement has no supported representation, retain the plan and name that missing route; never invent a proxy actor. |

## 5. Frozen-native facts verified for this plan

Code anchors below are relative to the GUI checkout at `0da597e6c0f8dccd8ec2f0550e73b34ee4b84739`; line numbers are baseline locators, not future patch targets.

- `src/engine/choices.mjs:39` currently projects IDs/locators/status/origin/selector family, **not** the row's meaningful `atomicMeaning`, exact value/operator or coverage area. Task6 needs a read-only descriptive projection, not a second numerical registry in the browser.
- Registry `vendor/engine/runtime/data/generated/diagnostic-table-rows.json` has33 entries:9input,15logic and9output including a retained legacy output row. This is not a promise of33 live supported methods.
- `diagnostics.js:180–194`: `SC-CH03-093` is explicitly rejected for live use despite `status:'mapped'`; `SC-ISO-E1-O01` is the corrected distinct Note4 row. **No silent remapping of old saved data.** `SC-ISO-E1-L07` is catalogued but runtime-unsupported.
- `diagnostics.js:105–132,211–235`: absolute selector takes `rtPerYearRaw` and forbids demand rate; process selector requires positive `rdPerYearRaw`. Matching rate authority/evidence and explicit `proposedDCRaw` are required.
- `diagnostics.js:340–397`: actual actor/target ownership; self-monitoring depends on row metadata; detected faults belong to targets; ranged proposals required and bounded; fixed rows reject differing proposals; strict detection+reaction-before-hazard; nonempty evidence and reaction.
- Range caveat text such as “BLOCK unsupported endpoint” does **not** mean every ranged row or endpoint is categorically unsupported. The allocator accepts properly authored proposals within the row's range; full evidence, source, role and other gates still apply. UI status must not be inferred from a prose substring alone.
- `diagnostics.js:418–440,479–570`: exact evidence identity/current status/path/SHA/locator, source/role and duplicate-fault checks. Attaching a file is not acceptance and may lack the exact required source locator.
- `diagnostics.js:575–625`: reciprocal independence, components larger than two unsupported; controlled process/high-target combination conditions.
- `diagnostics.js:654–749`: per-element uncovered-fault projection, conservative minimum across the element's covered/uncovered fault projections, native weighted DCavg and exclusion of actual TE/OTE contributions. No GUI replication.
- `diagnostics.js:446–477,745–759`: native logic footnote(b) coverage-area gate.
- The actual timing owner is `vendor/engine/runtime/src/calculations/category2.js:268–385`. It requires both exact rates and all duration fields even for immediate demand, requires strict time inequality before branch selection, then selects immediate/100:1/25-to100 with correction. UI must not insert zero to satisfy fields it hid.
- `vendor/engine/runtime/src/engine/diagnostics.js:84–90`: diagnostic duration objects require exact string **hours**. Keep units conspicuous. No silent conversion/rounding from seconds, and no native schema change under Task6. Nonrepresentable exact input is a disclosed capability gap, not an excuse for a favourable approximation.
- `src/workflow/compile.mjs:60–78`: table/FMEA conflict, unique configuration link, actual functional target scope and selected/native row consistency.
- `src/workflow/support-basis.mjs`: existing old/new/shared actor/target invalidation and immutable history remain in force. Diagnostic plans do not have the principle/component `supportState` binding contract; do not fabricate a new diagnostic review endpoint.

## 6. Required evidence separation

The implementation plan's tests must separately establish source projection, authored intent, exact configuration, backend admission/invalidation, native result inspection and actual GUI usability. A source citation, green browser test, saved row, current binding, successful native run and physical validation are **not interchangeable evidence**. Old failed attempts, mismatches and unsupported-route findings remain literal.

[iso-dc]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1752-L1777
[iso-e-table]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3358-L3367
[iso-e-notes]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3368-L3391
[iso-e-examples]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3393-L3401
[iso-e-average]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L3402-L3412
[iso-cat2]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1596-L1638
[iso-cat34]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1651-L1697
[iso-k]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L4066
[iso-faults]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L1881-L1927
[iso-validation]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/ISO_13849-1_2023/auto/ISO_13849-1_2023.md#L2357-L2545
[book-dc]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L3931-L3972
[book-estimate]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L3974-L4015
[book-direct]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L4017-L4044
[book-process]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L4046-L4064
[book-tables]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L4065-L4100
[book-average]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L4101-L4126
[book-cat2]: https://github.com/eldar9510-cloud/ubuntu-iso13849/blob/32a86590183983924784a596358f1a6b2d8de45e/reference-sources/Tacchini_2023/auto/Tacchini_2023_Functional_Safety_of_Machinery.md#L8167-L8205
[html-dc]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-3-main-parameters-dependency-atlas.html#L775-L857
[html-masking]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-4-risk-to-safety-function-framework.html#L226-L244
[html-cat2]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/chapter-6-iso-13849-categories-and-pl-evaluation.html#L216-L237
[blueprint-dc]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L780-L800
[blueprint-ux]: https://github.com/eldar9510-cloud/SAFETY_EXT/blob/20b0b57f9920d0b74bf63a47525d8f9868aa7910/MASTER-PIPELINE-BLUEPRINT.md#L2428-L2480
