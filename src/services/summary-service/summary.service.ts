/**
 * Summary Service
 * Handles summary logic
 *
 */

import prisma from '../../db'

export async function generateSummary(userId: string, dateFrom: string, dateTo: string) {
  try {
    // get information
    const expenditures = await getExpenditureForUser(userId, dateFrom, dateTo)
    const incomes = await getIncomeForUser(userId, dateFrom, dateTo)
    const outgoings = await getOutgoingForUser(userId, dateFrom, dateTo)
    const savings = await getSavingForUser(userId, dateFrom, dateTo)
    console.log('explog: ', expenditures)
    console.log('inclog', incomes)
    console.log('outlog', outgoings)
    console.log('savlog', savings)
    // transform
    // calculate
    // save to db
  } catch (error) {
    console.error('ERROR: ', error)
    return false
  }
}

async function getExpenditureForUser(userId: string, dateFrom: string, dateTo: string) {
  try {
    if (!userId) return false
    const response = await prisma.expenditure.findMany({
      where: {
        userId: String(userId),
        expectedDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        expectedDate: 'asc',
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
        expectedDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        expectedDate: 'asc',
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
        expectedDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        expectedDate: 'asc',
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
        expectedDate: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: {
        expectedDate: 'asc',
      },
    })
    if (!response.length) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
