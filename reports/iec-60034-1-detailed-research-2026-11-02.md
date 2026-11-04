---
{
  "format": 1,
  "metadata": {
    "id": "iec-60034-1-detailed-research-2026-11-02",
    "title": "IEC 60034-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60034-1?",
    "scope": "Detailed IEC 60034-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.096Z"
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
  "sourceDigest": "19b1bed9e8ffc90820d39e1a2de17f0dc1f5519ace734df067126e2aff608839",
  "proposalRevision": "30256d2f2458efe64a5ad42de9ac10556adb543bc03034a0cd47e2e2ba6216ee"
}
---
# IEC 60034-1 — rotating electrical machines: rating and performance

**Publication check:** 2026-11-02 UTC. **Evidence level:** IEC publisher scope and public revision summary, not the full standard or an engineering compliance assessment.

## Identity and resolution of conflicting historical research

The exact publication is **IEC 60034-1:2026, Rotating electrical machines – Part 1: Rating and performance**, an International Standard from IEC TC 2. IEC lists it as **edition 15.0**, published **2026-03-13**, and its lifecycle record marks it published. The IEC says it cancels and replaces **edition 14.0, IEC 60034-1:2022**, a technical revision. IEC also lists **2017 as edition 13.0**. Thus the old master’s “edition 13:2022” is wrong, while the old batch’s tentative 2026/edition 15 is confirmed. The batch’s link 65446 is the *2022* edition, not the 2026 edition; 91195 is an entirely different part, IEC 60034-30-1:2025. [1][2][3][6]

IEC lists a redline version for 2026. The inspected lifecycle record does not list an amendment to the 2026 edition; no inference is made about future amendments. Publication status is not an EN adoption, supplier declaration, or current OJEU/legal applicability finding. No particular supplier-cited edition was investigated. [1][2]

## Purpose, users and actual scope

Part 1 supplies a common technical basis for rating and performance of rotating electrical machines. In practical terms it helps manufacturers describe and assess machines in a consistent framework, and helps machine builders, integrators and purchasers understand what machine rating and performance evidence to request. Its title and public revision summary support this description; exact requirements must be checked in the standard, not inferred from this report. [1]

IEC states that the 2026 edition applies to **all rotating electric machines**, except rotating electric machines for **rail and road vehicles**, for which it points to the IEC 60349 series. This is an equipment boundary, not a rule that every motor on a machine is necessarily a traction motor. For machines with integrated EMC-active components such as a variable-frequency converter, IEC treats the combination as a power drive system and says this document applies **only to the motor component**; the IEC 61800 series is relevant to the drive system. This is a particularly important 2026 scope clarification, not authority to treat an integrated converter as compliant merely because its motor has a 60034-1 claim. [1]

IEC notes that other standards can supersede, modify or add requirements, giving IEC 60079 and IEC 60092 as examples. Special applications such as radioactivity or aerospace can modify particular provisions while other provisions apply to the extent compatible. Whether any such special requirements actually apply depends on the machine and use; this report has not assessed a specific installation. [1]

## Subject areas and practical electrical relevance

The IEC’s 2026 change summary identifies, among other matters, converter duty; selection of a method for large machines; thermal class values; test voltage after rewinding; overspeed testing; digital form of information; protective-earth testing; integrated variable-speed drives; and EMC-related clarifications. These are **topics visible from the publisher’s change description**, not a full list of obligations or a substitute for reading the relevant provisions. In particular, the summary does not establish an actual machine’s insulation classification, test results, limits, duty rating or operating conditions. [1]

For a real purchased motor, useful questions for the supplier and designer include:

- What is the exact motor model, declared standard and edition, and actual rated operating conditions? Is it a separate motor or a motor with an integrated converter? Preserve the manufacturer’s stated values rather than generating them from the standard name.
- What duty and thermal operating envelope does the supplier actually declare, and does the expected load profile fit it? The historical batch suggests specific lift duty types, but neither the assignment nor the publisher scope establishes a particular motor’s duty; **do not assign one from that suggestion**.
- What supply and converter compatibility, cooling, environmental conditions, protective connections and manufacturer-prescribed external protection apply to the exact motor and drive combination? These are engineering evidence questions, not claims that Part 1 alone determines the answer.
- What evidence exists for declared rating and performance, and are any additional machine, location, rewinding or converter-specific provisions relevant? The public listing does not establish whether a particular device passed a particular test.

The motor’s product data and external interface are distinct from machine-level selection and installation. Manufacturer documentation may state connections and necessary external measures; proprietary internal circuits or mechanical details are not required merely to accept an off-the-shelf component. The standard is not itself a wiring diagram, protective-device coordination study or machine-system acceptance certificate.

## Functional safety boundary

The assigned document is a rotating-machine rating/performance standard, not evidence that a motor or complete drive supplies a certified safety function. The public IEC scope and title do not establish a PL, SIL, diagnostic coverage, Category or safety failure rate for any motor. Where a drive performs a safety function, evaluate its exact manufacturer documentation and applicable functional-safety and machine integration framework separately; stopping, holding and electrical isolation are also distinct application questions. Prior local safety review found blanket claims that certified STO automatically permits removing contactors or establishes whole-machine safety integrity unsupported. [1][7] No motor duty, nameplate value, braking performance or safety performance is inferred here.

## Related standards — distinct jobs

- **IEC 60034-2-1:2024:** methods for determining losses and efficiency from tests; consult for measurement, not to infer an efficiency class from Part 1. [4]
- **IEC 60034-30-1:2025:** efficiency classes for certain line-operated single-speed AC motors within its stated scope; it references machines rated to Part 1 or IEC 60079-0 and is not universal to all motors or all variable-speed arrangements. [3]
- **IEC 61800 series:** IEC itself directs integrated EMC-active converter/machine combinations toward power-drive-system standards, while reserving Part 1 to the motor component. Select the relevant specific drive and safety part according to the actual application, not merely the category label. [1]
- **IEC 60349 series:** publisher’s alternative route for rotating electric machines for rail and road vehicles. **IEC 60079** and **IEC 60092** can impose additional or modifying requirements for their own relevant applications; verify the appropriate part and edition. [1]

These are routing distinctions, not a finding that a particular companion part is mandatory for an unidentified product.

## Library and local holdings

Primary category affected is `motor`; `vfd` is also relevant where the motor and converter form a drive system, especially for an integrated unit. Ask for exact subtype, motor versus integrated-drive boundary, manufacturer declaration and edition, rated operating conditions, compatibility and supplier documentation. Keep product evidence separate from any later application or safety-function validation. This is an evidence route, not a library schema change, product approval, compliance conclusion or policy default. [1][5]

The supplied `NORMATIVE_CANDIDATES.json` lists **no matching PDFs, extracted markdown or memory candidates** for IEC 60034-1. Therefore no held full text or held edition was verified in this task; the historic batch is a research reference only, not a local copy of the standard. This is a bounded candidate-based finding, not proof that no differently named copy exists anywhere. **Recommendation: conditional acquisition/update** if an actual motor review needs authoritative clause interpretation, testing or manufacturer-claim verification; otherwise use the public scope and supplier’s exact documentation for initial routing. Do not purchase automatically for every motor.

## Limitations and open questions

The official IEC public scope and revision notes were inspected; the full 2026 requirements and clause context were not. IEC’s public preview request returned an HTML error rather than a PDF; it is retained as `evidence/preview.pdf` (HTML despite extension). This limits detailed coverage of tests, ratings, tolerances, exclusions and interaction with other standards. No EN adoption or current legal/OJEU status, specific manufacturer evidence, or exact local edition was checked. A case-specific review should obtain the applicable authorized standard text and actual manufacturer documentation before drawing conformity or design conclusions.

## Sources

1. IEC, [IEC 60034-1:2026](https://webstore.iec.ch/en/publication/89961), public scope, edition and revision summary; captured `evidence/iec-89961.html`.
2. IEC, [IEC 60034-1:2022](https://webstore.iec.ch/en/publication/65446), public scope and lifecycle listing for 2017, 2022 and 2026; `evidence/iec-65446.html`.
3. IEC, [IEC 60034-30-1:2025](https://webstore.iec.ch/en/publication/91195), efficiency-class scope; `evidence/iec-91195.html`.
4. IEC, [IEC 60034-2-1:2024](https://webstore.iec.ch/en/publication/67756), public scope; `evidence/iec-67756.html`.
5. Local `NORMATIVE_CANDIDATES.json` and `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md` (routing and candidate-list limitations).
6. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch05-drive-motor-gemini.md`, front-truncated historical lead, not primary authority.
7. Local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, bounded previous held-edition safety review, not a current-edition or legal audit.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `228308039c17203597fbbe77abd5314234fc3bc2347a331eb2ce5f14f52a2d74`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60034-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60034-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "No full 2026 clause text or public preview inspected",
    "No EN adoption or OJEU status verified",
    "No supplier-specific declaration checked"
  ],
  "local_holdings_summary": "Candidate list has no matching full text, extraction or memory; no held edition verified."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/89961",
    "title": "IEC 60034-1:2026 edition 15",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "evidence/iec-89961.html",
    "kind": "public scope and publisher lifecycle",
    "limitation": "Not full standard text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/65446",
    "title": "IEC 60034-1:2022 edition 14 and lifecycle",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "evidence/iec-65446.html",
    "kind": "public scope and publisher lifecycle",
    "limitation": "Not full standard text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/91195",
    "title": "IEC 60034-30-1:2025 edition 2",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "evidence/iec-91195.html",
    "kind": "public scope and publisher lifecycle",
    "limitation": "Not full standard text"
  },
  {
    "url": "https://webstore.iec.ch/en/publication/67756",
    "title": "IEC 60034-2-1:2024 edition 3",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "evidence/iec-67756.html",
    "kind": "public scope and publisher lifecycle",
    "limitation": "Not full standard text"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "README.md",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "kind": "old research lead and corrections",
    "limitation": "Read-only historical research; not primary publisher authority"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "title": "PRIMARY_SOURCE_CHECKS.md",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md",
    "kind": "old research lead and corrections",
    "limitation": "Read-only historical research; not primary publisher authority"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "SAFETY_SOURCE_REVIEW.md",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "kind": "old research lead and corrections",
    "limitation": "Read-only historical research; not primary publisher authority"
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch05-drive-motor-gemini.md",
    "title": "batch05-drive-motor-gemini.md",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch05-drive-motor-gemini.md",
    "kind": "old research lead and corrections",
    "limitation": "Read-only historical research; not primary publisher authority"
  },
  {
    "path": "NORMATIVE_CANDIDATES.json",
    "title": "Local holdings candidates",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "kind": "local candidate inventory",
    "limitation": "No matching candidate; not exhaustive proof"
  },
  {
    "url": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMDM0LTF7ZWQxNS4wfWVuLnBkZg==",
    "title": "2026 preview request",
    "access_time_utc": "2026-11-02T23:04:14.898414+00:00",
    "evidence_path": "evidence/preview.pdf",
    "kind": "failed preview request",
    "limitation": "HTML error, not PDF"
  }
]
`````
