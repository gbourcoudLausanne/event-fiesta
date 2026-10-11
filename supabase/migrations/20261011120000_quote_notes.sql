-- Section "Conditions et observations" du devis, au choix de l'admin :
-- show_notes = afficher ou non la section (lien client + PDF) ;
-- notes_text = texte personnalisé (null = texte standard, traduit automatiquement FR/ES/EN).

alter table public.quotes
  add column if not exists show_notes boolean not null default true,
  add column if not exists notes_text text;
