import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export async function connect() {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    const url = process.env.MONGO_URI; // Ensure your environment variable is set correctly
    if (!url) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Connect to MongoDB with proper error handling
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Optional but recommended to avoid warnings
    });

    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MONGODB connected successfully');
      isConnected = true; // Mark as connected after successful connection
    });

    connection.on('error', (err) => {
      console.log('Connection error, ensure MongoDB is working: ' + err);
      process.exit(1); // Exit the process on connection error
    });

  } catch (error) {
    console.error('Something went wrong while connecting to MongoDB:', error);
    throw error; // Rethrow the error for further handling
  }
}
