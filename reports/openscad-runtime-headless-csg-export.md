---
{
  "format": 1,
  "metadata": {
    "id": "openscad-runtime-headless-csg-export",
    "title": "OpenSCAD runtime, headless export and backend tradeoffs",
    "question": "Which OpenSCAD build/backend fit headless CSG export, and are STEP interchange and deterministic output available?",
    "scope": "Historical2026-08-13 snapshot versus2021.01 stable on Ubuntu24.04; runtime/CLI/export, not general CAD/FEA MCP surveying.",
    "summary": "Compares Manifold/CGAL, source-stated STEP absence, CLI behavior and release/install/license constraints.",
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
      "Official/source/issues/community URLs; executable downloads and source targets not followed.",
      "Host/build details, absolute paths and internal lift/reverse-engineering context.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:33:11.717Z",
    "updated_at": "2026-11-01T23:33:11.717Z",
    "imported_at": "2026-11-01T20:39:01.475Z"
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
      "code": "unresolved_citation",
      "message": "Unresolved or ambiguous imported reference or footnote; no target was invented."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "0b3f27fa293988db0066aca8d736f04a0b8826101effb3bb79f9f2b56c87ae28",
  "proposalRevision": "e3d927527671d11aa82a47b10ead16cbe6b11a6dcbe2d26fff11a39557f36aa4"
}
---
# OpenSCAD Platform / Runtime State — August 2026

Date: 2026-08-14. Task: current state of OpenSCAD for the TOOLS/CAD_GEOMETRY/openscad_emit
eval (STEP-reverse-engineering → CSG emit → render/export on Ubuntu 24.04
x86_64, Machinery Directive / EN 81-41 car lift repo). Facts below were
verified by fetching pages OR by **actually downloading and running the
2026.08.13 snapshot AppImage on this host** (git 1ee676b0) and testing CLI
behavior, exit codes, imports, exports, and booleans. Items I could not confirm
are marked `[UNVERIFIED]`.

---

## Key takeaways for the eval

1. **2021.01 is still the ONLY stable release** (no stable in 5.5 years). All
   recent capability lives in **daily dev snapshots** named `OpenSCAD-YYYY.MM.DD-x86_64.AppImage`
   at `https://files.openscad.org/snapshots/` — latest 2026.08.13 (84 MB,
   git `1ee676b0`). **Use the AppImage; do not rely on `apt`** (apt gives 2021.01, CGAL-only).
2. **Manifold is now the default 3D rendering backend** in dev builds (default
   since ~2025-08-17, announced on the mailing list; confirmed in the 2026.08.13
   binary via `--help` and render stats). CGAL 6.1 is still compiled in and
   selectable with `--backend=cgal`. Empirically, a **coplanar-face `difference()`
   renders clean under Manifold** (`manifold`, NoError, Genus 0) — the exact
   failure class that matters for `difference()` over STEP-reverse-engineered
   primitives. CGAL also exported it but internally produced 2 volumes.
3. **NO STEP import or export in ANY build** (stable or 2026 dev). Feature
   request #3065 closed as **"not planned"** (2025-10-09); #5180 (Assimp dep for
   STEP/glTF/Collada/PLY/X3D) still open. → The emit target must be SCAD
   **primitives/CSG or meshes (STL/3MF)**, never STEP. STEP→SCAD must happen in
   the cad_reverse layer (OCC), which is exactly the repo's existing design.
4. **Headless CLI is CI-ready**: `openscad -o out.stl file.scad`, exit **0 on
   success / 1 on parse error or (with `--hardwarnings`) on warning**; JSON stats
   via `--summary-file=-`; `-D` overrides; `.echo` export captures `echo()` +
   errors to a text file. PNG renders headless with `QT_QPA_PLATFORM=offscreen`.
5. **Byte-deterministic STL output by default** (verified: two identical runs →
   identical sha256). `predictible-output` (experimental) changes facet ordering
   but is itself self-consistent. Pin `$fa/$fs/$fn` for cross-machine determinism.
