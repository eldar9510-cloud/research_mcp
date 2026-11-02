---
{
  "format": 1,
  "metadata": {
    "id": "tia-portal-offline-development",
    "title": "TIA Portal offline development: standard versus safety code",
    "question": "What can be authored/versioned outside TIA, and how do SCL and safety F-LAD/F-FBD workflows differ?",
    "scope": "External SCL, VCI, Openness and editor workflows; vendor/certification assertions preserved as unchecked report claims.",
    "summary": "Compares exchange options and distinguishes standard/safety artifacts, workflow limits and validation needs.",
    "researched_at": "2026-07-21",
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
      "Safety-language/certification/hardware-test assertions not verified or professional assurance.",
      "Historical vendor/version constraints may not describe current products.",
      "Tickets #001/#003 and electronics/tia_portal source/safety paths uninspected.",
      "Public vendor/manual/community URLs unchecked.",
      "Internal workflow/file layout."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:32:05.271Z",
    "updated_at": "2026-11-01T23:32:05.271Z",
    "imported_at": "2026-11-01T20:39:00.113Z"
  },
  "warnings": [
    {
      "code": "unknown_origin",
      "message": "Original platform or author unknown; review attribution."
    },
    {
      "code": "unverified_import",
      "message": "Imported claims and publication rights have not been checked."
    }
  ],
  "sourceDigest": "87b8c8c966aa4e6738d6d1a245e1d902928c1c144d82e6f46a6f8f9bec88ea38",
  "proposalRevision": "a72f306333a84169a3384a57abec9a69d0adf096c4f217dc6e7ee6297181f857"
}
---
# TIA Portal Offline Development — Feasibility Report

**Date:** 2026-07-21
**Context:** Can we write TIA Portal PLC code outside TIA Portal and import later?
**Answer:** Yes — but it splits into two very different stories for standard vs. safety code.

---

## 1. The user's hint: "Structured Language"

"Structured Language" is Siemens' **SCL (Structured Control Language)** — IEC 61131-3 Structured Text (ST). SCL blocks can be exported as plain `.scl` text files, edited in any editor (VS Code, Notepad++, etc.), and re-imported into TIA Portal via:

1. Drag `.scl` file into "External Source Files" folder
2. Right-click → **"Generate blocks from source"**
3. Blocks compile and appear in Program Blocks

This is the simplest path and requires zero extra tooling.

---

## 2. Methods for external development (ranked by practicality)

### A. SCL External Source Files (simplest)

- Write `.scl` files in any text editor
- Import via TIA Portal GUI or Openness API
- **Limits:** Block numbers lost on import (reassigned), no multi-language comments, no ProDiag, no know-how protection
- **Best for:** Standard FB/FC/DB code, initial development, code reviews

### B. VCI — Version Control Interface (TIA V16+)

- Built into TIA Portal (Options → Settings → Version Control Interface)
- Exports project objects as text files into a workspace folder:
  - SCL blocks → `.scl` plain text
  - LAD blocks → `.s7dcl` (SIMATIC SD format) or XML (SimaticML)
  - FBD blocks → XML (SimaticML)
  - Safety DBs → XML
  - F-UDTs → `.udt`
- Full-fidelity round-trips: block numbers, multi-language comments, ProDiag preserved
- VS Code extension **TIA VCI Viewer** renders SimaticML as structured tables/diagrams
- **Limits:** Hardware config and F-CPU parameters NOT exported; need TIA Portal for import
- **Best for:** Git-based version control, team collaboration, full-fidelity exchange

### C. T-IA Connect for VS Code (closest to IDE)

- VS Code extension with live sync to TIA Portal
- Syntax highlighting, autocompletion, go-to-definition
- Ctrl+S in VS Code → auto-reimport into TIA Portal
- **Limits:** Requires a running TIA Portal instance as backend; commercial tool
- **Best for:** Daily development workflow with modern editor

### D. TIA Portal Openness API (automation)

- C#/.NET API for programmatic project manipulation
- Can import `.scl` files, create blocks, generate tag tables, compile
- Enables CI/CD pipelines, batch operations
- **Limits:** Requires license (Siemens 6AV6 671-2CA00-0AX0), Windows only, C# coding needed
- **Best for:** Automated build pipelines, AI-generated code import, batch migration

### E. Community tools

