import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Avoid buffering in serverless environment
    }).then((mongoose) => {
      const connection = mongoose.connection;

      connection.on('connected', () => {
        console.log('MONGODB connected successfully');
      });

      connection.on('error', (err) => {
        console.log('Connection error: ' + err);
        process.exit(1);
      });

      return mongoose;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}
