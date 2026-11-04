---
{
  "format": 1,
  "metadata": {
    "id": "archived-personal-assessment-mastra-for-machine-concept-a8b97eaa",
    "title": "Personal assessment: Mastra for Machine_concept",
    "question": "What findings, alternatives and limitations does the historical investigation document about Personal assessment: Mastra for Machine_concept?",
    "scope": "Original Pi/tooling integration investigation: Personal assessment: Mastra for Machine_concept. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Personal assessment: Mastra for Machine_concept; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": "2026-09-27",
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
    "imported_at": "2026-11-04T21:30:36.788Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "transcript_dependency",
      "message": "Possible transcript-only evidence; review before publication."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "a8b97eaacb754bd7ca7e5e5887102071323d955da37dfad2e710af374b1a2903",
  "proposalRevision": "f4dd71e55ba5c679dbe32126b62ca43eaefc4e9c5dfb8009c71139ef7644aa55"
}
---
# Personal assessment: Mastra for Machine_concept

Date: 2026-09-27. Investigated directly by the parent assistant, not delegated. No candidate installed or executed; no engineering tests, model probes, credential reads or configuration changes.

## Bottom line

**Mastra core is a plausible foundation for a custom Pi delegation extension, not a ready-made simpler replacement for pi-subagents.** Its real value for Machine_concept is typed task coordination and process supervision. Its main cost is that we would still own the Pi integration, recovery, context selection, authentication environment and evidence handling.

For the current goal—main Pi session as brain, cheap bounded workers, occasional Claude Code—the fit is conditional. I would not migrate on feature-list evidence. The strongest reason to adopt it would be a demonstrated reduction in our actual delegation complexity without losing controls we already use. There is no measured token-saving result yet.

## What I inspected

Local instructions: root project policy already in context; `.pi/CONTEXT.md`; `.pi/SKILL_INDEX.md`; `SAFETY/chain_verification/CLAUDE.md`; `TOOLS/MESH_FEA/code_aster/CLAUDE.md`.

Upstream source pinned at Mastra commit **edc77fcd6897323d2d69e919148321edf07dfa84**: core package manifest, LocalSandbox, LocalProcessManager, process-handle/buffer logic, base process manager, workflow factory/types and telemetry implementation. Source snapshots are in `sources/`; revision metadata is in `revision.json`.

The npm registry returned stable `@mastra/core` **1.71.0**, Node **>=22.13.0**, with **30 direct runtime dependency entries**. Development-head code was inspected, not installed stable-package behavior; feature parity must be checked before choosing a release. Counts describe dependency entries, not installation size or token cost.

## Pros that are real for this repository

### 1. Pi could retain ownership and existing engineering modules could stay independent

Proposed topology:

`Pi main session → small Pi extension wrapping Mastra core → real Pi/Claude CLI worker → files + concise result`

Mastra need not own models or generate plans. Python domain modules would remain unchanged, communicating through existing machine files and contracts. TypeScript is appropriate for the Pi integration layer without rewriting CAD/FEA/PLC/safety logic in TypeScript.

The [workflow factory](https://github.com/mastra-ai/mastra/blob/edc77fcd6897323d2d69e919148321edf07dfa84/packages/core/src/workflows/create.ts) supports typed input/output schemas and composed steps; it does not require a separate LLM planner to construct a code-defined workflow.

### 2. Process controls are substantive, not only role prompts

The [local process manager](https://github.com/mastra-ai/mastra/blob/edc77fcd6897323d2d69e919148321edf07dfa84/packages/core/src/workspace/sandbox/local-process-manager.ts) creates a process group on Unix, exposes stdout/stderr streams and writable stdin, returns exit/timing information, and supports tree-directed termination. The [base manager](https://github.com/mastra-ai/mastra/blob/edc77fcd6897323d2d69e919148321edf07dfa84/packages/core/src/workspace/sandbox/process-manager/process-manager.ts) wires abort signals to handle termination.

That is useful for worker sessions and for commands that themselves launch Python or solver children. It is still not evidence of correct MPI/Code_Aster cancellation on this workstation. Timeout handling sends SIGTERM; explicit kill uses SIGKILL. I did not find a timeout-to-SIGKILL escalation in the inspected local handle, so a timeout must not be advertised as a tested hard deadline for arbitrary descendants.

### 3. Explicit ordering fits some engineering tasks

Machine_concept's chain-verification instructions require a particular evidence-production order. Code-defined sequencing could preserve that order while parallelizing independent read-only investigations. Typed results could carry machine/chain identifiers, changed artifact paths, commands run and unresolved evidence.

This is coordination, not new safety logic. The existing arithmetic/schema/conformance engines remain authoritative; agent text must not author their computed verdicts. The separation between PL achieved and PL required must remain intact.

### 4. Token control is possible without another model layer

The adapter can start fresh workers with selected module instructions, keep raw event/log streams out of the parent conversation, and return paths plus concise results. Mastra does not require manager-model calls for process execution. Jev can stay in the main Pi session, used selectively after evidence collection.

These savings would come from the chosen context/output policy—not from merely installing Mastra. They may also be achievable with the existing tooling.

## Cons and integration risks specific to Machine_concept

### 1. We would be replacing maintained integration with integration we maintain

Mastra does not supply the complete Pi-facing subagent interface. We would still implement or integrate:

- Pi tool registration and progress display;
- task framing and distinct Pi/Claude event parsers;
- compact final-result/error reporting;
- parent steering/cancellation semantics;
- model selection, environment handling and instruction handoff;
- concurrency policy and one writer per cwd/worktree;
- stale-process detection and restart/resume behavior.

A library's process primitive is not equivalent to those capabilities. The scope could expand into the custom orchestration framework the user wants to avoid.

### 2. Runtime environment forwarding is NOT automatic

[LocalSandbox](https://github.com/mastra-ai/mastra/blob/edc77fcd6897323d2d69e919148321edf07dfa84/packages/core/src/workspace/sandbox/local-sandbox.ts) documents and implements a default environment containing only PATH; other variables require explicit forwarding. The process manager sets `extendEnv: false`.

For Machine_concept, this means deliberate handling of HOME/config discovery, required provider variables, shared Python environment and Code_Aster profile setup. The project uses Code_Aster v18 via a specific conda profile and `run_aster`, not generic system Python or `as_run`. Launching Pi/Claude does not automatically prove their credential/config discovery works in the sandbox environment. Never solve this by indiscriminately copying secrets into task JSON.

### 3. Correct working directory is a functional requirement

`.pi/CONTEXT.md` says Pi children must start at repository root to discover the root project integrations. Starting a Pi worker in a module folder or default sandbox temp directory can lose project-local LSP/context packages even if the engineering command itself runs.

The adapter must distinguish the worker's project-root cwd from an individual shell command's module cwd. A working-directory setting is not file isolation. Keep the existing instruction-only protection policy; native sandboxing is optional and should not be enabled as an unrequested architectural change.

### 4. Solver evidence cannot live only in retained process output

The [process handle](https://github.com/mastra-ai/mastra/blob/edc77fcd6897323d2d69e919148321edf07dfa84/packages/core/src/workspace/sandbox/process-manager/process-handle.ts) uses a default 1 MiB retained-output limit with truncation tracking. That helps memory consumption but is not a complete log archive—and 1 MiB of text is still far too much to inject into a model casually.

CAD/meshing/FEA jobs need full logs and generated artifacts saved before output truncation. Exit zero alone does not establish successful verification; module-specific diagnostics and validators remain necessary. Cancelling a worker can leave incomplete output files, which must not later be mistaken for completed evidence.

### 5. Process recovery is not durable by default

LocalProcessManager explicitly tracks handles in memory. Workflow checkpointing and recovering an already-running OS child are different problems. If Pi crashes, neither a saved graph node nor a transcript automatically reconnects to a solver/process tree.

Automatic replay is risky where tasks write machine YAML, CAD files or final documents. Any recovery design must inspect current artifacts before retrying; it must not blindly rerun side-effecting workers or introduce a second authoritative backlog beside Beads.

### 6. Safety and normative correctness gain no automatic protection

Mastra's schemas can check task/result shape. They cannot determine correct normative editions, prove a safety function, authorize changing known machine-design gaps, or validate a render visually. The NORMATIVE catalog/MCP remains SSOT; chain-verification engines produce computed outcomes; the parent's evidence review and required user decisions remain unchanged.

Do not replicate engineering rules in workflow conditions just to obtain a green completion state. Do not parallelize ordered writers to the same chain or machine record.

### 7. Dependencies, telemetry and version management add work

Core is a general framework, not a tiny process helper. Its dependency count does not imply token overhead, but it does add an upgrade/compatibility surface. The [telemetry implementation](https://github.com/mastra-ai/mastra/blob/edc77fcd6897323d2d69e919148321edf07dfa84/packages/core/src/telemetry/posthog.ts) enables telemetry unless `MASTRA_TELEMETRY_DISABLED` is truthy and targets `https://us.posthog.com` when events are captured. This does not prove every import emits data or that project documents are sent, but an integration should explicitly disable unwanted telemetry before load.

Do not adopt Mastra Code SDK, automatic memory, vector storage, extra model routing, a dashboard or cloud hosting just to launch workers. Those are separate requirements, not necessary benefits for the present task.

## Relative fit by Machine_concept activity

| Activity | Potential value | Critical boundary |
|---|---|---|
| Parallel read-only electrical/PLC/mechanics scouts | Good process/result coordination | Explicit module context; no broad shared transcript |
| Ordered safety evidence tasks | Useful sequencing | Existing validators and canonical data remain authoritative |
| CAD/GMSH/Code_Aster jobs | Streams, stdin, process-tree controls | Environment, resource limits, full logs, partial outputs and cancellation need testing |
| Several coding agents writing concurrently | Limited without further glue | Worktree/cwd ownership is not supplied by generic process spawn |
| Reports and technical-document drafting | Can parallelize independent research | Evidence provenance and final editorial integration stay with parent |
| Smaller one-off coding tasks | Little demonstrated advantage | Framework/integration overhead may exceed benefit |

## My recommendation for the user's decision

**Consider Mastra core only as a narrowly scoped alternative process/delegation layer. Do not treat it as the new engineering orchestrator or a ready-made pi-subagents replacement.** Its strongest benefit here is controllable process execution in TypeScript; its weakest claim is automatic simplicity or lower token cost.

If the user chooses to pursue it, the acceptance test should precede migration: one Pi child with root project context, one authenticated Claude child, an isolated harmless child-process cancellation case, full log preservation, a parent-restart scenario and a same-task token/context comparison. Use scratch outputs; no real machine-data edits or solver-study modification during the proof. Installation and live model/engineering execution require separate explicit approval.

No such proof has been run. This report is source-based evaluation, not runtime certification or approval to change the setup.
