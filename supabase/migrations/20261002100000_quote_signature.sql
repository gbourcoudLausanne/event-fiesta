-- Lien public de signature pour les devis — accessible sans compte via un
-- token non devinable (public_token), dans l'esprit "bon pour commande".

alter table public.quotes
  add column if not exists public_token text unique not null default replace(gen_random_uuid()::text, '-', ''),
  add column if not exists signature_data text,
  add column if not exists signed_by text,
  add column if not exists signed_at timestamptz;
