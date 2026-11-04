---
{
  "format": 1,
  "metadata": {
    "id": "iec-61439-2-detailed-research-2026-11-02",
    "title": "IEC 61439-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61439-2?",
    "scope": "Detailed IEC 61439-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:29.650Z"
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
  "sourceDigest": "1018666b2cfeac01c4913216f6d8c2b3f1f7dc627776afcea46ea2ec2b231378",
  "proposalRevision": "af67dbe577a1cad38631ec46673a13b28c5f551f38dd7f02cb450566053e5557"
}
---
# IEC 61439-2 — power switchgear and controlgear assemblies

**Publication check:** 2026-11-02 UTC. **Research level:** publisher scope and change summary, not a full-clause review. This is a routing and evidence guide, not a conformity, safety-function or legal determination.

## Identity and publication

IEC 61439-2:2020, *Low-voltage switchgear and controlgear assemblies – Part 2: Power switchgear and controlgear assemblies*, is an IEC International Standard, edition 3.0, published 22 July 2020. IEC states that it cancels and replaces the 2011 second edition and is a technical revision [1]. IEC's product record labels it published and lists a stability date of 2030; a stability date is not a guaranteed expiry or replacement date. No separate amendment or corrigendum to Part 2 was established from the inspected public record; the dynamic lifecycle information was not independently reconciled, so do not treat that as proof none exists. A supplier's declared edition and any national/EN adoption must be checked separately; no OJEU status was researched.

**Part 1 relationship.** IEC 61439-1:2020 is the general-rules part: definitions and service conditions, construction, characteristics and verification. IEC says assembly conformity is determined using the relevant Part 2-onward product part together with the cited Part 1 requirements, and Part 2 applies to assemblies not covered by Part 3 onward [2]. Thus Part 1 alone is not a complete assembly product route, and Part 2 is not used as a replacement for the cited Part 1 rules. The particular product part must first be selected for the actual assembly. IEC's Part 1 page identifies its own edition 3, published 5 May 2020, with corrigenda of December 2021 and September 2023 included in its copy; those are **Part 1**, not Part 2, corrections [2].

The historical batch claimed the Part 1 record 32338 also identified Part 2 [L1]. Direct inspection shows that URL is Part 1; the separate Part 2 record is 30043 [1,2]. The batch's blanket machine-controller-versus-distribution dichotomy is not established by those scopes; Part 2 expressly includes control of energy-consuming equipment [1]. Conversely, the presence of a cabinet or busbar alone does not establish that an entire machine cabinet is a PSC assembly.

## What it covers and why

A PSC assembly is an integrated low-voltage power switching/control assembly, not merely an empty sheet-metal housing or an isolated breaker. The engineering problem is whether the assembled combination of components, conductors, interfaces and construction can safely perform at its declared ratings and service conditions. It is relevant to assembly system designers and original manufacturers, panel builders and purchasers who must specify, integrate or obtain evidence for the actual assembly.

IEC's public Part 2 scope lists these characteristics [1]:

- rated voltage not exceeding **1,000 V AC or 1,500 V DC**, and incoming supply nominal frequency not exceeding **1,000 Hz**;
- indoor or outdoor use; stationary or movable construction; enclosed or unenclosed construction;
- connection with generation, transmission, distribution or conversion of electrical energy, control of energy-consuming equipment, and associated data processing;
- special service, including ships or rail vehicles, provided other relevant specific requirements are also met. IEC names IEC 60092-302-2 as supplementary for ships.

These are scope boundaries, **not** evidence that an arbitrary assembly meets its ratings. The scope embraces more than a conventional distribution board; it does not say every control cabinet is a PSC assembly. Select the applicable assembly product part by its actual function and configuration, including any more-specific Part 3 onward route [2]. The public abstract inspected does **not** enumerate a complete explicit exclusion list. In particular, no assertion is made that machine control cabinets are categorically excluded or that a particular subtype is universally excluded; consult the complete scope of the applicable editions for exclusions and any overlap. Public preview access returned an HTML error rather than a PDF [E1], so these boundaries are not a substitute for full text.

Stand-alone devices have their own product standards. IEC clarifies for Part 1 that power converters, switch-mode supplies, UPSs and adjustable-speed drive systems are tested to their respective product standards; when incorporated into an assembly, their **incorporation** is addressed by the IEC 61439 series [2]. The presence of such a product neither removes its own conditions nor proves the resulting assembly complies.

## Technical subject areas and verification

The IEC publisher describes Part 1 as covering general service conditions, construction, characteristics and verification [2]. Part 2 provides PSC-specific requirements; its 2020 change summary expressly identifies [1]:

- internal separation forms and protection against contact with portions remaining live when a functional unit is switched off;
- temperature-rise verification, including specified comparison/calculation approaches and active cooling cases;
- consideration of degree of protection with active cooling; and
- added annexes for assemblies in photovoltaic installations.

These are verified topics, **not a complete table of requirements or a blanket list of permitted methods**. They explain why layout, actual loading, ventilation and enclosure configuration matter: installing a fan, changing a functional unit or rearranging connections can change the evidence needed. Thermal or IP statements for an empty cabinet or individual device cannot by themselves prove performance of the complete configured PSC assembly. Obtain the applicable full Parts 1 and 2 and the original assembly system's documentation before choosing a design-verification method or claiming its conditions are satisfied. The historical batch identifies design and routine verification, but its claimed counts and method applicability were not independently checked against full text here [L1]. No unit is asserted verified merely because it uses components from a verified design.

At procurement or integration, request exact assembly identity, drawings and ratings, the relevant design-verification evidence and routine-verification record, and conditions/limitations for the supplied configuration. Questions include intended supply and frequency, current and concurrent loading, fault level and protective device coordination, degree of protection, ambient/installation conditions, protective bonding, termination and any required cooling or segregation. These are engineering evidence questions, not a claim that every answer or verification method is prescribed identically in every case. Determine separately who is responsible for the original design, assembly manufacture, changes and installed equipment; do not infer responsibility or conformance solely from an empty-enclosure certificate or a component mark.

## Application and functional safety

For a machine power panel, first describe the actual functional boundary: for example incoming distribution section, motor/control circuits and any separate assembly product. Then compare it with Part 2 and other assembly-part scopes and the machinery electrical-equipment route. IEC 60204-1 addresses electrical equipment of machines; its relevance and interaction with a particular assembly must be assessed on the machine and applicable editions. It is not evidence that Part 2 can never apply, nor does Part 2 replace machine electrical and safety-function assessment. No legal precedence or harmonized status is established here.

ISO 13849 becomes relevant **conditionally** if the assembly contains or interfaces with safety-related parts of a machine control system assessed under that standard. A PSC assembly may house contactors, safety controllers, wiring or power devices participating in a safety function; ordinary power distribution may have no such role. Part 2 concerns the assembly product and its defined characteristics, not an automatic ISO 13849 Category, diagnostic coverage, PL or SIL for the contained function. Obtain exact supplier safety documentation for the actual safety-rated subsystem where applicable, external connection and operating restrictions, and assess the complete sensor–logic–actuator function, installation and validation separately. Do not convert a generic assembly declaration into safety data or require disclosure of proprietary internal electronics of bought devices. The local safety-source review documents why component attributes and safety-function metrics are not interchangeable [L2].

## Related routes and library implications

- **IEC 61439-1:** the general rules used with the selected product part [2]. More specific IEC 61439 parts must be checked before defaulting to Part 2 [2].
- **IEC 62208:** empty enclosures are distinct from the completed assembly; no shell claim establishes an assembled board's compliance. The historical batch identifies this as an empty-enclosure standard [L1]; its particular edition was not checked for this report.
- **IEC 60204-1:** machinery electrical equipment, not automatically a substitute for the applicable assembly product route. Its complete scope and any applicable national adoption should be examined for the particular machine.
- **ISO 13849:** system-level safety-related control design/validation where selected for a relevant safety function, distinct from the assembly's product verification [L2].

Library routing is potentially relevant to `enclosure` and assembled power/distribution equipment, and to external use conditions of `main_switch`, `circuit_protection`, `contactor`, terminals and power supply components when incorporated into a PSC assembly. These categories are prompts, not automatic Part 2 classifications. Record the supplier's exact article, claimed standard and edition, drawings and ratings, short-circuit and thermal coordination information, connection and mounting conditions, and the documented assembly configuration where available. Treat a purchased component as a black box with its published external contract; do not infer its internal implementation, nor transfer its product conformance to the assembled system. Nothing in this report changes library approval or schema.

## Local holdings and acquisition

`NORMATIVE_CANDIDATES.json` lists no matched PDFs, extracted Markdown or memory files. A filename search under the local `NORMATIVE` tree also found no matching standard file; it found only an unrelated image with a coincidental number sequence. Therefore **no matching full Part 2 text found** in the checked local holdings, not proof that no copy exists elsewhere. The historical batch is a research lead, not licensed Part 2 full text. No held Part 2 edition or EN adoption can be verified from it.

**Recommendation: conditional acquisition/update**, not automatic purchase. If the project designs, substantially modifies, specifies or accepts a PSC assembly, obtain the applicable complete Part 2 and referenced Part 1 editions and actual manufacturer verification/installation evidence; establish exact exclusions, change control and permissible verification methods. If only buying individual devices or an empty enclosure and no PSC assembly question arises, defer acquisition and retain manufacturer documentation instead. Check supplier-declared editions and jurisdictional applicability separately.

## Sources and limitations

[1] IEC, [IEC 61439-2:2020 publisher record](https://webstore.iec.ch/en/publication/30043), public abstract, product details and revision summary; accessed 2026-11-02 UTC. Saved `evidence/iec30043.html`.

[2] IEC, [IEC 61439-1:2020 publisher record](https://webstore.iec.ch/en/publication/32338), public abstract and product details; accessed 2026-11-02 UTC. Saved `evidence/iec32338.html`.

[L1] `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md`, sections on 61439 and 62208; historical, secondary lead, not a primary clause source.

[L2] `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, targeted review and its cited held ISO 13849-1:2023 text; secondary summary with edition-specific primary anchors, not a fresh full-scope ISO review.

[E1] IEC's public preview endpoint linked on [1] returned HTML rather than the preview PDF; retained `evidence/iec-preview.pdf` is the actual error response despite the extension. Google and DuckDuckGo search attempts returned challenges (`evidence/search.html`, `evidence/ddg.html`); the directly linked IEC product records were accessible. Source access limited to public abstracts; no full requirements, complete exclusions, legal listing or complete lifecycle history were inspected. Consequently the report is **partial** as regards full-clause analysis and exhaustive exclusions, though core scope and Part 1 relationship are primary-source supported.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `cee71531f98f92aea5ffe2132280d0113b0beb76d1b86954712215570514f8dc`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61439-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61439-2",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full Part 2 and complete explicit exclusions unavailable; publisher preview failed",
    "No exhaustive amendment/lifecycle, EN adoption or OJEU audit",
    "No product or assembly-specific verification"
  ],
  "local_holdings_summary": "No matching full Part 2 PDF, extraction or memory candidate found in checked NORMATIVE holdings; historical batch is research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/30043",
    "title": "IEC 61439-2:2020 edition 3",
    "access_time": "2026-11-02T23:05:12.407796+00:00",
    "evidence_path": "evidence/iec30043.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract and revision summary; no full text or complete lifecycle audit"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/32338",
    "title": "IEC 61439-1:2020 edition 3",
    "access_time": "2026-11-02T23:05:12.407796+00:00",
    "evidence_path": "evidence/iec32338.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract only; corrigenda identified are for Part 1"
  },
  {
    "url": "https://webstore.iec.ch/en/iec_catalog/product/preview/",
    "title": "IEC 61439-2:2020 publisher preview endpoint",
    "access_time": "2026-11-02T23:05:12.407796+00:00",
    "evidence_path": "evidence/iec-preview.pdf",
    "evidence_kind": "failed preview",
    "coverage_limitation": "HTML error returned rather than PDF"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "title": "Historical batch 8 research",
    "access_time": "2026-11-02T23:05:12.407796+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Secondary and contested; not full standard"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Safety source review",
    "access_time": "2026-11-02T23:05:12.407796+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "evidence_kind": "local research review",
    "coverage_limitation": "Targeted review of held edition, not a new full ISO assessment"
  }
]
`````
