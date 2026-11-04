---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-microsoft-autogen-core-only-runtime-for-external-pi-claude-cli-workers-15b63645",
    "title": "Research: microsoft/autogen — Core-only runtime for external Pi/Claude CLI workers",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: microsoft/autogen — Core-only runtime for external Pi/Claude CLI workers?",
    "scope": "Original Pi/tooling integration investigation: Research: microsoft/autogen — Core-only runtime for external Pi/Claude CLI workers. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: microsoft/autogen — Core-only runtime for external Pi/Claude CLI workers; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:38.357Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "15b63645855ffac3763cdc0caf4200b14862d398eb468350a71e1e8b68440a37",
  "proposalRevision": "5853f60e4f8396d5036f4794c90b4dce0a2d4e121d5ce53cd2e8c05db9dd1ef3"
}
---
# Research: microsoft/autogen — Core-only runtime for external Pi/Claude CLI workers

Marks: **[F]** observed in first-party source · **[I]** inference · **[U]** unverified.

## Summary

Core *can* host model-free agents (its own docstring example is a plain `RoutedAgent` handler), but as a manager for external `claude -p` / `pi --mode json` children it is a strict add-on: it never spawns, times out or kills a process, never serialises messages to a stateful agent, and its `CancellationToken` is cooperative only. **Verdict: REJECT for this lane** — a small `asyncio.create_subprocess_exec` + JSONL adapter covers the same ground without a 4-dependency asyncio runtime that is in maintenance mode. Choose it only if message interposition/telemetry is the goal.

## Findings

1. **[F] Model-free Core agents are legitimate:** the runtime's documented example just registers an agent and publishes a dataclass; no model client, `autogen-core` only. [1]
2. **[F] Stateful agents are unprotected:** "the runtime processes each message in a separate asyncio task concurrently" (`create_task(_process_send)` + `await asyncio.sleep(0)`). FIFO delivery ≠ mutual exclusion; `parallel_tool_calls=False` is an AgentChat/`AgentTool` guard, so a reused Core agent needs an adapter-owned lock. [1]
3. **[F] Cancellation does not reach the worker:** `cancel()` only fires callbacks and cancels the *caller's* future; the handler keeps running and the result is dropped (`future.cancelled()`). `stop()`: "the currently processing message will be completed, but all others following it will be discarded." A token reaches `MessageContext`, but the runtime never checks `is_cancelled()` — kill must be adapter-owned via `add_callback`. [2]
4. **[F] Shallow recovery + silent failures:** `save_state`/`load_state` cover instantiated agents only and "do not currently save/load the subscription state"; queued/in-flight work is lost. `ignore_unhandled_exceptions=True` by default swallows publish-handler exceptions. [1]
5. **[F] "CLI" in AutoGen means code blocks, not CLI workers:** `CodeExecutorAgent` without `model_client` runs only ```python```/```sh``` blocks via a `CodeExecutor` (Docker recommended); no external-CLI-worker primitive found **[U]**. [3]
6. **[F] Claude side:** headless CLI (`--print`, `--output-format stream-json`, `--max-turns`, `--max-budget-usd`) plus Pro/Max subscription login is first-party documented; the Agent SDK is a wrapper that spawns the bundled CLI (`cwd`, hooks, in-process MCP) — SDK ≠ model API, but subscription reuse *through* the SDK is unverified here. [4][5]

## DECISION CARD

1. **Smallest package/topology:** `autogen-core` alone (MIT code, no server/DB/UI) — Pi parent → Core `RoutedAgent` adapter → `claude`/`pi` child: one extra process tier.
2. **Classification:** Pi child = documented CLI, **custom bridge** in AutoGen. Claude Code = **documented CLI**; **Agent SDK** = documented wrapper, subscription auth **unverified**; **model API** irrelevant (no model calls in this lane). Core process/timeout management = **absent (custom)**.
3. **Choose — advantages:** (a) typed routing + per-message RPC futures + `InterventionHandler`/`DropMessage` give a uniform envelope and drop/kill switch with no dispatcher written; (b) per-agent state snapshots and handler-plumbed token give cooperative-cancel hooks.
4. **Reject — costs:** (a) all process supervision (spawn/kill/timeout/orphans/per-agent locking/recovery) is still yours, *plus* an asyncio runtime with `protobuf~=5.29.3`, mandatory `opentelemetry-api`, `pillow`, `jsonref`; (b) maintenance mode, community-only support, shallow recovery, swallowed publish failures, cooperative-only cancel.
5. **Glue:** *built-in* — routing, RPC future, token callbacks, intervention drop, state snapshot, `stop_when_idle`. *Adapter-owned* — task input schema, isolated cwd/env, model/auth selection, stream→result parsing, timeout, `add_callback`→`process.kill()`, concurrency guard, retries/recovery.
6. **Deps/privacy:** no mandatory service, daemon or model-manager call; Python ≥3.10. Tracing is on by default (off via `AUTOGEN_DISABLE_RUNTIME_TRACING`) and message payloads are serialised into `MessageEvent` attributes, so an exporter can leak prompt content **[I]**.
7. **Lifecycle/overhead:** runtime start/stop, in-flight handler completes on stop; approval hooks exist only in AgentChat's `CodeExecutorAgent`. Token cost is whatever you design; the runtime adds no model calls and no measured savings — no benchmark claims.
8. **Choose IF** interposition/telemetry or per-agent snapshots matter. **Reject IF** you want the smallest launcher with bounded, killable workers.

**Smallest read-only check:** read `python/packages/autogen-core/docs/src/user-guide/core-user-guide/framework/agent-and-agent-runtime.ipynb` for any documented timeout/external-process or serialisation guarantee. Only user-authorized experiment: one bounded `claude -p --output-format stream-json` child under a hard 60s kill, comparing orchestration glue with the AutoGen variant. No install, clone, execution or credential access occurred.

## Sources

- Kept: [1] [_single_threaded_agent_runtime.py](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-core/src/autogen_core/_single_threaded_agent_runtime.py) · [2] [_cancellation_token.py](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-core/src/autogen_core/_cancellation_token.py) · [3] [_code_executor_agent.py](https://raw.githubusercontent.com/microsoft/autogen/main/python/packages/autogen-agentchat/src/autogen_agentchat/agents/_code_executor_agent.py) · [4] [Claude Agent SDK README](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-python/main/README.md) · [5] [shared excerpts](../shared/excerpts.md) · [6] [AutoGen README](https://raw.githubusercontent.com/microsoft/autogen/main/README.md).
- Dropped: Studio/Magentic-One docs (UI layer), third-party provider tutorials, prior scout's speculative line counts.

## Gaps

- No external-CLI-agent primitive found rests on files read, not an exhaustive `autogen-ext` listing **[U]**.
- SDK-spawned Claude Code reusing subscription login vs. API key is unestablished; no billing or credential path probed.
- No measured glue size, latency or token deltas; no runtime probe run.
