---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-crewai-flow-as-coordinator-of-pi-claude-code-cli-workers-choose-or-reje-5c6c4f8e",
    "title": "Research: crewAI Flow as coordinator of Pi + Claude Code CLI workers — choose or reject",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: crewAI Flow as coordinator of Pi + Claude Code CLI workers — choose or reject?",
    "scope": "Original Pi/tooling integration investigation: Research: crewAI Flow as coordinator of Pi + Claude Code CLI workers — choose or reject. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: crewAI Flow as coordinator of Pi + Claude Code CLI workers — choose or reject; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:37.591Z"
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
  "sourceDigest": "5c6c4f8e97a4de40857c991ee8955451c19c83226315a332687d91bbe69d6ed0",
  "proposalRevision": "577893b036f261820a8a150e0a4eac935169e1873da167437e878ec9f2307cd8"
}
---
# Research: crewAI Flow as coordinator of Pi + Claude Code CLI workers — choose or reject

Date 2026-09-27. Public-source, read-only. No install, clone, execution, credential or config change.

## Summary
**Reject** CrewAI (Flow or `Agent.kickoff`) as the coordination layer here. A Flow *can* run zero-LLM steps that shell out to `pi --mode json` or `claude -p`, and its thread-offload model keeps a blocking subprocess off the event loop. But there is **no Flow-only artifact or import path**: the smallest Flow drags in the whole framework, auto-creates LanceDB-backed memory at kickoff, egresses telemetry carrying host-agent identity by default, and offers no cancel contract for spawned children. Pi's documented `pi --mode json` child mode plus Claude Code's documented `-p` JSON/stream-JSON CLI (both first-party) already satisfy "one bounded CLI worker per task" without a Python framework.

