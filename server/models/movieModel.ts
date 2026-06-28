import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IReview extends Document {
  user: Types.ObjectId
  comment?: string
  rating?: number
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comment: { type: String },
    rating: { type: Number, min: 0, max: 5 },
  },
  { timestamps: true }
)

export interface IMovie extends Document {
  title?: string
  categories: string[]
  thumbnail?: string
  rating?: number
  year?: number
  description?: string
  reviews: Types.DocumentArray<IReview>
  createdAt: Date
  updatedAt: Date
}

// Review post-save hook removed because the review document does not contain a direct movie reference.

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
  },
  categories: [{ type: String }],
  thumbnail: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  year: { type: Number },
  description: { type: String },
  reviews: { type: [reviewSchema], default: [] },
})

const Movie = mongoose.model<IMovie>('Movie', movieSchema)

export default Movie
