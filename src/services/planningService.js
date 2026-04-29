/**
 * planningService.js
 *
 * Handles planning session creation, event persistence, and survey responses.
 * All functions use Supabase with RLS protection via auth.uid().
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Initialize anonymous auth on app startup.
 * Idempotent: safe to call multiple times; returns existing session if one exists.
 * @returns {Promise<{session, user, error}>}
 */
export async function initializeAnonymousAuth() {
  try {
    // Check if already authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[planningService] Failed to get session:', sessionError);
      return { session: null, user: null, error: sessionError };
    }

    // If already authenticated (including anonymous), return current user
    if (session?.user) {
      return { session, user: session.user, error: null };
    }

    // Sign in anonymously
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error('[planningService] Failed to sign in anonymously:', error);
      return { session: null, user: null, error };
    }

    return { session: data.session, user: data.user, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in initializeAnonymousAuth:', err);
    return { session: null, user: null, error: err };
  }
}

/**
 * Get or create a planning session for the current auth user.
 * @returns {Promise<{planningSession, error}>}
 */
export async function getOrCreatePlanningSession() {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      const error = authError || new Error('No authenticated user');
      console.error('[planningService] Failed to get current user:', error);
      return { planningSession: null, error };
    }

    const userId = user.id;

    // Check if active planning session exists for this user
    const { data: existingSessions, error: selectError } = await supabase
      .from('planning_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1);

    if (selectError) {
      console.error('[planningService] Failed to query planning_sessions:', selectError);
      return { planningSession: null, error: selectError };
    }

    // If active session exists, return it
    if (existingSessions && existingSessions.length > 0) {
      return { planningSession: existingSessions[0], error: null };
    }

    // Create new planning session
    const { data: newSession, error: insertError } = await supabase
      .from('planning_sessions')
      .insert([
        {
          user_id: userId,
          session_token: `session_${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          status: 'active',
          source: 'app'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('[planningService] Failed to create planning_session:', insertError);
      return { planningSession: null, error: insertError };
    }

    return { planningSession: newSession, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in getOrCreatePlanningSession:', err);
    return { planningSession: null, error: err };
  }
}

/**
 * Create an event draft from survey data.
 * @param {Object} surveyData - { fullName, eventType, guestCount, location, eventDate, budget, gender, venue_type, theme, vibe_summary }
 * @returns {Promise<{event, error}>}
 */
export async function createEventFromSurvey(surveyData) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      const error = authError || new Error('No authenticated user');
      console.error('[planningService] Failed to get current user:', error);
      return { event: null, error };
    }

    // Get or create planning session
    const { planningSession, error: sessionError } = await getOrCreatePlanningSession();

    if (sessionError) {
      console.error('[planningService] Failed to get/create planning session:', sessionError);
      return { event: null, error: sessionError };
    }

    // Extract budget as a range
    const budgetAmount = surveyData.budget || 50000;
    const budgetMin = Math.max(budgetAmount - 10000, 1000);
    const budgetMax = budgetAmount + 10000;

    // Parse guest count range (e.g., "50-100" → 75)
    let guestCount = null;
    if (surveyData.guestCount) {
      const match = surveyData.guestCount.match(/(\d+)/);
      if (match) {
        guestCount = parseInt(match[1], 10);
      }
    }

    // Create event
    const { data: event, error: insertError } = await supabase
      .from('events')
      .insert([
        {
          user_id: user.id,
          planning_session_id: planningSession.id,
          title: `${surveyData.eventType || 'Event'} - ${surveyData.fullName || 'User'}`,
          event_type: surveyData.eventType || 'wedding',
          status: 'draft',
          guest_count: guestCount,
          budget_min: budgetMin,
          budget_max: budgetMax,
          city: surveyData.location || null,
          event_date: surveyData.eventDate || null,
          venue_type: surveyData.venue_type || null,
          theme: surveyData.theme || null,
          vibe_summary: surveyData.vibe_summary || null,
          vision_summary: surveyData.vibe_summary || null,
          source_flow: 'survey'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('[planningService] Failed to create event:', insertError);
      return { event: null, error: insertError };
    }

    return { event, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in createEventFromSurvey:', err);
    return { event: null, error: err };
  }
}

/**
 * Fetch an event by ID.
 * @param {string} eventId - UUID of the event
 * @returns {Promise<{event, error}>}
 */
export async function getEvent(eventId) {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('[planningService] Failed to fetch event:', error);
      return { event: null, error };
    }

    return { event, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in getEvent:', err);
    return { event: null, error: err };
  }
}

/**
 * Update an event (title, status, etc.).
 * @param {string} eventId - UUID of the event
 * @param {Object} updates - Fields to update
 * @returns {Promise<{event, error}>}
 */
export async function updateEvent(eventId, updates) {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('[planningService] Failed to update event:', error);
      return { event: null, error };
    }

    return { event, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in updateEvent:', err);
    return { event: null, error: err };
  }
}

/**
 * Save survey responses to the survey_responses table.
 * @param {string} eventId - UUID of the event
 * @param {string} stepKey - Survey step identifier (e.g., "basic_info", "event_details")
 * @param {Object} responseData - The survey response data
 * @returns {Promise<{response, error}>}
 */
export async function saveSurveyResponse(eventId, stepKey, responseData) {
  try {
    const { data: response, error } = await supabase
      .from('survey_responses')
      .insert([
        {
          event_id: eventId,
          step_key: stepKey,
          response_data: responseData
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('[planningService] Failed to save survey response:', error);
      return { response: null, error };
    }

    return { response, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in saveSurveyResponse:', err);
    return { response: null, error: err };
  }
}

/**
 * Get event recommendations.
 * @param {string} eventId - UUID of the event
 * @returns {Promise<{recommendations, error}>}
 */
export async function getEventRecommendations(eventId) {
  try {
    const { data: recommendations, error } = await supabase
      .from('event_recommendations')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[planningService] Failed to fetch recommendations:', error);
      return { recommendations: [], error };
    }

    return { recommendations: recommendations || [], error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in getEventRecommendations:', err);
    return { recommendations: [], error: err };
  }
}

/**
 * Get current authenticated user.
 * @returns {Promise<{user, error}>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('[planningService] Failed to get current user:', error);
      return { user: null, error };
    }

    return { user, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in getCurrentUser:', err);
    return { user: null, error: err };
  }
}

/**
 * Create a draft event for the plan builder flow.
 * Calls getOrCreatePlanningSession() to ensure ownership consistency.
 * @returns {Promise<{event, error}>}
 */
export async function createEventFromPlanBuilder() {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      const error = authError || new Error('No authenticated user');
      console.error('[planningService] Failed to get current user:', error);
      return { event: null, error };
    }

    // Get or create planning session
    const { planningSession, error: sessionError } = await getOrCreatePlanningSession();

    if (sessionError) {
      console.error('[planningService] Failed to get/create planning session:', sessionError);
      return { event: null, error: sessionError };
    }

    // Create event draft
    const { data: event, error: insertError } = await supabase
      .from('events')
      .insert([
        {
          user_id: user.id,
          planning_session_id: planningSession.id,
          title: 'My Event',
          event_type: 'wedding',
          status: 'draft',
          source_flow: 'plan_builder'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('[planningService] Failed to create event from plan builder:', insertError);
      return { event: null, error: insertError };
    }

    return { event, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in createEventFromPlanBuilder:', err);
    return { event: null, error: err };
  }
}

/**
 * Save or update an event selection (venue, catering, decorations, vendor).
 * Uses upsert with unique constraint on (event_id, selection_type) to prevent duplicates.
 * @param {string} eventId - UUID of the event
 * @param {string} selectionType - 'venue' | 'catering' | 'decorations' | 'photographer' | 'dj' | 'videographer'
 * @param {string} entityId - UUID of the selected entity
 * @param {string} notes - Optional notes
 * @returns {Promise<{selection, error}>}
 */
export async function saveEventSelection(eventId, selectionType, entityId, notes = null) {
  try {
    const { data: selection, error } = await supabase
      .from('event_selections')
      .upsert(
        {
          event_id: eventId,
          selection_type: selectionType,
          entity_id: entityId,
          notes: notes,
          status: 'selected'
        },
        {
          onConflict: 'event_id,selection_type'
        }
      )
      .select()
      .single();

    if (error) {
      console.error('[planningService] Failed to save event selection:', error);
      return { selection: null, error };
    }

    return { selection, error: null };
  } catch (err) {
    console.error('[planningService] Unexpected error in saveEventSelection:', err);
    return { selection: null, error: err };
  }
}
