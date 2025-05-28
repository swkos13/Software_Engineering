import { User } from './User';

export class HistoryQuery {
  constructor(
    public filters: Record<string, string>,
    public user: User
  ) {}

  search(): string[] {
    // TODO: implement
    return [];
  }

  exportCSV(): File {
    // TODO: generate CSV
    throw new Error('Not implemented');
  }
}
