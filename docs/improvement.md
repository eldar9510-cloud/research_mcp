# Explicit scoped improvements (#9 candidate)

An old/partial report is not authorization. Coverage remains read-only. Main Pi interprets the **whole delivered current user request**; ambiguous scope or permission asks and waits. Use the existing TUI `research_request` → unchanged ordinary MCP call, then the existing single publication approval. No new provider, approval store, job queue or semantic auto-merge is introduced. This candidate is subject to parent review/integration; tests are not issue closure.

## Strict request

```js
{
  mode: 'improve',
  question: '<exact original question for same_report>',
  scope: '<exact original scope for same_report>',
  language: 'en',
  references: [{ reportId: 'existing-id', expectedRevision: '<64-hex accepted digest>',
    selection: { startByte: 0, endByte: 120 } }],
  improvement: {
    base: { reportId: 'existing-id', expectedRevision: '<same accepted digest>' },
    disposition: 'same_report', // OR linked_report, settled before paid work
    gaps: ['One specific requested missing comparison'],
    oldSourceChecks: [] // explicit NONE; never interpreted as refresh all
  },
  partials: [], limits: {} // existing optional tighter ceilings
}
```

The strict variant requires 1–4 gaps (each <=200 characters), an exact base and a nonempty selected reference to that base at the same revision. Other existing reference/partial limits remain unchanged. `same_report` requires the exact canonical original question/scope/language; materially different intent uses `linked_report` with the new question/scope, not an automatic classification by the investigator. Invalid or unresolvable composition stops before dependency/auth/model setup. An explicit improvement requires no coverage prerequisite.

`oldSourceChecks` contains at most three particular `{url, claim, contains}` or `{url, claim, offset}` objects (exactly one selector). Claim <=200, contains <=80, offset 0..65536. URLs must already occur in the exact base and satisfy the existing canonical public HTTPS policy. Fetch still requires exact successful search membership. Known base URLs cannot be fetched with an unrequested selector, even if newly searched. No direct-fetch/adapter bypass, blanket refresh or fallback. A requested check not performed is recorded as **unchecked**. Every actually inspected check records its exact selector/claim, passage range/digest and actual access date; access is not verification. A failed source tool ends with the existing accurate failed/incomplete outcome, never a fabricated finished check.

Selected prior material includes its exact warnings, corrections, successors, dates/origin and citation definitions. That material and partial/tool results share the existing **10,000 UTF-8 byte** aggregate ceiling. Missing/unresolved/over-budget context fails before paid setup. The host receipt resolves/revalidates this same material, base, check scope, roots and limits before preparation and dispatch. Receipt consumption remains atomic, single-use and never refundable. No full base/archive/chat/rationale is sent automatically to the investigator. Local full-base reading is only deterministic composition/staleness/known-old-URL inspection (at most 256 known URLs).

## Composition, identity and dates

The unchanged strict final JSON → schema → known citations → independent inspected core S# → literal quotation checks validate a **bounded change**, not a regenerated whole report. The engine appends a deterministic dated limitations/contribution note and validated findings/evidence addendum. It preserves all original body bytes, including BOM/CRLF/Unicode, alternatives, caveats and citations. This is deliberately append-only, not a semantic rewrite/splice/auto-merge. Narrow reads expose the precise selected byte scopes, retained conclusion qualifications, requested/actually inspected/unchecked checks and currentness dependencies through required warning context. Human review still evaluates whether changed conclusions are justified.

Later citation labels use `I<32-hex-job>-S1/R1/P1`. Original definitions never change. A same-report base citation points to that job's exact prior-base qualification note, not silently to current report bytes, and no metadata self-relationship is created. Exact inherited source strings remain inert JSON, including citations/instructions; the reader preserves their meaning and qualifications.

For `same_report`: stable ID, original `researched_at` (including null), `origin`, `created_at`, `imported_at`, canonical scope and existing relationships/successor survive. `last_improved_at` is the actual job date; `updated_at` is the reviewed acceptance time. A dated note identifies requested changed findings/scopes, evidence/access dates, reused unchecked material, remaining dependencies and known Sol/max contributor (human unknown). No report-wide verification label is added.

For `linked_report`: a new job-derived ID, new-research date and engine provenance, with an explicit reviewed `extends` relation by default. The original report is untouched and not automatically superseded. To explicitly correct/replace it, set `linkedRelation:'corrects'|'replaces'` **and** `baseNotice:'precise requested notice'` (<=200 characters). That exact one base notice becomes an additional affected file in the SAME review/acceptance/commit/push. `replaces` also explicitly sets its successor; existing recorded successors cannot be silently overridden. `corrects` preserves any existing successor. Original base bytes/warnings/provenance remain; notice-only edits do not falsely renew the base's substantive research date. No general batch or unrelated affected records are accepted.

## Immutable review, diff and defensive application

The host-internal archive `createImprovementProposal` stores an explicit operation with exact base, disposition, job identity, normalized-request digest and any finite linked notice. The proposal revision hashes operation + metadata + intended body digest; source/proposal files are unchanged by acceptance. Ordinary imports/new proposals retain identity, duplicate and provenance protections. Legacy records remain readable.

`review_research_draft` returns `diffRead`. Call `read_research_diff` and pass **every whole continuation unchanged** until null. Pages are bounded by configured archive read bytes and the existing 48 KiB visible limit. They bind proposal/base/acceptance time/review digest and expose the COMPLETE report/catalogue textual change, including metadata, sources, scope/summary, dates, origin and relationships. The codec uses one complete changed-middle line hunk per file (not a minimal semantic diff); it may include unchanged middle lines, but never omits changed bytes. Host publication additionally shows exact before/after files and complete diffs, all paths and target in the existing bounded scrollable viewer.

Stale bases conflict before setup, after a held investigation/before proposal persistence, at review, after approval and after the actual prewrite checkpoint immediately before replacement. No rebasing/retry. Application replaces only the finite reviewed report set and derived catalogue entries, preserving unrelated entries without another model. Existing single-writer/no-transaction limitations apply. A later write/index failure may leave accepted reports and a stale catalogue; inspect and explicitly rebuild, never claim rollback or blindly reapply. Catalogue changes at the final checkpoint are refused rather than overwritten.

`/research-publish <proposalId> <remote> <branch>` retains one approval for accept + exact combined commit + non-force push and all prior target/index/worktree/outgoing/protocol/content checks. Denial leaves report/index/HEAD/remote unchanged. No publication capability is given to the investigator.

## Recovery and controlled evidence

Job output artifacts hold only the bounded validated change, not a whole merged base. Completed same-ID imported-origin recovery requires the exact proposal revision, operation/job/base/disposition/request digest, selected immutable request date and optional relationship/notice lineage. A stale historical base does not erase actual completion; obsolete application still conflicts. Corrupt/unrelated imported proposals do not prove completion. All #7/#8 limits, shutdown/release/retention/privacy/status behavior remain.

New deterministic seam tests: `tests/improvement-{archive,research,publication}.test.js`. `tests/pi-improvement-probe.mjs` uses the actual installed SDK/adapter, ordinary production stdio, scripted intent/tool transport/TUI keys, complete diff, denial, one approved operation to a disposable **LOCAL bare remote**, Git parent/citation inspection and fresh-host discovery/read/completion recovery. Use the same `PI_SDK_ROOT`/`PI_ADAPTER_INDEX` setup as existing probes. These prove controlled offline mechanics, **not** live provider/source accuracy, real-human intent, public GitHub publication or a new live permission. All prior real-operation permissions remain consumed. Owner scope is #9 then PAUSE, not #10/#11.
