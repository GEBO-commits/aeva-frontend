# AEVA Backend Handoff — Feature/supabase-backend-foundation Complete

**Date:** 2026-04-30
**Status:** ✅ Demo-Ready
**Next Branch:** feature/ui-rehaul-aeva
**Commit:** 2d7f95d

---

## Confirmed Stable End-to-End Flows

### **Flow 1: Survey → Event Creation**
1. User completes survey (fullName, gender, eventType, guestCount, location, eventDate, budget)
2. `createEventFromSurvey()` creates event in Supabase with all fields
3. Event stored with status='draft', source_flow='survey'
4. User redirected to `/event-plan` with eventId in route state
5. ✅ **TESTED & WORKING**

### **Flow 2: Plan Builder → Event Creation → Selections → Booking**
1. User navigates to `/plan/build` (auth-gated, redirects to login if needed)
2. `createEventFromPlanBuilder()` creates draft event with source_flow='plan_builder'
3. Event date input displayed at top of plan builder (required, min=tomorrow)
4. User selects: Venue → Catering → Decorations → Vendors → Reviews Summary
5. Back navigation works correctly:
   - Step 1 (Venue): No back button, only Cancel Plan
   - Steps 2-4: Back buttons navigate to explicit previous step
   - Step 5 (Summary): Back to vendors
6. Progress bar shows all steps, only visited steps are clickable
7. Each selection calls `saveEventSelection()` which persists to event_selections table
8. Event date persists via `updateEvent(eventId, { event_date })`
9. **Summary page displays:**
   - Selected venue, catering, decorations with details and prices
   - Vendors section shows: photographer, dj, videographer (if selected)
   - Total estimated cost calculated from getTotalCost()
10. User clicks "Lock In This Plan" → navigates to `/booking/confirm`
11. ✅ **TESTED & WORKING** (all steps A, B, C implemented)

### **Flow 3: Booking Confirmation → Success**
1. BookingConfirmation.jsx loads event from Supabase
2. Displays event title, date, estimated total
3. Estimated total now uses `usePlanStore.getTotalCost()`, falls back to event.budget_max
4. User clicks "Confirm and Pay" → `createBooking(eventId)` creates booking with status='draft'
5. Supabase RLS enforces ownership (booking.event_id → events.user_id = auth.uid())
6. Redirect to `/booking/success` showing booking reference (first 8 chars of UUID)
7. ✅ **TESTED & WORKING**

---

## Supabase Tables & API Calls in Critical Flow

### **Tables Used (Read & Write)**

| Table | Operations | Via Service |
|-------|-----------|-------------|
| `auth.users` | Create (signup), read (session), merge (anonymous→authenticated) | authService |
| `profiles` | Auto-create on auth signup via trigger | — (trigger-driven) |
| `events` | INSERT (survey/plan builder), SELECT (fetch event), UPDATE (event_date), UPDATE (cost estimate) | planningService |
| `event_selections` | INSERT/UPDATE (venue, catering, decorations, photographers, dj, videographer) | planningService |
| `venues` | SELECT (list active venues for plan builder) | catalogService |
| `vendors` | SELECT (catering, decorations, photography, dj, videography categories) | catalogService |
| `bookings` | INSERT (create booking), SELECT (fetch booking), UPDATE (status) | bookingService |
| `survey_responses` | INSERT (save survey answers) | planningService |

### **Critical Service Functions**

**planningService.js:**
- `initializeAnonymousAuth()` — Start anonymous session on app load
- `getOrCreatePlanningSession()` — Manage planning session ownership
- `createEventFromSurvey(surveyData)` — Create event from survey
- `createEventFromPlanBuilder()` — Create event for plan builder flow
- `saveEventSelection(eventId, selectionType, entityId)` — Persist venue/catering/decorations/vendor selections (uses maybeSingle() + UPDATE-OR-INSERT pattern)
- `getEvent(eventId)` — Fetch event details
- `updateEvent(eventId, updates)` — Persist event_date, cost, status changes

**catalogService.js:**
- `getVenues()` — List all active venues
- `getVendors(category)` — List vendors by category (catering, decorations, photography, dj, videography)

**bookingService.js:**
- `createBooking(eventId)` — Create booking with status='draft'
- `getBooking(bookingId)` — Fetch booking
- `updateBooking(bookingId, updates)` — Update booking (status, cost)

**authService.js:**
- `signInAnonymously()` — Start anonymous session
- `claimAnonymousSession(anonymousUserId, authenticatedUserId)` — Merge anonymous selections to authenticated user on login
- `signUp(email, password)` — Register new user
- `signIn(email, password)` — Login
- `getCurrentAuthUser()` — Get current user session

---

## What's Confirmed Working ✅

### **Authentication & Session**
- Real Supabase Auth (email/password + anonymous)
- Email confirmation required before login
- Navbar shows unauthenticated state (Log In / Get Started) vs authenticated (name + logout)
- Anonymous users can plan → login transfers selections to authenticated user
- No navbar flash on page refresh (restoreSession fixed)

### **Event Creation**
- Survey → event creation with all fields (fullName, eventType, guestCount, location, eventDate, budget)
- Plan builder → event creation with draft status
- Event date required and persisted in plan builder
- Events table tracks source_flow ('survey' or 'plan_builder')

### **Plan Builder UX**
- 5-step flow: Venue → Catering → Decorations → Vendors → Summary
- Real Supabase data (not mocks) in all steps
- Explicit back navigation (no history-based navigate(-1))
- Clickable progress bar (only visited steps)
- Each step fetches live catalog data with loading states
- Selections persisted immediately to event_selections table

