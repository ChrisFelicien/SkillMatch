import { Types } from 'mongoose';

export enum CompanyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface ICompany {
  owner: Types.ObjectId;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  members: Types.ObjectId[];
  status: CompanyStatus;

  createdAt: Date;
  updatedAt: Date;
}
