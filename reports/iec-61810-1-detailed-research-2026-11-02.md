---
{
  "format": 1,
  "metadata": {
    "id": "iec-61810-1-detailed-research-2026-11-02",
    "title": "IEC 61810-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61810-1?",
    "scope": "Detailed IEC 61810-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:27.845Z"
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
  "sourceDigest": "e918f20bd172a77b78cd2878b7f8f7e51d0f742a29d914dd2d89271dd0629944",
  "proposalRevision": "f48229ef5036ba1addf0acf5546b36e76ab815fb7f409fc1f8cef2905990a5e9"
}
---
# IEC 61810-1 — electromechanical elementary relays

**Evidence checked 2 November 2026 UTC.** This is product-scope research, not a conformity assessment or a clause-by-clause review. The paid standard itself was not available locally or inspected; practical questions below are engineering prompts, not attributed normative requirements.

## Identity and publication

IEC 61810-1:2015, *Electromechanical elementary relays — Part 1: General and safety requirements*, is an International Standard of IEC TC 94. IEC identifies the 2015 base as edition 4.0, published 25 February 2015, replacing the third edition of 2008 as a technical revision [1]. Amendment 1 was published 25 November 2019 [2]. The IEC consolidated publication **IEC 61810-1:2015+AMD1:2019 CSV**, edition 4.1, incorporates that amendment; its catalog also says corrigenda 1 and 2 and Interpretation Sheet 1 (January 2023) are incorporated [3]. Thus 2023 is not a new base edition. IEC gives a 2027 stability date, which is not a promised withdrawal or revision date. The checked page lists no description of an under-development stage; the dynamic lifecycle history was not independently resolved, so this is a dated catalog observation, not a guarantee of no later edition or amendment. No EN adoption, OJEU listing or jurisdictional applicability was verified.

## What it covers and why it matters

IEC's scope identifies **electromechanical elementary relays**, specifically non-specified-time all-or-nothing relays, for incorporation into low-voltage equipment: circuits up to 1,000 V AC or 1,500 V DC [1, 3]. This voltage scope is not a contact rating for every relay. An input energizes or changes an electromechanical switching element; the device is an elementary component, not by itself the machine control system. Its practical purpose is a common product-level baseline for functional and safety characteristics, verified by the indicated type tests. Its intended readers include relay manufacturers and test bodies, and engineers selecting or integrating relays.

IEC names many areas, including industrial equipment, electrical machines, automation, household appliances, IT equipment, medical equipment and transport [1, 3]. Inclusion of an application area does **not** make this the only applicable standard: IEC explicitly calls for assessment against relevant application standards where the actual application adds requirements beyond Part 1 [3]. The catalog scope does not establish that every relay marketed for those sectors conforms, or that all accessories and assemblies are covered.

## Boundaries: identify the actual device

- **Ordinary elementary electromechanical relay:** Part 1 is a direct candidate if the specific product fits the scope. A plug-in relay and an assembled interface containing a socket or additional electronics are not automatically the same assessed product; check the manufacturer's exact declaration and assembly conditions.
- **Solid-state relay (SSR):** semiconductor switching without an electromechanical switching element is not within the publisher's defined electromechanical scope. Route by the exact SSR type and supplier's cited product standard rather than assigning Part 1 by the word “relay”. This is a scope inference, not an exhaustive mapping of hybrid products.
- **Measuring/protection relay:** a device whose main function measures and responds to a monitored quantity is not established to be an elementary non-specified-time all-or-nothing relay merely because it contains output contacts. Investigate the measuring/protection product's own standard and role. A separate elementary output relay may have its own product evidence. Exact related-series mapping was not independently established in this investigation.
- **Timing relay:** a specified time function needs subtype-specific assessment; the Part 1 scope is explicitly non-specified time. Avoid assuming that an assembled timer inherits the elementary-relay baseline merely from its output contact.
- **Forcibly guided contacts:** IEC 61810-3:2015 specifies special requirements and tests for elementary relays with forcibly guided, also called mechanically linked, contacts **in addition to** the general requirements of Part 1 [4]. It is a special property of the relay contacts, not proof that the entire external monitoring circuit works. Check exact contact sets and supplier evidence rather than assuming all contacts of any “safety relay” are guided.
- **Safety relay module:** a purchased assembly with safety inputs, internal processing/monitoring and outputs is not synonymous with its internal elementary relay. It may contain guided relays, but Part 1 or Part 3 on a component alone is not a certificate of the complete module or its safety function. Establish the module's actual declared product/functional-safety standards, exact configuration, safety manual and assessed boundary. No universal dedicated module-standard mapping is established by the inspected scope pages.

These distinctions route investigation; mixed-function or hybrid devices require their actual scope and declarations to be checked, not a categorical guess based on category names.

## Technical subjects and electrical use

The publicly visible IEC abstract establishes basic functional requirements, safety requirements and type-test verification. It specifically describes changes in the 2015 revision: two test procedures, A and B; certain application tests; testing under a single mounting condition; clarification of insulation after endurance testing; and basic safety provisions [1, 3]. The catalog does not disclose enough to reproduce the procedures, conditions, test sequences, tolerances or acceptance criteria. In particular, neither the 2015 change summary nor a general reference to endurance supplies a specific electrical lifetime for a selected load.

For a real circuit, collect the manufacturer's exact variant and datasheet/manual: coil supply type, voltage and operating conditions; number and arrangement of contacts; voltage/current and load-specific switching ratings; electrical and mechanical endurance for the stated use; insulation/isolation characteristics; socket and mounting compatibility; ambient and derating; and required protective or suppression components. Check inductive loads, inrush and DC switching against actual published ratings rather than treating a generic current value as universal. Check what external coil suppression does to the control interface and release behavior from the supplier's instructions. These are practical selection questions, not claims that the abstract prescribes a particular device or circuit.

A relay's component type test and a supplier's declared ratings are not a full installation assessment: the machine integrator still has to consider circuit protection, load characteristics, wiring, environmental limits and application-specific requirements. A purchased relay or module is normally treated as a black box: prescribed external connections and declared behavior are evidence; reconstructing proprietary circuits or mechanics is not a prerequisite for ordinary component intake.

## Conditional functional-safety relevance

A relay can form part of an ISO 13849 safety-related control function if selected and integrated for that actual function, but IEC 61810-1 is a component product baseline, not an automatic safety-function or machine certification. Part 3's mechanically linked contacts can support an implemented monitoring strategy; the mere existence of contact guidance does not establish diagnostic coverage, architecture category, PL, SIL or an assured reaction to a fault. Use actual safety data and permitted load/usage assumptions where available, evaluate diagnostics and fault behavior in context, and validate the complete function. A supplier-certified safety module's declared PL/SIL and conditions apply to its defined module and configuration, not automatically to a complete machine. No automatic PL/SIL conversion or invented failure data is justified.

The local source review independently identifies the relevant held ISO 13849-1:2023 sections on estimation of diagnostic coverage and combination validation, and ISO 13849-2:2012 material on linked contacts as a monitoring measure [5]. That targeted review is not a fresh examination of the full Part 1 relay standard or proof for any specific product. ISO 13849 becomes relevant when the relay participates in a safety-related control function; a conventional non-safety auxiliary relay does not acquire a safety rating merely from IEC 61810-1.

## Library implications and holdings

For `relay_general`, ask first whether it is a non-specified-time electromechanical elementary relay, SSR, timer or measuring device; preserve the actual supplier-cited standard and edition. For `safety_relay`, distinguish the purchased safety module from individual guided-contact relays, record exact module identity, safety-function claims and conditions, and separately note any declared IEC 61810-3 component property. Evidence questions include exact product and socket, test/declaration scope, load-specific ratings, coil and protection conditions, contact relationship, endurance data and any safety manual. Neither folder membership nor an IEC catalog entry proves conformity.

The supplied `NORMATIVE_CANDIDATES.json` lists **no PDF, extracted text or memory candidate**. A filename search under `/media/eldar/disk_2/Machine_concept/NORMATIVE` for `*61810*` also returned no match. Thus **no matching full text was found in that search**, not a proof that an oddly named or unindexed file cannot exist. The prior batch is a research lead, not a held normative copy or evidence of current legal status [6]. No edition equivalence or actual EN holding can be verified.

**Recommendation: conditional acquisition**, not automatic purchase for each relay. Obtain the exact applicable base/amended text and any necessary guided-contact part if a concrete manufacturer assessment, test interpretation, dispute or clause-level design task cannot be resolved from available declarations and authorized evidence. For ordinary component intake, first obtain the exact manufacturer datasheet, declarations, application conditions and, when applicable, safety manual. Keep supplier edition, IEC publication status and any separately checked regional/legal status distinct.

## Sources and limitations

1. IEC base publication, public catalog scope and edition: https://webstore.iec.ch/en/publication/21880
2. IEC amendment publication: https://webstore.iec.ch/en/publication/64641
3. IEC consolidated edition and public abstract: https://webstore.iec.ch/en/publication/66148
4. IEC 61810-3:2015 public scope: https://webstore.iec.ch/en/publication/21885
5. Local targeted held-text review, `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md`, first claim and source-path key; review refers to ISO 13849-1:2023 §§6.1.5, 6.2.1 and ISO 13849-2:2012 Table D.2.
6. Historical lead: `/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md`, IEC 61810-1 section; independently checked above, not relied upon for safety claims.

Public catalog pages are abstracts, not the normative full text. No complete requirements, normative reference list, legal harmonization determination, supplier-specific certification, or SSR/measuring-relay standard mapping was verified. See `SOURCES.json` and `evidence/` for saved public observations.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `40d83c61c7f84751a188247b74497efa04edd95c0bbf7e5b5bd364b46e401af2`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61810-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61810-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and clause-level requirements not inspected",
    "Later edition/lifecycle history not independently resolved",
    "No SSR/measuring relay product-standard mapping or EN/OJEU check"
  ],
  "local_holdings_summary": "No candidate files and no filename match under NORMATIVE; no matching full text found."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "url": "https://webstore.iec.ch/en/publication/21880",
    "title": "IEC 61810-1:2015 edition 4.0 base",
    "access_time_utc": "2026-11-02T23:03:20Z",
    "evidence_path": "evidence/iec-21880.html",
    "evidence_kind": "public scope and catalog",
    "coverage_limitation": "Catalog abstract only; no purchased full clauses; dynamic lifecycle not independently resolved."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/64641",
    "title": "IEC 61810-1:2015/AMD1:2019",
    "access_time_utc": "2026-11-02T23:03:20Z",
    "evidence_path": "evidence/iec-64641.html",
    "evidence_kind": "public scope and catalog",
    "coverage_limitation": "Catalog abstract only; no purchased full clauses; dynamic lifecycle not independently resolved."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/66148",
    "title": "IEC 61810-1:2015+AMD1:2019 CSV edition 4.1",
    "access_time_utc": "2026-11-02T23:03:20Z",
    "evidence_path": "evidence/iec-66148.html",
    "evidence_kind": "public scope and catalog",
    "coverage_limitation": "Catalog abstract only; no purchased full clauses; dynamic lifecycle not independently resolved."
  },
  {
    "url": "https://webstore.iec.ch/en/publication/21885",
    "title": "IEC 61810-3:2015 edition 1.0",
    "access_time_utc": "2026-11-02T23:03:20Z",
    "evidence_path": "evidence/iec-21885.html",
    "evidence_kind": "public scope and catalog",
    "coverage_limitation": "Catalog abstract only; no purchased full clauses; dynamic lifecycle not independently resolved."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/SAFETY_SOURCE_REVIEW.md",
    "title": "Local safety source review and held-edition references",
    "access_time_utc": "2026-11-02T23:03:20Z",
    "evidence_path": null,
    "evidence_kind": "local research reference",
    "coverage_limitation": "Not a full IEC 61810-1 text; historical claims independently checked where used."
  },
  {
    "path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch06-plc-relays-gemini.md",
    "title": "Historical relay research lead",
    "access_time_utc": "2026-11-02T23:03:20Z",
    "evidence_path": null,
    "evidence_kind": "local research reference",
    "coverage_limitation": "Not a full IEC 61810-1 text; historical claims independently checked where used."
  }
]
`````
