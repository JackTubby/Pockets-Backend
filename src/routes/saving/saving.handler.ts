import prisma from '../../db/index'
import e, { Request, Response } from 'express'

export const createOneSaving = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, expectedAmount, actualAmount, name, completed, expectedDate, actualDate, categoryId, notes } =
    req.body
  if (!amount || !userId)
    return res.status(400).json({
      error: 'Missing required fields',
    })
  try {
    const saving = await prisma.saving.create({
      data: {
        amount,
        userId,
        expectedAmount,
        actualAmount,
        name,
        completed,
        expectedDate,
        actualDate,
        categoryId,
        notes,
      },
    })
    res.json(saving)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

export const getOneSaving = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const saving = await prisma.saving.findUnique({
      where: { id: String(id) },
      include: { category: true },
    })
    res.json(saving)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const getAllSaving = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  try {
    const savings = await prisma.saving.findMany({
      where: { userId },
      include: { category: true },
    })
    res.json(savings)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const updateOneSaving = async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, expectedAmount, actualAmount, name, completed, expectedDate, actualDate, categoryId, notes } =
    req.body
  try {
    const saving = await prisma.saving.update({
      where: { id: String(id) },
      data: {
        amount,
        userId,
        expectedAmount,
        actualAmount,
        name,
        completed,
        expectedDate,
        actualDate,
        categoryId,
        notes,
      },
    })
    res.json(saving)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const deleteOneSaving = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const saving = await prisma.saving.delete({
      where: { id: String(id) },
    })
    res.json(saving)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}
