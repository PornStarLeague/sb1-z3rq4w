const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
});

let db;

async function createIndexes(db) {
  try {
    await db.collection('movies').createIndex({ title: 1 }, { unique: true });
    await db.collection('movies').createIndex({ releaseDate: 1 });
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

async function connectToDatabase(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      db = client.db('fantasy_movie_league');
      
      await db.command({ ping: 1 });
      console.log("MongoDB connection verified successfully!");
      
      await createIndexes(db);
      return db;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)));
    }
  }
}

async function gracefulShutdown() {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  gracefulShutdown,
  getDb
};