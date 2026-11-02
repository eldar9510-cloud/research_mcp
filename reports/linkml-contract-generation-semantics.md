---
{
  "format": 1,
  "metadata": {
    "id": "linkml-contract-generation-semantics",
    "title": "LinkML schema and generated contract semantics",
    "question": "How can LinkML generate JSON Schema and Pydantic contracts without silently changing constraints?",
    "scope": "Historical source-only study of schema skeletons, enums, constraints, generator flags and version drift; no generator execution.",
    "summary": "Maps YAML constraints to generators and identifies extra-field, pattern and dynamic-enum drift risks.",
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
      "Official/tutorial/source URLs and raw relative source references; targets not opened.",
      "Internal ELECTRONICS parity-gate context remains.",
      "Source-era module/HANDOFF context and linked dependencies unavailable/uninspected.",
      "Facts, execution/benchmark claims and legal assertions not independently checked."
    ],
    "superseded_by": null,
    "created_at": "2026-11-01T23:32:13.518Z",
    "updated_at": "2026-11-01T23:32:13.518Z",
    "imported_at": "2026-11-01T20:39:00.214Z"
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
  "sourceDigest": "90cf8a5d04272fdcf6f4f2d315e641d8517a0d61eed4752f28a4c72daa347b3e",
  "proposalRevision": "49ef48da84fa899817ab746463e6b5c3a59cc19a76cef1525f82d517c2ad15d3"
}
---
# LinkML deep research — 2026-08-13

Deep-research note for `TOOLS/DATA_CONTRACTS/linkml_contracts` (Phase 1 of the module HANDOFF).
Everything below is copied/verified against the official sources listed per section.
No install, no `gen-*` runs — research only.

---

## 0. Source-name correction (important)

The task brief pointed at `https://github.com/linkml/linkml-modeling-tutorial` —
**that repo does not exist (HTTP 404)**. The real official tutorial repo is:

- **`https://github.com/linkml/linkml-tutorial`** (default branch `main`, MIT license, README describes the 9 tutorial sections, `uv`-based).

Key tutorial file: `src/linkml_tutorial/schema/linkml_tutorial.yaml`
(raw: `https://raw.githubusercontent.com/linkml/linkml-tutorial/main/src/linkml_tutorial/schema/linkml_tutorial.yaml`)

All other docs (`linkml.io`, `linkml/linkml`, `linkml/linkml-model`) resolve fine.

---

## 1. Minimal .yaml schema skeleton

### 1.1 The absolute minimal schema (from the official intro tutorial)

Source: `https://linkml.io/linkml/intro/tutorial01.html`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/docs/intro/tutorial01.md`)

```yaml
id: https://w3id.org/linkml/examples/personinfo
name: personinfo
prefixes:
  linkml: https://w3id.org/linkml/
  personinfo: https://w3id.org/linkml/examples/personinfo
imports:
  - linkml:types
default_range: string
default_prefix: personinfo

classes:
  Person:
    attributes:
      id:
      full_name:
      aliases:
      phone:
      age:
```

The tutorial notes all values are strings here — "even age; we will later return
to this example and show how we could model this more naturally as a number."

### 1.2 A known-valid complete schema (tutorial06 — has enum + constraints)

Source: `https://linkml.io/linkml/intro/tutorial06.html`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/examples/tutorial/tutorial06/personinfo.yaml`)

```yaml
id: https://w3id.org/linkml/examples/personinfo
name: personinfo
prefixes:
  linkml: https://w3id.org/linkml/
  schema: http://schema.org/
  personinfo: https://w3id.org/linkml/examples/personinfo/
  ORCID: https://orcid.org/
imports:
  - linkml:types
default_range: string

classes:
  Person:
    class_uri: schema:Person
    attributes:
      id:
        identifier: true
      full_name:
        required: true
        description:
          name of the person
        slot_uri: schema:name
      aliases:
        multivalued: true
        description:
          other names for the person
      phone:
        pattern: "^[\\d\\(\\)\\-]+$"
        slot_uri: schema:telephone
      age:
        range: integer
        minimum_value: 0
        maximum_value: 200
      status:
        description: >-
          vital status of the person
        range: PersonStatus       ## see "enums" section below
    id_prefixes:
      - ORCID
  Container:
    attributes:
      persons:
        multivalued: true
        inlined_as_list: true
        range: Person

enums:
  PersonStatus:
    permissible_values:
      ALIVE:
      DEAD:
      UNKNOWN:
```

