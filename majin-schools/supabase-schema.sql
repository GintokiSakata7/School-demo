-- Majin Schools: optional shared content + admissions backend.
-- Apply this in the Supabase SQL Editor, then follow README.md to add an admin profile.

create table if not exists public.site_content (
  slug text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_school_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create table if not exists public.admission_inquiries (
  id text primary key,
  parent_name text not null,
  email text not null,
  phone text not null,
  student_name text not null default '',
  current_grade text not null default '',
  applying_for text not null,
  message text not null default '',
  created_at timestamptz not null default now(),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Visit scheduled', 'Closed'))
);

alter table public.site_content enable row level security;
alter table public.profiles enable row level security;
alter table public.admission_inquiries enable row level security;

-- Website visitors can read school website content.
drop policy if exists "Public can read school website content" on public.site_content;
create policy "Public can read school website content"
on public.site_content for select
using (true);

-- Only users explicitly assigned an admin profile can change website content.
drop policy if exists "School admins can insert website content" on public.site_content;
create policy "School admins can insert website content"
on public.site_content for insert
with check (public.is_school_admin());

drop policy if exists "School admins can update website content" on public.site_content;
create policy "School admins can update website content"
on public.site_content for update
using (public.is_school_admin())
with check (public.is_school_admin());

drop policy if exists "School admins can delete website content" on public.site_content;
create policy "School admins can delete website content"
on public.site_content for delete
using (public.is_school_admin());

-- Public form submissions are allowed; reading and managing submissions is admin-only.
drop policy if exists "Visitors can submit an admissions enquiry" on public.admission_inquiries;
create policy "Visitors can submit an admissions enquiry"
on public.admission_inquiries for insert
with check (
  length(trim(parent_name)) > 0
  and length(trim(email)) > 3
  and length(trim(phone)) >= 7
  and length(trim(applying_for)) > 0
);

drop policy if exists "School admins can read admissions enquiries" on public.admission_inquiries;
create policy "School admins can read admissions enquiries"
on public.admission_inquiries for select
using (public.is_school_admin());

drop policy if exists "School admins can update admissions enquiries" on public.admission_inquiries;
create policy "School admins can update admissions enquiries"
on public.admission_inquiries for update
using (public.is_school_admin())
with check (public.is_school_admin());

drop policy if exists "School admins can delete admissions enquiries" on public.admission_inquiries;
create policy "School admins can delete admissions enquiries"
on public.admission_inquiries for delete
using (public.is_school_admin());

-- profiles intentionally has no public policies; manage the user's role from the SQL Editor.
