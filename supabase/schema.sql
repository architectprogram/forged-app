-- ============================================================
-- THE ARCHITECT 1% APP — SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor (project → SQL Editor → New query)
-- ============================================================

-- PROFILES
-- Auto-populated on signup via trigger below.
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  is_premium  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- GOALS
-- One active goal per user at a time.
create table if not exists goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  identity      text not null,
  goal_text     text not null,
  status        text not null default 'active' check (status in ('active', 'complete')),
  started_at    timestamptz not null default now(),
  completed_at  timestamptz
);

create index if not exists goals_user_id_status on goals(user_id, status);

-- COMPLETIONS
-- One row per day per goal. Binary. No re-logging (unique constraint).
create table if not exists completions (
  id          uuid primary key default gen_random_uuid(),
  goal_id     uuid not null references goals(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  day_number  integer not null check (day_number between 1 and 21),
  completed   boolean not null,
  logged_at   timestamptz not null default now(),
  unique (goal_id, day_number)
);

create index if not exists completions_goal_id on completions(goal_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles    enable row level security;
alter table goals       enable row level security;
alter table completions enable row level security;

create policy "own profile"    on profiles    for all using (auth.uid() = id);
create policy "own goals"      on goals       for all using (auth.uid() = user_id);
create policy "own completions" on completions for all using (auth.uid() = user_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
