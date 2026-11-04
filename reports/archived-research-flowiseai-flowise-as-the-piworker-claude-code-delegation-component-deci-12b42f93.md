---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-flowiseai-flowise-as-the-piworker-claude-code-delegation-component-deci-12b42f93",
    "title": "Research: FlowiseAI/Flowise as the Pi→worker/Claude-Code delegation component (decision lane)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: FlowiseAI/Flowise as the Pi→worker/Claude-Code delegation component (decision lane)?",
    "scope": "Original Pi/tooling integration investigation: Research: FlowiseAI/Flowise as the Pi→worker/Claude-Code delegation component (decision lane). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: FlowiseAI/Flowise as the Pi→worker/Claude-Code delegation component (decision lane); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:37.456Z"
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
  "sourceDigest": "12b42f93150b89d26d49a7c8b080e8a89aee97b0400414358106371e9f64f905",
  "proposalRevision": "c7c3e5342d47206328769d82728ebcbbba9fdaf2834bdef99d22b50f76acb2f1"
}
---
# Research: FlowiseAI/Flowise as the Pi→worker/Claude-Code delegation component (decision lane)

Date 2026-09-27. Read-only public-source research; no installs, clones, probes, credential reads or config changes. Prior Flowise report and parent synthesis read and corrected below (no CVE/history re-survey).

## Summary
Reject for the stated goal. Flowise has no first-party Claude Code or Claude Agent SDK node — its Anthropic support is the *model API* only (`@anthropic-ai/sdk` ^0.73.0, `@langchain/anthropic`); Claude Code would require a custom bridge either way. The one real external-process seam is the **Custom MCP node with `stdio` transport**, and inspecting it shows it cannot host bounded coding workers: `cwd` is explicitly rejected, each tool call spawns *and closes* a fresh client, results are an opaque JSON string of MCP content, and the client path has no timeout/abort/signal. Combined with mandatory server+DB and an archived repo, the archive itself is not the deciding factor — the seam is too thin.

