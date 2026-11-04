---
{
  "format": 1,
  "metadata": {
    "id": "ai-development-workflow-2026-11-03",
    "title": "Reliable, fast AI-assisted software development (draft workflow)",
    "question": "What fast, reliable AI-driven software development workflow suits a non-developer building small products without excessive tests or reviews?",
    "scope": "Separate software-engineering and AI-operation practices; risk-based verification, issue ranking, bounded reviews, skills/MCP/workers, and evolution through beta/release.",
    "summary": "Proposes small complete changes, useful behavioral checks, separate severity/priority/confidence, one accountable lead and proportionate release safeguards.",
    "researched_at": "2026-11-03",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi",
      "author": "Pi lead assistant; ten Terra workers supplied bounded evidence only",
      "model": "gpt-6-astra (lead, session roster); openai-codex/gpt-6.1-terra (evidence retrieval, max effort)"
    },
    "related_reports": [
      {
        "id": "ai-development-evidence-2026-11-03",
        "relationship": "reuses"
      },
      {
        "id": "ai-development-sources-2026-11-03",
        "relationship": "reuses"
      }
    ],
    "warnings": [
      "DRAFT: independent validation/review remains paused at the user’s request. This import is storage only, not acceptance or publication.",
      "Recommendations are proposed local defaults, not a proven optimal pipeline, active global policy or production-readiness certification.",
      "Exact original body preserved. Relative links resolve in the original bundle at /home/eldar/.local/share/pi-research/ai-development-workflow-2026-11-03; raw source archives and worker evidence were not imported.",
      "Byte integrity and HTTP retrieval do not verify conclusions, currentness or redistribution rights."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T18:17:00.000Z",
    "updated_at": "2026-11-04T18:17:00.000Z",
    "imported_at": "2026-11-02T23:51:46.110Z"
  },
  "warnings": [
    {
      "code": "unverified_relationship",
      "message": "Relationship to ai-development-evidence-2026-11-03 is unverified until reviewed."
    },
    {
      "code": "unverified_relationship",
      "message": "Relationship to ai-development-sources-2026-11-03 is unverified until reviewed."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "4599195a7de75c9ef1eb205ac6b1947f58fac31f03410aeb1e858ea73785e798",
  "proposalRevision": "872c8f5e8836564d552e3b24d39fef198a388c00ae4c657bc14108b090ca111a"
}
---
# Reliable, fast AI-assisted software development

**Research and recommendation — 3 November 2026**  
**For:** a non-developer building relatively small products with AI.  
**Status:** draft workflow; not yet independently reviewed, installed in your global instructions or validated on your projects. **Paused after drafting at your request; validation/review has not started.**

## The recommendation in one minute

Use **one accountable lead agent, small useful changes, risk-based verification, and a ranked list of findings**. Add workers or review stages only when they have a specific job that improves the outcome.

The objective is **less unnecessary work, not less evidence**:

- A test must protect meaningful behavior or a credible failure—not merely increase the test count.
- A review must identify actionable defects—not invent improvements until a quota is filled.
- Findings must separate **impact**, **urgency**, and **strength of evidence**.
- A change is finished when its agreed behavior works and its required checks pass—not when every possible improvement has been made.
- Before beta, favor speed and reversibility. At beta/release, strengthen safeguards for actual users, data and money. **You can change the method as the product matures.**

These are my recommendations, informed by the research—not a scientifically proven optimal pipeline. In particular, the review budgets and priority labels below are **local starting defaults**, not standards dictated by the sources.

**Reading order:** this guide → [research, academic foundations and ground truth](EVIDENCE.md) → [concise policy and adoption changes](POLICY-PROPOSAL.md). All source IDs link to [the source register](SOURCES.md).

---

# Part I — Software engineering: what makes the product reliable

These principles apply whether code is written by humans or AI.

## 1. Agree on the result, not a large plan

For an ordinary change, the lead records a short task description in the conversation or existing issue:

> **Outcome:** what the user can do afterward.  
> **Acceptance:** observable examples of correct behavior.  
> **Limits:** what is out of scope, and what must not break.  
> **Risk/checks:** what could go wrong and how we will check it.

Example: “Let users export their saved items. Export includes all visible items, empty collections work, and another user's items never appear. Do not redesign the editor.”

You decide product intent, material scope and acceptable exposure. The agent chooses ordinary implementation details and test boundaries. It should not ask you to approve an unfamiliar technical abstraction when it can make that decision safely itself.

Use a longer design only for substantial uncertainty, a consequential architectural choice, or difficult-to-reverse work. Build a small end-to-end piece before expanding. Small changes are easier to understand, verify and undo. [S06](SOURCES.md#s06), [S08](SOURCES.md#s08)

## 2. Choose the verification level by consequences

Ask: **What fails? Who or what is exposed? How likely is it? Can we undo it?** Risk-based testing is established practice; it is not an excuse to skip checks. [S04](SOURCES.md#s04)

| Lane | Typical change | Verification and review |
|---|---|---|
| **Light** | Documentation, harmless wording, isolated presentation changes | Check the actual result, run applicable cheap checks, inspect the diff. No separate AI reviewer by default. New automated tests may be unnecessary. |
| **Standard** | Ordinary feature, bug fix, API behavior or internal refactor | Relevant existing checks; focused new tests where behavior/risk is not covered; real feature smoke check. One independent review of the candidate. |
| **High-consequence** | Authentication, authorization, payments, secrets, destructive actions, migrations affecting valuable data, public execution of untrusted input | Explicit failure scenarios; appropriate integration/security checks; tested recovery where applicable; a qualified review focused on the risk. Human approval before consequential external actions. |

**Small does not mean safe.** A tiny configuration change can expose credentials. A ten-row database can hold irreplaceable work. The highest credible consequence selects the lane; project size alone does not. Unclear but potentially serious risk calls for investigation, not a cosmetic “low-risk” label.

## 3. Write fewer low-value tests—not fewer useful tests

There is no evidence-backed universal number of tests per feature. Google explicitly warns that chasing coverage can create low-value tests and maintenance debt, while also emphasizing that uncovered important behavior is a real gap. [S01](SOURCES.md#s01), [S02](SOURCES.md#s02), [S03](SOURCES.md#s03)

### Before adding a test, the agent should answer

1. **Which behavior or plausible failure does this protect?**
2. **Is it already covered adequately?**
3. **What is the cheapest reliable level that can actually detect it?**

If it cannot answer, it should reconsider the test—not create a lengthy justification document.

### Practical defaults

- **Bug fix:** reproduce the reported failure. Add a focused regression test at the real failure boundary when feasible; verify it fails for the bug and passes with the fix. A passing test of a nearby helper is not enough.
- **New behavior:** check the useful path and the relevant failure/boundary cases. Authentication, persistence and integrations often need integration tests; isolated logic often needs only small unit tests.
- **Refactor with unchanged behavior:** existing behavioral tests should largely remain unchanged. Add tests for a demonstrated gap, not to mirror every moved function.
- **UI:** actually inspect or exercise the running feature when feasible. A screenshot checks appearance, not whether clicking Save persists the right data. Preserve a few valuable end-to-end journeys rather than turning every cosmetic adjustment into a large browser suite.
- **Documentation/configuration:** validation may be a link, parser, build, actual loader or runtime check rather than a newly invented permanent test suite. Configuration touching security/deployment is not automatically light work.
- **Use the existing suite.** If it is cheap, running it is usually better than spending longer constructing a selective runner. At iteration time run the affected checks; before release run the project's full required checks.

### Avoid these traps

- A test for every private method or every implementation detail.
- Many parameter combinations that all exercise the same meaningful case.
- Mocks that verify internal call choreography while missing the real outcome.
- Expected answers copied from the implementation being tested.
- Large snapshots accepted without understanding the changes.
- Forcing 100% coverage, or copying a test-pyramid percentage from another organization.
- Deleting, weakening or skipping failing tests merely to obtain a green result.

Some overlapping tests are valuable: a library's own contract and a user's integration can both deserve protection. Remove existing tests only after understanding what they protect; “fewer tests” is not an independent deletion goal.

**Test-first development is a useful technique, not a compulsory ceremony for every change.** Use it when a clear behavioral test provides a tight feedback loop or you explicitly request it. Expensive techniques such as mutation testing, fuzzing and broad performance testing should answer a relevant risk, not run automatically on every task.

## 4. Review once, then verify the fixes

Google's review standard favors a change that improves the system even if it is not perfect, and distinguishes optional polish from important issues. It does **not** prescribe an ideal number of AI reviewers. [S05](SOURCES.md#s05), [S07](SOURCES.md#s07)

My starting policy:

- **Light work:** the lead checks the diff and evidence; no extra reviewer.
- **Standard work:** one independent reviewer considers correctness, requirements, maintainability and relevant security **in one pass**.
- **High-consequence work:** choose the necessary expertise and checks deliberately. A second specialist can be justified by a distinct risk; five general reviewers are not a substitute.
- After fixes, **recheck the affected findings and checks**, not the entire project from scratch.
- If an initial review plus a targeted fix-verification cycle still leaves a significant blocker, stop the automatic loop. The lead diagnoses, narrows scope or seeks appropriate expertise. It must not declare success or silently accept the risk because the budget ran out.
- A substantial subsequent change invalidates the affected evidence and may justify a newly scoped review.

The reviewer must be allowed to report **no findings**. No “find at least five issues” prompts. Report facts and consequences; label uncertain concerns as such. Keep optional improvements out of the blocking list. An unrelated finding can be recorded without expanding the current task.

A separate AI reviewer provides another perspective, not statistically independent proof. GitHub's own guidance describes missed issues and false positives, and calls for human review to supplement its AI review. Because you are not a developer, do not replace qualified technical judgment with a request that you personally approve unfamiliar code. Obtain qualified human help for consequential security/domain decisions that the available checks cannot adequately establish. [S28](SOURCES.md#s28)

## 5. Rank every actionable issue

Use the existing project tracker if one exists. Otherwise a short table in the task is enough. Do not introduce another tracker merely to hold the rankings.

### Keep three separate fields

- **Severity = consequence:** Critical / Major / Moderate / Minor.
- **Priority = when to act:** the P0–P3 convention below.
- **Evidence = how established:** Confirmed / Supported concern / Unverified.

ISTQB separates severity from priority. FIRST likewise warns that a security vulnerability's base severity score is not a full risk assessment. Neither defines this particular P0–P3 scheme. [S04](SOURCES.md#s04), [S29](SOURCES.md#s29)

| Priority | Meaning | Action |
|---|---|---|
| **P0 — Act now** | Ongoing or imminent serious harm: exposed secrets, active unauthorized access, destructive data loss | Stop the harmful operation, contain the problem, notify you. Do not wait for routine feature work. |
| **P1 — Blocker** | A serious defect or unmet acceptance requirement blocks this change or the intended release/exposure | Fix or demonstrably contain before proceeding. Uncertain serious findings need prompt investigation. |
| **P2 — Planned** | Real issue, but the intended use remains viable and the current risk is acceptable | Schedule it; record any workaround and why it does not block. Release acceptance of relevant known P2 risk is explicit. |
| **P3 — Optional** | Low-impact polish or an optional improvement | Defer unless in scope. Call a suggestion a suggestion, not a proven bug. |

Severity can be low while priority is high: an incorrect launch date may be easy to fix but must be corrected before an announcement. Conversely, an unexposed feature can contain a severe flaw without being an active P0 incident. Disabling exposure must be real and verified, not a relabeling trick.

A compact finding looks like:

> **P1 · Major · Confirmed — Export exposes another user's items**  
> Trigger: signed-in user requests another user's export ID.  
> Evidence: reproduction and relevant file/lines. Impact: cross-user data disclosure.  
> Action: enforce ownership; verify own export succeeds and foreign export is denied.

An “Unverified” label means investigate, **not** “safe to ignore.” Deduplicate reports of the same cause. Rank by current impact/exposure and urgency; do not fabricate a precise probability or risk score when no data supports it.

## 6. Use a lightweight pipeline, with stronger release safeguards

### Ordinary development

**Understand → choose lane → make one small change → verify → review if warranted → ranked handoff.**

The lead handles the work. You are involved when it needs a product decision, material spending, a consequential risk decision or permission for publication/destructive actions—not every technical detail.

### How the method can change

| Stage | Keep | Add only as needed |
|---|---|---|
| **Disposable exploration** | Clear experiment/question; versioned or otherwise recoverable starting point; no real secrets/customer data in experiments | Direct demonstration and a simple smoke check may suffice. No broad suite for code genuinely intended to be discarded. Reclassify it before reuse with real users. |
| **Private pre-beta product** | Small changes, existing checks, ranked findings, standard review for meaningful behavior | A small durable set of tests for core behavior; reproducible setup; real app checks; simple recovery. |
| **Beta with users** | The same clear outcomes and bounded reviews | Automated core regression checks, access-control checks where relevant, preview/staging or a safe representative environment, release smoke check, visible errors and a way to report bugs. Back up valuable data and verify a practical restore path before risky data changes. |
| **First public/paid release** | Keep the process understandable | A repeatable release checklist, identifiable release artifact/version, dependency/secret checks appropriate to the stack, known-issue decision, ownership of incidents, and a demonstrated recovery route. Add privacy/payment/security expertise where the product requires it. |

Do not build enterprise release infrastructure solely because you have reached beta. Sparse beta traffic may be insufficient for meaningful statistical canary comparisons. A preview environment, controlled initial exposure and a real smoke check may be more useful than elaborate rollout automation. [S26](SOURCES.md#s26)

**Rollback of code is not rollback of data or external actions.** Restoring an older application does not undo an email, a charge or an incompatible migration. Identify the actual recovery action before the risky change. NIST's release archives and risk-based checks are useful ingredients, not proof that recovery works. [S24](SOURCES.md#s24)

A release is not ready merely because the agent says “done.” Required checks must pass on the actual candidate, core acceptance criteria must be met, P0/P1 blockers must be resolved or verifiably contained, and remaining relevant risk must be disclosed. Preserve permission requirements for commits, pushes and deployments.

---

# Part II — AI operation: how to make the agents useful

These are additional concerns created by probabilistic models, context limits and tool access.

## 7. One lead; workers for genuinely separable work

The lead owns the requirements, integration, evidence and final conclusion. Workers receive a bounded objective, relevant context, allowed changes, output format and completion check.

Good worker assignments include independent source retrieval, locating a code path, implementing an isolated component in its own worktree, or checking a particular risk. Poor assignments include ten agents all redesigning the same feature, simultaneous edits in one working tree, or review workers recursively spawning more reviewers.

- Use **one writer per working tree**. Separate worktrees solve edit collisions, not integration correctness; the final combined candidate still needs checks.
- Make leaf workers the normal case. Further delegation needs a concrete reason and an owner.
- A worker's “tests passed” is not enough: inspect its actual changes and captured results, then validate the integrated candidate where necessary. Avoid rerunning unaffected expensive checks merely for ceremony.
- Choose model/effort by the difficulty and consequences. The ten Terra/max retrieval workers used for this explicitly requested broad research exercise are **not the proposed everyday coding pattern**.

Current research finds both benefits and costs of collaboration; it does not support “more agents always means better.” A 2026 peer-reviewed comparison found task-dependent outcomes, with important limits on generalizing its small coding subsets. Anthropic's newer harness case study also removed stages that newer models no longer needed. [S14](SOURCES.md#s14), [S15](SOURCES.md#s15), [S35](SOURCES.md#s35), [S40](SOURCES.md#s40)

## 8. Keep instructions short; load specialist skills on demand

Use a short baseline for durable rules. Keep project commands, unusual conventions and domain constraints close to the project. Load a skill when its trigger applies; do not execute every installed skill as a pipeline.

A planning document, TDD loop, formal two-axis code review and multi-phase design audit solve different problems. Combining all of them for a minor fix compounds their cost.

Treat instructions as something to test and prune. Empirical studies of `AGENTS.md` disagree across settings and outcomes: one finds no general task-success improvement with increased work, while another finds efficiency improvements but does not comprehensively evaluate correctness. The defensible conclusion is **task-specific evaluation**, not “instructions never help” or “more instructions always help.” [S19](SOURCES.md#s19), [S20](SOURCES.md#s20), [S21](SOURCES.md#s21), [S30](SOURCES.md#s30), [S32](SOURCES.md#s32)

For long work, retain a small handoff: outcome, decisions, changed files, checks, blockers, next action. A new worker does not inherit the lead's understanding just because it runs on the same machine.

## 9. MCP is connectivity, not correctness or permission

Use MCP when it provides needed external data or capabilities. Prefer the smallest relevant query and tool set. Tool descriptions, retrieved pages and worker reports are **evidence/data**, not authority to change the task.

- Keep credentials and unrelated private material out of research/review requests.
- Use read-only access where feasible; isolate write-capable tools and scope credentials.
- Require approval for publication, destructive changes, spending or other sensitive external actions unless already authorized.
- Actual sandboxing, filesystem restrictions and network controls must be implemented outside model instructions. “Please be read-only” is not an OS boundary.
- Validate tool outcomes. MCP success can mean “the request executed,” not “the information is true” or “the software is correct.”

These principles follow MCP/OWASP guidance, but product-specific enforcement must be checked. Your current Mastra workers have fresh conversations and ordinarily lack the parent's MCP tools; their Bash/filesystem capabilities are not OS-sandboxed by Mastra. Do not assign them a web-tool task they cannot perform or assume they cannot touch sensitive files. [S22](SOURCES.md#s22), [S23](SOURCES.md#s23), [local evidence](evidence/01-local-instructions.md)

## 10. Reassess the AI method as models change

**Keep stable:** requirements, permission boundaries, honest evidence, risk ranking and recovery.  
**Reassess:** model choice, effort level, prompt detail, number of workers, review stages and context-management scaffolding.

After a significant model/harness change—or recurring waste—compare old and proposed behavior on a small set of representative, disposable project tasks. Include a bug, a feature, a low-risk change, a cross-module change and a risky case if relevant. Keep the tasks, starting state and acceptance checks comparable; record model/harness/instruction versions and cost/time. Repeat close or inconsistent results rather than treating one run as proof.

Track **accepted outcomes, escaped defects, rework, elapsed time and material cost**. Test count, tokens generated, reviewer count and lines of code are not success metrics. Initially a short note using existing artifacts is enough; no evaluation platform or new tracker is required.

Change one workflow component at a time. Keep a change if it preserves required quality while improving speed/cost, or demonstrably improves quality at an acceptable cost. Revert it if important failures increase. This is a practical pilot, not a statistically conclusive benchmark. [S12](SOURCES.md#s12), [S13](SOURCES.md#s13), [S17](SOURCES.md#s17), [S35](SOURCES.md#s35)

---

## What I found in your current instructions

This is an inspection of rules, **not a historical audit proving why previous sessions overtested**.

1. `~/.pi/agent/AGENTS.md` already says to keep simple work simple, use relevant skills selectively, and avoid duplicate/nested review workflows. Preserve that.
2. `~/.pi/agent/skills/engineering/code-review/SKILL.md` explicitly launches two review agents and says **“Do not merge or rerank findings.”** That is a concrete mismatch with your request for one useful ranked decision list. Standards/spec categories can remain without forbidding priority ranking.
3. That review skill's prescribed `git diff <fixed-point>...HEAD` can omit the uncommitted work its description says it can review. Your global baseline already requires the actual candidate; the skill should be brought into alignment.
4. The TDD skill already rejects implementation-coupled and tautological tests. However, it asks you to approve technical test seams before writing any test. For a non-developer, approving observable behavior is more useful; the agent can usually choose the technical seam.
5. EGM's multi-stage design reviews are substantially heavier than ordinary code checks. Keep them available for explicit design work, not as the default for a small feature. The retrieval found ambiguities around severity terminology and review caps; resolve them if adopting those workflows, rather than stacking new rules on top.

The [policy proposal](POLICY-PROPOSAL.md) lists targeted changes. **No global instructions, skills, worker profiles or MCP settings were modified by this research.**

## Bottom line

Your best starting point is not “maximum testing” or “maximum autonomy.” It is **clear outcomes, small changes, useful verification, one accountable lead, and explicit stopping rules**—with stronger safeguards only where the consequences justify them.
