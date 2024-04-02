import prisma from "../db";
import { Decimal } from 'decimal.js'

export const getPockets = async (req: any, res: any) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(500).json({ message: "User does not exist" });
  }

  try {
    const pockets = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Pocket: {
          include: {
            pocketTransactions: true,
            target: true,
          },
        },
      },
    });
    res.status(200).json(pockets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get pockets" });
  }
};

export const getPocket = async (req: any, res: any) => {
  const userId = req.user?.id;
  const pocketId = req.params.id;

  try {
    const pocket = await prisma.pocket.findUnique({
      where: {
        id: pocketId,
        userId: userId,
      },
      include: {
        pocketTransactions: true,
        target: true,
      },
    });
    if (!pocket) {
      return res.status(404).json({ message: "No pocket found" });
    }
    res.json(pocket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get pocket" });
  }
};

export const createPocket = async (req: any, res: any) => {
  const { balance, name, color, icon, pocketTransactions, target } = req.body;
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res
      .status(400)
      .json({ message: "User ID is missing or not valid." });
  }

  try {
    const pocket = await prisma.pocket.create({
      data: {
        balance,
        name,
        color,
        icon,
        pocketTransactions: {
          create: pocketTransactions,
        },
        target: {
          create: target,
        },
        userId: loggedInUserId,
      },
    });

    res.status(200).json(pocket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create pocket" });
  }
};

export const updatePocket = async (req: any, res: any) => {
  const { balance, name, color, icon, pocketTransactions, target } = req.body;
  const pocketId = req.params.id;
  const userId = req.user?.id;

  try {
    const pocket = await prisma.pocket.update({
      where: {
        id: pocketId,
        userId: userId,
      },
      data: {
        balance,
        name,
        color,
        icon,
        pocketTransactions: {
          create: pocketTransactions,
        },
        target: {
          create: target,
        },
      },
    });
    if (!pocket) {
      res.status(404).json({ message: "Pocket could not be updated" });
    }
    res.json(pocket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update pocket" });
  }
};

export const deletePocket = async (req: any, res: any) => {
  const pocketId = req.params.id;
  const userId = req.user?.id;

  try {
    const account = await prisma.pocket.delete({
      where: {
        id: pocketId,
        userId: userId,
      },
    });
    if (!account) {
      res.status(404).json({ message: "Pocket could not be deleted" });
    }
    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete pocket" });
  }
};

export const pocketTotalBalance = async (req: any, res: any) => {
  const userId = req.user?.id;
  try {
    const pockets = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Pocket: true,
      },
    });
    if (!pockets?.Pocket) {
      res.status(404).json({ message: "No pocket found" });
    }
    const calculateTotal = pockets?.Pocket.reduce(
      (acc, item) => acc.plus(item.balance),
      new Decimal(0)
    );
    res.json(calculateTotal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get pocket" });
  }
};
