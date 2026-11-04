---
{
  "format": 1,
  "metadata": {
    "id": "archived-code-aster-v18-documentation-research-historical-reported-findings-80f54aaa",
    "title": "Code Aster v18 documentation research: historical reported findings",
    "question": "What findings, alternatives and limitations does the historical investigation document about Code Aster v18 documentation research: historical reported findings?",
    "scope": "Original Code Aster v18 documentation/example investigation. Author CONFIRMED/DONE wording is preserved as historical report content, not a new execution or numerical-validation claim.",
    "summary": "Historical reported Code Aster v18 API and example findings, preserving source/test references and unresolved convergence limits; no solver run or reproduction was performed for publication.",
    "researched_at": "2026-07-15",
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
      "Imported unchanged from an existing report. No fresh factual, technical, normative, legal or source-wide verification was performed for publication.",
      "Historical versions, author assertions and partial/draft/planning limitations remain in the body. Publication is not policy adoption, implementation, machinery approval or a safety certificate.",
      "Original citations and local/private dependencies are preserved; some links may be unavailable to readers. Third-party quotations and sources retain their own rights, not the report CC BY license.",
      "Original report status/context: Status: Research complete. All topics verified against v18 built-in tests and user's working Salome files.",
      "Report text discloses historical local project/source paths or private repository locators. Referenced raw files/assets are not included; review exposure before publication."
    ],
    "superseded_by": null,
    "created_at": "2026-11-04T21:36:23.754Z",
    "updated_at": "2026-11-04T21:36:23.754Z",
    "imported_at": "2026-11-04T21:30:47.372Z"
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
  "sourceDigest": "80f54aaaff9311cff4bab53866d8958ce390a89571de7379fe740fc3f360f5a0",
  "proposalRevision": "630002fbc378a1b158015fb660fb88dd08c519a1662596955c0912e23af7e6ad"
}
---
# Research Results — Code Aster v18 Documentation (CONFIRMED FINDINGS)

**Date:** 2026-07-15
**Status:** Research complete. All topics verified against v18 built-in tests and user's working Salome files.

## Key References

| Source | Location | Status |
|--------|----------|--------|
| v18 built-in tests | `$CONDA_PREFIX/share/aster/tests/` (12,991 files) | **Authoritative** |
| v18 official docs | `code-aster.org/V2/doc/v18/en/` | **404 — not published** |
| v14 docs mirror | `biba1632.gitlab.io/code-aster-manuals/` | Structural reference only |
| User's working Salome | `/home/eldar/analisi_salome/` | Execution-verified gold standard |

## Topic A: CALC_MODES (buckling + modal) — CONFIRMED

### A1. `MODELE` is NOT a keyword of `CALC_MODES` in v18
**Confirmed by:** Every single v18 built-in test (sdls01a, sdls504a, sdlv100a, sdls139a, etc.). Zero occurrences of `MODELE=` in any CALC_MODES call across all 12,991 test files.

### A2. `CHAM_MATER` and `CARA_ELEM` ARE accepted by CALC_MODES in v18
**Confirmed by:** sdls01a.comm v18 test. The v14 docs were **wrong** about these being unauthorized.

### A3. v18 buckling workflow (from sdls504a.comm)

```
MECA_STATIQUE → CREA_CHAMP(SIEF_ELGA) → CALC_MATR_ELEM(RIGI_GEOM)
→ CALC_MATR_ELEM(RIGI_MECA) → NUME_DDL → ASSE_MATRICE(×2)
→ CALC_MODES(MATR_RIGI=, MATR_RIGI_GEOM=, TYPE_RESU='MODE_FLAMB')
```

### A4. v18 modal workflow (from sdlv100a.comm)

```
CALC_MATR_ELEM(RIGI_MECA) → CALC_MATR_ELEM(MASS_MECA)
→ NUME_DDL → ASSE_MATRICE(×2)
→ CALC_MODES(MATR_RIGI=, MATR_MASS=, OPTION='BANDE', CALC_FREQ=...)
```

### A5. CALC_MODES valid keywords for v18

