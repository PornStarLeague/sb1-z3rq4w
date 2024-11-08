const firebaseAdmin = require('../config/firebase-admin');

const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    // Get user's custom claims
    const userRecord = await firebaseAdmin.auth().getUser(decodedToken.uid);
    const customClaims = userRecord.customClaims || {};

    if (!customClaims.admin) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...customClaims
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  isAdmin
};