# Reviewed Pi-host publication (issue #5)

**No real report or repository push is authorized by installing this code.** Publication is a separate, explicit human decision. Tests below use only disposable local repositories and bare remotes. Import, research completion, saved proposals, local acceptance, model assertions and `approved: true` are not publication permission.

## Setup and use

Use the [acceptance setup](acceptance.md): three existing absolute disjoint roots, the project-local extension and installed Pi MCP adapter. Local-only acceptance remains available unchanged through its digest-bound MCP broker. Publication is an ordinary **host command**, not an MCP/research/model tool:

```text
/research-publish <proposalId> <existing-remote-name> <current-branch>
```

The archive root must itself be the canonical Git worktree root, on the named attached branch, with an existing destination branch and **HEAD exactly equal to that destination**. The command does not initialize repositories, create remote branches, fetch, rearrange branches or grant approval to existing outgoing engine/source commits. If this implementation branch has unpublished code, it cannot hitchhike in a report push: stop and obtain a separately approved publication arrangement first. Repository setup or publishing engine code is not authorized by report consent.

Run the command in an idle interactive TUI session. It inspects the index, worktree (including ordinary untracked files), target and entire outgoing range **before** offering approval. Any unrelated changes or outgoing commits stop the operation; nothing is reset, stashed, force-pushed or cleaned up. Work/proposal/import roots stay outside the archive. Ignored artifacts are not staged; only the exact reviewed two paths can enter the commit. Before approval and again before acceptance/commit, the proposed catalogue is checked against **all report blobs in the candidate Git tree** (existing baseline plus the reviewed report), including paths, regular-file types, sizes and SHA-256 revisions. The committed tree is checked again before push. An ignored, previously accepted local report cannot appear in the published catalogue unless it is already present with matching bytes in the Git baseline. Otherwise this two-file operation stops before acceptance: it does not add that report, drop its entry, unignore paths or rearrange local work. Publish such earlier work only under a separate explicit review/authorization.

A read-only, wrapped, scrollable host viewer shows:

- Proposal/source/base digests, the reviewed acceptance timestamp and prior/new catalogue revisions.
- Full new report (a new-file diff), exact old/new catalogue bytes, exact paths, blob digests, sizes and file modes.
- Scope, summary, original research/improvement/import/acceptance dates, origin, relationships/supersession, warnings and all source/citation text. References are not fetched or repaired by invention.
- Canonical repository, local branch/HEAD, remote name, effective **push** URL/ref/revision, relevant Git configuration digest, all outgoing commits (required empty before acceptance), proposed commit message and complete publication-envelope digest.
- Prompts to review credentials/personal data, rights/attribution and redistribution, unresolved evidence and local-only dependencies. These are **not guarantees** of secret absence, legal rights or factual correctness.

Use arrows, PageUp/PageDown, Home/End to inspect the complete review; the viewport is at most 20 body rows and adapts to terminal width. **Ctrl+Y is the single approval for accept + commit + push; Escape/Ctrl+C denies.** Enter and report text cannot approve. No second routine acceptance or Git approval is required. The display escapes terminal/bidirectional controls, including U+061C/U+200E/U+200F; original bytes remain unchanged. Reviews exceeding 24 MiB after display escaping fail closed rather than silently truncate.

After approval, the host recomputes the archive review and Git snapshot. Proposal, catalogue/base, exact bytes/file set, branch/HEAD, target/config or outgoing-range changes invalidate consent before acceptance. The archive independently checks its original review digest again. The host then accepts through the existing narrow archive interface, stages only report + catalogue, verifies their exact staged bytes, commits them together, checks the committed paths/blobs/parent and entire outgoing range again, and pushes only that commit to the reviewed branch. Sensitive operations never run from the researcher or MCP research tools.

## Supported Git behavior and limits

The host uses bounded argument-array Git commands (15 seconds and 12 MiB captured output per command), never a shell. It strips inherited `GIT_*` redirection variables, disables local hooks/fsmonitor/automatic maintenance and replacement objects, disables commit/push signing for this operation, and pushes an explicit non-force single-branch refspec with no tags or recursive submodule pushes. Hooks/signing are not silently substituted as permission checks. Projects requiring those features need a separately reviewed arrangement.

Exactly one effective push URL is supported: canonical absolute local path, HTTPS without embedded credentials, or SSH/scp-style Git target. Remote push URLs and ordinary `insteadOf`/`pushInsteadOf` rewrites are resolved and bound; ambiguous chained rewrites, multiple push destinations, mirror remotes, configured push options, custom receive commands/helpers, content filters, hidden index flags, shallow history and in-progress Git operations are refused. Git's normal supported credential mechanisms may be used at execution time; credentials are never copied into reviews, project files or receipts. This slice does not set up credentials or test live authentication.

