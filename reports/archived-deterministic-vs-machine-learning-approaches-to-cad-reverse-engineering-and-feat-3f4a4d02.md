---
{
  "format": 1,
  "metadata": {
    "id": "archived-deterministic-vs-machine-learning-approaches-to-cad-reverse-engineering-and-feat-3f4a4d02",
    "title": "Deterministic vs. Machine-Learning Approaches to CAD Reverse Engineering and Feature Recognition",
    "question": "What findings, alternatives and limitations does the historical investigation document about Deterministic vs. Machine-Learning Approaches to CAD Reverse Engineering and Feature Recognition?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: Deterministic vs. Machine-Learning Approaches to CAD Reverse Engineering and Feature Recognition. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of Deterministic vs. Machine-Learning Approaches to CAD Reverse Engineering and Feature Recognition; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:42.458Z"
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
  "sourceDigest": "3f4a4d02acfd543092911841652f7599257b523ca604a667e21614bdd809da00",
  "proposalRevision": "6735893fc5013ab8f5af247864a5d64e37000b7b261cfad1a27d4eff0f957712"
}
---
# Deterministic vs. Machine-Learning Approaches to CAD Reverse Engineering and Feature Recognition

**Reference note:** `cad_reverse/` is a deterministic, rule-based B-Rep STEP→CadQuery pipeline. It builds an Attributed Adjacency Graph (AAG) + blend mask, runs hand-coded recognizers for fillet/chamfer/hole/pocket/pad/stock, orders features into a DAG, emits CadQuery, executes it, and validates each result against the source solid with a volumetric symmetric-difference gate (`symdiff < 0.001`) reporting machine-readable **reason codes** (e.g., `UNMATCHED_CONCAVE_CYLINDER_NO_CAP`) rather than confidence scores. This document surveys the landscape it competes with.

---

## 1. The two camps, framed honestly

The two approaches are not measuring the same thing, so a raw "who wins" head-to-head is mostly a category error. The sharpest way to frame the trade is:

- **Deterministic (rule-based) = certified-correct-but-finite.** When a recognizer fires, it is correct *by construction* (geometry/topology invariants). Its failure mode is **non-coverage** — a feature not present in the rule library is silently (or honestly) reported as unmatched.
- **Machine learning = broad-but-uncertifiable.** High recall over trained classes (often 90–99%), but **no per-instance correctness guarantee**. Its failure mode is **silent, confident wrongness on out-of-distribution geometry**.

So the real axis is **coverage/completeness vs. verifiability/exactness**, with the added practical concern that an ML *classifier* produces face labels — not buildable geometry.

---

## 2. Classic deterministic feature recognition: architecture and why it fell out of favor

### The founding lineage (your AAG ancestors)

| Method | Reference | Notes |
|--------|-----------|-------|
| **Attributed Adjacency Graph (AAG)** | Joshi & Chang, *Computer-Aided Design* 20(2):58–66, **1988** | B-Rep faces → graph nodes, edges → arcs, each arc carries a **convex/concave edge-vexity attribute**. Sub-graphs isolated by removing convex-surrounded nodes are matched against feature template graphs. Originally **polyhedral-only** (pockets, slots, steps, blind variants, polyhedral holes). Cited 750+. Direct conceptual ancestor of `cad_reverse/aag.py`. |
| **Hint-based reasoning** | Vandenbrande & Requicha, *IEEE TPAMI* 15(12):1269–1285, **1993** | OPS-5 production rules fire geometry/topology **hints** onto a blackboard; each hint is confirmed via volumetric accessibility checks to produce *maximal solid volume features*. Best-known classical handling of **interacting features**. |
| **Convex/cell decomposition** | Woo (alternating sums); surveyed in Shah, *Computer-Aided Design* 23(5):331–343, **1991** | Decompose the delta-volume into maximal convex cells. |
| **Standards** | **STEP AP224** (ISO 10303-224, 1st ed. 1999) | "Mechanical Product Definition for Process Planning Using Machining Features." Commercial: StepTools ST-Developer, ACIS (Spatial). |

### Why classical FR "fell out of favor"

The 1990s literature (Shah 1991; Han & Jung *ACM Computing Surveys*) documented the same handful of structural failure modes, all still relevant:

1. **Interacting features are the dominant weakness.** Intersecting features destroy face-adjacency: arcs go missing, faces split, base faces get removed, features get merged/disjointed. "Virtual link" heuristics to restore broken arcs are unreliable — "the ambiguity of feature combinations could not be eliminated... even worse when vital faces are destroyed completely."
2. **Non-unique decomposition.** An AAG carries *topological but insufficient geometric* information (relative face orientation is underused), so one sub-graph can match two different features. Topologically identical but geometrically different features (slot vs. pocket) are confusable.
3. **Exponential, non-scalable matching.** General subgraph isomorphism is intractable; exhaustive pattern search is slow on real industrial parts; the feature library must be enumerated for every primitive/interaction variant ("it is unrealistic to enumerate the unlimited types of feature interaction" — the so-called **PRICE/library-explosion problem**).

**The one clean historical accuracy datapoint comes from ML's own benchmark:** the rule-based **Alternate Solid Model (ASM)** baseline on Fusion 360 Gallery Segmentation scores **64.57% accuracy / 49.53% mIoU** vs. **92.52% / 77.10% for BRepNet**. Caveat for the doc: ASM is a *voxel-grid-matching* baseline, not a completeness-aware recognizer, and it was forced to guess every face rather than being allowed to be correct-or-silent. So "ML beats rules" is measured against a deliberately crumbly rule model.

---

## 3. Modern ML on B-Rep graphs

### BRepNet — the field baseline
Lambourne, Willis, Jayaraman, Sanghi, Meltzer, Shayani (Autodesk Research + UCL), **CVPR 2021 Oral**. Defines a **topological convolution kernel over oriented coedges** — face/edge/coedge feature vectors (surface-type one-hots, area, convexity flags, length, direction) aggregated with learnable weights, analogous to a 2D CNN window placed on the face-adjacency graph. On **Fusion 360 Gallery Segmentation**:

| Method | Face accuracy | mIoU |
|--------|--------------|------|
| **BRepNet** | **92.52%** | **77.10%** |
| ECC graph net | 90.36% | 72.08% |
| PointNet++ | ~74% | 34.78% |
| MeshCNN | 63.0% | 20.59% |
| **ASM (rule-based baseline)** | 64.57% | 49.53% |

Newer refinements push higher on their own benchmarks — a Masked B-Rep autoencoder reports ~97% face accuracy / 86.75% mIoU; a 2026 two-level pipeline (Pan et al., *Eng. Applications of AI*) reaches 94.51% / 78.13%.

### UV-Net
Jayaraman, Sanghi, Lambourne et al. (Autodesk), **CVPR 2021**. Encodes each parametric face as a regular **2D UV grid** of 3D points, normals, and a trimming mask; edges as 1D grids with tangents; 2D/1D image CNNs encode face/edge geometry, then a GNN does message passing over the face-adjacency graph. Introduced the **SolidLetters** dataset (~96k extruded+filleted font solids).

### Other B-Rep / graph nets
- **BRepGAT** (Lee et al., 2023, *J. Comput. Des. Eng.*) — graph-attention on B-Rep; **99.1% face-label accuracy on MFCAD++**.
- **AAGNet** (Wu et al., 2024, *CAD*) — explicitly rebuilds a **geometric AAG (gAAG) from B-Rep** and runs multi-task semantic/instance/bottom-face segmentation. Notably it puts the *AAG structure back inside a learned model* — directly relevant to `cad_reverse`'s core representation.
- **MFCAD / MFCAD++ / MFInstSeg / MFCylCAD** — the cube- and cylinder-primitive machining-feature segmentation benchmarks (MFInstSeg >60,000 STEP solids, 24+ classes). Point-based GNN variants (point-PointNet++ conservers of B-Rep geometry) reach near-SOTA there.
- **MeshGraphNet** (Pfaff et al., ICLR 2021) — is a **physics-simulation mesh GNN**, *not* a feature recognizer; do not conflate.

### The conflation warning
"BRepNet vs. BrepNet/Brep-BERT" — the former (CVPR 2021) is the face-segmentation paper above. A separate lineage (Sanghi et al. "Brep-BERT"/BrepMP, plus DeepCAD for sequence *synthesis*) is a different thing and should not be merged in any survey.

---

## 4. Generative CAD models: what they can/can't do for reverse engineering

Every generative model in this space is **forward/conditional** — it synthesizes a plausible CAD sketch/extrude sequence from a coarse query (class, text, image, voxel, or point cloud). **None takes an existing STEP/B-Rep and returns the exact parametric feature tree with real dimensions and constraints.**

| Model | Venue/Year | What it generates | Why it can't reverse-engineer STEP |
|-------|-----------|-------------------|-----------------------------------|
| **DeepCAD** | ICCV 2021 | CSG-like command sequences (sketch line/arc/circle + extrude); 178k models | Parameters quantized to **256 levels (8-bit)** — approximate, not exact; restricted ops (no fillet); long sequences give high invalid-topology rate; no feed of an existing solid. |
| **SkexGen** | ICML 2022 | Sketch-extrude graph Transformer, 3 disentangled VQ-VAE codebooks (500/1000 topo+geom+extrude) | Sketch geometry discretized to a **64×64 grid (6-bit)** — explicitly coarse; learns relative structure, no absolute dims/constraints. |
| **SolidGen** | TMLR 2023 | Autoregressive Transformer over an "Indexed Boundary Representation" — vertices, edges, faces directly | Generates B-Reps *forward*; conditions on class/image/voxel to *approximate* an input; no feature tree, no dimensions. |
| **Text2CAD** | NeurIPS 2024 (Spotlight) | Text → parametric CAD commands | Text-conditioned synthesis, forward only. |
| **CAD-SIGNet** | CVPR 2024 | Reverse-engineers sketch+extrude **design-history sequences from point clouds** | Closest to "reverse"; but point-cloud input, autoregressive/probabilistic, no exact STEP→feature guarantee. |

**DeepCAD vs. SkexGen concretely:** DeepCAD FID 75.47 vs. SkexGen 18.56; SkexGen valid-rate much higher. Both remain statistically approximate.

**The exception that proves the rule — the "last mile" existence proof:** *Reconstructing editable prismatic CAD from rounded voxel models* (Lambourne, Willis, Jayaraman, Zhang, Sanghi, Malekshan; Autodesk, SIGGRAPH Asia 2022) is the strongest published recovery of **dimensioned, constrained sketches** (equality/symmetry/perpendicularity, importable into Fusion 360). But: it decomposes into a 128×128 2D SDF profile library of **49 constrained parametric sketches** matched from SketchGraphs-derived data, and covers only the ~18 most common **orthogonal prismatic extruded** classes (~80% of models). It raises IoU 48%→79% (DeepCAD) / 50%→74% (ABC) and valid-solid ratio 71.5%→83.8% — **precisely the class of part that a deterministic AAG recognizer already handles cleanly.** In other words: the state of the art in parametric *reconstruction* still reduces to deterministic library-search over the prismatic class, wrapped in a learned front-end.

---

## 5. The "last mile": classify vs. reconstruct

The consensus across the literature is that **ML's reliable contribution is segmentation; everything downstream — dimensions, constraints, sketch topology, the construction sequence — is better solved by classical geometric/parametric operations.**

- **BRepNet** is face *classification only*; its own paper frames parametric-history recovery as downstream and outputs no dimensions.
- **Zone Graphs** (*Inferring CAD Modeling Sequences Using Zone Graphs*, Xu, Peng, Cheng, Willis, Ritchie; Brown/MIT/Autodesk, CVPR 2021): frames reconstruction as **search over zone-filling extrusions** with a GCN *scorer*; reconstructs **80% (6900/8625) of Fusion 360 Gallery**; beats InverseCSG. This is the closest published analog to `cad_reverse` — it assumes B-Rep and infers operations, but not the exact sketch tree, and handles only sketch+extrude+Boolean.
- **InverseCSG / CSGNet / BSP-Net / CAPRI-Net / D²CSG**: primitive/CSG decomposition. These recover *primitives/CSG*, not sketch profiles or design constraints.
- **ComplexGen** (SIGGRAPH 2022): sparse-CNN + tri-path transformer predicts primitives and relations as a **chain complex**, then global optimization for a valid B-Rep.
- **Point2CAD** (CVPR 2024) states the framing most cleanly: *"machine learning's primary role in CAD reconstruction is segmentation, while subsequent steps are better solved by classical geometric operations."*

**Takeaway:** no published system does reliable, exact **parametric** reconstruction of an arbitrary STEP — and the ones that recover dimensioned, constrained features at all (the Autodesk prismatic method; zone graphs) are doing *deterministic search over a constrained sketch library*, i.e., the same "detect face → solve geometry exactly" split.

---

## 6. The training-data problem

**The central irony: ML labels are derived from hand-authored parametric construction histories — not from raw STEP.**

- **Fusion 360 Gallery Segmentation** (BRepNet vehicle): 35,858 B-Rep models; each face labeled with one of **8 operation classes** (ExtrudeSide 50.6%, ExtrudeEnd 15.7%, CutSide 11.9%, CutEnd 2.35%, RevolveSide 7.1%, **Fillet 10.2%**, **Chamfer 2.94%**, RevolveEnd 0.08%). Labels come from **walking the Fusion parametric build history** — each face tagged with the operation that created it. Severe class imbalance; adjacent-feature ownership is genuinely ambiguous; performance degrades on noisy/non-manifold topology. Labels are only as clean as the authored history they were scraped from.
- **Fusion 360 Gallery / Reconstruction** (Willis et al., SIGGRAPH 2021): 8,625 human designs reduced to a **sketch+extrude DSL program**; the construction sequence is **parsed from the parametric history** (sketch+extrude covers ~84%/79%). Willis et al. recover correct programs for **67.5% of test designs** within a 100-interaction budget.
- **ABC** (Koch et al., CVPR 2019): ~1 million Onshape models — largely **unlabeled** for FR; good as a *pretraining* pool, not face→feature labels.
- **MCB (correction to the usual claim):** the ~60k figure traces to Kim et al., **ECCV 2020**, "A Large-scale Annotated Mechanical Components Benchmark": 58,696 models / 68 ICS classes scraped from GrabCAD/3D Warehouse/TraceParts. Its labels are **human annotations** (custom web tool + expert re-review), *not* construction-history-derived — and it targets classification/retrieval, not reverse engineering. There is **no 60k-scale CadQuery-authored feature-recognition dataset**; a "Mechanical Components Benchmark (cadquery)" at that scale does not exist.

**Contrast for `cad_reverse`:** the AAG + geometric-rule recognizers need **zero training data** — no manual labels, no construction histories, no class-imbalance remediation. They substitute hand-coded topology/geometry invariants for learned statistics, trading generality for label-independence and per-instance verifiability (`symdiff < 0.001`).

---

## 7. Commercial CAD tools: ML finds intent, deterministic geometry produces the feature

The strongest recurring pattern in production tooling: **ML locates/labels faces and synthesizes scripting intent; the dimensioned, parameterized, parented feature is produced deterministically.** None of the majors publishes a parametric-reconstruction accuracy number.

| Tool | Mechanic | Notes |
|------|----------|-------|
| **Siemens NX Synchronous Technology** | History-free feature engine on Parasolid + D-Cubed | **Deterministically reconstructs feature relationships from dumb import geometry** via a decision-inference engine (fillets/blends/holes/shells/ribs on non-parametric imports) and re-applies parametrics. Textbook case of deterministic geometry solving. NX's newer "AI" (command prediction, Select-Similar-Faces, Design Copilot) automates tasks/UX — it does **not** reconstruct a full feature tree from a scan. |
| **Onshape / PTC** | **FeatureScript Text-to-Code-to-CAD** (LLM dialog → executable FeatureScript) | The LLM emits **native, parametric, editable code** rather than guessed geometry — the closest commercial parallel to "ML finds intent; authored, dimensioned features are produced, not guessed." Headline demo: shell-and-tube heat exchanger ~2,100 lines / ~532 params via Claude. Creo 13 ships a native AI Assistant + generative topology optimization (geometry synthesis, not import reconstruction). |
| **Backflip AI** (Fusion plugin) | Scan→editable feature tree | Operator-chained extrusion/revolve/pattern with self-check loops; "Fast"/"Thinking" modes. Headline economics: reverse-engineering cost **~$1,500 → ~$10/part** (a labor-throughput claim, not an accuracy number). |
| **Autodesk Fusion** | **Generate Face Groups** (planar/cylindrical/fillet/radial detection) + prismatic conversion | Explicitly **deterministic geometry-rule** driven; docs note direct conversion "compute failed" without face-group context. |

**Concrete commercial voices on why determinism survives:**
- **CADEXSOFT MTK** states plainly ("we don't use machine learning yet") that FR is a foundation for DFM checks and must hand over **reconstructed analytic geometry** — re-fitting cylinders/cones/tori from NURBS. Manufacturing expects buildable geometry (exact radii, depths, centroids, orientation), which labels don't carry.
- **DezignWorks / INSVISION** etc. advertise "parametric and editable" reconstructions — but they are *scan-to-CAD* (mesh→geometry via deterministic fitting), not label-predictors.

---

## 8. The confidence vs. reason-code debate

This is a **certification/auditability decision**, and the safety-critical world already answers it in favor of determinism.

- **Confidence is empirically unreliable on geometry.** An ASME 2017 study (random-forest on CAD geometry for cast-vs-machined selection, 86% OOB accuracy) documents **confident misclassifications** — flat-faced castings "tricked" into "machined," 45°-machined parts into "cast" — and concedes the class set is overconfident. Softmax/entropy are **not calibrated for CAD geometry**; hyperspherical-confidence-mapping work exists precisely because NN confidence is miscalibrated for high-stakes manufacturing. The trap: a 0.87 on an OOD shape is not just wrong, it's **indistinguishable from correct** to an engineer with no way to diff the label.
- **A reason code is a testable artifact; a confidence is not.** `UNMATCHED_CONCAVE_CYLINDER_NO_CAP` round-trips through a unit test; "0.87 confidence in a fillet" has no ground-truth oracle a CI gate can assert against. The xAI retrofit (e.g., the NeuroCAD project applying LRP/Grad-CAM/LIME to CAD FR) exists *only because* ML needs explainability bolted on after the fact — the rule pipeline is explainable by construction.
- **Certification demands determinism.** GKN Aerospace's *Digital Product Definition for Suppliers* (PSI-PUR, Rev A 2024) requires acceptance software to be documented, version-controlled, change-controlled, and certified under ASME B89.4.10, with verification against calibrated standards. The doc describes **deterministic, rule-based verification** and never mentions ML. AS9100/ISO/PPAP process control wants **reproducible** outcomes: a fixed rule + a symdiff pass is reproducible; a stochastic classifier is only reproducible with frozen weights and a certified training set.
- **The verification loop has no ML equivalent.** `cad_reverse`'s round-trip (reconstruct → re-emit → exec → `symdiff < 0.001`) *certifies* correctness for every converged fixture. BRepNet-style classifiers report *accuracy-on-test-set* — a population statistic, **not an instance certificate**. This is the single sharpest asymmetry between the two regimes.

---

## 9. Emerging hybrids: ML detects, deterministic reconstructs

The field has converged on exactly the split `cad_reverse` is positioned for — note that the literature mostly runs it **opposite to the naive read**: ML is reduced to a face-segmentation *front-end*, everything downstream is deterministic.

| Hybrid | Venue/Year | Split |
|--------|-----------|-------|
| **MMNet** | CMES 2026 | GNN face-level semantic segmentation + **rule-based instance clustering** — explicit what/params split. |
| **Point2CAD** | CVPR 2024 | ML segments the point cloud; **learning-free optimization** fits primitives and computes edges/corners from analytic surface intersections. Cleanest articulation of "ML segments, geometry solves." |
| **AAGNet / BRepGAT** | CAD 2024 / 2023 | Pure "what"-side detectors (semantic+instance+bottom-face) on a gAAG; parametric extraction follows deterministically. |
| **CADFit** | ICML 2026 | Even its ML-light pipeline gates every candidate through **kernel-validated CadQuery/OCCT construction** and optimizes volumetric overlap — the closest ML-family work to `cad_reverse`'s exact/verifiable ethos. |
| **Yang et al.** | CAD 2024 | Explicitly fuses primitive decomposition + GNNs + reconstruction rules for **highly-interacting machining features**. |
| **Autodesk prismatic method** | SIGGRAPH Asia 2022 | Network + deterministic **constrained-sketch library search**; recovers dimensioned/constrained sketches. |

**This validates the patch-gap instinct for `cad_reverse`.** Its 5/6 non-converging fixtures stem from the pocket recognizer's *coverage guard* (spurious candidates on hole walls/floors), not from parameter extraction. Replacing the *detection trigger* with a BRepNet-class face-segmentation guide feeding the existing `HoleParams`/`PocketParams` extraction is precisely the MMNet/Yang pattern the literature endorses: **you gain ML recall where rules are silent, without surrendering the exactness gate** — parameter extraction and volumetric verification remain deterministic and certified.

---

## 10. Spectrum of approaches

```
Pure symbolic            Heuristic/geometric        Hybrid: neural detect    Pure neural
EXACT, deterministic     RULES (hand-coded)         + deterministic solve      forward generative
─────────────────────────────┼───────────────────────────┼──────────────────────────
InverseCSG (SAT/SMT)     AAG + edge-vexity         BRepNet seg → analytic    DeepCAD
Zone-graph search        (Joshi & Chang 1988)      fit (Point2CAD, MMNet)    SkexGen
Sketch/program synthesis Hint-based (Vandenbrande) AAGNet + param extract     SolidGen
(GULP/Sketch 2018)       AP224 feature library     Voxel→constrained-sketch  Text2CAD / CAD-Llama
                        ~~cad_reverse sits here~~  PS-CAD (prompt+select)    CAD-SIGNet (pointcloud)
                                                    CADFit (OCCT-validated)
```
Moving left-to-right, you trade **certifiability/exactness for coverage/generality** — and the axis that commercial and safety-critical use validates is: **stay deterministic wherever a buildable, dimensioned, auditable feature is required; use ML only to widen the detect step, never to produce the geometry.**

---

## Comparison table

| Dimension | Deterministic / rule-based | Machine learning |
|-----------|----------------------------|------------------|
| **Output** | Typed parametric objects + reason codes | Face labels / class probabilities / command tokens |
| **Correctness** | Exact when fired (by construction) | Probabilistic (92–99% on benchmark for trained classes) |
| **Failure mode** | Non-coverage (honest no-match) | Silent, confident wrongness off-distribution |
| **Ground-truth needs** | None — geometry/topology rules | Labels **derived from hand-authored parametric histories** (not raw STEP) |
| **Class imbalance / label noise** | N/A | Real problem (Fillet only 10.2% of faces; ExtrudeSide 50.6%; RevolveEnd 0.08%) |
| **Out-of-distribution** | No distribution — rules are invariant | Documented cliff: BRepNet/UV-Net drop 93.8→75.0% acc / 73.3→42.9% mIoU under rotation (CAD J. 2024) |
| **Exactness of geometry** | Exact (fits real analytic surfaces) | Quantized/approximate (8-bit DeepCAD, 6-bit SkexGen) or labels only |
| **Verifiability** | Round-trip `symdiff < 0.001` instance certificate | Accuracy-on-test-set population statistic; **no instance certificate** |
| **Parametric reconstruction (dims/constraints)** | Yes (emitter + exact solver) | Generally no; only via deterministic library-search front-ends |
| **Auditability / certification** | Reproducible, testable per-instance (ASME/GKN) | Requires frozen weights + certified training set |
| **Scalability to arbitrary parts** | Limited by rule library (PRICE explosion) | Broad coverage over trained shape families |
| **Hallmark metric** | `symdiff`, completeness, reason-code audit | mIoU, face accuracy (BRepNet 77.1 mIoU / 92.5% acc) |
| **Interacting/ambiguous features** | Historical weakness (missing/dead faces) | Learned, but only as clean as training labels |
| **Stated ML-beats-rule headline** | ASM baseline 64.6% acc / 49.5% mIoU | BRepNet 92.5% acc / 77.1% mIoU (but ASM forced to guess; not completeness-aware) |

---

## Key Takeaways

1. **It's coverage vs. certifiability, not an accuracy race.** Deterministic recognizers are exact-but-finite; ML is broad-but-uncertifiable. On their own benchmark ML is strong (BRepNet 92.5% face acc / 77.1 mIoU), but with a steep, documented out-of-distribution cliff and no per-instance correctness.

2. **The anti-ML headline metric is soft.** The published "rules lose" datapoint (ASM 64.6%/49.5% vs BRepNet 92.5%/77.1%) uses a voxel-matching baseline *forced to guess every face*, not a completeness-aware recognizer allowed to be correct-or-silent.

3. **No generative model reverse-engineers an existing STEP.** DeepCAD/SkexGen/SolidGen/Text2CAD are all *forward/conditional* (text/image/voxel/point-cloud → approximate sequence), quantize geometry (6–8 bit), skip constraint solving, and produce high invalid-solid rates on long sequences.

4. **The "last mile" (dims, constraints, editable feature) is solved deterministically, even in ML papers.** The only published dimensioned/constrained reconstruction (Autodesk voxel→49-sketch library; zone-graph search) is *deterministic search over a constrained library* over the prismatic class — the class `cad_reverse` already converges on.

5. **ML training labels are themselves derived from deterministic parametric history.** There is no large STEP→feature label set built from raw STEP; labels come from parsing hand-authored feature trees (Fusion 360, ABC) or human annotation (MCB). The "60k CadQuery-labeled benchmark" is actually MCB (human-annotated, ECCV 2020). `cad_reverse` needs zero such data.

6. **Commercial/CAD + safety-critical converge on one split: ML finds intent, deterministic geometry produces the feature.** Siemens NX ST re-parameterizes dumb geometry deterministically; Onshape/Creo emit native editable FeatureScript; Backflip/Fusion use geometric face-group/rule engines for the buildable result. GKN/ASME process-control documentation demands deterministic, reproducible verification.

7. **Reason codes beat confidence for auditable engineering.** A reason code is testable and reproducible; a confidence is a non-falsifiable, miscalibrated-in-geometry number that can be *confidently wrong* off-distribution. The verification loop (`symdiff < 0.001`) certifies each instance — no ML analogue exists.

8. **The low-risk upgrade for `cad_reverse` is hybrid, and the gap is narrow.** Swap the pocket-recognizer's detection trigger for a BRepNet-class face-segmentation guide feeding the existing typed-parameter extraction; keep parameter extraction and volumetric verification deterministic. This is exactly the MMNet / Point2CAD / Yang-2024 pattern, and it fixes 5/6 of the current PARTIAL fixtures without surrendering the exactness gate.

9. **Where deterministic still wins, decisively:** buildable geometry for manufacturing/DFM/BOM/tolerancing, certification, auditability, no training data, reproducible CI. **Where ML genuinely wins:** widening coverage on highly-interacting or organic features, and rapid face-level triage — as a front-end, not a geometry producer.

---

## References

**Classical FR:**
- Joshi & Chang, "Graph-based heuristics for recognition of machined features from a 3D solid model," *CAD* 20(2):58–66, 1988. [DOI 10.1016/0010-4485(88)90050-4](https://www.mendeley.com/catalogue/47295c07-f6c4-35ba-bd43-f44f13b0e074/)
- Vandenbrande & Requicha, "Spatial Reasoning for the Automatic Recognition of Machinable Features in Solid Models," *IEEE TPAMI* 15(12):1269–1285, 1993. [DOI 10.1109/34.250845](https://dblp.org/rec/journals/pami/VandenbrandeR93.html)
- Shah, "Assessment of features technology," *CAD* 23(5):331–343, 1991. [zbMATH 0793.68174](https://zbmath.org/0793.68174)
- STEP AP224 / ISO 10303-224. [StepTools notes](https://steptools.com/docs/stp_aim/notes_ap224.html)

**ML on B-Rep:**
- BRepNet — Lambourne et al., CVPR 2021. [CVPR](https://www.openaccess.thecvf.com/content/CVPR2021/html/Lambourne_BRepNet_A_Topological_Message_Passing_System_for_Solid_Models_CVPR_2021_paper.html) / [code](https://github.com/AutodeskAILab/BRepNet)
- UV-Net — Jayaraman et al., CVPR 2021. [arXiv 2006.10211](https://arxiv.org/abs/2006.10211) / [code](https://github.com/AutodeskAILab/UV-Net)
- Fusion 360 Gallery Segmentation dataset. [repo](https://github.com/AutodeskAILab/Fusion360GalleryDataset)
- AAGNet, Wu et al., *CAD* 2024. [SciDirect](https://www.sciencedirect.com/science/article/abs/pii/S0736584523001369)
- BRepGAT, Lee et al., *J. Comput. Des. Eng.* 2023. [KCI](https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003043924)
- Masked B-Rep autoencoder ~97% face acc. [arXiv 2603.14927](https://ar5iv.labs.arxiv.org/html/2603.14927)
- Rotation-invariance degradation study. [CAD J. 21(6) 2024](https://www.cad-journal.net/files/vol_21/CAD_21(6)_2024_959-975.pdf)

**Generative models:**
- DeepCAD — Wu, Xiao, Zheng, ICCV 2021. [arXiv 2105.09492](https://www.emergentmind.com/papers/2105.09492)
- SkexGen — Xu et al., ICML 2022. [PMLR](https://proceedings.mlr.press/v162/xu22k) / [camera-ready](https://www.research.autodesk.com/app/uploads/2023/03/2022_ICML_SkexGen_CameraReady.pdf)
- SolidGen — Jayaraman et al., TMLR 2023. [arXiv 2203.13944](https://huggingface.co/papers/2203.13944)
- Text2CAD — Khan et al., NeurIPS 2024. [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2024/hash/0e5b96f97c1813bb75f6c28532c2ecc7-Abstract-Conference.html)
- CAD-SIGNet — Cherenkova et al., CVPR 2024. [arXiv 2402.17678](https://ar5iv.labs.arxiv.org/html/2505.04481)
- Willis, "Sequence-based CAD generative models." [blog](https://www.karlddwillis.com/sequence-based-cad-generative-models/)

**Reconstruction / last mile:**
- Zone Graphs — Xu et al., CVPR 2021. [arXiv 2104.03900](https://ar5iv.labs.arxiv.org/html/2104.03900)
- InverseCSG — Du et al., ACM ToG 37:6, 2018. [DOI 10.1145/3272127.3275006](https://dl.acm.org/doi/10.1145/3272127.3275006)
- ComplexGen — Guo et al., SIGGRAPH 2022. [GitHub](https://github.com/MeitarShechterLeo/ComplexGen)
- PS-CAD — *ACM ToG*, 2024/2025. [arXiv 2405.15188](https://ar5iv.labs.arxiv.org/html/2405.15188)
- Autodesk voxel→constrained-sketch — Lambourne et al., SIGGRAPH Asia 2022. [arXiv 2209.01161](https://ar5iv.labs.arxiv.org/html/2209.01161)
- Point2CAD — Liu et al., CVPR 2024. [PDF](https://openaccess.thecvf.com//content/CVPR2024/papers/Liu_Point2CAD_Reverse_Engineering_CAD_Models_from_3D_Point_Clouds_CVPR_2024_paper.pdf)
- CADFit — ICML 2026 (MIT/Siemens). [arXiv 2605.01171](https://ar5iv.labs.arxiv.org/html/2605.01171)

**Hybrid & industry:**
- MMNet, Ma et al., *CMES* 2026. [SciDirect](https://www.sciencedirect.com/org/science/article/pii/S1526149226002092)
- Yang et al., "A Hybrid Recognition Framework…," *CAD* 2024. [SciDirect](https://www.sciencedirect.com/science/article/abs/pii/S0010448524001404)
- CADEXSOFT MTK, "Feature recognition in practice." [blog](https://cadexsoft.com/blog/feature-recognition-in-practice/)
- Siemens NX AI/Generative Design. [blog](https://blogs.sw.siemens.com/designcenter/ai-cad/) / [NX Jun 2024](https://blogs.sw.siemens.com/designcenter/new-nx-jun-2024-generative-design/)
- NX Synchronous Technology deterministic FR. [overview](https://www.synchronoustechnology.net/blog/132/3d-cad-systems-synchronous-technology/print/) / [Acuity whitepaper](http://acuityinc.com/pdfs/Why%20Synchronous%20Technology%20Matters.pdf)
- Onshape AI / FeatureScript. [blog](https://www.onshape.com/es/blog/ai-artificial-intelligence-cloud-native-cad-pdm-platform) / [PTC AI Advisor](https://www.ptc.com/en/news/2025/ptc-announces-latest-onshape-ai-advisor-release)
- Backflip AI. [TCT](https://www.tctmagazine.com/backflip-ai-launches-ai-copilot-for-cad/)
- Fusion Generate Face Groups. [Autodesk](https://www.autodesk.com/products/fusion-360/blog/generate-face-groups-fusion/)

**Safety-critical / auditability:**
- GKN Aerospace, *Digital Product Definition for Suppliers* (PSI-PUR, Rev A 2024). [PDF](https://www.gknaerospace.com/media/zuucdaik/psi-pur-digital-product-definition-for-suppliers.pdf)
- ASME 2017 cast-vs-machined classification (confidence failure cases). [ResearchGate](https://www.researchgate.net/publication/10.1115/1.4038686) (DOI 10.1115/1.4038686)
- NeuroCAD xAI feature recognition. [OpenReview](https://openreview.net/forum?id=bjgxjcDyXM)
- Analysis Situs, "Interfacing rule-based FR with ML." [forum](http://analysissitus.org/forum/index.php?threads/interfacing-rule-based-feature-recognition-with-machine-learning-ai-methods.368/)

**Datasets:**
- ABC — Koch et al., CVPR 2019. [project](https://deep-geometry.github.io/abc-dataset/)
- MCB — Kim et al., ECCV 2020. [PDF](https://www.cs.utexas.edu/~huangqx/mcb_benchmark.pdf) / [repo](https://github.com/stnoah1/mcb)
- Fusion 360 Gallery / Reconstruction — Willis et al., SIGGRAPH 2021. [arXiv 2010.02392](https://ar5iv.labs.arxiv.org/html/2010.02392) / [ToG](https://dl.acm.org/doi/abs/10.1145/3450626.3459818)
