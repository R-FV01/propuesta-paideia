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

drop trigger if exists touch_admission_requests on public.admission_requests;
create trigger touch_admission_requests before update on public.admission_requests for each row execute function public.touch_cms_record();

alter table public.admission_requests enable row level security;

drop policy if exists "Visitors submit admission requests" on public.admission_requests;
create policy "Visitors submit admission requests" on public.admission_requests for insert to anon, authenticated
  with check (status = 'not_contacted' and read_at is null and notes = '' and follow_up_at is null and last_contact_at is null);
drop policy if exists "Admins read admission requests" on public.admission_requests;
create policy "Admins read admission requests" on public.admission_requests for select to authenticated using (public.is_admin());
drop policy if exists "Admins update admission requests" on public.admission_requests;
create policy "Admins update admission requests" on public.admission_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete admission requests" on public.admission_requests;
create policy "Admins delete admission requests" on public.admission_requests for delete to authenticated using (public.is_admin());

revoke all on public.admission_requests from anon, authenticated;
grant insert (parent_name, email, phone, grade, campus, source) on public.admission_requests to anon, authenticated;
grant select, update, delete on public.admission_requests to authenticated;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'admission_requests') then
    alter publication supabase_realtime add table public.admission_requests;
  end if;
end $$;