This file is exercised by LinkML CI (`linkml-validate`), so it is a reliable
"known-valid" template. `proven/minimal_schema.yaml` is built from this one.

### 1.3 The linkml-model schema-spec "complete example"

Source: `https://linkml.io/linkml-model/docs/specification/03schemas.html`
(raw: `https://raw.githubusercontent.com/linkml/linkml-model/main/linkml_model/model/docs/specification/03schemas.md`, "Complete Schema Example (Informative)", lines 641-696)

```yaml
classes:
  Person:
    description: ...
    slots:
       - id
       - name
       - height
       - date_of_birth
       - occupation
       - knows
slots:
  id:
     identifier: true
     range: string
  name:
     range: string
  date_of_birth:
     range: date
  height:
     range: float
  occupation:
     range: JobCode
  knows:
     range: Person
     multivalued: true
enums:
  JobCode:
    permissible_values:
      ForkliftDriver:
      ...:
types:
  date:
    ...
```

### 1.4 Skeleton anatomy (which top-level keys mean what)

| Key | Purpose (from tutorial01 / schema spec) |
| --- | --- |
| `id` | Globally unique URI for the schema (required). |
| `name` | Short schema name; must be the last path segment of `id` by convention. |
| `prefixes` | CURIEs used in the schema; MUST include `linkml: https://w3id.org/linkml/` when you `imports: [linkml:types]`. |
| `default_prefix` | Namespace for generated element identifiers (recommended). |
| `imports` | Usually `- linkml:types` to pull in the built-in type schema. |
| `default_range` | Default slot range when a slot omits `range` (commonly `string`). |
| `classes` | `ClassDefinition` objects; slots may be listed under `slots:` (referencing top-level `slots:`) or defined inline as `attributes:`. |
| `slots` | Reusable `SlotDefinition` objects (with `range`, `required`, `pattern`, …). |
| `enums` | `EnumDefinition` objects — `permissible_values:` list. |
| `types` | Optional custom `TypeDefinition`s derived from built-ins. |

Note on the schema-spec default-types block (line 557-581): LinkML ships a
default type schema at `https://w3id.org/linkml/types.yaml`. Built-in range
names usable directly in `range:` — `boolean`, `date`, `datetime`, `decimal`,
`double`, `float`, `integer`, `string`, `time`, `uri`, `uriorcurie`, plus
`ncname`, `nodeidentifier`, `objectidentifier`. (Python target types in
parentheses: `str`, `int`, `float`, `bool`, `Decimal`, `datetime.date`,
`datetime.datetime`, `datetime.time`.)

---

## 2. Generator recipes (exact CLI)

### 2.1 `gen-json-schema`

Source: `https://linkml.io/linkml/generators/json-schema.html`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/docs/generators/json-schema.rst`)
and tutorial03: `https://linkml.io/linkml/intro/tutorial03.html`

Basic invocation (from docs):

```bash
gen-json-schema personinfo.yaml > personinfo.schema.json
```

Root-class control — tutorial03 (verbatim):

```bash
gen-json-schema personinfo.yaml --top-class Container > personinfo.schema.json
```

> "Unlike the `linkml-validate` command, the `gen-json-schema` command does not
> attempt to automatically infer which class in your schema to use for
> validation. You must either identify it in your schema by setting
> `tree_root: true` on one class or pass the `-t/--top-class` option to
> `gen-json-schema`."

Key flags (full table in docs):

| Option | Default | Notes |
| --- | --- | --- |
| `-i, --inline` | — | emit `$ref`s instead of inlining; `inlined: true` always inlines |
| `-t, --top-class <class>` | — | top-level class; its slots become top-level `properties` |
| `--closed / --not-closed` | closed | sets `additionalProperties=false` at global level |
| `--indent <n>` | `4` | `0` = compact single-line JSON |
| `--title-from name\|title` | `name` | source of JSON-Schema `title` |
| `--materialize-patterns / --no-materialize-patterns` | `True` | compile `structured_pattern` down to `pattern` keywords |
| `--preserve-names / --normalize-names` | normalize | keep original LinkML names in `$defs`/`properties`/`$ref` |
| `--metadata / --no-metadata` | `True` | include metadata |
| `-f, --format` | `json` | only `json` supported |

Python API:

