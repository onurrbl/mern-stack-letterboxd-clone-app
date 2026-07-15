import type { FC } from 'react'
import { useEffect } from 'react'
import './global.css'
import Navbar from './components/Navbar'
import MovieList from './components/MovieList'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import DetailedMovie from './pages/DetailedMovie'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { useAppDispatch, useAuth } from './redux/hooks'
import { loadUserFromStorage } from './redux/slices/authSlice'

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

const Profile: FC = () => {
  const { user } = useAuth()

  return (
    <div className="page-container">
      <h1>Profile</h1>
      {user && (
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  )
}

const AppRoutes: FC = () => {
  const dispatch = useAppDispatch()

  // Load user from localStorage on app mount
  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<MovieList />} />
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
          <Route index element={<MovieList />} />
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
