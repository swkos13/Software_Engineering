import { NotificationType } from './NotificationType';
import { User } from './User';

export class Notification {
  constructor(
    public id: string,
    public recipient: User,
    public message: string,
    public type: NotificationType,
    public read: boolean,
    public createdAt: Date
  ) {}

  markAsRead(): boolean {
    this.read = true;
    return true;
  }

  isUrgent(): boolean {
    return this.type === NotificationType.Error;
  }
}
