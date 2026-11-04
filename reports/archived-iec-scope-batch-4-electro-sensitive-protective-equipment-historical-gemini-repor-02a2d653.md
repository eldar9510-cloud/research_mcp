---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-4-electro-sensitive-protective-equipment-historical-gemini-repor-02a2d653",
    "title": "IEC scope batch 4: electro-sensitive protective equipment — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 4: electro-sensitive protective equipment — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 4: electro-sensitive protective equipment — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 4: electro-sensitive protective equipment — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
    "imported_at": "2026-11-04T21:30:39.608Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "02a2d65343612e4544cd9197936a66f4818cc0feb44b626dde2e6eb84d6cc37e",
  "proposalRevision": "99dffa6cac305cd8c2957fa25597bebc540831c5ded8e0fcfe2452fdd6bbc4d1"
}
---
# Batch 4 — ESPE opto-safety (IEC 61496) · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 929,763 · status completed · 2026-08-28.
**Standards:** 61496-1, 61496-2, 61496-3.

> ⚠ Gemini payload opened at "Strategic Application" — the per-standard record headers were
> front-truncated. Captured: Type→SIL/PL mapping, verified editions (from source list), and the
> full AOPD-vs-AOPDDR selection logic for EN 81-20. Editions confirmed via IEC Webstore pubs.

---

## IEC 61496-1 — ESPE general requirements
- **title:** Safety of machinery — Electro-sensitive protective equipment — Part 1: General requirements and tests
- **current_edition:** **ed 4.0:2020** — Webstore pub 63115. (Prior 2012 ed 3.0.) EMC/immunity + environmental baseline updated.
- **when:** baseline for ANY ESPE (light curtain, scanner) — sets the Type classification + environmental resilience limits every ‑2/‑3 device inherits.
- **for_what:** defines **ESPE Type 2 / Type 3 / Type 4** and their integrity ceiling. **Type 4 → SIL 3 / PL e; Type 3 → SIL 2 / PL d; Type 2 → SIL 1 / PL c** (periodic-test class). Environmental (temp, EMC, optical interference), OSSD output behaviour, response-time declaration.
- **role:** Product safety (general-requirements umbrella for the series).
- **related:** IEC 61508, ISO 13849-1, IEC 62061, ISO 13855 (safety distance), IEC 62046 (presence-sensing application).

## IEC 61496-2 — AOPD (light curtains)
- **title:** …Part 2: Particular requirements for active opto-electronic protective devices (AOPD)
- **current_edition:** **ed 4.0:2020** (EN IEC 61496-2:2020) — Webstore pub 63117 / iteh EN-61496-2-2020.
- **when:** point-of-operation planar guarding — the EN 81-20 §5.3.6.2.1.1 door-obstruction mandate: non-contact curtain from 25 mm to 1600 mm above sill, resolution ≤50 mm (child's arm). Legacy single-point photocells now OUTLAWED.
- **for_what:** dense 2D IR-beam plane; resolution 30–40 mm (≥36 diodes) satisfies the 50 mm rule; response ≤5–15 ms → arrests door motor within the 10 J (normal) / 4 J (degraded) kinetic-energy limits. Near-zero ISO 13855 C-factor → mounts flush in door frame.
- **role:** Product safety (AOPD particular requirements).
- **related:** 61496-1, ISO 13855, EN 81-20.

## IEC 61496-3 — AOPDDR (safety laser scanners)
- **title:** …Part 3: Particular requirements for active opto-electronic protective devices responsive to diffuse reflection (AOPDDR)
- **current_edition:** **ed 4.0:2025** (EN IEC 61496-3:2025) — Webstore pub 84133 / iteh EN-61496-3-2025. (Supersedes 2018.)
- **when:** volumetric presence-sensing of large voids — EN 81-20 pit / car-roof refuge-space monitoring, technician protection against UCM. Eliminates the light-curtain "pass-through" blind spot (person steps past the plane, beams re-establish, controller wrongly assumes clear).
- **for_what:** time-of-flight 270° radial floor scan; true continuous presence (not access) detection; dynamic warning-zone / protection-zone switching mapped to refuge-space dimensions; OSSD to 24V controller. **Structurally limited to Type 3 / SIL 2 / PL d** — fine for start-prevention / slow-inspection, not close-proximity fast-motion arrest.
- **role:** Product safety (AOPDDR particular requirements).
- **related:** 61496-1, ISO 13855, EN 81-20, IEC 62046.

---

## Key selection logic (EN 81-20)
| Situation | Correct device | Why |
|-----------|---------------|-----|
| Car/landing door obstruction | **‑2 light curtain** | planar point-of-operation, ≤50 mm res, ≤15 ms, near-zero C-factor, flush mount. Scanner's 850 mm C-factor + 60–134 ms = non-compliant here. |
| Pit / car-roof refuge presence | **‑3 laser scanner** | volumetric floor scan kills pass-through blind spot; zone-maps refuge; Type 3/SIL 2 adequate for start-prevention. |

**Type→integrity ladder:** Type 4 = SIL 3 / PL e · Type 3 = SIL 2 / PL d · Type 2 = SIL 1 / PL c.
Detection capability from ‑1/‑2/‑3 lab tests feeds **ISO 13855** minimum-safety-distance calc (S = K·T + C).

## Sources (Gemini, 61) — key IEC-primary
Webstore pubs: 63115 (61496-1), 63117 (61496-2), 84133 (61496-3), 5500/5501, 27378.
iteh: EN-61496-2-2020, EN-61496-3-2025, IEC-61496-1-2012. pilz/analog (Type→SIL), avire (EN 81-20 curtains),
sick/keyence/hokuyo (curtain vs scanner), ISO 13855 calculators. Full list in transcript.
