const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    this.uri = process.env.MONGODB_URI;
    this.client = null;
    this.db = null;
    this.connecting = false;
    this.connectionPromise = null;
  }

  async connect() {
    if (this.db) {
      return this.db;
    }

    if (this.connecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connecting = true;

    try {
      this.connectionPromise = new Promise(async (resolve, reject) => {
        try {
          console.log('Connecting to MongoDB...');
          
          this.client = new MongoClient(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
            heartbeatFrequencyMS: 30000,
            maxPoolSize: 50,
            minPoolSize: 5,
            retryWrites: true,
            retryReads: true
          });

          await this.client.connect();
          console.log('Successfully connected to MongoDB server');

          this.db = this.client.db('fantasy_movie_league');
          
          // Verify connection
          await this.db.command({ ping: 1 });
          console.log('Database connection verified');

          // Create indexes
          await this.createIndexes();
          
          // Setup graceful shutdown
          process.on('SIGINT', this.gracefulShutdown.bind(this));
          process.on('SIGTERM', this.gracefulShutdown.bind(this));

          resolve(this.db);
        } catch (error) {
          console.error('Failed to connect to MongoDB:', error);
          this.connecting = false;
          this.connectionPromise = null;
          reject(error);
        }
      });

      const db = await this.connectionPromise;
      this.connecting = false;
      return db;
    } catch (error) {
      this.connecting = false;
      this.connectionPromise = null;
      console.error('Database connection error:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      const collections = await this.db.listCollections().toArray();
      
      // Create movies collection if it doesn't exist
      if (!collections.some(col => col.name === 'movies')) {
        await this.db.createCollection('movies');
      }

      // Create indexes
      await this.db.collection('movies').createIndex(
        { title: 1 }, 
        { 
          unique: true, 
          collation: { locale: 'en', strength: 2 },
          background: true
        }
      );
      
      await this.db.collection('movies').createIndex(
        { releaseDate: 1 },
        { background: true }
      );

      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
      throw error;
    }
  }

  async gracefulShutdown() {
    try {
      if (this.client) {
        await this.client.close();
        console.log('MongoDB connection closed');
      }
      process.exit(0);
    } catch (error) {
      console.error('Error during database shutdown:', error);
      process.exit(1);
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }

  async healthCheck() {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }
      
      const startTime = Date.now();
      await this.db.command({ ping: 1 });
      const latency = Date.now() - startTime;
      
      return {
        status: 'connected',
        latency: `${latency}ms`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async isConnected() {
    try {
      await this.db?.command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance
const database = new Database();
module.exports = database;