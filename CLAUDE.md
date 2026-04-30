# CLAUDE.md

## Build Horizon — Read Before Every Task

**AEVA build horizon — upcoming phases in order:**

1. ✅ Vendor accounts schema migration (004_vendor_accounts.sql)
2. Real Supabase Auth (login + register replacing mock)
3. Anonymous session merge after login
4. Event date added to survey + planningService
5. Auth gate on "Lock In This Plan" + redirect
6. Booking confirmation screen
7. Catalog seed script (venues, vendors, availability)
8. Vendor self-registration + profile creation + admin approval
9. Booking engine (availability check, auto-confirm, Paymob sandbox)
10. User dashboard (upcoming events, booking status)
11. Venue dashboard
12. Vendor dashboard
13. Admin dashboard
14. In-app notifications + Paymob webhook handling

**Decision rules for this phase:**
- Do not optimize for the current phase only.
- Always consider how implementations extend in later phases.
- Do not invent schema, routes, or logic not listed here or in 
- Do not paste complete files. Show changed lines only with file name and line numbers. Confirm what was changed in one short paragraph.
`aeva-backend-claude-dossier.md`.

---

## Project

AEVA is an AI-powered event planner and booking system. The frontend already exists and must be preserved as much as possible while adding a Supabase backend incrementally.

Primary product rules:

* Users can begin planning before signup or login.
* Anonymous planning data must survive authentication.
* `Event` is the central business entity.
* `Booking` is downstream from `Event` and connects operational fulfillment such as venue, vendors, and payment.
* Do not redesign the product or invent new flows unless explicitly requested.

## Source of truth

Use these in order of priority:

1. Existing frontend behavior in this repository.
2. `aeva-backend-claude-dossier.md` in the repo root.
3. Existing AEVA architecture decisions already reflected in the code or documents.

If anything is ambiguous, preserve current frontend UX and call out the ambiguity instead of inventing behavior.

## Stack target

* Frontend: existing Vite + React app.
* Backend target: Supabase.
* Database: Supabase Postgres.
* Auth: Supabase Auth.
* Authorization: Row Level Security.
* Server-side privileged logic: Supabase Edge Functions when needed.

Do not introduce a custom Express, Nest, or microservice backend unless there is a strong documented reason.

## Non-negotiables

* Do not remove or bypass the `Event` entity.
* Do not keep business truth only in localStorage after backend integration begins.
* Do not add broad public write access to sensitive tables.
* Do not refactor unrelated UI code.
* Do not add new libraries unless there is a concrete need.
* Keep logic in service modules, not duplicated across pages/components.
* Keep changes incremental and reversible.

## Working style

For every task:

1. Read only the files needed for the task.
2. Summarize current behavior.
3. Propose a short implementation plan.
4. Implement only the requested scope.
5. End with:

   * files changed
   * manual test steps
   * assumptions made
   * risks or follow-up items

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

* SQL migrations are the schema source of truth.
* Use UUID primary keys.
* Add `created_at` and `updated_at` to mutable tables where appropriate.
* Prefer normalized relational design for core business entities.
* Use JSONB only for flexible payloads such as AI metadata, survey blobs, or provider payloads.
* Add indexes for frequent ownership and lookup patterns.

## Access rules

* Assume all business tables are private by default.
* Add explicit RLS policies.
* Public read access is allowed only for intentionally public catalog data.
* Anonymous planning must be implemented through controlled planning-session logic, not unsafe open table writes.
* Use Edge Functions for privileged or multi-step secure operations.

## Frontend integration rules

* Preserve current UX wherever possible.
* Replace localStorage gradually, one module at a time.
* Put backend access in service modules under `src/services` or equivalent.
* Avoid scattering Supabase calls throughout UI components.
* Keep current route structure intact unless a change is necessary.

## Prompt discipline

When given a task, stay inside the requested scope.
Examples:

* If asked for scaffolding, do not also implement auth.
* If asked for migrations, do not also refactor pages.
* If asked for booking, do not also redesign recommendation logic.

If requirements are unclear, ask or document the ambiguity. Do not guess.

## Branch and repo etiquette

* Never work directly on `main`.
* Work on a dedicated feature branch.
* Keep commits focused and descriptive.
* Do not merge anything automatically.
* Treat `main` as stable and deployable.

Recommended branch naming:

