import './research-tripwire.cjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive } from '../src/archive.js';
import { createPublication } from '../src/publication.js';
import { createResearch } from '../src/research.js';
import { publicationFixture, sensitiveCalls } from './publication-support.js';
import { runtime, adapter, steps, terminal } from './research-support.js';

const acceptance = r => ({ proposalId: r.proposalId, expectedRevision: r.expectedRevision, expectedBaseRevision: r.expectedBaseRevision,
  expectedCatalogueRevision: r.expectedCatalogueRevision, acceptedAt: r.acceptedAt, expectedReviewDigest: r.reviewDigest });

test('one declined then one approved scoped revision shows complete diff, pushes only reviewed files to LOCAL bare Git, and is rediscoverable fresh', async t => {
  const f = await publicationFixture(t, { body: '\ufeff# Findings\r\nOld evidence [S1].\r\n\r\n## Alternatives\r\nRetain useful alternative π.\r\n[S1]: https://example.org/old\r\n' });
  const base = await f.archive.acceptProposal(acceptance((await f.archive.reviewProposal({ proposalId: f.draft.proposalId })).review));
  await f.git(['add', '--', 'reports', 'INDEX.json']); await f.git(['-c', 'commit.gpgSign=false', 'commit', '-m', 'Accepted synthetic base']);
  await f.git(['push', '--', 'origin', 'HEAD:refs/heads/main']);
  const head = await f.git(['rev-parse', 'HEAD']), path = join(f.archiveRoot, 'reports', base.reportId + '.md');
  const prior = await fs.readFile(path), index = await fs.readFile(join(f.archiveRoot, 'INDEX.json'));
  const old = await f.archive.readAccepted({ reportId: base.reportId });
  const source = runtime(steps());
  const research = createResearch({ archive: f.archive, workRoot: f.workRoot, createDependencies: async () => ({ modelRuntime: source.runtime, adapter: adapter() }) });
  t.after(() => research.shutdown());
  const request = { mode: 'improve', question: old.metadata.question, scope: old.metadata.scope,
    references: [{ reportId: base.reportId, expectedRevision: base.revision, selection: { startByte: 0, endByte: 38 } }],
    improvement: { base: { reportId: base.reportId, expectedRevision: base.revision }, disposition: 'same_report', gaps: ['Add the missing accessible comparison.'], oldSourceChecks: [] } };
  const done = await terminal(research, research.start(request)); assert.equal(done.status, 'completed');
  const proposalId = done.outputs.proposal.proposalId;
  let diff = await f.archive.readProposalDiff({ proposalId }), complete = '', count = 0;
  while (true) {
    assert.ok(++count < 100); assert.ok(Buffer.byteLength(JSON.stringify(diff)) < 48 * 1024);
    complete += diff.content.text; if (!diff.continuation) break;
    diff = await f.archive.readProposalDiff(diff.continuation);
  }
  for (const text of ['BEFORE', 'AFTER', 'INDEX.json', 'last_improved_at', 'origin', 'related_reports', 'Source', 'Scoped'])
    assert.ok(complete.toLowerCase().includes(text.toLowerCase()), text);
  const publication = createPublication({ archive: f.observedArchive, repository: f.archiveRoot, runGit: f.runGit });
  let reviews = 0, display;
  const args = { ...f.publishArgs, proposalId, confirm: async text => { reviews++; display = text; return false; } };
  const denied = await publication.publish(args); assert.equal(denied.status, 'denied');
  assert.deepEqual(await fs.readFile(path), prior); assert.deepEqual(await fs.readFile(join(f.archiveRoot, 'INDEX.json')), index);
  assert.equal(await f.git(['rev-parse', 'HEAD']), head); assert.equal(await f.git(['rev-parse', 'main'], f.remoteRoot), head);
  assert.equal(f.accepts, 0); assert.deepEqual(sensitiveCalls(f.calls), []);
  assert.ok(display.includes('COMPLETE CHANGE DIFF') && display.includes('reports/publication-fixture.md BEFORE'));
  const published = await publication.publish({ ...args, confirm: async () => { reviews++; return true; } });
  assert.equal(published.status, 'pushed', JSON.stringify(published)); assert.equal(reviews, 2); assert.equal(f.accepts, 1);
  assert.equal(f.calls.filter(c => c.includes('push')).length, 1);
  assert.equal(await f.git(['rev-parse', 'HEAD^']), head);
  assert.equal(await f.git(['rev-parse', 'main'], f.remoteRoot), published.commit);
  assert.equal(await f.git(['show', `${head}:reports/publication-fixture.md`]), prior.toString('utf8').trim());
  const remote = await f.git(['show', `${published.commit}:reports/publication-fixture.md`], f.remoteRoot);
  assert.match(remote, /\[S1\]: https:\/\/example.org\/old/); assert.match(remote, /\[I[a-f0-9]+-S1\]: https:\/\/www.w3.org/);
  const fresh = createArchive(f), found = await fresh.searchReports({ query: 'inclusive design disabled' });
  assert.equal(found.candidates[0].id, base.reportId);
  const read = await fresh.readAccepted({ reportId: base.reportId, expectedRevision: found.candidates[0].revision });
  assert.equal(read.metadata.researched_at, null); assert.deepEqual(read.metadata.origin, old.metadata.origin);
  assert.match(JSON.stringify(read.notices), /unchecked/);
});
