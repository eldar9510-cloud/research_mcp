---
{
  "format": 1,
  "metadata": {
    "id": "archived-standard-plc-performance-level-limits-historical-research-98d2ad6a",
    "title": "Standard PLC performance-level limits: historical research",
    "question": "What findings, alternatives and limitations does the historical investigation document about Standard PLC performance-level limits: historical research?",
    "scope": "Historical PLC/orchestration or component-standard research: Standard PLC performance-level limits: historical research. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: Standard PLC performance-level limits: historical research. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Gemini Deep Research",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Prior inventory classification (not a completion verification): partial",
      "Safety, legality, standards-edition and mandatory-component claims in this historical report are unverified and must not be used as present engineering/compliance assurance."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:38.908Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "98d2ad6aa10e855d94a7a02ae25bd8bbbca86b88f0d0c02c88d7246cfe7ada77",
  "proposalRevision": "db6a6e719c050a38d8404ace3f8c02e43b1afe4eb0aface3a95303240b88da61"
}
---
Question: "Machine safety question, standards context ISO 13849-1:2023 (and 2015), IEC 62061, IEC 61508-3 ... verify claim that standard non-safety-rated PLC (OpenPLC on Raspberry Pi/Arduino/ESP32) caps at PL b standalone / PL c (Cat 2) or PL d (Cat 3) with diverse channel / PL e impossible; real-world examples; IEC 62061 SIL route; lift PESSRAL; edge cases. Full question in session transcript."

interaction_id: v1_ChdKTUdBYXFlSUhkT0Nuc0VQcjlQZDZRURIXSk1HQWFxZUlIZE9DbnNFUHI5UGQ2UVE

# Deep Research report
- agent: `deep-research-preview-04-2026`
- status: completed
- tokens: 1663971



## The IEC 62061 Pathway and Systematic Software Integrity

If an automation designer attempts to bypass the structural limitations of ISO 13849-1 by utilizing IEC 62061—the sector-specific machinery standard derived directly from the overarching IEC 61508 framework—they will encounter an equally impenetrable regulatory barrier regarding software capability. While ISO 13849-1 evolved from a deterministic category-based approach, IEC 62061 was engineered from its inception to utilize a purely probabilistic methodology based on Safety Integrity Levels (SIL) [cite: 29, 30]. 

### The Barrier of Clause 8

The 2021 revision of IEC 62061 heavily updated Clause 8, introducing rigorous use cases, architectural constraints, and independence requirements for software verification and validation activities [cite: 31, 32, 33, 34]. Under IEC 62061, the entire Safety-Related Control System (SCS) is assessed as a functional unit, requiring strict mathematical proof that the Probability of Dangerous Failure per Hour ($PFH_D$) remains below prescribed limits [cite: 30, 33].

The user claim correctly notes that under IEC 62061, a standard PLC cannot serve as a subsystem for any SIL—including the lowest threshold of SIL 1—without fully compliant embedded software. IEC 62061 Clause 8 dictates that the software of a subsystem must meet specific systematic capability requirements intended solely to control systematic faults (software bugs) [cite: 29, 32, 33]. For a programmable electronic component to be rated SIL 1, the manufacturer must provide a documented functional safety plan, meticulous configuration management, and empirical evidence of absolute independence in software verification [cite: 32, 33].

Open-source platforms like OpenPLC running on a Raspberry Pi or Arduino utilize a standard Linux kernel or a basic real-time operating system (RTOS), paired with an uncertified IEC 61131-3 compiler [cite: 23, 27, 35]. The inherent complexity of a standard Linux kernel, which contains millions of lines of unverified code generated by thousands of disparate contributors, renders it mathematically and practically impossible to calculate a Safe Failure Fraction (SFF) or to demonstrate the systematic capability required for SIL 1 [cite: 23, 29, 36, 37]. 

Therefore, the IEC 62061 route is definitively closed to standard PLCs operating as primary logic solvers. SIL 1 is blocked because the embedded software cannot fulfill the systematic integrity prerequisites of Clause 8, leaving the integration of open-source PLCs unviable in any SIL-rated environment [cite: 31, 32].

| Safety Integrity Level (SIL) | Probability of Dangerous Failure per Hour ($PFH_D$) | Generic PLC Suitability (Standalone) |
| :--- | :--- | :--- |
| **SIL 1** | $\ge 10^{-6}$ to $< 10^{-5}$ | **Prohibited** (Fails Systematic Capability) |
| **SIL 2** | $\ge 10^{-7}$ to $< 10^{-6}$ | **Prohibited** (Fails Systematic Capability) |
| **SIL 3** | $\ge 10^{-8}$ to $< 10^{-7}$ | **Prohibited** (Fails Systematic Capability) |

## Lift-Specific Constraints: EN 81-20 and the PESSRAL Mandate

The elevator and lift sector represents an even more strictly regulated domain than general industrial machinery. Due to the involvement of public passengers, extreme vertical heights, and high-severity enclosed hazards (such as shearing forces and uncontrolled descent), the European standards for lifts—EN 81-20 (safety rules for construction) and EN 81-50 (testing of components)—provide definitive, unyielding rulings on the use of programmable electronics [cite: 12, 38, 39, 40].

### The Strict Implementation of PESSRAL

In modern lift design, safety circuits are explicitly governed by the concept of PESSRAL (Programmable Electronic Systems in Safety Related Applications for Lifts) [cite: 12, 38, 41]. EN 81-20 Clause 5.11.2.6 details the requirements for PESSRAL, mandating that any programmable electronic system performing a safety function must strictly comply with the mother standard for functional safety, IEC 61508 [cite: 12, 41]. 

A generic PLC, regardless of how it is programmed, cannot legally qualify as PESSRAL [cite: 12, 41]. To achieve PESSRAL compliance, the hardware must feature highly specialized redundant architectures with deep cross-diagnostics, fail-safe design parameters, and application software that has been rigorously validated against IEC 61508-3 [cite: 12]. Furthermore, EN 81-20 requires that the failure state of the device must be instantly identifiable either by a built-in supervisory system or an external tool, and robust security measures must be in place to prevent unauthorized access or modification to the safety-related program code (e.g., hardware password protection, EPROM deployment) [cite: 15, 41]. Standard PLCs, and particularly open-source OpenPLC platforms, fundamentally lack these immutable hardware and software locking mechanisms [cite: 15, 23, 27].

### SIL Requirements for Lift Safety Devices (Table A.1)

EN 81-20 Annex A (Table A.1) acts as the definitive regulatory ledger of electrical safety devices in a lift, prescribing the exact Safety Integrity Level required for each critical function [cite: 41]. A review of this table confirms that the lift environment tolerates no functional safety ambiguities.

*   **SIL 1 Functions:** These include checking the ascending car overspeed protection means, monitoring the deployed position of the pit ladder, and verifying the tension in compensation ropes [cite: 41].
*   **SIL 2 Functions:** These encompass the stopping device in the pit, checking the locked position of inspection doors or trapdoors, checking the retracted position of the working platform, and detecting initial overspeed conditions [cite: 41].
*   **SIL 3 Functions:** These represent the most critical mitigations, including the emergency stopping device on the car roof, checking the locked position of landing door locking devices, verifying the closed position of car doors, and checking the anti-rebound device [cite: 41].

Because a generic PLC cannot meet the fundamental IEC 61508 prerequisites to achieve even the lowest threshold of SIL 1, it cannot be legally utilized for *any* of the safety functions listed in EN 81-20 Table A.1 [cite: 12, 41]. The elevator sector's reliance on PESSRAL entirely precludes the use of Raspberry Pi or Arduino-class hardware for safety tasks.

## Edge Cases, Hardware Watchdogs, and Contrary Claims

While the regulatory ceiling is rigid across formal standards, engineers in research, SCADA cybersecurity, and non-critical process control frequently attempt to push the boundaries of platforms like the Raspberry Pi or Arduino using external hardware additions [cite: 27, 28, 35]. Understanding these edge cases is vital for dissecting contrary claims regarding the capability of open-source hardware.

### The Illusion of Safety via External Hardware Watchdogs

A highly common engineering pattern used to increase the availability and pseudo-diagnostic coverage of a Raspberry Pi is the integration of an external hardware watchdog, such as the PiWatcher or a custom external ATtiny85 microcontroller [cite: 36, 42, 43]. These external devices monitor the I2C bus or a dedicated GPIO pin for a regular "heartbeat" signal generated by the Raspberry Pi's operating system [cite: 42, 44]. If the Linux kernel panics, experiences a fork bomb, or the OpenPLC runtime catastrophically freezes, the heartbeat ceases [cite: 36, 42, 45]. The watchdog subsequently cuts power to the Pi or forces a hard reboot to restore availability [cite: 36, 42, 45].

Proponents occasionally claim this elevates the system to PL c or PL d by providing external diagnostics. However, from a functional safety perspective, this is a fallacy. While an external watchdog provides a rudimentary form of diagnostic coverage, it fundamentally only detects a total system freeze or kernel panic. It is entirely incapable of detecting a logic error within the IEC 61131-3 compiler [cite: 16, 36, 44]. If a subtle software bug causes a specific input to be ignored, or an output to latch inappropriately while the main OS thread continues to pulse the heartbeat normally, the watchdog remains ignorant of the dangerous failure [cite: 16, 36, 44]. 

Therefore, while external watchdogs drastically increase operational availability, they do not satisfy the rigorous cross-fault monitoring, logic verification, and deterministic fail-safe response required by ISO 13849-1 for higher Performance Levels [cite: 14, 16, 25]. A homogeneous architecture utilizing hardware watchdogs remains definitively capped at PL b.

### The Legitimate Domain of Open-Source PLCs

The documented use cases for OpenPLC on Raspberry Pi, Arduino, and ESP32 hardware are overwhelmingly relegated to SCADA cybersecurity research, educational prototyping, and Tier 2 industrial applications (e.g., environmental indicators, low-energy fluidics, conveyor sequencing without personnel exposure, or home automation) where human safety is not at risk [cite: 23, 27, 28, 35]. In these environments, the lack of an IEC 61508-3 certificate is irrelevant, and the systems provide immense value for protocol analysis (such as reverse engineering Modbus or Profisafe traffic) [cite: 23, 27, 35]. However, for any application involving hazardous energy or kinetic motion, machine builders unequivocally rely on certified Safety PLCs or hardwired safety relays to isolate the energy-removal function from the standard automation logic [cite: 14, 23, 26, 28].

## Conclusion

The analysis of current functional safety standards confirms the veracity of the original claim in its entirety. The deployment of standard, non-safety PLCs—specifically those utilizing generic hardware and open-source runtimes—is strictly governed by unyielding structural and probabilistic laws designed to mitigate systematic software and hardware failures. 

Under ISO 13849-1:2023, standard PLCs are firmly capped at PL b when utilized in homogeneous architectures, primarily due to the restrictions placed on non-accessible embedded software in Clause 7.3.2. Because these devices lack $MTTF_D$ data, Clause 6.1.9.4 forces a conservative 10-year assumption that mathematically precludes high-reliability ratings, while Clause 6.1.11 officially removes the Category 1 pathway by denying them "well-tried" status. Fault exclusions are expressly forbidden by ISO 13849-2. 

The only legally viable avenue to elevate a standard PLC to PL c or PL d is to utilize a Category 2 or Category 3 diverse architecture, pairing the PLC with a fundamentally different technology, such as an electromechanical safety relay, to satisfy the stringent CCF diversity requirements. Furthermore, achieving PL e under ISO 13849-1, securing any SIL rating under IEC 62061, or operating as a PESSRAL device under EN 81-20 is impossible without IEC 61508-3 certified software. The reliance on certified safety components for critical risk reduction remains the absolute standard across the industrial and lift automation sectors.

**Sources:**
1. [iteh.ai](https://cdn.standards.iteh.ai/samples/64935/0eb94fb251d8425baecf7289dde89d06/SIST-EN-ISO-13849-1-2023.pdf)
2. [dguv.de](https://publikationen.dguv.de/widgets/pdf/download/article/2450)
3. [medium.com](https://medium.com/@mircea.calugaru/iso-13849-1-2023-safety-of-machinery-safety-related-parts-of-control-systems-an-in-depth-b5321f3af8fb)
4. [iteh.ai](https://standards.iteh.ai/catalog/standards/iso/0ec4d0c2-c2ee-4bac-b69f-0a883595198b/iso-13849-1-2023)
5. [scribd.com](https://www.scribd.com/document/785267947/mapping-table-en-iso-13849-1-ed-2016-2023)
6. [dguv.de](https://publikationen.dguv.de/widgets/pdf/download/article/4894)
7. [ansi.org](https://webstore.ansi.org/preview-pages/ISO/preview_ISO+13849-1-2023.pdf)
8. [dguv.de](https://publikationen.dguv.de/widgets/pdf/download/article/4533)
9. [mdpi.com](https://www.mdpi.com/2079-9292/14/22/4359)
10. [bgn-branchenwissen.de](https://vorschriften.bgn-branchenwissen.de/daten/dguv/203_079/6.htm)
11. [analog.com](https://ez.analog.com/ez-blogs/b/engineerzone-spotlight/posts/fault-exclusions)
12. [liftinstituut.com](https://www.liftinstituut.com/knowledge-center/19-pess/3-pess-pessral-and-pessrae-a-fast-track-to-electronic-safety-in-elevators)
13. [byhon.it](https://www.byhon.it/the-categories-for-iso-13849/)
14. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/safety-plcs-design-principles-interfacing-and-regulatory-compliance)
15. [industrialautomationco.com](https://www.industrialautomationco.com/blogs/news/what-s-the-difference-between-a-safety-plc-and-a-standard-plc)
16. [rabwellplc.com](https://rabwellplc.com/blogs/news/safety-plc-vs-standard-plc-differences)
17. [ieee.org](https://r6.ieee.org/scv-pses/wp-content/uploads/sites/17/2023/11/Safety-of-Machinery-Does-ISO-13849-1-2023-work-for-you-DNix-2023-rev2.pdf)
18. [dguv.de](https://publikationen.dguv.de/widgets/pdf/download/article/4600)
19. [gt-engineering.it](https://www.gt-engineering.it/en/insights/functional-safety-300321/fault-considerations-and-fault-exclusion/fault-exclusion-and-interlocking-devices/)
20. [iteh.ai](https://cdn.standards.iteh.ai/samples/53640/e240593c209440729727cd6ec30d7a94/ISO-13849-2-2012.pdf)
21. [scribd.com](https://www.scribd.com/document/911133492/ISO-13849-2-2012-10)
22. [charger.com.tw](http://www.charger.com.tw/12_standards/02_en/ISO_13849-2/html/99_Annex_D.html)
23. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/open-source-plc-platform-selection-architecture-risk)
24. [digikey.co.il](https://www.digikey.co.il/Site/Global/Layouts/DownloadPdf.ashx?pdfUrl=1B32974200404EF485E1F8F52E6611DD)
25. [amdmachines.com](https://amdmachines.com/blog/safety-plc-and-safety-system-design/)
26. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/integrating-safety-relays-with-plcs-iso-13849-architecture-guide)
27. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/openplc-for-scada-security-research-complete-implementation-guide)
28. [makerspace-online.com](https://www.makerspace-online.com/small-industry/)
29. [pilz.com](https://www.pilz.com/en-US/support/law-standards-norms/functional-safety/en-iec-62061)
30. [patsnap.com](https://www.patsnap.com/resources/blog/articles/sil-vs-performance-level-iec-62061-vs-iso-13849/)
31. [csagroup.org](https://www.csagroup.org/store/product/iec_059927/)
32. [iec.ch](https://webstore.iec.ch/en/publication/59927)
33. [gt-engineering.it](https://www.gt-engineering.it/en/technical-standards/en-iec-standards/iec-62061-functional-safety-of-machineries469677178/)
34. [elstandard.se](https://elstandard.se/documents/preview/2810201)
35. [cs2ai.org](https://www.cs2ai.org/post/raspberry-pi-and-openplc-how-to-and-use-cases)
36. [switchdoc.com](https://www.switchdoc.com/2014/11/reliable-projects-using-internal-watchdog-timer-raspberry-pi/)
37. [drivesandcontrols.ca](https://www.drivesandcontrols.ca/latest-articles/iec-62061-safety-integrity-level-sil-by-pilz/)
38. [tlse.co.uk](https://www.tlse.co.uk/standards/en-81-20)
39. [acute-elevators.co.uk](https://www.acute-elevators.co.uk/blog/a-clear-guide-to-en-81-20-and-en-81-50-lift-standards)
40. [liftinstituut.com](https://www.liftinstituut.com/knowledge-center/20-standards-directives/5-european-elevator-safety-standards)
41. [eigel.es](http://eigel.es/wp-content/uploads/2022/01/20120516_08_E41_prEN_81-201.pdf)
42. [lectronz.com](https://lectronz.com/products/piwatcher-the-best-watchdog-for-your-raspberry-pi)
43. [sigmdel.ca](https://sigmdel.ca/michel/ha/rpi/hardware_watchdog_03_en.html)
44. [raspberrypi.com](https://forums.raspberrypi.com/viewtopic.php?t=193163)
45. [dri.es](https://dri.es/keeping-your-raspberry-pi-online-with-watchdogs)


## Citations
1. [https://cdn.standards.iteh.ai/samples/64935/0eb94fb251d8425baecf7289dde89d06/SIST-EN-ISO-13849-1-2023.pdf](https://cdn.standards.iteh.ai/samples/64935/0eb94fb251d8425baecf7289dde89d06/SIST-EN-ISO-13849-1-2023.pdf)
2. [https://publikationen.dguv.de/widgets/pdf/download/article/2450](https://publikationen.dguv.de/widgets/pdf/download/article/2450)
3. [https://medium.com/@mircea.calugaru/iso-13849-1-2023-safety-of-machinery-safety-related-parts-of-control-systems-an-in-depth-b5321f3af8fb](https://medium.com/@mircea.calugaru/iso-13849-1-2023-safety-of-machinery-safety-related-parts-of-control-systems-an-in-depth-b5321f3af8fb)
4. [https://standards.iteh.ai/catalog/standards/iso/0ec4d0c2-c2ee-4bac-b69f-0a883595198b/iso-13849-1-2023](https://standards.iteh.ai/catalog/standards/iso/0ec4d0c2-c2ee-4bac-b69f-0a883595198b/iso-13849-1-2023)
5. [https://www.scribd.com/document/785267947/mapping-table-en-iso-13849-1-ed-2016-2023](https://www.scribd.com/document/785267947/mapping-table-en-iso-13849-1-ed-2016-2023)
6. [https://publikationen.dguv.de/widgets/pdf/download/article/4894](https://publikationen.dguv.de/widgets/pdf/download/article/4894)
7. [https://webstore.ansi.org/preview-pages/ISO/preview_ISO+13849-1-2023.pdf](https://webstore.ansi.org/preview-pages/ISO/preview_ISO+13849-1-2023.pdf)
8. [https://publikationen.dguv.de/widgets/pdf/download/article/4533](https://publikationen.dguv.de/widgets/pdf/download/article/4533)
9. [https://www.mdpi.com/2079-9292/14/22/4359](https://www.mdpi.com/2079-9292/14/22/4359)
10. [https://vorschriften.bgn-branchenwissen.de/daten/dguv/203_079/6.htm](https://vorschriften.bgn-branchenwissen.de/daten/dguv/203_079/6.htm)
11. [https://ez.analog.com/ez-blogs/b/engineerzone-spotlight/posts/fault-exclusions](https://ez.analog.com/ez-blogs/b/engineerzone-spotlight/posts/fault-exclusions)
12. [https://www.liftinstituut.com/knowledge-center/19-pess/3-pess-pessral-and-pessrae-a-fast-track-to-electronic-safety-in-elevators](https://www.liftinstituut.com/knowledge-center/19-pess/3-pess-pessral-and-pessrae-a-fast-track-to-electronic-safety-in-elevators)
13. [https://www.byhon.it/the-categories-for-iso-13849/](https://www.byhon.it/the-categories-for-iso-13849/)
14. [https://industrialmonitordirect.com/blogs/knowledgebase/safety-plcs-design-principles-interfacing-and-regulatory-compliance](https://industrialmonitordirect.com/blogs/knowledgebase/safety-plcs-design-principles-interfacing-and-regulatory-compliance)
15. [https://www.industrialautomationco.com/blogs/news/what-s-the-difference-between-a-safety-plc-and-a-standard-plc](https://www.industrialautomationco.com/blogs/news/what-s-the-difference-between-a-safety-plc-and-a-standard-plc)
16. [https://rabwellplc.com/blogs/news/safety-plc-vs-standard-plc-differences](https://rabwellplc.com/blogs/news/safety-plc-vs-standard-plc-differences)
17. [https://r6.ieee.org/scv-pses/wp-content/uploads/sites/17/2023/11/Safety-of-Machinery-Does-ISO-13849-1-2023-work-for-you-DNix-2023-rev2.pdf](https://r6.ieee.org/scv-pses/wp-content/uploads/sites/17/2023/11/Safety-of-Machinery-Does-ISO-13849-1-2023-work-for-you-DNix-2023-rev2.pdf)
18. [https://publikationen.dguv.de/widgets/pdf/download/article/4600](https://publikationen.dguv.de/widgets/pdf/download/article/4600)
19. [https://www.gt-engineering.it/en/insights/functional-safety-300321/fault-considerations-and-fault-exclusion/fault-exclusion-and-interlocking-devices/](https://www.gt-engineering.it/en/insights/functional-safety-300321/fault-considerations-and-fault-exclusion/fault-exclusion-and-interlocking-devices/)
20. [https://cdn.standards.iteh.ai/samples/53640/e240593c209440729727cd6ec30d7a94/ISO-13849-2-2012.pdf](https://cdn.standards.iteh.ai/samples/53640/e240593c209440729727cd6ec30d7a94/ISO-13849-2-2012.pdf)
21. [https://www.scribd.com/document/911133492/ISO-13849-2-2012-10](https://www.scribd.com/document/911133492/ISO-13849-2-2012-10)
22. [http://www.charger.com.tw/12_standards/02_en/ISO_13849-2/html/99_Annex_D.html](http://www.charger.com.tw/12_standards/02_en/ISO_13849-2/html/99_Annex_D.html)
23. [https://industrialmonitordirect.com/blogs/knowledgebase/open-source-plc-platform-selection-architecture-risk](https://industrialmonitordirect.com/blogs/knowledgebase/open-source-plc-platform-selection-architecture-risk)
24. [https://www.digikey.co.il/Site/Global/Layouts/DownloadPdf.ashx?pdfUrl=1B32974200404EF485E1F8F52E6611DD](https://www.digikey.co.il/Site/Global/Layouts/DownloadPdf.ashx?pdfUrl=1B32974200404EF485E1F8F52E6611DD)
25. [https://amdmachines.com/blog/safety-plc-and-safety-system-design/](https://amdmachines.com/blog/safety-plc-and-safety-system-design/)
26. [https://industrialmonitordirect.com/blogs/knowledgebase/integrating-safety-relays-with-plcs-iso-13849-architecture-guide](https://industrialmonitordirect.com/blogs/knowledgebase/integrating-safety-relays-with-plcs-iso-13849-architecture-guide)
27. [https://industrialmonitordirect.com/blogs/knowledgebase/openplc-for-scada-security-research-complete-implementation-guide](https://industrialmonitordirect.com/blogs/knowledgebase/openplc-for-scada-security-research-complete-implementation-guide)
28. [https://www.makerspace-online.com/small-industry/](https://www.makerspace-online.com/small-industry/)
29. [https://www.pilz.com/en-US/support/law-standards-norms/functional-safety/en-iec-62061](https://www.pilz.com/en-US/support/law-standards-norms/functional-safety/en-iec-62061)
30. [https://www.patsnap.com/resources/blog/articles/sil-vs-performance-level-iec-62061-vs-iso-13849/](https://www.patsnap.com/resources/blog/articles/sil-vs-performance-level-iec-62061-vs-iso-13849/)
31. [https://www.csagroup.org/store/product/iec_059927/](https://www.csagroup.org/store/product/iec_059927/)
32. [https://webstore.iec.ch/en/publication/59927](https://webstore.iec.ch/en/publication/59927)
33. [https://www.gt-engineering.it/en/technical-standards/en-iec-standards/iec-62061-functional-safety-of-machineries469677178/](https://www.gt-engineering.it/en/technical-standards/en-iec-standards/iec-62061-functional-safety-of-machineries469677178/)
34. [https://elstandard.se/documents/preview/2810201](https://elstandard.se/documents/preview/2810201)
35. [https://www.cs2ai.org/post/raspberry-pi-and-openplc-how-to-and-use-cases](https://www.cs2ai.org/post/raspberry-pi-and-openplc-how-to-and-use-cases)
36. [https://www.switchdoc.com/2014/11/reliable-projects-using-internal-watchdog-timer-raspberry-pi/](https://www.switchdoc.com/2014/11/reliable-projects-using-internal-watchdog-timer-raspberry-pi/)
37. [https://www.drivesandcontrols.ca/latest-articles/iec-62061-safety-integrity-level-sil-by-pilz/](https://www.drivesandcontrols.ca/latest-articles/iec-62061-safety-integrity-level-sil-by-pilz/)
38. [https://www.tlse.co.uk/standards/en-81-20](https://www.tlse.co.uk/standards/en-81-20)
39. [https://www.acute-elevators.co.uk/blog/a-clear-guide-to-en-81-20-and-en-81-50-lift-standards](https://www.acute-elevators.co.uk/blog/a-clear-guide-to-en-81-20-and-en-81-50-lift-standards)
40. [https://www.liftinstituut.com/knowledge-center/20-standards-directives/5-european-elevator-safety-standards](https://www.liftinstituut.com/knowledge-center/20-standards-directives/5-european-elevator-safety-standards)
41. [http://eigel.es/wp-content/uploads/2022/01/20120516_08_E41_prEN_81-201.pdf](http://eigel.es/wp-content/uploads/2022/01/20120516_08_E41_prEN_81-201.pdf)
42. [https://lectronz.com/products/piwatcher-the-best-watchdog-for-your-raspberry-pi](https://lectronz.com/products/piwatcher-the-best-watchdog-for-your-raspberry-pi)
43. [https://sigmdel.ca/michel/ha/rpi/hardware_watchdog_03_en.html](https://sigmdel.ca/michel/ha/rpi/hardware_watchdog_03_en.html)
44. [https://forums.raspberrypi.com/viewtopic.php?t=193163](https://forums.raspberrypi.com/viewtopic.php?t=193163)
45. [https://dri.es/keeping-your-raspberry-pi-online-with-watchdogs](https://dri.es/keeping-your-raspberry-pi-online-with-watchdogs)

[exited with code 0]
