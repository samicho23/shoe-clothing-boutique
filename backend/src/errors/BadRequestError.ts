import { AppError } from './AppErrors.js'

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST') {
    super(message, 400, code)
    this.name = 'BadRequestError'
  }
}
