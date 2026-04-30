/**
 * ManualPlanBuilder.jsx
 *
 * Wrapper for the manual plan builder flow (step-by-step browsing and selection).
 * Steps: Venue → Catering → Decorations → Vendors → Summary
 * No AI recommendations — user selects everything manually.
 *
 * State: uses PlanBuilderContext for eventId, extended with currentStep.
 */

import React, { useEffect, useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../store/auth.store';
import { usePlanStore } from '../../../store/plan.store';
import { createEventFromPlanBuilder, updateEvent } from '../../../services/planningService';
import { PlanBuilderContext, PlanBuilderProvider } from '../../../contexts/PlanBuilderContext';
import { Button } from '../../../components/ui/Button';

const STEPS = [
  { label: 'Venue', path: '/plan/manual/venue', index: 0 },
  { label: 'Catering', path: '/plan/manual/catering', index: 1 },
  { label: 'Decorations', path: '/plan/manual/decorations', index: 2 },
  { label: 'Vendors', path: '/plan/manual/vendors', index: 3 },
  { label: 'Summary', path: '/plan/manual/summary', index: 4 },
];

function ManualPlanBuilderInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, eventDate, setEventDate } = useContext(PlanBuilderContext);
  const [dateError, setDateError] = useState('');
  const currentStep = STEPS.findIndex(s => location.pathname.startsWith(s.path));

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
        console.error('[ManualPlanBuilder] Failed to update event date:', error);
      }
    }
  };

  const handleNavigatePastStep0 = () => {
    if (!eventDate) {
      setDateError('Please select an event date to continue');
      return;
    }
    navigate('/plan/manual/catering');
  };

  const handleBack = () => {
    if (currentStep > 0) {
      navigate(STEPS[currentStep - 1].path);
    }
  };

  const handleCancel = () => {
    usePlanStore.getState().clearPlan();
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 className="t-display-lg" style={{ marginBottom: '8px' }}>
            Build Your Plan
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--aeva-ink-soft)' }}>
            Browse and select each category, step by step.
          </p>
        </div>
        <Button variant="ghost" onClick={handleCancel} style={{ color: 'var(--aeva-danger)' }}>
          Cancel Plan
        </Button>
      </div>

      {/* Progress steps */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step.label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  background: i < currentStep ? 'var(--aeva-ink)' : i === currentStep ? 'var(--aeva-ink)' : 'var(--aeva-paper-warm)',
                  color: i <= currentStep ? 'var(--aeva-paper)' : 'var(--aeva-ink-mute)',
                  marginBottom: '8px',
                  cursor: i < currentStep ? 'pointer' : 'default',
                  transition: 'all 200ms',
                }}
                onClick={() => i < currentStep && navigate(step.path)}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: i === currentStep ? 'var(--aeva-ink)' : 'var(--aeva-ink-mute)' }}>
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: i < currentStep ? 'var(--aeva-ink)' : 'var(--aeva-line)',
                  marginBottom: '20px',
                  transition: 'all 200ms',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Date input (visible on first step only) */}
      {currentStep === 0 && (
        <div style={{ marginBottom: '24px', background: 'var(--aeva-canvas)', borderRadius: 'var(--r-lg)', border: '1px solid var(--aeva-line)', padding: '20px' }}>
          <label className="t-eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
            When is your event?
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={handleDateChange}
            min={getTomorrowDate()}
            required
            className="field"
            style={{ maxWidth: '280px' }}
          />
          {dateError && (
            <p style={{ fontSize: '14px', color: 'var(--aeva-danger)', fontWeight: 500, marginTop: '8px' }}>
              {dateError}
            </p>
          )}
        </div>
      )}

      {/* Step content */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="aeva-rise"
      >
        <Outlet context={{ onNavigatePastStep0: handleNavigatePastStep0, onBack: handleBack, currentStep }} />
      </motion.div>

      {/* Footer nav (for steps 1+) */}
      {currentStep > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--aeva-line)' }}>
          <Button variant="quiet" onClick={handleBack}>
            ← Back
          </Button>
          {currentStep < STEPS.length - 1 && (
            <Button variant="primary" onClick={() => navigate(STEPS[currentStep + 1].path)}>
              Next Step →
            </Button>
          )}
        </div>
      )}

      {/* First step nav */}
      {currentStep === 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--aeva-line)' }}>
          <Button variant="primary" onClick={handleNavigatePastStep0}>
            Next Step →
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ManualPlanBuilder() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [eventId, setEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePlanBuilder = async () => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/plan/manual' } });
        return;
      }

      const { event, error } = await createEventFromPlanBuilder();
      if (error) {
        console.error('[ManualPlanBuilder] Failed to create event:', error);
        setIsLoading(false);
        return;
      }

      setEventId(event.id);
      setIsLoading(false);
    };

    initializePlanBuilder();
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div style={{ width: '32px', height: '32px', border: '4px solid var(--aeva-line)', borderTop: '4px solid var(--aeva-ember)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <PlanBuilderProvider initialEventId={eventId}>
      <ManualPlanBuilderInner />
    </PlanBuilderProvider>
  );
}
