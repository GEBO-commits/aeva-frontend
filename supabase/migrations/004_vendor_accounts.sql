-- ============================================================================
-- AEVA Vendor Accounts Schema
-- Adds vendor_accounts table for vendor user management
-- ============================================================================

-- vendor_accounts: Links user accounts to vendor catalog entries
CREATE TABLE vendor_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  business_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(vendor_id)
);

CREATE INDEX idx_vendor_accounts_user_id ON vendor_accounts(user_id);
CREATE INDEX idx_vendor_accounts_vendor_id ON vendor_accounts(vendor_id);
CREATE INDEX idx_vendor_accounts_status ON vendor_accounts(status);

CREATE TRIGGER update_vendor_accounts_updated_at
BEFORE UPDATE ON vendor_accounts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Booking status values documentation
-- ============================================================================
-- Booking status values:
-- draft: user is planning, not yet confirmed
-- pending: user confirmed, availability check in progress
-- confirmed: auto-confirmed, date and vendors locked
-- cancelled: cancelled by user or admin

-- ============================================================================
-- vendor_accounts Row Level Security
-- ============================================================================
ALTER TABLE vendor_accounts ENABLE ROW LEVEL SECURITY;

-- Vendor can read and update their own account
CREATE POLICY vendor_accounts_select_own ON vendor_accounts
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY vendor_accounts_update_own ON vendor_accounts
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Vendor can insert their own account
CREATE POLICY vendor_accounts_insert_own ON vendor_accounts
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
