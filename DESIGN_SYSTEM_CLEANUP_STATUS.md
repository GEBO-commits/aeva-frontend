# Design System Cleanup Status

**Date:** 2026-05-01  
**Branch:** feature/ui-rehaul-aeva  
**Status:** IN PROGRESS — Substantial Progress Made

---

## ✅ Completed (18 files + 2 prototypes)

### Prototype Implementation — Session 4
1. **src/pages/Landing.jsx** ✅ — feat: implement Landing to match prototype exactly (571eb8f)
   - Hero editorial split: left text/stats, right image stack
   - "Three ways to start" cards: all 3 link correctly (/survey, /plan/manual, /chat)
   - "How it works" timeline with 4 steps
   - "Featured inspiration" grid with gradient overlays
   - "Recently planned" section at bottom
   - All buttons wired to correct routes
   - Status: COMPLETE, BUILD PASSES

2. **src/pages/Survey.jsx** ✅ — feat: implement Survey to match prototype exactly (91c0e85)
   - Step 1: occasion grid buttons (Birthday, Wedding, Corporate, etc.)
   - Step 2: vibe multi-select pills (14 options)
   - Step 3: date input, time-of-day as 4 toggle buttons, location, headcount slider, budget slider
   - Step 4: brief card with 4-column stats grid + "What we'll source" tags with icons
   - All steps preserve existing `createEventFromSurvey()` and `saveSurveyResponse()` calls
   - Status: COMPLETE, BUILD PASSES

### Tier 1 — Critical Path (Earlier sessions)
3. **src/pages/EventPlan.jsx** ✅
   - Gradient hero replaced with design tokens
   - Section cards styled with design tokens
   - Button component applied
   - Status: COMPLETE, BUILD PASSES

4. **src/pages/BookingConfirmation.jsx** ✅
   - Complete redesign with design tokens
   - Button component for actions
   - Form inputs styled with design tokens
   - Status: COMPLETE, BUILD PASSES

5. **src/pages/BookingSuccess.jsx** ✅
   - Icon container styled with --aeva-sage
   - Card layout with design tokens
   - Button component for CTA
   - Status: COMPLETE, BUILD PASSES

6. **src/pages/Login.jsx** ✅
   - Auth form styled with design tokens
   - Input focus states using inline handlers
   - Button component for submit
   - Status: COMPLETE, BUILD PASSES

7. **src/pages/Register.jsx** ✅
   - Auth form (create account + email confirmation)
   - Design tokens throughout
   - Button component for actions
   - Status: COMPLETE, BUILD PASSES

8. **src/pages/plan/VenuePick.jsx** ✅
   - Venue grid cards (240px grid)
   - Selection states with --aeva-ink border + check icon
   - Mouse hover effects (transform + shadow)
   - Button component for Back/Skip/Next
   - Status: COMPLETE, BUILD PASSES

9. **src/pages/plan/SelectCatering.jsx** ✅
   - Catering vendor cards (grid layout)
   - Selection states + rating badge
   - View Details + Select buttons
   - Design tokens throughout
   - Status: COMPLETE, BUILD PASSES

### Tier 1 — Plan Builder Steps (3 files) — ADDED
8. **src/pages/plan/SelectDecorations.jsx** ✅
   - Decoration vendor grid following SelectCatering pattern
   - Removed COLOR constants, unified design tokens
   - Selection states, hover effects, price display
   - Status: COMPLETE, BUILD PASSES

9. **src/pages/plan/SelectVendors.jsx** ✅
   - 3-category vendor grid (Photographers, DJs, Videographers)
   - Removed hardcoded COLOR object with category colors
   - Unified `--aeva-ink`/`--aeva-paper` throughout
   - Selection states, price display, navigation buttons
   - Status: COMPLETE, BUILD PASSES

10. **src/pages/plan/PlanSummary.jsx** ✅
    - Full event plan overview (venue, catering, decorations, vendors)
    - Cost summary section with breakdown
    - SummaryItem + VendorSmall + CostRow components all converted
    - Button component for Lock In / AI / Invitations actions
    - Sticky cost sidebar with design tokens
    - Status: COMPLETE, BUILD PASSES

### Tier 2 — Catalog Pages (4 files) — ADDED
11. **src/pages/Recommendations.jsx** ✅
    - Main venue discovery page with filters and sorting
    - Converted header, filter panel, grid, load-more button
    - All classNames replaced with inline styles
    - Grid: `repeat(auto-fill, minmax(240px, 1fr))`
    - Status: COMPLETE, BUILD PASSES

