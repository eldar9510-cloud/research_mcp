---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-google-adk-python-agent-development-kit-python-as-a-pi-subagents-replac-127ae5e6",
    "title": "Research: google/adk-python (Agent Development Kit, Python) as a pi-subagents replacement",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: google/adk-python (Agent Development Kit, Python) as a pi-subagents replacement?",
    "scope": "Original Pi/tooling integration investigation: Research: google/adk-python (Agent Development Kit, Python) as a pi-subagents replacement. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: google/adk-python (Agent Development Kit, Python) as a pi-subagents replacement; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:36.648Z"
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
  "sourceDigest": "127ae5e650881da9b31e0d2c5989eb53eab2bd7d357b21dbfdf7d6b9ed8517e5",
  "proposalRevision": "9b739b5c9fe2e389a62d12c6205d39fe814e88fd004afb82d3d90e44bf484a5e"
}
---
# Research: google/adk-python (Agent Development Kit, Python) as a pi-subagents replacement

Observed 2026-09-26 from `main` raw files and the public GitHub API (no clone, no execution).

## 1. Identity / license / activity
- `google/adk-python`, Apache-2.0, public, Python ≥3.10, default branch `main`; API `pushed_at` 2026-09-26T04:57Z, `updated_at` 2026-09-26T09:29Z (so activity is current). Docs home is `google.github.io/adk-docs`. [repo API](https://api.github.com/repos/google/adk-python), [README](https://raw.githubusercontent.com/google/adk-python/main/README.md)
- Marketing self-description: "code-first Python **framework** for building, evaluating, and deploying … AI agents", with a new ADK 2.0 **Workflow** graph runtime. [README](https://raw.githubusercontent.com/google/adk-python/main/README.md)
- Corrections to user-table claims (table text not supplied here): two likely-relevant corrections. (a) This is a **Python framework, not a Pi extension/SDK**; there is no TypeScript port in this repo (ADK JS/Java/Go are separate repos linked in the README). (b) `SequentialAgent`, `ParallelAgent`, `LoopAgent` are now **deprecated in favour of `Workflow`**, and the deprecation text itself notes "Workflow cannot yet be used as an LlmAgent sub-agent." [sequential_agent.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/sequential_agent.py), [loop_agent.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/loop_agent.py), [parallel_agent.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/parallel_agent.py)

## 2. True primitive and minimal Pi integration path
- Primitive = **Python library + CLI/HTTP server** (`fastapi`, `uvicorn`, `starlette` in core deps; `adk run`, `adk web`, `adk deploy`, `a2a-sdk` extra). [pyproject.toml](https://raw.githubusercontent.com/google/adk-python/main/pyproject.toml), [README](https://raw.githubusercontent.com/google/adk-python/main/README.md)
- **External worker** (Python subprocess / HTTP service invoked from Pi) is the only realistic shape; a **native Pi extension is not available** and an **SDK-embedded** path does not exist for a TS host. A Pi↔ADK adapter would be **hypothetical/custom** — nothing in the repo provides a Pi or MCP-server *binding* for it. A2A support (`a2a-sdk`) is a protocol surface only; it proves neither Pi nor Jev integration.

## 3. Deterministic scheduling vs LLM coordination (lane question)
- **Deterministic:** ADK 2.0 `Workflow` compiles `edges` into a graph; `_run_loop` schedules ready nodes via `NodeRunner`, and the source explicitly preserves "deterministic scheduling order for parallel branches" (dict insertion order + replay-sequence sort), with `max_concurrency`, retry config, join nodes, checkpoint/resume from session events, and `FAILED` node state propagating `ctx._error` (error shutdown). `FunctionNode`/`ToolNode` are LLM-free nodes. [\_workflow.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/workflow/_workflow.py)
- **LLM coordinator:** `LlmAgent` with `sub_agents` uses `AutoFlow` + a `transfer_to_agent` function call; sub-agents can also be exposed as tools with `mode` = `chat` / `task` / `single_turn`. This is model-decided delegation — the repo exposes no deterministic guarantee that a chosen child is invoked. [llm_agent.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/llm_agent.py)
- Deterministic engine ≠ deterministic LLM: for LLM nodes ADK controls *when/where* a model runs, not *what* it emits.

## 4. Google services: optional vs mandatory
- **Not mandatory for core.** Core deps are `google-genai`, `google-auth`, `fastapi`, `pydantic`, `opentelemetry-api/sdk` etc.; every Cloud product (Vertex/Agent Engine, Pub/Sub, Spanner, Firestore, Secret Manager, BigQuery) sits in optional extras (`gcp`, `db`, `mongodb`, `a2a`, `mcp`, `extensions`…). LiteLLM/OpenAI/Anthropic are extras, not core. [pyproject.toml](https://raw.githubusercontent.com/google/adk-python/main/pyproject.toml)
- Model-side auth is delegated to the providers' SDKs: Gemini via `google-genai` (API key or Vertex/ADC path) and non-Gemini via `LiteLlm`. **Inference**, not verified in-repo: any non-Gemini route needs that provider's own credential.

## 5. Codex subscription / OAuth vs API key
- **Not established.** The model directory contains `google_llm.py`, `gemini_llm_connection.py`, `lite_llm.py`, `anthropic_llm.py`, `apigee_llm.py`, `gemma_llm.py` — **no `openai_llm.py` and no Codex/ChatGPT-subscription path** in the tree listing; keyword probes for `openai`/`codex` in `models/` and for `GOOGLE_API_KEY`/`GEMINI_API_KEY`/`GOOGLE_GENAI_USE_VERTEXAI` in `gemini_llm_connection.py` returned nothing. [models listing](https://api.github.com/repos/google/adk-python/contents/src/google/adk/models), [gemini_llm_connection.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/models/gemini_llm_connection.py)
- API-key compatibility (LiteLLM/`openai` extra) does **not** demonstrate subscription/OAuth support. Absent evidence ≠ impossible, but nothing here preserves existing openai-codex subscription auth without a custom `BaseLlm`.

## 6. Token / context / LLM-call overhead (no benchmarks invented)
- LLM-coordinator mode adds `transfer_to_agent` (and per-mode agent tools) plus sub-agent descriptions to each turn's tool schemas. [llm_agent.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/llm_agent.py)
- **Context isolation is not the default for workflow nodes.** The engine computes `isolation_scope` per node: only task-mode `LlmAgent` nodes get a full isolated node path; "workflow nodes share the workflow's conversation view by default." `ParallelAgent` isolates branch history but **shares session state**. [\_workflow.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/workflow/_workflow.py), [parallel_agent.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/parallel_agent.py)
- Offsetting knobs: zero-LLM `FunctionNode`s, retry config, MCP `tools/list` TTL caching (cap 64 entries), Gemini context/prompt caching modules. Total LLM calls scale with per-agent loops, so a multi-agent ADK graph is not obviously cheaper than a bounded single-turn worker.

## 7. Parent/worker control and recovery
- Bounded loops: `LoopAgent.max_iterations` (None ⇒ until `escalate`); graph `max_concurrency`; resumable sessions reconstruct static node state from session events and serialize same-node runs. Cancellation appears as asyncio task cancellation/`aclose()` with sibling tasks awaited. [loop_agent.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/loop_agent.py), [\_workflow.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/workflow/_workflow.py)
- Progress/result reporting is **event-stream based** (session events/checkpoints), so a Pi parent would need a custom event→report translation. No built-in "worker result summary" contract for an external planner; parent-driven next-step selection would be reimplemented in the adapter.

## 8. Jev MCP compatibility
- Direct **stdio MCP is natively supported** via `McpToolset` + `StdioConnectionParams`/`StdioServerParameters` (no custom bridge), plus SSE/streamable-HTTP. Caveat: stdio servers declared in *agent config* are refused unless `ADK_ALLOW_CONFIG_STDIO_MCP_SERVERS=1`; constructing `McpToolset` in Python code is the sanctioned path. [mcp_toolset.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/tools/mcp_tool/mcp_toolset.py)

## 9. Privacy / telemetry defaults
- OTel-based; exporter is **operator-supplied** (core ships OTel api/sdk only; GCP exporters and OTLP exporter live in extras), so the trace recipient is whatever endpoint the operator configures. Content capture is split: legacy ADK span content **defaults ON** (`ADK_CAPTURE_MESSAGE_CONTENT_IN_SPANS`, default `true`), the OTel GenAI message-content knob defaults to `NO_CONTENT`, and experimental telemetry defaults off. Prompts/tool args/args responses can therefore land in spans by default. [telemetry/context.py](https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/telemetry/context.py), [pyproject.toml](https://raw.githubusercontent.com/google/adk-python/main/pyproject.toml)

## Pros / Cons
**Pros:** (1) Genuinely deterministic graph runtime with retry, fan-out/fan-in, resume and concurrency caps — the strongest scheduler evidence among typical agent frameworks. (2) Apache-2.0, active, first-party Google maintenance, no mandatory GCP services for core use. (3) Native stdio MCP + optional A2A/HTTP server, so Jev MCP fits and a worker-style bridge is technically constructible.
**Cons:** (1) Python-only framework with no Pi binding — every integration is a custom adapter/worker, not a library drop-in. (2) No evidence of openai-codex subscription/OAuth support; non-Gemini routes imply provider credentials, conflicting with the no-new-billing constraint. (3) Heavyweight for the goal: node context is shared by default, LLM-coordinator mode inflates tool schemas, and progress/result reporting is event-stream plumbing a parent must translate.

## Verdict
**POOR FIT** (medium-high confidence) for "simpler, token-efficient replacement for pi-subagents driven by the main Pi session". **Biggest blocker:** integration primitive mismatch — ADK is a self-contained Python application framework requiring an external worker plus a custom adapter, with no established Codex-subscription auth path. Confidence: high on identity/licensing/scheduling/deprecation facts; **not established (therefore low confidence)** only for whether an undocumented Codex-subscription route exists via LiteLLM/custom `BaseLlm`.

## Sources
- Kept: repo API metadata (license/activity) — https://api.github.com/repos/google/adk-python
- Kept: README (Workflow runtime, install, deploy, model-agnostic claim) — https://raw.githubusercontent.com/google/adk-python/main/README.md
- Kept: pyproject.toml (core vs extra deps; fastapi/otel; litellm/openai/anthopic in extras) — https://raw.githubusercontent.com/google/adk-python/main/pyproject.toml
- Kept: `_workflow.py` (deterministic scheduler, resume, error shutdown, isolation scope) — https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/workflow/_workflow.py
- Kept: sequential/parallel/loop agent sources (deprecation, branch isolation) — https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/sequential_agent.py , .../parallel_agent.py , .../loop_agent.py
- Kept: `llm_agent.py` (transfer_to_agent/AutoFlow, sub-agents as tools) — https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/agents/llm_agent.py
- Kept: `mcp_toolset.py` (stdio MCP) — https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/tools/mcp_tool/mcp_toolset.py
- Kept: `telemetry/context.py` (content-capture defaults) — https://raw.githubusercontent.com/google/adk-python/main/src/google/adk/telemetry/context.py
- Dropped: README community/events tail, models directory URLs, GitHub contents boilerplate — no evidentiary value.

## Facts vs inference vs unknowns
- **Source-observed:** license, deps/extras split, deprecation notices, graph scheduler behaviour, default telemetry knobs, stdio MCP support, absence of `openai_llm.py`/Codex references at the inspected revision.
- **Inference:** non-Gemini providers imply provider credentials; a Pi adapter would need custom event translation; ADK is heavier than a bounded worker for this use case.
- **Unknowns:** exact revision SHA (files fetched from `main`, unpinned); whether LiteLLM could front a Codex OAuth subscription; whether an external Pi↔ADK worker would actually be token-cheaper (no tests run — no execution permitted).

## Gaps
- Could not verify runtime behaviour, cancellation edge cases, or real per-task token cost without install/execution (forbidden this run).
- Suggested next step if pursued: pin a release tag, read `workflow/_node.py` + `_node_runner.py` and the ADK docs workflow page, and check whether any first-party Codex/ChatGPT-auth model adapter exists in `adk-python-community`.
