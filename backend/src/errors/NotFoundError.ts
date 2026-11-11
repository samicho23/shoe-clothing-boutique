import { AppError } from './AppErrors.js'

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, 404, code)
    this.name = 'NotFoundError'
  }
}
