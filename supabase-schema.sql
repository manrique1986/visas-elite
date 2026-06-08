-- =============================================
-- VISAS ELITE — Esquema de Base de Datos
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- 1. Perfiles de usuarios
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'employee' check (role in ('admin', 'employee')),
  created_at timestamptz default now()
);

-- 2. Casos de visa
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  family_name text not null,
  status text not null default 'en_proceso' check (status in ('en_proceso', 'aprobada', 'negada')),
  created_by uuid references profiles(id) on delete set null,
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Detalles del caso (vuelos, hotel, citas)
create table if not exists case_details (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade not null,
  son_name text,
  father_name text,
  cas_appointment timestamptz,
  consular_appointment timestamptz,
  -- Vuelo llegada
  arrival_flight_code text,
  arrival_origin text,
  arrival_departure_time text,
  arrival_destination text,
  arrival_arrival_time text,
  arrival_date date,
  -- Vuelo salida
  departure_flight_code text,
  departure_origin text,
  departure_departure_time text,
  departure_destination text,
  departure_arrival_time text,
  departure_date date,
  -- Hotel
  hotel_name text,
  hotel_address text,
  checkin_date date,
  checkout_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Sesiones de entrenamiento
create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade not null,
  session_date date not null,
  created_at timestamptz default now()
);

-- 5. Notas del caso
create table if not exists case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete set null not null,
  content text not null,
  created_at timestamptz default now()
);

-- 6. Reuniones de onboarding
create table if not exists onboarding_meetings (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id) on delete cascade not null,
  scheduled_at timestamptz not null,
  meet_url text,
  google_event_id text,
  created_by uuid references profiles(id) on delete set null,
  notified boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

alter table profiles enable row level security;
alter table cases enable row level security;
alter table case_details enable row level security;
alter table training_sessions enable row level security;
alter table case_notes enable row level security;
alter table onboarding_meetings enable row level security;

-- Profiles: cada uno ve el suyo, admin ve todos
create policy "profiles_select" on profiles for select
  using (auth.uid() = id or exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  ));

create policy "profiles_insert" on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update" on profiles for update
  using (auth.uid() = id);

-- Cases: empleado ve los suyos, admin ve todos
create policy "cases_select" on cases for select
  using (
    created_by = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "cases_insert" on cases for insert
  with check (auth.uid() is not null);

create policy "cases_update" on cases for update
  using (
    created_by = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Case details, trainings, notes: heredan acceso del caso
create policy "case_details_all" on case_details for all
  using (exists (
    select 1 from cases where cases.id = case_details.case_id and (
      cases.created_by = auth.uid() or
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    )
  ));

create policy "training_sessions_all" on training_sessions for all
  using (exists (
    select 1 from cases where cases.id = training_sessions.case_id and (
      cases.created_by = auth.uid() or
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    )
  ));

create policy "case_notes_all" on case_notes for all
  using (exists (
    select 1 from cases where cases.id = case_notes.case_id and (
      cases.created_by = auth.uid() or
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    )
  ));

create policy "onboarding_meetings_all" on onboarding_meetings for all
  using (auth.uid() is not null);

-- =============================================
-- TRIGGER: actualizar updated_at en cases
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger cases_updated_at
  before update on cases
  for each row execute function update_updated_at();

-- =============================================
-- PARA HACER A CATALINA ADMIN:
-- (reemplazar con el email real)
-- =============================================
-- update profiles set role = 'admin' where email = 'catalina@visaselite.com';