* `feature/supabase-scaffold`
* `feature/core-schema`
* `feature/anonymous-planning`
* `feature/auth-session-merge`
* `feature/catalog-integration`

## Schema notes — survey and selections

Missing survey fields to collect (add to survey or chatbot flow):
- `venue_type`: indoor/outdoor/garden/beach/hotel ballroom (dropdown in survey step 1 or 2)
- `theme`: modern/classic/rustic/bohemian/glamour (multi-select or dropdown)
- `vibe_summary`: free text "describe your dream event in one sentence"
- `vision_summary`: populated by AI from chatbot, or from vibe_summary as a copy for now

`event_selections` table will be populated when:
- Plan builder (usePlanStore) is migrated to backend in Phase 5
- Each venue/catering/decoration/vendor selection in the builder writes to event_selections

`event_recommendations` table will be populated when:
- Catalog is seeded (Prompt G)
- Recommendation logic writes scored results to event_recommendations instead of filtering mockVenues

## Recommended first task

Read `aeva-backend-claude-dossier.md` and perform the repository audit only. Do not edit files until the audit and rollout plan are complete.

---

# AEVA Continuation Document — Session 2

## Project Identity
Product: AEVA — AI-powered event planning and booking platform for Egypt.
Repo: Fork at your GitHub account, branch feature/supabase-backend-foundation
Live frontend: https://aeva-frontend.vercel.app/
Supabase project: ogizknougrawtafhdgzd.supabase.co
Stack: Vite + React + Tailwind + Zustand + Supabase (Postgres, Auth, RLS)
Backend: Supabase only. No custom server.

## Core Domain Model (non-negotiable)
User → Event → Booking → Venue / Vendors / Payment
Event is the aggregate root. Never remove it or replace it with Booking.
Anonymous users can plan before signup via signInAnonymously().
On login, anonymous planning data is claimed and transferred to the authenticated user.
Booking is downstream from Event.

## What Is Working (do not break)

### Auth
- Real Supabase Auth replacing mock login/register.
- Email confirmation required before login.
- restoreSession() in useAuthStore restores real sessions on page refresh without flashing.
- Anonymous users correctly excluded from isAuthenticated using user.is_anonymous !== true && user.email.
- Zustand partialize: () => ({}) — auth state not persisted in Zustand, Supabase handles it natively.
- display_name normalized from user.user_metadata.full_name || email prefix || 'User'.
- Navbar correctly shows Log In / Get Started for unauthenticated, name + logout for authenticated.
- Session merge: anonymous planning data transferred to authenticated user on login via claimAnonymousSession() in authService.js.

### Survey flow
- Survey collects: fullName, gender, eventType, guestCount, location, eventDate (future-only), budget.
- createEventFromSurvey() persists event to Supabase with all fields including event_date.
- saveSurveyResponse() stores survey payload.
- Survey → /event-plan with eventId in router state.

### EventPlan page
- Loads event from Supabase using eventId from location.state.
- Falls back to localStorage key aeva_pending_event_id if returning from login redirect.
- mockPlan still used for display — real recommendations not yet integrated.
- "Lock In This Plan" button: unauthenticated → saves eventId to localStorage, redirects to login. Authenticated → navigates to /booking/confirm.

### Booking flow
- /booking/confirm → fetches event, shows event title/date/estimated total, "Confirm and Pay" creates booking in Supabase with status: 'draft'.
- /booking/success → shows booking reference (first 8 chars of UUID uppercase).
- BookingConfirmation.jsx reads estimated total from usePlanStore.getTotalCost(), falls back to event.budget_max.

### Plan builder flow
- Auth gate at /plan/build — unauthenticated → redirect to login.
- createEventFromPlanBuilder() creates a draft event on mount with source_flow: 'plan_builder'.
- PlanBuilderContext provides eventId to all child steps.
- Each step fetches real data from Supabase via catalogService.
- Each selection calls saveEventSelection(eventId, type, entityId) which does SELECT-then-UPDATE-or-INSERT (not upsert, to avoid 400 errors).
- clearPlan() called ONLY from Cancel button, NOT on mount.
- Vendor category mapping: store keys (photographer, dj, videographer) map to DB categories (photography, dj, videography).

