---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-crewaiinc-crewai-as-a-simpler-token-efficient-replacement-for-pi-subage-46895520",
    "title": "Research: crewAIInc/crewAI as a simpler, token-efficient replacement for pi-subagents (Pi as planner)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: crewAIInc/crewAI as a simpler, token-efficient replacement for pi-subagents (Pi as planner)?",
    "scope": "Original Pi/tooling integration investigation: Research: crewAIInc/crewAI as a simpler, token-efficient replacement for pi-subagents (Pi as planner). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: crewAIInc/crewAI as a simpler, token-efficient replacement for pi-subagents (Pi as planner); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:35.583Z"
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
  "sourceDigest": "468955205acf196107a16aa57308e1b36a06ad162d3c1dfbf7f36fceaab386cb",
  "proposalRevision": "717f7561bcc336c263b6203b443222576ec7ecf9fd7a11d14a4031c2b4d17d7b"
}
---
# Research: crewAIInc/crewAI as a simpler, token-efficient replacement for pi-subagents (Pi as planner)

## Summary
CrewAI is an MIT-licensed **Python** agent framework (library + `crewai` CLI), not a Pi-native tool: integrating it means running a Python worker process/script that Pi spawns, not embedding an extension. Its own defaults work against your goals — role-based Crews are autonomy-oriented (manager-LLM routing in hierarchical mode, `allow_delegation` LLM tool calls), and anonymous telemetry is **on by default** and posts OTLP traces to `telemetry.crewai.com`. Direct evidence for ChatGPT/Codex *subscription* auth does not exist; the declared OpenAI path is an API-key SDK. Verdict: **POOR FIT**, biggest blocker = no established subscription-auth path plus heavyweight, token-hungry autonomy semantics.

