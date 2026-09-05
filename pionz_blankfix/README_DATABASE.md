# PIONZ STORE — Database Setup

This package includes a production-ready Supabase/Postgres schema in `supabase/schema.sql`.

## Important
An actual online Supabase project cannot be created from this ZIP alone because it belongs to your Supabase account. Create the project yourself, then paste `supabase/schema.sql` into Supabase SQL Editor and run it.

For Vercel server APIs, configure:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

**Never put `SUPABASE_SERVICE_ROLE_KEY` in frontend code or `VITE_*` variables.**

The schema covers:
- products / stock
- customers
- orders
- promos
- store configuration
- analytics events
- admin audit logs

The current UI in this archive still has localStorage fallback for existing catalog/order screens. The database schema is ready, but full migration of every UI operation to the database requires wiring the admin/store APIs to these tables.
