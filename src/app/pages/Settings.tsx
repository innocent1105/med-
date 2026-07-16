import { useEffect, useState } from "react";
import { settingsRepo } from "../db/repo";
import { PageHeader, Section } from "../components/PageParts";
import { inputCls, Field } from "../components/CrudTable";
import { toast } from "sonner";

interface SettingsShape {
  clinicName: string;
  currency: string;
  businessHours: string;
  language: string;
}

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsShape>({ clinicName: "", currency: "USD", businessHours: "", language: "en" });

  useEffect(() => {
    (async () => {
      const rows = await settingsRepo.list();
      const map = Object.fromEntries(rows.map(r => [r.key, r.value])) as Partial<SettingsShape>;
      setForm(f => ({ ...f, ...map }));
    })();
  }, []);

  const save = async () => {
    try {
      await settingsRepo.bulkPut(Object.entries(form).map(([key, value]) => ({ key, value })));
      toast.success("Settings saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="Clinic-wide preferences and configuration." />
      <Section title="Clinic profile">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Clinic Name" span={2}><input value={form.clinicName} onChange={e => setForm(f => ({ ...f, clinicName: e.target.value }))} className={inputCls} /></Field>
          <Field label="Currency">
            <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className={inputCls}>
              {["USD", "EUR", "GBP", "AED", "INR"].map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Language">
            <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className={inputCls}>
              <option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option>
            </select>
          </Field>
          <Field label="Business Hours" span={2}><input value={form.businessHours} onChange={e => setForm(f => ({ ...f, businessHours: e.target.value }))} className={inputCls} /></Field>
        </div>
        <div className="flex justify-end mt-5">
          <button onClick={save} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Save changes</button>
        </div>
      </Section>
    </>
  );
}
