import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import { profilesRepo, patientsRepo } from "../db/repo";
import type { Patient, Profile } from "../db/types";

const REMEMBER_KEY = "medicore.remember";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  patientProfile?: { gender?: string; dateOfBirth?: string; address?: string };
}

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<Profile>;
  logout: () => Promise<void>;
  register: (data: RegisterInput) => Promise<{ needsEmailConfirmation: boolean }>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthContextValue | null>(null);

// New patient sign-ups only get an auth session immediately if the Supabase
// project has email confirmation disabled; either way, the profile row is
// created by the on_auth_user_created trigger, but the linked `patients`
// row can only be created once we have an authenticated session (RLS
// requires auth.uid() = userId). So we create it lazily here, the first
// time we see an authenticated session for a patient without one yet,
// using the details that were stashed in the auth user's metadata at signup.
async function ensurePatientProfile(userId: string) {
  const existing = await patientsRepo.byUserId(userId);
  if (existing) return;
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return;
  const meta = authUser.user_metadata as Record<string, string | undefined>;
  await patientsRepo.create({
    id: crypto.randomUUID(),
    userId,
    fullName: meta.name ?? authUser.email ?? "New patient",
    gender: (meta.gender as Patient["gender"]) ?? "other",
    dateOfBirth: meta.dateOfBirth ?? "",
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    address: meta.address ?? "",
    email: authUser.email ?? "",
    phone: meta.phone ?? "",
    chronicDiseases: "",
    medicalNotes: "",
    insurance: "",
    createdAt: new Date().toISOString(),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    let profile = await profilesRepo.get(userId);
    if (!profile) {
      // Brief allowance for the on_auth_user_created trigger to finish.
      await new Promise((r) => setTimeout(r, 400));
      profile = await profilesRepo.get(userId);
    }
    if (profile?.role === "patient") await ensurePatientProfile(userId);
    return profile;
  }, []);

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setUser(null); setLoading(false); return; }
    const profile = await loadProfile(session.user.id);
    setUser(profile);
    setLoading(false);
  }, [loadProfile]);

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUser(null); return; }
      loadProfile(session.user.id).then(setUser);
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh, loadProfile]);

  const login: AuthContextValue["login"] = async (email, password, remember) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(error.message === "Invalid login credentials" ? "Invalid email or password" : error.message);
    const profile = await loadProfile(data.user.id);
    if (!profile) throw new Error("No profile found for this account");
    if (profile.status !== "active") { await supabase.auth.signOut(); throw new Error("Account is inactive"); }
    if (remember) localStorage.setItem(REMEMBER_KEY, email); else localStorage.removeItem(REMEMBER_KEY);
    setUser(profile);
    return profile;
  };

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  const register: AuthContextValue["register"] = async (data) => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email.trim(),
      password: data.password,
      options: { data: { name: data.name, role: "patient", phone: data.phone ?? "", ...data.patientProfile } },
    });
    if (error) throw new Error(error.message);
    if (signUpData.session) {
      const profile = await loadProfile(signUpData.session.user.id);
      setUser(profile);
      return { needsEmailConfirmation: false };
    }
    return { needsEmailConfirmation: true };
  };

  return (
    <Ctx.Provider value={{ user, loading, login, logout, register, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}

export function getRememberedEmail() { return localStorage.getItem(REMEMBER_KEY) ?? ""; }
