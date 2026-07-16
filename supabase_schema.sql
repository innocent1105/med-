-- ============================================================================
-- MediCore Clinic — Supabase schema
-- ============================================================================
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- It is safe to re-run: every statement is idempotent (drop-if-exists / IF NOT
-- EXISTS / CREATE OR REPLACE).
--
-- What this sets up:
--   1. profiles table, kept in sync with auth.users via a trigger
--   2. patients / doctors / appointments / medicalRecords / prescriptions /
--      notifications / bills / settings tables
--   3. Row Level Security policies mirroring the app's role model
--      (admin / doctor / patient)
--   4. Three demo accounts (admin@clinic.com / doctor@clinic.com /
--      patient@clinic.com, all with the password "password123") plus a
--      handful of sample rows so the app isn't empty on first load
--
-- Note on column names: columns are double-quoted camelCase (e.g. "fullName")
-- to match the TypeScript types used by the frontend exactly, so no mapping
-- layer is needed between the client and Postgres.
-- ============================================================================

-- ============================================================================
-- 0. RESET — wipes every table, function, trigger and the 3 demo auth
-- accounts this script owns, so the rest of the file always runs against a
-- clean slate.
--
-- ⚠ DESTRUCTIVE: this deletes ALL clinic data (every patient, doctor,
-- appointment, etc.), not just the demo rows. Comment out this whole
-- section if you have real data you want to keep and only want to apply
-- schema changes.
-- ============================================================================

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.notifications cascade;
drop table if exists public.bills cascade;
drop table if exists public.prescriptions cascade;
drop table if exists public."medicalRecords" cascade;
drop table if exists public.appointments cascade;
drop table if exists public.doctors cascade;
drop table if exists public.patients cascade;
drop table if exists public.settings cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.current_role() cascade;
drop function if exists public.current_patient_id() cascade;
drop function if exists public.current_doctor_id() cascade;

delete from auth.identities where user_id in (
  select id from auth.users where email in ('admin@clinic.com', 'doctor@clinic.com', 'patient@clinic.com')
);
delete from auth.users where email in ('admin@clinic.com', 'doctor@clinic.com', 'patient@clinic.com');

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. profiles  (1:1 with auth.users)
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  role text not null default 'patient' check (role in ('admin', 'doctor', 'patient')),
  phone text,
  department text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  "createdAt" timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper function used by RLS policies below. security definer + a fixed
-- search_path lets this bypass RLS internally (avoiding recursive policy
-- checks) while still only ever returning data scoped to the caller.
-- (current_patient_id() and current_doctor_id() are defined further down,
-- once the patients/doctors tables they query actually exist — `language
-- sql` functions are validated against the catalog at creation time.)
create or replace function public.current_role()
returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role, phone, status, "createdAt")
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'patient'),
    new.raw_user_meta_data ->> 'phone',
    'active',
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 2. patients
-- ============================================================================

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid references public.profiles (id) on delete set null,
  "fullName" text not null,
  gender text not null default 'other' check (gender in ('male', 'female', 'other')),
  "dateOfBirth" date,
  "bloodGroup" text,
  allergies text default '',
  "emergencyContact" text default '',
  address text default '',
  email text,
  phone text,
  "chronicDiseases" text default '',
  "medicalNotes" text default '',
  insurance text default '',
  "createdAt" timestamptz not null default now()
);

alter table public.patients enable row level security;

-- ============================================================================
-- 3. doctors
-- ============================================================================

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid references public.profiles (id) on delete set null,
  name text not null,
  specialty text default '',
  qualification text default '',
  experience int default 0,
  email text,
  phone text,
  availability text default 'Mon-Fri 9:00-17:00',
  "consultationFee" numeric(10, 2) default 0,
  department text default '',
  status text not null default 'active' check (status in ('active', 'inactive')),
  "createdAt" timestamptz not null default now()
);

alter table public.doctors enable row level security;