## Findings
1. **No Flow-only import.** `crewai/__init__.py` eagerly imports Agent, Crew, Task, LLM, Knowledge, Flow; monkeypatches global `warnings.warn`; injects namespaces into other modules' `__dict__`; then `model_rebuild(force=True)` on ~8 models. Any `from crewai.flow import Flow` executes all of it. [lib/crewai/src/crewai/\_\_init\_\_.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/__init__.py)
2. **No flow-only install.** `crewai` hard-requires chromadb, lancedb, opentelemetry-api/sdk/otlp-http, mcp, pdfplumber, instructor, openai, aiosqlite, plus `crewai-cli` wheel (uv/textual/rich). The extras list has no `flow` extra. [lib/crewai/pyproject.toml](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/pyproject.toml)
3. **A Flow genuinely needs no LLM or agent** (observed): steps are plain methods; sync steps run via `asyncio.to_thread(ctx.run, method, …)`; parallel `@start` methods run under `asyncio.gather`, with a `run_starts_sequentially` ordering path. LLMs appear only for `@router(llm=…)`, `@human_feedback` collapse and memory analysis. So the "coordinate CLIs deterministically" premise is technically true.
4. **Memory is not optional by default** (observed): kickoff does `if self.memory is None and not getattr(self, "_skip_auto_memory", False): self.memory = Memory(root_scope=f"/flow/{name}")`. Default `Memory` = LanceDB storage, `llm="gpt-5.4-mini"`, OpenAI embedder (lazy) — a private class flag is the only escape found, so "no memory machinery" is false by default.
5. **Cancel is best-effort, not a contract** (observed): racing OR listeners use `as_completed` then `task.cancel()` on losers; `ask(timeout=)` uses a `ThreadPoolExecutor` future cancel with `shutdown(wait=False)`; sync `kickoff()` runs `asyncio.run` on a single-worker pool. No `Flow.cancel` exists. Stdlib semantics (not repo-verified): cancelling a coroutine parked in `asyncio.to_thread` does not stop the thread — a spawned CLI child can outlive cancellation. [flow/runtime/\_\_init\_\_.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai/src/crewai/flow/runtime/__init__.py)
6. **Telemetry is on by default**: OTLP to `https://telemetry.crewai.com:4319/v1/traces`, disabled only by `OTEL_SDK_DISABLED` / `CREWAI_DISABLE_TELEMETRY` / `CREWAI_DISABLE_TRACKING`; every span carries `detect_coding_agent()`, `runtime_context`, `cpu_band` and `project_id` read from the host project. Module docstring claims no prompts/task text/responses. Whether a purely deterministic Flow actually exports a span depends on `should_enable_tracing`, which I did not resolve. [crewai-core/telemetry.py](https://raw.githubusercontent.com/crewAIInc/crewAI/main/lib/crewai-core/src/crewai_core/telemetry.py)
7. **Claude Code auth split (decisive, first-party)**: non-bare `claude -p` uses the subscription/OAuth login; `--bare` explicitly "doesn't use your subscription login" and needs `ANTHROPIC_API_KEY`. Documented for scripting: `--output-format stream-json --verbose`, `--json-schema`, `--max-turns`, `--permission-mode` (default in `-p` is Manual), `--allowedTools`, `--permission-prompts none`; SIGTERM → exit 143 and kills the Bash process tree, SIGINT ends the turn. [headless.md](https://code.claude.com/docs/en/headless.md)
8. **Agent SDK ≠ separate auth**: the Python SDK bundles and runs the Claude Code binary, so it is the same credential channel as the CLI, not model-API billing. But its overview states Anthropic "does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK", under Commercial ToS with branding limits. [agent-sdk/overview.md](https://code.claude.com/docs/en/agent-sdk/overview.md)

## Decision card
1. **Smallest primitive / topology**: Pi parent (brain, interface) → one adapter process per worker → worker CLI. If CrewAI were used, that primitive is `Flow` (not Agent/Crew) with one `@start` step per worker whose body is `subprocess`/`create_subprocess_exec` of `pi --mode json "…"` or `claude -p … --output-format stream-json`.
2. **Classification**: Pi worker = native/documented on the Pi side (`pi --mode json`, installed docs), **custom bridge** from CrewAI (repo contains no Pi integration). Claude Code = **documented native CLI**; Agent SDK = documented wrapper over the *same CLI binary*; model-API-only (ANTHROPIC_API_KEY / Messages) is a distinct, unwanted path. Any Pi-in-CrewAI or Claude-in-CrewAI process bridge = **unverified**, untested.
3. **Choose because**: (a) shipped durable state (pydantic), checkpoint/resume, pause-for-human-feedback, `or_`/`and_` racing and parallel starts — real value if workflows must survive restarts; (b) typed state plus a per-method event bus gives an integration seam. **Reject because**: (a) a whole agent framework, mandatory chromadb/lancedb/otel/mcp/CLI wheel and import-time global side effects for what is a launcher; (b) default auto-memory (LanceDB + `gpt-5.4-mini` + OpenAI embedder) and default-on telemetry bearing host-agent identity.
4. **Hard blockers / conditions**: subscription reuse is CLI-only (non-bare `-p`); `--bare` forecloses it; distributing subscription login inside a product is policy-restricted; per-worker API keys would create new billing (rejected); Pi-child auth stays Pi-owned, bridge untested.
5. **Glue responsibilities** — built-in (CrewAI): state, listeners, events, checkpoint/persistence, feedback pause. Adapter-owned: task input framing, isolated cwd per worker, model/auth selection, mapping `pi` JSON events and `claude` stream-json (`result`, `structured_output`, usage) into one result schema, process-group kill + timeouts, concurrency cap, retry/recovery, telemetry opt-out.
6. **Mandatory services/deps/background**: chromadb, lancedb, OTel + OTLP exporter thread + atexit flush, event bus, memory save pool, rich console. Privacy default: outbound telemetry with coding-agent identity — set `OTEL_SDK_DISABLED`/`CREWAI_DISABLE_TELEMETRY` if CrewAI were ever used.
7. **Lifecycle/tool/user control, token overhead**: no mandatory LLM call in a deterministic Flow (unlike `Agent.kickoff`, whose defaults add context-window summarization, `max_iter`, retries); overhead here is dependency, import and egress, not tokens. Risk of accidental model spend exists in auto-Memory, `@human_feedback(learn=True)` and LLM routers. No benchmark claims.
8. **Choose-this-IF** you need resumable human-in-the-loop multi-step workflows with typed state and accept the framework install; **reject-this-IF** the goal is minimal bounded CLI workers under a Pi brain (this case). **Smallest next check** (read-only, needs user authorization): in an isolated venv with no provider keys, time `from crewai.flow import Flow`, watch for network egress and created `~/.crewai`/LanceDB paths at kickoff, and confirm whether `task.cancel()` leaves a spawned child alive.

## Sources
- Kept: `lib/crewai/src/crewai/__init__.py` — decisive: no lazy Flow import, global import side effects.
- Kept: `lib/crewai/src/crewai/flow/runtime/__init__.py` — decisive: step execution model, parallel/racing dispatch, `task.cancel()`, auto-Memory, `ask` timeout semantics.
- Kept: `lib/crewai/pyproject.toml` — decisive: mandatory dependency set, absence of a flow-only extra.
- Kept: `lib/crewai-core/src/crewai_core/telemetry.py` — decisive: default-on OTLP endpoint, opt-out env vars, host-identity attributes.
- Kept: `code.claude.com/docs/en/agent-sdk/overview.md` and `…/headless.md` — decisive: SDK runs the CLI binary; subscription vs `--bare` API-key auth; scripting flags and signal behaviour.
- Dropped: prior-crewai scout prose (superseded here), third-party blog/SEO summaries of CrewAI Flows (no primary detail).

## Gaps
Unresolved: whether `should_enable_tracing` suppresses Flow spans by default; whether the private `_skip_auto_memory` flag is a stable public escape; exact real-world cost of a Claude Code subscription worker under repeated headless runs (rate-limit vs spend behaviour). None requires installing CrewAI to answer; the venv experiment above is the minimal resolver.

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "report.md cites exact source paths with file-level findings: lib/crewai/src/crewai/__init__.py (eager Agent/Crew/LLM import + global warnings monkeypatch + model_rebuild side effects, so no Flow-only import path), lib/crewai/pyproject.toml (mandatory chromadb/lancedb/opentelemetry/mcp/crewai-cli deps, no 'flow' extra), lib/crewai/src/crewai/flow/runtime/__init__.py (to_thread step execution, asyncio.gather parallel starts, as_completed + task.cancel() for racing listeners, auto-created Memory(root_scope='/flow/<name>'), ask() best-effort timeout, no Flow.cancel), lib/crewai-core/src/crewai_core/telemetry.py (default-on OTLP to telemetry.crewai.com:4319 with detect_coding_agent/project_id attributes, opt-out env vars only), plus first-party Claude docs for CLI-vs-SDK auth split."
    }
  ],
  "changedFiles": [
    "/home/eldar/.local/share/pi-research/worker-runner-decisions-20260927T073227Z-j88cmvax/crewai/report.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [],
  "validationOutput": [
    "Source inspection only; no execution. Verified: crewai/__init__.py imports Agent, Crew, Task, LLM, Knowledge, Flow at module import and mutates sys.modules[other].__dict__ + calls model_rebuild(force=True); flow/runtime module is a single ~164 KB file whose dispatch cancels losing racing listeners with task.cancel() and whose kickoff auto-instantiates Memory unless the private _skip_auto_memory flag is set; crewai_core/telemetry.py exports spans to https://telemetry.crewai.com:4319/v1/traces unless OTEL_SDK_DISABLED/CREWAI_DISABLE_TELEMETRY/CREWAI_DISABLE_TRACKING is set; Claude docs separate non-bare -p subscription login from --bare ANTHROPIC_API_KEY, and state the Agent SDK runs the bundled Claude Code binary."
  ],
  "residualRisks": [
    "CrewAI main is a moving branch; findings describe the revision fetched on 2026-09-27 and are not pinned to a release tag.",
    "Whether a deterministic Flow actually exports a telemetry span depends on should_enable_tracing, which was not resolved; telemetry default-on is confirmed at the crewai-core layer, not per-Flow-span.",
    "That cancelling a coroutine parked in asyncio.to_thread leaves the spawned CLI child running is standard-library behaviour, not verified in CrewAI source or by execution.",
    "Whether the private _skip_auto_memory flag is a supported public escape from Flow's auto-Memory is unknown.",
    "No Pi-to-CrewAI or Claude-to-CrewAI bridge exists in-repo; the proposed adapter topology is proposed, not observed.",
    "No install, execution, credential read or benchmark was performed; token/latency behaviour is unmeasured by design."
  ],
  "noStagedFiles": true,
  "diffSummary": "Added report.md: reject decision for CrewAI Flow as Pi/Claude CLI worker coordinator, with an 8-point decision card, exact source citations and one proposed minimal read-only check.",
  "reviewFindings": [
    "no blockers: read-only web research; no repository code, installs, credentials, model probes or Jev calls touched.",
    "finding: report.md - prior scout claim that Flow avoids memory machinery is corrected (auto-created Memory at kickoff unless private _skip_auto_memory), and prior claim of a separate lightweight Flow import path is corrected (crewai/__init__.py always executes).",
    "finding: report.md - dependency weight is explicitly separated from token cost; no token/dollar/hour estimates are given.",
    "finding: report.md - Claude Code subscription reuse is attributed to the CLI/OAuth channel only; Agent SDK is classified as a wrapper over the same binary, with the third-party claude.ai login restriction recorded as a policy blocker for product distribution."
  ],
  "manualNotes": "The user asked for a benefit-over-simple-subprocess-launcher case; the honest answer is that Flow's deterministic-DAG value is real but only pays off for resumable human-in-the-loop workflows, which is not the stated requirement. Nothing was installed, cloned or executed; the one proposed next step is a user-authorized isolated-venv import/egress check."
}
```
