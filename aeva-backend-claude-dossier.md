# AEVA Backend Build Dossier for Claude Code

This document is the execution guide for building AEVA’s backend with minimal human intervention. It is written to be used directly by Claude Code and to keep implementation grounded in the existing frontend, the agreed AEVA system design, and a low-hallucination workflow.[cite:2][cite:4][cite:6][cite:7][cite:10]

The current frontend is a public Vite + React + Tailwind application that persists data in localStorage and presents AI-assisted planning, manual planning, venue/vendor browsing, guest management, and simulated email behavior, while listing real backend integration, payments, and real auth as future work.[cite:1] The live deployment exposes landing, recommendations, catering, decorations, vendors, login, survey, plan builder, and chatbot-driven entry points, so the backend must map to these actual flows first.[cite:2]

## Objectives

The backend must preserve the product decisions already made for AEVA. AEVA is an AI-powered event planning and booking system where planning can begin before signup, planning data must not be lost when the user authenticates later, and the core business hierarchy is User → Event → Booking, with Booking connecting operational fulfillment such as venue, vendors, and payment.[cite:2][cite:4][cite:6]

The implementation target is Supabase first, not a custom Express or Nest backend. Supabase is the most efficient fit here because it provides Postgres, authentication, row-level security, storage, serverless functions, and a straightforward integration path for a React frontend without adding unnecessary architecture overhead.[cite:36][cite:38]

## Source constraints

Claude Code must treat the current frontend and prior AEVA system decisions as the source of truth. It must not invent new business features, user roles, route concepts, or data entities unless they are necessary to support an already agreed behavior.[cite:1][cite:2][cite:4][cite:6]

The frontend currently documents these implemented or simulated capabilities: AI-generated event plans, manual planning, venue and vendor selection, fake email sending, guest management, persistent sessions, editable plan titles, and responsive design.[cite:1] The live UI currently exposes wedding-focused marketing copy, AI/survey/build-plan entry points, venue and vendor browsing, and a chatbot surface, which indicates that the backend must support both guided intake and catalog-driven exploration.[cite:2]

## Recommended architecture

AEVA should use a Supabase-centered architecture with a thin frontend integration layer. Postgres should own business truth, Supabase Auth should own identities, Row Level Security should enforce access, Edge Functions should handle privileged and third-party actions, and the React app should move from localStorage-centric persistence to service-based reads and writes with local optimistic state only where useful.[cite:36][cite:38]

The architecture should be modular, but not microservice-based. Use one Supabase project, one schema set, one migration history, one typed client layer in the frontend, and one function folder for privileged workflows such as invitation sending, payment session creation, and AI orchestration. This keeps token usage, complexity, and debugging surface area under control.[cite:10][cite:11][cite:36]

### High-level modules

| Module | Responsibility | Why it exists |
|---|---|---|
| Identity | Anonymous session, auth, profile, session merge | Supports “plan before signup” behavior.[cite:4][cite:7] |
| Planning Intake | Chat messages, survey answers, manual plan drafts, vibe preferences | Preserves all planning paths agreed for AEVA.[cite:2][cite:4] |
| Event Core | Canonical event record and lifecycle | Event is the main bridge entity in the agreed model.[cite:6] |
| Catalog | Venues, vendors, categories, tags, media, availability metadata | Supports browsing and recommendation screens.[cite:1][cite:2] |
| Booking | Booking draft, confirmation, payment links, fulfillment status | Booking links event to commercial execution.[cite:6] |
| Guests & Invites | Guests, invitations, RSVP states | Matches guest management and invite flows.[cite:1][cite:4] |
| Notifications | Emails, system notifications, delivery logs | Replaces fake email behavior with real flows later.[cite:1] |
| Admin Ops | Catalog management, moderation, audit | Matches the earlier DFD/admin process planning.[cite:3][cite:7] |
| AI Orchestration | Prompt templates, AI runs, extracted preferences, recommendation traces | Keeps AI behavior inspectable and recoverable.[cite:2][cite:4] |

## Delivery strategy

Do not ask Claude Code to “build the backend.” That is the fastest way to get schema drift, invented assumptions, duplicated logic, and expensive retry cycles. Anthropic’s prompting guidance emphasizes explicit instructions, structured tasks, examples, and bounded scope, while hallucination reduction guidance favors grounding, verification, and separation of planning from implementation.[cite:10][cite:11]

Instead, build in this order:

