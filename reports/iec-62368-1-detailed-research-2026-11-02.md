---
{
  "format": 1,
  "metadata": {
    "id": "iec-62368-1-detailed-research-2026-11-02",
    "title": "IEC 62368-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 62368-1?",
    "scope": "Detailed IEC 62368-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:25.523Z"
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
  "sourceDigest": "11c04fa33f0bc0c67a041883ef2eaee5cbf5f279996218e8da38ec65e135354d",
  "proposalRevision": "a8499a7254f70907fe2af12d4a36d2a9bcb5ad71fb50e854a5d9b23ba59b88de"
}
---
# IEC 62368-1 — audio/video and ICT equipment safety

**Research check:** 2026-11-02 UTC. **Evidence level:** IEC publisher catalog descriptions and publication history, not full-clause inspection. This is a routing and evidence guide, not a compliance determination or machinery safety validation.

## Identity and publication status

The exact assignment is **IEC 62368-1**, *Audio/video, information and communication technology equipment – Part 1: Safety requirements*, an International Standard of IEC TC 108. The IEC catalog identifies **IEC 62368-1:2023, edition 4.0**, published 2023-05-26; the page identifies a **corrected version 2025-08**. Its lifecycle data lists that base publication as published and the 2018, 2014 and 2010 editions as revised. It also lists IEC 62368-1/AMD1 as **under development**, approved for CDV, with forecast publication 2027-12-31; this is not a published amendment and its forecast is not a commitment. The observed lifecycle does not list a published amendment to the 2023 base; the precise content of the 2025 correction was not inspected. [1]

IEC's 2018 edition is the third edition; it superseded the 2014 second edition and was itself revised. The page separately identifies its 2020 corrigendum. [1, 2] A supplier's certificate may legitimately cite a different edition: record the actual article and certificate wording and verify its coverage, rather than replacing its date with 2023. An IEC edition is not automatically an EN adoption or an OJEU listing. No national adoption or legal status was checked.

## What it does and who needs it

The standard is a **product safety** route for audio/video and information and communications equipment. IEC describes a hazard-based approach: identify and classify energy sources, prescribe safeguards against those sources and provide requirements and application guidance for safeguards. Their purpose is to reduce likelihood of pain or injury and, for fire, property damage. IEC cautions that the informative safety principles in the introduction are not a substitute for the detailed requirements. [1]

For product designers, safety test laboratories, purchasers and machine integrators, the practical value is a shared product-safety evidence route: assess the equipment and the manufacturer's stated conditions rather than assuming every signal port or external power connection is inherently safe. It is not a complete instruction set for designing the surrounding machine or assessing its control-system safety functions. The interpretations and intake questions below are not additional quotations of normative requirements.

## Scope and limits

The directly inspected **2018** publisher scope applies to safety of electrical and electronic equipment in audio, video, ICT, and business and office machines, with rated voltage not exceeding **600 V**; it explicitly excludes requirements for performance or functional characteristics. [2] Outdoor equipment, optical radiation, insulating liquids, work cells and wireless power transmitters are among the subjects for which IEC identifies additions in the 2018 revision relative to 2014; that list is **not** proof every individual product of those types falls within scope. [2]

The **2023** publisher abstract confirms the product safety and energy-source/safeguard approach but, as displayed, does not reproduce the complete scope, exclusions, detailed applicability, or rated-voltage boundary. [1] Do not transfer every 2018 scope limit or revision change to the 2023 edition without checking that edition's actual scope. The IEC public preview link returned HTTP 403; no workaround was attempted. Consequently exact exclusions, component-versus-end-product boundaries, any special installation-environment conditions and whether companion documents are mandatory for a particular device remain open. Nor does the broad title by itself establish that an industrial HMI, all power supplies or all communications devices are in scope.

## Technical areas and practical interpretation

The checked 2023 abstract supports the general analysis of **energy sources and safeguards**, including injury and fire protection. [1] The older publisher description adds the subject areas listed above, but does not provide a complete table of tests or construction criteria. [2] In practical product review, this means asking what portions of an equipment design expose people or property to hazardous energy and what evaluated safeguards protect them under the conditions covered by the actual product assessment. Do not use this summary to prescribe clearances, insulation type, protective bonding or test limits: their exact treatment must be read in the applicable edition and product assessment.

Useful questions for a bought device are:

- Is the model and its specific variant, power option and accessories within the declaration or test certificate's scope? Which dated standard and national deviations are actually cited?
- What input and output ratings and permitted operating conditions does the manufacturer specify? Are protective earth, external fusing, wiring, mounting, enclosure, cooling or restricted-access conditions required by the manufacturer? Record the answer from its documentation rather than presuming a particular requirement from the catalog abstract.
- For an external PSU and its load, are output ratings and interface conditions compatible? What does the supplier explicitly declare about isolation and permissible connections, and what evidence supports it? Do not derive an isolation classification or an installation permission merely from the standard number.
- Is the device a complete product or a component intended for incorporation in another device? A component certification may be conditional on the end-product enclosure, thermal environment or other assembly conditions; check the actual certificate and installation instructions rather than presuming either unconditional coverage or non-coverage.
- For an HMI or communications device, check the accessible ports, connectivity, environmental rating, supply and mounting requirements against the actual intended use. Product safety evidence does not itself establish EMC performance, network interoperability or installed-system safety.

These are **selection and evidence questions**, not a claimed list of normative clauses. Product construction and laboratory assessment belong to the applicable product standard and actual assessment; wiring selection, protective coordination and machine integration remain application-specific. The library treats purchased products as black boxes: retain declared external contracts and mandated external parts without demanding internal circuits, component values or firmware implementation.

## Machinery functional safety

The IEC abstract describes protection against product energy hazards, not a performance-level determination for a safety-related control function. [1] A device conforming to this standard is not thereby a certified safety subsystem, and the reference alone establishes no diagnostic coverage, Category, PL, SIL, failure rate, safe torque off function or permission to use an ordinary interface as safety-rated.

If an HMI, power supply or network interface participates in a safety function, identify its actual function and boundaries. Obtain the exact manufacturer's functional-safety manual, claimed integrity and conditions **if such claims exist**, then evaluate the whole safety-related function and its integration under the applicable machinery framework. A standard HMI used only for status display may have no safety-related role; product safety remains distinct from whether a display is used to execute a protective function. Lack of a functional-safety declaration must not be filled by extrapolation from IEC 62368-1.

## Related standards — different jobs

- **IEC 61204-7:2016**, *Low-voltage switch mode power supplies – Part 7: Safety requirements*, has its own scope for stand-alone and component SMPS and specified input/output limits and exclusions. Its publisher page names IEC 62477-1 as a reference document. [3] It is a separate possible supply-product route, not proof that every supply also needs 62368-1 or that one route is universally redundant. Determine the particular product and declared evidence.
- **IEC 61010-1 and IEC 61010-2-201** form a different measurement/control/laboratory equipment route; the earlier local primary-source check notes that the latter is used in conjunction with the former. A retained manufacturer example declares these and other standards for a particular industrial supply, not IEC 62368-1. This is a counterexample to a universal 62368-1 PSU rule, not a general finding for every model. [4]
- **IEC 60204-1** concerns electrical equipment of machines; the actual applicable machine installation provisions and risk assessment are separate from an electronics product's safety certificate. **ISO 13849-1** concerns machinery safety-related control systems, not a substitute for product energy-hazard safety. These are role distinctions for follow-up, not assertions that either necessarily applies to every item or that their full clauses were inspected in this research.
- **IEC 60950-1 and IEC 60065** are historical ICT and audio/video product-safety routes that may appear in older supplier records. The exact replacement relationship and transitions were not independently established in this check; do not infer current legal acceptance from their presence or absence.

## Library implications

Potential routes include `hmi_panel`, communications-capable control equipment and some `power_supply` products, depending on exact product and declared scope. Category names are not evidence that the standard applies; distinguish a standard industrial controller from an ICT product and an external supply from a complete system. For intake, preserve model/variant, dated declaration and certificate, output and port characteristics, physical/environmental constraints, external protection and installation conditions. Ask whether a safety function is actually claimed and retain its separate evidence if so. Do not make the standard an automatic category-wide requirement or a product-approval verdict.

The original `batch01-power-gemini.md` explicitly reports that its detailed 62368-1 section was missing, leaving only a truncated PSU comparison. It is therefore a lead, not a full research source. [5] The later source review specifically rejects a blanket three-standard PSU rule; actual supplier evidence controls the recorded declaration. [4]

## Local holdings and next action

`NORMATIVE_CANDIDATES.json` contains no matched PDF, extracted markdown or memory candidate; a filename search under the local NORMATIVE tree found no `62368` match. Thus **no matching full text was found**, not proof that no copy exists anywhere or under a non-obvious filename. No held edition or clause was inspected. The archived batch and corrections are research references, not held normative text. [4, 5]

**Recommendation: conditional acquisition / lower priority**, not blanket purchase. Obtain the applicable licensed edition and any relevant national adoption only when an actual ICT/HMI/PSU assessment requires the exact scope, exclusions, safeguards or clause-based design/test decision that public descriptions and supplier documentation cannot answer. Ask for supplier certificates and installation instructions first for routine purchased-device intake; separately verify publication status at the time of use. Open questions: exact 2023 scope and exclusions; content of corrected version; whether the specific supplier certificate covers the planned variant and application; applicable regional adoption and legal status.

## Sources and limitations

1. IEC catalog, [IEC 62368-1:2023](https://webstore.iec.ch/en/publication/69308), title, description, product details and embedded lifecycle data; saved `evidence/iec-2023.html` and text view. Publication/correction and development status as shown on check date; not full standard.
2. IEC catalog, [IEC 62368-1:2018](https://webstore.iec.ch/en/publication/27412), exact 2018 scope, revision description and lifecycle; saved `evidence/iec-2018.html` and text view. Older edition; not a substitute for the 2023 scope.
3. IEC catalog, [IEC 61204-7:2016](https://webstore.iec.ch/en/publication/26155), public SMPS scope; saved `evidence/iec-61204-7.html` and text view. Not a determination of applicability to a specific product.
4. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md`, sections 1 and 3, including links to the IEC 61010-2-201 catalog and exact Phoenix manufacturer example. Secondary local review used as bounded context; supplier document not independently rechecked here.
5. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md`, opening warning and surviving comparison fragment. Historical, truncated lead.

IEC preview access failed with HTTP 403 at `https://preview.iec.ch/pub/pdf/preview/info_iec62368-1%7Bed4.0%7Db.pdf`; the failure response is retained as `evidence/iec-preview.pdf` (HTML error, not a PDF). No licensed full text, full clause requirements, supplier certificate for a target device, EN adoption or OJEU list was inspected.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `0c3226fb198c60d700c5e85de8f855fde2ccb8e7f06e3fce7bfc7420327eaebb`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-62368-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 62368-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "2023 full scope and clauses not inspected; IEC preview returned HTTP 403",
    "No exact product certificate, EN adoption or OJEU legal status checked",
    "2025 corrected-version content not inspected"
  ],
  "local_holdings_summary": "No filename match in NORMATIVE and no listed candidate PDFs, extracted text or memory; no full text found."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/69308",
    "title_edition": "IEC 62368-1:2023 edition 4 corrected 2025-08",
    "access_time_utc": "2026-11-02T23:01:17.256263+00:00",
    "evidence_path": "evidence/iec-2023.html",
    "evidence_kind": "public scope and lifecycle",
    "coverage_limitation": "Catalog abstract only; no complete scope or clauses"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/27412",
    "title_edition": "IEC 62368-1:2018 edition 3",
    "access_time_utc": "2026-11-02T23:01:17.256263+00:00",
    "evidence_path": "evidence/iec-2018.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Older edition, not 2023 scope"
  },
  {
    "url_or_path": "https://webstore.iec.ch/en/publication/26155",
    "title_edition": "IEC 61204-7:2016",
    "access_time_utc": "2026-11-02T23:01:17.256263+00:00",
    "evidence_path": "evidence/iec-61204-7.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Related standard only"
  },
  {
    "url_or_path": "https://preview.iec.ch/pub/pdf/preview/info_iec62368-1%7Bed4.0%7Db.pdf",
    "title_edition": "IEC 62368-1:2023 publisher preview",
    "access_time_utc": "2026-11-02T23:01:17.256263+00:00",
    "evidence_path": "evidence/iec-preview.pdf",
    "evidence_kind": "failed preview request",
    "coverage_limitation": "HTTP 403; saved response is HTML, not PDF"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title_edition": "Bounded primary-source checks",
    "access_time_utc": "2026-11-02T23:01:17.256263+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Prior review; cited manufacturer example not independently rechecked"
  },
  {
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md",
    "title_edition": "Historical batch 01 power",
    "access_time_utc": "2026-11-02T23:01:17.256263+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Truncated; detailed 62368-1 section missing"
  }
]
`````
