// Project-local Pi host gate for the installed pi-mcp-adapter proxy, direct and script paths.
// Project trust and the adapter must both be enabled; raw MCP clients are trusted local software.
import { createArchive } from '../../src/archive.js';
import { createPublication, publicationDisplay } from '../../src/publication.js';
import { Text, matchesKey, truncateToWidth } from '@earendil-works/pi-tui';
import { Type } from 'typebox';
import { StringEnum } from '@earendil-works/pi-ai';
import { createResearchHost, localResearchTarget, researchDisplay, RESEARCH_GUIDELINES } from '../../src/research-host.js';
import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
// The adapter documents this versioned shared-event channel; no global Pi config is changed.
const MCP_TOOL_APPROVAL_REQUEST_EVENT = 'pi-mcp-adapter:tool-approval-request';
type McpToolApprovalRequest = {
  serverName: string; originalToolName: string; args: Record<string, unknown>;
  signal?: AbortSignal; claim: (handler: () => Promise<'allow_once' | 'deny'>) => boolean;
};

const expectedKeys = ['acceptedAt', 'expectedBaseRevision', 'expectedCatalogueRevision',
  'expectedReviewDigest', 'expectedRevision', 'proposalId'].sort().join(',');
// Shared conservative target snapshots and escaped display copies; no credential reader.
const displayCopy = researchDisplay;
const displayField = (value: unknown) => displayCopy(String(value)).replace(/\n/g, '\\n');

// Read-only, scrollable review. Only an actual host key decision resolves approval;
// no tool schema or command argument accepts an approval boolean. Never renders Markdown/ANSI.
async function reviewPublication(ctx: ExtensionContext, display: string): Promise<boolean> {
  return await ctx.ui.custom<boolean>((tui, _theme, _keys, done) => {
    const text = new Text(display, 0, 0);
    let offset = 0;
    let height = 10;
    let lines: string[] = [];
    let width = 0;
    return {
      render(w: number) {
        if (w !== width || !lines.length) { lines = text.render(w); width = w; }
        height = Math.max(1, Math.min(20, tui.terminal.rows - 6));
        offset = Math.max(0, Math.min(offset, Math.max(0, lines.length - height)));
        return [truncateToWidth(`REVIEW ONLY: lines ${offset + 1}-${Math.min(lines.length, offset + height)}/${lines.length}`, w),
          ...lines.slice(offset, offset + height),
          truncateToWidth('Arrows/PgUp/PgDn/Home/End: read | Ctrl+Y: approve accept+commit+push | Esc: deny', w)];
      },
      handleInput(data: string) {
        if (matchesKey(data, 'escape') || matchesKey(data, 'ctrl+c')) { done(false); return; }
        if (matchesKey(data, 'ctrl+y')) { done(true); return; }
        if (matchesKey(data, 'up')) offset--;
        if (matchesKey(data, 'down')) offset++;
        if (matchesKey(data, 'pageUp')) offset -= height;
        if (matchesKey(data, 'pageDown')) offset += height;
        if (matchesKey(data, 'home')) offset = 0;
        if (matchesKey(data, 'end')) offset = lines.length;
        tui.requestRender();
      },
      invalidate() { text.invalidate(); lines = []; },
    };
  }) === true;
}

