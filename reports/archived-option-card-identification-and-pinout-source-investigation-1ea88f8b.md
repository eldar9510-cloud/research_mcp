---
{
  "format": 1,
  "metadata": {
    "id": "archived-option-card-identification-and-pinout-source-investigation-1ea88f8b",
    "title": "Option card identification and pinout source investigation",
    "question": "What findings, alternatives and limitations does the historical investigation document about Option card identification and pinout source investigation?",
    "scope": "Historical URANO-E machine UPS/wiring/option-card investigation: Option card identification and pinout source investigation. Not a transferable wiring instruction, present installation verification or safety approval.",
    "summary": "Historical machine-specific investigation of Option card identification and pinout source investigation, preserving exact variant/context, claimed evidence and outstanding physical/commissioning limitations.",
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
      "Original report status/context: Status: DONE — pinout recovered from manufacturer/catalog sources. One physical",
      "Machine-specific terminals, variants, operating conditions and physical commissioning were not rechecked for this import; do not transfer findings to another device or machine."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:41.510Z"
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
  "sourceDigest": "1ea88f8ba0ad917d8516a00bfa1ed9fa1efdb3379eb3b3d5b217bb8631def223",
  "proposalRevision": "d762bcdccfd7d4eae297e423c7d25d537b2c632bc66fcd429eb29efe99afef40"
}
---
# OPC-PR PG option card — part number + terminal pinout (recovered from web)

**Date:** 2026-08-22
**Status:** DONE — pinout recovered from manufacturer/catalog sources. One physical
connector-form-factor item remains unconfirmed (flagged under Concerns).

---

## 1. Exact order code / part number

| Card | Order code | Function (verbatim, Fuji Electric Europe) |
|------|-----------|--------------------------------------------|
| Sin/Cos + Sin/Cos-absolute encoder card | **OPC-PR** | "for encoders with SinCos incremental signals and SinCos absolute signals" |
| Sin/Cos + serial-communication card | **OPC-PS** | "for encoders with SinCos incremental signals and serial communication" |
| OPC-PS + Hiperface® protocol | **OPC-PSH** | "for encoders with SinCos incremental signals and serial communication plus Hiperface®protocol" |

- The order code is the bare Fuji option code `OPC-PR` — no extra suffix/MLFB confirmed
  on the official Fuji Electric Europe FRENIC-Lift (FRN-LM2A) product page.
- Firmware requirement (FRENIC-Lift LM2A Instruction Manual, Table 1.1): OPC-PR/PS/PSH
  requires inverter ROM **0300 or later**.
- Encoder-type assignment (LM2A IM, function L01, setting 5): **OPC-PR** =
  "Sinusoidal differential voltage 1 Vp-p" + "SIN/COS (HEIDENHAIN ERN1387 or its
  equivalent)", synchronous motor.

## 2. OPC-PR terminal / connector pinout

Source: **FRENIC-Lift Starting Guide** (Fuji Electric Europe GmbH, SG_LM2A v1.1.0,
14.06.2016), Section 7.3, **Table 7.7 "Required signals and their meaning"** + Figure 7.4.

### 2.1 Encoder INPUT pins (Sin/Cos interface)

| OPC-PR terminal | Encoder signal | Function / signal type |
|-----------------|----------------|------------------------|
| PO              | Up / Up Sensor | Power supply **5 VDC** (±5 %, 200 mA). *Up-Sensor line connected only if encoder cable ≥ 10 m.* |
| CM              | 0 V / 0 V Sensor | Common **0 VDC** (power return). *0V-Sensor line connected only if cable ≥ 10 m.* |
| PA+             | A+             | **Sinus wave (incremental)** — positive |
| PA−             | A−             | **Sinus wave inverted (incremental)** |
| PB+             | B+             | **Cosine wave (incremental)** — 90° shifted |
| PB−             | B−             | **Cosine wave inverted (incremental)** |
| PC+             | C+             | **Sinus wave (absolute)** — rotor position, 1 period/rev |
| PC−             | C−             | **Sinus wave inverted (absolute)** |
| PD+             | D+             | **Cosine wave (absolute)** — 1 period/rev |
| PD−             | D−             | **Cosine wave inverted (absolute)** |

Encoder electrical requirements (Table 7.6):
- Incremental A/B: two sinusoidal signals, **0.6 – 1.2 Vpp**, phase **90° ± 10°**.
- Absolute C/D: two sinusoidal signals, **0.6 – 1.2 Vpp**, phase **90° ± 10°**, one period/rev.
- Resolution: **360 – 60,000 sin/rev (recommended 2,048 sin/rev)**.
- **Max cable length: 20 m**.
- Supply: **5 VDC ±5 %, 200 mA**.

