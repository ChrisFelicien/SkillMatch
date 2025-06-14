import mongoose from "mongoose";

const token = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  expireAt: {
    type: Date,
    required: [true, "Please provide a expired date"]
  },
  ip: String,
  userAgent: String
});

export default mongoose.model("RefreshToken", token);
