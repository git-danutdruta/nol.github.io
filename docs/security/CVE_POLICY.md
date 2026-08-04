# CVE Policy (SEC-001)

This policy defines how the NOL Math project identifies, triages, and resolves known vulnerabilities in dependencies.

## Scope

- Frontend dependencies in `web/package.json`
- Build/test tooling dependencies used in CI and release pipelines
- Transitive dependencies pulled by package managers

## Security Principles

1. Keep the attack surface small by minimizing dependencies.
2. Patch fast, especially for exploitable issues in runtime dependencies.
3. Prefer deterministic and reviewable updates.
4. Block releases when critical risks are unresolved.

## Severity and Response Targets

Severity is taken from the advisory source (npm/GitHub advisory database/CVE source):

- Critical
  - Target fix: within 24 hours
  - Release blocking: yes
- High
  - Target fix: within 72 hours
  - Release blocking: yes
- Moderate
  - Target fix: within 14 days
  - Release blocking: case-by-case
- Low
  - Target fix: next routine dependency update cycle
  - Release blocking: no

## Triage Workflow

1. Detect
   - Run dependency audit checks in CI and manually before releases.
2. Validate
   - Confirm package, version range, and whether the vulnerable code path is used.
3. Prioritize
   - Classify by severity, exploitability, and runtime exposure.
4. Remediate
   - Upgrade to a non-vulnerable version.
   - If no patch exists, apply mitigations and track with an issue.
5. Verify
   - Re-run audit and test/build pipeline.
6. Record
   - Document the fix or temporary exception in the security issue/PR.

## Temporary Exceptions

A temporary exception may be accepted only when:

- No patched version is available, or
- Update breaks the app and a safe workaround is in progress.

Exception requirements:

- Security issue with rationale and mitigation
- Expiration date and owner
- Follow-up task linked to the next patch attempt

## CI Enforcement

- CI includes dependency audit checks.
- High and Critical findings are treated as blocking by default.
- Manual review is required for any exception.

## Local Commands

From `web/`:

```bash
pnpm audit --audit-level=high
```

Or from repo root:

```bash
cd web
pnpm audit --audit-level=high
```

## Disclosure

If you discover a vulnerability affecting NOL Math:

- Do not open a public exploit issue with sensitive details.
- Report privately to repository maintainers first.
- Include package name, affected version, advisory/CVE reference, and reproduction details.
