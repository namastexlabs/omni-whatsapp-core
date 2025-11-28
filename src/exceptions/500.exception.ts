import { HttpStatus } from '@api/routes/index.router';

import { ErrorMessage } from './400.exception';

export class InternalServerErrorException {
  constructor(...objectError: ErrorMessage[]) {
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: objectError.length > 0 ? objectError : undefined,
    };
  }
}
