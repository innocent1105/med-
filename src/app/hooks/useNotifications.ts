import { useQuery } from "@tanstack/react-query";
import { notificationsRepo } from "../db/repo";
import { useAuth } from "../auth/AuthContext";
import { useRealtimeInvalidate } from "./useRealtimeInvalidate";
import type { Notification } from "../db/types";

export function useNotifications() {
  const { user } = useAuth();
  const queryKey = ["notifications", user?.id ?? "anon"];
  const { data } = useQuery({
    queryKey,
    queryFn: () => notificationsRepo.listByUser(user!.id),
    enabled: !!user,
  });
  useRealtimeInvalidate(["notifications"], [queryKey]);
  const notifications = data ?? [];
  const unread = notifications.filter((n) => !n.read).length;
  return { notifications, unread };
}

export async function notify(userId: string, title: string, message: string, type: Notification["type"] = "info") {
  await notificationsRepo.create(userId, title, message, type);
}

export async function markRead(id: string) {
  await notificationsRepo.markRead(id);
}

export async function markAllRead(userId: string) {
  await notificationsRepo.markAllRead(userId);
}
