import { Permission } from './Permission';

export class Role {
  private permissions: Permission[] = [];

  constructor(public name: string) {}

  addPermission(permission: Permission): void {
    if (!this.permissions.find(p => p.code === permission.code)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: Permission): void {
    this.permissions = this.permissions.filter(p => p.code !== permission.code);
  }

  listPermissions(): Permission[] {
    return [...this.permissions];
  }
}