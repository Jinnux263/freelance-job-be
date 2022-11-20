import { HttpException } from '@nestjs/common';

export class InvalidToken extends HttpException {
  constructor() {
    super(
      {
        status: 'INVALID_TOKEN',
        message: 'Token is missing or invalid',
      },
      401,
    );
  }
}
