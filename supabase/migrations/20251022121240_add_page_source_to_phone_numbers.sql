/*
  # Add page source to detected phone numbers

  1. Changes
    - Add `page_id` column to `detected_phone_numbers` table
    - Add foreign key constraint to reference `pages` table
    - Add index for better query performance
    - Column is nullable to support existing data

  2. Purpose
    - Track which page (TikTok account) each phone number was detected from
    - Enable filtering and grouping by source page
*/

-- Add page_id column to detected_phone_numbers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detected_phone_numbers' AND column_name = 'page_id'
  ) THEN
    ALTER TABLE detected_phone_numbers ADD COLUMN page_id uuid REFERENCES pages(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_detected_phone_numbers_page_id ON detected_phone_numbers(page_id);
