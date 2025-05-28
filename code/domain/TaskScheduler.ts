import { Task } from './Task';

export class TaskScheduler {
  private schedule: Map<string, Task> = new Map();

  scheduleTask(task: Task): boolean {
    this.schedule.set(task.id, task);
    return true;
  }

  cancel(taskId: string): boolean {
    return this.schedule.delete(taskId);
  }

  getScheduledTasks(): Task[] {
    return Array.from(this.schedule.values());
  }
}
