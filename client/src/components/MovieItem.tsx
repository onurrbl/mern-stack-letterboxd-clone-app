import type { FC } from 'react'
import '../styles/MovieItem.css'
import movie1 from '../../media/movie1.jpeg'
import movie123 from '../../media/movei323.jpg'
const MovieItem: FC = () => {
  return <div className="movie-item">
        <div><img className="movie-item__image" src={movie123} alt="Movie 1" /></div>
        <div className="movie-item__name">Movie 1</div>
  </div>
}

export default MovieItem
