import * as sqlite from 'sqlite';
import * as fs from 'fs';
import sqlite3 from'sqlite3';
import {PathLike} from "node:fs";




export async function initializeDatabase(dbPath: string) {

    if(fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
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