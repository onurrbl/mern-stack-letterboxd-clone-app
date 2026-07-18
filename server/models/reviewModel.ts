import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IReview extends Document {
  user: Types.ObjectId
  movie: Types.ObjectId
  comment?: string
  rating: number
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    movie: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Movie',
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
)

reviewSchema.index({ user: 1, movie: 1 }, { unique: true })

const Review = mongoose.model<IReview>('Review', reviewSchema)

export default Review