```python
from linkml.generators.jsonschemagen import JsonSchemaGenerator
gen = JsonSchemaGenerator(
    schema="personinfo.yaml",
    materialize_patterns=True,
    top_class="Container",
    not_closed=True,
    indent=4,
    preserve_names=False,
    expand_subproperty_of=True,
)
json_schema = gen.serialize()
```

Determinism: `--indent` (default 4) pretty-prints; set `0` for compact.
`--preserve-names` stops name normalization. These two are the flags that
matter for reproducible output.

### 2.2 `gen-pydantic`

Source: `https://linkml.io/linkml/generators/pydantic.html`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/docs/generators/pydantic.rst`)
and current CLI source `packages/linkml/src/linkml/generators/pydanticgen/pydanticgen.py`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/packages/linkml/src/linkml/generators/pydanticgen/pydanticgen.py`)

```bash
gen-pydantic personinfo.yaml > personinfo_pydantic.py
```

**Pydantic v2 flag: there is NO `--pydantic-version` flag.** The generator is
Pydantic-v2-only (output shown in docs is v2 style — `Optional[str] = Field(None)`,
`Field(ge=0, le=999)`, `List[...]`, `str, Enum`). Confirmed in both the current
CLI source and the v1.4.0 source (no such flag existed there either). It requires
`pydantic >= 2.0.0, < 3.0.0`.

CLI options (current source, verbatim):

| Option | Default | Notes |
| --- | --- | --- |
| `--extra-fields allow\|ignore\|forbid` | `forbid` | how to handle extra fields in BaseModel — **default is `forbid`** |
| `--array-representations list\|numpydantic` | `["list"]` | array shapes for array slots |
| `--meta full\|except_children\|auto\|None` | `auto` | how much linkml metadata to embed (`linkml_meta` in `json_schema_extra`) |
| `--emptylist-for-multivalued-slots` | off | empty list default for optional multivalued slots instead of `None` |
| `--black` | off | run black on generated models (needs black installed) |
| `--template-dir <dir>` | — | override jinja templates (see 2.4) |
| `-V, --version` | — | prints linkml version |

### 2.3 `gen-doc`

Source: `https://linkml.io/linkml/generators/docgen.html`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/docs/generators/docgen.rst`)

```bash
gen-doc -d docs/ personinfo.yaml      # -d/--directory is REQUIRED
```

Writes one Markdown doc per class/enum/type/slot/subset/imported-schema plus an
`index.md`. Key flags:

| Option | Default |
| --- | --- |
| `-d, --directory` | **required** |
| `-f, --format markdown\|rst\|html\|latex` | `markdown` |
| `--diagram-type mermaid_class_diagram\|plantuml_class_diagram\|er_diagram` | mermaid |
| `--index-name` | `index` |
| `--example-directory <dir>` | — (embeds `<ClassName>-<ExampleName>.yaml` examples) |
| `--mergeimports / --no-mergeimports` | merge |
| `--hierarchical-class-view` | off |

### 2.4 Related tools seen in the tutorial (for completeness)

- `gen-project -d personinfo/ personinfo.yaml` — generate a whole project
  (tutorial08, `https://linkml.io/linkml/intro/tutorial08.html`).
- `linkml-validate -s personinfo.yaml data.yaml` — validate instances; by
  default wraps a jsonschema validator (tutorial03/06). Supports
  `--target-class Container` when the schema has no `tree_root`.
- `linkml-convert -s personinfo.yaml -t json data.yaml` — convert data between
  YAML/JSON/RDF (tutorial04/06).
- Template override names for `gen-pydantic --template-dir` (from docs):
  `attribute.py.jinja`, `base_model.py.jinja`, `class.py.jinja`,
  `conditional_import.py.jinja`, `enum.py.jinja`, `imports.py.jinja`,
  `module.py.jinja`, `validator.py.jinja`.

---

## 3. Enum semantics (`enum` + `permissible_values`)

### 3.1 YAML form

```yaml
enums:
  PersonStatus:
    permissible_values:
      ALIVE:
      DEAD:
      UNKNOWN:
```

Full metaslots of `EnumDefinition` (from schema spec §EnumDefinition, verbatim
subset): `name`, `is_a`, `mixins`, `rank`, `enum_uri`, `code_set`, `pv_formula`,
`permissible_values`, `include`, `minus`, `inherits`, `reachable_from`,
`matches`, `concepts`, `abstract`, `mixin`, `string_serialization`,
`id_prefixes`, `from_schema`.

