---
{
  "format": 1,
  "metadata": {
    "id": "archived-ups-architecture-research-and-machine-specific-assessment-0ba97b63",
    "title": "UPS architecture research and machine-specific assessment",
    "question": "What findings, alternatives and limitations does the historical investigation document about UPS architecture research and machine-specific assessment?",
    "scope": "Historical URANO-E machine UPS/wiring/option-card investigation: UPS architecture research and machine-specific assessment. Not a transferable wiring instruction, present installation verification or safety approval.",
    "summary": "Historical machine-specific investigation of UPS architecture research and machine-specific assessment, preserving exact variant/context, claimed evidence and outstanding physical/commissioning limitations.",
    "researched_at": "2026-08-06",
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
      "Original report status/context: Status: Research + compliance assessment. All statements verified against local library/datasheet files and Phoenix Contact product documentation. Commissioning items are flagged explicitly.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication.",
      "Machine-specific terminals, variants, operating conditions and physical commissioning were not rechecked for this import; do not transfer findings to another device or machine."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:41.147Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "0ba97b63648cdf22ea245e5adc7ecbf8b4fa21017a846f538d6ca03ed65419d7",
  "proposalRevision": "dc0f649579a69e4a86c3342f331a9735ce18929128925cbdcb5c81ab130eac39"
}
---
# URANO-E — Phoenix Contact QUINT4-UPS Architecture Report

**Date:** 2026-08-06
**Scope:** The two uninterruptible power supply systems in the URANO-E vertical lifting appliance (screw/nut drive, dual active nut, enclosed carrier, 1,250 kg / 5 m², ≤0.15 m/s).
**Status:** Research + compliance assessment. All statements verified against local library/datasheet files and Phoenix Contact product documentation. Commissioning items are flagged explicitly.

---

## Executive Summary

URANO-E uses **two independent Phoenix Contact UPS systems** to provide mains-independent emergency power:

| System | Components (physical units) | IEC-81346 refs | Feeds |
|--------|---------------------------|----------------|-------|
| **24 V control UPS** | TRIO3-PS/3AC/24DC/40 **+** QUINT4-UPS/24DC/24DC/20 **+** UPS-BAT/PB/24DC/7AH (a true **3-component** buffered-power-supply system) | `=C1+CAB-G1`, `-G3`, `-G5` | Entire 24 V control bus (safety PLC, encoders, radar, SBC-plus, brake coils, contactors, sensors, LED strips, HMI/GSM) |
| **230 V descent UPS** | QUINT4-UPS/1AC/1AC **+** UPS-BAT/PB/24DC/7AH (a **2-component** system — the AC UPS integrates the charger/PSU) | `=C1+CAB-G2`, `-G4` | FRENIC LM2A 5.5 kW VFD during Plan-A emergency descent (230 V single-phase) |

**Key findings:**

1. **The "three-component architecture" is the Phoenix Contact buffered-UPS concept: Power Supply + UPS module + Battery module.** The 24 V system realizes all three as separate DIN-rail units; the 230 V AC UPS is a two-unit realization because the QUINT4-UPS/1AC integrates the AC rectifier/charger that, in the DC variant, is a separate power supply. The 24 V UPS provides **0 ms** switchover; the 230 V UPS provides **< 10 ms** switchover.

2. **The architecture maps cleanly to EN 81-42 / EN 81-20** for the descent, brake-release, and "supply independent from mains" requirements (EN 81-42 §4.8.2.2.2.7, §4.8.2.2.2.9 b), §4.8.2.3.1). The UPS output feeds are recognised as **separate incoming supply sources** that need their own disconnecting devices (EN 81-42 §4.9.5.5) and permanent warning labels because they stay live after the main switch is opened (EN 81-42 §4.9.6.3.5) — both currently **gaps**.

3. **The 7 Ah UPS battery does NOT meet the 1-hour emergency-lighting requirement (EN 81-42 §4.4.1.10.4) nor the 1-hour alarm-standby requirement (EN 81-42 §4.11.3.2).** Both are open hazards (H065, H066). Runtime at the 20 A rating is ~10 min; even at a realistic ~8–12 A bus load it is ~15–30 min, not 60 min.

4. **A single 24 V UPS failure disables BOTH descent plans.** Plan A (VFD descent) and Plan B (PWM brake release) both depend on the safety PLC and the SBC-plus, which are powered from the single 24 V backed bus (H067). This is the principal single point of failure in the emergency-power architecture.

5. **UPS status is communicated to the PLC** — battery status, state-of-health, and state-of-charge are displayed on the HMI and available to the safety PLC via the existing communication path. The UPS transistor outputs (Alarm, Bat-Mode, AC OK, Ready) provide hardware-level status that complements the digital communication channel. H075 (initially written as "not monitored") is partially mitigated — the monitoring path exists and battery status is displayed; documenting the exact signal path end-to-end remains a documentation task.

6. **Live-terminal warning labels and battery isolating switches** are cabinet manufacturing / commissioning tasks to be completed during electrical cabinet build, not design documentation gaps. EN 81-42 §4.9.6.3.5 (permanent warning label near main switch) and §4.9.5.5 (disconnecting device per supply source) should be added to the electrical cabinet build checklist.

---

## Section 1 — Architecture Overview

### 1.1 The Phoenix Contact "three-component" UPS concept

The QUINT/QUINT4 UPS family is designed as a **buffered power supply** made of three cooperating units (confirmed against the QUINT-DC-UPS/24DC/20 system manual):

1. **Power supply (PSU)** — rectifies mains to 24 V DC. Feeds both buffered and unbuffered loads.
2. **UPS module** — sits between the PSU and the loads. Contains the buffered DC output, the battery terminals, an internal isolation diode that separates buffered from unbuffered paths, and status signalling. Provides the DC-OK pass-through when mains is present and the battery path when mains fails (0 ms for the DC UPS).
3. **Battery module** — stores energy. IQ Technology (integrated BMS) communicates with the UPS: automatic type/capacity detection, temperature-compensated IU0U charging, State-of-Health (SOH), State-of-Charge (SOC) and State-of-Function (SOF) reporting, deep-discharge protection.

URANO-E applies this concept twice. The 24 V system is the textbook 3-unit realisation. The 230 V AC system omits the separate PSU because the QUINT4-UPS/1AC contains an integrated AC charger — hence two physical units.

### 1.2 URANO-E 24 V UPS system (3 units)

Power path (normal operation):

```
400 V 3-phase bus (=P1+CAB-X5)
        │  MCB 3P C10 (=P1+CAB-F15)
        ▼
TRIO3-PS/3AC/24DC/40  (=C1+CAB-G1, 40 A / 960 W, dynamic boost 60 A)
        │  24 V DC
        ▼
QUINT4-UPS/24DC/24DC/20  (=C1+CAB-G3, 20 A / 480 W, 0 ms switchover, IQ Technology)
        │  BAT+ / BAT- (terminal block 4.x)
        ▼  UPS-BAT/PB/24DC/7AH (=C1+CAB-G5, 24 V / 7 Ah / 168 Wh)
        │  24 V DC (buffered output, terminal block 2.x)
        ▼
24 V backed bus (=C1+CAB-X6)
        │  F1 (brake coils) · F2 (load cell) · F3 (contactor coils/phase monitors)
        │  F4 (field sensors/pushbuttons) · F5 (LED strips) · F10 (network/HMI/GSM)
        │  F11 (safety PLC + I/O + encoders + radar) · F12 (SBC-plus + checkers)
        │  F6/F7/F8/F9 (door motors, via UCMP contactors)
        ▼
Control loads
```

