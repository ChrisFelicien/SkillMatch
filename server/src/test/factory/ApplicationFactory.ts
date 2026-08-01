import IApplication, { ApplicationStatus } from '@/interfaces/Application';
import mongoose from 'mongoose';

const applicationFactory = (override?: Partial<IApplication>) => ({
  freelancer: new mongoose.Types.ObjectId(),
  job: new mongoose.Types.ObjectId(),
  company: new mongoose.Types.ObjectId(),
  coverLetter: 'the freelancer cover letter',
  resume: 'The freelancer resume',
  status: ApplicationStatus.PENDING,
  ...override,
});

export default applicationFactory;