### Catalog pages
- Recommendations.jsx — fetches from venues table, is_active = true.
- Catering.jsx — fetches vendors where category = 'catering'.
- Decorations.jsx — fetches vendors where category = 'decorations'.
- Vendors.jsx — fetches all active vendors.
- All pages use safe JSON parsing for image_urls and details JSONB columns.

### Database (all applied to Supabase)
- 001_init_core_tables.sql — 21 tables, 49 indexes, 6 updated_at triggers.
- 002_rls_policies.sql — 49 RLS policies using auth.uid() throughout.
- 003_auto_create_profile_trigger.sql — auto-creates profiles row on new auth user.
- 004_vendor_accounts.sql — vendor account management table with RLS.
- 005_event_selections_unique.sql — UNIQUE constraint on (event_id, selection_type).
- Seed data applied: 6 venues, 12 vendors (2 per category), 48 venue availability records, 96 vendor availability records.

## What Still Needs Building

### Immediate fixes (broken right now)

#### Fix A — Plan builder back navigation
Back buttons in some steps still use navigate(-1) which goes to wrong page. Correct explicit paths:
- VenuePick.jsx → no back button (step 1, show Cancel only)
- SelectCatering.jsx → navigate('/plan/build/venue')
- SelectDecorations.jsx → navigate('/plan/build/catering')
- SelectVendors.jsx → navigate('/plan/build/decorations')
- PlanSummary.jsx → navigate('/plan/build/vendors')

**Important clarification from current session:**
- Fix A is about back navigation only.
- Do NOT break forward progression from VenuePick.jsx.
- VenuePick.jsx must still allow the user to proceed forward through the flow.
- No back button on step 1.
- Keep a visible Cancel action.
- Preserve existing forward path (select/next or skip behavior) while satisfying the no-back-button requirement.

#### Fix B — PlanProgressBar clickable steps
File: src/components/plan/PlanProgressBar.jsx
Add onClick to each step that navigates to its explicit route. Only allow clicking steps where index <= currentStep (already visited). Add cursor-pointer to clickable steps. Exact routes:
- Step 0: /plan/build/venue
- Step 1: /plan/build/catering
- Step 2: /plan/build/decorations
- Step 3: /plan/build/vendors
- Step 4: /plan/build/summary

#### Fix C — Event date in plan builder
The plan builder has no date selection. The survey has it but plan builder does not. The booking engine needs an event date.
Add to PlanBuilderContext:
- eventDate
- setEventDate

Add a date input in PlanBuilder.jsx above the progress bar:
- Label: "When is your event?"
- Type: date
- min = tomorrow
- Required before proceeding past step 1
- On change: call updateEvent(eventId, { event_date: eventDate }) to persist

#### Fix D — Plan summary shows selected items correctly
Currently photographers and videographers do not show as selected in PlanSummary.jsx. This is because usePlanStore.selectedVendors uses keys photographer, dj, videographer but the display may not be reading them correctly. Verify PlanSummary.jsx reads:
- selectedVendors.photographer
- selectedVendors.dj
- selectedVendors.videographer

## Remaining build phases (in priority order)

### Prompt J — User dashboard
File: src/pages/Dashboard.jsx (currently stub)
- Add getMyBookings(userId) to bookingService.js — fetches bookings joined with events and venues.
- Dashboard shows upcoming events (event_date >= today) and past events separately.
- Each card: event title, date, venue name, status badge, total amount, "View Details" button.
- /events/:id shows full booking summary.
- Empty state if no events.

### Prompt H — Vendor self-registration
- New page /vendor-register with fields: email, password, business_name, vendor_category, contact_phone.
- On submit: create Supabase auth user → auto-creates profile row → insert vendors row with is_active = false → insert vendor_accounts row with status = 'pending'.
- After registration: show "Application under review" message.

### Prompt L — Vendor dashboard
- After login, check if user has vendor_accounts row with status = 'approved'.
- If approved: show /vendor/dashboard with incoming bookings.
- If pending: show pending message.

### Prompt M — Admin dashboard
File: src/pages/admin/AdminDashboard.jsx (currently stub)
- Vendor approval queue: list pending applications, Approve/Reject buttons.
- Approve → set vendor_accounts.status = 'approved', set vendors.is_active = true.
- Booking overview: all bookings with filter by status.
- Basic analytics using Recharts (already installed).
- Admin detection: check Supabase user app_metadata.role = 'admin' or a dedicated flag.

