export class Permission {
  constructor(
    public code: string,
    public description: string
  ) {}

  isGrantedTo(role: import("./Role").Role): boolean {
    return role.listPermissions().some(p => p.code === this.code);
  }
}
