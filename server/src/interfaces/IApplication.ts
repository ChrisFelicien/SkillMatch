import { Types } from 'mongoose';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERVIEW = 'interview',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdraw',
}

interface IApplication {
  freelancer: Types.ObjectId;
  job: Types.ObjectId;
  company: Types.ObjectId;
  coverLetter: string;
  resume: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplyToJobDTO {
  freelancer: Types.ObjectId;
  job: Types.ObjectId;
  company: Types.ObjectId;
  coverLetter: string;
  resume: string;
  status?: ApplicationStatus;
}

export default IApplication;
