---
{
  "format": 1,
  "metadata": {
    "id": "iec-coverage-gemini-historical-source",
    "title": "Historical Gemini IEC coverage matrix with known errors",
    "question": "What did source A claim, which errors were recorded, and where is its reconciled successor?",
    "scope": "Historical 35-category source kept for provenance/gap framing, not an unqualified current standards answer.",
    "summary": "Original matrix with explicit four-number/stale-edition warning and reconciled-master pointer.",
    "researched_at": null,
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
      "Wrong product numbers for MCB, PSU, safety relay and Ethernet; systematically stale editions.",
      "Always carry exact correction notice and successor, including lower-section reads.",
      "Full source URL list is in an unavailable session transcript.",
      "Master basename resolves exactly to selected master; no invented repair.",
      "Abbreviated source list and transcript-only URLs.",
      "Local category vocabulary and transcript dependency.",
      "Source-stated generating agent label: deep-research-preview-04-2026; underlying model/platform remain unknown unless explicitly attributed.",
      "Original successor filename remains in the unchanged body; archive successor ID is iec-coverage-reconciled-35-categories. Read the exact correction and successor context."
    ],
    "superseded_by": "iec-coverage-reconciled-35-categories",
    "created_at": "2026-11-01T23:31:04.177Z",
    "updated_at": "2026-11-01T23:31:04.177Z",
    "imported_at": "2026-11-01T20:38:59.665Z"
  },
  "warnings": [
    {
      "code": "unknown_research_date",
      "message": "Original research date unknown; import is not verification."
    },
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "transcript_dependency",
      "message": "Possible transcript-only evidence; review before publication."
    },
    {
      "code": "unverified_supersession",
      "message": "Supersession link is unverified until reviewed."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "bfddfd966b7855099c8981919256852c0424264db04a9ff87ed645d82997e9fe",
  "proposalRevision": "c3cbbf9dbc67318ba0921a0f347f0f77896d2c6e9dde1b8652c377ecaa8d3851"
}
---
# SOURCE A — Gemini Deep Research (component-first)

**Part of the 2026-08-27 three-source IEC-coverage confront.**
Master reconciled verdict: `2026-08-27-iec-product-standard-coverage-35-categories.md`
Agent: `deep-research-preview-04-2026` · tokens 2,296,149 · status completed.

> ⚠ Use with care: this source got **4 product-standard numbers wrong** (MCB→60934,
> PSU→61010-2-201, safety_relay→61810-3, Ethernet→61850-3) and cited **systematically
> stale editions**. Kept for provenance + its correct gap framing (EN 81-28, OIML R60,
> ISO 14119, ISO 13850). See master for the corrected values.

## Gemini normative matrix (verbatim)

