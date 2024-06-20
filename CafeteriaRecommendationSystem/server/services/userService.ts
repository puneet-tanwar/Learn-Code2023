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
}