1. Project scaffolding and Supabase setup.
2. Core schema and migrations.
3. Anonymous session plus event persistence.
4. Auth plus session merge.
5. Catalog read model for venues/vendors.
6. Booking model.
7. Guests and invitations.
8. Notifications.
9. AI orchestration and persistence.
10. Frontend replacement of localStorage flows module by module.

That order minimizes integration ambiguity because it starts with the state currently being faked or stored locally, then converts screens one slice at a time.[cite:1][cite:2]

## Supabase implementation standard

Use the following standards consistently.

### Database rules

Use SQL migrations as the only schema source of truth. Do not let Claude define schema only inside prose or TypeScript interfaces. Every table, index, trigger, enum, and policy must live in versioned migrations first, then generated types can follow from the database.[cite:36][cite:38]

Use UUID primary keys. Use `created_at` and `updated_at` on all mutable business tables. Use status enums conservatively. Prefer normalized tables for business state and JSONB only for flexible AI payloads, raw survey blobs, or vendor metadata that is not queried relationally.

### API rules

Prefer direct Supabase client reads and writes for user-scoped CRUD protected by RLS. Use Edge Functions only when one of these is true: the operation needs secrets, the operation spans multiple privileged writes, the operation integrates with external APIs, or the logic must not be trusted to the client.

### RLS rules

Assume every table is private by default. Add explicit policies. Never allow broad `authenticated` access without owner checks. Where anonymous planning is needed, use an anonymous session token mapped to a first-class planning session record rather than making core event tables publicly writable.

### Frontend rules

Replace localStorage business truth with a service layer under `src/services` or equivalent. UI components should not call Supabase directly from many scattered locations. Keep one boundary for each module so later refactors stay cheap.

## Proposed schema

The schema below preserves the agreed AEVA model while fitting the current frontend.

### Core identity and session tables

#### `profiles`
Stores user profile metadata linked to Supabase Auth users.

Suggested fields:
- `id uuid primary key references auth.users(id)`
- `full_name text null`
- `email text null`
- `phone text null`
- `avatar_url text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `planning_sessions`
Stores anonymous or pre-auth planning sessions so users can start without signup.[cite:4]

Suggested fields:
- `id uuid primary key`
- `session_token text unique not null`
- `user_id uuid null references profiles(id)`
- `status text not null default 'active'`
- `source text null` 
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `claimed_at timestamptz null`

### Planning intake tables

#### `events`
This is the aggregate root for a user’s event concept and planning state. It must remain central.[cite:6]

Suggested fields:
- `id uuid primary key`
- `user_id uuid null references profiles(id)`
- `planning_session_id uuid null references planning_sessions(id)`
- `title text not null`
- `event_type text not null`
- `status text not null default 'draft'`
- `vision_summary text null`
- `guest_count integer null`
- `budget_min numeric null`
- `budget_max numeric null`
- `event_date date null`
- `city text null`
- `venue_type text null`
- `theme text null`
- `vibe_summary text null`
- `source_flow text null` 
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `chat_threads`
- `id uuid primary key`
- `planning_session_id uuid null references planning_sessions(id)`
- `event_id uuid null references events(id)`
- `user_id uuid null references profiles(id)`
- `status text not null default 'active'`
- `created_at timestamptz not null default now()`

#### `chat_messages`
- `id uuid primary key`
- `thread_id uuid not null references chat_threads(id)`
- `role text not null`
- `message_text text not null`
- `message_meta jsonb null`
- `created_at timestamptz not null default now()`

#### `survey_responses`
- `id uuid primary key`
- `planning_session_id uuid null references planning_sessions(id)`
- `event_id uuid null references events(id)`
- `step_key text not null`
- `response_data jsonb not null`
- `created_at timestamptz not null default now()`

#### `event_preferences`
A normalized place for extracted structured preferences from AI/chat/manual flows.

Suggested fields:
- `id uuid primary key`
- `event_id uuid not null references events(id)`
- `preference_key text not null`
- `preference_value jsonb not null`
- `source text not null`
- `created_at timestamptz not null default now()`

### Catalog tables

#### `venues`
- `id uuid primary key`
- `name text not null`
- `description text null`
- `city text null`
- `address text null`
- `capacity_min integer null`
- `capacity_max integer null`
- `price_min numeric null`
- `price_max numeric null`
- `venue_type text null`
- `rating numeric null`
- `image_urls jsonb null`
- `features jsonb null`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `vendors`
- `id uuid primary key`
- `category text not null`
- `name text not null`
- `description text null`
- `city text null`
- `price_min numeric null`
- `price_max numeric null`
- `rating numeric null`
- `image_urls jsonb null`
- `details jsonb null`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `vendor_availability`
- `id uuid primary key`
- `vendor_id uuid not null references vendors(id)`
- `available_date date not null`
- `status text not null`
- unique `(vendor_id, available_date)`

#### `venue_availability`
- `id uuid primary key`
- `venue_id uuid not null references venues(id)`
- `available_date date not null`
- `status text not null`
- unique `(venue_id, available_date)`

### Recommendation and selection tables

#### `event_recommendations`
Stores recommendation outputs so AI suggestions are auditable and reusable.

Suggested fields:
- `id uuid primary key`
- `event_id uuid not null references events(id)`
- `entity_type text not null`
- `entity_id uuid not null`
- `score numeric null`
- `reason_text text null`
- `source text not null`
- `created_at timestamptz not null default now()`

#### `event_selections`
Stores what the user has currently picked before or after booking.

Suggested fields:
- `id uuid primary key`
- `event_id uuid not null references events(id)`
- `selection_type text not null`
- `entity_id uuid not null`
- `status text not null default 'selected'`
- `notes text null`
- `created_at timestamptz not null default now()`

### Booking and payment tables

#### `bookings`
One event can have one canonical booking record when it moves into fulfillment; this aligns with the earlier agreed hierarchy.[cite:6]

Suggested fields:
- `id uuid primary key`
- `event_id uuid not null unique references events(id)`
- `venue_id uuid null references venues(id)`
- `status text not null default 'draft'`
- `subtotal numeric null`
- `service_fee numeric null`
- `total_amount numeric null`
- `currency text not null default 'EGP'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `booking_vendors`
- `id uuid primary key`
- `booking_id uuid not null references bookings(id)`
- `vendor_id uuid not null references vendors(id)`
- `vendor_category text not null`
- `agreed_price numeric null`
- `status text not null default 'pending'`
- unique `(booking_id, vendor_id)`

