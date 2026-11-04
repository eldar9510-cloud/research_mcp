---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-1-power-and-energy-gemini-follow-up-3cbea854",
    "title": "IEC scope batch 1: power and energy — Gemini follow-up",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 1: power and energy — Gemini follow-up?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 1: power and energy — Gemini follow-up. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 1: power and energy — Gemini follow-up. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
      "Safety, legality, standards-edition and mandatory-component claims in this historical report are unverified and must not be used as present engineering/compliance assurance.",
      "Archived IEC batch assertions have known qualifications in the original local README/PRIMARY_SOURCE_CHECKS/SAFETY_SOURCE_REVIEW companions. Newer individual IEC investigations are included in this archive; do not treat old batch defaults as normative rules."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:39.065Z"
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
  "sourceDigest": "3cbea8544da8218348ff78863ffe00904976b535cc8c0eee8363e91227e0db3b",
  "proposalRevision": "254c59122bfb06d53766ac8cd6289ec7f62e44cc9f82af8b6fb96506256e9814"
}
---
# Batch 1 FILL — DIN-rail SMPS (62368-1 vs 61204-7 vs 61010-2-201) · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 1,414,174 · status completed · 2026-08-27.
**Purpose:** recover the two standards absent from `batch01-power-gemini.md` + resolve the
contested "primary product standard for a lift-control-panel DIN-rail SMPS" question.

---

## IEC 62368-1 — A/V, ICT equipment safety (HBSE)
- **title:** Audio/video, information and communication technology equipment — Part 1: Safety requirements
- **current_edition:** IEC **ed 4.0:2023** (global). **EU-harmonized = EN IEC 62368-1:2020 + A11:2020 (Ed 3)** — Ed 4 is NOT in OJEU (CENELEC TC108X discontinued HAS engagement after ~500 consultant comments; unlikely near-term). ⇒ **CE marking under LVD relies on Ed 3 (2020)**, test-to-Ed4 only for non-EU markets. (src: iecee 62368-1-2023, iec.ch/69308, siq.si OJEU update, nemko)
- **when:** default baseline electrical-safety cert manufacturers apply to DIN-rail SMPS after 60950-1 withdrawal (2020); needed for global CE/UL/CB market access + IT-based lift monitoring peripherals.
- **for_what:** Hazard-Based Safety Engineering — shock + fire via **Energy Source classes ES1/ES2/ES3** and **Power Source classes PS1/PS2/PS3**. Replaces SELV term with **ES1** (evaluates voltage AND current — a 24V hiccup-mode output can slip to ES2). X-cap discharge: ≥300nF → <60V/2s normal, <120V/2s single-fault.
- **role:** Product safety standard (baseline electrical), rooted in consumer/ICT assumptions.
- **related:** successor to 60950-1; pairs with 61010-2-201 (industrial) + 61558-2-16 (transformer); LVD 2014/35/EU.

## IEC 61204-7 — LV switch-mode power supplies (safety)
- **title:** Low-voltage switch-mode power supplies — Part 7: Safety requirements
- **current_edition:** IEC **ed 2.0:2016**; **EN IEC 61204-7:2018 harmonized under LVD** (OJEU-listed; superseded EN 61204-7:2006, withdrawn 2021-03-16). (src: iec.ch/26155, iteh EN-61204-7-2018, ce-marking.help, bsigroup)
- **when:** theoretically the *dedicated* product standard for the SMPS component itself — invoke when evaluating converter topology specifically. In practice **marginalized**: redundant once a unit meets 61010-2-201 + 62368-1.
- **for_what:** safety of the switch-mode converter (internal power topology, SELV/PELV output limits, protection classes). Uses legacy SELV terminology (≤60Vdc under single-fault).
- **role:** Product/component standard (SMPS-specific) — "the marginalized standard."
- **related:** 62368-1, 61010-2-201, 61558-2-16; legacy 60950-1 lineage.

---

## VERDICT — primary standard for a lift-panel DIN-rail SMPS = TRIANGULATION
| Priority | Standard | Role in the decision |
|----------|----------|----------------------|
| 1. Industrial/environmental | **IEC 61010-2-201:2018** (harmonized) | Non-negotiable for panel application — OVC III/IV, thermal (-40°C cold start / +60–85°C), vibration; replaced UL 508. |
| 2. Baseline electrical | **EN IEC 62368-1:2020+A11 (Ed 3)** | Universal shock/fire baseline via HBSE; satisfies EU LVD presumption of conformity. |
| 3. Marginalized | **IEC 61204-7 / EN:2018** | Most accurate for the SMPS component, but redundant for the specifying engineer. |

High-end DIN-rail models (MeanWell XDR, TDK-Lambda CN-B110) carry **both 61010-1 and 62368-1**.

## Confront impact on prior master
Prior reconciled master listed `power_supply → IEC 62368-1:2023`. Fill shows that is **incomplete
in two ways**: (a) EU-legal edition is **Ed 3 2020+A11**, NOT 2023 (2023 not OJEU-harmonized);
(b) the governing INDUSTRIAL standard is **61010-2-201:2018**, which the original Source A (Gemini
component-first) had flagged and the master over-corrected away. Net: `power_supply` should read
**61010-2-201:2018 (industrial) + EN 62368-1:2020 Ed3 (LVD baseline) + 61204-7:2018 (SMPS-specific)**.

## Sources (Gemini fill, 48) — key
iec.ch: 69308 (62368-1 ed4), 26155 (61204-7), 30437 (61010-2-201). iteh: EN-61204-7-2018,
EN-61010-2-201-2024. siq.si (OJEU 62368-1 status), ce-marking.help (61204-7:2018 harmonized),
iecee (62368-1-2023/2018, 61010-2-201-2013), meanwell/tdk (dual-cert practice). Full list in transcript.
