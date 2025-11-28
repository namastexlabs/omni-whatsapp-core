import { HttpStatus } from '@api/routes/index.router';

import { ErrorMessage } from './400.exception';

export class NotFoundException {
  constructor(...objectError: ErrorMessage[]) {
    throw {
      status: HttpStatus.NOT_FOUND,
      error: 'Not Found',
      message: objectError.length > 0 ? objectError : undefined,
    };
  }
}
