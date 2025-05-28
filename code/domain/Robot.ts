import { RobotStatus } from './RobotStatus';
import { RobotDiagnostics } from './RobotDiagnostics';

export class Robot {
  constructor(
    public id: string,
    public name: string,
    public type: string,
    public location: string,
    public batteryLevel: number,
    public status: RobotStatus,
    public firmwareVersion: string
  ) {}

  updateStatus(newStatus: RobotStatus): void {
    this.status = newStatus;
  }

  sendCommand(cmd: string): boolean {
    // TODO: send command to hardware
    return true;
  }

  getDiagnostics(): RobotDiagnostics {
    // TODO: fetch diagnostics
    return new RobotDiagnostics(this.id, 0, 0, {}, 0, new Date());
  }

  isAvailable(): boolean {
    return this.status === RobotStatus.Operational;
  }
}