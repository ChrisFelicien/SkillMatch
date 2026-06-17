import { Document } from "mongoose";

export enum UserRoles {
  ADMIN = "admin",
  CLIENT = "client",
  FREELANCER = "freelancer"
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: UserRoles;

  // methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export default IUser;
