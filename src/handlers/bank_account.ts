import prisma from '../db'
import { Decimal } from 'decimal.js'
import { Request, Response } from 'express'

enum BANK_NAMES {
  NATWEST = 'NATWEST',
  NATIONWIDE = 'NATIONWIDE',
  HALIFAX = 'HALIFAX',
  HSBC = 'HSBC',
  SANTANDER = 'SANTANDER',
  MONZO = 'MONZO',
}

interface BankAccountRequest extends Request {
  user?: {
    userId: string
  }
  body: {
    bankName: BANK_NAMES
    balance: string
    digits: string
    name: string
    color: string
  }
  params: {
    id?: string
  }
}

export const getBankAccounts = async (req: BankAccountRequest, res: Response) => {
  const userId = req.user?.userId

  if (!userId) {
    res.status(500).json({ message: 'User does not exist' })
  }

  try {
    const accounts = await prisma.bank_Account.findMany({
      where: {
        userId: userId,
      },
    })
    res.status(200).json(accounts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to get bank accounts' })
  }
}

export const getBankAccount = async (req: BankAccountRequest, res: Response) => {
  const userId = req.user?.userId
  const accountId = req.params.id

  try {
    const account = await prisma.bank_Account.findUnique({
      where: {
        id: accountId,
        userId: userId,
      },
    })
    if (!account) {
      return res.status(404).json({ message: 'No account found' })
    }
    res.json(account)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to get bank account' })
  }
}

export const createBankAccount = async (req: BankAccountRequest, res: Response) => {
  const { bankName, balance, digits, name, color } = req.body
  console.log('req.user', req.user)
  const loggedInUserId = req.user?.userId
  console.log(req.user)
  if (!loggedInUserId) {
    return res.status(400).json({ message: 'User ID is missing or not valid.' })
  }

  try {
    const account = await prisma.bank_Account.create({
      data: {
        bankName,
        balance,
        digits,
        name,
        color,
        userId: loggedInUserId,
      },
    })

    res.status(200).json(account)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create bank account' })
  }
}

export const updateBankAccount = async (req: BankAccountRequest, res: Response) => {
  const { bankName, balance, digits, name, color } = req.body
  const accountId = req.params.id
  const userId = req.user?.userId

  try {
    const account = await prisma.bank_Account.update({
      where: {
        id: accountId,
        userId: userId,
      },
      data: {
        bankName,
        balance,
        digits,
        name,
        color,
      },
    })
    if (!account) {
      res.status(404).json({ message: 'Account could not be updated' })
    }
    res.json(account)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update bank account' })
  }
}

export const deleteBankAccount = async (req: BankAccountRequest, res: Response) => {
  const accountId = req.params.id
  const userId = req.user?.userId

  try {
    const account = await prisma.bank_Account.delete({
      where: {
        id: accountId,
        userId: userId,
      },
    })
    if (!account) {
      res.status(404).json({ message: 'Account could not be deleted' })
    }
    res.json(account)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete bank account' })
  }
}

export const totalBalance = async (req: BankAccountRequest, res: Response) => {
  const userId = req.user?.userId
  console.log('TOTAL BALANCE FUNCTION RUN')
  if (!userId) {
    res.status(500).json({ message: 'User does not exist' })
  }
  try {
    const accounts = await prisma.bank_Account.findMany({
      where: {
        userId,
      },
    })
    const balanceConvertedNumbers = accounts.map((account) => {
      return {
        ...account,
        balance: parseFloat(account.balance),
      }
    })
    // calculate total balance
    const calculateTotal = balanceConvertedNumbers.reduce((acc, item) => acc + item.balance, 0)
    res.status(200).json({ total: calculateTotal })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to get bank Accounts' })
  }
}
