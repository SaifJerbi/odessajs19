import { injectable } from 'inversify';
import { LoggerApi } from '@sejerbi/shared-api/server';

const defaultLevel = process.env.LOG_LEVEL;

@injectable()
export class LoggerApiImpl implements LoggerApi {
  constructor() {}

  error(message: string | Error): void {
    console.error(message);
  }

  warn(message: string): void {
    console.warn(message);
  }

  info(message: string): void {
    console.log(message);
  }
}
