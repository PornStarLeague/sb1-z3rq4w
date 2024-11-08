const errorHandler = (err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    name: err.name,
    timestamp: new Date().toISOString()
  });

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'A movie with this title already exists'
    });
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
    return res.status(503).json({
      status: 'error',
      message: 'Database connection error. Please try again later.'
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data provided',
      details: err.errors
    });
  }

  // Default error response
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred. Please try again.'
  });
};

module.exports = errorHandler;