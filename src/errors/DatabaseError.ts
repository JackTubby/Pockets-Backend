/**
 * DatabaseError.ts
 * Description: Custom error class for database errors.
 */

import AppError from './AppError'

interface DatabaseErrorDetail {
  field: string
  message: string
}

class DatabaseError extends AppError {
  public readonly errors: DatabaseErrorDetail[]

  constructor(message: string = 'Database Error', errors: DatabaseErrorDetail[] = []) {
    super(message, 500, true, 'DatabaseError')
    this.errors = errors

    // Set the prototype explicitly
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}

export default DatabaseError
