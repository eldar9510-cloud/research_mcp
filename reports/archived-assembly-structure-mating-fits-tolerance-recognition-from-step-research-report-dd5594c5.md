---
{
  "format": 1,
  "metadata": {
    "id": "archived-assembly-structure-mating-fits-tolerance-recognition-from-step-research-report-dd5594c5",
    "title": "Assembly Structure, Mating, Fits & Tolerance Recognition from STEP — Research Report",
    "question": "What findings, alternatives and limitations does the historical investigation document about Assembly Structure, Mating, Fits & Tolerance Recognition from STEP — Research Report?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Assembly Structure, Mating, Fits & Tolerance Recognition from STEP — Research Report. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Assembly Structure, Mating, Fits & Tolerance Recognition from STEP — Research Report; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:44.433Z"
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
  "sourceDigest": "dd5594c5d92bff51ad07e7b6d46803a5f8912ea0580e69df89004a1c142ec46d",
  "proposalRevision": "3684b8dbcc475e2dd21f02fcf2608582c9c764f456db2e0ce0dd217e3cdf60e2"
}
---
# Assembly Structure, Mating, Fits & Tolerance Recognition from STEP — Research Report

**Date:** 2026-08-08
**Agent:** Research squad — assembly and tolerance recognition
**Status:** Complete

## Executive verdict

**Assembly traversal is FULLY feasible in cadquery-ocp 7.8.1.1 and was verified end-to-end.** The complete `XCAFDoc` stack (`XCAFDoc_ShapeTool`, `DimTolTool`, `ColorTool`, `MaterialTool`, `LayerTool`) is bound, all static `_s` methods work, and a real multi-part assembly STEP was read into a `TDocStd_Document` and the tree walked. Tolerance/GD&T *enumeration* works, but the *semantic value model* (`XCAFDimTolObjects_*`) is NOT wrapped. Everything remains deterministic and pure-Python (pure OCP).

---

## 1. STEP assembly structure (AP203/214/242)

Assemblies use a two-layer split: **product-structure layer** (occurrence tree) + **shape layer** (B-Rep/tessellation). Key entities:
- `PRODUCT` → `PRODUCT_DEFINITION` → `PRODUCT_DEFINITION_SHAPE` (PDS)
- `SHAPE_REPRESENTATION` linked by `SHAPE_DEFINITION_REPRESENTATION` (SDR) to PDS
- `NEXT_ASSEMBLY_USAGE_OCCURRENCE` (NAUO) — **tree edge**: `relating_product_definition` (parent) → `related_product_definition` (child), plus `reference_designator` and `RELATIVE_PLACEMENT`

**Edition differences:** AP203 = BREP + config mgmt (no PMI/color). AP214 = adds layer/color/GD&T. AP242 = unifies both + PMI + tessellated geometry. **None persist mating constraints** — only per-part placement transforms. Mating conditions must be recovered from geometry (inevitable, not a toolchain gap).

---

## 2. OCC assembly traversal — VERIFIED WORKING

```python
from OCP.TDocStd import TDocStd_Document
from OCP.TCollection import TCollection_ExtendedString
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.XCAFDoc import XCAFDoc_DocumentTool
from OCP.TDF import TDF_LabelSequence
from OCP.TopLoc import TopLoc_Location
from OCP.TDataStd import TDataStd_Name
from OCP.BRepGProp import BRepGProp
from OCP.GProp import GProp_GProps

doc = TDocStd_Document(TCollection_ExtendedString('asm'))
reader = STEPCAFControl_Reader()
reader.SetNameMode(True); reader.SetColorMode(True)
reader.ReadFile(path); reader.Transfer(doc)
st = XCAFDoc_DocumentTool.ShapeTool_s(doc.Main())

def walk(label, depth=0):
    isasm = st.IsAssembly_s(label)
    loc = st.GetLocation_s(label)          # returns TopLoc_Location directly
    if isasm:
        subs = TDF_LabelSequence()
        st.GetComponents_s(label, subs)    # OUT: TDF_LabelSequence of child labels
        for i in range(1, subs.Length()+1):
            walk(subs.Value(i), depth+1)
    else:
        shp = st.GetShape_s(label)
        props = GProp_GProps()
        BRepGProp.VolumeProperties_s(shp, props)

free = TDF_LabelSequence()
st.GetFreeShapes(free)
for i in range(1, free.Length()+1): walk(free.Value(i))
```

**Empirically confirmed signatures (differ from generic pythonocc docs):**
- `GetComponents_s(label, TDF_LabelSequence, getsubchilds=False) -> bool`
- `GetLocation_s(label) -> TopLoc_Location` (returns directly, not out-param)
- `GetFreeShapes(TDF_LabelSequence)` / `GetShape_s(label)` / `IsAssembly_s` / `IsSimpleShape_s` / `IsReference_s` / `NbComponents_s` — all bound
- `XCAFDoc_ShapeTool.GetReferredShape_s(label)` for reference nodes (shared-instance disambiguation)
- Downcast: `TopoDS.Solid_s(shape)`; compound: `TopoDS_Builder().MakeCompound/Add`; placement: `shape.Moved(TopLoc_Location(trsf))`

---

## 3. Multi-body part handling — VERIFIED

Even single-body STEP reads may return `TopoDS_Compound` with N disjoint solids. Split with `TopExp_Explorer(shape, TopAbs_SOLID)`. **Discriminator:**
- **Touching/shared contact** (min distance ≈ 0) → treat as ONE implicit part
- **Real gap** (> epsilon) → separate parts, each becomes own feature-recognized body

---

## 4. Mating-condition recovery (geometry heuristics)

Established, feasible, ~medium confidence. Published baseline: Lou/Lin/Dong (2006) face-to-face/coaxial/align heuristics; JoinABLe (Willis, CVPR 2022) 79.53% joint accuracy ceiling (ML/GNN).
- **Planar mate:** two planar faces coplanar + opposite normals within epsilon
- **Cylindrical/coaxial (pin-in-hole):** two cylinder axes collinear + BOX/CONTACT containment check
- **Angle/parallel:** plane-plane angle constraint
- **Discrimination:** pure coplanarity/radius-equality loses mates under modeling tolerance. Add BOX/CONTACT operators to reject redundant/invalid constraints

Reuse cad_reverse's existing hole/shaft recognition (`HoleParams`, axis detection).

---

## 5. GD&T / tolerance extraction — RISKIEST AREA

- **Enumeration fully works:** `XCAFDoc_DocumentTool.DimTolTool_s(doc.Main())`, `GetDimensionLabels`, `GetGeomToleranceLabels`, `GetDatumLabels`, all callable
- **BUT the semantic value model is not wrapped:** `XCAFDimTolObjects_DimensionObject` / `XCAFDoc_GeomTolerance` — the rich getter accessors are not implemented
- **Workaround:** legacy `XCAFDoc_DimTol` label `GetKind`/`GetVal` via `TDF_AttributeIterator`
- **Data availability wall:** most SolidWorks/NX/CREO STEP exports strip PMI/GD&T. Plan for graceful PARTIAL degradation

---

## 6. Clearance / interference / fit classification — TRIVIALLY FEASIBLE

Pure arithmetic once hole Ød and shaft ØD from recognized features (ISO 286 hole-basis):
- `max_clearance = ES_hole − ei_shaft`; `min_interference = EI_hole − es_shaft`
- Both ≥ 0 → clearance; both ≤ 0 → press/interference; else transition
- **Nominal-only shortcut** (when deviations absent): ratio + nominal position label the fit family (H7/g6 sliding vs H7/p6 press)
- Feeds risk_assessment directly — strong, low-risk v2 deliverable

---

## 7. Fastener recognition + parametric substitution — FEASIBLE

Reuse cylinder/fillet recognizers to find head (hex/cylindrical) + shank + threaded-capped cylinder; cross-match **head-across-flats + shank Ø** against ISO 4762/DIN 912 tables → `M{#}` size. Named-body labels (`TDataStd_Name`) disambiguate. Pattern grouping in `order.py` reuses directly for bolt circles.

---

## 8. Welded-assembly recognition — PARTIAL / LEAST VALIDATED

A fillet weld IS a concave blend surface. Design as special case on AAG blend mask + fillet machinery: find concave toroidal/constant-radius strip whose two flanking faces are both planar AND near-parallel → classify as structural fillet weld. Keep as heuristic + escalation, honestly flagged as not literature-validated in B-Rep.

---

## 9. BOM extraction — EASY

Free with tree traversal: collect part **name** (`TDataStd_Name`), **label tag**, **quantity**, **color** (`ColorTool_s.GetColor`), **material** (`MaterialTool_s`). Output BOM with per-part volume/bbox. Deterministic, trivially testable.

---

## 10. Feasibility assessment

**Confirmed achievable now (deterministic, pure OCP):**
- Assembly tree read + recursive traversal + nested placement
- Multi-body detection + connected/disconnected discrimination
- BOM extraction (names/tags/quantities/color/material)
- Fastener recognition + parametric substitution
- Mating-condition recovery (geometric heuristics)
- Fit classification (clearance/interference/press via ISO 286)

**Partial / needs workaround:**
- Tolerance/GD&T enumeration works, value extraction needs legacy API path. Most real STEP exports strip PMI.

**Not realistic in Python:**
- Typed `XCAFDimTolObjects_*` semantic GD&T object model (not wrapped)
- XML GDTF PMI-file parsing
- Kinematic constraint persistence from CAD-native models

### Recommended v2 build order:
1. XCAF assembly loader & tree walk → 2. Multi-body split + connected/disconnected gate → 3. Per-leaf feature recognition reusing existing recognizers → 4. Mating-condition + fit classification → 5. BOM → 6. Fastener substitution → Gate GD&T (5) and weld-split (8) as best-effort PARTIAL

### Key empirical corrections to generic pythonocc docs:
`_s` suffix on statics, `GetLocation_s` returns directly (not out-param), `Transfer(doc)` (not `Transfer_doc`), `TDocStd_Document` self-generates application, `shape.Moved()` needs `TopLoc_Location`. Guard recursion with `IsReference_s`/`GetReferredShape_s`; compose nested transforms with `TopLoc_Location.Multiplied`.
