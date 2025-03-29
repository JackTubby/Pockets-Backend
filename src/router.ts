import { Router } from 'express'
import { createUser } from './user/user.handler'
import { createOneIncome, getOneIncome, getAllIncomes, updateOneIncome, deleteOneIncome } from './income/income.handler'

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

export default router
