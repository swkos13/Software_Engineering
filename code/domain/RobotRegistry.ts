import { Robot } from './Robot';

export class RobotRegistry {
  private robots: Robot[] = [];

  getAllRobots(): Robot[] {
    return [...this.robots];
  }

  getRobotById(id: string): Robot | undefined {
    return this.robots.find(r => r.id === id);
  }

  registerRobot(robot: Robot): void {
    this.robots.push(robot);
  }

  removeRobot(id: string): boolean {
    const initial = this.robots.length;
    this.robots = this.robots.filter(r => r.id !== id);
    return this.robots.length < initial;
  }
}