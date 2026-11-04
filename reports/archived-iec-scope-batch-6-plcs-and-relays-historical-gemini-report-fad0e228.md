---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-6-plcs-and-relays-historical-gemini-report-fad0e228",
    "title": "IEC scope batch 6: PLCs and relays — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 6: PLCs and relays — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 6: PLCs and relays — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 6: PLCs and relays — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
    "researched_at": "2026-08-28",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Gemini Deep Research",
      "author": "unknown",
      "model": "deep-research-preview-04-2026"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Prior inventory classification (not a completion verification): complete",
      "Safety, legality, standards-edition and mandatory-component claims in this historical report are unverified and must not be used as present engineering/compliance assurance.",
      "Archived IEC batch assertions have known qualifications in the original local README/PRIMARY_SOURCE_CHECKS/SAFETY_SOURCE_REVIEW companions. Newer individual IEC investigations are included in this archive; do not treat old batch defaults as normative rules."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:39.907Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "transcript_dependency",
      "message": "Possible transcript-only evidence; review before publication."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "fad0e22867b90f297b601b09d9d39fa1cc8295cd86f9fdb315754f802c3fc63e",
  "proposalRevision": "d1e880cf54303680cd49e5391aa4083fd0396da28ff9733a3dffce933a44414b"
}
---
# Batch 6 — PLC & relays (61131-2, 61131-6, 61810-1) · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 1,035,329 · status completed · 2026-08-28.
**Standards:** 61131-2, 61131-6, 61810-1 (+ 61810-3 boundary, safety-relay-module gap). FULL report (not truncated).

---

## IEC 61131-2 — Programmable controllers: equipment requirements
- **title:** Industrial-process measurement and control — Programmable controllers — Part 2: Equipment requirements and tests
- **current_edition:** **ed 4.0 (2017-08)**; **EN IEC 61131-2:2025** (CENELEC harmonized; technical baseline still 2017). Webstore 31007.
- **when:** any standard (non-safety) PLC / PAC / remote I/O / PADT / **industrial HMI / panel PC** in the 24V control architecture — floor dispatch, cabin lighting, door sequencing.
- **for_what:** **hardware integrity + EMC ONLY** (2017 ed4 REMOVED all product-safety → points to 61010-2-201). Digital input Type 1/2/3 thresholds (sink/source), overvoltage cat, climatic/altitude derating, shock/vibration, RF immunity extended to 2.7–6 GHz.
- **role:** Product-specific hardware + EMC standard.
- **related:** **IEC 61010-2-201 (product safety — cite in TANDEM)**, 61131-3 (languages), 61000-6-2/-6-4 (EMC).
- **HMI/panel-PC note:** scope explicitly expanded to cover industrial displays/HMIs + panel PCs — same enclosure, same 24V, same EMC exposure as the PLC. Confirms master hmi_panel → 61131-2.

## IEC 61131-6 — Programmable controllers: functional safety (FS-PLC)
- **title:** Programmable controllers — Part 6: Functional safety
- **current_edition:** **ed 1.0 (2012-10)**. Webstore 4555.
- **when:** a PLC acts as the logic subsystem of an E/E/PE safety system — **PESSRAL** functions (UCMP, overspeed, door interlock) under EN 81-20.
- **for_what:** safety lifecycle, HFT, software-error prevention; manufacturer supplies **PFD, PFH, SFF, HFT, DC** for the engineer's system-level SIL calc. **Caps at SIL 3** (= PL e) — SIL 4 excluded because machinery hazards are localized; SIL 4 needs hardwired non-programmable architecture per 61508.
- **role:** Sector-specific functional-safety product standard (bridge from 61508 to the FS-PLC product).
- **related:** **IEC 61508** (mother std), IEC 62061 / ISO 13849-1 (application), EN 81-20/-50.
- **hierarchy:** 61508 (generic) → 61131-6 (FS-PLC product) → 62061/13849-1 (machine application). Engineer plugs the 61131-6 PFH/SFF into the 62061 loop calc.

## IEC 61810-1 — Electromechanical elementary relays
- **title:** Electromechanical elementary relays — Part 1: General and safety requirements
- **current_edition:** **ed 4.1 = IEC 61810-1:2015 + AMD1:2019 CSV**. Webstore 64641/66148.
- **when:** basic all-or-nothing relays interfacing 24V logic ↔ 400V power, ≤1000 Vac/1500 Vdc.
- **for_what:** dielectric strength (400V can't arc to 24V side), electrical/mechanical endurance (millions of cycles), insulation coordination via 60664-1. **Does NOT govern failure behaviour** → blind to contact welding.
- **role:** Electromechanical component baseline.
- **related:** 61810-2 (reliability), **61810-3** (forcibly-guided), 60664-1.

---

## Boundary: 61810-1 → 61810-3, and the safety-relay-module GAP (confirms master row 11)
| Component | Governing standard | Technical-file output |
|-----------|--------------------|-----------------------|
| Standard relay | **IEC 61810-1** | voltage/endurance/insulation proof |
| Safety relay (elementary, forcibly-guided) | **IEC 61810-3:2015** (ADDS to Part 1) | mechanical-linkage proof: welded NO ⇒ linked NC cannot close ⇒ DC≈100% by monitoring NC |
| **Safety relay MODULE (Pilz PNOZ, Sick, IDEC)** | **NO dedicated IEC product standard** → **ISO 13849-1 / IEC 62061 / IEC 61508** | certified PL / SIL + PFH + SFF |

Safety relay module straddles component-vs-PLC → excluded from both 61810-3 and 61131-6 → certified as a
SIS subsystem directly to the functional-safety frameworks. **This is exactly the master's `safety_relay` GAP.**

## Synthesis (EN 81-20 file)
Standard logic/HMI: **61131-2** (EMC/hw) + **61010-2-201** (safety). PESSRAL safety logic: **61131-6** FS-PLC
(≤SIL 3). Power interface: **61810-1** relay; safety cut-off: **61810-3** forcibly-guided or a module cited via
ISO 13849-1/62061.

## Sources (Gemini, 54) — key IEC-primary
Webstore: 31007 (61131-2), 4555 (61131-6), 64641/66148 (61810-1), 21885 (61810-3), 21880.
iecee 61010-2-201, 61810-1-2015. iteh: en-iec-61131-2-2025, iec-61131-6-2012, iec-61810-3-2015,
iec-61810-1-2015-amd1-2019. plcopen (61131-6 SIL3), digikey/idec (safety relay module gap). Full list in transcript.
