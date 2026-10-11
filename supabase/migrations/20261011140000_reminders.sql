-- Relances automatiques (tâche quotidienne Vercel Cron) : chaque relance n'est
-- envoyée qu'une fois, on garde la date d'envoi. Interrupteur global dans Réglages.

alter table public.quotes
  add column if not exists reminder_sent_at timestamptz;

alter table public.quote_payments
  add column if not exists reminded_at timestamptz;

alter table public.settings
  add column if not exists auto_reminders boolean not null default true;
