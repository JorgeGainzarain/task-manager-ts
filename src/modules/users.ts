import {User} from "../models/users.model";
import sqlite, {Database} from "sqlite"

export async function getAllUsers(db: sqlite.Database) : Promise<Array<User>> {
    let rows = await db.all('SELECT * FROM users');
    let users = new Array<User>();
    rows.forEach((row) => {
        users.push(new User(row.id, row.name));
    });
    return users;
}

// Fetch user by ID
export async function getUserById(db: sqlite.Database, userId: number) : Promise<Array<User>> {
    let rows = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    let users = new Array<User>();
    if (rows) {
        users.push(new User(rows.id, rows.name));
    }
    return users;
}

// Create a new user
export async function addUser(db: Database, user: User) {
    await db.run('INSERT INTO users (id, name) VALUES (?, ?)', [user.id, user.name]);
}

// Update a user
export async function updateUser(db: Database, userId: number, name: string) {
    await db.run('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
}

// Delete a user
export async function deleteUser(db: Database, userId: number) {
    await db.run('DELETE FROM users WHERE id = ?', [userId]);
}

export function usersFromJson(json: string[]): Array<User> {
    let users = new Array<User>();
    let i = 0;
    json.forEach(value => {
        i++;
        users.push(new User(i, value));
    })
    return users;
}