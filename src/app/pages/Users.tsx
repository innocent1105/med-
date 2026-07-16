import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAuthOnly } from "../../lib/supabase";
import { profilesRepo } from "../db/repo";
import type { Profile } from "../db/types";
import { CrudTable, FormModal, inputCls, Field } from "../components/CrudTable";
import { StatusBadge } from "../components/PageParts";
import { statusColor } from "../lib/format";
import { toast } from "sonner";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";

const empty: Profile & { password: string } = { id: "", name: "", email: "", password: "", role: "patient", status: "active", createdAt: "" };

export default function UsersPage() {
  const queryClient = useQueryClient();
  const queryKey = ["profiles"];
  const { data: users = [] } = useQuery({ queryKey, queryFn: profilesRepo.list });
  useRealtimeInvalidate(["profiles"], [queryKey]);

  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile & { password: string }>(empty);

  const openNew = () => { setForm({ ...empty, id: "", createdAt: new Date().toISOString() }); setEditing({ ...empty }); };
  const openEdit = (u: Profile) => { setForm({ ...u, password: "" }); setEditing(u); };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing?.id) {
        return profilesRepo.update(editing.id, {
          name: form.name, email: form.email, phone: form.phone, department: form.department,
          role: form.role, status: form.status,
        });
      }
      // Creating a brand-new login account requires supabase.auth.signUp, which
      // (on the primary client) would replace the admin's own session with the
      // new user's. `supabaseAuthOnly` is an isolated, non-persistent client
      // used only for this, so the admin stays signed in.
      const { data, error } = await supabaseAuthOnly.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: { data: { name: form.name, role: form.role, phone: form.phone ?? "" } },
      });
      if (error) throw new Error(error.message);
      await supabaseAuthOnly.auth.signOut();
      if (!data.user) throw new Error("Account creation failed");
      // The on_auth_user_created trigger creates the profile row; give it a
      // moment, then fill in the fields metadata doesn't carry (department/status).
      await new Promise((r) => setTimeout(r, 500));
      return profilesRepo.update(data.user.id, { department: form.department, status: form.status });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey }); toast.success("Saved"); setEditing(null); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => profilesRepo.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const save = () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    if (!editing?.id && form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    saveMutation.mutate();
  };

  return (
    <>
      <CrudTable<Profile>
        title="Users" description="Manage all user accounts and roles."
        data={users}
        searchKeys={["name", "email", "phone", "department"]}
        filters={[
          { key: "role", label: "Role", options: ["admin", "doctor", "patient"], get: r => r.role },
          { key: "status", label: "Status", options: ["active", "inactive"], get: r => r.status },
        ]}
        columns={[
          { key: "name", header: "Name", render: r => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
          { key: "role", header: "Role", render: r => <span className="capitalize">{r.role}</span> },
          { key: "phone", header: "Phone" },
          { key: "department", header: "Department" },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} className={statusColor(r.status)} /> },
        ]}
        onCreate={openNew}
        onEdit={openEdit}
        onDelete={async r => { await deleteMutation.mutateAsync(r.id); }}
      />
      {editing && (
        <FormModal title={editing.id ? "Edit user" : "New user"} onClose={() => setEditing(null)} onSubmit={save}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name" span={2}><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} /></Field>
            <Field label="Email"><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!!editing.id} className={inputCls} /></Field>
            {!editing.id && (
              <Field label="Password"><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={inputCls} /></Field>
            )}
            <Field label="Phone"><input value={form.phone ?? ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} /></Field>
            <Field label="Department"><input value={form.department ?? ""} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} className={inputCls} /></Field>
            <Field label="Role">
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Profile["role"] }))} className={inputCls}>
                <option value="admin">Admin</option><option value="doctor">Doctor</option><option value="patient">Patient</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Profile["status"] }))} className={inputCls}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </Field>
            {!editing.id && (
              <p className="sm:col-span-2 text-xs text-muted-foreground">
                Depending on the project's auth settings, the new user may need to confirm their email before they can sign in.
              </p>
            )}
          </div>
        </FormModal>
      )}
    </>
  );
}
