import { Router } from "express";
import {
  getBankAccount,
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from "./handlers/bank_account";
import { body, query, oneOf, validationResult } from "express-validator";

const router = Router();

/**
 * BANK_ACCOUNT
 */

router.get("/bankaccount",  getBankAccounts)
router.get("/bankaccount/:id", query(), getBankAccount);
router.put("/bankaccount/:id", updateBankAccount);
router.post("/bankaccount", createBankAccount)
router.delete("/bankaccount/:id", deleteBankAccount)

/**
 * Pocket
 */
router.get("/pocket", (_req, _res) => {});
router.get("/pocket/:id", (_req, _res) => {});
router.put("/pocket/:id", (_req, _res) => {});
router.post("/pocket", (_req, _res) => {});
router.delete("/pocket/:id", (_req, _res) => {});

export default router;
