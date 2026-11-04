---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-3-control-circuits-historical-gemini-report-b1ae9132",
    "title": "IEC scope batch 3: control circuits — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 3: control circuits — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 3: control circuits — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 3: control circuits — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
    "imported_at": "2026-11-04T21:30:39.482Z"
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
  "sourceDigest": "b1ae9132a3dda58bfbdddadd4efa6a9ddcb27cc0b29844e4b4ad697cc1c3bed3",
  "proposalRevision": "92d6f88ce010ad9081e9a1ca76d5ae41297672ea2fd9bbfb341f524932347f70"
}
---
# Batch 3 — Control-circuit & proximity (IEC 60947-5) · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 1,797,815 · status completed · 2026-08-28.
**Standards:** 60947-5-1, 60947-5-2, 60947-5-3, 60947-5-5. All editions verified via IEC Webstore.
**Note:** report recovered via research_status after a premature "in_progress" notification.

---

## IEC 60947-5-1 — Electromechanical control-circuit devices
- **title:** LV switchgear & controlgear — Part 5-1: Control circuit devices and switching elements — Electromechanical control circuit devices
- **current_edition:** **ed 5.0 (2024-03-26)** — Webstore pub 65935; iecee 60947-5-1:2024. New: environmental info, reed-contact test protocols, EMC to generic immunity.
- **when:** any physically-actuated switch ≤1000 Vac/600 Vdc in the lift — landing/car door interlock switches, final limit switches, overspeed-governor contacts, pit-buffer compression contacts, COP/landing pushbuttons.
- **for_what:** mechanical endurance, making/breaking capacity, dielectric, shock/vibration/damp-heat. Utilization cats AC-15 (contactor coils), DC-13 (DC electromagnets). Declares **B₁₀d** for ISO 13849-1.
  - **Annex K — positive opening / direct opening action:** contact separation is the direct result of actuator movement through NON-resilient (rigid, no-spring) members → if silver tips micro-weld, rigid linkage shears the weld open. EN 81-20 §5.11.2.2 MANDATES it for all mechanical safety contacts. Marked with circle-arrow-outward symbol; absent symbol = non-compliant.
  - **Annex L — mechanically-linked (mirror) contacts:** NO main pole + NC monitoring contact can never be closed simultaneously → welded 400V pole blocks the NC aux from closing → PESSRAL detects welded contactor.
- **role:** Product safety / component.
- **related:** 60947-1, EN 81-20, 60204-1.

## IEC 60947-5-2 — Proximity switches (standard, non-safety)
- **title:** …Part 5-2: Control circuit devices and switching elements — Proximity switches
- **current_edition:** **ed 4.0 (2019-10)** — Webstore pub 32517; iecee 60947-5-2:2019; EN IEC 60947-5-2:2020 (LVD). Added artificial-optical-radiation + hot-surface protection, EMC.
- **when:** non-contact sensors for OPERATIONAL (non-safety) tasks — floor-leveling, position counting, capacitive touchless call buttons, inductive sheave-speed VFD feedback.
- **for_what:** sensing range, switching freq, IP, hysteresis, basic EMC for inductive/capacitive/ultrasonic/photoelectric/magnetic. **Explicitly NO defined behaviour under fault** — transistor short → unpredictable output (can fail "ON") → CANNOT be used alone in the EN 81-20 safety chain.
- **role:** Component / product safety (operational only).
- **related:** 60947-1, 60947-5-1.

## IEC 60947-5-3 — Proximity devices with defined behaviour under fault (PDDB)
- **title:** …Part 5-3: Requirements for proximity devices with defined behaviour under fault conditions (PDDB)
- **current_edition:** **ed 3.0 (2026-08, FprEN IEC)** — Webstore pub 75167; supersedes 2013 ed 2.0. Tightly integrates ISO 13849-1:2023 + IEC 62061; standardizes safe state = OFF-state.
- **when:** whenever a solid-state/non-contact sensor enters the electric safety chain, or a SIL/PL claim is required — RFID/magnetic coded safety door switches replacing mechanical interlocks; absolute positioning bands replacing mechanical final limits; proximity used as ISO 14119 interlock.
- **for_what:** hardware fault tolerance, internal diagnostics, safe-state enforcement. Redundant architecture (Cat 3/4), **OSSD outputs** (µs 24V→0V diagnostic test pulses; masked pulse on short → safety controller detects). Supplies **PFHd, DC, HFT** → direct inputs to prove PL d/e.
- **role:** Functional-safety component specification.
- **related:** 60947-5-2 (baseline), ISO 13849-1, IEC 62061, ISO 14119.

## IEC 60947-5-5 — Emergency-stop device with mechanical latching
- **title:** …Part 5-5: Electrical emergency stop device with mechanical latching function
- **current_edition:** **ed 2.0 (2026-02)** — Webstore pub 69111. (Legacy BS EN 60947-5-5:1998+A11:2013.)
- **when:** any manual e-stop needing deliberate reset — pit control station, car-roof inspection station, machine/pulley-room emergency switches, any 24V safety-chain stop button.
- **for_what:** internal electromechanical construction — **trigger action** (latch past point-of-no-return exactly as contacts separate), mechanical latching (locks OFF until twist/pull reset), **positive opening (imports Annex K)**, anti-defeat mechanical endurance (vibration/shock/contact-teasing).
- **role:** Product + functional-safety component.
- **related:** **ISO 13850** (ergonomics/colour/shape/placement — the human interface half), 60947-5-1, 60204-1.

---

## Key distinctions captured
- **-5-2 vs -5-3:** static continuous output + single-channel + unpredictable fail  ⟶  OSSD pulsed output + redundant 1oo2/2oo2 + deterministic OFF-state. EN 81-20/-50 requires **-5-3** whenever solid-state replaces mechanical Annex K switches.
- **-5-5 vs ISO 13850:** 60947-5-5 = physics inside the button (latching, contact opening); ISO 13850 = human factors (red/yellow, mushroom head, placement ≤0.30 m from pit refuge, override + no auto-restart). Both required in the technical file.
- **Safety-chain metric flow:** electromechanical (-5-1/-5-5) → **B₁₀d** → MTTFd via n_op traffic profile; solid-state (-5-3) → static **PFHd**.

## Sources (Gemini, 40) — key IEC-primary
Webstore pubs: 65935 (60947-5-1), 32517 (60947-5-2), 75167 (60947-5-3), 69111 (60947-5-5), 3989.
iecee: 60947-5-1-2024, 60947-5-2-2019, 60947-1-2020. gt-engineering (direct opening action),
rs-online (13850 vs 60947-5-5), intertekinform (60947-5-3:2026). Full list in transcript.
