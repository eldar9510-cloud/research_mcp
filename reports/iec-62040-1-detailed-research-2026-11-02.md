---
{
  "format": 1,
  "metadata": {
    "id": "iec-62040-1-detailed-research-2026-11-02",
    "title": "IEC 62040-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 62040-1?",
    "scope": "Detailed IEC 62040-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:25.752Z"
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
  "sourceDigest": "acc80649f304067ccd18b32ccca996497d2789c7365fe171b1225fb9101a37d5",
  "proposalRevision": "b769a46a799857b73dcbc649b67517dc27739f60c7a9d41a16c61aa368a34a7a"
}
---
# IEC 62040-1 — uninterruptible power systems: safety

**Evidence check:** 2026-11-02 UTC. **Scope-level investigation**, not a full-clause inspection or conformity assessment.

## Identity and status

IEC 62040-1, *Uninterruptible power systems (UPS) – Part 1: Safety requirements*, is an IEC International Standard/product safety standard. The IEC's [2017 base record](https://webstore.iec.ch/en/publication/31983) identifies edition 2.0. IEC's [consolidated record](https://webstore.iec.ch/en/publication/80573) identifies IEC 62040-1:2017 + AMD1:2021 + AMD2:2022, edition 2.2, published 2022-11-29; the consolidated copy includes the October 2019 corrigendum. The page also says a revision is under development and approved for FDIS: **that is not itself a published replacement**. The inspected page does not by itself establish that no newer final publication exists elsewhere; current publication status requires a fresh publisher check at use. Stability date is not an expiry or proof of regulatory status. No EN adoption, OJEU listing, transition date or supplier's particular cited edition was established here. [S1, S2]

The standard addresses UPS product hazards, protecting people around the equipment and, where explicitly stated, skilled people during service. It is useful to UPS manufacturers, specifiers and integrators assessing the evidence for a particular power-continuity product. The publisher says its reference basis changed from IEC 60950-1 to group safety publication IEC 62477-1, with UPS-specific additional requirements; this is a relationship between standards, not proof that a particular unit conforms. [S1, S2]

## Exact scope and boundaries

The consolidated IEC public abstract covers movable, stationary, fixed or built-in UPS in low-voltage distribution systems, intended for an ordinary-person-accessible or restricted-access area as applicable. The UPS **delivers fixed-frequency AC output**, has port voltages not exceeding 1,000 V AC or 1,500 V DC, and includes an energy-storage device. It covers pluggable and permanently connected configurations, whether a system of interconnected units or independent units, subject to manufacturer-prescribed installation, operation and maintenance. Its stated objective is reduction of fire, electric shock, thermal, energy and mechanical hazards during use and operation and, where specified, service and maintenance. [S1]

Interpret those qualifiers together, not independently:

* **AC-output UPS:** potentially within this scope when all relevant features and conditions match. A DC-valued battery or DC port does not itself make the UPS a DC-output UPS; conversely the DC port limit is not permission to ignore the fixed-frequency AC-output condition.
* **DC-output UPS:** the Part 1 public abstract does not establish blanket applicability. IEC 62040-5-3:2016 addresses **performance and test requirements**, not a general replacement safety certificate, for complete DC UPS supplied from an AC source within its stated scope. It is not evidence that every DC-input/DC-output product falls under either standard. [S1, S3]
* **Functional unit/module:** Part 1's statement about interconnected or independent units concerns qualifying AC-output UPS configurations; it does not establish that every separately sold DC functional module is independently a Part 1 UPS. Part 5-3 expressly addresses a *complete* DC UPS, not individual DC UPS functional units. Establish the manufacturer's defined system boundary and exact claim. [S1, S3]
* **Battery:** energy storage is part of the stated UPS scope, but a standalone battery is not thereby a complete AC-output UPS or automatically certified to Part 1. Battery-specific product, installation and maintenance requirements must be identified for its actual chemistry and application; none is asserted here without a matching source. The abstract is insufficient to settle exactly how external batteries and their enclosures are assessed under full Part 1. [S1]

The IEC abstract sets these boundaries; the module and standalone-battery discussion is a cautious application of that wording, not a quotation of all exclusions. In particular, it does not establish a universal exemption from any other applicable standard. The earlier internal correction explicitly warns against applying a blanket UPS category mapping and distinguishes complete DC UPS from DC functional units. [L1]

## What it governs and what it does not

The public scope establishes a **product safety** objective covering the cited hazard families and specified user/service contexts, and a relationship to IEC 62477-1. It does not expose the detailed construction clauses, acceptance criteria, test sequence, battery interface requirements or all backfeed provisions. The historical batch mentions backfeed and regenerative lift loads, but the abstract alone does not substantiate its exact claim or a general requirement for such loads. Do not turn these ideas into numeric design requirements without the applicable full text. [S1, L2]

For an electrical engineer, relevant evidence questions include:

1. Is the exact purchased item a complete fixed-frequency AC-output UPS, a component of one, a DC UPS, a buffer module, or an external battery? What is the system boundary, including energy storage?
2. What input/output, connection, protective-device, earthing, access, isolation, service and external battery conditions does the manufacturer actually prescribe? Are load characteristics, normal/backup operating states and fault interfaces suitable for the intended system? These are selection and integration questions, **not assertions that every listed test is specified in a particular Part 1 clause**.
3. Which exact model, installation configuration and IEC or EN edition does the declaration or certificate cover? Is the supplier's evidence a declaration, certification, or actual test report? Request the relevant manual and external interface data, not proprietary circuit or firmware details.
4. What separate system design, installation and machine verification remain? Product safety evidence alone cannot establish an installed machine's electrical safety or continuity during every fault.

An existing local example shows why this classification matters: Phoenix Contact document 107553_en_00, printed p. 22/81, for QUINT4-UPS/24DC/24DC/20, lists IEC 61010-1 and IEC 61010-2-201 under its CB Scheme and related standards entries. It is a DC-input/DC-output model and this is evidence of **that supplier document's claims**, not a finding that those standards replace all other obligations or that the device complies with 62040-1. [L3]

## Functional safety

A UPS can supply power to an element involved in a safety-related control system, but a product-safety reference on its own does not establish a certified safety subsystem, a particular safety function, PL, SIL, diagnostic coverage, category or probability of dangerous failure. A safety function depends on its defined behaviour on loss, return and abnormal supply, applicable manufacturer's limitations and verification of the complete application. If a manufacturer claims a certified safety role, obtain the exact function, configuration, safety manual, certificate and relevant declared data; do not infer them from output continuity or a Part 1 declaration. For an ordinary supply with no safety claim, this section is relevant as a **boundary**, not evidence that the device is itself safety-rated. This is engineering interpretation, not a claim that the inspected abstract covers ISO 13849 assessment. [S1, L1]

## Related documents and library implications

* **IEC 62477-1:2012:** group safety publication for power electronic converter systems; the IEC describes Part 1 as harmonized with applicable parts and adding UPS-specific requirements. That technical wording is not a claim of EU harmonized-standard listing. [S1]
* **IEC 62040-5-3:2016:** complete AC-supplied/DC-output UPS performance/test scope, not a generic DC module safety route. [S3]
* **IEC 61010-1 and IEC 61010-2-201:** supplier-cited safety standards in the specific DC module example, not a universal mandatory pairing for all UPS. [L3]

The `ups` category is a useful starting route, not evidence of a standard reference. Resolve AC output vs DC output, complete system vs functional unit, and standalone battery before asking for the correct supplier declaration. Related `power_supply` selection may matter where a DC UPS module relies on a separate upstream supply. Preserve externally prescribed protection and interconnection conditions. The applicable prior correction notes that battery Wh capacity is not a substitute for an unsupported `power_w` value; no schema or rating should be changed on this evidence. [L1] No component or category approval follows from this report.

## Local holdings and recommendation

`NORMATIVE_CANDIDATES.json` reports no matching PDF, extracted markdown or memory candidate. No matching full text was supplied or inspected for this assignment; absence from the provided candidate list is not proof of exhaustive absence everywhere. The historical batch and correction are **research references**, not full licensed text. Thus no held edition can be compared clause-by-clause. [L1, L2, L4]

**Recommendation: conditional acquisition/update**, not automatic purchase for every UPS-category item. If the project must adjudicate a specific qualifying AC UPS safety clause, external-battery boundary, test or disputed manufacturer claim, obtain the relevant authorized full edition including amendments/corrigenda and compare it with the exact supplier-cited edition. If intake concerns a DC functional module, prioritize its exact supplier evidence and applicable product route first. Parent owns the holdings and acquisition decision.

## Sources and limitations

* [S1] IEC, consolidated 2017+AMD1:2021+AMD2:2022, edition 2.2, [product and public scope](https://webstore.iec.ch/en/publication/80573); evidence `evidence/iec62040-1.txt` and `.html`.
* [S2] IEC, [2017 edition 2.0 base publication](https://webstore.iec.ch/en/publication/31983); `evidence/base.txt` and `.html`.
* [S3] IEC, [IEC 62040-5-3:2016 public scope](https://webstore.iec.ch/en/publication/26118); `evidence/iec62040-5-3.txt` and `.html`.
* [L1] `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md`, §2, under `/media/eldar/disk_2/Machine_concept/`.
* [L2] Same research directory, `batch01-power-gemini.md`, IEC 62040-1 section; historical, expressly truncated/condensed lead, not authority.
* [L3] `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/2907071_cpu_layout.txt`, lines 876–890; retained text of manufacturer's 107553_en_00, printed p. 22/81; original local PDF `LIBRARY/ELECTRIC/library/datasheets/phoenix_contact/phoenix_2907071_quint4_ups_24dc_24dc_20_datasheet_en.pdf` under the same project root.
* [L4] `NORMATIVE_CANDIDATES.json` in this worker directory.

All web evidence is public publisher scope/metadata, not full standards text. The individual changes made by AMD1 and AMD2, detailed clause requirements, comprehensive exclusions, current legal recognition, current supplier approvals, and any later final edition remain unverified. No design or safety conclusion is made.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `3b3269330ce1a7f00f19ce2c57e02db43bbda9b09a1b887406c292ffca020f80`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-62040-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 62040-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "No full Part 1 clauses inspected; battery and detailed exclusions unresolved",
    "No exhaustive latest-publication or legal-status check",
    "No supplier-specific AC UPS declaration reviewed"
  ],
  "local_holdings_summary": "Provided candidate list contains no PDF, extraction or memory candidate; full text not inspected."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source": "https://webstore.iec.ch/en/publication/80573",
    "title": "IEC 62040-1:2017+AMD1:2021+AMD2:2022 CSV edition 2.2",
    "access_time_utc": "2026-11-02T23:00:22Z",
    "saved_evidence": "evidence/iec62040-1.html",
    "kind": "public scope",
    "limitation": "No full clauses; development status not exhaustive publication search"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/31983",
    "title": "IEC 62040-1:2017 edition 2.0",
    "access_time_utc": "2026-11-02T23:00:22Z",
    "saved_evidence": "evidence/base.html",
    "kind": "public scope",
    "limitation": "Base scope and metadata only"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/26118",
    "title": "IEC 62040-5-3:2016 edition 1.0",
    "access_time_utc": "2026-11-02T23:00:22Z",
    "saved_evidence": "evidence/iec62040-5-3.html",
    "kind": "public scope",
    "limitation": "Performance scope, not safety requirements"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "Bounded primary-source checks section 2",
    "access_time_utc": "2026-11-02T23:00:22Z",
    "saved_evidence": null,
    "kind": "old research lead",
    "limitation": "Secondary local correction"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md",
    "title": "Batch 1 historical UPS lead",
    "access_time_utc": "2026-11-02T23:00:22Z",
    "saved_evidence": null,
    "kind": "old research lead",
    "limitation": "Condensed and incomplete"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/_staging/sol61_phoenix_power/sources/2907071_cpu_layout.txt",
    "title": "Phoenix Contact 107553_en_00 p22",
    "access_time_utc": "2026-11-02T23:00:22Z",
    "saved_evidence": null,
    "kind": "manufacturer guidance",
    "limitation": "Local text retained from manufacturer PDF; no current approvals check"
  },
  {
    "source": "NORMATIVE_CANDIDATES.json",
    "title": "Local candidate inventory",
    "access_time_utc": "2026-11-02T23:00:22Z",
    "saved_evidence": null,
    "kind": "local inventory",
    "limitation": "Candidate list, not exhaustive proof of absence"
  }
]
`````
