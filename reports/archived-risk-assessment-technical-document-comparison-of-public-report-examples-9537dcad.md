---
{
  "format": 1,
  "metadata": {
    "id": "archived-risk-assessment-technical-document-comparison-of-public-report-examples-9537dcad",
    "title": "Risk-assessment technical document — comparison of public report examples",
    "question": "What findings, alternatives and limitations does the historical investigation document about Risk-assessment technical document — comparison of public report examples?",
    "scope": "Historical risk-assessment/ISO GUI source and design study: Risk-assessment technical document — comparison of public report examples. Original normative/private-source boundaries, planning status, exact revision references and unresolved questions are retained.",
    "summary": "Source/reasoning and interaction research for Risk-assessment technical document — comparison of public report examples. Distinguishes planned GUI behavior, source meaning and actual implementation; not an adopted method or validated machine result.",
    "researched_at": "2026-10-30",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Prior inventory classification (not a completion verification): draft / not owner-approved",
      "Private or licensed book/standard/study sources are referenced, not supplied as assets. Publication covers the report analysis only; it does not grant readers access to those sources or relicense them."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:40.949Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "local_dependency",
      "message": "Local file reference may not be portable; review before publication."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "9537dcadca0dfdb0c9c2ad33c9de540a2a5b7791bc9abfb87a7fc3492493912a",
  "proposalRevision": "c5247915d3ff9f557e1c473c0a8c80a0724ad7299159600301af8d553993c33b"
}
---
# Risk-assessment technical document — comparison of public report examples

Research date: 2026-10-30. Status: presentation research, **not an implemented or owner-approved new layout**. Owner distinguishes the delivered agent working/review report from the technical assessment document. No renderer, maintained assessment, numerical method, context baseline or approval state changed.

## Conclusion

The strongest useful pattern is **controlled front matter + repeatable hazardous-situation sheets + referenced supporting evidence**. The main document explains the machine, the hazards considered, the risk-reduction decisions and the resulting state. It should not require the reader to reconstruct those decisions from an agent execution history or many repeated registers.

This is not a claim that a single template or page orientation is mandatory. A report can be long and still be well structured. Conversely, a short table is not adequate just because it looks professional. Engineering assumptions, factor-selection reasons, evidence limitations and unresolved work must remain legible. A technically structured **draft** is possible; formatting must not present proposed measures as implemented protection.

## Sources inspected and what they actually show

### 1. IBF / Safexpert — primary vendor description and guide

- https://www.ibf-solutions.com/en/software-risk-assessment
- https://www.ibf-solutions.com/fileadmin/dateidownloads/safexpert-easy-user-kurzanleitung-en.pdf

The current website's “All completed? Checks and reports” section distinguishes completeness filtering from printouts for internal documentation, customers and authorities. It describes clear reports, configurable corporate presentation, and separate residual-risk exports. Documentation is described as the result of engineering analysis/decisions, not an additional administrative process.

The first readable fetch captured only the FAQ; the **raw HTML** was therefore checked for the main reporting sections. The quick-start guide was read in extracted form: pp.3–5 machine limits, hazard zone/life phase and descriptions; pp.5–6 individual Risk IN / measure / Risk OUT and further measures based on the preceding result; pp.6–7 report-template selection and preview. Page7 explicitly describes an **INCOMPLETE watermark**, customised print template and RTF/Excel exports. Pages7–8 separately describe progress/team views. This is direct evidence for separating authoring/review use from document output without creating a second assessment.

Vendor claims about compliance or ease of assessment are not independent assurance. Its reference to a TR-based template does not make that template obligatory or its method our method.

### 1b. Owner-supplied Safexpert8.1 full manual — stronger structural evidence

https://www.quad-industry.com/titan_img/leuze/pdf/UM_SAFEXPERT_en_600663.pdf

Local reference saved at the owner's request: `source/Safexpert_8.1_User_Manual_en_600663.pdf` (201pages,11043883bytes; SHA256 `799275a73beeff8db389f0a3c7f1aece7fe6acbf78588e0f8ebfba7651cd6414`). The existing `/source/` and PDF ignore rules keep it out of Git publication; no index scope was expanded. PDF metadata reports creation/modification in December2011, underscoring its historical status.

201page manual hosted by a distributor. Web extraction truncated at page100, **before the key print/report chapters**. Parent therefore downloaded the public PDF and extracted all201pages locally, then read the relevant sections below. Physical/printed page numbers agree for these inspected sections; page121 was additionally checked visually. This is old-version product documentation, not current law/standards authority.

| Section / pages | Inspected product behaviour | Presentation implication |
| --- | --- | --- |
| 5.1.1–5.1.2, p.42 | Machine particulars feed cover sheets; assessment starts with use/spatial/time/other limits | Controlled machine-specific front matter |
| 6.2.3, pp.56–59 | Flexible tabular exports are read-only; data must be changed in the risk-assessment window | Different outputs of one maintained assessment, not separately edited truth |
| 7.6, pp.73–74 | Technical-file compilation is a separate checklist with file/directory references | Assessment report is not the entire technical file |
| 8.2.2–8.2.3, pp.87–89 | Hazard at a location/lifecycle phase, then measures documented step by step | Hazardous-situation sheets, not disconnected measure catalogues |
| 8.2.3.2–8.2.3.4, pp.89–91 | Numerical IN/OUT estimates optional; sufficient-reduction judgement separate; author/time in printout; changing measure order may affect IN/OUT | Preserve rationale and accountable conclusions; do not confuse arithmetic with adequacy or erase responsible assessment dates |
| 8.2.3.10, p.97 | Standards or individual sections attached to each measure | Put supporting provisions beside the measure, not only in a global bibliography |
| 8.2.3.11, pp.97–99 | Separate notes-for-instructions report and template assignment; exported texts explicitly need further technical-author editing | Assessment, IFU handoff and finished handbook are distinct |
| 8.2.4, pp.100–101 | Views by hazard, location, lifecycle, cross-reference or AnnexI; explicitly not extra assessment steps | Select a readable document order without rebuilding the assessment |
| 10.1.2, pp.114–115 | Images at hazard locations/measures, inline or appendices; thumbnail/endnote/filename references when full-size attachment needed | Keep pictures readable and traceable; do not shrink important geometry into an unreadable table cell |
| 10.2, pp.115–120 | Contextual reports and central batch printing; PDF/Excel/RTF/TXT; consecutive pagination; CE-guide reports can carry INCOMPLETE watermark | Document-oriented composition and explicit status, not merely printing every screen panel |
| 10.3, p.121 | Separate templates for cover, standards, risk assessment, risk assessment including standards, pictograms, parts, instruction notes, technical-file checklist, history, tasks, protocols and declarations | **Direct evidence that the assessment report is not identical to the complete project/status/history dump** |
| 13.1.5, pp.164–165 | System reports can be copied/customised; report families selected by function | Content selection has a purpose; no single mandatory layout |

Especially important: p.121 separates **Risk assessment**, **History**, **Overview: Tasks** and **Project status**, but p.91 still retains who assessed the risk and when in the risk-assessment printout. Therefore “remove operational logs” must not mean “remove engineering accountability.” The manual's completion checkbox is a software workflow mechanism, not proof of implemented/verified protection for this project.

### 2. Actual Safexpert printout — third-party-hosted older vendor output

https://isb-ik.com/wp-content/uploads/2021/06/beispiel_safexpert.pdf

One physical PDF page, labelled **Safexpert8.1, page9/50**. Both extracted text and rendered page inspected. This is an old sample hosted by ISB, not proof of the current product's exact default output.

Observed layout:
- Landscape, repeated ruled blocks and restrained grey section headings.
- Life phase, hazard location, hazard type, then a full-width hazardous-situation description.
- Narrow **Risk IN** factor columns at left; a broad numbered protective-measure column in the middle; narrow **Risk OUT** columns at right.
- Standards/images/files associated with measures; measure-type codes; a separate “risk adequately reduced” decision and name/date fields.
- Consecutive measure rows under the same situation, not a disconnected global measure catalogue.
- Page number, software/version and reporting view/filter in the footer.

Useful inspiration: the spatial relationship between hazard, measure and change in risk. Do not import its factor codes, PL/SIL fields, PPE treatment, numerical reductions or adequacy decisions as our rules.

### 3. MinRisk / TEG — primary provider's actual machine report

https://minrisk.io/wp-content/uploads/2022/03/The-MinRisk-App-Sample-Machine-Risk-Assessment-Report.pdf

Nine physical PDF pages including cover/promotional material. Extraction returned almost no report-body text, so **physical pages2–5 were rendered and visually inspected** (printed report pages1–4).

Observed layout:
- Machine/assessment identity, scope and exclusions, operating tasks, existing controls, energy/isolation information and overview photographs together on the opening sheet.
- Repeated hazard sheets: concise event/consequence description; raw-risk parameters; annotated photographs/figures; controls table with description, existing/required status, photo references and relevant standard; current and future estimates together.
- Stable tabular structure and page/date footers rather than app panels.

Important limitation: the example explicitly limits scope to the operational lifecycle and excludes some surrounding hazards. It is an existing-equipment assessment example, **not evidence that such exclusions suit a complete manufacturer assessment**. Its numerical matrix, colours, budget column, standards, clearances, emergency-stop suggestions and PL values are not adopted. “Future” is a useful presentation distinction, not proof of achieved risk reduction.

### 4. Hydraulic log-splitter assessment — primary training-provider sample

https://ce-kennzeichnung-seminare.de/downloads/Beispiel-Risikobeurteilung-Spaltmaschine.pdf

16page dated29January2016 sample. Extracted document read; physical page11 visually inspected.
- Page1 project/manufacturer/date/author and related documents.
- Page2 applied standards; pp.3–8 method/functional-safety material.
- Pages9–10 use/spatial/time/other limits, misuse, persons and qualifications.
- Pages11–16 repeated landscape table: item, life phase, hazard description, initial factors, protective measures, resulting factors and control-system references.

Useful evidence of document hierarchy and repeatable hazard worksheets. **Not a model engineering solution**: old editions and numerical/severity changes require their own justification; we do not adopt them. Its inclusion of PL calculations is not a reason to bring external functional-safety calculations into our engine.

### 5. Safety Software — primary vendor's modern generated example

https://safetysoftware.eu/pdf/iso-12100-risk-assessment-example.pdf

50page carton-erecting/case-sealing example. Extracted front matter, method and several detailed hazard sections inspected, not every page visually audited.
- Identity cover, summary, intended use/misuse, machine limits, standards, method/scales, then detailed scenario/risk/reduction/residual-risk blocks.
- It also exposes repeated event-trace entries and extensive repeated standards/measure prose. This is a useful **counterexample to assuming a polished export automatically makes a concise engineering document**.

No independent validation of its blanket acceptance statements, harmonisation labels, HRN thresholds, assumed effects or claimed verification. Those are not source authority for this project's Suva method. The sequence/order and information categories are the presentation evidence, not its safety conclusions.

### 6. Official technical-file content — boundary, not a template

https://www.legislation.gov.uk/uksi/2008/1597/schedule/2/part/7/made

The fetched page explicitly identifies itself as the **original/as-made** UK implementation text. AnnexVII partA1(a) lists risk-assessment documentation showing the procedure followed, applicable essential health and safety requirements, implemented protective measures and residual risks. It separately lists drawings, calculations/test evidence, standards/specifications and instructions within the larger technical file.

This supports the distinction **risk-assessment document ≠ entire technical file ≠ instructions ≠ declaration**. It is not a present-day jurisdiction/applicability determination. Direct EUR-Lex readable retrieval failed; Pilz pages returned403; SICK guide retrieval failed DNS. Search snippets from those routes are not treated as fully inspected primary documents.

Existing local standards-content research remains in [risk-assessment-report-standards.md](../../archive/superseded-before-defined-machine-2026-10-30/docs/research/risk-assessment-report-standards.md), including the clause7 “should” qualification. Its historical renderer-status paragraphs are not current software status. No new Jespen/ISO/TR22100 interpretation is made in this research.

## Recommended document structure — design synthesis, not a prescribed standard

1. **Controlled cover and revision record**: title, machine/model/configuration, report number/revision/date, author/reviewer and actual status; identify draft/incomplete status prominently.
2. **Machine description and assessment boundaries**: intended use, foreseeable misuse, persons, operating/lifecycle tasks, spatial/time/other limits, interfaces and clearly scoped exclusions. Include an overview drawing with hazard-zone identifiers when available.
3. **Assessment basis**: method and factor legend once, applicable source editions/requirements, key assumptions and limitations. Describe the relationship between risk estimation and the separate adequacy judgement; no colour-based automatic acceptance.
4. **Hazard/coverage index**: stable IDs and location/lifecycle references; concise navigation and coverage/exclusion information, not hundreds of internal engine questions.
5. **Hazardous-situation sheets — the document's core**: all important engineering reasoning for that situation in one readable sequence (see below).
6. **Residual risks and information for use**: trace to hazard and measure IDs; distinguish what belongs in instructions/marking/training/inspection from the engineering assessment itself.
7. **Outstanding technical requirements and assessment conclusion**: what is established, what remains conditional/unverified, and what is required before a conclusion can be made. No unconditional “safe” conclusion created by the template.
8. **Supporting references/appendices**: evidence index, drawings, test/validation report references, standards applicability and concise revision/review record. Retain authoritative engineering detail; keep operational agent audit logs outside the main reading flow.

### Suggested repeated hazardous-situation sheet

```
H-xx — [hazardous situation / location]
Machine configuration | life phase / task / state | exposed persons
Hazard source → hazardous event → harm
Photo / drawing and reference (when relevant and actually available)

Initial risk: selected factors, concise rationale, evidence and uncertainty

No. | Before | Individual protective measure / intended function | After
    |        | Basis, dependencies, implementation/verification references |
M1  | ...    | ...                                                | ...
M2  | ...    | ...                                                | ...

Adequacy judgement and reasons — separate from calculated classification
Residual risk / information-for-use references
Unresolved technical conditions and external verification
Assessment/review responsibility, date and status
```

Use our existing Suva values and evidence/authority states, not the vendors' scales. Each row should make the required behaviour and its effect understandable; a citation alone does not replace explanation. A future conditional result is labelled as such. Where no supported result exists, display unknown/withheld rather than a favourable number. Shared verified background is not reset or counted twice; alternatives are not consecutive adopted measures.

Landscape hazard sheets are a plausible PDF choice, supported by the inspected examples, **not a mandatory A4 landscape rule**. Use controlled continuation sheets where necessary rather than shrinking text or forcing one hazard into one page. Repeat column headings and hazard/configuration identifiers; include report revision and page numbers. Narrative front matter can use portrait pages. Keep the method legend once rather than repeating a large risk matrix for every estimate; a compact classification and linked factor rationale may communicate more clearly.

## Difference from the delivered agent-review report

Keep the current review report useful for conducting the work. For a future technical-document view, derive a coherent document from the **same maintained assessment**. Do not create another engine, maintained truth store or workflow. This research does not authorise implementation or select a separate export architecture.

Keep in the main technical document: meaningful selection rationale, assumptions, implemented-versus-proposed distinctions, supported before/after states, adequacy reasoning, source/evidence references, residual risks and material unresolved conditions.

Move out of its main body (retain in audit/review records): model/provider/task identifiers, tool receipts, repeated raw records, generic internal question catalogues, cancelled/rejected attempt transcripts and operational execution history. A material rejected alternative or decision history may still deserve a concise engineering explanation. Evidence references and revision history must remain traceable; “clean” must not mean selectively concealing contrary evidence.

The real improvement is **a coherent engineering record rather than a database/workflow dump**, not merely a shorter PDF or stronger claims of completion.

## Evidence and scope

Parent used web search/fetch across multiple sites, checked the IBF raw page when readable extraction was incomplete, downloaded public sample PDFs solely for visual inspection, and inspected the page images identified above. Files retained privately under `/tmp/risk-technical-report-research-20261030/`; extracted public text under `/tmp/pi-web-pdf/`. Public samples are not added to version control. At the owner's later explicit request, the Safexpert manual alone was preserved in the existing ignored `source/` directory, as identified above. No supplied local standards were uploaded.

A separate Sol6.1/medium synthesis inspected supplied sample extracts/images (not independently browsed websites) and agreed on the hazard-sheet/document distinction; its bounded note is `/tmp/risk-technical-report-research-20261030/independent-synthesis.md`. The full owner-supplied manual was subsequently inspected by the parent as described above.

No software tests were needed/run; no report implementation, live assessment, engineering validation, specialist promotion or safety approval occurred. Prior software verification remains historical evidence for unchanged code. The owner has described the delivered report as useful for agent-driven assessment/review, not accepted it as a technical-document layout.
