---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-langchain-langchain-ai-langchain-as-worker-runner-for-pi-claude-code-b0c740c2",
    "title": "Research: LangChain (langchain-ai/langchain) as worker-runner for Pi + Claude Code",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: LangChain (langchain-ai/langchain) as worker-runner for Pi + Claude Code?",
    "scope": "Original Pi/tooling integration investigation: Research: LangChain (langchain-ai/langchain) as worker-runner for Pi + Claude Code. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: LangChain (langchain-ai/langchain) as worker-runner for Pi + Claude Code; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:38.205Z"
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
  "sourceDigest": "b0c740c21a8ce9a14e4a286bd8f93c4a97a1bd96d6ddb06fba64711bfac8d8ad",
  "proposalRevision": "b41c337c876e4c6b582247af5d43d1f53f53143014c0527fb9fb0b9338165265"
}
---
# Research: LangChain (langchain-ai/langchain) as worker-runner for Pi + Claude Code

Scope: decision seam only — does `RunnableLambda`/`batch` or a thin LangGraph add process control to Pi + Claude CLI workers **with no LangChain model object at all**, and what still needs custom code? Observed vs proposed vs unverified are marked. Correction to my prior report: Python LangGraph ≥1.2 **does** have documented cooperative cancellation (`RunControl.request_drain()` → `GraphDrained`) and per-node `timeout=`; the earlier "no config-level cancel" claim is right only for `RunnableConfig`, not for graphs.

## DECISION CARD

**1) Smallest primitive + topology.** Two shapes, both model-free: (A) `langchain-core` only — `RunnableLambda(fn).batch(tasks, config={"max_concurrency": N})` where `fn` spawns and parses a worker CLI; (B) thin `langgraph` graph, one node per worker, `timeout=`, `retry_policy`, optional checkpointer. Topology: **Pi parent (brain/interface, owns prompts+auth) → adapter (Python; spawn, cwd isolation, stream parse) → worker CLI** (`claude -p …` or `pi --mode json …`). Provider/model selection stays in the CLI's own config; no `ChatOpenAI`/`ChatDeepSeek`/Codex-auth object is instantiated.

**2) Support classification.**
- Pi worker: **documented at CLI level** (`pi --mode json`); LangChain has no Pi integration → any wrapping is a **custom bridge**. Not SDK, not model API.
- Claude Code worker: **documented at CLI level** (`claude -p`, `--output-format json|stream-json`, `--json-schema`, `--resume/--continue`, `--max-turns`, `--input-format stream-json`, `--allowedTools`, `--permission-mode`, `--bare`); `langchain-anthropic` is **only the model API** and never launches Claude Code. Agent SDK is a documented wrapper but its auth is API-key-oriented: "Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK." → subscription reuse is **CLI-level only**; SDK ≠ CLI.
- LangChain controls: documented for **in-process** callables/graphs; **unverified** for external subprocess supervision (no first-party docs).

**3) Why choose.** (a) Documented per-node `timeout` with `idle_timeout` whose clock resets on progress signals (stream-writer calls, callbacks), plus `RunControl.request_drain()` → `GraphDrained` "stopped early and saved a checkpoint", resume with `invoke(None, config)` — this is the cooperative SIGTERM pattern a bare `subprocess.Popen` lacks. (b) Checkpointer gives super-step snapshots, pending writes so completed sibling nodes "don't need to be re-run", and `get_state_history` for audit — richer than exit codes.

**4) Why not.** (a) Most control stays custom: `RunnableConfig` `CONFIG_KEYS` has **no `timeout`/`signal`**; drain "does not cancel running asyncio tasks or kill threads"; node timeouts are async-only (rejected for sync nodes); process-tree kill, SIGINT→SIGTERM escalation (SIGTERM ⇒ exit 143, unfinished turn) are adapter code. (b) Resume semantics are unsafe for side-effecting workers: replay re-executes nodes after a checkpoint "including any LLM calls, API requests"; `durability` defaults to `async` (checkpoints can be lost on crash), `exit` saves only at exit; in-memory savers die with the process; plus ~10 transitive deps including mandatory `langsmith`.

**5) Glue responsibilities** (built-in vs adapter-owned).
| Concern | Built-in | Adapter-owned |
|---|---|---|
| Task input | `config`/state channels | argv/stdin to CLI |
| Isolated cwd/context/env | — | temp cwd, env allowlist, `--bare` (skips host hooks/MCP/CLAUDE.md) |
| Model/auth selection | — (never touched) | Pi/claude CLI config, existing subscription |
| Stream/result schema | state channels + `stream_mode` | parse `stream-json` lines → state writes, exit code |
| Cancel/timeout | node `timeout=`, `request_drain`, `GraphDrained` | SIGINT/SIGTERM/kill of process tree |
| Concurrency/recovery | `.batch(max_concurrency)` → `ContextThreadPoolExecutor(max_workers=N)`; checkpointer + pending writes | idempotency keys, resource caps |