export default function (pi: ExtensionAPI) {
  let current: ExtensionContext | undefined;
  let publicationActive = false;
  let publicationController: AbortController | undefined;
  const researchHost = createResearchHost({ publicationActive: () => publicationActive,
    onState: state => pi.appendEntry('research-host', state) });
  pi.registerTool({
    name: 'research_request', label: 'Prepare scoped research',
    description: 'Prepare ONE host-private single-use research permission and an ordinary mcp call; does not dispatch. Exact server alias and strict request {mode:new,question<=300,scope<=400,language?,references?:[{reportId,expectedRevision,selection:{startByte,endByte}}] (max3),partials?:[{jobId,artifact,expectedRevision,selection:{startByte,endByte}}] (max3; explicit prior incomplete material for a NEW job, not restored history),limits?:tighter backend limits}. CURRENT_REQUEST is entrusted main-Pi semantic interpretation of the WHOLE delivered current user request; rationale is a 40..800-character explanation, not a quote/keyword/consent credential. Otherwise ASK_CONFIRMATION really asks and waits. TUI only; no coverage prerequisite for explicit standalone requests, no improvement/publication/retry permission.',
    promptSnippet: 'Prepare one explicitly authorized scoped new investigation before normal MCP dispatch',
    promptGuidelines: [RESEARCH_GUIDELINES],
    parameters: Type.Object({
      server: Type.String({ minLength: 1, maxLength: 100 }),
      request: Type.Unknown({ description: 'Strict bounded start_research request, never consent flags or conversation context.' }),
      source: StringEnum(['CURRENT_REQUEST', 'ASK_CONFIRMATION']),
      rationale: Type.String({ minLength: 40, maxLength: 800 }),
    }, { additionalProperties: false }),
    async execute(_id, input, signal, _update, ctx) {
      const prepared = await researchHost.prepare(input, ctx, signal);
      const text = JSON.stringify(prepared);
      if (Buffer.byteLength(text) > 48 * 1024) throw Error('research_not_prepared');
      return { content: [{ type: 'text', text }], details: {} };
    },
  });
  // Ordinary Git belongs to this host-only command, never to the research/MCP tools.
  pi.registerCommand('research-publish', {
    description: 'Review and approve one proposal + exact report/catalogue commit + push: <proposalId> <remote-name> <branch>',
    handler: async (args, ctx) => {
      let latestState: object | undefined;
      const record = (state: object) => { latestState = state; pi.appendEntry('research-publication', state); };
      if (ctx.mode !== 'tui' || publicationActive || researchHost.active || !ctx.isIdle()) {
        record({ status: 'not_approved', accepted: false, committed: false, published: false });
        ctx.ui.notify('Publication requires an idle interactive TUI host; nothing dispatched.', 'warning');
        return;
      }
      const parts = args.trim().split(/\s+/);
      if (parts.length !== 3) { ctx.ui.notify('Usage: /research-publish <proposalId> <remote-name> <branch>', 'warning'); return; }
      publicationActive = true;
      publicationController = new AbortController();
      try {
        const roots = { archiveRoot: process.env.RESEARCH_ARCHIVE_ROOT, workRoot: process.env.RESEARCH_WORK_ROOT,
          importRoot: process.env.RESEARCH_IMPORT_ROOT };
        const archive = createArchive(roots);
        const result = await createPublication({ archive, repository: roots.archiveRoot }).publish({
          proposalId: parts[0], remote: parts[1], branch: parts[2], mode: ctx.mode,
          signal: publicationController.signal, onState: record,
          confirm: async (display: string) => {
            const approved = await reviewPublication(ctx, display);
            return approved && roots.archiveRoot === process.env.RESEARCH_ARCHIVE_ROOT &&
              roots.workRoot === process.env.RESEARCH_WORK_ROOT && roots.importRoot === process.env.RESEARCH_IMPORT_ROOT;
          },
        });
        ctx.ui.notify(publicationDisplay(JSON.stringify(result)), result.published === true ? 'info' : 'warning');
      } catch {
        // Do not overwrite a completed/partial side effect with a false setup-failure receipt.
        record(latestState ?? { status: 'validation_failed', accepted: false, committed: false, published: false });
        ctx.ui.notify('Publication stopped; inspect its last session receipt and local/remote state. No automatic retry.', 'warning');
      } finally { publicationActive = false; publicationController = undefined; }
    },
  });
  pi.on('session_start', (_event, ctx) => { current = ctx; researchHost.reset(); });
  pi.on('session_shutdown', () => { current = undefined; researchHost.reset(); publicationController?.abort(); });
  pi.on('session_tree', () => researchHost.reset());
  pi.on('session_compact', () => researchHost.reset());
  pi.on('message_start', (event, ctx) => { current = ctx; researchHost.delivered(event.message); });
  pi.events.on(MCP_TOOL_APPROVAL_REQUEST_EVENT, (request: McpToolApprovalRequest) => {
    if (request.originalToolName === 'start_research') {
      // Claim synchronously for EVERY alias, even with approveTools:false. All adapter paths share this state.
      request.claim(async () => {
        const decision = await researchHost.authorize(request, current);
        if (decision === 'deny') current?.ui.notify('Research denied before dispatch. Use research_request; a consumed request needs NEW scoped confirmation.', 'warning');
        return decision;
      });
      return;
    }
    if (request.originalToolName !== 'accept_research_draft') return;
    request.claim(async () => {
      const args = request.args;
      const ctx = current;
      const record = (state: string, digest?: string) => pi.appendEntry('research-local-acceptance', {
        state, reviewDigest: digest ?? null, proposalId: typeof args?.proposalId === 'string' ? args.proposalId : null,
      });
      // A model-supplied approved:true is never authorization. Do not dispatch in headless modes.
      if (!ctx || ctx.mode !== 'tui' || publicationActive || request.signal?.aborted || !args || typeof args !== 'object' ||
          Array.isArray(args) || Object.keys(args).sort().join(',') !== expectedKeys) {
        record('not_approved');
        return 'deny';
      }
      try {
        const target = await localResearchTarget(ctx.cwd, request.serverName);
        if (!target || request.signal?.aborted) {
          record('not_approved');
          return 'deny';
        }
        const archive = createArchive({
          archiveRoot: process.env.RESEARCH_ARCHIVE_ROOT,
          workRoot: process.env.RESEARCH_WORK_ROOT,
          importRoot: process.env.RESEARCH_IMPORT_ROOT,
          maxReadBytes: process.env.RESEARCH_READ_BYTES === undefined ? 2048 : Number(process.env.RESEARCH_READ_BYTES),
        });
        const { review } = await archive.reviewProposal({
          proposalId: args.proposalId, acceptedAt: args.acceptedAt, expectedBaseRevision: args.expectedBaseRevision,
        });
        if (args.expectedRevision !== review.expectedRevision ||
            args.expectedCatalogueRevision !== review.expectedCatalogueRevision ||
            args.expectedReviewDigest !== review.reviewDigest) {
          record('stale_review', review.reviewDigest);
          return 'deny';
        }
        const firstPage = await archive.readProposal({ proposalId: review.proposalId, expectedRevision: review.expectedRevision });
        const text = [
          'LOCAL ACCEPTANCE ONLY — UNPUBLISHED; no Git commit or push.',
          'Review the entire proposal through read_research before approval; this dialog shows only its first page.',
          `Archive: ${displayField(review.archiveRoot)}`,
          `New files: ${displayField(review.changedFiles.join(', '))}`,
          `Proposal: ${displayField(review.proposalId)}  revision: ${displayField(review.expectedRevision)}`,
          `Expected base: ${displayField(review.expectedBaseRevision ?? '(new report)')}`,
          `Catalogue before: ${displayField(review.expectedCatalogueRevision ?? '(new empty archive)')}`,
          `Reviewed report revision: ${displayField(review.reportRevision)}`,
          `Original body/source digest: ${displayField(review.sourceDigest)}`,
          `Review digest: ${displayField(review.reviewDigest)}`,
          `Acceptance date: ${displayField(review.acceptedAt)}`,
          `Title: ${displayField(firstPage.metadata.title)}`,
          `Question: ${displayField(firstPage.metadata.question)}`,
          `Scope: ${displayField(firstPage.metadata.scope)}`,
          `Summary: ${displayField(firstPage.metadata.summary)}`,
          `Origin: ${displayField(JSON.stringify(firstPage.metadata.origin))}; language: ${displayField(firstPage.metadata.language)}`,
          `Research date: ${displayField(firstPage.metadata.researched_at ?? 'unknown')}; latest improvement: ${displayField(firstPage.metadata.last_improved_at ?? 'unknown')}`,
          `Citation context on first page: ${displayField(JSON.stringify(firstPage.citations))}; later pages: read_research continuations`,
          firstPage.metadata.origin.kind === 'engine_generated'
            ? 'Engine-generated proposal: inspected evidence and selected dated references, not imported bytes. Structural checks and source access are NOT fresh claim verification; review evidence, limitations and source rights.'
            : 'Imported report: citations and source text stay byte-for-byte as imported; no new verification was performed.',
          `Relationships: ${displayField(JSON.stringify(firstPage.metadata.related_reports))}; superseded by: ${displayField(firstPage.metadata.superseded_by ?? '(none)')}`,
          `Warnings (all): ${displayField(JSON.stringify([...firstPage.metadata.warnings, ...firstPage.warnings]))}`,
          `Body first ${firstPage.content.endByte} of ${firstPage.content.totalBytes} bytes:\n${firstPage.content.text}`,
          'Accept exactly these new local files and this report revision?',
        ].join('\n');
        if (request.signal?.aborted || !await ctx.ui.confirm('Accept reviewed research locally?', displayCopy(text)) || request.signal?.aborted) {
          record('denied', review.reviewDigest);
          return 'deny';
        }
        // Revalidate immediately before adapter dispatch. The server checks again at application.
        const latest = (await archive.reviewProposal({ proposalId: review.proposalId,
          acceptedAt: review.acceptedAt, expectedBaseRevision: review.expectedBaseRevision })).review;
        const latestTarget = await localResearchTarget(ctx.cwd, request.serverName);
        if (request.signal?.aborted || !latestTarget || latestTarget.fingerprint !== target.fingerprint ||
            latest.reviewDigest !== review.reviewDigest) {
          record('stale_review', latest.reviewDigest);
          return 'deny';
        }
        record('approved_for_dispatch', review.reviewDigest);
        return 'allow_once'; // Never cache a blanket permission for later reports or calls.
      } catch {
        record('review_failed');
        return 'deny';
      }
    });
  });
}
