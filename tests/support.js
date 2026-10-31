import { mkdtemp, mkdir, copyFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export const fixture = name => resolve('tests', 'fixtures', name);
export const metadata = (id = 'orchard-water') => ({
  id, title: 'Orchard irrigation methods', question: 'Which watering method suits sandy orchard soil?',
  scope: 'Small orchard; sandy soil; original constraints beyond these are unknown.',
  summary: 'Compares one and two drip cycles, with a rejected alternative and limits.',
  researched_at: null, last_improved_at: null, language: 'en',
  origin: { kind: 'imported', platform: 'unknown', author: 'unknown', model: 'unknown' },
  related_reports: [], warnings: ['Original source-check dates were not supplied.'], superseded_by: null,
});
export async function roots(t) {
  const root = await mkdtemp(join(tmpdir(), 'research-mcp-issue2-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const archiveRoot = join(root, 'archive');
  const workRoot = join(root, 'work');
  const importRoot = join(root, 'imports');
  for (const path of [archiveRoot, workRoot, importRoot]) await mkdir(path);
  const path = join(importRoot, 'notes.md');
  await copyFile(fixture('field-notes.md'), path);
  return { root, archiveRoot, workRoot, importRoot, path, writeFile };
}
