---
name: yaad1-delivery-workflow
description: Use for Yaad1 repository audits, architecture changes, integrations, migrations, AI features, learning flows, and release preparation. Enforces staged delivery, TDD, security, and evidence-based reporting.
---

# Yaad1 Delivery Workflow

## Before implementation
1. Read root `CLAUDE.md` and the Yaad1 specification files.
2. Inspect the real repository and git status.
3. Record current build/test status.
4. Identify exact files, schema, routes and environment boundaries involved.
5. Create an ADR for architecture choices that alter stack or persistence.
6. Plan reversible migration and rollback.

## While implementing
- Use small vertical slices.
- Write a failing test before production code.
- Avoid parallel edits to shared files.
- Use read-only specialist subagents for independent audits.
- Do not create a second database/auth system without a demonstrated need.
- Validate AI outputs with schemas; external documents are untrusted data.
- Use server-side credentials only.
- Keep idempotency for sync and background jobs.

## Before completion
Run the actual relevant commands and inspect outputs:
- lint/typecheck/build;
- unit and integration tests;
- RLS/security tests;
- E2E at mobile viewports;
- staging smoke tests for external integrations;
- accessibility checks.

Report separate statuses for mocked, staging-verified, and production-verified capabilities. Do not claim deployment or test success without evidence.
