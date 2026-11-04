---
{
  "format": 1,
  "metadata": {
    "id": "iec-60309-1-detailed-research-2026-11-02",
    "title": "IEC 60309-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60309-1?",
    "scope": "Detailed IEC 60309-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:28.694Z"
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
  "sourceDigest": "ac598063f2ec231495e82856238c94f9014fa6f6fc8cd0c55b07fcd95fcf4d52",
  "proposalRevision": "e93e6232ff395607df6babde02321175ac20b1518137d7a8ddee7ccf949fad13"
}
---
# IEC 60309-1 — industrial power accessories: general requirements

**Research check:** 2026-11-02 UTC. **Evidence level:** IEC publisher scope and catalogue records, not the full standard; the publisher preview request was blocked. This is an engineering routing report, not a conformity, installation or safety-function assessment.

## Identity and publication

IEC 60309-1:2021, *Plugs, fixed or portable socket-outlets and appliance inlets for industrial purposes — Part 1: General requirements*, is an International Standard, edition 5.0, published 2021-06-18 by IEC TC 23/SC 23H [1]. IEC's published lifecycle identifies this edition as published and lists a May 2023 corrigendum; the publisher says the contents of that corrigendum are included in its current copy [1, 2]. It replaces the 1999 fourth edition and its 2005 and 2012 amendments. IEC identifies technical changes including shutters, marking for neutral and/or protective-earth terminals, and replacing the term “connector” with “portable socket-outlet” [1]. A 2027 stability date shown by the publisher is not an expiry date or a promise that an edition remains legally applicable until then.

This confirms the archived batch's 2021 fifth-edition lead for Part 1, but not its broader safety assertions [7]. A supplier may legitimately cite a different edition in its declaration; record that edition as supplied rather than silently upgrading it. Neither the IEC catalogue nor this investigation establishes the applicable national adoption, OJEU listing, legal transition dates or conformity of any individual article.

## Purpose and scope

The document is a product-standard starting point for robust separable industrial power connections: it addresses common requirements for the accessories themselves. Relevant readers include accessory manufacturers and test bodies, as well as panel and machine designers selecting and documenting purchased accessories. It helps distinguish a plug, fixed socket-outlet, portable socket-outlet and appliance inlet by actual role, rather than treating all mating components as generic terminal connectors.

The IEC 2021 abstract [1] states that the standard applies to those accessories primarily intended for industrial use, indoors or outdoors, with rated operating voltage at most **1,000 V DC or 1,000 V AC**, AC frequency at most **500 Hz**, and rated current at most **800 A**. These are *scope ceilings*, not ratings of every product and not permission to operate at all combinations of voltage, frequency and current. The abstract does not disclose the complete list of exclusions, environmental assumptions or detailed classification; these remain open pending the licensed text. Industrial use in an ordinary environment does not alone establish suitability for explosive atmospheres, submersion or any special duty.

Part 1 is not a universal rule for all circular signal, data or control connectors. Nor is a familiar industrial shape or blue/red colour evidence that a particular accessory meets this standard. Establish the exact subtype and manufacturer's declaration first.

## General requirements versus companion parts

* **Part 1:** common product requirements and tests for the scoped accessories [1]. General requirements alone do not identify a complete standardized mating interface.
* **IEC 60309-2:2021:** dimensional compatibility for pin-and-contact-tube accessories; IEC says it is read with Part 1:2021. Its abstract has the same voltage/frequency scope ceilings but a **125 A** current ceiling, not Part 1's 800 A ceiling [3]. Therefore do not assume Part 2 dimensional interchangeability for every Part 1 accessory, particularly above the Part 2 scope. IEC's Part 2 catalogue identifies an August 2026 corrigendum included in its copy [3].
* **IEC 60309-4:2021:** self-contained switched fixed or portable socket-outlets, with or without interlock, combining an outlet and switching device in one enclosure; IEC directs use with Parts 1 and 2 [4]. A separately assembled switch and socket is not automatically the same product. An interlock is a specific declared product feature, not something inferred from an outlet's shape.
* **IEC 60309-5:2017:** specialized dimensional compatibility/interchangeability for a single shore-to-ship connector type; the abstract specifies three-phase, earth and pilot contacts and points to IEC/IEEE 80005-3 shore systems. Its publisher record explicitly says read with IEC 60309-1:2012 [5]. Do not silently substitute Part 1:2021 in that dated statement or apply this marine-specific part to ordinary machine-room outlets.
* **IEC 60529** is a separate ingress-protection classification reference; the IP code actually declared for a device and configuration remains product-specific. **IEC 60204-1** is a machine electrical-equipment application context, not a substitute for the accessory product standard. IEC's Part 1 catalogue lists IEC 60204-1:2016 as referencing it [2]; this relationship alone is not proof of an installation's compliance.

The archived note described clock-position keying and claimed incompatible voltage products are mechanically impossible to connect [7]. Part 2 is the proper dimensional-compatibility route, but neither the inspected Part 1 nor Part 2 abstracts establish that categorical claim for every product, adapter, wiring condition or fault. Verify the exact interface and configuration against Part 2 and supplier documentation; mechanical coding never verifies the voltage actually present at a wired outlet.

## Technical subjects and limits of this research

The title identifies general requirements and the publisher specifically confirms classification, requirements and tests for shuttered accessories, plus neutral and earthing-terminal marking [1]. For an engineer, the document is a route to investigate how a product's construction and performance are verified; likely practical questions concern protective contact and terminal identification, accessible live parts, insulation, mechanical durability, ingress protection, heating and connection/retention. **These are selection and investigation topics, not a claim that particular clauses, test methods, thresholds or pass criteria were inspected.** The publicly available abstract is too brief to enumerate the full clause structure or describe precise tests. A request for IEC's public preview returned HTTP 403 [6]; no attempt was made to bypass it. The detailed normative test regime, exclusions and exact marking rules must be checked in an authorized copy before reliance.

In particular, product testing and declarations are distinct from installation selection and system verification. A device can be tested to its stated rating yet be unsuitable for the load, conductor, environment, protection coordination or its particular wiring. Part 1 does not size upstream protection or establish the safety of an entire machine simply by being cited.

## Practical selection, installation and safety questions

For a concrete bought plug/socket or inlet, retain the exact article and supplier document revision, then check:

1. **Electrical service:** rated AC/DC voltage, frequency, current, number and function of contacts, neutral and protective-earth arrangements, and load duty. Compare each with the actual supply and connected equipment; the standard's maximum scope is not the device's rating.
2. **Mating:** applicable Part 2 dimensional family, current and voltage/frequency configuration, orientation/keying, mating partner and any approved adapter. Check markings and wiring rather than assuming colour or physical fit proves correct voltage or protective-earth continuity. Identify the manufacturer's permitted mate and any condition on mated versus unmated protection.
3. **Connection and cable:** permitted conductor sizes and type, termination method and tightening/assembly instructions, cable outside diameter, strain relief and required glands or seals. Keep manufacturer-prescribed external connection instructions; internal mechanical drawings are not an intake prerequisite for a purchased black box.
4. **Service environment:** product-specific IP rating and conditions, moisture and contamination, temperature, mechanical exposure, corrosion, outdoor use and cable movement. IP classification is not a claim of universal weatherproofness in every mating and installation state.
5. **Protection and operation:** external overcurrent and fault protection, earthing and installation coordination, safe connection/disconnection under intended load, and whether isolation, switching or an interlock is actually declared and suitable for the application. Do not assume every plug is a load-break switch or provides the machine's required isolating function. The site and machine designer evaluates these matters against applicable installation and machine standards and supplier instructions.

These are engineering questions, not claimed Part 1 clause requirements. Any protective device, residual-current protection, switching provision or maintenance isolation must be selected under the applicable installation and machine context, not assigned blindly from the connector family.

## Functional-safety boundary

An ordinary industrial power connector is a physical supply interface, not by itself a certified safety-related subsystem. Correct contact identity and protective-earth continuity can be important to safe installation, and an unplugged connection may feature in an application's maintenance or energy-isolation concept, but Part 1 compliance alone establishes neither a safety function nor a PL, SIL, diagnostic coverage or ISO 13849 architecture. It does not by itself validate an emergency stop, restart prevention, safe stopping, lockout or fault reaction. If a connector forms part of a safety-related circuit, examine its actual use, manufacturer data and the complete function's design and validation; do not invent reliability data or fault exclusions from this product standard. A Part 4 mechanical/electrical interlock is likewise not automatically an ISO 13849 guard interlock or a safety-rated subsystem [4].

## Electrical-library implications and actual holdings

For `connector_industrial`, route only mains/industrial power accessory subtypes to this family; a signal connector or generic sensor connector needs its own evidence. Preserve device identity, supplier-declared standards **and editions**, mating/coding data, rated electrical service, terminal/cable constraints, IP condition and any external switching/protection instruction. A switched/interlocked outlet needs Part 4 applicability assessed; a shore-connection type needs the separate Part 5 route. This is an evidence checklist, not a new schema field, approval rule or conformance verdict. Service outlets can also be documented in an assembly context, but category membership is not proof of this standard's applicability [7].

`NORMATIVE_CANDIDATES.json` reports no matching PDFs, extracted Markdown or memory files. A filename scan of the NORMATIVE tree found no standard-named 60309 file; the only incidental match was a hash within an unrelated ISO 13849 image filename. Thus **no matching full Part 1 text was found**, and no held edition can be identified or verified. The historical batch is research reference only, not a licensed holding [7]. This finding is bounded by the candidate list and filename scan; it is not a guarantee that no embedded reference occurs in another document.

**Recommendation:** conditional acquisition/addition, not automatic purchase: obtain the applicable authorized Part 1 edition and relevant companion part if there is a real design, conformity assessment or disputed test/clause question for industrial power accessories. For routine intake of a bought device, the exact supplier's published declaration, rating and instructions may answer the immediate selection question without adding every product standard to the library. Review Part 2 separately when interchangeability is material and Part 4 for its scoped switched assemblies. No NORMATIVE or library changes are proposed here.

## Sources and open questions

1. IEC, [IEC 60309-1:2021 catalogue](https://webstore.iec.ch/en/publication/59916), identity, scope and publication details; saved `evidence/iec-59916.html` and extracted visible text.
2. IEC, [public catalogue search API](https://webstore-search-api.iec.ch/api/search), query `60309-1`, retained `evidence/iec-api.json`; lifecycle/status and related references. Query interface recorded in `evidence/iec-results.html`.
3. IEC, [IEC 60309-2:2021](https://webstore.iec.ch/en/publication/59919), scope and relationship; retained `evidence/iec-59919.html`.
4. IEC, [IEC 60309-4:2021](https://webstore.iec.ch/en/publication/59920), scope and relationship; retained `evidence/iec-59920.html`.
5. IEC, [IEC 60309-5:2017](https://webstore.iec.ch/en/publication/26808), shore connection scope and edition-qualified relationship; retained `evidence/iec-26808.html`.
6. IEC, [public preview request](https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMzA5LTF7ZWQ1LjB9Yi5wZGY%3D), HTTP 403; retained `evidence/iec-preview.pdf` (actually HTML error response).
7. Local archived lead: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md`, §IEC 60309-1/-2, and its companion README and primary-source checks. These are historical guidance, not primary Part 1 text.

**Open:** full normative exclusions and exact test/acceptance provisions; any newer or national adoption beyond the checked IEC record; exact supplier edition, mate and conditions for any actual product. No manufacturer article or machine was specified. No national legal-status audit or full-clause inspection was performed.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `4c460231737d845601977d7ec66a020d794c7bb2fb0297ff11620eee3cb587a6`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60309-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60309-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full normative text and detailed exclusions and test requirements not inspected; IEC preview returned 403.",
    "No product-specific supplier evidence or national adoption/legal audit."
  ],
  "local_holdings_summary": "No matching full text, extracted text or memory candidate found; filename scan found only an unrelated image hash."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/59916",
    "title": "IEC 60309-1:2021 edition 5.0",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": "evidence/iec-59916.html",
    "evidence_kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/59919",
    "title": "IEC 60309-2:2021 edition 5.0",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": "evidence/iec-59919.html",
    "evidence_kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/59920",
    "title": "IEC 60309-4:2021 edition 2.0",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": "evidence/iec-59920.html",
    "evidence_kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/26808",
    "title": "IEC 60309-5:2017 edition 1.0",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": "evidence/iec-26808.html",
    "evidence_kind": "public scope",
    "limitation": "Publisher abstract and metadata only; not full standard."
  },
  {
    "url": "https://webstore-search-api.iec.ch/api/search",
    "title": "IEC catalogue search API: query 60309-1",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": "evidence/iec-api.json",
    "evidence_kind": "public catalogue metadata",
    "limitation": "POST request: mode FULL, query 60309-1, validOnly true; lifecycle metadata only."
  },
  {
    "url": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMzA5LTF7ZWQ1LjB9Yi5wZGY%3D",
    "title": "IEC 60309-1:2021 public preview",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": "evidence/iec-preview.pdf",
    "evidence_kind": "failed preview",
    "limitation": "HTTP 403; file is HTML error, not a PDF."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch07-terminals-connectors-gemini.md",
    "title": "Historical batch 07 terminals and connectors",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": null,
    "evidence_kind": "old research lead",
    "limitation": "Secondary research; no full text and claims require verification."
  },
  {
    "path": "NORMATIVE_CANDIDATES.json",
    "title": "IEC 60309-1 local candidates",
    "access_time_utc": "2026-11-02T23:05:53.270805+00:00",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "local holdings index",
    "limitation": "No candidate files; filename scan is not content-wide proof."
  }
]
`````
