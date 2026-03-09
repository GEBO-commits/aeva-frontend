/**
 * PlanBuilder.jsx
 *
 * Wrapper page for the multi-step manual plan building flow.
 * Shows a progress bar at the top with 5 steps:
 *   Venue → Catering → Decorations → Vendors → Summary
 *
 * Uses React Router nested routes for each step.
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

/** Step definitions for the progress bar */
const STEPS = [
    { label: 'Venue', path: '/plan/build/venue' },
    { label: 'Catering', path: '/plan/build/catering' },
    { label: 'Decorations', path: '/plan/build/decorations' },
    { label: 'Vendors', path: '/plan/build/vendors' },
    { label: 'Summary', path: '/plan/build/summary' },
];

export default function PlanBuilder() {
    const location = useLocation();
    const currentIndex = STEPS.findIndex(s => location.pathname.startsWith(s.path));

    return (
        <div className="max-w-5xl mx-auto py-6">
            {/* Page title */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-text-dark">Build Your Own Plan</h1>
                <p className="text-text-muted mt-1">Select your preferred options step by step.</p>
            </div>



            {/* ─── Step content rendered here ─── */}
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <Outlet />
            </motion.div>
        </div>
    );
}
