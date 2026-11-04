---
{
  "format": 1,
  "metadata": {
    "id": "iec-60228-detailed-research-2026-11-02",
    "title": "IEC 60228 — detailed standards research",
    "question": "What are the scope, purpose, applicability, technical subject areas and related standards of IEC 60228?",
    "scope": "Detailed IEC 60228 research retained with original sources, edition qualifications and author limitations. Stored for later analysis; no conformity, legal, acquisition or machine-safety decision.",
    "summary": "Research produced by a separate Terra 6.1 worker at configured medium effort. Original report, result and source ledger preserved. Content analysis and NORMATIVE comparison are deferred.",
    "researched_at": "2026-11-02",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi via Mastra",
      "author": "unknown",
      "model": "openai-codex/gpt-6.1-terra"
    },
    "related_reports": [],
    "warnings": [
      "Unreviewed research stored for later analysis. Not an authoritative standard text, technical approval, certification or legal determination.",
      "Author source limits, partial findings and edition qualifications remain in the report and appended result/source ledger. No batch content analysis or NORMATIVE comparison was performed for this import.",
      "Configured worker effort was medium. Earlier bounded checks on initial reports are historical collection notes, not comprehensive publication or normative verification.",
      "Third-party sources retain their rights. Raw evidence is private; storage is not permission to publish licensed standards or supplier material.",
      "The raw REPORT.md is preserved unchanged as the prefix. A mechanical storage appendix adds the original author result/source ledger and explicit supplied citation definitions; it is not new research."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T18:17:00.000Z",
    "updated_at": "2026-11-04T18:17:00.000Z",
    "imported_at": "2026-11-02T23:50:29.955Z"
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
  "sourceDigest": "bd30ad2acf767b32a4b80bec242ebe0c18cdf472eba9f8cc894cefc22e6d9c4c",
  "proposalRevision": "c242f8f53b4e0f25beb67e5360c1a7f95873c977b29de8e7e815a9db9bcd4fb4"
}
---
# IEC 60228 — conductors of insulated cables

**Publication check:** 2026-11-02 UTC. **Research depth:** IEC public catalog scopes and lifecycle, not the complete standard. This report is an engineering reading guide, not conformity assessment or a substitute for the applicable edition and manufacturer evidence.

## Identity and edition

[IEC 60228:2023, *Conductors of insulated cables*](https://webstore.iec.ch/en/publication/71891), is an International Standard, edition 4.0, published 11 December 2023 by IEC TC 20. Its catalog describes it as a horizontal publication. IEC's [catalog search response](evidence/iec-api.json) lists it as published and the prior [IEC 60228:2004](https://webstore.iec.ch/en/publication/1065), edition 3.0, as revised; the lifecycle shown contains no later edition or amendment. The 2023 commented version is a separate explanatory product, not another normative edition. A catalog check is time-limited; it does not establish national adoption, regulatory effect, or the edition required by a particular contract. [S1, S2, S3]

The archived batch asserts 2004 while the historical master suggests 2023. The publisher resolves this conflict in favour of 2023 as the published edition, not the batch's 2004 currency claim. The publisher's 2023 abstract contains an apparent typo, “IEC 60028 ED4”; its page identity, context and lifecycle establish the intended assigned document as IEC 60228, not IEC 60028. The 2004 scope lists a smaller nominal upper range than the 2023 scope; do not treat the two as interchangeable. [S1, S2, L1]

## What problem it addresses and scope

The standard gives cable manufacturers and specifiers a common conductor vocabulary and a basis for construction and electrical resistance verification. The manufacturer's cable data and the specific cable standard then make that conductor useful within a complete insulated cable. IEC describes nominal metric cross-sectional areas from 0.5 to 3,500 mm² for conductors in a wide variety of electric power cables and cords; requirements include wire numbers and sizes and resistance values. Its covered constructions include solid, stranded and Milliken copper, aluminium and aluminium-alloy conductors for fixed installations, and flexible copper conductors. Applicability to a particular cable is determined by its cable-type standard. [S1]

IEC explicitly excludes conductors for telecommunication purposes. Unless an individual clause says otherwise, the publisher describes the target as the conductor **in the finished cable**, not a conductor supplied to make a cable. Thus it is not safe to assume that a wire material delivery certificate by itself demonstrates finished-cable conformity. The advertised nominal range is a scope range, not evidence that every material, class, construction or size combination exists in the tables. Consult the relevant table and cable standard. [S1]

## Conductor classes and technical subjects

The prior local batch identifies class 1 as solid, class 2 as stranded, and classes 5 and 6 as flexible and very flexible respectively. This is a useful orientation **but remains a historical research lead**: the public 2023 publisher abstract inspected here does not itself enumerate the classes, and the 2023 full text or preview was not accessible. Confirm exact definitions, applicable constructions and constraints from the standard before relying on this mapping as a normative classification. [L1, S1]

What can be stated directly from IEC's abstract: nominal size, the number and sizes of constituent wires, and resistance are core topics. The 2023 abstract identifies informative Annex B on temperature correction factors for resistance measurement and informative Annex C on guidance for circular-conductor dimensional limits. The use of a reference temperature matters when comparing a measured resistance with a specified value; do not compare unlike temperatures as if equivalent, or copy numerical limits from an older edition. The abstract does not disclose the full test procedure, all acceptance criteria or class-specific tables. [S1]

A nominal area is a designation used with the defined construction and resistance criteria; it is not, on its own, a complete measured cross-sectional-geometry tolerance, insulation rating, ampacity or cable outside diameter specification. This is an engineering distinction derived from the limited conductor focus, not a quotation of a particular clause. For manufacturer or laboratory work obtain the exact edition's applicable tables, measurement method, sample preparation and corrections; the catalog abstract cannot establish conformity. [S1]

**Dynamic use:** flexible conductor construction is not a qualification for a moving cable. A class number alone establishes neither permissible bend radius nor bending-cycle life, travel speed, acceleration, torsion, drag-chain installation, chemical resistance or temperature at motion. Those are questions for the complete cable's manufacturer-declared use limits and relevant complete-cable tests. A highly stranded core does not by itself demonstrate a suitable insulation, sheath, assembly or application. The historical batch's categorical lift-specific class-5 rule and asserted failure-cycle claims were not verified against the applicable lift-cable text; do not turn them into a universal rule. [L1; boundary inferred from S1's described conductor scope]

## Product standards, installation and electrical relevance

IEC 60228 describes the conductor; it expressly delegates cable-type applicability to the standard for that cable. For example, [IEC 60227-1:2024](https://webstore.iec.ch/en/publication/71989) covers specified rigid and flexible PVC-insulated cables and identifies particular cable types in companion parts and separate test-method documents. It is a cable-family general standard, not a substitute for selecting the exact cable-type part. [S1, S4] IEC's catalog entry [IEC 60227-6:1981](https://webstore.iec.ch/en/publication/14026) describes lift cables and flexible connections but marks this 1981 edition revised; it does not establish present requirements or the edition for a specific lift. [S5]

For selection, first identify the exact complete cable and intended fixed or moving duty, conductor material, nominal area, construction/class and supplier-declared edition. Then examine the finished-cable voltage, insulation/sheath, environmental and fire characteristics, and its complete-cable declaration as relevant. For moving service request bend radius, expected cycle duty, speed, torsion and installation limits, where applicable, for the exact product. Record unsupported parameters as unknown rather than inferring them from conductor class. For termination, use the terminal/connector manufacturer's allowed conductor classes, size range, preparation, ferrules where required and tightening instructions. These are engineering evidence questions, not requirements quoted from IEC 60228. [S1, S4]

Resistance information contributes to voltage-drop and loss considerations and is relevant to protective-circuit calculations, but the conductor designation alone cannot settle installation current-carrying capacity, short-circuit protection, protective-earth continuity, overcurrent coordination, fault disconnection or shock protection. Those depend on the actual cable, installation conditions, protective devices and applicable machine/installation rules. IEC 60204-1 is a separate machinery electrical-equipment route; consult the relevant edition and machine-specific scope rather than treating conductor conformity as machine compliance. The IEC abstract does not claim to provide those installation decisions. [S1]

## Functional safety and system boundary

IEC 60228 is a conductor standard, not a safety-related control subsystem certification. A conductor may carry signals or power in a safety function, making routing, physical damage, termination and fault behaviour significant at integration. Nonetheless, neither a class number nor conformity to this conductor standard alone establishes PL, SIL, Category, diagnostic coverage, fault exclusion or the integrity of a complete safety function. These are application-level assessment and validation matters under the selected safety framework, such as ISO 13849-1 where applicable. Do not derive safety metrics from the construction class. Purchased cables are assessed using published external characteristics and conditions; no reconstruction of proprietary internals is implied. [S1; engineering interpretation]

## Library implications and holdings

**Potential category:** `cable`, including fixed wiring, flexible cords and dynamic/drag-chain or lift cables as distinct intended-use subtypes. The previous archive also identifies the conductor-versus-dynamic-use boundary. [L2] In a component review ask: exact manufacturer and article, cable product standard and edition declared, conductor metal/area/class, voltage and temperature limits, termination compatibility, and evidence of the actual motion and environment duty. Preserve supplier-cited editions separately from IEC publication currency; no product approval or machine validation follows merely from a standard reference. No category, schema or approval-policy change is proposed.

`NORMATIVE_CANDIDATES.json` reports no matching PDFs, extracted markdown or memory candidate. A filename search under `NORMATIVE` also found no 60228 match; thus **no matching locally held full text was found**, rather than proof that no copy exists anywhere. The historical batch is a research reference, not normative full text. Recommendation: **conditional acquisition/update**, if a live cable specification, manufacturing inspection or disputed conductor-table/measurement question requires authoritative clause-level use. It is not necessary to acquire this standard merely because a purchased cable is in the library; retain manufacturer evidence and consult the applicable complete-cable standard when triggered.

## Sources and remaining gaps

- **S1:** [IEC 60228:2023 official product page](https://webstore.iec.ch/en/publication/71891), title, edition, scope and annex summary; `evidence/iec-71891.html`, `.txt`.
- **S2:** [IEC catalog search API](https://webstore-search-api.iec.ch/api/search), POST query `60228`, lifecycle and edition records; `evidence/iec-api.json`. A search response, not full text.
- **S3:** [IEC 60228:2004 official page](https://webstore.iec.ch/en/publication/1065), revised scope and status; `evidence/iec-1065.html`, `.txt`.
- **S4:** [IEC 60227-1:2024 official page](https://webstore.iec.ch/en/publication/71989), PVC cable-family scope and companion parts; `evidence/iec-71989.html`, `.txt`.
- **S5:** [IEC 60227-6:1981 official page](https://webstore.iec.ch/en/publication/14026), historical lift-cable identity and revised status; `evidence/iec-14026.html`, `.txt`. Do not confuse this ID with the 2001 edition.
- **L1:** local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md`, IEC 60228 section, historical and contested lead.
- **L2:** local `LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md`, category-routing and evidence boundaries.

The public IEC preview link returned an HTML error instead of a PDF (`evidence/iec-preview.pdf`, retained as received); complete normative clauses, class definitions, detailed changes, and lift-specific dynamic requirements were not independently inspected. Search interfaces also presented challenges. No EN adoption, OJEU status, supplier declaration, actual cable qualification, or installation compliance was verified. Seek the exact 2023 text and applicable cable-type/lift standards if a real design question needs them.


---

## Storage appendix — unreviewed research retained for later analysis

Original REPORT.md SHA-256: `390c526e4d8bc604a9fcc95e82b1949a51f5d2285afc2c427c18f8db6b88696a`.
Original source/result/evidence bundle: `/home/eldar/Projects/research_mcp/.research-local/execution/issue10-staging/imports/iec-standard-reports-fasp9w2d/raw/iec-60228`.
No additional standards analysis was performed for this storage operation. Preserve all original author limitations.

### Author result (verbatim JSON)

`````json
{
  "standard": "IEC 60228",
  "report": "REPORT.md",
  "status": "partial",
  "major_gaps": [
    "2023 full text and preview not inspected; classes independently unverified",
    "Specific lift cable class and dynamic requirements not independently verified",
    "No national adoption, OJEU or product-specific evidence checked"
  ],
  "local_holdings_summary": "No matching full text found in candidate inventory or NORMATIVE filename search; historical batch is a lead only."
}
`````

### Author source ledger (verbatim JSON)

`````json
{
  "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
  "sources": [
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/71891",
      "title": "IEC 60228:2023 edition 4",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": "evidence/iec-71891.html",
      "evidence_kind": "public scope",
      "coverage_limitation": "Abstract and lifecycle only; full clauses not inspected"
    },
    {
      "url_or_path": "https://webstore-search-api.iec.ch/api/search",
      "title": "IEC search query 60228; POST body in limitation",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": "evidence/iec-api.json",
      "evidence_kind": "publisher lifecycle search",
      "coverage_limitation": "POST {mode: FULL, query: 60228, validOnly: false}; not full text"
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/1065",
      "title": "IEC 60228:2004 edition 3",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": "evidence/iec-1065.html",
      "evidence_kind": "public scope",
      "coverage_limitation": "Revised prior edition"
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/71989",
      "title": "IEC 60227-1:2024 edition 4",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": "evidence/iec-71989.html",
      "evidence_kind": "public scope",
      "coverage_limitation": "Scope only"
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/publication/14026",
      "title": "IEC 60227-6:1981",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": "evidence/iec-14026.html",
      "evidence_kind": "public scope",
      "coverage_limitation": "Revised historical edition only"
    },
    {
      "url_or_path": "https://webstore.iec.ch/en/iec_catalog/product/preview/?id=L3B1Yi9wZGYvcHJldmlldy9pbmZvX2llYzYwMjI4e2VkNC4wfWIucGRm",
      "title": "IEC 60228:2023 preview attempt",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": "evidence/iec-preview.pdf",
      "evidence_kind": "failed preview",
      "coverage_limitation": "Response was HTML error, not PDF; retained with original filename"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/batch08-enclosure-cable-light-gemini.md",
      "title": "Historical batch 8 IEC 60228 section",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": null,
      "evidence_kind": "old research lead",
      "coverage_limitation": "Claims require verification; not primary text"
    },
    {
      "url_or_path": "/media/eldar/disk_2/Machine_concept/LIBRARY/ELECTRIC/research/iec-standard-scope-2026-08/README.md",
      "title": "Prior research guide",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": null,
      "evidence_kind": "old research lead",
      "coverage_limitation": "Category routing; not current standard"
    },
    {
      "url_or_path": "NORMATIVE_CANDIDATES.json",
      "title": "Local candidate inventory",
      "access_time_utc": "2026-11-02T23:06:54.110711+00:00",
      "evidence_path": null,
      "evidence_kind": "local inventory",
      "coverage_limitation": "No matching candidates; filename search does not prove global absence"
    }
  ]
}
`````
