---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-2-detailed-research-2026-11-02",
    "title": "IEC 60947-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-2?",
    "scope": "Detailed IEC 60947-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.165Z"
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
  "sourceDigest": "08357ced91ec6dbca88f209a9a4722c14175e177c91cc016554d92a68a8f92eb",
  "proposalRevision": "2fb5d2848e2ddcc582f831542302397bdf1cdc566dbfa5e114447100ae5c614c"
}
---
# IEC 60947-2 — industrial circuit-breakers

**Checked 2026-11-02 UTC.** IEC 60947-2:2024, *Low-voltage switchgear and controlgear – Part 2: Circuit-breakers*, is an International Standard, edition 6.0, published 18 September 2024. IEC says it cancels and replaces edition 5 (2016) and amendment 1 (2019); its search record marks the 2024 base publication valid and the previous consolidated edition revised [1, 2]. No later amendment is visible in this bounded search. IEC's stability date is not a withdrawal or legal deadline. No EN adoption, current OJEU listing, regulatory transition, or supplier-specific edition was checked.

## Purpose and scope

This is a **product standard** for low-voltage circuit-breakers, relevant to manufacturers and test laboratories, and to engineers specifying and integrating a particular breaker. It provides a common technical basis for describing and testing protection and switching capability; its existence does not choose a breaker or prove protection of a machine installation.

The publisher's scope says devices are intended for installation and operation by instructed or skilled persons, with main contacts connected to circuits rated no more than **1,000 V AC or 1,500 V DC**. It also includes breakers with a rating at or below 1,000 V AC that additionally have one or more AC ratings above 1,000 V up to 1,500 V, and includes additional requirements for integrally fused breakers [1]. That special AC provision should not be generalized to every breaker above 1,000 V. Rated device voltages, circuit topology, polarity and manufacturer's conditions still matter.

Practical examples include molded-case, air/power, modular industrial and integrally fused breakers; housing names alone do not establish scope or ratings. Breakers can have thermal-magnetic or electronic releases, fixed or adjustable settings, and optional ground-fault or other functions. These are selection questions, not assumptions that all variants include every protection function. The manufacturer guidance distinguishes frame size from the installed trip unit and its settings [3]. A separate electronic DC branch protector must not be called a Part 2 breaker merely because it is sold as circuit protection: inspect its construction, declared standard and limits. Nor does 'industrial' mean a Part 2 reference is impossible on a device also certified to a household standard.

The 2024 publisher abstract identifies changes regarding suitability for isolation and removal of the old classification according to isolation suitability, interrupting medium and design [1]. That summary alone is insufficient to reconstruct the revised isolation rules. For a given breaker, establish its actual isolation marking and conditions from its manufacturer and the applicable text; do not infer a disconnecting function or lockout suitability just from a breaker symbol.

## Technical subjects and ratings

The 2024 abstract explicitly identifies externally adjustable current settings, protective separation, ground-fault overcurrent-release tests, dielectric testing in the tripped position, individual pole breaking under phase-to-neutral AC voltage, power-loss measurement and EMC tests among changes [1]. These show the breadth of the product assessment, not a complete clause-level digest. We did **not** inspect the full standard, so applicable detailed requirements, test sequences and exclusions remain to be checked in the controlled edition.

For real equipment distinguish the following, using the exact catalog and supplied trip unit [3, 4]:

* **Ue and current:** operational voltage and rated current are not interchangeable; frame size is not necessarily the release rating or chosen setting. Ambient temperature, mounting and enclosure can constrain continuous duty. The supplier's trip curves, setting range and tolerances matter for the load and cable.
* **Icu and Ics:** ultimate and service short-circuit breaking capacities are distinct standardized performance ratings, determined under specified test conditions. Compare ratings at the actual voltage and supply configuration with prospective fault current, considering manufacturer limitations. Ics is not a promise that a breaker can always be returned to service without inspection; follow the manufacturer's post-fault instructions. Schneider's explanation differentiates the two ratings and their test intent [3, 4]. Do not assume a fixed Ics/Icu ratio for a product.
* **Icm and Icw:** making capacity concerns establishing current under specified conditions; for suitable selectivity-category B devices, short-time withstand and delay ratings support coordination. Category A/B here is a breaker selectivity classification, **not ISO 13849 safety architecture Category** [4]. A category B marking does not itself demonstrate selectivity with a particular downstream device.
* **Trip and coordination:** short-circuit and overload thresholds/time behavior, fault-current limitation, upstream/downstream selectivity and backup arrangements are product- and configuration-specific. Use actual manufacturer curves or tested coordination tables, and check minimum fault current as well as maximum prospective fault level. Neither the standard number nor a frame rating establishes protection for every cable, motor or downstream device [3, 4].
* **AC and DC:** a rating at one voltage, polarity, pole arrangement or supply type cannot be transferred to another. Check DC time constant, connection diagrams and pole arrangements where the manufacturer prescribes them. A breaker is not automatically suitable for reverse feed, photovoltaic sources, or a particular drive DC link.

