---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-1-power-and-energy-original-gemini-report-697a2135",
    "title": "IEC scope batch 1: power and energy — original Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 1: power and energy — original Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 1: power and energy — original Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 1: power and energy — original Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
    "researched_at": "2026-08-27",
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
      "Prior inventory classification (not a completion verification): partial",
      "Safety, legality, standards-edition and mandatory-component claims in this historical report are unverified and must not be used as present engineering/compliance assurance.",
      "Archived IEC batch assertions have known qualifications in the original local README/PRIMARY_SOURCE_CHECKS/SAFETY_SOURCE_REVIEW companions. Newer individual IEC investigations are included in this archive; do not treat old batch defaults as normative rules."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:39.212Z"
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
  "sourceDigest": "697a2135f66ae5c852f7cc0ea9498025598b5656b28c8f9e6fc0732e1691b2a5",
  "proposalRevision": "8e90b2576a01a25576e31908d27bed21b4a3ee85fae422d5742d2c3c50925210"
}
---
# Batch 1 — Power/energy standards · SOURCE: Gemini Deep Research

**Task:** "what each standard is about" — when to invoke + for what (EN 81 lift LV control context).
**Agent:** `deep-research-preview-04-2026` · tokens 1,251,347 · status completed · 2026-08-27.
**Standards:** 62368-1, 61204-7, 61558-2-16, 62040-1, 60269-1, 61643-11.

> ⚠ Gemini's returned payload opened at section 4 — **62368-1 + 61204-7 detailed sections
> were absent from its output** (only the vs-debate summary survived in its conclusion).
> Fill run (`batch01-power-gemini-fill.md`, task krho2wuup) covers those two. Sections
> below (61558-2-16, 62040-1, 60269-1, 61643-11) are Gemini verbatim-condensed.

---

## IEC 61558-2-16 — SMPS transformers
- **title:** Safety of transformers, reactors, power supply units and combinations thereof — Part 2-16: Particular requirements and tests for switch mode power supply units and transformers for SMPS units for general applications
- **current_edition (Gemini):** ed 2.0:2021; EN cited as EN IEC 61558-2-16:2025. Ed 2 moved partial-discharge test into Part 1. (src: iteh EN-61558-2-16-2025, iec.ch/65385, bsigroup, ansi)
- **when:** scrutinizing internal HF isolation of a custom/unlisted PSU; when circuit needs guaranteed Class II (double/reinforced) or "safety isolating transformer" classification — e.g. 400V primary fault must not bridge core to 24V car-panel pushbuttons. Test labs evaluate the transformer winding even when enclosure is 62368-1 certified.
- **for_what:** electrical/thermal/mechanical safety of SMPS transformers at HF (>500 Hz up to 100 MHz), ≤1000 Vac. Clearance/creepage insulation coordination. 3 transformer types (separating ≤1000Vac / isolating ≤500Vac / safety-isolating ≤50Vac) + 3 protection classes (I earth, II reinforced, III SELV source).
- **role:** Component safety standard.
- **related:** parent 61558-1; 60664-4 (HF insulation); scope EXCLUDES SMPS governed by 62040 / 61204-7 / 62368-1 → gap-filler / sub-component role.

## IEC 62040-1 — UPS
- **title:** Uninterruptible power systems (UPS) — Part 1: Safety requirements
- **current_edition (Gemini):** ed 2.0:2017 **+ A1:2021 + A2:2022**; normative base switched from 60950-1 → 62477-1. (src: iecee, iteh IEC-62040-1-2017, iec.ch/31983)  ⚠ CONFRONT: Source B earlier had A1 "unconfirmed" — Gemini asserts A1:2021 AND A2:2022.
- **when:** specifying Automatic Rescue Devices (ARD) / emergency battery backup to satisfy EN 81-20 emergency mandates (5 lux/1h car light, EN 81-28 alarm, UCM-safe move-to-landing on mains loss).
- **for_what:** electrical/thermal/mechanical safety of UPS ≤1000 Vac / 1500 Vdc. Battery thermal-runaway/fire; **backfeed protection** (isolate inverter from mains on failure — else lethal backfeed to technicians); withstand regenerative descending-car loads.
- **role:** Primary product safety standard.
- **related:** 62477-1 (normative base); UL 1778 (US); 62040-3 (performance/test).

## IEC 60269-1 — LV fuses (general)
- **title:** Low-voltage fuses — Part 1: General requirements
- **current_edition (Gemini):** **ed 5.0:2024 (Aug 2024)** — new voltages, added ratings 355/425/1600 A, "discrimination"→"selectivity". (src: iec.ch/66096, iecee, iteh 60269-1-2024)
- **when:** sizing HRC fuses for 400V main intake; branch protection upstream of traction-motor VFD where MCBs lack current-limiting speed to protect IGBTs on massive short-circuit.
- **for_what:** breaking capacity, time-current (I²t let-through), temp rise ≤1000 Vac/1500 Vdc. Utilization categories: **gG** full-range general; **aM** partial-range motor branch (short-circuit only, needs downstream overload relay); **aR/gR** ultra-fast semiconductor (VFD IGBT).
- **role:** Component standard.
- **related:** 60269-2 (industrial/authorized-person), 60269-4 (semiconductor), 60947-2 (selectivity coordination).

## IEC 61643-11 — SPDs on AC LV power
- **title:** Low-voltage surge protective devices — Part 11: SPDs connected to AC LV power systems — Requirements and test methods
- **current_edition (Gemini):** **ed 2.0:2025 (Jun 2025)** — stricter voltage tolerances, modified short-circuit test, TT Uc ≥350V (was 320), remote-monitoring for large SPDs. (src: iec.ch/65314, iteh EN-61643-11-2025)
- **when:** specifying SPDs at main distribution board + lift control panel; mandatory Type 1 / Type 1+2 at service entrance if building has external LPS or overhead supply.
- **for_what:** classification/test/rating of SPDs (MOV/spark-gap) clamping transients, Up ≤1.5 kV to protect 24Vdc electronics. **Type 1** (10/350µs, direct strike, MDB) / **Type 2** (8/20µs, panel, switching surges) / **Type 3** (combination wave, point-of-use). Backup gG fuse 63–125A; lead length ≤0.5 m (1µH/m parasitic).
- **role:** Component / sub-system protection standard.
- **related:** 61643-01 (general SPD reqs post-2025), 62305 series (lightning risk assessment), 60364-5-53 (install/erection).

---

## Gemini conclusion — 62368-1 vs 61204-7 (the surviving fragment)
Gemini framed the DIN-rail SMPS choice as a genuine "**62368-1 versus 61204-7** debate…
to select the optimal DIN-rail power supply for a harsh industrial shaft." Full resolution
deferred to the fill run.

## Sources (Gemini, 49) — key IEC-primary
iec.ch: 65385 (61558-2-16), 31983 (62040 perf), 66096 (60269-1), 65314 (61643-11).
iteh.ai previews: EN-61204-7-2018, EN-61558-2-16-2025, IEC-62040-1-2017, 60269-1-2024, EN-61643-11-2025.
iecee: 62368-1, 62040-1-2017, 60269-1-2024. Full list in session transcript.
