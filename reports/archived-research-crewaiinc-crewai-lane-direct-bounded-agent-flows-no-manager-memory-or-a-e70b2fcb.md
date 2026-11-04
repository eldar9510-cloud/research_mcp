---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-crewaiinc-crewai-lane-direct-bounded-agent-flows-no-manager-memory-or-a-e70b2fcb",
    "title": "Research: crewAIInc/crewAI (lane: direct bounded Agent / Flows — no manager, memory, or app platform)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: crewAIInc/crewAI (lane: direct bounded Agent / Flows — no manager, memory, or app platform)?",
    "scope": "Original Pi/tooling integration investigation: Research: crewAIInc/crewAI (lane: direct bounded Agent / Flows — no manager, memory, or app platform). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: crewAIInc/crewAI (lane: direct bounded Agent / Flows — no manager, memory, or app platform); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:34.433Z"
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
  "sourceDigest": "e70b2fcb15b18efea285c3c154e7dc5d0e7259a2ec3204e150641b6227ace72f",
  "proposalRevision": "acbda6d57edb6c6eaaca6b2605c1bf7269ff7a6e9022ecb3582dc0b86e692b0b"
}
---
# Research: crewAIInc/crewAI (lane: direct bounded Agent / Flows — no manager, memory, or app platform)

## Summary
CrewAI 1.15.22 does hold a small reuse surface: `Agent.kickoff()` is documented in source as "standalone agent execution without requiring a Crew", and the Flow runtime imports neither `crewai.crew` nor `crewai.agent`. But all of it ships inside the heavy `crewai` package and nothing reuses Pi's auth. Verdict: **CONDITIONAL**.

## Findings
1. **Identity (fact, 2026-09-26)** — MIT, Python, `archived:false`, created 2023-10-27, pushed 2026-09-26, branch `main`, package version 1.15.22. [api.github.com/repos/crewAIInc/crewAI](https://api.github.com/repos/crewAIInc/crewAI)
2. **Smallest reusable component** — Not `crewai-core`: it is only version/paths/telemetry/printer, no executor ([pyproject](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai-core/pyproject.toml)). The unit is the `crewai` package (`Agent.kickoff()`, `Flow`). Mandatory, not extra: chromadb, lancedb, tokenizers, instructor, pdfplumber, opentelemetry-*, `mcp~=1.28.1`, aiosqlite, plus `crewai-cli` (pulls uv, textual, rich, cryptography) — [lib/crewai](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/pyproject.toml), [lib/cli](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/cli/pyproject.toml). No dashboard/DB/server needed for local runs (inference). Import nuance (fact): `import crewai` eagerly imports Agent/Crew/Task/LLM/Knowledge; only `Memory`→lancedb is lazy ([__init__.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/__init__.py)).
3. **Adapter shape (proposed, not built-in; no Pi extension/embedding exists in-repo)** — Pi spawns a child Python process: one `Agent` + `agent.kickoff(messages, response_format=<pydantic model>, input_files=...)` → `LiteAgentOutput{raw, pydantic, usage_metrics, messages, plan, todos, tool_failures}`, printed as JSON on stdout ([agent/core.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/agent/core.py), [lite_agent_output.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/lite_agent_output.py)). Unknown: having CrewAI run *Pi* as a child with Pi's auth/tools/skills — no mechanism exists; it would need a custom `BaseTool` shelling out to `pi` (unverified).
4. **Autonomy vs a tiny runner** — `kickoff()` avoids Crew, manager LLM and delegation loops (fact). Residual overhead (fact): `respect_context_window=True` default summarizes (extra LLM calls); `max_iter=20`, `max_retry_limit=2`, `guardrail_max_retries=3` defaults; `max_execution_time` (seconds) times out via `future.cancel()`/`asyncio.wait_for` — best-effort only (inference: a running thread is not truly stopped). Flows: `@start/@listen/@router`, parallel starts via `asyncio.gather`, racing-listener first-wins cancellation, `Flow.ask(timeout=...)`; no whole-flow cancel contract found (unknown) ([flow/runtime](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/flow/runtime/__init__.py), [flows docs](https://raw.githubusercontent.com/crewAIInc/crewAI/main/docs/edge/en/concepts/flows.mdx)).
5. **Providers** — Native SDKs: OpenAI, Anthropic, Gemini, Azure, Bedrock, Snowflake; "all other providers are powered by LiteLLM" (optional `crewai[litellm]`), which is how DeepSeek appears; generic escape hatch is `custom_openai=True, base_url=..., api_key=...` or `OPENAI_BASE_URL` ([llms.mdx](https://raw.githubusercontent.com/crewAIInc/crewAI/main/docs/edge/en/concepts/llms.mdx), [providers listing](https://api.github.com/repos/crewAIInc/crewAI/contents/lib/crewai/src/crewai/llms/providers)). No `ChatGPT`/subscription/OAuth anywhere in docs or provider dirs. So DeepSeek/ZAI reuse via **existing API keys** is plausible (LiteLLM path or OpenAI-compatible base_url); **Codex subscription is not established** (not disproven); Pi session-auth reuse: none (fact/unknown).
6. **Jev / MCP** — `mcp/` contains only client-side modules (client.py, config.py, tool_resolver.py, filters.py, transports; no server module) → client-only (inference). Keep Jev parent-side; embedding it in a CrewAI child adds a second unattended TypeSafe client ([mcp contents](https://api.github.com/repos/crewAIInc/crewAI/contents/lib/crewai/src/crewai/mcp)).
7. **Telemetry/privacy** — Opt-out, on by default: disabled only by `OTEL_SDK_DISABLED`/`CREWAI_DISABLE_TELEMETRY`/`CREWAI_DISABLE_TRACKING`; OTLP posts to `https://telemetry.crewai.com:4319/v1/traces`. Ungated payload: crew-input *presence*, task/agent counts, model_name, tool names, iterations, fingerprints, and `detect_coding_agent(...)` host-identity. Prompts/backstories/outputs are gated behind `share_crew` (default false). Flow-only runs also emit spans ([crewai-core/telemetry.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai-core/src/crewai_core/telemetry.py), [crewai/telemetry.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/telemetry/telemetry.py), [telemetry.mdx](https://raw.githubusercontent.com/crewAIInc/crewAI/main/docs/edge/en/telemetry.mdx)).

## Pros / Cons
+ A real bounded primitive exists: `Agent.kickoff()` needs no Crew, manager, or memory, and returns structured output with per-call token usage.
+ Flows give deterministic Python scheduling (parallel starts, router, first-wins, state) as glue around one or two LLM calls.
− No subscription/OAuth path: a child needs an API key (new-billing risk unless existing DeepSeek/ZAI creds are reused) and cannot inherit Pi's auth/tools/skills.
− Reaching `kickoff()` or Flow installs the whole framework (chromadb, lancedb, otel, uv/textual CLI), with opt-out telemetry that reports coding-agent identity.

## Conclusion
**CONDITIONAL** — changed from the prior report's POOR FIT *for this lane only*: the LiteAgent/`kickoff()` path and standalone Flows genuinely avoid Crew autonomy overhead, but only inside a heavyweight Python sidecar. Biggest unresolved fact: whether any Codex-subscription authentication path exists at all. No install, clone, or execution; adapter untested.
