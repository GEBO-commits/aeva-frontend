/**
 * decorations.api.js
 * Handles all data fetching for the Decorations & Styling section.
 *
 * Toggle USE_MOCK to swap between mock data and real backend calls.
 */

import { mockDecorations } from './mock/decorations.mock';

/** Set to false when real backend API is available */
const USE_MOCK = true;

/**
 * Fetches all available decoration packages.
 * @returns {Promise<Array>} Array of decoration package objects
 */
export async function getAllDecorations() {
    if (USE_MOCK) {
        return new Promise((resolve) => setTimeout(() => resolve(mockDecorations), 600));
    }
    const res = await fetch('/api/decorations');
    return res.json();
}

/**
 * Fetches a single decoration package by its ID.
 * @param {string} id - The unique decoration package ID
 * @returns {Promise<Object|null>} The decoration object or null if not found
 */
export async function getDecorationById(id) {
    if (USE_MOCK) {
        return new Promise((resolve) =>
            setTimeout(() => resolve(mockDecorations.find((d) => d.id === id) || null), 300)
        );
    }
    const res = await fetch(`/api/decorations/${id}`);
    return res.json();
}

/**
 * Filters decoration packages by theme.
 * @param {string} theme - The theme name to filter by (e.g. "Bohemian", "Luxury")
 * @returns {Promise<Array>} Filtered array of decoration packages
 */
export async function getDecorationsByTheme(theme) {
    const all = await getAllDecorations();
    return all.filter((d) => d.theme.toLowerCase().includes(theme.toLowerCase()));
}

/**
 * Returns the best decoration package within a given budget.
 * Used by the Survey result / Full Event Plan flow.
 * @param {number} budget - Maximum decoration budget
 * @returns {Promise<Object|null>} Best matching package
 */
export async function getRecommendedDecoration(budget) {
    const all = await getAllDecorations();
    const matches = all.filter((d) => d.totalPrice <= budget);
    return matches.sort((a, b) => b.rating - a.rating)[0] || null;
}
