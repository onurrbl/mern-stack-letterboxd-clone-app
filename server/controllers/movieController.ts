import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Movie from '../models/movieModel'
import User from '../models/userModel'

type AuthRequest = Request & { user?: any }

const parseCategories = (value: any): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  return String(value)
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean)
}

// access public
const getMovies = asyncHandler(async (req: Request, res: Response) => {
  const movies = await Movie.find({})
  res.json(movies)
})

// access public
const getMovieById = asyncHandler(async (req: Request, res: Response) => {
  const movie = await Movie.findById(req.params.id)
  if (!movie) {
    res.status(404)
    throw new Error('Movie not found')
  }
  res.json(movie)
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

  if (!user.favoriteMovies.includes(movie._id)) {
    user.favoriteMovies.push(movie._id)
    await user.save()
  }

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    favoriteMovies: user.favoriteMovies,
  })
})

// access private
// admin only
const addMovie = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const result = errors.array({ onlyFirstError: true })
    res.status(422)
    throw new Error(result[0].msg)
  }

  const { title, description, categories, year, rating, thumbnail } = req.body
  const movie = await Movie.create({
    title,
    description,
    categories: parseCategories(categories),
    year,
    rating,
    thumbnail,
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
    thumbnail: movie.thumbnail,
  })
})

export { addMovie, getMovies, getMovieById, addMovieToFavorite }
