/**
 * Summary Service
 * Handles summary logic
 *
 */

import prisma from '../../db'

export async function generateSummary(userId: string, date: string) {
  try {
    // get information
    const expenditures = await getExpenditureForUser(userId, date)
    const incomes = await getIncomeForUser(userId, date)
    const outgoings = await getOutgoingForUser(userId, date)
    const savings = await getSavingForUser(userId, date)
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

async function getExpenditureForUser(userId: string, date: string) {
  try {
    if (!userId) return false
    const response = await prisma.expenditure.findMany({
      where: { id: String(userId), actualDate: date },
    })
    if (!response) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
async function getIncomeForUser(userId: string, date: string) {
  try {
    if (!userId) return false
    const response = await prisma.income.findMany({
      where: { id: String(userId), actualDate: date },
    })
    if (!response) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
async function getOutgoingForUser(userId: string, date: string) {
  try {
    if (!userId) return false
    const response = await prisma.outgoing.findMany({
      where: { id: String(userId), actualDate: date },
    })
    if (!response) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
async function getSavingForUser(userId: string, date: string) {
  try {
    if (!userId) return false
    const response = await prisma.saving.findMany({
      where: { id: String(userId), actualDate: date },
    })
    if (!response) return false
    return response
  } catch (error) {
    console.error('ERROR:', error)
    return false
  }
}
