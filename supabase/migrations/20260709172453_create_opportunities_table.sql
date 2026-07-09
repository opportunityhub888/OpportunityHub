/*
# Create opportunities table (single-tenant, no auth)

1. New Tables
- `opportunities`
  - `id` (uuid, primary key)
  - `title` (text, not null) - Name of the opportunity
  - `organization` (text, not null) - Organization offering it
  - `description` (text, not null) - What the opportunity is about
  - `category` (text, not null) - scholarship, olympiad, competition, internship, program, grant
  - `deadline` (date) - Application deadline
  - `eligibility` (text) - Who can apply
  - `amount` (text) - Prize/scholarship amount if applicable
  - `link` (text) - Official website URL
  - `featured` (boolean, default false) - Highlight on homepage
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `opportunities`.
- Allow anon + authenticated full CRUD - this is a public resource catalog.

3. Indexes
- Index on `category` for filtering
- Index on `deadline` for sorting/filtering
- Index on `featured` for homepage queries
*/

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('scholarship', 'olympiad', 'competition', 'internship', 'program', 'grant')),
  deadline date,
  eligibility text,
  amount text,
  link text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON opportunities(featured);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_opportunities" ON opportunities;
CREATE POLICY "anon_select_opportunities" ON opportunities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_opportunities" ON opportunities;
CREATE POLICY "anon_insert_opportunities" ON opportunities FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_opportunities" ON opportunities;
CREATE POLICY "anon_update_opportunities" ON opportunities FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_opportunities" ON opportunities;
CREATE POLICY "anon_delete_opportunities" ON opportunities FOR DELETE
  TO anon, authenticated USING (true);