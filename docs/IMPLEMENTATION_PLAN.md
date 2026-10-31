# Implementation Plan — research_mcp v0

- **Date:** 2026-10-31
- **Status:** Reviewed and validated; local implementation authorized and starting.
- **Next action:** Reconcile execution state and dispatch eligible Sol/max work. Live product calls and pushes still require separate approval.
- **Tracker:** [GitHub Issues #1–#11](https://github.com/eldar9510-cloud/research_mcp/issues).
- **Product authority:** [Approved PRD](PRD.md) and the approved issue acceptance criteria.
- **Execution preference:** Sol at maximum reasoning effort, using existing Mastra-managed Pi workers, in parallel when dependencies and edit ownership permit.

## How to use this document

The coordinator reads sections 1–5 and the compaction/runbook sections. An implementation worker receives its one issue body, its checklist in section 6, the common execution contract, relevant PRD sections, and the actual instruction/code paths for its worktree. Do not load all eleven issue bodies into every worker.

The checkboxes below are execution TODOs, not a second issue tracker. GitHub owns issue status and blocking relationships. A checked step or a successful worker exit does not make an issue complete: acceptance evidence, review, integration, and applicable approvals still govern completion.

If a live issue, the PRD, and this plan disagree, surface the difference before coding. Do not silently weaken an acceptance criterion or rewrite the approved dependency graph.

## Contents

1. [Starting state and permissions](#1-starting-state-and-permissions)
2. [Sol/max worker contract](#2-solmax-worker-contract)
3. [Parallel execution schedule](#3-parallel-execution-schedule)
4. [Minimal modules and edit ownership](#4-minimal-modules-and-edit-ownership)
5. [Coordinator execution TODOs](#5-coordinator-execution-todos)
6. [Per-ticket implementation TODOs](#6-per-ticket-implementation-todos)
7. [Compaction strategy and checkpoints](#7-compaction-strategy-and-checkpoints)
8. [Worker brief and handoff templates](#8-worker-brief-and-handoff-templates)
9. [Integration and completion gates](#9-integration-and-completion-gates)
10. [Review record and execution handoff](#10-review-record-and-execution-handoff)

---

## 1. Starting state and permissions

### 1.1 Reconciled state at planning time

- Repository: `eldar9510-cloud/research_mcp`.
- Local checkout: `/home/eldar/Projects/research_mcp`.
- Git baseline inspected: `56872834f98e323ba4efcbe3740e3f168191da2c`.
- The repository contains the PRD, README, licenses, and ignore rules; no application code or package/test setup exists yet.
- All eleven issues are open, labelled `ready-for-agent`, and have no comments at this snapshot.
- Their fifteen native blocking relationships match the approved breakdown.
- Only **#1 and #2** are initially unblocked.
- No implementation worktrees, implementation workers, or product research jobs were started while writing this plan.

Recheck this snapshot at execution time. `ready-for-agent` means the issue is scoped for an agent, not that its blockers are complete.

### 1.2 Separate four kinds of permission

**Execution authorization received:** The user authorized project-local implementation and minimal dependencies, isolated worktrees/branches, local candidate/integration commits (including this plan), and updates to the existing GitHub issues. Public pushes, research/data publication, live product/external integration calls beyond coding/review workers, new paid services/credentials/global configuration, substantial scope changes and destructive cleanup still require approval. This supersedes the planning-time permission statements below. Current run details live in the ignored `.research-local/execution/HANDOFF.md`; GitHub remains the tracker.

1. **Implementing the software:** the user must ask to start execution after reviewing the plan. This document-writing request is not that instruction.
2. **Git operations for implementation:** settle permission for local worktree branches, candidate commits, integration commits, and any source-code pushes before using them. Recommended workflow: explicitly authorized local candidate/integration commits; public pushes remain within whatever scope the user approves.
3. **Live product research/integration calls:** obtain authorization for the scoped question, providers and finite limits. Selecting Sol for coding workers does not automatically authorize arbitrary product research, new paid services, or new credentials.
4. **Publishing reports or real corpus material:** retain the report-specific review and approval required by the PRD. Approval to implement the archive is not permission to upload arbitrary contents of a disk or conversation history.

At execution kickoff, also settle the coordinator's permission to post progress/evidence and update or close verified GitHub issues. These operational updates use the existing tracker, not another backlog.

A worker's permission to commit a local candidate, if granted, never implies permission to push, modify GitHub issue states, publish reports, change global Pi configuration, or delete worktrees.

### 1.3 Initial execution gates

- [x] Complete the plan review and documentation checks recorded in section 10. Recheck affected results if the plan, scope or runtime configuration changes before execution.
- [x] Obtain the user's instruction to begin implementation and settle the Git permissions above.
- [x] Refresh all issue bodies, comments, statuses and native blockers; inspect the repository and any existing worktrees/runs.
- [x] Make this plan available to every worktree: locally committed at `e09495f`, inherited by initial isolated #1/#2 worktrees. Git worktrees do not inherit uncommitted files from the coordinator checkout.
- [x] Choose one coordinator-owned integration branch: `implementation/v0`.
- [x] Confirm a writable, separate local work area for test reports, proposals, temporary Git remotes and run artifacts: ignored `.research-local/` in each worktree; coordinator dispatch handoff in `.research-local/execution/`.

The execution request authorizes committing this plan locally, but not pushing it.

## 2. Sol/max worker contract

### 2.1 Use existing profiles, with an explicit model override

Use `mastra_worker`, not another delegation framework or a new collection of agent profiles.

The installed configuration was inspected:

- The existing `terra` profile currently has `thinking: max`.
- Mastra accepts a per-run model override and independently passes the profile's thinking setting to Pi as `--thinking`.
- Therefore `agent: terra` plus `model: openai-codex/gpt-6-sol` is the currently supported launch path for Sol/max.
- The tool schema has no per-run `thinking` argument. Do not invent one or assume the name `terra` determines the requested model.

Illustrative launch shape, to be filled with a real worktree and bounded brief at execution time:

```json
{
  "action": "start",
  "agent": "terra",
  "model": "openai-codex/gpt-6-sol",
  "cwd": "<isolated-worktree-root>",
  "timeoutMs": 1800000,
  "task": "<self-contained issue brief with scope, instructions, checks and handoff requirements>"
}
```

List the available agents before dispatch. Re-read the current profile if configuration may have changed. A stale README description or the worker status field alone is not proof of effective reasoning effort.

### 2.2 Every worker verifies its own effective selection

The first worker action must check the three non-secret Pi session variables exposed to the bash tool:

```bash
printf 'provider=%s\nmodel=%s\neffort=%s\n' \
  "$PI_PROVIDER" "$PI_MODEL" "$PI_REASONING_LEVEL"
```

Expected values are `openai-codex`, `gpt-6-sol`, and `max`.

If they differ, stop before editing or running integration tests and return the mismatch. Do not change the global profile, downgrade effort, substitute another model, or keep implementing under a misleading Sol/max label.

These variables establish the selected Pi model and effective thinking setting; they are not an independent audit of an upstream provider's internal routing. Record the safe preflight output with the run evidence, not a full environment dump.

### 2.3 Fresh workers need explicit context

The current `terra` profile does not inherit project context or skills automatically. Every brief must provide:

- The complete assigned issue body and any relevant new comments.
- The actual global, project and nested instruction paths to read.
- Relevant PRD headings and the applicable checklist in this plan.
- The worker's worktree, starting commit, allowed changes and shared-file exclusions.
- Existing interface decisions and the exact commands already established for checks.
- Whether any live test, local commit, or other side effect is authorized.
- Required return evidence and the condition for stopping as blocked/incomplete.

The worker must read applicable instruction documents before substantive work. For Pi SDK/extension work, read the relevant installed documentation completely and follow the related references before implementing against that interface.

### 2.4 Available tools and responsibilities

Mastra workers have built-in file/shell tools. They do **not** automatically inherit the coordinator's MCP, Jev, web-search, LSP, intercom, or nested-worker tools.

Consequences:

- Workers can build and execute deterministic tests and supported command-line/SDK integration probes.
- Product search/fetch must be wired into the product's separately controlled session. The fact that the coordinator can call a web tool does not prove the product can.
- The coordinator owns actual Pi-host MCP/Jev demonstrations and any required setup approval. Workers supply the executable probes/fixtures and interpret scoped evidence as assigned.
- A bounded test of the product's research session is part of testing the software, not permission to spawn additional coding agents. All coding delegation remains with the coordinator.
- Workers return results; the coordinator owns ticket updates, integration, publication decisions, and further delegation.

### 2.5 Distinguish three uses of Sol

| Use | Owner | Concurrency/approval rule |
|---|---|---|
| Coding/review worker | Coordinator through Mastra | User-requested Sol/max; isolated task/worktree; dispatch rules below. |
| Product research job | The implemented MCP engine | One active job per product server in v0; explicit research authorization and finite limits. |
| Compaction summary | Pi's session mechanism | A separate model operation that can be lossy and consume tokens; not a research result or a completion certificate. |

Parallel coding workers do not change the product requirement of one active research job per server.

## 3. Parallel execution schedule

### 3.1 Preserve the approved dependency graph

| Issue | Deliverable | Blocked by |
|---|---|---|
| [#1](https://github.com/eldar9510-cloud/research_mcp/issues/1) | Live bounded Sol/max runtime proof | None |
| [#2](https://github.com/eldar9510-cloud/research_mcp/issues/2) | Import and inspect a local proposal | None |
| [#3](https://github.com/eldar9510-cloud/research_mcp/issues/3) | Accept, catalogue and rediscover | #2 |
| [#4](https://github.com/eldar9510-cloud/research_mcp/issues/4) | Evidence-preserving section/page reads | #3 |
| [#5](https://github.com/eldar9510-cloud/research_mcp/issues/5) | Approval-controlled publication | #3 |
| [#6](https://github.com/eldar9510-cloud/research_mcp/issues/6) | Automatic archive assessment with optional Jev | #4 |
| [#7](https://github.com/eldar9510-cloud/research_mcp/issues/7) | Standalone research jobs and proposals | #1, #2 |
| [#8](https://github.com/eldar9510-cloud/research_mcp/issues/8) | Cancellation/interruption and partial work | #7 |
| [#9](https://github.com/eldar9510-cloud/research_mcp/issues/9) | Targeted improvements with provenance | #4, #5, #7 |
| [#10](https://github.com/eldar9510-cloud/research_mcp/issues/10) | Approved corpus and retrieval evaluation | #5, #6 |
| [#11](https://github.com/eldar9510-cloud/research_mcp/issues/11) | Fresh-setup, cross-session sign-off | #8, #9, #10 |

### 3.2 Use a rolling frontier, not a mandatory wave barrier

An illustrative sequence of parallel groups is:

```text
{#1, #2}
    -> {#3, #7}
    -> {#4, #5, #8}
    -> {#6, #9}
    -> {#10}
    -> {#11}
```

These groups illustrate dependency depth, not an instruction to wait for every peer before dispatching anything else.

Examples of earlier useful starts:

- If #2 completes before #1, start #3; archive work does not depend on the live research proof.
- As soon as #3 is integrated, #4 and #5 can start, even if research work is still running.
- Once #4 is integrated, #6 can start without waiting for #5 or #8.
- Once #5 and #6 are complete, #10 can proceed while research-job work continues.
- Once #4, #5 and #7 are complete, #9 is logically ready even if #8 is running. Apply the edit-ownership rule in section 4 before running those two together.

If #1 is blocked on live access, record that blocker and continue #2 → #3 → #4/#5 → #6 → #10 as their own gates allow. Do not mark #1 complete based only on mocks to unlock #7.

### 3.3 Concurrency target

The approved graph has a maximum width of **three independent issues**. More than three simultaneous implementation workers cannot increase issue-level parallelism without inventing subtasks or ignoring blockers.

Recommended operating policy:

- Up to **three active Sol/max Mastra workers total**, normally implementation plus any independent review using an available slot.
- Keep one coordinator; do not create another planner hierarchy.
- Run live product research/provider probes one at a time by default, under separately authorized bounds. Offline tests and isolated coding can still run in parallel.
- Reduce dispatch when quota, memory, tests or integration throughput become the bottleneck. Preserve Sol/max rather than silently changing models.
- This is a coordinator scheduling policy, not a change to Mastra's global configuration. The installed adapter itself has no default concurrency cap.

### 3.4 An issue becomes eligible only on accepted work

For this plan, a prerequisite is complete when the coordinator has checked its acceptance evidence, arranged independent review, integrated the candidate, rerun the affected checks, and updated the tracker appropriately. Record whether code or report publication is still pending; an issue-specific publication requirement cannot be skipped.

A worker's `completed` status alone is not sufficient. A sibling branch containing an unreviewed implementation is not a stable dependency base.

Do not add artificial GitHub blocker edges merely because two implementations temporarily contend for one file or a provider quota. Serialize the conflicting execution step and record the scheduling reason instead.

## 4. Minimal modules and edit ownership

### 4.1 Keep the product small

Use a small number of deep modules with narrow interfaces, not a directory full of pass-through abstractions:

| Module | Owns | Primary test surface |
|---|---|---|
| Archive | Record/proposal validation, file persistence, duplicate identity, catalogue, search, revision-aware reads and acceptance | Observable archive operations against temporary directories and real fixture files. |
| Research | Controlled Sol session, concrete research tools, bounded jobs, source/output handling, job outcomes and partial artifacts | Research/job interface with controlled external adapters, plus explicitly authorized live probes. |
| Pi workflow/publication | Coverage decisions, existing Jev coordination, research/acceptance approval gates, reviewed Git workflow | Host interaction traces and temporary repositories/remotes; actual Pi-host smoke tests where necessary. |
| MCP transport | Validated inputs, bounded outputs and dispatch to the modules above | An MCP client talking to the running local server. |

Module names describe ownership, not mandatory classes or package boundaries. Internal files can be split when needed for locality. Do not create a generic model/provider/plugin framework.

Use real temporary files and Git repositories for local-substitutable dependencies. At true external seams, a production adapter and a deterministic test adapter justify injection. Avoid exposing internal helpers solely to test them.

### 4.2 Agree on a few shared interfaces before parallel edits

Before dispatching a group, settle only what its workers need to share:

- **Proposal identity:** content digest, optional base-report revision, metadata/body and warning representation.
- **Archive results:** distinct success/empty/error outcomes; report revisions; bounded read selections and continuations.
- **Publication review:** the reviewed proposal/base, exact file set, target, outgoing commits and current execution state.
- **Research request/result:** scoped question, mode, selected references, verification request, finite limits, job state and output references.

Keep these decisions with the implementation and its interface tests. Do not build a second contract repository or change every interface speculatively to accommodate later tickets.

### 4.3 Worktrees and single-writer ownership

Create one isolated worktree per active implementation issue, based on the latest accepted integration commit. A sibling directory such as `research_mcp-worktrees/issue-07` is a reasonable location. Use distinct local branches; never assign two writers to one working tree.

Before reusing any existing worktree, inspect its branch, base commit, dirty files, untracked files and unfinished runs. Preserve recovered work before deciding whether another attempt is needed.

Isolate test resources as well as source files: give each worker its own archive/proposal/job roots, temporary Git remotes, build/cache outputs, and server transport or ephemeral ports. Do not share mutable dependency/build directories across worktrees. Keep fixture configuration local; actual Pi/MCP registration or global configuration changes remain coordinator-controlled and require approval. Use authentication through supported interfaces rather than copying credentials into test fixtures.

Shared hotspots require explicit ownership:

| Parallel work | Ownership rule |
|---|---|
| #1 and #2 | #2 owns the initial application/package/test setup. #1 runs its standalone proof in a disposable worktree-local harness with explicitly resolved dependency versions and reusable proof source/tests. It must be runnable without waiting for #2's scaffold. #1 returns its dependency needs; the coordinator reconciles them with the application setup. Temporary harness paths do not become hard-coded production dependencies. |
| #3 and #7 | Archive/catalogue changes belong to #3; research runtime changes belong to #7. Agree proposal/error interfaces inherited from #2. Coordinator integrates shared MCP registration and package changes serially. |
| #4 and #5 | #4 owns evidence selection/pagination; #5 owns host publication and Git behavior. Both use the accepted archive interface instead of independently rewriting it. |
| #6 and #9 | #6 owns automatic coverage/Jev workflow; #9 owns improvement request composition and provenance changes. Keep shared host approval changes explicit. |
| #8 and #9 | #8 owns lifecycle/cancellation/artifacts; #9 owns improvement task composition and report metadata updates. If they cannot work through the accepted #7 interface without overlapping lifecycle edits, finish #8 first. This is an execution constraint, not a new logical blocker. |
| Any code work plus #10 | Corpus/evaluation work must use an identified code revision and isolated local archive. Retrieval changes require a new measured revision and rerun; do not mix results from moving branches. |

Independent read-only review can use a frozen candidate worktree. Its author must have stopped editing that candidate. Reviewers do not modify code or update the tracker.

### 4.4 Integrate one candidate at a time

The coordinator owns the integration worktree. Never let two agents merge, edit a shared lockfile or resolve conflicts there simultaneously.

With the agreed Git permission, integrate a reviewed candidate commit or a carefully captured patch including untracked files. Record its original base. Reconcile overlapping work deliberately and rerun the relevant checks on the combined tree. Nontrivial conflict repairs return to a bounded Sol/max task; they are not an excuse for unreviewed behavioral changes during a merge.

After integration, future workers start from the new accepted commit. Already-running workers remain on their declared base; the coordinator checks compatibility at return rather than rewriting their worktree under them.

## 5. Coordinator execution TODOs

### 5.1 Before every dispatch

- [ ] Refresh the assigned issue and its blockers; verify the accepted prerequisite commits actually exist in the chosen base.
- [ ] Inspect the selected worktree and relevant instructions. Establish one writer and an explicit change scope.
- [ ] Check the current agent profile and pass the explicit Sol model override.
- [ ] Include the effective-model preflight, complete issue body, relevant PRD headings, interface decisions, test commands and permissions in the brief.
- [ ] Specify finite worker time limits. The adapter's usual thirty-minute timeout is a starting point, not permission to run indefinitely or a promise every issue fits that duration.
- [ ] State which external calls are allowed and which require a return-to-parent approval request.
- [ ] Record the worker ID, worktree, base commit and artifact path when the start call returns.

### 5.2 While workers run

- [ ] Continue independent planning, review or integration work in the coordinator-owned tree; do not edit a worker's assigned tree.
- [ ] Receive completion notifications rather than polling. Use `wait` only for a run-to-completion phase when independent work is exhausted.
- [ ] Keep a compact local dispatch/handoff note, not full tool transcripts in the coordinator context.
- [ ] Route new requirements to the next appropriate run. The installed Mastra adapter has no live steering or nested delegation; a blocked worker should return its question and available work.
- [ ] Keep provider-intensive live tests within the granted scope and serialize them when needed.

### 5.3 On every worker return

- [ ] Read its result and relevant artifacts, including the effective model/effort preflight.
- [ ] Inspect the actual candidate diff, including untracked files, rather than trusting a report about an unrelated commit range.
- [ ] Verify the reported checks and arrange one independent, bounded Sol/max review for meaningful changes. Cover spec alignment and applicable standards together rather than launching duplicate review workflows. If the ticket checklist already calls for that same candidate review, this is the same review—not an additional reviewer or worker-owned delegation.
- [ ] Resolve findings, integrate serially, and rerun affected tests on the integrated candidate. New code invalidates affected earlier results.
- [ ] Mark the GitHub issue complete only when its acceptance gate is met. Leave it open with an explicit blocker if live verification, publication or a required test is incomplete.
- [ ] Save a concise handoff and recompute the eligible frontier.
- [ ] Retain worktrees/artifacts until their integration and recovery value is resolved; obtain permission before destructive cleanup.

### 5.4 Test-command policy

No application test scripts exist at the planning snapshot. Issue #2 establishes the smallest useful repeatable package/build/type/test commands; #1 documents its runnable proof independently.

Future briefs must quote the actual repository commands, not assume commands mentioned in a plan already exist. Each slice should include:

1. Focused observable-behavior tests for its interface.
2. Relevant MCP/host integration checks.
3. Regression checks for the modules it touches.
4. A documented demonstration, with live calls only when authorized.

Mocked tests prove controlled behavior; they do not prove provider credentials or live tool availability. Live output alone does not replace deterministic failure-path tests.

## 6. Per-ticket implementation TODOs

The following checklists supplement, rather than replace, each issue's full acceptance criteria. A worker receives only its own checklist plus the common contract.

### Ticket #1 — Prove a bounded Sol/max investigation

- **Blocked by:** None.
- **Useful parallel work:** #2.
- **Read:** PRD research-engine, trust, run-limit and M0 sections; relevant installed Pi SDK/model/tool documentation.

- [ ] Verify the coding worker is itself Sol/max; distinguish that from the product session it will test.
- [ ] Build the smallest reusable controlled-session proof with an explicit model/effort, allowlisted tools and injected external adapters for tests. Use a disposable worktree-local harness with recorded dependency versions so the proof does not wait for #2's application scaffold; retain reusable source/tests and reconcile dependencies during integration.
- [ ] Select one genuinely programmatic search/fetch integration usable by the standalone engine. Document new-cost/credential decisions for user approval; do not substitute the coordinator's interactive web tools as proof.
- [ ] Configure finite time, tool-call and source-output limits before live use. Prove normal error, timeout and abort behavior with controlled adapters.
- [ ] Disable automatic application/SDK retries, including inherited global defaults. Inspect context-overflow recovery behavior as described in section 7.5 so an implicit retry does not bypass the product rule.
- [ ] Prepare the proposed live question, source scope, bounds and provider usage; return for permission if it was not explicitly granted.
- [ ] Run the authorized proof, capture actual selected model/effort, inspected source evidence, cited output, available usage and cancellation limitations without credentials or hidden reasoning.
- [ ] Return reusable implementation/test artifacts and a short decision record: adapter, configuration, limits, failure behavior and exact reproducible commands.

**Completion gate:** Actual authorized research-tool execution and a cited result are demonstrated; controlled failure/abort tests pass. A catalogue entry or mock-only result leaves #1 incomplete.

**Handoff payload:** Runtime/adapter decisions, model/effort evidence, test commands, approved live-call scope and any auth/quota blocker. Retain only evidence needed to build #7.

### Ticket #2 — Import a finished report as a reviewable proposal

- **Blocked by:** None.
- **Useful parallel work:** #1.
- **Read:** PRD record/import, proposal reading, storage and MCP-contract sections.

- [ ] Establish the minimal runnable application/MCP and test setup as part of this vertical slice. Reconcile dependency choices with the runtime-proof worker through the coordinator.
- [ ] Define the record/proposal interface: stable ID, original/import/improvement/update dates, origin, question/scope/summary, relationships, warnings and revision digest.
- [ ] Implement selected Markdown/plain-text import with content fidelity, safe metadata parsing, configurable paths and exact-content duplicate detection independent of assigned timestamps.
- [ ] Store local proposals separately from accepted reports; provide bounded preview/read results and explicit continuation.
- [ ] Reject ID/path/symlink escapes and conflicting identities. Flag unresolved local/transcript references instead of inventing evidence.
- [ ] Add observable tests for import fidelity, unknown dates, duplicate submissions, malformed metadata, unsafe paths and malicious embedded instructions.
- [ ] Prove that import/preview causes no separate research/model run, acceptance, commit or push.
- [ ] Supply a real MCP-client smoke test; have the coordinator verify the supported Pi-host connection as authorized. Document the actual setup/check commands.

**Completion gate:** A fresh supported client imports a fixture and reads a local unaccepted proposal with preserved content/provenance; relevant tests pass.

**Handoff payload:** Record/proposal and error interfaces, package/test setup, import/preview tool contract and fixture policy. This unlocks #3 and, once #1 is complete, #7.

### Ticket #3 — Accept and rediscover a report across sessions

- **Blocked by:** #2.
- **Useful parallel work:** #7, or #1 if it is still blocked/running.
- **Read:** PRD catalogue, local retrieval, acceptance, storage and token-economy sections.

- [ ] Add the supported host approval step for local acceptance, bound to the proposal digest and current base revision where applicable.
- [ ] Persist accepted records defensively and return exact changed files/revisions. Clearly report the result as local and unpublished.
- [ ] Choose and implement one deterministic catalogue serialization. Prefer the PRD's readable per-report catalogue unless a simpler structured format proves necessary; keep it derived and database-free.
- [ ] Add bounded lexical search over titles/questions/scope/summaries and useful metadata, with visible dates, warnings and revision identity.
- [ ] Implement explicit catalogue rebuild without model calls. Separate genuine empty results from missing, invalid or known-stale catalogue errors.
- [ ] Handle interrupted writes/inconsistency without returning a confident empty archive; document recovery through the supported rebuild path.
- [ ] Test a process/session restart followed by search/read, conflict rejection, deterministic rebuild, payload bounds and absence of hidden model/Git actions.
- [ ] Freeze the small archive interface needed by #4 and #5; hand off shared MCP-registration changes through the coordinator.

**Completion gate:** An approved local report is discoverable after restart, remains readable without the application, and has a consistent rebuildable catalogue. No remote publication is implied.

**Handoff payload:** Accepted-record/search/read interface, catalogue codec, empty-versus-error contract, write-consistency behavior and reproducible restart test.

### Ticket #4 — Read long and corrected reports without losing evidence

- **Blocked by:** #3.
- **Useful parallel work:** #5 and eligible research work.
- **Read:** PRD reading, citation preservation and revision-identity sections.

- [ ] Define one stable selection/continuation interface and enforce finite response sizes.
- [ ] Bind every page to the report content revision and include scope/dates/important warnings regardless of their original position.
- [ ] Resolve citation context from elsewhere in the same revision; explicitly identify references that cannot be resolved.
- [ ] Keep correction/supersession text and successor IDs visible in section reads and catalogue-driven reads.
- [ ] Detect revision changes between search and read; reject unavailable/stale continuation instead of combining revisions.
- [ ] Test long/multi-page reports with citation definitions and warnings outside the first page, unknown references, end-of-document behavior and concurrent mutations.
- [ ] Document how callers get the complete report without a silent truncation or mandatory whole-report response.

**Completion gate:** Bounded selected reading preserves essential evidence and warnings across pages and version changes.

**Handoff payload:** Selection/continuation contract, revision-conflict behavior, warning precedence and citation-resolution fixtures. This enables safe automatic reuse in #6.

### Ticket #5 — Publish a reviewed report safely

- **Blocked by:** #3.
- **Useful parallel work:** #4 and eligible research work.
- **Read:** PRD approval, Git publication, trust and failure-state sections.

- [ ] Define the minimal review envelope: proposal/base digests, diff, exact file set, target repository/branch, outgoing commits and known publication concerns.
- [ ] Bind the host's explicit user approval to that envelope. One unchanged approval covers acceptance, commit and push; changes invalidate it.
- [ ] Integrate ordinary Git operations in the host workflow, keeping publication capability out of the researcher tools.
- [ ] Inspect worktree/index and outgoing commit range. Stop on unrelated changes or unapproved outgoing commits instead of resetting, broad-staging or force-pushing.
- [ ] Keep report/catalogue changes together and local run/proposal artifacts excluded. Review rights, secrets and unavailable references without claiming automated checks are guarantees.
- [ ] Represent local acceptance, commit success and push success separately; retain honest recovery information after failure with no automatic retry.
- [ ] Test denied/changed approval, stale revision, unrelated staged content, extra outgoing commits, failed commit and rejected push using isolated temporary repositories/remotes.
- [ ] Arrange any real publication demonstration with the coordinator under explicit approval, then record the actual commit/remote state.

**Completion gate:** The reviewed combined operation executes only with approval and publishes only the approved content; failure states remain inspectable and recoverable.

**Handoff payload:** Approval-envelope contract, exact Git checks, completed side effects versus pending operations, approved target and failure/retry procedure. Avoid compacting in the middle of this external side-effect sequence.

### Ticket #6 — Automatically assess archive coverage in Pi

- **Blocked by:** #4.
- **Useful parallel work:** #9 or other ready research work.
- **Read:** PRD automatic workflow, relevance assessment, Jev, scope and token-economy sections.

- [ ] Implement/document the supported Pi workflow trigger for substantial research, preserving the distinction from routine questions and coding actions.
- [ ] Connect local shortlist retrieval and selected evidence reading; classify covered, partial, no useful match and lookup failure without conflating them.
- [ ] Add the optional existing Jev call at the host seam for ambiguous candidates. Restrict transmitted material and preserve local fallback when Jev is unavailable.
- [ ] Reuse covered findings with dates/caveats; offer targeted improvements for gaps and new research/import for no useful match. Keep lookup-error and approval gates intact.
- [ ] Bound reformulation, candidate counts and read payloads. Neither a semantic service nor whole-catalogue model input is a fallback.
- [ ] Test absence of automatic research, old-source checks and publication, including malicious retrieved instructions and failing Jev/catalogue cases.
- [ ] Provide deterministic host interaction tests and have the coordinator perform an authorized actual Pi-host reuse smoke test. Exercise Jev through controlled tests and, when available and permitted, a live call. Record live-tested versus mocked/unavailable behavior; a Jev outage must not block acceptance of the working local-retrieval fallback.
- [ ] Keep research-job dispatch compatible with the future/current #7 interface without pretending an unavailable engine is operational.

**Completion gate:** A fresh Pi session automatically finds and assesses previous work with the four distinct outcomes and required side-effect limits.

**Handoff payload:** Trigger rules, coverage decisions, Jev payload/fallback behavior, actual host-test evidence and unresolved integration limitations. Together with #5, this unlocks #10.

### Ticket #7 — Run a standalone research job to a finished proposal

- **Blocked by:** #1 and #2.
- **Useful parallel work:** #3 and later archive work, with explicit shared-interface ownership.
- **Read:** PRD research engine, job states, MCP tools, limits and approval sections.

- [ ] Compose the proven runtime with the accepted proposal interface; the engine owns the research session rather than outsourcing the investigation to the parent conversation.
- [ ] Add authorized start, compact status and one-active-job/busy behavior. Start returns a job ID promptly; status does not return the full transcript.
- [ ] Define scoped requests, selected references, actual model/effort, finite limits, output references and distinguishable completed/incomplete/failed outcomes.
- [ ] Enforce model/effort, tool allowlists, external-output bounds and no-retry behavior from the first job. Prevent recursive job/acceptance/publication calls by the researcher.
- [ ] Implement the bounded planned investigation and validate a coherent sourced report with alternatives, uncertainty and limitations before creating a finished proposal.
- [ ] Ensure source-fetch failures and weak evidence are described rather than repaired by invented content. Host authorization and publication remain separate.
- [ ] Test authorization/busy/state transitions, tool boundaries, malicious pages, limit failures, invalid report completion and compact responses with deterministic adapters.
- [ ] Run the authorized standalone live demonstration, using actual engine-wired tools, and preserve evidence for the coordinator's review.
- [ ] Stabilize the request-composition versus lifecycle seam before #8 and #9 work concurrently; coordinate shared MCP registration with the archive path.

**Completion gate:** At least one authorized live standalone job successfully produces a valid sourced local proposal using the actual engine-wired tools. Deterministic tests also demonstrate bounded failure/incomplete outcomes and absence of publication. A failure-only or mock-only demonstration cannot complete #7.

**Handoff payload:** Job/request/result interface, limits/retry configuration, model/tool evidence and lifecycle/task-composition ownership. Existing protections must not be deferred to #8.

### Ticket #8 — Cancel or interrupt research without misrepresenting the result

- **Blocked by:** #7.
- **Useful parallel work:** #6, #9 and #10 where ready and edit scopes are disjoint.
- **Read:** PRD lifecycle, interruption, local-artifact and recovery sections.

- [ ] Expose user cancellation over the established runtime abort mechanism and stop scheduling new work promptly.
- [ ] Complete accurate outcome mapping for cancelled, incomplete, failed and interrupted jobs; preserve the distinction from finished proposals.
- [ ] Persist useful available request/state/source/note/output artifacts incrementally, keeping credentials, hidden reasoning and unneeded private material out.
- [ ] Add controlled-shutdown cancellation and startup detection of abandoned running records without automatically restarting them.
- [ ] Expose bounded references to surviving artifacts and explain unflushed-output/in-flight-request limitations.
- [ ] Support an explicitly authorized new job from selected partial material, with a new identity; do not restore an old agent state automatically.
- [ ] Test cancellation at model/tool boundaries, bounds, provider failure, abrupt stop, partial/corrupt artifacts and restart behavior; verify no hidden retry, resume or Git action.
- [ ] Coordinate lifecycle interface changes with #9 through the parent before either worker edits an overlapping area.

**Completion gate:** Available partial work is recoverable locally with accurate state, and only an explicit new request restarts investigation.

**Handoff payload:** Artifact formats, state transitions, shutdown/restart test evidence and safe continuation procedure. Retain these details across compaction; they are not reconstructible from a final report alone.

### Ticket #9 — Improve requested gaps while preserving provenance

- **Blocked by:** #4, #5 and #7.
- **Useful parallel work:** #6, #8 and #10 when ready and contract ownership permits.
- **Read:** PRD improvements, date/provenance rules, linked reports, stale revisions and publication.

- [ ] Turn an explicit improvement request into a scoped job carrying the base revision, requested gaps, selected prior evidence and requested verification scope.
- [ ] Reuse applicable existing material without sending the full archive or repeating the complete prior investigation.
- [ ] Support new claims with evidence while preserving unchecked old claims as dated/qualified. Ask or state a limitation when a new conclusion depends on their current truth.
- [ ] Preserve original identity/date/origin for the same question; add the substantive improvement date and a precise change/evidence note.
- [ ] Produce a linked report for a materially different question, with explicit correction/supersession handling when needed.
- [ ] Generate the report/catalogue diff and feed the existing approval/publication flow. Revalidate proposal/base digests before applying it.
- [ ] Test requested versus unrequested source checks, original-date/origin preservation, new-scope linking, stale bases, denied approval and inspectable Git history.
- [ ] Demonstrate an approved targeted improvement and later rediscovery. Keep lifecycle changes out of #8's active scope or serialize with it.

**Completion gate:** Requested gaps can be investigated and published without overwriting history, implying wholesale fresh verification, or bypassing approval.

**Handoff payload:** Improvement request/verification semantics, original-versus-new date rules, link/supersession decisions, published revision and any unchecked dependencies.

### Ticket #10 — Seed the archive and meet the retrieval target

- **Blocked by:** #5 and #6.
- **Useful parallel work:** #8/#9 or earlier eligible research work, using a fixed code revision.
- **Read:** PRD corpus selection, publication rights, retrieval evaluation and token measurements.

- [ ] Obtain approval for the actual selected publication set and review redistribution rights, private information and local-only references.
- [ ] Select twenty representative reports, including length/topic variety, partial reuse, unknown dates and a correction/supersession case. Use the implemented import path, not bulk disk/history capture.
- [ ] Process manageable batches, for example five reports at a time. Preserve originals and citations; save the selected IDs/digests and import state so a new worker cannot accidentally duplicate a batch.
- [ ] Freeze ten differently worded questions and acceptable relevant report IDs before scoring; record the corpus and code revisions used.
- [ ] Publish only reviewed material through the established approval flow. Any batch approval must identify the whole reviewed file set rather than imply permission for later additions.
- [ ] Evaluate local candidate generation and the actual visible ranking, including Jev only when the workflow uses it; retain fallback and warning behavior.
- [ ] Reach useful top-three results for at least eight of ten queries, without relabelling relevance, weakening the target or silently adding semantic infrastructure.
- [ ] Record response sizes, available usage/effort and concrete misses. Make warranted small retrieval fixes against a named code revision and rerun the affected evaluation.
- [ ] Return the approved corpus manifest, frozen query definitions, results and reproduction commands without publishing private run artifacts.

**Completion gate:** The real selected corpus is faithfully imported and published through the approved workflow, with actual acceptance/commit/push state recorded. The fixed retrieval test passes on identified corpus/code revisions with inspectable evidence and bounded context use. Pending required publication or a failed retrieval threshold leaves #10 open.

**Handoff payload:** Corpus/report digests, frozen query relevance definitions, code revision, batch acceptance/publication state, per-query results and measured payload sizes. These—not memory of the reports—are the continuation context.

### Ticket #11 — Verify the complete cross-session workflow

- **Blocked by:** #8, #9 and #10.
- **Useful parallel work:** None required at issue level; use one independent reviewer after the candidate is frozen.
- **Read:** PRD accumulated acceptance matrix and definition of done, plus current setup/run documentation.

- [ ] Start from the accepted integrated candidate and reproduce installation/configuration in a fresh supported local setup.
- [ ] Demonstrate covered reuse, requested partial improvement, authorized new standalone research and external finished-report import.
- [ ] Publish at least one explicitly approved finished result and discover/read it in a fresh Pi session without manually locating its file.
- [ ] Run the accumulated failure/approval/evidence tests and confirm that the twenty-report/ten-query result is still applicable to the integrated candidate.
- [ ] Verify actual Sol/max and engine-wired tool evidence; distinguish recorded earlier live results from any newly authorized rerun.
- [ ] Finish exact setup, operational limits, partial-work recovery, report-format and contribution guidance using commands that actually exist.
- [ ] Return the frozen candidate and evidence to the coordinator for one independent review. The coordinator assigns any repair run; resolve material findings and rerun affected checks before closing the issue. The implementation worker does not spawn its reviewer.
- [ ] Record the release/sign-off evidence, known limitations and actual publication state. If something fails, leave the issue open and return a specific correction task rather than hiding implementation work inside sign-off.

**Completion gate:** All applicable PRD acceptance conditions are demonstrably met on the integrated candidate; the cross-session loop works and remaining limitations are explicit.

**Handoff payload:** Final candidate/release revision, full check/evaluation results, live evidence references, approvals and publication state. No final compaction is needed just to declare completion.

## 7. Compaction strategy and checkpoints

### 7.1 What compaction can and cannot do

Pi's `/compact [instructions]` summarizes older context while retaining recent material. It is lossy. Full session history remains stored, but large tool results may be truncated when constructing a summary. Therefore an inline log or a model's memory is not a durable test receipt.

The installed documentation describes automatic threshold compaction using the model context window minus reserved response tokens; the documented defaults are a 16,384-token reserve and roughly 20,000 recent tokens retained. These are reference facts, not settings this plan changes. Inspect actual settings/usage at execution time.

Do not optimize by compacting after every tiny task. Fresh workers already isolate issue context. Keep the coordinator focused on short handoffs, current diffs and evidence pointers; compact at meaningful integration transitions before context pressure becomes a failure.

### 7.2 Preferred coordinator checkpoints

| Checkpoint | Best time | What must survive | Why this point helps |
|---|---|---|---|
| **C0 — Optional pre-execution handoff** | After plan review and before implementation dispatch, only if context pressure makes it useful | Reviewed plan/status, issue graph, Sol/max requirement, profile evidence, unresolved permissions and the exact authorized next action | Clears design discussion without requiring compaction as a prerequisite or inferring execution permission. |
| **C1 — Initial contracts established** | After #1 and #2 are accepted/integrated, at the next natural quiescent point | Runtime proof, adapter/limits decisions, proposal/schema/error interfaces, package/test commands, next frontier | Replaces research/setup discussion with stable interfaces before the archive and researcher branches expand. |
| **C2 — Optional core-interface checkpoint** | After a substantial combination of #3/#7 and associated reviews, if context is becoming crowded | Accepted commits, job/archive interfaces, current worktrees/runs, integration risks | Useful after SDK/tool/interface discovery; skip it if context remains small and another worker is about to finish. |
| **C3 — Implementation-to-sign-off** | Once #8, #9 and #10 and their prerequisites are accepted/integrated; before #11 | All accepted revisions, corpus/query manifest, approvals, failure/recovery semantics, exact test commands and remaining risks | Gives final end-to-end validation a fresh coordinator context rather than a compressed mix of unfinished feature work. |
| **C4 — Exceptional blocked/oversized handoff** | At a safe pause when a task cannot finish within useful context/time | Exact unfinished changes, failure reproduction, artifacts, authorizations and next bounded action | Allows continuation without falsely declaring the issue complete or restarting completed work. |

These are semantic checkpoints, not a rigid elapsed-time or token schedule. The DAG's illustrative waves are not compulsory compaction barriers. Use a natural drain of active work; do not delay an otherwise ready branch merely to make a diagram symmetrical.

### 7.3 Safe coordinator compaction procedure

- [ ] Stop launching new workers briefly when a compaction checkpoint is approaching.
- [ ] Prefer to finish/collect active workers and integration/review operations first. Do not cancel useful work merely to tidy the context.
- [ ] Save the concise local handoff described in section 8, including any active run IDs and untouched candidate worktrees.
- [ ] Make external side effects unambiguous: finish or explicitly stop acceptance/commit/push steps, then record what actually happened and what remains authorized.
- [ ] Persist exact test receipts and data manifests outside conversational output; keep secrets and full transcripts private.
- [ ] Use `/compact` in the existing Pi session when appropriate. This plan does not invoke it automatically.
- [ ] After compaction, re-read the handoff and reconcile actual tracker, Git and worker state before launching another run.

Compaction is not `/reload`, `/new`, session switching, shutdown or restart. The installed Mastra lifecycle cancels active jobs on shutdown/session replacement and documents reload limitations. Avoid those lifecycle operations while workers are active.

If automatic compaction occurs while work is active, do not assume workers disappeared or restart them. Reconcile the recorded IDs/artifacts with one current status inspection, then continue event-driven coordination. Do not poll or infer completion from a missing in-memory registry after a restart.

### 7.4 Worker context management

The default is **one fresh worker per issue**, not one huge worker conversation for the whole project. A new worker receives stable artifacts, not the parent's entire conversation.

The current Mastra interface has no live steering or exposed per-worker manual-compaction command. Do not invent a way to send `/compact` to a running child. Pi may auto-compact inside its worker session; durable evidence is still required.

For a larger issue:

1. Define a bounded internal deliverable before dispatch, while keeping the same GitHub issue and acceptance gate.
2. Have the worker save a concise handoff and return `incomplete` or `blocked` if the issue is not finished.
3. Confirm the prior run is terminal and inspect its actual worktree before assigning a successor.
4. Start a new Sol/max run with the remaining scope and original work preserved. This is an explicit coordinator continuation, not an automatic retry or a duplicate job.

Useful internal pauses include:

- #1 after deterministic adapter/abort tests but before the separately approved live proof.
- #5 after temporary-remote tests and before any real reviewed publication operation.
- #7 after bounded job lifecycle tests and before the live sourced demonstration.
- #9 after a generated, validated proposal/diff and before publication approval.
- #10 after a completed import batch, after frozen evaluation definitions, or after a full recorded evaluation pass.

Do not pause halfway through an uncertain external side effect without first recording its real state. Do not manufacture green checks to create a convenient compaction point: preserve failing tests and a precise reproducer, and leave the issue open.

### 7.5 Product research compaction is a different concern

The product's “no automatic retry” requirement is stricter than normal coding-session convenience. Pi documentation describes context-overflow compaction that can recover and retry a turn; default agent retries can also be enabled independently of Mastra's no-retry scheduling.

For the v0 research engine, the simplest proposed implementation is to use explicit product-session settings that disable automatic agent/provider retries and automatic compaction: `retry.enabled: false`, `retry.provider.maxRetries: 0`, and `compaction.enabled: false` through the supported settings interface. Bound source/context growth and return an incomplete outcome before/at exhaustion. Confirm the effective behavior through the installed SDK and injected overflow/failure tests rather than assuming the Mastra coding-worker policy configures the product. These are session-local product settings, not changes to global Pi configuration.

If the implementation needs another approach, it must still satisfy the approved bounded/no-automatic-retry behavior and expose any additional summarization calls. Do not silently introduce research continuation, model substitution or unbudgeted summary passes under the label of compaction.

This plan does not change the coordinator's or global coding workers' compaction/retry settings.

## 8. Worker brief and handoff templates

### 8.1 Self-contained worker brief

Fill this for every implementation or independent-review run:

```text
Objective: one named issue or one bounded remaining part of it.
Mode: implementation OR read-only review.
Model requirement: openai-codex/gpt-6-sol, effective effort max.
First action: verify PI_PROVIDER, PI_MODEL, PI_REASONING_LEVEL; stop on mismatch.

Cwd/worktree: exact path.
Base commit: exact accepted SHA.
Issue: URL plus full current body and relevant comments.
Read first: exact applicable instruction paths.
Task context: relevant PRD/plan headings and current implementation interfaces.
Allowed changes: named scope; list shared-file exclusions and other active owners.
Permissions: local edit/test, external calls, local commits, publication—each explicit.
Checks: actual focused, integration and regression commands, with working directory.
Completion: all assigned acceptance conditions, or return incomplete/blocked honestly.

Constraints: leaf worker; coordinator owns tracker, further delegation and integration.
Read-only reviewer: inspect the frozen candidate diff; do not edit or commit.
Return: safe model/effort preflight; result; changed files/base/candidate revision;
        checks and artifact paths; remaining risks; exact next action.
Keep the return concise; retain long logs in local artifacts, not the chat.
```

Use the existing global profile; do not add another agent roster. If project-specific instructions or skills are needed, supply their real paths explicitly rather than assuming inheritance.

### 8.2 Durable coordinator handoff

Keep one small local working note, for example under the already ignored local work area. It describes execution, not a second backlog. Update the authoritative GitHub issue when authorized, with only information suitable for the public repository.

```text
Checkpoint / timestamp:
Next action: review plan / dispatch issue / integrate candidate / resolve blocker.

Tracker:
  Issue states and native blockers last checked.
  Which issues meet acceptance, versus worker-only completion.

Git:
  Coordinator branch and HEAD; published remote revision if relevant.
  Dirty/untracked files; each worktree, branch and declared base.
  Candidate revisions: returned / reviewed / integrated / rechecked.

Runs:
  Worker ID, issue, worktree, Sol/max evidence, terminal/running state.
  Artifact/output paths. No credentials or hidden reasoning.

Contracts and decisions:
  Only current interface/adapter/limit choices needed by the next task.

Checks:
  Exact command + cwd + candidate revision + result + log path.
  Unrun checks and unresolved failures remain explicit.

Permissions / side effects:
  What was approved, for which content/target, and what was already executed.
  Research-call budget/provider approvals; pending publication decisions.
  Commit succeeded? Push succeeded? Which report/batch was accepted?

Next frontier:
  Eligible issues, active ownership conflicts, available worker slots.
  Exact next bounded action and the few documents/code areas to read.
```

A compaction summary may point to this note, but cannot replace it. Record digests/commits and actual outcomes rather than “all done” statements.

### 8.3 Suggested manual compaction instruction

```text
/compact Preserve the research_mcp goal, PRD/plan paths and current GitHub issue
frontier. Preserve Sol/max worker selection, isolated-worktree ownership, run IDs
and artifact paths, accepted versus unintegrated revisions, exact check results,
remaining blockers and approval/publication state. Point to the durable handoff.
Do not turn a successful worker exit into issue completion or infer authorization
for implementation, new research, commits or pushes. State the next action exactly.
```

For a C0 checkpoint, use the current handoff in section 10. Do not preserve an obsolete “review pending” instruction after review is complete, and do not infer execution permission from a compaction summary.

## 9. Integration and completion gates

### 9.1 Evidence gate for every issue

- [ ] The candidate corresponds to the current issue scope and actual starting revision.
- [ ] Applicable acceptance checks pass; omitted live or environment-dependent checks are explicitly identified and keep the issue incomplete when required.
- [ ] Independent review covers the actual candidate, including uncommitted/untracked work where relevant.
- [ ] Review findings are resolved and affected checks rerun after changes.
- [ ] The coordinator integrates one candidate at a time and verifies the combined tree.
- [ ] Dates, evidence, side effects and approvals are represented truthfully.
- [ ] Tracker state and the next frontier are updated from this evidence, not a worker's completion label.

### 9.2 Recovery after an interruption

Before any replacement worker starts:

1. Read the existing issue and latest authorized handoff/comments.
2. Inspect the coordinator and relevant worktrees, including untracked files.
3. Inspect saved Mastra output/result/exit evidence and current runtime status where available.
4. Determine what is running, what returned, what is merely a candidate, what is integrated, and what was published.
5. Preserve useful unfinished work and identify the smallest remaining task.
6. Launch a new explicitly scoped Sol/max run only after prior-writer ownership is resolved.

A clean-looking main checkout, empty current worker list, or empty ready queue is not proof that all work is complete. Saved artifacts and other worktrees can contain unfinished candidates.

### 9.3 Stop conditions

Stop the affected operation and return a specific blocker when:

- Effective worker/product model or effort differs from the required Sol/max setting.
- A required provider/tool is unavailable or requires unapproved cost/credentials.
- A prerequisite is only claimed complete but lacks integrated acceptance evidence.
- Two writers would own the same worktree or incompatible shared edits.
- A report, approval envelope or base revision changed during the operation.
- A live call or publication action lacks the required authorization.
- Tests fail or required evidence is missing.

Continue independent eligible work where possible. Do not weaken requirements, silently change providers, restart failed operations automatically, or discard existing work to unblock the schedule.

## 10. Review record and execution handoff

The user requested direct coordinator review in the current context instead of waiting for compaction. No independent plan-review worker or compaction was used. This choice does not remove the independent implementation-candidate reviews specified in sections 5 and 9.

### Review coverage

- [x] Compared the plan with all eleven current issue bodies and their fifteen native blocker edges; issue bodies remain unchanged and there are no unread comments.
- [x] Checked the rolling schedule and calculated the graph's maximum independent issue width as three; both the dependency table and per-ticket checklists match the tracker.
- [x] Reviewed worktree/shared-interface ownership, root-ticket bootstrap independence, isolated test resources and the #8/#9 serialization fallback.
- [x] Rechecked the current `terra` profile and Mastra dispatch: explicit Sol override plus profile `thinking: max` is the configured launch path. Live worker/product execution was not tested in this review.
- [x] Checked approval separation for coding, commits, tracker updates, live product tests and report/source-code publication.
- [x] Reviewed compaction checkpoints, durable handoffs, interruption recovery and product-session retry/overflow settings.
- [x] Checked that every ticket has actionable TODOs, read pointers, a completion gate, its own tests and a bounded handoff.
- [x] Validated document structure, internal/local/issue links, whitespace, launch-example shape, all eleven ticket sections and all fifteen blocker edges after applying the corrections.

The document contains 89 per-ticket implementation TODOs, with a completion gate and handoff for each issue. Static checks confirm a three-issue maximum frontier and initial eligibility of #1/#2. This is documentation/configuration validation, not a live model, product-runtime or implementation test.

### Corrections made during review

1. Ticket #7 now requires a successful authorized live engine run as well as failure-path tests; an honest failure alone cannot satisfy its completion gate.
2. Ticket #1 explicitly uses a disposable local proof harness so it does not accidentally depend on #2's application scaffold.
3. Ticket #6 keeps Jev optional: actual Pi-host reuse is demonstrated, while an unavailable live Jev service is recorded and cannot block the working local fallback.
4. Parallel workers isolate test data, transports, outputs and temporary remotes as well as source files.
5. Ticket #10's completion gate includes its required approved corpus publication and an evaluation tied to named revisions.
6. Obsolete “review after compaction” instructions were replaced with the current review/permission state. Ticket metadata formatting was normalized for whitespace checks.

### Execution gates recorded at plan review (historical snapshot)

- The user must authorize starting implementation and settle the scoped Git/tracker permissions.
- #1 must establish actual live Sol/max access, a usable search/fetch adapter and appropriate bounded-run defaults; this document review does not prove them.
- #2 must establish real build/test commands; none exist in the current repository yet.
- #10 needs owner-selected publishable reports and the required approval of their actual content.
- Any substantial dependency/service/cost change returns to the user rather than silently expanding v0.

### Handoff recorded at plan review (historical snapshot)

Execution has subsequently been authorized as recorded in section 1.2. Consult `.research-local/execution/HANDOFF.md` for current runs and permissions rather than treating this snapshot as current state.

- Planning-context reconciliation, coordinator self-review and documentation validation are complete.
- All GitHub implementation issues remain open; no issue implementation has started.
- The current `terra` profile supplies `thinking: max`; an explicit Sol override and worker-side effective-setting check are still required for every run.
- Only this new plan document was added/edited in the coordinator checkout. No global configuration, worker profile, GitHub issue state or implementation code was changed; no additional worktrees were created, and no commits or pushes were made.
- **Next task:** await the user's instruction to execute, including the scoped Git/tracker and live-call permissions. Once authorized, refresh state and dispatch the unblocked Sol/max work in isolated worktrees. Do not start implementation as part of this review.
