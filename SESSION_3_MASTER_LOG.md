# AEVA Session 3 — UI Rehaul Log

**Date:** 2026-04-30  
**Status:** ✅ Phase 1 + Phase 2 + Phase 3 Complete  
**Branch:** `feature/ui-rehaul-aeva`

---

## Phase 1 — Foundation (Completed)

### Design System

- **`src/styles/design-tokens.css`** — Complete AEVA color palette (ink, paper, ember, sage, danger, warning), typography scales (display-lg/md/sm/xs, body-lg/md, eyebrow, caption), spacing grid (8px increments), radius system (sm/md/lg/xl), shadow scale (sm/md/lg/xl), z-index layers, and keyframe animations (aeva-rise, aeva-pulse)
- **`src/styles/components.css`** — Button variants (primary, ember, ghost, quiet, sm, lg), Tag tones (ember, sage, warning, neutral, danger), form inputs (field, date, range with custom styling), Avatar (sm/md/lg), Card, Progress bar, utility classes (text-muted, bg-warm, etc.)
- **`src/index.css`** — Updated to import design tokens and component styles globally; sets AEVA paper background

### Layout & Navigation

- **`src/components/layout/Shell.jsx`** — Main layout wrapper with flexbox flex-direction column for sticky nav, main content, footer
- **`src/components/navigation/TopNav.jsx`** — Sticky header (position: sticky, top: 0, z-index: 30) with AEVA logo, nav items (Venues, Catering, Decorations, Vendors), Ask AEVA button with Sparkles icon, Dashboard link, notifications bell, user Avatar with initials, logout button, and auth buttons (Log in / Get started). Uses design tokens for colors, spacing, transitions.
- **`src/components/navigation/Footer.jsx`** — Footer with brand section, three nav columns (Plan, Discover, About), copyright, uses design tokens and CSS custom properties

### UI Components

- **`src/components/ui/Button.jsx`** — Reusable button with variant (primary, ember, ghost, quiet) and size (sm, md, lg) modifiers, spreads rest props
- **`src/components/ui/Tag.jsx`** — Badge component with tone variants (ember, sage, warning, neutral, danger), optional size (sm, md), optional icon
- **`src/components/ui/Avatar.jsx`** — Avatar showing initials extracted from name, sizes (sm, md, lg), gradient background

### Export Barrels

- `src/components/ui/index.js`, `src/components/navigation/index.js`, `src/components/layout/index.js` for convenient imports

### Integration

- **`src/components/layout/PageLayout.jsx`** — Updated to use new Shell component instead of separate Navbar/Footer

---

## Phase 2 — Page Rewrites (Completed)

### **1. Landing Page** (`src/pages/Landing.jsx`)

**What Changed:**
- Complete redesign from purple gradient hero to AEVA editorial design (cream paper, dark ink, ember accent)
- 2-column hero split: left side has copy + CTAs + stats, right side has rotated image stack + floating event card
- Three Ways to Start section: 3 cards with dark/light toggle, description, CTA (Conversation, Survey, Manual)
- How It Works: 4-step timeline with circular number indicators, horizontal line connector with filled progress indicator
- Big CTA section at bottom

**What Was Preserved:**
- Navigation behavior: all Links still route correctly to `/chat`, `/survey`, `/plan/build`
- No backend logic changes

**How to Test:**
1. Navigate to `/` (home page)
2. Verify hero displays with "Events, thoughtfully planned" headline
3. Click "Plan with AEVA" → navigates to `/chat`
4. Click "Start with a survey" → navigates to `/survey`
5. Scroll down to see "Three ways to start" and "How it works" sections

---

### **2. Survey Page** (`src/pages/Survey.jsx`)

**What Changed:**
- 4-step multi-part form with linear progress indicator at top (circles + connecting line)
- Step labels: "The basics", "The vibe", "The logistics", "Your brief"
- Each step has custom UI (buttons for event type selection, vibe pills, sliders for budget, brief card display)
- All form validation and data persistence preserved

