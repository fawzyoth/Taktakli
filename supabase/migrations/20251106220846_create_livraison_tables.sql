/*
  # Livraison (Delivery) System Tables

  ## Overview
  Creates tables for managing delivery packages (colis) and returns (retours)
  for the partnership with Shopa.ovh and Axess Logistique.

  ## New Tables

  ### `colis` (packages)
  Stores information about delivery packages created by users
  - `id` (uuid, primary key) - Unique package identifier
  - `tracking_number` (text, unique) - Auto-generated tracking number
  - `user_id` (uuid) - Reference to auth.users
  - `client_name` (text) - Customer name
  - `client_phone` (text) - Customer phone number
  - `client_address` (text) - Delivery address
  - `client_city` (text) - Delivery city
  - `client_postal_code` (text) - Postal code
  - `product_description` (text) - Package contents description
  - `product_value` (numeric) - Declared value in DT
  - `cod_amount` (numeric) - Cash on delivery amount (0 for prepaid)
  - `weight` (numeric) - Package weight in kg
  - `status` (text) - Package status (pending, picked_up, in_transit, delivered, returned)
  - `notes` (text, optional) - Additional notes
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `retours` (returns)
  Tracks return requests and their verification
  - `id` (uuid, primary key) - Unique return identifier
  - `colis_id` (uuid) - Reference to original package
  - `return_reason` (text) - Reason for return
  - `return_status` (text) - Status (requested, approved, rejected, completed)
  - `verified_by` (uuid, optional) - Admin who verified
  - `verification_notes` (text, optional) - Verification notes
  - `created_at` (timestamptz) - Request timestamp
  - `verified_at` (timestamptz, optional) - Verification timestamp

  ## Security
  - Enable RLS on both tables
  - Users can only view/manage their own packages
  - Users can request returns for their packages
  - Verification requires admin privileges

  ## Notes
  - Tracking numbers are auto-generated with prefix "SHOPA-"
  - Default COD amount is 0 (free returns as advertised)
  - Status tracking enables real-time monitoring
*/

-- Create colis table
CREATE TABLE IF NOT EXISTS colis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number text UNIQUE NOT NULL DEFAULT 'SHOPA-' || upper(substring(gen_random_uuid()::text, 1, 8)),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_address text NOT NULL,
  client_city text NOT NULL,
  client_postal_code text NOT NULL,
  product_description text NOT NULL,
  product_value numeric(10,2) NOT NULL DEFAULT 0,
  cod_amount numeric(10,2) NOT NULL DEFAULT 0,
  weight numeric(5,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create retours table
CREATE TABLE IF NOT EXISTS retours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colis_id uuid REFERENCES colis(id) ON DELETE CASCADE NOT NULL,
  return_reason text NOT NULL,
  return_status text NOT NULL DEFAULT 'requested',
  verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  verification_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_colis_user_id ON colis(user_id);
CREATE INDEX IF NOT EXISTS idx_colis_status ON colis(status);
CREATE INDEX IF NOT EXISTS idx_colis_tracking ON colis(tracking_number);
CREATE INDEX IF NOT EXISTS idx_retours_colis_id ON retours(colis_id);
CREATE INDEX IF NOT EXISTS idx_retours_status ON retours(return_status);

-- Enable Row Level Security
ALTER TABLE colis ENABLE ROW LEVEL SECURITY;
ALTER TABLE retours ENABLE ROW LEVEL SECURITY;

-- RLS Policies for colis table

-- Users can view their own packages
CREATE POLICY "Users can view own packages"
  ON colis
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own packages
CREATE POLICY "Users can create own packages"
  ON colis
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own packages (only if status is pending)
CREATE POLICY "Users can update pending packages"
  ON colis
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own pending packages
CREATE POLICY "Users can delete pending packages"
  ON colis
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

-- RLS Policies for retours table

-- Users can view returns for their packages
CREATE POLICY "Users can view own returns"
  ON retours
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = retours.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- Users can request returns for their packages
CREATE POLICY "Users can request returns"
  ON retours
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = retours.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- Users can view their return requests
CREATE POLICY "Users can update own return requests"
  ON retours
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = retours.colis_id
      AND colis.user_id = auth.uid()
    )
    AND return_status = 'requested'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM colis
      WHERE colis.id = retours.colis_id
      AND colis.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for colis table
DROP TRIGGER IF EXISTS update_colis_updated_at ON colis;
CREATE TRIGGER update_colis_updated_at
  BEFORE UPDATE ON colis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
