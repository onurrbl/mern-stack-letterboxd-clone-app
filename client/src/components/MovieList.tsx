import type { FC } from 'react'
import MovieItem from './MovieItem'

const MovieList: FC = () => {
  return (
    <section>
      <MovieItem />
      <MovieItem />
      <MovieItem />
      <MovieItem />
      <MovieItem />
    </section>
  )
}

export default MovieList
