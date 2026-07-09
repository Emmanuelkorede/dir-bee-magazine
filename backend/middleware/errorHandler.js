// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message)

  const status  = err.statusCode || 500
  const message = err.message    || 'Internal server error'

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}


function createError(statusCode, message) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

module.exports = { errorHandler, createError }