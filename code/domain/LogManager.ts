import { AuditLog } from './AuditLog';

export class LogManager {
  private logs: AuditLog[] = [];

  write(entry: AuditLog): void {
    this.logs.push(entry);
  }

  retrieveLogs(filter: string): AuditLog[] {
    return this.logs.filter(l => l.action.includes(filter));
  }

  purgeOldLogs(): number {
    const now = Date.now();
    const beforeCount = this.logs.length;
    this.logs = this.logs.filter(l => now - l.timestamp.getTime() < 1000 * 60 * 60 * 24 * 30);
    return beforeCount - this.logs.length;
  }
}
