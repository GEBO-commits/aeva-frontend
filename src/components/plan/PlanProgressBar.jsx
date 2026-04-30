/**
 * PlanProgressBar.jsx
 *
 * Horizontal step indicator for the Manual Plan Builder.
 * Shows 5 steps: Venue → Catering → Decorations → Vendors → Summary
 *
 * Props:
 *   - currentStep: number (0=Venue, 1=Catering, 2=Decorations, 3=Vendors, 4=Summary)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { usePlanStore } from '../../store/plan.store';

const STEPS = ['Venue', 'Catering', 'Decorations', 'Vendors', 'Summary'];
const STEP_ROUTES = [
    '/plan/build/venue',
    '/plan/build/catering',
    '/plan/build/decorations',
    '/plan/build/vendors',
    '/plan/build/summary'
];

export function PlanProgressBar({ currentStep }) {
    const navigate = useNavigate();
    const { selectedVenue, selectedCatering, selectedDecorations, selectedVendors, skippedSteps } = usePlanStore();

    const checkStepCompleted = (index) => {
        if (skippedSteps.includes(index)) return true;
        switch (index) {
            case 0: return !!selectedVenue;
            case 1: return !!selectedCatering;
            case 2: return !!selectedDecorations;
            case 3: return Object.values(selectedVendors).some(Boolean);
            case 4: return false; // Summary is never "completed" in this bar
            default: return false;
        }
    };
    return (
        <div style={{ background: 'var(--aeva-canvas)', borderRadius: 'var(--r-lg)', border: '1px solid var(--aeva-line)', padding: '20px' }}>
            <p className="t-eyebrow" style={{ marginBottom: '16px' }}>Plan Progress</p>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                {/* Background connector line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: '18px',
                    height: '1px',
                    background: 'var(--aeva-line)',
                    zIndex: 0,
                    marginLeft: '18px',
                    marginRight: '18px',
                  }}
                />
                {/* Filled connector line */}
                {currentStep > 0 && (
                    <div
                        style={{
                          position: 'absolute',
                          top: '18px',
                          height: '1px',
                          background: 'var(--aeva-ink)',
                          zIndex: 0,
                          left: '18px',
                          width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 36px)`,
                          transition: 'width 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                        }}
                    />
                )}

                {STEPS.map((step, i) => {
                  const isCompleted = checkStepCompleted(i);
                  const isActive = i === currentStep;
                  const isSkipped = skippedSteps.includes(i);
                  const isClickable = i <= currentStep;

                  return (
                    <div
                      key={step}
                      style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                      }}
                    >
                      {isSkipped && (
                        <span
                          style={{
                            fontSize: '9px',
                            background: 'var(--aeva-paper-warm)',
                            color: 'var(--aeva-ink-mute)',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            position: 'absolute',
                            top: '-20px',
                            whiteSpace: 'nowrap',
                            border: '1px solid var(--aeva-line)',
                            boxShadow: 'var(--shadow-sm)',
                            fontWeight: 600,
                            display: 'none',
                          }}
                          className="sm:block"
                        >
                          Skipped
                        </span>
                      )}

                      {/* Circle */}
                      <div
                        onClick={() => isClickable && navigate(STEP_ROUTES[i])}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 600,
                          transition: 'all 200ms',
                          cursor: isClickable ? 'pointer' : 'default',
                          background: isCompleted ? 'var(--aeva-ink)' : isActive ? 'var(--aeva-ink)' : 'var(--aeva-paper-warm)',
                          color: isCompleted || isActive ? 'var(--aeva-paper)' : 'var(--aeva-ink-mute)',
                          boxShadow: isActive ? '0 0 0 4px rgba(26,24,20,0.1)' : 'none',
                        }}
                        onMouseEnter={e => {
                          if (isClickable) {
                            e.currentTarget.style.transform = 'scale(1.08)';
                          }
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = '';
                        }}
                      >
                        {isCompleted && !isSkipped ? <CheckCircle size={18} /> : i + 1}
                      </div>

                      {/* Label */}
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          marginTop: '8px',
                          display: 'none',
                          color: isActive ? 'var(--aeva-ink)' : isCompleted ? 'var(--aeva-ink-mute)' : 'var(--aeva-ink-soft)',
                        }}
                        className="sm:block"
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
            </div>
        </div>
    );
}
