---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-5-3-detailed-research-2026-11-02",
    "title": "IEC 60947-5-3 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-5-3?",
    "scope": "Detailed IEC 60947-5-3 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.675Z"
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
  "sourceDigest": "c26800f9664aad7e197d63a7e7954806923f49d1275f3a2ab84c6414a010ac96",
  "proposalRevision": "2685651bc69124db9f6db0e6828a61923308365ae33875d8ea28d675d6ec7fbe"
}
---
# IEC 60947-5-3 — proximity devices with defined behaviour under fault conditions

**Publication check: 2026-11-02 UTC.** This is scope and application research, not certification, an installation design or a full-clause review.

## Identity and edition

The exact title of **IEC 60947-5-3:2026**, edition 3.0, is *Low-voltage switchgear and controlgear – Part 5-3: Control circuit devices and switching elements – Requirements for proximity devices with defined behaviour under fault conditions (PDDB)*. The IEC publisher lists it as a published International Standard, publication date **19 August 2026**; its lifecycle record labels edition 3 `PUBLISHED` and edition 2 `REVISED`. IEC states that this technically revised third edition cancels and replaces IEC 60947-5-3:2013, edition 2.0. The publisher record lists no edition-3 amendment in its lifecycle listing at the check date. [S1, S2]

The earlier batch calls edition 3 a **FprEN IEC draft** while also calling it current and citing the IEC publication ID [L1]. That terminology cannot establish the IEC publication status: the exact returned IEC record is a final published IEC standard, not a draft. It does not independently establish the status or date of a separate EN adoption, any national adoption, or an OJEU listing. A supplier's older declared edition must not be silently relabelled 2026.

## Purpose, intended user and scope

A proximity sensor can supply a machine control system with a position or target-presence signal without a conventional mechanically actuated contact. Where that signal participates in a safety function, an ordinary functional switching claim is not enough: the sensing product's response to faults matters. Part 5-3 addresses fault performance of PDDBs, intended as a sensing subsystem of a safety-related control system under IEC 62061 or ISO 13849-1. It is useful to PDDB manufacturers, conformity assessors, device selectors and machine safety integrators, albeit for different decisions. [S1]

**Publisher scope:** Part 5-3 provides requirements additional to IEC 60947-5-2 and IEC 60947-5-1:2024 Annex D for reed-contact magnetic switches. It also includes requirements for a PDDB designed as part of an ISO 14119 interlocking device. Depending on construction and complexity, its product development is based on the IEC 61508 series to satisfy product-specific requirements of one or more of IEC 61508, IEC 62061 and ISO 13849. This is not a statement that every proximity switch is a PDDB or that every interlock is a PDDB. [S1]

**Boundaries and explicit exclusions from IEC's abstract:**

- It does not cover protective equipment that **directly detects persons**; the IEC 61496 series or IEC TS 62998 series address that equipment. IEC notes that a PDDB can indirectly detect a person, for example via the position of a standing platform. A device's actual sensing role, not merely its location near a person, determines the useful route.
- It specifies no requirements for any analogue output a PDDB may have. A separate analogue output must not be assumed safety suitable from the binary sensing claim.
- It does not consider software updates or self-evolving behaviour, or explosive atmospheres; these need separate assessment and applicable requirements.
- It has no specific acoustic-noise requirements, the publisher considering such emissions from proximity devices not a relevant hazard. It also does not address all other characteristics needed for particular applications. [S1]

These are abstract-level boundaries, not a determination that any named product conforms or that an application is permitted. Neither the numerical electrical range nor complete formal subtype definitions were verified from the full standard.

## Technical subject areas and edition changes

The IEC's description identifies defined fault behaviour, functional-safety device classification, sensing and binary interface behaviour as core topics. It identifies these material changes in edition 3 [S1]:

- The safe state is **generally**, not unconditionally, the OFF-state; the scope and relationship with functional-safety standards were refined.
- Binary interface types were introduced, and functional-safety device types aligned with ISO 13849-1:2023 Annex O. The detail, compatibility rules and any exceptions require the actual text.
- EMC provisions were revised, with references to IEC 60947-5-2:2019 acceptance criteria and an additional criterion for defined safe behaviour. Do not infer a device's installation EMC immunity or pass conditions merely from this outline.
- Interlock type and coding level were adapted to ISO 14119; target-present and target-absent modes and switching-distance terminology were introduced. The treatment and verification of switching distance were revised, as were relevant PDDB test sequences.
- Electrical equipment class III provisions were refined, and “risk time” was replaced by “safety response time”. A revised example of a safety-related control system appears in the annex.

