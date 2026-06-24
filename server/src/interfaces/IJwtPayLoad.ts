import mongoose from 'mongoose';
import { UserRoles } from '@/interfaces/IUser';
import { JwtPayload } from 'jsonwebtoken';

export interface IJwtPayload extends JwtPayload {
  userId: mongoose.Types.ObjectId;
  role: UserRoles;
}
