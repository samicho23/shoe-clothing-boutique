import { AppError } from './AppErrors.js'

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', code = 'CONFLICT') {
    super(message, 409, code)
    this.name = 'ConflictError'
  }
}
