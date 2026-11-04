---
{
  "format": 1,
  "metadata": {
    "id": "archived-non-iec-and-functional-safety-scope-batch-historical-gemini-report-71b232cf",
    "title": "Non-IEC and functional-safety scope batch — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about Non-IEC and functional-safety scope batch — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: Non-IEC and functional-safety scope batch — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: Non-IEC and functional-safety scope batch — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
      "Safety, legality, standards-edition and mandatory-component claims in this historical report are unverified and must not be used as present engineering/compliance assurance.",
      "Archived IEC batch assertions have known qualifications in the original local README/PRIMARY_SOURCE_CHECKS/SAFETY_SOURCE_REVIEW companions. Newer individual IEC investigations are included in this archive; do not treat old batch defaults as normative rules."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:40.620Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "71b232cfc738bcc2cb3c4a0f53fe6657ebca8c8ecac15b98d404d8a3b1d02b3f",
  "proposalRevision": "b256feb6b0514953c5b9bcbed83990bb5cab97b26be5ab28c17a92df30a840b2"
}
---
# Batch 10 — Non-IEC gap-fillers + functional-safety frameworks · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 1,769,187 · status completed · 2026-08-28.
**Standards:** EN 81-20, EN 81-50, EN 81-28, ISO 14119, ISO 13850, ISO 13849-1, IEC 62061, IEC 61508, OIML R60.
**The capstone** — how the framework standards fill the 8 GAP categories.

---

## Editions
| Std | Edition | Note |
|-----|---------|------|
| EN 81-20 | :2020 (GSO lists EN 81-20:**2025** — verify a 2025 rev) | passenger/goods lifts construction |
| EN 81-50 | :2020 | design rules, calcs, tests; **Annex B pre-mandates SIL** for PESSRAL |
| EN 81-28 | :2022 (master) | remote alarm |
| ISO 14119 | :2024 (safetysys mentions :2025 — verify) | interlocks; **Annex J fault masking** |
| ISO 13850 | :2015 | e-stop principles |
| ISO 13849-1 | :2023 | PL a–e, Cat B/1/2/3/4, MTTFd/DC/CCF |
| IEC 62061 | :2021 | SIL 1–3 machinery, PFHd/HFT/SFF |
| IEC 61508 | :2010 (7 parts) | generic parent E/E/PE |
| OIML R60(-1) | :2017 | load-cell metrology, classes C3/C4 |

## Hierarchy (parent → children)
**IEC 61508** = generic "mother" (process origin, 7 parts, 500+ pp) → two machinery-sector children:
**ISO 13849-1** (PL, Category-based; mech/pneum/hydraulic/electromechanical) + **IEC 62061** (SIL, HFT/SFF; complex E/E/PE). Both anchor on **PFHd** → direct PL↔SIL mapping.

## PL ↔ SIL ↔ PFHd (the mapping)
| PL | SIL | PFHd band |
|----|-----|-----------|
| a | — | 1e-5 … <1e-4 |
| b | — | 3e-6 … <1e-5 |
| c | SIL 1 | 1e-6 … <3e-6 |
| d | SIL 2 | 1e-7 … <1e-6 |
| e | SIL 3 | 1e-8 … <1e-7 |
PL a/b have no SIL; SIL 4 exceeds machinery scope (→ direct 61508). **EN 81-50 Annex B pre-mandates SIL**
(e.g. move-with-open-doors = SIL 3 → forces HFT=1 / Cat 3-4 two-channel, no single-channel).

## Gap-filler assessment — the 8 categories (maps 1:1 to master GAPs)
Wear vehicle: **MTTFd = B10d / (0.1 × n_op)**; + DC + Category → PFHd.

| # | Component | Framework | How assessed |
|---|-----------|-----------|--------------|
| 1 | **Safety relay module** | ISO 13849-1 | B10d from mfr; force-guided (mirror) contacts (60947-4-1/-5-1) → DC>99% → Cat 3/4 |
| 2 | **Safety brake** | ISO 13849-1 | B10d from destructive spring/armature test; dual caliper/spring = Cat 3 (UCMP) |
| 3 | **Brake controller** | IEC 61508 + 62061 | PFHd of PCB; systematic capability (MISRA); 1oo2, SFF>90%, CCF mitigation → SIL 3 |
| 4 | **General encoder** | IEC 61508 + ISO 13849-1 | (no 61800-5-2 rating) dual diverse sensing optical+magnetic → CCF↓ → PL e/SIL 3 |
| 5 | **Load cell** | **OIML R60** (metrology) + ISO 13849-1 (safety) | R60 C3/C4 accuracy (creep/hysteresis/temp) + amplifier diagnostic loop DC>90% |
| 6 | **Alarm unit** | **EN 81-28** (function) + IEC 62061 | low-demand → **PFD** (not PFHd); watchdog + 3-day auto-test + 2-way voice |
| 7 | **Door interlock** | **ISO 14119** (design/defeat) + ISO 13849-1 | B10d microswitch; **Annex J fault-masking** on series-wired doors → lower DC or individual dual-channel lines for Cat 3/PL d |
| 8 | **E-stop** | **ISO 13850** (mechanics) + ISO 13849-1 | positive-opening + latching; low n_op → high MTTFd but need dual contacts Cat 3/4 + cross-monitoring for PL e |

---

## Per-standard one-liners
- **EN 81-20** — construction/installation safety rules (doors, UCM, refuge spaces, lighting lux). Harmonized under Lifts Directive 2014/33/EU.
- **EN 81-50** — component design rules + type-test methods (governor, buffers, safety gear); **Annex B = SIL table for PESSRAL** (bypasses organic risk graph).
- **EN 81-28** — remote alarm: 2-way voice, 1 h backup, 3-day auto test call.
- **ISO 14119** — interlock design + defeat-resistance coding levels; Annex J fault masking.
- **ISO 13850** — e-stop human-factors: red/yellow, mushroom, override, no auto-restart (pairs with 60947-5-5 physics).
- **ISO 13849-1** — SRP/CS: PL a–e from risk graph (S/F/P), Cat B/1/2/3/4, MTTFd/DC/CCF.
- **IEC 62061** — machinery SIL 1–3, PFHd, HFT/SFF, software/systematic.
- **IEC 61508** — generic E/E/PE functional-safety parent (7 parts); SIL 4 only here, not machinery.
- **OIML R60** — load-cell metrology classes (max verification intervals; creep/hysteresis/temp drift). NOT a safety std → pair with 13849-1.

## Sources (Gemini, 82) — key
iteh: SIST-EN-81-20-2020, SIST-EN-81-50-2020. pilz/tuvsud/analog (13849-1, 62061, PL↔SIL).
safetysys/certifico (ISO 14119:2024/25), oiml.org (R60), gso.org.sa (EN 81-20:2025, OIML R60-1:2021).
industrialmonitordirect (B10d→MTTFd, force-guided PFD). liftinstituut/elevatorimagazine (PESSRAL, Annex B SIL).
