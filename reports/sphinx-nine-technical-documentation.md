---
{
  "format": 1,
  "metadata": {
    "id": "sphinx-nine-technical-documentation",
    "title": "Sphinx9.1 technical-documentation capabilities and migration",
    "question": "Which Sphinx9.1 builders, directives and extensions fit technical documentation, and which older tutorial assumptions no longer apply?",
    "scope": "Documentation/source research for Sphinx9.1/Python3.12/sphinx-click6.2; explicitly not execution-proven.",
    "summary": "Surveys document generation and version changes, flags stale tutorial output and proposes official example ports.",
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
      "Per-section official URLs; copied quickstart-template and tutorial examples require attribution/rights review.",
      "Environment and internal TECH_DOC/PLC context; tutorial author example is not report authorship.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:32:39.595Z",
    "updated_at": "2026-11-01T23:32:39.595Z",
    "imported_at": "2026-11-01T20:39:00.622Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "cb8fc05c180e413dec0ff1c6ef916e5082b440fa6139ecef7a054627a62448e9",
  "proposalRevision": "1c7fdc815db8477e832a8cbb4c3ad80c41e8f43ce7e2d81c37aa4d57a67d87ce"
}
---
# Sphinx 9.1.0 — Official Documentation Research Note

Phase 1 deliverable for `TOOLS/DOCS_VIZ/sphinx_docs`. Read-only web research; **nothing here is
execution-proven yet**. Every claim carries its source URL. Version pin: Sphinx **9.1.0**
in shared `.venv`, docutils **0.22.4**, sphinx-click **6.2.0**, Python **3.12**.
Sphinx 9.1.0 requires **Python ≥ 3.12** and **docutils ≥ 0.21** (see §5) — both satisfied.

---

## 1. Tutorial / first steps

### Install + verify
# source: https://www.sphinx-doc.org/en/master/tutorial/getting-started.html
```bash
$ python -m venv .venv
$ source .venv/bin/activate
(.venv) $ python -m pip install sphinx
```
# source: https://www.sphinx-doc.org/en/master/tutorial/getting-started.html
```bash
(.venv) $ sphinx-build --version
sphinx-build 4.0.2
```
⚠️ TRAP: that `4.0.2` is the tutorial page's own (stale) output — our box prints `sphinx-build 9.1.0`. Do not treat the page's version string as ground truth.

### sphinx-quickstart flow
# source: https://www.sphinx-doc.org/en/master/tutorial/getting-started.html
```bash
(.venv) $ sphinx-quickstart docs
```
Then answer the prompts (as documented in the tutorial):
```
> Separate source and build directories (y/n) [n]:        → y
> Project name:                                            → Lumache
> Author name(s):                                          → Graziella
> Project release []:                                      → 0.1
> Project language [en]:                                   → (leave empty → en)
```
Source: https://www.sphinx-doc.org/en/master/tutorial/getting-started.html

Generated layout:
```
docs
├── build          # empty dir; will hold rendered output
├── make.bat
├── Makefile
└── source
   ├── conf.py
   ├── index.rst
   ├── _static
   └── _templates
```
Source: https://www.sphinx-doc.org/en/master/tutorial/getting-started.html

### Build HTML
# source: https://www.sphinx-doc.org/en/master/tutorial/getting-started.html
```bash
(.venv) $ sphinx-build -M html docs/source/ docs/build/
```
then open `docs/build/html/index.html`.
`-M` (make mode) is the documented form — for latexpdf specifically use `-M latexpdf`, **not** `-b latexpdf`. Source: https://www.sphinx-doc.org/en/master/usage/builders/index.html

### Exact generated conf.py (verbatim from the quickstart template)
The template is `sphinx/templates/quickstart/conf.py.jinja` in the Sphinx repo (fetched via GitHub API, Sphinx `master`):
# source: https://raw.githubusercontent.com/sphinx-doc/sphinx/master/sphinx/templates/quickstart/conf.py.jinja (via GitHub API)
```python
# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------
# (only when quickstart detected the project needs sys.path, e.g. autodoc)

import os
import sys
sys.path.insert(0, '/path/to/src')

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Lumache'
copyright = '2026, Graziella'
author = 'Graziella'

version = '0.1'
release = '0.1'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = []

templates_path = ['_templates']
exclude_patterns = []

# source_suffix = '.rst'            # only emitted if quickstart suffix != '.rst'
# root_doc = 'index'                # only emitted if root_doc != 'index'
language = 'en'                     # only emitted if language chosen

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'alabaster'
html_static_path = ['_static']
```
The intersphinx block is emitted **only if** `sphinx.ext.intersphinx` was enabled at quickstart time:
# source: https://raw.githubusercontent.com/sphinx-doc/sphinx/master/sphinx/templates/quickstart/conf.py.jinja (via GitHub API)
```python
# -- Options for intersphinx extension ---------------------------------------
# https://www.sphinx-doc.org/en/master/usage/extensions/intersphinx.html#configuration

intersphinx_mapping = {
    'python': ('https://docs.python.org/3', None),
}
```
and the todo block **only if** `sphinx.ext.todo` was enabled:
# source: https://raw.githubusercontent.com/sphinx-doc/sphinx/master/sphinx/templates/quickstart/conf.py.jinja (via GitHub API)
```python
# -- Options for todo extension ----------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/extensions/todo.html#configuration

todo_include_todos = True
```

### Exact generated index.rst (verbatim from the root_doc template)
Template `sphinx/templates/quickstart/root_doc.rst.jinja`:
# source: https://raw.githubusercontent.com/sphinx-doc/sphinx/master/sphinx/templates/quickstart/root_doc.rst.jinja (via GitHub API)
```rst
.. Lumache documentation master file, created by
   sphinx-quickstart on 2026-08-14.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Lumache documentation
=====================

Add your content using ``reStructuredText`` syntax. See the
`reStructuredText <https://www.sphinx-doc.org/en/master/usage/restructuredtext/index.html>`_
documentation for details.


.. toctree::
   :maxdepth: 2
   :caption: Contents:

```
The tutorial then replaces the welcome text with real content:
# source: https://www.sphinx-doc.org/en/master/tutorial/first-steps.html
```rst
Welcome to Lumache's documentation!
===================================

**Lumache** (/lu'make/) is a Python library for cooks and food lovers that
creates recipes mixing random ingredients.  It pulls data from the `Open Food
Facts database <https://world.openfoodfacts.org/>`_ and offers a *simple* and
*intuitive* API.

.. note::

   This project is under active development.
```
and adds the `toctree`:
# source: https://www.sphinx-doc.org/en/master/tutorial/first-steps.html
```rst
.. toctree::

   usage
```
EPUB tweak shown in the tutorial's conf.py:
# source: https://www.sphinx-doc.org/en/master/tutorial/first-steps.html
```python
# EPUB options
epub_show_urls = 'footnote'
```
(`make epub` → `docs/build/epub/`).

---

## 2. Key directives/roles for doc generation (not code API docs)

### toctree — **core Sphinx**
# source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html
```rst
.. toctree::
   :maxdepth: 2
   :numbered:
   :caption: Table of Contents
   :titlesonly:

   intro
   strings
```
Options (all core): `:maxdepth:` (default = all levels), `:numbered:` (accepts a numeric depth), `:caption:`, `:titlesonly:`, `:glob:`, `:reversed:`, `:hidden:`, `:includehidden:`, `:class:` (7.4+), `:name:` (implicit target for `:ref:`).
Source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html
⚠️ TRAP (LaTeX only): "The LaTeX writer only refers [to] the maxdepth option of [the] first toctree directive in the document." — HTML honours per-toctree maxdepth, LaTeX does not.

### Section numbering — **core, via `numfig` conf**
- `numfig = True` enables auto-numbering of figures, tables, code-blocks, sections.
- `numfig_format` defaults (see §7).
- `:numref:` links to the numbered object.
Source: https://www.sphinx-doc.org/en/master/usage/configuration.html
⚠️ If `numfig` is `False`, `:numref:` does **not** emit a number — it inserts the label/link text. Source: https://www.sphinx-doc.org/en/master/usage/referencing.html

### glossary — **core Sphinx**
# source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html
```rst
.. glossary::

   environment
      A structure where information about all documents...
```
Option: `:sorted:`. Entries referenced with `:term:`environment`` (core role). Glossary does not need to be in the same file as the `:term:`. Source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html

### figure / image — **Docutils core** (work in Sphinx, no extension)
```rst
.. figure:: whatever
   Figure caption
```
`figure` adds a caption + optional `:figwidth:`, `:figclass:`, `:align:` (Docutils common options). `image` is the uncaptioned primitive. For `:ref:`/`:numref:` to a figure, put an explicit label immediately before it:
# source: https://www.sphinx-doc.org/en/master/usage/referencing.html
```rst
.. _my-figure:

.. figure:: whatever
   Figure caption
```
then `:ref:`my-figure`` inserts link text = the caption; `:numref:`Fig. %s <my-figure>`` inserts the number. Sources: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html (points to Docutils for figure/image), https://www.sphinx-doc.org/en/master/usage/referencing.html

### Admonitions — **core (Docutils) + one Sphinx add-on**
All ten named admonitions are core: `attention`, `caution`, `danger`, `error`, `hint`, `important`, `note`, `tip`, `warning`, plus generic `.. admonition:: Title`.
# source: https://www.sphinx-doc.org/en/master/tutorial/first-steps.html
```rst
.. note::

   This project is under active development.
```
**Sphinx 8.2+ add-on:** every admonition accepts `:collapsible:` with arg `open` or `closed`.
Source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html
⚠️ TRAP for 7.x readers: `:collapsible:` did not exist before 8.2 — older tutorials won't mention it.

### Tables — **Docutils core** (three syntaxes + csv)
Grid table:
# source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html
```
+------------------------+------------+----------+----------+
| Header row, column 1   | Header 2   | Header 3 | Header 4 |
| (header rows optional) |            |          |          |
+========================+============+==========+==========+
| body row 1, column 1   | column 2   | column 3 | column 4 |
+------------------------+------------+----------+----------+
| body row 2             | ...        | ...      |          |
+------------------------+------------+----------+----------+
```
Simple table:
# source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html
```
=====  =====  =======
A      B      A and B
=====  =====  =======
False  False  False
True   False  False
False  True   False
True   True   True
=====  =====  =======
```
`.. list-table::` (a table generated from a list of lists) and `.. csv-table::` (from comma-separated values) are named in the Sphinx directives page and fully documented in the Docutils reference. Common options: `:widths:`, `:header-rows:`, `:stub-columns:`, `:class:`.
Sources: https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html (grid + simple verbatim), https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html (list-table/csv-table named)
⚠️ grid/simple tables are brittle to edit by hand; list-table is the maintainable choice.

### Cross-references — **core roles** (`std` domain)
Label definition (must start with underscore; drop the underscore when referencing):
# source: https://www.sphinx-doc.org/en/master/usage/referencing.html
```rst
.. _my-reference-label:

Section to cross-reference
--------------------------
```
- `:ref:`my-reference-label`` → link titled "Section to cross-reference".
- `:ref:`Link title <label-name>`` → explicit title.
- `:doc:`usage`` → link to another document; names are **case-sensitive** even on Windows; `:doc:`/people`` absolute, `:doc:`../people`` relative; `:doc:`Monty Python members </people>`` explicit title.
- `:any:` → tries doc/ref/option roles then all domains, then intersphinx; good `default_role` candidate; warns if zero or multiple targets.
- `:term:` → glossary term.
- `:option:`, `:envvar:`, `:token:`, `:keyword:`, `:confval:` → domain-role links.
- `:numref:` → figure/table/code-block/section number; placeholders `%s`/`{number}` (number) and `{name}` (caption):
# source: https://www.sphinx-doc.org/en/master/usage/referencing.html
```rst
:numref:`Image of Sphinx (Fig. %s) <my-figure>`
```
- Suppress a link in nitpicky mode: prefix `!`, e.g. `:py:func:`!target``.
Sources: https://www.sphinx-doc.org/en/master/usage/referencing.html, https://www.sphinx-doc.org/en/master/usage/restructuredtext/roles.html (roles list + "See Cross-references")
`numfig` must be `True` for `:numref:` to show numbers. Source: https://www.sphinx-doc.org/en/master/usage/referencing.html

### code-block — **core Sphinx** (uses Pygments)
# source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html
```rst
.. code-block:: ruby
   :linenos:
   :emphasize-lines: 3,5
   :name: this-py
```
Options: `:linenos:`, `:lineno-start:` (auto-activates linenos), `:emphasize-lines:`, `:force:`, `:caption:`, `:name:`, `:class:`, `:dedent:`. Aliases `.. sourcecode::` and `.. code::`.
⚠️ To `:ref:`/`:numref:` a code-block, **both** `:name:` and `:caption:` must be present.
Source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html

### Substitution definitions — **Docutils core**
# source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html
```rst
.. |name| replace:: replacement *text*
```
```rst
.. |caution| image:: warning.png
             :alt: Warning!
```
Then use `|name|` inline. Source: https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html

**Summary — core vs extension:** all directives/roles above are core Sphinx or core Docutils; **none require a `sphinx.ext.*` extension**. Extensions only add code-API constructs (autodoc/autosummary/automodule) or cross-project refs (intersphinx) — see §4.

---

## 3. Builders

Reference: https://www.sphinx-doc.org/en/master/usage/builders/index.html

| Builder | Output | External deps | Works out of box |
|---|---|---|---|
| `html` (StandaloneHTMLBuilder) | "a directory with HTML files, complete with style sheets and optionally the reStructuredText sources" | none | ✅ |
| `latex` | LaTeX `.tex` files in output dir; PDF is a **second** step | LaTeX toolchain | 🟡 `.tex` yes, PDF no |
| `latexpdf` (`-M latexpdf`, not `-b`) | `.tex` **and** runs PDF inside output dir | LaTeX toolchain | 🟡 needs LaTeX |
| `epub` | same as HTML + an **EPUB 3** `.epub` | none | ✅ |
| `text` | one `.txt` per source, markup stripped | none | ✅ |
| `man` | groff man pages | none (set `man_pages`) | ✅ |
| `texinfo` | `.texinfo` (Info conversion needs `makeinfo`) | none for .texinfo | ✅ |
| `applehelp` | Apple help book | `hiutil` (macOS only) | ❌ |
| `htmlhelp` | HTML Help (CHM compile needs MS HTML Help Workshop) | Windows tool | ❌ |

Key verbatim:
- html: "This is the standard HTML builder. Its output is a directory with HTML files, complete with style sheets and optionally the reStructuredText sources." — https://www.sphinx-doc.org/en/master/usage/builders/index.html
- latex: "This builder produces LaTeX source files in the output directory." PDF "happen[s] inside this output directory and need[s] to be triggered in a second step." "To combine the two steps into only one, use sphinx-build -M (i.e. `-M latexpdf` not `-b latexpdf`) or `make latexpdf`."
- epub: "This builder produces the same output as the standalone HTML builder, but also generates an epub file for ebook readers" — creates **EPUB 3** files.
- text: "This builder produces a text file for each reStructuredText file... much of the markup stripped for better readability."
- man: "This builder produces manual pages in the groff format" — configure `man_pages`.

### LaTeX prerequisites on Linux (Ubuntu/Debian)
"`texlive-latex-recommended`, `texlive-fonts-recommended`, `texlive-fonts-extra` (needed for `fontawesome5`...), `tex-gyre` (if `latex_engine` left to default), `texlive-latex-extra`, `latexmk`"
Plus, conditionally: `texlive-lang-cyrillic` (Cyrillic), `texlive-lang-greek` (Greek), `texlive-xetex` (if `latex_engine='xelatex'`), `texlive-luatex` (if `'lualatex'`), `fonts-freefont-otf` (xelatex/lualatex).
Source: https://www.sphinx-doc.org/en/master/usage/builders/index.html

### What `_build` contains
Docs confirm (serialization-builder section): source `.rst` files are copied to `_sources/`; a search index file (`searchindex.*`) and an `environment.pickle` (build env, always pickle) sit in the output root; the global context file holds `project`, `copyright`, `release`, `version`, `style`, `last_updated`, `builder`, `titles`.
Source: https://www.sphinx-doc.org/en/master/usage/builders/index.html
Expected-but-verify-in-Phase-2 HTML artifacts (standard, not enumerated on that page): `index.html`, `genindex.html`, `py-modindex.html` (only when Python domain/autodoc used), `search.html`, `searchindex.js`, `_static/`, `_sources/`, `_modules/` (only when viewcode enabled).

---

## 4. Extensions bundled with Sphinx 9.x

Full built-in list from the extensions index — **all are `sphinx.ext.*`, shipped with Sphinx, no extra install**:
`apidoc`, `autodoc`, `autosectionlabel`, `autosummary`, `coverage`, `doctest`, `duration`, `extlinks`, `githubpages`, `graphviz`, `ifconfig`, `imgconverter`, `inheritance_diagram`, `intersphinx`, `linkcode`, `math` (HTML math support), `napoleon`, `todo`, `viewcode`.
Source: https://www.sphinx-doc.org/en/master/usage/extensions/index.html

Notable external-package needs among the built-ins:
- `graphviz`, `inheritance_diagram` → system Graphviz (`dot`)
- `imgconverter` → ImageMagick
- `math` (mathjax/imgmath) → mathjax is a JS lib fetched at page-load (no local dep); **imgmath** renders math to images at build time (needs LaTeX/dvipng). Default math output switched to **MathJax v4** in 9.0 (see §5).
- `linkcode` → requires you to configure the code-host URL scheme (in `html_context`); `viewcode` works with no config beyond enabling it.
Source: https://www.sphinx-doc.org/en/master/usage/extensions/index.html, https://www.sphinx-doc.org/en/master/changes/9.0.html

### autodoc (key facts for code docs)
- Requires the module to be **importable** at build time (patch `sys.path` in conf.py or install the package). "autodoc **imports** the modules to be documented" — side effects on import will run at `sphinx-build`.
- Directives: `.. automodule::`, `.. autoclass::`, `.. autofunction::`, `.. autoattribute::`.
- Common options: `:members:` (optionally comma-separated list), `:undoc-members:`, `:show-inheritance:`, `:no-index:` (hyphenated form), `:member-order:` (`alphabetical` default / `bysource` / `groupwise`), `:exclude-members:`, `:private-members:`, `:special-members:`, `:imported-members:`, `:inherited-members:`.
- `autodoc_default_options`, `autodoc_mock_imports = ['django']` (mock missing deps), `autodoc_member_order`, `autodoc_typehints`, `autoclass_content`, `:class-doc-from:`.
Source: https://www.sphinx-doc.org/en/master/usage/extensions/autodoc.html

### autosummary
# source: https://www.sphinx-doc.org/en/master/usage/extensions/autosummary.html
```rst
.. autosummary::
   :toctree: DIRNAME

   sphinx.environment.BuildEnvironment
   sphinx.util.relative_uri
```
- `autosummary_generate` default `True` (scan docs, generate stub pages); `autosummary_generate_overwrite` default `True`.
- Stub pages "by default contain only the corresponding sphinx.ext.autodoc directive"; uses Jinja templates `autosummary/base.rst`, `module.rst`, `class.rst`, `function.rst`, `attribute.rst`, `method.rst`; filter `{{ fullname | escape | underline }}`.
- Typically enable `sphinx.ext.autodoc` alongside.
Source: https://www.sphinx-doc.org/en/master/usage/extensions/autosummary.html

### intersphinx (cross-project references)
Enable in conf.py:
# source: https://www.sphinx-doc.org/en/master/usage/extensions/intersphinx.html
```python
extensions = ['sphinx.ext.intersphinx']
intersphinx_mapping = {'python': ('https://docs.python.org/3', None)}
```
- "whenever Sphinx encounters a cross-reference that has no matching target in the current documentation set, it looks for targets in the external documentation sets configured in `intersphinx_mapping`."
- "Each Sphinx HTML build creates a file named `objects.inv`" — the inventory; inspect with `python -m sphinx.ext.intersphinx https://docs.python.org/3/objects.inv`.
- Separate/alternate inventory file forms: `('url', 'python-inv.txt')`, `('url', (None, 'python-inv.txt'))`, local-first `('https://...', ('../../otherbook/build/html/objects.inv', None))`.
- Explicit external refs: `:external:py:class:`zipfile.ZipFile`` or project-scoped `:external+python:py:class:`...``.
- `intersphinx_disabled_reftypes` default `['std:doc']` (skip std:doc resolution via intersphinx); `intersphinx_cache_limit = 5` (days, remote inventory cache); `intersphinx_timeout` (None = no timeout); `intersphinx_resolve_self`.
- Remote inventory "must be re-downloaded whenever you do a full rebuild."
Source: https://www.sphinx-doc.org/en/master/usage/extensions/intersphinx.html

---

## 5. Version 9.x specifics / changelog highlights

### 7.x → 8.0 (the big transition)
Source: https://www.sphinx-doc.org/en/master/changes/8.0.html
- **Python ≥ 3.10 required** (#12633, dropped 3.9).
- `sphinx-quickstart`: **removed** old-style Makefile output and the `--no-use-make-mode`, `-M`, `--use-make-mode`, `-m` options (#11693). `--use-make-mode` now has no effect (default is make-mode).
- `show_warning_types` default flipped `False → True` (#12597) — warnings now carry their type tag.
- `linkcheck_allow_unauthorized` and `linkcheck_report_timeouts_as_broken` now default `False` (#12630).
- Invalid `html_sidebars` values now **raise an error** instead of being ignored (#12593).
- Removed support for the 2008–2010 Sphinx 0.5/0.6 `intersphinx_mapping` format (#12083).
- Many `sphinx.util.*` helpers removed/moved (only matters for custom extensions).
- Deprecated string-methods-on-Path usage, removal extended to Sphinx 9.

### 8.x → 9.0
Source: https://www.sphinx-doc.org/en/master/changes/9.0.html
- **Docutils 0.22 support** (#13786).
- **autodoc substantially rewritten**; opt back to the old implementation with `autodoc_use_legacy_class_based = True`. 9.0.1–9.0.4 restored removed autodoc internals (`sphinx.ext.autodoc.mock` etc.) — our 9.1.0 has all those fixes.
- **MathJax v4 is now the default** (previously v3). Keep v3 via `mathjax_path`; existing `mathjax3_config` "should not need to change" (v4 is mostly compatible). New `mathjax4_config`, `mathjax_config_path`.
- **Non-decodable source bytes now raise an error** (previously a warning + `?` replacement).
- Deprecated non-UTF-8 source encodings — "scheduled for removal in Sphinx 10"; conf page notes **Sphinx 11 will only support UTF-8 files**. `source_encoding` default is `utf-8-sig`.
- Deprecated remaining public `.app` attributes (`builder.app`, `env.app`, `events.app`, `SphinxTransform.app`) and the `sphinx.io` module.
- New conf: `doctest_fail_fast`, `linkcheck_allowed_redirects`, `linkcheck_case_insensitive_urls`.
- intersphinx gained a file-based cache for remote inventories.

### 9.0 → 9.1.0
Source: https://raw.githubusercontent.com/sphinx-doc/sphinx/master/CHANGES.rst (Release 9.1.0 section)
- **Drops Python 3.11** → requires **Python ≥ 3.12** (#14153).
- **Drops Docutils 0.20** → requires **docutils ≥ 0.21** (#12555). (Our 0.22.4 ✓)
- `sphinx.application.Sphinx.add_static_dir` added (extension authors).
- MyST-Parser compatibility restored (#13713).
- LaTeX/PDF fixes: acronym role rendering, merged-vertical-cell rendering, overrun footer, crash for code-blocks >~1350 lines, tab stops in `sphinxVerbatim`.
- No conf.py-level changes/removals in 9.1.0 itself.

### root_doc / master_doc
- `root_doc` alias "Added in version 4.0"; default `'index'` (changed from `'contents'` in 2.0). `master_doc` and `root_doc` are documented together as the same setting; `master_doc` is the deprecated legacy name (renamed to `root_doc` in 7.2, issue #8326) but still accepted in 9.1.
Sources: https://www.sphinx-doc.org/en/master/usage/configuration.html, https://github.com/AA-Turner/sphinx/blob/2e916825e443d9cfcc57430bdf45ab861216bf9c/CHANGES#5

---

## 6. sphinx-click 6.2.0

Source: https://sphinx-click.readthedocs.io/en/latest/usage/ (plus index page https://sphinx-click.readthedocs.io/en/latest/)
- Purpose: "automatically extract documentation from a click-based application and include it in your docs." Third-party extension (not `sphinx.ext.*`). "assumes you are using click to create your command line application."
- Enable:
# source: https://sphinx-click.readthedocs.io/en/latest/usage/
```python
extensions = ['sphinx_click']
```
- Directive:
# source: https://sphinx-click.readthedocs.io/en/latest/usage/
```
.. click:: module:parser
   :prog: hello-world
   :nested: full
```
- Options: `:prog:` (**required** — tool name as shown in docs); `:nested:` (`full` / `short` / `none`, default `short`); `:commands:` (document only listed commands); `:show-nested:` (**deprecated**, use `:nested:`).
- Examples:
# source: https://sphinx-click.readthedocs.io/en/latest/usage/
```
.. click:: hello_world:greet
  :prog: hello-world
  :nested: full
```
```
.. click:: hello_world:greet
  :prog: hello-world
  :commands: hello
```
- What it generates: a usage block (invocation line), then the command's docstring, options list, arguments, env vars — extracted from the Click object at build time (the module is imported, so `sys.path` may need patching):
# source: https://sphinx-click.readthedocs.io/en/latest/usage/
```python
import os
import sys
sys.path.insert(0, os.path.abspath('..'))
```
- Cross-referencing: `:option:` for flags; env var labels generated in the form `{command_name}-{param_name}-{envvar}` (use `:ref:`); **cannot** use `:envvar:` role because "the default labels generated by Sphinx are not namespaced" (issue #26); "Sphinx currently does not allow you to cross-reference programs" (Sphinx issue #880).
- Mocking: `sphinx_click_mock_imports` config (falls back to `autodoc_mock_imports`).
- Events (handlers receive `(app, ctx, lines)`, mutate `lines` in place): `sphinx-click-process-description/-usage/-options/-arguments/-envvars/-epilog`.
- `CommandCollection` renders "with multiple sections, one for each group listed in the command sources."

---

## 7. Configuration essentials

Reference: https://www.sphinx-doc.org/en/master/usage/configuration.html

Defaults that matter for a fresh 9.1.0 project:
| Conf value | Default |
|---|---|
| `project` | `'Project name not set'` |
| `author` | `'Author name not set'` |
| `copyright` | `''` |
| `release` / `version` | `''` |
| `extensions` | `[]` |
| `html_theme` | `'alabaster'` |
| `html_static_path` | `[]` (quickstart writes `['_static']`) |
| `language` | `'en'` (changed in 5.0, was `None`) |
| `numfig` | `False` |
| `root_doc` / `master_doc` | `'index'` |
| `source_suffix` | `{'.rst': 'restructuredtext'}` |
| `exclude_patterns` | `()` |
| `default_role` | `None` |

`numfig_format` default:
# source: https://www.sphinx-doc.org/en/master/usage/configuration.html
```python
numfig_format = {
    'code-block': 'Listing %s',
    'figure': 'Fig. %s',
    'section': 'Section',
    'table': 'Table %s',
}
```
`numfig_secnum_depth` default `1`.

- **Themes:** default `alabaster`. Third-party themes (Furo, RTD) are pip installs + `html_theme = 'furo'`; Furo example:
# source: https://www.sphinx-doc.org/en/master/tutorial/more-sphinx-customization.html
```bash
(.venv) $ pip install furo
```
```python
html_theme = 'furo'
```
- **language:** `'en'` default; set per quickstart prompt.
- **numbering:** `numfig = True` + `:numref:` (see §2).
- **nitpicky:** docs recommend `nitpicky = True` for new projects ("Sphinx will warn about all references where the target cannot be found").
- **html_theme_options:** `dict[str, Any]`, theme-specific.
- `templates_path` / `html_static_path` files "are not meant to be built, they are automatically excluded."
- `exclude_patterns` globs: `'**'` matches across slashes; single `*` never matches slashes.
- `source_encoding` default `'utf-8-sig'`; non-UTF-8 support deprecated, Sphinx 11 UTF-8-only.

---

## Traps: 9.1.0 vs older (7.x/8.x) tutorials on the web

1. **Tutorial's own `sphinx-build 4.0.2`** output is stale — ours is 9.1.0. (getting-started)
2. **`master_doc` → `root_doc`.** 7.x tutorials say `master_doc = 'index'`; 9.1 still accepts it but the name is `root_doc` (7.2 rename, deprecated legacy). (configuration.html)
3. **quickstart CLI shrank in 8.0**: `--no-use-make-mode`, `-M`, `--use-make-mode`, `-m` are gone; old-style Makefile output removed. (changes/8.0.html)
4. **Python floor.** 8.0 needs ≥3.10; 9.1 needs **≥3.12**. Web tutorials written for 7.x-era Python 3.9 will not apply. (changes/8.0.html, CHANGES.rst)
5. **MathJax v4 default (9.0).** Tutorials assuming MathJax v3 / `mathjax3_config` are still mostly fine ("v3 is mostly compatible with v4"), but 9.x-verified output uses v4. (changes/9.0.html)
6. **autodoc rewrite (9.0).** Anything poking autodoc internals needs 9.0.4+; legacy behavior via `autodoc_use_legacy_class_based`. (changes/9.0.html)
7. **`show_warning_types = True` default (8.0)** — build output now shows warning type tags; old tooling that greps warnings may need updating. (changes/8.0.html)
8. **Non-UTF-8 sources deprecated (9.0)** → error on non-decodable bytes; will be removed Sphinx 10, UTF-8-only in 11. Keep sources UTF-8. (changes/9.0.html, configuration.html)
9. **`numfig` needed for `:numref:`** — 7.x tutorials that use `:numref:` without setting `numfig = True` produce non-numbered fallbacks. (referencing.html)
10. **`code-block` refs need `:name:` AND `:caption:`.** (directives.html)
11. **`:collapsible:` admonitions are 8.2+ only.** (directives.html)
12. **docutils floor:** 9.1 drops docutils 0.20 support → ≥0.21. Our 0.22.4 ✓. (CHANGES.rst)
13. **HTML output file list** (`genindex.html`, `py-modindex.html`, `_modules/`, etc.) is not enumerated in the builders page — treat the exact set as verify-in-Phase-2. (builders/index.html)

---

## Phase 2 porting shortlist (minimal official examples)

1. **Lumache quickstart project** — https://www.sphinx-doc.org/en/master/tutorial/getting-started.html and https://www.sphinx-doc.org/en/master/tutorial/first-steps.html
   Demonstrates: `sphinx-quickstart` → generated `conf.py` + `index.rst`, `sphinx-build -M html`, `make html`, `make epub`, `toctree`, `.. note::`, inline markup, `epub_show_urls`. Best end-to-end baseline for a fresh TECH_DOC build.

2. **sphinx-click usage example** — https://sphinx-click.readthedocs.io/en/latest/usage/
   Demonstrates: third-party extension enable + `.. click:: module:parser :prog: :nested: :commands:` and generated usage/options/envvar blocks. Directly relevant to documenting the PLC/CLI tooling.

3. **autodoc + autosummary + intersphinx template** — https://www.sphinx-doc.org/en/master/tutorial/automatic-doc-generation.html plus the intersphinx block from the quickstart template (https://www.sphinx-doc.org/en/master/usage/extensions/intersphinx.html)
   Demonstrates: `sys.path` in conf.py, `.. automodule::`/`.. autosummary:: :toctree:`, `objects.inv` cross-project refs — the pattern TECH_DOC needs for code-API annexes and cross-project links.
