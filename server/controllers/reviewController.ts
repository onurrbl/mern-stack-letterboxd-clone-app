import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import Review from '../models/reviewModel'
import Movie from '../models/movieModel'

type AuthRequest = Request & { user?: { _id: string } }

const updateMovieAverageRating = async (movieId: string) => {
  const reviews = await Review.find({ movie: movieId })
  const rating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  await Movie.findByIdAndUpdate(movieId, { rating })
}

const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const result = errors.array({ onlyFirstError: true })
    res.status(422)
    throw new Error(result[0].msg)
  }

  const { movie, comment, rating } = req.body

  const movieExists = await Movie.findById(movie)
  if (!movieExists) {
    res.status(404)
    throw new Error('Movie not found')
  }

  const existingReview = await Review.findOne({
    user: req.user!._id,
    movie,
  })

  if (existingReview) {
    res.status(400)
    throw new Error('You have already reviewed this movie')
  }

  const review = await Review.create({
    user: req.user!._id,
    movie,
    comment,
    rating,
  })

  await updateMovieAverageRating(movie)

  const populatedReview = await Review.findById(review._id).populate('user', 'name')

  res.status(201).json(populatedReview)
})

const getReviewsByMovie = asyncHandler(async (req: Request, res: Response) => {
  const { movieId } = req.params

  const movie = await Movie.findById(movieId)
  if (!movie) {
    res.status(404)
    throw new Error('Movie not found')
  }

  const reviews = await Review.find({ movie: movieId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })

  res.json(reviews)
})

const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const result = errors.array({ onlyFirstError: true })
    res.status(422)
    throw new Error(result[0].msg)
  }

  const review = await Review.findById(req.params.id)
  if (!review) {
    res.status(404)
    throw new Error('Review not found')
  }

  if (review.user.toString() !== req.user!._id.toString()) {
    res.status(403)
    throw new Error('Not authorized to update this review')
  }

  const { comment, rating } = req.body

  if (comment !== undefined) {
    review.comment = comment
  }

  if (rating !== undefined) {
    review.rating = rating
  }

  await review.save()
  await updateMovieAverageRating(review.movie.toString())

  const populatedReview = await Review.findById(review._id).populate('user', 'name')

  res.json(populatedReview)
})

const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    res.status(404)
    throw new Error('Review not found')
  }

  if (review.user.toString() !== req.user!._id.toString()) {
    res.status(403)
    throw new Error('Not authorized to delete this review')
  }

  const movieId = review.movie.toString()
  await review.deleteOne()
  await updateMovieAverageRating(movieId)

  res.json({ message: 'Review removed', id: req.params.id })
})

export { createReview, getReviewsByMovie, updateReview, deleteReview }