#### `payments`
- `id uuid primary key`
- `booking_id uuid not null references bookings(id)`
- `provider text not null`
- `provider_payment_id text null`
- `status text not null`
- `amount numeric not null`
- `currency text not null default 'EGP'`
- `paid_at timestamptz null`
- `raw_payload jsonb null`
- `created_at timestamptz not null default now()`

### Guests and invitations tables

#### `guest_profiles`
- `id uuid primary key`
- `event_id uuid not null references events(id)`
- `full_name text not null`
- `email text null`
- `phone text null`
- `group_name text null`
- `notes text null`
- `created_at timestamptz not null default now()`

#### `guest_invitations`
- `id uuid primary key`
- `event_id uuid not null references events(id)`
- `guest_id uuid not null references guest_profiles(id)`
- `status text not null default 'draft'`
- `invite_channel text null`
- `sent_at timestamptz null`
- `responded_at timestamptz null`
- `rsvp_status text null`
- `message_subject text null`
- `message_body text null`
- `delivery_meta jsonb null`
- `created_at timestamptz not null default now()`

### Notifications and ops tables

#### `notifications`
- `id uuid primary key`
- `user_id uuid null references profiles(id)`
- `event_id uuid null references events(id)`
- `type text not null`
- `title text not null`
- `body text not null`
- `is_read boolean not null default false`
- `created_at timestamptz not null default now()`

#### `outbound_messages`
- `id uuid primary key`
- `event_id uuid null references events(id)`
- `guest_invitation_id uuid null references guest_invitations(id)`
- `provider text not null`
- `message_type text not null`
- `recipient text not null`
- `status text not null`
- `provider_message_id text null`
- `payload jsonb null`
- `created_at timestamptz not null default now()`

#### `audit_logs`
- `id uuid primary key`
- `actor_user_id uuid null references profiles(id)`
- `entity_type text not null`
- `entity_id uuid not null`
- `action text not null`
- `meta jsonb null`
- `created_at timestamptz not null default now()`

## Ownership model

The most important rule in this project is that anonymous planning must exist without making the system public-write everywhere. The safe model is: anonymous user gets a `planning_sessions.session_token`, all early planning writes are scoped to that planning session, then after signup/login a merge or claim process attaches session-owned records to a real `profiles.id`.[cite:4][cite:7]

