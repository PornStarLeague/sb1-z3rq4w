const express = require('express');
const firebaseAdmin = require('../config/firebase-admin');
const router = express.Router();

// Validate movie data middleware
const validateMovieData = (req, res, next) => {
  try {
    const { title, studio, releaseDate, performers } = req.body;
    console.log('Validating movie data:', { title, studio, releaseDate, performers });

    if (!title?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Movie title is required'
      });
    }

    if (!studio?.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Studio name is required'
      });
    }

    if (!releaseDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Release date is required'
      });
    }

    if (!Array.isArray(performers) || performers.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one performer is required'
      });
    }

    const validPerformers = performers.every(p => 
      p && typeof p === 'object' &&
      p.name?.trim() && 
      ['Male', 'Female'].includes(p.gender)
    );

    if (!validPerformers) {
      return res.status(400).json({
        status: 'error',
        message: 'Each performer must have a name and valid gender (Male or Female)'
      });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request data',
      details: error.message
    });
  }
};

// Submit new movie
router.post('/movies', validateMovieData, async (req, res) => {
  try {
    console.log('Submitting new movie, request body:', req.body);
    const db = firebaseAdmin.getDb();
    const { title, studio, releaseDate, performers } = req.body;

    // Check for duplicate title
    const moviesRef = db.collection('movies');
    const snapshot = await moviesRef
      .where('title', '==', title.trim())
      .get();

    if (!snapshot.empty) {
      console.log('Duplicate movie title found:', title);
      return res.status(409).json({
        status: 'error',
        message: 'A movie with this title already exists'
      });
    }

    const movie = {
      title: title.trim(),
      studio: studio.trim(),
      releaseDate,
      performers: performers.filter(p => p.name.trim() && p.gender),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating new movie document:', movie);
    const docRef = await moviesRef.add(movie);
    console.log('Movie document created with ID:', docRef.id);

    res.status(201).json({
      status: 'success',
      data: {
        _id: docRef.id,
        ...movie
      }
    });
  } catch (error) {
    console.error('Error submitting movie:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit movie. Please try again.',
      details: error.message
    });
  }
});

// Add scenes to movie
router.post('/movies/:movieId/scenes', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { scenes } = req.body;
    console.log('Adding scenes to movie:', movieId, scenes);

    if (!movieId) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid movie ID'
      });
    }

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one scene is required'
      });
    }

    const db = firebaseAdmin.getDb();
    const movieRef = db.collection('movies').doc(movieId);
    
    const movie = await movieRef.get();
    if (!movie.exists) {
      console.log('Movie not found:', movieId);
      return res.status(404).json({
        status: 'error',
        message: 'Movie not found'
      });
    }

    console.log('Updating movie with new scenes');
    await movieRef.update({
      scenes: [...(movie.data().scenes || []), ...scenes],
      updatedAt: new Date().toISOString()
    });

    res.json({
      status: 'success',
      message: 'Scenes added successfully'
    });
  } catch (error) {
    console.error('Error adding scenes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add scenes. Please try again.',
      details: error.message
    });
  }
});

module.exports = router;