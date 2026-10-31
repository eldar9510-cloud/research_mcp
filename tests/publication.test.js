import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { createPublication, publicationDisplay, runPublicationGit } from '../src/publication.js';
import { publicationFixture, sensitiveCalls } from './publication-support.js';
import { metadata } from './support.js';

// Git's implicit HOME config is isolated too; no credentials/global config read or changed.
const home = await mkdtemp(join(tmpdir(), 'publication-home-'));
const previousHome = process.env.HOME;
process.env.HOME = home;
test.after(async () => { process.env.HOME = previousHome; await fs.rm(home, { recursive: true, force: true }); });
const publisher = (f, runGit = f.runGit) => createPublication({ archive: f.observedArchive, repository: f.archiveRoot, runGit });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

for (const change of [{ mode: 'print' }, { mode: 'rpc' }, { mode: 'json' }, { confirm: true }, { confirm: async () => false }]) {
  test(`no sensitive dispatch without a human host decision: ${JSON.stringify(change)}`, async t => {
    const f = await publicationFixture(t);
    const result = await publisher(f).publish({ ...f.publishArgs, ...change });
    assert.equal(result.accepted, false);
    assert.equal(f.accepts, 0);
    assert.deepEqual(sensitiveCalls(f.calls), []);
    if (change.mode || change.confirm === true) assert.deepEqual(f.calls, []);
    assert.equal(await f.git(['rev-parse', 'HEAD']), f.head);
    assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), f.head);
  });
}

test('one immutable review -> exact two-file commit and successful actual local bare push', async t => {
  const f = await publicationFixture(t);
  // Git conversion settings cannot alter reviewed/staged blobs.
  await f.git(['config', 'core.autocrlf', 'true']);
  const original = (await f.archive.reviewProposal({ proposalId: f.draft.proposalId, includeFiles: true }));
  let dialogs = 0;
  const result = await publisher(f).publish({ ...f.publishArgs, confirm: async display => {
    dialogs++;
    for (const text of ['ONE APPROVAL', 'sourceDigest', 'expectedBaseRevision', 'catalogueRevision', 'outgoingCommits',
      'researched_at', 'related_reports', 'warnings', f.remoteRoot, 'refs/heads/main', 'INDEX.json BEFORE', 'reports/publication-fixture.md AFTER'])
      assert.ok(display.includes(text), text);
    assert.ok(display.includes(f.body.replace(/\r/g, '\\u000d')));
    return true;
  } });
  assert.equal(dialogs, 1);
  assert.equal(f.accepts, 1);
  assert.equal(result.status, 'pushed');
  assert.equal(result.accepted, true);
  assert.equal(result.committed, true);
  assert.equal(result.published, true);
  assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), result.commit);
  const paths = (await f.git(['diff-tree', '--no-commit-id', '--name-only', '-r', result.commit])).split('\n').sort();
  assert.deepEqual(paths, ['INDEX.json', 'reports/publication-fixture.md']);
  for (const file of original.files) {
    const stored = await fs.readFile(join(f.archiveRoot, file.path));
    assert.ok(stored.equals(file.content));
    const remote = await runPublicationGit(f.remoteRoot, ['show', `${result.commit}:${file.path}`]);
    assert.ok(remote.stdout.equals(file.content));
  }
  assert.equal(sha(await fs.readFile(join(f.archiveRoot, 'INDEX.json'))), original.review.catalogueRevision);
  assert.equal((await f.archive.rebuildCatalogue()).catalogueRevision, original.review.catalogueRevision);
  assert.equal(f.calls.filter(a => a.includes('push')).length, 1);
});

for (const setting of ['pushurl', 'insteadof', 'pushinsteadof']) {
  test(`effective ${setting} destination is reviewed and actually pushed, not the fetch URL`, async t => {
    const f = await publicationFixture(t);
    if (setting === 'pushurl') {
      await f.git(['remote', 'set-url', 'origin', f.archiveRoot]);
      await f.git(['config', 'remote.origin.pushurl', f.remoteRoot]);
    } else {
      await f.git(['remote', 'set-url', 'origin', 'fixture-publication:archive']);
      await f.git(['config', `url.${f.remoteRoot}.${setting}`, 'fixture-publication:archive']);
    }
    const result = await publisher(f).publish({ ...f.publishArgs, confirm: async display => {
      assert.ok(display.includes(`\"url\": \"${f.remoteRoot}\"`)); return true;
    } });
    assert.equal(result.status, 'pushed');
    assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), result.commit);
    assert.equal(f.accepts, 1);
  });
}

