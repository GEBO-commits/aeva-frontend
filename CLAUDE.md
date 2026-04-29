# CLAUDE.md

## Project

AEVA is an AI-powered event planner and booking system. The frontend already exists and must be preserved as much as possible while adding a Supabase backend incrementally.

Primary product rules:
- Users can begin planning before signup or login.
- Anonymous planning data must survive authentication.
- `Event` is the central business entity.
- `Booking` is downstream from `Event` and connects operational fulfillment such as venue, vendors, and payment.
- Do not redesign the product or invent new flows unless explicitly requested.

## Source of truth

Use these in order of priority:
1. Existing frontend behavior in this repository.
2. `aeva-backend-claude-dossier.md` in the repo root.
3. Existing AEVA architecture decisions already reflected in the code or documents.

If anything is ambiguous, preserve current frontend UX and call out the ambiguity instead of inventing behavior.

## Stack target

- Frontend: existing Vite + React app.
- Backend target: Supabase.
- Database: Supabase Postgres.
- Auth: Supabase Auth.
- Authorization: Row Level Security.
- Server-side privileged logic: Supabase Edge Functions when needed.

Do not introduce a custom Express, Nest, or microservice backend unless there is a strong documented reason.

## Non-negotiables

- Do not remove or bypass the `Event` entity.
- Do not keep business truth only in localStorage after backend integration begins.
- Do not add broad public write access to sensitive tables.
- Do not refactor unrelated UI code.
- Do not add new libraries unless there is a concrete need.
- Keep logic in service modules, not duplicated across pages/components.
- Keep changes incremental and reversible.

## Working style

For every task:
1. Read only the files needed for the task.
2. Summarize current behavior.
3. Propose a short implementation plan.
4. Implement only the requested scope.
5. End with:
   - files changed
   - manual test steps
   - assumptions made
   - risks or follow-up items

Do not continue into the next module automatically.

## Implementation order

Use this order unless explicitly overridden:
1. Repository audit.
2. Supabase scaffolding.
3. Core SQL migrations.
4. Row Level Security.
5. Anonymous planning persistence.
6. Auth and claim-session merge.
7. Catalog integration.
8. Guest and invitation persistence.
9. Booking foundation.
10. Payment integration.
11. AI orchestration persistence.

## Database rules

- SQL migrations are the schema source of truth.
- Use UUID primary keys.
- Add `created_at` and `updated_at` to mutable tables where appropriate.
- Prefer normalized relational design for core business entities.
- Use JSONB only for flexible payloads such as AI metadata, survey blobs, or provider payloads.
- Add indexes for frequent ownership and lookup patterns.

## Access rules

- Assume all business tables are private by default.
- Add explicit RLS policies.
- Public read access is allowed only for intentionally public catalog data.
- Anonymous planning must be implemented through controlled planning-session logic, not unsafe open table writes.
- Use Edge Functions for privileged or multi-step secure operations.

## Frontend integration rules

- Preserve current UX wherever possible.
- Replace localStorage gradually, one module at a time.
- Put backend access in service modules under `src/services` or equivalent.
- Avoid scattering Supabase calls throughout UI components.
- Keep current route structure intact unless a change is necessary.

## Prompt discipline

When given a task, stay inside the requested scope.
Examples:
- If asked for scaffolding, do not also implement auth.
- If asked for migrations, do not also refactor pages.
- If asked for booking, do not also redesign recommendation logic.

If requirements are unclear, ask or document the ambiguity. Do not guess.

## Branch and repo etiquette

- Never work directly on `main`.
- Work on a dedicated feature branch.
- Keep commits focused and descriptive.
- Do not merge anything automatically.
- Treat `main` as stable and deployable.

Recommended branch naming:
- `feature/supabase-scaffold`
- `feature/core-schema`
- `feature/anonymous-planning`
- `feature/auth-session-merge`
- `feature/catalog-integration`

## Recommended first task

Read `aeva-backend-claude-dossier.md` and perform the repository audit only. Do not edit files until the audit and rollout plan are complete.