| Tool | Description |
|------|-------------|
| [TIA Portal MCP](https://github.com/bulaofen0036-coder/TIA_Portal_Openness_MCP) | MCP server driving TIA V20/V21, CLI gen from YAML/JSON |
| [RealPLC TIA Agent](https://cloud.tencent.com.cn/developer/article/2705392) | AI → SCL → import → compile → repair loop |
| [IQuest-Coder + Openness](https://post.smzdm.com/p/aggnmox6/) | Fully offline LLM pipeline, local and secure |
| [SimaticML Decoder](https://pypi.org/project/simaticml-decoder/) | Converts SimaticML XML → readable SCL |

---

## 3. The critical split: Standard vs. Safety code

### Standard Program (SCL works fine)

| What | Language | External dev? |
|------|----------|---------------|
| OB1 (main cyclic) | SCL/LAD/FBD | ✓ SCL |
| Standard FBs/FCs | SCL/LAD/FBD | ✓ SCL |
| Standard DBs | SCL/DB format | ✓ SCL or XML |
| PLC tag tables | — | ✓ Generate from CSV/Excel |
| HMI screens (KTP700) | WinCC | ✗ TIA Portal only |
| Technology objects | — | ✗ TIA Portal only |

### Safety Program (SCL NOT available)

| What | Language | External dev? |
|------|----------|---------------|
| F-CALL + F-FB/FC | **F-LAD or F-FBD only** | Can export as SimaticML XML, but not human-writable |
| Safety DBs | F-DB | Export as XML via VCI |
| F-UDTs | — | Export as `.udt` |
| Safety Administration | GUI wizard | ✗ TIA Portal only |
| F-monitoring times | GUI | ✗ TIA Portal only |
| F-CPU serial binding | GUI | ✗ TIA Portal only |

**Key finding:** The S7-1200F safety program is **restricted to F-LAD and F-FBD**. SCL is not permitted for safety blocks. This is a TÜV certification requirement, not a tool limitation. The safety runtime group (F-CALL → F-FB) cannot contain SCL code.

When exported via VCI, safety blocks in FBD come out as **SimaticML XML** — a dense, machine-generated XML format that represents graphical networks. While technically editable, it's not practical to author by hand (hundreds of XML elements per network, non-obvious UId references, graphical positioning data).

---

## 4. What CANNOT be done outside TIA Portal

These require the actual TIA Portal GUI (or are not exposed via any API):

| Item | Reason |
|------|--------|
| **Hardware configuration** (rack, modules, device tree) | Not exported by VCI; Openness API partial only |
| **PROFINET topology** (device names, IPs, port interconnects) | Requires TIA Portal device configuration editor |
| **Safety Administration** (F-parameters, F-monitoring times, F-CPU serial) | GUI wizard only |
| **Safety program compilation** | Requires TIA Portal + STEP 7 Safety Advanced |
| **Safety program download** | Requires TIA Portal + physical F-CPU connection |
| **Drive commissioning** (SINAMICS S210 wizard) | ~25-40 min/drive manual wizard, no API |
| **S7-1200 channel attributes** (diagnostics, wire-break, short-circuit) | Read-only via Openness API |
| **HMI screens** (KTP700 Basic panels) | WinCC engineering in TIA Portal |
| **Cross-reference / call hierarchy validation** | TIA Portal compiler only |

---

## 5. Issues and risks of external development

### Technical risks

1. **No off-line compiler:** SCL syntax errors are only caught when TIA Portal imports and compiles. No standalone type checker exists. You can write valid-IEC-61131-3 ST that fails TIA Portal's SCL parser (subtle dialect differences).

2. **Block number reassignment:** Plain `.scl` export loses block numbers (FB100 becomes "whatever the next free number is"). If blocks reference each other by number, this breaks. **Solution:** Use VCI (SimaticML) export, which preserves block numbers.

3. **Safety/standard interface mismatch:** The standard program calls safety blocks via specific interfaces. If you develop the standard program externally and the safety program in TIA Portal, you need to keep interface declarations in sync manually.

4. **Two-format mess:** Standard code lives as `.scl` files (nice). Safety code lives as SimaticML XML or SIMATIC SD (not nice). You're managing two very different source formats in the same project.

5. **No safety simulation:** Safety programs cannot be tested on PLCSIM — they need a physical F-CPU. This means even if you write standard code externally, the full integration test cycle needs hardware.

### Workflow risks

6. **TIA Portal version lock:** External source files are version-specific. V19 `.scl` may not import cleanly into V18. VCI workspace format changed between V16→V17→V18.

7. **Licensing cost:** STEP 7 Safety Advanced is a separate license. Openness API is another license. T-IA Connect is a third-party commercial tool. If you're buying TIA Portal, budget for the full stack.

8. **Single-user constraint:** Only one Openness API process can access a project at a time. CI pipeline would need exclusive access.

9. **Windows-only ecosystem:** All import/compilation toolchains require Windows + TIA Portal. No Linux option for the compile step. (SCL editing works anywhere.)

---

## 6. Recommended approach for this project

Given our constraints (no TIA Portal yet, developing on Linux, S7-1200F with safety):

### Phase 1 — Now (no TIA Portal)

```
Write standard program in SCL (.scl files)
├── OB1 organization block
├── Weighing logic (start-permit, load cell reading)
├── Floor arbitration (platform key mutex, floor selection)
├── Motor control sequence (normal lift cycle state machine)
├── Brake control modules (SBCplus interface)
├── HMI data interface blocks
├── Alarm/stack-light logic
└── Standard DBs (config parameters, cycle data)

Write safety specification (document, not code)
├── F-runtime group structure
├── Safety I/O mapping (F-DI, F-DQ, F-TM Count, IO-Link Safety)
├── Safety logic truth tables (STO chain, limit switches, door switches)
└── F-monitoring time calculations
```

SCL files go into `electronics/tia_portal/scl_sources/` — ready to import when TIA Portal is available.

### Phase 2 — When TIA Portal is available

1. Create hardware configuration (device tree, PROFINET, I/O modules)
2. Configure Safety Administration (F-parameters, F-CPU serial)
3. Import SCL standard program → compile
4. Author safety program in F-FBD (using the spec from Phase 1)
5. Download and test on physical S7-1200F

### File structure proposal

```
electronics/tia_portal/
├── scl_sources/           # Standard program — written now, import later
│   ├── ob1_main.scl
│   ├── fb_weighing.scl
│   ├── fb_floor_arbitration.scl
│   ├── fb_motor_sequence.scl
│   ├── fb_brake_control.scl
│   ├── fc_hmi_data.scl
│   ├── fc_alarms.scl
│   └── db_config.scl
├── safety/                # Safety spec (docs) — written now
│   ├── f_runtime_groups.md
│   ├── safety_io_map.md
│   └── safety_logic_tables.md
├── tags/                  # PLC tag tables (CSV → import)
│   └── plc_tags.csv
├── hmi/                   # HMI screens spec (docs) — TIA Portal only for actual screens
│   └── ktp700_screens.md
└── README.md              # Import procedure, version requirements
```

---

## 7. Bottom line

| Question | Answer |
|----------|--------|
| Can we write standard PLC code outside TIA Portal? | **Yes** — SCL `.scl` files, import later |
| Can we write safety code outside TIA Portal? | **No** — F-LAD/F-FBD only, SimaticML XML not hand-writable |
| Can we version-control TIA Portal code? | **Yes** — VCI exports to text formats, Git works |
| Can we automate import? | **Yes** — Openness API or community tools |
| What's the blocker for starting now? | **Nothing.** Standard SCL code can be written today. Safety code can be fully specified as documentation. Both are import-ready when TIA Portal arrives. |
| Can we test without hardware? | Standard program: PLCSIM (partial). Safety program: **No** — needs physical F-CPU. |

**Recommendation:** Start ticket #003 (Control Logic docs) immediately — it's the specification phase that feeds both the SCL standard program (Phase 1) and the safety program (Phase 2). Then start writing SCL source files under ticket #001 (TIA Portal scaffold) using external editor workflow.

---

## Sources

- [TIA Portal Openness API Manual (Siemens)](https://cache.industry.siemens.com/dl/files/886/109826886/att_1163875/v1/TIAPortalOpenness_enUS_en-US.pdf)
- [TIA Portal VCI Setup Guide (DMC)](https://www.dmcinfo.com/blog/18105/using-the-version-control-interface-vci-in-tia-portal-v16/)
- [SCL Version Control: ACT vs VCI](https://industrialmonitordirect.com/blogs/knowledgebase/scl-version-control-in-tia-portal-v18-act-limits-and-vci-setup)
- [T-IA Connect VS Code Extension](https://marketplace.visualstudio.com/items?itemName=FEELAUTOM.tia-connect-vscode)
- [TIA VCI Viewer VS Code Extension](https://marketplace.visualstudio.com/items?itemName=jb-automation.tia-vci-viewer)
- [TIA Portal MCP (GitHub)](https://github.com/bulaofen0036-coder/TIA_Portal_Openness_MCP)
- [S7 Distributed Safety — Programming Manual (Siemens)](https://cache.industry.siemens.com/dl/files/875/22099875/att_878859/v1/S7_distributed_safety_configuring_and_programming_en_US_en-US.pdf)
- [STEP 7 Safety Advanced V17](https://www.ued.co.uk/simatic-s7-step-7-safety-advanced-v17-floating-license-6es7833-1fa17-0ya5)
- [TIA Openness Advantages & Disadvantages (DMC)](https://www.dmcinfo.com/blog/21661/advantages-disadvantages-of-siemens-tia-openness/)
- [SimaticML Decoder (PyPI)](https://pypi.org/project/simaticml-decoder/)
- [TIA Portal Openness: Adding Hardware Programmatically](https://industrialmonitordirect.com/zh-hans/blogs/knowledgebase/tia-portal-openness-adding-hardware-programmatically-via-api)
