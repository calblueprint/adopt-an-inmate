import { serverError, serverLog, serverWarn } from './wrappers';

// create logger class for abstraction
class Logger {
  static async log(message?: unknown, ...optionalParams: unknown[]) {
    await serverLog(message, ...optionalParams);
  }

  static async warn(message?: unknown, ...optionalParams: unknown[]) {
    await serverWarn(message, ...optionalParams);
  }

  static async error(message?: unknown, ...optionalParams: unknown[]) {
    await serverError(message, ...optionalParams);
  }
}

export default Logger;
