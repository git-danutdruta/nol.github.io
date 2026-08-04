# User Feedback and Bug Reporting (PROD-008)

## Goal

Provide low-friction issue reporting with enough context to reproduce bugs in a static, no-backend app.

## Entry points

- Lesson-level "Report a problem" action.
- Lesson-level "Report content error" action.
- Exercise-level quick report action prefilled with exercise id.
- Settings debug export to attach diagnostics manually.

## Routing rules

- Runtime/UI issues use `.github/ISSUE_TEMPLATE/bug_report.yml`.
- Curriculum correctness issues use `.github/ISSUE_TEMPLATE/content_error.yml`.
- Reports open GitHub issue forms in a new tab; no automatic submission.

## Prefilled context

- Current app URL.
- Browser info (user agent string).
- Lesson id.
- Optional exercise id when reporting from exercise row.

## Privacy constraints

- No auto-upload of logs.
- User decides whether to attach exported debug JSON.
- No PII is required in templates.

## Spam and quality controls

- Structured issue forms with required fields.
- Label routing (`bug`, `content`).
- Manual moderation by maintainers.

## Acceptance criteria mapping

- Report action opens GitHub issue form with context fields populated.
- Debug info can be attached manually from exported file.
- Content issues route to dedicated content template.
