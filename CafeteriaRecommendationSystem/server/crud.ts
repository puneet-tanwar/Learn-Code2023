// import connection from './database';


// function runQuery(query: string, params: any[] = []) {
//   return new Promise<any>((resolve, reject) => {
//     connection.query(query, params, (error, results) => {
//       if (error) {
//         return reject(error);
//       }
//       resolve(results);
//     });
//   });
// }


// export async function createUser(name: string, email: string) {
//   const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
//   const result = await runQuery(query, [name, email]);
//   return result.insertId;
// }


// export async function getUserById(id: number) {
//   const query = 'SELECT * FROM users WHERE id = ?';
//   const rows = await runQuery(query, [id]);
//   return rows[0];
// }


// export async function updateUser(id: number, name: string, email: string) {
//   const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
//   await runQuery(query, [name, email, id]);
// }


// export async function deleteUser(id: number) {
//   const query = 'DELETE FROM users WHERE id = ?';
//   await runQuery(query, [id]);
// }
