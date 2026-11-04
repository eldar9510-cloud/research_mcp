---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-7-3-detailed-research-2026-11-02",
    "title": "IEC 60947-7-3 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-7-3?",
    "scope": "Detailed IEC 60947-7-3 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:28.403Z"
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
  "sourceDigest": "b5cfd8b8bb327a26ccef1d01a7635be6752fb846a1a9345f36635076653e47d7",
  "proposalRevision": "140c5c33658e18358f354bdc60be34fdd43cbfb77cf68c2c2ef4b118fd1c14a0"
}
---
# IEC 60947-7-3 — fuse terminal blocks

**Research check:** 2026-11-02 UTC. **Evidence level:** official IEC catalogue scope and publication records, not the full standard, a product certificate, or an installation assessment.

## Identity and status

IEC 60947-7-3:2009, *Low-voltage switchgear and controlgear – Part 7-3: Ancillary equipment – Safety requirements for fuse terminal blocks*, is an International Standard, edition **2.0**, published 20 April 2009. The IEC catalogue lifecycle identifies the 2002 edition 1.0 and its 2003 corrigendum as revised, and the 2009 edition as published [1]. IEC's public search returned these two main editions; its lifecycle shows no amendment to the 2009 entry [2]. This is a dated catalogue observation, not proof against future publications. In particular, the historical batch's “ed 1.0:2009” is incorrect: 2009 is edition 2.0 [1, H].

No EN adoption, OJEU listing, legal effect, withdrawal transition, or specific supplier-cited edition was checked. These are separate questions. The IEC catalogue explicitly directs that the 2009 document be read in conjunction with IEC 60947-1:2007 and IEC 60947-7-1:2009 [1]; its links currently resolve to consolidated companion records, so use the applicable referenced editions and amendments established from the actual documents, not an assumed pairing with the newest catalogue entry.

## Purpose, equipment and scope

A fuse terminal block joins wiring and incorporates a position for a replaceable cartridge fuse-link. It permits protection to be distributed on a terminal strip, but the terminal block, fuse-link and surrounding electrical equipment have distinct functions and ratings. The intended readers include terminal-block manufacturers and test bodies, as well as panel designers and component-intake engineers evaluating published data. Part 7-3 concerns product safety and test methods, not a complete circuit design or machine safety validation [1].

The IEC abstract specifies screw-type or screwless clamping units for rigid solid/stranded or flexible **copper** conductors, receiving cartridge links conforming to **IEC 60127-2**, primarily industrial or similar use. Its stated circuit envelope is up to 1,000 V AC at up to 1,000 Hz, or 1,500 V DC, with a maximum short-circuit breaking capacity of 1,500 A. These are **scope boundaries**, not values assigned to any individual component or fuse [1].

The abstract says the blocks are intended for installation in electrical equipment whose enclosing protection makes the blocks accessible only with a tool. Some applications, for example control circuits, may use blocks designed **exclusively for short-circuit protection** [1]. Therefore do not infer overload protection, safe live replacement, or a load-break/disconnector function merely from the fuse-terminal label. The abstract says Part 7-3 *may be used as a guide* for special conductor attachments such as quick-connect or wrapped connections and for insulation-penetrating/insulation-displacement connections; it does not automatically establish that every such termination is in the normal scope or compliant [1]. Other conductor materials, fuse families and configurations need individual evidence; absence from the published abstract alone is not an exhaustive exclusion list.

## What is governed, and what is not

The publisher describes safety requirements and mechanical, electrical and thermal test methods, including compatibility between terminal blocks and standardized fuse-links [1]. The abstract identifies changes from the earlier edition concerning creepage/clearance references to Part 1 Annex H, clamping-unit mechanical-strength testing, test tightening torques and dummy fuse-link resistance/dimensions. These are **topics and edition-change indicators**, not a substitute for reading the actual requirements, test setups or acceptance criteria. We did not inspect the full clauses and cannot state required test values, individual marking, or complete verification sequences.

Separate the physical fuse holder/terminal assembly, the replaceable fuse-link, and the wiring clamps. A fuse-link performs the current-interruption function within its own specified characteristics; a terminal block supplies a manufacturer-defined electrical and mechanical interface and mounting context. Part 7-3's standardization objective is not a claim that all links of nominally similar size or all holders are interchangeable. Verify the exact accepted link format, standard sheet or manufacturer part numbers, ratings and accessories, including any carrier, end cover, partition, mounting support, jumpers or indicators, from the applicable product documentation. A standalone fuse holder is not automatically the same product as a fuse terminal block; assess its own scope and declarations.

