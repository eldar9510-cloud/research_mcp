---
{
  "format": 1,
  "metadata": {
    "id": "archived-cad-reverse-engineering-tools-complete-landscape-map-9c1f1a38",
    "title": "CAD Reverse Engineering Tools — Complete Landscape Map",
    "question": "What findings, alternatives and limitations does the historical investigation document about CAD Reverse Engineering Tools — Complete Landscape Map?",
    "scope": "Historical OCP/CadQuery B-Rep recognition and reconstruction research: CAD Reverse Engineering Tools — Complete Landscape Map. Algorithm/software/license and experiment statements are report assertions, not newly reproduced results.",
    "summary": "Sourced CAD reverse-engineering study of CAD Reverse Engineering Tools — Complete Landscape Map; preserves proposed algorithms, comparisons, historical experimental results and stated validity/reconstruction limits.",
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
    "imported_at": "2026-11-04T21:30:43.135Z"
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
  "sourceDigest": "9c1f1a38844515df66191e2cb2e322a420131cc6bfe24f752829ab6132c1d908",
  "proposalRevision": "1e4a2293104137bb000ae84b8a3178e640f014a5e80af6b308af038a0e254522"
}
---
# CAD Reverse Engineering Tools — Complete Landscape Map

**Research date:** 2026-08-06
**Scope:** Commercial, open-source, academic, and emerging tools for **automated / headless B-Rep reverse engineering** from STEP files and 3D scan (mesh/point-cloud) data. The focus is on what each tool CAN and CANNOT do programmatically, not on interactive UX.
**Use case anchor:** This research informs `cad_reverse/` — a deterministic, pure-Python, no-LLM STEP→CadQuery re-construction library. The matrix compares each tool against the same criteria: feature recognition scope, automation/API, headlessness, pricing, and format support.

---

## 1. Big-Picture: The Three Reverse-Engineering Workflows

The market splits along two orthogonal axes that most buyer's guides conflate:

**A) STEP-feature recognition ("de-feature & re-feature" / history reconstruction).**
Take an un-historied (dumb) B-Rep STEP/IGES body and rebuild a parametric *feature tree* (extrudes, revolves, holes, fillets, chamfers). This is **exactly what `cad_reverse/` does**. The incumbents that do this well are the "feature recognition assistant" workbenches in FeatureWorks (SolidWorks), CATIA Part Design Feature Recognition, Geomagic Design X AFR, and open-source Analysis Situs.

**B) Scan-to-CAD / mesh-to-B-Rep ("reverse surfacing").**
Take a triangle mesh / point cloud and produce either (i) a watertight *dumb* B-Rep solid, or (ii) a parametric editable model. The dominant commercial players here are Geomagic Design X, Fusion 360 converged/modeling, SpaceClaim, NX Point Cloud → B-Rep, and a wave of 2024–2026 AI startups (Backflip, Polymath).

The two workflows use **different geometric kernels and different recognition machinery**. A tool that excels at scan surfacing (T-spline / quad-dominant organic fitting) is a poor STEP-feature recognizer, and vice-versa. The report is organized by this axis, with a strong bias toward **Workflow A** (deterministic B-Rep history reconstruction) because that is what this project does.

---

## 2. Comparison Matrix

Legend: **F** = Automated Feature Recognition (history rebuild), **M** = Mesh→B-Rep conversion, **D** = Direct/param-editing of imported geometry, **H** = Headless/API automation, **P** = Price.

