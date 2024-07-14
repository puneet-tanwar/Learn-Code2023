import { runQuery } from "../database";
import { DiscardedFeedback } from "../types/discardedFeedback";
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

  async discardMenuItem(item: MenuItem): Promise<void> {
    const updateQuery = "UPDATE menu SET availability_status = 0 WHERE id = ?";
    await runQuery(updateQuery, [item.id]);

    const insertQuery = "INSERT INTO discarded_items (item_name) VALUES (?)";
    await runQuery(insertQuery, [item.name]);

    await this.notificationService.addNotification(
      `${item.name} is discarded from the menu`,
      `${item.name} has been discarded from the menu, please provide feedback for discarded item`
    );
  }

  async getFeedbackForDiscardedItem(itemId: String): Promise<DiscardedFeedback[]> {
    console.log({itemId})
    const query = `
      SELECT  dislikedAspect, preferredTaste, momsRecipe
      FROM discarded_item_feedback
      WHERE discardedItemId = ?
    `;
    const result = await runQuery(query, [itemId]);
    console.log({result})
    return result;
  }
}
