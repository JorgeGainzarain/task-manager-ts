import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';




export async function initializeDatabase(dbPath: String) {

    if(fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    const db = await new sqlite3.Database(dbPath);


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
        user_id     INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
        );
    `);

    return db;
}