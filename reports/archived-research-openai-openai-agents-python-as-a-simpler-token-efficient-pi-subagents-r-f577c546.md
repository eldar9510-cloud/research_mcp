---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-openai-openai-agents-python-as-a-simpler-token-efficient-pi-subagents-r-f577c546",
    "title": "Research: openai/openai-agents-python as a simpler, token-efficient pi-subagents replacement",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: openai/openai-agents-python as a simpler, token-efficient pi-subagents replacement?",
    "scope": "Original Pi/tooling integration investigation: Research: openai/openai-agents-python as a simpler, token-efficient pi-subagents replacement. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: openai/openai-agents-python as a simpler, token-efficient pi-subagents replacement; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:36.315Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "f577c5466eb3a3d7b1063f79f4cbae970576f8ee73ebb19cd3affbbac32ea5d9",
  "proposalRevision": "f9ff1617dac3d63991fc216a38b7c056a0ad2d7011c64b0325085dcfb365a561"
}
---
# Research: openai/openai-agents-python as a simpler, token-efficient pi-subagents replacement

Retrieval timestamp: 2026-09-26 (all reads done directly from GitHub API + `raw.githubusercontent.com` on branch `main`; no clone, install, or execution). Facts below marked **[observed]** come from fetched files; **[inference]** and **[unknown]** are labelled explicitly.

## Summary
`openai-agents-python` is an MIT-licensed, actively maintained **Python framework** whose `Runner` owns the full agent loop. Its only first-party "Codex" affordance is an **experimental tool that spawns the `codex` CLI as a subprocess** (`codex exec --experimental-json`) — there is **no Codex/Codex-subscription model provider**, so the SDK's own orchestrating agent still needs an OpenAI-API-shaped (or OpenAI-compatible) credential. As a *replacement for pi-subagents* under "Pi is the sole planner, parent picks next steps, no new API billing", it is a **POOR FIT**, though the Codex tool's subprocess protocol is a useful, directly reusable recipe for a thin external worker.

## Findings

