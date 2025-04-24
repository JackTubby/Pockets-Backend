import prisma from '../../db/index'
import { Request, Response } from 'express'

export async function createOnePayment(req: Request, res: Response) {
  const { amount, paymentDate, debtId } = req.body
  const userId = req.user?.id
  if (!amount || !paymentDate || !debtId)
    return res.status(400).json({
      error: 'Missing required fields',
    })

  try {
    const payment = await prisma.payment.create({
      data: {
        amount,
        paymentDate,
        debtId,
        userId: String(userId),
      },
    })
    res.json(payment)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export async function getOnePayment(req: Request, res: Response) {
  const { id } = req.params
  const userId = req.user?.id
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: String(id), userId: String(userId) },
    })
    res.json(payment)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export async function getAllPayment(req: Request, res: Response) {
  try {
    const userId = req.user?.id
    const payments = await prisma.payment.findMany({ where: { userId: String(userId) } })
    res.json(payments)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export async function updateOnePayment(req: Request, res: Response) {
  const { id } = req.params
  const { amount, paymentDate, debtId } = req.body
  const userId = req.user?.id
  try {
    const payment = await prisma.payment.update({
      where: { id: String(id), userId: String(userId) },
      data: {
        amount,
        paymentDate,
        debtId,
      },
    })
    return res.json(payment)
  } catch (error) {
    return res.status(500).json('Something went wrong')
  }
}

export async function deleteOnePayment(req: Request, res: Response) {
  const { id } = req.params
  const userId = req.user?.id
  try {
    await prisma.payment.delete({ where: { id: String(id), userId: String(userId) } })
    res.json({ message: 'payment deleted successfully' })
  } catch (error) {
    return res.status(500).json({
      error: 'Something went wrong',
      message: {
        error,
      },
    })
  }
}
