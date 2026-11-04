---
{
  "format": 1,
  "metadata": {
    "id": "archived-risk-assessment-engineering-source-context-0f8e7df9",
    "title": "Risk-assessment engineering — source context",
    "question": "What findings, alternatives and limitations does the historical investigation document about Risk-assessment engineering — source context?",
    "scope": "Historical risk-assessment/ISO GUI source and design study: Risk-assessment engineering — source context. Original normative/private-source boundaries, planning status, exact revision references and unresolved questions are retained.",
    "summary": "Source/reasoning and interaction research for Risk-assessment engineering — source context. Distinguishes planned GUI behavior, source meaning and actual implementation; not an adopted method or validated machine result.",
    "researched_at": "2026-10-04",
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
      "Prior inventory classification (not a completion verification): working context / partial",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication.",
      "Private or licensed book/standard/study sources are referenced, not supplied as assets. Publication covers the report analysis only; it does not grant readers access to those sources or relicense them."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:40.768Z"
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
  "sourceDigest": "0f8e7df968991fb51f683f66900ae0ddfc92decbbd4ebb5d4b45d7c3c62162e7",
  "proposalRevision": "6eeece0f68d229f565339f47bd3f21330a45baa21be1309dc25bb7c85b67e96a"
}
---
# Risk-assessment engineering — source context

**Read-through:** 2026-10-04. **Status:** cited working context, not an adopted specialist baseline, new methodology decision, or machinery assessment.

This pass reopened relevant passages in the supplied **MinerU Markdown** for Jespen, Suva and the ISO/IEC sources below. Existing consultant inventories helped locate passages; they were not substituted for the primary extracts. QMD located project documentation and book passages; ISO extracts outside its project-local collection were read directly. No PDFs were opened, sources re-extracted, external research/consultation calls launched, or QMD collection scope expanded.

Read this alongside [existing methodology decisions](../methodology/source-basis-and-decisions.md), [procedure contracts](../methodology/procedure-contracts.md), and [source consultants](source-consultants.md). It does not replace those documents. Existing consultation records remain retained; **no fresh specialist consultation or conflict resolution was performed**. Any new adoption involving Jespen or ISO/TR 22100 still follows the consultant protocol and document-transmission permissions.

## 1. Source roles and boundaries

- **ISO 12100:2010** supplies the overall design-risk-assessment and reduction framework: machinery limits → hazard identification → estimation → evaluation → reduction, iterated as necessary. Its scope concerns harm to people, not property/environment risk assessment. [RA, §1, L200–223; §4, L718–768]
- **Applicable type-B and type-C standards** provide specific safety aspects, protective-measure requirements and verification provisions. Their mere presence in a library does not establish applicability to a particular machine. ISO/TR 22100-1 explains how to check machine limits, significant-hazard coverage and suitability of prescribed measures. [TR1, §§5.2–6.2.2, L209–348]
- **ISO/TR 14121-2:2012** is practical guidance on the assessment steps and alternative tools, not a compulsory scoring system. [TOOLS, §1, L117–142; §4.2.3, L187–196]
- **ISO/TR 22100 parts 1–5** explain interfaces with the ISO 12100 process. Technical-report guidance is not interchangeable with the applicable primary-standard requirements. [TR1, §6; TR2, §§1, 4–5; TR3, §§1, 5; TR4, §1; TR5, §1]
- **Suva 66037.e** is a practical guide and the project's selected estimation method on supported routes. The supplied filename says 2024, but the publication identifies its **revised edition as September 2017**. [SUVA, colophon, L1424–1438]
- **Jespen (2016)** supplies supplementary engineering reasoning and method-selection guidance. Its legal commentary, standard listings and method-specific acceptance examples are publication-era material, not current legal determinations or universal thresholds. [JESPEN, §§3.2.2–3.2.4, L1744–1914; §§5.7–5.8, L7229–7304]

These roles follow the existing project methodology. A requirement in an applicable standard is not, by itself, a finding that the standard is legally mandatory or currently harmonised. Jurisdiction, applicable legislation, amendments, listing status and current editions remain separate checks. The product's **one individual machine plus relevant interfaces** boundary is project scope: the source framework can also describe integrated machinery. [RA, §5.3.1, L847–851; SUVA, §8.1, L478–494]

## 2. Context for the five engineering capabilities

### A. Develop hazard scenarios from machine information

**Primary basis:** RA §§5.2–5.4 and Annex B; TOOLS §§5.2–5.3.4; SUVA §§8.1–8.2; JESPEN §§5.3–5.4.

1. Establish use, space, time and other limits, intended use, foreseeable misuse, user populations, energies, processed materials and environment. Revisit the basis as design information changes. [RA, §§5.2–5.3, L793–906]
2. Examine both **machine functions/parts** and **human tasks** across lifecycle phases, modes, normal operation, malfunctions and foreseeable behaviour. Include non-task-related events; a production-only action list is insufficient. [RA, §5.4, L907–1002; TOOLS, §§5.2.2–5.2.3, L213–254]
3. Describe scenarios in machine-specific terms: hazard origin/location → exposed person and task/situation → event or prolonged exposure → credible harm. Generic labels such as “crushing” do not describe the accident course. [TOOLS, §§5.3.1–5.3.3, L255–301]
4. Use Annex B as a starting checklist, not exhaustive coverage evidence. Complement top-down consequence checks with bottom-up failure/misuse reasoning where appropriate. HAZOP, FMEA and fault trees have different prerequisites and blind spots; none is an automatic universal replacement. [RA, Annex B.1–B.2, L2511–2548; TOOLS, §5.3.2, L273–289; JESPEN, §§5.4–5.4.5, L6828–6997]
5. Suva explicitly recommends cause analysis using three questions: why exposure occurs, why the hazardous event occurs, and why harm cannot be avoided. It also explicitly distinguishes this advice from an ISO 12100 requirement to determine causes. [SUVA, §8.2, L584–595]

**Working-context implication, not a new schema:** a drafted scenario needs machine evidence, its exposure/event/harm course, assumptions and information gaps. The source checklists help challenge coverage; generating a list does not prove completeness. This is consistent with existing P1–P3.

### B. Consult applicable standards and specialist guidance

**Primary basis:** TR1 §§5–6; SUVA §§5.2, 7.2; relevant type-B clauses in §3 below.

- Search for a relevant type-C standard, then check **actual machine scope, significant hazards, protective provisions, alternative-selection criteria and verification needs**. Application of a type-C standard does not dispense with the overall ISO 12100 assessment. [TR1, §§5.3.2, 6.2.1–6.2.2, L251–348]
- For uncovered parts/hazards, follow ISO 12100 with relevant type-B support. Alternative type-C measures without choice criteria still require a specific risk assessment. [TR1, §6.2.1 and step 4B, L283–291, L314–322]
- Keep the sources' relief statements distinct: TR1 discusses individual **estimation** relief for covered significant hazards; Suva gives conditions for omitting **evaluation**, and calls for full implementation of the assigned measures. The existing project's per-scenario routing synthesis is Decision D4, not a quotation from either source alone. [TR1, §6.2.2 step 3, L300–306; SUVA, §7.2, L417–450; existing D4]
- A book's reference to a standard is a navigation aid, not access to that standard's technical clauses. Likewise, a catalogue title or edition is not machine-specific evidence of compliance. [JESPEN, §3.2.2, L1744–1774; TR1, §§5.3.2, 6.2.2]

**Working-context implication:** applicability and coverage reasoning belongs with the particular scenario/proposed measure, with explicit uncovered questions. No type-C standard has been selected in this pass because no particular machine case was assessed.

### C. Justify risk factors and adequacy evaluations

**Primary basis:** RA §§5.5–5.6; TOOLS §§5.4, 7; SUVA §§8.3–8.4.

- ISO 12100 separates severity from probability of harm, and probability from its exposure, hazardous-event and avoidance/limitation elements. Both most-likely harm severity and highest-foreseeable severity need consideration. [RA, §5.5.2, L1021–1127]
- Suva uses its own severity classes and E/H/A judgments. Its severity discussion considers representative outcomes and the most serious realistically occurring harm. Exposure includes access interval/duration; H includes hazard activity and coincidence with presence; A includes speed of harm, awareness and ability to escape. The source's definitions must support the chosen factor—not merely a number supplied by a model. [SUVA, §8.3, L639–816]
- Acute and cumulative-health risks need different treatment. Emission level, dose and exposure duration may require hazard-specific methods and measurement; do not force every health effect into an acute-injury score. [RA, §§5.5.1, 5.5.3.3, L1003–1020, L1140–1148; TOOLS, §5.4.3.2, L367–384; SUVA, §8.3, L639–649]
- Protective-measure suitability, human factors, incentive/ability to defeat, maintainability and available instructions affect estimation. Training is not a substitute for practicable design or safeguarding. [RA, §§5.5.3.4–5.5.3.8, L1150–1209]
- Adequacy is a **separate judgment**: three-step reduction, all conditions/interventions, lowest practicable risk, new/increased risks, residual-risk communication, compatibility and usability. A risk class is not itself an acceptance threshold. [RA, §§5.6.1–5.6.2, L1210–1237; SUVA, §8.4, L890–925; TOOLS, §7, L773–792; existing D5]

**Working-context implication:** retain factor rationale and supporting machine evidence, the configuration/protection credited, uncertainty and a distinct adequacy argument. Do not transfer Jespen's example matrix bands or annual-frequency classes into Suva or derive PL/SIL from a Suva class. These are existing project boundaries, not a new conversion method.

### D. Propose and compare cause-linked protective measures

**Primary basis:** RA §§6.1–6.3; SUVA §§8.2, 9.1–9.3; JESPEN §5.8; targeted type-B sources.

- Follow the sequence: inherently safe design → safeguarding/complementary measures → information for use. Information does not replace the preceding steps. [RA, §6.1, L1256–1293; SUVA, §§9.1–9.3, L966–1051]
- Design alternatives include geometry, force/mass/speed/energy, material/technology choices and reducing the need to enter a hazard zone. Specific permissible values still need applicable source evidence and engineering verification. [RA, §§6.2.1–6.2.4, L1294–1388; TOOLS, §8.2, L805–844]
- Use cause and risk-element understanding to explain the intended effect of each option. Compare failure conditions, interference with work, defeat incentives, lifetime and maintainability—not just resulting scores. [SUVA, §§8.2, 9, 9.2, L584–595, L948–965, L1008–1033; RA, §5.5.3.5–5.5.3.7]
- Guard selection depends on access needs, task/mode and hazard characteristics. Sensitive detection alone may be unsuitable for ejection/emissions, erratic stopping or machines unable to stop during a cycle. [RA, §6.3.2, L1778–1890]
- Stopping, emergency stopping, preventing unexpected start-up and energy isolation are different protective functions. ISO 12100 describes isolation, securing isolation, dissipation/restraint of stored energy and verification of their effect. [RA, §6.3.5.4, L2180–2196; ESTOP, §4.1.1, L252–292; ELECTRIC, §§5.4–5.6, L1611–1669]

**Working-context implication:** a measure proposal should explain which cause/event/exposure it addresses, which hierarchy step it occupies, why competing options are unsuitable or preferable, and what verification is needed. Proposed effect is not evidence of achieved reduction; existing D2/D6 keep that distinction.

### E. Iterate when questions are answered or designs change

**Primary basis:** RA §§5.2, 5.6, 7; TOOLS §§9–10; SUVA §§9.4–9.5; TR2 §5.

- Update information as design develops and revisit whether measures introduce hazards or increase other risks. [RA, §5.2, L835–845; §5.6.1, L1210–1217]
- Iteration checks changed limits, new situations/hazards, increased existing risks, sufficient reduction, additional measures and achievement of objectives. It also reconsiders reliability, usability, defeat and maintenance. [TOOLS, §9, L921–940]
- Suva checks intended effect after each reduction step and returns to machinery limits if the third step still does not achieve the intended reduction. [SUVA, §9.4, L1052–1069]
- Documentation records machine basis, assumptions, identified scenarios, sources/data uncertainty, reduction objectives, implemented measures and residual risks. The retained assessment record is distinct from the instruction handbook, although it informs it. [RA, §7, L2465–2498; TOOLS, §10, L941–952]
- Control-system safety work has a two-way interface: machine limits/risk elements/required protective behaviour go out; verification/validation, integration documentation and information for use come back. [TR2, §5, L132–189; FS1, §§4.1–5.2.1.3, L923–1142]

**Working-context implication:** new evidence can answer a question, but an affected conclusion still needs reconsideration in the changed configuration. The stable references, dependency reopening and proposed/implemented/verified states are existing **project policy** D6/D7 implementing this iteration, not standard-prescribed database fields.

## 3. Targeted type-B and specialist context

These are **sources to consult when triggered**, not declarations that every standard applies to every machine. This pass read only the registered portions; it did not perform complete standard compliance checks.

| Trigger / source | Directly observed source context | Evidence needed before a machine conclusion |
| --- | --- | --- |
| Guard construction/selection — GUARDS, ISO 14120:2015 | Scope excludes interlocking-device design itself. Access, containment, reach prevention, task frequency and lifecycle affect selection; guard verification uses examination/testing/measurement and other methods. [§1, L231–254; §§4–5.2, L449–548; §§6–7, L807–943] | Hazard/access description, guard geometry/materials/load/environment, justified selection and configuration-specific verification. |
| Interlocks/locking — INTERLOCK, ISO 14119:2013 | §6.2.1 explicitly calls for locking when overall system stopping performance is greater than or equal to access time; access time refers to distance/approach-speed evidence. Selection also considers lifecycle, failure, environment, release/escape and defeating incentives. [§§6–7.1, L826–995] | Verified edition/applicability, complete hazardous-function stopping performance, access routes/times, required function and external functional-safety evidence. No new locking rule was encoded. |
| Crushing-gap design — GAPS, ISO 13854:2017 | Applies to crushing only, not impact, shearing or drawing-in. Body part/population/clothing/access determine selection; additional measures are needed if gaps are insufficient. [§§1, 4.1, L107–180] | Relevant body parts and all access possibilities; visual checking of the applicable numerical table before using a gap value. |
| Reaching over/through/under — REACH, ISO 13857:2019 | Distance protection has population, geometry and reference-plane assumptions; it does not address every hazard or climbing. All foreseeable means of access matter. [§§1, 4.1, L127–228] | Drawings/measurements, exposed population, opening shapes, over/under/around access and applicable table verification. |
| Safeguard positioning — POSITION, ISO 13855:2010 | Covers specified safeguards/typical human approaches, not all approaches or ejection/emission/electrical hazards. Overall stopping performance includes safeguard and machine/control response and measurement uncertainty. [§1, L128–201; §§4–5.1, L294–377; §9, L941–978] | Applicable edition and safeguard, worst relevant stopping performance, geometry/access paths, detection capability and external distance calculation/test. |
| Emergency stopping — ESTOP, ISO 13850:2015 | Complementary measure, not safeguarding replacement or prevention of unexpected start-up. Reset must not restart; stopping must not add hazards. §4.1.5.1 contains a minimum functional-safety requirement. [§1, L141–172; §§4.1.1–4.1.5, L252–402] | Purpose, modes, span of control, stop behaviour/new hazards, required reliability determined by the competent external work and verified design. |
| Safety-control handoff — FS1/FS2, ISO 13849-1:2023 and -2:2012 | Part 1 links each function to hazards and an SRS; its stated scope is high-demand/continuous, not low-demand. Validation considers specified behaviour, integrity and environmental conditions using analysis/testing. [FS1 §1, L289–314; §§4–5.2.1.3, L923–1142; FS2 §§1, 4.1, L135–199] | Function trigger, safe state, response time, active modes, reset/restart, interfaces, power loss, demand conditions, returned design/verification/validation. PL/SIL calculations remain external. |
| Residual-risk instructions — HANDBOOK, ISO 20607:2019 | Addresses safety-related handbook preparation, not noise/vibration emission declarations. Tasks, target groups and specific residual risks inform content; generic residual-risk statements are to be avoided. [§1, L148–173; §§4.1–4.11, L224–358] | Actual findings, remaining risks, task-specific procedures/user measures and intended readership; avoid invented operating assumptions. |
| Hydraulic energy/faults — HYDRAULIC, ISO 4413:2010 | Hydraulic-system assessment/design, rated limits, energy isolation/pressure dissipation and safe behaviour on supply changes. Noise is incompletely covered. [§1, L92–143; §5.1–5.2.1, L176–195; §5.4.7.2, L989–1012] | Circuit/component data, loads/pressures, stored energy, loss/restoration/fault behaviour and verification; not merely a hydraulic symbol list. |
| Electrical energy — ELECTRIC, IEC 60204-1:2016 | Electrical-equipment scope starts at the supply connection; does not cover all machine guarding/control requirements. Removal of power does not imply isolation; specific non-isolating uses have conditions. [§1, L604–649; §§5.4–5.6, L1611–1669] | Electrical scope/circuit information, intended interventions, shock/stored-energy risks, appropriate disconnect/isolation means and verification. |
| Ergonomics — TR3, ISO/TR 22100-3:2016 | Connects population capabilities, task allocation, interfaces and work system to assessment; practical and document checks help demonstrate effectiveness. [§1, L119–138; §§5.1–5.3, L377–443; §7, L815–822] | Task/posture/force/repetition/rate, user variability and competent ergonomic analysis. Detailed specialist implementation remains deferred. |
| Safety-related security — TR4, ISO/TR 22100-4:2018 | Distinguishes safety and IT-security assessments and examines vulnerabilities of safety-related measures. Scope is manufacturer guidance, not detailed security specifications. Its legal framing is edition-specific. [§1, L111–140; §§4.3–6, L304–355] | Interfaces/connections, privileges, threats/vulnerabilities with safety effects, assumptions and competent security treatment. Deferred implementation is not exclusion of hazards. |
| AI inside machinery — TR5, ISO/TR 22100-5:2021 | Scope concerns machine-learning applications within specified limits; excludes applications acting beyond those limits with unpredictable effects and AI-based safety systems. Examples distinguish safety effects from optimization contained by existing safeguards. [§1, L73–85; §§4–5, L117–193] | Actual AI function, behavioural/use limits and safety effects, affected movements/loads/people and competent analysis. This is not a standard for validating this assessment assistant. |

## 4. Differences and unresolved evidence

1. **Severity wording:** RA requires considering both likely and highest foreseeable severity; Suva emphasizes the most serious realistic course; Jespen emphasizes likely severity while retaining worst-case consideration. Existing D1 preserves the distinction rather than averaging outcomes or declaring the sources identical. [RA §5.5.2.2; SUVA §8.3; JESPEN §3.2.3.2]
2. **Eliminated hazards:** Jespen advises not listing hazards eliminated or adequately reduced by inherently safe design; RA documentation retains identified hazards and measures, including hazards reduced incidentally by another measure. Existing D3 separates the historical audit trail from active residual-risk findings. [JESPEN §3.2.3.1, L1806–1831; RA §7/Annex B.2, L2465–2533]
3. **Emergency-stop reliability — newly flagged, not resolved:** Jespen §4.5.3.4 says EN ISO 13850 provides no reliability-degree specification and that PL a/Category B should normally suffice for a backup stop. The supplied ISO 13850:2015 §4.1.5.1 instead states a minimum **PLr c or SIL 1**. Do not carry Jespen's passage into a design rule. Edition/background reconciliation and any methodological adoption require the appropriate fresh consultant and primary-source checks; no machine-specific PL was selected here. [JESPEN L6095–6110; ESTOP L389–402]
4. **Guard locking detail is now located, not implemented:** existing D6 correctly records that RA/Suva alone do not give the stopping-versus-access necessity criterion. INTERLOCK §6.2.1 supplies one in the available 2013 edition. This expands the evidence map without changing D6 or proving a particular guard adequate. [RA §6.3.3.2.3; existing D6; INTERLOCK L852–862]
5. **Method scales remain separate:** Suva E/H/A, Jespen example matrices/frequency/LOPA discussions, and functional-safety parameters are not one shared numerical language. No acceptance threshold or cross-method conversion is adopted by this pass. [SUVA §8.3; JESPEN §§3.2.3.2, 5.7; TR2 §4–5; existing D5]
6. **Numerical extraction is not visual validation:** no new numerical tables were visually checked in this pass. Existing Suva visual checks and the Table 14 defect are recorded in [Suva tables/fixtures](../methodology/suva-tables-and-fixtures.md). Flattened/merged cells, equations and figure captions in MinerU output require renewed inspection when a design decision depends on them.
7. **Edition/current-law checks remain open:** INTERLOCK 2013, POSITION 2010 and several historical references are the supplied editions, not claims of currentness. FS1 2023 was opened directly rather than silently substituting the 2015 extract; TR2 and FS2 contain references to earlier part-1 editions. Check amendment/version relationships before use.
8. **Coverage gaps:** no actual-machine type-C selection, current harmonisation survey, detailed fire/explosion/noise/vibration/radiation assessment, or physical verification was performed. Jespen's material/SDS and fire/explosion screening discussions are useful pointers, not replacements for primary hazard-specific sources. [JESPEN §3.5.3.1, L4115–4165; §4.6.1, L6125–6134]
9. **Additional source requests:** ISO 14118 (unexpected start-up), ISO 4414 (pneumatics), relevant access/ergonomic/emission standards and the actual machine's type-C standard may be needed. They were not found among the selected Markdown source paths in this pass; that is a library/retrieval gap, not proof of irrelevance. [RA §§6.3.2.4, 6.3.5.4, 6.3.5.6; ESTOP §2; TR1 §6.2.2]

## 5. Source register and reopening instructions

Identifiers above resolve to **exact local extract files** below. `L` means a 1-based Markdown line, not a PDF page. Clause/section identity is the durable locator; regenerated extracts can shift lines. Only listed portions were inspected, not every clause in every document. Read surrounding text before making a decision.

Root aliases:

- `B` = `/media/eldar/disk_2/risk_assessment/extracted_html`
- `N` = `/media/eldar/disk_2/Machine_concept/NORMATIVE/extracted_html` (source extracts only; no unrelated project software)

| ID | Exact file relative to root | Portions reopened this pass |
| --- | --- | --- |
| RA | `N/ISO_12100_2010/ISO 12100_2010/auto/ISO 12100_2010.md` | L200–223, 718–1420, 1764–1890, 1981–2057, 2110–2246, 2465–2548 |
| SUVA | `B/Suva_66037_e_Risk_Assessment_and_Reduction_Machinery_2024/Suva_66037_e_Risk_Assessment_and_Reduction_Machinery_2024/auto/Suva_66037_e_Risk_Assessment_and_Reduction_Machinery_2024.md` | L276–569, 584–816, 890–1103, 1416–1439 |
| JESPEN | `B/Risk_Assessments_and_Safe_Machinery_Jespen_2016/Risk_Assessments_and_Safe_Machinery_Jespen_2016/auto/Risk_Assessments_and_Safe_Machinery_Jespen_2016.md` | L1694–1914, 4115–4165, 6095–6134, 6786–6997, 7229–7323 |
| TOOLS | `N/ISO_TR_14121-2_2012/ISO TR 14121-2_2012/auto/ISO TR 14121-2_2012.md` | L117–384, 773–954 |
| TR1 | `N/ISO_TR_22100-1_2021/ISO TR 22100-1_2021/auto/ISO TR 22100-1_2021.md` | L209–348 |
| TR2 | `N/ISO_TR_22100-2_2013/ISO TR 22100-2_2013/auto/ISO TR 22100-2_2013.md` | L79–199 |
| TR3 | `N/ISO_TR_22100-3_2016/ISO TR 22100-3_2016/auto/ISO TR 22100-3_2016.md` | L119–138, 377–443, 815–822 |
| TR4 | `N/ISO_TR_22100-4_2018/ISO TR 22100-4_2018/auto/ISO TR 22100-4_2018.md` | L111–140, 304–361 |
| TR5 | `N/ISO_TR_22100-5_2021/ISO TR 22100-5_2021/auto/ISO TR 22100-5_2021.md` | L73–202 |
| INTERLOCK | `N/ISO_14119_2013/ISO 14119_2013/auto/ISO 14119_2013.md` | L134–163, 826–942, 953–995 |
| GUARDS | `N/ISO_14120_2015/ISO 14120_2015/auto/ISO 14120_2015.md` | L231–254, 449–548, 807–951; Table 1 text read but not visually validated |
| GAPS | `N/ISO_13854_2017/ISO 13854_2017/auto/ISO 13854_2017.md` | L107–180; numerical gap table not inspected |
| REACH | `N/ISO_13857_2019/ISO 13857_2019/auto/ISO 13857_2019.md` | L127–228; numerical distance tables not inspected |
| POSITION | `N/ISO_13855_2010/ISO 13855_2010/auto/ISO 13855_2010.md` | L128–201, 294–377, 941–999; no calculation executed |
| ESTOP | `N/ISO_13850_2015/ISO 13850_2015/auto/ISO 13850_2015.md` | L141–172, 230–402 |
| FS1 | `N/ISO_13849-1_2023/ISO_13849-1_2023/auto/ISO_13849-1_2023.md` | L289–314, 923–1142; interface only, no PL calculation |
| FS2 | `N/ISO_13849-2_2012/ISO 13849-2_2012/auto/ISO 13849-2_2012.md` | L135–206; validation interface only |
| HANDBOOK | `N/ISO_20607_2019/ISO 20607_2019/auto/ISO 20607_2019.md` | L148–173, 224–358 |
| HYDRAULIC | `N/ISO_4413_2010/ISO 4413_2010/auto/ISO 4413_2010.md` | L92–143, 160–195, 989–1012 |
| ELECTRIC | `N/IEC_60204-1_2016/IEC 60204-1_2016/auto/IEC 60204-1_2016.md` | L604–673, 1611–1695; English part of bilingual extract |

QMD indexes this original synthesis under `docs`, not the outside-project ISO extracts. To locate it:

```bash
cd /media/eldar/disk_2/risk_assessment
qmd search "risk assessment engineering" -c docs -n 5
qmd get qmd://docs/research/risk-assessment-source-context.md:1:45
```

**Completion boundary:** relevant source context and open gaps are retained for choosing a bounded machine case. No methodology/baseline promotion, implementation change, source upload, commit or conformity claim follows from this note.
