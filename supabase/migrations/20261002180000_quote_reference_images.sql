-- Images de référence (ex: visuels générés avec ChatGPT) attachées à un devis,
-- affichées uniquement sur la page client — jamais sur le PDF.

alter table public.quotes
  add column if not exists reference_images text[] not null default '{}';

insert into storage.buckets (id, name, public)
values ('quote-images', 'quote-images', true)
on conflict (id) do nothing;

create policy "authenticated manage quote images"
on storage.objects for all
to authenticated
using (bucket_id = 'quote-images')
with check (bucket_id = 'quote-images');
