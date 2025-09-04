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


