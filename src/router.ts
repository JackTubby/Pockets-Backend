import { Router } from 'express'
import { createUser } from './user/user.handler'
import { createOneIncome, getOneIncome, getAllIncomes, updateOneIncome, deleteOneIncome } from './income/income.handler'
import { createOneOutgoing, getOneOutgoing, getAllOutgoings, updateOneOutgoing, deleteOneOutgoing } from './outgoing/outgoing.handler'

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

export default router
