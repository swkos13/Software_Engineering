import { AlertStatus } from './AlertStatus';
import { Robot } from './Robot';

export class MaintenanceAlert {
  constructor(
    public id: string,
    public robot: Robot,
    public alertType: string,
    public message: string,
    public status: AlertStatus,
    public createdAt: Date
  ) {}

  markAsRead(): boolean {
    this.status = AlertStatus.Read;
    return true;
  }

  resolve(): boolean {
    this.status = AlertStatus.Resolved;
    return true;
  }
}
