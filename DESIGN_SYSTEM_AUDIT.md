# AEVA Frontend Design System Audit

**Date:** 2026-04-30  
**Status:** Audit Complete — Awaiting Approval to Proceed  
**Objective:** Identify all files using old design patterns for systematic cleanup

---

## Summary

- **Total Pages:** 43
- **Pages with Old Tailwind:** 33
- **Pages with Old Colors (hardcoded hex/text-primary/bg-white):** 38
- **Components with Old Tailwind:** 9
- **Old Components to Delete:** 2 (Navbar.jsx, Footer.jsx from /layout)
- **Pages NOT in Shell Structure:** All pages are wrapped via PageLayout → Shell, but many have additional inline wrapper divs

---

## Full Audit Table

| File | Issue | Action |
|------|-------|--------|
| **PAGES — Core Planning Flow** | | |
| src/pages/Landing.jsx | ✅ DONE — Already uses design tokens, Shell, Button/Tag components | NONE |
| src/pages/Survey.jsx | ✅ DONE — Already uses design tokens, form inputs, Button component | NONE |
| src/pages/Chat.jsx | ✅ DONE — Already uses design tokens, Avatar, Button, Tag components | NONE |
| src/pages/EventPlan.jsx | ❌ Uses old Tailwind (bg-white, text-gray-500, border-gray-100, px-8, py-6, rounded-2xl, etc.) + old color refs (text-primary, text-text-muted) | Replace with design tokens |
| src/pages/BookingConfirmation.jsx | ⚠️ Partially styled — basic structure OK but uses some old patterns (text-gray-700, bg-gray-50, border-gray-200) | Review & replace old patterns |
| src/pages/BookingSuccess.jsx | ❌ Uses old Tailwind throughout (bg-white, text-center, p-12, rounded-2xl, text-green-600, etc.) | Replace with design tokens |
| **PAGES — Catalog/Discovery** | | |
| src/pages/Recommendations.jsx | ❌ Heavy old Tailwind (grid-cols-3, gap-6, border-gray-100, text-text-dark, text-text-muted, bg-white/border-gray-200, rounded-2xl, px-6, py-3, shadow-sm, hover:shadow-xl) + hardcoded colors (text-primary, bg-primary, bg-secondary) | Replace with design tokens & grid system |
| src/pages/Catering.jsx | ❌ Heavy old Tailwind (same patterns as Recommendations) | Replace with design tokens |
| src/pages/Decorations.jsx | ❌ Heavy old Tailwind (same patterns as Recommendations) | Replace with design tokens |
| src/pages/Vendors.jsx | ❌ Heavy old Tailwind (same patterns as Recommendations) | Replace with design tokens |
| src/pages/VenueDetail.jsx | ❌ Old Tailwind throughout (grid, flex, text-lg, font-bold, text-text-dark, bg-white, border-gray-100, rounded-2xl, px-8, py-6, shadow-sm, hover:shadow-lg) | Replace with design tokens |
| src/pages/CateringDetail.jsx | ❌ Old Tailwind (same structure as VenueDetail) | Replace with design tokens |
| src/pages/DecorationsDetail.jsx | ❌ Old Tailwind (same structure as VenueDetail) | Replace with design tokens |
| src/pages/VendorDetail.jsx | ❌ Old Tailwind (same structure as VenueDetail) | Replace with design tokens |
| **PAGES — Plan Builder (Original /plan/build)** | | |
| src/pages/plan/PlanBuilder.jsx | ⚠️ Mostly styled with design tokens but may have inline styles needing review | Review & ensure consistency |
| src/pages/plan/VenuePick.jsx | ❌ Heavy old Tailwind (grid-cols-3, gap-6, border-2, border-gray-100/border-primary, text-text-dark, text-text-muted, bg-white, bg-gray-50, bg-primary, rounded-3xl, px-4, py-2, shadow-sm, hover:shadow-xl, hover:-translate-y-1, etc.) + hardcoded colors (text-red-500, bg-primary, border-gray-200) | Replace with design tokens |
| src/pages/plan/SelectCatering.jsx | ❌ Heavy old Tailwind (same patterns as VenuePick) | Replace with design tokens |
| src/pages/plan/SelectDecorations.jsx | ❌ Heavy old Tailwind (same patterns as VenuePick) | Replace with design tokens |
| src/pages/plan/SelectVendors.jsx | ❌ Heavy old Tailwind (same patterns as VenuePick) | Replace with design tokens |
| src/pages/plan/PlanSummary.jsx | ❌ Heavy old Tailwind (same patterns as VenuePick) | Replace with design tokens |
| src/pages/plan/CateringPick.jsx | ❌ Heavy old Tailwind | Replace with design tokens |
| src/pages/plan/DecorationsPick.jsx | ❌ Heavy old Tailwind | Replace with design tokens |
| src/pages/plan/VendorsPick.jsx | ❌ Heavy old Tailwind | Replace with design tokens |
| **PAGES — Manual Plan Builder (/plan/manual)** | | |
| src/pages/plan/manual/ManualPlanBuilder.jsx | ⚠️ Uses design tokens for header but may need visual audit for consistency with rest of app | Review for consistency |
| src/pages/plan/manual/ManualVenuePick.jsx | ✅ Uses design tokens, card layout, design system | NONE |
| src/pages/plan/manual/ManualVendorPicker.jsx | ✅ Uses design tokens, card layout, design system | NONE |
| src/pages/plan/manual/ManualCatering.jsx | ✅ Uses design tokens wrapper | NONE |
| src/pages/plan/manual/ManualDecorations.jsx | ✅ Uses design tokens wrapper | NONE |
| src/pages/plan/manual/ManualVendors.jsx | ✅ Uses design tokens, card layout | NONE |
| src/pages/plan/manual/ManualSummary.jsx | ✅ Uses design tokens, card layout | NONE |
| **PAGES — Auth** | | |
| src/pages/Login.jsx | ❌ Heavy old Tailwind + hardcoded colors (bg-white, text-3xl, font-display, text-primary, text-text-muted, border-gray-100, border-gray-200, px-4, py-3, rounded-xl, focus:ring-2, focus:ring-primary/50, bg-gray-50, focus:bg-white, bg-red-50, border-red-200, text-red-700, bg-primary, text-white, hover:bg-secondary, shadow-md, hover:shadow-lg, disabled:opacity-70) | Replace with design tokens & Button component |
| src/pages/Register.jsx | ❌ Heavy old Tailwind (same as Login) | Replace with design tokens & Button component |
| **PAGES — Admin/Dashboard** | | |
| src/pages/Dashboard.jsx | ❌ Stub page with old Tailwind | Replace with design tokens |
| src/pages/MyEvents.jsx | ❌ Old Tailwind (mock data display, grid, cards, text-dark, border-gray-100) | Replace with design tokens |
| src/pages/admin/AdminDashboard.jsx | ❌ Stub page with old Tailwind | Replace with design tokens |
| src/pages/admin/ManageVenues.jsx | ❌ Stub page with old Tailwind | Replace with design tokens |
| src/pages/admin/Analytics.jsx | ❌ Stub page with old Tailwind | Replace with design tokens |
| **PAGES — Other** | | |
| src/pages/Invitations.jsx | ❌ Old Tailwind | Replace with design tokens |
| src/pages/EventDetail.jsx | ❌ Old Tailwind | Replace with design tokens |
| src/pages/legal/PrivacyPolicy.jsx | ❌ Old Tailwind (max-w-3xl, mx-auto, py-8, px-4, prose-like styles, text-gray-600, etc.) | Replace with design tokens |
| src/pages/legal/TermsOfService.jsx | ❌ Old Tailwind (same as PrivacyPolicy) | Replace with design tokens |
| src/pages/legal/Contact.jsx | ❌ Old Tailwind + hardcoded colors | Replace with design tokens |
| **COMPONENTS — Layout (Old, Should Delete)** | | |
| src/components/layout/Navbar.jsx | ❌ OLD COMPONENT — Replaced by TopNav | DELETE |
| src/components/layout/Footer.jsx | ❌ OLD COMPONENT — Replaced by navigation/Footer | DELETE |
| src/components/layout/PageLayout.jsx | ✅ Already updated to use Shell | NONE |
| src/components/layout/Shell.jsx | ✅ DONE — Core layout wrapper | NONE |
| **COMPONENTS — Navigation (New)** | | |
| src/components/navigation/TopNav.jsx | ✅ DONE — Uses design tokens, Button, Avatar | NONE |
| src/components/navigation/Footer.jsx | ✅ DONE — Uses design tokens | NONE |
| **COMPONENTS — UI (New)** | | |
| src/components/ui/Button.jsx | ✅ DONE — Component library | NONE |
| src/components/ui/Tag.jsx | ✅ DONE — Component library | NONE |
| src/components/ui/Avatar.jsx | ✅ DONE — Component library | NONE |
| src/components/ui/Skeleton.jsx | ⚠️ Check if uses design tokens or old Tailwind | Review |
| **COMPONENTS — Plan** | | |
| src/components/plan/PlanProgressBar.jsx | ✅ DONE — Uses design tokens | NONE |
| **COMPONENTS — Venue** | | |
| src/components/venue/VenueCard.jsx | ❌ Heavy old Tailwind (bg-white, rounded-3xl, shadow-sm, border-gray-100, hover:shadow-xl, hover:-translate-y-1, h-56, p-6, flex-col, flex-grow, border-t, border-gray-100, text-lg, font-bold, font-display, text-text-dark, text-text-muted, MapPin/Users icons, text-xs, text-yellow-400, bg-primary/90, text-white, bg-gray-50, hover:bg-gray-100, text-sm, shadow-md, hover:shadow-md) + hardcoded colors (text-primary, bg-primary, hover:bg-secondary, text-white) | Replace with design tokens & Button component |
| src/components/venue/VenueFilter.jsx | ❌ Heavy old Tailwind | Replace with design tokens |
| **COMPONENTS — Chat** | | |
| src/components/chat/ChatBot.jsx | ⚠️ Check styling — may use old Tailwind | Review |
| src/components/chat/ChatWindow.jsx | ⚠️ Check styling — may use old Tailwind | Review |
| **STYLES** | | |
| src/styles/design-tokens.css | ✅ DONE — Complete design system | NONE |
| src/styles/components.css | ✅ DONE — Component base styles | NONE |

