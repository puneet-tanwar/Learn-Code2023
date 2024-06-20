import { User, UserRole } from '../types/user';
import connection from '../database';

export class AdminService {
  async delete(email: string) {
    const query = 'DELETE FROM users WHERE email = ?';
    await connection.query(query, [email]);
  }
}
