/**
 * catering.api.js
 * Handles all data fetching for the Catering section.
 *
 * Toggle USE_MOCK to swap between mock data and real backend calls.
 * When real backend is ready, replace the mock imports with axios calls.
 */

import { mockCatering } from './mock/catering.mock';

/** Set to false when real backend API is available */
const USE_MOCK = true;

/**
 * Fetches all available catering services.
 * @returns {Promise<Array>} Array of catering objects
 */
export async function getAllCatering() {
    if (USE_MOCK) {
        // Simulate network delay for realistic skeleton loading behavior
        return new Promise((resolve) => setTimeout(() => resolve(mockCatering), 600));
    }
    const res = await fetch('/api/catering');
    return res.json();
}

/**
 * Fetches a single catering service by its ID.
 * @param {string} id - The unique catering service ID
 * @returns {Promise<Object|null>} The catering object or null if not found
 */
export async function getCateringById(id) {
    if (USE_MOCK) {
        return new Promise((resolve) =>
            setTimeout(() => resolve(mockCatering.find((c) => c.id === id) || null), 300)
        );
    }
    const res = await fetch(`/api/catering/${id}`);
    return res.json();
}

/**
 * Filters catering services by style (Buffet, Plated, Stations).
 * @param {string} style - The style to filter by
 * @returns {Promise<Array>} Filtered array of catering objects
 */
export async function getCateringByStyle(style) {
    const all = await getAllCatering();
    return all.filter((c) => c.style === style);
}

/**
 * Returns the best catering option for a given budget and guest count.
 * Used by the Survey result / Full Event Plan flow.
 * @param {number} budget - Total catering budget
 * @param {number} guestCount - Number of guests
 * @returns {Promise<Object|null>} Best matching caterer
 */
export async function getRecommendedCatering(budget, guestCount) {
    const all = await getAllCatering();
    const budgetPerPerson = budget / guestCount;
    // Find the best match within budget
    const matches = all.filter((c) => c.pricePerPerson <= budgetPerPerson);
    return matches.sort((a, b) => b.rating - a.rating)[0] || null;
}
