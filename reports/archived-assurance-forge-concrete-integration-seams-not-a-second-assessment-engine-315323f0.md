---
{
  "format": 1,
  "metadata": {
    "id": "archived-assurance-forge-concrete-integration-seams-not-a-second-assessment-engine-315323f0",
    "title": "Assurance Forge: concrete integration seams, not a second assessment engine",
    "question": "What findings, alternatives and limitations does the historical investigation document about Assurance Forge: concrete integration seams, not a second assessment engine?",
    "scope": "Original Pi/tooling integration investigation: Assurance Forge: concrete integration seams, not a second assessment engine. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Assurance Forge: concrete integration seams, not a second assessment engine; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:36.931Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "315323f0053f414d14a8f69aa50abe9c781b6bccbbd10e676e2b0c0ca467839c",
  "proposalRevision": "190c127b42738344b9c545d3752225cc6ecd49eb26cb0604cfbe685ca01ecc4f"
}
---
# Assurance Forge: concrete integration seams, not a second assessment engine

## Decision and inspection boundary

**Recommendation: no live integration now.** The worthwhile small experiment is a **derived support/limitation block in existing HTML**, not adoption of Assurance Forge (AF). Optional one-way SACM interchange becomes worthwhile only if an actual reviewer needs its argument canvas. Neither option belongs on the native engineering integration critical path.

Inspected **2026-10-24 UTC**, upstream `/tmp/pi-github-repos/lasrod/assurance-forge`, exact Git HEAD **`6a73390210ef32c03b7b435552c7af3033a59720`**. All upstream links below pin that SHA; no statement concerns newer HEAD. `AF/` means that root; `RA/` means `/media/eldar/disk_2/risk_assessment`. RA citations refer to the concurrently changing working tree observed during this inspection, not an immutable release. Newest plan/handoff tops were read; their historical test counts are not current verification.

Read applicable global/project/upstream instructions, glossary, baseline ADR, requested specification and owner-update documentation. Project-local QMD keyword discovery and `qmd get` preceded source mapping; `qmd status` confirmed the project-local index. Prior research/comparison were leads, checked against code. All project/upstream files remained read-only. No network, install, configure/build/test/hook, third-party executable, server, model/MCP/auth call, credential inspection, Git mutation or delegation occurred. Only this report was written. This is static architecture research, not machinery/source-rule interpretation or runtime validation.

## 1. What actually executes

### Association: a derived pair, not an evidence verifier

`DeriveCseLinks(AssuranceCase)` scans only `assertedevidence` elements, resolves **both endpoint sets** by element type, forms the Cartesian product of Claim × Artifact/ArtifactReference/Expression, sorts/deduplicates pairs, and retains the lexicographically smallest relationship ID when duplicate relationships express one pair. `MakeCseId` is `CSE:<claim>-><evidence>`. Multi-end relationships set `shares_relationship`; all their rows share one assessment. This is neither transitive argument traversal nor semantic support checking. [A1]

`RebuildRegisterRows` joins those pairs to projected `cse_assessment`, falling back to legacy project-side metadata. The UI edits claim/evidence/case owners, claim criteria, evidence criteria, status and notes. Its status choices are **Not Assessed / Adequately Supported / Insufficiently Supported**, supplied judgments, not computed findings. `SetCseAttributeCommand::Apply` uses the library seam; the draft `Applier::ApplySetCseAttribute` reaches the same `apply_set_cse_attribute`, writing `assuranceForge.cse.*` TaggedValues on **AssertedEvidence**, not on a unique pair object. [A2]

ArtifactReference is the visible evidence node. `apply_set_evidence_attribute` finds/creates its cited Artifact: version/date become Artifact provenance, notes its Description, owner/type/maturity/controlled-environment become tags. Location uses a cited Resource. These are recorded assertions/locators, not content authentication or same-configuration applicability checks. [A3]

**Important integration trap:** `DeriveCseLinks` does not inspect `is_counter`; `CseLink` has no polarity field. Thus a counter-evidence AssertedEvidence directly joining a Claim can derive a CSE row just like support. Conversely a challenge targeting a relationship has no Claim endpoint and need not appear there. This follows from the complete derivation loop, not a reproduced GUI defect. Never use that register as an unsigned support API. Duplicate-pair selection can also hide relationship-specific distinctions. Our projection must retain **relationship identity, polarity and scope**, independently of AF's convenient row identity. [A1]

Free-text criteria do not provide the missing domain contract: the SCCG package builder explicitly marks **EVIDENCE_BASIS** unavailable (criteria/coverage/thresholds/scenario/configuration/limitations package), and **STANDARD_LINKS** unavailable. This concerns its structured review input, not inability to type criteria into CSE cells. [A4]

### Challenge, draft and change paths

`apply_challenge` creates a counter Claim + AssertedInference, or counter ArtifactReference + AssertedEvidence, with `is_counter=true`. The target can itself be a relationship; the owning ArgumentPackage supplies containment. The exporter separately projects these as Challenges rather than SupportedBy. Challenge resolution, in-doubt model state and defeat propagation remain planned: a challenge is not automatically a successful defeater, and its absence proves nothing. [A5]

The primary library owns editable SACM. First unaccepted mutation calls `EnsureDraft`, cloning accepted SACM into a separate library document. `StageOntoDraftDocument` applies operations and provenance together; refusal leaves the batch unapplied. It then advances revision, saves draft, and records the contribution ledger. **Persistence/ledger failures after application become warnings**, so “applied” is not necessarily durable. The app projects that draft for humans and connected clients; accepted XML remains separate. [A6]

`AcceptDraftDocument` accepts the **whole changed document**, calls `AcceptInto`, then records its attributed audit transaction and clears workspace state. Audit failure does not roll back the accepted file. Legacy dependency-aware selective operation promotion exists but is not the document-backed workflow. Upstream labels integrated drafts/selection/recovery prototype. Accepting text is editing acceptance, never owner adoption of a machine modification, implementation, verified effect or competent human review. [A7]

Two staleness mechanisms matter: MCP writes compare working revision and session context generation; review proposals compare the semantic hash of their inspected element scope. Audit baseline metadata pins transaction sequence/canonical model hash. None is machinery dependency revalidation. Saved-document recovery explicitly ignores its supplied accepted-document parameter and restores the saved draft; external accepted-file drift during recovery remains a future verification question, not a proven overwrite incident. [A8]

### Navigation and real interface boundaries

CSE/evidence registers locate evidence on the canvas; evidence rows expose their using claims and recorded locations. `BuildGsnProjection` → `LayoutGsnSvgDiagram` → `GenerateGsnSvg` → `ExportCurrentSafetyCaseToGsnSvg` is a **separate export pipeline**, not a canvas screenshot. SVG gives nodes IDs and evidence hyperlinks, including escaped titles; unsafe schemes are dropped on export, relative paths rebased, absolute paths converted to `file:` URLs. That still exposes local paths and does not guarantee recipient portability. It does not export our review/owner-update semantics as a report. [A9]

| Existing boundary | Actual use and stability limit |
|---|---|
| `libs/sacm/include/sacm/io/xmi.h` | Public C++ `load_xmi_{file,string}` / `save_xmi_{file,string}`, Document/commands/validation/compare; library independent of app, private pugixml. Tolerant load, strict save by default; strict save can refuse compatibility-only content. Real reusable boundary, **not a demonstrated stable ABI or Python/TS binding**. Namespace pin is a project choice. [A10] |
| `src/export/*.h` | Callable in-process C++ projection/layout/SVG interfaces, dependent on AF parser/core types. No exported SVG MCP tool or general rendering service in the inspected registry. Reusing it entails AF-specific build/link work. [A9, A11] |
| `assurance-forge-mcp` | Implemented stdio JSON-RPC executable; shared `agent` operations; connected GUI bridge or read-only accepted-file mode. Not an RA adapter and not HTTP/SaaS. [A11] |

The desktop uses C++23, ImGui/HelloImGui and native platform dependencies; root CMake also configures JSON, curl and SCCG catalog copying. The snapshot's external submodule directories do not supply initialized dependencies/catalog content. Do not configure it casually: build setup includes fetching and hooks. Public library separation does not make the entire application embeddable. Prototype labels and missing packages are material, not grounds to dismiss implemented editing/navigation. [A12]

## 2. Highest-value seams for our application

| Seam | Independent implementation | One-way external interoperability | Live AF integration |
|---|---|---|---|
| **1. Finding-local support/challenge explanation** | **Best value, low complexity:** derive existing claim/evidence/question/option relationships into current HTML. No copied code, database or new approval state. | Exporting the same subset buys graph navigation only; medium mapping/packaging cost. | High relative complexity, duplicate mutable argument; no extra machinery reasoning. **Do not do now.** |
| **2. Disposable argument-view exchange** | A tiny static illustration may suffice; avoid building another canvas. | **Conditional value, medium complexity:** RA records → versioned SACM + mapping manifest → external viewer; optional SVG returned as a labelled presentation artifact. No reimport. | Concurrency/authority/recovery burden outweighs read-only viewing. Avoid bidirectional sync. |
| **3. Agent structural inspection/rehearsal** | Existing record projections/validators are closer to leader needs. | Future offline MCP can inspect exported SACM and rehearse `check_operations`; useful only for a real argument-editing task. | Implemented tool calls, but would require an approved adapter, GUI for writes, consent and interpretation of AF findings. **No unique domain capability justifying this now.** |

The delta must be modest. RA already renders claim-specific quotations and explicitly labels them “not automatic semantic verification”: `intake.py:370–387`, called by `basis.py:634–643`. Evidence anchors, scenario links, protective alternatives, questions, review and revision sections already exist (`basis.py:684–773`; `hazards.py:445–479`). The gap worth testing is **joining support scope, limitation and resolving question beside a conclusion**, not claiming evidence navigation is wholly missing.

Existing `revision._affected_findings` follows action/protection/source/evidence dependencies; `_reopen` withholds current and conditional classification and nested adequacy/credit (`revision.py:295–372,394–454`). `protective_options.validate` requires drafted statements, same configuration/scenario, cause-linked options, attributed criteria and conditional recommendations (`protective_options.py:124–217`). Do not reconstruct those rules in a graph viewer.

## 3. One synthetic mapping, including loss and staleness

**Illustration only, not runnable fixture or engineering advice.** Fictional conclusion C0: “Intervention near moving fixture is adequately protected” remains **unresolved**. No factors, calculation or technical selection criterion is introduced.

| Synthetic RA maintained meaning/field | Proposed AF projection | What must not be inferred |
|---|---|---|
| `machine.configuration` claim ref `CFG-A`; scenario `SC-X`, activity and cause refs | Context Claim/ArtifactReference, AssertedContext; RA IDs in manifest | Context attachment does not enforce configuration applicability. |
| Evidence `EV-D` (`ref,title,kind,locator`): fictional drawing A depicts enclosure; claim C1 `{value,state,evidence_refs:[EV-D]}` concerns depicted layout only | ArtifactReference D + cited Resource; AssertedEvidence D→Claim C1; optional Artifact version A | Drawing does not evidence installation or stopping behaviour. Identification is not confirmation. |
| Evidence `EV-O`: fictional owner observation supports **different** claim C2, “intervention occurs in service mode,” not C0 | ArtifactReference O→Claim C2 through its **own** AssertedEvidence | Do not cross-product both artifacts against both claims. No direct evidence edge to C0. |
| Estimate/finding for `SC-X`: `configuration_ref=CFG-A`, `adequacy_evaluation.decision=unresolved`; any conditional result remains separately conditional | C0 explicitly says **UNRESOLVED, CFG-A**; optional ArgumentReasoning + inferred subclaims C1/C2, not a sufficient-proof assertion | Connected subclaims cannot close adequacy. Avoid portraying unknown as false or zero. |
| Question Q-X: limitation “no same-configuration intervention/protection evidence”; `affected_decision`, `acceptable_evidence` | Counter Claim L with counter AssertedInference targeting the claimed inference; text includes open question/RA anchor | No AF field automatically enforces our question-resolution gate or propagates doubt. |
| Option `OPT-X` within protective comparison: drafted `intended_effect`, `required_behaviour`, `limitations`, `verification_needs`; recommendation conditional; no owner choice | Separate **PROPOSED / NOT IMPLEMENTED / NOT VERIFIED** Claim, not evidence of achieved reduction | Option is not `measures` verification, owner choice or credit. A complete comparison would require alternatives; this row maps one option, not a valid full input. |
| Revision B changes configuration/action; dependent finding has `revision_state=reopened`, `prior_*`, current conclusion withheld | Regenerate export B; C0 labelled **REOPENED, CFG-B**, historic A separately identified; manifest pins revision and omissions | AF does not infer machinery staleness from drawing version or accepted text. Old SVG must remain visibly historical. |

Minimal proposed graph: `D→C1`, `O→C2`; C1/C2 inform an explicitly incomplete argument toward C0; L challenges that inference; OPT-X is a prospective branch. Distinct edges avoid shared-assessment leakage. `basis.py:250–348` supplies actual evidence/claim shapes; `hazards.py:288–289,379–393` supplies configuration/adequacy; `protective_options.py:12–17,181–215` supplies option semantics.

Not natively portable: RA fork/baseline provenance, conditional-versus-supported calculation, evidence-authority gates, owner receipts, causal reopening and separate implementation/verification/review. Encode readable labels plus an explicit **loss manifest**, not an invented normative SACM extension. AF UI text is a projection; RA records and original HTML remain the resolving authority.

## 4. Could the native leader/specialists actually use AF?

**Technically yes, architecturally not yet connected.** Real MCP reads include overview/find/get/tree/terms/claim points/placement; `get_element` returns endpoint refs, counter flag, CSE assessment and evidence metadata. `check_operations` rehearses on a copy even offline. Connected `begin_change_group` → `stage_operations` → `submit_change_group` proposes AF edits; **no accept/promote tool exists**. Session ownership restricts groups, not semantic ownership of every target element. Revision/context guards prevent stale writes, not unauthorized machinery conclusions. [A11, A8]

A native Mastra tool adapter could launch stdio and validate selected responses; it is **future code**, not supplied by AF. Prefer leader-only structural reads of an explicitly exported subset. Domain specialists should receive bounded projections; only standards may retrieve/interpret reference material. AF's `authoring_guidance` and public SCCG resources/prompts are additional third-party instructions, not approved machinery methodology; do not wire their standards-oriented prompts to every role. AF consent alone cannot enforce our standards-role or recipient boundaries.

Offline use needs an installed/built MCP executable, readable exported SACM and enabled MCP setting; connected proposals additionally need a running desktop/project, local bridge and in-app per-session grant. Local IPC uses user-private named pipe/Unix socket and token; no cloud AF account is required. External client's inference/auth/billing remains its responsibility. Our selected Astra6/high–Sol6.1/medium subscription route is not verified by AF support. Built-in SCCG review instead loads an API key and posts to OpenAI Responses; it is a separate billed-provider path, not our selected subscription integration. [A11, A13]

Disclosure follows content: exporting to local disk is not itself model disclosure, but letting a client read/transmit that export is. Send only authorized task material, no corpus, credentials or raw histories. Transfer results as non-authoritative advisory text/IDs; leader may propose changes through **existing RA validators**. Never import an accepted SACM file as owner confirmation.

Current observed `mastra/src/start.ts:73–111` has reviewed-scenario dispatch but still guards several stages as controlled; `advice-tools.ts:7–22` admits only named existing external bindings, not AF. `docs/plans/issue-21.md:1–47` explicitly leaves native stage/continuation connections and external review gates open. No claim here that a new AF tool can simply be enabled or that historic “all live blocked” summaries describe every current path.

## 5. One bounded future acceptance experiment

**Experiment: offline derived HTML explanation for the synthetic finding above.** Low cost/complexity relative to SACM/MCP; no upstream runtime dependency. First inspect existing rendering with owner; stop if current HTML already answers the question.

Acceptance checks, if separately authorized:

1. From unchanged maintained records, render C0→C1/EV-D and C0→C2/EV-O with distinct scopes, limitation Q-X and proposed OPT-X. Every displayed ref resolves; missing refs remain explicit unknowns.
2. No support edge is inferred from co-occurrence; counter polarity cannot become support. One artifact never acquires a universal “verified” badge.
3. Show configuration/revision, conditional versus supported result, reopened history, and separate adoption/implementation/verification/human review. Rendering changes none of them.
4. After a supplied synthetic revision through the existing engine, affected conclusions remain withheld and unrelated work retained. The view follows engine output, not its own invalidation algorithm.
5. Escape hostile text; allow no executable/unapproved locators or absolute-path disclosure. Existing offline outputs/regressions remain unchanged apart from intended presentation. No model/server required.
6. Owner can locate support, its limitation and required next evidence without reading a second report. If not demonstrably clearer, do not expand into a graph project.

Interface use versus copying: MIT first-party licence permits reuse with notices, but **ideas-only rendering and external file interoperability do not require copying AF implementation**. Copying substantial source requires notice/provenance handling; distributing AF or its dependencies/assets/catalog requires a separate exact-version licence review. Root MIT does not establish rights to SCCG, examples, fonts or imported standards. [A14]

**Adds value:** relationship-local scope/limitations beside unresolved conclusions; optionally external graphical inspection. **Already exists:** evidence/quotation rendering, questions, deterministic/domain validation, cause-linked options, revision/credit withholding and exact owner-update gates. **Does not solve:** machine reasoning quality, normative applicability, evidence truth/sufficiency, physical verification, native stage integration, baseline approval or human acceptance.

Do not import confidence scores, SCCG rules, AI/manual badges, whole-document acceptance semantics, a second authoritative graph, automatic learning or bidirectional synchronization. Best current integration is **none**, with one narrowly testable presentation idea retained.

## Decisive upstream references

All ranges were checked in the local pinned snapshot; test execution and remote link resolution were not performed.

- **A1** — [src/core/registers/register_model.cpp:45–122](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/core/registers/register_model.cpp#L45-L122); `register_model.h:23–49` (pair identity, shared assessment).
- **A2** — [src/sacm_adapter/document_edit.cpp:2984–3004](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/sacm_adapter/document_edit.cpp#L2984-L3004); `src/ui/register_views.cpp:75–104,487–516,597–654`; `src/core/commands/element_commands.cpp:978–1006`; `src/core/drafts/draft_operation_apply.cpp:750–763`.
- **A3** — [src/sacm_adapter/document_edit.cpp:2922–2982](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/sacm_adapter/document_edit.cpp#L2922-L2982); `src/agent/read_operations.cpp:126–159` (location and metadata readout).
- **A4** — [src/review/sccg/sccg_review.cpp:933–962](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/review/sccg/sccg_review.cpp#L933-L962).
- **A5** — [src/sacm_adapter/document_edit.cpp:862–924](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/sacm_adapter/document_edit.cpp#L862-L924); `src/export/gsn_projection.cpp:347–386,522–523,630`; `docs/features/feature-matrix.md:171–178`.
- **A6** — [src/agent/draft_operations.cpp:481–545](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/agent/draft_operations.cpp#L481-L545); `src/core/drafts/draft_document_store.cpp:91–125,158–177`.
- **A7** — [src/app/app_runtime_project.cpp:1448–1540](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/app/app_runtime_project.cpp#L1448-L1540); `docs/features/feature-matrix.md:239–243`.
- **A8** — [src/agent/draft_operations.cpp:38–142](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/agent/draft_operations.cpp#L38-L142); `src/core/reviews/review_proposal.h:163–174`; `src/core/audit/audit_baseline.cpp:30–40`; `src/core/drafts/draft_document_store.cpp:57–88`.
- **A9** — [src/export/gsn_svg_exporter.cpp:95–218](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/export/gsn_svg_exporter.cpp#L95-L218); `src/export/svg_writer.cpp:278–290`; `src/ui/register_views.cpp:160–171,604–606`.
- **A10** — [libs/sacm/include/sacm/io/xmi.h:8–24](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/libs/sacm/include/sacm/io/xmi.h#L8-L24); `libs/sacm/include/sacm/io/options.h:13–42`; `libs/sacm/README.md:1–31`.
- **A11** — [src/mcp/tools.cpp:35–168](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/mcp/tools.cpp#L35-L168); `src/mcp/session.cpp:47–66`; `src/agent/read_operations.cpp:91–159`; `docs/features/mcp-server.md` sections “How it fits together”, “Changing”, “Consent”, “Security of the bridge”.
- **A12** — [CMakeLists.txt:145–293](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/CMakeLists.txt#L145-L293); same file `:328–395`; `.gitmodules:1–24`.
- **A13** — [src/ai/ai_service.cpp:92–117](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/src/ai/ai_service.cpp#L92-L117); `src/ai/openai_provider.cpp:193–216`.
- **A14** — [LICENSE.md:1–22](https://github.com/lasrod/assurance-forge/blob/6a73390210ef32c03b7b435552c7af3033a59720/LICENSE.md#L1-L22); `.gitmodules:1–24`; `assets/fonts/LICENSE`.
