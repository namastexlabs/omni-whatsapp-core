import { HttpStatus } from '@api/routes/index.router';

export interface ErrorContext {
  property?: string;
  message: string;
  constraint?: string;
}

export type ErrorMessage = string | ErrorContext;

export class BadRequestException {
  constructor(...objectError: ErrorMessage[]) {
    throw {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: objectError.length > 0 ? objectError : undefined,
    };
  }
}
