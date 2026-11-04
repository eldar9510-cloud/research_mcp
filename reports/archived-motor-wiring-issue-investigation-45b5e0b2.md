---
{
  "format": 1,
  "metadata": {
    "id": "archived-motor-wiring-issue-investigation-45b5e0b2",
    "title": "Motor wiring issue investigation",
    "question": "What findings, alternatives and limitations does the historical investigation document about Motor wiring issue investigation?",
    "scope": "Historical URANO-E machine UPS/wiring/option-card investigation: Motor wiring issue investigation. Not a transferable wiring instruction, present installation verification or safety approval.",
    "summary": "Historical machine-specific investigation of Motor wiring issue investigation, preserving exact variant/context, claimed evidence and outstanding physical/commissioning limitations.",
    "researched_at": "2026-08-22",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Original report status/context: Status: DONE",
      "Machine-specific terminals, variants, operating conditions and physical commissioning were not rechecked for this import; do not transfer findings to another device or machine."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:41.345Z"
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
  "sourceDigest": "45b5e0b2daf2b48a82b4cee5ffc864aaf26d1efbd3ae1d9f0249c1239d5145c0",
  "proposalRevision": "ef85345476906fe227e5e4911e7154de1145f5ff89abe36f4b5a5304299deedc"
}
---
# Motor-sheet wiring issues #2–#5 — verification report

Status: DONE
Date: 2026-08-22
Brief: `MACHINES/urano_e/electronics/wiring/research/motor-wiring-issues-brief.md`
Scope: verify issues #2–#5 against on-disk sources (block_diagram.yaml,
wiring_decisions.yaml, sheet_wires.yaml, frenic + encoder + relay part YAMLs,
fuji datasheets). No source edits made.

Sheet-local label map (from brief, used throughout):
- `-T1` = frenic VFD `=M1+CAB-T2` (part `frenic_lm3_inverter`, FRN0015LM2A-4E)
- `-T2` = braking resistor `=M1+CAB-T1`
- `-M1` = motor `=M1+CAB-M5`
- `-B3` = encoder `=M1+CAB-B4` (part `motor_encoder_incremental`, SICK AFM60S-S4KS4096)
- `-K2` = interposing brake relay `=B1+CAB-K2`

---

## Issue #2 — Encoder power/shield missing

- **verdict:** CONFIRMED
- **root_cause:** Encoder `-B3` (SICK AFM60S) is an active device. Its supply
  pins `RD` (+Us) and `BU` (GND) and its `Braid` (shield) are not wired on the
  Motor sheet — only the four Sin/Cos signal wires PK/BK/GY/GN are emitted
  (`sheet_wires.yaml` Motor, L47–50). A 1Vpp Sin/Cos encoder with no supply
  produces no feedback, so closed-loop vector control cannot run.
  - `sheet_wires.yaml` routes the 4 signals to `-T1 RJ-45`, but per the Fuji
    datasheet the VFD's RJ-45 is the **keypad** connector, not an encoder input:
    lm2a.md §Control circuit "RS-485 communications port 1 (For connection of
    the keypad) [RJ-45 connector] Used to connect the keypad to the inverter."
    The encoder lands on the **OPC-PR** PG card (block_diagram.yaml link
    `=M1+CAB-B4 → =M1+CAB-T2` encoder_sincos "Sin/Cos (OPC-PR card)";
    reference_manual L01=5: "Sinusoidal differential voltage 1 Vp-p,
    SIN/COS (HEIDENHAIN ERN1387 or its equivalent) → OPC-PR"). So the existing
    4-wire destination terminal is itself mislabeled.
  - `wiring_decisions.yaml` Batch D (L653–664) declares RD/BU/Braid "unused"
    with hand-waves: `RD: "+Us supply (4.5-32VDC) — powered via OPC-PR card.
    No discrete field wire."`, `BU: "Encoder power ground — internally
    connected."`, `Braid: "Cable shield — internally connected at encoder
    housing."` There is **no** separate 24V source routed to `=M1+CAB-B4` in
    block_diagram.yaml (only the single encoder_sincos link), so the encoder
    supply must come from the OPC-PR card — which is **not modeled as a
    component** (this is issue #1, handled by a separate agent). The OPC-PR
    card's encoder connector pinout (signal pins + sensor-supply pins + shield
    terminal) is NOT in any on-disk source (Fuji PG Interface Card manual is
    absent under `datasheets/fuji/`), so the exact landing terminals for
    RD/BU/Braid are **unverified**.
  - Shield note: the SICK part YAML says `Braid: "Shield (connect to housing
    encoder side)"` — i.e. the braid is grounded at the encoder housing (motor
    ground), so the "missing shield" is partly mitigated on the encoder side;
    drive-end (OPC-PR) shield termination is per the PG card manual, unavailable
    on disk.
- **proposed_fix (needs #1 done first):** model the OPC-PR card as an option
  card on `=M1+CAB-T2` with an encoder connector providing:
  - PK (SIN+) / BK (SIN-) / GY (COS+) / GN (COS-) → OPC-PR Sin/Cos inputs
    (repoint the 4 existing `sheet_wires` entries from `-T1 RJ-45` to the OPC-PR
    encoder input);
  - RD (+Us) → OPC-PR encoder supply pin; BU (GND) → OPC-PR GND pin
    (supply level to be confirmed from PG card manual — AFM60S accepts
    4.5–32VDC);
  - Braid → OPC-PR shield terminal (or leave at encoder housing only, per
    SICK).
  Exact terminal names must come from the Fuji PG Interface Card instruction
  manual (to be sourced); do not guess.
- **blocked_on_opc_pr:** TRUE
- **citation:**
  - `LIBRARY/ELECTRIC/library/encoder/motor_encoder_incremental.yaml` —
    power_input `RD`: "function: +Us supply (4.5-32VDC) — Red wire"; `BU`:
    "function: GND — Blue wire"; earth `Braid`: "function: Shield (connect to
    housing encoder side)".
  - `LIBRARY/ELECTRIC/library/datasheets/fuji/fuji_frenic_lm2a.md` (L742) —
    "[RJ-45 connector] Used to connect the keypad to the inverter. The inverter
    supplies the power to the keypad via the extension cable for remote
    operation."
  - `LIBRARY/ELECTRIC/library/datasheets/fuji/fuji_frenic_lm2a_reference_manual.md`
    (L3492) — "5 | Sinusoidal differential voltage 1 Vp-p | SIN/COS (HEIDENHAIN
    ERN1387 or its equivalent) | OPC-PR | Synchronous motor".
  - `MACHINES/urano_e/electronics/wiring/wiring_decisions.yaml` (L655–664) —
    encoder unused-terminal declarations for RD/BU/Braid.

