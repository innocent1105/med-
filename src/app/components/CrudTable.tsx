import { useState, useMemo, type ReactNode } from "react";
import { Search, Plus, Pencil, Trash2, Download, X } from "lucide-react";
import { PageHeader, Section, EmptyState } from "./PageParts";
import { downloadCsv } from "../lib/format";
import { toast } from "sonner";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  accessor?: (row: T) => string | number;
}

export interface CrudTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  filters?: { key: string; label: string; options: string[]; get: (row: T) => string }[];
  onCreate?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => Promise<void> | void;
  onView?: (row: T) => void;
  extraActions?: ReactNode;
  pageSize?: number;
}

export function CrudTable<T extends { id: string }>({
  title, description, data, columns, searchKeys, filters, onCreate, onEdit, onDelete, onView, extraActions, pageSize = 10,
}: CrudTableProps<T>) {
  const [q, setQ] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);

  const filtered = useMemo(() => {
    return data.filter(row => {
      if (q) {
        const s = q.toLowerCase();
        const match = searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(s));
        if (!match) return false;
      }
      for (const f of filters ?? []) {
        const v = filterValues[f.key];
        if (v && v !== "all" && f.get(row) !== v) return false;
      }
      return true;
    });
  }, [data, q, filterValues, searchKeys, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCsv = () => {
    const rows = filtered.map(r => {
      const out: Record<string, unknown> = {};
      for (const c of columns) out[c.header] = c.accessor ? c.accessor(r) : (r as Record<string, unknown>)[c.key];
      return out;
    });
    downloadCsv(rows, `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.csv`);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try { await onDelete?.(confirmDelete); toast.success("Deleted"); setConfirmDelete(null); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Delete failed"); }
  };

  return (
    <>
      <PageHeader title={title} description={description} actions={
        <>
          {extraActions}
          <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm"><Download className="h-4 w-4" />Export</button>
          {onCreate && <button onClick={onCreate} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-95"><Plus className="h-4 w-4" />New</button>}
        </>
      } />
      <Section>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Search…" className="w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm" />
          </div>
          {filters?.map(f => (
            <select key={f.key} value={filterValues[f.key] ?? "all"} onChange={e => { setFilterValues(v => ({ ...v, [f.key]: e.target.value })); setPage(1); }} className="px-3 py-2 rounded-xl border border-input bg-background text-sm">
              <option value="all">{f.label}: All</option>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>

        {paged.length === 0 ? (
          <EmptyState title="Nothing here yet" description="Adjust filters or add a new entry." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  {columns.map(c => <th key={c.key} className="py-2 px-3 font-medium">{c.header}</th>)}
                  {(onEdit || onDelete || onView) && <th className="py-2 px-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paged.map(row => (
                  <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    {columns.map(c => (
                      <td key={c.key} className="py-2.5 px-3">
                        {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "")}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="py-2.5 px-3 text-right">
                        <div className="inline-flex gap-1">
                          {onView && <button onClick={() => onView(row)} className="px-2 py-1 rounded-lg hover:bg-accent text-xs">View</button>}
                          {onEdit && <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></button>}
                          {onDelete && <button onClick={() => setConfirmDelete(row)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="text-muted-foreground">{filtered.length} results · Page {currentPage} of {totalPages}</div>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </Section>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Delete this item?</h3>
            <p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p>
            <div className="flex gap-2 mt-5 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-xl border border-border hover:bg-accent text-sm">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function FormModal({ title, onClose, children, onSubmit, submitLabel = "Save" }: { title: string; onClose: () => void; children: ReactNode; onSubmit: () => void; submitLabel?: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">{children}</div>
        <div className="flex gap-2 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border hover:bg-accent text-sm">Cancel</button>
          <button onClick={onSubmit} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

export const inputCls = "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function Field({ label, children, span = 1 }: { label: string; children: ReactNode; span?: 1 | 2 }) {
  return <label className={span === 2 ? "block sm:col-span-2" : "block"}><span className="text-sm font-medium">{label}</span>{children}</label>;
}
