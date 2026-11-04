---
{
  "format": 1,
  "metadata": {
    "id": "archived-algorithmic-feature-recognition-from-b-rep-cad-models-70b6851f",
    "title": "Algorithmic Feature Recognition from B-Rep CAD Models",
    "question": "What findings, alternatives and limitations does the historical investigation document about Algorithmic Feature Recognition from B-Rep CAD Models?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Algorithmic Feature Recognition from B-Rep CAD Models. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Algorithmic Feature Recognition from B-Rep CAD Models; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Original report/inventory records a research date range (2026-08-05/06 (compiled date range)); the exact original day remains unknown."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:42.046Z"
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
  "sourceDigest": "70b6851fdcb128b21dfcf58bf34d3e29eeeb55585b36ac98922eed6172761dc6",
  "proposalRevision": "236a464cd9402ec8520e6388f93904d0fbd0c4627913bb2477e8132ece5e2d3c"
}
---
# Algorithmic Feature Recognition from B-Rep CAD Models

*A deep-research reference for the `cad_reverse` project. Covers the concrete
algorithms for detecting holes, pockets, pads, slots, fillets, chamfers and other
machining features from un-historied B-Rep STEP models — the class of algorithm the
current deterministic recognizers implement.*

Compiled 2026-08-05/06. Sources are cited inline and consolidated in the
[References](#references) section. Where an algorithm is pseudocoded, the pseudocode
is paraphrased from the cited literature and from open-source implementations
(Analysis Situs, build123d-drafting-helpers, igraph/graphfind-rs), not transcribed
verbatim.

---

## 0. Big Picture: the four families of feature recognition

The literature consistently groups feature recognition into four algorithmic
families. Every recognition scheme in current engineering software descends from one
of these, or a hybrid of them:

| Family | Core idea | Strengths | Weaknesses |
|--------|-----------|-----------|------------|
| **Graph-based (AAG/subgraph)** | Build attributed adjacency graph, match concave subgraphs against feature templates | Fast, classic, well-understood for prismatic features | Fails hard on interacting features (loses arcs); polyhedral bias |
| **Hint-based** | Find minimal characteristic boundary clues, "grow" them into volumes | Robust to feature interaction by design | Many redundant hints, per-feature completion algorithms |
| **Volume decomposition** | Split delta volume (stock − part) into machinable cells | Directly maps to machining ops; handles curved via maximal volumes | Factorial interpretations, expensive |
| **Rule-based / syntactic** | Local geometric+tolerance rules per feature type | Fast, deterministic, handles interactions | Needs recompilation per feature; thin on curved parts |

`cad_reverse` is **rule + AAG-hybrid**: an AAG with a blend mask, per-feature rule
recognizers (`fillet_chamfer.py`, `hole.py`, `pocket_pad.py`, `stock.py`), and an
orderer/emitter. Its known gaps (5/6 PARTIAL failures traced to the *pocket
recognizer*, spurious candidates on hole walls/floors) are precisely the failure
mode rule-based recognition is famous for. This document is written to sharpen those
recognizers.

---

## 1. Hole detection algorithms

### 1.1 Face grouping + coaxial detection (surface-based)

The dominant strategy is **surface-based rather than parametric-loop-based** — a
key design decision. Recognizing a hole by searching for *circular loops* in UV space
is fragile: modelers may replace a clean circle edge with a spline, circle-fitting
introduces approximation error, and intersecting a hole into a curved tube produces a
**Steinmetz curve**, not a circle. In contrast, analytic surfaces of the *cutting
tool* are left intact by the solid modeler — a cylindrical drill leaves a true
cylindrical face, a taper leaves a true conical face.

**Two-stage surface grouping (Analysis Situs):**

1. **Stage 1 — group isolated hole-like faces.** Collect faces with the required
   symmetry: *coaxial cylinders* (simple + counterbored) or *coaxial cone+cylinder*
   (countersunk).
2. **Stage 2 — match against a pattern dictionary.** Each hole pattern defines face
   labels (`sinkFaces`, `holeFaces`, `boreFaces`) and a `blind: true/false` flag. The
   recognizer derives the pattern's AAG and matches it against the model's AAG.
   Sub-features extracted: **bores** (primary cylindrical sections; a hole may have
   several bores of the same diameter separated topologically), **bottom** (terminating
   surface: flat or conical drill-point), **countersinks** (conical recess at the
   mouth), **counterbores** (cylindrical recess at the mouth), **modeled threads**.

> **Kernel gotcha (ACIS-family):** the kernel internally represents each cylindrical
> surface of a simple/stepped hole as **two half-cylindrical faces**. Any recognizer
> must merge face-pairs on the same analytic surface before classifying. OCP/OCCT
> does *not* split cylinders this aggressively, but this is a classic porting trap.

### 1.2 Inward vs outward-normal discrimination (hole vs boss/shaft)

The single most load-bearing primitive for cylinder faces. For an internal (hole)
face the surface normals point **toward** the cylinder axis; for an external (boss)
face they point **away**.

```
function classify_cylinder_face(cyl_face, cyl_origin, cyl_axis):
    p   = point_on_face(cyl_face)                # e.g. midpoint in (u,v)
    n   = face_normal_at(p)
    r   = p − cyl_origin                          # radial vector
    dot = n · r
    if dot < 0:  return HOLE    # normal opposes radial → points at axis (inward)
    if dot > 0:  return BOSS    # normal aligns with radial → points away
    (dot ≈ 0 impossible for a non-degenerate cylinder: normal ⊥ axis)
```

Equivalently: compute the angle between the normal and the axis-to-point vector; angle
< 90° ⇒ hole, > 90° ⇒ boss. `cad_reverse` records this exact intuition as its
**Issue #3 inward-normal gate** (`outward_normal · radial < 0` rejects outer
shaft/boss/fillet cylinders). The value of this gate is that it needs **no planar
adjacent faces** — it works on an isolated cylinder, which is exactly what makes the
blend-masked AAG hole recognizer robust where a loop-based approach would fail.

> **Bosses on a pad** are the mirror image: an outer cylinder in the same axis whose
> normal points outward. Hole vs. boss is *not* a topological fact — it is a normal
> orientation fact, so it must be resolved per-face before any grouping.

### 1.3 Edge-loop / edge-chain classification (through / blind)

Lai & Song's loop-based face-composition approach (injection-mold B-Rep models):

- A hole = **base + side + bottom** faces. Base face carries the entry loop; side
  face(s) carry the wall; bottom face carries the terminus.
- **Through vs. blind via edge convexity between side and bottom:**
  - if *all* edges between side and bottom faces are **convex** ⇒ material passes
    fully through ⇒ **THROUGH**;
  - if *all* those edges are **concave** ⇒ a floor exists ⇒ **BLIND**.
- Coaxial groupings detected both within one model and across models (for mold
  cooling lines).

This concreteness maps directly to hole.py's through/blind/cbore/csk reason codes.
The discriminating signal — the sign (convex vs concave) of the side→bottom edge — is
available from the dihedral-angle test in §3.3.

### 1.4 Edge Boundary Classification (EBC)

Classifies **spatial addressability** of test points against the solid:

| Test-point pattern | Meaning |
|--------------------|---------|
| `(1,1,1)` all offobject | **Through hole** |
| `(1,2,1)` or `(2,1,1)` one onobject | **Blind hole** |
| `(2,2,1)` | **Under-cut** |
| `(2,2,3)` or `(2,3,3)` | **Boss** |

Implementation pro-tip from the literature: handle through holes with a **walkaround
loop** so they are not double-counted once from each mouth. EBC is appealing because
it needs only point-in-solid queries + face adjacency — both trivially available in
OCP (`BRepExtrema` / `BRepClass3d`).

### 1.5 Commercial / build123d feature grouping

- **Siemens "Recognize Holes"** clusters hole candidates by: equal diameter + finite
  depth; equal-diameter through-next; counterbore face topology with equal diameters /
  depths; similar tapered + countersink face structures.
- **Python `build123d-drafting-helpers` `find_holes(part)`**: coaxial internal
  cylinders group into **one `HoleFeature` per drilled hole** (drill + counterbore +
  spotface coalesce). Bottom classified as **through / flat / drill-point** by probing
  adjacent faces; entry chamfers and countersinks recognized as openings.

**Chain-based classification (pseudocode) — recommended for hole.py:**
```
def holes_from_cylinders(cylinder_faces):
    # 1. partition cylinders by co-linearity of axis (+ near-equal radius → merge
    #    ACIS half-cylinders)
    chains = group_by(coaxial, cylinder_faces)          # sets ordered along the axis
    for chain in chains:
        sort_by(axial_position, chain)
        top    = face with normal opposing entry direction (inward-normal gate)
        if any_barrel(bottom_exists):
            if bottom is cylindrical with same axis → BORE/STEPPED
            if bottom is conical vertex-down        → CSK  (countersink)
            if bottom is flat + a recessed cylinder → CBORE
            if bottom is flat/closed bottom         → BLIND
        else:
            THROUGH
    # produce HoleParams{depth, dia_sequence[(dia, len)...], top_type, bottom_type}
```

---

## 2. Pocket / pad (boss) recognition

### 2.1 Floor/wall classification

Core distinction is **geometric**, not topological:

- **Floor (base) face:** a planar face roughly perpendicular to the machining/extrusion
  axis — the bottom of a pocket.
- **Wall face:** a planar or ruled face roughly parallel to that axis — a pocket side.

`cad_reverse` refines this: the *base feature* is the largest **unclaimed planar**
face with a +Z tie-break, and the stock profile is the largest planar profile
extruded along the dominant axis. The key robustness addition is the **coverage guard**
`F.area ≥ 0.6 × S.area` in the pocket recognizer — a purely area-based guard that the
literature matches with *normals*: a wall face must be (a) adjacent to the floor and
(b) oriented such that its outward normal points into the pocket.

### 2.2 Wall grouping + closed/open discrimination

After classifying floor vs wall, group walls that (a) are adjacent to a common floor
and (b) form a **closed loop** around it. The open/closed distinction is the classic
AAG graph-count test:

- **Closed pocket:** base face + side faces forming a full cycle; edges between wall
  faces are concave. In AAG terms (from Li et al.): after removing inner-loop edges of
  the base face, a closed pocket subgraph has **A = 2N − 2** (Euler-tour-like: every
  internal node degree 2, cycle).
- **Open pocket:** "a pocket having many openings" — a base face exists, side faces are
  adjacent to the base (or base fillet faces) but the wall loop breaches the part
  boundary. It is open to the exterior, so the wall arc count is *short* of a full
  cycle. Recognition depends on detecting **boundary edges** (edges on the part's
  outer boundary, convex against the exterior) and treating the breached side as an
  opening rather than rejecting the shape.
- **Through pocket (no floor):** AAG has **A = 2N − 3**, all internal node degrees
  **D = 2**.
- **Slot (a degenerate belt of parallel walls):** **A = 2N − 4**, max degree
  **Dmax = 2** — two nodes of degree 1, the rest degree 2, forming an **open loop**
  (see §4).

These exact arithmetic tests (relating arcs A and nodes N) are cheap, deterministic
and directly implementable on the `cad_reverse` AAG.

### 2.3 Island handling

Islands (a pad sitting inside a pocket floor) are detected via **inner loops**: the
raised feature appears as an inner boundary loop on the floor face.

```
pocket_floor.outer_wire → walk walls around it → pocket
for inner_wire in pocket_floor.inner_wires:
    island = faces growing inward from inner_wire
    if island is raised above floor → pad/figeature (separate PadParams)
    walls of island processed as a *new* pocket-group (its own floor = island top)
```

The hard part (per the review of Vandenbrande/Requicha hints) is the **pad-pair
ambiguity**: an island can be read as (a) a pad on a pocket floor, or (b) a boss the
pocket wraps around. This is a genuine interpretation fork, not a bug — it is exactly
why the `cad_reverse` Known-Gaps table lists "boss shape (Ø16×6): spurious pocket +
pad-pair ambiguity." The fix is a disambiguation rule: prefer the interpretation whose
floor has the largest unclaimed planar area, or prefer pad-over-pocket when the island
normals point toward the pocket mouth.

### 2.4 Base-explicit vs base-less features (Sunil et al. 2010)

For prismatic parts, distinguish **Base Explicit Feature Graphs (BEFG)** (pockets,
blind slots — have a planar base face) from **No-base Explicit Feature Graphs (NEFG)**
(passages, conical-bottom features — no planar base). This single axis disambiguates
"through pocket" from "through hole" and "blind slot" from "pocket". The graph
structure is **radial** (one central floor node connected to each wall) vs **serial**
(a chain of walls). `cad_reverse`'s `PocketParams.normal` + base-face-key fields are
the payload this distinction needs.

---

## 3. Fillet and chamfer recognition

### 3.1 Blend-face detection via spring/cross edges (Ferrandes)

The mature curvature-based method classifies **each edge** by curvature both *along*
and *perpendicular* to it, on both adjacent faces:

- **Cross edge:** curvature along the edge is essentially equal on both faces (the edge
  crosses a continuous region).
- **Spring edge:** the candidate *blend* face has high curvature in the direction
  normal to the edge, while the adjacent face's curvature there is much lower — the
  blend "springs" off its neighbor.

A face is a **fillet candidate** iff it has **two cross edges and two spring edges**,
plus checks that the adjacent faces at the spring edges do not meet at 0° or 180°.
Constant-radius fillets additionally pass a **ratio threshold** (spring-edge
curvature >> cross-edge curvature ⇒ one dominant dimension).

```
function is_blend_face(f):
    count_cross  = edges where along-curvature(f) ≈ along-curvature(neighbor)
    count_spring = edges where normal-curvature(f) > k * normal-curvature(neighbor)
    return (count_cross == 2 and count_spring == 2) or corner_case(f)

corner_case(f):    # three cross + one spring
    # torus corner (one concave + one convex edge converging at a vertex);
    # or revolution/cylindrical corner
```

`cad_reverse` implements an AAG-level blend mask (smooth-arc suppression) rather than
a full spring-edge walk; the curvature tool is available because OCP exposes
`BRepGProp`-style surface curvature at a point. The mask is the lightweight cousin of
the Ferrandes test and is adequate for constant-radius fillets.

### 3.2 Graph pattern matching (constant radius) — chamfer & round

Graph pattern of a **chamfer** (from the 2003 SMI secondary-feature paper):

- **Planar–conical chamfer:** `planar —edge— conical —edge— cylindrical`, with
  *coaxiality* of the conical and cylindrical faces and *perpendicularity* of the
  planar face to the shared axis.
- **Planar–planar chamfer:** `planar —edge— planar —edge— planar`, first and last faces
  normal to each other, optionally enforcing a 45° condition.

Graph pattern of a **round/fillet**:

- Convex round: `planar —tangent— torus —tangent— cylindrical/conical`, or
  `planar —tangent— cylindrical —tangent— planar`.
- Concave fillet: `planar —tangent— cylindrical —tangent— planar`, or
  `cylindrical —tangent— torus —tangent— cylindrical/conical` with coaxiality on the
  end faces.

Both are limited to **constant radius** and filtered by dimensional analysis (relative
and absolute thresholds on the minimal circumscribing circle radius) to separate true
secondary features from coincidental geometry. **Variable-radius / free-form fillets
remain largely unsolved** — out of `cad_reverse` v1 scope by design, and a documented
limitation even in the research literature.

### 3.3 Chamfer vs fillet — the convex/concave basis

The essential discriminator is the sign of the dihedral angle between the two blended
faces:

```
for adjacent faces f1, f2 sharing edge e:
    # orient normal so f1 is to the left of e
    v = e_direction × f1.normal
    dot = v · f2.normal
    interior = f1.normal · (centroid(f2) − at_point(f1 at e))
    θ = signed interior dihedral
    if θ in (0, π):   edge = CONCAVE   →  blend is a FILlet   (cove/alley)
    if θ in (π, 2π):  edge = CONVEX    →  blend is a ROUND    (convex fillet)
```

**Fillet geometry corollary:** a concave blend on a shaft edge is a **torus**; a convex
blend on an external edge is also a **torus** (different concavity). Both are tori —
only the dihedral sign distinguishes them. A **chamfer** replaces the blend surface
with a **planar or conical** face and so is *not* a torus at all. Therefore the
first-order classifier is *surface type* (torus → fillet/round; plane/con → chamfer),
and the second-order classifier is *dihedral sign* (which sub-type).

---

## 4. Slot recognition (and the slot-vs-fillet problem)

### 4.1 Elongated-hole / slot detection

Two distinct notions in the literature:

1. **Slot as a trough** (machined groove with a floor): a degenerate pocket — belt of
   parallel walls with a floor, open at both ends. AAG test: **A = 2N − 4, Dmax = 2**
   (an open loop, two degree-1 nodes). Open-top and open-ended handled via boundary
   edges. `cad_reverse`'s `PocketParams.type == SLOT` is this notion.
2. **Slot as an elongated hole / rounded slot** (a closed slot — a closed elongated
   loop bounded by two arcs + two straights, or a stadium profile).

### 4.2 The *known* problem — distinguishing a slot-end cylinder from a fillet

Open-source rule recognizers (and `cad_reverse` issue #4) hit this exactly: a slot's
**end cylinder** (the rounded cap of an elongated closed slot) presents as "two smooth
arcs to two parallel flat walls" — *indistinguishable by blend-face analysis alone*
from a true fillet rounding an edge.

Working solution (empirical, from `cad_reverse` issue #4 — this is worth restating
precisely because it generalizes):

> **Do NOT exclude blend faces at the wall stage.** A true fillet's cylinder is
> bounded by wall faces that bend around it and terminate at caps; it never maps to a
> *small parallel far-cap*. A slot-end cylinder is bounded by walls that run **parallel
> and straight past** it to a distant cap. So:
> - keep blend faces during wall grouping (slot-end cylinders are legitimately walls);
> - exclude them only at the **cap stage**;
> - a "fillet" is rejected because its cylinder has no small parallel far-cap;
> - a "slot end" is accepted because its cylinder does have one.

Verified empirically: filleted box → `[]` (no false slot), while a genuine slot
survives. The generalization is: **the cap, not the blend wall, is what discriminates
slot-ends from fillets.** This is a clean, deterministic, reason-coded rule and is the
single best shield against the classic "concave cylinder with no cap" false positive
that also plagues hole recognition (`UNMATCHED_CONCAVE_CYLINDER_NO_CAP`).

### 4.3 Slot vs step / vs pocket

- **Slot vs step:** both are open external depressions; the literature breaks the tie
  with **visibility maps** (whether the feature is visible/accessible from the top) and
  with the wall loop (slot has two parallel walls + a floor; a step has a single wall).
- **T-slots / dovetail slots:** standard features with characteristic multi-face
  patterns plus an open-top tool-access test; typically treated as *standard* features
  in a template library (they are also the canonical example of non-convex swept
  features handled by volume decomposition, §7).

---

## 5. Attributed Adjacency Graph (AAG) — the classic and its extensions

### 5.1 Joshi & Chang (1988) — the foundational formulation

Given B-Rep solid **B = (V, E, F)** (vertices / edges / faces), the AAG is the
undirected graph **G = (N, A, T)** where:

- **N** — one node per face (|N| = |F|);
- **A** — one arc per edge, connecting the nodes of the two faces sharing that edge;
- **T** — an attribute on each arc: **1 = convex** dihedral, **0 = concave** dihedral.

**The recognition heuristic (forward-chaining):**

```
repeat:
    find a node whose every incident arc has attribute 1 (all-convex neighbor)
    delete it (it cannot belong to a machined depression feature)
until no such node remains -> leaves a forest of CONCAVE SUBGRAPHS
match each concave subgraph against the feature-template library
```

Recognized features: **pockets, slots, steps, blind steps, blind slots, polyhedral
holes.** Candidate arcs tie-break by simple back-chaining. This is the seed of every
AAG recognizer — including `cad_reverse`'s `aag.py`.

**Documented limitations of the original:**
1. Restricted to **negative, polyhedral** features — cannot handle curved faces;
2. Cannot extract **boundary faces** (only basic internal faces);
3. Hard fails on **interacting features** — an interaction severs an arc, which then
   must be restored (§8).

### 5.2 Modern extension taxonomy

| Extension | Additions over AAG | Purpose |
|-----------|-------------------|---------|
| **EAAG** (Extended AAG) | neighbor relations + face/edge type attributes (cylindrical, conical, planar) | handle curved surfaces, improve discriminative power |
| **MAAG** (Multi-attributed) | richer arc attributes (e.g., "2" for a 270° concave angle) | finer discrimination on curved + blended parts |
| **ICG** (Implicit Concave Graph) | restores missing arcs across interactions | interacting features |
| **MCSG** (Gao & Shah) | repeated decomposition of the EAAG into minimal subgraphs used as hints; missed links restored by geometric reasoning | scaling to interacting features |
| **Face–Edge AAG + VF2** | template library matched by VF2 subgraph isomorphism | automated, non-rule template recognition (notches, etc.) |
| **BRepNet / AAGNet (DNN)** | learned node embeddings on the face-adjacency graph | deep-learning recognition (out of scope for deterministic v1) |

**Arc-extraction by edge type:** OCCT/OCP distinguish smooth edges (faces tangent
along the edge) from sharp edges. The AAG must decide the convexity label:
- sharp edge → binary convex/concave by the dihedral test (§3.3);
- smooth edge → transition; options are (a) mark as "smooth" and optionally give it
  zero-weight, or (b) fold smooth-blend geometry into the mask. `cad_reverse`'s blend
  mask is choice (b): smooth edges that join a cylindrical blend to planar neighbors
  are suppressed in the concave-view used by the hole/pocket recognizers.

---

## 6. Hint-based feature recognition (Vandenbrande & Requicha 1993)

**Motivation:** when features intersect, their full geometric pattern is fragmented;
exact subgraph/template matching fails. Define a **hint = the minimal indispensable
portion of a feature's boundary that must survive interaction**:

- a cylindrical face ⇒ hint for a **hole**;
- a pair of parallel, mutually-facing planar faces ⇒ hint for a **slot**;
- hints may also come from nominal geometry, tolerances, design features.

**Generate-and-test (blackboard) pipeline:**

```
1. HINT GENERATION: OPS-5 production rules scan B-Rep, post candidate hints
2. HINT ASSESSMENT: classify promising / unpromising / rejected
3. FEATURE COMPLETION: for promising hints, geometrically grow the LARGEST volume
   compatible with the data — extend into missing regions WITHOUT intruding into the
   part (computational-geometry completion)
4. FEATURE VERIFICATION: check part-intrusion, presence, tool accessibility, and
   dimension validity
```

**The interaction innovation:** completed features are split into the **required**
portion (the minimal volume the tool must sweep — faces belong to it unconditionally)
and **optional** portions (regions shared with another interacting feature). A face may
therefore belong to multiple features — this is how the method avoids the arc-severing
problem of pure AAG.

- **Implementation:** Object-Oriented Feature Finder (**OOFF**), PADL-2 solid modeler,
  KnowledgeCraft AI environment.
- **Refinement:** Han & Requicha's **Incremental Feature Finder (IF²)** relaxes hint
  requirements and adds heuristic ranking to cut redundant hints.
- **Limitations:** OOFF's floorless-pocket definition over-restrictive; needs a new
  completion algorithm per feature class; hint redundancy costs; mostly 2.5-D swept
  features.

**Relevance to `cad_reverse`:** the current reason-code architecture (`match/no-match +
string codes`) is already hint-flavored. A future robustifying step would add the
"grow the completion, verify no part-intrusion" phase before accepting a hole/pocket —
which would directly address the spurious-pocket-on-hole-floor failures (the pockets
get *grown, then rejected* because completion intrudes, instead of being matched
blindly). Note the built-in guard `F.area ≥ 0.6 × S.area` is a weak cousin of this.

---

## 7. Volume decomposition / delta volume

**Delta volume** DV = **SV − PV** (stock volume minus part volume), the regularized
Boolean difference. Feature recognition = decompose DV into machinable sub-volumes.

| Method | Distribution | Idea | Failure mode |
|--------|--------------|------|--------------|
| **Maximal Convex Cell (MCC)** (Sakurai 1995) | polyhedral | intersect DV with the half-spaces of faces having concave edges → maximal convex cells; match cells to features; generate multiple interpretations by subtraction order | up to **N! interpretations**; mitigated by generating a machining sequence directly (largest-cutter-first heuristic) |
| **ASV / ASVP** | polyhedral→curved | recursively take convex hull and subtract; partition delta volume at non-supportable vertices to force convergence | plain ASV can diverge on non-supportable vertices; ASVP fixes via partitioning |
| **Cell-based max-volume** | curved | extend faces/half-spaces → minimal cells → reconstitute maximal (possibly concave, one-op-machinable) volumes; Woo & Sakurai bisect until ≤16 faces; localized face extension + seed cells reduce interpretations | exponential cells; hard on freeform faces |
| **Wrap-around decomposition** | polyhedral | imitate wrapping the object in plastic → convex inner loops → decompose concave volumes | curvature limits |

- **MRSEV (Material Removal Shape Element Volume)** — NIST: traverse DV geometry to
  instantiate MRSEV features (holes, pockets, edge-flats, edge-rounds), verify tool
  accessibility, and use **profile offsetting** for tool-size constraints (pockets with
  convex corners a milling tool cannot reach).
- **Roughing vs finishing** splits DV into **SDVR** (sub-delta for roughing — from the
  projected face out to the stock plane) and **SDVF** (sub-delta for finishing — a
  preset uniform near-net thickness off recognized faces).
- **IdentifyMachiningPrimitives** (Nagaraj & Gurumoorthy): find outermost faces via
  bounding box → locate innermost cavity → fill with primitive volumes (cylindrical /
  cuboid / wedge) → the **inverse order of filling is a feasible machining sequence**.

**Bottom line for `cad_reverse`:** `cad_reverse` is *not* a volume-decomposition
project (it is surface/graph recognition), but DV reasoning is what stock.py
approximates (largest planar profile extruded = the stock). Where DV shines — handling
interacting features and producing machining precedence — is a known future domain;
the factorial-interpretation explosion is why `cad_reverse` deliberately stayed on
deterministic surface recognition.

---

## 8. Interacting / intersecting features — the central problem

Every family lists interaction handling as *the* challenge. Gao & Shah catalogue the
topology disruptions into **six interaction categories** and two types:

- **Adjacent interactions** — features share a boundary but not a machining volume
  (nested features, side-sharing). Cause face merging / inner loops; topology not
  destroyed; usually a single interpretation.
- **Volumetric interactions** — features share machining volume. Cause face merging,
  face splitting, loss of concave edges; yield **multiple interpretations**.

### 8.1 Fix-by-restoration: virtual links

- **Virtual Link (VL) generation** restores adjacency broken by interaction. Four VL
  types:
  - (a) face-extension ∩ another face;
  - (b) coplanar face extensions intersecting each other;
  - (c) faces split by a virtual edge;
  - (d) faces adjacent to a fillet.
  Generated by **exact geometric computation** (Trika & Kashyap).
- **Unifiable faces:** coplanar face sets mergeable (reverse of splitting) without
  intersecting other faces.

### 8.2 Virtual topology operations (2020 JCDE)

Operate purely topologically, geometry untouched:

- **Virtual splitting:** where multiple feature boundaries merged into one face, add a
  *virtual edge* connecting feature vertices to partition the merged face, restoring
  original feature topology (both protrusion- and depression-modelling cases).
- **Virtual merge:** where feature boundaries are removed, drop invalid boundaries,
  extend dangling edges to close unclosed faces, and merge split faces into one virtual
  superset face.
- **Feature Vertex Adjacent Graphs (FVAGs)** — use *vertices* (not faces) as the
  primary graph nodes; build concave/convex FVAGs and search for **Boolean Segmentation
  Loops (BSLs)** that partition model boundaries into feature regions. Vertex-centric
  graphs sidestep the face-merging pathology directly.

### 8.3 Why `cad_reverse` still reports PARTIAL rather than crashing

The pipeline's honesty is a best-practice: interacting features get the *documented*
recognizer gap rather than a wrong answer. The catalogued fix path is: (1) tighten the
pocket coverage guard / exclude hole-floor and hole-wall faces outright (§2.4), and
(2) optionally add a lightweight "grow & verify no-intrusion" pass (§6). Both are
exact-geometry additions on top of the existing AAG — no new theory needed.

---

## 9. Step-based recognition (machining roughing/finishing steps)

("Step" here = machining step, *not* the STEP file format.)

- Delta-volume decomposition naturally yields machining steps: rough volume is removed
  first by large tool, finishing (near-net) volume last by finishing tool. The
  **IdentifyMachiningPrimitives** inverse-fill order produces the operation sequence.
- Heuristics mirror human planning: select **largest cutter first**, machine in
  **descending projected-area** order, per-face **access-direction** analysis.
- For `cad_reverse`, machining-step semantics are not a deliverable (it reconstructs
  **design** features, not CAM ops). Still, the deterministic ordering in `order.py`
  (through-before-blind, boss-before-pocket, fillets last) reuses the same dependency
  logic — machining precedence ≅ feature-build ordering reversed.

---

## 10. Subgraph isomorphism for template matching

**Template matching = find subgraph of the model's AAG isomorphic to a feature-template
graph.**

### 10.1 The classic algorithm: VF2 (Cordella et al. 1999 / 2004)

To match a pattern graph P against a base graph G, VF2 does a depth-first state-space
search keeping an explicit **core/set + in/out frontier** per state; at each step it
generates a candidate pair from the frontier, then validates it with:

- **Syntactic check:** the candidate preserves predecessor/successor relations already
  in the core (feasibility of the mapping w.r.t. edges);
- **Semantic check:** node/edge **weight/attribute compatibility** (e.g., in CAD: face
  type, convexity attribute, radius tolerance).

`procedural VF2 match(P, G):`
```
state = empty mapping, core={}, frontier all
match(state):
    if core covers all of P: yield mapping; return
    candidates = successor_set(P) × successor_set(G)      # frontier nodes
    for (np, ng) in candidates:
        if syntactic_feasible(state, np, ng) and semantic_feasible(state, np, ng):
            extend state; match(state); backtrack
```

**CAD-relevant feasibility:** the *semantic* check is where geometry enters — a
template "cylinder" node only matches a base node whose face is cylindrical within a
radius tolerance; a "concave arc" template only matches a concave arc. This is
precisely the attributed-matching `cad_reverse` does with its `__eq__`/identity map
but through OCP geometry rather than a formal subgraph solver.

### 10.2 MCF-improved VF2 (2026, notch recognition)

Recent CAD paper (Guo et al., J. Nanjing Univ. Aeronautics & Astronautics 2026)
combines **face-edge AAG + template library + improved VF2** for sealed-cavity-notch
recognition. Two efficiency tricks:
- **node-constraint mechanism** — restrict the candidate pair set ahead of the search;
- **heuristic ordering** — process frontier nodes in a promising order.

Both prune the state-space explosion that otherwise makes subgraph isomorphism
intractable on large B-Rep graphs. This is the "match templates via a purpose-built
matcher instead of hand-rolled rules" direction, and it is a clean upgrade path from
`cad_reverse`'s per-recognizer rules to a declarative template library.

### 10.3 Ready-made library support

| Library | Function / semantics |
|---------|-----------------------|
| **R igraph** | `subgraph_isomorphisms(method="vf2" | "lad")`; VF2 supports vertex+edge colors and stop-callbacks; LAD supports domain restrictions and induced-subgraph options |
| **Rust `graphfind-rs`** | VF-family with node/edge weights as matcher conditions; supports "hidden" subgraph elements and set-semantics results |
| **Python `buildingmotif`** | VF2 template matcher with a `get_semantic_feasibility` hook (class admissibility) — the semantic-check pattern transfers directly to CAD face-type admissibility |
| **Analysis Situs** | C++ AAG + isomorphism matcher used to tell countersunk / counterbored / simple holes apart |

For Python work, `networkx` exposes `is_subgraph_isomorphic` (VF2 backend) and
`VF2GraphMatcher` — directly usable to validate a template-matching recognizer before
committing to a more tailored solver.

---

## Feature-type → detection-strategy map

| Feature | Primary detection signal | Robust discriminators | Known failure modes |
|---------|--------------------------|-----------------------|---------------------|
| **Simple hole (through)** | coaxial cylinder(s); no bottom | inward-normal gate; side→bottom edges all convex | double-count from two mouths; Steinmetz curves on curved parts |
| **Blind hole** | cylinder + flat/conical bottom | side→bottom edges concave; floor normal || axis | drill-point cone vs true cone ambiguity |
| **Counterbore / counterdrill** | coaxial cylinder pair (2 radii) | axis co-linearity + radius ordering + entry position | half-cylinder kernel splits; bore-of-same-dia dedup |
| **Countersink** | coaxial cone + cylinder | cone apex toward axis; matching 82/90/100° standard | variable-angle (non-standard) sinks |
| **Pocket (closed)** | planar floor + closed wall loop | A=2N−2; edge concavity; floor normal || machining axis | open/closed misclass at part boundary |
| **Pocket (open)** | floor + partial wall loop breaching boundary | boundary-edge detection; A<2N−2 | breach detection under tangency |
| **Through pocket / passage** | wall loop, no floor | A=2N−3, D=2 | versus through-hole (base-face absence) |
| **Pad / boss** | outer cylinder/planar protrusion | outward normal; inner loop on hosting face | pad-pair ambiguity with island-in-pocket |
| **Island feature** | inner loop on a pocket floor | inward-rising normals | occupies both pocket-floor and pad feature graphs |
| **Slot (trough)** | two parallel walls + floor, open ends | A=2N−4, Dmax=2; visibility from top | vs step (single wall) |
| **Slot (elongated/closed)** | arc+straight closed loop | cap-based test, not blend-based | **vs fillet — the cap/parallel-far-cap rule (issue #4)** |
| **Fillet (concave)** | torus face, tangent edges | dihedral concave; 2 cross + 2 spring edges; constant radius | variable-radius; tangency lost to tolerance |
| **Round (convex)** | torus face, tangent edges | dihedral convex | shared-torus geometry with fillet (sign only) |
| **Chamfer** | planar/conical face between two faces | not-a-torus surface type; coaxiality of con/cyl neighbors | 45° hard-coded vs measured angle |

---

## Key Takeaways

1. **The hole/boss gate is normal direction, not topology.** `outward_normal · radial < 0`
   ⇒ hole; > 0 ⇒ boss — and it works on an *isolated* cylinder with no planar neighbors.
   This is the single most robust primitive and is already the Issue #3 backbone.

2. **Prefer surface-based over loop-based recognition.** Analytic faces of the tool
   (cylinder/con/plane) survive model export intact; circular loops get replaced by
   splines or Steinmetz curves under intersection. `cad_reverse`'s use of
   `BRepTools.OuterWire_s` for loops is fine for *base profiles* but should not be the
   basis for hole/cylinder detection.

3. **The slot-vs-fillet discrimination belongs at the cap, not the blend wall.** A
   true fillet cylinder never has a small parallel far-cap; a slot-end cylinder does.
   The issue-#4 rule ("keep blends at wall stage, exclude at cap stage") is the correct
   general principle and the best-known fix for the classic
   `UNMATCHED_CONCAVE_CYLINDER_NO_CAP` / slot-or-fillet confusion.

4. **Concrete AAG graph-count tests are cheap and deterministic and belong in the
   codebase.** Closed pocket A=2N−2 (cycle), through pocket A=2N−3 / D=2, slot/loop
   A=2N−4 / Dmax=2. These give reason codes like `POCKET_CLOSED` / `POCKET_THROUGH` /
   `SLOT_OPEN_LOOP` with essentially zero geometric cost.

5. **Coverage guards are a weak proxy.** The current `F.area ≥ 0.6 × S.area` pocket
   guard is the documented suspect in 5/6 PARTIAL fixtures. The literature-backed
   replacement is a **normals-based wall test** plus (optionally) a hint-style
   "grow the feature, verify it does not intrude into the part" rejection pass.

6. **Interacting features are the true frontier.** Pure AAG severs arcs on interaction;
   the recipe is virtual links (4 canonical types), unifiable faces, virtual
   splitting/merging, or vertex-centric FVAG/BSL graphs. For v1, reporting PARTIAL
   (as the pipeline does) is the correct engineering choice over silent wrong matches.

7. **Volume decomposition buys machining semantics at combinatorial cost** (up to N!
   interpretations). It is the natural future direction for *interaction* robustness
   and *machining-precedence* output, but it is not how `cad_reverse` should fix its
   current recognizers.

8. **VF2 subgraph isomorphism with a semantic feasibility hook is the declarative
   upgrade path.** Every feature template becomes a small attributed graph; VF2
   (via `networkx`/igraph/Rust) matches it against the model AAG with node/edge
   attributes as admissibility predicates. This converts the hand-rolled per-recognizer
   rules into a template library and is far easier to extend than bespoke recognizers.

9. **Constant-radius fillets are tractable; variable-radius/free-form are not.**
   Every published fillet method assumes constant radius and tangency. `cad_reverse`'s
   v1 out-of-scope list (variable fillets, NURBS) matches the field's actual ceiling.

10. **Verification must be the gold gate, not recognition.** The literature (and the
   OMS/reason-code philosophy) agrees: a feature is accepted only after *symdiff /
   no-intrusion / accessibility* checks pass. `cad_reverse`'s `symdiff < 0.001` gate
   for table-B fixtures is exactly right; extending a cheap no-intrusion test to
   PARTIAL cases is the smallest high-value next step.

---

## References

**Foundational / graph-based**
- Joshi & Chang, "Graph-based heuristics for recognition of machined features from a 3D solid model," *Computer-Aided Design* 20(2):58–66, 1988 (DOI 10.1016/0010-4485(88)90050-4). Introduces the AAG.
- Cordella, Foggia, Sansone, Vento, "A (Sub)Graph Isomorphism Algorithm for Matching Large Graphs," *IEEE TPAMI* 26(10), 2004 (DOI 10.1109/TPAMI.2004.75). VF2.
- Gao & Shah, "Automatic recognition of interacting machining features based on minimal condition subgraph," *Computer-Aided Design* 30(9), 1998.
- Sunil, Agarwal, Pande, "An approach to recognize interacting features from B-Rep CAD models of prismatic machined parts using a hybrid (graph and rule based) technique," *Computers in Industry*, 2010 (DOI 10.1016/j.compind.2010.03.011).

**Hole / cylinder**
- Analysis Situs, "Recognize drilled holes" — https://www.analysissitus.org/features/features_recognize-drill-holes.html and drilled-holes recognition (surface-based, pattern JSON, blind flag).
- Lai & Song, "Automatic Hole Recognition and Classification for a Set of B-rep Models Representing an Injection Mold" — loop/edge-convexity through-vs-blind.
- Wang et al., "Recognition of cylindrical-based features using edge boundary technique for integrated manufacturing," *Robotics and CIM* 2004 (DOI 10.1016/j.rcim.2004.03.004). EBC table.
- codestack.net SOLIDWORKS API, "Determine if selected face is hole or boss" — https://www.codestack.net/solidworks-api/geometry/determine-hole-boss/ (normal-vs-axis rule).
- build123d-drafting-helpers (Python) — coaxial cylinder grouping, through/flat/drill-point bottom probing.

**Pocket / pad / slot**
- Li et al., "An Approach to Recognize Machining Features for In-Process Models by Using a Hybrid Graph and Rule-Based Method," *AMM* vol. 607 (A=2N−2/−3/−4 rules).
- Pratama & Media, "A rule-based approach with multi-level feature taxonomy for recognition of machining features from 3D solid models," *J. Phys. Conf. Ser.* 1450 (2020) 012128 (edge classification `Vextty`; visibility maps for slot vs step).

**Fillet / chamfer / blend**
- Ferrandes, PhD thesis (HAL theses.hal.science 580733) — spring/cross-edge curvature classification, toroidal/spherical/revolution corners.
- "An intermediate level representation scheme for secondary features recognition and B-rep model simplification," *Shape Modeling International* 2003 (chamfer/round graph patterns).
- Kataraki & Abu Mansor, "A Rule Based Method to Auto-recognize Fillet Features of B-Rep Mill Parts" (rule-based, regular + freeform).

**Hint-based**
- Vandenbrande & Requicha, "Spatial reasoning for the automatic recognition of machinable features in solid models," 1993; OOFF/OPS-5 blackboard, generate-and-test.
- Han & Requicha, Incremental Feature Finder (IF²), 1997.

**Volume decomposition / steps**
- Sakurai & Dave, "Volume decomposition and feature recognition," Part I (polyhedral, 1995) and Part II (curved objects, 1996), *Computer-Aided Design* (DOI 10.1016/0010-4485(95)00067-4).
- Kim & Kim, "Recognition of maximal features by volume decomposition," *Computer-Aided Design* 2001.
- Mascle, Lu, Maranzana — "Machining process planning using decomposition of delta volume."
- Nagaraj & Gurumoorthy — IdentifyMachiningPrimitives / PreFormedStock (SDVR/SDVF roughing-finishing).
- NIST MRSEV approach — tsapps.nist.gov/gov, pub 821984.
- Bok & Mansor, "Automatic extraction of machining primitives with respect to preformed stock for process planning."

**Interaction / virtual topology**
- Gao & Shah (1998) MCSG; Trika & Kashyap virtual links (4 types).
- "An approach to automatic boundary segmentation of solid models using virtual topology: toward reconstruction of design features," *J. Computational Design and Engineering* (2020), FVAG/BSL.
- Zhang, Chan, Chen, "A hybrid method for recognizing feature interactions," 1998.
- Pan et al., two-level deep-learning interaction recognition (2026) — multi-task classification + link prediction on Fusion 360 Segmentation dataset.

**Subgraph matching libraries**
- R igraph `subgraph_isomorphisms` — https://rdrr.io/cran/igraph/man/subgraph_isomorphisms.html.
- Rust `graphfind-rs` — https://docs.rs/graphfind-rs (VF2/VF-family).
- Python `networkx` `VF2GraphMatcher`.
- Guo et al., "Improved VF2 Algorithm for Notch Feature Recognition Based on MCF," *J. Nanjing Univ. Aeronautics & Astronautics* 58(1), 2026.

**Frameworks / tooling**
- Analysis Situs (open-source AAG + FR SDK on OCCT, BSD-3) — https://analysissitus.org/features/features_recognition-principles.html , features_convert-canonical.html, features_recognize-analytical.html.
- Palmetto (GitHub connorkapoor/Palmetto) — CAD DFM workbench built on Analysis Situs + AAG, LLM-assisted recognizers.
- Pointer-CAD (CVPR 2026) — pointer-based B-Rep selection for LLM CAD generation (fillet/chamfer entity selection).
