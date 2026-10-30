# research_mcp

A reusable research library for Pi: find previous investigations, reuse what applies, improve them when requested, and publish reviewed results for future sessions.

**Status: specification stage.** This repository contains the approved product requirements. The MCP server, research engine, and Pi integration are not implemented yet.

## Planned workflow

1. Automatically search a compact catalogue before substantial research.
2. Read relevant report sections; use the existing Jev integration for optional relevance reranking.
3. Reuse covered findings, offer targeted improvements for gaps, or propose new research.
4. Run an explicitly authorized, bounded investigation with **Sol at maximum reasoning effort**, or import a finished report from another platform.
5. Review the report or diff, then approve the commit and push.

Existing reports are not automatically improved or source-checked. Incomplete research stays local. The initial interface is **Pi only**; no website, accounts, or vector database is planned for v0.

## Specification

See **[docs/PRD.md](docs/PRD.md)** for the detailed requirements, data format, proposed MCP tools, research lifecycle, approval rules, acceptance tests, and milestones.

Implementation proposals and unverified live-runtime details are explicitly distinguished from confirmed product requirements. No real research reports have been imported into this repository yet.

## Licenses

- Engine code and project documentation: [MIT](LICENSE).
- Finished research reports, when added and where the contributor has the necessary rights: [CC BY 4.0](LICENSE-REPORTS.md).
- Third-party sources retain their own licenses and terms.
