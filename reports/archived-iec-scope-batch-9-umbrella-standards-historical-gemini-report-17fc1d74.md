---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-9-umbrella-standards-historical-gemini-report-17fc1d74",
    "title": "IEC scope batch 9: umbrella standards — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 9: umbrella standards — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 9: umbrella standards — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 9: umbrella standards — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
      "Prior inventory classification (not a completion verification): partial",
      "Safety, legality, standards-edition and mandatory-component claims in this historical report are unverified and must not be used as present engineering/compliance assurance.",
      "Archived IEC batch assertions have known qualifications in the original local README/PRIMARY_SOURCE_CHECKS/SAFETY_SOURCE_REVIEW companions. Newer individual IEC investigations are included in this archive; do not treat old batch defaults as normative rules."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:40.440Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "17fc1d749c28a938492e5066b150c8104c1921328412825319a87563d4f6a982",
  "proposalRevision": "4824941af57bba5374f5fc6c6cf410813e968b47f370a036f67e2fcdfffcf5c7"
}
---
# Batch 9 — Umbrella / cross-cutting standards · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 1,000,977 · status completed · 2026-08-28.
**Standards:** 60204-1, 60529, 60664-1, 62262, 61000-6-2. FULL report (minor front trim).

---

## IEC 60204-1 — Electrical equipment of machines (integration layer)
- **current_edition:** **ed 6.0:2016** (Webstore 26037; iteh iec-60204-1-2016; +A1 in some regions). EN 60204-1 harmonized.
- **when:** the machine-integration umbrella — EN 81-20 **Clause 5.10** mandates it for all lift electrical equipment.
- **for_what:** how CE-marked components integrate into a safe machine — wiring colour-code, 400V↔24V routing/cross-talk, equipotential bonding/earthing strategy, e-stop logic, single lockable main disconnect (LOTO), field fault-loop impedance.
- **role:** **machine-integration layer — sits ABOVE all component product standards.** "The mortar, not the bricks."
- **related:** all product standards; ISO 12100, 13849-1, 62061.

## IEC 60529 — IP code (ingress protection)
- **current_edition:** **ed 2.2 = 1989 + A1:1999 + A2:2013** (Webstore 64427).
- **when:** invoked BY every enclosure/device standard to assign ingress rating.
- **for_what:** IP first digit (solids/finger 0–6) + second digit (water 0–8). e.g. IP20 finger-safe, IP54 dust/splash.
- **role:** umbrella rating (referenced, not standalone). **related:** 62208, 62262, all product stds.

## IEC 60664-1 — Insulation coordination
- **current_edition:** **ed 3.0:2020** (Webstore 59671; iteh iec-60664-1-2020; GSO cites 2024 adoption).
- **when:** invoked BY every product standard to size clearance/creepage (e.g. 60947-4-1 points here for contactor gaps).
- **for_what:** **clearances** (air) + **creepage** (surface) from working voltage × **OVC I–IV** × **Pollution Degree 1–4** × material CTI group. Anti-tracking grooves add creepage without footprint.
- **PD table (lift):** PD1 sealed/potted · **PD2 = sealed IP54+ machine-room cabinet** · **PD3 = shaft/pit** (brake carbon dust, guide-rail filings, humidity) · PD4 outdoor. A PD2-rated block in a PD3 pit → tracking failure → shorts safety chain.
- **role:** fundamental physical design rule. **related:** 60947-1, 61010-1, 62368-1.

## IEC 62262 — IK code (mechanical impact)
- **current_edition:** **ed 1.1 = 2002 + A1:2021** (Webstore 80714).
- **when:** COP, landing call fixtures, shaft/pit enclosures exposed to impact/vandalism (EN 81-20 structural-strength reqs).
- **for_what:** IK00–IK10 impact energy in Joules. **IK10 = 20 J** (5 kg from 400 mm). Pendulum/spring/drop-weight tests. Impact often breaches the IP seal → paired with 60529.
- **role:** mechanical robustness / vandal rating. **related:** 60529, 60068-2-75.

## IEC 61000-6-2 — EMC generic immunity (industrial)
- **current_edition:** **ed 3.0:2016** (Webstore 25630; replaces 2005 ed2).
- **when:** active electronics in heavy inductive-switching / high-current environment (= lift machine room) where no product-family EMC std covers it.
- **for_what:** immunity 0 Hz–400 GHz so 24V logic doesn't crash when 400V motor/contactor switches. Pulls test levels from **61000-4-x**: -4-2 ESD, -4-4 EFT/burst, -4-5 surge, -4-6 conducted RF. Presumption of conformity to EMC Directive 2014/30/EU.
- **role:** generic EMC immunity. **related:** **61000-6-4 (emission)**, 61000-4-x, **EN 12015/EN 12016 (lift-specific EMC)**.
- **immunity vs emission:** 6-2 = how much noise it WITHSTANDS; 6-4 = how much it may EMIT (industrial Class A less strict than residential Class B/6-3). "Shout softly (6-4), thick skin (6-2)." VFD = big emitter.

---

## Physics-engine-vs-mortar synthesis (the whole point of this batch)
Umbrella standards are rarely on the DoC — product standards **inherit them by reference**: a 60947-4-1
contactor gets clearance/creepage from **60664-1**, IP20 from **60529**, immunity from **61000-6-2**.
Then **60204-1** sits above everything as the machine layer: aggregating safe components ≠ safe machine —
it governs bonding, wire colour, routing, main disconnect. EN 81-20 §5.10 pins it.

## Bonus — lift-specific EMC (not in original 50, worth noting)
**EN 12015** (emission) + **EN 12016** (immunity) = lift product-family EMC standards. For baseline
component/panel design the 61000-6-2/-6-4 generics remain the fallback benchmark.

## Sources (Gemini, 69) — key IEC-primary
Webstore: 26037 (60204-1), 64427 (60529), 59671 (60664-1), 80714 (62262), 25630 (61000-6-2).
iteh: iec-60204-1-2016, iec-60529-1989-amd2-2013, iec-60664-1-2020, iec-62262-2002-amd1-2021.
evs.ee 61000-6-2-2016; celectronics (6-2 vs 6-4); nobelcert EN 12016. All editions consistent w/ master.
