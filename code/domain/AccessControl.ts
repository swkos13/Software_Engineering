import { User } from './User';
import { Permission } from './Permission';

export class AccessControl {
  checkPermission(user: User, action: string): boolean {
    const role = user.role;
    return role.listPermissions().some(p => p.code === action);
  }

  getRole(user: User): import("./Role").Role {
    return user.role;
  }
}