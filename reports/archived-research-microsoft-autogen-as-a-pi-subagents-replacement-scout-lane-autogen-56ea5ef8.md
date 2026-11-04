---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-microsoft-autogen-as-a-pi-subagents-replacement-scout-lane-autogen-56ea5ef8",
    "title": "Research: microsoft/autogen as a pi-subagents replacement (scout lane: autogen)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: microsoft/autogen as a pi-subagents replacement (scout lane: autogen)?",
    "scope": "Original Pi/tooling integration investigation: Research: microsoft/autogen as a pi-subagents replacement (scout lane: autogen). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: microsoft/autogen as a pi-subagents replacement (scout lane: autogen); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:36.147Z"
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
  "sourceDigest": "56ea5ef831fcf4fda482f3e64efd79ddf2a683b063dfeb2a6c6d38ed963ebc25",
  "proposalRevision": "64fbf4d01caab44474c679fc55a99a8c6540d7f62bf88ea068902ea1bd841f7d"
}
---
# Research: microsoft/autogen as a pi-subagents replacement (scout lane: autogen)

Scouted 2026-09-26 (UTC). Anchored to tag `python-v0.7.5`; repo HEAD inspected via GitHub API.
Labels: **[Observed]** = read from repo/API/docs; **[Inference]** = my reasoning; **[Unknown]** = not established.

## 1. Identity, license, activity (corrections to table claims)