## Findings
1. **Identity/activity (observed 2026-09-26)** — `crewAIInc/crewAI`, MIT (`license.spdx_id: mit`), Python, created 2023-10-27, `pushed_at: 2026-09-26T06:24:42Z`, not archived, default branch `main`. It is a uv monorepo (`crewai`, `crewai-tools`, `crewai-cli`, `crewai-core`, `crewai-files`, `devtools`) with a separate commercial control plane (CrewAI AMP, free tier exists) — so "open source framework" is accurate but "no commercial dependency" is not: `crewai-core` ships `plus_api.py`, `auth/`, `user_data.py`, and a ~7.6 MB `platform_catalog.py`. [GitHub API metadata](https://api.github.com/repos/crewAIInc/crewAI), [crewai-core contents](https://api.github.com/repos/crewAIInc/crewAI/contents/lib/crewai-core/src/crewai_core)
2. **True primitive / minimal Pi path** — *built-in*: a Python package with console entry point `crewai = crewai_cli.cli:crewai`; *unproven*: any Pi extension or in-process embedding (none observed; Pi-side integration would be a **hypothetical custom adapter**). Realistic path = Pi spawns an **external worker** (`crewai run` or a small Python script) and parses files/stdout; state and results travel through files because there is no Pi↔Crew context bridge. Requires `Python >=3.10,<3.14` and heavy deps (chromadb, lancedb, tokenizers, opentelemetry, instructor). [lib/crewai/pyproject.toml](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/pyproject.toml)
3. **Codex subscription/OAuth: not established** — declared dependency is `openai>=2.30.0,<3` (Platform API-key SDK); hierarchical docs example uses `manager_llm="gpt-4o"`; issue reports show `OPENAI_API_KEY` being expected as the auth mechanism. An optional `litellm>=1.84.0,<2` extra exists, and upstream LiteLLM does add a `chatgpt/` OAuth provider, so subscription use via LiteLLM is *plausible but unverified inside CrewAI's wrapper* (CrewAI does its own token counting/function-calling negotiation). Say **not established, not impossible** — OpenAI API compatibility does not imply subscription support. [lib/crewai/pyproject.toml](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/pyproject.toml), [crewAI issue #3934](https://github.com/crewAIInc/crewAI/issues/3934)
4. **Token/context/LLM-call overhead sources (no fabricated benchmarks)** — (a) required `role`/`goal`/`backstory` are injected into prompts on every step; (b) hierarchical process adds a manager LLM that assigns and validates tasks ("delegation is now disabled by default… hierarchical requires `manager_llm` or `manager_agent`"); (c) `Crew(planning=True)` adds a planning call per iteration; (d) `allow_delegation=True` turns collaboration into extra LLM tool-call loops; (e) `respect_context_window=True` (default) triggers summarization calls; (f) memory/knowledge use embedding + retrieval calls against chromadb/lancedb, and `share_crew`/memory persist; (g) defaults `max_iter=20`, `max_retry_limit=2` permit long loops. [hierarchical-process.mdx](https://raw.githubusercontent.com/crewAIInc/crewAI/main/docs/edge/en/learn/hierarchical-process.mdx), [concepts/agents.mdx](https://raw.githubusercontent.com/crewAIInc/crewAI/main/docs/edge/en/concepts/agents.mdx)
5. **Parent/worker control and recovery** — enforceable knobs are bounded: `max_iter` (20), `max_retry_limit` (2), `max_rpm`, `max_execution_time` (both unset by default), tool lists, `tool_filter` on MCP, `step_callback`, task guardrails/`human_input`, plus Flows (`@start/@listen/@router`) for deterministic Python control. That is *tool allowance and iteration capping*, not deterministic model behaviour: in Crews the manager/agents still choose decomposition and phrasing, and delegation can route work away from where the parent intended. Failure handling is defensive (MCP connection failure is logged and the agent continues; telemetry failures are swallowed; SIGINT/SIGTERM handlers flush telemetry), but there is no documented hard cancellation/kill contract for a running crew shipped to the parent — **unknown**. [concepts/agents.mdx](https://raw.githubusercontent.com/crewAIInc/crewAI/main/docs/edge/en/concepts/agents.mdx), [telemetry.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/telemetry/telemetry.py)
6. **Jev MCP compatibility** — CrewAI is a mature MCP **client**: `mcp~=1.28.1` is a core dependency and the docs document `MCPServerStdio` (`command`/`args`/`env`), SSE and Streamable HTTP, plus `MCPServerAdapter` with `tool_filter` allow/block lists. A stdio Jev server could attach to crew agents **without a custom bridge** — but it would be a second, agent-invoked Jev connection inside a child process (extra TypeSafe requests, unattended) rather than Pi's advisory usage; whether CrewAI can *host* a crew as an MCP server is unverified. [MCP overview](https://docs.crewai.com/en/mcp/overview)
7. **Privacy/telemetry defaults (explicitly opt-out)** — telemetry is enabled unless `OTEL_SDK_DISABLED`, `CREWAI_DISABLE_TELEMETRY`, or `CREWAI_DISABLE_TRACKING` is truthy; spans export OTLP-HTTP to the **trace payload recipient** `https://telemetry.crewai.com:4319/v1/traces`. Default payload includes agent **roles**, task keys/counts, LLM model names, tool names, delegation flags, OS/CPU, `project_id` read from `pyproject.toml`, runtime context, and the detected **AI coding assistant running the process** (`detect_coding_agent`) — a host-identity leak relevant when Pi launches the child. `share_crew=True` (opt-in) additionally sends goals, backstories, task descriptions, context, crew inputs and task outputs. [crewai_core/telemetry.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai-core/src/crewai_core/telemetry.py), [telemetry/constants.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/telemetry/constants.py)

## Pros
1. MIT, actively maintained, large ecosystem; no CrewAI account or billing needed for local OSS runs (AMP is optional).
2. Flows give genuinely deterministic, Python-native sequencing/state — usable as bounded step control around LLM calls.
3. Best-in-class MCP client support (stdio/SSE/HTTP, tool filters), so external tools like Jev need no adapter work.

## Cons
1. No established Codex-subscription/OAuth path; default OpenAI integration assumes a Platform API key (new billing risk).
2. Default-on third-party telemetry (including detected coding-agent identity) unless explicitly disabled — fails a "no new external data flows" reading.
3. Token-heavy by design (role/goal/backstory prompts, optional manager LLM, planning, delegation loops, memory) and a large Python sidecar — the opposite of "simpler, token-efficient", with crew autonomy weakening parent-owned planning.

## Sources
- Kept: GitHub API repo metadata (https://api.github.com/repos/crewAIInc/crewAI) — license/activity/archived status.
- Kept: lib/crewai/pyproject.toml, crewai-core contents listing — primitive, entry point, provider deps, commercial client code.
- Kept: crewai_core/telemetry.py, crewai/telemetry/constants.py, crewai/telemetry/telemetry.py — opt-out defaults, endpoint, payload contents.
- Kept: docs/edge/en/learn/hierarchical-process.mdx, docs/edge/en/concepts/agents.mdx — manager LLM, delegation default, iteration/limit defaults.
- Kept: docs.crewai.com/en/mcp/overview — MCP transports and tool filtering.
- Dropped: search summaries and third-party blogs (LiteLLM PR/issue threads) — used only as secondary context, no first-party evidence.
- Dropped: README marketing/claims sections — non-evidentiary.

## Gaps
- No direct proof either way for Codex-subscription auth inside CrewAI's LLM wrapper; would need a code-level read of `lib/crewai/src/crewai/llm*` (not fetched here) or a live probe (out of scope).
- Cancellation/kill semantics for an in-flight crew, and whether Flows can fully sandbox a Crew, are unverified.
- Whether CrewAI can be exposed as an MCP server (relevant if Pi wanted to call it as a tool) — unverified.
- No local verification of dependency weight or token usage was possible (read-only, no installs, no model calls).

## Verdict
**POOR FIT** under these constraints. Biggest blocker: no established openai-codex subscription/OAuth path (would reintroduce API billing) combined with autonomy-first, token-heavy Crews and default-on telemetry to a third-party collector. Flows + MCP are the only genuinely attractive, bounded pieces, and they do not justify adopting the framework as the delegation layer. Confidence: medium-high on telemetry/deps/structure (direct source evidence); medium on the auth conclusion (absence of evidence, not disproven).
