import { a as __toESM } from "../_runtime.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as Outlet, c as useNavigate, i as Navigate, n as Link, o as Route, r as NavLink, s as Routes, t as BrowserRouter } from "../_libs/react-router.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { A as ChartColumn, C as Download, D as CircleAlert, E as CircleCheck, M as Bell, O as Check, S as EyeOff, T as Clock, _ as LogOut, a as Sun, b as FileText, c as Search, d as Printer, f as Plus, g as Menu, h as Moon, i as Trash2, j as Calendar, k as CheckCheck, l as RefreshCw, m as Pencil, n as Users, o as Stethoscope, p as Pill, r as UserCog, s as Settings, t as X, u as Receipt, v as LoaderCircle, w as DollarSign, x as Eye, y as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ClinicApp-Cfu0Ep3Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var supabaseUrl = "https://wtsfrcnxvzdbtikivlcz.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0c2ZyY254dnpkYnRpa2l2bGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjYzMTcsImV4cCI6MjA5OTI0MjMxN30.y0q6aue_sxmdbXMByfsJQlzhLO454zHHL717qYYAcZs";
var supabase = createClient(supabaseUrl, supabaseAnonKey);
var supabaseAuthOnly = createClient(supabaseUrl, supabaseAnonKey, { auth: {
	persistSession: false,
	autoRefreshToken: false,
	detectSessionInUrl: false
} });
function assertNoError({ data, error }) {
	if (error) throw new Error(error.message);
	return data;
}
var profilesRepo = {
	async list() {
		return assertNoError(await supabase.from("profiles").select("*").order("createdAt", { ascending: false }));
	},
	async get(id) {
		const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	},
	async getByEmail(email) {
		const { data, error } = await supabase.from("profiles").select("*").ilike("email", email).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	},
	async update(id, patch) {
		return assertNoError(await supabase.from("profiles").update(patch).eq("id", id).select().single());
	},
	async remove(id) {
		const { error } = await supabase.from("profiles").delete().eq("id", id);
		if (error) throw new Error(error.message);
	}
};
var patientsRepo = {
	async list() {
		return assertNoError(await supabase.from("patients").select("*").order("createdAt", { ascending: false }));
	},
	async get(id) {
		const { data, error } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	},
	async byUserId(userId) {
		const { data, error } = await supabase.from("patients").select("*").eq("userId", userId).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	},
	async create(patient) {
		return assertNoError(await supabase.from("patients").insert(patient).select().single());
	},
	async update(id, patch) {
		return assertNoError(await supabase.from("patients").update(patch).eq("id", id).select().single());
	},
	async remove(id) {
		const { error } = await supabase.from("patients").delete().eq("id", id);
		if (error) throw new Error(error.message);
	}
};
var doctorsRepo = {
	async list() {
		return assertNoError(await supabase.from("doctors").select("*").order("createdAt", { ascending: false }));
	},
	async get(id) {
		const { data, error } = await supabase.from("doctors").select("*").eq("id", id).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	},
	async byUserId(userId) {
		const { data, error } = await supabase.from("doctors").select("*").eq("userId", userId).maybeSingle();
		if (error) throw new Error(error.message);
		return data;
	},
	async create(doctor) {
		return assertNoError(await supabase.from("doctors").insert(doctor).select().single());
	},
	async update(id, patch) {
		return assertNoError(await supabase.from("doctors").update(patch).eq("id", id).select().single());
	},
	async remove(id) {
		const { error } = await supabase.from("doctors").delete().eq("id", id);
		if (error) throw new Error(error.message);
	}
};
var appointmentsRepo = {
	async list() {
		return assertNoError(await supabase.from("appointments").select("*").order("date", { ascending: false }));
	},
	async listByDoctor(doctorId) {
		return assertNoError(await supabase.from("appointments").select("*").eq("doctorId", doctorId));
	},
	async listByPatient(patientId) {
		return assertNoError(await supabase.from("appointments").select("*").eq("patientId", patientId));
	},
	async count() {
		const { count, error } = await supabase.from("appointments").select("*", {
			count: "exact",
			head: true
		});
		if (error) throw new Error(error.message);
		return count ?? 0;
	},
	async conflictCount(doctorId, date, time) {
		const { count, error } = await supabase.from("appointments").select("*", {
			count: "exact",
			head: true
		}).eq("doctorId", doctorId).eq("date", date).eq("time", time).not("status", "in", "(cancelled,rejected)");
		if (error) throw new Error(error.message);
		return count ?? 0;
	},
	async create(appt) {
		return assertNoError(await supabase.from("appointments").insert(appt).select().single());
	},
	async update(id, patch) {
		return assertNoError(await supabase.from("appointments").update(patch).eq("id", id).select().single());
	},
	async setStatus(id, status) {
		return this.update(id, { status });
	},
	async remove(id) {
		const { error } = await supabase.from("appointments").delete().eq("id", id);
		if (error) throw new Error(error.message);
	},
	/** Appointments with the patient/doctor names embedded via the FK relationship, so pages don't need a second round trip. */
	async listWithNames() {
		const { data, error } = await supabase.from("appointments").select("*, patient:patients(fullName), doctor:doctors(name)").order("date", { ascending: false });
		if (error) throw new Error(error.message);
		return (data ?? []).map((row) => {
			const { patient, doctor, ...rest } = row;
			return {
				...rest,
				patientName: patient?.fullName ?? "?",
				doctorName: doctor?.name ?? "?"
			};
		});
	}
};
var medicalRecordsRepo = {
	async list() {
		return assertNoError(await supabase.from("medicalRecords").select("*").order("date", { ascending: false }));
	},
	async create(record) {
		return assertNoError(await supabase.from("medicalRecords").insert(record).select().single());
	},
	async update(id, patch) {
		return assertNoError(await supabase.from("medicalRecords").update(patch).eq("id", id).select().single());
	},
	async remove(id) {
		const { error } = await supabase.from("medicalRecords").delete().eq("id", id);
		if (error) throw new Error(error.message);
	},
	async listWithNames() {
		const { data, error } = await supabase.from("medicalRecords").select("*, patient:patients(fullName), doctor:doctors(name)").order("date", { ascending: false });
		if (error) throw new Error(error.message);
		return (data ?? []).map((row) => {
			const { patient, doctor, ...rest } = row;
			return {
				...rest,
				patientName: patient?.fullName ?? "?",
				doctorName: doctor?.name ?? "?"
			};
		});
	}
};
var prescriptionsRepo = {
	async list() {
		return assertNoError(await supabase.from("prescriptions").select("*").order("date", { ascending: false }));
	},
	async create(rx) {
		return assertNoError(await supabase.from("prescriptions").insert(rx).select().single());
	},
	async update(id, patch) {
		return assertNoError(await supabase.from("prescriptions").update(patch).eq("id", id).select().single());
	},
	async remove(id) {
		const { error } = await supabase.from("prescriptions").delete().eq("id", id);
		if (error) throw new Error(error.message);
	},
	async listWithNames() {
		const { data, error } = await supabase.from("prescriptions").select("*, patient:patients(fullName), doctor:doctors(name)").order("date", { ascending: false });
		if (error) throw new Error(error.message);
		return (data ?? []).map((row) => {
			const { patient, doctor, ...rest } = row;
			return {
				...rest,
				patientName: patient?.fullName ?? "?",
				doctorName: doctor?.name ?? "?"
			};
		});
	}
};
var billsRepo = {
	async list() {
		return assertNoError(await supabase.from("bills").select("*").order("date", { ascending: false }));
	},
	async count() {
		const { count, error } = await supabase.from("bills").select("*", {
			count: "exact",
			head: true
		});
		if (error) throw new Error(error.message);
		return count ?? 0;
	},
	async create(bill) {
		return assertNoError(await supabase.from("bills").insert(bill).select().single());
	},
	async update(id, patch) {
		return assertNoError(await supabase.from("bills").update(patch).eq("id", id).select().single());
	},
	async remove(id) {
		const { error } = await supabase.from("bills").delete().eq("id", id);
		if (error) throw new Error(error.message);
	},
	async listWithNames() {
		const { data, error } = await supabase.from("bills").select("*, patient:patients(fullName)").order("date", { ascending: false });
		if (error) throw new Error(error.message);
		return (data ?? []).map((row) => {
			const { patient, ...rest } = row;
			return {
				...rest,
				patientName: patient?.fullName ?? "?"
			};
		});
	}
};
var notificationsRepo = {
	async listByUser(userId) {
		return assertNoError(await supabase.from("notifications").select("*").eq("userId", userId).order("date", { ascending: false }));
	},
	async create(userId, title, message, type = "info") {
		return assertNoError(await supabase.from("notifications").insert({
			userId,
			title,
			message,
			read: false,
			type
		}).select().single());
	},
	async markRead(id) {
		const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
		if (error) throw new Error(error.message);
	},
	async markAllRead(userId) {
		const { error } = await supabase.from("notifications").update({ read: true }).eq("userId", userId).eq("read", false);
		if (error) throw new Error(error.message);
	}
};
var settingsRepo = {
	async list() {
		return assertNoError(await supabase.from("settings").select("*"));
	},
	async bulkPut(rows) {
		const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
		if (error) throw new Error(error.message);
	}
};
var REMEMBER_KEY = "medicore.remember";
var Ctx$1 = (0, import_react.createContext)(null);
async function ensurePatientProfile(userId) {
	if (await patientsRepo.byUserId(userId)) return;
	const { data: { user: authUser } } = await supabase.auth.getUser();
	if (!authUser) return;
	const meta = authUser.user_metadata;
	await patientsRepo.create({
		id: crypto.randomUUID(),
		userId,
		fullName: meta.name ?? authUser.email ?? "New patient",
		gender: meta.gender ?? "other",
		dateOfBirth: meta.dateOfBirth ?? "",
		bloodGroup: "",
		allergies: "",
		emergencyContact: "",
		address: meta.address ?? "",
		email: authUser.email ?? "",
		phone: meta.phone ?? "",
		chronicDiseases: "",
		medicalNotes: "",
		insurance: "",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const loadProfile = (0, import_react.useCallback)(async (userId) => {
		let profile = await profilesRepo.get(userId);
		if (!profile) {
			await new Promise((r) => setTimeout(r, 400));
			profile = await profilesRepo.get(userId);
		}
		if (profile?.role === "patient") await ensurePatientProfile(userId);
		return profile;
	}, []);
	const refresh = (0, import_react.useCallback)(async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) {
			setUser(null);
			setLoading(false);
			return;
		}
		const profile = await loadProfile(session.user.id);
		setUser(profile);
		setLoading(false);
	}, [loadProfile]);
	(0, import_react.useEffect)(() => {
		refresh();
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			if (!session) {
				setUser(null);
				return;
			}
			loadProfile(session.user.id).then(setUser);
		});
		return () => sub.subscription.unsubscribe();
	}, [refresh, loadProfile]);
	const login = async (email, password, remember) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password
		});
		if (error) throw new Error(error.message === "Invalid login credentials" ? "Invalid email or password" : error.message);
		const profile = await loadProfile(data.user.id);
		if (!profile) throw new Error("No profile found for this account");
		if (profile.status !== "active") {
			await supabase.auth.signOut();
			throw new Error("Account is inactive");
		}
		if (remember) localStorage.setItem(REMEMBER_KEY, email);
		else localStorage.removeItem(REMEMBER_KEY);
		setUser(profile);
		return profile;
	};
	const logout = async () => {
		await supabase.auth.signOut();
		setUser(null);
	};
	const register = async (data) => {
		const { data: signUpData, error } = await supabase.auth.signUp({
			email: data.email.trim(),
			password: data.password,
			options: { data: {
				name: data.name,
				role: "patient",
				phone: data.phone ?? "",
				...data.patientProfile
			} }
		});
		if (error) throw new Error(error.message);
		if (signUpData.session) {
			const profile = await loadProfile(signUpData.session.user.id);
			setUser(profile);
			return { needsEmailConfirmation: false };
		}
		return { needsEmailConfirmation: true };
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx$1.Provider, {
		value: {
			user,
			loading,
			login,
			logout,
			register,
			refresh
		},
		children
	});
}
function useAuth() {
	const c = (0, import_react.useContext)(Ctx$1);
	if (!c) throw new Error("useAuth must be inside AuthProvider");
	return c;
}
function getRememberedEmail() {
	return localStorage.getItem(REMEMBER_KEY) ?? "";
}
var KEY = "medicore.theme";
var Ctx = (0, import_react.createContext)(null);
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "light";
		return localStorage.getItem(KEY) ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	});
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem(KEY, theme);
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			theme,
			toggle: () => setTheme((t) => t === "light" ? "dark" : "light")
		},
		children
	});
}
function useTheme() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useTheme must be inside ThemeProvider");
	return c;
}
function RouteGuard({ allowedRoles }) {
	const { user, loading } = useAuth();
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "animate-pulse text-muted-foreground text-sm",
			children: "Loading…"
		})
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/login",
		replace: true
	});
	if (allowedRoles && !allowedRoles.includes(user.role)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/unauthorized",
		replace: true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
/** Invalidates the given react-query keys whenever any of `tables` changes in Postgres. */
function useRealtimeInvalidate(tables, queryKeys) {
	const queryClient = useQueryClient();
	const tableKey = tables.join(",");
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel(`rt:${tableKey}:${Math.random().toString(36).slice(2)}`);
		for (const table of tables) channel.on("postgres_changes", {
			event: "*",
			schema: "public",
			table
		}, () => {
			for (const key of queryKeys) queryClient.invalidateQueries({ queryKey: key });
		});
		channel.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [tableKey, JSON.stringify(queryKeys)]);
}
function useNotifications() {
	const { user } = useAuth();
	const queryKey = ["notifications", user?.id ?? "anon"];
	const { data } = useQuery({
		queryKey,
		queryFn: () => notificationsRepo.listByUser(user.id),
		enabled: !!user
	});
	useRealtimeInvalidate(["notifications"], [queryKey]);
	const notifications = data ?? [];
	return {
		notifications,
		unread: notifications.filter((n) => !n.read).length
	};
}
async function notify(userId, title, message, type = "info") {
	await notificationsRepo.create(userId, title, message, type);
}
async function markRead(id) {
	await notificationsRepo.markRead(id);
}
async function markAllRead(userId) {
	await notificationsRepo.markAllRead(userId);
}
function formatCurrency(n, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency
	}).format(n);
}
function formatDate(d) {
	const date = typeof d === "string" ? new Date(d) : d;
	if (isNaN(date.getTime())) return "—";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function formatDateTime(d) {
	const date = typeof d === "string" ? new Date(d) : d;
	if (isNaN(date.getTime())) return "—";
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function initials(name) {
	return name.split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
}
function downloadCsv(rows, filename) {
	if (rows.length === 0) return;
	const headers = Object.keys(rows[0]);
	const escape = (v) => {
		const s = v == null ? "" : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, "\"\"")}"` : s;
	};
	const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function statusColor(status) {
	return {
		approved: "bg-success/15 text-success border-success/30",
		completed: "bg-success/15 text-success border-success/30",
		paid: "bg-success/15 text-success border-success/30",
		pending: "bg-warning/15 text-warning border-warning/30",
		rescheduled: "bg-info/15 text-info border-info/30",
		cancelled: "bg-muted text-muted-foreground border-border",
		rejected: "bg-destructive/15 text-destructive border-destructive/30",
		overdue: "bg-destructive/15 text-destructive border-destructive/30",
		active: "bg-success/15 text-success border-success/30",
		inactive: "bg-muted text-muted-foreground border-border"
	}[status] ?? "bg-muted text-muted-foreground border-border";
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		roles: [
			"admin",
			"doctor",
			"patient"
		]
	},
	{
		to: "/appointments",
		label: "Appointments",
		icon: Calendar,
		roles: [
			"admin",
			"doctor",
			"patient"
		]
	},
	{
		to: "/patients",
		label: "Patients",
		icon: Users,
		roles: ["admin", "doctor"]
	},
	{
		to: "/doctors",
		label: "Doctors",
		icon: Stethoscope,
		roles: ["admin", "patient"]
	},
	{
		to: "/users",
		label: "Users",
		icon: UserCog,
		roles: ["admin"]
	},
	{
		to: "/records",
		label: "Medical Records",
		icon: FileText,
		roles: [
			"admin",
			"doctor",
			"patient"
		]
	},
	{
		to: "/prescriptions",
		label: "Prescriptions",
		icon: Pill,
		roles: [
			"admin",
			"doctor",
			"patient"
		]
	},
	{
		to: "/billing",
		label: "Billing",
		icon: Receipt,
		roles: ["admin", "patient"]
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn,
		roles: ["admin"]
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell,
		roles: [
			"admin",
			"doctor",
			"patient"
		]
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings,
		roles: ["admin"]
	}
];
var SIDEBAR_KEY = "medicore.sidebar";
function AppLayout() {
	const { user, logout } = useAuth();
	const { theme, toggle } = useTheme();
	const { unread } = useNotifications();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)(() => localStorage.getItem(SIDEBAR_KEY) === "1");
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
	}, [collapsed]);
	if (!user) return null;
	const items = NAV.filter((n) => n.roles.includes(user.role));
	const handleLogout = () => {
		logout();
		navigate("/login");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMobileOpen(true),
					className: "p-2 -ml-2 rounded-lg hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-semibold tracking-tight",
					children: "MediCore"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: toggle,
					className: "p-2 rounded-lg hover:bg-accent",
					children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-5 w-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("fixed lg:sticky top-0 left-0 h-screen z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300", collapsed ? "lg:w-20" : "lg:w-64", mobileOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 h-16 border-b border-sidebar-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold",
									children: "M"
								}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold tracking-tight",
									children: "MediCore"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileOpen(false),
								className: "lg:hidden p-2 rounded-lg hover:bg-sidebar-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex-1 overflow-y-auto py-3 px-2 space-y-1",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: item.to,
								end: item.to === "/",
								onClick: () => setMobileOpen(false),
								className: ({ isActive }) => cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors", "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4 shrink-0" }),
									!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 truncate",
										children: item.label
									}),
									!collapsed && item.to === "/notifications" && unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5",
										children: unread
									})
								]
							}, item.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-sidebar-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 px-2 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-9 w-9 rounded-full bg-accent text-accent-foreground grid place-items-center text-sm font-semibold shrink-0",
									children: initials(user.name)
								}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium truncate",
										children: user.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground capitalize",
										children: user.role
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleLogout,
								className: "mt-2 w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-sidebar-accent text-sidebar-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign out" })]
							})]
						})
					]
				}),
				mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onClick: () => setMobileOpen(false),
					className: "fixed inset-0 bg-black/40 z-40 lg:hidden"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 flex flex-col min-h-screen",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "hidden lg:flex sticky top-0 z-30 items-center justify-between gap-4 px-6 h-16 border-b border-border bg-background/80 backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 flex-1 max-w-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCollapsed((c) => !c),
								className: "p-2 rounded-lg hover:bg-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									placeholder: "Search patients, doctors, appointments…",
									className: "w-full pl-9 pr-3 py-2 bg-muted rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggle,
								className: "p-2 rounded-lg hover:bg-accent",
								"aria-label": "Toggle theme",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavLink, {
								to: "/notifications",
								className: "relative p-2 rounded-lg hover:bg-accent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] leading-4 text-primary-foreground bg-primary rounded-full text-center",
									children: unread
								})]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.main, {
						initial: {
							opacity: 0,
							y: 6
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .25 },
						className: "flex-1 p-4 md:p-6 lg:p-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}, location.pathname)]
				})
			]
		})]
	});
}
function LoginPage() {
	const { user, login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)(getRememberedEmail());
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(Boolean(getRememberedEmail()));
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await login(email, password, remember);
			toast.success("Welcome back");
			navigate("/");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	};
	const fill = (e, p) => {
		setEmail(e);
		setPassword(p);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid lg:grid-cols-2 bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-info text-primary-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-11 w-11 rounded-2xl bg-primary-foreground text-primary grid place-items-center font-bold text-lg",
						children: "M"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xl font-semibold tracking-tight",
						children: "MediCore"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .6 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-semibold tracking-tight leading-tight",
						children: "A calmer workspace for modern clinics."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-primary-foreground/85 max-w-md",
						children: "Appointments, medical records, prescriptions and billing — organised in one place, with a clean interface built for busy days."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-primary-foreground/70",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" MediCore"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6 md:p-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:hidden flex items-center gap-3 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold",
							children: "M"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-semibold",
							children: "MediCore"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl md:text-3xl font-semibold tracking-tight",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Welcome back. Please enter your details."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "mt-8 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								className: "mt-1.5 w-full px-3 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: showPw ? "text" : "password",
									required: true,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									className: "w-full px-3 py-2.5 pr-10 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPw((s) => !s),
									className: "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-accent",
									children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: remember,
										onChange: (e) => setRemember(e.target.checked),
										className: "h-4 w-4 rounded border-input"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remember me" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toast.info("Prototype: contact your admin to reset your password."),
									className: "text-primary hover:underline",
									children: "Forgot password?"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: loading,
								className: "w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2",
								children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Sign in"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: ["New patient? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "text-primary font-medium hover:underline",
							children: "Create an account"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 rounded-xl border border-border bg-muted/40 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
							children: "Demo accounts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-2 text-sm",
							children: [
								{
									label: "Admin",
									e: "admin@clinic.com",
									p: "password123"
								},
								{
									label: "Doctor",
									e: "doctor@clinic.com",
									p: "password123"
								},
								{
									label: "Patient",
									e: "patient@clinic.com",
									p: "password123"
								}
							].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => fill(d.e, d.p),
								className: "flex items-center justify-between px-3 py-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: d.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: d.e
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-primary",
									children: "Use →"
								})]
							}, d.e))
						})]
					})
				]
			})
		})]
	});
}
var schema = objectType({
	name: stringType().trim().min(2, "Enter your full name"),
	email: stringType().trim().email(),
	phone: stringType().trim().min(6, "Phone required"),
	dateOfBirth: stringType().min(1, "Date required"),
	gender: enumType([
		"male",
		"female",
		"other"
	]),
	address: stringType().trim().min(3, "Address required"),
	password: stringType().min(6, "At least 6 characters"),
	confirm: stringType()
}).refine((d) => d.password === d.confirm, {
	message: "Passwords do not match",
	path: ["confirm"]
});
function RegisterPage() {
	const { user, register } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		gender: "male",
		address: "",
		password: "",
		confirm: ""
	});
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/",
		replace: true
	});
	const submit = async (e) => {
		e.preventDefault();
		const parsed = schema.safeParse(form);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		try {
			const { needsEmailConfirmation } = await register({
				name: form.name,
				email: form.email,
				phone: form.phone,
				password: form.password,
				patientProfile: {
					gender: form.gender,
					dateOfBirth: form.dateOfBirth,
					address: form.address
				}
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
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold",
						children: "M"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-semibold",
						children: "MediCore"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Create patient account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Fill in your details to book your first appointment."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Full Name",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.name,
								onChange: (e) => set("name", e.target.value),
								className: inputCls$1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								value: form.email,
								onChange: (e) => set("email", e.target.value),
								className: inputCls$1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.phone,
								onChange: (e) => set("phone", e.target.value),
								className: inputCls$1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Date of Birth",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								required: true,
								value: form.dateOfBirth,
								onChange: (e) => set("dateOfBirth", e.target.value),
								className: inputCls$1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Gender",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.gender,
								onChange: (e) => set("gender", e.target.value),
								className: inputCls$1,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "male",
										children: "Male"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "female",
										children: "Female"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "other",
										children: "Other"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Address",
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.address,
								onChange: (e) => set("address", e.target.value),
								className: inputCls$1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Password",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: form.password,
								onChange: (e) => set("password", e.target.value),
								className: inputCls$1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
							label: "Confirm Password",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								value: form.confirm,
								onChange: (e) => set("confirm", e.target.value),
								className: inputCls$1
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: loading,
							className: "sm:col-span-2 mt-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2",
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Create account"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-center text-sm text-muted-foreground",
					children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "text-primary font-medium hover:underline",
						children: "Sign in"
					})]
				})
			]
		})
	});
}
var inputCls$1 = "w-full px-3 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring";
function Field$1({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5",
			children
		})]
	});
}
function PageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl md:text-3xl font-semibold tracking-tight",
			children: title
		}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: description
		})] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2",
			children: actions
		})]
	});
}
function StatCard({ label, value, icon: Icon, hint, tone = "primary", index = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			delay: index * .04,
			duration: .3
		},
		className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-3xl font-semibold tracking-tight mt-2",
					children: value
				}),
				hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground mt-1",
					children: hint
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-11 w-11 rounded-xl grid place-items-center", {
					primary: "bg-primary/10 text-primary",
					success: "bg-success/10 text-success",
					warning: "bg-warning/15 text-warning",
					info: "bg-info/10 text-info",
					destructive: "bg-destructive/10 text-destructive"
				}[tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			})]
		})
	});
}
function Section({ title, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className),
		children: [(title || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-4",
			children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold tracking-tight",
				children: title
			}), action]
		}), children]
	});
}
function EmptyState({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-base font-medium",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
function StatusBadge({ status, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", className),
		children: status
	});
}
function DashboardRouter() {
	const { user } = useAuth();
	if (!user) return null;
	if (user.role === "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {});
	if (user.role === "doctor") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorDashboard, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientDashboard, {});
}
function AdminDashboard() {
	const queryKey = ["dashboard", "admin"];
	const { data } = useQuery({
		queryKey,
		queryFn: async () => {
			const [patients, doctors, appts, bills] = await Promise.all([
				patientsRepo.list(),
				doctorsRepo.list(),
				appointmentsRepo.list(),
				billsRepo.list()
			]);
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const todays = appts.filter((a) => a.date === today).length;
			const upcoming = appts.filter((a) => a.date > today && (a.status === "approved" || a.status === "pending")).length;
			const completed = appts.filter((a) => a.status === "completed").length;
			const revenue = bills.filter((b) => b.status === "paid").reduce((s, b) => s + b.total, 0);
			const pending = bills.filter((b) => b.status !== "paid").reduce((s, b) => s + b.total, 0);
			const monthly = {};
			appts.forEach((a) => {
				const k = a.date.slice(0, 7);
				monthly[k] = (monthly[k] ?? 0) + 1;
			});
			const monthlyArr = Object.entries(monthly).sort().slice(-6).map(([k, v]) => ({
				month: k,
				count: v
			}));
			const revenueByMonth = {};
			bills.filter((b) => b.status === "paid").forEach((b) => {
				const k = b.date.slice(0, 7);
				revenueByMonth[k] = (revenueByMonth[k] ?? 0) + b.total;
			});
			const revenueArr = Object.entries(revenueByMonth).sort().slice(-6).map(([k, v]) => ({
				month: k,
				revenue: Math.round(v)
			}));
			const statusCounts = {};
			appts.forEach((a) => {
				statusCounts[a.status] = (statusCounts[a.status] ?? 0) + 1;
			});
			const statusArr = Object.entries(statusCounts).map(([name, value]) => ({
				name,
				value
			}));
			const recent = appts.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
			return {
				patients: patients.length,
				doctors: doctors.length,
				todays,
				upcoming,
				completed,
				revenue,
				pending,
				monthlyArr,
				revenueArr,
				statusArr,
				recent
			};
		}
	});
	useRealtimeInvalidate([
		"appointments",
		"bills",
		"patients",
		"doctors"
	], [queryKey]);
	if (!data) return null;
	const colors = [
		"var(--color-chart-1)",
		"var(--color-chart-2)",
		"var(--color-chart-3)",
		"var(--color-chart-4)",
		"var(--color-chart-5)"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Admin overview",
			description: "Clinic health at a glance."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Patients",
					value: data.patients,
					icon: Users,
					tone: "primary",
					index: 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Doctors",
					value: data.doctors,
					icon: Stethoscope,
					tone: "info",
					index: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Today's Appointments",
					value: data.todays,
					icon: Calendar,
					tone: "success",
					index: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Upcoming",
					value: data.upcoming,
					icon: Clock,
					tone: "warning",
					index: 3
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Completed",
					value: data.completed,
					icon: CircleCheck,
					tone: "success",
					index: 4
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Revenue",
					value: formatCurrency(data.revenue),
					icon: DollarSign,
					tone: "primary",
					index: 5
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending Payments",
					value: formatCurrency(data.pending),
					icon: CircleAlert,
					tone: "destructive",
					index: 6
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Monthly appointments",
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: data.monthlyArr,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--color-border)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: "var(--color-chart-1)",
								radius: [
									8,
									8,
									0,
									0
								]
							})
						]
					}) })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Appointment status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: data.statusArr,
						dataKey: "value",
						nameKey: "name",
						outerRadius: 80,
						innerRadius: 40,
						children: data.statusArr.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: colors[i % colors.length] }, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
						background: "var(--color-card)",
						border: "1px solid var(--color-border)",
						borderRadius: 12
					} })] }) })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 mt-2",
					children: data.statusArr.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2.5 w-2.5 rounded-full",
								style: { background: colors[i % colors.length] }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"(",
									s.value,
									")"
								]
							})
						]
					}, s.name))
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Revenue trend",
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: data.revenueArr,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--color-border)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "revenue",
								stroke: "var(--color-chart-2)",
								strokeWidth: 2.5,
								dot: { r: 4 }
							})
						]
					}) })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Recent appointments",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/appointments",
					className: "text-sm text-primary hover:underline",
					children: "View all"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: data.recent.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: a.number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								formatDate(a.date),
								" · ",
								a.department
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: a.status,
							className: statusColor(a.status)
						})]
					}, a.id))
				})
			})]
		})
	] });
}
function DoctorDashboard() {
	const { user } = useAuth();
	const queryKey = [
		"dashboard",
		"doctor",
		user?.id
	];
	const { data } = useQuery({
		queryKey,
		enabled: !!user,
		queryFn: async () => {
			const doctor = await doctorsRepo.byUserId(user.id);
			if (!doctor) return {
				doctor: null,
				today: 0,
				upcoming: [],
				completed: 0,
				prescriptions: 0,
				patients: []
			};
			const [appts, prescriptions, patients] = await Promise.all([
				appointmentsRepo.list(),
				prescriptionsRepo.list(),
				patientsRepo.list()
			]);
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			return {
				doctor,
				today: appts.filter((a) => a.date === today).length,
				upcoming: appts.filter((a) => a.date >= today && (a.status === "approved" || a.status === "pending")).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6),
				completed: appts.filter((a) => a.status === "completed").length,
				prescriptions: prescriptions.length,
				patients: patients.slice(0, 6)
			};
		}
	});
	useRealtimeInvalidate([
		"appointments",
		"prescriptions",
		"patients"
	], [queryKey]);
	if (!data) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Welcome, ${user?.name}`,
			description: data.doctor ? `${data.doctor.specialty} · ${data.doctor.department}` : ""
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Today's Patients",
					value: data.today,
					icon: Calendar,
					tone: "primary",
					index: 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Upcoming",
					value: data.upcoming.length,
					icon: Clock,
					tone: "info",
					index: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Completed",
					value: data.completed,
					icon: CircleCheck,
					tone: "success",
					index: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Prescriptions",
					value: data.prescriptions,
					icon: Pill,
					tone: "warning",
					index: 3
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Upcoming appointments",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/appointments",
					className: "text-sm text-primary hover:underline",
					children: "All"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [data.upcoming.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: a.number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								formatDate(a.date),
								" at ",
								a.time
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: a.status,
							className: statusColor(a.status)
						})]
					}, a.id)), data.upcoming.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-6 text-sm text-muted-foreground text-center",
						children: "No upcoming visits."
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Recent patients",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/patients",
					className: "text-sm text-primary hover:underline",
					children: "All"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [data.patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: p.fullName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								p.gender,
								" · ",
								p.bloodGroup
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: p.phone
						})]
					}, p.id)), data.patients.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-6 text-sm text-muted-foreground text-center",
						children: "No patients yet."
					})]
				})
			})]
		})
	] });
}
function PatientDashboard() {
	const { user } = useAuth();
	const queryKey = [
		"dashboard",
		"patient",
		user?.id
	];
	const { data } = useQuery({
		queryKey,
		enabled: !!user,
		queryFn: async () => {
			const patient = await patientsRepo.byUserId(user.id);
			if (!patient) return null;
			const [appts, prescriptions, bills, records] = await Promise.all([
				appointmentsRepo.list(),
				prescriptionsRepo.list(),
				billsRepo.list(),
				medicalRecordsRepo.list()
			]);
			const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const upcoming = appts.filter((a) => a.date >= today && a.status !== "cancelled" && a.status !== "rejected").sort((a, b) => a.date.localeCompare(b.date));
			const outstanding = bills.filter((b) => b.status !== "paid").reduce((s, b) => s + b.total, 0);
			return {
				patient,
				upcoming,
				previous: appts.filter((a) => a.status === "completed").length,
				prescriptions,
				bills,
				outstanding,
				records
			};
		}
	});
	useRealtimeInvalidate([
		"appointments",
		"prescriptions",
		"bills",
		"medicalRecords"
	], [queryKey]);
	if (data === void 0) return null;
	if (data === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Welcome",
		description: "No patient profile linked to your account."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Hello, ${data.patient.fullName.split(" ")[0]}`,
			description: "Your health snapshot."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Upcoming Visit",
					value: data.upcoming[0] ? formatDate(data.upcoming[0].date) : "—",
					icon: Calendar,
					tone: "primary",
					index: 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Previous Visits",
					value: data.previous,
					icon: CircleCheck,
					tone: "success",
					index: 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Prescriptions",
					value: data.prescriptions.length,
					icon: Pill,
					tone: "info",
					index: 2
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Outstanding",
					value: formatCurrency(data.outstanding),
					icon: Receipt,
					tone: data.outstanding > 0 ? "destructive" : "success",
					index: 3
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Upcoming appointments",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/appointments",
					className: "text-sm text-primary hover:underline",
					children: "Book new"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [data.upcoming.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3 flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-medium",
							children: [
								formatDate(a.date),
								" at ",
								a.time
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								a.department,
								" · ",
								a.reason
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: a.status,
							className: statusColor(a.status)
						})]
					}, a.id)), data.upcoming.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-6 text-sm text-muted-foreground text-center",
						children: "No upcoming appointments."
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Recent medical records",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/records",
					className: "text-sm text-primary hover:underline",
					children: "All"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [data.records.slice(-5).reverse().map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: r.diagnosis
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: formatDate(r.date)
						})]
					}, r.id)), data.records.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-6 text-sm text-muted-foreground text-center",
						children: "No records yet."
					})]
				})
			})]
		})
	] });
}
var nextStatusActions = (status) => {
	switch (status) {
		case "pending": return [
			"approved",
			"rejected",
			"rescheduled"
		];
		case "approved": return [
			"completed",
			"cancelled",
			"rescheduled"
		];
		case "rescheduled": return ["approved", "cancelled"];
		default: return [];
	}
};
function AppointmentsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["appointments", "withNames"];
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [dateFilter, setDateFilter] = (0, import_react.useState)("");
	const [openBook, setOpenBook] = (0, import_react.useState)(false);
	const [rescheduleTarget, setRescheduleTarget] = (0, import_react.useState)(null);
	const { data: rows = [] } = useQuery({
		queryKey,
		queryFn: appointmentsRepo.listWithNames,
		enabled: !!user
	});
	useRealtimeInvalidate(["appointments"], [queryKey]);
	const filtered = (0, import_react.useMemo)(() => {
		return rows.filter((a) => {
			if (statusFilter !== "all" && a.status !== statusFilter) return false;
			if (dateFilter && a.date !== dateFilter) return false;
			if (q) {
				const s = q.toLowerCase();
				return a.number.toLowerCase().includes(s) || a.patientName.toLowerCase().includes(s) || a.doctorName.toLowerCase().includes(s) || a.department.toLowerCase().includes(s);
			}
			return true;
		}).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
	}, [
		rows,
		q,
		statusFilter,
		dateFilter
	]);
	const statusMutation = useMutation({
		mutationFn: async ({ a, next }) => {
			await appointmentsRepo.setStatus(a.id, next);
			const patient = await patientsRepo.get(a.patientId);
			if (patient?.userId) await notify(patient.userId, `Appointment ${next}`, `Your appointment ${a.number} was ${next}.`, next === "approved" || next === "completed" ? "success" : "info");
		},
		onSuccess: (_d, { next }) => {
			queryClient.invalidateQueries({ queryKey });
			toast.success(`Appointment ${next}`);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed")
	});
	const doAction = (a, next) => {
		if (next === "rescheduled") {
			setRescheduleTarget(a);
			return;
		}
		statusMutation.mutate({
			a,
			next
		});
	};
	const exportCsv = () => downloadCsv(filtered.map((a) => ({
		number: a.number,
		patient: a.patientName,
		doctor: a.doctorName,
		date: a.date,
		time: a.time,
		department: a.department,
		reason: a.reason,
		status: a.status
	})), `appointments-${Date.now()}.csv`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Appointments",
			description: "Track and manage all clinic visits.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: exportCsv,
				className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Export"]
			}), (user?.role === "patient" || user?.role === "admin") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setOpenBook(true),
				className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-95",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Book appointment"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row gap-3 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search appointments…",
						className: "w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: statusFilter,
					onChange: (e) => setStatusFilter(e.target.value),
					className: "px-3 py-2 rounded-xl border border-input bg-background text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All statuses"
					}), [
						"pending",
						"approved",
						"completed",
						"cancelled",
						"rejected",
						"rescheduled"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: s
					}, s))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: dateFilter,
					onChange: (e) => setDateFilter(e.target.value),
					className: "px-3 py-2 rounded-xl border border-input bg-background text-sm"
				})
			]
		}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No appointments",
			description: "Try changing filters or book a new appointment."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "text-left text-muted-foreground border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium",
							children: "Number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium",
							children: "Patient"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium",
							children: "Doctor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium",
							children: "Date & Time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium",
							children: "Dept."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium text-right",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border last:border-0 hover:bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3 font-medium",
							children: a.number
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3",
							children: a.patientName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3",
							children: a.doctorName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-2.5 px-3",
							children: [
								formatDate(a.date),
								" · ",
								a.time
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3",
							children: a.department
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
								status: a.status,
								className: statusColor(a.status)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1",
								children: [user && (user.role === "admin" || user.role === "doctor") && nextStatusActions(a.status).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => doAction(a, n),
									className: "p-1.5 rounded-lg hover:bg-accent text-xs capitalize",
									title: n,
									children: n === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-success" }) : n === "rejected" || n === "cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 text-destructive" }) : n === "rescheduled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 text-info" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-primary" })
								}, n)), user?.role === "patient" && a.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => doAction(a, "cancelled"),
									className: "px-2 py-1 rounded-lg hover:bg-accent text-xs",
									children: "Cancel"
								})]
							})
						})
					]
				}, a.id)) })]
			})
		})] }),
		openBook && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookDialog, { onClose: () => setOpenBook(false) }),
		rescheduleTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RescheduleDialog, {
			appt: rescheduleTarget,
			onClose: () => setRescheduleTarget(null)
		})
	] });
}
function Modal({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center p-4 bg-black/50",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-lg",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1.5 rounded-lg hover:bg-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), children]
		})
	});
}
var bookSchema = objectType({
	patientId: stringType().min(1),
	doctorId: stringType().min(1),
	date: stringType().min(1),
	time: stringType().min(1),
	reason: stringType().min(1)
});
function BookDialog({ onClose }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { data: doctors = [] } = useQuery({
		queryKey: ["doctors"],
		queryFn: doctorsRepo.list
	});
	const { data: patients = [] } = useQuery({
		queryKey: ["patients"],
		queryFn: patientsRepo.list,
		enabled: user?.role !== "patient"
	});
	const { data: myPatient } = useQuery({
		queryKey: [
			"patients",
			"byUserId",
			user?.id
		],
		queryFn: () => patientsRepo.byUserId(user.id),
		enabled: user?.role === "patient"
	});
	const [form, setForm] = (0, import_react.useState)({
		patientId: "",
		doctorId: "",
		date: "",
		time: "",
		reason: ""
	});
	const patientId = user?.role === "patient" ? myPatient?.id ?? "" : form.patientId;
	const bookMutation = useMutation({
		mutationFn: async () => {
			if (!bookSchema.safeParse({
				...form,
				patientId
			}).success) throw new Error("Fill all fields");
			if (await appointmentsRepo.conflictCount(form.doctorId, form.date, form.time) > 0) throw new Error("Doctor already booked at this time");
			const doctor = doctors.find((d) => d.id === form.doctorId);
			const count = await appointmentsRepo.count();
			const appt = {
				id: crypto.randomUUID(),
				number: `APT-${String(count + 1).padStart(5, "0")}`,
				patientId,
				doctorId: form.doctorId,
				date: form.date,
				time: form.time,
				department: doctor?.department ?? "General",
				reason: form.reason,
				status: "pending",
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			await appointmentsRepo.create(appt);
			if (doctor?.userId) await notify(doctor.userId, "New appointment request", `${appt.number} on ${appt.date} at ${appt.time}`, "info");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
			toast.success("Appointment booked");
			onClose();
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Booking failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "Book appointment",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				user?.role !== "patient" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium",
					children: "Patient"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: form.patientId,
					onChange: (e) => setForm((f) => ({
						...f,
						patientId: e.target.value
					})),
					className: inp,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select patient…"
					}), patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.id,
						children: p.fullName
					}, p.id))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium",
					children: "Doctor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: form.doctorId,
					onChange: (e) => setForm((f) => ({
						...f,
						doctorId: e.target.value
					})),
					className: inp,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select doctor…"
					}), doctors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: d.id,
						children: [
							d.name,
							" — ",
							d.specialty
						]
					}, d.id))]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium",
						children: "Date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.date,
						onChange: (e) => setForm((f) => ({
							...f,
							date: e.target.value
						})),
						className: inp
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium",
						children: "Time"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "time",
						value: form.time,
						onChange: (e) => setForm((f) => ({
							...f,
							time: e.target.value
						})),
						className: inp
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium",
					children: "Reason"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: form.reason,
					onChange: (e) => setForm((f) => ({
						...f,
						reason: e.target.value
					})),
					className: inp,
					placeholder: "e.g. Consultation"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => bookMutation.mutate(),
					disabled: bookMutation.isPending,
					className: "w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60",
					children: "Confirm booking"
				})
			]
		})
	});
}
function RescheduleDialog({ appt, onClose }) {
	const queryClient = useQueryClient();
	const [date, setDate] = (0, import_react.useState)(appt.date);
	const [time, setTime] = (0, import_react.useState)(appt.time);
	const saveMutation = useMutation({
		mutationFn: async () => {
			await appointmentsRepo.update(appt.id, {
				date,
				time,
				status: "rescheduled"
			});
			const patient = await patientsRepo.get(appt.patientId);
			if (patient?.userId) await notify(patient.userId, "Appointment rescheduled", `${appt.number} moved to ${date} at ${time}`, "info");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["appointments"] });
			toast.success("Rescheduled");
			onClose();
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Reschedule failed")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "Reschedule appointment",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium",
					children: "Date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					className: inp
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium",
					children: "Time"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "time",
					value: time,
					onChange: (e) => setTime(e.target.value),
					className: inp
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => saveMutation.mutate(),
				disabled: saveMutation.isPending,
				className: "w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-60",
				children: "Save changes"
			})]
		})
	});
}
var inp = "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
function CrudTable({ title, description, data, columns, searchKeys, filters, onCreate, onEdit, onDelete, onView, extraActions, pageSize = 10 }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [filterValues, setFilterValues] = (0, import_react.useState)({});
	const [page, setPage] = (0, import_react.useState)(1);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const filtered = (0, import_react.useMemo)(() => {
		return data.filter((row) => {
			if (q) {
				const s = q.toLowerCase();
				if (!searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(s))) return false;
			}
			for (const f of filters ?? []) {
				const v = filterValues[f.key];
				if (v && v !== "all" && f.get(row) !== v) return false;
			}
			return true;
		});
	}, [
		data,
		q,
		filterValues,
		searchKeys,
		filters
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const exportCsv = () => {
		downloadCsv(filtered.map((r) => {
			const out = {};
			for (const c of columns) out[c.header] = c.accessor ? c.accessor(r) : r[c.key];
			return out;
		}), `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.csv`);
	};
	const handleDelete = async () => {
		if (!confirmDelete) return;
		try {
			await onDelete?.(confirmDelete);
			toast.success("Deleted");
			setConfirmDelete(null);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Delete failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title,
			description,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				extraActions,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: exportCsv,
					className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Export"]
				}),
				onCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onCreate,
					className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New"]
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(1);
						},
						placeholder: "Search…",
						className: "w-full pl-9 pr-3 py-2 rounded-xl border border-input bg-background text-sm"
					})]
				}), filters?.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: filterValues[f.key] ?? "all",
					onChange: (e) => {
						setFilterValues((v) => ({
							...v,
							[f.key]: e.target.value
						}));
						setPage(1);
					},
					className: "px-3 py-2 rounded-xl border border-input bg-background text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: "all",
						children: [f.label, ": All"]
					}), f.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: o,
						children: o
					}, o))]
				}, f.key))]
			}),
			paged.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing here yet",
				description: "Adjust filters or add a new entry."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-muted-foreground border-b border-border",
						children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium",
							children: c.header
						}, c.key)), (onEdit || onDelete || onView) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2 px-3 font-medium text-right",
							children: "Actions"
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: paged.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0 hover:bg-muted/40",
						children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3",
							children: c.render ? c.render(row) : String(row[c.key] ?? "")
						}, c.key)), (onEdit || onDelete || onView) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2.5 px-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex gap-1",
								children: [
									onView && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => onView(row),
										className: "px-2 py-1 rounded-lg hover:bg-accent text-xs",
										children: "View"
									}),
									onEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => onEdit(row),
										className: "p-1.5 rounded-lg hover:bg-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
									}),
									onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setConfirmDelete(row),
										className: "p-1.5 rounded-lg hover:bg-destructive/10 text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})
						})]
					}, row.id)) })]
				})
			}),
			totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mt-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-muted-foreground",
					children: [
						filtered.length,
						" results · Page ",
						currentPage,
						" of ",
						totalPages
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: currentPage === 1,
						className: "px-3 py-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-50",
						children: "Prev"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: currentPage === totalPages,
						className: "px-3 py-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-50",
						children: "Next"
					})]
				})]
			})
		] }),
		confirmDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 grid place-items-center p-4 bg-black/50",
			onClick: () => setConfirmDelete(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-lg",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: "Delete this item?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "This action cannot be undone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mt-5 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setConfirmDelete(null),
							className: "px-4 py-2 rounded-xl border border-border hover:bg-accent text-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleDelete,
							className: "px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium",
							children: "Delete"
						})]
					})
				]
			})
		})
	] });
}
function FormModal({ title, onClose, children, onSubmit, submitLabel = "Save" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center p-4 bg-black/50",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-lg max-h-[90vh] overflow-y-auto",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1.5 rounded-lg hover:bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 mt-6 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-2 rounded-xl border border-border hover:bg-accent text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onSubmit,
						className: "px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium",
						children: submitLabel
					})]
				})
			]
		})
	});
}
var inputCls = "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children, span = 1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: span === 2 ? "block sm:col-span-2" : "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: label
		}), children]
	});
}
var empty$5 = {
	id: "",
	fullName: "",
	gender: "male",
	dateOfBirth: "",
	bloodGroup: "",
	allergies: "",
	emergencyContact: "",
	address: "",
	email: "",
	phone: "",
	chronicDiseases: "",
	medicalNotes: "",
	insurance: "",
	createdAt: ""
};
function PatientsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["patients"];
	const { data: patients = [] } = useQuery({
		queryKey,
		queryFn: patientsRepo.list,
		enabled: !!user
	});
	useRealtimeInvalidate(["patients", "appointments"], [queryKey]);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(empty$5);
	const openNew = () => {
		setForm({
			...empty$5,
			id: crypto.randomUUID(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setEditing({ ...empty$5 });
	};
	const openEdit = (p) => {
		setForm(p);
		setEditing(p);
	};
	const close = () => setEditing(null);
	const saveMutation = useMutation({
		mutationFn: (p) => editing?.id ? patientsRepo.update(p.id, p) : patientsRepo.create(p),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Saved");
			close();
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => patientsRepo.remove(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});
	const save = () => {
		if (!form.fullName || !form.email) {
			toast.error("Name and email required");
			return;
		}
		saveMutation.mutate(form);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
		title: "Patients",
		description: "Full patient roster with medical information.",
		data: patients,
		searchKeys: [
			"fullName",
			"email",
			"phone",
			"bloodGroup"
		],
		filters: [{
			key: "gender",
			label: "Gender",
			options: [
				"male",
				"female",
				"other"
			],
			get: (r) => r.gender
		}, {
			key: "blood",
			label: "Blood",
			options: [
				"A+",
				"A-",
				"B+",
				"B-",
				"AB+",
				"AB-",
				"O+",
				"O-"
			],
			get: (r) => r.bloodGroup
		}],
		columns: [
			{
				key: "fullName",
				header: "Name",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.fullName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: r.email
				})] })
			},
			{
				key: "gender",
				header: "Gender",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "capitalize",
					children: r.gender
				})
			},
			{
				key: "dob",
				header: "DOB",
				render: (r) => formatDate(r.dateOfBirth)
			},
			{
				key: "blood",
				header: "Blood",
				render: (r) => r.bloodGroup,
				accessor: (r) => r.bloodGroup
			},
			{
				key: "phone",
				header: "Phone"
			}
		],
		onCreate: user?.role === "admin" ? openNew : void 0,
		onEdit: user?.role === "admin" || user?.role === "doctor" ? openEdit : void 0,
		onDelete: user?.role === "admin" ? async (r) => {
			await deleteMutation.mutateAsync(r.id);
		} : void 0
	}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormModal, {
		title: editing.id ? "Edit patient" : "New patient",
		onClose: close,
		onSubmit: save,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Full Name",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.fullName,
						onChange: (e) => setForm((f) => ({
							...f,
							fullName: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.email,
						onChange: (e) => setForm((f) => ({
							...f,
							email: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.phone,
						onChange: (e) => setForm((f) => ({
							...f,
							phone: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Gender",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.gender,
						onChange: (e) => setForm((f) => ({
							...f,
							gender: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "male",
								children: "Male"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "female",
								children: "Female"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "other",
								children: "Other"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date of Birth",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.dateOfBirth,
						onChange: (e) => setForm((f) => ({
							...f,
							dateOfBirth: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Blood Group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.bloodGroup,
						onChange: (e) => setForm((f) => ({
							...f,
							bloodGroup: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select…"
						}), [
							"A+",
							"A-",
							"B+",
							"B-",
							"AB+",
							"AB-",
							"O+",
							"O-"
						].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: b }, b))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Emergency Contact",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.emergencyContact,
						onChange: (e) => setForm((f) => ({
							...f,
							emergencyContact: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Address",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.address,
						onChange: (e) => setForm((f) => ({
							...f,
							address: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Allergies",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.allergies,
						onChange: (e) => setForm((f) => ({
							...f,
							allergies: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Chronic Diseases",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.chronicDiseases,
						onChange: (e) => setForm((f) => ({
							...f,
							chronicDiseases: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Insurance",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.insurance,
						onChange: (e) => setForm((f) => ({
							...f,
							insurance: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Medical Notes",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: form.medicalNotes,
						onChange: (e) => setForm((f) => ({
							...f,
							medicalNotes: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				})
			]
		})
	})] });
}
var empty$4 = {
	id: "",
	name: "",
	specialty: "",
	qualification: "",
	experience: 0,
	email: "",
	phone: "",
	availability: "Mon-Fri 9:00-17:00",
	consultationFee: 100,
	department: "General",
	status: "active",
	createdAt: ""
};
function DoctorsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["doctors"];
	const { data: doctors = [] } = useQuery({
		queryKey,
		queryFn: doctorsRepo.list,
		enabled: !!user
	});
	useRealtimeInvalidate(["doctors"], [queryKey]);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(empty$4);
	const openNew = () => {
		setForm({
			...empty$4,
			id: crypto.randomUUID(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setEditing({ ...empty$4 });
	};
	const openEdit = (d) => {
		setForm(d);
		setEditing(d);
	};
	const saveMutation = useMutation({
		mutationFn: (d) => editing?.id ? doctorsRepo.update(d.id, d) : doctorsRepo.create(d),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Saved");
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => doctorsRepo.remove(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});
	const save = () => {
		if (!form.name || !form.email) {
			toast.error("Name and email required");
			return;
		}
		saveMutation.mutate(form);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
		title: "Doctors",
		description: "Manage doctor profiles and availability.",
		data: doctors,
		searchKeys: [
			"name",
			"email",
			"specialty",
			"department"
		],
		filters: [{
			key: "specialty",
			label: "Specialty",
			options: Array.from(new Set(doctors.map((d) => d.specialty))).filter(Boolean),
			get: (r) => r.specialty
		}, {
			key: "status",
			label: "Status",
			options: ["active", "inactive"],
			get: (r) => r.status
		}],
		columns: [
			{
				key: "name",
				header: "Doctor",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: r.email
				})] })
			},
			{
				key: "specialty",
				header: "Specialty"
			},
			{
				key: "qualification",
				header: "Qualification"
			},
			{
				key: "experience",
				header: "Exp.",
				render: (r) => `${r.experience} yrs`,
				accessor: (r) => r.experience
			},
			{
				key: "fee",
				header: "Fee",
				render: (r) => formatCurrency(r.consultationFee),
				accessor: (r) => r.consultationFee
			},
			{
				key: "status",
				header: "Status",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
					status: r.status,
					className: statusColor(r.status)
				})
			}
		],
		onCreate: user?.role === "admin" ? openNew : void 0,
		onEdit: user?.role === "admin" ? openEdit : void 0,
		onDelete: user?.role === "admin" ? async (r) => {
			await deleteMutation.mutateAsync(r.id);
		} : void 0
	}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormModal, {
		title: editing.id ? "Edit doctor" : "New doctor",
		onClose: () => setEditing(null),
		onSubmit: save,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.name,
						onChange: (e) => setForm((f) => ({
							...f,
							name: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.email,
						onChange: (e) => setForm((f) => ({
							...f,
							email: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.phone,
						onChange: (e) => setForm((f) => ({
							...f,
							phone: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Specialty",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.specialty,
						onChange: (e) => setForm((f) => ({
							...f,
							specialty: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Qualification",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.qualification,
						onChange: (e) => setForm((f) => ({
							...f,
							qualification: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Experience (years)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.experience,
						onChange: (e) => setForm((f) => ({
							...f,
							experience: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Consultation Fee",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.consultationFee,
						onChange: (e) => setForm((f) => ({
							...f,
							consultationFee: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Department",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.department,
						onChange: (e) => setForm((f) => ({
							...f,
							department: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.status,
						onChange: (e) => setForm((f) => ({
							...f,
							status: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "active",
							children: "Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "inactive",
							children: "Inactive"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Availability",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.availability,
						onChange: (e) => setForm((f) => ({
							...f,
							availability: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				})
			]
		})
	})] });
}
var empty$3 = {
	id: "",
	name: "",
	email: "",
	password: "",
	role: "patient",
	status: "active",
	createdAt: ""
};
function UsersPage() {
	const queryClient = useQueryClient();
	const queryKey = ["profiles"];
	const { data: users = [] } = useQuery({
		queryKey,
		queryFn: profilesRepo.list
	});
	useRealtimeInvalidate(["profiles"], [queryKey]);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(empty$3);
	const openNew = () => {
		setForm({
			...empty$3,
			id: "",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setEditing({ ...empty$3 });
	};
	const openEdit = (u) => {
		setForm({
			...u,
			password: ""
		});
		setEditing(u);
	};
	const saveMutation = useMutation({
		mutationFn: async () => {
			if (editing?.id) return profilesRepo.update(editing.id, {
				name: form.name,
				email: form.email,
				phone: form.phone,
				department: form.department,
				role: form.role,
				status: form.status
			});
			const { data, error } = await supabaseAuthOnly.auth.signUp({
				email: form.email.trim(),
				password: form.password,
				options: { data: {
					name: form.name,
					role: form.role,
					phone: form.phone ?? ""
				} }
			});
			if (error) throw new Error(error.message);
			await supabaseAuthOnly.auth.signOut();
			if (!data.user) throw new Error("Account creation failed");
			await new Promise((r) => setTimeout(r, 500));
			return profilesRepo.update(data.user.id, {
				department: form.department,
				status: form.status
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Saved");
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => profilesRepo.remove(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});
	const save = () => {
		if (!form.name || !form.email) {
			toast.error("Name and email required");
			return;
		}
		if (!editing?.id && form.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		saveMutation.mutate();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
		title: "Users",
		description: "Manage all user accounts and roles.",
		data: users,
		searchKeys: [
			"name",
			"email",
			"phone",
			"department"
		],
		filters: [{
			key: "role",
			label: "Role",
			options: [
				"admin",
				"doctor",
				"patient"
			],
			get: (r) => r.role
		}, {
			key: "status",
			label: "Status",
			options: ["active", "inactive"],
			get: (r) => r.status
		}],
		columns: [
			{
				key: "name",
				header: "Name",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: r.email
				})] })
			},
			{
				key: "role",
				header: "Role",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "capitalize",
					children: r.role
				})
			},
			{
				key: "phone",
				header: "Phone"
			},
			{
				key: "department",
				header: "Department"
			},
			{
				key: "status",
				header: "Status",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
					status: r.status,
					className: statusColor(r.status)
				})
			}
		],
		onCreate: openNew,
		onEdit: openEdit,
		onDelete: async (r) => {
			await deleteMutation.mutateAsync(r.id);
		}
	}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormModal, {
		title: editing.id ? "Edit user" : "New user",
		onClose: () => setEditing(null),
		onSubmit: save,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.name,
						onChange: (e) => setForm((f) => ({
							...f,
							name: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.email,
						onChange: (e) => setForm((f) => ({
							...f,
							email: e.target.value
						})),
						disabled: !!editing.id,
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				!editing.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Password",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: form.password,
						onChange: (e) => setForm((f) => ({
							...f,
							password: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.phone ?? "",
						onChange: (e) => setForm((f) => ({
							...f,
							phone: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Department",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.department ?? "",
						onChange: (e) => setForm((f) => ({
							...f,
							department: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Role",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.role,
						onChange: (e) => setForm((f) => ({
							...f,
							role: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "admin",
								children: "Admin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "doctor",
								children: "Doctor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "patient",
								children: "Patient"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.status,
						onChange: (e) => setForm((f) => ({
							...f,
							status: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "active",
							children: "Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "inactive",
							children: "Inactive"
						})]
					})
				}),
				!editing.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "sm:col-span-2 text-xs text-muted-foreground",
					children: "Depending on the project's auth settings, the new user may need to confirm their email before they can sign in."
				})
			]
		})
	})] });
}
var empty$2 = {
	id: "",
	patientId: "",
	doctorId: "",
	date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	diagnosis: "",
	symptoms: "",
	bloodPressure: "",
	temperature: "",
	weight: "",
	height: "",
	notes: "",
	labRequests: ""
};
function RecordsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["medicalRecords", "withNames"];
	const { data: records = [] } = useQuery({
		queryKey,
		queryFn: medicalRecordsRepo.listWithNames,
		enabled: !!user
	});
	useRealtimeInvalidate(["medicalRecords"], [queryKey]);
	const { data: patients = [] } = useQuery({
		queryKey: ["patients"],
		queryFn: patientsRepo.list,
		enabled: !!user
	});
	const { data: doctors = [] } = useQuery({
		queryKey: ["doctors"],
		queryFn: doctorsRepo.list,
		enabled: !!user
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(empty$2);
	const openNew = async () => {
		const doc = user?.role === "doctor" ? await doctorsRepo.byUserId(user.id) : void 0;
		setForm({
			...empty$2,
			id: crypto.randomUUID(),
			doctorId: doc?.id ?? ""
		});
		setEditing({ ...empty$2 });
	};
	const saveMutation = useMutation({
		mutationFn: async (r) => {
			const saved = editing?.id ? await medicalRecordsRepo.update(r.id, r) : await medicalRecordsRepo.create(r);
			const patient = await patientsRepo.get(r.patientId);
			if (patient?.userId) await notify(patient.userId, "Medical record updated", `New entry: ${r.diagnosis}`, "info");
			return saved;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Saved");
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => medicalRecordsRepo.remove(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});
	const save = () => {
		if (!form.patientId || !form.doctorId || !form.diagnosis) {
			toast.error("Patient, doctor, and diagnosis required");
			return;
		}
		saveMutation.mutate(form);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
		title: "Medical Records",
		description: "Diagnoses, vitals, and clinical notes.",
		data: records,
		searchKeys: [
			"diagnosis",
			"symptoms",
			"patientName",
			"doctorName"
		],
		columns: [
			{
				key: "date",
				header: "Date",
				render: (r) => formatDate(r.date)
			},
			{
				key: "patient",
				header: "Patient",
				render: (r) => r.patientName
			},
			{
				key: "doctor",
				header: "Doctor",
				render: (r) => r.doctorName
			},
			{
				key: "diagnosis",
				header: "Diagnosis"
			},
			{
				key: "vitals",
				header: "Vitals",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						"BP ",
						r.bloodPressure,
						" · ",
						r.temperature
					]
				})
			}
		],
		onCreate: user?.role === "doctor" || user?.role === "admin" ? openNew : void 0,
		onEdit: user?.role === "doctor" || user?.role === "admin" ? (r) => {
			setForm(r);
			setEditing(r);
		} : void 0,
		onDelete: user?.role === "admin" ? async (r) => {
			await deleteMutation.mutateAsync(r.id);
		} : void 0
	}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormModal, {
		title: editing.id ? "Edit medical record" : "New medical record",
		onClose: () => setEditing(null),
		onSubmit: save,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Patient",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.patientId,
						onChange: (e) => setForm((f) => ({
							...f,
							patientId: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select…"
						}), patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.fullName
						}, p.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Doctor",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.doctorId,
						onChange: (e) => setForm((f) => ({
							...f,
							doctorId: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select…"
						}), doctors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.name
						}, d.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.date,
						onChange: (e) => setForm((f) => ({
							...f,
							date: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Diagnosis",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.diagnosis,
						onChange: (e) => setForm((f) => ({
							...f,
							diagnosis: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Symptoms",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						value: form.symptoms,
						onChange: (e) => setForm((f) => ({
							...f,
							symptoms: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Blood Pressure",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.bloodPressure,
						onChange: (e) => setForm((f) => ({
							...f,
							bloodPressure: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Temperature",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.temperature,
						onChange: (e) => setForm((f) => ({
							...f,
							temperature: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Weight",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.weight,
						onChange: (e) => setForm((f) => ({
							...f,
							weight: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Height",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.height,
						onChange: (e) => setForm((f) => ({
							...f,
							height: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Lab Requests",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.labRequests,
						onChange: (e) => setForm((f) => ({
							...f,
							labRequests: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Notes",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: form.notes,
						onChange: (e) => setForm((f) => ({
							...f,
							notes: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				})
			]
		})
	})] });
}
var empty$1 = {
	id: "",
	patientId: "",
	doctorId: "",
	date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	medicine: "",
	dosage: "",
	frequency: "",
	duration: "",
	instructions: ""
};
function PrescriptionsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["prescriptions", "withNames"];
	const { data: rows = [] } = useQuery({
		queryKey,
		queryFn: prescriptionsRepo.listWithNames,
		enabled: !!user
	});
	useRealtimeInvalidate(["prescriptions"], [queryKey]);
	const { data: patients = [] } = useQuery({
		queryKey: ["patients"],
		queryFn: patientsRepo.list,
		enabled: !!user
	});
	const { data: doctors = [] } = useQuery({
		queryKey: ["doctors"],
		queryFn: doctorsRepo.list,
		enabled: !!user
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(empty$1);
	const openNew = async () => {
		const doc = user?.role === "doctor" ? await doctorsRepo.byUserId(user.id) : void 0;
		setForm({
			...empty$1,
			id: crypto.randomUUID(),
			doctorId: doc?.id ?? ""
		});
		setEditing({ ...empty$1 });
	};
	const saveMutation = useMutation({
		mutationFn: async (r) => {
			const saved = editing?.id ? await prescriptionsRepo.update(r.id, r) : await prescriptionsRepo.create(r);
			const patient = await patientsRepo.get(r.patientId);
			if (patient?.userId) await notify(patient.userId, "New prescription", `${r.medicine} — ${r.dosage}`, "success");
			return saved;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Saved");
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => prescriptionsRepo.remove(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});
	const save = () => {
		if (!form.patientId || !form.doctorId || !form.medicine) {
			toast.error("Patient, doctor, medicine required");
			return;
		}
		saveMutation.mutate(form);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
		title: "Prescriptions",
		description: "Medications prescribed to patients.",
		data: rows,
		searchKeys: [
			"medicine",
			"patientName",
			"doctorName"
		],
		columns: [
			{
				key: "date",
				header: "Date",
				render: (r) => formatDate(r.date)
			},
			{
				key: "patient",
				header: "Patient",
				render: (r) => r.patientName
			},
			{
				key: "doctor",
				header: "Doctor",
				render: (r) => r.doctorName
			},
			{
				key: "medicine",
				header: "Medicine",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.medicine
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						r.dosage,
						" · ",
						r.frequency
					]
				})] })
			},
			{
				key: "duration",
				header: "Duration"
			}
		],
		onCreate: user?.role === "doctor" || user?.role === "admin" ? openNew : void 0,
		onEdit: user?.role === "doctor" || user?.role === "admin" ? (r) => {
			setForm(r);
			setEditing(r);
		} : void 0,
		onDelete: user?.role === "admin" ? async (r) => {
			await deleteMutation.mutateAsync(r.id);
		} : void 0
	}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormModal, {
		title: editing.id ? "Edit prescription" : "New prescription",
		onClose: () => setEditing(null),
		onSubmit: save,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Patient",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.patientId,
						onChange: (e) => setForm((f) => ({
							...f,
							patientId: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select…"
						}), patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.fullName
						}, p.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Doctor",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.doctorId,
						onChange: (e) => setForm((f) => ({
							...f,
							doctorId: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select…"
						}), doctors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d.id,
							children: d.name
						}, d.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.date,
						onChange: (e) => setForm((f) => ({
							...f,
							date: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Medicine",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.medicine,
						onChange: (e) => setForm((f) => ({
							...f,
							medicine: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Dosage",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.dosage,
						onChange: (e) => setForm((f) => ({
							...f,
							dosage: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Frequency",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.frequency,
						onChange: (e) => setForm((f) => ({
							...f,
							frequency: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Duration",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.duration,
						onChange: (e) => setForm((f) => ({
							...f,
							duration: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Instructions",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						value: form.instructions,
						onChange: (e) => setForm((f) => ({
							...f,
							instructions: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				})
			]
		})
	})] });
}
var empty = {
	id: "",
	number: "",
	patientId: "",
	consultationFee: 0,
	labFee: 0,
	medicationFee: 0,
	otherCharges: 0,
	discount: 0,
	tax: 0,
	total: 0,
	status: "pending",
	date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
	dueDate: new Date(Date.now() + 15 * 864e5).toISOString().slice(0, 10)
};
function computeTotal(b) {
	const taxable = b.consultationFee + b.labFee + b.medicationFee + b.otherCharges - b.discount;
	return Math.round((taxable + b.tax) * 100) / 100;
}
function BillingPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const queryKey = ["bills", "withNames"];
	const { data: rows = [] } = useQuery({
		queryKey,
		queryFn: billsRepo.listWithNames,
		enabled: !!user
	});
	useRealtimeInvalidate(["bills"], [queryKey]);
	const { data: patients = [] } = useQuery({
		queryKey: ["patients"],
		queryFn: patientsRepo.list,
		enabled: user?.role === "admin"
	});
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(empty);
	const openNew = async () => {
		const count = await billsRepo.count();
		setForm({
			...empty,
			id: crypto.randomUUID(),
			number: `INV-${String(count + 1).padStart(5, "0")}`
		});
		setEditing({ ...empty });
	};
	const saveMutation = useMutation({
		mutationFn: async (b) => {
			const withTotal = {
				...b,
				total: computeTotal(b)
			};
			const saved = editing?.id ? await billsRepo.update(b.id, withTotal) : await billsRepo.create(withTotal);
			const patient = await patientsRepo.get(withTotal.patientId);
			if (patient?.userId && withTotal.status !== "paid") await notify(patient.userId, "Payment due", `${withTotal.number}: ${formatCurrency(withTotal.total)}`, "warning");
			return saved;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
			toast.success("Saved");
			setEditing(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed")
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => billsRepo.remove(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey })
	});
	const save = () => {
		if (!form.patientId) {
			toast.error("Patient required");
			return;
		}
		saveMutation.mutate(form);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrudTable, {
		title: "Billing",
		description: "Invoices, payments, and outstanding balances.",
		data: rows,
		searchKeys: ["number", "patientName"],
		filters: [{
			key: "status",
			label: "Status",
			options: [
				"paid",
				"pending",
				"overdue"
			],
			get: (r) => r.status
		}],
		columns: [
			{
				key: "number",
				header: "Invoice",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: r.number
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: formatDate(r.date)
				})] })
			},
			{
				key: "patient",
				header: "Patient",
				render: (r) => r.patientName
			},
			{
				key: "total",
				header: "Total",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: formatCurrency(r.total)
				}),
				accessor: (r) => r.total
			},
			{
				key: "dueDate",
				header: "Due",
				render: (r) => formatDate(r.dueDate)
			},
			{
				key: "status",
				header: "Status",
				render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
					status: r.status,
					className: statusColor(r.status)
				})
			}
		],
		onCreate: user?.role === "admin" ? openNew : void 0,
		onEdit: user?.role === "admin" ? (r) => {
			setForm(r);
			setEditing(r);
		} : void 0,
		onDelete: user?.role === "admin" ? async (r) => {
			await deleteMutation.mutateAsync(r.id);
		} : void 0
	}), editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormModal, {
		title: editing.id ? "Edit invoice" : "New invoice",
		onClose: () => setEditing(null),
		onSubmit: save,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Invoice #",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.number,
						onChange: (e) => setForm((f) => ({
							...f,
							number: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Patient",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.patientId,
						onChange: (e) => setForm((f) => ({
							...f,
							patientId: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Select…"
						}), patients.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.fullName
						}, p.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Consultation Fee",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.consultationFee,
						onChange: (e) => setForm((f) => ({
							...f,
							consultationFee: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Lab Fee",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.labFee,
						onChange: (e) => setForm((f) => ({
							...f,
							labFee: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Medication Fee",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.medicationFee,
						onChange: (e) => setForm((f) => ({
							...f,
							medicationFee: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Other Charges",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.otherCharges,
						onChange: (e) => setForm((f) => ({
							...f,
							otherCharges: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Discount",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.discount,
						onChange: (e) => setForm((f) => ({
							...f,
							discount: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tax",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						value: form.tax,
						onChange: (e) => setForm((f) => ({
							...f,
							tax: Number(e.target.value)
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.date,
						onChange: (e) => setForm((f) => ({
							...f,
							date: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Due Date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: form.dueDate,
						onChange: (e) => setForm((f) => ({
							...f,
							dueDate: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Status",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.status,
						onChange: (e) => setForm((f) => ({
							...f,
							status: e.target.value
						})),
						className: "mt-1.5 w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pending",
								children: "Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "paid",
								children: "Paid"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "overdue",
								children: "Overdue"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2 rounded-xl bg-muted/40 border border-border p-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "Computed total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-semibold",
						children: formatCurrency(computeTotal(form))
					})]
				})
			]
		})
	})] });
}
function ReportsPage() {
	const queryKey = ["reports"];
	const { data } = useQuery({
		queryKey,
		queryFn: async () => {
			const [appts, patients, doctors, bills, records] = await Promise.all([
				appointmentsRepo.list(),
				patientsRepo.list(),
				doctorsRepo.list(),
				billsRepo.list(),
				medicalRecordsRepo.list()
			]);
			const revenue = bills.filter((b) => b.status === "paid").reduce((s, b) => s + b.total, 0);
			const outstanding = bills.filter((b) => b.status !== "paid").reduce((s, b) => s + b.total, 0);
			const byDoctor = {};
			appts.forEach((a) => {
				byDoctor[a.doctorId] = (byDoctor[a.doctorId] ?? 0) + 1;
			});
			const doctorProd = doctors.map((d) => ({
				name: d.name.replace("Dr. ", ""),
				appointments: byDoctor[d.id] ?? 0
			})).sort((a, b) => b.appointments - a.appointments).slice(0, 8);
			const regByMonth = {};
			patients.forEach((p) => {
				const k = p.createdAt.slice(0, 7);
				regByMonth[k] = (regByMonth[k] ?? 0) + 1;
			});
			return {
				appts,
				patients,
				doctors,
				bills,
				records,
				revenue,
				outstanding,
				doctorProd,
				regArr: Object.entries(regByMonth).sort().slice(-6).map(([k, v]) => ({
					month: k,
					patients: v
				}))
			};
		}
	});
	useRealtimeInvalidate([
		"appointments",
		"patients",
		"doctors",
		"bills",
		"medicalRecords"
	], [queryKey]);
	if (!data) return null;
	const print = () => window.print();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Reports",
			description: "Insights across appointments, patients, revenue and more.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: print,
				className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" }), "Print"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Appointments",
					value: data.appts.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Patients",
					value: data.patients.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Doctors",
					value: data.doctors.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Medical Records",
					value: data.records.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Total Revenue",
					value: formatCurrency(data.revenue)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Outstanding",
					value: formatCurrency(data.outstanding)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Invoices",
					value: data.bills.length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStat, {
					label: "Paid rate",
					value: data.bills.length ? `${Math.round(data.bills.filter((b) => b.status === "paid").length / data.bills.length * 100)}%` : "—"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Doctor productivity",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportBtn, { onClick: () => downloadCsv(data.doctorProd, `doctor-productivity-${Date.now()}.csv`) }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: data.doctorProd,
						layout: "vertical",
						margin: { left: 30 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--color-border)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "category",
								dataKey: "name",
								width: 120,
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "appointments",
								fill: "var(--color-chart-1)",
								radius: [
									0,
									8,
									8,
									0
								]
							})
						]
					}) })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Patient registrations",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportBtn, { onClick: () => downloadCsv(data.regArr, `registrations-${Date.now()}.csv`) }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: data.regArr,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "var(--color-border)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								stroke: "var(--color-muted-foreground)",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "patients",
								fill: "var(--color-chart-2)",
								radius: [
									8,
									8,
									0,
									0
								]
							})
						]
					}) })
				})
			})]
		})
	] });
}
function MiniStat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-2xl font-semibold mt-1",
			children: value
		})]
	});
}
function ExportBtn({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "inline-flex items-center gap-1.5 text-sm text-primary hover:underline",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "CSV"]
	});
}
function NotificationsPage() {
	const { user } = useAuth();
	const { notifications, unread } = useNotifications();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications",
		description: `${unread} unread`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => user && markAllRead(user.id),
			className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-4 w-4" }), "Mark all read"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, { children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "You're all caught up",
		description: "You have no notifications."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divide-y divide-border",
		children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex gap-3 py-3 ${!n.read ? "bg-primary/5 -mx-2 px-2 rounded-xl" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-9 w-9 rounded-xl bg-accent grid place-items-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-accent-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: n.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground shrink-0",
							children: formatDateTime(n.date)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground mt-0.5",
						children: n.message
					})]
				}),
				!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => markRead(n.id),
					className: "text-xs text-primary hover:underline shrink-0",
					children: "Mark read"
				})
			]
		}, n.id))
	}) })] });
}
function SettingsPage() {
	const [form, setForm] = (0, import_react.useState)({
		clinicName: "",
		currency: "USD",
		businessHours: "",
		language: "en"
	});
	(0, import_react.useEffect)(() => {
		(async () => {
			const rows = await settingsRepo.list();
			const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
			setForm((f) => ({
				...f,
				...map
			}));
		})();
	}, []);
	const save = async () => {
		try {
			await settingsRepo.bulkPut(Object.entries(form).map(([key, value]) => ({
				key,
				value
			})));
			toast.success("Settings saved");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Save failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Settings",
		description: "Clinic-wide preferences and configuration."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Clinic profile",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Clinic Name",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.clinicName,
						onChange: (e) => setForm((f) => ({
							...f,
							clinicName: e.target.value
						})),
						className: inputCls
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Currency",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: form.currency,
						onChange: (e) => setForm((f) => ({
							...f,
							currency: e.target.value
						})),
						className: inputCls,
						children: [
							"USD",
							"EUR",
							"GBP",
							"AED",
							"INR"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Language",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.language,
						onChange: (e) => setForm((f) => ({
							...f,
							language: e.target.value
						})),
						className: inputCls,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "en",
								children: "English"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "es",
								children: "Spanish"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fr",
								children: "French"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Business Hours",
					span: 2,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: form.businessHours,
						onChange: (e) => setForm((f) => ({
							...f,
							businessHours: e.target.value
						})),
						className: inputCls
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end mt-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: save,
				className: "px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium",
				children: "Save changes"
			})
		})]
	})] });
}
function UnauthorizedPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-5xl",
					children: "🔒"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-2xl font-semibold",
					children: "Access denied"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "You don't have permission to view this page."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-block mt-6 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium",
					children: "Go to dashboard"
				})
			]
		})
	});
}
function ClinicApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BrowserRouter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		richColors: true,
		position: "top-right"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Routes, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
			path: "/login",
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginPage, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
			path: "/register",
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterPage, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
			path: "/unauthorized",
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnauthorizedPage, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteGuard, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Route, {
				element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLayout, {}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						path: "/",
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardRouter, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						path: "/appointments",
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppointmentsPage, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteGuard, { allowedRoles: ["admin", "doctor"] }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/patients",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientsPage, {})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteGuard, { allowedRoles: ["admin", "patient"] }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/doctors",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorsPage, {})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Route, {
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteGuard, { allowedRoles: ["admin"] }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
								path: "/users",
								element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPage, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
								path: "/reports",
								element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsPage, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
								path: "/settings",
								element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPage, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						path: "/records",
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordsPage, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						path: "/prescriptions",
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrescriptionsPage, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteGuard, { allowedRoles: ["admin", "patient"] }),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
							path: "/billing",
							element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingPage, {})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						path: "/notifications",
						element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsPage, {})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
			path: "*",
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
				to: "/",
				replace: true
			})
		})
	] })] }) }) });
}
//#endregion
export { ClinicApp as default };
