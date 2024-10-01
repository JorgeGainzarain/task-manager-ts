import * as sqlite from 'sqlite';
import sqlite3 from'sqlite3';
import * as fs from "node:fs";




export async function initializeDatabase(dbPath: string) {

    // Check if the database file exists
    if (fs.existsSync(dbPath)) {
        console.log('Database already exists. Skipping initialization.');
        return await sqlite.open({
            filename: dbPath,
            driver: sqlite3.Database
        });
    }

    const db = await sqlite.open({
        filename: dbPath,
        driver: sqlite3.Database
    })

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users
    (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks
        (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT    NOT NULL,
        dueDate   TEXT NOT NULL,
        user_id     INTEGER NOT NULL,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
        );
    `);

    return db;
}