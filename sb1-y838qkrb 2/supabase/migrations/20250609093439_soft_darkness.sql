/*
  # Initial TrailMedic Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `emergency_assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `photo_url` (text)
      - `description` (text)
      - `location_data` (jsonb) - stores GPS coordinates and accuracy
      - `injury_types` (text array)
      - `triage_status` (text)
      - `severity_level` (text)
      - `immediate_actions` (text array)
      - `assessment_steps` (text array)
      - `red_flags` (text array)
      - `next_steps` (text array)
      - `ai_response` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `emergency_contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `phone` (text)
      - `relationship` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `assessment_id` (uuid, references emergency_assessments)
      - `message` (text)
      - `response` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for emergency data access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emergency_assessments table
CREATE TABLE IF NOT EXISTS emergency_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url text,
  description text,
  location_data jsonb,
  injury_types text[] DEFAULT '{}',
  triage_status text DEFAULT 'pending' CHECK (triage_status IN ('pending', 'analyzed', 'completed')),
  severity_level text CHECK (severity_level IN ('critical', 'serious', 'moderate', 'minor')),
  immediate_actions text[] DEFAULT '{}',
  assessment_steps text[] DEFAULT '{}',
  red_flags text[] DEFAULT '{}',
  next_steps text[] DEFAULT '{}',
  ai_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  relationship text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES emergency_assessments(id) ON DELETE CASCADE,
  message text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Emergency assessments policies
CREATE POLICY "Users can read own assessments"
  ON emergency_assessments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assessments"
  ON emergency_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
  ON emergency_assessments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own assessments"
  ON emergency_assessments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Emergency contacts policies
CREATE POLICY "Users can read own contacts"
  ON emergency_contacts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own contacts"
  ON emergency_contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own contacts"
  ON emergency_contacts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own contacts"
  ON emergency_contacts
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Chat messages policies
CREATE POLICY "Users can read chat messages for own assessments"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    assessment_id IN (
      SELECT id FROM emergency_assessments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert chat messages for own assessments"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    assessment_id IN (
      SELECT id FROM emergency_assessments WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emergency_assessments_user_id ON emergency_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_assessments_created_at ON emergency_assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_assessment_id ON chat_messages(assessment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_assessments_updated_at
  BEFORE UPDATE ON emergency_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON emergency_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();