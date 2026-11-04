---
{
  "format": 1,
  "metadata": {
    "id": "iec-60947-4-1-detailed-research-2026-11-02",
    "title": "IEC 60947-4-1 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60947-4-1?",
    "scope": "Detailed IEC 60947-4-1 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
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
    "imported_at": "2026-11-02T23:50:26.402Z"
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
  "sourceDigest": "f453c9ef89e6bb4ecae77c420e79df40fca27d41e517c6acf90c7f97716ae08b",
  "proposalRevision": "f5727a7ee5aa818bc80ed7a6ace8a9b664ab16a8ef67a93153fe14bf5764b210"
}
---
# IEC 60947-4-1 — electromechanical contactors and motor-starters

**Research check:** 2026-11-02 UTC. **Finding:** detailed public-scope and application research, not a full-clause review, certification, legal opinion or component approval. The exact IEC full text was not found in the local holdings and the official preview request returned HTTP 403. All technical design and edition-sensitive questions remain subject to the applicable standard and the exact manufacturer's documentation.

## Identity and publication

IEC 60947-4-1:2023, *Low-voltage switchgear and controlgear — Part 4-1: Contactors and motor-starters — Electromechanical contactors and motor-starters*, is an International Standard, edition 5.0, published 8 November 2023. The IEC catalogue states that it replaces the technically revised fourth edition (2018); its record lists a corrected version of March 2026 incorporating corrigendum 1. The lifecycle data identifies COR1:2026, published 16 March 2026; edition 4.0 and the older 2009/2012 edition are marked revised. IEC lists stability date 2027; this is not a promised revision date or a legal transition date. The checked record supports 2023 as the published edition shown, not a claim about all future work. [S1]

A supplier's older declaration can still be meaningful for the exact product and context; retain its edition and amendments verbatim instead of silently rewriting it as 2023. No specific manufacturer's declaration, EN adoption, OJEU reference, withdrawal or jurisdictional applicability was checked. IEC publication status and EU harmonization are separate questions.

## Purpose, scope and boundaries

This product standard helps a manufacturer characterize and verify electromechanical switching and motor-starting equipment, and helps a panel designer interpret a supplier's declared ratings and conditions. A contactor switches a load electrically; a motor-starter adds a starting/protection arrangement depending on its actual construction. Neither term alone says which protective functions or isolation capabilities a purchased device provides.

The IEC public abstract explicitly covers electromechanical contactors and starters including motor protective switching devices (MPSD and IMPSD), contactor-relay actuators, contacts dedicated exclusively to the coil circuit of a contactor or contactor relay, and dedicated accessories such as dedicated wiring or latching accessories. These are intended for distribution, motor and other load circuits with rated voltage not exceeding **1,000 V AC or 1,500 V DC**. The abstract is the basis of this scope statement; it does not establish that every imaginable switching product, contact, accessory or installation falls within this part. [S1]

The inclusion of DC-rated circuits is not a declaration that any particular product can interrupt the intended DC load. Likewise an electromechanical contactor cannot be presumed to be a circuit-breaker, a disconnecting device, or an overload relay; ask for the actual product functions and ratings. Solid-state switching, control-circuit devices and drive-integrated safety functions need their own subtype-specific routes. Full exclusion wording and complete interface with other IEC 60947 parts were unavailable in this check.

## Technical coverage and practical selection

The public IEC description of the 2023 technical revision identifies kinds of equipment and methods of motor overload protection; AC-7d and AC-3e utilization-category changes; separately mounted starter overload relays; contactors and starters used downstream of a basic drive module; coordination with a short-circuit protective device; moving wiring, transient limiting, accessible-part temperatures, EMC environments, software and cybersecurity aspects; and photovoltaic critical-load-current determination. These are **published change topics**, not a substitute for the detailed requirements or proof that every topic applies to every device. [S1]

For an actual motor or other load, request the manufacturer's exact ordering code, standard and edition, rated operational voltage/current and applicable utilization category, load type, duty and switching frequency. Verify supply, pole arrangement, coil voltage and allowable variation, control circuit and auxiliary-contact ratings, environmental/thermal derating, mounting, terminals, conductor sizes, and any minimum or maximum switching load. A nameplate current by itself does not establish making/breaking performance on a motor, resistive heater, brake or DC inductive load; select the specific declared duty, not merely a category label.

Protection is a system interface: establish whether overload protection is integral or separately supplied, match it to the motor and application, and obtain the manufacturer's permitted short-circuit protective device and combination/coordination data for the prospective fault level. Do not assume a contactor clears short circuits or that one starter's coordination data transfers to another breaker or fuse. Where installed downstream of a drive, establish suitability for that arrangement, switching circumstances and compatibility with the drive manufacturer's instructions; inclusion of a revision topic does not authorize arbitrary switching at an inverter output. For coil suppression, check the permitted external suppressor and effects on release time and control output; for accessory contacts, verify the exact accessory compatibility and the published contact relationship. [S1; S3 Table D.1 for examples of installation and suppression considerations]

IEC 60947-4-1 is a **product** standard: it does not itself select the user's protective devices, validate a cabinet, define the complete machine stop sequence, or approve an installed safety function. Obtain the actual manufacturer manual, data sheet, combination tables and certificate/declaration as separate evidence. Bought equipment is an external black box: published limits, prescribed connections, accessories and compatibility matter; reconstructing its proprietary internal circuit is not a prerequisite.

## Conditional functional-safety relevance

A contactor may be an output element in a machine safety-related control function, for example removing motor energy. It is not automatically a certified safety subsystem merely because the product references IEC 60947-4-1, has auxiliary contacts, or carries a safety label. A brake coil, motor contactor, drive STO and electrical isolation have different roles; the application must establish the required stopping, holding and isolation behavior.

ISO 13849-1:2023 §6.1.5 requires diagnostic coverage to be estimated using the specified diagnostic-measure method or FMEA; contact geometry alone is not an implemented diagnostic system. The held ISO 13849-2:2012 Table D.2 describes positively mechanically linked contacts as a possible monitoring principle for Categories 2, 3 and 4, and cites **IEC 60947-4-1:2001 Annex F** among older references. This is evidence of a possible feedback mechanism in that historical edition, not a verified 2023 annex location, a universal contactor guarantee, or proof that a complete feedback circuit detects all faults. [S2, S3]

For any claimed mirror contact, request the exact device/accessory declaration and its conditions, the monitored pole/contact relationship, and the safety circuit's wiring, test timing and fault reaction. A normally closed auxiliary contact without verified properties is not automatically a reliable indication of the main-contact state. Feedback is useful only if the connected logic actually evaluates it in a suitable safety architecture.

B10d is a dangerous-failure life-data parameter, not the ordinary electrical endurance of a contactor by another name. Obtain manufacturer-declared B10d for the exact device and conditions, including load and switching assumptions, where the safety analysis needs it; determine its applicability and use in the correct ISO methodology rather than infer a value from standard membership. The historical batch attributes B10d to Annex K and mirror contacts to Annex F [S4]; **neither 2023 annex assignment was independently verified** because the official preview/full text was inaccessible. Do not use those labels as current-edition clause evidence. Nor does possession of a B10d, mirror contact or product declaration automatically provide DC, Category, PL, SIL, PFHd or a validated machine function. System architecture, diagnostic implementation, operating profile, common-cause and systematic aspects, and validation need application-specific assessment. ISO 13849-2:2012 Table D.3 also makes main-contactor well-tried treatment conditional, and notes fault exclusion is not possible for that entry; do not extrapolate this old-edition table into a universal fault-exclusion decision. [S2–S4]

## Companion routes and library implications

- **IEC 60947-1:** general rules for the low-voltage switchgear family; consult with the exact part/edition where required, rather than treating Part 4-1 in isolation. The IEC 2023 abstract specifically refers to IEC 60947-1:2020 Annex X in the MPSD/SCPD coordination revision. [S1]
- **IEC 60947-2 / -3:** candidate routes for a circuit-breaker or switch-disconnector, respectively, when those functions are actually present; neither function is implied by the word contactor. [S3 Table D.3]
- **IEC 60947-5-1:** candidate for control-circuit devices and auxiliary switching devices; a contactor relay or auxiliary contact must be classified from its actual construction and declarations, not the category name alone. The old ISO 13849-2 table references both -5-1 and an older -4-1 Annex F in its contactor-relay entry. [S3]
- **IEC 60204-1:** machine electrical-equipment installation/integration route, distinct from component product testing. **ISO 13849-1/-2**, or an appropriate alternative such as IEC 62061, addresses the applicable safety-related control function and validation rather than granting a product a universal machine rating. The exact applicable route and edition are project decisions. [S2, S3]

For the `contactor` library category, retain variant-specific load duty, electrical ratings, coil and accessory details, protection/coordination combinations, and supplier edition evidence. A motor starter or MPSD may combine functions that a bare contactor does not; a control relay, static switching device or integrated drive function needs subtype routing. For safety use, ask for the published feedback arrangement and, if available and applicable, B10d and safety manual/certificate; record missing data as unknown, not an inferred default. These are evidence questions only: no category, schema, lifecycle or approval change follows from this report.

## Local holdings, recommendation and gaps

The provided `NORMATIVE_CANDIDATES.json` has no candidate PDFs or extracted texts. A filename search across `NORMATIVE/STANDARDS_PDF`, `extracted_html`, `extracted_txt` and `.claude/memory` found no matching 60947-4-1 name. Thus **no matching full text was found**, rather than proof that none exists anywhere. The related held ISO texts [S2, S3] were inspected; they are not IEC 60947-4-1 full text. The historical batch [S4] is a research lead, not a normative holding.

**Recommendation: conditional acquisition/update.** Obtain the corrected 2023 edition if a specific device assessment needs its exact scope, test, coordination, safety-contact or life-data clauses and supplier evidence does not resolve them; obtain the supplier-cited edition as well when that precise declaration must be checked. Do not purchase solely because a contactor category exists. Ask the supplier for its own exact variant documentation first. The official public preview request was blocked (retained in `evidence/preview-response`); no access workaround was attempted. Full exclusions, normative references, 2023 annex numbering, individual tests and detailed safety parameters remain unverified.

## Evidence index

- **S1:** [IEC 60947-4-1:2023 catalogue record](https://webstore.iec.ch/en/publication/74487), accessed 2026-11-02 UTC; `evidence/iec-74487.html` and readable `evidence/iec-74487.txt`. Public scope, change summary, publication details and lifecycle; not full text.
- **S2:** local `NORMATIVE/extracted_html/ISO_13849-1_2023/ISO_13849-1_2023/auto/ISO_13849-1_2023.md`, §6.1.5, lines 1752–1768. Held extracted text, not independently checked against PDF in this task.
- **S3:** local `NORMATIVE/extracted_html/ISO_13849-2_2012/ISO 13849-2_2012/auto/ISO 13849-2_2012.md`, Annex D, Tables D.1–D.3, lines 913–930. Held older extracted edition, not independently checked against PDF.
- **S4:** local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md`, IEC 60947-4-1 section. Historical, partly truncated secondary research; annex claims remain leads, not verified findings.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `d3f06c6d0affa6531377fa788bfbebfd395d71321251fc1c0fbbb037b1bbfe2a`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60947-4-1`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60947-4-1",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "Full IEC 60947-4-1:2023 text not found locally and official preview returned HTTP 403; detailed requirements, exclusions and 2023 annex numbering are unverified.",
    "No specific manufacturer variant or supplier certificate examined; no EN adoption or OJEU/legal status assessed."
  ],
  "local_holdings_summary": "No matching full text found in supplied candidates or filename search of NORMATIVE PDF, extracted text and memory directories. ISO 13849-1:2023 and ISO 13849-2:2012 related extracted text inspected; historical switching batch is a research lead, not a holding."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "standard": "IEC 60947-4-1",
  "accessed_utc": "2026-11-02T23:02:05Z",
  "sources": [
    {"id":"S1","url":"https://webstore.iec.ch/en/publication/74487","title":"IEC 60947-4-1:2023, edition 5.0, corrected 2026-03","accessed_utc":"2026-11-02T23:02:05Z","evidence_path":"evidence/iec-74487.html","readable_evidence_path":"evidence/iec-74487.txt","kind":"public scope and publisher lifecycle","limitation":"Abstract and edition history, not full normative text."},
    {"id":"preview","url":"https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTQtMXtlZDUuMH1iLnBkZg==","title":"IEC catalogue preview for IEC 60947-4-1 edition 5","accessed_utc":"2026-11-02T23:02:05Z","evidence_path":"evidence/preview-response","kind":"failed public preview request","limitation":"HTTP 403; no preview content inspected."},
    {"id":"S2","path":"/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/ISO_13849-1_2023/ISO_13849-1_2023/auto/ISO_13849-1_2023.md","title":"ISO 13849-1:2023 extracted text, section 6.1.5","accessed_utc":"2026-11-02T23:02:05Z","evidence_path":"original path, read-only","kind":"held extracted standard text","limitation":"Only relevant section inspected; PDF not checked; not IEC 60947-4-1."},
    {"id":"S3","path":"/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html/ISO_13849-2_2012/ISO 13849-2_2012/auto/ISO 13849-2_2012.md","title":"ISO 13849-2:2012 extracted text, Annex D Tables D.1–D.3","accessed_utc":"2026-11-02T23:02:05Z","evidence_path":"original path, read-only","kind":"held extracted standard text","limitation":"Older edition; relevant excerpts only, PDF not checked; not IEC 60947-4-1."},
    {"id":"S4","path":"/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch02-switching-gemini.md","title":"Historical batch 02 switching report","accessed_utc":"2026-11-02T23:02:05Z","evidence_path":"original path, read-only","kind":"old research lead","limitation":"Incomplete secondary research, annex claims not independently verified for 2023."}
  ]
}
`````

### Explicit author source-ID definitions

These definitions use only IDs and URLs explicitly supplied in SOURCES.json; no inferred or repaired citations.

[S1]: <https://webstore.iec.ch/en/publication/74487>
[preview]: <https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwOTQ3LTQtMXtlZDUuMH1iLnBkZg==>
