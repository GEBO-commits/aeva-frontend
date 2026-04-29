/**
 * PlanBuilder.jsx
 *
 * Wrapper page for the multi-step manual plan building flow.
 * Shows a progress bar at the top with 5 steps:
 *   Venue → Catering → Decorations → Vendors → Summary
 *
 * Uses React Router nested routes for each step.
 * Requires authentication; creates a draft event on mount.
 */

import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { usePlanStore } from '../../store/plan.store';
import { createEventFromPlanBuilder } from '../../services/planningService';
import { PlanBuilderProvider } from '../../contexts/PlanBuilderContext';

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
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [eventId, setEventId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const currentIndex = STEPS.findIndex(s => location.pathname.startsWith(s.path));

    useEffect(() => {
        const initializePlanBuilder = async () => {
            // Redirect to login if not authenticated
            if (!isAuthenticated) {
                navigate('/login', { state: { from: '/plan/build' } });
                return;
            }

            // Create a draft event for this plan builder session
            const { event, error } = await createEventFromPlanBuilder();
            if (error) {
                console.error('[PlanBuilder] Failed to create event:', error);
                setIsLoading(false);
                return;
            }

            setEventId(event.id);
            setIsLoading(false);
        };

        initializePlanBuilder();
    }, [isAuthenticated, navigate]);

    // Show loading spinner while creating event
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <PlanBuilderProvider initialEventId={eventId}>
            <div className="max-w-5xl mx-auto py-6">
                {/* Page title */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-text-dark">Build Your Own Plan</h1>
                        <p className="text-text-muted mt-1">Select your preferred options step by step.</p>
                    </div>
                    <button
                        onClick={() => {
                            usePlanStore.getState().clearPlan();
                            navigate('/');
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                        Cancel Plan
                    </button>
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
        </PlanBuilderProvider>
    );
}
