import React from 'react'
import type { FC } from 'react'
import '../styles/DetailedMovie.css'
import movie123 from '../../media/movei323.jpg'
import { useParams } from 'react-router-dom'




const DetailedMovie: FC = () => {
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
                    <div className='movie__body_header'><span> <h1>Movie 1 Lorem, ipsum. </h1></span> <span>year: 2020</span> Directed by <span>Director Name</span></div>
                    <div className="movie__body__section"> <div className="movie__subtitlies"><h2>Lorem, ipsum dolor.</h2></div> <div className="movie__description">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error nemo veritatis libero, corporis repudiandae ducimus sint? Delectus facilis perspiciatis, expedita illo laboriosam odio eius fugiat.</div></div>
                </div>
                <div className="movie__end">
                    <div className="user-activiy-bar">
                        
                    </div>
                    <div className="movie-ratings"></div>
                </div>
            </div>

        </div>
    )
}

export default DetailedMovie