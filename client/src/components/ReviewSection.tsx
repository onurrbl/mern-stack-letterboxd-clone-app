import type { FC, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useAppDispatch, useReviews } from '../redux/hooks'
import { fetchMovieById } from '../redux/slices/movieSlice'
import {
  fetchReviewsByMovie,
  createReview,
  updateReview,
  clearReviews,
  clearSubmitError,
  type Review,
} from '../redux/slices/reviewSlice'

interface ReviewSectionProps {
  movieId: string
}

const getReviewUserId = (review: Review) =>
  typeof review.user === 'string' ? review.user : review.user._id

const getReviewUserName = (review: Review) =>
  typeof review.user === 'string' ? 'User' : review.user.name

const ReviewSection: FC<ReviewSectionProps> = ({ movieId }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAuth()
  const { reviews, loading, error, submitLoading, submitError } = useReviews()

  const userReview = reviews.find((review) => getReviewUserId(review) === user?._id)

  const [rating, setRating] = useState('4')
  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(fetchReviewsByMovie(movieId))

    return () => {
      dispatch(clearReviews())
    }
  }, [dispatch, movieId])

  useEffect(() => {
    if (userReview) {
      setRating(String(userReview.rating))
      setComment(userReview.comment || '')
    }
  }, [userReview])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    dispatch(clearSubmitError())

    const numericRating = Number(rating)
    const payload = {
      rating: numericRating,
      comment: comment.trim() || undefined,
    }

    const result = userReview
      ? await dispatch(updateReview({ id: userReview._id, ...payload }))
      : await dispatch(createReview({ movie: movieId, ...payload }))

    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchReviewsByMovie(movieId))
      dispatch(fetchMovieById(movieId))
    }
  }

  return (
    <section className='reviews-section'>
      <h2 className='reviews-section__title'>Reviews</h2>

      {isAuthenticated ? (
        <form className='review-form' onSubmit={handleSubmit}>
          <h3>{userReview ? 'Update your review' : 'Write a review'}</h3>

          <div className='review-form__field'>
            <label htmlFor='rating'>Rating</label>
            <select
              id='rating'
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} ★
                </option>
              ))}
            </select>
          </div>

          <div className='review-form__field'>
            <label htmlFor='comment'>Comment</label>
            <textarea
              id='comment'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share your thoughts...'
              rows={4}
            />
          </div>

          {submitError && <p className='review-form__error'>{submitError}</p>}

          <button type='submit' disabled={submitLoading} className='review-form__submit'>
            {submitLoading ? 'Saving...' : userReview ? 'Update review' : 'Submit review'}
          </button>
        </form>
      ) : (
        <p className='reviews-section__login-prompt'>
          <Link to='/login'>Log in</Link> to rate and review this movie.
        </p>
      )}

      {loading && <p className='reviews-section__status'>Loading reviews...</p>}
      {error && <p className='reviews-section__error'>{error}</p>}

      {!loading && !error && (
        <ul className='reviews-list'>
          {reviews.length === 0 ? (
            <li className='reviews-list__empty'>No reviews yet. Be the first!</li>
          ) : (
            reviews.map((review) => (
              <li key={review._id} className='reviews-list__item'>
                <div className='reviews-list__header'>
                  <strong>{getReviewUserName(review)}</strong>
                  <span>{review.rating.toFixed(1)} ★</span>
                </div>
                {review.comment && <p className='reviews-list__comment'>{review.comment}</p>}
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  )
}

export default ReviewSection
