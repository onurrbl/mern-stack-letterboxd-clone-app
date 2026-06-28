import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import Movie from '../models/movieModel'
import User from '../models/userModel'

type AuthRequest = Request & { user?: any }

// access public
const getMovies = asyncHandler(async (req: Request, res: Response) => {
  const movies = await Movie.find({})
  res.json(movies)
})

// access private
// require auth
const addMovieToFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const movieId = req.params.id

  const user = await User.findById(req.user?._id)
  if (!user) {
    res.status(400)
    throw new Error('Invalid user data')
  }

  const movie = await Movie.findById(movieId)
  if (!movie) {
    res.status(400)
    throw new Error('Invalid movie data')
  }

  user.favoriteMovies.push(movie._id)
  await user.save()

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    favoriteMovies: user.favoriteMovies,
  })
})

// access private
// require auth
const reviewMovie = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { comment, rating } = req.body
  const movieId = req.params.id

  const movie = await Movie.findById(movieId)
  if (!movie) {
    res.status(400)
    throw new Error('There is no movie with this id')
  }

  const review = {
    user: req.user!._id,
    comment,
    rating,
  }

  movie.reviews.push(review)
  movie.rating =
    movie.reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / movie.reviews.length

  await movie.save()

  res.status(201).json({
    id: movie._id,
    title: movie.title,
    description: movie.description,
    categories: movie.categories,
    year: movie.year,
    rating: movie.rating,
    reviews: movie.reviews,
  })
})

// access private
// admin only
const addMovie = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, categories, year, rating } = req.body
  const movie = await Movie.create({
    title,
    description,
    categories,
    year,
    rating,
  })

  if (!movie) {
    res.status(400)
    throw new Error('Invalid movie data')
  }

  res.status(201).json({
    id: movie._id,
    title: movie.title,
    description: movie.description,
    categories: movie.categories,
    year: movie.year,
    rating: movie.rating,
  })
})

export { addMovie, getMovies, addMovieToFavorite, reviewMovie }