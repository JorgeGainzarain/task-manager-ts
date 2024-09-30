import {Task} from "../models/tasks.model";
import sqlite, {Database} from "sqlite";
import {User} from "../models/users.model";

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

// Create a new task
export async function addTask(db: Database, task: Task) {
    await db.run('INSERT INTO tasks (id, description, dueDate, completed, user_id) VALUES (?, ?, ?, ?, ?)', [task.id, task.description, task.dueDate, task.completed.valueOf(), task.user.id]);
}

// Update the user for a task
export async function changeUser(db: Database, taskId: number, userId: number) {
    await db.run('UPDATE tasks SET user_id =? WHERE id =?', [userId, taskId]);
}

// Update a task
export async function updateTask(db: Database, taskId: number, description: string) {
    await db.run('UPDATE tasks SET description = ? WHERE id = ?', [description, taskId]);
}

// Delete a task
export async function deleteTask(db: Database, taskId: number) {
    await db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
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