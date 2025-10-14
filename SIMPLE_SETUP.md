# 🚀 Simple Setup - Password Only

This is the simplified version without Supabase Auth. Just password protection + Supabase database.

## 1. Set Up Supabase Database (2 min)

1. Create project at [supabase.com](https://supabase.com)

2. Go to **SQL Editor** and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_team ON tasks(team);
CREATE INDEX IF NOT EXISTS idx_tasks_datetime ON tasks(datetime);

-- Enable Row Level Security (allow all for simplicity)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access" ON tasks FOR ALL USING (true);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at 
BEFORE UPDATE ON tasks 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
```

3. Get credentials from **Settings → API**:
   - Project URL
   - anon public key

## 2. Configure `.env.local`

```env
# Supabase (for database only)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Your team password (anything you want)
TEAM_PASSWORD=your-password-here
```

## 3. Run the App

```bash
npm run dev
```

Open http://localhost:3000

Login with the password you set in `TEAM_PASSWORD`!

## How It Works

- **Login**: Checks password against `TEAM_PASSWORD` env var
- **Session**: HTTP-only cookie, lasts 8 hours
- **Database**: Supabase for storing posts only (no auth)
- **Security**: Password + RLS policies protect your data

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `TEAM_PASSWORD`
4. Deploy!

That's it! No user management needed. 😺
