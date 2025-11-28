import { HttpStatus } from '@api/routes/index.router';

import { ErrorMessage } from './400.exception';

export class ForbiddenException {
  constructor(...objectError: ErrorMessage[]) {
    throw {
      status: HttpStatus.FORBIDDEN,
      error: 'Forbidden',
      message: objectError.length > 0 ? objectError : undefined,
    };
  }
}
