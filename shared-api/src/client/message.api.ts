export abstract class MessageApi {
  abstract showSuccess(msg: string): void;
  abstract showError(msg: string): void;
  abstract showWarning(msg: string): void;
  abstract showInfo(msg: string): void;
}
