---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-mastra-as-piworker-coordinator-core-spawns-cli-vs-code-sdk-owns-workers-a96aafbc",
    "title": "Research: Mastra as Pi↔worker coordinator — core-spawns-CLI vs code-sdk-owns-workers",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: Mastra as Pi↔worker coordinator — core-spawns-CLI vs code-sdk-owns-workers?",
    "scope": "Original Pi/tooling integration investigation: Research: Mastra as Pi↔worker coordinator — core-spawns-CLI vs code-sdk-owns-workers. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: Mastra as Pi↔worker coordinator — core-spawns-CLI vs code-sdk-owns-workers; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:37.883Z"
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
  "sourceDigest": "a96aafbc18ffa5467f3f595d7effc6418fdd556c3623be6d9e13218536ce9fd4",
  "proposalRevision": "c211095b53840221b2e64c6fefc2bf34624a6786dee8a66b68ce66c992e11fae"
}
---
# Research: Mastra as Pi↔worker coordinator — core-spawns-CLI vs code-sdk-owns-workers

## Summary
**CHOOSE (conditional): `@mastra/core` used as a thin subprocess adapter that Pi spawns — worker = the real `claude`/`pi` CLI. REJECT `@mastra/code-sdk` owning workers.** Code SDK contains *no* Claude Code integration: its Anthropic path (`claude-max.ts`) is Messages-API model access with OAuth tokens, beta headers and a hardcoded Claude Code identity string — model/Max OAuth masquerading as the Claude Code runtime. `@mastra/core` alone can exec, bound, stream and kill worker processes with no DB, memory, server or model call.

