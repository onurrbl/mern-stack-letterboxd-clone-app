import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Movie from '../models/movieModel'
import { sampleMovies } from '../data/sampleMovies'

dotenv.config()

const seedMovies = async () => {
  const mongoUri = process.env.MONGO_URI
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment')
  }

  await mongoose.connect(mongoUri)

  const existingTitles = new Set(
    (await Movie.find({}, 'title')).map((movie) => movie.title.toLowerCase())
  )

  const moviesToInsert = sampleMovies.filter(
    (movie) => !existingTitles.has(movie.title.toLowerCase())
  )

  if (moviesToInsert.length === 0) {
    console.log('All sample movies already exist. Nothing to insert.')
    await mongoose.disconnect()
    return
  }

  await Movie.insertMany(moviesToInsert)

  console.log(`Inserted ${moviesToInsert.length} movies:`)
  moviesToInsert.forEach((movie) => console.log(`- ${movie.title}`))

  await mongoose.disconnect()
}

seedMovies().catch((error) => {
  console.error(error)
  process.exit(1)
})
