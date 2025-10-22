/*
  # Add Pages Table for TikTok Capture Application

  ## Overview
  This migration adds a pages table to manage different TikTok pages/accounts that can be monitored,
  and updates the captures table to support multi-page captures.

  ## New Tables

  ### 1. `pages`
  Stores TikTok pages/accounts that users want to monitor.
  - `id` (uuid, primary key) - Unique identifier for the page
  - `user_id` (uuid, foreign key) - References auth.users, owner of the page
  - `page_name` (text) - Name/identifier of the TikTok page
  - `page_url` (text, nullable) - URL to the TikTok page
  - `description` (text, nullable) - Optional description of the page
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 2. `capture_pages` (junction table)
  Links captures to multiple pages (many-to-many relationship).
  - `id` (uuid, primary key) - Unique identifier
  - `capture_id` (uuid, foreign key) - References captures table
  - `page_id` (uuid, foreign key) - References pages table
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all new tables
  - Users can only access their own pages and capture-page relationships
  - Policies for select, insert, update, and delete operations

  ## Indexes
  - Index on pages.user_id for faster queries
  - Indexes on capture_pages foreign keys for faster joins
*/

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_name text NOT NULL,
  page_url text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create capture_pages junction table
CREATE TABLE IF NOT EXISTS capture_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_id uuid NOT NULL REFERENCES captures(id) ON DELETE CASCADE,
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(capture_id, page_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pages_user_id ON pages(user_id);
CREATE INDEX IF NOT EXISTS idx_capture_pages_capture_id ON capture_pages(capture_id);
CREATE INDEX IF NOT EXISTS idx_capture_pages_page_id ON capture_pages(page_id);

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE capture_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages table
CREATE POLICY "Users can view own pages"
  ON pages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pages"
  ON pages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pages"
  ON pages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for capture_pages table
CREATE POLICY "Users can view capture_pages from own captures"
  ON capture_pages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = capture_pages.capture_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert capture_pages to own captures"
  ON capture_pages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = capture_pages.capture_id
      AND captures.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete capture_pages from own captures"
  ON capture_pages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM captures
      WHERE captures.id = capture_pages.capture_id
      AND captures.user_id = auth.uid()
    )
  );