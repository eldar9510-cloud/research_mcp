---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-microsoft-autogen-smallest-core-runtime-direct-single-agent-worker-lane-e185f6c5",
    "title": "Research: microsoft/autogen — smallest core runtime / direct single-agent worker lane",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: microsoft/autogen — smallest core runtime / direct single-agent worker lane?",
    "scope": "Original Pi/tooling integration investigation: Research: microsoft/autogen — smallest core runtime / direct single-agent worker lane. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: microsoft/autogen — smallest core runtime / direct single-agent worker lane; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:35.134Z"
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
  "sourceDigest": "e185f6c53f84b0e85f83586499febb179caf0451a80dd2c028ea25bc6b3ad0b6",
  "proposalRevision": "0cf85d84aa9f20372662bb655488cd9aa06fd29c7ad547f97926547f3996fbb5"
}
---
# Research: microsoft/autogen — smallest core runtime / direct single-agent worker lane

Lane: single-agent executor + core runtime, not group chat. **[F]** fact from primary source, **[I]** inference, **[U]** unknown.

## Summary

The smallest reusable piece is small and real: `autogen-agentchat` (sole runtime dep `autogen-core==0.7.5`) runs **one direct `AssistantAgent` worker** or exposes it as `AgentTool` — no team, manager, dashboard, DB or server. Integration into Pi is still a **custom Python sidecar** (no Pi extension, no MCP server mode) and Codex-subscription auth is unestablished. Verdict: **CONDITIONAL**.

## Findings

