import AppError from './AppError'

interface ValidationErrorDetail {
  field: string
  message: string
}

class ValidationError extends AppError {
  public readonly errors: ValidationErrorDetail[]

  constructor(message: string = 'Validation Error', errors: ValidationErrorDetail[] = []) {
    super(message, 400, true, 'ValidationError')
    this.errors = errors

    // Set the prototype explicitly
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export default ValidationError