6. **License = GPL-2.0 with CGAL linking exception** (COPYING verified). Per
   TOOLS/ rules: **use as an isolated CLI executable only**; never import/copy its
   code into production modules. Invoking the AppImage as an external process is fine.
7. **Best install path for this host**: self-contained AppImage (no root, works
   on Ubuntu 24.04, FUSE confirmed OK). Alternative apt path = Torsten Paul's OBS
   nightly repo (`openscad-nightly`, Qt6 build). conda-forge has **no** openscad.

---

## 1. Versions / releases

- **Stable = 2021.01** (released 2021-02-07; tag `openscad-2021.01`). Still tagged
  "Latest" on GitHub releases API — no newer stable tag exists.
  - Source: https://github.com/openscad/openscad/releases (API: only stable tags, newest 2021.01)
- **No stable release announcement after 2021.01** on the official news page
  (newest item = GSoC 2024, 2024-03-09).
  - Source: https://openscad.org/news.html
- **Dev snapshots / nightlies are the real current builds.** Daily, auto-built,
  at https://files.openscad.org/snapshots/ :
  - 2026 naming (dropped commit-hash suffix): `OpenSCAD-2026.08.13-x86_64.AppImage`,
    `OpenSCAD-2026.08.13-x86-64-Installer.exe`, `OpenSCAD-2026.08.13-WebAssembly-web.zip`, etc.
  - 2025 naming (had commit hash): `OpenSCAD-2025.08.29.ai26981-x86_64.AppImage`.
  - Latest as of 2026-08-14: **2026.08.13**. Snapshots exist continuously back to 2021.
  - Source: https://files.openscad.org/snapshots/ (fetched raw listing)
- **`--version` of the 2026.08.13 AppImage** (run locally): `OpenSCAD version 2026.08.13` / `--info` → `2026.08.13 (git 1ee676b0)`.
- Snapshot builds for Ubuntu 24.04 also published as a `.deb` (see §3).
- **No 2025/2026 release candidate** has been tagged (releases API shows no
  pre-release tags at all). No public ETA for a new stable `[UNVERIFIED — nothing found either way]`.

## 2. Geometry engines — CGAL vs Manifold

- **Manifold is now the default backend** in dev builds:
  - Mailing list, 2025-08-17 (Marius Kintel): "Manifold backend is now the default";
    `--backend=cgal` re-enables CGAL. "I fully expect people to discover new bugs."
    - Source: https://lists.openscad.org/empathy/thread/TMJEJCZINIJNYJX2YF7IDNBAPQY66KIF
  - `--help` of the 2026.08.13 binary: `--backend arg` = "'CGAL' (old/slow) or
    'Manifold' (new/fast) **[default]**".
  - Render stats confirm: without any flag, output header says
    "Top level object is a 3D object (**manifold**): Status: NoError".
- **Both engines compiled into the snapshot**: `--info` shows
  `CGAL version 6.1`, `Manifold version 3.5.1`, `OpenCSG 1.8.2`, `Clipper2 2.0.1`.
- **Boolean reliability — empirical test on this host** (`difference()` with two
  cubes sharing a coplanar face — the failure class relevant to
  STEP-reverse-engineered primitive emits):
  - Manifold (default): `manifold, NoError, Genus 0, 8 verts, 12 facets` — clean, EXIT 0.
  - CGAL (`--backend=cgal`): same geometry exported, EXIT 0, but stats showed
    `Volumes: 2` (Nef polyhedron split) — a known coplanar-face artifact.
  - Takeaway: **Manifold is the more robust default for coplanar/self-intersection
    tolerance**; CGAL remains as a compatibility fallback. The 2021.01 stable is
    **CGAL-only** (Manifold integration post-dates it).
- **Performance**: Manifold is "significantly faster" per the announcement; my
  tiny test models rendered in ~0.001–0.03 s on both backends (no meaningful
  perf delta at this scale — not a bottleneck for the eval).

## 3. Linux install options (Ubuntu 24.04 x86_64)

- **apt (Ubuntu 24.04 noble)**: `openscad` = **2021.01-6build4** (universe).
  - Source: https://packages.ubuntu.com/noble/openscad
