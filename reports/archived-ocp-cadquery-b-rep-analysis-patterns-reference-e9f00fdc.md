---
{
  "format": 1,
  "metadata": {
    "id": "archived-ocp-cadquery-b-rep-analysis-patterns-reference-e9f00fdc",
    "title": "OCP & CadQuery B-Rep Analysis Patterns — Reference",
    "question": "What findings, alternatives and limitations does the historical investigation document about OCP & CadQuery B-Rep Analysis Patterns — Reference?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: OCP & CadQuery B-Rep Analysis Patterns — Reference. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of OCP & CadQuery B-Rep Analysis Patterns — Reference; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:41.657Z"
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
  "sourceDigest": "e9f00fdc86e059ced752c8233dafbc84580ffe1c505c84e9e8d090651a84b280",
  "proposalRevision": "25b7ffd582574290a6dbed557133b55797d65d5aa33b4f06b50ceb6d709d7339"
}
---
# OCP & CadQuery B-Rep Analysis Patterns — Reference

**Reference compiled 2026-08-06** — deep research (web + empirical verification against the
installed `cadquery-ocp 7.8.1.1.post1` / OCCT 7.8.1 and `cadquery 2.7.0` in this Python 3.12
workspace) on the low-level OCP/CadQuery API patterns underpinning the `cad_reverse`
deterministic STEP→CadQuery pipeline. Covers face classification, edge convexity, face
normals, topology maps, BRepGProp mass properties, geometry comparison, binding gotchas,
performance, and community recognition libraries.

> Scope: OCP is auto-generated **pybind11** bindings (`pywrap` codegen) to OpenCascade. API
> names differ from C++ and from **pythonOCC** (a Swig codegen). Every pattern below that is
> marked "(verified)" was executed against the installed wheel. Version-specific issues are
> flagged inline.

---

## Key Takeaways (apply to `cad_reverse/`)

1. **Face classification is battle-tested and you already use it.** `BRepAdaptor_Surface(face).GetType()` returns a `GeomAbs_SurfaceType` enum; compare against `GeomAbs_Plane`, `GeomAbs_Cylinder`, etc. `GetType()` is an *instance* method (no `_s`). It is `GetType()`, not a `_s` static — and NOT a bare `BRep_Tool.Surface` (which returns the raw `Geom_*`, good for evaluation/projection, not classification). Warning: calling `.Plane()` on a cylinder face THROWS `Standard_NoSuchObject`, never returns None. Gate on `GetType()` first.

2. **Edge convexity: use `ChFi3d.DefineConnectType_s`, not a hand-rolled triple product.** OCCT's authoritative classifier returns `ChFiDS_Convex` / `ChFiDS_Concave` / `ChFiDS_Tangential`. Gate on `int(BRep_Tool.Continuity_s(e,f1,f2)) > int(GeomAbs_C0)` FIRST (that's the G1/tangential→smooth path). **Your existing `classify_edge_convexity` in `ocp_utils.py` has a real non-determinism bug** — the triple-product sign depends on `faces.First()` vs `faces.Last()` ordering from `MapShapesAndAncestors`, which makes no ordering guarantee (your `pocket_pad.py`/`fillet_chamfer.py` already documented this). Delegate to `DefineConnectType_s`, verified working.

3. **Outward face normal: `BRepGProp_Face.Normal(u,v,p,vn)` is the one orientation-aware method.** It honors the face's `TopAbs_FORWARD/REVERSED` flag and returns the true outward normal. Its output is **NOT unit-length** — always `.Normalized()`. `BRepLProp_SLProps.Normal()` returns the natural geometric normal and IGNORES orientation (flip manually); it returns a `gp_Dir` (unit). `Geom_*Surface.Normal()` is NOT bound in OCP. CadQuery's own `Face.normalAt()` uses `BRepGProp_Face.Normal`.

4. **`ShapeIdentityMap` does NOT exist in OCP.** It's `TopTools_IndexedMapOfShape` (TShape identity, ignoring orientation/location) or `TopTools_IndexedMapOfOrientedShape` (keys on orientation too). Indices are **1-based**; `FindIndex` returns **0 for not-found**. List iterators (`TopTools_ListIteratorOfListOfShape`) are NOT bound — use `First()/Last()/Extent()`. `MapShapesAndAncestors_s` **accumulates** into its output map (does NOT clear) — build a fresh map per call. Your `ShapeIdentityMap` in `ocp_utils.py` already does this correctly.

5. **Volume/area/centroid: pre-allocate a `GProp_GProps`, then `BRepGProp.VolumeProperties_s(shape, props)`; read `props.Mass()`/`props.CentreOfMass()`.** `_s` is mandatory (no instance form). For an OPEN shape, `VolumeProperties_s` silently returns volume 0.0 / centroid (0,0,0) with NO exception — guard by shape type + `abs(vol) > 0`. `LinearProperties_s` double-counts shared edges unless `SkipShared=True`.

