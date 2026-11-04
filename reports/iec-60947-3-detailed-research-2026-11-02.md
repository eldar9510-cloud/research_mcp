---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-3-detailed-research-2026-11-02",
    "title": "IEC 60947-3 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-3?",
    "scope": "Detailed IEC 60947-3 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.232Z"
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
  "sourceDigest": "742ed879189f80640ff24f25a5391f2b711f671c064d1c811fc578fe7feab10a",
  "proposalRevision": "9bef8d04a88cfc5ff7446fbaf28095f379eaf96a7c08e4f2d14ff017f604ef16"
}
---
# IEC 60947-3 — switches, disconnectors and fuse-combination units

**Research check:** 2026-11-02 UTC. **Evidence level:** IEC publisher abstracts and lifecycle, not a full-text or clause review. **Conclusion:** this is a relevant product-standard route for particular low-voltage switching and isolation devices, not an installation instruction or a machine isolation approval.

## Identity and publication status

The IEC title is *Low-voltage switchgear and controlgear — Part 3: Switches, disconnectors, switch-disconnectors and fuse-combination units*. It is an International Standard from IEC TC 121/SC 121A. IEC identifies the fourth edition, **IEC 60947-3:2020**, published 22 April 2020, as a technical revision replacing the 2008 third edition and its 2012 and 2015 amendments. The base copy includes the October 2021 corrigendum. [1]

IEC's lifecycle identifies **IEC 60947-3:2020/AMD1:2025**, issued 25 April 2025, and a published consolidated version **IEC 60947-3:2020+AMD1:2025 CSV**, edition 4.1, of that date. [1–3] The latter is the most recent published edition shown in the inspected IEC lifecycle; this is a dated catalogue observation, not a guarantee against subsequent changes. We did not inspect the amendment text, so its specific technical changes are not established here. The 2020-only edition cited by historical research is therefore not the complete latest published consolidation in this check. EN adoption and OJEU legal status were not investigated; never equate an IEC record with either.

## Purpose, audience and scope

The publisher states that the document applies to **switches, disconnectors, switch-disconnectors and fuse-combination units, together with their dedicated accessories**, for distribution and motor circuits with rated voltage not exceeding **1,000 V AC or 1,500 V DC**. [1, 2] These are scope ceilings, not the operational ratings of every product. The standard provides a common product-assessment route for manufacturers and test organizations and gives equipment specifiers and electrical designers a way to interpret a device's declared capability and applicable conditions. The latter description is a practical interpretation of its scope and published revision notes, not a verbatim statement of normative purpose.

Keep the subtypes distinct:

- A **switch** is selected for its declared ability to make and break specified circuit conditions. A switch designation alone does not prove suitability for isolation.
- A **disconnector** provides a specified isolating function; do not assume that an arbitrary disconnector may make or break the actual operating load. Check the declared device and conditions.
- A **switch-disconnector** combines switching and isolation functions; both must be supported for the exact model and use. Neither the name nor a Part 3 reference alone establishes suitability as the installed machine's isolating device.
- A **fuse-combination unit** combines a switching device and fuse functionality; check the actual specified fuse, replacement configuration, assembly and ratings. Fuses add protective characteristics under stated conditions, not an inference that any fuse provides suitable protection or selectivity.

These descriptions are working engineering distinctions, not a substitute for the edition's formal definitions. The public IEC abstract does not list the full exclusions, auxiliary-equipment boundaries, all use categories, or necessary Part 1 application provisions. Voltage outside the publisher's stated ceiling lies outside the quoted scope; being inside it alone does not establish inclusion. In particular, do not claim this part covers every circuit breaker, contactor, protective relay, installation or assembled panel. Obtain the full applicable text for actual exclusions and references. [1, 2]

## Technical themes and practical electrical use

The public base-edition abstract identifies these **2020 changes** relative to the previous edition, which show the nature of the technical questions without claiming to summarize all clauses: DC switches' critical-load-current testing; conditional short-circuit rating for disconnectors, switches and switch-disconnectors protected by circuit-breakers; new categories for switching high-efficiency motors; connection to aluminium conductors; and power-loss measurement. [1] The conditional rating is specifically tied to protection by a circuit-breaker and its specified conditions: it is not a free-standing fault-interruption rating. The abstract also mentions fuse-combination units generally, but does not establish the details of their fuse coordination tests.

