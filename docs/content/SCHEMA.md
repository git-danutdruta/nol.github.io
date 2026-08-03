# NOL Curriculum Schema v1

This document defines the JSON schema for NOL Math curriculum content. All curriculum files must validate against `schemas/curriculum-v1.json`.

## File Structure

```
curriculum/
  <subject-id>/
    subject.json
    chapters/
      <chapter-id>/
        chapter.json
```

Each `chapter.json` contains the full chapter object with all lessons inline.

## Top-Level Object

A curriculum file is an object with a `subject` key:

```json
{
  "subject": {
    "id": "arithmetic",
    "title": "Arithmetic",
    "description": "Numbers and operations.",
    "chapters": []
  }
}
```

## Subject

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | URL-safe identifier |
| `title` | localized string | yes | Display title |
| `description` | localized string | yes | Short description |
| `chapters` | array of Chapter | yes | Ordered chapters |

## Chapter

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | URL-safe identifier |
| `title` | localized string | yes | Display title |
| `description` | localized string | no | Short description |
| `lessons` | array of Lesson | yes | Ordered lessons |

## Lesson

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | URL-safe identifier |
| `title` | localized string | yes | Display title |
| `objectives` | array of localized strings | no | Learning objectives |
| `pedagogy` | array of PedagogyBlock | no | Tips, tricks, mnemonics, strategies |
| `content` | array of ContentBlock | yes | Lesson body |
| `exercises` | array of Exercise | yes | Practice exercises |

## PedagogyBlock

```json
{
  "type": "tip",
  "title": "Carry the one",
  "content": "When a column sums to 10 or more, write the ones digit and carry the tens digit."
}
```

Types: `tip`, `trick`, `mnemonic`, `strategy`, `pitfall`, `why`.

## Pedagogy Library Files

Reusable pedagogy blocks can also be stored in `curriculum/pedagogy/*.json` so multiple lessons can share the same guidance.

```json
{
  "libraryId": "arithmetic-tips",
  "version": "1.0.0",
  "description": "Reusable pedagogy blocks for arithmetic lessons.",
  "blocks": [
    {
      "id": "arithmetic-arithmetic-number-sense-counting-place-value-place-value-columns",
      "type": "tip",
      "title": "Place value columns",
      "content": "From right to left: ones, tens, hundreds, thousands, ten-thousands.",
      "tags": ["arithmetic", "arithmetic-number-sense", "counting-place-value", "tip"]
    }
  ]
}
```

`blocks[*]` must be valid `PedagogyBlock` objects. Extra metadata fields such as `id`, `tags`, and `source` are allowed for search/discovery.

## ContentBlock

Types: `paragraph`, `heading`, `list`, `callout`, `example`, `math`, `image`, `drawing`.

### Math block

```json
{
  "type": "math",
  "latex": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
}
```

### Drawing block

```json
{
  "type": "drawing",
  "prompt": "Shade the fraction 3/4 on the area model.",
  "mode": "freehand"
}
```

## Exercise

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique within lesson |
| `type` | string | yes | `multiple-choice`, `numeric`, `free-response`, `expression`, `drawing` |
| `question` | localized string | yes | Exercise prompt |
| `hints` | array | no | Hints revealed progressively |
| `options` | array | yes for multiple-choice | Answer choices |
| `correctOptionIndex` | integer | yes for multiple-choice | Zero-based index |
| `answer` | string/number/array | yes for numeric/expression | Correct answer |
| `tolerance` | number | no | Allowed numeric tolerance |
| `validation` | string | no | `exact`, `numeric`, `expression`, `manual` |
| `maxAttempts` | integer | no | Default 3 |
| `solution` | localized string | no | Worked solution |
| `drawingMode` | string | yes for drawing | `freehand`, `graph`, `geometry` |

## Localized Strings

A localized string can be a plain string (default English) or an object:

```json
{
  "en": "Hello",
  "fr": "Bonjour"
}
```

## Validation

Run schema validation locally with:

```bash
cd web
pnpm validate-content
```

Or validate a single file:

```bash
node scripts/validate-curriculum.js ../curriculum/arithmetic/chapters/01-number-sense/chapter.json
```

Validation also checks `curriculum/pedagogy/*.json`, requires at least 20 reusable blocks for MVP, and verifies that every arithmetic/algebra lesson uses at least one block from the pedagogy library.

## Versioning

This is `curriculum-v1.json`. When breaking changes are needed, create `curriculum-v2.json` and a migration script in `scripts/migrations/`.

