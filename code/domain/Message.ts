import { User } from './User';

export class Message {
  constructor(
    public id: string,
    public sender: User,
    public recipient: User,
    public content: string,
    public timestamp: Date
  ) {}

  send(): boolean {
    // TODO: send message
    return true;
  }

  reply(text: string): Message {
    const replyMsg = new Message(
      Math.random().toString(36).substr(2),
      this.recipient,
      this.sender,
      text,
      new Date()
    );
    return replyMsg;
  }
}