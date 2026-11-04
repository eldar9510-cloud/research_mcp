---
{
  "format": 1,
  "metadata": {
    "id": "iec-61347-2-13-detailed-research-2026-11-02",
    "title": "IEC 61347-2-13 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 61347-2-13?",
    "scope": "Detailed IEC 61347-2-13 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:30.282Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "85cc5d18445b6194cd89066476ad7b5657d1d8632037729a82359a46580fe99c",
  "proposalRevision": "531ac6e24a9fd4d51c09adca22d8fa82be283aeb670667cfa961c6ebdc9df605"
}
---
# IEC 61347-2-13 — safety of electronic LED controlgear

**Publication check: 2026-11-02 UTC. Evidence level:** IEC catalogue abstracts and local research lead, not full normative clauses. This is a research aid, not a component approval, installation design or legal determination.

## Identity and publication structure

[IEC 61347-2-13:2024](https://webstore.iec.ch/en/publication/64713) is the International Standard **“Controlgear for electric light sources – Safety – Part 2-13: Particular requirements – Electronic controlgear for LED light sources.”** IEC identifies it as edition 3.0, published 14 June 2024, and reports that it cancels and replaces edition 2 (2014) and its 2016 amendment. This is a technical revision. The catalogue lists a 2027 stability date, which is not a guaranteed expiration date. The inspected page identifies the 2024 base publication; its dynamically rendered lifecycle/history was not independently resolved, so do not assume all later amendments or regional status are exhaustively checked.

The particular part aligns with and references **IEC 61347-1:2024, edition 4**, the general safety requirements for light-source controlgear. IEC reports that the 2024 revision deletes material now in Part 1 or no longer relevant, and introduces dated references to Part 1 where appropriate [IEC part page](https://webstore.iec.ch/en/publication/64713); [Part 1 page](https://webstore.iec.ch/en/publication/64758). Therefore a Part 2-13-only reading is not a complete examination of this edition's requirements. The newer title says **LED light sources**, not just LED modules: avoid silently transferring the earlier title and structure to the 2024 revision. The general part is not itself the luminaire standard. Exact application of both documents and any alternative requirements needs the licensed texts.

The IEC publication is not the same record as an EN adoption or a supplier declaration. The historical local batch claims EN IEC 61347-2-13:2024 and a SIST adoption, but their official records were not inspected here; neither EU OJEU listing nor transitional status was established. Record the actual product's stated edition separately.

## Purpose and scope

An LED driver/controlgear conditions electrical energy for an LED light source. This standard addresses safety requirements for the electronic controlgear, so it is relevant to its manufacturer, product assessor, lighting-system integrator and engineer selecting a suitable purchased driver. It does not, by its title or scope, certify the complete lamp, light source, luminaire, machine, or installation [IEC part page](https://webstore.iec.ch/en/publication/64713).

The publisher's 2024 scope covers electronic controlgear for LED light sources supplied by DC up to **1,500 V**, or AC up to **1,000 V at 50 or 60 Hz**, and with output RMS voltage no higher than **1,000 V**. These are **scope boundaries**, not permissible working limits for a particular purchased product. The increase in the DC supply scope is a documented edition change, not evidence that a 2014-certified driver is rated to that level. The abstract does not establish a complete list of exclusions, emergency classifications or all subtypes; consult the actual edition and Part 1 for precise applicability. A constant-current or constant-voltage driver is an interface to the source; the module is the emitting assembly, and the luminaire is the complete lighting fitting. Their separate product roles should not be conflated [IEC part page](https://webstore.iec.ch/en/publication/64713); [IEC 62384:2020](https://webstore.iec.ch/en/publication/27275).

## Technical subject areas and practical use

The IEC abstract identifies revised information and marking, a new marking identifying electronic controlgear for LED light sources, additional requirements associated with constant-light-output or programmable-current functions, and revised determination of output working voltage and rated output characteristics. Those are demonstrable subjects of this revision, not an exhaustive clause-by-clause test summary [IEC part page](https://webstore.iec.ch/en/publication/64713).

The companion general standard's publisher description identifies subjects including control-circuit insulation, electric strength, thermal testing, moisture, fire-hazard testing, clearances, touch current, PELV applications, and safety-isolating controlgear. It also mentions a new type of protected emergency-lighting controlgear and the test sequence for independent gear relative to the IEC 60598 series [IEC 61347-1:2024](https://webstore.iec.ch/en/publication/64758). These headings indicate questions addressed by the general product standard; they do **not** establish a specific protection method, test result or numerical limit for a given driver. The actual test prescriptions and exceptions were not read.

For a purchased device, retain the published external contract, rather than requiring disclosure of proprietary circuitry:

- identify the exact gear, whether built into or independent of the fixture, and the manufacturer's declared applicable product standard and edition;
- check actual supply AC/DC type, operating range and frequency, wiring, earth/isolation arrangements and protection prescribed by the manufacturer;
- match the driver's output mode, rated current or voltage, output voltage range and load to the LED module's allowed interface. Check the conditions for programmed current or dimming, where applicable;
- check installation position, enclosure, thermal conditions, permitted ambient and any independently declared environmental protection; do not infer them from the standard number;
- if emergency operation is required, check the exact driver, battery/supply compatibility, changeover arrangements, duration and complete installation against applicable emergency and machine requirements. A DC input within the standard's scope alone does not prove battery-backed emergency suitability.

These are engineering evidence questions, not claims that each is explicitly prescribed in the publisher's abstract. Part 2-13 safety compliance does not alone establish flicker, EMC, power quality, light output, lifetime, emergency illuminance or installation conformity.

## Related documents and boundaries

- **IEC 61347-1:2024:** general controlgear safety, used with the 2024 particular part, as explained above. Its inclusion of emergency-related provisions is not equivalent to certifying a complete emergency-lighting installation.
- **IEC 62384:2020:** separate performance requirements for electronic LED-module controlgear; IEC describes constant voltage/current types and notes association with LED modules according to IEC 62031. Its stated DC scope differs from the 2024 Part 2-13 scope, so do not assume identical applicability [IEC 62384](https://webstore.iec.ch/en/publication/27275).
- **IEC 62031:** LED-module standard referenced by the IEC 62384 scope, not the driver safety part; exact edition and module scope were not separately checked.
- **IEC 60598 series:** luminaire rather than driver scope; Part 1's abstract references the series when discussing independent-controlgear test sequence. Fixture assessment remains distinct from component assessment [IEC 61347-1](https://webstore.iec.ch/en/publication/64758).

Functional safety under ISO 13849 is generally **not the purpose** of this lighting-controlgear safety standard. Ordinary illumination is not automatically a safety-related control subsystem. If a particular lighting function participates in a risk-reduction measure, establish the function, architecture and application-specific evidence separately. A driver safety declaration does not establish PL, SIL, Category, diagnostic coverage or the achieved integrity of a machine safety function. Nothing here authorizes treating an ordinary driver as a certified safety subsystem.

## Library use, holdings and limitations

The relevant local routing category is `lighting`; distinguish a complete luminaire, separate driver and LED module, and emergency versus normal operation. Product standard references are evidence prompts, not automatic category assignments. Ask for exact article, manufacturer declaration, cited edition, electrical and thermal interface, prescribed external protection and fixture compatibility. The prior [batch 8](file:///media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md) associates drivers with this standard, but its fire-droplet and universal 24 V/battery claims are not established by the IEC abstracts; do not promote them as generic requirements. Local research guidance explicitly distinguishes driver from luminaire and product approval from system verification.

`NORMATIVE_CANDIDATES.json` reports no matching PDF, extracted Markdown or memory candidates. A filename search within `NORMATIVE/` for `*61347*` also returned no matches. Thus **no matching held full text found**, not proof of absence under every possible filename or elsewhere. The batch is a historical research reference, not a held standard. No held edition, EN adoption or supplier-cited edition was verified.

**Recommendation:** conditional acquisition of the relevant edition of both Part 1 and Part 2-13 if the project must independently evaluate driver design, a disputed clause or test; lower priority for routine purchase of an already documented luminaire/driver, where exact manufacturer declarations and installation evidence should be sought first. This is not a recommendation to purchase automatically. Obtain separate module, luminaire, performance or emergency texts only when the actual question requires them.

**Limitations:** Public catalogue abstracts alone were inspected; the IEC preview request returned HTML instead of a usable PDF, and no full clauses were checked. Exact exclusions, applicable test sequences, requirements for particular emergency or integrated gear, later amendments and official EN/OJEU status remain open. Saved pages and access details are in `SOURCES.json` and `evidence/`.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `46178d6cfca7690744426751362dfefa92b2b99011722319d77d2cbf0c8225b3`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-61347-2-13`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 61347-2-13",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full standard and usable preview not available; detailed exclusions and requirements unverified",
    "Later amendments and EN/OJEU status not established"
  ],
  "local_holdings_summary": "No matching 61347 filename or candidate full text found in NORMATIVE; historical research lead only."
}
`````

### Author source ledger (verbatim JSON)

`````json
[
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/64713",
    "title": "IEC 61347-2-13:2024 ed 3",
    "access_time_utc": "2026-11-02T23:05:13Z",
    "evidence_path": "evidence/iec-64713.html",
    "evidence_kind": "public scope",
    "limitation": "Catalogue abstract, not full text; lifecycle dynamic"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/64758",
    "title": "IEC 61347-1:2024 ed 4",
    "access_time_utc": "2026-11-02T23:05:13Z",
    "evidence_path": "evidence/iec-general.html",
    "evidence_kind": "public scope",
    "limitation": "General-part abstract only"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/publication/27275",
    "title": "IEC 62384:2020 ed 2",
    "access_time_utc": "2026-11-02T23:05:13Z",
    "evidence_path": "evidence/iec-performance.html",
    "evidence_kind": "public scope",
    "limitation": "Performance abstract only"
  },
  {
    "source_url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYxMzQ3LTItMTN7ZWQzLjB9Yi5wZGY=",
    "title": "IEC 61347-2-13 preview request",
    "access_time_utc": "2026-11-02T23:05:13Z",
    "evidence_path": "evidence/iec-preview.pdf",
    "evidence_kind": "failed preview",
    "limitation": "HTML returned, not usable PDF"
  },
  {
    "source_url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "title": "Batch 8 prior research",
    "access_time_utc": "2026-11-02T23:05:13Z",
    "evidence_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
    "evidence_kind": "old research lead",
    "limitation": "Secondary historical claims; not full standard"
  },
  {
    "source_url_or_path": "NORMATIVE_CANDIDATES.json",
    "title": "Local candidate list",
    "access_time_utc": "2026-11-02T23:05:13Z",
    "evidence_path": "NORMATIVE_CANDIDATES.json",
    "evidence_kind": "local inventory",
    "limitation": "No matching candidates; filename search also performed"
  }
]
`````