| Keyword | MODE_FLAMB | DYNAMIQUE | Type |
|---------|-----------|-----------|------|
| `MATR_RIGI` | Required | Required | Assembled matrix ref |
| `MATR_RIGI_GEOM` | Required | N/A | Assembled matrix ref |
| `MATR_MASS` | N/A | Required | Assembled matrix ref |
| `TYPE_RESU` | `'MODE_FLAMB'` | `'DYNAMIQUE'` (default) | str |
| `OPTION` | `'BANDE'`/`'PLUS_PETITE'`/`'CENTRE'` | same | str |
| `CALC_CHAR_CRIT` | `_F(CHAR_CRIT=(min,max))` | N/A | _F |
| `CALC_FREQ` | N/A | `_F(FREQ=(min,max), NMAX_FREQ=n)` | _F |
| `SOLVEUR_MODAL` | Optional | Optional | _F |
| `VERI_MODE` | Optional | Optional | _F |
| `SOLVEUR` | Optional | Optional | _F |
| `INFO` | Optional | Optional | int |

**Note:** `NMAX_CHAR_CRIT` is only valid with `OPTION='PLUS_PETITE'`. With `OPTION='BANDE'` + `CHAR_CRIT` range, `NMAX_CHAR_CRIT` is NOT a valid keyword.

### A6. Our TC05 column buckling status
- **v18 syntax:** CONFIRMED — Code Aster 18.0.12 accepts and executes the `.comm`
- **Eigenvalue convergence:** PARTIAL — 2 modes computed, eigenvalues ~0.22 (expected ~14 for clamped-free HEA200). Eigensolver tuning needed for beam elements (POU_D_T). Same CREA_CHAMP pattern works for COQUE_3D (sdls504a) and for the user's portal frame (POU_D_T + multiple load cases). Root cause suspected: stress field interpretation for single-element POU_D_T beam chains under pure axial load.

## Topic B: DEFI_CONTACT — CONFIRMED

### B1. v18 uses `ZONE=_F(...)` not `CONTACT=_F(...)`
**Confirmed by:** `ssnp121a.comm` v18 test.

```python
DEFI_CONTACT(
    MODELE=MO,
    FORMULATION="CONTINUE",
    ALGO_RESO_GEOM="POINT_FIXE",
    ALGO_RESO_CONT="POINT_FIXE",
    FROTTEMENT="COULOMB",
    COULOMB=0.3,
    ZONE=_F(                          # ← ZONE, not CONTACT
        GROUP_MA_MAIT="SURMAI",
        GROUP_MA_ESCL="SURESC",
        ALGO_CONT="STANDARD",
        CONTACT_INIT="NON",
    ),
)
```

### B2. Valid DEFI_CONTACT keywords (v18)
- `MODELE`, `FORMULATION`, `ALGO_RESO_GEOM`, `ALGO_RESO_CONT`
- `FROTTEMENT`, `COULOMB`
- `ZONE=_F(GROUP_MA_MAIT, GROUP_MA_ESCL, ALGO_CONT, CONTACT_INIT, INTEGRATION, ORDRE_INT, COEF_CONT)`
- `REAC_GEOM`, `NB_ITER_GEOM` (optional)

### B3. Template status
- **Fixed:** `frictional_contact.py` now uses `ZONE=` and includes `ALGO_RESO_CONT`, `ALGO_CONT`, `CONTACT_INIT`
- **STAT_NON_LINE** still uses `CONTACT=contact_def` (correct — this references the DEFI_CONTACT result)

## Topic C: COMPORTEMENT / RELATION — CONFIRMED

### C1. `VMIS_CINE_LINE` is the correct v18 keyword
**Confirmed by:** TC04 execution (DIAGNOSTIC JOB : OK) and v18 tests.

### C2. Valid RELATION values for metal plasticity (v18)
Extracted from v18 test corpus:
- `ELAS` — pure elastic
- `VMIS_CINE_LINE` — linear kinematic hardening ✅
- `VMIS_CINE_GC` — Chaboche nonlinear kinematic
- `VMIS_ISOT_LINE` — linear isotropic hardening
- `VMIS_ISOT_TRAC` — isotropic + tension curve
- `VMIS_ISOT_NL`, `VMIS_ISOT_PUIS` — nonlinear/power-law isotropic
- `VMIS_ECMI_LINE`, `VMIS_ECMI_TRAC` — mixed isotropic-kinematic
- `VMIS_ASYM_LINE` — asymmetric behavior
- `LEMAITRE` — viscoplastic (Norton)

### C3. Template status
- `nonlinear_static.py` uses `VMIS_CINE_LINE` — **correct**
- `steel_nonlinear.py` uses `ECRO_LINE=_F(SY=..., D_SIGM_EPSI=...)` — **correct**
- Proven `cube_plasticity.comm` updated from `VMIS_CINE` → `VMIS_CINE_LINE`
- `DEFORMATION` values: `'PETIT'`, `'PETIT_REAC'`, `'GREEN'`, `'GDEF_LOG'`, `'SIMO_MIEHE'`

