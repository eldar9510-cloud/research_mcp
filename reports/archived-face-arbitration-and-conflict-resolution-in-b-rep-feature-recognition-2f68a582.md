---
{
  "format": 1,
  "metadata": {
    "id": "archived-face-arbitration-and-conflict-resolution-in-b-rep-feature-recognition-2f68a582",
    "title": "Face Arbitration and Conflict Resolution in B-Rep Feature Recognition",
    "question": "What findings, alternatives and limitations does the historical investigation document about Face Arbitration and Conflict Resolution in B-Rep Feature Recognition?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Face Arbitration and Conflict Resolution in B-Rep Feature Recognition. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Face Arbitration and Conflict Resolution in B-Rep Feature Recognition; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:44.966Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "2f68a582d21b093cd36ddb407852ffd7d68affa0c63e06db67f8d2bdaf8dddd9",
  "proposalRevision": "aa1151105b893975d96e01119cfa013989753730d3a5a59f682f48d7223cb6ac"
}
---
# Face Arbitration and Conflict Resolution in B-Rep Feature Recognition

Research report for the `cad_reverse` v1.5 pipeline — a deterministic STEP→CadQuery
reverse-engineering library. Today each recognizer (hole, pocket, fillet, chamfer)
runs independently on the same Attributed Adjacency Graph (AAG). When overlapping
features conflict (a hole face that also reads as a pocket wall, a fillet cylinder
that also reads as a slot-end cylinder) there is currently **no global arbitration**
to decide which recognizer "owns" the disputed faces.

This report surveys how the literature and commercial tools resolve these conflicts,
then recommends specific, implementable strategies ranked by feasibility for our
deterministic, rule-based v1.5 pipeline.

---

## 1. The core problem, precisely

Two overlapping features F1 and F2 induce a **face assignment conflict**: a face `f`
is claimed by recognizer R1 (e.g. as a pocket wall) and by recognizer R2 (e.g. as a
hole wall). The recognizer runs produce a set of *candidate features*, each an
ordered set of faces:

```
Candidates(F) = { c ∈ candidates : faces(c) ⊆ faces(F) }
```

Without arbitration one of three bad outcomes occurs:

1. **Double counting** — the same cylinder face materializes as both a hole and a
   slot-end, producing two overlapping CadQuery features that over-machine the part.
2. **False positives** — a face that "looks like" a feature wall but is really part of
   a larger dominant feature is emitted as a spurious feature (our `UNMATCHED_*`
   reason codes are designed to surface these).
3. **Ghosts / under-segmentation** — an interacting feature is split into pieces that
   cannot be re-merged (Wang's decomposition of two interacting slots into 17 simple
   features that "cannot be merged back into two separated simple slots").

The fundamental observation from the survey literature (Han, Requicha, Shah): **feature
recognition is not a classification problem, it is an *interpretation* problem.** A
given B-Rep admits multiple valid decompositions, and the decomposition you pick is a
choice about manufacturing intent (Section 3). Arbitration is the mechanism that turns
a set of competing single-feature recognitions into one self-consistent interpretation.

---

## 2. How academic systems handle face claiming

Foundational lineage (see `04_aag_graph_based_cad_analysis.md` for the graph-theory
details of the AAG itself):

### 2.1 Joshi & Chang (1988) — AAG subgraph decomposition
The original AAG method [JC88] resolves claimed faces by a **dominance heuristic**: a
face surrounded by convex edges "is not a feature face and can be removed from the
AAG." Features are the remaining concave subgraphs. The implicit arbitration rule is
therefore **"convex-dominant faces are free, concave-dominant faces are feature
faces"** — ownership is decided by local convexity before any recognizer runs. This is
a *face-class-first* strategy (Section 6): it partitions the face set up front and only
then asks which features occupy the concave cells.

Later work (Rahmani & Arezoo) improved this by removing *all* convex edges rather than
only all-convex-surrounded nodes, better handling interactions — but still a
face-class-first approach.

### 2.2 Marefat & Kashyap — cavity graphs, unification, virtual links
Extended the AAG into **cavity graphs** that model depressions with concave links.
Two arbitration-relevant ideas:

- **Face unification** — merge distinct faces into larger *virtual faces* when they
  are coplanar and otherwise fragmented by an interaction, so a recognizer sees one
  logical face instead of several pieces.
- **Virtual links** — add synthetic edges across faces that an interaction removed, to
  restore the connectivity a recognizer expects.

Both are *face-set repair* techniques: they pre-process the graph so that recognizers
operate on the least-fragmented, most-feature-shaped faces, reducing the number of
cross-feature false claims.

### 2.3 Vandenbrande & Requicha (1993) — hint-based, generate-and-test
The canonical **hint-based** approach [VR93]. Instead of directly classifying faces,
the recognizer searches B-Reps for *hints* (e.g. a pair of parallel opposing faces is a
hint of a slot). Each promising hint is associated with an incompletely-specified
feature frame and "completed" volumetrically (feature completion / boundary growing)
to the **largest volume compatible with the geometry**. Arbitrating interactions:

- Features are segmented into **optional vs required volumes** — the parts of a feature
  that are truly its own vs. the parts that overlap another feature and are therefore
  casualties of the union.
- **Validity tests** reject candidates that intrude into the desired part, are
  inaccessible, or violate machinability, *after* the feature is grown.

The key insight for us: **a hint is a weak claim; the arbitration happens at validity
time, not at recognition time.** Hint + completion + validity = a candidate that either
survives as an owned feature or is rejected for trespassing on another feature's faces.

### 2.4 Han et al. (2000) — the survey that names the problem
The IEEE survey [HGH00] is the single best reference for framing. It calls interacting
feature recognition "the most critical issue in feature recognition." Two contributions
directly about arbitration:

- **Hint-based > graph-based for interactions**: "a nominal-geometry hint is not an
  exact pattern of geometric entities and was introduced precisely to resolve the
  problem of recognizing intersecting features." Graph template matching fails when an
  interaction *deletes* arcs/faces from the graph (the template no longer matches).
- **Alternative interpretations**: Han proposed either (a) generating a **single,
  satisficing interpretation** with a mechanism to produce **alternatives on demand**
  from the user, or (b) pursuing an **optimal** interpretation by folding manufacturing
  knowledge into recognition. For downstream automation, (a) — deterministic
  satisficing + plausible alternatives — is the more tractable shape.

### 2.5 Gao & Shah — hybrid graph + hint (MCSG)
Represented the hybrid school [GS98]: **minimal condition subgraphs (MCSGs)** serve as
hints, then are *completed* by geometric reasoning. Arbitration is done during
completion by checking geometric conditions against the whole part. Like VR93, the
heavy lifting of disambiguation is deferred to the completion/validity stage.

### 2.6 Tseng & Joshi — volume decomposition & reconstruction
The **delta-volume** approach: subtract the part from its raw stock to get the
machining volume, decompose it into **basic removable blocks** by extending face
boundary planes, then **glue the blocks back** in all feasible ways to enumerate
*multiple interpretations*. Arbitration of overlapping features becomes: choose the
gluing/reconnection that yields the most sensible pocket volumes. The idea that
"features are volumes, not face sets" is powerful but assumes a known stock primitive,
which our pipeline does not always have.

### 2.7 Wu & Liu — process requirement modeling (face-level)
The most directly relevant reframing [WL95]. Rather than multi-face graph
isomorphism, model **each single face by its process requirements** (acceptable cutter
specs per approach direction). Then:

> A set of connected faces is a machined feature "if these faces have a common
> acceptable cutter and can be simultaneously machined by it."

Arbitration becomes an **intersection of cutter sets** — a *single-face* test is
"relatively easy" compared to multi-face graph matching. This is attractive for us
because our recognizers already derive per-face radii and approach directions; the
conflict test "do these two competitors share a cutter & approach?" is cheap.

---

## 3. The five families of conflict-resolution approaches (with tradeoffs)

Synthesized from the Wu & Liu classification plus the survey material:

| # | Family | Mechanism | Tradeoff |
|---|--------|-----------|----------|
| 1 | **Generic representation schemes** | Model interactions directly (e.g. Choi's syntactic patterns); simple features as special cases | Can introduce vagueness for certain interactions |
| 2 | **Learning-capable recognizers** | Unrecognizable features become training templates | Must keep inference rules mutually exclusive or a feature classifies as multiple types → vagueness/conflict |
| 3 | **Missing-information recovery** | Recover faces hidden by interactions (Joshi-Chang recovery rules; Wang's block-growth) | Heuristic, robustness-deficient |
| 4 | **Hybrid B-rep + feature-based** | Built-in feature info from a hybrid modeler provides separation clues | Works only when such info exists (we don't have it — STEP is un-historied) |
| 5 | **Heuristic works** | Ad-hoc arbitration (Gavankar-Henderson nesting, Prabhakar-Henderson NN, Marefat-Kashyap virtual links) | Generally heuristic, not robust |

**Actionable tradeoff summary for our pipeline:** Family 4 is inapplicable (we have no
hybrid modeler history). Family 2 is out of scope (D2: no learning in deterministic v1).
Families 1, 3, and 5 contribute reusable *local* techniques (unification, virtual
links, recovery rules, cutter-set intersection) but none is a complete arbitration
policy. The decision of *which* candidate wins is orthogonal and must be layered on top.

---

## 4. The "feature suppression" approach

This is the strategy most directly implementable in a deterministic, ordered pipeline,
and it is the de-facto shape of commercial feature recognizers.

**Algorithm (greedy dominance + suppression + re-run):**

```
candidates := recognize all features on F
ordered := rank(candidates)              # priority rule, Section 5
owned := {}
remaining_faces := faces(F)
while candidates is not empty:
    c := pop(ordered)                    # best remaining candidate
    if faces(c) ∩ remaining_faces == faces(c):   # fully unclaimed
        owned += c
        remaining_faces -= faces(c)      # SUPPRESS its faces
    re-run recognizers on remaining_faces # picks up features fragmented by the winner
```

**Why the literature supports it:**

- **Joshi-Chang** are doing an implicit, one-pass version: convex faces are
  suppressed/claimed as non-feature first, then concave subgraphs are owned.
- **FeatureWorks** (Section 6.1) uses suppression directly: in *Automatic* mode it
  recognizes what it can, and "only unrecognized portions are processed on successive
  attempts" — i.e. recognized faces are removed from consideration and recognition is
  re-run on the residue.
- **Greedy + re-run** is how you avoid the classic failure of interacting features
  that get fragmented by a dominant neighbor: recognize the neighbor, claim its faces,
  then the interacting partner's true walls become visible/irredundant and are found on
  the re-run.

**The correctness property that makes suppression work:** if we commit to
**one-face-one-feature ownership** (Section 7), then claiming a face by the highest-
priority candidate is *sound* — no other feature may use it. Re-running only ever
*adds* features on the faces left over, never contradicts an existing owner.

**Failure modes to guard against:**

1. **Wrong early claim cascades.** If a low-quality candidate wins an early slot, it
   claims faces a better candidate needed. Mitigate by ordering candidates so that
   structurally-unambiguous, high-confidence features (holes, pockets with capped
   cylinders) are claimed before weaker/ambiguous ones (fillet-vs-slot-end).
2. **Infinite/oscillating re-runs.** Re-run must be monotone (it can only shrink the
   residual face set) and must terminate when no new fully-unclaimed candidate appears.
   A timeout / max-iterations guard is prudent.
3. **Suppression vs. shared faces.** Pure suppression forbids a floor that legitimately
   serves two features (Section 8). Decide whether shared faces are allowed *before*
   adopting suppression wholesale, since suppression and sharing are mutually exclusive
   for the affected faces.

---

## 5. Ranking / priority rules: subtractive-first, additive-first, largest-first, confidence-based

The suppression loop needs a deterministic ordering. Four families from the literature
and commercial practice:

### 5.1 Subtractive-first (machining-view)
Recognize material-removal features (holes, pockets, slots, steps, chamfers) before
additive features (bosses, pads, ribs). Rationale: the delta-volume of a machined part
is dominated by voids; the stock/base profile is recovered first as the dominant
subtractive canvas (our `stock.py` already does this — base face is the largest
unclaimed planar face). **Most natural for a STEP-from-machined-CAD workflow, which is
precisely our catalog.** FeatureWorks' recommended interactive order confirms the
industrial convention: chamfers/fillets → drafts → holes → ribs → cut extrudes →
revolves/sweeps → shell → boss extrudes/revolves/sweeps/lofts. Note the subtlety:
**fillets/chamfers come first** (they're "fine details" that coarse geometry
interferes with), then subtractive (holes, cuts), then additive (bosses). So the real
ordering is:

```
fine_detail (chamfer, fillet)  →  subtractive (hole, pocket/slot)  →  additive (pad, boss)
```

### 5.2 Additive-first
Recognize bosses/pads first. Reasonable when the part is a casting or injection-moulded
shell where protrusions define the base geometry. Weaker default for machined hardware.

### 5.3 Largest-face-first
Claim the single largest faces (the stock profile, the dominant pocket floors) first,
so the remaining faces are structurally simpler. Our `stock.py` already implements a
form of this (largest unclaimed planar base face). Good as a *tie-breaker* within a
priority class, poor as a *primary* rule (a huge fillet face would be claimed before a
functionally important hole).

### 5.4 Confidence-based
Assign each recognized feature a confidence score and claim highest-confidence first.
**The literature is wary here.** Our locked D9 ("match/no-match + reason codes, not
'confidence'") rejected fuzzy confidence precisely because it is non-deterministic.
The Wu & Liu critique generalizes this: adding soft criteria ("faces should not be too
far apart") "might still unexpectedly cause the robustness problem" and introduces
semantic vagueness. **Recommendation: keep D9.** Do *not* reintroduce scalar confidence
as an ordering key. Instead use a **discrete priority tier** (Section 5.5) which is
fully deterministic, and reserve hard geometric gates (sizes, connectivity, radii) to
disambiguate within a tier.

### 5.5 Discrete priority tiers (recommended ordering)
A small set of deterministic priority classes, claimed in order:

```
T0  base/stock profile                 (largest unclaimed planar face — already built)
T1  through features (holes, slots)    (structural, unambiguous)
T2  blind/capped subtractive           (holes/pockets with a reported bottom)
T3  fine detail (fillets, chamfers)    (claimed last so they never steal hole walls)
T4  additive (bosses, pads)
```

The key move over today's code: **fillets/chamfers move from wherever they are to the
tail**, because a fillet cylinder is exactly the case that falsely claims a pocket/slot
wall (our blend-mask already attacks this at the wall stage; the priority tier
defends it at the arbitration stage). Within a tier, tie-break by **largest feature
first**, then by **lexicographic face-key** for byte-determinism (our existing
determinism guarantee).

---

## 6. What commercial tools do (public knowledge)

### 6.1 SolidWorks FeatureWorks — greedy suppression re-run, exactly
The most relevant public case because is it the closest product to "recognize imported
STEP geometry." Documented behavior ([SOLIDWORKS FeatureWorks][FW-docs]):

- **Automatic recognition**: "how it works: ... analyzes the imported geometry and
  recognizes features automatically." Successive attempts process **only unrecognized
  portions** — recognized faces are suppressed and the recognizer re-runs on the
  residue. This is the feature-suppression approach (Section 4), in production.
- **Interactive recognition**: the user explicitly selects faces/edges, so the user is
  the *arbiter* of ambiguous claims — e.g. they decide "whether a cylindrical cut is
  recognized as an extrusion, revolve, or hole." When ambiguity resists automatic
  arbitration, the human picks.
- **Feature-type filters**: the user checks which feature classes to even consider
  (Extrudes, Drafts, Revolves, Holes, Fillets/Chamfers, Ribs), shrinking the conflict
  space by excluding irrelevant recognizers — a cheap, effective arbitration lever we
  can mirror via per-fixture feature allow/deny sets.
- **Differentiation of recognition types per feature** (a cylinder is a hole *or* a
  revolve *or* an extrude) confirms that **one shared-face-typed entity has multiple
  valid readings** — exactly our fillet-vs-slot-end situation. FeatureWorks only
  disambiguates these via explicit user type selection or via the automatic priority
  convention (fillets/rounds first, holes after, bosses last).
- **"Chain fillet faces" / "Recognize similar" / "Recognize pattern"** are
  face-chaining constants that pull together fragmented faces (the unification idea
  from Marefat-Kashyap) so a single logical feature isn't split into rival claimants.

Best public references: [SolidWorks help — Automatic vs Interactive][FW-auto],
[Overview of FeatureWorks][FW-overview], [FeatureWorks recognition types][FW-types].

### 6.2 Autodesk FeatureCAM — Automatic Feature Recognition (AFR)
FeatureCAM **does not read source CAD features**; it runs its own AFR to identify
machinable features (pockets, bosses, grooves, chamfers, holes, complex multi-stage
drilling) from imported geometry in any format (STEP, NX, IGES). Its arbitration is
machining-view-first (subtractive/pocket-driven) and includes **IFR (Interactive
Feature Recognition)** for cases AFR mishandles — user picks geometry profiles, i.e.
the human arbitrates again. ([FeatureCAM help][FCAM], [develop3D on FeatureCAM 2009][FCAM09])

### 6.3 Siemens NX
Notably, **NX does not expose a classic one-button CAD feature-recognition converter**
like FeatureWorks. Two relevant mechanisms:

- **Synchronous Modeling** edits un-parameterized STEP geometry "as if parametric"
  (resize a cylindrical face, convert blends) but Siemens is explicit this is *not*
  feature recognition.
- **NX CAM feature identification**: three modes — Formelement (Design-by-Feature),
  Manual (user picks), **Parametric** (auto-recognizes base features). Tests on NX 1872
  found most features recognized, but convex notch rounds and complex contours were
  missed, and NO tested system (NX, Fusion 360, Mastercam) produced STEP-AP-242-
  compliant feature parameters — all use proprietary feature definitions.

**Takeaway for our report:** even the top commercial CAM stack leaves interacting
convex/round features ambiguous and depends on user arbitration. A fully-automatic
deterministic arbiter is a *differentiator*, not a commodity. ([Siemens NX engineering
forum][NX-tips], [eng-tips thread][NX-etips])

---

## 7. Formalizing "face ownership": one face ≤ one feature?

**Question:** can each face belong to at most one feature?

**Short answer:** A *pure* one-face-one-feature partition (a proper set cover of the
face set, faces disjoint across features) is a reasonable **default invariant** for our
subtractive-heavy, machined-part pipeline, and it is what feature suppression
(Section 4) enforces. It gives deterministic soundness: claiming a face removes it from
all other candidates.

**Caveats from the literature:**

1. **The face set is not the delta volume.** A machined feature's "volume" includes
   faces that end up inside the part (the sides of a blind slot's floor) and faces not
   on the part boundary at all. Ownership of *boundary faces* is therefore not identical
   to ownership of *feature volume*. We model features as **face sets** (D5, typed
   parameter objects), so we should scope ownership to **boundary faces**, and accept
   that a feature's implied volume can intrude into the part under another feature
   without violating face ownership.
2. **Suppression forbids sharing.** If we adopt one-face-one-feature, we *cannot* also
   model shared faces (Section 8) for the same face. The two are mutually exclusive —
   pick one policy per face category.
3. **Fragmentation forces piecewise ownership.** When an interaction splits one logical
   face into pieces (Marefat-Kashyap unification, Wu-Liu Figure-1c where face M →
   M1∪M2), the pieces may be owned by different features, so "one face one feature" holds
   only at the *segmented-entity* level, not the *raw imported face* level. For us this
   matters: our faces come straight off the raw STEP B-Rep, so we should do ownership
   on **raw faces** but allow a raw face to be *claimed by a feature that needs only a
   sub-region* — deciding whether that's allowed is an explicit design choice.

**Recommendation:** adopt **one-face-one-feature as the default invariant**, scoped to
raw boundary faces, with an explicit carve-out for a small, controlled class of
*shared* faces (Section 8). This keeps the suppression loop sound and deterministic.

---

## 8. "Shared faces" — one face genuinely serving two features

The classic example from our own model space: a **floor face that is both a pocket
bottom and (part of) the entrance plane of a hole** that sits in that pocket. It is not
a conflict — the hole genuinely needs the pocket floor as its starting face, and the
pocket genuinely needs it as its floor.

**How the literature and tools treat shared faces:**

- **Vandenbrande & Requicha** formalize this as **optional vs required volumes**: a
  feature's *required* volume must be uniquely its own, but its *optional* volume (the
  part that overlaps another feature) is a deliberate casualty of the interaction. The
  shared floor face is an *optional* part of the hole that sits inside the pocket's
  required volume. **Permission to overlap is explicit, not accidental.**
- **FeatureWorks "Recognize similar" / "Up to face" / "End Face 1/2"** — interactive
  termination-face selection lets a user declare that a feature ends *at a face owned by
  another feature* (e.g. a cut "Up to Face" that lands on a boss top). The shared plane
  is thereby sanctioned by construction: the feature *terminates on* the shared face
  rather than owning it.
- In pure **one-face-one-feature** graph matching (JC88, classic AAG), shared faces are
  *the* failure mode — the graph cannot tell you the floor serves two features, so
  recognizers fight over it. This is precisely why interacting-feature recognition is
  hard for graph-only approaches (Han's survey, Section 2.4).

**A workable policy (bottom-up, "entry face" distinction):**

Separate two roles for a face:

- **Structural face** (walls, caps, floors): exclusive ownership — one-face-one-feature.
- **Entry/termination face** (the plane the tool approaches from, or the plane a boss
  mounts onto): *shareable* — a hole may sit on a pocket floor; a pad may mount on the
  base face; a through-hole passes through a stock wall that is itself part of another
  feature.

Implement by *tagging* faces with a role during recognition:
1. Each recognizer reports, per candidate, which of its faces are structural vs
   entry/termination.
2. Arbitration computes exclusivity overlap **only on structural faces**.
3. Entry/termination faces may be claimed by multiple features, but every claimed owner
   must declare the *same* normals-and-domain, and only one owner may treat it as
   structural.

This mirrors optional/required (VR93) and "Up to Face" (FeatureWorks) while staying
deterministic. Risk: a floor could be both structural to the pocket and entry to the
hole *and* be locally planar/ambiguous — mitigate by requiring the shared face be
reported as entry for at most one feature and structural for exactly the pocket that
contains it (resolve via containment geometry).

**Hard rule to keep deterministic:** a face shared by two features must be **planar**
(an approach/termination plane). Cylindrical walls (holes, fillets, slot ends) are
**never** shareable — they are always exclusive structural faces. This kills the
fillet-vs-slot-end ambiguity in one stroke: if it's a cylinder, at most one owner.

---

## 9. Additional formalizations worth knowing

### 9.1 Constraint satisfaction / Set Cover framing
The interpretation problem can be posed as a **minimum-weight set cover** (choose a set
of feature volumes whose union is the delta volume, minimizing cost = number of
features / over-machining). Tseng-Joshi's block reconnection and Wang's block-growth are
heuristic solvers of this optimization. **Feasibility for us: low** — we lack a reliable
stock primitive to define the delta volume, and exact cover is NP-hard; a greedy
approximation is fine but reintroduces ordering decisions better made with our cheap
priority tiers. Treat set-cover as a *conceptual* justification for greedy dominance,
not as an implementation target.

### 9.2 Bayesian / Dempster-Shafer arbitration
The BYB (Bayesian extraction) and Dempster-Shafer literature fuses multiple feature
*evidence* sources into a confidence and picks the MAP interpretation. **Rejected for
v1** (D2/D9: no probabilistic confidence, determinism required). Noted for the future
v2 hybrid/ML track.

### 9.3 Maximum-weighted independent set over candidate features
Another crisp formalization: build a conflict graph where nodes are candidate features
and edges join any two candidates sharing an exclusive (structural) face; solve for a
maximum-weight independent set → a self-consistent set of non-overlapping features.
Weight = a deterministically-ranked priority tier. This is the cleanest *declarative*
mental model for our arbitration, even if we implement it by greedy suppression rather
than exact independent-set solve.

### 9.4 Rule-mutual-exclusivity discipline (Wu & Liu warning)
If you add arbitration rules, keep them **mutually exclusive** and total, or a candidate
may be classified into more than one type and "vagueness would occur." In practice:
every (face, candidate-type) assignment must hit **exactly one** priority tier, never
two, or the greedy loop becomes order-dependent. This is the determinism guardrail for
our priority tiers.

---

## 10. Recommendations for cad_reverse v1.5 (ranked by feasibility)

All recommendations preserve D1–D9 (CadQuery, no LLM, pure Python, OCP-only, typed
params, profile-extrude, small fixtures, per-feature escalation, match/no-match reason
codes, deterministic). None introduces scalar confidence.

### R1 — Add a deterministic feature-claim arbitration layer to `pipeline.py` [TOP PRIORITY, cheapest, highest value]
Add a module `arbitrate.py` that consumes the candidate list from all recognizers and
returns an ownership map. It is **greedy suppression over discrete priority tiers +
exclusive structural-face claiming**:

- Input: all candidate features with their face-key sets and a feature type (already
  available — recognizers output typed params).
- Sort by: priority tier (T0 stock → T1 through → T2 capped → T3 fillet/chamfer → T4
  pad/boss), tie-break largest-then-lexicographic face-key (deterministic).
- Claim faces greedily; a candidate is accepted iff all its **structural** faces are
  still unclaimed; on acceptance, mark them claimed; re-run the recognizers on the
  residual faces once (then stop if nothing new).
- Emit for each face a single owner; raise reason codes where a candidate lost a face
  (`FACE_CLAIMED_BY_STRONGER_FEATURE`) and where a cylinder was claimed by two features
  (`SHARED_CYLINDER_FORBIDDEN`).
- Wire into `reconstruct()` as the new final stage before `order.py`/`emit.py`.
- Add fixtures: a pocket-with-inset-hole (shares the pocket floor as the hole's entry
  plane) and a filleted-box-with-slot that previously produced a false slot-end — both
  must converge with a single consistent ownership map.
- Test count estimate: +8–12 tests (ownership unit tests + 2–3 new roundtrip fixtures).

This single move gives the pipeline an explicit answer to "which feature owns face f?"
that today it lacks. It directly targets the fillet-vs-slot-end and hole-vs-pocket-wall
conflicts named in the prompt.

### R2 — Encode the shareability rule (planar-only, exclusive-cylinder) [HIGH, small]
Implement Section 8's rule: faces are claimed exclusively **except** planar faces that a
feature tags as *entry/termination*, which multiple features may touch but only one may
treat as structural. Cylindrical walls are always exclusive. Steer each recognizer to
already tag entry faces (holes: the entrance plane; pad/boss: the mounting plane; stock:
the base face). This is the policy that lets a hole sit on a pocket floor without an
ownership fight.

### R3 — Move fillet/chamfer priority to the tail [HIGH, trivial]
Reorder our current escalation so blends are attempted *after* subtractive features. The
blend mask already rejects fillets at the wall stage; the arbitration tier is a second,
independent defense that guarantees a fillet cylinder never steals a pocket wall. Low
code; measurable regression check on the filleted-box-with-slot fixture.

### R4 — Per-fixture feature-type allow/deny (mirror FeatureWorks filters) [MEDIUM, config-only]
Expose an option to restrict which recognizers run for a given fixture (e.g. a
pocketed-plate fixture might disable chamfer recognition entirely). This shrinks the
conflict space before arbitration and is trivial to implement as a `feature_types=`
kvarg on `reconstruct()`. Costs nothing to wire and gives downstream users the same
lever FeatureWorks' "Feature Type" filters give.

### R5 — Add residual re-run with a termination guard [MEDIUM]
Add the "re-run on residual faces" step with a hard max-iterations/visited-set guard so
it is guaranteed to terminate (monotone residual). This is what actually rescues
interacting features that a dominant neighbor fragmented. Must be paired with a
deterministic visited set so re-runs are byte-reproducible (our determinism guarantee).

### R6 — Formalize ownership as max-weighted-independent-set for documentation [LOW]
Document the arbitration as choosing a maximum-weight independent set over the candidate
conflict graph (Section 9.3) even though the implementation is greedy suppression. This
gives reviewers/users a precise, defensible definition of "self-consistent feature
interpretation" and a path to a more exact solver in a future v2.

### R7 — Explicitly reject Bayesian/D-S confidence and exact set-cover [LOW / no code]
Record (in this report and the pipeline docs) that probabilistic fusion (Section 9.2)
and exact NP-hard cover solving (Section 9.1) are intentionally out of scope for v1,
consistent with D2/D9. Prevents a future contributor from reintroducing a
non-deterministic scalar-score ordering.

---

## Reference map (URLs)

General B-Rep interacting-feature survey and face-decomposition heuristics:
- Wu & Liu, "Analysis on machined feature recognition techniques based on B-rep" —
  [PDF mirror](https://doi.org/10.1016/0010-4485(95)00075-5) (introduced the 5-family
  classification, global vs local feature definitions, cutter-set arbitration idea).

Foundational papers:
- Joshi & Chang, "Graph-based heuristics for recognition of machined features from a 3D
  solid model", CAD 1988 —
  [Semantic Scholar](https://www.semanticscholar.org/paper/Graph-based-heuristics-for-recognition-of-machined-Joshi-Chang/98ca8a56a268277fd926b903171fb2e340ee2fc4)
  and [DOI](https://doi.org/10.1016/0010-4485(88)90050-4).
- Vandenbrande & Requicha, "Spatial Reasoning for the Automatic Recognition of
  Machinable Features in Solid Models", IEEE TPAMI 15(12) 1993 —
  [DOI](https://doi.org/10.1109/34.250844) /
  [Scholar mirror](https://www.ablesci.com/scholar/paper?id=3jZ6XZBl3) (hints,
  generate-and-test, feature completion, optional/required volumes).
- Han, Pratt, Regli, "Manufacturing feature recognition from solid models: a status
  report" (IEEE Trans. Robotics & Automation, 2000) — the canonical survey framing
  interacting-feature recognition as the critical issue; Han's "alternatives on demand"
  vs "optimal interpretation" ([citation via WPI](http://web.cs.wpi.edu/~dcb/Papers/ASME-DTM03-48684.pdf)).
- Shah & Mäntylä, *Parametric and Feature-Based CAD/CAM*, 1995 — features carry
  engineering meaning; ambiguity is inherent (feature = a "view" of the design).

Hybrid / interacting-feature extensions:
- Gao & Shah, "Recognition of interacting milling features" — MCSG hints.
- Rahmani & Arezoo, "A hybrid hint-based and graph-based framework for recognition of
  interacting milling features" — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0166361506001059)
  (cavity-feature volumes, base-face recovery).
- Tseng & Joshi — volume decomposition & reconstruction for multiple interpretations of
  interacting pockets.
- Marefat & Kashyap — cavity graphs, face unification, virtual links (interacting
  nesting depressions/protrusions).

Commercial:
- **SolidWorks FeatureWorks** help:
  [Automatic vs Interactive](https://help.solidworks.com/2026/english/Solidworks/fworks/c_automatic_versus_interactive_feature_recognition.htm),
  [Overview](https://help.solidworks.com/2026/english/SolidWorks/fworks/c_Overview_of_FeatureWorks.htm),
  [Recognition Types](https://help.solidworks.com/2026/english/solidworks/fworks/c_recognition_types.htm),
  [Step-by-step recognition](https://help.solidworks.com/2025/english/Solidworks/fworks/Step_by_Step_Recognition.htm),
  [Recognizing patterns](https://help.solidworks.com/2026/english/Solidworks/fworks/t_recognizing_patterns.htm).
- **FeatureCAM** help:
  [Import options](https://help.autodesk.com/view/FCAM/2025/ENU/?guid=GUID-717BE6FC-E2A0-4C5F-B9C6-0DC6A4E38EAF);
  Delcam FeatureCAM 2009 review — [develop3d](https://develop3d.com/prototype/delcam-featurecam-2009/).
- **Siemens NX** (synchronous modeling is not FR; CAM parametric feature ID):
  [NX forum re: un-parameterized imported features](https://support.sw.siemens.com/en-US/okba/PL8003891/Open-SolidWorks-data-produces-only-unparameterized-features-Any-more-elegant-solution/index.html),
  [eng-tips FR thread](https://www.eng-tips.com/threads/feature-recognition.456937/).

---

## Appendix — A, B, C of the conceptual model (quick reminder)

- **A. Candidate** = one recognizer's output: feature type + typed params + ordered
  face-key list (already the shape of our recognizer output). Arbitration operates on
  candidates, not raw faces.
- **B. Conflict** = two candidates whose *exclusive (structural)* face sets intersect.
  Cylinder faces always conflict when shared; planar faces conflict only when both claim
  them structurally (Section 8).
- **C. Policy** = greedy suppression over priority tiers (R1) + planar-only sharing (R2)
  + residual re-run (R5). Deterministic by construction: fixed tier order, largest-then-
  lexicographic tie-break, monotone residual.

---

[FW-docs]: https://help.solidworks.com/2026/english/Solidworks/fworks/c_Overview_of_FeatureWorks.htm
[FW-auto]: https://help.solidworks.com/2026/english/Solidworks/fworks/c_automatic_versus_interactive_feature_recognition.htm
[FW-overview]: https://help.solidworks.com/2026/english/SolidWorks/fworks/c_Overview_of_FeatureWorks.htm
[FW-types]: https://help.solidworks.com/2026/english/solidworks/fworks/c_recognition_types.htm
[FCAM]: https://help.autodesk.com/view/FCAM/2025/ENU/?guid=GUID-717BE6FC-E2A0-4C5F-B9C6-0DC6A4E38EAF
[FCAM09]: https://develop3d.com/prototype/delcam-featurecam-2009/
[NX-tips]: https://support.sw.siemens.com/en-US/okba/PL8003891/Open-SolidWorks-data-produces-only-unparameterized-features-Any-more-elegant-solution/index.html
[NX-etips]: https://www.eng-tips.com/threads/feature-recognition.456937/
