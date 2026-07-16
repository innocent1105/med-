import { useQuery } from "@tanstack/react-query";
import { PageHeader, Section } from "../components/PageParts";
import { formatCurrency, downloadCsv } from "../lib/format";
import { Download, Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { appointmentsRepo, patientsRepo, doctorsRepo, billsRepo, medicalRecordsRepo } from "../db/repo";
import { useRealtimeInvalidate } from "../hooks/useRealtimeInvalidate";
import type { ReactNode } from "react";

export default function ReportsPage() {
  const queryKey = ["reports"];
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const [appts, patients, doctors, bills, records] = await Promise.all([
        appointmentsRepo.list(), patientsRepo.list(), doctorsRepo.list(), billsRepo.list(), medicalRecordsRepo.list(),
      ]);
      const revenue = bills.filter(b => b.status === "paid").reduce((s, b) => s + b.total, 0);
      const outstanding = bills.filter(b => b.status !== "paid").reduce((s, b) => s + b.total, 0);
      const byDoctor: Record<string, number> = {};
      appts.forEach(a => { byDoctor[a.doctorId] = (byDoctor[a.doctorId] ?? 0) + 1; });
      const doctorProd = doctors.map(d => ({ name: d.name.replace("Dr. ", ""), appointments: byDoctor[d.id] ?? 0 })).sort((a, b) => b.appointments - a.appointments).slice(0, 8);
      const regByMonth: Record<string, number> = {};
      patients.forEach(p => { const k = p.createdAt.slice(0, 7); regByMonth[k] = (regByMonth[k] ?? 0) + 1; });
      const regArr = Object.entries(regByMonth).sort().slice(-6).map(([k, v]) => ({ month: k, patients: v }));
      return { appts, patients, doctors, bills, records, revenue, outstanding, doctorProd, regArr };
    },
  });
  useRealtimeInvalidate(["appointments", "patients", "doctors", "bills", "medicalRecords"], [queryKey]);

  if (!data) return null;

  const print = () => window.print();

  return (
    <>
      <PageHeader title="Reports" description="Insights across appointments, patients, revenue and more."
        actions={<button onClick={print} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm"><Printer className="h-4 w-4" />Print</button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat label="Appointments" value={data.appts.length} />
        <MiniStat label="Patients" value={data.patients.length} />
        <MiniStat label="Doctors" value={data.doctors.length} />
        <MiniStat label="Medical Records" value={data.records.length} />
        <MiniStat label="Total Revenue" value={formatCurrency(data.revenue)} />
        <MiniStat label="Outstanding" value={formatCurrency(data.outstanding)} />
        <MiniStat label="Invoices" value={data.bills.length} />
        <MiniStat label="Paid rate" value={data.bills.length ? `${Math.round(data.bills.filter(b => b.status === "paid").length / data.bills.length * 100)}%` : "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Section title="Doctor productivity" action={<ExportBtn onClick={() => downloadCsv(data.doctorProd, `doctor-productivity-${Date.now()}.csv`)} />}>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data.doctorProd} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="name" width={120} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="appointments" fill="var(--color-chart-1)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Patient registrations" action={<ExportBtn onClick={() => downloadCsv(data.regArr, `registrations-${Date.now()}.csv`)} />}>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={data.regArr}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="patients" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="text-2xl font-semibold mt-1">{value}</div></div>;
}
function ExportBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"><Download className="h-3.5 w-3.5" />CSV</button>;
}