-- ============================================================================
-- 4. appointments
-- ============================================================================

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  "patientId" uuid not null references public.patients (id) on delete cascade,
  "doctorId" uuid not null references public.doctors (id) on delete cascade,
  date date not null,
  time text not null,
  department text default '',
  reason text default '',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'completed', 'cancelled', 'rejected', 'rescheduled')),
  "createdAt" timestamptz not null default now()
);

alter table public.appointments enable row level security;
create index if not exists appointments_patient_idx on public.appointments ("patientId");
create index if not exists appointments_doctor_idx on public.appointments ("doctorId");

-- ============================================================================
-- 5. medicalRecords
-- ============================================================================

create table if not exists public."medicalRecords" (
  id uuid primary key default gen_random_uuid(),
  "patientId" uuid not null references public.patients (id) on delete cascade,
  "doctorId" uuid not null references public.doctors (id) on delete cascade,
  "appointmentId" uuid references public.appointments (id) on delete set null,
  date date not null default current_date,
  diagnosis text default '',
  symptoms text default '',
  "bloodPressure" text default '',
  temperature text default '',
  weight text default '',
  height text default '',
  notes text default '',
  "labRequests" text default ''
);

alter table public."medicalRecords" enable row level security;
create index if not exists medical_records_patient_idx on public."medicalRecords" ("patientId");
create index if not exists medical_records_doctor_idx on public."medicalRecords" ("doctorId");

-- ============================================================================
-- 6. prescriptions
-- ============================================================================

create table if not exists public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  "patientId" uuid not null references public.patients (id) on delete cascade,
  "doctorId" uuid not null references public.doctors (id) on delete cascade,
  "appointmentId" uuid references public.appointments (id) on delete set null,
  date date not null default current_date,
  medicine text not null,
  dosage text default '',
  frequency text default '',
  duration text default '',
  instructions text default ''
);

alter table public.prescriptions enable row level security;
create index if not exists prescriptions_patient_idx on public.prescriptions ("patientId");
create index if not exists prescriptions_doctor_idx on public.prescriptions ("doctorId");

-- ============================================================================
-- 7. notifications
-- ============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  message text default '',
  read boolean not null default false,
  date timestamptz not null default now(),
  type text not null default 'info' check (type in ('info', 'success', 'warning', 'error'))
);

alter table public.notifications enable row level security;
create index if not exists notifications_user_idx on public.notifications ("userId");

-- ============================================================================
-- 8. bills
-- ============================================================================

create table if not exists public.bills (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  "patientId" uuid not null references public.patients (id) on delete cascade,
  "appointmentId" uuid references public.appointments (id) on delete set null,
  "consultationFee" numeric(10, 2) default 0,
  "labFee" numeric(10, 2) default 0,
  "medicationFee" numeric(10, 2) default 0,
  "otherCharges" numeric(10, 2) default 0,
  discount numeric(10, 2) default 0,
  tax numeric(10, 2) default 0,
  total numeric(10, 2) default 0,
  status text not null default 'pending' check (status in ('paid', 'pending', 'overdue')),
  date date not null default current_date,
  "dueDate" date
);

alter table public.bills enable row level security;
create index if not exists bills_patient_idx on public.bills ("patientId");

-- ============================================================================
-- 9. settings (single row per key, clinic-wide)
-- ============================================================================

create table if not exists public.settings (
  key text primary key,
  value jsonb
);

alter table public.settings enable row level security;

-- ============================================================================
-- More helper functions (defined here because they query tables that only
-- exist as of this point in the script — see the note next to current_role())
-- ============================================================================

create or replace function public.current_patient_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.patients where "userId" = auth.uid()
$$;

create or replace function public.current_doctor_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.doctors where "userId" = auth.uid()
$$;

-- ============================================================================
-- Row Level Security policies
-- ============================================================================

-- profiles ---------------------------------------------------------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (auth.uid() is not null);

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles for insert
  with check (public.current_role() = 'admin');

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update
  using (id = auth.uid() or public.current_role() = 'admin');

