import { User } from './User';

export class PerformanceReport {
  constructor(
    public id: string,
    public createdBy: User,
    public periodStart: Date,
    public periodEnd: Date,
    public metrics: Record<string, number>
  ) {}

  exportPDF(): File {
    // TODO: generate PDF
    throw new Error('Not implemented');
  }

  exportCSV(): File {
    // TODO: generate CSV
    throw new Error('Not implemented');
  }

  summarize(): string {
    return Object.entries(this.metrics)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }
}