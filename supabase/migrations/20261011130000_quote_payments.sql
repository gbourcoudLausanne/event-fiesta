-- Suivi des paiements d'un devis (acompte, solde…) : pas de facture formelle,
-- juste des étapes claires pour l'admin et le client, avec historique.

create table if not exists public.quote_payments (
  id         uuid primary key default gen_random_uuid(),
  quote_id   uuid not null references public.quotes(id) on delete cascade,
  position   int not null default 0,
  kind       text not null default 'autre' check (kind in ('acompte', 'solde', 'autre')),
  label      text,
  amount     numeric(10, 2) not null check (amount >= 0),
  due_label  text,
  status     text not null default 'a_payer' check (status in ('a_payer', 'paye')),
  paid_at    timestamptz,
  method     text check (method in ('twint', 'virement', 'especes', 'carte')),
  created_at timestamptz not null default now()
);

create index if not exists quote_payments_quote_id_idx on public.quote_payments (quote_id, position);

alter table public.quote_payments enable row level security;

create policy "authenticated full access" on public.quote_payments
  for all
  to authenticated
  using (true)
  with check (true);

-- Date du premier envoi au client (WhatsApp / e-mail), pour l'historique.
alter table public.quotes add column if not exists sent_at timestamptz;
