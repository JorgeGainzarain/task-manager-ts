import {initializeDatabase} from "./database/database";
const jsonData = require('./data.json');
import {User} from "./models/users.model";
import {
    getUnusedUserId,
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    usersFromJson,
    hasUsers
} from "./modules/users";
import {
    getUnusedTaskId,
    getAllTasks,
    getTasksByUserId,
    addTask,
    deleteTask,
    tasksFromJson,
    getTaskById,
    hasTasks
} from "./modules/tasks";
import {Database} from "sqlite";
import readlinePromises from "node:readline/promises";
import {Task} from "./models/tasks.model";


const dbPath = './database/task-manager.db';

async function addUsers(db: Database) {
    // Import some users from the data json
    let users : Array<User> = usersFromJson(jsonData.Users);

    for (const user of users) {
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

    return tasks;
}


initializeDatabase(dbPath).then(async (db) => {
    // Adding some default users from data.json to show the functionality if there is not already users or load them otherwise
    let users : User[] = await hasUsers(db) ? await getAllUsers(db) : await addUsers(db);
    let tasks : Task[] = await hasTasks(db) ? await getAllTasks(db) : await addTasks(db);

    // Start the interactive terminal
    const rl = readlinePromises.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log('Welcome to the Task Manager!');

    let commands : { description : string; usage : string[]; }[] = jsonData.Commands;

    rl.on('line', async (message) => {
        let msg = message.toLowerCase();
        if (commands[0].usage.includes(msg)) {  // Display Commands
            console.log('Commands:')
            commands.forEach((command) => {
                console.log(`- [${command.usage}] -> (${command.description})`);
            })
        }
        else if (commands[1].usage.includes(msg)) { // List Users
            users = await getAllUsers(db);
            console.log('Users:', users);
        }
        else if (commands[2].usage.includes(msg)) { // List tasks
            tasks = await getAllTasks(db);
            console.log('Tasks:', tasks);
        }
        else if (commands[3].usage.includes(msg)) { // Add user or edit by id
            let name = await rl.question('Enter user name: ')
            let id: number  = parseInt(await rl.question('Enter user id (leave blank to select a non used id): '))
            if(isNaN(id) || id < 0) {
                id = await getUnusedUserId(db)
            }
            let usr = new User(id, name);
            if(! users.includes(usr)) {
                users.push(usr);
            }
            await addUser(db, usr);
            console.log(`User ${name} added with id ${id}`);
        }
        else if (commands[4].usage.includes(msg)) { // Add task or edit by id
            let description = await rl.question('Enter task description: ')
            let dueDate = await rl.question('Enter task due date (DD/MM/YYYY): ')
            let id: number  = parseInt(await rl.question('Enter task id (leave blank to select a non used id): '))
            if(isNaN(id) || id < 0) {
                id = await getUnusedTaskId(db)
            }
            let task = new Task(id, description, dueDate, users[0]);
            if(! tasks.includes(task)) {
                tasks.push(task);
            }
            await addTask(db, task);
            console.log(`Task ${description} added with id ${id}`);
        }
        else if (commands[5].usage.includes(msg)) { // Delete user by id
            let id = parseInt(await rl.question('Enter user id to delete: '))
            users = users.filter((u) => u.id!== id);
            await deleteUser(db, id);
            console.log(`User with id ${id} deleted`);
        }
        else if (commands[6].usage.includes(msg)) { // Delete  task by id
            let id = parseInt(await rl.question('Enter task id to delete: '))
            tasks = tasks.filter((t) => t.id!== id);
            await deleteTask(db, id);
            console.log(`Task with id ${id} deleted`);
        }
        else if (commands[7].usage.includes(msg)) { // Delete task by user id
            let id = parseInt(await rl.question('Enter user id to delete tasks for: '))
            tasks = tasks.filter((t) => t.user.id!== id);
            let tasksD = await getTasksByUserId(db, id);
            for (let task of tasksD) {
                await deleteTask(db, task.id);
                console.log(`Task with id ${task.id} deleted`);
            }
            console.log(`Tasks assigned to user with id ${id} deleted`);
        }
        else if (commands[8].usage.includes(msg)) { // Assign a task to a user
            try {
                let userId: number = parseInt(await rl.question('Enter user id to assign task to: '))
                let taskId: number = parseInt(await rl.question('Enter task id to assign: '))
                let task: Task = await getTaskById(db, taskId);
                let user = await getUserById(db, userId)
                task.assignUser(user);
                tasks.forEach((t: Task) => {
                    if (t.id === task.id) {
                        t.assignUser(user)
                    }
                })
                await addTask(db, task);
                console.log(`Task with id ${taskId} assigned to user with id ${userId}`);
            }
            catch(e: any) {
                console.error('Error:', e.message);
            }
        }
        else if (commands[9].usage.includes(msg)) { // Mark task as completed by id
            let id = parseInt(await rl.question('Enter task id to mark as completed: '))
            let task : Task = await getTaskById(db, id);
            task.markAsCompleted()
            await addTask(db, task);
            tasks.forEach((t: Task) => {
                if(t.id === task.id) {t.markAsCompleted()}
            });
        }
        else if (commands[10].usage.includes(msg)) { // Exit the program
            rl.close();
            console.log('Goodbye!');
        }
        else {
            console.log('Unknown command');
        }
    })

    rl.emit('line', '?')

});

