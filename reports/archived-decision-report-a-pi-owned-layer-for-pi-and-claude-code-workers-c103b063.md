---
{
  "format": 1,
  "metadata": {
    "id": "archived-decision-report-a-pi-owned-layer-for-pi-and-claude-code-workers-c103b063",
    "title": "Decision report: a Pi-owned layer for Pi and Claude Code workers",
    "question": "What findings, alternatives and limitations does the historical investigation document about Decision report: a Pi-owned layer for Pi and Claude Code workers?",
    "scope": "Original Pi/tooling integration investigation: Decision report: a Pi-owned layer for Pi and Claude Code workers. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Decision report: a Pi-owned layer for Pi and Claude Code workers; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": "2026-09-27",
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
    "imported_at": "2026-11-04T21:30:37.325Z"
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
  "sourceDigest": "c103b06305c2c7758972bfe1e3717d71e9e0e00707f4b82d0beb03d729f65ceb",
  "proposalRevision": "99f707cd9110a2f3c70d9536793c278e392988e5c0e4655ff339f81122f8c3af"
}
---
# Decision report: a Pi-owned layer for Pi and Claude Code workers

Date: 2026-09-27. Eight DeepSeek Flash scouts assessed the requested candidates. Parent read all eight reports and independently inspected decisive Mastra, Microsoft and Claude documentation/source. No candidate selected, installed, executed or integrated. This report presents choices, not a migration decision.

## The architectural boundary that fits the request

`Pi main session → delegation adapter → actual Pi / Claude Code child process → compact result back to Pi`

The parent remains the planner and user interface. Worker tools, model authentication and sessions can remain with the actual worker runtime. The adapter must own task framing, per-task working directories, concurrency, stream parsing, result validation, process termination and recovery. It need not make any LLM calls itself.

None of the eight is an already-verified drop-in Pi extension. Mastra core is the closest TypeScript library for an in-process Pi extension. The Python candidates would normally be sidecars called by Pi. Dify/Flowise are separate platforms rather than an inside-Pi layer. These shapes preserve Pi as the interface, but differ greatly in operational burden.

## Why choose one rather than another?

| Candidate | Choose it if… | Do not choose it merely for… | Main integration burden |
|---|---|---|---|
| **Mastra core** | You want a TypeScript layer with existing command/process and workflow primitives, compatible with Pi's implementation language. | Claude model OAuth access: Mastra's Claude model provider is not the Claude Code runtime. Its entire Code SDK is unnecessary for simple CLI launching. | A Pi extension/adapter; translate task/result/events, set concurrency/recovery policy, verify kill behavior and telemetry settings. |
| **Microsoft Agent Framework** | You value its first-party Claude Agent SDK wrapper and a common typed agent/session/stream interface. | A generic CLI launch: it still needs a Pi bridge, and Python/core/SDK layers do not automatically reduce tokens or solve authentication. | Python sidecar; Pi-worker bridge; wall-clock/process supervision; validate Claude SDK auth for the intended use. |
| **LangGraph / LangChain** | You genuinely need durable multi-step graphs, checkpoints and controlled resumption across workers. | A few independent parallel workers: callable batching adds little process-management functionality itself. | Python subprocess nodes; process-tree kill, event mapping and side-effect-safe retries/resumption. |
| **CrewAI** | Typed event-driven Flows and human pauses are already part of the intended workflow. | Minimal single/parallel CLI workers: Flow execution still brings the larger package and default behavior to review. | Custom CLI runner plus dependency, memory and telemetry configuration; subprocess cancellation remains custom. |
| **Langflow LFX** | Human-authored/versioned flow artifacts are a desired product feature. | General coding-subagent supervision: a headless flow executor is not an existing Pi/Claude launcher. | Custom subprocess component plus supervision; flow/provider dependencies and startup cost. |
| **AutoGen Core** | An event/message-driven agent system is itself required, with routing/interposition hooks. | The smallest worker launcher: process spawn/kill/timeout are still adapter responsibilities; project is in maintenance mode. | Python runtime plus process adapter, stateful-agent concurrency and recovery handling. |
| **Dify** | An existing Dify deployment contains useful published apps you want Pi to call. | Local Pi/Claude Code workers: the direction of its documented coding-agent integration is primarily coding agents calling Dify apps. | Platform/server plus an external worker gateway if actual local CLIs are needed. |
| **Flowise** | You must interoperate with an already-deployed Flowise installation. | A new delegation foundation: the repository is archived and the inspected execution seams are server-coupled. | Server/DB and wrapper processes; custom lifecycle and maintenance ownership. |

For this particular request the meaningful trade-off is **Mastra's TypeScript process/workflow layer versus Microsoft's existing Claude SDK interface versus LangGraph's durable workflow state**. The other candidates have narrower reasons to pick them. This is a relevance assessment, not approval to adopt any of them.

## Source-verified distinctions

### Mastra core is not Mastra Code

The [Workspace README](https://github.com/mastra-ai/mastra/blob/main/packages/core/src/workspace/README.md) shows `LocalSandbox` and command execution. The [execute-command implementation](https://github.com/mastra-ai/mastra/blob/main/packages/core/src/workspace/tools/execute-command.ts) forwards timeout, cwd and an abort signal, with killed/timedOut fields in results.

These are reusable building blocks, not a complete Pi worker manager. Process-tree termination, SDK versions and combined behavior remain untested. Filesystem base paths/read-only tools must not be described as an OS sandbox for arbitrary subprocesses.

The scout inspected Mastra Code's Claude OAuth provider and found model-API access, not invocation of the Claude Code binary. Therefore the plausible Mastra path for **actual Claude Code** is core process execution of the real CLI, or an explicitly written SDK bridge—not merely selecting a Claude model in Mastra Code. Earlier discovery of a published Codex provider remains true but is unnecessary when Pi children retain their own provider access.

### Microsoft has an actual Claude Agent SDK wrapper

[`agent-framework-claude`](https://github.com/microsoft/agent-framework/tree/main/python/packages/claude) depends on the Claude Agent SDK. Its [agent implementation](https://github.com/microsoft/agent-framework/blob/main/python/packages/claude/agent_framework_claude/_agent.py) uses `ClaudeSDKClient` and exposes CLI-path/model/cwd configuration. This is materially different from a Claude chat-model connector.

No separate manager model is inherently required by this wrapper. That does **not** prove subscription eligibility or billing behavior. Package maturity is beta in the inspected manifest, and no installed-runtime test was made.

### Authentication requires care

The [Claude headless documentation](https://code.claude.com/docs/en/headless.md) explicitly says `--bare` does not use subscription login and requires an API key. Thus blindly using bare mode to reduce context would conflict with the no-new-API-billing requirement. Non-bare headless mode can also load project/user hooks and MCP configuration; the working directory is therefore part of the execution policy.

The [Claude Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview.md) directs developers to API-key authentication and says third-party products must not offer claude.ai login/rate limits without prior approval. This must not be flattened into either “SDK subscription reuse is guaranteed” or “every personal SDK invocation necessarily requires new billing.” The exact personal-use authentication path and applicable terms need verification before promising SDK-based subscription reuse.

Accordingly, scout claims of unconditional subscription/billing equivalence between raw CLI and SDK wrappers are not adopted. Directly invoking an installed, appropriately authenticated Claude Code CLI is the clearest documented subscription-oriented route to examine, without reading or copying its credentials.

### Framework control is not subprocess control

A graph cancellation token or node timeout does not automatically terminate a child process tree. Checkpoint replay can repeat side effects unless worker outcomes are recorded safely. MCP stdio support alone also does not create a coding-worker protocol. A wrapper can implement missing controls, so the reports' occasional “impossible” language is too strong; the correct question is how much implementation and maintenance remains.

## What no report established

- No comparative token/latency benchmark or reduction versus pi-subagents.
- No proven end-to-end Pi adapter for these candidates.
- No tested joint cancellation/resume/authentication behavior.
- No deterministic guarantee that a model performs exactly the requested task.

A code-only orchestration layer adds no mandatory manager-model calls. Token usage remains affected by inherited context, child turns/retries, tool descriptions, loaded project files and how much raw output returns to the parent. Dependency size is not token cost.

## Decision gates, if the user wants a next step

- **Mastra:** establish whether its process controls materially reduce the Pi adapter's code and lifecycle burden, without storage/memory or additional model loops.
- **Microsoft:** establish whether SDK-level structured events/session controls justify a Python sidecar over the direct Claude CLI; resolve the authentication assumption first.
- **LangGraph:** establish that crash recovery across multi-step workflows is actually required; otherwise the graph/checkpoint layer is likely unnecessary.

Any proof should compare the same tiny task and cancellation case, keep Jev parent-side, collect only concise results, and require explicit user approval for installation or live model calls. Nothing in this report authorizes such a proof.

## Artifacts

Individual decision cards are in each candidate's `report.md`. Shared official Claude documentation is in `shared/`; parent-checked source snapshots are in `evidence/`. The cards contain provisional opinions and some corrected overstatements; this synthesis governs the final comparison. Most upstream sources are moving branches. Runtime and cost claims remain unverified.
