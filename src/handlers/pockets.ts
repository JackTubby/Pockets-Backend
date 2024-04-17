import prisma from "../db";
import { Decimal } from "decimal.js";
import { getAll, getOne } from "../helpers/pockets";
import { Request, Response } from "express";

interface PocketsRequest extends Request {
  user?: {
    id: string;
  };
  body: {
    balance: Decimal;
    name: string;
    color: string;
    icon: string;
    pocketTransactions?: [];
    target?: [];
  };
  params: {
    id?: string;
  };
}

export const getPockets = async (req: PocketsRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "User does not exist" });
  }
  try {
    const result = await getAll(userId);
    if (result.error) {
      return res.status(500).json({ message: "Failed to get pockets" });
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json(error)
  }
};

export const getPocket = async (req: PocketsRequest, res: Response) => {
  const userId = req.user?.id;
  const pocketId = req.params.id;
  if (!userId || !pocketId) {
    return res.status(400).json({ message: "User does not exist or pocket" });
  }

  const result = await getOne(userId, pocketId);
  if (result.error) {
    return res.status(500).json({ message: "Failed to get pocket" });
  } else {
    return res.json(result);
  }
};

export const createPocket = async (req: PocketsRequest, res: Response) => {
  const { balance, name, color, icon, target } = req.body;
  const loggedInUserId = req.user?.id;
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

    return res.status(200).json(pocket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create pocket" });
  }
};

export const updatePocket = async (req: PocketsRequest, res: Response) => {
  const { balance, name, color, icon, target } = req.body;
  const pocketId = req.params.id;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "User does not exist" });
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
      return res.status(404).json({ message: "Pocket could not be updated" });
    }
    return res.json(pocket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update pocket" });
  }
};

export const deletePocket = async (req: PocketsRequest, res: Response) => {
  const pocketId = req.params.id;
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "User does not exist" });
  }

  try {
    const pocket = await prisma.pocket.delete({
      where: {
        id: pocketId,
        userId: userId,
      },
    });
    if (!pocket) {
      return res.status(404).json({ message: "Pocket could not be deleted" });
    }
    return res.json(pocket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete pocket" });
  }
};

export const pocketTotalBalance = async (
  req: PocketsRequest,
  res: Response
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "User does not exist" });
  }
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
      return res.status(404).json({ message: "No pocket found" });
    }
    const calculateTotal = pockets?.Pocket.reduce(
      (acc, item) => acc.plus(item.balance),
      new Decimal(0)
    );
    return res.json(calculateTotal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get pocket" });
  }
};
