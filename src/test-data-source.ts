import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const TEST_DB_URI = process.env.TEST_DB_URI || 'mongodb://localhost:27017/userz-test';


export const testConnectMongoDB = {
  initialize: async () => {
    await mongoose.connect(TEST_DB_URI);
    console.log('Test MongoDB connected successfully');
  },
  
  destroy: async () => {
    await mongoose.connection.close();
    console.log('Test MongoDB connection closed');
  },
  
  getRepository: (model: any) => {
    return {
      clear: async () => {
        await model.deleteMany({});
      }
    };
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
