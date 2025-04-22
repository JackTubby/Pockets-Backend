/**
 * Summary Service
 * Handles summary logic
 *
 */

import prisma from '../../db'


export async function generateSummary(userId: string, dateFrom: string, dateTo: string) {
  try {
    // get information
    const [expenditures, incomes, outgoings, savings] = await Promise.all([
      getExpenditureForUser(userId, dateFrom, dateTo),
      getIncomeForUser(userId, dateFrom, dateTo),
      getOutgoingForUser(userId, dateFrom, dateTo),
      getSavingForUser(userId, dateFrom, dateTo),
    ])
    const totals = {
      totalExpenditures: total(expenditures),
      totalIncomes: total(incomes),
      totalOutgoing: total(outgoings),
      totalSavings: total(savings),
    }
    const netIncome = net(totals)
    // save to db
    const dbRes = await prisma.summary.create({
      data: {
        userId: String(userId),
        income: totals.totalIncomes,
        outgoing: totals.totalIncomes,
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

function total(data: any): number {
  return data.reduce((total: any, item: { amount: any }) => total + Number(item.amount), 0)
}
function net(data: any) {
  return data.totalIncomes - (data.totalExpenditures + data.totalOutgoing)
}

async function getExpenditureForUser(userId: string, dateFrom: string, dateTo: string) {
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
    })
    if (!response.length) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
async function getIncomeForUser(userId: string, dateFrom: string, dateTo: string) {
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
    })
    if (!response.length) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
async function getOutgoingForUser(userId: string, dateFrom: string, dateTo: string) {
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
    })
    if (!response.length) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
async function getSavingForUser(userId: string, dateFrom: string, dateTo: string) {
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
    })
    if (!response.length) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
