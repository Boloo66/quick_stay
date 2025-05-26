import t from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let dbServer;

export const connect = async () => {
  dbServer = await MongoMemoryServer.create();
  const uri = dbServer.getUri();
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    setTimeout(async () => {
      await mongoose.connect(uri);
    }, 1000);
  }
};

export const clearDataBase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const closeDatabase = async () => {
  await clearDataBase();
  await mongoose.connection.close();
  await dbServer.stop();
};

t.before(async () => {
  await connect();
});

t.after(async () => {
  await closeDatabase();
});