- **[Observed]** Repo is **not archived** (`"archived": false`) but is explicitly in **maintenance mode, community managed**: README carries a two-place "⚠️ Maintenance Mode" banner — "will not receive new features or enhancements"; new users are redirected to **Microsoft Agent Framework (MAF)**, described as the "production-ready successor". [README](https://raw.githubusercontent.com/microsoft/autogen/main/README.md)
- **[Observed]** Last commit on `main`: `027ecf0a…` dated **2026-04-06**, message "Update maintenance mode banner in readme (#7521)". API `pushed_at = 2026-04-15T11:59:09Z`. Latest Python release: **`python-v0.7.5`, published 2025-09-30** (author ekzhu); its notes contain mostly small fixes/Copilot-authored PRs plus "Add security warnings and default to `DockerCommandLineCodeExecutor` (#7035)". [commits API](https://api.github.com/repos/microsoft/autogen/commits?per_page=1) · [latest release](https://api.github.com/repos/microsoft/autogen/releases/latest)
- **[Observed]** Root `license` reported by GitHub is **CC-BY-4.0** (docs-style license), while the shipping Python package is **MIT**: `autogen-agentchat` `pyproject.toml` sets `license = {file = "LICENSE-CODE"}` and classifier `MIT`. So "license = MIT" and "license = CC-BY-4.0" are both defensible for different files. [pyproject.toml](https://raw.githubusercontent.com/microsoft/autogen/python-v0.7.5/python/packages/autogen-agentchat/pyproject.toml)
- **AgentChat vs Core [Observed]**: README documents three layers — **Core API** (`autogen-core`: message passing, event-driven agents, local/distributed runtime), **AgentChat API** (`autogen-agentchat`: opinionated multi-agent patterns built on Core; hard dependency `autogen-core==0.7.5`), **Extensions** (`autogen-ext`: model clients, code executors, MCP). AgentChat is the practical "team runner"; Core is the lower-level runtime and is what carries `AgentRuntime`, `CancellationToken`, OTel spans. Not "one runtime with two names".

## 2. True primitive and minimal Pi integration path

- **[Observed]** AutoGen is a **Python library/GUI suite** (`autogen-agentchat`, `autogen-ext`, `autogenstudio`), not a Pi extension. Pi extensions are TS-side; nothing here is a Pi plugin.
- **[Observed]** AutoGen ships an **MCP *client*** (`autogen_ext.tools.mcp`) for Stdio/SSE/Streamable-HTTP servers; I found no MCP **server** mode that would let Pi drive a team as a tool. [mcp/_config.py](https://raw.githubusercontent.com/microsoft/autogen/python-v0.7.5/python/packages/autogen-ext/src/autogen_ext/tools/mcp/_config.py)
- **[Inference / unproven]** Minimal path = **external worker**: a Pi-side wrapper that shells out to a Python runner per bounded task (stdin task → stdout `TaskResult`/JSON), i.e. a *custom adapter*. Any claim that Pi can embed AutoGen as an SDK/extension natively is unproven; a Python runner script plus IPC contract is the only low-ceremony option.

## 3. Codex subscription / OAuth vs OpenAI API key

- **[Observed]** `OpenAIChatCompletionClient`: `api_key` is "**Required if 'OPENAI_API_KEY' is not found in the environment variables**"; `base_url` is supported for OpenAI-compatible endpoints (example uses a dummy `api_key="placeholder"` for Ollama). Searching the client source for "OAuth"/"ChatGPT" returned **no matches**; token-based auth exists only for Azure (`azure_ad_token` / `azure_ad_token_provider` via `AzureTokenProvider`). [openai/_openai_client.py](https://raw.githubusercontent.com/microsoft/autogen/python-v0.7.5/python/packages/autogen-ext/src/autogen_ext/models/openai/_openai_client.py)
- **Verdict on this axis:** Codex **subscription/OAuth support is not established** — not shown impossible. Anything relying on the existing `openai-codex` subscription would need a local proxy/base_url shim, which is **unproven** and would be a new component, not a supported feature.

## 4. Token / context / LLM-call overhead sources

- **[Observed]** Default context is `UnboundedChatCompletionContext()` when `model_context` is not supplied; docs recommend `BufferedChatCompletionContext` or `TokenLimitedChatCompletionContext` to cap history. Nothing auto-trims by default. [agents/_assistant_agent.py](https://raw.githubusercontent.com/microsoft/autogen/python-v0.7.5/python/packages/autogen-agentchat/src/autogen_agentchat/agents/_assistant_agent.py)
- **[Observed]** Every model call builds `system_messages + all_messages` and re-lists tools (`[tool for wb in workbench for tool in await wb.list_tools()] + handoff_tools`) → system prompt + full tool schemas resent per LLM call. `max_tool_iterations` defaults to **1** (caps tool-loop LLM calls per run). [same file]
- **[Inference]** Conversational/team loops grow superlinearly in tokens: the round-robin manager persists a `_message_thread` and re-publishes messages to participants each turn, so later turns resend the accumulated thread. No benchmark or dollar estimate is fabricated here; the mechanism is the evidence. [teams/_group_chat/_round_robin_group_chat.py](https://raw.githubusercontent.com/microsoft/autogen/python-v0.7.5/python/packages/autogen-agentchat/src/autogen_agentchat/teams/_group_chat/_round_robin_group_chat.py)

## 5. Parent/worker control and failure recovery

- **[Observed]** Deterministic *scheduling* controls exist: `RoundRobinGroupChat` (fixed turn order), `termination_condition` (`TextMentionTermination`, `MaxMessageTermination`, `ExternalTermination`), `max_turns`, per-agent `max_tool_iterations`. `SelectorGroupChat`/LLM-routed selection is **not** deterministic — framework scheduling ≠ model obedience.
- **[Observed]** Cancellation is real at the framework level: `CancellationToken` + `link_future` cancel pending async work; **but** the team docstring warns cancellation "potentially put[s] the team in an inconsistent state, and it may not reset the termination condition. To gracefully stop the team, use `ExternalTermination` instead". [core/_cancellation_token.py](https://raw.githubusercontent.com/microsoft/autogen/python-v0.7.5/python/packages/autogen-core/src/autogen_core/_cancellation_token.py) · [teams/.../_base_group_chat.py](https://raw.githubusercontent.com/microsoft/autogen/python-v0.7.5/python/packages/autogen-agentchat/src/autogen_agentchat/teams/_group_chat/_base_group_chat.py)
- **[Observed]** Progress/result reporting: `run`/`run_stream` yield a typed event stream ending in a `TaskResult`; group-chat managers implement `save_state`/`load_state` (e.g. `RoundRobinManagerState`), giving resumable state — but the parent must build its own supervision loop (no unattended gate semantics, none wanted).

## 6. Jev MCP compatibility

- **[Observed]** Direct MCP **client** support for stdio: `StdioServerParams(command, args, env, read_timeout_seconds)` extends mcp SDK `StdioServerParameters`, plus `StdioMcpToolAdapter` and `McpWorkbench`. **[Inference]** A stdio MCP server like Jev could be attached directly as a workbench (`command=…, args=[…]`) — no custom bridge needed. README warns "Only connect to trusted MCP servers as they may execute commands in your local environment".

## 7. Privacy / telemetry defaults

- **[Observed]** OTel instrumentation exists for runtime, tools, and AgentChat agents, but **no default exporter/endpoint**: docs require you to install an SDK + exporter and pass a `tracer_provider`; can be disabled via `NoOpTracerProvider` or `AUTOGEN_DISABLE_RUNTIME_TRACING=true`. **[Inference]** Trace payload recipient = whatever OTLP backend the operator configures; no first-party telemetry destination found. Prompt content still goes to the configured model endpoint (OpenAI-compatible/`base_url`). [telemetry docs](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/telemetry.html)
- **[Unknown]** Code-executor sandbox guarantees could **not** be verified at the tag: the raw `python-v0.7.5/.../code_executors/docker/_docker_code_executor.py` URL returned content titled from a legacy `autogen/coding/…` path with no "sandbox/security/isolation" matches. Treat "Docker executor = security boundary" as **not established**; the only 0.7.5-era signal is the release note about adding security warnings.

## 8. Pros / cons

**Pros:** (1) Mature, typed orchestration primitives — termination conditions, cancellation tokens, resumable state, structured `TaskResult` streaming; (2) Direct stdio MCP client (Jev-compatible) and an existing auto/OpenAI-compatible client family; (3) Explicit, code-level caps (`max_turns`, `max_tool_iterations`, buffered/token-limited contexts) that a parent can enforce.

**Cons:** (1) **Maintenance mode, community-managed**, with Microsoft redirecting users to Microsoft Agent Framework — new-project risk; (2) Python-only, no Pi extension and no MCP server mode → a custom adapter is mandatory, i.e. exactly the "custom framework" the constraints discourage; (3) Token-unfriendly defaults (unbounded context, per-call system+tool-schema resend, thread re-broadcast) and no evidence of Codex subscription/OAuth auth.

## 9. Verdict

**POOR FIT** (confidence: high on maintenance/integration facts; medium-high on the auth gap).
Biggest blocker: it is not a Pi-native primitive at any layer — it is a being-maintained-in-name-only Python framework requiring a bespoke adapter, while offering no subscription-auth path established and no token-lean default. Deterministic scheduling (round-robin, caps) is real; deterministic model obedience is not, and nothing here proves otherwise. Only revisit if Microsoft Agent Framework is re-scouted as the successor.

## Sources
- Kept: README @ main (maintenance-mode banner, layer split, MCP example) — decisive status + architecture evidence.
- Kept: repo/releases/commits API (archived=false, pushed_at, last commit, v0.7.5 notes) — activity is data, not vibes.
- Kept: `autogen-agentchat/pyproject.toml` (MIT `LICENSE-CODE`, dep on `autogen-core==0.7.5`).
- Kept: `models/openai/_openai_client.py` (api_key/base_url requirement; no OAuth/ChatGPT match).
- Kept: `agents/_assistant_agent.py` (unbounded default context, per-call prompt/tool assembly, `max_tool_iterations=1`).
- Kept: `teams/_group_chat/_round_robin_group_chat.py` + `_base_group_chat.py` (deterministic turn order, `max_turns`, cancellation caveat).
- Kept: `tools/mcp/_config.py` (stdio/SSE/streamable HTTP params).
- Kept: OTel telemetry docs (no default exporter; disable switches).
- Dropped: AutoGen Studio / Magentic-One / agbench docs — GUI and benchmarks, irrelevant to a Pi worker primitive.
- Dropped: `/stable/.../tutorial/code-executors.html` — HTTP 404; sandbox claims left as Unknown rather than guessed.

## Gaps
- Sandbox claims for `DockerCommandLineCodeExecutor` unverified at the tag (retrieval limitation above); needs `fetch` of the correct in-tree path or the `dev` docs URL.
- No measured token accounting (deliberately: no probes, no fabricated benchmarks) — overhead is mechanism-level only.
- Whether a Pi-side MCP/HTTP wrapper for AutoGen teams already exists in the wild was not surveyed (out of scope).
