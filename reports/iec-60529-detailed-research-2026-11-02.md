---
{
  "format": 1,
  "metadata": {
    "id": "iec-60529-detailed-research-2026-11-02",
    "title": "IEC 60529 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60529?",
    "scope": "Detailed IEC 60529 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:30.611Z"
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
  "sourceDigest": "51553bd18623d2d2ede3001847295d9be992c907cad5a69f38efb564a6bd7af0",
  "proposalRevision": "f47fa764c6f702ff5d6f584e6927dd8c8123389a46c77866cd7b7156a7972740"
}
---
# IEC 60529 — degrees of protection provided by enclosures (IP Code)

**Research check:** 2026-11-02 UTC. **Depth:** IEC publisher identification and scope checked; full clauses and test tables not inspected. This is a technical routing report, not an assertion that any device, installation or machine conforms.

## Identity and status

IEC 60529 is the International Standard *Degrees of protection provided by enclosures (IP Code)*. The IEC lists the base as IEC 60529:1989, edition 2.0, and a consolidated edition **IEC 60529:1989+AMD1:1999+AMD2:2013 CSV**, edition 2.2, published 2013-08-29. The consolidated product description says the corrigenda of January 2003, September 2007, October 2009, October 2013, May 2015 and January 2019 are included in that copy. The IEC lifecycle on the inspected page lists that family as published; it does not by itself establish a jurisdiction-specific adoption or applicable legal status. The 2027 stability date is not a promised withdrawal or revision date. [S1, S2]

A significant correction to the earlier batch: its cited publication **64427** is not the consolidated standard but *IEC 60529:1989/AMD2:2013/COR1:2019*, a corrigendum to Amendment 2. Its page links to the actual consolidated publication **2452**. The historical batch also says the water digit ends at 8, overlooking the high-pressure/high-temperature water-jet designation 9 in the modern code; exact edition applicability and test conditions should be checked in the actual text. [S1, S3, L1] Neither an EN adoption nor a supplier's stated edition has been independently checked here.

## Purpose, scope and audience

The IEC publisher's abstract says that the standard classifies degrees of protection provided by enclosures for electrical equipment with a rated voltage **not exceeding 72.5 kV**. [S1, S2] It supplies a shared language for the enclosure aspect of product specifications and testing: how an enclosure limits access to hazardous parts and ingress of solid foreign objects and water under defined verification conditions. It is useful to product manufacturers and test laboratories assigning ratings, and to specifiers, installers and maintainers comparing the published limits with expected exposure. Its classification is not a general guarantee that equipment is safe or suitable for every environment. The public abstract is terse: a full list of scope exclusions and all product-standard modifications could not be verified here.

A product standard may refer to IEC 60529, prescribe a minimum, define equipment preparation or provide application-specific details; this cannot be assumed for **every** product standard. Nor does the mere presence of a code demonstrate that a particular product was independently certified or that the product is compliant with its own product standard. [S1, L2]

## Reading an IP designation

The code has the prefix IP followed by two characteristic positions. The **first** concerns protection against access to hazardous parts and solid foreign objects; the **second** concerns protection against harmful ingress of water. Examples commonly encountered are IP20, where the first position is associated with finger/probe access and solid-object protection, and IP54, a dust-protected/splash-water classification. The exact test probe, orientation, acceptance and equipment preparation must be checked against the applicable standard and product instructions, not inferred from the informal labels. The historical source's illustrations are orientation only, not a substitute for the tables. [L1; full code details not directly verified in a primary public text]

**X is not zero:** it means that the corresponding characteristic numeral is not specified in that designation; it must not be interpreted as proof of no protection or of a successful test. The two positions express different properties: IP6X is not a water claim and IPX7 is not a solids claim. Additional optional letters can convey additional access protection or supplementary information; do not strip them without checking what was declared. An additional letter for access should not be confused with the first characteristic numeral for objects. A multi-code claim, or qualifiers on the label/manual, should be preserved as published. The public primary sources accessible in this investigation did not expose the full coding table; verify any specific letter or code before relying on it.

## Test concepts and limitations

The IP designation represents a set of defined laboratory verification conditions, not a continuously measured real-world performance value. For access, a specified probe and success criterion matter; solids protection concerns standardized object or dust exposure and allowable ingress; water protection uses different exposure methods, including drip, spray/splash, jets and immersion depending on the declared position. Higher water categories 7 and 8 concern immersion, while 9 concerns high-pressure/high-temperature water jets. **Do not treat immersion and jet testing as a single universal exposure ladder**: a claim for one does not establish every other water exposure. For IPX8, obtain the manufacturer's specified immersion conditions; for IPX9 obtain the declared test basis and application conditions. Do not assume any arbitrary depth, duration, cleaning chemistry or wash procedure.

For exact numeric parameters, sample preparation, pressure/flow, temperature, duration, probe contact, acceptance criteria, and the applicability of multiple tests, consult the relevant edition and product standard. The IEC preview endpoint returned HTTP 403 in this investigation; the consolidated publisher abstract does not independently expose those details. The foregoing descriptions are therefore an **explanatory reading guide**, not a verified clause-by-clause account or test procedure. [S1, L1, F1]

Other properties require separate evidence: resistance to chemicals, solvents, oils, corrosion, UV, icing, condensation, humid air, ageing, repeated opening, vibration and mechanical impacts is not generally established by an IP code. Similarly, an IP mark does not itself establish creepage/clearance adequacy or the application's pollution degree. In particular, the historical claim that an IP54 cabinet automatically creates pollution degree 2 is not established: internal and external conditions, contaminants, condensation and the applicable insulation-coordination rules must be assessed independently. [L1, L2]

## Engineering use and installation boundary

For a cabinet, device, connector or cable entry, ask:

1. What is the precise device variant, declared complete IP designation, standard/edition, and source of the claim: datasheet, declaration, test report or third-party certificate? Is it a front-only, mated, closed or other configuration?
2. Is the expected exposure dust, splashing, a directed cleaning jet, immersion or something else? What chemicals, operating temperature, pressure, angle, duration, cable diameter and maintenance regime are expected? A nominal IP code alone may not answer these questions.
3. What manufacturer-prescribed mounting, sealing, cover, mating connector, tightening and cable-gland conditions apply? Are unused openings correctly closed? Record these external instructions as the purchased-product contract, without demanding proprietary internals.
4. Is the claimed rating for an empty enclosure, a device inside it, a connector in its mated state, or the completed assembly? Drilling, penetrations, cable entries, door seals, mounting and field maintenance can alter the installed boundary. Verify the assembled installation under its applicable product/assembly and machine rules; do not calculate its rating merely from individual component IP numbers.
5. What evidence establishes continued suitability for the actual use, inspection and maintenance plan, and who performs the system-level assessment?

An IP20 terminal inside a protected cabinet, for example, is not equivalent to a sealed terminal outside it. Conversely, a high-IP enclosure is not evidence that the internal devices have the same standalone IP rating. These are engineering consequences of specifying the physical boundary, not a conformance verdict on a hypothetical installation. [S1, L2]

## Safety and related standards

Protection against accidental access and harmful ingress can support electrical safety and environmental reliability; it is not itself an ISO 13849 safety-function rating. IEC 60529 alone does not establish a component's PL, SIL, diagnostic coverage, category, failure rate, safety certification or achieved safety function. A sealed sensor or safety controller can be either an ordinary component or a certified subsystem depending on its **own** published functional-safety evidence. The machine integrator still validates the complete safety function, the environmental assumptions and installed conditions. [L2, L3]

Relevant distinct roles, conditional on applicability:

- **IEC 62262:** separate IK/mechanical-impact classification; its presence does not establish IP and vice versa. Verify exact edition and product application. [S4]
- **IEC 60664-1:** insulation coordination and environmental/pollution considerations, not a conversion table from IP code to pollution degree. [S5, L2]
- **IEC 62208 / applicable IEC 61439 parts:** possible empty-enclosure and low-voltage assembly routes respectively; the supplied shell and completed assembly are different objects. Whether either applies depends on the actual assembly and cited product documentation, not the label “cabinet”.
- **IEC 60204-1 and applicable machine-specific standards:** possible machine electrical-equipment/installation and application requirements; IP classification does not replace that assessment. [L1, L2]
- **ISO 13849-1 / IEC 62061:** safety-related control-system assessment, distinct from enclosure ingress classification. Use the actual certified product and application evidence. [L3]

The last three bullets are routing advice, not a verified assertion that these documents normatively reference IEC 60529 in a particular edition.

## Library implications and holdings

The issue crosses `enclosure`, `connector_industrial`, `cable_gland`, sensors, switches, drives, motor, PLC, HMI and protective devices where an enclosure claim is relevant. Store the **exact** source-backed claim and its conditions in existing evidence/part documentation; category membership does not invent an IP rating. For glands and connectors, check sealing diameter and mated/capped status; for HMI or enclosures, check mounting-face versus rear rating. These questions do not require changing policy, schema, lifecycle status or purchased-device internals. [L2]

`NORMATIVE_CANDIDATES.json` lists no matching PDF, extracted text or memory candidate. A read-only filename search for `*60529*` under `/media/eldar/disk_2/Machine_concept/NORMATIVE` also returned no results. Thus **no matching full held IEC 60529 text found**, not proof there is no unrelated reference or differently named copy. The older batch is a research lead, not a held edition or authoritative table. **Recommendation: conditional acquisition/update** if the project needs to verify code tables, test conditions, a disputed product claim, or enclosure/assembly verification; use product documents for ordinary intake rather than automatically buying the standard for each device. No local source or catalog was changed.

## Sources and unresolved questions

- **S1:** [IEC 60529 consolidated edition 2.2, publisher page](https://webstore.iec.ch/en/publication/2452) — title, scope, corrections and edition; abstract only.
- **S2:** [IEC 60529:1989 publisher page](https://webstore.iec.ch/en/publication/2447) — base identity and scope.
- **S3:** [IEC 60529 AMD2 COR1 publisher page](https://webstore.iec.ch/en/publication/64427) — correction identity, link and lifecycle metadata.
- **S4:** [IEC 62262 consolidated publisher page](https://webstore.iec.ch/en/publication/80714) — related impact standard identity.
- **S5:** [IEC 60664-1 publisher page](https://webstore.iec.ch/en/publication/59671) — related insulation-coordination identity.
- **L1:** `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md`, IEC 60529 and IEC 60664-1 sections — historical lead with corrections noted above; not normative authority.
- **L2:** same directory, `README.md`, §§1–5 and `PRIMARY_SOURCE_CHECKS.md` §4 — library interpretation and quarantined claims.
- **L3:** same directory, `SAFETY_SOURCE_REVIEW.md`, claim assessment — bounded checks against held functional-safety editions, not an IEC 60529 text check.
- **F1:** IEC publicly linked preview `https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwNTI5e2VkMi4yfWIucGRm` returned 403; response retained in `evidence/preview.pdf` (HTML, not PDF). No access bypass attempted.

**Open:** authoritative clause-level verification of the full current code, optional letters, test methods and exceptions; any exact product's ratings and mounting; applicable EN adoption and current jurisdiction-specific legal status. No product or installation is approved by this report.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `ab5e8d84500af7733b4976de84a9d8accac65bcccc12e9cfd5628c03b987fff1`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60529`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60529",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Public full code tables and normative test clauses not inspected; IEC preview returned 403.",
    "No specific product claim or EN adoption/legal status verified."
  ],
  "local_holdings_summary": "No matching full text found in candidate list or filename search under NORMATIVE; historical research lead only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "id": "S1",
    "url_or_path": "https://webstore.iec.ch/en/publication/2452",
    "title": "IEC 60529:1989+AMD1:1999+AMD2:2013 CSV edition 2.2",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/iec2452.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract and lifecycle only; no full text."
  },
  {
    "id": "S2",
    "url_or_path": "https://webstore.iec.ch/en/publication/2447",
    "title": "IEC 60529:1989 edition 2.0",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/base.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Abstract only."
  },
  {
    "id": "S3",
    "url_or_path": "https://webstore.iec.ch/en/publication/64427",
    "title": "IEC 60529:1989/AMD2:2013/COR1:2019",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/iec64427.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Corrigendum metadata; not the consolidated text."
  },
  {
    "id": "S4",
    "url_or_path": "https://webstore.iec.ch/en/publication/80714",
    "title": "IEC 62262:2002+AMD1:2021",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/iec62262.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Related standard identification only."
  },
  {
    "id": "S5",
    "url_or_path": "https://webstore.iec.ch/en/publication/59671",
    "title": "IEC 60664-1:2020",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/iec60664.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Related standard identification only."
  },
  {
    "id": "S6",
    "url_or_path": "https://webstore.iec.ch/en/publication/2446",
    "title": "IEC 60529:1989/AMD2:2013",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/amd2.html",
    "evidence_kind": "public scope",
    "coverage_limitation": "Amendment identity only."
  },
  {
    "id": "F1",
    "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwNTI5e2VkMi4yfWIucGRm",
    "title": "IEC public preview request",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/preview.pdf",
    "evidence_kind": "failed request",
    "coverage_limitation": "HTTP 403; saved response is HTML, not PDF."
  },
  {
    "id": "F2",
    "url_or_path": "https://www.iec.ch/ip-ratings",
    "title": "IEC IP ratings page request",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "evidence/iec-ip.html",
    "evidence_kind": "failed request",
    "coverage_limitation": "HTTP 403."
  },
  {
    "id": "L1",
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch09-umbrella-gemini.md",
    "title": "Historical batch 09",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "original read-only path",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Secondary, contains incorrect publication link and limited water digit range."
  },
  {
    "id": "L2",
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
    "title": "Research library guide",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "original read-only path",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Not a standards text."
  },
  {
    "id": "L3",
    "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Safety source review",
    "access_time_utc": "2026-11-02T23:05:44Z",
    "evidence_path": "original read-only path",
    "evidence_kind": "old research lead",
    "coverage_limitation": "Not IEC 60529 normative text."
  }
]
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[S1]: <https://webstore.iec.ch/en/publication/2452>
[S2]: <https://webstore.iec.ch/en/publication/2447>
[S3]: <https://webstore.iec.ch/en/publication/64427>
[S4]: <https://webstore.iec.ch/en/publication/80714>
[S5]: <https://webstore.iec.ch/en/publication/59671>
[S6]: <https://webstore.iec.ch/en/publication/2446>
[F1]: <https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwNTI5e2VkMi4yfWIucGRm>
[F2]: <https://www.iec.ch/ip-ratings>
