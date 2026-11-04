---
{
  "format": 1,
  "metadata": {
    "id": "archived-feature-ordering-and-dependency-dag-construction-823b1e53",
    "title": "Feature Ordering and Dependency DAG Construction",
    "question": "What findings, alternatives and limitations does the historical investigation document about Feature Ordering and Dependency DAG Construction?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Feature Ordering and Dependency DAG Construction. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Feature Ordering and Dependency DAG Construction; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:45.370Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "823b1e53ca06cf2faa4cdbf0c9fd93f1620f3b2866045850fc338ba17a74a175",
  "proposalRevision": "98f77ec91ca1aa28c7dd61bdb6dbe6d26d4cb416e49b5a676bf69a375270f100"
}
---
# Feature Ordering and Dependency DAG Construction

Research report for the `cad_reverse` v1.5 pipeline — a deterministic STEP→CadQuery
reverse-engineering library. Our current `src/cad_reverse/order.py` (Issue #6) orders
features with a fixed heuristic sequence:

```
stock → pads/bosses → subtractive (pockets → through-holes → blind holes, canonical
        centroid sort) → fillets → chamfers
```

plus pattern grouping and a handful of dedup/escalation rules
(`INTERSECTING_FEATURES`, `DEDUP_CIRCULAR_POCKET_BLIND_HOLE`,
`FILTERED_FEATURE_INTERNAL_BLEND`). This works for *independent* features, but the
only interaction handling is a binary "face-key overlap → escalate" check
(`detect_intersecting_features`). It does **not** encode *directional* precedence —
which feature must exist before which — so interacting features (a hole drilled into
a pocket floor, a boss extruded from a milled face, a counterbore whose pilot must
precede it) cannot be ordered correctly.

This report surveys how the literature and commercial tools build feature dependency
DAGs, then recommends a concrete, implementable `must_precede` DAG for `order.py`.

Companion reports: `01_face_arbitration.md` (who owns each face), `02_feature_interactions.md`
(how interacting features segment). This report is the downstream consumer: **given the
arbitrated, de-duplicated feature set, what is the correct build/sequencing order?**

---

## 1. The core problem: from a flat list to a precedence DAG

Today `order_features()` receives category-sorted lists (`pads`, `pockets`, `holes`,
`fillets`, `chamfers`) and applies global rules. The research consensus is that this
is the wrong *shape* for interacting features. The correct abstract model is:

```
recognized features (nodes)  +  directed "a → b" edges (a must be built before b)
=  a precedence DAG (partial order)
→  topological sort → one linear construction sequence (linear extension)
```

The dependency relation is a **strict partial order** (antisymmetric, transitive,
irreflexive). A construction order is a **linear extension** (topological order) of
that poset — a total order consistent with all precedence constraints. The single most
important conceptual shift, confirmed across Han/Requicha, Sormaz/Arumugam, and the
2026 two-level-network work:

> **Feature ordering is not recovering the one true construction history — it is
> finding *a satisfiable* order consistent with the geometry-derived necessary
> precedences.** A given B-Rep admits *multiple* valid feature trees (AND-OR
> semantics), and reverse engineering can only ever recover a partial order of
> *necessary* edges, not a unique total order of *actual* events.

This matches our D9 design stance ("match/no-match + reason codes, not confidence")
perfectly: we emit a **valid** order, not a claimed recovery of the designer's steps.

---

## 2. What defines a "depends-on" relationship (Q1, Q2)

The literature yields **four concrete dependency classes**. They collapse almost exactly
onto the four you proposed.

### (a) Geometric/spatial containment — feature lies on/inside another's faces
A's faces are bounded by / nested within B's boundary ⇒ B precedes A.
- **Nesting (feature-in-feature):** inner-loop → outer feature is the *parent*.
- **Abutment:** a feature opens into a base feature; the base is machined first.

**Sunil, Agarwal & Pande (2010)** — *Computers in Industry* 61(7) 686–701
(DOI 10.1016/j.compind.2010.03.011) compute parent–child relationships in
post-processing from machining/extrusion height: for an adjacent interaction, the
feature with the *minimum* extrusion height (machined first) is the **parent**, the
deeper one the **child**.

### (b) Datum / sketch reference — A's face is B's reference plane
Parametric-CAD semantics are authoritative (SolidWorks/Creo): each feature depends on
one or more earlier features for **placement or dimensioning references**; earlier
features are *parents*, dependents are *children*. You cannot reorder a child before its
parent. We *already* produce the raw material for this — `stock.py` returns a
`base_face_key` (largest planar face, +Z tie-break) and Issue #13 produces a DRF
(primary/secondary/tertiary datum). Any feature extruded/pocketed from a base face is a
transitive dependent of that base.

### (c) Volumetric/Boolean intersection — A is a Boolean operand of B
CSG-flavored: features are negative volumes carved out of positive primitives. This is
the class where interactions get messy (17 pieces that "cannot be merged back" — Wang).

### (d) Protrusion/proximity — a boss grows out of the base it extrudes from
Indistinguishable in final B-Rep from a placement dependency — a boss must be created
*after* the stock surface it extrudes from.

**Liu & Wang (2007)** — *Computers in Industry* 58(4) 295–303
(DOI 10.1016/j.compind.2006.07.003) give the cleanest two-type split, which is the one
we recommend adopting:

| Interaction type | Example | Precedence rule |
|---|---|---|
| **Adjacent** (share a face/edge) | pocket-in-pocket, hole opens into a pocket | enclosing/shallower/outer feature (the *base*) FIRST — GR Rule 1 (nesting), GR Rule 2 (abutment); parent = lesser depth |
| **Volumetric** (V(F1) ∩ V(F2) ≠ ∅) | two slots crossing, intersecting pockets | **shallower feature FIRST**, deeper feature second — GR Rule 3 (avoids splitting the deeper feature / air-cutting) |
| **None** | independent features | sequence larger machining volume first — GR Rule 4 |

This maps to the four classes as: adjacent ≈ (a,b,d); volumetric ≈ (c).

---

## 3. Ordering-constraint taxonomy (Q2 deep dive)

Necessary ordering constraints fall into three distinct kinds, each with a different
evidence source:

**Geometric** (inferable from final geometry): containment, split/occluded-face,
feature-into-feature. *Strong.* Detectable from the AAG alone.
- *Containment / bounded-by:* if the union of A's faces lies fully inside the closed
  boundary of B, then B existed first. **Topological** test — robust to the curvature
  noise that weakens geometric classifiers. Highest-confidence edge signal.
- *Occluded-face test:* a face that would be a single flat/cylindrical face under one
  construction but is split into coplanar pieces by another feature's boundary means the
  *splitting/interrupting* feature came later. E.g., a pocket wall split into two
  coplanar faces by a crossing rib/step. (Our Issue #15 slotted-plate handling already
  leans on this.)

**Topological / B-Rep-finiteness** (A must exist before B can subtract from it):
A through-hole passing through a wall that is itself part of a milled pocket requires the
pocket be present as a subtractable volume first. This is the "backward-growing"
decomposition (Purdue, *A geometric reasoning methodology for manufacturing feature
extraction*, 1990): peel the final B-Rep backward into elementary machined volumes and
recover machining precedence by reverse subtraction.

**Parametric / reference** (B's position is defined relative to A's geometry): a sketch
anchored to a face, an edge, a vertex. This is the *datum reference* class. Only
recoverable from geometry when B's placement clearly references a face that only a prior
feature established.

---

## 4. Feature tree (CSG / constructive history) vs reverse-engineered ordering (Q3)

Procedural/history CAD (CSG tree, SolidWorks/Creo/Fusion360 feature tree) is a
**sequence + parameter-binding + dependency** structure that *produces* the B-Rep by
evaluation. Reverse engineering starts from the final evaluated B-Rep and must
re-derive the sequence + dependencies + parameters **backwards**. The theoretical
treatment is the **B-rep→CSG conversion problem**:
**Buchele & Crawford (2004)**, *CAD* 36(11) 1063–1073 — *BHC* (B-rep→halfspace CSG):
**describability** (Shapiro & Vossler), **separating halfspaces**, **dominating
halfspaces**, and **factored faces**. Output is a CSG tree whose structure is a valid
procedural *history* — though not necessarily the designer's.

Three assumptions the history approach makes that reverse engineering **cannot**:

1. **The construction sequence existed and is a *selected path* among a family of
   feasible paths** — history has *its* (designer's) path; RE must choose one, with no
   preference signal except geometry. ⇒ Treat our ordering as *satisfiable*, not recovered
   truth.
2. **The primitive/sketch parameterization is recoverable.** B-Rep surfaces are given as
   geometry; recovering the original sketch profile + extrude depth + frozen DOFs is
   under-determined. Heuristic orderings (largest-planar-base-first, shallow-feature-first)
   stand in for intent.
3. **Face identity is stable across edits.** The **topological-naming problem**
   (FreeCAD is the canonical warning) — replaying a reconstructed sequence *renumbers*
   faces, so any dependency encoded by face index must be re-anchored to geometry. Our
   D4/D7 decision to use `NearestToPointSelector` / `BoxSelector` grounded in recognized
   geometry is exactly the right hedge: **the DAG must reference geometric anchors, not
   raw face keys we then re-emit.**

A fourth subtlety: history stores CSG trees whose regularized set ops guarantee validity
automatically; reconstructed B-Reps must be re-validated (our **symdiff gate**) because
destructive/boolean reconstruction can re-order operations and change the result.

---

## 5. Feature ordering ↔ machining process plan (Q4)

Recognize-then-plan maps precedence directly onto the machining sequence. Liu & Wang's
manufacturing (KB) precedence derives from:
- **Fixture interactions** — machining F2 destroys the clamp face needed for F1 ⇒ F1 first.
- **Tool interactions** — F2 removes a positioning face a tool needs for F1 ⇒ F1 first.
- **Tolerance/datum interactions** — machining F2 destroys a datum F1's tolerance
  references ⇒ F1 first.

**MFAG** (Machining Feature Adjacency Graph) and generative CAPP (e.g., Woo et al.,
*Generative CAPP through projective feature recognition*, Computers in Industry 2007):
recognized features form composite features, classified by precedence due to machining
restrictions; sequencing runs **topological sort + BFS over graphs** to minimize setup
orientation changes. D'Souza (*On setup level tool sequence selection for 2.5D pocket
machining*, J. Manufacturing Systems 2006) stratifies the dependency graph into
**setup levels** and machines upper sibling levels before lower ones — i.e. the CAD
dependency DAG is *leveled*, and levels serialize.

**Bottom line for us:** the machining-sequence framing is a *source of extra precedence
rules* (manufacturing conventions), not a requirement that we reproduce a real toolpath.
We borrow its graph shape (precedence net + topo sort) and its *convention rules*
(§8), but we never need to emit an actual process plan.

---

## 6. Partial orders and graph algorithms (Q5, Q6)

### Represent the poset as a DAG
- **Reject self-loops** (`a→a`) at construction — a flawed recognizer can emit one; it
  would false-positive as a cycle.
- **Transitive edges are noise** for the base graph: if `a→b` and `b→c`, a stored `a→c`
  is redundant. Keep the base graph minimal (or reduce it — §6.3).

### 6.1 Kahn's algorithm (preferred) + cycle detection
```
in_deg[v];  agenda Q ← { v : in_deg[v]==0 };  order ← []
while Q not empty:
    v ← Q.pop(); order.append(v)
    for successor u of v: in_deg[u]-=1; if in_deg[u]==0: Q.push(u)
if len(order) < #V:  # vertices with in_deg>0 = exactly those on/in cycles → escalate
```
Complexity **O(V+E) time/space**. The leftover `in_deg>0` vertices give a *concrete set*
to escalate, not just a boolean.

### 6.2 DFS + Tarjan SCC for cycle *diagnosis*
Three-color DFS detects a back-edge (on-stack) = one cycle member. **Tarjan's SCC** (O(V+E))
finds every nontrivial strongly-connected component (size > 1, or self-loop). Contract SCCs
to a **condensation DAG** that is *always acyclic*.

**Recommendation — do not silently break cycles.** A CAD cycle is almost always a genuine
physical contradiction (two features each referencing the other's geometry) — i.e. a
recognizer/arbitration bug. Surface it: run Tarjan → escalate the exact cyclic feature set
→ emit PARTIAL (our pipeline already has a PARTIAL status; this slots right in). Reserve
greedy edge-removal for an explicit "force tolerantly" mode.

### 6.3 Transitive reduction → Hasse diagram (the "simplest correct DAG")
The **Hasse diagram** of a poset *is* its transitive reduction — the edge-minimal subgraph
with identical reachability. For a DAG the transitive reduction is **unique** (and equals
the minimum equivalent graph). Corollary of **Aho–Garey–Ullman (1972)**: the unique,
cheaply-computable reduction exists precisely *because* the graph is acyclic — another
reason to refuse cycles. Algorithm: per-source BFS/longest-path reachability probe, drop any
edge `u→v` with an alternative path u⇝v of length ≥ 2. **O(V·(V+E))** — fine for our
sparse, tens-of-features graphs. Payoff: smaller/faster topo sort, accurate depths,
legible Hasse-diagram debug output.

### 6.4 Longest-path (CPM) vs. valid topo order
Distinguish the two — they answer different questions:
- **Topo order** = "is there a valid order, and give one." About *existence*. Any linear
  extension is valid; incomparable branches reorder freely.
- **Longest-path / CPM** = "given costs, what's the critical chain / minimum span."
  About *scheduling*. Longest-path is **NP-hard on general graphs but linear on DAGs**
  (DP with MAX relaxation over a topo order). Computing node **depth = 1 + max(parent
  depths)** is O(V+E) and essentially free, done in the same topo pass.

**Recommendation:** For emitting a CadQuery script, a *valid* topo order suffices — any
consistent order builds the same solid. Compute **depth per node** as the primary
tie-break (§6.5). Reserve full weighted CPM / longest-path for an *analysis/reporting*
function (minimum build-span, critical chain of features), not the core order.

### 6.5 Deterministic linear extension (tie-breaking) — Q8
A poset with incomparable elements has many linear extensions; a plain FIFO queue is
insertion-order dependent and non-reproducible. Fix with **Kahn's over a min-heap keyed**
by a total tie-break:
```
min-heap keyed by (tiebreak_key(v)); seeds = {v : in_deg[v]==0}; pop lowest key each step
```
O(V log V + E). Same input → byte-identical output (the **lexicographically smallest**
extension when key = feature label).

**Key selection is the real design decision.** Recommended composite, tuned to our
emitter's natural script structure:

```
(depth desc, feature-type-rank asc, feature-id asc)
```

- **depth desc** — packs work onto the critical chain (build the tall dependency first).
- **type-rank asc** — `stock=0 < pads=1 < subtractive=2 < fillets=3 < chamfers=4` — emits
  base before details, matching the current `order.py` philosophy.
- **feature-id asc** — rock-solid final tie-break; guarantees totality so no two nodes
  share a key (avoids the "stable-but-not-total" trap where equal keys reintroduce
  insertion-order dependence).

---

## 7. Inferring "must-precede" from geometry alone (Q7)

Behaviorally proven non-unique: **Pan et al.** note different valid modeling strategies
produce identical final B-Reps. Target *necessary* edges, not a claimed *actual* order.

### The strongest, best-proven rule: fillets/chamfers LAST (Venkataraman & Sohoni)
**Venkataraman & Sohoni, *Blend Recognition Algorithm and Applications*, Solid Modeling 2001**
(DOI 10.1145/376957.376970) prove: **the same blended edges yield *different* final
geometry depending on blend creation order, and recovering valid intermediate solids
requires suppressing blend chains in *reverse creation order*.** Their algorithm groups
blend faces into **leaf chains** and then a **parent–child DAG** via cross-edge/curvature
tests; a **topological sort of that DAG gives blend creation order.**
- This is the formal justification for our existing "fillets last," and it goes further:
  blend faces *hide* true sharp edges — **suppress the blend to reveal the sharp edge
  beneath**, and a fillet whose suppressed edge lies on a pocket wall confirms the *pocket
  preceded the fillet* (a hard `pocket → fillet` edge). Our `blend_mask` already excludes
  blend faces from cap detection — this is the same idea promoted to an edge signal.
- **Caveat (their Figure 15):** nested/parallel fillets without a direct parent–child edge
  (e.g. outer fillet of a shelled pocket) are *ambiguous even for them* — flag these as
  lower-confidence / escalate.

### Geometry-derived precedence rules (implementable in v1, no NN)
| Rule | Signal | Confidence |
|---|---|---|
| Fillets/chamfers after the pocket/pad/boss they blend (suppress-blend-to-reveal-edge) | blend face → pocket floor/wall adjacency | high |
| Containment / bounded-by (A's faces inside B's boundary) ⇒ B first | topological enclosure on AAG | high |
| Feature-into-feature (hole opens onto a pocket floor/wall) ⇒ pocket first | entry-face membership in a claimed face set | high |
| Occluded/split-face (coplanar pieces split by a crossing boundary) ⇒ interrupting feature later | coplanar-but-topologically-separate faces | medium |
| Extrusion/reference from base face ⇒ child after base | base_face_key (stock.py) + DRF (Issue #13) | high |
| Deeper-vs-shallower intersecting subtractive | GR Rule 3: shallower first | medium |

### Learning-based state of the art (future v2, not v1)
- **CADOps-Net** (Dupont et al., 3DV 2022, arXiv 2208.10555) jointly segments faces into
  CAD **operation types** and **operation steps** (faces created in the same step) on
  CC3D-Ops — this gives *grouping*, not explicit precedence edges.
- **Pan et al. (EAAI 2026)** classify **per-edge precedence relations** between adjacent
  faces ("which face's feature was created first"), infer virtual links for fragmented
  features, build a **feature precedence graph**, and **greedy-sort** it into feasible
  sequences (94.5% face / 87.2% edge accuracy on Fusion 360 Segmentation). Closest
  published match to our goal; validates that partial-order precedence from B-Rep is a
  recognized, tractable problem. Forbidden by our D2 (no LLM in v1) — see
  `09_ml_classifier_feasibility.md` for the research-only angle.

---

## 8. Commercial tool ordering rules (Q8)

Distinguish **manufacturing-convention ordering** (weak / trade-based — order freely,
report as such) from **geometry/technological constraints** (strong).

**FeatureCAM / Autodesk** (official docs):
- A hole is split into **spot-drill → drill → countersink**; the *default fixed* order is
  **spot-drill top → drill the small diameter → drill the larger counterdrill/bore**, and it
  **cannot be manually reordered** in the Op List (only via the Strategy tab, e.g. "Drill
  large counterdrill first"). **Rationale:** the counterbore/reamer tool needs the pilot
  hole to guide/extend safely. *This is the strongest cross-tool convention for us.*
- Auto-ordering criteria (selectable, trade-based): **Minimize tool changes** (group
  same-tool ops; *required* for hole macros), **Do finish cuts last**, **Cut higher
  operations first** (top-of-stock → down), **Minimize rapid distance**. Only the last
  changes *feature* order; the others reorder *operations* across features.
- **Ordered groups:** the documented "all drilling before all milling" is an *ordered
  group of two unordered groups* — a grouping optimization (tool-change / rapid-distance),
  not a geometric necessity.

**Siemens NX (MFR/FBM):** ordering is rule-driven via **Machining Knowledge Editor (MKE)**
+ **Machining Knowledge Library (MKL)** — rules select operations and *perform sequencing*,
  and can route ops into **Program Order Groups (POGs)** by setup/MCS. So NX adds a
  **setup/MCS-driven** constraint: a feature requiring a different machining coordinate
  system forces a separate setup phase. (Stanalel, IOP Conf. 1757-899X/568/012015.)

**CAMWorks:** hole-making ops in the conventional sequence **Center Drill → Drilling →
Countersink → Thread Mill**; depth regimes (blind-flat / through / blind-point) settable by
expression or by **countersink-diameter** target. Center-drill-before-drill is the standard
pilot precedence.

**Mastercam:** ordering is **user/operation-tree-controlled**, not auto-derived — not all
CAM tools infer order; some just expose a reorderable op list.

**GD&T datum precedence (3-2-1):** primary = 3 points/plane, secondary = 2/line, tertiary =
1/point; order in the feature control frame = precedence. A hole position tolerance
referencing a base plane ⇒ the base plane must be established before the hole position is
measured — i.e. **primary datum precedes the toleranced feature.** Our Issue #13 DRF output
can source `datum → feature` edges from this.

### Adopt as manufacturing-convention rules for ordering
These are *safe to apply* because they match what commercial tools emit and reduce
feature interactions, even though they are conventions (weak) not geometric necessities:

1. **Spot/pilot → small diameter → counterbore/countersink** (FeatureCAM default, physical
   rationale: the counterbore tool needs the pilot). High confidence match to commercial
   output. Applies to our cbore/csk handling (Issue #3/#10).
2. All holes on a face together; all drilling before milling — a *grouping* optimization.
3. Minimize tool changes; finish-last — cost terms, not hard dependencies (only relevant if
   we later add scheduling).

---

## 9. Recommendations for `order.py` (v1.5)

Concrete, implementable. Keeps D2 (no LLM), D5 (typed params), D9 (reason codes),
deterministic topo order, and integrates cleanly with the face-arbitration stage
(`01_face_arbitration.md`) which runs first and resolves face ownership; **this module
consumes the arbitrated, de-duplicated feature set and produces the build order.**

### R1. Build a real precedence DAG, then topological-sort it (replace global-sort-only)
Define per-feature `must_precede` edges from geometry (hard) + conventions (soft), run
Kahn's with the min-heap tie-break, and emit the reservoir (currently the separate
`pads` / `subtractive` / `fillets` / `chamfers` lists) as a **single flat ordered
`SubtractOp`-style sequence**. Feasibility: this is a pure-algorithm module already
(no OCP) — the DAG lives entirely on `HoleParams`/`PocketParams`/`PadParams`/`BlendParams`
metadata. Low risk. Keep `OrderedFeatures` as the stable output contract; add an internal
DAG + a `build_order: list[FeatureId]` (or fold into `OrderedFeatures`, below).

### R2. Edge sources (ranked by confidence, all available from current dataclasses)

**Hard (geometry) edges — add unconditionally:**
- `pocket → hole` when the hole's entry face is a claimed pocket face (our `claimed` face
  bookkeeping — already used in Issue #15 dedup — is the signal). Fixes "hole in pocket
  floor."
- `pad/boss → pocket/hole` when the subtractive feature's entry face is on the boss
  (boss extruded, *then* drilled).
- `stock → everything` (transitive via depth).
- `pocket → fillet` / `pad → fillet` whenever the fillet's blend faces adjoin a pocket/pad
  wall (Venkataraman & Sohoni reverse-suppression — confirm via blend-face∩wall-face,
  else escalate as ambiguous).
- `primary datum → toleranced feature` from Issue #13 DRF (3-2-1 precedence).

**Soft (convention) edges — emit but allow the emitter/verifier to tolerate:**
- `pilot → counterbore/countersink` (FeatureCAM default) — order cbore/csk after their
  clearance/pilot; this is the highest-confidence convention.
- shallower-subtractive → deeper-subtractive when volumes overlap (Liu & Wang GR Rule 3).

**Do NOT add:** machine-openness costs, tool-change minimization, POG/setup grouping —
those are process-planning optimizations out of scope for a single-part CadQuery emitter.

### R3. Deterministic topo order with depth tie-break
- Represent edges as a DAG; **reject self-loops**.
- Computing **depth per node** (1 + max parent depth) in the same pass gives an
  `as-early-as-possible` packing automatically.
- Topo sort via **Kahn's over a min-heap** keyed by
  `(depth desc, type_rank asc, feature_id asc)` — byte-identical output, lexicographically
  smallest extension, matches the current `stock→pads→holes→fillets→chamfers` philosophy
  when no edges force otherwise.

### R4. Cycle handling = escalate, don't silently break
- Run **Tarjan SCC**; on any nontrivial SCC, append an `Escalation`
  (`reason_code="CYCLIC_DEPENDENCY"`, `face_keys` = the cyclic feature set) and return
  PARTIAL. Do not discard work. A CAD cycle is a recognizer/arbitration bug and should
  surface loudly.
- Keep the existing `INTERSECTING_FEATURES` escalation but *downgrade* it: face overlap
  alone no longer means "do not order" — now that edges are directional, overlapping
  features that arbitration resolved into a real precedence (R2) should be *ordered*, and
  only unresolvable overlaps escalate.

### R5. Transitive-reduce the DAG for clarity (optional, after validation)
Per-source Aho–Garey–Ullman reduction (O(V·(V+E))) to drop redundant edges. Preserves
reachability and depths; yields a Hasse-diagram debug artifact. Only worth doing once the
DAG is validated, to keep the initial implementation small.

### Interaction with face arbitration (`01_face_arbitration.md`)
Frame arbitration decides **which recognizer owns disputed faces** and which feature is
*dominant*. This is a **prerequisite** for — and directly feeds — our R2 edges:
1. Arbitration's `parent` determination (which feature is the base/carrier for a nested
   set) becomes a *direct* `parent → child` edge. The sibling report's T0/T1/T2 tiers
   (stock/through/capped) already encode a legal topo level order that R3's type-rank
   mirrors.
2. Arbitration resolves *false positives* (a face that "looks like" a wall but is really
   part of a dominant feature). Those suppressed candidate features must be *removed from
   the DAG node set* before topo sort, so their nominal edges never create phantom cycles.
3. The `claimed` face sets arbitration produces for each surviving feature are exactly the
   identity tokens R2 uses to test `entry-face ∈ claimed(pocket)`.

So the correct module order is:
```
reconstruct():
  recognize → (face arbitration, FeatureSet final)  # 01
           ] → order_features(...) builds DAG → topo-sort → OrderedFeatures  # 03
           → emit.py → CadQuery script
```

### Failure-mode / escalation reason codes (extend existing set)
- `CYCLIC_DEPENDENCY` — new; Tarjan-identified feature set.
- `AMBIGUOUS_BLEND_ORDER` — new; nested/parallel fillets with no provable edge
  (Venkataraman & Sohoni Figure 15), escalate, allow PARTIAL.
- `UNORDERABLE_INTERSECTING` — rename/scope `INTERSECTING_FEATURES` to the subset that
  arbitration could not turn into a precedence.
- Keep `FILTERED_FEATURE_INTERNAL_BLEND`, `DEDUP_CIRCULAR_POCKET_BLIND_HOLE` unchanged.

### Suggested test additions (`tests/test_order.py`)
- Hole-in-pocket-floor → `pocket` precedes `hole` (edge + result order).
- Boss-then-drill → `pad` precedes `hole`.
- Pilot/counterbore → cbore after clearance hole.
- Two overlapping slots → shallower first (GR Rule 3), no cycle.
- Artificial `a→b, b→a` → `CYCLIC_DEPENDENCY` escalation + PARTIAL.
- Determinism: two runs → byte-identical `OrderedFeatures`.
- Transitive edge `a→b, b→c` collapses via reduction (if R5 implemented).

---

## 10. Key sources

**Dependency graphs / recognition**
- Vandenbrande & Requicha, *Spatial reasoning for the automatic recognition of machinable
  features*, IEEE TPAMI 15(12), 1993 (DOI 10.1109/34.250842) — blackboard hint-based,
  delta volume.
- Han & Requicha, *Integration of feature based design and feature recognition*, CAD
  29(5) 393–403, 1997 (DOI 10.1016/S0010-4485(96)00079-6) — hint strength, subsumption,
  satisficing.
- Pan, Zhu, Cao, Gao, Li, *Reconstructing feature-based models from B-reps via two-level
  networks*, EAAI 176:114768, 2026 (DOI 10.1016/j.engappai.2026.114768) — per-edge
  precedence + precedence-graph topo sort.
- Sormaz & Arumugam, *Generation of Alternative Feature Representations and Feature
  Precedence Relations*, ASME IDETC/CIE 2005 (DOI 10.1115/DETC2005-85248) — AND-OR graphs.

**Parent/child, interaction precedence**
- Liu & Wang, *Sequencing of interacting prismatic machining features*, Computers in
  Industry 58(4) 295–303, 2007 (DOI 10.1016/j.compind.2006.07.003) — GR Rules 1–4, KB rules.
- Sunil, Agarwal, Pande, *…hybrid (graph and rule) technique…*, Computers in Industry
  61(7) 686–701, 2010 (DOI 10.1016/j.compind.2010.03.011) — extrusion-height parent/child.
- Corney & Clark, *A feature recognition algorithm for multiply connected depressions…*,
  ACM SMA '91 (DOI 10.1145/112515.112541).

**B-rep → history / blend ordering**
- Buchele & Crawford, *3D halfspace CSG tree construction from implicit boundaries*, CAD
  36(11) 1063–1073, 2004 (DOI 10.1016/j.cad.2004.01.006) — describability, BHC.
- Venkataraman & Sohoni, *Blend Recognition Algorithm and Applications*, Solid Modeling
  2001 (DOI 10.1145/376957.376970) — fillets last, reverse-suppression, blend DAG.
- Dupont, et al., *CADOps-Net*, 3DV 2022 (arXiv 2208.10555).
- Purdue thesis, *A geometric reasoning methodology for manufacturing feature extraction*,
  1990 (docs.lib.purdue.edu/dissertations/AAI9116474) — backward-growing machined volumes.

**Algorithms**
- Kahn, *Topological sorting of large networks*, CACM 5(11), 1962.
- Tarjan, *Depth-first search and linear graph algorithms*, SIAM J. Computing 1(2), 1972 (SCC).
- Aho, Garey, Ullman, *The Transitive Reduction of a Directed Graph*, SIAM J. Computing
  1(2) 131–137, 1972 — Hasse/minimum equivalent graph.
- Cormen, Leiserson, Rivest, Stein — CLRS §22.4 (topo), §22.5 (SCC), longest-path-in-DAG.
- Sedgewick & Wayne, *Algorithms* §4.2, §4.4 (CPM / AcyclicLP).

**Manufacturing / CAPP / CAM**
- Liu & Wang (above); D'Souza, *On setup level tool sequence selection for 2.5D pocket
  machining*, J. Manufacturing Systems 2006 (DOI 10.1016/j.jmsy.2006.xx).
- Stanalel, *Manufacturing based on feature recognition using NX*, IOP Conf. Series: MSE
  568 012015, 2019 (DOI 10.1088/1757-899X/568/1/012015) — MFR/MKE/POG.
- Autodesk FeatureCAM docs — *To change the machining order of features and operations*:
  help.autodesk.com/view/FCAM/2023/ENU/ (GUID-1F342BFE-AF1F-475A-91DF-3BE25C1A8EC6);
  *How holes are manufactured* (GUID-5AC6F9C7-3C6C-4E49-8798-47CCC13091A1).
- CAMWorks hole-making ops: Rose-Hulman ME520 mill-and-turn tutorial
  (rose-hulman.edu/Class/me/me520/tutorial-mill-and-turn.pdf) — Center Drill → Drilling →
  Countersink → Thread Mill.
- Gou, Chu & Li, *A geometric method for computation of datum reference frames*, 1999 — GD&T
  3-2-1 precedence; NJIT datum precedence rule (njit.edu/~sengupta/datums5.htm).

**Where the v1.5 pipeline code lives**
- `src/cad_reverse/order.py` — `order_features()` (Issue #6): global-sort ordering, pattern
  grouping, intersection escalation. This is what R1–R5 upgrade.
- `src/cad_reverse/recognize/stock.py` — supplies `base_face_key` (datum/reference for R2b).
- `src/cad_reverse/recognize/datum.py` — Issue #13 DRF output (primary datum edges).
- Sibling reports `research/multi_feature/01_face_arbitration.md` (prerequisite arbitration
  stage) and `02_feature_interactions.md` (segmentation semantics).
