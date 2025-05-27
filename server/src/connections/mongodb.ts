import mongoose from 'mongoose';
import { appLogger } from '../services/logger.service';

export function connect(url: string) {
  return mongoose
    .connect(url)
    .then(() => {
      appLogger.info('MongoDB connected successfully');
    })
    .catch((error) => {
      appLogger.error('MongoDB connection error', { error });
      throw error;
    });
}

export function disconnect() {
  return mongoose
    .disconnect()
    .then(() => {
      appLogger.info('MongoDB disconnected successfully');
    })
    .catch((error) => {
      appLogger.error('MongoDB disconnection error', { error });
      throw error;
    });
}

export async function dropDB() {
  await mongoose.connection.dropDatabase();
  appLogger.info('MongoDB database dropped successfully');
  await disconnect();
}
