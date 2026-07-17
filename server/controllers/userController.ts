import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel'
import bcrypt from 'bcryptjs'
import { validationResult } from 'express-validator'

type AuthRequest = Request & { user?: any }

const isAdminEmail = (email: string) =>
  process.env.ADMIN_EMAIL?.toLowerCase() === email.toLowerCase()

// Register User
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const result = errors.array({ onlyFirstError: true })
    console.log(result[0].msg)
    res.status(422)
    throw new Error(result[0].msg)
  }

  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: isAdminEmail(email),
  })

  if (!user) {
    res.status(400)
    throw new Error('Invalid user data')
  }

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  })
})

// Login User
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const result = errors.array({ onlyFirstError: true })
    res.status(422)
    throw new Error(result[0].msg)
  }

  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error('Could not find a user')
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// getMe
const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json(req.user)
})

// Generate Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || '', {
    expiresIn: '30d',
  })
}

export { registerUser, loginUser, getMe }
