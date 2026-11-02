---
{
  "format": 1,
  "metadata": {
    "id": "scram-mef-xml-gates-probabilities",
    "title": "SCRAM Open-PSA MEF XML gates and probability semantics",
    "question": "How must SCRAM MEF XML define gates/events/probabilities, and what can validation miss?",
    "scope": "Historical0.16.2 schema/binary investigation of XML inputs and small probability templates; not safety/compliance or PFHd certification.",
    "summary": "Explains required structures and retains the distinction between schema validation and analysis-time checks.",
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
      "Local schema/source/example/test paths only; zero URL matches. Dependencies unopened; portable evidence unresolved.",
      "Internal installation/template paths and safety-chain context; no safety claim validated.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:33:03.407Z",
    "updated_at": "2026-11-01T23:33:03.407Z",
    "imported_at": "2026-11-01T20:39:01.296Z"
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
  "sourceDigest": "76ce92cf004096dd8ad0e54bf9fcc465ba2cdceeced7016cdd339f71118caa19",
  "proposalRevision": "2c994d95b507679f591ac321465597f2a3c109b971f7e6cc00abb429447a33e1"
}
---
# Phase 1 Research — SCRAM Open-PSA MEF XML input: gates & basic events with probabilities

Version: SCRAM 0.16.2 (Boost 1_85, libxml2 2.15.1). Binary:
`install/bin/scram` at scram_fault_trees root. Runtime schema == `src/share/input.rng`
(diffed against `install/share/scram/input.rng`: IDENTICAL — the schema IS enforced at
runtime, verified below).

Source-of-truth files (all under scram_fault_trees/):
- `src/share/input.rng` — RELAX NG schema (authoritative for required/optional attrs)
- `src/doc/input_file.rst`, `src/doc/opsa_support.rst` — format description + deviations
- `src/doc/fault_tree_analysis.rst` — top-event discovery, analysis kinds
- Examples: `src/input/SmallTree/SmallTree.xml`, `src/input/Aralia/baobab1.xml`,
  `src/input/HIPPS/HIPPS.xml`, `src/input/ThreeMotor/three_motor.xml`,
  `src/input/ThreeLevels/top.xml`, `src/doc/example/input.xml`,
  `src/tests/input/fta/correct_expressions.xml`

---

## 1. Root element & model container

Root must be `<opsa-mef>`. `name`, `label`, `attributes` on the root are OPTIONAL.
Children (zeroOrMore, in any order): `<model-data>`, `<define-event-tree>`,
`<define-alignment>`, `<define-rule>`, `<define-initiating-event>`,
`<define-fault-tree>`, `<define-substitution>`, `<define-CCF-group>`,
`<define-extern-library>`, `<define-extern-function>`.

Minimal skeleton (verbatim, pattern from `src/doc/example/input.xml` and
`src/input/ThreeLevels/top.xml`):

```xml
<?xml version="1.0"?>
<opsa-mef>
  <define-fault-tree name="TwoTrains">
    <define-gate name="TopEvent">
      <and>
        <event name="TrainOne"/>
        <event name="TrainTwo"/>
      </and>
    </define-gate>
    <define-basic-event name="ValveOne">
      <float value="0.5"/>
    </define-basic-event>
  </define-fault-tree>
</opsa-mef>
```

`<model-data>` is a separate container (schema `model-data`), children = house-event /
basic-event / parameter definitions only. Basic events may be defined either inside
`<define-fault-tree>` or inside `<model-data>`; both scopes are global. Verbatim from
`src/input/Aralia/baobab1.xml`:

```xml
<model-data>
<define-basic-event name="e1">
<float value="0.01"/>
</define-basic-event>
...
</model-data>
```

---

## 2. Names and references (exact regex from input.rng)

- `name` attribute (on define-* elements): NCName matching
  `[^\-.]+(-[^\-.]+)*` — no dots anywhere, no leading/trailing hyphens, no double
  hyphens. `my-event` OK, `my.event` INVALID, `my--event` INVALID.
- `reference` attribute (on `<gate>`, `<basic-event>`, `<house-event>`, `<event>`,
  `<parameter>`): name + optional dot-separated scoped path
  `([^\-.]+(-[^\-.]+)*)(\.\i[^\-.]*(-[^\-.]+)*)*`. `t.E1` (component scope) OK.
- Names and references are CASE-SENSITIVE. Whitespace is trimmed. Empty text in
  attributes/elements = error.
- Public names must be unique GLOBALLY; private names unique within their container.
  Redefinition of a name = error (`src/tests/input/fta/name_clash_two_trees.xml`,
  two `<define-fault-tree name="TwoTrains">` → redefinition failure).

---

## 3. `<define-fault-tree>` — required vs optional

| attribute/element | required | notes |
|---|---|---|
| `name` | REQUIRED | unique |
| `label` | optional | `<label>text</label>` |
| `attributes` | optional | see §8 |
| children | zeroOrMore of: define-CCF-group, **event-definition** (gate/house/basic), define-component, define-parameter | |

Multiple `<define-fault-tree>` elements are allowed (merged into one model). Verbatim
`src/input/ThreeLevels/top.xml` — three trees, cross-tree transfer via `<event>`:

```xml
<define-fault-tree name="First">
  <define-gate name="Top">
    <event name="Middle"/>  <!-- Transfer-In -->
  </define-gate>
</define-fault-tree>
<define-fault-tree name="Second">
  <define-gate name="Middle">  <!-- Transfer-Out -->
    <event name="Bottom"/>  <!-- Transfer-In -->
  </define-gate>
</define-fault-tree>
<define-fault-tree name="Third">
  <define-gate name="Bottom">  <!-- Transfer-In -->
    <or>
      <basic-event name="A"/>
      <basic-event name="B"/>
    </or>
  </define-gate>
  <define-basic-event name="A"><float value="0.1"/></define-basic-event>
  <define-basic-event name="B"><float value="0.2"/></define-basic-event>
</define-fault-tree>
```

`src/doc/fault_tree_analysis.rst`: "SCRAM automatically discovers top-events (graph
roots)". A top event = a gate not referenced by any other gate. If several roots exist,
each is analyzed as a top event. You do NOT declare a top event explicitly.

