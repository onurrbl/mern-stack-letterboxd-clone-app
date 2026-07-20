const DEFAULT_API_URL = 'http://localhost:5001'

// Injected at build time by Webpack DefinePlugin — do not guard on `typeof process`
const rawApiUrl = process.env.API_URL || DEFAULT_API_URL
export const API_URL = rawApiUrl.replace(/\/$/, '')

export const usersApi = `${API_URL}/api/users`
export const moviesApi = `${API_URL}/api/movies`
export const reviewsApi = `${API_URL}/api/reviews`