for (const kind of ['untracked', 'worktree', 'staged', 'outgoing']) {
  test(`unrelated ${kind} refuses before approval/accept/Git writes; preserves content`, async t => {
    const f = await publicationFixture(t);
    const path = join(f.archiveRoot, kind === 'worktree' ? 'README.md' : 'unrelated.txt');
    await fs.writeFile(path, 'Unrelated user work\n');
    if (kind === 'staged' || kind === 'outgoing') await f.git(['add', '--', 'unrelated.txt']);
    if (kind === 'outgoing') await f.git(['-c', 'commit.gpgSign=false', 'commit', '-m', 'Unpushed engine code']);
    let prompts = 0;
    const result = await publisher(f).publish({ ...f.publishArgs, confirm: async () => { prompts++; return true; } });
    assert.equal(result.status, 'validation_failed');
    assert.equal(prompts, 0);
    assert.equal(f.accepts, 0);
    assert.deepEqual(sensitiveCalls(f.calls), []);
    assert.equal(await fs.readFile(path, 'utf8'), 'Unrelated user work\n');
    assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), f.head);
  });
}

for (const mutation of ['proposal', 'catalogue', 'target', 'branch', 'new-outgoing', 'filter']) {
  test(`${mutation} mutation during confirmation invalidates the envelope before sensitive dispatch`, async t => {
    const f = await publicationFixture(t);
    const result = await publisher(f).publish({ ...f.publishArgs, confirm: async () => {
      if (mutation === 'proposal') await fs.appendFile(join(f.workRoot, 'proposals', `${f.draft.proposalId}.body`), 'changed');
      if (mutation === 'catalogue') await f.archive.rebuildCatalogue();
      if (mutation === 'target') await f.git(['remote', 'set-url', '--push', 'origin', f.archiveRoot]);
      if (mutation === 'branch') await f.git(['switch', '-c', 'other']);
      if (mutation === 'new-outgoing') await f.git(['-c', 'commit.gpgSign=false', 'commit', '--allow-empty', '-m', 'Unapproved']);
      if (mutation === 'filter') await f.git(['config', 'filter.unreviewed.clean', 'false']);
      return true;
    } });
    assert.equal(result.status, 'stale_review');
    assert.equal(f.accepts, 0);
    assert.deepEqual(sensitiveCalls(f.calls), []);
    assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), f.head);
  });
}

for (const when of ['before-review', 'during-confirmation']) {
  test(`symbolic remote destination ${when} refuses without sensitive dispatch`, async t => {
    const f = await publicationFixture(t);
    await f.git(['update-ref', 'refs/heads/other', f.head], f.remoteRoot);
    const makeSymbolic = async () => {
      await f.git(['symbolic-ref', 'refs/heads/main', 'refs/heads/other'], f.remoteRoot);
      // Actual Git advertises the alias even when both branches have the same OID.
      assert.match(await f.git(['ls-remote', '--symref', '--refs', '--', f.remoteRoot, 'refs/heads/main']),
        /^ref: refs\/heads\/other\trefs\/heads\/main\n/);
    };
    if (when === 'before-review') await makeSymbolic();
    let prompts = 0;
    const result = await publisher(f).publish({ ...f.publishArgs, confirm: async display => {
      prompts++;
      assert.ok(display.includes('refs/heads/main'));
      assert.ok(!display.includes('refs/heads/other'));
      await makeSymbolic();
      return true;
    } });
    assert.equal(result.status, when === 'before-review' ? 'validation_failed' : 'stale_review');
    assert.equal(prompts, when === 'before-review' ? 0 : 1);
    assert.equal(f.accepts, 0);
    assert.deepEqual(sensitiveCalls(f.calls), []);
    assert.equal(await f.git(['rev-parse', 'HEAD']), f.head);
    for (const branch of ['main', 'other'])
      assert.equal(await f.git(['rev-parse', `refs/heads/${branch}`], f.remoteRoot), f.head);
  });
}