`PermissibleValue` metaslots: `text`, `description`, `meaning` (URI/CURIE),
`alias`, `deprecated` (from the UML block in the spec).

### 3.2 Mapping to JSON Schema

Verbatim from `jsonschemagen.py::handle_enum`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/packages/linkml/src/linkml/generators/jsonschemagen.py`, lines 655-686):

```python
def handle_enum(self, enum: EnumDefinition) -> None:
    # TODO: this only works with explicitly permitted values. It will need to be extended to
    # support other pv_formula
    ...
    permissible_values_texts = list(map(extract_permissible_text, enum.permissible_values or []))
    enum_schema = JsonSchema(
        {
            "type": "string",
            "description": be(enum.description),
        }
    )
    ...
    if permissible_values_texts:
        enum_schema["enum"] = permissible_values_texts
    ...
    self.top_level_schema.add_def(enum.name, enum_schema)
```

So an enum becomes a `$defs` entry `{"type": "string", "enum": ["ALIVE", "DEAD", "UNKNOWN"]}`,
and a slot whose `range:` is that enum gets a `$ref` to it
(`jsonschemagen.py` lines 702-703: `elif slot.range in self.schemaview.all_enums().keys(): reference = slot.range`).
JSON-Schema-level: **closed `enum` array**.

### 3.3 Mapping to Pydantic

Verbatim from `enum.py.jinja`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/packages/linkml/src/linkml/generators/pydanticgen/templates/enum.py.jinja`):

```jinja
class {{ name }}(str{% if values %}, Enum{% endif %}):
    """
    {{ description }}
    """
    {% if values %}
    {% for pv in values.values() %}
    {{pv.label}} = "{{pv.value}}"
    ...
    {% endfor %}
```

So each `permissible_value` becomes an enum member whose **label is uppercased
and whose value is the exact permissible-value text** — e.g. `ALIVE = "ALIVE"`.
The enum class is `class PersonStatus(str, Enum)` — a **str-Enum** (closed set).

### 3.4 Closed vs open (default behavior)

- **Explicit `permissible_values` → closed.** Generated JSON Schema has an
  `enum` array; generated Pydantic is a `str, Enum`. Validation rejects any
  value outside the list. Tutorial06 demo (verbatim error):

  ```text
  [ERROR] [data.yaml/0] 'UNDEAD' is not one of ['ALIVE', 'DEAD', 'UNKNOWN'] in /persons/1/status
  ```

- **An enum with NO `permissible_values` (empty) → effectively open.** The
  generator's `if permissible_values_texts:` guard means no `enum` array is
  emitted (just `{"type": "string"}`); the Pydantic class is
  `class X(str): pass` (note the `{% if values %}, Enum{% endif %}` — no `Enum`
  base when empty). `handle_enum` has an explicit `# TODO: ... support other
  pv_formula` comment — `pv_formula`, `code_set`, `reachable_from`, `matches`,
  `concepts`, `include`, `minus`, `inherits` enum expressions are not
  materialized as closed lists by the JSON-Schema generator today.
- **`meaning:` affects RDF, not validation.** From the FAQ: without `meaning`
  the value serializes in RDF as `"ALIVE"^^xsd:string`; with `meaning` (any
  prefix) it serializes as an IRI. This does not change JSON-Schema/Pydantic
  validation.

### 3.5 Enum composition

From the FAQ (`https://linkml.io/linkml/faq/modeling.html`) — dynamic enum from
an ontology branch (open-ended by nature):

```yaml
enums:
  CellTypeEnum:
    reachable_from:
      source_ontology: obo:cl
      source_nodes:
        - CL:0000000
      include_self: false
      relationship_types:
        - rdfs:subClassOf
```

---

## 4. Slot constraints and their mapping

### 4.1 Slot metaslots that matter for contracts (schema spec §SlotDefinition, verbatim subset)