1. **[F] Maintenance ≠ archived.** `archived: false`, `pushed_at 2026-04-15`, last commit `027ecf0a` 2026-04-06 ("Update maintenance mode banner…(#7521)"); latest release `python-v0.7.5` 2025-09-30. Security fixes landed in the same era: 2026-03-26 "restrict importlib provider loading to trusted namespaces (#7463)", 2026-03-11 "harden MCP WebSocket endpoint (#7362)". [repo](https://api.github.com/repos/microsoft/autogen) · [commits](https://api.github.com/repos/microsoft/autogen/commits?per_page=3) · [releases](https://api.github.com/repos/microsoft/autogen/releases?per_page=3)
2. **[F] License split.** Repo `spdx_id = CC-BY-4.0` (docs), but each package ships `license = {file = "LICENSE-CODE"}` with an MIT classifier — MIT covers the reusable code. [agentchat pyproject](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-agentchat/pyproject.toml) · [README](https://raw.githubusercontent.com/microsoft/autogen/main/README.md)
3. **[F] Smallest component.** `autogen-agentchat` → `autogen-core==0.7.5` only; core deps: pillow, typing-extensions, pydantic≥2.10,<3, `protobuf~=5.29.3`, `opentelemetry-api`, jsonref. Models add `autogen-ext[openai]` (openai≥1.93, tiktoken, aiofiles). `grpc`, Studio and Docker executors are optional extras — no mandatory dashboard/DB/server. [core](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-core/pyproject.toml) · [ext](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-ext/pyproject.toml)
4. **[F] Worker primitive.** `AgentTool(agent=…, return_value_as_last_message=True)` wraps one `BaseChatAgent`, returns a `TaskResult`, and *requires* `parallel_tool_calls=False` on the caller ("Agents cannot run concurrently as they maintain internal state"). Optional `SingleThreadedAgentRuntime` = in-memory asyncio queue with `stop()/stop_when_idle()/save_state()`; "suitable for development and standalone applications… not… high-throughput". [\_agent.py](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-agentchat/src/autogen_agentchat/tools/_agent.py) · [runtime](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-core/src/autogen_core/_single_threaded_agent_runtime.py)
5. **[I]/[U] Pi adapter shape (proposed, not built-in).** ~50–100 line Python entry script: JSON config → one `AssistantAgent` → `agent.run(task, cancellation_token)` under `asyncio.wait_for` → last message as JSON on stdout; called Pi-side as a command, or wrapped in a small MCP stdio server exposing `run_worker`. AutoGen's MCP support is client-side only (`Elicitor`/`RootsProvider`/`Sampler` serve server-initiated requests); AutoGen-as-MCP-server not found **[U]**. Whether Pi could spawn itself as the child (keeping auth/tools/skills) is a Pi-side capability, not evidenced here **[U]**.
6. **[F] Scheduling, bounds, overhead.** No manager needed. `max_tool_iterations` defaults to **1**; `model_context` defaults to `UnboundedChatCompletionContext` (bounding is opt-in); the agent keeps state between calls, so callers pass only new messages. `CancellationToken` reaches tool execution (`TaskRunnerTool.run`), but no per-task timeout parameter exists — the wrapper must impose one **[I]**. Overhead is mechanism-level (system prompt + tool schemas resent per model call; AgentTool adds one parent round-trip whose payload you choose). No measured token comparison was run.
7. **[F] Auth.** `OpenAIChatCompletionClient` needs `api_key`/`OPENAI_API_KEY`, plus `base_url` + `model_info` for non-OpenAI endpoints, documented as "not tested or guaranteed". OAuth/ChatGPT/Codex: **no matches** in the client source → Codex-subscription reuse **not established** (not proven impossible; would need an unproven proxy shim). DeepSeek appears only as `reasoning_content`→thought handling, an Ollama `deepseek-r1:1.5b` example and a `ModelFamily.R1` example; DeepSeek/ZAI would ride the OpenAI-compatible route with hand-set `model_info`, untested upstream **[I]**. No new billing implied, but nothing here reads Pi credentials. [\_openai_client.py](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-ext/src/autogen_ext/models/openai/_openai_client.py)
8. **[F] Jev/MCP.** Stdio MCP client exists (`StdioServerParams`, `mcp_server_tools`, `McpWorkbench`) — keep Jev parent-side. [mcp](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-ext/src/autogen_ext/tools/mcp/__init__.py)
9. **[F] Telemetry/security.** `opentelemetry-api` is mandatory and the runtime accepts `tracer_provider`, disabled by `AUTOGEN_DISABLE_RUNTIME_TRACING`; no first-party exporter found. Component loading `importlib`-imports provider paths, now gated by `_TRUSTED_PROVIDER_NAMESPACES` plus an `AUTOGEN_ALLOWED_PROVIDER_NAMESPACES` opt-in — treat JSON component configs as code-loading input **[I]**. [\_component_config.py](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-core/src/autogen_core/_component_config.py)

## Pros / cons

**Pros**: (1) minimal worker path — two MIT packages, ~9 core deps, no server/DB/UI, with real `CancellationToken` and explicit iteration/context caps; (2) still security-patched despite maintenance mode, and Jev stays parent-side.
**Cons**: (1) bespoke Python sidecar needed (no Pi extension/MCP server mode), manual `model_info`, and the tight `protobuf~=5.29.3` pin is a plausible env conflict **[I]**; (2) Codex-subscription auth unestablished, community-managed maintenance, unbounded-context default invites repeated prompt/schema cost.

## Sources

- Kept: repo/commits/releases API, README, three `pyproject.toml`s, `_agent.py`, `_task_runner_tool.py`, `_assistant_agent.py`, `_single_threaded_agent_runtime.py`, `_component_config.py`, `_openai_client.py`, mcp `__init__.py`.
- Dropped: Studio/Magentic-One pages, third-party DeepSeek tutorials (synthesized), prior report used only as cross-check.

## Gaps

- Biggest unresolved fact: whether a Codex-subscription or existing DeepSeek/ZAI endpoint attaches without new billing or a proxy shim — an auth decision, not more README reading.
- No `AssistantAgent` timeout primitive; no measured token deltas; MCP-server absence rests on source reading + prior scout, not exhaustive proof.

## Verdict

**CONDITIONAL** — reusable if the parent accepts a small custom Python sidecar and an OpenAI-compatible endpoint reachable with existing credentials; the no-server/DB/UI constraint is met by `autogen-agentchat` + one `AssistantAgent`, not by any AutoGen app layer. No install, clone or execution performed.
