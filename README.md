# 🐱 Kitten Help Marketing Calendar

Marketing calendar application for Kitten Help MTÜ (Estonian cat rescue organization) built with Next.js, Supabase, and shadcn-ui.

## 🚀 Features

- **📅 Calendar View** - Month-based calendar with post icons (up to 3 per day + overflow)
- **📝 Post Management** - Add, edit, delete posts with inline editor
- **✅ Task Tracking** - Mark posts as done/undone
- **🔄 Real-time Sync** - Multiple users see updates instantly
- **🎨 Beautiful UI** - Pastel pink theme with smooth animations
- **📱 Responsive** - Works on mobile, tablet, and desktop
- **🇪🇪 Estonian Language** - Full Estonian UI and date formatting

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Database**: Supabase (PostgreSQL + Real-time)
- **Authentication**: Supabase Auth (password-based team access)
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ (installed via nvm)
- Supabase account
- Vercel account (for deployment)

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration script (see `SUPABASE_SETUP.md`)
3. Get your project credentials:
   - Go to Settings → API
   - Copy the `Project URL` and `anon` key

### 3. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
TEAM_PASSWORD=your-secure-password
```

### 4. Create Auth User

In Supabase Dashboard:
1. Go to Authentication → Users
2. Create a new user:
   - Email: `team@kittenhelp.ee`
   - Password: (same as `TEAM_PASSWORD` above)
3. Confirm the user email

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### `tasks` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| team | text | Team identifier ("kittenhelp") |
| title | text | Post title |
| type | text | Post type (donation, video, event, etc.) |
| datetime | timestamptz | Post date and time |
| time | text | Time in HH:mm format |
| owner | text | Responsible person |
| channels | text[] | Social channels (tiktok, facebook, instagram) |
| notes | text | Additional notes |
| copy | text | Post content/copy |
| materials | text | Links to images/videos |
| done | boolean | Completion status |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |

## 📱 Post Types

| Type | Estonian | Emoji |
|------|----------|-------|
| donation | Annetuspostitus | 💖 |
| video | Video postitus | 🎬 |
| event | Üritus | 📅 |
| adoption | Koduotsija | 🐾 |
| news | Koduuudised | 📰 |
| lottery | Loos | 🎟️ |
| collaboration | Koostöö | 🤝 |
| update | Update lood | 📝 |
| other | Muu | ✨ |

## 🎨 Theme Colors

```css
--paper: #fef7f7      /* Background */
--ink: #4a3a4a        /* Text */
--accent1: #ffb3d1    /* Soft pink */
--accent2: #ffd1e8    /* Very soft pink */
--accent3: #fff0f5    /* Cream pink */
--line: #e8c5d1       /* Borders */
--ok: #8dd4a3         /* Green for done */
```

## 🚢 Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `TEAM_PASSWORD`
5. Deploy!

## 📖 Usage

### Logging In
- Navigate to the login page
- Enter the team password
- Session lasts 8 hours

### Adding a Post
1. Click a calendar day or "Lisa uus postitus" button
2. Fill in the form:
   - Date and time
   - Post type
   - Title (required)
   - Responsible person
   - Channels (required - at least one)
   - Post copy, materials, notes
3. Click "Salvesta"

### Editing a Post
1. Click on a post in the list
2. Modify any fields
3. Click "Salvesta" (only enabled if changes made)

### Deleting a Post
1. Click on a post to open the editor
2. Click "Kustuta"
3. Confirm deletion

### Marking as Done
- Click the checkbox next to any post
- Done posts appear semi-transparent

## 🔒 Security Notes

- Never commit `.env.local` to git
- Use strong team password
- Supabase Row Level Security (RLS) is enabled
- Session expires after 8 hours
- HTTPS only in production

## 🐛 Troubleshooting

### "Unauthorized" errors
- Check that auth user exists in Supabase
- Verify password matches `TEAM_PASSWORD`
- Check session hasn't expired

### Posts not appearing
- Verify Supabase credentials
- Check RLS policies are enabled
- Ensure `team` field matches "kittenhelp"

### Real-time not working
- Check browser console for connection errors
- Verify Supabase real-time is enabled for your project
- Check network/firewall settings

## 📄 License

Private project for Kitten Help MTÜ

## 🐱 Kitten Help MTÜ

**Linnuke kirja. Nurruke koju 😺**

Helping Estonian cats find loving homes!

<!-- Updated: 2025-10-14 -->
