-- Glowline schema — run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  clinic_name text not null default 'Untitled clinic',
  address text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  operating_hours text not null default '',
  tone text not null default 'Warm, discreet, and precise.',
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  name text not null,
  duration_minutes integer not null default 30,
  price_gbp numeric(10, 2) not null default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  question text not null,
  answer text not null
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  patient_name text not null,
  channel text not null check (channel in ('whatsapp', 'web')),
  status text not null check (status in ('hot', 'booked', 'inquired')),
  summary text not null default '',
  estimated_value_gbp numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  role text not null check (role in ('patient', 'assistant')),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.review_settings (
  clinic_id uuid primary key references public.clinics (id) on delete cascade,
  enabled boolean not null default true,
  send_delay_hours integer not null default 24,
  sms_template text not null,
  google_review_url text not null default '',
  escalate_if_score_below integer not null default 4
);

create table if not exists public.subscriptions (
  clinic_id uuid primary key references public.clinics (id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive'
);

alter table public.clinics enable row level security;
alter table public.services enable row level security;
alter table public.faqs enable row level security;
alter table public.leads enable row level security;
alter table public.lead_messages enable row level security;
alter table public.review_settings enable row level security;
alter table public.subscriptions enable row level security;

create policy "owners manage their clinic"
  on public.clinics for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "owners manage clinic services"
  on public.services for all
  using (clinic_id in (select id from public.clinics where owner_id = auth.uid()))
  with check (clinic_id in (select id from public.clinics where owner_id = auth.uid()));

create policy "owners manage clinic faqs"
  on public.faqs for all
  using (clinic_id in (select id from public.clinics where owner_id = auth.uid()))
  with check (clinic_id in (select id from public.clinics where owner_id = auth.uid()));

create policy "owners manage clinic leads"
  on public.leads for all
  using (clinic_id in (select id from public.clinics where owner_id = auth.uid()))
  with check (clinic_id in (select id from public.clinics where owner_id = auth.uid()));

create policy "owners read lead messages"
  on public.lead_messages for all
  using (
    lead_id in (
      select leads.id from public.leads
      join public.clinics on leads.clinic_id = clinics.id
      where clinics.owner_id = auth.uid()
    )
  );

create policy "owners manage review settings"
  on public.review_settings for all
  using (clinic_id in (select id from public.clinics where owner_id = auth.uid()))
  with check (clinic_id in (select id from public.clinics where owner_id = auth.uid()));

create policy "owners read subscriptions"
  on public.subscriptions for select
  using (clinic_id in (select id from public.clinics where owner_id = auth.uid()));

create or replace function public.handle_new_clinic_manager()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.clinics (owner_id, clinic_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'clinic_name', 'Untitled clinic')
  )
  on conflict (owner_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_clinic_manager();
