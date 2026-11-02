---
{
  "format": 1,
  "metadata": {
    "id": "frenic-lm2a-ups-rescue-topology",
    "title": "FRENIC-Lift LM2A emergency-descent UPS topology",
    "question": "Is the LM2A rescue UPS inline or switched in parallel, and which terminal/model assumptions remain unresolved?",
    "scope": "FRN0015LM2A-4E 400 V-class screw-lift rescue topology, contactor/BATRY sequencing and 230 V applicability; not wiring approval or certification.",
    "summary": "Argues for an interlocked switched rescue supply; explicitly leaves terminal choice and FRN0015/FRN0019 applicability confirmation open.",
    "researched_at": "2026-08-22",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Gemini",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported without fresh source or technical verification; historical findings are not current compliance, safety or legal certification.",
      "Original report bytes/citations are preserved. Third-party quotations, code and sources retain their own rights; unresolved local/transcript references remain unavailable.",
      "Report compliance language is not certification.",
      "Manual is reported to say R-T or S-T; R-T is a synthesized default.",
      "FRN0015-versus-FRN0019 230 V applicability remains open.",
      "Safety-critical design not independently reviewed.",
      "Fuji/manual/distributor/Scribd URLs not inspected.",
      "Internal ELECTRONICS finding A and URANO-E panel context unavailable.",
      "Internal machine/panel context and design gap.",
      "Source-stated generating agent label: deep-research-preview-04-2026; underlying model/platform remain unknown unless explicitly attributed."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:30:42.946Z",
    "updated_at": "2026-11-01T23:30:42.946Z",
    "imported_at": "2026-11-01T20:38:59.525Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
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
  "sourceDigest": "2d5b12f63aafa9c6cfbed8e38a54e1efe37249fa2bec9c2f854601e7376fa70a",
  "proposalRevision": "d53da1646f634d9da25a285fccd853c15267b71d14d9e5f6c4fc4ba59b7df864"
}
---
# FRENIC-Lift LM2A (FRN0015LM2A-4E) — emergency descent UPS wiring topology

**Date:** 2026-08-22
**Agent:** deep-research-preview-04-2026 (tokens: 1,519,361)
**Context:** URANO-E lift, resolving whether the 230V UPS is inline on the mains
path (user hypothesis: "phase wires pass through the UPS") or a parallel
standby rescue source injected to R-T/S-T. Feeds ELECTRONICS finding A (rescue
motion-power conductor undrawn).

## Question asked

For a Fuji Electric FRENIC-Lift LM2A inverter (model FRN0015LM2A-4E, 400V class,
5.5kW), what is the correct electrical wiring topology for EMERGENCY DESCENT /
battery / UPS rescue operation on a screw-driven lift? Resolve: (1) do the three
mains phases pass THROUGH the UPS (UPS inline) or is the UPS output injected onto
two input terminals (R-T or S-T) in parallel via a changeover contactor while the
mains contactor opens; (2) role/sequencing of MC main contactor and 73X bypass
contactor vs the BATRY input (E08=63); (3) which two of L1/R,L2/S,L3/T for a
single-phase 230V UPS; (4) is 230V-mode available on FRN0015 (below FRN0019); (5)
real OEM panel practice — mains through UPS vs parallel rescue source.

## Verdict (summary)

- **NOT inline.** Routing the inverter mains input *through* the UPS (all load
  current through it) is categorically rejected by panel builders — full dynamic
  elevator load + regenerative currents degrade/destroy a commercial UPS
  (overvoltage faults, inverter-bridge failure).
- **Parallel contact-switched standard.** UPS is a standby source switched in only
  on power loss. MC1 (mains) and MC2 (UPS) are **mutually interlocked** (each coil
  in series with the other's NC aux) → both can never close → no back-feed/grid
  collision.
- **230V AC injected into the R-T terminals** (parallel, mutually exclusive with
  mains). [NOTE: the Fuji Reference Manual text itself states "R-T or S-T" — R-T is
  the standard/default pair; either is electrically valid.]
- **Sequence on grid loss:** lift controller (PLC, often CANopen CiA 417) detects
  loss via phase-monitor relay → drops MC1 → waits for field collapse → wakes UPS →
  pulls in MC2 → asserts BATRY on the drive. Independent 24V DC lifeline stays on
  the control board throughout; BATRY sequencing protects the 73X bypass circuit.
- **Parameters:** BATRY overrides accel profile — S-curve disabled, linear
  E10/E11 (or E17), speed capped by C03 (Battery Operation Speed). Use RRD
  (Recommended Running Direction) in closed-loop vector to drive only the
  low-energy (gravity/down) direction and avoid UPS overload.
- **EN 81-20 compliant** rescue solution for screw-driven architecture.

## Caveat

Gemini synthesizes across sources and paraphrases; it picked "R-T" where the
primary Fuji Reference Manual text says "R-T or S-T". Treat the *topology*
(parallel changeover, mutual interlock, 24V lifeline, BATRY→73X) as well-corroborated;
treat the specific R-T-vs-S-T pin choice as the standard default, to be confirmed
against the Reference Manual UPS connection diagram before commit. Did NOT get an
explicit FRN0015-vs-FRN0019 230V-mode confirmation — still open.

## Full report

## Inverter Parameterization for Optimized Rescue Kinetics

Beyond physical wiring topologies and contactor sequencing, the execution of emergency evacuation in screw-driven systems demands precise parameter configuration within the FRENIC-Lift's software architecture. When the `BATRY` command is successfully asserted, the inverter fundamentally alters its dynamic handling of the motor.

Firstly, standard acceleration profiles are overridden. The S-curve acceleration and deceleration rounding—normally critical for passenger ride comfort—is explicitly disabled by the inverter's internal software during battery operation to conserve maximum energy [cite: 2, 10, 12]. Instead, the system defaults to the strictly linear acceleration and deceleration time parameters specified by function codes `E10` and `E11` (or alternatively `E17` depending on the active speed command source) [cite: 2]. The target operational speed is strictly capped by the value programmed into `C03` (Battery Operation Speed), forcing the motor to rotate at a highly restricted frequency to limit the maximum power draw on the UPS [cite: 2, 10].

### The Recommended Running Direction (RRD) Function
To further minimize the Volt-Ampere (VA) burden placed on the UPS, panel builders should integrate Fuji Electric's Recommended Running Direction (RRD) function, provided the system operates in closed-loop vector control with an encoder. The RRD software constantly monitors the energy states of the motor during normal operation.

When grid power fails, the RRD logic outputs a signal indicating which directional movement (Forward/Up or Reverse/Down) requires the least electrical energy [cite: 1]. In a screw-driven lift, driving the cabin downwards (in the direction of gravity) generally requires significantly less torque from the motor than driving the payload upwards against gravity. By configuring the main lift PLC to read the RRD output state, the controller can command the inverter to only drive the cabin in the most favorable direction [cite: 1, 7]. This intelligent directional selection prevents the UPS from experiencing extreme overload conditions that would occur if the controller attempted to force a fully loaded cabin upwards using a low-capacity emergency power source.

## Synthesis of OEM Panel Implementation Practices

In practical, real-world elevator panel designs deploying the FRENIC-Lift LM2A series alongside a UPS for evacuation, the standard industry practice meticulously reflects the safety, economic, and electrical constraints detailed throughout this report.

Professional panel builders categorically reject the use of centralized Automatic Transfer Switches (ATS) placed upstream of the entire elevator panel, unless the building possesses a massive, facility-wide emergency diesel generator system designed to sustain the entire 400V 3-phase grid dynamically. When deploying localized, single-phase UPS units specifically designated for elevator evacuation, routing the inverter mains input directly *through* the UPS (so all normal load current passes through it) is entirely avoided. Exposing a commercial UPS to total dynamic elevator loads—including the massive regenerative currents dumped back toward the grid during routine deceleration—will rapidly degrade battery life, trigger overvoltage faults, or catastrophically destroy the UPS inverter bridge.

Instead, the contact-switched parallel standard remains the definitive OEM solution [cite: 1, 2].

The system relies on rigorous hardware interlocks: the operational coil of MC1 is wired in physical series with a normally closed (NC) auxiliary contact attached to MC2, and vice versa. It is physically impossible for both contactors to close simultaneously, preventing back-feeding and grid collisions.

The overarching lift controller (often a specialized PLC or proprietary logic board operating via CANopen CiA 417 communications [cite: 13]) governs the orchestration. It detects grid loss via a phase monitoring relay, actively drops the MC1 signal, waits for the magnetic fields to collapse, and commands the standby UPS to awaken. Only then does it pull in the MC2 contactor and assert the `BATRY` digital input on the FRENIC-Lift drive.

By isolating the utility mains, utilizing a mutually exclusive parallel 230V AC injection into the R-T terminals, maintaining an independent 24V DC lifeline to the control board, and strictly commanding the `BATRY` logic sequence to protect the 73X bypass circuit, the FRN0015LM2A-4E provides a highly reliable, EN 81-20 compliant emergency descent solution perfectly tailored to the unique mechanical demands of screw-driven lift architectures.

## Sources

1. https://sky-elevator.com/uploads/lm2%20User%20Manual.pdf
2. https://www.scribd.com/document/451857541/Fuji-FRENIC-Lift-LM2-Reference-Manual-INR-SI47-1909-E-Lift-LM2-RM-E-English-pdf
3. https://asb-drives.eu/equipment/freq/fuji/frenic-lift-lm2a/7332/
4. https://asb-drives.eu/upload/iblock/4e5/catalog_LM2_en.pdf
5. https://www.scribd.com/document/442541194/3-FRENIC-Lift-pdf
6. https://www.scribd.com/document/375382337/Sg-Frenic-Lift-en-1-8-0
7. https://www.fujielectric.com/products/drives_inverters/ac_drives_lv/product_series/frenic-lift-lm2a_info.html
8. https://www.fujielectric-europe.com/products/drives-automation/low-voltage-drives/frenic-lift-frn-lm2a
9. https://www.scribd.com/document/262433752/Fuji-Starting-Guide-G11S-LE2-Lift-7
10. https://www.scribd.com/document/514645417/FUJI-INVERTER-MANU
11. https://www.scribd.com/document/443252268/FRENIC-LIFT-LM2-Code
12. https://www.scribd.com/document/445827383/Frenic-MEGA-INR-SI47-1582-E-6th-SW-version
13. https://www.scribd.com/document/813120919/Starting-Guide-Frenic-Lm2a-Cia417-en-1-0-1
