import { HttpStatus } from '@api/routes/index.router';

import { ErrorMessage } from './400.exception';

export class UnauthorizedException {
  constructor(...objectError: ErrorMessage[]) {
    throw {
      status: HttpStatus.UNAUTHORIZED,
      error: 'Unauthorized',
      message: objectError.length > 0 ? objectError : 'Unauthorized',
    };
  }
}