6. **`BRepExtrema_DistShapeShape` is CONFIRMED useless for overlap comparison** — it returns the MINIMUM distance (0.0 for any overlapping/touching solids). Your `oracle.py` is correct to use **boolean-volume symmetric difference** `V(A−B)+V(B−A)` via `BRepAlgoAPI_Cut`/`Fuse`. Hausdorff is NOT available (`BRepExtrema_ShapeHausdorff` doesn't exist in OCCT 7.8); your `symdiff_extent` alternative is the right call. CadQuery has NO `symdiff()` in 2.7.0.

7. **`_s` static suffix rule:** statics-only helper classes expose ONLY the `_s` form (`BRepGProp`, `BRepBndLib`, `BRep_Tool`, `TopExp`); instantiable classes bind instance methods without `_s` (e.g. `BRepPrimAPI_MakeBox.Shape()`). The single biggest undocumented perf footgun: `MapShapesAndAncestors_s` ACCUMULATES into a caller map (verified 12→24 entries). Build a fresh map each call.

8. **Healing is NOT automatic.** CadQuery `val()`/STEP import performs **no** `ShapeFix`/`ShapeUpgrade_UnifySameDomain`. Your `heal.py` heal-on-import is the correct discipline. `Shape.fix()`/`Shape.clean()` are opt-in.

9. **No turnkey Python rule-based feature recognizer exists for OCP** — you build it. Best reusable assets: pythonOCC `OCC.Extend.TopologyUtils` (drop-in template for the adjacency map + `WireExplorer`), Analysis Situs `asiAlgo_AAG` (the architectural blueprint — single-arc AAG with dihedral-angle attributes), OCCT `ShapeAnalysis_FreeBoundsProperties` (free hole-vs-outer-contour discriminator). build123d adds no recognizers.

---

## 1. Face Classification (BRepAdaptor_Surface / GeomAbs_SurfaceType)

### 1.1 The canonical pattern (verified OCP 7.8.1.1)

`BRepAdaptor_Surface(face)` adapts a `TopoDS_Face` into a uniform surface API + `.GetType()`.
For a `cadquery.Face`, pass `.wrapped`; for a raw `TopoDS_Shape`, `topods_Face()`-cast first.

```python
import cadquery as cq
from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.GeomAbs import (GeomAbs_Plane, GeomAbs_Cylinder, GeomAbs_Cone,
                         GeomAbs_Sphere, GeomAbs_Torus)

box = cq.Workplane("XY").box(20, 20, 10).val()
for f in box.Faces():
    sf = BRepAdaptor_Surface(f.wrapped, True)   # True = restrict to face UV bounds
    t = sf.GetType()                            # instance method → GeomAbs_SurfaceType
    if t == GeomAbs_Plane:
        loc = sf.Plane().Location()             # safe: proved plane first
    elif t == GeomAbs_Cylinder:
        r = sf.Cylinder().Radius()
```

- `GetType()` returns `GeomAbs_SurfaceType.GeomAbs_Plane` (repr `<...: 0>`). `== GeomAbs_Plane` and `== GeomAbs_SurfaceType.GeomAbs_Plane` both work.
- `GeomAbs_*` is a custom enum class (OCP ≥7.7), not a plain int, but equality and `int()`/`.value`/`hash()` are flexible. `cadquery` keys a dict by the enum members directly (`shape_protocols.py`).
- Enum numeric ordering is stable across OCCT: Plane=0, Cylinder=1, Cone=2, Sphere=3, Torus=4, BezierSurface=5, BSplineSurface=6, ... OffsetSurface=9, OtherSurface=10.

### 1.2 Workable OCP import paths

| What | OCP import |
|------|-----------|
| Surface adaptor | `from OCP.BRepAdaptor import BRepAdaptor_Surface` |
| Curve adaptor | `from OCP.BRepAdaptor import BRepAdaptor_Curve` |
| Surface-type enum members | `from OCP.GeomAbs import GeomAbs_Plane, GeomAbs_Cylinder, ...` |
| Surface-type enum class | `from OCP.GeomAbs import GeomAbs_SurfaceType` |
| Raw geometry of a face | `from OCP.BRep import BRep_Tool` → `BRep_Tool.Surface_s(face)` |
| UV bounds | `from OCP.BRepTools import BRepTools` → `BRepTools.UVBounds_s(face)` |
| Face normals | `from OCP.BRepGProp import BRepGProp_Face` |

> **Gotcha:** `BRep_Tool` lives at `OCP.BRep.BRep_Tool`, NOT `OCP.BRep_Tool` (`ModuleNotFoundError`).

### 1.3 `BRep_Tool.Surface_s` vs `BRepAdaptor_Surface` (CadQuery's own split)

- **`BRep_Tool.Surface_s(face)`** → the raw `Geom_*` object (`Geom_Plane`, `Geom_CylindricalSurface`). Use for **geometry evaluation**: projection (`GeomAPI_ProjectPointOnSurf`), UV bounds. CadQuery: `Face._geomAdaptor()` → `BRep_Tool.Surface_s(self.wrapped)`.
- **`BRepAdaptor_Surface(face)`** → uniform adaptor + `GetType()` + family accessors (`Cylinder().Radius()`, `Plane().Axis().Direction()`). Use for **classification** and parameter extraction. CadQuery: `Face.geomType()` → `geom_LUT_FACE[tr(self.wrapped).GetType()]`.

### 1.4 Gotchas

- **Naming trap:** the raw surface class for a cylinder is `Geom_CylindricalSurface`, while the adaptor enum is `GeomAbs_Cylinder`. `IsKind('Geom_Cylinder')` is False; `IsKind('Geom_CylindricalSurface')` is True. Don't mix namespaces.
- **Wrong accessor throws:** `.Plane()` on a cylinder face → `Standard_NoSuchObject: GeomAdaptor_Surface::Plane`.
- **`Initialize()` / no-arg ctor:** `BRepAdaptor_Surface()` is undefined; must `Initialize(face, True)` before `GetType()`.
- **Must pass a `TopoDS_Face`:** feeding a `TopoDS_Shape`/`TopoDS_Solid` raises `Standard_TypeMismatch TopoDS::Face`.
- **`DynamicType()` is unreliable** for subtype detection — [OCP issue #122](https://github.com/CadQuery/OCP/issues/122). Branch on `GetType()`, not on `DynamicType().IsInstance(...)`.
- **Topological vs geometric caveat:** OCCT has no topological face-type. A cylinder split into periodic faces still reads `GeomAbs_Cylinder`. "Flat vs cylindrical in the NX sense" must be built from wires/edges (loop count, seam/degenerate edges).

Sources:
- [OCCT BRepAdaptor_Surface refman (8.0)](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_b_rep_adaptor___surface.html)
- [pythonocc-demos core_geometry_recognize_feature.py](https://github.com/tpaviot/pythonocc-demos/blob/master/examples/core_geometry_recognize_feature.py)
- [pythonocc-core Issue #1102 (TopoDS::Face TypeMismatch)](https://github.com/tpaviot/pythonocc-core/issues/1102)
- [AnalysisSitus forum: face-type topology](https://analysissitus.org/forum/index.php?threads/how-does-occt-query-the-topology-type-of-the-face.380/)
- [SO: Classifying TopoDS_Face](https://stackoverflow.com/questions/55571103/classifying-topods-face-face/55571525)

---

## 2. Edge Convexity Detection (convex vs concave vs smooth)

### 2.1 The authoritative OCCT classifier: `ChFi3d.DefineConnectType`

OCCT's own feature-recognition chain (`BRepOffset_Analyse::EdgeAnalyse`) does:

```
if (BRep_Tool::Continuity(E,F1,F2) > GeomAbs_C0)  → ChFiDS_Tangential  (smooth/skip)
else                                             → ChFi3d::DefineConnectType(E,F1,F2,SinTol,false)
```

Core math of `DefineConnectType` (paraphrased): get the edge tangent (normalized) mid-edge; orient it along F1's forward boundary (`OriEdgeInFace`); correct for F1's orientation; compute outward normals `N1`, `N2` (flipping for `REVERSED`); `ProVec = N1 × N2`; if `|ProVec| < SinTol` → tangential/convex by `N1·N2` sign, else return `(t·ProVec > 0) ? Convex : Concave`.

### 2.2 OCP implementation (verified working)

```python
from OCP.BRep import BRep_Tool
from OCP.TopExp import TopExp
from OCP.TopAbs import TopAbs_EDGE, TopAbs_FACE
from OCP.TopoDS import TopoDS
from OCP.TopTools import TopTools_IndexedDataMapOfShapeListOfShape
from OCP.ChFi3d import ChFi3d
from OCP.GeomAbs import GeomAbs_C0

def edge_convexity(shape, tol=1e-6):
    m = TopTools_IndexedDataMapOfShapeListOfShape()
    TopExp.MapShapesAndAncestors_s(shape, TopAbs_EDGE, TopAbs_FACE, m)
    out = {}
    for i in range(1, m.Extent() + 1):          # 1-based
        e  = TopoDS.Edge_s(m.FindKey(i))
        faces = m.FindFromIndex(i)
        if faces.Extent() != 2:                 # free / non-manifold edge
            out[i] = 'skip'; continue
        f1, f2 = TopoDS.Face_s(faces.First()), TopoDS.Face_s(faces.Last())
        # G1/tangential gate FIRST
        if int(BRep_Tool.Continuity_s(e, f1, f2)) > int(GeomAbs_C0):
            out[i] = 'smooth'; continue
        ty = ChFi3d.DefineConnectType_s(e, f1, f2, tol, True)
        out[i] = ty.name                        # ChFiDS_Convex / ChFiDS_Concave / ...
    return out
```

**Recommendation for the repo:** replace the bare triple-product sign in `classify_edge_convexity` (`ocp_utils.py` ~line 265) with `ChFi3d.DefineConnectType_s(e,f1,f2,1e-6,True)` gated by the `Continuity > C0` check. This resolves the documented non-determinism (face-order-dependent sign). Keep the `aag.py` blend-mask layered on top to separate true fillets from concave walls.

### 2.3 Face normals / edge tangents (3 options for building blocks)

```python
# (A) BRepGProp_Face — OUTWARD unit normal (orientation-aware).
from OCP.BRepGProp import BRepGProp_Face
from OCP.gp import gp_Pnt, gp_Vec
p, vn = gp_Pnt(), gp_Vec()
BRepGProp_Face(face).Normal(u, v, p, vn)     # output NOT unit → vn.Normalized()

# (B) BRepLProp_SLProps — natural geometric normal (gp_Dir, unit).
from OCP.BRepLProp import BRepLProp_SLProps
from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.TopAbs import TopAbs_REVERSED
n = BRepLProp_SLProps(BRepAdaptor_Surface(face), u, v, 2, 1e-7).Normal()
if face.Orientation() == TopAbs_REVERSED:
    n.Reverse()                               # IGNORES orientation — flip manually

# edge tangent mid-edge
from OCP.BRepAdaptor import BRepAdaptor_Curve
c = BRepAdaptor_Curve(edge); p, t = gp_Pnt(), gp_Vec()
u_mid = 0.5 * (c.FirstParameter() + c.LastParameter())
c.D1(u_mid, p, t)
```

- To get (u,v) from a 3D point: `ShapeAnalysis_Surface(geom).ValueOfUV(pnt_3d, tol)` — more robust near boundaries than `GeomAPI_ProjectPointOnSurface`.
- **`BRepLProp_CurAndInf` and `BRepGProp_Curve` do NOT exist in OCP 7.8** (verified) — only `BRepLProp_CurveTool`. Use `BRepAdaptor_Curve.D1()`.

### 2.4 Failure modes

1. **Degenerate normals** — cone apex, sphere poles, torus inner equator where `du×dv ≈ 0`. Detect/skip (`BOPTools_AlgoTools3D.GetNormalToSurface` returns False when U/V derivative directions coincide) or offset the sample.
2. **Seam edges / periodic surfaces** — cylinder/sphere/torus seam gives discontinuous tangent or through-material normal flips. Detect `BRep_Tool.IsClosed(E)` and resample off the wrap.
3. **Non-manifold edges** — shared by >2 faces; reject via `faces.Extent() != 2`.
4. **Variable-radius/conical fillets** — dihedral angle varies; sample at multiple params, use the extremum not the mean.
5. **Tangential (G1) continuity edges** — parallel normals → triple product ≈ 0. THE classic false-positive. Gate on `Continuity > C0` or `abs(n1·n2) ≈ 1`.
6. **Non-deterministic face order** — flips triple-product sign. Use `DefineConnectType_s` (order-robust) or mirror OCCT's `OriEdgeInFace` discipline.
7. **Smooth edges are NOT all fillets** — a concave pocket wall and a fillet can both read G1. Your `aag.py` blend-mask + arc/cap logic disambiguates. Keep it layered on top of the dihedral test.

### 2.5 Academic basis

- **Joshi & Chang 1988** — AAG where the arc attribute IS edge convexity/concavity. `doi:10.1016/0010-4485(88)90050-4`.
- **Cuillière & Maranzana 1999** — "material angle" method: `θ = 2π − arccos((V1·V2)/|V1||V2|)`; `θ=π ⇒ smooth`. `doi:10.1016/S0965-9978(99)00013-7`. Implemented by Analysis Situs.
- **Analysis Situs** `asiAlgo_CheckDihedralAngle.cpp` — same dihedral/normal method.

Sources:
- [OCCT ChFi3d Doxygen](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classChFi3d.html)
- [OCCT source ChFi3d.cxx](https://raw.githubusercontent.com/Open-Cascade-SAS/OCCT/master/src/ModelingAlgorithms/TKFillet/ChFi3d/ChFi3d.cxx)
- [BRepOffset_Analyse](https://dev.opencascade.org/doc/refman/html/class_b_rep_offset___analyse.html)
- [OCC forum: dihedral angle of adjoining faces](https://dev.opencascade.org/content/how-get-dihedral-angle-adjoin-faces)
- [Analysis Situs asiAlgo_CheckDihedralAngle.cpp](https://github.com/sasobadovinac/AnalysisSitus/blob/master/src/asiAlgo/features/asiAlgo_CheckDihedralAngle.cpp)

---

## 3. Face Normal Computation (reliable methods)

### 3.1 Empirically verified orientation behavior (OCP 7.8.1.1)

On a box's `+Z` face vs a copy forced to `TopAbs_REVERSED`:

| Method | FORWARD face | REVERSED face | Honors orientation? |
|--------|-------------|---------------|---------------------|
| `BRepGProp_Face.Normal` | `+Z (0,0,1)` | `-Z (0,0,-1)` | **YES — outward** |
| `BRepLProp_SLProps.Normal` | `+Z (0,0,1)` | `+Z (0,0,1)` | **NO — natural** |

**Use `BRepGProp_Face.Normal`.** For feature recognition (deciding boss vs pocket, hole-wall vs shaft) you want the outward normal — interior faces (hole walls, pockets) arrive `REVERSED`. `BRepGProp_Face.Normal` handles this automatically. `BRepLProp_SLProps` needs an explicit `face.Orientation() == TopAbs_REVERSED → n.Reverse()`.

### 3.2 Critical gotchas

- **`BRepGProp_Face.Normal` output is NOT unit-length** — it returns the integration normal `dP/du × dP/dv` (magnitude = parametric area element; measured 2.0 on a radius-2 cylinder). **Always `.Normalized()`.** CadQuery normalizes (`Vector(vn).normalized()`).
- **`NormalToSurface` / `PNormal` are NOT bound** — only `Normal(U,V,P,VNor)`.
- **`Geom_Plane/CylindricalSurface.Normal()` not bound** — only `Axis()`/`Position()`. The C++ `BRep_Tool::Surface` + downcast + `.Normal()` path does NOT port to OCP Python.
- **Reference(out) params pre-allocated:** `BRepGProp_Face.Normal` returns None; pass fresh `gp_Pnt()`, `gp_Vec()` and read them after.
- **`BRepLProp_SLProps` wraps a `BRepAdaptor_Surface`, which ignores orientation** (OCCT moderator Dmitrii Pasukhin). It is a `gp_Dir` (unit) but geometric. Guard with `IsNormalDefined()` at degenerate points.
- **Un-oriented/open shells:** neither method yields a meaningful outward normal without a solid defining inside/outside. Heal/sew first.
- **IGES mesh-only faces** can return zero normal via `BRepGProp_Face` — check the vector is nonzero.

### 3.3 Recommended helper

```python
from OCP.BRepGProp import BRepGProp_Face
from OCP.gp import gp_Pnt, gp_Vec

def outward_normal(face, u, v):
    p, vn = gp_Pnt(), gp_Vec()
    BRepGProp_Face(face).Normal(u, v, p, vn)
    return vn.Normalized()
```

`cadquery/occ_impl/shapes.py` `Face.normalAt()` does exactly this (`BRepGProp_Face(self.wrapped).Normal(u, v, p, vn); return Vector(vn).normalized()`) — the strongest real-world endorsement.

Sources:
- [OCCT BRepGProp_Face refman](https://dev.opencascade.org/doc/occt-8.0.0/refman/html/class_b_rep_g_prop___face.html)
- [OCC forum: correct face normal calculation](https://dev.opencascade.org/content/correct-face-normal-calculation)
- [OCC forum: extract correctly oriented normal](https://dev.opencascade.org/content/how-extract-correctly-oriented-normal-face-one-point-geomlpropslprops-topodsiterator)
- [CadQuery source](https://github.com/CadQuery/cadquery) `occ_impl/shapes.py`

---

## 4. Topology Maps / Identity (`TopTools` / `TopExp`)

### 4.1 `ShapeIdentityMap` does NOT exist in OCP

Scanned all 300+ OCP 7.8.1 packages: **zero** classes named `ShapeIdentityMap` or `TShapeIdentityMap`. What exists:

| Container | Keys on | Use when |
|-----------|---------|----------|
| `TopTools_IndexedMapOfShape` | TShape identity (ignores orientation + location) | Distinct logical faces/edges; stable keys for a part's own topology (your `ShapeIdentityMap`, `ocp_utils.py:137`) |
| `TopTools_IndexedMapOfOrientedShape` | TShape + orientation | FORWARD-vs-REVERSED is load-bearing (which side of a shared edge touches which face) |
| `TopTools_MapOfShape` | unordered membership | `Contains()` tests only |

### 4.2 Usage (verified)

```python
from OCP.TopTools import TopTools_IndexedMapOfShape, TopTools_IndexedDataMapOfShapeListOfShape
from OCP.TopExp import TopExp
from OCP.TopAbs import TopAbs_ShapeEnum, TopAbs_EDGE, TopAbs_FACE
from OCP.TopoDS import TopoDS

amap = TopTools_IndexedMapOfShape()
TopExp.MapShapes_s(shp, TopAbs_ShapeEnum.TopAbs_FACE, amap)   # _s!
n = amap.Extent(); f = amap.FindKey(1); idx = amap.FindIndex(f)  # all 1-based

# edge → faces (the AAG ground truth)
emap = TopTools_IndexedDataMapOfShapeListOfShape()
TopExp.MapShapesAndAncestors_s(shp, TopAbs_EDGE, TopAbs_FACE, emap)
for i in range(1, emap.Extent() + 1):
    e = emap.FindKey(i); fl = emap.FindFromIndex(i)
    f1 = TopoDS.Face_s(fl.First()); f2 = TopoDS.Face_s(fl.Last())
```

- **1-based**, `FindIndex` returns **0 for not-found** (your `aag.py:240` `if fk1 == 0` is correct). Off-by-one bugs come from iterating `range(Extent())` instead of `range(1, Extent()+1)`.
- **Iterators NOT bound.** `TopTools_ListIteratorOfListOfShape` → `ImportError` ([OCP issue #15](https://github.com/CadQuery/OCP/issues/15)). `TopExp_Explorer` is not `__iter__`-able — drive `while ex.More(): ...; ex.Next()`. `ListOfShape` exposes only `First()/Last()/Extent()/Append()/Prepend()`.
- **`MapShapesAndAncestors_s` does NOT clear its output map** — build a fresh map per call (verified 12→24 accumulation).
- **Named accessors on IndexedDataMap:** value accessors are `FindFromIndex`/`FindFromKey` (NOT `FindIndex`/`FindKey`, which deal with key↔index only). `ChangeFindKey`/`ChangeElement` (old docs) do NOT exist — use `ChangeFromKey`/`ChangeFromIndex`/`ChangeSeek`.

### 4.3 Identity correctness — stock/pocket shared-face case

`TopoDS_Shape` = TShape (geometry/topology) + Location + Orientation. `TopTools_IndexedMapOfShape` keys on the **TShape**, ignoring Location/Orientation. Verified:
- `amap.Add(face.Reversed())` → plain map extent unchanged (same TShape); oriented map extent +1.
- **Independently-built solids have different TShapes even if geometrically coincident** → map to different ints. Match across solids by **surface type + centroid + bbox", not by map identity. Your `aag.py` does this (min(fk1,fk2) keys + surface type/area/bbox on the node).

Sources:
- [OCP issue #15 (ListIterator missing)](https://github.com/CadQuery/OCP/issues/15)
- Local ground truth: `ocp_utils.py`, `aag.py` in this repo.

---

## 5. BRepGProp Volume / Area / Centroid

### 5.1 The pattern (verified OCP 7.8.1.1)

```python
from OCP.BRepGProp import BRepGProp
from OCP.GProp import GProp_GProps
from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox
from OCP.gp import gp_Pnt

shape = BRepPrimAPI_MakeBox(gp_Pnt(0,0,0), 100.0, 60.0, 20.0).Shape()

props = GProp_GProps()                       # MUST pre-allocate, passed by ref
BRepGProp.VolumeProperties_s(shape, props)   # _s is mandatory
vol  = props.Mass()                          # 120000 (density=1)
cog  = props.CentreOfMass()                  # gp_Pnt (50,30,10)
cx,cy,cz = cog.X(), cog.Y(), cog.Z()
moments = props.StaticMoments()              # 3-tuple (not gp_XYZ)
mi      = props.MatrixOfInertia()            # gp_Mat; mi.Value(i,j) 1-indexed
pp      = props.PrincipalProperties(); I1,I2,I3 = pp.Moments()  # 3-tuple

sp = GProp_GProps(); BRepGProp.SurfaceProperties_s(shape, sp); area = sp.Mass()  # 18400
lp = GProp_GProps(); BRepGProp.LinearProperties_s(shape, lp, True)  # SkipShared=True
```

### 5.2 Signatures (verified from the 7.8.1.1 binding docstring)

- `VolumeProperties_s` overload 1: `(S, VProps, OnlyClosed=False, SkipShared=False, UseTriangulation=False) -> None`. **No `bySampling`/`useEpsilon` bool in this version.**
- Overload 2 (adaptive Gauss): `(S, VProps, Eps:float, OnlyClosed=False, SkipShared=False) -> float` — returns relative error (measured `1.7e-16` for `Eps=1e-7`).
- `VolumePropertiesGK_s` (Gauss-Kronrod, span-aware): `(S, VProps, Eps=0.001, OnlyClosed=False, IsUseSpan=False, CGFlag=False, IFlag=False, SkipShared=False) -> float`, returns **negative on failure** — the reliable failure detector.
- *Older OCP (pre-7.6) had `UseTriangulation` in a different argument position* — code written against old signatures breaks silently on upgrade.

### 5.3 Pitfalls (empirically confirmed)

1. **OPEN/shape-not-closed → silent volume 0.0 and centroid (0,0,0), NO exception.** Guard by shape type (must be SOLID/SHELL) and `abs(vol) > 0` before trusting a centroid.
2. **`LinearProperties_s` double-counts shared edges** by default: 1440 vs 720 for a 12-edge box. Use `SkipShared=True`.
3. **Self-intersecting / non-manifold / un-sewn shapes** → garbage volume with no error. Use `VolumePropertiesGK_s` negative-return to detect.
4. **`MassProperties` / `ShapeProperties` not present**; `GProp_Mass` / `GProp_CenterMassX/Y/Z` are un-callable pybind type shims (a pythonOCC-ism that doesn't port).
5. **pythonOCC vs OCP calling convention differ:** pythonOCC exposes free functions `brepgprop_VolumeProperties(shape, props)`; OCP uses the `_s` static. Port pythonOCC snippets accordingly.
6. **Performance:** exact integrators degrade on many-face shapes. CadQuery dispatches per type via `shape_properties_LUT` (EDGE/WIRE→Linear, FACE/SHELL→Surface, SOLID/COMPOUND→Volume). For big assemblies, iterate per-solid/face rather than one global integration; `SkipShared=True` and `UseTriangulation=False` help.

CadQuery equivalents: `Shape.Volume()`, `Shape.Area()`, `Shape.Center()` (→ centerOfMass, NOT bounding-box center — that's `CenterOfBoundBox()`).

Sources:
- [OCCT BRepGProp refman](https://dev.opencascade.org/doc/occt-6.9.1/refman/html/class_b_rep_g_prop.html)
- [pythonocc-demos core_shape_properties.py](https://raw.githubusercontent.com/tpaviot/pythonocc-demos/master/examples/core_shape_properties.py)

---

## 6. Geometry Comparison (`BRepExtrema` vs booleans)

### 6.1 CONFIRMED: `BRepExtrema_DistShapeShape` returns MINIMUM distance (useless for overlap)

Verified: identical → 0.0, partially-overlapping → 0.0, touching faces → 0.0; only disjoint → real gap (10.0 for a gap of 10). It computes `min over all points ‖p1−p2‖`; overlapping point clouds → 0. **Do not use it as a reconstruction-fidelity gate.**

Correct OCP usage (for the disjoint case, e.g. clearance checks):

```python
from OCP.BRepExtrema import BRepExtrema_DistShapeShape
calc = BRepExtrema_DistShapeShape(shape1, shape2)
calc.SetMultiThread(True)
if calc.IsDone():
    d  = calc.Value()              # minimum distance
    n  = calc.NbSolution()         # NOT NbExtrema
    p1 = calc.PointOnShape1(1)     # gp_Pnt, 1-based; NOT EquiPointOnShape1
```

Gotchas: method is `NbSolution()` (NOT `NbExtrema()`); `EquiPointOnShape1` does NOT exist in OCP 7.8 — it's `PointOnShape1(n)`; indices 1-based (0 raises `Standard_OutOfRange`); gate every `.Value()` on `IsDone()`; `ParOnFaceS1` throws on non-face supports.

### 6.2 The correct gate: boolean-volume symmetric difference (what your `oracle.py` does)

```
V(A△B) = V(A−B) + V(B−A) = V(A∪B) − V(A∩B)
```

```python
cut_ab = BRepAlgoAPI_Cut(a, b); cut_ab.Build(); assert cut_ab.IsDone()
cut_ba = BRepAlgoAPI_Cut(b, a); cut_ba.Build(); assert cut_ba.IsDone()
fuse   = BRepAlgoAPI_Fuse(cut_ab.Shape(), cut_ba.Shape()); fuse.Build()
v_diff = volume(fuse.Shape()); v_orig = volume(a); return v_diff / v_orig
```

Verified: two 10³ boxes overlapping 50% → V(A−B)=V(B−A)=500, sum=1000, ratio=1.0. 0 = identical. Symmetric, robust for extrusion B-Reps.

### 6.3 Hausdorff is NOT available

- `BRepExtrema_ShapeHausdorff` does NOT exist in OCCT 7.8/OCP 7.8.1.
- `BRepExtrema_ShapeProximity` IS bound but is NOT a distance metric: requires pre-meshing, returns a layer-thickness/tolerance `ratio` (verosed 0–1), returned not-done on well-separated solids. **Your `symdiff_extent` (bbox diagonal of the difference solid) is the right secondary metric.**

### 6.4 Pitfalls

- **CadQuery has NO `Shape.symdiff()`/`compare()` in 2.7.0** (booleans are `fuse`/`cut`/`intersect` only; `.distance()` uses `BRepExtrema` and returns 0 for overlap; `compare()` is a build123d method). Your raw-OCCT `oracle.py` correctly bypasses CadQuery.
- **Coplanar/tangential faces** are the classic boolean failure — modern OCCT handled axis-aligned coplanar faces cleanly, but coincident *curved* surfaces / tangency can fail. Mitigate with `SetFuzzyValue(tol)` / CadQuery `tol=`.
- **`IsDone()` does not guarantee topological validity** — belt-and-suspenders with `BRepCheck_Analyzer(result).IsValid()`.
- **Heal both shapes** (`ShapeUpgrade_UnifySameDomain`) before booleans.
- Gate holds at `symdiff_ratio < 0.001` (0.1%) — your CONVERGED threshold.

Sources:
- [OCCT refman BRepExtrema_DistShapeShape](https://dev.opencascade.org/doc/refman/html/class_b_rep_extrema___dist_shape_shape.html)
- [OCCT refman BRepExtrema_ShapeProximity](https://dev.opencascade.org/doc/refman/html/class_b_rep_extrema___shape_proximity.html)

---

## 7. OCP Binding Gotchas & Undocumented Behaviors

1. **`_s` static suffix.** Statics-only helper classes expose ONLY the `_s` form (`BRepGProp`, `BRepBndLib`, `BRep_Tool`, `TopExp`, `GCPnts_AbscissaPoint`). Instance-capable classes bind natural methods without `_s` (`BRepPrimAPI_MakeBox.Shape()`). Forgetting `_s` → `AttributeError: 'BRepGProp' object has no attribute 'VolumeProperties'`. **Introspect with `dir()` to know.**
2. **Output/reference params need pre-allocated objects**, mutated in place (return None): `GProp_GProps`, `gp_Pnt`/`gp_Vec` out-params, `Bnd_Box`. A few special ones return tuples (`ShapeAnalysis_Surface.ValueOfUV` → `(done, gp_Pnt)`). Check the stub; mixed expectations cause silent garbage geometry.
3. **Default-arg position changed across OCP versions** (e.g. `UseTriangulation` in older `VolumeProperties_s`), so code breaks silently on upgrade.
4. **Enums** are pybind `py::enum_` members: `int(TopAbs_FACE)==4`; compare members directly (`face.Orientation() == TopAbs_REVERSED`). Don't pass raw ints where enums expected (strict conversion raises `TypeError` in newer pybind11).
5. **Downcast mismatches raise `Standard_TypeMismatch TopoDS::Face`** at the C++ layer (not `TypeError`/None). Guard with `shape.ShapeType() == TopAbs_FACE` first.
6. **`TopoDS_Shape` values share the underlying TShape** — copying/downcasting is O(1), cheap. Iterate `MapShapesAndAncestors` while the source shape is in scope (don't Nullify source then read children).
7. **`DynamicType()` unreliable** — prefer `BRepAdaptor::GetType()` ([issue #122](https://github.com/CadQuery/OCP/issues/122)).
8. **Missing/renamed bindings:** `TopTools_ListIteratorOfListShape` ([#15](https://github.com/CadQuery/OCP/issues/15)), `FindFromIndex/FindFromKey` naming, `GProp_Mass`/`CenterMassX/Y/Z` shims, `BRepLProp_CurAndInf`/`BRepGProp_Curve` absent, `NormalToSurface` absent, `Geom_*Surface.Normal` absent.
9. **ABI/compiler mismatch** breaks native C++ embedding of OCP objects (`py::cast` `cast_error`, [issue #127](https://github.com/CadQuery/OCP/issues/127)) — pure-Python OCP avoids it entirely.
10. **Map containers accumulate results** — `MapShapesAndAncestors_s` does not clear its output (verified 12→24). `Bnd_Box`/`BRepBndLib.Add_s` accumulate by design (union — desired for bbox).

Sources: [OCP issue #15](https://github.com/CadQuery/OCP/issues/15), [#122](https://github.com/CadQuery/OCP/issues/122), [#127](https://github.com/CadQuery/OCP/issues/127).

---

## 8. CadQuery ↔ OCP Integration

### 8.1 `.wrapped` and `Shape.cast`

- Every `cq.Shape` stores its raw `TopoDS_*` in `.wrapped`, already **downcast** to the concrete type (`shapes.py:430`, `downcast()` → `TopoDS.Face_s`/`Edge_s`/etc.). `cq.Solid.wrapped` is `TopoDS_Solid`, `cq.Edge.wrapped` is `TopoDS_Edge`, etc. Null shape raises `ValueError` in `shapetype()` — check `shape.isNull()` first.
- **Reverse bridge:** `cq.Shape.cast(topods)` returns the correct subclass automatically (via `constructor_LUT`). CadQuery's STEP importer uses it: `Shape.cast(reader.Shape(i+1))`. If you already know the type, `cq.Edge(topods_edge)` is cheaper.

### 8.2 Iteration conventions

- **Capitalized `Shape.Faces()/.Edges()/.Vertices()`** are methods on ANY `cq.Shape`; each calls `TopExp.MapShapes_s` into a `TopTools_IndexedMapOfShape` and returns a Python `List[cq.X]`. `Edges()` additionally filters degenerates (`BRep_Tool.Degenerated_s`).
- **`_entitiesFrom(child, parent)`** uses `TopExp.MapShapesAndAncestors_s` — the adjacency primitive underneath AAG construction.
- **Lowercase `.faces()/.edges()/.vertices()`** on a `Workplane`/CQ object are selectors → return a filtered `Compound`/single shape. `.val()` is a `Workplane`/`ShapeList` method (`cq.py:410`), NOT a `Shape` method.
- **`occ_utils.py` is REMOVED in CadQuery 2.7.0** (folded into `occ_impl/geom.py`, `occ_impl/shapes.py`, `occ_impl/assembly.py`). Older cadquery ≤2.4 had it at `cadquery/occ_impl/utils.py`.

### 8.3 Health check

- **CadQuery importStep/importShape perform NO healing** — no `ShapeFix`/`ShapeUpgrade_UnifySameDomain`. Your `heal.py` heal-on-import is correct and mandatory for reliable AAG.
- `Shape.fix()` → `ShapeFix_Shape().Perform()`; `Shape.clean()` → `ShapeUpgrade_UnifySameDomain` + `AllowInternalEdges(False)` + `Build()`. Both opt-in.
- **Bridge errors:** passing a `cq.Shape` (not `.wrapped`) into an OCP function raises `TypeError` ([discussion #1446](https://github.com/CadQuery/cadquery/discussions/1446)).

Sources:
- [CadQuery discussion #1571 (OCP/C++ interop)](https://github.com/CadQuery/cadquery/discussions/1571)
- [CadQuery discussion #1446](https://github.com/CadQuery/cadquery/discussions/1446)
- [CadQuery DeepWiki: Shape & Workplane](https://deepwiki.com/CadQuery/cadquery/2.1-shape-and-workplane-system)
- Local: `cadquery/occ_impl/shapes.py`, `cadquery/cq.py` (verified).

---

## 9. Performance (B-Rep Traversal in Python/OCP)

1. **Fast (don't worry about it):** building/walking `TopExp_Explorer`, downcasting (`TopoDS.Face_s`), copying `TopoDS_Shape` (O(1) handles), reading indexed maps once.
2. **Slow — cache results:**
   - **Repeated `MapShapesAndAncestors_s`** — each is a full topological pass. Build ONE map for the whole shape, then use indexed lookups. The accumulator trap makes repeat calls doubly bad.
   - **`BRepGProp.VolumeProperties_s` / `SurfaceProperties_s`** — compute once per shape; don't re-run per feature.
   - **Repeated `BRepAdaptor_Surface/Curve` construction** — cache one adaptor per face/edge and reuse across classifications. `ocp_utils.build_adjacency_graph` already shares one adaptor across the two faces of a shared edge.
3. **Batch:** fill all maps you need in one pass (`MapShapesAndAncestors_s` for edge→face AND vertex→edge).
4. **Assemblies:** don't integrate global volume on a 1000-part compound — iterate sub-shapes once, compute per-solid/face, sum+cache. Get per-part data for free.
5. **Booleans (`BRepAlgoAPI`)** are among the slowest OCCT kernels (near-O(n²) as faces facet). Set fuzzy value when inputs have loose tolerances (`SetFuzzyValue`); `SetNonDestructive(True)` to skip history when unneeded; check `IsDone()`/`ErrorStatus()` before reading `.Shape()`.
6. **Meshing vs BRepGProp:** for exact area/volume/centroid use `BRepGProp` (deterministic, no mesh dependence). Mesh (`BRepMesh_IncrementalMesh(shape, lindeflection)`) only for triangles / display / faceted needs — mesh properties are approximate, never a correctness oracle.
7. **Caching keys:** use `TopTools_IndexedMapOfShape` (your `ShapeIdentityMap`), NOT `id(face)` (wrapper recycling) and NOT `TopoDS.HashCode()` (collisions — documented as a bug in your `ocp_utils.py:139`).
8. **CadQuery-specific:** `.Faces()/.Edges()/.Vertices()` return FRESH wrappers each call and selectors re-traverse. In a hot loop, capture `result.val().wrapped` once and operate with raw OCP (`reconstruct()` already does this). Minimize `.val()` calls (CSG re-parse).

---

## 10. Community Libraries & Utilities for Feature Recognition

**Honest bottom line: no turnkey deterministic rule-based feature recognizer on OCP/Python exists — you build it (which cad_reverse already does).** Reusable assets:

- **pythonOCC `OCC.Extend.TopologyUtils`** — `TopologyExplorer` (face/edge/vertex iteration, `faces_from_edge()`/`edges_from_face()` on `_map_shapes_and_ancestors`), `WireExplorer` (connected edge order over `BRepTools_WireExplorer`). Near copy-paste template for the AAG-construction half. [tpaviot/pythonocc-core](https://github.com/tpaviot/pythonocc-core) — note SWIG calling convention differs from OCP (free functions vs `_s` statics).
- **Analysis Situs** — the only open-sourced OCCT-coupled feature-recognition framework (C++/Tcl, no Python binding). Its **`asiAlgo_AAG`** is the architectural blueprint: single-arc AAG with **dihedral-angle attributes** (`asiAlgo_FeatureAngleType`: Concave/Convex/Smooth/SmoothConcave/SmoothConvex/NonManifold). Recognizers: `asiAlgo_RecognizeDrillHoles`, `asiAlgo_RecognizeVBF` (blends), `asiAlgo_RecognizeIsolated` (cavities/pockets/bosses). Your `aag.py` already mirrors the graph-construction half; the recognizer ascent above it is the porting target. [gitlab.com/ssv/AnalysisSitus](https://gitlab.com/ssv/AnalysisSitus) / [Github mirror](https://github.com/CadQuery/AnalysisSitus), [docs](https://analysissitus.org).
- **OCCT built-ins:**
  - `BRepCheck_Analyzer` is a **validity checker, NOT a feature recognizer**; docs warn it can misreport on split edges.
  - **`ShapeAnalysis_FreeBounds` / `ShapeAnalysis_FreeBoundsProperties`** — extract free-boundary wires, compute closed/open free bounds, area, perimeter and **notch detection** (`CheckNotches()`). This is a free, OCP-accessible **hole-vs-outer-contour discriminator** (largest-bbox closed wire = outer contour, rest = inner holes) — directly bolsters your hole/stock logic.
  - `ShapeUpgrade_UnifySameDomain`, `ShapeFix_Shape` — you already use in `heal.py`.
  - OCCT has NO native manufacturing-feature recognizer (STEP CAF stores metadata only).
- **build123d** — the Pythonic CadQuery fork; `.wrapped`, `Shape.cast`, `topology/topo_explore_*` helpers. **No recognizers, no `lattice` module** (verified). Adds nothing over CadQuery for recognition.
- **Palmetto** (connorkapoor/Palmetto) — web workbench vendoring Analysis Situs + OCCT 7.8 + FastAPI/pythonOCC. Proves the full rule-based recipe end-to-end, but the AAG engine is vendored C++.
- **AAGNet** (whjdark/AAGNet) — Python GNN on geometric-AAGs using pythonocc + **occwl** + PyTorch + DGL; semantic/instance segmentation on STEP datasets. Confirms the Python+OCP ML path; not deterministic.
- **FreeCAD** — exposes a SLICE of OCCT via SWIG with a custom `TopoShape` wrapper. `Part.__toPythonOCC__()`/`__fromPythonOCC__()` are the only directly reusable bridge pieces. Least clean route for a pure library.
- **cascadio** (trimesh) — STEP→GLB triangulation; only relevant if going triangulated (cad_reverse deliberately does not).
- Academic roots: Joshi & Chang 1988 (AAG), Ansaldi/Fiorini/Requicha (FAG 1985), Zhu & Meng, Han/Pratt survey.

Sources: see inline. Local files: `aag.py`, `ocp_utils.py`, `heal.py` in this repo.

---

## Appendix — Empirical Validation (this workspace)

All behaviors marked "(verified)" were executed against the installed `cadquery-ocp 7.8.1.1.post1` (OCCT 7.8.1) + `cadquery 2.7.0` under Python 3.12 in `/media/eldar/disk_2/Machine_concept/.venv`:

- Face classification via `BRepAdaptor_Surface.GetType()` on a box: plane faces read `GeomAbs_Plane`; `.Plane()` on a cylinder face threw.
- Edge convexity via `ChFi3d.DefineConnectType_s`: sharp box → 12×Convex; filleted box → 48×smooth(G1); pocketed box → 16 convex + 8 concave (inner pocket walls).
- Face normals: `BRepGProp_Face.Normal` honored `REVERSED`; `BRepLProp_SLProps.Normal` did not; magnitudes 2.0 (radius-2 cylinder) → need `.Normalized()`.
- Maps: 1-based, `FindIndex`=0 on miss, `MapShapesAndAncestors_s` accumulation 12→24 entries; `TopTools_ListIteratorOfListOfShape` `ImportError`.
- Mass properties: box volume 120000, centroid (50,30,10), `LinearProperties_s` 1440 vs 720 with `SkipShared=True`; OPEN shape → silent 0.0/0,0,0.
- `BRepExtrema_DistShapeShape`: identical/overlap/touching → 0.0; disjoint gap 10 → 10.0. Boolean-volume symdiff ratio for 50% overlap = 1.0.
- `TopExp_Explorer` not `__iter__`-able; `TopoDS.Face_s(solid)` raised `Standard_TypeMismatch TopoDS::Face`.
