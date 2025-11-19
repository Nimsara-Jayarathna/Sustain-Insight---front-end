-- Sustain Insight Supabase schema -------------------------------------------------
-- Run this full script in the Supabase SQL editor to bootstrap every table, trigger,
-- and RBAC policy required by the React frontend.

-- 0. Extensions (for gen_random_uuid / crypto helpers)
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-----------------------------------------------------------------------------------
-- 1. Core taxonomy
-----------------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique
);

-----------------------------------------------------------------------------------
-- 2. Articles + category pivot
-----------------------------------------------------------------------------------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  content text,
  image_url text,
  image_path text,
  published_at timestamptz,
  source text,
  source_id uuid references public.sources(id),
  category_ids uuid[] default '{}',
  insight_count integer default 0,
  metadata jsonb default '{}'
);

create table public.article_categories (
  id bigserial primary key,
  article_id uuid references public.articles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade
);

-----------------------------------------------------------------------------------
-- 3. User profile + preferences
-----------------------------------------------------------------------------------
create table public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  job_title text,
  created_at timestamptz default timezone('utc', now())
);

create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  category_ids uuid[] default '{}',
  source_ids uuid[] default '{}',
  updated_at timestamptz default timezone('utc', now())
);

-----------------------------------------------------------------------------------
-- 4. Saved articles & insights
-----------------------------------------------------------------------------------
create table public.saved_articles (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz default timezone('utc', now()),
  unique (user_id, article_id)
);

create table public.article_insights (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz default timezone('utc', now()),
  unique (user_id, article_id)
);

-----------------------------------------------------------------------------------
-- 5. Profiles + RBAC (auth-backed roles)
-----------------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'user');
  end if;
end;
$$;

grant usage on type public.user_role to anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'user',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at = timezone('utc', now());
  return NEW;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.handle_profiles_updated_at();

create or replace function public.current_user_role()
returns public.user_role
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.user_role;
begin
  select role into result from public.profiles where id = auth.uid();
  return coalesce(result, 'user');
end;
$$;

grant execute on function public.current_user_role() to anon, authenticated;

create or replace function public.current_user_is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(role = 'admin', false)
  from public.profiles
  where id = auth.uid();
$$;

grant execute on function public.current_user_is_admin() to anon, authenticated;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    NEW.id,
    coalesce(
      nullif(trim((NEW.raw_user_meta_data ->> 'full_name')::text), ''),
      NEW.email
    )
  )
  on conflict (id) do nothing;
  return NEW;
end;
$$;

drop trigger if exists trg_new_user_profile on auth.users;
create trigger trg_new_user_profile
after insert on auth.users
for each row
execute procedure public.handle_new_user_profile();

alter table public.profiles enable row level security;

drop policy if exists "user-profile-self-select" on public.profiles;
create policy "user-profile-self-select"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "admin-profile-select" on public.profiles;
create policy "admin-profile-select"
on public.profiles
for select
using (
  auth.uid() = id
  or public.current_user_is_admin()
);

drop policy if exists "user-profile-update-name" on public.profiles;
create policy "user-profile-update-name"
on public.profiles
for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = public.current_user_role()
);

drop policy if exists "admin-profile-manage" on public.profiles;
create policy "admin-profile-manage"
on public.profiles
for update
using (
  public.current_user_is_admin()
  and auth.uid() <> id
)
with check (
  public.current_user_is_admin()
  and auth.uid() <> id
);

-- End of schema ------------------------------------------------------------------
