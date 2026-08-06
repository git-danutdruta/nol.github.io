# Contributing to NOL Math

Thank you for helping build a free, open-source math learning platform.

## How to Contribute Content

1. Fork the repository.
2. Create a new branch: `git checkout -b content/<subject>/<short-description>`.
3. Add or edit curriculum JSON files under `curriculum/`.
4. Validate your changes locally (see below).
5. Open a pull request using the content PR template.

## Content Structure

Curriculum is organized as:

```
curriculum/
  <subject-id>/
    subject.json
    chapters/
      <chapter-id>/
        chapter.json
```

See `docs/content/SCHEMA.md` for the full schema.

## Content Checklist

Before submitting a content PR, ensure:

- [ ] JSON is valid and formatted with Prettier.
- [ ] Files validate against `schemas/curriculum-v1.json`.
- [ ] Every lesson has at least one exercise.
- [ ] Every exercise has at least one hint.
- [ ] Math is written in valid LaTeX.
- [ ] Content is mathematically accurate.
- [ ] Language is appropriate for the target age group.
- [ ] No copyrighted material is included without permission.

## Running Validation

```bash
cd web
pnpm install
pnpm validate-content
pnpm validate-public-curriculum
```

## Code Contributions

For frontend or platform changes, open an issue first to discuss the approach. Follow the existing code style and ensure `pnpm lint`, `pnpm format:check`, and `pnpm test` pass.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

For curriculum and pedagogical content under `curriculum/`, contributors also agree to the content terms in `docs/legal/CONTENT_LICENSE.md` (CC BY-SA 4.0 for content assets).
