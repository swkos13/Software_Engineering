import { Role } from './Role';

// Placeholder hash function - replace with real implementation
const hash = (input: string) => {
  // e.g. CryptoJS.SHA256(input).toString();
  return input;
};

export class User {
  public lastLogin?: Date;

  constructor(
    public id: string,
    public username: string,
    public email: string,
    private passwordHash: string,
    public role: Role
  ) {}

  login(password: string): boolean {
    if (hash(password) === this.passwordHash) {
      this.lastLogin = new Date();
      return true;
    }
    return false;
  }

  logout(): void {
    // e.g. clear tokens, session storage
  }

  updateProfile(data: Partial<Pick<User, 'username' | 'email'>>): void {
    if (data.username) this.username = data.username;
    if (data.email) this.email = data.email;
  }

  changePassword(oldPwd: string, newPwd: string): boolean {
    if (hash(oldPwd) !== this.passwordHash) {
      return false;
    }
    this.passwordHash = hash(newPwd);
    return true;
  }
}