Product type-test results and declared ratings inform, but do not replace, installation-level verification of conductors, fault-loop conditions, selectivity, protective bonding, enclosure environment and operating procedures. A drive input breaker also does not by itself establish motor overload protection or adequate protection of a drive's output; consult drive and breaker instructions.

## Functional safety and machine context

A breaker may protect wiring or interrupt supply in a safety-related arrangement, but Part 2 product conformity alone does not demonstrate a machine safety function, safe isolation for maintenance, an emergency-stop function, or achieved PL/SIL. Overcurrent protection and a commanded safety stop address different events. Verify required disconnection, fault response, monitoring, diagnostic assumptions, common-cause issues and validation for the actual architecture. Record only manufacturer-supplied reliability or certified subsystem data and stated conditions; do not derive B10d, diagnostic coverage, PL, SIL or Category from the product standard, breaking rating, or dual-pole form. The prior local safety review similarly cautions that product/contact properties are not implemented diagnostics or system verification [5].

## Related standards and boundaries

* **IEC 60947-1:** general rules for the low-voltage switchgear family, used with the applicable Part 2 edition; confirm exact dated normative references in the controlled text rather than silently pairing editions.
* **IEC 60898-1:** circuit-breakers for household and similar installations, a distinct product route. Intended users and product declaration matter; the dividing line is not cabinet location or frame size alone. A specific device may carry both declarations; do not assume either one.
* **IEC 60947-3:** switches, disconnectors, switch-disconnectors and fuse-combination units; do not equate an isolator with an overcurrent circuit-breaker. An actual circuit-breaker-disconnector requires its own declared functions and conditions.
* **IEC 60947-4-1:** electromechanical contactors and motor-starters; switching duty and motor-starter coordination are distinct from circuit-breaker interruption ratings.
* **IEC 60204-1** concerns electrical equipment of machines and **IEC 61439-1/-2** concern applicable low-voltage assemblies. Their applicability and installation/assembly assessments are separate from Part 2 product evaluation. IEC lists IEC 60204-1:2016 among publications referring to Part 2 [2]; this is not proof that every machine or enclosure requires a given edition.
* **ISO 13849-1/IEC 62061:** system functional-safety routes when a safety-related control function exists, not replacement product breaker rating standards. Choose the relevant framework and perform application assessment rather than deriving one metric from another [5].

The companion roles above are engineering routing, not an asserted exhaustive normative-reference list; verify actual editions in the controlled publications.

## Library use and evidence requests

Likely review routes are `circuit_protection` and, **only if the device actually performs the relevant function**, `main_switch`. Resolve ordinary MCB, industrial MCCB/air breaker, integrally fused device, electronic protection module and motor-protection variant by the manufacturer's exact article and declared function rather than by folder name. Category membership is not product conformity, certification, or approval.

For each actual variant request the manufacturer declaration and edition, datasheet/manual and any certificate in scope; distinguish declarations from independent reports. Capture poles, voltage/frequency or DC connection/polarity, rated current and trip-unit identity/settings, overload and short-circuit curves, Icu/Ics at each applicable voltage, Icm/Icw if relevant, temperature derating, isolation marking, auxiliary contacts and compatibility, terminal/wiring requirements, fault coordination and post-fault instructions. Ask separately for any residual-current or ground-fault functionality and safety-related data; do not infer these from a generic series brochure. Respect the bought component as a black box: require published external interfaces and conditions, not proprietary internal circuitry.

## Local holdings and recommendation

