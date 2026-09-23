# React + Chakra UI + Redux Toolkit + Supabase Starter

A complete starter application with:

- React + Vite
- Chakra UI v3
- Redux Toolkit + React Redux
- Supabase Auth + PostgreSQL
- React Router
- Protected dashboard
- Login/register/logout
- Supabase profile table and RLS policies

## Setup

1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. Add your Supabase URL and anon/publishable key.
4. Run the SQL in `supabase/schema.sql` in Supabase SQL Editor.
5. Install dependencies:

```bash
npm install
```

6. Start:

```bash
npm run dev
```

## Supabase

Authentication is handled by Supabase Auth. The `profiles` table is linked to `auth.users`.

The included SQL creates:
- `profiles`
- automatic profile creation trigger
- Row Level Security
- policies for reading/updating/inserting the signed-in user's profile

## Routes

- `/` Home
- `/login` Login
- `/register` Register
- `/dashboard` Protected dashboard

## Environment variables

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Do not put a Supabase service-role key in the frontend.
