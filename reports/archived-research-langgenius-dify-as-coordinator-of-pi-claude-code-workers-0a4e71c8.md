---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-langgenius-dify-as-coordinator-of-pi-claude-code-workers-0a4e71c8",
    "title": "Research: langgenius/dify as coordinator of Pi + Claude Code workers",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: langgenius/dify as coordinator of Pi + Claude Code workers?",
    "scope": "Original Pi/tooling integration investigation: Research: langgenius/dify as coordinator of Pi + Claude Code workers. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: langgenius/dify as coordinator of Pi + Claude Code workers; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:38.507Z"
  },
  "warnings": [
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
  "sourceDigest": "0a4e71c89c652be8898c6065eb9d23e54fbe8a4d5010b069742954965b368e98",
  "proposalRevision": "06cbae8c14fd825e4feeffc6f09e633dea1918531547fe03d03a4941cb62e80d"
}
---
# Research: langgenius/dify as coordinator of Pi + Claude Code workers

Date 2026-09-27. Read-only public-source research; no installs, clones, execution, credential/auth reads, probes or config changes. Corrects the prior Dify scout: an official **`difyctl`** CLI and agent-skill seam now exists, but it points the *other* way. Labels: observed / proposed / unverified.

## Decision card

**1) Smallest primitive & topology.** `difyctl` binary + one **published Dify app** still requires a **remote Dify host** (Cloud, or self-host = api + Celery worker/beat + Postgres + Redis + plugin_daemon + sandbox) or Cloud. Topology: `Pi parent --shell--> difyctl run app <id> -o json --HTTPS--> Dify server (Celery executes the app graph)`. There is no package that launches a local `pi`/`claude` process. [command-index](https://github.com/langgenius/dify-docs/blob/main/en/cli/reference/command-index.mdx)

**2) Support classification.**
- **Pi worker behind Dify: custom bridge.** Dify's MCP *client* has only `sse_client.py` and `streamable_client.py` — **no stdio transport**, so Dify cannot spawn `pi`/`claude` as a local MCP/CLI child; only an HTTP/SSE MCP wrapper would work. A plugin-daemon tool shelling out to the CLI is **unverified** and custom code. [mcp/client](https://github.com/langgenius/dify/blob/main/api/core/mcp/client)
- **Claude Code worker behind Dify: custom bridge (same reason).** Claude Code *itself* is documented as a headless CLI (`--print`, `--output-format stream-json`, `--max-turns`, `--permission-mode`) and the Python Agent SDK bundles that CLI with `cwd`, `max_turns`, `allowed_tools`, structured `ResultMessage` — **CLI + SDK, not only model API**. Dify-side plumbing is not documented in any source reviewed. [SDK README](https://raw.githubusercontent.com/anthropics/claude-agent-sdk-python/main/README.md)
- **Inverse direction is documented:** `difyctl skills install` detects Claude Code, Codex, OpenCode, Cursor, **pi**, writing `SKILL.md` so the *coding agent calls Dify apps as tools*. Pi would be the tool-caller, not the orchestrator forwarding to workers. [install-the-difyctl-skill](https://github.com/langgenius/dify-docs/blob/main/en/cli/integrate-agents/install-the-difyctl-skill.mdx)
- Do not conflate: Dify provider plugins = **model API keys only** (Codex/Luna6 subscription unsupported).

**3) Why choose — 2 concrete advantages.** (a) If a host already exists, the call is a documented, zero-new-service subprocess contract: stable JSON on stdout, all noise on stderr, stable `code`-field errors, `--stream`, exit codes 0/1/2/4/7. [output-formats-and-exit-codes](https://github.com/langgenius/dify-docs/blob/main/en/cli/reference/output-formats-and-exit-codes.mdx) (b) Platform primitives replace adapter code: per-app API keys, run logs, `POST /workflows/tasks/{task_id}/stop` (only in streaming mode), human-input pause/resume with `form_token`, compatibility gate (exit 6/64). [workflow.py](https://raw.githubusercontent.com/langgenius/dify/main/api/controllers/service_api/app/workflow.py)

**4) Why not — 2 concrete costs.** (a) For the stated goal it solves nothing: wrapping a local CLI worker still needs custom HTTP/MCP glue, plus a full server stack, network dependency and server-version coupling on every run. (b) Topology inversion + governance: the Dify app graph owns model choice, prompting and iteration limits; the documented agent integration is Dify-app-as-tool; server-side Telemetry/marketplace defaults and the LICENSE multi-tenant clause apply if exposed.

**5) Glue responsibilities.** Task input, `--inputs`, app discovery: **built-in (difyctl)**. Result schema stdout/stderr split, exit codes, pause payload, `--stream`: **built-in**. Model/auth selection per run: **server-owned** (only `--workflow-id` pinning). Isolated cwd/context, filesystem scope: **absent** (app runs remotely) — adapter would have to own. Timeout: **absent** in `run app` (no `--timeout`); cancel only via Service API stop in streaming mode → adapter-owned. Concurrency: independent runs, server-side limits. Recovery: paused runs resumable; crashed/failed runs not resumable → adapter-owned.

**6) Mandatory services/deps, privacy.** Dify host (or Cloud), Postgres, Redis, Celery worker+beat, plugin_daemon, sandbox, published app with API enabled, egress to the host, plus `difyctl` on the caller. Auth token in OS keychain; device-flow login on the agent machine. Prompts/outputs transit the Dify server; marketplace/telemetry defaults apply.

**7) Lifecycle/control, overhead mechanisms.** App publishing, per-app API enable/disable, form expiry, workspace/host switching; user retains confirmation for `write`/`destructive` effects. Overhead mechanisms (no benchmark claims): per-run re-entry of the app graph prompts/variable injection, extra in-app LLM calls, and per-agent onboarding calls (`difyctl help -o json --compact`, `get app`, `describe app`). Bounded loops still do not guarantee obedient output; validate results.

**8) Conditions & one check.** **Choose-this-IF** a Dify host is already deployed, workers are Dify-app LLM graphs (not local CLI coding tasks), and Pi shelling out to `difyctl` is acceptable. **Reject-this-IF** the requirement is Pi orchestrating local `pi`/`claude` CLI processes with cwd isolation and process cancel/timeout. Smallest **read-only** next check (user-run, no writes): `difyctl describe app <app-id> -o json` against a candidate app — if there is no installed `difyctl` and no host, reject immediately; if the input schema is machine-readable, re-check only the Claude-side subscription/session mechanism separately (Agent SDK vs subscription login), since that is billed and authenticated independently of Dify.

## Sources
- Kept: dify-docs `difyctl` command index / skill install / output-and-exit-codes; dify `api/core/mcp/client` listing (no stdio); dify `service_api/app/workflow.py`; Claude Agent SDK Python README; shared `excerpts.md` Claude CLI/auth extracts.
- Dropped: marketplace plugin listings, blogs, third-party MCP plugins, fork READMEs.

## Gaps
No first-party evidence that any official Dify plugin/tool runs `claude`/`pi` locally; plugin-daemon subprocess capability unverified. Whether the user runs a Dify host is unknown and decisive. `difyctl` availability/version on the user's machine not checked (no execution).