| Tool | Vendor | Workflow | Recognizes (features) | Input formats | Output | Headless API | Price (approx) | Notes |
|---|---|---|---|---|---|---|---|---|
| **Geomagic Design X (Pro)** | Hexagon (ex-3D Systems) | B (scan-to-CAD) + some F | **F:R** auto + guided; extruded/revolved/swept/loft features; fit analytic surfaces (planes, cylinders) | Point cloud, mesh (STL), some STEP/NAT | Parametric solid + feature tree | Partial (Process Designer, batch, macros — **Pro tier only**); GUI-bound, no standalone CLI | Start $1.9K–$7.3K/yr sub; perpetual $5K–$28.7K (Pro) | Gold standard for scan → parametric. AFR part of Model Wizard. **Not** a STEP-history recognizer. |
| **SolidWorks FeatureWorks** | Dassault Systèmes | F (STEP history) | Extrudes, revolves, holes (drill/cbore/simple), fillets, chamfers, ribs, sheet-metal (flanges, bends), volumes | Imported solid bodies in .sldprt (step/iges/sat via SolidWorks import) | History-based feature tree (FeatureManager) | **Yes — COM API** `IFeatureWorksApp.RecognizeFeatureAutomatic` | Part of SolidWorks (Pro/Premium); standalone sold as PDFer RE historically; see SW pricing | Deepest *additive+subtractive* STEP re-feature tool. API batchable via COM (C#/VBA). No standalone CLI. |
| **CATIA Part Design Feature Recognition** | Dassault Systèmes | F (STEP history) | Pads, shafts (extrude/revolve), pockets, holes, fillets, chamfers, grooves, booleans; sheet-metal walls via FBDI | Imported/dead-solid bodies (V4/V5/V6, STEP, IGES) | Parametric part tree | Very limited; primarily interactive; some CATVBA/automation via CAA | CATIA V5/V6 seat (licenses often grouped); FR1 license for toolbar | Manual/local FR for complex ops; **automatic = holes/fillets/chamfers only**. Booleans as fallback. |
| **Siemens NX** | Siemens | F + B | Synchronous Technology handles imported geometry *directly* (no history rebuild); NX Feature Recognition (holes, pockets, slots, bosses, ribs) on converted objects; Point Cloud → B-Rep wizards | NX, STEP, IGES, Parasolid, JT | Parametric (w/ history) or Synchronous | **Yes — NXOpen** (Python/C#/Java/GRIP/Journ), strong headless (batch, `ugraf`) | NX seat: $9K–$30K/yr TCO typical | Most automation-credible of the big three for headless pipelines. Sync Tech = direct editing, not history reconstruction. |
| **Creo (PTC) — Flexible Modeling + Unite** | PTC | F + B | Flexible Modeling edits imported/neutral geometry directly; Unite links non-native CAD w/o translation; RE extension + Facet Modeling for scan | Creo, STEP, and native CATIA/SW/NX/Inventor via Unite | Parametric where source is native; Flexible for dumb | **Yes — Creo Toolkit / J-Link** (Java) + Creo Parametric ToOLkit, batch via `proe_install` | Creo Parametric seat ~$8K+/yr (multi-config) | Direct editing strong; feature-history rebuild weaker than FeatureWorks/CATIA. |
| **ANSYS SpaceClaim / Discovery** | ANSYS | B + M + D | Warp-by-mesh, mesh → solid conversion, direct modeling on imported geometry; defeaturing; not a STEP feature-tree recognizer | STEP, IGES, Parasolid, mesh (STL), native via add-ons | Direct-model b-rep, meshes | **Yes — robust Python API** (SpaceClaim.Api.V*.Scripting; Discovery extends it), macros, headless batch | SpaceClaim node-locked seat; Discovery seat; ANSYS suite pricing | Best headless *geometry-prep/cleanup* API of the mainstream tools. Weak on parametric history rebuild. |
| **Autodesk Fusion 360** | Autodesk | B + M + limited F | "Find Features" (retrieve parametric features from imported bodies **only in direct mode**, partial); mesh→solid (faceted/organic/prismatic); Generate Face Groups; Fit Face/Surface | STEP, IGES, SAT, STL/mesh, native | Parametric (if rebuilt) | **Yes — Fusion API (Python/C++)**, headless via `Fusion360.exe` fast-start / automation Add-ins; also Onshape/cloud | Cloud seat (free tier to ~$680/yr; commercial ~$2K/yr) | "Find Features" captures partial param history but is immature vs. raw FeatureWorks. Good scan-to-parametric with manual rebuild. |
| **TransMagic** | TransMagic | D (translation/heal) | Translation + repair/re-skin; no feature recognition | 50+ formats incl. native+STEP | Dumb b-rep (re-skin) | **Yes — SuperView engine, command line, API** | ~$1K–$8K nodes | Translator/repairer, **not** a feature recognizer. Sometimes removes features deliberately. |
| **CADfix** (ITI) | ITI (eTech) | D (heal/defeature) | Shape healing, defeaturing, topology cleanup, wrap/simplify for CAE/CAM | Broad CAD + mesh | Cleaned dumb b-rep / mesh | **Yes — batch, scripting, API (user-command, web)** | Enterprise, quoted | Best-in-class healing pipeline; defeaturing = *removing* features not extracting them. |
| **Datakit** (CrossManager/CrossCad_Plugins) | Datakit | D (translation) | Format translation, param-preservation to some extent; small recognition (e.g. ProE params) | 45+ native + neutral formats | Preserves what source gives; dumb on lossless-tight formats | **Yes — CrossManager CLI + .NET/Python API (CrossCad, 3DAnalysis)** | Licensing by format count; quoted ($2K–$10K+) | The translation/reuse engine behind many reseller products. **3DAnalysis** does some B-Rep analysis/geometry checks. |
| **hyperMILL** | Open Mind | CM (machining FR) | **Automatic Feature Recognition** for holes, threads, pockets; intelligent macros; color tables | Native + imported solid/surface | Machining features → toolpaths/macros | Yes (partly — automation via Feature & Macro Programming, rules) | CAM seat pricing | CAM-side FR — optimizes NC programming, not history rebuild. Color-based classification is distinctive. |
| **Tebis** | Tebis | B + CM | Scan-to-model rev-eng workbench; machining feature/template automation | Mesh, CAD | Parametric-ish + toolpaths | Partial (template/automation) | CAM seat | Strong automotive die/mold rev-eng; GUI-bound automation. |
| **Edgecam** | Hexagon/Sandvik | CM | Machining feature detection for prismatic parts | CAD solid | Machining features → CAM | Via macros + API | CAM seat | Manufacturing FR focus. |
| **Analysis Situs** | Open source (OCCT-based; see CadQuery/AnalysisSitus) | **F (framework)** | Drilled holes (simple/cbore/csk/cdrill), pockets (blind/thru/shallow/deep), fillets, chamfers, blends; canonical conversion of surfaces→planes/cylinders/cones/spheres/tori | STEP, IGES, BREP | Recognition results, AAG, edited shapes; **does not emit CadQuery** | **Yes — C++ SDK** (`asiAlgo_AAG`, `asiAlgo_RecognizeDrillHoles`, `asiAlgo_ExtractFeatures`...), Tcl console, GUI. **No real Python binding fo core algo** (the web/DFM front ends are others' Python wrappers) | **Free** (open-source; commercial paid extensions for CNC/DFM/sheet-metal) | **Closest open-source analog to `cad_reverse/`.** Same AAG substrate. Overlaps our scope; ours adds deterministic CadQuery emission + no-LLM. |
| **pythonOCC / occwl + PyTorch (research)** | Community | F (NN) | UV-Net / BRepNet / CADNet train on MFCAD: pockets, slots, holes, chamfers, fillets (label per face) | STEP via pythonOCC | Face-feature classifications | Headless Python | **Free** | Research-grade; classification of *faces*, not a watertight history rebuild. |
| **FreeCAD** | Open source | None built-in F | **No native feature recognition** of imported geometry; only Part/PartDesign re-modeling & some macros | STEP, IGES, BREP, OCCT | Manual re-model | **Yes — Python (FreeCAD Gui/Interop API)** can be scripted headless | **Free** | Macro ecosystem exists but no shipped AFR. Community macros approximate FeatureWorks. |
| **CadQuery** | Open source | D (modelling) | No FR; forward/scripted modeler on OCCT; **no STEP→script auto-fr** | via OCCT | Parametric script (our emitter) | **Yes — pure Python** | **Free** | The output side of `cad_reverse/`. |
| **build123d** | Open source | D | No FR; hybrid direct/history modeler | via OCCT | Script | **Yes — Python** | **Free** | None. |
| **DualBrep** (Autodesk AI Lab, 2026) | Research | B→BRep (NN) | Reconstructs watertight B-Rep STEP from mesh/point/images by encoding shape as SDF/UDF fields, neural rebuilder | Mesh, point cloud, images | Watertight B-Rep STEP (dumb) | Research Python | Open research | *Neural dumb-B-Rep*, not a feature tree. |
| **B-repLer** (2026) | Research | F-lite | Language-guided B-Rep CAD editing in learned latent space | STEP | Edited BReps | Research Python | Open research | LLM-ish edit, not fully deterministic. |
| **CADENA** (Aug 2026 preprint) | Research | F (NN program) | Grows a parametric CAD program operation-by-operation, comparing target at each step; beats DeepCAD/Fusion360/MCB | Mesh / BRp | Parametric CAD program | Research | Open research | Frontier of *constructive* feature synthesis. |
| **Backflip AI** | Startup (Markforged founders) | B→F (AI) | Mesh/STL/scan → editable parametric feature tree; Fast (4 variations) + Thinking modes; trained on 100M+ synthetic parts | Mesh/STL/scans | Parametric CAD (feature tree) | **Yes — SaaS API + Fusion/Onshape/standalone web; cloud GPU** | $20/mo sub up to enterprise; ~$10/part vs $1,500 manual | Market-defining AI mesh→parametric. Cloud SaaS, not on-prem deterministic. Dassault pulled the SW plugin. |
| **Polymath** (seed, 2025) | Startup | Legacy→CAD | AI reconstruct of legacy drawing→parametric; PMI extraction; text CAD query | Legacy drawings, models | Parametric + PMI | Startup; unknown | Early-stage | MBD/PMI angle. |
| **ZZW / Bricsys / Alibre / Rhino (Rhinoceros)** | Various | B | Rhino= flexible NURBS/SubD mesh rev-eng, big plug-in ecosystem, automation; not a feature-tree recognizer | Wide | NURBS/SubD solids | Rhino: Python (RhinoScriptSyntax) strong | Rhino ~$995 one-time | Power-user mesh→NURBS surfacing; minimal AFR. |

---

## 3. Commercial Tools in Depth

### 3.1 SolidWorks FeatureWorks (Dassault Systèmes) — the STEP-history benchmark

- **What it is:** Now built-in to SolidWorks Pro/Premium; historically also a standalone "PowerPak" for eDrawings-era. Converts imported (dumb) solid bodies into **history-based features** that appear in the FeatureManager tree.
- **Recognizes:** extrusions (pads), revolutions, holes (drill/simple/through/clearance), fillets, chamfers, ribs, plus sheet-metal (base flanges, edge flanges, hems, sketched bends, automatic edge flanges). Option bitmask via `fwAutomaticRecognitionOptions_e`: `fwExtrudeOption`, `fwHoles`, `fwRevolveOption`, `fwChamferOption`, `fwFilletOption`, `fwRibs`, `fwAutoEdgeFlange`, `fwHems`, `fwBaseFlange`, `fwSketchedBend`, `fwVolumes`.
- **Automation/headless:** **Yes via COM API.** `GetAddInObject("FeatureWorks.FeatureWorksApp")` → `IFeatureWorksApp.RecognizeFeatureAutomatic(options)` → returns count → `CreateFeatures(fwAllowFailFeatureCreation)`. Batchable from C#/VBA. **No standalone CLI from the CLI itself** — you must host the SolidWorks app (COM out-of-process). Requires a licensed SW session (and FeatureWorks DLLs loaded).
- **Cannot do:** combine/re-recognize existing, recognize patterns, "Recognize Similar," local FR via this API (some of that is GUI-only). It recognizes a body inside a *SolidWorks* document — you must first import STEP/IGES via SW's own importers.
- **Relevance to us:** The closest commercial functional twin to `cad_reverse/`, but proprietary, Windows/COM-bound, GUI-app-hosted (not truly headless), and tied to the SW object model — you get a SW part, not a CadQuery script.

### 3.2 CATIA Part Design Feature Recognition (Dassault Systèmes)

- Works on **"dead body"** models (isolated/imported, no construction history). Recreates construction history so features can be re-edited/parameterized.
- Four tools: Manual FR, Automatic FR, Part Analysis (scan for simple features, color-highlighted), Defeat a Shape (strip history).
- **Automatic FR globally detects only holes, fillets, chamfers.** Anything richer needs Local/Range FR or Manual FR (pick type + faces). Recognizes pads/shafts (extrude/revolve, inner vs outer profile), pockets (`Recognize up to face`), holes (manual recommended; tapped holes iffy), fillets/chamfers (manual for complex), grooves, Booleans (last resort).
- Sheet metal: imported V5 sheet-metal features are deprecated in V6; must convert via File-Based Design Import (FBDI) walls → Recognize.
- **Automation:** weak headless story; primarily interactive; automation via CATVBA/CAA is heavy. Not suited to unattended pipelines.

### 3.3 Siemens NX

- **Two distinct engines:** (1) **Synchronous Technology** — direct editing of *any* geometry (imported or native) without feature history; conceptually "the model IS its own history." (2) **Legacy Feature Recognition** on converted objects (holes, pockets, slots, bosses, ribs, grooves, fillets, chamfers) feeding synchronous/CAM.
- **Reverse engineering:** Point Cloud / Facet → B-Rep surfacing wizards, converge, mesh prep.
- **Automation/headless — the strongest of the big three:** **NXOpen** (Python, C#, Java), Journaling (record→replay→stamp), GRIP, and headless batch via `ugraf -b` on a server. You can open STEP, run FR, and emit results without a display. Scripts stamp across versions.
- **Relevance:** If you need a *trusted, supportable* headless STEP-feature-recognition server today, NX+Sync+FR+NXOpen is arguably the most defensible commercial choice — but at enterprise pricing and closed-source. Direct ("synchronous") modeling ≠ a parametric FeatureWorks-style tree.

### 3.4 Creo (PTC)

- **Unite Technology:** work non-translated with native CATIA/NX/SW/Inventor files inside Creo.
- **Flexible Modeling:** direct edits (move, replace, resize) on imported/neutral geometry; strong on dumb-B-Rep manipulation, weak on reconstructing a clean historical tree.
- **Scan/RE:** Creo Reverse Engineering extension + Facet Modeling / Point Cloud → convert to B-Rep or T-splines.
- **Automation:** Creo Parametric Toolkit / J-Link (Java) + **Creo Parametric ToOLkit** (C/C++ J-Link/`Toolkit`), batch via `proe_install` / trail files. Good but C/Java-centric; less Python-natural than NXOpen.

### 3.5 ANSYS SpaceClaim / Discovery

- **Reverse engineering:** mesh → solid conversion, direct modeling, **deformed-mesh warping to solid** (`WarpBodyByMeshNew`), defeaturing, pull/patch/cleanup, section/measure tools. **This is a geometry-prep/direct modeler, NOT a parametric history recognizer.**
- **Automation/headless — excellent for geometry:** Script Editor records macros; `SpaceClaim.Api.V*.Scripting` Python API; Discovery extends it and scripts are broadly compatible. Can run headless/batch for cleanup & healing tasks. This is the mainstream tool we'd cite as the headless *cleaning/simplification* analog.
- **Cannot:** rebuild a feature tree from STEP; it treats imported geometry as direct-mod geometry.

### 3.6 Autodesk Fusion 360

- **Scan→parametric:** mesh workspace; three conversion paths (faceted/organic/prismatic); **Prismatic conversion** rebuilds CAD-like faces (planar/cylindrical/filleted) → good for mechanical parts (commercial license). **Generate Face Groups** (Prepare) with Fast vs **Accurate** modes (the latter finds fillets well) dramatically improves conversion quality.
- **"Find Features":** retrieves parametric features from imported bodies — but **only in direct modeling mode** (disable "Capture Design History" first), and it is partial/immature vs. FeatureWorks. Imported STEP/IGES/STL open as direct-model bodies with no timeline.
- **Automation:** Fusion API (Python & C++), Add-ins/scripts, scripted personal + auto-update; headless via automation server / fast-start. Good cloud-adjacent story.
- Verdict: strong scan→parametric (with manual assist), decent but not best-in-class STEP-history FR.

### 3.7 TransMagic, CADfix, Datakit — translation & healing (a distinct category)

These are **not** feature recognizers — they move/heal geometry and often *deliberately remove* history/features:

- **TransMagic:** 50+ formats; SuperView (full-geometry checker), re-skin (rebuild clean B-Rep), eCAD view/filtering; **CLI + API (SuperView Engine) + batch**; node-based licensing. Repair/re-skin, no AFR.
- **CADfix (ITI/ecnp):** the healing/defeaturing heavyweight for CAE/CAM pre-processing; shape-healing, topology repair, wrapping, simplifaction/silhouette, defeaturing (feature *removal*), and **CADfix for Reverse Engineering** import mesh. **Batch + user-command + web API / scripting.**
- **Datakit:** the OEM translation engine (CrossManager CLI, `CrossCad` .NET/Python SDK, `3DAnalysis` for B-Rep geometry analysis/validation). Many reseller products *are* Datakit underneath. Translates 45+ formats, preserves param where the source format allows.

These matter to us as the *pipeline front-end/cleanup* layer and as the commercial offset to `cad_reverse/`'s heal step — but none give you extracted features.

### 3.8 CAM-side feature recognition (Tebis, hyperMILL, Edgecam)

A whole separately-marketed category: **machining feature recognition (FR)** whose output is NC toolpaths, not a design tree.

- **hyperMILL (Open Mind):** Automatic Feature Recognition for holes, threads, pockets; **intelligent Macros** storing strategies + tool selection rules keyed off geometry attributes (diameter/depth); **color tables** use CAD face colors to encode tolerances/fits → machine-type classification. Automates setup programming; not a design-history tool.
- **Tebis:** strong automotive die/mold reverse-engineering (scan→model) + template-driven automation; GUI-bound.
- **Edgecam (Hexagon/Sandvik):** prismatic machining feature detection feeding CAM; macro/API automation.
- These confirm that "feature recognition" in industry often means *manufacturing* FR — a different goal from ours (design/parametric reconstruction), but worth naming so the landscape is complete.

---

## 4. Open-Source & Research Landscape (closest to `cad_reverse/`)

### 4.1 Analysis Situs — the open-source AAG FR framework (the key analog)

- **The only broadly open-sourced FR package** built on Open Cascade (OCCT) B-Rep. Explicitly: "feature recognition logic for OpenCascade."
- Framework: build an **Attributed Adjacency Graph (AAG)** (abstracts topology from geometry) → locate features as AAG subgraphs (isomorphic subgraph search, connected components, virtual defeaturing).
- Recognizers (`asiAlgo_*`): `_AAG` (graph build), `_RecognizeDrillHoles` (simple/cbore/csk/cdrill), `_ExtractFeatures` (pockets: blind/thru/shallow/deep; fillets; chamfers; blends), `_ConvertCanonical` (fit freeform→plane/cylinder/cone/sphere/torus — key for recognizing cylinder holes).
- **Relevance: same substrate & vocabulary as `cad_reverse/` (AAG is Issue #1 in this project).** Differences: Analysis Situs is a C++ SDK/Tcl/GUI workbench — recognition is C++ (no clean Python binding; the web/Py front ends like Palmetto wrap it); it **does not emit CadQuery**; its focus is subtractive DRF (holes/pockets/fillets/chamfers) not additive pad-history synthesis; it's an open library/reference rather than a turnkey CLI.
- Note `CadQuery/AnalysisSitus` exists on GitHub (a port/fork) — worth tracking as a direct overlap.

### 4.2 pythonOCC + deep-learning FR (UV-Net / BRepNet / CADNet / DualBrep / B-repLer)

- **pythonOCC** (conda `pythonocc-core`) is the de-facto B-Rep I/O + topology library in the academic ecosystem. **`occwl`** is a pythonOCC convenience wrapper for B-Rep→graph mapping used by UV-Net.
- Feature-recognition-by-NN: **CADNet** (GNN over MFCAD, planar B-Reps), **UV-Net**, **BRepNet**, **Hierarchical B-Rep Graphs** — all *classify faces/graphs* into machining feature classes; none reconstruct a full history.
- **DualBrep (Autodesk AI Lab, 2026):** encodes a shape as neural SDF/UDF fields and rebuilds a **watertight dumb B-Rep STEP** from mesh/point cloud/image. This is *neural dumb-B-Rep generation*, closer to the "B workflow," and it is a research artifact.
- **B-repLer (2026):** language-guided B-Rep editing in a learned latent space; reconstructs valid B-Reps from STEP. LLM-shaped, not deterministic.

### 4.3 FreeCAD, CadQuery, build123d

- **FreeCAD:** full OCCT modeling app with a mature Python API — but **no shipped automatic feature recognition**. You manually re-model imported STEP or run community macros (weak approximations). Headless-capable (lots of scripts) but no canned AFR.
- **CadQuery / build123d:** forward/build scripted modelers on OCCT. **Neither has input-side FR** — they are exactly the *emitter* side that `cad_reverse/` targets. build123d adds hybrid direct+history modeling but no recognition.

### 4.4 Frontier research (2025–2026)

- **CADENA** (Aug 2026 preprint): reconstructs a mesh as a parametric CAD *program* by adding operations one at a time, comparing target geometry after each — beats DeepCAD / Fusion 360 / MCB on CADENA-Bench. This is the constructive/CC (graph-to-CAD) frontier; not yet commercial, but the direction commercial AI (Backflip) has industrialized.

---

## 5. Pricing & Licensing Summary (2026, USD)

| Tool | Subscription (yr) | Perpetual | Notes |
|---|---|---|---|
| Geomagic Design X Go | $1,900 | $4,990 (+$900/yr maint) | ONA (computer-locked) only |
| Geomagic Design X Plus | $3,990–$4,190 | $12,710 (ONA/OFD) / $16,510 (NWA) | +dongle $550; +(portable) OFD |
| Geomagic Design X Pro | $7,280 (Rev1) / "contact" (Hexagon) | $22,040 (ONA/OFD) / $28,660 (NWA) | Only tier with batch/scan automation + AFR-in-Process |
| SolidWorks (incl. FeatureWorks) | ~$1,995–$4,990 Standard; Pro/Premium tier | one-time + annual | FeatureWorks needs Pro/Premium |
| CATIA | by seat/license group (often 6-figure deployments) | — | FR toolbar may need FR1 license |
| Siemens NX | $9K–$30K+ TCO/seat/yr typical | — | Enterprise |
| Creo Parametric | ~$8K+/yr | — | RE extension + Flexible add-ons |
| Fusion 360 | Free (hobby) → ~$2K /yr Professional | — | Prismatic mesh conversion needs commercial tier |
| Rhino 3D | — | ~$995 | Plug-ins extra; no AFR |
| SpaceClaim | ANSYS suite (quoted) | — | Discovery ~$5K+/yr entry |
| TransMagic | — | ~$1K–$8K by format count | One-time + node |
| CADfix | Enterprise, quoted | — | Batch/web API add-ons |
| Datakit | quoted (per-format) | — | OEM → API/SDK licensing |
| Analysis Situs | **Free** (open-source) | — | Commercial paid extensions (CNC/DFM/sheet-metal) |
| pythonOCC/FreeCAD/CadQuery/build123d | **Free** | — | MIT/Apache/BSD-ish |
| Backflip AI | Free tier (4 parts) → $20/mo → enterprise | — | ~$10/part via subscription credits |
| Polymath | early-stage | — | — |

**License-model litmus for headless automation:** the cheap/automation-friendly tiers are typically **missing the API/batch capability**. In Geomagic Design X the **batch/Process Designer lives only in Pro** ($7.3K/yr). In CATIA, full automation requires CAA-level licensing. To *actually* run feature recognition unattended on a server, you are almost always paying enterprise money for the API tier (NXOpen on NX, FeatureWorks-in-SolidWorks-Professional, SpaceClaim/Discovery, CADfix). The open-source stack (pythonOCC, FreeCAD, Analysis Situs) is the only free headless route, and it lacks a turnkey STEP→CadQuery emitter — which is precisely the `cad_reverse/` niche.

---

## 6. API / Headlessness Capability (the automation focus)

| Tool | Python API | Headless/batch | Standalone CLI | Automation tier caveats |
|---|---|---|---|---|
| NX | **Yes (NXOpen Python)** | Yes (`ugraf -b`) | No | Enterprise NX + NXOpen lic |
| SpaceClaim/Discovery | **Yes** (`SpaceClaim.Api`) | Yes | Scripts | ANSYS suite |
| FeatureWorks | Yes (generic DSO language; Python via SW API) | **Hosts the GUI app** (COM out-of-proc) | No | Needs SW Pro/Premium running |
| Fusion 360 | **Yes** | Yes (fast-start automation) | Scripts/add-ins | commercial license for prismatic |
| Geomagic Design X | Indirect (macros/Process; no native Python) | **Only Pro tier** | No | Pro-only batch |
| Creo | Weak Python; **J-Link/ToOLkit** (C/Java) | Via `proe_install`, trail | No | Developer toolkit lic |
| TransMagic | Yes (SuperView API) | Yes | Yes | Licensed |
| CADfix | Yes (web API/scripting) | Yes | Yes | Enterprise |
| Datakit | **Yes (CrossCad .NET/Python SDK)** | Yes (CrossManager) | Yes | Per-format lic |
| Analysis Situs | **No real Python for core algo** (C++/Tcl) | Tcl console, GUI | C++ SDK | open-source; Py via third-party wraps |
| pythonOCC + NN | **Yes** | Yes | scripts | research-grade |
| FreeCAD | **Yes** (module/interop) | Yes | `freecadcmd` | no FR built-in |
| CadQuery / build123d | **Yes** | Yes | pure Python | emitter only |
| Backflip AI | SaaS/API (web + CAD add-ins) | Cloud GPU | API | cloud, per-part credits |

**Bottom-line:** For fully unattended, deterministic, on-premise STEP→feature-tree reconstruction with a clean API and no GUI, the realistic 2026 choices are: **NXOpen** (enterprise, closed), **FeatureWorks via COM** (Windows, needs running SW, no real CLI), **Creo Toolkit** (C/Java heavy), **CADfix/Datakit** (healing, not FR), or **the open-source stack** (Analysis Situs for FR + CadQuery for emission = effectively `cad_reverse/`). **No commercial tool ships a clean, truly headless, on-premise STEP→CadQuery-script feature recognizer** — the obvious white space.

---

## 7. Industry Adoption

- **Automotive & aerospace (Tier-1s, OEMs):** NX Synchronous Technology + Geomagic Design X Pro; heavy use of scan-to-CAD for legacy tooling, dies, molds, crash-hardened parts, and as-built digital twin (Tebis is standard in German die shops). CATIA FR for aero surfacing & legacy-vault parts. This sector pays for enterprise automation (NXOpen/CAA).
- **Medical & capital equipment:** Fusion 360 / Geomagic (validated, traceable ReCo/CMM-heavy; Geomagic for Qualify / Control X for GD&T metrology).
- **MRO / aftermarket & legacy-part digitization (Boeing/FAA-driven):** scan-to-CAD into SolidWorks/NX; growing interest in AI mesh→parametric (Backflip) to cut the $1,500/part manual cost.
- **Consumer products / prototyping / maker:** Fusion 360 free+commercial, Rhino, and web AI SaaS (Backflip) — democratized scan-to-parametric, often to 3D-print or for non-CAD experts.
- **Additive/manufacturing & QC:** CAM-side FR (hyperMILL/Edgecam) aligns machining-feature Automation with AFP for AM; Geomagic/Control X for as-built vs CAD deviation.
- **Engineering/SIMULIA prep:** CADfix, ANSYS Discovery/SpaceClaim for defeaturing & mesh-ready geometry (headless pipelines).
- **Research/academia:** pythonOCC + MFCAD/HybridCAD datasets for ML feature recognition; Analysis Situs as the reference AAG FR framework.

---

## 8. Feature Recognition Benchmarks & Datasets

- **MFCAD / MFCAD++ (QUB):** machining-feature-recognition dataset, 59,665 B-Rep models (41,766 train / 8,950 val / 8,949 test), STEP files, per-face feature labels extracted from STEP via pythonOCC; hierarchical B-Rep graphs in HDF5. **The de-facto ML FR benchmark.**
- **MFCAD-VLM (Zenodo):** extends AFR research to vision-language models; STEP + ground-truth JSON + multi-view isometric images; covers machining, AM, sheet-metal, molding, casting; complexity tiers (easy/medium/hard).
- **HybridCAD (Zenodo, 2024):** 8,938 STEP B-Reps for *hybrid additive-subtractive* FR; 29 feature classes (chamfers, holes, passages, slots, steps, pockets, extrusions); hierarchical B-Rep graphs; 70/15/15 split.
- **DeepCAD / Fusion 360 Gallery / MCB:** the modeling-sequence (CSG / graph-to-CAD) benchmarks used by CADENA — train/validate *constructive parameter-vector* reconstruction.
- In the classic (non-NN) literature the **NIST standard test parts** and the **MMC (Machining Model / Man-Made Components) parts** were the traditional acceptance tests for rule-based FR (FeatureWorks/CATIA-era). They are not published as an open dataset the way MFCAD is, but remain the canonical *geometric* reference shapes.
- **Note for `cad_reverse/`:** no public benchmark *directly* scores a full STEP→editable-CadQuery *history* round-trip with a symdiff gate. The nearest reference-points are (a) MFCAD face-labels for recognition quality and (b) this project's own `symdiff < 0.001` round-trip gate. There is no standard test-suite that competitors are held to — an opportunity to define one.

---

## 9. The CAD Interoperability Market

- **Size (2025 estimates vary by research house):**
  - CAD Data Exchange Software: **~$2.8B (2025) → $5.4B (2033)** (Maia), ~8.6% CAGR
  - CAD Data Translation Software: ~$2.34B (2025) → $4.0B (2035), ~5.5%
  - CAD Data Interoperability: ~$1.61B (2024) → $3.77B (2033), ~10.2% (DataIntelo)
  - CAD Data Exchange: ~$2.06B (2025) (WiseGuy)
- **Disagreement is normal** — different scoping (translation-only vs. exchange+interop vs. SaaS). Consistent themes: strong growth, North America leads, APAC fastest, cloud + AI/ML translation improving accuracy.
- **Key players:** Dassault Systèmes, Autodesk, Siemens, PTC, Tech Soft 3D (the HOOPS engine behind countless products), Hexagon, Datakit, Elysium, E3D/CAD Exchanger, Actify, ITI (CADfix). Recent moves: Autodesk–ZWSOFT & Autodesk–Bricsys partnerships, Dassault adding native translation in 3DEXPERIENCE, Siemens/PTC/Hexagon interop collaborations.
- **Trend** amplifying into reverse engineering: translation is commoditizing; the value is moving **up the stack** from "move the file" to "make the file *editable* again" (i.e., feature recognition, history rebuild, parametrization). That is exactly the layer where `cad_reverse/` sits and where neither general translation tools nor dumb-B-Rep converters play.

---

## 10. Emerging Startups & Cloud/SaaS (2024–2026)

- **Backflip AI** — the market-defining AI mesh→parametric. Founded by Markforged founders (Greg Mark, David Benhaim); emerged from stealth 2024. Renders STL/scan→editable parametric feature tree with natural, human-editable CAD. Fast (4 variants) + Thinking modes; trained on 100M+ synthetic parts. Delivery: **Autodesk Fusion add-in, standalone web app, Onshape add-in coming; cloud GPU.** Pricing freemium → $20/mo → enterprise; ~$10/part vs $1,500 manual. A SolidWorks plugin was built then *not* shipped (Dassault declined), showing big-platform resistance to third-party RE.
- **Polymath** — 2025 seed startup; AI reconstruction of legacy drawings→parametric CAD, PMI extraction for MBD, text-based CAD querying. Small (5 staff, 3 investors).
- **Dassault Systèmes** announced native mesh→parametric for SolidWorks (in development) — the incumbents are moving to absorb this capability.
- **Creaform Scan-to-CAD Pro** (Hexagon) — metrology-suite RE module adding 2D sketch + 3D modeling; notably *not* auto-modelling (manual-assist), the explicit gap Backflip exploits.
- **CNN-era US and EU NSF/Paris** research prototypes (CADENA, DualBrep) are startup-adjacent talent pools; expect commercialization in 12–24 months.

### Cloud/SaaS angle
Reverse engineering as a service is real (Backflip's cloud GPU + per-part credits) but carries a **hard tension**: regulated aerospace/aerospace & med OEMs want **on-premise/air-gapped** deterministic tools (that's why INSVISION's enterprise pitch leads with on-prem security). So the SaaS wave serves the democratized low-complexity end, while deterministic on-premise libraries (like `cad_reverse/`) serve the high-assurance industrial end — **both can coexist; the deterministic on-premise, fully-automated niche is not being served by the AI SaaS startups.**

---

## 11. Key Takeaways — Market Gaps & Opportunities

1. **The "Workflow A" deterministic STEP→history-rebuild niche is still underserved.** FeatureWorks/CATIA are the only strong commercial STEP-history recognizers, and both are closed, interactive-first, and GUI-hosted (no clean headless CLI, no CadQuery output, Windows/COM-bound). Nothing free does the whole job (Analysis Situs = C++ FR library without an emitter; CadQuery = emitter without FR). **`cad_reverse/` occupies genuinely open ground: deterministic, on-premise-affordability, pure-Python, emits a clean CadQuery script, gates on symdiff.**

2. **Two axes, not one — position clearly.** The industry conflates scan-to-B-Rep surfacing (Geomagic/Fusion/SpaceClaim = "B workflow") with STEP-feature-history rebuild (FeatureWorks/CATIA/Analysis Situs = "A workflow"). `cad_reverse/` is unambiguously Workflow A. Published comparisons (Geomagic vs CATIA: ~-25% modeling time, comparable RMS) are about **workflow speed**, and always assume an interactive engineer — none of them address unattended automation.

3. **Headless capability is gated by the paid tier everywhere.** Batch/API almost always costs enterprise money: Geomagic batch = Pro only (~$7.3K/yr); CATIA automation needs CAA; NXOpen needs NX. The only free headless route is OCCT-based open source (pythonOCC, FreeCAD, Analysis Situs), and each covers only a slice. A free, self-contained, API-first full-pipeline tool is a real product gap.

4. **Net-new benchmark opportunity.** There is **no governing public benchmark** for full STEP→editable-history round-trip quality (the datasets — MFCAD, MFCAD-VLM, HybridCAD, DeepCAD — score face-labels or CSG traces, not a usable CadQuery script). `cad_reverse/`'s `symdiff < 0.001` round-trip gate is effectively a novel, defensible evaluation that no vendor ships. Defining and publishing this test-suite is a differentiator and could become a community standard.

5. **AI/DNN is converging on this space but from the B/CSG side.** Backflip (mesh→parametric SaaS), CADENA, DualBrep all attack construction via learned programs — non-deterministic, cloud, or research. They don't serve the high-assurance, air-gapped, repeatable requirement. **The counter-positioning for `cad_reverse/` is: deterministic, auditable, no-LLM, on-premise, exact round-trip verification** — the qualities these AI systems explicitly cannot guarantee.

6. **Interop translation is commoditizing; *re-editable CAD* is where value is migrating.** Market analysts see translation margins eroding as cloud+AI improve raw fidelity; the defensible layer is producing *editable, parametric, design-intent* output rather than a dumb solid. That is precisely the output `cad_reverse/` produces (typed parameter objects + CadQuery emitter, per the project's locked design decisions D5/D7).

7. **CAM-side "feature recognition" is a different market** (machining FR → toolpaths: hyperMILL, Edgecam, Tebis). Strong naming overlap — be precise that `cad_reverse/` targets *design-history reconstruction*, not machining-feature extraction, to avoid confusion in external comms.

8. **Adjacent partners, not competitors:** Datakit/CADfix/TransMagic are the heal/translate *front-end* to such a pipeline (and a model for OEM/SDK licensing); the free modelers (FreeCAD/CadQuery) are the natural *consumers* of a recognized CadQuery script; Analysis Situs is a proven AAG reference to borrow from. A mature product could wrap/quote CADfix for healing and remain pure-Python for recognition+emission.

---

## Sources

- [Best Reverse Engineering CAD Software | 2026 Edition](https://gitnux.org/best/reverse-engineering-cad-software/#review-1)
- [Best 3D Reverse Engineering Software | 2026 Edition](https://gitnux.org/best/3d-reverse-engineering-software/) and [WifiTalents 2026 Buyer's Guide](https://wifitalents.com/best/3d-reverse-engineering-software/)
- [Mesh to CAD AI vs Traditional RE (INSVISION)](https://www.insvision3d.com/en/news/industry-articles/mesh-to-cad-ai-vs-traditional-reverse-engineering-a-practical-guide-for-industrial-teams/)
- [CADENA: Stepwise CAD Reverse Engineering (alphaXiv)](https://www.alphaxiv.org/abs/2608.00799)
- [Geomagic Design X User Guide (U. Pittsburgh)](https://engineering.pitt.edu/contentassets/52314f399aba40fa86709314a569641c/geomagicdesignx2014userguide.pdf)
- [Geomagic Design X on Hexagon MI](https://www.hexagonmi.com.cn/jmrj/39744.html) and [SMARTTECH3D Design X](https://www.smarttech3d.com/software-geomagic-design-x)
- [Geomagic Design X plans (Hexagon)](https://hexagon.com/products/geomagic-design-x/geomagic-design-x-plans) and [Go/Plus/Pro tiers (Hexagon blog)](https://blog.manufacturing.hexagon.com/.../introducing-geomagic-design-x-go-plus-and-pro)
- [Geomagic Design X pricing (Rev1)](https://rev1tech.com/shop/software/reverse-engineering/geomagic-design-x) and [Gomeasure 3D shop](https://shop.gomeasure3d.com/collections/oqton-geomagic-3d-scanning-software/products/geomagic-design-x)
- [Design X FR KPI study (Kyiv Polytechnic journal)](https://journal.mmi.kpi.ua/article/download/333347/329366)
- [SolidWorks FeatureWorks API: RecognizeFeatureAutomatic](https://help.solidworks.com/2026/english/api/fworksapi/SolidWorks.Interop.fworks~SolidWorks.Interop.fworks.IFeatureWorksApp~RecognizeFeatureAutomatic.html), [IFeatureWorksApp Members](https://help.solidworks.com/2025/english/api/fworksapi/SolidWorks.Interop.fworks~SolidWorks.Interop.fworks_namespace.html), [Getting Started FeatureWorks API](https://help.solidworks.com/2024/English/api/fworksapi/GettingStarted-fworksapi.html)
- [Automatic feature recognition in C# (Stack Overflow)](https://stackoverflow.com/questions/76186719/automatic-feature-recognition-in-c-sharp)
- [Feature recognition in CATIA (RAND3D)](https://resources.rand3d.com/insights-from-within/feature-recognition-in-catia) and [3DE R2024 Part Feature Recognition (Kayo)}](https://www.kayo-web.com/courses/3de-r2024-part-feature-recognition/)
- [ANSYS Discovery Scripting (RAND blog): warp mesh→solid](https://resources.randsim.com/rand-simulation-solutions-blog/creating-solids-from-a-deformed-mesh-in-ansys-spaceclaim), [Discover/SpaceClaim scripting (CADFEM)](https://www.cadfem.net/fr/en/training/automation-with-ansys-discovery-scripting-18169.html)
- [Fusion: Find Features / direct mode limits](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Imported-files-do-not-contain-timeline-features-in-Fusion-360.html), [Mesh to solid & face groups blog](https://www.autodesk.com/products/fusion-360/blog/generate-face-groups-fusion/) and [converting mesh→solid](https://www.autodesk.com/products/fusion-360/blog/mesh-into-solid-body-conversion/)
- [Analysis Situs: feature recognition framework](https://analysissitus.org/features/features_feature-recognition-framework.html), [home](https://analysissitus.org/index.html), [2025.2 release](https://www.quaoar.su/blog/page/analysis-situs-20252-is-out), [CadQuery/AnalysisSitus fork](https://github.com/CadQuery/AnalysisSitus)
- [Palmetto: web CAD FR workbench (AAG + pythonOCC)](https://github.com/connorkapoor/Palmetto)
- [cad-feature-detection (UV-Net, pythonOCC)](https://github.com/sguerin13/cad-feature-detection), [CADNet (QUB)](https://gitlab.com/qub_femg/machine-learning/cadnet/-/blob/master/README.md), [Hierarchical-BRep-Graphs (QUB)](https://gitlab.com/qub_femg/machine-learning/hierarchical-brep-graphs/)
- [MFCAD++ dataset (QUB)](https://pure.qub.ac.uk/en/datasets/mfcad-dataset-dataset-for-paper-hierarchical-cadnet-learning-from/) and [MFCAD-VLM (Zenodo)](https://zenodo.org/records/14038050)
- [HybridCAD dataset (Zenodo)](https://zenodo.org/records/14039055)
- [DualBrep (Autodesk AI Lab)](https://github.com/AutodeskAILab/DualBrep) and [B-repLer](https://github.com/yilinliu77/Brepler)
- [CAD data exchange software market (Maia)](https://www.marketresearch.com/Maia-Research-v4212/Global-CAD-Data-Exchange-Software-42426444/), [Verified Market Reports](https://www.verifiedmarketreports.com/product/cad-data-exchange-software-market/), [DataIntelo interop](https://dataintelo.com/report/cad-data-interoperability-market), [DataHorizon](https://www.datahorizzonresearch.com/cad-data-exchange-software-market-40060)
- [CAD Interop "your needs" (cadinterop.com)](https://www.cadinterop.com/en/your-needs.html)
- [Backflip: is the mesh-to-CAD AI real? (Engineering.com)](https://www.engineering.com/backflips-back-is-the-mesh-to-cad-ai-real-this-time/), [Backflip mesh-to-CAD (develop3d)](https://develop3d.com/cad/backflip-introduces-mesh-to-cad/), [Backflip CAD copilot (TCT)](https://www.tctmagazine.com/backflip-ai-launches-ai-copilot-for-cad/), [Backflip + Fusion add-in (IndexBox)](https://www.indexbox.io/blog/backflip-ai-launches-ai-copilot-for-cad-with-autodesk-fusion-add-in/), [Backflip demo (3DPrint.com)](https://3dprint.com/317148/backflip-demo-showcases-scan-to-cads-revolutionary-capabilities/)
- [Polymath (PitchBook)](https://pitchbook.com/profiles/company/769617-10)
- [hyperMILL feature/macro programming (WESTCAM)](https://www.westcam-group.com/en/products/cam/cam-automation/feature-macro-programming/)
