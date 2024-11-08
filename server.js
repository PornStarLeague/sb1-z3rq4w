const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const moviesRouter = require('./src/routes/movies');
const eventsRouter = require('./src/routes/admin/events'); // Add events router
const healthRouter = require('./src/routes/health');
const errorHandler = require('./src/middleware/errorHandler');
const corsMiddleware = require('./src/middleware/cors');
const firebaseDB = require('./src/config/firebase');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Initialize Firebase before setting up routes
(async () => {
  try {
    await firebaseDB.initialize();
    console.log('Firebase initialized successfully');
    
    // Routes
    app.use('/api', healthRouter);
    app.use('/api', moviesRouter);
    app.use('/api/admin/events', eventsRouter); // Mount events router

    // Error handling
    app.use(errorHandler);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.url} not found`
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    process.exit(1);
  }
})();