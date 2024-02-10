import { Router } from "express";
// import { body, oneOf, validationResult } from "express-validator";

const router = Router();

/**
 * BANK_ACCOUNT
 */

router.get('/bankaccount', (_req, _res) => {})
router.get('/bankaccount/:id', (_req, _res) => {})
router.put('/bankaccount/:id', (_req, _res) => {})
router.post('/bankaccount', (_req, _res) => {})
router.delete('/bankaccount', (_req, _res) => {})

/**
 * Pocket
 */
router.get('/pocket', (_req, _res) => {})
router.get('/pocket/:id', (_req, _res) => {})
router.put('/pocket/:id', (_req, _res) => {})
router.post('/pocket', (_req, _res) => {})
router.delete('/pocket', (_req, _res) => {})

export default router