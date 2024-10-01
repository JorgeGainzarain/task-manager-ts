import {User} from './users.model';

export class Task {
  id: number;
  description: string;
  dueDate: string;
  user: User;
  completed: boolean;

  constructor(id: number, description: string, dueDate: string, user: User) {
    this.id = id;
    this.description = description;
    this.dueDate = dueDate;
    this.user = user;
    this.completed = false;
  }

  public assignUser(user: User): void {
    this.user = user;
  }

  public markAsCompleted(): void {
    this.completed = true;
  }


}