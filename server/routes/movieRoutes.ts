import express from 'express'
import { requireAuth } from '../middleware/authMiddleware'
import { addMovie, getMovies, addMovieToFavorite, reviewMovie } from '../controllers/movieController'

const router = express.Router()

// /api/movies
router.get('/get', getMovies)
router.post('/add/movie', requireAuth, addMovie)
router.post('/:id/add/favorite', requireAuth, addMovieToFavorite)
router.post('/:id/review', requireAuth, reviewMovie)

export default router
