---
{
  "format": 1,
  "metadata": {
    "id": "archived-research-mastra-ai-mastra-reusable-component-for-a-pi-delegation-child-672bb5aa",
    "title": "Research: mastra-ai/mastra — reusable component for a Pi delegation child",
    "question": "What findings, alternatives and limitations does the historical investigation document about Research: mastra-ai/mastra — reusable component for a Pi delegation child?",
    "scope": "Original Pi/tooling integration investigation: Research: mastra-ai/mastra — reusable component for a Pi delegation child. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Research: mastra-ai/mastra — reusable component for a Pi delegation child; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
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
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:34.706Z"
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
  "sourceDigest": "672bb5aa75dcc656e7d0ef2ae04114d4b02af214394ea0952c8c3bcf4a0fee43",
  "proposalRevision": "255a4d6729224ec537be3ba6b605032ce45ec0e60d8f5f2ef33da2961d84673a"
}
---
# Research: mastra-ai/mastra — reusable component for a Pi delegation child

## Summary
**FACT:** The earlier "Codex OAuth unreachable from published packages" finding is **corrected**. Mastra publishes Apache-2.0 `@mastra/code-sdk`, whose `./providers/openai-codex` and `./auth/providers/openai-codex` subpaths export a ChatGPT/Codex OAuth provider (browser **and** headless device login), and whose `headless` entry exports the bounded runner `runMC`. Verdict: **CONDITIONAL** — that path is heavy, and the SDK's default boot creates LibSQL storage/vector/memory and starts workers. **No selection or install made.**

## Findings
1. **Identity/license — FACT.** Active org-owned TS monorepo. Correction: `mastracode/` is now `{sdk,tui,factory,factory-ui,web}`; earlier-report paths (`mastracode/src/providers/openai-codex.ts`) 404 on main. [LICENSE.md](https://raw.githubusercontent.com/mastra-ai/mastra/main/LICENSE.md): Apache-2.0 **except** directories named `ee/` (`@mastra/core/auth/ee`, `agent-builder/ee`, `@mastra/editor/ee`) under `ee/LICENSE` — the Codex files are outside `ee/`. Versions read now: `@mastra/code-sdk@1.8.4-alpha.3`, `@mastra/mcp@2.1.0`, npm `@mastra/factory` latest `0.17.2`. [sdk pkg](https://raw.githubusercontent.com/mastra-ai/mastra/main/mastracode/sdk/package.json) · [mcp pkg](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/mcp/package.json)

2. **Smallest reusable component — FACT.** Auth: `@mastra/code-sdk` resolves `"./*"` → `dist/*.js` and exports `openaiCodexProvider(modelId): MastraModelConfig` and `buildOpenAICodexOAuthFetch()` ([d.ts](https://cdn.jsdelivr.net/npm/@mastra/code-sdk@1.8.4-alpha.3/dist/providers/openai-codex.d.ts)), plus `openaiCodexOAuthProvider`, `startCodexDeviceLogin`/`pollCodexDeviceLogin`, `refreshOpenAICodexToken`. Orchestration: `@mastra/core` agents/workflows run standalone; `@mastra/mcp` deps are only `@modelcontextprotocol/{core,server,client,node,ext-apps}`, `exit-hook`, `fast-deep-equal` (peer `@mastra/core`) — no dashboard/DB/server required for a plain agent (docs show `new Agent({...})` with no Mastra instance; no explicit storage-optional statement — **UNKNOWN**). **Negative FACT:** `createMastraCode`/`mountAgentControllerOnMastra` build LibSQLStore+LibSQLVector+memory and call `startWorkers()` by default ([dist/index.js](https://cdn.jsdelivr.net/npm/@mastra/code-sdk@1.8.4-alpha.3/dist/index.js)). `@mastra/factory` is a Hono server core (storage domains, WorkOS/Studio auth), not a small component ([registry](https://registry.npmjs.org/@mastra%2Ffactory)).

3. **Minimal Pi adapter shape — FACT(built-ins)/INFERENCE(assembly).** `@mastra/mcp` authors MCP servers, and `MCPClient` accepts a URL **or** stdio `command`+`args` — the shape Pi already uses for Jev ([README](https://raw.githubusercontent.com/mastra-ai/mastra/main/packages/mcp/README.md)). Proposed (no such adapter in-repo): Node child calls `createMastraCode({settingsPath})`, then `runMC({controller, session, prompt, ...})` from `@mastra/code-sdk/headless`, printing `RunMCResult` JSON ([headless/index.ts](https://raw.githubusercontent.com/mastra-ai/mastra/main/mastracode/sdk/src/headless/index.ts)). **UNKNOWN:** whether Pi can import `@mastra/core`, or itself run *as* the child keeping auth/tools/skills. Codex SDK subagents are in-process Mastra agents with `allowedWorkspaceTools` allowlists, not CLI spawns ([explore.js](https://cdn.jsdelivr.net/npm/@mastra/code-sdk@1.8.4-alpha.3/dist/agents/subagents/explore.js)); an ACP server ships (`dist/acp/server.js`), unverified for Pi.

4. **Bounds/cancellation — FACT.** `runMC`: `maxTurns` (→`max_turns`, exit 1), `timeoutMs` (→`timeout`, exit 2), `AbortSignal`, `run.abort()`, tool-approval `ResolutionPolicy` (`auto`/`deny`), structured `RunMCResult{status,text,toolCalls,toolResults,usage,exitCode}` ([types.d.ts](https://cdn.jsdelivr.net/npm/@mastra/code-sdk@1.8.4-alpha.3/dist/headless/types.d.ts), [policy.ts](https://raw.githubusercontent.com/mastra-ai/mastra/main/mastracode/sdk/src/headless/policy.ts)). `agent.generate()` supports `maxSteps` (default 5), `stopWhen`, `abortSignal`, `onAbort`, `timeout:{totalMs,stepMs,firstChunkMs}` ([reference](https://mastra.ai/reference/agents/generate)). Extra LLM calls exist but are unmeasured (goal runs need `judgeModelId`; classifier/context-builder evals). Gating is deterministic; LLM obedience is not.

5. **Auth — FACT (positive).** First-party OAuth client `app_EMoamEEZ73f0CkXaXp7hrann` at `auth.openai.com`: browser localhost callback and device-code headless (`MASTRACODE_OPENAI_CODEX_AUTH_MODE=device`), refresh, `accountId` from token claims, requests rewritten to `chatgpt.com/backend-api/codex/responses` with `originator: mastracode`; credentials in `auth.json`, with `AuthStorage(authPath?)` injectable ([source](https://raw.githubusercontent.com/mastra-ai/mastra/main/mastracode/sdk/src/auth/providers/openai-codex.ts); [parity gaps](https://github.com/mastra-ai/mastra/issues/16542)). Existing keys work unchanged: `deepseek/deepseek-flash` + `DEEPSEEK_API_KEY`, `zai/glm-5.3` + `ZHIPU_API_KEY` ([DeepSeek](https://mastra.ai/models/providers/deepseek), [Z.AI](https://mastra.ai/models/providers/zai)). **UNKNOWN:** reuse of Pi's own Codex session store; OpenAI terms for this client.

6. **Jev** stays parent-side; Mastra's MCP stdio client and SDK MCP manager are independent of it.

7. **Telemetry/privacy — FACT.** `@mastra/code-sdk` declares `posthog-node@^5.46.1` and exports `resolveCloudObservabilityConfig`; core telemetry is PostHog-on-by-default with `MASTRACODE`-independent `MASTRA_TELEMETRY_DISABLED` opt-out (opt-out once failed silently, PR #16990) ([posthog.ts](https://github.com/mastra-ai/mastra/blob/main/packages/core/src/telemetry/posthog.ts)). Credentials stay in a local file; `ee/` limits enterprise reuse.

8. **Pros/cons.** Pros: (1) published Apache-2.0 Codex OAuth adapter with headless device login and injectable credential path — the old blocker is materially softened; (2) hard source-defined child bounds plus working DeepSeek/ZAI model ids, so no new billing is implied. Cons: (1) the working path is `@mastra/code-sdk`, whose default boot spins LibSQL storage/vector/memory and workers, with deps incl. libsql, pg, duckdb, stagehand, fastembed, tavily, posthog-node — heavy and DB-dependent against the stated preference; (2) alpha versioning, telemetry surface, `ee/` carve-out, and a separate auth.json that does not reuse Pi's Codex login. **Conclusion: CONDITIONAL.** Biggest unresolved fact: whether the Codex provider can be imported and used without booting storage/memory/workers (telemetry off) in a Pi-spawned Node child — testable only by install/run, outside this authority.

## Gaps
Pi-side importability/ACP support; a storage-free import path for the Codex provider; measured token overhead (no benchmarks run); OpenAI terms for the OAuth client.

```acceptance-report
{
  "criteriaSatisfied": [
    {
      "id": "criterion-1",
      "status": "satisfied",
      "evidence": "report.md cites exact published paths (mastracode/sdk/src/{providers,auth/providers}/openai-codex.ts, dist/headless/types.d.ts, LICENSE.md) with fact/inference/unknown labels and corrects the prior report on mastracode layout and Codex OAuth publishability."
    }
  ],
  "changedFiles": [
    "/home/eldar/.local/share/pi-research/delegation-candidates-20260926T115602Z-0p7vbxix/mastra/report.md"
  ],
  "testsAddedOrUpdated": [],
  "commandsRun": [
    {
      "command": "read-only fetch_content of raw.githubusercontent.com / api.github.com / cdn.jsdelivr.net / registry.npmjs.org",
      "result": "passed",
      "summary": "Verified LICENSE.md ee/ carve-out, sdk+mcp package.json exports/deps, Codex OAuth source, headless runMC types, published dist file list"
    }
  ],
  "validationOutput": [
    "Corrected prior claim: Codex OAuth IS published in @mastra/code-sdk@1.8.4-alpha.3 (dist/providers/openai-codex.js exports openaiCodexProvider/buildOpenAICodexOAuthFetch; device-code headless login present).",
    "Corrected prior path claim: mastracode/src/providers/openai-codex.ts 404s on main; layout is now mastracode/{sdk,tui,factory,factory-ui,web}.",
    "Negative evidence: createMastraCode/mountAgentControllerOnMastra create LibSQLStore+LibSQLVector+memory and call startWorkers() by default."
  ],
  "residualRisks": [
    "Storage-free use of the Codex provider and telemetry-off behavior unproven without an install (out of authority).",
    "Alpha versioning and OpenAI terms acceptability of the third-party Codex OAuth client not assessed.",
    "No token/context overhead measurement performed; no savings claim made."
  ],
  "noStagedFiles": true,
  "diffSummary": "Added research report only; no installs, clones, execution, credential reads, or settings changes.",
  "reviewFindings": [
    "no blockers",
    "note: mastracode/package.json does not exist on main (404) - the workspace id is a set of packages, so the earlier report's mastracode/src paths are stale."
  ],
  "manualNotes": "Codex OAuth is real, Apache-2.0 and outside ee/, but lives in heavyweight @mastra/code-sdk rather than @mastra/core. Cheapest untested experiment: import only '@mastra/code-sdk/providers/openai-codex' in a Node child and observe whether LibSQL/memory/workers load."
}
```
