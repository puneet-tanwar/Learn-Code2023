import { runQuery } from "../database";
import { MenuItem } from "../types/menuItem";
import { ProposedMenuItem } from "../types/proposedMenuItem";
import { NotificationService } from "./notificationService";

export class ChefService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService(); // Initialize NotificationService instance
  }

  async proposeMenuItems(menuItemIds: number[]): Promise<void> {
    const deleteQuery = "DELETE FROM proposedMenu";
    await runQuery(deleteQuery, []);

    const proposedItems: ProposedMenuItem[] = menuItemIds.map((menuItemId) => ({
      menuItemId,
      votes: [],
    }));
    const values = proposedItems.map((item) => [
      item.menuItemId,
      JSON.stringify(item.votes),
    ]);

    const query = "INSERT INTO proposedMenu (menuItemId, votes) VALUES ?";
    await runQuery(query, [values]);
    await this.notificationService.addNotification(
        "Menu proposed for next day",
        "Chef has proposed new menu items, check it out and vote for your favouraite"
      );
  }
}
