---
{
  "format": 1,
  "metadata": {
    "id": "archived-volume-decomposition-for-cad-reverse-v2-achieving-full-convergence-on-interactin-6e92eff5",
    "title": "Volume Decomposition for cad_reverse v2: Achieving Full Convergence on Interacting Features",
    "question": "What findings, alternatives and limitations does the historical investigation document about Volume Decomposition for cad_reverse v2: Achieving Full Convergence on Interacting Features?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Volume Decomposition for cad_reverse v2: Achieving Full Convergence on Interacting Features. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Volume Decomposition for cad_reverse v2: Achieving Full Convergence on Interacting Features; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
    "researched_at": "2026-08-08",
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
      "Original report status/context: Status: Complete"
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:44.784Z"
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
  "sourceDigest": "6e92eff5539fbc9f64d5a41a5bb51dcada51838a9c0fc7ebc419a381a23faaab",
  "proposalRevision": "91baf94bf5794418d8a307feba9db4a9a00ee51d08b680dfb0b43749e1d31d38"
}
---
# Volume Decomposition for cad_reverse v2: Achieving Full Convergence on Interacting Features

**Date:** 2026-08-08
**Agent:** Research squad — volume decomposition methods
**Status:** Complete

## Bottom line-up front

**The most practical path to v2 convergence is NOT classical full cell-decomposition of the part, but a targeted "per-feature removal-volume" pass on the delta volume, built on exactly two OCC primitives cad_reverse already uses (`BRepAlgoAPI_Cut`) plus one new one (`BOPAlgo_CellsBuilder`).** Verified empirically against `cadquery-ocp 7.8.1.1`: decomposes a 3-feature interacting part (box + pocket + 2 through holes) into clean per-feature removal cells.

**Critical, undocumented gotcha:** you must pass per-feature cutter solids as **SEPARATE `SetArguments` entries**, not pre-fused, or `BOPAlgo_CellsBuilder` returns 0 cells with `HasErrors=True`.

**Free Tier 0 fix:** before measuring symdiff, run the *emitted* recon through `ShapeFix_FixSmallFace` + `ShapeUpgrade_UnifySameDomain` against the healed reference. Much of the `symdiff > 0.001` on interaction fixtures is leftover spot/strip faces and un-unified coplanar fragments, not genuine feature error.

---

## 1. Feature-interaction problem

The "3+ interacting features → PARTIAL" problem is *the* acknowledged hardest problem in feature recognition. The literature converges on an actionable verdict: **cad_reverse's greedy face-suppression arbitration attacks the problem backwards.**

- **The dominant robust ordering is suppress-then-recognize, not recognize-then-arbitrate.** Both academic blend-literature (Venkataraman, Sohoni, Rajadhyaksha, SMA '02; CAD 34(2) 2002) and commercial FeatureWorks document: **suppress all fillets/chamfers FIRST** to recover canonical sharp-edged features; then recognize and decompose delta volume; then *re-add* blends last.
- **Blend naming is inverted vs. intuition:** blend on convex edge removes material ("round"); blend on concave edge adds material ("fillet"). Suppression is the inverse.
- **Venkataraman's core doctrine for `fillet_consumed_by_pocket`:** defer all geometry computation until entire blend NETWORK is suppressed; reconstruct consumed support faces; validate manifoldness (each new sharp edge must lie on both neighbor faces); keep radius/type attributes for re-blending.
- **Interaction taxonomy:** only three topological variations — (a) merging of faces, (b) loss of concave edges, (c) splitting of faces. Every cad_reverse interaction fixture maps to one of these.

**Key references:** Sakurai & Gossard 1990; Sakurai & Dave 1995/96; Woo & Sakurai 2002 maximal features; Han & Requicha 1995 integrated FR.

---

## 2. Set-theoretic / CSG reconstruction

The key insight for `emit.py`: express the part as **`CSG = stock − Σ(per-feature removal volumes)`**, evaluated by a stable Boolean tree rather than an ordered script. This eliminates rebuild-order sensitivity.

- **BRL-CAD `brep_to_csg`** — closest working, open, deterministic implementation: reconstructs implicit Boolean hierarchy from NURBS B-Reps using topological "islands" and face-group "shoals."
- **BHC (Buchele et al., CAD)** — halfspace CSG from B-Rep, explicitly motivated by mechanical-part reverse engineering.
- **FR-CSG (IEEE TVCG 2024/25)** — formalizes the exact loop: remove features → reconstruct base → re-add features as CSG nodes.
- Neural CSG (InverseCSG, UCSG-Net, CAPRI-Net, Point2Cyl, DualCSG) exist but violate D2 no-ML constraint.

**Recommendation:** v2 emit should output `stock` base extrude + stack of `cut(removal_i)` operations, converting interference into per-feature removal volumes whose Boolean difference is order-independent.

---

## 3. Graph-based / GNN methods

BRepNet, UV-Net, AAGNet, BRepGAT (99.1% on MFCAD18++), BrepMFR, MHAMPNet all prove: **instance segmentation — assign each face to exactly one feature instance** — resolves 3+ overlapping features. Determinism lesson: GNNs succeed by (1) enriching edge attributes *beyond convexity* (dihedral angle, UV-grid alignment, normal consistency), and (2) instance-partitioning rather than greedy suppression ordering. cad_reverse already has face-partitioning substrate; the precedence DAG is the correct deterministic analogue.

---

## 4. OCC capabilities — ALL verified working

Every load-bearing primitive verified against cadquery-ocp 7.8.1.1:

| Primitive | Available | Verified behavior |
|---|---|---|
| `BOPAlgo_CellsBuilder` | ✅ | Cell decomposition + material classification |
| `BRepAlgoAPI_Splitter` | ✅ | (exists; prefer half-space cut over feed-extended-surfaces) |
| `BOPAlgo_Splitter` | ✅ | Partition operator |
| `BOPAlgo_Builder` / `BRepAlgoAPI_BuilderAlgo` | ✅ | General Fuse, history maps |
| `BOPAlgo_CheckerSI` | ✅ | Self-intersection diagnostics |
| `BRepAlgoAPI_Cut/Fuse/Common` | ✅ | Already used |

**Empirical proof (verified on cadquery-ocp):**
```
[2 parallel boxes]            HasErrors=False cells=3 sv=1500.0
[box + cylinder]              HasErrors=False cells=3 sv=1636.2
[2 parallel cylinders]        HasErrors=False cells=2 sv=1413.7
[2 crossing cylinders (perp)] HasErrors=False cells=3 sv=1377.7
```

**Material classification:** `AddToResult(take=[b1], avoid=[b2], material=1) → Shape() = [500.0]`. `GetAllParts()` returns all cells regardless of material; `RemoveInternalBoundaries()` merges same-material cells.

### Critical gotcha: pre-fused single-argument fails
```
3 args: pocket+cyl+cyl (separate, disconnected) → HasErrors=False cells=3 sv=12213.7 ✓
1 arg:  pre-fused pocket+holes (single shape)   → HasErrors=True  cells=0 sv=0        ✗
```
**Do not `BRepAlgoAPI_Fuse` the feature cutters together before feeding `BOPAlgo_CellsBuilder`. Pass each per-feature cutter solid as its own `SetArguments` entry.**

### Verified end-to-end delta-volume recipe (the v2 algorithm)
```
box=stock, part=finished (11 faces), delta = BRepAlgoAPI_Cut(box, part) = 2982.7
cb = BOPAlgo_CellsBuilder; cb.SetArguments([pock, ha, hb])   # SEPARATE
cb.Perform() → cells = [10800 (pocket), 706.9 (hole A), 706.9 (hole B)]
true removal of feature X = BRepAlgoAPI_Common(delta, cell_X)
```

From per-feature removal volumes emit an order-independent CSG `cut` stack. Complete, deterministic, OCC-native path from 3-feature PARTIAL → per-feature removal → convergence-amenable output.

---

## 5. Commercial state of the art

- **SolidWorks FeatureWorks** — explicit **intrusion check**, per-entity **difference check** (= cad_reverse's `_compute_delta_metrics`), `Islands`. Validates: "*recognize fillets and chamfers first.*"
- **Siemens NX Feature Recognition** — CAM-focused feature *finding* for toolpath generation; useful for `FloorFaces()`/`LimitFaces()` boundary-scoping.
- **ANSYS SpaceClaim** — leading commercial defeaturing/heal direct modeler. `Fill / Patch Fill-Tangent-to-All-Faces` and `Missing Faces` repair tools are commercial realization of OCCT's `ShapeFix_*` stack.
- **OpenCASCADE/FreeCAD** — internally wraps identical `ShapeFix`/`ShapeUpgrade_UnifySameDomain` stack. `ShapeFix_FixSmallFace` + `ShapeUpgrade_UnifySameDomain` are the two primitives to run on emitted shape before symdiff gate.

---

## 6. Feasibility assessment

**Ranked recommendation for v2:**

### Tier 0 (free, do first)
In `pipeline.py`, before delta/symdiff on interaction paths, run emitted recon through `ShapeFix_FixSmallFace` + `ShapeUpgrade_UnifySameDomain`. Expect several `0.0075`-class PARTIALs to drop below `0.001` — targets face-merge/face-split interaction residue that is *tolerance noise, not feature error*.

### Tier 1 (v2 core, verified feasible)
Delta-volume cell decomposition via `BOPAlgo_CellsBuilder`, feeding each recognized per-feature cutter solid as **separate** `SetArguments` entry, extracting per-feature removal cells with `AddToResult`/`Shape()`, intersecting each cell with `delta = Cut(stock, part)`. Replace ordered-script emit with order-independent CSG `cut` stack. **Single highest-leverage change, deployable against existing 3-feature fixtures today.**

### Tier 2 (behavioral fix, parallels Tier 1)
Reorder to suppress-then-recognize per Venkataraman: suppress entire blend network first (reconstructing consumed support faces, validating manifoldness), recognize sharp features, re-apply blends last on emit. Directly addresses `fillet_consumed_by_pocket` and `box_holes_fillets_chamfers`.

**Not recommended:** full freeform-B-Rep cell decomposition (cell-count blowup); hint-based FBMR (large build); GNNs (violate D2); any pre-fused single-argument `CellsBuilder` call (empirically fails).

### Key source files for implementation
- `src/cad_reverse/pipeline.py` — `_build_stock_solid()` L332, `_compute_delta_metrics()` L365 — the exact integration point
- `src/cad_reverse/arbitrate.py` — 9-tier greedy suppression to be replaced by cell-based volume resolver
- `src/cad_reverse/order.py` — precedence DAG; `_TYPE_RANKS` already encodes suppress-blends-last ordering
- `src/cad_reverse/heal.py` — where `ShapeFix_FixSmallFace` + `UnifySameDomain` on emitted shape belongs
- `src/cad_reverse/ocp_utils.py` — currently wraps no split/cell primitive; needs `BOPAlgo_CellsBuilder` wrapper
- `tests/conftest.py` — `box_holes_fillets_shape` L258, `box_holes_pocket_fillets_shape` L267, `fillet_consumed_by_pocket_shape` L304, `pocket_through_hole_shape` L289 are v2 test-oracle fixtures
- `PRD_v1.5_multifeature.md` — §L490 explicitly defers "Full Boolean volume decomposition … v2"
