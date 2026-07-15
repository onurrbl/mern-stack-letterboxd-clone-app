import express from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { createMovieValidation, reviewMovieValidation } from '../middleware/validations'
import {
  addMovie,
  getMovies,
  getMovieById,
  addMovieToFavorite,
  reviewMovie,
} from '../controllers/movieController'

const router = express.Router()

// /api/movies
router.get('/', getMovies)
router.get('/:id', getMovieById)
router.post('/', requireAuth, createMovieValidation, addMovie)
router.post('/:id/favorite', requireAuth, addMovieToFavorite)
router.post('/:id/review', requireAuth, reviewMovieValidation, reviewMovie)

export default router
