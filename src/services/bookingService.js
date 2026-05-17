/**
 * bookingService.js
 *
 * Handles booking creation, updates, and payment coordination.
 * All functions use Supabase with RLS protection via auth.uid().
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Create a booking for an event.
 * RLS ownership enforced through event_id → events.user_id = auth.uid()
 * Status transitions: draft → pending (after lock-in) → confirmed (after payment) → completed
 * @param {string} eventId - UUID of the event
 * @param {Object} [opts] - { status, totalAmount }
 * @returns {Promise<{booking, error}>}
 */
export async function createBooking(eventId, opts = {}) {
  try {
    const payload = {
      event_id: eventId,
      status: opts.status || 'pending',
      currency: 'EGP',
    };
    if (opts.totalAmount && opts.totalAmount > 0) {
      payload.subtotal = opts.totalAmount;
      payload.total_amount = opts.totalAmount;
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('[bookingService] Failed to create booking:', error);
      return { booking: null, error };
    }

    return { booking, error: null };
  } catch (err) {
    console.error('[bookingService] Unexpected error in createBooking:', err);
    return { booking: null, error: err };
  }
}

/**
 * Fetch a booking by ID.
 * @param {string} bookingId - UUID of the booking
 * @returns {Promise<{booking, error}>}
 */
export async function getBooking(bookingId) {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error('[bookingService] Failed to fetch booking:', error);
      return { booking: null, error };
    }

    return { booking, error: null };
  } catch (err) {
    console.error('[bookingService] Unexpected error in getBooking:', err);
    return { booking: null, error: err };
  }
}

/**
 * Update a booking status or other fields.
 * @param {string} bookingId - UUID of the booking
 * @param {Object} updates - Fields to update (e.g., { status: 'pending', subtotal: 100000 })
 * @returns {Promise<{booking, error}>}
 */
export async function updateBooking(bookingId, updates) {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('[bookingService] Failed to update booking:', error);
      return { booking: null, error };
    }

    return { booking, error: null };
  } catch (err) {
    console.error('[bookingService] Unexpected error in updateBooking:', err);
    return { booking: null, error: err };
  }
}
