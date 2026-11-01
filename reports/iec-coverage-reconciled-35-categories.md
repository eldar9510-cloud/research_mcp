---
{
  "format": 1,
  "metadata": {
    "id": "iec-coverage-reconciled-35-categories",
    "title": "Reconciled IEC product-standard coverage for 35 categories",
    "question": "How does the three-source reconciliation classify IEC coverage and genuine non-IEC gaps across industrial component categories?",
    "scope": "Product-standard existence/classification for a 24 V DC/400 V AC machinery/lift-adjacent library; not per-part compliance or a verified current normative dossier.",
    "summary": "Reconciles A errors with B edition claims and C role classification, retaining gaps, local holdings and machine-context caveats.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "unknown",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [
      {
        "id": "iec-coverage-gemini-historical-source",
        "relationship": "corrects"
      },
      {
        "id": "iec-coverage-opus5-edition-source",
        "relationship": "reuses"
      }
    ],
    "warnings": [
      "Imported without fresh source or technical verification; historical findings are not current compliance, safety or legal certification.",
      "Original report bytes/citations are preserved. Third-party quotations, code and sources retain their own rights; unresolved local/transcript references remain unavailable.",
      "Source C YAML/SSOT outside eligible report children; not inspected.",
      "Currency/verification wording is historical and unchecked.",
      "Product-standard existence is explicitly not per-part compliance.",
      "Local PDF/normative holdings are unavailable; do not import them or infer rights.",
      "Selected A/B basenames resolve within proposed set.",
      "Uninspected 2026-08-27-iec-coverage-source-component-map.yaml and NORMATIVE/data/component_standards_map.yaml.",
      "LIBRARY/ELECTRIC, NORMATIVE/STANDARDS_PDF, ASM.PANEL and verified_editions references local-only.",
      "Local library/standards holdings and dossier priorities."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:31:34.705Z",
    "updated_at": "2026-11-01T23:31:34.705Z",
    "imported_at": "2026-11-01T20:38:59.808Z"
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
      "code": "unverified_relationship",
      "message": "Relationship to iec-coverage-gemini-historical-source is unverified until reviewed."
    },
    {
      "code": "unverified_relationship",
      "message": "Relationship to iec-coverage-opus5-edition-source is unverified until reviewed."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "f54e43a90cf9dc845f2ec313a11708e415c57883f6ad18b1b2469d3a1533d1a9",
  "proposalRevision": "1df5a063ae973a865b30bedaa606366440a351eda610f1d682b0aefe6213da9d"
}
---
# IEC product-standard coverage — 35 library categories · RECONCILED MASTER

**Question (2026-08-27):** For each of 35 industrial electrical / electro-mechanical
component categories in LIBRARY/ELECTRIC (EN 81 machinery/lift-adjacent LV control
system, 24V DC control + 400V AC power, ISO 13849 / EN 62061 context): the governing
IEC product standard (number + title + current edition), secondary IEC standards, and
categories with NO dedicated IEC product standard (ISO / EN / OIML instead).

## Three independent sources (confront)

| Src | Method | File | Verdict |
|-----|--------|------|---------|
| A | Gemini Deep Research (component-first) | `2026-08-27-iec-coverage-source-gemini.md` | Good gap framing (EN 81-28, OIML R60); **4 wrong product numbers** (MCB→60934, PSU→61010-2-201, safety_relay→61810-3, Ethernet→61850-3) + **systematically stale editions** |
| B | Opus-5 web-verified subagent | `2026-08-27-iec-coverage-source-opus5-subagent.md` | **Freshest editions** (live IEC Webstore / standard.no / iteh / genorma, Aug 2026); tiebreak authority |
| C | Structured role-typed map | `2026-08-27-iec-coverage-source-component-map.yaml` + SSOT copy `NORMATIVE/data/component_standards_map.yaml` | **Strongest** — product/application/functional-safety role split, honest gaps, refuses invented citations |

Resolution rule: **C for classification, B for edition currency, A discarded where it conflicts.**
Disputed row `hmi_panel` resolved 2-of-3 (B+C) → **IEC 61131-2**.

---

## Locked 35-category verdict (current editions)

| # | Category | Governing standard (current ed.) | Verdict |
|---|----------|----------------------------------|---------|
| 1 | power_supply | **IEC 62368-1:2023** (+61204-7, 61558-2-16) | IEC |
| 2 | ups | IEC 62040-1:2017 | IEC |
| 3 | main_switch | IEC 60947-3:2020+A1:2025 | IEC |
| 4 | circuit_protection (MCB) | **IEC 60947-2:2024** (household 60898-1) | IEC |
| 4b | circuit_protection (electronic, CAPAROC) | 60947-2 assumed, unconfirmed | IEC (partial) |
| 5 | fuse | IEC 60269-1:2024 (+-2/-3/-4) | IEC |
| 6 | surge_protection | IEC 61643-11:2025 | IEC |
| 7 | contactor | IEC 60947-4-1:2023 (Annex F safety) | IEC |
| 8 | vfd | IEC 61800-5-1:2022 (+-5-2:2016 STO) | IEC |
| 9 | motor | IEC 60034-1:2022 | IEC |
| 10 | safety_plc | IEC 61131-2:2017 + **61131-6** + 61508 | IEC |
| 11 | safety_relay (module) | **GAP** — 13849-1/62061/61508 + 60947-5-1 contacts | **non-IEC** |
| 12 | standard_plc | IEC 61131-2:2017 | IEC |
| 13 | encoder | **GAP** (general); safety → IEC 61800-5-3:2021 | **non-IEC** |
| 14 | light_curtain | IEC 61496-1/-2:2020 | IEC |
| 15 | laser_scanner | IEC 61496-1:2020 / -3:2025 | IEC |
| 16 | door_interlock | IEC 60947-5-3 (electronics) + **ISO 14119:2024** (design) | IEC + ISO |
| 17 | limit_switch | IEC 60947-5-1:2024 | IEC |
| 18 | inductive_sensor | IEC 60947-5-2:2019 | IEC |
| 19 | safety_brake | **GAP** — **EN 81-50** (lift) + ISO 13849 | **non-IEC** |
| 20 | brake_controller | **GAP** — functional-safety frameworks only | **non-IEC** |
| 21 | e_stop | IEC 60947-5-5:2026 + **ISO 13850:2015** (design) | IEC + ISO |
| 22 | hmi_panel | **IEC 61131-2:2017** (+62368-1) | IEC |
| 23 | terminal_feedthrough | IEC 60947-7-1:2025 | IEC |
| 24 | terminal_pe | IEC 60947-7-2:2009 | IEC |
| 25 | terminal_fuse | IEC 60947-7-3:2009 | IEC |
| 26 | connector_industrial | IEC 61076-2-101:2024 (M12) / 60309 (CEE) / 61984 | IEC |
| 26b | Ethernet switch | **GAP** — no product std (62443 security only) | non-IEC |
| 27 | cable_gland | IEC 62444:2010 | IEC |
| 28 | din_rail | IEC 60715:2017 | IEC |
| 29 | enclosure | IEC 62208:2023 (empty) / 61439-1/-2:2020 (assembled) | IEC |
| 30 | cable | IEC 60227-1:2024 (PVC) + **60228:2023** (conductor) | IEC |
| 31 | alarm_unit | **GAP** — **EN 81-28:2022** (lift); generic signalling none | **non-IEC** |
| 32 | load_cell | **GAP** — **OIML R60** | **non-IEC** |
| 33 | relay_general | IEC 61810-1:2015 | IEC |
| 34 | passive_component | series only (60115 R / 60384 C), no single std | IEC (series) |
| 35 | lighting | IEC 60598-1:2024 (+61347-2-13 LED gear) | IEC |

**Tally:** ~27/35 clean IEC product-standard coverage · **8 genuine gaps** (safety_relay, encoder-general, safety_brake, brake_controller, load_cell, alarm_unit, Ethernet switch, electronic-breaker subclass) · 2 IEC-but-design-governed-by-ISO (door_interlock, e_stop).

## "How many standards" — full covering count
- **~13 IEC families** cover the clean set. **IEC 60947 series alone = 11 categories.** Add IEC 61810 + 61496 + 61800-5 + 61131 and every switching/sensing/drive/control part is covered.
- **+5 cross-cutting umbrella** (per Source C): IEC 60204-1 (integration), 60529 (IP), 60664-1 (insulation coordination), 62262 (IK), 61000-6-2 (EMC immunity).
- **+5 non-IEC gap-fillers:** EN 81-50, EN 81-28, ISO 14119, ISO 13850, OIML R60 (+ ISO 13849 / IEC 62061 for the functional-safety layer).

## HAVE vs MISSING (vs NORMATIVE/STANDARDS_PDF holdings)

**HAVE ✅ (system/design layer):** IEC 60204-1:2016, ISO 12100, ISO 13849-1:2015/-2:2012,
EN 62061:2005+A2:2015, EN 61508-6:2010, IEC 61496-1/-2:2020 + -3:2018, IEC 61800-5-2:2007
(⚠ stale — current is 2016 ed.2), ISO 13850:2015, ISO 14119:2013 (⚠ current is 2024 ed.3),
EN 81-20/-31/-41/-42/-50/-73, ISO 8100 series.

**MISSING ❌ (device-cert layer — mostly supplier's burden, cite-only for the dossier):**
whole IEC 60947 series · 61810 · 61131-2/-6 · 60269 · 62040-1 · 60034-1 · 62368-1 ·
60228 · 60598-1 · 61643-11 · 62208/61439 · 61984/61076 · 62444 · 60715.

## Acquisition shortlist (what actually matters for a self-contained dossier)
1. **Refresh IEC 61800-5-2 → 2016 ed.2** (held copy is 2007, two editions behind).
2. **Refresh ISO 14119 → 2024 ed.3** (held copy is 2013).
3. **Umbrella docs you lack:** IEC 60529 (IP), IEC 60664-1 (insulation coordination), IEC 62262 (IK), IEC 61000-6-2 (EMC immunity).
4. **Gap-fillers:** EN 81-28:2022 (alarm_unit), OIML R60 (load_cell).
5. 60947 series = nice-to-have only; each device carries its own declaration, rarely cited whole in a machine dossier.

## Machine-context caveat
Verdicts are **product-standard existence**, not per-part compliance. On machinery, IEC 60204-1
is the integration umbrella; for machine-mounted control enclosures it governs over IEC 61439
(Source C, ASM.PANEL note). Editions marked LOW confidence in the SSOT (`verified_editions`)
must be re-checked on iec.ch before quoting in a technical file.
