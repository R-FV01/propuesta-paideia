create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_profiles where id = auth.uid() and role = 'admin') $$;

create table if not exists public.site_sections (
  key text primary key,
  draft_content jsonb not null default '{}'::jsonb,
  published_content jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  draft_content jsonb not null default '{}'::jsonb,
  published_content jsonb,
  featured boolean not null default false,
  sort_order integer not null default 100,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null unique,
  alt_text text not null check (char_length(alt_text) between 1 and 180),
  width integer not null check (width >= 0),
  height integer not null check (height >= 0),
  size_bytes bigint not null check (size_bytes >= 0 and size_bytes <= 10485760),
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  focal_x numeric(5,2) not null default 50 check (focal_x between 0 and 100),
  focal_y numeric(5,2) not null default 50 check (focal_y between 0 and 100),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists public.admission_requests (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null check (char_length(parent_name) between 2 and 160),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null check (char_length(phone) between 9 and 20),
  grade text not null check (char_length(grade) between 2 and 100),
  campus text not null check (char_length(campus) between 2 and 120),
  status text not null default 'not_contacted' check (status in ('not_contacted','to_contact','contacted','new_client','not_interested')),
  read_at timestamptz,
  notes text not null default '',
  follow_up_at timestamptz,
  last_contact_at timestamptz,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists admission_requests_created_at_idx on public.admission_requests (created_at desc);
create index if not exists admission_requests_status_idx on public.admission_requests (status);
create index if not exists admission_requests_unread_idx on public.admission_requests (read_at) where read_at is null;

create or replace function public.touch_cms_record()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end $$;

drop trigger if exists touch_site_sections on public.site_sections;
create trigger touch_site_sections before insert or update on public.site_sections for each row execute function public.touch_cms_record();
drop trigger if exists touch_news_posts on public.news_posts;
create trigger touch_news_posts before insert or update on public.news_posts for each row execute function public.touch_cms_record();
drop trigger if exists touch_admission_requests on public.admission_requests;
create trigger touch_admission_requests before update on public.admission_requests for each row execute function public.touch_cms_record();

alter table public.admin_profiles enable row level security;
alter table public.site_sections enable row level security;
alter table public.news_posts enable row level security;
alter table public.media_assets enable row level security;
alter table public.admission_requests enable row level security;

drop policy if exists "Admins read their profile" on public.admin_profiles;
create policy "Admins read their profile" on public.admin_profiles for select to authenticated using (id = auth.uid() and role = 'admin');
drop policy if exists "Admins manage sections" on public.site_sections;
create policy "Admins manage sections" on public.site_sections for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage news" on public.news_posts;
create policy "Admins manage news" on public.news_posts for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins manage media" on public.media_assets;
create policy "Admins manage media" on public.media_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Visitors submit admission requests" on public.admission_requests;
create policy "Visitors submit admission requests" on public.admission_requests for insert to anon, authenticated
  with check (status = 'not_contacted' and read_at is null and notes = '' and follow_up_at is null and last_contact_at is null);
drop policy if exists "Admins read admission requests" on public.admission_requests;
create policy "Admins read admission requests" on public.admission_requests for select to authenticated using (public.is_admin());
drop policy if exists "Admins update admission requests" on public.admission_requests;
create policy "Admins update admission requests" on public.admission_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete admission requests" on public.admission_requests;
create policy "Admins delete admission requests" on public.admission_requests for delete to authenticated using (public.is_admin());

revoke all on public.admin_profiles, public.site_sections, public.news_posts, public.media_assets from anon;
revoke all on public.admission_requests from anon, authenticated;
grant select on public.admin_profiles to authenticated;
grant select, insert, update, delete on public.site_sections, public.news_posts, public.media_assets to authenticated;
grant insert (parent_name, email, phone, grade, campus, source) on public.admission_requests to anon, authenticated;
grant select, update, delete on public.admission_requests to authenticated;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'admission_requests') then
    alter publication supabase_realtime add table public.admission_requests;
  end if;
end $$;

create or replace view public.public_site_sections as
select key, published_content as content, published_at, updated_at
from public.site_sections where published_content is not null;

create or replace view public.public_news_posts as
select id, slug, published_content as content, published_at, coalesce((published_content->>'sortOrder')::integer, sort_order) as sort_order
from public.news_posts where published_content is not null
order by coalesce((published_content->>'featured')::boolean, false) desc, coalesce((published_content->>'sortOrder')::integer, sort_order) asc, published_at desc;

revoke all on public.public_site_sections, public.public_news_posts from public;
grant select on public.public_site_sections, public.public_news_posts to anon, authenticated;

create or replace function public.publish_site_section(section_key text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  update public.site_sections set published_content = draft_content, status = 'published', published_at = now(), updated_by = auth.uid() where key = section_key;
  if not found then raise exception 'section not found'; end if;
end $$;

create or replace function public.publish_news_post(post_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  if coalesce((select (draft_content->>'featured')::boolean from public.news_posts where id = post_id), false) then
    update public.news_posts
      set published_content = jsonb_set(published_content, '{featured}', 'false'::jsonb, true), featured = false
      where id <> post_id and published_content is not null and coalesce((published_content->>'featured')::boolean, false);
  end if;
  update public.news_posts set published_content = draft_content, featured = coalesce((draft_content->>'featured')::boolean, false), sort_order = coalesce((draft_content->>'sortOrder')::integer, sort_order), status = 'published', published_at = now(), updated_by = auth.uid() where id = post_id;
  if not found then raise exception 'news post not found'; end if;
end $$;

create or replace function public.media_asset_in_use(asset_url text)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return exists(select 1 from public.site_sections where draft_content::text like '%' || asset_url || '%' or published_content::text like '%' || asset_url || '%')
    or exists(select 1 from public.news_posts where draft_content::text like '%' || asset_url || '%' or published_content::text like '%' || asset_url || '%');
end $$;

revoke all on function public.publish_site_section(text), public.publish_news_post(uuid), public.media_asset_in_use(text) from public;
grant execute on function public.publish_site_section(text), public.publish_news_post(uuid), public.media_asset_in_use(text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads site media" on storage.objects;
create policy "Public reads site media" on storage.objects for select to public using (bucket_id = 'site-media');
drop policy if exists "Admins upload site media" on storage.objects;
create policy "Admins upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "Admins update site media" on storage.objects;
create policy "Admins update site media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_admin()) with check (bucket_id = 'site-media' and public.is_admin());
drop policy if exists "Admins delete site media" on storage.objects;
create policy "Admins delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_admin());
