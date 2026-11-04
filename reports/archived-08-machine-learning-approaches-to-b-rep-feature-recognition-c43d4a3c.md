---
{
  "format": 1,
  "metadata": {
    "id": "archived-08-machine-learning-approaches-to-b-rep-feature-recognition-c43d4a3c",
    "title": "08 — Machine-Learning Approaches to B-Rep Feature Recognition",
    "question": "What findings, alternatives and limitations does the historical investigation document about 08 — Machine-Learning Approaches to B-Rep Feature Recognition?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: 08 — Machine-Learning Approaches to B-Rep Feature Recognition. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of 08 — Machine-Learning Approaches to B-Rep Feature Recognition; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:46.181Z"
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
  "sourceDigest": "c43d4a3c94a3fdbcaf15dc09c2ee3468c32b4ae34264dffe9821e10fdd44aa3b",
  "proposalRevision": "5657a7dcc9d0f7e0dd32065fbde814467d3a2b8dbae941d6891ab69ed1188bb7"
}
---
# 08 — Machine-Learning Approaches to B-Rep Feature Recognition

**Reference compiled 2026-08-06** — deep-web research on the modern ML/DL landscape for
B-Rep machining feature recognition, multi-feature parts, and whether/how we should
integrate ML into our **deterministic** STEP→CadQuery pipeline (`cad_reverse`).

> This report updates and, where the field moved, supersedes the purely-advisory verdict
> in `research/09_ml_classifier_feasibility.md` (our Issue #14 scipy k-NN study: 1,343 faces,
> 12-D features, G1 floor-disambiguation PASS / G2 stock→blend FAIL, full integration NO-GO).
> It asks: **what is actually possible in August 2026**, what changed since 2021's UV-Net/BRepNet,
> and what is the *minimum viable* ML integration point — as a **face arbitrator**, not a
> pipeline replacement.

---

## Executive Summary

The ML landscape for B-Rep feature recognition has **converged and drammented since 2021**.
The foundations (UV-Net, BRepNet — both CVPR 2021) are now joined by a second generation of
hierarchical/attention/multi-task GNNs (Hierarchical CADNet, AAGNet, BRepGAT, BRT, BrepMFR,
DeepFeature) that push **multi-feature** and **intersecting-feature** accuracy to
**~97–99.5%** on the synthetic benchmarks (MFCAD / MFCAD++ / MFInstSeg / CADSynth).

But three hard realities frame how this should land in `cad_reverse`:

1. **The benchmark numbers are on synthetic, cuboid-blank, Boolean-carved datasets** (MFCAD
   family). Transfer to real SolidWorks/NX STEP files is the *unsolved* part — papers report
   visible degradation synthetic→real without explicit domain adaptation (BrepMFR exists
   *precisely* to fix this and is itself 2024+).
2. **ML's sweet spot is face classification / segmentation — not parameter extraction.**
   No published method emits the full parametric definition (width/depth/center/orientation)
   needed to *drive* our CadQuery emitter. ML predicts "this face is a pocket floor"; rules
   still must recover exact dimensions. This matches exactly what our Issue #14 showed.
3. **Efficient inferring an arbitrator.** The most defensible v2 integration is a **BRepNet
   or Hierarchical-CADNet-style face classifier** that takes our AAG (which we already build
   in `aag.py`) and returns per-face posterior probabilities to **resolve conflicts and
   disambiguate** our deterministic recognizers — the exact `stock↔blend` and
   `hole_floor↔pocket_floor` confusions — while the deterministic pipeline + `symdiff` gate
   stays authoritative.

**Verdict (recommended):** Do **not** replace the rule-based core for v2. Do invest in a
**narrow, GPU-optional, GNN face-arbitrator** trained on a curated synthetic corpus (we
already own the AAG + ground-truth labelling harness from Issue #14), deployed **only** as an
advisory conflict-resolver that never overrides a CONVERGED verdict. This is the minimum
viable ML integration point and the one with the highest return on our existing investment.

---

## 1. Graph Neural Networks on B-Rep — State of the Art

B-Rep GNNs learn directly on topology (faces↔edges↔vertices), avoiding the information loss of
voxel/point-cloud/mesh approximation. Two 2021 seeds define the paradigm; a second generation
extends them.

### 1.1 The two foundations (CVPR 2021)

**UV-Net** (Jayaraman et al., CVPR 2021) — exploits the **U/V parameter domains** of B-Rep
curves/surfaces. Node features = sampled **UV-grid** per face (`N×N×7`: surface point xyz,
normal xyz, trim mask); edge features = sampled **1D curves** (`N×6`: point + tangent).
Couples 2D-image and graph convs. Introduced the synthetic **SolidLetters** dataset;
generalizes across five datasets. Directly reusable for face classification + segmentation.

**BRepNet** (Lambourne et al., CVPR 2021) — **topological message passing** over the B-Rep
(face-adjacency) structure to segment faces into features (holes, pockets, bosses, fillets).
This is the architecture closest to **our AAG**: it consumes exactly the adjacency/of-convexity
structure we already compute.

### 1.2 Second generation (2022–2026) — multi-feature & multi-task

| Model | Year | Key idea | Segmentation capability | Reported precision |
|-------|------|----------|------------------------|--------------------|
| **Hierarchical CADNet** (Colligan et al., QUB) | 2022 | Hierarchical graph: B-Rep face-adjacency **+** triangle-facet (STL) geometry level, with persistent cross-links | Semantic (face-level) | 97.37% acc / face on MFCAD++ (Edge); 99.99% on MFCAD |
| **AAGNet** (Wu et al., RCIM 2024) | 2024 | Geometric AAG (gAAG); **multi-task**: semantic + **instance** + bottom-face segmentation; MFInstSeg dataset | Semantic + **instance** | 99.99% MFCAD / 99.09% MFCAD++ (class); mIoU 82.45 on Fusion 360 |
| **BRepGAT** | ~2024 | Graph attention network | Semantic | 99.1% on MFCAD18++ |
| **BRT** (B-rep transformer) | ~2024 | Transformer on triangular Bézier patches + Bézier curves | Semantic | 99.26% on MFCAD++ |
| **BrepMFR** (Zhang et al.) | 2024 | Transformer + graph attention + **domain adaptation** (synthetic→real); CADSynth dataset | Semantic | SOTA incl. real mechanical parts |
| **DeepFeature** (hybrid) | 2024 | Rules + GNN; decomposes **interacting features** with multiple base planes into isolated features | Semantic | High, robust on interactions |

**Key architectural shift for multi-feature parts:** the second generation moves from flat
face-adjacency classification (UV-Net/BRepNet) to **hierarchical graphs** (B-Rep level +
facet/geometry level) and **explicit instance segmentation** (AAGNet) — precisely because
grouping faces into *distinct feature instances* on a multi-feature part is harder than
labeling each face in isolation.

### 1.3 Point-cloud / mesh routes (for completeness)

- **PointNet++/DGCNN**: strong generic baselines; on MFCAD++ only ~85–86% (far below
  B-Rep GNNs) because they discard exact topology.
- **Hierarchical CADNet ablation**: removing the B-Rep graph level drops accuracy ~75%;
  removing the mesh/facet level drops ~93% → both levels matter, but **the B-Rep topology is
  the biggest win**.
- **CAD-LEAP / mesh-mamba-etc.**: 2024+ mesh-native networks exist but remain below
  B-Rep-native on feature recognition.
- The name **"Point2FF"** (from our Issue list) did not surface as a distinct published model;
  the closest well-known point-wise feature-field works are **PurePointCloud-GNN** and the
  MFR CNN basin. Treat it as a research conjecture, not a settled artifact.

---

## 2. Face-level classification vs Feature-level segmentation — which wins

**Short answer: face-level semantic classification is the proven, dominant paradigm.**
It is the first stage in every top architecture, and it is the only paradigm with clean
reported numbers (>99% on MFCAD-family).

- **Face-level** (classify each B-Rep face → feature-type label, then group/instance later):
  UV-Net, BRepNet, Hierarchical CADNet, BRepGAT, DeepFeature, BrepMFR all use it. It matches
  the *old* AAG/hint-and-grammar literature's "label faces, then group" pipeline.
- **Feature-level / instance segmentation** (directly predict feature boundaries / instances):
  the frontier (AAGNet's instance branch). But it is built **on top of** face classification,
  not instead of it — AAGNet still needs the face-level semantic branch to seed instances.
- **Direct boundary prediction** (regress feature boundary edges/vertices, no per-face labels)
  is rare and immature; no competitive method leads with it.

**Implication for us:** our Issue #14 already operated at exactly the right level — per-AAG-face
classification into `stock / pocket_floor / pocket_wall / hole_floor / hole_wall / pad_top /
pad_wall / blend`. The research confirms this is the correct and the field-standard level.
What we lacked was a *graph-aware* (contextual) model and enough data — not the paradigm.

---

## 3. AAG + GNN hybrids — can we encode our AAG?

**Yes — and this is the single most important, directly-actionable finding.**

Everything we compute today in `aag.py` (nodes = faces with surface type + area + centroid,
edges = adjacency with **concave/convex/smooth** convexity from `ocp_utils.convexity_*` /
ChFi3d) is **exactly** the gAAG input that AAGNet, BRepGAT, DeepFeature and others consume.

Available encodings, in rising fidelity:
1. **AAGNet-style gAAG**: node features = face surface type / area / centroid; edge features =
   convexity (concave/convex/smooth). This is essentially *our AAG as-is*. GapNet/attention
   layers then classify faces. **Lowest barrier, highest match to our existing graph.**
2. **BRepNet-style face-adjacency with edge convexity types**: standard PyTorch message passing,
   no geometric graph lib required (see §7). Drop-in for our AAG.
3. **UV-Net-style UV-grids**: adds the full parametric surface geometry sampled to an `N×N×7`
   grid (in practice a much richer per-face input at higher compute/data cost).
4. **Hierarchical-CADNet style**: fuses the B-Rep graph *with* a triangle-facet (STL) level.
   Best accuracy on MFCAD++, but needs mesh sampling we don't currently do; most infrastructure
   cost.

**Concretely:** our AAG + convexity is a valid, published-architecture input today. A
Graph-Attention or BRepNet-style message-passing classifier over it is the minimal, faithful
upgrade from the Issue #14 k-NN. The k-NN's core failure (stock↔blend) is precisely the
failure mode that **contextual graph message passing fixes** — "blend" is defined by its
*smooth adjacent faces*, which a GNN explicitly aggregates.

---

## 4. Training data problem

The field ships **synthetic-biased** datasets; this is both the great enabler and the central
weakness.

| Dataset | Size | Faces | Features | Notes |
|---------|------|-------|----------|-------|
| **Fusion 360 Gallery Segmentation** (Autodesk AI Lab, 2021) | ~35.7k B-rep bodies (~500k faces) | 1–421 (median 9) | **8 modeling-op classes** (ExtrudeSide/End, CutSide/End, Fillet, Chamfer, RevolveSide/End) | Real user .f3d/STEP + mesh + point cloud; from Autodesk public gallery. Close to "real" but labels are **operations, not machining features**. |
| **MFCAD** (Cao et al.) | 15,488 | — | 16 planar machining features; 1–6 per part | Cuboid blanks, Boolean-carved. Semantic labels only. |
| **MFCAD++** (Colligan et al.) | 59,655 | — | 24 feature classes (adds non-planar, holes); 3–10 per part | Extends MFCAD; the de-facto B-Rep GNN benchmark. |
| **MFInstSeg** (Wu et al., AAGNet) | 60k+ STEP | — | 24 classes + **instance** + bottom-face labels | AAGNet's answer to the missing instance labels. |
| **CADSynth** (BrepMFR) | large, synthetic | — | 24 typical machining features | Designed to mirror real mechanical-engineering scenarios, for domain adaptation. |
| **SolidLetters** (UV-Net) | ~96k | — | solids from fonts | classification, not machining features. |
| **ABC** | ~1M | — | unlabeled / reconstruction | primitives/sketches/operations; not face-label segmented for MFR. |

**How many labeled faces for a GNN?**
- Papers train on **hundreds of thousands of faces** (Fusion 360's ~500k; MFCAD++'s ~large).
- But **small-data regime results are much better than the folklore implies**: a
  BRepNet-style benchmark hit **96% on Fusion 360 construction segmentation** with the full set
  **and ~65% with just 10 training examples** (arXiv:2210.10807). Transfer/self-supervised
  pretraining (e.g. **BRepMAE / Masked Topology Modeling**) cuts the required labeled corpus
  further.
- **Our regime (a synthetic, fixture-mirroring corpus):** the Issue #14 corpus was ~1.3k faces
  and already cleanly separated floor classes. A GNN over a few **tens of thousands** of
  synthetically-generated faces — reusing our existing fixture-family + CadQuery generator —
  is comfortably within reach and consistent with what the small-data evidence says works.

**For a machining-feature label set** we need labels like MFCAD++, not Fusion 360's
operation labels. We can **synthesize those directly** from our CadQuery history labelling
harness (already built for Issue #14, `data/faces_labeled.csv`), which is exactly the
MFCAD recipe: build a part op-by-op, tag faces by construction op. We already do this; scaling
it up is data-gen work, not new research.

---

## 5. Multi-feature interaction handling: ML vs rules

The literature is unambiguous: **handling intersecting / just-adjacent features is the
traditional weak spot of rule-based AAG methods**, and modern GNNs are **better** at it — this
is the strongest technical argument for ML.

- Rule-based: AAG/hint/grammar methods are **explicitly documented as poor at intersecting
  features** — face splitting/merging, lost concave edges, destroyed faces break template
  matching. This is the exact problem our own `02_feature_interactions.md` catalogues.
- ML: GNNs learn an implicit, distributed representation of interaction (a face's neighbors'
  neighbors encode the consumed/destroyed-feature context). **DeepFeature (2024)** is a
  dedicated hybrid that decomposes interacting multi-base-plane features using GNNs + rules and
  reports robustness on exactly the cases that break pure rules.
- **Caveat:** ML interactions are robust only *within the training distribution*. An
  interaction topology never seen in training still fails — the synthetic→real distribution
  shift (see §8) is the residual risk.

**Bottom line:** For **interaction robustness**, ML > rules, provided the interaction
patterns are represented in training. This directly argues for an ML **arbitrator** at the
feature-interaction boundary, even while rules own the clean single-feature cases (where rules
are already 100% and ML adds nothing).

---

## 6. Open-source implementations & install paths

| Model | Repo | Graph stack | Install |
|-------|------|-------------|---------|
| **BRepNet** | `AutodeskAILab/BRepNet` | **Standard PyTorch only** (message passing hand-written; PyTorch Lightning) | `conda env create -f environment.yml`; build your own STEP dataset via OpenCascade / python-OCC pipeline; per-face logits output |
| **UV-Net** | `AutodeskAILab/UV-Net` | **DGL** (Deep Graph Library), not PyG | `conda env create`; CPU-only needs `dgl=0.6.1` |
| **Hierarchical CADNet** | `qub_femg/.../hierarchical-cadnet` (GitLab), mirror `xupeiwust/hierarchical-cadnet` | PyG-style graph | MFCAD++/MFCAD graphs available (GitLab `hierarchical-brep-graphs`) |
| **AAGNet** | `whjdark/AAGNet` (also `telee6789/AAGNet`) | GNN (torch-geometric / related) | MFInstSeg dataset, 60k STEP, open |
| **MFCAD / MFCAD++** | `hducg/MFCAD`; ++ via Hierarchical CADNet | — | STEP datasets, open |
| **Fusion 360 Gallery** | `AutodeskAILab/Fusion360GalleryDataset` | — | s2.0.1 zip, 3.1 GB, STEP + mesh + PC |

**Update to our old assumption (guardrail #2 in Issue #14):** the field *does* standardize on
**PyTorch + a geometric lib (DGL *or* PyG)**. BRepNet is the notable exception — it needs
**standard PyTorch only**, which is the cleanest dependency story for us. If we want to stay
deployable on a machine without PyG, **BRepNet's stack is the pragmatic choice**.

Licensing: BRepNet/UV-Net are **CC BY-NC-SA** (non-commercial). AAGNet repo licensing varies —
verify before commercial use.

---

## 7. General questions resolved

### Q7 — Parametric output: can ML emit the full feature definition?

**No published architecture outputs the complete parametric definition in one shot.** The
decisive finding:

- Today's **B-Rep feature-recognition** models output **labels/segments only** (face class,
  instance id). Parameters (width/depth/center/orientation) are recovered by **rules or direct
  geometric measurement on the segmented faces** — exactly our own architecture: recognize →
  measure → emit CadQuery.
- The architecture class that *does* emit parameters is the **CAD-program-sequence** (generative)
  family: **DeepCAD** (ICCV 2021) and its successors emit **sketch-extrude sequence**
  commands, not pocket/hole parameter objects. In fact:
  - **DeepCAD's own numbers prove ML loses precision on parameters**: autoencoder on ground-truth
    sequences hits 99.5% command / 98.0% parameter accuracy, but any point-based encoder drops to
    ~85% command / ~74% parameter with ~12% invalid shapes. Parameter accuracy is where ML is
    weakest.
  - The 2025–2026 frontier (**CAD-Recode, CADEvolve, CADReasoner, CADFit**) emit **executable
    CadQuery programs** (not token sequences) via **LLM/VLM decoders**, and validate them by
    running them through the CadQuery kernel. These are strong for *whole-part generation from
    scans/point clouds* but are: (a) **LLM-based** (violates our D2 "no LLM in v1"), (b)
    **sketch-extrude-centric** (CAD-Recode/CADFit exclude revolve/loft/sweep/patterns), (c)
    **distribution-shift sensitive** for exact dimensions.

**Recommendation on Q7:** Use ML for **segmentation/labeling only**; keep **rules for
parameter extraction**. This is both what the literature supports and what our pipeline
already does. The precise-dimension weakness of ML is the strongest argument against an
end-to-end ML emitter for a *deterministic* reverse-engineering tool.

### Q8 — Transfer learning synthetic → real STEP (SolidWorks/NX)

**This is the known weak point.** Networks trained on synthetic MFCAD/Fusion-360 degrade on
real CAD without intervention:

- **BRepMFR (2024)** exists *specifically* because of this: it couples a
  transformer+graph-attention network with **domain adaptation** and the synthetic **CADSynth**
  corpus to restore performance on real mechanical parts.
- Fusion 360's labels are modeling **operations**, which do not transfer cleanly to
  machining-feature labels on NX/SolidWorks STEP files without label remapping.
- Self-supervised pretraining (**BRepMAE, Masked Topology Modeling**) mitigates domain shift by
  first learning generic B-Rep representation, then fine-tuning on a small real labeled set.

**For us:** real STEP files from SolidWorks/NX will carry feature faces our synthetic corpora
must explicitly cover. The mitigation is (a) **train on a synthetic corpus that mirrors real
feature magnitudes**, and (b) **retain the deterministic gate** so ML confidence never commits
a wrong label. Do not expect synthetic-only training to transfer cold.

### Q9 — Computational requirements (mechanical part, ~50–200 faces)

The workloads are **small** at inference, **moderate** at training:

- **Inference:** a face-adjacency GNN over 50–200 faces is trivial — **CPU-friendly,
  milliseconds** per part, no GPU needed. UV-Net's per-part cost is dominated by the UV-grid
  sampling, still tiny at this part size. BRepNet reports per-model segmentation in well under a
  second.
- **Training:** second-generation models are modest (6.6M–11.3M params: Hierarchical CADNet).
  A 1–8 GB GPU is plenty for the MFCAD-scale tasks; even the UG student thesis (Colligan) trained
  on MFCAD-family within minutes-to-hours. Realistic budget for a curated ~50k-face corpus:
  **single mid-range GPU, hours** — not days.
- **Data generation** (the real cost) is our binding constraint, not compute. Generating +
  labelling ~tens of thousands of faces with our existing CadQuery harness is CPU work and
  parallelizes trivially.
- **No-GPU fallback:** standard-PyTorch BRepNet can train a small model on CPU for a
  proof-of-concept; inference is always CPU-friendly. This fits a "GPU-optional, dependency-light"
  v2 posture.

### Q10 — The "face arbitrator" integration (the recommended path)

Instead of replacing the pipeline, ML arbitrates conflicts among deterministic recognizers.
Concrete, minimal design:

- **Input:** our existing AAG (nodes = faces, edges = adjacency + convexity) — already built by
  `aag.py`; no new geometry pipeline needed to *train* or *infer*.
- **Model:** a BRepNet-style (standard-PyTorch) or graph-attention face classifier over that AAG,
  producing a **per-face posterior vector** over `{stock, pocket_floor/wall, hole_floor/wall,
  pad_top/wall, blend}` (our existing Issue #14 label set).
- **Role:** the ML posteriors vote/arbitrate **only where the deterministic recognizers
  disagree or where a face is ambiguous** (e.g. stock↔blend ribbons, hole_floor↔pocket_floor
  trigger). This directly targets the exact G2 failure of Issue #14 with the exact fix — graph
  context — that the k-NN lacked.
- **Guardrails (unchanged, required):**
  - `symdiff < 0.001` remains the **unconditional final gate**; ML never overrides a CONVERGED
    verdict (our pitfall #6).
  - Arbitrator output is **advisory** — it may select between already-proposed deterministic
    interpretations, never invent a feature.
  - Only deploy in zones the report conditions on (e.g. PARTIAL fixtures), so a wrong ML label
    degrades an already-failed result and can never regress a CONVERGED one.
- **Why this, not replacement:** the deterministic recognizers are already at ~100% on clean
  single features and are auditable + deterministic (our D2). ML's *only* clear, literature-backed
  win is **ambiguous/interacting-face contextual resolution** — exactly what an arbitrator does.
  It converts a research-only 84% k-NN into a decision-grade conflict resolver while keeping the
  hard guarantees.

---

## 8. Minimum viable ML integration — ranked options

Ranked by (value ÷ cost) for `cad_reverse`, given we already own the AAG builder and the
labelling harness:

**Option A — AAG graph-attention face classifier as advisory arbitrator (RECOMMENDED).**
Reuse `aag.py` graph; retrain the Issue #14 labeler as a GNN (fixes stock↔blend via graph
context); gate everything behind the deterministic `symdiff`. Lowest new infrastructure,
highest reuse of existing investment, directly targets the documented confusions. Requires a
torch/lib (BRepNet-style standard-PyTorch preferred to keep it PyG-free).

**Option B — Instance-segmentation GNN (AAGNet-style)** for multi-feature parts where we must
decide how many *distinct* features exist and which faces belong to each. Higher value for
the multi-feature goal, but heavier (instance branch, MFInstSeg-style data with instance labels
we'd have to generate). A natural v2.5 upgrade after Option A shows value.

**Option C — Hierarchical (B-Rep + mesh) graph (Hierarchical-CADNet)** for max accuracy on
complex parts. Best benchmark numbers, but adds the facet/STL sampling level we don't currently
build — disproportionate cost for our part scale (50–200 faces).

**Option D — End-to-end parametric/LLM emitter (CAD-Recode/CADReasoner/CADFit).** Rejected for
v2: violates D2 (no LLM), has ML's documented parameter-accuracy weakness, sketch-extrude
centric, and toggles the wrong axis of the design (we want deterministic edits, not probabilistic
program generation).

---

## Recommendations

**Verdict: For v2, ML should be added as a *narrow face-arbitrator*, not as a pipeline
replacement. The rule-based core remains the right foundation for multi-feature recognition
in August 2026.**

The reasons, in priority order:
1. **Parametric precision still belongs to rules.** ML is decisively worse at exact dimensions
   (DeepCAD: 74% parameter accuracy from scans; 98% only with ground-truth sequences). Our
   product is *deterministic, editable CadQuery* to `symdiff < 0.001`; ML cannot own that gate.
2. **ML's genuine, literature-backed strength is contextual face resolution on
   ambiguous/interacting faces** — the exact class of failure (stock↔blend, interacting features)
   our deterministic recognizers most need help with, and the exact thing our Issue #14 k-NN
   could not do because it lacked graph context. A GNN fixes precisely that gap.
3. **The field has matured but not changed the game for us.** ~97–99.5% on MFCAD-family is
   real but synthetic; synthetic→real transfer is the documented unsolved risk (BrepMFR exists
   to address it). Until that transfers cold to SolidWorks/NX, don't bet the deterministic gate.
4. **Cost is now low enough to try.** Inference is CPU-friendly at 50–200 faces; training is
   hours on a modest GPU; and we already own the AAG builder + CadQuery-history labelling minus
   up-scaling the corpus.

**Minimum viable integration point (what we would actually build):**
- A **BRepNet-style (standard-PyTorch), or graph-attention, face classifier over our existing
  AAG** (no new graph pipeline, no PyG requirement).
- Train on a synthesized corpus mirroring the MFCAD recipe (Boolean-carved cuboid blanks with
  the 8-class label set), **up-scaled from ~1.3k to tens of thousands of faces** via our existing
  generator — reusing the deterministic ground truth built in Issue #14.
- Deploy the posteriors **only as an advisory arbitrator** for faces our deterministic
  recognizers flag as ambiguous or PARTIAL; keep `symdiff` as the unconditional authority.
- First success criterion: **flip Issue #14's G2** (stock↔blend) while keeping G1
  (floor disambiguation) and adding **no CONVERGED regression**.

**What would change the verdict:** if (a) synthetic→real transfer becomes reliable for
machining features (BrepMFR-style domain adaptation matures), and (b) a parametric-estimating
model proves exactness on multi-feature parts, then v3 could consider ML-driven parameter
refinement. Neither is true enough in August 2026 to abandon the deterministic approach.

---

## Sources

- UV-Net: Jayaraman et al., CVPR 2021 — arXiv 2006.10211; repo `AutodeskAILab/UV-Net`
  https://github.com/AutodeskAILab/UV-Net
- BRepNet: Lambourne et al., CVPR 2021 — repo `AutodeskAILab/BRepNet` (standard-PyTorch, CC BY-NC-SA, custom-STEP dataset builder + per-face logits)
  https://github.com/AutodeskAILab/BRepNet
- Hierarchical CADNet: Colligan, Robinson et al., 2022 — GitLab `qub_femg/.../hierarchical-cadnet`,
  mirror `xupeiwust/hierarchical-cadnet`; hierarchical B-Rep graphs dataset (GitLab `qub_femg`)
  https://gitlab.com/qub_femg/machine-learning/hierarchical-cadnet
  https://pure.qub.ac.uk/en/publications/hierarchical-cadnet-learning-from-b-reps-for-machining-feature-rec/datasets/
- AAGNet: Wu et al., Robotics & Computer-Integrated Manufacturing Vol 86 (2024), DOI
  10.1016/j.rcim.2023.102661; repos `whjdark/AAGNet`, `telee6789/AAGNet`; MFInstSeg (60k+ STEP)
  https://github.com/whjdark/AAGNet
- DeepFeature hybrid (rules + GNN for interacting features): CQVIP / Sci-Hub-indexed, 2024
  https://www.cqvip.com/doc/journal/00854JP1MPBO0IL1MBD83JP1MPDO5/
- BRepGAT: IEEE / KCI, ~2024, 99.1% on MFCAD18++
  https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003043924
- BRepMFR (domain adaptation + CADSynth, 2024)
  https://www.sciencedirect.com/science/article/abs/pii/S0167839624000529
- Masked Topology Modeling / BRepMAE (self-supervised B-Rep pretraining)
  https://www.semanticscholar.org/paper/Masked-Topology-Modeling-for-Self-Supervised-on-CAD-Jiang-Jang/407912aa5094e223987ffdbfb12cd589391941f2
- step-to-uvnet-graph (STEP→UV-Net DGL graphs, TMCAD/MechCAD/Fusion)
  https://github.com/usman7384/step-to-uvnet-graph
- Fusion 360 Gallery Segmentation Dataset (Autodesk AI Lab), CVPR-Benchmark
  https://github.com/AutodeskAILab/Fusion360GalleryDataset
  http://arxiv.org/pdf/2210.10807 (small-data: 96% full set / 65% @ 10 examples)
- MFCAD / MFCAD++ / MFInstSeg dataset numbers
  https://github.com/whjdark/AAGNet ; https://github.com/hducg/MFCAD
- DeepCAD (ICCV 2021) — sequence generative model; parameter-accuracy caveats
  https://github.com/rundiwu/DeepCAD
  https://www.openaccess.thecvf.com/content/ICCV2021/html/Wu_DeepCAD_A_Deep_Generative_Network_for_Computer-Aided_Design_Models_ICCV_2021_paper.html
- CAD program/LOM generate frontier: CAD-Recode (Qwen decoder, ~1M synthetic scripts, IoU
  92.0%/87.8%), CADEvolve, CADReasoner, CADFit (ICML 2026, IoU-driven, 0% invalid)
  https://github.com/ghadinehme/CADFit ; https://ar5iv.labs.arxiv.org/html/2603.29847 ;
  https://en.papernotes.org/ICCV2025/interpretability/cad-recode_reverse_engineering_cad_code_from_point_clouds/
- GAPNet (graph-attention point net) — attention-message-passing precedent (not the disputed
  "Point2FF")
  https://ar5iv.labs.arxiv.org/html/1905.08705
- Graph-class-incremental / sheet-metal GNN (Scientific Reports 2024)
  https://link.springer.com/article/10.1038/s41598-024-61443-2
- GNN B-Rep MFR accuracy on MFCAD++ (South China Univ. Tech, 99.53% acc / 99.15% mIoU)
  https://zrb.bjb.scut.edu.cn/EN/10.12141/j.issn.1000-565X.240329
- Internal upstream reports: `09_ml_classifier_feasibility.md` (Issue #14 k-NN),
  `multi_feature/02_feature_interactions.md`, `04_aag_graph_based_cad_analysis.md`,
  `05_deterministic_vs_ml_cad_reconstruction.md`
