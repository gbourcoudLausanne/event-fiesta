-- Traduction du devis pour le client : le texte original (écrit par l'admin,
-- dans sa langue) n'est jamais modifié. Une traduction est générée à la demande
-- pour une langue cible et stockée séparément ; le lien client et le PDF
-- affichent la traduction quand elle existe, sinon le texte original.

alter table public.quotes
  add column if not exists client_language text
    check (client_language in ('fr', 'es', 'en')),
  add column if not exists translated_content jsonb;
