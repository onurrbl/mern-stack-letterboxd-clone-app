import type { FC } from 'react'
import '../../styles/StarRating.css'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md'
  showValue?: boolean
  onDark?: boolean
}

const StarRating: FC<StarRatingProps> = ({
  rating,
  max = 5,
  size = 'md',
  showValue = true,
  onDark = false,
}) => {
  const clamped = Math.max(0, Math.min(max, rating))
  const fullStars = Math.floor(clamped)
  const hasHalf = clamped - fullStars >= 0.25 && clamped - fullStars < 0.75
  const roundedUp = clamped - fullStars >= 0.75

  const stars = Array.from({ length: max }, (_, index) => {
    if (index < fullStars || (roundedUp && index === fullStars)) {
      return 'full'
    }
    if (hasHalf && index === fullStars) {
      return 'half'
    }
    return 'empty'
  })

  return (
    <span
      className={`star-rating star-rating--${size} ${onDark ? 'star-rating--on-dark' : ''}`}
      aria-label={`Rating ${clamped.toFixed(1)} out of ${max}`}
    >
      {stars.map((type, index) => (
        <span key={index} className={`star-rating__star star-rating__star--${type}`} aria-hidden='true'>
          ★
        </span>
      ))}
      {showValue && <span className='star-rating__value'>{clamped.toFixed(1)}</span>}
    </span>
  )
}

export default StarRating
