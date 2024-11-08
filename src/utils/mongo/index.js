// /utils/mongo.js
import { MongoClient, ServerApiVersion } from 'mongodb';

const { MONGODB_URI, MONGO_DB } = process.env

if (!MONGODB_URI) {
  throw new Error(
          "Please  define the MONGODB_URI environment variable inside .env.local"
  )
}

if (!MONGO_DB) {
  throw new Error(
          "Please  define the MONGO_DB environment variable inside .env.local"
  )
}

const uri = MONGODB_URI;
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // Return from cache if client and db are already connected
    return { client: cachedClient, db: cachedDb };
  }

  // Create a MongoClient with Stable API options
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client
    await client.connect();

    // Select the database you want to use
    const db = client.db(MONGO_DB);

    // Cache the client and database objects for future requests
    cachedClient = client;
    cachedDb = db;

    console.log("Connected to MongoDB");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("MongoDB connection failed");
  }
}
