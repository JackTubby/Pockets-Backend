import prisma from '../db'
import { comparePassword, createJWT, hashPassword } from '../modules/auth'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  body: {
    username: string
    password: string
    firstName: string
    lastName: string
    email: string
    totalBalance: string
    pocketTotalBalance: string
  }
}

export const signUp = async (req: CustomRequest, res: Response) => {
  // TODO: username is defined unique in schema so check what error that throws back

  const { username, password, firstName, lastName, email , totalBalance, pocketTotalBalance} = req.body
  if (!username && !password && !firstName && !lastName && !email) {
    return res.json({ message: 'Please fill in all the fields' })
  }
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: await hashPassword(password),
        firstName: firstName,
        lastName: lastName,
        email: email,
        totalBalance,
        pocketTotalBalance,
      },
    })
    if (user) {
      res.json({ message: 'User created please sign in!' })
    } else {
      return res.status(500).json({
        message: 'Something went wrong! Please try again later..',
      })
    }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.json({ message: 'That username already exists' })
    }
    return res.status(500).json({
      message: 'Something went wrong! Please try again later..',
    })
  }
}

export const signIn = async (req: CustomRequest, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Please fill in all the fields' })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    res.status(200).json({
      token,
      user: {
        authorisedAccounts: [{ userId: user.id }],
      },
    })
  } catch (error: any) {
    res.status(500).json({ message: 'Something went wrong during the sigin process' })
  }
}
