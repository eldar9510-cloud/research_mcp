---
{
  "format": 1,
  "metadata": {
    "id": "archived-deep-research-multi-target-cad-emission-for-reverse-engineered-b-rep-geometry-9fabedcd",
    "title": "Deep Research: Multi-Target CAD Emission for Reverse-Engineered B-Rep Geometry",
    "question": "What findings, alternatives and limitations does the historical investigation document about Deep Research: Multi-Target CAD Emission for Reverse-Engineered B-Rep Geometry?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Deep Research: Multi-Target CAD Emission for Reverse-Engineered B-Rep Geometry. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Deep Research: Multi-Target CAD Emission for Reverse-Engineered B-Rep Geometry; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:43.589Z"
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
  "sourceDigest": "9fabedcdc8a34d5f123f031370d383b5595dd750afb842cdf10d5fa2a0d03047",
  "proposalRevision": "5c180ff98f2a9310cc7949c8b1a46c3ca25f822e970b9fae7181ddaf5bb63066"
}
---
# Deep Research: Multi-Target CAD Emission for Reverse-Engineered B-Rep Geometry

**Date:** 2026-08-08
**Agent:** Research squad — multi-target emission
**Status:** Complete

## Executive summary

cad_reverse currently emits ONLY CadQuery Python scripts. This deep research assesses 9 alternative target formats plus the architectural changes needed to support them. **The single highest-leverage finding: your typed `OrderedFeatures` representation (stock + pads + subtractive + patterns + fillets/chamfers as dataclasses with world-space coordinates) is already a clean, emitter-agnostic intermediate — not a single Coupling-to-CadQuery. Multi-target emission costs mostly new emitter modules, not refactoring.**

Working examples below use a **box + 2 through-holes + 4 fillets** (the same fixture cad_reverse's `box_holes_fillets` handles).

---

## 1. build123d emission — HIGHEST value, LOW-MEDIUM effort

**API model.** build123d (v0.10–0.11, Nov 2025+) is a CadQuery refactor; it shares OCP/OCCT, so geometry and selectors interchange. It exposes two APIs that matter differently for an emitter:

- **BuildPart (context-manager Builder API)** — Pythonic `with BuildPart():` blocks. This is the *statement-based* model that maps naturally onto a feature list because each feature is a plain statement:
  ```python
  from build123d import *
  L, W, H, D, R = 100.0, 60.0, 20.0, 8.0, 5.0

  with BuildPart() as part:
      Box(L, W, H)                              # stock
      Cylinder(D/2, H, Mode.SUBTRACT, Pos=(35, 15, 0))   # hole 1
      Cylinder(D/2, H, Mode.SUBTRACT, Pos=(35, 45, 0))   # hole 2
  # fillets: build123d wants edges via selectors:
  part.edges().filter_by(Axis.Z).fillet(R)      # 4 vertical edges
  ```
- **Algebra API** — operator-based CSG (`+`, `-`, `&`), ideal for the CSG side of the story but less aligned with a feature/history emitter.

**Effort.** Moderate. The mapping is nearly 1:1 with your `OrderedFeatures`:
| cad_reverse feature | build123d op |
|---|---|
| stock (rect) | `Box(w, d, h)` |
| stock (circle) | `Cylinder(r, h)` |
| through hole | `Cylinder(D/2, H, Mode.SUBTRACT)` |
| cbore/csk | two stacked SUBTRACT cylinders (cbore cylinder + cone) |
| pocket/slot | `Box(...)` SUBTRACT (or `Slot` in BuildSketch then extrude SUBTRACT) |
| fillet | `.edges().filter_by(...).fillet(R)` |
| pattern | `for` loop of SUBTRACT cylinders (native Python — build123d excels here) |

Unlike CadQuery's `Workplane` punching, build123d places primitives with `Pos()/Rot()` directly in world space — which **matches cad_reverse's world-space `center_3d`/`axis` directly and eliminates the fragile `NearestToPointSelector` + UV-projection dance** the CadQuery emitter currently needs (`_uv`, `_opening_frame`, `_face_point` in `emit.py`). This is the cleanest emission path of all non-CadQuery options.

**Maintainability.** Better long-term. build123d's selectors (`filter_by(Axis.Z)` etc.) are typed and explicit; CadQuery's string/`NearestToPointSelector` selectors are the current source of emitter fragility. But build123d is still pre-1.0 (`0.11.dev`), so the API can churn. The CadQuery emitter is the battle-tested known-good; treat build123d as additive (emit both), not a replacement.

**Recommendation: P1 (top priority).** Highest functional value, near-1:1 mapping, eliminates the selector fragility, and you already ship both selectors/renderers. Same-day effort via the BaseEmitter described in section 10.

---

## 2. OpenSCAD emission — LOW effort, MEDIUM value, MEDIUM fidelity ceiling

**CSG model maps cleanly to features.** OpenSCAD's `difference()` with `translate()` + `cylinder()`/`cube()`/`polygon()+linear_extrude()` covers stock, holes, pockets, and patterns with no geometry approximation:

```scad
// box + 2 through holes (works: exact CSG, no fillets yet)
PRF_W = 100; PRF_D = 60; H = 20;
D = 8; H1 = [35, 15]; H2 = [35, 45];

difference() {
    cube([PRF_W, PRF_D, H], center = true);
    translate([H1[0], H1[1], 0]) cylinder(h = H+1, d = D, center = true);
    translate([H2[0], H2[1], 0]) cylinder(h = H+1, d = D, center = true);
}
```

Polyline stock → `linear_extrude(height) polygon(points=[...])`; circular stock → `cylinder`. Patterns → `for` loops or `n=..., angle=...` in OpenSCAD 2021.01+. This part is trivial.

**The fillet problem — real and fundamental.** OpenSCAD has **no native fillet/chamfer on arbitrary edges.** Options, all poor:
- `minkowski()` hack (`minkowski(){ <part>; sphere(r=R); }`) — slow, faceted, and **grows every dimension by R** (must offset compensation), so it cannot reproduce the exact original geometry → **breaks the symdiff golden gate**.
- BOSL2 `fillet_mask_z`/`cuboid(edges=...)`/`prism_connector()` masks — work only on primitives/known edges, not arbitrary edges of a CSG result; require the BOSL2 library be installed by the consumer.
- Building the fillet as extra CSG geometry — only feasible topologically for axis-aligned corners; not general.

**Verdict.** Emit `.scad` for the CSG core (stock + holes + pockets + patterns) — cheap and useful for hobby/3D-printing/FOSSCAD audiences. For fillets: emit either (a) `minkowski` with a documented dimension-overshoot **and** a `FILTERED_EMIT_UNSUPPORTED` escalation to keep honesty (your reason-code culture), or (b) a BOSL2 `cuboid` variant. This target cannot reach `symdiff<0.001` on filleted parts — build123d/CadQuery/STEP are the fidelity paths.

**Recommendation: P3.** Great low-cost breadth, but the fillet ceiling caps fidelity. Do it for the CSG core only; never claim convergence on filleted parts.

---

## 3. FreeCAD Python emission — MEDIUM effort, MEDIUM value

FreeCAD has a mature, stable Python API with two layers:

**Part workbench (BRep-level, simplest & closest to a feature drain):**
```python
import FreeCAD as App
import Part
doc = App.newDocument("Part")

wk = doc.addObject("Part::Box", "Stock")
wk.Length, wk.Width, wk.Height = 100, 60, 20
# or script-based:
stock = Part.makeBox(100, 60, 20)

# holes = cylinders subtracted
hole = Part.makeCylinder(4, 25, App.Vector(35, 15, 0))
body = stock.cut(hole)

# fillet on recognized edges
body = body.makeFillet(5, body.Edges)
doc.recompute()
Part.show(body)
```
`Part::Box`, `Part::Cylinder`, `.cut()`, `.makeFillet(r, [edges])`, `.makeChamfer()` are all stable and map 1:1 onto features. This is a clean, faithful emit.

**PartDesign workbench (sketch-based, parametric, closer to what a user wants to edit):**
```python
body = doc.addObject("PartDesign::Body", "Body")
sketch = doc.addObject("Sketcher::SketchObject", "Sketch")
body.addObject(sketch)
sketch.addGeometry(Part.LineSegment(...), False)   # profile edges
feat = doc.addObject("PartDesign::Pad", "Pad")     # additive
feat.Profile = sketch
feat.Length = 20
doc.recompute()
```
The API supports `Pad`/`Pocket`/`Hole` (parametric, usable in macros via `import PartDesign`), plus `PartDesign::Fillet`/`Chamfer` (dress-up, separately editable). This is the workflow a machinist actually edits. **The catch:** sketch-based profiles require emitting `Sketcher::Geometry` (lines/arcs) rather than direct primitives — more emitter complexity, and it re-locates cad_reverse's *profile-extrude* stock model into sketch constraints. Both FreeCAD layers require a running FreeCAD (heavy, GUI-oriented install) to execute — completely different footprint than cad_reverse's pip-installable, headless-CadQuery sandbox.

**Recommendation: P3.** FreeCAD BRep (`Part`) emit is faithful and editable, but the execution dependency (FreeCAD runtime) and divergent philosophy (heavy desktop CAD vs. headless code) make it niche. PartDesign-script emit is only worth it for users who need native parametric edit-in-Place, and that's a larger lift.

---

## 4. STEP export with construction history / AP242 — MEDIUM-HIGH effort, HIGH fidelity, NOT feature history

**Direct solid export is trivial and faithful:** OCP already exposes `STEPCAFControl_Writer` and `STEPControl_StepModelWriter`. The `write.step.schema` static (`"AP242DIS"`) and `Interface_Static::SetIVal("write.stepcaf.annot", 1)` select AP242. This gives a round-trippable, downstream-consumable STEP — high unique value for a reverse-engineering tool (you already **read** STEP in; emitting clean STEP out completes the loop).

Caveat: the current pipeline's reconstruction path executes the CadQuery script in a sandbox to get `TopoDS_Shape`; you'd route that shape to the STEP writer (same shape you already verify with `symdiff`).

**What you CANNOT easily do: true AP242 construction history (the feature-model tree) from Python.** OCP gives `TDocStd_Document` + `XCAFDoc` (this is how CadQuery's `exportCAF`/assembly exporter works): it preserves **assembly hierarchy, names, colors, layers, materials, PMI** — but it stores final shapes on labels (`shape_tool.AddShape` / `AddComponent`), **not a rebuildable feature-construction tree.** There is **no maintained Python path to serialize the CSG/feature DAG itself into AP242's `solid_model`/`feature-based` construction-history entities** — that machinery in OCCT is not exposed through the standard `pythonococc`/`cadquery-ocp` wrappers. So: emit a **clean STEP AP242 with full hierarchy + PMI**, but NOT a fully history-based AP242 feature tree. That is an honest scope boundary (and matches your escalation culture — emit the escalation rather than silently claim history).

**Recommendation: P2.** High unique value (STEP-in→STEP-out closure, downstream interoperability) and the plain-solid path is cheap on top of the existing sandbox-exec. Treat "full AP242 feature history" as explicit v2/out-of-scope. Depends on the existing `_exec_emitted_script` shape being reused.

---

## 5. Three.js / web visualization — LOW effort, HIGH value, DIFFERENT use case

This is genuinely different from "editable CAD": it produces a *viewable/shared* artifact, ideal for catalogs (matching the user's broader market-analysis interest). Feasible several ways, all on top of the same reconstructed `TopoDS_Shape`:

- **STL** — `Shape.exportStl()`/`cq.exporters.export(..., "stl")`: trivial, tessellates with linear+angular deflection. Dumb (no materials/hierarchy) but universally consumed.
- **glTF/GLB** — OCP `RWGltf_CafWriter` writes an XCAF doc as glTF/GLB with coordinate-conversion (+Z→+Y up) and PBR. build123d's `export_gltf` wraps exactly this. Best modern web default (three.js / model-viewer / A-Frame native).
- **fascat** (pavelsimo) is a dedicated STEP→glTF/GLB/OBJ/USD pipeline built on `cadquery-ocp`, adding `meshoptimizer` decimation + named realtime budgets. Overkill to vendor, but the correct reference for quality.
- **native Three.js scene** — as glTF loader data; you don't emit `THREE.*` code, you emit glTF and load it. (A raw Three.js JS emitter is only worth it to add color/labels inline, which glTF already covers.)

The mesh is a tessellation by definition — so fidelity is by tolerance, not symdiff. For a *visual* artifact that's correct and desirable.

**Recommendation: P2 (cheap, high value, distinct-but-easy).** The emitter change is: reuse the sandbox-exec shape → `RWGltf_CafWriter`/STL. Given the catalog-sharing angle already in the parent project, this is arguably the best bang-for-buck after build123d.

---

## 6. Neutral formats — JT: not feasible; 3D PDF: no; IFC: feasible but wrong abstraction

- **JT** — Siemens proprietary, **no OCC write path** (and not in OCP). Not feasible.
- **3D PDF** — PDF embedding needs tessellation + a 3D annotation stream; OCCT has **no maintained exporter**, and the occt-pdf renderer/dependencies are no longer opened on Windows. Not feasible in practice from Python OCC.
- **IFC** — feasible via **IfcOpenShell**'s Python API (`ifcopenshell.geom` / OCCT↔BRep conversion). BUT: IFC is BIM (buildings/construction objects) — the abstraction mismatch is severe for machine parts (a bracket is not an `IfcWall`). You'd emit geometry-as-Brep via `IfcGeometricRepresentationItem`, sacrificing the feature semantics the whole pipeline preserves.

**Recommendation: P4 / skip.** Low unique value for this domain. IFC only if a downstream BIM-anchor demands it.

---

## 7. G-code / CAM toolpaths — MEDIUM effort, HIGH unique value (semantic fit)

**This is a standout because the recognizers already produce exactly what CAM needs: machining features.** A hole is a drill cycle; a pocket/slot is a 2.5D clearing pass; the stock gives the bounding Z. This is 2.5D (3-axis) friendly:

```
; box + 2 Ø8 holes (drilling), 4 fillets (∅10 → skip, blend not machine-cut)
G21 G90 G94
T1 M6            ; Ø8 flute drill
G0 X35 Y15 Z2
G81 X35 Y15 Z-22 R2 F120   ; hole 1
G81 X35 Y45 Z-22 R2 F120   ; hole 2
T2 M6            ; Ø4 endmill
; pocket(s) as 2.5D profile with z-steps ...
G90 G0 Z50
M30
```

Feasibility is established: **FreeCAD CAM workbench** (`Path.Op.Drilling`, `Path.Op.Profile`, `Path.Op.Pocket` backed by libarea), **ocp-freecad-cam** (a Python lib that takes build123d geometry → `Job.drill/pocket/profile/adaptive`, i.e., exactly our feature→toolpath shape), and **PyCAM** (open-source 2.5D). CAMAssist even *previews holes/pockets* with recommended tools — the same abstraction cad_reverse emits natively.

Two honest limitations:
1. **Fillets are not a CAM op.** A fillet is a blend to be *formed* (ball-nose finishing or just left) — it's not a drilling/pocketing path. Emit a `NOT_MACHINED_BLEND` note (your escalation pattern).
2. **Tool selection, stepovers, feeds** are CAM-domain parameters cad_reverse's features carry only partially (you have diameter/depth but not tooling). A generative emitter must emit conservative defaults and document them — like cad_reverse's `_RND` determinism, but reversed (machine-dependent).

**Recommendation: P2 (high unique value, moderate effort).** Known-good libraries (ocp-freecad-cam, FreeCAD Path) de-risk it. Do drilling + 2.5D pocketing only, and report blends as non-machined. This is the strongest *domain-expanding* target because the feature representation already is a machining feature list.

---

## 8. OCC-native formats — BREP is useful; XBF is dead; OCAF is internal

- **BREP** (`Shape.exportBrep`/`export_brep`) — trivial, lossless, OCC-native. **Genuinely useful as an intermediate** for re-import into OCP and as the canonical "fresh shape" artifact (de-historied, identical to the sandbox result). Cheap; add as a default side-output.
- **XBF (binary)** — the old OCCT stream API; effectively **abandoned** in modern OCC (superseded by the `XmlOcaf`/`BinOcaf` document persistence). Not worth it.
- **OCAF document (`TDocStd_Document`) in-memory** — the correct *container* for STEP/mesh export assembly/hierarchy (as in §4/§5), not a user-facing format. Use it internally; don't surface it.

**Recommendation:** emit BREP as a free side-effect (P2), use OCAF internally (§4/§5), skip XBF.

---

## 9. Comparison matrix

| Target | API maturity | Community momentum | Build effort (from OrderedFeatures) | Unique value-add | Feasibility/fidelity | Priority |
|---|---|---|---|---|---|---|
| CadQuery (current) | mature, stable | large | baseline | editable script, proven symdiff | symdiff<0.001 (verified) | — (keep) |
| **build123d** | pre-1.0 (0.11.dev) but active | growing (1.5k★) | **Low-Med** (near 1:1, no selector fragility) | cleaner editability, Pythonic, CSG-capable | symdiff<0.001 (verified) | **P1** |
| **STEP (AP203/214 + AP242 meta)** | mature, stable | max (universal) | **Low-Med** (reuse sandbox shape + writer) | downstream CAD interop; STEP-in→out closure | lossless (final solid) | **P2** |
| **glTF/STL (web/Three.js)** | mature | huge | **Low** (mesh via RWGltf) | catalog/sharing (matches parent project's catalog angle) | tessellation-by-tolerance | **P2** |
| **BREP (OCC-native)** | mature | — | **Trivial** (side-output) | canonical fresh shape, re-import | lossless | **P2** (side-output) |
| **G-code / CAM (2.5D)** | mature libs (FreeCAD Path, ocp-freecad-cam, PyCAM) | solid CNC | Med-High | machining features = CAM features (semantic win) | good for drill/pocket; blends excluded | **P2** |
| **OpenSCAD** | mature | large (hobby/FOSS) | Low (CSG core) | FOSS/3D-print reach | blocks on **fillets** (minkowski → no symdiff) | **P3** |
| **FreeCAD BRep/PartDesign** | mature, stable | very large | Med (BRep) / High (PartDesign-script) | native parametric edit-in-Place | faithful (BRep) but needs FreeCAD runtime | **P3** |
| **IFC** | mature (IfcOpenShell) | large (BIM) | Med | BIM/Brand domain | found by geometry; **abstraction mismatch** | **P4/skip** |
| **JT / 3D PDF** | — / proprietary | — | High / none | — | **not feasible** in OCC/Python | **skip** |

---

## 10. Architectural impact — how to add multi-target cleanly

The current `emit_script(ordered: OrderedFeatures, name)` in `emit.py` is monolithic — one function that both (a) collects named constants, (b) computes per-feature geometry (frames/UV/selector points), and (c) string-builds CadQuery. All three are CadQuery-coupled. Minimal-churn refactor:

### A. Introduce an abstract `Emitter` base (target-neutral interface)

```python
# emit.py — new base (CadQuery becomes CqEmitter)
class Emitter(ABC):
    format: str
    @abstractmethod
    def emit(self, ordered: OrderedFeatures, name: str) -> str: ...
    @abstractmethod
    def header(self, name: str) -> list[str]: ...
    def emit_stock(self, s: StockParams): ...
    def emit_hole(self, op: SubtractOp): ...
    def emit_pocket(self, op: SubtractOp): ...
    def emit_pad(self, p: PadParams): ...
    def emit_fillet(self, b: BlendParams): ...
    def emit_chamfer(self, b: BlendParams): ...
    def emit_pattern(self, p: PatternGroup): ...

def emit(ordered: OrderedFeatures, name: str, target: str = "cadquery") -> str:
    return _REGISTRY[target].emit(ordered, name)

_REGISTRY = {"cadquery": CqEmitter(), ...}
```

### B. Separate pure geometry from string-building

CadQuery selectors need the `_local_frame`/`_uv`/`_opening_frame` machinery; build123d/OpenSCAD/CAM need only `center_3d`, `axis`, `diameter`, `width/depth/height`, `floor_normal` — pure dataclass reads. Factor a `GeometryResolver` (computes frames/UV only on demand) so the CadQuery emitter keeps its behavior while other emitters ignore it.

### C. Visitor pattern over ordered lists

`OrderedFeatures` is already sequences (`stock`, `pads`, `subtractive`, `patterns`, `fillets`, `chamfers`), so `emit()` in each subclass loops the same six reservoirs and calls its own overrides. No feature-class methods need to change.

### D. Name/constant convention per target

CadQuery emits named constants (determinism + readability); OpenSCAD can inline literals; CAM emits unit/feed vocabulary. The `_RND` determinism discipline should be *inherited*, not re-derived per target.

### E. Register in `pipeline.py`

`reconstruct()` gains a `target=` param; the existing `emit_script(ordered, name)` call becomes `emit(ordered, name, target)`. The CadQuery path (and its symdiff verify) is preserved byte-identical; other targets get their own verify (STEP/BREP => symdiff; glTF/STL => mesh tolerance; CAM => emit-only, no geometric round-trip).

### F. Clean interface test surface

Add `test_emit_targets.py` asserting: (1) every `Emitter` subclass handles the six reservoirs; (2) build123d/STEP/glTF outputs are syntactically valid under their own runtimes; (3) a missing/symdiff-failing emission escalates via `Escalation`.

### G. Suggested implementation order

1. `Emitter` base + refactor `emit.py` into `CqEmitter` (zero behavior change, all 313 tests still green)
2. build123d emitter (P1)
3. STEP/BREP + glTF (P2, both reuse the sandbox-exec shape)
4. CAM (P2)
5. OpenSCAD (P3)
6. FreeCAD (P3)
7. JT/3D-PDF/IFC — not recommended

---

## Recommended priority order (final)

1. **P1 — build123d** (near-1:1 mapping, kills the selector fragility, same-day effort).
2. **P2 — STEP (AP203 solid + AP242 metadata)** — closes the STEP-in→STEP-out loop; **glTF/STL** — cheapest route to the web/catalog use case; **BREP** as a free side-output; **G-code/2.5D CAM** — the feature representation already *is* a machining-feature list, the most domain-expanding win.
3. **P3 — FreeCAD BRep** and **OpenSCAD CSG-core** — breadth, but fillet/runtime ceilings cap fidelity.
4. **P4/skip — IFC, JT, 3D PDF** — abstraction mismatch or no feasible OCC path.

The single refactor that buys everything: pull the CadQuery-specific geometry (frames/UV/selector points) out of the string templates, define `Emitter`, and register per-target subclasses. The parameter objects need zero changes — they were already the right emitter-agnostic intermediate.

### Sources
- [build123d vs CadQuery comparison (PrismNews)](https://www.prismnews.com/hobbies/3d-printing/python-based-build123d-brings-parametric-cad-modeling-to-3d)
- [build123d Builder System (DeepWiki)](https://deepwiki.com/gumyr/build123d/3-builder-system)
- [build123d BuildPart (DeepWiki)](https://deepwiki.com/gumyr/build123d/3.3-buildpart-(3d-modeling))
- [build123d Operations](https://build123d.readthedocs.io/en/v0.10.0/operations.html)
- [build123d Import/Export](https://build123d.readthedocs.io/en/stable/import_export.html)
- [build123d 3D Exports STEP/STL/BREP/glTF (DeepWiki)](https://deepwiki.com/gumyr/build123d/7.2-3d-exports-(step-stl-brep-gltf))
- [OpenSCAD CSG Boolean Operations (DeepWiki)](https://deepwiki.com/raksahb/openscad/4.2-csg-boolean-operations)
- [brepjs vs OpenSCAD (fillet/chamfer advantage)](https://brepjs.dev/compare/brepjs-vs-openscad)
- [Offset- and Fillet-Extrude for OpenSCAD (gist)](https://gist.github.com/thehans/52f46f87a8469f54861465bbf7035278)
- [BOSL2 — Belfry OpenScad Library](https://deepwiki.com/BelfrySCAD/BOSL2/3-3d-shapes)
- [FreeCAD Scripting PartDesign Workbench](https://wiki.freecad.org/index.php?title=Scripting_PartDesign_Workbench)
- [FreeCAD PartDesign Fillet](https://wiki.freecad.org/index.php?title=PartDesign_Fillet)
- [STEP reading with pythonocc / XCAFDoc (StackOverflow)](https://stackoverflow.com/questions/18496214/reading-step-properties-with-pythonocc/79898780#79898780)
- [CadQuery assembly exporter — exportCAF / XCAF doc (source)](https://cadquery.readthedocs.io/en/latest/_modules/cadquery/occ_impl/exporters/assembly.html)
- [OCCT STEPCAFControl_Writer reference](https://dev.opencascade.org/doc/occt-7.8.0/refman/html/classSTEPCAFControl__Writer.html)
- [OCCT forum — STEP PMI export via STEPCAFControl_Writer](https://dev.opencascade.org/content/missing-presentation-pmi-step-export-stepcafcontrolwriter)
- [fascat — CAD→RT3D pipeline (STEP→glTF/OBJ/USD)](https://deepwiki.com/pavelsimo/fascat)
- [pythonocc-core — STEP/IGES/STL/glTF + browser viz](https://github.com/tpaviot/pythonocc-core)
- [CadQuery Import/Export (STL, glTF via RWGltf_CafWriter)](https://deepwiki.com/CadQuery/cadquery/4.1-import-and-export)
- [ocp-freecad-cam — feature→drill/pocket/profile toolpaths](https://github.com/voneiden/ocp-freecad-cam/blob/dev/docs/examples/examples.rst)
- [FreeCAD CAM operations / toolpaths (DeepWiki)](https://deepwiki.com/FreeCAD/FreeCAD/3.9.1-cam-operations-and-toolpaths)
- [PyCAM — open-source 2.5D CAM](https://sugggest.com/software/pycam)
- [IfcOpenShell — OCCT↔IFC (dev.opencascade.org)](https://dev.opencascade.org/project/ifcopen shell)
