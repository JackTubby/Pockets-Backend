/**
 * AppError class
 * Description: Custom error class for application errors.
 * This class extends the built-in Error class and adds additional properties
 * to handle application-specific errors.
 */

class AppError extends Error {
  public readonly name: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true, name = 'AppError') {
    super(message)
    this.name = name
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export default AppError
