import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { PageHeader, Section, StatCard, StatusBadge } from "../components/PageParts";
import { Users, Stethoscope, Calendar, CheckCircle2, Clock, DollarSign, AlertCircle, Pill, FileText, Receipt } from "lucide-react";
import { formatCurrency, formatDate, statusColor } from "../lib/format";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";
import { patientsRepo, doctorsRepo, appointmentsRepo, billsRepo, prescriptionsRepo, medicalRecordsRepo } from "../db/repo";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";

export default function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "doctor") return <DoctorDashboard />;
  return <PatientDashboard />;
}

function AdminDashboard() {
  const queryKey = ["dashboard", "admin"];
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const [patients, doctors, appts, bills] = await Promise.all([
        patientsRepo.list(), doctorsRepo.list(), appointmentsRepo.list(), billsRepo.list(),
      ]);
      const today = new Date().toISOString().slice(0, 10);
      const todays = appts.filter(a => a.date === today).length;
      const upcoming = appts.filter(a => a.date > today && (a.status === "approved" || a.status === "pending")).length;
      const completed = appts.filter(a => a.status === "completed").length;
      const revenue = bills.filter(b => b.status === "paid").reduce((s, b) => s + b.total, 0);
      const pending = bills.filter(b => b.status !== "paid").reduce((s, b) => s + b.total, 0);
      const monthly: Record<string, number> = {};
      appts.forEach(a => { const k = a.date.slice(0, 7); monthly[k] = (monthly[k] ?? 0) + 1; });
      const monthlyArr = Object.entries(monthly).sort().slice(-6).map(([k, v]) => ({ month: k, count: v }));
      const revenueByMonth: Record<string, number> = {};
      bills.filter(b => b.status === "paid").forEach(b => { const k = b.date.slice(0, 7); revenueByMonth[k] = (revenueByMonth[k] ?? 0) + b.total; });
      const revenueArr = Object.entries(revenueByMonth).sort().slice(-6).map(([k, v]) => ({ month: k, revenue: Math.round(v) }));
      const statusCounts: Record<string, number> = {};
      appts.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1; });
      const statusArr = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
      const recent = appts.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
      return { patients: patients.length, doctors: doctors.length, todays, upcoming, completed, revenue, pending, monthlyArr, revenueArr, statusArr, recent };
    },
  });
  useRealtimeInvalidate(["appointments", "bills", "patients", "doctors"], [queryKey]);

  if (!data) return null;
  const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

  return (
    <>
      <PageHeader title="Admin overview" description="Clinic health at a glance." />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={data.patients} icon={Users} tone="primary" index={0} />
        <StatCard label="Total Doctors" value={data.doctors} icon={Stethoscope} tone="info" index={1} />
        <StatCard label="Today's Appointments" value={data.todays} icon={Calendar} tone="success" index={2} />
        <StatCard label="Upcoming" value={data.upcoming} icon={Clock} tone="warning" index={3} />
        <StatCard label="Completed" value={data.completed} icon={CheckCircle2} tone="success" index={4} />
        <StatCard label="Revenue" value={formatCurrency(data.revenue)} icon={DollarSign} tone="primary" index={5} />
        <StatCard label="Pending Payments" value={formatCurrency(data.pending)} icon={AlertCircle} tone="destructive" index={6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Section title="Monthly appointments" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data.monthlyArr}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="count" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Appointment status">
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.statusArr} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40}>
                  {data.statusArr.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.statusArr.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i % colors.length] }} />
                <span className="capitalize">{s.name}</span>
                <span className="text-muted-foreground">({s.value})</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Section title="Revenue trend" className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={data.revenueArr}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Recent appointments" action={<Link to="/appointments" className="text-sm text-primary hover:underline">View all</Link>}>
          <div className="space-y-3">
            {data.recent.map(a => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{a.number}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(a.date)} · {a.department}</div>
                </div>
                <StatusBadge status={a.status} className={statusColor(a.status)} />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

function DoctorDashboard() {
  const { user } = useAuth();
  const queryKey = ["dashboard", "doctor", user?.id];
  const { data } = useQuery({
    queryKey,
    enabled: !!user,
    queryFn: async () => {
      const doctor = await doctorsRepo.byUserId(user!.id);
      if (!doctor) return { doctor: null, today: 0, upcoming: [], completed: 0, prescriptions: 0, patients: [] };
      // RLS already scopes appointments/prescriptions/patients to this doctor's own.
      const [appts, prescriptions, patients] = await Promise.all([
        appointmentsRepo.list(), prescriptionsRepo.list(), patientsRepo.list(),
      ]);
      const today = new Date().toISOString().slice(0, 10);
      const todays = appts.filter(a => a.date === today).length;
      const upcoming = appts.filter(a => a.date >= today && (a.status === "approved" || a.status === "pending")).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
      const completed = appts.filter(a => a.status === "completed").length;
      return { doctor, today: todays, upcoming, completed, prescriptions: prescriptions.length, patients: patients.slice(0, 6) };
    },
  });
  useRealtimeInvalidate(["appointments", "prescriptions", "patients"], [queryKey]);

  if (!data) return null;
  return (
    <>
      <PageHeader title={`Welcome, ${user?.name}`} description={data.doctor ? `${data.doctor.specialty} · ${data.doctor.department}` : ""} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Today's Patients" value={data.today} icon={Calendar} tone="primary" index={0} />
        <StatCard label="Upcoming" value={data.upcoming.length} icon={Clock} tone="info" index={1} />
        <StatCard label="Completed" value={data.completed} icon={CheckCircle2} tone="success" index={2} />
        <StatCard label="Prescriptions" value={data.prescriptions} icon={Pill} tone="warning" index={3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Section title="Upcoming appointments" action={<Link to="/appointments" className="text-sm text-primary hover:underline">All</Link>}>
          <div className="divide-y divide-border">
            {data.upcoming.map(a => (
              <div key={a.id} className="py-3 flex items-center justify-between text-sm">
                <div><div className="font-medium">{a.number}</div><div className="text-xs text-muted-foreground">{formatDate(a.date)} at {a.time}</div></div>
                <StatusBadge status={a.status} className={statusColor(a.status)} />
              </div>
            ))}
            {data.upcoming.length === 0 && <div className="py-6 text-sm text-muted-foreground text-center">No upcoming visits.</div>}
          </div>
        </Section>
        <Section title="Recent patients" action={<Link to="/patients" className="text-sm text-primary hover:underline">All</Link>}>
          <div className="divide-y divide-border">
            {data.patients.map(p => (
              <div key={p.id} className="py-3 flex items-center justify-between text-sm">
                <div><div className="font-medium">{p.fullName}</div><div className="text-xs text-muted-foreground">{p.gender} · {p.bloodGroup}</div></div>
                <span className="text-xs text-muted-foreground">{p.phone}</span>
              </div>
            ))}
            {data.patients.length === 0 && <div className="py-6 text-sm text-muted-foreground text-center">No patients yet.</div>}
          </div>
        </Section>
      </div>
    </>
  );
}

function PatientDashboard() {
  const { user } = useAuth();
  const queryKey = ["dashboard", "patient", user?.id];
  const { data } = useQuery({
    queryKey,
    enabled: !!user,
    queryFn: async () => {
      const patient = await patientsRepo.byUserId(user!.id);
      if (!patient) return null;
      // RLS already scopes these lists to this patient's own rows.
      const [appts, prescriptions, bills, records] = await Promise.all([
        appointmentsRepo.list(), prescriptionsRepo.list(), billsRepo.list(), medicalRecordsRepo.list(),
      ]);
      const today = new Date().toISOString().slice(0, 10);
      const upcoming = appts.filter(a => a.date >= today && a.status !== "cancelled" && a.status !== "rejected").sort((a, b) => a.date.localeCompare(b.date));
      const outstanding = bills.filter(b => b.status !== "paid").reduce((s, b) => s + b.total, 0);
      return { patient, upcoming, previous: appts.filter(a => a.status === "completed").length, prescriptions, bills, outstanding, records };
    },
  });
  useRealtimeInvalidate(["appointments", "prescriptions", "bills", "medicalRecords"], [queryKey]);

  if (data === undefined) return null;
  if (data === null) return <PageHeader title="Welcome" description="No patient profile linked to your account." />;

  return (
    <>
      <PageHeader title={`Hello, ${data.patient.fullName.split(" ")[0]}`} description="Your health snapshot." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Upcoming Visit" value={data.upcoming[0] ? formatDate(data.upcoming[0].date) : "—"} icon={Calendar} tone="primary" index={0} />
        <StatCard label="Previous Visits" value={data.previous} icon={CheckCircle2} tone="success" index={1} />
        <StatCard label="Prescriptions" value={data.prescriptions.length} icon={Pill} tone="info" index={2} />
        <StatCard label="Outstanding" value={formatCurrency(data.outstanding)} icon={Receipt} tone={data.outstanding > 0 ? "destructive" : "success"} index={3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Section title="Upcoming appointments" action={<Link to="/appointments" className="text-sm text-primary hover:underline">Book new</Link>}>
          <div className="divide-y divide-border">
            {data.upcoming.slice(0, 5).map(a => (
              <div key={a.id} className="py-3 flex items-center justify-between text-sm">
                <div><div className="font-medium">{formatDate(a.date)} at {a.time}</div><div className="text-xs text-muted-foreground">{a.department} · {a.reason}</div></div>
                <StatusBadge status={a.status} className={statusColor(a.status)} />
              </div>
            ))}
            {data.upcoming.length === 0 && <div className="py-6 text-sm text-muted-foreground text-center">No upcoming appointments.</div>}
          </div>
        </Section>
        <Section title="Recent medical records" action={<Link to="/records" className="text-sm text-primary hover:underline">All</Link>}>
          <div className="divide-y divide-border">
            {data.records.slice(-5).reverse().map(r => (
              <div key={r.id} className="py-3 text-sm">
                <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-medium">{r.diagnosis}</span></div>
                <div className="text-xs text-muted-foreground mt-0.5">{formatDate(r.date)}</div>
              </div>
            ))}
            {data.records.length === 0 && <div className="py-6 text-sm text-muted-foreground text-center">No records yet.</div>}
          </div>
        </Section>
      </div>
    </>
  );
}
