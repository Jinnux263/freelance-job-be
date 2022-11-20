export class BaseResponse {
  statusCode = 200;
  message = '';

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
