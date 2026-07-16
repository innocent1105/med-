import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth, getRememberedEmail } from "./AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(getRememberedEmail());
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(Boolean(getRememberedEmail()));
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, remember);
      toast.success("Welcome back");
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  };

  const fill = (e: string, p: string) => { setEmail(e); setPassword(p); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-info text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary-foreground text-primary grid place-items-center font-bold text-lg">M</div>
          <div className="text-xl font-semibold tracking-tight">MediCore</div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-4xl font-semibold tracking-tight leading-tight">A calmer workspace for modern clinics.</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-md">Appointments, medical records, prescriptions and billing — organised in one place, with a clean interface built for busy days.</p>
        </motion.div>
        <div className="text-sm text-primary-foreground/70">© {new Date().getFullYear()} MediCore</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">M</div>
            <div className="text-lg font-semibold">MediCore</div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Please enter your details.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="mt-1.5 w-full px-3 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1.5">
                <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-accent">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="h-4 w-4 rounded border-input" />
                <span>Remember me</span>
              </label>
              <button type="button" onClick={() => toast.info("Prototype: contact your admin to reset your password.")} className="text-primary hover:underline">Forgot password?</button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            New patient? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
          </div>

          <div className="mt-8 rounded-xl border border-border bg-muted/40 p-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Demo accounts</div>
            <div className="mt-3 grid gap-2 text-sm">
              {[
                { label: "Admin", e: "admin@clinic.com", p: "password123" },
                { label: "Doctor", e: "doctor@clinic.com", p: "password123" },
                { label: "Patient", e: "patient@clinic.com", p: "password123" },
              ].map(d => (
                <button key={d.e} type="button" onClick={() => fill(d.e, d.p)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left">
                  <div>
                    <div className="font-medium">{d.label}</div>
                    <div className="text-xs text-muted-foreground">{d.e}</div>
                  </div>
                  <div className="text-xs text-primary">Use →</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
