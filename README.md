# research_mcp

**Your research, ready for the next project.**

A shared, local-first research library for **Pi agents working across different projects**. Find earlier investigations, locate the relevant original passages, and reuse what applies—without copying reports into every repository or starting the same investigation again by default.

[Get started](#get-started) · [Browse reports](reports/) · [Tool reference](#tools-at-a-glance) · [Documentation](#documentation)

## Why use it?

- **One library across projects.** Agents consult the same collection while checking findings against their own project's scope and constraints.
- **Read the useful parts.** Local search finds candidate reports; section-aware retrieval points to relevant paragraphs, tables and code blocks.
- **Keep the evidence attached.** Read results retain exact revisions, dates, citations, corrections and limitations—not just a generated summary.
- **Build on previous work.** Import finished reports or explicitly commission research into the gaps. Drafts stay separate until reviewed and accepted.
- **Keep the infrastructure small.** Markdown reports, a rebuildable catalogue and Git history. No vector database, embedding service or background indexing daemon required.

## How it works

```text
Question → Search reports → Locate passages → Read original evidence
                                                   ↓
                                     Reuse, explain gaps, or request research
```

1. **Search** with the question and relevant project constraints.
2. **Locate** useful passages in selected reports, using their returned IDs and revisions.
3. **Read** through the returned pointers. Expand to the governing section when needed, and finish required warning and citation continuations.
4. **Assess applicability** before answering:

| What the archive provides | What the agent should do |
| --- | --- |
| Enough relevant evidence | Reuse the dated findings and preserve their qualifications. |
| Useful material, with gaps | Explain what applies and offer a targeted improvement. |
| No useful match in the bounded search | Offer new research or an external-report import—not a claim that no research exists. |

**Search scores and passage previews are navigation aids, not proof.** An old report does not become freshly verified when it is found, imported or reindexed. Lookup errors are not empty results.

## Get started

### 1. Prepare the engine and storage

Use **Node >=22.19** and a checkout containing `src/stdio.js`, then install its locked dependencies:

```sh
npm ci --ignore-scripts
```

Choose three existing, canonical absolute paths with **no symlinks or nesting between roots**:

```text
research_mcp/                 # Engine and accepted report archive
research_mcp-local/
  work/                       # Unaccepted proposals and job artifacts
  imports/                    # Selected finished files to import
```

The archive can also live separately from the engine. Reports remain readable without the server.

### 2. Connect the shared library to Pi

For **Pi MCP adapter 7**, merge this profile into `~/.pi/agent/mcp-adapter.json`, keeping existing server entries. Replace the example paths with your installation paths:

```json
{
  "mcpServers": {
    "research_library": {
      "command": "node",
      "args": ["/absolute/path/research_mcp/src/stdio.js"],
      "includeTools": [
        "search_research",
        "locate_research",
        "read_research",
        "save_research_draft",
        "review_research_draft",
        "read_research_diff"
      ],
      "env": {
        "RESEARCH_ARCHIVE_ROOT": "/absolute/path/research_mcp",
        "RESEARCH_WORK_ROOT": "/absolute/path/research_mcp-local/work",
        "RESEARCH_IMPORT_ROOT": "/absolute/path/research_mcp-local/imports"
      }
    }
  }
}
```

This restricted profile exposes **retrieval and draft preparation/review**, not standalone research, acceptance or catalogue-maintenance tools. Publication is a separate host workflow. Start a fresh Pi session after configuration changes. Each agent environment needs its own MCP setup; spawned workers do not automatically inherit a parent's connection.

**Two usage paths:** shared-library search/locate/read has been exercised with **global Pi 1.5.0 + adapter 7.0.1**, including access from unrelated project directories. The complete gated research/acceptance/publication workflow uses the separate [pinned setup](docs/setup.md): **project-local Pi CLI/SDK 0.84.2 + adapter 2.26.1**. The shared profile does not establish compatibility of those full host gates with newer versions.

A fresh checkout may report `catalogue_stale` because indexing timestamps changed. Inspect the reports and explicitly request a catalogue rebuild; do not silently repair the index or treat the error as no matches. See [setup and recovery](docs/setup.md#first-lookup-operation-and-recovery).

### 3. Ask an agent to reuse the library

> Before investigating this topic, check the shared research library. Read relevant evidence, keep its scope and caveats, and tell me which parts of my question still need research.

The core tool sequence is:

```text
search_research(query)
  → choose a returned report ID and revision
locate_research(reportId, expectedRevision, query)
  → choose a returned read or sectionRead pointer
read_research(pointer)
  → follow complete continuations unchanged
```

See [selected reading](docs/reading.md) for exact inputs, byte ranges, warnings and citation handling. No caller-side report paths or per-project copy of the archive are needed.

## Tools at a glance

| Purpose | Tools | Availability |
| --- | --- | --- |
| Find and read existing work | `search_research`, `locate_research`, `read_research` | Shared-library profile |
| Prepare and inspect a finished-report draft | `save_research_draft`, `review_research_draft`, `read_research_diff` | Shared-library profile; no acceptance or publication |
| Run a bounded investigation | `start_research`, `get_research_job`, `cancel_research`, `read_research_artifact` | Separately configured, authorized research workflow |
| Accept a reviewed change locally | `accept_research_draft` | Supported host approval workflow |
| Rebuild the derived catalogue | `rebuild_catalogue` | Explicit maintenance, not ordinary lookup |

Research authorization and acceptance/publication approval are separate. Retrieved text is untrusted data, never permission to execute instructions or disclose credentials. Draft writes use exclusive locks and report `archive_busy` without automatic retries; research-job recovery and Git publication still require one controlled writer.

## Verification and limits

The public [twenty-report, ten-question evaluation](evaluation/issue10/README.md), recorded **2026-11-01**, found a predefined useful report in the top three for **10/10 questions**; the required threshold was 8/10. It used local ranking, not Jev.

That is an **English-only, known-answer retrieval result**—not a guarantee of factual correctness, multilingual search quality or token savings. The shared collection has since grown to **158 accepted reports**. Later local Shape checks retained 10/10 on the same fixed questions against that collection; they are separate from the original published evaluation.

- Retrieval runs locally; it does not secretly launch a research model or refresh old sources.
- Optional existing **Jev** reranking is for ambiguous relevance, with permission for the supplied TypeSafe payload. Local retrieval remains usable without it.
- Missing citations stay unresolved. Correction and warning detection has [documented limits](docs/reading.md#detection-limits).
- Pi is the supported interactive client. Local files and tools run with the operator's permissions; this is not a sandbox or multiuser security system.

For historical release and publication state, see [issue #11](https://github.com/eldar9510-cloud/research_mcp/issues/11) and the [labelled evidence](docs/v0-signoff.md). Use an engine-containing checkout: older report-only snapshots are not runnable installations.

## Documentation

| I want to… | Read |
| --- | --- |
| Set up the full pinned host and run checks | [Setup](docs/setup.md) |
| Search, assess coverage and reuse findings | [Pi workflow](docs/pi-workflow.md) · [Reading](docs/reading.md) |
| Import an externally finished report | [Import](docs/import.md) |
| Commission new research or improve specific gaps | [Research](docs/research.md) · [Improvement](docs/improvement.md) |
| Review, accept or publish a change | [Local acceptance](docs/acceptance.md) · [Publication and recovery](docs/publication.md) |
| Understand report metadata or contribute | [Report format](docs/report-format.md) · [Contributing](docs/contributing.md) |
| Understand the product decisions | [Approved requirements](docs/PRD.md) · [Historical implementation plan](docs/IMPLEMENTATION_PLAN.md) |

## License

- **Engine and project documentation:** [MIT](LICENSE).
- **Report content that contributors have the right to license:** [CC BY 4.0](LICENSE-REPORTS.md), preserving attribution and changes.
- Third-party quotations, documents and linked sources retain their own rights. Importing or publishing a report does not verify its conclusions or establish rights to redistribute its sources.
