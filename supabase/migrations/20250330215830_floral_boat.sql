/*
  # Add Terms Acceptance and Newsletter Subscription

  1. New Columns
    - `terms_accepted` (boolean) - Track if user accepted terms
    - `terms_accepted_at` (timestamp) - When terms were accepted
    - `newsletter_subscription` (boolean) - Track newsletter subscription
    - `marketing_consent` (boolean) - Track marketing communications consent

  2. Changes
    - Add new columns to profiles table
    - Add constraint to ensure terms_accepted_at is set when terms are accepted
*/

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
ADD COLUMN IF NOT EXISTS newsletter_subscription boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false;

-- Add constraint to ensure terms_accepted_at is set when terms are accepted
ALTER TABLE profiles
ADD CONSTRAINT terms_acceptance_timestamp CHECK (
  (NOT terms_accepted) OR (terms_accepted AND terms_accepted_at IS NOT NULL)
);