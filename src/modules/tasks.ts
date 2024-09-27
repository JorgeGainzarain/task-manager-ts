import Task from './models/tasks.model';

// Fetch all tasks
export async function getAllTasks(db: sqlite3.Database) : Promise<Array<Task>> {
    let rows = await db.all('SELECT * FROM tasks');
    let Tasks = new Array<Task>();
    rows.forEach((row) => {
        Tasks.push(new Task(row.id, row.description, row.dueDate, row.user_id));
    });
    return Tasks;
}

// Fetch tasks by user ID
export async function getTasksByUserId(db: sqlite3.Database, userId: number) : Promise<Array<Task>> {
    let rows = await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    let tasks = new Array<Task>();
    rows.forEach((row) => {
        tasks.push(new Task(row.id, row.description, row.dueDate, row.user_id));
    });
    return tasks;
}

// Create a new task
export async function addTask(db: sqlite3.Database, task: Task) {
    await db.run('INSERT INTO tasks (id, description, user_id) VALUES (?, ?, ?)', [task.id, task.description, task.user.id]);
}

// Update the user for a task
export async function changeUser(db: sqlite3.Database, taskId: number, userId: number) {
    await db.run('UPDATE tasks SET user_id =? WHERE id =?', [userId, taskId]);
}

// Update a task
export async function updateTask(db: sqlite3.Database, taskId: number, description: string) {
    await db.run('UPDATE tasks SET description = ? WHERE id = ?', [description, taskId]);
}

// Delete a task
export async function deleteTask(db: sqlite3.Database, taskId: number) {
    await db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
}