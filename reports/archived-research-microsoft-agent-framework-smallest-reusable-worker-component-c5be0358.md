---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-microsoft-agent-framework-smallest-reusable-worker-component-c5be0358",
    "title": "Research: microsoft/agent-framework — smallest reusable worker component",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: microsoft/agent-framework — smallest reusable worker component?",
    "scope": "Original Pi/tooling integration investigation: Research: microsoft/agent-framework — smallest reusable worker component. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: microsoft/agent-framework — smallest reusable worker component; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:34.566Z"
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
  "sourceDigest": "c5be0358a8122b4d8c189251f6b2939d94a3b3b7d2ddc344e37ea1d8fec7d9f8",
  "proposalRevision": "bcf94667c286e26a3cd7df76d4a879650cb5ffd6889bd80622d3314ae3aba3e8"
}
---
# Research: microsoft/agent-framework — smallest reusable worker component

Lane: core-only executor vs CLI-backed worker. Evidence: first-party GitHub API/raw at `main`, retrieved 2026-09-26. Prior scout report and parent `REPORT.md` were read first; two of their framings are corrected below.

## 1. Identity, license, activity, corrections
[fact] MIT, active (pushed 2026-09-25); Python core `agent-framework-core` 1.19.0, `requires-python >=3.10` ([core pyproject](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/core/pyproject.toml)). Go SDK is a separate repo ([README](https://raw.githubusercontent.com/microsoft/agent-framework/main/README.md)). **Correction A:** the 30-extra meta-package is optional — workflows live *inside* core, so a two-package install suffices. **Correction B:** [PR #4375 "Add OpenAI Codex SDK integration"](https://api.github.com/repos/microsoft/agent-framework/pulls/4375) is `state: closed`, `merged: false`, `merged_at: null`; no `codex` directory exists among the 41 `python/packages` entries (contents API listing).

## 2. Smallest reusable package
[fact] `agent-framework-core` (PyPI; import `agent_framework`) contains agents, the tool-calling loop, graph workflows (`_workflows/`: `_workflow.py`, `_workflow_builder.py`, `_checkpoint.py`, `_request_info_mixin.py`, `_runner.py`), in-process MCP (`_mcp.py`), compaction. Runtime deps: msgspec, typing-extensions, pydantic, python-dotenv, opentelemetry-api, pyyaml, regex — **no dashboard/DB/server**. Add `agent-framework-openai` (core + `openai`) for providers. `mcp` and `agent-framework-tools` are extras, not core deps.

## 3. Concrete minimal Pi adapter shape
[fact] No Pi/native integration exists (not a CLI, daemon or extension; no `[project.scripts]`). **Proposed A (smallest):** Pi's existing shell worker spawns `python worker.py` that builds one agent plus a one-node `WorkflowBuilder` graph, runs it, prints one JSON result. **Proposed B (CLI-backed worker):** the child uses `agent-framework-tools` `LocalShellTool` (beta), which launches user commands with approval-in-the-loop, psutil process-tree kill on timeout, 64 KiB output truncation and `ShellPolicy` pre-filter ([tools README](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/tools/README.md), [pyproject](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/tools/pyproject.toml)); it can invoke an external CLI that keeps its own auth/tools. [unknown] whether Pi CLI has a non-interactive mode — not answerable here. [fact] Single-package .NET alternative: `Microsoft.Agents.AI.Harness` ("pre-configured AI agent … for long running tasks", sole project reference `Microsoft.Agents.AI`) with `MaximumIterationsPerRequest`, opt-in file access, file memory, skills, todo, OTel ([csproj](https://raw.githubusercontent.com/microsoft/agent-framework/main/dotnet/src/Microsoft.Agents.AI.Harness/Microsoft.Agents.AI.Harness.csproj), [HarnessAgentOptions.cs](https://raw.githubusercontent.com/microsoft/agent-framework/main/dotnet/src/Microsoft.Agents.AI.Harness/HarnessAgentOptions.cs)) — needs the .NET runtime.

## 4. Scheduling, bounds, cancellation
[fact] Bounds are in core: `FunctionInvocationConfiguration` with `max_iterations` (default 40 round-trips), `max_function_calls`, `max_duration_seconds` (wall-clock budget), `max_consecutive_errors_per_request` (3), `allow_concurrent_invocation` ([core `_tools.py`](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/core/agent_framework/_tools.py)). Workflows are deterministic executor/edge graphs with checkpoint/resume and `cancel_request_info_events` ([`_workflow.py`](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/core/agent_framework/_workflows/_workflow.py)). No `asyncio.wait_for` appears in `_workflow.py`: [inference] run cancellation is asyncio-task-based plus per-request duration caps; per-run token caps [unknown]. Extra LLM overhead comes only from declared orchestrations (sequential/concurrent/handoff/magentic extras), which re-send context per hop; a single-worker graph avoids that. No measured token comparison (not permitted).

## 5. Codex subscription and DeepSeek/ZAI
[fact] No Codex/ChatGPT-subscription provider (PR #4375 unmerged; [issue #4370](https://github.com/microsoft/agent-framework/issues/4370) closed). `openai` auth is API-key/Entra. [fact] Existing DeepSeek/ZAI keys are plausible with no new billing: `OpenAIChatCompletionClient(model=..., base_url=..., api_key=...)` is documented ("Adapt OpenAI-compatible endpoints", `OPENAI_BASE_URL`, `response_parser`/`message_preparer` hooks) ([Learn](https://learn.microsoft.com/en-us/agent-framework/agents/providers/openai), [`_chat_completion_client.py`](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/openai/agent_framework_openai/_chat_completion_client.py)). Only subscription-backed providers are GitHub Copilot (`agent-framework-github-copilot`; the SDK owns the tool loop, CLI workspace sessions, `enable_file_hooks` default off) and Claude (`agent-framework-claude` wraps `claude-agent-sdk`).

## 6. Jev / MCP
[fact] Stdio MCP client is in core (`_mcp.py`, optional `mcp` package); Jev stays parent-side unchanged.

## 7. Telemetry / privacy from source
[fact] OTel built in, no exporter by default. `LocalShellTool` runs on the host with the agent's privileges, and its policy lists are explicitly "not a security boundary"; `DockerShellTool`/Hyperlight are the documented sandbox tiers (tools README).

## 8. Pros / cons / verdict
**Pros:** (1) small core-only install with real per-request bounds; (2) documented OpenAI-compatible `base_url` path plus a first-party shell-tool package that fits a CLI-backed worker; (3) deterministic graph, checkpoint/resume, stdio MCP.
**Cons:** (1) no Codex-subscription path, so Codex auth must be established outside MAF; (2) not Pi-native — a custom worker plus its own lifecycle/state, and multi-agent orchestrations duplicate the parent planner.
**Verdict: CONDITIONAL.** Biggest unresolved fact: whether Pi's CLI can be driven non-interactively as a shape-B child, and whether the beta `agent-framework-tools` API is stable for a worker.

## Sources
Kept: core/openai/tools/claude/copilot pyprojects and READMEs, `_tools.py`, `_workflow.py`, packages/contents API listings, PR #4375 API, Learn OpenAI-provider page, Harness csproj/options. Dropped: DevBlog/YouTube material, third-party `JKToolKit.CodexSDK`, star/commit counts.
