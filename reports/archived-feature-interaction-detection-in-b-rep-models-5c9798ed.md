---
{
  "format": 1,
  "metadata": {
    "id": "archived-feature-interaction-detection-in-b-rep-models-5c9798ed",
    "title": "Feature Interaction Detection in B-Rep Models",
    "question": "What findings, alternatives and limitations does the historical investigation document about Feature Interaction Detection in B-Rep Models?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Feature Interaction Detection in B-Rep Models. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Feature Interaction Detection in B-Rep Models; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:45.165Z"
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
  "sourceDigest": "5c9798ed655a9491a9dcac34c7e879816a7eaa5f97a1fdc8f011e496cb056bee",
  "proposalRevision": "beb3b73dc88d2ef580d765301c4210d62198fd8964a7356ad7f8c68fac7f8f4f"
}
---
# Feature Interaction Detection in B-Rep Models

**Reference compiled 2026-08-06** — deep web research on detecting, decomposing, and
reasoning about **interacting features** in B-Rep solid models. Companion to the
`cad_reverse` deterministic STEP→CadQuery pipeline (AAG in `aag.py`, recognizers in
`recognize/*`).

> Scope: the graph-theoretic signatures of interaction, interaction taxonomies
> (Vandenbrande & Requicha 1993; Gao & Shah 1998), the delta-volume approach,
> graph decomposition, virtual faces / virtual links, intersecting-vs-adjacent
> feature detection, "destroyed" (partially consumed) features, and modern deep-learning
> state of the art — plus a Recommendations section ranked for our AAG-only,
> no-history architecture.

---

## 1. The Core Problem: Why Interaction Breaks Our Recognizers

Feature recognition from B-Rep works by matching a **feature's expected graph pattern**
against the **part's graph**. An isolated hole, pocket, fillet, chamfer or pad has a
stable, well-defined AAG signature. When two features **interact** — a hole passes through
a pocket wall, a fillet rolls over a chamfered edge, a pad sits on a pocketed surface —
the interaction causes **topological variations** that alter or erase part of the
signature:

| Topology variation | Effect on the AAG | Consequence |
|--------------------|-------------------|-------------|
| **Face splitting** | one logical face becomes several faces → several nodes | template no longer matches; extra nodes |
| **Face merging** | two or more feature faces fuse → fewer nodes | signature spread across "other" faces |
| **Loss of concave/feature edges** | feature-defining arcs disappear | the hint that the feature exists is gone |
| **Loss of whole faces** | a face is machined away by a later feature | feature "destroyed", only partial evidence |

Because of these, **feature interaction is widely identified as the single most
challenging, still-unsolved problem in automatic feature recognition** (AFR). See
Sections 8–9 for the modern state of the art that still only reaches ~98–99% on
interacting benchmarks.

---

## 2. Graph-Theoretic Signatures of Interaction

**Q1 — How does the AAG change when a hole intersects a pocket?**

The foundational AAG (Joshi & Chang 1988 — see
`research/04_aag_graph_based_cad_analysis.md` §1) labels nodes as faces and arcs by
edge convexity (T=0 concave, T=1 convex). The original authors themselves noted the plain
AAG is **weak in discerning compound features and interaction conditions** (*Zhang, Chan &
Chen 1997*, *IJAMT*, DOI `10.1007/BF01179071`). The concrete signatures are:

1. **Concave-arc fragmentation.** A through-hole bored into a pocket floor creates a
   cylindrical wall whose concave arcs to the pocket floor exist only where the floor
   survives. The hole's arc-loop is interrupted by the pocket's extra faces.
2. **Two opposing rim arcs.** The classic slot/hole hint — a pair of **parallel opposing
   faces** — is partially exposed even after a pocket cuts into it, but only the surviving
   stubs remain. The "hint" (Section 4) is partial, not complete.
3. **A convex/concave boundary cliff.** Zhang, Chan & Chen observed that for **depression
   features** (pocket, hole, slot) a **convex edge** marks where one feature ends and the
   next begins; for **protrusions** (pad, boss) a **concave edge** plays the same role.
   So the *opposite* convexity arc can be read as an **interaction delimiter**.
4. **Completely missing arcs/nodes.** A feature that shares a face with a later feature
   loses the concave edge that would have hinted at its presence. Gao & Shah (1998) call
   these **lost concave edges** (their interaction class III/V, Section 5).
5. **Virtual, non-topological adjacency.** Two feature faces that are *topologically not
   adjacent* in the B-Rep may nonetheless be the **same logical face split by an
   intersection**. The graph cannot see this from raw adjacency alone; it must be
   *inferred* (this is the motivation for "virtual faces/links", Section 7).

**Key invariant:** an interacting feature almost never loses its **entire** signature.
What survives is called its **Minimal Condition SubGraph (MCSG)** — the maximal sub-graph
of the feature that remains in the part graph (Section 6). Every feature has **at least
one non-empty MCSG**; in the worst case of heavy interaction it degenerates to a single
face node (Gao & Shah 1998).

---

## 3. Interaction Types — Nesting, Intersection, Sharing, Parent-Child

**Q2 — What are the known interaction type categories?**

Two taxonomies dominate the literature, at different granularities.

### 3.1 Functional / classification taxonomy (Zhang, Chan & Chen 1997)

Based on how **reference "traces"** (feature connectivities) relate:

- **Simple condition** — a trace connects spatially *disjoint* simple features.
- **Compound condition** — a trace connected by *two or more adjacent* simple features.
- **Combined condition** — a trace connected by a *mix* of simple and compound features.

### 3.2 Topology-variation taxonomy (Gao & Shah 1998, CAD 30(9), DOI `10.1016/S0010-4485(98)00033-5`)

Gao & Shah define two volumetric features as **interacting if their boundaries intersect,
shared volumes intersect with non-empty common volume**, and classify into **six** types
from three independent boolean variations:

| # | Merged faces | Lost concave edge | Split faces |
|---|--------------|-------------------|-------------|
| I | No           | No                | No          |
| II| No           | No                | Yes         |
| III| No          | Yes               | No          |
| IV| Yes          | No                | No          |
| V | Yes          | Yes               | No          |
| VI| Yes          | No                | Yes         |

(Two of the 2³=8 combinations are impossible because "split face" and "lost concave edge"
cannot both be true on the same face.)

### 3.3 Conceptual relationship types (useful framing for our pipeline)

Mapping the literature concepts onto the relationship vocabulary in the brief:

- **Nesting / parent-child.** A feature whose faces lie entirely within another's boundary
  (e.g. a pocket cut into a larger pocket's floor; a hole whose axis lies inside a boss).
  Detected by *containment of face geometry / hole centers* within a recognized feature,
  not by the graph alone.
- **Intersection / partial penetration.** A hole passes *through* a pocket wall; a slot
  crosses a pocket. Detectable via **virtual faces** (Section 7) and via the hole's radial
  extent relative to the pocket wall thickness.
- **Sharing / merging.** Two features merge faces (Gao & Shah classes IV–VI) — e.g. a
  through-slot and a bounded pocket sharing a floor. Adjacent features grouped by *common
  properties* into **composite/United Machining Features (UMF)** (Gu et al. 2002).
- **Adjacency (no shared volume).** Two features touch along an edge but do not overlap.
  **Not actually an interaction** in Gao & Shah's sense (no shared volume) — our
  recognizers already handle these, and they should be *excluded* from interaction logic.

> **Recommendation-relevant takeaway:** "adjacent but non-overlapping" is NOT an
> interaction. Reserve interaction handling for **shared-volume** cases so we do not
> over-decompose what our current recognizers already get right.

---

## 4. Hint-Based Feature Recognition (Vandenbrande & Requicha 1993)

**Paper:** J.H. Vandenbrande and A.A.G. Requicha, *"Spatial Reasoning for the Automatic
Recognition of Machinable Features in Solid Models"*, IEEE TPAMI 15(12), 1269–1285, 1993.
DOI `10.1109/34.250845` (300+ citations).

This is the seminal answer to "how do we recognize a feature whose graph is partly
destroyed": **detect the remnants, then reconstruct the whole feature from them.**

### 4.1 The hint-based generate-and-test strategy

1. **Hint generation** — OPS-5 production rules scan the B-Rep for **partial evidence**
   of a feature. The canonical example: *a pair of parallel opposing faces is a hint that
   a slot may be present*, even if the other slot faces are gone. Hints come from nominal
   geometry plus tolerances, attributes (threads), and designer-specified features.
2. **Hint completion** — computational-geometry routines extend the surviving faces
   **volumetrically** to produce the **largest volumetric feature** compatible with the
   hint that does not **intrude into the desired part**.
3. **Verification** — check accessibility, intrusion, and machinability.
4. **Interaction segmenting** — each feature is split into **optional** and **required**
   volume portions; alternative decompositions may be generated until the total
   machining volume is fully decomposed.

### 4.2 What it means for us

The whole VI is fundamentally a **BRep→DSG (Destructive Solid Geometry) converter**: start
with stock, subtract volumetric features to reproduce the part. Feature *completion* is
the key idea for **destroyed features** — you infer the full feature from the surviving
hint and fill in the missing volume through the interaction. The output is CSG/DSG rather
than a CadQuery script, but the *"hint → reconstruct → verify no-intrusion"* loop maps
directly onto our `EdgeMidpoints`/identity-map + symdiff verification gate.

### 4.3 Documented limitations (critical for our feasibility judgment)

- Completion limited to **2.5-D swept** features.
- Face-segmentation for non-template features not addressed.
- Number of alternative decompositions not well controlled.
- Rules are **ad hoc and feature-class-specific** — new feature classes need new
  hint-generation + completion algorithms (a recurrent criticism in the surveys).

### 4.4 Han & Requicha extension (1996)

**Han, *"3D Geometric Reasoning Algorithms for Feature Recognition"* (1996)** and the
**IF² (Integrated Incremental Feature Finder)** system added **reasoning to rate and
prioritize hints**, reducing which hints to explore and in what order. IF² "behaves as a
feature recognizer when input is exclusively nominal geometry, or as an incremental
feature model converter when input is design features." Han also contributed
**modeler-independent procedural "adaptors"** (CG International '96) so the recognizer
runs across kernels. The efficiency lesson (prioritize hints) is directly reusable in our
**`order.py`** DAG.

---

## 5. The Delta-Volume Approach (Compare to Stock)

**Q3 — How does the delta-volume approach help detect interactions?**

### 5.1 Definition

**Delta volume** = the material to be removed = `stock − part`. It is the precise volume a
machining process must cut. Critically: **every machining feature must be fully contained
within the delta volume**, and the distinction from design features is that removable
material is bounded by stock faces, design features are not.

### 5.2 Why it's powerful for interactions

- **No hint ambiguity about containment.** Any candidate feature volume can be tested
  against the delta volume: if subtracting it does not cut outside the delta volume (i.e.,
  it does not intrude into the part), the candidate is **valid**. This is exactly the
  "no-intrusion" verification of Vandenbrande & Requicha, made concrete.
- **Volume decomposition.** The delta volume is decomposed into **maximal volumes** using
  half-spaces (Sakurai & Dave, *"Volume decomposition and feature recognition, Part II:
  Curved objects"*, CAD 1996, DOI `10.1016/0010-4485(95)00067-4`). Many maximal volumes are
  **readily recognizable as features by graph matching**; interacting features are then
  recognized by *combining* maximal volumes, and different combination/ordering gives
  **multiple feature interpretations**.
- **Modified-AAG / CACG approach (Gu et al., 2002, "Improved AAG based recognition of
  machining feature")** explicitly frames the graph problem in delta-volume terms: the
  delta volume of interacting features is represented by a **Concave Attachable Connected
  Graph (CACG)** and decomposed into isolated features as **Complete Concave Adjacency
  Graphs (CCAG)**, using **auxiliary faces (AF)** and **virtual links (VL)** to recover
  information lost to interaction.

### 5.3 Applicability to our pipeline — the critical caveat

**We do not currently have a stock shape as a first-class input in all fixtures.** Our
`recognize/stock.py` *infers* stock from the largest planar profile + extrusion height
(from OCP `OuterWire_s` + `WireExplorer`). But the **interaction-decomposition** power of
delta volume needs a genuine *raw stock solid to difference against*. Two implications:

1. Where a real stock solid exists (our `stock.py` can produce a box/polyline/circle
   prism), `stock − part = delta volume` is computable via OCP boolean cut, and we can do
   **maximal-volume decomposition** of *that* delta volume. This is a genuinely new,
   high-leverage capability — it lets a pocket that lost a wall to a hole be detected by
   cutting the delta volume, not by graph repair.
2. Where stock is only inferred (filleted box, L-bracket), the implied delta volume is
   still meaningful because our stock.py *is* the extrusion bounding the part. So the
   approach is available today for our box-family fixtures and becomes exact once stock is
   trusted.

---

## 6. Feature Graph Decomposition & the MCSG (Gao & Shah 1998)

**Q4 — What is "graph decomposition" — splitting the AAG at interaction boundaries?**

### 6.1 The layered graph stack

Gao & Shah's recognition engine uses a hierarchy of progressively **more concave** graphs:

- **AAG — Attributed Adjacency Graph** (nodes=facess, arcs=edges, convexity attr).
- **EAAG — Extended AAG**: adds five arc attributes (convexity, existence, loop, geometry,
  blend type) and five node attributes (source, convex hull, #loops, split status,
  geometry).
- **MFAG — Manufacturing Face Adjacency Graph**: connected sub-graph of EAAG with no
  stock/CH faces → **reduces search space** for depression features and for virtual
  link/search generation.
- **PCAG — Partly Concave Adjacency Graph**: concavely-connected sub-graph of MFAG (may
  contain some convex arcs).
- **CAG — Concave Adjacency Graph**: connected sub-graph of PCAG where *all* arcs concave.
- **MCSG — Minimal Condition SubGraph**: the **maximal sub-EAAG of a feature that remains
  in the part EAAG** after interactions.

### 6.2 Graph decomposition operationalizes the MCSG

Classical AAG decomposition (Joshi & Chang) deletes nodes surrounded **only by convex
arcs** to split the graph into feature sub-graphs — but this fails when a feature lost a
concave bounding edge to an interaction. Gao & Shah's MCSG motion fills the gap:

1. **Recognize isolated features first** with the MFAG (fast, unambiguous).
2. **Generate hints** (MCSGs) for the *remaining* interacting features **via graph
   decomposition**.
3. **Complete each MCSG** by adding **virtual links** (Section 7) that restore the lost
   concave edges.
4. Match the completed graph against the feature library, producing **one or more
   alternative interpretations** of the interacting region.

### 6.3 Properties that are engineering-useful

- Every feature has a non-empty MCSG; isolated feature MCSG = full EAAG.
- MCSGs of the same feature class differ by *how* it interacts — so a **test-based,
   escalating** recognizer (our D8 "per-feature escalation") can key off MCSG shape.
- **Type independence:** MCSG is defined *independently of feature type*, so all features
   are handled with **uniform procedures** — unlike Vandenbrande & Requicha's
   class-specific hints. This is the decisive practical advantage for a library like ours.

> **Direct mapping to our architecture:** we already have `aag.to_networkx()` and VF2
> subgraph matching (`recognize/feature_templates.py`, Issue #12). The MCSG idea maps to:
> (a) decompose the AAG by removing convex-only nodes (we have convexity via ChFi3d,
> Issue #9), (b) for each surviving concave component, *extend* it by virtual links before
> VF2-matching, so interacting holes/pockets still hit a template.

---

## 7. Virtual Faces / Virtual Links / Extended Faces

**Q5 — How does extending a face through an intersection work?**

When a feature is cut by another feature, the **logical** face is split into multiple
**topological** faces separated by the intersection edges — faces that are not adjacent in
the raw B-Rep. Recognition therefore needs to *re-unite* or *re-extend* them.

### 7.1 Virtual links (Gao & Shah 1998)

A **virtual link (VL)** is a face-adjacency that is *not present* in the part B-Rep because
of interaction, but is known to exist in the underlying feature. Four types were
catalogued:

- **(a)** planar/cylindrical face f₁ + planar f₂ satisfying a half-space relationship with
  intersecting face extensions;
- **(b)** two planar faces entirely in each other's positive half-space with intersecting
  extensions;
- **(c)** a face shared by two features that is **split** by a virtual edge (two halves
  become one);
- **(d)** two planar faces adjacent to the same cylindrical face along smoothly concave
  arcs (a fillet — matches our `blend_mask`!).

Gao & Shah give an **efficient algorithm to enumerate VLs**, and use them to complete the
MCSG. The extension step is where **"mostly" split faces get re-unified** before graph
matching.

### 7.2 Virtual faces (extended-face repair)

Related work (Zhang, Chan & Chen 1997) adds a **virtual-face building** step to recover a
single logical face from its split fragments:

1. Group faces lying on a **common surface** with the **same orientation**.
2. To be "unifiable," each face must **extend along an edge to touch another face's edge**
   **without intersecting** any non-set face (this is the same edge-extension/containment
   test as Gao & Shah's VL types (a)/(b)).
3. Fuse the fragments into one **virtual face**, giving the depression/protrusion a clean,
   pre-interaction boundary.

The defining test — *extend face F along its edge E until it hits face G; if nothing
else gets crossed (no forbidden intersection), F and G are a single logical face* — is
cheap and purely geometric. **This is the single most implementable idea in this report
for our pipeline**, because we already compute face geometry, orientation, and can probe
intersections via OCP `BRepExtrema`/`BRepAlgoAPI` (used in our healing and symdiff paths).

### 7.3 Operational rule for splitting interactions

Combine with Section 3.3: to **split** an interacting region into separable features, look
for the **boundary of minimal convexity** between two sub-components:
- depression features are delimited by a **convex** edge;
- protrusion features are delimited by a **concave** edge.

Re-unify (virtual face) then re-split (opposite-convexity boundary) is the two-step recipe.
This also dovetails with our existing **blend-mask** logic (we already gate caps vs walls,
Issue #4/#10) and our **convexity** ladder (Issue #9).

---

## 8. Detecting *Intersecting* (vs merely Adjacent) Features — State of the Art

**Q6 — What's the state of the art?**

### 8.1 The fundamental difficulty

Adjacent features share an edge — topologically visible and graph-local. **Intersecting**
features share *volume*, so their boundary faces interpenetrate and the feature's canonical
graph pattern is fragmented or partially destroyed. Rule-based graphs (AAG subgraph
matching) and volume decomposition both handle adjacency but are "NP-hard subgraph
matching" / "ad hoc case-by-case heuristics" for intersections. This is the persistent
AFR bottleneck.

### 8.2 Deep-learning state of the art

GNNs on B-Rep graphs now dominate the benchmarks. Key systems and datasets:

- **AAGNet** (Wu et al., *Robotics & Computer-Integrated Manufacturing*, 2024, DOI
  `10.1016/j.rcim.2023.102661`) — a **geometric AAG (gAAG)** GNN preserving topological,
  geometric and *extended* attributes; does multi-task **semantic + instance + bottom-face
  segmentation**; evaluated on MFCAD, MFCAD++, and a new **MFInstSeg** (~60,000 STEP files,
  24 classes). `github.com/whjdark/AAGNet`.
- **Hierarchical CADNet** vs **Sheet-metalNet** on **MFCAD++** (~59,655 parts, 3–10
  features each, rich interactions):

| Network | Accuracy | F1 | Train s/epoch |
|---------|----------|----|---------------|
| Hierarchical CADNet (Adj)  | 97.27 | 96.34 | 432 |
| Hierarchical CADNet (Edge) | 97.62 | 96.86 | 483 |
| Sheet-metalNet             | 98.43 | 97.44 | 10 |

- **BrepHGNet** (*IEEE?/Robotics & CIM*, 2026, DOI `10.1016/j.rcim.2026.103251`) — a
  **face–vertex interaction heterogeneous graph** (two node types, two relation types),
  vertex global-shape mapping via distance-to-faces.
- **EMD-GNN** (*Advanced Eng. Informatics*, 2026, DOI `10.1016/j.aei.2026.104609`) —
  **edge-modulated dual-graph** combining B-Rep face topology with triangular-mesh
  geometry for interacting features.

**Honest verdict for our project (D2: "No LLM in v1 — deterministic only", and no
training data):** the 98–99% peak is deep-learning-only, needs tens of thousands of
labeled STEP (MFCAD++ / MFInstSeg), and even it reports **sub-99% on intersecting
features**. ML is explicitly research-only for us (Issue #14 feasibility study, Memory:
`cad-reverse-state`). So the recommendations lean deterministic.

---

## 9. Detecting "Destroyed" Features

**Q7 — A chamfer partially consumed by a later pocket, a fillet edge that no longer
exists because a hole cut through it.**

### 9.1 The core mechanism: features leave partial evidence

Every interacting feature leaves behind **partial evidence** — a hint (Section 4). The
critical realization from Gao & Shah: the **MCSG is never empty** for any feature, even
heavily destroyed ones (it may degenerate to a single node). So "destroyed" is never
*complete* destruction; it is **reducibility of the surviving sub-graph** to a known
template *plus virtual links*.

For our specific examples:

- **A chamfer partly consumed by a later pocket.** Chamfer recognition relies on the
  chamfer face adjacency (planar nodes + reflected-arc chains — see `recognize/fillet_
  chamfer.py`). After a pocket eats part of it, the chamfer's surviving faces and at least
  one of its defining edges remain. The recognizer must accept an MCSG-style *partial*
  chamfer: match surviving planar + edge-chain subset, then **virtually complete** the
  lost portion (extend the chamfer planes through the pocket) and verify against the
  delta volume (Section 5) that the completion does not intrude.
- **A fillet edge gone because a hole cut through it.** Fillet recognition (our blend
  mask, Issue #2/#4) keys on the smoothly-concave arc. When a hole severs it, the smooth
  arc is *interrupted* into two arcs with a gap at the hole. Detection = notice the
  **interrupted smooth-concave arc chain** whose two pieces share a common radius and a
  common axis: that is a **fractured fillet** hint. Gap-filling via virtual link type (d)
  (two faces adjacent to the same cylinder along smoothly concave arcs) re-forms the
  logical fillet.

### 9.2 Why full restoration is impossible (the hard limit)

The Gaok-Shah survey and later reviews are explicit: **completely destroyed faces cannot
be restored**, and **ambiguity of feature combination cannot be eliminated**. The honest
engineering target is not "recover every destroyed feature with certainty" but:

- detect the **MCSG** (surviving core) of an interacting feature,
- **escalate the status** (PARTIAL vs CONVERGED, as our pipeline already does in
  `pipeline.py` · Issue #8/#10),
- generate an **alternative interpretation** when two completions are equally valid.

This maps cleanly onto our existing **PARTIAL / CONVERGED** status vocabulary and D9
"reason codes, not confidence."

---

## 10. Feature Interaction Taxonomies — The Canonical Citations

**Q8 — Literature taxonomies.**

1. **Vandenbrande & Requicha 1993** — *Spatial reasoning for automatic recognition of
   machinable features in solid models*, IEEE TPAMI 15(12):1269–1285,
   `10.1109/34.250845`. Introduced **hint-based** recognition, feature completion,
   optional/required volume segmentation, BRep→DSG. (Section 4.)
2. **Han & Requicha 1994/1996** — hint **rating/prioritization**, incremental feature
   recognition (**IF²**), modeler-independent adaptors. (Section 4.4.)
3. **Gao & Shah 1998** — *Automatic recognition of interacting machining features based on
   minimal condition subgraph*, CAD 30(9):727–739, `10.1016/S0010-4485(98)00033-5`.
   The **six-type interaction taxonomy** + MCSG + virtual links + EAAG/MFAG/PCAG/CAG
   graph stack. (Sections 3.2, 6, 7.)
4. **Zhang, Chan & Chen 1997** — *Hybrid method for recognizing feature interactions*,
   IJAMT 13(10):713+; and *A method for recognising feature interactions and feature
   components within the interactions*, IJAMT, `10.1007/BF01179071`. Modified-AAG (RAAG),
   virtual-face building + volume adding, three trace-connectivity conditions,
   convex/concave interaction delimiters. (Sections 2, 3.1, 7.)
5. **Sakurai & Dave 1996** — *Volume decomposition and feature recognition, Part II: Curved
   objects*, CAD, `10.1016/0010-4485(95)00067-4`. Maximal-volume decomposition →
   interactions via re-combination. (Section 5.)
6. **Gu et al. 2002** — *Improved AAG based recognition of machining feature*, Harbin
   Inst. Tech. AAG+auxiliary faces+virtual links; CCAG/UMF for interactions. (Section 5.2.)
7. **Joshi & Chang 1988** — foundational AAG (context; see `research/04` §1).
8. **Surveys / Darlin + Sormaz/Han 1996-97** — incremental recognition feeding automated
   process planning + setup planning (the downstream consumer that motivated all this).

---

## 11. Recommendations (Ranked by Implementability on Our Architecture)

**Constraints:** deterministic only (D2), pure OCP/CadQuery (D4), AAG + VF2 + blend-mask +
convexity already built (Issue #1/#9/#12), NO original CAD history (only B-Rep from STEP),
symdiff<0.001 gold gate (Rule #8), PARTIAL/CONVERGED statuses already in pipeline.

### R1 — Virtual-face / virtual-link unification FIRST (highest value-for-effort)
**Re-unify split logical faces before recognition; add virtual edges to re-fuse fractured
smooth-arcs.** Already have: face geometry/orientation, OCP intersection probing, edge
midpoints, blend-mask (Issue #4) which already implements arc-tracing along smoothly
concave edges. Implementable as: (a) group **same-surface, same-orientation** faces whose
**edge-extensions meet without crossing any other face** (Gao & Shah VL types a/b; Zhang
virtual-face building); (b) treat **interrupted smooth-concave arc chains sharing radius +
axis** as one fractured fillet (VL type d). This is pure geometry on the AAG we already
possess. It directly fixes the "hole through a pocket wall" (re-unify pocket walls that
the hole split) and "hole cut through a fillet" (re-fuse the smooth arc) cases.

### R2 — MCSG-style **partial** template matching (small change to existing VF2)
Change `feature_templates.py` so a template can match a **maximal sub-graph** of a feature
(pattern), not only an exact pattern. The VF2 machinery is already there (Issue #12);
"maximal sub-EAAG that remains (MCSG)" is a relaxation of the existing matcher. Emits a
**PARTIAL** status with a reason code (already in pipeline) rather than silently failing.
Lowest-effort, directly unlocks *destroyed* chamfer/fillet/pocket detection.

### R3 — Convexity-edge interaction delimiters (tiny, complements R1/R2)
Use the Section 2/3.1 rule to **split** run-on interacting features: a **convex arc** (or,
for protrusions, a **concave arc**) between two sub-components marks the feature boundary.
Add to `order.py`'s escalation so that "one big concave component" becomes "two features
joined at a convex edge." Near-zero new code (we already compute convexity via ChFi3d).

### R4 — Delta-volume / stock-minus-part decomposition (medium effort, high power)
Where stock is trustworthy (`recognize/stock.py` box/polyline/circle prism), compute
`deltaVolume = stock − part` via OCP boolean cut, then **maximal-volume decompose** the
delta volume and match each maximal volume as a feature by graph matching (Sakurai & Dave;
Gu CCAG). This is the only strategy that **circumvents** graph repair entirely (no virtual
faces needed) by reasoning directly on the removable volume. It also gives **alternative
interpretations** by re-combining volumes in different orders. Caveat: only exact once
stock is trusted; for inferred-stock fixtures keep it as a *cross-check* on R1/R2 results,
validated by the existing symdiff gate (candidate must be fully inside delta volume, i.e.
"no intrusion").

### R5 — Escalated-status + alternative-interpretation output (wrap-around)
Regardless of detection strategy, when interaction blocks a unique completion: escalate to
**PARTIAL**, attach a **reason code** (e.g. `INTERACTION_SPLIT_FACE`, `INTERACTION_LOST_
CONCAVE_EDGE`, `INTERACTION_DESTROYED_CHAMFER` per Gao & Shah classes IV/III), and emit all
**valid alternative interpretations** (validated by no-intrusion / symdiff). This matches
our D9 philosophy and keeps the pipeline deterministic.

### R6 — Defer deep-learning until feasibility case is stronger (do NOT build now)
GNNs (AAGNet/Sheet-metalNet/BrepHGNet) are the only thing that exceeds ~99% on
intersecting features, but they (a) violate D2 (no ML), (b) need 30–60k labeled STEPs
(MFCAD++/MFInstSeg), (c) still miss some intersections. Issue #14's scipy k-NN feasibility
study is the research-only placeholder; revisit only if R1–R5 prove insufficient on real
interacting fixtures.

### Priority order: **R1 → R2 → R3 → R4 → R5**. (R1+R2 together address the two briefed
examples — "hole through pocket wall" via R1 face-unification, "chamfer/fillet partially
consumed" via R2 partial matching + R1 gap-filling.)

---

## 12. Sources

- Joshi & Chang (1988), *Graph-based heuristics for recognition of machined features*, CAD 20(2):58–66, `10.1016/0010-4485(88)90050-4`.
- Vandenbrande & Requicha (1993), IEEE TPAMI 15(12):1269–1285, `10.1109/34.250845`.
- Han (1996), *3D Geometric Reasoning Algorithms for Feature Recognition* (IF²).
- Han & Requicha (1996), *Modeler independent procedural interfaces for solid modeling*, CG International '96.
- Gao & Shah (1998), CAD 30(9):727–739, `10.1016/S0010-4485(98)00033-5`.
- Zhang, Chan & Chen (1997/1998), IJAMT, `10.1007/BF01179071`.
- Sakurai & Dave (1996), *Volume decomposition and feature recognition, Part II*, CAD, `10.1016/0010-4485(95)00067-4`.
- Gu et al. (2002), *Improved AAG based recognition of machining feature*, Harbin Inst. Tech.
- Wu et al. (2024), AAGNet, Robotics & CIM, `10.1016/j.rcim.2023.102661`; MFInstSeg; `github.com/whjdark/AAGNet`.
- Sheet-metalNet vs Hierarchical CADNet, MFCAD++ benchmarks (Scientific Reports, `s41598-024-61443-2`).
- Li et al. (2026), BrepHGNet, Robotics & CIM, `10.1016/j.rcim.2026.103251`.
- Su et al. (2026), EMD-GNN, Advanced Eng. Informatics, `10.1016/j.aei.2026.104609`.
