const admin = require('firebase-admin');

class FirebaseAdmin {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      if (this.initialized) {
        console.log('Firebase Admin already initialized');
        return this.db;
      }

      const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      if (admin.apps.length === 0) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey
          })
        });

        this.db = admin.firestore();
        this.db.settings({ 
          ignoreUndefinedProperties: true,
          timestampsInSnapshots: true
        });

        await this.healthCheck();
        
        this.initialized = true;
        console.log('Firestore Admin initialized successfully');
      } else {
        this.db = admin.firestore();
        this.initialized = true;
        console.log('Using existing Firestore Admin instance');
      }

      return this.db;
    } catch (error) {
      console.error('Error initializing Firestore Admin:', error);
      throw error;
    }
  }

  async healthCheck() {
    try {
      if (!this.db) {
        throw new Error('Firestore Admin not initialized');
      }

      const startTime = Date.now();
      const healthRef = this.db.collection('health').doc('ping');
      
      await healthRef.set({ 
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        lastCheck: new Date().toISOString()
      });
      
      const doc = await healthRef.get();
      if (!doc.exists) {
        throw new Error('Health check document not found after writing');
      }
      
      const latency = Date.now() - startTime;
      
      return {
        status: 'connected',
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
        lastCheck: doc.data()?.lastCheck
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async isConnected() {
    try {
      if (!this.db) {
        return false;
      }
      const health = await this.healthCheck();
      return health.status === 'connected';
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  getDb() {
    if (!this.db || !this.initialized) {
      throw new Error('Firestore Admin not initialized. Call initialize() first.');
    }
    return this.db;
  }
}

module.exports = new FirebaseAdmin();