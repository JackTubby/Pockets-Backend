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
