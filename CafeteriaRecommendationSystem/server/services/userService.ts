import { runQuery } from "../database";
import { User } from "../types/user";
import { MenuItem } from "../types/menuItem";
import { DiscardedFeedback } from "../types/discardedFeedback";
import { UserPreferences } from "../types/userPreferences";

export class UserService {
  async createUser(user: User) {
    const query = "INSERT INTO users SET ?";
    const result = await runQuery(query, user);
    return result;
  }

  async getUserByEmail(email: String) {
    const query = "SELECT * FROM users WHERE email = ?";
    const rows = await runQuery(query, [email]);
    return rows[0];
  }

  async getMenuItems() {
    const query = "SELECT * FROM menu";
    const rows = await runQuery(query, []);
    // console.log(rows)
    return rows as MenuItem[];
  }

  async getProposedMenuItems(): Promise<any[]> {
    const query = `
      SELECT pm.menuItemId, mi.name, pm.votes
      FROM proposedMenu pm
      JOIN menu mi ON pm.menuItemId = mi.id
    `;
    const proposedMenuItems = await runQuery(query, []);
    return proposedMenuItems.map((item: any) => ({
      menuItemId: item.menuItemId,
      name: item.name,
      votes: item.votes.length || 0,
    }));
  }

  async voteForMenuItem(menuItemId: number, employeeId: number): Promise<void> {
    const query = `
      UPDATE proposedMenu
      SET votes = JSON_ARRAY_APPEND(votes, '$', ?)
      WHERE menuItemId = ?;
    `;
    await runQuery(query, [employeeId, menuItemId]);
  }
  async getLatestDiscardedItem(): Promise<MenuItem | null> {
    const query = `
      SELECT * FROM discarded_items
      ORDER BY discardedDate DESC
      LIMIT 1
    `;
    const rows = await runQuery(query, []);
    return rows.length > 0 ? rows[0] : null;
  }
  async addFeedbackForDiscardedItem(
    discardedItemFeedback: DiscardedFeedback
  ): Promise<void> {
    const { discardedItemId, dislikedAspect, preferredTaste, momsRecipe } =
      discardedItemFeedback;
    const query = `
      INSERT INTO discarded_item_feedback (discardedItemId,  dislikedAspect, preferredTaste, momsRecipe)
      VALUES (?, ?, ?, ?)
    `;
    try {
      await runQuery(query, [
        discardedItemId,
        dislikedAspect,
        preferredTaste,
        momsRecipe,
      ]);
      console.log("Feedback for discarded item added successfully.");
    } catch (error) {
      console.error("Error adding feedback for discarded item:", error);
      throw error;
    }
  }

  async updateUserPreferences(preferences: UserPreferences): Promise<void> {
    const {
      userId,
      isEggetarian,
      isVeg,
      spiceLevel,
      cuisinePreference,
      hasSweetTooth,
    } = preferences;

    const query = `
      INSERT INTO usertastepreferences (userId, isEggetarian, isVeg, spiceLevel, cuisinePreference, hasSweetTooth)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      isEggetarian = VALUES(isEggetarian),
      isVeg = VALUES(isVeg),
      spiceLevel = VALUES(spiceLevel),
      cuisinePreference = VALUES(cuisinePreference),
      hasSweetTooth = VALUES(hasSweetTooth)
    `;
    await runQuery(query, [
      userId,
      isEggetarian,
      isVeg,
      spiceLevel,
      cuisinePreference,
      hasSweetTooth,
    ]);
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | null> {
    const query = `
      SELECT isEggetarian, isVeg, spiceLevel, cuisinePreference, hasSweetTooth
      FROM usertastepreferences
      WHERE userId = ?
    `;
    const rows = await runQuery(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  }
}
