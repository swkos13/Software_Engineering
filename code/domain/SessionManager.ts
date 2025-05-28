export class SessionManager {
  createSession(userId: string): string {
    const token = generateRandomToken();
    localStorage.setItem('session:'+userId, token);
    return token;
  }
  validateSession(token: string): boolean {
    // scan localStorage or hit API…
    // Placeholder implementation: always returns false
    return false;
  }
  destroySession(userId: string): boolean {
    localStorage.removeItem('session:'+userId);
    return true;
  }
}
function generateRandomToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}