---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-7-terminals-and-connectors-historical-gemini-report-da20bf49",
    "title": "IEC scope batch 7: terminals and connectors — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 7: terminals and connectors — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 7: terminals and connectors — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 7: terminals and connectors — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
    "imported_at": "2026-11-04T21:30:40.077Z"
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
  "sourceDigest": "da20bf498faac51832aa67f2fba0fba21c6c5b256dd53e741a443724148d1216",
  "proposalRevision": "b8163c4f7b223463059c86d4a63d1f056c1f265de71d075c0baf3206e4bfcc29"
}
---
# Batch 7 — Terminals & connectors · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 2,351,476 · status completed · 2026-08-28.
**Standards:** 60947-7-1, -7-2, -7-3, 61984, 61076-2-101, 60309-1/-2, 62444. FULL report.

> ⚠ Gemini self-flagged several editions LOW-CONFIDENCE and drifted onto a "COS/HOC" tangent
> (many junk sources). Two editions are STALE vs the master's live-verified values — corrected below.
> Also note the Ethernet-switch triad closing master row 26b.

---

## IEC 60947-7-1 — Terminal blocks for copper conductors
- **current_edition:** Gemini said ed 3.0:2009 [LOW-CONF]. ⚠ **Master (Source B live-verified) = 60947-7-1:2025 ed 4.0 — USE 2025.**
- **when:** any standard feed-through DIN-rail terminal for copper wiring in the panel.
- **for_what:** temp rise, dielectric (clearance/creepage + CTI anti-tracking), vibration-proof clamping without severing strands. Isolates circuit from the rail.
- **role:** passive interconnection + phase insulation. **related:** 60947-1, 60664-1.

## IEC 60947-7-2 — PE (protective-conductor) terminal blocks
- **current_edition:** ed 3.0:2009 [confirm; master agrees ~2009].
- **when:** bonding a PE wire directly to the DIN-rail metalwork (vs daisy-chaining 7-1 blocks).
- **for_what:** fault-path continuity — conductive foot bites rail oxidation → rail becomes fault busbar; clamp survives short-circuit electro-dynamic forces until breaker trips.
- **role:** active fault-path / equipotential bonding. **related:** 60947-1, 60947-7-1.
- **7-1 vs 7-2 rule:** ordinary feed-through isolates from rail; PE block bonds to rail. Use 7-2 wherever earth must reach the rail structure.

## IEC 60947-7-3 — Fuse terminal blocks (safety)
- **current_edition:** ed 1.0:2009 [confirm; master agrees ~2009].
- **when:** integrating overcurrent protection into the terminal strip (24V door power, shaft-light aux, intercom).
- **for_what:** contains fuse-rupture heat/arc without melting neighbours; **IP20 touch-safety** during cartridge replacement (articulated test finger).
- **role:** localized overcurrent + touch-safe isolation. **related:** 60269 series.

## IEC 61984 — Connectors: safety requirements & tests
- **current_edition:** **ed 2.0:2008** (EN 61984:2009).
- **when:** heavy-duty multi-pin rect/circular connectors 50–1000 V, ≤125 A/contact — 400V feeds, trailing car-roof cables, motor drops.
- **for_what:** shock/fire safety + whether it can break a live arc. **Only TWO normative classes: CBC (with breaking capacity = load-break) and COC (without = dead-break; needs interlock/label).**
- **⚠ COS and HOC are NOT normative classes:** "COS" = misread of test-report **cos φ = 0.9** power factor; "HOC" = telecom "Hardened Outdoor Connector." Ignore both in the technical file.
- **role:** high-reliability power/control interfacing. **related:** 60512 (tests), 60603 (data connectors instead, for <50V signal).

## IEC 61076-2-101 — Circular M12 connectors (screw-lock)
- **current_edition:** Gemini said ed 3.0:2012 [LOW-CONF]. ⚠ **Master (Source B) = 61076-2-101:2024 ed 4.0 — USE 2024.**
- **when:** quick-disconnects for proximity sensors, encoders, limit switches, 24V light curtains in high-vibration shaft/car areas.
- **for_what:** dimensional interoperability + IP67 sealing + screw-lock vibration resistance (prevents micro-interruptions in the safety chain).
- **role:** harsh-environment LV sensor interconnect. **related:** 60512, 60529.

## IEC 60309-1 / -2 — Industrial CEE plugs & sockets
- **current_edition:** **ed 5.0:2021** (both parts).
- **when:** service-power outlets in machine room / pit; pluggable disconnect for 3-phase mains.
- **for_what:** Part 1 = safety/insulation/impact housing; Part 2 = **clock-position keying** (oversized PE pin; voltage/freq assigned to clock hours) → mechanically impossible to plug 110V tool into 400V outlet.
- **role:** keyed ruggedized service power. **related:** 60529.

## IEC 62444 — Cable glands for electrical installations
- **current_edition:** **ed 1.0:2010** (EN 62444:2013).
- **when:** any cable/conduit penetrating an enclosure boundary (panel, car-roof box, pit station).
- **for_what:** two DISTINCT claims — **Cable Retention** (grip preserves IP seal; ≤3 mm displacement under continuous force) vs **Cable Anchorage / strain-relief** (structural; Types A/B non-armoured, C/D armoured; ≤2 mm under 50 sharp pulls + torque). Suspended/dynamic cables MUST use Anchorage or weight transfers to the 60947-7-1 terminals → pull-out.
- **role:** boundary sealing + mechanical load isolation. **related:** 60529.

---

## Ethernet switch — confirms master row 26b (GAP)
**No dedicated IEC product safety standard.** Validate via a triad: **62368-1** (baseline electrical safety,
succeeds 60950-1) + **62443** (cybersecurity — cyber-physical risk) + **61850-3 / 61784** (environmental/EMI
ruggedness + industrial network profile PROFINET/EtherNet-IP). Aggregate = the justification.

## Sources (IEC-primary only; run drifted, junk sources dropped)
iteh: en-61984-2009, en-62444-2013, IEC-62444-2010, clc-tc-9x. mennekes (60309 clock-position).
Editions to trust from MASTER not this run: 60947-7-1:2025, 61076-2-101:2024. Others (61984:2008,
60309:2021, 62444:2010, 7-2/7-3:2009) consistent. Verify all on iec.ch before quoting.
