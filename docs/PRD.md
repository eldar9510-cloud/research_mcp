# Product Requirements Document — Reusable Research Library

- **Version:** 0.1
- **Date:** 2026-10-30
- **Status:** Confirmed product scope; detailed specification for implementation planning
- **Initial owner and user:** Eldar
- **Initial client:** Pi only
- **Distribution:** Public GitHub repository containing the engine, necessary documentation/instructions, and approved finished research

> **Product promise:** Ask a question; find relevant research from earlier sessions without loading the entire archive; reuse what applies; explicitly request improvements when needed; otherwise commission new research or import an externally completed report; review and publish the useful result for next time.

This document captures the decisions confirmed during the design interview. It is not authorization to initialize a repository, import documents, run paid research, change global configuration, commit, or push. Those actions retain the approval boundaries specified below.

## Reading conventions

- **Required** identifies behavior necessary for v0 acceptance.
- **Proposed implementation** identifies a concrete, deliberately small way to meet a requirement. It is not a separately approved framework, dependency, service, or architecture expansion.
- **Deferred** means outside v0, not an implicit backlog commitment.
- **Unverified** identifies a factual capability that has not been demonstrated live.
- Requirement identifiers support testing and review; they are not a separate issue tracker.

## Contents

1. [Executive summary](#1-executive-summary)
2. [Problem, hypothesis, and intended outcome](#2-problem-hypothesis-and-intended-outcome)
3. [Users and product boundary](#3-users-and-product-boundary)
4. [Confirmed scope and explicit exclusions](#4-confirmed-scope-and-explicit-exclusions)
5. [Product vocabulary](#5-product-vocabulary)
6. [End-to-end behavior](#6-end-to-end-behavior)
7. [Research record contract](#7-research-record-contract)
8. [Catalogue and retrieval](#8-catalogue-and-retrieval)
9. [Reading reports and preserving evidence](#9-reading-reports-and-preserving-evidence)
10. [Standalone research engine](#10-standalone-research-engine)
11. [Research-job lifecycle and local artifacts](#11-research-job-lifecycle-and-local-artifacts)
12. [Approval, acceptance, Git, and publication](#12-approval-acceptance-git-and-publication)
13. [Proposed MCP interface](#13-proposed-mcp-interface)
14. [Storage, portability, and configuration](#14-storage-portability-and-configuration)
15. [Token economy and performance](#15-token-economy-and-performance)
16. [Trust, privacy, security, and licensing](#16-trust-privacy-security-and-licensing)
17. [Initial corpus and migration](#17-initial-corpus-and-migration)
18. [Evaluation and acceptance](#18-evaluation-and-acceptance)
19. [Implementation milestones](#19-implementation-milestones)
20. [Remaining implementation decisions and validation gates](#20-remaining-implementation-decisions-and-validation-gates)
21. [Main risks and responses](#21-main-risks-and-responses)
22. [Decision ledger](#22-decision-ledger)
23. [Definition of done](#23-definition-of-done)

---

## 1. Executive summary

The product is a single-user, public research library with a local MCP interface and a built-in, separately managed research engine.

The archive consists of readable Markdown reports, their Git history, and a compact catalogue describing what the reports cover. Pi checks this catalogue automatically before substantial investigations. Local retrieval supplies a small candidate set; the existing Jev integration may rerank those candidates when relevance is ambiguous. Pi reads selected reports or sections, not the whole collection.

There are three reuse outcomes:

1. **Covered:** existing work sufficiently answers the scoped question. Reuse it without automatically updating it or rechecking its sources.
2. **Partially covered:** existing work helps, but important gaps remain. Explain the useful parts and the gaps; offer an improvement rather than silently starting another investigation.
3. **No useful match found:** offer new research. Start only with approval, unless the user's original request already explicitly authorized new deep research.

New research can arrive through either of two paths:

- A standalone researcher controlled by the MCP engine, using **`openai-codex/gpt-6.1-sol` with reasoning effort `max`**.
- A finished research report supplied by the user from another platform.

The engine is not a wrapper around the existing Gemini deep-research integration. That integration is excluded from the design.

Research is a bounded investigation, not an endless autonomous process. Finished results become local proposals. The user reviews the report or diff; one publication approval authorizes accepting the reviewed changes, committing them, and pushing them. Available incomplete work stays local and is not part of the public collection.

The central economy is reuse: spend little context finding previous work, spend substantial reasoning only when it is explicitly warranted, and preserve useful results so they do not need to be recreated.

## 2. Problem, hypothesis, and intended outcome

### 2.1 Problem

Existing research is scattered across local project folders, reports exported from other tools, and ChatGPT history. Related questions recur, but the agent does not reliably know what has already been investigated. The result is repeated searching, source gathering, comparison, and report writing.

Merely finding an old file is insufficient. Reports may have different scopes, missing evidence, known errors, superseding documents, or dates that no longer support claims of currency.

### 2.2 Hypothesis

A small, well-described archive can reduce repeated investigation and source checking while keeping evidence, limitations, and corrections visible.

This is a hypothesis to test, not a promise that every reused answer is correct or every lookup saves tokens.

### 2.3 First concrete outcome

The first successful demonstration must cross session boundaries:

1. Research is saved in one Pi session.
2. A later session asks a related, differently worded question.
3. The agent discovers the useful report without the user locating and pasting it.
4. It distinguishes reusable findings from gaps and limitations.
5. If requested, it performs a targeted improvement.
6. The reviewed result and catalogue update are published and discoverable next time.

### 2.4 Priority order

1. Minimal maintenance and setup.
2. Less repeated research and source checking.
3. Cheap, bounded archive lookup and selective reading.
4. Reliable provenance, visible caveats, and deliberate publication.
5. High-effort new research when actually requested.

Maximum Sol reasoning is an explicit user choice. Token economy must not be achieved by silently switching models or reducing that reasoning setting.

## 3. Users and product boundary

### 3.1 Initial user

Eldar is the initial user, operator, and maintainer. Pi is the only supported interactive client for v0. Success does not require other people to contribute or a second harness to work.

### 3.2 Public audience

Other people may read the public reports, use the open-source code, or propose changes through GitHub. They are not separate authenticated application users in v0.

A small contribution document should describe the report format, source expectations, licensing, and normal pull-request review. There is no contribution portal, reputation system, voting, or automated acceptance.

### 3.3 Meaning of public

The public repository contains:

- Engine source and necessary build/runtime instructions.
- Pi workflow instructions.
- Report-format documentation and suitable examples.
- Approved finished reports and their generated catalogue.
- Tests and evaluation material that can be redistributed.

It does not automatically contain:

- Raw conversations or complete ChatGPT exports.
- Credentials, authentication state, environment secrets, or browser data.
- Temporary source downloads, research transcripts, or partial jobs.
- Third-party documents merely because they were used as sources.
- Unreviewed imports or proposed changes.

Keeping incomplete work local is a staging boundary, not a private/public permissions product. There is one public finished collection and no multiuser access-control system.

## 4. Confirmed scope and explicit exclusions

### 4.1 Required capabilities

| ID | Capability | Required v0 behavior |
|---|---|---|
| S-01 | Import | Accept selected finished Markdown or plain-text reports and supplied metadata; preserve their useful content and citations. |
| S-02 | Catalogue | Maintain a compact, rebuildable description of the archive. |
| S-03 | Search | Retrieve a bounded candidate set without sending the full archive to a model. |
| S-04 | Read | Read individual reports or bounded sections with revision identity, warnings, and citation context. |
| S-05 | Reuse assessment | Distinguish covered, partial, and no useful match; keep retrieval failure separate. |
| S-06 | Research | Run an explicitly authorized, bounded Sol/max investigation managed by the MCP engine. |
| S-07 | Improve | Support targeted improvements to existing reports when requested. |
| S-08 | Review and publish | Prepare a report or diff; require approval before accepting the publication changes, committing, and pushing. |
| S-09 | History | Use Git for report history and maintain links between related investigations. |
| S-10 | Portability of data | Reports remain readable without the application; the catalogue is reproducible from reports. |

### 4.2 Out of scope

- A website, desktop application, hosted service, accounts, or tenant isolation.
- A second harness integration or a general integration marketplace.
- Automatic ingestion of all conversations or all documents on disk.
- Platform-specific chat connectors and a bulk ChatGPT-history parser.
- A PDF/OCR conversion pipeline.
- A vector database, embedding service, or knowledge graph in the initial implementation.
- A canonical wiki that synthesizes every report into one evolving narrative.
- Background source refresh, scheduled fact checking, or archive-wide freshness scores.
- A durable job queue, unattended resumable workers, or automatic retries.
- A multi-agent research team, model router, automatic provider fallback, or generic provider-plugin framework.
- Rebuilding Pi authentication or Jev functionality.
- Research through the unavailable Gemini deep-research integration.

Semantic retrieval may be reconsidered only after concrete retrieval failures are measured. Doing so is a scope decision, not an automatic dependency addition.

## 5. Product vocabulary

| Term | Meaning |
|---|---|
| **Report** | A finished investigation answering a scoped question. The primary reusable archive unit. |
| **Report ID** | A stable reference to the investigation, independent of its mutable title. |
| **Revision** | A particular version of a report. Git stores history; a content digest identifies bytes returned by retrieval. |
| **Catalogue** | Compact descriptions and pointers to reports, including scope, dates, and correction/supersession warnings. It is not a cross-report synthesis or source of evidence. |
| **Candidate** | A report returned by retrieval that still requires applicability assessment. |
| **Covered** | Existing research sufficiently answers the current scoped question without an additional investigation. This does not mean freshly verified. |
| **Partial** | Existing research provides useful material, but material parts of the question remain unanswered. |
| **No useful match found** | The available catalogue search did not identify useful previous work. Not proof that no relevant research exists anywhere. |
| **Lookup failure** | Search cannot be trusted because the catalogue, service, or required data is unavailable, invalid, or known to be stale. |
| **Research job** | One bounded, engine-managed Sol investigation, either new research or an explicitly requested improvement. |
| **Proposal** | A local candidate report or revision awaiting review. Not yet published. |
| **Acceptance** | Applying the reviewed proposal to the finished-report collection. |
| **Publication** | Committing and pushing the approved report and catalogue changes to the configured GitHub repository. |
| **Incomplete work** | Available notes or output from a job that did not finish. It must not be represented as a finished report. |

Research relevance, evidence quality, factual correctness, and publication approval are different concepts. The system must not use one as a substitute for another.

## 6. End-to-end behavior

### 6.1 When the automatic check runs

**WF-01:** Pi should consult the archive before a substantial investigation, comparison, or research-driven recommendation.

It should not perform an archive search for every greeting, trivial factual question, routine code edit, or unrelated command. This trigger is a Pi workflow instruction, not a universal interception mechanism over every model message.

The check is automatic; new research and publication are not universally automatic.

### 6.2 Standard decision flow

```text
User asks a substantive question
        |
        v
Search compact catalogue locally
        |
        +-- lookup failure --> explain problem; STOP automatic research decision
        |
        v
Optional Jev reranking -> read selected sections, warnings, and citations
        |
        +-- covered --> reuse dated findings; no automatic improvement
        |
        +-- partial --> identify useful material and gaps; offer improvement
        |
        +-- no useful match --> offer new research OR an external report import

Proposed new research / improvement
        |
        +-- no explicit authorization yet --> ask before starting
        |
        v
Bounded Sol/max research job
        |
        +-- incomplete / failed / cancelled / interrupted
        |       --> retain available local artifacts; STOP publication path
        |
        +-- completed --> finished local proposal

Externally completed report --> import proposal (NO Sol investigation)

Finished research proposal OR finished-report import proposal
        |
        v
Review report/diff, exact files, and publication target
        |
        +-- not approved --> keep proposal local; STOP
        |
        v
Approval -> accept + catalogue update -> commit -> push
```

### 6.3 Covered case

**WF-02:** Return a useful answer from the applicable existing material, with a reference to the report, its revision, research date, and relevant caveats.

- Explain any material scope mismatch instead of hiding it.
- Do not fetch old sources merely to confirm that they are still accessible.
- Do not change dates to imply new verification.
- Do not rewrite, improve, or publish the report without a request.
- If the user asks for current verification, treat that as a separate authorized operation.

### 6.4 Partial case

**WF-03:** Explain which parts can be reused and what is missing. Offer a targeted improvement.

A report on a broad topic does not count as covering every narrower question about that topic. Conversely, an incomplete answer can still be useful enough to avoid restarting the entire investigation.

If the original request explicitly instructed the agent to fill gaps, that request can authorize the improvement. Otherwise, ask first.

### 6.5 No-useful-match case

**WF-04:** Do not claim that no research exists solely because a candidate search returned nothing.

The agent may make a small, bounded query reformulation to account for terminology or wording. It must not compensate by dumping every report into model context. After a reasonable lookup, report that no useful match was found and offer new research or import.

A new Sol job requires approval unless the initial request already clearly asked for a new deep investigation. A request to check the archive alone is not research authorization.

### 6.6 Import case

**WF-05:** A user-supplied finished report bypasses the research engine.

1. Inspect the selected file/text and metadata.
2. Detect an identical previous import where possible.
3. Identify missing dates, broken/local references, and obvious publication concerns.
4. Prepare an import proposal without silently rewriting the source report.
5. Show the proposed record and any warnings.
6. On publication approval, accept, catalogue, commit, and push it.

Importing a report is not verification of its conclusions. Do not run Sol merely because a report needs an archive summary; the importing Pi session can supply proposed metadata for review.

### 6.7 Revision versus new report

**WF-06:** Improve the same report when the scoped question remains the same. Use a new, linked report when the question or constraints materially change.

Examples:

- Correct a mistaken source interpretation: revise the existing report.
- Add a requested comparison missing from the same investigation: normally revise it.
- Change from digitally generated PDFs to scanned documents with OCR constraints: potentially a new linked report if the question materially changes.
- Retain an older investigation for context while replacing its recommendation: explicitly mark the relationship and warning.

No custom revision database is needed. Git history provides previous versions.

## 7. Research record contract

### 7.1 Primary unit

**DATA-01:** One report answers one scoped question. It may include alternatives, rejected approaches, limitations, and unresolved questions.

Do not turn every paragraph into a separate knowledge object. Do not require a wiki hierarchy or fixed taxonomy before a report can be saved.

### 7.2 Minimum metadata

| Field | Requirement | Semantics |
|---|---|---|
| `id` | Required | Stable identifier, unique within the collection. A stable slug is sufficient. |
| `title` | Required | Human-readable title. Renaming it must not break references. |
| `question` | Required | What was investigated; not merely a broad topic label. |
| `scope` | Required | Relevant constraints, assumptions, inclusions, and exclusions. Missing historical detail is stated explicitly. |
| `summary` | Required | Short description of findings and coverage for discovery; not a replacement for the report. |
| `researched_at` | Required field; nullable | Known date of the original investigation. Unknown remains `null`; targeted later improvements do not overwrite it. |
| `last_improved_at` | Nullable | Date of the latest substantive, requested improvement; not a report-wide verification date. |
| `created_at` | Required | Timestamp when the archive record was first created. |
| `updated_at` | Required | Timestamp of the latest accepted archive change, not proof of factual verification. |
| `imported_at` | Nullable | Date of initial import if the report originated elsewhere. |
| `language` | Required | Language of the report, supplied or proposed by the importing agent. |
| `origin` | Required object; values may be unknown | Imported versus engine-generated; author/platform/model when known. |
| `related_reports` | May be empty | Explicit links to reports reused, extended, corrected, or replaced. |
| `warnings` | May be empty | Important limitations, known errors, unavailable evidence, or correction notices. |
| `superseded_by` | Nullable | Replacement report ID when applicable. |

Optional keywords/aliases may assist search. They are not a required controlled vocabulary or an invitation to build a tagging subsystem.

### 7.3 Proposed file format

**Proposed implementation:** Markdown with a small YAML front matter block. Parse metadata using a safe parser, not arbitrary object construction or executable tags.

Illustrative format only:

```yaml
---
id: example-structured-document-extraction
title: Structured extraction from digital technical documents
question: Which extraction approach fits digital technical documents under the stated constraints?
scope: Digital PDFs with embedded text; scanned pages and OCR are outside this investigation.
summary: Compares extraction approaches and output validation; does not evaluate OCR.
researched_at: null
last_improved_at: null
created_at: "2026-10-30T12:00:00Z"
updated_at: "2026-10-30T12:00:00Z"
imported_at: "2026-10-30T12:00:00Z"
language: en
origin:
  kind: imported
  platform: unknown
  author: unknown
  model: unknown
related_reports: []
warnings:
  - Original source-check dates were not supplied.
superseded_by: null
---
```

The body follows the metadata. For newly generated research, the following outline is recommended:

1. Question and scope.
2. Executive findings.
3. Evidence and analysis.
4. Alternatives considered and rejection reasons.
5. Limitations, uncertainty, and unresolved questions.
6. Sources and citation references.
7. Relationship to earlier research and improvement notes, when applicable.

Imported reports do not have to be rewritten into that outline. Preserving useful original content is more important than uniform headings.

### 7.4 Dates and verification

**DATA-02:** Keep research, import, archive-update, source-access, and source-verification dates distinct.

- A filesystem modification timestamp is not a research date.
- Importing today does not mean researching today.
- Updating metadata does not mean checking sources today.
- A successful HTTP response does not prove that a source still supports a claim.
- A partial source check does not justify a report-wide “verified today” label.

Where source-level verification is recorded, describe which claim or issue was checked and when. Preserve unknown values explicitly.

For a same-report improvement:

- Preserve `researched_at` as the original investigation date, including `null` if it is unknown. Correct it only when evidence establishes that the recorded date was wrong or previously unknown.
- Set `last_improved_at` for substantive new research, not for formatting or catalogue-only changes.
- Update `updated_at` when the revision is accepted.
- Add a short dated improvement note identifying changed sections/findings, newly gathered or checked evidence, reused material that was not rechecked, and the known contributor/model for that improvement.
- Preserve the original `origin`; later Sol work must not erase the report's imported authorship/platform history.

The catalogue and read results distinguish original research from the latest substantive improvement. A recent addition to one section must not make all older evidence appear freshly investigated. Git provides the detailed edit history; no separate event database is needed.

### 7.5 Evidence and source references

**DATA-03:** Preserve citations through storage, search, reading, revision, and publication.

- New engine-generated reports should use stable source labels or Markdown references connected to concrete URLs/documents.
- Imported citation styles may remain unchanged if their meaning and links are preserved.
- A bibliography alone does not establish that every report claim is supported.
- Unresolved references must be identified as unresolved, not repaired by invention.
- Local paths must be reviewed before publication. Include an authorized related report, replace a path with a valid portable reference when known, or explicitly mark the unavailable dependency.
- Do not publish third-party source PDFs merely to make citations convenient.

**DATA-04:** Retain alternatives, rejection reasons, unresolved questions, and useful intermediate findings already present in an imported report.

### 7.6 Revision identity

**DATA-05:** Returned evidence must identify the report ID and exact report content revision.

**Proposed implementation:** Compute a content digest for the stored report bytes and return it with excerpts. Use Git commits for historical inspection. Do not embed a report's future Git commit hash into the same file that the commit will contain.

For uncommitted proposals, return the proposal ID, content digest, and base-report digest where relevant. Do not describe an uncommitted proposal as an archived Git revision.

### 7.7 Duplicate import handling

**DATA-06:** Detect identical report content before creating another record.

A minimal implementation can compare an import-content digest that excludes newly assigned archive timestamps. Any text normalization used for comparison must be documented and must not silently rewrite the preserved report body.

- Identical content: return the existing record/proposal and explain the duplicate.
- Similar title but different content: show possible related records; do not merge automatically.
- Different content for an existing ID: require an explicit revision operation.
- Conflicting IDs: reject or request a new ID; never overwrite unrelated work.

Semantic deduplication and automatic report merging are deferred.

## 8. Catalogue and retrieval

### 8.1 Catalogue purpose

**CAT-01:** The catalogue describes what exists. It is not a combined synthesis of all conclusions and must not become an independently edited source of truth.

Each entry contains at least:

- Report ID and path.
- Title and scoped question.
- Short summary and scope.
- Original research date, including unknown status, and latest substantive improvement date when present.
- Language and optional keywords.
- Correction/supersession warnings and relevant linked-report IDs.
- Revision identity sufficient to associate the entry with the report version.

Do not include full report bodies, full source downloads, or raw transcripts.

### 8.2 Generation and consistency

**CAT-02:** Accepted reports are authoritative; the catalogue is derived and rebuildable.

- Creating, revising, superseding, or removing a report updates the relevant catalogue representation.
- Ordinary saves must not call another model solely to regenerate every summary.
- A full rebuild is allowed as an explicit maintenance operation; it is not normal per-query behavior.
- Direct manual edits to reports require catalogue regeneration before they are treated as indexed.
- If known inconsistency or corruption is detected, report it instead of presenting a confident empty result.

**Proposed implementation:** One generated UTF-8 `INDEX.md` with a stable per-report block format, readable on GitHub and locally searchable. An in-memory representation may be derived from it. If a simple structured text format proves more robust, that serialization choice may change without changing the product behavior. Do not add a persistent database just to serialize these entries.

### 8.3 Local search

**RET-01:** Rank catalogue entries using text and metadata, with title/question/scope matches weighted sensibly. Return a bounded shortlist.

Search results expose enough information to decide what to read:

- Report identity and current revision.
- Title, question, compact summary, and scope.
- Research date.
- Relevant catalogue match or report-section pointer where available.
- Warnings and supersession links.
- A clear indication that ranking is relevance, not factual reliability.

**Proposed starting defaults:** five candidates, short summaries, bounded excerpts, and no automatic full-report expansion. Exact byte/character limits should be tested with the representative corpus and documented as part of the tool contract.

### 8.4 Jev's role

**RET-02:** Reuse the existing Jev integration only for bounded relevance judgments over supplied candidates when useful.

The normal sequence is:

1. Local catalogue search.
2. Optional Jev reranking of the shortlist if relevance is ambiguous.
3. Selected report reading.
4. Pi's applicability assessment.

Jev is not:

- An archive crawler or the source catalogue.
- A fact checker, compliance authority, or publication permission gate.
- Proof that omitted candidates are irrelevant.
- A substitute for reading important scope, warnings, and evidence.

**Proposed implementation:** Pi coordinates its existing Jev call over candidates returned by the archive MCP. Do not create a second Jev service or duplicate its authentication inside the engine unless an actual integration requirement establishes the need.

Only permitted candidate content may be sent to Jev/TypeSafe. Credentials, raw chat history, and local incomplete material are not automatically eligible merely because the final archive is public.

### 8.5 Fallback and false negatives

**RET-03:** If Jev is unavailable, retain local retrieval and disclose that reranking was not performed. Jev availability must not prevent ordinary archive use.

**RET-04:** Local search failure and empty local search results are different outcomes. No-match logic must not run on missing or invalid catalogue data.

Jev cannot rescue a report excluded from the initial shortlist. Evaluate candidate-generation recall separately from reranking quality. Query reformulation or better catalogue descriptions should be tried against real misses before adding embeddings.

### 8.6 Language and paraphrases

Differently worded questions are part of the first retrieval evaluation. Cross-language retrieval is not yet a separately guaranteed v0 capability.

If selected reports and expected queries make English/Italian cross-language discovery important, include explicit cases in the evaluation and report the measured result. Do not claim multilingual semantic retrieval merely because the model understands both languages.

## 9. Reading reports and preserving evidence

**READ-01:** The read interface supports complete access without requiring every call to return the complete report.

It must support a stable selection mechanism, such as headings or line ranges, and bounded pagination when a selection exceeds the response limit.

Every result includes:

- Report/proposal identity and content revision.
- Scope, relevant dates, and important warnings.
- The selected content and its location.
- Citation references needed to interpret that content.
- Explicit truncation/continuation information when applicable.

**READ-02:** A warning at the top of a report must not disappear when reading a lower section. A superseded or corrected report must not be returned as an apparently current, unqualified result.

Owner-approved bounded-reading clarification: long correction/warning text may use explicit numbered chunks tied to the exact same report revision. Every page must prominently signal corrections/supersession, the successor when known, and the required correction/warning context still to read. Evidence must not be presented as fully qualified while required warning context is outstanding. This is not permission to invent summaries, omit original context, or claim that a human read a page.

**READ-03:** If the report changed between search and read, disclose the revision change. Bind pagination/continuation to one content revision; if that revision is no longer available, return a revision conflict instead of silently concatenating pages from different versions. If the report changed between preparing and accepting a revision, reject the stale-base update until it has been reviewed again.

Important warnings must be shown on every page, even when their original location lies elsewhere in the report. Under the READ-02 clarification, bounded pages may carry the prominent warning signal and explicit required same-revision warning-context continuations rather than repeating oversized text verbatim. The full body and all exact warning-context bytes must remain reachable through finite explicit continuations; nothing may be silently omitted or summarized away. A citation definition outside the selected page must be included or explicitly resolvable through a revision-bound reference, including citations in warning-context chunks. Prioritize essential warnings over optional excerpt length. Never silently drop a correction notice merely to fit a response budget.

**READ-04:** Catalogue summaries are discovery aids. When a consequential answer relies on report evidence, read the relevant report content rather than citing only its catalogue summary.

## 10. Standalone research engine

### 10.1 Ownership and runtime boundary

**ENG-01:** The MCP engine owns the research job. This is not just an instruction asking the surrounding Pi conversation to perform all research itself.

Pi submits an authorized request. The engine creates and manages a separate research session, supplies bounded tools and context, gathers progress/results, and produces a proposal or an explicitly incomplete outcome.

**Proposed implementation:** A small Node/TypeScript MCP server embeds the existing Pi SDK for the researcher session. This reuses model/runtime and authentication facilities rather than implementing a second model client and credential manager.

A separately managed SDK session is not inherently a process or security sandbox. Do not claim isolation that has not been implemented and tested.

### 10.2 Model requirement

**ENG-02:** Use `openai-codex/gpt-6.1-sol` with `thinkingLevel: "max"` (owner-approved model-pin update).

- Do not silently substitute Terra, Luna, Gemini, or another model.
- Do not silently lower effort to reduce cost or work around incompatibility.
- If this model/effort combination cannot be used, fail clearly and request a decision.
- Record the actual model and requested/effective effort where the runtime exposes them.
- Model choice is not a guarantee of research correctness.

### 10.3 Current capability evidence

Local inspection established the following:

- Earlier local inspection found `openai-codex/gpt-6-sol` with `max` mapped to `max`; this historical observation does not establish availability of the now-required `gpt-6.1-sol`.
- The installed Pi SDK documents controlled sessions, explicit model/thinking selection, configured authentication reuse, and custom-tool wiring.
- Web search and page fetching are not Pi SDK built-in tools and must be supplied explicitly.
- The existing Jev helper performs bounded local lexical retrieval and optionally prepares ordinary Jev reranking calls over supplied excerpts.

**Unverified:** live Sol authentication, account entitlement/quota, provider acceptance of the configured effort, and end-to-end research-tool execution. A local catalogue entry is not a successful live model test.

### 10.4 Research input contract

An authorized job includes:

- A clearly stated question.
- Scope/constraints and any requested output emphasis.
- Mode: new research or improvement.
- Existing report IDs/revisions and selected reusable material, where applicable.
- Requested gaps or changes for improvement mode.
- Whether rechecking existing sources was explicitly requested.
- Finite run limits from configuration and any authorized per-job override.

Do not send the full Pi conversation or entire archive as default job context.

If a missing constraint materially prevents a useful investigation, return a clarification need rather than inventing the constraint and spending a full research run.

### 10.5 Research method

**ENG-03:** Perform one planned, bounded investigation:

1. Restate the question and constraints.
2. Identify the important subquestions and evidence needed.
3. Search for relevant sources, favoring primary sources when appropriate.
4. Fetch and inspect source content needed for material claims.
5. Compare evidence, alternatives, disagreements, and applicability.
6. Distinguish observed evidence from inference and unresolved uncertainty.
7. Produce a sourced report with limitations and remaining gaps.

“One investigation” can involve several model turns and tool calls. It does not mean one search query or a single ungrounded model response. It also does not authorize repeated autonomous investigations until the model declares itself satisfied.

There is no arbitrary minimum source count. Enough relevant evidence is the goal; twenty weak sources are not inherently better than three authoritative ones.

### 10.6 Evidence rules for new research

**ENG-04:** Do not fabricate URLs, quotations, source-check dates, or source contents.

- A search snippet is not equivalent to reading the underlying page.
- Mark unavailable, paywalled, blocked, or only indirectly observed evidence honestly.
- Claims that cannot be adequately supported must be qualified, omitted, or listed as unresolved.
- Conflicting sources should be represented rather than resolved by model confidence alone.
- For engineering, legal, medical, or other consequential topics, avoid presenting a research report as professional certification or proof of compliance.

These rules govern new evidence gathering. They do not introduce automatic archive-wide verification.

### 10.7 Improvement behavior

**ENG-05:** Improvement jobs operate on the requested gaps and the existing scoped investigation.

- Reuse applicable prior reasoning, sources, and comparison criteria.
- Do not repeat the full investigation solely because the engine can.
- Do not recheck all old sources unless requested.
- New claims or changes still need appropriate supporting evidence.
- If a requested improvement depends on the current truth of an unchecked old claim, expose that dependency and ask for verification or state the limitation; do not silently treat it as freshly established.
- Produce a diff and explain what changed, what was reused, and what remains unchecked.

### 10.8 Tools and authority

**ENG-06:** Give the research session only the tools needed for research.

The expected capabilities are bounded web search, bounded source fetching, and access to explicitly selected reference material. The researcher does not need unrestricted shell access, repository-wide file access, Git publication tools, credentials-as-text, or the ability to spawn more researchers.

Search/fetch adapters must be explicit. Reusing existing supported integrations is preferable to implementing a provider framework. Selecting a new paid service or requiring new credentials requires user approval.

Fetched pages and imported reports are evidence, not executable instructions. An embedded instruction to change tools, reveal secrets, or publish content must not gain authority.

### 10.9 Run limits and cancellation

**ENG-07:** Every run has finite, enforceable limits. Maximum reasoning effort does not mean unlimited execution.

At minimum, configure a wall-clock limit and a research-tool-call limit. Bound individual tool outputs and requests as well. Numerical defaults must be selected and documented during the live integration test; they are not assumed to represent a known dollar budget.

- The engine checks limits independently of model compliance.
- Reaching a limit stops the run and records an incomplete outcome.
- Do not make an extra unbudgeted model call just to polish a timed-out result.
- Surface model-reported usage when available; do not invent unavailable cost estimates.
- Cancellation is explicit and should prevent new model/tool work as promptly as the underlying interfaces permit.
- Already incurred usage cannot be undone, and an in-flight provider request may not stop instantaneously.

Automatic retries at the application and SDK layers, including behavior inherited from global settings, must be disabled. Do not reissue a failed model request or relaunch a failed investigation without authorization. An external service's internal behavior may remain outside application control and should not be misrepresented.

## 11. Research-job lifecycle and local artifacts

### 11.1 Minimal lifecycle

**JOB-01:** Support these user-visible outcomes without introducing a durable scheduler:

| State | Meaning |
|---|---|
| `running` | The engine is actively investigating. |
| `completed` | A finished proposal is available for review; not published. |
| `incomplete` | A bound or evidence limitation prevented a finished result; available work is retained locally. |
| `failed` | A runtime/provider/tool failure ended the job; partial material may exist. |
| `cancelled` | The user stopped the job. |
| `interrupted` | A previous running job no longer has an active runtime after shutdown or restart. |

A lack of active runtime after restart is not evidence that a job completed.

A job becomes `completed` only when it has produced a coherent report for the agreed scope, required metadata, attributable evidence or explicit evidence limitations, and a reviewable proposal. A normal process exit or a model saying “done” is insufficient by itself. A finished report may honestly contain unresolved questions; it must not hide a failed core investigation or a forced stop. Limit-reached and interrupted outputs remain incomplete unless a later explicitly reviewed operation establishes a genuinely finished, possibly narrower report.

### 11.2 Execution model

**Proposed implementation:** One active research job at a time, held in process memory, with small local artifact files. Reject a second launch as busy rather than building a queue.

A start call should return a job ID promptly; callers should not need one MCP request to stay open for the entire deep investigation. Status responses are compact and should not stream or repeat the full transcript on every check.

No separate daemon, database, worker fleet, or resumable scheduling service is required.

### 11.3 Partial-work preservation

**JOB-02:** Persist useful available artifacts as they become available, outside the tracked finished-report collection.

Possible artifacts include the job request, state, collected source references, completed notes, available draft output, and failure reason. This is a small local record, not a second authoritative research archive.

- An abrupt process or machine failure can lose unflushed output; do not promise perfect recovery.
- Do not expose hidden chain-of-thought as a product artifact.
- Keep credentials and unnecessary private content out of artifacts.
- Reuse existing local artifacts only when the user explicitly requests continuation or a fresh run informed by them.
- That continuation starts a new authorized job; it is not transparent automatic resumption of an old agent state.

### 11.4 Shutdown and restart

**JOB-03:** Request cancellation during controlled shutdown and preserve available work. On the next startup, identify abandoned running records as interrupted.

Do not silently restart, retry, publish, or declare those jobs finished.

## 12. Approval, acceptance, Git, and publication

### 12.1 Separate permissions

**PUB-01:** Distinguish:

1. Permission to search/read the archive.
2. Permission to run new research or improvement.
3. Permission to publish a specific reviewed change.

One does not automatically grant the others. The original user request can explicitly include research authorization, but research authorization is not publication authorization.

**PUB-06 — Host-side approval gate:** The supported Pi workflow owns the decision to dispatch sensitive operations.

- Before calling `start_research`, identify the user's explicit authorization for that scoped operation. If the current request does not contain it, display the proposed question/mode and configured run limits, ask, and wait for a user reply before dispatch.
- Before calling `accept_research_draft` or executing publication Git commands, show the reviewed proposal/diff, proposal content digest, base revision where relevant, exact file set, and repository/branch target. Wait for approval of that change.
- Bind that approval to the reviewed content and target for the operation. A material change or stale base invalidates it. Do not reuse an approval as blanket permission for later reports.
- Preserve enough operation state to distinguish “not approved,” “approved,” and “partially executed”; an ordinary session-local record is sufficient. No approval server, account system, or long-lived permissions database is required.

The implementation must demonstrate these gates in the supported Pi workflow, including negative tests with instrumented tool/Git calls. A raw local MCP client is trusted local software: this PRD does not claim that conversational approval is authentication against arbitrary clients or operating-system processes. The research session itself must not be given acceptance/publication capabilities.

### 12.2 Review material

Before publication, show:

- New report or revision diff.
- Scope and summary changes.
- Source/citation changes and unresolved references.
- Changed dates and what those dates mean.
- Related-report/supersession changes.
- Catalogue changes.
- Known publication concerns or unresolved limitations.
- The exact files intended for the commit.

The review should not require reading the complete internal research transcript.

### 12.3 Single publication approval

**PUB-02:** One explicit approval of that review may authorize accepting the reviewed changes, committing them, and pushing them to the configured repository/branch.

- Do not repeatedly request permission for every mechanical step within that approved change.
- If the content or file set materially changes after approval, show the new diff and obtain approval again.
- Saving a proposal locally never automatically publishes it.
- Do not invent approval by passing `approved: true` from a model-generated tool argument. Approval is a human workflow boundary; a boolean is not authentication.

### 12.4 Application and Git behavior

**PUB-03:** Before applying a revision, compare its base revision to the current report. Reject stale proposals rather than overwriting newer work.

**PUB-04:** Publish only explicitly reviewed files. Never use a broad staging operation that includes unrelated changes, local run artifacts, or credentials.

- Inspect the worktree, existing staged changes, and commits that the proposed push would publish before requesting final approval.
- Use the existing branch/repository conventions once a destination is selected.
- Do not initialize a repository or create a GitHub remote without separate authorization.
- Do not overwrite unrelated uncommitted work or include unrelated staged content. If the approved change cannot be isolated safely, stop and ask rather than discarding or rearranging the user's work.
- A Git push can publish earlier unpushed commits as well as the new report commit. If those outgoing commits are outside the reviewed approval, stop and seek explicit authorization or an approved publication arrangement.
- No force push, history rewrite, or destructive cleanup is part of normal publication.
- Include report and catalogue changes together in the same commit.

**Proposed implementation:** MCP handles draft preparation and report acceptance; the surrounding Pi workflow executes ordinary Git commands after approval. This keeps Git credentials and publication authority out of the research model's tools.

### 12.5 Partial publication failures

**PUB-05:** Report the actual state, not a generic success message.

Examples:

- Validation failed: nothing accepted or published.
- Report accepted locally but commit failed: explain the remaining local changes.
- Commit succeeded but push failed: provide the commit identifier and state that remote publication did not complete.
- Push rejected: preserve local work; do not automatically rewrite or force-push.

A user-authorized later retry should reuse the existing commit when appropriate rather than creating a duplicate report or pretending the earlier push succeeded.

## 13. Proposed MCP interface

The following names and schemas are implementation proposals. The required behaviors and approval boundaries are normative; exact names may change during implementation for clarity.

| Tool | Purpose | Minimum input | Minimum output |
|---|---|---|---|
| `search_research` | Search the compact catalogue. | Query; bounded result limit; optional simple filters. | Candidates with scope, dates, warnings, revision IDs, match information, and coverage/error state. |
| `read_research` | Read an archived report or local proposal. | Explicit report/proposal reference; optional section/range and expected revision. | Bounded content, metadata, warnings, citations, revision, continuation information. |
| `save_research_draft` | Prepare an imported/new report or revision for review. | Metadata, body, operation kind, optional target/base revision. | Proposal ID, validation warnings, duplicate result, review/diff references. |
| `start_research` | Start an authorized new/improvement investigation. | Question, scope, mode, selected references, requested gaps/verification, run limits. | Job ID, resolved model/effort, initial state, configured limits. |
| `get_research_job` | Inspect a job without loading its full transcript. | Job ID. | State, compact progress, usage if available, error/incomplete reason, output references. |
| `cancel_research` | Stop an active job. | Job ID. | Cancellation state and available-artifact references. |
| `accept_research_draft` | Apply a reviewed proposal and update the catalogue. | Proposal ID, expected proposal/base revision. | Exact changed files, accepted report revision, catalogue result. No automatic Git push. |

The extra lifecycle tools are a consequence of choosing a standalone researcher rather than a retrieval-only server. They do not imply a workflow framework.

### 13.1 Shared contracts

**MCP-01:** Use structured outputs with a short human-readable explanation. Error results must be distinguishable from successful empty results.

**MCP-02:** Reject invalid IDs, path traversal, invalid metadata, unsupported operations, and requests outside the configured archive/work area.

**MCP-03:** Return bounded content with explicit continuation/truncation indicators. Silent truncation is not acceptable.

**MCP-04:** Errors and status responses must not echo credentials, full environment variables, or entire private configuration files.

**MCP-05:** The research session cannot use `accept_research_draft`, Git commands, or its own `start_research` interface to promote or recursively spawn work. These are orchestration/host capabilities, not research tools.

### 13.2 Representative error codes

A small consistent vocabulary is sufficient:

- `invalid_input`
- `not_found`
- `catalogue_unavailable`
- `catalogue_invalid`
- `catalogue_stale`
- `duplicate_content`
- `revision_conflict`
- `research_busy`
- `model_unavailable`
- `authentication_required`
- `tool_unavailable`
- `limit_reached`
- `cancelled`
- `publication_failed`

Do not create a complex error taxonomy before actual integration needs it. Preserve useful underlying error details without leaking secrets.

## 14. Storage, portability, and configuration

### 14.1 Proposed repository layout

```text
repository/
  README.md
  LICENSE                         # MIT engine license
  LICENSE-REPORTS                  # CC BY 4.0 report policy
  src/                            # MCP, archive operations, researcher runtime
  tests/
  docs/
    PRD.md
    report-format.md
    pi-workflow.md
    contributing.md
  reports/                        # accepted finished Markdown reports
  INDEX.md                        # generated compact catalogue
  evaluation/                     # redistributable corpus/query definitions
  .gitignore
  .research-local/                # ignored: proposals, job artifacts, temporary data
```

This is a proposal for a future repository, not a directory tree created by this PRD task. Existing project conventions take precedence when an actual repository is selected.

### 14.2 Storage requirements

**STORE-01:** The archive location must be configurable; do not hard-code the author's home directory or `disk_2` paths into the engine.

**STORE-02:** Reports are ordinary files and remain readable without the server. The catalogue can be deleted and rebuilt from valid reports.

**STORE-03:** Write accepted records and generated files defensively so an interrupted write does not silently produce a valid-looking half report. Validate report/catalogue consistency before the publication commit.

**STORE-04:** Do not mutate the user's original source files during import. The source location is input, not the managed archive.

**STORE-05:** The service should not require a background indexing daemon or a persistent database for v0.

### 14.3 Configuration surface

Keep the configuration small:

- Archive and local-work directories.
- Fixed research model/effort selection required by this PRD.
- Research run/tool bounds.
- Search/fetch integration settings or references to supported existing configuration.
- Retrieval/read response limits.
- Repository/branch publication target used by the host workflow.

Reuse supported authentication stores. Do not copy secrets into project configuration, examples, reports, or the public repository.

## 15. Token economy and performance

**PERF-01:** A normal lookup must not send every report or the entire catalogue to Sol or Jev.

The intended context flow is:

- Local process: search the catalogue.
- Pi: receive a few candidate descriptions.
- Jev, when useful: receive only those permitted candidates.
- Pi: read selected sections.
- Sol research job: receive the scoped task, selected prior material, and bounded source content only.

**PERF-02:** Reading, importing, accepting, or rebuilding the catalogue must not require a hidden Sol research run.

**PERF-03:** Repeated job-status checks return compact state rather than resending all accumulated evidence or model output.

**PERF-04:** Use finite per-call output limits and expose omitted content. Page long reports and long source material instead of silently discarding evidence or flooding the context.

**PERF-05:** Measure actual retrieval response sizes, model usage when available, and repeated-work reduction. Do not advertise token or cost savings based solely on the architecture.

No hard latency or dollar-cost promise is made before live measurements. Catalogue lookup should be fast locally; Sol/max investigations may be slow. Keep those expectations separate.

## 16. Trust, privacy, security, and licensing

### 16.1 Untrusted content

**TRUST-01:** Reports, imported text, fetched pages, and catalogue descriptions are untrusted reference material. Embedded instructions must not override the system, tool permissions, or user decisions.

Test this explicitly with a report/page containing an instruction to reveal credentials or publish unrelated material.

### 16.2 Narrow access

**TRUST-02:** Restrict archive operations to configured paths and reject traversal/symlink escapes as appropriate. Select tools deliberately for research sessions; do not load arbitrary global extensions or all coding tools by default.

The application still runs with the user's operating-system permissions unless a real sandbox is added. Tool restrictions are not a claim of complete isolation.

### 16.3 Public-content review

**TRUST-03:** Before publication, review for credentials, personal data, unauthorized third-party content, and local-only dependencies. Simple automated checks may assist, but must not be described as a guarantee of safe publication.

Research output approval is not a certification of factual correctness or legal rights.

### 16.4 Credentials and authentication

**TRUST-04:** Reuse configured credentials through supported APIs. Do not read them into prompts, print them in diagnostics, store them in job artifacts, or commit them.

New credentials, providers, or paid services require explicit setup authorization. The engine must fail clearly when authentication is unavailable.

### 16.5 Licenses and attribution

- Engine code: **MIT**.
- Reports the contributor has the right to license: **CC BY 4.0**.
- Sources: retain their original rights and terms; linking/citing does not relicense them.

Record known authorship, imported origin, and reused research links. Do not invent authorship or treat “public on the web” as permission to redistribute a source document in full.

GitHub contributions remain subject to maintainer review and licensing confirmation.

## 17. Initial corpus and migration

### 17.1 Initial batch

**IMPORT-01:** Start with approximately twenty selected finished reports, not an exhaustive migration.

Inputs include existing local Markdown/plain-text reports and manually exported selected research from ChatGPT or other platforms. Bulk history ingestion and PDF conversion are outside v0.

### 17.2 Observed source characteristics

A bounded, read-only sample of existing material found:

- Multiple topic-focused Markdown research collections on `disk_2`.
- Reports with useful questions, scope, dates, comparisons, and alternatives.
- Reports with portable URLs alongside reports depending on local files or session transcripts.
- At least one report explicitly warning of errors and pointing to a reconciled successor.
- Source PDFs stored separately from authored research.

These findings justify import warnings, related-report references, visible correction notices, and citation-preserving retrieval. They do not validate the reports' technical claims.

Likely source areas included `Machine_concept/GEMINI_RESEARCH/reports/`, `Machine_concept/PLC/research/`, and other research folders. A folder or filename mentioning Gemini does not imply a runtime dependency on Gemini; an existing finished report may be imported like any other external report if approved.

No complete ChatGPT export was identified in the limited filename survey. That is not a claim that none exists elsewhere or in the user's account.

### 17.3 Selection criteria

Choose a representative seed set containing:

- More than one topic and report length.
- Known useful follow-up questions.
- Differently worded but relevant queries.
- At least one partial-reuse example.
- At least one correction/supersession relationship.
- Missing research dates or incomplete source references, to test honest handling.
- Reports suitable for public redistribution.

The owner approves the selected publication set. Do not interpret permission to inspect a disk as permission to upload its contents.

## 18. Evaluation and acceptance

### 18.1 Retrieval test

**EVAL-01:** Use twenty selected reports and ten questions with known useful prior material.

Before evaluating, record the acceptable relevant report IDs for each question and freeze the query set. Include differently worded questions, not only copied titles.

**Release threshold:** A useful report appears in the top three results for at least eight of ten questions.

- Evaluate the actual user-visible ranking, including Jev only when the workflow would use it.
- Also record local candidate generation separately so reranking cannot hide recall failures.
- Preserve warnings on superseded/error-bearing results.
- Do not redefine relevance after seeing results merely to pass.
- Record language coverage; do not infer untested bilingual performance.

If the threshold is missed, diagnose the misses. Improve metadata, lexical retrieval, or query handling first where appropriate. Add semantic retrieval only through an explicit, evidence-backed scope decision.

### 18.2 Workflow demonstrations

**EVAL-02:** Demonstrate all three paths:

1. Reuse a covered answer without a new research run or source refresh.
2. Detect partial coverage and perform a requested targeted improvement.
3. Find no useful match and perform an explicitly authorized Sol/max investigation.

Also demonstrate external report import as an alternative to the engine path.

For the authorized new-research demonstration, inspect the actual report and recorded tool evidence for scope handling, primary-source preference where appropriate, comparisons/alternatives, citations, limitations, and remaining gaps. Confirm that one bounded investigation was performed and that no additional job or source-refresh pass started automatically. Gathering some URLs and selecting the right model alone do not satisfy the research acceptance test.

### 18.3 Acceptance matrix

| Test | Expected result |
|---|---|
| Import a Markdown report | Body and source links survive; archive metadata does not silently rewrite the report. |
| Import plain text | Content remains intact; unknown metadata stays unknown. |
| Unknown research date | Import date is present where applicable; research date remains unknown. |
| Partial improvement dates | Original research/origin remain intact; latest improvement and changed evidence are dated without implying old sources were rechecked. |
| Identical import twice | Existing content is identified; no accidental second report is created. |
| Same title, different scope | Reports are not automatically merged or treated as interchangeable. |
| Catalogue rebuild | Rebuilding valid reports reproduces their searchable descriptions without model calls. |
| Search response bound | Only the configured small candidate set and bounded excerpts are returned. |
| Covered query | Reuse occurs without automatically launching research or checking old sources. |
| Partial query | Useful material and missing work are both visible; improvement waits for authorization. |
| No useful match | New research is offered; absence is not overstated as proof of nonexistence. |
| Broken/missing catalogue | Explicit error; not a successful empty result or automatic research trigger. |
| Jev unavailable | Local retrieval still works and identifies the fallback. |
| Corrected/superseded source | Warning and successor reference remain visible in search and partial reads. |
| Selected section with citations | Returned content retains report revision and citation context, including explicit warnings for unresolved imported references. |
| Citation/warning outside page | Important warning text remains visible on every page; citation targets are included or explicitly resolvable at the same revision. |
| Report changes between pages | Continuation rejects a stale revision rather than mixing versions. |
| Long report | Pagination/continuation is explicit; no silent truncation. |
| Research not authorized | The Pi gate asks and waits; instrumented traces show no research job/model call before approval. |
| Research explicitly authorized in original request | The scoped job can start without a redundant confirmation; publication still waits for approval. |
| Fresh Sol job | Correct model and `max` effort are selected and observable; inspected source content supports the report's evidence, comparisons, and stated limitations. |
| Sol unavailable or unsupported effort | Clear failure; no silent model/effort fallback. |
| External report supplied | No Sol investigation is launched merely to import it. |
| Requested improvement | Targeted changes, base revision, reused material, new evidence, and remaining limitations are visible. |
| Source recheck not requested | No blanket refresh or invented verification date. |
| Source recheck requested | Record what was actually checked; access alone is not treated as verification. |
| Run limit reached | Incomplete result with available local artifacts; no automatic extra run. |
| Cancel job | New work stops as promptly as supported; outcome is labelled cancelled. |
| Shutdown/restart during job | No automatic resumption; surviving record is marked interrupted. |
| Publication not approved | Proposal remains local; the Pi gate dispatches no acceptance, commit, or push operation. |
| Proposal/target changes after approval | Prior approval is invalidated and the changed operation waits for fresh review. |
| Approved publication | Only the reviewed report/catalogue changes and approved outgoing commits are published to the reviewed target. |
| Unrelated dirty/staged files or outgoing commits | They are not included, overwritten, or pushed without separate approval; ambiguous publication state stops the operation. |
| Stale revision proposal | Conflict is reported before replacement. |
| Commit succeeds, push fails | Report local commit state and remote failure accurately. |
| Prompt injection in report/page | It does not authorize tools, secrets disclosure, or publication. |
| Path escape attempt | Request is rejected without reading/writing outside permitted archive operations. |
| Fresh session lookup | Earlier accepted research is discoverable without manual path finding/pasting. |
| Engine stopped | Reports remain human-readable and exportable. |

### 18.4 Evidence of value

For several real tasks, record:

- What prior research was found and reused.
- Which work was avoided.
- What gaps required new investigation.
- Whether old assumptions or errors caused problems.
- Lookup/read response sizes and available usage data.
- Approximate elapsed effort with enough context to avoid misleading comparisons.

These observations support product learning. They are not an industry benchmark or a guaranteed percentage saving.

## 19. Implementation milestones

These milestones are sequencing guidance, not permission to implement or publish.

### M0 — Repository and runtime proof

- Select the repository location, name, and publication target with the user.
- Read applicable project instructions.
- Set small finite run/output limits before any live test; tune and document deployment defaults afterward.
- Verify live Sol/max operation in an explicitly authorized minimal test.
- Choose and verify one concrete search/fetch integration.
- Confirm authentication handling, tool restrictions, cancellation, and disabled automatic retries.
- Verify the Pi-side approval gates before enabling research-start or acceptance/publication operations.

**Exit:** Runtime feasibility demonstrated or a specific blocker reported. No silent substitute model, provider, or relaxed requirement.

### M1 — File archive and catalogue

- Implement the report contract, validation, local proposal storage, exact duplicate detection, catalogue generation, and revision-aware read/search.
- Test with synthetic redistributable fixtures first.
- Keep sources readable and catalogue reconstruction deterministic.

**Exit:** Import/search/read/catalogue tests pass without a live research engine.

### M2 — Pi reuse workflow and Jev

- Add concise Pi instructions for automatic catalogue checks and covered/partial/no-match handling.
- Wire optional existing Jev reranking without making it a required service.
- Verify evidence/warning preservation and token-bounded output.

**Exit:** Cross-session retrieval and partial reuse work on a small approved corpus.

### M3 — Standalone research and improvement

- Add bounded Sol jobs, explicit research tools, compact job status, cancellation, local partial artifacts, and targeted improvement.
- Enforce explicit model/effort and no retry/resume behavior.

**Exit:** Authorized new research and improvement produce reviewable proposals; failure paths remain honest.

### M4 — Approval-controlled publication and evaluation

- Integrate acceptance with ordinary reviewed Git operations.
- Import the approximately twenty selected reports after approval.
- Run the fixed retrieval evaluation and end-to-end acceptance scenarios.
- Document installation, report format, operational limits, and contribution rules.

**Exit:** Acceptance evidence is recorded; remaining failures are not hidden behind a claim of completion.

## 20. Remaining implementation decisions and validation gates

The product behavior is settled. The following technical or deployment details are not silently assumed:

| Item | Current position | Required next action |
|---|---|---|
| Repository name/location/remote | Not selected by this PRD. | Obtain destination/creation authorization before setup. |
| Live Sol/max availability | Locally catalogued and SDK-supported; not live-tested. | Authorized minimal integration test; fail explicitly if unavailable. |
| Search/fetch adapter | Required; not provided by SDK built-ins. | Choose the smallest supported concrete integration; approve any new credentials/cost. |
| Run limits | Must be finite; numeric defaults unmeasured. | Set documented initial bounds from the integration test and permit explicit overrides. |
| Catalogue serialization | Proposed single generated `INDEX.md`. | Validate stable parsing, bounded search, rebuild, and warning preservation. |
| MCP tool names | Proposed in this document. | Confirm SDK/MCP contract details during implementation without changing behavior. |
| Initial twenty reports | Source areas identified; selection not approved. | Select representative publishable files and review rights/references. |
| Cross-language expectations | Not a separate v0 guarantee. | Include measured cases if the selected corpus/user queries require them. |
| Exact setup commands | Depend on the selected repository and concrete adapters. | Document verified commands, not speculative installation promises. |

A blocker in any of these areas is a reason to report the blocker or seek a decision, not to weaken a requirement to manufacture a pass.

## 21. Main risks and responses

| Risk | Consequence | Minimal response |
|---|---|---|
| Retrieval misses a useful report | Duplicate investigation. | Measure recall, preserve useful catalogue context, allow bounded query reformulation, diagnose before adding infrastructure. |
| Old report is treated as current | Incorrect reuse. | Show dates/scope/warnings; no implied fresh verification; request verification when the user wants it. |
| Known error warning is lost | Harmful reuse of superseded findings. | Include warnings in search and every read result, not only in report prose. |
| Citation depends on unavailable local/transcript material | Evidence cannot be inspected. | Preserve and flag the dependency; never invent its contents or silently claim complete provenance. |
| Sol/max is expensive or slow | Unexpected spend/latency. | Explicit start authorization, finite enforced bounds, compact context, observable usage. |
| Tool output overwhelms context | Token waste or omitted evidence. | Bounded retrieval/fetch responses, selective reading, explicit continuation. |
| Engine inherits broad Pi tools/extensions | Excess authority or recursion. | Explicit resource/tool configuration; no blanket ambient loading. |
| Automatic retry behavior is inherited | Unapproved repeated work. | Explicitly disable application/SDK retry paths and test failures. |
| Interrupted job appears completed | False confidence and bad publication. | Separate job outcomes; persist available artifacts; mark interrupted; no automatic restart. |
| Publication includes unintended files | Secret or unrelated content exposure. | Review exact paths, explicit staging, ignored local area, no broad commits. |
| Index and reports diverge | Incorrect or missing search results. | Derived catalogue, validation on acceptance, known-stale errors, explicit rebuild. |
| Scope expands into a platform | More maintenance than value. | Pi only, one user, one research model, files/Git, no services without demonstrated need. |

## 22. Decision ledger

This ledger records the design interview rather than creating a second backlog.

| Decision | Agreed outcome |
|---|---|
| First success | Personal cross-session reuse; community activity is not a release gate. |
| Existing material | Selected research on disk and manually exported reports from ChatGPT/other platforms. |
| Future material | Finished research becomes reviewable and publishable through GitHub. |
| Public boundary | Engine, necessary supporting material, and approved finished reports—not every source file or chat. |
| Client | Pi only. |
| User priorities | Minimal setup/maintenance, less repeated research/source checking, cheap retrieval context. |
| Automatic behavior | Check the compact catalogue before substantial research; do not scroll/load all reports. |
| Jev | Existing bounded relevance reranking when useful; not fact verification or a mandatory dependency. |
| Match classification | Covered, partial, or no useful match; lookup errors are separate. |
| Improvements | Only when requested; targeted rather than automatic full reinvestigation. |
| Old-source verification | Only when requested, with honest dates and limitations otherwise. |
| Same versus different question | Revise the same scoped report; create a linked report for a materially different question. |
| Review/publication | Show report/diff; one approval authorizes the reviewed accept/commit/push operation. |
| Catalogue content | Per-report descriptions, scope, dates, paths, and warnings; not combined narrative synthesis. |
| Licensing | MIT code; CC BY 4.0 for reports the contributor has the right to license. |
| Initial import scale | About twenty selected reports; no bulk-history/PDF pipeline. |
| Research engine | Standalone MCP-controlled researcher, not merely the host conversation doing all work. |
| Research model | Owner-approved Sol 6.1, `openai-codex/gpt-6.1-sol` / `max`; live runtime/auth availability remains unverified. |
| Alternative input | Import external finished deep research without rerunning it. |
| Gemini integration | Excluded; do not troubleshoot, depend on, or silently fall back to it for this product. |
| Research depth | One bounded planned investigation; sources, alternatives, limitations, and remaining gaps. |
| Launch approval | Ask unless the original request explicitly authorized new research/improvement. |
| Interruptions | Preserve available incomplete local work; no automatic retry or resume. |
| Retrieval acceptance | Useful report in the top three for at least eight of ten known-answer queries over twenty reports. |

## 23. Definition of done

V0 is complete only when:

1. The selected corpus is imported faithfully and approved for publication.
2. Reports and catalogue are readable, rebuildable, and consistent.
3. The fixed retrieval threshold is met without hiding warnings or mislabeling failed searches.
4. Covered, partial, and new-research paths work across Pi sessions.
5. The standalone researcher demonstrably uses Sol/max with real, explicitly wired research tools.
6. External finished reports can be imported without an engine run.
7. Improvements and source rechecking obey explicit requests.
8. Citations, scope, dates, correction notices, and revision identity survive retrieval and updates.
9. Research bounds, cancellation, interruptions, and publication failures are accurately represented.
10. No publication occurs without approval, and unrelated files/local incomplete work are excluded.
11. Applicable automated and end-to-end checks pass, with live checks and remaining limitations documented honestly.
12. Installation and operation are documented without requiring additional unapproved services or infrastructure.

The first release should prove the complete loop, not the eventual size of the platform:

> **Find previous work → assess applicability → reuse or deliberately investigate → preserve the result → review and publish → find it again next session.**
