# MVP Scope and Phased Rollout (PROD-004)

## Why this exists

The vision spans all major math domains, but shipping everything at once would delay learner value and increase quality risk. This rollout defines a realistic MVP and clear post-MVP phases with explicit exit criteria.

## Delivery horizon

- MVP target: 8-10 sprints.
- One sprint is assumed to be 2 weeks.
- Exit criteria must be met before advancing to the next phase.

## Phase 1 - MVP (Arithmetic + Algebra)

### Included scope

- Curriculum: `CONTENT-001` (arithmetic), `CONTENT-002` (algebra), `CONTENT-006` (pedagogy blocks for MVP subjects).
- Learning flow: lesson renderer, exercises, math input, hints, and rich pedagogy blocks.
- Drawing: freehand + graphing only.
- Product: single-language shipping baseline with settings and core navigation.
- Progress: local persistence, review basics, and export/import.
- Platform: installable PWA, offline baseline, CI gates, observability, SEO/print, CSP.

### Explicitly deferred from MVP

- Geometric construction tooling.
- 3D plotting.
- Full curriculum localization.
- Advanced gamification mechanics beyond deterministic baseline.

### Exit criteria

- Arithmetic and algebra lessons are complete, validated, and navigable.
- PWA is installable and supports offline use after first load on supported browsers.
- Progress persistence, import/export, and migration pass automated checks.
- Performance, accessibility, and security quality gates pass in CI.
- At least one hint and one pedagogy aid exists in each MVP lesson.

## Phase 2 - Geometry Expansion

### Included scope

- Curriculum: `CONTENT-003`.
- Features: geometry self-check and geometric construction tooling.

### Exit criteria

- Geometry lessons ship with self-check exercises.
- Construction interactions are stable on desktop and touch.
- Drawing persistence supports geometry workflows without data loss.

## Phase 3 - Calculus + 3D Plotting

### Included scope

- Curriculum: `CONTENT-004`.
- Features: 3D plotting and calculus-focused interactive examples.

### Exit criteria

- Calculus lessons ship with validated content and graph interactions.
- 3D plotting is lazy-loaded and meets performance budget constraints.
- Accessibility and reduced-motion behavior remain compliant.

## Phase 4 - Statistics + Localization + Advanced Gamification

### Included scope

- Curriculum: `CONTENT-005`.
- Features: expanded localization, advanced mastery/review surfaces, and extended gamification loops.

### Exit criteria

- Statistics curriculum is complete and validated.
- Localized UI and core lesson metadata are available for target languages.
- Advanced gamification and mastery views are documented, testable, and measurable.

## Content ticket phase tags

- Phase 1 (MVP): `CONTENT-001`, `CONTENT-002`, `CONTENT-006`
- Phase 2: `CONTENT-003`
- Phase 3: `CONTENT-004`
- Phase 4: `CONTENT-005`

## Change control rules

- New MVP-scope requests require documenting a trade-off against time, quality, or deferred scope.
- Any phase move for a ticket requires updating this file and `docs/product/ROADMAP.md` in the same PR.
- If a phase exit criterion fails, the release is blocked until mitigated or explicitly deferred with risk sign-off.
