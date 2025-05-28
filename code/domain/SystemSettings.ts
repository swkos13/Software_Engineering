export class SystemSettings {
  constructor(
    public id: string,
    public doubleAuthEnabled: boolean,
    public passwordPolicy: string,
    public lastUpdated: Date
  ) {}

  updateSettings(config: Record<string, string>): boolean {
    // TODO: apply settings
    return true;
  }

  resetToDefaults(): boolean {
    // TODO: reset settings
    return true;
  }
}