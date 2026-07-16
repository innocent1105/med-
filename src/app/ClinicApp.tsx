import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";
import { RouteGuard } from "./auth/RouteGuard";
import AppLayout from "./layout/AppLayout";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import DashboardRouter from "./pages/Dashboard";
import AppointmentsPage from "./pages/Appointments";
import PatientsPage from "./pages/Patients";
import DoctorsPage from "./pages/Doctors";
import UsersPage from "./pages/Users";
import RecordsPage from "./pages/Records";
import PrescriptionsPage from "./pages/Prescriptions";
import BillingPage from "./pages/Billing";
import ReportsPage from "./pages/Reports";
import NotificationsPage from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
import UnauthorizedPage from "./pages/Unauthorized";

export default function ClinicApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster richColors position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route element={<RouteGuard />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<DashboardRouter />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route element={<RouteGuard allowedRoles={["admin", "doctor"]} />}>
                  <Route path="/patients" element={<PatientsPage />} />
                </Route>
                <Route element={<RouteGuard allowedRoles={["admin", "patient"]} />}>
                  <Route path="/doctors" element={<DoctorsPage />} />
                </Route>
                <Route element={<RouteGuard allowedRoles={["admin"]} />}>
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                <Route path="/records" element={<RecordsPage />} />
                <Route path="/prescriptions" element={<PrescriptionsPage />} />
                <Route element={<RouteGuard allowedRoles={["admin", "patient"]} />}>
                  <Route path="/billing" element={<BillingPage />} />
                </Route>
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
