---
{
  "format": 1,
  "metadata": {
    "id": "archived-09-hybrid-ml-face-classification-for-pocket-trigger-feasibility-study-7bec55b6",
    "title": "09 — Hybrid ML Face Classification for Pocket Trigger: Feasibility Study",
    "question": "What findings, alternatives and limitations does the historical investigation document about 09 — Hybrid ML Face Classification for Pocket Trigger: Feasibility Study?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: 09 — Hybrid ML Face Classification for Pocket Trigger: Feasibility Study. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of 09 — Hybrid ML Face Classification for Pocket Trigger: Feasibility Study; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:43.361Z"
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
  "sourceDigest": "7bec55b6e6787b106a39804c9969d634e31cb26858e0c24b2e2256a017e169f8",
  "proposalRevision": "e0e146b241f368085c9b7440276d9d4948eaebcbeac0a5e199a40f7391660ae0"
}
---
# 09 — Hybrid ML Face Classification for Pocket Trigger: Feasibility Study

**Issue #14 — Phase 1 & Phase 2 findings.**  Pure research: no production code
changed, no `src/` file touched, no `pip install`, no `cad/` import.
Deterministic symdiff gate is untouched and remains authoritative.

Date: 2026-08-06.

---

## 1. Research question

Can a lightweight, dependency-free ML face classifier label AAG faces better
than the pure-deterministic recognizers — and, specifically, is the single
hardest sub-problem (separating `hole_floor` from `pocket_floor`, the root
cause of 5/6 PARTIAL fixtures) learnable from geometry at low cost?

## 2. Method (what was actually built)

Three scripts under `scripts/` (+ a private engine `scripts/_common.py` and a
dependency-light k-NN `scripts/_model.py`). Environment probed first: **no
sklearn / torch / onnx**, so the only feasible ML route is a hand-rolled
**scipy cKDTree k-NN** (guardrail #2 → dependency-free).

- `scripts/generate_training_data.py` (D1)
- `scripts/train_classifier.py` (D2)
- `scripts/benchmark_classifier.py` (D3)

**Ground truth** comes from CadQuery construction history: each build is walked
op-by-op; faces created by an op are found with `TopoDS_Face.IsSame` against the
prior state, then labelled by the op + a signed-geometry disambiguator (floor
below entry plane, pad-top above, through-caps at the ±Z extremes are stock).
AAG keys are always re-derived from the final AAG at labelling time (pitfall #2).

**12-D per-face feature vector** (schema fixed in `_common.FEATURE_NAMES`):
`surf_plane, surf_cylinder, log_area, bbox_aspect_k, normal_major_xyz (3),
n_neighbors, n_convex, n_concave, n_smooth, log_centroid_z_rel`.

**8 label classes:** `stock, pocket_floor, pocket_wall, hole_floor, hole_wall,
pad_top, pad_wall, blend`.

## 3. Corpus (D1) — seed 20260806

- **1343 labelled faces** from 130 synthetic parts (13 fixture families × 10
  seeded variants each) → ≥300 target met, ≥3 variants/family met, all 8
  classes present, deterministic (byte-identical CSV on re-run, verified).
- Families: box, rect/circular pockets, slots, blind/through holes, cbore, csk,
  rect/circular pads, fillet, chamfer, composite (pocket+hole+pad).
- The **16 benchmarks fixtures are wholly excluded** from training (guardrail #5).

| class        | n    |
|--------------|------|
| stock        | 660  |
| pocket_floor | 45   |
| pocket_wall  | 172  |
| hole_floor   | 39   |
| hole_wall    | 119  |
| pad_top      | 33   |
| pad_wall     | 75   |
| blend        | 200  |

## 4. Training + ablation (D2)

k-NN swept over `k ∈ {3,5,7} × normalise ∈ {True,False}`; best by **validation
(virgin 20% split, seed 20260806) macro-F1** → `k=3, normalise=True,
class-weighted votes`.

**Validation (held-out 20%, not the fixtures):**
- accuracy 0.985, macro-F1 0.948 (per run print: stock P=0.98/R=0.92,
  pocket_wall 0.968/0.882, hole_wall 0.960/1.0, pad_wall 0.824/0.933,
  blend 0.776/0.950; floors & pad_top all 1.0/1.0)

**Feature ablation (drop each feature → Δ macro-F1 on val):**
- `bbox_aspect_k` +0.023, `log_area` +0.021, `n_concave` +0.014 are the most
  informative.
- `surf_cylinder`, `surf_plane`, `normal_major_xyz`, `n_neighbors` → Δ ≈ 0.
- **Implication:** the surface-type one-hot adds ~0 signal beyond the geometric
  stats — the "always-PLANE-as-stock" atomic baseline the plan worried about is
  *not* what separates classes; it is shape (area, aspect, concavity) that does.

## 5. Held-out 16-fixture benchmark (D3) — honest, no tuning on fixtures

Per-fixture results below use **full-coverage** ground truth (`label_all_aag`):
every face of the final AAG is labelled (new faces via history, untouched faces
default to stock). This is stricter than delta-only labelling.

| fixture                        | n_faces | face_acc |
|--------------------------------|---------|----------|
| box                            | 6       | 1.000    |
| box_with_hole                  | 10      | 0.800    |
| filleted_box                   | 10      | 1.000    |
| filleted_box_with_holes        | 14      | **0.357** |
| l_bracket                      | 8       | **0.625** |
| chamfered_block                | 10      | 0.800    |
| blind_hole_block               | 8       | 0.500    |
| cbore_block                    | 9       | 0.444    |
| csk_block                      | 8       | 0.375    |
| boss_shape                     | 8       | 0.250    |
| slotted_plate                  | 16      | 1.000    |
| plate_with_pad                 | 11      | 1.000    |
| pocketed_plate                 | 16      | 1.000    |
| circular_pocket_plate          | 8       | 0.875    |
| pocketed_plate_with_circular   | 13      | 0.846    |
| mixed_hole_part                | 14      | 0.929    |

Overall: **accuracy 0.763, macro-F1 0.804, weighted-F1 0.785.**

Per-class on the 16 fixtures (P / R / F1, support):

| class        | P     | R     | F1    | n |
|--------------|-------|-------|-------|---|
| stock        | 0.965 | 0.611 | 0.748 | 90 |
| pocket_floor | 1.000 | 1.000 | 1.000 | 7  |
| pocket_wall  | 1.000 | 0.909 | 0.952 | 22 |
| hole_floor   | 1.000 | 1.000 | 1.000 | 4  |
| hole_wall    | 0.950 | 1.000 | 0.974 | 19 |
| pad_top      | 0.400 | 1.000 | 0.571 | 2  |
| pad_wall     | 0.571 | 0.800 | 0.667 | 5  |
| blend        | 0.367 | 0.900 | 0.522 | 20 |

### Full 8×8 confusion matrix (real counts)

```
            stock  pocket_floor pocket_wall hole_floor hole_wall pad_top pad_wall blend
stock          55      0           0          0          0       3        1     31
pocket_floor    0      7           0          0          0       0        0      0
pocket_wall     0      0          20          0          0       0        2      0
hole_floor      0      0           0          4          0       0        0      0
hole_wall       0      0           0          0         19       0        0      0
pad_top         0      0           0          0          0       2        0      0
pad_wall        0      0           0          0          1       0        4      0
blend           2      0           0          0          0       0        0     18
```

**The confusion is almost entirely `stock → blend` (31 of 90 stock faces are
classified blending), plus a few `pad_* → *_wall` and `blend → stock` swaps.**
Every floor, wall, and the two crux classes are essentially clean.

## 6. Go / no-go evaluation

### G1 — floor disambiguation (the crux; the PARTIAL root cause)
- `hole_floor` recall  = **1.000** (n=4)   (≥ 0.85 ✓)
- `pocket_floor` recall = **1.000** (n=7)  (≥ 0.85 ✓)
- cross-pair confusion  = **0.000** (0 hole→pocket, 0 pocket→hole; ≤ 10% ✓)

**G1: PASS.** The single hardest sub-problem — the one behind the 5/6 PARTIAL
fixtures — is cleanly learnable from 12-D geometry on a tiny synthetic corpus.

### G2 — no CONVERGED regression
Per-CONVERGED-fixture face accuracy shown in §5 (CONVERGED set from
`test_roundtrip`): **8 of 12 CONVERGED fixtures fall below 0.95** — failures are
driven almost exclusively by the `stock → blend` confusion (e.g.
`filleted_box_with_holes` 0.357, `boss_shape` 0.250, `csk_block` 0.375).

**G2: FAIL.** The 12-D geometry-only k-NN cannot reliably separate the large
base `stock` planar faces from `blend` fillet/chamfer ribbons on parts that
carry both — exactly the parts the deterministic pipeline already converges.

### G3 — beats the surf_type-only baseline
- ML k-NN accuracy  = **0.7633**
- surf_type baseline (Plane→stock, Cylinder→hole_wall, else→blend) = 0.6213
- improvement = **+0.142** pts (≥ +0.10 ✓)

**G3: PASS.**

### Verdict

The plan's AND-gate requires G1 ∧ G2 ∧ G3 to approve general Phase-2
integration. **G2 fails, so a full-featured ML-driven labeler is NO-GO.** The
report is honest about this: a geometry-only k-NN on ~1.3k synthetic faces is
not yet reliable enough to *drive* deterministic parameter extraction without
regressing currently-CONVERGED parts.

But G1's decisive pass is the pivotal, decision-grade finding: **the one
sub-problem that most limits the deterministic pipeline today
(`hole_floor` vs `pocket_floor`) is near-perfectly separable (1.000/1.000
recall, 0% cross-confusion)** even from pure geometry.

**Recommended Phase-2 (narrow, advisory, conditional):**
- Deploy the k-NN **only** as an advisory floor-annotation layer on fixtures the
  deterministic pocket trigger has already reported as PARTIAL — in that zone a
  wrong floor label degrades an already-failed result and can never regress a
  CONVERGED one.
- Keep the deterministic recognizers + `symdiff` as the unconditional final gate
  (pitfall #6). ML never overrides a CONVERGED verdict.
- Do **not** use ML to choose stock, blend, pad, or wall faces — that path fails
  G2 and is where the deterministic code already excels.

### What would be needed to flip G2 (documented honestly)
1. **Per-face curvature / planarity signal** — the model has no convexity of the
   face *itself*, only of its neighbour edges; `surf_cylinder` is present but
   adds Δ≈0 under the selection, so fillet ribbons and flat faces are confused.
   A few principled features (face Gaussian curvature buckets, mean-curvature
   sign, a `convex/concave` per-face flag from a planar-fit residual, or a 13th
   "is the face a ruled/cyclic surface" bit) are the single most-likely cheap win.
2. **Larger + more balanced corpus** — `blend` (200) and pure-`stock` rows
   dominate; pad/blend rare-tail classes have 0.57/0.36 precision.
3. **A real GNN / UV-grid (BRepNet-style)** if the goal becomes full face
   labelling — out of scope without `torch` (guardrail #2) and unjustified until
   the cheap features above are exhausted.

## 7. Guardrails & honesty check
- No `src/` file modified; scripts/ and data/ only. Tests untouched.
- No `pip install`; only numpy/scipy/pandas/cadquery (+ OCP).
- No `cad/` import; `cad_reverse` imported read-only.
- Low numbers reported verbatim (G2 failures, blend precision 0.367). No
  cherry-picking: the held-out 16 were never in training, never tuned on.

## 8. Raw artifacts
- `data/faces_labeled.csv` (1343 rows × 20 cols)
- `data/parts_log.json`, `data/knn_model.npz`, `data/train_summary.json`,
  `data/benchmark_results.json`