**6) Mandatory services/deps/privacy.** `langchain-core` (langsmith, pydantic, httpx, tenacity, jsonpatch, PyYAML, uuid-utils, langchain-protocol), `langgraph`+`langgraph-checkpoint` (sqlite extra only if durable); no server/DB required. `langsmith` installs regardless; tracing opt-in. Adapter must not copy `~/.codex` or `~/.claude` token stores into graph state or share token stores across independent refresh managers.

**7) Lifecycle/tool/user control + overhead.** Per worker: spawn → stream → drain/timeout → exit; Pi stays brain; user control via CLI allowlists/permission modes. Overhead mechanisms (no token claims): per-superstep checkpoint writes (full channel values unless `DeltaChannel`, beta), async checkpoint risk, and CLI-side context/hook/MCP auto-loading unless `--bare`.

**8) Choose/reject + one check.** Choose-this-IF you need cross-worker resume, idle-timeout liveness, and documented drain-on-SIGTERM, and accept Python+langsmith. Reject-this-IF a plain subprocess supervisor over `claude -p`/`pi --mode json` JSON streams suffices for bounded single/parallel workers — LangChain adds no auth, isolation, or process kill semantics. Smallest read-only check: diff installed `pi docs/json.md` event fields against the `claude -p --output-format stream-json` event list (`session_id`, `result`, `total_cost_usd`, `permission_denials`) to size the adapter's parse/mapping layer; no install or execution.

## Sources
- https://code.claude.com/docs/en/headless.md (print mode, SIGTERM/SIGINT + exit 143, stream-json, `--bare`, permission modes, background-task termination)
- https://code.claude.com/docs/en/cli-reference.md (flags: `--max-turns`, `--max-budget-usd`, `--input-format stream-json`, resume)
- https://code.claude.com/docs/en/agent-sdk/overview.md (SDK auth restriction vs claude.ai login)
- https://raw.githubusercontent.com/langchain-ai/langchain/master/libs/core/langchain_core/runnables/config.py (`CONFIG_KEYS`, `get_executor_for_config`, `ContextThreadPoolExecutor`)
- https://raw.githubusercontent.com/langchain-ai/docs/main/src/oss/langgraph/fault-tolerance.mdx (retries/timeouts/graceful shutdown; file renders as "Retries")
- https://raw.githubusercontent.com/langchain-ai/docs/main/src/oss/langgraph/checkpointers.mdx (super-steps, pending writes, durability modes, replay)

## Gaps
No first-party doc shows a LangGraph node supervising an external process tree; drain/kill interplay with CLI turn semantics is untested. Whether Pi's own JSON mode can be driven with streaming input like `--input-format stream-json` is unverified. No cost/token measurement performed.

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "report.md decision card with source URLs; findings cite runnables/config.py CONFIG_KEYS (no timeout/signal), fault-tolerance.mdx RunControl/GraphDrained/timeouts, checkpointers.mdx durability+pending writes, claude headless.md SIGTERM/exit-143, agent-sdk overview auth restriction"
    }
  ],
  "changedFiles": [
    "report.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [],
  "validationOutput": [
    "All claims traceable to the 6 listed first-party URLs; observed vs proposed vs unverified marked in prose; no estimates fabricated"
  ],
  "residualRisks": [
    "LangGraph drain/SIGTERM cooperation with a Claude CLI process tree is documented for in-process nodes only; external-process validation untested",
    "claude -p SIGTERM exits 143 leaving the turn unfinished while SIGINT ends the turn, so adapter kill order matters and is unverified end-to-end",
    "fault-tolerance.mdx URL rendered as the 'Retries' page (retries+timeouts+graceful shutdown); docs path may be renamed",
    "No token/cost measurement; overhead described only as mechanism"
  ],
  "noStagedFiles": true,
  "diffSummary": "New report.md only; read-only public-source research, no installs, no execution",
  "reviewFindings": [
    "warning: report.md - prior-run claim 'no config-level cancel in Python' is corrected: correct for RunnableConfig CONFIG_KEYS but wrong for LangGraph >=1.2 (RunControl.request_drain/GraphDrained, per-node timeout)",
    "info: report.md - LangChain provides no Pi integration and no Claude Code launcher; both are custom subprocess bridges, and langchain-anthropic is model-API-only, so it must not be counted as Claude Code support",
    "info: report.md - Agent SDK auth is API-key oriented per agent-sdk/overview.md, so subscription reuse is CLI-level only; do not conflate",
    "blocker: none"
  ],
  "manualNotes": "Card answers the assigned seam (RunnableLambda/batch vs thin LangGraph, no model object) and lists which controls remain custom. Pi-child auth left Pi-owned; no LangChain Codex-auth path recommended. Nothing selected, installed or configured."
}
```
