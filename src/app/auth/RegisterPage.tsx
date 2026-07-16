import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6, "Phone required"),
  dateOfBirth: z.string().min(1, "Date required"),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().trim().min(3, "Address required"),
  password: z.string().min(6, "At least 6 characters"),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", dateOfBirth: "", gender: "male", address: "", password: "", confirm: "" });
  const set = <K extends keyof typeof form>(k: K, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      const { needsEmailConfirmation } = await register({
        name: form.name, email: form.email, phone: form.phone, password: form.password,
        patientProfile: { gender: form.gender, dateOfBirth: form.dateOfBirth, address: form.address },
      });
      if (needsEmailConfirmation) {
        toast.success("Account created — check your email to confirm before signing in.");
        navigate("/login");
      } else {
        toast.success("Account created");
        navigate("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">M</div>
          <div className="text-lg font-semibold">MediCore</div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Create patient account</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in your details to book your first appointment.</p>

        <form onSubmit={submit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" className="sm:col-span-2"><input required value={form.name} onChange={e => set("name", e.target.value)} className={inputCls} /></Field>
          <Field label="Email"><input type="email" required value={form.email} onChange={e => set("email", e.target.value)} className={inputCls} /></Field>
          <Field label="Phone"><input required value={form.phone} onChange={e => set("phone", e.target.value)} className={inputCls} /></Field>
          <Field label="Date of Birth"><input type="date" required value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} className={inputCls} /></Field>
          <Field label="Gender">
            <select value={form.gender} onChange={e => set("gender", e.target.value)} className={inputCls}>
              <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </Field>
          <Field label="Address" className="sm:col-span-2"><input required value={form.address} onChange={e => set("address", e.target.value)} className={inputCls} /></Field>
          <Field label="Password"><input type="password" required value={form.password} onChange={e => set("password", e.target.value)} className={inputCls} /></Field>
          <Field label="Confirm Password"><input type="password" required value={form.confirm} onChange={e => set("confirm", e.target.value)} className={inputCls} /></Field>

          <button disabled={loading} className="sm:col-span-2 mt-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create account
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className ?? ""}`}><span className="text-sm font-medium">{label}</span><div className="mt-1.5">{children}</div></label>;
}
