# Craftr Insights

Standalone survey app for collecting customer gift preferences. Separate from the main Craftr storefront — own repo, own URL.

## Flow

1. **Landing** — “Welcome to Craftr” + **Continue with Google** (only sign-in option)
2. **Survey** — Verified name/email from Google + phone number + gift preference questions
3. **Submit** — Full response emailed to you via Gmail (no database)

## Setup

### 1. Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR-VERCEL-DOMAIN/api/auth/callback/google`

### 2. Environment variables

Copy `.env.local.example` to `.env.local`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=   # run: openssl rand -base64 32

GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
NOTIFY_EMAIL=your@gmail.com
```

**Gmail app password:** Google Account → Security → 2-Step Verification → App passwords.

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy on Vercel

1. Push this folder to a **new GitHub repository** (not Craftr)
2. [vercel.com/new](https://vercel.com/new) → Import the repo → deploy
3. Add all env vars in Vercel project settings
4. Set `NEXTAUTH_URL` to your production URL (e.g. `https://insights.craftr.in`)
5. Add the production Google OAuth redirect URI

Generate a QR code pointing to your production URL for in-person collection.

## Viewing responses

Every submission sends a formatted email to `NOTIFY_EMAIL`. No database or Supabase setup required.

## Part 2 questions

- **Interests** — multi-select chips
- **Gift ideas** — husband/partner, best friend, mother, father
- **Occasions** — multi-select
- **Anything else** — optional notes

Edit options in `lib/survey.ts` and labels in `components/SurveyForm.tsx`.
