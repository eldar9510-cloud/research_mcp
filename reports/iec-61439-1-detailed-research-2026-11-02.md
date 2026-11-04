---
{
  "format": 1,
  "metadata": {
    "id": "iec-61439-1-detailed-research-2026-11-02",
    "title": "IEC 61439-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61439-1?",
    "scope": "Detailed IEC 61439-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:29.507Z"
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
  "sourceDigest": "dc5106f28288ef899158d13e7a295da5b69a227e92bba00f8ca59966f6f7ad09",
  "proposalRevision": "75cda97a18841bd178fcb86c8572018e74e9a0868458f5041772b2ec2832e013"
}
---
# IEC 61439-1 — general rules for low-voltage assemblies

**Research check:** 2026-11-02 UTC. This is a scope- and public-abstract-based investigation, not a full-clause review, legal opinion, product approval or machine verification.

## Identity and status

IEC **61439-1:2020**, *Low-voltage switchgear and controlgear assemblies — Part 1: General rules*, is the third edition of an international standard, published 5 May 2020. IEC states that it technically revises and replaces the 2011 second edition. The IEC lifecycle identifies corrigendum 1 (December 2021) and corrigendum 2 (September 2023), and the catalog says their contents are incorporated into its copy. On the check date IEC shows the 2020 edition as published and 2011 as revised. This is an IEC publication check, not confirmation of a national EN adoption, applicable legal edition or OJEU status. [1]

The old batch's identifier 32338 does indeed resolve to **Part 1**, not to both parts: IEC gives Part 2 a distinct publication record, 30043. The older report's combined current-edition shorthand obscures this distinction. [1,2,5]

## What the general rules do

Part 1 provides common definitions, service conditions, construction requirements, technical characteristics and verification requirements for low-voltage switchgear and controlgear assemblies. In practical terms, it concerns the **assembled combination**, not merely the individual switch, protective device, drive or sheet-metal enclosure considered in isolation. Assembly manufacturers, system designers, specifiers and purchasers can use the standard and relevant specific part to agree the design, service environment, interfaces and evidence. [1] That intended-user description is an engineering interpretation of the stated scope, not a quoted exhaustive list of prescribed users.

Part 1 is **not a stand-alone conformity route**: IEC says to apply the relevant Part 2 onward together with the cited provisions of Part 1. For assemblies not covered by Part 3 onward, IEC says Part 2 applies. This does not remove the need first to establish that the object is within the 61439 assembly family at all. [1]

Part 2 covers power switchgear and controlgear assemblies, including equipment for power generation, distribution and conversion **and control of consuming equipment**, with associated data processing. Its published scope includes indoor/outdoor, stationary/movable, enclosed or unenclosed examples, and states rated voltage limits of 1,000 V AC or 1,500 V DC and incoming nominal frequency no greater than 1,000 Hz; certain special service applications also require their other specific requirements. These numbers are cited from the **Part 2** publisher abstract, not asserted as a complete Part 1 scope or a design instruction. [2] Other specific parts must be checked for their own equipment scope and edition; this inquiry did not independently map all other parts or exclusions.

An empty enclosure is a different object: IEC 62208 covers enclosures supplied before switchgear/controlgear incorporation, intended as parts of assemblies. An enclosure claim alone does not demonstrate an assembled system's verification. Conversely, populating a box is not by itself proof that every product is a 61439 assembly: determine the equipment, intended use, applicable specific part and exclusions. [1–3]

## Verification themes and conditions of use

The public Part 1 abstract identifies construction, declared characteristics, service conditions and verification, and highlights 2020 changes on DC, class I/II electric-shock protection, and group rated current and temperature-rise verification. It also distinguishes converters, switch-mode power supplies, UPS and adjustable-speed drive systems tested to their own product standards from how such products are incorporated into an assembly under the 61439 series. A component's own product test cannot simply be substituted for assembly-level evidence. [1]

For an actual project, the engineer should obtain the applicable full documents and investigate, as relevant:

- **Interface and ratings:** actual incoming and outgoing circuits, supply characteristics, rated currents, loading combinations and specified duty; compare component external ratings and manufacturer's mounting/derating conditions with the assembled arrangement. In particular, the 2020 abstract's group current and temperature-rise changes warn against assuming individual nameplate currents settle a loaded assembly. [1]
- **Environment and construction:** declared indoor/outdoor conditions, temperature, ventilation/cooling, access, protective barriers, insulation and protective bonding arrangement, plus the installed envelope. These are practical evidence questions within the abstract's service-condition, construction and shock-protection themes, not a statement that every listed feature has an identical prescribed test. [1,2]
- **Fault and heat behaviour:** request the assembly's documented temperature-rise, short-circuit and protective-device coordination evidence, with the actual arrangement and limits of use. The Part 2 abstract specifically discusses temperature-rise verification and cooling in its changes; the exact verification options and applicability require the full texts. [2]
- **Verification and responsibility:** ask who is responsible for the original design and the delivered assembly, what design-verification evidence applies to the exact configuration and what routine checks were performed on the delivered unit. The historic batch calls these design and routine verification and lists alternative methods, but no complete governing clauses were available here; do not treat that batch's claimed fixed count or all methods as verified universal requirements. [1,5]

Ratings, protection, installation and manufacturer instructions matter **under the actual use conditions**: enclosure changes, additional devices, modified ventilation, loading, wiring or fault levels may invalidate a claim's applicability. That is an engineering caution, not a finding that a particular modification necessarily fails. Request the actual configuration, verification basis, declared limitations, and authorization/assessment of changes.

## Machine electrical equipment boundary

IEC 60204-1 addresses electrical, electronic and programmable electronic equipment and systems of machines not portable by hand while working; IEC's abstract identifies the scope as beginning at the connection of supply to the machine's electrical equipment. It addresses the machine equipment rather than serving as the specific assembly product part. [4]

A control assembly can be part of a machine electrical system and may also fall within an applicable 61439 specific part; IEC's Part 2 scope explicitly includes control of equipment consuming electrical energy, not only distribution boards. Whether both routes apply depends on the actual object, functions, scope, exclusions, chosen editions and applicable legal context. Neither a blanket claim that 60204-1 always displaces 61439 nor a rule that every populated machine cabinet automatically conforms to or requires 61439 is established by the public abstracts. [1,2,4] The historical batch's categorical lift-cabinet supremacy statement is therefore not adopted. [5] A machine-specific type-C standard or jurisdiction can add requirements; none was checked here for a specific machine.

## Safety role and ISO 13849 boundary

The assembly rules' shock-protection, construction, loading and verification themes can support electrical safety and reliable integration. They do **not**, by themselves, demonstrate that an emergency-stop chain, drive safety function or protective interlock achieves a particular PL, SIL, diagnostic coverage or architecture category. The machine safety function must be specified and validated through its appropriate system-level route, including its actual inputs, logic, outputs, interfaces and installation conditions. This is a scope distinction, not a claim that 61439 prohibits safety-related components within an assembly. [1,4]

For bought equipment retain the exact supplier's external ratings, connection diagrams, protection, ventilation and safety-use instructions and any claimed safety metrics; do not infer a safety subsystem certification or demand proprietary internal circuits merely because it is inside a cabinet. Machine integration evidence remains distinct from a component declaration and an assembly verification claim.

## Library and holdings implications

For the existing `enclosure` category, differentiate empty shell from populated assembly and record the exact manufacturer/variant and applicable standard evidence rather than reclassifying all enclosures. For an assembly review, useful questions include the specific 61439 part and edition, declared service conditions and ratings, verified configuration, documentation of design and individual routine checks, short-circuit and thermal limitations, and installed component conditions. Component categories such as circuit protection, contactors, drives and supplies remain assessed against their own exact product evidence, while their incorporation is an assembly-level question. No library category, schema or approval decision is changed. [1–3,6]

`NORMATIVE_CANDIDATES.json` reports no matching PDFs, extracted markdown or memory candidates; a filename search under the NORMATIVE tree found no named 61439 document (one unrelated image filename happened to contain the digits). Therefore **no matching local full text was found**, not proof no copy exists anywhere in the project. No EN adoption, supplier-cited edition or manufacturer certificate for a real assembly was inspected. [7]

**Recommendation:** conditional targeted acquisition of the applicable Part 1 plus the selected specific part and corrigenda when a real assembly design, change or clause-level verification requires it; do not buy solely because a component library has an enclosure category. If a supplier already supplies the completed assembly, first request its exact declaration, ratings, verification evidence and use conditions. The historical batch is a research lead, not full-text holding or proof of conformity. [1,5–7]

## Sources and limits

1. IEC catalog, [IEC 61439-1:2020](https://webstore.iec.ch/en/publication/32338), abstract, publication detail and lifecycle, inspected 2026-11-02; `evidence/iec-32338.html` and extracted visible text `evidence/iec-32338.txt`.
2. IEC catalog, [IEC 61439-2:2020](https://webstore.iec.ch/en/publication/30043), abstract and change summary; `evidence/iec-61439-2.html`, `.txt`.
3. IEC catalog, [IEC 62208:2023](https://webstore.iec.ch/en/publication/67906), abstract; `evidence/iec-62208.html`.
4. IEC catalog, [IEC 60204-1:2016](https://webstore.iec.ch/en/publication/26037), scope; page also offers a 2016+2021 consolidated version, not itself inspected as normative text; `evidence/iec-machine.html`, `.txt`.
5. Local historical lead: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md`, lines 14–27; claims in that batch are not primary evidence.
6. Local guide: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, category and evidence-boundary guidance.
7. `NORMATIVE_CANDIDATES.json` and read-only filename search under `/media/eldar/disk_2/Machine_concept/NORMATIVE`.

The official preview request returned HTTP 403 (`evidence/preview.pdf` is the saved HTML error, not a PDF); it was not bypassed. No full Part 1 or Part 2 text, complete exclusions, design/routine verification clauses, precise use-condition thresholds, or machine-specific case were inspected. Consequently the verification checklist is an evidence prompt, not a clause-by-clause test schedule. Search results were not relied upon. Verify the complete applicable editions and legal status for a real project.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `8bfe568c03231d6e14703ad55b59db700005d37f6b30fab5292570ffcf8efd40`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61439-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61439-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full Part 1 and Part 2 clauses not inspected; official preview returned 403",
    "No specific assembly, manufacturer evidence, national adoption or legal listing assessed"
  ],
  "local_holdings_summary": "No matching full-text candidates found in NORMATIVE; filename search found no matching document."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source": "https://webstore.iec.ch/en/publication/32338",
    "title_edition": "IEC 61439-1:2020",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": "evidence/iec-32338.html",
    "evidence_kind": "public scope and lifecycle",
    "coverage_limitation": "Not full standard; corrigenda mentioned"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/30043",
    "title_edition": "IEC 61439-2:2020",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": "evidence/iec-61439-2.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Not full text"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/67906",
    "title_edition": "IEC 62208:2023",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": "evidence/iec-62208.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Not full text"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/26037",
    "title_edition": "IEC 60204-1:2016",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": "evidence/iec-machine.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Not full text; amendment not separately inspected"
  },
  {
    "source": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxNDM5LTF7ZWQzLjB9Yi5wZGY=",
    "title_edition": "IEC 61439-1:2020 preview request",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": "evidence/preview.pdf",
    "evidence_kind": "access failure",
    "coverage_limitation": "403 HTML error, no preview text"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "title_edition": "Historical batch 8",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Not primary; contested machine-cabinet conclusion"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title_edition": "Research guide",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": null,
    "evidence_kind": "local guidance",
    "coverage_limitation": "Not normative text"
  },
  {
    "source": "NORMATIVE_CANDIDATES.json",
    "title_edition": "Local holding candidates",
    "access_time_utc": "2026-11-02T23:05:21.956905+00:00",
    "evidence_path": null,
    "evidence_kind": "local inventory",
    "coverage_limitation": "No matching candidate; filename search also performed"
  }
]
`````
