/*
  # Allow Public Read Access for Demo Data

  1. Changes
    - Add public read policy for colis table
    - Add public read policy for retours table
    - This allows anonymous users to view demo data

  2. Security
    - Only SELECT (read) operations are allowed publicly
    - INSERT, UPDATE, DELETE still require authentication
*/

-- Allow public read access to colis
CREATE POLICY "Allow public read access to colis"
  ON colis
  FOR SELECT
  TO anon
  USING (true);

-- Allow public read access to retours
CREATE POLICY "Allow public read access to retours"
  ON retours
  FOR SELECT
  TO anon
  USING (true);
