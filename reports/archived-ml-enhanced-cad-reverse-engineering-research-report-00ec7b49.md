---
{
  "format": 1,
  "metadata": {
    "id": "archived-ml-enhanced-cad-reverse-engineering-research-report-00ec7b49",
    "title": "ML-Enhanced CAD Reverse Engineering: Research Report",
    "question": "What findings, alternatives and limitations does the historical investigation document about ML-Enhanced CAD Reverse Engineering: Research Report?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: ML-Enhanced CAD Reverse Engineering: Research Report. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of ML-Enhanced CAD Reverse Engineering: Research Report; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:44.628Z"
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
  "sourceDigest": "00ec7b49fff096fa857304a6a0f77b0e4714d3cca49bdfbcef99353ccae24081",
  "proposalRevision": "f54b10d919fbff683f84d700cea42ac32359dbb13585325acf7a2b5526d834df"
}
---
# ML-Enhanced CAD Reverse Engineering: Research Report

**Date:** 2026-08-08
**Agent:** Research squad — ML-enhanced recognition feasibility
**Status:** Complete

Grounded in six parallel web-research agents covering BRepNet/GNNs/point-cloud/transformers/datasets/local-ML, plus inspection of the existing Issue #14 feasibility study.

## Executive summary

The library already went further than the briefing suggests. Issue #14 built and evaluated a **dependency-free scipy k-NN** on **1,343 labeled faces / 130 synthetic parts**, and its go/no-go verdict is the most important finding:

- **Passed (G1):** separating `hole_floor` from `pocket_floor` — the root cause of 5/6 PARTIAL fixtures — is near-perfectly learnable from geometry (recall 1.000/1.000, 0% cross-confusion).
- **Failed (G2):** the 12-D geometry-only k-NN cannot separate large base `stock` planar faces from `blend` fillet/chamfer ribbons (confusion mostly `stock→blend`, 31 of 90 stock faces). Overall held-out accuracy 0.763.

**Recommendation:** the right answer is NOT "no ML" and NOT "big ML." It is a **narrow, advisory, confidence-gated ML layer** that complements (never overrides) the deterministic engine. The sweet spot is a **tiny gradient-boosted / random-forest classifier on an enriched per-face feature vector**, not a GNN or a transformer.

---

## 1. Hybrid architectures — ML as advisor, not primary recognizer

Three integration patterns, in increasing risk:

1. **ML proposes candidates → deterministic gates verify/reject.** ML ranks faces by class probability; rule-based recognizer accepts only proposals that pass geometric invariants. `arbitrate.py` suppression loop + `symdiff` oracle are the natural rejection gates.
2. **ML resolves ambiguities only.** G1 zone: deploy ML solely to annotate faces on parts the deterministic pocket trigger already flags as PARTIAL. Zero regression risk.
3. **ML ranks alternatives / priors for ordering.** Feed per-face operation labels as hard priors into `order.py`'s precedence DAG.

**Confidence thresholds are the key interface.** Only accept ML when `max prob ≥ threshold` (e.g. 0.9); below that, fall through to deterministic. Threshold + deterministic fallback preserves byte-identical determinism.

## 2. Graph neural networks on the AAG — real and mature, but not your v2

- **AAGNet** (RCIM 2024) — 99.15% semantic accuracy on MFInstSeg. Node features mirror yours.
- **BRepGAT** (2023) — graph-attention segmentation, 99.1% on MFCAD18++.
- **FeatureFox** (arxiv 2024) — edge classifier + connected-components recovery instead of deep GNN. **PQ > 0.9 with only ~250 training parts**, trains in seconds on CPU.

**Practical reality:** a pure-NumPy GCN forward pass (2 layers, 64 hidden) on a 20-100 node graph is sub-millisecond to a few ms on CPU. But for a 15-dim feature per face, a GCN is overkill — an MLP on the feature vector matches the budget. A GNN is the **v3 path if the cheap feature classifier plateaus**.

**Key caution from Issue #14:** the `stock→blend` confusion is a *per-face self-geometry* problem, not a neighborhood problem — a GNN is the wrong next bet for your specific failure.

## 3. Point cloud / mesh methods — lowest ceiling

PointNet++ on CAD face segmentation: only 74.0% per-face accuracy / 34.8% IoU — far below B-Rep-aware models. Only consider for geometrically indistinguishable edge cases.

## 4. Transformer architectures — all generative, none do STEP→code

DeepCAD/SkexGen/TANGO, SolidGen, AutoBrep/BrepARG/DTGBrepGen, CAD-SIGNet — all generative or point-cloud→sequence. None fit local, deterministic, editable-CadQuery niche.

## 5. BRepNet and successors — state of the art for full face labeling

- **BRepNet** (CVPR 2021, Autodesk): 92.52% face accuracy / 77.10% mIoU on Fusion 360 Gallery (35,858 B-Reps). Only 359k params — CPU-inferrable. **BUT:** CC BY-NC-SA 4.0 (non-commercial), trained on Fusion 360 operation taxonomy that doesn't map 1:1 onto your geometric classes.
- **UV-Net** (CVPR 2021, **MIT license**, explicit **CPU support**) — the low-friction, truly-open starting point.
- **BrepMFR** (transformer+GNN, transfer learning), **BRep2Shape** (self-supervised dual-transformer on 250k B-Reps, 2026).

BRepNet-class models give per-face operation priors but need PyTorch + ~GB-scale training + different label taxonomy. **Not v2.**

## 6. Training data — you have a decisive advantage already proven

- **Fusion 360 Gallery Segmentation** (35,680 B-Reps): canonical B-Rep segmentation benchmark; operation-derived classes don't match yours.
- **MFCAD++** (59,665 STEPs): best per-face machining-feature labels but known-dirty topologies.
- **ABC** (1M models): vast STEP source but **no per-face semantic labels**.
- **Your synthetic approach is the right primary** — Issue #14 proved the mechanism: `_common.py::label_part` labels every face from CadQuery construction history via `TopoDS_Face.IsSame`, giving per-face ground truth for free.

**Covariate shift caveat:** your generator distribution is narrow and "too clean." Mitigations: (a) hand-author "ugly" and failure-mode fixtures; (b) broad random parameter sweeps; (c) keep a public set (MFCAD++/Fusion 360) as held-out real-world eval.

## 7. LLM code generation — radical, least deterministic

- **CAD-Coder** (MIT, 2025): LLaVA-style VLM on 163,671 image+CadQuery pairs, claims 100% syntax validity, IoU 0.675. Failure modes: wrong dimensions, 4096-token truncation, catastrophic API forgetting.
- **Documented LLM CAD failures:** hallucinated dimensions, non-watertight geometry, topological approximation, spatial-reasoning errors (Z-up vs Y-up), API fragility (~60% rewritten).

**Bottom line:** generate→render→measure-symdiff→repair harness is researchably interesting but non-deterministic by construction. Belongs firmly **outside** v1/v2.

## 8. On-device models — everything trivially local

- **Latency:** sub-millisecond per-face for any sklearn/LightGBM/ONNX model. Even CPU GNN ~19-23ms/graph.
- **ONNX Runtime:** single `pip install onnxruntime` CPU wheel; export sklearn via `skl2onnx`, PyTorch via `torch.onnx.export`.
- **scikit-learn** (RF/GradientBoosting/MLP/k-NN): ample for 12-15-dim, sub-10k-example problem.
- **Pragmatic v2 deployment:** scipy k-NN (already built, dependency-free, proven) upgraded with enriched features — no new runtime dependency.

## 9. Active learning from user corrections

- **Don't retrain online** — accumulate corrections + re-`fit()`. Dataset is tiny, full `fit()` is fast.
- **Pattern:** run ML; gate with `predict_proba` on confidence threshold; persist corrections log keyed by hashed feature signature; replay on next batch `fit()`. Persist via `joblib.dump`.
- Fully local, deterministic (batch re-fit is reproducible).

## 10. Decision trees / rule learning

Training a DecisionTree/RandomForest then **transpiling learned rules to Python if/else chains** preserves determinism. But:
- Transpiling shallow trees is feasible; deep forests quickly become unmaintainable.
- The **confidence-gated ML-advisor** pattern is strictly more compatible — gating adds an advisory signal the deterministic gate accepts/rejects, without sacrificing determinism.
- Transpilation is fallback only if you must guarantee no runtime ML dependency at all.

---

## 11. Recommendation — the sweet spot

**Primary answer: a narrow, advisory, confidence-gated classifier — NOT a GNN/transformer — for the specific "hard sub-problem" the deterministic engine can't crack today.**

### Recommended v2 (practical, achievable):

1. **Keep determinism as the unconditional gate.** Deterministic recognizers + `symdiff`/watertight oracle stay authoritative. ML never overrides CONVERGED verdict.
2. **Start where Issue #14 already proved value (G1):** deploy k-NN / gradient-boosted classifier **only** as advisory `hole_floor` vs `pocket_floor` annotator on fixtures flagged PARTIAL. Zero regression risk.
3. **Flip G2 with cheap features first:** add per-face **Gaussian/mean-curvature sign, convex/concave per-face flag from planar-fit residual, and "ruled/cyclic surface" bit**. Small `FEATURE_NAMES` extension in `_common.py`, re-train, re-benchmark. Strong reason to believe these break `stock→blend` confusion (fillet ribbons have nonzero mean curvature; flat stock faces are planar).
4. **Broaden the corpus** — more seeded variants, failure-mode fixtures, validate on real-world held-out STEP set (MFCAD++/Fusion 360).
5. **Add confidence-gated advisory + active learning** from user corrections (corrections log + batch re-fit), keeping deterministic fallback.

**The "no ML" option is wrong** — G1 is a decisive finding that a cheap model solves a real current limitation. **The "big ML" option is wrong** — GNNs/transformers/BRepNet are overkill for the actual failure (per-face self-geometry problem) and need data/GPU/deps you don't want.

**Where a GNN/BRepNet belongs:** if the cheap-feature classifier plateaus, graduate to **UV-Net (MIT, CPU-ready)** or **FeatureFox (~250 parts)** as **v3**.

### Key files
- `research/09_ml_classifier_feasibility.md` — Issue #14 go/no-go (G1 pass, G2 fail)
- `scripts/_common.py` — feature vector (12-D) + history-based face labeling
- `scripts/_model.py` — dependency-free scipy cKDTree k-NN baseline
- `scripts/{generate_training_data,train_classifier,benchmark_classifier}.py` — working train/bench harness
- `data/` — 1,343-row `faces_labeled.csv`, `knn_model.npz`, `benchmark_results.json`
