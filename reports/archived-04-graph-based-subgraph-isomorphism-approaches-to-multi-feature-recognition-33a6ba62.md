---
{
  "format": 1,
  "metadata": {
    "id": "archived-04-graph-based-subgraph-isomorphism-approaches-to-multi-feature-recognition-33a6ba62",
    "title": "04 — Graph-Based & Subgraph-Isomorphism Approaches to Multi-Feature Recognition",
    "question": "What findings, alternatives and limitations does the historical investigation document about 04 — Graph-Based & Subgraph-Isomorphism Approaches to Multi-Feature Recognition?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: 04 — Graph-Based & Subgraph-Isomorphism Approaches to Multi-Feature Recognition. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of 04 — Graph-Based & Subgraph-Isomorphism Approaches to Multi-Feature Recognition; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:45.573Z"
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
  "sourceDigest": "33a6ba62094805a38fb557f71994f06cb562e71ab80809baf961207ea4f54bd4",
  "proposalRevision": "a6f4aa385c83d912518c97e3f723626087b19b1cd233d0439d9b4e0d8a911106"
}
---
# 04 — Graph-Based & Subgraph-Isomorphism Approaches to Multi-Feature Recognition

**Research agent report · cad_reverse multi-feature series**
**Scope:** Simultaneous multi-feature recognition extended from single-feature VF2 subgraph matching over an AAG.
**Target files for concrete recommendations:** `src/cad_reverse/recognize/feature_templates.py`, `src/cad_reverse/aag.py`.

---

## 0. Executive summary

Single-feature VF2 subgraph matching (our current approach) is the *industry baseline* for graph-based feature recognition, and the literature converges on a clear path to multi-feature support that does **not** require abandoning VF2. The research divides into three eras:

1. **Pure graph matching (1990s).** Joshi–Chang AAG + Ullmann/VF2; treats each feature independently and, crucially, **cannot handle interacting features** because interaction loses/alters graph arcs. This is exactly our current single-template VF2 regime.
2. **Graph + rule/hybrid (2000s–2010s).** Decompose the part graph into feature sub-graphs, then apply geometric reasoning rules *on top of* graph structure to resolve interactions and variable topology. This is the most pragmatic target for us.
3. **Learning-based (2020s).** GNNs (AAGNet, EMD-GNN, FeatureFox) treat recognition as *panoptic semantic+instance segmentation of the face graph* — simultaneous by construction, but requires large annotated B-Rep datasets and abandons our "no ML, deterministic" scoping decision (D2).

**Key insight for our pipeline.** The cleanest deterministic upgrade is **"recognize-then-decompose" with a partition-and-sweep layer** (Section 6): keep our per-template VF2 matcher as the engine, but (a) iterate templates in a precedence order, (b) **claim/remove matched faces** from a working copy of the AAG before matching the next template, and (c) where additivity fails, detect regions that map to *no* standing template and escalate via a **minimal-condition sub-graph** (substrate face + boundary) recompleted by VF2. This is the additive/subtractive paradigm (Section 9) expressed graph-theoretically.

**Verdict:** **Extend VF2, do not pivot.** Adopt a two-pass (face-disjoint sweep + substrate/hint completion) architecture. Estimated infeasibility boundary is well above our current fixture sizes (Section 8).

---

## 1. From single-feature to multi-feature recognition

**Single-feature (current).** We run VF2 per template (`THROUGH_HOLE`, `BLIND_HOLE`) independently over the full part `nx.Graph`, collecting every match, then manually dedup (cap-swap duplicates, shared pierced-cap faces in `match_holes_vf2`). This is the standard "feature library + subgraph isomorphism" pipeline used across the literature (Joshi & Chang AAG; the NUAA 2018 Creo implementation).

**The multi-feature problem is not primarily a matching problem.** Surveyed work repeatedly finds that matching individual features is a *already solved* sub-step; the hard part is that **feature interactions destroy the graph evidence a second feature needs**:

> "arcs of the graph are lost due to feature interactions, requiring missing link recovery — a significant challenge for simultaneous multi-feature matching." — Sunil, Agarwal & Pande (Computers in Industry, 2010)

Two distinct failure modes break a naive "run all templates, union results" approach:

- **Lost evidence:** a hole bored through a pocket shares/consumes the pocket's bottom face, so a standalone "hole-through-pocket" template and a standalone "pocket" template may *both* fail to match their canonical versions (variable topology / missing arcs).
- **Overlaps & double-count:** two templates may claim the *same* face set (a cylinder is both a "hole wall" and a "boss/shaft wall"; a through-hole cap is also the box's large face). Without a claim/removal protocol you get false positives or double features.

**What the literature adds over raw matching:** a *control loop* between matching passes. Recognition becomes an iterative "match → suppress (remove volume/faces) → rebuild → match next" cycle. The two canonical control loops are the **graph decomposition** of Sunil et al. (FAG → Feature FAGs) and the **hint-based** loop of Vandenbrande & Requicha (Section 5).

---

## 2. The "feature graph" approach — merged graph of all expected features

There are two related but distinct meanings of "feature graph" in the literature; we should adopt the *second*.

**Meaning 1 — Feature Relationship Graph (FRG) / high-level feature graph.** Nodes are *already-recognized individual features*; arcs encode *inter-feature relationships* (abutment, adjacency, splitting, co-axis, nesting, interference, penetration — formalized via regularized Boolean ops in Li et al. 2002). Subgraph isomorphism over the FRG composes low-level features into *compound* features (stepped holes, arrays, counterbores). This is **upstream-consumer** of our output, not a recognition engine. The GCAPPSS "Multi-attributed Feature Relationship Graph" is the fully-packed version (feature class + root/boundary face lists as node attrs; connecting-face nodes on arcs).

**Meaning 2 — merged template graph (the one in our question).** Build a *single union graph* `F = ∪_t T_t` of all templates' node/edge patterns with per-node labels of which features use it, then seek subgraphs of the part graph isomorphic to `F`. This matches several feature instances in one VF2 call and lets the matcher *share* evidence.

**Assessment for us.** A single monolithic `F` offers roughly nothing over running templates separately and gives up the ability to handle interactions (the merged graph still has all the missing-arc problems). The FRG (Meaning 1) is where the real value is: it is exactly how we'd express "a hole-through-pocket" as a *relationship between two recognized features* rather than a new monolithic template. **Recommendation: do not build a monolithic merged template graph.** Build a two-level scheme — per-feature templates (we already have them) + an interaction/relationship layer — and add shared-evidence discipline at *match time* (Section 7).

---

## 3. Can VF2/ULLMANN match multiple *non-overlapping* subgraphs simultaneously?

**No standard API does this in one call.** `networkx.GraphMatcher` (`subgraph_isomorphisms_iter`) enumerates *each* subgraph isomorphism independently; it does not enforce vertex-disjointness *between* outputs. Requesting "all disjoint copies of pattern P" is a genuinely harder problem:

- Finding one subgraph isomorphic to P is NP-complete (Garey–Johnson 1979).
- Finding a **maximum set of vertex-disjoint** copies is an NP-hard packing/optimization problem on top of that.

**Standard practical solution: greedy claim-and-sweep.** The recognized-feature literature and the graph-database community both use an iterative protocol rather than a one-shot matcher:

```
open = part_graph.copy()
results = []
for template in precedence_ordered_templates:
    for m in matcher.find_on(open, template):
        results.append(m)
        open.remove_nodes(matched_face_keys)   # CLAIM the faces
```

Enforcing non-overlap is thus a **post-filter + removal policy**, not a matcher feature. When the same geometry is legitimately shared between two features (a through-hole cap that is also part of the part's outer skin — precisely our `match_holes_vf2` dedup case), greedy exhaustive removal is *wrong*; you need to distinguish **consumed faces** (subtractive volume faces, claimed) from **shared boundary faces** (thin-walled through-features where the cap belongs to the stock). This is why a naive removal sweep over-produces: it deletes faces that a later feature needs.

**Concrete guidance for `match_holes_vf2`:** the double-count we already fight (two part caps mapping onto a template's two cap slots; shared pierced caps across holes) is exactly the "non-overlapping copies + shared vertices" tension. Greedy removal must be **feature-type-aware**: for *blind* features (pocket, blind hole, pad/boss) claim the wall+floor faces; for *through / boundary-sharing* features (through hole, slot, grooves) do **not** claim the cap faces that are really the stock's outer surface — claim only the exclusive wall faces. We already know which keys are walls vs caps from `HoleParams.face_keys=(wall,) + caps`; the claim policy should mark conical/cylindrical *wall* faces removable and keep outer planar caps.

---

## 4. Overlapping subgraphs — how to handle

Three distinct "overlap" regimes, each with a different remedy (from the interacting-features literature: Sunil et al., Marefat's substrate-volume work, Li et al.'s interaction taxonomy):

1. **Shared-boundary overlap (benign).** Two features touch along a face/edge (a hole pierces the box; two holes share the top cap). The topologies stay canonical; the overlap is *topological aliasing* (cap-swap duplicates). **Remedy:** dedup by the full matched key-set (we do this) and, for boundary faces, *don't* subtract them from the open graph.

2. **Volumetric interaction (real overlap).** Feature boundaries genuinely disappear on the part (a slot tail clipped by another feature). The interaction "loses arcs." **Remedy:** recognize the *simplest dominant* feature first, then recognize the *remaining* region; or use a substrate/hint approach (Section 5). The literature's concrete tool is **missing-arc recovery** — infer the lost adjacency from geometry/toppology rather than from the graph alone.

3. **Multiple interpretations.** The same solid decomposes into different feature sets (e.g., "pocket + boss" vs "step + slot"). This is inherent and the literature embraces it via **AND/OR graphs** (Sormaz & Khoshnevis; Li et al.): each valid decomposition is a branch; CAPP selects the min-cost branch. We do not need to solve multi-interpretation for B-Rep→CadQuery convergence — we need **a converged geometry, not a unique interpretation** — so prefer any *valid* decomposition.

**Practical handling for us.** Don't try to compute "all disjoint subgraph isomorphisms." Implement: (a) precedence ordering, (b) per-feature claim policy (Section 3), (c) a *post-hoc overlap-consistency check* that a recognized wall face belongs to exactly one *subtractive* feature, and (d) tolerance for shared boundary faces. For stage (c) we can reuse `AAGArc.face_key_a/face_key_b` and `BlendMaskedAAG.primary_pairs`.

---

## 5. Hint-based approach (Vandenbrande & Requicha 1993) — and the "minimal condition subgraph"

**The paper.** Vandenbrande & Requicha, "Spatial Reasoning for the Automatic Recognition of Machinable Features in Solid Models," *IEEE TPAMI* 15(12):1269–1285, 1993 (309+ citations). Core idea — **generate-and-test**:

1. **Hints.** Features leave *partial traces* (OPS-5 production rules scan nominal geometry, tolerances, thread attributes, design form features) that hint at a feature's possible existence. E.g., a cylindrical face hints at a possible hole.
2. **Partially-filled frames.** Each hint seeds an *incompletely-specified* volumetric feature; computational geometry then produces the **largest material volume compatible** with the hint and the part (substrate).
3. **Accessibility & interaction analysis.** Each proposed feature's access direction and interactions are checked; interactions split features into *optional* vs *required* volumes.
4. **Verification.** Faulty hints are rejected via validity tests; the loop runs until the volume-to-be-machined is fully decomposed.

**Why this is directly relevant to us.** Our existing `_is_inner_cylinder` gate (Issue #3) is already a *hint + completion* in miniature: a Cylinder face is a *hint* for a hole; the inward-normal test *completes/rejects* it; cap senses complete through-vs-blind. We already do hint-based recognition implicitly — the literature just gives a name and a discipline for generalizing it.

**The graph-theoretic variant: minimal-condition sub-graphs (MCS; Marefat et al., ASME DETC 1997).** For interacting features where a full feature subgraph is not present, search for the **minimal condition sub-graph** that *must* exist (a substrate face + its concave boundary edges), use it as the hint/hook, and **virtually complete** the rest of the feature based on geometry. This is the recognized fix for "lost arcs": you match what incontrovertibly exists, then reconstruct the missing connectivity.

**Concrete mapping to our code.** A "hole-through-pocket" has no clean standalone template because the pocket bottom face is consumed. But there is always a **minimal condition subgraph**: the exposed cylindrical wall face + the planar opening it rings. Implement `find` on *condition-flagged* templates where some nodes are `required` (must appear in the match) and others are `optional` (a completed rest of the feature that we back-fill geometrically). VF2 already enumerates matches; we filter to require the *required* face set and treat `Optional` nodes as "add geometry later". Concretely: a `FeatureTemplate` gains a `required_nodes: set[int]` field; the matcher keeps matches that cover all required nodes even if a *non-required* node is absent in the part (missing-arc case). The `params_extractor` then synthesizes the absent cap/floor from the cylinder's axial extent (we already compute axial span in `_extract_hole_params`).

---

## 6. Graph partitioning / clustering to decompose a complex part

Multiple complementary strategies; the oldest and most directly reusable is **convexity-based decomposition**:

**6a. Convex/concave edge partition (Joshi & Chang lineage).** Remove nodes joined by *convex* edges; the remaining components (bounded by concave edges) are candidate feature sub-graphs matched against the library. Cheap and interpretable, but fails on interacting features (missing arcs fracture components wrong).

**6b. Edge-cluster / edge-loop boundary extraction (TAAG model).** Group adjacent edges by shared convexity → refine into loops → identify division edges → partition the edge–face graph at feature boundaries. More granular boundary localization than 6a.

**6c. Spectral / k-means clustering.** Embed face nodes via Laplacian spectrum and k-means (k chosen by silhouette); unsupervised region finding. **Not deterministic-friendly** for us; kept to note for larger parts.

**6d. Learned boundary classification.** FeatureFox trains an edge classifier to mark "feature boundary edges," then recovers instances as connected components of the pruned graph + semantic labels. Only relevant if we ever revisit the no-ML scope (D2).

**Recommendation for us.** We already hold the convexity on every arc (`AAGArc.convexity` and `multi_sample`). The **cheapest, fully-deterministic, and most compatible upgrade** is a lazy *concave-connected-component* pre-partition in `aag.py`:

```python
def decompose_concave_components(aag: AAG) -> list[set[int]]:
    """Connected components of the subgraph using only CONCAVE arcs.
    Faces reachable only via convex/smooth arcs stay in the same region."""
```

Then run the existing matcher **per component** (faces spanning multiple components are shared-stock faces). This shrinks the VF2 target graph per call (helpful for complexity, Section 8) and makes claim/removal local. It is a *pure preprocessing layer*: `feature_templates.py` and the `AAGMatcher` API do not change, only the entry-point loops (`match_holes_vf2` drives per-component matching).

---

## 7. Representing feature templates that account for interactions

The failure of flat templates is that interaction varies topology. Three representational options, from literature (Li et al. interaction taxonomy; composite/AND-OR features; hybrid rule recognition):

**Option A — Composite / common-interaction templates (naïve).** Pre-author a *closed set* of composite templates ("hole-through-pocket", "slot-through-pocket") whose graph encodes the merged topology. Simple, but combinatorial explosion and — this is the literature's repeated warning — it only covers the interactions you foresaw. Not recommended as the primary mechanism.

**Option B — Requirement flags on templates (recommended, minimal change).** Extend `FeatureTemplate` with `required_nodes: set[int]` (faces that MUST match) and `exclusive_wall: bool` (whether to claim matched faces after recognition). Interacting features are then recognized as **incomplete matches completed geometrically** (Section 5's minimal-condition sub-graph). This is a *small, backward-compatible* schema change — the existing `THROUGH_HOLE`/`BLIND_HOLE` templates get `required_nodes={0,1}`-style defaulting to "all" for unchanged behavior.

**Option C — Relationship layer / FRG (strategic).** Recognize features independently, then build a *feature-relationship graph* where an arc encodes "pocket-bottom contains hole-opening"; a final pass merges a through-hole into a through-pocket when they are co-axial. This expresses interactions as *between-feature constraints* rather than inside templates, and matches how a "hole-through-pocket" genuinely arises (it is two features sharing an axis). This is the highest-leverage long-term representation and is *upstream-consumer* of our current output.

**Recommendation:** ship **B now** (small, deterministic, non-breaking), design the schema so **C** is an easy add-on (the `params_extractor` already outputs typed objects with `axis`, `center`, `face_keys` — C only needs co-axial/boundary heuristics over those params).

---

## 8. Computational complexity limits — when subgraph isomorphism becomes infeasible

- **Subgraph isomorphism is NP-complete** in general (Garey & Johnson 1979); finding *disjoint* copies is an NP-hard packing problem.
- **Empirical hardness (critical for us):** McCreesh et al. (JAIR 2018) engineered "really hard" instances with **only ~a couple of hundred target vertices and ~20 pattern vertices**. They show the widely-used *filter/verify* indexing is unsafe on worst-case instances; state-of-the-art exact algorithms on very large graphs (hundreds of thousands of nodes) can take days.

**Reality check for our domain.** These worst cases are adversarially constructed (near phase-transition, high symmetry, no labels). Real CAD feature recognition reports **fraction-of-a-second runtimes even on thousands of faces** (NUAA 2018; Open CASCADE sheet-metal work) because:
- Face labels (`surf_type`) and edge convexity prune the candidate space enormously (most (part,template) node pairs are infeasible immediately),
- Templates are *tiny* (3–20 nodes) relative to the target,
- Target graphs are sparse and planar-ish.

Our own parameters: templates are 3 nodes (hole). Even at 5–10 nodes (pocket/slot composites) and part graphs of a few hundred faces, VF2 with good feasibility hooks is fine in practice. **The real risk is not raw matching cost but *combinatorially many matches* from symmetric/highly-repetitive faces — hence dedup-and-claim matters more than raw speed.**

**Safe operating envelope recommendation.** Keep templates ≤ ~30 nodes (we are far below). Add the concave-component pre-partition (Section 6) so each VF2 call sees a small target region. Add a **cap on match enumeration** (e.g., stop after N matches per template face-region) as a defensive guard. Revisit only if a single part exceeds ~10³ faces — and then prefer partitioning + per-region matching over any one monolithic call.

---

## 9. Combining graph recognition with subtractive/additive manufacturing

The manufacturing paradigm is *the* organizing principle for graph-based recognition and our closest conceptual fit:

- **Subtractive features** = material *removed* from a stock (hole, pocket, slot, step). They appear in the AAG as **concave boundaries** and their recognizable signature is a *void* you can carve. Volumetric recognition decomposes the "volume-to-be-machined" into these operations.
- **Additive features** = material *added* (boss, pad, rib). They appear as **convex protrusions**; a boss and a hole are topologically identical (Cylinder + 2 Planes) — the difference is exactly our **inward-normal gate** (`normal·radial < 0` ⇒ subtractive hole; `> 0` ⇒ additive boss). This is already the subtractive/additive distinction expressed geometrically (Issue #3).

Lit realizations:
- **Vandenbrande & Requicha (1993)** explicitly decompose the *volume to be machined* into *volumetric* features ≤ machinability conditions — pure subtractive.
- **Li et al. (2002)** add that a software stock (`S`) is additive while operations are subtractive; additive design features (bosses) must be *converted* to their subtractive negatives for process planning.
- **Woo et al. (2005)** chain graph matching → maximal volume decomposition → negative-feature decomposition, with a **unified hierarchical feature representation capturing machining precedence between interacting features** — the closest blueprint for ordering our own passes.

**Recommendation for us.** Adopt the explicit convention in `feature_templates.py`: every template declares `polarity` ∈ {`subtractive`, `additive`, `neutral`} and `claim_policy` ∈ {`claim_all`, `keep_boundary_caps`}. Then processing is **subtractive-first** (holes → pockets/slots → fillets/chamfers) then **additive** (pads/bosses), matching the machining precedence the literature recommends and giving the claim/removal loop (Section 3) a principled order. This directly encodes the "which faces are exclusive to this feature" decisions we already pass through `HoleParams`.

---

## 10. Recommendations — extend VF2 (do not pivot)

**Overall: extend `src/cad_reverse/recognize/feature_templates.py` + `src/cad_reverse/aag.py` with a decomposition+claim layer. Keep VF2 as the engine.** Nothing in the literature suggests a different *matcher* beats VF2 for deterministic, labeled, small-template, sparse AAG matching; the wins come from control flow *around* the matcher.

### 10.1 Concrete changes to `feature_templates.py`

1. **Grow the `FeatureTemplate` schema** (backward-compatible, defaulting to today's behavior):
   - `required_nodes: frozenset[int] = ALL` — faces that must appear in any accepted match (minimal-condition-subgraph support, Section 5).
   - `polarity: str = "neutral"` — `"subtractive" | "additive" | "neutral"` (Section 9).
   - `claim_policy: str = "claim_all"` — `"keep_boundary_caps"` for through features so outer stock faces aren't consumed (Section 3).

2. **Keep the semantic VF2 hooks** (`_node_template_match`, `_edge_template_match`) — they are already good (surf_type labels + convexity wildcards prune exponentially; this is what keeps us off the worst-case curve of Section 8).

3. **Add a `find` filter** honoring `required_nodes`: after `gm.subgraph_isomorphisms_iter()`, drop matches that don't cover every required node. Where a required *neighbor* is absent (interacting/missing arc), let `params_extractor` synthesize it geometrically (axial span → absent cap), exactly as `_extract_hole_params` already computes depth from cap centroids.

4. **Add a `match` orchestration entry point** (rename/parallel to `match_holes_vf2` — call it `match_features`) that:
   - orders templates `subtractive → additive` (Section 9 precedence),
   - clones the part graph once,
   - for each template, claims faces per `claim_policy` after a successful match (non-overlap enforcement, Section 3),
   - runs per concave-connected-component when the part is large (hygiene for Section 8),
   - returns `dict[feature_name → list[Params]]`.

### 10.2 Concrete changes to `aag.py`

1. **Add `decompose_concave_components(aag)`** (Section 6a): connected components over *concave-only* arcs; each component is VF2's target region. Reuses existing `AAGArc.convexity` / `multi_sample`. Pure additive — no model change.

2. **Add a mutating "claim" helper** for the orchestrated matcher — `aag_clone_without(aag, face_keys) -> AAG` (shallow-copy nodes/arcs, drop entries touching `face_keys`). Keeps the open (unmatched) graph for the next template. (Alternatively add `open_nodes` per-`AAGMatcher`; cloning a shallow dict copy is simplest given `AAG` is a plain dataclass.)

3. **Expose missing-arc recovery assist:** a small `arcs_between(aag, face_keys) -> dict[pair, AAGArc]` so a `params_extractor` can see whether two faces share an arc (helps decide "absent required neighbor" vs "interaction"). Currently the orchestrator must scan `aag.arcs`; hoist it into a named method.

### 10.3 Deliberately NOT doing (justifications)

- **No monolithic merged template graph** (`∪ T_t`). No benefit over sequential matching with shared claim discipline; loses interaction handling (Section 2).
- **No AND/OR multi-interpretation engine.** We need *a* valid decomposition for B-Rep→CadQuery, not a min-cost interpretation set; the schemata above naturally yield one. Revisit only for CAPP outputs (out of scope, Section 4-3).
- **No GNN/segmentation models** (AAGNet, EMD-GNN, FeatureFox). Simultaneous-by-construction and accurate, but violate deterministic scope D2 and need annotated B-Rep datasets (MFCAD++, MFInstSeg, GeoMFD). Documented for a possible later research track, not now.
- **No parallel VF2 / VF3P.** Premature; our graphs are small.

### 10.4 Cost/risk of the recommended path

- **Low risk:** all changes are additive layers around the existing VF2 engine; the two hole templates keep identical behavior under defaulted new fields (backward compat verified by the 246-test suite).
- **Main risk:** claim-policy correctness (boundary-cap handling) regresses thin-walled or co-axial features. Mitigate with the Rule: keep the existing dedup-by-full-key-set AND add a *regression fixture* for a hole-through-pocket and two coaxial holes of different radii before enabling the new orchestrator end-to-end.
- **Effort ordering:** (1) schema fields + defaults, (2) `decompose_concave_components`, (3) claim helper, (4) `match_features` orchestrator, (5) missing-arc geometry completion, (6) new fixtures. Steps 1–4 are the 80% value: genuine simultaneous multi-feature recognition with non-overlap enforcement and interaction-tolerant matching.

---

## Sources

- Vandenbrande & Requicha, *Spatial Reasoning for the Automatic Recognition of Machinable Features in Solid Models*, IEEE TPAMI 15(12), 1993. [ACM entry](https://acnpsearch.tweb-dev.unibo.it/singlejournalindex/34534045) · [Typeset/abs](https://typeset.io/papers/spatial-reasoning-for-the-automatic-recognition-of-216t7lcd79) · [Scholar profile](https://www.semanticscholar.org/author/Jan-H.-Vandenbrande/145433448)
- Sunil, Agarwal & Pande, *An approach to recognize interacting features from B-Rep CAD models of prismatic machined parts using a hybrid (graph and rule based) technique*, Computers in Industry 61(7), 2010. [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S016636151000028X)
- Li, Shah et al., *Modeling of manufacturing feature interactions for automated process planning*, Computer-Aided Design 34(5), 2002 / [Recognition via design-by-feature CAD 34(13)](https://www.sciencedirect.com/science/article/abs/pii/S0010448501011165). [Interaction modeling](https://www.mendeley.com/catalogue/a98dbbef-44d6-331f-8ee6-8dc101bdce0d/)
- Sormaz & Khoshnevis, *AND-OR graph of alternative feature representations / feature precedence networks*, Journal of Manufacturing Systems (2000).
- Marefat et al., *Automatic Recognition of Interacting Machining Features Based on Minimal Condition Sub-Graph*, ASME IDETC/CIE 1997. [ASME DOI](https://asmedigitalcollection.asme.org/IDETC-CIE/proceedings-abstract/DETC97/80470/V005T32A003/1100289)
- McCreesh, Kinnison, et al., *When Subgraph Isomorphism is Really Hard, and Why This Matters for Graph Databases*, JAIR (2018). [ACM](https://dl.acm.org/doi/10.5555/3241691.3241707) · [HAL](https://udl.hal.science/hal-01741928v1)
- Woo, Wang, Kim & Rho, *A Hybrid Feature Recognizer for Machining Process Planning Systems*, CIRP Annals (2005). [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0007850607601310)
- Gao et al., *High-level feature recognition using feature relationship graphs*, Computer-Aided Design (2001). [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0010448501001282)
- Wu, Lei, Peng & Gao, *AAGNet: A graph neural network towards multi-task machining feature recognition* — [GitHub](https://github.com/whjdark/AAGNet) · [instance-seg dataset](https://www.mendeley.com/catalogue/147e01be-590e-331f-ac31-d633988505f7/)
- *Manufacturing feature recognition method based on graph and minimum non-intersection feature volume suppression* (Yan et al. 2023, IJAMT). [EBSCO DOI 10.1007/s00170-023-11031-x](https://openurl.ebsco.com/EPDB%3Agcd%3A3%3A19276756/detailv2?sid=ebsco%3Aocu_results%3Asitemap&id=ebsco%3Adoi%3A10.1007%2Fs00170-023-11031-x&bquery=IS%2002683768%20AND%20DT%202023%20AND%20VI%20125%20AND%20IP%2011%2F12&page=1&crl=f&link_origin=none)
- NUAA (2018), *Manufacturing feature recognition based on graph and subgraph isomorphism* (VF2 semantic/pruning rules). [NUAA](https://jnuaa.nuaa.edu.cn/html/2018/3/20180315.htm)
- *On the Role of Graph Theory Apparatus in a CAD Modeling Kernel* (Slyadnev et al.). [CEUR paper](https://ceurspt.wikidata.dbis.rwth-aachen.de/Vol-2744/paper70.pdf)
- Zhang et al. (2010), *Partial Matching Algorithm of 3D CAD Models Based on the Constraints of Transition Features* (remove blends → reconstruct AAG → subgraph isomorphism). [AMR](https://www.scientific.net/AMR.97-101.3371)
- Faraj, *Manufacturing features: verification, interaction, accessibility and machinability*, IJPR 41(10), 2003. [Taylor & Francis](https://www.tandfonline.com/doi/abs/10.1080/0020754031000090630)
- Biasotti, Marini, Spagnuolo, Falcidieno & Tierny, *Sub-part correspondence by structural descriptors of 3D shapes*, CAD 38(9), 2006. [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0010448506001345)
- FeatureFox (panoptic graph segmentation of B-Rep), arXiv. [ar5iv](https://ar5iv.labs.arxiv.org/html/2604.26770)
