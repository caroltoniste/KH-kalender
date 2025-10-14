# ⚡ Quick Start Guide

Get your Kitten Calendar running in 10 minutes!

## Step 1: Set Up Supabase (5 min)

1. **Create project** at [supabase.com](https://supabase.com)

2. **Run SQL** (copy from `SUPABASE_SETUP.md` section 2):
   - Go to SQL Editor
   - Paste and run the table creation script

3. **Enable real-time**:
   - Database → Replication → Enable `tasks` table

4. **Create user**:
   - Authentication → Users → "Add user"
   - Email: `team@kittenhelp.ee`
   - Password: Your team password
   - ✅ Auto Confirm User

5. **Get credentials**:
   - Settings → API
   - Copy Project URL and anon key

## Step 2: Configure App (2 min)

Create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
TEAM_PASSWORD=your-team-password
```

## Step 3: Run! (1 min)

```bash
# Already installed dependencies, so just run:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Login with your team password → Start adding posts! 🎉

## Quick Test

Add a test post:
- Click on today's date
- Fill in title: "Test postitus"
- Select type: "Muu"
- Check at least one channel
- Click "Salvesta"

See it appear on calendar and in the list!

## Troubleshooting

**"Cannot find module" errors?**
```bash
npm install
```

**Login fails?**
- Check user exists in Supabase (Authentication → Users)
- Verify password matches `.env.local`

**Posts don't appear?**
- Check Supabase credentials in `.env.local`
- Verify RLS policies are enabled

**Real-time not working?**
- Enable replication for `tasks` table
- Check browser console for errors

## Next Steps

1. ✅ **Test all features** (add, edit, delete posts)
2. 📱 **Test mobile view** (open in phone browser)
3. 🚀 **Deploy to Vercel** (see `README.md`)
4. 🎨 **Customize** (colors, logo, etc.)

## Need Help?

Check the full guides:
- `README.md` - Complete documentation
- `SUPABASE_SETUP.md` - Detailed database setup

---

**Linnuke kirja. Nurruke koju 😺**
