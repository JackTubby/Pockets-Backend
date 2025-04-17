import prisma from '../../db/index'
import { Request, Response } from 'express'

export const createOneIncome = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, notes, categoryId, expectedDate, actualDate } = req.body
  if (!amount || !userId) return res.status(400).json({
    'error': 'Missing required fields',
  })
  try {
    const income = await prisma.income.create({
      data: {
        amount,
        userId,
        categoryId,
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

export const getOneIncome = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const income = await prisma.income.findUnique({
      where: { id: String(id) },
      include: { category: true },
    })
    res.json(income)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const getAllIncomes = async (req: Request, res: Response) => {
  try {
    const incomes = await prisma.income.findMany({ include: { category: true } })
    res.json(incomes)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const updateOneIncome = async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, notes, categoryId, expectedDate, actualDate } = req.body
  try {
    const income = await prisma.income.update({
      where: { id: String(id) },
      data: {
        amount,
        userId,
        categoryId,
        notes,
        expectedDate,
        actualDate,
      },
      include: { category: true },
    })
    return res.json(income)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const deleteOneIncome = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.income.delete({ where: { id: String(id) } })
    res.json({ message: 'Income deleted successfully' })
  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong',
      message: {
        error
      }
    })
  }
}
