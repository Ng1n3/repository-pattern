import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();


const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/userz';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB connected successsfully');
  } catch (error: any) {
    console.error('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