The `events` table can hold both `planning_session_id` and `user_id` during the transition. Once the session is claimed, the event should keep `user_id`, preserve `planning_session_id` for traceability, and mark the planning session as claimed.

## Row Level Security design

RLS should be written per table, not generically hand-waved.

### Core policy rules

- `profiles`: user can read and update only their own row.
- `planning_sessions`: anonymous access is not direct table-wide access; session reads and writes should happen through controlled functions or constrained token lookup paths.
- `events`: owner can read and write own events; anonymous access only through controlled session ownership logic.
- `survey_responses`, `chat_threads`, `chat_messages`, `event_preferences`: accessible only through the owning event or planning session.
- `venues`, `vendors`, availability, and publicly browsable catalog data: readable by everyone if active.
- `bookings`, `payments`, `guest_profiles`, `guest_invitations`, `notifications`: only event owner or admin equivalent.
- `audit_logs`: admin/service role only.

In practice, some anonymous writes may be easier to implement through Edge Functions rather than direct RLS-exposed inserts. Choose safety over cleverness.

## Frontend integration map

The current frontend should be integrated incrementally. Because it is already built as a Vite + React app and currently stores persistence locally, the backend rollout should swap one domain at a time rather than refactor everything in one pass.[cite:1][cite:2]

### Integration phases

#### Phase 1: foundational client and environment

Add Supabase client initialization, environment variables, a typed service layer, and error handling primitives. Do not change all screens yet. Get infrastructure into the frontend first.

#### Phase 2: replace local plan persistence

Replace localStorage plan creation and loading with `planning_sessions` plus `events`. This is the first real business slice and the minimum viable backend milestone.

#### Phase 3: auth and merge

Once a user signs up or logs in, attach current anonymous work to the authenticated profile. This prevents the classic “my plan disappeared after login” failure mode and is central to AEVA’s concept.[cite:4]

#### Phase 4: catalog reads

Wire recommendations, venue pages, vendor pages, catering, and decorations screens to real catalog tables, starting with seeded data.

#### Phase 5: guests and invitations

Replace local guest list state and fake email sending with guest/invite tables plus a no-op or sandbox mail provider integration.

#### Phase 6: booking and payment

After selection flows are stable, create booking drafts, pricing summaries, and payment intent/session flows.

## Seeding strategy

Do not wait for perfect production data. Seed venues and vendors aggressively so the frontend has realistic content. The current product experience depends on discovery screens and recommendation cards.[cite:1][cite:2]

Create seeders for:
- venues by city and event type
- vendors by category such as DJ, photographer, catering, decorations
- availability snapshots for demo dates
- recommendation examples for at least three event archetypes: wedding, birthday, corporate

Use deterministic seed IDs or name uniqueness rules so reruns are safe.

## Backend folder structure

If the repository remains frontend-only, Claude Code should create the backend artifacts in a way that does not force a monorepo explosion.

Recommended repo shape:

```text
/aeva-frontend
  /supabase
    /migrations
    /seed
    /functions
      /claim-session
      /create-booking
      /send-invitations
      /ai-plan
  /src
    /lib
      supabaseClient.js
    /services
      authService.js
      planningService.js
      catalogService.js
      bookingService.js
      guestService.js
      notificationService.js
    /hooks
    /pages
    /components
```

If Claude wants to add generated types, place them under `src/lib/database.types.ts` or a similar single location.

## Implementation prompts for Claude Code

The prompts below are designed to reduce hallucinations, contain scope, and make Claude do architecture before edits. Anthropic’s prompt guidance recommends explicit structure, sequential tasks, examples, and strong output constraints; these prompts follow that pattern.[cite:10]

### Master operating prompt

Use this as the session-level instruction when working on AEVA.

```text
You are a senior backend engineer and integration engineer working inside the AEVA frontend repository.

Your job is to add a Supabase backend incrementally without breaking the existing frontend UX.

Operating rules:
1. Treat the current frontend behavior and the backend dossier as the source of truth.
2. Do not invent new product features, user roles, routes, or business flows.
3. Before making changes, read only the files needed for the current task and summarize what exists.
4. Propose a concrete implementation plan before coding.
5. Implement in this order unless the task explicitly says otherwise:
   a. SQL migrations
   b. RLS policies
   c. Edge functions if needed
   d. typed client/service layer
   e. frontend integration
6. Keep changes minimal and local. Avoid broad rewrites.
7. Never duplicate business logic across multiple frontend components. Put business logic in service modules.
8. If a requirement is ambiguous, prefer preserving current frontend behavior over inventing a new behavior.
9. At the end of each task output:
   - files created or changed
   - manual test steps
   - assumptions made
   - follow-up risks
10. Stop after completing the requested scope. Do not continue into the next module unless explicitly asked.
```

