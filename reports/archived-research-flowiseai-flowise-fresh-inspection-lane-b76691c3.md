---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-flowiseai-flowise-fresh-inspection-lane-b76691c3",
    "title": "Research: FlowiseAI/Flowise (fresh inspection lane)",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: FlowiseAI/Flowise (fresh inspection lane)?",
    "scope": "Original Pi/tooling integration investigation: Research: FlowiseAI/Flowise (fresh inspection lane). Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: FlowiseAI/Flowise (fresh inspection lane); compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
    "imported_at": "2026-11-04T21:30:34.311Z"
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
  "sourceDigest": "b76691c3970ce237608146189ed8436a000195e8bbee79ad4ae1b9e5eef2f803",
  "proposalRevision": "aa3528186edb7b7d12eaa691625aac3ea989817b52042d0862e1040a6cd87bfa"
}
---
# Research: FlowiseAI/Flowise (fresh inspection lane)

## Summary
Flowise is confirmed archived (Aug 2026); its execution engine is server-internal and its two published sub-packages are React-only UI. The importable `flowise-components` package is a 300-dependency LangChain bundle with no graph executor. Verdict: POOR FIT for a minimal Pi delegation component.

## Findings
1. **Archive status — confirmed (fact).** GitHub API: `"archived": true`, `pushed_at 2026-08-13T12:38:19Z`, `license: NOASSERTION` ([api](https://api.github.com/repos/FlowiseAI/Flowise)). README banner "Flowise has been archived" ([README](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/README.md)). Sunset page: code freeze 2026-07-29, announced archival 2026-08-10, EOL 2026-08-31 ([sunset](https://flowiseai.com/sunset)). Corrections: announced archival was Aug 10 (actual last push Aug 13); GitHub reports license "Other", not Apache-2.0, because [LICENSE.md](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/LICENSE.md) excludes `packages/server/src/enterprise/**` and explicit-copyright files (e.g. `IdentityManager.ts`) as commercial — server-side only; agentflow/observe are plain Apache-2.0.

2. **Smallest reusable piece — UI-only or heavyweight (fact).** `@flowiseai/agentflow` = "Embeddable React component for building and visualizing AI agent workflows", npm latest `0.0.0-dev.10`, peers React 18/reactflow/MUI/emotion ([pkg](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/agentflow/package.json), [npm](https://registry.npmjs.org/@flowiseai/agentflow/latest)); `@flowiseai/observe` (`0.0.0-dev.1`) is also a React view library. No runtime package: issue #6621 (open, 2026-07-14, 0 comments) states the sole path `executeAgentFlow` is server-internal, coupled to TypeORM `DataSource`, `CachePool`, `Telemetry`, `SSEStreamer`, tenancy ids and the `ChatFlow` DB record ([issue](https://api.github.com/repos/FlowiseAI/Flowise/issues/6621)). `flowise-components@3.1.4` is importable node code but 2,763 files / 14.6 MB unpacked with ~30 `@langchain/*` packages, playwright, puppeteer, typeorm, pg, mysql2, redis, `vm2`, MCP SDK 1.29.0 ([pkg](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/components/package.json), [npm](https://registry.npmjs.org/flowise-components/latest)). Importing nodes needs no dashboard/DB, but you must build traversal, interpolation, credentials and memory yourself.

3. **Minimal Pi adapter (inference: none exists).** Only supported path is a running server (`POST /api/v1/prediction/:id`) plus DB; `packages/server` needs express/typeorm/pg|sqlite3/redis|bullmq and pins `engines.node ^24` ([pkg](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/server/package.json)) while README says Node >= 20 — contradiction. Pi running as a Flowise child retaining auth/tools/skills: no evidence, unknown.

4. **Scheduling/autonomy (fact + unknown).** `start-worker` + BullMQ is a server job queue, not bounded per-child context; no iteration/context caps surfaced; cancellation only via API/SSE. Extra LLM/context overhead: unknown.

5. **Model auth.** `ChatOpenAI.ts` credential is `openAIApiKey` only, with optional `basepath` and `baseOptions` (defaultHeaders) → existing DeepSeek/ZAI API keys over an OpenAI-compatible base URL are plausible without new billing (inference; `@langchain/deepseek` is a dependency). No OAuth/ChatGPT-subscription path found, so **Codex subscription auth is unsupported/unknown** ([ChatOpenAI.ts](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/components/nodes/chatmodels/ChatOpenAI/ChatOpenAI.ts)).

6. **MCP/Jev.** `@modelcontextprotocol/sdk` 1.29.0 is a dependency, so Flowise can be an MCP peer, but that lives in server/components, not a small module. Jev stays parent-side.

7. **Telemetry/license/privacy (source-level).** `.env.example` exposes `DISABLE_FLOWISE_TELEMETRY`, `ENABLE_METRICS`, `POSTHOG_PUBLIC_API_KEY` ([env](https://raw.githubusercontent.com/FlowiseAI/Flowise/main/packages/server/.env.example)). Advisories published 2026-08-04 (post-freeze) hit `flowise`/`flowise-components` <= 3.1.2: CVE-2026-70477, CVE-2026-69264 (critical RCE) and GHSA-88pr-878c-24wf (high), patched in 3.1.3 ([advisories](https://api.github.com/advisories?ecosystem=npm&affects=flowise-components)); archived repo = no future fixes. `/latest` manifests for 3.1.4 show no `deprecated` field, contrary to the sunset page's claim (limited evidence).

## Verdict: POOR FIT
- **Pros:** permissive Apache-2.0 core (enterprise dir excepted); huge node/tool catalogue, MCP SDK, and a frozen repo that will not move under you.
- **Cons:** no headless executor or runtime publish (UI-only sub-packages); any small reuse means vendoring a 14 MB, 300-dep LangChain bundle with critical-CVE history; requires Node 24 plus a DB server.

**Biggest unresolved fact:** whether `executeAgentFlow` can be extracted headlessly — issue #6621 is open with zero comments and server executor source was not read here.

## Sources
Kept: GitHub repo/issue/advisory APIs; raw README, LICENSE.md, package.json files, `.env.example`, `ChatOpenAI.ts`; npm registry manifests; flowiseai.com/sunset. Dropped: Reddit/CVE-blog/GHSA-aggregator hits, npm search API (returned 0 objects — unreliable), search-synthesized npm package counts.
