---
{
  "format": 1,
  "metadata": {
    "id": "archived-advanced-feature-types-for-b-rep-reverse-engineering-research-report-be33e0cb",
    "title": "Advanced Feature Types for B-Rep Reverse Engineering — Research Report",
    "question": "What findings, alternatives and limitations does the historical investigation document about Advanced Feature Types for B-Rep Reverse Engineering — Research Report?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Advanced Feature Types for B-Rep Reverse Engineering — Research Report. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Advanced Feature Types for B-Rep Reverse Engineering — Research Report; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:44.219Z"
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
  "sourceDigest": "be33e0cbbb9328e3efd7ceffc8b513c25f3b2449573fed61bb161c7bc3d3df8a",
  "proposalRevision": "e4e3d66a7cd45537e1c6220eb40253ecb08780137529c3fc706e19b26bf43708"
}
---
# Advanced Feature Types for B-Rep Reverse Engineering — Research Report

**Date:** 2026-08-08
**Agent:** Research squad — advanced feature types recognition
**Status:** Complete

Target: `cad_reverse` (deterministic, OCC via cadquery-ocp, no-ML).

## Verified OCC capability floor (from installed cadquery-ocp)

These classes are actually present and usable today:

- **`BRepFeat`**: `MakeRevol`, `MakeRevolutionForm`, `MakePrism`, `MakeLinearForm`, `MakeDPrism`, `MakeCylindricalHole`, `Gluer`, `Builder`, `SplitShape` — full form-feature construction kernel exposed.
- **`ShapeAnalysis_CanonicalRecognition`**: `IsPlane/IsCylinder/IsCone/IsSphere/IsLine/IsCircle/IsEllipse` + `SetShape`/`GetShape`/`GetStatus`/`GetGap` — canonical form identification within tolerance.
- **`BRepGProp_Vinert`** (plus `_Cinert`/`_Sinert`) — dense/composite global props for inertia → principal-axis detection.
- **`BRepExtrema_DistShapeShape`** — already used.

---

## 1. Revolved features — ★ TOP PRIORITY

**Why:** Most turned parts (shafts, flanges, pulleys, wheels, brake drums, motor shafts, ball-screw shafts — directly on Machine_concept critical path) are pure surfaces of revolution.

**Recognition algorithm (deterministic):**
1. **Axis voting** — Each cylindrical/conical face votes for its own `axis` line. The axis with most votes wins. Fallback: `BRepGProp_Vinert` principal axes of inertia — for a solid of revolution the axis-of-inertia aligns with revolution axis; verify by sampling radial distances at multiple Z stations.
2. **Confirm rotational symmetry** — plane containing A, intersect solid, extract 2D profile wire; each perpendicular cut must give identical profile.
3. **Extract profile** — 2D polyline/arc chain from outermost rim of faces voting for A.
4. **Decompose (Analysis Situs MTS)** — delta between stock and revolved shape → negative-volume cells: steps, grooves (`nvGroove`), central holes (`nvHole`).

**OCC calls:** `BRepBndLib`/`BRep_Tool` for axis, `BRepAlgoAPI_Section` for profile, `BRepGProp_Vinert` for inertia fallback, `BRepBuilderAPI_MakeWire` on profiler.

**Emission:** `Sketch()` → `.revolve()`. Trivially supported.

**Difficulty: HIGH value, MEDIUM implementation. Deterministic: YES.**

---

## 2. Ribs / webs — ★ HIGH for cast/molded parts

**Recognition (Lockett & Guenov 2005, AMAG):**
- Rib = face with ≥3 adjacent edges at node-order ≥3 and ≥1 unconnected edge
- Buttress = face with 2 high-order adjacent edges + remaining unconnected
- Fin = single internal edge connected to one edge of another face
- **Thinness gate:** face area / wall perimeter small, two faces on either side roughly parallel and offset by small constant distance (< few mm)

**OCC calls:** existing `AAG`; `BRepGProp_Vinert` area + `ShapeAnalysis_CanonicalRecognition.IsPlane`; normal via `GeomLProp`.

**Emission:** Moderate complexity — extrude thin rectangle between support faces.

**Difficulty: MEDIUM. Deterministic: YES. ~8-12 tests.**

---

## 3. Shell / hollow features — ★ HIGH for injection-molded, emission deferred

**Recognition:**
1. Classify outer vs inner via normal direction relative to centroid.
2. **Open-face detection** — find planar face whose boundary edges are mostly shared with other exterior faces.
3. Parallel-face distance histogram → dominant single thickness t.
4. Verify uniform thickness: sample outward-normal ray from inner face centroids, intersect solid, all ≈ t.

**Emission:** CadQuery has no native `.shell()`. Recognize + report as verified property; emission deferred.

**Difficulty: MEDIUM recognition / HIGH emission. Deterministic: YES.**

---

## 4. Draft angles — ★ MEDIUM (molding QA), easy gate

**Recognition:**
1. **Estimate pull direction:** dominant planar face normal, or principal axis of inertia via `BRepGProp_Vinert`.
2. For each planar/conical wall face: `angle = normal · pullDir`. Drafted iff angle differs from 90° by draft value.
3. Classify: positive draft / negative draft / requires draft / straddle faces. Thresholds: 0.5° thermoplastics, 1-3° aluminum.

**OCC calls:** `GeomLProp`/`BRepGProp` face normal, `ShapeAnalysis_CanonicalRecognition.IsPlane`, `gp_Dir` dot.

**Emission:** Report as QA property; emission deferred. **~5 tests.** Cheap spec addition.

---

## 5. Threaded features — ★ HIGH for screws/ball screws

**Three STEP representations:**
- **Modeled thread** — explicit helical B-spline flank faces (rare but detectable)
- **Cosmetic/annotation thread** — plain cylinder + `generic_model_representation`/callout. **cadquery-ocp's STEP importer drops these** — need raw STEP text parsing
- **Simplified thread** — smooth cylinder at major diameter (most common)

**Recognition (Analysis Situs modeled-thread):**
1. Seed: B-spline/swept faces bounded by helical circular edges
2. Cylinder grouping: coaxial axis + radius
3. Radius → minor (root) vs major (crest)
4. Helix verification: sample iso-parametric curves, verify helical path
5. Pitch extraction + snap to ISO standard (0.961 → 1.0)
6. Map minor+major+pitch → **standard thread designation (M3/M4/M5/M6/M8/M10/M12)**

**Recommendation:** v2 scope — recognize modeled threads + add STEP-callout parser for cosmetic/simplified case. **~8-10 tests.**

---

## 6. Pattern recognition — ★ HIGH; incremental to existing VF2

- **Linear patterns** — extend existing grid detection to arbitrary spacing/direction
- **Circular/bolt-circle** — proven centroid-based approach (Chiang/Giannini/Monti): RE centroids on circle, nth-fold rotational check
- **Mirror symmetry** — POSC (Buric et al.): candidate symmetry plane from similar planar face pairs + principal axes, verify face-similarity (cosine/Dice ≥0.75)
- **Patterns of patterns** — recursive VF2, frequent subgraph mining

**Difficulty: LOW-MEDIUM** (incremental to existing machinery). **Deterministic: YES. ~10 tests.**

---

## 7. Grooves / O-rings / retaining rings — ★ HIGH for shafts (piggybacks revolve)

Once revolve's MTS decomposition lands, grooves fall out almost free:
1. On revolved profile, find local radial constriction — radius dips by small consistent amount over short axial span
2. Classify internal (bore groove) vs external (shaft/OD groove)
3. Match to standard: DIN 471/472 (retaining ring grooves), O-ring gland widths

**Emission:** Revolve already represents groove as notch in profile — no separate feature needed. **~6 tests.** Marginal cost near zero after revolve.

---

## 8. Gears and splines — ★ LOW priority

Recognize as "revolve with periodic radial profile" and defer tooth profile. Involute fitting is high RD, high silent-correctness risk. Not in v2 scope.

**Difficulty: HIGH. Deterministic: partially.**

---

## 9. OCC feature recognition — the honest lowdown

- **BRepFeat is a CONSTRUCTION engine, not recognition** — builds prisms/revolves/ribs/grooves, doesn't recognize them from arbitrary B-Rep.
- **`ShapeAnalysis_CanonicalRecognition` is genuinely useful** — primitive-level canonical-form identification. Use as geometry-confirming gate under recognizers.
- **`BRepGProp_Vinert`** gives inertial/principal-axis data — workhorse for axis + pull-direction.
- **Analysis Situs** is "the first and only open-sourced CAD feature recognition software" — treat as algorithm cookbook, not dependency.

---

## 10. Feasibility ranking & recommended v2 roadmap

| # | Feature | Frequency | Recog ease | Emit ease | Value | Deterministic | Overall |
|---|---------|-----------|------------|-----------|-------|---------------|---------|
| 1 | **Revolved** | ★★★★★ | MED | easy | ★★★★★ | yes | **Tier 1** |
| 2 | **Ribs/webs** | ★★★ | MED | MED | ★★★★ | yes | **Tier 1** |
| 7 | **Grooves** | ★★★★ | low (post-revolve) | easy | ★★★★ | yes | **Tier 1** |
| 6 | **Patterns** | ★★★★★ | low | easy | ★★★★★ | yes | **Tier 1** |
| 3 | **Shell** | ★★★ | MED | HIGH→defer | ★★★ | yes | **Tier 2** |
| 5 | **Thread** | ★★★★ | MED | HIGH→defer | ★★★★ | yes | **Tier 2** |
| 4 | **Draft** | ★★★ | very low | defer | ★★ | yes | **Tier 2** |
| 8 | **Gears/splines** | ★ | HIGH | MED | ★★ | partial | **Tier 3** |

### Recommended v2 roadmap

**Milestone A — "Turning & Shafts" (biggest ROI):**
1. Axis-voting + `BRepGProp_Vinert` fallback revolution-axis detector (`recognize/revolve.py`)
2. Section-plane profile extractor → ring-profile construction
3. Backward-compat: circle-stock stays; rectangle → keep extrude; else → `Sketch.revolve`
4. MTS negative-decomposition → steps + grooves (topic 7 nearly free)
5. Tests: stepped/flanged shaft, pulley, wheel, brake drum, grooved shaft. ~14-16 tests. **Gate: all 16 v1.0 fixtures stay CONVERGED.**

**Milestone B — "Patterns & Draft" (cheap breadth):**
6. Circular, mirror, recursive patterns-of-patterns on existing VF2 + order.py. ~10 tests.
7. Pull-direction + per-face draft classification via `ShapeAnalysis_CanonicalRecognition` + normals. ~5 tests.

**Milestone C — "Web, Shell, Thread" (recognize+report, emission deferred):**
8. Rib/buttress AAG pattern + thinness gate (~9 tests)
9. Shell wall-thickness detection, report-only (~8 tests)
10. Modeled-thread detector + STEP callout parser → ISO designations (~9 tests)

**Explicit v2 non-goals:** gear/tooth-profile inversion, shell/thread/draft emission, NURBS, lofts/sweeps.

### Key sources
- Analysis Situs CNC turning features (axis voting + MTS + negative cells)
- Analysis Situs modeled-threads recognition
- Analysis Situs feature-recognition framework
- OCCT BRepFeat package (7.7.0)
- BRepFeat_MakeRevolutionForm
- OCCT ShapeAnalysis_CanonicalRecognition (7.8.0)
- OCCT BRepGProp (7.4.0)
- Lockett & Guenov, graph-based FR for injection moulding (AMAG rib/buttress/fin)
- Chiang/Giannini/Monti, circular pattern detection in B-Rep
- Li/Li/Gao, multi-scale regularities / frequent subgraph mining
- SolidWorks Draft Analysis / CAD Interop draft analysis
- ISO STEP gear dimension extraction (expert system)
- CadQuery revolve() docs
