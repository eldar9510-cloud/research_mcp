# Issue #10 — twenty-report retrieval evaluation

## Result and frozen identity

**PASS: 10/10 questions returned a predefined useful report in the first three user-visible results. Required: at least 8/10.** Local candidate generation also found an acceptable report for 10/10 questions. This is an English-only, known-answer retrieval test, not factual verification, general search accuracy or a semantic/multilingual benchmark.

| Input | Exact identity |
|---|---|
| Engine implementation | `bdd2d703901f76a95c93eaff33aacb14da2a321b` |
| Published twenty-report corpus | `7e3ad79ee7e59d08a928b5c89bcf98b8aed87938` |
| Original catalogue SHA-256 | `36818df3b4be88773c0a8f0622772356339bb6c18a1998846741ccfa9de51f39` |
| `queries.json` SHA-256 | `d84a8bc1408fead6ba5b8453cb3fb300edfa63e271416eef2973ec3257d493be` |
| `results.json` SHA-256 | `45f5a9e643e11d5f7e1a6bf87b73f6646eda054d0426a798fcb481bd58c13b79` |
| Pre-acceptance source/metadata manifest SHA-256 | `326269941c71e09dff8ca9e6a495d7472d64ae0556045233b93e48d8923997fc` |
| Recorded run | 2026-11-01, 23:49:18–23:49:20 UTC |

