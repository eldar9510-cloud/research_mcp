# research_mcp

A reusable research library for Pi: find previous investigations, reuse what applies, improve them when requested, and publish reviewed results for future sessions.

**Status: local archive, automatic Pi coverage workflow and approval-bound host publication.** The MCP stdio server imports finished Markdown/plain-text reports as **local unaccepted proposals**, then explicitly reviewed reports can be accepted **locally and unpublished** through the supported interactive Pi approval gate. A compact rebuildable catalogue supports bounded lexical discovery and revision-bound report reads across sessions. See [docs/import.md](docs/import.md) for the proposal contract and [docs/acceptance.md](docs/acceptance.md) for actual Pi setup, approval, search, recovery and tests. The separate [Pi publication command](docs/publication.md) binds one human approval to acceptance, an exact report/catalogue commit and push; verification uses disposable local remotes only. The [automatic Pi coverage workflow](docs/pi-workflow.md) adds bounded local discovery, selected evidence reading and main-Pi applicability decisions, with optional explicitly permitted existing Jev reranking and local fallback. It only offers future research/improvement; research jobs are not implemented.

## Planned workflow

1. Automatically search a compact catalogue before substantial research.
2. Read relevant report sections; use the existing Jev integration for optional relevance reranking.
3. Reuse covered findings, offer targeted improvements for gaps, or propose new research.
4. Run an explicitly authorized, bounded investigation with **Sol at maximum reasoning effort**, or import a finished report from another platform.
5. Review the report/diff and target, then approve one combined acceptance/commit/push operation, or choose local-only acceptance instead.

Existing reports are not automatically improved or source-checked. Incomplete research stays local. The initial interface is **Pi only**; no website, accounts, or vector database is planned for v0.

## Specification

See **[docs/PRD.md](docs/PRD.md)** for the detailed requirements, data format, proposed MCP tools, research lifecycle, approval rules, acceptance tests, and milestones.

Implementation proposals and unverified live-runtime details are explicitly distinguished from confirmed product requirements. No real research reports have been imported into this repository yet; tests use original fictional fixtures.

## Licenses

- Engine code and project documentation: [MIT](LICENSE).
- Finished research reports, when added and where the contributor has the necessary rights: [CC BY 4.0](LICENSE-REPORTS.md).
- Third-party sources retain their own licenses and terms.