### 2.2 Pulse OUTPUT pins (AB/Z monitor echo to lift controller)

| OPC-PR terminal | Signal | Type / spec |
|-----------------|--------|-------------|
| FA+ / FA−       | A-phase echo | **Line-driver output** (differential) |
| FB+ / FB−       | B-phase echo | Line-driver output |
| FZ+ / FZ−       | Z-phase echo | Line-driver output |

- **Line-driver** type (not open-collector), output voltage **max. 5.25 V**.
- **SW1** on-card switch: dividing-frequency ratio **1/1, 1/2, 1/4, 1/8, 1/16, 1/32, 1/64**.
- Configured by function codes **L201** (AB pulse output rate), **L202** (AB pulse output
  order), **L203** (Z pulse output), **L205** (AB pulse output hysteresis), **L209**
  (Number of ST bits) — all defined "Pulse output (OPC-PR/PS/PSH)" in the FRENIC-Lift
  Reference Manual (INR-SI47-1909).

### 2.3 Shield / wiring rules

- Encoder cable **must always be shielded**; shield connected on **both** inverter side
  and encoder side (ground terminal / dedicated shield glands).
- Signal names/colours may differ by encoder manufacturer (heuristic — always read the
  actual encoder datasheet).

## 3. Variant cards (for completeness)

**OPC-PSH** (Section 7.4, Table 7.8) — "specific board for serial absolute encoders":
- Terminal list: `PO, PO, CM, CM, PA+, PA-, PB+, PB-, CK+, CK-, DT+, DT-`
- Protocols: EnDat 2.1, SSI, BiSS-C, Hiperface®; supply 5 VDC (8 VDC via SW1 for SSI/BiSS).

**OPC-PS** — same as OPC-PSH minus Hiperface® protocol and minus the +8 VDC supply option.

**OPC-LM1-PR** (older FRENIC-Lift LM1 series, distributor doc) — same Sin/Cos input
naming: `P0 (5V), CM, PA+, PA-, PB+, PB-, PC+, PC-, PD+, PD-`, plus open-collector
`FPA/FPB` (max 27 VDC, 50 mA) shaft-copy outputs. Confirms the Sin/Cos terminal naming
is consistent across the FRENIC-Lift PG-card family.

## 4. URANO-E wire-to-terminal mapping (SICK AFM60S → OPC-PR)

For the machine's encoder (SICK AFM60S-S4KS4096, on-disk part
`motor_encoder_incremental`), the Sin/Cos path maps as:

| SICK AFM60S wire | SICK signal | OPC-PR terminal |
|------------------|-------------|-----------------|
| PK (Pink)        | SIN+        | PA+ |
| BK (Black)       | SIN−        | PA− |
| GY (Grey)        | COS+        | PB+ |
| GN (Green)       | COS−        | PB− |
| RD (Red)         | +Us (4.5–32 V) | PO (5 V from OPC-PR) |
| BU (Blue)        | GND         | CM |
| Braid            | Shield      | Shield / ground (both ends) |

Signal-level compatibility confirmed: SICK differential sin/cos = **1 Vpp ±20 %**
(0.8–1.2 Vpp) → inside OPC-PR's 0.6–1.2 Vpp window. SICK power = **0.7 W** (~140 mA at
5 V) → within OPC-PR's 200 mA rating (see Concerns for inrush).

## 5. Citations

1. **Fuji Electric Europe — FRENIC-Lift (FRN-LM2A) product page**, "Built-in option
   cards" list (verbatim OPC-PR / OPC-PS / OPC-PSH wording):
   https://www.fujielectric-europe.com/products/drives-automation/low-voltage-drives/frenic-lift-frn-lm2a
2. **FRENIC-Lift Starting Guide** v1.1.0, 14.06.2016, Fuji Electric Europe GmbH —
   Section 7.3 OPC-PR (Table 7.6 encoder requirements, Table 7.7 terminal table,
   Fig. 7.4); Section 7.4 OPC-PSH (Table 7.8). Via ManualsLib full-text render:
   https://www.manualslib.com/manual/1222837/Fuji-Electric-Frenic-Lift.html?page=17
   (and `?page=18`, `?page=19`). Document version: "SG_LM2A_EN_1.1.0".