test('symbolic destination cannot hide behind configured legacy Git protocol', async t => {
  const f = await publicationFixture(t);
  await f.git(['config', 'protocol.version', '0']);
  await f.git(['update-ref', 'refs/heads/other', f.head], f.remoteRoot);
  await f.git(['symbolic-ref', 'refs/heads/main', 'refs/heads/other'], f.remoteRoot);
  let prompts = 0;
  const result = await publisher(f).publish({ ...f.publishArgs, confirm: async () => { prompts++; return true; } });
  assert.equal(result.status, 'validation_failed');
  assert.equal(prompts, 0);
  assert.equal(f.accepts, 0);
  assert.deepEqual(sensitiveCalls(f.calls), []);
  assert.equal(await f.git(['rev-parse', 'refs/heads/other'], f.remoteRoot), f.head);
});

test('target inspection without negotiated protocol v2 fails closed before approval', async t => {
  const f = await publicationFixture(t);
  let prompts = 0;
  const result = await publisher(f, (cwd, args, opts) => {
    // Actual Git v0 omits non-HEAD symrefs. Exercise the same missing-handshake
    // failure as a legacy-server fallback, without a network or custom helper.
    return f.runGit(cwd, args.includes('ls-remote') && args.includes('--symref') ? ['-c', 'protocol.version=0', ...args] : args, opts);
  }).publish({ ...f.publishArgs, confirm: async () => { prompts++; return true; } });
  assert.equal(result.status, 'validation_failed');
  assert.match(result.error, /protocol v2/);
  assert.equal(prompts, 0);
  assert.equal(f.accepts, 0);
  assert.deepEqual(sensitiveCalls(f.calls), []);
  assert.equal(await f.git(['rev-parse', 'HEAD']), f.head);
  assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), f.head);
});

for (const when of ['accepted', 'staged', 'committed']) {
  test(`symbolic destination on ${when} revalidation preserves honest partial state`, async t => {
    const f = await publicationFixture(t);
    await f.git(['update-ref', 'refs/heads/other', f.head], f.remoteRoot);
    let accepted = false;
    let committed = false;
    let staged = false;
    let mutated = false;
    const result = await publisher(f, async (cwd, args, opts) => {
      if (!mutated && args.includes('ls-remote') && !args.includes('--get-url') &&
          (when === 'accepted' ? accepted : when === 'staged' ? staged : committed)) {
        mutated = true;
        await f.git(['symbolic-ref', 'refs/heads/main', 'refs/heads/other'], f.remoteRoot);
      }
      const value = await f.runGit(cwd, args, opts);
      if (args.includes('update-index') && args.at(-1).endsWith(',INDEX.json')) staged = true;
      return value;
    }).publish({ ...f.publishArgs, onState: state => { accepted = state.accepted === true; committed = state.committed === true; } });
    assert.equal(mutated, true);
    assert.equal(result.status, when === 'committed' ? 'committed_unpushed' : 'accepted_local');
    assert.equal(result.accepted, true);
    assert.equal(result.committed, when === 'committed');
    assert.equal(result.published, false);
    assert.equal(f.accepts, 1);
    assert.equal(f.calls.filter(args => args.includes('push')).length, 0);
    assert.equal(f.calls.filter(args => args.includes('commit')).length, when === 'committed' ? 1 : 0);
    if (when === 'accepted') assert.deepEqual(sensitiveCalls(f.calls), []);
    for (const branch of ['main', 'other'])
      assert.equal(await f.git(['rev-parse', `refs/heads/${branch}`], f.remoteRoot), f.head);
  });
}

async function acceptPriorReport(f) {
  const proposal = (await f.archive.importReport({ text: 'Separate previously accepted report.\n', metadata: metadata('prior-accepted') })).proposal;
  const { review } = await f.archive.reviewProposal({ proposalId: proposal.proposalId });
  await f.archive.acceptProposal({ proposalId: proposal.proposalId, expectedRevision: review.expectedRevision,
    expectedBaseRevision: review.expectedBaseRevision, expectedCatalogueRevision: review.expectedCatalogueRevision,
    expectedReviewDigest: review.reviewDigest, acceptedAt: review.acceptedAt });
  return review;
}

