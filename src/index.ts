import {initializeDatabase} from "./database/database";
const jsonData = require('./data.json');
import {User} from "./models/users.model";
import {getAllUsers, getUserById, addUser, updateUser, deleteUser, usersFromJson} from "./modules/users";
import {getAllTasks, getTasksByUserId, addTask, updateTask, deleteTask, tasksFromJson} from "./modules/tasks";
import {Database} from "sqlite";
import readlinePromises from "node:readline/promises";


const dbPath = './database/task-manager.db';

async function addUsers(db: Database) {
    // Import some users from the data json
    let users : Array<User> = usersFromJson(jsonData.Users);

    for (const user of users) {
        console.log(`Adding user: ${user.name}`);
        await addUser(db, user);
    }

    return users;
}

async function addTasks(db: Database) {
    // Now load some tasks from the data
    let tasks = tasksFromJson(jsonData.Tasks);

    // Assign users to tasks
    for (const task of tasks) {
        await addTask(db, task);
    }
}


initializeDatabase(dbPath).then(async (db) => {
    let users = await addUsers(db);
    let tasks = await addTasks(db);


    // Start the interactive terminal
    const rl = readlinePromises.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log('Welcome to the Task Manager!');

    let commands : { description : string; usage : string[]; }[] = jsonData.Commands;

    rl.on('line', async (msg) => {
        if (commands[0].usage.includes(msg.toLowerCase())) {
            console.log('Commands:')
            commands.forEach((command) => {
                console.log(`- ${command.usage.toString()} -> (${command.description})`);
            })
        }
    })

    rl.emit('line', '?')

});