---

## Issue #3 — Frenic input PE unwired

- **verdict:** CONFIRMED
- **root_cause:** The VFD has two PE terminals (input/supply side + motor
  side). The motor-side PE is wired (`sheet_wires.yaml` Motor L42 `-T1 PE →
  -M1 PE`), but the input/supply PE is bonded to nothing: there is no
  `pe_ground` link to `=M1+CAB-T2` in block_diagram.yaml and no PE stub in
  `sheet_wires.yaml`. `wiring_context.yaml` **already specifies** the intended
  bonding (explicit mapping `frenic_lm3_inverter PE(G) → terminal_pe_4mm2
  PE_out` with note "PE direct from VFD to PE bus — NEVER through contactor
  (EN 60204-1 §5.2)"), but it is not implemented in the sheet data.
- **proposed_fix:** add a cross-sheet PE stub on the Motor sheet to the SPD+PE
  branch-PE rail:
  `- ["-T1", "PE", "→SPD + PE (Required)", "PE_out (via -X2)"]`
  where `-X2` = `=P1+CAB-X4` = `terminal_pe_4mm2` (`PE_out` = "PE distribution
  to cabinet components"). Also add the block-diagram link
  `=M1+CAB-T2 → =P1+CAB-X4` type `pe_ground` label "VFD input PE" so the link
  is visible to the wiring pipeline (block_diagram edit → human decision).
  Grounding the input PE terminal also covers the output PE because the two
  terminals are internally common (see citation).
- **blocked_on_opc_pr:** FALSE (blocked on a block_diagram edit, not #1)
- **citation:**
  - `MACHINES/urano_e/electronics/wiring/wiring_context.yaml` (L725–729) —
    `from_part: frenic_lm3_inverter, from_terminal: PE(G), to_part:
    terminal_pe_4mm2, to_terminal: PE_out, note: "PE direct from VFD to PE bus
    — NEVER through contactor (EN 60204-1 §5.2)."`
  - `LIBRARY/ELECTRIC/library/datasheets/fuji/fuji_frenic_lm2a.md` (L717) —
    "The two grounding terminals (G) can be either used for the power supply
    wiring (primary circuit) or motor wiring (secondary circuit). Be sure to
    ground either of the two grounding terminals for safety and noise
    reduction."
  - `LIBRARY/ELECTRIC/library/terminal_pe/terminal_pe_4mm2.yaml` —
    `PE_out`: "function: PE distribution to cabinet components".
  - `MACHINES/urano_e/electronics/wiring/sheet_wires.yaml` Motor — only
    `-T1 PE → -M1 PE`; no input-PE stub.

---

## Issue #4 — X8/BATRY double-fed

- **verdict:** CONFIRMED
- **root_cause:** X8/BATRY is **not** a 24V control-power input. Per the Fuji
  reference manual it is a digital input terminal (X8, multifunction E08)
  whose BATRY function (data=63) tells the inverter it is running from a
  battery/UPS during rescue operation. The actual control-board backup supply
  for this model (FRN0015 = FRN0032-or-less) is the **24V+/24V-** pair; R0/T0
  applies only to FRN0039-or-above and is correctly excluded here.
  - `sheet_wires.yaml` Motor (L62–63) emits **two** stubs on the same terminal:
    `-T1 X8/BATRY → "VFD ctrl 24V (via -F11)"` **and**
    `-T1 X8/BATRY → "BATRY feed (via -K5)"`. Feeding 24V continuously from F11
    would assert BATRY during **normal** operation, which the manual forbids:
    "In the case of normal operation, turn off BATRY. If the main power supply
    is turned ON with BATRY being ON, it could damage the inverter rectifier
    diode due to the inrush current by 73X ON state."
  - block_diagram.yaml has three links around this: F11→T2 power_24VDC "VFD
    control board 24V (X8/BATRY)" (L482), K5→T2 power_230VAC "UPS power (Ch1)"
    (L693), K5→T2 signal_safety "BATRY (X8)" (L706). The F11 link's label
    mis-identifies the destination terminal: the 24V feed must land on 24V+/24V-
    (control-board backup), not X8/BATRY. The K5 "BATRY (X8)" signal link is
    correct (K5 closes only during rescue → asserts BATRY). The K5 "UPS power
    (Ch1)" 230VAC link is the rescue drive power; `wiring_context.yaml` (L711–724)
    routes it to VFD L1/R + L2/S (single-phase 230V) — a separate feed that is
    currently **missing** from `sheet_wires.yaml` (no L1/R/L2/S stubs from K5).
  - Root data defect: the frenic part YAML conflates X8/BATRY (digital input)
    with 24V+/24V- (control-power input) — terminal `X8/BATRY` is documented
    "function: 24V emergency descent / multifunction E08" and the notes even say
    "24VDC on 24V+/24V- powers control board", but **no 24V+/24V- terminals
    exist** in the part YAML / elmt symbol.
- **proposed_fix:**
  - `sheet_wires.yaml` Motor:
    - REMOVE `["-T1", "X8/BATRY", "→24V Distribution - Safety", "VFD ctrl 24V (via -F11)"]`.
    - KEEP `["-T1", "X8/BATRY", "→Emerg. Descent — Safety (K3, K5, K6)", "BATRY feed (via -K5)"]`.
    - ADD the 24V control-board feed to the 24V+/24V- terminals:
      `["-T1", "24V+", "→24V Distribution - Safety", "VFD ctrl 24V (via -F11)"]` and
      `["-T1", "24V-", "→24V Distribution - Safety", "0V / GND (via -X2)"]`.
      (Requires adding `24V+`/`24V-` terminals to `frenic_lm3_inverter` part
      YAML + elmt — library is READ-ONLY, so a library/data edit needs human
      intake.)
    - Optionally add the missing K5→L1/R, L2/S single-phase rescue-feed stubs
      (documented in wiring_context) so the "UPS power (Ch1)" link is emitted.
  - block_diagram.yaml: relabel L482 F11→T2 to "VFD control board 24V
    (+24V/-24V)". The two K5 links ("UPS power (Ch1)", "BATRY (X8)") stay.
- **blocked_on_opc_pr:** FALSE (blocked on a library part-terminal edit, not #1)
- **citation:**
  - `LIBRARY/ELECTRIC/library/datasheets/fuji/fuji_frenic_lm2a_reference_manual.md`
    (L1026) — "Turning this terminal command ON selects operation by
    batteries." (BATRY); (L1870) "(1) BATRY (data = 63) must be assigned to any
    digital input terminal."; (L1872) "(2) A DC voltage (or AC voltage in case
    of using UPS) must be supplied to the main circuit (R-T or S-T).";
    (L1874–1878) "(3) ... Control board supply terminals depend on inverter
    capacity: FRN0032LM2A-4_ or below: +24V/-24V; FRN0039LM2A-4_ or above:
    R0/T0."; (L1948) "(6) In the case of normal operation, turn off BATRY. If
    the main power supply is turned ON with BATRY being ON, it could damage the
    inverter rectifier diode..."
  - `LIBRARY/ELECTRIC/library/datasheets/fuji/fuji_frenic_lm2a.md` (L721) —
    "*1) 24V+,24V-: 200 V class series inverters and 400 V ones of FRN0032 or
    less; R0T0 : 400 V ones of FRN0039 or above."
  - `LIBRARY/ELECTRIC/library/vfd/frenic_lm3_inverter.yaml` — control_digital
    `X8/BATRY`: "function: 24V emergency descent / multifunction E08";
    notes: "**X8 BATRY:** 24VDC on 24V+/24V- powers control board (≤FRN0032)..."
    (part YAML conflates the two).
  - `MACHINES/urano_e/electronics/wiring/sheet_wires.yaml` Motor L62–63 (the two
    X8/BATRY stubs).
  - `MACHINES/urano_e/electronics/wiring/wiring_context.yaml` (L711–724) —
    emergency-descent path: "Single-phase 230V to 400V VFD ... UPS live →
    contactor L1 → T1 → VFD L1/R. UPS neutral → contactor L2 → T2 → VFD L2/S.
    VFD L3/T unused."

---

## Issue #5 — Fault relay only 30B wired

- **verdict:** CONFIRMED
- **root_cause:** The Frenic fault/alarm relay is a 1-C changeover contact
  30A/30B/30C. `sheet_wires.yaml` Motor (L71) emits only
  `-T1 30B → →F-DI #2 "fault relay NC (via -A3e DI32)"`; the relay **common
  30C** is wired to nothing. A dry relay contact with no common return leaves
  the F-DI input floating and un-evaluable. `wiring_context.yaml` already
  specifies the missing common: explicit mapping `frenic_lm3_inverter 30B →
  plc_fdi_module_2 Di15` with note "Fault relay NC — opens on fault. 30C common
  wired to 0V. F-DI 32." — but the 30C→0V wire is not in the sheet data.
- **proposed_fix:** add the 30C common stub to `sheet_wires.yaml` Motor, to the
  0V/GND bus of the 24V-safety distribution:
  `- ["-T1", "30C", "→24V Distribution - Safety", "0V / GND (via -X2)"]`
  where `-X2` = `=C1+CAB-X2` = `terminal_control_gnd` (0V/GND control bus).
  Caveat to confirm with a human: the machine's other potential-free safety
  contacts (phase monitor CO, cell-controller safety relay, fire alarm,
  maintenance selector) use **common → Vs (+24V)** and signal → Di
  (`wiring_context.yaml` explicit), i.e. closed = 24V. wiring_context documents
  30C → **0V** for the VFD fault relay, which is inverted relative to that
  convention and must match the safety program's signal evaluation. The 30B→Di15
  wire itself is correct (module-relative ch 16 = F-DI 32 on `=S1+CAB-A3e`).
- **blocked_on_opc_pr:** FALSE
- **citation:**
  - `MACHINES/urano_e/electronics/wiring/wiring_context.yaml` (L564–569) —
    `from_part: frenic_lm3_inverter, from_terminal: 30B, to_part:
    plc_fdi_module_2, to_terminal: Di15, note: "Fault relay NC — opens on
    fault. 30C common wired to 0V. F-DI 32."`
  - `LIBRARY/ELECTRIC/library/datasheets/fuji/fuji_frenic_lm2a.md` (L742) —
    "[30A/B/C] Alarm relay output (for any error): ... this terminal outputs a
    contact signal (1C) to stop the motor."
  - `LIBRARY/ELECTRIC/library/vfd/frenic_lm3_inverter.yaml` — relay_output
    `30A` "Fault relay NO contact", `30B` "Fault relay NC contact", `30C`
    "Fault relay common" (each rated 250VAC/30VDC, 0.5A).
  - `LIBRARY/ELECTRIC/library/safety_plc/siemens_fdi_16x24vdc.yaml` — `Di15`:
    "function: Safety input channel 16" (module 2 = `=S1+CAB-A3e` handles
    F-DI 17–32 per wiring_context module_mapping).
  - `MACHINES/urano_e/electronics/wiring/sheet_wires.yaml` Motor L71 — only
    30B stub; no 30C entry.

---

## Summary

| Issue | verdict | blocked_on_opc_pr | fixable now |
|-------|---------|-------------------|-------------|
| #2 encoder power/shield | CONFIRMED | TRUE | no (needs #1 OPC-PR card model + PG card manual for pinout) |
| #3 VFD input PE | CONFIRMED | FALSE | yes (sheet_wires stub + block_diagram pe_ground link; wiring_context already specifies PE(G)→PE_out) |
| #4 X8/BATRY double-feed | CONFIRMED | FALSE | yes (move F11 24V to 24V+/24V-; keep K5→X8/BATRY; needs 24V+/24V- terminals added to frenic part — library edit) |
| #5 fault relay 30C | CONFIRMED | FALSE | yes (add 30C→0V stub; confirm 0V-vs-Vs polarity with human) |

All four issues are real. #3/#4/#5 are wire-level fixes with the target
terminals already documented in `wiring_context.yaml`; #2 cannot be completed
until the OPC-PR card is modeled (issue #1) and its encoder pinout is sourced.
