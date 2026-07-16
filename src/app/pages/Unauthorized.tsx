import { Link } from "react-router-dom";
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">You don't have permission to view this page.</p>
        <Link to="/" className="inline-block mt-6 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">Go to dashboard</Link>
      </div>
    </div>
  );
}
