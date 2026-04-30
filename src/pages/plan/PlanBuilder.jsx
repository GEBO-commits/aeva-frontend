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

import React, { useEffect, useState, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { usePlanStore } from '../../store/plan.store';
import { createEventFromPlanBuilder, updateEvent } from '../../services/planningService';
import { PlanBuilderProvider, PlanBuilderContext } from '../../contexts/PlanBuilderContext';

/** Step definitions for the progress bar */
const STEPS = [
    { label: 'Venue', path: '/plan/build/venue' },
    { label: 'Catering', path: '/plan/build/catering' },
    { label: 'Decorations', path: '/plan/build/decorations' },
    { label: 'Vendors', path: '/plan/build/vendors' },
    { label: 'Summary', path: '/plan/build/summary' },
];

function PlanBuilderInner() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventId, eventDate, setEventDate } = useContext(PlanBuilderContext);
    const [dateError, setDateError] = useState('');
    const currentIndex = STEPS.findIndex(s => location.pathname.startsWith(s.path));

    const getTomorrowDate = () => {
        return new Date(Date.now() + 86400000).toISOString().split('T')[0];
    };

    const handleDateChange = async (e) => {
        const newDate = e.target.value;
        setEventDate(newDate);
        setDateError('');
        if (eventId && newDate) {
            const { error } = await updateEvent(eventId, { event_date: newDate });
            if (error) {
                console.error('[PlanBuilder] Failed to update event date:', error);
            }
        }
    };

    const handleNavigatePastStep0 = () => {
        if (!eventDate) {
            setDateError('Please select an event date to continue');
            return;
        }
        navigate('/plan/build/catering');
    };

    return (
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

            {/* Date input */}
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
                <label className="block text-sm font-bold text-text-dark mb-2">
                    When is your event?
                </label>
                <input
                    type="date"
                    value={eventDate}
                    onChange={handleDateChange}
                    min={getTomorrowDate()}
                    required
                    className="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {dateError && (
                    <p className="text-sm text-red-500 font-medium mt-2">{dateError}</p>
                )}
            </div>

            {/* ─── Step content rendered here ─── */}
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                <Outlet context={{ onNavigatePastStep0: handleNavigatePastStep0 }} />
            </motion.div>
        </div>
    );
}

export default function PlanBuilder() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [eventId, setEventId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
            <PlanBuilderInner />
        </PlanBuilderProvider>
    );
}