3. **FRENIC-Lift LM2A Instruction Manual, INR-SI47-1894-F** (official Fuji Electric
   Europe PDF) — L01 encoder-type table (setting 5 → OPC-PR / SIN/COS ERN1387-equivalent,
   synchronous motor); Table 1.1 ROM versions (OPC-PR/PS/PSH ≥ 0300):
   https://www.fujielectric-europe.com/fileadmin/03_Downloads/03_01_Drives_and_Automation/Low_voltage_Drives/LM2A/English_SI471894F_LM2A_IM_E__3ph_230V_included_.pdf
4. **FRENIC-Lift Reference Manual, INR-SI47-1909-E** — L201–L209 "Pulse output
   (OPC-PR/PS/PSH)" function codes:
   https://manualzz.com/doc/o/9aet9/fuji-electric-frenic-lift-lm2-inverter-reference-manual
5. **ILE "Fuji Frenic Lift Manual"** (distributor, LM1-series cards) — OPC-LM1-PR /
   OPC-LM1-PS1 full terminal tables (confirm Sin/Cos terminal naming family):
   https://sky-elevator.com/uploads/FujiFrenicManual2.pdf (p.8–10)
   and https://www.ilegroup.co.uk/wp-content/uploads/can-x-fuji-frenic-lm1-lm2-manual.pdf
6. **SICK AFS/AFM60S Pro Operating Instructions** (on disk:
   `LIBRARY/ELECTRIC/library/datasheets/sick/sick_afm60s.md`) — Sin/Cos 1 Vpp ±20 %
   differential, power 0.7 W, supply 4.5–32 V, M23/M12/cable options.

## 6. Concerns / gaps

1. **Physical connector form-factor of OPC-PR NOT text-confirmed.** The recovered pinout
   is a labeled terminal set (PO/CM/PA±/PB±/PC±/PD±/FA±/FB±/FZ±) — consistent with a
   pluggable screw-terminal block on the card, but no source text names the physical
   connector (RJ-45 vs terminal block vs D-sub). The existing wiring decision
   (`wiring_decisions.yaml` links `encoder_sincos_*`) labels the OPC-PR encoder connector
   "RJ-45" citing `fuji_frenic_lm2a.md` — but the only RJ-45 in that datasheet is the
   **keypad** RS-485 port, so the "RJ-45 encoder connector" claim appears **misattributed**
   and should be corrected or verified against the actual card/board before sheet generation.
2. **Encoder-type mismatch — absolute rotor-position path absent.** OPC-PR expects C/D
   **sin/cos absolute** (1 period/rev) signals for synchronous-motor rotor position. The
   SICK AFM60S-S4KS4096 provides only SIN/COS incremental + **SSI** absolute (BN/WH/YE/VT,
   currently unused) — it does NOT output C/D sin/cos. The OPC-PR absolute inputs (PC±/PD±)
   will have no corresponding encoder signal. Functionally the drive would run on
   incremental Sin/Cos only; synchronous-motor pole-position would rely on L03
   pole-position auto-tune. Confirm this is the intended design (it may be, given the
   drive supports pole tuning).
3. **Supply inrush.** SICK datasheet: switch-on peak ~2 A @ 4.5 V (< 50 µs), recommends
   limiting supply to 1 A continuous; OPC-PR encoder supply rated 200 mA continuous.
   Steady-state (~140 mA) is fine, but inrush headroom on the OPC-PR supply is not
   documented — verify at commissioning.
4. **Cable length.** OPC-PR allows 20 m, but SICK specifies at 5 V supply the cable
   length is limited (≤ 5–10 m per supply-voltage table for the SSI channel; Sin/Cos path
   is the 20 m Fuji limit). Keep encoder cable short.
5. **Source anchoring.** Table 7.7 was recovered via ManualsLib's OCR text of the
   official Fuji Starting Guide; the OCR interleaves some columns, but two independent
   fetches agree on the full terminal set and meanings. The 300 mA / ±10 % supply figure
   seen in one AI search summary belongs to OPC-PMPG, not OPC-PR (direct OCR: 5 VDC ±5 %,
   200 mA).
6. **Standalone OPC-PR instruction manual not located online.** The dedicated PG-interface
   card manual (typically an INR-SI47-xxxx option-card doc) referenced by the LM2A manuals
   was not findable on the web in this session. The pinout above was instead recovered from
   the official Fuji **FRENIC-Lift Starting Guide** (Section 7.3) which contains the full
   OPC-PR table — a Fuji Electric Europe GmbH publication. If the standalone manual surfaces
   later, re-verify Table 7.7 against it (especially the FA/FB/FZ output spec and connector
   form-factor).
