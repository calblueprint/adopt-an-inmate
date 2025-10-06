import { serverError, serverInfo, serverLog, serverWarn } from './wrappers';

// create logger class for abstraction
class Logger {
  static async log(message: string) {
    await serverLog(message);
  }

  static async warn(message: string) {
    await serverWarn(message);
  }

  static async error(message: string) {
    await serverError(message);
  }

  static async info(message: string) {
    await serverInfo(message);
  }
}

export default Logger;
