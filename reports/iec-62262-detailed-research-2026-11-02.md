---
{
  "format": 1,
  "metadata": {
    "id": "iec-62262-detailed-research-2026-11-02",
    "title": "IEC 62262 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 62262?",
    "scope": "Detailed IEC 62262 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:30.927Z"
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
  "sourceDigest": "a88d51960bef0d7610f9df3c7ab2fd9c40cd234086a86478c3e23406ff0c2511",
  "proposalRevision": "33c52f3f15381c309120ebf788cba924f123ff49420993d89e14d7367b93d1c6"
}
---
# IEC 62262 — mechanical impact protection of electrical-equipment enclosures

**Research check: 2026-11-02 UTC.** Status: detailed public-scope investigation, not full-clause inspection or conformity assessment.

## Identity and publication

IEC 62262 is the International Standard **Degrees of protection provided by enclosures for electrical equipment against external mechanical impacts (IK code)**. The Estonian national standards body EVS lists IEC 62262:2002, amendment 1:2021, and the consolidated IEC 62262:2002+AMD1:2021 CSV, valid from 3 September 2021. Its catalog also identifies the distinct regional adoption EVS-EN 62262:2008+A1:2021, based on the IEC base and amendment. These are separate publication identities, not interchangeable years. EVS search marks the consolidated edition as the newest version in its result, but this is not a complete IEC lifecycle search or a regulatory-status check. [S1, S2]

Important correction to the historical batch: its cited Webstore ID **80714 is not IEC 62262**; the inspected IEC page identifies IEC 60664-1:2020/AMD1:2025. Therefore the historical source cannot verify an IEC 62262 edition or detailed test parameters. [S3, S4] No current OJEU listing or legal obligation was investigated.

## What it does and scope

The code provides a common way to describe resistance of an electrical equipment enclosure to specified external mechanical impacts. It helps a product standards committee, enclosure manufacturer, test laboratory, or equipment selector communicate a test classification rather than use an unqualified adjective such as “robust”. It is a classification and test framework, not a complete safety standard for every product or installation.

The publisher's scope covers classification of enclosure protection from external mechanical impact where the **rated voltage of the protected equipment is no greater than 72.5 kV**. Crucially, it applies only to enclosures of equipment **where the specific equipment standard establishes degrees of protection against mechanical impacts**. [S2] A cabinet, HMI or light fitting is therefore a practical candidate to investigate, not automatically in scope merely because it has a housing. Applicability, applicable product rules and any required level must be established for the actual equipment. Above the stated voltage limit, or where the relevant specific standard does not establish the degree, the stated scope does not establish coverage. The public scope consulted does not enumerate every further exclusion; no exhaustive exclusion list is claimed.

The protective subject is the **enclosure and its equipment against the defined external impact**, not a certification that every internal function, mounting system or installed machine survives arbitrary impacts. Some product standards can prescribe specific construction or acceptance criteria; obtain those and the applicable edition of IEC 62262 before making detailed test or pass/fail decisions. The public abstract does not establish the entire allocation of test responsibilities or reproduce its requirements.

## Ratings and test concepts

IK is a graded mechanical-impact code: a higher declared code corresponds to a more severe standardized impact classification, not a rating for dust, water or electrical insulation. The old local batch reports IK00–IK10 and associates IK10 with 20 J, but its direct publication link is wrong; **these specific numeric mapping claims have not been independently verified against a primary IK table in this investigation** and should not be migrated as authoritative data. IK00 should not be read as a quantified impact resistance. [S3, S4] Obtain the actual edition and product-test evidence before relying on any grade-to-energy mapping, test tolerances, sample quantity, or special markings.

The closely related environmental test IEC 60068-2-75 describes three coordinated hammer-test methods. Its public scope describes applying a prescribed number of impacts, defined by energy and directions, to the specimen, and discusses apparatus and severity. [S5] This explains the test concept: the energy alone is not the complete test; the impacting apparatus, contact geometry, impact location and direction, support/mounting, specimen state, conditioning and acceptance assessment can matter. Those are **questions to check** in the applicable documents, not claims that all combinations are equivalent or specific clauses require particular values. Do not replace the controlled method with a generic object dropped from a calculated height without confirming the actual method and tolerances.

An IK marking alone does not prove resistance to repeated attacks, prying, sharp tools, projectiles, vehicle collision or deliberate vandalism. Nor does it automatically demonstrate retained sealing or correct operation after an impact; ascertain what was checked and the product-specific pass criteria. The historical description “vandal rating” is at most an informal application shorthand, not a universal anti-vandal guarantee. [S3, S5; engineering inference]

## Electrical selection and installation

For an exposed operator station, enclosure, signal unit, lighting product or machine-mounted sensor housing, first identify the exact product and installation exposure: realistic impact source, accessible faces, expected environment, mounting and potential consequences of damage. Then ask the supplier for the exact IK declaration, applicable edition and product-specific standard, tested configuration and limitations. Check whether accessories, windows, fasteners, cable entries and mounting orientation are included in the declared configuration. A variant or modified configuration must not inherit a claim without supporting evidence. These are selection questions, not new universal normative requirements.

Separately assess electrical suitability: voltage and current, ingress protection, bonding, overcurrent protection, mechanical support, thermal and chemical environment and prescribed external connections. A hit may damage a cover or seal; whether a given impact affects access to live parts or ingress needs evidence, not a presumption of failure or continued protection. Product testing and declaration are distinct from verification of the installed assembly. An empty enclosure, a populated assembly, and a panel-mounted device can involve different applicable product rules and configurations.

For purchased equipment treat its internal design as a supplier black box. Request the public specification, declaration or test evidence and installation constraints; do not demand internal circuits or proprietary mechanical design merely to record an IK claim. A supplier declaration, independent certificate and underlying test report have different evidential weight and should be identified separately.

## Related standards and safety role

* **IEC 60068-2-75**, environmental testing, Test Eh: hammer tests, provides impact-test methods. EVS lists a 2014 edition with 2025 amendment; its abstract describes three methods, not a complete IK classification table. Confirm the version invoked by the relevant product/IK standard rather than assuming all editions are interchangeable. [S5, S6]
* **IEC 60529**, IP code, concerns enclosure protection against access to hazardous parts, solid foreign objects and water. Its classifications and tests are distinct from IK; neither code can be derived from the other. An IP claim for a tested configuration does not independently prove post-impact IP performance. [S7]
* **IEC TR 62696:2011** is an IEC technical report specifically about application of the IK code to luminaires. It is not itself proof that a particular luminaire is rated or that the technical report is a mandatory product standard. [S8]
* The exact **equipment product standard** establishes whether and how this impact classification is used and supplies product-specific context. For a machine, the applicable machine and electrical-equipment rules address installation and the actual system; their applicability and clauses were not assessed here. [S2; inference]

**Functional safety:** IEC 62262 is not a functional-safety performance framework. A suitably selected enclosure may contribute physical protection of a safety-related component against credible impact, but that contribution depends on the hazard, installation, tested configuration, maintenance and complete function. An IK code alone supplies no PL, SIL, diagnostic coverage, Category, failure rate or validated safety subsystem. A safety device with its own documented safety function must still be integrated and validated under its applicable safety framework and manufacturer conditions; neither housing impact classification nor a label proves the achieved machine safety function.

## Library implications and holdings

Potential evidence prompts are relevant to `enclosure`, `hmi_panel`, `lighting`, `alarm_unit`, and exposed operator/sensor devices, **only when the actual subtype and environment warrant it**. Preserve exact article, claimed IK code, supplier's cited standard/edition, exposed or tested faces, accessory/configuration constraints, installation instructions, IP claim separately, and documentary source. Do not infer a code from category, IP, CE marking or similar-looking variants. No product or category policy has been amended.

`NORMATIVE_CANDIDATES.json` reports no matching PDF, extracted Markdown or memory candidate. No held full text was provided for inspection, so this is **no matching full text found through the supplied candidate search**, not proof of a whole-repository absence. The historical batch is a research reference, not a held standard. Recommend **conditional acquisition** only if the team must interpret a specific test, verify a disputed claim, or develop/verify a product-specific impact requirement; routine intake can first request the supplier's configuration-specific declaration. No automatic purchase for every category.

## Limitations and sources

The sources below were inspected on 2026-11-02 UTC and retained under `evidence/`; complete source metadata is in `SOURCES.json`. EVS provides catalog scope, not the complete licensed standard. An attempted public preview returned HTML rather than a readable PDF; no restricted access was bypassed. There was no full clause, complete IK rating table, applicable machine rule, manufacturer-specific declaration, or legal/OJEU assessment. Consequently test setup and numerical grade details remain unresolved.

* [S1] [EVS search results, IEC 62262 and EN adoption](https://www.evs.ee/en/search?query=62262).
* [S2] [EVS, IEC 62262:2002+AMD1:2021 CSV, public scope](https://www.evs.ee/en/iec-62262-2002-amd1-2021-csv-consolidated).
* [S3] Local historical `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md`, IEC 62262 section and source list; research lead only.
* [S4] [IEC Webstore publication 80714](https://webstore.iec.ch/en/publication/80714), actually IEC 60664-1:2020/AMD1:2025.
* [S5] [EVS, EN 60068-2-75:2014+A1:2025 public scope](https://www.evs.ee/en/evs-en-60068-2-75-2014-a1-2025-consolidated).
* [S6] [EVS search, 60068-2-75](https://www.evs.ee/en/search?query=60068-2-75).
* [S7] [EVS, EN 60529:2001+A2:2014 public scope](https://www.evs.ee/en/evs-en-60529-2001-a2-2014-consolidated).
* [S8] [EVS search, IEC TR 62696](https://www.evs.ee/en/search?query=62696).


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `590fbe9d54d724c6a1fc923247fa582c673d50cd452209ca31567a271556d56b`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-62262`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 62262",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full IEC 62262 clauses and authoritative numerical IK table not inspected",
    "IEC publisher lifecycle and applicable product requirements not fully verified",
    "No product-specific certification or current OJEU assessment"
  ],
  "local_holdings_summary": "Candidate inventory lists no matching PDF, extracted text or memory; no full held text identified."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source": "https://www.evs.ee/en/search?query=62262",
    "title": "IEC and EVS-EN 62262 publications",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/evs-search.html",
    "kind": "public catalog",
    "limitation": "Search listing, not exhaustive IEC lifecycle"
  },
  {
    "source": "https://www.evs.ee/en/iec-62262-2002-amd1-2021-csv-consolidated",
    "title": "IEC 62262:2002+AMD1:2021 CSV",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/evs-iec.html",
    "kind": "public scope",
    "limitation": "No full text"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/80714",
    "title": "IEC 60664-1:2020/AMD1:2025, wrong historical lead",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/iec62262.html",
    "kind": "public catalog",
    "limitation": "Not IEC 62262"
  },
  {
    "source": "https://www.evs.ee/en/evs-en-60068-2-75-2014-a1-2025-consolidated",
    "title": "EN 60068-2-75:2014+A1:2025",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/impact.html",
    "kind": "public scope",
    "limitation": "Not full test methods"
  },
  {
    "source": "https://www.evs.ee/en/search?query=60068-2-75",
    "title": "60068-2-75 catalog",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/evs-impact-search.html",
    "kind": "public catalog",
    "limitation": "No full text"
  },
  {
    "source": "https://www.evs.ee/en/evs-en-60529-2001-a2-2014-consolidated",
    "title": "EN 60529:2001+A2:2014",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/ip.html",
    "kind": "public scope",
    "limitation": "No complete IP criteria"
  },
  {
    "source": "https://www.evs.ee/en/search?query=62696",
    "title": "IEC TR 62696:2011",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/evs-luminaires-search.html",
    "kind": "public catalog",
    "limitation": "Title only"
  },
  {
    "source": "https://www.evs.ee/en/StandardDownload/DownloadPreview?productId=138839&language=41",
    "title": "IEC 62262 consolidated preview attempt",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "evidence/preview.pdf",
    "kind": "failed preview",
    "limitation": "Returned HTML, not PDF"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md",
    "title": "Historical batch 09",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md",
    "kind": "old research lead",
    "limitation": "Wrong IEC 62262 link"
  },
  {
    "source": "NORMATIVE_CANDIDATES.json",
    "title": "Local holdings candidates",
    "access_time_utc": "2026-11-02T23:06:34.892252+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "kind": "local candidate inventory",
    "limitation": "Not whole repository proof"
  }
]
`````
