---
{
  "format": 1,
  "metadata": {
    "id": "iec-60598-1-detailed-research-2026-11-02",
    "title": "IEC 60598-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60598-1?",
    "scope": "Detailed IEC 60598-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:30.142Z"
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
  "sourceDigest": "a1bdfae7d615e842a829c55fe9f03bd53ea39fb18e733b4084bd2bebcbf4593a",
  "proposalRevision": "6b5f5ebfade6d2db96e128cadb79cdc37b054a78009f523ed50750a2e886d0d1"
}
---
# IEC 60598-1 — general luminaire safety requirements and tests

**Research check:** 2026-11-02 UTC. **Evidence level:** IEC public catalogue abstracts and bibliographic information, not full-clause verification. This is a product-standard reading route, not product certification or a machine conformity assessment.

## Identity and status

IEC **60598-1:2024**, *Luminaires – Part 1: General requirements and tests*, is an International Standard, edition 10.0, published 2024-11-06. IEC identifies it as a technical revision cancelling and replacing edition 9 from 2020. The checked IEC catalogue record is [S1]. A redline is a comparison product, not a different base edition [S2]. The catalogue presents this 2024 publication; a comprehensive amendment/corrigendum and future-project audit was not completed. Supplier declarations may legitimately cite a different edition: record that actual claim, not this edition by substitution. No EN adoption, OJEU listing, or legal transition has been checked.

## What it does and where it stops

A luminaire is the lighting equipment as a product, rather than simply its lamp, LED module or driver. The standard's general safety framework helps a luminaire manufacturer design and test equipment, a laboratory assess it, and a purchaser ask for relevant product evidence. According to IEC's 2024 public abstract, it addresses luminaires incorporating electric light sources supplied at up to **1,000 V**, and includes semi-luminaires [S1]. That is the verified catalogue scope, not a summary of every condition or exclusion in the full text.

The full list of explicit scope exclusions, the details of every Part 2 interface, and exact test conditions were not accessible. Do not assume that anything described as lighting automatically qualifies: identify the actual article and its function. In particular, an LED module alone and a separate controlgear unit are not thereby a complete luminaire. LED-module safety and LED-controlgear safety have their own product scopes [S3, S4]; machine installation and workplace illumination are further distinct questions. This is a boundary in application, not a claim that the luminaire standard expressly excludes every module or separate driver in all circumstances.

Part 1 provides general requirements; a relevant IEC 60598-2 particular part can address a particular luminaire subtype and must be checked for how it combines with Part 1. For example IEC 60598-2-22 addresses emergency luminaires supplied from emergency supplies [S5]. A luminaire with a battery, or an illuminated lift, should not automatically be presumed compliant with that particular part; determine the intended emergency-lighting function and exact product claim. The public abstract alone does not resolve all Part 2 selection or precedence questions.

## Technical themes and interpretation

IEC's published list of changes for edition 10 points to several practical subjects [S1]: supply and other marking; accessible/hazardous live-part terminology; earthing and protective-earth current information; conductor mechanical stress; surge-protective devices and components; controlgear including controllable SELV outputs; magnetic suspension; serviceability classification; photobiological safety; and a new annex addressing battery-using luminaires. These indicate subjects the standard addresses, **not** an independently verified checklist of all requirements, tests, thresholds or pass criteria. The abstract's list is a change summary rather than a table of contents or a complete safety specification.

In practical terms a luminaire review separates enclosure and mounting robustness, electric-shock protection, thermal/fire behaviour, wiring/terminals, environmental protection and marking from lighting performance and installed-system design. Product testing is performed for the configurations and conditions specified by the applicable standards and manufacturer evidence; a general catalogue claim cannot prove a particular device passed any individual test. Likewise, an ingress-protection marking describes a declared enclosure characteristic, not automatically resistance to every oil, vibration, impact, chemical, or high-pressure cleaning exposure. Verify the actual declared suitability and installation restrictions.

## Electrical use: what to request and check

For a purchased machine, cabinet, shaft, work-area or lift luminaire, capture the precise model and manufacturer's declaration, cited edition and any applicable particular part. Then review external characteristics needed by the installation:

* rated supply type, voltage and frequency as applicable, current/power, external driver arrangement, terminals and polarity; startup/inrush and upstream protection or switching constraints where published;
* protection class and protective-bonding connection where applicable, installation instructions, mounting position and mechanical retention; enclosure rating and environmental and temperature limits;
* optical distribution and usable illuminance at the task, glare and maintenance/contamination implications; these are installed-lighting questions, not guaranteed by the Part 1 product-safety designation;
* replaceability/serviceability, permitted module or driver substitutions and spare-part instructions; retain the actual externally specified interfaces, without demanding proprietary internal schematics for a bought device;
* if emergency illumination is actually required, the power architecture, compatibility and independently supported emergency operating data and test instructions. A Part 1 claim or the existence of its battery annex alone does not prove autonomy or required coverage.

The user must establish applicable site, machine and lift requirements separately. IEC 60204-1 concerns electrical equipment and systems of machines within its scope [S6]; it is not a synonym for a luminaire product certificate. A specific machine or lift standard, risk assessment and applicable jurisdiction can add application-specific obligations. There is **no general lift illuminance, battery voltage, autonomy, or backup rule** derivable here for all installations. The historical batch [L1] offered universal-sounding numeric lift/emergency and fire-response claims; its own guide [L2] cautions against transferring such numbers across machines, and they have not been verified in this investigation.

## Functional safety and integration

Normally a luminaire is an electrical product whose light aids visibility, rather than an ISO 13849 safety-related control subsystem. IEC 60598-1 on its own does not establish a performance level, diagnostic coverage, category, SIL, failure rate, emergency supply availability or a validated machine safety function. When a documented risk assessment assigns illumination, its monitoring or power switching a role in a safety function, consider the exact claimed function, failures, dependencies and required behaviour. Obtain appropriate manufacturer evidence and validate the complete application under the selected machine safety framework; do not infer the necessary safety metrics merely from the luminaire standard. Visibility-related safety and electrical product safety remain relevant even when no ISO 13849 safety function is assigned.

## Related standards — distinct scopes

| Reference | Role and application boundary |
|---|---|
| IEC 60598-2-22:2021 | Particular requirements for emergency luminaires using lamps on emergency supplies up to 1,000 V; the catalogue also discusses self-contained products, batteries and tests [S5]. Confirm the applicable edition and product subtype. |
| IEC 62031:2026 | LED-module safety. IEC excludes LED packages, automotive LED modules, OLED modules and LED lamps from this particular standard, and says it does not cover module performance characteristics [S3]. This is a module standard, not installed luminaire or lighting-system acceptance. |
| IEC 61347-2-13:2024 and IEC 61347-1 | Particular LED electronic controlgear safety and associated general requirements; the part's catalogue explicitly describes alignment with Part 1 edition 4 [S4]. Driver and luminaire claims are separate; a conforming driver does not establish luminaire conformity or emergency service. |
| IEC 60204-1:2016+A1:2021 | General electrical equipment of machines, within its stated scope [S6]. A machine-level route, not a luminaire product test substitute. |

These are evidence routes, not a determination that all listed standards apply to every article. EMC and photometric/performance standards, when relevant, require separate subtype- and jurisdiction-specific selection; none has been fully researched here.

## Library implications and actual local holdings

For the existing `lighting` category, distinguish complete luminaire, semi-luminaire, LED module, separate LED driver, and emergency luminaire before assigning references. The package should preserve manufacturer model/revision, actual standards claim, evidence document, optical/electrical ratings, declared installation constraints and, where appropriate, emergency features. Product evidence is distinct from the machine's installed lighting verification and from library lifecycle approval. Avoid auto-populating Part 2-22, emergency backup, or functional-safety attributes based only on category. No schema or normative catalog changes are proposed.

The provided [local candidates](NORMATIVE_CANDIDATES.json) report no matching PDFs, extracted Markdown or memory files. A targeted filename search of the local `NORMATIVE/STANDARDS_PDF` and `NORMATIVE/extracted_html` trees also found no matching `60598` files. The historical batch [L1] is a **research lead**, not held normative text, and no local full IEC 60598-1 edition has been verified. This bounded search does not prove a copy cannot exist elsewhere or under an unrelated filename.

**Recommendation: conditional acquisition, not automatic purchase.** For selecting an unmodified commercial luminaire, obtain exact supplier evidence and installation data first. If the project designs/modifies luminaires, must independently interpret a disputed product clause, or needs a justified full conformity assessment, obtain the appropriate licensed Part 1 and applicable Part 2 and reconcile editions. Otherwise a scope reference and supplier documentation may suffice for intake, subject to project review.

## Sources and limitations

* **[S1]** IEC, [IEC 60598-1:2024](https://webstore.iec.ch/en/publication/66620), catalogue abstract, publication identity and revision notes. Saved `evidence/iec60598.html`, readable extraction `evidence/iec60598.txt`.
* **[S2]** IEC, [IEC 60598-1:2024 RLV](https://webstore.iec.ch/en/publication/103054), redline description. Saved `evidence/rlv.html`.
* **[S3]** IEC, [IEC 62031:2026](https://webstore.iec.ch/en/publication/92035), public catalogue and IEC search response `evidence/api-62031.json`.
* **[S4]** IEC, [IEC 61347-2-13:2024](https://webstore.iec.ch/en/publication/64713), `evidence/driver.html` and `evidence/driver.txt`.
* **[S5]** IEC, [IEC 60598-2-22:2021 RLV](https://webstore.iec.ch/en/publication/72708), public catalogue and `evidence/api-60598-2-22.json`.
* **[S6]** IEC, [IEC 60204-1:2016+A1:2021 consolidated](https://webstore.iec.ch/en/publication/71256), public catalogue and `evidence/api-60204-1.json`.
* **[L1]** `Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md`, IEC 60598-1 and lift-lighting sections, historical, unverified lead.
* **[L2]** Same directory, `README.md`, sections 1–5, research limitations and anti-generalization guidance.

The publisher preview link returned HTTP 403; retained response `evidence/preview.pdf` is actually an HTML error, not a PDF. No access workaround was attempted. Therefore the precise scope exclusions, complete Part 2 interface and detailed requirements remain open. Consult the actual licensed edition before any normative design or certification claim. Machine/lift product standards, emergency-lighting system rules, suppliers and legal status have not been independently assessed here.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `aab1fc11bde1df81aad35a3a2cd3051567405796080f2a5c0b2130d058b1df31`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60598-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60598-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and complete explicit exclusions unavailable; IEC preview returned 403",
    "Complete Part 2 applicability, amendment/corrigendum audit and EN/OJEU status not verified"
  ],
  "local_holdings_summary": "No matching local PDFs, extracted Markdown or memory candidates; bounded filename search also found none. Historical research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/66620",
    "title_edition": "IEC 60598-1:2024 edition 10",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/iec60598.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract and revision highlights only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/103054",
    "title_edition": "IEC 60598-1:2024 RLV",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/rlv.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Redline catalogue, not full text"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/92035",
    "title_edition": "IEC 62031:2026",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/92035.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Module scope only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/64713",
    "title_edition": "IEC 61347-2-13:2024",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/driver.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Controlgear abstract only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/72708",
    "title_edition": "IEC 60598-2-22:2021 RLV",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/72708.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Emergency luminaire abstract only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/71256",
    "title_edition": "IEC 60204-1:2016+A1:2021",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/71256.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Machine electrical abstract only"
  },
  {
    "url_or_path": "https://webstore-search-api.iec.ch/api/search",
    "title_edition": "IEC catalogue search responses",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/api.json",
    "evidence_kind": "public scope",
    "coverage_limitation": "Search via published catalogue API; related searches in evidence/api-*.json"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwNTk4LTF7ZWQxMC4wfWIucGRm",
    "title_edition": "IEC 60598-1 preview attempt",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "evidence/preview.pdf",
    "evidence_kind": "access failure",
    "coverage_limitation": "HTTP 403 HTML response, not PDF"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "title_edition": "Historical lighting research",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Original path is read-only; candidate list retained separately"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title_edition": "Historical research guide",
    "access_time_utc": "2026-11-02T23:07:09.350971+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Project context, not normative text"
  }
]
`````
