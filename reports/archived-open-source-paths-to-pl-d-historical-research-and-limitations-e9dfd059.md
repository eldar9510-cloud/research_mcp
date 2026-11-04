---
{
  "format": 1,
  "metadata": {
    "id": "archived-open-source-paths-to-pl-d-historical-research-and-limitations-e9dfd059",
    "title": "Open-source paths to PL d: historical research and limitations",
    "question": "What findings, alternatives and limitations does the historical investigation document about Open-source paths to PL d: historical research and limitations?",
    "scope": "Historical PLC/orchestration or component-standard research: Open-source paths to PL d: historical research and limitations. No current conformity, product-specific supplier approval, PL/SIL or legally compliant machine result is established.",
    "summary": "Historical engineering/standards study: Open-source paths to PL d: historical research and limitations. Preserves source assertions, alternatives, unresolved scope and edition questions; newer reports may cover or correct parts of the subject.",
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
    "imported_at": "2026-11-04T21:30:38.764Z"
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
  "sourceDigest": "e9dfd05903588168cd404c3b3da98684f0bc4fb7c91b47e43efc59784ae0b4de",
  "proposalRevision": "27592d08996e5a3bd974bb8ab3189877b48e68465e23b8534e43ac728099802b"
}
---
Question: "Functional safety research, machinery domain (goods lifts <=0.15 m/s EN 81-42, ISO 13849-1) ... which open-source-software-based paths exist to achieve PL d for a programmable safety logic solver in 2026 (OpenPLC/Beremiz/4diac certs, openSAFETY, Zephyr/seL4/RTEMS, hybrid PLC+safety-relay Cat 3 pattern, certified open hardware, lift applicability). Full question in session transcript."

interaction_id: v1_ChdfTU9BYXRPZERmdnR4czBQZ2VPMjZRURIXX01PQWF0T2REZnZ0eHMwUGdlTzI2UVE

# Deep Research report
- agent: `deep-research-preview-04-2026`
- status: completed
- tokens: 2406091



**The Diversity Condition (Clause 7.3.2 in Action):**
If the lift overspeeds, both channels independently detect the fault via dual-channel encoders. If the OpenPLC system suffers a kernel panic, enters an infinite loop, or is compromised via a network vulnerability, it will fail to send its deterministic watchdog pulse to the Safety Relay. The Safety Relay, operating on fundamentally different hardware and software architectures, detects the silence immediately. Because the Safety Relay is wired in series with the final actuating elements, it instantly opens its force-guided contactors, dropping power to the lift drives and engaging the mechanical safety gear, utterly regardless of the state of the OpenPLC outputs [cite: 1, 3, 6, 12]. 

This architecture allows the engineering team to build 90% of the machine's complex operational logic in a free, open-source environment (completely avoiding the expensive licensing fees and proprietary vendor lock-in associated with massive software suites like Siemens TIA Portal or Rockwell Studio 5000), while spending a fraction of the budget on a small, dedicated hardware safety relay to satisfy the Notified Body and achieve PL d legally [cite: 1, 2, 3].

## Strategic Conclusions and Caveats

1.  **Software Does Not Supplant Hardware Requirements:** Attempting to force an uncertified, off-the-shelf Raspberry Pi to achieve PL d simply by running mathematically verified software (like seL4) is a regulatory dead end. ISO 13849-1 and IEC 61508 mandate strict hardware fault tolerance (HFT) and high diagnostic coverage percentages [cite: 14, 15]. Open hardware projects must transition to utilizing safety-specific silicon (e.g., Aurix lockstep MCUs) to play a primary role in functional safety [cite: 2, 42].
2.  **The Hidden High Cost of "Free" Open Source:** The Zephyr Project represents the most credible future path for a fully open-source safety RTOS, but the cost of producing, auditing, and maintaining IEC 61508 evidence is staggering [cite: 7]. Integrators must recognize that "open source" does not equate to "free certification." Even if the Zephyr safety manual becomes freely available in late 2026, the machine builder must still qualify their specific compiler, hardware, and integration process with a certification body.
3.  **The Hybrid Reality for 2026:** For machinery and lift builders operating today and looking toward immediate 2026 deployments, the Pragmatic Hybrid Pattern is the accepted, documented, and legally compliant mechanism for open-source enthusiasts. It insulates the proprietary safety burden to a small, isolated, and highly reliable hardware component, granting developers the freedom to innovate on the broader open-source control layer without risking human life or inviting regulatory rejection.

**Sources:**
1. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/open-source-plc-platform-selection-architecture-risk)
2. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/replacing-safety-plc-with-embedded-sil-23-solutions)
3. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/plc-controlled-e-stop-circuits-safety-standards-and-smart-mcc)
4. [ieee.org](https://r6.ieee.org/scv-pses/wp-content/uploads/sites/17/2023/11/Safety-of-Machinery-Does-ISO-13849-1-2023-work-for-you-DNix-2023-rev2.pdf)
5. [scribd.com](https://www.scribd.com/document/785267947/mapping-table-en-iso-13849-1-ed-2016-2023)
6. [scribd.com](https://www.scribd.com/document/908519450/Test-Seguretat-Maquina-UNE-En-60204)
7. [github.com](https://github.com/zephyrproject-rtos/zephyr/wiki/Safety-FAQ)
8. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/cip-safety-to-opensafety-bridging-guardlogix-and-br-x20slx910)
9. [pilz.com](https://www.pilz.com/en-US/support/law-standards-norms/functional-safety/en-iso-13849-1)
10. [scribd.com](https://www.scribd.com/document/892993042/Overview-and-Comparison-Between-en-ISO-13849-1-and-en-IEC-62061-CAPIEL-white-paper)
11. [medium.com](https://medium.com/@mircea.calugaru/iso-13849-1-2023-safety-of-machinery-safety-related-parts-of-control-systems-an-in-depth-b5321f3af8fb)
12. [scribd.com](https://www.scribd.com/document/754906524/bs-en-60204-1-2018)
13. [afit.edu](https://scholar.afit.edu/cgi/viewcontent.cgi?article=2565&context=etd)
14. [brain4machinery.com](https://brain4machinery.com/glossary/iso-13849-for-robotic-machinery/)
15. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/why-safety-light-curtains-must-not-use-standard-remote-io)
16. [iteh.ai](https://standards.iteh.ai/catalog/standards/cen/4a35cccd-c58f-47ba-a38a-2b8c0ee5a43f/en-81-42-2025)
17. [iteh.ai](https://cdn.standards.iteh.ai/samples/74108/435cdfbba67e46f39a767b37cc013b8b/oSIST-prEN-81-42-2022.pdf)
18. [iteh.ai](https://standards.iteh.ai/catalog/standards/cen/64d998b6-aa74-4c7c-97cf-abf90f0d8915/en-81-30-2025)
19. [sick.com](https://www.sick.com/us/en/what-are-performance-levels/w/blog-safety-standard-performance-levels)
20. [liftinstituut.com](https://www.liftinstituut.com/knowledge-center/20-standards-directives/5-european-elevator-safety-standards)
21. [zephyrproject.org](https://docs.zephyrproject.org/latest/safety/safety_overview.html)
22. [analog.com](https://www.analog.com/en/resources/technical-articles/functional-safety-and-industry-4.0.html)
23. [plcprogramming.io](https://plcprogramming.io/blog/plc-programming-software-complete-guide-2026)
24. [github.com](https://github.com/zakharb/labshock/wiki/Plc-Service)
25. [plcprogramming.io](https://plcprogramming.io/openplc/supported-hardware)
26. [autonomylogic.com](https://autonomylogic.com/runtime)
27. [industrialmonitordirect.com](https://industrialmonitordirect.com/blogs/knowledgebase/linux-compatible-plcs-open-source-and-commercial-options)
28. [eclipse.org](https://projects.eclipse.org/proposals/eclipse-canon-c)
29. [zephyrproject.org](https://www.zephyrproject.org/celebrating-a-decade-of-zephyr-and-the-journey-ahead/)
30. [zephyrproject.org](https://www.zephyrproject.org/wp-content/uploads/2026/04/Zephyr-Overview-20260424.pdf)
31. [zephyrproject.org](https://www.zephyrproject.org/embedded-world-conference-2026-zephyr-project-workshop-and-sessions/)
32. [eclipse.org](https://www.eclipse.org/org/foundation/annual-reports/2026/)
33. [threadxalliance.org](https://threadxalliance.org/subscription/benefits)
34. [sched.com](https://eoss2023.sched.com/list/descriptions)
35. [sched.com](https://eoss2023.sched.com/2023-06-30/list/descriptions/)
36. [github.com](https://github.com/ariexi/the-automotive-collection)
37. [stonetusker.com](https://stonetusker.com/newsletters/)
38. [scispace.com](https://scispace.com/pdf/self-configuring-safety-networks-2m4zjrkjiq.pdf)
39. [machinegeeks.blog](https://machinegeeks.blog/category/safety/)
40. [safexplain.eu](https://safexplain.eu/wp-content/uploads/2022/11/D2.2-DL-safety-architectural-patterns-and-platform.pdf)
41. [kickpi.com](https://www.kickpi.com/choose-the-right-sbc-for-industrial-projects/)
42. [upc.edu](https://upcommons.upc.edu/bitstreams/def43000-8180-41c6-8ef6-a67e0ec5954b/download)


## Citations
1. [https://industrialmonitordirect.com/blogs/knowledgebase/open-source-plc-platform-selection-architecture-risk](https://industrialmonitordirect.com/blogs/knowledgebase/open-source-plc-platform-selection-architecture-risk)
2. [https://industrialmonitordirect.com/blogs/knowledgebase/replacing-safety-plc-with-embedded-sil-23-solutions](https://industrialmonitordirect.com/blogs/knowledgebase/replacing-safety-plc-with-embedded-sil-23-solutions)
3. [https://industrialmonitordirect.com/blogs/knowledgebase/plc-controlled-e-stop-circuits-safety-standards-and-smart-mcc](https://industrialmonitordirect.com/blogs/knowledgebase/plc-controlled-e-stop-circuits-safety-standards-and-smart-mcc)
4. [https://r6.ieee.org/scv-pses/wp-content/uploads/sites/17/2023/11/Safety-of-Machinery-Does-ISO-13849-1-2023-work-for-you-DNix-2023-rev2.pdf](https://r6.ieee.org/scv-pses/wp-content/uploads/sites/17/2023/11/Safety-of-Machinery-Does-ISO-13849-1-2023-work-for-you-DNix-2023-rev2.pdf)
5. [https://www.scribd.com/document/785267947/mapping-table-en-iso-13849-1-ed-2016-2023](https://www.scribd.com/document/785267947/mapping-table-en-iso-13849-1-ed-2016-2023)
6. [https://www.scribd.com/document/908519450/Test-Seguretat-Maquina-UNE-En-60204](https://www.scribd.com/document/908519450/Test-Seguretat-Maquina-UNE-En-60204)
7. [https://github.com/zephyrproject-rtos/zephyr/wiki/Safety-FAQ](https://github.com/zephyrproject-rtos/zephyr/wiki/Safety-FAQ)
8. [https://industrialmonitordirect.com/blogs/knowledgebase/cip-safety-to-opensafety-bridging-guardlogix-and-br-x20slx910](https://industrialmonitordirect.com/blogs/knowledgebase/cip-safety-to-opensafety-bridging-guardlogix-and-br-x20slx910)
9. [https://www.pilz.com/en-US/support/law-standards-norms/functional-safety/en-iso-13849-1](https://www.pilz.com/en-US/support/law-standards-norms/functional-safety/en-iso-13849-1)
10. [https://www.scribd.com/document/892993042/Overview-and-Comparison-Between-en-ISO-13849-1-and-en-IEC-62061-CAPIEL-white-paper](https://www.scribd.com/document/892993042/Overview-and-Comparison-Between-en-ISO-13849-1-and-en-IEC-62061-CAPIEL-white-paper)
11. [https://medium.com/@mircea.calugaru/iso-13849-1-2023-safety-of-machinery-safety-related-parts-of-control-systems-an-in-depth-b5321f3af8fb](https://medium.com/@mircea.calugaru/iso-13849-1-2023-safety-of-machinery-safety-related-parts-of-control-systems-an-in-depth-b5321f3af8fb)
12. [https://www.scribd.com/document/754906524/bs-en-60204-1-2018](https://www.scribd.com/document/754906524/bs-en-60204-1-2018)
13. [https://scholar.afit.edu/cgi/viewcontent.cgi?article=2565&context=etd](https://scholar.afit.edu/cgi/viewcontent.cgi?article=2565&context=etd)
14. [https://brain4machinery.com/glossary/iso-13849-for-robotic-machinery/](https://brain4machinery.com/glossary/iso-13849-for-robotic-machinery/)
15. [https://industrialmonitordirect.com/blogs/knowledgebase/why-safety-light-curtains-must-not-use-standard-remote-io](https://industrialmonitordirect.com/blogs/knowledgebase/why-safety-light-curtains-must-not-use-standard-remote-io)
16. [https://standards.iteh.ai/catalog/standards/cen/4a35cccd-c58f-47ba-a38a-2b8c0ee5a43f/en-81-42-2025](https://standards.iteh.ai/catalog/standards/cen/4a35cccd-c58f-47ba-a38a-2b8c0ee5a43f/en-81-42-2025)
17. [https://cdn.standards.iteh.ai/samples/74108/435cdfbba67e46f39a767b37cc013b8b/oSIST-prEN-81-42-2022.pdf](https://cdn.standards.iteh.ai/samples/74108/435cdfbba67e46f39a767b37cc013b8b/oSIST-prEN-81-42-2022.pdf)
18. [https://standards.iteh.ai/catalog/standards/cen/64d998b6-aa74-4c7c-97cf-abf90f0d8915/en-81-30-2025](https://standards.iteh.ai/catalog/standards/cen/64d998b6-aa74-4c7c-97cf-abf90f0d8915/en-81-30-2025)
19. [https://www.sick.com/us/en/what-are-performance-levels/w/blog-safety-standard-performance-levels](https://www.sick.com/us/en/what-are-performance-levels/w/blog-safety-standard-performance-levels)
20. [https://www.liftinstituut.com/knowledge-center/20-standards-directives/5-european-elevator-safety-standards](https://www.liftinstituut.com/knowledge-center/20-standards-directives/5-european-elevator-safety-standards)
21. [https://docs.zephyrproject.org/latest/safety/safety_overview.html](https://docs.zephyrproject.org/latest/safety/safety_overview.html)
22. [https://www.analog.com/en/resources/technical-articles/functional-safety-and-industry-4.0.html](https://www.analog.com/en/resources/technical-articles/functional-safety-and-industry-4.0.html)
23. [https://plcprogramming.io/blog/plc-programming-software-complete-guide-2026](https://plcprogramming.io/blog/plc-programming-software-complete-guide-2026)
24. [https://github.com/zakharb/labshock/wiki/Plc-Service](https://github.com/zakharb/labshock/wiki/Plc-Service)
25. [https://plcprogramming.io/openplc/supported-hardware](https://plcprogramming.io/openplc/supported-hardware)
26. [https://autonomylogic.com/runtime](https://autonomylogic.com/runtime)
27. [https://industrialmonitordirect.com/blogs/knowledgebase/linux-compatible-plcs-open-source-and-commercial-options](https://industrialmonitordirect.com/blogs/knowledgebase/linux-compatible-plcs-open-source-and-commercial-options)
28. [https://projects.eclipse.org/proposals/eclipse-canon-c](https://projects.eclipse.org/proposals/eclipse-canon-c)
29. [https://www.zephyrproject.org/celebrating-a-decade-of-zephyr-and-the-journey-ahead/](https://www.zephyrproject.org/celebrating-a-decade-of-zephyr-and-the-journey-ahead/)
30. [https://www.zephyrproject.org/wp-content/uploads/2026/04/Zephyr-Overview-20260424.pdf](https://www.zephyrproject.org/wp-content/uploads/2026/04/Zephyr-Overview-20260424.pdf)
31. [https://www.zephyrproject.org/embedded-world-conference-2026-zephyr-project-workshop-and-sessions/](https://www.zephyrproject.org/embedded-world-conference-2026-zephyr-project-workshop-and-sessions/)
32. [https://www.eclipse.org/org/foundation/annual-reports/2026/](https://www.eclipse.org/org/foundation/annual-reports/2026/)
33. [https://threadxalliance.org/subscription/benefits](https://threadxalliance.org/subscription/benefits)
34. [https://eoss2023.sched.com/list/descriptions](https://eoss2023.sched.com/list/descriptions)
35. [https://eoss2023.sched.com/2023-06-30/list/descriptions/](https://eoss2023.sched.com/2023-06-30/list/descriptions/)
36. [https://github.com/ariexi/the-automotive-collection](https://github.com/ariexi/the-automotive-collection)
37. [https://stonetusker.com/newsletters/](https://stonetusker.com/newsletters/)
38. [https://scispace.com/pdf/self-configuring-safety-networks-2m4zjrkjiq.pdf](https://scispace.com/pdf/self-configuring-safety-networks-2m4zjrkjiq.pdf)
39. [https://machinegeeks.blog/category/safety/](https://machinegeeks.blog/category/safety/)
40. [https://safexplain.eu/wp-content/uploads/2022/11/D2.2-DL-safety-architectural-patterns-and-platform.pdf](https://safexplain.eu/wp-content/uploads/2022/11/D2.2-DL-safety-architectural-patterns-and-platform.pdf)
41. [https://www.kickpi.com/choose-the-right-sbc-for-industrial-projects/](https://www.kickpi.com/choose-the-right-sbc-for-industrial-projects/)
42. [https://upcommons.upc.edu/bitstreams/def43000-8180-41c6-8ef6-a67e0ec5954b/download](https://upcommons.upc.edu/bitstreams/def43000-8180-41c6-8ef6-a67e0ec5954b/download)

[exited with code 0]
