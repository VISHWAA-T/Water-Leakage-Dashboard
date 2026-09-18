import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<db_password>')) {
    console.warn('⚠️ MONGODB_URI is using a placeholder password or is not set in server/.env.');
    console.warn('⚠️ Server will operate with in-memory simulation until valid credentials are provided.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.warn('⚠️ Server fallback: running with in-memory simulation mode.');
    return false;
  }
};
