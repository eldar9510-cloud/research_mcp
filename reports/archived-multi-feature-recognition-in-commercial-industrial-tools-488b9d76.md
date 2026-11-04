---
{
  "format": 1,
  "metadata": {
    "id": "archived-multi-feature-recognition-in-commercial-industrial-tools-488b9d76",
    "title": "Multi-Feature Recognition in Commercial & Industrial Tools",
    "question": "What findings, alternatives and limitations does the historical investigation document about Multi-Feature Recognition in Commercial & Industrial Tools?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Multi-Feature Recognition in Commercial & Industrial Tools. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Multi-Feature Recognition in Commercial & Industrial Tools; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
    "researched_at": "2026-08-06",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:45.724Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "488b9d76872a5f7abb8a653f33c6ef1e520899e2907bab70c78e8b65671592f4",
  "proposalRevision": "e91977b01c551f550b7fff63840f4fa2a753bc2b7b7c7c99f2b4b37700d23e98"
}
---
# Multi-Feature Recognition in Commercial & Industrial Tools

**Research date:** 2026-08-06
**Scope:** How mature commercial / industrial feature recognition (FR) systems solve the *multi-feature* problem — recognition strategy, feature-interaction handling, ordering/arbitration, escalation when they can't fully reconstruct. This complements the market-landscape report (`08_cad_reverse_engineering_tools_landscape.md`) by going deeper on the **algorithms and architectures**, not the product/pricing surface.
**Use case anchor:** Informs `cad_reverse/` v1.5 — a deterministic, pure-Python, no-LLM STEP→CadQuery pipeline that already round-trips 16/16 fixtures to `symdiff < 0.001` (Issues #0–#15). The multi-feature question is currently the open frontier for our pipeline: interaction handling (holes through fillets), arbitration when recognizers disagree, and graceful degradation for parts it can't fully rebuild.

---

## 1. Executive Summary (the answers up front)

1. **Every commercial system separates *recognition* from *construction**.* FeatureWorks, CATIA FR, NX Sync all first *locate* feature geometry (via convexity-graph, hint, or volume-convolution means), then *rebuild* a parametric operation for it. Our `cad_reverse` does the same (recognize → order → emit). The differentiators are in how they arbitrate and order.
2. **Fillet/chamfer suppression FIRST is universal.** Every serious FR pipeline (and the 2002 Zhu–Menq paper, and FeatureWorks' own recommended order) strips blends before touching the "primary" features. Blends corrupt the convexity topology that everything else keys off. We already do blend masking (Issue #1); NX and CATIA confirm this is the right call.
3. **Two dominant arbitration philosophies:** (a) **graph/sub-graph decomposition** (Joshi–Chang AAG successors that peel convex nodes/bridge-features), and (b) **hint-based generate-and-test** (Vandenbrande–Requicha OOFF) which *infers ghost volume* for destroyed features. Commercial CAM-side AFR and FeatureWorks are closest to a *hybrid*: they recognize the isolated/simple features first, isolate them as connected components, then tackle interacting/compound geometry.
4. **Ordering is not free — it is solved analytically where possible and by user-directed re-recognition where not.** FeatureWorks exposes an explicit `Recognition Order` option and a `Re-Recognize` command precisely because the machine cannot always pick the right label/order. NX sidesteps ordering entirely via Synchronous Technology (no history). This highlights that **exact, provably-correct total ordering across arbitrary parts is not solved by anyone** — the mature tools fall back to (a) heuristic ordering + (b) human override.
5. **Escalation = "leave it dumb."** When recognition fails, no commercial tool invents a fatal error or a catastrophic wrong shape. All of them *keep the unrecognized remainder as an inert solid* (FeatureWorks "leftover geometry," CATIA booleans-as-fallback, our own `PARTIAL`/`UNMATCHED_*` statuses) and *report partial success*. The residual geometry is then either handled by a *different* recognition mode (FeatureWorks Interactive) or manually re-modeled. This is exactly our current `PipelineResult.status ∈ {CONVERGED, PARTIAL}` design — validated as idiomatic.
6. **OCC/OCCT gives us more than we use.** `BRepFeat` is *construction*, not recognition — but `ShapeUpgrade_UnifySameDomain` (blend → cylinder unify), `ShapeUpgrade_ShellSewing`, `ShapeFix_*`, and `BRepOffsetAPI_MakeDraft` / `HKAlgo`-style shelling are the healer/rebuilder substrate. The genuinely missing OCC piece is the *recognition* layer — which is precisely what Analysis Situs adds and what our `cad_reverse` re-implements.
7. **Open source is converging on us**: Analysis Situs is our closest analog (AAG + `recognize-holes/pockets/fillets/chamfers`), and community tools (FreeCAD Detessellate, CADEvolve synthetic scripts) validate the gap: nothing free ships a full STEP→CadQuery *emitter*. We remain differentiated on determinism + CadQuery emission + symdiff gate.

---

## 2. Industry strategy #1: Fillet/chamfer suppression before primary recognition

The single most consistent architectural decision across the literature and products.

- **The rationale (Zhu & Menq, "B-Rep model simplification by automatic fillet/round suppressing for efficient automatic feature recognition," *Computers in Industry*, 2002):** Fillets/rounds use non-linear surfaces (cylinders, spheres, tori) that drastically alter the geometric and topological patterns of primary features. They (a) change face adjacency, (b) complicate convexity classification, and (c) obstruct **volumetric feature extraction via half-space partition**. Suppressing them yields a "canonical feature boundary" that makes feature-type classification efficient. Critically, suppression must preserve **geometric/topological consistency and reversibility** — it is the *reverse* of edge blending, so primary features are untouched and the original can be restored.
- **FeatureWorks recommended recognition order** confirms this from a product: *Chamfers/Fillets/Rounds (in size order) → Drafts → Holes → Ribs → Cut Extrude/Revolve/Sweep → Shell → Boss Extrude/Revolve/Sweep/Loft*. Blends first, then progressively more complex primitives.
- **FeatureWorks practical hint** (help docs): recognize fillets/chamfers *first* because it simplifies the remaining geometry, making extrusions/revolves easier afterward.
- **NX Synchronous import cleanup** exhibits the same instinct: "automatic blending and chamfer recognition to repair imported geometry" is listed as one of its import-clean-up accelerators.
- **The two-phase hybrid FR framework** (Gao–Shah lineage, "A hybrid approach to AFR for multiple applications in concurrent engineering," *CIRP Annals*): pre-recognition = suppress fillets/rounds → basic surface feature recognition (bi-attribute convexity, surface clustering) → **volumetric feature extraction** (maximal feature volumes via half-space partition) → post-recognition = restore suppressed blends + sequence volumes. The blend mask operates at both the *start* (suppress) and *end* (restore).

**What it means for `cad_reverse`:** Our Issue #1 blend mask (deliberately *not* excluding blends at the wall stage, only at the cap stage) is the empirical inverse of "suppress then restore" — we keep blends in the adjacency but gate on them at the cap. That was the empirically-derived right call for our fixtures. Conceptually we can *adopt* the suppress-then-restore framing more explicitly for the hard multi-feature cases: recognize on a blend-stripped graph, then re-attribute recognized geometry back against the true (blended) part before emitting. (See Recommendations §9.2.)

---

## 3. Industry strategy #2: The arbitration philosophies

### 3.1 Graph-based / sub-graph decomposition (Joshi–Chang AAG lineage)
- **Joshi & Chang 1988** ("Graph-based heuristics for recognition of machined features from a 3D solid model," *CAD* 20(2)) — the origin of the **Attributed Adjacency Graph**: nodes = faces, arcs = edges, arc attribute = concave/convex. Key decomposition heuristic: *a face surrounded by convex edges is not a feature face and is removed from the AAG*; the leftover **concave sub-graphs** are matched against feature templates. Handles polyhedral pockets, slots, steps, blind steps, blind slots, polyhedral holes.
- **The interaction gap:** the original decomposition sees *isolated* features well but **fails on interacting features** — when features overlap, no clean concave sub-graph remains. This is the exact problem our pipeline's `UNMATCHED_CONCAVE_*` / `INTERNAL_BLEND` reason codes exist for.
- **The modern fix (Rahmani & Arezoo 2007, *Computers in Industry*):** instead of removing *faces* surrounded by convex edges, decompose the AAG by removing **all convex edges** to generate concave sub-graphs; use **node fusion** (O(n²)) instead of sub-graph isomorphism (NP-hard), avoiding the N! template-matching explosion; extends to curved 2.5D features and interacting milling features.
- **Sub-graph isomorphism cost (Analysis Situs docs, `find isomorphous faces`):** O(N^K) — pruned in practice with degree checks, arc-attribute filtering, and geometry-type matching. This is a direct caution for our VF2 template matcher (Issue #12); tight pruning is what keeps it practical.
- **Extended AAG variants in literature:** Modified AAG (MAAG, Ou-Yang & Liu — handles both depressions *and* protrusions), Extended AAG, Implicit Concave Graph. These generalize the arc attribute set (not just concave/convex).

### 3.2 Hint-based / generate-and-test (Vandenbrande–Requicha OOFF)
- **Vandenbrande & Requicha 1993**, "Spatial Reasoning for the Automatic Recognition of Machinable Features in Solid Models," *IEEE TPAMI* 15(12):1269–1285. System **OOFF** ("Object-Oriented Feature Finder").
- **Presence rule (the crux):** *a feature and its machining operation leave a trace in the final boundary even when it interacts arbitrarily with other features.* A minimum indispensable portion of a feature's boundary must survive. A hole leaves a cylindrical wall; a slot leaves two parallel facing planes; an internal thread attribute hints at a hole.
- **Generate-and-test loop:** OPS-5 production rules post *hints* (clues) to a blackboard → promising hints → an incompletely-specified "frame" → **computational geometry extends each frame to the *largest* volumetric feature compatible with available data**, *recovering information lost to interaction* (this is the ghost-/conjecture-volume idea) → interactions represented by segmenting features into **optional vs. required** volumes (overlaps are "optional") → validation tests accessibility / non-intrusion / machinability → iterate until the stock-to-machined volume is fully decomposed.
- **Limitations (author-acknowledged):** 2.5D swept only; face segmentation for non-template features weak; number of alternative decompositions poorly controlled; features/tests **hard-coded** (adding a feature type needs new programming). Significant for us — this is the *opposite* of our declarative VF2 templates (Issue #12), which let us add features without re-programming the matcher.
- **Successors:** Han & Requicha (1995/98) incremental feature finder Π² — adds heuristic **strength ranking** of hints (handles *redundant hints* where traces exceed feature count) and *relaxed hints* for floorless pockets. Regli & Rau explored edge/vertex hints for MRSEV volumes. Critics: hint generation is *ad hoc* rule-based, limiting generality — motivating invariant-based hints.

### 3.3 Volume-based & convolution approaches
- **Cell-based maximal volume decomposition** and **convex decomposition** methods (the third ingredient in the CIRP hybrid) partition the stock-minus-part volume into cells and re-assemble them into features. Feature volumes capture *machining precedence relations* (ordering) directly.
- These are powerful for **interacting/compound features** (e.g., a pocket with a hole) because the feature = a *volume to remove*, not a face pattern. Kataraki & Abu Mansor 2019 (*Engineering with Computers*) explicitly subclass regular form features into volumetric vs. surface-based and auto-designate feature faces to recognize interacting/compound volumetric features, generating **material removal volume (MRV)**.
- **Practical relevance:** a *geometric/volumetric* gate is complementary to our face-graph recognition. Our `symdiff` oracle (Issue #0) is already a whole-shape volumetric check; a localized per-feature volume check (feature volume ≈ claimed boundary volume) is the natural next gate to disambiguate "is this the right feature / did interactions break my assumption."

### 3.4 The product reality: hybrid + simple-first
- **FeatureWorks:** combines *automatic* (whole-body pass) + *interactive* (user picks type + faces + **build order**) + *step-by-step* (recognize some, save, recognize more). The recognition-order option resolves label ambiguity by prioritized trial ("try Cut Revolve first, then Hole"). `Combine Features`, `Find Patterns`, and `Re-Recognize` are the arbitration tools.
- **CATIA FR:** manual / local / automatic; automatic only globally detects holes/fillets/chamfers; richer features delegated to local/manual; **Booleans as last resort** (i.e., if nothing else works, represent the shape as a Boolean composition — an explicit escalation).
- **NX Sync:** history-free; *avoids* ordering by construction — features edited variationally/simultaneously; imports arrive as bodies and are edited directly.

---

## 4. Tool-by-tool: what's genuinely known about internals

> Note: the products are closed-source; specifics below are drawn from documentation, patents, API surfaces, user guides, and published research that mirror these systems. Where a claim is a *reading* not a *fact*, it is flagged as such.

### 4.1 Autodesk FeatureCAM — CAM-side AFR
- Roles: **AFR** (wizard-driven: analyzes the solid, auto-creates machinable features) and **IFR / Interactive Feature Recognition** (user picks faces to define feature boundaries). AFR is production; IFR is the manual override.
- **Algorithm internals: not publicly documented** — no official release on whether it is rule-based vs. graph-based vs. hybrid. The public help only describes the wizard UX.
- **Reasonable inference (by analogy + CAM-paper lineage):** CAM-side AFR like FeatureCAM/hyperMILL/Edgecam is overwhelmingly **manufacturing-feature + volumetric** in character: identify *machineable* volumes (holes, pockets, slots, threads) from sweep-able geometry and drive them to toolpaths/macros. Diameter/depth/datum attributes and color tables (hyperMILL) encode selection rules. It optimizes NC programming, **not** design-history reconstruction — so it is a *lesser* architectural analog for us than FeatureWorks, but its *goal-directed segmentation* (segment to make a toolpath, not to reconstruct original design intent) is worth noting as an alternative objective function.
- **Sources:**
  - [Autodesk FeatureCAM help — AFR (en)](https://help.autodesk.com/view/FCAM/2020/DEU/?guid=GUID-35C2FBA8-2EE3-4900-A503-AD942CD1A28F)

### 4.2 SolidWorks FeatureWorks — the STEP-history benchmark
- **Algorithm tiering evidence** (from help docs + API + how-to articles):
  - **Automatic = "scan the whole body, identify as many as possible in one pass."** Fast, prismatic-favoring; complex parts leave "leftover geometry."
  - **Interactive = user controls feature type + faces + build order;** can recognize sweeps/lofts/shells that automatic cannot.
  - **Step-by-Step = hybrid-over-time** (recognize → save → recognize more; supports multibody & sheet metal).
  - **Recognition Order option** (resize tool) = prioritized label disambiguation.
  - **Re-Recognize** = reclassify a recognized feature (e.g., Base-revolve → Base-extrusion) and recover from a wrong label.
  - **Combine Features / Find Patterns** = post-merge same-radius fillets, same-parameter holes on same plane, iso-gap chip-capped patterns. Fillets/pattern inference are the *only* things that combine reliably across sample-problem reports.
- **Multi-feature & interacting-feature handling** (directly answers the multi-feature question):
  - **Intersecting holes → two separate hole features** (automatic mode) — a documented, handled interaction case.
  - **Fillets interacting with holes/chamfers/drafts** on imported bodies — handled via the "Recognize filleted" draft option (one neutral-face-driven pass) and via *delete interfering faces first* tactic.
  - **Parent/child:** "Automatically recognize child features when using Edit Feature" (Yes/No/Prompt); deleting a face needed by a previously recognized feature makes that feature non-recreatable.
  - **Build order is where interactivity matters:** interactive mode is where "recognition of features in a specific sequence matters," and the resulting feature tree builds bottom-up in user-chosen order. This is the strongest public confirmation that **total-order inference is not closed/automatic even in the flagship tool** — it is *user steering + heuristic defaults*.
- **Sources:**
  - [FeatureWorks: Automatic vs Interactive (GoEngineer)](https://www.goengineer.com/blog/solidworks-featureworks-automatic-vs-interactive-recognition)
  - [Step-by-Step Recognition (SolidWorks help)](https://help.solidworks.com/2025/english/Solidworks/fworks/Step_by_Step_Recognition.htm)
  - [FeatureWorks Options / Recognition Order (help)](https://help.solidworks.com/2026/english/SolidWorks/fworks/IDH_OPTIONS.htm?id=d0e3d52b38524b538b73667e8a6cd355)
  - [Intersecting Holes (SOLIDWORKS 2010 what's-new)](https://help.solidworks.com/2010/english/solidworks/whatsnew/AllContent/SolidWorks/NonCore/FeatureWorks/wn_2010/wn_2010_Intersecting_Holes.html)
  - [Hints for Interactive Feature Recognition incl. delete-faces tactic (help)](https://help.solidworks.com/2026/english/solidworks/fworks/c_hints_for_interactive_feature_recognition.htm)
  - [FeatureWorks guide (Mechanitec)](https://mechanitec.ca/solidworks-featureworks-guide/)
  - [FeatureWorks API: RecognizeFeatureAutomatic / IFeatureWorksApp](https://help.solidworks.com/2026/english/api/fworksapi/SolidWorks.Interop.fworks~SolidWorks.Interop.fworks.IFeatureWorksApp~RecognizeFeatureAutomatic.html)
  - [Forum: "can't recognize more than one feature at a time" — combining limits](https://comp.cad.solidworks.narkive.com/8EiG7eVq/featureworks-can-t-recognize-more-than-one-feature-at-a-time)

### 4.3 Siemens NX Feature Recognition + Synchronous Technology
- **Two engines (see landscape report §3.3):** (1) **Synchronous Technology** = history-free, feature-based direct modeling; "the model IS its own history." (2) **Legacy Feature Recognition** on converted objects (holes, pockets, slots, bosses, ribs, grooves, fillets, chamfers).
- **How NX handles imported (history-less) geometry — the key architectural answer:**
  - **Features are recognized (holes, blends/fillets, chamfers, shells, ribs, slots) even though they carry no history tree**, and remain *editable with their original parameters*. In history-free mode these become **"Synchronous Features"**.
  - **No parent/child, no ordering:** edits ignore parents; features are solved **variationally and simultaneously**, not sequentially. No cascading feature failures, no rebuild time. This is the *radical* answer to feature-interaction ordering: *eliminate the ordering axis* by dropping history.
  - **Constraint re-inference:** the synchronous algorithm *retains/rediscovers geometric relationships* lost during format conversion (tangency, coaxiality, symmetry), and places **dimensions on imported geometry become editable features**.
  - **Optimize Face** command: imported blends arrive as B-surfaces/splines; NX simplifies them back to analytic geometry for easier synchronous editing (re-parameterizes, deletes history).
  - **Milling-axis prediction** is used for grouped cavity/2.5D recognition (an FR paper section referenced by Analysis Situs) — an axis-based grouping that resolves feature *interactions* ("one of the biggest problems in AFR") by grouping faces of a pocket by their shared machining axis.
- **Sources:**
  - [Why Synchronous Technology matters (Acuity white paper)](http://acuityinc.com/pdfs/Why%20Synchronous%20Technology%20Matters.pdf)
  - [NX Synchronous Modeling guide (ATA)](https://www.ata-e.com/wp-content/uploads/2021/10/NX_synchronous_modeling.pdf)
  - [NX 6 review — Sync features & Design Freedom (develop3D)](https://develop3d.com/product-design/nx-6/)

### 4.4 CATIA Feature Recognition Expert (Dassault) + the Dassault patent
- **Product tiering:** manual FR / local FR / automatic FR / DeFeature. Automatic FR globally = **holes, fillets, chamfers only**; everything richer is local/manual; **Booleans as fallback**.
- **The Dassault patent that documents the algorithm:** **EP2126849 / US 7,643,027, "Implicit Feature Recognition for a Solid Modeling System"** (Dassault Systèmes SolidWorks Corp; inventors Rothstein, Siegel, Chin, Gibson). It is the sharpest published account of how Dassault handles a *specific hard multi-feature case*: **interacting fillets forming an "implicit feature"**.
  - A collection of *positionally interrelated features* (e.g., fillets converging at a corner) collectively forms an implicit feature the user cannot directly control.
  - **Procedure:** (1) **automatically detect** implicit feature formation (e.g., all edges at a corner filleted; a chamfered edge meets a filleted edge) — or on request; (2) **present variations** — copy the model and *re-order the construction order* of the constituent features, producing alternative implicit-feature constructions as thumbnails; (3) **user selects** a preferred variation; (4) **create an explicit feature** that reproduces that geometry: *remove the region* (Boolean intersection with a six-sided solid centered on the feature), *replace it* with the chosen variation (sew + smooth seams); (5) **reconstruct in modeling order** after the originals so all remain independently editable in the tree.
  - **Implication for arbitration:** even Dassault's flagship approach to the *hardest* interaction case is **generate-AND-offer-alternatives-and-let-a-human-choose**, not closed-form automatic resolution. And the "remove region / re-sew / smooth seams" is a *Boolean-repair* escalation. Cover type: fillets (primary), chamfers, sweeps, lofts, weldments.
- **Sources:**
  - [US 7,643,027 — Implicit Feature Recognition (FreePatentsOnline)](https://www.freepatentsonline.com/7643027.html)
  - [Feature Recognition in CATIA (RAND3D)](https://resources.rand3d.com/insights-from-within/feature-recognition-in-catia)
  - [Patent register record (EP-view)](https://patent.public.lu/fo-eregister-view/search/details/507795459_EPV/0/0/1/10/0/0/0/null/null?locale=en)

### 4.5 The healing/translation category (CADfix, TransMagic, Datakit)
- These are **not** FR — they he/translate and often *deliberately remove* features — but their escalation model is instructive because they face the same "I can't fully handle this" problem.
- **CADfix (ITI):** the healing/defeaturing heavyweight. Defeaturing = *removing* features, not extracting them; reports on what was/was-not healed; batch/web API. Its repair loop (Shape Healing equivalents: detect invalid geometry → fix topology → re-validate) mirrors OCCT's ShapeFix, which our `heal.py` already wraps.
- **TransMagic:** re-skin (rebuild clean B-Rep), SuperView geometry checker, CLI/API. "Sometimes removes features deliberately."
- **Datakit 3DAnalysis:** B-Rep geometry analysis / validation, not feature extraction.
- **Takeaway for escalation:** the commercial healing category's *default* is "produce the best single valid solid, and if full fidelity is impossible, produce a valid but simplified/defeatured one, while reporting what changed." That same "valid-by-default, fidelity-graded" ethos maps onto our `step`/`status`/`symdiff` semantics.

---

## 5. Question 8 answered: simple-first vs all-at-once-arbitration

The evidence is unanimous: **neither** pure strategy is shipped alone; the mature tools run a **pipeline**:

```
1. Heal/simplify            (ShapeFix equivalent; NX Optimize Face)
2. Suppress blends          (fillets/chamfers/rounds)  ← blind to primary features
3. Find leaves               convex-face peeling → isolated primary features
4. Recognize the rest        interacting/compound via hints or volume convolution
5. Restore blends            re-attribute fillets/chamfers against true geometry
6. Order                    heuristic default + user override (FeatureWorks)
7. Combine/pattern           merge same-type features (FeatureWorks)
8. Escalate                  remainder stays dumb; Booleans as last resort (CATIA)
```

So the practical commercial answer to "simple-first suppress-then-complex vs all-at-once" is **simple-first suppress-then-complex** as the *front-end*, with **arbitration tools (Re-Recognize / Recognition-Order / combine / Manual)** as the *back-end* for cases the front-end can't uniquely resolve. OOFF's hint-based approach is the one true "all-at-once" contender, and even it is generate-and-test with optional/required volume segmentation.

**Our direct alignment:** `cad_reverse` already implements the front half well (heal → AAG → blend mask → recognize → order → emit). The *gap* is the back half — recognizing interacting/compound volumes (we have `FILTERED_FEATURE_INTERNAL_BLEND` as our one interacting-undershoot) and arbitration (re-choice) when two recognizers disagree.

---

## 6. Question 9: relevant patents & their algorithmic content

| Patent | Assignee | Algorithmic content we can borrow |
|---|---|---|
| **US 7,643,027 / EP2126849**, "Implicit Feature Recognition for a Solid Modeling System" | Dassault (SolidWorks) | Interacting-feature detection → generate multiple re-ordered constructions → human picks → **remove-region Boolean + re-sew + smooth-seams** to substitute an explicit feature. *The remove-region/substitute-sew pattern is a concrete escalation mechanic.* |
| (related SolidWorks family) | Dassault | Conservation of FeatureWorks auto-recognition option bitmask (`fwExtrude`, `fwHoles`, `fwFillet`…); iterative one-pass detection. |
| **WO/patents around NX Synchronous Technology** (Siemens) | Siemens | History-free simultaneous/variational solving; the ethos "recognize feature but drop the ordered-history dependency." Enforceable ordering not required. |

Separately, the *literature* functions as de-facto "patents" for these algorithms and is far more detailed:
- **Joshi & Chang CAD 1988** — AAG, convex-face peeling (the core graph idea behind our AAG, already adopted as Issue #1).
- **Vandenbrande & Requicha IEEE TPAMI 1993** — hint-based OOFF, ghost/conjecture volumes, optional/required segmentation, BRep→DSG conversion.
- **Han & Requicha 1995/98** — incremental feature finder Π², redundant-hint strength ranking.
- **Zhu & Menq *Computers in Industry* 2002** — fillet/round suppression with reversibility for efficient FR.
- **Rahmani & Arezoo 2007** — convex-edge decomposition + node fusion, O(n²), interacting milling features, curved 2.5D.
- **Gao–Shah / CIRP hybrid** — graph + cell-based volume decomposition + convex decomposition combined sequentially; unified hierarchical feature representation with machining precedence.
- **Kataraki & Abu Mansor 2019** — interacting/compound volumetric feature recognition + MRV generation.
- **Regli & Rau (Regli thesis 1995)** — hint-based MRSEV.

We were not asked for the exact patent numbers of *every* vendor (and most are closed/unpublished), but the two carrier systems (Dassault's implicit-feature patent; the AAG/hint/volume literature) cover the mathematical core.

---

## 7. Question 10 answered: escalation / graceful degradation

Commercial tool "I can't fully reconstruct" behavior, distilled:

1. **Keep the remainder as an inert solid.** FeatureWorks leaves unrecognized "leftover geometry"; CATIA keeps the isolated-solid branch until FR converts it. The part is *never* made invalid.
2. **Report partial success.** Statuses/affirmations differ but the pattern is universal.
3. **Offer a different recognition mode.** Automatic→Interactive→Manual (FeatureWorks, CATIA) is the standard escalation ladder; NX offers direct/synchronous editing whenever history-FR is not worth it.
4. **Boolean as last resort.** CATIA explicitly models unresolvable complex ops as Booleans rather than failing.
5. **Infer-and-honour-with-or-without-verification.** OOFF infers ghost volume for destroyed features, but gates it behind accessibility/non-intrusion validation; if validation fails, the decomposition is not claimed complete.
6. **Substitute the problem.** Dassault's implicit-feature patent replaces an unresolvable implicit feature with an explicitly generated alternative (human-chosen).
7. **Human-assisted repair of the residual.** FeatureWorks "delete interfering faces first, recognize the rest, re-create the faces" tactic.

**Our alignment (and what we arguably do *better*):** `cad_reverse` already encodes the core escalation traits — `PipelineResult.status ∈ {CONVERGED, PARTIAL}`, per-feature `reason` codes (`UNMATCHED_*`, `FILTERED_FEATURE_INTERNAL_BLEND`, `UNMATCHED_CONCAVE_CYLINDER_NO_CAP`), and the `symdiff` gold gate. We should *keep* the remainder inert-and-reported as the terminal state for unconverged fixtures, mapping cleanly to FeatureWorks' "leftover geometry." The one escalation tool we currently *lack* and could add cheaply: **Boolean-composition fallback** (CATIA's last resort) — when a part doesn't converge, emit a script that CSG-assembles the verified-recognized features plus a dumb remainder solid, preserving validity even when full parametrization fails.

---

## 8. OCC/OCCT capabilities we may be under-using (Question 6)

- **`BRepFeat`** — **construction**, not recognition. It *makes* form/mechanical features (cylinders, draft prisms, prisms, revolved, pipes as depressions/protrusions; ribs/slots via thickness-to-limiting-face). Useful as the *rebuild* side if we ever emit by direct OCC ops instead of CadQuery — but recognition is not here. Static helpers worth knowing: `IsInside`, `IsInOut` (2D classifier), `SampleEdges`, `Barycenter`, `Tool` (create tool solid from face).
- **`ShapeUpgrade_UnifySameDomain`** — merges adjacent faces/edges on same surfaces/curves; *already core to our `heal.py`* (ConcatBSplines=False). This is OCC's canonical "collapse B-surfaces back to analytic cylinders" tool — aligned with NX's "Optimize Face."
- **`ShapeUpgrade_ShellSewing`** — re-sew shell faces after repair; complements our heal.
- **`ShapeFix_Shape` / `_Shell` / `_Solid` / `_Face` / `_Wire` / `_Wireframe`** — repair orientation, natural bounds, small edges, gap filling; our `heal.py` already wraps a subset.
- **`ShapeBuild_ReShape`** — rebuild a shape while tracking modification history — useful if we implement remove-region/substitute-sew escalation.
- **`BRepOffsetAPI_MakeDraft`, shelling** — OCC's own fillet/chamfer/t/draft "rebuild" entry points (beyond our `recognition`).
- **Key gap that is NOT in OCC:** no recognition/history-/feature-classification layer. OCCT is a kernel; "speaking the language of features is impossible without touching the manufacturing layer" (Analysis Situs's stated reason for existing). That missing layer is exactly the `cad_reverse` + Analysis Situs niche.

---

## 9. Recommendations for `cad_reverse` v1.5 (Python / CadQuery stack)

Given a deterministic pure-Python + CadQuery stack and 16/16 converging fixtures, these are the highest-leverage transfers from the commercial/research playbook.

### 9.1 Adopt the 8-step commercial pipeline framing explicitly
Formalize `reconstruct()` as: `heal → AAG → blend-suppress → leaf-convex-peeling → base-feature → primary-recognition → interacting-recognition → order → emit`. We already do most of this; naming the stages lets us target the true gaps. The documented imports that give us the most lift:
- **Stage 3 refinement:** apply RAHMANI/AREZOO-style *convex-edge* removal → concave sub-graphs + node-fusion (vs. our current VF2 sub-graph isomorphism, which is O(N^K) and needs aggressive pruning). Node fusion handles interacting features better and is O(n²). *High-leverage, concrete.*

### 9.2 Make blend suppression two-sided (adopt the Zhu–Menq "suppress-then-restore")
We empirically keep blends in the adjacency graph but gate on them at the cap stage. The commercial pattern is suppress-at-front, restore-at-back, **with reversibility**. For hard multi-feature cases, recognize primary features on a *blend-stripped* working copy, then re-attribute against the true blended geometry before emit. Keep reversibility strict (blend suppression must reproduce the original on restore), which we can guarantee because we keep the original STEP alive for `symdiff`.

### 9.3 Add an interacting-feature / compound recognizer (our #1 real gap)
Commercials treat "a pocket with a hole," "intersecting holes," and "fillet interrupted by a hole" as *first-class, named* interaction cases (FeatureWorks documents intersecting-holes; the literature has interacting/compound volumetric+MRV). We currently handle only `INTERNAL_BLEND`. Add a **compound-pattern** recognizer: detect a pocket whose floor has a blind hole / a slot whose wall is drilled, and emit it as `pocket(sketch)` + successive `cut hole` — which our emitter already supports. Gate recognition regionally, and validate with a **per-feature localized symdiff** (feature volume ≈ claimed closure volume) before global emit.

### 9.4 Prioritized label disambiguation (adopt FeatureWorks "Recognition Order" cheaply)
When two recognizers can both claim the same face-clique (cylindrical cut could be a hole *or* a cut-revolve/`UNMATCHED_CONCAVE_CYLINDER_NO_CAP`), run a *static priority list* (cut-revolve → hole, per FeatureWorks guidance) and a **Re-Recognize-equivalent**: if the top-priority label fails to validate against `symdiff`, retry with the next. This turns label ambiguity from a hard stop into a small, deterministic search. *Cheap; directly reuses our existing oracle.*

### 9.5 Full-part ordering: keep heuristic + add *analytic* precedence where possible
We have a feature DAG + canonical sort (Issue #6). Commercials show total auto-ordering is not closed: FeatureWorks user-steers, NX drops history. Strength for us: (a) keep our DAG/canonical sort as the default; (b) recognize that **restoring blends last** (fillet/chamfer after primary) matches the universal commercial order and is worth hard-wiring into the sort even when other precedence is ambiguous; (c) expose the order decision to callers (we already do via typed params) as the equivalent of FeatureWorks' human override.

### 9.6 Boolean-composition escalation fallback (close our escalation gap)
Add, for non-converged parts: emit the *verified* recognized features as parameterized CadQuery, and represent the unverified residual as a **dumb CSG remainder** (the CATIA "Booleans as last resort" move). This guarantees a valid script that still regenerates the geometric part even when full parametrization fails — a strict improvement over "fail or converge," and maps to our `PARTIAL → CONVERGED` ladder.

### 9.7 Mirror Analysis Situs' evidence structures for maintainability
`asiAlgo_AAG` stores a *stack of adjacency matrices* (`PushSubgraph`/`PopSubgraph`) and a `Collapse()` for *virtual* face suppression (ignore blends across neighbors) without mutating geometry, and treats AAG as invalid once geometry is frozen/edited. Adopt the same discipline in our `aag.py`: (a) make subgraph masking stackable and side-effect-free (we touched this in Issue #1), (b) **virtual defeaturing** — collapse blends/chamfers to see neighbors *across* them when matching compound features. This is the cleanest open-source realization of blend-suppression.

### 9.8 Keep the no-LLM, deterministic, symdiff-gated stance as the moat
The market report's #5 stands reinforced here: the AI/SaaS wave (Backflip, CADENA, DualBrep) attacks construction via learned programs — non-deterministic/cloud. Commercial flagship FeatureWorks *still* needs human arbitration (Recognition Order, Re-Recognize). Our deterministic + exact `symdiff < 0.001` round-trip is a *provably-correct* subset that no commercial or AI tool offers in the STEP→CadQuery-script form. Lean into it: a `case` where we admit `PARTIAL` + reason codes + a valid CadQuery remainder is stronger than a tool that silently produces a wrong-but-plausible tree.

### 9.9 Non-priorities (do not build)
- **Sub-graph isomorphism as the general mechanism** — NP-hard; keep VF2 only for small template sets with aggressive pruning, or move to node-fusion (9.1).
- **NX-style history-free editing** — we're explicitly a history *reconstructor*; moot.
- **Volumetric half-space decomposition** — powerful but heavy for our fixture scale; use *localized* per-feature volume checks (9.3) instead of a global convolution engine.

---

## Sources

**Patents**
- [US 7,643,027 — Implicit Feature Recognition for a Solid Modeling System (Dassault/SolidWorks)](https://www.freepatentsonline.com/7643027.html)
- [Patent register record EP-view (507795459_EPV)](https://patent.public.lu/fo-eregister-view/search/details/507795459_EPV/0/0/1/10/0/0/0/null/null?locale=en)

**FeatureWorks / SolidWorks (multi-feature specifics)**
- [GoEngineer — FeatureWorks Automatic vs Interactive](https://www.goengineer.com/blog/solidworks-featureworks-automatic-vs-interactive-recognition)
- [SolidWorks help — Step-by-Step Recognition](https://help.solidworks.com/2025/english/Solidworks/fworks/Step_by_Step_Recognition.htm)
- [SolidWorks help — FeatureWorks Options (Recognition Order)](https://help.solidworks.com/2026/english/SolidWorks/fworks/IDH_OPTIONS.htm?id=d0e3d52b38524b538b73667e8a6cd355)
- [SOLIDWORKS 2010 what's-new — Intersecting Holes](https://help.solidworks.com/2010/english/solidworks/whatsnew/AllContent/SolidWorks/NonCore/FeatureWorks/wn_2010/wn_2010_Intersecting_Holes.html)
- [SolidWorks help — Hints for Interactive FE (delete-faces tactic)](https://help.solidworks.com/2026/english/solidworks/fworks/c_hints_for_interactive_feature_recognition.htm)
- [FeatureWorks guide (Mechanitec)](https://mechanitec.ca/solidworks-featureworks-guide/)
- [FeatureWorks API — RecognizeFeatureAutomatic](https://help.solidworks.com/2026/english/api/fworksapi/SolidWorks.Interop.fworks~SolidWorks.Interop.fworks.IFeatureWorksApp~RecognizeFeatureAutomatic.html)
- [Forum — "can't recognize more than one feature at a time" (combining limits)](https://comp.cad.solidworks.narkive.com/8EiG7eVq/featureworks-can-t-recognize-more-than-one-feature-at-a-time)

**NX / Synchronous Technology**
- [Why Synchronous Technology matters (Acuity white paper)](http://acuityinc.com/pdfs/Why%20Synchronous%20Technology%20Matters.pdf)
- [NX Synchronous Modeling guide (ATA)](https://www.ata-e.com/wp-content/uploads/2021/10/NX_synchronous_modeling.pdf)
- [NX 6 review (develop3D)](https://develop3d.com/product-design/nx-6/)

**CATIA FR**
- [RAND3D — Feature Recognition in CATIA](https://resources.rand3d.com/insights-from-within/feature-recognition-in-catia)

**FeatureCAM / CAM-side AFR**
- [Autodesk FeatureCAM help — AFR](https://help.autodesk.com/view/FCAM/2020/DEU/?guid=GUID-35C2FBA8-2EE3-4900-A503-AD942CD1A28F)

**Analysis Situs (open-source OCC FR framework)**
- [Analysis Situs — feature recognition framework](https://analysissitus.org/features/features_feature-recognition-framework.html)
- [Analysis Situs — find subgraph isomorphisms](https://www.analysissitus.org/features/features_find-isomorphous-faces.html)
- [Analysis Situs — CNC milling features](https://www.analysissitus.org/featuresext/features_cnc-milling-features.html)
- [Analysis Situs — forum, "Find cavities" / interacting holes & base-face heuristic](http://analysissitus.org/forum/index.php?threads/find-cavities.404/)
- [Palmetto (AAG/DFM recognizers)](https://github.com/connorkapoor/Palmetto)

**OCCT / OpenCascade**
- [OCCT BRepFeat class reference](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classBRepFeat.html)
- [OCCT Shape Healing user guide](https://dev.opencascade.org/doc/occt-7.9.0/overview/html/occt_user_guides__shape_healing.html)
- [OCCT ShapeUpgrade_ShellSewing](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeUpgrade__ShellSewing.html)

**Academic algorithms (the "de-facto patents")**
- Vandenbrande & Requicha 1993, *IEEE TPAMI* 15(12) — hint-based OOFF, ghost volumes, optional/required segmentation: [article entry](https://www.ablesci.com/scholar/paper?id=3jZ6XZBl3)
- Joshi & Chang 1988, *CAD* 20(2) — AAG, convex-face peeling / concave sub-graphs: [Semantic Scholar](https://www.semanticscholar.org/paper/Graph-based-heuristics-for-recognition-of-machined-Joshi-Chang/98ca8a56a268277fd926b903171fb2e340ee2fc4)
- Rahmani & Arezoo 2007, *Computers in Industry* — hybrid hint+graph, convex-edge decomposition, node fusion, interacting milling features: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0166361506001059)
- CIRP hybrid — graph + cell-based + convex decomposition, unified representation with machining precedence: [ScienceDirect (CIRP Annals)](https://www.sciencedirect.com/science/article/abs/pii/S0007850607601310)
- Zhu & Menq 2002, *Computers in Industry* — fillet/round suppression with reversibility: [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0010448501000562)
- Kataraki & Abu Mansor 2019, *Engineering with Computers* — interacting/compound volumetric features + MRV: [ACM DL](https://dl.acm.org/doi/10.1007/s00366-019-00777-2)

**FreeCAD / CadQuery open-source**
- [Detessellate (FreeCAD STEP-workbench, re-parametrize STEP w/ sketch features)](https://github.com/DesignWeaver3D/Detessellate)
- [CADEvolve — synthetic CadQuery scripts dataset for reverse engineering](https://huggingface.co/datasets/kulibinai/cadevolve)
- [CadQuery import & export (DeepWiki)](https://deepwiki.com/CadQuery/cadquery/4.1-import-and-export)