`NORMATIVE_CANDIDATES.json` contains no matching PDF, extracted Markdown or memory candidate; a read-only filename search in the NORMATIVE PDF, extracted HTML and memory directories likewise found no `60947` filename. Thus **no matching full text found**, not proof that no copy exists elsewhere or under an unexpected name. No held edition or clause was inspected. Historical batch 2 explicitly lost its Part 2 detail; it is a research lead only [6], not full text. Conditional acquisition is sensible if the project must interpret manufacturer test requirements, resolve disputed isolation/coordination conditions, or author product-level specifications. Otherwise use supplier documentation and applicable installation texts for concrete component selection; no blanket purchase recommendation.

## Sources and limitations

1. IEC, [IEC 60947-2:2024 product page](https://webstore.iec.ch/en/publication/66277), scope, edition and changes; public abstract only.
2. IEC, [public Webstore search API](https://webstore-search-api.iec.ch/api/search), POST search `60947-2`, all statuses; saved response includes edition history and reference relationships. Search is a dated publication check, not a regulatory audit.
3. Schneider Electric, [Fundamental characteristics of a circuit-breaker](https://www.electrical-installation.org/enwiki/Fundamental_characteristics_of_a_circuit-breaker), guidance last edited 2026-08-05. General engineering explanation, not normative text.
4. Schneider Electric, [Other characteristics of a circuit-breaker](https://www.electrical-installation.org/enwiki/Other_characteristics_of_a_circuit-breaker), guidance last edited 2026-08-05; product illustrations do not certify other models.
5. Local `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, bounded prior review of ISO 13849 and related text, not a Part 2 assessment.
6. Local `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md`, explicitly truncated prior research.

The IEC preview request returned an HTML error, retained in `evidence/preview-failure.html`; no bypass was attempted. The report relies on publisher abstract and manufacturer guidance, not full clause access. Edition-specific detailed exclusions, full isolation rules, exact tests and normative reference pairings remain unresolved until the actual standard is consulted. No product conformity or jurisdictional conclusion is made.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `0a7c64803bc0c8cfd0d4a529b65c89a644509ea6095ddf3697e5c8f9363e886c`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-2",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and preview unavailable; exact requirements and exclusions not independently inspected",
    "No supplier-specific product or EN/OJEU legal applicability checked"
  ],
  "local_holdings_summary": "No matching candidate or filename found in searched NORMATIVE PDF, extracted HTML or memory directories; no held edition verified."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/66277",
    "title": "IEC 60947-2:2024 edition 6",
    "access_time_utc": "2026-11-02T23:04:09.450196+00:00",
    "evidence_path": "evidence/iec-2024.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract only, not full text"
  },
  {
    "source_url_or_path": "https://webstore-search-api.iec.ch/api/search",
    "title": "IEC publication search POST 60947-2 all statuses",
    "access_time_utc": "2026-11-02T23:04:09.450196+00:00",
    "evidence_path": "evidence/iec-api.json",
    "evidence_kind": "public catalog",
    "coverage_limitation": "Search snapshot, not legal applicability"
  },
  {
    "source_url_or_path": "https://www.electrical-installation.org/enwiki/Fundamental_characteristics_of_a_circuit-breaker",
    "title": "Schneider circuit-breaker fundamental characteristics",
    "access_time_utc": "2026-11-02T23:04:09.450196+00:00",
    "evidence_path": "evidence/Fundamental_characteristics_of_a_circuit-breaker.html",
    "evidence_kind": "manufacturer guidance",
    "coverage_limitation": "General guidance not normative text"
  },
  {
    "source_url_or_path": "https://www.electrical-installation.org/enwiki/Other_characteristics_of_a_circuit-breaker",
    "title": "Schneider circuit-breaker other characteristics",
    "access_time_utc": "2026-11-02T23:04:09.450196+00:00",
    "evidence_path": "evidence/Other_characteristics_of_a_circuit-breaker.html",
    "evidence_kind": "manufacturer guidance",
    "coverage_limitation": "General guidance not normative text"
  },
  {
    "source_url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Prior bounded safety review",
    "access_time_utc": "2026-11-02T23:04:09.450196+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Not a Part 2 review"
  },
  {
    "source_url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md",
    "title": "Prior switching research",
    "access_time_utc": "2026-11-02T23:04:09.450196+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Part 2 detail truncated"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTJ7ZWQ2LjB9Yi5wZGY=",
    "title": "IEC Part 2 public preview request",
    "access_time_utc": "2026-11-02T23:04:09.450196+00:00",
    "evidence_path": "evidence/preview-failure.html",
    "evidence_kind": "failed preview",
    "coverage_limitation": "Returned HTML error, no text accessed"
  }
]
`````