async function assertCompleteRemoteCatalogue(f, commit) {
  const result = await runPublicationGit(f.remoteRoot, ['show', `${commit}:INDEX.json`]);
  assert.equal(result.code, 0);
  const { entries } = JSON.parse(result.stdout);
  const paths = (await f.git(['ls-tree', '-r', '--name-only', commit, '--', 'reports'], f.remoteRoot)).split('\n').sort();
  assert.deepEqual(paths, entries.map(entry => entry.path).sort());
  for (const entry of entries) {
    const blob = await runPublicationGit(f.remoteRoot, ['show', `${commit}:${entry.path}`]);
    assert.equal(blob.code, 0);
    assert.equal(blob.stdout.length, entry.size);
    assert.equal(sha(blob.stdout), entry.revision);
  }
}

test('ignored prior local acceptance cannot hitchhike as a missing catalogue report', async t => {
  const f = await publicationFixture(t);
  await fs.writeFile(join(f.archiveRoot, '.gitignore'), 'reports/\nINDEX.json\n');
  await f.git(['add', '--', '.gitignore']);
  await f.git(['-c', 'commit.gpgSign=false', 'commit', '-m', 'Fixture ignored collection']);
  await f.git(['push', '--', 'origin', 'HEAD:refs/heads/main']);
  const base = await f.git(['rev-parse', 'HEAD']);
  await acceptPriorReport(f);
  const priorReport = await fs.readFile(join(f.archiveRoot, 'reports/prior-accepted.md'));
  const priorIndex = await fs.readFile(join(f.archiveRoot, 'INDEX.json'));
  assert.equal(await f.git(['status', '--porcelain=v1', '--untracked-files=all']), '');
  let prompts = 0;
  const result = await publisher(f).publish({ ...f.publishArgs, confirm: async () => { prompts++; return true; } });
  assert.equal(result.status, 'validation_failed');
  assert.equal(prompts, 0);
  assert.equal(f.accepts, 0);
  assert.deepEqual(sensitiveCalls(f.calls), []);
  assert.equal(await f.git(['rev-parse', 'HEAD']), base);
  assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), base);
  assert.deepEqual((await f.git(['ls-tree', '-r', '--name-only', base], f.remoteRoot)).split('\n'), ['.gitignore', 'README.md']);
  assert.ok((await fs.readFile(join(f.archiveRoot, 'reports/prior-accepted.md'))).equals(priorReport));
  assert.ok((await fs.readFile(join(f.archiveRoot, 'INDEX.json'))).equals(priorIndex));
  await assert.rejects(fs.stat(join(f.archiveRoot, 'reports/publication-fixture.md')), { code: 'ENOENT' });
});

for (const corrupt of [false, true]) {
  test(`${corrupt ? 'digest-mismatched' : 'valid'} prior tracked report is checked against the complete candidate tree`, async t => {
    const f = await publicationFixture(t);
    const prior = await acceptPriorReport(f);
    if (corrupt) {
      const path = join(f.archiveRoot, 'reports/prior-accepted.md');
      const bytes = await fs.readFile(path);
      const changed = Buffer.from(bytes.toString('utf8').replace('Separate previously', 'Tampered previously'));
      assert.equal(changed.length, bytes.length);
      await fs.writeFile(path, changed);
      // The local catalogue's ordinary size/mtime checks alone cannot catch this.
      await fs.utimes(path, prior.reportMtimeMs / 1000, prior.reportMtimeMs / 1000);
    }
    await f.git(['add', '--', 'INDEX.json', 'reports/prior-accepted.md']);
    await f.git(['-c', 'commit.gpgSign=false', 'commit', '-m', 'Fixture prior tracked report']);
    await f.git(['push', '--', 'origin', 'HEAD:refs/heads/main']);
    const base = await f.git(['rev-parse', 'HEAD']);
    let prompts = 0;
    const result = await publisher(f).publish({ ...f.publishArgs, confirm: async () => { prompts++; return true; } });
    if (corrupt) {
      assert.equal(result.status, 'validation_failed');
      assert.equal(prompts, 0);
      assert.equal(f.accepts, 0);
      assert.deepEqual(sensitiveCalls(f.calls), []);
      assert.equal(await f.git(['rev-parse', 'HEAD']), base);
      assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), base);
      await assert.rejects(fs.stat(join(f.archiveRoot, 'reports/publication-fixture.md')), { code: 'ENOENT' });
    } else {
      assert.equal(result.status, 'pushed');
      assert.equal(prompts, 1);
      assert.equal(f.accepts, 1);
      assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), result.commit);
      assert.deepEqual((await f.git(['diff-tree', '--no-commit-id', '--name-only', '-r', result.commit])).split('\n').sort(),
        ['INDEX.json', 'reports/publication-fixture.md']);
      await assertCompleteRemoteCatalogue(f, result.commit);
    }
  });
}

