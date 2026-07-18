import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/authMiddleware'
import { createMovieValidation } from '../middleware/validations'
import {
  addMovie,
  getMovies,
  getMovieById,
  addMovieToFavorite,
} from '../controllers/movieController'

const router = express.Router()

// /api/movies
router.get('/', getMovies)
router.get('/:id', getMovieById)
router.post('/', requireAuth, requireAdmin, createMovieValidation, addMovie)
router.post('/:id/favorite', requireAuth, addMovieToFavorite)

export default router
