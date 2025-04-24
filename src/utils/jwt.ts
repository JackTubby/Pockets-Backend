import jwt from 'jsonwebtoken'

export const generateToken = (userId: string | number) => {
  const secret = process.env.JWT_SECRET || 'your-default-secret-key'

  // Never use a default secret in production!
  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === undefined) {
    throw new Error('JWT_SECRET must be defined in production')
  }

  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: '7d' } // Token expires in 7 days
  )
}
