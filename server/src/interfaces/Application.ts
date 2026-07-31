import { Types } from 'mongoose';

enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERVIEW = 'interview',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

interface Application {
  freelancer: Types.ObjectId;
  job: Types.ObjectId;
  company: Types.ObjectId;
  coverLetter: string;
  resume: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default Application;
