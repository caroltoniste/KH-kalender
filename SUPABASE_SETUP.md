# 🗄️ Supabase Setup Guide

Complete guide to setting up the Supabase database for Kitten Calendar.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name**: Kitten Calendar
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to Estonia (e.g., Frankfurt)
4. Click "Create new project"
5. Wait for setup to complete (~2 minutes)

## 2. Create Database Table

Go to **SQL Editor** in the Supabase dashboard and run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  time TEXT,
  owner TEXT,
  channels TEXT[] DEFAULT '{}',
  notes TEXT,
  copy TEXT,
  materials TEXT,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_tasks_team ON tasks(team);
CREATE INDEX idx_tasks_datetime ON tasks(datetime);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow all operations for authenticated users
CREATE POLICY "Enable all for authenticated users" 
ON tasks 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create policy: Allow read for authenticated users
CREATE POLICY "Enable read access for authenticated users" 
ON tasks 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policy: Allow insert for authenticated users
CREATE POLICY "Enable insert for authenticated users" 
ON tasks 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy: Allow update for authenticated users
CREATE POLICY "Enable update for authenticated users" 
ON tasks 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create policy: Allow delete for authenticated users
CREATE POLICY "Enable delete for authenticated users" 
ON tasks 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at 
BEFORE UPDATE ON tasks 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

Click **Run** to execute.

## 3. Enable Real-time

1. Go to **Database** → **Replication** in Supabase dashboard
2. Find the `tasks` table
3. Enable replication by toggling the switch
4. This allows real-time subscriptions to work

## 4. Create Authentication User

### Option A: Via Dashboard (Recommended)

1. Go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Fill in:
   - **Email**: `team@kittenhelp.ee`
   - **Password**: Your team password (same as `TEAM_PASSWORD` in `.env.local`)
   - **Auto Confirm User**: ✅ (check this box)
4. Click "Create user"

### Option B: Via SQL (Alternative)

If you prefer, run this in SQL Editor:

```sql
-- Insert auth user (replace 'your-password' with actual password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'team@kittenhelp.ee',
  crypt('your-password', gen_salt('bf')), -- Replace 'your-password'
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## 5. Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
3. Add them to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
TEAM_PASSWORD=your-team-password
```

## 6. Test Database Connection

Run this test query in SQL Editor to verify setup:

```sql
-- Check if table exists
SELECT * FROM tasks LIMIT 1;

-- Insert test post
INSERT INTO tasks (team, title, type, datetime, channels) 
VALUES ('kittenhelp', 'Test Post', 'other', NOW(), ARRAY['facebook']);

-- Retrieve test post
SELECT * FROM tasks WHERE team = 'kittenhelp';

-- Clean up test post
DELETE FROM tasks WHERE title = 'Test Post';
```

## 7. Configure Session Duration

By default, Supabase sessions last 1 hour. To extend to 8 hours:

1. Go to **Authentication** → **Settings**
2. Find "JWT expiry limit"
3. Set to `28800` (8 hours in seconds)
4. Click "Save"

## 8. Security Best Practices

### ✅ Enable RLS
Row Level Security is already enabled in the SQL above. Verify:
- Go to **Database** → **Tables** → `tasks`
- Ensure "Enable RLS" is checked

### ✅ Secure API Keys
- Never commit API keys to git
- Use environment variables only
- The `anon` key is safe for client-side use (RLS protects data)

### ✅ Production Settings
For production deployment:
1. Use strong database password
2. Enable email confirmations (if needed)
3. Set up custom domain
4. Enable HTTPS only

## 9. Optional: Add Sample Data

To test the calendar with sample data:

```sql
INSERT INTO tasks (team, title, type, datetime, time, owner, channels, notes, done) VALUES
('kittenhelp', 'Annetuskampaania video', 'donation', '2024-11-15 18:00:00+00', '18:00', 'Mari', ARRAY['tiktok', 'instagram'], 'Kasuta uusi kassipilte', false),
('kittenhelp', 'Koduotsija: Miisu', 'adoption', '2024-11-16 12:00:00+00', '12:00', 'Kati', ARRAY['facebook', 'instagram'], 'Lisa link ankeedile', false),
('kittenhelp', 'Loomapäeva üritus', 'event', '2024-11-20 10:00:00+00', '10:00', 'Jaan', ARRAY['facebook'], 'Meeldetuletus 2 päeva enne', false),
('kittenhelp', 'Nädala video: Kalli lood', 'video', '2024-11-18 19:00:00+00', '19:00', 'Mari', ARRAY['tiktok', 'instagram'], 'Trendy muusika', false);
```

## 10. Troubleshooting

### Issue: Can't insert data
**Solution**: Check RLS policies are correct:
```sql
-- View all policies
SELECT * FROM pg_policies WHERE tablename = 'tasks';
```

### Issue: Real-time not working
**Solution**: 
1. Check replication is enabled (step 3)
2. Verify WebSocket connection in browser DevTools
3. Check Supabase project isn't paused

### Issue: Authentication fails
**Solution**:
1. Verify user exists: `SELECT * FROM auth.users WHERE email = 'team@kittenhelp.ee';`
2. Check password is correct
3. Ensure user is confirmed

## 11. Backup & Export

### Export Data
```sql
COPY (SELECT * FROM tasks WHERE team = 'kittenhelp') 
TO '/tmp/tasks_backup.csv' 
WITH CSV HEADER;
```

Or use Supabase Dashboard → Database → Backups

### Restore Data
```sql
COPY tasks (team, title, type, datetime, time, owner, channels, notes, copy, materials, done)
FROM '/tmp/tasks_backup.csv'
WITH CSV HEADER;
```

## 🎉 Setup Complete!

Your Supabase database is now ready. Proceed to run the Next.js app:

```bash
npm run dev
```

Visit http://localhost:3000 and log in with your team password!
