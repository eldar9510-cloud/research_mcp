---
{
  "format": 1,
  "metadata": {
    "id": "archived-mastra-supported-specialist-follow-ups-source-grounded-recommendation-5f5747a3",
    "title": "Mastra-supported specialist follow-ups: source-grounded recommendation",
    "question": "What findings, alternatives and limitations does the historical investigation document about Mastra-supported specialist follow-ups: source-grounded recommendation?",
    "scope": "Original Pi/tooling integration investigation: Mastra-supported specialist follow-ups: source-grounded recommendation. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Mastra-supported specialist follow-ups: source-grounded recommendation; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:37.201Z"
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
      "code": "transcript_dependency",
      "message": "Possible transcript-only evidence; review before publication."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "5f5747a333ae200426fb243ae620d36d1703447a98e0941f6b9d8e3b4f8561a5",
  "proposalRevision": "caa9c08e4dc087cd38df4b491a1acc89f5f24594d9c5f9ad55eab5c43797508b"
}
---
# Mastra-supported specialist follow-ups: source-grounded recommendation

## Scope

Read-only research for the risk-assessment owner. No application/global configuration changes, installs, live model/auth calls, worker dispatch or intercom. No new runtime tests were executed. Official documentation was fetched directly; public source was inspected at commit `6721bffd7eb2ab00df5494817d870db3b540698d`, the previously established core 1.71.0 release commit. Installed `risk_assessment/mastra/node_modules/@mastra/core/package.json` independently reports 1.71.0. Current upstream docs are not treated as proof of the installed API without checking its types/source.

## Finding

Mastra supports repeated delegation and richer agent communication. The restriction that a specialist may be consulted only once in a stage is in the application's adapter and record validator, not a general Mastra requirement. The recommended remedy for bounded follow-up questions is a small change to the existing consultation protocol, not adoption of another messaging service or an untested framework migration.

## Primary sources

1. Official subagents guide: https://mastra.ai/docs/subagents
2. Official multi-agent patterns: https://mastra.ai/docs/guides/multi-agent-systems
3. Agent.generate reference: https://mastra.ai/reference/agents/generate
4. Pinned Agent implementation: https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/agent/agent.ts
5. Pinned delegation types: https://github.com/mastra-ai/mastra/blob/6721bffd7eb2ab00df5494817d870db3b540698d/packages/core/src/agent/agent.types.ts

Installed public declarations additionally inspected: `dist/agent/agent.d.ts:1305–1445`, `dist/agent/types.d.ts:80–299`, and DelegationConfig in `dist/agent/agent.types.d.ts`. Source inspection confirms public message methods route to the thread runtime; this is not a private-controller integration recommendation.

## What Mastra actually supplies

### Ordinary delegation

`Agent({agents:{...}})` exposes subagents as delegation tools. A supervisor uses `generate` or `stream` to select and synthesize their contributions over iterations. Delegation hooks control prompt/context, allow/deny and steps, and observe/curate results. This does not impose an application-wide once-per-role rule.

The current application instead uses native Mastra Agents with its own `createTool`-based `consult_domain`/`ask_domain_peer` wrappers. This is not Pi subprocess delegation. Repeated calls through that existing boundary are sufficient for bounded follow-ups; switching to the `agents` convenience property is not required.

### Context reuse

Built-in subagents create a fresh invocation thread; even an input thread ID receives a generated suffix in the pinned implementation. Their memory is not automatically a stable conversational thread for every revisit. Forwarded parent context is distinct from the transcript saved to the child's memory.

`enableResultReferences` adds references to earlier successful nonempty results within one parent run. Those references are not persisted and missing IDs are skipped with a warning. The feature applies to built-in delegation; enabling it on the current custom tools is not a drop-in change. It cannot replace our durable, validated evidence/advice records.

Default built-in delegation forwards parent context. Use explicitly scoped message filtering if considering that path. Hooks default to warning/continuing on errors; a permission-sensitive use would need `hookErrorStrategy:'throw'` and validation. The feature's existence does not prove compatibility with our selected subscription transport and provenance gates.

### Asynchronous active-agent communication

Installed 1.71.0 exposes experimental `sendMessage`, `queueMessage`, `sendSignal`, queue cancellation and thread events. Active/idle policies distinguish delivery, wake, persistence, discard and blocked targets. An accepted delivery does not mean the recipient answered; subsequent run failures have their own reporting path.

These primitives are relevant if we explicitly need unsolicited messages to independently running agents. Their use would require verifying thread identity, receiving-loop boundaries, consumption acknowledgements, failure/cancellation, recovery, selected transport enforcement and retention. They do not grant domain authority or provide an application-level substantive-answer protocol automatically.

For background completions, the installed source supports `stream(...,{untilIdle:true})`; `streamUntilIdle()` is marked deprecated in the installed declarations, even though the current subagents guide still illustrates it. The idle loop needs memory for automatic continuation, and only `fullStream` spans continuation turns; aggregate text/output properties documented on the legacy helper refer to its first inner turn. Consequently replacing our validated result consumption with a background stream is not a harmless switch.

## Application restrictions found

In `mastra/src/reviewed-engineering.ts`, inspected around lines 135–193:
- `attempted` is initialized from completed advice roles.
- `attempted.has(role)` rejects another consultation, including a completed role.
- `exchangeSenders` permits one outgoing exchange per sender.
- The instructions tell peers never to ask an already consulted role.
- `peerEvidence` limits forwarding to supplied evidence IDs.
- Completed advice and exchange attribution are checkpointed.

In `mastra/src/reviewed-runtime.ts:200–274`, `invoke` rejects an already-active runtime but clears `active` in `finally`. It supports another sequential invocation within existing limits; there is no persistent once-per-role guard there.

In `risk_assessment/mastra_bridge.py:370–390`, native provenance permits at most three advice entries and rejects a repeated role; exchange validation rejects repeated senders. Therefore removing only the TypeScript attempted-role test would produce invalid retained records and weaken the intended bounded contract. This is a coordinated protocol/validation/test change, not a one-line fix.

Existing `mastra/test/reviewed-exchange.test.ts` proves a scripted HTTP path: leader → mechanical → electrical → mechanical continuation → leader synthesis. It does not establish production-provider behaviour or a legitimate revisit to an already-completed specialist.

## Recommended minimal design, subject to owner approval

Preserve native Agents, role grants, subscription transport, Python authority, original deadlines/aggregate credits and existing checkpoints.

1. Distinguish active calls from completed consultations. Reject active recursive wait cycles and self-calls; previous completed participation alone should not reject a valid new question. A different simultaneously active request is not automatically a reusable answer: handle it explicitly as unavailable/in-progress unless a deliberately tested coordination policy exists.
2. Retain a bounded consultation identity plus the question, sender/recipient, task/configuration and relevant evidence identity with the existing compact advice record. Do not key reusable advice by role alone. Exact compatible reuse should avoid new inference; a genuinely new follow-up consumes normal remaining credits.
3. Preserve multiple attributable contributions where needed; do not overwrite the first answer merely to fit the existing one-entry-per-role validator. Select the smallest versioned/backward-compatible record change and update TypeScript, Python validation, rendering and replay together. No new database or transcript archive.
4. For a request back to an agent that is waiting on the callee, return a targeted clarification question through the ordinary response (using the existing questions mechanism where appropriate). Let the caller answer and make a bounded follow-up invocation. Do not recursively invoke the waiting caller and create a deadlock.
5. Keep failure, refusal, invalid output and unresolved engineering questions distinct. None grants credit or clears dependencies; retain completed valid material under the existing policy.
6. Model tools cannot increase budgets, change role/source permissions or create approvals. Existing standards role/stage routing remains separate.

Example of productive bounded back-and-forth:

Leader asks mechanical → mechanical asks electrical → electrical returns an unresolved question about task state → mechanical supplies supported task-state information in a follow-up → electrical returns qualified advice → mechanical continues → leader integrates. This does not require persistent always-running agents, token interruption or a new peer network.

## Test-first acceptance for the other session

Before changing guards, add an offline test where the leader has already consulted electrical and mechanical later needs a new electrical clarification. Demonstrate the current refusal at the public assessment boundary. Then verify:
- new clarification succeeds with distinct attributable contributions;
- an exactly matching completed answer is reused only within the same valid evidence/configuration scope;
- active A→B→A recursion remains denied or is returned as clarification rather than recursively dispatched;
- foreign evidence, unauthorized roles, expired work and exhausted credits remain rejected;
- restart after a completed answer does not duplicate inference or confuse old/current questions;
- Python acceptance, HTML and provenance preserve all material contributions without safety credit.

Live verification is separate and explicitly authorized. The historical initial-leader SSE errors occurred before the target peers participated; neither this architectural finding nor a mock SSE failure identifies that provider cause. Coordinate with the already-active diagnostic work instead of replacing it.

## Decision

For the current requirement—focused exchanges before tasks finish, including useful follow-ups—keep the existing tool-mediated native Mastra design and refine its bounded application protocol. If the owner instead requires unsolicited messages to independently active specialists, evaluate Mastra's existing experimental message/signal APIs in a separate bounded compatibility experiment, not a new external platform and not an automatic extension of this fix.
