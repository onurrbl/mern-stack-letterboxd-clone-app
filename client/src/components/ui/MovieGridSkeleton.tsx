import type { FC } from 'react'
import '../../styles/MovieGridSkeleton.css'

interface MovieGridSkeletonProps {
  count?: number
}

const MovieGridSkeleton: FC<MovieGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className='movie-grid-skeleton' aria-hidden='true'>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className='movie-grid-skeleton__item'>
          <div className='movie-grid-skeleton__poster' />
          <div className='movie-grid-skeleton__title' />
        </div>
      ))}
    </div>
  )
}

export default MovieGridSkeleton
