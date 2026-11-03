# research_mcp

A reusable research library for Pi: find previous investigations, reuse what applies, improve requested gaps, and publish reviewed results for future sessions.

**Release status:** [Issue #11](https://github.com/eldar9510-cloud/research_mcp/issues/11) records current acceptance and publication state. This checkout combines the engine and the already-approved twenty-report corpus. Follow the setup guide only from an identified engine-containing revision: the historical report/evaluation-only commit `265fc3c93448dcc6393f1a127cc347ce8729d9e2` does not contain a runnable engine. See the [labelled evidence and limitations](docs/v0-signoff.md); this README does not independently declare v0 acceptance.

The public [twenty-report/ten-question evaluation](evaluation/issue10/README.md) recorded **10/10 useful top-three results** (required: 8/10), using local ranking, not Jev. Reports retain historical/unknown dates, imported origin, citations and correction warnings; retrieval and publication do not verify their conclusions or source rights.

## Use the candidate

Start with [pinned setup](docs/setup.md): Node **>=22.19**, project-local **Pi CLI/SDK 0.84.2**, and the separately installed **pi-mcp-adapter 2.26.1**. The observed global Pi 1.5.0 is not the supported/tested target. Do not change global configuration or dependency pins to follow this guide.

1. [Search and assess coverage](docs/pi-workflow.md); read selected [revision-bound evidence](docs/reading.md).
2. Reuse covered, dated findings without automatic source refresh or research.
3. For gaps, explicitly request a [targeted improvement](docs/improvement.md) or [new Sol/max investigation](docs/research.md). Alternatively [import a finished external report](docs/import.md), without a research run.
4. Review all report/diff pages, qualifications, exact files and target. Choose [local-only acceptance](docs/acceptance.md), or one separately approved [accept/commit/push operation](docs/publication.md).
5. In a fresh session, discover by question and read the returned report ID/revision—not a manually pasted file path.

Proposals and incomplete jobs stay local, outside the finished collection. Lookup errors are not empty results. New checkouts can require an **explicit inspected catalogue rebuild** because filesystem mtimes change; a dirty rebuilt index needs maintenance review before publication. There is no silent rebuild, retry, resume or push.

## Documentation

- [Setup, dependencies and checks](docs/setup.md)
- [Report format and dates](docs/report-format.md) · [Contribution and rights](docs/contributing.md)
- [Research limits and incomplete-work recovery](docs/research.md) · [Publication recovery](docs/publication.md#receipts-and-partial-operation-recovery)
- [Current candidate evidence versus prior live proof](docs/v0-signoff.md)
- [Approved product requirements](docs/PRD.md) · [Historical implementation plan](docs/IMPLEMENTATION_PLAN.md)

Pi is the only supported interactive client. Ordinary files/Git remain the storage boundary: no website, accounts, vector database, durable job service, provider fallback or Gemini runtime dependency. Local tools and extensions run with the user's permissions; this is not a sandbox or authentication against other local programs.

## Licenses

- Engine code and project documentation: [MIT](LICENSE).
- Reports the contributor has the right to license: [CC BY 4.0](LICENSE-REPORTS.md), preserving attribution and changes.
- Third-party sources/quotes retain their own rights. Import, relevance, HTTP access and publication approval are not factual, currentness or legal certification.
