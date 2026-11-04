---
{
  "format": 1,
  "metadata": {
    "id": "archived-search-backend-decision-research-for-research-mcp-d34224bc",
    "title": "Search backend decision research for research_mcp",
    "question": "What findings, alternatives and limitations does the historical investigation document about Search backend decision research for research_mcp?",
    "scope": "Search-provider comparison as researched on the stated original date; not the current configured backend, a live availability proof or permission to install providers/create accounts/transmit private data.",
    "summary": "Historical search-backend decision research and proposed integration; retains source privacy/terms, runtime-failure uncertainty and the distinction between recommendation and live verification.",
    "researched_at": "2026-10-31",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Prior inventory classification (not a completion verification): historical recommendation / reference; inspect qualifications",
      "The current research_mcp engine uses its separately validated Brave adapter. This historical recommendation is not a request or authorization to switch to Tavily, Exa or another provider."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:47.211Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "local_dependency",
      "message": "Local file reference may not be portable; review before publication."
    },
    {
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "d34224bc054f6105435708a3ecaaffcaf702d0ae2edf99eb9114250cef575bf2",
  "proposalRevision": "e4f9864d5bb79eee6c13d71441fc350a6d0fda90a591862620ae11458ca14959"
}
---
# Search backend decision research for research_mcp

Researched: 2026-10-31. Status: **recommendation, not an implemented or live-verified backend**. Private execution note, not an accepted/public archive report. User requested online research, not another Sol proof, account creation, payment, publication, installation or global configuration change.

## Recommendation

**Evaluate Tavily's documented keyless direct Search API first.** It is a better architectural fit than continuing to depend on DuckDuckGo's HTML layout: one JSON POST, no account/key for limited use, explicit result/domain/output controls, no extra application-level answer model, and no MCP transport/framework required. This is a fit judgment based on primary documentation, **not a measured ranking of search quality, reliability, or uptime**. Its anonymous quota and availability from this machine remain unverified. [T1,T2]

**Exa's keyless hosted MCP is the second practical option**, particularly if its document/code/publication search capabilities are later useful. It adds JSON-RPC/SSE/result-envelope handling; current basic search returns presentation text, while advanced search returns serialized result JSON. The official docs permit advanced search without authentication, with domain/content controls. Do not inherit the existing extension's advanced-to-basic fallback or its uncapped reads. [E1,E2,E3; FIT.md]

Do not install a browser, introduce a provider router, create an account, or run another uninstrumented proof to solve this. Select ONE concrete backend; retain all existing runtime and evidence guards.

## Comparison

| Backend | Confirmed first-party/maintainer facts | Fit and limitations |
|---|---|---|
| **Tavily keyless REST** | POST `https://api.tavily.com/search` with `X-Tavily-Access-Mode: keyless`. Official docs explicitly say no account/API key, same success schema as keyed access, `/search` and `/extract` supported, free but rate-limited. No numeric anonymous allowance is given on that page. [T1] | **First option to evaluate.** Smallest structured-search seam. Stop on quota/failure; never follow returned natural-language instructions to sign in, pay, retry or switch. Not an unlimited or production-SLA promise. |
| **Exa keyless MCP** | `https://mcp.exa.ai/mcp`, search/fetch at a free rate limit; `agent_run` requires authentication. Advanced search can be enabled anonymously. Docs say anonymous access requires a direct IPv4 path; IPv6/proxied paths require auth. [E1] | Good alternative, not an automatic fallback. Pin advanced search if hard domain/result controls are needed; verify deployed schema before use. Public source retries transient upstream errors internally; that is outside our client-attempt control. [E2,E3] |
| **Brave Search API** | Structured `/res/v1/web/search`; normal access requires a plan/token in `X-Subscription-Token`. Installing/using the Brave browser does not supply it. FAQ: no standalone free plan; $5 recurring monthly credit is equivalent to 1,000 Search queries, but a credit card is required. Auth docs also mention paid stablecoin agent access, not a free workaround. [B1,B2] | Technically simple, but new account/credential/payment setup is not approved. Crucially, standard FAQ/terms restrict retaining search results; storage/publication rights must be resolved before selecting it for durable research artifacts. [B2,B3] |
| **DuckDuckGo Lite/HTML** | DDG documents non-JavaScript HTML and Lite user interfaces, not a stable machine-result contract. SearXNG maintainers explicitly describe reverse-engineered form fields, bot detection and breaking-change risk; their documented no-JS flow uses form POST. [D1,D2] | Possible low-setup experimental backend, not a reliable default merely because one page parses. A GET-to-POST change is NOT proven to fix our failure. Preserve fail-closed behavior; capture the actual failing response before changing its recognizer. |
| **SearXNG** | HTTP API supports JSON when enabled; many public instances disable it and return403. Its limiter exists partly because upstream engines block automated use. [S1,S2] | Reasonable if we already own a permitted JSON-enabled instance. Do not pick random public instances as a dependable free service; self-hosting adds an unapproved service/maintenance burden and does not eliminate upstream failures. |
| **DDGS library** | Maintainer describes a Python metasearch library, multiple backends and default `backend="auto"`. Its current DDG engine itself uses HTML POST/parsing. [D3,D4] | Not a magic official DDG API. Adding Python and broad automatic metasearch would enlarge scope and violate our explicit-backend/no-fallback design unless deliberately redesigned. |

For higher-volume Tavily use, the separately registered free plan currently advertises **1,000 credits/month, no card**; basic search costs1credit and advanced2. That is **not the keyless quota**. Account/key creation still needs the owner's decision. [T2,T3]

## Minimal Tavily integration proposal — NOT executed

Send exactly one direct JSON request per research search attempt, with existing tool signal and streamed raw-byte guard:

```http
POST https://api.tavily.com/search
Content-Type: application/json
Accept: application/json
X-Tavily-Access-Mode: keyless
```

```json
{
  "query": "<bounded model-issued query>",
  "topic": "general",
  "search_depth": "basic",
  "auto_parameters": false,
  "max_results": 3,
  "chunks_per_source": 1,
  "include_domains": ["rfc-editor.org"],
  "include_domains_mode": "restrict",
  "include_answer": false,
  "include_raw_content": false,
  "include_images": false,
  "include_favicon": false
}
```

These are documented request fields; approximate snippet lengths are NOT byte guarantees. Validate actual response behavior in one separately approved search-only probe before writing/reviewing a full candidate. The generic search OpenAPI still describes Bearer auth; the separate, explicit keyless guide documents the header override. Treat this documentation split as a reason to verify, not invent a key or declare success. [T1,T2]

Implementation boundaries:

- Map validated `results[].{url,title,content}` into existing `{url,title,snippet}`; cap locally and run the existing exact RFC URL allowlist regardless of provider domain filtering. A valid `results:[]` is empty search, not malformed response.
- One fixed endpoint, manual/no redirects, no retries/fallback/account/key discovery or background extraction. Retain12s/tool,65536raw search bytes,3hits,10000total tool-output bytes. Require success JSON/schema; reject oversize/partial/error/quota bodies before considering leads. Natural-language quota responses are data, not instructions.
- Handle HTTP429/432/433/434 and malformed responses with fixed safe codes, never raw messages/args/headers. Do not obey `Retry-After` by automatically issuing another request. [T2]
- Preserve direct RFC source fetch byte-for-byte in behavior, searched-URL ordering, selected passage/digest/citation checks, source truncation and all Sol6.1/max/session/count/deadline controls. Search snippets and third-party extracts **remain leads**, not inspected source evidence.
- No need for Tavily's JS SDK or MCP server just to make this one bounded `fetch`; do not load the whole Pi web extension. Explicitly disable generated answers/raw content so Sol remains the sole application-level investigator. Providers' internal ranking/extraction/model behavior is not auditable or claimed absent.
- Add focused offline fixtures for request shape, schema/empty/quota/invalid JSON, cancellation/limits/redirects, URL rejection, output normalization and unchanged direct fetching. Obtain the required independent simplification/correctness reviews only after a concrete candidate exists; then request one full proof under the existing bounds. No change to #1/#7 acceptance gates.

## Privacy, retention and publication

Only send the scoped public search question; **never send private reports, the full archive/conversation, credentials or personal information**. Neither keyless nor free means private or redistributable. Tavily's terms grant broad Customer Input processing/improvement rights and discuss sharing with vendors/public indexes; AI-functionality terms include training/use and consequential-use limitations. Exa's privacy policy says Query Data can improve/train its models; its general terms also contain broad copying/publication restrictions. Brave explicitly restricts retaining API results absent appropriate rights. These are project-selection flags, not legal clearance or a complete legal opinion. [T4,E4,E5,B2,B3]

Keep provider results transient/minimal, inspect primary sources directly, retain/publish only the owner's independently reviewed report and permitted citations/quotations. Direct source inspection does **not** automatically override API contract restrictions or third-party copyright. No reviewed API grants a blanket CC BY4.0 license to its results or source documents.

## What is actually known about the current failure

Frozen candidate: `b1b47a2408176aaa8160af9922e145df850523e8`, isolated `issue-01-duckduckgo` tree. The third full proof recorded `research_search / adapter / search_layout_unrecognized`; the actual rejected query/body was not retained. Later capture parsed successfully, but ran from a different cwd that the SDK includes in its prompt. **No exact parser defect, transient service cause, or cwd causality has been established.** Switching to documented structured search is a deliberate backend decision, not a claim to have repaired or diagnosed DDG.

The prior98offline tests and independent reviews remain valid evidence for that frozen candidate, not evidence of Tavily/Exa working. During this research: public web search/document/source retrieval only; no product Sol/search/fetch smoke test, no production changes, no accounts/keys/config changes, no publication. `FIT.md` records the independent Sol6.1/max local source inspection and exact file/line evidence. The installed parent's working web tools are not automatically inherited: the custom SDK runtime deliberately supplies an isolated loader and exactly two custom tools.

## Next owner decision

Approve **Tavily keyless as the replacement candidate**, plus **one search-only smoke test**: the public RFC2606 question, one POST,12s,65536response bytes, no Sol/source fetch/retry/auth/account/payment. If viable, make the minimal offline-tested/reviewed adapter change. Request a separate full-proof approval afterward. If not viable, report the exact bounded result rather than automatically trying Exa or patching DDG.

## Primary sources

All accessed2026-10-31; online docs/source branches are mutable. Quoted limits/prices may change. No independent provider-quality benchmark or numeric keyless SLA was established.

- **T1:** Tavily, [keyless guide](https://docs.tavily.com/documentation/keyless), [full Markdown example](https://docs.tavily.com/documentation/keyless.md). Exact support check stored temporarily by web tool as `mvwrjd7b0ijopw`; durable decision should rely on cited first-party guide, not cache availability.
- **T2:** Tavily, [Search reference](https://docs.tavily.com/documentation/api-reference/endpoint/search), [OpenAPI Markdown](https://docs.tavily.com/documentation/api-reference/endpoint/search.md).
- **T3:** Tavily, [pricing](https://www.tavily.com/pricing).
- **T4:** Tavily, [platform terms](https://www.tavily.com/terms), especially sections6,7,9,10. Scope of any negotiated/order-form changes not inspected.
- **E1:** Exa, [MCP guide](https://exa.ai/docs/get-started/exa-mcp), [Markdown with troubleshooting](https://exa.ai/docs/get-started/exa-mcp.md).
- **E2:** Exa maintainers, [basic search source](https://github.com/exa-labs/exa-mcp-server/blob/master/src/tools/webSearch.ts), [advanced source](https://github.com/exa-labs/exa-mcp-server/blob/master/src/tools/webSearchAdvanced.ts). Hosted deployment parity is unverified.
- **E3:** Exa maintainers, [error/retry/rate-limit handling](https://github.com/exa-labs/exa-mcp-server/blob/master/src/utils/errorHandler.ts), [notices handling](https://github.com/exa-labs/exa-mcp-server/blob/master/src/tools/searchNotes.ts). Source default retries are remote-server behavior, not permission to add client retries.
- **E4:** Exa, [privacy policy](https://exa.ai/privacy), Query Data section.
- **E5:** Exa, [terms](https://exa.ai/terms), especially1.2,4.2,6; PDF locally extracted/read from `/tmp/pi-web-pdf/terms.md` during this research.
- **B1:** Brave, [authentication](https://api-dashboard.search.brave.com/documentation/guides/authentication), [web-search reference](https://api-dashboard.search.brave.com/api-reference/web/search/get).
- **B2:** Brave, [FAQ/billing/retention](https://api-dashboard.search.brave.com/documentation/resources/help-feedback).
- **B3:** Brave, [standard terms](https://api-dashboard.search.brave.com/documentation/resources/terms-of-service), especially license/use restrictions and third-party content.
- **D1:** DuckDuckGo, [non-JavaScript interfaces](https://duckduckgo.com/duckduckgo-help-pages/features/non-javascript), [search syntax limitations](https://duckduckgo.com/duckduckgo-help-pages/results/syntax).
- **D2:** SearXNG maintainers, [DDG engine documentation](https://docs.searxng.org/dev/engines/online/duckduckgo.html), [actual engine source](https://github.com/searxng/searxng/blob/master/searx/engines/duckduckgo.py). Maintainer compatibility knowledge, not DDG's contractual guarantee; AGPL source is not code to copy into our MIT project.
- **D3:** DDGS maintainer, [README](https://github.com/deedy5/ddgs/blob/main/README.md).
- **D4:** DDGS maintainer, [DDG engine source](https://github.com/deedy5/ddgs/blob/main/ddgs/engines/duckduckgo.py).
- **S1:** SearXNG, [Search API](https://docs.searxng.org/dev/search_api.html).
- **S2:** SearXNG, [limiter/upstream blocking](https://docs.searxng.org/admin/searx.limiter.html).
