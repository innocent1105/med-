import { useState, useMemo, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsRepo, doctorsRepo, patientsRepo } from "../db/repo";
import type { Appointment, AppointmentStatus } from "../db/types";
import { useAuth } from "../auth/AuthContext";
import { PageHeader, Section, StatusBadge, EmptyState } from "../components/PageParts";
import { statusColor, formatDate, downloadCsv } from "../lib/format";
import { Plus, Search, Check, X, Calendar as CalIcon, Download, RefreshCw } from "lucide-react";
import { notify } from "../hooks/useNotifications";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";
import { toast } from "sonner";
import { z } from "zod";

const nextStatusActions = (status: AppointmentStatus): AppointmentStatus[] => {
  switch (status) {
    case "pending": return ["approved", "rejected", "rescheduled"];
    case "approved": return ["completed", "cancelled", "rescheduled"];
    case "rescheduled": return ["approved", "cancelled"];
    default: return [];
  }
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["appointments", "withNames"];
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [openBook, setOpenBook] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);

  // RLS scopes this to admin: all, doctor: own, patient: own.
  const { data: rows = [] } = useQuery({ queryKey, queryFn: appointmentsRepo.listWithNames, enabled: !!user });
  useRealtimeInvalidate(["appointments"], [queryKey]);

  const filtered = useMemo(() => {
    return rows.filter(a => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (dateFilter && a.date !== dateFilter) return false;
      if (q) {
        const s = q.toLowerCase();
        return a.number.toLowerCase().includes(s) || a.patientName.toLowerCase().includes(s) || a.doctorName.toLowerCase().includes(s) || a.department.toLowerCase().includes(s);
      }
      return true;
    }).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }, [rows, q, statusFilter, dateFilter]);

  const statusMutation = useMutation({
    mutationFn: async ({ a, next }: { a: Appointment; next: AppointmentStatus }) => {
      await appointmentsRepo.setStatus(a.id, next);
      const patient = await patientsRepo.get(a.patientId);
      if (patient?.userId) await notify(patient.userId, `Appointment ${next}`, `Your appointment ${a.number} was ${next}.`, next === "approved" || next === "completed" ? "success" : "info");
    },
    onSuccess: (_d, { next }) => { queryClient.invalidateQueries({ queryKey }); toast.success(`Appointment ${next}`); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const doAction = (a: Appointment, next: AppointmentStatus) => {
    if (next === "rescheduled") { setRescheduleTarget(a); return; }
    statusMutation.mutate({ a, next });
  };

  const exportCsv = () => downloadCsv(filtered.map(a => ({
    number: a.number, patient: a.patientName, doctor: a.doctorName, date: a.date, time: a.time, department: a.department, reason: a.reason, status: a.status,
  })), `appointments-${Date.now()}.csv`);

  return (
    <>
      <PageHeader title="Appointments" description="Track and manage all clinic visits."
        actions={
          <>
            <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm"><Download className="h-4 w-4" />Export</button>
            {(user?.role === "patient" || user?.role === "admin") && (
              <button onClick={() => setOpenBook(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-95"><Plus className="h-4 w-4" />Book appointment</button>
            )}
          </>
        }
      />

      <Section>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search appointments…" className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-input bg-background text-sm">
            <option value="all">All statuses</option>
            {["pending", "approved", "completed", "cancelled", "rejected", "rescheduled"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-input bg-background text-sm" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No appointments" description="Try changing filters or book a new appointment." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 px-3 font-medium">Number</th>
                  <th className="py-2 px-3 font-medium">Patient</th>
                  <th className="py-2 px-3 font-medium">Doctor</th>
                  <th className="py-2 px-3 font-medium">Date & Time</th>
                  <th className="py-2 px-3 font-medium">Dept.</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="py-2 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="py-2.5 px-3 font-medium">{a.number}</td>
                    <td className="py-2.5 px-3">{a.patientName}</td>
                    <td className="py-2.5 px-3">{a.doctorName}</td>
                    <td className="py-2.5 px-3">{formatDate(a.date)} · {a.time}</td>
                    <td className="py-2.5 px-3">{a.department}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={a.status} className={statusColor(a.status)} /></td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {user && (user.role === "admin" || user.role === "doctor") && nextStatusActions(a.status).map(n => (
                          <button key={n} onClick={() => doAction(a, n)} className="p-1.5 rounded-lg hover:bg-accent text-xs capitalize" title={n}>
                            {n === "approved" ? <Check className="h-3.5 w-3.5 text-success" /> : n === "rejected" || n === "cancelled" ? <X className="h-3.5 w-3.5 text-destructive" /> : n === "rescheduled" ? <RefreshCw className="h-3.5 w-3.5 text-info" /> : <CalIcon className="h-3.5 w-3.5 text-primary" />}
                          </button>
                        ))}
                        {user?.role === "patient" && a.status === "pending" && (
                          <button onClick={() => doAction(a, "cancelled")} className="px-2 py-1 rounded-lg hover:bg-accent text-xs">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {openBook && <BookDialog onClose={() => setOpenBook(false)} />}
      {rescheduleTarget && <RescheduleDialog appt={rescheduleTarget} onClose={() => setRescheduleTarget(null)} />}
    </>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const bookSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  reason: z.string().min(1),
});

function BookDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: doctors = [] } = useQuery({ queryKey: ["doctors"], queryFn: doctorsRepo.list });
  const { data: patients = [] } = useQuery({ queryKey: ["patients"], queryFn: patientsRepo.list, enabled: user?.role !== "patient" });
  const { data: myPatient } = useQuery({
    queryKey: ["patients", "byUserId", user?.id],
    queryFn: () => patientsRepo.byUserId(user!.id),
    enabled: user?.role === "patient",
  });

  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", time: "", reason: "" });
  const patientId = user?.role === "patient" ? myPatient?.id ?? "" : form.patientId;

  const bookMutation = useMutation({
    mutationFn: async () => {
      const parsed = bookSchema.safeParse({ ...form, patientId });
      if (!parsed.success) throw new Error("Fill all fields");
      const conflicts = await appointmentsRepo.conflictCount(form.doctorId, form.date, form.time);
      if (conflicts > 0) throw new Error("Doctor already booked at this time");
      const doctor = doctors.find(d => d.id === form.doctorId);
      const count = await appointmentsRepo.count();
      const appt: Appointment = {
        id: crypto.randomUUID(),
        number: `APT-${String(count + 1).padStart(5, "0")}`,
        patientId, doctorId: form.doctorId, date: form.date, time: form.time,
        department: doctor?.department ?? "General", reason: form.reason,
        status: "pending", createdAt: new Date().toISOString(),
      };
      await appointmentsRepo.create(appt);
      if (doctor?.userId) await notify(doctor.userId, "New appointment request", `${appt.number} on ${appt.date} at ${appt.time}`, "info");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment booked");
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Booking failed"),
  });

  return (
    <Modal title="Book appointment" onClose={onClose}>
      <div className="space-y-3">
        {user?.role !== "patient" && (
          <div>
            <label className="text-sm font-medium">Patient</label>
            <select value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} className={inp}>
              <option value="">Select patient…</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Doctor</label>
          <select value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} className={inp}>
            <option value="">Select doctor…</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-medium">Date</label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inp} /></div>
          <div><label className="text-sm font-medium">Time</label><input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className={inp} /></div>
        </div>
        <div>
          <label className="text-sm font-medium">Reason</label>
          <input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className={inp} placeholder="e.g. Consultation" />
        </div>
        <button onClick={() => bookMutation.mutate()} disabled={bookMutation.isPending} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60">Confirm booking</button>
      </div>
    </Modal>
  );
}

function RescheduleDialog({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(appt.time);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await appointmentsRepo.update(appt.id, { date, time, status: "rescheduled" });
      const patient = await patientsRepo.get(appt.patientId);
      if (patient?.userId) await notify(patient.userId, "Appointment rescheduled", `${appt.number} moved to ${date} at ${time}`, "info");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Rescheduled");
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Reschedule failed"),
  });

  return (
    <Modal title="Reschedule appointment" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-sm font-medium">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inp} /></div>
          <div><label className="text-sm font-medium">Time</label><input type="time" value={time} onChange={e => setTime(e.target.value)} className={inp} /></div>
        </div>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60">Save changes</button>
      </div>
    </Modal>
  );
}

const inp = "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