| Metaslot | Type | Meaning |
| --- | --- | --- |
| `required` | boolean | "true means that the slot must be present in the loaded definition" |
| `multivalued` | boolean | "true means that slot can have more than one value" |
| `range` | Element | "defines the type of the object of the slot" (a type, enum, or class) |
| `pattern` | string | regex the string value must conform to |
| `minimum_value` | Any | ordinal ranges: value ≥ this |
| `maximum_value` | Any | ordinal ranges: value ≤ this |
| `minimum_cardinality` | integer | min number of entries for a multivalued slot |
| `maximum_cardinality` | integer | max number of entries for a multivalued slot |
| `list_elements_unique` | boolean | no duplicates in a multivalued slot |
| `list_elements_ordered` | boolean | order of multivalued elements is guaranteed |
| `identifier` | boolean | key slot(s) uniquely identify the container |
| `inlined` / `inlined_as_list` | boolean | how class-valued slots embed the range instance |
| `ifabsent` | string | default-value function |

### 4.2 Mapping to JSON Schema keywords

Verbatim from `jsonschemagen.py`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/packages/linkml/src/linkml/generators/jsonschemagen.py`):

```python
constraints.add_keyword("pattern", slot.pattern)      # line 742
constraints.add_keyword("minimum", slot.minimum_value) # line 743
constraints.add_keyword("maximum", slot.maximum_value) # line 744
```

- `required: true` → the property is added to the class `required` array
  (`value_required` → `"required": [..]`, lines 260-264 & 617-622).
- `multivalued: true` → the property becomes `"type": "array"` with an item
  schema (`array_of`, lines 332-333, 783).
- `range` of a **type** → JSON-Schema `"type"` + optional `"format"`
  (`json_schema_types.get(schema_type.base.lower(), ("string", None))`, line 701).
- `range` of an **enum** → `$ref` to the enum `$defs` entry.
- `range` of a **class** → `$ref` to the class `$defs` entry (or inlined).
- `pattern` / `minimum` / `maximum` on the *range type* are also inherited
  (lines 734-744). `_base_implied_patterns` (line 54) adds fallback patterns
  for types like `date` when the type itself has no `pattern`.
- Class closedness: `additionalProperties` driven by `not_closed` (default
  closed → `additionalProperties: false`, lines 405, 457, 471).

So the generated JSON-Schema keywords are, one-for-one:
`required`, `type`, `format`, `pattern`, `minimum`, `maximum`, `minItems`/`maxItems`
(via cardinality, see below), `enum`, `$ref`, `additionalProperties`.

### 4.3 Mapping to Pydantic (v2)

Verbatim from `attribute.py.jinja`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/packages/linkml/src/linkml/generators/pydanticgen/templates/attribute.py.jinja`):

```jinja
{{name}}: {{ range }} = Field(default={{ field }}
{%- if alias %}, alias="{{alias}}"{% endif -%}
{%- if title != None %}, title="{{title}}"{% endif -%}
{%- if description %}, description="""{{description}}"""{% endif -%}
{%- if equals_number != None %}
    , le={{equals_number}}, ge={{equals_number}}
{%- else -%}
    {%- if minimum_value != None %}, ge={{minimum_value}}{% endif -%}
    {%- if maximum_value != None %}, le={{maximum_value}}{% endif -%}
{%- endif -%}
{%- if multivalued and exact_cardinality != None -%}
    , min_length={{exact_cardinality}}, max_length={{exact_cardinality}}
{%- elif multivalued -%}
    {%- if minimum_cardinality != None %}, min_length={{minimum_cardinality}}{% endif -%}
    {%- if maximum_cardinality != None %}, max_length={{maximum_cardinality}}{% endif -%}
{%- endif -%}
```

and from `validator.py.jinja`
(raw: `https://raw.githubusercontent.com/linkml/linkml/main/packages/linkml/src/linkml/generators/pydanticgen/templates/validator.py.jinja`):

```jinja
@field_validator('{{name}}')
def pattern_{{name}}(cls, v):
    pattern=re.compile(r"{{pattern}}")
    if isinstance(v, list):
        for element in v:
            if isinstance(element, str) and not pattern.match(element):
                err_msg = f"Invalid {{name}} format: {element}"
                raise ValueError(err_msg)
    elif isinstance(v, str) and not pattern.match(v):
        err_msg = f"Invalid {{name}} format: {v}"
        raise ValueError(err_msg)
    return v
```

Pydantic-v2 mapping table:

| LinkML | Pydantic v2 |
| --- | --- |
| `required: true` | non-`Optional` annotation, no default (required field) |
| optional slot | `Optional[T] = Field(None)` |
| `multivalued: true` | `Optional[List[T]] = Field(None)` |
| `minimum_value` | `Field(ge=...)` |
| `maximum_value` | `Field(le=...)` |
| `minimum_cardinality` | `Field(min_length=...)` |
| `maximum_cardinality` | `Field(max_length=...)` |
| `pattern` | `@field_validator` using `re.compile(...).match(...)` |
| enum range | `class X(str, Enum)` annotation |
| class range | forward-ref / `Optional[ClassName]` annotation |

Verbatim example generated model (from pydantic docs):

```python
class Person(NamedThing):
    """
    A person (alive, dead, undead, or fictional).
    """
    primary_email: Optional[str] = Field(None)
    birth_date: Optional[str] = Field(None)
    age_in_years: Optional[int] = Field(None, ge=0, le=999)
    gender: Optional[GenderType] = Field(None)
```

---

## 5. Version drift / API gotchas

1. **`gen-pydantic` has no `--pydantic-version` flag.** It is Pydantic-v2-only
   and pins `pydantic >= 2.0.0, < 3.0.0`. Verified in current source AND v1.4.0
   source. Do not pass `--pydantic-version`; it will error. (If you need v1
   output, that is a different/older ecosystem — not supported here.)

2. **`gen-pydantic` default `--extra-fields=forbid`** (current). Generated
   `BaseModel`s reject unknown fields by default. Historically this was
   `ignore`. For the ELECTRONICS parity gate: if the hand-written schema accepts
   extra fields, either add `allow`/`ignore` here or model `additionalProperties`
   via `--not-closed` in JSON-Schema. This is the #1 semantic-drift risk.

3. **`pattern` uses `re.match`, not `re.fullmatch`** in the generated pydantic
   validator (`if not pattern.match(v)`). A pattern like `^[\\d()\\-]+$` is
   fine, but a pattern *without* `^...$` anchors only checks a prefix. Match
   the JSON-Schema side (`pattern` in JSON-Schema is "search" semantics too),
   but be aware they are not `fullmatch`-equivalent to naive expectations.

4. **`gen-json-schema` needs a root.** Either `tree_root: true` on one class or
   `--top-class <Class>`/`-t <Class>`. Without it you get a schema whose
   properties come from no class. (tutorial03, verbatim quote in §2.1.)

5. **JSON-Schema enum defs are `{"type":"string","enum":[...]}` and loose
   metadata.** `handle_enum` notes `# TODO: this only works with explicitly
   permitted values ... support other pv_formula`. `pv_formula`, `code_set`,
   `reachable_from`, `matches`, `concepts` enums will NOT produce closed enum
   arrays in generated JSON-Schema today.

6. **`--indent` (default 4) + `--preserve-names` are the determinism flags** for
   `gen-json-schema`; default normalization lowercases/underscores names in
   output. Pin linkml and record the exact command in artifact headers (module
   guardrail) — output drifts between versions.

7. **Enum labels vs values.** Generated Pydantic enum member labels are
   uppercased (`ALIVE = "ALIVE"`); a permissible_value whose text differs from
   its label (e.g. `permissible_values: "forklift driver":`) yields
   `FORKLIFT_DRIVER = "forklift driver"`. Fine for validation; matters for any
   code that introspects enum member names.

8. **`jsonschema[format]>=4.26.0` is a hard dep** — the JSON-Schema validator
   used by `linkml-validate` needs the `format` extra, so `format:` keywords
   (`date-time`, etc.) are validated.

9. **`linkml-runtime` is CC0-1.0, `linkml` is Apache-2.0** — see §6. No
   copyleft; generated code inherits nothing.

---

## 6. Python requirements, dependency weight, license

### License
- `linkml` package: **Apache-2.0** (`license = "Apache-2.0"` in
  `packages/linkml/pyproject.toml`; PyPI `license_expression: Apache-2.0`).
- `linkml-runtime` package: **CC0-1.0** (`license = "CC0-1.0"`).
- Tutorial repo `linkml/linkml-tutorial`: **MIT**.
- The project README/CLAUDE.md currently says "CC0/BSD" — that is stale;
  correct answer is **Apache-2.0 (linkml) + CC0-1.0 (linkml-runtime)**.

### Python version
- `requires-python = ">=3.10"` (both packages; PyPI confirms `>=3.10`).
- `typing-extensions` needed only for Python < 3.12.

### Dependency weight
- `linkml` wheel itself is small: **483,751 bytes (~473 KB)** for
  `linkml-1.11.1-py3-none-any.whl`.
