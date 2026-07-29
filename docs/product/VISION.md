# Product Vision: NOL Math Learning PWA

## Vision Statement

Build a free, open-source, universally accessible math learning platform that takes learners from foundational arithmetic through advanced mathematics—one clear, interactive, and confidence-building step at a time.

## Mission

- Make high-quality math education available to anyone with a web browser.
- Teach problem-solving, not just facts, through worked examples, hints, scaffolds, and deliberate practice.
- Respect learner autonomy: progress is private, portable, and under user control.
- Build a sustainable, community-driven curriculum that improves through transparent contributions.

## Target Users

- Primary and secondary school students building fundamentals.
- Self-directed learners returning to math as adults.
- Teachers and parents looking for supplementary practice and explanations.
- Academic learners preparing for higher-level courses.

## Supported Math Domains (Phased)

1. **MVP (Phase 2):** Arithmetic and Algebra
2. **Phase 4:** Geometry with self-check grading
3. **Phase 6:** Calculus and Statistics
4. **Future:** Linear algebra, discrete math, and advanced topics based on community demand

## MVP Scope

- Static, installable PWA deployed to GitHub Pages.
- Arithmetic and algebra starter curricula.
- Rich lesson content: callouts, worked examples, interactive examples, math notation, and drawing prompts.
- Multi-mode drawing engine: freehand sketching and function graphing.
- Local progress persistence with explicit JSON export/import.
- Gamification, review, and spaced-repetition scaffolding.
- Accessibility foundation (WCAG 2.1 AA) and localization architecture.

## Success Metrics

- Lighthouse performance > 90, accessibility > 90, PWA installable.
- `pnpm build`, `pnpm test`, and `pnpm e2e` pass in CI.
- Every MVP lesson includes at least one pedagogical aid (tip, trick, mnemonic, or strategy).
- Every MVP exercise includes at least one hint.
- App is usable offline after first visit on supported browsers.

## Guiding Principles

- **Privacy first:** no analytics without consent, no cloud accounts required.
- **Offline capable:** content is static and cached locally.
- **Progressive enhancement:** core learning works without JavaScript; enhanced features layer on top.
- **Open contribution:** curriculum content is data-driven JSON in `public/curriculum/`.
- **Delightful restraint:** micro-interactions and polish support learning, never distract from it.

