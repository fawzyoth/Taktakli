/*
  # Add Contact Status Tracking and Sequential Numbering

  ## Overview
  This migration adds contact status tracking and sequential numbering to phone numbers
  for improved workflow management and organization.

  ## Changes Made

  ### 1. New Columns in `detected_phone_numbers`
    - `contact_status` (text) - Tracks the current status of contact attempts
      * Default: "not_called"
      * Possible values: not_called, called_no_answer, called_answered, confirmed, 
        declined, callback_requested, invalid_contact, completed
    
    - `sequence_number` (integer) - Sequential order number within each capture
      * Auto-increments per capture for easy reference
      * Helps users track the order of phone numbers
    
    - `status_updated_at` (timestamptz) - Timestamp of last status change
      * Tracks when status was last modified
      * Useful for workflow analytics

  ### 2. Security
    - Maintains existing RLS policies
    - No changes to access controls

  ## Important Notes
  - Status field uses text with check constraint for flexibility
  - Sequence numbers are capture-specific (restart at 1 for each capture)
  - Default status is "not_called" for all new entries
  - Existing records will be backfilled with default status and sequential numbers
*/

-- Add contact_status column with check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detected_phone_numbers' AND column_name = 'contact_status'
  ) THEN
    ALTER TABLE detected_phone_numbers 
    ADD COLUMN contact_status text DEFAULT 'not_called' NOT NULL
    CHECK (contact_status IN (
      'not_called',
      'called_no_answer',
      'called_answered',
      'confirmed',
      'declined',
      'callback_requested',
      'invalid_contact',
      'completed'
    ));
  END IF;
END $$;

-- Add sequence_number column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detected_phone_numbers' AND column_name = 'sequence_number'
  ) THEN
    ALTER TABLE detected_phone_numbers 
    ADD COLUMN sequence_number integer;
  END IF;
END $$;

-- Add status_updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'detected_phone_numbers' AND column_name = 'status_updated_at'
  ) THEN
    ALTER TABLE detected_phone_numbers 
    ADD COLUMN status_updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Backfill sequence numbers for existing records
-- This assigns sequential numbers based on detected_at timestamp within each capture
DO $$
BEGIN
  UPDATE detected_phone_numbers dpn
  SET sequence_number = subquery.row_num
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (PARTITION BY capture_id ORDER BY detected_at ASC) as row_num
    FROM detected_phone_numbers
  ) subquery
  WHERE dpn.id = subquery.id AND dpn.sequence_number IS NULL;
END $$;

-- Make sequence_number NOT NULL after backfill
ALTER TABLE detected_phone_numbers 
ALTER COLUMN sequence_number SET NOT NULL;

-- Create index for faster status filtering
CREATE INDEX IF NOT EXISTS idx_detected_phone_numbers_status 
ON detected_phone_numbers(contact_status);

-- Create index for sequence number ordering
CREATE INDEX IF NOT EXISTS idx_detected_phone_numbers_sequence 
ON detected_phone_numbers(capture_id, sequence_number);

-- Create function to auto-increment sequence_number for new inserts
CREATE OR REPLACE FUNCTION set_phone_number_sequence()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sequence_number IS NULL THEN
    SELECT COALESCE(MAX(sequence_number), 0) + 1
    INTO NEW.sequence_number
    FROM detected_phone_numbers
    WHERE capture_id = NEW.capture_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-set sequence number
DROP TRIGGER IF EXISTS trigger_set_phone_number_sequence ON detected_phone_numbers;
CREATE TRIGGER trigger_set_phone_number_sequence
  BEFORE INSERT ON detected_phone_numbers
  FOR EACH ROW
  EXECUTE FUNCTION set_phone_number_sequence();

-- Create function to update status_updated_at when status changes
CREATE OR REPLACE FUNCTION update_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.contact_status IS DISTINCT FROM NEW.contact_status THEN
    NEW.status_updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update status timestamp
DROP TRIGGER IF EXISTS trigger_update_status_timestamp ON detected_phone_numbers;
CREATE TRIGGER trigger_update_status_timestamp
  BEFORE UPDATE ON detected_phone_numbers
  FOR EACH ROW
  EXECUTE FUNCTION update_status_timestamp();