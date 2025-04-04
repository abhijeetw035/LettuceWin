import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

// Define proper interface structure for our cached connection
interface MongooseConnection {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Make sure we have a correct global namespace declaration for mongoose
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Initialize cached with proper type checking
const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

// Set global mongoose if not initialized
if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase(): Promise<mongoose.Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // The connection options have been updated for newer mongoose versions
    // These options are no longer needed as they are the default behavior
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;