import { Document, Types } from 'mongoose';

export enum JobEmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export enum JobExperienceLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
}

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export enum JobLocationType {
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  ONSITE = 'onsite',
}

export interface ISalary {
  min: number;
  max: number;
  currency: string;
}

interface IJob extends Document {
  title: string;
  description: string;
  company: string;
  location: string;
  jobLocationType: JobLocationType;
  employmentType: JobEmploymentType;
  salary: ISalary;
  skills: string[];
  experienceLevel: JobExperienceLevel;
  status: JobStatus;
  client: Types.ObjectId;
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default IJob;
