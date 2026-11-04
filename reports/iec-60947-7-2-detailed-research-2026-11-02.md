---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-7-2-detailed-research-2026-11-02",
    "title": "IEC 60947-7-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-7-2?",
    "scope": "Detailed IEC 60947-7-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:28.253Z"
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
  "sourceDigest": "fe73fdb93b36c2aaba9ee03806268d680f0be7d00a1ec40bd56b9d0af1e619f2",
  "proposalRevision": "209f6b3e152fdf85291d34d27b64c74fad1952fa4c89a9e2420889a00fc945e4"
}
---
# IEC 60947-7-2 — protective-conductor terminal blocks

**Research check: 2026-11-02 UTC.** This is a product-scope investigation, not a conformity assessment, installation design, or complete reading of the standard.

## Identity and publication status

IEC 60947-7-2:2009, edition 3.0, is the International Standard **“Low-voltage switchgear and controlgear – Part 7-2: Ancillary equipment – Protective conductor terminal blocks for copper conductors.”** IEC records publication on 20 April 2009 and status PUBLISHED. IEC’s lifecycle also records the 1995 and 2002 editions as revised, and a fourth edition at committee-draft (CD), preparing, with a forecast date of 18 December 2026; this forecast is not a publication. IEC lists a 2026 stability date; that is not itself a withdrawal or replacement date. These are the checked catalogue facts, not a conclusion on legal status or national adoption. [1, 2]

The 2009 IEC abstract expressly says to read it with **IEC 60947-1:2007 and IEC 60947-7-1:2009**. This is an edition-specific publication instruction; do not silently substitute a newer general part or terminal-block part for a supplier’s specified test basis. Equally, this historical pairing does not settle what editions a current project or jurisdiction requires. [1]

## Purpose, scope and limits

A protective-conductor terminal block provides a way to connect protective copper conductors mechanically and electrically to a fixing support. Its intended audience includes terminal-block manufacturers and test laboratories, panel builders, designers and people assessing manufacturer documentation. The problem is not just a convenient wire clamp: the protective connection must remain suitable for its stated function and interfaces. [1]

The IEC abstract describes **PE-function blocks up to 120 mm²** and **PEN-function blocks from 10 mm² upward**, with screw or screwless clamping, primarily for industrial applications. The overall scope covers round copper conductors, with or without special preparation, from 0.2 to 120 mm², for circuits rated no more than 1,000 V AC at up to 1,000 Hz or 1,500 V DC. Those are scope boundaries, not ratings of every product or installation rules for PEN conductors. The abstract says they are most commonly used together with terminal blocks to IEC 60947-7-1. [1]

The same abstract says the document **may be used as a guide**, rather than unconditionally describing full ordinary coverage, for blocks needing special conductor devices such as quick connections or wrapped connections, and for direct contact by insulation-piercing edges or points such as insulation-displacement connections. Investigate the exact product and additional evidence rather than automatically assigning the same conformity inference to these types. The public abstract does not establish every exclusion or the detailed treatment of all conductor preparations; consult the full applicable text. [1]

## The critical rail / bonding distinction

IEC's own scope says that the terminal block connects the copper conductor to its **fixing support**; it does not say that every PE-marked block installed on any rail establishes a complete protective path to the machine’s protective-earth connection. [1] The historical batch’s description of a foot that automatically bites oxidation, a rail that thereby becomes a fault busbar, and a blanket “use 7-2 wherever earth must reach the rail structure” is an overgeneralization, not established by the IEC abstract. [4]

Separate these interfaces in an actual assembly:

1. **Conductor to terminal:** the exact block and clamping method must accept the actual conductor, preparation, number of conductors and rated range, with the manufacturer’s instructions.
2. **Terminal to support:** determine whether the selected product is designed and declared to make an electrical connection through its mounting foot, and with which support, surface and mounting conditions. Some specific products may have such an interface; a generic designation alone does not establish compatibility of an arbitrary combination.
3. **Support to protective bonding system:** if the design relies on a rail as part of the protective path, establish its continuity to the designated PE connection and the suitability of all intervening joints, fixings, finishes and conductors. Merely snapping a terminal onto a mechanically fixed rail does not prove this. An alternative bonding arrangement must be assessed on its own evidence.
4. **Complete installed path:** verify the assembled path and fault protection under the applicable installation/assembly rules and actual design, not from a terminal product designation alone. Consider expected fault duty, protective-device behavior, continuity and environmental/service conditions. Product test details and the required system-level acceptance method cannot be reconstructed from the abstract.

