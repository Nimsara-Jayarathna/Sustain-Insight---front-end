-- Supabase RBAC bootstrap ---------------------------------------------------
-- This script provisions the profiles table, helper functions, and RLS
-- policies that enforce role-based access without any custom backend.

-- 1) Roles enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'user');
  end if;
end;
$$;

grant usage on type public.user_role to anon, authenticated;

-- 2) Profiles table + timestamps
create table if not exists public.profiles (
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

-- 3) Helper functions evaluated in RLS (security definer bypasses RLS)
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

-- 4) Trigger: auto insert profile row for new auth users
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

-- 5) RLS policies
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

-- Deploy this script after the base schema to complete RBAC wiring.
