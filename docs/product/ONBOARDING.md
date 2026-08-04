# Onboarding, Settings, and First-Time Experience (PROD-006)

## Purpose

First-time learners need quick orientation to start learning confidently. This document defines onboarding, settings, and local-data communication rules for a static, privacy-first app.

## Product principles

- Keep first launch under 60-90 seconds to value.
- Explain local-only data and backup responsibility clearly.
- Provide easy re-entry points without forcing repeated walkthroughs.
- Make all critical actions reversible or explicitly confirmed.

## First-launch onboarding

### Trigger conditions

- Show onboarding on first visit when no dismissal flag exists.
- Do not show automatically again once completed or skipped.
- Always provide a manual replay action from settings.

### Onboarding steps (MVP)

1. Welcome and app value proposition.
2. Privacy and data model (local storage, no account required).
3. Backup guidance (export/import progress).
4. PWA install hint (browser-dependent).
5. Start learning CTA (continue to home or latest lesson if available).

### Completion state

- Persist `onboarding.completedAt` and `onboarding.version` in local state.
- If onboarding version changes in a major UX update, app may re-show once with "What's new" framing.

## Settings information architecture

### Required sections

- Appearance: theme preferences.
- Language: UI locale selection.
- Accessibility: reduced motion, contrast guidance, keyboard nav help link.
- Data management: export, import, reset progress.
- About: version, open-source links, contribution link.
- Diagnostics/support: captured error log and debug export.

### Data-management behaviors

- Export requires explicit user click and confirmation.
- Import requires file parse validation and overwrite confirmation.
- Reset requires a destructive-action confirmation step.

## Storage warning banner

### Goal

Warn users that progress is local-only and can be lost if browser data is cleared.

### Display rules

- Show persistent warning until one of the following:
  - user explicitly dismisses warning, or
  - user performs first successful progress export.
- Keep a "show again" toggle in settings for transparency.

### Warning content requirements

- State that data is local to this browser/device.
- Recommend periodic exports.
- Link to import/export controls.

## Replay and recoverability

- "Replay onboarding" action must be accessible from settings.
- Reset progress action must show explicit irreversible warning copy.
- After reset, show success feedback and offer import shortcut.

## Contribution discovery

- Settings includes "How to contribute content" link to repository contribution docs.
- Link target: `CONTRIBUTING.md` and curriculum contribution section.

## Accessibility requirements

- Onboarding can be fully completed with keyboard only.
- Dialogs/overlays trap focus and restore focus on close.
- Announce step changes via screen-reader-friendly headings/live region when needed.
- Confirmation dialogs use clear action labels (avoid ambiguous "Yes/No").

## Privacy constraints

- No onboarding analytics are required for MVP.
- No personal identifiers are collected.
- All state remains local unless user exports data manually.

## State contract (product-level)

Recommended keys (implementation can vary):

- `ux.onboarding.version`
- `ux.onboarding.completedAt`
- `ux.storageWarning.dismissedAt`
- `ux.storageWarning.suppressedAfterExport`

## Acceptance criteria mapping

- Onboarding appears once on first visit and can be replayed from settings.
- Settings page includes all required sections listed above.
- Storage warning remains visible until dismissed or first successful export.
- Reset progress requires explicit confirmation before data deletion.

## Ticket mapping

- `FE-002`: route/shell placement for onboarding entry points and settings access.
- `FE-012`: export/import behavior used by onboarding and storage-warning suppression.
- `web/src/pages/SettingsPage.tsx`: settings sections and replay/reset actions.
- `web/src/components/Onboarding.tsx`: first-launch flow.
- `web/src/components/StorageWarning.tsx`: persistent local-data warning.
