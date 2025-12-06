/*
  # Phone Number Call History System

  ## Overview
  This migration creates a comprehensive call history tracking system for phone numbers
  detected during capture sessions. It enables users to see complete interaction history
  and make informed decisions about follow-up actions.

  ## New Tables

  ### `phone_number_call_history`
  Tracks every call attempt and interaction with detected phone numbers
  - `id` (uuid, primary key) - Unique history record identifier
  - `phone_number_id` (uuid) - Reference to detected_phone_numbers
  - `phone_number` (text) - Phone number for easy querying
  - `call_outcome` (text) - Result of the call attempt
  - `call_type` (text) - Type of interaction (call, sms, whatsapp, etc.)
  - `call_duration` (integer) - Duration in seconds (for completed calls)
  - `notes` (text) - Additional notes about the interaction
  - `attempted_by` (uuid) - User who made the call attempt
  - `attempted_at` (timestamptz) - When the call was attempted
  - `created_at` (timestamptz) - Record creation timestamp

  ### `phone_number_summary_stats`
  Aggregated statistics for quick access (updated via triggers)
  - `id` (uuid, primary key) - Unique identifier
  - `phone_number` (text, unique) - Phone number
  - `total_attempts` (integer) - Total call attempts
  - `declined_count` (integer) - Number of declined calls
  - `no_answer_count` (integer) - Number of no answer calls
  - `answered_count` (integer) - Number of answered calls
  - `confirmed_count` (integer) - Number of confirmed contacts
  - `callback_requested_count` (integer) - Number of callback requests
  - `invalid_count` (integer) - Number marked as invalid
  - `completed_count` (integer) - Number of completed interactions
  - `last_contact_at` (timestamptz) - Most recent interaction timestamp
  - `last_outcome` (text) - Most recent interaction outcome
  - `success_rate` (numeric) - Percentage of successful contacts
  - `updated_at` (timestamptz) - Last update timestamp

  ## Call Outcomes
  - `not_called` - No call attempt made yet
  - `called_no_answer` - Called but no answer
  - `called_answered` - Call was answered
  - `confirmed` - Contact confirmed/accepted
  - `declined` - Contact declined/rejected
  - `callback_requested` - Requested callback
  - `invalid_contact` - Invalid/wrong number
  - `completed` - Interaction completed successfully

  ## Call Types
  - `phone_call` - Regular phone call
  - `whatsapp` - WhatsApp message/call
  - `sms` - SMS message
  - `other` - Other interaction type

  ## Security
  - Enable RLS on all tables
  - Users can only view/manage history for their own captures
  - Automated triggers maintain summary statistics
  - Comprehensive audit trail

  ## Performance
  - Indexes on phone_number for fast lookups
  - Indexes on attempted_at for time-based queries
  - Summary table for O(1) statistics access
*/

-- Create phone_number_call_history table
CREATE TABLE IF NOT EXISTS phone_number_call_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number_id uuid REFERENCES detected_phone_numbers(id) ON DELETE CASCADE,
  phone_number text NOT NULL,
  call_outcome text NOT NULL DEFAULT 'not_called',
  call_type text NOT NULL DEFAULT 'phone_call',
  call_duration integer DEFAULT 0,
  notes text DEFAULT '',
  attempted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  attempted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT call_outcome_check 
    CHECK (call_outcome IN (
      'not_called', 
      'called_no_answer', 
      'called_answered', 
      'confirmed', 
      'declined', 
      'callback_requested', 
      'invalid_contact', 
      'completed'
    )),
  CONSTRAINT call_type_check 
    CHECK (call_type IN ('phone_call', 'whatsapp', 'sms', 'other'))
);

-- Create phone_number_summary_stats table
CREATE TABLE IF NOT EXISTS phone_number_summary_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  total_attempts integer DEFAULT 0,
  declined_count integer DEFAULT 0,
  no_answer_count integer DEFAULT 0,
  answered_count integer DEFAULT 0,
  confirmed_count integer DEFAULT 0,
  callback_requested_count integer DEFAULT 0,
  invalid_count integer DEFAULT 0,
  completed_count integer DEFAULT 0,
  last_contact_at timestamptz,
  last_outcome text DEFAULT 'not_called',
  success_rate numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_history_phone_number ON phone_number_call_history(phone_number);
CREATE INDEX IF NOT EXISTS idx_call_history_phone_number_id ON phone_number_call_history(phone_number_id);
CREATE INDEX IF NOT EXISTS idx_call_history_attempted_at ON phone_number_call_history(attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_history_outcome ON phone_number_call_history(call_outcome);
CREATE INDEX IF NOT EXISTS idx_summary_stats_phone_number ON phone_number_summary_stats(phone_number);
CREATE INDEX IF NOT EXISTS idx_summary_stats_last_contact ON phone_number_summary_stats(last_contact_at DESC);

-- Enable Row Level Security
ALTER TABLE phone_number_call_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_number_summary_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for phone_number_call_history

-- Users can view call history for numbers from their captures
CREATE POLICY "Users can view call history for own captures"
  ON phone_number_call_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers dpn
      JOIN captures c ON c.id = dpn.capture_id
      WHERE dpn.id = phone_number_call_history.phone_number_id
      AND c.user_id = auth.uid()
    )
  );

