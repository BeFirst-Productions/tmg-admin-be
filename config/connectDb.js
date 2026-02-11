import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv()
const MONGO_URI = process.env.MONGO_URL;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
