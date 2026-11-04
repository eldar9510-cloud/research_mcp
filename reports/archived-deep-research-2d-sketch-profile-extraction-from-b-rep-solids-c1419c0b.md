---
{
  "format": 1,
  "metadata": {
    "id": "archived-deep-research-2d-sketch-profile-extraction-from-b-rep-solids-c1419c0b",
    "title": "Deep Research: 2D Sketch/Profile Extraction from B-Rep Solids",
    "question": "What findings, alternatives and limitations does the historical investigation document about Deep Research: 2D Sketch/Profile Extraction from B-Rep Solids?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Deep Research: 2D Sketch/Profile Extraction from B-Rep Solids. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Deep Research: 2D Sketch/Profile Extraction from B-Rep Solids; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:43.800Z"
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
  "sourceDigest": "c1419c0bf6476467dbe229aee1909d653facd2e0b24f62177e97dd39e456a553",
  "proposalRevision": "f714e497829ee933c6182fa217e076f39de23d407102211f9086726444449979"
}
---
# Deep Research: 2D Sketch/Profile Extraction from B-Rep Solids

**Date:** 2026-08-08
**Agent:** Research squad — sketch/profile extraction
**Status:** Complete

## Scope and Bottom Line

cad_reverse is at a natural inflection point. v1.5 already extracts the **stock as a 2D profile** (rect/circle/polyline) and emits feature operations via programmatic selectors. The missing capability is *emitting actual sketch-extrude CadQuery workflows* — where the base profile and each feature's cross-section is a 2D sketch on a plane, and operations are `workplane(plane).sketch().finalize().extrude()` style.

Key finding: **you do not need a new solver to get to a useful v2**. The OCC kernel you already use (`cadquery-ocp` 7.8.1.1) contains *every* primitive needed for 2D profile extraction. The hard part — geometric constraint inference — can be layered on top with a small, pure-Python heuristic stage plus (optionally) `planegcs` (a standalone pip-installable Python binding of FreeCAD's PlaneGCS 2D solver, actively maintained as of 2026). This is achievable within your "deterministic, pure-Python-hosted, no-ML-in-v2" constraints, because the solver itself is a deterministic numeric engine — a legitimate library dependency like `cadquery`/`scipy`, not an ML model.

---

## Topic 1 — Planar face section analysis (the core primitive)

For any planar face, the 2D wire profile is directly available in OCC as **pcurves in the face's UV space**. You do not need projection for the common case — the planar face *already carries 2D geometry*.

**The exact API chain:**
- `BRepTools.OuterWire(face)` — the largest boundary wire (already used in `stock.py`).
- `BRepTools_WireExplorer(wire)` — traverses edges in topologically-ordered vertex chain (already used; orientation may be arbitrary per D6/Issue-#5 notes).
- `BRep_Tool.CurveOnSurface(edge, face, first, last)` — returns `Geom2d_Curve` (the pcurve) plus the parameter range. **On planar faces pcurves are computed on the fly** (not stored), so they always exist.
- Wrap with `Geom2d_TrimmedCurve(curve2d, first, last)` — **mandatory**: `CurveOnSurface` may return the *untrimmed* underlying curve.

**Critical caveats:**
- **Seam edges** have two pcurves (forward + reversed) — dedupe.
- **`BRep_Tool.Degenerated(edge)`** — degenerate edges (sphere poles, some cones) must be skipped or handled.
- **Edge orientation** (`TopAbs_FORWARD`/`REVERSED`) affects pcurve direction — re-orient into a consistent chain.

**Handling arcs/circles/splines in 2D:** each pcurve is a `Geom2d_*` type — `Geom2d_Line`, `Geom2d_Circle`, `Geom2d_BSplineCurve`. Convert to canonical 2D sketch representation via `Geom2dConvert::CurveToBSplineCurve(curve2d)` or `Geom2dAPI_Interpolate(array.Pnt2d, periodic, tol)`.

**Recommendation:** build a `ProfileExtractor` that maps a `[face, wire, edge]` triple → typed `SketchFragment` list (`SketchLine`/`SketchArc`/`SketchCircle`/`SketchBSpline`) with canonical orientation. This is a pure refactor of existing stock-profile logic into a reusable primitive — low risk, high reward, directly testable on all 16 convergent fixtures.

---

## Topic 2 — Sketch constraint recovery (the holy grail)

FreeCAD's Sketcher is the single most relevant reference implementation — **it is OCC-hosted and constraint inference is deterministic geometry**, not ML. Its `SketchAnalysis` class implements exactly the Detect→Analyse→Make pattern:

- Currently auto-detects: **coincident, horizontal/vertical, equality** (length for lines, radius for arcs/circles), with angle-precision tolerance (default M_PI/8 ≈ 22.5°).
- Roadmap additions: **perpendicular, parallel, midpoint**.

**Complete inferable constraint set** (from MiCADangelo/MCAD literature): coincident, concentric, equal, fix, horizontal, midpoint, normal, offset, parallel, perpendicular, quadrant, tangent, vertical.

**Realistic v2 subset** — all cheap to compute from 2D curve geometry:
- **Coincident** — shared endpoint coordinates (within tol).
- **Horizontal/Vertical** — segment direction within angle tol.
- **Parallel/Perpendicular** — angle tolerance between any two entities.
- **Equal-length / Equal-radius** — length/radius within dimension tolerance.
- **Tangent** — at shared endpoints, matching tangent direction.
- **Concentric** — coincident circle/arc centers.
- **Symmetric** — mirror across detected symmetry axis.

**Key principle:** auto-constraining is deliberately *conservative and additive* — only adds constraints that are *certain*, never fully constrains to unique solution. This maps perfectly onto cad_reverse's "match/no-match + reason codes" philosophy (D9).

**Benkö & Varády, "Constrained Fitting" (2002)** is the theoretical base: simultaneously enforcing tangency/perpendicularity/parallelism/concentricity during surface fitting, with explicit resolution of *contradicting constraints*.

---

## Topic 3 — Profile/projection methods for non-planar cross-sections

Three distinct cases:

1. **Pockets cutting through multiple faces, bosses on curved surfaces** — use **`BRepAlgoAPI_Section`** (shape ∩ plane). Returns compound of edges; manually rejoin into wires. Can compute pcurves on result edges (`ComputePCurveOn1/2`) and identify ancestor faces (`HasAncestorFaceOn1`).

2. **Projecting a face's 3D boundary onto an arbitrary sketch plane** — two options:
   - **`GeomProjLib::ProjectOnPlane(curve3d, plane, projDir, True)`** → projects individual `Geom_Curve`s.
   - **`BRepProj_Projection`** (parallel projection) → returns wires.

3. **Angle-drilled holes** — the hole axis defines an oblique cylinder; use `BRepAlgoAPI_Section` of the cylinder with the exit plane for rim.

**Recommended strategy:** For *planar* cross-sections (the overwhelmingly common case), **use pcurves from `BRep_Tool.CurveOnSurface` — never project.** Projection only needed for *skew/non-planar* interaction features; there `BRepAlgoAPI_Section` is the reliable tool.

---

## Topic 4 — Commercial approaches

**SolidWorks FeatureWorks:** operates on mapping→extract sketch→regenerate basis, with **human-in-the-loop interactive mode** in addition to automatic. Auto-adds dimensions and relations (concentric, baseline/ordinate dimensioning).

**Autodesk Inventor Feature Recognition:** converts STEP/SAT/IGES "dumb" bodies to native parametric features (holes, extrudes, fillets, chambers, shell, sweep, revolve). Its **Constraint Inference** settings auto-apply parallel/perpendicular/horizontal/vertical during sketching.

**Onshape "Derive":** not B-Rep feature recognition; derives a *master sketch* that downstream features reference. Valuable as goal-state for how emitted sketches should be *organized*.

**Synthesis for cad_reverse:** every commercial tool ships automatic + interactive. cad_reverse can only do the automatic path — but gains a *huge* advantage: the ground-truth **symdiff volume oracle** gives a rigorous acceptance criterion commercial tools approximate with heuristics.

---

## Topic 5 — Academic work

- **Buonamici et al. — "Reverse engineering modeling methods and tools: a survey":** canonical gap analysis — models need **feature-recognition phase** before CAD editability; geometric constraint identification + constrained fitting are the bottlenecks.
- **Benkö & Varády, "Constrained Fitting" (2002):** foundational theory for simultaneous multi-surface fitting under geometric constraints, with contradiction resolution.
- **Pattern recognition & "beautification":** regularize/round near-equal parameters so patterns emerge cleanly.
- **ML wave (out of v2 scope):** CADOps-Net, BRepCGC, BRepNet, UV-Net, DeepCAD — prove the deep end is real but requires large annotated datasets + training infrastructure. Rational grounds to defer to v3.

---

## Topic 6 — OCC capabilities (all in cadquery-ocp 7.8.1.1)

| Tool | Purpose | Notes |
|------|---------|-------|
| `BRep_Tool.CurveOnSurface` | Get 2D pcurve of edge on face | **primary primitive** |
| `BRepTools.OuterWire` / `BRepTools_WireExplorer` | Ordered edge chain | already in stock.py |
| `Geom2d_TrimmedCurve` | Re-trim untrimmed pcurves | mandatory correctness |
| `Geom2dConvert.CurveToBSplineCurve` | Canonical 2D curve form | |
| `Geom2dAPI_Interpolate` | Reparameterize 2D profiles | periodic flag for closed loops |
| `Geom2d_Line` / `Geom2d_Circle` / `Geom2d_BSplineCurve` | 2D sketch fragment types | |
| `BRepAlgoAPI_Section` | Cross-section with plane/curved surfaces | pcurves on results |
| `GeomProjLib::ProjectOnPlane` | Project 3D curve to plane | individual curves |
| `BRepProj_Projection` | Project full wires | |
| `Geom2dAPI_InterCurveCurve` | 2D curve-curve intersections | |

**All present in cadquery-ocp.** No new heavy dependency for profile extraction. Constraint *solving* comes from `planegcs`.

---

## Topic 7 — Geometric constraint solvers usable from Python

Two real, pip-installable options:

1. **`planegcs` (recommended)** — standalone Python bindings for FreeCAD's PlaneGCS 2D solver. LGPL 2.1+. Actively maintained (June 2026). API:
   ```python
   from planegcs import Sketch, SolveStatus
   s = Sketch()
   p1 = s.add_fixed_point(0,0); p2 = s.add_point(5,0); p3 = s.add_point(2.5,4)
   l1 = s.add_line(p1,p2); l2 = s.add_line(p2,p3); l3 = s.add_line(p3,p1)
   s.equal_length(l1,l2); s.equal_length(l2,l3); s.horizontal(l1)
   s.set_p2p_distance(p1,p2,5.0)
   assert s.solve() == SolveStatus.Success
   ```
   Constraint set mirrors FreeCAD (equal, horizontal, vertical, parallel, perpendicular, midpoint, symmetric, distance, etc.). Used by CAD_Sketcher (Blender) and FreeCAD assembly3.

2. **`slvs_py` / `py_slvs`** — SWIG binding of SolveSpace-2.3 fork; pip-installable, used by FreeCAD assembly3. More general 2D/3D assembly solver.

**Recommendation:** `planegcs` (FreeCAD lineage) — 2D-sketch-native, matches reference semantics, clean Python API. Treat as **optional library dependency** for verifying/regenerating inferred constraint sets — cad_reverse detects constraints deterministically, planegcs confirms consistency.

---

## Topic 8 — Parametric intent (patterns, equal-features, symmetry)

The definitive method is **centroid-based pattern detection**:

1. **Group repeated entities (REs)** — same-type, same-geometry features (equal-diameter holes, equal-length slots).
2. **Centroid heuristic** — if congruent sub-parts form regular arrangement, their centroids form regular arrangement.
3. **Path taxonomy from centroid positions:**
   - Collinear, evenly spaced → **linear pattern**.
   - On a circle, rotationally spaced → **circular rotational pattern**.
   - Circular path with constant translation → circular translational.
   - Group of exactly two, mirrored → **reflectional pattern / symmetry plane**.
4. **Two-level verification:** vertex correspondence under candidate transform + face-orientation check.

Additional heuristics: equal-diameter holes, symmetry planes (B-Rep maps to itself within tolerance), beautification/regularization (round near-equal parameters to exact values).

All deterministic geometry — squarely within cad_reverse's wheelhouse, with existing face-ownership (`arbitrate.py`) to know which faces belong to which feature.

---

## Topic 9 — Feasibility and realistic v2 scope

**What's achievable:** nearly all sketch *extraction* and *constraint detection* is deterministic geometry. Only numeric solver is `planegcs` (library dependency, not ML). **This is realistic for v2.**

### Recommended phased roadmap

**Phase A — Sketch extraction substrate (low risk, high leverage)**
- Build `ProfileExtractor`: `[planar_face, wire] → typed 2D SketchFragment[]`
- Refactor existing stock-profile extraction onto it
- Emit true sketch-based CadQuery: `workplane(plane).sketch(fragments).finalize()...`
- Gate: **symdiff < 0.001 on all 16 convergent fixtures** (regression-safe)

**Phase B — Cross-section profiles (curved/interacting features)**
- `BRepAlgoAPI_Section` for through-cut pockets and bosses on curved surfaces
- Wire-rejoining helper
- Gate on delta-verify oracle

**Phase C — Constraint detection (deterministic predicates)**
- Implement coincident, H/V, parallel, perpendicular, equal-length/radius, tangent, concentric predicates
- Emit constraint lines in CadQuery sketch
- Exact dimensions recovered as named constants + Constraint records
- Gate: constraint sets must be *consistent* (planegcs), not necessarily minimal

**Phase D — Parametric patterns (centroid-based)**
- Group equal-feature sets; detect linear/circular patterns + symmetry
- Two-level vertex/orientation verification
- Emit pushPoints + pattern objects

**Phase E (stretch, may defer to v3) — full constrained sketch solver regeneration**
- Pipe detected constraints through planegcs to re-solve and re-fit
- Candidate for honest-PARTIAL-to-CONVERGED bridge on multi-feature parts

**Deliberately out of v2:** revolve/loft/sweep-sketch synthesis, ML-based history recovery, auto dimension-scheme layout.

---

### Open questions before Phase C implementation
1. **Exact sketch-constraint API in cadquery-ocp 7.8.1.1** — verify what `Sketch`/`Constraint` supports before committing to emitting constraint lines.
2. **CadQuery sketch entity types** — confirm emitted sketch fragments map onto `Sketch` primitives with same tolerance semantics as symdiff gate.

### Sources
- BRep_Tool.CurveOnSurface pythonocc issue #1433
- Open CASCADE Forum — Extract controlpoints of wire/edge, Extracting Wire from Face
- BRepAlgoAPI_Section reference (OCCT 7.7.0)
- BRepProj_Projection source
- SolidWorks FeatureWorks Overview (2026)
- Autodesk Inventor Feature Recognition + Constraint Default Behavior
- Buonamici et al. — Reverse engineering modeling methods and tools: a survey
- CADOps-Net, BRepCGC, MiCADangelo papers
- Benkö & Varády — Constrained Fitting (2002, Springer)
- FreeCAD Sketcher::SketchAnalysis class reference
- FreeCAD issue #11414 — add more automatic constraints
- planegcs GitHub (spookylukey), piwheels
- realthunder/slvs_py, CAD_Sketcher Solver System, Pyslvs-UI
- Identification of Regularities in CAD Part and Assembly Models (Springer)
- pythonocc example — core_geometry_curves2d_from_curve.py
