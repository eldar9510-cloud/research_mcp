import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';
import { createArchive, ArchiveError } from '../src/archive.js';
import { metadata, roots } from './support.js';

const acceptance = review => ({ proposalId: review.proposalId, expectedRevision: review.expectedRevision,
  expectedBaseRevision: review.expectedBaseRevision, expectedCatalogueRevision: review.expectedCatalogueRevision,
  acceptedAt: review.acceptedAt, expectedReviewDigest: review.reviewDigest });
const conflict = error => error instanceof ArchiveError && error.code === 'revision_conflict';

test('ordinary explicit notices survive selected reads and accepted discovery without metadata warnings', async t => {
  const notices = [
    'Superseded by [successor][next].\n',
    'Correction (2026-01-02): the earlier estimate is wrong; use [successor][next] instead.\n',
    '**This report has been superseded by [successor][next].**\n',
    'For readers of the earlier estimate:\nthis report has been superseded by [successor][next].\n',
  ];
  for (const [index, notice] of notices.entries()) await t.test(`notice ${index + 1}`, async t => {
    const r = await roots(t);
    const a = createArchive(r);
    const findings = '# Findings\nEarlier estimate: 10 units.\n';
    const text = notice + '\n' + findings + '\n[next]: https://example.org/corrected\n';
    const p = (await a.importReport({ text, metadata: { ...metadata(), warnings: [], superseded_by: null } })).proposal;
    const selection = { startByte: Buffer.byteLength(notice + '\n'), endByte: Buffer.byteLength(notice + '\n' + findings) };
    const check = page => {
      assert.equal(page.content.text, findings);
      assert.deepEqual(page.notices.map(n => n.text), [notice]);
      assert.equal(page.citations.find(c => c.label === 'next')?.target, 'https://example.org/corrected');
      assert.match(page.warningContext.successorContext[0].text, /\[successor\]\[next\]/);
      assert.deepEqual(page.metadata.warnings, []);
      assert.equal(page.metadata.superseded_by, null);
    };
    check(await a.readProposal({ proposalId: p.proposalId, expectedRevision: p.revision, selection }));
    const review = (await a.reviewProposal({ proposalId: p.proposalId })).review;
    await a.acceptProposal(acceptance(review));
    const found = (await a.searchReports({ query: 'orchard' })).candidates[0];
    assert.ok(found.warnings.some(w => w.code === 'body_notice'));
    assert.match(found.warningContext.successorContext[0].text, /\[successor\]\[next\]/);
    assert.equal(found.warningContext.read.expectedRevision, found.revision);
    const context = await a.readAccepted(found.warningContext.read);
    assert.equal(context.notices[0].text, notice);
    assert.equal(context.citations.find(c => c.label === 'next')?.target, 'https://example.org/corrected');
    check(await a.readAccepted({ reportId: found.id, expectedRevision: found.revision, selection }));
  });
});

test('ordinary notice text inside fenced, indented or inline code is not warning context', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const text = '```markdown\nSuperseded by [successor][next].\n```\n\n' +
    '    Correction (2026-01-02): use [successor][next] instead.\n\n' +
    'Example: `This report has been superseded by [successor][next].`\n\n[next]: https://example.org/next\n';
  const p = (await a.importReport({ text, metadata: { ...metadata(), warnings: [] } })).proposal;
  assert.deepEqual(p.notices, []);
  assert.equal(p.warningContext, null);
});

