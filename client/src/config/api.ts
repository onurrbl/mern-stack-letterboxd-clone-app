const DEFAULT_API_URL = 'http://localhost:5001'

export const API_URL =
  typeof process !== 'undefined' && process.env.API_URL
    ? process.env.API_URL
    : DEFAULT_API_URL

export const usersApi = `${API_URL}/api/users`
export const moviesApi = `${API_URL}/api/movies`
export const reviewsApi = `${API_URL}/api/reviews`
