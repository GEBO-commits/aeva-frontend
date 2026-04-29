/**
 * App.jsx — Root router configuration
 * 
 * Public routes: Landing, Login, Register, Survey, Recommendations, Venues,
 *   Catering, Decorations, Vendors, EventPlan, Legal pages, Plan Builder
 * Protected routes (require login): Dashboard, My Events, Events, Invitations, Profile
 * Admin routes: Admin dashboard, Venue management, Analytics
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import PageLayout from './components/layout/PageLayout';
import { AnimatePresence } from 'framer-motion';
import ChatBot from './components/chat/ChatBot';
import { initializeAnonymousAuth } from './services/planningService';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Survey from './pages/Survey';
import MyEvents from './pages/MyEvents';
import EventDetail from './pages/EventDetail';
import Recommendations from './pages/Recommendations';
import VenueDetail from './pages/VenueDetail';
import CateringDetail from './pages/CateringDetail';
import DecorationsDetail from './pages/DecorationsDetail';
import VendorDetail from './pages/VendorDetail';
import Invitations from './pages/Invitations';
import Catering from './pages/Catering';
import Decorations from './pages/Decorations';
import Vendors from './pages/Vendors';
import EventPlan from './pages/EventPlan';

// Legal pages (public, no auth required)
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import Contact from './pages/legal/Contact';

// Plan Builder pages (public — allow browsing without account)
import PlanBuilder from './pages/plan/PlanBuilder';
import VenuePick from './pages/plan/VenuePick';
import SelectCatering from './pages/plan/SelectCatering';
import SelectDecorations from './pages/plan/SelectDecorations';
import SelectVendors from './pages/plan/SelectVendors';
import PlanSummary from './pages/plan/PlanSummary';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageVenues from './pages/admin/ManageVenues';
import Analytics from './pages/admin/Analytics';

const RSVP = () => <div className="p-10">RSVP Page</div>;
const Profile = () => <div className="p-10">Profile</div>;

/** Redirects to /login if user is not authenticated */
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

/** Redirects to / if user is not an admin */
const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default function App() {
  const [authInitialized, setAuthInitialized] = useState(false);
  const restoreSession = useAuthStore(state => state.restoreSession);

  useEffect(() => {
    const initAuth = async () => {
      const { error } = await initializeAnonymousAuth();
      if (error) {
        console.error('[App] Failed to initialize anonymous auth:', error);
      }
      await restoreSession();
      setAuthInitialized(true);
    };

    initAuth();
  }, []);

  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <PageLayout>
        <AnimatePresence mode="wait">
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rsvp/:token" element={<RSVP />} />

            {/* Planning discovery routes */}
            <Route path="/survey" element={<Survey />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/venues/:id" element={<VenueDetail />} />
            <Route path="/catering" element={<Catering />} />
            <Route path="/catering/:id" element={<CateringDetail />} />
            <Route path="/decorations" element={<Decorations />} />
            <Route path="/decorations/:id" element={<DecorationsDetail />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/:id" element={<VendorDetail />} />
            <Route path="/event-plan" element={<EventPlan />} />

            {/* Manual Plan Builder — nested route flow */}
            <Route path="/plan/build" element={<PlanBuilder />}>
              <Route index element={<VenuePick />} />
              <Route path="venue" element={<VenuePick />} />
              <Route path="catering" element={<SelectCatering />} />
              <Route path="decorations" element={<SelectDecorations />} />
              <Route path="vendors" element={<SelectVendors />} />
              <Route path="summary" element={<PlanSummary />} />
            </Route>

            {/* Legal pages — public, no auth */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />

            {/* ── Protected routes (require login) ── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/invitations" element={<Invitations />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* ── Admin routes ── */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/venues" element={<ManageVenues />} />
              <Route path="/admin/analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </PageLayout>
      {/* Global floating AI chat widget — visible on all pages */}
      <ChatBot />
    </Router>
  );
}
