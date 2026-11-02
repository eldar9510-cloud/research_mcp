---
{
  "format": 1,
  "metadata": {
    "id": "kaleido-v1-headless-static-export",
    "title": "Kaleido v1 headless static export on Linux",
    "question": "How does Kaleido1.3 export Plotly figures headlessly, and what browser dependencies and failure modes remain?",
    "scope": "Historical Plotly6.8/Kaleido1.3/Chrome stack; PNG/SVG and batch export, deprecated APIs and alternatives; no rerun.",
    "summary": "Distinguishes v1 browser discovery from v0 bundling and records failure modes, alternatives and source-stated smoke results.",
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
      "All bytes excerpted; not a full privacy/rights/legal audit.",
      "Preserve limitations and uncertainty; no technical verification/current-applicability claim.",
      "Portable upstream/docs/community URLs plus local package/browser paths.",
      "Machine browser/environment paths and output sizes remain.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:32:30.611Z",
    "updated_at": "2026-11-01T23:32:30.611Z",
    "imported_at": "2026-11-01T20:39:00.543Z"
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
  "sourceDigest": "c71b8039903e24cc637e924f0861201131e31302048867fcbe60660cb6ca2032",
  "proposalRevision": "267690de02e1efca8b089a8531405c83af1fc9922d046a9e37482ef252a08fbc"
}
---
# Research — Kaleido 1.3.0 static export on Linux (2026-08-14)

## TL;DR (corrects the HANDOFF premise)

Kaleido **v0** bundled chromium in the wheel. **v1.0.0+ (incl. 1.3.0) does NOT
bundle a browser** — it finds a system Chrome/Chromium (via `choreographer`)
or auto-downloads a Chrome-for-Testing build (`kaleido_get_chrome`).
Our exact stack (kaleido 1.3.0 + plotly 6.8.0 + system
`/usr/bin/google-chrome-stable`) **verified working headless on this machine**
(PNG + SVG exports, exit 0).

Kaleido is NOT deprecated — it is plotly's **only** current static-export
engine. Deprecated: orca, `engine=` arg, kaleido <1.0.0, `pio.kaleido.scope`
(all "removed after September 2025"; still present-but-warning in 6.8.0).

## Architecture

- Pure-Python v1 drives a Chrome/Chromium over Chrome DevTools Protocol on a
  pipe (`--remote-debugging-pipe`), renders a Plotly.js page headless, screenshots it.
- Browser discovery order: PATH scan (`google-chrome`, `chromium`, `msedge`,
  `brave`, ...) → `/usr/bin/...` paths → local Chrome-for-Testing download in
  `~/.local/share/choreographer/deps/`. `BROWSER_PATH` env var overrides.
- Pinned "last known good" build in this install: Chrome for Testing
  142.0.7444.175 (`choreographer/resources/last_known_good_chrome.json`).
- Launch flags fixed inside choreographer `get_cli()`: `--headless` AND
  `--no-sandbox` are **defaults** (v0 required manual
  `scope.chromium_args = ["--no-sandbox"]` — that surface is GONE in v1,
  AttributeError if touched). Also `--disable-gpu`, `--disable-dev-shm-usage`,
  `--enable-unsafe-swiftshader`, etc. No X server/DISPLAY needed.

## plotly 6.x integration (verified in venv)

- `plotly.io.to_image is plotly.io._kaleido.to_image` → True. Kaleido = default engine.
- `engine=` arg still in signature but DeprecationWarning when passed. Never use.
- `pio.defaults` (since 6.1): `default_width`, `default_height`, `default_scale`,
  `default_format`, `mathjax`, `plotlyjs`, `topojson`, `headers` (6.8.0 +
  kaleido 1.3.0: `{"X-Requested-With": "plotly.py"}` for OSM tile policy).
- `pio.write_images(fig=[...], file=[...])` — batch export, one Chrome session
  (6.1+, faster than repeated write_image).
- Formats: png, jpeg, webp, svg, pdf. **eps = v0-only** → use pdf/svg.
  Vector exports of WebGL traces embed rasters.
- kaleido v1 requires plotly ≥ 6.1.1 (else UserWarning).

## API

```python
fig.write_image("file.png")                                    # format from extension
fig.write_image("file.png", width=600, height=350, scale=2)    # always explicit!
fig.to_image(format="svg", width=600, height=350, scale=1)     # bytes
pio.write_images(fig=[f1, f2], file=["a.png", "b.png"])        # batch
```
`scale` = physical resolution multiplier; `width`/`height` = logical px.
Global defaults via `pio.defaults.*`.

Engine verification (headless checklist):
- `importlib.metadata.version("kaleido")` → 1.3.0 (**`kaleido.__version__` does
  NOT exist** — AttributeError).
- Chrome present: `which google-chrome-stable` or `pio.get_chrome()`
  (CLI: `plotly_get_chrome` / `kaleido_get_chrome`; all three in `.venv/bin/`).
- Smoke: `fig.write_image("/tmp/x.png")` on a trivial figure.

## Failure modes (headless Linux)

| Symptom | Fix |
|---|---|
| `ChromeNotFoundError: Browser not found...` (v1) | `plotly_get_chrome`, install system chrome, or `BROWSER_PATH=/path/chrome` |
| v0-era `ValueError: Failed to start Kaleido subprocess` | v0 issue; on v1 debug with `PLOTLY_DEBUG=true` |
| Chrome fails in minimal container | missing shared libs (`libnss3`, `libatk-bridge2.0-0`, `libgbm1`, `libasound2`, `libxcomposite1`, `libxdamage1`, `libxrandr2`, `libcairo2`, `libpango-1.0-0`, `libx11-6`) |
| Root / container sandbox | handled (v1 defaults `--no-sandbox`) |
| Hang on large figures | fixed v1.3.0 (PR #442) + v1.1.0 — upgrade |
| Snap Chrome isolation | handled internally (`is_isolated()`) |
| Leftover orca | `pip uninstall plotly-orca` |

## Alternatives (fallback list, informed)

- matplotlib — pure Python, always headless; loses plotly interactivity/theme.
- cairosvg — SVG→PNG/PDF rasterizer (circular if kaleido broken — needs SVG from kaleido).
- playwright — drive headless Chromium yourself (`page.screenshot`).
- orca — DEAD. wkhtmltoimage — WebKit ≠ Chrome fidelity.

## License

MIT (Plotly, Inc.).

## Verified on this machine

- plotly 6.8.0 + kaleido 1.3.0 + choreographer (devel) in `.venv`.
- System chrome `/usr/bin/google-chrome-stable` found; headless PNG (38,186 B)
  + SVG (7,165 B) exports succeeded, exit 0.
- `engine="kaleido"` → DeprecationWarning (still functional).
- `pio.kaleido.scope.chromium_args` → AttributeError (v0 API gone).

## Sources

- https://github.com/plotly/Kaleido (README)
- https://github.com/plotly/Kaleido/blob/master/CHANGELOG.md
- https://plotly.com/python/static-image-export/
- https://plotly.com/python/static-image-generation-changes/
- https://pypi.org/project/kaleido/
- https://community.plotly.com/t/kaleido-replacement/72599/4
- https://community.plotly.com/t/kaleido-1-0-0-errors-within-docker-container/93068/10
- https://github.com/plotly/Kaleido/issues/164
- https://github.com/plotly/plotly.py/issues/4952
- Local package source (authoritative for this stack): `.venv/.../plotly/io/_kaleido.py`,
  `.venv/.../kaleido/*`, `.venv/.../choreographer/browsers/chromium.py`
