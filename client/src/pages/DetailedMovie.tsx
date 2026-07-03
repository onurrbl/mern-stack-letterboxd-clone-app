import React from 'react'
import type { FC } from 'react'
import '../styles/DetailedMovie.css'
import movie123 from '../../media/movei323.jpg'
import { useParams } from 'react-router-dom'




const DetailedMovie : FC = () => {
  let params = useParams();
  const movieId = params.id; // Access the movie ID from the URL parameters

    return (
        <div className="detailed-movie">

            <div className="page__body">

                <div className="movie_thumbnail">
                    <div className="movie-item">
                        <div><img className="movie-item__image" src={movie123} alt="Movie 1" /></div>
                        <div className="movie-item__name">Movie 1</div>
                    </div>
                </div>
                <div className="movie__body">

                </div>
                <div className="movie__end">

                </div>
            </div>

        </div>
    )
}

export default DetailedMovie