For an exact product and application, ask the supplier for the declared edition and model, poles, rated AC/DC voltage and current, permitted utilization category and load, switching capability and operating conditions. For motor circuits distinguish motor duty, starting/inrush and actual switching conditions from a generic thermal current rating. For DC, polarity, voltage, current and the circuit characteristics may matter; do not transfer an AC rating to DC or infer a critical-current result from a catalogue name. Confirm environmental and mounting conditions, accessible terminals, conductor material and cross-section, prescribed tightening/connection requirements, and any stated power loss. These are engineering evidence questions, not a claim that the limited abstract establishes each detailed requirement.

Ask for prospective fault conditions, manufacturer-declared conditional short-circuit capability and **the exact upstream protective device and configuration** on which it depends. A non-automatic switch or disconnector should not be treated as an overcurrent trip device merely because it may be installed alongside one. Check the supplier's fuse/protective-device compatibility, coordination information and installation instructions. The actual protective design, cable protection, assembly integration and verification remain application tasks; the abstract cannot decide the required values.

For a purchased device retain the manufacturer's published external contract: exact article, declarations and relevant test/certificate evidence, ratings, mounting, connections, prescribed accessories, operating limits and external protective parts. Proprietary contact mechanics or internal details are not a prerequisite for intake. A supplier declaration is not independent proof that this specific installed circuit was verified.

## Safety and isolation boundary

A product isolation declaration can be useful evidence about the device's intended function, but it does **not** itself establish that a machine's supply isolation, lockout, stored-energy control, emergency stopping or protective measures are adequate. Assess the actual installation, all relevant energy sources, external supplies and machine-specific provisions against the applicable machine standards and manufacturer instructions. In particular, the old local batch's statement that a Part 3 switch-disconnector fulfils an EN 81-20 isolation mandate while retaining emergency shaft lighting is **not established** by the IEC scope; no lift installation or lighting arrangement was assessed. [4]

ISO 13849 relevance is conditional: a switching device might be a component of a safety-related control function, but Part 3 product compliance does not certify a complete safety subsystem or prove achieved PL, Category, SIL, diagnostic coverage, reliability data or the entire function. Obtain exact supplier safety data and restrictions if actually claimed; evaluate architecture, diagnostics, failure response and application integration separately. A mechanically operated isolation device used solely for maintenance isolation does not automatically become an ISO 13849 safety-related control subsystem merely from its product classification. No approval or numerical safety calculation is made here. The earlier local safety-source check supports the general distinction between component characteristics and verified subsystem performance. [5]

## Related standards and library implications

**IEC 60947-1** is the general low-voltage switchgear/controlgear family context; verify the precise Part 1 edition and provisions referenced by the applicable Part 3 text, rather than assuming an edition from the family name. **IEC 60947-2** concerns circuit breakers and **IEC 60947-4-1** contactors/motor starters; they are distinct product routes and a given combination may require more than one product assessment. **IEC 60204-1** and applicable machine-specific standards address machinery electrical equipment and application-level provisions; **ISO 13849-1/-2** are conditional routes for safety-related control-system design and validation, not substitutes for this product standard. These are orientation leads; exact scope, edition, relationship and applicability were not independently checked in this investigation.

The most direct library route is `main_switch`, but determine whether the actual item is a switch, disconnector, switch-disconnector or fuse-combination unit before associating a candidate reference. `circuit_protection` may be relevant to the specified protective device or fused combination, while `contactor` is a distinct device category: neither category should inherit Part 3 automatically. Ask whether the exact supplier variant declares the applicable standard and edition, isolation suitability, poles and ratings, suitable load class, upstream device/fuse and conditions of use. Keep candidate scope, actual supplier declaration, independent test evidence, library lifecycle and machine verification separate. No schema or category mapping changes are proposed.

## Holdings, acquisition and limitations

The supplied local candidate list contains no matching PDFs, extracted Markdown or memory files. A filename search for `*60947*` across `NORMATIVE/` also returned no matches. Therefore **no matching full local text was found by these methods**; this is not proof that no differently named document exists anywhere. No held edition was available for direct comparison. [6] The batch file is a historical research lead, not a licensed standard or confirmed full text. [4]