### Prompt K — Venue dashboard (admin section)
Inside admin dashboard, ManageVenues page.
- List all venues with booking count.
- Calendar view showing booked/available dates.
- Add venue form.
- Toggle is_active.

## Missing survey fields
Add to src/pages/Survey.jsx (optional fields, no blocking validation):
- venue_type dropdown: hotel-ballroom, outdoor-garden, beach, rooftop, villa, event-hall
- theme dropdown: modern, classic, rustic, bohemian, glamour, minimal
- vibe_summary short text input, max 150 chars

Map in planningService.createEventFromSurvey():
- surveyData.venue_type → venue_type
- surveyData.theme → theme
- surveyData.vibe_summary → vibe_summary
- vision_summary = surveyData.vibe_summary (copy for now)

## File Structure Reference

```
src/
  lib/supabaseClient.js
  services/
    authService.js       — signUp, signIn, signOut, getCurrentAuthUser, claimAnonymousSession
    planningService.js   — initAnonymousAuth, getOrCreatePlanningSession, createEventFromSurvey,
                           createEventFromPlanBuilder, saveEventSelection, getEvent, updateEvent,
                           saveSurveyResponse, getEventRecommendations, getCurrentUser
    catalogService.js    — getVenues, getVenue, getVendors, getVendor, getDecorations
    bookingService.js    — createBooking, getBooking, updateBooking
    guestService.js      — stub
    notificationService.js — stub
  store/
    auth.store.js        — isAuthenticated, user, isAdmin, login, logout, restoreSession
    plan.store.js        — selectedVenue, selectedCatering, selectedDecorations, selectedVendors,
                           setVenue, setCatering, setDecorations, setVendor, clearPlan, getTotalCost
  contexts/
    PlanBuilderContext.jsx — eventId, setEventId (needs eventDate, setEventDate added)
  pages/
    Survey.jsx, EventPlan.jsx, BookingConfirmation.jsx, BookingSuccess.jsx
    Recommendations.jsx, Catering.jsx, Decorations.jsx, Vendors.jsx
    Login.jsx, Register.jsx, Dashboard.jsx (stub), MyEvents.jsx (mock)
    plan/PlanBuilder.jsx, VenuePick.jsx, SelectCatering.jsx, SelectDecorations.jsx,
         SelectVendors.jsx, PlanSummary.jsx
    admin/AdminDashboard.jsx (stub), ManageVenues.jsx (stub), Analytics.jsx (stub)
  components/
    layout/Navbar.jsx, PageLayout.jsx, Footer.jsx
    plan/PlanProgressBar.jsx

supabase/
  migrations/001-005
  seed/seed_catalog.sql
  functions/ (empty, for future edge functions)
```

## Prompt discipline rules (for the new session)
Always use this pattern — never skip the planning step:

Read CLAUDE.md before starting.

Task: [one specific thing only]

Read these files first:
- [only files relevant to this task]

Summarize current behavior, then propose implementation plan.
Stop. Wait for approval before coding.

Rules:
- Show changed lines only, no full files
- One file at a time
- Do not touch other files
- Do not continue to next task automatically

## Where to continue now
We are currently in the middle of Fix A review on VenuePick.jsx.

Latest verified state:
- SelectCatering.jsx back route matches requirement.
- SelectDecorations.jsx back route matches requirement.
- SelectVendors.jsx back route matches requirement.
- PlanSummary.jsx back route matches requirement.
- VenuePick.jsx has no back button, which is correct.
- A previous change replaced the forward Next/Skip action with Cancel Plan only, which introduced a regression.
- VenuePick.jsx must be corrected so it keeps:
  - no back button
  - a visible Cancel Plan action
  - a working forward path through the plan builder

## Next Claude prompt should be:

Read CLAUDE.md before starting.

Task: Fix A — correct VenuePick.jsx so it satisfies step-1 navigation without breaking forward progression

Read these files first:
- src/pages/plan/VenuePick.jsx

Summarize current behavior, then propose the minimal implementation plan that preserves:
- no back button
- visible Cancel Plan action
- working forward path from VenuePick.jsx

Stop. Wait for approval before coding.

Rules:
- Show changed lines only, no full files
- One file at a time
- Do not touch other files
- Do not continue to next task automatically
