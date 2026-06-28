import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500

  res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  })
}

export { errorHandler }