-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS birth_date timestamptz,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS phone text;

-- Add check constraint for age
ALTER TABLE profiles
ADD CONSTRAINT check_age CHECK (
  EXTRACT(YEAR FROM age(CURRENT_DATE, birth_date::date)) >= 18
);