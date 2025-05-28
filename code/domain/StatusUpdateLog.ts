import { User } from './User';
import { Robot } from './Robot';
import { RobotStatus } from './RobotStatus';

export class StatusUpdateLog {
  constructor(
    public id: string,
    public robot: Robot,
    public previousStatus: RobotStatus,
    public newStatus: RobotStatus,
    public updatedBy: User,
    public timestamp: Date
  ) {}

  toString(): string {
    return `${this.robot.id}: ${this.previousStatus} -> ${this.newStatus} by ${this.updatedBy.username}`;
  }
}