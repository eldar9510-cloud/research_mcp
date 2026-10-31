// Project-local Pi host gate for the installed pi-mcp-adapter proxy, direct and script paths.
// Project trust and the adapter must both be enabled; raw MCP clients are trusted local software.
import { createArchive } from '../../src/archive.js';
import { lstat, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';
// The adapter documents this versioned shared-event channel; no global Pi config is changed.
const MCP_TOOL_APPROVAL_REQUEST_EVENT = 'pi-mcp-adapter:tool-approval-request';
type McpToolApprovalRequest = {
  serverName: string; originalToolName: string; args: Record<string, unknown>;
  signal?: AbortSignal; claim: (handler: () => Promise<'allow_once' | 'deny'>) => boolean;
};

const expectedKeys = ['acceptedAt', 'expectedBaseRevision', 'expectedCatalogueRevision',
  'expectedReviewDigest', 'expectedRevision', 'proposalId'].sort().join(',');
const serverScript = fileURLToPath(new URL('../../src/stdio.js', import.meta.url));

// The broker identifies the server by alias but does not expose its transport
// configuration. Only claim acceptance for an explicitly configured local stdio
// target bound to the same roots as the independent host review. Unknown
// aliases, other transports and project Pi overrides fail closed.
async function matchesLocalTarget(cwd: string, serverName: string): Promise<boolean> {
  try {
    const configPath = join(cwd, '.mcp.json');
    if ((await lstat(configPath)).isSymbolicLink()) return false;
    try { await lstat(join(cwd, '.pi', 'mcp.json')); return false; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') return false; }
    const config = JSON.parse(await readFile(configPath, 'utf8'));
    const server = config?.mcpServers?.[serverName];
    if (!server || typeof server !== 'object' || Array.isArray(server) ||
        Object.keys(server).some(key => !['command', 'args', 'env', 'lifecycle', 'approveTools', 'directTools', 'toolPrefix'].includes(key)) ||
        !['node', process.execPath].includes(server.command) ||
        !Array.isArray(server.args) || server.args.length !== 1 || server.args[0] !== serverScript ||
        (server.lifecycle !== undefined && server.lifecycle !== 'lazy') ||
        !server.env || typeof server.env !== 'object' || Array.isArray(server.env)) return false;
    const env = server.env as Record<string, unknown>;
    const required = ['RESEARCH_ARCHIVE_ROOT', 'RESEARCH_WORK_ROOT', 'RESEARCH_IMPORT_ROOT'];
    const allowed = [...required, 'RESEARCH_READ_BYTES', 'RESEARCH_SEARCH_LIMIT'];
    if (Object.keys(env).some(key => !allowed.includes(key))) return false;
    if (!required.every(key => typeof process.env[key] === 'string' && resolve(process.env[key]) === process.env[key] &&
      (env[key] === process.env[key] || env[key] === '${' + key + '}'))) return false;
    return ['RESEARCH_READ_BYTES', 'RESEARCH_SEARCH_LIMIT'].every(key =>
      env[key] === undefined || (typeof env[key] === 'string' &&
        (env[key] === '${' + key + '}' ? process.env[key] !== undefined : /^\d+$/.test(env[key]))));
  } catch { return false; }
}

// Pi's installed confirmation selector passes text to pi-tui Text, which
// preserves ANSI. Escape controls in the *display copy* only; never alter
// stored source bytes or the digest that is reviewed before/after confirmation.
function displayCopy(text: string): string {
  return text.replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,
    char => `\\u${char.codePointAt(0)!.toString(16).padStart(4, '0')}`);
}
const displayField = (value: unknown) => displayCopy(String(value)).replace(/\n/g, '\\n');

export default function (pi: ExtensionAPI) {
  let current: ExtensionContext | undefined;
  pi.on('session_start', (_event, ctx) => { current = ctx; });
  pi.on('session_shutdown', () => { current = undefined; });
  pi.events.on(MCP_TOOL_APPROVAL_REQUEST_EVENT, (request: McpToolApprovalRequest) => {
    if (request.originalToolName !== 'accept_research_draft') return;
    request.claim(async () => {
      const args = request.args;
      const ctx = current;
      const record = (state: string, digest?: string) => pi.appendEntry('research-local-acceptance', {
        state, reviewDigest: digest ?? null, proposalId: typeof args?.proposalId === 'string' ? args.proposalId : null,
      });
      // A model-supplied approved:true is never authorization. Do not dispatch in headless modes.
      if (!ctx || ctx.mode !== 'tui' || request.signal?.aborted || !args || typeof args !== 'object' ||
          Array.isArray(args) || Object.keys(args).sort().join(',') !== expectedKeys) {
        record('not_approved');
        return 'deny';
      }
      try {
        if (!await matchesLocalTarget(ctx.cwd, request.serverName) || request.signal?.aborted) {
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
          'New report: citations and source text stay byte-for-byte as imported; no new verification was performed.',
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
        if (request.signal?.aborted || !await matchesLocalTarget(ctx.cwd, request.serverName) ||
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
