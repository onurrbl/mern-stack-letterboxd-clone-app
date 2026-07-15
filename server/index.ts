import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { errorHandler } from './middleware/errorMiddleware'
import movieRoutes from './routes/movieRoutes'
import userRoutes from './routes/userRoutes'

dotenv.config()

const port = process.env.PORT || '5001'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3001',
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', userRoutes)
app.use('/api/movies', movieRoutes)

app.use(errorHandler)

const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in environment')
}

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(Number(port), () => {
      console.log(`Server running on port ${port}`)
      console.log('MongoDB connected')
    })
  })
  .catch((err) => {
    console.error(err)
  })
