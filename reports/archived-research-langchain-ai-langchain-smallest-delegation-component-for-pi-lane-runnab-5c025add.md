---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-langchain-ai-langchain-smallest-delegation-component-for-pi-lane-runnab-5c025add",
    "title": "Research: langchain-ai/langchain — smallest delegation component for Pi (lane: Runnable/agent/tool primitive + minimal LangGraph companion; code-directed bounded workers; Codex OAuth status)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: langchain-ai/langchain — smallest delegation component for Pi (lane: Runnable/agent/tool primitive + minimal LangGraph companion; code-directed bounded workers; Codex OAuth status)?",
    "scope": "Original Pi/tooling integration investigation: Research: langchain-ai/langchain — smallest delegation component for Pi (lane: Runnable/agent/tool primitive + minimal LangGraph companion; code-directed bounded workers; Codex OAuth status). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: langchain-ai/langchain — smallest delegation component for Pi (lane: Runnable/agent/tool primitive + minimal LangGraph companion; code-directed bounded workers; Codex OAuth status); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:34.997Z"
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
  "sourceDigest": "5c025addef5ec5aa2f7a36bd1a5e3ceaaf9c43897dfb599e94bdbae541e8f7ef",
  "proposalRevision": "1c40c63d419c7732197139bcd386e5c859640b73ef0f3f24b682d48036882d2f"
}
---
# Research: langchain-ai/langchain — smallest delegation component for Pi (lane: Runnable/agent/tool primitive + minimal LangGraph companion; code-directed bounded workers; Codex OAuth status)

## Summary
Refreshed inspection of `master` shows a real correction to the earlier scout framing: bounded, code-directed workers **do** exist inside this repository without Deep Agents — `langchain-core`'s `Runnable`/`RunnableConfig` contract (deterministic `.batch(max_concurrency=…)`), `create_agent(name=…)` plus first-party `ModelCallLimitMiddleware`/`ToolCallLimitMiddleware`, and a `SubagentTransformer` that surfaces nested named agents on `run.subagents`. The smallest genuinely reusable primitive is therefore `langchain-core` alone, but it is a Python interface/concurrency convention with ~10 transitive deps, adding little Pi does not already own. **Verdict: CONDITIONAL** — usable as a narrow bounded-worker component, poor fit as a delegation-layer replacement.

