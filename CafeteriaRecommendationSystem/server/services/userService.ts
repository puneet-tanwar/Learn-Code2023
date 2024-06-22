import { runQuery } from "../database";
import { User } from "../types/user";
import { MenuItem } from "../types/menuItem";

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
    const query = "SELECT * FROM menuItems";
    const rows = await runQuery(query, []);
    console.log(rows)
    return rows as MenuItem[];
  }

  async getProposedMenuItems(): Promise<any[]> {
    const query = `
      SELECT pm.menuItemId, mi.name, pm.votes
      FROM proposedMenu pm
      JOIN menuItems mi ON pm.menuItemId = mi.id
    `;
    const proposedMenuItems = await runQuery(query, []);
    console.log({proposedMenuItems})
    return proposedMenuItems.map((item: any) => ({
      menuItemId: item.menuItemId,
      name: item.name,
      votes: (item.votes.length) || 0, // Parse votes or handle empty case
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