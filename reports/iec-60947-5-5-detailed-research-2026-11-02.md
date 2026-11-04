---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-5-5-detailed-research-2026-11-02",
    "title": "IEC 60947-5-5 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-5-5?",
    "scope": "Detailed IEC 60947-5-5 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.776Z"
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
  "sourceDigest": "dc41562fad49b74e4139d4e51b168919e7200285030c541075a1c57979568051",
  "proposalRevision": "5d6e9906a1d3b3a5a4aad9813d93681b1dd5a659fb3f39d5795b6324b96722a5"
}
---
# IEC 60947-5-5 — electrical emergency-stop device with mechanical latching

**Checked 2026-11-02 UTC.** This is product-scope research, not a clause-by-clause conformity review, product approval, or machine safety validation. IEC’s public abstract and edition metadata were inspected, not the complete 2026 standard. Local held ISO 13850:2015 was inspected separately as an edition-specific application source.

## Identity and status

IEC 60947-5-5:2026, *Low-voltage switchgear and controlgear – Part 5-5: Control circuit devices and switching elements – Electrical emergency stop device with mechanical latching function*, is an International Standard. IEC identifies it as edition 2.0, published 18 February 2026; it cancels and replaces the first edition of 1997 and is a technical revision [S1]. The publisher identifies 2028 as a **stability date**, not a withdrawal date or a promise that a national adoption is valid until then. The public page did not establish a separate subsequent amendment or corrigendum; no exhaustive amendment/register audit was made. IEC publication is not automatically an EN adoption or current OJEU listing.

The historical batch correctly led to the exact IEC 2026 record but its asserted detailed test mechanics, universal applications and placement numbers are not substantiated by the abstract. The historical IEC product ID 3989 resolves to **IEC 60947-5-3:2013**, not this standard [S4]; it is not evidence of the present part. ISO 13850:2015 cites IEC 60947-5-5:2005 [L1 §2], an edition reference in that historical document; do not silently replace it or assume equivalence to a 2026 supplier declaration.

## Purpose, scope and boundaries

IEC states that this part provides detailed specifications for electrical and mechanical construction and testing of emergency-stop devices with a mechanical latching function [S1]. These are electrical control-circuit devices or switching elements used to **initiate a signal**, not the entire equipment needed to stop a machine. They may have their own enclosure and are installed according to their product documentation. The intended readers include product designers/testers and engineers selecting such an initiating device; the latter must still establish the exact supplied configuration and application conditions.

The IEC scope expressly excludes emergency-stop devices for non-electrical control applications such as hydraulic or pneumatic, and devices without a mechanical latching function. It says a conforming device can also form **part** of an emergency switching-off means in accordance with IEC 60364-5-53; that does not make emergency stopping and switching off interchangeable or establish that the full means complies [S1]. The scope says specific acoustic-noise requirements are not addressed. It does not imply that every emergency stop on every machine is covered simply because it is red, nor that every possible electrical stop actuator without a latch qualifies.

**Device vs function:** the device generates the initiating signal; the broader emergency-stop function encompasses the control system, its response, and the affected machine operation. The locally held ISO 13850:2015 specifies machinery emergency-stop functional requirements and design principles independent of energy type; it addresses more than ergonomics or colour [L1 §1, §4]. Its §4.3.3 calls for direct opening with mechanical latching for electrical emergency-stop devices and references IEC 60947-5-5; that is an ISO 2015 application statement, not proof of every 2026 product clause. ISO also discusses the machine’s span of control, stopping response, availability, placement and disengagement. In the held edition the effect is maintained until intentional disengagement, and disengagement permits restarting but does not itself restart the machine [L1 §§4.1.1, 4.1.4, 4.3]. A mechanical latch is therefore a device feature supporting the function, not the complete safety function or a substitute for safeguarding.

## Technical subjects and what the evidence actually establishes

The 2026 IEC abstract identifies construction and testing, including a revised test method to determine whether the latch mechanism meets the document, and a new Annex B for illuminated push-button types. It says the annex includes a reference to distinguishing active and inactive conditions by changing push-button colour with illumination [S1]. It also notes restructuring of clauses. These change notes establish the subjects, **not** precise test procedures, acceptance thresholds, operating forces, contact travel or permitted lighting designs. The standard itself was not read, so this report cannot verify the detailed trigger-action sequence in the historical batch or whether a particular contact arrangement passes it. Obtain the edition text for an actual design/test question.

