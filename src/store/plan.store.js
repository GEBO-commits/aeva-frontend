/**
 * plan.store.js
 *
 * Zustand store with localStorage persistence for the Manual Plan Builder.
 * Selections survive page refreshes and route changes.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePlanStore = create(
    persist(
        (set, get) => ({
            /** Selected venue object (or null) */
            selectedVenue: null,

            /** Selected catering object (or null) */
            selectedCatering: null,

            /** Selected decoration package (or null) */
            selectedDecorations: null,

            /** Selected vendors by role */
            selectedVendors: {
                photographer: null,
                dj: null,
                videographer: null,
            },

            /** Array of skipped step indices */
            skippedSteps: [],

            /** Set the selected venue */
            setVenue: (venue) => set({ selectedVenue: venue }),

            /** Set the selected catering service */
            setCatering: (catering) => set({ selectedCatering: catering }),

            /** Set the selected decoration package */
            setDecorations: (dec) => set({ selectedDecorations: dec }),

            /**
             * Set a specific vendor by type.
             * @param {"photographer"|"dj"|"videographer"} type
             * @param {object} vendor
             */
            setVendor: (type, vendor) =>
                set((state) => ({
                    selectedVendors: { ...state.selectedVendors, [type]: vendor },
                })),

            /** Mark a step as skipped */
            skipStep: (stepIndex) =>
                set((state) => ({
                    skippedSteps: state.skippedSteps.includes(stepIndex)
                        ? state.skippedSteps
                        : [...state.skippedSteps, stepIndex],
                })),

            /** Reset all plan selections */
            clearPlan: () =>
                set({
                    selectedVenue: null,
                    selectedCatering: null,
                    selectedDecorations: null,
                    selectedVendors: { photographer: null, dj: null, videographer: null },
                    skippedSteps: [],
                }),

            /**
             * Calculate the total estimated cost of the current plan.
             * @returns {number} Total price in EGP
             */
            getTotalCost: () => {
                const { selectedVenue, selectedCatering, selectedDecorations, selectedVendors } = get();
                let total = 0;
                if (selectedVenue) total += selectedVenue.startingPrice || 0;
                if (selectedCatering) total += (selectedCatering.pricePerPerson || 0) * 100; // ~100 guests default
                if (selectedDecorations) total += selectedDecorations.totalPrice || 0;
                if (selectedVendors.photographer) total += selectedVendors.photographer.startingPrice || 0;
                if (selectedVendors.dj) total += selectedVendors.dj.startingPrice || 0;
                if (selectedVendors.videographer) total += selectedVendors.videographer.startingPrice || 0;
                return total;
            },
        }),
        { name: 'aeva-plan-store' }   // persists to localStorage under this key
    )
);
