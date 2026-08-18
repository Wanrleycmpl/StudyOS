-- StudyOS initial schema
-- Execute this migration in Supabase SQL Editor or with the Supabase CLI.

do $$
begin
  create type public.study_session_type as enum ('teoria', 'revisao', 'questoes');
exception
  when duplicate_object then null;
end;
$$;

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null default '#2563eb',
  created_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  date date not null default current_date,
  duration_minutes integer not null check (duration_minutes > 0),
  type public.study_session_type not null,
  created_at timestamptz not null default now()
);

create table if not exists public.question_logs (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  date date not null default current_date,
  correct_count integer not null default 0 check (correct_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  bank text not null,
  created_at timestamptz not null default now(),
  check (correct_count + wrong_count > 0)
);

create index if not exists study_sessions_date_idx on public.study_sessions(date desc);
create index if not exists study_sessions_subject_id_idx on public.study_sessions(subject_id);
create index if not exists question_logs_date_idx on public.question_logs(date desc);
create index if not exists question_logs_subject_id_idx on public.question_logs(subject_id);

alter table public.subjects enable row level security;
alter table public.study_sessions enable row level security;
alter table public.question_logs enable row level security;

-- O StudyOS é de uso individual: todo usuário autenticado pode operar os registros.
-- Se o app passar a ter vários usuários, as tabelas deverão receber uma coluna user_id
-- e as políticas deverão comparar user_id com auth.uid().
drop policy if exists "Authenticated users manage subjects" on public.subjects;
create policy "Authenticated users manage subjects"
  on public.subjects for all to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated users manage study sessions" on public.study_sessions;
create policy "Authenticated users manage study sessions"
  on public.study_sessions for all to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated users manage question logs" on public.question_logs;
create policy "Authenticated users manage question logs"
  on public.question_logs for all to authenticated
  using (true) with check (true);

grant select, insert, update, delete on public.subjects to authenticated;
grant select, insert, update, delete on public.study_sessions to authenticated;
grant select, insert, update, delete on public.question_logs to authenticated;
