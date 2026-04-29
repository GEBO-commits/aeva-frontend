# AEVA Remaining Build Prompts — Full Document

This document outlines all 14 remaining implementation phases for the AEVA backend integration. Use this as your complete roadmap and reference. Work through them one at a time with Claude, starting with Prompt A.

---

## Prompt A: Vendor Accounts Schema Migration

**Status:** ✅ COMPLETED

**Objective:** Add `vendor_accounts` table and booking status documentation to the schema.

**Tasks:**
- Create `supabase/migrations/004_vendor_accounts.sql`
- Add vendor_accounts table with: id, user_id, vendor_id, status, business_name, contact_email, contact_phone, created_at, updated_at
- Add UNIQUE(user_id), UNIQUE(vendor_id)
- Create indexes on user_id, vendor_id, status
- Add updated_at trigger
- Add RLS policies: vendor can read/update/insert own account (user_id = auth.uid())
- Add SQL comment documenting booking status values (draft, pending, confirmed, cancelled)

**Acceptance:** Migration file created, no existing tables modified, 3 RLS policies attached.

---

## Prompt B: Real Supabase Auth (Login + Register Replacing Mock)

**Objective:** Replace mock login/register pages with real Supabase Auth integration.

**Current state:**
- `/login` and `/register` pages exist but use localStorage mock auth
- `useAuthStore` is a Zustand mock store with dummy login/register functions
- No real auth flow to Supabase

**Tasks:**
1. Extend `authService.js` (currently a stub):
   - `signUpWithEmail(email, password)` → calls `supabase.auth.signUp()`
   - `signInWithEmail(email, password)` → calls `supabase.auth.signIn()`
   - `signOut()` → calls `supabase.auth.signOut()`
   - `getCurrentAuthUser()` → calls `supabase.auth.getUser()`
   - All functions return `{ user, error }`

2. Update `useAuthStore` to:
   - Call real auth service functions instead of mock
   - Store real Supabase user in state
   - Persist auth state using Supabase's localStorage (already handled by client)

3. Update Login page (`src/pages/Login.jsx`):
   - Call `authService.signInWithEmail(email, password)` on form submit
   - Show loading state during auth
   - Show errors from Supabase (weak password, user not found, etc.)
   - Redirect to `/dashboard` on success

4. Update Register page (`src/pages/Register.jsx`):
   - Call `authService.signUpWithEmail(email, password)` on form submit
   - Show loading state
   - Show errors from Supabase
   - Redirect to `/dashboard` on success (Supabase auto-confirms or requires email confirmation)

5. Update Logout flow:
   - Add logout button to ProfileComponent or header
   - Call `authService.signOut()` on click

**Important:** Do not touch planning flows yet. Auth happens in isolation first.

**Acceptance:** 
- Real signup/login working against Supabase Auth
- User created in auth.users, profile auto-created by trigger (003)
- Redirects work
- Errors display correctly

---

## Prompt C: Anonymous Session Merge After Login

**Objective:** When an anonymous user logs in, merge their planning session and events into their authenticated account.

**Current behavior:**
- Anonymous users get auto-signed-in to Supabase Auth with `signInAnonymously()`
- They create planning_sessions and events tied to that anonymous user_id
- When they sign up with email, a new authenticated user_id is created
- Anonymous data is orphaned

**Required behavior:**
- When user signs up/logs in with email, their anonymous planning_session and events must be transferred to the new authenticated user_id
- No data loss
- No duplicate events

**Implementation:**
1. Create `authService.claimAnonymousSession()`:
   - Gets current authenticated user (already logged in with email)
   - Finds any planning_session with status='active' and source='app' (the anonymous session)
   - Updates that planning_session: user_id = authenticated_user.id
   - Updates all events in that session: user_id = authenticated_user.id
   - Returns `{ sessionClaimed: boolean, error }`

2. Call `claimAnonymousSession()` after successful signup/login:
   - In Login.jsx or Register.jsx success handler
   - After redirect to `/dashboard`
   - Log any errors but don't block navigation

3. Edge function consideration (for later phase):
   - If merging becomes complex (e.g., multiple anonymous sessions, conflict resolution), create an Edge Function
   - For now, keep it in authService

**Acceptance:**
- Anonymous user can plan event
- User signs up
- Event transferred to authenticated account
- No duplicates, no loss

---

## Prompt D: Add Event Date to Survey + planningService Update

