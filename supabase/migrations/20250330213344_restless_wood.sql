/*
  # Add gender field to profiles table

  1. Changes
    - Add gender column to profiles table
    - Add check constraint to ensure valid gender values
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female'));