-- Notifications push de l'admin : un abonnement par appareil (navigateur / app installée).

create table if not exists public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "authenticated full access" on public.push_subscriptions
  for all
  to authenticated
  using (true)
  with check (true);
