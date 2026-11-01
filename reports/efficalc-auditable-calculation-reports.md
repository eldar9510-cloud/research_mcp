---
{
  "format": 1,
  "metadata": {
    "id": "efficalc-auditable-calculation-reports",
    "title": "efficalc 1.2.7 calculation reporting and limits",
    "question": "What calculation/report pattern and output paths does efficalc provide, and what unit and rendering limits matter?",
    "scope": "Historical Python3.12 package/source study; HTML/MathJax, overrides, result checks and PDF limits; not current execution.",
    "summary": "Explains Calculation/Input/ReportBuilder, display-only units, pass/fail checks and browser-print PDF boundary.",
    "researched_at": "2026-08-13",
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
      "Upstream URLs plus local package, proven-script and production-calculation paths; local dependencies uninspected.",
      "Absolute environment/tmp paths and internal production calculations.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:32:22.357Z",
    "updated_at": "2026-11-01T23:32:22.357Z",
    "imported_at": "2026-11-01T20:39:00.435Z"
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
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "5fc70889d61e36470a8283159f39a9bc301803b2f75f70861e55736b59725160",
  "proposalRevision": "06f7187849dd606f700bf6c92d44b454c0d5e2c8f7fc1b3deaa608b419a84e66"
}
---
# efficalc 1.2.7 — Phase 1 research note

Date: 2026-08-13. Scope: TOOLS/DOCS_VIZ/efficalc_handcalcs Phase 1 deep research.
Ground truth = installed package (`/media/eldar/disk_2/Machine_concept/.venv/lib/python3.12/site-packages/efficalc`, dist-info `efficalc-1.2.7`) + executed local runs. Web docs only cross-checked.

Sources:
- https://github.com/youandvern/efficalc (MIT, author Andrew Young "youandvern")
- https://youandvern.github.io/efficalc/ (docs; homepage tags 1.2.6)
- https://raw.githubusercontent.com/youandvern/efficalc/main/examples/

---

## 1. The Calculation/Input/ReportBuilder pattern

Minimal runnable example — VERBATIM from the repo README quickstart
(also reproduced in docs at `/get_started.html`).

`# source: https://github.com/youandvern/efficalc` (README "Minimal Example" / docs get_started.html)

```python
from efficalc import Calculation, Input, Title, sqrt

def calculation():
    Title("Pythagorean's Theorem and Perimeter")

    a = Input("a", 3, description="Length of side a")
    b = Input("b", 4, description="Length of side b")

    c = Calculation("c", sqrt(a**2 + b**2), description="Length of the hypotenuse")

    Calculation("P", a + b + c, description="Perimeter of the triangle")
```

View the report:

```python
from efficalc.report_builder import ReportBuilder
from pythagorean_perimeter import calculation

builder = ReportBuilder(calculation)
builder.view_report()
```

Updating input values (second constructor arg — dict keyed by input name):

```python
new_inputs = {"a": 9.2, "b": 0.87}
builder = ReportBuilder(calculation, new_inputs)
builder.view_report()
```

### Proven locally (2026-08-13, .venv python 3.12)

`proven/pythagorean_perimeter.py` (copied above) runs green. Evidence:

```
HTML len: 3599
saved: /tmp/efficalc_proof_out/calc_report.html
HTML len (overrides): 3625   # "a=9.2" present in output -> override works
```

Verified HTML contains the MathJax CDN script tag and override value `9.2`.

**Pattern summary.** A `calculation()` function instantiates `Title`/`Heading`/`Assumption`/`TextBlock`/
`Input`/`Calculation`/`Comparison`/`ComparisonStatement`/`Symbolic`/`Table` objects. Constructing an
object auto-registers it in a thread-local store (`save_calculation_item`). `ReportBuilder(calc_fn,
input_overrides)` runs the function via `CalculationRunner.calculate_all_items()`, collects all
registered items, and renders them to a self-contained HTML page (MathJax renders the LaTeX in the
browser). Chaining = referencing a prior `Calculation`/`Input` object inside a new `Calculation`'s
expression (they are `latexexpr_efficalc` `Variable`/`Expression` subclasses, so Python operators
build the symbolic expression tree).

---

## 2. Report output targets

`efficalc.report_builder.ReportBuilder` methods (verified from `report_builder.py` source):

| Method | Returns | What it does |
|---|---|---|
| `view_report()` | `str` (temp file path) | Writes HTML to a temp file, opens it in the default browser. Print-to-PDF from the browser is the documented PDF path. |
| `get_html_as_str()` | `str` | Complete HTML document as a string. **TeX-free programmatic path.** |
| `save_report(save_folder, filename="calc_report", open_on_save=False)` | `str` (full path) | Writes `<filename>.html` into `save_folder` (created if missing). |

**There is NO programmatic PDF export in efficalc.** `grep` over `generate_html.py` +
`report_builder.py` finds zero references to fpdf2 / weasyprint / reportlab / wkhtmltopdf /
chromium. The `@media print` CSS block in the generated HTML exists purely so the browser's
print dialog produces a clean page.

Rendering pipeline (from `generate_html.py` + `report_builder.py`):
- HTML page embeds MathJax 4.0.0-beta.7 from a CDN:
  `https://cdnjs.cloudflare.com/ajax/libs/mathjax/4.0.0-beta.7/tex-mml-chtml.min.js`
- LaTeX-ish strings (e.g. `\phi_b`, `M_u`) are rendered client-side by MathJax JS.
- `pylatexenc` is used ONLY for display-length estimation (long-calc scaling), never for rendering.

### TeX-free render paths (system reality)

- **WORKING, fully TeX-free:** HTML output (`get_html_as_str` / `save_report`). MathJax is JS in the
  browser — no pdflatex/xelatex/tectonic needed anywhere. This is the proven path for this sandbox.
- **PDF via browser:** `view_report()` → Ctrl+P → "Save as PDF". Works headless-equivalent only if a
  browser is present; requires the browser to fetch MathJax from CDN (needs internet).
- **PDF programmatic:** NOT provided by efficalc. Options for Phase 4 (none currently installed):
  - `weasyprint` (not in .venv) — but it does not execute JS, so MathJax math would show raw LaTeX. ✗
  - `wkhtmltopdf` (not installed) — executes JS, would render MathJax. Needs install.
  - Chromium headless `--print-to-pdf` (not verified present) — executes JS, best fidelity.
  - `fpdf2 2.8.7` IS in .venv but is NOT used by efficalc; it is a raw PDF library, would require
    hand-building a PDF report from calc values (`Calculation.result()`) — a separate pipeline.
- **CDN caveat (important for CE annex workflow):** MathJax loads from cdnjs at browser render time.
  Offline/air-gapped → math shows as raw LaTeX source. No internet → degrade.

---

## 3. API gotchas for 1.2.7

**Units — display-only, NO unit engine.** efficalc does not ship a units system (unlike handcalcs).
`unit` on `Input`/`Calculation` is a LaTeX-format display string (`"kip-ft"`, `"in^3"`). No
conversion/arithmetic/dimensional checking happens. The package ships convenience conversion
variables in `efficalc.unit_conversions`: `k_to_lb` (1000 lbs/kip), `ft_to_in` (12 in/ft),
`deg_to_rad` (π/180). Multiply by them to show the conversion step in the report. `efficalc.constants`:
`PI`, `E`, `ZERO`, `ONE`, `TWO` (all `Variable` instances from `latexexpr_efficalc`).

**Value formatting.** Default numeric format is `"%.4g"` (4 significant figures); integer values
auto-format as `"%.0f"` (`Variable.set_format()` in `latexexpr_efficalc` 0.5.3). Override per
variable: `Input("x", 1.23456, format="%.4f")`. Use `obj.result()` / `obj.get_value()` to read the
raw float for downstream math (formatting only affects report display).

**Chaining.** Calculation objects are expressions. Reference a previous `Input` or `Calculation`
object directly in a new `Calculation`: `Calculation("P", a + b + c, ...)`. The symbolic tree is
built by operator overloads from `latexexpr_efficalc`. Import the math helpers from `efficalc`:
`sqrt, sqr, root, power, exp, ln, log, log10, sin, cos, tan, asin... minimum, maximum, absolute,
brackets, div, mul, sub, add, plus, minus, times, neg, pos` (re-exported from
`latexexpr_efficalc` in `efficalc/__init__.py`).

**Input overrides / default values.** Overrides passed as `ReportBuilder(calc, {"a": 9.2})` →
`set_input_default_overrides()` into a **thread-local** store. `CalculationRunner.calculate_all_items()`
clears saved objects + overrides before and after each run — so a `calculation()` function is
stateless re-entrant, and the same function can be re-run with different inputs. `Input.get_value()`
returns the override when set, else the default. There is **no config file / defaults-file feature** —
"defaults" are the `default_value` positional args of each `Input`, overridden by the dict.

**Results retrieval.** `CalculationRunner.calculate_results(return_type="list"|"dict")` returns only
items with `result_check=True`. Flag a headline result via `Calculation(..., result_check=True)`.
`Comparison(..., result_check=True)` returns pass/fail for use as a test assertion.

**Demand vs capacity pattern** (core to a screw buckling check): `Comparison(demand, "<=", capacity,
true_message="OK", false_message="ERROR")` renders a pass/fail line in the report; `ComparisonStatement`
renders an inline inequality (e.g. `KL/r <= λ_crit`) without pass/fail semantics. Branching logic uses
plain Python `if` on `.result()`/`.get_value()`.

**Python 3.12 SyntaxWarning gotcha — use raw strings.** The repo's own examples write LaTeX names as
non-raw strings (`"\lambda_{r}"`, `"\mathrm{b/t}"`), which emit
`SyntaxWarning: invalid escape sequence` on Python 3.12 (harmless, but noisy; seen on every import of
`rectangular_hss_compression_design.py`). Always write `r"\lambda_{r}"` in new code.

**HTML escaping.** 1.1.0 added escaping of user input values in report HTML (security fix) — don't
pass raw HTML into `Input` descriptions expecting it to render.

**Breaking changes within 1.x (from GitHub releases):** API is stable/additive across 1.x —
v1.0.0 first code-complete release; v1.1.0 added figures (`FigureFromFile/FromBytes/FromMatplotlib`,
`FigureBase`), thread safety, HTML input escaping; v1.2.0 added the `Symbolic` class (render an
equation/string without evaluating a result). No breaking changes to the core
`Calculation`/`Input`/`ReportBuilder` surface between 1.0 and 1.2.7. Installed 1.2.7 vs docs
homepage 1.2.6 = trivial patch delta.

**No TeX requirement anywhere.** LaTeX strings are just display markup for MathJax; nothing invokes a
TeX engine. (Contrast: handcalcs' LaTeX export genuinely needs TeX — see the handcalcs note.)

---

## 4. Examples inventory (repo `examples/`, main branch)

| File | Subject | Relevance |
|---|---|---|
| `concrete_beam_neutral_axis.py` | RC beam neutral-axis | medium |
| `point_load_beam_moment_and_deflection.py` | beam M/δ plots + figures | medium (shows figures) |
| `rectangular_hss_compression_design.py` | HSS compression design, demand vs capacity, elastic/inelastic buckling | **BEST** |
| `steel_beam_moment_strength.py` | WF beam flexure (LTB, compaction, AISC section DB) | high |
| `steel_beam_optimizer.py` | optimizer loop over sections | medium |
| `conc_col_pmm/` | subdir, additional examples | unexamined |

Each `.py` has a matching `.pdf` (those PDFs were produced outside efficalc — likely browser print —
since the package has no PDF export).

**Best single official example to port into `proven/` (Phase 2): `rectangular_hss_compression_design.py`.**
It is the closest official match to a screw `n_cr` / buckling `L_max` check: compressive demand vs
capacity (`P_u <= φ P_n`), member slenderness `KL/r`, elastic vs inelastic buckling branching,
slenderness-limit comparisons, `result_check=True` D/C, and it pulls real section properties from
`efficalc.sections.get_aisc_rectangular`. It exercises the full
Calculation → Comparison → ReportBuilder end-to-end.

**Proven locally:** downloaded to `proven/rectangular_hss_compression_design.py` and run with
`ReportBuilder` → 21,326-byte HTML at `/tmp/efficalc_hss_out/hss_compression.html`; contains
`HSS6X2X1/8`, `KL/r`, `φ P_n`, `OK`. `proven/steel_beam_moment_strength.py`,
`proven/concrete_beam_neutral_axis.py`, `proven/point_load_beam_moment_and_deflection.py` also
downloaded for Phase 2. (All four emit Python 3.12 SyntaxWarnings — see gotcha above.)

---

## 5. PDF specifics

- **efficalc has NO built-in PDF export.** There is no `report_to_pdf` / `to_pdf` / fpdf2 path in
  `report_builder.py` or `generate_html.py`. The only "PDF" story is: generate HTML, open in a
  browser, print to PDF from the print dialog (the HTML ships a `@media print` stylesheet for exactly
  this).
- **It does NOT need LaTeX.** Rendering is MathJax (client-side JS). No pdflatex/xelatex/tectonic
  involved at any point. The system's missing-TeX limitation does not affect efficalc at all.
- Programmatic HTML→PDF on this system would need an external tool (weasyprint/wkhtmltopdf/chromium
  headless — none installed) and, for JS-rendered MathJax, a JS-capable engine (weasyprint ✗,
  wkhtmltopdf ✓, chromium ✓).
- The `*.pdf` files in the repo's `examples/` are outputs of that browser-print workflow, not an API.

---

## Phase-2 recommended start

Port `proven/rectangular_hss_compression_design.py` (verbatim, `# source:` header) → run via
`ReportBuilder.save_report` → confirm HTML + values. Then map it onto the screw calc
(`selection/screw-nut-brake/feasibility_study.py`: `n_cr`, buckling `L_max`, `INA 49e6`, `f1=5.6`),
reusing the `Comparison(Pu, "<=", phi*Pn)` D/C pattern. Units stay display-only — value fidelity
against the production module is the testable contract (see HANDOFF guardrails).
