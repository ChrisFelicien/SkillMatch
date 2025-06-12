import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
      minlength: [3, "Name must have at least 3 characters"],
      maxlength: [50, "Name can not be more than 50 characters"]
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email"],
      required: [true, "Please provide your email"],
      unique: true,
      index: 1
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false
    },
    profileImage: {
      type: String
    },
    skills: {
      type: [String]
    },
    location: {
      country: {
        type: String
      },
      town: {
        type: String
      }
    },
    hobby: {
      type: String
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "freelancer"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    passwordChangedAt: {
      type: Date
    },
    refreshToken: {
      type: String,
      default: false
    },
    lastConnection: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimeStamp > JWTTimestamp;
  }
  return false;
};

export default mongoose.model("User", userSchema);
