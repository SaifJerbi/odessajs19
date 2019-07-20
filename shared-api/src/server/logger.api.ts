export interface LoggerApi {
  error(error: Error): void;
  warn(message: string): void;
  info(message: string): void;
}
