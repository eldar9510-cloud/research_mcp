---
{
  "format": 1,
  "metadata": {
    "id": "archived-pi-delegation-alternatives-eight-candidate-assessment-94abc4fd",
    "title": "Pi delegation alternatives: eight-candidate assessment",
    "question": "What findings, alternatives and limitations does the historical investigation document about Pi delegation alternatives: eight-candidate assessment?",
    "scope": "Original Pi/tooling integration investigation: Pi delegation alternatives: eight-candidate assessment. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Pi delegation alternatives: eight-candidate assessment; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": "2026-09-26",
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
    "imported_at": "2026-11-04T21:30:35.442Z"
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
  "sourceDigest": "94abc4fd70fb9f340b1797ab34929ec5238cb2601091d6391c4db53b9e446f5d",
  "proposalRevision": "bb6e36f194a9bc9f282f1ce59b564804b5aa73d70d5333e71d2a6149cbdce7a3"
}
---
# Pi delegation alternatives: eight-candidate assessment

Research date: 2026-09-26. Decision scope: replacing pi-subagents while retaining Pi as the interface and the main Pi session as planner. User priorities: simplicity, low token overhead, bounded workers, no new API-billing requirement, existing Codex subscription access, optional advisory Jev.

## Recommendation

**Do not migrate to any of these eight now.** None was established as a ready-made, simpler Pi delegation replacement that preserves the existing provider/authentication setup. This is an integration finding, not a claim that these frameworks are bad or incapable of bounded workers.

**Mastra is the most plausible integration candidate**, because it is TypeScript and can expose agents/workflows through MCP. But its clean reuse of Pi's Codex authentication is unverified, and it adds an application framework/process rather than removing machinery. **Prime Agent is the clearest subscription-enabled alternative harness**, but adopting its standard runtime changes the interface/runtime and configuration/session stores, contrary to the current requirement.

For the stated goal, the lower-risk next step is to simplify how the current Pi delegation layer is used: parent-selected workers, fresh minimal task context, single/parallel execution only, concise results, and no optional autonomous coordination features unless needed. This is a proposed next step, not an assertion that pi-subagents is optimal or that its current settings were changed by this research.

## Comparison

| Candidate | Useful strengths | Main drawbacks for this setup | Decision |
|---|---|---|---|
| [LangChain](https://github.com/langchain-ai/langchain) | Rich tool ecosystem; isolated subagent patterns in the separately maintained Deep Agents layer; MCP adapters; experimental Codex OAuth code exists. | Layered dependencies and additional adapter work; LangChain, LangGraph and Deep Agents are not one interchangeable component; subscription integration is explicitly experimental/unofficial. | Poor fit for a minimal replacement. |
| [CrewAI](https://github.com/crewAIInc/crewAI) | Code-driven Flows; configurable iteration/tool limits; stdio MCP client. | Crews add roles, optional managers/planning and delegation loops; Python integration layer; telemetry is opt-out; Codex subscription route not established in this assessment. | Poor fit; particularly mismatched to reducing coordination overhead. |
| [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) | Agents-as-tools preserve parent ownership; code orchestration, turn limits and structured run state; experimental Codex CLI tool; stdio MCP. | Python integration required; Codex tool is not a verified general subscription-backed SDK model provider; tracing needs attention. | Sound primitives, but no demonstrated simpler Pi replacement. |
| [Google ADK](https://github.com/google/adk-python) | Explicit workflow scheduling, concurrency/retry/checkpoint support; non-LLM nodes; stdio MCP; cloud deployment is optional. | Separate Python runtime/event integration; no verified existing-Codex-auth path; workflow machinery exceeds the present requirement. | Poor fit unless durable application workflows become the goal. |
| [Mastra](https://github.com/mastra-ai/mastra) | TypeScript; explicit workflows; step/stop/abort controls; MCP client and server offer the clearest Pi-facing connection. | Additional framework and credential plumbing; framework-level reuse of Pi Codex auth remains unverified; telemetry and enterprise-only areas need explicit review. | Conditional; best candidate for a narrowly scoped future integration proof, not an installation recommendation. |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) | Explicit graphs, checkpoint/resume, MCP stdio; optional rather than mandatory Azure hosting. | Python/.NET integration, new lifecycle/state layer; no verified Codex-subscription provider in inspected sources; full meta-package can pull many extras. | Poor fit for a lightweight Pi worker layer. |
| [Prime Agent](https://github.com/PrimeIntellect-ai/prime-agent) | Codex subscription login; RLM subagents; intermediate data can remain in kernel state instead of model context; MCP. | Normal operation uses its own TUI/daemon/session workers/Python kernels and `~/.prime` state. Reuse inside existing Pi is not established. | Not under current constraints: a harness migration, not a demonstrated pi-subagents swap. |
| [AutoGen](https://github.com/microsoft/autogen) | AgentChat/Core separation; deterministic scheduling options, termination/cancellation/state; stdio MCP. | Explicit maintenance mode; custom Python bridge needed; context-heavy conversational patterns; no verified Codex subscription integration. | Do not adopt for new work here. |

## Important distinctions and corrections

### Authentication and billing

API compatibility is not Codex subscription authentication. Conversely, an API-key-based framework does **not** automatically require a new billing account: some can potentially use already-configured DeepSeek/ZAI credentials. Neither case establishes direct reuse of Pi's model/session/authentication machinery.

- LangChain's `_ChatOpenAICodex` explicitly calls itself **experimental and unofficial**. This is real OAuth-related source, not a production-support guarantee. [Source](https://github.com/langchain-ai/langchain/blob/master/libs/partners/openai/langchain_openai/chat_models/codex.py)
- Prime documents ChatGPT Plus/Pro login and a separate `~/.prime/agent/auth.json`. That satisfies subscription access in principle, but not unchanged Pi integration. [Source](https://github.com/PrimeIntellect-ai/prime-agent/blob/main/packages/coding-agent/docs/providers.md)
- Mastra Code advertises ChatGPT OAuth and uses `pi-tui`; it is a separate coding-agent application. Sharing a UI library does not make it a Pi extension. Reusable OAuth support in a minimal Mastra worker remains unverified. [First-party announcement](https://mastra.ai/blog/announcing-mastra-code)
- The OpenAI Agents SDK's experimental Codex subprocess tool is not equivalent to a general Codex-backed model provider for all SDK agents. Its code-orchestration and agent-as-tool patterns nevertheless support parent-owned coordination; a second LLM manager is **not mandatory**. [Orchestration documentation](https://github.com/openai/openai-agents-python/blob/main/docs/multi_agent.md)

### Determinism and token efficiency

No framework makes an LLM reliably obey arbitrary instructions exactly. Deterministic scheduling can control which child starts, its allowed tools/context, how results are collected, and when execution stops. Correctness still requires an explicit task/result contract and appropriate validation.

No comparative workloads were run. There is **no evidence here for a numerical token-saving claim** or an overall cost ranking. Installation size is not token cost. Relevant mechanisms include repeated histories, prompt/tool-schema size, manager calls, child conversation length, retries, summarization, and verbose results. Those can often be reduced without migrating frameworks.

Frameworks also need not force a second planner: several support code-driven scheduling and bounded worker calls. Their disadvantage here is the added integration and lifecycle machinery, not an unavoidable autonomous-manager requirement.

### Jev

Jev does not determine the choice. The inspected candidates expose MCP support either directly or through companion packages. Parent verification additionally confirmed OpenAI Agents SDK's `MCPServerStdio`, which its scout had left unverified. [Source](https://github.com/openai/openai-agents-python/blob/main/docs/mcp.md)

**Simplest arrangement: leave Jev in the main Pi session.** The parent may request a bounded judgment after receiving child evidence. There is no need to give every worker Jev access, duplicate its credential configuration, or make extra TypeSafe calls by default. MCP transport support alone does not validate a particular end-to-end Jev workflow.

### Material corrections to the supplied comparison table

- AutoGen's README says **maintenance mode**, not an archived repository. [Source](https://github.com/microsoft/autogen/blob/main/README.md)
- CrewAI's inspected telemetry implementation is **opt-out**, not opt-in. Commercial integration code does not by itself make its cloud product mandatory. [Source](https://github.com/crewAIInc/crewAI/blob/main/lib/crewai-core/src/crewai_core/telemetry.py)
- Mastra's core is Apache-2.0, but repository `ee/` areas have a separate enterprise license; a blanket repository-wide Apache assertion misses that distinction. [Source](https://github.com/mastra-ai/mastra/blob/main/LICENSE.md)
- Language floors/version labels in the table are not reliable current-state evidence; the scouts found newer package metadata. Stars, maturity labels and generic “enterprise security” claims were not used to choose a solution.

## Proposed minimal operating model

1. Pi main session decides task decomposition and integration.
2. A child receives one scoped task, fresh task-specific context, relevant paths/tools, and an explicit result format.
3. No child-to-child planning or recursive delegation unless specifically requested.
4. Parent collects a compact result and opens detailed evidence only when needed.
5. Parent owns review, Beads updates when tracking is requested, and optional Jev judgments.
6. Before changing orchestration software, measure a few representative tasks: total/cached input, output, model calls, elapsed time, retries and success. Compare equivalent contracts rather than framework popularity.

Within the eight-candidate scope, this assessment supports **simplifying the existing Pi workflow first**, and keeping Mastra only as a conditional alternative if a small proof can preserve authentication and demonstrate a real benefit. No ninth candidate was researched.

## Evidence and limits

Eight independent DeepSeek-v4-Flash scouts inspected the assigned repositories and official linked sources. Reports are in `langchain/`, `crewai/`, `openai-agents/`, `google-adk/`, `mastra/`, `microsoft-agent-framework/`, `prime-agent/`, and `autogen/`, each named `report.md`. The parent read all reports and independently checked decisive sources; snapshots are in `evidence/` (initial retrieval metadata in `evidence/manifest.json`).

The individual reports are preliminary research artifacts, not authoritative runtime verdicts. This synthesis corrects overstatements about compulsory extra planners/billing, LangChain requiring Deep Agents for every possible worker pattern, and unverified OpenAI stdio support. Most sources were fetched from moving default branches, so development-head features may not be in a published release. No candidate was installed, no live integration/authentication probes or comparative benchmarks were run, and no credentials/project documents were sent to the candidate services. Public GitHub/official documentation was retrieved; the research agents used the already-configured DeepSeek provider.
