import prisma from "../db";
import { Decimal } from "decimal.js";
import { Request, Response } from "express";

enum BANK_NAMES {
  NATWEST = "NATWEST",
  NATIONWIDE = "NATIONWIDE",
  HALIFAX = "HALIFAX",
  HSBC = "HSBC",
  SANTANDER = "SANTANDER",
  MONZO = "MONZO",
}

interface BankAccountRequest extends Request {
  user?: {
    id: string;
  };
  body: {
    bankName: BANK_NAMES;
    balance: string;
    digits: number;
    name: string;
    color: string;
  };
  params: {
    id?: string;
  };
}

export const getBankAccounts = async (req: BankAccountRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(500).json({ message: "User does not exist" });
  }

  try {
    const accounts = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Bank_Account: true,
      },
    });
    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get bank accounts" });
  }
};

export const getBankAccount = async (req: BankAccountRequest, res: Response) => {
  const userId = req.user?.id;
  const accountId = req.params.id;

  try {
    const account = await prisma.bank_Account.findUnique({
      where: {
        id: accountId,
        userId: userId,
      },
    });
    if (!account) {
      return res.status(404).json({ message: "No account found" });
    }
    res.json(account);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get bank account" });
  }
};

export const createBankAccount = async (req: BankAccountRequest, res: Response) => {
  const { bankName, balance, digits, name, color } = req.body;
  const loggedInUserId = req.user?.id;
  if (!loggedInUserId) {
    return res
      .status(400)
      .json({ message: "User ID is missing or not valid." });
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
    });

    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create bank account" });
  }
};

export const updateBankAccount = async (req: BankAccountRequest, res: Response) => {
  const { bankName, balance, digits, name, color } = req.body;
  const accountId = req.params.id;
  const userId = req.user?.id;

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
    });
    if (!account) {
      res.status(404).json({ message: "Account could not be updated" });
    }
    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update bank account" });
  }
};

export const deleteBankAccount = async (req: BankAccountRequest, res: Response) => {
  const accountId = req.params.id;
  const userId = req.user?.id;

  try {
    const account = await prisma.bank_Account.delete({
      where: {
        id: accountId,
        userId: userId,
      },
    });
    if (!account) {
      res.status(404).json({ message: "Account could not be deleted" });
    }
    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete bank account" });
  }
};

export const totalBalance = async (req: BankAccountRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const accounts = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Bank_Account: true,
      },
    });
    if (!accounts?.Bank_Account) {
      res.status(404).json({ message: "No accounts found" });
    }
    const calculateTotal = accounts?.Bank_Account.reduce(
      (acc, item) => acc.plus(item.balance),
      new Decimal(0)
    );
    res.json(calculateTotal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get bank Accounts" });
  }
};
