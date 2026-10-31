// Project-local Pi host gate for the installed pi-mcp-adapter proxy, direct and script paths.
// Project trust and the adapter must both be enabled; raw MCP clients are trusted local software.
import { createArchive } from '../../src/archive.js';
import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
// The adapter documents this versioned shared-event channel; no global Pi config is changed.
const MCP_TOOL_APPROVAL_REQUEST_EVENT = 'pi-mcp-adapter:tool-approval-request';
type McpToolApprovalRequest = {
  serverName: string; originalToolName: string; args: Record<string, unknown>;
  signal?: AbortSignal; claim: (handler: () => Promise<'allow_once' | 'deny'>) => boolean;
};

const expectedKeys = ['acceptedAt', 'expectedBaseRevision', 'expectedCatalogueRevision',
  'expectedReviewDigest', 'expectedRevision', 'proposalId'].sort().join(',');

export default function (pi: ExtensionAPI) {
  let current: ExtensionContext | undefined;
  pi.on('session_start', (_event, ctx) => { current = ctx; });
  pi.on('session_shutdown', () => { current = undefined; });
  pi.events.on(MCP_TOOL_APPROVAL_REQUEST_EVENT, (request: McpToolApprovalRequest) => {
    if (request.serverName !== 'research_import' || request.originalToolName !== 'accept_research_draft') return;
    request.claim(async () => {
      const args = request.args;
      const ctx = current;
      const record = (state: string, digest?: string) => pi.appendEntry('research-local-acceptance', {
        state, reviewDigest: digest ?? null, proposalId: typeof args.proposalId === 'string' ? args.proposalId : null,
      });
      // A model-supplied approved:true is never authorization. Do not dispatch in headless modes.
      if (!ctx || ctx.mode !== 'tui' || request.signal?.aborted || Object.keys(args).sort().join(',') !== expectedKeys) {
        record('not_approved');
        return 'deny';
      }
      try {
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
          `Archive: ${review.archiveRoot}`,
          `New files: ${review.changedFiles.join(', ')}`,
          `Proposal: ${review.proposalId}  revision: ${review.expectedRevision}`,
          `Expected base: ${review.expectedBaseRevision ?? '(new report)'}`,
          `Catalogue before: ${review.expectedCatalogueRevision ?? '(new empty archive)'}`,
          `Reviewed report revision: ${review.reportRevision}`,
          `Original body/source digest: ${review.sourceDigest}`,
          `Review digest: ${review.reviewDigest}`,
          `Acceptance date: ${review.acceptedAt}`,
          `Title: ${firstPage.metadata.title}`,
          `Question: ${firstPage.metadata.question}`,
          `Scope: ${firstPage.metadata.scope}`,
          `Summary: ${firstPage.metadata.summary}`,
          `Origin: ${JSON.stringify(firstPage.metadata.origin)}; language: ${firstPage.metadata.language}`,
          `Research date: ${firstPage.metadata.researched_at ?? 'unknown'}; latest improvement: ${firstPage.metadata.last_improved_at ?? 'unknown'}`,
          `Citation context on first page: ${JSON.stringify(firstPage.citations)}; later pages: read_research continuations`,
          'New report: citations and source text stay byte-for-byte as imported; no new verification was performed.',
          `Relationships: ${JSON.stringify(firstPage.metadata.related_reports)}; superseded by: ${firstPage.metadata.superseded_by ?? '(none)'}`,
          `Warnings (all): ${JSON.stringify([...firstPage.metadata.warnings, ...firstPage.warnings])}`,
          `Body first ${firstPage.content.endByte} of ${firstPage.content.totalBytes} bytes:\n${firstPage.content.text}`,
          'Accept exactly these new local files and this report revision?',
        ].join('\n');
        if (request.signal?.aborted || !await ctx.ui.confirm('Accept reviewed research locally?', text) || request.signal?.aborted) {
          record('denied', review.reviewDigest);
          return 'deny';
        }
        // Revalidate immediately before adapter dispatch. The server checks again at application.
        const latest = (await archive.reviewProposal({ proposalId: review.proposalId,
          acceptedAt: review.acceptedAt, expectedBaseRevision: review.expectedBaseRevision })).review;
        if (latest.reviewDigest !== review.reviewDigest) {
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