**What Was Preserved:**
- react-hook-form with zodResolver validation
- All form field names and submission logic
- Calls to `createEventFromSurvey()` and `saveSurveyResponse()`
- Navigation to `/event-plan` on submit with eventId in state

**How to Test:**
1. Navigate to `/survey`
2. Step 0: Select "Birthday", enter name
3. Step 1: Select vibes (buttons toggle, then select guest count)
4. Step 2: Fill date, location, budget slider
5. Step 3: Review brief card showing summary
6. Click "Generate plan" → should create event and navigate to `/event-plan`

---

### **3. Plan Builder Layout** (`src/pages/plan/PlanBuilder.jsx`)

**What Changed:**
- Header with title, Cancel button styled with design tokens
- Date input moved below header in a card-style container with label
- Step outlet wrapped with motion animation
- Removed old Tailwind classes, replaced with design tokens (var(--aeva-*))

**What Was Preserved:**
- Date state management via PlanBuilderContext
- Event creation on mount via `createEventFromPlanBuilder()`
- Date validation logic
- Outlet routing for nested steps

**How to Test:**
1. Navigate to `/plan/build` (requires auth)
2. Verify header displays "Build Your Own Plan"
3. Select event date in date input
4. Verify date persists (saved to Supabase via `updateEvent()`)
5. Proceed to venue step

---

### **4. Plan Progress Bar** (`src/components/plan/PlanProgressBar.jsx`)

**What Changed:**
- Card wrapper styled with design tokens (var(--aeva-canvas), var(--aeva-line), etc.)
- Circular step indicators: ink background, paper text for active/completed; paper-warm background for pending
- Horizontal connector line with filled progress (animated width transition)
- Hover effects on clickable steps (scale, color change)
- All Tailwind classes replaced with inline styles using design tokens

**What Was Preserved:**
- Click handlers for navigating to step routes
- `checkStepCompleted()` logic
- Only allowing clicks on visited steps (i <= currentStep)

**How to Test:**
1. In plan builder, verify progress bar shows all 5 steps
2. Current step should be highlighted (ink background, ring shadow)
3. Click on visited step → should navigate to that step
4. Click on unvisited step → should not navigate (cursor: default)

---

### **5. Booking Confirmation** (`src/pages/BookingConfirmation.jsx`)

**What Changed:**
- Page wrapper styled with maxWidth, margin auto, padding using design tokens
- Layout now uses AEVA design system

**What Was Preserved:**
- Event fetching via `getEvent()`
- Booking creation via `createBooking()`
- Navigation to `/booking/success` with bookingId
- All error handling and loading states

**How to Test:**
1. Complete plan builder and reach PlanSummary
2. Click "Lock In This Plan"
3. Should navigate to `/booking/confirm` with eventId in state
4. Click "Confirm and Pay"
5. Should create booking and navigate to `/booking/success`

---

### **6. Booking Success** (`src/pages/BookingSuccess.jsx`)

**What Changed:**
- Styling updated to use design tokens (minimal changes, mostly layout)

**What Was Preserved:**
- Booking reference display logic
- All data fetching and display

**How to Test:**
1. After confirming booking, should see success page
2. Booking reference (first 8 chars of UUID) should display in uppercase
3. Celebratory message should be shown

---

## Phase 3 — Chat Page (Completed)

### **7. Chat Page** (`src/pages/Chat.jsx`)

**What Changed:**
- Complete new 2-column layout: chat panel (left) + live plan assembly (right)
- Chat panel: messages with avatars, streaming indicators, suggested follow-up buttons, input with send button
- Live plan panel: sticky header with progress bar, brief summary card, plan items that appear progressively, total cost card
- Messages use Avatar component, plan items use Tag component
- All styled with design tokens

**What Was Preserved:**
- Navigation behaviors (links to `/event-plan`, `/booking/confirm`)
- Message state management
- Mock AI responses (can be wired to real API later)

