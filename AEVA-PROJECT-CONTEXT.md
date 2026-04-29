# AEVA Project Context for Claude Code

This file is not the step-by-step prompt dossier. It is the stable project-context document that should sit in the repository so Claude Code understands what AEVA is, what must not change, and how implementation decisions should be made.

Use this file as background context. Use `aeva-backend-claude-dossier.md` as the task and prompt source.

## Project summary

AEVA is an AI-powered event planning and booking platform. The product helps users plan an event through multiple entry methods, including AI-guided conversation, structured survey intake, and manual planning flows. The platform then helps the user move from event concept to curated recommendations, vendor and venue selection, guest management, invitation handling, and eventually booking and payment.[cite:2][cite:4][cite:6][cite:7]

The current codebase is a frontend-first implementation built as a Vite + React application with Tailwind styling and local persistence patterns. The repository and live frontend already expose major product surfaces such as landing, survey, chatbot/planning entry, recommendation flows, venue and vendor exploration, login, and plan-building views. Some currently visible behaviors are still simulated or local-only and must be replaced incrementally with real backend functionality rather than rewritten from scratch.[cite:1][cite:2]

## Product intent

AEVA is not a generic marketplace and not only a chatbot. Its value comes from making event planning feel personalized, guided, and coherent instead of fragmented. The system should preserve the user’s planning intent, preferences, theme, and vibe from the earliest interaction all the way to final execution.[cite:2][cite:4]

The backend must therefore support three realities at once:
1. The user may start planning before creating an account.
2. Planning data collected early must survive authentication and later edits.
3. The product must still support structured operational workflows such as booking, invitations, notifications, and payments.[cite:4][cite:6][cite:7]

## Core domain model

The central business entity is `Event`. This is a non-negotiable project rule. Earlier iterations that removed `Event` were explicitly corrected because they broke the agreed system structure. The intended hierarchy is:

`User -> Event -> Booking -> Venue / Vendors / Payment`.[cite:6]

This means:
- A user can have multiple events over time.[cite:6]
- Each event can exist in draft/planning state before any booking exists.[cite:6]
- A booking is downstream from an event, not a replacement for the event.[cite:6]
- A venue is associated with booking fulfillment, not as a direct permanent child of the user.[cite:6]
- Vendors are selected in the context of an event/booking, not as stand-alone user relationships.[cite:6][cite:9]

## Planning before authentication

AEVA must support anonymous or pre-auth planning. This was part of the earlier project decisions and affects both backend ownership and merge logic. The system must support a temporary planning identity before signup/login, preserve the collected planning state, and then safely claim that state when the user authenticates later.[cite:4][cite:7]

This means the implementation should use a first-class planning session concept rather than treating unauthenticated use as disposable local-only state. The session should be claimable, traceable, and safely merged into the authenticated user’s account without data loss or duplicate event creation.[cite:4][cite:7]

## Frontend reality

The existing frontend is not a blank starter. It already contains product assumptions that the backend must respect. The README and live app indicate support or partial support for:
- AI-generated event planning.
- Manual event planning.
- Venue and vendor exploration.
- Guest management.
- Simulated email sending.
- Editable plan titles.
- Responsive UI.
- Local persistence/session continuity.[cite:1][cite:2]

Because of this, backend integration must be incremental. The correct strategy is to replace current local persistence and mocked behaviors one module at a time while preserving user-visible UX where possible.[cite:1][cite:2]

## Current backend direction

The backend target is Supabase. This is intentional, not incidental. Supabase provides the most appropriate balance for this project because it supports Postgres, Auth, Row Level Security, Storage, and Edge Functions without forcing the project into a heavier custom backend architecture too early.[cite:36][cite:38]

Do not replace this with a custom Express, Nest, or microservice backend unless there is a clearly documented and approved reason. Architectural sophistication is not the goal; reliable incremental delivery is the goal.[cite:10][cite:11][cite:36]

## Architectural style

AEVA should be implemented as a modular monolithic backend around Supabase primitives.

Expected building blocks:
- Postgres as the source of truth for business state.
- Supabase Auth for user identity.
- Row Level Security for data access control.
- Edge Functions only for privileged, multi-step, or secret-bearing operations.
- Frontend service modules as the only app-side access layer.

Avoid unnecessary abstraction. Do not introduce queues, complex job runners, microservices, or advanced agent architectures until the core planning and booking flow works end to end.[cite:10][cite:11][cite:36]

## Major modules

The backend should be reasoned about through these modules:

### 1. Identity and session ownership
Supports anonymous planning, signup/login, profile handling, and claiming or merging a planning session into an authenticated account.[cite:4][cite:7]