- **AppImage (dev snapshot)** — the recommended route, self-contained, no root.
  Runs directly on this host (FUSE confirmed; `--appimage-extract` works without FUSE).
  - URL: `https://files.openscad.org/snapshots/OpenSCAD-2026.08.13-x86_64.AppImage` (84,470,264 bytes)
- **AppImage (stable)**: `https://files.openscad.org/OpenSCAD-2021.01-x86_64.AppImage` (40 MB, exists).
- **Flatpak stable**: `org.openscad.OpenSCAD` on Flathub = **2021.01** (verified via Flathub API).
  Nightly via a beta repo (exact flatpakrepo URL not captured) `[UNVERIFIED]`.
- **Snap**: `openscad-nightly` — version `0+git.04834adb1`, auto-built from source,
  latest/stable updated 2026-08-01. Also a stable `openscad` snap.
  - Source: https://snapcraft.io/openscad-nightly
- **conda-forge**: **NOT available.** `conda-forge/openscad-feedstock` does not
  exist on GitHub; Anaconda API returns `"openscad" could not be found`. Do not
  plan around conda.
- **OBS nightly apt repo (Torsten Paul `home:t-paul`, xUbuntu_24.04)** — real
  .deb for Ubuntu 24.04, package name **`openscad-nightly`**, version
  `20260813T231840.git1ee676b0.debian-0` (same git hash as the AppImage), built
  against **Qt6 + libpython3.12t64**.
  - Source: https://download.opensuse.org/repositories/home:/t-paul/xUbuntu_24.04/Packages

### Exact install commands that should work

**Option A — AppImage (recommended, self-contained, no root):**
```bash
wget -O OpenSCAD-nightly.AppImage https://files.openscad.org/snapshots/OpenSCAD-2026.08.13-x86_64.AppImage
chmod +x OpenSCAD-nightly.AppImage
./OpenSCAD-nightly.AppImage --version          # → "OpenSCAD version 2026.08.13"
# system-wide convenience (optional):
sudo mv OpenSCAD-nightly.AppImage /usr/local/bin/openscad-nightly
```

**Option B — OBS nightly apt repo (Qt6 .deb, root):**
```bash
sudo curl -fsSL https://download.opensuse.org/repositories/home:/t-paul/xUbuntu_24.04/Release.key \
  | sudo gpg --dearmor -o /usr/share/keyrings/openscad-nightly.gpg
echo 'deb [signed-by=/usr/share/keyrings/openscad-nightly.gpg] https://download.opensuse.org/repositories/home:/t-paul/xUbuntu_24.04/ ./' \
  | sudo tee /etc/apt/sources.list.d/openscad-nightly.list
sudo apt update
sudo apt install openscad-nightly              # binary is `openscad-nightly`
```

**Option C — stable apt (2021.01, CGAL-only — NOT recommended for Manifold):**
```bash
sudo apt install openscad
```

## 4. Headless CLI (verified on the 2026.08.13 binary)

- `openscad -o out.stl file.scad` → headless render+export. Extension sets format:
  **stl, off, wrl, amf, 3mf, csg, dxf, svg, pdf, png, echo, ast, term, nef3, nefdbg, param, pov**.
  Multiple `-o` allowed; `-o -` = stdout.
- `--export-format binstl|asciistl` → binary STL. Verified: binstl 116 KB vs ascii 675 KB.
- `--render` = full geometry eval for PNG; `--preview[=throwntogether]` = preview-mode PNG.
  CLI PNG defaults to preview (OpenCSG); add `--render` for full Manifold/CGAL.
- `--backend cgal|manifold` (manifold default — see §2).
- `-D var=val` — pre-define variables (repeatable; acts as constant; must be
  initialized in the main program if later reassigned). Verified working.
