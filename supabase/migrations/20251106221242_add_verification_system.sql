/*
  # Package Verification System

  ## Overview
  Extends the delivery system with comprehensive verification capabilities
  including QR/barcode scanning and missing item tracking.

  ## New Tables

  ### `colis_items` (package items)
  Stores individual items expected in each package for verification
  - `id` (uuid, primary key) - Unique item identifier
  - `colis_id` (uuid) - Reference to parent package
  - `item_name` (text) - Item name/description
  - `item_sku` (text) - SKU or product code
  - `item_barcode` (text) - Barcode/QR code value
  - `item_quantity` (integer) - Expected quantity
  - `item_image_url` (text, optional) - Image URL
  - `item_notes` (text, optional) - Additional notes
  - `created_at` (timestamptz) - Creation timestamp

  ### `verification_sessions` (verification sessions)
  Tracks verification attempts for returned packages
  - `id` (uuid, primary key) - Unique session identifier
  - `colis_id` (uuid) - Reference to package
  - `retour_id` (uuid) - Reference to return request
  - `verifier_id` (uuid) - User performing verification
  - `session_status` (text) - Status (in_progress, completed, cancelled)
  - `total_items` (integer) - Total items expected
  - `verified_items` (integer) - Items successfully verified
  - `missing_items` (integer) - Items not found
  - `started_at` (timestamptz) - Session start time
  - `completed_at` (timestamptz, optional) - Session completion time
  - `notes` (text, optional) - Session notes

  ### `item_verifications` (individual item scans)
  Records each scan attempt during verification
  - `id` (uuid, primary key) - Unique verification identifier
  - `session_id` (uuid) - Reference to verification session
  - `colis_item_id` (uuid) - Reference to package item
  - `scanned_code` (text) - The scanned barcode/QR value
  - `verification_status` (text) - Status (verified, mismatch, error)
  - `quantity_verified` (integer) - Quantity successfully verified
  - `verified_at` (timestamptz) - Verification timestamp
  - `notes` (text, optional) - Verification notes

  ## Security
  - Enable RLS on all tables
  - Users can only verify their own packages
  - Complete audit trail of all verification activities

  ## Notes
  - Real-time verification tracking
  - Support for multiple items per package
  - Comprehensive missing item detection
  - Mobile-optimized for on-site verification
*/

-- Create colis_items table
CREATE TABLE IF NOT EXISTS colis_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid REFERENCES colis(id) ON DELETE CASCADE NOT NULL,
  item_name text NOT NULL,
  item_sku text NOT NULL,
  item_barcode text NOT NULL,
  item_quantity integer NOT NULL DEFAULT 1,
  item_image_url text DEFAULT '',
  item_notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create verification_sessions table
CREATE TABLE IF NOT EXISTS verification_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid REFERENCES colis(id) ON DELETE CASCADE NOT NULL,
  retour_id uuid REFERENCES retours(id) ON DELETE CASCADE,
  verifier_id uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  session_status text NOT NULL DEFAULT 'in_progress',
  total_items integer NOT NULL DEFAULT 0,
  verified_items integer NOT NULL DEFAULT 0,
  missing_items integer NOT NULL DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  notes text DEFAULT ''
);

-- Create item_verifications table
CREATE TABLE IF NOT EXISTS item_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES verification_sessions(id) ON DELETE CASCADE NOT NULL,
  colis_item_id uuid REFERENCES colis_items(id) ON DELETE CASCADE NOT NULL,
  scanned_code text NOT NULL,
  verification_status text NOT NULL DEFAULT 'verified',
  quantity_verified integer NOT NULL DEFAULT 1,
  verified_at timestamptz DEFAULT now(),
  notes text DEFAULT ''
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_colis_items_colis_id ON colis_items(colis_id);
CREATE INDEX IF NOT EXISTS idx_colis_items_barcode ON colis_items(item_barcode);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_colis_id ON verification_sessions(colis_id);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_verifier ON verification_sessions(verifier_id);
CREATE INDEX IF NOT EXISTS idx_verification_sessions_status ON verification_sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_item_verifications_session_id ON item_verifications(session_id);
CREATE INDEX IF NOT EXISTS idx_item_verifications_item_id ON item_verifications(colis_item_id);

-- Enable Row Level Security
ALTER TABLE colis_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for colis_items

-- Users can view items for their own packages
CREATE POLICY "Users can view own package items"
  ON colis_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = colis_items.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- Users can add items to their own packages
CREATE POLICY "Users can add items to own packages"
  ON colis_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = colis_items.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- Users can update items in their own packages
CREATE POLICY "Users can update own package items"
  ON colis_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = colis_items.colis_id
      AND colis.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = colis_items.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- Users can delete items from their own packages
CREATE POLICY "Users can delete own package items"
  ON colis_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = colis_items.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- RLS Policies for verification_sessions

-- Users can view verification sessions for their packages
CREATE POLICY "Users can view own verification sessions"
  ON verification_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = verification_sessions.colis_id
      AND colis.user_id = auth.uid()
    )
    OR verifier_id = auth.uid()
  );

-- Users can create verification sessions for their packages
CREATE POLICY "Users can create verification sessions"
  ON verification_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = verification_sessions.colis_id
      AND colis.user_id = auth.uid()
    )
    AND verifier_id = auth.uid()
  );

-- Users can update their own verification sessions
CREATE POLICY "Users can update own verification sessions"
  ON verification_sessions
  FOR UPDATE
  TO authenticated
  USING (verifier_id = auth.uid())
  WITH CHECK (verifier_id = auth.uid());

-- RLS Policies for item_verifications

-- Users can view verifications in their sessions
CREATE POLICY "Users can view own item verifications"
  ON item_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM verification_sessions
      WHERE verification_sessions.id = item_verifications.session_id
      AND verification_sessions.verifier_id = auth.uid()
    )
  );

-- Users can create verifications in their sessions
CREATE POLICY "Users can create item verifications"
  ON item_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM verification_sessions
      WHERE verification_sessions.id = item_verifications.session_id
      AND verification_sessions.verifier_id = auth.uid()
      AND verification_sessions.session_status = 'in_progress'
    )
  );

-- Create function to update verification session counts
CREATE OR REPLACE FUNCTION update_verification_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE verification_sessions
  SET 
    verified_items = (
      SELECT COUNT(DISTINCT colis_item_id)
      FROM item_verifications
      WHERE session_id = NEW.session_id
      AND verification_status = 'verified'
    ),
    missing_items = (
      SELECT vs.total_items - COUNT(DISTINCT iv.colis_item_id)
      FROM verification_sessions vs
      LEFT JOIN item_verifications iv ON iv.session_id = vs.id AND iv.verification_status = 'verified'
      WHERE vs.id = NEW.session_id
      GROUP BY vs.total_items
    )
  WHERE id = NEW.session_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update counts after item verification
DROP TRIGGER IF EXISTS update_verification_counts_trigger ON item_verifications;
CREATE TRIGGER update_verification_counts_trigger
  AFTER INSERT OR UPDATE ON item_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_verification_counts();
