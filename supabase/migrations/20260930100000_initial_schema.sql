-- Schéma initial Event Fiesta — mono-admin (pas de multi-tenant, pas de rôles).
-- Accès restreint : uniquement l'utilisateur authentifié (Gilbert), jamais anon.

create extension if not exists "pgcrypto";

-- ─── Clients ────────────────────────────────────────────────────────────────

create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  full_name  text not null,
  email      text,
  phone      text,
  address    text,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "authenticated full access" on public.clients
  for all
  to authenticated
  using (true)
  with check (true);

-- ─── Devis ──────────────────────────────────────────────────────────────────

create table public.quotes (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid references public.clients(id) on delete set null,
  reference  text not null unique,
  title      text,
  event_type text,
  event_date date,
  venue      text,
  items      jsonb not null default '[]'::jsonb,
  tax_rate   numeric not null default 0,
  status     text not null default 'brouillon'
             check (status in ('brouillon', 'envoye', 'accepte', 'refuse')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes enable row level security;

create policy "authenticated full access" on public.quotes
  for all
  to authenticated
  using (true)
  with check (true);

-- ─── Factures ───────────────────────────────────────────────────────────────

create table public.invoices (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid references public.clients(id) on delete set null,
  quote_id     uuid references public.quotes(id) on delete set null,
  reference    text not null unique,
  items        jsonb not null default '[]'::jsonb,
  tax_rate     numeric not null default 0,
  status       text not null default 'en_attente'
               check (status in ('en_attente', 'payee', 'annulee')),
  qr_reference text,
  due_date     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "authenticated full access" on public.invoices
  for all
  to authenticated
  using (true)
  with check (true);

-- ─── Réglages (ligne unique) — coordonnées bancaires pour la QR-facture ────

create table public.settings (
  id               boolean primary key default true check (id),
  creditor_name    text,
  creditor_address text,
  creditor_zip     text,
  creditor_city    text,
  iban             text
);

insert into public.settings (id) values (true);

alter table public.settings enable row level security;

create policy "authenticated full access" on public.settings
  for all
  to authenticated
  using (true)
  with check (true);
