---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-microsoft-agent-framework-microsoft-agent-framework-maf-0f536d2e",
    "title": "Research: microsoft/agent-framework (Microsoft Agent Framework, MAF)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: microsoft/agent-framework (Microsoft Agent Framework, MAF)?",
    "scope": "Original Pi/tooling integration investigation: Research: microsoft/agent-framework (Microsoft Agent Framework, MAF). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: microsoft/agent-framework (Microsoft Agent Framework, MAF); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:35.697Z"
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
  "sourceDigest": "0f536d2e11b923dc354f1145e828ae34c2df614e4d3fac0b2f1b0c1584c6f7a5",
  "proposalRevision": "1544ab498838c320c91bafd5774294a4805ba50eb6d59c44c8fce109f7c34bb2"
}
---
# Research: microsoft/agent-framework (Microsoft Agent Framework, MAF)

Retrieval timestamp: 2026-09-26 (UTC). All facts below are from first-party GitHub API/raw files at `main` or Microsoft Learn, retrieved in this session.

## 1. Identity, license, activity (observed)
- Repo `microsoft/agent-framework`, MIT, created 2025-04-28, `pushed_at` 2026-09-25T19:09:24Z, default branch `main`, language Python, ~13.8k stars / 686 open issues. [repo metadata](https://api.github.com/repos/microsoft/agent-framework)
- Latest release: `dotnet-1.22.0` (published 2026-09-18); Python tags run through `python-1.19.0`. Python core declares `Development Status :: 5 - Production/Stable`, version 1.19.0, `requires-python >=3.10`. [release](https://github.com/microsoft/agent-framework/releases/tag/dotnet-1.22.0), [core pyproject](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/core/pyproject.toml)
- **Corrections to user-table claims:** this is **not** an npm/JS package. Distribution is PyPI (`agent-framework-*`) and NuGet (`Microsoft.Agents.AI*`); Go lives in a *separate* repo `microsoft/agent-framework-go`. Azure layers (Foundry hosted agents, Durable Task extension) are optional add-ons, not local requirements. Release notes show recurring `[BREAKING]` items, so "production/stable" ≠ stable API surface.

## 2. True primitive and minimal Pi integration path (observed + inferred)
- Primitive: a **Python/.NET SDK library** (`pip install agent-framework-core`; `dotnet add package Microsoft.Agents.AI`), plus optional server/hosting packages and a DevUI for debugging. It is not a CLI, daemon, MCP server, or Pi extension. [README](https://raw.githubusercontent.com/microsoft/agent-framework/main/README.md)
- Minimal path: **external worker** — Pi's existing shell/worker capability launches a MAF Python script per task. No MAF-specific Pi integration is built-in. Any deeper integration (native Pi extension wrapping MAF, or MCP wrapper) would be a **hypothetical custom adapter** and is unproven.
- Caution: `pip install agent-framework` is the meta-package that pulls `agent-framework-core[all]` (~30 extras: foundry, azure, chatkit, bedrock, mem0, redis, devui…). Token/install-efficient use means core + one provider package only. (same pyproject)

## 3. Codex subscription/OAuth vs API key (observed — this is the decisive gap)
- **Not established:** no first-party Codex/ChatGPT-subscription auth path exists. Microsoft closed feature issue #4370 ("Add OpenAI Codex SDK integration (agent-framework-codex)") on 2026-05-22 with a maintainer comment: "since `openai-codex` does not exist (yet), closing this." No `codex` directory exists in `python/packages` or `dotnet/src` listings, and no `python-codex` tag exists. [issue 4370](https://github.com/microsoft/agent-framework/issues/4370)
- OpenAI provider auth is API-key based (`OPENAI_API_KEY` / `api_key=` via `OpenAIChatClient`); Foundry/Azure routes use Entra ID or Azure keys. API compatibility with the OpenAI wire format does **not** establish subscription support. [OpenAI provider docs](https://learn.microsoft.com/en-us/agent-framework/agents/providers/openai)
- The **only** subscription-backed provider evidenced is GitHub Copilot (`agent-framework-github-copilot` / `Microsoft.Agents.AI.GitHub.Copilot`): a **GitHub Copilot** subscription with Copilot CLI credentials, not Codex/ChatGPT. It also hands the tool-calling loop to the Copilot CLI rather than the framework. [github_copilot README](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/github_copilot/README.md)
- Inference: MAF cannot reuse the existing openai-codex subscription auth. Under the hard constraints, model access would come from already-configured OpenAI-compatible providers (DeepSeek Flash/ZAI) if `base_url`-style overrides are supported — **unknown**, not verified in this pass.

## 4. Token/context/LLM-call overhead sources (observed; no benchmarks fabricated)
- Core runtime deps are modest: msgspec, typing-extensions, pydantic, python-dotenv, opentelemetry-api, pyyaml, regex. `mcp>=1.24,<2` is an **optional extra**, not a core dependency. [core pyproject](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/core/pyproject.toml)
- LLM-token overhead sources: per-agent `instructions`/prompt composition, function-tool JSON schemas resent each turn, Agent Skills content injection, middleware, and declared orchestration patterns (sequential/concurrent/handoff/group-chat/magentic) that add extra manager/agent hops and re-send context per hop. [README](https://raw.githubusercontent.com/microsoft/agent-framework/main/README.md)
- Non-token overhead: checkpoints persist workflow + executor state (in-memory, file, or Cosmos), and OTel spans are emitted. No framework-level "token cap" primitive was verified in this pass — **unknown**.

## 5. Parent/worker control and failure recovery (observed)
- Deterministic *topology*: `WorkflowBuilder` with executors and edges; checkpointing rehydrates and resumes a workflow from a checkpoint ID; approvals support human-in-the-loop and long-running pauses. Python offers `InMemoryCheckpointStorage`, `FileCheckpointStorage`, `CosmosCheckpointStorage`. [checkpoints](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints)
- Tool allowance: MCP tools accept `allowed_tools` and `approval_mode="always_require"`; .NET 1.22.0 adds per-tool `AgentModeProvider` controls. [using MCP tools](https://learn.microsoft.com/en-us/agent-framework/user-guide/model-context-protocol/using-mcp-tools), [release notes](https://github.com/microsoft/agent-framework/releases/tag/dotnet-1.22.0)
- Cancellation: Python is asyncio-based with async context managers; resume-from-checkpoint is the documented recovery path. Note the framework's own caveat that changing executor names invalidates checkpoints.
- **Key distinction:** graph edges are deterministic; agent behavior is not. Group-chat/magentic patterns make control flow LLM-driven. No deterministic LLM obedience can be promised.

## 6. Jev MCP compatibility (observed)
- Direct **stdio MCP client support is built in**: `MCPStdioTool(command=..., args=..., env=..., allowed_tools=..., approval_mode=...)` spawns a local MCP server and loads its tools/prompts; .NET has `Microsoft.Agents.AI.Mcp`. So a Jev MCP stdio server can attach with **no custom bridge** — but the server config must be duplicated in MAF code (Pi's own MCP registration is not reused), and `mcp` is an extra dependency. [using MCP tools](https://learn.microsoft.com/en-us/agent-framework/user-guide/model-context-protocol/using-mcp-tools)

## 7. Privacy/telemetry defaults (observed)
- Instrumentation is OpenTelemetry-based with **no exporter configured by default** — nothing leaves the process unless you wire a collector. Default spans carry metadata (operation names, durations, token counts); raw message/tool payloads require explicit sensitive-telemetry opt-in. Recipient is therefore whatever OTLP/App Insights endpoint you configure (samples use localhost Aspire). [observability sample README](https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/observability/README.md)
- Hosted/Foundry paths and third-party providers send data to those services; the README explicitly assigns data-flow responsibility to the app author.

## 8. Pros / Cons
**Pros:** (1) MIT, Microsoft-maintained, monthly releases, broad provider coverage; (2) real durability primitives — checkpointing/resume, approvals, deterministic graph topology; (3) native MCP stdio client, so Jev-style servers attach without a bridge.
**Cons:** (1) no Codex/ChatGPT-subscription auth — model access means API keys, Azure/Entra, or a separate GitHub Copilot subscription; (2) heavyweight versus "simpler than pi-subagents": ~7 core deps but a 30-extra meta-package, plus orchestration patterns that duplicate planning the main Pi session already owns; (3) not a Pi-native primitive — integration is an external Python worker or a custom adapter you would have to build and maintain.

## 9. Verdict
**POOR FIT** (confidence: high on auth/integration facts; medium on exhaustiveness of the "no Codex integration" search). Biggest blocker: no evidenced Codex-subscription/OAuth credential path and no Pi-native integration — satisfying the hard constraints would require building a custom external-worker adapter whose value over pi-subagents is mostly redundant orchestration. It would become **CONDITIONAL** only if (a) the worker runs against already-configured DeepSeek/ZAI OpenAI-compatible endpoints (base_url support unverified), and (b) checkpointed graph workflows are genuinely wanted despite the added dependency and adapter burden.

## Sources
- Kept: [repo metadata API](https://api.github.com/repos/microsoft/agent-framework) — license/activity ground truth; [README](https://raw.githubusercontent.com/microsoft/agent-framework/main/README.md) — packages, providers, hosting layers; [core pyproject.toml](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/core/pyproject.toml) — dependency footprint; [issue #4370](https://github.com/microsoft/agent-framework/issues/4370) — Codex integration status; [github_copilot README](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/github_copilot/README.md) — only subscription-auth provider; [checkpoints docs](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints) and [MCP tools docs](https://learn.microsoft.com/en-us/agent-framework/user-guide/model-context-protocol/using-mcp-tools) — control/recovery; [observability sample](https://github.com/microsoft/agent-framework/blob/main/python/samples/02-agents/observability/README.md) — telemetry defaults.
- Dropped: DevBlog/YouTube intros and third-party adapter `JKToolKit.CodexSDK` — non-first-party or promotional; not used as evidence.

## Gaps
- No verified primitive for per-run LLM-call/turn/token caps, nor a measured token-overhead comparison against pi-subagents (prohibited from live probes).
- `OpenAIChatClient` `base_url`/custom-endpoint override support not verified from source.
- Did not exhaustively grep all 47 `dotnet/src` and 41 `python/packages` entries; "no Codex integration" rests on the maintainer comment, missing `codex` dirs, and absent tags.