### 2. Planning intake
Supports chatbot messages, survey answers, structured preferences, manual builder state, and extracted vibe/theme preferences.[cite:2][cite:4]

### 3. Event core
Stores the canonical event record and its lifecycle from early draft to confirmed planning state and later booking linkage.[cite:6]

### 4. Discovery catalog
Stores venues, vendors, categories, metadata, media, and availability-related records needed to power browsing and recommendations.[cite:1][cite:2]

### 5. Recommendations and selections
Stores AI or rules-based recommendations, user selections, and the reasoning or metadata needed to restore them after refresh or later edits.[cite:2][cite:4]

### 6. Booking and payment
Stores booking drafts, final booking state, venue linkage, vendor linkage, pricing, and payment records.[cite:6]

### 7. Guests and invitations
Stores guest records, invite drafts, delivery attempts, RSVP statuses, and any invitation-related metadata.[cite:1][cite:4]

### 8. Notifications and operations
Stores user notifications, outbound messages, admin or moderation operations, and audit logs.[cite:3][cite:7]

### 9. AI orchestration persistence
Stores chat history, generated summaries, extracted preferences, recommendation outputs, and selected debug/audit metadata for AI-assisted flows.[cite:2][cite:4]

## Implementation philosophy

The project should be built in layers. The correct implementation philosophy is:
- preserve the frontend,
- add backend scaffolding,
- create source-of-truth schema,
- enforce ownership and security,
- then replace one UX slice at a time.

The wrong philosophy is to rebuild everything at once, create a completely new architecture, or treat the existing frontend as disposable.

## Security and access model

Assume all business tables are private by default. Access must be granted deliberately. Catalog browsing data can be public-read if intentionally exposed, but sensitive planning, booking, guest, payment, and notification data must be owner-scoped or function-scoped.

Anonymous planning should not be implemented through unsafe open writes on core business tables. If a secure direct pattern is too awkward, use controlled helper logic or an Edge Function instead.

## Data modeling rules

These rules should be followed consistently:
- SQL migrations are the source of truth.
- Use UUID primary keys.
- Use `created_at` and `updated_at` where appropriate.
- Keep core business state relational and normalized.
- Use JSONB selectively for flexible data such as raw survey payloads, AI metadata, or provider payloads.
- Add indexes for ownership and common lookups.
- Preserve the centrality of `Event` in table relationships.[cite:6]

## Frontend integration rules

The frontend should integrate with the backend through service modules, not ad hoc calls scattered across components. LocalStorage may still be used for lightweight ephemeral client state such as a planning session token, but it must not remain the source of truth for business data after backend integration of a module begins.[cite:1]

The existing route structure and visible UX should remain as stable as possible unless a change is explicitly required for correctness or security.

## Prompt and workflow rules for Claude

Claude must operate with bounded scope and progressive disclosure. Root project context files should remain concise and general, while larger task-specific instructions should live in separate files that Claude reads when needed. This pattern aligns with Claude Code best-practice guidance to keep root context short, universally relevant, and linked to task-specific documentation instead of turning one file into a knowledge dump.[cite:65][cite:71][cite:75][cite:77]

For each implementation task, Claude should:
1. Read only the files needed for the task.
2. Summarize current behavior.
3. Propose a short implementation plan.
4. Implement only the requested module or change set.
5. End with changed files, test steps, assumptions, and risks.

Claude should not move into the next module automatically.

## Constraints and anti-patterns

The following outcomes are unacceptable:
- Removing `Event` as the central entity.[cite:6]
- Turning AEVA into only a chatbot app or only a marketplace app.[cite:2][cite:4]
- Replacing incremental integration with a broad rewrite.
- Keeping critical business truth only in localStorage after backend integration starts.[cite:1]
- Adding unsafe public write policies on sensitive data.
- Introducing a custom backend stack without clear need.
- Duplicating business logic across many UI components.
- Changing user-visible flows without necessity.

## Acceptance mindset

Success for this project is not measured by architectural novelty. Success means:
- anonymous users can start planning,
- the planning state persists,
- authentication does not destroy in-progress work,
- recommendations and selections are restorable,
- guest and invite state persists,
- booking is tied correctly to the event,
- and the existing frontend gains real backend support without losing its product identity.[cite:1][cite:2][cite:4][cite:6]

## How this file should be used

Use this file as permanent project memory and architectural context. Do not overload it with detailed step-by-step instructions.

When working on a concrete implementation task:
- read this file first for project understanding,
- then read `CLAUDE.md` for repository rules,
- then read `aeva-backend-claude-dossier.md` for the exact module prompt or execution plan,
- then work only on the current requested scope.[cite:65][cite:71][cite:75][cite:77]
