import prisma from "../db";
import { Request as ExpressRequest, Response } from "express";

interface BankAccountRequestBody extends ExpressRequest {
  user?: {
    id: string;
  };
  bankName: string;
  balance: number;
  lastFourDigits: string;
  accountHolder: string;
  color: string;
}

export const getBankAccounts = (req: any, res: any) => {};

export const getBankAccount = (req: any, res: any) => {};

export const createBankAccount = async (
  req: BankAccountRequestBody,
  res: Response
) => {
  const { bankName, balance, digits, name, color } = req.body;
  const loggedInUserId = req.user?.id;

  if (!loggedInUserId) {
    // Handle the case where userId is undefined
    return res
      .status(400)
      .json({ message: "User ID is missing or not valid." });
  }

  try {
    // Assuming you're using Prisma for database operations
    const account = await prisma.bank_Account.create({
      data: {
        userId: loggedInUserId,
        bankName,
        balance,
        digits,
        name,
        color,
      },
    });

    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create bank account" });
  }
};

export const updateBankAccount = (req: any, res: any) => {};

export const deleteBankAccount = (req: any, res: any) => {};
