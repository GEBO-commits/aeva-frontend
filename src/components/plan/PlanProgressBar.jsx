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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Plan Progress</p>
            <div className="flex items-center relative">
                {/* Background connector line */}
                <div className="absolute left-0 right-0 top-[18px] h-0.5 bg-gray-100 z-0" style={{ marginLeft: '18px', marginRight: '18px' }} />
                {/* Filled connector line to visually indicate progress. We'll find the highest completed step logic or just use currentStep for layout */}
                {currentStep > 0 && (
                    <div
                        className="absolute top-[18px] h-0.5 bg-primary z-0 transition-all duration-500"
                        style={{
                            left: '18px',
                            width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 36px)`,
                        }}
                    />
                )}

                {STEPS.map((step, i) => {
                    const isCompleted = checkStepCompleted(i);
                    const isActive = i === currentStep;
                    const isSkipped = skippedSteps.includes(i);
                    const isClickable = i <= currentStep;

                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center flex-1">
                            {isSkipped && (
                                <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full absolute -top-5 whitespace-nowrap hidden sm:block border border-gray-200 shadow-sm font-bold">
                                    Skipped
                                </span>
                            )}
                            {/* Circle */}
                            <div onClick={() => isClickable && navigate(STEP_ROUTES[i])} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isCompleted ? 'bg-primary text-white shadow-md shadow-primary/30'
                                : isActive ? 'bg-primary text-white ring-4 ring-primary/20 shadow-md shadow-primary/30'
                                    : 'bg-gray-100 text-gray-400'
                                } ${isClickable ? 'cursor-pointer' : ''}`}>
                                {isCompleted && !isSkipped ? <CheckCircle className="w-5 h-5" /> : i + 1}
                            </div>
                            {/* Label */}
                            <span className={`text-[10px] font-semibold mt-1.5 hidden sm:block ${isActive ? 'text-primary' : isCompleted ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
