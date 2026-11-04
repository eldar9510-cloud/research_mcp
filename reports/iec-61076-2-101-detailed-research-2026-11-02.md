---
{
  "format": 1,
  "metadata": {
    "id": "iec-61076-2-101-detailed-research-2026-11-02",
    "title": "IEC 61076-2-101 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61076-2-101?",
    "scope": "Detailed IEC 61076-2-101 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:28.532Z"
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
  "sourceDigest": "bf8f93a729eb1d93f9e2b993d154344783e1956713460906fc2f6a7ac2fafdd3",
  "proposalRevision": "2b5361fb74b6aa10ef15c5cb2c6e359bb547421dd732607ec3dbc1fe78f0029c"
}
---
# IEC 61076-2-101 — M12 screw-locking connectors

**Investigation date:** 2026-11-02 UTC. **Evidence level:** publisher abstract, edition lifecycle and referenced-document listing; not full-clause review. This is a component-interface research note, not a product approval, installation design or safety-function verification.

## Identity and purpose

[IEC 61076-2-101:2024](https://webstore.iec.ch/en/publication/77773), edition 4.0, is *Connectors for electrical and electronic equipment – Product requirements – Part 2-101: Circular connectors – Detail specification for M12 connectors with screw-locking*. IEC lists it as published on 2024-11-27 and its lifecycle as PUBLISHED, with no subsequent amendment in the displayed edition-4 lifecycle. Edition 4 replaces and technically revises edition 3, [IEC 61076-2-101:2012](https://webstore.iec.ch/en/publication/4418), which IEC marks REVISED. The historical local batch's uncertainty between 2012 and 2024 is resolved as an IEC publication question, not as the edition applicable to a particular purchase or jurisdiction. An EN adoption, its edition and legal/OJEU status were not established.

The specification gives connector designers, manufacturers, testers and equipment integrators a common description of a defined range of screw-locking circular interfaces. Its practical purpose is to support geometrically and electrically characterized interfaces, rather than to prescribe all the wiring functions of the connected machine. Interchangeability must still be verified for the precise connector and mating component; mere possession of an M12 thread is insufficient. [IEC 2024 abstract]

## Scope, limits and changes

The IEC abstract describes M12 screw-locking circular connectors from 2 to 17 ways, for data transmission up to 100 MHz and signal/power transmission up to 250 V rated voltage and 4 A per contact. It includes fixed and free connectors, rewirable or non-rewirable. Male contacts are round and of one of four listed diameters depending on coding and number of ways; contacts within the connector are the same size. Different codings prevent mating differently coded male and female connectors. These are **scope ceilings**, not a simultaneous rating for each style, number of contacts, product or operating condition. Consult the actual product data and applicable detailed specification. [IEC 2024 abstract]

Edition 4's published change summary says dimensional and characteristic provisions were updated; free-connector style NF added; fixed connectors with glass-to-metal seals (former styles WM, XM, YM, ZM, WF, XF, TF and ZF) removed; and P-coding eliminated. The former steel-conduit-thread informative annex was replaced with an informative annex on cable-outlet orientation relative to coding; dimensional specifications for former styles AM and BM moved to a normative annex. These are edition-specific changes, **not a conclusion that every existing connector with a former feature is unusable or nonconforming to its own cited earlier edition**. [IEC 2024 abstract]

The abstract does not enumerate every included coding, position count/coding combination, pin assignment, seal or application exclusion. It does not justify assuming that every M12 connector, push-pull lock, P-coded device, high-power or high-frequency design falls under this part. Nor does it establish that every identically coded mating pair is necessarily compatible in all mechanical, sealing or electrical respects. For push-pull connectors IEC lists the separate [IEC 61076-2-010:2021](https://webstore.iec.ch/en/publication/29392), based on several specified interface families: check the actual combined interfaces and locking systems. No claim is made here that it replaces this screw-lock detail specification.

## Technical subjects and engineering use

The primary abstract directly identifies dimensional information, characteristics, connector styles, contacts, coding and cable-outlet orientation. The publisher's reference list includes IEC 61076-1 generic product specifications, multiple IEC 60512 connector tests and measurements, IEC 60529, IEC 60664-1 and IEC 61984. This establishes the presence of related references, **not** the detailed test sequence, test conditions or pass criteria for an arbitrary connector. The full text was unavailable, so individual tests, termination requirements, marking, shielding provisions, permissible materials and exact mating dimensions have not been checked. [IEC 2024 product page, abstract and normative references]

For an actual selection, obtain the manufacturer's exact article and interface drawing for both halves and record coding, contact gender, count and physical orientation. Check published pin-number/function diagrams at both ends, including the mating-view direction and the equipment manufacturer's external connection contract. An interface designation alone does not decide a signal's function or safety channel assignment. Check voltage and current ratings under actual temperature, number of energized contacts and other manufacturer restrictions; conductor range, termination method, tools and cable diameter; stated mating part/locking compatibility, tightening instructions and any assembly constraints. For a data link, verify declared transmission performance and the applicable network/cabling specification over the whole intended link, not only the scope's maximum frequency. These are selection questions, not claims that a particular standard clause prescribes a particular answer.

Check the environment using the **specific assembled combination's** supplier documentation: sealing/IP in mated or unmated state, caps, mounting surface, cable seal, temperature, chemicals, vibration and mechanical retention as relevant. IEC 60529 identifies the IP-code framework; an M12 name or generic coding does not itself establish an IP class. Determine external protection, permissible connection/disconnection conditions and installation routing from the product information and applicable system rules; the publisher abstract is not a field-installation manual. Treat bought connectors and equipment as black boxes; manufacturer-published external interfaces and prescribed installation are the evidence needed, not reverse engineering.

## Conditional functional-safety relevance

A connector can carry safety-related signals or power in an ISO 13849 safety-related control system, but this part is an interface/product specification, not a certification of a complete safety function. Connector conformity alone gives no automatic Category, diagnostic coverage, PL, SIL, PFH or fault-exclusion entitlement. Assess the exact connector and cable's foreseeable disconnection, short/open circuits, miswiring, environmental exposure, mechanical security and the actual function's architecture, diagnostic response and fault assumptions under the applicable safety method. Certification or safety data for a supplied subsystem are separate, variant- and application-conditional evidence. Machine-level validation remains separate. This is an engineering interpretation of the product scope and the safety source review, not a claim that the abstract contains ISO 13849 rules. [Local `SAFETY_SOURCE_REVIEW.md`, conditional correlation/diagnostic discussion]

## Related documents, distinct roles

* **IEC 61076-1:2006 + amendment 1:2019** — generic connector product specification, explicitly listed in the 2024 part's normative references. Check edition and precise application in the complete text.
* **IEC 60512 series** — connector test and measurement methods referenced by the detail specification; the list alone does not establish test results for a purchased part.
* **IEC 61984:2008** — connector safety requirements and tests, also listed by IEC. Do not infer a particular connector's independent declaration from a reference list.
* **IEC 60529 and IEC 60664-1** — referenced protection-code and insulation-coordination standards, respectively; actual ratings/conditions remain variant-specific.
* **IEC 61076-2-010 and -2-012** — related push-pull detail specifications listed in the publisher's references, based on several connector interfaces. Similar interface naming does not prove screw-lock or sealing compatibility. See [IEC 2024 page](https://webstore.iec.ch/en/publication/77773) and [IEC 2-010 page](https://webstore.iec.ch/en/publication/29392).
* **ISO 13849** — conditional machine-safety control-system analysis and validation, not a substitute for connector interface details or supplier safety data.

## Library and holdings

Potential routing: `connector_industrial` and wired interfaces on `inductive_sensor`, `limit_switch`, `door_interlock`, `e_stop`, `encoder`, I/O and other devices **only when the actual article has a matching interface**. Ask for the exact supplier standard and edition, article, mating part, drawing, pin assignment and published limits. Record manufacturer claims as claims, not inferred standards compliance; leave safety role and system application to the relevant machine assessment. No category, policy or schema change is proposed.

`NORMATIVE_CANDIDATES.json` lists no matching PDF, extracted text or memory file; a filename search under `/media/eldar/disk_2/Machine_concept/NORMATIVE` found no standard-named IEC 61076 holding. This supports **no matching full text found**, not proof that no differently named file exists. No held edition can be identified. The older local batch is a research lead, not full text. Recommend **conditional acquisition/access**, not blanket purchase: obtain the specific edition and referenced generic/test parts when connector design, conformity assessment, disputed dimensional compatibility or exact test obligations require authoritative clauses; ordinary bought-device selection can begin with manufacturer evidence and the exact application. Preserve a supplier's older declared edition separately from the 2024 publisher status.

## Limitations and unresolved questions

IEC's public preview link returned an HTML error rather than a readable PDF; failure is retained in `evidence/preview-failed.html`. Thus scope details beyond the abstract, complete edition-specific coding matrix, exact tests, exceptions and all numeric tables are unverified. No actual product, certificate, EN adoption, OJEU listing or application wiring was assessed. Source evidence and access metadata are in `SOURCES.json`; historical local research is not treated as primary authority.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `15eb11e8951b5fa72ac6aa61ccf2a65603596383bb20a98e7f59b7b6bed5e216`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61076-2-101`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61076-2-101",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full normative text and preview unavailable; coding matrix, exact tests and clauses not verified",
    "No EN/OJEU or exact product conformity assessment"
  ],
  "local_holdings_summary": "No matching full text found in NORMATIVE candidates or standard-named files; 2024 public scope only."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "accessed_utc": "2026-11-02T23:05:38.743493+00:00",
  "sources": [
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/77773",
      "title": "IEC 61076-2-101:2024 ed 4",
      "evidence_path": "evidence/iec-2024.html",
      "kind": "public scope and lifecycle",
      "limitations": "Abstract and reference list only; not full text",
      "accessed_utc": "2026-11-02T23:05:38.743493+00:00"
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/4418",
      "title": "IEC 61076-2-101:2012 ed 3",
      "evidence_path": "evidence/iec-2012.html",
      "kind": "public scope",
      "limitations": "Older revised edition",
      "accessed_utc": "2026-11-02T23:05:38.743493+00:00"
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/29392",
      "title": "IEC 61076-2-010:2021",
      "evidence_path": "evidence/iec-2-010.html",
      "kind": "public scope",
      "limitations": "Related part only",
      "accessed_utc": "2026-11-02T23:05:38.743493+00:00"
    },
    {
      "url_or_path": "https://webstore-search-api.iec.ch/api/search",
      "title": "IEC publisher search, query 61076-2-101",
      "evidence_path": "evidence/results-api.json",
      "kind": "publication catalog API",
      "limitations": "POST query; status and abstracts only",
      "accessed_utc": "2026-11-02T23:05:38.743493+00:00"
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxMDc2LTItMTAxe2VkNC4wfWIucGRm",
      "title": "IEC edition 4 preview",
      "evidence_path": "evidence/preview-failed.html",
      "kind": "failed preview",
      "limitations": "HTML error; no preview text",
      "accessed_utc": "2026-11-02T23:05:38.743493+00:00"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
      "title": "Historical batch 07",
      "evidence_path": "not copied; read-only local file",
      "kind": "old research lead",
      "limitations": "Historical status claims not primary",
      "accessed_utc": "2026-11-02T23:05:38.743493+00:00"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
      "title": "Safety source review",
      "evidence_path": "not copied; read-only local file",
      "kind": "local safety research",
      "limitations": "Does not directly review this connector standard",
      "accessed_utc": "2026-11-02T23:05:38.743493+00:00"
    }
  ]
}
`````
