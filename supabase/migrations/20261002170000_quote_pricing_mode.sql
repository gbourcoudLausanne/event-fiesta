-- Mode d'affichage du devis : détaillé (prix par ligne, comme avant) ou
-- forfait global (services + descriptions sans prix par ligne, un seul
-- prix total pour l'ensemble).

alter table public.quotes
  add column if not exists pricing_mode text not null default 'detaille'
    check (pricing_mode in ('detaille', 'forfait')),
  add column if not exists package_total numeric;
