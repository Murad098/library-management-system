import api from "./api";
import { NotificationItem, NotificationsResponse } from "../types";
import { AxiosResponse } from "axios";

export const getNotifications = (): Promise<
  AxiosResponse<NotificationsResponse>
> => api.get("/notifications");

export const addNotification = (
  notification: { title: string; message?: string; type?: string }
): Promise<AxiosResponse<NotificationItem>> =>
  api.post("/notifications/add", notification);

export const markNotificationRead = (id: string, read = true) =>
  api.patch(`/notifications/${id}/read`, { read });

export const markAllNotificationsRead = () =>
  api.post("/notifications/read-all");

export const deleteNotification = (id: string) =>
  api.delete(`/notifications/${id}`);