| Category | Primary IEC Standard (Number, Title, Edition/Year) | Secondary IEC Standards | Governed-instead-by-non-IEC? |
| :--- | :--- | :--- | :--- |
| 1. power_supply | IEC 61010-2-201:2017 (Control equipment) | IEC 61204-7; IEC 61000-6-2 | No |
| 2. ups | IEC 62040-1:2017 (UPS — General and safety) | IEC 62040-2 (EMC) | No |
| 3. main_switch | IEC 60947-3:2020 (Switches, disconnectors) | IEC 60947-1 | No |
| 4. circuit_protection | IEC 60934:2019 (CBE) / IEC 61010-2-201 (electronic) | IEC 60947-2; IEC 60898-1 | YES (partial) — UL 2367 / UL 508 |
| 5. fuse | IEC 60269-1:2006 (LV fuses — General) | IEC 60269-2 (industrial) | No |
| 6. surge_protection | IEC 61643-11:2011 (SPD on LV power systems) | — | No |
| 7. contactor | IEC 60947-4-1:2018 (Contactors and motor-starters) | IEC 60947-1 | No |
| 8. vfd | IEC 61800-5-1:2007+AMD1:2016 (PDS safety) | IEC 61800-5-2:2016 (STO) | No |
| 9. motor | IEC 60034-1:2022 (Rotating machines — rating) | — | No |
| 10. safety_plc | IEC 61131-2:2017 (PLC equipment req.) | IEC 61508; IEC 62061 | No (ISO 13849 systemic) |
| 11. safety_relay | IEC 61810-3:2015 (Forcibly-guided-contact relays) | IEC 62061 | No (ISO 13849 systemic) |
| 12. standard_plc | IEC 61131-2:2017 (PLC equipment req.) | IEC 61010-2-201 | No |
| 13. encoder | No dedicated IEC product standard | IEC 61800-5-2; IEC 61010-1 | YES — no dedicated IEC product standard |
| 14. light_curtain | IEC 61496-1:2020 (ESPE — general) | IEC 61496-2:2020 (AOPD) | No |
| 15. laser_scanner | IEC 61496-1:2020 (ESPE — general) | IEC 61496-3:2018 (AOPDDR) | No |
| 16. door_interlock | IEC 60947-5-3:2013 (Proximity, defined behaviour) | IEC 60947-5-1 | YES — ISO 14119:2013 |
| 17. limit_switch | IEC 60947-5-1:2016 (Control circuit devices) | — | No |
| 18. inductive_sensor | IEC 60947-5-2:2019 (Proximity switches) | — | No |
| 19. safety_brake | No dedicated IEC product standard | IEC 60034-1 (if part of motor) | YES — EN 81-50; ISO 13849 |
| 20. brake_controller | No dedicated IEC product standard | IEC 61010-1; IEC 61000-6-2 | YES — no dedicated IEC product standard |
| 21. e_stop | IEC 60947-5-5:1997+AMD2:2016 (Emergency stop device) | — | YES (partial) — ISO 13850:2015 |
| 22. hmi_panel | IEC 61010-2-201:2017 (Control equipment) | — | No |
| 23. terminal_feedthrough | IEC 60947-7-1:2009 | — | No |
| 24. terminal_pe | IEC 60947-7-2:2009 | — | No |
| 25. terminal_fuse | IEC 60947-7-3:2009 | — | No |
| 26. connector_industrial | IEC 61984:2008 (Connectors — safety) | IEC 61850-3:2013 (Ethernet switch) | No |
| 27. cable_gland | IEC 62444:2010 | — | No |
| 28. din_rail | IEC 60715:2017 | — | No |
| 29. enclosure | IEC 62208:2011 (Empty enclosures) | IEC 61439-1 (assembled) | No |
| 30. cable | IEC 60227 series (PVC ≤450/750 V) | IEC 60228:2004 (conductors) | No |
| 31. alarm_unit | No IEC equivalent for lift alarm logic | IEC 60947-5-1 (indicator lamps) | YES — EN 81-28:2022 |
| 32. load_cell | No IEC equivalent for metrology | IEC 61010-1 (amplifier) | YES — OIML R60 |
| 33. relay_general | IEC 61810-1:2015 | — | No |
| 34. passive_component | IEC 60384-1:2021 (cap); IEC 61007/60076-6 (ind) | IEC 60115-1:2020 (res) | No |
| 35. lighting | IEC 60598-1:2020 (Luminaires — general) | IEC 60598-2-1 | No |

## Gemini narrative gaps flagged (correct framing)
- **door_interlock** → ISO 14119 dominates (coding levels, defeat-resistance) over the
  IEC 60947-5-3 electronics.
- **e_stop** → IEC 60947-5-5 for latching/direct-opening; ISO 13850 for ergonomics/colour.
- **alarm_unit** → EN 81-28 (1h backup, 15min voice, 3-day test call, ISO 4190-5 iconography).
- **load_cell** → OIML R60 (accuracy classes C3/C6, creep, temp drift); IEC 61010-1 amplifier only.
- **encoder / safety_brake / brake_controller** → no dedicated IEC product standard.

## Gemini sources (64)
IEC Webstore (60947 series, 62208, 60934), iteh.ai samples (EN 81-28:2022, 61010-2-201:2024,
62024), OIML R60 (NIST), EN 81-20/-50 (liftinstituut, kone), Phoenix Contact CAPAROC docs,
IEC 61850-3 (scadaprotocols, automation.com), IEC 61810 (iecee). Full URL list retained in
session transcript.
