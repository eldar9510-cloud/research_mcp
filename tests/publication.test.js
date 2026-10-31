import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { createPublication, publicationDisplay, runPublicationGit } from '../src/publication.js';
import { publicationFixture, sensitiveCalls } from './publication-support.js';

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
