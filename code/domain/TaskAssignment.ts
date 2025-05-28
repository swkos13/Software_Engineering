import { Task } from './Task';
import { Robot } from './Robot';

export class TaskAssignment {
  public status: string = '';

  constructor(
    public id: string,
    public task: Task,
    public robot: Robot,
    public assignedAt: Date
  ) {}

  confirm(): boolean {
    this.status = 'confirmed';
    return true;
  }

  cancel(): boolean {
    this.status = 'canceled';
    return true;
  }

  reschedule(newTime: Date): boolean {
    this.assignedAt = newTime;
    return true;
  }
}