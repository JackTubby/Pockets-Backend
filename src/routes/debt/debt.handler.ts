import prisma from '../../db/index'
import { Request, Response } from 'express'

export async function createOneDebt(req: Request, res: Response) {
  const userId = req.user?.id
  const { description, amount, startDate, dueDate } = req.body
  if (!description || !amount || !startDate || !dueDate)
    return res.status(400).json({
      error: 'Missing required fields',
    })

  try {
    const debt = await prisma.debt.create({
      data: {
        description,
        amount,
        startDate,
        dueDate,
        userId: String(userId),
      },
    })
    res.json(debt)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function getOneDebt(req: Request, res: Response) {
  const { id } = req.params
  const userId = req.user?.id
  try {
    const income = await prisma.debt.findFirst({
      where: { id: String(id), userId: String(userId) },
      include: { payments: true },
    })
    res.json(income)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export async function getAllDebt(req: Request, res: Response) {
  try {
    const userId = req.user?.id
    const incomes = await prisma.debt.findMany({ where: { userId: String(userId) }, include: { payments: true } })
    res.json(incomes)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export async function updateOneDebt(req: Request, res: Response) {
  const { id } = req.params
  const userId = req.user?.id
  const { description, amount, startDate, dueDate } = req.body
  try {
    const income = await prisma.debt.update({
      where: { id: String(id) },
      data: {
        description,
        amount,
        startDate,
        dueDate,
        userId: String(userId),
      },
      include: { payments: true },
    })
    return res.json(income)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export async function deleteOneDebt(req: Request, res: Response) {
  const { id } = req.params
  const userId = req.user?.id
  try {
    await prisma.debt.delete({ where: { id: String(id), userId: String(userId) } })
    res.json({ message: 'Income deleted successfully' })
  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong',
      message: {
        error,
      },
    })
  }
}
