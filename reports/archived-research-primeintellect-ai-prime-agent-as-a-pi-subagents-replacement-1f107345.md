---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-primeintellect-ai-prime-agent-as-a-pi-subagents-replacement-1f107345",
    "title": "Research: PrimeIntellect-ai/prime-agent as a pi-subagents replacement",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: PrimeIntellect-ai/prime-agent as a pi-subagents replacement?",
    "scope": "Original Pi/tooling integration investigation: Research: PrimeIntellect-ai/prime-agent as a pi-subagents replacement. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: PrimeIntellect-ai/prime-agent as a pi-subagents replacement; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:36.495Z"
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
  "sourceDigest": "1f1073453c3ad3a3adac36aa51fff48dbcfd6d92ae84d1a6b7871785a528136d",
  "proposalRevision": "a302ed871633baf8d8e5652b077a47e483abdbf8ec801ca9994ec2bf2d60c8ec"
}
---
# Research: PrimeIntellect-ai/prime-agent as a pi-subagents replacement

## Summary
The repo is real, public, actively maintained, and does have a native `rlm.spawn(...)` subagent primitive plus ChatGPT/Codex **subscription** OAuth login. But it is not a delegation layer that plugs into Pi: it is a **full harness built on top of `pi`** ([README](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/README.md); dependency `@earendil-works/pi-coding-agent@^0.9.6`) with its own binary, config dir (`~/.prime/agent`), auth store and session store. Verdict: **POOR FIT** for "keep Pi as the interface, swap pi-subagents" — it replaces the harness instead of extending it.

## Findings

