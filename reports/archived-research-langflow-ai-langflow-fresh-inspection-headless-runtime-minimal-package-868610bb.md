---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-langflow-ai-langflow-fresh-inspection-headless-runtime-minimal-package-868610bb",
    "title": "Research: langflow-ai/langflow (fresh inspection — headless runtime / minimal package)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: langflow-ai/langflow (fresh inspection — headless runtime / minimal package)?",
    "scope": "Original Pi/tooling integration investigation: Research: langflow-ai/langflow (fresh inspection — headless runtime / minimal package). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: langflow-ai/langflow (fresh inspection — headless runtime / minimal package); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi research bundle",
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
    "imported_at": "2026-11-04T21:30:34.848Z"
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
  "sourceDigest": "868610bbee8667893e1503f756a063f1e9ee26b834a12667ffcbd1f46b90c0cc",
  "proposalRevision": "e3179a0df8405becd51bd86456c73c9257f83e6950c6319e4636fecb5bad2141"
}
---
# Research: langflow-ai/langflow (fresh inspection — headless runtime / minimal package)

## Summary
The repository's large visual builder is not the smallest artifact: `lfx` ("Langflow Executor") is a separate MIT distribution that runs flow JSON statelessly with a no-op session store — no UI, no `langflow.db`, no server for `lfx run`. It is the only plausible Pi child-worker boundary here, but it drags in the full langchain/FastAPI stack and has no native scheduling or cancellation. **CONDITIONAL**.

