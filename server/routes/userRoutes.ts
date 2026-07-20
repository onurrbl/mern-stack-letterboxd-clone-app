import express from 'express'
import { registerUser, loginUser, getMe, getFavoriteMovies } from '../controllers/userController'
import { loginValidation, registerValidation } from '../middleware/validations'
import { requireAuth } from '../middleware/authMiddleware'

const router = express.Router()

// /api/users
router.post('/', registerValidation, registerUser)
router.post('/login', loginValidation, loginUser)
router.get('/me/favorites', requireAuth, getFavoriteMovies)
router.get('/me', requireAuth, getMe)

export default router