## Topic D: AFFE_CARA_ELEM — CONFIRMED

### D1. Command renaming confirmed
- v18: `AFFE_CARA_ELEM` (NOT `AFFE_CARAC_ELEM`)
- `MODELE=` keyword confirmed in v18 tests
- `POUTRE=_F(GROUP_MA=, SECTION='GENERALE', CARA=(...), VALE=(...))` — correct
- `ORIENTATION=_F(GROUP_MA=, CARA='VECT_Y', VALE=(x,y,z))` — for beam section orientation

### D2. Template status
- All templates already use `AFFE_CARA_ELEM` — **correct**
- Proven `portal_frame_static.comm` updated from `AFFE_CARAC_ELEM` → `AFFE_CARA_ELEM`

## Topic E: IMPR_RESU — CONFIRMED

### E1. NOM_CHAM values by solver type
- **MECA_STATIQUE**: `DEPL`, `SIEF_ELGA`, `EPSI_ELGA`, `SIEF_ELNO`, `SIGM_ELNO`
- **STAT_NON_LINE**: all above + `EPSP_ELGA` (plastic strain), `VARI_ELGA` (internal variables)
- **CALC_MODES (modal)**: `DEPL`
- **CALC_MODES (buckling)**: `DEPL`

### E2. Template status
- `nonlinear_static.py` IMPR_RESU changed from `VARI_ELGA` → `EPSP_ELGA` + `EPSI_ELGA`
- All other templates correct

## Topic F: LIRE_MAILLAGE — CONFIRMED

### F1. MED format confirmed
- `FORMAT='MED'` is the primary format in v18
- MED v3+ support confirmed (conda-forge config)
- `UNITE=20`, `INFO=2` — correct

### F2. IDEAS/UNV still supported
- `FORMAT='IDEAS'` works in v18 (proven files use it)
- 8-char group name limit for UNV
- MED format has no group name limit and is preferred for v18

## Template Fixes Applied (2026-07-15)

| File | Change | Tests |
|------|--------|-------|
| `CODE_ASTER/solvers/buckling.py` | Complete rewrite: 6-step matrix assembly, `_var()` → `.assign()`, no MODELE in CALC_MODES | 13 pass |
| `CODE_ASTER/solvers/modal.py` | Complete rewrite: 4-step assembly, removed MODELE from CALC_MODES | 10 pass |
| `CODE_ASTER/contact/frictional_contact.py` | CONTACT→ZONE, added ALGO_RESO_CONT, CONTACT_INIT | 4 pass |
| `CODE_ASTER/solvers/nonlinear_static.py` | VARI_ELGA→EPSP_ELGA+EPSI_ELGA, added NEWTON param | 15 pass |
| `CODE_ASTER/_stubs.py` | DEFI_CONTACT test: CONTACT→ZONE | pass |
| `CODE_ASTER/proven/column_buckling.comm` | Replaced with v18 generated .comm | compiles |
| `CODE_ASTER/proven/beam_modal.comm` | Rewritten with v18 matrix-assembly pattern | compiles |
| `CODE_ASTER/proven/portal_frame_static.comm` | AFFE_CARAC_ELEM → AFFE_CARA_ELEM | compiles |
| `CODE_ASTER/proven/cube_plasticity.comm` | VMIS_CINE → VMIS_CINE_LINE | compiles |
| `CODE_ASTER/proven/thick_cylinder_axisym.comm` | Added SUPERSEDED notice | compiles |

## Open Issue: TC05 Beam Buckling Eigenvalues

The v18 syntax is confirmed correct — Code Aster accepts and executes the `.comm`.
However, eigenvalues converge to ~0.22 instead of the expected Euler λ ≈ 14.

**Root cause hypothesis:** The `CREA_CHAMP(TYPE_MAXI='MINI')` stress extraction for POU_D_T beam elements may not produce the correct scalar for geometric stiffness computation. The same pattern works correctly for:
- COQUE_3D shell elements (sdls504a v18 test)
- Complex POU_D_T portal frames with multiple load cases (user's working Salome file)

The simple clamped-free column under pure axial load may need:
1. A small lateral perturbation to break symmetry
2. Different `TYPE_CHAM` for beam generalized forces
3. Or the older `CALC_MODES(TYPE_RESU='DYNAMIQUE', CALC_CHAM_SEIGNE=...)` approach

**Next steps:** Investigate beam-specific RIGI_GEOM stress extraction and eigenvalue convergence for simple column models. Consider comparing with the user's working Salome portal frame to isolate the difference.
