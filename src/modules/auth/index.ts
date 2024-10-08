import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const comparePassword = (password: any, hash: any) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = (password: any) => {
  return bcrypt.hash(password, 5)
}

export const createJWT = (user: any) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
  // token is now a string
  return token
}

export const protect = (req: any, res: any, next: any) => {
  const bearer = req.headers.authorization // check for the auth header

  if (!bearer) {
    res.status(401)
    res.json({ message: 'not authorised' })
    return
  }

  // we split on space as the user sends up "'Bearer' 'Token'"
  const [type, token] = bearer.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not valid token' })
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined')
    }
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (e) {
    console.error(e)
    res.status(401)
    res.json({ message: 'not valid token' })
    return
  }
}