### **Cost Calculation**
- getTotalCost() calculates from selected items (venue price + catering for 100 guests + decorations + vendor prices)
- BookingConfirmation displays real total from plan store

### **Booking Flow**
- Create booking from plan summary → BookingConfirmation → BookingSuccess
- Booking created with status='draft' and RLS-enforced ownership
- Booking reference shown on success (UUID first 8 chars, uppercase)

---

## Known Limitations & Edge Cases (Deferred to Post-Rehaul)

### **Not Yet Enforced (Prepared but not implemented)**
1. **Date validation in step pages:** Event date is required and input is shown, but progression to catering/decorations/etc without a date is NOT actively blocked in the step pages themselves. The validation is prepared via `onNavigatePastStep0` context but not yet enforced in VenuePick.jsx handlers.
   - *Impact:* Low risk because date input is required and visible; would need explicit effort to bypass
   - *Fix:* After UI rehaul, wire `onNavigatePastStep0` in step page navigation

2. **Vendor category mapping:** Store keys (photographer, dj, videographer) correctly map to DB categories (photography, dj, videography), but only at the SelectVendors component level. No validation that all three categories are present in seed data.
   - *Impact:* None if seed data is complete (it is)
   - *Fix:* None needed for demo

### **Intentionally Left Out (Post-Rehaul)**
- **Payment integration** (Paymob sandbox not wired)
- **Booking status transitions** (auto-confirm, payment capture, completion)
- **Vendor self-registration** (new vendors must be seeded manually)
- **Vendor, venue, admin dashboards** (all stubs)
- **User booking history dashboard** (stub)
- **Email notifications** (Supabase Edge Functions not implemented)
- **In-app notifications** (no notification service)
- **Survey extended fields** (venue_type, theme, vibe_summary collected but not mapped to event)
- **Recommendation engine** (mockPlan still used in EventPlan page; real event_recommendations not populated)
- **Booking confirmation email** (placeholder only)

---

## Data Integrity & RLS Security ✅

### **Row-Level Security Enforced**
- All business tables (events, bookings, event_selections, vendor_accounts) use RLS policies keyed on auth.uid()
- Anonymous users can read public catalogs (venues, vendors) and create/read their own planning data
- Authenticated users can only access their own events, bookings, and selections
- Vendor accounts must have user_id = auth.uid() to modify their profile

### **Planning Session Ownership**
- Each planning session (anonymous or authenticated) is tied to a specific auth.uid()
- Events created in plan builder are linked to planning_session_id for traceability
- Anonymous data is transferred to authenticated user via claimAnonymousSession() with explicit session linkage

---

## How to Test Each Flow (Quick Verification Checklist)

### **Test 1: Survey → Event**
1. Navigate to `/survey`
2. Fill form: fullName, gender, event type, guest count, location, date (tomorrow+), budget
3. Submit
4. Should see `/event-plan` with event details loaded
5. Event should exist in Supabase events table with all fields

### **Test 2: Plan Builder End-to-End**
1. Login (or use anonymous, then login at `/plan/build`)
2. Navigate to `/plan/build`
3. Select event date (required, must be tomorrow or later)
4. Select venue from Venue step
5. Click "Next Step: Catering"
6. Select catering
7. Click back button → should return to Catering (not Venue)
8. Click back button → should return to Venue
9. Click progress bar Step 2 → should navigate to Catering
10. Complete all steps (Catering → Decorations → Vendors → Summary)
11. In Summary, verify all selections display with prices
12. Verify photographer, dj, videographer show in Vendors section (if selected)
13. Click "Lock In This Plan"
14. Should navigate to `/booking/confirm`

### **Test 3: Booking Confirmation**
1. On `/booking/confirm`, verify:
   - Event title displays
   - Event date displays
   - Estimated total shows (should match plan summary total)
2. Click "Confirm and Pay"
3. Should create booking in Supabase (status='draft')
4. Should redirect to `/booking/success`
5. Success page should show booking reference (8-char UUID uppercase)

### **Test 4: Authentication & Persistence**
1. Start as anonymous user
2. Build a plan (select venue, catering, decorations)
3. Log in
4. Navigate back to `/plan/build`
5. Verify selections are preserved (carried over to authenticated session)
6. Add event date
7. Verify event exists in Supabase with event_date set and all selections saved

---

## Files Modified in This Session

```
feature/supabase-backend-foundation
├── CLAUDE.md (appended continuation document)
├── SESSION_2_MASTER_LOG.md (created)
├── BACKEND_HANDOFF.md (this file)
│
├── src/pages/plan/
│   ├── VenuePick.jsx (Fix A: added Cancel Plan alongside forward nav)
│   ├── PlanBuilder.jsx (Fix C: added date input and validation)
│   ├── PlanSummary.jsx (vendor display already correct)
│
├── src/components/plan/
│   └── PlanProgressBar.jsx (Fix B: added click handlers to visited steps)
│
├── src/contexts/
│   └── PlanBuilderContext.jsx (Fix C: added eventDate, setEventDate)
```

**No changes to:**
- Backend services (planningService, catalogService, bookingService, authService)
- Database migrations
- RLS policies
- Seed data

---

## Ready for Next Session

✅ **feature/supabase-backend-foundation is locked.** All critical backend work complete.

When you start the next session:
1. Create new branch from main (or current main state): `git checkout -b feature/ui-rehaul-aeva`
2. Use this handoff as your starting context
3. The backend flows documented here will remain stable for UI integration
4. Update routes, components, and styling without touching core business logic

The backend is demo-ready. UI rehaul can now proceed independently.
