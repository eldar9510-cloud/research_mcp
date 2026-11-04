---
{
  "format": 1,
  "metadata": {
    "id": "ai-development-evidence-2026-11-03",
    "title": "AI-driven development: academic foundations and ground truth (draft)",
    "question": "What do foundational and frontier studies actually establish about AI development, verification and ground truth?",
    "scope": "Distinguishes software engineering, agent operation and model science; empirical caveats and contrary results as researched on 2026-11-03.",
    "summary": "Evidence synthesis on tests, review, agent coordination, context instructions, changing capabilities and the limits of benchmarks and model judgments.",
    "researched_at": "2026-11-03",
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi",
      "author": "Pi lead assistant; ten Terra workers supplied bounded evidence only",
      "model": "gpt-6-astra (lead, session roster); openai-codex/gpt-6.1-terra (evidence retrieval, max effort)"
    },
    "related_reports": [
      {
        "id": "ai-development-sources-2026-11-03",
        "relationship": "reuses"
      }
    ],
    "warnings": [
      "DRAFT: independent validation/review remains paused at the user’s request. This import is storage only, not acceptance or publication.",
      "Recommendations are proposed local defaults, not a proven optimal pipeline, active global policy or production-readiness certification.",
      "Exact original body preserved. Relative links resolve in the original bundle at /home/eldar/.local/share/pi-research/ai-development-workflow-2026-11-03; raw source archives and worker evidence were not imported.",
      "Byte integrity and HTTP retrieval do not verify conclusions, currentness or redistribution rights."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T18:17:00.000Z",
    "updated_at": "2026-11-04T18:17:00.000Z",
    "imported_at": "2026-11-02T23:51:45.965Z"
  },
  "warnings": [
    {
      "code": "transcript_dependency",
      "message": "Possible transcript-only evidence; review before publication."
    },
    {
      "code": "unverified_relationship",
      "message": "Relationship to ai-development-sources-2026-11-03 is unverified until reviewed."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "8c837fee02a6dc23c8b6924ecc0cc895cbcac21e2e605ee23fc54ee526c56e66",
  "proposalRevision": "d02453d0855d6790d56eecd9b7ca0319249310631ccc981e9e447dc77105a34c"
}
---
# Evidence, academic foundations and “ground truth”

**Research date:** 3 November 2026.  
**Status:** research synthesis supporting the draft workflow. The separate validation/independent-review step is **pending**; the user requested a pause after drafting.

## 1. Three questions that must stay separate

1. **Software engineering:** How do we specify, build, check, release and maintain a useful product?
2. **AI operation:** How do we configure models, instructions, tools and workers to carry out that engineering well?
3. **Model science:** What do training objectives, inference methods and empirical evaluations actually establish about model behavior?

A result about transformer training does not determine how many tests your application needs. A result about parallel web research does not establish the right number of coding agents. A passing coding benchmark does not certify that a particular application is safe to release.

The workflow in [REPORT.md](REPORT.md) is an engineering synthesis across these questions, not a direct prescription from any one paper.

## 2. Foundational and frontier academic papers

The following are primary papers, not summaries by tool promoters. Some are foundational rather than recent; that is intentional. Recency matters most when judging *current capability*, not when explaining an established training mechanism. Source versions, links and archives are in [SOURCES.md](SOURCES.md).

| Paper | What the source establishes | What it does **not** establish |
|---|---|---|
| **Vaswani et al., Attention Is All You Need** — NeurIPS 2017; archived revision 2023. [S36](SOURCES.md#s36), abstract and §§1–3 | Introduces the Transformer architecture, using attention rather than recurrent/convolutional sequence computation; evaluates translation and parsing. | That attention guarantees truth, software correctness or instruction compliance. It does not disclose every current proprietary model's architecture. |
| **Ouyang et al., InstructGPT / Training Language Models to Follow Instructions with Human Feedback** — 2022. [S37](SOURCES.md#s37), abstract, introduction and training description | Demonstrations, human preference rankings, a reward model and RL can improve instruction following and human-rated usefulness. The paper explicitly reports remaining simple mistakes and fabricated facts. | That preference is identical to factual truth, or that a confident/polished response is correct. The training aligns to a particular set of labelers/researchers, not a universal definition of value. |
| **Hoffmann et al., Training Compute-Optimal Large Language Models (Chinchilla)** — 2022. [S38](SOURCES.md#s38), abstract and §§1–2 | Training data, parameter count and training compute must be considered together; investigates resource allocation empirically. | An optimal worker count, a fixed prompt length, or a reason to set every coding task to `max` reasoning. Training compute and runtime orchestration are different problems. |
| **Snell et al., Scaling LLM Test-Time Compute Optimally** — 2024. [S39](SOURCES.md#s39), §§1, 3–4 | In PaLM-2/MATH experiments, the benefit of inference-time search/revision depends on difficulty and how compute is allocated. The method uses learned verifiers and specially trained capabilities. | That more runtime reasoning always helps, or that its numerical gains transfer to your current coding models. Difficulty estimation has costs; the experiments omit some of those costs for simplicity. |
| **DeepSeek-AI, DeepSeek-R1** — 2025 author paper. [S43](SOURCES.md#s43), §§1, 2.2, 3 and 6 | R1-Zero uses reinforcement learning with rule-based accuracy/format rewards; R1 adds a multistage pipeline. Verifiable mathematical answers and coding test cases provide feedback. The paper discusses reward hacking and verifier limitations. | That all current models use that recipe; that R1-Zero and R1 are the same training procedure; or that success on checkable competition problems guarantees success on whole applications. The paper itself distinguishes software-engineering limitations. |
| **Jimenez et al., SWE-bench** — 2023 / ICLR 2024. [S41](SOURCES.md#s41), benchmark construction, evaluation and limitations | Repository issues, patches and executable tests permit repeatable evaluations of issue resolution. The original benchmark uses 2,294 tasks from 12 Python repositories. | Complete semantic correctness, safe production behavior, or a current model ranking. The original benchmark's scope and tests constrain what “resolved” means. |
| **Kim et al., Capable Language Models Can Outgrow the Benefits of Collaboration** — *Nature Machine Intelligence*, July 2026. [S40](SOURCES.md#s40), abstract, main results, discussion and methods | A controlled comparison of **260 configurations**, six benchmarks, five architectures and three model families finds that coordination benefits depend on task/model conditions. Strong single-agent performance can leave little benefit for added coordination. | A universal threshold for delegating your tasks. Coding/terminal cells use only **20 instances**, with wide intervals; absolute prediction on unseen domains is poor. Some reported patterns do not survive conservative statistical corrections. |
| **Liu et al., Between Spoilers and Guesswork** — October 2026 preprint. [S42](SOURCES.md#s42), introduction and §5 | Benchmark task descriptions can omit interfaces that hidden tests require, or disclose so much reference-solution information that results become misleading. The paper investigates how hints affect measured success. | A universal repair for coding benchmarks. It uses small subsets, one trajectory per configuration/instance and rubric-dependent model judgments; independent replication remains important. |

### Practical implications—my synthesis, not a theorem from these papers

- **Use external evidence:** compilation, actual execution, independent expected values and user-visible results—not only an agent's self-assessment.
- **Specify outcomes:** let the model choose an implementation unless compatibility or another genuine requirement constrains it.
- **Treat verifiers as software too:** a wrong test can reward the wrong result or reject a correct implementation.
- **Measure the entire system:** model, instructions, tools, environment and orchestration together. A model name alone is not the pipeline.
- **Spend extra compute selectively:** difficult or consequential work can justify more effort, but “more” is not itself evidence of higher quality.

No public paper inspected here establishes the full training recipe or current reliability of your configured Terra/Sol profiles. The foundation papers explain relevant mechanisms; they are not reverse engineering of those proprietary models.

## 3. What counts as ground truth in your projects?

There is no single perfect oracle. Use the strongest appropriate reference and say what it actually proves.

| Reference | What it establishes | Important limitation |
|---|---|---|
| **Your agreed requirements and examples** | The intended behavior and scope | A written requirement can be ambiguous or wrong. An AI-written specification is not automatically your intent. |
| **Authoritative domain/API specification** | The externally required contract, for the specified version | Versions change; domain assumptions may not apply. Safety/regulatory conclusions can require qualified interpretation. |
| **Worked example, known result or independent implementation** | Expected values independently of the new code | It can still contain mistakes. For high-impact calculations, corroborate the reference. |
| **Executable tests** | Particular assertions hold for particular inputs and environments | Passing is not proof about all inputs, side effects or deployments. Tests derived from the same mistaken code can share its error. |
| **Running application and observed state** | What happened in the environment actually checked | A button's appearance does not prove the operation worked; an asserted save does not prove persistence. Environment and data matter. |
| **Human acceptance or domain expertise** | Product usefulness, taste or specialized judgment | Human reviewers can also miss things. A non-developer should not be assigned technical approval beyond their expertise. |
| **Benchmark score or AI reviewer verdict** | Performance under that benchmark or review procedure | Neither is the ground truth of your application. Model graders are fallible and can share correlated blind spots. |

This distinction appears directly in the agent-evaluation literature: the relevant outcome is the actual changed environment, not the transcript saying it changed. Graders can be deterministic, model-based or human; each has limitations. [S17](SOURCES.md#s17)

### A concrete example

Requirement: “A user can export their own saved items, never somebody else's.”

Weak evidence: implementation and tests agree that `exportItems()` returns whatever the current helper returns.

Stronger evidence: independently prepared examples of two users; check that the first gets their own expected items, that a direct request for the other's export is denied, and that the real endpoint returns the expected result. An acceptance test can be generated by AI, but its expected outcome comes from the requirement—not from copying the implementation.

The point is **independent grounding**, not a rule that every test must be written by another agent. Clear references can be more useful than several agents agreeing.

For subjective design, define examples and observable usability goals, then show the running result. Asking several models whether an interface is “excellent” does not convert taste into objective truth.

## 4. What the productivity evidence says—and why dates matter

### METR's results are not a permanent verdict on AI

The July 2025 randomized study covered **16 experienced maintainers and 246 tasks** in familiar repositories using early-2025 tools. AI-allowed work took about **19% longer** in that setting. It did not study a non-developer creating a new small product with November 2026 models. [S11](SOURCES.md#s11)

METR's February 2026 follow-up reported raw task-time changes of **−18%** for returning participants (interval −38% to +9%) and **−4%** for new participants (−15% to +9%). Both intervals include no effect. More importantly, METR calls the estimates unreliable because of selection effects, reduced pay and difficulties measuring concurrent agent work. Those numbers are **not** a precise current benefit estimate. [S12](SOURCES.md#s12)

The May 2026 survey of **349 technical workers** reports perceived gains. It is newer but self-reported, not a controlled replacement measurement. METR's accompanying task-substitution analysis also explains why doing old tasks faster, choosing different tasks and producing more valuable work are different outcomes. [S13](SOURCES.md#s13), [S31](SOURCES.md#s31)

**Conclusion:** neither “AI slows everyone down” nor “newer AI automatically makes our pipeline efficient” is supported. Measure accepted work, rework and elapsed time in your setting. Do not confuse fast code generation with fast successful delivery. DORA's March 2026 analysis also discusses verification overhead, but its enterprise framing is not direct evidence for your exact setup. [S33](SOURCES.md#s33)

### `AGENTS.md` evidence is genuinely mixed

Gloaguen et al.'s **September 2026 v3** evaluates multiple model/harness combinations on SWE-bench Lite and a new 138-task, 12-repository Python benchmark. Context files did not generally produce a statistically significant task-success improvement versus no context file. Generated files increased measured work/cost; developer-committed files outperformed generated files in one comparison. [S30](SOURCES.md#s30)

Important qualification: do not flatten its abstract into “all context files cost over 20% more.” The body reports generated-file cost increases of roughly **20%/23%** in the two settings; its developer-file discussion reports an average increase of at most **19%**. It also reports a separate documentation-removal ablation where generated context was more helpful. Developer-committed does not prove entirely human-authored.

Lulla et al.'s 2026 study, using **GPT-5.2-Codex, ten repositories and 124 small PR tasks**, reports lower median runtime (**28.64%**) and output-token use (**16.58%**) with context files. But comprehensive correctness evaluation is explicitly outside its scope; it performs a limited output sanity check. Fewer output tokens also does not mean every token/cost statistic fell. [S32](SOURCES.md#s32)

These studies use different task selections, models, file contents and outcomes. Do not choose whichever headline supports a preferred workflow. Concise project-specific guidance is a reasonable *candidate*; its actual effect should be checked locally. Vendor recommendations in S19–S21 describe useful mechanisms but do not settle the empirical question.

## 5. More agents and reviews: contrary evidence matters

Anthropic's 2025 research-system article reports a **90.2% improvement on its internal research evaluation** for an Opus-4 lead with Sonnet-4 workers versus a single Opus-4 agent. It also reports typical token usage of about **4× chat for agents** and **15× chat for multi-agent systems**. Both token comparisons use chat as the baseline; the article does not say multi-agent systems use 15× a single agent's tokens. These are research-system observations, not proven coding gains. [S15](SOURCES.md#s15)

The peer-reviewed July 2026 study is newer than the widely circulated 180-configuration preprint. Its published 260-configuration results show that coordination can help some tasks and hinder others. Its small coding subsets, shared-environment design and limited cross-domain prediction prevent treating its fitted thresholds as universal operational rules. [S40](SOURCES.md#s40)

Anthropic's March 2026 application-harness account is especially relevant to your concern: upgrading models allowed the author to remove some context resets and per-sprint structure, and use evaluation more selectively. The article also describes remaining bugs and expensive runs. It is a vendor case study, **not proof that exactly one review is optimal**. [S35](SOURCES.md#s35)

**Conclusion:** a capable lead with targeted assistance is a defensible starting point. Whether an extra reviewer or worker earns its cost is empirical and task-dependent. The report's default of one full independent review for ordinary meaningful work is a **bounded operating policy to pilot**, not a research-derived constant.

## 6. Tests, review and issue ranking have firmer engineering foundations

- **Risk-based testing:** ISTQB explicitly ties testing scope, techniques and effort to risk analysis. It allows quantitative or qualitative assessment; multiplying invented numbers is not required. §§5.2.1–5.2.4. [S04](SOURCES.md#s04)
- **Coverage:** Google's guidance warns against chasing high percentages while still advocating coverage of important, changing code. It gives contextual numerical guidance too. It should not be misrepresented as “coverage is useless” or “Google says never use thresholds.” [S03](SOURCES.md#s03)
- **Maintainable tests:** Google's unit-testing chapter favors behavior and public interfaces over private implementation coupling, and explains why internal refactors should not require wholesale test rewrites. It also explains why some overlapping coverage is valuable. [S02](SOURCES.md#s02)
- **Review stopping:** Google's standard prioritizes overall code health and progress over perfection. Nits and educational comments need not block. This supports a finite review goal, not a specific pass count. [S05](SOURCES.md#s05), [S07](SOURCES.md#s07)
- **Triage:** ISTQB lists severity and fix priority separately; FIRST says CVSS base scores measure severity, not full risk. P0–P3, the confidence labels and our release-blocker definitions remain local conventions. [S04](SOURCES.md#s04), [S29](SOURCES.md#s29)
- **Release scope:** NIST SSDF v1.1 describes risk-based implementation choices, recording/triaging findings and preserving release artifacts. It is not a requirement to copy a large organization's entire process. Its v1.2 page was still labeled an initial public draft in the material retrieved. [S24](SOURCES.md#s24), [S34](SOURCES.md#s34)
- **Operational scale:** Google's canary guidance requires meaningful populations and comparison signals. Small beta traffic may not provide those; route rollback also does not reverse data mutations. [S26](SOURCES.md#s26)

None of these sources establishes a universal requirement for mandatory TDD, a fixed number of tests per function, a fixed test-pyramid ratio, or repeated full AI reviews until every suggestion disappears.

## 7. Evidence boundaries and what remains unproved

**Collected:** 43 source URLs were attempted; 41 returned archived documents/pages, and two were denied. Landing pages were not treated as complete reports. Ten Terra/max leaf workers retrieved relevant evidence from the local corpus and instructions; the parent inspected decisive passages, added academic sources and wrote the conclusions. The raw extracts can contain navigation or damaged equations; source documents take precedence. Detailed retrieval failures are recorded in [SOURCES.md](SOURCES.md).

**Not established by this work:**

- The exact cause, cost or frequency of overtesting in your previous sessions; no historical session audit was performed.
- The best model, reasoning setting, test budget or review count for your particular repositories.
- A guarantee of zero bugs, a security certification, or production readiness of any application.
- That all current model internals are public or follow the same foundational recipe.
- That all current vendor advice has controlled empirical support.
- That this proposed workflow has already improved your outcomes—it has not yet been piloted.

**Next step, when you authorize continuation:** validate the draft's evidence and links, obtain one bounded independent review, then agree on targeted adoption. No global behavior changes are active from these documents, and the entire research corpus should not be injected into every agent session.
