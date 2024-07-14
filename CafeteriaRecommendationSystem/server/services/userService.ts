import { runQuery } from "../database";
import { User } from "../types/user";
import { MenuItem } from "../types/menuItem";
import { DiscardedFeedback } from "../types/discardedFeedback";

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
}

// function parseVotes(votes: Array<number>): number {
//   try {
//     if(!votes.length) return 0;
//     console.log(votes);
//     const parsedVotes = JSON.parse(votes);
//     if (Array.isArray(parsedVotes) && parsedVotes.every((v: any) => typeof v === 'number')) {
//       return parsedVotes;
//     } else {
//       return [];
//     }
//   } catch (error) {
//     console.error("Error parsing votes:", error);
//     return [];
//   }
// }
