---
{
  "format": 1,
  "metadata": {
    "id": "archived-occt-opencascade-shape-healing-fixing-and-preprocessing-for-b-rep-step-reverse-e-54216c3e",
    "title": "OCCT/OpenCascade Shape Healing, Fixing, and Preprocessing for B-Rep STEP Reverse Engineering",
    "question": "What findings, alternatives and limitations does the historical investigation document about OCCT/OpenCascade Shape Healing, Fixing, and Preprocessing for B-Rep STEP Reverse Engineering?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: OCCT/OpenCascade Shape Healing, Fixing, and Preprocessing for B-Rep STEP Reverse Engineering. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of OCCT/OpenCascade Shape Healing, Fixing, and Preprocessing for B-Rep STEP Reverse Engineering; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:42.682Z"
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
  "sourceDigest": "54216c3eaf7d3a739fb55e4e5826db7fca8ab5dbb423856a5c7552c73949fd6e",
  "proposalRevision": "7f26ea0719d9b2ceff6c55d1b96058767cb64338d67daa10ac7c537959f9848c"
}
---
# OCCT/OpenCascade Shape Healing, Fixing, and Preprocessing for B-Rep STEP Reverse Engineering

**Reference note:** `cad_reverse/` heals every STEP import with `ShapeFix_Shape.Perform()` then `ShapeUpgrade_UnifySameDomain(shape, True, True, True).Build()` (see `heal.py`), then builds an AAG + blend mask and runs deterministic recognizers. This document is the deep reference on OCCT's shape-healing subsystem: what each `ShapeFix_*` class does, what `ShapeUpgrade_UnifySameDomain` actually does internally, the `ShapeHealing`/`ShapeProcess` meta-framework, the common STEP-import defect catalogue and their fixes, tolerance management, sewing, face orientation, edge-tolerance/AAG interaction, performance, OCC-version drift, and non-regression verification.

**Environment target:** this module pins `cadquery-ocp` **7.8.1.1** ⇒ OCC **7.8.1**. Version-specific behavior is flagged throughout (§10); the two well-documented 7.8.1 healing bugs directly affect this pin and are called out.

---

## 1. The three families: Fixed vs. Upgrade vs. Custom (and Analysis)

OCCT's shape-healing subsystem is four cooperating families. The loaded mental model from the OCCT community:

> **ShapeFix = a doctor** (repairs what is broken). **ShapeUpgrade = a cleaner** (normalizes what is already valid). **ShapeCustom = a transplant surgeon** (rewrites how geometry is represented). **ShapeAnalysis = the lab** (measures/detects defects).

| Family | Purpose | Changes valid shape? | Typical cost |
|--------|---------|---------------------|--------------|
| `ShapeFix_*` | **REPAIR** invalid topology (gaps, overlaps, self-intersections, wrong orientation, missing seams, tiny edges/faces) so the shape satisfies OCCT validity rules | Ideally no look-change; may add vertices/edges | Moderate (local per-shape ops) |
| `ShapeUpgrade_*` | **NORMALIZE** — simplify already-valid shapes (merge co-planar faces / co-linear edges, remove internal wires, split large faces by angle) | **Yes** — reduces face/edge count | **High** (`UnifySameDomain` re-runs a Boolean fuse) |
| `ShapeCustom_*` | **CONVERT** the geometric representation (analytic surfaces → B-Spline, revolution → extrusion, degree/span restriction) | **Yes** — changes curve/surface scheme | High, approximation-based, expert-only |
| `ShapeAnalysis_*` | **DETECT/MEASURE** only — no modification | No | Read-only, cheap |

**Decision rule:** repair (`ShapeFix`) always precedes simplify (`ShapeUpgrade`), which precedes convert (`ShapeCustom`). Never skip the fix pass — `UnifySameDomain` assumes a valid, already-fixed model and will no-op or emit garbage on a dirty B-Rep (see §3, §7).

---

## 2. The `ShapeFix` family — class-by-class reference

All tolerances propagate **down** the tree: `ShapeFix_Shape` → `ShapeFix_Solid` → `FixShellTool` → `ShapeFix_Shell` → faces/wires/edges. All `ShapeFix_*` classes inherit from `ShapeFix_Root`, which supplies `SetPrecision(preci)`, `SetMinTolerance(mintol)`, `SetMaxTolerance(maxtol)` and `LimitTolerance(toler)` (clamps a tolerance into `[MinTol, MaxTol]`).

### `ShapeFix_Shape` — the meta-fixer

```cpp
ShapeFix_Shape(const TopoDS_Shape& shape);
Standard_Boolean Perform(const Message_ProgressRange& theProgress = Message_ProgressRange());
void SetPrecision(Standard_Real preci);
void SetMinTolerance(Standard_Real mintol);
void SetMaxTolerance(Standard_Real maxtol);
Standard_Integer Status(const ShapeExtend_Status status) const;   // DONE1..DONE6 / FAIL1..
Handle<ShapeFix_Solid> FixSolidTool() const;   // + FixShellTool, FixFaceTool, FixWireTool, FixEdgeTool
```

What `Perform()` actually does, bottom-up:
1. `FixVertexPosition` (only if `FixVertexPositionMode()`, default **False**).
2. Orient/close each sub-shape type **bottom-up**: free **edges** → free **wires** → free **faces** → free **shells** → **solids** (via the five sub-tools).
3. `ShapeFix::SameParameter()` across the whole shape (`FixSameParameterMode()`, default **True**) — makes each edge's 3D curve and its 2D pcurves agree at equal parameter.
4. Optional global vertex-tolerance fixing (`FixVertexTolMode()`).

`Status()` is a bitmask: `DONE1` free edges fixed, `DONE2` free wires, `DONE3` free faces, `DONE4` free shells, `DONE5` free solids, `DONE6` contents of compounds.

**When to use it vs. reaching for an individual fixer:** `ShapeFix_Shape` is the correct catch-all when you *don't* know where defects are (the normal post-STEP-import case — exactly `cad_reverse`'s use). Reach for an individual `ShapeFix_Face/Wire/Solid` directly only when you've *identified* a specific defect class and want a cheaper, status-rich, surgical repair — or when you must tweak a per-level mode that `ShapeFix_Shape`'s coarse flags don't expose. `ShapeFix_Edge` has **no `Perform()`** — it is driven only through `ShapeFix_Wire`/`ShapeFix_Face`.

