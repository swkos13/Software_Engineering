import { TaskCategory, TaskStatus } from './TaskEnums';
import { User } from './User';
import { Robot } from './Robot';

export class Task {
  public status: TaskStatus = TaskStatus.Pending;

  constructor(
    public id: string,
    public description: string,
    public category: TaskCategory,
    public createdBy: User,
    public createdAt: Date,
    public deadline: Date,
    public notes?: string
  ) {}

  assignTo(robot: Robot): boolean {
    if (!robot.isAvailable()) return false;
    this.status = TaskStatus.InProgress;
    return true;
  }

  updateDetails(data: Partial<Pick<Task, 'description' | 'notes'>>): boolean {
    if (data.description) this.description = data.description;
    if (data.notes) this.notes = data.notes;
    return true;
  }

  markAsCompleted(): void {
    this.status = TaskStatus.Completed;
  }
}