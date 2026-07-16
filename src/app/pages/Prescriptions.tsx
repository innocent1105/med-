import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prescriptionsRepo, doctorsRepo, patientsRepo } from "../db/repo";
import type { Prescription } from "../db/types";
import { CrudTable, FormModal, inputCls, Field } from "../components/CrudTable";
import { formatDate } from "../lib/format";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import { notify } from "../hooks/useNotifications";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";

const empty: Prescription = { id: "", patientId: "", doctorId: "", date: new Date().toISOString().slice(0, 10), medicine: "", dosage: "", frequency: "", duration: "", instructions: "" };

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["prescriptions", "withNames"];
  const { data: rows = [] } = useQuery({ queryKey, queryFn: prescriptionsRepo.listWithNames, enabled: !!user });
  useRealtimeInvalidate(["prescriptions"], [queryKey]);
  const { data: patients = [] } = useQuery({ queryKey: ["patients"], queryFn: patientsRepo.list, enabled: !!user });
  const { data: doctors = [] } = useQuery({ queryKey: ["doctors"], queryFn: doctorsRepo.list, enabled: !!user });

  const [editing, setEditing] = useState<Prescription | null>(null);
  const [form, setForm] = useState<Prescription>(empty);

  const openNew = async () => {
    const doc = user?.role === "doctor" ? await doctorsRepo.byUserId(user.id) : undefined;
    setForm({ ...empty, id: crypto.randomUUID(), doctorId: doc?.id ?? "" });
    setEditing({ ...empty });
  };

  const saveMutation = useMutation({
    mutationFn: async (r: Prescription) => {
      const saved = editing?.id ? await prescriptionsRepo.update(r.id, r) : await prescriptionsRepo.create(r);
      const patient = await patientsRepo.get(r.patientId);
      if (patient?.userId) await notify(patient.userId, "New prescription", `${r.medicine} — ${r.dosage}`, "success");
      return saved;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); toast.success("Saved"); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => prescriptionsRepo.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const save = () => {
    if (!form.patientId || !form.doctorId || !form.medicine) { toast.error("Patient, doctor, medicine required"); return; }
    saveMutation.mutate(form);
  };

  return (
    <>
      <CrudTable
        title="Prescriptions" description="Medications prescribed to patients."
        data={rows}
        searchKeys={["medicine", "patientName", "doctorName"] as never}
        columns={[
          { key: "date", header: "Date", render: r => formatDate(r.date) },
          { key: "patient", header: "Patient", render: r => r.patientName },
          { key: "doctor", header: "Doctor", render: r => r.doctorName },
          { key: "medicine", header: "Medicine", render: r => <div><div className="font-medium">{r.medicine}</div><div className="text-xs text-muted-foreground">{r.dosage} · {r.frequency}</div></div> },
          { key: "duration", header: "Duration" },
        ]}
        onCreate={user?.role === "doctor" || user?.role === "admin" ? openNew : undefined}
        onEdit={user?.role === "doctor" || user?.role === "admin" ? (r) => { setForm(r); setEditing(r); } : undefined}
        onDelete={user?.role === "admin" ? async r => { await deleteMutation.mutateAsync(r.id); } : undefined}
      />
      {editing && (
        <FormModal title={editing.id ? "Edit prescription" : "New prescription"} onClose={() => setEditing(null)} onSubmit={save}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Patient">
              <select value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} className={inputCls}>
                <option value="">Select…</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </Field>
            <Field label="Doctor">
              <select value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} className={inputCls}>
                <option value="">Select…</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
            <Field label="Date"><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} /></Field>
            <Field label="Medicine"><input value={form.medicine} onChange={e => setForm(f => ({ ...f, medicine: e.target.value }))} className={inputCls} /></Field>
            <Field label="Dosage"><input value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} className={inputCls} /></Field>
            <Field label="Frequency"><input value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} className={inputCls} /></Field>
            <Field label="Duration"><input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className={inputCls} /></Field>
            <Field label="Instructions" span={2}><textarea rows={2} value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} className={inputCls} /></Field>
          </div>
        </FormModal>
      )}
    </>
  );
}
