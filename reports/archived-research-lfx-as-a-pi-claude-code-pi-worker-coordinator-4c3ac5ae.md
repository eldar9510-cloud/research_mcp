---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-lfx-as-a-pi-claude-code-pi-worker-coordinator-4c3ac5ae",
    "title": "Research: LFX as a Pi → Claude Code / Pi worker coordinator",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: LFX as a Pi → Claude Code / Pi worker coordinator?",
    "scope": "Original Pi/tooling integration investigation: Research: LFX as a Pi → Claude Code / Pi worker coordinator. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: LFX as a Pi → Claude Code / Pi worker coordinator; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:38.050Z"
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
  "sourceDigest": "4c3ac5ae33fe6895181f6419176a8c36264df9df33ba08c3a1d084966594aaf2",
  "proposalRevision": "1ee6f25cf5585dde60e21fc99d24f12359e8f0a08d6aa1c56a00d347f21b2ebf"
}
---
# Research: LFX as a Pi → Claude Code / Pi worker coordinator

**Verdict: REJECT for the stated purpose (minimal Pi→bounded-worker coordination); CONDITIONAL only if the user wants human-inspectable multi-step flow artifacts. Corrects the earlier scout:** `lfx serve`'s `--workers/--timeout` flags are **not** in current first-party docs; the Loop node is **sequential, no concurrency primitive, no break, no time bound**.

## DECISION CARD

**1) Smallest package/primitive + topology.** `pip/uvx` package `lfx` (engine-only) and one console command: `uvx --from lfx lfx run flow.json --input-value "<task>" --format json` [`lfx-run`]. Topology: **Pi parent (brain) → adapter → worker**. If Langflow is used, the adapter *is* one flow containing exactly one custom Python component that spawns `claude -p --output-format stream-json …` (or `pi --mode json …`); no model/agent node may sit between Pi and the worker.

**2) Support classification.**
- **Pi child worker:** documented in Pi (`pi --mode json`, parent-verified) — **unverified in this repo**: no Langflow/Pi bridge exists in source; a custom component would be a **custom bridge**.
- **Claude Code worker:** **native + documented via the CLI** (`claude -p`, exit codes, `--output-format json|stream-json`, `--json-schema`, `--allowedTools`, `--permission-mode`, SIGTERM→143 + process-tree kill) [`headless`]. The **Agent SDK** is the same loop as a Python/TS library; **model API only** (Anthropic API key) is not Claude Code.
- **LFX support for launching CLIs: none built-in** — directory listings of `components/tools` (calculator, search APIs, `python_repl`) and `components/processing` (data ops only) contain **no shell/command/subprocess node** [api listings]. **Adapter-owned custom component required.**

**3) Why choose (2).** (a) Flow JSON is a version-controllable, `jq`-editable artifact of a multi-step task with `Loop`/`sub_flow`/`conditional_router`/`flow_tool` primitives, and `--format json` returns a parseable final `.result` [`lfx-run`]. (b) No server/DB/API key for `lfx run`, plus a documented growth path to HTTP (`lfx serve`) if flows later need to be shared.

**4) Why not (2).** (a) **The control plane is still hand-written**: `lfx run` options include no timeout, cancel, concurrency or exit-code contract, and `Loop` is sequential with no early break [`lfx-run`, `loop.py`] → subprocess spawn, per-line streaming, kill, output cap, cwd isolation, retries and concurrency are all custom code, now embedded in a langchain/FastAPI engine. (b) Real cost for one worker: engine install **plus per-component extension bundles** (`component-not-found-with-hint: … try ext:…@official`) [`lfx-serve`], and flow visualization/export only pays off with the full server (flows-as-MCP-tools need a running instance + API key).

