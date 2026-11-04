---
{
  "format": 1,
  "metadata": {
    "id": "iec-62444-detailed-research-2026-11-02",
    "title": "IEC 62444 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 62444?",
    "scope": "Detailed IEC 62444 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
    "summary": "Research produced by a separate Terra 6.1 worker at configured medium effort. Original report, result and source ledger preserved. Content analysis and NORMATIVE comparison are deferred.",
    "researched_at": "2026-11-02",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi via Mastra",
      "author": "unknown",
      "model": "openai-codex/gpt-6.1-terra"
    },
    "related_reports": [],
    "warnings": [
      "Unreviewed research stored for later analysis. Not an authoritative standard text, technical approval, certification or legal determination.",
      "Author source limits, partial findings and edition qualifications remain in the report and appended result/source ledger. No batch content analysis or NORMATIVE comparison was performed for this import.",
      "Configured worker effort was medium. Earlier bounded checks on initial reports are historical collection notes, not comprehensive publication or normative verification.",
      "Third-party sources retain their rights. Raw evidence is private; storage is not permission to publish licensed standards or supplier material.",
      "The raw REPORT.md is preserved unchanged as the prefix. A mechanical storage appendix adds the original author result/source ledger and explicit supplied citation definitions; it is not new research."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T18:17:00.000Z",
    "updated_at": "2026-11-04T18:17:00.000Z",
    "imported_at": "2026-11-02T23:50:29.147Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "ef95f256f8f6b99bb0267bc706ea11468bacf1947c71aa1c71f1cd230f7cabb2",
  "proposalRevision": "64f9f2ca31315b07e5e6d44a9e8fd3343fdffbf89a53754b28d09d8e1f1fff0b"
}
---
# IEC 62444 — cable glands for electrical installations

**Evidence checked:** 2026-11-02 UTC. **Finding:** IEC 62444 is a product construction and performance standard for complete cable glands, not an installation or machine-safety certification. Scope and publication are supported by the IEC catalogue; detailed test procedures are not established because full text and a usable preview were not available. This report is a research aid, not a conformity verdict.

## Identity and publication

The [IEC catalogue](https://webstore.iec.ch/en/publication/7034) identifies **IEC 62444:2010, Cable glands for electrical installations**, edition 1.0, published 19 August 2010, as an International Standard, status **Published**. The IEC's [public catalogue search API](https://webstore-search-api.iec.ch/api/search), queried for 62444 with the published-status-only filter disabled, returned this single exact-number publication and no related IEC publication or lifecycle amendment. This supports calling it the published IEC edition found on the check date, not a guarantee that no draft, unindexed amendment or national development exists. The IEC page also lists a 2017 IECEE test-report form; that is a report form, not a new edition of the standard. [S1, S2]

The historical local batch claims EN 62444:2013. A [standards retailer](https://www.en-standard.eu/bs-en-62444-2013-cable-glands-for-electrical-installations/) identifies **BS EN 62444:2013** by title [S3]; this is a national adoption record, not proof of identical text, current EN status, or current OJEU listing. A supplier's own cited edition must be recorded separately. No current legal harmonization or transition status was checked.

## Purpose, users and exact scope

A cable gland provides the mechanical interface where a cable enters equipment. Depending on the actual design and declared performance, it can contribute to securing the cable, protecting the entry against ingress, or providing an electrical connection to cable metallic elements. These are distinct functions, not automatic consequences of the word “gland.” Designers, gland manufacturers, test laboratories, installers and component-intake reviewers use the standard to identify a relevant product specification and supporting evidence; it is not a substitute for application engineering.

IEC's published abstract states that IEC 62444 specifies **construction and performance requirements and tests** for **complete glands as supplied by the manufacturer or responsible supplier**. It covers glands with IEC 60423 metric entry threads and may be used as a **guide** for other entry thread types. It explicitly excludes glands for mineral-insulated cables [S1]. This boundary does not mean every cable or conduit penetration is automatically within scope: identify the actual device, cable construction and entry thread, and consult the full applicable standard where the scope or interaction with a specialized application is uncertain. The abstract does not establish the full range of exclusions or whether a separate specialty standard imposes additional obligations.

## What it tests, and what cannot be inferred

The publisher establishes that there are construction and performance tests [S1]. The publicly retrieved scope does **not** enumerate the tests or acceptance criteria. Thus this report does not claim to have verified the standard's detailed retention, sealing, bonding or other procedures, test sequences, classes or numerical thresholds. These are useful **separate evidence questions** for a manufacturer's particular gland, rather than assertions that every gland has each function:

* **Cable retention:** ask whether the specified gland/cable combination resists movement of the cable at the entry, under what test and conditions, and with what declared result. A grip or an IP declaration alone does not establish adequate restraint of the real cable load.
* **Anchorage/strain relief:** ask whether a distinct mechanical load-transfer or anchorage performance is declared for the applicable cable construction, including how the cable is secured. The engineering distinction is between gripping at an entry and an arrangement that manages the actual external cable load. The public scope alone does not establish exactly how the standard defines or classifies those terms, or whether all anchorage is separate from retention in its test scheme.
* **Sealing:** ask for the actual gland's declared ingress protection, the cable diameter and surface range, matching seals and enclosure interface, and installation conditions. A seal claim is not a mechanical anchorage rating, and the gland's rating does not by itself establish the installed enclosure's rating.
* **Electrical bonding/continuity:** if the design is intended to bond cable armour, screen or a metallic gland to an enclosure or protective circuit, request the manufacturer's applicable connection method and electrical performance evidence. A metallic appearance, or grip on the sheath, does not establish continuity, protective bonding capability, current-carrying capacity or EMC performance. The public IEC abstract does not prove the standard's exact electrical-bonding test conditions or applicability to every gland.

The earlier [batch 7](file:///media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md) asserts specific type letters, pull counts, displacement limits and an unconditional rule for suspended/dynamic cables [S4]. Those claims were not verified against the primary text and **must not be used as IEC 62444 requirements**. Nor does this investigation prove they are false. Test classification, pass criteria, exact loading and the relationship of retention to anchorage remain open pending the licensed text and exact product evidence.

## Practical application and boundaries

For a concrete entry, start with the manufacturer and article number; establish the cable's actual outside diameter and construction, whether armoured/screened, the mounting thread and enclosure interface, seal and adapter compatibility, temperature and environmental exposure, and the tightening and preparation instructions. Ask for the exact declared standard and edition, IP and relevant mechanical/electrical ratings, test or certification reference, accessory dependencies and restrictions. Record whether an assertion is a supplier declaration, a certificate, or independently reviewed test evidence. Do not demand proprietary construction details merely to accept a bought part [S5].

For the installed application separately assess loads from cable mass, movement, pulling, bending and vibration; provision for mechanical support; mounting surface, sealing and environmental compatibility; and any necessary protective bonding and screen termination. These are engineering checks, **not** claims that this standard prescribes a particular installation arrangement. Verify the complete installed interface against the relevant enclosure and machine requirements, manufacturer instructions and application conditions. A component result cannot by itself prove the installed assembly's IP, mechanical support, protective-earth path or EMC outcome.

IEC 60423 is explicitly named in IEC 62444's scope for metric entry threads [S1]; thread compatibility is an interface question, not proof of sealing or bonding. IEC 60529 is the related ingress-protection code and test framework to consult for a relevant IP claim, but a gland declaration cannot be transferred to a complete installation without evidence for the assembly. IEC 60204-1 concerns electrical equipment of machines and is an application-level companion when applicable, not a replacement for gland product evidence. Explosion-hazard, marine or other special applications require their own applicable equipment and installation evidence; no claim is made here that IEC 62444 alone qualifies a gland for those environments.

## Functional safety and library use

A gland is normally a passive cable-entry component, not a functional-safety subsystem. Its mechanical, environmental or bonding failure can nonetheless affect conductors or protective measures used by a safety function. Consider credible common causes and installation conditions in the machine's risk assessment and validation. IEC 62444 alone does not assign a PL, SIL, Category, diagnostic coverage or safe failure rate, nor establish the achieved safety function. Obtain actual safety data only where the application needs it and an appropriate supplier declaration exists.

The immediate library route is **`cable_gland`**, with interface implications for `cable` and `enclosure` [S5]. Preserve the actual product's external contract and installation conditions, not a category-wide assumed IP or strain-relief rating. A standard reference is a candidate until matched to that exact variant's supplier evidence. No library schema, category mapping, approval or lifecycle state is changed by this report.

## Holdings, limitations and next action

The supplied filesystem-derived `NORMATIVE_CANDIDATES.json` lists **no IEC 62444 PDF, extracted text or memory candidate** [S6]. No matching local full text was identified in that search; this is not an exhaustive proof that no copy exists anywhere. No local edition can be compared with the IEC edition. The IEC public preview endpoint returned an HTML error rather than a readable preview; see retained `evidence/preview.pdf` (despite its extension it is HTML). Full clauses, tests, figures and detailed normative references were not read. The retailer adoption record is secondary and the historical batch is a lead, not an authoritative substitute.

**Recommendation:** conditional acquisition/access to the exact standard edition if an actual gland assessment requires resolution of test classification, procedures, acceptance limits or bonding/sealing details; otherwise prioritize the concrete supplier's technical sheet, installation instructions and test/certificate evidence. Validate the full installed entry separately. Do not purchase or update a normative catalogue merely because this scope report exists.

## Sources

[S1] IEC, [IEC 62444:2010 catalogue and abstract](https://webstore.iec.ch/en/publication/7034), public scope and lifecycle, accessed 2026-11-02; `evidence/iec-7034.html`.

[S2] IEC, [catalogue search API](https://webstore-search-api.iec.ch/api/search), POST query `62444`, `validOnly:false`, accessed 2026-11-02; `evidence/iec-api.json`. Search result is not a full-text or legal-status audit.

[S3] European Standards retailer, [BS EN 62444:2013](https://www.en-standard.eu/bs-en-62444-2013-cable-glands-for-electrical-installations/), accessed 2026-11-02; `evidence/bs-attempt.html`. Identity only, not a primary CENELEC status record.

[S4] Local historical research lead: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md`, IEC 62444 section; unverified summary.

[S5] Local library research guide: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, category routing and purchased-device evidence boundary; project instructions `/media/eldar/disk_2/Machine_concept/CLAUDE.md`, purchased-component boundary.

[S6] `NORMATIVE_CANDIDATES.json` in this worker directory, filesystem-derived candidate list supplied for this task; empty candidate arrays.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `a9221bce7cf52f3eb13b642040858fed7c4369a2e167178bc2bd02af025fdaad`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-62444`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 62444",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full standard and usable official preview unavailable; exact retention/anchorage, ingress and electrical bonding tests, classifications and acceptance criteria unverified.", "Current CENELEC adoption and OJEU status not checked.", "No concrete gland product or installed assembly assessed."],
  "local_holdings_summary": "Supplied filesystem-derived candidate list has no matching PDF, extracted text or memory file; no local full-text edition identified. Conditional access recommended if a concrete technical assessment needs clauses."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "standard": "IEC 62444",
  "accessed_utc": "2026-11-02",
  "sources": [
    {"id":"S1","url":"https://webstore.iec.ch/en/publication/7034","title":"IEC 62444:2010 Cable glands for electrical installations, edition 1.0","accessed_utc":"2026-11-02T23:04:10Z","evidence_path":"evidence/iec-7034.html","kind":"public scope and publication metadata","limitation":"Not full text; test details not available in abstract."},
    {"id":"S2","url":"https://webstore-search-api.iec.ch/api/search","request":"POST JSON: mode FULL, query 62444, validOnly false, size 20, language en","title":"IEC catalogue search results for 62444","accessed_utc":"2026-11-02T23:04:10Z","evidence_path":"evidence/iec-api.json","kind":"official publication search","limitation":"Not an exhaustive legal or draft-status check; timestamp is session start, not precise request time."},
    {"id":"S3","url":"https://www.en-standard.eu/bs-en-62444-2013-cable-glands-for-electrical-installations/","title":"BS EN 62444:2013 Cable glands for electrical installations","accessed_utc":"2026-11-02T23:04:10Z","evidence_path":"evidence/bs-attempt.html","kind":"retailer catalogue","limitation":"Secondary identity record; not official EN status or OJEU evidence; timestamp is session start."},
    {"id":"S4","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md","title":"Historical batch 7 IEC 62444 section","accessed_utc":"2026-11-02","evidence_path":null,"kind":"old research lead","limitation":"Claims not independently verified against full text."},
    {"id":"S5","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md","title":"IEC scope research library guide","accessed_utc":"2026-11-02","evidence_path":null,"kind":"local project guide","limitation":"Research routing, not standard or compliance authority."},
    {"id":"S6","path":"NORMATIVE_CANDIDATES.json","title":"Filesystem-derived local holding candidates","accessed_utc":"2026-11-02","evidence_path":"NORMATIVE_CANDIDATES.json","kind":"local holdings inventory","limitation":"Candidate list, not proof of absence everywhere."},
    {"id":"S7","url":"https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYyNDQ0e2VkMS4wfWIucGRm","title":"IEC 62444 edition 1 preview attempt","accessed_utc":"2026-11-02","evidence_path":"evidence/preview.pdf","kind":"failed preview","limitation":"Returned HTML error, not a PDF; not inspected as normative text."}
  ]
}
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[S1]: <https://webstore.iec.ch/en/publication/7034>
[S2]: <https://webstore-search-api.iec.ch/api/search>
[S3]: <https://www.en-standard.eu/bs-en-62444-2013-cable-glands-for-electrical-installations/>
[S7]: <https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYyNDQ0e2VkMS4wfWIucGRm>
