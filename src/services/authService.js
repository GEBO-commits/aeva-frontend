/**
 * authService.js
 *
 * Handles user authentication, profile management, and session merging.
 * All functions use Supabase Auth with error handling.
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Sign up a new user with email and password.
 * Profile is auto-created by database trigger (003_auto_create_profile_trigger.sql).
 * @param {string} email
 * @param {string} password
 * @param {string} fullName - optional, can be stored in profile later
 * @returns {Promise<{user, error}>}
 */
export async function signUpWithEmail(email, password, fullName) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      console.error('[authService] Sign up failed:', error);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (err) {
    console.error('[authService] Unexpected error in signUpWithEmail:', err);
    return { user: null, error: err };
  }
}

/**
 * Sign in an existing user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user, error}>}
 */
export async function signInWithEmail(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[authService] Sign in failed:', error);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (err) {
    console.error('[authService] Unexpected error in signInWithEmail:', err);
    return { user: null, error: err };
  }
}

/**
 * Sign out the current user.
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[authService] Sign out failed:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('[authService] Unexpected error in signOut:', err);
    return { error: err };
  }
}

/**
 * Get the currently authenticated user.
 * @returns {Promise<{user, error}>}
 */
export async function getCurrentAuthUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      if (!error.message?.includes('Auth session missing')) {
        console.error('[authService] Failed to get current user:', error);
      }
      return { user: null, error };
    }

    return { user, error: null };
  } catch (err) {
    console.error('[authService] Unexpected error in getCurrentAuthUser:', err);
    return { user: null, error: err };
  }
}

/**
 * Claim an anonymous planning session after user logs in.
 * Calls Edge Function to transfer planning_sessions and events with service role bypass.
 * Idempotent: safe to call multiple times with same IDs.
 * @param {string} anonymousUserId - UUID of the anonymous session user
 * @param {string} authenticatedUserId - UUID of the newly authenticated user
 * @returns {Promise<void>} - Throws on error (caller handles with try/catch)
 */
export async function claimAnonymousSession(anonymousUserId, authenticatedUserId) {
  try {
    const { data, error } = await supabase.functions.invoke('claim-session', {
      body: { anonymousUserId, authenticatedUserId }
    });

    if (error) {
      throw new Error(error.message || 'Edge function call failed');
    }

    console.log(`[authService] Session merge complete: ${anonymousUserId} → ${authenticatedUserId}`);
  } catch (err) {
    console.error('[authService] Session merge failed:', err);
    throw err;
  }
}
