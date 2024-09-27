// Fetch all users
import {User} from "../models/users.model";

export async function getAllUsers(db: sqlite3.Database) : Promise<Array<User>> {
    let rows = await db.all('SELECT * FROM users');
    let users = new Array<User>();
    rows.forEach((row) => {
        users.push(new User(row.id, row.name));
    });
    return users;
}

// Fetch user by ID
export async function getUserById(db: sqlite3.Database, userId: number) : Promise<Array<User>> {
    let rows = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    let users = new Array<User>();
    if (rows) {
        users.push(new User(rows.id, rows.name));
    }
    return users;
}

// Create a new user
export async function createUser(db: sqlite3.Database, user: User) {
    await db.run('INSERT INTO users (name) VALUES (?, ?)', [user.id, user.name]);
}

// Update a user
export async function updateUser(db: sqlite3.Database, userId: number, name: string) {
    await db.run('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
}

// Delete a user
export async function deleteUser(db: sqlite3.Database, userId: number) {
    await db.run('DELETE FROM users WHERE id = ?', [userId]);
}