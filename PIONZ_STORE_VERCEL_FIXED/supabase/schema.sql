-- PIONZ STORE production database for Supabase/Postgres
create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  code text not null unique,
  title text not null,
  price bigint not null default 0 check (price >= 0),
  original_price bigint,
  category text not null,
  level integer not null default 0,
  rank text not null default '',
  evo_guns jsonb not null default '[]'::jsonb,
  vault_count integer not null default 0,
  key_items jsonb not null default '[]'::jsonb,
  login_type text not null default '',
  bind_status text not null default '',
  status text not null default 'ready' check (status in ('ready','booked','sold')),
  featured boolean not null default false,
  hot_deal boolean not null default false,
  images jsonb not null default '[]'::jsonb,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  contact text,
  product_id text references public.products(id) on delete set null,
  product_code text,
  amount bigint not null default 0 check (amount >= 0),
  status text not null default 'Pending' check (status in ('Pending','Diproses','Selesai','Batal')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text not null check (type in ('percent','nominal')),
  value bigint not null check (value > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.store_config (
  id boolean primary key default true check (id),
  store_name text not null default 'PIONZ STORE',
  tagline text not null default '',
  logo_url text not null default '',
  wa1 text not null default '',
  wa2 text not null default '',
  wa_channel text not null default '',
  instagram text not null default '',
  announcement text not null default '',
  promo_banner text not null default '',
  low_stock_limit integer not null default 2,
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  event_type text not null check (event_type in ('page_view','account_view','buy_click','category_filter','search')),
  product_id text references public.products(id) on delete set null,
  product_code text,
  value text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  target_type text,
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_analytics_created_at on public.analytics_events(created_at desc);
create index if not exists idx_analytics_event_type on public.analytics_events(event_type);
create index if not exists idx_analytics_product on public.analytics_events(product_id);

insert into public.store_config (id, store_name, tagline, logo_url, wa1, wa2, wa_channel, instagram, announcement)
values (true, 'PIONZ STORE', 'Tempat Jual Beli Akun', 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg', '085181814366', '087714814910', 'https://whatsapp.com/channel/0029VbBF3Co59PwYb9Vl3J0z', 'pionzstore', 'PIONZ STORE: PROSES KILAT TRANSAKSI AMAN')
on conflict (id) do nothing;

-- Public storefront may read products/config. Writes remain server-side via the Vercel API.
alter table public.products enable row level security;
alter table public.store_config enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.promos enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products for select using (true);

drop policy if exists config_public_read on public.store_config;
create policy config_public_read on public.store_config for select using (true);

-- No public insert/update/delete policies: service-role server APIs handle admin writes.
