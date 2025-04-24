// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Type extension for Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | number
      }
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' })
  }

  try {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set')
    }

    const decoded = jwt.verify(token, secret) as { id: string | number }
    req.user = { id: decoded.id }
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}