12. **src/pages/Catering.jsx** ✅
    - Public catering vendor browse page
    - CateringCard component converted to design tokens
    - Selection states, hover effects, price display
    - Empty state with design tokens
    - Status: COMPLETE, BUILD PASSES

13. **src/pages/Decorations.jsx** ✅
    - Public decoration packages browse page
    - DecorCard component with selection overlay
    - Theme badge, price, dietary/includes tags
    - Empty state with icon
    - Status: COMPLETE, BUILD PASSES

14. **src/pages/Vendors.jsx** ✅
    - Public vendor browse page (photographers, DJs, videographers)
    - VendorCard component converted to design tokens
    - Category badge, features tags, rating, price
    - Empty state styling
    - Status: COMPLETE, BUILD PASSES

### Tier 2 — Components (2 files) — ADDED
15. **src/components/venue/VenueCard.jsx** ✅
    - Reusable venue card for catalog pages
    - Converted to design tokens
    - Image hover (scale), badge overlays, selection check icon
    - View Details + Select button styling
    - Status: COMPLETE, BUILD PASSES

16. **src/components/venue/VenueFilter.jsx** ✅
    - Sidebar filter component
    - Radio buttons, range slider, select dropdown
    - Reset button with hover states
    - All styling from design tokens
    - Status: COMPLETE, BUILD PASSES

### Deleted Components
- src/components/layout/Navbar.jsx ✅ (replaced by TopNav)
- src/components/layout/Footer.jsx ✅ (replaced by navigation/Footer)

---

## ⏳ In Progress / Remaining (3 prototype pages remaining)

### Prototype Implementation — Remaining
1. **src/pages/plan/PlanBuilder.jsx** — Next
   - 3-column layout: 280px sidebar | flex-1 main | 320px right rail
   - Sidebar: event title, progress indicator, section list with status icons (done/progress/todo)
   - Main: vertical timeline with time stamps, draggable items, grip icons
   - Right rail: budget breakdown with bar chart, AEVA notes cards, "Lock in the plan" button
   - All existing step routing and Supabase calls preserved

2. **src/pages/plan/PlanSummary.jsx** — After PlanBuilder
   - Hero band: 320px image area with dark gradient overlay
   - Display font headline + italic subtitle
   - Detail grid: 4 columns (When / Where / Dress / Bring) with eyebrow labels
   - 2-column section: schedule timeline (left), crew/vendor cards (right)
   - Footer: "Planned with AEVA" badge + button to /booking/confirm
   - All existing vendor/selection data from Zustand store preserved

3. **src/pages/Chat.jsx** — Final prototype page
   - Left panel: eyebrow + display title header, message list with AI avatar + user avatar, timestamps
   - Suggested follow-up pills below messages
   - Input with paperclip + mic + send button
   - Right panel: "Live · drafting plan" badge, progress bar, brief 4-column summary grid
   - Plan items: 64px images + category label (uppercase, letter-spacing 0.14em) + title + "why" text (--aeva-ember) + Swap/Details buttons
   - Streaming indicator with animated dots
   - All existing mock/real AI response logic preserved

## ⏳ Earlier Remaining (19 files)

### Tier 2 — Detail Pages (4 files)
- src/pages/VenueDetail.jsx — Complex: gradient hero, featured image, amenities grid
- src/pages/CateringDetail.jsx — Menu/dietary options display
- src/pages/DecorationsDetail.jsx — Package details, inclusions
- src/pages/VendorDetail.jsx — Portfolio, services, testimonials

### Tier 3 — Dashboard / Secondary (6 files)
- src/pages/Dashboard.jsx — Welcome banner, quick actions, stats cards
- src/pages/MyEvents.jsx — Event list with status badges
- src/pages/EventDetail.jsx — Event detail view
- src/pages/admin/AdminDashboard.jsx — Vendor approval queue, stats
- src/pages/admin/ManageVenues.jsx — Venue management table
- src/pages/admin/Analytics.jsx — Analytics charts

### Tier 3 — Legal Pages (3 files)
- src/pages/legal/PrivacyPolicy.jsx — Text-heavy, minimal styling
- src/pages/legal/TermsOfService.jsx — Text-heavy, minimal styling
- src/pages/legal/Contact.jsx — Form + text

### Tier 4 — Other Pages (2 files)
- src/pages/Invitations.jsx — Guest list, RSVP management

