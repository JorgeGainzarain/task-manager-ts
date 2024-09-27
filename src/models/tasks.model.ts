import User from './models/users.model';

export class Task {
  id: number;
  description: string;
  dueDate: string;
  user: User;

  constructor(id: number, description: string, dueDate: string, user: User) {
    this.id = id;
    this.description = description;
    this.dueDate = dueDate;
    this.user = user;
  }


}