import { runQuery } from "../database";
import { Notification } from "../types/notification";

export class NotificationService {
  async addNotification(title: string, description: string): Promise<void> {
    const query =
      "INSERT INTO notifications (title, description) VALUES (?, ?)";
    await runQuery(query, [title, description]);
  }

  async getNotifications(): Promise<Notification[]> {
    const query = "SELECT * FROM notifications ORDER BY date DESC";
    const notifications = await runQuery(query, []);
    return notifications as Notification[];
  }

  async markAsRead(notificationId: number): Promise<void> {
    const query = "UPDATE notifications SET isRead = TRUE WHERE id = ?";
    await runQuery(query, [notificationId]);
  }
}