drop policy if exists "profiles_delete_admin" on public.profiles;
create policy "profiles_delete_admin" on public.profiles for delete
  using (public.current_role() = 'admin');

-- patients -----------------------------------------------------------------
drop policy if exists "patients_select" on public.patients;
create policy "patients_select" on public.patients for select
  using (
    public.current_role() = 'admin'
    or "userId" = auth.uid()
    or (public.current_role() = 'doctor' and exists (
      select 1 from public.appointments a
      where a."patientId" = patients.id and a."doctorId" = public.current_doctor_id()
    ))
  );

drop policy if exists "patients_insert" on public.patients;
create policy "patients_insert" on public.patients for insert
  with check (public.current_role() = 'admin' or "userId" = auth.uid());

drop policy if exists "patients_update" on public.patients;
create policy "patients_update" on public.patients for update
  using (public.current_role() in ('admin', 'doctor') or "userId" = auth.uid());

drop policy if exists "patients_delete_admin" on public.patients;
create policy "patients_delete_admin" on public.patients for delete
  using (public.current_role() = 'admin');

-- doctors --------------------------------------------------------------------
drop policy if exists "doctors_select_all" on public.doctors;
create policy "doctors_select_all" on public.doctors for select
  using (auth.uid() is not null);

drop policy if exists "doctors_write_admin" on public.doctors;
create policy "doctors_write_admin" on public.doctors for insert
  with check (public.current_role() = 'admin');
drop policy if exists "doctors_update_admin" on public.doctors;
create policy "doctors_update_admin" on public.doctors for update
  using (public.current_role() = 'admin');
drop policy if exists "doctors_delete_admin" on public.doctors;
create policy "doctors_delete_admin" on public.doctors for delete
  using (public.current_role() = 'admin');

-- appointments -----------------------------------------------------------
drop policy if exists "appointments_select" on public.appointments;
create policy "appointments_select" on public.appointments for select
  using (
    public.current_role() = 'admin'
    or "doctorId" = public.current_doctor_id()
    or "patientId" = public.current_patient_id()
  );

drop policy if exists "appointments_insert" on public.appointments;
create policy "appointments_insert" on public.appointments for insert
  with check (
    public.current_role() = 'admin'
    or "patientId" = public.current_patient_id()
  );

drop policy if exists "appointments_update" on public.appointments;
create policy "appointments_update" on public.appointments for update
  using (
    public.current_role() = 'admin'
    or "doctorId" = public.current_doctor_id()
    or "patientId" = public.current_patient_id()
  );

drop policy if exists "appointments_delete_admin" on public.appointments;
create policy "appointments_delete_admin" on public.appointments for delete
  using (public.current_role() = 'admin');

-- medicalRecords -----------------------------------------------------------
drop policy if exists "records_select" on public."medicalRecords";
create policy "records_select" on public."medicalRecords" for select
  using (
    public.current_role() = 'admin'
    or "doctorId" = public.current_doctor_id()
    or "patientId" = public.current_patient_id()
  );

drop policy if exists "records_insert" on public."medicalRecords";
create policy "records_insert" on public."medicalRecords" for insert
  with check (public.current_role() in ('admin', 'doctor'));

drop policy if exists "records_update" on public."medicalRecords";
create policy "records_update" on public."medicalRecords" for update
  using (public.current_role() in ('admin', 'doctor'));

drop policy if exists "records_delete_admin" on public."medicalRecords";
create policy "records_delete_admin" on public."medicalRecords" for delete
  using (public.current_role() = 'admin');

-- prescriptions --------------------------------------------------------------
drop policy if exists "prescriptions_select" on public.prescriptions;
create policy "prescriptions_select" on public.prescriptions for select
  using (
    public.current_role() = 'admin'
    or "doctorId" = public.current_doctor_id()
    or "patientId" = public.current_patient_id()
  );