---

## 4. `<define-gate>` — formulas (the important part)

| attribute/element | required | notes |
|---|---|---|
| `name` | REQUIRED | |
| `role` | optional | `private` \| `public` (default public) |
| `label` | optional | |
| `attributes` | optional | |
| formula (exactly ONE) | REQUIRED | see below |

### Gate types / Boolean connectives (schema `formula`):

| element | arity | meaning |
|---|---|---|
| `<and>` | 1..n | AND |
| `<or>` | 1..n | OR |
| `<xor>` | exactly 2 | XOR |
| `<iff>` | exactly 2 | IFF (equivalence) |
| `<nand>` | 1..n | NAND |
| `<nor>` | 1..n | NOR |
| `<atleast min="k">` | 1..n | **VOTE k-of-n** — `min` attr REQUIRED, nonNegativeInteger |
| `<cardinality min="k" max="m">` | 1..n | between-k-and-m of n — both attrs REQUIRED |
| `<imply>` | exactly 2 | implication |
| single `<argument>` | 1 | pass-through / transfer (see NULL gate below) |

Each connective's children may be ONLY `argument` elements: `<event name="..."/>`,
`<gate name="..."/>`, `<house-event name="..."/>`, `<basic-event name="..."/>`,
`<not><event .../></not>`, or `<constant value="true|false"/>`.

**CRITICAL GOTCHA — no formula nesting.** A formula cannot contain another `<and>` /
`<or>` etc. as a child. `src/doc/opsa_support.rst` deviation: "Arbitrary nesting of
Boolean formulae is not allowed." Verified: `src/input/core/module_cut_off.xml` (an
`<and>` inside an `<or>`) fails:

```
scram::xml::ValidityError
File: src/input/core/module_cut_off.xml
Line: 25
Did not expect element and there
```

