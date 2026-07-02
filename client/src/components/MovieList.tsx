import type { FC } from 'react'
import MovieItem from './MovieItem'
import '../styles/MovieList.css'
const MovieList: FC = () => {
  return (
    <section className='movie-list__body'>
      <MovieItem />
      <MovieItem />
      <MovieItem />
      <MovieItem />
      <MovieItem />
      <MovieItem />
      <MovieItem />
      <MovieItem />

     
    </section>
  )
}

export default MovieList
