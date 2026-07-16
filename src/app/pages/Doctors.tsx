import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorsRepo } from "../db/repo";
import type { Doctor } from "../db/types";
import { CrudTable, FormModal, inputCls, Field } from "../components/CrudTable";
import { StatusBadge } from "../components/PageParts";
import { statusColor, formatCurrency } from "../lib/format";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";

const empty: Doctor = { id: "", name: "", specialty: "", qualification: "", experience: 0, email: "", phone: "", availability: "Mon-Fri 9:00-17:00", consultationFee: 100, department: "General", status: "active", createdAt: "" };

export default function DoctorsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["doctors"];
  const { data: doctors = [] } = useQuery({ queryKey, queryFn: doctorsRepo.list, enabled: !!user });
  useRealtimeInvalidate(["doctors"], [queryKey]);

  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<Doctor>(empty);

  const openNew = () => { setForm({ ...empty, id: crypto.randomUUID(), createdAt: new Date().toISOString() }); setEditing({ ...empty }); };
  const openEdit = (d: Doctor) => { setForm(d); setEditing(d); };

  const saveMutation = useMutation({
    mutationFn: (d: Doctor) => (editing?.id ? doctorsRepo.update(d.id, d) : doctorsRepo.create(d)),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); toast.success("Saved"); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => doctorsRepo.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const save = () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    saveMutation.mutate(form);
  };

  return (
    <>
      <CrudTable<Doctor>
        title="Doctors" description="Manage doctor profiles and availability."
        data={doctors}
        searchKeys={["name", "email", "specialty", "department"]}
        filters={[
          { key: "specialty", label: "Specialty", options: Array.from(new Set(doctors.map(d => d.specialty))).filter(Boolean), get: r => r.specialty },
          { key: "status", label: "Status", options: ["active", "inactive"], get: r => r.status },
        ]}
        columns={[
          { key: "name", header: "Doctor", render: r => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
          { key: "specialty", header: "Specialty" },
          { key: "qualification", header: "Qualification" },
          { key: "experience", header: "Exp.", render: r => `${r.experience} yrs`, accessor: r => r.experience },
          { key: "fee", header: "Fee", render: r => formatCurrency(r.consultationFee), accessor: r => r.consultationFee },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} className={statusColor(r.status)} /> },
        ]}
        onCreate={user?.role === "admin" ? openNew : undefined}
        onEdit={user?.role === "admin" ? openEdit : undefined}
        onDelete={user?.role === "admin" ? async r => { await deleteMutation.mutateAsync(r.id); } : undefined}
      />
      {editing && (
        <FormModal title={editing.id ? "Edit doctor" : "New doctor"} onClose={() => setEditing(null)} onSubmit={save}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name" span={2}><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} /></Field>
            <Field label="Email"><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} /></Field>
            <Field label="Phone"><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} /></Field>
            <Field label="Specialty"><input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} className={inputCls} /></Field>
            <Field label="Qualification"><input value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} className={inputCls} /></Field>
            <Field label="Experience (years)"><input type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Consultation Fee"><input type="number" value={form.consultationFee} onChange={e => setForm(f => ({ ...f, consultationFee: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Department"><input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className={inputCls} /></Field>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Doctor["status"] }))} className={inputCls}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </Field>
            <Field label="Availability" span={2}><input value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} className={inputCls} /></Field>
          </div>
        </FormModal>
      )}
    </>
  );
}
