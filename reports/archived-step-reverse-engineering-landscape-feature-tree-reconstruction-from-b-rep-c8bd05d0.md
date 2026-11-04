---
{
  "format": 1,
  "metadata": {
    "id": "archived-step-reverse-engineering-landscape-feature-tree-reconstruction-from-b-rep-c8bd05d0",
    "title": "STEP Reverse Engineering Landscape — Feature-Tree Reconstruction from B-Rep",
    "question": "What findings, alternatives and limitations does the historical investigation document about STEP Reverse Engineering Landscape — Feature-Tree Reconstruction from B-Rep?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: STEP Reverse Engineering Landscape — Feature-Tree Reconstruction from B-Rep. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of STEP Reverse Engineering Landscape — Feature-Tree Reconstruction from B-Rep; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:41.839Z"
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
  "sourceDigest": "c8bd05d0af586a064bba406bbd7f54142c11563ba644c2bb883a6e2a222595fe",
  "proposalRevision": "b69e642f65bf872971c2f4014ec4b3f73d56a9ce7e6eddf1c69c8fd3826aa46e"
}
---
# STEP Reverse Engineering Landscape — Feature-Tree Reconstruction from B-Rep

> Reference document for CadQuery-independent, deterministic STEP→feature-tree rebuilding.
> Compiled 2026-08-06 via live web research across academic literature, commercial tools,
> open-source projects, standards, and datasets. Complements `cad_reverse` (this repo's
> deterministic B-Rep→CadQuery pipeline).

---

## Key Takeaways

1. **STEP is a *dumb geometry* carrier.** Standard AP203/AP214/AP242 export transfers only the final B-Rep shape; construction history, parameters, constraints, and features are all stripped ("dead geometry"). Recovering a feature tree is therefore a **reverse-engineering inference problem**, not a data-extraction problem.

2. **The field splits into two camps:**
   - **Deterministic / graph-based** (Attribute Adjacency Graph → subgraph matching; the CAM "Automatic Feature Recognition" lineage). Fast, explainable, 100% reproducible, but NP-complete subgraph isomorphism, struggles with intersecting/interacting features and multiple interpretations.
   - **ML / deep** (BRepNet, UV-Net, Brep2Seq, transformers, LLMs). Robust to interactions and free-form geometry, but non-deterministic, data-hungry, and produce *sequences* (design intent) rather than verified solid outputs.

3. **The product is still the strongest existing precedent for what `cad_reverse` does.** Deterministic B-Rep→feature reconstruction with an editable tree — but it is closed, commercial, incomplete on non-orthogonal/free-form parts, and has no open-source equivalent at the same generality.

4. **Analysis Situs is the only open-source B-Rep feature-recognition platform** (BSD-3, OpenCascade-based). It is the canonical reference for graph-based AFR and AAG feature recognition. `cad_reverse` and Analysis Situs overlap significantly; worth a deep read for algorithm validation even if implementation stays CadQuery-only.

5. **Standards DO exist for encoding history** — ISO 10303 Parts 55, 108, 111, 112 + AP203 Edition 2 describe procedural feature/parameter/constraint exchange — but **no mainstream exporter emits them** (AP242 rejects/history largely unused in practice). The macro-parametric approach (KAIST) is the alternative record-based encoding.

6. **Paired history+STEP datasets are finally available** for ML (Fusion 360 Gallery, DeepCAD, FllumaOne-100K, CAD-Recode). These provide the *supervision signal* for ML reverse engineering that deterministic methods don't need.

7. **build123d is the better reverse-engineering substrate** than CadQuery for *authoring*, but **neither provides feature recognition** out of the box — both require dropping into OCCT (`BRep_Tool`, `DynamicType().Name()`, `Geom_TrimmedCurve`). `cad_reverse` already made the correct call (CadQuery decided at D1; the OCCT escape hatch is the shared dependency).

8. **For a deterministic library, the winning combination is:** AAG + blend masking (already in `cad_reverse` issue #1) + exact primitive recognition (plane/cyl/cone conversions like Analysis Situs' canonical conversion) + rule-based precedence ordering. ML is complementary (as a *checker* or for unresolved interacting features), not a replacement.

9. **The dominant evaluation metric in this space is face-classification accuracy / IoU, not volumetric symdiff** — `cad_reverse`'s symdiff<0.001 gate is stricter and more meaningful than what most ML papers report.

---

## Approach Comparison Table

| Approach | Class | Mechanism | Deterministic? | Std. feature types | Robust to interactions? | Editable tree out? | Verified solid out? | Data needed | References |
|----------|-------|-----------|----------------|--------------------|------------------------|--------------------|----------------------|-------------|------------|
| **AAG subgraph matching** | Deterministic/graph | Build AAG, decompose on concave edges, match predefined feature subgraphs (subgraph isomorphism) | ✅ | Holes, pockets, slots, fillets, chamfers | ❌ (main weakness) | Partial (features tend to be disconnected) | ✅ | None | Joshi & Chang AAG; Analysis Situs; Fu & Yuan 2010 |
| **Volume decomposition** | Deterministic | Decompose delta-volume into cells; generate multiple interpretation trees | ✅ | Machining volumes | ✅ (multiple interpretations) | 🔶 (as alternate volumes) | ✅ | None | Alternate / hybrid FR literature |
| **Rule + graph hybrid** | Deterministic | Weighted AAM + recognition/suppression rules | ✅ | Standard + interacting | 🔶 | 🔶 | ✅ | None | Rule-graph hybrid (Ingenta 2021); Extended AAG |
| **Grammar/syntax** | Deterministic | Feature grammar parsing of B-Rep wire/facial structure | ✅ | Regular patterns | ❌ | 🔶 | ✅ | None | Syntactic FR literature |
| **Hint-based** | Deterministic | Look for evidence ("hints") of missing/interacting features from depressions/convexity | ✅ | Interacting features | ✅ (with virtual faces) | 🔶 | ✅ | None | Hint-based FR |
| **BRepNet** | ML (GNN) | Topological message passing over coedges; per-face op-class classification | ❌ | Extrude/cut/fillet/chamfer/revolve | ✅ | ❌ (classes, not operations) | ❌ | Fusion 360 Seg (35.8k bodies) | Lambourne 2021 (CVPR) |
| **UV-Net** | ML (CNN+GNN) | U/V parametric grids + adjacency graph | ❌ | B-Rep learning | ✅ | ❌ | ❌ | Multi-dataset | Jayaraman 2021 (CVPR) |
| **DeepCAD / Brep2Seq** | ML (seq2seq) | Encode B-Rep → feature-op token sequence; transformer decode | ❌ | Sketch+extrude ops | 🔶 | ✅ (emittable sequence) | 🔶 (re-export) | DeepCAD 178k; Brep2Seq 1M | Wu 2021 (ICCV); BUAA |
| **eCAD-Net / UV-Graph** | ML (CNN+GNN→transformer) | B-Rep→UV-graph→sketch-extrude command sequence; feature-matching post-opt | ❌ | Sketch+extrude | 🔶 | ✅ | ✅ (verts match) | B-Rep+history data | Zhang/Polette (Arts et Métiers 2025) |
| **TransCAD / Dual-Transformer** | ML (transformer) | Hierarchical/double decoder CAD sequence from point clouds | ❌ | Sketch+extrude | 🔶 | ✅ | 🔶 | Point clouds + history | ECCV 2024; IEEE 2025 |
| **Two-level organically-adapted networks** | ML (GNN link-prediction) | Per-face feature type + per-edge precedence + link prediction to merge fragments | ❌ | Feature types + precedence graph | ✅ | ✅ (replayable) | 🔶 | Fusion 360 Seg (85.5k instances) | Pan/Zhu/Cao/Gao/Li EAAI 2026 |
| **LLM / code generation** | ML (LLM) | Point cloud / image → executable CadQuery/CQ code | ❌ | Any (programmatic) | 🔶 | ✅ (directly authorable) | Often fails | Procedural datasets | Img2CAD 2025; GrandpaCAD benchmark |
| **Hybrid ruled** *(recommended for deterministic v2)* | Hybr/deterministic | AAG + blend mask + exact-primitive recognizers + rule precedence, ML as checker | ✅ | Fully recognized subset | 🔶 with rules | ✅ | ✅ | None | cad_reverse (this repo) |

**Legend:** ✅ yes / 🔶 partial-or-sometimes / ❌ no.

---

## 1. Academic Literature — B-Rep → Feature-Tree Reconstruction

The core problem: given final B-Rep geometry (as exported to STEP), recover the **ordered, parameterized construction-history** — the "design intent" — that a CAD operator would use to rebuild the part. Two intrinsic obstructions recur throughout the literature:

- **Feature identification** under *feature interactions* (intersecting features alter/delete local topology), and
- **Non-unique feature sequencing** — many valid operation orders produce identical final solids, so the "true" history is fundamentally ambiguous.

### Key papers

- **Pan, Zhu, Cao, Gao, Li — "An intelligent approach for reconstructing feature-based models from boundary representations via organic adaptation of two-level networks,"** *Engineering Applications of Artificial Intelligence*, 2026. DOI `10.1016/j.engappai.2026.114768`. Two-stage: a multi-task classifier (per-face feature type + per-edge precedence) plus a link-prediction network that merges fragmented regions into full feature instances. On the Fusion 360 Segmentation dataset (35,680 models / 85,511 annotated instances): face-acc 94.51%, edge-acc 87.21%, face-IoU 78.13% (beats UV-Net +4.52 and BRepNet +1.03 IoU points); link-pred acc 83.87% / IoU 72.22%. Emits replayable, editable feature sequences.
  - https://www.sciencedirect.com/science/article/abs/pii/S095219762601050X
  - https://dl.acm.org/doi/10.1016/j.engappai.2026.114768
- **Fu & Yuan — "Technology and implement process of feature recognition based on STEP,"** *China Mechanical Engineering*, 2010. Object-oriented mapping of STEP data types → C++ structures; extracts the topological-geometrical tree, then recognizes features via AAG decomposition + subgraph matching + base-face decomposition. NWPU.
  - https://pure.nwpu.edu.cn/en/publications/technology-and-implement-process-of-feature-recognition-based-on-/
- **Remy, Ducellier, Eynard (Inderscience) — "Advanced STEP parameterised and constrained features for reverse engineering,"** *Int. J. Computer Applications in Technology*, 2008, 32(1) pp.1–11. Interactive RE methodology built on **STEP AP203 ED2 parametric features** so rebuilt features keep associativity.
  - https://inderscience.com/info/inarticle.php?artid=19484
- **FR-CSG — "Fast and Reliable Modeling for Constructive Solid Geometry,"** *IEEE TVCG*, 2025. Reverse-engineering CSG trees via feature removal, subdivision, and coplanar-aware Boolean ops; produces semantic, editable CSG reconstructions.
  - https://www.computer.org/csdl/journal/tg/2025/09/10716804
- **BRepCGC — "Reconstruct CAD feature from Boundary-Representations,"** IEEE. Curvature-guided clustering over the face graph for feature reconstruction.
  - https://ieeexplore.ieee.org/document/11582184
- **Template-based RE (Univ. Florence / KCI):** fit a pre-authored CAD template (feature tree + constraints) to 3D mesh via particle-swarm optimization; implemented across NX ↔ MATLAB.
  - https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART002335617
- **Pan, Liang, Hua, Wang (BUAA) — "Reconstruct PFCAD Models with Dual-Transformer and Continuation Attention,"** IEEE, 2025. Dual global/local transformer decoders + continuation attention for parametric-feature CAD from discrete 3D data.
  - https://ieeexplore.ieee.org/document/11033229
- **eCAD-Net — Zhang, Polette, et al. (Arts et Métiers) — "Editable Parametric CAD Models Reconstruction from Dumb B-Rep Models,"** 2025. B-Rep→UV-graph → CNN+GNN encoder → transformer decoder of sketch-extrude commands; feature-matching post-processing to lock parameters to input geometry.
  - https://www.semanticscholar.org/paper/b02548169b0262d0fcd4216484a09b930c71ff34
- **PhD thesis — Elona Dupont (Univ. Luxembourg), "Design Intent Aware CAD Reverse Engineering: Deep Neural Approaches for Recovering Feature-Based Sequences from 3D Scans,"** 2025. Systematic treatment: B-Rep→history, point-cloud→history (hierarchical transformers), and multi-design-alternative handling of ambiguity.
  - https://orbilu.uni.lu/handle/10993/65389

---

## 2. Known Algorithms (AFR — Automatic Feature Recognition)

This is the CAD/CAM lineage that `cad_reverse` inherits. Survey categorization found in theses: **hint-based, graph-based, syntax-based, rule-based, volume-driven, and hybrid**, plus STEP-based recognition.

### Graph-based (the dominant deterministic family)

- **Attribute Adjacency Graph (AAG)** — the canonical structure. Nodes = faces; arcs = shared edges annotated with **concavity/convexity** (edge convexity is the single most informative signal). Decomposing the AAG on *concave* edges yields machined/subtractive feature subgraphs.
- **Extended AAG / cavity graphs** add face-normal-direction labels and interaction handling.
- **Weighted Attributed Adjacency Matrix (WAAM)** — hybrid rule+graph recognition (Ingenta *Trans. Computers and Info. in Manufacturing*, 2021, 34(3)).
- **Functional-feature extension:** AAG recognition of *functional* features (keyways, relief grooves) → process selection + tolerance/finish association. *Procedia CIRP*, 2026.
  - https://www.sciencedirect.com/science/article/pii/S2212827126008620

**Advantages:** direct graph-matching exploitation, abundant geometry/topology, cheap for isolated features.
**Limitations (why deterministic v1 has "known gaps"):**
- Subgraph isomorphism is **NP-complete** → computational cost grows with feature interaction.
- Poor at **interacting features** and **multiple interpretations** (non-orthogonal, arbitrary, free-form).
- `cad_reverse`'s spurious pocket artifacts on hole walls/floors are precisely a flaw in AAG-derived recognition + coverage heuristics — a known failure mode, addressed by hybrid approaches (virtual faces/links, volume decomposition, tightening coverage guards).

### Volume decomposition
Partition the delta-material volume into cells; recompose into multiple feature interpretations with machining parameters (tool directions, sequences). Best for interacting features; heavy.

### Hint-based
Probe geometry for "hints" (evidenced by depressions/convexity transitions) of features whose topology was destroyed by interaction; insert virtual faces. Robust to interactions.

### Rule-based
Feature grammar / conditional fuzzy matching with suppression rules. Fast, brittle.

### STEP/STEP-NC-oriented
- AP224 extractor → machining feature recognition → AP238 (STEP-NC) generation (Java/JSDAI prototypes, Srivastava & Komma; *Int. J. Automation & Computing* DOI `10.1007/s11633-018-1144-9`).
- ABC (artificial bee colony) + back-prop-NN feature recognition from AP203 minimal subgraphs for STEP-NC-compliant process planning.
- Graph-based multi-scale fusion learning for **STEP-NC** machining feature recognition (Gao et al., NSTL index).

---

## 3. Commercial Tools — STEP → Feature-Tree Reconstruction

| Tool | Vendor | Input | Approach | Output | Notes / URL |
|------|--------|-------|----------|--------|-------------|
| **FeatureWorks** | Dassault (SOLIDWORKS add-in) | Imported STEP/IGES/Parasolid "dumb body" | Rule-based AFR (automatic + interactive + step-by-step) | Editable parametric SOLIDWORKS features | Recognizes extrude/revolve/holes/fillets/chamfers/ribs/patterns/shells/lofts/sheet-metal. Best for prismatic + sheet-metal; poor on free-form. Enabed via Tools→Plugins. https://help.solidworks.com/2025/english/Solidworks/fworks/Step_by_Step_Recognition.htm ; https://feature.geometricglobal.com/oem-products/feature-works/ |
| **Geomagic Design X** | 3D Systems | 3D scan / mesh / point cloud | Mixed modeling (mesh+surface+geometry), history-based reconstruction | Manufacturable, feature-based editable solid | "Intelligent reengineering." Premium, expensive. https://www.laserdesign.com/products/tags/software/ |
| **ANSYS SpaceClaim** | ANSYS | STL / mesh / scans | Direct modeling + mesh-to-curve + solid from mesh | Direct (non-history) editable solid | Good for STL tracing/cleanup; direct modeling, not a feature tree per se. |
| **SOLIDWORKS Convert-to-Sheet-Metal / Xtract3D / Mesh2Surface** | Various | Mesh / mesh scans | Mesh→solid reverse engineering | Editable solid | Xtract3D = SOLIDWORKS plug-in; Mesh2Surface = Rhino plug-in. |
| **NX / CREO / CATIA built-in RE** | Siemens/PTC/Dassault | Mesh/scan | History- or direct-based RE workbenches | Parametric or direct | Proprietary; history reconstruction capability varies. |
| **CADfix / SpaceClaim defeaturing** | ITI TranscenData / ANSYS | Invalid B-Rep | Healing, defeaturing, simplification | Clean direct CAD | Complements feature recognition; not tree reconstruction. |

**Common commercial limits:** best effort on orthogonal/prismatic machining features + sheet metal; free-form/NURBS poorly handled; recognition name/canonical form changes; closed algorithms.

---

## 4. Open-Source Projects (B-Rep Analysis & CAD Reverse Engineering)

### Feature recognition / analysis platforms
- **Analysis Situs** — BSD-3, OpenCascade-based; **the only open-source general B-Rep feature-recognition framework.** AAG features (CNC milled/turned, holes/pockets/slots/fillets/chamfers, sheet-metal), **canonical conversion** (NURBS→analytic plane/cyl/cone/sphere/torus/line/circle), voxelization, visual inspection, defeaturing, DfM, MaaS-ready. GitHub repo mirrored under `CadQuery/AnalysisSitus`.
  - https://github.com/CadQuery/AnalysisSitus
  - https://analysissitus.org/features/features_feature-recognition-framework.html
  - https://analysissitus.org/features/features_convert-canonical.html
- **Palmetto** — web-based AAG CAD feature recognition (STEP import, detect holes/cavities/pockets/fillets/chamfers) + DFM checks. FastAPI + pythonOCC + React/Three.js. Uses Analysis Situs-style AAG. https://github.com/connorkapoor/Palmetto
- **occwl** — lightweight Pythonic wrapper around pythonocc for B-Rep analysis (used widely in AFR research). https://github.com/AutodeskAILab/occwl
- **brep-mesh-decomposition** — triangulated mesh → CAD B-Rep extraction (mesh decomposition → topology → primitive recognition). Original, since ML/RANSAC/EfPiSoft are the only prior options.
  - https://github.com/dairin0d/brep-mesh-decomposition

### ML B-Rep projects
- **BRepNet** — topological message passing over coedges. https://github.com/AutodeskAILab/BRepNet
- **BrepMFR** — machining feature recognition via transformer-GNN + domain adaptation. https://github.com/zhangshuming0668/BrepMFR
- **DualBrep** — Autodesk AI Lab; mesh/point/cloud/image → parametric STEP via two distance fields. https://github.com/AutodeskAILab/DualBrep
- **Brepler** (B-repLer) — language-guided B-Rep editing; HoLa VAE geometry autoencoder. https://github.com/yilinliu77/Brepler
- Related: **CAD-GPT**, **SSDNet** (single-shot machining-feature detection), **MsvNet** (multi-section-view), **FeatureNet**, **hynet/hybridbrep** (self-supervised B-Rep learning).

---

## 5. The ISO 10303 (STEP) Standard — APs & Reverse Engineering

All three common APs carry the **same underlying B-Rep geometry**; they differ in *additional* product/PMI data — irrelevant to geometry-based reconstruction, relevant if you want colors/layers/tolerances/names.

| AP | Name | Geometry | +Extra | RE relevance |
|----|------|----------|--------|--------------|
| **AP203** | Configuration Controlled 3D Design | Brep/surface/faceted/wireframe solids | *None* (no color/layer) | Bare geometry only. The "dumb" baseline. |
| **AP214** | Automotive Mechanical Design | Same | Colors, layers, textual annotations, GD&T (graphical), **construction history in 3D**, kinematics, validation properties | First AP to *permit* history; rarely emitted. |
| **AP242** | Managed Model-Based 3D Engineering (Ed.2, 2020) | Same + tessellated | Merges 203+214 + **3D semantic PMI**, parametric/geometric constraints, kinematics, electrical harness, archiving, access rights | The future-proof, feature-rich exchange. Rejects/history poorly implemented by vendors. |

**For reverse engineering:** differentiate only if (a) source files carry layers/colors (AP214/242) worth preserving, or (b) you need PMI. For raw geometry reconstruction, AP203 vs AP214 vs AP242 make no algorithmic difference. Ref: https://www.capvidia.com/blog/best-step-file-to-use-ap203-vs-ap214-vs-ap242

---

## 6. How Feature History Could Be Encoded in STEP (theoretical even if stripped)

Standard STEP **strips** construction history — history is *not* in ordinary AP20x B-Rep. But ISO 10303 provides standardized mechanisms:

- **ISO 10303-55 — "Procedural and hybrid representation":** transfer a *procedural representation sequence* (ordered constructional operations) with a **dual representation** (procedural + explicit result B-Rep) for validation.
- **ISO 10303-108 — "Parameterization and constraints":** parameters, constraints, 2D sketches for explicit geometric models.
- **ISO 10303-111 — "Elements for procedural modelling of solid shapes":** design-feature / construction-history-feature representation.
- **ISO 10303-112:** exchange of construction-history representations of 2D profiles/sketches.
- Intended for **AP203 Edition 2** so receiving systems can edit "as if native" — but vendor adoption has been minimal; mainstream exports remain history-less.

### Macro-parametric (the record-based alternative; KAIST)
Exchange the **recorded modeling-command sequence** as a neutral macro file (like a DB transaction log). Derived a standard command set by comparing CATIA, Pro/E, UG, IDEAS, SOLIDWORKS, SolidEdge. Transfers design intent by construction; two-stage translation (native→standard; standard→receiver). **Persistent naming** of faces/edges across systems is the hard part. References:
- https://www.sciencedirect.com/science/article/abs/pii/S0010448507001625 ("Standardized data exchange of CAD models with design intent")
- https://www.sciencedirect.com/science/article/abs/pii/S0010448504001230 ("Towards the standardized exchange of parameterized feature-based CAD models")

**Relevance to `cad_reverse`:** because history is never present in practice, hardware does not *decode* STEP history — it *infers* a history from geometry. STEP Parts 55/108/111 are a useful *target vocabulary/reference* for what a "feature" formally is.

---

## 7. AFR in CAD/CAM — How the Machining Community Solved It

The process-planning / CAM community faced the same "dumb geometry" problem first (1980s onward) and produced AFR:

- **Goal:** turn B-Rep geometry into *manufacturing features* (pockets, holes, slots, threads) with machining semantics — the geometric analogue of recovering construction features.
- **AAG (Joshi & Chang 1988)** — the canonical substrate; edge-convexity-driven decomposition.
- **Problem (unchanged today):** feature interactions + multiple interpretations → graph method excels on isolated, fails on intersecting.
- **Modern direction:** deep AFR (BRepNet—face op-class, AAGNet—gAAG, SSDNet, BrepMFR, Hierarchical CADNet) + commercial **HOOPS AI** (Tech Soft 3D) combining Transformer encoders with graph attention for per-face classification (CAD-aware ML SDK).
  - https://docs.techsoft3d.com/hoops/ai/programming_guide/feature-rec.html
- Functional-feature extension → automatic tolerance/surface-finish association and process-capability comparison (*Procedia CIRP* 2026).

**Lesson for `cad_reverse`:** the machining community converged on *edge convexity + AAG decomposition* as the robust deterministic primitive and treats **interacting features via virtual faces/links or volume decomposition** — exactly the classes of heuristics `cad_reverse`'s pocket/stock recognizers encode today (albeit without these names yet).

---

## 8. Datasets with Known Feature Trees / Histories (for benchmarking + ML supervision)

| Dataset | Size | Content | Has history? | Has STEP? | Notes | Ref |
|---------|------|---------|--------------|-----------|-------|-----|
| **Fusion 360 Gallery (Segmentation)** | 35,858 bodies (~500k faces) | B-Rep + mesh + point cloud, per-face op-class labels (8 classes) | Yes (operation IDs, start/side/end, op order) | Yes | Standard 70/15/15; heavily imbalanced. **The** AFR/segmentation benchmark. BRepNet 92.52% acc / 77.10 IoU. | https://www.emergentmind.com/topics/fusion-360-gallery-segmentation-dataset |
| **DeepCAD** | 178,238 | Sketch+extrude token sequences | Yes | Derived | Generative seq2seq baseline. | https://github.com/ChrisWu1997/DeepCAD |
| **Brep2Seq** | 1M (claimed) | Feature-op sequences + hierarchical shapes | Yes | Yes | B-Rep→editable op sequence; transformer. Validated on DeepCAD & F360. | https://research.buaa.edu.cn/en/publications/brep2seq-a-dataset-and-hierarchical-deep-learning-network-for-rec/ |
| **CAD-Recode** | 1M | Code-native CAD programs + geometry | Yes | Yes | Large-scale procedural; broader than Flluma. |
| **FllumaOne-100K** | 100,000 | Executable Python + `feature_tree.json` + kernel-validated `model.step` + clouds + views + NL | Yes (full) | **Yes (kernel-validated)** | Template-based (53 families); Qwen2.5-LoRA baseline: 99.97% build, 99.14% STEP-export validity, Chamfer 0.002124. Built on OpenCascade "Flluma". | https://arxiv-org.ezproxy.obspm.fr/html/2606.17696v1 |
| **ABC** | 1M+ | Single solid B-Rep (no history) | No | Yes (STEP) | Pure geometry for geometric-deep-learning; no feature labels. | https://github.com/hducg/ABC |
| **MFCAD** | ~55k-class machining | 3D CAD with machining-feature labels | Partial (labels) | Yes | Machining-feature classification. | https://github.com/hducg/MFCAD |
| **Machining-feature 24-class × 1000** | 24,000 | Machining features | Labels | Yes | Older standardized machining test set. |
| **Fusion 360 Gallery (Programmatic sequences)** | 8,625 | Hand-authored sketch+extrude DSL with params | Yes (full) | — | Used by Fusion 360 Gym (MDP CAD-authoring env). |

**Bunching note:** "has STEP" ≠ "has an editable feature tree." For benchmarking *reconstruction*, the high-value paired sets are **FllumaOne**, **Brep2Seq**, **CAD-Recode**, **Fusion 360 Gallery**. `cad_reverse`'s table-B/C fixtures (symdiff<0.001) are effectively a small, hand-curated deterministic benchmark with a stricter gate than any of these.

---

## 9. build123d vs CadQuery for Reverse Engineering

Both wrap the **same OpenCASCADE B-Rep kernel** (same `cadquery-ocp`/`OCP`); the difference is API philosophy — and **neither has native feature recognition**.

| Criterion | CadQuery | build123d |
|-----------|----------|-----------|
| API style | Chain-based, **stateful** `Workplane` chaining | **Explicit algebra** — assign shapes to vars; mutation/object model familiar to Python devs |
| Ergonomic stack | Older; heavy chain/state tracking | Modern; better docstrings & type hints; `ocp_vscode` visualizer; tight-but-sufficient primitive set |
| B-Rep access for FR | Via `.wrapped` → `OCP` (`BRep_Tool.Curve_s()`, `DynamicType().Name()`) | Same OCCT escape hatch |
| Fillet/chamfer detection | Requires OCCT: `Geom_TrimmedCurve` signal for fillets; `Geom_Line` + 45° face-angle for chamfers | Same limitation; high-level `edges('%ARC')`/`'%PARABOLA'` are **insufficient** (fillets appear as general curves/splines) |
| Reverse-engineering primitives | **None** out of the box | **None** out of the box |
| AI/code-gen reliability | Lower (chain/state confuses models) | Better than CQ but still ~1.4–1.7 errs/gen vs ~0.4 for OpenSCAD |
| Maturity/worldview | Default, widely established | Modern alternative |

**Bottom line for `cad_reverse`:** the D1 choice (CadQuery) is defensible for ecosystem stability; if authoring ergonomics matter more later, build123d is the better *authoring* substrate. Feature recognition in either case = a custom OCCT layer (which `cad_reverse` already implements with OCP utils → AAG → recognizers). Sources: HN thread https://news.ycombinator.com/item?id=41548945 ; GrandpaCAD benchmark https://grandpacad.com/en/blog/openscad-vs-cadquery-vs-build123d ; fillet-detection F/edge: https://global.php.cn/zh-tw/faq/1797030011.html

---

## 10. Recent ML / Neural CAD Reverse Engineering (2023–2026)

The frontier has moved from *mesh/point-cloud classification* toward **editable, design-intent-preserving reconstruction** and **multi-modal (image/LLM) input**:

- **Brep2Seq** (2024) — transformer B-Rep→editable op sequences; 1M dataset; outperforms prior on reconstruction and generation.
- **eCAD-Net / UV-Graph** (2025, Arts et Métiers) — UV-graph + CNN/GNN → transformer decoder of sketch-extrude; feature-matching parameter post-opt for precision.
- **TransCAD** (ECCV 2024) — hierarchical transformer, point cloud → CAD sequence directly (no intermediate B-Rep).
- **Dual-Transformer + Continuation Attention** (IEEE 2025) — global+local decoders + parameter-adaptor for parametric-feature CAD.
- **Img2CAD** (2024/25) — **single-view image → CAD**, fine-tuned Llama3.2 VLM predicts program structure + TrAssembler transformer predicts continuous attributes; general sketch-extrude representation of everyday objects.
- **Elona Dupont thesis** (Univ. Luxembourg, 2025) — B-Rep→history, point-cloud→history with hierarchical transformers, multi-design-alternative ambiguity handling.
- **CAx/LLM report for code-CAD:** current frontier baseline shows models still *worse than rule-based* at producing valid CAD (cad_reverse's deterministic approach is deliberately LLM-free — Design Decision D2).

**Trend:** inputs broaden (scans, images, language) and output shifts from *geometry* to *authorable histories*. Deterministic AFR remains the accuracy/reliability champion on recognized geometries — no ML paper in this survey matches `cad_reverse`'s volumetric `symdiff < 0.001` guarantee.

---

## Synthesis for `cad_reverse` (actionable)

- **Positioning:** `cad_reverse` sits in the deterministic/graph AFR lineage (repeatable, symdiff-verifiable) — the only approach in the table that *guarantees* solid validity. Its honest "PARTIAL, reason-coded" reports (D9) are a documented, known trade-off that ML and commercial tools paper over with confidence scores.
- **High-value reference implementation:** **Analysis Situs** (BSD-3) — study its AAG feature recognition and, especially, **canonical conversion** (NURBS→analytic) to strengthen `cad_reverse`'s exact-primitive recognizers and cut the spurious-pocket failure mode (tighten/flip coverage guard, exclude hole-floor faces explicitly).
- **Notable gap to close first (unchanged from CLAUDE.md):** spurious pocket candidates on hole walls/floors — a hallmark AAG/interacting-feature artifact; the 24-class machining corpus and eCAD-Net post-optimizers (with Python port) offer validation patterns.
- **Standards as vocabulary:** use ISO 10303-55/108/111 + AP224/AP238 manufacturing-feature taxonomy to nominate new recognizer types beyond holes/pockets/fillets/chamfers (slots/threads/boss profiles), mirroring the CAM community's feature catalog.
- **Benchmarking:** consider adopting a deterministic-symdiff harness over FllumaOne/Brep2Seq STEP exports as a guard oracle (they supply kernel-validated STEP geometry with known histories) without becoming ML-dependent.

---

### Reference hub
- Analysis Situs: https://analysissitus.org / https://github.com/CadQuery/AnalysisSitus
- FeatureWorks: https://help.solidworks.com/2025/english/Solidworks/fworks/Step_by_Step_Recognition.htm
- STEP AP comparison: https://www.capvidia.com/blog/best-step-file-to-use-ap203-vs-ap214-vs-ap242
- Fusion 360 Gallery: https://www.emergentmind.com/topics/fusion-360-gallery-segmentation-dataset
- FllumaOne: https://arxiv-org.ezproxy.obspm.fr/html/2606.17696v1
- BRepNet (CVPR 2021): https://ar5iv.labs.arxiv.org/html/2104.00706 / https://www.research.autodesk.com/publications/brep-net/
- DeepCAD: https://github.com/ChrisWu1997/DeepCAD
- build123d vs CadQuery: https://grandpacad.com/en/blog/openscad-vs-cadquery-vs-build123d
