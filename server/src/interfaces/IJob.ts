import { Document, Types } from 'mongoose';

enum JobEmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

enum JobExperienceLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
}

enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  employmentType: JobEmploymentType;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  experienceLevel: JobExperienceLevel;
  status: JobStatus;
  client: Types.ObjectId;
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default IJob;
