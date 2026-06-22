import { Router } from 'express'
import { register, login, logout, me } from './auth.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.post('/logout',   logout)
router.get('/me',        authenticate, me)

export default router