**How to Test:**
1. Navigate to `/chat` (public route)
2. Verify initial AI greeting message appears
3. Type a message and press Enter or click Send
4. Verify message appears as user bubble
5. Watch plan items appear progressively on right panel
6. When all items appear, total cost card should be shown
7. Click "Review & approve" → should navigate to `/booking/confirm`

---

## Manual Plan Builder Feature (Completed)

A completely new standalone plan builder flow at `/plan/manual` with 5 nested steps. This feature fixes the previous faulty plan builder by using explicit step routing (not history-based navigation), ensuring all selections persist to Supabase, and applying the AEVA design system throughout.

### **Overview**

**What Changed:**
- Created 6 new components: `ManualPlanBuilder.jsx` (main wrapper), `ManualVenuePick.jsx`, `ManualCatering.jsx`, `ManualDecorations.jsx`, `ManualVendors.jsx`, `ManualSummary.jsx`
- Added nested route structure in `src/App.jsx` for `/plan/manual` and its 5 steps
- All steps use explicit route navigation (no history.back())
- Every selection immediately saves to Supabase via `saveEventSelection()`
- Loading states with pulse skeleton animations
- Grid card layouts with visual feedback (border highlight, check icon for selected items)

**What Was Preserved:**
- All backend service calls: `createEventFromPlanBuilder()`, `getVenues()`, `getVendors()`, `saveEventSelection()`, `updateEvent()`
- Zustand store for local selection state: `usePlanStore` (selectedVenue, selectedCatering, selectedDecorations, selectedPhotographer, selectedDj, selectedVideographer, getTotalCost)
- PlanBuilderContext for eventId, eventDate, setEventDate
- Event creation with source_flow: 'plan_builder' on mount
- All RLS and authorization logic in Supabase remains unchanged

**Detailed Files:**

#### **1. ManualPlanBuilder.jsx** (`src/pages/plan/manual/ManualPlanBuilder.jsx`)
- Main wrapper with PlanBuilderContext provider
- STEPS array defining step order: Venue → Catering → Decorations → Vendors → Summary
- Explicit step routing via URL (no history.back())
- Header with title and Cancel button
- Date input below header (min = tomorrow, required before proceeding)
- Progress bar showing current step with back/next navigation
- Outlet for nested step rendering
- Calls `createEventFromPlanBuilder()` on mount, `updateEvent()` when date changes, `clearPlan()` on cancel
- Loading spinner during initialization

#### **2. ManualVenuePick.jsx** (`src/pages/plan/manual/ManualVenuePick.jsx`)
- Step 1: Venue selection
- Fetches venues via `getVenues()`
- Grid layout: image (160px), name, rating, location (with MapPin icon), price range, capacity, venue type tag
- Selected venue highlighted with border and check icon
- On selection: calls `saveEventSelection(eventId, 'venue', venue.id)`
- Loading skeleton (pulse animation on 6 placeholder cards)
- Empty state: "No venues available"

#### **3. ManualCatering.jsx** (`src/pages/plan/manual/ManualCatering.jsx`)
- Step 2: Catering selection
- Reusable wrapper calling ManualVendorPicker
- Props: category='catering', label='Catering', icon='🍽️', storeKey='selectedCatering'

#### **4. ManualDecorations.jsx** (`src/pages/plan/manual/ManualDecorations.jsx`)
- Step 3: Decorations selection
- Reusable wrapper calling ManualVendorPicker
- Props: category='decorations', label='Decorations', icon='🌸', storeKey='selectedDecorations'

#### **5. ManualVendors.jsx** (`src/pages/plan/manual/ManualVendors.jsx`)
- Step 4: Multiple vendor categories (Photography, DJ, Videography)
- Each category has its own VendorCategorySection sub-component
- Each section: fetches vendors, displays grid cards, handles selection with `saveEventSelection()`
- Vendor categories map: photography → selectedPhotographer, dj → selectedDj, videography → selectedVideographer