Flatten your tree: every Boolean structure needs its own `<define-gate>`.

**Duplicate arguments are an error** (schema + `src/doc/input_file.rst`). Verified with
a gate `or(basic-event A, basic-event A)`:

```
scram::mef::DuplicateElementError
File: dup.xml  Line: 7
MEF Element ID: A
MEF Element type: event
```

### AND/OR examples

Verbatim `src/input/HIPPS/HIPPS.xml` (OR + AND + VOTE):

```xml
<define-gate name="top">
  <or>
    <gate name="SensorFailure"/>
    <basic-event name="LogicSolverFailure"/>
    <gate name="W1NotIsolated"/>
    <gate name="W2NotIsolated"/>
  </or>
</define-gate>
<define-gate name="SensorFailure">
  <or>
    <basic-event name="PSHCCF"/>
    <gate name="PSHFailure"/>
  </or>
</define-gate>
<define-gate name="PSHFailure">
  <atleast min="2">
    <basic-event name="PSH1Failure"/>
    <basic-event name="PSH2Failure"/>
    <basic-event name="PSH3Failure"/>
  </atleast>
</define-gate>
```

Verbatim `src/input/SmallTree/SmallTree.xml` (AND):

```xml
<define-gate name="g1">
  <and>
    <basic-event name="e1"/>
    <basic-event name="e2"/>
  </and>
</define-gate>
```

### VOTE / k-of-n

Use `<atleast min="k">` with n children = k-of-n gate. `min` is a nonNegativeInteger.
Verified examples: `src/input/HIPPS/HIPPS.xml` `min="2"` (2oo3);
`src/input/Aralia/baobab1.xml` `min="3"` with 4 children (3oo4):

```xml
<define-gate name="g27">
<atleast min="3">
<gate name="g29"/>
<gate name="g28"/>
<gate name="g31"/>
<gate name="g30"/>
</atleast>
</define-gate>
```

`<cardinality min="..." max="...">` is the generalised between-k-and-m gate.

### "NULL" gate / transfer (pass-through)

There is **NO `<null>` element** in the SCRAM/MEF schema. The OpenFTA "null" /
transfer semantics map to a single-argument formula — a gate whose formula is one
`<event>`/`<gate>`/`<basic-event>` reference. Verbatim `src/input/ThreeLevels/top.xml`
(transfer-in):

```xml
<define-gate name="Top">
  <event name="Middle"/>  <!-- Transfer-In -->
</define-gate>
```

The `<event name="X"/>` element is a general (type-agnostic) reference; optional
`type` attribute ∈ `gate` | `basic-event` | `house-event` disambiguates when names
collide across kinds. `<gate name="X"/>`, `<basic-event name="X"/>`,
`<house-event name="X"/>` are the typed forms.

---

## 5. `<define-basic-event>` — probability & distributions

| attribute/element | required | notes |
|---|---|---|
| `name` | REQUIRED | |
| `role` | optional | `private` \| `public` |
| `label` | optional | |
| `attributes` | optional | e.g. flavor "undeveloped" |
| expression | **OPTIONAL** (schema) | needed for probability analysis |

**A basic event may have NO expression and still pass `--validate`.** It only fails at
`--probability` analysis time (verified): `scram::mef::ValidityError ... The basic
event does not have an expression.` (exit 1). So `--validate` = schema+topology check
ONLY; it does not check probability completeness.

### Constant probability

`<float value="..."/>` — value is an XMLSchema double, must be non-negative for
probabilities. Verbatim `src/doc/example/input.xml`:

```xml
<define-basic-event name="ValveOne">
  <float value="0.5"/>
</define-basic-event>
```

`<int>` and `<bool>` also exist as constants.

### Distribution / built-in expression types (verbatim from
`src/tests/input/fta/correct_expressions.xml` — this file exercises every expression):

