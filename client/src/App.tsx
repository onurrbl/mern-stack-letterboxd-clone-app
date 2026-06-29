import type { FC } from 'react'
import './global.css'
import Navbar from './components/Navbar'
import MovieList from './components/MovieList'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App: FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<MovieList />} />
        <Route path='/login' element={<div>Login</div>} />
        <Route path='/profile' element={<div>Profile</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
