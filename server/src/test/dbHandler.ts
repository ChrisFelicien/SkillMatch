// db-handler.js
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose"; // Use const { MongoClient } = require('mongodb') if using native driver

let mongod: MongoMemoryServer;

// Connect to the in-memory database
export const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  await mongoose.connect(uri);
};

export const closeDatabase = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};

export const clearDatabase = async () => {
  if (mongod) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      if (collection) await collection.deleteMany();
    }
  }
};