```xml
<define-basic-event name="Exponential">
  <exponential>
    <float value="1"/>
    <system-mission-time/>
  </exponential>
</define-basic-event>
<define-basic-event name="FourArgumentExponential">
  <GLM>
    <float value="0.3"/>
    <float value="10"/>
    <float value="100"/>
    <system-mission-time/>
  </GLM>
</define-basic-event>
<define-basic-event name="Weibull">
  <Weibull>
    <float value="0.3"/>
    <float value="10"/>
    <float value="100"/>
    <system-mission-time/>
  </Weibull>
</define-basic-event>
<define-basic-event name="PeriodicTest4">
  <periodic-test>
    <float value="0.3"/>
    <float value="100"/>
    <float value="200"/>
    <system-mission-time/>
  </periodic-test>
</define-basic-event>
<define-basic-event name="UniformDeviate">
  <uniform-deviate>
    <float value="0"/>
    <float value="1"/>
  </uniform-deviate>
</define-basic-event>
<define-basic-event name="NormalDeviate">
  <normal-deviate>
    <float value="0.5"/>
    <float value="0.02"/>
  </normal-deviate>
</define-basic-event>
<define-basic-event name="LogNormalDeviate3">
  <lognormal-deviate>
    <float value="2e-3"/>
    <float value="2"/>
    <float value="0.95"/>
  </lognormal-deviate>
</define-basic-event>
<define-basic-event name="LogNormalDeviate2">
  <lognormal-deviate>
    <float value="-10"/>
    <float value="2"/>
  </lognormal-deviate>
</define-basic-event>
<define-basic-event name="GammaDeviate">
  <gamma-deviate>
    <float value="0.2"/>
    <float value="0.3"/>
  </gamma-deviate>
</define-basic-event>
<define-basic-event name="BetaDeviate">
  <beta-deviate>
    <float value="3"/>
    <float value="400"/>
  </beta-deviate>
</define-basic-event>
<define-basic-event name="Histogram">
  <histogram>
    <float value="0"/>
    <bin>
      <float value="0.1"/>
      <float value="2"/>
    </bin>
    <bin>
      <float value="0.3"/>
      <float value="4"/>
    </bin>
    <bin>
      <float value="0.5"/>
      <float value="1"/>
    </bin>
  </histogram>
</define-basic-event>
```

### Expression argument semantics (from `src/tests/expression_tests.cc`)

| element | # args | args (order) | formula (deterministic value) |
|---|---|---|---|
| `<float>` | 1 | value | constant |
| `<exponential>` | 2 | lambda, time | 1 − e^(−λ·t) |
| `<GLM>` | 4 | gamma, lambda, mu, time | (μ − (μ − γ·(λ+1))·e^(−(λ+1)·μ·t)) / μ |
| `<Weibull>` | 4 | alpha, beta, t0, time | 1 − e^(−((t−t0)/α)^β) |
| `<periodic-test>` | 4, 5, or 11 | lambda [,mu], tau, theta [,time...] | periodic-test unavailability |
| `<uniform-deviate>` | 2 | min, max | uniform deviate |
| `<normal-deviate>` | 2 | mean, stddev | normal deviate |
| `<lognormal-deviate>` | 2 or 3 | mean, error-factor [, prob] | lognormal deviate |
| `<gamma-deviate>` | 2 | shape, scale | gamma deviate |
| `<beta-deviate>` | 2 | alpha, beta | beta deviate |
| `<histogram>` | 1 + n×`<bin>` | time, then (prob,time) pairs | histogram deviate |

Note the arg-count traps from `src/tests/expression_tests.cc`: GLM is the
"four-argument exponential"; periodic-test accepts 4/5/11 args; lognormal takes 2 OR 3.
`<system-mission-time/>` = model mission time (default 8760 h in probability analysis).

### Flaged (flavored) events

`src/doc/fault_tree_analysis.rst` — SCRAM "abuses" the MEF attributes mechanism for
inessential info. Verbatim from `src/input/ThreeMotor/three_motor.xml`:

```xml
<define-basic-event name="T3">
  <label>Reset signal inadvertently applied or not removed...</label>
  <attributes><attribute name="flavor" value="undeveloped"/></attributes>
  <float value="2.000000e-002"/>
</define-basic-event>
```

