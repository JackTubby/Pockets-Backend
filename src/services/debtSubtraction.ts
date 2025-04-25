import prisma from '../db/index'

export async function subtract(id: string, userId: string) {
  if (!id || !userId) return { ok: false, message: 'require id & user id' }

  try {
    const debt = await prisma.debt.findFirst({
      where: { id, userId },
      include: { payments: true },
    })
    if (!debt) return { ok: false, message: 'debt does not exist' }

    const { amount, payments } = debt
    const paid = payments.reduce((acc: any, payment: any) => acc + Number(payment.amount), 0)
    const remaining = Number(amount) - paid
    let status = 'pending'
    if (remaining === 0) {
      status = 'settled'
    } else if (remaining < 0) {
      status = 'overpaid'
    }
    await prisma.debt.update({
      where: { id, userId },
      data: {
        status,
        paid,
        remaining,
      },
    })
    return {
      ok: true,
      data: {
        paid,
        remaining,
        status,
      },
    }
  } catch (error) {
    return {
      ok: false,
      message: 'Error on debt subtraction',
      error,
    }
  }
}
