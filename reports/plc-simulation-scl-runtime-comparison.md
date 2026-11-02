---
{
  "format": 1,
  "metadata": {
    "id": "plc-simulation-scl-runtime-comparison",
    "title": "Open-source PLC simulation versus Siemens SCL validation",
    "question": "Which runtime/mock strategy can exercise SCL-like logic, and what vendor validation does it fail to supply?",
    "scope": "OpenPLC/GOPLC/AWLSim/Beremiz/PyLC comparison for testing outside TIA; not proof of exact Siemens SCL compilation or safety behavior.",
    "summary": "Separates standard ST runtimes from SCL and recommends Python mocks first, with dual-syntax and TIA-validation limits.",
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
      "Mocks/alternative ST runtimes do not validate TIA compilation or exact SCL semantics.",
      "Maturity, license and syntax-overlap claims unchecked.",
      "Research-input labels are not invented report authorship.",
      "Tickets #001A/#010a/#010, CONTROL_LOGIC.md and fb_weighing context uninspected.",
      "Only source-provided links retained; none fetched/repaired.",
      "Local ticket and control-logic workflow context.",
      "Source-stated research inputs: Gemini research, Claude web research; these do not establish report authorship or producing platform."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:31:56.021Z",
    "updated_at": "2026-11-01T23:31:56.021Z",
    "imported_at": "2026-11-01T20:39:00.005Z"
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
  "sourceDigest": "16824e790ffe15df6f0c4f2e17b62ebbb12cea8a7ccc193501548839134ac99e",
  "proposalRevision": "2896a972f23324ce53ec36d0e556c541e2af981420dff0d625f021614c225935"
}
---
# Open Source PLC Programming & Simulation — Comparative Study

> **Sources:** Gemini research + Claude web research, 2026-07-21.
> **Context:** Evaluating whether SCL code from ticket #001A can be simulated
> without TIA Portal/PLCSIM.

## Executive Summary

**No open-source tool directly runs Siemens SCL `.scl` files.** SCL is a proprietary
Siemens dialect of IEC 61131-3 ST. However, several tools can run standard IEC ST
that's close enough to be useful. The gap between SCL and standard ST is real but
bridgeable (~90% syntax overlap).

| Tool | SCL import? | Maturity | Best use case |
|------|-------------|----------|---------------|
| **GOPLC** | ❌ (standard ST) | ★★★★★ Industrial | Most promising runtime — single binary, full ST, Web IDE, MCP |
| AWLSim | ❌ (AWL/STL) | ★★★★ Mature | Siemens S7 CPU emulation at instruction level |
| OpenPLC v4 | ❌ (IEC ST) | ★★★★ Mature | Full PLC runtime with Python scripting |
| IronPLC | ❌ (IEC ST, early) | ★★ Immature | Browser playground only — trivial programs |
| SemaPLC | ❌ (via OpenPLC) | ★★★ Experimental | AI-driven IDE, needs Docker + LLM API key |
| PyLC/PyLC+ | ❌ (CODESYS ST) | ★★★ Niche | Translate ST → Python for pytest |
| Custom (#010a) | ✅ (our .scl) | N/A | Parse .scl interfaces, run state machines in Python |

## Detailed Findings

### 1. OpenPLC v4

Full IEC 61131-3 IDE + Runtime. Supports LD, FBD, ST, IL, SFC.
- **MATIEC compiler:** Translates IEC languages to C → binary
- **Python SubModule (PSM):** Inject values into process image registers
  (`psm.set_var("IX0.0", True)`). Can create digital twins.
- **Python Function Blocks:** Async Python processes communicating via shared
  memory (~100ms update). Only ONE instance per FB type allowed.
- **Limitation for us:** Standard IEC ST ≠ Siemens SCL. Would need manual
  translation (losing `#` locals, `{ S7_Optimized_Access }`, etc.)

### 2. AWLSim

Open source S7-300/400 compatible PLC emulator written in Python.
- Interprets AWL/STL (Statement List) and FBD (Function Block Diagram)
- Emulates Siemens CPU architecture (accumulators, I/Q/M/DB memory areas)
- Performance: ~1.6–2.9 million AWL instructions/sec (with Cython)
- Supports PyPy JIT for 10× speedup over CPython
- Pluggable hardware layer (pyprofibus, LinuxCNC)
- **Limitation for us:** Does NOT support SCL. Only AWL/STL and FBD.

### 3. Beremiz

Long-standing IEC 61131-3 IDE (Python/wxPython). Uses MATIEC compiler.
- Communication via Pyro (Python Remote Objects) with PYROSSL encryption
- Migrating to Python 3 + wxPython 4
- Improved OPC-UA client (async thread, funded by FDL 2025)
- SVGHMI: browser-based HMI via SVG + WebSocket + HTML5

### 4. PyLC / PyLC+

Translates PLC programs (FBD/ST from CODESYS) into Python classes.
- Generated Python respects IEC 61131-3 cyclic execution semantics
- Enables AI-based test generation (Pynguin framework)
- **Relevant pattern:** Could adapt this approach to parse our .scl files
  and generate equivalent Python classes for pytest-based verification

### 5. SimPyLC

Python-native control logic. Proprietary (qQuickLicence).
- 3D visualization via OpenGL
- C++ code generation for Arduino
- **Limitation for us:** Proprietary license, not Siemens-compatible

### Communication Libraries

| Library | Protocol | Target | Notes |
|---------|----------|--------|-------|
| python-snap7 v3.0 | S7Comm | S7-300/400/1200/1500 | Pure Python, no native deps |
| pyads | ADS | Beckhoff TwinCAT 2/3 | Device notifications (async) |
| pycomm3 | EtherNet/IP | Rockwell ControlLogix | Auto-discovers tags |
| cpppo | EtherNet/IP + Modbus/TCP | Generic CIP devices | Built-in CIP server emulator |
| asyncua | OPC UA | Any OPC UA server | Async, X.509 certs, subscriptions |

### SCADA

- **PyScada:** Django-based, Modbus/OPC-UA/BACnet/MQTT, Grafana integration
- **ScadaBR:** Java/Mango M2M, browser interface
- **RapidSCADA:** .NET/C#, Modbus + OPC-UA
- **OpenSCADA:** Java/Eclipse IoT, large-scale

## Security Considerations

- OpenPLC's default ports (Modbus 502, DNP3 20000, web interface) lack
  authentication/encryption
- EtherNet/IP simulators (cpppo port 44818) inherit CIP's lack of
  integrity checks — unauthenticated STOP CPU commands possible
- **Mitigation:** VLAN isolation, containerization (Docker/LXC), mTLS/OPC UA
  with X.509 certificates for any production-facing deployment

## GOPLC — The Most Promising Runtime

**GitHub:** [fixstuff/GOPLC-Showcase](https://github.com/fixstuff/GOPLC-Showcase)
**License:** Commercial (free tier available)
**Binary:** Single <60MB binary, Linux x86_64/ARM64, no Docker needed

### What it supports (relevant to us)
- **Full IEC 61131-3 Structured Text** parser — FUNCTION_BLOCK, FUNCTION, PROGRAM
- **VAR_INPUT / VAR_OUTPUT / VAR / VAR_GLOBAL** sections
- **Standard FBs:** TON, TOF, TP, CTU, CTD, CTUD, R_TRIG, F_TRIG, SR, RS, PID, PIDE
- **Multi-task scheduler** with priorities (1–255), microsecond scan times
- **Web IDE** with Monaco editor, live variable watch, online debugging
- **MCP server** with 80 tools — AI assistants can deploy, monitor, debug
- **Siemens S7 protocol driver** — can talk to real S7 PLCs
- **RETAIN variables**, hot reload, Boss/Minion clustering
- **2,248 built-in functions** including complete OSCAT library

### SCL → GOPLC ST syntax gap

| Feature | Siemens SCL | GOPLC ST | Compatible? |
|---------|-------------|----------|-------------|
| Block keyword | `FUNCTION_BLOCK "FB_Name"` | `FUNCTION_BLOCK FB_Name` | ⚠️ Quotes differ |
| Attribute block | `{ S7_Optimized_Access := 'TRUE' }` | Not needed | Remove line |
| VERSION | `VERSION : 0.1` | Not required | Remove line |
| VAR sections | `VAR_INPUT ... END_VAR` | Same | ✅ |
| Local vars | `#var_name` | `var_name` (no prefix) | ⚠️ Remove `#` |
| Assignment | `:=` | `:=` | ✅ |
| Semicolons | `;` | `;` | ✅ |
| IEC timers | `TON_TIME`, `#timer(IN:=..., PT:=...)` | `TON`, `timer(IN:=..., PT:=...)` | ⚠️ Type names differ |
| Instance DB call | `"DB_Name"(param:=val)` | `inst(param:=val)` | ✅ Concept same |
| DATA_BLOCK | Separate `.scl` file with `"FB_Name"` line | Not needed (auto-instance) | Remove |
| Comments | `(* *)`, `//` | Same | ✅ |
| ARRAY | `ARRAY[1..4] OF REAL` | Same | ✅ |
| STRING | `STRING[80]` | Same | ✅ |

**Bottom line:** ~90% syntax overlap. Adapting our `.scl` files for GOPLC means:
1. Remove line 2 (`{ S7_Optimized_Access }`) and line 3 (`VERSION`)
2. Remove quotes from block names (`"FB_Weighing"` → `FB_Weighing`)
3. Remove `#` prefix from local variables
4. Merge instance DBs into the FB file (GOPLC doesn't need separate instance DB files)
5. Change `TON_TIME` → `TON`, `%I0.0` → direct variable binding in Web IDE

### GOPLC verdict

**Best open-source PLC runtime available.** Could run our state machines with
~10% syntax adaptation. The S7 protocol driver means it can even talk to real
Siemens hardware later. Web IDE + MCP server is a bonus.

**However:** GOPLC is a separate runtime — it doesn't validate that our SCL
will compile in TIA Portal. It's a parallel execution path, not a TIA Portal
simulator. We'd maintain dual syntax (SCL for import, GOPLC ST for testing).

## IronPLC — Too Immature

**URL:** [playground.ironplc.com](https://playground.ironplc.com)
**License:** MIT

Browser-based IEC 61131-3 ST compiler. Open source, MIT license. But severely
limited as of 2026-06:
- Compiler only handles: PROGRAM, INT vars, assignment, `+` operator
- **Cannot compile:** ARRAY access, STRUCT access, FUNCTION_BLOCK with SFC,
  STRING pass-by-reference, direct I/O variables
- No FUNCTION_BLOCK with VAR_INPUT/VAR_OUTPUT sections
- No IEC timers (TON, TOF)
- No debugging or I/O mapping

**Verdict:** Not usable for our 173-parameter, timer-heavy state machines.

## SemaPLC — AI-Driven, Complex Setup

**GitHub:** [midea-ai/SemaPLC](https://github.com/midea-ai/SemaPLC)
**License:** MIT

Agent-driven IDE that generates ST from natural language, compiles via matiec,
deploys to OpenPLC Runtime v4 in Docker. 16 MCP tools. 542+224 tests.

**Verdict:** Interesting but wrong shape — needs Docker + LLM API key. Built for
natural-language→PLC, not for importing existing SCL codebases.

## Recommendation for Our Use Case

Three viable paths, ranked:

### Path 1: Python Mock PLC Backend (ticket #010a) — PRIMARY
Parse our `.scl` interface declarations → implement state machines from
CONTROL_LOGIC.md in Python → cyclic scan loop → pytest verification.
Same mock re-used later for virtual commissioning (#010).

**Pros:** Full control, reuses our existing Python toolchain, deep integration
with TDD verifier pattern. No syntax adaptation needed — Python directly
implements the state machine spec.

**Cons:** Not a real PLC runtime. Won't catch SCL-specific semantic errors.

### Path 2: GOPLC — EXPLORATORY
Adapt SCL syntax (~10% changes) → run on GOPLC runtime → validate with
Web IDE debugger. Provides a "real PLC" execution environment.

**Pros:** Fastest path to running logic on an actual IEC 61131-3 runtime.
Single binary, no Docker. MCP server means Claude can deploy and monitor.

**Cons:** Dual syntax maintenance (SCL for TIA Portal, adapted ST for GOPLC).
Commercial license for production. Doesn't validate TIA Portal import.

### Path 3: AWLSim — CROSS-VALIDATION
For S7-specific edge cases (accumulator behavior, memory layout). Low priority
— useful only after Path 1 or 2 is working.

**Recommended strategy:** Path 1 (Mock PLC) as primary, with a quick Path 2
experiment (try running fb_weighing on GOPLC in one session) to evaluate if
dual-syntax maintenance is worth the "real PLC runtime" benefit.
