# PIONZ STORE — FINAL DATABASE EDITION

Production-ready Vite storefront with server-backed products/config via Supabase + Vercel API.

## Vercel Environment Variables
Set these in Production (and Preview if needed):
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` (random long secret)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase
1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Copy Project URL and service-role key into Vercel Environment Variables.
4. Deploy.

The service-role key is used **only in Vercel server functions** and is never shipped to the browser.

## Deploy
Upload the contents of this ZIP to the GitHub repository root. Vercel:
- Framework: Vite
- Root Directory: `./`
- Install: `npm install`
- Build: `npm run build`
- Output: `dist`