**1. Identity/activity (verified; no substitution needed).** MIT, TypeScript, not a fork, created 2026-05-08, `version: 0.9.6`. Retrieved this run: latest commit `cd1f215c` (2026-09-25T09:14:40Z, PR #2708), `pushed_at` 2026-09-26T10:52:47Z, v0.9.6 release commit `e260085d`. [Repos API](https://api.github.com/repos/PrimeIntellect-ai/prime-agent), [package.json](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/package.json), [Commits API](https://api.github.com/repos/PrimeIntellect-ai/prime-agent/commits?per_page=3)
Table correction (material): docs state upstream "Pi product claims and limitations do not describe the current Prime Agent architecture" — it is a **same-lineage successor**, not a Pi extension. [usage.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/usage.md)

**2. Primitive and integration path.** Host-owned harness: TUI → daemon supervisor → session worker (`AgentSessionRuntime`) → root `AgentSession` + scheduler + Python kernel; children are additional runtimes. [architecture.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/architecture.md) Integration is a separate install (`install.sh`, or source + `./prime-agent.sh`) with a bootstrapped kernel venv; no documented way to run it inside an existing Pi install. **Built-in/external worker — not hypothetical.** [quickstart.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/quickstart.md)

**3. Codex subscription vs API key.** Subscription support is directly established: `/login` offers "ChatGPT Plus/Pro (Codex)", tokens stored in `~/.prime/agent/auth.json` and auto-refreshed. DeepSeek (`DEEPSEEK_API_KEY`) and ZAI (`ZAI_API_KEY`) are API-key entries resolved from prime-agent's own env/`auth.json`, so **existing Pi credentials do not automatically carry over**. Reuse of the existing Pi Codex token is **not established** (and not shown impossible). No new API billing is required in principle for Codex; a second `/login` is implied. [providers.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/providers.md)

**4. Overhead sources (mechanisms only, no benchmarks).** One built-in model tool (`ipython`) fronts everything; `bash()` output enters context, while intermediate state can live in kernel variables instead of being re-injected — the real reduction channel. Extra LLM calls come from automatic compaction, `/refine`, and autonomous continuations; only skill *metadata* enters the startup prompt. Every child is a full `AgentSession` that **inherits the parent's model, provider, skills and tools** unless another model is requested, and child usage is charged to the parent session. The autonomous token cap counts input/output/cache-write but **excludes cache-read**. [rlm.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/rlm.md), [usage.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/usage.md)

**5. Parent/worker control and recovery.** `rlm.spawn(task, name=…)` returns *at admission* with a handle (`rlm_child_id`, `name`, `session_dir`, `model`) — never the child's answer; results arrive only as explicit `agent_message` replies or files. `rlm.list_subagents()` / `delete_subagent()` survive compaction, kernel restart and parent restoration. Host-side tool allowance: `--tools <list>`, `--no-builtin-tools`, `--no-tools` (built-in surface is exactly `ipython`); a **per-child** tool allowlist or per-child turn/token cap is not documented. Autonomous mode is off by default with host-enforced defaults of 3 continuations, 12 turns, 80 000 tokens, 30 min, optional gates; "reaching a limit does not imply task success". Cancellation via Ctrl+C, `prime-agent stop <agent>`, `shutdown`; `/usage` and `/context` report parent **and subagent** token/cost. First-party caveat: workers/kernels are "**not** a security sandbox" and run with user OS permissions, so tool allowlisting does not confine kernel actions. [rlm.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/rlm.md), [usage.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/usage.md)

**6. Jev MCP compatibility.** Direct stdio is supported — `prime-agent mcp add local --cwd /abs --env TOKEN=EXAMPLE_TOKEN -- node server.js --stdio`, settings `"type": "stdio"` with bounded startup/call timeouts, no shell, terminated on kernel shutdown; reached via `await mcp.call_tool(...)`. Constraints: secrets must be **env-var references** (literals rejected), connections are **kernel-local** per session, and project-level `.prime/agent/settings.json` MCP entries are ignored. Reading the existing `~/.pi/agent/mcp.json` is not established. [mcp-integrations.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/mcp-integrations.md)

**7. Privacy defaults.** "Trace sharing remains opt-in"; `/traces off` disables automatic sharing; default trace recipient is Prime Intellect (`api.primeintellect.ai`), overridable by `PRIME_AGENT_TRACES_BASE_URL`. Startup update/manifest checks are disableable (`--offline`, `PI_OFFLINE`, `PI_SKIP_VERSION_CHECK`); sessions and MCP credentials live locally; catalog-service MCP credentials are "never proxied"; `/share` uploads a private GitHub gist. Always-on analytics: **not found — unknown, not disproven.** [providers.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/providers.md), [usage.md](https://raw.githubusercontent.com/PrimeIntellect-ai/prime-agent/main/packages/coding-agent/docs/usage.md)

**8. Pros / Cons.** Pros: (a) first-class recursive subagents with independent child context + session dir and host-owned loops; (b) real host-side controls — tool allowlist, turn/token/time caps, interrupts, stop/shutdown, daemon recovery, subagent usage reporting; (c) Codex subscription OAuth supported, MIT, very active (v0.9.6). Cons: (a) whole-harness replacement with separate config/auth/session stores — migration, not integration; (b) far larger operational surface than pi-subagents (daemon, catalog, workers, kernel venv, compaction, refinement, autonomous mode); (c) coarse child control — no documented per-child tool allowlist, per-child budget, or structured child result object, and kernel actions run unsandboxed.

**9. Verdict.** **POOR FIT** under these constraints (would be CONDITIONAL only if the parent accepts switching harnesses wholesale). Biggest blocker: **no supported composability path** — adopting it changes the binary, config dir, credential store and session store, discarding the current Pi/DeepSeek/ZAI/Jev setup. Confidence: **high** on identity, auth and orchestration (first-party docs at `main`); **medium** on overhead (mechanism-level only; no runtime verification permitted).

## Sources
- Kept: repos + commits API (license, non-fork, dates, commit anchor); README; docs/rlm.md; docs/providers.md; docs/usage.md; docs/architecture.md; docs/mcp-integrations.md; docs/quickstart.md — each cited inline above for the claim it supports.
- Dropped: org repo listing beyond existence check, star/fork counts, README-linked arXiv/blog pages (non-decisive for a constraint-fit verdict).

## Gaps
No evidence that prime-agent reads existing Pi config/credentials (`auth.json`, `mcp.json`, provider config); no documented per-child tool allowlist, per-child turn/token cap, or returned child result; no quantification of overhead. Negative claims (e.g. platform support, absence of analytics) unverified. If pursued: on a disposable box, add the Jev stdio server via `prime-agent mcp add local …`, `/login` Codex, then check `--tools ipython` enforcement and `/usage` subagent breakdown.

## Observed vs. inferred vs. unknown
- Observed: repo identity/license/activity; `rlm.spawn` semantics and child isolation; tool allowlist flags; autonomous budget defaults; Codex subscription login; MCP stdio support with env-var secrets; opt-in traces; "not a security sandbox"; the `pi-coding-agent` dependency.
- Inferred: that no Pi→prime-agent config/credential reuse exists (absent documentation); that adoption forces re-doing provider/skill/MCP conventions; that per-child control is limited (documented signature is narrower than desired, undocumented options may exist).
- Unknown: all runtime behaviour, real overhead numbers, and anything absent from the docs read.

## Supervisor coordination
No decision or unblocking needed; single-lane read-only research completed (GitHub raw + public API only; no clones, installs, credential/session reads, or model probes).
