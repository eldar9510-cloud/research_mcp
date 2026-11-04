---
{
  "format": 1,
  "metadata": {
    "id": "archived-mastra-core-as-the-replacement-backend-for-pi-subagents-a647a69b",
    "title": "Mastra core as the replacement backend for pi-subagents",
    "question": "What findings, alternatives and limitations does the historical investigation document about Mastra core as the replacement backend for pi-subagents?",
    "scope": "Original Pi/tooling integration investigation: Mastra core as the replacement backend for pi-subagents. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Mastra core as the replacement backend for pi-subagents; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:34.083Z"
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
  "sourceDigest": "a647a69bf0c134caacf2b85e6e6aa29c2c358c30ea77dcd6957378e4c37fe1a2",
  "proposalRevision": "521b3a3eb306c3453777b37f7b099028b09e8e1ef694496adb1fa3dd7a40115a"
}
---
# Mastra core as the replacement backend for pi-subagents

## Objective and execution boundary

The user explicitly wants Mastra to replace pi-subagents, not remain a second permanent delegation layer. Pi stays the primary UI/planner. **Latest scope: Pi workers only; no Claude integration for now. Mastra core must remain unmodified.** This is source research only: no Mastra installation, model request, configuration change, engineering execution, or removal of pi-subagents.

This report corrects earlier research that concentrated on Workspace/process wrappers and missed the core background-task system and agent-sdks packages. Installing a library still does not itself register tools or lifecycle hooks in Pi.

## Inspected revisions

- GitHub repository: https://github.com/mastra-ai/mastra
- Main commit: `edc77fcd6897323d2d69e919148321edf07dfa84`, core manifest `1.72.0-alpha.4`.
- Published npm latest at inspection: `@mastra/core@1.71.0`.
- Official GitHub release tag `@mastra/core@1.71.0` resolves through annotated tag `b3b8ce966d4051b478823afbe63ce8c29b8218ae` to commit **`6721bffd7eb2ab00df5494817d870db3b540698d`**.
- Core manifest requires Node `>=22.13.0`, declares Apache-2.0 and 30 direct dependencies. The inspected installed Node 22.23.2 meets this requirement.
- Snapshots: `sources/` for main, `stable-sources/` for the selected stable-release files; revision/tag/registry metadata adjacent to this report.
- Main and stable have substantive differences. Do not substitute main-only behavior for released behavior. The library-mode background-task test and SubAgent interface inspected here are byte-identical at both revisions.

## Findings verified in stable-release source

### Core contains a reusable scheduler, not just process launch utilities

`@mastra/core/background-tasks` supplies `BackgroundTaskManager` and `createBackgroundTask`. The handle dispatches, waits, cancels, resumes and restarts tasks. It accepts an executor implementation supplied by application code. The manager exposes task lookup/listing and lifecycle/output streaming.

Sources:
- [createBackgroundTask](https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/background-tasks/create.ts)
- [manager](https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/background-tasks/manager.ts)
- [configuration/types](https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/background-tasks/types.ts)

The manager has global/per-agent concurrency limits, queue/reject/fallback backpressure options, timeouts and configurable retries. Observed defaults include 10 global and 5 per-agent concurrent tasks, 5-minute timeout and queue backpressure; these defaults are not automatically suitable for engineering jobs.

### No HTTP server or supervisor LLM is required

The repository includes explicit **library-mode tests** constructing a Mastra instance and dispatching fake executors without a model, `mastra dev`, HTTP server, or explicit initial `startWorkers()` call. Tests cover initial concurrent dispatch, suspension/resumption, lazy worker startup and shutdown races.

This is upstream test-source evidence, not a test run performed here.

- [library-mode tests](https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/background-tasks/library-mode.test.ts)

A native parent Mastra Agent is one optional consumer of this infrastructure, not a necessary replacement for the Pi planner.

### No separate database is required for an ephemeral first implementation

The Mastra constructor defaults to `InMemoryStore`; observability defaults to `NoOpObservability` if not supplied. This permits embedded task execution without LibSQL, DuckDB or a traces dashboard.

**Important limitation:** the source explicitly warns that the default store loses all state on restart and is not suitable for production durability. This is not evidence of crash-recovery parity with persistent pi-subagents runs. Durable task records, process reattachment and transcripts are distinct requirements.

- [constructor, storage and observability](https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/mastra/index.ts#L1566-L1631)

### Core defines an external-runtime-compatible subagent interface

`SubAgent` is explicitly a minimal interface for lighter-weight implementations without the full native Agent class. It requires identity, description/model/memory/instructions methods, generate/stream and resume methods. This is a legitimate extension boundary for external runtimes; it is not itself an implementation of a Pi worker.

- [SubAgent interface](https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/agent/subagent.ts)

Application executors dispatched through the background task manager need not become full native Mastra model agents merely to launch an external worker.

### Cancellation is cooperative unless the executor supplies stronger process control

Manager cancellation updates task state, aborts active execution, cancels the internal workflow and sends lifecycle notifications. It does not by itself prove arbitrary external process descendants have exited. The bridge must propagate cancellation to the real runtime and test process-tree cleanup.

Resume/restart documentation explicitly says executor closures are not rehydrated from stored task records. Recovery requires re-registration/static executors and a policy for repeated side effects.

- [cancellation and resume contract](https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/background-tasks/manager.ts#L385-L479)

## Dedicated external-agent packages, verified on main — deferred

These findings predate the user's Pi-only scope clarification. They do not justify installing Claude/ACP packages for the current integration.

These live under **agent-sdks/**, not packages/core. Core alone does not bundle their implementations.

- [`@mastra/acp`](https://github.com/mastra-ai/mastra/tree/edc77fcd6897323d2d69e919148321edf07dfa84/agent-sdks/acp): `AcpAgent`, tool wrapper and an ACP connection that starts an executable over stdio. Connection source inherits `process.env` plus explicit overrides, unlike the previously inspected LocalSandbox default environment policy. It supports session cancellation; disconnect calls child-process kill. This is not proof of recursive descendant termination, timeout escalation or sandbox isolation.
- [`@mastra/claude`](https://github.com/mastra-ai/mastra/tree/edc77fcd6897323d2d69e919148321edf07dfa84/agent-sdks/claude): `ClaudeSDKAgent`; source delegates to `query()` from the actual Claude Agent SDK and forwards sdkOptions/abort control. It is not merely an Anthropic model adapter. Subscription/auth compatibility still requires separate verification.
- The complete inspected tree contains agent-sdks packages for ACP, Claude, Cursor and OpenAI; no dedicated Pi package was found in that directory. This is not a claim that no community Pi adapter exists elsewhere.

The earlier registry check reported ACP 0.4.1 and Claude 0.3.1. Do not assume their release behavior is identical to main snapshots without checking the selected installation versions.

## Proposed replacement boundary — not an implemented integration

```
Pi main session (only planner/UI)
  -> Pi-facing extension: tool registration, context/auth policy, results/events
       -> Mastra core: background tasks, queue/concurrency, status, cancellation, workflows
            -> Pi executor/bridge (actual Pi child runtime; existing Pi authentication)
```

This would replace pi-subagents as the delegation implementation, not call pi-subagents underneath. Mastra provides the scheduling machinery; there is no need to invent a second bespoke scheduling framework or manager LLM.

Still needed at the Pi boundary: tool/API registration; agent-definition loading/model mapping; explicit project-root/module handoffs; wake/completion integration; durable transcripts/artifacts; actual worker auth; optional worktree ownership; cancellation/process cleanup; and a deliberate persistence/recovery policy. The size of that adapter has not been measured or prototyped.

GitHub is a monorepo with build scripts and dist-based package exports. Inspecting source on GitHub is not the same as installing the monorepo root as a ready-made Pi extension. An implementation should pin compatible released packages unless there is an explicit reason to build a particular revision.

## Validation status

- Checked official GitHub tree, main and stable package manifests, stable task-manager API/implementation and library-mode test source.
- Read connector implementation snapshots on main.
- No packages installed; no upstream tests executed; no end-to-end integration or subscription probe performed.
- No measured token/cost reduction. Removing an extra supervisor avoids introducing that model call, but does not establish savings over the current single-planner setup.
- The read-only scout returned an agent-controller/harness report, but pi-subagents incorrectly marked the research run failed because an inferred implementation acceptance check expected edits. No implementation retry is warranted. Output: `/home/eldar/.pi/agent/sessions/--media-eldar-disk_2-Machine_concept--/subagent-artifacts/800d440e-5946-482d-b283-ae9792608461_luna_0_output.md`.
- Parent confirmed the core manifest has no public `agent-controller/tools` export. The scout's controller-specific limitations must not be generalized to core's separate public background-task/executor API, verified above. The proposed replacement does not depend on private controller imports or modifying Mastra.
