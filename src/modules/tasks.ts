import {Task} from "../models/tasks.model";
import sqlite, {Database} from "sqlite";
import {User} from "../models/users.model";

export async function getUnusedTaskId(db: sqlite.Database) : Promise<number> {
    // Get all tasks IDs in the database
    const ids = await db.all('SELECT id FROM tasks');

    // Find the first unused ID
    let unusedId = 1;
    while (ids.some(id => id.id === unusedId)) {
        unusedId++;
    }

    return unusedId;
}

// Fetch all tasks
export async function getAllTasks(db: Database) : Promise<Array<Task>> {
    let rows = await db.all('SELECT * FROM tasks');
    let Tasks = new Array<Task>();
    rows.forEach((row) => {
        Tasks.push(new Task(row.id, row.description, row.dueDate, row.user_id));
    });
    return Tasks;
}

// Fetch tasks by user ID
export async function getTasksByUserId(db: Database, userId: number) : Promise<Array<Task>> {
    let rows = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    let tasks = new Array<Task>();
    rows.forEach((row) => {
        tasks.push(new Task(row.id, row.description, row.dueDate, row.user_id));
    });
    return tasks;
}

export async function getTaskById(db: Database, taskId: number) : Promise<Task> {
    let row = await db.get('SELECT * FROM tasks WHERE id =?', [taskId]);
    if (row) {
        return new Task(row.id, row.description, row.dueDate, row.user_id);
    } else {
        throw new Error(`Task with ID ${taskId} not found.`);
    }
}

// Create a new task
export async function addTask(db: Database, task: Task) {
    let existingTask = await db.get('SELECT * FROM tasks WHERE id =?', [task.id]);
    if (existingTask) {
        await db.run('UPDATE tasks SET description =?, dueDate =?, completed =?, user_id =? WHERE id =?', [task.description, task.dueDate, task.completed])
    } else {
        await db.run('INSERT INTO tasks (id, description, dueDate, completed, user_id) VALUES (?, ?, ?, ?, ?)', [task.id, task.description, task.dueDate, task.completed.valueOf(), task.user.id]);
    }
}


// Delete a task
export async function deleteTask(db: Database, taskId: number) {
    await db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
}

export async function hasTasks(db: Database): Promise<boolean> {
    return (await db.get('SELECT COUNT(*) FROM tasks'))['COUNT(*)'] > 0;
}

export function tasksFromJson(json: { description: string; dueDate: string; }[]): Array<Task> {

    let tasks = new Array<Task>();
    let i = 0;
    json.forEach(task => {
        i++;
        tasks.push(new Task(i, task.description, task.dueDate, new User(-1,"No one")));
    });
    return tasks;
}