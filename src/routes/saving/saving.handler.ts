import prisma from '../../db/index'
import { Request, Response } from 'express'
import ValidationError from '../../errors/ValidationError'

export const createOneSaving = async (req: Request, res: Response) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined
  const { amount, expectedAmount, actualAmount, name, completed, expectedDate, actualDate, categoryId, notes } =
    req.body
  if (!amount || !userId) {
    const validationError = new ValidationError('Missing required fields', [
      { field: 'amount', message: 'Amount is required' },
      { field: 'userId', message: 'User ID is required' },
    ])
    return res.status(400).json({
      message: validationError.message,
      errors: validationError.errors,
    })
  }
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

/**
 * TODO:
 * - If categoryId is missing it will cause an error that a field is missing
 */
