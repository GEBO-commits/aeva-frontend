-- ============================================================================
-- AEVA Backend Core Schema Migration
-- Initializes all tables for AEVA event planning and booking system
-- ============================================================================

-- ============================================================================
-- Reusable updated_at trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Core Identity and Session Tables
-- ============================================================================

-- profiles: User profile metadata linked to Supabase Auth users
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- planning_sessions: Anonymous or pre-auth planning sessions
CREATE TABLE planning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  claimed_at timestamptz
);

CREATE INDEX idx_planning_sessions_user_id ON planning_sessions(user_id);
CREATE INDEX idx_planning_sessions_session_token ON planning_sessions(session_token);

CREATE TRIGGER update_planning_sessions_updated_at
BEFORE UPDATE ON planning_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Planning Intake Tables
-- ============================================================================

-- events: Aggregate root for user's event concept and planning state
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  planning_session_id uuid REFERENCES planning_sessions(id) ON DELETE CASCADE,
  title text NOT NULL,
  event_type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  vision_summary text,
  guest_count integer,
  budget_min numeric,
  budget_max numeric,
  event_date date,
  city text,
  venue_type text,
  theme text,
  vibe_summary text,
  source_flow text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_planning_session_id ON events(planning_session_id);
CREATE INDEX idx_events_status ON events(status);

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- chat_threads: Conversation threads linked to planning sessions or events
CREATE TABLE chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planning_session_id uuid REFERENCES planning_sessions(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_threads_event_id ON chat_threads(event_id);
CREATE INDEX idx_chat_threads_planning_session_id ON chat_threads(planning_session_id);
CREATE INDEX idx_chat_threads_user_id ON chat_threads(user_id);

-- chat_messages: Individual messages within a chat thread
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  role text NOT NULL,
  message_text text NOT NULL,
  message_meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_thread_id ON chat_messages(thread_id);

-- survey_responses: Survey answers from structured intake flow
CREATE TABLE survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planning_session_id uuid REFERENCES planning_sessions(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  step_key text NOT NULL,
  response_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_survey_responses_event_id ON survey_responses(event_id);
CREATE INDEX idx_survey_responses_planning_session_id ON survey_responses(planning_session_id);

-- event_preferences: Normalized structured preferences from AI/chat/manual flows
CREATE TABLE event_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  preference_key text NOT NULL,
  preference_value jsonb NOT NULL,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_preferences_event_id ON event_preferences(event_id);
CREATE INDEX idx_event_preferences_event_id_key ON event_preferences(event_id, preference_key);

-- ============================================================================
-- Catalog Tables
-- ============================================================================

-- venues: Venue catalog with capacity, pricing, and features
CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  city text,
  address text,
  capacity_min integer,
  capacity_max integer,
  price_min numeric,
  price_max numeric,
  venue_type text,
  rating numeric,
  image_urls jsonb,
  features jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_venue_type ON venues(venue_type);
CREATE INDEX idx_venues_is_active ON venues(is_active);
CREATE INDEX idx_venues_city_is_active ON venues(city, is_active);

CREATE TRIGGER update_venues_updated_at
BEFORE UPDATE ON venues
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- vendors: Vendor catalog (catering, photography, DJ, decorations, etc.)
CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  description text,
  city text,
  price_min numeric,
  price_max numeric,
  rating numeric,
  image_urls jsonb,
  details jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendors_city ON vendors(city);
CREATE INDEX idx_vendors_is_active ON vendors(is_active);
CREATE INDEX idx_vendors_category_is_active ON vendors(category, is_active);

CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON vendors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- venue_availability: Available dates and status for venues
CREATE TABLE venue_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  available_date date NOT NULL,
  status text NOT NULL,
  UNIQUE(venue_id, available_date)
);

CREATE INDEX idx_venue_availability_venue_id ON venue_availability(venue_id);
CREATE INDEX idx_venue_availability_available_date ON venue_availability(available_date);

-- vendor_availability: Available dates and status for vendors
CREATE TABLE vendor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  available_date date NOT NULL,
  status text NOT NULL,
  UNIQUE(vendor_id, available_date)
);

CREATE INDEX idx_vendor_availability_vendor_id ON vendor_availability(vendor_id);
CREATE INDEX idx_vendor_availability_available_date ON vendor_availability(available_date);

-- ============================================================================
-- Recommendation and Selection Tables
-- ============================================================================

-- event_recommendations: Recommendation outputs for audit and reuse
CREATE TABLE event_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  score numeric,
  reason_text text,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_recommendations_event_id ON event_recommendations(event_id);
CREATE INDEX idx_event_recommendations_event_id_type ON event_recommendations(event_id, entity_type);

-- event_selections: User's current picks before or after booking
CREATE TABLE event_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  selection_type text NOT NULL,
  entity_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'selected',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_selections_event_id ON event_selections(event_id);
CREATE INDEX idx_event_selections_event_id_type ON event_selections(event_id, selection_type);

-- ============================================================================
-- Booking and Payment Tables
-- ============================================================================

-- bookings: One booking per event, linking to fulfillment (venue, vendors, payment)
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES venues(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  subtotal numeric,
  service_fee numeric,
  total_amount numeric,
  currency text NOT NULL DEFAULT 'EGP',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- booking_vendors: Vendors attached to a booking
CREATE TABLE booking_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  vendor_category text NOT NULL,
  agreed_price numeric,
  status text NOT NULL DEFAULT 'pending',
  UNIQUE(booking_id, vendor_id)
);

CREATE INDEX idx_booking_vendors_booking_id ON booking_vendors(booking_id);
CREATE INDEX idx_booking_vendors_vendor_id ON booking_vendors(vendor_id);

-- payments: Payment records linked to bookings
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_payment_id text,
  status text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'EGP',
  paid_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================================
-- Guests and Invitations Tables
-- ============================================================================

-- guest_profiles: Individual guest records for an event
CREATE TABLE guest_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  group_name text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guest_profiles_event_id ON guest_profiles(event_id);
CREATE INDEX idx_guest_profiles_email ON guest_profiles(email);

-- guest_invitations: Invitations sent to guests, RSVP status tracking
CREATE TABLE guest_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES guest_profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'draft',
  invite_channel text,
  sent_at timestamptz,
  responded_at timestamptz,
  rsvp_status text,
  message_subject text,
  message_body text,
  delivery_meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_guest_invitations_event_id ON guest_invitations(event_id);
CREATE INDEX idx_guest_invitations_guest_id ON guest_invitations(guest_id);
CREATE INDEX idx_guest_invitations_status ON guest_invitations(status);

-- ============================================================================
-- Notifications and Operations Tables
-- ============================================================================

-- notifications: In-app notifications for users
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_event_id ON notifications(event_id);
CREATE INDEX idx_notifications_user_id_is_read ON notifications(user_id, is_read);

-- outbound_messages: Outbound email/SMS/notification attempts and results
CREATE TABLE outbound_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  guest_invitation_id uuid REFERENCES guest_invitations(id) ON DELETE SET NULL,
  provider text NOT NULL,
  message_type text NOT NULL,
  recipient text NOT NULL,
  status text NOT NULL,
  provider_message_id text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_outbound_messages_event_id ON outbound_messages(event_id);
CREATE INDEX idx_outbound_messages_guest_invitation_id ON outbound_messages(guest_invitation_id);
CREATE INDEX idx_outbound_messages_status ON outbound_messages(status);

-- audit_logs: Immutable record of significant actions
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
