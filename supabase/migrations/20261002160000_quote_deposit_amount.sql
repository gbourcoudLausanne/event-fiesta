-- Permet de fixer l'acompte en CHF directement, en plus du pourcentage —
-- l'admin choisit dans l'éditeur lequel des deux s'applique.

alter table public.quotes
  add column if not exists deposit_amount numeric;