### Prompt 1: repository audit and backend plan

Use this first.

```text
Task: audit the AEVA frontend repository and prepare the backend integration plan.

Read these areas first:
- package.json
- src/App.*
- src/pages/**
- src/components/** where planning or persistence exists
- src/hooks/**
- src/utils/**
- any localStorage helpers
- any fake email or AI plan generation code

Then do the following in order:
1. Summarize the current app routes, major features, and where state is persisted today.
2. Identify the exact frontend modules that need backend integration first.
3. Map current frontend concepts to the target backend entities from the AEVA dossier.
4. Propose a minimal Supabase rollout plan with milestones.
5. Do not edit files yet.

Output format:
- Current architecture summary
- Persistence audit
- Entity mapping
- Proposed rollout plan
- Risks and unknowns
```

### Prompt 2: Supabase scaffolding only

```text
Task: add Supabase scaffolding to the AEVA repo without changing feature behavior yet.

Requirements:
1. Add the minimal Supabase project structure needed for migrations, seed files, and edge functions.
2. Add frontend Supabase client initialization and environment variable usage.
3. Add a service-layer folder structure for backend integration.
4. Do not yet replace existing localStorage behavior.
5. Add a short README section documenting required env vars and local setup.

Before coding:
- read package.json and the current src structure
- propose the exact file tree you will add
- stop for approval only if there is a structural conflict; otherwise proceed

Deliverables:
- new files
- brief explanation of each file
- no unrelated refactors
```

### Prompt 3: core migration set

```text
Task: create the first production-grade Supabase migration set for AEVA.

Create migrations for these tables only:
- profiles
- planning_sessions
- events
- chat_threads
- chat_messages
- survey_responses
- event_preferences
- venues
- vendors
- venue_availability
- vendor_availability
- event_recommendations
- event_selections
- bookings
- booking_vendors
- payments
- guest_profiles
- guest_invitations
- notifications
- outbound_messages
- audit_logs

Requirements:
1. Use UUID primary keys.
2. Add created_at and updated_at where appropriate.
3. Add foreign keys and unique constraints where the AEVA dossier implies them.
4. Add indexes for common reads: event ownership, planning session lookup, recommendations by event, bookings by event, invitations by event.
5. Add helper triggers for updated_at where needed.
6. Generate RLS stubs or policies if safe; otherwise state what will be added in the next task.
7. Do not add extra tables not listed above.

Output:
- migration files created
- design notes
- anything deferred to the RLS task
```

### Prompt 4: RLS and ownership model

```text
Task: implement row level security for the AEVA core schema.

Requirements:
1. Enable RLS on all non-public business tables.
2. Allow public read access only to active catalog tables that are intentionally public, such as venues and vendors.
3. Ensure authenticated users can only access their own profile, events, bookings, guests, invitations, notifications, and related data.
4. Do not expose anonymous broad write access to core tables.
5. Where anonymous planning needs controlled access, design it through planning_sessions and secure helper functions rather than unsafe public insert policies.
6. Document any table where access must go through an edge function rather than direct client writes.

Before coding:
- inspect the migrations created previously
- write a table-by-table policy plan
- then implement

Output:
- policy summary by table
- SQL created
- any caveats
```

### Prompt 5: anonymous planning foundation

This is the first feature module to implement end to end.

```text
Task: implement anonymous planning session creation and event draft persistence for AEVA.

Goal:
Replace the current localStorage-only plan persistence with a real backend-backed flow while preserving the current UX.

Requirements:
1. Read the current plan creation, survey, builder, and any chatbot entry code first.
2. Identify where the app currently creates or updates a plan.
3. Implement a minimal service flow that:
   - creates a planning session if one does not exist
   - creates an event draft linked to that planning session
   - saves updates to the event draft
   - loads the current event draft on refresh
4. Keep the UI behavior as close as possible to the current frontend.
5. Use localStorage only for storing a lightweight client session token if needed, not for business truth.
6. Do not implement login merge yet.

Implementation order:
- service functions
- any required secure database helpers
- component/page integration
- migration adjustments only if strictly necessary

At the end include:
- exact files changed
- manual browser test steps
- known edge cases
```

