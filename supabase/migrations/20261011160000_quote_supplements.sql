-- Ajouts après signature (le client demande quelque chose en plus) :
-- lignes ajoutées au devis lui-même, jamais effacées (removed_at pour un retrait),
-- confirmées par le client d'un clic. Format :
-- [{ id, description, amount, added_at, accepted_at, removed_at, payment_id, payment_mode }]

alter table public.quotes
  add column if not exists supplements jsonb not null default '[]'::jsonb;
