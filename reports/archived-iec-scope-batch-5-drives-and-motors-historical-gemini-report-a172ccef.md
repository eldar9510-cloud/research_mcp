---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-5-drives-and-motors-historical-gemini-report-a172ccef",
    "title": "IEC scope batch 5: drives and motors — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 5: drives and motors — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 5: drives and motors — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 5: drives and motors — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
      "Prior inventory classification (not a completion verification): partial",
      "Safety, legality, standards-edition and mandatory-component claims in this historical report are unverified and must not be used as present engineering/compliance assurance.",
      "Archived IEC batch assertions have known qualifications in the original local README/PRIMARY_SOURCE_CHECKS/SAFETY_SOURCE_REVIEW companions. Newer individual IEC investigations are included in this archive; do not treat old batch defaults as normative rules."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:39.751Z"
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
  "sourceDigest": "a172ccefd0d496e3224252777faa3849656aea00c86cafbc5d8484a61d2919f5",
  "proposalRevision": "a4365056e76e1a14753063293b336693d362cb8ff2adb5ec16bd964819078b70"
}
---
# Batch 5 — Drive & motor (60034-1, 61800-5-x) · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 1,838,360 · status completed · 2026-08-28.
**Standards:** 60034-1, 61800-5-1, 61800-5-2, 61800-5-3. Recovered via research_status.

> ⚠ Front-truncated: 60034-1 + 61800-5-1 record headers cut; captured 61800-5-2 STO detail,
> full 61800-5-3 section (incl. "generic encoder anomaly"), and the 4-standard synthesis.
> Editions from source list — some flagged LOW-CONFIDENCE, verify on Webstore before quoting.

---

## IEC 60034-1 — Rotating electrical machines: rating & performance
- **title:** Rotating electrical machines — Part 1: Rating and performance
- **current_edition:** ⚠ **LOW-CONFIDENCE** — sources cite both **ed 13.0:2022** (master) and an **IEC 60034-1:2026 / "ed 15"** (iteh iec-60034-1-2026; ansi iec60034ed15en2026; Webstore 65446). A 2026 edition may have published — VERIFY on iec.ch before quoting.
- **when:** specifying the traction motor — rate it for the lift's intermittent **duty type S4/S5** (start/stop/brake) so insulation class survives the 400V thermal profile.
- **for_what:** rating, **duty types S1–S10**, temperature-rise / insulation class, tolerances, performance declarations.
- **role:** Product/component (machine rating).
- **related:** 60034-2-1 (efficiency test method), 60034-5 (IP for machines), **60034-30-1** (IE efficiency classes; new -30-1:2025/2026 + pr-30-2:2026).

## IEC 61800-5-1 — PDS safety: electrical/thermal/energy
- **title:** Adjustable speed electrical power drive systems — Part 5-1: Safety requirements — Electrical, thermal and energy
- **current_edition:** **IEC ed 3.0:2022**; **EN IEC 61800-5-1:2023** (iteh en-iec-61800-5-1-2023; Webstore 62103). (Legacy 2007+A1:2016.)
- **when:** selecting the traction VFD — proves basic product safety (galvanic isolation, creepage/clearance) between the 400V inverter stage and the 24V control panel.
- **for_what:** electric-shock, thermal and energy hazards of the drive; isolation, protective bonding, capacitor discharge.
- **role:** Product safety.
- **related:** 61800-5-2, 61800-3 (EMC), 60664-1.

## IEC 61800-5-2 — PDS functional safety (STO/SS1/SBC)
- **title:** …Part 5-2: Safety requirements — Functional
- **current_edition:** IEC **ed 2.0:2016** (Webstore 24556); note incompliancemag flags a revision in progress — VERIFY. EN IEC 61800-5-2.
- **when:** using the VFD's integrated safety functions to go **contactorless** — Safe Torque Off (STO), SS1, Safe Brake Control (SBC) replacing electromechanical motor contactors.
- **for_what:** defines the drive-integrated safety sub-functions + their validation. Lift STO must claim **PL e / SIL 3**, HFT ≥ 1 (dual-channel redundant STO inputs; 24V safety signal split to two terminals). TÜV-certified STO (Ziehl-Abegg ZAdynpro, Control Techniques Unidrive M) is what legally permits omitting motor contactors.
- **role:** Functional safety (product-integrated).
- **related:** **ISO 13849-1 / IEC 62061 / IEC 61508** (SIL/PL framework), 61800-5-1.

## IEC 61800-5-3 — PDS functional safety of encoders (the gap-closer)
- **title:** …Part 5-3: Safety requirements — Functional, electrical and environmental requirements for encoders
- **current_edition:** **IEC ed 1.0 (2021-02-23)** (Webstore 28614; nen.nl); **EN IEC 61800-5-3:2023** (iteh).
- **when:** whenever an **Encoder(SR)** performs a safety task (safe overspeed / Safe Limited Position) in high-demand mode — e.g. eliminating mechanical governor ropes + terminal limit switches.
- **for_what:** design/integration/validation of safety encoders — CCF mitigation in the tight housing (dual independent sensing: absolute-optical + incremental-magnetic), redundant mechanical interfaces (keyway/locking collar anti-slip), diagnostic coverage → **SIL 3 / PL e**.
- **role:** Product standard (safety-encoder specific).
- **related:** 61800-5-2, ISO 13849-1, IEC 62061.

---

## Key nugget — "the generic encoder anomaly" (backs the master's encoder GAP)
There is a rigorous product standard for **safety** encoders (61800-5-3) but **NO overarching IEC product
standard for general-purpose non-safety encoders** — historically treated as generic transducers (claim
only EMC IEC 61000 series, or ATEX/IECEx if in hazardous areas). Software-driven motion-safety (SLS, SDI)
made encoder feedback the weakest link; IFA pushed for a unified metric; **IEC 61800-5-3 published 2021**
to close it. ⇒ Library `encoder` category: safety variant → 61800-5-3; general variant → genuinely no
dedicated IEC product standard. Confirms master row 13.

## Full-chain synthesis (contactorless lift drive)
60034-1 (motor duty S4/S5) → 61800-5-1 (drive product safety / isolation) → 61800-5-2 (STO/SBC, SIL3/PLe,
contactorless) → 61800-5-3 (trusted Encoder(SR) feedback). Four standards interlock into the safety chain.

## Sources (Gemini, ~72) — key IEC-primary
Webstore: 28614 (61800-5-3), 24556 (61800-5-2), 62103 (61800-5-1), 65446/91195 (60034-1 area),
62415, 5936. iteh: en-iec-61800-5-1-2023, en-iec-61800-5-3-2023, iec-60034-1-2026, en-iec-60034-30-1-2026.
ziehl-abegg / nidec / control-techniques (TÜV STO SIL3), sick/dynapar (safety-encoder gap). Full list in transcript.