#### **6. ManualVendorPicker.jsx** (`src/pages/plan/manual/ManualVendorPicker.jsx`)
- Reusable component for single vendor category selection
- Props: category, label, icon, storeKey, setFn, eventSelectionType
- Fetches via `getVendors(category)`
- Grid cards: image (140px), name, description, price, feature tags
- Selected vendor: border highlight, check icon
- On selection: calls `saveEventSelection(eventId, eventSelectionType, vendor.id)`
- Loading skeleton (pulse animation)
- Empty state: centered message

#### **7. ManualSummary.jsx** (`src/pages/plan/manual/ManualSummary.jsx`)
- Step 5: Review all selections
- Grid of 6 summary cards (Venue, Catering, Decorations, Photography, DJ, Videography)
- Each card shows: icon, label, name, description, price (or "Not selected" if empty)
- Dark center box: "Estimated Total" with getTotalCost()
- CTA buttons: "Go Back" (navigate to vendors step) and "Lock In This Plan" (navigate to /booking/confirm with eventId)

### **How to Test Manual Plan Builder:**

1. **Start the flow:**
   - Navigate to `/plan/manual`
   - Should show step 1 (Venue Pick) with date input and progress bar

2. **Date validation:**
   - Try selecting today or past date → should not allow
   - Select tomorrow or later → should persist to event

3. **Venue selection:**
   - Should see grid of 6+ venue cards (or loading skeleton)
   - Click any venue → check icon appears, border highlights
   - Card shows name, location, rating, price range, capacity, type
   - Navigation continues to next step

4. **Catering step:**
   - Should show grid of catering vendors
   - Click to select → visual feedback (border, check)
   - Back button should navigate to venue step
   - Next button → decorations step

5. **Decorations step:**
   - Same flow as catering
   - Back → catering, Next → vendors

6. **Vendors step (Photography, DJ, Videography):**
   - Should show 3 categories
   - Each category has grid of vendor cards
   - Can select one per category independently
   - Visual feedback for selected vendors (border, check)

7. **Summary step:**
   - All 6 items should display (with selected items highlighted, unselected showing "Not selected")
   - Total cost should display (sum of selected items)
   - "Go Back" button → vendors step
   - "Lock In This Plan" → `/booking/confirm` with eventId in state

8. **Verify persistence:**
   - In browser DevTools → Supabase → event_selections table
   - Should see entries for each selected vendor (event_id, selection_type, entity_id)
   - Refresh page mid-flow → selections should persist

### **Routes Updated in App.jsx:**
```jsx
<Route path="/plan/manual" element={<ManualPlanBuilder />}>
  <Route index element={<ManualVenuePick />} />
  <Route path="venue" element={<ManualVenuePick />} />
  <Route path="catering" element={<ManualCatering />} />
  <Route path="decorations" element={<ManualDecorations />} />
  <Route path="vendors" element={<ManualVendors />} />
  <Route path="summary" element={<ManualSummary />} />
</Route>
```

---

## Routes Updated

- **`src/App.jsx`** — Added Chat import and route: `<Route path="/chat" element={<Chat />} />`
- **`src/App.jsx`** — Added Manual Plan Builder imports and nested routes: `/plan/manual` with 5 child routes (venue, catering, decorations, vendors, summary)

---

## What Is Stable ✅

After Phase 1 + 2 + 3:

- **Design System:** Complete color palette, typography, spacing, radius, shadow, animation tokens defined and applied globally
- **Shell Layout:** TopNav, Footer, PageLayout working together; all pages render within Shell
- **Core Pages Restyled:**
  - Landing: hero, three ways, how-it-works sections
  - Survey: 4-step intake with validation
  - Plan Builder: date input, progress bar, nested steps
  - Chat: 2-column layout with live plan assembly
  - Booking pages: confirmation and success flows
