---
{
  "format": 1,
  "metadata": {
    "id": "archived-pi-integration-opportunities-grounded-in-disk-2-project-requirements-2b14b4a9",
    "title": "Pi integration opportunities grounded in disk_2 project requirements",
    "question": "What findings, alternatives and limitations does the historical investigation document about Pi integration opportunities grounded in disk_2 project requirements?",
    "scope": "Original Pi/tooling integration investigation: Pi integration opportunities grounded in disk_2 project requirements. Dated observed/inferred/unknown distinctions and implementation boundaries remain; no current runtime or policy adoption is asserted.",
    "summary": "Historical source-grounded investigation of Pi integration opportunities grounded in disk_2 project requirements; compares integration choices and retains inspected-version, authentication, lifecycle and evidence limitations.",
    "researched_at": null,
    "last_improved_at": null,
    "language": "en",
    "origin": {
      "kind": "imported",
      "platform": "Pi research bundle",
      "author": "unknown",
      "model": "unknown"
    },
    "related_reports": [],
    "warnings": [
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:33.971Z"
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
      "code": "local_dependency",
      "message": "Local file reference may not be portable; review before publication."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "2b14b4a98d315493f06e28a58157c2be51d72907c936c7190cbec03cb467e8c3",
  "proposalRevision": "546b9d87336a5ca1f0f209d4188fefd7f7ab332049f7a6916f22b584d37f9512"
}
---
# Pi integration opportunities grounded in disk_2 project requirements

## Scope and evidence limits

Read-only investigation of the active Machine_concept requirements and tool
inventory, the standalone risk_assessment PRDs, and ISO13849 GUI architecture
documentation. Three Luna scouts covered root/capsule, domain-pipeline and standalone
project documentation; the parent checked key requirements and boundaries directly.
This is not an exhaustive audit of every archived PRD, an upstream license audit,
or fresh runtime verification of the engineering tools. No project files were
edited; no installations, builds, engineering tests or live assessments were run.
No protected PDF/standards text was sent to retrieval/ranking services.

Important source distinctions:
- Machine_concept/CLAUDE.md and .pi/CONTEXT.md are current policy.
  PI_REUSE_REFERENCE, context.md and the older Pi agent design report are historical.
- Capsule status.yaml and explicit decisions matter more than stale prose headings;
  an evaluated/adopted capsule does not prove active global Pi wiring.
- risk_assessment/docs/PRD.md is the current navigation entrypoint. Its defined-machine
  engine and authorized HTML-report scope are documented as complete. Earlier
  completion records are not fresh verification and must not be revived as backlog.
- No new GitHub project was selected solely on popularity. Recommendations reuse
  capabilities already present in the local documentation where possible.

All relative Machine_concept paths below are under
`/media/eldar/disk_2/Machine_concept/`; standalone project paths are explicit.

## Recommended shortlist

### 1. QMD: reusable project-scoped document retrieval — first choice

**Need:** locate requirements, decisions and source pointers before agents work.
QMD complements Jev: QMD discovers documents inside an approved local collection;
Jev retrieves bounded excerpts from explicitly named files and optionally reranks.
Neither proves correctness or completeness.

**Observed:** the risk_assessment project already has QMD configured. The parent ran
only `qmd status`, keyword `qmd search "PRD" -c docs -n 6`, and `qmd get` for the three
PRDs. Status showed a project-local 6.5 MB index, 58 indexed files and zero vectors.
The PRD search returned the current entrypoint, defined-machine and HTML-report PRDs.
Its index was approximately 21 hours old; results remain indexed snapshots.

**Small integration:** an opt-in Pi skill that runs scoped keyword searches from
project cwd, fetches the result and confirms material claims against current files.
Enable it separately per project; do not create a disk-wide/global collection.

**Effort:** low. **Boundary:** keep the existing keyword-only mode; no automatic
embedding/reranker downloads, hybrid searches, source-scope expansion or refresh hooks.

**Sources:** `/media/eldar/disk_2/risk_assessment/docs/local-search.md` (workflow,
indexed scope and constraints); AGENTS.md (QMD-first retrieval policy).

### 2. CodeGraph plus existing LSP: code-impact navigation

**Need:** engineering code is split across independent modules; finding callers,
consumers and affected contracts is more useful than repeatedly scanning files.

**Observed:** CodeGraph and code-intelligence are documented/configured at the
Machine_concept project level. Its .pi/settings.json already selects
pi-lsp-adapter and pi-subdir-context. These are not missing inventions, and project
availability is not the same as portable global availability.

**Small integration:** a reusable project-aware Pi navigation skill: LSP for precise
symbols/types; CodeGraph for candidate caller/impact paths; ordinary reads to verify
edges and source. Keep indexes per project and workers' cwd at the project root.
Workers without MCP can receive explicit source paths or use an approved local CLI;
parent MCP access must not be assumed inherited.

**Effort:** low–medium. **Boundary:** the pinned CodeGraph is heuristic. Root guidance
warns about same-name unions, aliases, shadowing and gitignored omissions. Do not
upgrade, silently reindex unrelated projects, or treat a graph edge as proof.

**Sources:** CODE_INTELLIGENCE/README.md:9–47; CLAUDE.md, code-intelligence section;
.pi/CONTEXT.md; .pi/settings.json. Root current policy is more specific than the
older README's broad codegraph_* tool-family description.

### 3. diagram-design plus Graphviz: a small, visible improvement

**Need:** architecture, safety-flow and pipeline diagrams, with editable source
and predictable SVG/HTML output.

**Observed:** diagram-design is an external project-local skill reference, not a
listed global Pi skill. The capsule's evaluation is marked not started, while its
notes record an existing clone/symlinks and MIT licensing. Graphviz has an evaluated
capsule. Installation/reference presence is not a fresh execution pass.

**Small integration:** adapt the existing skill invocation and resource paths for
Pi, using the existing Graphviz/drawio/Mermaid workflows rather than creating another
diagram service. Keep render commands in their verified environment.

**Effort:** low–medium after a bounded smoke test. **Boundary:** the owner inspects
rendered images. Validate graph/source structure numerically where possible; do not
claim visual verification by a vision model. The capsule says dot is in the stepcad
environment, not necessarily on the generic Pi shell PATH.

**Sources:** .pi/SKILL_INDEX.md; TOOLS/DOCS_VIZ/diagram_design_skill/HANDOFF.md;
TOOLS/INDEX.md, DOCS_VIZ table.

### 4. Viznoir: the most interesting engineering-specific MCP integration

**Need:** inspect simulation output and produce result previews without a ParaView
GUI. The local Code_Aster pipeline already produces .vtu files.

**Observed:** TOOLS/MESH_FEA/viznoir/status.yaml marks the capsule adopted/complete;
README.md's later decision log records adoption as a complement to ParaView and says
MCP registration/pipeline wiring is a next step. Its early README header and HANDOFF
still contain pre-adoption/unfinished-case language. Reconcile this documentation
before treating its full advertised surface as proven. Current global Pi MCP lists
normative-standards, stealth-fetch, gemini-research and Jev, not Viznoir.

**Small integration:** register a project-scoped MCP using its isolated environment
and bounded data directory; begin with inspect_data, extract_stats and an explicitly
requested render. Expose result paths and units, not automatic engineering verdicts.

**Effort:** medium. **Boundary:** its VTK dependencies conflict with the shared
project environment. Preserve isolation and file-access restrictions; rendering is
not numerical validation or image-based safety proof. Historical clone/run permission
is not fresh permission to execute external source in this session.

**Sources:** TOOLS/MESH_FEA/viznoir/{status.yaml,HANDOFF.md,README.md}; README decision
log at lines 134–135; TOOLS/INDEX.md, MESH_FEA table.

### 5. LinkML + Pydantic + Pint: deterministic boundary checks

**Need:** machine inputs flow into many independent modules. Missing fields, schema
mismatches and inconsistent units should be caught before spending model/tool time.

**Observed:** LinkML and Pydantic are already integrated in the electrical library;
Pint has an evaluated boundary-wrapper capsule. This does not mean every machine
contract is already covered or authorizes replacing the standalone risk engine's
contracts.

**Small integration:** a Pi validation skill invokes the owning project's existing
loaders/validators and unit checks, returning failures and file paths before a
requested pipeline action. Schemas remain at their canonical project locations;
generated artifacts are not hand-edited and no global duplicate schema store is added.

**Effort:** medium. **Boundary:** deterministic checks establish structural/dimensional
properties, not engineering adequacy, normative applicability or safety approval.

**Sources:** MACHINE_PRD_ELICITATION_SPEC.md:35–53,87–103; TOOLS/INDEX.md, DATA_CONTRACTS;
TOOLS/DATA_CONTRACTS/linkml_contracts/{status.yaml,CLAUDE.md}. Standalone risk PRD
explicitly excludes introducing a new schema framework/truth store for that product.

### 6. Existing technical-document pipelines plus Sphinx: useful deliverables

**Need:** turn structured evidence into handbooks, maintenance manuals and reviewable
reports while retaining unresolved obligations.

**Observed:** the handbook and maintenance PRDs already specify separate staged
workflows and validation gates; TECH_DOC documents existing CLIs. Sphinx is an
evaluated tool capsule. The separate risk-assessment HTML report is documented as
complete through its existing Python/Mastra public interfaces—not an invitation to
build a second renderer or PDF exporter.

**Small integration:** separate, user-invoked Pi skills select the appropriate
existing pipeline, check prerequisite inputs, offer its existing commands and link
the output plus verification record. Risk-assessment integration should present the
existing self-contained HTML artifact, not author a competing report truth.

**Effort:** medium. **Boundary:** source interpretation and human approval remain
separate. Unknown supplier intervals stay unknown; no automatic numerical/safety
claims or publication. Respect each pipeline's data ownership and user-invoked gates.

**Sources:** TECH_DOC/{CLAUDE.md,handbook_pipeline/PRD.md,maintenance_pipeline/PRD.md};
TOOLS/DOCS_VIZ/sphinx_docs; `/media/eldar/disk_2/risk_assessment/docs/PRD-html-assessment-report.md:117–150`.

## Worth doing later, project-local

- **CadQuery / FreeCAD / cad_reverse:** explicit input/output CLI tools for parametric
  CAD, STEP reconstruction and neutral-format conversions. Existing project tooling,
  not a need to install every CAD dependency globally. Keep recognition/escalation
  and numeric geometry checks authoritative; generated scripts require explicit,
  bounded execution. Sources: MECHANICS/cad_pipeline/cad_reverse/PRD.md:29–78,
  PRD_v1.5_multifeature.md:51–73, TOOLS/INDEX.md CAD_GEOMETRY.
- **STruC++ / OpenPLC / iec-checker:** local PLC compile/lint/simulation workflow
  before any hardware actions. Respect CLI/license isolation and vendor restrictions;
  simulation is not deployment approval. Sources: PLC/research/forward_pipeline_redesign_PRD.md:30–84,337–373;
  TOOLS/INDEX.md SOFTWARE and SAFETY_QA.
- **Machine-PRD intake skill:** the root elicitation spec already defines question
  taxonomy, branching and consumer destinations. A project-only guided skill could
  ask actual givens/design choices/deviations without asking the owner to invent
  computed results. Keep this machinery-domain data separate from EGM software-design
  specifications. Source: MACHINE_PRD_ELICITATION_SPEC.md:1–53,87–103.
- **InvenTree:** consider only when procurement starts; its capsule explicitly
  defers adoption to that point. Avoid a new persistent procurement service for
  ordinary Pi work. Source: TOOLS/PROCUREMENT/inventree_bom.

## Do not add by default

- Another agent framework/scheduler/dashboard: nested Mastra and EGM already address
  general delegation/design; the standalone risk PRD explicitly rejects extra stores,
  generic dashboards and a replacement assessment engine.
- flowful-ai/cad-skill source for commercial engineering use: the local evaluation
  records a PolyForm Noncommercial license block. Reuse existing permissive tooling,
  not the restricted implementation. Source: TOOLS/CAD_GEOMETRY/cadquery_skill/README.md.
- EPLAN local-control MCP on this Linux workstation: the capsule documents Windows
  dependence, unproven integration and remote-RAG freshness/privacy questions.
- Rejected cecode_eurocode or check-jsonschema evaluations: their retained records
  are not an approved backlog.
- A common LLM safety engine replacing risk_assessment or ISO13849 GUI: their Python/
  native domain authorities, stores, source controls and external PL/SIL boundaries
  must remain intact. The ISO app also has host/browser/sandbox prerequisite limits.

## Suggested order

1. QMD helper and CodeGraph/LSP navigation.
2. diagram-design for quick visible value, or Viznoir for FEA-specific value.
3. Existing schema/unit validation and documentation pipeline skills.
4. CAD/PLC workflows only as explicit project-level follow-up.

Make generic integration mechanisms reusable globally, while keeping project data,
indexes, source libraries, engineering environments and domain authority project-local.
No recommendation here is authorization to install, enable, execute or publish it.
