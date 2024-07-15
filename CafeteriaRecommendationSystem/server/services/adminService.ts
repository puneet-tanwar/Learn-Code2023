import { runQuery } from "../database";
import { MenuItem } from "../types/menuItem";
import { NotificationService } from "./notificationService";

export class AdminService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public async addMenuItem(newItem: MenuItem): Promise<void> {
    const query = "INSERT INTO menu SET ?";
    try {
      await runQuery(query, newItem);
      await this.notificationService.addNotification(
        "New Menu Item Added",
        `A new menu item '${newItem.name}' has been added to the menu.`
      );
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }

  public async updateMenuItem(updatedItem: MenuItem): Promise<void> {
    const query =
      "UPDATE menu SET name = ?, description = ?, price = ?, availability_status = ? WHERE id = ?";
    const values = [
      updatedItem.name,
      updatedItem.description,
      updatedItem.price,
      updatedItem.availability_status,
      updatedItem.id,
    ];
    try {
      await runQuery(query, values);
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }

  public async deleteMenuItem(id: string): Promise<void> {
    const query = "DELETE FROM menu WHERE id = ?";
    try {
      await runQuery(query, [id]);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }
}
