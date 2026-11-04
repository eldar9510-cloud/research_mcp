---
{
  "format": 1,
  "metadata": {
    "id": "archived-deep-research-report-pipeline-robustness-healing-validation-for-cad-reverse-36bb72a0",
    "title": "Deep Research Report: Pipeline Robustness, Healing & Validation for cad_reverse",
    "question": "What findings, alternatives and limitations does the historical investigation document about Deep Research Report: Pipeline Robustness, Healing & Validation for cad_reverse?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Deep Research Report: Pipeline Robustness, Healing & Validation for cad_reverse. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Deep Research Report: Pipeline Robustness, Healing & Validation for cad_reverse; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:43.996Z"
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
  "sourceDigest": "36bb72a08e59a1766243f169d6e6f89cbc322c272a4fd7689d32a6f199290579",
  "proposalRevision": "f9bb230ca9ad0934c6b4ca783bdc1b6b815b2d5147d18f097335d94bbb984b87"
}
---
# Deep Research Report: Pipeline Robustness, Healing & Validation for cad_reverse

**Date:** 2026-08-08
**Agent:** Research squad — pipeline robustness and validation
**Status:** Complete

## Executive summary

cad_reverse is well-positioned: it already applies the *first two rungs* of the OCCT healing ladder (`ShapeFix_Shape`-style topology repair + `ShapeUpgrade_UnifySameDomain`). The research shows real-world STEP hardening needs a **staged escalation ladder** with explicitly set tolerances, a **richer validation suite than `is_valid()`**, return-value best-effort error recovery, and a **sampled-scale benchmark corpus**. Below, each of the 11 topics with concrete APIs, parameter values, and decision trees. Everything is grounded in OCCT 7.8.x behavior (the OCP 7.8.1.1 kernel).

---

## 1. STEP import robustness — where real files break

The root cause of almost every STEP interop failure is **kernel tolerance-regime mismatch**, not wholesale model corruption. The STEP file declares precision via `UNCERTAINTY_MEASURE_WITH_UNIT`, but **each kernel interprets that value differently**. A model watertight in Parasolid (NX/SolidWorks, ~1e-6 inch edge tolerance) shows detectable gaps when imported into an OCCT kernel interpreting the same uncertainty more loosely.

**Per-system export characteristics:**
- **NX / SolidWorks (Parasolid)** — Default tolerance ~0.001 inch ≈ **0.0254 mm**. Exact analytic geometry exports "exact" (effectively zero tolerance). Blends/fillets are re-exported as trimmed B-Splines (different control points/knots/degree than OCCT's own fillet NURBS). Parasolid also marks some edges/vertices "tolerant" and treats them as closed ("topological caulk") even with tiny physical gaps.
- **CATIA / FreeCAD-family (OCCT-based)** — Runs several repair passes on import: forces adjacent edges to share vertices (raising tolerance up to a 1.0 mm default max), detects gaps between parametric curves, fixes self-intersections.
- **Inherent parametric loss** — STEP strips history. A parametric fillet arrives as an anonymous trimmed B-spline.

**Concrete defect catalog:**
- *Geometry:* invalid curve parameterization, gaps in composite curves, degenerate polyline segments, incorrect NURBS knot vectors, untrimmed/self-intersecting surfaces.
- *Topology:* invalid edge vertices, invalid/missing loop definitions, wrong loop/edge orientation, lack of loop MS↔PS synchronization, non-closed or self-crossing loops, missing outer loop, **inverted face normals** (→ negative volume), **zero-length edges**, **near-coincident vertices**, inconsistent coax/on-revolution relations.
- *Non-manifold structures* (self-touching at vertex/edge, 2D sheet attached to 3D solid).

---

## 2. Advanced healing — the escalation ladder

**Critical finding: `ShapeFix_Shape::Perform()` already dispatches to `ShapeFix_Shell`, `ShapeFix_Wire`, `ShapeFix_Edge`, `ShapeFix_Face`, and runs `ShapeFix::SameParameter` by default** — the "advanced" tools are mostly reachable by *tuning the top-level tool's flags and tolerances*, not by reaching for separate code paths.

### OCCT-recommended import order

```
STEPControl_Reader.ReadFile → NbRootsForTransfer → Transfer
  → validate TopAbs_ShapeEnum (SOLID or open SHELL?)
  → if shell: sew via BRepBuilderAPI_Sewing / ShapeUpgrade_ShellSewing
  → BRepBuilderAPI_MakeSolid to promote shell→solid
  → ShapeFix_Shape (configured precision)
  → ShapeUpgrade_UnifySameDomain (only AFTER faces share edges!)
  → re-validate (BRepCheck_Analyzer + non-manifold)
```

### ShapeFix_Shape configuration (concrete parameters)

```
sf = ShapeFix_Shape(shape)
sf.SetPrecision(tol)          # repair precision
sf.SetMaxTolerance(maxtol)    # cap on tolerance OCCT may assign
sf.FixFreeWireMode().Set(True)
sf.FixFreeFaceMode().Set(True)
sf.FixFreeShellMode().Set(True)
sf.FixSameParameterMode().Set(True)
sf.Perform()
sf.Shape()                     # result
sf.Status(k)                   # ShapeExtend_DONE1..6 inspect what was fixed
```

### ShapeFix_Wire::Perform() internal order
1. FixReorder (order disordered edges)
2. FixSmall (drop tiny/redundant edges)
3. FixConnected (topologically connect adjacent edges)
4. FixEdgeCurves (3D/2D curve consistency — reversed pcurves, missing 3D curves, seam fixes, SameParameter)
5. FixDegenerated (add degenerated edges)
6. FixSelfIntersection (2D self-intersections)
7. FixLacking (fill parametric-space gaps)

### Decision tree — healing escalation

```
1. SHAPE LOADED
   ├─ try minimal: is_valid + BRepCheck_Analyzer on raw shape
   │    → VALID? → skip to UnifySameDomain
   │    → INVALID → go to 2
2. Configured ShapeFix_Shape (precision = STEP uncertainty or 1e-5 fallback, maxTol modest e.g. 1e-3)
   ├─ re-validate → valid? → 4
   │   → still invalid / not watertight → 3
3. AGGRESSIVE (only when minimal fails — track every type change):
   a. ShapeFix_Wireframe (FixWireGaps, FixSmallEdges)
   b. Sewing pass: BRepBuilderAPI_Sewing(sewTol) or ShapeUpgrade_ShellSewing
      (sewTol step-up: 1e-5 → 1e-3 → 1e-2 — never go above ~0.1 part-scale)
   c. Re-run ShapeFix_Shape with RAISED precision/maxTol
   d. ShapeUpgrade_UnifySameDomain(last)
4. LAST RESORT: BRepAlgoAPI_Fuse.SelfUnion via SetFuzzyValue(0.01..0.1) to
   eliminate self-intersections — DOCUMENT that this changes topology/geometry
5. Final: re-validate + non-manifold check + volume-sign check
```

**Critical cascade gotchas:**
- `ShapeUpgrade_UnifySameDomain` **silently does nothing unless faces are already connected** — you MUST sew/connect faces first. Apply it LAST.
- `UnifySameDomain` had a released bug (bug29504) producing invalid output; a `TransformPCurves` fix landed. Tune linear tolerance (`-t`, default `1e-7`) and angular tolerance (`-a`, default `1.0°`).

---

## 3. Geometry repair (the "aggressive" tools)

- **`BRepBuilderAPI_Sewing(tol)`** — stitching gaps between faces. `Add(shape)`, `Perform()`, `SewedShape()`. Query `NbFreeEdges()` and `NbMultipleEdges()`. Default tolerance 1e-6.
- **`ShapeUpgrade_ShellSewing`** — promotes shells/solids by sharing contiguous edges/vertices; canonical fix for `BRepCheck_NotClosed`.
- **`BRepAlgoAPI_Fuse` / self-union** — standard workaround for *self-intersecting solids*. **SetFuzzyValue(fuzz)** (e.g. 0.001–0.1). Do NOT use plain Fuse where Sewing would do — booleans are more expensive and fragile on tangent/coincident faces.
- **`ShapeUpgrade_ShapeDivideAngle`** — split surfaces at **C1 discontinuities** so each resulting face is smooth. Important *before* recognition — unsplit angle-discontinuous face presents as single node with false smooth self-relation.
- **`ShapeUpgrade_RemoveInternalWires`** — strips inner wires after they've served recognition.

**Standard OCCT healing pipeline (community consensus):**
```
fix wires (close gaps, drop tiny, reorder) → fix face boundaries (orient wires) →
sew shell (stitch faces) → fix tolerances (propagate sub-shape→parent) →
remove micro-features below threshold
```

---

## 4. Tolerance handling

- **Read STEP uncertainty** and use as base precision. But **never trust it blindly** — sanitize: unrealistic `1e-15` → raise to `1e-5`; coarse `1e-2` stays.
- **Per-face tolerance analysis**: iterate faces, read `Tolerance()`; compute max and spread. Adjacent faces with wildly mismatched tolerances (e.g. 1e-7 vs 1e-2) are the fingerprint of a gappy export.
- **Model-scale-aware clamping**: cap any tolerance to fraction of bbox diagonal (~0.1% of part extent). FreeCAD/OCCT default max is 1.0 mm.

### Decision tree (tolerance):
```
read STEP uncertainty U
if U < 1e-6 : tol_base = 1e-5          # too tight, raise to OCCT-safe floor
elif U < 1e-2 : tol_base = U
else          : tol_base = min(U, 0.1% of bbox diag)
repairTol  = tol_base
sewTol     = clamp(tol_base, 1e-5, 0.1% bbox)          # escalate 1e-5→1e-3→1e-2
verifyTol  = max(tol_base, 1e-5)
```

---

## 5. Validation framework (beyond `is_valid()`)

Build a **multi-gate validation module** returning a structured report.

| Gate | Primitive / metric | Catches |
|------|-------------------|---------|
| Analyzer valid | `BRepCheck_Analyzer.IsValid()` | topology corruption |
| Watertight | `BRepCheck_Shell.Closed()` per shell | open shells, gaps |
| Manifold / edge valence | every edge ∈ exactly 2 faces | non-manifold edges |
| Self-intersection | `BRepAlgoAPI_Check` (+ BndLib bbox pair filtering) | self-interference Analyzer misses |
| Min edge length | sample edge lengths | zero/degenerate edges |
| Sliver faces | face area vs bbox-scale threshold (e.g. < 1e-4) | sliver/skinny faces |
| Normal consistency | face normal vs outward (orientation) | inverted normals → negative volume |
| **Volume sign** | `BRepGProp.VolumeProperties_s` → signed volume > 0 | inverted solid |
| Non-manifold count | count edges with ≠2 faces | unmanufacturable topology |

**WARNING:** `BRepCheck_Analyzer` is *necessary but insufficient* — it can report "valid" while the shape is still self-interfered.

---

## 6. Benchmark corpus

**Use the ABC dataset as the external, scalable source:**
- **1 million STEP files** (B-Rep + mesh + metadata), MIT-licensed, chunked downloads (~1.15 GB STEP per 10k-object chunk).
- B-Rep gives **mathematically exact ground truth** for normals, curvature, patch IDs, topology.
- ~5% models fail OCC meshing — good negative cases.

### Scaling plan (layered):
1. **Keep 16 hand-crafted v1.0 fixtures** as fast regression suite.
2. **Add "defect-injected" tier**: programmatically corrupt clean fixtures → assert healing ladder recovers.
3. **Add sampled ABC tier**: stratified sample of ~50–200 parts covering primitives, single/multi-feature, blends, pockets, holes, sheet-like, and failing-mesh models.
4. Track pass/fail by **gate tier** (CONVERGED / PARTIAL / HEALED-TO-CONVERGED / UNRECOVERABLE).

---

## 7. Differential testing vs commercial tools

- **No open, standardized cross-tool benchmark for B-Rep feature recognition accuracy.** ABC is closest to shared ground truth.
- **What you can run cheaply:** compare cad_reverse against OCC's own `BRepImport`/`xde` re-import and FreeCAD's `Part ShapeFix` results on same corrupt fixtures.
- For real differential numbers vs FeatureWorks/NX: **manual scored subset** — hand-pick ~30–50 ABC parts, have CAD-literate reviewer verify cad_reverse's feature list vs NX FeatureWorks. Precision/recall per feature-class is the natural score.

---

## 8. Performance profiling

**Hot-spot expectations (ranked):**
1. **Boolean ops** (`BRepAlgoAPI_Cut`/`Fuse`) — most expensive, runs on whole solid.
2. **Meshing** (`BRepMesh_IncrementalMesh`) — deviation-quality trade-off dominates.
3. **AAG construction** — O(F) sampling calls.
4. **Recognizer scans** — pocket/fillet geometry queries, VF2 subgraph matching.
5. **Blend mask** — adjacency + conic/radius classification.

### Optimization strategies:
- Add `perf_counter` boundaries at each pipeline stage; emit per-stage timing dict.
- **Cache triangulation** (`BRepMesh_IncrementalMesh` reuses prior) — don't re-mesh per stage.
- **Bounding-box pre-filtering** (`BRepBndLib::AddOptimal`) before every boolean/extrema op.
- Aggregate boolean with `BRepAlgoAPI` on **compounds** once rather than N sequential pairwise ops.
- Consider `parallel=True` on mesh builders for multi-core.
- Cache per-feature intermediate geometry in `ArbitratedFeatures`/pipeline context.
- Avoid re-calling `VolumeProperties_s` — compute once, cache.

---

## 9. Memory handling

- OCCT uses Handle (smart-pointer) free-list memory; Python's GC delays deletion.
- **Known leaks fixed in pythonocc-core 7.9.3** (later than your 7.8.1.1): `TopoDS_Shape` output typemap leaks, `OccHandle`/`FunctionTransformer` SWIG leaks.
- **Must-have pattern:** always store reference to returned parent shape before accessing its children.

### Mitigations:
- **Upgrade cadquery-ocp from 7.8.1.1 → 7.9.x** — the single highest-ROI mitigation (~37% faster exports / 50% less memory + leak fixes).
- Hold explicit parent refs while iterating faces/edges.
- For 1000+-face files, process sub-shapes incrementally.
- Optionally call `gc.collect()` between pipeline stages in batch loops.

---

## 10. Error recovery / graceful degradation

**Recommendation: best-effort per-recognizer isolation with partial-feature emission.**

- Wrap *each recognizer* in its own `try/except`, returning empty list + reason string on failure (`FILTER_RECOGNIZER_CRASHED`).
- Recognizer crash should **never** abort the whole part — only the feature type it owns.
- **Fatal only for core invariants**: if import, healing, or AAG construction fails → raise.
- Tag `PipelineResult` with warnings/partial list of which recognizers errored.
- **Idempotent re-entry**: retried recognizer should reuse cached heal/AAG.

---

## 11. B-Rep comparison metrics (beyond symdiff)

Keep symdiff-volume as headline, but layer a **metric family**:

- **Chamfer distance & Hausdorff distance** — literature-standard for B-Rep reconstruction. **Hausdorff is tricky in OCCT**: `BRepExtrema_DistShapeShape` returns *minimum* distance (0 whenever two solids overlap). Compute via tessellated point clouds instead.
- **Volumetric IoU** — `|A∩B| / |A∪B|` via `BRepAlgoAPI_Common`/`Fuse` volumes. Direct, overlaps-friendly, intuitive.
- **Topology comparison** — face/edge count differences + AAG graph-edit distance (cad_reverse already builds AAG → `to_networkx()`).
- **Per-feature class precision/recall** — hole/fillet/pocket counts matched vs missed.

### Recommended reporting bundle:
`CONVERGED` requires symdiff < 0.001 AND non-negative volume AND reasonable IoU; report chamfer, symmetric-Hausdorff, face/edge delta, and feature P/R as secondary diagnostics.

---

## Priority recommendations (highest ROI first)

1. **Tolerance plumbing + escalation** — read STEP uncertainty, sanitize, clamp to model scale. Currently using OCCT defaults (1e-7).
2. **Upgrade cadquery-ocp 7.8.1.1 → 7.9.x** — captured leak fixes + big memory/time wins.
3. **Fix assembly order**: `ShapeFix_Shape` → sew → `UnifySameDomain` LAST.
4. **Add validation gates beyond `is_valid()`**: Closed(), edge-valence, self-intersection, signed-volume.
5. **Isolate recognizers with try/except + partial-feature emission** and cache intermediate geometry.
6. **Build layered benchmark corpus**: 16 fixture fast-tier + defect-injected + sampled 50–200 ABC parts.
7. **Replace symdiff-only verdict with metric bundle** (IoU + sampled Hausdorff + face/edge delta + feature P/R).

### Sources
- OCCT ShapeFix_Shape Reference (7.8.0, 7.7.0)
- OCCT ShapeFix_Solid Reference (7.0.0)
- OCCT BRepCheck_Analyzer Reference (7.7.0, 8.0.0)
- OCCT Shape Healing documentation
- Dev forum — Step Import and Shape Healing, Fuse without seams, BRepAlgoAPI_Fuse abnormal results
- StackOverflow — How to fix repeated use of BRepAlgoAPI_Fuse
- brepjs — Healing & Sewing
- OCCTSwift — Robust STEP Import #7
- pythonocc-core Memory management discussion #214
- pythonocc-core Releases (7.9.3 leak fixes)
- IfcOpenShell #1124 — memory quirk documentation
- pythonocc-core DeepWiki — Tessellation, Mesh Generation
- ABC Dataset overview (arxiv 1812.06216), Meta Information (NYU archive)
- A2Z-10M+ — Geometric Deep Learning with A-to-Z BRep Annotations (CVPR 2026)
- BrepGaussian — CAD reconstruction with Gaussian Splatting
- Capvidia 3DTransVidia — geometry/topology conflict list
- Ansys Help — Heal
