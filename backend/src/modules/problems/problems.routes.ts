import { Router } from 'express'
import { getProblems, getProblem, addProblem, getSubmissions } from './problems.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

router.get('/',                          getProblems)
router.get('/:slug',                     getProblem)
router.post('/',        authenticate,    addProblem)
router.get('/:problemId/submissions',    authenticate, getSubmissions)

export default router