## Findings
1. **Identity (fact):** `langflow-ai/langflow`, MIT (GitHub API `license.key=mit`), `archived:false`, pushed 2026-09-26, default branch `main`; root `pyproject.toml` = package `langflow` 1.12.3, `license="MIT"`, `requires-python >=3.10,<3.15`. Corrections: PyPI metadata for the `lfx` wheel itself reports `"license": null, "license_files": null` (MIT is only repo-level; https://pypi.org/pypi/lfx/json). First-party docs also conflict on packaging — https://docs.langflow.org/install-custom-dependencies states "There is no `langflow-core` package", while https://pypi.org/project/langflow-core/ hosts 1.12.0.dev10 and release notes describe the chain `langflow → langflow-core → langflow-base → lfx`. Distribution layering is unstable; treat as unknown which minimal profile persists.
2. **Smallest component (fact):** package `lfx` at `src/lfx/pyproject.toml`; console scripts `lfx = lfx.__main__:main` and `lfx-mcp = lfx.mcp.__main__:main`. README: "serves and runs flows statelessly from flow JSON files with minimal dependencies", no-op `NoopSession`, "There is no `langflow.db` database file when using LFX" — saving flows/messages/users does not persist. No dashboard/DB required for `lfx run`; `lfx serve` needs only a locally generated `LANGFLOW_API_KEY` token and optional `--flow-dir`. Mandatory deps are not small: `langchain-core>=1.2.28`, `langchain~=1.3.0`, `langchain-classic`, `pandas`, `fastapi`, `uvicorn[standard]`, `gunicorn`+`a2wsgi` (non-Windows), `mcp>=1.17`, `cryptography`, `markitdown`, `ag-ui-protocol`, `pydantic`. "Engine-only by default: `pip install lfx` ships NO bundles" — provider components need `lfx-openai` etc. ([README](https://raw.githubusercontent.com/langflow-ai/langflow/main/src/lfx/README.md), [pyproject](https://raw.githubusercontent.com/langflow-ai/langflow/main/src/lfx/pyproject.toml))
3. **Proposed Pi adapter (inference; nothing built-in):** subprocess `uvx --from lfx lfx run <flow.json> --input-value "<task>" --format json` — documented, no Langflow API key required, stdout schema `{result, success, logs, type, component}`. `lfx serve` gives `POST /flows/{id}/run|stream` (SSE) but is a long-lived authenticated process. Pi can be parent/MCP-client only; Langflow cannot host Pi as a child retaining Pi's auth/tools/skills — no such integration exists in source (unknown whether a code component could shell out usefully).
4. **Scheduling/limits (fact):** LFX is an executor, not a scheduler; `lfx run` is single-shot, blocking, with **no timeout/cancel flag** (kill the process; HITL checkpoints are memory-only, no resume). `lfx serve` adds `--workers N`, `--flow-dir`, `--timeout` (gunicorn worker kill, default 120s, Unix, workers>1 only), `--max-requests`, `--reset-environ`/`--use-sync-workers` isolation. Server-side cancel exists only in Langflow's v2 workflow API (background mode → `POST /api/v2/workflows/stop` with `job_id`) — that requires the full server. No measured token/context-savings evidence: do not claim any.
5. **Auth separation (fact):** Langflow-instance auth (`x-api-key`, `login` tool, username/password) is independent of model-provider auth (component fields / global variables). OpenAI components are API-key based; Codex/ChatGPT subscription OAuth is not a reusable connector for third-party apps ([help.openai.com/articles/11381614](https://help.openai.com/en/articles/11381614-api-codex-cli-and-sign-in-with-chatgpt)) → the existing Codex subscription cannot drive a Langflow flow's model. Existing DeepSeek/ZAI keys are plausible via the OpenAI Compatible provider (custom base URL, e.g. `https://api.deepseek.com`; `lfx-openai-compatible` is a declared root dependency) ([docs](https://docs.langflow.org/bundles-openai-compatible)).
6. **MCP:** `lfx-mcp` is FastMCP-based, stdio-only, and wraps the Langflow REST API — it *requires a running Langflow instance + API key*, so it is not the minimal path (usable as Pi-as-MCP-client, but needs the server). Jev stays parent-side; no Langflow MCP coupling needed.
7. **Telemetry/privacy from source (fact):** `src/backend/base/langflow/__main__.py` prints "We collect anonymous usage data… To opt out, set DO_NOT_TRACK=true", gated on `os.getenv("DO_NOT_TRACK", os.getenv("LANGFLOW_DO_NOT_TRACK","False"))` → collection on by default for the Langflow server. No product-telemetry code found in `lfx` (unknown, not verified absent); OTLP is opt-in via `lfx[otel]` + `OTEL_EXPORTER_OTLP_ENDPOINT`.
8. **Pros:** genuine headless, DB-free, no-UI execution with a documented JSON result schema; MIT, active, `uvx` without install. **Cons:** heavy langchain/FastAPI dependency tree for one bounded run (environment/context repetition); no native scheduling/cancellation, and the real control plane (MCP, `/stop`) needs the full Langflow server. **Conclusion: CONDITIONAL** — viable only as a `uvx lfx run` bounded subprocess worker. Biggest unresolved fact: whether an existing DeepSeek/ZAI key can drive an `lfx run` flow using only core components without installing provider bundles.

## Sources
- Kept: `src/lfx/README.md`, `src/lfx/pyproject.toml`, `src/lfx/LFX_MCP.md`, root `pyproject.toml`, `src/backend/base/langflow/__main__.py`, GitHub API repo metadata, PyPI `lfx` JSON, docs.langflow.org/lfx-mcp, docs.langflow.org/api-keys-and-authentication, docs.langflow.org/workflow-api.
- Dropped: PyPI `langflow-core` release-page marketing copy, doccompiler.ai admin-guide PDF (third-party restatement), star/commit-count aggregators.

## Gaps
No source-side confirmation of which Langflow version the user would run, or whether any flow-Pi bridge is even desired; no measurement of LFX startup/run cost. Next steps if pursued: the parent verifies (not me) whether `lfx run` with a DeepSeek OpenAI-compatible credential plus core-only components works, and whether `uvx` cold-start latency is acceptable per child.

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "report.md sections 1-8 map each required question to precise primary URLs: src/lfx/pyproject.toml (scripts/deps), src/lfx/README.md (headless, NoopSession, no langflow.db, run/serve flags, result schema), src/backend/base/langflow/__main__.py (telemetry default), pypi.org/pypi/lfx/json (license:null). Severity-relevant corrections flagged: lfx wheel license metadata null; first-party docs conflict on langflow-core."
    }
  ],
  "changedFiles": [
    "/home/eldar/.local/share/pi-research/delegation-candidates-20260926T115602Z-0p7vbxix/langflow/report.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [],
  "validationOutput": [
    "Source-checked table-adjacent claims: license (GitHub API mit + root pyproject MIT), telemetry default False from __main__.py source, no timeout flag in lfx run option table, lfx-mcp requires running Langflow instance + LANGFLOW_API_KEY."
  ],
  "residualRisks": [
    "lfx provider/Tool bundle behavior with an existing DeepSeek/ZAI OpenAI-compatible key unverified (needs a run, which is out of scope).",
    "Distribution layering (langflow vs langflow-core vs langflow-base vs lfx) is documented inconsistently by first-party sources; the smallest stable install path may change.",
    "Heavy transitive dependency footprint not measured; uvx cold-start cost per child unknown."
  ],
  "noStagedFiles": true,
  "diffSummary": "Added report.md only (new file in assigned cwd); no repository or environment changes.",
  "reviewFindings": [
    "no blockers: report is evidence-bounded, labels fact/inference/unknown, and does not select or install any candidate"
  ],
  "manualNotes": "Read-only; no clones, installs, executions, credential reads or Jev calls performed. Verdict CONDITIONAL with one biggest unresolved fact stated."
}
```
