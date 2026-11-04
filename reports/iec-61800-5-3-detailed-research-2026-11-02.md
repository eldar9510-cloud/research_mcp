---
{
  "format": 1,
  "metadata": {
    "id": "iec-61800-5-3-detailed-research-2026-11-02",
    "title": "IEC 61800-5-3 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61800-5-3?",
    "scope": "Detailed IEC 61800-5-3 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.485Z"
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
  "sourceDigest": "2fb0265d6b86ab6bdfd68f70edf27bdff601dcf19b58bc4c8dfe08b0c765c6e6",
  "proposalRevision": "e1fa688c00b826717aef9bdab715a920668a6f2cb04fdc386c01c679d52656b2"
}
---
# IEC 61800-5-3 — safety-related encoders

**Scope research, checked 2026-11-02 UTC; not a conformity assessment.** This report is based on IEC's public catalogue abstracts, not inspection of the full standard. The official preview request was blocked. Consequently detailed requirements, explicit exclusions, tests, normative references and amendment history cannot be exhaustively confirmed here.

## Identity and status

[IEC 61800-5-3:2021](https://webstore.iec.ch/en/publication/28614), *Adjustable speed electrical power drive systems — Part 5-3: Safety requirements — Functional, electrical and environmental requirements for encoders*, is an International Standard and product standard, edition 1.0, published 23 February 2021. IEC lists SC 22G and stability date 2027. Its catalogue identifies the base publication; no later amendment or edition is established by the visible record, which is not a complete independent amendment-history audit. A stability date is not an expiry date. The previously recorded ID 28614 was checked: its returned title and part really are 61800-5-3. [S1]

The historical batch also asserts EN IEC 61800-5-3:2023; this European adoption and its exact content/status were not independently verified. No conclusion is made about an OJEU listing or legal applicability. A supplier's older or differently qualified declaration must be retained as declared, not replaced with this publication date.

## Purpose and boundary

The standard addresses the reliability of safety-related position/motion feedback and the functional, electrical and environmental considerations for an encoder used in a safety function. It is relevant to encoder manufacturers and to integrators/validators of the safety-related feedback chain, but their responsibilities are not identical. IEC describes requirements and recommendations for design and development, integration and validation. [S1]

**Publisher scope:** it applies to a safety-related encoder, Encoder(SR), that is a sensor forming part of a safety-related power drive system (PDS(SR)); it is applicable where functional safety of the encoder is claimed and the encoder operates mainly in high-demand or continuous mode. The publisher also says it can be referred to and used for Encoder(SR) in other safety-related applications, for example position monitoring. Thus it is not restricted exclusively to drive applications, although the PDS sensor is its explicit primary application. [S1]

**Interpretation:** a general-purpose encoder used solely for ordinary control, without a functional-safety claim, should not automatically be classified as an Encoder(SR) under this stated applicability. Conversely, an encoder's physical presence in a drive does not by itself establish its safety role or conformity. A safety-related application outside a PDS is a potential use of the document, not proof that every such application must or does conform. The public abstract does not settle whether any particular low-demand use is excluded in all circumstances, or give a complete exclusions list; consult the full text for borderline cases. [S1]

The old batch asserts that no overarching IEC product standard exists for all non-safety encoders, and that this document universally closes that gap. The catalogue abstract does not establish that global negative or the historical causal account. Treat the general-encoder standard mapping as **unresolved**, not as a verified absence; seek subtype, application and supplier evidence. The batch's illustrated redundant sensor technologies, specific coupling design and claimed PL/SIL outcomes are not demonstrated by the abstract and must not become universal requirements. [L1, S1]

## Technical subjects and practical electrical use

IEC expressly frames the document around functional safety, electrical safety and environmental conditions, and the electrical/electronic/programmable electronic and mechanical parts of an Encoder(SR). It addresses the encoder as a subsystem of a safety-related system and its contribution to safety sub-functions. IEC 61800-5-2:2016 requirements for PDS(SR) apply to Encoder(SR) as applicable; Part 5-3 supplies additional or different encoder requirements. [S1]

This scope justifies investigating the following **application questions**, not claiming they are verbatim clauses or prescribed test methods:

- What exact encoder variant, measuring principle, output protocol and safety-rated interface are intended, and is the drive/receiver compatible with the supplier-defined interface and configuration?
- What supply, electrical connections, protective measures, cable, shielding, termination and installation constraints does the manufacturer prescribe for that variant and environment? Which of these are safety-use conditions rather than ordinary performance characteristics?
- What mechanical coupling, mounting, alignment, permissible speed, environmental exposure and maintenance conditions are specified, including measures against loss or corruption of the physical motion-to-sensor relationship?
- Which safety sub-function uses the feedback, how are encoder and drive diagnostic reactions handled, and what delays and fault assumptions are declared for the complete application?
- Which tests, validation records, certificate, safety manual and configuration restrictions support the actual product and intended use?

These are selection and integration prompts; the publicly inspected abstract does not establish individual test limits, fault exclusions, a particular sensing architecture, or exact construction requirements. Product design/type testing should be distinguished from the integrator's compatibility, mounting and system-validation work. For a purchased component, obtain its manufacturer-published external contract; do not require disclosure or reconstruction of proprietary circuits or internal firmware merely for intake. [S1, L2]

## Functional-safety claim limits

An ordinary encoder, an Encoder(SR), and an encoder/drive assembly certified for a defined safety sub-function are different evidential objects. Ask whether the claimed certificate covers the exact encoder, mechanical attachment, interface, receiving drive and function, or only a limited combination; obtain the corresponding safety manual, declared metrics, fault assumptions and conditions. The existence of Part 5-3, a 'safety encoder' label or redundant-looking signals alone supplies no automatic diagnostic coverage, architecture category, PL or SIL. Do not convert or manufacture missing product data.

The machine integrator still defines and validates the complete safety function, including sensing, processing, actuation, interfaces and mechanical implementation, against the applicable machine risk assessment and chosen safety framework. ISO 13849-1 may be relevant to a PL-based machine system; IEC 62061 is another machinery functional-safety route. Neither is automatically proven by a component claim. IEC 61800-5-2 addresses PDS(SR), not blanket removal of contactors or replacement of stopping, holding or electrical isolation measures; the local safety-source review anchors that caution to the held **2007** edition and does not establish all current requirements. [S1, S2, L3]

## Related documents and roles

- **IEC 61800-5-2:2016**, *Safety requirements — Functional*: product requirements and recommendations for safety-related adjustable-speed power drive systems; its IEC abstract states the IEC 61508 framework and subsystem role. Part 5-3 calls its requirements applicable to Encoder(SR) as appropriate, with additional or different encoder requirements. Verify the exact editions and references in the applicable standard and supplier documents. [S1, S2]
- **IEC 61800-5-1:2022**, *Safety requirements — Electrical, thermal and energy*: addresses relevant drive-system hazards and excludes driven equipment except interface requirements. It is not a substitute for demonstrating an encoder safety sub-function. IEC's page identifies corrections incorporated through December 2025. [S3]
- **IEC 61508 series:** Part 5-3 explicitly uses its functional-safety framework; a reference to that framework is not proof that an individual product or complete machine has a particular integrity level. [S1]
- **ISO 13849-1 / IEC 62061:** potential machine safety-system design and validation routes; consult the applicable editions and actual function. Relatedness here does not assert a normative-reference relationship in Part 5-3, whose full reference list was not inspected. [L3]

## Library implications and local holdings

For `encoder`, distinguish ordinary feedback from a safety-related variant with a stated function, and capture exact model/firmware, supplier declaration and edition, interface, environmental/installation limits, safety manual, permitted couplings and compatibility with receiving equipment. For `vfd` and `motor`, assess the relevant drive/encoder/motor combination and external mounting where feedback is relied upon; the drive's STO claim alone does not establish safe position/speed feedback. These are evidence questions, not new schema fields or approval rules. [S1, L2, L3]

The supplied `NORMATIVE_CANDIDATES.json` lists no matching PDF, extracted text or memory candidate; a filename search under `/media/eldar/disk_2/Machine_concept/NORMATIVE` found no matching 61800-5-3 file. Therefore **no matching full text was found**, not proof that no copy exists anywhere. The historical batch is research reference only. The separate held IEC 61800-5-2:2007 text referenced by the local review is not a holding of 5-3 or of the 2016 edition. [L1, L3]

**Recommendation:** conditional acquisition/access to the exact 5-3 edition if an actual safety encoder integration, detailed requirement or test question needs resolving; otherwise public scope plus supplier evidence is a useful routing starting point, not a reason for an automatic purchase. Independently verify European adoption and the exact supplier-cited edition when needed.

## Sources and limitations

- [S1] IEC catalogue, [IEC 61800-5-3:2021](https://webstore.iec.ch/en/publication/28614), public abstract and product details, inspected 2026-11-02 UTC; saved `evidence/iec28614.html`.
- [S2] IEC catalogue, [IEC 61800-5-2:2016](https://webstore.iec.ch/en/publication/24556), abstract; `evidence/iec24556.html`.
- [S3] IEC catalogue, [IEC 61800-5-1:2022](https://webstore.iec.ch/en/publication/62103), abstract; `evidence/iec62103.html`.
- [L1] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch05-drive-motor-gemini.md`, sections 61800-5-3 and generic encoder anomaly, historical lead only.
- [L2] `CLAUDE.md` in main project, Purchased-component boundary; `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, library routing.
- [L3] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, STO and safety-framework assessment, explicitly limited to named held editions.

The official IEC preview endpoint returned HTTP 403; its error response is retained as `evidence/official-preview.pdf` despite the extension (it is HTML, not a PDF). No bypass attempted. No full-clause review, exhaustive exclusions/technical tests, current EN adoption, current legal status, or supplier-specific assessment was possible. Scope-level research is useful but cannot determine conformity or replace the applicable standard and safety documentation.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `7b8f48edc9223ac787d2f3ed8513de83677b1117ac0ea883b5ae64de888c004a`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61800-5-3`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61800-5-3",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and detailed tests/exclusions not inspected; official preview returned 403",
    "EN adoption and legal status not independently verified",
    "General non-safety encoder standards landscape not exhaustively established"
  ],
  "local_holdings_summary": "No matching 61800-5-3 full text found in candidate list or filename search; 61800-5-2:2007 is a separate part."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/28614",
    "title": "IEC 61800-5-3:2021 ed 1.0",
    "access_time_utc": "2026-11-02T23:04:52.997922+00:00",
    "evidence_path": "evidence/iec28614.html",
    "kind": "public scope",
    "limitation": "Abstract and catalogue only; full standard not inspected"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/24556",
    "title": "IEC 61800-5-2:2016",
    "access_time_utc": "2026-11-02T23:04:52.997922+00:00",
    "evidence_path": "evidence/iec24556.html",
    "kind": "public scope",
    "limitation": "Abstract only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/62103",
    "title": "IEC 61800-5-1:2022",
    "access_time_utc": "2026-11-02T23:04:52.997922+00:00",
    "evidence_path": "evidence/iec62103.html",
    "kind": "public scope",
    "limitation": "Abstract only"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxODAwLTUtM3tlZDEuMH1iLnBkZg==",
    "title": "IEC 61800-5-3 official preview",
    "access_time_utc": "2026-11-02T23:04:52.997922+00:00",
    "evidence_path": "evidence/official-preview.pdf",
    "kind": "failed preview",
    "limitation": "HTTP 403; saved content is HTML"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch05-drive-motor-gemini.md",
    "title": "Historical drive research",
    "access_time_utc": "2026-11-02T23:04:52.997922+00:00",
    "evidence_path": "source remains at original path",
    "kind": "old research lead",
    "limitation": "Unverified and truncated historical notes"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Safety source review",
    "access_time_utc": "2026-11-02T23:04:52.997922+00:00",
    "evidence_path": "source remains at original path",
    "kind": "local review",
    "limitation": "Held editions only, not current-edition review"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/CLAUDE.md",
    "title": "Main instructions",
    "access_time_utc": "2026-11-02T23:04:52.997922+00:00",
    "evidence_path": "source remains at original path",
    "kind": "local instruction",
    "limitation": "Purchased-component boundary"
  }
]
`````
