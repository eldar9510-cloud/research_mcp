---
{
  "format": 1,
  "metadata": {
    "id": "iec-60309-2-detailed-research-2026-11-02",
    "title": "IEC 60309-2 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60309-2?",
    "scope": "Detailed IEC 60309-2 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:28.841Z"
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
  "sourceDigest": "7a86b4c144b5a20879118770732d5f1377c4043cc9b30c4d49c920716ee02603",
  "proposalRevision": "6a8ecfcbd32f73c48f01ea5c585ebc94470290341d768beb4a9a89a2498fe485"
}
---
# IEC 60309-2 — industrial pin-and-contact-tube interfaces

**Research checked 2026-11-02 UTC.** Scope-level investigation, not a conformity assessment. The IEC publisher abstract and catalogue lifecycle were inspected; the full standard and its dimensional tables were not. The public preview request returned HTTP 403; no attempt was made to bypass it. [S1, S2]

## Identity and publication status

**IEC 60309-2:2021**, *Plugs, fixed or portable socket-outlets and appliance inlets for industrial purposes – Part 2: Dimensional compatibility requirements for pin and contact-tube accessories*, is an IEC International Standard, edition 5.0, published 18 June 2021. IEC lists it as published. It replaces the 1999 fourth edition and its 2005 and 2012 amendments. The IEC abstract identifies a corrected version incorporating **corrigendum 1 of August 2026**. IEC's lifecycle also lists an amendment under preparation; it is not a published amendment. The catalog reports a 2027 stability date, which is not an expiry date. [S1, S2]

This is an IEC publication check, not verification of an EN adoption, a manufacturer's cited edition, or OJEU/legal status. Those are separate questions. The historical batch's 2021/edition-5 lead is consistent with the publisher; its simplified claims about keyed use are not a substitute for the actual interface tables. [S1, L1]

## Purpose, users and scope

The part addresses **dimensional compatibility** of industrial power accessories with pin and contact-tube interfaces: a shared interface specification helps compatible plugs and receptacles engage as intended, rather than relying on superficial resemblance. It is principally useful to accessory manufacturers, specifiers, machine and panel designers, installation planners and purchasers selecting an appropriate mating interface. Part 2 is **not** an independent declaration that a product is certified or suitable for an installation. [S1]

IEC's abstract applies the part to **plugs, fixed or portable socket-outlets, and appliance inlets**, primarily intended for industrial use indoors or outdoors, rated at no more than **1,000 V DC or 1,000 V AC**, AC frequency at most **500 Hz**, and rated current at most **125 A**. These are scope limits, not universal values available for every product or configuration. The abstract directs readers to use it with **IEC 60309-1:2021**. [S1]

Part 1's public scope extends to 800 A, whereas this part's abstract stops at 125 A: do not automatically infer a Part 2 dimensional pattern for every Part 1 accessory or an above-125-A item. [S1, S3] Household plugs, generic industrial signal connectors and EV-specific interfaces are not established as included merely by being electrical connectors; actual interface and applicable product scope must be checked. The abstract does not give a complete list of explicit exclusions, special applications or every accessory variant: those remain full-text questions, not proven exclusions.

## Technical subject and limits of this investigation

The title identifies the main technical subject: dimensions and compatibility of the contact/pin interface. The publisher's description of the 2021 revision also identifies requirements and a test for **non-solid pins**, an added **IPX9 rating**, and additional marking identifying neutral and/or earthing terminals. These changes show Part 2 is not simply a picture of pin positions; they do not disclose complete test procedures, product classifications or detailed obligations. [S1]

For an engineering assessment consult the actual edition's interface drawings, configurations, tolerances, applicable conditions and corresponding Part 1 product requirements. Keying and positions are relevant interface-selection questions, but the consulted abstract does **not** establish a universal clock-code mapping or the historical batch's absolute assertion that an incompatible voltage connection is mechanically impossible. Physical mismatch can reduce wrong mating for specified standardized configurations, but verify both exact counterparts and their published characteristics; adapters, damage, nonconforming products and installation errors are not ruled out by a standard reference. [S1, L1; interpretation]

The addition of IPX9 does not mean every accessory is IPX9 or that the same IP applies uncoupled, mated, with cover open, or after a particular mounting. Consult the exact manufacturer's declaration, mating combination and mounting conditions. Similarly neither matching shape nor Part 2 reference alone proves protection against electric shock, suitable short-circuit protection, the correct protective-earth continuity in the installed circuit, operational switching duty or safe disconnection under load. These are application and product-evidence questions, not inferences from the dimensional title. [S1, S3; engineering interpretation]

## Electrical and functional-safety use

For a machine service outlet or removable supply interface, identify the exact plug/socket or inlet/coupler pair and collect the manufacturer's declared standard and edition; rated voltage and current, AC/DC and frequency; number and function of poles, neutral and protective earth where provided; orientation/keying and compatible mating designation; cable/terminal and mounting constraints; and IP conditions in the actual mated and unmated states. Check supply characteristics, protective device coordination, environment, strain relief and installation/maintenance instructions separately. A catalog colour or shape is not adequate evidence for any of these properties.

A pluggable interface may serve a power distribution or maintenance role, but **do not assume load-breaking capability or isolation merely from IEC 60309-2**. Determine exact manufacturer-permitted connection and disconnection conditions and whether a separate switching/interlocking arrangement is required for the application. IEC 60309-4 addresses a distinct product subtype: its abstract describes a socket-outlet and switching device combined in one enclosure, and says it is used with Parts 1 and 2. A generic Part 2 plug/socket is not automatically a Part 4 switched assembly. [S4]

**Conditional ISO 13849 relevance:** a connector can be part of wiring or power in a safety-related architecture, so its connection integrity, foreseeable disconnection/misconnection and environmental conditions may matter in that machine's evaluation. Part 2 is not itself a safety-function specification and does not assign PL, SIL, Category, diagnostic coverage or a fault-exclusion claim. A connector is not a certified safety subsystem merely by having this product-standard marking. Validate the complete safety function using the applicable safety framework and actual manufacturer evidence; do not infer machine safety performance from interface conformity. [S1; application interpretation]

## Related standards, distinct roles

- **IEC 60309-1:2021:** companion general product requirements for industrial plugs, socket-outlets and inlets; publisher explicitly requires it in conjunction with Part 2. Its larger stated current scope does not expand Part 2. [S1, S3]
- **IEC 60309-4:2021:** particular combined switched socket-outlet product, not a generic mating or load-breaking guarantee. [S4]
- **IEC 60529:** route for checking declared degrees of enclosure protection, including conditions of the specific product; a Part 2 reference does not provide the individual IP claim. The exact applicability and version were not independently audited here.
- **IEC 60204-1 and ISO 13849**, where relevant to the particular machine, address machine electrical equipment and safety-related controls respectively; neither is replaced by this connector interface standard. This is a scope-routing suggestion, not a verified requirement for every connector.

## Library implications and actual holdings

The natural route is `connector_industrial`, specifically industrial mains plugs, portable/fixed socket-outlets and appliance inlets with the identified interface—not all connectors in that category. Retain exact model, manufacturer documents and externally declared ratings and use limits; distinguish a supplier's declaration from certificate or tested assembly evidence. The bought device remains a black box: internal design disclosure is not a prerequisite to intake. No product approval, schema change or safety data entry follows from this report. [L2]

The supplied `NORMATIVE_CANDIDATES.json` lists no matching PDF, extracted markdown or memory candidate. A filename search throughout the actual `NORMATIVE` tree found no matching standard file; one image filename happened to contain the digits and is not a document. Thus **no matching held full text was found**, rather than proof none exists under an unrelated filename. Historical batch L1 is research reference only, not an edition holding. No local Part 2 dimensional table, exclusion or full-clause inspection is claimed.

**Recommendation: conditional acquisition**, not a blanket purchase. Obtain the applicable edition and corrigendum, together with Part 1 as needed, if the project must independently evaluate a particular interface, manufacture an accessory, resolve a disputed rating or inspect specific clauses. For ordinary bought-device intake, first request exact manufacturer datasheets, installation instructions and declarations/certificates, including actual mating and IP/load-operation conditions. Supplier-cited older editions must be retained accurately and considered separately from publisher status.

## Sources and unresolved questions

- **S1:** [IEC 60309-2:2021 official product page](https://webstore.iec.ch/en/publication/59919), scope, changes and publication details. Public abstract only.
- **S2:** [IEC public search API](https://webstore-search-api.iec.ch/api/search), POST search for `60309-2`, captured as `evidence/iec_api.json`: lifecycle, status and corrigendum. `evidence/iec_preview.pdf` is the actual 403 HTML response to the official preview link, not a PDF.
- **S3:** [IEC 60309-1:2021](https://webstore.iec.ch/en/publication/59916), publisher scope and history.
- **S4:** [IEC 60309-4:2021](https://webstore.iec.ch/en/publication/59920), publisher scope and companion relationship.
- **L1:** `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md`, historical lead, IEC 60309-1/-2 section.
- **L2:** same research directory `README.md`, category and supplier-evidence guidance; `/media/eldar/disk_2/Machine_concept/CLAUDE.md`, purchased-component boundary.

Exact configuration tables, full scope exclusions, Part 1/2 clause interactions, test details, and the detailed effect of the 2026 corrigendum were not accessible. No individual product, mating pair, manufacturer declaration or regulatory listing was examined. Therefore this report supports scoped research and evidence requests only, not certification or an installation design decision.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `1a19becfad09ee7776425bdf0709d22dd125dd38495be38247787d6ddd27c040`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60309-2`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60309-2",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": ["Full text and specific dimensional tables were not inspected; official public preview returned 403.", "Complete exclusions, detailed test requirements and exact effect of 2026 corrigendum remain unverified.", "No manufacturer-specific product or mating pair, EN adoption or legal listing was assessed."],
  "local_holdings_summary": "No matching PDF, extracted text or memory candidate supplied; NORMATIVE filename search found no matching standard document. Historical batch is research only."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "checked_utc": "2026-11-02T23:04:54Z",
  "sources": [
    {"id":"S1","url":"https://webstore.iec.ch/en/publication/59919","title":"IEC 60309-2:2021 edition 5.0, corrected 2026-08","access_time":"2026-11-02T23:04:54Z","evidence_path":"evidence/iec_60309-2.html","kind":"public scope","limitation":"Publisher abstract and metadata only; not full clauses."},
    {"id":"S2","url":"https://webstore-search-api.iec.ch/api/search","title":"IEC public search results for 60309-2","access_time":"2026-11-02T23:04:54Z","evidence_path":"evidence/iec_api.json","kind":"publisher lifecycle metadata","limitation":"POST query; metadata, not normative text."},
    {"id":"S3","url":"https://webstore.iec.ch/en/publication/59916","title":"IEC 60309-1:2021 edition 5.0","access_time":"2026-11-02T23:04:54Z","evidence_path":"evidence/iec_60309-1.html","kind":"public scope","limitation":"Abstract only."},
    {"id":"S4","url":"https://webstore.iec.ch/en/publication/59920","title":"IEC 60309-4:2021 edition 2.0","access_time":"2026-11-02T23:04:54Z","evidence_path":"evidence/iec_60309-4.html","kind":"public scope","limitation":"Abstract only."},
    {"id":"P","url":"https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMzA5LTJ7ZWQ1LjB9Yi5wZGY=","title":"IEC 60309-2:2021 official preview request","access_time":"2026-11-02T23:04:54Z","evidence_path":"evidence/iec_preview.pdf","kind":"failed preview","limitation":"403 HTML response; not a PDF and no preview inspected."},
    {"id":"L1","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md","title":"Historical batch 7","access_time":"2026-11-02T23:04:54Z","evidence_path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md","kind":"old research lead","limitation":"Not a normative standard or primary source."},
    {"id":"L2","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md","title":"Scope research guidance","access_time":"2026-11-02T23:04:54Z","evidence_path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md","kind":"local guidance","limitation":"Not product conformity evidence."}
  ]
}
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[S1]: <https://webstore.iec.ch/en/publication/59919>
[S2]: <https://webstore-search-api.iec.ch/api/search>
[S3]: <https://webstore.iec.ch/en/publication/59916>
[S4]: <https://webstore.iec.ch/en/publication/59920>
[P]: <https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMzA5LTJ7ZWQ1LjB9Yi5wZGY=>