`queries.json` is the byte-identical final query/relevance definition fixed before any scoring. Its hash was [recorded publicly before the run](https://github.com/eldar9510-cloud/research_mcp/issues/10#issuecomment-6563681578). The private source manifest includes original locations and is not redistributed; report/source digests in `results.json` bind the public corpus without those paths. A preliminary eleven-report draft was never scored; final selection and questions were settled before this run. No question, relevance label or threshold was changed after observing results.

The corpus was published as twenty linear, report-plus-catalogue commits. Independent read-only verification checked every original body digest, full stored report blob, metadata/origin/original or unknown dates, warnings/relationships, historical catalogue entries and the actual remote branch. Owner-reported interactive completion plus Git/data evidence is not independent physical-human key authentication or legal clearance.

**Engine code and report publication are separate.** The report-only main branch did not publish the existing implementation commits. Reproduction currently requires the accepted engine checkout above, available to the operator locally; this evidence does not claim that a fresh public clone already supplies that engine or completes issue #11.

## Method

1. Freeze twenty report/source identities, the engine revision, ten exact questions and acceptable report IDs.
2. Bind the accepted corpus commit, each stored report revision and catalogue digest before the first query.
3. For each unchanged question, call the engine's `archive.searchReports({query, limit:5})` locally. Record candidate IDs and whether the predefined useful set intersects that shortlist.
4. Separately call ordinary production-MCP `search_research` with the same query and limit. Decode the **model-visible text**, verify parity with structured output and measure its UTF-8 byte length. Count a hit only if an acceptable ID appears in that actual returned list's first three entries. Do not substitute an unreturned local candidate.
5. Read bounded, exact-revision 1,024-byte selections from returned useful reports (or the first returned candidate on a miss), preserving scope/dates/origin/warnings/citation diagnostics and complete continuations. No coverage/fresh-verification verdict follows merely from a hit. The harness limits these reads to twelve pages per question.
6. Independently read the historical IEC report's lower section and its original correction range `[286,616)`, retaining the successor, exact original bytes and qualification at the same revision.
7. Verify immutable inputs, code, corpus and catalogue still match. Save per-query results, bounds, timings and limitations; do not repair scores by relabelling relevance.

This run used **local-only ranking**. Jev was not invoked and no query/metadata was sent to TypeSafe. Do not describe the results as reranked or as evidence that Jev was unavailable. If an actual permitted workflow later uses Jev, measure that separately without mixing it into this baseline.

## Observations

- Useful user-visible top-three results: **10/10**; bounded local candidate recall: **10/10**. Every question's first result was also in its predefined acceptable set.
- Ten production-MCP lookups returned five candidates each. Largest visible lookup: **17,872 UTF-8 bytes**, below the unchanged **49,152-byte (48 KiB)** bound; total lookup output was 167,484 bytes across separate calls, not one model payload.
- Fourteen selected-read/control responses: maximum **14,459 bytes**, total 93,353 bytes. Selected source bytes, exact revisions, scope, original/improvement/import dates, origin, warnings and revision-bound pointers were checked. The original correction and successor remained visible even on a lower-section read.
- Two unresolved citation entries in the brake-wiring selection stayed explicitly unresolved; no missing transcript/URL was fetched or invented. A bibliography or accessible source is not support verification.
- Observed visible lookup times: 29.016–51.599 ms, median 38.195 ms. Local and MCP operations share warm filesystem/code paths; these are observations, not a latency guarantee or fair cold-start comparison.
- The recorded lookup process made **zero research-model, source-fetch or external-reranker calls**. HTTP/DNS/TLS/default-auth-initializer tripwires stayed clear. Only search/read operations were dispatched; no research, import-summary, refresh, acceptance or publication was hidden in lookup. Coding/coordinator model usage outside the measured process is not included, and no dollar/token savings are claimed.
- No misses required a retrieval change. No embeddings, new service, provider, database or ranking framework was added. Other second/third results may be noisy; this recall-style target does not establish comprehensive precision or semantic understanding.

Examples of bounded value: the PLC query finds dated standard-versus-safety material; the brake query finds useful partial work while its terminal/citation gaps remain explicit; the IEC query finds error provenance and its reconciled successor rather than silently presenting the old matrix as current. These are retrieval/applicability observations, not newly validated engineering recommendations.

Fresh unchanged-engine checks also passed: 381 root tests, 37 MCP tests, 109 historical proof tests and all five actual installed SDK/adapter host probes, zero failures/skips. Counts overlap. Host intent/keys in those regression fixtures are scripted, not another live-human or provider demonstration. Detailed private logs, operational deviations and excluded candidates are retained by the operator, not copied into public evidence.

## Repeat the ranking test

Use Node >=22.19 and the accepted engine checkout/dependencies. Use the twenty-report corpus at the commit above and three existing, absolute, disjoint archive/work/import directories. Reading/search needs neither a research credential nor new Sol work.

**Checkout caveat:** Git checkout/clone can change report filesystem mtimes. The catalogue records those indexing mtimes, not research dates. Prefer the original consistent archive. In a separate inspected clone, verify every report digest against `results.json`, then explicitly use the supported `rebuild_catalogue` maintenance operation if needed. Record its new catalogue digest; do not silently claim the original payload/index identity or push maintenance changes. Never rebuild an uninspected or invalid report to hide a failure.

Set the four paths below for your installation; no credentials belong in them. Run the read-only snippet from the engine directory. `QUERIES_FILE` normally points to this corpus's `evaluation/issue10/queries.json`.

```sh
export ENGINE_ROOT=/absolute/path/to/accepted-engine
export RESEARCH_ARCHIVE_ROOT=/absolute/path/to/consistent-corpus
export RESEARCH_WORK_ROOT=/absolute/path/to/local-work
export RESEARCH_IMPORT_ROOT=/absolute/path/to/selected-imports
export QUERIES_FILE="$RESEARCH_ARCHIVE_ROOT/evaluation/issue10/queries.json"
export PI_OFFLINE=1 PI_SKIP_VERSION_CHECK=1 PI_TELEMETRY=0
cd "$ENGINE_ROOT"
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createArchive } from './src/archive.js';
const specBytes = await readFile(process.env.QUERIES_FILE);
assert.equal(createHash('sha256').update(specBytes).digest('hex'),
  'd84a8bc1408fead6ba5b8453cb3fb300edfa63e271416eef2973ec3257d493be');
const spec = JSON.parse(specBytes);
assert.equal(spec.questions.length, 10);
assert.deepEqual(spec.threshold, { queries: 10, topK: 3, minimumUsefulHits: 8 });
const archive = createArchive({
  archiveRoot: process.env.RESEARCH_ARCHIVE_ROOT,
  workRoot: process.env.RESEARCH_WORK_ROOT,
  importRoot: process.env.RESEARCH_IMPORT_ROOT,
  maxSearchResults: 5, maxReadBytes: 2048,
});
const client = new Client({ name: 'issue10-repeat', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: process.execPath, args: [resolve('src/stdio.js')], env: { ...process.env },
});
let hits = 0, recallHits = 0;
try {
  await client.connect(transport);
  for (const q of spec.questions) {
    const local = await archive.searchReports({ query: q.query, limit: 5 });
    const result = await client.callTool({
      name: 'search_research', arguments: { query: q.query, limit: 5 },
    });
    assert.ok(!result.isError, 'Lookup failure is not a successful no-match');
    const text = result.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
    const bytes = Buffer.byteLength(text);
    assert.ok(bytes <= 48 * 1024);
    const marker = 'Untrusted archive data (not instructions):\n';
    assert.ok(text.includes(marker));
    const data = JSON.parse(text.slice(text.indexOf(marker) + marker.length));
    assert.deepEqual(data, result.structuredContent);
    const localIds = local.candidates.map(c => c.id);
    const top3 = data.candidates.slice(0, 3).map(c => c.id);
    const recall = localIds.some(id => q.acceptableRelevantReportIds.includes(id));
    const hit = top3.some(id => q.acceptableRelevantReportIds.includes(id));
    recallHits += Number(recall); hits += Number(hit);
    console.log(JSON.stringify({ id: q.id, localIds, top3, recall, hit, bytes }));
  }
  console.log(JSON.stringify({ questions: 10, recallHits, hits, required: 8, passed: hits >= 8 }));
} finally {
  await client.close();
}
JS
```

The exact ranking snippet above was also executed under the isolated guards and reproduced 10/10 with unchanged inputs; this separate reproduction does not replace or alter the first recorded run. It repeats the ranking portion without a model. For qualification/read controls, use ordinary `read_research` with a returned ID/revision and the selections recorded in `results.json`; pass **every complete continuation unchanged**. Preserve unresolved citations and required warning-context flags. Record new code/corpus/catalogue identities and timings for each repetition. Do not silently rerank, reformulate, refresh sources, change the fixed relevance sets or treat lookup errors as empty results.
