-- Conditions de paiement par devis — acompte, échéance du solde et
-- moyens de paiement proposés au client (choisis par l'admin dans l'éditeur).

alter table public.quotes
  add column if not exists deposit_percent numeric,
  add column if not exists balance_due_terms text,
  add column if not exists payment_methods text[] not null default '{}';

-- Coordonnées affichées pour le paiement par Twint (virement/IBAN déjà
-- couverts par les colonnes creditor_* existantes).
alter table public.settings
  add column if not exists twint_phone text;
