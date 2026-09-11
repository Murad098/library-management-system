import api from "./api";

export const getNotifications = () => api.get("/notifications");

export const addNotification = (notification) =>
  api.post("/notifications/add", notification);

export const markNotificationRead = (id, read = true) =>
  api.patch(`/notifications/${id}/read`, { read });

export const markAllNotificationsRead = () =>
  api.post("/notifications/read-all");

export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
