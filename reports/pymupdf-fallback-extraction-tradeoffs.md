---
{
  "format": 1,
  "metadata": {
    "id": "pymupdf-fallback-extraction-tradeoffs",
    "title": "PyMuPDF fallback extraction and licensing tradeoffs",
    "question": "Which PyMuPDF extraction modes and layout/table remedies fit a fallback engine, and what limitations and licensing questions remain?",
    "scope": "Historical1.28.2 engineering-document fallback study; report text only, no PDFs/standards/source-document ingestion.",
    "summary": "Surveys flags, table/OCR/layout routes, example shortlist and reading-order pitfalls; retains unresolved internal-use licensing interpretation.",
    "researched_at": "2026-08-14",
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
      "Portable docs/source/community/licensing URLs; targets and legal claims not rechecked.",
      "NORMATIVE/ELECTRONICS holdings and local installation context; holdings not read.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:32:47.437Z",
    "updated_at": "2026-11-01T23:32:47.437Z",
    "imported_at": "2026-11-01T20:39:00.910Z"
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
  "sourceDigest": "2ab33aad2f36a3f38f152eae7c0c5ab472c1284fe730d8707d1d7cc4865cc13a",
  "proposalRevision": "ba0b56dd4011918d423a2307d4c8d39b8598f43344488e48b2d1fb81afdd733b"
}
---
# PyMuPDF — PDF Text Extraction Research (docs_research)

**Scope:** evaluate PyMuPDF as text-extraction FALLBACK engine (primary = MinerU) for
engineering datasheets (ELECTRONICS/) and standards PDFs (NORMATIVE/).
**Local version:** 1.28.2 (installed in project `.venv`; PyPI latest is 1.28.2, released 2026-08-06).
**Import note verified locally:** `import fitz` emits
`warning: The \`fitz\` API is deprecated and will be removed in future. Use \`import pymupdf\` instead.`
Module name is now `pymupdf` (`pymupdf.__name__ == 'pymupdf'`, no `fitz` attribute).

Research date: 2026-08-14. All claims carry a source URL.

---

## 1. Official docs — text extraction

Primary reference: https://pymupdf.readthedocs.io/en/latest/textpage.html
How-to recipes: https://pymupdf.readthedocs.io/en/latest/recipes-text.html
Deep detail appendix: https://pymupdf.readthedocs.io/en/latest/app1.html
(also mirrored at https://pymupdf.qubitpi.org/en/latest/app1.html)

### 1.1 `Page.get_text()` modes

`Page.get_text()` wraps `Page.get_textpage()`. Mode strings:

| Mode | Method | Returns |
|---|---|---|
| `"text"` | `extractText(sort=False)` | plain text, document order; `sort=True` sorts top-left→bottom-right |
| `"blocks"` | `extractBLOCKS()` | `(x0,y0,x1,y1,"text",block_no,block_type)`; type 0=text, 1=image, 3=vector |
| `"words"` | `extractWORDS(delimiters=None)` | `(x0,y0,x1,y1,"word",block_no,line_no,word_no)`; `delimiters` (v1.23.5+) adds separators |
| `"html"` | `extractHTML()` | full formatting/positioning, images base64 |
| `"xhtml"` | `extractXHTML()` | span-level text, base64 images, no layout info |
| `"xml"` | `extractXML()` | per-character formatting, no images |
| `"dict"` | `extractDICT(sort=False)` | Python dict (blocks→lines→spans) |
| `"json"` | `extractJSON(sort=False)` | `json.dumps(extractDICT())` |
| `"rawdict"` | `extractRAWDICT(sort=False)` | dict + per-character detail |
| `"rawjson"` | `extractRAWJSON(sort=False)` | `json.dumps(extractRAWDICT())` |

Source: https://pymupdf.readthedocs.io/en/latest/textpage.html

### 1.2 Extraction flags (TEXTFLAGS)

`flags` param on `get_textpage()` / `get_text()` is a bitmask. Constants (verified in 1.28.2):

- `TEXT_PRESERVE_WHITESPACE` — preserve whitespace (default on for all text modes; off → tabs replaced by spaces)
- `TEXT_PRESERVE_IMAGES` — include image blocks
- `TEXT_PRESERVE_LIGATURES` — keep ligature chars (default on; `-noligatures` in CLI expands them)
- `TEXT_PRESERVE_SPANS` — (present in 1.28.2, new-ish) preserve span info
- `TEXT_DEHYPHENATE` — re-join hyphen-split words ("meth-"+"od"→"method"); default ON only for **search**, OFF for text modes
- `TEXT_DIACRITICS` — preserve diacritical marks
- `TEXT_MEDIABOX_CLIP` — clip to media box (default on)
- `TEXT_CID_FOR_UNKNOWN_UNICODE` — use CID instead of U+FFFD for unmapped chars
- `TEXT_INHIBIT_SPACES` — suppress gap-injected spaces ("H a l l o" → "Hallo")

Per-mode defaults (Appendix 1 table): https://pymupdf.readthedocs.io/en/latest/app1.html
Reusable presets (v1.19.6+): `TEXTFLAGS_TEXT`, `TEXTFLAGS_WORDS`, `TEXTFLAGS_BLOCKS`, `TEXTFLAGS_DICT`,
`TEXTFLAGS_RAWDICT`, `TEXTFLAGS_HTML`, `TEXTFLAGS_XHTML`, `TEXTFLAGS_XML`, `TEXTFLAGS_SEARCH`.
Combine/modify e.g. `flags = TEXTFLAGS_BLOCKS | TEXT_PRESERVE_IMAGES` or
`flags = TEXTFLAGS_SEARCH & ~TEXT_DEHYPHENATE`.
Source: https://pymupdf.readthedocs.io/en/latest/textpage.html + https://pymupdf.readthedocs.io/en/latest/app1.html

### 1.3 Tables — `Page.find_tables()` / TableFinder

Signature (from docs):
```python
find_tables(clip=None, strategy=None, vertical_strategy=None, horizontal_strategy=None,
            vertical_lines=None, horizontal_lines=None,
            snap_tolerance=None, snap_x_tolerance=None, snap_y_tolerance=None,
            join_tolerance=None, join_x_tolerance=None, join_y_tolerance=None,
            edge_min_length=3, min_words_vertical=3, min_words_horizontal=1,
            intersection_tolerance=None, intersection_x_tolerance=None,
            intersection_y_tolerance=None, text_tolerance=None,
            text_x_tolerance=None, text_y_tolerance=None,
            add_lines=None, add_boxes=None, paths=None, use_layout=True)
```
New in 1.28.2: `use_layout: bool = True`, `union: bool = False`, `refine: bool = False`, faster.
Source: https://pymupdf.readthedocs.io/en/latest/page.html + changelog (changes.txt).

`Table` object: `bbox`, `extract()` (list-of-lists of strings), `to_markdown()`,
`to_pandas()` (needs pandas; DataFrame markdown needs tabulate), `header` (`TableHeader`:
`bbox`, `cells`, `names`, `external`), `col_count`, `row_count`, `rows`.
**Lifetime = page lifetime**: tables invalid once page deleted/reassigned — copy data out
(`to_markdown()`, `to_pandas()`, or `extract()[:]`).
Header is never auto-identified; `external == False` means first row acts as header.
Source: https://pymupdf.readthedocs.io/en/latest/page.html

Strategies (from DeepWiki code walk): `lines` (visible lines + borderless filled rect edges, most
permissive), `lines_strict` (only clearly drawn lines), `text` (infer borders from text clustering,
for borderless tables), `explicit` (only `add_lines`/`add_boxes`).
Source: https://deepwiki.com/pymupdf/PyMuPDF/3.2-table-detection-and-extraction

### 1.4 OCR integration (scanned/textless PDFs)

Built on **Tesseract**, installed separately:
- `Pixmap.pdfocr_save()` / `Pixmap.pdfocr_tobytes()` — raster→1-page OCR PDF with hidden text layer.
  Pixmap must be RGB with `alpha=False`. Text is "hidden" monospaced (GlyphLessFont), regular/black only;
  no bold/italic, no original font. **Vector graphics not recognized.**
- `Page.get_textpage_ocr(...)` — OCR a page, result cached in a `TextPage` (OCR is ~1000× slower than
  standard extraction); reuse via `textpage=tp` for subsequent `get_text()`/`search_for()`.
Source: https://pymupdf.readthedocs.io/en/latest/recipes-ocr.html
Utility scripts: `OCR/ocrpages.py`, `OCR/tesseract1.py`, `OCR/tesseract2.py`, `OCR/images-to-ocr-pdf.py`,
notebooks `jupyter-notebooks/ocr-illegible.ipynb`, `jupyter-notebooks/partial-ocr.ipynb`.
Source: https://github.com/pymupdf/PyMuPDF-Utilities (OCR/, jupyter-notebooks/)

### 1.5 Metadata / TOC / images

- TOC: `Document.get_toc()` (outline); 1.28.2 fixed an outline/TOC parsing bug (#5044).
- Metadata: `Document.metadata`.
- Images: text-mode image blocks need `TEXT_PRESERVE_IMAGES`; `Page.get_images()`, `Page.extract_image()`.
- Vector blocks need `TEXT_COLLECT_VECTORS` (separate flag, not in default TEXTFLAGS).
- `(X)HTML`/`XML` always extract the full page (ignore `clip`/`rect`).
Sources: https://pymupdf.readthedocs.io/en/latest/textpage.html,
https://pymupdf.readthedocs.io/en/latest/recipes-text.html

### 1.6 Layout-preserving extraction

`python -m pymupdf gettext <file>` (CLI, default `-mode layout`) produces text close to physical layout,
handling multi-column, tables, simulated bold/shadow, char-permutation obfuscation (`garbled.pdf`), and
stray-space bugs. Options: `-mode {simple,blocks,layout}`, `-pages 1,5-7,50-N`, `-noligatures`,
`-convert-white`, `-extra-spaces`, `-noformfeed`, `-skip-empty`, `-output`, `-grid` (merge lines, default 2),
`-fontsize` (ignore smaller, default 3). Same engine available in-library since v1.18.16 via
`python -m fitz gettext` (now `python -m pymupdf gettext`). Verified locally: `python -m pymupdf gettext -h` works on 1.28.2.
Sources: https://github.com/pymupdf/PyMuPDF-Utilities/tree/master/text-extraction (README.md)

### 1.7 RAG / Markdown path

`PyMuPDF4LLM` (separate package `pymupdf4llm`) is the high-level wrapper: `pymupdf4llm.to_markdown("in.pdf")`
produces integrated Markdown (text + tables), enabling "Level 3 chunking". LangChain `PyMuPDFLoader`,
LlamaIndex `PyMuPDFReader` integrate directly.
Sources: https://pymupdf.readthedocs.io/en/latest/rag.html

---

## 2. Official example repos — canonical scripts

Repo: https://github.com/pymupdf/PyMuPDF-Utilities (branch `master`). Text-extraction folder:
https://github.com/pymupdf/PyMuPDF-Utilities/tree/master/text-extraction

Contents (from GitHub API listing):
- `PDF2Text.py` — "naive"/native extraction, prints text as coded in page (may be non-reading-order).
- `PDF2TextBlocks.py` — block extraction sorted top-left→bottom-right ("Western" reading order);
  fast, but multi-column/tables may still be wrong.
- `fitzcli.py` — full CLI module + `gettext` layout-preserving extraction.
- `multi_column.py` — column-compatible text-box detection (CLI + importable function); used by
  pymupdf4llm's `column_boxes`.
- `lookup-keywords.py` — key-value extraction when layout is predictable (keyword followed by value,
  value's bottom not above keyword's bottom).
- `layout-analyzer.py` — renders a new PDF showing layout of all text+images.
- `extend-dicts.py` — shows rawdict/dict structure extension.
- Sample PDFs: `garbled.pdf`, `textmaker.pdf`, `textmaker2.pdf` (obfuscated/permuted char order),
  `1page.pdf`, `Dart.pdf`, `Petresume.pdf`, `demo1.pdf`, `invoice-simple.pdf`, `layout-demo1.pdf`, `shadows.pdf`.

Other folders relevant to our fallback use-case:
- `OCR/` — `ocrpages.py`, `tesseract1.py`, `tesseract2.py`, `images-to-ocr-pdf.py`, `easyocr1.py` + sample PDFs.
- `table-analysis/` — `find_tables.ipynb`, `gridlines-to-pandas.py`, `span-analysis-to-pandas.py`,
  `join_tables.ipynb`, `clean_graphics.py`, `compare-xps-pdf.ipynb`, `show_image.py` + sample PDFs incl.
  `chinese-table.pdf`, `national-capitals.pdf`.
- `textbox-extraction/` — `textbox-extract-1.py`, `textbox-extract-2.py` (get_text from rectangles).
- `word&line-marking/` — `mark-words.py`, `mark-lines.py`, `mark-lines2.py`.
- `jupyter-notebooks/` — `ocr-illegible.ipynb`, `partial-ocr.ipynb`.

---

## 3. `fitz` → `pymupdf` import rename

Timeline from changelog (https://github.com/pymupdf/PyMuPDF/blob/master/changes.txt):

| Version | Date | Change |
|---|---|---|
| 1.23.9 | 2024-01-11 | Default to new "rebased" implementation; old "classic" available as `import fitz_old as fitz` (https://github.com/pymupdf/PyMuPDF/discussions/2680) |
| 1.24.2 | 2024-04-17 | Removed obsolete classic implementation (`fitz_old` removed from releases) |
| 1.24.3 | 2024-05-09 | **"The Python module is now called `pymupdf`. `fitz` is still supported for backwards compatibility."** |
| 1.28.2 | 2026-08-06 | "Output warning when legacy `fitz` module is imported." (this is the deprecation warning we see locally) |

So: module renamed `pymupdf` in 1.24.3; `import fitz` still works but is a deprecated alias and the
1.28.2 release explicitly warns it "will be removed in future." New code should `import pymupdf`.
Verified locally on 1.28.2.

---

## 4. Version 1.28.x specifics

Source: https://github.com/pymupdf/PyMuPDF/blob/master/changes.txt

**1.28.2** (2026-08-06; MuPDF-1.28.2) — extraction-relevant:
- Output warning when legacy `fitz` module imported (deprecation notice).
- `Page.find_tables()`: new args `use_layout=True`, `union=False`, `refine=False`; improved speed.
- Fixed #5030: `find_tables()` with layout enabled could return zero-cell Table → `Table.bbox` raised
  `ValueError: min() iterable argument is empty`.
- Fixed #5042: `Page.get_texttrace()` leaked `None` refs → Fatal Python error in long-running processes (1.27.2.3 & 1.28.0) — **relevant to long-running batch fallback**.
- Fixed #5044: Outline (TOC) parsing bug.
- Fixed #5049: font subsetting segfault regression from 1.27.2.2.
- Fixed #4670: scrub fails to remove hidden text after clean_contents changes (≥1.24.0).
- "Cope better with markdown containing illegal utf8 sequences."

**1.28.0** (2026-06-29; MuPDF-1.28.0):
- `Document.__init__()` new `archive` arg; `Document.convert_to_pdf()` now also generates links;
  `Document.save()` saves non-PDF docs in PDF format; new `Document.apply_css()`.
- Fixed #5001: Formulae incorrectly rendered as black boxes.
- Pyodide wheel on PyPI.

**Notable earlier versions (for migration context):**
- 1.27.2.2 fixed #4932: `Page` has no attribute `find_tables` in 1.27 (find_tables regression).
- 1.26.x: Python 3.9–3.14 support; `pymupdf.pymupdf_date`/`VersionDate` now `None` (removal planned).
- 1.25.x: MuPDF 1.25.x; fixes for text-color changes (#4139), pixmap perf regression (#4336).
- 1.24.x: the `pymupdf` rename (1.24.3); classic impl removed (1.24.2); MuPDF-1.24.2.
- No breaking changes in 1.28.x that affect the extraction API we use; `find_tables()` args are backward-compatible additions.

---

## 5. License

**Facts (decision is the project's, not recorded here).**

- Dual license: **AGPL-3.0 (open source) OR commercial (Artifex)**.
  Quote: "PyMuPDF and MuPDF are now available under both, open-source AGPL and commercial license agreements."
  Source: https://pymupdf.readthedocs.io/en/latest/about.html
- "Artifex is the exclusive commercial licensing agent for MuPDF."
  Source: https://pymupdf.readthedocs.io/en/latest/about.html
- Artifex licensing page (verbatim): 
  - "Any modifications to our open-source must be disclosed under the AGPL, including sharing the modified code with any users interacting with it."
  - "You cannot deploy our open-source as part of a server-based application or service, without disclosing your own application's full source code under AGPL to any users interacting with it."
  - "Usage of our open-source Community Edition must be limited to AGPL-compliant environments, where all AGPL requirements are fully respected."
  - "If you can't meet the requirements of the GNU AGPLv3 above, a commercial license is required."
  Source: https://artifex.com/licensing
- Commercial license models (Artifex page): **OEM Distribution License** and **Subscription License**;
  both "unlimited distribution without requirements", "no need to disclose your code"; annual reporting on
  volume — and notably for Subscription: "**(No report needed for internal usage)**". "Each Artifex commercial
  license is crafted based on your individual use case." Footnote: options for "SaaS, OEM, or in-house".
  Source: https://artifex.com/licensing
- Maintainer's interpretation (GitHub discussion #971, author JorjMcKie — project lead, not legal advice):
  "Anyone / anything using PyMuPDF must be either licensed as GNU AGPL v3.0 or commercial. If AGPL then the
  app must be freeware and open-source - as per the license text. **This should be no problem with internal uses, should it?**"
  And: "If you offer your solution for free, it suffices to communicate the access to the source code and
  state that you also are subject to the AGPL."
  Source: https://github.com/pymupdf/PyMuPDF/discussions/971
- Discussion #1949 (maintainers): "your application needs to use the GNU Affero General Public License if it
  uses PyMuPDF"; "PyMuPDF is also available under a commercial license from Artifex"; full info at
  https://pymupdf.readthedocs.io/en/latest/intro.html#license-and-copyright
  Source: https://github.com/pymupdf/PyMuPDF/discussions/1949
- What the AGPL does NOT clearly answer from these sources: the boundary for **internal-only tooling that is
  never distributed and never served to network users**. AGPL §13 (network provision) is the section that can
  extend obligations to server deployments; the Artifex page paraphrases that ("server-based application or
  service... disclosing your own application's full source code to any users interacting with it").
  For a private, internal fallback script that never ships and is not network-served to third parties, the
  classic AGPL trigger (distributing the software) is arguably not fired — but this is a legal determination
  for the project, not a settled fact. The maintainer's comment ("no problem with internal uses") and the
  commercial Subscription note ("No report needed for internal usage") are the two most on-point data points.
- AGPL full text: https://www.gnu.org/licenses/agpl-3.0.html (referenced by docs).

---

## 6. Community gotchas

- **Extraction order ≠ visual order.** PDFs store positioned text fragments, not reading order.
  "plain text as it is coded in the document... may mean output not in usual reading order, unexpected line breaks."
  Headers/footers added late can appear at the end of the page's text. `sort=True` gives top-left→bottom-right,
  which "should suffice" but is not guaranteed for multi-column. 
  Sources: https://pymupdf.readthedocs.io/en/latest/recipes-text.html ,
  https://github.com/pymupdf/PyMuPDF/discussions/2396 ,
  https://blog.jztan.com/multi-column-pdf-reading-order/
- **Multi-column standards/datasheet PDFs.** `get_text("text")` interleaves columns. Fixes: `sort=True`,
  `multi_column.py` (column_boxes algorithm), pymupdf4llm's three-phase column detection (block filtering →
  iterative joining → smart sort using (P.y0, current.x0) so right column reads after left), or CLI
  `gettext -mode layout`. Only horizontal LTR supported; overlapping (non-disjoint) blocks not handled.
  Sources: https://deepwiki.com/pymupdf/pymupdf4llm/5.2-multi-column-layout-detection ,
  https://github.com/pymupdf/PyMuPDF-Utilities/blob/master/text-extraction/multi_column.py ,
  https://forum.mupdf.com/t/bug-double-column-pdfs-text-extracted-in-wrong-order/265
- **Embedded/subset fonts with missing ToUnicode → garbage.** CID/Type0 fonts make ToUnicode optional;
  many producers omit it. PyMuPDF "is fastest and usually correct when the CMap exists", but on broken CMaps
  you get U+FFFD replacement chars or scrambled text. Multi-engine compare (pymupdf vs pdfplumber vs pdfminer)
  and pick the sane one; OCR the page as last resort. "A library returning clean-looking text on a broken font
  is worse than an obvious crash, because it's invisible." Real cases: Amazon Sustainability Report (#3594),
  bad-font definition PDFs (#1380), Devanagari (#4805).
  Sources: https://pdfmux.com/blog/fix-garbled-pdf-text-python/ ,
  https://github.com/pymupdf/PyMuPDF/issues/3594 ,
  https://github.com/pymupdf/PyMuPDF/discussions/1380 ,
  https://github.com/pymupdf/PyMuPDF/issues/4805
- **Missing spaces.** PDFs store glyph positions, not words; producers (LaTeX, print drivers) never emit
  spaces. `get_text("words")`/`get_text("dict")` apply a gap-based space heuristic internally and are the
  good default. `TEXT_INHIBIT_SPACES` can collapse spurious per-glyph spacing.
  Sources: https://pdfmux.com/blog/fix-garbled-pdf-text-python/ ,
  https://pymupdf.readthedocs.io/en/latest/app1.html
- **Ligatures & private-use codepoints.** `ﬁ`/`ﬄ` map to U+FB00–FB06 or PUA (U+E000–F8FF), breaking search/
  tokenization. Fix: run `unicodedata.normalize("NFKC", ...)` on every extraction (idempotent; **NFKD strips
  accents — avoid**). Default extraction preserves ligatures; CLI `-noligatures` expands them.
  Source: https://pdfmux.com/blog/fix-garbled-pdf-text-python/
- **Rotated / non-horizontal text.** Blocks give rects, but for tilted/rotated text use quads:
  `pymupdf.recover_quad(line["dir"], span)` / `pymupdf.recover_line_quad(line, spans=...)`. Writing
  direction per span is in the span/line dicts ("dir"); RTL span detection was "missing" as of discussion #3153.
  find_tables handles rotated pages transparently (90/180/270 identical extraction).
  Sources: https://pymupdf.readthedocs.io/en/latest/recipes-text.html ,
  https://github.com/pymupdf/PyMuPDF/discussions/3153 ,
  https://deepwiki.com/pymupdf/PyMuPDF/3.2-table-detection-and-extraction
- **Table detection limits.** `lines`/`lines_strict` need visible rules or filled-rect edges; fully borderless
  tables need `strategy="text"` or manual `add_lines`/`add_boxes`. `paths=[]` disables graphics detection →
  tables missed. Nested tables not reliably supported (regular-grid assumption) — use `clip` per sub-region.
  Cell text keeps only chars whose bbox overlaps cell >50%; empty cells return `None`. `find_tables()` had
  regressions in 1.27 (#4932) and a zero-cell crash fixed in 1.28.2 (#5030). 
  Sources: https://deepwiki.com/pymupdf/PyMuPDF/3.2-table-detection-and-extraction ,
  https://github.com/pymupdf/PyMuPDF/issues/4169 ,
  https://github.com/pymupdf/PyMuPDF/issues/2892 ,
  https://github.com/pymupdf/PyMuPDF/issues/3675 ,
  https://github.com/pymupdf/PyMuPDF/discussions/3158
- **HTML/XHTML image placement breaks on complex PDFs.** Rotated pages / MediaBox≠CropBox → images
  mispositioned in HTML output (upstream MuPDF bug). 
  Source: https://pymupdf.readthedocs.io/en/latest/app1.html
- **Long-running processes:** 1.27.2.3/1.28.0 `Page.get_texttrace()` leaked `None` refs → fatal error in
  long-running processes (fixed 1.28.2 #5042) — keep this in mind for batch fallback daemons.
  Source: https://github.com/pymupdf/PyMuPDF/blob/master/changes.txt
- **`fitz` import will break someday.** The legacy alias is deprecated with a removal warning since 1.28.2;
  new code must `import pymupdf`.
  Source: https://github.com/pymupdf/PyMuPDF/blob/master/changes.txt (verified locally)

---

## Portable examples shortlist

Canonical official scripts worth porting in Phase 2 (all from https://github.com/pymupdf/PyMuPDF-Utilities):

1. `text-extraction/fitzcli.py` — full CLI + `gettext` layout-preserving extraction (the single most
   valuable fallback: multi-column + tables + obfuscated text). Also runnable as `python -m pymupdf gettext`.
2. `text-extraction/multi_column.py` — column-compatible text-box detection; importable function + CLI with
   visual debug PDF. Direct answer to multi-column standards/datasheet PDFs.
3. `text-extraction/PDF2TextBlocks.py` — block extraction with top-left→bottom-right sort; the fast baseline
   for reading-order extraction.
4. `text-extraction/lookup-keywords.py` — key-value extraction for "predictable-layout" datasheet tables
   (model numbers, ratings) when find_tables is overkill.
5. `table-analysis/find_tables.ipynb` — find_tables usage incl. multiple tables/page + joining fragments
   across pages; port to script form.
6. `table-analysis/gridlines-to-pandas.py` — table → pandas via gridlines strategy.
7. `table-analysis/join_tables.ipynb` — multi-page table join pattern (relevant to long datasheet tables).
8. `OCR/ocrpages.py` + `OCR/tesseract1.py` / `OCR/tesseract2.py` — Tesseract OCR path for scanned/textless
   pages (the true last-resort fallback when MinerU + text layer both fail).
9. `textbox-extraction/textbox-extract-1.py` / `-2.py` — `get_text("words")` from a rectangle clip (e.g.
   extract a specific spec block).
10. `jupyter-notebooks/partial-ocr.ipynb` — OCR only image regions (keeps good text fast, OCRs the rest).

## License facts (digest)

- PyMuPDF is dual-licensed AGPL-3.0 OR commercial (Artifex). https://pymupdf.readthedocs.io/en/latest/about.html
- AGPL triggers per Artifex: disclose modifications; **server deployment → disclose your app source to
  interacting users**; can't meet AGPL → commercial license required. https://artifex.com/licensing
- Commercial Subscription note: "No report needed for internal usage" — i.e. internal use is a lighter-touch
  commercial scenario. https://artifex.com/licensing
- Maintainer (JorjMcKie): AGPL requires the app be open-source/freeware; "**no problem with internal uses**";
  free+open offer suffices by communicating source access. (Personal opinion, not legal advice.)
  https://github.com/pymupdf/PyMuPDF/discussions/971
- License decision (AGPL-internal-tooling vs commercial) is the project's call; record of facts above.
  AGPL full text: https://www.gnu.org/licenses/agpl-3.0.html

## Gotchas digest (bullet)

- Extraction order ≠ reading order; headers/footers can appear last on page. `sort=True` helps, not guaranteed.
- Multi-column PDFs interleave; use `multi_column.py` / pymupdf4llm column_boxes / `gettext -mode layout`.
- Subset/CID fonts with missing ToUnicode → U+FFFD garbage; cross-check pdfplumber/pdfminer, OCR as last resort.
- Missing spaces: rely on `get_text("words")`/`"dict"` gap heuristic; `TEXT_INHIBIT_SPACES` collapses spurts.
- Ligatures/PUA: run NFKC normalize on every extraction (never NFKD — strips accents).
- Rotated text: use quads via `recover_quad`/`recover_line_quad`; span "dir" gives writing direction.
- find_tables: borderless tables need `strategy="text"` or manual `add_lines`/`add_boxes`; nested tables
  unreliable; cell chars kept only if >50% overlap; empty cell → `None`; results die with the page object.
- HTML/XHTML images misplace on rotated/MediaBox≠CropBox PDFs.
- Long-running processes: get_texttrace leak fixed only in 1.28.2 (#5042).
- `import fitz` deprecated (warning since 1.28.2, removal planned) — write `import pymupdf`.