The IEC 60127-2 consolidated catalogue record describes miniature cartridge fuse-links, applicable alongside IEC 60127-1, and itself excludes links for appliances intended for special conditions such as corrosive or explosive atmospheres [3]. That exclusion is a statement about the **link standard's described scope**, not a new blanket exclusion invented for Part 7-3. IEC 60269-1 instead covers a separate low-voltage current-limiting fuse context with its own scope [4]; it is not a universal substitute for the specific IEC 60127-2 link interface in the Part 7-3 abstract. Choose the actual fuse family and product standard on evidence, not because a device is generically called a fuse.

## Electrical selection and safe application

For an identified block and circuit, obtain and compare the following from manufacturer documents; these are engineering evidence questions, not values extracted from Part 7-3:

- **Terminal and assembly:** article/variant, declared standard and edition, copper conductor type and cross-section range, stranded-wire preparation, number of conductors per clamp, tightening instruction where applicable, mounting and accessory instructions, spacing and temperature/derating constraints.
- **Circuit:** AC or DC voltage, frequency where relevant, current and load profile, available fault current at the installation point, and environmental/enclosure conditions. The standard's upper scope limits do not certify that the selected variant can handle them.
- **Link:** permitted dimensions and exact link family/standard sheet, rated current and voltage for the actual AC/DC circuit, interruption/breaking rating, time-current characteristic and manufacturer-approved combinations. Confirm that the weakest relevant interrupting/conditional rating and upstream coordination are adequate for the prospective fault. Do not infer DC capability from an AC rating or assume that every fuse provides overload protection appropriate to the conductor or load.
- **Access and maintenance:** enclosure and touch protection in the actual configuration, including while changing the link; isolation, verification of de-energization and replacement procedure according to applicable equipment instructions and safety rules. A carrier that can be opened does not, without evidence, establish a rated isolator, safe load switching, or protection against contact with live parts.

The prior batch asserted **IP20 touch-safety during cartridge replacement** for the whole class [H]. The official abstract does not establish that blanket assertion and explicitly describes a tool-access enclosure [1]. Any IP degree, touch protection and replacement state must be checked for the exact device, cover and installation; do not infer them from the standard reference or from a nominal enclosure IP rating. This is an evidence limitation, not a claim that no product can provide IP20.

## Functional safety and integration

A fuse terminal block is an electrical protection/interconnection component; it is not, by virtue of Part 7-3, a certified safety subsystem or a validated machine safety function. A fuse in a safety-related circuit can affect supply availability, fault behavior and maintenance, but protective interruption and functional-safety diagnostics are different claims. Do not derive ISO 13849 Category, diagnostic coverage, PL, SIL or a failure rate from this product-standard reference. Assess the actual safety function and component role against the applicable system framework and manufacturer evidence; a compliant fuse terminal block alone establishes neither fault exclusions nor achieved safety integrity. These are integration conclusions, not properties asserted by the publisher.

## Companion standards and project use

- **IEC 60947-1:2007 and IEC 60947-7-1:2009:** the explicitly named companion general and terminal-block parts for the 2009 Part 7-3 publication [1]. Part 7-1 addresses terminal blocks; it is not a stand-alone replacement for the fuse-specific Part 7-3. IEC's search also identifies a 2025 Part 7-1 [5]; that newer publication is not evidence that its text is automatically substituted in a dated 2009 reference.
- **IEC 60127-2 and 60127-1:** cartridge fuse-link requirements and their general companion, respectively [1, 3]. Record the link manufacturer's own stated edition and exact type.
- **IEC 60269-1:** different low-voltage fuse family context [4]; applicability depends on actual fuse and holder, not the word “fuse”.
- **IEC 60204-1 / ISO 13849:** potentially relevant machine electrical-equipment / safety-function assessment routes, respectively, as determined by the machine and use; neither is a substitute for component evidence. Exact edition and applicable clauses are outside this scope-only investigation.

For library routing, `terminal_fuse` is the direct candidate; associated replaceable `fuse` records and ordinary terminal/accessory interfaces may be relevant. Preserve the declared standard separately for block and fuse-link and keep any accepted combinations and conditions with the relevant part. A manufacturer's externally specified connections and compatible parts are sufficient subjects for intake; internal construction disclosure is not a prerequisite for a bought component. No category, schema, or approval policy change follows from this research.

## Local holdings and limitations

