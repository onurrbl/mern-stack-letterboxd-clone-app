import type { FC } from 'react'
import MovieList from '../components/MovieList'
import '../styles/Home.css'

const Home: FC = () => {
  return (
    <main className='home-page'>
      <section className='home-hero'>
        <div className='home-hero__inner'>
          <h1>Track films you&apos;ve watched. Save those you want to see.</h1>
          <p>Discover movies, share reviews, and build your watchlist.</p>
        </div>
      </section>

      <section className='home-page__content'>
        <h2 className='home-page__section-title'>Popular films</h2>
        <MovieList />
      </section>
    </main>
  )
}

export default Home
