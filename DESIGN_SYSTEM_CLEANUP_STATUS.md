# Design System Cleanup Status

**Date:** 2026-05-01  
**Branch:** feature/ui-rehaul-aeva  
**Status:** IN PROGRESS — Substantial Progress Made

---

## ✅ Completed (7 files)

### Tier 1 — Critical Path
1. **src/pages/EventPlan.jsx** ✅
   - Gradient hero replaced with design tokens (--aeva-ink, --aeva-paper)
   - Section cards styled with design tokens
   - Button component applied
   - Status: COMPLETE, BUILD PASSES

2. **src/pages/BookingConfirmation.jsx** ✅
   - Complete redesign with design tokens
   - Button component for actions
   - Form inputs styled with design tokens
   - Status: COMPLETE, BUILD PASSES

3. **src/pages/BookingSuccess.jsx** ✅
   - Icon container styled with --aeva-sage
   - Card layout with design tokens
   - Button component for CTA
   - Status: COMPLETE, BUILD PASSES

4. **src/pages/Login.jsx** ✅
   - Auth form styled with design tokens
   - Input focus states using inline handlers
   - Button component for submit
   - Status: COMPLETE, BUILD PASSES

5. **src/pages/Register.jsx** ✅
   - Auth form (create account + email confirmation)
   - Design tokens throughout
   - Button component for actions
   - Status: COMPLETE, BUILD PASSES

6. **src/pages/plan/VenuePick.jsx** ✅
   - Venue grid cards (240px grid)
   - Selection states with --aeva-ink border + check icon
   - Mouse hover effects (transform + shadow)
   - Button component for Back/Skip/Next
   - Status: COMPLETE, BUILD PASSES

7. **src/pages/plan/SelectCatering.jsx** ✅
   - Catering vendor cards (grid layout)
   - Selection states + rating badge
   - View Details + Select buttons
   - Design tokens throughout
   - Status: COMPLETE, BUILD PASSES

### Deleted Components
- src/components/layout/Navbar.jsx ✅ (replaced by TopNav)
- src/components/layout/Footer.jsx ✅ (replaced by navigation/Footer)

---

## ⏳ In Progress / Remaining (28 files)

### Tier 1 — Step Pages (3 files)
- **src/pages/plan/SelectDecorations.jsx** — Ready to apply SelectCatering pattern
- **src/pages/plan/SelectVendors.jsx** — Ready to apply SelectCatering pattern
- **src/pages/plan/PlanSummary.jsx** — Ready to apply ManualSummary pattern

### Tier 2 — Catalog Pages (4 files)
- src/pages/Recommendations.jsx
- src/pages/Catering.jsx
- src/pages/Decorations.jsx
- src/pages/Vendors.jsx

### Tier 2 — Detail Pages (4 files)
- src/pages/VenueDetail.jsx
- src/pages/CateringDetail.jsx
- src/pages/DecorationsDetail.jsx
- src/pages/VendorDetail.jsx

### Tier 3 — Dashboard / Secondary (5 files)
- src/pages/Dashboard.jsx
- src/pages/MyEvents.jsx
- src/pages/EventDetail.jsx
- src/pages/admin/AdminDashboard.jsx
- src/pages/admin/ManageVenues.jsx
- src/pages/admin/Analytics.jsx

### Tier 3 — Legal Pages (3 files)
- src/pages/legal/PrivacyPolicy.jsx
- src/pages/legal/TermsOfService.jsx
- src/pages/legal/Contact.jsx

### Tier 4 — Other Pages (2 files)
- src/pages/Invitations.jsx

### Tier 5 — Components (4 files)
- src/components/venue/VenueCard.jsx — Old Tailwind, needs design tokens
- src/components/venue/VenueFilter.jsx — Old Tailwind, needs design tokens
- src/components/ui/Skeleton.jsx — Check if uses design tokens
- src/components/chat/ChatBot.jsx — Check if uses design tokens
- src/components/chat/ChatWindow.jsx — Check if uses design tokens

---

## Build Status

✅ **Current Build:** `3.74s` — All modules pass, no errors
- CSS: 60.68 kB (gzip: 11.25 kB)
- JS: 1,244.23 kB (gzip: 353.36 kB)
- Pre-existing chunk size warning (non-blocking)

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

---

**Status Summary:**
- **Completed:** 7 files + cleanup
- **Remaining:** 28 files (highly automatable)
- **Build:** Passing ✅
- **Backend:** Untouched ✅
- **Routes:** Preserved ✅