test('Setext correction sections retain substantive successor text/citations; code headings are not notices', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, maxReadBytes: 8192 });
  const notice = 'Correction\n==========\n\nDo not reuse the old result. Use [successor][next] instead.\n\n';
  const text = notice + 'Findings\n========\nOrdinary analysis.\n\n```markdown\n## Warning\n[missing]: https://example.org/code-only\n```\n' +
    'Ordinary analysis without a notice.\n'.repeat(1800) + '[next]: https://example.org/successor\n';
  const p = (await a.importReport({ text, metadata: { ...metadata(), warnings: [], superseded_by: null } })).proposal;
  const start = Buffer.byteLength(notice);
  const selected = await a.readProposal({ proposalId: p.proposalId, expectedRevision: p.revision,
    selection: { startByte: start, endByte: start + 8 } });
  assert.equal(selected.notices.length, 1);
  assert.equal(selected.notices[0].text, notice);
  assert.equal(selected.citations.find(c => c.label === 'next').target, 'https://example.org/successor');
  assert.ok(!selected.warningContext.successorContext[0].truncated);
  assert.match(selected.warningContext.successorContext[0].text, /Use \[successor\]\[next\] instead/);
  const review = (await a.reviewProposal({ proposalId: p.proposalId })).review;
  await a.acceptProposal(acceptance(review));
  const found = (await a.searchReports({ query: 'orchard' })).candidates[0];
  assert.ok(found.warnings.some(w => w.code === 'body_notice'));
  assert.equal(found.superseded_by, null, 'never invent an accepted relationship from prose');
  assert.match(found.warningContext.successorContext[0].text, /successor/);
  assert.equal(found.warningContext.read.expectedRevision, found.revision);
  const context = await a.readAccepted(found.warningContext.read);
  assert.equal(context.pageType, 'warning_context');
  assert.equal(context.notices[0].text, notice);
  assert.equal(context.citations.find(c => c.label === 'next').target, 'https://example.org/successor');
  assert.ok(Buffer.byteLength(JSON.stringify(found)) < 8192, 'discovery does not contain the whole report');
  const rebuilt = await a.rebuildCatalogue();
  assert.equal(rebuilt.catalogueRevision, (await a.searchReports({ query: 'orchard' })).catalogueRevision);
});

test('indented paragraph continuations retain resolved and unresolved citations through acceptance', async t => {
  const cases = [
    { name: 'four spaces', indent: '    ', prefix: 'This analysis is supported by\n' },
    { name: 'tab', indent: '\t', prefix: 'This analysis is supported by\n' },
    { name: 'reference-like paragraph text', indent: '    ', prefix: 'This analysis is supported by\n[description]: still paragraph text\n' },
    { name: 'prose after code', indent: '    ', prefix: '    code example\nThis analysis is supported by\n' },
  ];
  for (const { name, indent, prefix } of cases) await t.test(name, async t => {
    const r = await roots(t);
    const a = createArchive(r);
    const continuation = indent + '[claim][real] and [claim][missing].\n';
    const text = prefix + continuation + '\n[real]: https://example.org/evidence\n';
    const p = (await a.importReport({ text, metadata: metadata() })).proposal;
    const check = page => {
      assert.equal(page.citations.find(c => c.label === 'real')?.target, 'https://example.org/evidence');
      assert.equal(page.citations.find(c => c.label === 'missing')?.status, 'unresolved');
      assert.ok(page.warnings.some(w => w.code === 'unresolved_citation'));
    };
    check(p);
    assert.equal(p.content.text, text);
    const selection = { startByte: Buffer.byteLength(prefix), endByte: Buffer.byteLength(prefix + continuation) };
    const selected = await a.readProposal({ proposalId: p.proposalId, expectedRevision: p.revision, selection });
    check(selected);
    assert.equal(selected.content.text, continuation);
    const review = (await a.reviewProposal({ proposalId: p.proposalId })).review;
    await a.acceptProposal(acceptance(review));
    const found = (await a.searchReports({ query: 'orchard' })).candidates[0];
    assert.ok(found.warnings.some(w => w.code === 'unresolved_citation'));
    check(await a.readAccepted({ reportId: found.id, expectedRevision: found.revision, selection }));
  });
});

