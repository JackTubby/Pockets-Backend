/**
 * @description
 * This file defines the routes for the application.
 * It imports the necessary modules and defines the routes for user, income, outgoing, saving, and expenditure.
 * Each route is associated with a handler function that processes the request and response.
 * The router is then exported for use in the main application file.
 */

import { Router } from 'express'
import { createUser } from './routes/user/user.handler'
import {
  createOneIncome,
  getOneIncome,
  getAllIncomes,
  updateOneIncome,
  deleteOneIncome,
} from './routes/income/income.handler'
import {
  createOneOutgoing,
  getOneOutgoing,
  getAllOutgoings,
  updateOneOutgoing,
  deleteOneOutgoing,
} from './routes/outgoing/outgoing.handler'
import {
  createOneSaving,
  getOneSaving,
  getAllSaving,
  updateOneSaving,
  deleteOneSaving,
} from './routes/saving/saving.handler'
import {
  createOneExpenditure,
  getOneExpenditure,
  getAllExpenditures,
  updateOneExpenditure,
  deleteOneExpenditure,
} from './routes/expenditure/expenditure.handler'
import { summary } from './routes/summary/summary.handler'

const router = Router()

/**
 * USER
 */
router.post('/user', createUser)

/**
 * INCOME
 */
router.post('/income', createOneIncome)
router.get('/income/:id', getOneIncome)
router.get('/income', getAllIncomes)
router.put('/income/:id', updateOneIncome)
router.delete('/income/:id', deleteOneIncome)

/**
 * Outgoings
 */
router.post('/outgoing', createOneOutgoing)
router.get('/outgoing/:id', getOneOutgoing)
router.get('/outgoing', getAllOutgoings)
router.put('/outgoing/:id', updateOneOutgoing)
router.delete('/outgoing/:id', deleteOneOutgoing)

/**
 * Saving
 */
router.post('/saving', createOneSaving)
router.get('/saving/:id', getOneSaving)
router.get('/saving', getAllSaving)
router.put('/saving/:id', updateOneSaving)
router.delete('/saving/:id', deleteOneSaving)

/**
 * Expenditure
 */
router.post('/expenditure', createOneExpenditure)
router.get('/expenditure/:id', getOneExpenditure)
router.get('/expenditure', getAllExpenditures)
router.put('/expenditure/:id', updateOneExpenditure)
router.delete('/expenditure/:id', deleteOneExpenditure)

/**
 * Summary
 */
router.get('/summary', summary)

export default router
