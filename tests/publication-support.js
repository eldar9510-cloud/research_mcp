import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive } from '../src/archive.js';
import { runPublicationGit } from '../src/publication.js';
import { metadata, roots } from './support.js';

// All remotes created here are disposable, absolute LOCAL directories.
export async function publicationFixture(t, options = {}) {
  const r = await roots(t);
  const remoteRoot = join(r.root, 'remote.git');
  const git = async (args, cwd = r.archiveRoot) => {
    const result = await runPublicationGit(cwd, args);
    assert.equal(result.code, 0, `fixture Git ${args[0]} failed`);
    return result.stdout.toString('utf8').trim();
  };
  await git(['init', '-b', 'main']);
  await git(['config', 'user.name', 'Offline fixture']);
  await git(['config', 'user.email', 'fixture@example.invalid']);
  await fs.writeFile(join(r.archiveRoot, 'README.md'), 'Disposable publication fixture.\n');
  await git(['add', '--', 'README.md']);
  await git(['-c', 'commit.gpgSign=false', 'commit', '-m', 'Fixture base']);
  await fs.mkdir(remoteRoot);
  await git(['init', '--bare', '-b', 'main'], remoteRoot);
  await git(['remote', 'add', 'origin', remoteRoot]);
  await git(['push', '--', 'origin', 'HEAD:refs/heads/main']);
  const head = await git(['rev-parse', 'HEAD']);
  const archive = createArchive({ ...r, ...options, now: () => '2026-11-03T11:22:33.456Z' });
  const body = options.body ?? 'Research π\r\nSource [s][missing].\nReview /mnt/local-only and attribution.\n';
  const draft = (await archive.importReport({ text: body, metadata: metadata('publication-fixture') })).proposal;
  const calls = [];
  const states = [];
  let accepts = 0;
  const observedArchive = { ...archive, acceptProposal: async args => { accepts++; return archive.acceptProposal(args); } };
  const runGit = async (cwd, args, settings) => {
    calls.push([...args]);
    return runPublicationGit(cwd, args, settings);
  };
  return { ...r, remoteRoot, git, head, archive, observedArchive, body, draft, calls, states, runGit,
    get accepts() { return accepts; },
    publishArgs: { proposalId: draft.proposalId, remote: 'origin', branch: 'main', mode: 'tui',
      confirm: async () => true, onState: state => states.push(state) },
  };
}

export const sensitiveCalls = calls => calls.filter(args => args.includes('update-index') || args.includes('commit') ||
  args.includes('push') || (args.includes('hash-object') && args.includes('-w')));
