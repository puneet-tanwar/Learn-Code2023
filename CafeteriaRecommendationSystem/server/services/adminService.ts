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
    await runQuery(query, newItem);
    await this.notificationService.addNotification(
      "New Menu Item Added",
      `A new menu item '${newItem.name}' has been added to the menu.`
    );
  }

  public async updateMenuItem(updatedItem: MenuItem): Promise<void> {
    const query = "UPDATE menu SET name = ?, description = ?, price = ?, availability_status = ? WHERE id = ?";
    const values = [
      updatedItem.name,
      updatedItem.description,
      updatedItem.price,
      updatedItem.availability_status,
      updatedItem.id
    ];
    await runQuery(query, values);
  }

  public async deleteMenuItem(id: string): Promise<void> {
    const query = "DELETE FROM menu WHERE id = ?";
    await runQuery(query, [id]);
  }

}
