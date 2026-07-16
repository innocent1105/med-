import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const ClinicApp = lazy(() => import("../app/ClinicApp"));

function SpaHost() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ClinicApp />
    </Suspense>
  );
}

export const Route = createFileRoute("/$")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "MediCore — Clinic Management" },
      { name: "description", content: "Modern clinic appointment and patient management system." },
      { property: "og:title", content: "MediCore — Clinic Management" },
      { property: "og:description", content: "Appointments, records, prescriptions, and billing in one polished workspace." },
    ],
  }),
  component: SpaHost,
});