## Findings (observed)
1. **Claude support is model API only; Claude Code is absent.** `packages/components/package.json` lists `@anthropic-ai/sdk` and `@langchain/anthropic`, and the chat-model node list contains `ChatAnthropic` — but no `@anthropic-ai/claude-code` / `@anthropic-ai/claude-agent-sdk` dependency and no Claude Code node in the inspected `nodes/` trees. [package.json](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/components/package.json), [chatmodels listing](https://api.github.com/repos/FlowiseAI/Flowise/contents/packages/components/nodes/chatmodels)
2. **The external-CLI seam is MCP stdio.** `MCP/core.ts` uses `StdioClientTransport(command,args,env)` only when `CUSTOM_MCP_PROTOCOL=stdio`; `initialize()` and *every* tool call create a client and `client.close()` in `finally`. No `timeout`, `AbortSignal` or `signal` appears in that file. [core.ts](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/components/nodes/tools/MCP/core.ts)
3. **That seam is deliberately crippled for workers.** `cwd` is rejected outright; command must be in `CUSTOM_MCP_ALLOWED_COMMANDS` (empty by default), env vars in `CUSTOM_MCP_ALLOWED_ENV_VARS`, script paths in `CUSTOM_MCP_ALLOWED_ABSOLUTE_SCRIPT_PATHS`, and `npx -y/-c`, `node -e/-r/--import`, `python -c`, `docker run/exec` are blocked. [core.ts](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/components/nodes/tools/MCP/core.ts), [CustomMCP.ts](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/components/nodes/tools/MCP/CustomMCP/CustomMCP.ts)
4. **No headless executor; DB coupling confirmed.** The Custom Tool node resolves tools from `appDataSource.getRepository(databaseEntities['Tool'])`; Custom MCP uses `options.cachePool`/`getVars`; `packages/agentflow/src` is React UI (`atoms/`, `features/`, hooks) with no executor and no Claude reference. [CustomTool.ts](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/components/nodes/tools/CustomTool/CustomTool.ts), [agentflow/src](https://api.github.com/repos/FlowiseAI/Flowise/contents/packages/agentflow/src)
5. **Archived (prior report upheld).** `archived: true`; that is a maintenance cost, not the primary rejection reason. [repo API](https://api.github.com/repos/FlowiseAI/Flowise)

## DECISION CARD
1. **Smallest package/topology.** No small primitive. Smallest unit = full `packages/server` app (Node 24 + DB) + per-worker wrapper MCP server. Pi parent → (HTTP/flow call) → Flowise server → Custom MCP node → stdio child (wrapper) → `claude -p …` / `pi --mode json …` → one JSON string back.
2. **Support classification.** Pi-worker: **custom bridge** (stdio MCP wrapper; CLI, not SDK). Claude Code: **custom bridge only** via wrapper hosting Claude Code **CLI** (`-p --output-format stream-json`) or the **Agent SDK**; native Flowise = **model API only**. Subscription reuse: **unverified** (CLI login vs `ANTHROPIC_API_KEY` are distinct paths; Agent SDK auth ≠ subscription).
3. **Why choose (weak).** (a) An audited spawn gate (command/env/arg allowlists, cwd ban) already exists; (b) one MCP tool surface could serve both Pi and Claude Code workers with existing keys, no new billing.
4. **Why not (decisive).** (a) `cwd` ban + per-call spawn/close = no isolated worker workspace, no session/resume/streaming; (b) no timeout/abort in the MCP call path and opaque string results ⇒ cannot implement cancellation/recovery, and server+DB+allowlist ops add maintenance on a frozen repo.
5. **Glue responsibilities.** Built-in: model/credential selection, MCP tool exposure, operator allowlists, telemetry env switches. Adapter-owned: task input schema, isolated cwd, stream/result parsing, cancel/timeout, concurrency limits, retry/recovery, per-worker process lifecycle.
6. **Mandatory services/deps.** Flowise server + DB (+cache) and wrapper processes; Node engine pinned `^24` in server; telemetry switches (`DISABLE_FLOWISE_TELEMETRY`, PostHog) must be set; privacy: wrapper subprocess env = allowlist merge + PATH only.
7. **Lifecycle/tool/user control.** Control lives in operator env + Flowise variables (DB) + API, not in Pi; user control is coarse per-flow. Overhead mechanisms: MCP tool name/description caps (128/1024 chars) and full tool-schema injection into context plus flow prompts — mechanism only, no benchmark claim.
8. **Choose-this-IF** you already run Flowise with stdio MCP enabled and want existing MCP tools, not coding workers. **Reject-this-IF** the goal is bounded Pi/Claude-Code coding workers with per-task cwd, streaming and cancel — true here.

**Committed-state vs proposals (separate):** findings 1–5 are observed from raw sources; "wrapper MCP server" and topology in item 1/2 are proposed.

## Next resolve step (smallest read-only check)
Read `docker/.env.example` and `packages/server/.env.example` for the shipped defaults of `CUSTOM_MCP_PROTOCOL`/`CUSTOM_MCP_ALLOWED_COMMANDS` (confirming the seam is off by default). Only with explicit user authorization, the deciding experiment would be one wrapper MCP server exposing a single `run_claude_code` tool, invoked once from a flow to see whether a full Claude Code run survives one MCP request lifecycle.

## Sources
- Kept: `packages/components/package.json`, `nodes/tools/MCP/core.ts`, `nodes/tools/MCP/CustomMCP/CustomMCP.ts`, `nodes/tools/CustomTool/CustomTool.ts`, `packages/agentflow/src` listing, repo API, chatmodels listing.
- Dropped: Flowise docs/SEO search results (no Claude Code node claim found, but absence-by-search is weak), CVE/advisory pages (covered previously).

## Gaps
Whether the MCP SDK imposes a client-side request timeout (not visible in Flowise's wrapper) is unverified; subscription-credential reuse for a headless `claude` child is unverified here; a wrapper-based bridge was never executed.
