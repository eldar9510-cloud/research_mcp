---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-microsoft-agent-framework-does-agent-framework-claude-beat-a-direct-cla-602521d8",
    "title": "Research: microsoft/agent-framework — does `agent-framework-claude` beat a direct Claude Code CLI launch?",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: microsoft/agent-framework — does `agent-framework-claude` beat a direct Claude Code CLI launch?",
    "scope": "Original Pi/tooling integration investigation: Research: microsoft/agent-framework — does `agent-framework-claude` beat a direct Claude Code CLI launch?. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: microsoft/agent-framework — does `agent-framework-claude` beat a direct Claude Code CLI launch?; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:37.737Z"
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
  "sourceDigest": "602521d8670d043a2d38397338d54db30322ac8b9792dadaf5ca36a76ea5a463",
  "proposalRevision": "96594f3ebbbaa8999dbeecc019d8a5eb335d1399dbfbdcefddcfe665f028e26a"
}
---
# Research: microsoft/agent-framework — does `agent-framework-claude` beat a direct Claude Code CLI launch?

Read-only public sources, 2026-09-27. Prior scout report + parent synthesis read first. No installs, clones, execution, credential or config reads; no model probes.

## Summary
`agent-framework-claude` is a thin first-party wrapper around `claude-agent-sdk`, which is itself "a library that runs the Claude Code binary". It adds **no manager LLM, no model API key and no server/DB** — the wrapper code issues no model call at all — so on auth/billing grounds it is neutral versus launching Claude Code directly. What it actually buys is a uniform agent/session/result interface plus graceful SDK-level cancellation and typed terminal results; what it costs is a Beta Python package, a second settings/credential surface, and a per-run `ClaudeSDKClient` you still have to supervise yourself. For "Pi parent -> adapter -> bounded Claude Code worker", the direct `claude -p --output-format stream-json` child is the lower-complexity default and this package does not currently beat it.

## Decision card

**1) Smallest primitive and topology.** `agent-framework-claude` (Beta, `1.0.0b260910`, `pip install --pre`), deps `agent-framework-core>=1.13,<2` + `claude-agent-sdk>=0.1.46,<0.3` ([pyproject](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/claude/pyproject.toml)). Topology: Pi parent (brain/UI) -> Pi child (python runner, adapter-owned) -> `RawClaudeAgent`/`ClaudeAgent` -> per-run `ClaudeSDKClient` -> Claude Code CLI process (`cli_path`, bundled by default) -> model. No intermediate LLM hop exists in the inspected code.

**2) Support classification (kept separate).**
- Claude Code worker, CLI route: **native/documented** — `claude -p --output-format stream-json|json --verbose --include-partial-messages --permission-mode ... --allowedTools ... --max-turns N --json-schema ... --resume <id>` ([headless](https://code.claude.com/docs/en/headless)). Pi can spawn this with zero extra runtime.
- Claude Code worker, Agent SDK route: **documented** — "a library that runs the Claude Code binary" ([SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)); Python/TS only; other languages are told to use CLI-as-subprocess.
- `agent-framework-claude`: first-party but **runtime-unverified** — Beta, unit tests are `MagicMock`-only with no `ANTHROPIC_API_KEY` or integration test in the package (`tests/test_claude_agent.py`).
- Pi worker: **documented in Pi** (`pi --mode json`) but MAF has no Pi integration -> any Pi<->MAF bridge is a **custom bridge**.
- Anthropic model API access is a *different* package: `agent-framework-anthropic` is for basic Claude chat; only `agent-framework-claude` drives Claude Code (package `AGENTS.md`). Do not conflate.
- Answer to the assigned seam: **no extra manager LLM, no API key required by the wrapper.** `ClaudeAgentOptions.env` forwards env to the CLI; auth/billing stay the CLI's.

**3) Why choose / why not.** Choose for: (a) `ClaudeSDKClient.interrupt()` plus SDK-mediated shutdown (the SDK "ends Claude Code's input before sending any signal"; a raw SIGTERM to `claude -p` records the command as killed and can leave a permission prompt unanswered); (b) typed terminal result (`ResultMessage.subtype` `error_max_turns`/`error_max_budget_usd`, `terminal_reason`, `is_error`, usage/cache token counts) mapped into `AgentResponseUpdate`/`AgentResponse`. Costs: (a) two extra layers and a second config surface (`CLAUDE_AGENT_*` env/.env layering) for the same CLI; (b) Beta package with churn (its own docstring imports `agent_framework.anthropic` while the real path is `agent_framework_claude`) and no queue, wall-clock timeout, process-tree kill or recovery — all adapter-owned anyway.

**4) Hard blockers / conditional assumptions.** No new billing is *required*: docs state bare mode "doesn't use your subscription login" and "never reads OAuth credentials or the system keychain", so non-bare `claude -p` and Agent SDK runs use the CLI OAuth login (subscription-limited, not API-metered) — **conditional on the user's own Claude Code login existing; unverified whether the SDK's bundled CLI shares the same credential store as an already-installed `claude`.** Wrapper `model` is documented only as sonnet/opus/haiku, so deepseek/glm cannot be routed through this package. `-p`/SDK sessions start in Manual permission mode: a non-interactive worker must set a permission mode or pre-approve tools, else calls are denied or prompt.

