const express = require('express');
const firebaseDB = require('../config/firebase');
const router = express.Router();

router.get('/health-check', async (req, res) => {
  try {
    const dbStatus = await firebaseDB.healthCheck();
    const isConnected = await firebaseDB.isConnected();
    
    if (!isConnected) {
      return res.status(503).json({
        status: 'error',
        message: 'Database connection lost',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      status: 'OK',
      message: 'Service is healthy',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      message: 'Service is unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test Firebase connection
router.get('/test-firebase', async (req, res) => {
  try {
    const db = firebaseDB.getDb();
    const testRef = db.collection('test').doc('connection');
    
    // Try to write and read data
    await testRef.set({
      timestamp: new Date().toISOString(),
      message: 'Test connection successful'
    });
    
    const doc = await testRef.get();
    
    if (!doc.exists) {
      throw new Error('Test document not found after writing');
    }
    
    res.json({
      status: 'success',
      message: 'Firebase connection test successful',
      data: doc.data()
    });
  } catch (error) {
    console.error('Firebase test failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Firebase connection test failed',
      error: error.message
    });
  }
});

module.exports = router;