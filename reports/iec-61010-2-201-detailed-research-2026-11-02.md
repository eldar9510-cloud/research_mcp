---
{
  "format": 1,
  "metadata": {
    "id": "iec-61010-2-201-detailed-research-2026-11-02",
    "title": "IEC 61010-2-201 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61010-2-201?",
    "scope": "Detailed IEC 61010-2-201 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.010Z"
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
  "sourceDigest": "dfa9add095410f88c824e3ffbdf2af00e47f0ab2661882097fd48a142cfbc6a3",
  "proposalRevision": "7df9928a9335bb48a78e9e7a9a93b8a1455d7d5823c8f37c191f3c0df8e300e8"
}
---
# IEC 61010-2-201 — safety of control equipment

**Checked 2026-11-02 UTC.** This is source-backed scope research, not a conformity assessment or a substitute for the applicable full standards. IEC calls the 2024 publication *Safety requirements for electrical equipment for measurement, control, and laboratory use — Part 2-201: Particular requirements for control equipment*. It is an International Standard in IEC TC 65's safety category. [1]

## Identity and editions

IEC lists the third edition, **IEC 61010-2-201:2024**, published 24 October 2024, as published. It identifies the earlier IEC editions as **2017 edition 2.0** and **2013 edition 1.0**, both revised. Its lifecycle also lists edition 4.0 as under development, not published; a forecast is not a new standard. The published lifecycle does not show an amendment to the 2024 base; this is a catalog observation, not proof against every corrigendum or national adoption. [1] The 2017 IEC year must not be silently rewritten as 2018: an EN adoption year and its European changes are separate questions, not verified here. Supplier documents may legitimately cite an older or undated edition; retain the original statement rather than attributing the 2024 edition to it.

## What it does and who needs it

This is a **product electrical-safety standard**, intended for people designing, evaluating, testing or selecting control equipment and associated peripherals. It addresses safety hazards arising from the equipment itself and gives the equipment-specific modifications to a general safety standard. A machine builder can use it to understand the supplier's product evidence and the limits that must be respected in installation, but the standard's existence alone does not certify a particular controller or machine. [1–3]

IEC's 2017 abstract describes products performing the function of control equipment and/or associated peripherals, intended for command and control of machines, automated manufacturing and industrial processes, including discrete and continuous control. [2] This is a useful description of the older edition, **not a verbatim verified 2024 scope**: IEC specifically says the 2024 edition clarified the related equipment included in scope. [1] For a new applicability judgment use the full 2024 scope and definitions, especially for a peripheral or stand-alone auxiliary unit; the catalog alone does not establish every included subtype or exclusion.

A PLC used to control industrial machinery is an obvious candidate for investigation, not automatically conforming merely because it is a PLC. Conversely, a device need not be called a PLC to have relevant control-equipment use. A power supply, DC UPS functional module, HMI, I/O unit or other accessory requires assessment of its actual intended function and product documentation; neither a DIN-rail mounting method nor the category label establishes applicability. Whether a particular external power unit is within scope cannot be settled generically from the available abstract.

## How Part 2-201 relates to Part 1

The 2024 publisher abstract explicitly specifies joint use with **IEC 61010-1:2010 and its Amendment 1:2016**. Part 2-201 supplements or modifies corresponding Part 1 clauses. Unmentioned Part 1 subclauses apply as far as reasonable, while Part 2's addition, modification, replacement or deletion instructions adapt the relevant Part 1 material. [1] It is therefore misleading to use Part 2-201 in isolation, or to assume a Part 1 clause is unchanged without consulting Part 2.

IEC describes Part 1 as general safety requirements for electrical test/measurement, industrial process-control and laboratory equipment and accessories. Its abstract identifies insulation, mechanical hazards, surface temperature, radiation and foreseeable misuse among general subject areas. [3] The 2024 Part 2-201 catalog's change summary mentions revised treatment of insulation between separate circuits, SELV/PELV circuits and secondary wiring; installation information; connector and insulating materials; glass displays; and switching devices. It also records that particular provisions on fluid/solid foreign-object hazards were removed. [1] **These are change-summary topics, not a complete specification or evidence that the hazard ceased to be addressed by applicable general provisions.** The precise tests, pass criteria, boundaries and inherited requirements need the actual pair of standards and their referenced documents.

## Engineering use and evidence questions

For an in-scope product, the standard is relevant to its construction and verification, while the engineer selecting it should ask the supplier for the exact variant's declaration, any certificate or test report, and installation instructions. In practice examine:

- supply and terminal ratings, permitted supply variations, external protection and disconnection prescribed by the manufacturer;
- which circuits are separated and what SELV/PELV or other isolation claims are actually made, including conditions and connections;
- enclosure/mounting, ambient temperature, ventilation and environmental limits and any specified wiring and terminal arrangements;
- controller/peripheral compatibility, permitted loads and interfaces, and information needed to avoid misuse;
- test scope and edition, especially whether the declared device, accessories and installation conditions match the intended configuration.

These are **review questions**, not a claim that the catalog describes a specific mandatory test or numerical value for each. Consult the full standard for specific technical determinations. A bought device is normally a black box: collect manufacturer-published interfaces, limits and externally required protective parts, not proprietary circuits or firmware implementation as a condition of intake.

The IEC change list's removal of the particular drop-test subclause and fluid/foreign-object provisions illustrates why reading only the new or old Part 2 is unsafe: a deletion must be interpreted in conjunction with Part 1 and the actual edition; neither a new universal exemption nor a test requirement follows from the change summary. [1]

## Relevance to functional safety

Electrical product safety and a machine safety-related control function are different claims. A controller can be an ordinary process-control component, a component within a safety-related subsystem, or an independently assessed safety subsystem with a specified function. A Part 2-201 declaration alone establishes none of a safety function's performance level, SIL, diagnostic coverage, architecture/category or PFH. If a device is intended for safety functions, obtain its exact functional-safety certificate, safety manual, declared functions and integrity data and conditions; then separately integrate and validate the complete machine function under the chosen applicable framework. ISO 13849 or IEC 62061 addresses the system/safety-function route; product electrical safety does not replace it. The local safety-source review explains why contact type or a SIL claim cannot automatically populate PL, diagnostic coverage or category. [4]

## Actual examples and adjacent standards

The following examples show **supplier statements**, not independent certification checks or proof that every similar product has the same standard route:

- Phoenix Contact TRIO3-PS/3AC/24DC/40, article 1159045, document 110208_en_02, printed page 10, lists IEC 61010-2-201 and IEC 61010-1 for electrical safety/SELV/PELV alongside DIN EN 61558-2-16 and IEC 61558-2-16 claims. The supplied excerpt does not give the IEC 61010 editions. [5]
- Phoenix Contact QUINT4-UPS/24DC/24DC/20, article 2907071, document 107553_en_00, printed page 22, lists IEC 61010-1 and IEC 61010-2-201 under standards and CB Scheme. This is a DC-input/DC-output UPS module example, not a universal standard assignment to every UPS or a verification of currently valid certification. [6]

IEC 61204-7:2016 is a different **switch-mode power-supply product safety** route; its scope describes stand-alone and component SMPS within stated input/output limits. It is not established as redundant for all supplies by the existence of IEC 61010-2-201, nor does its scope prove that every industrial supply needs both. [7] IEC 61131-2 concerns programmable-controller equipment requirements, while IEC 61131-6 concerns functional safety for safety-related programmable controllers: identify the actual product and claims rather than assuming that product safety, PLC performance and functional safety are interchangeable. The exact editions and detailed boundaries of those related parts are not researched here.

IEC 60204-1 is an installation/machine electrical-equipment route, distinct from the control product's construction standard; machine-level integration, protection, interfaces and validation remain the machine designer's work. These relationships are routing guidance, not a determination that any given combination of standards is mandatory. No blanket PLC/PSU three-standard rule, legal approval, EU harmonization or present OJEU listing is inferred. [4, 8]

## Library and local holdings

Potential review categories include `standard_plc`, `safety_plc`, `hmi_panel`, `power_supply` and certain `ups` modules, **conditionally** on function and actual product evidence. Capture exact article, documentation revision, supplier-cited edition, certificate scope and external use restrictions; do not replace the supplier declaration with an inferred standard or equate package acceptance with machine validation. For a safety PLC preserve separately the product electrical-safety and function-specific evidence.

`NORMATIVE_CANDIDATES.json` lists no matching PDFs, extracted Markdown or memory candidates; a filename search under the local NORMATIVE tree found no `61010` matches. **No matching full text was found**, rather than proof that no copy exists anywhere. Local archived reports are research leads, not held normative text. A conditional full-text access/update consideration is appropriate only if a real device-scope or clause question requires detailed verification, and must include the specified Part 1 plus amendment; parent decides holdings and acquisition priorities. No purchase is recommended solely because a device category exists.

## Limitations and open questions

The 2024 catalog gives the relationship to Part 1 and a change summary, but not its complete scope or test clauses. The advertised IEC public preview request returned HTML rather than a PDF; no 2024 preview or full clause text was inspected. Exact 2024 exclusions, definitions of associated equipment, complete test methods, amendments/corrigenda beyond the observed lifecycle and the applicable EN adoption are unresolved. A later under-development edition is not a current published requirement. No OJEU/legal review and no product certificate validation were performed.

## Sources

1. [IEC 61010-2-201:2024 official catalog](https://webstore.iec.ch/en/publication/64909), abstract, technical changes and lifecycle; evidence `evidence/iec-2024.html`, readable text `evidence/iec-2024.txt`.
2. [IEC 61010-2-201:2017 official catalog](https://webstore.iec.ch/en/publication/30437), scope abstract; `evidence/iec-2017.txt`.
3. [IEC 61010-1:2010 official catalog](https://webstore.iec.ch/en/publication/4279), general scope and change summary; `evidence/iec-part1.txt`.
4. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, functional-safety claim assessment; historical bounded review, not this task's fresh full-text verification.
5. Local `LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/1159045_cpu_layout.txt` lines 508–515, Phoenix Contact document 110208_en_02; source PDF `LIBRARY/ELECTRIC/library/datasheets/phoenix_contact/phoenix_1159045_trio3_ps_3ac_24dc_40_datasheet_en.pdf`.
6. Local `LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/2907071_cpu_layout.txt` lines 876–890, Phoenix Contact document 107553_en_00; source PDF `LIBRARY/ELECTRIC/library/datasheets/phoenix_contact/phoenix_2907071_quint4_ups_24dc_24dc_20_datasheet_en.pdf`.
7. [IEC 61204-7:2016 official catalog](https://webstore.iec.ch/en/publication/26155), product scope; `evidence/iec-61204.txt`.
8. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md`, §§1–3, bounded correction of PSU and legal-status claims.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `ab97bd277e834773db4128a560540bb54354c5b53e2c7b8f17151c8954d781ec`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61010-2-201`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61010-2-201",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "2024 full scope, exclusions and clauses unavailable; advertised public preview returned HTML",
    "No current EN adoption, OJEU status, or exhaustive amendment/corrigenda audit",
    "No product-specific certificate independently verified"
  ],
  "local_holdings_summary": "No matching full text found in candidate listing or NORMATIVE filename search; local research notes and two manufacturer extracts are references only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source": "https://webstore.iec.ch/en/publication/64909",
    "title": "IEC 61010-2-201:2024",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "evidence/iec-2024.html",
    "readable_text": "evidence/iec-2024.txt",
    "kind": "public scope",
    "limitation": "Publisher catalog abstract and lifecycle only; not full standard."
  },
  {
    "source": "https://webstore.iec.ch/en/publication/30437",
    "title": "IEC 61010-2-201:2017",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "evidence/iec-2017.html",
    "readable_text": "evidence/iec-2017.txt",
    "kind": "public scope",
    "limitation": "Publisher catalog abstract and lifecycle only; not full standard."
  },
  {
    "source": "https://webstore.iec.ch/en/publication/4279",
    "title": "IEC 61010-1:2010",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "evidence/iec-part1.html",
    "readable_text": "evidence/iec-part1.txt",
    "kind": "public scope",
    "limitation": "Publisher catalog abstract and lifecycle only; not full standard."
  },
  {
    "source": "https://webstore.iec.ch/en/publication/26155",
    "title": "IEC 61204-7:2016",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "evidence/iec-61204.html",
    "readable_text": "evidence/iec-61204.txt",
    "kind": "public scope",
    "limitation": "Publisher catalog abstract and lifecycle only; not full standard."
  },
  {
    "source": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxMDEwLTItMjAxe2VkMy4wfWIucGRm",
    "title": "IEC 61010-2-201:2024 preview request",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "evidence/iec-preview-failure.html",
    "kind": "failed preview",
    "limitation": "Returned HTML, not PDF; preview unavailable."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/1159045_cpu_layout.txt",
    "title": "Phoenix 1159045 datasheet 110208_en_02 p10",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/1159045_cpu_layout.txt",
    "kind": "manufacturer guidance",
    "limitation": "Existing read-only local evidence; edition or certification current status not independently verified."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/2907071_cpu_layout.txt",
    "title": "Phoenix 2907071 datasheet 107553_en_00 p22",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/2907071_cpu_layout.txt",
    "kind": "manufacturer guidance",
    "limitation": "Existing read-only local evidence; edition or certification current status not independently verified."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "Primary source correction notes",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "kind": "old research lead",
    "limitation": "Existing read-only local evidence; edition or certification current status not independently verified."
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Safety source review",
    "access_time_utc": "2026-11-02T23:00:36Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "kind": "old research lead",
    "limitation": "Existing read-only local evidence; edition or certification current status not independently verified."
  }
]
`````
