import { supabase } from "../../lib/supabase";
import type {
  Appointment, AppointmentStatus, Bill, Doctor, MedicalRecord,
  Notification, Patient, Prescription, Profile, SettingRow,
} from "./types";

function assertNoError<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ---------------------------------------------------------------- profiles
export const profilesRepo = {
  async list(): Promise<Profile[]> {
    return assertNoError(await supabase.from("profiles").select("*").order("createdAt", { ascending: false }));
  },
  async get(id: string): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  async getByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").ilike("email", email).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  async update(id: string, patch: Partial<Profile>): Promise<Profile> {
    return assertNoError(await supabase.from("profiles").update(patch).eq("id", id).select().single());
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};

// ---------------------------------------------------------------- patients
export const patientsRepo = {
  async list(): Promise<Patient[]> {
    return assertNoError(await supabase.from("patients").select("*").order("createdAt", { ascending: false }));
  },
  async get(id: string): Promise<Patient | null> {
    const { data, error } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  async byUserId(userId: string): Promise<Patient | null> {
    const { data, error } = await supabase.from("patients").select("*").eq("userId", userId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  async create(patient: Patient): Promise<Patient> {
    return assertNoError(await supabase.from("patients").insert(patient).select().single());
  },
  async update(id: string, patch: Partial<Patient>): Promise<Patient> {
    return assertNoError(await supabase.from("patients").update(patch).eq("id", id).select().single());
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};

// ----------------------------------------------------------------- doctors
export const doctorsRepo = {
  async list(): Promise<Doctor[]> {
    return assertNoError(await supabase.from("doctors").select("*").order("createdAt", { ascending: false }));
  },
  async get(id: string): Promise<Doctor | null> {
    const { data, error } = await supabase.from("doctors").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  async byUserId(userId: string): Promise<Doctor | null> {
    const { data, error } = await supabase.from("doctors").select("*").eq("userId", userId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  async create(doctor: Doctor): Promise<Doctor> {
    return assertNoError(await supabase.from("doctors").insert(doctor).select().single());
  },
  async update(id: string, patch: Partial<Doctor>): Promise<Doctor> {
    return assertNoError(await supabase.from("doctors").update(patch).eq("id", id).select().single());
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};

// ------------------------------------------------------------ appointments
export const appointmentsRepo = {
  async list(): Promise<Appointment[]> {
    return assertNoError(await supabase.from("appointments").select("*").order("date", { ascending: false }));
  },
  async listByDoctor(doctorId: string): Promise<Appointment[]> {
    return assertNoError(await supabase.from("appointments").select("*").eq("doctorId", doctorId));
  },
  async listByPatient(patientId: string): Promise<Appointment[]> {
    return assertNoError(await supabase.from("appointments").select("*").eq("patientId", patientId));
  },
  async count(): Promise<number> {
    const { count, error } = await supabase.from("appointments").select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return count ?? 0;
  },
  async conflictCount(doctorId: string, date: string, time: string): Promise<number> {
    const { count, error } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctorId", doctorId).eq("date", date).eq("time", time)
      .not("status", "in", "(cancelled,rejected)");
    if (error) throw new Error(error.message);
    return count ?? 0;
  },
  async create(appt: Appointment): Promise<Appointment> {
    return assertNoError(await supabase.from("appointments").insert(appt).select().single());
  },
  async update(id: string, patch: Partial<Appointment>): Promise<Appointment> {
    return assertNoError(await supabase.from("appointments").update(patch).eq("id", id).select().single());
  },
  async setStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return this.update(id, { status });
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  /** Appointments with the patient/doctor names embedded via the FK relationship, so pages don't need a second round trip. */
  async listWithNames(): Promise<(Appointment & { patientName: string; doctorName: string })[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*, patient:patients(fullName), doctor:doctors(name)")
      .order("date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const { patient, doctor, ...rest } = row as Appointment & { patient: { fullName: string } | null; doctor: { name: string } | null };
      return { ...rest, patientName: patient?.fullName ?? "?", doctorName: doctor?.name ?? "?" };
    });
  },
};

// --------------------------------------------------------- medical records
export const medicalRecordsRepo = {
  async list(): Promise<MedicalRecord[]> {
    return assertNoError(await supabase.from("medicalRecords").select("*").order("date", { ascending: false }));
  },
  async create(record: MedicalRecord): Promise<MedicalRecord> {
    return assertNoError(await supabase.from("medicalRecords").insert(record).select().single());
  },
  async update(id: string, patch: Partial<MedicalRecord>): Promise<MedicalRecord> {
    return assertNoError(await supabase.from("medicalRecords").update(patch).eq("id", id).select().single());
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("medicalRecords").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listWithNames(): Promise<(MedicalRecord & { patientName: string; doctorName: string })[]> {
    const { data, error } = await supabase
      .from("medicalRecords")
      .select("*, patient:patients(fullName), doctor:doctors(name)")
      .order("date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const { patient, doctor, ...rest } = row as MedicalRecord & { patient: { fullName: string } | null; doctor: { name: string } | null };
      return { ...rest, patientName: patient?.fullName ?? "?", doctorName: doctor?.name ?? "?" };
    });
  },
};

// ---------------------------------------------------------- prescriptions
export const prescriptionsRepo = {
  async list(): Promise<Prescription[]> {
    return assertNoError(await supabase.from("prescriptions").select("*").order("date", { ascending: false }));
  },
  async create(rx: Prescription): Promise<Prescription> {
    return assertNoError(await supabase.from("prescriptions").insert(rx).select().single());
  },
  async update(id: string, patch: Partial<Prescription>): Promise<Prescription> {
    return assertNoError(await supabase.from("prescriptions").update(patch).eq("id", id).select().single());
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("prescriptions").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listWithNames(): Promise<(Prescription & { patientName: string; doctorName: string })[]> {
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*, patient:patients(fullName), doctor:doctors(name)")
      .order("date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const { patient, doctor, ...rest } = row as Prescription & { patient: { fullName: string } | null; doctor: { name: string } | null };
      return { ...rest, patientName: patient?.fullName ?? "?", doctorName: doctor?.name ?? "?" };
    });
  },
};

// ------------------------------------------------------------------ bills
export const billsRepo = {
  async list(): Promise<Bill[]> {
    return assertNoError(await supabase.from("bills").select("*").order("date", { ascending: false }));
  },
  async count(): Promise<number> {
    const { count, error } = await supabase.from("bills").select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return count ?? 0;
  },
  async create(bill: Bill): Promise<Bill> {
    return assertNoError(await supabase.from("bills").insert(bill).select().single());
  },
  async update(id: string, patch: Partial<Bill>): Promise<Bill> {
    return assertNoError(await supabase.from("bills").update(patch).eq("id", id).select().single());
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("bills").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async listWithNames(): Promise<(Bill & { patientName: string })[]> {
    const { data, error } = await supabase
      .from("bills")
      .select("*, patient:patients(fullName)")
      .order("date", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const { patient, ...rest } = row as Bill & { patient: { fullName: string } | null };
      return { ...rest, patientName: patient?.fullName ?? "?" };
    });
  },
};

// ----------------------------------------------------------- notifications
export const notificationsRepo = {
  async listByUser(userId: string): Promise<Notification[]> {
    return assertNoError(await supabase.from("notifications").select("*").eq("userId", userId).order("date", { ascending: false }));
  },
  async create(userId: string, title: string, message: string, type: Notification["type"] = "info"): Promise<Notification> {
    return assertNoError(await supabase.from("notifications").insert({ userId, title, message, read: false, type }).select().single());
  },
  async markRead(id: string): Promise<void> {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
    if (error) throw new Error(error.message);
  },
  async markAllRead(userId: string): Promise<void> {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("userId", userId).eq("read", false);
    if (error) throw new Error(error.message);
  },
};

// -------------------------------------------------------------- settings
export const settingsRepo = {
  async list(): Promise<SettingRow[]> {
    return assertNoError(await supabase.from("settings").select("*"));
  },
  async bulkPut(rows: SettingRow[]): Promise<void> {
    const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
  },
};
