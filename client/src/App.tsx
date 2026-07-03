import type { FC } from 'react'
import './global.css'
import Navbar from './components/Navbar'
import MovieList from './components/MovieList'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import DetailedMovie from './pages/DetailedMovie'

const Layout: FC = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const MovieLayout: FC = () => {
  return <Outlet />
}

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>.
          <Route path='/' element={<MovieList />} />
          <Route path='/login' element={<div className="page-container"><h1>Login</h1></div>} />
          <Route path='/profile' element={<div className="page-container"><h1>Profile</h1></div>} />

          <Route path='/movie' element={<MovieLayout />}>
            <Route index element={<MovieList />} />
            <Route path=':id' element={<DetailedMovie />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
