import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepo } from "../db/repo";
import type { Patient } from "../db/types";
import { CrudTable, FormModal, inputCls, Field } from "../components/CrudTable";
import { formatDate } from "../lib/format";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";

const empty: Patient = { id: "", fullName: "", gender: "male", dateOfBirth: "", bloodGroup: "", allergies: "", emergencyContact: "", address: "", email: "", phone: "", chronicDiseases: "", medicalNotes: "", insurance: "", createdAt: "" };

export default function PatientsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["patients"];
  // RLS already scopes this to "all patients" for admin, "my assigned patients"
  // for doctors, and "myself" for patients — no client-side filtering needed.
  const { data: patients = [] } = useQuery({ queryKey, queryFn: patientsRepo.list, enabled: !!user });
  useRealtimeInvalidate(["patients", "appointments"], [queryKey]);

  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState<Patient>(empty);

  const openNew = () => { setForm({ ...empty, id: crypto.randomUUID(), createdAt: new Date().toISOString() }); setEditing({ ...empty }); };
  const openEdit = (p: Patient) => { setForm(p); setEditing(p); };
  const close = () => setEditing(null);

  const saveMutation = useMutation({
    mutationFn: (p: Patient) => (editing?.id ? patientsRepo.update(p.id, p) : patientsRepo.create(p)),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); toast.success("Saved"); close(); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => patientsRepo.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const save = () => {
    if (!form.fullName || !form.email) { toast.error("Name and email required"); return; }
    saveMutation.mutate(form);
  };

  return (
    <>
      <CrudTable<Patient>
        title="Patients" description="Full patient roster with medical information."
        data={patients}
        searchKeys={["fullName", "email", "phone", "bloodGroup"]}
        filters={[
          { key: "gender", label: "Gender", options: ["male", "female", "other"], get: r => r.gender },
          { key: "blood", label: "Blood", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], get: r => r.bloodGroup },
        ]}
        columns={[
          { key: "fullName", header: "Name", render: r => <div><div className="font-medium">{r.fullName}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
          { key: "gender", header: "Gender", render: r => <span className="capitalize">{r.gender}</span> },
          { key: "dob", header: "DOB", render: r => formatDate(r.dateOfBirth) },
          { key: "blood", header: "Blood", render: r => r.bloodGroup, accessor: r => r.bloodGroup },
          { key: "phone", header: "Phone" },
        ]}
        onCreate={user?.role === "admin" ? openNew : undefined}
        onEdit={user?.role === "admin" || user?.role === "doctor" ? openEdit : undefined}
        onDelete={user?.role === "admin" ? async (r) => { await deleteMutation.mutateAsync(r.id); } : undefined}
      />
      {editing && (
        <FormModal title={editing.id ? "Edit patient" : "New patient"} onClose={close} onSubmit={save}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full Name" span={2}><input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className={inputCls} /></Field>
            <Field label="Email"><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} /></Field>
            <Field label="Phone"><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} /></Field>
            <Field label="Gender">
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as Patient["gender"] }))} className={inputCls}>
                <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
            </Field>
            <Field label="Date of Birth"><input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} className={inputCls} /></Field>
            <Field label="Blood Group">
              <select value={form.bloodGroup} onChange={e => setForm(f => ({ ...f, bloodGroup: e.target.value }))} className={inputCls}>
                <option value="">Select…</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Emergency Contact"><input value={form.emergencyContact} onChange={e => setForm(f => ({ ...f, emergencyContact: e.target.value }))} className={inputCls} /></Field>
            <Field label="Address" span={2}><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputCls} /></Field>
            <Field label="Allergies"><input value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} className={inputCls} /></Field>
            <Field label="Chronic Diseases"><input value={form.chronicDiseases} onChange={e => setForm(f => ({ ...f, chronicDiseases: e.target.value }))} className={inputCls} /></Field>
            <Field label="Insurance" span={2}><input value={form.insurance} onChange={e => setForm(f => ({ ...f, insurance: e.target.value }))} className={inputCls} /></Field>
            <Field label="Medical Notes" span={2}><textarea rows={3} value={form.medicalNotes} onChange={e => setForm(f => ({ ...f, medicalNotes: e.target.value }))} className={inputCls} /></Field>
          </div>
        </FormModal>
      )}
    </>
  );
}
