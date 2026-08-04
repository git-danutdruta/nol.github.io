# NOL Math Web

The frontend for NOL Math, a free, offline-capable math learning PWA.

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite
- Tailwind CSS
- React Router
- i18next + react-i18next
- Zustand
- Vitest + React Testing Library
- Playwright (E2E)
- ESLint + Prettier

## Getting Started

```bash
# From the repository root
cd web

# Install dependencies
pnpm install

# Start the development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run linting and formatting checks
pnpm lint
pnpm format:check

# Check bundle performance budgets (run after build)
pnpm check-budgets
```

## Performance Budgets

- A CI budget check runs after build and fails if bundle limits are exceeded.
- Current limits are defined in `scripts/check-budgets.cjs`:
  - largest JS chunk <= 700 KiB
  - initial JS payload (index/vendor/i18n/state chunks) <= 320 KiB

## Project Structure

```
web/
  src/
    components/   # Reusable UI components
    pages/        # Route-level page components
    routes/       # React Router route definitions
    i18n/         # i18n configuration and helpers
    lib/          # Utility functions
    hooks/        # Custom React hooks
    styles/       # Global styles and Tailwind entry
    a11y/         # Accessibility tests
    test/         # Test setup
  public/         # Static assets, curriculum JSON, locales
```

## Adding a Language

1. Create a new translation file at `public/locales/<lang>/translation.json`.
2. Add the language code to `supportedLngs` in `src/i18n/config.ts`.
3. Restart the dev server.

See `docs/frontend/I18N.md` for more details.
