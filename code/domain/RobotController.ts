import { Robot } from './Robot';

export class RobotController {
  reboot(robot: Robot): boolean {
    return robot.sendCommand('reboot');
  }
  shutdown(robot: Robot): boolean {
    return robot.sendCommand('shutdown');
  }
  start(robot: Robot): boolean {
    return robot.sendCommand('start');
  }
  sendBatchCommands(robot: Robot, cmds: string[]): boolean {
    return cmds.every(cmd => robot.sendCommand(cmd));
  }
}