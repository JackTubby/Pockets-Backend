import prisma from '../db'
import { Request, Response } from 'express'

export const createOneExpenditure = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, notes, categoryId, expectedDate, actualDate, actualAmount, name, completed } = req.body
  if (!amount || !userId)
    return res.status(400).json({
      error: 'Missing required fields',
    })
  try {
    const expenditure = await prisma.expenditure.create({
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
    res.json(expenditure)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

export const getOneExpenditure = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const expenditure = await prisma.expenditure.findUnique({
      where: { id: String(id) },
      include: { category: true },
    })
    res.json(expenditure)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const getAllExpenditures = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  try {
    const expenditures = await prisma.expenditure.findMany({
      where: { userId },
      include: { category: true },
    })
    res.json(expenditures)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const updateOneExpenditure = async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, notes, categoryId, expectedDate, actualDate, actualAmount, name, completed } = req.body
  try {
    const expenditure = await prisma.expenditure.update({
      where: { id: String(id) },
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
    res.json(expenditure)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const deleteOneExpenditure = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const expenditure = await prisma.expenditure.delete({
      where: { id: String(id) },
    })
    res.json(expenditure)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}
