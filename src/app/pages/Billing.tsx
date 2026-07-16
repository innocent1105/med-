import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billsRepo, patientsRepo } from "../db/repo";
import type { Bill } from "../db/types";
import { CrudTable, FormModal, inputCls, Field } from "../components/CrudTable";
import { StatusBadge } from "../components/PageParts";
import { formatCurrency, formatDate, statusColor } from "../lib/format";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import { notify } from "../hooks/useNotifications";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";

const empty: Bill = { id: "", number: "", patientId: "", consultationFee: 0, labFee: 0, medicationFee: 0, otherCharges: 0, discount: 0, tax: 0, total: 0, status: "pending", date: new Date().toISOString().slice(0, 10), dueDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10) };

function computeTotal(b: Bill): number {
  const subtotal = b.consultationFee + b.labFee + b.medicationFee + b.otherCharges;
  const taxable = subtotal - b.discount;
  return Math.round((taxable + b.tax) * 100) / 100;
}

export default function BillingPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["bills", "withNames"];
  // RLS scopes rows to admin: all, patient: own.
  const { data: rows = [] } = useQuery({ queryKey, queryFn: billsRepo.listWithNames, enabled: !!user });
  useRealtimeInvalidate(["bills"], [queryKey]);
  const { data: patients = [] } = useQuery({ queryKey: ["patients"], queryFn: patientsRepo.list, enabled: user?.role === "admin" });

  const [editing, setEditing] = useState<Bill | null>(null);
  const [form, setForm] = useState<Bill>(empty);

  const openNew = async () => {
    const count = await billsRepo.count();
    setForm({ ...empty, id: crypto.randomUUID(), number: `INV-${String(count + 1).padStart(5, "0")}` });
    setEditing({ ...empty });
  };

  const saveMutation = useMutation({
    mutationFn: async (b: Bill) => {
      const withTotal = { ...b, total: computeTotal(b) };
      const saved = editing?.id ? await billsRepo.update(b.id, withTotal) : await billsRepo.create(withTotal);
      const patient = await patientsRepo.get(withTotal.patientId);
      if (patient?.userId && withTotal.status !== "paid") await notify(patient.userId, "Payment due", `${withTotal.number}: ${formatCurrency(withTotal.total)}`, "warning");
      return saved;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); toast.success("Saved"); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billsRepo.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const save = () => {
    if (!form.patientId) { toast.error("Patient required"); return; }
    saveMutation.mutate(form);
  };

  return (
    <>
      <CrudTable
        title="Billing" description="Invoices, payments, and outstanding balances."
        data={rows}
        searchKeys={["number", "patientName"] as never}
        filters={[{ key: "status", label: "Status", options: ["paid", "pending", "overdue"], get: r => r.status }]}
        columns={[
          { key: "number", header: "Invoice", render: r => <div><div className="font-medium">{r.number}</div><div className="text-xs text-muted-foreground">{formatDate(r.date)}</div></div> },
          { key: "patient", header: "Patient", render: r => r.patientName },
          { key: "total", header: "Total", render: r => <span className="font-medium">{formatCurrency(r.total)}</span>, accessor: r => r.total },
          { key: "dueDate", header: "Due", render: r => formatDate(r.dueDate) },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} className={statusColor(r.status)} /> },
        ]}
        onCreate={user?.role === "admin" ? openNew : undefined}
        onEdit={user?.role === "admin" ? (r) => { setForm(r); setEditing(r); } : undefined}
        onDelete={user?.role === "admin" ? async r => { await deleteMutation.mutateAsync(r.id); } : undefined}
      />
      {editing && (
        <FormModal title={editing.id ? "Edit invoice" : "New invoice"} onClose={() => setEditing(null)} onSubmit={save}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Invoice #"><input value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} className={inputCls} /></Field>
            <Field label="Patient">
              <select value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} className={inputCls}>
                <option value="">Select…</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </Field>
            <Field label="Consultation Fee"><input type="number" value={form.consultationFee} onChange={e => setForm(f => ({ ...f, consultationFee: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Lab Fee"><input type="number" value={form.labFee} onChange={e => setForm(f => ({ ...f, labFee: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Medication Fee"><input type="number" value={form.medicationFee} onChange={e => setForm(f => ({ ...f, medicationFee: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Other Charges"><input type="number" value={form.otherCharges} onChange={e => setForm(f => ({ ...f, otherCharges: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Discount"><input type="number" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Tax"><input type="number" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: Number(e.target.value) }))} className={inputCls} /></Field>
            <Field label="Date"><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} /></Field>
            <Field label="Due Date"><input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={inputCls} /></Field>
            <Field label="Status" span={2}>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Bill["status"] }))} className={inputCls}>
                <option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option>
              </select>
            </Field>
            <div className="sm:col-span-2 rounded-xl bg-muted/40 border border-border p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Computed total</span>
              <span className="text-lg font-semibold">{formatCurrency(computeTotal(form))}</span>
            </div>
          </div>
        </FormModal>
      )}
    </>
  );
}