Direct opening is a meaningful device property, but a red mushroom head alone does not demonstrate it. ISO 13850:2015 §4.3.3 describes an example: an opening contact mechanically linked to its actuator without relying on a resilient member; that section refers to IEC 60947-5-1 for the definition [L1]. Whether a particular operator, adapter and contact block combination has that property must come from the manufacturer's configuration-specific evidence. A separate head, actuator, contact block, enclosure or illumination module is not automatically a complete, tested E-stop assembly merely because one part is labelled as such.

## Practical engineering and library use

For `e_stop` intake, distinguish the initiating device/complete manufacturer-specified combination from a spare actuator head, contact block, illuminated operator or enclosure. Ask for:

- Exact order codes and revisions of the compatible operator, latching mechanism, contact elements, mounting hardware and enclosure; the manufacturer's declared scope and edition for the actual combination, rather than a generic family headline.
- Documented external contact configuration, terminal identification, voltage/current and utilization ratings, permitted environment and protection, mounting and wiring instructions, and required compatible accessories. The device is treated as a bought black box; proprietary internal drawings are not an intake prerequisite.
- Mechanical latching and intentional release method, manufacturer-declared direct-opening behaviour and any restrictions on reset, replacement or combinations. Verify whether illumination and active/inactive indication are supported for that exact version; the existence of 2026 Annex B is not evidence for older hardware or its circuit.
- Whether the manufacturer provides application limits, installation and inspection instructions, suitable protective/short-circuit arrangements, and usable reliability or safety data for the actual configuration. Absence of a particular value in this abstract is not proof that the manufacturer does not provide it.

An integrator must match contact and electrical ratings to its circuit and select appropriate interfaces, monitoring and protective devices from their applicable documentation. Location, accessibility, stopping behaviour and the scope of controlled machinery are machine-level matters, not properties established by a button’s identification. These are evidence questions and design interfaces, not new schema or acceptance rules. Adjacent categories, such as contact blocks and operator stations, may have relevant evidence through a specified assembly, but category membership alone does not prove applicability.

## Functional safety and related standards

The product standard is genuinely relevant to an emergency-stop safety function because its device can initiate the demand, but device conformity alone does not establish the safety performance of the whole chain. ISO 13850:2015 §4.1.5 directs safety-related control-system parts to the relevant ISO 13849-1 and/or IEC 62061 requirements [L1]. Depending on the architecture, assessment extends across input device, wiring, logic, output elements, actuators and the machine’s response, including relevant faults and application conditions. A vendor-declared certified subsystem and its stated limits are separate evidence from an ordinary switch component. No Category, diagnostic coverage, PL, SIL or PFH follows automatically from latching, a contact symbol, redundant terminals or a product-standard citation. Obtain appropriate supplier reliability data and apply the relevant framework only where applicable; do not invent B10d or assume a fixed operating frequency.

Other useful routes, with distinct roles:

- **ISO 13850:** emergency-stop function design principles for machinery; its 2015 held text is the basis for the application discussion above, not a current-edition or legal-status audit [L1].
- **IEC 60204-1:** machine electrical equipment and implementation of electrical emergency stopping; the IEC product abstract itself cross-refers to its 2016 edition and 2021 amendment [S1]. It does not turn the component citation into a machine conformity verdict.
- **IEC 60947-5-1:** related electromechanical control-circuit device and direct-opening terminology; verify the exact 2026 part’s normative references and editions before applying it. ISO 13850:2015 makes the historical terminology reference [L1 §4.3.3].
- **ISO 13849-1 / IEC 62061:** system-level safety-related control design and verification, as applicable, distinct from the product’s latch/type testing [L1 §4.1.5].
- **IEC 60364-5-53:** IEC notes the possible emergency-switching-off use of a device as one part of a means [S1]; evaluate that application separately.

## Local holdings, acquisition and limitations

The supplied candidate list contains no matched IEC 60947-5-5 PDFs, extracted texts or memory files; a filename search of NORMATIVE likewise found no exact part. **No matching full text found**, not proof none exists under an unrelated name. The locally held extracted BS EN ISO 13850:2015 text is a related application source, not a copy of IEC 60947-5-5 [L1, L2]. Historical batch 3 and safety source review are research leads, not normative texts [L3].

**Recommendation: conditional acquisition.** For ordinary purchased-device intake first obtain configuration-specific manufacturer declarations, manuals and safety data. Obtain licensed IEC 60947-5-5:2026 and applicable companion texts if designing or testing a device, interpreting a specific requirement, or resolving a real edition/assembly discrepancy that public scope and supplier evidence cannot settle. Do not automatically buy a product standard for every device. Separately verify exact EN adoption, regulatory listing and supplier-cited edition for the target market and date.

