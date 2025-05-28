import { User } from './User';

export class AuditLog {
  constructor(
    public id: string,
    public action: string,
    public user: User,
    public timestamp: Date,
    public success: boolean
  ) {}

  toJson(): string {
    return JSON.stringify({
      id: this.id,
      action: this.action,
      userId: this.user.id,
      timestamp: this.timestamp.toISOString(),
      success: this.success
    });
  }
}