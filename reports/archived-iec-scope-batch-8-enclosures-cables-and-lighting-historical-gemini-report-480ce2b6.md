---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-8-enclosures-cables-and-lighting-historical-gemini-report-480ce2b6",
    "title": "IEC scope batch 8: enclosures, cables and lighting — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 8: enclosures, cables and lighting — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 8: enclosures, cables and lighting — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 8: enclosures, cables and lighting — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
    "imported_at": "2026-11-04T21:30:40.253Z"
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
  "sourceDigest": "480ce2b6460bd6848c67d3e5304fc99847529c7ad3e6316d0c97a58befa2422f",
  "proposalRevision": "9c9cbb6deb65f76f47f954bfbb3d23bfc6c8e7fe72ccf592848cd266feb3d190"
}
---
# Batch 8 — Enclosure / mount / cable / lighting · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 1,319,106 · status completed · 2026-08-28.
**Standards:** 60715, 62208, 61439-1/-2, 60227-1, 60228, 60598-1, 61347-2-13. FULL report.

---

## IEC 60715 — DIN-rail dimensions
- **current_edition:** **ed 2.0:2017** (Webstore 29026). 2017 rev REMOVED the rail's protective-earth function from scope.
- **when:** panel mechanical layout — mounting contactors/PLCs/terminals on TS35 (TH 35-7.5/-15), C, G rails.
- **for_what:** dimensional interchangeability + vibration-proof mechanical fit ONLY (not earthing → use 60947-7-2 for that).
- **role:** horizontal dimensional standard. **related:** 60947-7-2, 60529.

## IEC 62208 — Empty enclosures
- **current_edition:** **ed 3.0:2023** (Webstore 67906; iecee 62208:2023).
- **when:** procuring the raw empty cabinet BEFORE populating.
- **for_what:** shell resilience — IP (60529), IK impact, thermal, corrosion/salt-mist; ≤1000 Vac/1500 Vdc.
- **role:** product standard (empty shell). **related:** 61439-1 (takes over once populated).

## IEC 61439-1 / -2 — Verified assemblies
- **current_edition:** **ed 3.0:2020** (both; Webstore 32338).
- **when:** validating a POPULATED panel — esp. power distribution / busbar 400V segments.
- **for_what:** current-carrying, short-circuit withstand, thermal. **Design Verification** (test/calc/comparison — 13 mandatory characteristics, Annex D) + **Routine Verification** (every unit). Replaced old TTA/PTTA.
- **role:** assembly product standard. **related:** 62208, EN 60204-1.

## ⚠ EN 60204-1 SUPREMACY (lift machine cabinet)
EN 81-20 **Clause 5.10** dictates lift electrical equipment conforms to **EN 60204-1** (Safety of machinery — electrical equipment; ed 2016/harmonized). The machine-mounted controller is an *automation switchboard* (logic + motion + human-safety), NOT a distribution board → **60204-1 governs, not 61439**. 61439 invoked only voluntarily for high-power distribution subsystems/busbars. (60204-1: field fault-loop impedance, wiring colour-code, e-stop logic, isolator 0.6–2.0 m accessible.) Confirms Source C ASM.PANEL note in master.

## IEC 60227-1 — PVC cables ≤450/750 V
- **current_edition:** **ed 4.0:2024** (Webstore 71989). Sub-part **60227-6:2001** = lift/flexible-connection cables.
- **when:** fixed machine-room wiring (‑1) + flexible trailing cables under the car (‑6), ≤450/750 V.
- **for_what:** PVC insulation/sheath physical/chemical/electrical props, flame propagation, dimensions.
- **role:** product standard (cable family). **related:** 60228 (conductor), 60332 (fire).

## IEC 60228 — Conductors of insulated cables
- **current_edition:** Gemini said ed 3.0:2004. ⚠ **Master (Source B) = 60228:2023 ed 4.0 — verify; use master.**
- **when:** selecting any cable's copper/aluminium core — cross-section + flexibility class.
- **for_what:** nominal cross-section, strand diameter, max DC resistance (Ω/km @20°C). **Classes: 1 solid · 2 stranded · 5 flexible · 6 very-flexible.**
- **⚠ Lift rule:** 60227-6 requires trailing-cable conductors **≥ Class 5**. Class 1/2 work-harden under millions of bend cycles → micro-fractures → intermittent open-circuit "control faults." Class 5/6 mandatory.
- **role:** foundational component standard. **related:** 60227-x, 60245-x.

## IEC 60598-1 — Luminaires general
- **current_edition:** Gemini LOW-CONF (no date). ⚠ **Master (Source B) = 60598-1:2024 ed 10.0 — use master.**
- **when:** car / machine-room / shaft light fixtures.
- **for_what:** luminaire housing safety — heat, mechanical impact, IP in dusty shaft.
- **role:** product safety. **related:** 61347-2-13, 62384.

## IEC 61347-2-13 — LED-module controlgear (drivers)
- **current_edition:** **ed 3.0:2024** (Webstore 64713; EN IEC 61347-2-13:2024). SIST-EN:2025.
- **when:** selecting LED drivers for car/machine-room/shaft, incl. emergency battery-backed operation.
- **for_what:** LED driver electrical safety, DC≤1500V/AC≤1000V, no fire/leakage/flaming-droplet (d0/d1); must run on 24V/battery for emergency light.
- **role:** product safety (controlgear). **related:** 61347-1, 62384, 60598-1.

---

## EN 81-20 lux table (why the 24V control must bridge to battery)
| Location | Normal | Emergency |
|----------|--------|-----------|
| Machine room | 200 lux (working) / 50 transit | — |
| Car interior | 100 lux (was 50) | 5 lux ≥1 h |
| Car roof | 50 lux | 5 lux ≥1 h |
| Pit floor | 50 lux | — |
| Shaft/well | 20 lux | — |
Fail the 5 lux/1 h → Notified Body cert failure. Fire detector must auto-cut main lift switch + lighting.

## Sources (Gemini, ~72) — key IEC-primary
Webstore: 29026 (60715), 67906 (62208), 32338 (61439), 71989 (60227-1), 14026 (60227-6), 64713 (61347-2-13).
iteh: iec-60715-2017, en-iec-62208-2023, iec-60227-1-2024, IEC-60227-6-2001, en-iec-61347-2-13-2024.
gt-engineering / eaton / industrialtechnology (60204-1 vs 61439). Editions to trust from MASTER: 60228:2023, 60598-1:2024.
