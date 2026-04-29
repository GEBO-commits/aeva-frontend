/**
 * catalogService.js
 *
 * Handles catalog reads: venues, vendors, catering, decorations.
 * All functions return { data, error } tuple for consistent error handling.
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Get all active venues, optionally filtered by type
 * Returns { data: [venues], error }
 */
export async function getVenues(filters = {}) {
    try {
        let query = supabase
            .from('venues')
            .select('*')
            .eq('is_active', true);

        // Optional filtering by venue_type
        if (filters.type && filters.type !== 'all') {
            query = query.eq('venue_type', filters.type);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[catalogService] getVenues error:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error('[catalogService] getVenues unexpected error:', err);
        return { data: null, error: err };
    }
}

/**
 * Get single venue by id
 * Returns { data: venue, error }
 */
export async function getVenue(id) {
    try {
        const { data, error } = await supabase
            .from('venues')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[catalogService] getVenue error:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error('[catalogService] getVenue unexpected error:', err);
        return { data: null, error: err };
    }
}

/**
 * Get vendors by category, or all if category is null
 * Returns { data: [vendors], error }
 */
export async function getVendors(category = null) {
    try {
        let query = supabase
            .from('vendors')
            .select('*')
            .eq('is_active', true);

        // Optional filtering by category (catering, photography, dj, decorations, videography, makeup)
        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[catalogService] getVendors error:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error('[catalogService] getVendors unexpected error:', err);
        return { data: null, error: err };
    }
}

/**
 * Get single vendor by id
 * Returns { data: vendor, error }
 */
export async function getVendor(id) {
    try {
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[catalogService] getVendor error:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (err) {
        console.error('[catalogService] getVendor unexpected error:', err);
        return { data: null, error: err };
    }
}

/**
 * Get all decorations (vendors WHERE category='decorations')
 * Returns { data: [decorations], error }
 */
export async function getDecorations() {
    return getVendors('decorations');
}