- **Authentication:** Still working; user state, logout, dashboard navigation intact
- **Backend Integration:** All Supabase calls (createEventFromSurvey, saveEventSelection, createBooking, getEvent, etc.) preserved and functional
- **Navigation:** All routes working; navigation flows (survey → event-plan → booking → success) validated

---

## Known Issues / Deferred

### **Not Yet Restyled (Lower Priority)**

1. **Plan Builder Step Pages** (VenuePick, SelectCatering, SelectDecorations, SelectVendors, PlanSummary)
   - Currently still use Tailwind classes, not full design tokens
   - Backend logic is intact; styling is old
   - Plan: Restyle in next session or follow-up

2. **Catalog Pages** (Recommendations, Catering, Decorations, Vendors)
   - Still using old Tailwind styling
   - Backend catalog fetches working correctly
   - Plan: Restyle in next session

3. **Login / Register Pages**
   - Minimal styling updates; still functional
   - Plan: Polish in next session

4. **Dashboard** (currently stub)
   - Page exists but not fully implemented
   - Plan: Implement in Prompt J

5. **Vendor / Admin Dashboards**
   - Still stubs
   - Plan: Implement in future prompts (H, K, L, M)

### **Intentionally Deferred**

- Payment integration (Paymob sandbox)
- Real AI chat responses (using mock responses for now)
- Vendor self-registration flow
- Email notifications
- Booking status transitions

---

## Next Session Starts Here

**Priority Order:**

1. **Finish Plan Builder Step Pages** (VenuePick, SelectCatering, SelectDecorations, SelectVendors, PlanSummary)
   - Convert to grid card layouts using design tokens
   - Preserve all backend selection logic

2. **Restyle Catalog Pages** (Recommendations, Catering, Decorations, Vendors)
   - Convert cards to AEVA grid layouts

3. **Implement Dashboard** (Prompt J)
   - List user's upcoming events
   - Show event cards with progress

4. **Implement Vendor Self-Registration** (Prompt H)
   - Registration form
   - Vendor account creation

5. **Polish & Testing**
   - Mobile responsive design
   - Cross-browser testing
   - Performance optimization

6. **Wire Chat to Real AI** (Optional)
   - Replace mock responses with actual AI integration if available

---

## Files Modified Summary

### Phase 1 Foundation
- `src/styles/design-tokens.css` (created)
- `src/styles/components.css` (created)
- `src/components/ui/Button.jsx` (created)
- `src/components/ui/Tag.jsx` (created)
- `src/components/ui/Avatar.jsx` (created)
- `src/components/navigation/TopNav.jsx` (created)
- `src/components/navigation/Footer.jsx` (created)
- `src/components/layout/Shell.jsx` (created)
- `src/components/layout/PageLayout.jsx` (updated)
- `src/index.css` (updated — imports)

### Phase 2 Pages
- `src/pages/Landing.jsx` (rewrote)
- `src/pages/Survey.jsx` (rewrote)
- `src/pages/plan/PlanBuilder.jsx` (updated)
- `src/components/plan/PlanProgressBar.jsx` (updated)
- `src/pages/BookingConfirmation.jsx` (updated)

### Phase 3 Chat
- `src/pages/Chat.jsx` (created)
- `src/App.jsx` (added Chat route)

### Manual Plan Builder
- `src/pages/plan/manual/ManualPlanBuilder.jsx` (created)
- `src/pages/plan/manual/ManualVenuePick.jsx` (created)
- `src/pages/plan/manual/ManualCatering.jsx` (created)
- `src/pages/plan/manual/ManualDecorations.jsx` (created)
- `src/pages/plan/manual/ManualVendors.jsx` (created)
- `src/pages/plan/manual/ManualVendorPicker.jsx` (created)
- `src/pages/plan/manual/ManualSummary.jsx` (created)
- `src/App.jsx` (added Manual Plan Builder imports and routes)

---

**Build Status:** ✅ All builds passing  
**Deployment Ready:** ✅ Ready for QA and testing
