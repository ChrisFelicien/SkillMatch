import IApplication, { ApplicationStatus } from '@/interfaces/Application';
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema<IApplication>(
  {
    freelancer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the freelancer id'],
    },
    job: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Please provide the job id'],
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Please provide company id'],
    },
    coverLetter: {
      type: String,
      required: [true, 'Please provide the cover letter'],
      trim: true,
    },
    resume: {
      type: String,
      required: [true, 'Please provide the resume'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.PENDING,
      trim: true,
    },
  },
  { timestamps: true },
);

ApplicationSchema.index({ freelancer: 1, index: 1 }, { unique: true });

const Application = mongoose.model<IApplication>(
  'Application',
  ApplicationSchema,
);
export default Application;
