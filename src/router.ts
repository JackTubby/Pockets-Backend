import { Router } from "express";
import { body, oneOf, validationResult } from "express-validator";

const router = Router();


/**
 * BANK_ACCOUNT
 */

router.get('/bankaccount', (req, res) => {})
router.get('/bankaccount/:id', (req, res) => {})
router.put('/bankaccount/:id', (req, res) => {})
router.post('/bankaccount', (req, res) => {})
router.delete('/bankaccount', (req, res) => {})

/**
 * Pocket
 */
router.get('/pocket', (req, res) => {})
router.get('/pocket/:id', (req, res) => {})
router.put('/pocket/:id', (req, res) => {})
router.post('/pocket', (req, res) => {})
router.delete('/pocket', (req, res) => {})