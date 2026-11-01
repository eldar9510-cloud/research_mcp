---
{
  "format": 1,
  "metadata": {
    "id": "deterministic-nested-diagram-html",
    "title": "Deterministic nested block-diagram tooling for standalone HTML",
    "question": "How can a dense nested engineering diagram preserve fixed positions and orthogonal routing in self-contained HTML/SVG?",
    "scope": "About 90 nodes, 190 typed edges, nested containers and author-controlled coordinates; ranking synthesis, not an implemented diagram.",
    "summary": "Ranks layout-spec-to-SVG, JointJS, D2/TALA and maxGraph; contrasts fixed placement with auto-layout and flags TALA licensing.",
    "researched_at": null,
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
      "Imported without fresh source or technical verification; historical findings are not current compliance, safety or legal certification.",
      "Original report bytes/citations are preserved. Third-party quotations, code and sources retain their own rights; unresolved local/transcript references remain unavailable.",
      "Question date not promoted to researched_at.",
      "Tool capabilities/license claims not independently checked.",
      "Research interaction identifier needs publication review.",
      "Source-provided public links unchecked.",
      "Existing Python/Graphviz generator and column/family design not inspected.",
      "Research interaction identifier present; no value copied.",
      "Local project layout/edge-count context.",
      "Source-stated generating agent label: deep-research-preview-04-2026; underlying model/platform remain unknown unless explicitly attributed."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:30:30.096Z",
    "updated_at": "2026-11-01T23:30:30.096Z",
    "imported_at": "2026-11-01T20:38:59.469Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "37b15a95044f88ccd2f73e50dfddc354ea8e65d73143c138430fb2359b655fde",
  "proposalRevision": "ac5e207d79c247ff5e0b7dabb0820406ee4692288223db8ef74f0ba9d54f9de8"
}
---
# Deterministic nested block-diagram HTML tooling — survey

> **Question (2026-08-17):** Render a dense engineering electrical block diagram as a
> self-contained HTML file (inline SVG, no server): ~90 component nodes, ~190 typed/colored
> edges, NESTED containers (blocks-in-blocks, 2–3 levels), DETERMINISTIC author-controlled
> layout (define spatial order a priori, NOT force-directed — main complaint about Graphviz:
> topologically correct but spatially "casual"), orthogonal routing with minimal overlaps,
> editorial/branded styling. Survey & rank tools: Graphviz fixed-pos (neato -n), ELK/elkjs, D2
> (dagre/elk/TALA), Mermaid, React Flow, JointJS, GoJS, mxGraph/maxGraph, Cytoscape preset,
> Structurizr/C4, custom layout-spec→SVG generator. For a hand-curated deterministic nested
> engineering block diagram in standalone HTML, which gives the most a-priori spatial control
> with publication-quality output?
>
> agent: deep-research-preview-04-2026 · status: completed · tokens: 1,772,773 · interaction_id: v1_ChcxR3lEYXQ3eUVwYjJ2ZElQa05IU3lBMBIXMUd5RGF0N3lFcGIydmRJUGtOSFN5QTA

## Recommendation ranking (verbatim synthesis)

**Rank 1 — Custom "Layout-Spec-to-SVG" Generator Pipeline.** Decouple into a data-spec phase
and a compile phase. (1) Author a JSON spec: nodes with explicit `x,y,width,height,parent`;
edges `source→target` → absolute a-priori determinism. (2) A Node.js script ingests it and uses
a headless router `@mr_mint/elkjs-libavoid` (wraps the C++ `libavoid` obstacle-avoiding
orthogonal router compiled to WebAssembly): register every fixed node box as an obstacle,
request routes for the ~190 edges → optimal orthogonal paths, parallel lines nudged apart.
(3) Emit raw SVG via `SVG.js` (~5KB) or `paths-js` from the resolved vertices/polylines.
(4) Inject a `<style>` block mapping CSS classes to edge types / node families (fonts, radii,
brand hex). Output = single `.html` with inline `<svg>`, **zero client-side JS to render**,
smallest payload, absolute determinism + best-in-class routing. Premier solution.

**Rank 2 — JointJS core (v4).** Dependency-free, native nested containers + absolute
positioning, built-in `manhattan` obstacle-avoiding router (one of few libs that handle ~190
dense orthogonal edges). Build graph headlessly in Node, export self-contained styled SVG via
`paper.toSVG({useComputedStyles:'full'})`. Best off-the-shelf if not writing a generator.

**Rank 3 — D2 + TALA engine.** Best declarative text option, but only with proprietary TALA
(lock coords via `top`/`left`, nested containers, clean ortho routing; standalone styled SVG).
Drawback: **commercial license required** for the TALA binary. (dagre/elk D2 backends do NOT
give the a-priori coordinate locking.)

**Rank 4 — maxGraph (modern mxGraph fork).** Define topology + exact coords in XML, ship a
lightweight (~130KB tree-shaken) client runtime; renders client-side. Far smaller than
React-based options.

Force-directed / auto-layout (Mermaid, React Flow default, Graphviz dot, Cytoscape non-preset)
rejected for this use: unpredictable node drift. Grid-only paths rejected: overlap noise.

## Implication for our use case
Matches our decided model exactly (author places families in ordered functional columns; parts
auto-stack; deterministic). Rank 1 = a generator that computes node geometry from a
column/family spec, registers boxes as libavoid obstacles, routes all 187 edges orthogonally,
emits editorial inline-SVG standalone HTML. Cost: introduces a Node + WASM (`elkjs-libavoid`)
toolchain alongside the repo's Python graphviz generator. Rank 2 (JointJS) is the off-the-shelf
fallback with the same routing quality.

## Key sources
- elkjs-libavoid (WASM libavoid router): https://github.com/MrMint/elkjs-libavoid
- libavoid-js: https://www.npmjs.com/package/libavoid-js · ELK+libavoid: https://eclipse.dev/elk/blog/posts/2022/22-11-17-libavoid.html
- JointJS routers: https://docs.jointjs.com/api/routers/ · standalone libavoid demo: https://www.jointjs.com/demos/libavoid-standalone-link-routing
- SVG.js: https://svgjs.dev/ · paths-js: https://www.npmjs.com/package/paths-js
- D2 TALA: https://d2lang.com/tour/tala/ · maxGraph: https://github.com/maxGraph/maxGraph/releases
- elkjs: https://github.com/kieler/elkjs · single-file HTML pattern: https://dev.to/nasrulhazim/stop-screenshotting-architecture-diagrams-build-them-as-single-file-html-50df
