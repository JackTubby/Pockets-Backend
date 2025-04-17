/**
 * NotFoundError.ts
 * Description: Custom error class for not found errors.
 */

import AppError from './AppError'

interface NotFoundErrorDetail {
  field: string
  message: string
}

class NotFoundError extends AppError {
  public readonly errors: NotFoundErrorDetail[]

  constructor(message: string = 'Not Found', errors: NotFoundErrorDetail[] = []) {
    super(message, 404, true, 'NotFoundError')
    this.errors = errors

    // Set the prototype explicitly
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export default NotFoundError