test('cancelled confirmation and boolean return spoof cannot authorize dispatch', async t => {
  for (const spoof of [true, false]) {
    const f = await publicationFixture(t);
    const controller = new AbortController();
    const result = await publisher(f).publish({ ...f.publishArgs, signal: controller.signal,
      confirm: async () => { if (!spoof) controller.abort(); return spoof ? { approved: true } : true; } });
    assert.equal(result.accepted, false);
    assert.equal(f.accepts, 0);
    assert.deepEqual(sensitiveCalls(f.calls), []);
  }
});

test('commit failure preserves accepted report/catalogue and staged paths; never pushes or retries', async t => {
  const f = await publicationFixture(t);
  const result = await publisher(f, async (cwd, args, opts) => {
    if (args.includes('commit')) { f.calls.push(args); return { code: 1, stdout: Buffer.alloc(0) }; }
    return f.runGit(cwd, args, opts);
  }).publish(f.publishArgs);
  assert.equal(result.status, 'accepted_local');
  assert.equal(result.accepted, true);
  assert.equal(result.committed, false);
  assert.equal(result.published, false);
  assert.equal(f.accepts, 1);
  assert.equal(f.calls.filter(a => a.includes('commit')).length, 1);
  assert.equal(f.calls.filter(a => a.includes('push')).length, 0);
  assert.equal(await f.git(['rev-parse', 'HEAD']), f.head);
  assert.deepEqual((await f.git(['diff', '--cached', '--name-only'])).split('\n').sort(), ['INDEX.json', 'reports/publication-fixture.md']);
});

test('actual local bare receive rejection leaves one existing local commit, no retry/duplicate acceptance', async t => {
  const f = await publicationFixture(t);
  await f.git(['config', 'receive.maxInputSize', '1'], f.remoteRoot);
  const result = await publisher(f).publish(f.publishArgs);
  assert.equal(result.status, 'committed_unpushed');
  assert.equal(result.accepted, true);
  assert.equal(result.committed, true);
  assert.equal(result.published, false);
  assert.ok(result.commit);
  assert.equal(await f.git(['rev-parse', 'HEAD']), result.commit);
  assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), f.head);
  assert.equal(f.accepts, 1);
  assert.equal(f.calls.filter(a => a.includes('push')).length, 1);
});

test('commit command interruption after changing HEAD is uncertain, not assumed to be the approved commit', async t => {
  const f = await publicationFixture(t);
  const result = await publisher(f, async (cwd, args, opts) => {
    const value = await f.runGit(cwd, args, opts);
    if (args.includes('commit')) throw Error('simulated lost completion receipt');
    return value;
  }).publish(f.publishArgs);
  assert.equal(result.status, 'commit_uncertain');
  assert.equal(result.committed, null);
  assert.ok(result.observedHead);
  assert.equal(result.commit, null);
  assert.equal(f.calls.filter(a => a.includes('push')).length, 0);
});

test('lost push receipt with unavailable inspection preserves uncertainty and never repeats push', async t => {
  const f = await publicationFixture(t);
  let pushed = false;
  const result = await publisher(f, async (cwd, args, opts) => {
    if (pushed && args.includes('ls-remote')) throw Error('inspection unavailable');
    const value = await f.runGit(cwd, args, opts);
    if (args.includes('push')) { pushed = true; throw Error('lost push completion receipt'); }
    return value;
  }).publish(f.publishArgs);
  assert.equal(result.status, 'publication_uncertain');
  assert.equal(result.published, null);
  assert.equal(result.committed, true);
  assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), result.commit);
  assert.equal(f.calls.filter(a => a.includes('push')).length, 1);
});

