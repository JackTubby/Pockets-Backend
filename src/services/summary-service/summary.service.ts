/**
 * Summary Service
 * Handles summary logic
 *
 */

import prisma from '../../db'
import { Decimal } from '@prisma/client/runtime/library'

interface ExpenditureIncomeOutgoingSaving {
  amount: number | Decimal
}

interface SummaryData {
  totalExpenditures: number
  totalIncomes: number
  totalOutgoing: number
  totalSavings: number
}

interface SummaryResult extends SummaryData {
  netIncome: number
}

export async function generateSummary(
  userId: string,
  dateFrom: string,
  dateTo: string
): Promise<SummaryResult | false> {
  try {
    const [expenditures, incomes, outgoings, savings] = await Promise.all([
      getExpenditureForUser(userId, dateFrom, dateTo),
      getIncomeForUser(userId, dateFrom, dateTo),
      getOutgoingForUser(userId, dateFrom, dateTo),
      getSavingForUser(userId, dateFrom, dateTo),
    ])

    if (!expenditures || !incomes || !outgoings || !savings) return false

    const totals: SummaryData = {
      totalExpenditures: total(expenditures),
      totalIncomes: total(incomes),
      totalOutgoing: total(outgoings),
      totalSavings: total(savings),
    }
    const netIncome = net(totals)

    const dbRes = await prisma.summary.create({
      data: {
        userId: String(userId),
        income: totals.totalIncomes,
        outgoing: totals.totalOutgoing,
        expenditure: totals.totalExpenditures,
        saving: totals.totalSavings,
        net: netIncome,
        startDate: dateFrom,
        endDate: dateTo,
      },
    })

    if (!dbRes) return false

    return {
      ...totals,
      netIncome,
    }
  } catch (error) {
    console.error('ERROR: ', error)
    return false
  }
}

function total(data: ExpenditureIncomeOutgoingSaving[]): number {
  return data.reduce((total, item) => {
    const amount =
      typeof item.amount === 'object' && 'toNumber' in item.amount ? item.amount.toNumber() : Number(item.amount)
    return total + amount
  }, 0)
}

function net(data: SummaryData): number {
  return data.totalIncomes - (data.totalExpenditures + data.totalOutgoing)
}

async function getExpenditureForUser(
  userId: string,
  dateFrom: string,
  dateTo: string
): Promise<ExpenditureIncomeOutgoingSaving[] | false> {
  try {
    if (!userId) return false

    const response = await prisma.expenditure.findMany({
      where: {
        userId: String(userId),
        actualDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        actualDate: 'asc',
      },
      select: {
        amount: true,
      },
    })

    if (!response.length) return false

    return response as unknown as ExpenditureIncomeOutgoingSaving[]
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}

async function getIncomeForUser(
  userId: string,
  dateFrom: string,
  dateTo: string
): Promise<ExpenditureIncomeOutgoingSaving[] | false> {
  try {
    if (!userId) return false

    const response = await prisma.income.findMany({
      where: {
        userId: String(userId),
        actualDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        actualDate: 'asc',
      },
      select: {
        amount: true,
      },
    })

    if (!response.length) return false

    return response as unknown as ExpenditureIncomeOutgoingSaving[]
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}

async function getOutgoingForUser(
  userId: string,
  dateFrom: string,
  dateTo: string
): Promise<ExpenditureIncomeOutgoingSaving[] | false> {
  try {
    if (!userId) return false

    const response = await prisma.outgoing.findMany({
      where: {
        userId: String(userId),
        actualDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        actualDate: 'asc',
      },
      select: {
        amount: true,
      },
    })

    if (!response.length) return false

    return response as unknown as ExpenditureIncomeOutgoingSaving[]
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}

async function getSavingForUser(
  userId: string,
  dateFrom: string,
  dateTo: string
): Promise<ExpenditureIncomeOutgoingSaving[] | false> {
  try {
    if (!userId) return false

    const response = await prisma.saving.findMany({
      where: {
        userId: String(userId),
        actualDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        actualDate: 'asc',
      },
      select: {
        amount: true,
      },
    })

    if (!response.length) return false

    return response as unknown as ExpenditureIncomeOutgoingSaving[]
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
