import prisma from '../db'
import { Decimal } from 'decimal.js'
import { getAll, getOne } from '../helpers/pockets'
import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'

interface PocketsRequest extends Request {
  user?: {
    id: string;
  };
  body: {
    balance?: string;
    name?: string;
    color?: string;
    icon?: string;
    pocketTransactions?: {
      previousBalance: string;
      balanceAfter: string;
      isDeposit: boolean;
      date?: string;
    }[];
    target?: {
      target: number;
      targetDate: string;
    };
  };
  params: {
    id: string;
  };
}

export const getPockets = async (req: PocketsRequest, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({ message: 'User does not exist' })
  }
  try {
    const result = await getAll(userId)
    if (result.error) {
      return res.status(500).json({ message: 'Failed to get pockets' })
    } else {
      return res.status(200).json(result)
    }
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getPocket = async (req: PocketsRequest, res: Response) => {
  const userId = req.user?.id
  const pocketId = req.params.id
  if (!userId || !pocketId) {
    return res.status(400).json({ message: 'User does not exist or pocket' })
  }

  const result = await getOne(userId, pocketId)
  if (result.error) {
    return res.status(500).json({ message: 'Failed to get pocket' })
  } else {
    return res.json(result)
  }
}

export const createPocket = async (req: PocketsRequest & { user?: { id: string } }, res: Response) => {
  const { balance, name, color, icon, target } = req.body
  const loggedInUserId = req.user?.id
  if (!loggedInUserId) {
    return res.status(400).json({ message: 'User ID is missing or not valid.' })
  }

  try {
    const pocketTransactions = {
      previousBalance: 0,
      balanceAfter: balance !== undefined ? balance : 0,
      isDeposit: true,
    }
    const pocket = await prisma.pocket.create({
      data: {
        balance: balance !== undefined ? new Prisma.Decimal(balance) : new Prisma.Decimal(0),
        name: name !== undefined ? name : 'New Pocket',
        color: color !== undefined ? color : '#000000',
        icon: icon !== undefined ? icon : 'default',
        pocketTransactions: {
          create: pocketTransactions,
        },
        target: {
          create: target,
        },
        userId: loggedInUserId,
      },
    })

    return res.status(200).json(pocket)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to create pocket' })
  }
}

export const updatePocket = async (req: PocketsRequest, res: Response) => {
  const { balance, name, color, icon, target } = req.body;
  const userId = req.user?.id;
  const pocketId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  try {
    const getPocket = await prisma.pocket.findUnique({
      where: {
        id: pocketId,
        userId: userId,
      },
      include: {
        pocketTransactions: true,
        target: true,
      },
    });

    if (!getPocket) {
      return res.status(404).json({ message: 'No pocket found' });
    }

    let newTransactions = undefined;
    if (balance !== undefined && balance !== getPocket.balance.toString()) {
      const newBalance = new Prisma.Decimal(balance);
      const currentBalance = getPocket.balance;
      const isDeposit = newBalance.gt(currentBalance);

      newTransactions = [
        {
          previousBalance: currentBalance,
          balanceAfter: newBalance,
          isDeposit,
        },
      ];
    }

    const updatedPocket = await prisma.pocket.update({
      where: {
        id: pocketId,
      },
      data: {
        balance: balance !== undefined ? new Prisma.Decimal(balance) : getPocket.balance,
        name: name !== undefined ? name : getPocket.name,
        color: color !== undefined ? color : getPocket.color,
        icon: icon !== undefined ? icon : getPocket.icon,
        pocketTransactions: newTransactions
          ? {
              create: newTransactions,
            }
          : undefined,
        target: target
          ? {
              upsert: {
                where: { pocketId },
                create: {
                  target: new Prisma.Decimal(target.target),
                  targetDate: new Date(target.targetDate),
                },
                update: {
                  target: new Prisma.Decimal(target.target),
                  targetDate: new Date(target.targetDate),
                },
              },
            }
          : undefined,
      },
    });

    return res.json(updatedPocket);
  } catch (error) {
    console.error('Error updating pocket:', error);
    return res.status(500).json({ message: 'Failed to update pocket' });
  }
};

export const deletePocket = async (req: PocketsRequest, res: Response) => {
  const pocketId = req.params.id
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({ message: 'User does not exist' })
  }

  try {
    const pocket = await prisma.pocket.delete({
      where: {
        id: pocketId,
        userId: userId,
      },
    })
    if (!pocket) {
      return res.status(404).json({ message: 'Pocket could not be deleted' })
    }
    return res.json(pocket)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to delete pocket' })
  }
}

export const pocketTotalBalance = async (req: PocketsRequest, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({ message: 'User does not exist' })
  }
  try {
    const pockets = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Pocket: true,
      },
    })
    if (!pockets?.Pocket) {
      return res.status(404).json({ message: 'No pocket found' })
    }
    const calculateTotal = pockets?.Pocket.reduce((acc, item) => acc.plus(item.balance), new Decimal(0))
    return res.json(calculateTotal)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to get pocket' })
  }
}