These are **publisher's change descriptions**, not an independent reading of the cited clauses, tests, fault lists or tables. A product standard addresses product behaviour and verification; it is not a wiring design, proof of a machine safety function or substitute for application hazard analysis. The exact manufacturer data and applicable full edition remain necessary to decide switch points, tolerances, verification and test applicability. [S1]

## Practical electrical and safety use

For an exact device/actuator combination, obtain the identification, manufacturer declaration including edition, safety manual, certificate where claimed, and external electrical specifications. Questions for selection and integration include:

1. Is this exact sensing function declared a PDDB, or only an ordinary proximity switch? What is the target, actuator pairing, mounting orientation, operating mode and usable switching-distance range? Does the environment or approach introduce tolerance, contamination or alignment concerns addressed by the manufacturer?
2. What supply range, polarity, protective device, output ratings, cable/connector pinout, grounding and fault restrictions are specified? Are the sensor outputs and receiving safety input electrically compatible, including any prescribed test-pulse and load conditions? Preserve the manufacturer's actual external connections and do not invent a universal OSSD circuit or pulse width.
3. Which outputs are safety-related, which are only status/analogue, and what is the declared safe state and safety response time for the chosen mode? Does the complete installation's response time suit its hazard and protective arrangement? Consult machine-specific analysis and applicable standards rather than infer this from a product label.
4. What are the specified environmental, EMC, installation and periodic-test conditions? Are required actuator, controller, interface modules or protections included in the certified scope? If used on a guard, also consider interlock mounting, defeat resistance, actuator coding, guard mechanics and any locking function under the applicable interlocking rules.

These are engineering evidence questions, not claims that all items are prescribed by this Part or that an unspecified design meets it. For a purchased sensor, request its published contract, safety documentation and prescribed external wiring; do not require disclosure or reconstruction of proprietary circuits, firmware or diagnostics.

### Functional-safety boundary

Part 5-3 is directly relevant because its intended product is a sensing subsystem in a safety-related control system [S1]. A supplier may specify a component or a more complete certified subsystem: identify the exact evaluated boundary, device variant, actuator, output and use conditions. Record any **actually declared** PL, SIL, PFH, mission time and related data without fabricating missing values. The safety function includes more than sensing: interfaces, logic and final elements, fault response and application assumptions matter. Machine-level design, integration and validation remain separate from product conformity.

The archived batch's assertions that PDDBs universally use redundant Category 3/4 architecture, fixed OSSD diagnostic pulse behaviour, and supply DC/HFT/PFH enabling PL d/e do not follow from the checked IEC abstract [L1, S1]. They must not be encoded as defaults. A device label or interface count alone does not prove diagnostic coverage, category, achieved PL/SIL, suitability for a guard, or an entire machine safety function. PL and SIL should not be converted automatically. The held-edition safety-source review independently warns that diagnostic measures and any PL/SIL correlation are conditional on system-level assessment, not simple device properties [L2].

## Related documents and category implications

- **IEC 60947-5-2**: companion proximity-switch provisions supplemented by this part; a Part 5-2 device is not automatically a PDDB. **IEC 60947-5-1:2024 Annex D** supplies the other explicitly named baseline for reed-contact magnetic switches [S1].
- **ISO 14119**: interlocking device context when the sensor is designed as part of an interlock; it does not turn every door switch into a PDDB [S1].
- **ISO 13849-1 / IEC 62061**: alternative safety-related control-system frameworks mentioned by IEC for the intended sensing subsystem; system assessment is still required [S1].
- **IEC 61496 / IEC TS 62998**: publisher-identified route for direct person-detection protective equipment, not automatic substitutes for this sensing-subsystem standard [S1].

In the existing electrical library, review `door_interlock`, `inductive_sensor`, and `limit_switch` candidates **only when the exact subtype and safety role justify it**. Ordinary process sensors, mechanical switches and an entire guard-lock assembly must not automatically inherit a PDDB declaration. Conversely an indirect platform-position sensor can be safety relevant even if its folder is an ordinary position sensor. Ask for variant-specific evidence, edition and operating conditions; avoid inventing category/schema changes or treating a library approval as machine validation. The category list is a project routing interpretation, not IEC classification [L3, S1].

## Holdings, recommendation and limitations