IEC 60715:2017 addresses dimensional and functional requirements for compatible mounting on certain rails [3]. **Mechanical mounting compatibility is not by itself proof of electrical bonding or sufficient installed fault capability.** The exact support and terminal manufacturer’s public external installation contract, plus system-level verification, are decisive; no reverse engineering of a bought block’s internal construction is needed. This is an engineering interpretation of the interface boundary, not a quoted 7-2 installation clause.

## Technical areas and practical use

IEC explicitly identifies improved tightening-torque test requirements referenced to the general rules, and an improved short-time withstand current test, as changes from the preceding edition. It also states that “clamping unit” is used where applicable instead of “terminal” when relating this document to IEC 60947-1. [1] These facts identify mechanical connection and short-time current performance as relevant technical subjects; they do **not** reveal test conditions, pass criteria, supported protective-device combinations or permissible torques. The official public preview request returned HTTP 403 [5], and no full text of this part was found locally. Consequently a complete construction/test-clause summary, including the exact tests of the mounting-foot/support contact, remains unverified.

For an actual PE or PEN product ask for:

- exact article and revision, manufacturer’s declaration or certificate and edition cited; distinguish an asserted standard from a report or independently checked certificate;
- PE versus PEN designation, conductor material, cross-section, solid/stranded or prepared conductor eligibility, clamping style and permitted terminal occupancy;
- published assembly instructions, tooling, tightening conditions where applicable, end stops/accessories and compatible support/rail material, finish and profile;
- manufacturer’s stated protective connection and short-time/fault-duty data, its test configuration and any specified protective-device coordination; do not infer actual fault withstand or breaker clearing from a standard number;
- restrictions from temperature, contamination, corrosion, vibration, maintenance or mounting orientation where given, and provisions for the intended installation environment;
- the assembly design showing how the rail/support connects to PE, which parts are relied on as conductors and the actual installed inspection/verification evidence.

The product’s stated ratings and instructions are the external contract; the task of selecting conductor sizes, protective devices, disconnecting arrangements and verifying the protective bonding system belongs to the actual installation and applicable system rules. Scope limits above must not be converted into conductor sizing instructions. A PEN-specific product claim is not permission to use PEN in a particular circuit or arrangement.

## Electrical safety and functional safety

This component is relevant to **protective earthing and fault protection**, not a certified machine-control safety subsystem merely because it is called protective. A PE path can be essential for electric-shock protection, but the terminal standard alone neither verifies the assembled machine’s protective circuit nor establishes ISO 13849 Category, diagnostic coverage, PL, SIL, PFHd or a fault exclusion. Where a terminal also occurs in a safety-related control circuit, evaluate the actual circuit and claimed failure behavior under the applicable functional-safety framework with suitable evidence; a product-standard designation does not establish achieved safety integrity. This is a scope-boundary assessment, not a claim that functional safety is irrelevant to the machine.

## Related documents and role separation

- **IEC 60947-1:2007 and IEC 60947-7-1:2009:** edition-specific companion reading expressly cited by the 2009 part [1]. Part 7-1 concerns terminal blocks for copper conductors; do not treat an ordinary feed-through terminal as automatically equivalent to a PE/PEN terminal, or assume all ordinary terminals electrically isolate every possible support.
- **IEC 60715:2017:** compatible mounting on specified rail types [3]; mechanical interface evidence is distinct from protective bonding validation.
- **IEC 60204-1:** relevant machinery electrical-equipment/protective-bonding application route when it applies to the machine; assess actual edition and applicable clauses separately. A component test does not substitute for machine verification.
- **IEC 61439-1 and applicable assembly part:** potentially relevant to the specific low-voltage assembly, if in scope; do not infer applicability from a cabinet’s existence alone.
- **ISO 13849-1 / IEC 62061:** potential routes for safety-related control functions, not substitutes for protective-earth product and installation evidence. Their applicability depends on the actual function and machine.

Only the first three named IEC documents are source-checked here for their exact cited relationship or mounting abstract; other entries are engineering routing suggestions, not verified normative references of 60947-7-2 or a claim of current regulatory applicability.

## Library handling and local holdings

Primary route: `terminal_pe`, distinguishing PE from PEN and the actual interface. `din_rail` and enclosure/support entries are relevant interfaces, not automatically protective conductors. `terminal_feedthrough` is a comparison route, not a substitute classification. Preserve the exact supplier's part, cited edition, connection and rail restrictions; ask for the physical assembly path and verification separately. No component approval, schema change or new default follows from this report. Project guidance also distinguishes package lifecycle from machine-level validation [4].

