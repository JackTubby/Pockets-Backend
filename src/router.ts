import { Router } from "express";
import {
  getBankAccount,
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  totalBalance,
} from "./handlers/bank_account";
import {
  getPocket,
  getPockets,
  createPocket,
  updatePocket,
  deletePocket,
  pocketTotalBalance,
} from "./handlers/pockets";
import { body, query, oneOf, validationResult } from "express-validator";

const router = Router();

/**
 * BANK_ACCOUNT
 */

router.get("/bankaccount", getBankAccounts);
router.get("/bankaccount/:id", query(), getBankAccount);
router.put("/bankaccount/:id", updateBankAccount);
router.post("/bankaccount", createBankAccount);
router.delete("/bankaccount/:id", deleteBankAccount);

/**
 * Pocket
 */
router.get("/pocket", getPockets);
router.get("/pocket/:id", query(), getPocket);
router.put("/pocket/:id", updatePocket);
router.post("/pocket", createPocket);
router.delete("/pocket/:id", deletePocket);

/**
 * Total
 */
router.get("/totalbalance", totalBalance);
router.get("/pocketotalbalance", pocketTotalBalance);

export default router;