`NORMATIVE_CANDIDATES.json` lists no matched PDFs, extracted Markdown or memory files. A read-only filename search of `NORMATIVE/STANDARDS_PDF` and `NORMATIVE/extracted_html` likewise found no matching 60947-5-3 file; inventory search found no match. Therefore **no matching local full text was found**, not proof none exists anywhere. The local historical batch is a research lead, not a held edition or licensed text [L1].

**Recommendation: conditional acquisition/access**, not blanket purchase: obtain the applicable full 2026 text and companion clauses if a real PDDB product review, interlock design or clause-level question demands them; obtain the supplier-cited older edition when assessing its specific declaration and transition. First request the relevant device documentation. Parent should reconcile any additional holdings independently.

The IEC publisher abstract and lifecycle are primary evidence, not complete standard text. The IEC preview endpoint returned HTML rather than the expected PDF; no preview clauses were inspected [S3]. No specific supplier device/certificate, EN adoption or legal/harmonization status was verified. The abstract does not resolve all electrical limits, fault models, diagnostic tests, applicability exceptions or edition changes. The report cannot be used to declare conformity.

## Source key

- [S1] IEC, [IEC 60947-5-3:2026, publication 75167](https://webstore.iec.ch/en/publication/75167), abstract, publication details and lifecycle, accessed 2026-11-02 UTC; `evidence/iec75167.html` and text extract.
- [S2] IEC, [IEC 60947-5-3:2013, publication 3989](https://webstore.iec.ch/en/publication/3989), earlier edition record, accessed 2026-11-02 UTC; `evidence/iec3989.html`.
- [S3] [IEC preview link](https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTUtM3tlZDMuMH1lbi5wZGY=), returned HTML error rather than PDF, `evidence/preview-failed.html`.
- [L1] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md`, Part 5-3 section; historical research lead.
- [L2] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, conditional safety-framework findings based on separately held editions, not a Part 5-3 full-text review.
- [L3] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, category routing and evidence boundaries.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `78deac77637cdeba3a2c13d9e1df5382a620526375c6c6d72049d1137f7dfc12`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-5-3`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-5-3",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full 2026 and 2013 text and clause-level tests were not inspected; IEC preview returned an HTML error.", "EN adoption, legal or OJEU status and specific supplier declarations were not checked."],
  "local_holdings_summary": "No matching full text found in provided candidates or filename search of NORMATIVE PDFs and extracted HTML; historical batch is research reference only."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "standard": "IEC 60947-5-3",
  "access_time_utc": "2026-11-02T23:02:07Z",
  "sources": [
    {"id":"S1","url":"https://webstore.iec.ch/en/publication/75167","title":"IEC 60947-5-3:2026, edition 3.0","access_time_utc":"2026-11-02T23:02:07Z","evidence_path":"evidence/iec75167.html","evidence_kind":"public scope and publisher lifecycle","coverage_limitation":"Abstract and metadata only; not full text."},
    {"id":"S2","url":"https://webstore.iec.ch/en/publication/3989","title":"IEC 60947-5-3:2013, edition 2.0","access_time_utc":"2026-11-02T23:02:07Z","evidence_path":"evidence/iec3989.html","evidence_kind":"publisher lifecycle and public scope","coverage_limitation":"Not full text; old edition."},
    {"id":"S3","url":"https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTUtM3tlZDMuMH1lbi5wZGY=","title":"IEC edition 3 public preview attempt","access_time_utc":"2026-11-02T23:02:07Z","evidence_path":"evidence/preview-failed.html","evidence_kind":"failed preview","coverage_limitation":"HTML error returned, no preview inspected."},
    {"id":"L1","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md","title":"Historical control circuit batch, IEC 60947-5-3 section","access_time_utc":"2026-11-02T23:02:07Z","evidence_path":"original read-only path","evidence_kind":"old research lead","coverage_limitation":"Contains unverified or overgeneralized statements."},
    {"id":"L2","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md","title":"Safety source review","access_time_utc":"2026-11-02T23:02:07Z","evidence_path":"original read-only path","evidence_kind":"prior source review","coverage_limitation":"Not a review of full IEC 60947-5-3."},
    {"id":"L3","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md","title":"IEC scope research guide","access_time_utc":"2026-11-02T23:02:07Z","evidence_path":"original read-only path","evidence_kind":"project routing guide","coverage_limitation":"Not normative source."}
  ]
}
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[S1]: <https://webstore.iec.ch/en/publication/75167>
[S2]: <https://webstore.iec.ch/en/publication/3989>
[S3]: <https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTUtM3tlZDMuMH1lbi5wZGY=>