The supplied actual-filesystem candidate list has no matching PDF, extracted Markdown or memory file for IEC 60947-7-3 [L]. Thus **no matching full text found among supplied candidates**, not a proven exhaustive inventory of every file in the project. The historical batch is a research reference only, not a held standard [H]. No local Part 7-3 clauses were inspected. Recommend **conditional acquisition/update** only if a specific product design, conformity review, disputed interface or test requirement requires full text; also resolve the referenced companion editions for that work. Routine bought-product intake can first use exact manufacturer declarations, certificates, manual and fuse compatibility evidence. Parent should compare actual holdings independently.

## Sources

1. IEC, [IEC 60947-7-3:2009, edition 2.0 catalogue and lifecycle](https://webstore.iec.ch/en/publication/4007), public abstract, publication history and companion references; saved `evidence/iec-4007.html`.
2. IEC, [official publication search API](https://webstore-search-api.iec.ch/api/search), POST query `60947-7-3`, saved `evidence/api.json`; captures status and results, not full text.
3. IEC, [IEC 60127-2:2014+AMD1:2020 consolidated catalogue](https://webstore.iec.ch/en/publication/67623), and official search record `evidence/api-60127-2.json`.
4. IEC, [IEC 60269-1:2024 redline catalogue](https://webstore.iec.ch/en/publication/99295), and official search record `evidence/api-60269-1.json`; scope evidence only, not the text.
5. IEC, official search API query `60947-7-1`, saved `evidence/api-60947-7-1.json`; published 2025 entry, scope only.
6. [H] Local prior research `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md`, IEC 60947-7-3 section, used as a historical lead and corrected above.
7. [L] `NORMATIVE_CANDIDATES.json`, supplied local candidate inventory; empty for this part. Full standard and product-specific evidence were not obtained. No procurement, regulatory status or independent product conformity determination was attempted.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `487dfb3349cc9e029ec955dce76592accbfe70824683f2ac8fcc29cf294e4cdf`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-7-3`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-7-3",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and clauses not inspected; catalogue scope only",
    "Actual manufacturer fuse-holder/link compatibility, product-specific ratings and certification not researched",
    "EN adoption and legal/OJEU applicability not checked",
    "No independent exhaustive audit of local holdings"
  ],
  "local_holdings_summary": "Supplied candidate list contains no matching PDF, extracted Markdown, or memory file; historical batch is research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source": "https://webstore.iec.ch/en/publication/4007",
    "title": "IEC 60947-7-3:2009 edition 2",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "evidence/iec-4007.html",
    "evidence_kind": "public scope and lifecycle",
    "coverage_limitation": "No full clauses"
  },
  {
    "source": "https://webstore-search-api.iec.ch/api/search",
    "title": "IEC publication search: 60947-7-3",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "evidence/api.json",
    "evidence_kind": "official catalogue API",
    "coverage_limitation": "POST search; catalogue only"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/67623",
    "title": "IEC 60127-2:2014+AMD1:2020",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "evidence/iec-67623.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "No full clauses"
  },
  {
    "source": "https://webstore-search-api.iec.ch/api/search",
    "title": "IEC 60127-2 official search",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "evidence/api-60127-2.json",
    "evidence_kind": "official catalogue API",
    "coverage_limitation": "POST search; catalogue only"
  },
  {
    "source": "https://webstore.iec.ch/en/publication/99295",
    "title": "IEC 60269-1:2024 RLV",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "evidence/iec-99295.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "No full clauses"
  },
  {
    "source": "https://webstore-search-api.iec.ch/api/search",
    "title": "IEC 60269-1 official search",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "evidence/api-60269-1.json",
    "evidence_kind": "official catalogue API",
    "coverage_limitation": "POST search; catalogue only"
  },
  {
    "source": "https://webstore-search-api.iec.ch/api/search",
    "title": "IEC 60947-7-1:2025 official search",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "evidence/api-60947-7-1.json",
    "evidence_kind": "official catalogue API",
    "coverage_limitation": "POST search; no conclusion about substitution"
  },
  {
    "source": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
    "title": "Historical terminal research IEC 60947-7-3 section",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "coverage_limitation": "Not authoritative; edition and IP claim corrected"
  },
  {
    "source": "NORMATIVE_CANDIDATES.json",
    "title": "Part-specific local candidate inventory",
    "access_time_utc": "2026-11-02T23:04:46.047495+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "local inventory",
    "coverage_limitation": "Empty candidate list not exhaustive holdings audit"
  }
]
`````