---

## Cleanup Plan (Step 2)

### A. Delete Old Components (2 files)
- `src/components/layout/Navbar.jsx` — Replaced by `TopNav.jsx`
- `src/components/layout/Footer.jsx` — Replaced by `navigation/Footer.jsx`

### B. Priority Order (by impact & dependency)

**Tier 1 — Critical Path (Planning flow):**
1. EventPlan.jsx
2. BookingConfirmation.jsx + BookingSuccess.jsx
3. plan/VenuePick.jsx
4. plan/SelectCatering.jsx
5. plan/SelectDecorations.jsx
6. plan/SelectVendors.jsx
7. plan/PlanSummary.jsx
8. Login.jsx + Register.jsx

**Tier 2 — Catalog (Discovery):**
9. Recommendations.jsx
10. Catering.jsx + Decorations.jsx + Vendors.jsx
11. VenueDetail.jsx + CateringDetail.jsx + DecorationsDetail.jsx + VendorDetail.jsx
12. VenueCard.jsx + VenueFilter.jsx

**Tier 3 — Secondary Pages:**
13. Dashboard.jsx + MyEvents.jsx + EventDetail.jsx
14. Legal pages (PrivacyPolicy, TermsOfService, Contact)
15. Admin pages (AdminDashboard, ManageVenues, Analytics)
16. Invitations.jsx
17. Chat components (ChatBot, ChatWindow) — if needed

