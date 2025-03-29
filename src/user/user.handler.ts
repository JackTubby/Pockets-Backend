import prisma from '../db'
import { Request, Response } from 'express'

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body
  console.log("body: ", req.body)
  if (!firstName || !lastName || !email) return res.status(400).json('Missing required fields')
  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
      },
    })
    res.json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json('Something went wrong')
  }
}