1. **Identity / license / activity [observed]** — `openai/openai-agents-python`, SPDX `MIT`, not archived, created 2025-03-11, `pushed_at` 2026-09-25T22:05:16Z, ~29.7k stars, ~21 open issues, language Python ([repo metadata](https://api.github.com/repos/openai/openai-agents-python)). It is a library ("lightweight, powerful framework for multi-agent workflows"), **not** a Pi extension and not TS ([README](https://raw.githubusercontent.com/openai/openai-agents-python/main/README.md)). **Correction worth flagging to any user table:** (a) the repo *does* contain a first-party experimental **Codex CLI** integration, which a short summary typically omits; (b) main-branch content (SandboxAgent, realtime, `httpx2`) is ahead of any pinned release — **version pinning was not verified [unknown]**.

2. **True primitive / minimal Pi integration path [observed + inference]** — The primitive is an **SDK embedded in a Python process**; the loop, tool execution and turn counting live in `Runner`/`AgentRunner` (`max_turns`, `RunState`, `RunHooks`) ([run.py](https://raw.githubusercontent.com/openai/openai-agents-python/main/src/agents/run.py)). Minimal integration is therefore an **external worker**: Pi spawns a Python script that embeds the SDK. Built-in VS unproven: `Agent.as_tool()` (manager keeps control, child invoked as a `FunctionTool`) and handoffs (specialist becomes the active agent for the rest of the turn) are **built-in and documented** ([multi_agent.md](https://raw.githubusercontent.com/openai/openai-agents-python/main/docs/multi_agent.md)); a Pi-native adapter is **hypothetical custom adapter (unproven)**.

3. **Codex subscription/OAuth vs API key [observed; direct evidence]** — `src/agents/extensions/experimental/codex/`: `codex_tool.py`, `codex.py`, `codex_options.py`, `exec.py`, `thread_options.py`, `turn_options.py` (no `codex_model.py`; `src/agents/models/` holds only `openai_responses`, `openai_chatcompletions`, `multi_provider`, `interface`). `CodexExec.run()` builds `["exec", "--experimental-json", ...]` and calls `asyncio.create_subprocess_exec` ([exec.py](https://raw.githubusercontent.com/openai/openai-agents-python/main/src/agents/extensions/experimental/codex/exec.py)). Binary resolution: `CODEX_PATH` → `shutil.which("codex")` → bundled vendor path. `_build_env()` copies `os.environ` unless `CodexOptions.env` overrides, and sets `OPENAI_BASE_URL`/`CODEX_API_KEY` **only if supplied**; the key defaults resolve `CODEX_API_KEY` → `OPENAI_API_KEY` → SDK default key (`codex_tool.py::_resolve_default_codex_api_key`). Consequence: **subscription auth is not established by the SDK itself**; it only works if the spawned CLI uses its own existing login and the ambient env carries no `OPENAI_API_KEY`/`CODEX_API_KEY` (a known Codex failure mode where env keys override stored ChatGPT auth — [codex#27651](https://github.com/openai/codex/issues/27651)). The SDK's own agent layer still requires an API key ([README](https://raw.githubusercontent.com/openai/openai-agents-python/main/README.md): "Set the `OPENAI_API_KEY` environment variable before running any of these examples"; [openai_provider.py](https://raw.githubusercontent.com/openai/openai-agents-python/main/src/agents/models/openai_provider.py)). API compatibility (e.g. `base_url`/OpenAI-compatible providers, litellm/any_llm extensions) **does not** establish subscription support. Whether a custom `Model` could be backed by the Codex CLI is **unproven and not provided**.

4. **Token/context/LLM-call overhead sources [observed, no benchmarks]** — (a) `as_tool()` returns the child's output into the parent as a tool result; handoffs pass conversation history to the new active agent (both documented patterns, [multi_agent.md](https://raw.githubusercontent.com/openai/openai-agents-python/main/docs/multi_agent.md)); (b) the runner retains `generated_items`, `session_items`, `model_responses`, `result._model_input_items` and replay snapshots per run (`run.py`), i.e. transcripts accumulate unless server-managed continuation (`previous_response_id`/`conversation_id`) or `Session` is used; (c) each agent contributes instructions + tool JSON schemas; (d) a CodexTool call runs an entire extra Codex agent process (its own context, model, reasoning effort) — cost is Codex's, not the SDK's. `span_data_max_chars` (default 8192) truncates **span data only**, not model input. **No dollar/token estimates are made here; none were measured.**

5. **Parent/worker control & failure recovery [observed]** — Allowance/limits: per-agent `tools=[...]`, `is_enabled` predicate on CodexTool, `max_turns` (`None` disables) raising `MaxTurnsExceeded` with a resolvable `error_handlers` hook, `RunHooks`, `RunState` resume, approval/interruption steps (`approvals_from_step`, human-in-the-loop), and cancellation: task cancellation plus an `asyncio.Event` signal that terminates the Codex subprocess (`exec.py::_watch_signal`). Codex-side containment is explicit and useful: `SandboxMode = read-only | workspace-write | danger-full-access`, `ApprovalMode = never | on-request | on-failure | untrusted`, `network_access_enabled`, `additional_directories`, `working_directory` ([thread_options.py](https://raw.githubusercontent.com/openai/openai-agents-python/main/src/agents/extensions/experimental/codex/thread_options.py)). Residual control caveat: the **Runner's loop decides the next step**; only code-orchestration (running one bounded agent turn at a time) keeps Pi as planner. Deterministic scheduling still does not mean deterministic LLM obedience.

6. **Jev MCP compatibility [observed for MCP generally; unknown for Jev]** — README advertises MCP tools and tracing exposes `mcp_tools_span` ([tracing/__init__.py](https://raw.githubusercontent.com/openai/openai-agents-python/main/src/agents/tracing/__init__.py)); stdio transport existence was **not verified in this pass**, and no Jev-specific integration exists. Since Jev is an MCP **stdio server configured in Pi** and is optional/advisory, a worker would need its own Jev client (and its own access to the Jev key file) — **direct stdio reuse from Pi is not available; it would be a duplicate client**, which conflicts with "installed separately / no settings changes".

7. **Privacy/telemetry defaults [observed]** — Tracing is **on by default**: `default_processor()` returns `BatchTraceProcessor` over `default_exporter()` → `BackendSpanExporter` POSTing to **`https://api.openai.com/v1/traces/ingest`** with `Authorization: Bearer <key>`, `OpenAI-Beta: traces=v1`, plus org/project headers ([tracing/processors.py](https://raw.githubusercontent.com/openai/openai-agents-python/main/src/agents/tracing/processors.py)). With no key it logs `"OPENAI_API_KEY is not set, skipping trace export"`; with a key it exports trace/span payloads that include model data (the existence of redaction switches `_debug.DONT_LOG_MODEL_DATA`/`DONT_LOG_TOOL_DATA` and the truncation limit imply model data is present by default). Disable requires an explicit `set_tracing_disabled(True)`/processor replacement. **Recipient of trace payloads = OpenAI backend**, and guardrails/tracing are **not** privacy or security proof.

## Pros / Cons
**Pros:** (1) MIT, OpenAI-owned, very actively pushed; (2) precise, explicit worker-containment knobs (sandbox mode, approval policy, network toggle, working dir, cancellation via subprocess kill); (3) the Codex-tool subprocess protocol (`codex exec --experimental-json`, CODEX_PATH/PATH resolution, env handling) is directly reusable as a thin external-worker recipe **without** adopting the framework.
**Cons:** (1) It is a framework with its own planner loop, competing with "Pi is the sole brain"; (2) no Codex-subscription model provider — the SDK's own agent needs an API-key-billed or OpenAI-compatible endpoint, so "no new billing" is not satisfied by the Codex path; (3) heavy Python runtime + default telemetry egress to OpenAI plus duplicated MCP/Jev surface.

## Sources
- Kept: repo metadata https://api.github.com/repos/openai/openai-agents-python — identity/license/activity.
- Kept: https://raw.githubusercontent.com/openai/openai-agents-python/main/README.md — scope, OPENAI_API_KEY default.
- Kept: .../src/agents/extensions/experimental/codex/exec.py — subprocess spawn, binary resolution, env/api-key propagation.
- Kept: .../src/agents/extensions/experimental/codex/codex_options.py + codex_tool.py — CodexOptions fields, key precedence.
- Kept: .../src/agents/tracing/processors.py — default exporter endpoint and payload recipient.
- Kept: .../docs/multi_agent.md + .../src/agents/run.py — as_tool vs handoff, max_turns/RunState/cancellation.
- Dropped: third-party summaries/SEO posts reused only to locate official pages; the official https://openai.github.io/openai-agents-python/ docs were treated as supplement.

## Gaps
No commit SHA pin (branch `main` only); stdio MCP transport unverified; no execution, so runtime behaviour of env-key vs ChatGPT-login precedence inside the child Codex process, wheel contents (bundled vendor binary), and real token/context deltas are **unknown**. Suggested next step (by the parent, with approval): inspect `pip` wheel contents/vendor dir and run a single `codex exec` env-precedence check in a throwaway env, plus read `docs/handoffs.md`/`running_agents.md` if handoff context growth matters.

## Verdict
**POOR FIT** as a simpler pi-subagents replacement under these constraints; **CONDITIONAL** only as a source of the `codex exec` external-worker recipe. Biggest blocker: no Codex-subscription model provider — the SDK's own agent requires an API-key-billed or OpenAI-compatible credential, and its Runner would become a second planner. Confidence: **high** on source-observed mechanics (files cited), **medium** on end-to-end runtime behaviour (read-only, unexecuted).

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "Findings cite concrete file paths with severities, e.g. src/agents/extensions/experimental/codex/exec.py (no codex_model.py in src/agents/models/), src/agents/tracing/processors.py (default trace egress to api.openai.com/v1/traces/ingest), src/agents/run.py (Runner owns loop/max_turns)."
    }
  ],
  "changedFiles": [
    "/home/eldar/.local/share/pi-research/subagent-frameworks-20260926T110744Z-yzot9ghd/openai-agents/report.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [
    {
      "command": "read-only GitHub API + raw.githubusercontent.com retrieval (no clone/install/exec)",
      "result": "not-run",
      "summary": "No shell commands executed; only fetch_content/get_search_content retrievals."
    }
  ],
  "validationOutput": [
    "Fetched 14 remote documents/API payloads: repo metadata, README, pyproject, exec.py, codex.py, codex_options.py, codex_tool.py, thread_options.py, tracing/processors.py, tracing/config.py, tracing/__init__.py, run.py, docs/multi_agent.md, git tree index. No local repo, clone, or execution."
  ],
  "residualRisks": [
    "Branch main not pinned to a commit SHA; shipped PyPI version may differ from main-branch content.",
    "Subscription-auth viability depends on unverified child-process credential precedence (env API keys can override stored ChatGPT auth).",
    "MCP stdio transport and Jev-specific compatibility unverified; no Jev integration exists in the repo.",
    "No execution performed, so token/context deltas and wheel/vendor-binary availability are unmeasured."
  ],
  "noStagedFiles": true,
  "diffSummary": "Added report.md only; no source edits, no repository changes.",
  "reviewFindings": [
    "blocker: src/agents/models/ (no codex_model.py; only openai_responses, openai_chatcompletions, multi_provider, interface) - no Codex-subscription model provider, so the SDK's own agent requires an API-key-billed or OpenAI-compatible credential.",
    "risk: src/agents/extensions/experimental/codex/exec.py:_build_env - inherits os.environ and exports CODEX_API_KEY/OPENAI_BASE_URL when provided, which can override existing Codex ChatGPT login; subscription use is not established here.",
    "risk: src/agents/tracing/processors.py:BackendSpanExporter - tracing enabled by default, exporting span payloads (incl. model data) to https://api.openai.com/v1/traces/ingest; requires explicit disable.",
    "risk: src/agents/run.py - the Runner loop owns next-step decisions, conflicting with Pi as sole planner unless driven step-by-step.",
    "note: src/agents/extensions/experimental/codex/thread_options.py - strong containment knobs (sandbox_mode, approval_policy, network_access_enabled, working_directory) and subprocess cancellation via asyncio.Event."
  ],
  "manualNotes": "Labeled observed vs inference vs unknown throughout. No local auth, credentials, env, or Pi config was read; no installs/clones/probes/subdelegation. Lane question answered: agents-as-tools (parent retains control, child output returns as a tool result) vs handoffs (specialist takes over the turn, inheriting history) both exist, but the Codex path is a tool, not a model provider."
}
```
