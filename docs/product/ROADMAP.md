# Product Roadmap: NOL Math Learning PWA

## Phase 0 — Product Foundation

| Milestone | Ticket | Deliverable |
|-----------|--------|-------------|
| Vision, scope, non-goals | PROD-001 | `docs/product/VISION.md`, `ROADMAP.md`, `NON_GOALS.md` |
| Content schema & workflow | PROD-002 | `docs/product/CONTENT_SCHEMA.md`, `CONTRIBUTING.md` |
| Gamification & progress rules | PROD-003 | `docs/product/GAMIFICATION.md` |
| MVP & phased rollout | PROD-004 | `docs/product/PHASED_ROLLOUT.md` |
| Search, navigation, discovery | PROD-005 | `docs/product/NAVIGATION.md` |
| Onboarding, settings, FTUE | PROD-006 | `docs/product/ONBOARDING.md` |
| Legal, privacy, licensing | PROD-007 | `docs/legal/` |
| Feedback & bug reporting | PROD-008 | `docs/product/FEEDBACK.md` |
| Lesson pedagogy | PROD-009 | `docs/product/PEDAGOGY.md` |
| Exercise hints & scaffolding | PROD-010 | `docs/product/EXERCISE_FEEDBACK.md` |
| Review & mastery tracking | PROD-011 | `docs/product/MASTERY.md` |

## Phase 1 — Foundation & Architecture

| Milestone | Ticket | Deliverable |
|-----------|--------|-------------|
| Repository & Pages deploy | PLAT-001 | `.github/workflows/deploy.yml` |
| Scaffold web project | FE-001 | `web/` Vite + React + TypeScript project |
| App shell, routing, layout | FE-002 | `AppShell.tsx`, `Navigation.tsx`, routes |
| Localization | FE-003 | `i18n/config.ts`, translation files |
| Accessibility foundation | FE-004 | `SkipLink.tsx`, `FocusTrap.tsx`, axe tests |

## Phase 2 — Content & Curriculum

| Milestone | Ticket | Deliverable |
|-----------|--------|-------------|
| Arithmetic curriculum | CONTENT-001 | `public/curriculum/arithmetic.json` |
| Algebra curriculum | CONTENT-002 | `public/curriculum/algebra.json` |
| Pedagogical content library | CONTENT-006 | Tip/trick/mnemonic/strategy blocks |
| Lesson renderer & exercise engine | FE-005, FE-015 | `LessonRenderer.tsx`, `MathInput.tsx` |
| Rich lesson blocks | FE-019 | Callouts, worked examples, drawing prompts |
| Exercise hints UI | FE-005, PROD-010 | Hint reveal, adaptive feedback |
| Content validation pipeline | PROD-002 | CI validation script |

## Phase 3 — Drawing Engine

| Milestone | Ticket | Deliverable |
|-----------|--------|-------------|
| Unified drawing engine shell | FE-006 | `DrawingEngine.tsx` |
| Freehand sketching | FE-007 | Freehand mode plugin |
| Function graphing | FE-009 | Graphing mode plugin |
| Responsive drawing toolbar | FE-021 | `MobileToolbar.tsx` |
| Drawing persistence | FE-016 | Per-exercise drawing store |
| Geometric construction (deferred) | FE-008 | Post-MVP |
| 3D plotting (deferred) | FE-010 | Post-MVP |

## Phase 4 — Progress, Persistence, Gamification

| Milestone | Ticket | Deliverable |
|-----------|--------|-------------|
| Progress tracking & local persistence | FE-011 | `progressStore.ts` (IndexedDB) |
| JSON export/import | FE-012 | `exportImport.ts` |
| Data migration & schema versioning | PLAT-006 | Migration utilities |
| Gamification UI | FE-013 | Badges, streaks, celebrations |
| Review & spaced repetition UI | PROD-011, FE-011 | Mastery dashboard |

## Phase 5 — PWA, Platform & Polish

| Milestone | Ticket | Deliverable |
|-----------|--------|-------------|
| PWA manifest & service worker | PLAT-002 | `manifest.json`, `sw.js` |
| Offline content strategy | PLAT-005 | Quota management, cache rules |
| Service worker update flow | PLAT-007 | Update prompt |
| Testing, linting, CI gates | PLAT-003 | Vitest, Playwright, ESLint in CI |
| Observability & error reporting | PLAT-004 | Error boundary, basic logging |
| SEO, Open Graph, print styles | PLAT-008 | Meta tags, print CSS |
| Image/PDF export | FE-014 | Export utilities |
| Code splitting & perf budgets | FE-018 | Vite budgets |
| Micro-interactions | FE-020 | Animations, reduced-motion support |

## Phase 6 — Security & Content Expansion

| Milestone | Ticket | Deliverable |
|-----------|--------|-------------|
| Dependency security & CVE policy | SEC-001 | `docs/security/CVE_POLICY.md` |
| CSP & safe static deployment | SEC-002 | CSP headers, build checks |
| Geometry curriculum | CONTENT-003, FE-017 | Geometry lessons + self-check |
| Calculus curriculum | CONTENT-004 | Calculus lessons |
| Statistics curriculum | CONTENT-005 | Statistics lessons |

## Dependencies

- Phase 1 must complete before Phase 2.
- FE-001 must complete before FE-002, FE-003, FE-004.
- FE-002 must complete before FE-005, FE-006, FE-011, FE-013.
- CONTENT-001/002 and FE-005 must complete before FE-019.
- FE-006 must complete before FE-007, FE-008, FE-009, FE-010, FE-016, FE-021.
- FE-011 must complete before FE-012, FE-013, PROD-011 UI.
- PLAT-002 must complete before PLAT-005 and PLAT-007.

