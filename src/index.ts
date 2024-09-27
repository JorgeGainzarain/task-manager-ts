import {initializeDatabase} from "./database/database";

const dbPath = './database/task-manager.db';

initializeDatabase(dbPath).then(async (db) => {

    // Generate some users
});