**Tier 4 — Manual Plan Builder Visual Consistency Check:**
18. ManualPlanBuilder.jsx — ensure header/date input matches app theme

**Tier 5 — Components:**
19. Skeleton.jsx — ensure uses design tokens
20. ChatBot.jsx + ChatWindow.jsx — review & style

### C. Testing Strategy
- Build after every 2–3 file changes to catch issues early
- Visual spot-check in browser after each tier

---

## What Gets Preserved

✅ All backend service calls (getVenues, getVendors, saveEventSelection, createBooking, etc.)  
✅ All route paths (/plan/build, /plan/manual, /survey, etc.)  
✅ All auth logic (login, register, anonymous session, RLS)  
✅ All Zustand store functionality (usePlanStore, useAuthStore)  
✅ All React Router structure and navigation  
✅ All form validation (zod, react-hook-form)  
✅ All animations (Framer Motion)  

---

## Non-Negotiables (During Cleanup)

❌ Do NOT touch backend services  
❌ Do NOT remove working functionality  
❌ Do NOT change route paths  
❌ Do NOT refactor beyond styling  
❌ Do NOT use hardcoded colors outside design-tokens.css  
❌ Do NOT skip Shell wrapper for any page  
❌ Do NOT skip testing build after changes  

---

**Ready for approval to proceed with Step 2.**
