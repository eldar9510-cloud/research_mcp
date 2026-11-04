---
{
  "format": 1,
  "metadata": {
    "id": "archived-07-occ-opencascade-cadquery-ocp-capabilities-for-multi-feature-recognition-617b82c7",
    "title": "07 — OCC (OpenCascade) / CadQuery-OCP Capabilities for Multi-Feature Recognition",
    "question": "What findings, alternatives and limitations does the historical investigation document about 07 — OCC (OpenCascade) / CadQuery-OCP Capabilities for Multi-Feature Recognition?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: 07 — OCC (OpenCascade) / CadQuery-OCP Capabilities for Multi-Feature Recognition. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of 07 — OCC (OpenCascade) / CadQuery-OCP Capabilities for Multi-Feature Recognition; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:46.017Z"
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
  "sourceDigest": "617b82c7e10e0ee322c23ea488c4c053e066e37ad38d0fb290b9b6462232b49d",
  "proposalRevision": "4bc9741481e29f1ddd7c8cfe33c2c11241f8aefdbce83dc7aa1d57e69dab800b"
}
---
# 07 — OCC (OpenCascade) / CadQuery-OCP Capabilities for Multi-Feature Recognition

**Research date:** 2026-08-06
**Scope:** Every OCC module that could help multi-feature recognition in `cad_reverse`.
**Grounding:** Every class recommended below was **empirically verified imported** in our actual build
(`cadquery 2.7.0`, `cadquery-ocp 7.8.1.1.post1` → OCCT 7.8.1) using:

```
.venv/bin/python -c "from OCP.<Mod> import ..."
```

Only classes confirmed present are listed as "Available". Anything not in OCP is flagged
explicitly. This report is the **authoritative** supplement to `../01_ocp_cadquery_brep_patterns.md`
(which already covered `ShapeAnalysis_FreeBounds`, `BRepOffset_Analyse`, `BRepExtrema_DistShapeShape`
uselessness, and meshing).

---

## 1. `BRepFeat` module — FEATURE CONSTRUCTION, NOT RECOGNITION

**Answer: `BRepFeat` is entirely feature *construction*.** It "creates and manipulates
form and mechanical features in a B-Rep framework" (prism, draft prism, cylinder, revolve, pipe)
by **building** shapes via local Boolean glue/fuse/cut. There is no detection/classification step.
Recognition and construction are inverse directions: `BRepFeat` assumes you already know what the
feature is and asks where/how far to build it; our pipeline assumes the opposite.

**Key classes (all 51 available in OCP):**

| Class | Purpose | Recognition value |
|-------|---------|-------------------|
| `BRepFeat_MakePrism` | Prism feature (protrusion/depression) up to a length/facing face | None directly |
| `BRepFeat_MakeDPrism` | Draft prism; `Direction`/`Length`/`Fuse`(0=cut,1=fuse) | None directly |
| `BRepFeat_MakeCylindricalHole` | Cylindrical hole builder (through/blind) | None directly |
| `BRepFeat_Gluer` | Glues a feature onto a basis shape (local glue) | None directly |
| `BRepFeat_SplitShape` | Splits an existing solid by a sketch on a face (pre-Boolean) | Low — used to *carve*, not to detect |
| `BRepFeat_MakeLinearForm` / `MakeRevolutionForm` / `MakePipe` | Extrusion/revolution/pipe feature builders | None directly |
| Status enum (`Form::Done`, `BRepFeat_*` errors) | Constr. status codes | — |

**Why not useful for recognition:** `BRepFeat_SplitShape` requires a *user-supplied sketch profile*
to split with. It has no notion of "find the feature already in the shape." The modern recognizer
replacement for split-by-plane work is `BRepAlgoAPI_Splitter` (section 3), which needs no sketch.

---

## 2. `ShapeAnalysis` module — MOST UNDER-UTILIZED, HIGH VALUE

**Available (ver 7.8.1):** `Surface, Curve, Edge, Wire, Shell, FreeBounds, FreeBoundsProperties,
CanonicalRecognition, ShapeContents, CheckSmallFace, ShapeTolerance, BoxBndTree, WireOrder,
WireVertex, TransferParameters, TransferParametersProj, Geom, DataMapOfShapeListOfReal`.

We already use `ShapeAnalysis_Surface` (via OCP utils) and `ShapeAnalysis_FreeBounds`. The
**under-used** tools:

### `ShapeAnalysis_CanonicalRecognition` — HIGH HIGH VALUE (NEW)
Represents a surface/curve by a **simpler recognizer** (plane, cylinder, cone, sphere, torus,
revolution/linear BSpline) when geometry is *close enough* to canonical. This is a free geometric
normalizer. Implications:
- Lets a B-spline fillet face be classified as a **cylinder** → unifies fillet/hole/shaft logic.
- Lets a slightly-wavy planar pocket base be forced to `Geom_Plane` for stable cap-face arbitration.
- Probabilistic `Confidence()` numbers available; discrete fallback if not confident.

### `ShapeAnalysis_Shell` — MEDIUM
`CheckOrientedShells(S, alsofree=1)` returns `BadEdges()` (orientation violations) and
**`FreeEdges()`** (edges with one face — free boundary). For "stock"/"sheet" parts this is the
fastest way to find open/walled faces without AAG bookkeeping. Also useful to detect a *started*
open shell (unclosed feature) before healing.

### `ShapeAnalysis_ShapeContents` — MEDIUM
One-pass `Perform(S)` histogram: `NbFreeFaces/Wires/Edges`, `NbC0Surfaces`, `NbOffsetSurf`,
`NbSolidsWithVoids`, etc. Use as a cheap **pre-classifier**: a part with 1 wire per cap = simple
box-family stock; free edges = not-watertight → skip feature ESC (degrades gracefully).

### `ShapeAnalysis_CheckSmallFace` — LOW
Flags faces too small (below a size threshold) — useful to prune **false faces** created by
healing or splitter debris before AAG.

### `ShapeAnalysis_FreeBoundsProperties` — (already covered in 01)
`CheckNotches()` discriminates hole vs outer contour. Already leveraged.

### `ShapeAnalysis_FreeBounds` / `WireOrder` / `WireVertex` — MEDIUM
Re-orient/order free wires into closed chains and build connectivity — the same job `BRepTools_WireExplorer`
does in our stock code but packaged for arbitrary free bounds. Can replace hand-rolled re-ordering.

---

## 3. `BRepAlgoAPI_Splitter` & Boolean decomposition — HIGH VALUE

**`BRepAlgoAPI_Splitter` IS available.** This is the single most powerful capability we are not
using.

**What it does:** Partitions an **Object** shape by a set of **Tool** shapes (e.g. a grid of planes
or per-feature cutting surfaces) with **no Boolean semantics** — returns a compound of all pieces
that the tools cut the object into. Tools are not part of the result, just boundaries.

**Recognition applications:**

1. **Plane-grid voxel isolation (debugging + arbitration).** Cut the stock bbox by X/Y/Z planes at
   feature boundaries → each resulting cell contains exactly one feature → pair an unknown face to
   the feature by containment. Confirmed pattern (pythonOCC + OCCT docs): infinite/large plane faces
   as tools; `SetGlue`/`SetNonDestructive`; sizes must exceed the part bbox.

2. **Procedural "what face does this cap close?"** Split the solid by the cap face's plane → the
   split face adjacent to the cap + the cap itself are the feature's end caps → feeds our
   far-cap/dedup arbitration without hand-walking AAG.

3. **Detached-region extraction.** After `BRepAlgoAPI_Common(solid, tool)` to get a sub-region,
   `Splitter` returns each connected piece as a separate TOPOLOGICAL entry → per-piece
   `BRepGProp` volume/centroid tells which feature is where.

> Compare to pure Boolean: `BRepAlgoAPI_Cut`/`Common` split in two; `Splitter` splits in N and is
> faster for grids (partition, not per-plane re-Boolean).

**`BRepAlgoAPI_Check` (available) — self-intersection detector.**
Our tests already confirm `BRepCheck_Analyzer.IsValid()=True` can still hide self-interference that
breaks later Booleans. `BRepAlgoAPI_Check` detects **self-intersection** that `BRepCheck` misses
(confirmed limitation cited in forum). Adopt as a belt-and-suspenders pre-flight before emitting a
recognized feature result — cheap and catches the class of failures Fixtures #10/#11 hit.

---

## 4. `BRepOffset` / `BRepOffsetAPI` — DE-FILLETTING IS REAL but brittle

**Available:** `BRepOffsetAPI_MakeOffsetShape` (PerformByJoin/PerformBySimple), `BRepOffset_Analyse`,
`BRepOffset_MakeSimpleOffset`, `BRepOffsetAPI_FindContigousEdges`. `BRepOffset_*` 35 classes present.

**Can we "de-fillet" by offset?** Conceptually **yes**: a **negative inward offset** consumes the
fillet radius, yielding sharp edges where fillets were; a subsequent positive offset restores
nominal dims. Two ways:
- `PerformByJoin(S, offset<0, tol, BRepOffset_Skin, ...)` — offset with join type `GeomAbs_Arc`/`_Intersection`.
- `BRepOffset_MakeSimpleOffset` — simpler offset (no intersection computation), larger tolerance gap.

**Critical limitations (why this is RESEARCH-grade, not default):**
1. **C1 continuity required** — fails on C0 BSpline (`Geom_UndefinedDerivative`). Our foreign/broken
   STEP fixtures are exactly the C0 case.
2. **Fails at vertices with >3 converging edges** — common on fillet networks (our pocketed/slotted plates).
3. **Self-intersection** on complex offset chains; the `SelfInter` elimination is **not implemented**;
   `Intersection=true` is **not fully implemented / not recommended**.
4. Extremum-join `GeomAbs_Intersection` avoids free edges but needs convex smooth joins.

**Better alternative — `BRepAlgoAPI_Defeaturing` (section 4.1).** For **removing** fillets/chamfers,
`MakeOffsetShape` is the wrong tool. `BRepFeat` catalog + `Defeaturing` are the robust path.

### 4.1 `BRepAlgoAPI_Defeaturing` — HIGH VALUE (available)
Removes **specified faces** (holes, bosses, gaps, **fillets, chamfers**) from a solid: adjacent faces
are extended and trimmed to fill the removed feature. This is closer to feature *understanding* than
anything else in OCCT and is directly relevant to us in four ways:

1. **Reverse-fillet sanity check.** Given our recognized fillet faces, run `Defeaturing` with those
   faces `AddFacesToRemove(...)`. If the result is a *valid* solid whose face set ≈ the pre-fillet
   base geometry, that is independent confirmation the faces really were fillets (strong oracle).
2. **Feature-free "cartoon" for arbitration.** Removing fillets/chamfers yields a sharp-edge part —
   a cleaner domain for pocket/pad/slot cap-face reasoning and for stock-profile base-face voting.
3. **Converts a FILLET case into a POCKET/PAD numeric check** so the wireframe recognizers can then
   size the now-sharp feature. This closes a real gap: today fillets + pockets both present are the
   hardest fixture family.
4. **History (`SetToFillHistory`) + `BRepTools_History`** (`IsDeleted`/`Modified`/`Generated`) maps
   each removed face to the faces that filled it → gives us the "fillet face → adjacent planar face"
   adjacency our AAG already infers, but with a robust geometric basis.

**Limitations to profile before adopting:**
- **No automatic feature detection** — faces must be *selected* (we provide them from our AAG — fine).
- Tangent-adjacent faces not handled.
- **Unconditionally applies `ShapeUpgrade_UnifySameDomain` at the end**, which can merge *other*
  symmetric faces globally (unexpected, can't disable). Bug: removing a small fillet can hang
  (`IntTools_BeanFaceIntersector` range explosion) in 7.6–7.7 — must test on 7.8 per fixture.
- Degenerate (zero-radius) fillets / C0 surfaces unsupported.

**Recommendation:** prototype `Defeaturing` as an *escalation oracle* behind the existing reason-code
gate, NOT as a mandatory stage — treat as an independent confirm, keep its failures non-fatal.

---

## 5. `BRepExtrema` — EXTREMUM DISTANCES & PROXIMITY for feature interaction

**Available:** `DistShapeShape` (we use), plus **`ShapeProximity`**, `ShapeList`, `OverlapTool`,
`ProximityValueTool`, `TriangleSet`, `SolutionElem`, `ElementFilter`, `SelfIntersection`,
`DistanceSS`, `ExtFF/ExtCF/ExtPF/...`, `Poly`, `VertexInspector`, `IsInFace/IsOnEdge/IsVertex`.

`BRepExtrema_DistShapeShape` is confirmed useless for overlap (min distance = 0 on touch) — already
documented in 01.

### `BRepExtrema_ShapeProximity` (available) — MEDIUM, precision-sensitive
- Not a distance metric: returns overlap face-sets within a **tolerance**, and a `Proximity()`
  "layer thickness" value.
- **Requires pre-triangulation** (`BRepMesh_IncrementalMesh`), result is approximate to the deflection.
- Known bug (OCCT forum, our 01 report): **does not always enumerate every face within tolerance**
  even when `DistShapeShape` confirms it, and the `OverlapSubShapes` map binding is awkward in OCP.
- **Use-cases for us:** (a) detect which recognized feature faces *actually touch* the base stock —
  fast Face-Face adjacency probing without re-walking AAG; (b) collision-based "is this hole blind or
  through the far wall" arbitration (overlap of the hole wall with the opposing cap plane).

**Recommendation:** use `ShapeProximity` only as a **membership probe** (face-that-overlaps-tool),
never as our geometric truth. Our `symdiff_extent` remains the gold secondary gate.

---

## 6. `TopOpeBRep` / `BRepAlgo` — LEGACY/PRIMITIVE TOOLS (largely superseded)

**`TopOpeBRep` (48 classes available in OCP)** is the *old* Boolean-intersection kernel
(`DSFiller`, `EdgesIntersector`, `FacesIntersector`, `ShapeScanner`, `ShapeIntersector`,
`ShapeIntersector2d`, `VPointInter`, `WPointInter`). It is **progressively deprecated** in favor of
`BOPAlgo`. `ShapeScanner` + `Explorer` do efficient bounding-box culling of face/edge pairs during
intersection — but exposing it directly buys us nothing over `BRepAlgoAPI_*`, which uses the modern
kernel with the same BVH culling, plus history and error status.

**`BRepAlgo` (5 classes):** `FaceRestrictor` (available), `AsDes`, `Image`, `Loop`,
`NormalProjection`.
- **`BRepAlgo_FaceRestrictor` is genuinely interesting** — restricts a face to a set of wire
  boundaries, producing sub-faces. That is a surgical "cut this one face by these wires" primitive
  our pocket/pad state could use to isolate a single feature's cap without a full splitter run.

**Recommendation:** do **not** build on `TopOpeBRep` directly (deprecated, low-level, no history).
Keep `BRepAlgo_FaceRestrictor` on the backlog as a cheap single-face re-wire for degenerate caps.

---

## 7. `BRepCheck` — INTERNAL VALIDITY, NOT FEATURE BOUNDARIES

**Available: `BRepCheck_Analyzer`** plus 41 status enums (`SelfIntersectingWire`, `IntersectingWires`,
`BadOrientation`, `BadOrientationOfSubshape`, `NotClosed`, `NotConnected`, `InvalidImbricationOfWires`,
`InvalidMultiConnexity`, `RedundantFace/Edge/Wire`, `FreeEdge`, `UnorientableShape`, etc.).

**Answer to "can BRepCheck detect feature boundaries?" — No.** It checks topological/geometric
*validity* (closed wires, edge-vertex tolerance, same-parameter flags, orientation), **not** whether
two adjacent faces form a fillet, pocket, or pad. It cannot label features.

**But the status enum is a free source of robustness flags we should surface in `PipelineResult`:**
- `SelfIntersectingWire` / `IntersectingWires` / `InvalidImbricationOfWires` → catch the exact
  pathology behind Fixture #10/#11 pocket failures.
- `BadOrientationOfSubshape` → a face's normal is inconsistent → flag before it poisons the
  outward-normal gate (Issue #3's whole premise).
- `FreeEdge` / `NotClosed` → open-shell detection (never ESC features on non-watertight input).

**Belt-and-suspenders:** `BRepCheck_Analyzer.IsValid()=True` does **not** guarantee no
self-intersection (documented); pair it with **`BRepAlgoAPI_Check`** (section 3) for the definitive
self-interference gate, and with `BOPAlgo_MakerVolume` to rebuild a clean solid from faces as a
healing escalation.

---

## 8. CadQuery community feature recognition — NO TURNKEY TOOL EXISTS

**Finding:** There is **no** community feature-recognition library for CadQuery/OCP. Confirmed
earlier in research 01 and re-confirmed here:
- CadQuery has **no** `Shape.symdiff()`/`compare()` in 2.7.0 — booleans are `fuse/cut/intersect`,
  `.distance()` (BRepExtrema) returns 0 on overlap; `compare()` is build123d-only.
- `build123d` adds **no** recognizers.
- Community fillet-detection snippets (this research) use `BRep_Tool.Curve_s` + 
  `DynamicType().Name()=="Geom_TrimmedCurve"` — a heuristic equivalent to our blend-mask arc check,
  *not* a robust tool. All agree arcs/lines don't unambiguously mean fillet/chamfer without
  face-adjacency/continuity corroboration (which we already do correctly in `aag.py`/`fillet_chamfer.py`).

**Recommendation:** do **not** hunt for a community library — we are the feature-recognition layer.
The community snippets confirm our approach (AAG + geometry-type + continuity) is the accepted shape.

---

## 9. OCP vs PythonOCC binding coverage

- **OCP** (`cadquery-ocp`, pywrap + clang parsing of OCCT headers) is the **most complete** of the
  Python wrappers; PythonOCC historically uses a lighter parser and has had **wrapper gaps** on e.g.
  `BRepExtrema_ShapeProximity` return maps (numerous filed issues) and GProp out-params.
- We are **not** missing any class recommended in this report — all verified importable in OCP 7.8.1.
- The only real OCP gotchas are **not** missing classes but calling-convention (peewees): out-params
  mutated in place (`Bnd_Box`, `gp_Pnt`), a few return tuples, and infinities/`Not`-flags — all
  already catalogued in 01 §"OCP binding gotchas" and our own test suite.
- **Do not add a PythonOCC dependency.** Anything it exposes that we might want (e.g. `OCC.Extend
  .TopologyUtils`) is a template we can re-implement natively, and mixing OCP+pythonOCC bindings in
  one process is a known footgun.

---

## 10. Face classification (side / bottom / top) — assemble from primitives

**No single OCC API labels "side/bottom/top" for us.** BUT all the inputs exist and the assembly is
trivial and deterministic:

1. `BRep_Tool.Surface_s(face)` → the `Geom_Surface`.
2. Dominant/outward normal: evaluate surface normal at a set of sample (u,v) (centroid + a few),
   average them, then apply `face.Orientation()==TopAbs_REVERSED → reverse` (or use
   `BRepGProp_Face.Normal` which handles orientation already — per 01).
3. Dot with the known **extrusion axis** (the recognized stock direction): aligned → "top cap",
   anti-parallel → "bottom cap", ≈0 → "side".
4. `ShapeAnalysis_CanonicalRecognition` will first normalize a BSpline cylinder cone/etc. to
   canonical so the normal-averaging is stable.

**Recommendation:** wrap this in one `classify_face_pose(face, axis) -> top|bottom|side|oblique`
helper; it replaces our scattered "is this the base face" checks with a single tested routine and
leverages `CanonicalRecognition` for robustness. Note the shared-face subtlety: a face *shared* by
two solids carries different orientation per solid; for per-solid classification always fetch the
face in that solid's shell (compare `IsSame`, not `IsEqual`).

---

## Recommendations (consolidated)

Prioritized adoptions, each mapped to which of our problems it solves.

| # | Adopt | OCP class(es) | Solves | Effort |
|---|-------|---------------|--------|--------|
| R1 | **Splitter for plane/face decomposition & cap arbitration** | `BRepAlgoAPI_Splitter` | Far-cap/dedup (#10/#15); unknown-face→feature pairing; per-region volume/centroid for placement | **Medium** (new stage; guard `SetGlue`/fuzzy, bbox-enlarged tools) |
| R2 | **Feature-free cartoon / reverse-fillet oracle** | `BRepAlgoAPI_Defeaturing` + `BRepTools_History` | Verify fillet/chamfer faces; unlock pocket/pad reasoning on filleted parts; adj-adj history | **Medium-High** (brittle on tangents/C0; treat as esca-lation oracle, non-fatal) |
| R3 | **Canonical geometric normalizer** | `ShapeAnalysis_CanonicalRecognition` | Unify B-spline → cylinder/plane for fillet/hole/shaft + cap-face stability | **Low** |
| R4 | **Open-shell / free-boundary + histogram pre-classifier** | `ShapeAnalysis_Shell`, `ShapeAnalysis_ShapeContents`, `CheckSmallFace` | Never ESC the not-watertight/open/void parts; drop healing debris faces | **Low** |
| R5 | **Definitive self-intersection gate** (belt-and-suspenders on `BRepCheck`) | `BRepAlgoAPI_Check` | Catch self-interference that `Analyzer.IsValid()` misses (Fixtures #10/#11 class) | **Low** |
| R6 | **Face-pose classifier** (top/bottom/side/oblique v axis) | `BRep_Tool.Surface_s` + `BRepGProp_Face.Normal` + `CanonicalRecognition` | Side/cap/base arbitration across stock/pocket/pad | **Low** |
| R7 | **Membership probe** (fast face-overlap) | `BRepExtrema_ShapeProximity` (pre-triangulate) | Through-vs-blind far-wall arbitration; face-to-base contact probe | **Medium** (precision-sensitive; probe-only, never truth) |
| R8 | **Reserve** single-face re-wire for degenerate caps | `BRepAlgo_FaceRestrictor` | Isolate one feature's cap without full split | **Low** (backlog) |

### Explicitly DO-NOT adopt
- **`BRepFeat`** — construction-only; inverse of our goal. (Except `MakeCylindricalHole` as a
  *reference builder* in emit tests, which we already do via CadQuery.)
- **`TopOpeBRep`** direct use — superseded by `BOPAlgo`/`BRepAlgoAPI` (BVH culling + history built-in).
- **`BRepOffsetAPI_MakeOffsetShape` for de-filleting** — C1/vertex-valence/self-intersection limits
  make it unreliable for our foreign STEP set; `Defeaturing` (R2) is the correct fillet-removal tool.
- **PythonOCC dependency** — OCP is strictly sufficient for every recommendation here.

### Suggested sequencing
1. **R6 + R3 (Low effort)** first — they are pure win, no brittle kernels, and harden existing
   stock/pocket/pad face logic immediately.
2. **R4 + R5 (Low)** — cheap robustness that de-risks every fixture that heals/meshes.
3. **R1 (Medium)** — the highest-leverage structural change; prototype on the 4 pocketed/slotted
   fixtures where far-cap logic currently tangles.
4. **R2 (Medium-High)** — prototype as a reason-code-gated oracle behind `Defeaturing`; ship only if
   convergence count improves on the fillet families without regressing the chamfered/filleted boxes.
5. **R7/R8** — leave as stubs; only pull in if through/blind or cap-arbitration regresses.

---

## Sources
- Defeaturing: [BRepAlgoAPI_Defeaturing OCCT 7.8](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classBRepAlgoAPI__Defeaturing.html#details) · [hang bug (7.6–7.7)](https://dev.opencascade.org/content/brepalgoapidefeaturing-never-finishes) · [forum report](http://analysissitus.org/forum/index.php?threads/brepalgoapi_defeaturing-strange-things-happens-in-italy.467/)
- Splitter/partition: [BRepAlgoAPI_Splitter 7.7](https://dev.opencascade.org/doc/occt-7.7.0/refman/html/class_b_rep_algo_a_p_i___splitter.html) · [split solid by face](https://dev.opencascade.org/content/splitting-solid-using-and-surface-face-solid) · [split shell by plane](https://analysissitus.org/forum/index.php?threads/splitting-a-shell-into-two-shells-by-a-plane.215/)
- BRepFeat: [BRepFeat overview](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classBRepFeat.html) · [MakeDPrism](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_b_rep_feat___make_d_prism.html)
- ShapeAnalysis: [ShapeContents](https://old.opencascade.com/doc/occt-7.3.0/refman/html/class_shape_analysis___shape_contents.html) · [Shell](https://dev.opencascade.org/doc/occt-7.0.0/refman/html/class_shape_analysis___shell.html) · [CanonicalRecognition hxx](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/ShapeAnalysis__CanonicalRecognition_8hxx.html)
- Proximity: [BRepExtrema_ShapeProximity 7.9](https://dev.opencascade.org/doc/occt-7.9.0/refman/html/class_b_rep_extrema___shape_proximity.html) · [missing-faces bug](https://dev.opencascade.org/content/brepextremashapeproximity-does-not-return-all-faces-within-tolerance) · [pythonocc issue #628](https://github.com/tpaviot/pythonocc-core/issues/628)
- TopOpeBRep: [ShapeScanner](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classTopOpeBRep__ShapeScanner.html) · [ShapeIntersector2d](https://dev.opencascade.org/doc/dev/refman/html/class_top_ope_b_rep___shape_intersector2d.html)
- BRepCheck: [BRepCheck_Analyzer 8.0](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_b_rep_check___analyzer.html) · [self-intersection gap](https://dev.opencascade.org/content/fix-self-intersection-shell) · [BRepCheck status enums](https://secure.diyhpl.us/cgit/oce/plain/src/BRepCheck/BRepCheck.cdl)
- Offset/de-fillet: [BRepOffsetAPI_MakeOffsetShape](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classBRepOffsetAPI__MakeOffsetShape.html#details) · [OCCT offset/thickness deep-dive](https://deepwiki.com/Open-Cascade-SAS/OCCT/3.2.2-offset-and-thickness-operations)
- Shared-face vs parent-solid orientation: [OCCT forum](https://dev.opencascade.org/content/determine-orientation-shared-face-respect-its-parent-solids)
- OCP vs pythonOCC: [StackOverflow (pywrap/clang vs PythonOCC)](https://stackoverflow.com/revisions/09f3a850-4da1-468c-be8f-b9ef7955f876/view-source) · [FOSDEM 2021 CadQuery slides](https://archive.fosdem.org/2021/schedule/event/cadquery/attachments/slides/4437/export/events/attachments/cadquery/slides/4437/FOSDEM2021_SLIDES.pdf)
- Community fillet detection: [build123d fillet-edge detection via BRep_Tool + DynamicType](https://global.php.cn/zh-tw/faq/1797030011.html)