### Tier 5 — Components (3 files)
- src/components/ui/Skeleton.jsx — Check if uses design tokens
- src/components/chat/ChatBot.jsx — Check if uses design tokens
- src/components/chat/ChatWindow.jsx — Check if uses design tokens

---

## Build Status

✅ **Current Build:** `4.43s` — All modules pass, no errors
- CSS: 31.33 kB (gzip: 7.00 kB) — Optimized
- JS: 1,239.37 kB (gzip: 341.52 kB)
- Pre-existing chunk size warning (non-blocking)
- Note: VenueDetail.jsx has duplicate gridTemplateColumns warning (separate issue)

---

## Pattern Applied (Template for Remaining Files)

All completed files follow this pattern:

```jsx
// 1. Import Button component
import { Button } from '../../components/ui/Button';

// 2. Replace inline styles with design tokens
style={{
  background: 'var(--aeva-canvas)',
  borderRadius: 'var(--r-lg)',
  border: '1px solid var(--aeva-line)',
  boxShadow: 'var(--shadow-sm)',
  color: 'var(--aeva-ink)',
  fontSize: '14px',
}}

// 3. Replace Tailwind className with onMouseEnter/Leave handlers
onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}

// 4. Replace hardcoded colors
// ❌ className="bg-primary text-white px-6 py-3"
// ✅ <Button variant="primary">Text</Button>

// 5. Replace old form inputs
// ❌ className="border border-gray-200 focus:ring-2 focus:ring-primary/50"
// ✅ style={{ border: '1px solid var(--aeva-line)', ... }} + focus handlers
```

---

## Next Steps (Priority Order)

### Immediately Doable (Tier 1 Remaining, ~1 hour)
1. Apply SelectCatering pattern to SelectDecorations.jsx (copy/adapt)
2. Apply SelectCatering pattern to SelectVendors.jsx (copy/adapt)
3. Apply ManualSummary pattern to PlanSummary.jsx (card display)
4. Build test, commit

### Quick Wins (Tier 2 Catalog, ~2 hours)
5. Recommendations.jsx (vendor grid → design tokens)
6. Catering, Decorations, Vendors (same pattern)
7. Detail pages (VenueDetail, etc. — simpler, less interactive)

### Remaining Work (Tier 3-5, ~3 hours)
8. Dashboard pages (simpler layout)
9. Legal pages (text-heavy, minimal styling)
10. Components (VenueCard, VenueFilter)
11. Chat components (if used)

---

## Files NOT Changed (As Required)

✅ **All backend services** — No changes to:
- src/services/catalogService.js
- src/services/planningService.js
- src/services/bookingService.js
- src/services/authService.js

✅ **All routes** — No changes to:
- src/App.jsx (router structure intact)
- Route paths (all preserved)

✅ **All auth logic** — Zustand, RLS, session merge untouched

✅ **All form validation** — React Hook Form, Zod validation untouched

✅ **All animations** — Framer Motion patterns preserved

---

## Known Limitations

- **Manual Plan Builder**: Already uses design tokens correctly, no changes needed
- **Chat page**: Already uses design tokens correctly, no changes needed
- **Landing, Survey pages**: Already restyled in Phase 2, no changes needed
- **Design tokens CSS**: Complete and stable

---

## How to Continue

For each remaining file:

1. **Copy the approach** from EventPlan.jsx or SelectCatering.jsx
2. **Replace all classNames** with inline style objects using design token variables
3. **Replace all hardcoded colors** with design token values (--aeva-ink, --aeva-paper, etc.)
4. **Use Button component** for buttons instead of className button
5. **Apply hover/focus states** via onMouseEnter/Leave handlers
6. **Test build** after every 2-3 files
7. **Commit with clear message**

---

## Commits Made

- ✅ `3562ac6` — Manual plan builder complete
- ✅ `89ce3da` — Partial design system cleanup (7 files completed)
- ✅ `ee23519` — Tier 1 Remaining + Tier 2 Catalog (9 files: SelectDecorations, SelectVendors, PlanSummary, Recommendations + components, Catering, Decorations, Vendors)

---

**Status Summary:**
- **Completed:** 16 files (up from 7) — 46% complete
- **Remaining:** 19 files (down from 28) — 54% remaining
- **Build:** Passing ✅ 3.80s
- **Backend:** Untouched ✅
- **Routes:** Preserved ✅
- **CSS reduced:** 60.68 kB → 56.51 kB (6.9% improvement)
