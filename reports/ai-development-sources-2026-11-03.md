---
{
  "format": 1,
  "metadata": {
    "id": "ai-development-sources-2026-11-03",
    "title": "AI-driven development: source register (draft)",
    "question": "Which primary sources support a proportionate AI-assisted development workflow?",
    "scope": "Dated source register with 43 attempted URLs, provenance and retrieval limitations; companion to the draft workflow.",
    "summary": "Primary engineering guidance, academic papers, current AI research, archived-source links and explicit retrieval limitations.",
    "researched_at": "2026-11-03",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi",
      "author": "Pi lead assistant; ten Terra workers supplied bounded evidence only",
      "model": "gpt-6-astra (lead, session roster); openai-codex/gpt-6.1-terra (evidence retrieval, max effort)"
    },
    "related_reports": [],
    "warnings": [
      "DRAFT: independent validation/review remains paused at the user’s request. This import is storage only, not acceptance or publication.",
      "Recommendations are proposed local defaults, not a proven optimal pipeline, active global policy or production-readiness certification.",
      "Exact original body preserved. Relative links resolve in the original bundle at /home/eldar/.local/share/pi-research/ai-development-workflow-2026-11-03; raw source archives and worker evidence were not imported.",
      "Byte integrity and HTTP retrieval do not verify conclusions, currentness or redistribution rights."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T18:17:00.000Z",
    "updated_at": "2026-11-04T18:17:00.000Z",
    "imported_at": "2026-11-02T23:51:45.842Z"
  },
  "warnings": [
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "ac1626f3cac91bf64d5bd33fc9ed561bf4652deaab18bf8812174707bc70e5dd",
  "proposalRevision": "6d4ecf78f8b786afa58ed18504fb9bc14baf58bb4bab3113f6b3971e4e31e35b"
}
---
# Source register

Research date: **3 November 2026, local time**. Download timestamps are UTC. These are sources, not an endorsement of every statement they contain. Publication age, evidence type and applicability matter more than the number of citations.

**Evidence labels:** research = an empirical study; practice = engineering experience/guidance; specification = a defined interface or framework; vendor = advice or results from a supplier about its own systems. A paper from a vendor can still be primary research, but conflicts of interest and experimental limitations remain relevant.

The source IDs below are used by the accompanying report. Full HTTP-response hashes and retrieval outcomes are in [the manifest](sources/manifest.json). Text extracts are navigation aids; PDF page numbers and the original sources take precedence if extraction damages a table or equation. `*.article.txt` contains a second, article-focused HTML extraction. In particular, **use `S03.article.txt`, not `S03.txt`**, because the first extraction omitted the blog's template/noscript article body.

## Software engineering

### S01
**Google, Software Engineering at Google, Chapter 11: Testing Overview** (2020). Engineering practice at Google's scale, not an experiment establishing a universal test ratio. [Original](https://abseil.io/resources/swe-book/html/ch11.html) · [Archive](sources/S01.article.txt).

### S02
**Google, Software Engineering at Google, Chapter 12: Unit Testing** (2020). Practice; observable behavior, public interfaces and maintainable tests. [Original](https://abseil.io/resources/swe-book/html/ch12.html) · [Archive](sources/S02.article.txt).

### S03
**Google Testing Blog, Code Coverage Best Practices** (7 August 2020). Practice; both the value and limits of coverage. Contains contextual coverage targets as well as warnings against universal mandates. [Original](https://testing.googleblog.com/2020/08/code-coverage-best-practices.html) · [Complete article extract](sources/S03.article.txt).

### S04
**ISTQB, Certified Tester Foundation Level syllabus v4.0.1** (15 September 2024). Professional syllabus; §§5.1, 5.2 and 5.5 distinguish completion criteria, risk-based testing and defect reporting. Not a standardized P0–P3 policy. [Original PDF](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) · [Text](sources/S04.txt).

### S05
**Google Engineering Practices, The Standard of Code Review** (living guidance; publication date not established). Practice; improvement rather than perfection, facts over preferences, optional nits. [Original](https://google.github.io/eng-practices/review/reviewer/standard.html) · [Archive](sources/S05.article.txt).

### S06
**Google Engineering Practices, Small CLs** (living guidance). Practice; small self-contained changes, not a mandatory line-count quota. [Original](https://google.github.io/eng-practices/review/developer/small-cls.html) · [Archive](sources/S06.article.txt).

### S07
**Google Engineering Practices, How to Write Code Review Comments** (living guidance). Practice; explain reasoning and distinguish required changes from optional suggestions. [Original](https://google.github.io/eng-practices/review/reviewer/comments.html) · [Archive](sources/S07.article.txt).

### S08
**DORA, Working in Small Batches** (living capability guide). Research-informed practice; not a randomized test of this proposed personal workflow. [Original](https://dora.dev/capabilities/working-in-small-batches/) · [Archive](sources/S08.article.txt).

### S09
**DORA, State of AI-assisted Software Development 2025**. **Landing-page summary only** was archived here, not the complete underlying report. Supports attribution of DORA's “amplifier” framing, not uninspected numerical or causal claims. [Original](https://dora.dev/research/2025/dora-report/) · [Archive](sources/S09.article.txt).

### S10
**DORA, ROI of AI-assisted Software Development** (2026 report landing page). **Landing page only**; recorded as a current follow-up, not used as proof of a particular ROI. [Original](https://dora.dev/ai/roi/report/) · [Archive](sources/S10.article.txt).

### S24
**NIST SP 800-218, SSDF v1.1** (February 2022, final). Risk-based secure-development framework; especially PW.7, PW.8, PS.3, RV.2 and RV.3. Citing selected practices does not establish SSDF compliance. [Original PDF](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf) · [Text](sources/S24.txt).

### S26
**Google SRE Workbook, Canarying Releases** (2018). Operational practice; a canary needs a useful comparison and sufficient signal. Large-scale rollout machinery is not automatically appropriate for a small beta. [Original](https://sre.google/workbook/canarying-releases/) · [Archive](sources/S26.article.txt).

### S27
**Google SRE Workbook, Simplicity** (2018). Operational practice; managing complexity and eliminating unnecessary work. [Original](https://sre.google/workbook/simplicity/) · [Archive](sources/S27.article.txt).

### S29
**FIRST, CVSS v4.0 User Guide** (living guide to v4.0). Security specification guidance; base severity is not environment-specific risk or business priority. Not a general-purpose bug-ranking scheme. [Original](https://www.first.org/cvss/v4.0/user-guide) · [Archive](sources/S29.article.txt).

### S33
**DORA, Balancing AI Tensions: Moving from AI Adoption to Effective SDLC Use** (10 March 2026). Research-informed analysis, including verification overhead and enterprise experiences; not a solo-developer controlled trial. [Original](https://dora.dev/insights/balancing-ai-tensions/) · [Archive](sources/S33.article.txt).

### S34
**NIST SP 800-218r1, SSDF v1.2, initial public draft** (17 December 2025). The retrieved NIST page identifies it as a draft; do not present it as a final requirement. Included to check whether the older final framework had newer work. [Original](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd) · [Archive](sources/S34.article.txt).

## AI operation, tools and evaluation

### S11
**METR, Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity** (10 July 2025). Randomized study: 16 experienced maintainers, 246 tasks, early-2025 tools. Scope-limited; must be read with S12 and S31. [Original](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [Archive](sources/S11.article.txt).

### S12
**METR, We Are Changing Our Developer Productivity Experiment Design** (24 February 2026). Follow-up reporting raw estimates and serious selection/time-measurement problems; not a reliable universal current speedup estimate. [Original](https://metr.org/blog/2026-02-24-uplift-update/) · [Archive](sources/S12.article.txt).

### S13
**METR, Task Substitution and Uplift** (8 May 2026). Analysis of changed task selection and value versus speed; conceptual framing, not a new randomized productivity result. [Original](https://metr.org/blog/2026-05-08-task-substitution-and-uplift/) · [Archive](sources/S13.article.txt).

### S14
**Anthropic, Building Effective Agents** (19 December 2024). Vendor engineering guidance; start simple, distinguish workflows from autonomous agents, add complexity when justified. [Original](https://www.anthropic.com/engineering/building-effective-agents) · [Archive](sources/S14.article.txt).

### S15
**Anthropic, How We Built Our Multi-Agent Research System** (13 June 2025). Vendor case study and internal research-task evaluation. Its quality and token comparisons are not software-development guarantees. [Original](https://www.anthropic.com/engineering/multi-agent-research-system) · [Archive](sources/S15.article.txt).

### S16
**Anthropic, Effective Context Engineering for AI Agents** (29 September 2025). Vendor practice; context selection, retrieval and handoffs. [Original](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) · [Archive](sources/S16.article.txt).

### S17
**Anthropic, Demystifying Evals for AI Agents** (9 January 2026). Vendor practice; tasks/trials, outcomes versus transcripts, deterministic/model/human graders, capability versus regression evaluations. Benchmark-status statements are dated to publication, not assumed current. [Original](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) · [Archive](sources/S17.article.txt).

### S19
**OpenAI, Codex Best Practices** (living documentation). Vendor/product guidance; clear tasks, verification, reusable repository instructions and appropriate delegation. Codex-specific features are not automatically Pi features. [Original](https://developers.openai.com/codex/learn/best-practices) · [Archive](sources/S19.article.txt).

### S20
**Agent Skills Specification** (living specification). Interoperability/progressive disclosure; does not itself prove a productivity benefit. [Original](https://agentskills.io/specification) · [Archive](sources/S20.article.txt).

### S21
**Agent Skills, Best Practices for Skill Creators** (living guidance). Concise, scoped instructions and testing skill behavior. [Original](https://agentskills.io/skill-creation/best-practices) · [Archive](sources/S21.article.txt).

### S22
**Model Context Protocol, Security Best Practices, 2026-07-28 documentation path**. Protocol security guidance; applicability depends on transport and authorization design. [Original](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) · [Archive](sources/S22.article.txt).

### S23
**OWASP, LLM01: Prompt Injection** (living risk guidance). Untrusted direct/indirect instructions, privilege restrictions and safeguards. These reduce risk; they do not prove immunity. [Original](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) · [Archive](sources/S23.article.txt).

### S28
**GitHub, Application Card: GitHub Copilot Agents** (living product documentation). Includes AI review limitations and product-specific permissions. GitHub's enforcement mechanisms do not establish Pi's security properties. [Original](https://docs.github.com/en/copilot/responsible-use/agents) · [Archive](sources/S28.article.txt).

### S30
**Gloaguen et al., Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?** (arXiv v3, 29 September 2026). Primary research/preprint; inspect study construction and tested models. [Original/versioned paper](https://arxiv.org/html/2602.11988v3) · [Archived retrieved text with version header](sources/S30.txt). Compare S32; do not rely on older summaries of earlier revisions.

### S31
**METR, Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity** (11 May 2026). Survey of 349 technical workers, not a randomized measurement of realized productivity. [Original](https://metr.org/blog/2026-05-11-ai-usage-survey/) · [Archive](sources/S31.article.txt).

### S32
**Lulla et al., On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents** (2026, author paper on arXiv). Ten repositories, 124 small PR tasks, GPT-5.2-Codex; measures runtime/tokens, not comprehensive functional correctness. Publication metadata contains placeholder fields; no peer-review status is inferred from them. [Original](https://arxiv.org/html/2601.20404) · [Archive](sources/S32.article.txt).

### S35
**Anthropic, Harness Design for Long-Running Application Development** (24 March 2026). Vendor experiments and case studies; newer models allowed removal of some scaffolding, while evaluators still helped on difficult work. Not a controlled estimate of ideal review counts. [Original](https://www.anthropic.com/engineering/harness-design-long-running-apps) · [Archive](sources/S35.article.txt).

## Foundational and frontier academic work

### S36
**Vaswani et al., Attention Is All You Need** (NeurIPS 2017; archived arXiv v7 dated 2 August 2023). Transformer architecture research. Explains a foundation, not the undisclosed internals of every current model. [Original PDF](https://arxiv.org/pdf/1706.03762) · [Text](sources/S36.txt).

### S37
**Ouyang et al., Training Language Models to Follow Instructions with Human Feedback** (2022). InstructGPT primary research; supervised demonstrations, reward modeling and RLHF. Preference labels are not proof of factual or software correctness. [Original PDF](https://arxiv.org/pdf/2203.02155) · [Text](sources/S37.txt).

### S38
**Hoffmann et al., Training Compute-Optimal Large Language Models** (2022). Chinchilla primary research about allocating *training* compute/data/parameters. Not a rule for agent counts or the reasoning effort setting in Pi. [Original PDF](https://arxiv.org/pdf/2203.15556) · [Text](sources/S38.txt).

### S39
**Snell et al., Scaling LLM Test-Time Compute Optimally Can Be More Effective than Scaling Model Parameters** (2024 paper). Primary research on PaLM-2/MATH and inference strategies; not a direct benchmark of modern coding agents or Pi's `max` setting. [Original](https://arxiv.org/html/2408.03314) · [Archive](sources/S39.article.txt).

### S40
**Kim et al., Capable Language Models Can Outgrow the Benefits of Collaboration** (*Nature Machine Intelligence*, 24 July 2026, DOI 10.1038/s42256-026-01268-y). Peer-reviewed, controlled comparison of 260 configurations across six benchmarks. Coding/terminal subsets have only 20 tasks per configuration; reported thresholds are not universal laws. This published paper extends the earlier 180-configuration “Towards a Science of Scaling Agent Systems” work. [Original](https://www.nature.com/articles/s42256-026-01268-y) · [Archive](sources/S40.article.txt).

### S41
**Jimenez et al., SWE-bench: Can Language Models Resolve Real-World GitHub Issues?** (2023 paper, ICLR 2024 benchmark). Primary benchmark research. Original issue/test methodology, not a current frontier-model leaderboard or a complete correctness oracle. [Original](https://arxiv.org/html/2310.06770) · [Archive](sources/S41.article.txt).

### S42
**Liu et al., Between Spoilers and Guesswork: Avoiding Over-Specification in Coding Benchmarks** (October 2026 arXiv preprint). Recent research on aligning prompts with hidden interface requirements without leaking solutions. Single trajectories, subsets and model-based judgments limit conclusions. [Original](https://arxiv.org/html/2610.22760) · [Archive](sources/S42.article.txt).

### S43
**DeepSeek-AI, DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning** (2025; retrieved author paper). Documents R1-Zero/R1 training and verifiable rewards. Findings and limitations describe those models, not all later frontier systems. [Original](https://arxiv.org/html/2501.12948) · [Archive](sources/S43.article.txt).

## Discovered but not relied on as full-text evidence

### S18
**OpenAI, Harness Engineering**. [URL](https://openai.com/index/harness-engineering/). Direct retrieval returned HTTP 403; ordinary web-fetch tooling also failed. Search discovery alone was not treated as full-source verification. S19 and S35 provide accessible, directly inspected material instead.

### S25
**CISA, Known Exploited Vulnerabilities Catalog**. [URL](https://www.cisa.gov/known-exploited-vulnerabilities-catalog). Direct retrieval returned HTTP 403. Not used to establish a catalog-specific claim; general severity-versus-risk reasoning uses S04 and S29.

## Retrieval limitations

Web discovery used the configured web-search tool. Its page-fetch component failed with `loadFetchContentRedirectPolicy is not a function`; a structured source-check consequently returned missing evidence. MCP stealth-fetch refused non-allowlisted research domains, and that boundary was not changed. Already identified public URLs were then archived through ordinary unauthenticated HTTP requests, without cookies, credentials or a replacement research provider. A later search batch also encountered provider rate limiting; known primary-paper URLs were retrieved directly. Neither failed fetches nor search summaries were counted as verified passages.

Ten Terra/max workers extracted bounded evidence from these local sources and local instructions. They were forbidden to recommend policy, edit the sources or delegate further. The parent conducted the additional academic research, checked decisive passages and owns the synthesis. Worker outputs are evidence-finding aids, not independent proof or a vote on the conclusions.
