-- Waitlist table for Salary Secure market validation
-- Run in Supabase SQL editor or via migration tooling.
-- RLS enabled with NO public policies — only service role (server) can write/read.

create extension if not exists "pgcrypto";

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  whatsapp_consent boolean not null default false,
  city text,
  company text,
  role text,
  employment_type text,
  company_tenure text,
  salary_band text,
  monthly_expenses_band text,
  emi_band text,
  savings_runway text,
  desired_monthly_protection integer,
  desired_duration integer,
  displayed_price integer,
  willing_to_pay text check (willing_to_pay is null or willing_to_pay in ('yes', 'maybe', 'no')),
  referral_source text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  referral_code text,
  runway_code text,
  constraint waitlist_contact_check check (
    (email is not null and length(trim(email)) > 0)
    or (phone is not null and length(trim(phone)) > 0)
  )
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);
create index if not exists waitlist_email_idx on public.waitlist (email);
create index if not exists waitlist_phone_idx on public.waitlist (phone);
create index if not exists waitlist_referral_code_idx on public.waitlist (referral_code);

alter table public.waitlist enable row level security;

-- Intentionally no policies for anon/authenticated.
-- Inserts happen only via SUPABASE_SERVICE_ROLE_KEY on the server.
