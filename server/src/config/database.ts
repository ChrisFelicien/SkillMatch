import mongoose from 'mongoose';
import config from '@/config/env.config';

const connectDatabase = async () => {
  try {
    const connect = await mongoose.connect(config.MONGO_URI);
    console.log(connect.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDatabase;