`flavor=undeveloped` is the recognised pattern (a report-level flag, does not change
arithmetic).

---

## 6. House events

**Supported in MEF / SCRAM.** `src/doc/opsa_support.rst` lists "House events (Boolean
constant)" under the supported Fault Tree Layer.

| attribute/element | required | notes |
|---|---|---|
| `name` | REQUIRED | |
| `role` | optional | |
| `label` | optional | |
| `attributes` | optional | |
| `<constant value="true\|false"/>` | **OPTIONAL** | default false |

Defined either inside `<define-fault-tree>` or in `<model-data>`. Referenced in
formulas as `<house-event name="H"/>`. Verbatim `src/input/ThreeMotor/three_motor.xml`
(model-data scope):

```xml
<define-house-event name="KT2">
  <label>KT2 timer reset</label>
  <constant value="true"/>
</define-house-event>
```

Referenced in a gate (same file):

```xml
<define-gate name="E10">
  <and>
    <house-event name="KT1"/>
    <house-event name="KT3"/>
    <gate name="E12"/>
  </and>
</define-gate>
```

**Verified semantics:** a house event with `<constant value="true"/>` is substituted
TRUE during probability analysis — a top gate `or(house H=true, basic A)` yields
probability 1 with the report warning `The set is UNITY/Base.` (confirmed on
`correct_expressions.xml` and on a minimal template). With `<constant value="false"/>`
(or constant omitted) the house event contributes FALSE and drops out.

---

## 7. `<define-parameter>` (needed for exponential-style basic events)

| attribute/element | required |
|---|---|
| `name` | REQUIRED |
| `role` | optional |
| `unit` | optional ∈ bool, int, float, hours, hours-1, years, years-1, fit, demands |
| `label` | optional |
| `attributes` | optional |
| `expression` | **REQUIRED** (unlike basic events) |

Verbatim `src/input/SmallTree/SmallTree.xml` — exponential basic event driven by a
parameter, with a lognormal deviate on the parameter:

```xml
<define-basic-event name="e1">
  <exponential>
    <parameter name="lambda1"/>
    <system-mission-time/>
  </exponential>
</define-basic-event>
...
<define-parameter name="lambda1">
  <lognormal-deviate>
    <float value="2.0e-5"/>
    <float value="3"/>
    <float value="0.95"/>
  </lognormal-deviate>
</define-parameter>
```

A parameter may also alias another parameter: `<define-parameter name="lambda4">
<parameter name="lambda2"/></define-parameter>` (SmallTree). Parameters may be defined
before or after use.

---

## 8. Components, roles, labels, attributes

`<define-component name="c" role="private|public">` groups gates/events; referenced as
`<gate name="c.E1"/>`. Verbatim `src/input/ThreeMotor/three_motor.xml`:

```xml
<define-component name="t" role="private">
  <define-gate name="E1">  <!-- Transfer-Out -->
    ...
  </define-gate>
  ...
</define-component>
```

Labels: `<label>human readable text</label>` — must be a non-empty normalized string
(no newlines / control chars). Applies to opsa-mef root, define-fault-tree,
define-gate, define-basic-event, define-house-event, define-parameter,
define-component, etc.

Attributes: `<attributes><attribute name="NAME" value="VALUE" [type="..."]/></attributes>`
— attribute names must be unique (SCRAM deviation).

---

## 9. Required vs optional — summary table

| element | required attrs | optional attrs | required children |
|---|---|---|---|
| `opsa-mef` | — | name, label, attributes | ≥0 model containers |
| `define-fault-tree` | name | label, attributes | ≥0 event/CCF/component/parameter defs |
| `define-gate` | name | role, label, attributes | **exactly 1 formula** |
| `define-basic-event` | name | role, label, attributes | ≤1 expression (0 OK for validate) |
| `define-house-event` | name | role, label, attributes | ≤1 `<constant>` |
| `define-parameter` | name | role, unit, label, attributes | **exactly 1 expression** |
| `define-component` | name | role, label, attributes | ≥0 defs |
| formula connectives | `atleast`→min, `cardinality`→min+max | — | 1..n arguments (xor/iff/imply = 2) |