test('acceptance interruption is honest, and never stages/commits/pushes uncertain archive writes', async t => {
  const f = await publicationFixture(t, { writeCheckpoint: where => { if (where === 'before_index') throw Error('interrupted'); } });
  const result = await publisher(f).publish(f.publishArgs);
  assert.equal(result.status, 'acceptance_uncertain');
  assert.equal(result.accepted, null);
  assert.equal(result.committed, false);
  assert.deepEqual(sensitiveCalls(f.calls), []);
  assert.ok((await fs.stat(join(f.archiveRoot, 'reports/publication-fixture.md'))).isFile());
});

for (const setting of ['mirror', 'pushoptions', 'multiple-targets', 'hidden-index', 'filter']) {
  test(`unsupported Git semantics (${setting}) refuse before consent`, async t => {
    const f = await publicationFixture(t);
    if (setting === 'mirror') await f.git(['config', 'remote.origin.mirror', 'true']);
    if (setting === 'pushoptions') await f.git(['config', 'push.pushOption', 'unreviewed']);
    if (setting === 'multiple-targets') {
      await f.git(['config', '--add', 'remote.origin.pushurl', f.remoteRoot]);
      await f.git(['config', '--add', 'remote.origin.pushurl', f.archiveRoot]);
    }
    if (setting === 'hidden-index') await f.git(['update-index', '--assume-unchanged', 'README.md']);
    if (setting === 'filter') await f.git(['config', 'filter.fixture.clean', 'false']);
    let prompts = 0;
    const result = await publisher(f).publish({ ...f.publishArgs, confirm: async () => { prompts++; return true; } });
    assert.equal(result.status, 'validation_failed');
    assert.equal(prompts, 0);
    assert.equal(f.accepts, 0);
    assert.deepEqual(sensitiveCalls(f.calls), []);
  });
}

for (const mutation of ['accepted-bytes', 'accepted-target', 'unrelated-after-accept', 'commit-content', 'extra-outgoing']) {
  test(`${mutation} after partial execution stops the next sensitive step and preserves work`, async t => {
    const f = await publicationFixture(t);
    let changed = false;
    let committed = false;
    let accepted = false;
    const result = await publisher(f, async (cwd, args, opts) => {
      const shouldChange = !changed && (mutation.startsWith('commit-') || mutation === 'extra-outgoing' ? committed : accepted);
      if (shouldChange) {
        changed = true;
        if (mutation === 'accepted-bytes' || mutation === 'commit-content') await fs.appendFile(join(f.archiveRoot, 'reports/publication-fixture.md'), 'unreviewed');
        if (mutation === 'accepted-target') await f.git(['remote', 'set-url', '--push', 'origin', f.archiveRoot]);
        if (mutation === 'unrelated-after-accept') await fs.writeFile(join(f.archiveRoot, 'unrelated.txt'), 'user work');
        if (mutation === 'extra-outgoing') await f.git(['-c', 'commit.gpgSign=false', 'commit', '--allow-empty', '-m', 'Unapproved outgoing']);
      }
      return f.runGit(cwd, args, opts);
    }).publish({ ...f.publishArgs, onState: state => { accepted = state.accepted === true; committed = state.committed === true; } });
    assert.equal(changed, true);
    assert.equal(result.accepted, true);
    assert.equal(result.published, false);
    assert.equal(f.calls.filter(a => a.includes('push')).length, 0);
    assert.equal(f.calls.filter(a => a.includes('commit')).length, mutation.startsWith('commit-') || mutation === 'extra-outgoing' ? 1 : 0);
    assert.equal(await f.git(['rev-parse', 'refs/heads/main'], f.remoteRoot), f.head);
    assert.equal(f.accepts, 1);
  });
}

test('aborted host request never even inspects Git', async t => {
  const f = await publicationFixture(t);
  const controller = new AbortController(); controller.abort();
  const result = await publisher(f).publish({ ...f.publishArgs, signal: controller.signal });
  assert.equal(result.status, 'not_approved');
  assert.equal(f.accepts, 0);
  assert.deepEqual(f.calls, []);
});

test('display copy neutralizes terminal/bidi controls without changing exact source data', () => {
  const raw = '\x1b[2J\x07\u009b\u061c\u200e\u200f\u202e\nπ';
  const shown = publicationDisplay(raw);
  assert.ok(!/[\x00-\x09\x0b-\x1f\x7f-\x9f\u061c\u200e\u200f\u202e]/.test(shown));
  assert.match(shown, /\\u001b\[2J/);
  assert.ok(shown.endsWith('\nπ'));
});
