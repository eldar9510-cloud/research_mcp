---
{
  "format": 1,
  "metadata": {
    "id": "mayr-dual-brake-checker-wiring",
    "title": "Mayr SBC-plus, two checkers and two brakes: wiring research and gaps",
    "question": "What topology/supply information is reusable for dual-brake Mayr/PLCnext wiring, and which terminal questions remain unanswered?",
    "scope": "ROBA-SBC-plus, two Type 058.600.2 checkers, two ROBA-stop-M brakes and PLCnext AXC F 2152/SPLC 1000; partial applicability to final wiring.",
    "summary": "Supports supply-domain/inline-checker discussion but leaves reference-potential links and Pin13 ERR unresolved; warns of product and MTTFd conflation.",
    "researched_at": "2026-08-23",
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
      "Imported without fresh source or technical verification; historical findings are not current compliance, safety or legal certification.",
      "Original report bytes/citations are preserved. Third-party quotations, code and sources retain their own rights; unresolved local/transcript references remain unavailable.",
      "Y12/Y13 and Y22/Y23 topology and Pin13 ERR routing unresolved.",
      "Predictive/IrDA/IoT section describes a different Brake-Checker-plus product.",
      "Verdict corrects MTTFd from 2200 years to stated 160 years at 60 C; neither number verified here.",
      "Full source URLs are transcript-only; abbreviated/grouped citations remain unresolved.",
      "Not approved wiring, safety integrity evidence or certification.",
      "Uninspected session transcript containing full URLs.",
      "Abbreviated manual/domain paths and grouped citation labels: do not invent URLs.",
      "Internal URANO-E sheet 4 outside allowlist.",
      "Machine-specific brake and safety-PLC architecture.",
      "Source-stated generating agent label: deep-research-preview-04-2026; underlying model/platform remain unknown unless explicitly attributed."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:30:53.877Z",
    "updated_at": "2026-11-01T23:30:53.877Z",
    "imported_at": "2026-11-01T20:38:59.599Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "23ea244f08eaa3ef07fc461bdf211aa056b8d958a671551867d5a538c089bc8f",
  "proposalRevision": "4d9c2402927e8cbe639d2c94e2efd1d70e732cfb39f6c9c33532120de6d6637a"
}
---
# Deep Research — Mayr ROBA-SBC-plus + 2× brake-checker + 2× brake, PLCnext dual-channel wiring

**Date:** 2026-08-23
**Agent:** deep-research-preview-04-2026 (tokens: 6,177,545)
**Machine/context:** URANO-E elevator, sheet 4 (Brake System). Verify how to connect a PLCnext AXC F 2152 + SPLC 1000 dual-channel safety PLC to one ROBA-SBC-plus driving TWO ROBA-brake-checkers (Type 058.600.2) and TWO ROBA-stop-M spring-applied safety brakes.

## Question asked
> How to correctly wire a Mayr ROBA-SBC-plus electronic brake control module together with TWO ROBA-brake-checker modules and TWO ROBA-stop-M spring-applied electromagnetic safety brakes, driven by a dual-channel safety PLC (PLCnext AXC F 2152 + SPLC 1000 safety controller). Specifically: (1) Is the ROBA-brake-checker wired INLINE in series between the SBC-plus power output and the brake coil, or is it a parallel/side-monitoring sensor? (2) For two independent brakes each with its own checker, does one SBC-plus module drive both, using its two output circuits O1/O2, one per brake? (3) The SBC-plus fast-shutdown safe inputs come in pairs (Y10+Y11 for circuit 1, Y20+Y21 for circuit 2) — must BOTH poles of a pair be driven high by the safety PLC dual-channel outputs for the brake to release, and what is the reference-potential wiring for Y12/Y13, Y22/Y23? (4) How are the checker release-status feedback outputs (Pin 14) and error outputs (Pin 13) wired back — to the SBC-plus feedback loop inputs (Y1/Y2) and/or to safety PLC digital inputs? (5) Device supply (A1/A2), power-circuit supply (B1/B2), and checker electronics supply (Pin 15/16) wiring. Provide the canonical Mayr application wiring topology with terminal-level detail and cite Mayr documentation.

## VERDICT — usefulness for the wiring task
Confirms architecture (3 supply domains, checker inline, Y1/Y2 = release plausibility, Pin11 RST from PLC DO). Does **NOT** resolve the two terminal-level gaps I still need: the exact Y12/Y13 / Y22/Y23 reference-potential link topology for dual-pole activation, and Pin13-ERR routing. Some product conflation (predictive/IrDA/IoT section describes the newer *Brake-Checker-plus*, not our basic Type 058.600.2 which has only Pin13/14 digital outputs — ignore that section for our hardwiring). MTTFd "2,200 yr" is for a different checker; ours (058.600.2) = 160 yr @60°C per its manual.

---

## Report body (verbatim)

### Galvanic Isolation and Power Supply Distribution
Strict segregation of DC supplies is required. Three distinct power domains:
- **Logic supply (A1/A2)** → clean 24 VDC instrumentation supply, tol −15%/+20%; must share 0 V ground with the PLCnext so signal ground is uniform across OSSD lines. [cite 3]
- **Power-circuit supply (B1/B2)** → galvanically isolated heavy-current 24 or 48 VDC (−10%/+20%); sized for overexcitation inrush pulling the ROBA-stop-M armatures against the springs; routed out through O1/O2. [cite 3]
- **Checker electronics supply (Pin 15/16)** → continuous low-current logic supply so the checker microprocessor stays active and can report faults even after the SBC-plus has severed the main brake power. [cite 11, 17]

Checker Type 058.600.2 terminal map (from report):

| Function | Terminal | Destination |
| --- | --- | --- |
| Logic supply 0 V | Pin 15 | Common 0 V of 24 V instrumentation supply |
| Logic supply +24 V | Pin 16 | +24 V instrumentation supply (continuous) |
| Power input + | Pin 1 | SBC-plus output O1 (or O2 for circuit 2) |
| Power input − | Pin 4 | SBC-plus return |
| Power output + | Pin 2 | ROBA-stop-M coil + |
| Power output − | Pin 3 | ROBA-stop-M coil − |
| Checker reset | Pin 11 | Standard PLC digital output (pulse high to clear faults) |

### Predictive Maintenance / IoT (NOT applicable to our 058.600.2 — describes Brake-Checker-plus + ROBA-gateway IrDA)
The intelligent brake-checker records switching times, voltage drops, coil resistance, armature drop-out signatures; increased armature travel → delayed inflection in inductive current curve → logged as t2 degradation. ROBA-gateway (IrDA optical, RJ45) bridges telemetry to PLCnext web server with zero hardwiring to the diagnostic pins. [cite 9,13,14,19,20]

### Functional Safety Validation
SBC-plus provides the PLe physical foundation; solid-state switching improves MTTFd vs contactors (no weld-on-cycle degradation). DCavg from layered defense: dual-channel OSSD monitoring (cross-fault detection in copper) + Y1/Y2 plausibility check (verifies mechanical health of actuator, cross-verifies commanded voltage vs actual physical release status via sensorless analysis) → mitigates CCF (mechanical jamming). Fail-safe: any anomaly → default safe state, sever O1/O2, springs halt load. [cite 1,3,6,21]

## Sources
1. hvhindustrial.com/sub-category/mayr-roba-sbcplus-safe-brake-control/63832
2. mayr.com/en/products/safety-brakes/industrial-brakes/roba-stop-m~55
3. **groneman.nl/.../p_021000_v05_en_18_03_2019_SBC-plus.pdf** (SBC-plus manual)
6. mayr-romania.ro/.../Catalog_de_module_cc...MAYR.pdf
9. mayr.com/.../roba-brake-checker~2134
11. mayr.com.sg/.../b.0287002.en_.pdf
12. mayr.com.sg/.../b.0286002_Brake-Checker-plus-DC.en_.pdf (Brake-Checker-PLUS — different product)
17. **groneman.nl/.../brake-checker-b.0586002.en_.pdf** (our checker Type 058.600.2 manual)
19-20. mayr.com roba-gateway (IrDA IoT bridge)
21. directindustry.com Mayr product page
(full URLs preserved in session transcript)