**Recommendation: conditional acquisition/update**, not blanket purchase: acquire or otherwise lawfully consult the exact applicable Part 3 edition with its amendment and the referenced Part 1 where an actual selection, detailed clause, test, exclusion or device-combination question requires it. Preserve older supplier-declared editions separately. For ordinary intake, first obtain the exact manufacturer's free datasheet, instructions and evidence. The IEC public preview endpoint returned HTTP 403 and was not bypassed; no full clauses, normative exclusions, 2025 amendment changes, product datasheet, machine-specific provisions or current EN/OJEU status were inspected. Thus this report is detailed scope research but **not full-clause verification**.

## Sources

1. IEC, [IEC 60947-3:2020 publisher page and lifecycle](https://webstore.iec.ch/en/publication/59785), public abstract and publication metadata, saved `evidence/iec-59785.html`.
2. IEC, [IEC 60947-3:2020+AMD1:2025 CSV](https://webstore.iec.ch/en/publication/107159), public abstract and metadata, `evidence/iec-csv.html`.
3. IEC, [IEC 60947-3:2020/AMD1:2025](https://webstore.iec.ch/en/publication/76292), amendment identity/date only, `evidence/iec-amd.html`.
4. Local historical lead: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md`, lines 29–37; truncated research, not primary authority.
5. Local source check: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md`, section 4; bounded ISO 13849 safety claims, not a Part 3 inspection.
6. `NORMATIVE_CANDIDATES.json` in this research directory; read-only filename search under `/media/eldar/disk_2/Machine_concept/NORMATIVE/` on 2026-11-02.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `4f2a00788e2f83001887fb2c9a0b27fd1fd62b363e67018fd21b174a7ebcc4a2`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-3`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-3",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full text and explicit exclusions not inspected; IEC preview returned 403.", "2025 amendment technical changes not inspected.", "No product-specific supplier evidence or machine isolation assessment; no EN adoption or OJEU check.", "Related standards' exact scope and normative cross-references not independently verified."],
  "local_holdings_summary": "No matching NORMATIVE full text identified in supplied candidate list or filename search; older or differently named material cannot be ruled out."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "checked_utc": "2026-11-02T23:02:04Z",
  "sources": [
    {"url":"https://webstore.iec.ch/en/publication/59785", "title":"IEC 60947-3:2020, edition 4.0", "access_time_utc":"2026-11-02T23:02:04Z", "evidence_path":"evidence/iec-59785.html", "kind":"public scope and lifecycle", "limitation":"Publisher abstract, not full normative text; lifecycle identifies 2025 amendment and consolidation."},
    {"url":"https://webstore.iec.ch/en/publication/107159", "title":"IEC 60947-3:2020+AMD1:2025 CSV, edition 4.1", "access_time_utc":"2026-11-02T23:02:04Z", "evidence_path":"evidence/iec-csv.html", "kind":"public scope and metadata", "limitation":"Abstract only; amendment text not inspected."},
    {"url":"https://webstore.iec.ch/en/publication/76292", "title":"IEC 60947-3:2020/AMD1:2025", "access_time_utc":"2026-11-02T23:02:04Z", "evidence_path":"evidence/iec-amd.html", "kind":"amendment metadata", "limitation":"No technical amendment text inspected."},
    {"url":"https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTN7ZWQ0LjB9Yi5wZGY=", "title":"IEC 60947-3 edition 4.0 preview attempt", "access_time_utc":"2026-11-02T23:02:04Z", "evidence_path":"evidence/preview.pdf", "kind":"failed public preview", "limitation":"HTTP 403 HTML response, not a PDF; no bypass attempted."},
    {"path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md", "title":"Batch 02 switching historical research", "access_time_utc":"2026-11-02T23:02:04Z", "evidence_path":null, "kind":"old research lead", "limitation":"Truncated, not primary, includes unverified machine isolation statement."},
    {"path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/PRIMARY_SOURCE_CHECKS.md", "title":"Bounded primary-source checks, safety-framework section", "access_time_utc":"2026-11-02T23:02:04Z", "evidence_path":null, "kind":"prior source review", "limitation":"General safety distinction; not Part 3 text."},
    {"path":"NORMATIVE_CANDIDATES.json", "title":"Local candidate holdings", "access_time_utc":"2026-11-02T23:02:04Z", "evidence_path":"NORMATIVE_CANDIDATES.json", "kind":"local holdings index", "limitation":"Empty matching candidates; separate filename search also found none, not exhaustive content search."}
  ],
  "time_note":"Access timestamps rounded to the beginning of this short research session."
}
`````
