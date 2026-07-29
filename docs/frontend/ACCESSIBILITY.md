# Accessibility

NOL Math aims to meet WCAG 2.1 AA.

## Foundations

- **Focus management:** All interactive elements have visible `:focus-visible` outlines.
- **Skip link:** `SkipLink` lets keyboard users jump to `#main-content`.
- **Focus trap:** `FocusTrap` keeps focus inside modals and mobile menus.
- **ARIA:** Navigation uses `aria-current`, `aria-expanded`, and `aria-label` appropriately.
- **Reduced motion:** Animations and transitions are disabled when `prefers-reduced-motion: reduce` is set.
- **Color contrast:** Default palette uses `primary-600` on white, which exceeds AA contrast.

## Testing

- `pnpm test` runs `src/a11y/axe.test.ts` using axe-core.
- Manual keyboard navigation should be verified on every new page or component.

## Canvas Drawing

The drawing engine is inherently inaccessible to some assistive technologies. Future work includes:

- Text alternatives for drawing prompts.
- Keyboard-friendly alternatives where possible.
- Descriptive labels for toolbar controls.

