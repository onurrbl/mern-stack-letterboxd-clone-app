import mongoose, { Document, Schema } from 'mongoose'

export interface IMovie extends Document {
  title: string
  categories: string[]
  thumbnail?: string
  rating: number
  year?: number
  description?: string
  createdAt: Date
  updatedAt: Date
}

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    categories: {
      type: [{ type: String }],
      default: [],
    },
    thumbnail: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    year: { type: Number },
    description: { type: String },
  },
  {
    timestamps: true,
  }
)

const Movie = mongoose.model<IMovie>('Movie', movieSchema)

export default Movie
