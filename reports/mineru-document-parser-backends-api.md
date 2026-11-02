---
{
  "format": 1,
  "metadata": {
    "id": "mineru-document-parser-backends-api",
    "title": "MinerU3.4.4 backends, API and unresolved behavior",
    "question": "What CLI/backend/API/structured-output capabilities does MinerU provide, and which uncertainties affect their use?",
    "scope": "Historical version-pinned parser capability study; pipeline versus VLM/hybrid; report only, no parsing/PDF/OCR ingestion or network use.",
    "summary": "Contrasts backends and output/API contracts while preserving uncertainty and an unverified source-stated license change.",
    "researched_at": "2026-08-14",
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
      "Imported without fresh source or technical verification; historical findings are not current compliance, safety or legal certification.",
      "Original report bytes/citations are preserved. Third-party quotations, code and sources retain their own rights; unresolved local/transcript references remain unavailable.",
      "Preserve limitations and uncertainty; no technical verification/current-applicability claim.",
      "Portable official/source/docs/PyPI references; performance and legal assertions unverified.",
      "Internal holdings/hardware/workflow and local-use business assumptions.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:33:21.340Z",
    "updated_at": "2026-11-01T23:33:21.340Z",
    "imported_at": "2026-11-01T20:39:01.627Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "7cf2c602bf021ca5e7d43c54a655319708c49dd3ee65f7b5540f0800fa53f3ce",
  "proposalRevision": "f802df23eb8b1e15ff40eb057d791e4971d09346605ff4323e6572c6d612d418"
}
---
# MinerU 3.4.4 — Phase-1 Docs Research Note

Date: 2026-08-14. Scope: full capability surface of `mineru` 3.4.4 (pip package
`mineru`, GitHub `opendatalab/MinerU`). Sources: official GitHub README, official
docs site `https://opendatalab.github.io/MinerU/`, the 3.4.4 released source
(`mineru-3.4.4-released` tag), PyPI. Every claim is linked to its source.
Items I could NOT confirm from an official page are flagged `UNVERIFIED`.

> **Version applicability.** All CLI/source claims below were cross-checked
> against the `mineru-3.4.4-released` git tag, NOT just `master` (master is at
> 3.4.5, released 2026-08-14, the same day as this note). The `mineru` CLI flag
> set and backend names are byte-identical between 3.4.4 and master.
> PyPI: `mineru` 3.4.4 published 2026-07-10; 3.4.5 published 2026-08-14.
> [PyPI](https://pypi.org/project/mineru/)

---

## Capsule summary

MinerU 3.4.4 is a full document-parsing engine (PDF/image/DOCX/PPTX/XLSX → Markdown
+ JSON) exposing a CLI, a FastAPI server (`mineru-api`), a Gradio UI, and HTTP-client
backends — we currently drive only the CLI single-file/single-directory path
(`-b pipeline`). Beyond what we use today it offers: (1) an **async REST API**
(`POST /tasks`, `GET /tasks/{id}/result`) that would let NORMATIVE/ELECTRONICS
scripts submit parse jobs without shelling out to `mineru`; (2) **structured JSON
artifacts** per document (`_content_list_v2.json` — reading-order blocks, page-indexed)
that are cleaner than scraping the `.md`; (3) **hybrid/vlm backends** (95+ OmniDocBench
vs pipeline 86.5) for hard scanned tables, at the cost of needing an OpenAI-compatible
vLLM/LMDeploy server; (4) **newer OCR** (PP-OCRv6, ~11% accuracy gain over v5, ~2×
faster). License is no longer AGPL — see §1 (the HANDOFF's "AGPL" assumption is stale).

---

## 1. Package identity

| Item | Value | Source |
|---|---|---|
| PyPI name | `mineru` (renamed from `magic-pdf` June 2025; `magic-pdf[full]`→`mineru[all]`, `magic-pdf.json`→`mineru.json`) | [NORMATIVE/MINERU_INSTALL.md](../../../NORMATIVE/MINERU_INSTALL.md) |
| Pinned version | 3.4.4 (2026-07-10); current is 3.4.5 (2026-08-14) | [PyPI](https://pypi.org/project/mineru/) |
| Python | `>=3.10,<3.14`; Windows limited to 3.10–3.12 (ray) | [PyPI](https://pypi.org/project/mineru/) |
| Extras | `test, vlm, vllm, lmdeploy, mlx, s3, pipeline, gradio, core, all` | [PyPI provides_extra](https://pypi.org/project/mineru/) |
| Recommended install | `uv pip install -U "mineru[all]"` ("includes all core features, compatible with Windows/Linux/macOS") | [README](https://github.com/opendatalab/MinerU) |
| `core` vs others | `core` = common parsing features, no optional vllm/lmdeploy/s3; `vllm` and `lmdeploy` are near-identical VLM accelerators (install one, not both) | [extension_modules](https://opendatalab.github.io/MinerU/quick_start/extension_modules/) |
| Console scripts | `mineru`, `mineru-api`, `mineru-router`, `mineru-gradio`, `mineru-openai-server`, `mineru-vllm-server`, `mineru-lmdeploy-server`, `mineru-models-download` | [pyproject.toml `[project.scripts]`](https://github.com/opendatalab/MinerU/blob/master/pyproject.toml) |

### License — CORRECTION to HANDOFF (binding decision point)

**MinerU 3.1.0+ (incl. 3.4.4) is NOT AGPL-3.0.** It moved from AGPLv3 to the
**"MinerU Open Source License"** = Apache-2.0 **plus additional conditions**.
SPDX expression: `LicenseRef-MinerU-Open-Source-License`.
[README](https://github.com/opendatalab/MinerU) · [LICENSE.md](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md) · [PyPI](https://pypi.org/project/mineru/)

Additional conditions (only two bite):
1. **Commercial threshold** — free to use commercially UNLESS consolidated
   MAU > 100M **or** monthly revenue > USD 20M (then need a commercial license).
2. **Attribution** — if you provide *online services to third parties* based on
   MinerU, you must prominently attribute MinerU.

**Decision point for us:** internal-use-only extraction (NORMATIVE + ELECTRONICS),
no distribution, no third-party online service, far below the MAU/revenue
thresholds → **the MinerU Open Source License is satisfied with zero obligations.**
The HANDOFF guardrail "AGPL-3.0 — local extraction tool only" can be reworded to
"Apache-2.0-based MinerU Open Source License — local extraction only, no distribution,
below MAU/revenue thresholds, no third-party online service". No action needed beyond
recording this in the README decision log.

---

## 2. CLI — `mineru`

Full `--help` (verified in `mineru/cli/client.py` @ `mineru-3.4.4-released`):

```
Usage: mineru [OPTIONS]

Options:
  -v, --version                 Show version and exit
  -p, --path PATH               Input file path or directory (required)
  -o, --output PATH             Output directory (required)
  --api-url TEXT                MinerU FastAPI base URL; if omitted, mineru starts a temporary local mineru-api
  -m, --method [auto|txt|ocr]   Parsing method (default auto; pipeline and hybrid* backends only)
  -b, --backend [pipeline|vlm-engine|hybrid-engine|vlm-http-client|hybrid-http-client]
                                Parsing backend (default hybrid-engine)
  --effort [medium|high]        Hybrid parsing effort (default medium; hybrid* backends only)
  -l, --lang [ch|ch_server|korean|ta|te|ka|th|el|arabic|east_slavic|cyrillic|devanagari]
                                Document language for OCR accuracy (pipeline backend only; default ch)
  -u, --url TEXT                OpenAI-compatible backend URL when using http-client (e.g. http://127.0.0.1:30000)
  -s, --start INTEGER           Starting page for PDF parsing, 0-based (default 0)
  -e, --end INTEGER             Ending page for PDF parsing, 0-based (default None = last)
  -f, --formula BOOLEAN         Enable formula parsing (default True)
  -t, --table BOOLEAN           Enable table parsing (default True)
  --image-analysis BOOLEAN      Enable image/chart analysis for VLM/hybrid backends (default True; hybrid medium disables it)
  --client-side-output-generation BOOLEAN
                                Generate markdown/content-list locally from server middle-JSON + images (default False)
  --help                        Show help
```

- Inputs: local `PDF` / image / `DOCX` / `PPTX` / `XLSX` file **or directory** (directory = batch).
- `mineru` is "an orchestration client built on top of `mineru-api`" — without `--api-url` it spins up a temporary local `mineru-api`; with `--api-url` it talks to an existing server.
- `--url` is **no longer** the MinerU API address — it is the OpenAI-compatible backend URL for server-side `*-http-client`.
- All vLLM/LMDeploy params pass through as extra CLI args on every command (`ignore_unknown_options`); forms `--foo value` and `--foo=value` both work.
  [cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/) · [client.py](https://github.com/opendatalab/MinerU/blob/mineru-3.4.4-released/mineru/cli/client.py)

### Flags in the task brief that are REMOVED/deprecated in 3.x (were magic-pdf / MinerU-2.x)

| Brief flag | 3.4.4 status | Replacement |
|---|---|---|
| `-d, --device` | **NOT present** in CLI | `MINERU_DEVICE_MODE` env var, or `CUDA_VISIBLE_DEVICES` for GPU selection |
| `-j, --jpg` quality | **NOT present** | images written as `.jpg` (default quality, no flag) |
| `--split-table` | **NOT present** | — |
| `--remove-style` | **NOT present** | — |
| `--formula-enable` | renamed | `-f/--formula` (bool) |
| `--table-enable` | renamed | `-t/--table` (bool) |

Sources: [cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/) (docs explicitly note these are "not present in this documented version"),
[advanced_cli_parameters](https://opendatalab.github.io/MinerU/usage/advanced_cli_parameters/) (device via env only),
[client.py](https://github.com/opendatalab/MinerU/blob/mineru-3.4.4-released/mineru/cli/client.py).

### Other CLI tools (entry points)

```
mineru-api --host 127.0.0.1 --port 8000          # FastAPI service
mineru-gradio --server-name 0.0.0.0 --server-port 7860
mineru-router --host 0.0.0.0 --port 8002 --local-gpus auto   # multi-service / multi-GPU router
mineru-openai-server --port 30000                # OpenAI-compatible VLM server
mineru-vllm-server / mineru-lmdeploy-server      # vllm/lmdeploy-backed OpenAI-compatible VLM servers
```
Source: [quick_usage](https://opendatalab.github.io/MinerU/usage/quick_usage/) · [cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/) · [pyproject.toml](https://github.com/opendatalab/MinerU/blob/master/pyproject.toml)

---

## 3. Python API

**Important version note.** The task brief assumes a `MinerU` class / `mineru_pipeline`
function and `PipelineGeneralModel`/`VlmModel` backend classes. **None of these exist in
the 3.4.4 source.** Verified by repo-wide code search (`class MinerU`, `mineru_pipeline`,
`GeneralModel`, `MinerUResult` all return no such symbols). Those were the MinerU-2.x
programmatic API, removed in the 3.x rewrite to the orchestrator-client + server model.

What the 3.x package exposes programmatically:
- Backend model classes live in `mineru/backend/pipeline/model_init.py` /
  `mineru/backend/hybrid/…`: **`MineruPipelineModel`**, **`MineruHybridModel`**
  (and `AtomModelSingleton` for atomic models). The post-processing classes are
  `MagicModel` in `pipeline_magic_model.py` / `vlm_magic_model.py`.
  Source: [model_init.py](https://github.com/opendatalab/MinerU/blob/mineru-3.4.4-released/mineru/backend/pipeline/model_init.py) ·
  [pipeline_magic_model.py](https://github.com/opendatalab/MinerU/blob/master/mineru/backend/pipeline/pipeline_magic_model.py)
- The officially documented programmatic surface is the **CLI + REST API + Gradio**,
  not an in-process `MinerU(...)` object. README lists "Python / Go / TypeScript SDK ·
  CLI · REST API · Docker" but the Python SDK = the `mineru` console entry points.

`UNVERIFIED`: no official "minimal working Python snippet" for an in-process parse
call in the 3.x docs. The only Python examples in official docs are CLI invocation and
the http-client curl examples (§7). If an in-process API is required, candidates are
`MineruPipelineModel`/`MineruHybridModel` but they are internal (no docstrings in docs,
subject to change) — treat as UNVERIFIED until Phase-2 proves one.

---

## 4. Backends

Backend names (exact, 3.4.4): `pipeline`, `vlm-engine`, `hybrid-engine`,
`vlm-http-client`, `hybrid-http-client`. Default = **`hybrid-engine`**.
Legacy aliases normalized: `vlm-auto-engine`→`vlm-engine`, `hybrid-auto-engine`→`hybrid-engine`.
Source: [backend_options.py](https://github.com/opendatalab/MinerU/blob/mineru-3.4.4-released/mineru/cli/backend_options.py) ·
[cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/)

| Backend | What it is | When to use | Accuracy (OmniDocBench v1.6) | Resource notes |
|---|---|---|---|---|
| `pipeline` | Layout detection (PP-DocLayoutV2) + formula (unimernet_small) + table (SlanetPlus/Unet) + OCR (PP-OCRv6). Pure local. | Fast, low-VRAM, the standard general path; CPU-only OK | 86.47 | **4 GB VRAM min**, pure CPU OK |
| `vlm-engine` | VLM (MinerU2.5-Pro) end-to-end parse, local via auto-started vLLM/LMDeploy server | Highest single-engine accuracy, hard scanned/layouts | 95.30 | needs OpenAI-compatible server; vLLM/LMDeploy 8 GB+ VRAM (Volta+) |
| `hybrid-engine` | pipeline text extraction + VLM for hard blocks; `--effort medium` (default) or `high` | Default; best accuracy/speed tradeoff | medium 95.26 / high 95.39 | medium is 35–220% faster, disables image/chart analysis |
| `vlm-http-client` | lightweight remote client to an OpenAI-compatible server; **no local torch** | CPU box talking to a remote VLM server | 95.30 | needs `-u http://…:30000` |
| `hybrid-http-client` | hybrid but with local pipeline deps (`mineru[pipeline]` + torch) + remote VLM | remote VLM + local small models | — | needs `-u` |

Sources: [README](https://github.com/opendatalab/MinerU) (accuracy table, "pipeline (4GB VRAM min, pure CPU OK)", "vlm engines require OpenAI-compatible servers"),
[cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/) (effort),
[quick_usage](https://opendatalab.github.io/MinerU/usage/quick_usage/) (http-client, "does not require local torch"),
[extension_modules](https://opendatalab.github.io/MinerU/quick_start/extension_modules/) ("Volta architecture and later (8GB+ VRAM)" for vllm/lmdeploy).

Model names (from `mineru/utils/enum_class.py`):
- Pipeline root: `opendatalab/PDF-Extract-Kit-1.0` (HF) / `OpenDataLab/PDF-Extract-Kit-1.0` (ModelScope), with submodels `models/Layout/PP-DocLayoutV2`, `models/MFR/unimernet_hf_small_2503`, `models/OCR/paddleocr_torch` (PP-OCRv6), `models/TabRec/SlanetPlus/slanet-plus.onnx`, `models/TabRec/UnetStructure/unet.onnx`, `models/TabCls/paddle_table_cls/PP-LCNet_x1_0_table_cls.onnx`, `models/MFR/pp_formulanet_plus_m`.
- VLM root: `opendatalab/MinerU2.5-Pro-2605-1.2B` (HF) / `OpenDataLab/MinerU2.5-Pro-2605-1.2B` (ModelScope). **1.2B params → low VRAM for a VLM.**
  Source: [enum_class.py](https://github.com/opendatalab/MinerU/blob/master/mineru/utils/enum_class.py)

---

## 5. OCR modes

- `-m/--method` ∈ `auto|txt|ocr`, default `auto`, **pipeline and hybrid-\* backends only** (vlm-engine ignores it).
  - `txt`: text-layer extraction (no OCR) — for born-digital PDFs.
  - `ocr`: forced OCR — for scanned/image PDFs.
  - `auto`: decides by file type.
  Source: [client.py](https://github.com/opendatalab/MinerU/blob/mineru-3.4.4-released/mineru/cli/client.py)
- `-l/--lang` for OCR language (pipeline backend only). Public codes (12): `ch, ch_server, korean, ta, te, ka, th, el, arabic, east_slavic, cyrillic, devanagari`. `ch` covers "Chinese, English, Japanese, Chinese Traditional, Latin". Many aliases map onto these (e.g. `en`,`japan`,`latin`→`ch`; `ru`,`be`,`uk`→`east_slavic`; `ar`,`fa`,`ug`,`ur`,`ps`,`ku`,`sd`,`bal`→`arabic`). README "109 OCR languages" comes from this alias expansion.
  Source: [ocr_language.py](https://github.com/opendatalab/MinerU/blob/master/mineru/utils/ocr_language.py)
- `ocr_engine` **is NOT a user flag in 3.x** (the brief's "paddle/unimernet/pytorch" choice is gone). OCR is baked into the pipeline backend and runs **PP-OCRv6** via the `pytorch_paddle` model (`models/OCR/paddleocr_torch`). 3.4 upgraded v5→v6: "~11% accuracy gain on OmniDocBench v1.6", "~100% OCR speedup".
  Sources: [PyPI/README changelog](https://github.com/opendatalab/MinerU) · [enum_class.py](https://github.com/opendatalab/MinerU/blob/master/mineru/utils/enum_class.py) · [pytorch_paddle.py](https://github.com/opendatalab/MinerU/blob/master/mineru/model/ocr/pytorch_paddle.py)
- When text-layer vs OCR: text PDFs → `txt`/`auto` (direct extraction, no hallucination); scanned/garbled → `ocr`. The hybrid backend already "does direct text extraction for text PDFs and OCR in 109 languages for scanned PDFs".
  Source: [changelog 2.7.0](https://github.com/opendatalab/MinerU/blob/master/docs/en/reference/changelog.md)

---

## 6. Output formats

Output root = `-o <output_dir>`. Per-input subdirectory and parse-subdir depend on backend/method
(source: [output_paths.py](https://github.com/opendatalab/MinerU/blob/master/mineru/cli/output_paths.py)):

| Backend / method | Subdir |
|---|---|
| pipeline + `-m auto` | `<out>/<pdf_name>/auto/`  ← **what we use today** |
| pipeline + `-m txt` / `-m ocr` | `<out>/<pdf_name>/txt/` / `ocr/` |
| vlm-* | `<out>/<pdf_name>/vlm/` |
| hybrid-* + `auto` | `<out>/<pdf_name>/hybrid_auto/` |
| DOCX/PPTX/XLSX (office) | `<out>/<pdf_name>/office/` |

Inside that subdir (source: [output_files](https://opendatalab.github.io/MinerU/reference/output_files/)):

| Artifact | Purpose |
|---|---|
| `<name>.md` | Main markdown. Multimodal (images first) or NLP (text-only). HTML `<table>`s preserve `colspan`/`rowspan`. |
| `<name>_content_list.json` | Flat reading-order list of blocks: `type` ∈ image/table/chart/text/equation/code/list + aux (header/footer/page_number/aside_text/page_footnote); `text_level` 0=body,1/2/…=heading; `bbox` normalized **0–1000**; `page_idx` 0-based. |
| `<name>_content_list_v2.json` | **New in 3.0, all backends.** Top level grouped by page; unified `type + content` structure. Superset incl. `hyperlink` spans (`content`+`url`), `anchor` for DOCX titles. Subject to change (dev). |
| `<name>_middle.json` | Intermediate parse state: `pdf_info` per page (`preproc_blocks`, `page_idx`, `page_size`, `images`, `tables`, `interline_equations`, `discarded_blocks`, `para_blocks`), `_backend`, `_version_name`. Block hierarchy L1(table/image/chart)→L2(image_body/caption/…, text, title, index, list, interline_equation)→lines→spans (`bbox`, `type`, `content` or `image_path`). |
| `<name>_model.json` | Raw model inference. **Pipeline**: flat array `{cls_id,label,score,bbox,index}`. **VLM**: two-level nested list (pages→blocks) with `type,bbox,angle,content`; bbox normalized **0–1**. Not backward-compatible between backends (changed in 2.5). |
| `images/` | Extracted figures/page-images as `.jpg`. |
| `<name>_layout.pdf` | Per-page layout boxes with reading-order numbers + color-coded block types (debug/verify). |
| `<name>_span.pdf` | **Pipeline only.** Span-level annotation (text/inline-formula segmentation). |

Choosing a file: `model.json`=raw, `layout/span.pdf`=debug, `.md`/`content_list*.json`=content,
`middle.json`=secondary development. [output_files](https://opendatalab.github.io/MinerU/reference/output_files/)

Markdown quality note (confirmed by our own install runbook): HTML `<table>` with
`colspan`/`rowspan` preserved — the key advantage over pymupdf/Docling for standard
annexes. [NORMATIVE/MINERU_INSTALL.md](../../../NORMATIVE/MINERU_INSTALL.md)

---

## 7. API server mode (`mineru-api`)

Launch: `mineru-api --host 127.0.0.1 --port 8000` (defaults 127.0.0.1:8000; `--reload` dev;
`--enable-vlm-preload BOOLEAN` to preload local VLM at startup).
[cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/)

Endpoints (source: [fast_api.py](https://github.com/opendatalab/MinerU/blob/master/mineru/cli/fast_api.py),
request fields from [api_request.py](https://github.com/opendatalab/MinerU/blob/mineru-3.4.4-released/mineru/cli/api_request.py)):

- `POST /file_parse` — **synchronous** parse (legacy plugin-compatible). Returns final result.
- `POST /tasks` — **async** submit; returns **202 + task_id**.
- `GET /tasks/{task_id}` — status payload (`task_id,status,backend,file_names,created_at,started_at,completed_at,error,status_url,result_url,queued_ahead`). Statuses: `pending|processing|completed|failed`.
- `GET /tasks/{task_id}/result` — 202 if not ready, 409 on failure, else JSON or ZIP (`FileResponse`).
- `GET /health` — health + task stats.
- Swagger docs at `/docs`, `/openapi.json`, `/redoc` (enabled by default).

**Request format** — multipart/form-data (`files` + form fields). The `/file_parse`
official usage doc confirms these fields (multipart, lowercase extensions required):

| Field | Type | Default | Notes |
|---|---|---|---|
| `files` | files | required | PDF, jpg, png (no Office files via `/file_parse`); lowercase ext |
| `output_dir` | str | `./output` | |
| `lang_list` | list[str] | `["ch"]` | must match file count |
| `backend` | str | `pipeline` | |
| `parse_method` | str | `auto` | |
| `formula_enable` / `table_enable` | bool | True | |
| `server_url` | str | None | remote OpenAI-compatible service |
| `return_md` | bool | True | |
| `return_middle_json` / `return_model_output` / `return_content_list` / `return_images` | bool | False | |
| `response_format_zip` | bool | False | ZIP result |
| `start_page_id` / `end_page_id` | int | 0 / 99999 | |
| (fast_api) `return_original_file`, `client_side_output_generation`, `effort`, `image_analysis` | | | in 3.4.x fast_api form |

Curl:
```bash
curl -X POST http://localhost:8000/file_parse \
  -F "files=@/path/to/test.pdf" -F "backend=pipeline"
```
Async via `/tasks`, poll `/tasks/{id}`, then fetch `/tasks/{id}/result`.
Sources: [Discussion #3562 (official api doc)](https://github.com/opendatalab/MinerU/discussions/3562) ·
[fast_api.py](https://github.com/opendatalab/MinerU/blob/master/mineru/cli/fast_api.py)

**Batch handling:** `AsyncTaskManager` uses an asyncio queue + worker dispatcher; a
module-level semaphore limits concurrent parses to `MINERU_API_MAX_CONCURRENT_REQUESTS`
(default 3; forced to 1 on macOS). Task retention 24h (`MINERU_API_TASK_RETENTION_SECONDS`).
Result JSON = `{"backend", "version", "results": {filename: {md_content, middle_json, model_output, content_list, images(base64)}}}`.
Response headers carry `X-MinerU-Task-*` (id/status/status-url/result-url).

`mineru-router` is a unified entry point that routes tasks across multiple
`mineru-api`/GPU services (load-balanced, fully compatible with `mineru-api`).
Source: [README](https://github.com/opendatalab/MinerU) · [cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/)

---

## 8. Model download (`mineru-models-download`)

```bash
mineru-models-download -s huggingface -m pipeline     # non-interactive
mineru-models-download                                 # interactive prompts
```
Flags (Click, from [models_download.py](https://github.com/opendatalab/MinerU/blob/master/mineru/cli/models_download.py)):
- `-s, --source` ∈ `auto|huggingface|modelscope` (default prompt: auto).
- `-m, --model_type` ∈ `pipeline|vlm|all` (default prompt: all).
- After download, model path is printed and **auto-written to `mineru.json`** (`models-dir` + `model-source` keys).

**Model cache location** (defaults from `snapshot_download`, no hardcode in repo):
- HF: `~/.cache/huggingface/hub/models--opendatalab--PDF-Extract-Kit-1.0/` (+ VLM `models--opendatalab--MinerU2.5-Pro-2605-1.2B`)
- ModelScope: `~/.cache/modelscope/hub/…`
Confirmed locally: pipeline models ~2.5 GB. [NORMATIVE/MINERU_INSTALL.md](../../../NORMATIVE/MINERU_INSTALL.md)

**Source selection** — `MINERU_MODEL_SOURCE` env var ∈ `huggingface|modelscope|local`
(**no CLI flag**; it was removed). Precedence: explicit arg → env var → `mineru.json`
`model-source` → `auto`. `auto` probes `https://huggingface.co/models` (3 s timeout, 2
attempts) once, persists the result back into `mineru.json`. **Do not set the env var
to `auto`** (raises). `local` returns the configured `models-dir` path.
Source: [model_source](https://opendatalab.github.io/MinerU/usage/model_source/) ·
[models_download_utils.py](https://github.com/opendatalab/MinerU/blob/master/mineru/utils/models_download_utils.py)

---

## 9. Batch / parallel guidance

- **Directory input = batch:** `mineru -p <dir> -o <out>` discovers all supported
  files. For the **pipeline** backend the client packs documents into
  **"PlannedTask" bins** capped at `MINERU_PROCESSING_WINDOW_SIZE` pages (default 64):
  docs ≤ window are best-fit-binned together; docs > window each get their own task.
  For vlm/hybrid backends, each document is its own task.
  Source: [client.py `plan_pipeline_tasks`](https://github.com/opendatalab/MinerU/blob/master/mineru/cli/client.py)
- **Concurrency** = `max(1, min(max_concurrent_requests, task_count))` workers; max from
  `MINERU_API_MAX_CONCURRENT_REQUESTS` (default 3; server side caps at its own value).
  Source: [client.py](https://github.com/opendatalab/MinerU/blob/master/mineru/cli/client.py)
- **GPU saturation / single-GPU rule (binding to us):** our measured reality on RTX 3090 —
  a single MinerU instance already runs at 99% GPU util (~0.6 s/page); **parallel jobs on
  one GPU are counterproductive**. With 24 GB VRAM MinerU uses `Batch Ratio: 8` for
  multi-page batching. For low-VRAM GPUs the hybrid batch ratio table:
  ≤6 GB→8, ≤4 GB→4, ≤3 GB→2, ≤2 GB→1 (`MINERU_HYBRID_BATCH_RATIO`).
  Source: [cli_tools env table](https://opendatalab.github.io/MinerU/usage/cli_tools/) ·
  [NORMATIVE/MINERU_INSTALL.md](../../../NORMATIVE/MINERU_INSTALL.md)
- `MINERU_PDF_RENDER_THREADS` (default 4) and `MINERU_PDF_RENDER_TIMEOUT` (300 s) tune
  PDF rendering; `MINERU_PROCESSING_WINDOW_SIZE` (64) tunes memory/throughput.
- Multi-GPU: use `CUDA_VISIBLE_DEVICES` to pin each service (e.g. two `mineru-openai-server`
  on GPUs 0,1, ports 30000/30001) and `mineru-router --local-gpus 0,1,2,3` for 4 GPUs.
  Source: [advanced_cli_parameters](https://opendatalab.github.io/MinerU/usage/advanced_cli_parameters/)

---

## 10. Environment variables + config

Full official table (from [cli_tools](https://opendatalab.github.io/MinerU/usage/cli_tools/)):

| Env var | Purpose | Default |
|---|---|---|
| `MINERU_TOOLS_CONFIG_JSON` | Config file path (abs or relative to home) | `mineru.json` in home |
| `MINERU_FORMULA_ENABLE` | Enable formula parsing | `true` |
| `MINERU_FORMULA_CH_SUPPORT` | Chinese formula optimization (pipeline, experimental) | `false` |
| `MINERU_TABLE_ENABLE` | Enable table parsing | `true` |
| `MINERU_TABLE_MERGE_ENABLE` | Enable table merging | `true` |
| `MINERU_PDF_RENDER_TIMEOUT` | PDF render timeout (s) | `300` |
| `MINERU_PDF_RENDER_THREADS` | Render worker concurrency | `4` |
| `MINERU_PROCESSING_WINDOW_SIZE` | Processing window size (memory/throughput) | `64` |
| `MINERU_API_MAX_CONCURRENT_REQUESTS` | Max concurrent API/router tasks | `3` |
| `MINERU_API_ENABLE_FASTAPI_DOCS` | `/docs`, `/openapi.json`, `/redoc` | `true` |
| `MINERU_API_OUTPUT_ROOT` | `mineru-api` output root | `./output` |
| `MINERU_LOCAL_API_STARTUP_TIMEOUT_SECONDS` | Wait for local API health | `300` |
| `MINERU_TASK_RESULT_TIMEOUT_SECONDS` | Wait for task completion | `3600` |
| `MINERU_TASK_RESULT_DOWNLOAD_TIMEOUT_SECONDS` | Result download read timeout | `600` |
| `MINERU_API_TASK_RETENTION_SECONDS` | Completed/failed task retention | `86400` |
| `MINERU_API_TASK_CLEANUP_INTERVAL_SECONDS` | Cleanup polling | `300` |
| `MINERU_INTRA_OP_NUM_THREADS` / `MINERU_INTER_OP_NUM_THREADS` | ONNX thread counts | `-1` (auto) |
| `MINERU_HYBRID_BATCH_RATIO` | Small-model batch ratio (hybrid) | per-VRAM table (§9) |
| `MINERU_VL_MODEL_NAME` | Model name for vlm/hybrid backend | — |
| `MINERU_VL_API_KEY` | API key for remote openai-server auth | — |
| `MINERU_MODEL_SOURCE` | Model source `huggingface\|modelscope\|local` | (unset → auto) |
| `MINERU_DEVICE_MODE` | Force device (`cuda`,`cpu`, etc.) | auto-detect |

Also verified in source: `MINERU_OCR_DET_MASK_INLINE_FORMULA_ENABLE`.
Precedence: **env var > CLI parameter** (official statement in cli_tools), and for model
source: arg > env > config > auto. Device detection order (`get_device` in
[config_reader.py](https://github.com/opendatalab/MinerU/blob/master/mineru/utils/config_reader.py)):
`MINERU_DEVICE_MODE` → cuda → mps → npu → gcu → musa → mlu → sdaa → cpu.

**Config file** — default `~/mineru.json` (old `~/.magic-pdf.json`). Template
`mineru.template.json` fields: `bucket_info` (S3), `latex-delimiter-config`
(display/inline delimiters), `llm-aided-config` (title-aided LLM: api_key/base_url/model),
`models-dir` (`{pipeline, vlm}`), `model-source`, `config_version` (1.3.2).
Source: [mineru.template.json](https://github.com/opendatalab/MinerU/blob/master/mineru.template.json) ·
[config_reader.py](https://github.com/opendatalab/MinerU/blob/master/mineru/utils/config_reader.py) ·
[models_download_utils.py](https://github.com/opendatalab/MinerU/blob/master/mineru/utils/models_download_utils.py)

---

## UNVERIFIED / UNSURE

1. **In-process Python API** — no official 3.x "MinerU() object" or `mineru_pipeline`
   snippet exists in docs; `MineruPipelineModel`/`MineruHybridModel` are internal and
   undocumented. Marked UNVERIFIED pending a Phase-2 proof.
2. **`_span.pdf` for vlm/hybrid backends** — official docs say "pipeline backend only";
   README output list shows it for pipeline. Whether hybrid emits it is not documented.
3. **`_content_list_v2.json` stability** — official docs mark it "Development (subject
   to change)". Field names may drift in 3.4.x/4.0.
4. **Exact `/tasks` request JSON body** — official Discussion #3562 documents only
   `/file_parse` (multipart). The `/tasks` multipart form is inferred from
   `fast_api.py`/`api_request.py` source, not an official usage doc.
5. **`MINERU_VL_MODEL_NAME` / `MINERU_VL_API_KEY`** — present in the official env table
   but not in `config_reader.py` (likely read by the vlm server module); exact behavior
   UNVERIFIED.
6. **3.4.4-specific changelog** — `docs/en/reference/changelog.md` in the repo only
   covers ≤ 2.7; 3.x release notes come from the README/PyPI, which do not itemize
   3.4.1–3.4.4 patch fixes. Nothing in 3.4.4's CLI/backend differed from 3.4.5 at the
   flag level (verified by diff), but patch-level bugfix contents are not enumerated.
7. **`mineru-api` port** — the official curl example uses `:8900` (older doc) while the
   default flag is `8000`; use `--port` explicitly.
8. **macOS** — concurrency forced to 1 and CUDA absent; we're Linux/RTX, so not tested.
9. **`--image-analysis` on `pipeline`** — flag is documented for VLM/hybrid; whether it
   affects pipeline backend is not stated.
10. **HTML `.html` output** — the brief asked about `.html`; MinerU produces HTML
    *tables* inside `.md`, not a standalone `.html` file. No `.html` output format
    documented (Gradio serves HTML UI, not parse output).
