import { Router } from 'express'
import { submitSolution, runUserCode } from './execution.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

router.post('/run',           authenticate, runUserCode)
router.post('/:slug/submit',  authenticate, submitSolution)

export default router