test('blank lines and non-paragraph blocks keep neighboring indented code excluded', async t => {
  const prefixes = [
    '', 'A paragraph.\n\n', '# Findings\n', 'Findings\n========\n', 'Findings\n--------\n',
    '---\n', '[support]: https://example.org/support\n', '```text\nexample\n```\n',
    '~~~text\nexample\n~~~\n', '    code block\n\n',
  ];
  const r = await roots(t);
  const a = createArchive(r);
  for (const [index, prefix] of prefixes.entries()) {
    const text = prefix + '    [claim][real] and [claim][missing].\n\n[real]: https://example.org/evidence\n';
    const p = (await a.importReport({ text, metadata: metadata(`code-boundary-${index}`) })).proposal;
    assert.deepEqual(p.citations, [], `indented code after ${JSON.stringify(prefix)}`);
    assert.ok(!p.warnings.some(w => w.code === 'unresolved_citation'), `code-only references after ${JSON.stringify(prefix)}`);
  }
  const text = 'This paragraph continues with\n    # Details\n    [missing]: https://example.org/not-a-definition\n' +
    '\nSee [claim][missing].\n';
  const p = (await a.importReport({ text, metadata: metadata('indented-syntax') })).proposal;
  assert.equal(p.citations.find(c => c.label === 'missing')?.status, 'unresolved', 'prose indentation cannot create a reference definition');
  assert.ok(p.warnings.some(w => w.code === 'unresolved_citation'));
});

test('punctuated full references resolve or diagnose missing evidence; fenced/indented definitions never resolve it', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, maxReadBytes: 8192 });
  const text = 'See [claim][real]: supports the result. See [claim][real](archived).\n' +
    'See [claim][missing]: unresolved. See [claim][indented] (archived).\n' +
    '~~~markdown\n[missing]: https://example.org/code-only\n~~~\n' +
    '    [indented]: https://example.org/indented-example\n[real]: https://example.org/real\n';
  const p = (await a.importReport({ text, metadata: metadata() })).proposal;
  assert.equal(p.citations.find(c => c.label === 'real').target, 'https://example.org/real');
  assert.equal(p.citations.find(c => c.label === 'missing').status, 'unresolved');
  assert.equal(p.citations.find(c => c.label === 'indented').status, 'unresolved');
  assert.ok(p.warnings.some(w => w.code === 'unresolved_citation'));
  const onlyMissing = (await a.importReport({ text: 'See [claim][missing]: supports the result.\n', metadata: metadata('missing-only') })).proposal;
  assert.ok(onlyMissing.warnings.some(w => w.code === 'unresolved_citation'), 'punctuation must not suppress the import diagnostic');
  const bom = (await a.importReport({ text: '\ufeff```markdown\n## Warning\n[missing]: https://example.org/code-only\n```\nSee [claim][missing].\n',
    metadata: metadata('bom-code') })).proposal;
  assert.deepEqual(bom.notices, [], 'a UTF-8 BOM does not turn code into a real warning heading');
  assert.equal(bom.citations.find(c => c.label === 'missing').status, 'unresolved');
  assert.ok(bom.content.text.startsWith('\ufeff'), 'the structural view never rewrites the original bytes');
});

test('multiline Setext notices and code-valued footnotes retain exact evidence context', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const notice = 'Correction\nto the earlier estimate\n=======================\n\nUse [successor][next] instead; inspect [^code].\n\n';
  const text = notice + '# Findings\nDated analysis.\n\n[next]: https://example.org/successor\n[^code]: `original code value`\n';
  const p = (await a.importReport({ text, metadata: metadata() })).proposal;
  assert.equal(p.notices[0].text, notice);
  assert.equal(p.citations.find(c => c.label === '^code').target, '`original code value`');
  await assert.rejects(a.readProposal({ proposalId: p.proposalId, warningOffset: 0 }), error => error.code === 'invalid_input');
  for (const warningOffset of [-1, 0.5, 1000]) await assert.rejects(a.readProposal({ proposalId: p.proposalId,
    expectedRevision: p.revision, warningOffset }), error => error.code === 'invalid_input');
});

