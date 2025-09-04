-- Events and Registrations minimal schema

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  start_at timestamptz not null,
  fee_cents integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null,
  status text not null default 'pending', -- pending | paid | cancelled
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists registrations_event_user_unique
  on public.registrations (event_id, user_id);

-- Posts (News)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content_md text,
  cover_url text,
  author_id uuid,
  published_at timestamptz,
  created_at timestamptz not null default now()
);


-- Booking: tables and bookings

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text not null check (model in ('Q7','Q8')),
  created_at timestamptz not null default now()
);

-- seed logical order: 8 x Q7, 2 x Q8 (optional; seed separately in app if desired)

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.tables(id) on delete cascade,
  user_id uuid not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz not null default now(),
  constraint bookings_time_valid check (end_time > start_time)
);

-- Indexes for fast range-overlap queries
create index if not exists bookings_table_start_idx on public.bookings(table_id, start_time);
create index if not exists bookings_table_end_idx on public.bookings(table_id, end_time);
create index if not exists bookings_date_idx on public.bookings(date_trunc('day', start_time));

-- RLS
alter table public.tables enable row level security;
alter table public.bookings enable row level security;

-- Policies: tables readable by anyone; bookings readable by anyone (availability UI), insert/update/delete by owner only
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'tables' and policyname = 'tables_select_all'
  ) then
    create policy tables_select_all on public.tables for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_select_all'
  ) then
    create policy bookings_select_all on public.bookings for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_insert_own'
  ) then
    create policy bookings_insert_own on public.bookings for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_update_own'
  ) then
    create policy bookings_update_own on public.bookings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'bookings' and policyname = 'bookings_delete_own'
  ) then
    create policy bookings_delete_own on public.bookings for delete using (auth.uid() = user_id);
  end if;
end $$;

-- Enable Realtime on bookings (Supabase Realtime listens to this publication)
do $$ begin
  perform 1 from pg_publication where pubname = 'supabase_realtime';
  if found then
    execute 'alter publication supabase_realtime add table public.bookings';
  end if;
end $$;


