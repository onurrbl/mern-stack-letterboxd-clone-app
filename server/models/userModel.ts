import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  isAdmin: boolean
  favoriteMovies: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favoriteMovies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IUser>('User', userSchema)