**5) Glue responsibilities (built-in → adapter-owned).** Task input: `--input-value`/`--stdin` built-in; task→prompt mapping and unique cwd **adapter**. Isolation: cwd/`--add-dir`/`--bare` built-in (bare skips CLAUDE.md, hooks, MCP, auto-memory); worktree/env scrubbing **adapter**. Model/auth: `--model` + env built-in; subscription login only in **non-bare** mode **adapter choice**. Result schema: `stream-json`/`--json-schema` built-in; LFX gives only a final result JSON → parsing/truncation **adapter**. Cancel/timeout: SIGINT/SIGTERM semantics built-in on the Claude side; **absent in LFX → adapter**. Concurrency/recovery: **nowhere built-in** (sequential Loop; `lfx serve` concurrency undocumented) → adapter; no resume.

**6) Mandatory services/deps + privacy.** python env + langchain/FastAPI engine; extension bundle per component category; **no** DB/server/daemon/model-manager call for `lfx run` (unless a model node is in the flow); `lfx serve` = long-lived, `LANGFLOW_API_KEY`-protected FastAPI server [`lfx-serve`]. Privacy: Langflow **server** telemetry defaults on with `DO_NOT_TRACK` opt-out (earlier verified `__main__.py`); non-bare `claude -p` reads host `~/.claude` and repo `CLAUDE.md`/hooks, `--bare` does not (but **never reads OAuth/keychain** → needs `ANTHROPIC_API_KEY`, i.e. **API billing**) [`headless`].

**7) Lifecycle/tool control + token mechanisms (no benchmark claims).** Pi keeps policy: which worker, `--allowedTools`, permission mode; a worker needing approval must be given `--permission-mode auto|dontAsk|acceptEdits` / `--permission-prompts none` or it stalls (`--max-turns`, `--max-budget-usd` per CLI reference). Overhead mechanisms: extra model hops only if the flow contains routing/planning nodes; `-vvv` logs and raw `stream-json` relayed unfiltered inflate **Pi's** context — the adapter must summarize; offloading reduces Pi context only if the child works from its own cwd/artifacts. Bounded loops do not make an LLM worker obedient: validate the child's artifact/exit status.

**8) Choose-this-IF** multi-step, human-visualizable fan-out/aggregation is wanted and one authored Python component + the engine is acceptable. **Reject-this-IF** the need is one bounded worker/task with stdio streaming, kill/timeout and parallelism caps → a Pi-launched `claude -p --output-format stream-json` subprocess is strictly smaller.
**Smallest read-only check:** fetch `src/lfx/src/lfx/components/custom_component/custom_component.py` (919 B) to confirm the inline-code node's `CodeInput` API (does the launcher fit in flow JSON without a package?). User-authorized experiment only: one `lfx run` two-node flow whose second node runs `echo`, wall-clock bounded, **no model keys**.

## Sources
- Kept: [flow_controls/loop.py](https://raw.githubusercontent.com/langflow-ai/langflow/main/src/lfx/src/lfx/components/flow_controls/loop.py) — sequential, no concurrency/timeout; [lfx run docs](https://docs.langflow.org/lfx-run) — option table, `--format json`; [lfx serve docs](https://docs.langflow.org/lfx-serve) — API key, extension bundles, no worker/timeout flags; [custom components docs](https://docs.langflow.org/components-custom-components) — `Component` API, `_run`, components path/dir depth; [Claude Code headless](https://code.claude.com/docs/en/headless.md) — `-p`, stream-json, bare-mode auth conflict, SIGTERM; GitHub API listings `.../components`, `.../components/tools`, `.../components/processing`, `.../components/custom_component`, `.../components/flow_controls` — no CLI/subprocess node.
- Dropped: Langflow MCP-server marketing pages, third-party tutorials, prior scout's `--workers/--timeout` claim (not in current first-party docs).

## Gaps
No execution probes: `lfx run` cold-start, stdout behavior under a child that streams, and whether a core `Loop`/custom component honors process-group kill are untested. Whether `pi --mode json` works as a component child is unverified.