**5) Glue responsibilities (built-in vs adapter-owned).**
- task input: adapter (`run(messages)`, string prompt); MAF JSON-wraps multi-message input with a preamble.
- isolated cwd/context: built-in passthrough (`cwd`, `add_dirs`, `settings`, `setting_sources`, `env`); isolation policy adapter/Pi-owned.
- model/auth selection: built-in passthrough (`model`, `cli_path`, `env`, `fallback_model`, per-run `set_model`).
- stream/result schema: built-in (MAF update/response + `structured_output` via CLI JSON schema, usage details).
- cancel/timeout: **partial** — SDK `interrupt()` (streaming only) + asyncio cancel/disconnect, `max_turns`/`max_budget_usd` passthrough; no wall-clock timeout -> adapter-owned.
- concurrency/recovery: **adapter-owned** — a fresh client per run gives isolation but no concurrency cap or queue; session continuity via `resume`/`service_session_id`.

**6) Mandatory services/deps and privacy.** Python >=3.10, core + SDK (the SDK wheel bundles a Claude Code CLI; may duplicate the user's CLI). No server, DB, dashboard or background daemon. OTel layers exist (`ClaudeAgent`) but `RawClaudeAgent` avoids them; no exporter configured by default. Default-on framework telemetry applies unless disabled: `AGENT_FRAMEWORK_USER_AGENT_DISABLED`, feature mask `mark_feature_used(FeatureIndex.CLAUDE)` (`AGENT_FRAMEWORK_FEATURE_MASK_DISABLED`).

**7) Lifecycle, tool/user control, token overhead.** `async with` start/stop; `on_function_approval` default-denies and cannot be overridden per run; permission mode, `can_use_tool`, hooks, `disallowed_tools` available. Likely token-overhead mechanisms (no benchmarks): appended system prompt, allowed-tool descriptions, injected MCP tool schemas for FunctionTools, the multi-message JSON preamble, always-on `include_partial_messages` (bytes, not model tokens), and CLI context resend on resume.

**8) Choose-this-IF / reject-this-IF, and smallest check.** Choose if you want Claude Code workers exposed through the same agent/session interface as Pi/other workers with typed results and in-process framework tools, and accept Python + Beta. Reject if the worker is simply "run Claude Code in this cwd, bounded, return JSON": a Pi child calling `claude -p --output-format stream-json` with a kill/timeout wrapper is fewer moving parts and loses nothing in auth or cost. Smallest read-only check: `command -v claude; claude --version` plus `python -c "import importlib.util as u; print(bool(u.find_spec('claude_agent_sdk')))"` — read-only, no credentials — to learn whether the package would introduce a second bundled CLI beside the authenticated one. Only if that shows no existing CLI + login would a user-authorized two-run experiment (CLI vs 10-line `ClaudeSDKClient` script, same task, compare session id, cancellation and usage fields) be warranted.

## Observed / proposed / unverified
- Observed: wrapper internals, deps, Beta status, mock-only tests, telemetry flags, CLI flag surface, SDK=CLI-runner statement, bare-mode auth exception.
- Proposed: direct CLI child as default; Pi-child-only bridge (no inner LLM) using `claude -p` NDJSON.
- Unverified: bundled-CLI vs user-CLI credential sharing; SDK child-process kill on asyncio cancel; whether any Pi child mechanism already wraps `claude`.

## Sources
- Kept: [`_agent.py`](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/claude/agent_framework_claude/_agent.py) (wrapper seam); [claude pyproject](https://raw.githubusercontent.com/microsoft/agent-framework/main/python/packages/claude/pyproject.toml) (deps/Beta); [Claude Agent SDK Python README](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-python/main/README.md) (bundled CLI, `query` vs `ClaudeSDKClient`, interrupts); [Run Claude Code programmatically](https://code.claude.com/docs/en/headless) (headless flags, bare-mode auth, SIGTERM behaviour); [Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview) (SDK vs CLI subprocess, terms).
- Dropped: Learn `.../agents/providers/claude` (HTTP 404); marketing/devblog material; star counts.

## Gaps
Whether an installed authenticated `claude` CLI is reused by the SDK's bundled CLI; measured cancellation/token behaviour; MAF release of a stable Claude package. Resolvable only by the small read-only check above plus, if the user authorizes it, one bounded two-run comparison.