**Performance caveats (documented OCCT issues):** `Perform()` instantiates six tools and may rewrite topology. Historical stack-overflow / unbounded edge-multiplication on shapes with shared sub-shapes or non-orientable surfaces (OCCT PR #1227), and quadratic `FixConnected` cost on wires with many edges (fixed by batching in the same PR). `SameParameter` can dominate on parts with thousands of edges.

### `ShapeFix_Solid`

```cpp
void SetPrecision(const Standard_Real preci);          // also sets FixShellTool's precision
Standard_Integer& FixShellMode();                      // default True
Standard_Integer& FixShellOrientationMode();           // default True
Standard_Integer& CreateOpenShellMode();               // default False
```

"Builds a solid from shells and orients them so the solid has finite volume." Runs `ShapeFix_Shell` on sub-shells, then validates/orients them outward. Use directly when a solid came up `BRepCheck_NotClosed` / `BRepCheck_UnorientableShape`.

### `ShapeFix_Shell`

Orients faces within a shell consistently:

```cpp
Standard_Boolean FixFaceOrientation(TopTools_DataMapOfShapeListOfShape& theMapWires /* may not always reverse */);
// faces it cannot orient (e.g. Möbius) → ErrorFaces()
Standard_Integer& FixOrientationMode();   // default True
```

`FixFaceOrientation` "changes the orientation of a face in the shell if it is oriented opposite to neighboring faces," propagating outward consistency. This is the layer that makes two adjacent faces stamp their shared edge with opposite (`FORWARD`/`REVERSED`) orientations.

### `ShapeFix_Face`

```cpp
ShapeFix_Face(const TopoDS_Face& theFace);
void Init(const TopoDS_Face&, Standard_Real prec = -1, TopAbs_Orientation orient = TopAbs_FORWARD);
Standard_Boolean FixOrientation(TopTools_DataMapOfShapeListOfShape& theMapWires);
Standard_Boolean FixAddNaturalBound();
Standard_Boolean FixMissingSeam();
Standard_Boolean Perform(const Message_ProgressRange& = ...);
```

Fixes a face's wires and orientation for the face's **2D UV space**. Key modes: `FixWireMode` (run `ShapeFix_Wire`, default **True**), `FixOrientationMode` (**True**), `FixAddNaturalBoundMode` (**False** for single-wire faces, **True** for multi-wire), `FixMissingSeamMode` (**True**), plus `FixSmallAreaWireMode`, `FixIntersectingWiresMode`, `FixSplitFaceMode`.

- `FixOrientation` re-orients wires so all lie consistently outside their nesting (each inner/hole wire REVERSED relative to the outer loop). Bug #28414: on sphere/torus single-wire faces it deliberately refuses to reverse when a natural bound will be added — STEP allows a closed periodic surface with one inner wire to mean a cutout.
- `FixAddNaturalBound` handles wire-less faces / double-closed surfaces.
- `FixMissingSeam` merges two 3D-closed wires with a 2D gap into one wire plus a seam edge. **Use `Result()`, not `Face()`, after this** — the face may be split.

Status: `DONE1` wires fixed, `DONE2` orientation, `DONE3` seam, `DONE4` small-area wire removed, `DONE5` natural bound, `DONE8` face split; `FAIL1`–`FAIL4`.

### `ShapeFix_Wire` — the workhorse

```cpp
ShapeFix_Wire(TopoDS_Wire& wire, const TopoDS_Face& face, Standard_Real prec);
Standard_Boolean Perform();
Standard_Boolean FixReorder();
Standard_Boolean FixClosed(Standard_Boolean enforce = Standard_False);
Standard_Boolean FixSmall(Standard_Boolean lockvtx = Standard_True, Standard_Real prec = -1);
Standard_Boolean FixConnected(Standard_Real prec = -1);
Standard_Boolean FixEdgeCurves();
Standard_Boolean FixGaps3d(Standard_Real prec = -1);
Standard_Boolean FixGaps2d(Standard_Real prec = -1);
Standard_Boolean FixSelfIntersection();
Standard_Boolean FixSeam();
```

Repairs a wire's internal consistency. `Perform()` **order is load-bearing**: `FixReorder` → `FixSmall` (lockvtx if topology off/unordered) → `FixConnected` (lock adjacent edge vertices; honors `ClosedWireMode`) → `FixEdgeCurves` → `FixDegenerated` → `FixSelfIntersection` (only if ordered+closed) → `FixLacking`. `FixEdgeCurves` itself runs `FixReversed2d`, `FixRemovePCurve`(forced), `FixAddPCurve`, `FixRemoveCurve3d`(forced), `FixAddCurve3d`, `FixSeam`, `FixShifted` (corrects 2D curves offset by whole periods), `FixSameParameter`.

- `FixGaps3d` moves 3D edge ends to a common 3D vertex; `FixGaps2d` moves 2D curve ends to a common midpoint. `prec=-1` ⇒ use `MaxTolerance()`.
- Most wire fixers assume edges are reordered first — do **not** reorder the `Perform()` sequence yourself.

### `ShapeFix_Edge`

```cpp
Standard_Boolean FixVertexTolerance(const TopoDS_Edge&, const TopoDS_Face&);
Standard_Boolean FixSameParameter(const TopoDS_Edge&, Standard_Real tolerance = 0.0);
Standard_Boolean FixAddPCurve(const TopoDS_Edge&, const TopoDS_Face&, Standard_Boolean isSeam = Standard_False, Standard_Real prec = 0.0);
// + FixReversed2d, FixRemovePCurve, FixRemoveCurve3d, FixAddCurve3d, FixShifted
```

No `Perform()`. `FixVertexTolerance` grows a vertex tolerance to encompass the curve/pcurve ends of incident edges. `FixSameParameter` single-parameterizes an edge (SameRange → SameParameter). `FixAddPCurve` projects the 3D curve onto the face surface. Gotcha: `FixReversed2d` on a **seam edge must be called twice** (FORWARD then REVERSED) because it inspects only one pcurve direction per call.

**Note:** `ShapeFix_Edge::FixVertexTolerance` and `ShapeFix::SameParameter` deliberately ignore the `MaxTolerance` cap — "you can open up tolerance but never restrict it." This is why `ShapeFix_Shape.Perform()` can leave individual edge tolerances larger than your requested `SetMaxTolerance`. Bound it afterward if you need hard limits (`ShapeFix_ShapeTolerance`).

### `ShapeFix_ShapeTolerance` — the tolerance sledgehammer

```cpp
Standard_Integer LimitTolerance(shape, tmin, tmax, styp /* VERTEX|EDGE|FACE|WIRE|SHAPE */);
Standard_Integer SetTolerance(shape, preci, styp);
```

`LimitTolerance`: `tmin==tmax` forces the value; `tmin==0` caps at max; `tmax<tmin` only floors at min. `SetTolerance` forces every entity of `styp` to `preci`. Use only when you need determinism; forcing `MinTolerance == MaxTolerance` to the same value has been reported to "mess up stuff that worked perfectly before" (OCCT forum) — keep min ≪ max.

---

## 3. `ShapeUpgrade_UnifySameDomain` — what it actually does

This is the **topology-simplification** half of shape healing (the geometry-repair half is `ShapeFix_*`). It fuses faces on coincident surfaces and edges on the same curves — the engine behind FreeCAD's *Part → Refine Shape* (`removeSplitter()`), and the cleanup one applies after booleans or after STEP import to collapse a plate's 12 split co-planar faces back into 1.

```cpp
ShapeUpgrade_UnifySameDomain(
    const TopoDS_Shape& aShape,
    Standard_Boolean UnifyEdges     = Standard_True,   // ← 2nd positional arg
    Standard_Boolean UnifyFaces     = Standard_True,   // ← 3rd positional arg
    Standard_Boolean ConcatBSplines = Standard_False); // ← 4th positional arg
void Initialize(...);                       // same signature
void Build();
void SetLinearTolerance(Standard_Real);     // default Precision::Confusion()
void SetAngularTolerance(Standard_Real);    // default Precision::Angular()
void AllowInternalEdges(Standard_Boolean);  // non-manifold internal edges, default false
void SetSafeInputMode(Standard_Boolean);    // default true — protects input
Shape Build::Result() / KeepShape(edge|vertex);
```

**IMPORTANT — argument order.** `UnifyEdges` is the *2nd* positional arg, `UnifyFaces` the *3rd*. `cad_reverse` passes `(fixed, True, True, True)` ⇒ `UnifyEdges=True, UnifyFaces=True, ConcatBSplines=True`.

- **`UnifyFaces`** — group faces on coincident surfaces, rebuilt via `UnifyFaces()` using `ShapeAnalysis_Surface` and `ShapeConstruct_ProjectCurveOnSurface` to validate continuity.
- **`UnifyEdges`** — form one common edge from smoothly-connected edges shared by the *same* pair of faces.
- **`ConcatBSplines`** — merge neighbouring edges on **B-Spline/Bezier** curves with **C1 continuity** at a common vertex. Commonly left **false** for reverse-engineering (flattening spline seams can degrade an editable representation — exactly what cad_reverse emits). `cad_reverse` passes `True`, which is worth revisiting: for an *editable CadQuery* target, `ConcatBSplines=False` is usually the right call (faces from primitive surfaces dominate table-B fixtures anyway).

**Internally** it re-fuses the face groups via a Boolean (`BRepAlgoAPI*`/`BOPAlgo_Builder`/`IntUnifyFaces`) — that is why it is slow and fragile. It preserves compsolid/solid/shell/wire boundaries (two shells sharing a co-planar edge are NOT unified).

**Correction:** `SetUnifyFaces`/`SetUnifyEdges`/`SetUnifyNonGeometry` and `BOPAlgo_ArgumentAnalyzer` are **not** part of this class's API. `BOPAlgo_ArgumentAnalyzer` is a *separate* validation class; it only appears here because a buggy `UnifySameDomain` output *fails* its checks.

### When it succeeds vs. fails

- **Succeeds** when groups of neighbouring faces/edges genuinely lie on coincident surfaces/curves and merging isn't forbidden. Requires **valid input** — feed it a raw BOP/splitter result and it early-returns or emits garbage. This is the core reason `ShapeFix_Shape` must run first.
- **Premature termination (7.8.0):** overhauled `IntUnifyFaces()/ReconstructMissedSeam()` returned without simplification when seam recovery found a NULL `NextEdge`. (Subsumed/patched in 7.8.x.)
- **Self-intersections (7.8.1) — RELEVANT TO THIS PIN:** fusing an array of co-planar wedges to a box that *partially covers* a shared face passes validation *before*, then fails with `BOPAlgo_SelfIntersect` errors scaling linearly with wedge count (2 wedges → 2 errors, 22 → 42). Upstream OCCT#1193, repro FreeCAD#29373. Fixed in OCCT 7.9. **If a fixture is a plate of side-by-side prismatic slabs/wedges, watch for this.**
- **Degenerate straight-line geometry:** `gp_Dir::Crossed()` zero-norm errors when merging split cylindrical faces.
- **Incorrect parametrics (Gmsh):** wrong OCC parametric rep after unification → bad meshes; disabled via `Geometry.OCCUnionUnify=0`.
- **No guarantee of a "maximum clean" result:** residual vertices/edges often survive (AnalysisSitus forum, "edges unification after fusing shapes").

**Relevance to the six cad_reverse PARTIAL fixtures:** their symdiff failures are dominated by *recognizer* gaps (spurious pockets on hole walls/floors in `recognize/pocket_pad.py`), **not** by `UnifySameDomain` — unification itself round-trips table-B fixtures to symdiff < 0.001. Keep the two concerns separate when debugging.

### Ordering vs. `ShapeFix_Shape` (locked in cad_reverse)

OCCT dev Dmitrii Pasukhin: *"for most of the OCCT Modeling operations we expect that the model is valid and fixed... apply ShapeFix on your shape before using them in the Modeling algorithms."* i.e. **fix, then unify** — `ShapeFix_Shape.Perform()` → `ShapeUpgrade_UnifySameDomain.Build()`. That is exactly what `heal.py` does, and it is correct. Do **not** run unify before fix. Note that STEP *export/import* does implicit healing — which is why unify "looks like it works" after a STEP round-trip but not on a raw in-memory BOP; that is evidence you must fix first, not a reason to route through disk.

**Bound it in production:** `UnifySameDomain` has documented infinite-loop hangs (OCCT#32949, still open; XBim#483 worked around by lowering `FuzzyFactor`). If a fixture hang is observed, fall back to "report-without-unify" (shape stays valid; you only lose face-merging). Treat unify as best-effort, never load-bearing.

---

## 4. The `ShapeHealing` / `ShapeProcess` meta-framework (ShapeHealing.pm)

"ShapeHealing.pm" is the historical (XSTEP/KAI Perl-era) resource-file-driven pipeline that the OCCT classes above standardize into `ShapeProcess`. It is a **data-driven healing recipe**: a text resource file names an ordered sequence of operators with parameters, decoupled from code.

A recipe (`*.exec.op:` sequence, params dotted):

```
NameSequence.exec.op:        DirectFaces,SameParameter,SplitAngle,BSplineRestriction
NameSequence.SplitAngle.Angle:          90.0
NameSequence.SplitAngle.MaxTolerance:   0.01
NameSequence.BSplineRestriction.SurfaceMode:  1
```

Driven programmatically by:

```cpp
TopoDS_Shape XSAlgo_AlgoContainer::ProcessShape(
    const TopoDS_Shape& shape,
    Standard_Real Prec, Standard_Real MaxTol,
    Standard_CString rscfile, Standard_CString seq,
    Handle<Standard_Transient>& info,               // a ShapeProcess_ShapeContext recording every modification map
    const Handle<Message_ProgressIndicator>& progress = 0);
```

**Canonical operator set** (`ShapeProcess_OperLibrary`):

| Operator | What it does |
|----------|--------------|
| `DirectFaces` | Reverse left-handed (indirect) placements, recompute pcurves — enum **First=0** |
| `SameParameter` | Force each edge's 3D+2D parameterization to agree |
| `SetTolerance` | Override shape tolerances |
| `SplitAngle` | `ShapeUpgrade_ShapeDivideAngle` — split revolute/cyl/cone/torus so each segment ≤ angle |
| `BSplineRestriction` | `ShapeCustom_BSplineRestriction` — convert to BSplines with a degree/span/continuity cap |
| `ElementaryToRevolution` | Convert elementary periodic surfaces to `SurfaceOfRevolution` |
| `SweptToElementary`, `SurfaceToBSpline`, `ToBezier`, `SplitContinuity`, `SplitClosedFaces`, `FixWireGaps`, `FixFaceSize`, `DropSmallSolids`, `DropSmallEdges`, `SplitClosedEdges`, `SplitCommonVertex` | further conversion / health-drop operators |
| `FixShape` | The umbrella repair operator (free shells/wires + same-parameter); params `Tolerance3d`, `MaxTolerance3d` |

**Canonical order** — the standard a production recipe follows:
1. `FixShape` first (coarse defects: invalid shells/wires/free edges),
2. `SameParameter` (coherent parametrics before any splitting),
3. `DirectFaces` (normalize orientation),
4. `SplitAngle`/`SplitClosedFaces` (break periodic faces **after** surface repair — you can't split a torn surface),
5. `BSplineRestriction`/conversions **last** (approximation is expensive and assumes clean topology).

_Gist:_ **fix topology before geometry, unify/split before approximating.** Defaults shipped: STEP **read** runs `FixShape`; STEP **write** runs `DirectFaces`.

**Why not just call `ShapeFix_Shape`?** `ShapeFix_Shape` is *one monolithic hardcoded pass* with one fixed order and policy. The ShapeProcess framework is *many tunable, reorderable operators* with a recorded modification map (needed by translators). For `cad_reverse` the fixed `ShapeFix_Shape + UnifySameDomain` chain is the right, lightweight, deterministic choice for the known-good case (Design Decision D6 "heal on every import"). Adopt `ShapeProcess`/`XSAlgo_AlgoContainer` only if you need to switch healing policies per fixture class without touching code.

---

## 5. Common STEP-import defects and their OCCT fixes

All healing below operates on the `TopoDS_Shape` **after** the STEP transfer completes. STEP import runs `FixShape` automatically (not switchable off in 2024, planned), so files from conforming authoring CAD (SolidWorks/NX/CATIA/Fusion) arrive mostly-valid; the failures below are the residual.

### 5.1 Inverted / wrong face normals

Two layers, two fixes:

| Layer | Fix | Notes |
|-------|-----|-------|
| Wire orientation *within* a face | `ShapeFix_Face::FixOrientation` (`FixOrientationMode`) | Re-orients wires so outer encloses inner; `True` if flipped. Sphere/torus single-wire faces skipped (bug #28414) |
| Face orientation *between* neighbors / shells | `ShapeFix_Shell::FixFaceOrientation`; `ShapeFix_Solid` with `FixShellOrientationMode` (default True) | Flips faces opposite to neighbors; unreorientable → `ErrorFaces()` |

**Orientation is topological, not geometric.** Every boundary sub-shape carries `TopAbs_Orientation` — `FORWARD`/`REVERSED`/`INTERNAL`/`EXTERNAL`:
- Material always lies opposite the face's normal. A FORWARD face's normal coincides with the surface normal; REVERSED means opposite; a cylinder's bottom cap is a REVERSED plane so its effective normal points outward.
- `FORWARD` = parent's interior is the default (left-of-edge) region; `REVERSED` = the right region; `INTERNAL` = both sides interior (a hole face); `EXTERNAL` = neither.
- Two adjacent faces sharing an edge subshape must stamp it opposite (`FORWARD` on one, `REVERSED` on the other).
- `TopAbs::Reverse` swaps FORWARD↔REVERSED (INTERNAL/EXTERNAL unchanged).
- When traversing to wires/edges you must pass `myFace.Oriented(TopAbs_FORWARD)` to `TopExp_Explorer`; `BRepLProp_SLProps` ignores face orientation — reverse the returned normal yourself for REVERSED faces.
- **AAG consequence (critical for cad_reverse):** the AAG dihedral attribute between two faces is computed from the two face normals and is *sign-sensitive* to their orientation. Flipping one reclassifies concave⇄convex at every shared edge — a fillet ring can masquerade as a boss, and hole caps read as pads. Enforce a watertight, consistently-outward shell with `ShapeFix` **before** `build_aag`.

### 5.2 Missing faces / open shells → `BRepBuilderAPI_Sewing`

Detect with `ShapeAnalysis_Shell`, stitch with `BRepBuilderAPI_Sewing`:

```cpp
ShapeAnalysis_Shell ss;
bool ok = ss.CheckOrientedShells(shape, /*alsofree=*/true, /*checkinternaledges=*/false);
ss.HasFreeEdges(); ss.FreeEdges();          // boundary edges used by 1 face
ss.HasBadEdges();  ss.BadEdges();           // edges used >2 or mis-oriented
ss.HasConnectedEdges();                     // edges shared ≥2 times
```

Orientation rule: each edge must appear exactly twice with opposite orientations. Used-once ⇒ free edge; used >2 ⇒ non-manifold; orientation-mismatch ⇒ "bad".

Sewing workflow (the community "robust STEP import" pattern):

```cpp
BRepBuilderAPI_Sewing sew(tol);          // default 1e-6; use model's MAX tolerance, not Confusion()
sew.SetMinTolerance(minTol); sew.SetMaxTolerance(maxTol);  // 8.0+
sew.Add(shape);
sew.Perform();
TopoDS_Shape sewed = sew.SewedShape();   // closed shell auto-promotes to solid
// then wrap any remaining shell:
BRepBuilderAPI_MakeSolid solid(shell);   // guard IsDone()
ShapeFix_Shape fixer(solid.Shape()); fixer.Perform();
```

- The constructor's boolean options: `option1`=perform the merge (false = control-only), `option2`=analyze degenerated shapes, `option3`=cut free edges, `option4`=**non-manifold mode** (allow an edge shared by >2 faces; leave **false** for manifold parts so T-junctions register as problems, not valid).
- Statistics: `NbFreeEdges()` (must be **0** for watertight), `NbMultipleEdges()`, `NbContigousEdges()` (2 = correct), `NbDegeneratedShapes()`.
- **Tolerance choice is critical.** Too small leaves gaps open; too large merges distinct edges / swallows intentional tiny features. Use the model's *maximum existing* edge/vertex tolerance (`BRep_Tool::Tolerance`), which AnalysisSitus's `sew` GUI pre-fills. Under `SetLocalTolerancesMode(true)` each merge pair uses `WorkTolerance = myTolerance + tolEdge1 + tolEdge2` — guaranteeing a work tolerance exceeding both operands.
- **Sewing succeeding ≠ closed.** It only closes gaps *below tolerance*; always re-check `NbFreeEdges() == 0` after `Perform()`.
- **Crossing faces can't be sewn** — cut first with `BRepAlgoAPI_Common`, then sew; or use `BOPAlgo_MakerVolume`.
- Hollow STEP output usually means the source shell had open edges, not a solidification bug.
- Sewing modifies geometry ⇒ re-validate with `BRepCheck_Analyzer` and run `ShapeFix` before building the AAG.
- For diagnosis-only, `ShapeAnalysis_FreeBounds` returns the open/closed boundary wires of a shell compound.

### 5.3 Seam gaps on periodic faces

Revolved faces (STEP) arrive as wires **closed in 3D but open in 2D parametric space** — invalid in OCCT. Fix with `ShapeFix_Face::FixMissingSeam()` (joins two wires into one and inserts the seam edge; `FixMissingSeamMode` default True), routed through `ShapeFix_Wire::FixLacking` + `FixEdgeCurves` (`FixShifted` corrects whole-period 2D offsets). Siblings: `ShapeUpgrade_RemoveInternalWires`, `ShapeUpgrade_ShapeDivideAngle`, `ShapeFix_ComposeShell::ClosedMode()`.

### 5.4 Tolerance problems

See §9 (dedicated section).

### 5.5 STEP-import level vs. `TopoDS_Shape` level — sequential, not alternatives

`STEPControl_Reader::ReadFile()` → `TransferRoots()` performs *translation* only (`OneShape()` yields a possibly heterogeneous compound of faces/shells/solids). **All healing is `TopoDS_Shape`-level post-processing.** Recommended order:

```
TransferRoots → verify NbShapes()
  → ShapeAnalysis_Shell (diagnose: CheckOrientedShells, HasFreeEdges/BadEdges)
  → ShapeAnalysis_ShapeTolerance(max) (choose sewing/heal tolerance)
  → BRepBuilderAPI_Sewing (close gaps; SetMaxTolerance; nonManifold off)
  → BRepBuilderAPI_MakeSolid (shell→solid; guard IsDone)
  → ShapeFix_Shape / ShapeFix_Solid (Perform: FixOrientation, FixMissingSeam)
  → oracle symdiff (verify watertight + solid; §12)
```

This mirrors the AnalysisSitus `geom_STEP.cpp` import chain.

---

## 6. `ShapeCustom` — representation conversion (expert-only)

Rewrite the geometric *scheme*, not topology. Static entry points: `ShapeCustom::ConvertToBSpline` (linear-extrusion/revolution/offset/planar surfaces → `Geom_BSplineSurface`, same parameterization), `ConvertToRevolution` (elementary periodic → `SurfaceOfRevolution`), `SweptToElementary` (inverse), `DirectFaces` (remove left-handed surfaces), `ScaleShape`, and `ShapeCustom_BSplineRestriction` (approximate surfs/curves/**pcurves** to a max degree / max span count with 3D+2D tolerance + continuity — what STEP/IGES translators use to cap high-degree rational splines).

**Danger:** approximation may silently fail or exceed the requested segment/span count ("even if approximation is impossible with GMaxDegree, number of spans can exceed GMaxSegment"); continuity may be reduced; `BRepTools_Modifier` plumbing on shared assembly topology can invalidate shapes if done incautiously. Only reach for `ShapeCustom` after `ShapeFix` (repair) and `ShapeUpgrade` (simplify) are settled. cad_reverse does **not** use it — out of scope for `ConcatBSplines=False` editable emission.

---

## 7. Decision tree — which tool when

For a freshly-imported `TopoDS_Shape`:

```
if BRepCheck_Analyzer::IsValid(shape) is TRUE  AND
   ShapeAnalysis_Shell::CheckOrientedShells(shape) is TRUE (watertight, outward):
       FAST-PATH: skip ShapeFix AND skip UnifySameDomain entirely.
                  SameParameter already satisfied on authored STEP.
                  Optionally run UnifySameDomain ONLY to shrink split-face count
                  for recognizer quality — never as a validity precondition.
else if shape has BROKEN topology (gaps, orientation, small/swallowed faces, seam gaps):
       → ShapeFix_Shape (SetPrecision(Confusion), SetMin/MaxTolerance to bound the heap)
then, if face-count / feature-detection quality needs it:
       → ShapeUpgrade_UnifySameDomain (UnifyFaces=True, UnifyEdges=True,
                                       ConcatBSplines= decide per editable-output; usually False)
then, only if a target format needs a different surface/curve scheme:
       → ShapeCustom_* (last)
ALWAYS guard each healing step (check Perform()/Build() status) and re-validate:
       BRepCheck_Analyzer + symdiff/volume gate (§12).
```

---

## 8. Orientation details for AAG-safe reconstruction

Because `cad_reverse/build_aag.py` computes edge-vexity from dihedral angles, orient the healed shell **before** building the AAG:

- Call `ShapeFix_Shape.Perform()` (drives `FixShellOrientation` + `FixFaceOrientation`) and confirm the result has no free faces and consistent outward normals.
- For free/unclosed faces that need a chosen side, `BRepLib::FindSurface` finds a nominal plane/cylinder/cone from the edge data when no support surface is stored.
- Do **not** rely on `BRepCheck_Analyzer::IsValid` alone to mean "orientation is right" — it flags structural validity, not outward consistency.

Extract normals with face orientation in mind: a face yielded from a `TopExp_Explorer` carries its stored orientation; either access via `face.Oriented(TopAbs_FORWARD)` or explicitly `Reverse()` a REVERSED face's normal before feeding the AAG.

---

## 9. Tolerance management in OCC

### 9.1 The core model — tolerances are LOCAL, not global

Every vertex, edge, and face carries its own real tolerance (`BRep_Tool::Tolerance`). Vertex tolerance = **radius of a sphere** centered at the vertex that must encompass the curve ends of all incident edges; edge tolerance = **radius of a pipe** along the 3D curve encompassing all representations (3D curve + pcurves). Hierarchy must satisfy `Tol(vertex) ≥ Tol(edge) ≥ Tol(face)`. STEP importer reads a *global* file-header precision and must stay robust even if very coarse — the incoming tolerances are the *sender's* plus OCCT sewing, loosely related to `Confusion`.

### 9.2 The constants

| Constant | Value | Use when |
|----------|-------|----------|
| `Precision::Confusion()` | **1e-7** | Real-space 3D-distance equality; default vertex tolerance in `BRep_Builder::MakeVertex`; default `SetPrecision` for `ShapeFix` |
| `Precision::Angular()` | **~1e-12 rad** | Parallelism / perpendicularity / angle equality; default angle gate for `UnifySameDomain` merge |
| `Precision::PConfusion()` | `Confusion()/100` ≈ **1e-9** | Parametric-space coincidence on closed/periodic surfaces |
| `Precision::Parametric(P, T)` | `P/T` | General real→parametric conversion |
| `Precision::Approximation()` | `Confusion()*10` ≈ **1e-6** | Real-space approximation target |
| `Precision::Intersection()` | `Confusion()*0.01` | Intersection algorithms |
| `gp::Resolution()` | ≈ `DBL_MIN` | **Mathematically-strict** dimensionless near-zero scalar check — NOT for geometric distances |
| `Precision::Infinite` / `IsInfinite` / `IsPositiveInfinite` | finite sentinel | Reliable "unbounded" tests |

### 9.3 Tighten vs. loosen — practical guidance

| Operation | Direction | Why |
|-----------|-----------|-----|
| STEP healing / sewing | **Loosen** (to model's max tolerance, not Confusion) | Pulls/merges across gaps — the point of healing. Danger: swallows intentional tiny features. |
| Boolean ops (symdiff!) | **Tighten** (toward Confusion) | Respect feature boundaries, avoid accidental fusion — note `cad_reverse`'s `symdiff` oracle uses BOPs, so the *healed* tolerance feeding it matters |
| Mesh / render / analysis | Cosmetic (`Approximation`, `Confusion`) | — |
| Vertex/edge equality in AAG | **Tighten** | Loose tolerance creates below-tolerance slivers that corrupt adjacency §11 |

### 9.4 Bounding the healing heap

`ShapeFix_Shape::SetPrecision(Confusion())` + `SetMinTolerance`/`SetMaxTolerance` bound the tolerances healing *generates*. But `ShapeFix_Edge::FixVertexTolerance` and `ShapeFix::SameParameter` **ignore the max** ("open up tolerance, never restrict"). For hard bounds use `ShapeFix_ShapeTolerance::LimitTolerance`. Keep `MinTolerance ≪ MaxTolerance` (forcing them equal is reported to break previously-working shapes, OCCT forum).

### 9.5 Deriving a tolerance from the model

```cpp
ShapeAnalysis_ShapeTolerance st;
st.Tolerance(shape, /*mode*/ mode, /*type*/ TopAbs_EDGE | TopAbs_FACE ...);
   // mode: 0 = average, >0 = max, <0 = min
st.GlobalTolerance(mode);  st.OverTolerance(shape, val, type);  st.InTolerance(shape, lo, hi, type);
```

This is the principled way to pick a sewing/boolean threshold that matches a given STEP file's actual slop rather than guessing Confusion.

---

## 10. OCC version drift (7.6 → 7.8.1, and why the pin matters)

`UnifySameDomain`'s `IntUnifyFaces`/`ReconstructMissedSeam` path was overhauled **every** release from 7.6→7.8, so its output is **not stable across versions**. Healing is deterministic *within* a version, not across.

| Version | `UnifySameDomain` behavior |
|---------|----------------------------|
| 7.6.0 | Case A unified correctly; Case B produced a **twisted, invalid** shape |
| 7.7.0 | Same tests now **SIGSEGV** (tracker 33193); fixed in 7.7.1 (which also fixed BOP hang 33265, small-edge 33247, gate of bug 33421) |
| 7.8.0 | Overhauled again → **premature termination** (returns un-simplified on seam-recovery failure); PCurve-loop logic restored by PR #967; two null-pcurve SIGSEGVs landed after (#1391/#1392) |
| 7.8.1 | **Self-intersection bug on fused co-planar wedges** (OCCT#1193, FreeCAD#29373) — *exactly the OCP pin cad_reverse uses*; error count scales linearly with wedges; fixed in 7.9 |
| 7.9.x | Multiple fixes incl. `SurfaceOfRevolution`/`SurfaceOfLinearExtrusion` over trimmed curves; "improved boolean robustness" |
| 8.0-era | The **"exact" boolean intersection mode** (precise intersection curves; not in 7.7); further BOP improvements |

The user-facing geometry diffs (in `BRepAlgoAPI`/BOPAlgo_ArgumentAnalyzer) mean a fused intermediate yields **different split faces and different vertex/edge tolerances** in 7.7 vs 7.8.1 vs 7.9.2.

**cad_reverse action items:**

- **Pin `cadquery-ocp == 7.8.1.1`** (already the case). Do **not** accept field upgrades of OCP without re-running the non-regression gate (§12): cross-version emit-script comparison is the cheapest drift detector.
- **Avoid 7.8.1 for wedge/slab-array fixtures** (the self-intersection bug). If a table-C-like fixture is a side-by-side slab plate, prefer 7.9.3.x or report upstream.
- All `cad_reverse` fixtures currently round-trip table-B to symdiff < 0.001 under 7.8.1 — but re-verify after any OCP bump.

OCP→OCC mapping (from CadQuery/OCP releases): `7.6.3.0`→7.6.3, `7.7.0.0`→7.7.0, `7.7.1.0`→7.7.1, `7.7.2.0`→7.7.2, `7.8.x`→7.8.1, `7.9.2.0/7.9.3.x`→7.9.2/−7.9.3, `8.0.0.0RC3`→8.0-rc.

---

## 11. Edge tolerance issues → AAG construction failures

The link between small face-boundary gaps and AAG breaks (directly relevant to `cad_reverse/aag.py` + the six PARTIAL fixtures):

1. **How a gap hides:** STEP faces whose shared boundary is nearly-but-not-exactly coincident each carry a 3D edge whose endpoints differ by ε. The seam "exists" topologically but is not watertight at `Confusion()` (1e-7); the deviation is *shielded* by an inflated edge/vertex tolerance.
2. **Why the AAG breaks:** the AAG traverses edges (`TopExp_Explorer` + edge→faces map) and adds an arc per edge with exactly two incident faces. A large-tolerance edge shared with a thin sliver face, or a vertex whose tolerance exceeds its incident faces', makes edge/face classification unstable — an edge is visited on one side only, classified twice, or dropped ⇒ a **missing arc (null adjacency)** or **spurious arc**. An edge with <2 faces is *open/naked*; a zero-face edge is *dangling*; sliver/non-manifold conditions corrupt `GetNeighbors(fid)`.
3. **Fixing strategy — heal before AAG, with bounded tolerance:**
   - `ShapeFix_Shape` with `SetMinTolerance`/`SetMaxTolerance` → `Perform()` runs `ShapeFix_Wire::FixGaps3d/FixGaps2d` (move edge ends to a common vertex), `FixSmall` (drop below-tolerance edges), `FixConnected`, `FixEdgeCurves`.
   - `ShapeFix_Edge::FixVertexTolerance` (grow a vertex to encompass curve ends), `FixSameParameter` (enlarge edge tolerance). Remember these ignore `MaxTolerance`.
   - Alternatively `BRepBuilderAPI_Convert` + `SnapRound`, or `sew` within a tight tolerance.
4. **Detect first:** `BRepCheck_Analyzer::IsValid()` (constructor `GeomControls` flag) runs the full check — an edge-in-face must satisfy `|C(t) − S(P(t))| ≤ tol` with `SameParameter`/`SameRange` true. Modern `BRepCheck_Status` codes (legacy OCE names `BRepCheck_SmallEdge`/`HoleExists`/`MissingFace` folded in): `BRepCheck_SelfIntersectingWire`, `BRepCheck_NoCurveOnSurface`, `BRepCheck_InvalidCurveOnSurface`/`InvalidCurveOnClosedSurface`, `BRepCheck_RedundantEdge`, `BRepCheck_NotClosed`, `BRepCheck_InvalidSameParameterFlag`, `BRepCheck_InvalidToleranceValue`. Heal → re-check → **then** build the AAG.

**Observed correlate in cad_reverse:** the spurious-pocket-on-hole-wall failure mode (§3 intro) arises from below-tolerance slivers on hole walls/floor distorting the pocket recognizer's coverage guard. A tighter `SetMaxTolerance` before healing, or explicit exclusion of hole-floor faces, is the documented first-fix candidate (matches CLAUDE.md's "likely first fix").

---

## 12. Non-regression — healing must not change the shape

`cad_reverse/oracle.py` already implements the gold gate: `symdiff_ratio = V(A⊕B)/V(A)` via two `BRepAlgoAPI_Cut`s fused. This captures **both added and removed** material in one scalar — strictly stronger than volume/area/bbox, which can be unchanged while 2% of material shifts (+X here, −X there). Keep symdiff as the gate.

**Full non-regression recipe (add to the healing path or a test suite):**

1. Snapshot before and after healing: `BRepGProp_VolumeProperties` volume, `BRepGProp_SurfaceProperties` area, `BRepAdaptor` bbox.
2. Rapid pre-filter: assert *volume* within relative epsilon (e.g. 1e-9) — cheap. Only run the expensive symdiff BOP-fuse when volume already moved (or as the final, always-on gate the pipeline already uses).
3. **Topology guard:** assert `num_faces / num_edges / num_vertices` and AAG node/arc count before vs. after within tolerance. Merging co-planar faces *legitimately decreases* counts; the guard is "no explosion/inversion". `BRepCheck_Analyzer::IsValid` both times. A heal that silently destructures (an `IntUnifyFaces` failure mode) is caught here before symdiff runs.
4. **Diffing artifact on failure:** `BRepTools::Write(shape, "before.deb")` / `"after.deb"` (DEB is compact + stable; keep both for CI).
5. **Cross-version drift matrix:** run the identical `reconstruct()` suite on pinned OCP matrix (7.7.x, 7.8.1, 7.9.x) and assert **byte-identical emitted script** — the cleanest detector of OCC heal drift. Any version bump that moves symdiff off golden is a red flag to pin back.

Note the existing `oracle.py` `symdiff_extent` (bbox diagonal of the difference solid) is the correct secondary (replaces Hausdorff; `BRepExtrema_DistShapeShape` returns minimum distance = 0 for any overlap, useless). `is_watertight()` (valid + `ShapeType()==TopAbs_SOLID`) is the fast watertight probe and a sensible `ShapeAnalysis_Shell` substitute in the fast-path gate of §7.

---

## 13. Performance — what's expensive, what to skip for clean files

| Operation | Cost | Skip for clean STEP? |
|-----------|------|----------------------|
| `ShapeFix_Shape.Perform()` | Moderate (local edge/wire/shell work; `SameParameter` can dominate) | Yes if valid+watertight (fast-path §7) |
| `ShapeUpgrade_UnifySameDomain.Build()` | **High** — non-incremental full Boolean re-fuse (`IntUnifyFaces`), minutes on large parts, documented infinite hangs | **Yes** — never a validity precondition; only to reduce split-face count |
| `BRepBuilderAPI_Sewing` | Moderate, whole-topology | Yes if already watertight (`NbFreeEdges==0`) |
| `ShapeFix_Wire`/`Edge` ops (`FixConnected`, `FixEdgeCurves`, `FixGapsByRanges`) | Cheap (per-edge) | Mostly |
| `SameParameter` (`BRepLib::SameParameter`) | Can dominate on many edges | Already satisfied on authored STEP — keep in codepath but it's usually a no-op |
| `BRepGProp` volume/area | Cheap | — (do every heal for §12 gate) |

**Fast-path concrete:** gate on `BRepCheck_Analyzer::IsValid(shape)` **and** `ShapeAnalysis_Shell::CheckOrientedShells` (or `oracle.is_watertight`); if both true, skip `ShapeFix_Shape` and `ShapeUpgrade_UnifySameDomain`. Called only when fewer faces help recognizers. This removes both expensive ops on real authored files. Bound `UnifySameDomain` with a watchdog/first-fallback (treat as best-effort); batch merges into **one** `UnifySameDomain` pass (cad_reverse already does), never per-feature.

---

## 14. Key takeaways

1. **Three families, fixed order.** Repair (`ShapeFix`) → simplify (`ShapeUpgrade_UnifySameDomain`) → convert (`ShapeCustom`). `ShapeAnalysis` is detection-only. `ShapeFix_Shape.Perform()` then `UnifySameDomain(..., True, True, True).Build()` is the **correct, normative order** — heal.py is right; never run unify before fix.
2. **`UnifySameDomain` is a slow, non-incremental Boolean re-fuse, not a post-process.** Treat it as best-effort, bound it, and only call it (a) after `ShapeFix`, (b) when you actually need fewer split faces for feature detection — never as a validity precondition.
3. **`cad_reverse` passes `ConcatBSplines=True`** — revisit: for editable-CadQuery output `False` is usually right (don't flatten spline seams). Faces from primitive surfaces dominate table-B fixtures, so the flag is low-impact there.
4. **7.8.1 has a documented `UnifySameDomain` self-intersection bug on fused co-planar wedge arrays** (OCCT#1193/FreeCAD#29373, fixed 7.9) — exactly this module's OCP pin. Avoid it for side-by-side slab/prismatic-plate fixtures; re-run the §12 gate after any OCP bump. Healing output is not stable across OCC minors.
5. **Tolerances are local, not global.** Use `Precision::Confusion()` (1e-7) for distances, `Angular()` for directions, `PConfusion()` for parametric space, `gp::Resolution()` only for pure scalars. Bind `SetMinTolerance`/`SetMaxTolerance` on `ShapeFix_Shape` (min ≪ max); but know `FixVertexTolerance`/`SameParameter` ignore the max — bound with `ShapeFix_ShapeTolerance` if you need hard caps. Align a sewing/heal tolerance to the model's **max** tolerance via `ShapeAnalysis_ShapeTolerance` rather than guessing.
6. **Orientation precedes AAG.** Wire orientation on a face → `ShapeFix_Face::FixOrientation`; face-vs-neighbor/shell consistency → `ShapeFix_Shell::FixFaceOrientation` / `ShapeFix_Solid::FixShellOrientationMode`. Flipping a cap's orientation reclassifies every shared-edge dihedral — fillets read as bosses, hole caps as pads. Heal to a watertight outward shell *before* `build_aag`.
7. **Small face-boundary gaps break AAG stably.** The gap hides behind an inflated edge/vertex tolerance, producing missing/spurious AAG arcs and below-tolerance slivers. Fix with `ShapeFix_Wire::FixGaps3d/2d` + `FixSmall` + `FixConnected` under a bounded tolerance before AAG; detect with `BRepCheck_Analyzer` (`GeomControls`) and `ShapeAnalysis_Shell`.
8. **Non-regression.** Keep `symdiff_ratio < 0.001` as the gold gate (it captures added+removed material). Layer a cheap volume/area/bbox + `IsValid` + topology/AAG-count pre-filter in front of the expensive BOP-fuse. Diff with `BRepTools::Write(..., "before.deb"/"after.deb")`. Cross-version byte-identical emit-script is the cleanest drift detector.
9. **Sewing pitfall:** successful `BRepBuilderAPI_Sewing::Perform()` does **not** imply closed — re-check `NbFreeEdges()==0` afterward. Non-manifold `option4` stays off for manifold parts; use the model's maximum tolerance (work tolerance = `myTol + tolEdge1 + tolEdge2` under `SetLocalTolerancesMode`).
10. **The ShapeProcess/ShapeHealing.pm meta-framework** is worth adopting only when healing policy must vary per fixture — cad_reverse's fixed two-call chain is deterministic and sufficient for the known-good case. If you ever need it, drive `XSAlgo_AlgoContainer::ProcessShape(shape, Prec, MaxTol, rscfile, seq, ctx)` with a `.res`-style recipe.

---

## Appendix — installed-environment reference

- Installed pin (this repo): `cadquery-ocp 7.8.1.1.post1` ⇒ OCC **7.8.1**.
- `cad_reverse/heal.py` (`heal_shape`): `ShapeFix_Shape(shape).Perform()` → `ShapeUpgrade_UnifySameDomain(fixed, True, True, True).Build()` → `BRepCheck_Analyzer.IsValid()` guard (raises on invalid). This matches §3 recommended ordering; only the `ConcatBSplines=True` flag is a candidate-for-revisit (takeaway #3).
- `cad_reverse/oracle.py`: `symdiff_ratio` / `symdiff_extent` via `BRepAlgoAPI_Cut`/`Fuse`; `is_watertight` = valid + `TopAbs_SOLID`; `face_count` via `TopExp_Explorer`. Ready-made non-regression gate (§12).

---

## Sources

- OCCT reference manual (dev.opencascade.org/doc/occt-7.8.0/refman/): [ShapeFix_Shape](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeFix__Shape.html), [ShapeFix_Face](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeFix__Face.html), [ShapeFix_Wire](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/class_shape_fix___wire.html), [ShapeFix_Edge](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeFix__Edge.html), [ShapeFix_Shell](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeFix__Shell.html#details), [ShapeFix_Solid](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeFix__Solid.html), [ShapeFix_ShapeTolerance](https://dev.opencascade.org/doc/occt-7.5.0/refman/html/class_shape_fix___shape_tolerance.html), [ShapeAnalysis_Shell](https://dev.opencascade.org/doc/refman/html/class_shape_analysis___shell.html), [ShapeAnalysis_ShapeTolerance](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeAnalysis__ShapeTolerance.html), [ShapeUpgrade_UnifySameDomain](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classShapeUpgrade__UnifySameDomain.html), [BRepBuilderAPI_Sewing](https://dev.opencascade.org/doc/refman/html/class_b_rep_builder_a_p_i___sewing.html), [ShapeAnalysis_FreeBounds](https://old.opencascade.com/doc/occt-6.9.1/refman/html/class_shape_analysis___free_bounds.html), [BRepCheck_Analyzer](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_b_rep_check___analyzer.html), [BRep_Tool](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classBRep__Tool.html)
- [ShapeCustom](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_shape_custom.html) and [ShapeCustom_BSplineRestriction](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_shape_custom___b_s_pline_restriction.html)
- [ShapeProcess](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_shape_process.html) / [ShapeProcess_OperLibrary](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_shape_process___oper_library.html) / [XSAlgo_AlgoContainer](https://dev.opencascade.org/doc/occt-6.9.1/refman/html/class_x_s_algo___algo_container.html)
- [OCCT User Guide: Shape Healing](https://old.opencascade.com/doc/occt-7.5.0/overview/html/occt_user_guides__shape_healing.html) / [shape_healing.md (OCCT source)](https://raw.githubusercontent.com/Open-Cascade-SAS/OCCT/0ebbbedb239d6fffb7e1c8c2d36970a3ab1d9300/dox/user_guides/shape_healing/shape_healing.md)
- [BRepBuilderAPI_Sewing.cxx](https://github.com/Open-Cascade-SAS/OCCT/blob/master/src/ModelingAlgorithms/TKTopAlgo/BRepBuilderAPI/BRepBuilderAPI_Sewing.cxx) / [.hxx — WorkTolerance formula](https://github.com/Open-Cascade-SAS/OCCT/blob/master/src/ModelingAlgorithms/TKTopAlgo/BRepBuilderAPI/BRepBuilderAPI_Sewing.hxx)
- Roman Lygin, [Topology and Geometry in Open CASCADE, Part 2](https://opencascade.blogspot.com/2009/02/topology-and-geometry-in-open-cascade_09.html)
- OCCT forum/discussions: [UnifySameDomain after STEP reload](https://dev.opencascade.org/content/shapeupgradeunifysamedomain-do-good-after-save-step-and-reload-it-backwhy), [7.8.0 premature termination](https://dev.opencascade.org/content/occt-780-shapeupgradeunifysamedomain-premature-termination), [shape tolerance](https://dev.opencascade.org//content/shape-tolerance), [how to minimize edge tolerance](https://dev.opencascade.org/content/how-minimize-edge-tolerance), [REVERSED face normals](https://dev.opencascade.org/content/topodsface-reversed-orientation), [incorrect normals](https://dev.opencascade.org//content/incorrect-normals-occt-and-cad-assistant), [STEP reader can't disable healing](https://dev.opencascade.org/content/step-file-reader)
- OCCT GitHub issues/PRs: [#1193](https://github.com/Open-Cascade-SAS/OCCT/issues/1193), PR [#941](https://github.com/Open-Cascade-SAS/OCCT/pull/941), [PR #967](https://github.com/Open-Cascade-SAS/OCCT/pull/967), [#925](https://github.com/Open-Cascade-SAS/OCCT/issues/925), PR [#1227](https://github.com/Open-Cascade-SAS/OCCT/pull/1227), [PR #1129](https://github.com/Open-Cascade-SAS/OCCT/pull/1129), [huge-face-tolerance commit for bug 0027122](https://github.com/Open-Cascade-SAS/OCCT/commit/f706dd34b398d6e761ebb920adf43bc83102ab66)
- Trackers: [OCCT#32949 infinite loop (open)](https://tracker.dev.opencascade.org/view.php?id=32949), [33193 SIGSEGV](https://tracker.dev.opencascade.org/view.php?id=33193)
- FreeCAD: [#29373](https://github.com/FreeCAD/FreeCAD/issues/29373), [#5594 sweep tolerances](https://github.com/FreeCAD/FreeCAD/issues/5594), [#20455 sew tolerance](https://github.com/FreeCAD/FreeCAD/issues/20455)
- Analysis Situs: [SEW](https://www.analysissitus.org/features/features_sew.html), [AAG](https://www.analysissitus.org/features/features_aag.html), [dihedral check](https://analysissitus.org/features/features_check-dih-angles.html), [geometry modification threads](https://analysissitus.org/forum/index.php?threads/geometry-modification.464/)
- CadQuery/OCP: [releases / OCC mapping](https://github.com/CadQuery/OCP/releases)
- XBim: [#483 freeze / OCCT#32949](https://github.com/xBimTeam/XbimGeometry/issues/483)
- DeepWiki: [Shape Healing](https://deepwiki.com/Open-Cascade-SAS/OCCT/3.4-shape-healing)
