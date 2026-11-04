---
{
  "format": 1,
  "metadata": {
    "id": "archived-openconformity-concrete-integration-seams-not-another-assessment-engine-d84493da",
    "title": "OpenConformity: concrete integration seams, not another assessment engine",
    "question": "What findings, alternatives and limitations does the historical investigation document about OpenConformity: concrete integration seams, not another assessment engine?",
    "scope": "Original Pi/tooling integration investigation: OpenConformity: concrete integration seams, not another assessment engine. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of OpenConformity: concrete integration seams, not another assessment engine; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi research bundle",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:37.077Z"
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
  "sourceDigest": "d84493da84058fabf0a71421d91d40ee5bc811772a8fdc4deb283ec69f7ec2cd",
  "proposalRevision": "3ba2576e42cb84adf8ed3260aed3d4fb599e297a84845fef65b7ea2645eb3fbd"
}
---
# OpenConformity: concrete integration seams, not another assessment engine

## Scope and recommendation

**Prefer independently implementing a small derived relationship/handoff view in our existing HTML. Do not integrate the external application now.** OpenConformity supplies useful presentation patterns and a portable project format, but no public agent service, evidence-authority mechanism or revision contract that improves our maintained engine. One-way interoperability is technically plausible only if an actual recipient needs its editor.

Inspected public snapshot: `/tmp/pi-github-repos/omxnt/openconformity`, commit **`01cc2783961ce181f537f9ef7f48e051546d434c`**, confirmed with read-only `git rev-parse HEAD`. All upstream links below are pinned to that commit. `O/` means that root; `R/` means `/media/eldar/disk_2/risk_assessment`. R references describe working files observed during this investigation, not immutable HEAD or the concurrently changing project's final state. The newest plan/handoff tops were read; their historical test counts are not current verification evidence.

Research was static and read-only except this report. Project-local QMD keyword discovery ran first; `qmd status` confirmed `.qmd/index.sqlite`, and a returned owner-interface passage was retrieved with `qmd get`. No index changes. Prior reviews supplied leads, not implementation proof. No normative interpretation, rule adoption or real-machine engineering is attempted. This synthetic example describes a possible record projection, not valid executable assessment input or a design recommendation.

## 1. What actually happens end to end

### Model and validation

`createModel()` produces `{name, attributes, nodes: Map, relationships: Map, counters}`. An `Entity` has `id`, `kind`, `type`, `parent`, and a string-valued attribute bag. A `Relationship` is only `{type,source,target}`: it has no evidence, state, revision or author. Filing parentage is separate from engineering composition. Eighteen entity codes and 44 relationship kinds are declared, including six ownership compositions. `addEntity()` issues IDs such as `SCN-001`; `updateEntity()` replaces attributes and deletes empty values. `canRelate()` checks endpoint types, duplicate triples, single ownership and composition cycles; `relate()` writes the triple. These are structural, not engineering-truth checks. See O/`app/modules/model.js:19–56,258–280,375–385,564–611` and [metamodel declarations][model].

The important path is:

```text
ELM exhibits HAZ contributes-to SCN
ACT performs TSK gives-rise-to SCN; ACT exposed-in SCN
TSK occurs-during PHS
PRM reduces-risk-of SCN; SAF realises PRM; SAF allocated-to ELM
REQ expresses SAF (or PRM); VER verifies REQ
```

There is **no direct VER→SAF relationship** and no first-class cause or evidence entity. Verification reaches a function through a requirement. `satisfies`, `verifies` and `eliminates` are authored links/assertions, not earned states.

JSON loading runs `openProject(text)` → `JSON.parse` → `loadProject/gates` → version-specific `validate` → migration chain → `buildModel` replay through `addFolder`, `addEntity`, `relate`, `restoreCounters`. Version 1 is current and `MIGRATIONS` is empty. Validation checks string attribute values, IDs, resolving parents/endpoints, unique triples/order, counters and acyclic ownership/filing. It does not require an adequate scenario or validate the meaning of prose. See O/`app/modules/files.js:24–40,151–265` [file gates][files], and O/`app/modules/validator.js:264–436` [validation][validator].

### Human editing and mutation authority

The application wires browser storage and DOM panes in `app.js`. Editing flows call model functions inside `store.commit`; successful commits record history, queue persistence and notify views. Refused operations restore the history-held model. `updateEntity` itself does not know whether text is approved or supported. Authority is essentially the person operating the local project, not an owner-confirmed assessment protocol. The loader also installs imported project attributes directly; the architecture's “one mutation module” slogan is not an authorization/security capability. Evidence: O/`app/modules/app.js:5–24`, `flows.js:248–260`, `store.js:548–576` [commit implementation][commit].

### Derived views

`buildRiskView(model)` enumerates SCNs in identifier order. Each row reads event, consequence, directly related hazards/actors/tasks, rating parameters plus rationales, **currently linked** PRMs, residual rating, evaluation and notes. Phase membership follows `SCN ← TSK → PHS`, not filing or ELM phase relations. A scenario can occur in multiple phase tabs; all phases get tabs, including empty ones; unmatched scenarios get “No phase.” Counts are navigation, not coverage judgments. The function returns descriptions of sections/tables/cells, not another persisted graph. Evidence: O/`app/modules/view-risk.js:67–176` [risk builder][riskview].

`buildSafetyView(model)` orders SAF compositions depth-first, then creates numbered function blocks and a tabular register. Its relationships are only parent/child functions, realised measures, allocation and expressing requirements. It does **not** traverse to scenario causes, evidence or VER results. Behaviour, characteristics and fault fields are displayed from the SAF itself. This is a useful specification presentation, not multidisciplinary reasoning or verification orchestration. Evidence: O/`app/modules/view-safety.js:29–167` [safety builder][safetyview].

SAF fields include `operatingMode`, `trigger`, `reaction`, `safeState`, `restart`, `muting`, `interfaces`, `responseTime`, `stoppingTime`, `technology`, fault reaction/recovery and power disturbance text. Required PL/SIL is a selected value under a selected standard, not a calculation. PRM is much simpler: designation/title, hierarchy `step`, `kind`, description, drawing and notes. VER contains setup/procedure/acceptance criteria and a `runs` table of date/by/Passed-or-Failed/remarks. These are editable assertions. See O/`app/modules/attributes.js:381–480,549–595` [protective/function fields][saffields], [verification fields][verfields].

### Revisit detection: the decisive limitation

When an estimation/elimination field group is changed, `editor.recordFrom()` captures linked PRM IDs in a semicolon-separated `measures` attribute. `recordedStates()` compares saved membership with live membership, identifying linked, unlinked, deleted and added IDs; `findings()` reports non-linked states for written records. It does not compare content hashes or evidence/configuration revisions. Evidence: O/`app/modules/editor.js:109–125`; `records.js:28–68,107–119` [membership algorithm][records].

**Changing PRM-001's description while keeping its ID and links is invisible to this detector.** `buildRiskView` still displays the live PRM alongside retained residual values and does not include these findings. Even membership warnings are therefore not exported as invalidated conclusions. This is a direct static consequence of the two algorithms, not a reproduced runtime defect. Our revision and credit machinery must remain authoritative.

### Files and document generation

`toFileObject/serialise` writes the format marker `openconformity-project`, schema version, name/project attributes, counters, folders, entities and relationship triples. `openProjectFlow` reads a whole selected file, loads it and handles notices/hidden choices; `saveProjectFlow` ultimately downloads `serialise(store.model())`. See O/`app/modules/files.js:57–110`, `flows.js:991–1069,1147–1168` [serialization][serialise].

View exports rebuild from the current model. `saveExcel()` calls `savedPart` → `viewSheets` → `workbook` → browser download. Risk supports Excel only. Safety supports Markdown and Excel: the workbook uses the register (whole view takes its first/all-functions register); Markdown uses numbered blocks and packages diagrams alongside it in ZIP when present. `sectionMarkdown()` and `viewSheets()` flatten entity references to export text. XLSX cells are literal `inlineStr`; values beyond 32,767 characters are visibly cut. Exporting is not a review signature, and the selection of fields is lossy. Evidence: O/`app/modules/views.js:98–164,383–405` [projection/export][exports], O/`app/modules/xlsx.js:93–145` [cell writer][xlsx].

## 2. Three seams compared against our actual application

| Seam | Independently apply the idea | One-way interoperability | Run external app |
|---|---|---|---|
| **Scenario/evidence neighbourhood** | Highest value: derive phase/task → scenario → cause → alternatives → evidence/open work as linked HTML from maintained records. No new graph store. | OC can carry task/scenario/measure links, but causes/evidence become prose, weakening usefulness. | Adds human relationship editing; risks a competing record and stale displayed conclusions. |
| **Cross-discipline protective-function handoff** | Present existing required behaviour and external dependencies together, separating mechanical physical effect from controls response. | SAF fields can provide recipient-friendly specification text; REQ/VER can represent planned checks. Status/provenance need explicit repeated labels. | Useful only when collaborators already use OC; it displays shared inputs/results, but does not perform collaboration or qualify returns. |
| **Optional portable review export** | Existing HTML first; independently generate a small Markdown/table only for a demonstrated recipient need. | Disposable V1 JSON projection is feasible; medium maintenance cost and explicit loss ledger. | Manual opening and onward export add steps without improving evidence authority. |

Our `basis.assess()` already normalizes records, applies revision/review handling and returns records/questions/HTML (`R/risk_assessment/basis.py:53–222`). `scenarios.py:71–103` already carries activity/person/origin refs, cause IDs, outcomes and uncertainty. `protective_options.py:14–17,175–218,225–240` already supplies cause-linked alternatives, required behaviour, verification needs and external functional-safety requests. `reduction.py:751–897` already binds requests to scenarios/measures/configuration, preserves outstanding returns and checks separate return evidence. No new domain schema is justified by OC's display fields.

**Adds value:** compact traversal, phase organization and a recognizable handoff layout. **Already exists:** our evidence-linked claims, alternatives, external requests, current/conditional separation, revision reopening and navigable report. **Does not solve:** scenario discovery, specialist reasoning, approved role contexts, normative retrieval, actual implementation/verification, owner adoption or competent human review. Optional integration must not become a new #21 readiness gate (`R/docs/plans/issue-21.md:3–43`).

## 3. One synthetic worked mapping, including same-ID drift

Assume fictional assessment `DEMO`, revision A, configuration `CFG-A`. An imagined maintenance actor removes a sample carrier while an imaginary slide could move. All statements are draft assumptions supported only by fictional note `EV-NOTE-A`, not observed machine facts. Cause `CAUSE-1` is “movement could resume while the person remains in the access space.” Alternative `OPT-1` proposes rearranging the task to avoid that access; `OPT-2` proposes a protective-function arrangement. Neither is selected, installed or verified.

For OPT-2, the **illustrative requested behaviour**, not an engineering prescription, is: on access request, reach and retain the specified non-hazardous physical condition before access; prevent unintended motion during the task; require a separately specified deliberate restart sequence. Mechanical review must define restraint/physical-state evidence; controls review must define detection, reaction, interfaces and restart. Timing, fault performance and adequacy are unknown. No numerical factors, residual score or PL/SIL are invented.

| Our source fields/records | OC target, if a recipient really needs it |
|---|---|
| `lifecycle[].modes[].human_actions`, scenario `activity_refs`, `person_refs` | PHS-001/TSK-001/ACT-001 with `reference` preserving source IDs; `tsk-occurs-during-phs`, `act-performs-tsk`, `tsk-gives-rise-to-scn`, `act-exposed-in-scn`. |
| Scenario `hazard`, `hazardous_event`, `outcomes[].harm`, `causes[].description`, `uncertainty` | HAZ-001 description; SCN-001 `hazardousEvent`/`consequence`; cause ID/text and uncertainty explicitly in SCN `notes`. No invented cause entity. |
| Comparison `options[].ref/cause_refs/intended_effect/required_behaviour/verification_needs` | PRM-001/002 `reference`, `description`, `notes`; `prm-reduces-risk-of-scn`. Mark both **alternative, proposed, unverified**; the link alone cannot distinguish choice or causal coverage. |
| OPT-2 `required_behaviour.value`, external `functional_safety_requests` | SAF-001 `trigger/reaction/safeState/restart/interfaces`, realised PRM-002 and allocated ELM-001; unknown fields say “unresolved,” no PL/SIL values. |
| Required behaviour and planned missing verification | REQ-001 `description`, `verificationMethod` only if actually specified; `req-expresses-saf`; VER-001 `setup/description/acceptanceCriteria/notes`, `ver-verifies-req`; **no fabricated run**. |
| Claim `state/evidence_refs`, evidence locators, request `returned.status`, questions | Repeat state, EV-NOTE-A locator/support limitation and missing verification in relevant notes/description. No OC evidence relation exists. Keep the authoritative evidence and questions in our report. |

Exact field basis: R/`risk_assessment/scenarios.py:71–103`, `risk_assessment/protective_options.py:14–17,191–218,225–240`, `risk_assessment/reduction.py:776–817,854–897`; OC fields and relationship IDs are in [model][model], [function fields][saffields] and [verification][verfields].

Set OC `estimationMethod` to empty and omit numerical rating inputs. Leave `initialRating/residualRating` empty rather than pretending our current/conditional distinction equals OC's initial/residual pair. Put “current conclusion unresolved; proposed behaviour not achieved; conditional investigation, if any, remains in authoritative report” in `evaluation/notes`. Our engine already keeps `classification` distinct from `conditional_classification` (`R/risk_assessment/hazards.py:293–387`; `risk_evaluation.py:210–245`).

Now revision B changes OPT-2/M-2's restart behaviour **under the same ID**. Our supported change path must identify the changed protection and exact revision; `revision._affected_findings/_reopen` propagates and withholds classification, conditional values, adequacy and credit, retaining prior values (`R/risk_assessment/revision.py:295–453`). Regenerate a separate B projection. Never patch the prior OC file or trust its membership badge. Put assessment/revision/configuration and source identity in project designation/version/description and affected entity notes; retain A alongside B, optionally with an exporter-produced source-file digest. These are trace labels/drift aids, not signatures or immutable OC audit records.

Losses are material: typed cause/evidence/support relationships, multiple independently identified outcomes, conditional-versus-current protection semantics, owner-choice receipts, revision dependencies and baseline/fork provenance do not survive as native OC concepts. Text can preserve disclosure, not machine-checkable meaning. Therefore no reverse adoption, credit update or round-trip claim is defensible.

## 4. Can native Mastra call it?

**Not through an existing public service.** This snapshot is a static browser editor, not an HTTP/MCP agent server or supported SDK. Actual application entry requires `window`, IndexedDB, local/session storage and DOM (`O/app/modules/app.js:21–24`). Lower-level exported functions are genuinely callable program components: `openProject/loadProject`, `buildRiskView`, `buildSafetyView`, `workbook`, `markdown`. Tests import builders directly, with `tests/shim.js` loaded first (`O/tests/test-views.js:9–18`). That establishes internal testability, not a supported integration API or permission to import UI modules into Mastra.

A future native Mastra application tool could independently read the **Python-produced projection** and return a bounded relationship summary. It needs no OC process, model calls or browser automation. Our existing bounded Python bridge is in `R/mastra/src/start.ts:30–44`. That is an application seam; global Pi workers are unrelated. Role access must stay task-scoped, with standards material routed exclusively through the standards role. No new baseline learning or direct source access follows from exportability.

If an owner insists on OC, hand them a generated file for manual local opening. Keep OC edits disposable annotations, return comments through our controlled owner interface, and regenerate rather than synchronize. Static hosting requires separate deployment/recipient approval; served JavaScript can access its origin's browser-retained project. Optional drawing editing creates a consented external iframe and sends drawing messages (`O/app/modules/drawing-editor.js:354–395` [drawing boundary][drawing]); do not use that route with private material by default. No deployment or disclosure behaviour was exercised here.

## 5. Smallest worthwhile future experiment and no-go imports

**One owner-reviewed, synthetic HTML specimen**, independently implemented only after authorization: one scenario neighbourhood and one mechanical/controls handoff block using existing records/anchors. Low-to-medium scope, likely a bounded report-rendering change rather than a service. Keep the OC JSON adapter deferred: medium scope for field mapping, loss documentation, format/version tests and recipient support, with little benefit absent a concrete external user. Running/maintaining a separate editor has the highest ongoing ownership cost.

Acceptance checks:

1. Every displayed relation resolves to our existing record/ref; no secondary persisted graph/schema.
2. Actor/task/phase and cause-linked alternatives are visible; unmapped work is not “examined and safe.”
3. Required physical effect, controls behaviour, unknowns and missing verification remain separate. No inferred timing or PL/SIL.
4. Proposed/adopted/implemented/verified/human-reviewed states are distinct; specification evidence receives no implementation credit.
5. An engine-supported same-ID content change reopens dependent conclusions; historical/current and conditional/current remain explicit.
6. Revision/configuration and evidence locators survive the specimen. Literal hostile text and oversized output cannot hide status or silently truncate decisive evidence.
7. Owner finds the specimen materially clearer than existing HTML; otherwise stop with no integration.

Licence: first-party software is EUPL-1.2. Its definition of communication includes access to essential functionality; source, notices and derivative-work obligations merit legal review before copying modules, translating writers or serving a modified app (O/`LICENSE:17–56,84–139` [licence][license]). Independently describing/mapping an interface without copying expressive implementation is a different proposal, not a blanket legal exemption. Assets/content have separate provenance; the FMV checklist is described only as “carried with permission” (`O/app/modules/about.js:64–89`). This is not legal advice.

**No-go imports:** upstream source/project, calculators/risk bands, bundled normative/checklist content, UI approval semantics, same-membership revisit logic, PL/SIL engines, dashboard, parallel graph store or two-way editor. Keep invalidation, protection credit and maintained records in Python. This report authorizes none of those changes.

## Checks and limitations

Verified all 14 immutable citation paths/ranges and report presence locally. No code/tests/hooks/build/install, browser/server, third-party execution, external API/MCP/auth/model calls, network fetch, credential inspection, git mutation or delegation. No own-project suites rerun. No runtime import/export compatibility, viewer behaviour, deployment controls, performance or licensing conclusion is claimed. Parent review and an owner need decision come before any experiment.

[model]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/metamodel.js#L36-L139
[files]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/files.js#L151-L265
[validator]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/validator.js#L264-L436
[commit]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/store.js#L548-L576
[riskview]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/view-risk.js#L67-L176
[safetyview]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/view-safety.js#L29-L167
[saffields]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/attributes.js#L381-L480
[verfields]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/attributes.js#L549-L595
[records]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/records.js#L28-L119
[serialise]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/files.js#L57-L110
[exports]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/views.js#L383-L405
[xlsx]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/xlsx.js#L93-L145
[drawing]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/app/modules/drawing-editor.js#L354-L395
[license]: https://github.com/omxnt/openconformity/blob/01cc2783961ce181f537f9ef7f48e051546d434c/LICENSE#L17-L139
