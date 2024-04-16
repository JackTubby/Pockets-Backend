import prisma from "../db";
import { Decimal } from "decimal.js";
import { getAll, getOne } from "../helpers/pockets";
import { Request, Response } from "express";

interface CustomRequest extends Request {
  body: {
    balance: number;
    name: string;
    color: string;
    icon: string;
    pocketTransactions: {
      previousBalance: number;
      balanceAfter: number;
      isDeposit: boolean;
    };
    target: [];
  };
  user: {
    id: string;
  };
}

export const getPockets = async (req: CustomRequest, res: Response) => {
  const userId = req.user.id;

  const result = await getAll(userId);
  if (result.error) {
    res.status(500).json({ message: "Failed to get pockets" });
  } else {
    res.status(200).json(result);
  }
};

export const getPocket = async (req: CustomRequest, res: Response) => {
  const userId = req.user.id;
  const pocketId = req.params.id;

  const result = await getOne(userId, pocketId);
  if (result.error) {
    return res.status(500).json({ message: "Failed to get pocket" });
  } else {
    res.json(result);
  }
};

export const createPocket = async (req: CustomRequest, res: Response) => {
  const { balance, name, color, icon, target } = req.body;
  const loggedInUserId = req.user.id;
  if (!loggedInUserId) {
    return res
      .status(400)
      .json({ message: "User ID is missing or not valid." });
  }

  try {
    const pocketTransactions = {
      previousBalance: 0,
      balanceAfter: balance,
      isDeposit: true,
    };
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

export const updatePocket = async (req: CustomRequest, res: Response) => {
  const { balance, name, color, icon, target } = req.body;
  const pocketId = req.params.id;
  const userId = req.user.id;

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
      return res.status(404).json({ message: "No pocket found" });
    }
    let pocketTransactions;
    if (balance) {
      let isDeposit;
      balance < getPocket.balance ? (isDeposit = false) : (isDeposit = true);
      pocketTransactions = {
        previousBalance: getPocket.balance,
        balanceAfter: balance,
        isDeposit,
      };
    }

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

export const deletePocket = async (req: CustomRequest, res: Response) => {
  const pocketId = req.params.id;
  const userId = req.user.id;

  try {
    const pocket = await prisma.pocket.delete({
      where: {
        id: pocketId,
        userId: userId,
      },
    });
    if (!pocket) {
      res.status(404).json({ message: "Pocket could not be deleted" });
    }
    res.json(pocket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete pocket" });
  }
};

export const pocketTotalBalance = async (req: CustomRequest, res: Response) => {
  const userId = req.user.id;
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
