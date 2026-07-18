import express from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { createReviewValidation, updateReviewValidation } from '../middleware/validations'
import {
  createReview,
  getReviewsByMovie,
  updateReview,
  deleteReview,
} from '../controllers/reviewController'

const router = express.Router()

// /api/reviews
router.get('/movie/:movieId', getReviewsByMovie)
router.post('/', requireAuth, createReviewValidation, createReview)
router.put('/:id', requireAuth, updateReviewValidation, updateReview)
router.delete('/:id', requireAuth, deleteReview)

export default router
