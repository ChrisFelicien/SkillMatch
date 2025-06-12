import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongo");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
