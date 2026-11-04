---
{
  "format": 1,
  "metadata": {
    "id": "archived-lightweight-pi-delegation-second-candidate-pass-8bff4412",
    "title": "Lightweight Pi delegation: second candidate pass",
    "question": "What findings, alternatives and limitations does the historical investigation document about Lightweight Pi delegation: second candidate pass?",
    "scope": "Original Pi/tooling integration investigation: Lightweight Pi delegation: second candidate pass. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Lightweight Pi delegation: second candidate pass; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": "2026-09-26",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi research bundle",
      "author": "unknown",
      "model": "DeepSeek Flash scouts; original parent model unknown"
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
    "imported_at": "2026-11-04T21:30:34.196Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "8bff4412da1152caf32d70d9738ee88584bfd6a14a6740643fc5050c1e625d7f",
  "proposalRevision": "2e537d0ede33e1eb08c2837a507290103867857648d20a3786855553966149c5"
}
---
# Lightweight Pi delegation: second candidate pass

Research date: 2026-09-26. Eight independent scouts completed using `deepseek/deepseek-flash`, one per requested candidate. The parent read all eight reports, verified decisive primary sources, and checked Pi's installed JSON-mode documentation. Research only: no candidate selected, installed, executed or integrated; no configuration changes.

## Main result

The component-level investigation is more useful than comparing whole frameworks. **Mastra Code SDK and Langflow's LFX are concrete reusable artifacts**, not merely visual applications. Microsoft Agent Framework, LangChain, CrewAI and AutoGen also have narrower worker primitives than their complete orchestration platforms. None has yet been demonstrated as an end-to-end minimal Pi replacement or measured to reduce tokens.

## Comparison

| Candidate | Smallest identified useful component | Advantage | Cost / unresolved question |
|---|---|---|---|
| Microsoft Agent Framework | `agent-framework-core` plus a provider package; one agent or explicit executor graph | No mandatory dashboard/DB; iteration, duration and function-call controls; checkpoint support | Python/.NET adapter and its lifecycle; Codex integration PR inspected by scout was unmerged; whether the extra layer earns its complexity remains unclear |
| LangChain | `langchain-core` Runnable batching, or `create_agent` with call-limit middleware and LangGraph | Explicit concurrency and call bounds; Deep Agents is not mandatory for bounded workers | Python dependency layer; experimental/unofficial Codex provider; timeouts/cancellation need careful integration |
| CrewAI | Standalone `Agent.kickoff()` or Flow | No Crew/manager required; structured results and usage | Still distributed in the broad CrewAI package; default-on telemetry; Codex authentication not established |
| Dify | Existing deployment's Service API or MCP app endpoint | Easy to call if a Dify deployment already exists | Server/platform stack rather than a small executor; modified license; underlying provider auth remains separate |
| Langflow | `lfx` / `lfx run` | Headless, stateless flow execution, stdout results, no Langflow database needed | Python/provider dependencies; external process supervisor needed; no verified Codex subscription connector |
| Flowise | Components package; graph execution remains coupled to server in inspected evidence | Many integrations and nodes | Repository archived; no demonstrated standalone supported worker executor; component reuse still leaves orchestration to implement |
| AutoGen | One `AssistantAgent` from AgentChat plus Core and a model client | No group chat/manager/UI required; results, cancellation and optional context bounds | Maintenance mode; custom Python adapter; Codex auth not established; stateful instances cannot simply be shared across concurrent calls |
| Mastra | `@mastra/core` agents/workflows and published `@mastra/code-sdk` provider/headless entry points | TypeScript; genuine Codex OAuth code; bounded headless runner; MCP exposure possible | Full Code SDK boot includes storage/memory/workers; separate auth integration; alpha artifacts inspected; minimal import/runtime path remains untested |

## Important corrections and stronger evidence

### Mastra: earlier authentication gap is partly resolved

The earlier report had not established a published reusable Codex adapter. This pass found and the parent independently verified:

- [`@mastra/code-sdk` package manifest](https://github.com/mastra-ai/mastra/blob/main/mastracode/sdk/package.json): describes the agent core behind Mastra Code, excluding its TUI, and exports subpaths.
- [Codex provider source](https://github.com/mastra-ai/mastra/blob/main/mastracode/sdk/src/providers/openai-codex.ts): explicitly uses ChatGPT Plus/Pro OAuth, supports injectable auth storage, and targets the Codex backend.
- [Published provider declarations, version 1.8.4-alpha.3](https://cdn.jsdelivr.net/npm/@mastra/code-sdk@1.8.4-alpha.3/dist/providers/openai-codex.d.ts): the provider is present in a published package, not merely a proposed feature.
- [Headless entry point](https://github.com/mastra-ai/mastra/blob/main/mastracode/sdk/src/headless/index.ts): scout identified `runMC` with turn/time bounds, abort handling and structured results.

This establishes a credible component candidate without requiring a TUI migration. It does **not** establish that Pi's existing auth store can be reused safely, that a minimal worker avoids SDK storage/memory startup, that all requested models work through it, or that it saves tokens. Those require further source inspection and, with permission, a bounded integration probe. Credential paths must not simply be shared between independent refresh-token managers.

### Langflow: LFX is distinct from the visual builder

The [LFX README](https://github.com/langflow-ai/langflow/blob/main/src/lfx/README.md) documents a stateless CLI using `NoopSession`, with no `langflow.db`, and local `lfx run` execution. Its `lfx-mcp` command is different: it connects to a running Langflow instance. Do not confuse headless execution with a requirement to deploy the entire UI/server.

LFX executes configured flow artifacts; it does not automatically supply Pi's coding tools, skills, provider authentication or subagent supervision. Exact minimal provider bundles, dependency/startup costs and cancellation behavior remain untested. The scout's categorical wording about subscription impossibility is not adopted here: support was not established, which is different from impossible.

### Flowise and Dify: table corrections verified

- [Flowise repository API](https://api.github.com/repos/FlowiseAI/Flowise) returned `archived: true`; the parent verified this directly. That is a maintenance risk, not proof that no fork or external support can exist.
- [Dify LICENSE](https://github.com/langgenius/dify/blob/main/LICENSE) adds multi-tenant and frontend branding conditions to Apache-2.0. Dify's TypeScript-heavy repository statistics do not describe its Python backend runtime. Its HTTP client is not a standalone executor.

## Pi can itself run as the child

Several scouts correctly left Pi-specific behavior outside their evidence. The parent resolved the basic question from installed Pi 0.84.2 `docs/json.md`: **`pi --mode json "Your prompt"` emits session/tool/message events as JSON lines** for integration into other tools.

This supports a conceptual alternative integration boundary: a small runner could launch Pi children and collect events, retaining Pi as the agent runtime instead of transplanting provider/tool logic into a framework. It does not prove any shortlisted project already implements that bridge, nor cover process-tree cancellation, credential-refresh concurrency, environment isolation, recovery or token savings. Wrapping Pi in another LLM-driven manager would undermine the intended minimal design.

## Authentication, Jev and efficiency

- Existing DeepSeek/ZAI credentials can potentially be reused through compatible provider clients; API-key support does not automatically imply a new billing account. Compatibility with the user's exact configured endpoints was not tested.
- Codex subscription support is separate from generic OpenAI API support. Mastra's published adapter and LangChain's experimental adapter have source evidence; Pi-store reuse remains a different question.
- Jev can remain entirely parent-side in the existing Pi MCP configuration. No candidate needs a second Jev client or credential copy merely to run workers.
- No comparative token benchmarks were run. A dependency-heavy package need not consume extra model tokens, while a tiny autonomous loop can consume many. Measure input/output/cache usage, model calls, retries, task success and elapsed time under equivalent task contracts.
- Deterministic execution order, tool/context bounds and stop conditions are possible. No framework guarantees deterministic LLM obedience.

## Options for the user's decision

1. **Inspect Mastra's minimal SDK worker path next.** Strongest TypeScript/subscription evidence; unresolved storage/auth/lifecycle overhead.
2. **Inspect LFX next if flow-artifact workers are acceptable.** Clear headless boundary; not automatically a coding-subagent replacement.
3. **Inspect a core-only Python worker candidate** (MAF, LangChain, CrewAI or AutoGen) if a Python adapter is acceptable and its controls offer a concrete advantage.

These are options, not an installation or migration decision. The user retains the choice. No further work is authorized by this report itself.

## Artifacts and limitations

Each candidate has a `report.md` in its named subdirectory. These are preliminary scout artifacts: this synthesis corrects their categorical absence claims, speculative code-size estimates, confusion between package weight and token cost, and Pi-as-child uncertainty. Parent-verified source snapshots are in `evidence/`. Moving branch sources may describe unreleased behavior. No installs, package execution, live provider probes, candidate benchmarks, private credential reads or configuration changes occurred.
