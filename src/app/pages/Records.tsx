import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicalRecordsRepo, doctorsRepo, patientsRepo } from "../db/repo";
import type { MedicalRecord } from "../db/types";
import { CrudTable, FormModal, inputCls, Field } from "../components/CrudTable";
import { formatDate } from "../lib/format";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import { notify } from "../hooks/useNotifications";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";

const empty: MedicalRecord = { id: "", patientId: "", doctorId: "", date: new Date().toISOString().slice(0, 10), diagnosis: "", symptoms: "", bloodPressure: "", temperature: "", weight: "", height: "", notes: "", labRequests: "" };

export default function RecordsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["medicalRecords", "withNames"];
  // RLS scopes rows to admin: all, doctor: own, patient: own.
  const { data: records = [] } = useQuery({ queryKey, queryFn: medicalRecordsRepo.listWithNames, enabled: !!user });
  useRealtimeInvalidate(["medicalRecords"], [queryKey]);
  const { data: patients = [] } = useQuery({ queryKey: ["patients"], queryFn: patientsRepo.list, enabled: !!user });
  const { data: doctors = [] } = useQuery({ queryKey: ["doctors"], queryFn: doctorsRepo.list, enabled: !!user });

  const [editing, setEditing] = useState<MedicalRecord | null>(null);
  const [form, setForm] = useState<MedicalRecord>(empty);

  const openNew = async () => {
    const doc = user?.role === "doctor" ? await doctorsRepo.byUserId(user.id) : undefined;
    setForm({ ...empty, id: crypto.randomUUID(), doctorId: doc?.id ?? "" });
    setEditing({ ...empty });
  };

  const saveMutation = useMutation({
    mutationFn: async (r: MedicalRecord) => {
      const saved = editing?.id ? await medicalRecordsRepo.update(r.id, r) : await medicalRecordsRepo.create(r);
      const patient = await patientsRepo.get(r.patientId);
      if (patient?.userId) await notify(patient.userId, "Medical record updated", `New entry: ${r.diagnosis}`, "info");
      return saved;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); toast.success("Saved"); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => medicalRecordsRepo.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const save = () => {
    if (!form.patientId || !form.doctorId || !form.diagnosis) { toast.error("Patient, doctor, and diagnosis required"); return; }
    saveMutation.mutate(form);
  };

  return (
    <>
      <CrudTable
        title="Medical Records" description="Diagnoses, vitals, and clinical notes."
        data={records}
        searchKeys={["diagnosis", "symptoms", "patientName", "doctorName"] as never}
        columns={[
          { key: "date", header: "Date", render: r => formatDate(r.date) },
          { key: "patient", header: "Patient", render: r => r.patientName },
          { key: "doctor", header: "Doctor", render: r => r.doctorName },
          { key: "diagnosis", header: "Diagnosis" },
          { key: "vitals", header: "Vitals", render: r => <span className="text-xs text-muted-foreground">BP {r.bloodPressure} · {r.temperature}</span> },
        ]}
        onCreate={user?.role === "doctor" || user?.role === "admin" ? openNew : undefined}
        onEdit={user?.role === "doctor" || user?.role === "admin" ? (r) => { setForm(r); setEditing(r); } : undefined}
        onDelete={user?.role === "admin" ? async r => { await deleteMutation.mutateAsync(r.id); } : undefined}
      />
      {editing && (
        <FormModal title={editing.id ? "Edit medical record" : "New medical record"} onClose={() => setEditing(null)} onSubmit={save}>
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
            <Field label="Diagnosis"><input value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))} className={inputCls} /></Field>
            <Field label="Symptoms" span={2}><textarea rows={2} value={form.symptoms} onChange={e => setForm(f => ({ ...f, symptoms: e.target.value }))} className={inputCls} /></Field>
            <Field label="Blood Pressure"><input value={form.bloodPressure} onChange={e => setForm(f => ({ ...f, bloodPressure: e.target.value }))} className={inputCls} /></Field>
            <Field label="Temperature"><input value={form.temperature} onChange={e => setForm(f => ({ ...f, temperature: e.target.value }))} className={inputCls} /></Field>
            <Field label="Weight"><input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} className={inputCls} /></Field>
            <Field label="Height"><input value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} className={inputCls} /></Field>
            <Field label="Lab Requests" span={2}><input value={form.labRequests} onChange={e => setForm(f => ({ ...f, labRequests: e.target.value }))} className={inputCls} /></Field>
            <Field label="Notes" span={2}><textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} /></Field>
          </div>
        </FormModal>
      )}
    </>
  );
}
