-- Ödül ve Sınav Takibi: tablolar ve erişim kuralları.
-- Veriyi yalnızca family_members tablosundaki hesaplar okuyup yazabilir.

create table public.family_members (
  user_id uuid primary key references auth.users on delete cascade
);
alter table public.family_members enable row level security;

create function public.is_family_member() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.family_members where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_family_member() from public, anon;
grant execute on function public.is_family_member() to authenticated;

create table public.days (
  date date primary key,
  homework boolean not null default false,
  reading boolean not null default false,
  prayers text[] not null default '{}'
);

create table public.exams (
  id uuid primary key,
  date date not null,
  kind text not null,
  name text not null,
  results jsonb not null
);

create table public.settings (
  id text primary key,
  value jsonb not null
);

do $$
declare
  family_table text;
begin
  foreach family_table in array array['days', 'exams', 'settings'] loop
    execute format('alter table public.%I enable row level security', family_table);
    execute format('grant select, insert, update, delete on public.%I to authenticated', family_table);
    execute format(
      'create policy family_only on public.%I for all to authenticated
         using (public.is_family_member()) with check (public.is_family_member())',
      family_table
    );
    execute format('alter publication supabase_realtime add table public.%I', family_table);
  end loop;
end $$;

-- Aile hesabı Authentication > Users bölümünden oluşturulduktan sonra üye yapılır:
--   insert into public.family_members (user_id) select id from auth.users where email = '<aile e-postası>';
