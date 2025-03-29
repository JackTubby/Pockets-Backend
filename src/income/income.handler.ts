import prisma from '../db'
import { Request, Response } from 'express'

export const createOneIncome = async (req: Request, res: Response) => {
  const { amount, notes, userId, categoryId, expectedDate, actualDate } = req.body
  if (!amount) return res.status(400).json('Missing required fields')
  try {
    const income = await prisma.income.create({
      data: {
        amount,
        user: userId,
        category: categoryId,
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
      include: { user: true, category: true },
    })
    res.json(income)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const getAllIncomes = async (req: Request, res: Response) => {
  try {
    const incomes = await prisma.income.findMany({ include: { user: true, category: true } })
    res.json(incomes)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const updateOneIncome = async (req: Request, res: Response) => {
  const { id } = req.params
  const { amount, description, date, userId, categoryId } = req.body
  try {
    const income = await prisma.income.update({
      where: { id: String(id) },
      data: {
        amount,
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
      },
    })
    res.json(income)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export const deleteOneIncome = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.income.delete({ where: { id: String(id) } })
    res.json('Income deleted')
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}