---

## 10. Gotchas checklist (verified against the 0.16.2 binary)

1. **No formula nesting.** `<and>`/`<or>`/etc. inside another connective → schema
   error. Flatten via intermediate `<define-gate>`s.
2. **Duplicate argument in one gate = error** (`DuplicateElementError`).
3. **`--validate` ≠ full check.** It does NOT require probabilities on basic events
   (passes), and does NOT catch "event not defined" — those are analysis-time errors.
   Always run `--probability` (or other analysis) on a real run.
4. **XML comments cannot contain `--`** (XML rule). `scram --validate` in a comment
   text breaks parsing. (Hit this while writing templates; rephrase as `-validate`.)
5. **Name regex is strict:** no dots in `name` (dots only in dotted `reference`
   paths); no leading/trailing/double hyphens. Case-sensitive.
6. **Names unique:** redefinition = error; two trees with same name = error.
   Multiple `<define-fault-tree>` in one file are merged (use distinct names).
7. **Top event auto-discovered** = root gate(s) not referenced elsewhere. Don't
   declare one.
8. **House event `<constant>` default is false**; `true` makes gates UNITY.
9. **`atleast` uses `min`, not `k`** — attribute name is literally `min`.
10. **Basic event expression optional at validate but mandatory for probability.**
11. **Values must be non-negative** for probabilities (validation checks).
12. **Exit codes:** `--validate` exit 0 = valid, 1 = any schema/validity error.
    Analysis exit 0 even when report carries warnings (e.g. unused events).
13. Basic events defined either in `<define-fault-tree>` or `<model-data>` — both
    global; mixing is fine (SmallTree uses both).

---

## 11. Template verification log (mandatory)

All templates in `research/candidates/`. Every one passes `scram --validate` with
exit 0, and `scram --probability` yields the expected number.

| template | validate | probability | expected vs actual |
|---|---|---|---|
| `minimal_or.xml` | exit 0 | `probability="0.28"` | 0.1+0.2−0.02 = 0.28 ✓ |
| `minimal_and.xml` | exit 0 | `probability="0.02"` | 0.1·0.2 = 0.02 ✓ |
| `minimal_vote.xml` | exit 0 | `probability="0.028"` | 2oo3, p=0.1: 3·p²(1−p)+p³ = 0.028 ✓ |
| `minimal_house.xml` | exit 0 | `probability="1"` `warning="The set is UNITY/Base."` | house true → UNITY ✓ |

Exact validate output for each (run from scram_fault_trees root):

```
$ ./install/bin/scram --validate research/candidates/minimal_or.xml
(no output)  ->  exit 0
```

Same empty-output / exit 0 for minimal_and.xml, minimal_vote.xml, minimal_house.xml.

Exact probability report line (minimal_or.xml):

```xml
<sum-of-products name="TOP" basic-events="2" products="2" probability="0.28" distribution="2">
```

---

## 12. Templates index (candidates/)

- `minimal_or.xml` — `<define-fault-tree>` with one `<define-gate name="TOP">` = `<or>`
  of 2 basic events (`A`=0.1, `B`=0.2). Probabilities via `<float value="..."/>`
  inside `<define-basic-event>`.
- `minimal_and.xml` — same but `<and>`.
- `minimal_vote.xml` — `<atleast min="2">` over 3 basic events (2oo3), all p=0.1.
- `minimal_house.xml` — `<define-house-event name="H"><constant value="true"/></define-house-event>`
  + `<or>` of `<house-event H>` and `<basic-event A>`; demonstrates UNITY behaviour.

For PFHd / safety-chain work (later phases): use `<float value="PFHd"/>` on basic
events for constant unavailability, or `<exponential>` + `<define-parameter>` when a
rate × mission-time model is wanted.
