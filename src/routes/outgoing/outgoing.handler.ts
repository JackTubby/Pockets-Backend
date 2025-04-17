import prisma from '../../db/index'
import { Request, Response } from 'express'

export const createOneOutgoing = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, actualAmount, categoryId, name, completed, notes, expectedDate, actualDate } = req.body
  if (!amount || !userId)
    return res.status(400).json({
      error: 'Missing required fields'
    })
  try {
    const income = await prisma.outgoing.create({
      data: {
        amount,
        actualAmount,
        userId,
        categoryId,
        name,
        completed,
        notes,
        expectedDate,
        actualDate,
      },
    })
    res.json(income)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

export const getOneOutgoing = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const outgoing = await prisma.outgoing.findUnique({
      where: { id: String(id) },
      include: { category: true },
    })
    res.json(outgoing)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const getAllOutgoings = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  try {
    const outgoings = await prisma.outgoing.findMany({
      where: { userId },
      include: { category: true },
    })
    res.json(outgoings)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const updateOneOutgoing = async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, actualAmount, categoryId, name, completed, notes, expectedDate, actualDate } = req.body
  try {
    const outgoing = await prisma.outgoing.update({
      where: { id: String(id) },
      data: {
        amount,
        userId,
        categoryId,
        notes,
        expectedDate,
        actualDate,
      },
    })
    res.json(outgoing)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const deleteOneOutgoing = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const outgoing = await prisma.outgoing.delete({
      where: { id: String(id) },
    })
    res.json(outgoing)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}
