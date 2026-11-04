---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-langchain-ai-langchain-as-a-pi-subagents-replacement-e75329d4",
    "title": "Research: langchain-ai/langchain as a pi-subagents replacement",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: langchain-ai/langchain as a pi-subagents replacement?",
    "scope": "Original Pi/tooling integration investigation: Research: langchain-ai/langchain as a pi-subagents replacement. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: langchain-ai/langchain as a pi-subagents replacement; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": "2026-09-26",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi research bundle",
      "author": "DeepSeek Flash scout (langchain lane)",
      "model": "DeepSeek Flash (as attributed in the report)"
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
    "imported_at": "2026-11-04T21:30:35.980Z"
  },
  "warnings": [
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "e75329d45cede121e2cc184842cc174695dbacabc3b193fcfcdd364479208a17",
  "proposalRevision": "726bb1bfb83fba2334a39ce4bcc080fe636884ef5c7877cc5bbbc77bf042cc1b"
}
---
# Research: langchain-ai/langchain as a pi-subagents replacement

Author: DeepSeek Flash scout (langchain lane). All facts below sourced from public GitHub raw/API and first-party docs on 2026-09-26 (repo `updated_at` 2026-09-26T10:34:29Z, `pushed_at` 2026-09-26T08:55:23Z). Read-only; no installs, clones, or live model probes.

## Verdict: POOR FIT (confidence: high on facts, medium on "no future workaround")

LangChain is a Python library ecosystem, not a Pi-integrated worker harness. Its only genuinely parent-controlled "worker" primitive lives in a **separate** package (`deepagents`), needs `langgraph`, and is mediated by LLM tool calls, not deterministic scheduling.

## 1. Identity / license / activity (user-table corrections)

