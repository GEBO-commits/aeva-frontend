-- ============================================================================
-- AEVA Backend Row Level Security (RLS) Policies
-- Implements access control for all 21 tables
-- ============================================================================

-- ============================================================================
-- profiles: user can read and update only their own row
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own ON profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY profiles_update_own ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- planning_sessions: tied to user_id via auth.uid()
-- ============================================================================
ALTER TABLE planning_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY planning_sessions_select_own ON planning_sessions
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY planning_sessions_insert_own ON planning_sessions
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY planning_sessions_update_own ON planning_sessions
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- events: owned by auth.uid()
-- ============================================================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY events_select_own ON events
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY events_insert_own ON events
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY events_update_own ON events
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- chat_threads: accessible only through owning event
-- ============================================================================
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_threads_select_own ON chat_threads
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY chat_threads_insert_own ON chat_threads
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY chat_threads_update_own ON chat_threads
FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- chat_messages: accessible through owning thread → owning event
-- ============================================================================
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY chat_messages_select_own ON chat_messages
FOR SELECT TO authenticated
USING (thread_id IN (SELECT id FROM chat_threads WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

CREATE POLICY chat_messages_insert_own ON chat_messages
FOR INSERT TO authenticated
WITH CHECK (thread_id IN (SELECT id FROM chat_threads WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

-- ============================================================================
-- survey_responses: accessible only through owning event
-- ============================================================================
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY survey_responses_select_own ON survey_responses
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY survey_responses_insert_own ON survey_responses
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY survey_responses_update_own ON survey_responses
FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- event_preferences: accessible only through owning event
-- ============================================================================
ALTER TABLE event_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_preferences_select_own ON event_preferences
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY event_preferences_insert_own ON event_preferences
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY event_preferences_update_own ON event_preferences
FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- venues: public read-only for active venues
-- ============================================================================
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY venues_select_public ON venues
FOR SELECT TO public
USING (is_active = true);

-- ============================================================================
-- vendors: public read-only for active vendors
-- ============================================================================
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY vendors_select_public ON vendors
FOR SELECT TO public
USING (is_active = true);

-- ============================================================================
-- venue_availability: public read-only for active venues
-- ============================================================================
ALTER TABLE venue_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY venue_availability_select_public ON venue_availability
FOR SELECT TO public
USING (venue_id IN (SELECT id FROM venues WHERE is_active = true));

-- ============================================================================
-- vendor_availability: public read-only for active vendors
-- ============================================================================
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY vendor_availability_select_public ON vendor_availability
FOR SELECT TO public
USING (vendor_id IN (SELECT id FROM vendors WHERE is_active = true));

-- ============================================================================
-- event_recommendations: only event owner can see and create
-- ============================================================================
ALTER TABLE event_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_recommendations_select_own ON event_recommendations
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY event_recommendations_insert_own ON event_recommendations
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- event_selections: only event owner can manage selections
-- ============================================================================
ALTER TABLE event_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY event_selections_select_own ON event_selections
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY event_selections_insert_own ON event_selections
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY event_selections_update_own ON event_selections
FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY event_selections_delete_own ON event_selections
FOR DELETE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- bookings: only event owner can manage bookings
-- ============================================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY bookings_select_own ON bookings
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY bookings_insert_own ON bookings
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY bookings_update_own ON bookings
FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- booking_vendors: accessible through owning booking → owning event
-- ============================================================================
ALTER TABLE booking_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY booking_vendors_select_own ON booking_vendors
FOR SELECT TO authenticated
USING (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

CREATE POLICY booking_vendors_insert_own ON booking_vendors
FOR INSERT TO authenticated
WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

CREATE POLICY booking_vendors_update_own ON booking_vendors
FOR UPDATE TO authenticated
USING (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())))
WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

CREATE POLICY booking_vendors_delete_own ON booking_vendors
FOR DELETE TO authenticated
USING (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

-- ============================================================================
-- payments: accessible through owning booking → owning event
-- ============================================================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_select_own ON payments
FOR SELECT TO authenticated
USING (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

CREATE POLICY payments_insert_own ON payments
FOR INSERT TO authenticated
WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

CREATE POLICY payments_update_own ON payments
FOR UPDATE TO authenticated
USING (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())))
WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE event_id IN (SELECT id FROM events WHERE user_id = auth.uid())));

-- ============================================================================
-- guest_profiles: only event owner can manage guests
-- ============================================================================
ALTER TABLE guest_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY guest_profiles_select_own ON guest_profiles
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY guest_profiles_insert_own ON guest_profiles
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY guest_profiles_update_own ON guest_profiles
FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY guest_profiles_delete_own ON guest_profiles
FOR DELETE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- guest_invitations: only event owner can manage invitations
-- ============================================================================
ALTER TABLE guest_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY guest_invitations_select_own ON guest_invitations
FOR SELECT TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY guest_invitations_insert_own ON guest_invitations
FOR INSERT TO authenticated
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY guest_invitations_update_own ON guest_invitations
FOR UPDATE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()))
WITH CHECK (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

CREATE POLICY guest_invitations_delete_own ON guest_invitations
FOR DELETE TO authenticated
USING (event_id IN (SELECT id FROM events WHERE user_id = auth.uid()));

-- ============================================================================
-- notifications: only recipient user can see and update
-- ============================================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own ON notifications
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY notifications_update_own ON notifications
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- outbound_messages: service role only (no client policies)
-- ============================================================================
ALTER TABLE outbound_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- audit_logs: service role only (no client policies)
-- ============================================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