- `--hardwarnings` — stop on first warning (verified: "Current top level object
  is empty" → EXIT 1 with the flag).
- `-q/--quiet`, `--check-parameters`, `--check-parameter-ranges`, `-d deps`, `-m make`.
- **Exit codes (verified)**: **0** on successful export; **1** on parse error
  (`ERROR: Parser error: syntax error in file bad.scad, line 1`); **1** on a
  warning escalated by `--hardwarnings`. → usable as a CI gate.
- **PNG headless (verified)**: `QT_QPA_PLATFORM=offscreen openscad --render -o out.png
  --imgsize=640,480 --camera=tx,ty,tz,rx,ry,rz,dist --autocenter --viewall file.scad`.
  Also `--projection=ortho|perspective`, `--colorscheme`.
- **JSON output (verified)**: `--summary-file=-` → JSON with `cache`, `geometry`,
  `camera`, `time` (stats). No JSON is emitted for warnings/errors — for that use
  the **`.echo` export** (verified: `-o log.echo` captures `echo()` lines; per the
  manual it also captures error/warning text) or parse stderr.
- `--summary all|cache|time|camera|geometry|bounding-box|area`; `--info` prints build details.
- `--animate N` + `--animate_sharding s/n` for parallel frame rendering across cores/machines.
- `-O section/key=value` export settings (e.g. `export-pdf/paper-size=a4`; full list via `--help-export`).
- **Experimental feature flags** (`--enable ...`): `roof | input-driver-dbus |
  lazy-union | vertex-object-renderers-indexing | textmetrics | import-function |
  object-function | predictible-output | vector-swizzle | discretization-by-error |
  ai-features | python-engine` (`--enable all` = everything).
- Source (manual, partly stale on the backend default): https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment

## 5. Import / export formats

- **`import()` formats** (dev snapshot, manual): **STL (ascii+binary), OFF, OBJ,
  AMF (deprecated), 3MF** (3D); **DXF, PDF, SVG** (2D); **JSON** (dev snapshot —
  needs `--enable import-function`, dict access via `d["key"]`, verified).
  `surface()` reads PNG/TXT heightmaps. CSG via `include<>`.
  - Source: https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Importing_Geometry
  - Empirically verified on the 2026.08.13 binary: **STL import** (2332-triangle
    polyset, EXIT 0) and **SVG import** (12-triangle extrusion, EXIT 0) both work;
    **JSON import** worked only with `--enable import-function` (without it the
    dict fields resolve to `undef`).
- **STEP import/export: NOT supported in any build.** Not in the import list;
  issue **#3065 "Towards STEP importing" closed as `not_planned`** (2025-10-09);
  **#5180** "Assimp dep for import/export of glTF, Collada, STEP, PLY, X3D" still open.
  - Sources: https://github.com/openscad/openscad/issues/3065 , https://github.com/openscad/openscad/issues/5180
  - Consequence: **do not plan to hand STEP files to OpenSCAD.** The STEP→SCAD
    conversion must be done upstream (cad_reverse / OCC), emitting SCAD
    primitives/CSG or meshes.
- **`.scad` inclusion** is a language feature, not `import()`: `use <file.scad>`
  (module/function scope only) and `include <file.scad>` (full text include).
  Both verified working on the 2026.08.13 binary.
- **Export formats** (see §4): stl, off, wrl, amf, 3mf, csg, dxf, svg, pdf, png, echo, ast, term, nef3, nefdbg, param, pov.

## 6. SCAD language version

- **2021.01 already ships** the language core the eval needs: `assert()`, `let()`,
  `echo()`, function literals, exponent operator, list comprehensions (if/else,
  `each`, C-style `for`), type-testing functions (`is_num`, `is_list`, ...),
  `$preview`, `$vpf`, SVG stroke import, `linear_extrude` twist/scale.
  - Source: https://raw.githubusercontent.com/openscad/openscad/master/RELEASE_NOTES.md (2021.01 section)
- **Dev builds are backward compatible** — a 2021.01 script runs unchanged on the
  2026.08.13 snapshot (verified: 2021.01-era scripts render fine). New things are
  **opt-in experimental** and would NOT run on 2021.01 stable:
  - `roof()` module (chamfer-ish roof on 2D extrusions), `lazy-union`, `textmetrics`
    (text measurement functions), `vector-swizzle` (`v.x`), `import-function`,
    `object-function`, `predictible-output`, `discretization-by-error`,
    `python-engine` (Python 3.10 bundled in the AppImage; OBS deb uses system
    Python 3.12), `ai-features` (AI dock / tool calling — GSoC 2026 work).
  - Source: `--help`/`--enable` list + `--info` from the 2026.08.13 binary.
- **Gotchas for emitted scripts:**
  - `discretization-by-error` changes `$fa/$fs/$fn` circle/arc tessellation — do
    NOT enable it if you want stable facet counts; pin `$fa/$fs/$fn` explicitly.
  - `version()` on dev returns `[2026, 8, 13]` (verified via `echo(version())`).
  - The 2021.01 stable has **no Manifold**, so a script that relies on Manifold
    behavior (or `--enable` flags) must run on a dev snapshot.

## 7. License

- **GNU GPL version 2** (June 1991) **with a CGAL linking exception** (the COPYING
  header explicitly grants linking with CGAL).
  - Source: https://raw.githubusercontent.com/openscad/openscad/master/COPYING
- Per TOOLS/ rules: **GPL → isolate to a CLI executable.** The AppImage/.deb is a
  self-contained external program; invoking it from the pipeline is fine, but do
  not import or copy OpenSCAD source into production modules. Community libs like
  BOSL2 are BSD-2-Clause (see 02_examples_libraries.md).

## 8. Ecosystem status

- **Active development.** Latest commit on `master`: 2026-08-13
  (`Preserve 16-bit PNG depth precision in surface()…` #6949). Commit volume is
  steady; snapshot builds are generated daily.
  - Source: https://api.github.com/repos/openscad/openscad/commits
- **Release cadence**: stable releases are extremely infrequent (2021.01 was the
  last, 5.5 years ago); the actual distribution channel is daily snapshots. No
  stable ETA visible. Maintainer: Marius Kintel + community; GSoC participation
  2024 and 2026 (incl. an AI tool-calling project).
- **Packaging is live everywhere**: files.openscad.org snapshots (2026-08-13),
  OBS `home:t-paul` .deb (2026-08-13, git `1ee676b0`), snap `openscad-nightly`
  (2026-08-01), Flathub stable 2021.01.
- The official site is being modernized (the homepage now pushes a "Prototype:
  OpenSCAD Playground in your WebBrowser" and dev-snapshot WASM builds exist).

---

### Sources (fetched)
- https://openscad.org/ · https://openscad.org/downloads.html · https://openscad.org/news.html
- https://github.com/openscad/openscad/releases · https://api.github.com/repos/openscad/openscad/releases
- https://files.openscad.org/snapshots/ (raw listing, 2026.08.13 files)
- https://lists.openscad.org/empathy/thread/TMJEJCZINIJNYJX2YF7IDNBAPQY66KIF (Manifold default, 2025-08-17)
- https://packages.ubuntu.com/noble/openscad (2021.01-6build4)
- https://download.opensuse.org/repositories/home:/t-paul/xUbuntu_24.04/ (InRelease, Release.key, Packages → openscad-nightly 20260813T231840.git1ee676b0)
- https://snapcraft.io/openscad-nightly (0+git.04834adb1)
- https://flathub.org/api/v2/appstream/org.openscad.OpenSCAD (stable 2021.01)
- https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment
- https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Importing_Geometry
- https://raw.githubusercontent.com/openscad/openscad/master/RELEASE_NOTES.md
- https://raw.githubusercontent.com/openscad/openscad/master/COPYING (GPL-2.0 + CGAL exception)
- https://raw.githubusercontent.com/openscad/openscad/master/src/openscad.cc (--backend default)
- https://github.com/openscad/openscad/issues/3065 (STEP, closed not_planned) · #5180 (open)
- https://deepwiki.com/openscad/openscad/4-features (feature overview, experimental flags)
- Empirical: downloaded + ran `OpenSCAD-2026.08.13-x86_64.AppImage` (git 1ee676b0) on this host.
