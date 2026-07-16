import { PageHeader, Section, EmptyState } from "../components/PageParts";
import { useNotifications, markRead, markAllRead } from "../hooks/useNotifications";
import { useAuth } from "../auth/AuthContext";
import { formatDateTime } from "../lib/format";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, unread } = useNotifications();

  return (
    <>
      <PageHeader title="Notifications" description={`${unread} unread`}
        actions={<button onClick={() => user && markAllRead(user.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-sm"><CheckCheck className="h-4 w-4" />Mark all read</button>}
      />
      <Section>
        {notifications.length === 0 ? (
          <EmptyState title="You're all caught up" description="You have no notifications." />
        ) : (
          <div className="divide-y divide-border">
            {notifications.map(n => (
              <div key={n.id} className={`flex gap-3 py-3 ${!n.read ? "bg-primary/5 -mx-2 px-2 rounded-xl" : ""}`}>
                <div className="h-9 w-9 rounded-xl bg-accent grid place-items-center shrink-0"><Bell className="h-4 w-4 text-accent-foreground" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground shrink-0">{formatDateTime(n.date)}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{n.message}</div>
                </div>
                {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-primary hover:underline shrink-0">Mark read</button>}
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
