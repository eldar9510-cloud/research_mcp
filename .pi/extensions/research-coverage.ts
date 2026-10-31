// Supported project-local Pi workflow. No message interception or extension-to-MCP calls.
import { Type, StringEnum } from '@earendil-works/pi-ai';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { createArchive } from '../../src/archive.js';
import { createArchiveResponder } from '../../src/server.js';
import { COVERAGE_GUIDELINES, createCoverageWorkflow } from '../../src/coverage.js';

const optionalText = (maxLength = 2000) => Type.Optional(Type.String({ maxLength }));
const display = (value: unknown) => JSON.stringify(value, null, 2).replace(/[\u007f-\u009f\u061c\u200e-\u200f\u202a-\u202e\u2066-\u2069]/g,
  c => `\\u${c.codePointAt(0)!.toString(16).padStart(4, '0')}`);

export default function (pi: ExtensionAPI) {
  let workflow: ReturnType<typeof createCoverageWorkflow> | undefined;
  let currentSignal: AbortSignal | undefined;
  // Main Pi chooses the semantic trigger through the registered workflow guideline.
  // Reset on delivered user messages, not queue input: the current tool sequence
  // must finish first. Steering/follow-ups do not emit before_agent_start.
  const reset = () => { workflow = undefined; currentSignal = undefined; };
  pi.on('session_start', reset);
  pi.on('session_shutdown', reset);
  pi.on('session_tree', reset);
  pi.on('session_compact', reset);
  pi.on('message_start', event => { if (event.message.role === 'user') reset(); });
  pi.on('tool_result', event => { workflow?.observe(event); });
  pi.registerTool({
    name: 'research_coverage', label: 'Archive coverage',
    description: 'Read-only archive assessment workflow. Sequential actions: lookup {purpose,question,query}; optional reformulate {query,reason} once; optional rerank {ids,reason} prepares a normal MCP request after exact TypeSafe payload permission; read {read:<entire read args/continuation>}; decide {outcome,reason,usefulIds,gaps}. Main Pi judges applicability, never keyword scores. At most 2 searches of 5 candidates, 3 reports, 6 selections, 12 pages; each visible result <=48 KiB. No research/source-fetch/acceptance/Git capabilities. Lookup errors stop the decision; unread warning context is uncertainty.',
    promptSnippet: 'Assess archive coverage before substantial investigations, comparisons and research-driven recommendations',
    promptGuidelines: [COVERAGE_GUIDELINES],
    parameters: Type.Object({
      action: StringEnum(['lookup', 'reformulate', 'read', 'rerank', 'decide']),
      purpose: Type.Optional(StringEnum(['investigation', 'comparison', 'research_recommendation', 'greeting', 'trivial', 'routine_coding', 'unrelated'])),
      question: optionalText(), query: optionalText(512), reason: optionalText(),
      ids: Type.Optional(Type.Array(Type.String({ maxLength: 100 }), { maxItems: 5 })),
      usefulIds: Type.Optional(Type.Array(Type.String({ maxLength: 100 }), { maxItems: 3 })),
      gaps: Type.Optional(Type.Array(Type.String({ maxLength: 2000 }), { maxItems: 10 })),
      outcome: Type.Optional(StringEnum(['covered', 'partial', 'no_useful_match'])),
      read: Type.Optional(Type.Object({
        reportId: Type.String({ maxLength: 100 }), expectedRevision: Type.String({ pattern: '^[a-f0-9]{64}$' }),
        selection: Type.Optional(Type.Object({ startByte: Type.Integer({ minimum: 0 }), endByte: Type.Integer({ minimum: 0 }) }, { additionalProperties: false })),
        offset: Type.Optional(Type.Integer({ minimum: 0 })), pageBytes: Type.Optional(Type.Integer({ minimum: 128, maximum: 8192 })),
        warningOffset: Type.Optional(Type.Integer({ minimum: 0 })), referenceOffset: Type.Optional(Type.Integer({ minimum: 0 })),
      }, { additionalProperties: false })),
    }, { additionalProperties: false }),
    async execute(_id, input, signal, _update, ctx) {
      if (signal?.aborted) throw Error('cancelled: archive coverage stopped; no research decision');
      currentSignal = signal;
      if (!workflow) {
        try {
          const config = { archiveRoot: process.env.RESEARCH_ARCHIVE_ROOT, workRoot: process.env.RESEARCH_WORK_ROOT,
            importRoot: process.env.RESEARCH_IMPORT_ROOT,
            maxReadBytes: process.env.RESEARCH_READ_BYTES === undefined ? 2048 : Number(process.env.RESEARCH_READ_BYTES),
            maxSearchResults: process.env.RESEARCH_SEARCH_LIMIT === undefined ? 5 : Number(process.env.RESEARCH_SEARCH_LIMIT) };
          const archive = createArchive(config);
          const respond = createArchiveResponder(archive, config);
          workflow = createCoverageWorkflow({
            search: args => {
              const bounded = { ...args, limit: Math.min(args.limit, config.maxSearchResults) };
              return respond(() => archive.searchReports(bounded), bounded, 'search');
            },
            read: args => respond(() => archive.readAccepted(args), args, 'accepted'),
            permitRerank: async mcp => {
              // Headless/unavailable integrations fall back locally; no global activation or alternate provider.
              const permissionSignal = ctx.signal ?? currentSignal;
              if (ctx.mode !== 'tui' || !pi.getActiveTools().includes('mcp') || permissionSignal?.aborted) return false;
              const allowed = await ctx.ui.confirm('Permit this bounded relevance payload to TypeSafe?',
                'Only approve material permitted for TypeSafe. Local acceptance is NOT transmission permission.\n' +
                'Exact query and selected catalogue metadata (no report bodies/drafts/conversations).\n' + display(mcp) +
                '\nThis only prepares an optional normal MCP call; it authorizes no research, source refresh or publication.', { signal: permissionSignal });
              return allowed === true && !permissionSignal?.aborted;
            },
          });
        } catch {
          return { content: [{ type: 'text', text: JSON.stringify({ outcome: 'lookup_error', error: { code: 'archive_unavailable' },
            next: 'STOP automatic research decision. Check the three configured local roots; no research was dispatched.' }) }], details: {} };
        }
      }
      return await workflow.run(input);
    },
  });
}
