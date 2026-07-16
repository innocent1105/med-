import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// A second, non-persistent client for admin-initiated account creation
// (see Users page). Using the primary `supabase` client for `auth.signUp`
// while an admin is logged in would overwrite the admin's active session
// with the newly created user's session. This isolated client never
// touches localStorage or the shared in-memory session, so the admin
// stays signed in. It intentionally still only uses the public anon key —
// the service role key must never be shipped to the browser.
export const supabaseAuthOnly = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
