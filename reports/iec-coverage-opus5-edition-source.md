---
{
  "format": 1,
  "metadata": {
    "id": "iec-coverage-opus5-edition-source",
    "title": "Opus-5 IEC edition survey with low-confidence entries",
    "question": "Which editions did the independent IEC survey report, and which entries remained disputed or unconfirmed?",
    "scope": "Source B in 35-category comparison; historical web-verification claims are source provenance, not scout verification or compliance evidence.",
    "summary": "Edition-oriented matrix with substantial low-confidence notes and compact source references reused by the master.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "Opus-5"
    },
    "related_reports": [],
    "warnings": [
      "Imported without fresh source or technical verification; historical findings are not current compliance, safety or legal certification.",
      "Original report bytes/citations are preserved. Third-party quotations, code and sources retain their own rights; unresolved local/transcript references remain unavailable.",
      "Headline claims all primary numbers/editions verified, but same report lists unconfirmed/inferred entries.",
      "Freshest/live-verified are historical source claims, not this scout checking sources.",
      "Condensed identifiers must not be repaired into invented URLs.",
      "Master basename resolves to selected master.",
      "IEC publication IDs and compact publisher/domain references are not complete portable URLs and were not dereferenced.",
      "No attributable human author established; no obvious credential pattern."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:31:15.387Z",
    "updated_at": "2026-11-01T23:31:15.387Z",
    "imported_at": "2026-11-01T20:38:59.727Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "49eb6e25212795d1ccdd50b10702febab57c033606e3409ed909a6546f591347",
  "proposalRevision": "f8dd43435660ac56cd7978af700dbf473fa89aef8b4927cd5d1bc8244449bef7"
}
---
# SOURCE B — Opus-5 web-verified subagent (live editions)

**Part of the 2026-08-27 three-source IEC-coverage confront.**
Master reconciled verdict: `2026-08-27-iec-product-standard-coverage-35-categories.md`
Method: independent Opus-5 subagent, WebSearch + WebFetch of IEC Webstore, standard.no
(Standard Norge/NEK), iteh.ai, genorma, BSI. 176 tool calls · ~104.9k tokens.

> **Freshest of the three sources** — all primary numbers/editions verified against live
> 2026 web sources. Used as the edition-currency tiebreak in the master.

## 35-row table (verbatim)

| # | Category | Primary IEC product standard (number · title · edition) | Secondary / related | Non-IEC? |
|---|----------|----------------------------------------------------------|---------------------|----------|
| 1 | power_supply | IEC 62368-1:2023 · Audio/video, ICT — Safety · ed 4.0 | IEC 61204-7:2016; IEC 61558-2-16:2021; 61558-1:2017; EN 60950-1 withdrawn | NO |
| 2 | ups | IEC 62040-1:2017 · UPS — Safety · ed 2.0 (AMD1:2021 unconfirmed) | 62040-2 (EMC), 62040-3 (perf) | NO |
| 3 | main_switch | IEC 60947-3:2020+AMD1:2025 CSV · Switches/disconnectors · ed 4.1 | 60947-1:2020 | NO |
| 4 | circuit_protection | IEC 60947-2:2024 · Circuit-breakers · ed 6.0; IEC 60898-1:2015+AMD1:2019 · household · ed 2.1 | 60947-1:2020; CAPAROC cert unconfirmed | NO |
| 5 | fuse | IEC 60269-1:2024 · LV fuses — General · ed 5.0 | 60269-2:2013+A1:2016+A2:2024 (ed 5.2); 60269-3:2024 (ed 5.0); 60269-4:2024 (ed 6.0) | NO |
| 6 | surge_protection | IEC 61643-11:2025 · SPD on AC LV power systems · ed 2.0 | 61643-01; 61643-31 (PV) | NO |
| 7 | contactor | IEC 60947-4-1:2023 · Contactors and motor-starters · ed 5.0 | 60947-1:2020; 60204-1 | NO |
| 8 | vfd | IEC 61800-5-1:2022 · PDS safety — electrical/thermal/energy · ed 3.0 | 61800-5-2:2016 (STO, ed 2.0); 61800-3 (EMC); 61800-5-3:2021 (safety encoders) | NO |
| 9 | motor | IEC 60034-1:2022 · Rotating machines — rating · ed 4.0 (see low-conf) | 60034-2-1, -5, -8, -30 | NO |
| 10 | safety_plc | IEC 61131-2:2017 · Programmable controllers — equipment · ed 4.0 | 61131-6:2012 (FS-PLC, SIL≤3); 61508-1/-2:2010; 62061:2021 / ISO 13849-1:2023 | NO |
| 11 | safety_relay | No dedicated IEC product standard — per IEC 61508-1/-2:2010 · ed 2.0 | ISO 13849-1:2023; 62061:2021; 60947-5-1:2024 (contacts) | NO — **no dedicated IEC product standard** |
| 12 | standard_plc | IEC 61131-2:2017 · ed 4.0 | 61131-1, -3; 61010-2-201 | NO |
| 13 | encoder | No dedicated IEC for general encoders. Safety: IEC 61800-5-3:2021 · ed 1.0 | 61800-5-2:2016; 60068-1/-2-6 | NO — general: **no dedicated IEC product standard** |
| 14 | light_curtain | IEC 61496-1:2020 · ESPE general · ed 4.0; 61496-2:2020 · AOPD · ed 4.0 | 62471; 60825-1 | NO |
| 15 | laser_scanner | IEC 61496-1:2020 (ed 4.0); 61496-3:2025 · AOPDDR · ed 4.0 | 60825-1 | NO |
| 16 | door_interlock | ISO 14119:2024 · Interlocking devices w/ guards · ed 3.0 | 14120:2015; 60947-5-1:2024; 60947-5-5:2026 | **YES — ISO 14119** |
| 17 | limit_switch | IEC 60947-5-1:2024 · Control circuit devices · ed 5.0 | 60947-1:2020 | NO |
| 18 | inductive_sensor | IEC 60947-5-2:2019 · Proximity switches · ed 4.0 | 60947-5-3:2026 (ed 3.0); 62026-2:2008+A1:2019 | NO |
| 19 | safety_brake | No dedicated IEC product standard | 61800-5-2:2016 (SBC); ISO 13849-1:2023 / 62061:2021 | **YES lift — EN 81-20/50**; general holding brakes: none |
| 20 | brake_controller | No dedicated IEC product standard | ISO 13849-1:2023, 62061:2021 / 61508; 60204-1; 60947-4-1:2023 | NO — **no dedicated IEC product standard** |
| 21 | e_stop | IEC 60947-5-5:2026 · Emergency stop w/ mechanical latching · ed 2.0 | ISO 13850:2015; 60947-5-1:2024; 60204-1 | NO |
| 22 | hmi_panel | IEC 61131-2:2017 · Part 2 (covers HMIs/panel PCs) · ed 4.0 | 62368-1:2023; 61010-2-201 | NO |
| 23 | terminal_feedthrough | IEC 60947-7-1:2025 · Terminal blocks for Cu conductors · ed 4.0 | 60947-1:2020 | NO |
| 24 | terminal_pe | IEC 60947-7-2:2009 · PE terminal blocks · ed 3.0 | 60947-7-1:2025 | NO |
| 25 | terminal_fuse | IEC 60947-7-3:2009 · Fuse terminal blocks · ed 2.0 | 60947-7-1:2025; 60269-1:2024 | NO |
| 26 | connector_industrial | IEC 61076-2-101:2024 · M12 circular · ed 4.0; 60309-1:2021+-2:2021 · CEE · ed 5.0 | 62443-3-3:2013 (switch security) — switch: no product std | NO — switch has **no dedicated IEC product standard** |
| 27 | cable_gland | IEC 62444:2010 · Cable glands · ed 1.0 | 60423; 60529 | NO |
| 28 | din_rail | IEC 60715:2017 · Mounting rails · ed 2.0 | 60947-1:2020 | NO |
| 29 | enclosure | IEC 62208:2023 · empty · ed 3.0; 61439-1:2020+-2:2020 · assembly · ed 3.0 | 60529:1989+A1:1999+A2:2013 (IP, ed 2.2); 60204-1 | NO |
| 30 | cable | IEC 60227-1:2024 · PVC ≤450/750 V · ed 4.0; 60245-1:2026 · rubber · ed 5.0 | 60228:2023 · conductors · ed 4.0; 60227-5/60245-5; 60332 | NO |
| 31 | alarm_unit | No dedicated IEC; panel indicator lights → 60947-5-1:2024 | GSM lift alarm: EN 81-28:2022 | **YES lift-alarm — EN 81-28:2022**; generic signalling: none |
| 32 | load_cell | No dedicated IEC product standard | OIML R60 (legal metrology) | **YES — OIML R60**; industrial non-legal: mfr spec |
| 33 | relay_general | IEC 61810-1:2015 · Elementary relays — general · ed 4.0 (AMD unconfirmed) | 61810-2; 60947-5-1:2024 | NO |
| 34 | passive_component | No single governing IEC product standard | R: 60115 series; C: 60384 series; inductors: none single | NO — component-type series |
| 35 | lighting | IEC 60598-1:2024 · Luminaires — general · ed 10.0 | 61347-2-13:2024 (LED gear); 62031; 60947-5-1:2024 (indicators) | NO |

## Low-confidence / disputed (verbatim)
- **IEC 60034-1 edition** — 2022 confirmed; anomalous "Edition 14.0" string on source page; ed 4.0 cited from domain knowledge, not independently confirmed.
- **IEC 60947-5-3:2026 (ed 3.0)** — brand-new (Aug 2026); only title+edition confirmed, scope thin.
- **IEC 61810-1** — base ed 4.0:2015 confirmed; possible AMD (2019?) unconfirmed.
- **IEC 62040-1** — base ed 2.0:2017 confirmed; AMD1:2021 unconfirmed.
- **Phoenix CAPAROC electronic breaker** — specific product standard unconfirmed; assumed IEC 60947-2.
- **ISO 14119:2024** — year confirmed (Sep 2024, replacing 2013); "ed 3.0" inferred.
- **IEC 60204-1** — edition unverified (believed ed 6.0:2016 + AMD1:2021).
- **IEC 62031 (LED modules)** / **IEC 61800-3 (drive EMC)** — editions uncertain.
- **power_supply primary** — judgement call: most DIN-rail SMPS carry IEC 62368-1; 61204-7/62477-1 are LV-SMPS-specific alternatives. Disputed which is "primary".
- **safety_relay / safety_brake / brake_controller** — genuinely no dedicated IEC product standard; functional-safety frameworks (61508/13849/62061) are the correct answer, flagged.
- **EN 81-28:2022** — current (genorma); successor FprEN 81-28 in progress.

## Sources (verbatim)
- IEC Webstore: webstore.iec.ch/en/publication/ 26973 (60947-1), 66277 (60947-2), 107159 (60947-3), 74487 (60947-4-1), 65935 (60947-5-1), 32517 (60947-5-2), 72949 (60947-7-1), 99295 (60269-1), 96037 (60269-2), 99296 (60269-3), 65314 (61643-11), 62103 (61800-5-1), 24556 (61800-5-2), 28614 (61800-5-3), 4555 (61131-6), 63115 (61496-1), 84133 (61496-3), 2452 (60529), 65473 (62026-2), 65385 (61558-2-16), 85913 (62208:2023), 71989 (60227-1:2024), 92635 (60245-1:2026), 26155 (61204-7), 77773 (61076-2-101), 7034 (62444), 544 (60068-2-6), 4907 (61204)
- standard.no (Standard Norge, NEK): nek-iec- 60034-1-2022, 60715-2017, 61439-1-2020, 61439-2-2020, 62368-1-2023, 60598-1-2024, 61508-1-2010, 62061-2021, 62040-1-2017, 60228-2023, 61558-1-2017, 61810-1-2015, 61347-2-13-2024, 60309-1-2021, 60309-2-2021, 62444-2010, 60670-1-2002, 62443-3-3-2013, 62026-3-2008, 60947-7-3-2009, 60269-4-2024, 60068-1-2013
- iteh.ai previews: iec-60947-5-5-2026, iec-60947-5-3-2026, IEC-61496-2-2020, IEC-60227-1-2024, IEC-60245-1-2026
- genorma.com: iso-14119-2024, iso-13849-1-2023, en-81-28-2022
- iso.org/standard/45291.html (ISO 14119:2013 withdrawal); knowledge.bsigroup.com (EN IEC 61131-2:2025, BS EN IEC 62208:2023); NSAI/Intertek/BSI edition cross-checks.