### Prompt 6: auth plus claim-session merge

```text
Task: implement login/signup integration and claim anonymous planning work after authentication.

Goal:
A user who starts planning before authentication must retain their planning session, event draft, survey answers, and related planning data after login or signup.

Requirements:
1. Read the current login page and any existing auth placeholders.
2. Implement Supabase Auth integration with email-based auth first.
3. Create a secure claim-session flow that attaches the current planning_session and related records to the authenticated user.
4. Ensure the merge is idempotent and safe to retry.
5. Preserve existing frontend navigation behavior as much as possible.
6. Do not add OAuth yet unless the current code clearly depends on it.

Implementation notes:
- Prefer an edge function or server-side secure path for claim logic if that is safer than client-side multi-write operations.
- Do not lose event ownership or create duplicate events.

Output:
- files changed
- merge logic summary
- manual test checklist for pre-login to post-login continuity
```

### Prompt 7: catalog read integration

```text
Task: connect venue, catering, decorations, and vendor listing screens to Supabase-backed catalog data.

Requirements:
1. Read all listing pages and shared card/filter components first.
2. Identify the current source of venue and vendor data.
3. Replace hardcoded or local mock data access with service-layer reads from Supabase.
4. Keep current visual components and route behavior intact.
5. Add minimal loading and error handling states if missing.
6. Seed enough data for the current screens to remain functional.

Do not implement booking in this task.

Output:
- files changed
- seed data added
- test instructions per page
```

### Prompt 8: recommendations persistence

```text
Task: persist recommendation results and selection state for AEVA.

Requirements:
1. Read the survey, chatbot, and recommendations-related frontend code.
2. Store recommendation outputs in event_recommendations.
3. Store user picks in event_selections.
4. Make recommendations reloadable after refresh.
5. If current recommendations are still mock-generated, preserve that behavior but save the result structure for future AI replacement.
6. Do not redesign the recommendation algorithm in this task.

Output:
- mapping from frontend recommendation objects to database rows
- files changed
- test steps
```

### Prompt 9: guest management and invitations

```text
Task: replace guest list local state and fake email behavior with real backend persistence and invitation workflow scaffolding.

Requirements:
1. Read all guest management and invitation-related frontend files.
2. Persist guest records in guest_profiles.
3. Persist invitation drafts and statuses in guest_invitations.
4. Replace fake-send actions with either:
   - a stubbed edge function that records outbound_messages, or
   - a sandbox email integration if already configured.
5. Keep the current UI intact as much as possible.
6. Add clear status handling for draft, queued, sent, failed.

Do not implement advanced template editing unless the UI already supports it.

Output:
- files changed
- invitation flow summary
- test checklist
```

### Prompt 10: booking foundation

```text
Task: implement AEVA booking draft and confirmation foundation.

Requirements:
1. Read current selection and checkout-related frontend code.
2. Create or update bookings from event selections.
3. Link one optional venue and multiple vendors to the booking.
4. Compute subtotal, fees, and total at the service layer or secure function layer.
5. Persist payment placeholder rows but do not integrate a live provider yet unless explicitly requested.
6. Keep this task focused on booking state, not final payment.

Output:
- files changed
- booking data flow summary
- test steps
```

### Prompt 11: payment integration

```text
Task: add payment integration to AEVA booking flow.

Requirements:
1. Inspect existing booking flow and payment placeholders first.
2. Recommend the lowest-complexity production-acceptable payment approach for this project.
3. Implement provider session creation through an edge function.
4. Persist payments and status updates in the payments table.
5. Handle success, failure, and cancellation callbacks.
6. Keep secrets out of the frontend.

Before coding:
- present the recommended provider and integration shape
- then implement

Output:
- files changed
- provider choice rationale
- setup notes
- manual end-to-end test steps
```

### Prompt 12: AI orchestration persistence

```text
Task: integrate AI planning persistence into AEVA without overengineering.

Requirements:
1. Read the current AI-related frontend behavior and any Claude API usage or placeholders.
2. Keep the current user-facing AI flow intact.
3. Persist chat threads, chat messages, extracted preferences, and any generated recommendations or summaries.
4. If an AI call already exists client-side, move secrets and actual model calls to an edge function.
5. Store raw AI payloads only where useful for audit/debugging; avoid excessive token-heavy storage.
6. Do not attempt autonomous agent workflows in this task.

Output:
- files changed
- AI request/response persistence design
- security notes
- test steps
```