**Objective:** Collect event date in Survey and persist it to events.event_date.

**Current Survey:**
- Collects: fullName, gender, eventType, guestCount, location, budget
- Missing: event_date

**Tasks:**
1. Add event_date field to `surveySchema` (zod validation):
   - Type: date (ISO 8601 string or Date object)
   - Validate: required, must be in future

2. Add event_date input to Survey page Step 2 (Preferences):
   - HTML5 `<input type="date" />`
   - Minimum: today
   - Display selected date to user

3. Update `createEventFromSurvey()` in planningService.js:
   - Extract event_date from surveyData
   - Pass to events INSERT: `event_date: surveyData.eventDate || null`

4. Update `saveSurveyResponse()` call in Survey.jsx onSubmit:
   - Include eventDate in the response_data

**Acceptance:**
- Survey collects event date
- Date stored in events.event_date
- Date appears in event review step

---

## Prompt E: Auth Gate on "Lock In This Plan" + Redirect Flow

**Objective:** Require authentication before booking confirmation. Unauthenticated users redirect to login.

**Current behavior:**
- EventPlan page "Lock In This Plan" button is always available
- No login check

**Required behavior:**
- If user is not authenticated, clicking "Lock In This Plan" redirects to `/login?redirect=/event-plan`
- After login, user returns to `/event-plan` and can proceed

**Implementation:**
1. Check `isAuthenticated` from `useAuthStore`
2. On "Lock In This Plan" click:
   - If not authenticated: redirect to `/login?redirect=${location.pathname}`
   - If authenticated: proceed (enable "Send Emails to Reserve" flow in next prompt)

3. In Login page:
   - Parse `redirect` query param
   - After successful login, redirect to that URL or `/dashboard` as fallback

**Acceptance:**
- Unauthenticated user on EventPlan sees "Lock In This Plan"
- Click redirects to login
- After login, returns to EventPlan
- Can then confirm booking

---

## Prompt F: Booking Confirmation Screen

**Objective:** Add booking confirmation flow after "Lock In This Plan" is clicked by authenticated user.

**Current state:**
- EventPlan page has "Send Emails to Reserve" button (fake send, no backend)
- No booking record created

**New flow:**
1. User clicks "Lock In This Plan" (authenticated)
2. Show confirmation modal or screen with:
   - Event summary (date, location, guests, budget)
   - Venue, catering, decorations, vendors (from plan)
   - Total estimated cost
   - "Confirm Booking" button

3. On "Confirm Booking":
   - Create booking record in database (status='draft')
   - Show "Booking confirmed" message
   - Show next steps (e.g., "Proceed to payment" or "Review booking")

**Implementation:**
1. Create `bookingService.js` (new):
   - `createBooking(eventId, venuId, vendorIds)` → INSERT to bookings
   - Returns `{ booking, error }`

2. Add confirmation modal to EventPlan page or new `/booking-confirmation` route

3. Call `createBooking()` on confirm button

**Acceptance:**
- Booking record created in database
- Status is 'draft'
- User sees confirmation message

---

## Prompt G: Catalog Seed Script (Venues, Vendors, Availability)

**Objective:** Populate venues, vendors, and availability data for testing and demo.

**Current state:**
- Venues and vendors tables exist but are empty
- Frontend still uses mock data

**Tasks:**
1. Create `supabase/seed.sql` with:
   - 5–10 sample venues (Cairo, Giza, Alexandria)
     - Names, descriptions, capacity, pricing, features (JSON), images
     - is_active = true
   - 10–15 sample vendors (catering, photography, DJ, decorations)
     - Categories, names, pricing, ratings, details (JSON)
     - is_active = true
   - Availability dates for each venue and vendor (next 6 months, sample dates marked as available)

2. Or: Create `supabase/seed.ts` (Edge Function or local script) if SQL is too verbose

3. Test seed locally and document how to run it

**Acceptance:**
- Venues and vendors appear in Supabase dashboard
- Availability is populated
- Can query for venues by city

---

## Prompt H: Vendor Self-Registration + Profile Creation + Admin Approval

**Objective:** Allow vendors to register as vendor users, create profiles, and be flagged for admin approval.

**Current state:**
- vendor_accounts table exists but no flow to create accounts
- No admin approval logic

**Tasks:**
1. Add admin approval flag to vendor_accounts:
   - Add column `is_approved boolean NOT NULL DEFAULT false`