test('supported Unicode metadata warnings survive acceptance/catalogue validation and deterministic rebuild intact', async t => {
  const r = await roots(t);
  const a = createArchive(r);
  const warning = 'é'.repeat(300);
  const p = (await a.importReport({ text: 'Dated evidence.', metadata: { ...metadata(), warnings: [warning] } })).proposal;
  const review = (await a.reviewProposal({ proposalId: p.proposalId })).review;
  const accepted = await a.acceptProposal(acceptance(review));
  const candidate = (await a.searchReports({ query: 'orchard' })).candidates[0];
  assert.equal(candidate.warnings.find(w => w.code === 'report_warning').message, warning);
  const page = await a.readAccepted({ reportId: candidate.id, expectedRevision: candidate.revision });
  assert.equal(page.warnings.find(w => w.code === 'report_warning').message, warning);
  assert.deepEqual(page.metadata.warnings, [warning]);
  assert.equal((await a.rebuildCatalogue()).catalogueRevision, accepted.catalogueRevision);
});

test('warning/body/citation/definition/search continuations all conflict after mutation, without changing stored source bytes', async t => {
  const r = await roots(t);
  const a = createArchive({ ...r, maxReadBytes: 8192 });
  const labels = Array.from({ length: 18 }, (_, i) => `ref${i}`);
  const notice = '## Correction\nUse [successor][next] instead. ' + labels.map(label => `[claim][${label}]`).join(' ') + '\n' +
    'Original correction context 😀 é\n'.repeat(1800);
  const text = '# Evidence\n[detail][long]\n' + 'dated evidence\n'.repeat(900) + notice + '## Sources\n' +
    labels.map(label => `[${label}]: https://example.org/${label}`).join('\n') + '\n[next]: https://example.org/successor\n' +
    '[long]: https://example.org/long ' + 'original long title '.repeat(40) + '\n';
  const p = (await a.importReport({ text, metadata: metadata() })).proposal;
  assert.equal(p.pageType, 'warning_context');
  assert.ok(p.continuation.referenceOffset > 0, 'first warning chunk has citation continuation');
  const body = await a.readProposal({ proposalId: p.proposalId, expectedRevision: p.revision, warningOffset: p.warningContext.totalChunks });
  assert.equal(body.pageType, 'body');
  const definition = body.citations.find(c => c.label === 'long').read;
  const proposalReads = [p.continuation, { ...p.continuation, referenceOffset: undefined, warningOffset: 1 }, body.continuation, definition];
  const file = join(r.workRoot, 'proposals', `${p.proposalId}.body`);
  assert.equal(await fs.readFile(file, 'utf8'), text);
  await fs.appendFile(file, 'mutation');
  for (const args of proposalReads) await assert.rejects(a.readProposal(args), conflict);
  await fs.writeFile(file, text);
  const review = (await a.reviewProposal({ proposalId: p.proposalId })).review;
  await a.acceptProposal(acceptance(review));
  const candidate = (await a.searchReports({ query: 'orchard' })).candidates[0];
  const warning = await a.readAccepted({ reportId: candidate.id, expectedRevision: candidate.revision });
  const acceptedBody = await a.readAccepted({ reportId: candidate.id, expectedRevision: candidate.revision, warningOffset: warning.warningContext.totalChunks });
  const acceptedDefinition = acceptedBody.citations.find(c => c.label === 'long').read;
  await fs.appendFile(join(r.archiveRoot, 'reports', `${candidate.id}.md`), 'mutation');
  for (const args of [warning.continuation, { ...warning.continuation, referenceOffset: undefined, warningOffset: 1 },
    acceptedBody.continuation, acceptedDefinition, candidate.warningContext.read,
    { reportId: candidate.id, expectedRevision: candidate.revision }]) await assert.rejects(a.readAccepted(args), conflict);
});
