-- Origine du client — permet d'afficher "Nouvelle demande" dans le CRM
-- pour les clients créés automatiquement via le formulaire du site,
-- par opposition à ceux ajoutés manuellement par l'admin.

alter table public.clients
  add column if not exists source text not null default 'manuel'
  check (source in ('manuel', 'site_web'));
