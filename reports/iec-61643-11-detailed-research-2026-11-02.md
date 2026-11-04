---
{
  "format": 1,
  "metadata": {
    "id": "iec-61643-11-detailed-research-2026-11-02",
    "title": "IEC 61643-11 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61643-11?",
    "scope": "Detailed IEC 61643-11 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:25.929Z"
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
  "sourceDigest": "628a4feda398e5012bdade9122ac2d738d51af6f35cee0ae1ae6b1dab7b4a606",
  "proposalRevision": "b3a69b33d2c5f4cc60c3dde87e5e38696b16ca81f4002acf6d7d40a3e9385322"
}
---
# IEC 61643-11 — AC power surge protective devices

**Publisher check:** 2026-11-02 UTC. This is a scope- and catalog-based investigation, not a full-clause or product-conformity assessment.

## Identity and edition

[IEC 61643-11:2025](https://webstore.iec.ch/en/publication/65314), *Low-voltage surge protective devices – Part 11: Surge protective devices connected to AC low-voltage power systems – Requirements and test methods*, is an International Standard, edition 2.0, published 2025-06-18. IEC's page states that its copy incorporates corrigendum 1 (2026-10); the underlying lifecycle metadata identifies **IEC 61643-11:2025/COR1:2026**, published 2026-10-21. This is a correction to the 2025 edition, not evidence of a new 2026 edition. The page gives a 2029 stability date, which is not an expiry date or guarantee of unchanged requirements. No exhaustive amendment or regional-adoption audit was performed. [S1]

IEC marks [IEC 61643-11:2011](https://webstore.iec.ch/en/publication/5682), edition 1.0, revised, with withdrawal date 2025-06-18. Its title lacks the later title's explicit AC wording, but its published scope already concerns AC power circuits. Preserve an actual supplier's declared 2011 edition rather than upgrading its claim by inference. This IEC withdrawal is not itself a determination of an EN transition date or legal status. [S2]

## What it does and who uses it

A surge protective device (SPD) limits transient overvoltages and diverts surge currents. IEC describes devices containing at least one nonlinear component, intended to mitigate indirect or direct lightning effects or other transient overvoltages. Part 11 provides the AC-specific product requirements, test methods, ratings and performance and safety topics relevant to manufacturers, test laboratories, purchasers and engineers comparing the documented interfaces of AC SPDs. Its focus is the device and how it is characterized, not a complete installation design. [S1]

## Scope and boundaries

The 2025 IEC scope covers SPDs intended for connection to AC power circuits and equipment rated up to **1,000 V RMS**. The preferred frequencies considered are 50/60 Hz, but other frequencies are not excluded. Tests assume an AC source with a linear voltage-current characteristic; another source or frequency needs careful consideration, notably expected system and fault conditions such as short-circuit current and temporary overvoltage stresses. This is not evidence that every alternative-source SPD is excluded. [S1]

IEC says the document can apply to railway applications when related product standards do not exist for that area or certain applications. For specific power applications, such as limited-power circuits, nonlinear sources or circuits protectively separated from the utility supply, a risk assessment might show that not every requirement needs to be applied. National regulations may impose other exclusions. These are conditional scope statements, not permission to omit tests by default. The public abstract does not enumerate every exclusion; consult the actual applicable text before ruling a device in or out. [S1]

AC power SPD applicability does not automatically transfer to an SPD on a DC power bus, photovoltaic circuit, signal or communication interface. Determine the port and product first; identify the applicable specialty standard separately. IEC 61643-01 has a wider common-requirements scope including both AC and DC, but that does not make Part 11 the specific product standard for every DC device. [S1, S3]

## Relationship with the general part and technical content

IEC states that the 2025 AC-specific requirements **supplement, modify or replace** specified general requirements of [IEC 61643-01](https://webstore.iec.ch/en/publication/65315), and that Part 11 must be read and applied together with its latest edition, referenced undated in Part 11. IEC 61643-01:2024, edition 1.0, supplies common SPD requirements. IEC says the two publications together replace the 2011 Part 11. The general part is not merely optional background, nor can Part 11:2025 be treated as a standalone restatement of the old edition. [S1, S3]

The 2025 catalog lists changes that reveal the relevant technical areas without substituting for the requirements themselves: allocation of tests to a complete SPD, a protection mode or an assembly; measurement of voltage protection level across combined modes; additional duty testing for T1/T2 SPDs with follow current; revised short-circuit testing; dielectric testing of main and electrically separated circuits; and clearances for electrically separated circuits. The abstract does not establish detailed test sequences, pass criteria, ratings for a particular article, or the scope of every type. Those require the applicable standard and product documents. [S1]

## Practical electrical use

When considering an AC SPD, establish the protected power-system arrangement and actual external connection points, normal and temporary overvoltage conditions, available fault current and relevant surge exposure. Compare the exact product's declared operating voltage, protection modes, voltage protection level and discharge/test classification, fault and follow-current behavior where applicable, disconnect/status indication, environmental limits, and manufacturer-prescribed backup protection and coordination. Confirm the installation's upstream device, wiring and earthing arrangements against the actual manufacturer's instructions and the applicable installation standard. These are engineering questions, not asserted universal Part 11 numeric mandates. [S1]

An AC SPD at a supply interface does not by itself establish adequate transient protection at every downstream 24 V DC device: interfaces, wiring, coupling paths and equipment withstand need separate evaluation. It also does not itself provide overcurrent protection, protective isolation or a machine safety function merely by virtue of being an SPD. Record externally declared behavior and required accessories; proprietary internal circuit disclosure is not a prerequisite to intake.

The archived batch asserted fixed lead length, fuse range, universal voltage protection level, a specific TT voltage floor and obligatory monitoring [L1]. None is substantiated as a universal requirement by the inspected IEC abstract. Do not turn those historical claims into selection defaults; validate any proposed value against the applicable installation rules and specific device documentation. The abstract's reference to T1/T2 tests does not prove that every installation needs a particular type or rating.

## Functional safety

Surge protection can support the environmental resilience of equipment, including equipment that participates in a safety-related control system, but IEC 61643-11 is a product performance/safety and test standard, not a certificate of the safety function. A conformity claim alone does not establish PL, SIL, Category, diagnostic coverage or a failure-rate value. Where a supplier explicitly declares a safety-related subsystem or integration condition, preserve its exact evidence and assess the complete function separately under the selected machinery-safety route. An ordinary supply-side SPD should not be silently represented as a certified safety subsystem.

## Related standards and library use

- **IEC 61643-01:2024:** common SPD requirements used with the AC-specific Part 11, as above. [S1, S3]
- **IEC 60364-4-44:** IEC lists its 2024 edition among Part 11 normative references; it addresses protection of low-voltage electrical installations against voltage disturbances and electromagnetic disturbances. It has an installation protection role, distinct from SPD product testing. [S1, embedded IEC reference metadata; https://webstore.iec.ch/en/publication/73668]
- **IEC 60364-5-53 and IEC 62305 series:** historical leads for installation/selection and lightning protection respectively [L1]; exact edition, applicability and provisions were not independently checked here. Do not infer a mandate from their mention.
- **ISO 13849-1 / IEC 62061:** potentially relevant to a machine's safety-related control-function design and verification, rather than substitutes for this SPD product standard. Their exact requirements were outside this bounded scope research.

For the `surge_protection` library category, distinguish AC power SPDs from DC, PV and data/signal protection before assigning a candidate reference. Ask for exact manufacturer article and variant, declaration and cited edition, the applicable instruction sheet and the external ratings/conditions above. Other categories, such as power supplies, may be affected by coordination with an SPD without being themselves Part 11 SPDs. A candidate scope is not evidence of a supplier declaration or a product-approval decision. Do not change the library schema or normative catalog on this basis.

## Local holdings and acquisition

The supplied `NORMATIVE_CANDIDATES.json` lists no PDF, extracted markdown or memory candidates. A read-only filename search for `*61643*` within `NORMATIVE` also returned no matches. Thus **no matching full text was found**, not a proof that no differently named copy exists. No held edition could be inspected or equated with the IEC publication. The old batch is research-only, not full text or a reliable currency source.

**Recommendation: conditional acquisition/update** if an actual SPD selection, test interpretation or normative-catalog task needs clause-level answers: assess obtaining both the applicable Part 11 edition and the general part, including corrections, and retain supplier-cited editions where needed. No blanket purchase is justified solely by a category name.

## Sources and limitations

- [S1] IEC, [IEC 61643-11:2025](https://webstore.iec.ch/en/publication/65314), public catalog scope, metadata, correction and listed change summary; saved `evidence/iec-65314.html` and readable extraction `evidence/iec-65314.html.txt`.
- [S2] IEC, [IEC 61643-11:2011](https://webstore.iec.ch/en/publication/5682), scope and edition/withdrawal metadata; saved `evidence/iec-5682.html` and `.txt`.
- [S3] IEC, [IEC 61643-01:2024](https://webstore.iec.ch/en/publication/65315), scope and relationship; saved `evidence/iec-65315.html` and `.txt`.
- [L1] Local prior research: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md`, IEC 61643-11 section, lines 38–44, unverified historical lead.

Only public IEC abstracts and catalog metadata were inspected, not the complete standard, corrections text, an EN adoption, OJEU listing, or any actual supplier declaration. The embedded IEC reference metadata identifies IEC 60364-4-44; its linked catalog page was not separately inspected. No conformity, safety, installation, harmonization or legal conclusion follows from this report. Open questions depend on the exact product, installation and relevant jurisdiction.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `82e63e1f9d62955f4a057466d66b4e6d6f685c822ce157d9f7f9ac7bc6d0710c`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61643-11`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61643-11",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full 2025 standard, corrigendum and IEC 61643-01 clauses not inspected", "No EN adoption, OJEU/legal applicability or supplier declaration checked", "Installation and lightning companion standards not separately inspected"],
  "local_holdings_summary": "No candidates listed and no filenames matching *61643* found under NORMATIVE; differently named holdings cannot be excluded."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "checked_utc": "2026-11-02T23:00:05Z",
  "sources": [
    {"url": "https://webstore.iec.ch/en/publication/65314", "title": "IEC 61643-11:2025 edition 2.0, corrected version 2026-10", "accessed_utc": "2026-11-02T23:00:05Z", "evidence_path": "evidence/iec-65314.html", "evidence_kind": "public scope and publication metadata", "limitation": "Not complete standard or correction text; embedded reference metadata includes IEC 60364-4-44."},
    {"url": "https://webstore.iec.ch/en/publication/5682", "title": "IEC 61643-11:2011 edition 1.0", "accessed_utc": "2026-11-02T23:00:05Z", "evidence_path": "evidence/iec-5682.html", "evidence_kind": "public scope and publication metadata", "limitation": "Not full text; IEC withdrawal is not regional legal status."},
    {"url": "https://webstore.iec.ch/en/publication/65315", "title": "IEC 61643-01:2024 edition 1.0", "accessed_utc": "2026-11-02T23:00:05Z", "evidence_path": "evidence/iec-65315.html", "evidence_kind": "public scope and publication metadata", "limitation": "Not complete general requirements."},
    {"path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch01-power-gemini.md", "title": "Prior power standards research, IEC 61643-11 section", "accessed_utc": "2026-11-02T23:00:05Z", "evidence_path": null, "evidence_kind": "old research lead", "limitation": "Condensed and partly unsupported; not a normative source."},
    {"path": "NORMATIVE_CANDIDATES.json", "title": "Local candidate holdings list", "accessed_utc": "2026-11-02T23:00:05Z", "evidence_path": "NORMATIVE_CANDIDATES.json", "evidence_kind": "local inventory lead", "limitation": "Empty candidate list and filename search do not rule out differently named files."}
  ]
}
`````