## Anti-hallucination rules for every Claude task

Append these to every implementation prompt where relevant.

```text
Constraints:
- Do not invent files that do not exist without first stating why they need to be created.
- Do not invent frontend behavior; infer only from the files you read.
- Do not create duplicate helper logic in multiple pages or components.
- Do not add new libraries unless they solve a concrete need that cannot be handled by the current stack.
- Do not refactor unrelated code.
- If you are unsure about a business rule, preserve the current user-visible behavior and note the ambiguity.
- Prefer one reliable implementation over a “more advanced” architecture.
- Keep names aligned with the AEVA dossier entities.
```

## Prompt efficiency rules for you

To reduce credits and avoid Claude wandering, keep your own prompting discipline strict.

Use one task per prompt. Do not ask for schema, auth, booking, invites, and frontend integration in the same message. Anthropic’s documentation recommends explicit structure and direct instructions, and complex underspecified prompts are more likely to expand token usage and produce less predictable work.[cite:10]

Start every task with the smallest useful file set. Tell Claude exactly which files or folders to read. Claude documentation notes that structured context and clear scope improve reliability, and long-context prompting works better when inputs are organized and the task comes after the context.[cite:10]

Require a plan before edits whenever the task can branch. This is especially important for repository audit, schema design, and RLS design. For narrow mechanical tasks such as “add environment variable docs and Supabase client file,” planning can be short.

Force output sections. A good standard is: summary, plan, files changed, test steps, assumptions. This lowers the chance of vague responses and makes retries cheaper.[cite:10][cite:11]

Do not repeatedly restate the whole project in every prompt. Put the long-lived instructions in a master prompt or paste the relevant excerpt from this dossier once, then keep individual tasks short. Claude’s docs emphasize context management and prompt structure because oversized repeated prompts waste tokens.[cite:10]

When Claude gets stuck, do not say “try again.” Instead say exactly what failed. Example: “The migration added tables not listed in scope. Re-run and only create the listed tables.” Precise correction is cheaper than open-ended retries.[cite:10][cite:11]

## Minimal acceptance criteria by milestone

### Milestone 1: foundation

Success means the repo has Supabase scaffolding, migrations, and a typed client layer, with no broken frontend pages.

### Milestone 2: event persistence

Success means a user can start planning anonymously, refresh the page, and still load the same event draft from the backend rather than only from localStorage.[cite:1][cite:2]

### Milestone 3: auth merge

Success means a user can create a plan anonymously, sign up or log in, and see the same plan preserved under their account.[cite:4]

### Milestone 4: catalog integration

Success means venue/vendor/category pages load from seeded Supabase data and preserve the current UX shape.[cite:1][cite:2]

### Milestone 5: guests and invites

Success means guests and invitation statuses persist and fake send actions are replaced with backend-tracked sends.[cite:1]

### Milestone 6: booking

Success means the selected venue/vendors for an event can produce a stable booking draft tied to the event and ready for payment.[cite:6]

## Common mistakes to reject immediately

Reject any Claude output that does any of the following:

- Removes the Event entity or makes Booking the primary root again.[cite:6]
- Stores all planning state only in client localStorage after backend integration.[cite:1][cite:2]
- Uses public-write policies on sensitive business tables.
- Builds a full custom server without a strong reason.
- Splits business logic across random components instead of service modules.
- Changes UX behavior without necessity.
- Introduces OAuth, queue systems, microservices, or vector search before the core planning flow works.

## Recommended first three commands/prompts to actually run

Use this order in Claude Code after adding this document to the repo.

### First

```text
Read the AEVA backend dossier and audit the repository. Follow Prompt 1 exactly. Do not edit files yet.
```

### Second

```text
Using the approved plan, execute Prompt 2 for Supabase scaffolding only. Keep changes minimal and do not replace current persistence yet.
```

### Third

```text
Execute Prompt 3 for the core migration set, then stop. Do not implement auth or frontend integration in the same turn.
```

## Final instruction to Claude Code

The correct strategy for AEVA is not “maximum sophistication.” The correct strategy is a boring, clear, production-sensible backend that preserves the current frontend, honors the agreed domain model, and is cheap to extend. Prefer explicit schema, narrow modules, safe ownership rules, and incremental integration over clever abstractions.[cite:10][cite:11][cite:36][cite:38]