drop policy if exists "prescriptions_insert" on public.prescriptions;
create policy "prescriptions_insert" on public.prescriptions for insert
  with check (public.current_role() in ('admin', 'doctor'));

drop policy if exists "prescriptions_update" on public.prescriptions;
create policy "prescriptions_update" on public.prescriptions for update
  using (public.current_role() in ('admin', 'doctor'));

drop policy if exists "prescriptions_delete_admin" on public.prescriptions;
create policy "prescriptions_delete_admin" on public.prescriptions for delete
  using (public.current_role() = 'admin');

-- notifications ------------------------------------------------------------
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications for select
  using ("userId" = auth.uid() or public.current_role() = 'admin');

drop policy if exists "notifications_insert_any" on public.notifications;
create policy "notifications_insert_any" on public.notifications for insert
  with check (auth.uid() is not null);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications for update
  using ("userId" = auth.uid() or public.current_role() = 'admin');

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own" on public.notifications for delete
  using ("userId" = auth.uid() or public.current_role() = 'admin');

-- bills ------------------------------------------------------------------
drop policy if exists "bills_select" on public.bills;
create policy "bills_select" on public.bills for select
  using (public.current_role() = 'admin' or "patientId" = public.current_patient_id());

drop policy if exists "bills_write_admin" on public.bills;
create policy "bills_write_admin" on public.bills for insert
  with check (public.current_role() = 'admin');
drop policy if exists "bills_update_admin" on public.bills;
create policy "bills_update_admin" on public.bills for update
  using (public.current_role() = 'admin');
drop policy if exists "bills_delete_admin" on public.bills;
create policy "bills_delete_admin" on public.bills for delete
  using (public.current_role() = 'admin');

-- settings -----------------------------------------------------------------
drop policy if exists "settings_select_all" on public.settings;
create policy "settings_select_all" on public.settings for select
  using (auth.uid() is not null);

drop policy if exists "settings_write_admin" on public.settings;
create policy "settings_write_admin" on public.settings for insert
  with check (public.current_role() = 'admin');
drop policy if exists "settings_update_admin" on public.settings;
create policy "settings_update_admin" on public.settings for update
  using (public.current_role() = 'admin');
drop policy if exists "settings_delete_admin" on public.settings;
create policy "settings_delete_admin" on public.settings for delete
  using (public.current_role() = 'admin');

