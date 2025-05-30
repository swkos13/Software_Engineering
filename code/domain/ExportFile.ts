export class ExportFile {
  constructor(
    public filename: string,
    public format: string,
    public generatedAt: Date,
    public data: ArrayBuffer
  ) {}

  getSize(): number {
    return this.data.byteLength;
  }

  isValid(): boolean {
    return this.data.byteLength > 0;
  }
}