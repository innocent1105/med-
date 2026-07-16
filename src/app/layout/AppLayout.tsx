import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, Stethoscope, FileText, Pill,
  Receipt, BarChart3, Bell, Settings, LogOut, Moon, Sun, Menu, X, Search,
  UserCog,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import { useNotifications } from "../hooks/useNotifications";
import { initials } from "../lib/format";
import type { Role } from "../db/types";
import { cn } from "@/lib/utils";

interface NavItem { to: string; label: string; icon: React.ComponentType<{ className?: string }>; roles: Role[]; }

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "doctor", "patient"] },
  { to: "/appointments", label: "Appointments", icon: Calendar, roles: ["admin", "doctor", "patient"] },
  { to: "/patients", label: "Patients", icon: Users, roles: ["admin", "doctor"] },
  { to: "/doctors", label: "Doctors", icon: Stethoscope, roles: ["admin", "patient"] },
  { to: "/users", label: "Users", icon: UserCog, roles: ["admin"] },
  { to: "/records", label: "Medical Records", icon: FileText, roles: ["admin", "doctor", "patient"] },
  { to: "/prescriptions", label: "Prescriptions", icon: Pill, roles: ["admin", "doctor", "patient"] },
  { to: "/billing", label: "Billing", icon: Receipt, roles: ["admin", "patient"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
  { to: "/notifications", label: "Notifications", icon: Bell, roles: ["admin", "doctor", "patient"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

const SIDEBAR_KEY = "medicore.sidebar";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { unread } = useNotifications();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === "1");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0"); }, [collapsed]);

  if (!user) return null;

  const items = NAV.filter(n => n.roles.includes(user.role));

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-card">
        <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-accent"><Menu className="h-5 w-5" /></button>
        <div className="font-semibold tracking-tight">MediCore</div>
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-accent">{theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 h-screen z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
            collapsed ? "lg:w-20" : "lg:w-64",
            mobileOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">M</div>
              {!collapsed && <div className="font-semibold tracking-tight">MediCore</div>}
            </div>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent"><X className="h-4 w-4" /></button>
          </div>

          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.to === "/notifications" && unread > 0 && (
                  <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">{unread}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground grid place-items-center text-sm font-semibold shrink-0">{initials(user.name)}</div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{user.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="mt-2 w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl hover:bg-sidebar-accent text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        </aside>

        {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />}

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* Desktop top bar */}
          <header className="hidden lg:flex sticky top-0 z-30 items-center justify-between gap-4 px-6 h-16 border-b border-border bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <button onClick={() => setCollapsed(c => !c)} className="p-2 rounded-lg hover:bg-accent"><Menu className="h-4 w-4" /></button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input placeholder="Search patients, doctors, appointments…" className="w-full pl-9 pr-3 py-2 bg-muted rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-accent" aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <NavLink to="/notifications" className="relative p-2 rounded-lg hover:bg-accent">
                <Bell className="h-4 w-4" />
                {unread > 0 && <span className="absolute top-1 right-1 min-w-4 h-4 px-1 text-[10px] leading-4 text-primary-foreground bg-primary rounded-full text-center">{unread}</span>}
              </NavLink>
            </div>
          </header>

          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 p-4 md:p-6 lg:p-8"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}
