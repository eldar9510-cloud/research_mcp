---
{
  "format": 1,
  "metadata": {
    "id": "archived-volumetric-decomposition-delta-volume-methods-for-feature-recognition-77df2288",
    "title": "Volumetric Decomposition & Delta-Volume Methods for Feature Recognition",
    "question": "What findings, alternatives and limitations does the historical investigation document about Volumetric Decomposition & Delta-Volume Methods for Feature Recognition?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Volumetric Decomposition & Delta-Volume Methods for Feature Recognition. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Volumetric Decomposition & Delta-Volume Methods for Feature Recognition; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:45.867Z"
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
  "sourceDigest": "77df228811e76755479739e6c1c31c6a897914b320f506e254e75103a3a97573",
  "proposalRevision": "7718318d6da299d92fa9b25a090507c35d07ba666525d783d6dbacd43f6e5ffe"
}
---
# Volumetric Decomposition & Delta-Volume Methods for Feature Recognition

*A deep-research reference for the `cad_reverse` project. Our pipeline is currently
deterministic, B-Rep face-topology based (AAG + blend mask + rule recognizers).
This report explores the alternative **volumetric** paradigm: start from the stock
solid, compute the delta volume (stock − part), and decompose that delta volume into
machining features. We assess whether adding a volumetric pass is worth it on our
CadQuery/OCP stack, and what a minimum viable implementation looks like.*

Compiled 2026-08-06. Sources cited inline and consolidated in
[References](#references).

---

## 0. Executive summary (for the Recommendations reader)

The volumetric family is the **only** recognition paradigm that is *intrinsically
robust to feature interaction* — the failure mode our rule/AAG recognizers hit in
Issues #9/#10/#15. But it is also the most computationally expensive family, its
classic forms are factorial in the number of cells, and it usually produces *form*
features that still need machining classification. The literature's conclusion is
remarkably consistent: **no single approach wins; hybrids do.** The highest-value
use of volumetric machinery inside `cad_reverse` is **not** to replace B-Rep
recognition but to add a *differential* verification/maximal-feature pass that our
deterministic recognizers already half-implement (the blend mask is a "hint"-like
notion grown into faces). The remainder of this report lays out the machinery.

---

## 1. The delta-volume / stock-difference approach

**Core idea.** Let `Stock` be the raw solid (base stock or an intermediate workpiece)
and `Part` the finished solid. The **delta volume** (a.k.a. removal volume,
machinable volume, or Total Removal Volume, TRV) is the regularized Boolean
difference:

```
Delta = Stock −* Part
```

`Delta` is exactly the material that must be removed by machining. Feature
recognition then becomes: *decompose `Delta` into a set of simple sub-volumes, each
removable by one machining operation and each corresponding to a feature
(pocket, slot, hole, step, boss-side removal, ...).* This is the foundation of CAPP
(computer-aided process planning) because each sub-volume maps 1:1 to a cutter-swept
volume and thus to a machining operation.

**Workflow — the "stock−part → removal volumes → individual features" chain:**

1. **Bound the stock.** Either supplied explicitly (raw material definition) or
   derived. For prismatic/milled parts the stock is the part's axis-aligned or
   convex-hull bounding box; more sophisticated pipelines offset the "machined"
   faces outward to reconstruct a casting/forging intermediate (Kim et al., cast-then-
   machined; the POSTECH turning patent extends this by also incorporating the cutting
   tool geometry and machine configuration so decomposed volumes are provably
   cuttable).
2. **Compute the delta volume** via regularized Boolean subtraction.
3. **Decompose the delta volume** into cells/volumes (Section 2).
4. **Classify / re-compose cells into features** using geometry (parallel walls
   → slot, closed concave walls → pocket, coaxial cylinder → hole, etc.) (Sections 3,
   4).
5. **Select an interpretation** among the several feature sets the decomposition can
   produce, driven by machining cost / tool accessibility.

**Formal definition of a machining feature** (Woo & Sakurai 2002 — the canonical
"maximal features" paper). A volume is a machining feature if, and only if:
(i) it is contained in `Delta`; (ii) it can be removed by a single machining
operation on a given machine (e.g. a 3-axis center); and (iii) its removal creates a
portion of the part surface without destroying the part.

**Why this is attractive for cad_reverse:** the recognition no longer depends on the
*fragile face topology* of the finished part. Two interacting features merge faces and
lose AAG arcs; `Delta` absorbs all of that — the intersection region lives in the
volume, and the faces of `Delta` at the boundary between two features are exactly the
geometric evidence the decomposer needs. This is the root of volumetric methods'
interaction robustness.

> Regularization matters: `Delta` must be a **regular** solid (no dangling faces,
> no lower-dimensional slivers). We already do `ShapeUpgrade_UnifySameDomain` +
> `ShapeFix` healing (Issue #11) before every AAG build — the same discipline applies
> before any Boolean cut.

---

## 2. Volume decomposition: from one removal volume to many features

How do you split one complex `Delta` into simple machining features? Three classic
sub-families, in historical order:

### 2.1 ASV / ASVP — Alternating Sum of Volumes (Woo 1982; Kim & Wilde)

**Convex decomposition by recursive hull subtraction.** Express a non-convex object as
an alternating sum of convex hulls:

```
Ω₀ = Σᵢ (−1)ⁱ Hᵢ      where:
  Ω₀ = Ω                      (the original object)
  Hᵢ = convex hull of Ωᵢ → CH(Ωᵢ₋₁) …
  Ωᵢ = Hᵢ₋₁ −* Ωᵢ₋₁           (the "deficiency", a regularized set difference)
```

equivalently `P = CH(P) −* (CH(P) −* P)`, recursing on the difference. The breadth-first
valuation alternates **positive** (additive) and **negative** (subtractive) — exactly the
add/remove structure of machining and of CSG trees.

- **Feature extraction** falls out algebraically: parenthesize the alternating series
  to expose disjunctive (stock-minus-removals) or conjunctive (base-plus-protrusions)
  readings. Tang & Woo's stock+slot+hole example: `H₀ − H₁ + H₂ − H₃` re-parenthesized
  as `H₀ − (H₁ − H₂) − H₃` reads as a stock with two removal volumes (the slot and the
  hole).
- **Fatal flaw — non-convergence.** The series can fail to terminate exactly when two
  consecutive hulls coincide (`Hₖ = Hₖ₊₁`), making the deficiency ASV-irreducible.
  **Kim & Wilde's remedy (ASVP)** — Alternating Sum of Volumes **with Partitioning** —
  adds remedial cuts (RP1/RP2/RP3, based on supportable-vertex classification) that
  split irreducible deficiencies until the series provably converges.
- **Complexity:** each hull/deficiency computation is a 3D convex-hull + Boolean
  difference; the basic form is exponential/factorial in the number of cells and
  produces redundant cells requiring exhaustive validity checks.

### 2.2 Cell-based decomposition by face-extension (Sakurai 1994–2002; Woo & Sakurai)

**The most directly relevant family for a B-Rep implementer.** Instead of hulls, split
`Delta` along the **half-spaces of its own faces that carry concave edges**:

- **Stage 1 — minimal cells.** Extend each "concave-edge" face (or its infinite
  half-space) through the object; the arrangement of these extended cutting planes
  partitions `Delta` into **minimal cells** (atomic convex-ish blocks).
- **Stage 2 — maximal volumes.** Re-compose cells by **search-tree traversal** pruned
  on cell adjacency, into **maximal volumes** — volumes that have as few concave edges
  as possible without introducing new half-spaces.
- **Curved parts (Sakurai & Dave 1996, Part II):** polyhedral face-extension is
  replaced by 2½D machining-volume reasoning over cylindrical/conical faces; minimal
  *convex* cells give way to **maximal volumes** that may be concave but have few
  concave edges.
- **Feature recognition** then graph-matches each maximal volume, or subtracts maximal
  volumes from each other in different orders to synthesize multiple interpretations
  (compound features, interacting-feature alternatives).
- **Scalability fix (Woo & Sakurai 2002):** a **divide-and-conquer** bisection —
  recursively cut sub-volumes with planes until each has fewer than ~16 faces —
  brought recognition of real multi-feature parts into practical time.

**Limitations:** the number of interpretations grows **factorially** with cell count;
many interpretations are unnecessary; curved-object handling is thin (fundamentally
2½D). But the *cell + maximal-volume + graph-match* skeleton is the load-bearing idea
that Tseng & Joshi's Type-1/2/3 interaction recovery, Little et al.'s FeatureFinder
(multi-sided components, accessibility-guaranteed), Kim et al.'s cast-then-machined
ASVP work, and even modern cell-based pipelines all reuse.

### 2.3 Convex decomposition (approximate, hull-soup)

For CAD that is already meshed (or where exact analysis is overkill), **approximate
convex decomposition (ACD)** splits a surface into a minimal number of "near-convex"
clusters with concavity under a threshold. **V-HACD** (Mamou & Ghorbel) does this via
three stages — **voxelization → recursive plane-splitting on min-concavity cut → convex
hull of each part** — with tunable `resolution`, `depth`, `concavity`, and
`max_convex_hulls`. Released in C++ (BSD/MIT) and Rust (Parry `vhacd` module). Its
purpose in the games/physics/Robotics world is collision proxies; its use here would
be a fast, mesh-friendly way to *fragment* `Delta` for further classification, at the
cost of **non-planar/axis-snapping cut planes** that do not match real machining
directions. (See §5 for a caveat: real mills only move along tool axes, so a
manufacturing decomposition must respect those axes, not arbitrary cutting planes.)

---

## 3. What you actually mean by feature classification from a volume

Regardless of the decomposition primitive (hull, cell, voxel cluster, maximal volume),
the same geometric discriminator separates feature *types*. A canonical machining
taxonomy:

- **Depressions (removal volumes):** through slot, blind slot, step, blind step,
  T-slot, v-slot, keyway; open pocket, closed prismatic pocket; through/blind/stepped/
  countersunk/counterbored hole.
- **Protrusions:** boss, handle, rib, web, corner, wedge-step, convex-hull protrusion.

The classification that maps a *volume cell* to a *named feature* is essentially the
same feature-space reasoning our recognizers already do **inverted**: instead of
recognizing a hollow cylinder face-set as a hole, ask whether a candidate removal cell
is (a) coaxial with the stock axis, (b) bounded by a closed concave wall (pocket), or
(c) two parallel walls open at one end (slot). Sae-Tang et al. capture this with the
**feature loop** — a closed loop of concave edges delimiting a hole/pocket/through-slot
at the surface of the part; compound features are feature-loops that need further
decomposition.

---

## 4. Hint-based volumetric recognition (Han 1996; Regli 1996/1997)

The bridge between B-Rep topology and the volume domain — and the most important
single idea for `cad_reverse` given our existing AAG.

**Core concept.** A **hint** is a minimal topological/geometric trace on the *part
boundary* that *implies* a feature's existence. Hints are deliberately **not** full
feature patterns — which is precisely why they survive feature interaction (the 
interacting faces still leave their individual traces even when the merged pattern no
longer matches the AAG template). Two canonical hints:
- two parallel planar walls not on the stock boundary → **slot hint**;
- a cylindrical face not on the stock boundary → **hole hint**.

**Process (IF² at USC, Han 1996; F-Rex at Maryland, Regli; FBMach at Allied Signal —
"generate–test–repair"):**

1. **Compute the delta volume** (`Stock − Part`).
2. **Generate hints** from part-boundary face patterns within `Delta`.
3. **Complete the hints into maximal removal volumes.** From a hint, propose a
   maximally-extended cutter-swept volume; **test** whether it intrudes into `Part`;
   **repair** it (trim/extend) until it is a valid maximal volumetric feature. This
   completion is where the *volume domain* earns its keep: the missing/merged faces of
   interacting features are geometrically reconstructed by extending their half-spaces
   until they close.
4. **Prioritize hints** (Han: heuristic-strength-ranked priority queue) to cut the
   search space — this directly addresses the "many redundant hints" weakness.
5. **Emit a feature set.** The output is a decomposition of `Delta` into
   **cutter-swept volumes** that tie directly to machining operations.

IF², F-Rex, and FBMach all decomposed the nine benchmark machining parts, including
features with disconnected walls/floors caused by intersections — the signature
interaction robustness. The Han–Regli **status report (1998, CAD 30:1003)**
positions hint-based reasoning as the *class III combination*: graph-based hint
generation (cheap, robust) + volumetric completion (handles interaction).

**Critical comparison (from Han–Regli–Brooks):** hint-based vs. pure convex
decomposition — **"there is no clear winner; it depends on the design objectives."**
Hint methods are feature-dependent but efficient (extend only selected faces); convex
decomposition is feature-independent but computationally expensive (decompose into
minimal convex cells first, then concatenate). This is the **exact tradeoff survey
that motivates our hybrid recommendation.**

---

## 5. The machining / milling perspective

Volumetric recognition inherits a *positively* manufacturing-friendly structure that
graph/rule methods lack:

- **Every recognized sub-volume is a cutter-swept volume.** Completed hints and
  maximal volumes are, by construction, the sweep of a cutter along a tool axis. The
  feature tree **is** a candidate process plan: each feature → an operation, with a
  natural partial order (e.g., blind-before-through, large-roughing-before-finishing).
  Report 03's ordering work maps almost 1:1 onto machining precedence.
- **A critical constraint graph-based/rule-based CAD recognition ignores:** a real
  3-axis mill moves the cutter only along tool axes. The decomposition **planes must
  be axis-aligned (or the stock axis for turned parts)**, otherwise the "feature" is
  not actually machinable. This is why arbitrary-ACD (V-HACD) hull cuts are *not* a
  manufacturing decomposition despite being a valid volumetric one.
- **Multiple interpretations are a feature, not a bug.** Sakurai, Woo, Tseng & Joshi
  all lean into *alternative* decompositions priced by machining cost; process planning
  then picks the cheapest. Graph-based recognition, in contrast, returns the pattern
  matches it was coded to find — a single "design intent" reading.

The pipeline for manufacturing is therefore *delta → cells → maximal volumes → costed
interpretation → ordered operations*. Our current pipeline *ends* where manufacturing
planning would *begin* (recognize + order + emit), so a volumetric pass is a
natural upstream source of a **manufacturing feature tree** rather than a design-feature
tree.

---

## 6. Volumetric vs. graph-based (B-Rep) approaches

| Criterion | Graph-based (our current AAG/rule) | Volumetric (delta/hint/convex) |
|---|---|---|
| **Robustness to feature interaction** | **Weak** — merged faces drop AAG arcs; pattern match fails (our #9/#10/#15 pain) | **Strong by construction** — `Delta` and completion absorb interaction; no topology to lose |
| **Accuracy/origin** | Exact B-Rep match; mirrors design intent | Removes/zeroes whatever the Boolean leaves; may produce form volumes not features |
| **Computational cost** | High but prunable: subgraph isomorphism is expensive; mitigated by broad-phase rule filters + component-split AAGs | **High, often exponential/factorial** in cells; convex-divergence and redundant-cell checks dominate |
| **Curved-surface support** | Strong (analytic surfaces, our hole/cbore/csk recognizers) | Thin/2½D (Sakurai Part II); cylindrical/conical handled specially |
| **Output type** | Stereotypical design features directly | Form features requiring re-classification into machining features |
| **Interpretations** | Usually one pattern-driven set | Many; needs a selection policy |
| **Determinism** | High, but path-order dependent for rules | High per fixed algorithm, but interpretation selection is a search |

**Bottom line:** neither family alone satisfies all four practical axes —
interaction robustness, cost, curvature support, and manufacturability. Volumetric
wins interaction, costs the most, and needs a layer of machining semantics; graph
wins on cost-of-expectations, exact design intent, and curvature, but dies on
interaction. Every modern literature review reaches the same hybrid verdict, hence:

---

## 7. Hybrid approaches — B-Rep hints for generation, volume for completion

The strongest practical recipes all **generate from B-Rep, complete in volume:**

1. **Graph + volume (Wong & Lam 2000).** FES-graph recognition extracts primitive
   features; a volume-based clustering then assembles them into machining volumes —
   giving interaction robustness (from volume) *and* correct primitive identity (from
   graph). A neural net handles non-orthogonal/arbitrary forms.
2. **Graph + hint (Gao & Shah; Rahmani & Arezoo).** Extract **Minimal Condition
   Sub-Graphs** / concave subgraphs as hints, then complete them *geometrically* in
   the volume domain. Handles interactions well; "geometrically intensive."
3. **Rule/rule + isomorphism (Analysis Situs's present-day engine).** Fast
   rule-based recognition acts as a *broad-phase* decomposer partitioning the search
   space, then expensive subgraph isomorphism runs only on the small candidate
   sub-graphs to pin the exact feature subtype (e.g., countersunk vs. counterbored).
4. **Hint completion as the canonical hybrid (Han/Regli §4).** Face-pattern hints from
   B-Rep → maximal-volume completion in the solid domain.

The unifying pattern, and the one `cad_reverse` already half-uses: **use the B-Rep/AAG
to narrow the candidate space, then shift to solids to settle the ambiguous cases.**
Our blend mask, hole/pocket recognizers, and stock profile are, in effect, manual
hint generators; nothing yet closes them into volumes when faces have merged.

---

## 8. Can we implement volume decomposition on CadQuery/CadQuery-OCP?

**Yes — the OCC primitives are all present in `cadquery.occ_impl` / OCP**, and our
module already has `ocp_utils.py` wrapping 20+ OCP primitives. What we'd need:

### 8.1 Boolean difference (the delta volume) — available today
- **`BRepAlgoAPI_Cut(S1, S2)`** (`S1 = stock`, `S2 = part`) → `Delta`. Exposed through
  CadQuery as `Workplane().cut(...)` / `cadquery.Shape` cut; at the OCP level
  `ocp_utils` already calls BRepAlgoAPI_Fuse classes. We'd add a `BRepAlgoAPI_Cut` /
  `BRepAlgoAPI_Common` wrapper (mirroring the existing fuse pattern).
- **Robustness knobs we already know:** `SetFuzzyValue` (1e-6–1e-4) for
  nearly-coincident faces, `ShapeUpgrade_UnifySameDomain` (Issue #11 healed imports),
  `ShapeFix` validity fallback, `BRepCheck_Analyzer` pre-check, `SetRunParallel».
  Our heal pipeline is the prerequisite; a bad cut returns open/tangled shells
  otherwise.
- **History:** `BRepAlgoAPI_BooleanOperation` exposes `Modified/Generated/IsDeleted`
  to map which sub-shapes survive — useful for re-identifying features across a cut.

### 8.2 Extending faces into half-spaces (the Sakurai cell machinery) — available, hand-built
- **Cut one solid by an infinite plane:** build an infinite/oversized planar solid and
  `BRepAlgoAPI_Cut` — *not* `BRepAlgoAPI_Section` (that gives only edges/wires, not
  volumes). This is the "extend the face, slice the delta" operation for cells.
- **Recover the source face as a plane:** reuse our existing planar-face detection +
  `gp_Pln`/normal extraction (Issue #3/#5 machinery) to get the cutting half-space.
- **Requires us to build the cell-arrangement ourselves.** OCC does not expose a
  "decompose a solid by the arrangement of internal faces" primitive. `BOPAlgo_CellsBuilder`
  (cellular boolean) is the closest OCC-native tool — it decomposes shapes into atomic
  cells and lets you add/remove regions; it could underpin cell construction but is a
  heavier, less-stable API than a hand-rolled extend-and-cut loop for our small 2½
  features.

### 8.3 Convex hull — available
- Convex hull of a solid: `Bnd_B3f`/bounding is OBB only. For the hull *of a solid's
  exact geometry* we'd use `BRepBndLib` (aabb/obb) as a quick stock proxy, or compute a
  true convex hull from the sampled vertices (e.g., `qHull`-style on `BRep_Tool::Pnt`
  vertices, or CadQuery's neighbors in scipy — already a project dependency for the
  Issue #14 ML study). For hull-of-delta we have `Delta`'s vertices directly.

### 8.4 Approximate convex decomposition (V-HACD)
- **Not native to OCC/CadQuery.** Requires meshing `Delta` (OCCT `BRepMesh_IncrementalMesh`
  is available internally) then running V-HACD (C++ lib, or Rust `parry2d/parry3d`
  `vhacd` module, or a Python binding). A Python shim around the C++ V-HACD
  (`pip`-installable) is feasible but pulls a new binary dependency into a project
  that deliberately has only `cadquery`/`cadquery-ocp`/`networkx`/`scipy`. **Not
  recommended for v1** (§5 caveat: non-axis-snapping cuts).

### 8.5 What OCC does NOT give us (and we must build)
- **The decomposition driver:** which faces/half-spaces to cut, in what order, and the
  search-tree pruning for maximal volumes. This is the algorithmic heart (Sakurai §2.2)
  and is OCC-independent.
- **Multiple-interpretation enumeration** and the cost model to pick one.
- **Curved-object cell decomposition** (the thin part of the literature).

### 8.6 Simplification opportunity specific to our domain
Our v1 features are **2½D extruded prismatic** (all faces extruded along one axis,
evidence in report 03's "profile-extrude" D6). That means the *full 3D* Sakurai
machinery is overkill: an axis-aligned cell decomposition of a 2½D `Delta` reduces to
**2D face-region decomposition in the base profile** — cut the profile's polygon along
the concave-edge boundaries (essentially a 2D polygonal decomposition), extrude each
cell, and classify. This is far cheaper and far more implementable than general ASVP,
and aligns with the stock/workplane profile conventions we already have. **This is the
recommended minimum viable implementation.**

---

## 9. Lightweight/hybrid options without full CSG reconstruction

The classic ASVP/CSG-tree path (§2.1) is heavyweight. Recommend the lighter tiers:

1. **Differential delta-volume as a *verification oracle* (cheapest, highest
   leverage).** We already compute **symdiff** as the gold gate. Adding `Delta =
   Stock − Part` lets us assert that the *union of recognized feature volumes*
   approximates `Delta` (symdiff of the re-fused feature set against `Stock−Part`).
   This converts "how close is my reconstruction" from a whole-part number into a
   **per-feature closure check** — directly diagnosing which recognizer dropped or
   over-claimed a volume (the #10/#15 class of bugs). **No new decomposition needed.**
2. **Hint completion only on *unclaimed* concave regions.** Run the normal B-Rep
   recognizers; collect the leftover concavities (the blend-mask hits that matched
   nothing); for each, do a single `Cut`-based grow-and-trim to decide "is this a real
   feature or a residual of an interaction?" — the Han/Regli repair step, done lazily
   instead of for every feature. This bounds the cost to the hard cases only.
3. **2½D axis-aligned cell decomposition** (§8.6) when you want actual manufacturing
   features: Boolean-cut the delta by the concave-edge face planes, extrude/profile-
   decompose, classify. The genuinely useful subset of §2 for our shapes.
4. **Full ASVP / maximal-volume / V-HACD** — defer; correct but complex, and
   unnecessary for the 2½D prismatic fixture suite cod_reverse targets.

---

## Recommendations

### Should we add a volumetric pass?
**Yes — but as a complement, not a replacement, and only in the two cheapest forms.**
The graph/rule family that `cad_reverse` already implements is provably the weakest on
feature interaction (Issues #9/#10/#15), and the volumetric family is provably the
strongest there and the *only* one that produces a manufacturing feature tree. Adding
any volumetric machinery therefore directly attacks our known failure mode. However,
the classic forms (ASVP, Sakurai cell-enumeration, general convex decomposition) are
too expensive and too curved-poor to justify as a wholesale reimplementation, and our
deterministic, no-new-dependency philosophy argues against pulling a V-HACD binary.
The correct posture is **"differential delta-verify now, lazy hint-completion next,"
** with the 2½D decomposition as a future larger piece.

### Minimum viable implementation (on CadQuery/OCP), in order of value:

1. **Delta-volume oracle (recommended; ~1 new module + a few OCP wrappers).**
   - Add to `ocp_utils.py`: `BRepAlgoAPI_Cut` and `BRepAlgoAPI_Common` wrappers
     (assert-loudly checking `IsDone()`/`HasErrors()`; apply `SetFuzzyValue(1e-5)`,
     run through the existing heal).
   - Add `recognize/delta.py`: `delta_volume(stock, part) → Delta` (reuse stock
     profile from `recognize/stock.py` as `stock` when no stock is supplied).
   - Add an oracle comparison in `oracle.py`: symdiff of the **refused feature set**
     (order + emit + re-extrude the emitted CadQuery) vs. `Delta`. Wire into
     `pipeline.py` as an additional field on `PipelineResult` (e.g.,
     `feature_delta_symdiff`) — turning the whole-part convergence metric into a
     per-direction diagnostic that pinpoints under/over-claimed volumes.
   - **Acceptance:** for each of the 16 fixtures, `feature_delta_symdiff < 0.001`;
     guard on interaction cases (#9/#10/#15) to show the delta catch.
2. **Lazy hint completion (recommended after #1; ~1 more module).**
   - For blend-mask concavities that matched no template (`UNMATCHED_*` reason codes
     already exist), grow the concave face into a candidate solid (extend the face's
     half-space, cut `Delta`), trim against `Part` (inverse cut), and classify the
     resulting volume with the existing geometric rules. This is the Han/Regli
     generate–test–repair step, run only on hard cases.
   - **Acceptance:** the previously-PARTIAL interaction fixtures either gain a matched
     feature or a recorded `VOLUME_COMPLETION` escalation (same style as existing
     reason codes).
3. **2½D axis-aligned cell decomposition (future, larger).** Only if #1/#2 prove the
   value: decompose `Delta`'s 2D base profile along concave-edge boundaries, extrude
   cells, classify → true manufacturing feature tree feeding report 03's orderer.
   Keep it axis-aligned to respect machining freedom (§5).

### Explicit non-goals
- Full ASVP / maximal-volume enumeration, and V-HACD-based ACD — reject for v1:
  factorial/expensive, curved-poor, non-axis-snapping (not manufacturing-correct), and
  they pull in binary/algorithmic complexity inconsistent with the project's
  deterministic, `cadquery`/`cadquery-ocp`-only stack.

---

## Dependencies / new-code map (delta-verify tier)

| Piece | Where | Notes |
|---|---|---|
| `cut` Boolean wrapper | `ocp_utils.py` | `BRepAlgoAPI_Cut`, assert-loud, fuzzy value, heal-in |
| `common` wrapper | `ocp_utils.py` | `BRepAlgoAPI_Common` (for intersection-based refinement later) |
| `delta_volume()` | new `recognize/delta.py` | stock from stock recognizer; reuse existing planar/normal helpers |
| delta-symdiff oracle | `oracle.py`, `pipeline.py` | `feature_delta_symdiff` field on `PipelineResult` |
| lazy hint completion | new `recognize/complete.py` | grow/trim/cut, classify with existing rules, new reason codes |
| tests | `tests/test_delta.py`, roundtrip additions | per-fixture delta-verify + interaction guards |

Only deps: existing `cadquery`, `cadquery-ocp`, `networkx`, `scipy`. No new binaries.

---

## References

- Wo Y., Sakurai H. — *Recognition of maximal features by volume decomposition*, CAD 34 (2002) 723–734. https://www.sciencedirect.com/science/article/abs/pii/S001044850100080X
- Sakurai H., Dave P. — *Volume decomposition and feature recognition, part I: polyhedral objects* (1995); *part II: curved objects* (1996). https://www.semanticscholar.org/paper/Volume-decomposition-and-feature-recognition%3A-part-Sakurai/6b7469ec217f8b558b820d531aa33115f7509ee4
- Sakurai H., Dave P. (Woo & Sakurai, 1994/1995) — *Decomposing a delta volume into maximal convex volumes and sequencing them for machining* (CIE94); *Maximal volume decomposition and its application to feature recognition* (CIE95). https://asmedigitalcollection.asme.org/IDETC-CIE/proceedings-abstract/CIE94/13805/135/1103723
- Woo T. — ASV (1982); Kim Y., Wilde D. — ASVP (convergence remedy). Tang K., Woo T. — *Algorithmic aspects of alternating sum of volumes* (1991), 10.1016/0010-4485(91)90029-V; Kim Y., Wilde D., *A convergent convex decomposition of polyhedral objects*, 10.1115/1.2926575. Aguilera A., Ayala D. — *Faster ASV decomposition for orthogonal polyhedra using the EVM* (2000). https://otik.uk.zcu.cz/xmlui/handle/11025/15429
- Han J., Regli W., Brooks S. — *Hint-based reasoning for feature recognition: status report*, CAD 30 (1998) 1003–1007. https://www.sciencedirect.com/science/article/abs/pii/S001044859800061X
- Regli W. — *Geometric algorithms for recognition of features from solid models* (PhD, Maryland, 1996 + F-Rex); Han J. — *3D geometric reasoning algorithms for feature recognition* (USC, 1996 + IF²); Han, Regli, Rosen — *Special panel session for feature recognition* (ASME DETC 1997). https://www.semanticscholar.org/paper/SPECIAL-PANEL-SESSION-FOR-FEATURE-RECOGNITION-Han-Regli/ecec71d598504aa3d165f330fcc20869b36f2287
- Kim Y., et al. — *Recognition of machining features for cast then machined parts* (2001). https://www.sciencedirect.com/science/article/abs/pii/S0010448501000586
- Little G., et al. — *Delta-volume decomposition for multi-sided components* (FeatureFinder, 1998). https://www.sciencedirect.com/science/article/abs/pii/S0010448598000232
- Tseng Y., Joshi S. — *Volume decomposition for interacting features* (1994); *Recognizing multiple interpretations in 2½D machining of pockets* (1994). https://www.scilit.net/publications/cb7c7b1e4d65daac652ec19d28044a51 ; http://www.jstage.jst.go.jp/article/kikaic1979/63/607/63_607_1021/
- Wong T., Lam S. — *Automatic recognition of machining features from CAD part models* (2000), 10.1243/0954405001517810; Wong & Lam, FES hybrid *graph + rule* (2010). https://www.sciencedirect.com/science/article/abs/pii/S016636151000028X
- Sae-Tang J., et al. — *Volumetric machining form feature recognition using feature loop* (1997); *Volumetric feature recognition using convex decomposition*. https://www.sciencedirect.com/science/article/abs/pii/B9780444816009500080
- Gao & Shah — minimal condition subgraphs; Rahmani & Arezoo, *Boundary analysis and geometric completion for recognition of interacting machining features* (2006), 10.1016/j.cad.2006.10.00x. https://www.sciencedirect.com/science/article/abs/pii/S0010448506000777
- Analysis Situs — *Feature recognition principles* (rule broad-phase + isomorphism), https://www.analysissitus.org/features/features_recognition-principles.html ; Slyadnev et al. (2020), AAG split into connected components before isomorphism.
- Zubair A., Abu Mansor M. — *Automatic feature recognition of chamfer and fillet for turning part model by volume decomposition* (2018). https://ir.uitm.edu.my/id/eprint/39393/ ; Kataraki & Abu Mansor, *Auto-recognition and generation of material removal volume for regular form surfaces* (2017), 10.1007/s00170-016-9394-6.
- HACD/V-HACD — Mamou K., Ghorbel F., *Volumetric hierarchical approximate convex decomposition*; V-HACD library, https://github.com/kasparasnbg/VHACD ; Parry `vhacd` module, https://docs.rs/parry2d-f64/latest/parry2d_f64/transformation/vhacd/ ; VX-HACD (voxel variant, 2025), https://ieeexplore.ieee.org/document/11164152 .
- Open CASCADE Technology reference — `BRepAlgoAPI_Cut`, `BRepAlgoAPI_Common`, `BRepAlgoAPI_BooleanOperation`, `BOPAlgo_CellsBuilder`, `SetFuzzyValue`, https://dev.opencascade.org/doc/occt-8.0.0/refman/class_b_rep_algo_a_p_i___cut.html ; bitbybit `BRepAlgoAPI` / `BOPAlgo` boolean notes, https://deepwiki.com/bitbybit-dev/bitbybit-occt/4.2-boolean-operations .
- Regli W., et al. — *A Discourse on geometric feature recognition from CAD models*, JCISE (2000). https://nro-dd.sagepub.com/lp/crossref/a-discourse-on-geometric-feature-recognition-from-cad-models-wXPCAlUoPR?
- AAGNet, https://github.com/whjdark/AAGNet ; MFDataset (33 machining feature classes), https://github.com/leiruoshan/MFPointNet_feature_dataset ; BRepFormer, https://www.aimodels.fyi/papers/arxiv/brepformer-transformer-based-b-rep-geometric-feature .