2. Create vendor registration flow:
   - New page `/vendor-register`
   - Form: email, password, business_name, vendor_category, contact_phone
   - On submit:
     - Call `authService.signUpWithEmail(email, password)` (create auth user)
     - Create vendor_accounts row: user_id (new user), vendor_id (vendor_id from form), status='pending', is_approved=false
     - Show "Registration submitted for approval" message

3. Create admin dashboard stub for vendor approval (details in Prompt M)

**RLS update:**
- vendor_accounts SELECT/UPDATE: only if user_id = auth.uid() OR user is admin (for later)

**Acceptance:**
- Vendor can register
- vendor_accounts row created with is_approved=false
- Auth user created
- Profile auto-created by trigger

---

## Prompt I: Booking Engine (Availability Check, Auto-Confirm, Paymob Sandbox)

**Objective:** Check availability when booking is confirmed, auto-confirm if available, integrate Paymob sandbox payment.

**Complex phase. Split into sub-tasks:**

### Sub-task 1: Availability Check
- When booking is created, check if event_date is available for selected venue
- Query venue_availability table
- Also check selected vendors

### Sub-task 2: Auto-Confirm Booking
- If available, update booking status from 'draft' → 'confirmed'
- Lock in vendor and date
- Create booking_vendors records

### Sub-task 3: Paymob Integration
- Integrate Paymob SDK (Egyptian payment provider)
- Create payment intent on booking confirmation
- Show payment form on frontend
- Handle payment success → update payments table, booking status → 'completed'

**This will require Edge Functions for privileged payment operations.**

---

## Prompt J: User Dashboard (Upcoming Events, Booking Status)

**Objective:** Show authenticated users their upcoming events and booking statuses.

**Tasks:**
1. Create `/dashboard` page (protected route):
   - Query events WHERE user_id = auth.uid()
   - Display:
     - Upcoming events (event_date > today)
     - Event title, date, guest count, status
     - Booking status (if exists)
     - Link to event detail / modify / cancel

2. Create event detail page if not exists:
   - Show full event info
   - Show booking info if exists
   - Show selected vendors, venue
   - Show payment status

**Acceptance:**
- User sees their events
- Can click through to details
- Can navigate to modify or cancel

---

## Prompt K: Venue Dashboard

**Objective:** Show venue partners their upcoming bookings and availability management.

**Tasks:**
1. Create `/venue-dashboard` (protected route for venue admins):
   - Query bookings WHERE venue_id = auth.user's_venue
   - Display upcoming bookings
   - Show availability calendar
   - Allow adding/removing availability dates

**This requires venue partner registration (different from vendor).**

---

## Prompt L: Vendor Dashboard

**Objective:** Show vendor partners their booked services and admin options.

**Tasks:**
1. Create `/vendor-dashboard` (protected route for vendors):
   - Query booking_vendors WHERE vendor_id = auth.user's_vendor_id
   - Display confirmed bookings
   - Show status (pending, confirmed, completed)
   - Allow updating status (e.g., "mark as complete")

---

## Prompt M: Admin Dashboard

**Objective:** Give admins oversight of vendors, venues, bookings, payments, and approvals.

**Tasks:**
1. Create `/admin` (protected route, isAdmin flag check):
   - Vendor approval queue
   - Vendor list with approval status
   - Booking overview
   - Payment transactions
   - Analytics (upcoming revenue, booked events, etc.)

2. Add isAdmin flag to profiles table (or create roles table for later extension)

3. Implement admin RLS policies for read-all access on sensitive tables

---

## Prompt N: In-App Notifications + Paymob Webhook Handling

**Objective:** Send real notifications to users for booking status, payment success, and vendor confirmations. Handle Paymob webhooks.

**Tasks:**
1. Notifications module:
   - Create notifications when booking is confirmed
   - Create notifications when payment succeeds
   - Create notifications when vendor confirms availability
   - Display notifications in header or sidebar

2. Webhook handling (Edge Function):
   - Paymob sends payment webhook to `/api/webhooks/paymob`
   - Verify signature
   - Update payments table and booking status
   - Create notification for user

**This is the final integration point for the full booking flow.**

---

## Summary

**Completed phases:**
- ✅ A: Vendor accounts schema
- ✅ B-N: Ready for step-by-step execution

**Next immediate task:** Start **Prompt B** (Real Supabase Auth).

