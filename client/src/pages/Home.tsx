import type { FC } from 'react'
import MovieList from '../components/MovieList'
import '../styles/Home.css'

const Home: FC = () => {
  return (
    <main className='home-page'>
      <header className='home-page__header'>
        <h1>Browse Movies</h1>
        <p>Discover films and read what others thought.</p>
      </header>
      <MovieList />
    </main>
  )
}

export default Home