- But the dependency tree is **heavy** — full runtime deps (from
  `packages/linkml/pyproject.toml`):
  `antlr4-python3-runtime<4.10,>=4.9.0`, `click>=8.2`, `graphviz>=0.10.1`,
  `hbreader`, `isodate>=0.6.0`, `jinja2>=3.1.0`, `jsonasobj2<2.0.0,>=1.0.3`,
  `jsonschema[format]>=4.26.0`, `linkml-runtime>=1.10.0,<2.0.0`, `openpyxl`,
  `parse`, `prefixcommons>=0.1.7`, `prefixmaps>=0.2.2`,
  `pydantic>=2.0.0,<3.0.0`, `pyjsg>=0.12.3`, `pyshex>=0.9.0`,
  `pyshexc>=0.10.3`, `python-dateutil`, `pyyaml`, `rdflib>=7.6.0`,
  `requests>=2.22`, `sqlalchemy>=2.0.51`, `watchdog>=0.9.0`,
  `typing-extensions>=4.6.0; python_version<'3.12'`, `sphinx-click>=6.0.0`,
  `openapi-spec-validator>=0.8.4`.
- The **heavy hitters** for the shared `.venv`: `rdflib` (RDF), `sqlalchemy`
  (>=2.0.51), `openpyxl` (Excel), `pydantic`, `pyshex`/`pyshexc` (ShEx),
  `antlr4` parser. Expect a large installed tree (hundreds of MB once
  transitive deps are in). This is a "jedi-style" surprise risk the module
  CLAUDE.md already flagged (prefer an isolated env if the shared `.venv`
  bloat is a concern).
- Also present: `gen-*` entry points are defined via `[project.scripts]` — all
  generators ship with the one `linkml` install (full list includes
  `gen-json-schema`, `gen-pydantic`, `gen-doc`, `gen-project`, plus ~40 more).

### Version
- Current release: **linkml 1.11.1** (v1.11.1, published 2026-05-20). Pin this
  in Phase 0 and record it.

---

## Source URL index

| Section | Source |
| --- | --- |
| Homepage / generator list / Apache-2.0 | https://linkml.io/ |
| Minimal schema skeleton + CLI tools | https://linkml.io/linkml/intro/tutorial01.html · raw `docs/intro/tutorial01.md` |
| Constraints + `gen-json-schema --top-class` | https://linkml.io/linkml/intro/tutorial03.html · raw `docs/intro/tutorial03.md` |
| Enumerations (known-valid schema + validation error) | https://linkml.io/linkml/intro/tutorial06.html · raw `examples/tutorial/tutorial06/personinfo.yaml` |
| gen-doc | https://linkml.io/linkml/generators/docgen.html · raw `docs/generators/docgen.rst` |
| gen-pydantic (v2 output) | https://linkml.io/linkml/generators/pydantic.html · raw `docs/generators/pydantic.rst` |
| gen-json-schema flags | https://linkml.io/linkml/generators/json-schema.html · raw `docs/generators/json-schema.rst` |
| Schema spec (slots, enums, default types, complete example) | https://linkml.io/linkml-model/docs/specification/03schemas.html · raw `linkml_model/model/docs/specification/03schemas.md` |
| Validation spec (required/enum/pattern semantics) | raw `linkml_model/model/docs/specification/05validation.md` |
| JSON-Schema generator source (enum/constraint mapping) | raw `packages/linkml/src/linkml/generators/jsonschemagen.py` |
| Pydantic generator source + templates | raw `packages/linkml/src/linkml/generators/pydanticgen/pydanticgen.py`, `templates/attribute.py.jinja`, `templates/validator.py.jinja`, `templates/enum.py.jinja` |
| Enums vs strings FAQ / `meaning` RDF behavior / dynamic enums | https://linkml.io/linkml/faq/modeling.html · raw `docs/faq/modeling.md` |
| Official tutorial repo (NOTE: not `linkml-modeling-tutorial`) | https://github.com/linkml/linkml-tutorial · raw `src/linkml_tutorial/schema/linkml_tutorial.yaml` |
| pyproject (license, deps, python req) | raw `packages/linkml/pyproject.toml`, `packages/linkml_runtime/pyproject.toml` |
| Release/version | https://pypi.org/pypi/linkml/json · https://github.com/linkml/linkml/releases/tag/v1.11.1 |
