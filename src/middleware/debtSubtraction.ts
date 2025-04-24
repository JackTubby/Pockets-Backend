import prisma from '../db/index'

export async function subtract(id: string, userId: string) {
  if (!id || !userId) return { ok: false, message: 'require id & user id' }

  const debt = await prisma.debt.findFirst({
    where: { id, userId },
    include: { payments: true },
  })
  if (!debt) return { ok: false, message: 'debt does not exist' }

  const { amount, payments } = debt
  const totalPaid = payments.reduce((acc: any, payment: any) => acc - Number(payment.amount), 0)
  const remaining = Number(amount) - totalPaid
  let status = 'pending'
  if (remaining === 0) {
    status = 'settled'
  } else if (remaining < 0) {
    status = 'overpaid'
  }

  return {
    ok: true,
    data: {
      totalPaid,
      remaining,
      status,
    },
  }
}
