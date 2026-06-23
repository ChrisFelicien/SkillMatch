import mongoose from 'mongoose';
import { UserRoles } from '@/interfaces/IUser';

export interface IJwtPayload {
  userId: mongoose.Types.ObjectId;
  role: UserRoles;
}