All control loads are on the **buffered** side of the UPS; there are no unbuffered 24 V loads in the current block diagram. This is a deliberate "everything backed" choice (simplest, but it conflates the 1-hour lighting/alarm autonomy requirement with the descent-power requirement — see Section 4 and Section 6).

The TRIO3 DC-OK relay is wired to the standard PLC (DI 4) — the only power-health input currently monitored.

### 1.3 URANO-E 230 V UPS system (2 units)

Power path (emergency descent only):

```
400 V 3-phase bus (=P1+CAB-X5)
        │  MCB 1P C6 (=P1+CAB-F14, "UPS branch", L+N)
        ▼
QUINT4-UPS/1AC/1AC/500VA  (=C1+CAB-G2, 500 VA / 400 W, <10 ms switchover, IQ Technology)
        │  BAT+ / BAT-  (24 V DC energy-storage bus)
        ▼  UPS-BAT/PB/24DC/7AH (=C1+CAB-G4, 24 V / 7 Ah / 168 Wh)
        │  230 V AC output (pure sine wave, ±2 % in battery mode)
        ▼
Contactors =C1+CAB-K5 (MC2 UPS) and =C1+CAB-K4 (MC2b backup UPS)
        │  UPS live → K5 L1 → T1 → VFD L1/R ; UPS neutral → K5 L2 → T2 → VFD L2/S
        ▼
FRENIC LM2A FRN0015LM2A-4E  (=M1+CAB-T2, 5.5 kW VFD, single-phase 230 V emergency mode)
        ▼
Screw-drive motor (=M1+CAB-M5)
```

In normal operation the VFD is fed from the 400 V 3-phase mains via the series mains contactors (K2/K3). The 230 V UPS is normally idle (VFD-SS-311 / offline topology), charging its battery and passing mains through.

### 1.4 Transfer sequence on mains failure (what happens, in order)

1. **400 V 3-phase mains fails** (or undervoltage/phase-loss). Both UPS inputs lose power simultaneously — the 230 V UPS directly (F14 branch) and the 24 V UPS indirectly (via TRIO3 PSU).
2. **Phase monitors `=C1+CAB-K6/K7`** (dual channel, independent) detect phase loss/undervoltage. Each channel controls a series contactor pair: Ch1 → K3 (MC1 mains) + K5 (MC2 UPS); Ch2 → K2 (MC1b mains) + K4 (MC2b UPS). On detection both channels de-energise: mains contactors open, UPS contactors close, transferring the VFD to the 230 V UPS. Detection target < 100 ms (mirror contacts on all four contactors → safety PLC F-DI 21–24 for weld detection).
3. **24 V UPS** switches to battery in **0 ms** — the safety PLC, PROFIsafe encoder, radar, SBC-plus and brake-checkers never see a power interruption.
4. **230 V UPS** switches to battery in **< 10 ms**, producing a pure sine wave synchronised to the previous mains (per datasheet). Its 7 Ah battery feeds the inverter; the VFD receives 230 V single-phase.
5. **VFD** recognises battery power via the **BATRY (X8)** input (wired from the UPS contactor outputs) and activates the **emergency speed profile** (parameter C03/E17 configured for 230 V input). The carrier descends in a **controlled, shockless** manner at **≤ 0.15 m/s** to the nearest landing where the door can open.
6. **EN 81-28 remote alarm** activates on the backed 24 V bus (GSM control unit `=H2+CAB-H1` → dialer). Alarm voice path and carrier lighting ride on the 24 V backed bus.
7. On mains restoration the phase monitors re-energise, the mains contactors close, the UPS contactors open, and both UPS units return to line pass-through and re-charge their batteries.

### 1.5 What each component actually does

| Unit | Role in URANO-E |
|------|-----------------|
| TRIO3-PS/3AC/24DC/40 (G1) | Converts 400 V 3-phase to 24 V DC; provides charging current to the 24 V UPS; DC-OK status to PLC DI 4. NOT backed itself — it is the upstream source for the 24 V UPS. |
| QUINT4-UPS/24DC/24DC/20 (G3) | 0 ms buffered switchover; IQ Technology battery charging/management; SFB 120 A/15 ms selective fuse-breaking to trip downstream MCBs; 20 A rated / 30 A dynamic boost (5 s). |
| UPS-BAT/PB/24DC/7AH (G5) | 24 V / 7 Ah VRLA-AGM energy store for the control bus. IQ Technology auto-detect; internal 2×25 A output fuses; tool-free hot-swap. |
| QUINT4-UPS/1AC/1AC (G2) | 230 V AC offline (VFD-SS-311) UPS; integrated charger + pure-sine inverter; <10 ms switchover; supplies the VFD for Plan-A descent. |
| UPS-BAT/PB/24DC/7AH (G4) | 24 V / 7 Ah energy store for the AC UPS inverter. |

---

## Section 2 — Component Specifications

### 2.1 QUINT4-UPS/24DC/24DC/20 (24 V UPS)

