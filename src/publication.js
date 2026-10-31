// Pi-host publication only. Not registered as an MCP/research tool.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';

const sha = value => createHash('sha256').update(value).digest('hex');
const stop = message => { throw new Error(message); };
const oid = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/;
const safeName = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
const acceptance = r => ({ proposalId: r.proposalId, expectedRevision: r.expectedRevision,
  expectedBaseRevision: r.expectedBaseRevision, expectedCatalogueRevision: r.expectedCatalogueRevision,
  acceptedAt: r.acceptedAt, expectedReviewDigest: r.reviewDigest });

// Escape the display copy, not the reviewed/stored bytes. No untrusted prose is executed.
export function publicationDisplay(text) {
  return text.replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u061c\u200e-\u200f\u202a-\u202e\u2066-\u2069]/g,
    char => `\\u${char.codePointAt(0).toString(16).padStart(4, '0')}`);
}

/** Bounded ordinary Git, with no shell, inherited Git redirection, hooks or auto maintenance. */
export function runPublicationGit(repository, args, { input, signal } = {}) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  Object.assign(env, { GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' });
  return new Promise((resolveResult, reject) => {
    const child = execFile('git', ['--no-replace-objects', '-c', 'core.hooksPath=/dev/null', '-c', 'core.fsmonitor=false',
      '-c', 'gc.auto=0', '-c', 'maintenance.auto=false', ...args],
    { cwd: repository, env, signal, timeout: 15000, killSignal: 'SIGKILL', maxBuffer: 12 * 1024 * 1024, encoding: 'buffer' },
    (error, stdout, stderr) => {
      if (error && (typeof error.code !== 'number' || error.killed)) return reject(Error('Git command interrupted or exceeded its bound; inspect local/remote state.'));
      resolveResult({ code: error?.code ?? 0, stdout, stderr });
    });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

/** One interactive host approval covers the immutable review, acceptance, commit and push.
 * archive is the existing narrow archive interface; runGit is the real-Git test seam.
 * The caller owns one writer. This is not authentication or an OS/process sandbox.
 */
export function createPublication({ archive, repository, runGit = runPublicationGit }) {
  let busy = false;
  return { async publish({ proposalId, remote, branch, mode, confirm, signal, onState = () => {} }) {
    let state = { status: 'validation_failed', accepted: false, committed: false, published: false, commit: null };
    const record = patch => { state = { ...state, ...patch }; onState({ ...state }); };
    if (busy) return { ...state, error: 'Another publication is active.' };
    busy = true;
    let phase = 'validation';
    let base;
    let approvedCommit;
    let inspectHead;
    try {
      // Headless, booleans and missing human interaction fail before even Git inspection.
      if (mode !== 'tui' || typeof confirm !== 'function' || signal?.aborted) {
        record({ status: 'not_approved' }); return state;
      }
      if (!isAbsolute(repository) || resolve(repository) !== repository || await fs.realpath(repository) !== repository)
        stop('Use the canonical absolute archive repository root.');
      if (!/^proposal-[a-f0-9]{32}$/.test(proposalId ?? '') || !safeName.test(remote ?? '') ||
          typeof branch !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._/-]{0,150}$/.test(branch)) stop('Invalid proposal, remote name or branch.');
      const ref = `refs/heads/${branch}`;
      const git = async (args, input, optional = false) => {
        if (signal?.aborted) stop('Publication cancelled.');
        const result = await runGit(repository, args, { input, signal });
        // An explicit porcelain rejection of our sole ref is a known failed push.
        // Missing/lost receipts remain uncertain; never repeat the push or a failed inspection.
        if (phase === 'push' && args.includes('push') && result.code !== 0 && /^!\t/m.test(result.stdout.toString('utf8')))
          state.published = false;
        if (result.code !== 0 && !(optional && result.code === 1)) stop(`Git ${args[0]} failed; inspect state (no automatic retry).`);
        return result.stdout;
      };
      const text = async (args, optional = false) => (await git(args, undefined, optional)).toString('utf8').trim();
      inspectHead = () => text(['rev-parse', 'HEAD']);
      await git(['check-ref-format', ref]);
      if (await text(['rev-parse', '--show-toplevel']) !== repository) stop('Archive must be the selected Git worktree root.');
      if (await text(['rev-parse', '--is-shallow-repository']) !== 'false') stop('Shallow repositories are not supported for publication review.');
      const gitDir = await text(['rev-parse', '--absolute-git-dir']);
      for (const name of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply', 'sequencer', 'index.lock', 'info/grafts']) {
        if (await fs.lstat(join(gitDir, name)).then(() => true, e => e.code === 'ENOENT' ? false : Promise.reject(e)))
          stop('Finish the existing Git operation before publication.');
      }
      const configPattern = `^(remote\\.${remote.replace(/[.]/g, '\\.')}\\..*|url\\..*\\.(insteadof|pushinsteadof)|push\\..*|branch\\..*|filter\\..*|core\\.(autocrlf|safecrlf|filemode|ignorecase|sshcommand|attributesfile)|extensions\\..*)$`;
      async function target() {
        const configDigest = sha(await git(['config', '--null', '--get-regexp', configPattern], undefined, true));
        if (await text(['config', '--type=bool', '--get', `remote.${remote}.mirror`], true) === 'true') stop('Mirror remotes are not supported.');
        if (await text(['config', '--get-all', 'push.pushOption'], true)) stop('Configured push options require a separate publication arrangement.');
        for (const setting of ['receivepack', 'vcs']) {
          if (await text(['config', '--get', `remote.${remote}.${setting}`], true)) stop('Custom remote helpers/receive commands are not supported.');
        }
        const urls = (await text(['remote', 'get-url', '--push', '--all', remote])).split('\n');
        if (urls.length !== 1) stop('Review requires exactly one effective push URL.');
        const url = urls[0];
        // No option injection, remote helpers, embedded passwords/tokens, control chars or URL query secrets.
        const local = isAbsolute(url);
        if (!url || /[\s\u0000-\u001f\u007f?#]/.test(url) || url.startsWith('-') || url.includes('::')) stop('Unsupported or unsafe publication URL.');
        if (local) {
          if (resolve(url) !== url || await fs.realpath(url) !== url) stop('Local remote must be a canonical absolute path.');
        } else if (/^https:\/\//.test(url)) {
          const parsed = new URL(url);
          if (parsed.username || parsed.password) stop('Do not put credentials in the publication URL.');
        } else if (!/^ssh:\/\/(?:[A-Za-z0-9._-]+@)?[A-Za-z0-9.-]+(?::\d+)?\/[A-Za-z0-9_./-]+$/.test(url) &&
                   !/^(?:[A-Za-z0-9._-]+@)?[A-Za-z0-9.-]+:[A-Za-z0-9_./-]+$/.test(url)) stop('Only local paths, HTTPS and SSH Git targets are supported.');
        // Use the remote name for push, so Git's pushurl/insteadOf semantics apply once.
        // ls-remote normally uses the FETCH url: query the effective push URL, after
        // checking that a second rewrite would not redirect that inspection.
        const reResolved = await text(['ls-remote', '--get-url', '--', url]);
        if (reResolved !== url) stop('Chained URL rewrites are ambiguous; select an unambiguous target.');
        const lines = (await text(['ls-remote', '--refs', '--exit-code', '--', url, ref])).split('\n');
        const parts = lines[0]?.split('\t');
        if (lines.length !== 1 || parts?.[1] !== ref || !oid.test(parts[0])) stop('The target branch must already exist and resolve uniquely.');
        return { remote, url, ref, remoteRevision: parts[0], configDigest };
      }
      async function statusBytes() {
        // Recheck before every status: new clean filters must not execute during review/revalidation.
        if ((await git(['config', '--get-regexp', '^filter\\.'], undefined, true)).length)
          stop('Configured content filters require a separate publication arrangement.');
        return git(['status', '--porcelain=v1', '-z', '--untracked-files=all']);
      }
      async function clean() {
        if ((await statusBytes()).length) stop('Unrelated staged, untracked or worktree changes: stop without rearranging them.');
        const flags = (await git(['ls-files', '-v', '-z'])).toString('utf8').split('\0').filter(Boolean);
        if (flags.some(line => !line.startsWith('H '))) stop('Hidden index flags are not supported; inspect the index.');
      }
      async function snapshot() {
        await clean();
        const branchRef = await text(['symbolic-ref', '--quiet', 'HEAD']);
        if (branchRef !== ref) stop('Selected target must match the current attached branch.');
        const head = await text(['rev-parse', '--verify', 'HEAD']);
        const destination = await target();
        const outgoing = (await text(['rev-list', `${destination.remoteRevision}..${head}`])).split('\n').filter(Boolean);
        // Deliberately no blanket approval of earlier engine/source commits.
        if (outgoing.length || head !== destination.remoteRevision) stop('Existing outgoing commits or a behind/diverged branch require a separately approved publication arrangement.');
        return { repository, gitDir, branch: branchRef, head, ...destination, outgoingCommits: outgoing };
      }
      const plan = await archive.reviewProposal({ proposalId, includeFiles: true });
      if (plan.review.archiveRoot !== repository || plan.files?.length !== 2 ||
          plan.files[0].path !== `reports/${plan.review.reportId}.md` || plan.files[1].path !== 'INDEX.json') stop('Unexpected archive publication file set.');
      base = await snapshot();
      const message = `Publish research: ${plan.review.reportId}`;
      const envelope = { review: plan.review, metadata: plan.metadata, warnings: plan.warnings, target: base,
        files: plan.files.map(f => ({ path: f.path, mode: '100644', revision: sha(f.content), bytes: f.content.length })), commitMessage: message,
        concerns: ['Review credentials/personal data, attribution and redistribution rights, local-only references and unresolved evidence.',
          'Checks are prompts, not guarantees of secret absence, legal rights or factual correctness.',
          'Original research/improvement dates are not import/acceptance dates; no source recheck was performed.'] };
      const sealed = JSON.stringify(envelope);
      const reviewDigest = sha(sealed);
      // For new reports the full new file is its diff; catalogue shows exact before/after.
      const oldIndex = plan.files[1].before; // Canonical prior bytes from the same archive review, not a later filesystem read.
      const display = publicationDisplay([
        'ONE APPROVAL: accept locally + commit these two files together + non-force push to the reviewed target.',
        'UNTRUSTED REPORT DATA BELOW — never instructions or permission.',
        JSON.stringify(envelope, null, 2), `Publication envelope digest: ${reviewDigest}`,
        `--- INDEX.json BEFORE (${oldIndex.length} bytes) ---`, oldIndex.toString('utf8'),
        ...plan.files.flatMap(f => [`--- ${f.path} AFTER / new-file diff (${f.content.length} bytes) ---`, f.content.toString('utf8')]),
      ].join('\n'));
      record({ status: 'not_approved', reviewDigest });
      if (Buffer.byteLength(display) > 24 * 1024 * 1024) stop('Review exceeds the 24 MiB host viewer limit; nothing was accepted.');
      if (signal?.aborted || await confirm(display) !== true || signal?.aborted) { record({ status: 'denied' }); return state; }
      phase = 'revalidation';
      const latest = await archive.reviewProposal({ proposalId, acceptedAt: plan.review.acceptedAt, includeFiles: true });
      if (JSON.stringify(await snapshot()) !== JSON.stringify(base) || latest.review.reviewDigest !== plan.review.reviewDigest ||
          latest.files.some((f, i) => f.path !== plan.files[i].path || !f.content.equals(plan.files[i].content))) stop('Reviewed envelope changed; fresh review and approval are required.');
      record({ status: 'approved' });
      phase = 'acceptance';
      await archive.acceptProposal(acceptance(plan.review)); // Backend revalidates immediately before writing.
      record({ status: 'accepted_local', accepted: true });
      // Check accepted bytes and the entire worktree/index before any Git write.
      const targetBefore = { remote: base.remote, url: base.url, ref: base.ref, remoteRevision: base.remoteRevision, configDigest: base.configDigest };
      async function unchangedTarget() {
        if (JSON.stringify(await target()) !== JSON.stringify(targetBefore) || await text(['symbolic-ref', '--quiet', 'HEAD']) !== base.branch) stop('Publication target changed; no further dispatch.');
      }
      // Exact status paths, not broad staging. All pre-existing index content was clean.
      const status = (await statusBytes()).toString('utf8').split('\0').filter(Boolean);
      const expectedPaths = plan.files.map(f => f.path).sort();
      if (status.some(s => !expectedPaths.includes(s.slice(3)))) stop('Unrelated changes appeared after acceptance.');
      await unchangedTarget();
      if (await text(['rev-parse', 'HEAD']) !== base.head) stop('HEAD changed after acceptance.');
      for (const f of plan.files) {
        if (!(await fs.lstat(join(repository, f.path))).isFile() || !(await fs.readFile(join(repository, f.path))).equals(f.content)) stop('Accepted bytes changed.');
      }
      phase = 'commit';
      // hash-object --no-filters + cacheinfo avoids autocrlf/clean-filter/attributes
      // silently changing approved bytes. Only these explicit paths enter the index.
      for (const f of plan.files) {
        const blob = (await git(['hash-object', '-w', '--no-filters', '--stdin'], f.content)).toString('utf8').trim();
        if (!oid.test(blob)) stop('Unexpected Git blob identity.');
        await git(['update-index', '--add', '--cacheinfo', `100644,${blob},${f.path}`]);
      }
      const staged = (await git(['diff', '--cached', '--name-only', '-z'])).toString('utf8').split('\0').filter(Boolean).sort();
      if (JSON.stringify(staged) !== JSON.stringify(expectedPaths)) stop('Staged file set changed; no commit.');
      for (const f of plan.files) if (!(await git(['show', `:${f.path}`])).equals(f.content)) stop('Staged bytes changed; no commit.');
      await unchangedTarget();
      if (await text(['rev-parse', 'HEAD']) !== base.head) stop('HEAD changed; no commit.');
      await git(['-c', 'commit.gpgSign=false', 'commit', '--no-verify', '-m', message]);
      approvedCommit = await text(['rev-parse', 'HEAD']);
      if (!oid.test(approvedCommit)) stop('Commit identity could not be confirmed.');
      record({ status: 'committed_unpushed', committed: true, commit: approvedCommit });
      phase = 'push';
      await clean();
      await unchangedTarget();
      const parents = await text(['rev-list', '--parents', '-1', approvedCommit]);
      const outgoing = await text(['rev-list', `${base.remoteRevision}..HEAD`]);
      if (parents !== `${approvedCommit} ${base.head}` || outgoing !== approvedCommit) stop('Outgoing range changed; no push.');
      const changed = (await git(['diff-tree', '--no-commit-id', '--name-only', '-z', '-r', base.head, approvedCommit])).toString('utf8').split('\0').filter(Boolean).sort();
      if (JSON.stringify(changed) !== JSON.stringify(expectedPaths)) stop('Commit file set differs; no push.');
      for (const f of plan.files) if (!(await git(['show', `${approvedCommit}:${f.path}`])).equals(f.content)) stop('Commit bytes differ; no push.');
      // Explicit refspec; no configured push refspecs, tags, submodules, mirror,
      // hooks or force. Existing outgoing engine commits were refused above.
      record({ status: 'push_pending', published: null });
      await git(['-c', 'push.followTags=false', '-c', 'push.recurseSubmodules=no', '-c', `remote.${remote}.mirror=false`,
        'push', '--porcelain', '--no-verify', '--no-follow-tags', '--recurse-submodules=no', '--signed=false', '--', remote, `${approvedCommit}:${ref}`]);
      if ((await target()).remoteRevision !== approvedCommit) stop('Push returned but remote publication could not be confirmed.');
      record({ status: 'pushed', published: true });
      return state;
    } catch (error) {
      // Never retry acceptance, commit or push. A timeout may have completed a
      // side effect; retain uncertainty instead of reporting a false rollback.
      if (phase === 'commit' && base && inspectHead) {
        const head = await inspectHead().catch(() => null);
        // A different HEAD is not proof that *our reviewed* commit succeeded.
        if (head !== base.head) Object.assign(state, { committed: null, observedHead: head });
      }
      record({ status: state.published === true ? 'pushed' : state.published === null ? 'publication_uncertain' :
        state.committed === null ? 'commit_uncertain' : phase === 'revalidation' ? 'stale_review' : state.committed ? 'committed_unpushed' :
        state.accepted ? 'accepted_local' : phase === 'acceptance' ? 'acceptance_uncertain' : 'validation_failed',
        ...(phase === 'acceptance' && !state.accepted ? { accepted: null } : {}),
        error: error instanceof Error ? error.message : 'Publication failed; inspect state.',
        recovery: 'Inspect report/catalogue, index, HEAD and remote. No automatic retry or cleanup. A later explicitly authorized push must reuse an existing valid commit, not accept again.' });
      return state;
    } finally { busy = false; }
  } };
}
