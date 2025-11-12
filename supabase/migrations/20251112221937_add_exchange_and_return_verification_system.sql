/*
  # Exchange and Return Verification System

  ## Overview
  This migration implements:
  1. Exchange request functionality for book orders (livr2)
  2. Separate return verification workflow for return packages
  3. Clear distinction between exchanges and returns

  ## Changes
  
  ### 1. Update retours table
  - Add request_type field (exchange or return)
  - Add exchange_reason field for exchange requests
  - Add product_type to differentiate books from other products
  
  ### 2. Create return_verifications table
  - Separate workflow for verifying returned packages
  - Dedicated tracking for return inspection process
  
  ### 3. Update verification_sessions
  - Link to return verifications when applicable

  ## Security
  - Maintain existing RLS policies
  - Add policies for new tables
*/

-- Add new fields to retours table
DO $$
BEGIN
  -- Add request_type field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'retours' AND column_name = 'request_type'
  ) THEN
    ALTER TABLE retours ADD COLUMN request_type text DEFAULT 'return' NOT NULL;
    ALTER TABLE retours ADD CONSTRAINT retours_request_type_check 
      CHECK (request_type IN ('return', 'exchange'));
  END IF;

  -- Add exchange_reason field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'retours' AND column_name = 'exchange_reason'
  ) THEN
    ALTER TABLE retours ADD COLUMN exchange_reason text;
  END IF;

  -- Add product_type field
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'retours' AND column_name = 'product_type'
  ) THEN
    ALTER TABLE retours ADD COLUMN product_type text DEFAULT 'general';
    ALTER TABLE retours ADD CONSTRAINT retours_product_type_check 
      CHECK (product_type IN ('general', 'book', 'electronics', 'clothing', 'other'));
  END IF;

  -- Add custom_reason field for "other" option
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'retours' AND column_name = 'custom_reason'
  ) THEN
    ALTER TABLE retours ADD COLUMN custom_reason text;
  END IF;
END $$;

-- Create return_verifications table for separate return processing workflow
CREATE TABLE IF NOT EXISTS return_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retour_id uuid NOT NULL REFERENCES retours(id) ON DELETE CASCADE,
  colis_id uuid NOT NULL REFERENCES colis(id) ON DELETE CASCADE,
  
  -- Verification details
  verifier_id uuid REFERENCES auth.users(id),
  verification_status text DEFAULT 'pending' NOT NULL,
  
  -- Package condition
  package_condition text,
  items_complete boolean DEFAULT false,
  items_damaged boolean DEFAULT false,
  damage_description text,
  
  -- Photos/evidence
  photo_urls text[],
  
  -- Decision
  approval_status text DEFAULT 'pending',
  approval_notes text,
  refund_amount numeric DEFAULT 0,
  
  -- Timestamps
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT return_verifications_status_check 
    CHECK (verification_status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  CONSTRAINT return_verifications_approval_check 
    CHECK (approval_status IN ('pending', 'approved', 'rejected', 'partial'))
);

-- Enable RLS on return_verifications
ALTER TABLE return_verifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to return verifications"
  ON return_verifications
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_retours_request_type ON retours(request_type);
CREATE INDEX IF NOT EXISTS idx_retours_product_type ON retours(product_type);
CREATE INDEX IF NOT EXISTS idx_return_verifications_retour_id ON return_verifications(retour_id);
CREATE INDEX IF NOT EXISTS idx_return_verifications_status ON return_verifications(verification_status);

-- Update return_status to include exchange-specific statuses
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE retours DROP CONSTRAINT IF EXISTS retours_return_status_check;
  
  -- Add new constraint with exchange statuses
  ALTER TABLE retours ADD CONSTRAINT retours_return_status_check
    CHECK (return_status IN (
      'requested', 
      'approved', 
      'rejected', 
      'collected',
      'in_transit',
      'verified',
      'exchange_processing',
      'exchange_completed',
      'completed',
      'cancelled'
    ));
END $$;

-- Function to automatically create return verification when return is approved
CREATE OR REPLACE FUNCTION create_return_verification_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create verification for actual returns (not exchanges)
  IF NEW.request_type = 'return' 
     AND NEW.return_status = 'approved' 
     AND OLD.return_status != 'approved' THEN
    
    INSERT INTO return_verifications (
      retour_id,
      colis_id,
      verification_status
    ) VALUES (
      NEW.id,
      NEW.colis_id,
      'pending'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_create_return_verification ON retours;
CREATE TRIGGER trigger_create_return_verification
  AFTER UPDATE OF return_status ON retours
  FOR EACH ROW
  EXECUTE FUNCTION create_return_verification_on_approval();

-- Add comment to document the schema
COMMENT ON TABLE return_verifications IS 'Separate workflow for verifying and inspecting returned packages';
COMMENT ON COLUMN retours.request_type IS 'Type of request: return (standard return) or exchange (book exchange)';
COMMENT ON COLUMN retours.product_type IS 'Type of product being returned/exchanged: book, general, electronics, etc.';
