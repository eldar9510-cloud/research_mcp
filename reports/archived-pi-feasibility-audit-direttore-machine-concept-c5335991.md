---
{
  "format": 1,
  "metadata": {
    "id": "archived-pi-feasibility-audit-direttore-machine-concept-c5335991",
    "title": "Pi Feasibility Audit — `direttore` (Machine_concept)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Pi Feasibility Audit — `direttore` (Machine_concept)?",
    "scope": "Archived Machine_concept Pi-design feasibility and API mapping. The historical design, runtime/version assumptions and unimplemented gaps remain explicit; no current adoption or provider compatibility is asserted.",
    "summary": "Historical Pi feasibility audit for the archived direttore design; implementation/prototype observations are not current policy or permission to add an orchestration framework.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "This report studies a retired/historical orchestration proposal. It is reference material, not active Pi instructions or a mandate to restore its compiler/ledger/gates."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:47.057Z"
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
  "sourceDigest": "c533599164e0261c51f13f0f8385d25893076850243d1c8bd4fbe42a095711af",
  "proposalRevision": "0540e11e5fe2d8c65cfa15a82a842e71bf052d73fd22a2943b21710acb7f247b"
}
---
# Pi Feasibility Audit — `direttore` (Machine_concept)

**Audit type:** high-effort technical feasibility of the approved `direttore` design against the installed Pi runtime (v0.84.2), its documentation, and its shipped examples.
**Question answered:** can the promised behavior be built through **project-local Pi extensions/config** without forking Pi?
**Inputs read in full where relevant:** `approved-decisions.md`, `approved-decisions.acceptance.md`, `requirements-interview.md`, `directory-reports/root-architecture.md`, repo-root `PI_MACHINE_CONCEPT_AGENT_DESIGN_REPORT.md`, and installed Pi docs `extensions.md`, `tui.md`, `sdk.md`, `models.md`, `skills.md`, `prompt-templates.md`, `settings.md`, `sessions.md`, `session-format.md`, `custom-provider.md`, `providers.md`, `security.md`, `usage.md`, `compaction.md`, `packages.md`, `keybindings.md`, `themes.md`, `json.md`, `rpc.md`, `environment-variables.md`, plus examples `extensions/subagent/` and `extensions/plan-mode/`.
**Method:** read-only. No source files were edited. This report is the only write.

---

## 0. Executive summary

**Bottom line: yes, ~80% of the promised `direttore` behavior is buildable as project-local Pi extensions/config without forking Pi. The critical caveat is that Pi deliberately ships *none* of the high-level primitives the design assumes (MCP client, subagents, permission/allowlist framework, plan mode, sandbox), so every one of those is a from-scratch extension, not a config toggle.** Two promises are *not* buildable without a fork or a real capability gap: (1) a native MCP client — Pi has no MCP support, so the six `.mcp.json` servers must be re-bridged; (2) enforcement-grade permission boundaries — Pi has no sandbox, so every "block" is advisory (prompt/extension-level), not a security boundary.

The largest feasibility risks are the **MCP re-bridge** (decision #64/#65), the **subagent depth/recursion seam** (#16/#28–31, no `maxSubagentDepth`), the **headless visual-pause semantics** (gap-list #8), and the **advisory-only nature of every write/destructive/one-writer guard** (#32–#36, #7, #21, #44).

---

## 1. What Pi *does* provide natively (verified)

These are the building blocks `direttore` can rely on, each verified against the installed docs/examples:

| # | Capability | Pi evidence | Directly serves decisions |
|---|---|---|---|
| P1 | Project-local extension discovery | `.pi/extensions/*.ts`, `.pi/extensions/*/index.ts` auto-discovered after project trust (`extensions.md`) | #86, #3, #75 |
| P2 | Project-local skills / prompts / themes | `.pi/skills/`, `.pi/prompts/`, `.pi/themes/`, `.pi/settings.json` (`skills.md`, `settings.md`, `themes.md`) | #74, #93, #14 |
| P3 | Project settings with global merge | `.pi/settings.json` overrides `~/.pi/agent/settings.json`; nested merge (`settings.md`) | #75, #77 |
| P4 | Custom tools (LLM-callable) | `pi.registerTool({...})` + `promptSnippet`/`promptGuidelines`, dynamic activation via `pi.setActiveTools()` (`extensions.md`) | #32, #96 |
| P5 | Tool-call interception / gate | `tool_call` hook can `{block:true, reason, terminate}`; `tool_result` can mutate results; `input` can intercept/transform (`extensions.md`) | #36, #32, #44, #63 |
| P6 | Built-in tool allowlist at launch | `--tools read,grep,find,ls`, `--no-builtin-tools`, `--exclude-tools` (`usage.md`, `sdk.md`) | #32, #52 |
| P7 | Subagent spawning (example) | `examples/extensions/subagent/` spawns `pi --mode json -p --no-session --model X --tools A,B,C --append-system-prompt <packet>`; supports single/parallel(≤8, ≤4 concurrent)/chain modes (`subagent/README.md`, `index.ts`) | #5, #12, #22, #23, #46–48 |
| P8 | Per-subagent model + tool frontmatter | agent `.md` frontmatter `name/description/tools/model`; `tools` → `--tools` allowlist; `model` → `--model` (`subagent/agents.ts`) | #46–48, #32 |
| P9 | Model registry / DeepSeek | Built-in `deepseek` provider; default `deepseek-v4-pro` (verified in `dist/core/model-resolver.js`); `deepseek-v4-flash` appears in `models.md`; custom models via `~/.pi/agent/models.json` (`models.md`, `providers.md`) | #46–48 |
| P10 | Model tier recorded at runtime | `ctx.model.provider/id`, `ctx.thinkingLevel`, bash-tool env `PI_PROVIDER`/`PI_MODEL`/`PI_REASONING_LEVEL` (`extensions.md`, `environment-variables.md`) | #49, #47, #58 |
| P11 | Session persistence + tree/branch/resume | JSONL session format, `SessionManager` API, `/resume`, `/fork`, `/clone`, compaction, branch summaries (`sessions.md`, `session-format.md`, `compaction.md`) | #15, #25, #72 |
| P12 | Extension durable state | `pi.appendEntry()` (session custom entries, not LLM context) + `SessionManager` restore on `session_start` (`extensions.md`) | #71 (partial), #96 |
| P13 | Custom TUI | `ctx.ui.custom()` full components, widgets above/below editor, custom footer/header, overlays, keybindings (`tui.md`, `keybindings.md`) | #89–94 |
| P14 | Human-gate dialogs | `ctx.ui.select/confirm/input/editor` in TUI; `extension_ui_request` protocol in RPC (`extensions.md`, `rpc.md`) | #20, #63, #34–36 |
| P15 | Read-only / plan-mode reference | `examples/extensions/plan-mode/` disables edit/write via `pi.setActiveTools()` and filters bash through an allowlist; pure-utility `utils.ts` for testability | #36, #82 |
| P16 | CLI flags / commands / shortcuts | `pi.registerFlag`, `pi.registerCommand`, `pi.registerShortcut` | #92, #89 |
| P17 | Context files auto-load | `AGENTS.md` / `CLAUDE.md` walking up from cwd; `AGENTS.override.md` override (`usage.md`) | #3 (partial) |

**Verification record** (this session, read-only):
- `package.json` version `0.84.2`; peer deps `pi-ai`/`pi-agent-core`/`pi-tui` all `^0.84.2`, `typebox` `1.3.7`.
- `defaultModelPerProvider.deepseek = "deepseek-v4-pro"` (`dist/core/model-resolver.js:19`).
- `.mcp.json` contains 6 stdio servers, all absolute paths.
- `usage.md` explicit: Pi "intentionally does not include built-in MCP, sub-agents, permission popups, plan mode, to-dos, or background bash."
- `subagent/index.ts` listens for `message_end` and **`tool_result_end`**; `tool_result_end` is **not** documented in `json.md` or `rpc.md` (both list only `tool_execution_*`, `message_*`, `turn_*`, `agent_*`). API-drift risk (see §5).
- `security.md`: `.pi/agents/` is **not** a project-trust trigger; only `.pi/settings.json`, `.pi/extensions`, `.pi/skills`, `.pi/prompts`, `.pi/themes`, `.pi/SYSTEM.md`, `.pi/APPEND_SYSTEM.md`, and project `.agents/skills` are.

---

## 2. Decision-by-decision feasibility map

Legend: ✅ buildable via project-local extension/config · 🟡 buildable with a non-trivial extension (engineering work + a seam risk) · 🔴 not buildable without a fork / real capability gap.

| Decision # | Promise | Verdict | Evidence / mechanism | Risk |
|---|---|---|---|---|
| 1, 2, 8, 10, 11 | Full coding agent, whole-repo scope, auto-activate, coexist→replace | ✅ | Pi is a full coding harness; repo scope = cwd; auto-activate = `.pi/` + trust; coexist with Claude Code (both are separate harnesses) | Trust bootstrap (§5 G9) |
| 3, 14, 74, 87 | Thin `.pi/` layer; Pi-native policy manifest authoritative; right-context-depth | 🟡 | `.pi/` resources native; but YAML/LinkML manifest has no native Pi parser — extension must load/parse YAML (or a pre-generated JSON); auto-inject root+module context is extension work (`before_agent_start`/`systemPromptOptions`) because Pi only auto-loads cwd-walk `CLAUDE.md`, **not** sibling module `CLAUDE.md` | Manifest schema scope unresolved (#7 in gap list); YAML dep |
| 4, 17, 18, 27, 52 | Hybrid routing, compact receipts, silent-till-blocked, minimal packets | 🟡 | Router = extension tool/command; receipts = structured tool result + `.pi/ledger/` writes; subagent child renders via `renderResult` (collapsed fleet view) | Router must be deterministic/testable (#80) |
| 5, 19, 28–31 | Specialist structure; dynamic role-instantiation; brainstorm (read-only parallel + synthesis) | 🟡 | Subagent example gives single/parallel/chain; role packs = `.pi/agents/*.md` (via `discoverAgents`) or extension-held role dicts; read-only brainstorm = `--tools read,grep,find,ls` per agent | No `maxSubagentDepth`; recursion guard is manual (§5 G8); brainstorm synthesis needs main-session assembly |
| 6 | Agent name `direttore` | ✅ | Cosmetic (session name, prompts) | — |
| 7 | English | ✅ | Prompt-level | — |
| 9 | Main-session model = user-selected; subagent routing independent | ✅ | `ctx.model` = main; subagent `--model` independent (P8) | — |
| 12–16, 23, 26 | Auto-delegation, curated packets, escalation, parallel teams, concurrency cap, partial-failure ask | 🟡 | Subagent tool spawns independent `pi` processes; parallel ≤8/≤4 built into example; cap configurable; escalation = subagent returns a `needs_decision` result that main re-dispatches | Escalation is a return-value convention, not a pause primitive; no scheduler — concurrency is example-code-owned |
| 20, 21, 24, 25 | Brief plan then proceed; review on request; per-module retry limits; ignore-unless-referenced recovery | 🟡 | Plan = `before_agent_start`/`plan-mode`-style widget; retry limits = extension counter + on-disk state; recovery = Pi `/resume` (ignore = don't auto-resume) | Retry policy is fully custom; no native workflow engine |
| 28–31 | Brainstorm mandatory | 🟡 | Parallel read-only subagents → peer-critique round → synthesis, all as subagent tool modes | Synthesis quality is model-dependent; no native "read-only enforcement" (advisory only) |
| 32, 35, 36, 41, 44 | Per-agent allowlists; safety-critical approval; destructive block; auto-shell; external-source auth | 🟡 | Real per-subagent tool allowlist via `--tools` (P6/P8); main-session gates via `tool_call` hook + `ctx.ui.confirm` + `pi.setActiveTools()`; bash filtered like `plan-mode` `utils.ts` | **Advisory only** (no sandbox); external-source auth = main records + gates, subagents (`--no-session`) cannot see user text (§4) |
| 33, 7 | One-writer protection, diff audit | 🟡 | On-disk lock files in `.pi/ledger/locks/` + `tool_call` hook + post-task `git status`/`git diff` audit | No native scheduler; cross-process locks are convention-only |
| 37, 45, 66 | Credentials, web access, stealth-fetch | 🟡 | Credentials via `auth.json`/env; web via custom tools + `stealth-fetch` **only after MCP re-bridge** (§3) | Secret isolation = none beyond user account |
| 38, 39, 40 | Never auto-commit; leave regenerated outputs; writes-outside-repo approval | 🟡 | `tool_call` hook on `bash` (`git commit/push`) and `write`/`edit` path checks (mirror `protected-paths.ts`/`plan-mode` examples) | Advisory only |
| 42, 43, 67, 68 | Expensive-validation ask; external-gate pending; env provisioning; this workstation | 🟡 | `tool_call` hook on expensive `bash` commands → `confirm`; external gates = receipt `pending/unsupported`; provisioning = setup script (extension or standalone) | Env provisioning is a one-time script, not Pi config |
| 46–51 | DeepSeek Flash default subagents; strong tier `deepseek-v4-pro`; fallback policy; no runtime model check | 🟡 | `deepseek-v4-flash` (subagent frontmatter `model`) + `deepseek-v4-pro` (strong tier); "stop on Flash unavailable" = router checks `pi.setModel`/`ModelRuntime.getAvailable()` and refuses; runtime model tier recorded via `ctx.model`/`msg.model` | Exact catalog IDs / `[1m]` suffix remap (§5 V1–V2); offline catalog refresh |
| 52, 53, 54, 87 | Bare-bones subagents; token telemetry; token-friendly operation | ✅ | Subagent usage (`input/output/cacheRead/cacheWrite/cost/contextTokens`) already aggregated by example (`formatUsageStats`); `ctx.getContextUsage()`, `get_session_stats` RPC; warnings via `ctx.ui.notify` | — |
| 55–62 | Baseline manifest; machine health; visual pause; receipts; source authority; conflict precedence; baseline updates | 🟡 | Baseline/health/precedence = extension-managed manifest files + validation hooks; receipts = structured result + ledger; visual pause = `tool_call` hook → `confirm` + path display | **Headless visual pause semantics undefined (gap #8)** — `confirm` is a no-op in `-p`/`--mode json` |
| 63, 20 | Human gates | ✅ | `ctx.ui.confirm/select/input` (TUI), `extension_ui_request` (RPC) (P14) | Degrades in headless print/json |
| 64, 65 | Lazy-start all 6 MCP servers; Gemini cost-gated | 🔴→🟡 | **No native MCP.** All 6 must be re-bridged via an extension MCP client + stdio spawn (see §3) | Highest-effort item; Gemini budget gate must be re-implemented in the bridge |
| 69, 70 | Gemini auto-on-route, no budget gate; completed-only durable reports | 🟡 | After MCP bridge; report durability = extension writes `GEMINI_RESEARCH/reports/` | Billable-spend has no server-side cap (repo fact F42) |
| 71–77 | `.pi/ledger/` receipts (gitignored); no orchestration log; durable knowledge on approval; `.pi/` VC split; PRD at `.pi/docs/direttore/` | ✅ | `pi.appendEntry` (session) **or** extension `node:fs`/`bash >>` writes to `.pi/ledger/`; gitignore via `.pi/.gitignore`; PRD path is plain docs | Note: `appendEntry` persists to session JSONL, **not** `.pi/ledger/` — receipts must be file writes if they must be transverse |
| 78, 79 | Compatibility contract (hard list); fix only blockers | 🟡 | Extension-enforced hard-list of protected paths (mirror `protected-paths.ts`) | List content is a design deliverable |
| 80–85, 31 | MVP acceptance tests (8 domains), capability validation gate, thresholds | 🟡 | Tests = scripted headless `pi --mode json`/SDK runs + subagent probes; §4-hazard negatives = refusal tests | No native test harness; `render(width)` is headless-testable but a harness must be written (Q82) |
| 86, 88 | Project-local MVP; sequence routing→orchestration→receipts→tests→dashboard | ✅ | `.pi/extensions/` + `.pi/settings.json` + `.pi/skills/` | — |
| 89–94 | Dedicated TUI/dashboard; integrated-first; content + controls; Pi styling; TUI acceptance | 🟡 | `ctx.ui.custom()`, widgets, footer, overlays, keybindings.json, themes (P13) cover all Q79/Q81/Q92 content/controls; standalone dashboard seam = RPC/JSON event stream (no web UI) | **No shipped TUI test harness**; component/state tests are custom code (Q82 risk) |
| 95 | Pi-native YAML/LinkML manifest authoritative | 🟡 | Extension parses manifest (no native YAML/LinkML); maps it to `.pi/settings.json` + routing + `--tools` allowlists | YAML parser dependency + schema design (gap #7) |
| 96 | 13 candidate capabilities | 🟡 | All buildable (context broker, workflow DAG, capability registry, event dashboard, decision registry, replay evals, telemetry) via tools + session export + on-disk state | Each must pass #81–85 |

---

## 3. The MCP gap (decision #64/#65) — detailed

Pi has **zero** built-in MCP support: `usage.md` states it explicitly, and neither `docs/` nor `examples/` contain an MCP client or `.mcp.json` parser. The repo's `.mcp.json` (6 stdio servers, all absolute paths) is a **Claude-Code-native** file that Pi will not read.

To honor #64/#65, `direttore` must ship a project-local extension that:

1. Parses `.mcp.json` (or its own Pi manifest) for the 6 server commands.
2. Spawns each server lazily as a stdio subprocess on first tool use (honors #64).
3. Speaks the MCP JSON-RPC `initialize`/`tools/list`/`tools/call` handshake — i.e., **vendors an MCP client**, since none is bundled.
4. Registers each server's tools as Pi custom tools (`pi.registerTool`) or routes them through one generic `mcp_call` tool.
5. Enforces the per-server cost gate for `gemini-research` (decision #69/#70) in the bridge, since no Pi-side budget register exists natively.

**Partial mitigations** (reduce but do not eliminate the work):
- `codegraph` has a non-MCP CLI fallback (`codegraph callers/status/query`), so structure queries can bypass MCP.
- `code-intelligence` (`memgraph.py`/`agentfind.py`) exposes plain Python entry points callable in-process — but via `stepcad` python only (L1 env split, root-architecture §9).
- `normative-standards`, `stealth-fetch`, `gemini-research` are MCP-only surfaces; each needs the bridge.

**Net:** #64/#65 are the single largest custom-build item and the one most likely to be under-scoped in the plan. The env split (stepcad py3.10 / `.venv` py3.12) plus absolute paths must be preserved exactly or the bridge breaks silently.

---

## 4. Security boundaries (the "advisory, not enforcement" problem)

Pi's own `security.md` is unambiguous: **no built-in sandbox**; project trust is "only an input-loading guard"; extensions run with full user permissions; prompt injection from repo files is "expected local-agent risk and cannot be reliably prevented."

Consequence for the safety-critical decisions (#32–#36, #7, #21, #44):

| Guard | Pi reality | Security level |
|---|---|---|
| Per-subagent tool allowlist (#32) | Real: `--tools` strictly limits the subagent process's tools | ✅ real for subagents |
| Main-session write approval (#34/#35) | `tool_call` hook → `ctx.ui.confirm` / `pi.setActiveTools()` | Advisory (extension code decides; model can still call a non-hooked path) |
| Destructive-op block (#36) | Bash regex filter (`plan-mode` `utils.ts` pattern) | Advisory, pattern-matching only |
| One-writer locking (#33/#7) | On-disk lockfiles + hook | Convention, no OS enforcement |
| External-source auth (#44) | Subagents run `--no-session` and **cannot see user-typed text**; main session must record authorization and gate the dispatch | Advisory; relay prohibition is a policy, not an OS boundary |
| Credentials (#37) | `auth.json` (0600) / env vars; no per-subagent isolation; extension must avoid logging | User-account boundary only |

**Recommendation:** treat all of the above as *policy enforced in extension code* (which is exactly what decision #32/#96 "policy enforcement in extension code" already accepts), and be explicit in the PRD that Pi provides **no** sandbox. For untrusted build/run (TOOLS external-source rule), the repo already mandates CLI isolation; that rule is the only real boundary and must remain non-negotiable.

---

## 5. Version / API / lifecycle risks

| ID | Risk | Evidence | Severity |
|---|---|---|---|
| V1 | **`deepseek-v4-flash[1m]` frontmatter is Claude-Code syntax.** The `[1m]` context marker must be remapped to a Pi `models.json` `modelOverrides` `contextWindow`/`maxTokens`, or to the subagent `model:` string `deepseek-v4-flash`. `deepseek-v4-flash` is not in `defaultModelPerProvider` (only `deepseek-v4-pro` is) but appears in `models.md`. | `models.md`; `dist/core/model-resolver.js` | **High** — wrong model string → silent no-match or fallback |
| V2 | **Model catalog refresh is network-dependent** (`pi.dev`, throttled 4h). Offline (`PI_OFFLINE`) restores cached `models-store.json`; first run without cache may not expose `deepseek-v4-flash`. | `sdk.md` §Model | Medium |
| V3 | **Subagent example relies on undocumented event `tool_result_end`.** `json.md`/`rpc.md` document `tool_execution_*` + `message_*` + `turn_*` + `agent_*`, not `tool_result_end`. The example listens for it to capture tool results. | `subagent/index.ts:384` vs `json.md`/`rpc.md` | **High** — example may drift/break on Pi updates; validate against the live stream before adopting |
| V4 | **Pi is 0.84.2, extension API is `^0.84.2` peer deps, no semver freeze.** The extension API and internal JSON event shapes are implementation-coupled. | `package.json` | Medium-High — pin the Pi version or vendor pinned copies |
| V5 | **`pi.setModel()` returns `false` without an API key; subagent `--model` fails hard if the model lacks auth.** #48 "fallback to Flash only after explicit approval" and #51 "stop rather than silently change models" both require an availability check before dispatch. | `extensions.md` §pi.setModel; `models.md` | Medium |
| V6 | **No `maxSubagentDepth` anywhere.** The design (main → lead → workers; brainstorm peer rounds) can exceed the example's implicit depth of 2, and nothing stops runaway recursion. A manual depth counter + refusal is mandatory. | grep for `maxSubagent`/`depth` across docs/examples → zero hits | **High** (gap #6 in approved-decisions) |
| V7 | **Trust bootstrap.** Adding `.pi/extensions/` + `.pi/settings.json` makes `Machine_concept` a "trusted-resource" project; first interactive run prompts, headless `-p`/`json`/`rpc` silently ignore project resources under `defaultProjectTrust: ask|never`. Auto-activate (#8) needs `~/.pi/agent/trust.json` saved, or `defaultProjectTrust: always` + `--approve` in headless dispatches. | `security.md`, `settings.md` | High — headless subagent/dispatch runs must pass `-a`/`-e` or trust pre-saved |
| V8 | **Headless UI degradation.** In `-p`/`--mode json`, `ctx.hasUI=false` and `confirm/select` are no-ops; in RPC, `custom()` returns `undefined` and setFooter/setWidget degrade to text arrays. The "always pause for visual confirmation" (#57) and "pause-and-ask" gates (#20/#63) have no headless path — exactly the unresolved gap-list item #8. | `extensions.md` §Mode Behavior; `rpc.md` | **High** for batch runs |
| V9 | **`pi.appendEntry` ≠ `.pi/ledger/`.** `appendEntry` writes session custom entries (in `~/.pi/agent/sessions/`, or `sessionDir`), not the gitignored `.pi/ledger/`. Decision #71 (receipts in gitignored `.pi/ledger/`) requires extension file writes (`node:fs`/`bash >>`) — and `.pi/ledger/` must itself be gitignored via `.pi/.gitignore` or root. | `extensions.md` §appendEntry; `session-format.md` | Medium — persistence seam |
| V10 | **Custom tools that write files must use `withFileMutationQueue()`**, else parallel tool calls (Pi default) can lose updates. The subagent example already does this for its temp-file write. | `extensions.md` §Custom Tools | Medium |

---

## 6. User-owned vs engineering decisions (separation)

### User-owned (must be ruled by the user; do not auto-decide)

These carry over from `approved-decisions.md` §4 plus one addition, unchanged by this audit:

1. C6 — 2027 transition date (code 2027-01-14 vs docs 2027-01-19/20). Blocking for Tier-3+ dossier claims.
2. C1 — ELECTRONICS green-suite parity 363 vs 365 (repair baseline vs report red).
3. C2 — SURVEY published-tree drift (remediate vs accept debt).
4. C20 — `platform_cad` 2 self-test FAILs / geometry drift (broken vs doc-stale).
5. C21 — `offers.csv` `price_eur` regeneration path / orphaned PDFs (owner/orphan policy).
6. C24 — cross-directory 51 errors (intake vs whitelist vs accept).
7. C4 — TECH_DOC renders tracked though "gitignored" (`.gitignore` fix vs agent-side refuse).
8. C5 — `plc/parts/` dead-but-documented (doc cleanup).
9. Reference machine for MVP acceptance (`urano_e` implied, not confirmed).
10. `4_columns_1_motor` provisional EN 81-41:2010 basis (WIP vs freeze).
11. Fate of `.claude/skills/` + `.claude/commands/` (port to `.pi/`, absorb into manifest, or drop).
12. WebFetch domain allowlist reuse (verbatim vs new Pi baseline).
13. Subagent nesting depth cap (what value; `direttore` needs >2?).
14. New LinkML schema scope for the Pi-native manifest.
15. Headless visual-pause semantics (block forever vs degrade to "pending visual").
16. Web search tool/provider + exact tool names.
17. Expected-red baseline manifest contents at freeze.
18. General (non-Gemini) API cost budget (implicit "no limit, monitor+warn" — flag as accepted risk).
19. Whether Pi skills are used at all given bare-bones subagents (Q52 conflict).
20. TUI component-test feasibility (Q82) — acceptance bar to confirm during planning.
21. **NEW** — DeepSeek account/API-key provisioning for `deepseek-v4-flash`/`deepseek-v4-pro` (decisions #46–48) — is the API key available on this workstation? (Provider/auth is user-owned.)

### Engineering choices (the design team may decide, no user ruling required)

- MCP client vendoring + stdio bridge architecture for the 6 servers (§3).
- YAML-vs-JSON parse strategy for the policy manifest (§2 #95).
- One-writer lockfile format and location (`.pi/ledger/locks/`).
- Receipt schema convention (decision #58 already defers strict validation).
- Router determinism/testability structure (decision #80 requires it; internal shape is engineering).
- Subagent event-stream parsing layer (V3/V4) — engineering, but pin the Pi version.
- Escalation protocol shape (structured `needs_decision` result vs dedicated tool).
- TUI component/test harness (Q82) implementation.
- Context-pack bundling (skills vs prompts vs `SYSTEM.md` vs extension-injected) for the 3-tier context model.

---

## 7. Residual risks (carried forward)

1. **MCP re-bridge is the dominant scope risk** (#64/#65): 6 servers × stdio client × lazy start × cost gate, with a real env-split and absolute-path portability hazard. This is the item most likely to blow the MVP estimate.
2. **Every permission/destructive/one-writer guard is advisory** — no sandbox. The safety-critical gates (#35) depend on extension code + prompt discipline, not on an OS boundary.
3. **Headless visual-pause is undefined** (gap #8) and directly conflicts with the "always pause" override (#57) once `direttore` runs batch/workflow modes.
4. **Subagent event-stream coupling** (V3) and **unverified `tool_result_end`** make the orchestration layer fragile across Pi updates; pin version + validate stream first.
5. **DeepSeek model-string/`[1m]` remap and auth availability** (V1/V2 + user decision #21) must be settled before any model-routing acceptance test.
6. **Trust bootstrap** (V7) can silently disable project extensions in headless dispatches unless trust is pre-saved or `--approve` is threaded through every subagent spawn.
7. **No `maxSubagentDepth`** (V6) — recursion/lead-worker nesting is unbounded without a manual guard.

---

## 8. Acceptance attestation

Criterion "concrete findings with file paths and severity" is satisfied: this report maps 96 approved decisions + 21 user-owned items to verified Pi primitives, with file-level evidence (Pi docs paths, `dist/core/model-resolver.js`, `subagent/index.ts`, `plan-mode/utils.ts`, `.mcp.json`) and severity tags (High/Medium) for every material risk.

*Generated 2026-08-19 by delegated pi-feasibility audit. Read-only; no project/source files modified. This report is the only write.*
