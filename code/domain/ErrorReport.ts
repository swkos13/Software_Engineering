import { ErrorType } from './ErrorType';
import { User } from './User';
import { Robot } from './Robot';

export class ErrorReport {
  public status: string = '';

  constructor(
    public id: string,
    public robot: Robot,
    public type: ErrorType,
    public description: string,
    public submittedBy: User,
    public createdAt: Date,
    public attachments: File[] = []
  ) {}

  validate(): boolean {
    return this.description.trim().length > 0;
  }

  send(): boolean {
    // TODO: send to server
    return true;
  }

  updateStatus(status: string): void {
    this.status = status;
  }
}
