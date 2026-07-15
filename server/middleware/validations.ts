import { body } from 'express-validator'

export const registerValidation = [
  body('name')
    .exists()
    .trim()
    .withMessage('username is required')
    .notEmpty()
    .withMessage('username cannot be blank')
    .isLength({ max: 16 })
    .withMessage('username must be at most 16 characters long')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('username contains invalid characters'),
  body('email')
    .exists()
    .trim()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .exists()
    .trim()
    .withMessage('password is required')
    .notEmpty()
    .withMessage('password cannot be blank')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long')
    .isLength({ max: 50 })
    .withMessage('password must be at most 50 characters long'),
]

export const loginValidation = [
  body('email')
    .exists()
    .trim()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email must be valid'),
  body('password')
    .exists()
    .trim()
    .withMessage('password is required')
    .notEmpty()
    .withMessage('password cannot be blank')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long')
    .isLength({ max: 50 })
    .withMessage('password must be at most 50 characters long'),
]

export const createMovieValidation = [
  body('title')
    .exists()
    .trim()
    .withMessage('title is required')
    .notEmpty()
    .withMessage('title cannot be blank')
    .isLength({ max: 120 })
    .withMessage('title must be at most 120 characters long'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('description must be at most 2000 characters long'),
  body('year')
    .optional({ checkFalsy: true })
    .isInt({ min: 1888, max: 2100 })
    .withMessage('year must be a valid release year'),
  body('rating')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 5 })
    .withMessage('rating must be between 0 and 5'),
  body('thumbnail')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('thumbnail must be a valid URL'),
]

export const reviewMovieValidation = [
  body('rating')
    .exists()
    .withMessage('rating is required')
    .isFloat({ min: 0, max: 5 })
    .withMessage('rating must be between 0 and 5'),
  body('comment')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage('comment must be at most 1000 characters long'),
]