-- ============================================================================
-- Realtime (so the app's live-query hooks receive change events)
-- ============================================================================

alter publication supabase_realtime add table
  public.patients, public.doctors, public.appointments, public."medicalRecords",
  public.prescriptions, public.notifications, public.bills, public.settings, public.profiles;

-- ============================================================================
-- Seed data — 3 demo accounts + a few sample records
-- ============================================================================
-- Demo login credentials (password is the same for all three):
--   admin@clinic.com   / password123
--   doctor@clinic.com  / password123
--   patient@clinic.com / password123
--
-- Inserting directly into auth.users is a Supabase-specific trick for demo
-- seeding only — real signups must always go through supabase.auth.signUp().

do $$
declare
  admin_id uuid := gen_random_uuid();
  doctor_id uuid := gen_random_uuid();
  patient_id uuid := gen_random_uuid();
  doctor_row_id uuid := gen_random_uuid();
  patient_row_id uuid := gen_random_uuid();
  appt_id uuid := gen_random_uuid();
begin
  if not exists (select 1 from auth.users where email = 'admin@clinic.com') then
    -- Every *_token / *_change column is set to '' rather than left NULL.
    -- GoTrue (Supabase Auth) scans these as non-nullable strings; a NULL
    -- here is invisible in the dashboard but crashes password login with a
    -- 500 Internal Server Error.
    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change, email_change_token_new,
      email_change_token_current, phone_change, phone_change_token, reauthentication_token
    ) values
    (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'admin@clinic.com', crypt('password123', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{"name":"Admin User","role":"admin"}', now(), now(),
      '', '', '', '', '', '', '', ''),
    (doctor_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'doctor@clinic.com', crypt('password123', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{"name":"Dr. Sarah Chen","role":"doctor"}', now(), now(),
      '', '', '', '', '', '', '', ''),
    (patient_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
      'patient@clinic.com', crypt('password123', gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{"name":"John Patient","role":"patient"}', now(), now(),
      '', '', '', '', '', '', '', '');

    -- Matching identities rows (required for email/password sign-in on newer Supabase versions)
    insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values
      (gen_random_uuid(), admin_id, admin_id::text, jsonb_build_object('sub', admin_id::text, 'email', 'admin@clinic.com'), 'email', now(), now(), now()),
      (gen_random_uuid(), doctor_id, doctor_id::text, jsonb_build_object('sub', doctor_id::text, 'email', 'doctor@clinic.com'), 'email', now(), now(), now()),
      (gen_random_uuid(), patient_id, patient_id::text, jsonb_build_object('sub', patient_id::text, 'email', 'patient@clinic.com'), 'email', now(), now(), now());

    -- profiles are normally created by the on_auth_user_created trigger, but
    -- update department/status here since metadata only carries name+role
    update public.profiles set department = 'Administration' where id = admin_id;
    update public.profiles set department = 'Cardiology' where id = doctor_id;

    insert into public.doctors (id, "userId", name, specialty, qualification, experience, email, phone, "consultationFee", department, status)
    values (doctor_row_id, doctor_id, 'Dr. Sarah Chen', 'Cardiology', 'MD, FACC', 12, 'doctor@clinic.com', '555-0102', 150, 'Cardiology', 'active');

    insert into public.patients (id, "userId", "fullName", gender, "dateOfBirth", "bloodGroup", allergies, "emergencyContact", address, email, phone, "chronicDiseases", "medicalNotes", insurance)
    values (patient_row_id, patient_id, 'John Patient', 'male', '1990-05-14', 'O+', 'Penicillin', '555-0199', '123 Main St', 'patient@clinic.com', '555-0103', 'None', 'Generally healthy.', 'BlueCare #12345');

    insert into public.appointments (id, number, "patientId", "doctorId", date, time, department, reason, status)
    values (appt_id, 'APT-00001', patient_row_id, doctor_row_id, current_date + 3, '10:00', 'Cardiology', 'Consultation', 'approved');

    insert into public."medicalRecords" ("patientId", "doctorId", "appointmentId", date, diagnosis, symptoms, "bloodPressure", temperature, weight, height, notes, "labRequests")
    values (patient_row_id, doctor_row_id, appt_id, current_date - 30, 'Hypertension', 'Occasional headaches', '128/82', '36.7 °C', '78 kg', '178 cm', 'Advised low-sodium diet and follow-up in 3 months.', 'Lipid panel');

    insert into public.prescriptions ("patientId", "doctorId", "appointmentId", date, medicine, dosage, frequency, duration, instructions)
    values (patient_row_id, doctor_row_id, appt_id, current_date - 30, 'Lisinopril', '10mg', 'Once daily', '30 days', 'Take with food');

    insert into public.bills (number, "patientId", "appointmentId", "consultationFee", "labFee", "medicationFee", "otherCharges", discount, tax, total, status, date, "dueDate")
    values ('INV-00001', patient_row_id, appt_id, 150, 50, 15, 0, 0, 16.4, 231.4, 'pending', current_date - 30, current_date - 15);

    insert into public.notifications ("userId", title, message, read, type)
    values (patient_id, 'Appointment approved', 'Your appointment APT-00001 was approved.', false, 'success');

    insert into public.settings (key, value) values
      ('clinicName', '"MediCore Clinic"'),
      ('currency', '"USD"'),
      ('businessHours', '"Mon-Fri 9:00-18:00"'),
      ('language', '"en"')
    on conflict (key) do nothing;
  end if;
end $$;
