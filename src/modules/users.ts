import {User} from "../models/users.model";
import sqlite, {Database} from "sqlite"

export async function getUnusedUserId(db: sqlite.Database) : Promise<number> {
    // Get all user IDs in the database
    const ids = await db.all('SELECT id FROM users');

    // Find the first unused ID
    let unusedId = 1;
    while (ids.some(id => id.id === unusedId)) {
        unusedId++;
    }

    return unusedId;
}

export async function getAllUsers(db: sqlite.Database) : Promise<Array<User>> {
    let rows = await db.all('SELECT * FROM users');
    let users = new Array<User>();
    rows.forEach((row) => {
        users.push(new User(row.id, row.name));
    });
    return users;
}

// Fetch user by ID
export async function getUserById(db: sqlite.Database, userId: number) : Promise<User> {
    let row = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (row) {
        return new User(row.id, row.name);
    }
    else {
        throw new Error(`User with ID ${userId} not found.`);
    }
}

// Create a new user
export async function addUser(db: Database, user: User) {
    // Check if the provided ID already exists in the database
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [user.id]);

    if (existingUser) {
        // Update the existing user's name
        await db.run('UPDATE users SET name = ? WHERE id = ?', [user.name, user.id]);
    } else {
        // Insert a new user into the database
        await db.run('INSERT INTO users (id, name) VALUES (?, ?)', [user.id, user.name]);
    }
}

// Delete a user
export async function deleteUser(db: Database, userId: number) {
    await db.run('DELETE FROM users WHERE id = ?', [userId]);
}

export async function hasUsers(db: Database): Promise<boolean> {
    return (await db.get('SELECT COUNT(*) FROM users'))['COUNT(*)'] > 0;
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