## Sources and open questions

- [S1] IEC official product record: https://webstore.iec.ch/en/publication/69111 — public scope and 2026 edition/change metadata, evidence `evidence/iec-69111.txt` and HTML.
- [S4] IEC record https://webstore.iec.ch/en/publication/3989 — confirms historical lead is a different part, evidence `evidence/iec-old.txt`.
- [L1] `NORMATIVE/extracted_html/ISO_13850_2015/ISO 13850_2015/auto/ISO 13850_2015.md`, §§1–2, 4.1 and 4.3, held 2015 text. Extraction rather than independently checked original PDF; no licensed content redistributed.
- [L2] `NORMATIVE/.claude/memory/standards-inventory.md`, ISO 13850 entry, identifies the held EN/ISO edition.
- [L3] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md` and `SAFETY_SOURCE_REVIEW.md`, historical research and correction, not primary authority.

ISO’s attempted official page `https://www.iso.org/standard/59970.html` returned HTTP 403; neither identity nor status was inferred from that failed request. Current ISO publication status, IEC amendment history beyond the inspected product page, precise 2026 normative test requirements, EN/OJEU status and any actual supplier combination remain open. No standard, device or machine compliance claim is made.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `fa5d9bc1dd58f216568064eecba97bdad1c0c4b7c3bf221e1a72670bc7ca24d5`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-5-5`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-5-5",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full IEC 60947-5-5:2026 requirements and detailed test clauses were not inspected; public scope and publisher change summary only.", "No exact product or complete assembly declaration reviewed.", "Current EN adoption, OJEU/legal status, exhaustive amendment history and ISO publication currency not verified; attempted ISO page returned 403."],
  "local_holdings_summary": "No exact IEC 60947-5-5 full text found among candidates or NORMATIVE filename search. Related held ISO 13850:2015 extracted text inspected, not equivalent to the IEC device standard."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "standard": "IEC 60947-5-5",
  "access_time_utc": "2026-11-02T23:02:07Z",
  "sources": [
    {"id":"S1","url":"https://webstore.iec.ch/en/publication/69111","title":"IEC 60947-5-5:2026, edition 2.0","evidence_path":"evidence/iec-69111.html","text_path":"evidence/iec-69111.txt","kind":"public scope and publisher metadata","limitation":"Not complete normative text; not a regulatory or comprehensive amendment audit."},
    {"id":"S4","url":"https://webstore.iec.ch/en/publication/3989","title":"IEC 60947-5-3:2013","evidence_path":"evidence/iec-old.html","text_path":"evidence/iec-old.txt","kind":"publisher identity check","limitation":"Different standard; disproves historical URL as a source for this part."},
    {"id":"L1","path":"/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/ISO_13850_2015/ISO 13850_2015/auto/ISO 13850_2015.md","title":"BS EN ISO 13850:2015, extracted text","evidence_path":"/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/ISO_13850_2015/ISO 13850_2015/auto/ISO 13850_2015.md","kind":"local held related standard extracted text","limitation":"Sections 1–2, 4.1 and 4.3 inspected; 2015 edition, not current status or IEC 60947-5-5 full text; extraction not checked against PDF."},
    {"id":"L2","path":"/media/eldar/disk_2/Machine_concept/NORMATIVE/.claude/memory/standards-inventory.md","title":"Standards inventory, ISO 13850 entry","evidence_path":"/media/eldar/disk_2/Machine_concept/NORMATIVE/.claude/memory/standards-inventory.md","kind":"local holdings inventory","limitation":"Research inventory, not independent current publication status."},
    {"id":"L3","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md","title":"Historical batch 03, IEC 60947-5-5 section","evidence_path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch03-control-circuit-gemini.md","kind":"old research lead","limitation":"Claims require primary verification."},
    {"id":"L4","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md","title":"Safety source review","evidence_path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md","kind":"local research correction","limitation":"Bounded review, not current edition audit."},
    {"id":"F1","url":"https://www.iso.org/standard/59970.html","title":"Unverified ISO URL","evidence_path":"evidence/iso.html","kind":"failed access","limitation":"HTTP 403 challenge; content and publication identity not verified."}
  ]
}
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[S1]: <https://webstore.iec.ch/en/publication/69111>
[S4]: <https://webstore.iec.ch/en/publication/3989>
[F1]: <https://www.iso.org/standard/59970.html>
