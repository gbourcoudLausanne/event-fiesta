-- Factures classiques reliées au reste : lien public (PDF pour le client)
-- et option pour déduire les paiements déjà reçus sur le devis lié.

alter table public.invoices
  add column if not exists public_token text unique not null default replace(gen_random_uuid()::text, '-', ''),
  add column if not exists deduct_payments boolean not null default true;