## Decision card
1. **Smallest package/topology.** Single package `@mastra/core` (peer dep `zod`) + subpath `@mastra/core/workspace`: `Workspace` + `LocalFilesystem` (basePath/readOnly) + `LocalSandbox`; programmatic `sandbox.executeCommand(cmd, [], {timeout, cwd, abortSignal})`. Pi main (brain/interface) → adapter step (no LLM in the exec path) → worker child (`pi --mode json …`; separately the real `claude` CLI). [README](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/core/src/workspace/README.md)
2. **Support classification.** *Pi worker:* CLI launch is a custom bridge but trivial (the Pi side is documented: `pi --mode json` emits JSON events; pi-subagents already supports external-CLI agents). *Claude Code worker:* documented only via the actual CLI (`claude -p`, `--output-format stream-json`, `--json-schema`, `--permission-mode`, `--max-turns`, `--resume`); the Agent SDK is also "a library that runs the Claude Code binary". Inside Mastra: **CLI = documented, Agent SDK = not used, model API only = observed** — `@mastra/code-sdk` exports `claude-max.ts`, which calls `createAnthropic()` with `Authorization: Bearer <oauth token>`, `OAUTH_REQUIRED_BETAS`, and `"You are Claude Code, Anthropic's official CLI for Claude."`; it has no `spawn`/`execa`/CLI path, and `@anthropic-ai/claude-agent-sdk` is absent from its deps. [claude-max.ts](https://raw.githubusercontent.com/mastra-ai/mastra/main/mastracode/sdk/src/providers/claude-max.ts) · [code-sdk package.json](https://raw.githubusercontent.com/mastra-ai/mastra/main/mastracode/sdk/package.json)
3. **Why choose (2 advantages).** (a) Real cancellation/streaming wrapper rather than bare exec: timeout (seconds), `context.abortSignal`, result `{exitCode, success, executionTimeMs, killed, timedOut}`, transient stdout/stderr events, and background `processes.spawn` → PID/`wait()`/`onExit` with retained-output byte caps — the "process wrapper need" is largely built-in. [execute-command.ts](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/core/src/workspace/tools/execute-command.ts) (b) Auth/billing stays with the user: workers are the genuine CLIs, so subscription login and Pi-owned credentials are reused with **no new API billing** and no Anthropic Messages-API spend.
4. **Why not (2 costs).** (a) Core is not dependency-free: it declares `execa`, `posthog-node` (telemetry on by default unless `MASTRA_TELEMETRY_DISABLED`), `hono`/`hono-openapi`, `ws` and many `@ai-sdk/*` provider packages; Node ≥22.13. [core package.json](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/core/package.json) (b) Code SDK costs much more and still gives nothing for Claude Code: heavy deps (`libsql`, `pg`, `duckdb`, `stagehand`, `fastembed`, `posthog-node`, `@mastra/memory`, `execa`), default boot creating LibSQL store/vector/memory and starting workers (prior-report finding, not re-verified here), Node ≥22.19.
5. **Hard blockers / conditional assumptions.** Documented: `--bare` "doesn't use your subscription login" and "never reads OAuth credentials or the system keychain" — it needs `ANTHROPIC_API_KEY`. So subscription reuse ⇒ launch non-bare `claude -p` with the user's existing login. Conditional: CLI installed/logged in; Pi child finds its own Pi-owned credential store when launched by a non-Pi parent (**unverified seam**); no second refresh-token manager must race the same OAuth credential. [headless](https://code.claude.com/docs/en/headless)
6. **Glue responsibilities.** *Built-in:* zod step schemas; cwd isolation (`LocalFilesystem.basePath`, `LocalSandbox.workingDirectory`, `readOnly`); timeout/abort/kill; background handles; workspace tools `execute_command`/`get_process_output`/`kill_process`; worker-side NDJSON (`--mode json`, `stream-json`, `--json-schema`) and `--max-turns`. *Adapter-owned:* prompt/task assembly, env allowlist, model/permission flags, schema mapping, "only the final result enters Pi context", one-writer-per-cwd concurrency, queueing/timeout policy, recovery/resume. Workflow suspend/resume durability (storage dependency) unverified.
7. **Services/privacy/overhead.** No DB, server, background model manager or model call is required to exec a worker. Telemetry: opt out explicitly. Token overhead mechanisms (no benchmarks): exposing exec as an agent *tool* forces the model to author commands and re-read outputs (truncation/tail mitigates); calling `sandbox.executeCommand` directly costs zero model calls; unfiltered stream events bloat parent context.
8. **Decide.** *Choose this IF:* orchestration belongs in TypeScript, workers are external CLIs, one writer per worktree, no DB/telemetry-by-default surprises acceptable. *Reject this IF:* you want Mastra to own Claude Code tools/permissions/sessions in-process (impossible today), or you need zero new dependencies (a 30-line Node child wrapper suffices), or you need Mastra to manage model auth. *Smallest read-only check:* read `packages/core/src/workspace/sandbox/process-manager/*` to confirm abort maps to SIGTERM/SIGKILL for foreground children. *Future user-authorized experiment:* scratch dir, `@mastra/core` only, `MASTRA_TELEMETRY_DISABLED=1`, run `pi --mode json "reply OK"` and `claude -p "reply OK" --output-format json` via `LocalSandbox.executeCommand` with 60 s timeout; assert no DB files created, parseable JSON, correct exit codes, child killed on abort.

## Gaps
Pi-child credential inheritance from a non-Pi parent; code-sdk `acp/` client-vs-server role (dir observed, not inspected); Anthropic terms for OAuth-token Messages-API use by third-party clients.

## Sources
- Kept: core workspace README; execute-command.ts; code-sdk `claude-max.ts`; code-sdk package.json; core package.json; `code.claude.com/docs/en/headless`; `sdk-overview` (Agent SDK runs the CLI binary).
- Dropped: prior-repo-claim reuse without re-verification; no broad searches or whole-repo clones.

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "report.md names concrete files: packages/core/src/workspace/{README.md,tools/execute-command.ts}, packages/core/package.json, mastracode/sdk/{package.json,src/providers/claude-max.ts}, plus official Claude CLI headless docs; each claim is tagged observed/proposed/unverified and the Claude Code vs Claude-model distinction is resolved from claude-max.ts source."
    }
  ],
  "changedFiles": [
    "/home/eldar/.local/share/pi-research/worker-runner-decisions-20260927T073227Z-j88cmvax/mastra/report.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [
    {
      "command": "read-only fetch of raw.githubusercontent.com, api.github.com and code.claude.com docs",
      "result": "passed",
      "summary": "Verified code-sdk provider list, claude-max OAuth Messages-API implementation, code-sdk+core dependency graphs, core Workspace/execute-command source, and Claude CLI headless/--bare auth behavior"
    }
  ],
  "validationOutput": [
    "claude-max.ts uses createAnthropic + Bearer OAuth + claude-code betas + forced 'You are Claude Code' system message; no spawn/execa/CLI path; @anthropic-ai/claude-agent-sdk absent from code-sdk deps.",
    "packages/core/src/workspace exists with LocalSandbox/Workspace; execute-command.ts passes timeout, cwd and context.abortSignal to sandbox.executeCommand and returns exitCode/success/killed/timedOut; background spawn returns PID with onExit.",
    "core package.json deps include execa and posthog-node but no libsql/@mastra/memory; code-sdk deps include libsql, pg, duckdb, stagehand, fastembed.",
    "Claude docs: '--bare ... doesn't use your subscription login' and 'never reads OAuth credentials or the system keychain'; stream-json/--json-schema/--permission-mode documented for -p."
  ],
  "residualRisks": [
    "Code-sdk default boot creating LibSQL/memory/workers is inherited from the prior report and was not re-verified in this pass.",
    "Whether a Pi child launched by a non-Pi parent finds Pi-owned credentials is unverified; no runtime probe was permitted.",
    "Mastra workflow suspend/resume storage requirement and abort-to-signal semantics for foreground children were not inspected.",
    "No token or cost measurements made; only mechanisms listed."
  ],
  "noStagedFiles": true,
  "diffSummary": "Added research report only; no installs, clones, execution, credential reads or configuration changes.",
  "reviewFindings": [
    "blocker (candidate-scope): mastracode/sdk/src/providers/claude-max.ts - Mastra's only Anthropic path is OAuth Messages-API model access, not a Claude Code runtime; using it would not satisfy 'actual Claude Code launch integration'.",
    "note: mastracode/sdk/package.json - no @anthropic-ai/claude-agent-sdk dependency, so Agent SDK is not even a transitive path inside code-sdk.",
    "no blockers for the core-only adapter option: packages/core/src/workspace provides process exec/timeout/abort/PID kill without storage or model calls."
  ],
  "manualNotes": "Verdict is package-level, not a selection: core-as-thin-adapter is viable; code-sdk-owns-workers is rejected for the Claude Code use case. The decisive untested seam is Pi-child credential discovery when the parent process is Node/Mastra rather than Pi."
}
```
