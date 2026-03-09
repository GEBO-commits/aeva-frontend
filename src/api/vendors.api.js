/**
 * vendors.api.js
 * Handles all data fetching for Photographers, DJs, and Videographers.
 *
 * Toggle USE_MOCK to swap between mock data and real backend calls.
 */

import { mockVendors } from './mock/vendors.mock';

/** Set to false when real backend API is available */
const USE_MOCK = true;

/**
 * Fetches all vendors across all categories.
 * @returns {Promise<Array>} Array of all vendor objects
 */
export async function getAllVendors() {
    if (USE_MOCK) {
        return new Promise((resolve) => setTimeout(() => resolve(mockVendors), 600));
    }
    const res = await fetch('/api/vendors');
    return res.json();
}

/**
 * Fetches vendors filtered by category.
 * @param {"Photographer"|"DJ"|"Videographer"} category - The vendor category
 * @returns {Promise<Array>} Filtered array of vendor objects
 */
export async function getVendorsByCategory(category) {
    const all = await getAllVendors();
    return all.filter((v) => v.category === category);
}

/**
 * Fetches a single vendor by its ID.
 * @param {string} id - The unique vendor ID
 * @returns {Promise<Object|null>} The vendor object or null if not found
 */
export async function getVendorById(id) {
    if (USE_MOCK) {
        return new Promise((resolve) =>
            setTimeout(() => resolve(mockVendors.find((v) => v.id === id) || null), 300)
        );
    }
    const res = await fetch(`/api/vendors/${id}`);
    return res.json();
}

/**
 * Returns the best photographer, DJ, and videographer within a budget.
 * Used by the Survey result / Full Event Plan flow.
 * @param {number} totalBudget - Total vendor budget to split across categories
 * @returns {Promise<{photographer, dj, videographer}>} The recommended vendor set
 */
export async function getRecommendedVendors(totalBudget) {
    // Roughly split the vendor budget: 50% photo, 20% DJ, 30% video
    const photoBudget = totalBudget * 0.5;
    const djBudget = totalBudget * 0.2;
    const videoBudget = totalBudget * 0.3;

    const [photographers, djs, videographers] = await Promise.all([
        getVendorsByCategory('Photographer'),
        getVendorsByCategory('DJ'),
        getVendorsByCategory('Videographer'),
    ]);

    const best = (list, budget) =>
        list
            .filter((v) => v.startingPrice <= budget)
            .sort((a, b) => b.rating - a.rating)[0] || list[0];

    return {
        photographer: best(photographers, photoBudget),
        dj: best(djs, djBudget),
        videographer: best(videographers, videoBudget),
    };
}
