---
{
  "format": 1,
  "metadata": {
    "id": "wireviz-cli-output-licensing-boundary",
    "title": "WireViz CLI outputs, Graphviz failures and license boundaries",
    "question": "Which WireViz outputs work without Graphviz, and how do failures/generated-HTML licensing affect distribution?",
    "scope": "Historical0.4.1 CLI/output/licensing study; no harness execution; source-check date is not assigned as original research date.",
    "summary": "Provides output/PATH failure matrix and distinguishes rendered artifacts from template-bearing HTML, retaining license uncertainty.",
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
      "Preserve limitations and uncertainty; no technical verification/current-applicability claim.",
      "Upstream repository plus local package/source paths; source license excerpt is not report-wide licensing grant.",
      "Absolute user/environment paths, dependency versions and internal verification-script context.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:33:39.482Z",
    "updated_at": "2026-11-01T23:33:39.482Z",
    "imported_at": "2026-11-01T20:39:01.878Z"
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
  "sourceDigest": "c170089640fd528b3a2117bd6306405951f22d4c6632dd625edf7607cd6d0717",
  "proposalRevision": "c831e521d0a01ba9da813552e2e2cc9788a4b3753433a2a262d0a5328cee4e77"
}
---
# WireViz 0.4.1 — CLI surface, output pipeline, Graphviz coupling, licensing

Research note — phase 1b. All facts verified 2026-08-14 against the live install in
`.venv/` (WireViz 0.4.1) and the v0.4.1 tag of the canonical repo
`https://github.com/wireviz/WireViz` (note: **not** `kvid/WireViz` — that repo has no
`v0.4.1` tag; `wireviz/WireViz` is the canonical home).

---

## 1. CLI surface

`/media/eldar/disk_2/Machine_concept/.venv/bin/wireviz --help` (verbatim, exit 0):

```
Usage: wireviz [OPTIONS] [FILE]...

  Parses the provided FILE and generates the specified outputs.

Options:
  -f, --format TEXT       Output formats (see below).  [default: hpst]
  -p, --prepend PATH      YAML file to prepend to the input file (optional).
  -o, --output-dir PATH   Directory to use for output files, if different from
                          input file directory.
  -O, --output-name TEXT  File name (without extension) to use for output
                          files, if different from input file name.
  -V, --version           Output WireViz version and exit.
  -h, --help              Show this message and exit.

  The -f or --format option accepts a string containing one or more of the
  following characters to specify which file types to output: g (GV), h
  (HTML), p (PNG), s (SVG), t (TSV)
```

| Flag | Meaning | Notes |
|---|---|---|
| `FILE` | one or more input `.yml` files | `nargs=-1`; each processed independently |
| `-f, --format` | output format string, default `hpst` | letters: `g`=gv, `h`=html, `p`=png, `s`=svg, `t`=tsv. Sorted+dedup'd. **Default does NOT include `.gv`.** Unknown letter → `Exception: Unknown output format: z` (exit 1) |
| `-p, --prepend` | YAML file(s) prepended to input (can repeat) | used for shared headers/global defaults; also adds its dir to image search path |
| `-o, --output-dir` | output directory; **default = input file's parent dir** (not cwd) | |
| `-O, --output-name` | output basename (no ext); default = input file stem | |
| `-V, --version` | print `WireViz 0.4.1`, exit 0 | no rendering |

**Version pin behavior:** `-V` prints `WireViz 0.4.1` (exact string `WireViz <semver>`) and
exits 0. The header line `WireViz 0.4.1` is also printed as the first line of every run's
stdout. There is no `--version=pin` mechanism; the executable itself is the pinned artifact
(`.venv/bin/wireviz`, an entry-point script — version fixed by the wheel installed).

**Exit codes (verified):**

| Scenario | Exit | stdout | stderr |
|---|---|---|---|
| valid render (dot on PATH) | 0 | `WireViz 0.4.1`, `Input file:`, `Output file:` | — |
| `dot` binary missing, graphical format requested | 1 | header + Input/Output lines | full Python+click traceback, final line `graphviz.backend.execute.ExecutableNotFound: failed to execute PosixPath('dot'), make sure the Graphviz executables are on your systems' PATH` |
| invalid YAML (syntax error) | 1 | header | PyYAML `expected ',' or ']'...` traceback |
| unknown template/designator in connections | 1 | header | `Exception: A is an unknown template/designator/arrow.` (from wireviz.py `parse`) |
| missing input file | 1 | header | `Exception: File does not exist:\n<path>` |
| no args | 2 | — | click Usage + help text to stderr |

All failures are tracebacks to stderr (click default; no clean error surface). `2` = click
usage error, `1` = runtime exception, `0` = success.

---

## 2. Output files (input `foo.yml`, default `-f hpst`)

| Artifact | Default? | Produced by | Needs `dot` binary? |
|---|---|---|---|
| `foo.html` | yes | `wv_html.py` — reads `foo.tmp.svg`, strips XML/DOCTYPE, embeds **inline** + renders BOM table | yes (needs SVG first) |
| `foo.svg` | yes | `graph.render()` via graphviz lib | yes |
| `foo.png` | yes | `graph.pipe(format="png")` (RGBA raster) | yes |
| `foo.bom.tsv` | yes | `wv_bom.py` pure Python | **no** |
| `foo.gv` | only with `-f g` | `graph.save()` pure Python | **no** |

Write location: **input file's parent directory** by default; `-o dir` overrides; `-O name`
overrides the basename. Confirmed: running on `src/minimal.yml` with no `-o` wrote all 4
default files into `src/`.

**HTML self-containment (verified):** self-contained. The SVG is embedded inline (`<svg>`
present in HTML source, XML+DOCTYPE decls stripped). BOM is a plain HTML table. No external
CSS/JS/images — the only `http` strings in the file are the `<meta name="generator">` URL
and the SVG `xmlns` namespace URI (metadata text, not fetched resources). The HTML file is
therefore viewable offline with zero external deps. Caveat: if the harness references image
files (part images via `image:`), those are embedded as base64 data-URIs by `svgembed.py` —
still self-contained, but increases file size.

---

## 3. Graphviz coupling — the PATH trap

**Mechanism:** WireViz does **not** shell out to `dot` itself. It uses the **graphviz Python
binding** (`graphviz 0.21`), which:
- builds the DOT source in memory (`graphviz.Graph()` in `Harness.py`), then
- shells out via `subprocess.run()` to the **`dot` binary** (`graphviz/backend/dot_command.py`
  sets `DOT_BINARY = pathlib.Path('dot')`, a **relative** path → resolved purely on `PATH`).

So **both** are required: the `graphviz` Python package (builds source + invokes) **and** the
`dot` executable discoverable on `PATH`. Missing `dot` → `subprocess.run` raises
`OSError(ENOENT)` → graphviz converts to `ExecutableNotFound`. No bundled graphviz, no
`GRAPHVIZ_DOT` env-var fallback in this path (verified in `execute.py` — it does not read a
`GRAPHVIZ_DOT` override; it just calls `['dot', ...]`).

System state on this machine:
- `dot` 12.2.1 exists **only** at `/home/eldar/miniforge3/envs/stepcad/bin/dot` — NOT on default PATH (`which dot` → exit 1).
- **Trap confirmed:** bare `wireviz` (any graphical format) fails; you MUST
  `PATH=/home/eldar/miniforge3/envs/stepcad/bin:$PATH` first.

### Failure matrix (verified, minimal 3-wire D-Sub harness)

| `-f` | formats | **NO-PATH** | **WITH stepcad PATH** |
|---|---|---|---|
| `t` | tsv | ✅ exit 0 → `foo.bom.tsv` | ✅ `foo.bom.tsv` |
| `g` | gv | ✅ exit 0 → `foo.gv` | ✅ `foo.gv` |
| `p` | png | ❌ exit 1 `ExecutableNotFound`, leftover file `foo` (no ext) | ✅ `foo.png` |
| `s` | svg | ❌ exit 1 `ExecutableNotFound`, leftover `foo.tmp` | ✅ `foo.svg` |
| `h` | html | ❌ exit 1 `ExecutableNotFound`, leftover `foo.tmp` | ✅ `foo.html` |
| `hpst` (default) | all | ❌ exit 1 `ExecutableNotFound`, leftover `foo.tmp` | ✅ `foo.html .png .svg .bom.tsv` |

Leftover `foo`/`foo.tmp` files on failure are graphviz render temp artifacts — the render
aborts mid-pipeline before the svg-rename/delete cleanup steps (`Harness.py:706-710`) run.
Non-graphical formats (`t`, `g`) are PATH-independent.

Note: only `t`+`g` are safe without `dot`. Everything graphical requires the stepcad PATH
prepend. `verify_wireviz.py` must prepend the stepcad bin dir when invoking the CLI, or it
silently degrades (its current non-fatal behavior would mask the failure).

---

## 4. Render formats

- **PNG:** via graphviz **cairo** renderer. `dot -Tpng` on this build resolves to
  `png:cairo:cairo` (available set: `png:cairo:cairo png:cairo:gdk png:cairo:gd png:gd:gd`);
  there is **no** gd-only build. Output verified: `PNG image data, 953 x 230, 8-bit/color RGBA`.
  The python `pillow` dependency is used by WireViz only for image dimension probing (auto
  `width`/`height` for embedded images), not for rasterizing.
- **SVG:** standard graphviz `dot -Tsvg` output (vector, `viewBox`, text as SVG `<text>`);
  WireViz post-processes it to embed part images as base64 data-URIs. XML+DOCTYPE decls
  stripped when re-embedded into HTML.
- **dot-version sensitivity:** no WireViz issue specifically pinning a dot version
  (searched `repo:wireviz/WireViz` issues for "graphviz version" / "dot version" — nothing
  conclusive). Rendered fine with dot 12.2.1. **UNVERIFIED** whether dot ≥ some version
  changes layout; assume current dot 12.2.1 is the pinned reference until a discrepancy is
  observed.

---

## 5. Licensing (GPL-3.0) — recommendation

WireViz 0.4.1 is **GPL-3.0** (`LICENSE` = standard GPLv3 text; `setup.py: license="GPLv3"`).
No separate license grant for generated output exists in LICENSE, README, or docs (the only
README license line is `[GPL-3.0](../LICENSE)`).

**GPLv3 §2 (Basic Permissions) governs output:**
> "The output from running a covered work is covered by this License only if the output,
> given its content, constitutes a covered work."

Analysis for our three artifacts:

1. **`.svg` / `.png` / `.bom.tsv` / `.gv`** — data-driven renderings of the user's YAML
   (our wiring data). They contain no copied WireViz source; they are analogous to a
   compiler's output (FSF FAQ: "output of a program is not necessarily a derivative work").
   These are **our documentation artifacts**, not derivative works of WireViz. Low risk.
2. **`.html`** — this one embeds WireViz's **template** (`templates/simple.html` + the
   `wv_html.py` assembly logic). A strict reading: the HTML output contains a copy of
   (instantiated) GPL template code. This is the classic "template/compiler scaffolding"
   grey zone. Practical mitigation: treat `.html` as **internal working documentation**;
   prefer `.svg`/`.png`/`.bom.tsv` for anything distributed externally (e.g., in the
   Fascicolo Tecnico). If external HTML distribution is ever required, review whether the
   generated page is "based on" the template (it is data scaffolding; most counsel would
   treat the user's content as dominant).
3. **`verify_wireviz.py` invoking the CLI** — this is **mere aggregation / at arm's length**.
   GPLv3 §5 explicitly says a compilation ("aggregate") of a GPL work with separate,
   independent works does not cause the GPL to apply to the other parts. The subprocess
   boundary means our Python pipeline and WireViz communicate only via process-level
   interfaces (exit code, files on disk); no source is copied or linked. **The GPL does not
   infect `stageC_wiring.py` / `verify_wireviz.py`.**

**Recommendation (binding for our usage):**
- **Keep CLI-only invocation** — never `import wireviz` in production code, never copy
  WireViz source or templates into the platform. (Our module already does this.)
- **Rendered diagrams are our data.** Treat `.svg`/`.png`/`.bom.tsv` as freely-usable
  internal artifacts. They are not GPL-derivative in the FSF's output rule.
- **Keep `.html` internal** or regenerate from our own template if external distribution
  becomes a hard requirement. Add a `template:` override in the yml pointing at a
  platform-owned template if we want to fully de-risk HTML (WireViz supports `template:`
  — path resolved relative to the yml dir or the built-in templates dir).
- **Document the GPL boundary** in the module CLAUDE.md: WireViz is a CLI tool, invoked as
  an external process, optional at build time, non-fatal when absent. Production artifacts
  are the `.yml` files we author.
- No GPL obligations are triggered by internal use or by conveying the machine's technical
  documentation that happens to contain WireViz-rendered diagrams.

---

## 6. Installation & dependencies

Installed in the shared venv via pip (WireViz 0.4.1 wheel). `pip show wireviz`:

```
Name: wireviz
Version: 0.4.1
Requires: click, graphviz, pillow, pyyaml
License: GPLv3
Location: /media/eldar/disk_2/Machine_concept/.venv/lib/python3.12/site-packages
```

Exact installed dependency versions:

| Package | Version |
|---|---|
| click | 8.4.2 |
| graphviz (python binding) | 0.21 |
| Pillow | 12.2.0 |
| PyYAML | 6.0.3 |

External non-pip dependency: **Graphviz `dot` binary 12.2.1** (only at
`/home/eldar/miniforge3/envs/stepcad/bin/dot` — PATH-only discovery, no fallback).

---

## 7. Import surface (for completeness — we stay CLI-only)

- `wireviz` package importable; `wireviz/__init__.py` exposes only `__version__ = "0.4.1"`,
  `CMD_NAME`, `APP_NAME`, `APP_URL` (deliberately no imports to keep setup.py safe).
- Public API: **`wireviz.wireviz.parse(inp, return_types=None, output_formats=None, output_dir=None, output_name=None, image_paths=[])`**.
  `inp` accepts a file Path, a YAML string, or a pre-parsed dict. `return_types` supports
  `"png"`, `"svg"`, `"harness"`. `output_formats` supports `csv`/`gv`/`html`/`png`/`pdf`/`svg`/`tsv`
  (csv+pdf printed as "not yet supported").
- No other stable public surface. Harness class is internal. We do not import it.

---

## UNVERIFIED items

- dot-version sensitivity (no conclusive upstream issue; assume dot 12.2.1 as reference).
- Whether `graphviz` 0.21 supports a `GRAPHVIZ_DOT` env override — the installed
  `dot_binary.py` mechanism uses `pathlib.Path('dot')`; the `GRAPHVIS_DOT`-style override
  was not present in the reachable code path (checked `execute.py`/`dot_command.py` only).