The provided candidate list contains no matching PDFs, extracted Markdown, or memory files. A filename search of NORMATIVE’s standards PDF, extracted HTML and per-standard memory directories also found no matching 60947-7-2 file. Thus **no matching full local text was found**, not proof that no copy exists anywhere. The IEC scope and historical batch are research references only. If an actual terminal intake or unresolved protective-path question requires detailed construction, test conditions or clause interpretation, obtain authorized access to the applicable edition and its specified companions; otherwise retain this as a conditional acquisition, not an automatic purchase for every component.

## Evidence and limitations

1. [IEC catalogue record, IEC 60947-7-2:2009](https://webstore.iec.ch/en/publication/4006), saved `evidence/iec-4006.html`; [IEC search API](https://webstore-search-api.iec.ch/api/search), saved `evidence/iec-api.json` (POST query documented in `SOURCES.json`). Public scope, lifecycle and edition data, not full text.
2. Same IEC record, lifecycle/stability information; edition 4 is a draft forecast, not a published standard. No EN adoption or OJEU listing was verified.
3. [IEC 60715:2017](https://webstore.iec.ch/en/publication/29026), saved `evidence/iec-60715.html`; mounting-scope abstract only.
4. Local historical routing lead `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md`, IEC 60947-7-2 section, and its adjacent `README.md`; not primary authority. The rail-contact/automatic fault-bus interpretation is not supported by the publisher’s scope and is not adopted.
5. [IEC official preview endpoint](https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTctMntlZDMuMH1iLnBkZg==) (see exact encoded URL in `SOURCES.json`): request returned 403, preserved as `evidence/iec-preview.pdf` despite its HTML content. No bypass attempted.

No product-specific manufacturer sheet was inspected; the list above is therefore an evidence checklist rather than a declaration for any particular device. Detailed provisions, amendments beyond those visible in the checked catalogue, EN adoption, legal status and assembly-specific test acceptance remain open.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `c1c25f93e46ea44e1aedf466807cf541188ced7f78e32901cc12a651b83d526e`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-7-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-7-2",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "No full text or preview obtained; no detailed clause/test criteria verified",
    "No product-specific manufacturer example; no EN adoption/OJEU verification",
    "Exact installed PE rail bonding and fault protection depend on design evidence"
  ],
  "local_holdings_summary": "No matching full standard found in provided candidates or bounded NORMATIVE filename search; public scope only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/4006",
    "title": "IEC 60947-7-2:2009 edition 3.0",
    "evidence_path": "evidence/iec-4006.html",
    "kind": "public scope",
    "limitation": "Abstract and catalogue, not full text",
    "accessed_at": "2026-11-02T23:04:57.333429+00:00"
  },
  {
    "url": "https://webstore-search-api.iec.ch/api/search",
    "title": "IEC search lifecycle for 60947-7-2",
    "evidence_path": "evidence/iec-api.json",
    "kind": "publisher catalogue metadata",
    "request": "POST application/json: {\"mode\":\"PUBLICATION\",\"query\":\"60947-7-2\",\"from\":0,\"size\":30,\"validOnly\":false,\"sortBy\":[{\"reference\":\"asc\"}],\"language\":\"\",\"dateRanges\":{},\"terms\":{},\"publicationIds\":[],\"showTrf\":false,\"collapsed\":false}",
    "limitation": "Lifecycle snapshot; draft forecast not publication",
    "accessed_at": "2026-11-02T23:04:57.333429+00:00"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/29026",
    "title": "IEC 60715:2017",
    "evidence_path": "evidence/iec-60715.html",
    "kind": "public scope",
    "limitation": "Mounting scope only",
    "accessed_at": "2026-11-02T23:04:57.333429+00:00"
  },
  {
    "url": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTctMntlZDMuMH1iLnBkZg==",
    "title": "IEC 60947-7-2:2009 official preview attempt",
    "evidence_path": "evidence/iec-preview.pdf",
    "kind": "access failure",
    "limitation": "HTTP 403 HTML; no preview content obtained",
    "accessed_at": "2026-11-02T23:04:57.333429+00:00"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
    "title": "Historical batch 7 research",
    "evidence_path": null,
    "kind": "old research lead",
    "limitation": "Not primary evidence; rail assertion overgeneralized",
    "accessed_at": "2026-11-02T23:04:57.333429+00:00"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "Project scope research guide",
    "evidence_path": null,
    "kind": "local instructions",
    "limitation": "Routing guidance not normative text",
    "accessed_at": "2026-11-02T23:04:57.333429+00:00"
  },
  {
    "path": "NORMATIVE_CANDIDATES.json",
    "title": "Candidate local holdings",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "kind": "local inventory",
    "limitation": "No matches; bounded filename search also performed",
    "accessed_at": "2026-11-02T23:04:57.333429+00:00"
  }
]
`````
