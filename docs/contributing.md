# Contributing

The engine is a local release candidate, not yet a published source release; [#11 sign-off remains open](v0-signoff.md). Discuss a scoped change with the maintainer before adding dependencies, services, provider integrations, broad rewrites or new data. Pi is the only supported interactive client; files/Git, one bounded Sol/max researcher and explicit consent remain the v0 boundary. No contribution portal or automated acceptance exists.

## Code and documentation

1. Follow the [approved PRD](PRD.md) and [current contracts](setup.md), not obsolete worker/model defaults in historical planning/proof snapshots.
2. Use Node >=22.19, the lock-selected Pi CLI/SDK 0.84.2 and installed adapter 2.26.1. Do not silently use global Pi 1.5.0, update pins/locks or copy normal credentials/configuration.
3. Keep changes small. Test observable behavior at the agreed archive/MCP/Pi host/Git boundaries; use real disposable files and local repositories. Script only external model/source/intent/TUI seams, and label them controlled—not live or human evidence.
4. Run the [accumulated checks](setup.md#repeatable-checks), including all five existing host probes and the public-corpus and controlled workflow-handoff observations when applicable. Use isolated HOME/XDG/agent/cache/TMPDIR, offline/no-notifier/no-telemetry settings, exact-source HTTP/DNS/TLS/default-auth guards and covered child preloads. Never run `live-once.mjs` or paid/provider/search/Jev work as an ordinary test.
5. Return the actual diff (including new files), exact candidate/dependency identities, commands/results, original failures and unrun checks. Preserve limits, negative assertions and frozen retrieval gold; independent review/integration and explicit commit/push approval remain maintainer responsibilities. A passing worker/model verdict is not acceptance.

The ten questions/acceptable IDs and first #10 results are immutable evidence, not tunable fixtures. New measurements use new result names and identify current code, report revisions and catalogue digest. Checkout-mtime staleness requires inspected **fixture-only** rebuild during tests; a real archive maintenance change needs separate review/clean-baseline approval. Never restore fake historical mtimes, change relevance after scoring or turn lookup failure into empty.

## Reports

- Propose only selected finished Markdown/plain-text material you are authorized to share. Follow [report-format.md](report-format.md) and [import.md](import.md); import is a local unaccepted proposal, not research or publication permission.
- Preserve original useful content, citations, alternatives, known authorship/platform/model, original/unknown dates, correction/successor notices and unchecked limitations. Request targeted improvements explicitly; do not imply a new import/update verifies old claims.
- Review the full report/diff, source/quote rights, attribution, personal information, secrets, unresolved references and exact publication target/files/outgoing commits. Heuristics, HTTP success, relevance scores and model assertions are not factual or legal clearance.
- Never contribute auth/config/key files, raw conversations/SDK sessions, incomplete job artifacts, private examples, whole personal caches or third-party PDFs simply because they were referenced. Keep selected work/import roots outside the public archive.

Code and project documentation contributions are under [MIT](../LICENSE). Contributions of authored reports require the rights to license that content under [CC BY 4.0](../LICENSE-REPORTS.md); preserve attribution and indicate changes. Third-party material retains its own rights and terms. State exceptions/unknowns for maintainer review—do not infer permission from public availability.

Use normal maintainer-reviewed pull requests once source publication is available. Saving a proposal, passing checks or opening a PR grants no accept/commit/push authority. [Publication failures](publication.md#receipts-and-partial-operation-recovery) and [incomplete jobs](research.md#cancellation-and-recovery-procedure) must retain honest local state; no automatic retry, rollback, resume or destructive cleanup.