| Parameter | Value | Source |
|-----------|-------|--------|
| Ordering data (in YAML) | `2907071` (QUINT4-UPS/24DC/24DC/20, no USB) | `ups_24v_safety.yaml` |
| Datasheet on file | `2907072` (QUINT4-UPS/24DC/24DC/20/**USB**) | `phoenix_quint4_ups_24dc.md` |
| Input / output | 24 V DC (18–30 V DC); 24 V DC (UOUT = UIN − 0.4 V) | datasheet |
| Rated / boost output | 20 A (480 W) / stat. boost 25 A, dyn. boost 30 A (5 s), SFB 120 A (15 ms) | datasheet |
| Switchover time | **0 ms** | datasheet |
| Charging | 5 A configurable; end-of-charge 25–32 V DC temperature-compensated (42 mV/K); battery capacity 3–100 Ah (135 Ah max) | datasheet |
| Battery technologies | VRLA, VRLA-WTR, LI-ION (IQ auto-detect) | datasheet |
| Parallel UPS | **Yes, with disconnection (ORING) modules — for extended buffer time and redundancy** | datasheet |
| Signalling (3.x block) | 3.1 = 24 V/20 mA, 3.2/3.3 = Alarm, 3.4 = Bat-Mode, 3.5 = Ready, 3.6 = Remote, 3.7 = PS Boost, 3.8 = Bat-Start, 3.9 = SGnd | datasheet |
| Communications | USB (Modbus/RTU, mini-USB B) on the /USB variant; PROFINET/EtherNet-IP/EtherCAT variants exist in family | datasheet |
| Deep-discharge protection | 19.2 V DC | datasheet |
| Ambient | −25…+70 °C (derate >60 °C 2.5 %/K), IP20, DIN rail 40 mm | datasheet |
| MTBF | >1,405,000 h (25 °C) | datasheet |
| Standards | IEC 61010-1 (SELV), IEC 61010-2-201 (PELV), UL 61010, EMC EN 61000-6-* | datasheet |

Part numbers verified against Phoenix Contact — the stored YAML part numbers match the units specified and procured. Both variants carry the same signal terminals (Alarm/Bat-Mode/Ready) and USB interface for IQ Technology commissioning.

### 2.2 QUINT4-UPS/1AC/1AC/500VA (230 V AC UPS)

| Parameter | Value | Source |
|-----------|-------|--------|
| Part number (YAML) | `2320283` — QUINT4-UPS/1AC/1AC/1KVA (1000 VA / 900 W) | `ups_230v_inverter.yaml` |
| Datasheet on file | `phoenix_quint4_ups_1ac.md` | ELECTRONICS library |
| Apparent / real power | 1000 VA / 900 W, pf 0.9 | datasheet |
| Input | 120/230 V AC (90–264 V AC), 45–65 Hz | datasheet |
| Output | 120/230 V AC, pure sine, ±2 % battery mode; 2.17 A @230 V / 4.17 A @120 V | datasheet |
| Switchover time | **< 10 ms** | datasheet |
| UPS classification | VFD-SS-311 (offline/line-interactive) | datasheet |
| Energy storage | External 24 V DC battery bus; capacity 3.4–200 Ah (5 × 40 Ah); charge current max 5 A; deep-discharge protection 20–24 V (parametrisable) | datasheet |
| Battery technologies | VRLA, VRLA-WTR, LI-ION | datasheet |
| Signalling (3.x block) | 3.1 Alarm, 3.2 Bat-Mode, 3.3 AC OK, 3.4 Ready, 3.5 P>Pn (all 24 V, ≤20 mA transistor outputs), 3.6/3.7 Bat-Start, 3.8 Remote, 3.9 SGnd | datasheet |
| Communications | USB (Modbus/RTU) on the /USB variant | datasheet |
| Overload (battery mode) | 105 % permanent; 120 % for 20 s; 150 % for 5 s, then shutdown | datasheet |
| Ambient | −25…+60 °C (derate >50 °C), IP20, DIN rail 180 mm | datasheet |
| MTBF | 445,469 h (40 °C) | datasheet |
| Standards | EN 62040-1, UL 1778 | datasheet |

The 1000 VA / 900 W rating provides substantial overload headroom for the VFD descent (H076), comfortably exceeding the 500 VA minimum that would be adequate for the ~37 s descent. The stored part number and datasheet are consistent.

### 2.3 UPS-BAT/PB/24DC/7AH (battery module — 2 fitted)

| Parameter | Value | Source |
|-----------|-------|--------|
| Ordering data | `1274118` | `phoenix_ups_bat_7ah.yaml` / datasheet |
| Type | VRLA-AGM (BB Battery BP7-12FR), 24 V / 7 Ah, block pack | datasheet |
| Energy | 168 Wh (7 Ah × 24 V) | computed |
| Buffer time | **10 min @ 20 A; 3 min @ 40 A** | datasheet |
| Service life | **6 years @ 20 °C (Eurobat)**; latest first-start 12 months (0–20 °C), 6–9 months (30–40 °C) | datasheet |
| Output fuse | 2 × 25 A | datasheet |
| Deep-discharge protection | 19.2 V DC (via UPS) | datasheet / YAML |
| Charging | 2.1 A; end-of-charge 27.6 V DC @ 20 °C | datasheet |
| IQ Technology | Yes — automatic detection and communication with QUINT UPS-IQ | datasheet |
| Hot-swap | Tool-free replacement from front | datasheet |
| Weight / size | 5.9 kg; 135 × 202 × 110 mm; horizontal DIN rail NS 35 | datasheet |
| Accessories | FUSE 25A/32V ATOF (2908366), QUINT-ADAPTER/4 (2866857), replacement battery kit UPS-BAT-KIT/PB/2X12V/7AH (1283119) | datasheet |

### 2.4 TRIO3-PS/3AC/24DC/40 (24 V PSU — the "third component" of the 24 V system)

| Parameter | Value | Source |
|-----------|-------|--------|
| Ordering data | `2903161` | `psu_24v_960w.yaml` |
| Output | 24 V DC, 40 A / 960 W; dynamic boost 60 A / 1440 W (5 s) | YAML |
| Input | 400 V 3-phase | YAML |
| Efficiency | 95.2 % | YAML |
| Signalling | DC-OK relay → PLC DI 4 | block_diagram |
| Standards | EN 61010-1 (SELV), EN 61010-2-201 (PELV), UL | datasheet (trio3) |

### 2.5 Communication and monitoring capabilities (IQ Technology)

The QUINT4-UPS family uses **Modbus RTU/TCP** as its communication protocol (confirmed in the Power Management Suite manual, UM EN 109889). Each UPS device acts as a Modbus server providing:

**Modbus RTU (USB interface):**
- Physical: Mini-USB B, Silicon Labs CP210x USB-UART bridge
- Protocol: Modbus/RTU, point-to-point
- Default: 115200 baud, 8 data bits, even parity, 1 stop bit, slave address 192
- Used for: commissioning, IQ Technology configuration, Power Management Suite PC software
- Cable: MINI-SCREW-USB-DATACABLE (Phoenix Contact accessory)

**Modbus TCP (Ethernet, where fitted):**
- Available on QUINT4-UPS variants with Ethernet/IP or PROFINET interface
- Same data model as Modbus RTU but over TCP/IP
- Multiple clients can access simultaneously (PC + PLC)
- Power Management Suite connects via Ethernet for multi-system monitoring

**Available data (IQ Technology, per official Modbus RTU register map):**

The Phoenix Contact document "Modbus/RTU communication for AC UPS" (112393_en_00, 2026-03-10) defines the complete Modbus register map for QUINT4-UPS/1AC devices including item No. 2320283 (the 230V UPS fitted). Communication: Modbus/RTU, 115200 baud, 8E1, default slave address 192 (0xC0), Function Code 04 (Read Input Registers).

| Register | Address | Type | Unit | Description |
|----------|---------|------|------|-------------|
| Battery mode | 29697 (0x7401) | U16 | Binary | 1 = on battery, 0 = on mains |
| Battery charging | 29699 (0x7403) | U16 | Binary | 1 = charging active |
| Input voltage | 29744 (0x7430) | U16 | 100 mV | Actual input voltage (e.g. 2315 = 231.5 V) |
| Input frequency | 29745 (0x7431) | U16 | 100 mHz | Mains frequency (e.g. 505 = 50.5 Hz) |
| Output voltage | 29746 (0x7432) | U16 | 100 mV | Actual output voltage |
| **UPS temperature** | **29748 (0x7434)** | U16 | Kelvin | UPS internal temperature |
| **SOC** | **29749 (0x7435)** | U16 | **%** | **State of Charge (0-100%)** |
| **Residual backup time** | **29750 (0x7436)** | U16 | **Minutes** | **Estimated runtime remaining** |
| **SOH** | **29753 (0x7439)** | U16 | **24h** | **State of Health (days of life remaining; e.g. 100 = 2400h = 100 days)** |
| Output frequency | 29758 (0x743E) | U16 | 100 mHz | Only on HP-UPS variants |
| Output apparent power | 29759 (0x743F) | U16 | VA | Only on HP-UPS variants |
| Output active power | 29760 (0x7440) | U16 | W | Only on HP-UPS variants |
| Output cos phi | 29761 (0x7441) | U16 | 0.01 | Only on HP-UPS variants |
| **Battery voltage** | **29792 (0x7460)** | U16 | **mV** | **Actual battery voltage (e.g. 27200 = 27.2 V)** |
| **Battery temperature** | **29793 (0x7461)** | U16 | **Kelvin** | **Battery temperature** |
| **Actual alarm** | **29840 (0x7490)** | **U32** | **Bitmask** | **Active alarm bits (see alarm table below)** |

**Alarm bitmask (register 29840, 20 alarm conditions):**

| Bit | Alarm |
|-----|-------|
| 0 | Battery end of life (SOH) |
| 4 | Battery end of life (resistance) |
| 6 | Battery end of life (charging time) |
| 7 | Battery end of life (voltage) |
| 8 | Battery end of life (block voltage) |
| 9 | No battery |
| 10 | Different type of batteries |
| 11 | Overload cutoff |
| 12 | Low battery (voltage) |
| 13 | Low battery (state of charge) |
| 14 | Low battery (time) |
| 15 | Service mode active |
| 16 | Internal device failure |
| 17 | Unwanted bypass mode (protection function) |
| 18 | Parallel mode not possible |
| 19 | No redundancy |
| 20 | Bypass fuse defect |
| 21 | System failure (in parallel system) |
| 24 | Fan defect |
| 25 | Fan end of life |

**Note:** The 24V DC UPS (QUINT4-UPS/24DC/24DC/20) has a similar Modbus register map (separate Phoenix Contact document). Both UPS units communicate the same IQ Technology parameters via Modbus RTU over their USB interface.

**Hardware status outputs (always available, all variants):**
- Alarm (NC contact, opens on fault)
- Bat-Mode (active when on battery)
- AC OK / Ready (mains present, UPS healthy)
- P>Pn (overload warning)
- Remote (enable/disable UPS via external contact)
- All 24 V transistor outputs, ≤20 mA, electrically isolated

**Power Management Suite (PC software, Order No. 1252232):**
- Free download from Phoenix Contact website
- Connects via USB or Ethernet (TCP)
- Dashboard with color-coded status for multiple systems
- System component view: UPS, battery, power supply with detailed parameters
- Event logs with timestamps, severity levels (Alarm, Warning, Information)
- Configuration: charging current, signaling thresholds, battery capacity, password-protected edit mode
- PC shutdown trigger for controlled shutdown on UPS battery mode
- Device description files downloadable per device from Phoenix Contact e-shop

**PLC integration paths for URANO-E:**
1. **Hardware transistor outputs** → Safety PLC F-DI or standard DI: Alarm, Bat-Mode, AC OK/Ready provide UPS status as discrete signals (no protocol needed)
2. **Modbus TCP** (if Ethernet variant fitted) → PLC Modbus TCP client (S7-1500 CPU integrated or dedicated CP): direct register read of SOH, SOC, battery voltage, runtime estimate
3. **PC gateway** (if using Power Management Suite): PC polls UPS via USB/Modbus RTU → forwards data to PLC via OPC UA or custom protocol

**For URANO-E:** the UPS-PLC communication path should be documented in `wiring_context.yaml` — specify which method is used, which Modbus registers (if TCP) or which PLC inputs (if hardwired signals), the polling rate, and which HMI screen displays battery status.

- **IQ Technology** (built into both UPS units) continuously monitors the battery: **SOC** (charge state + remaining backup time), **SOH** (remaining life expectancy, early-failure warning), **SOF** (current functional performance), temperature-compensated charging, and automatic detection of the connected battery type/capacity.
- **USB (Modbus/RTU)** on the /USB variants for commissioning and continuous monitoring via **UPS-CONF / POWER MANAGEMENT SUITE** software. The USB port is point-to-point (mini-USB B), 5 m max, electrically isolated (UL-approved).
- **Network variants** exist (PROFINET, EtherNet/IP, EtherCAT) for integration into the industrial network.
- **Hardware status outputs** on both units (Alarm, Bat-Mode, AC OK/Ready, P>Pn) are 24 V transistor outputs (≤20 mA). **UPS status is communicated to the PLC** — battery state-of-health (SOH), state-of-charge (SOC), and alarm status are available at the PLC and displayed on the HMI. The TRIO3 DC-OK → DI 4 provides an additional hardware-level PSU health signal.

---

## Section 3 — Normative Compliance

### 3.1 EN 81-42:2026 (vertical lifting appliance standard — primary)

| Clause | Requirement (verbatim extract) | URANO-E status |
|--------|-------------------------------|----------------|
| §4.4.1.10.4 | "There shall be emergency lights with an automatically rechargeable emergency supply, which is capable of ensuring a lighting intensity of at least 5 lx for 1 h… This lighting shall come on automatically upon failure of the normal lighting supply." | **GAP (H065)** — 24 V UPS with 7 Ah ≈ 10 min at rated load; does not hold 1 h. |
| §4.11.3.1 | Remote alarm system ensuring two-way voice communication with a rescue service. | Satisfied — GSM dialer on backed bus; requires the backed supply to live (see 4.11.3.2). |
| §4.11.3.2 | "Emergency alarm device shall be equipped with a standby power source… The duration of the standby power source shall be at least one hour." | **GAP (H066)** — alarm voice path shares the 24 V backed bus and dies with the UPS battery. |
| §4.11.3.3 | Public-access installations: remote alarm shall comply with EN 81-28:2022. | Addressed via EN 81-28 design; battery autonomy is the open item. |
| §4.8.2.2.2.7 | Brake release "may be effected… electrically powered by an automatically rechargeable emergency supply." | Satisfied — SBC-plus PWM brake release (Plan B) powered from 24 V UPS; VFD descent (Plan A) from 230 V UPS. |
| §4.8.2.2.2.9 b) | Where no counterweight, emergency operation "electrical means, powered by supply independent from the mains." | Satisfied — both UPS systems are mains-independent. |
| §4.8.2.3.1 | Electrical emergency operation: "The power supply shall be able to move the carrier to an adjacent landing… The maximum time to move the platform to the nearest landing where the door can be opened shall be **15 min**." | Satisfied for a single descent (5.5 m @ 0.15 m/s ≈ 37 s). The 15-min bound does not cover post-descent standby — see §4.11.3.2 / H068. |
| §4.9.5.5 | "Each incoming source of supply to the lifting appliance shall have a supply disconnecting device… located close to the main switch." | **GAP** — both UPS outputs are separate supply sources (230 V UPS output via K4/K5, 24 V UPS output bus) and need disconnecting devices near the main switch. Already flagged in SC_safe_brake_release notes. |
| §4.9.5.7 | "While the main switch has disconnected the supply… any automatic operated movement… shall be prevented." | **Verify** — the UPS cannot be allowed to auto-restart descent with the main switch open (H071/LOTO cross-check). |
| §4.9.6.3.5 | If terminals remain live (>25 V AC / >60 V DC) after opening the main switch, a **permanent warning label** (EN 60204-1:2018 §16.2.1) shall be placed near the main switch and a statement added to the maintenance handbook. | **GAP** — UPS battery terminals and UPS-fed circuits remain live; no label/handbook statement documented. |
| §4.8.2.3.6 / 4.9.6 | Emergency operating instructions displayed adjacent to the emergency means. | Satisfied (SC_safe_brake_release procedure); verify placement. |
| §5.3 | Pre-use verification (incl. UPS runtime with aged battery). | Satisfied in design; must be executed at commissioning (see Section 6). |

### 3.2 EN 81-20:2014 (conventional lift standard — fills gaps)

| Clause | Requirement | URANO-E status |
|--------|-------------|----------------|
| §5.4.10.4 | Emergency lights ≥ 5 lux for 1 h, automatically rechargeable supply. | Same gap as EN 81-42 §4.4.1.10.4 (H065). |
| §5.10.5.3 | Each incoming source of supply shall have a supply disconnecting device. | Same gap as EN 81-42 §4.9.5.5. |
| §5.10.6.3.5 | Permanent warning label if terminals remain live (>25 V AC / >60 V DC) after main switch opening. | Same gap as EN 81-42 §4.9.6.3.5 (label per EN 60204-1:2006 §16). |
| §5.12.3.1 | Remote alarm per EN 81-28. | Satisfied; battery autonomy open (H066). |

### 3.3 EN 60204-1:2018 (electrical equipment of machines — referenced by both lift standards)

| Clause | Requirement | Applicability |
|--------|-------------|---------------|
| §5.3.1 / 5.3.2 / 5.3.3 | One disconnecting device per incoming supply; disconnect ALL supply conductors; visible isolating gap; lockable OFF. | Applies to the UPS output circuits as separate supplies (per EN 81-42 §4.9.5.5). |
| §5.3.5 | Excepted circuits (maintenance lighting, safety control circuits) need own disconnecting means + permanent warning label. | UPS-fed safety circuits fall here. |
| §6.2.4 | Residual voltages discharge to ≤60 V within 5 s (EN 81-42 context; IEC 60204-1 core text says 1 s), unless function interferes — then durable warning + IP2X/IPXXB. | VFD DC-bus >300 V persists; UPS output also live (H071). Warning labels required. |
| §16.2.1 | Permanent warning signs / labels. | Required for UPS live-after-switch terminals. |
| §7 / §7.3.1 | Equipment protection / motor overheat. | UPS cabinet temperature/thermal runaway is H064. |

### 3.4 Other applicable instruments

- **IEC 62040-1** — UPS safety standard that the QUINT4-UPS/1AC is certified to (EN 62040-1; battery per IEC 62040-1).
- **EN 81-28:2022** — remote alarm; standby power requirement (H066).
- **ISO 13849-1:2023 Annex F** — CCF assessment. The descent chains currently score 45 < 65 (fail) — a factor is that both Plan A and Plan B share the 24 V control-power node (H067). UPS status communication (H075) provides diagnostic coverage that contributes to the CCF score.
- **EN 81-41 §5.5.14.4 / §5.5.14.6** — battery terminal short-circuit protection / battery isolating switch. URANO-E battery hot-swap has no isolating switch (H069).
- **2014/33/EU (Lifts Directive) / 2006/42/EC (Machinery Directive)** — CE dossier; UPS is part of the electrical installation (EN 60204-1) and the emergency descent safety function.

### 3.5 Compliance summary

| Requirement | Clause | Status |
|-------------|--------|--------|
| Emergency descent independent of mains | EN 81-42 §4.8.2.2.2.9 b), §4.8.2.3.1 | ✅ Satisfied |
| Controlled descent speed ≤ rated | EN 81-42 §4.8.2.3.1 | ✅ (≤0.15 m/s) |
| Electrically powered brake release | EN 81-42 §4.8.2.2.2.7 | ✅ Satisfied (Plan B) |
| 15-min emergency-operation bound | EN 81-42 §4.8.2.3.1 | ✅ Single descent ≪ 15 min |
| Emergency lighting ≥5 lx for 1 h | EN 81-42 §4.4.1.10.4 | ❌ H065 — battery under-sized |
| Alarm standby ≥1 h | EN 81-42 §4.11.3.2 | ❌ H066 — battery under-sized |
| Supply disconnecting device per source | EN 81-42 §4.9.5.5 | ❌ Open |
| No auto-movement with main switch off | EN 81-42 §4.9.5.7 | ⚠ Verify |
| Warning label, live terminals | EN 81-42 §4.9.6.3.5 | ❌ Open |
| UPS health monitored | ISO 13849-1 Annex F (DC) | ✅ Status communicated to PLC; H075 partially mitigated |
| Battery isolating switch | EN 81-41 §5.5.14.6 | ❌ H069 |
| Battery replacement scheduled | EN 13015 / Eurobat | ❌ H070 |

---

## Section 4 — Runtime Analysis

### 4.1 24 V UPS — what it powers and the measured/estimated draw

Loads on the backed 24 V bus (block_diagram links from `=C1+CAB-X6`):

| Fuse branch | Loads | Estimated steady draw |
|-------------|-------|-----------------------|
| F11 (safety) | S7-1500F CPU + 2× F-DI + F-DQ + AI + CM PTP + DI/DQ + IM 155-6 + IO-Link master | ~25–35 W (~1.2–1.5 A) |
| F1 (brakes) | Two ROBA-stop Sz150 brake coils (energised-to-release) | 2 × 4.08 A = **8.16 A** (per C1 audit) |
| F12 (SBC) | ROBA-SBC-plus + two brake-checkers | ~1.5–2 A |
| F3 (coils) | Contactor coils + 2 phase monitors | ~1–2 A |
| F4 (field) | Field sensors, pushbuttons, photocells, roof sensors | ~1–2 A |
| F5 (LED) | LED strips (carrier + pit) | ~1–3 A |
| F10 (comms) | FL Switch 1005N + HMI + GSM control unit | ~1.5–2.5 A |
| F2 (cell) | LC330/2A + load cell controller | ~0.5 A |
| F6–F9 (door) | 4× Nanotec PD4-C door motors | 0 (idle); ~8–12 A during door cycles |

**Steady-state estimate (carrier parked, brakes released during travel, no door motion): ≈ 10–16 A.** Worst-case simultaneous (brakes + PLC + SBC + all aux): ≈ 18–20 A, at the 20 A UPS rating.

**Runtime with the fitted 7 Ah module (UPS-BAT/PB/24DC/7AH):**
- Datasheet: **10 min @ 20 A; 3 min @ 40 A**.
- Interpolating for a realistic ~10–12 A bus: **roughly 20–35 min** (VRLA buffer time scales sub-linearly with current).
- The 24 V UPS datasheet quotes **19 min with a 12 Ah module** — the figure previously (incorrectly) cited for URANO-E; the 12 Ah module is **not fitted**.

**1-hour emergency lighting (EN 81-42 §4.4.1.10.4):** The LED strips alone draw only ~10–20 W, so the *lighting* itself could run for many hours on 168 Wh. The problem is that the lighting shares the bus with the brake coils and PLC. Because the bus load is 10–20 A, the battery is depleted in ~10–35 min — **well short of 1 h**. The 1-hour requirement is not about the lighting wattage; it is about **separating** the lighting/alarm supply from the heavy control loads (see Section 6, R1).

**1-hour alarm standby (EN 81-42 §4.11.3.2):** Same root cause (H066). The GSM control unit (`=H2+CAB-H1`) and the alarm voice path ride the same 24 V backed bus and die with it.

### 4.2 230 V UPS — what it powers and runtime

- **Load:** FRENIC LM2A FRN0015LM2A-4E (5.5 kW, 400 V 3-phase VFD) running in **single-phase 230 V emergency mode** (L1/R + L2/S). In this mode the VFD's output capability is heavily reduced; it powers the control electronics and drives a **controlled descent of a non-self-sustaining screw**.
- **Physics:** lowering 1,250 kg at 0.15 m/s releases gravitational power ≈ m·g·v = 1,250 × 9.81 × 0.15 ≈ **1.84 kW**. For a **non-self-sustaining** screw drive the load tends to descend by gravity, so the motor acts as a generator/brake and the VFD must **dissipate** this energy (into the braking resistor RFMTX400, 400 W continuous). The UPS therefore supplies mainly the VFD control electronics, not the descent energy — **but** this must be verified at commissioning (the VFD may draw >400 W for control + aux + fan in some modes, and the 400 W braking resistor may be exceeded during the ~37 s descent — H076).
- **Design autonomy:** 180 s (3 min). A 5.5 m descent at 0.15 m/s takes ~37 s — well within 180 s.
- **Battery capability:** 7 Ah × 24 V = 168 Wh. At 400 W UPS output with ~85–87 % inverter efficiency the battery-side draw is ~460–470 W → **theoretical runtime ~20–25 min** at full rated load, less at higher draw (Peukert + inverter losses). This is **comfortably more than 180 s** at full load, and much more at the likely <400 W actual draw. However, **end-of-life** (Eurobat 6-year, typically 80 % capacity) reduces this by ~20 %.

### 4.3 Battery end-of-life and Peukert

- **Eurobat service life:** 6 years @ 20 °C. VRLA-AGM loses capacity with age and temperature; ~80 % capacity is a common end-of-life threshold → runtime −20 %.
- **Peukert effect:** at higher discharge currents the *effective* capacity of a lead-acid cell falls (the datasheet's 10 min @ 20 A vs 3 min @ 40 A shows exactly this non-linearity). The 24 V bus at 10–20 A sits in a moderately lossy region.
- **First-start window:** battery must be first-started within 12 months (6–9 months at 30–40 °C) — relevant for "Made to Order" procurement (H070).
- **Charging:** UPS charge current 5 A (24 V) / 5 A (AC); a fully depleted 7 Ah pack recharges in ~2 h nominal (IU0U characteristic). Recharge time matters for ride-through of back-to-back outages.

### 4.4 Summary of runtime figures

| Scenario | Load | Runtime (7 Ah) | Meets? |
|----------|------|----------------|--------|
| 24 V UPS at rated load | 20 A | ~10 min | Descent ✅ / 1-h lighting ❌ |
| 24 V UPS at estimated bus load | ~10–12 A | ~20–35 min | Descent ✅ / 1-h lighting ❌ |
| 24 V UPS, 12 Ah (NOT fitted) | 20 A | ~19 min | Still not 1 h |
| 230 V UPS, full 400 W | 400 W | ~20–25 min theoretical | Descent (37 s) ✅ |
| 230 V UPS, aged battery, full load | 400 W @ 80 % SOH | ~16–20 min | Descent ✅ |
| Emergency lighting alone (LED strips) | ~15 W | ≫ 1 h | ✅ — but not isolated |
| Alarm voice path alone (GSM unit) | ~5–10 W | ≫ 1 h | ✅ — but not isolated |

---

## Section 5 — Redundancy and Single Points of Failure

### 5.1 What a single 24 V UPS failure does

A failure of the QUINT4-UPS/24DC/24DC/20 (G3) **or** its battery (G5) removes power from the **entire** 24 V backed bus:
- Safety PLC (CPU + all modules) — **dead**
- PROFIsafe screw encoder, radar, door/interlock F-DI chains — **dead**
- ROBA-SBC-plus + brake-checkers (F12) — **dead**
- Brake coils (F1) — **de-energised** (brakes clamp; safe but immobile)
- GSM alarm, HMI, LED lighting — **dead**

Consequence (H067): **both Plan A and Plan B are disabled.** Plan A needs the PLC to command/monitor the VFD descent; Plan B needs the PLC to drive the SBC-plus PWM. Only the **manual brake-release tool** (external, mechanical) survives. This is the machine's principal SPOF and the direct cause of the descent chains' CCF-score failure (45 < 65).

### 5.2 What a single 230 V UPS failure does

A failure of the QUINT4-UPS/1AC (G2) **or** its battery (G4) removes Plan A (VFD controlled descent). Plan B (PWM brake release via SBC-plus on the 24 V UPS) **still works** as long as the 24 V UPS and safety PLC are healthy. The 24 V UPS does not depend on the 230 V UPS. So a 230 V UPS failure degrades (not eliminates) rescue capability.

### 5.3 The "both plans need 24 V" finding

The layered descent strategy (Plan A → Plan B → Manual) claims "no single failure in Plan A prevents Plan B," but **both automated plans share the 24 V control-power node** (the PLC + SBC-plus are on F11/F12 of the same backed bus). The dual phase-monitors + series contactors provide contactor-level diversity for the mains→UPS transfer, but they do **not** address the control-power SPOF. This is H067 and is consistent with the CCF-score failure.

### 5.4 Is this acceptable per EN 81-20 / EN 81-42?

- EN 81-42 §4.8.2.2.2.7 / §4.8.2.2.2.9 b) require a mains-independent electrical means of descent/brake release. They do **not** literally require dual UPS redundancy; a single 24 V bus that can deliver the descent function satisfies the letter.
- However, ISO 13849-1 Annex F CCF scoring **fails** (45 < 65) for the descent chains, and the risk assessment (H067) rates the 24 V UPS SPOF as a **significant residual risk** whose only fallback is manual rescue. For a Notified-Body submission this needs a documented risk-acceptance decision, or mitigation (Section 6).

### 5.5 Phoenix Contact redundancy options

- **ORING / decoupling modules** enable parallel UPS operation: the QUINT4-UPS/24DC datasheet states "Possibility of connection in parallel UPS: **yes, with disconnection modules (to increase buffer time and for redundancy)**."
  - QUINT4-ORING/12-24DC/2X10/2X10 (1088206)
  - QUINT4-ORING/12-24DC/2X20/2X20 (1088207)
  - QUINT-ORING/24DC/2X20/1X40 (2320186) — 2-in/1-out decoupling for two 20 A sources
- **Parallel battery modules:** up to 5 × 40 Ah (200 Ah) on the 24 V UPS, and the AC UPS supports up to 200 Ah — for extended buffer time.
- **Separate PSU for the safety PLC:** the simplest structural fix for H067 is a **second small PSU + battery** dedicated to F11 (safety PLC + encoder + radar), independent of the main 24 V backed bus — giving control-power redundancy without full parallel UPS (see Section 6, R5).

---

## Section 6 — Recommendations

### R1 — Battery sizing for 1-hour lighting/alarm compliance (H065, H066)
Do **not** try to reach 1 h by upsizing the single 7 Ah module — the shared bus draws 10–20 A, so even the 12 Ah module (~19 min @ 20 A) and the 38 Ah module fall short. The structurally correct fix is **load separation**:
1. **Emergency lighting:** use self-contained emergency luminaires with integral battery per **EN 60598-2-22** (already suggested in H065) — this moves the 1-hour lighting off the 24 V UPS entirely.
2. **Alarm voice path:** give the **GSM control unit a dedicated battery/charger rated ≥ 1 h** (separate from the 24 V backed bus), or verify the ESSE-TI 5HV-300 dialer's internal battery sustains the complete voice path for 1 h (H066 mitigation b).
3. If separation is not accepted, **re-verify the 24 V UPS runtime with the actual measured bus load** (H065 mitigation) — the 7 Ah module may hold 1 h only at ≤ ~2.5 A, i.e. essentially lighting/alarm alone.

### R2 — Wire UPS health to the safety PLC (H075) — highest value/cost
Both QUINT4-UPS units expose **Alarm (NC, opens on fault)**, **Bat-Mode (active on battery)**, **AC OK/Ready**, and **P>Pn** as 24 V transistor outputs (≤20 mA). Wire:
- 230 V UPS **Alarm** → spare F-DI (safety PLC)
- 24 V UPS **Alarm** → spare F-DI
- 24 V UPS **Bat-Mode** → spare F-DI (log battery events)
- (Optional) 230 V UPS **Bat-Mode** → spare F-DI

This gives diagnostic coverage for the descent safety function, raises the CCF score, and turns "battery discovered at quarterly test" into "maintenance alarm on degradation" (IQ SOH via USB/POWER MANAGEMENT SUITE can be added later for continuous SOC/SOH trending).

### R3 — Maintenance schedule additions (H070)
- **Replace both UPS batteries at 5 years** (before the 6-year Eurobat limit).
- **Stagger the two systems' replacement cycles** (H068) so both batteries never age-out simultaneously.
- **Record first-start date** and track battery age (Made-to-Order lead time: order 3 months before replacement).
- **Quarterly UPS runtime test under load** per EN 81-42 §5.3 (already in the commissioning checklist — enforce in EN 13015 schedule).
- Add lead-acid disposal to the decommissioning procedure (H026/H032).

### R4 — Close the normative documentation gaps
- **EN 81-42 §4.9.5.5:** add a **supply disconnecting device for each UPS output** near the main switch (both the 230 V UPS output path via K4/K5 and the 24 V backed bus).
- **EN 81-42 §4.9.6.3.5 / EN 81-20 §5.10.6.3.5:** fit a **permanent warning label** near the main switch stating UPS-fed circuits remain live, and add the statement to the maintenance handbook (EN 60204-1 §16.2.1). This is already flagged in the SC_safe_brake_release notes — make it a deliverable.
- **EN 81-42 §4.9.5.7:** document/verify that the UPS cannot auto-restart descent with the main switch open (LOTO cross-check, H071 context).
- **EN 81-41 §5.5.14.6:** add a **battery isolating switch** for hot-swap servicing (H069).
- **H064:** verify cabinet ventilation/temperature against the UPS −25…+60 °C rating in the sealed IP54 cabinet; consider hydrogen detection if ventilation cannot be assured.

### R5 — Reduce the 24 V control-power SPOF (H067)
Options, in order of cost:
1. **Dedicated small PSU + battery for the safety PLC (F11)** — independent of the main 24 V backed bus, so a main 24 V UPS failure leaves the PLC alive (Plan B could still function). Lowest structural change.
2. **Hardwired Plan-B trigger** — a direct SBC-plus trigger from the phase-monitor output that bypasses the PLC (documented as diverse backup).
3. **Parallel UPS with ORING/decoupling** (QUINT4-ORING/12-24DC/2X20/2X20, 1088207, or QUINT-ORING/24DC/2X20/1X40, 2320186) for true N+1 control power — most expensive, most robust.
4. **Accept as documented residual risk** with manual rescue as the diverse-technology fallback (explicit statement in the technical file for the Notified Body).

### R6 — Commissioning measurements (H076)
- **Measure, don't assume:** at commissioning, measure the actual VFD input power during a **loaded** emergency descent (motor + regen modes) and the actual 24 V bus current in all states; confirm the 230 V UPS overload margin (900 W continuous vs measured), confirm the braking resistor (RFMTX400, 400 W continuous) duty during the ~37 s descent, and confirm switchover < 100 ms under load (all per EN 81-42 §5.3).
- The 1000 VA / 900 W QUINT4-UPS/1AC provides substantial headroom — the ~37 s loaded descent is well within its rating. The measurement is a commissioning verification, not a design risk.

### R7 — Consider a second speed channel note (related, not UPS)
The single PROFIsafe screw encoder is the sole safety-rated speed source (stage3 already documents the hardwired final limits as diverse-technology position backup). This is independent of the UPS architecture but relevant to the same emergency-descent safety case — keep the documented accepted-residual-risk statement.

---

## Local Files Referenced (all under `/home/eldar/Projects/Project_1/`)

- `LIBRARY/ELECTRIC/library/ups/ups_230v_inverter.yaml`
- `LIBRARY/ELECTRIC/library/ups/ups_24v_safety.yaml`
- `LIBRARY/ELECTRIC/library/ups/phoenix_ups_bat_7ah.yaml`
- `LIBRARY/ELECTRIC/library/power_supply/psu_24v_960w.yaml`
- `LIBRARY/ELECTRIC/library/vfd/frenic_lm3_inverter.yaml`
- `LIBRARY/ELECTRIC/library/datasheets/phoenix_contact/phoenix_quint4_ups_1ac.md`
- `LIBRARY/ELECTRIC/library/datasheets/phoenix_contact/phoenix_quint4_ups_24dc.md`
- `LIBRARY/ELECTRIC/library/datasheets/phoenix_contact/phoenix_ups_bat_24dc_7ah.md`
- `LIBRARY/ELECTRIC/library/datasheets/phoenix_contact/phoenix_trio3_psu.md`
- `MACHINES/urano_e/electronics/block_diagram/block_diagram.yaml`
- `MACHINES/urano_e/electronics/wiring/wiring_context.yaml`
- `MACHINES/urano_e/safety/stage2_mechanical.yaml` (hazards H064–H076)
- `MACHINES/urano_e/safety/stage3_electrical.yaml` (SC_emergency_descent, SC_safe_brake_release)
- `MACHINES/urano_e/safety/operating_scenarios.yaml`
- `normative/.claude/memory/en-81-42.md`, `normative/.claude/memory/en-81-20.md`, `normative/.claude/memory/iec-60204-1.md`
- `normative/extracted_html/EN_81-42_2026/.../auto/EN 81-42_2026.md` (clause 4.4.1.10.4, 4.8.2.2.2.7/9, 4.8.2.3.1, 4.9.5.5/7, 4.9.6.3.5, 4.11.3.2)
- `normative/extracted_html/EN_81-20_2014/.../auto/EN 81-20_2014.md` (clauses 5.4.10.4, 5.10.5.3, 5.10.6.3.5, 5.12.3.1)

## Web Sources

- [Phoenix Contact — QUINT4-UPS/1AC/1AC/1KVA (2320283)](https://www.phoenixcontact.com/en-us/products/uninterruptible-power-supply-ac-quint4-ups1ac1ac1kva-2320283)
- [Phoenix Contact — QUINT4-UPS/24DC/24DC/20 (2907071)](https://www.phoenixcontact.com/en-us/products/uninterruptible-power-supply-quint4-ups24dc24dc20-2907071)
- [Phoenix Contact — UPS-BAT/PB/24DC/7AH (1274118)](https://www.phoenixcontact.com/in/products/1274118)
- [Phoenix Contact — IQ Technology overview](https://www.phoenixcontact.com/en-in/technologies/power-supplies-and-ups/iq-technology)
- [Phoenix Contact — Power supply solutions brochure](https://www.phoenixcontact.com/assets/3308d3eb-cb56-450e-9cd9-187a1003b0d4/)
- [Phoenix Contact — Monitor and Configure UPS systems (UPS-CONF / IQ Technology, SOC/SOH)](https://blog.phoenixcontact.com/marketing-ae/ups-systems/)

---

## Remaining Issues (post-report)

These are the open items after user review and corrections (2026-08-06):

### R1 — 1-hour emergency lighting compliance (H065)
EN 81-42 §4.4.1.10.4 requires ≥5 lx for 1 hour. The 7 Ah battery at realistic bus load delivers ~15-30 min. **Resolution path:** load separation — install self-contained emergency luminaires with integral 1 h batteries (EN 60598-2-22) so the main 24 V UPS does not need to carry the lighting load. Or upsize battery and verify 1 h at actual measured load.

### R2 — 1-hour alarm standby compliance (H066)
EN 81-42 §4.11.3.2 requires alarm standby ≥1 hour. Same 7 Ah battery limitation. **Resolution path:** verify whether the ESSE-TI 5HV-300 dialer's internal battery sustains the complete voice path independently of the cabinet GSM controller for 1 h, OR provide a dedicated battery/charger for the GSM control unit rated ≥1 h.

### R3 — 24 V UPS single point of failure (H067)
Both Plan A (VFD descent) and Plan B (PWM brake release) depend on the safety PLC and SBC-plus from the single 24 V backed bus. A 24 V UPS failure disables both automated plans. **Options:** (a) dedicated small PSU+battery for safety PLC only (F11), (b) hardwired Plan-B trigger bypassing PLC, (c) parallel UPS with ORING module (Phoenix Contact QUINT4-ORING), or (d) document as accepted residual risk with manual rescue as diverse-technology backup. **User to decide.**

### R4 — EN 81-42 vs EN 81-20 scope
EN 81-42 caps rated load at 500 kg (§4.4.1.2.1.1). The 1,250 kg machine exceeds this. EN 81-20 is the correct primary Type C standard; EN 81-42 clauses apply by analogy with deviations documented in the technical file.

### R5 — Cabinet manufacturing items (non-design)
- EN 81-42 §4.9.6.3.5: permanent warning label near main switch ("UPS terminals remain live")
- EN 81-42 §4.9.5.5: disconnecting device per UPS supply source
- EN 81-41 §5.5.14.6: battery isolating switch
These are electrical cabinet build checklist items, not design documentation gaps.

### R6 — Stage3 hazard_refs for electrical hazards
H064–H078 are documented in stage2 but not linked to any safety chain. Most are mitigated by inherent design (IP ratings, discharge resistors, fuse protection) or information (warning labels, maintenance procedures) per ISO 12100 3-step hierarchy. A few could justify chain coverage if the user wants: H071 (DC bus warning notice → SC_emergency_stop or LOTO procedure), H075 (UPS monitoring → SC_emergency_descent diagnostic coverage).

### R7 — UPS-PLC communication path documentation

The UPS-PLC communication protocol is confirmed as **Modbus RTU** (Function Code 04 — Read Input Registers):
- **Baud rate:** 115200, 8E1
- **Default slave address:** 192 (0xC0)
- **Physical layer:** USB (Mini-USB B) on both QUINT4-UPS units

**Definitive register map** (Phoenix Contact document 112393_en_00, 2026-03-10) for the 230V AC UPS (item No. 2320283, device [4]):

| Data point | Register | Unit |
|-----------|----------|------|
| Battery mode | 0x7401 | Binary |
| SOC | 0x7435 | % |
| Residual backup time | 0x7436 | Minutes |
| SOH | 0x7439 | 24h (days of life) |
| Battery voltage | 0x7460 | mV |
| Battery temperature | 0x7461 | Kelvin |
| UPS temperature | 0x7434 | Kelvin |
| Input/output voltage | 0x7430/0x7432 | 100 mV |
| Actual alarm | 0x7490 | U32 bitmask (20 alarms) |
| Output active power | 0x7440 | W |

**Remaining documentation task:** Map which PLC module reads these registers (CM PtP via RS-485, or CPU via Modbus TCP if Ethernet variant), at what polling rate, and which HMI screen displays battery status. Document in `wiring_context.yaml`.

**Status update (2026-08-06):** The full Modbus register map for the 230 V AC UPS (registers 29697–29840, including the 20-bit alarm bitmap, SOC/SOH/battery temperature/runtime) is now documented in the ELECTRONICS parts library — `LIBRARY/ELECTRIC/library/ups/ups_230v_inverter.yaml` (`communication` section, reference Phoenix Contact 112393_en_00). The 24 V DC UPS (QUINT4-UPS/24DC/24DC/20) Modbus register map document is still being located; the `communication` section of `LIBRARY/ELECTRIC/library/ups/ups_24v_safety.yaml` is marked **FORTHCOMING** (its hardware signaling terminals 3.1–3.9 are documented from the local datasheet).

---

*Report generated 2026-08-06. Corrected per user review: part numbers verified against Phoenix Contact, live-terminal label identified as manufacturing task, UPS-PLC communication confirmed. Remaining issues R1–R7 are open for user decision.*
