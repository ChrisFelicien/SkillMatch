import mongoose from "mongoose";
import bcrypt from "bcrypt";
import IUser, { UserRoles } from "@/interfaces/IUser";
import validator from "validator";
import config from "@/config/env.config";

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "Provide a first name"],
      minlength: [3, "First name must have at least 3 characters"],
      maxLength: [30, "Name cannot exceed 30 characters"]
    },
    lastName: {
      type: String,
      required: [true, "Provide a first name"],
      minlength: [3, "First name must have at least 3 characters"],
      maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email: {
      type: String,
      required: [true, "must have a email"],
      validate: [validator.isEmail, "Please provide valid email"],
      unique: true
    },
    password: {
      type: String,
      minLength: [8, "Password must have at least 8 characters"],
      required: [true, "User must have a password"],
      select: false
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.CLIENT
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// hash password

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt =
    config.NODE_ENV === "test" || config.NODE_ENV === "development" ? 1 : 14;

  this.password = await bcrypt.hash(this.password, salt);

  return;
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
