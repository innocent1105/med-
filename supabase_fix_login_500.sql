-- Fixes "500 Internal Server Error" on POST /auth/v1/token?grant_type=password
-- for the 3 demo accounts seeded by supabase_schema.sql.
--
-- Cause: GoTrue (Supabase Auth) scans several auth.users text columns as
-- non-nullable. The original seed script left them NULL (Postgres' default),
-- which is invisible in the dashboard but crashes GoTrue during password
-- login with a 500. This backfills them to '' for the demo accounts.

update auth.users set
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  reauthentication_token = coalesce(reauthentication_token, '')
where email in ('admin@clinic.com', 'doctor@clinic.com', 'patient@clinic.com');
