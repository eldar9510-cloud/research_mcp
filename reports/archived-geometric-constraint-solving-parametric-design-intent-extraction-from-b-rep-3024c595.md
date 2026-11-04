---
{
  "format": 1,
  "metadata": {
    "id": "archived-geometric-constraint-solving-parametric-design-intent-extraction-from-b-rep-3024c595",
    "title": "Geometric Constraint Solving & Parametric Design-Intent Extraction from B-Rep",
    "question": "What findings, alternatives and limitations does the historical investigation document about Geometric Constraint Solving & Parametric Design-Intent Extraction from B-Rep?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Geometric Constraint Solving & Parametric Design-Intent Extraction from B-Rep. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Geometric Constraint Solving & Parametric Design-Intent Extraction from B-Rep; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:42.912Z"
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
  "sourceDigest": "3024c595654fd734ebe614a6a53d8fda68d3de588b76a5d9c0aa402d014da5d3",
  "proposalRevision": "a006d10a70f8985a1b6e47ac41090fdd5d0986816851c272fad0c64ff20973a7"
}
---
# Geometric Constraint Solving & Parametric Design-Intent Extraction from B-Rep

> Deep online research reference. Scope: going from faces/edges to **"why"** — recovering the
> parametric intent ("this part is a rectangle extruded to 40mm with four counterbored holes on
> a 50mm bolt circle") from un-historied B-Rep geometry. Covers constraint solvers, symmetry &
> pattern detection, dimension & datum-frame recovery, tolerance inference, and FreeCAD's actual
> (mostly absent) parametric reconstruction.
>
> Companion to the deterministic `cad_reverse` pipeline (`reconstruct()` already extracts stock,
> holes, pockets/pads, fillets/chamfers, patterns and orders them). This document maps that work
> onto the wider research landscape and identifies what a *parametric intent* layer would add.

---

## 0. The central question & the answer landscape

**B-Rep gives you the "what" (analytic surfaces + topology) — not the "why".** A STEP shell
contains planes, cylinders, cones, tori, trimmed NURBS and their adjacency. It explicitly does
**not** contain the sketch-extrude-cut feature tree, the constraints that drove the sketch, the
pattern command, or the dimension annotations. Recovering intent is an *inverse* problem.

The research community attacks it on four fronts:

| Front | Method family | Output | Best for |
|-------|---------------|--------|----------|
| **Geometric regularity / beautification** | Detect near-parallel, near-concentric, symmetry, equal-radius; enforce as constraints (Langbein–Marshall–Martin; Gauthier et al.) | Parameter-regularized B-Rep + constraint set | Deterministic, no training data, runs on your own machine |
| **Rule-based feature + pattern recognition** | Centroid/d-adjacency graphs, relation graphs, AAG subgraph matching (cad_reverse's own approach) | Feature instances + arrangement (bolt circle, grid) | Deterministic, fast, interpretable |
| **ML/history-sequence prediction** | Transformers/RL on sketch+extrude programs (Fusion360 Gym, DeepCAD, ReACT, Zone Graph, CAD-SIGNet, MiCADangelo) | Probabilistic reconstruction *sequence* | Novel/free-form parts; needs big labeled datasets |
| **Datum/DRF extraction + GD&T synthesis** | Orientation clustering → orthogonal reference frame (Gauthier); assembly feature + direction-of-control + loop detection (ASU Design Automation Lab) | Global coordinate frame + datum planes + proposed tolerance schema | Dimensioning and tolerance intent |

**Key research truth:** the most *robust, deployable, license-clean* recoveries of intent in the
literature are the **deterministic regularities + beautification** and **centroid-based pattern
recognition** families — precisely the category `cad_reverse` already implements. The ML-history
route is the frontier but is non-deterministic, data-hungry, and out of scope for the module's
"D2: No LLM / deterministic only" design decision.

---

## 1. Extracting geometric constraints from B-Rep geometry

### 1.1 Constraint taxonomy (what to look for)

Constraint types that appear repeatedly across the literature, harmonized into one table:

| Constraint | Geometric test | Typical source faces/edges |
|-----------|----------------|---------------------------|
| **Parallel** | face normals (or line directions, or cylinder axes) parallel to < tol | planar pairs, extruded walls, hole axes |
| **Perpendicular / orthogonal** | normals/axes orthogonal | adjacent extruded walls, datum axes |
| **Coincident / coplanar** | points in same plane; faces on same plane < δ | shared base faces, planar caps |
| **Tangent** | surface distance / first-order contact (incl. smooth-AAG blend edges) | fillets, transitions, tangent arcs in sketch |
| **Concentric** | cylinder/cone/torus axes coincident; circle centers equal | counterbore + through-hole, stacks of bosses |
| **Symmetric (mirror)** | reflection plane maps entity to itself (below, §4) | mirrored features, symmetric halves |
| **Equal radius / equal length / equal distance** | congruent dimension matches < tol | chain of identical holes, repeated members |
| **Aligned** | centers on a line; axes on a plane; positions co-linear | feature rows, slot patterns |
| **Angle** | constant dihedral between planes | draft/taper, chamfer, swept faces |

### 1.2 How constraints are *derived*, not guessed

1. **Segment surface primitives** (plane/cylinder/cone/sphere/torus) from the B-Rep.
2. **Extract per-face latent vectors**: plane → normal; cylinder → axis + radius; sphere → center;
   torus → axis + major/minor radii. These are the "features" constraints attach to.
3. **Compare identical entities across faces** (normals, axes, radii, centers, heights) within a
   tolerance; emit a constraint when a relation holds globally.
4. **Verify before emitting** (cad_reverse's own practice): a candidate parallel relation is
   accepted only if it survives across *all* relevant face pairs, not one local coincidence.
5. Represent as a **constraint graph** (nodes = faces/axes/primitives, edges = relations) that a
   downstream solver can consume (the beautification graph of Gauthier et al.).

The recurrence of "verify, don't trust local evidence" is the strongest reusable lesson: every
serious method (cad_reverse's blend-mask, Langbein's consistent-subset selection, Gauthier's area-
weighted orientation clustering) exists to suppress **spurious local regularities**.

### 1.3 Spurious-regularity problem (the crux)

Real geometry has accidental near-parallel faces and near-equal radii. All robust methods handle
this explicitly:
- **Langbein–Marshall–Martin (CAD 2004):** build *all* hypotheses, then select a *consistent
  subset* using **genericity / DOF solvability tests** (does adding this constraint keep the system
  generically solvable without actually solving?) ranked by merit (numerical accuracy + regularity
  desirability). This is authoritative guidance for `cad_reverse` 's reason-code escalation.
- **Gauthier et al.:** weight orientation clusters by surface area so a large dominant face anchors
  the relation, and derive relations *globally* from datum references to avoid pairwise error
  propagation.
- **cad_reverse:** inward-normal gate + blend mask to reject false fillet/hole cylinders — same
  spirit, deterministic rules.

---

## 2. Constraint solvers — comparison

Constraint *extraction* (detecting that parallel/equal/concentric relations exist) must be
distinguished from constraint *solving* (given a constraint system + under-determined sketch,
compute coordinates that satisfy all constraints). cad_reverse emits CadQuery programs — FreeCAD's
Sketcher/SolveSpace solve the *sketches*, not the B-Rep graph per se; but understanding the solvers
clarifies what an "intent-confirming" pass would require.

### 2.1 Comparison table

| | **PlaneGCS** (FreeCAD / SALOME) | **SolveSpace** | **D-Cubed DCM** (Siemens) | **LGS** (LEDAS → Bricsys) | **CGAL (approx)** |
|---|---|---|---|---|---|
| License | **LGPL** | GPL | **Commercial** (embedded) | **Commercial** (sold to Bricsys 2011) | GPL / LGPL |
| Dims | 2D (planar sketches) | 2D + 3D | 2D **and** 3D DCM | 2D + 3D | varied |
| Core method | Numerical (DogLeg default, LM, BFGS; SQP when temp constraints) | Graph param + numeric | Unknown/proprietary (Newton-family) | C-API, numeric + with "natural solution" minimization | Numerical, per-kit |
| Constraint breadth | Coincident, parallel, perpendicular, tangent, equal, concentric, distance, angle, radius, symmetry, midpoint, horizontal/vertical | Coincident, parallel, tangent, distance, angle, equal, point-on-curve, diameter, ratio | Full sketch DCM (2D) + full 3D DCM (variational geometry) | Coincidence, parallel, tangent, concentric, perpendicular, midpoint, equal dist/radius, dist/angle/dihedral, engineering equations, tables | Intersections, distances, angles |
| Degrees of freedom reporting | Yes (Jacobian rank via Eigen Sparse/Dense QR; flags redundant/conflicting) | Yes | Yes | Yes ("over/under-defined" diagnostics) | varies |
| API | C++ classes (`GCS::System`); WASM/TS wrapper (Salusoft89/planegcs) | C++ / Lua / parametric program | C/C++ DCM API + DCM4CAD adapter | C-style API; .NET/Java/C++ wrappers | C++ header libs |
| Notes | **The practical open choice**; used by FreeCAD Sketcher + SALOME Shaper; compact; C++20 + Boost/Eigen | Pulls all + 3D but GPL blocks commercial embedding | **Market leader** (AutoCAD, SolidWorks, Creo, NX); 2D+3D, closed | Originally #2 to D-Cubed; OCC blog documents integration; transitioned to Bricsys | Not a full sketch solver; use for small constraint sub-problems |

### 2.2 PlaneGCS internals (per the DeepWiki + Salusoft docs)

Three-layer architecture: `Sketcher::SketchObject` (FreeCAD geometry/constraint lists) →
`Sketcher::Sketch` (translator via `setUpSketch()`/`extractGeometry()`) → `GCS::System` (numeric
core). Central data: a **p-parameters vector** (`std::vector<double*>` pointers into geometry)
that the solver mutates. Each constraint class implements `error()` and `grad()`. Solving:
1. **Diagnose** — build Jacobian from gradients, QR-decompose to get *rank* → DOF, spot
   redundant (rank-deficient, residual≈0) vs conflicting (residual≠0) constraints.
2. **Partition** — split into decoupled subsystems (Boost Graph Library), reduce params via
   equality constraints, isolate temporary (drag) constraints.
3. **Solve** — DogLeg default; drive/reference flags; temporary constraints force SQP.
Algorithms: DogLeg, LM, BFGS (an evaluated DFP addition exists in the academic literature).

**Relevance to cad_reverse:** PlaneGCS is the free, LGPL-clean solver whose constraint set
(parallel, perpendicular, tangent, equal, concentric, symmetry, midpoint) is exactly the taxonomy
in §1. The library-generated CadQuery could, in principle, feed a PlaneGCS-confirmed constraint
graph rather than only numeric sketch geometry — but that is optional; cad_reverse currently
produces concrete CadQuery geometry validated by symdiff, not solved sketches.

---

## 3. Design-intent extraction (the "why")

### 3.1 Two complementary framings

**(a) Feature-level regularities (deterministic):** infer the *pattern of construction* from
geometry — "these holes form a bolt circle", "this pocket is centered/at a datum plane", "four
identical pads" — via symmetry + pattern recognition (§4–5). This is what cad_reverse does, and
what beautification research formalizes.

**(b) History-sequence reconstruction (ML):** recover the actual *command sequence*
(sketch→extrude→cut→pattern). Key works and datasets:

- **Fusion 360 Gallery + Gym** (Autodesk/MIT, SIGGRAPH 2021): 8,625 human sketch+extrude designs;
  reconstruction standardized as an MDP over B-Rep face-adjacency graphs; neurally-guided search
  recovers a correct program for **67.5%** of test designs within 100 agent steps (~<20 s each).
  Official 80/20 split; also provides segmentation (35,680 parts labeled by creating operation)
  and an **assembly dataset** (8,251 assemblies).
- **Zone Graph** (Xu et al., CVPR 2021): partitions space by extending all B-Rep faces; a GNN
  scores candidate extrusions to search the modeling-sequence space without an agent.
- **DeepCAD / CAD-SIGNet / ReACT**: sketch+extrude autoregressive transformers over geometry;
  ReACT (Ding, NTU PhD) treats it as reward-informed decision making with a barrel-point reward.
- **MiCADangelo** (NeurIPS 2025): human-like workflow — extract 2D cross-sections → predict
  *constrained* parametric sketches → differentiable extrusion fitting; notably the first to bring
  **sketch constraints (parallel, perpendicular, tangent)** into CAD reverse engineering, which
  "encode design intent and govern edit response."

**Why this matters to cad_reverse:** the classic literature and Fusion360 Gym both converge on
**extrude-as-the-primitive-operator** with sketch profiles — which is exactly cad_reverse's D6
design (profile-extrude the largest planar ring, not bbox-carve). The ML "why" is an *aspirational*
layer; the deterministic layer already recovers the material subset (feature + pattern + stock).

### 3.2 Design-intent heuristics worth codifying

Across sources, intent that can be *heuristic-encoded* deterministically includes:
- **Profile = closed planar loop** (outer wire of largest planar face) driven to a sketch.
- **Holes-on-circle / on-grid** when centroid pattern satisfies an exact circle/line (report the
  mean radius + count + angular step rather than N independent holes) — this is the single biggest
  "why not what" win.
- **Centering / alignment** when feature centroid lies on the stock datum plane or bisector.
- **Symmetry** when a reflection maps the whole part to itself → emit mirror.
- **Equal features** when congruent instances share parameter values → emit one + pattern.

Each maps to a cad_reverse `PatternParams`/`HoleParams` already present in Issue #6.

---

## 4. Symmetry detection in B-Rep

Rich, well-trodden topic. The methods:

| Method | Basis | Symmetries covered | Source |
|---|---|---|---|
| **Divide-and-conquer, face-atom** (Li, Foucault, Léon, Trlin) | New boundary paving of *maximal* faces/edges; Candidate Symmetry Planes/Axes from 1/2/3-face local configurations; two-level front propagation to global | reflection + rotation; local + global | CAD 2014 (& related) |
| **Constrained / loop-property** (Tate et al.) | Face loop area/centroid/normal/edge-count; POS from mirrored unit normals | reflection (+ some rotational) | early work |
| **Vector + face-centroid** (Burić, Brčić, Bojčetić, Škec) | POS/AOS candidates from center-of-gravity + principal inertia axes; vector tests per face | reflection + axisymmetry, **incl. NURBS/B-spline/blend** | CAD Journal 2023 |
| **Centroid + d-adjacency** (pattern sub-parts) | RE centroids, fudged with fictitious points on closed arcs; constant-distance networks | linear + circular translation, circular rotation, reflection | CAD 2016 slugged chapter |
| **Graph / Frequent Subgraph Mining (CLAG)** (Li, Li, Gao) | Congruence-labelled adjacency graph; FSM → multi-scale congruence features | reflection, translation, rotation, **compound** | 2019 |

**Practical guidance for a deterministic library:**
1. **Normalize the B-Rep first** (merge maximal faces, split sliver edges) — the boundary
   decomposition *reflects modeling history*, not shape; a symmetric shape can have an asymmetric
   face split. This is the single most-cited failure mode.
2. Candidate mirror planes from: pairs of identical faces (bisector of normals), or principal
   axes of inertia; then *verify* the whole shell maps to itself under the plane within δ.
3. Candidate rotation axes from: pairs of identical faces with their normals on a plane through a
   common axis (n-fold cyclic), or a shared cylinder/cone/torus axis.
4. Compound (dihedral / repeated unit cell) needs the graph method; use the simple exact checks
   first and only escalate.

---

## 5. Pattern recognition from B-Rep face arrangements

Pattern detection is well solved deterministically for the *most common* cases:

- **Centroids of repeated entities + d-adjacency graph** (the dominant approach): compute a
  representative centroid per repeated feature (add fictitious points on closed curved edges so
  arcs/circles centroid unambiguously), connect centroids at constant distance *d*, then find
  paths of ≥3 collinear points (**linear**) or ≥3 points on a common circumference
  (**circular / bolt circle**). A rectangular **grid** is the Cartesian product of two collinear
  families. Verify orientation (vertex correspondence under the candidate transform + face-normal
  agreement) before accepting.
- **Relation / feature graph + subgraph matching** (Gauthier et al., GRAPP 2019): for scanned/
  triangulated-mesh B-Rep, build a graph of primitives with *geometric-relation* edges
  (neighborhood, parallel, orthogonal, coplanar, tangent, concentric, equal-dimension) up to
  tolerances; recognize **counterbores and countersinks** by rule-based concentric-cylinder
  patterns; then detect **repetitions** by comparing feature parameters and **alignments** by
  projecting feature positions onto a plane (→ linear / circular repeats). Used for
  **beautification**: equalize radii, make axes concentric, regularize spacing — i.e., snap the
  noisy reverse-engineered params back to the intended perfect lattice.

The lesson: **group identical features → align their centers → fit a line/circle → report a
pattern object with count + spacing/radius + phase.** cad_reverse's Issue #6 already does grid /
bolt-circle / linear; issue is mainly *which* face-centroid representation is used (holes vs. pads
vs. bosses).

---

## 6. Dimension reconstruction

This is the **weakest link** in the literature — explicit extraction of linear/radial/angular
*annotation values* from B-Rep is largely an open problem. What exists:

- **Extraction is straightforward from the geometry itself** once features are identified:
  - **Linear dimension** → distance between two faces / between a face and an axis / stock width–
    height–depth (from the bbox or profile extent of §8).
  - **Radial dimension** → cylinder/conetorus radius (already in cad_reverse's `HoleParams`).
  - **Angular dimension** → dihedral between two planes (draft/taper) or plane-to-axis angle.
  The measurement is trivial; the *semantics* ("150 mm Ø40 H7 bolt circle" vs "4 holes spaced 50")
  is the design-intent question, and that comes from pattern/cluster grouping (§5) + datum scheme.
- **Beautification against standard tables**: Gauthier et al. regularize similar dimensions and
  snap them against standard metric series (preferred numbers, standard drilling sizes, common
  pitch). This is the closest to "dimension reconstruction" the literature gets.
- **2D-drawing re-dimensioning** (interpreting orthographic views to recover dimension lines) is a
  separate, ML-heavy route for legacy 2D prints, not B-Rep.

**Takeaway for cad_reverse:** dimension recovery is *native* to the existing pipeline — the
missing piece is emitting nice **nominal + rounding** (snap to preferred-number series) and letting
an RDREF-like schema name which dimension is which (width/height/depth/Ø/pitch/pcd). No new solver
needed.

---

## 7. Reference frame / coordinate system extraction

A "natural" part frame (origin + 3 orthogonal axes) is recoverable and is a strong intent anchor:

- **Principal axes of inertia / bbox alignment** — the cheap first guess (Burić et al. use center
  of gravity + principal inertia axes to seed POS/AOS candidates).
- **Datum reference frame (DRF) extraction** (Gauthier, Subsol, Bénière, Puech — IJIDeM 2020):
  1. **Orientation clustering**: collect per-primitive orientation vectors (plane normals,
     cylinder axes), cluster near-parallel orientations (weighted by face area), build an
     *orientation graph* (nodes = primitives, edges = parallelism; orthogonal clusters connect).
  2. **DRF from the graph**: find the orthogonal cluster triple best representing the part's
     global orientation → gives the 3 axes.
  3. **Datum plane/axis/point detection**: subsequent positional references to define the origin.
  4. Use DRF to *drive* beautification (parallel/orthogonal/concentric regularization) and to label
     dimensions (width vs height vs depth).

**Value to cad_reverse:** the DRF (a) anchors selectors and profile orientation deterministically
(so the emitted script is stable across input orientations), (b) explains the "natural" frame the
CLAUDE.md profile convention (±Z extrude, centroid at origin) approximates. A robust DRF pass
would reduce orientation ambiguity that currently percolates into stock/hole axis classification.

---

## 8. Tolerance inference from B-Rep

**Fully automatic GD&T from B-Rep is not achieved** — the state of the art is a rule-based
*first-order* schema from assemblability, with *second-order* (functional intent) tolerance still
open (ASU Design Automation Lab: Mohan, Haghighi, Vemulapalli, Kalish, Shah, Davidson).

The pipeline (given nominal B-Rep, e.g., STEP AP203 of an assembly):
1. **Preprocess**: Assembly Feature Recognition (AFR) of mating features → Pattern detection →
   Directions of Control (DoC) → dimensional **loop detection**.
2. **First-order schema** from assemblability: which features get toleranced, tolerance types,
   **datums + datum reference frames**, preliminary values. Joint/by-DoF categorization picks
   datums (e.g., an edge-slider planar mate → primary datum → flatness).
3. **Iterative refinement**: stack analysis; adjust values then schema until acceptance-rate goals
   met.

Practical heuristics the literature endorses (and that are *in principle* derivable):
- **Standard fits / clearance rules**: for a clearance hole vs shaft, "floating condition" →
  position tolerance ≈ shaft Ø − hole Ø; running/sliding/clearance fits map to tolerance grade
  (ISO 286 H/g h/f bands) *if you know the fit* — which B-Rep alone does **not** give you. You can
  infer *nominal* sizes and *that* a clearance/hole pair exists, but the *functional* fit (and thus
  tolerance band) requires domain knowledge.
- **Cost-functionality tradeoff**: assign the loosest tolerance meeting function.

**Honest conclusion for cad_reverse:** do **not** fabricate real GD&T values from B-Rep — the
geometry alone cannot determine fit/function. The reliable recoverable outputs are: (a) nominal
dimensions (§6), (b) the *coarse class* of a hole (through/blind/cbore/csk — already in
`HoleParams`; these are the tolerance-relevant callouts), (c) pattern/discrete relations that
*govern* position tolerance (bolt-circle position tolerance ≤ ½(SFB − fastener Ø)). Treat any
inferred tolerance band as a *derived heuristic*, clearly labelled, never authoritative.

---

## 9. FreeCAD's approach to STEP import & parametric reconstruction

**FreeCAD fundamentally does NOT reconstruct parametric history from STEP.**

- STEP is imported as a **non-parametric "dumb solid"** — a single static `Part::Shape` with no
  editable feature tree, no sketches/pads/pockets/history. As a FreeCAD contributor states bluntly,
  "STEP files have no parametric history … it is not possible to 'change' something." Geometry
  fidelity is high (STEP supports solids + NURBS), but intent is not recovered.
- FreeCAD offers only:
  - Use the imported dumb solid as a **base/reference** for building *new* parametric objects.
  - *Defeaturing* (grafting new features onto the import), not history recovery.
  - Community tooling: **Detessellate** workbench (DesignWeaver3D) — macros that algorithmically
    assist reconstruction: `ReconstructSolid`/`CoplanarSketch`/`EdgeLoopToSketch`/`SketchReProfile`
    to rebuild sketches from tessellated/coplanar edges, constrain coincident vertices, and repair
    wires. This is manual/semi-manual sketch re-routing, not automatic history inference.
- Import tip: disable **"Enable STEP compound merge"** so a multi-part assembly's parts appear as
  separate tree nodes.

**Contrast to cad_reverse:** cad_reverse goes *far beyond* what FreeCAD natively does — it
deterministically recognizes features (stock/holes/pockets/fillets/chamfers), orders them, and
emits an editable CadQuery script, while FreeCAD stops at exposing the dumb solid. The Detessellate
macros are the closest FreeCAD-adjacent analog to cad_reverse's reconstruction, but they are manual
sketch tools, not an automatic recognition→emit pipeline.

---

## 10. Commercial constraint solvers & their APIs

- **D-Cubed** (Siemens PLM): the **2D and 3D DCM** market leader — embedded in AutoCAD, SolidWorks,
  Creo, NX, Solid Edge, Inventor. Closed platform (C/C++ API; `DCM4CAD`/`DCM2D` variants). Not
  licensable for an open research library.
- **LGS** (LEDAS): historically **#2**, used by Cimatron, BricsCAD, CD-adapco; **C-style API** with
  .NET/Java/C++ wrappers, cross-platform, ~3,000+ industrial test cases. Constraint set overlaps
  §1 closely (coincidence, parallel, tangent, concentric, perpendicular, midpoint, equal
  dist/radius, distance/angle/dihedral, **engineering equations & table constraints**, rigid sets,
  move-under-constraints, over/under-defined diagnostics). IP sold to **Bricsys (Hexagon)** in 2011;
  entry point for a CAD vendor's embedded variational engine.
- **SolveSpace**: GPL, parametric 2D/3D, graph+constraint driven, consistent; license blocks
  commercial embedding but is a proven reference behavior.
- **PlaneGCS**: the pragmatic open choice (LGPL) — see §2.

**Strategic takeaway:** for `cad_reverse`'s stated "no runtime import from cad/, pure Python
library" goal, none of these need to be (or should be) a runtime dependency — the emitter
produces plain CadQuery. But if a future *constraint-confirming* or *beautifying* pass is wanted,
**PlaneGCS** is the clear open path (LGPL, matches constraint taxonomy, C++/WASM), with LGS as the
commercial-grade black-box option worth evaluating only for feature parity, not necessity.

---

## Key Takeaways

1. **B-Rep stores the "what"; intent is an inverse problem.** Don't re-derive what the geometry
   already says — derive the *relations between* faces (parallel, concentric, symmetric, equal,
   patterned) that the geometry leaves implicit. The B-Rep's face/edge *decomposition* reflects
   modeling history, not shape: **normalize (merge maximal faces) before any symmetry/pattern test**
   or you'll miss true symmetries (the #1 cited failure mode).

2. **Deterministic regularity-based extraction is the robust, deployable sweet-spot.** The best
   recoveries of intent in the literature are beautification (Langbein–Marshall–Martin;
   Gauthier et al.) and centroid-based pattern recognition — exactly cad_reverse's category
   (D2: deterministic, no LLM). ML history-sequence models (Fusion360 Gym, DeepCAD, ReACT,
   MiCADangelo) are the frontier but non-deterministic, data-hungry, and out of the module's remit.
   cad_reverse already sits on the right foundation.

3. **Always suppress spurious regularities**: cluster by face area weight, verify a relation
   *globally* (all relevant face pairs) before emitting, and use solvability/DOF or genericity
   checks to keep a "consistent subset" (Langbein). cad_reverse's blend-mask + inward-normal gate
   + per-feature escalation are the deterministic analogues — keep them; tighten coverage guards
   if hole-floor false pockets persist.

4. **Symmetry vs pattern**: reflection/rotation → normalize faces, seed candidates from identical-
   face pairs or principal inertia axes, verify the whole shell maps under the plane/axis.
   Linear/circular/grid patterns → centroid + d-adjacency path detection (§4–5). Report a *pattern
   object* (count, spacing, radius, phase) instead of N independent holes — the single biggest
   "why not what" win, and already implemented in Issue #6.

5. **Dimensions are cheap to measure, hard to label.** Measure linear/radial/angular freely from
   resolved geometry; *name* them (width/height/depth/pcd/Ø/pitch) and snap to preferred-number /
   standard-series values using a datum reference frame. Dimension-annotation recovery is the worst-
   supported topic in the literature — a genuine opportunity, and cad_reverse's profile/radius data
   is already dimension-ready.

6. **Tolerance inference must be honest.** Do NOT fabricate real GD&T from B-Rep: the geometry
   alone cannot determine fit or function (the ASU work only reaches a *first-order* schema from
   assemblability). Recoverable truths: nominal sizes, coarse hole class (through/blind/cbore/csk),
   and pattern/discrete relations that bound position tolerance (floating-condition rule). Label any
   band as a derived heuristic.

7. **FreeCAD won't do your job — that's the gap cad_reverse fills.** FreeCAD imports STEP as a dumb
   solid with no history; its community only offers manual sketch-repair macros (Detessellate).
   cad_reverse's automatic feature→order→emit→verify is strictly beyond FreeCAD's native capability
   and emulates the Sketch+Extrude design language (D6) that the whole ML literature (Fusion360 Gym)
   also treats as universal.

8. **Constraint solver choice (future-proofing):** PlaneGCS (LGPL, matches the §1 taxonomy,
   DOF/rank diagnostics) is the clear open path for any future constraint-confirming or beautifying
   pass; commercial D-Cubed is closed and unnecessary; LGS (→Bricsys) is the commercial-grade
   black-box option if feature parity is ever needed. Today none is a runtime dependency of the
   deterministic emitter.

9. **A datum reference frame (DRF) layer is the highest-leverage missing addition.** Orientation
   clustering → orthogonal triple gives a "natural" part frame that (a) stabilizes emitted-code
   orientation/selectors, (b) names dimensions, and (c) anchors beautification. Close to what
   CLAUDE.md's profile convention approximates; worth formalizing as its own recognizer.

---

## Primary sources

- **PlaneGCS architecture** — FreeCAD DeepWiki "Constraint System and GCS Solver"; Salusoft89/planegcs (WASM wrapper) README.
- **Solver algorithm comparison / DFP** — Sun et al., "A Comprehensive Evaluation of the DFP Method … Using PlaneGCS".
- **D-Cubed & LGS** — LEDAS; LGS feature/API docs; Siemens PLM DCM.
- **Symmetry** — Li, Foucault, Léon, Trlin (CAD, global/partial reflective symmetry); Burić, Brčić, Bojčetić, Škec (vector/face-centroid, incl. NURBS); Li, Li, Gao (CLAG / FSM); Tate et al. (loop-properties).
- **Pattern recognition** — "Identification of Regularities in CAD Part and Assembly Models" (Springer/CAD); Gauthier, Subsol, Bénière, Puech (GRAPP 2019, relation graph + beautification).
- **Design intent / history sequence** — Xu et al. "Inferring CAD Modeling Sequences Using Zone Graphs" (CVPR 2021); Fusion 360 Gallery + Gym (Willis et al., SIGGRAPH 2021 / arXiv:2010.02392); DeepCAD; CAD-SIGNet; ReACT (Ding, NTU); MiCADangelo (NeurIPS 2025).
- **Reference frames / DRF & beautification** — Gauthier, Subsol, Bénière, Puech, "CAD-driven analysis and beautification of reverse engineered geometric models" (IJIDeM 14, 2020); Langbein, Marshall, Martin, "Choosing consistent constraints for beautification …" (CAD 2004).
- **Tolerance synthesis** — ASU Design Automation Lab: "Toward Automatic Tolerancing of Mechanical Assemblies: Assembly Analyses" (Mohan/Haghighi/Vemulapalli/Kalish/Shah/Davidson).
- **FreeCAD STEP handling** — FreeCAD Manual "Import and export to other filetypes"; Detessellate workbench (DesignWeaver3D); FreeCAD forum discussion on STEP history.
- **Datasets** — A2Z-10M+ (CVPR 2026), ABC, ABCParts, CC3D, Fusion 360 Gallery (segmentation + assembly).
- **B-Rep boundary/junction nets (scan side)** — Ali, Khan, Stricker, "BRep Boundary and Junction Detection for CAD Reverse Engineering"; DualBrep (Autodesk AI Lab).

*Compiled 2026-08 from public web research. URLs reachable via the linked titles/DOIs; this is a
synthesis/reference doc, not a copy of any single work.*
