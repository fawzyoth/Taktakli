/*
  # Add Client Recommendation System

  1. Changes
    - Add client_recommendation column to colis table
    - Values: 'good', 'not_good', or NULL (not yet evaluated)
    - Add index for filtering by recommendation

  2. Security
    - Public read access remains unchanged
    - Write access controlled by existing RLS policies
*/

-- Add client recommendation field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'colis' AND column_name = 'client_recommendation'
  ) THEN
    ALTER TABLE colis ADD COLUMN client_recommendation text;
    ALTER TABLE colis ADD CONSTRAINT client_recommendation_check 
      CHECK (client_recommendation IN ('good', 'not_good') OR client_recommendation IS NULL);
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_colis_client_recommendation 
  ON colis(client_recommendation);

-- Add index for filtering by client phone (for recommendation lookup)
CREATE INDEX IF NOT EXISTS idx_colis_client_phone 
  ON colis(client_phone);