The destination must be a **direct branch ref**, never a symbolic ref to another branch, even if both resolve to the same commit. Every target inspection uses `ls-remote --symref` and refuses symbolic destinations. Git protocol v0/v1 can hide non-HEAD symbolic refs, so inspections explicitly request **protocol v2** and require its negotiated handshake; legacy-server fallback or unverifiable negotiation fails closed. Bounded packet diagnostics are captured only in memory to check that handshake and discarded, not copied into reviews or receipts. This is a pre-dispatch revalidation, not protection against a remote changing refs during an in-flight push; no remote-side concurrency transaction is claimed.

`hash-object --no-filters` plus explicit index entries preserves approved bytes despite line-ending settings. Report mtime is set to the reviewed acceptance timestamp rounded down to a whole second, synced and verified; the exact generated catalogue is therefore known **before** acceptance. This is an archive indexing timestamp, not evidence of source verification. A filesystem that cannot retain it fails visibly. New clones/checkouts may have different report mtimes and require explicit catalogue rebuild after inspection, as with manual archive edits; this does not authorize a push of the rebuilt catalogue.

This is a supported local Pi workflow, **not authentication, an OS sandbox, or a transaction against concurrent same-user writers**. Keep one writer per archive/work root. Another local client can call trusted local MCP or write files; ordinary Pi shell/file tools still have the user's permissions. The existing acceptance broker's alias/target checks and limitation concerning programmatically injected adapter configuration remain unchanged. Publication does not infer a Git target from an MCP alias.

## Receipts and partial-operation recovery

The session stores `research-publication` entries with the envelope digest and actual operation state, not full report text. The final notification repeats the result. `accepted`, `committed`, `published` are separate; **null means uncertain, not false**.

| State | Meaning / next action |
| --- | --- |
| `not_approved`, `denied`, `validation_failed`, `stale_review` | No acceptance/commit/push dispatched; inspect and request a fresh review if desired. |
| `acceptance_uncertain` | Acceptance failed or lost its receipt and may have written a report or catalogue. Inspect both; use explicit catalogue rebuild only after validating reports. Never blindly accept again. |
| `accepted_local` | Accepted report/catalogue remain local; staging or commit failed/stopped. Some reviewed paths may already be staged. Inspect them without broad staging, resetting or cleanup. |
| `commit_uncertain` | Git's commit result could not be established. `observedHead` is evidence, **not proof it is the approved commit**. Inspect HEAD/parent/paths/blobs before doing anything else. |
| `committed_unpushed` | A local commit is known, but push was not dispatched or its sole ref was explicitly rejected. Keep and inspect the reported commit; no duplicate acceptance/commit is needed. |
| `push_pending`, `publication_uncertain` | The push may have completed; its receipt or remote verification is unavailable. Inspect the reviewed remote ref before claiming failure/success or considering a retry. |
| `pushed` | Push returned success and a read-only remote check observed the reviewed commit on the target branch. This is not factual/legal certification. |

There is **no automatic retry, reset, force, rollback or cleanup**. A later retry requires explicit authorization and review of the existing commit, current destination/outgoing range and any intervening changes. Use ordinary reviewed Git to push that existing commit when appropriate, not this proposal-acceptance command again. This command intentionally refuses already-outgoing commits and accepted report IDs rather than pretending to be a recovery scheduler.

## Reproducible offline checks

```sh
npm run check
npm test
npm run test:mcp
PI_SDK_ROOT=/absolute/installed/@earendil-works/pi-coding-agent \
PI_ADAPTER_INDEX=/absolute/installed/pi-mcp-adapter/index.ts \
PI_OFFLINE=1 PI_TELEMETRY=0 node tests/pi-host-probe.mjs
PI_SDK_ROOT=/absolute/installed/@earendil-works/pi-coding-agent \
PI_ADAPTER_INDEX=/absolute/installed/pi-mcp-adapter/index.ts \
PI_OFFLINE=1 PI_TELEMETRY=0 node tests/pi-publication-probe.mjs
git diff --check
```

Focused tests instrument acceptance and Git dispatch and exercise real local Git, exact report/catalogue blobs together, successful actual bare-remote push, actual receive rejection, denial/headless/boolean/cancellation, changed proposal/catalogue/target/branch/outgoing state, unrelated work/staging, pre-existing and same-OID mutated symbolic destinations (including partial-operation revalidations and protocol visibility), ignored prior local acceptance, valid prior tracked reports, baseline report digest mismatch, commit and uncertain partial failures. The new host probe loads the actual installed SDK and adapter, uses deterministic fake TUI **keys** against the actual scrollable viewer, instruments Git and checks no accepted files for negatives, then performs an actual **local-only** push. It makes no model/search calls, reads no normal auth stores, changes no global configuration and claims **no real human click or real-remote publication**. Independent parent review and a separately authorized interactive/live demonstration remain distinct from these controlled checks.