-- Users can insert call history for numbers from their captures
CREATE POLICY "Users can create call history for own captures"
  ON phone_number_call_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers dpn
      JOIN captures c ON c.id = dpn.capture_id
      WHERE dpn.id = phone_number_call_history.phone_number_id
      AND c.user_id = auth.uid()
    )
  );

-- Users can update their own call history records
CREATE POLICY "Users can update own call history"
  ON phone_number_call_history
  FOR UPDATE
  TO authenticated
  USING (attempted_by = auth.uid())
  WITH CHECK (attempted_by = auth.uid());

-- Users can delete their own call history records
CREATE POLICY "Users can delete own call history"
  ON phone_number_call_history
  FOR DELETE
  TO authenticated
  USING (attempted_by = auth.uid());

-- RLS Policies for phone_number_summary_stats

-- Users can view summary stats for numbers from their captures
CREATE POLICY "Users can view summary stats for own captures"
  ON phone_number_summary_stats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers dpn
      JOIN captures c ON c.id = dpn.capture_id
      WHERE dpn.phone_number = phone_number_summary_stats.phone_number
      AND c.user_id = auth.uid()
    )
  );

-- Function to update summary statistics
CREATE OR REPLACE FUNCTION update_phone_number_summary_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_total_attempts integer;
  v_declined_count integer;
  v_no_answer_count integer;
  v_answered_count integer;
  v_confirmed_count integer;
  v_callback_count integer;
  v_invalid_count integer;
  v_completed_count integer;
  v_success_count integer;
  v_success_rate numeric;
BEGIN
  -- Count different outcomes
  SELECT 
    COUNT(*),
    SUM(CASE WHEN call_outcome = 'declined' THEN 1 ELSE 0 END),
    SUM(CASE WHEN call_outcome = 'called_no_answer' THEN 1 ELSE 0 END),
    SUM(CASE WHEN call_outcome = 'called_answered' THEN 1 ELSE 0 END),
    SUM(CASE WHEN call_outcome = 'confirmed' THEN 1 ELSE 0 END),
    SUM(CASE WHEN call_outcome = 'callback_requested' THEN 1 ELSE 0 END),
    SUM(CASE WHEN call_outcome = 'invalid_contact' THEN 1 ELSE 0 END),
    SUM(CASE WHEN call_outcome = 'completed' THEN 1 ELSE 0 END)
  INTO 
    v_total_attempts,
    v_declined_count,
    v_no_answer_count,
    v_answered_count,
    v_confirmed_count,
    v_callback_count,
    v_invalid_count,
    v_completed_count
  FROM phone_number_call_history
  WHERE phone_number = NEW.phone_number;

  -- Calculate success rate (confirmed + completed / total)
  v_success_count := COALESCE(v_confirmed_count, 0) + COALESCE(v_completed_count, 0);
  
  IF v_total_attempts > 0 THEN
    v_success_rate := (v_success_count::numeric / v_total_attempts::numeric) * 100;
  ELSE
    v_success_rate := 0;
  END IF;

  -- Insert or update summary stats
  INSERT INTO phone_number_summary_stats (
    phone_number,
    total_attempts,
    declined_count,
    no_answer_count,
    answered_count,
    confirmed_count,
    callback_requested_count,
    invalid_count,
    completed_count,
    last_contact_at,
    last_outcome,
    success_rate,
    updated_at
  )
  VALUES (
    NEW.phone_number,
    v_total_attempts,
    v_declined_count,
    v_no_answer_count,
    v_answered_count,
    v_confirmed_count,
    v_callback_count,
    v_invalid_count,
    v_completed_count,
    NEW.attempted_at,
    NEW.call_outcome,
    v_success_rate,
    now()
  )
  ON CONFLICT (phone_number)
  DO UPDATE SET
    total_attempts = v_total_attempts,
    declined_count = v_declined_count,
    no_answer_count = v_no_answer_count,
    answered_count = v_answered_count,
    confirmed_count = v_confirmed_count,
    callback_requested_count = v_callback_count,
    invalid_count = v_invalid_count,
    completed_count = v_completed_count,
    last_contact_at = NEW.attempted_at,
    last_outcome = NEW.call_outcome,
    success_rate = v_success_rate,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update summary stats
DROP TRIGGER IF EXISTS trigger_update_phone_summary_stats ON phone_number_call_history;
CREATE TRIGGER trigger_update_phone_summary_stats
  AFTER INSERT OR UPDATE ON phone_number_call_history
  FOR EACH ROW
  EXECUTE FUNCTION update_phone_number_summary_stats();

-- Function to automatically create call history when status changes
CREATE OR REPLACE FUNCTION log_phone_number_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF OLD.contact_status IS DISTINCT FROM NEW.contact_status THEN
    INSERT INTO phone_number_call_history (
      phone_number_id,
      phone_number,
      call_outcome,
      call_type,
      notes,
      attempted_at
    )
    VALUES (
      NEW.id,
      NEW.phone_number,
      NEW.contact_status,
      'phone_call',
      'Status changed from ' || COALESCE(OLD.contact_status, 'none') || ' to ' || NEW.contact_status,
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status change logging
DROP TRIGGER IF EXISTS trigger_log_status_change ON detected_phone_numbers;
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON detected_phone_numbers
  FOR EACH ROW
  WHEN (OLD.contact_status IS DISTINCT FROM NEW.contact_status)
  EXECUTE FUNCTION log_phone_number_status_change();