- Repo `langchain-ai/langchain`, MIT, not archived, default branch `master`, Python, 147k stars / 24.6k forks, 566 open issues. [GitHub API](https://api.github.com/repos/langchain-ai/langchain)
- **Correction 1 — Python floor is stale:** user table's "Python 3.7+" is wrong. `langchain` is **1.4.2** with `requires-python = ">=3.10.0,<4.0.0"`; `langchain-core` is 1.6.5, also `>=3.10`. [langchain_v1/pyproject.toml](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain_v1/pyproject.toml), [core/pyproject.toml](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/core/pyproject.toml)
- **Correction 2 — "v0.x stable" is stale:** the current `langchain` package declares `Development Status :: 5 - Production/Stable` at **1.4.x**. The old 0.x-era code was moved to a legacy package `langchain-classic` **1.0.8** under `libs/langchain`. [langchain/pyproject.toml](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain/pyproject.toml)

## 2. True primitive and minimal Pi integration path

- Layer separation (source-observed): README points orchestration to **LangGraph** and delegation to **Deep Agents**, both separate repos; the FAQ states "LangGraph is the graph runtime. LangChain's `create_agent` is a minimal agent harness on top of it. Deep Agents is a more opinionated harness on top of `create_agent`". [langchain README](https://raw.githubusercontent.com/langchain-ai/langchain/master/README.md), [deepagents README](https://github.com/langchain-ai/deepagents)
- Minimal supported parent→worker primitive: a **subagent** defined via `subagents=[...]` on `create_deep_agent`, invoked with the `task` tool; requires the separate `deepagents` package (0.7.19, `Development Status :: 4 - Beta`, hard deps `langchain>=1.4.2`, `langchain-anthropic`, `langchain-google-genai`). [deepagents pyproject](https://raw.githubusercontent.com/langchain-ai/deepagents/main/libs/deepagents/pyproject.toml)
- `langchain` itself hard-depends on `langgraph>=1.2.11,<1.3.0` — the "minimal" harness is not dependency-minimal. [langchain_v1/pyproject.toml](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain_v1/pyproject.toml)
- Integration label: **external worker / hypothetical custom adapter (unproven)**. Nothing first-party references Pi or a Node/CLI extension API; a Pi→Python bridge would be custom code.

## 3. Codex subscription / OAuth vs API key (direct evidence exists)

- `ChatOpenAI` reads credentials from `OPENAI_API_KEY`/`api_key` (or LangSmith-gateway `lsv2_` keys) — API-key flow only. [base.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/partners/openai/langchain_openai/chat_models/base.py)
- **However**, `master` contains `_ChatOpenAICodex` (private, "Experimental and unofficial") which implements **ChatGPT subscription OAuth** (PKCE loopback + device-code) against `https://chatgpt.com/backend-api/codex`, with `login_chatgpt()`, token store `~/.langchain/chatgpt-auth.json` deliberately separate from `~/.codex/auth.json`. It forces `use_responses_api=True, store=False, streaming=True`, lifts `SystemMessage`s into `instructions`, and sends `originator: langchain`. [codex.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/partners/openai/langchain_openai/chat_models/codex.py), [chatgpt_oauth.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/partners/openai/langchain_openai/chatgpt_oauth.py), added in [commit 6c2b70e](https://github.com/langchain-ai/langchain/commit/6c2b70e60e51de9987b2a96529f18c5ff8559a0d)
- So subscription auth is *not* established as a supported public feature (underscore-private, warns "not an official OpenAI API integration"); inference: usable, unsupported, and risky for a framework dependency. `bind_tools` is not overridden in `codex.py` — tool-calling inside agent loops via this path is **unknown**.

## 4. Token / context / LLM-call overhead (no fabricated numbers)

Source-observed overhead sources: (a) middleware-injected system prompt and tool schemas, including an always-present `general-purpose` subagent unless disabled; (b) context management that **summarizes** long threads and offloads tool outputs to disk (extra LLM calls); (c) skills loaded on demand; (d) async-subagent docs admit the supervisor can poll `check` in a loop "turning async execution into blocking", and that statuses in history are "always stale", forcing extra calls. No published benchmarks or dollar figures — none estimated here. [subagents](https://docs.langchain.com/oss/python/deepagents/subagents), [async-subagents](https://docs.langchain.com/oss/python/deepagents/async-subagents)

## 5. Parent/worker control and failure recovery

- Control: `tools=[...]` on a subagent "overrides the inherited tools entirely" (real enforcement, not just prompting); `mode: "isolated"` (default) gives only the task description, `mode: "fork"` inherits parent history; per-subagent `model`, `middleware`, `permissions`, `interrupt_on` (HITL, requires a checkpointer), `response_format`. Selection of *which* subagent to call is the parent LLM's decision via `task` — framework determinism ≠ model obedience.
- Cancellation: sync subagents **cannot** be cancelled or steered; async subagents add `cancel_async_task`/`update_async_task`/`list_async_tasks`, but require an Agent Protocol (LangGraph) server, `langgraph.json` registration, and for HTTP transport `LANGSMITH_API_KEY`/`LANGGRAPH_API_KEY`, plus a sized worker pool. Recovery state lives in a dedicated `async_tasks` channel (survives context compaction).
- Turn/token limits: no per-subagent turn/token cap documented in what I read; only model-level params. **Unknown.**
- Reporting: result = subagent's last message text or JSON via `response_format`; per-agent naming via `lc_agent_name` metadata. [subagents](https://docs.langchain.com/oss/python/deepagents/subagents), [async-subagents](https://docs.langchain.com/oss/python/deepagents/async-subagents)

## 6. Jev MCP compatibility

Direct stdio works, via a **separate package** `langchain-mcp-adapters`: `MultiServerMCPClient({"jev": {"command": ..., "args": [...], "transport": "stdio"}})` → `load_mcp_tools()`; no custom bridge needed. MCP *execution* errors return as `ToolMessage(status="error")` by default; transport failures raise. README warns stdio is intended for local user-machine apps. [MCP adapters README](https://raw.githubusercontent.com/langchain-ai/langchain-mcp-adapters/main/README.md)

## 7. Privacy / telemetry

- `langchain-core` always depends on `langsmith` (installed regardless of use). [core/pyproject.toml](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/core/pyproject.toml)
- Tracing requires explicit `LANGSMITH_TRACING` + `LANGSMITH_API_KEY` + endpoint (US default, EU/APAC/AWS variants); when on, prompts/outputs and model-call metadata post to the LangSmith API (recipient: LangChain's LangSmith service). [trace-with-langchain](https://docs.langchain.com/langsmith/trace-with-langchain)
- If `_ChatOpenAICodex` is used, the `originator: langchain` header explicitly exists "so OpenAI telemetry attributes calls to this package". [codex.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/partners/openai/langchain_openai/chat_models/codex.py)

## 8. Pros / cons

Pros: (1) real framework-level child tool allowlists and isolated-context mode; (2) optional ChatGPT-subscription OAuth path exists without an API key; (3) direct stdio MCP consumption for Jev.
Cons: (1) subagents are a separate Beta package with heavy hard deps (langchain + langgraph + provider SDKs) — more moving parts than Pi already has; (2) no Pi-native integration; parent control over delegation is prompt-mediated LLM choice, cancellation only via a LangGraph server; (3) real added overhead (middleware prompts, summarization calls, always-on general-purpose subagent) with unsupported experimental auth.

## Source-observed vs inference vs unknown

- Observed: versions/floors/licence/classifiers, dependency graph, subagent config surface, async server requirements, OAuth code paths, MCP stdio, tracing env vars.
- Inference: `_ChatOpenAICodex` is *functionally* usable for subscription auth but unsupported; a Pi↔Python worker bridge is technically feasible and entirely custom.
- Unknown: whether Pi's runtime can host a Python child process cleanly; tool-calling fidelity of `_ChatOpenAICodex` in agent loops; per-worker token caps; steady-state token overhead versus Pi's existing subagents.

## Sources

Kept: repo API metadata; `langchain_v1`/`langchain`/`core` pyprojects; langchain README; deepagents pyproject + README; docs.langchain.com subagents & async-subagents; codex.py + chatgpt_oauth.py + commit 6c2b70e; langchain-mcp-adapters README; LangSmith tracing doc.
Dropped: langchain-openai README (marketing-only, no auth detail); third-party `langchain-codex-plus` PyPI page (not first-party — used only as corroboration that subscription auth is out-of-band, excluded from claims).

## Gaps

No measured token/call overhead comparison; no evidence LangChain can authoritatively control a Pi session (Pi-as-brain integration is unproven); async-subagent cancellation requires infrastructure LangChain, not Pi, owns.
