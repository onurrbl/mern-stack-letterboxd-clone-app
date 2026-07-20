import type { FC } from 'react'
import { useEffect } from 'react'
import './global.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import DetailedMovie from './pages/DetailedMovie'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './pages/Profile'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { useAppDispatch, useAuth } from './redux/hooks'
import { loadUserFromStorage } from './redux/slices/authSlice'
import { fetchFavorites } from './redux/slices/favoriteSlice'

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

const AppRoutes: FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, initialized } = useAuth()

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  useEffect(() => {
    if (initialized && isAuthenticated) {
      dispatch(fetchFavorites())
    }
  }, [dispatch, initialized, isAuthenticated])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route 
          path='/profile' 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        <Route path='/movie' element={<MovieLayout />}>
          <Route index element={<Home />} />
          <Route path=':id' element={<DetailedMovie />} />
        </Route>
      </Route>
    </Routes>
  )
}

const App: FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  )
}

export default App
