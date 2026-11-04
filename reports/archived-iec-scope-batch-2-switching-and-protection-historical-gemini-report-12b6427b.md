---
{
  "format": 1,
  "metadata": {
    "id": "archived-iec-scope-batch-2-switching-and-protection-historical-gemini-report-12b6427b",
    "title": "IEC scope batch 2: switching and protection — historical Gemini report",
    "question": "What findings, alternatives and limitations does the historical investigation document about IEC scope batch 2: switching and protection — historical Gemini report?",
    "scope": "Historical PLC/orchestration or component-standard research: IEC scope batch 2: switching and protection — historical Gemini report. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: IEC scope batch 2: switching and protection — historical Gemini report. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
    "researched_at": "2026-08-27",
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
    "imported_at": "2026-11-04T21:30:39.351Z"
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
  "sourceDigest": "12b6427b477f523ac1a4d83b88632f580e4b32c98346a4fb7e368948e6644e24",
  "proposalRevision": "d92ea0a9e5ead4e6f2c4f98aaeab94793ade57a36557c71f3aa84869f692591e"
}
---
# Batch 2 — Switching & protection (IEC 60947 series) · SOURCE: Gemini Deep Research

**Agent:** `deep-research-preview-04-2026` · tokens 2,255,229 · status completed · 2026-08-27.
**Standards:** 60947-1, 60947-2, 60947-3, 60898-1, 60947-4-1.

> ⚠ Gemini payload again opened mid-report (§5.3) — **detailed sections for 60947-1, -2, -3,
> 60898-1 were truncated from the returned text.** Captured below: the 60947-4-1 safety detail
> (Annex K / Annex F — the highest-value part for the lift safety chain) + the conclusion that
> summarizes all five. Editions to confirm via IEC Webstore per the source list.

---

## IEC 60947-4-1 — Contactors & motor-starters (captured in full)
- **title:** LV switchgear & controlgear — Part 4-1: Contactors and motor-starters — Electromechanical contactors and motor-starters
- **current_edition:** iec.ch/74487 (60947-4-1). Prior samples 2009 / 2018 cited; **confirm 2023 ed 5.0 on Webstore**. Utilization categories referenced: AC-3, **AC-3e**, AC-4, DC-13.
- **when:** switching the traction-motor line contactor + brake contactors; any contactor that executes a safety function (drop motive power + apply brake on UCM/overspeed fault detected by PLC/safety node).
- **for_what:** making/breaking under motor utilization categories; **two safety appendices critical to the EN 81-20 safety chain:**
  - **Annex K — B₁₀d value:** switching cycles at which 10% of samples fail dangerously (contacts welded). Extracted from the manufacturer declaration to compute PL/SIL per ISO 13849-1 / IEC 62061 over the 20-yr life.
  - **Annex F — mirror / mechanically-linked contacts:** guarantees the N.C. auxiliary feedback contact *cannot close* if main power contacts weld shut → PLC never gets a false "safe" signal. Non-negotiable in lift safety feedback. (Auxiliary-relay equivalent = 60947-5-1 Annex L.)
- **role:** Component / product safety.
- **related:** ISO 13849-1 + IEC 62061 (uses Annex K data for SIL/PL); constrained by 60947-1 general rules; contrast NEMA ICS 2 (US).

---

## Conclusion summary (all five — Gemini verbatim-condensed)
- **60947-1** — general physical/thermal/dielectric rules anchoring the whole series (clearance/creepage, temp, dielectric). Ed cited iecee 60947-1:2020.
- **60947-2** — industrial circuit-breakers: withstand + interrupt massive prospective short-circuits (Icu/Ics) without enclosure failure. For the main drive protection.
- **60898-1** — household-type MCBs for **ordinary/unskilled persons**: auxiliary lighting + socket circuits where building staff interact with final circuits. (Role split vs 60947-2 = skilled-person industrial.)
- **60947-3** — switch-disconnectors: fulfils the **EN 81-20 isolation mandate** (safe lockout-tagout for technicians) without cutting emergency shaft lighting. Ed cited iecee 60947-3:2020. iec.ch/59785 referenced.
- **60947-4-1** — contactors (detail above).

## Editions to verify (source list)
60947-1:2020 (iecee), 60947-3:2020 (iecee, iec.ch/59785), 60947-4-1 (iec.ch/74487 — confirm 2023 ed 5.0),
60947-2 (confirm 2024 ed 6.0 per master), 60898-1 (confirm 2015+A1:2019 per master).

## Sources (Gemini, 45) — key
iec.ch: 74487 (60947-4-1), 59785 (60947-3-adjacent). iecee: 60947-1-2020, 60947-3-2020.
iteh samples: 60947-1-2007(+AMD1), 60947-4-1-2009/2018. abb/rockwell (safety contactors, Annex F/K),
se.com "tale of two standards" (60898-1 vs 60947-2), stoklink/viox/onesto (MCB role split). Full list in transcript.

> NOTE: Gemini's front-truncation recurred on both batch-1 and batch-2 long reports. For your
> online runs, if an agent's answer looks cut at the front, re-request the missing standards
> individually (as we did with the batch-1 fill run) — cheaper and reliably complete.
