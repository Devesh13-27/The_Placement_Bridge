-- Fixes infinite RLS recursion in the helper functions used by policies.
-- Run this once in the Supabase SQL editor against your existing project.
-- See supabase/schema.sql for the full explanation.

create or replace function is_verified_profile()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and verification_status = 'verified'
  );
$$;

create or replace function current_role_name()
returns text language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function current_company_id()
returns uuid language sql stable security definer set search_path = public as $$
  select company_id from profiles where id = auth.uid();
$$;

create or replace function current_college_id()
returns uuid language sql stable security definer set search_path = public as $$
  select college_id from profiles where id = auth.uid();
$$;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;
