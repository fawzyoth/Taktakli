/*
  # TikTok Phone Number Detection Schema

  ## Overview
  This migration creates the complete database schema for the TikTok phone number detection application.

  ## New Tables

  ### 1. `captures`
  Stores information about each live TikTok capture session.
  - `id` (uuid, primary key) - Unique identifier for the capture
  - `user_id` (uuid, foreign key) - References auth.users, owner of the capture
  - `title` (text) - Name/title of the capture session
  - `status` (text) - Current status: 'active', 'stopped', 'completed'
  - `likes_count` (integer) - Number of likes received during capture
  - `comments_count` (integer) - Number of comments received during capture
  - `phone_numbers_count` (integer) - Number of unique phone numbers detected
  - `started_at` (timestamptz) - When the capture was started
  - `stopped_at` (timestamptz, nullable) - When the capture was stopped
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 2. `detected_phone_numbers`
  Stores individual phone numbers detected during captures.
  - `id` (uuid, primary key) - Unique identifier for the detection
  - `capture_id` (uuid, foreign key) - References captures table
  - `phone_number` (text) - The detected phone number
  - `user_profile_image` (text, nullable) - URL to user's profile image
  - `username` (text, nullable) - TikTok username
  - `detected_at` (timestamptz) - When the phone number was detected
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `phone_number_comments`
  Stores comments associated with detected phone numbers.
  - `id` (uuid, primary key) - Unique identifier for the comment
  - `detected_phone_id` (uuid, foreign key) - References detected_phone_numbers table
  - `comment_text` (text) - The actual comment text
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Users can only access their own captures and associated data
  - Policies for select, insert, update, and delete operations

  ## Indexes
  - Index on captures.user_id for faster queries
  - Index on detected_phone_numbers.capture_id for faster queries
  - Index on phone_number_comments.detected_phone_id for faster queries
*/

-- Create captures table
CREATE TABLE IF NOT EXISTS captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'completed')),
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  phone_numbers_count integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  stopped_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create detected_phone_numbers table
CREATE TABLE IF NOT EXISTS detected_phone_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_id uuid NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
  phone_number text NOT NULL,
  user_profile_image text,
  username text,
  detected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create phone_number_comments table
CREATE TABLE IF NOT EXISTS phone_number_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  detected_phone_id uuid NOT NULL REFERENCES detected_phone_numbers(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_captures_user_id ON captures(user_id);
CREATE INDEX IF NOT EXISTS idx_captures_status ON captures(status);
CREATE INDEX IF NOT EXISTS idx_detected_phone_numbers_capture_id ON detected_phone_numbers(capture_id);
CREATE INDEX IF NOT EXISTS idx_phone_number_comments_detected_phone_id ON phone_number_comments(detected_phone_id);

-- Enable Row Level Security
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_number_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for captures table
CREATE POLICY "Users can view own captures"
  ON captures FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own captures"
  ON captures FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own captures"
  ON captures FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own captures"
  ON captures FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for detected_phone_numbers table
CREATE POLICY "Users can view phone numbers from own captures"
  ON detected_phone_numbers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = detected_phone_numbers.capture_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert phone numbers to own captures"
  ON detected_phone_numbers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = detected_phone_numbers.capture_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update phone numbers from own captures"
  ON detected_phone_numbers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = detected_phone_numbers.capture_id
      AND captures.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = detected_phone_numbers.capture_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete phone numbers from own captures"
  ON detected_phone_numbers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = detected_phone_numbers.capture_id
      AND captures.user_id = auth.uid()
    )
  );

-- RLS Policies for phone_number_comments table
CREATE POLICY "Users can view comments from own captures"
  ON phone_number_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers
      JOIN captures ON captures.id = detected_phone_numbers.capture_id
      WHERE detected_phone_numbers.id = phone_number_comments.detected_phone_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert comments to own captures"
  ON phone_number_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers
      JOIN captures ON captures.id = detected_phone_numbers.capture_id
      WHERE detected_phone_numbers.id = phone_number_comments.detected_phone_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update comments from own captures"
  ON phone_number_comments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers
      JOIN captures ON captures.id = detected_phone_numbers.capture_id
      WHERE detected_phone_numbers.id = phone_number_comments.detected_phone_id
      AND captures.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers
      JOIN captures ON captures.id = detected_phone_numbers.capture_id
      WHERE detected_phone_numbers.id = phone_number_comments.detected_phone_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete comments from own captures"
  ON phone_number_comments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM detected_phone_numbers
      JOIN captures ON captures.id = detected_phone_numbers.capture_id
      WHERE detected_phone_numbers.id = phone_number_comments.detected_phone_id
      AND captures.user_id = auth.uid()
    )
  );