## Findings
1. **Identity (fact, partially inherited).** `langchain-core` 1.6.5 and `langchain` 1.4.2, both MIT, `requires-python >=3.10.0,<4.0.0`, classifier `Production/Stable`. [core pyproject](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/core/pyproject.toml), [langchain_v1 pyproject](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain_v1/pyproject.toml). Archive status not re-verified this run (inherited from prior GitHub API check).
2. **Smallest reusable primitive (fact).** `langchain-core` provides `Runnable` (`invoke/batch/stream` + `a*`) and `RunnableConfig` keys `tags, metadata, callbacks, run_name, max_concurrency, recursion_limit (default 25), configurable, run_id`; `get_executor_for_config` builds a `ThreadPoolExecutor(max_workers=config["max_concurrency"])`. So deterministic parallel fan-out is one line: `.batch(tasks, config={"max_concurrency": N})`. [runnables/config.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/core/langchain_core/runnables/config.py). Deps: langsmith, httpx, tenacity, jsonpatch, PyYAML, typing-extensions, packaging, pydantic, uuid-utils, langchain-protocol — no dashboard/DB/server. **Correction to my own prior assumption (fact): Python `RunnableConfig` has *no* `timeout` or `signal` key** (`CONFIG_KEYS` list); per-child timeouts must come from the caller (e.g. `asyncio.wait_for`) or provider client timeouts. The JS `@langchain/core` config does list `timeout`/`signal` — different repo, not transferable.
3. **Smallest agent, no Deep Agents (fact/inference).** `langchain.agents.create_agent(model, tools, *, middleware, response_format, checkpointer, name, transformers, …)` has **no `subagents=` parameter**; `name=` binds `lc_agent_name`, and the returned graph is `.with_config({"recursion_limit": 9_999, "metadata": {"ls_integration": "langchain_create_agent", …}})` — i.e. iteration bounding must be overridden explicitly per call. [factory.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain_v1/langchain/agents/factory.py). `langchain` hard-depends on `langgraph>=1.2.11,<1.3.0` (langgraph 1.2.12, MIT; deps langchain-core, langgraph-checkpoint/sdk/prebuilt, xxhash, pydantic — in-memory checkpointing suffices, no server). [langgraph pyproject](https://raw.githubusercontent.com/langchain-ai/langgraph/main/libs/langgraph/pyproject.toml). Inference: a Pi child would be wrapped as `RunnableLambda`→`pi` subprocess, or as a tool over a child graph; wholly custom glue.
4. **Bounded workers / progress / cancellation (fact).** First-party `ModelCallLimitMiddleware(thread_limit=, run_limit=, exit_behavior="end"|"error")` hard-caps model calls per run and either jumps to end or raises `ModelCallLimitExceededError`; `ToolCallLimitMiddleware` is analogous; both exported from `langchain.agents.middleware`. [model_call_limit.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain_v1/langchain/agents/middleware/model_call_limit.py), [middleware/__init__.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain_v1/langchain/agents/middleware/__init__.py). Progress: `SubagentTransformer` promotes nested `lc_agent_name` runs to typed `run.subagents` handles exposing `name` and `cause` (originating tool call), requires langgraph ≥1.2.4. [\_subagent_transformer.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/langchain_v1/langchain/agents/_subagent_transformer.py). Cancellation: no config-level cancel in Python; LangGraph relies on asyncio task cancellation with `durability` semantics, and an open PR reports cancellation records not persisted under `durability="exit"` — treat cancellation as partial/observation. [PR 8634](https://github.com/langchain-ai/langgraph/pull/8634). Extra LLM/context overhead: middleware prompts + `SummarizationMiddleware` internal calls; no measured numbers here.
5. **Codex subscription (fact).** `_ChatOpenAICodex` remains private and self-declares "Experimental and unofficial" (warning emitted on construction), pinning `https://chatgpt.com/backend-api/codex`, `use_responses_api=True, store=False, streaming=True`; `chatgpt_oauth.__all__` exposes `login_chatgpt` (PKCE loopback, port 1455) and `login_chatgpt_device` (RFC 8628 device code). Token store `~/.langchain/chatgpt-auth.json` deliberately separate from `~/.codex/auth.json` because refresh rotation "can break Codex CLI / VS Code sessions". [codex.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/partners/openai/langchain_openai/chat_models/codex.py), [chatgpt_oauth.py](https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/partners/openai/langchain_openai/chatgpt_oauth.py). `bind_tools` is not overridden → tool-calling fidelity inside agent loops is **unknown**. DeepSeek: first-party `ChatDeepSeek` reading `DEEPSEEK_API_KEY`; `langchain` 1.4.2 declares a `deepseek` extra — existing credential reuse is plausible (inference, no new billing). ZAI: **no `zai` extra** in the 1.4.2 optional-dependency list → no first-party ZAI provider; would need community/third-party or OpenAI/Anthropic-compatible `base_url` (unverified). [deepseek docs](https://docs.langchain.com/oss/python/integrations/chat/deepseek).
6. **Jev (recommendation).** Keep parent-side; nothing in this repo requires Jev to be embedded. The previously verified MCP path is the separate `langchain-mcp-adapters` package; `langchain` 1.4.2's optional `mcp` extra (fastmcp) surface was not verified here.
7. **Telemetry/privacy (fact).** `langsmith` is a hard dependency of `langchain-core` (installed regardless); `create_agent` always attaches `ls_integration` metadata; tracing needs explicit opt-in env vars. The Codex path sends `originator: langchain` so OpenAI attributes calls to this package (overridable via `LANGCHAIN_CODEX_ORIGINATOR`). OAuth refresh/access tokens are persisted in plaintext `~/.langchain/chatgpt-auth.json`.

## Pros / cons
Pros: (1) genuinely small, code-directed worker controls now exist in-repo — `max_concurrency` fan-out, `run_limit`/`thread_limit` caps, typed `run.subagents` progress, no Deep Agents or server required; (2) existing DeepSeek credentials are reusable and the Codex-subscription OAuth flow (incl. headless device code) is implemented in code.
Cons: (1) any agent-shaped worker drags `langchain`+`langgraph`+provider packages, and even the minimal `langchain-core` primitive adds ~10 transitive deps plus mandatory `langsmith` for behavior Python stdlib/Pi already covers; (2) no Pi integration at all, no Python-side per-run cancel/timeout in `RunnableConfig`, `create_agent`'s 9,999 default recursion limit removes meaningful iteration bounding unless overridden, and the Codex model path is explicitly unofficial.

**Conclusion: CONDITIONAL** (replacement-level fit remains poor). Biggest unresolved fact: whether Pi can be launched as a child process/headless worker preserving its own auth, tools and skills — no evidence in this repository; unverified ⇒ the adapter shape in finding 3 stays proposed, not validated.

## Sources
Kept: core/langchain pyprojects, runnables/config.py, agents/factory.py, `_subagent_transformer.py`, middleware `__init__`, model_call_limit.py, codex.py, chatgpt_oauth.py, langgraph pyproject + PR 8634, langchain-deepseek docs. Dropped: star/issue counts, marketing README text, third-party Z.ai community integrations (not first-party).

## Gaps
No measurement of token/context overhead vs Pi's existing subagents; Pi-as-child feasibility unproven; `_ChatOpenAICodex` tool-calling and ToS/account risk unresolved; ZAI compatibility path unverified; `langchain` `mcp` extra purpose unverified.
